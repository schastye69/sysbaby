// key/drag.js — WP1. Turning the Key by hand, and the group-orientation channels other WPs drive (SPEC §3.5 click
// classification, §3.9, §10.3; SPEC-ADDENDUM A3.3 yawTo / isShowingBack; ARCH §3.18.1 addYaw, bow, nudgePitch).
//   tap        on a stratum or the nucleus → key:click {index, x, y}; holds and drags are never clicks
//   touch-down the Key presses to 0.96 for 90 ms and the touched stratum's primary edges flash for one frame
//   horizontal yaw follows the finger (1 rad per projected Key radius), inertia ×0.92 / 16.7 ms, ±180°;
//              2,000 ms after release it springs back to the drift (heavy)
//   vertical   pitch resists: shown = 30°·tanh(0.35·raw / 30°); raw past 110° → key:flip {dir} and the Key turns right
//              over (a full turn on the heavy spring); below 110° the release springs back with a 2 % overshoot
//   yawTo      programmatic yaw (КОДЕКС 180°, ПОКАЗ), heavy spring sized to `ms`; ignored for the drag's duration
import { Spring, SPRING } from '../core/spring.js';
import { after } from '../core/clock.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { ENV } from '../core/env.js';
import { KEY, MOTION } from '../core/tokens.js';

const DEG = Math.PI / 180;
const PI = Math.PI;
const zetaFor = (os) => -Math.log(os) / Math.sqrt(PI * PI + Math.log(os) ** 2);
const PITCH_GAIN = (110 / 330) * DEG;                       // raw pitch per px: 110° at 330 px of vertical drag
/** Critically damped spring from `a` (at rest) toward `b`, τ s after release, natural frequency w. */
const critical = (a, b, w, tau) => b + (a - b) * (1 + w * tau) * Math.exp(-w * tau);

export function createDrag(K) {
  const D = { yaw: 0, pitch: 0, press: 1 };
  const yawS = Spring.from(SPRING.heavy), spinS = Spring.from(SPRING.heavy);
  const ret = { from: 0, t0: -1 }, prog = { from: 0, to: 0, w: 6, t0: -1 };
  D.prog = 0;
  const pitchS = new Spring(9, zetaFor(MOTION.settleOvershoot), 0);
  let downIdx = -1, axis = 0, yaw0 = 0, vel = 0, releasedAt = -1, flipped = false, pressAt = -1e9, now = 0;
  let spinAt = -1e9, backSince = -1, flipTurn = 0;
  const g0 = { x: 0, y: 0 };

  function clampYaw(v) { return Math.max(-KEY.yawMaxDeg * DEG, Math.min(KEY.yawMaxDeg * DEG, v)); }

  D.onGesture = function onGesture(g, rPx) {
    switch (g.type) {
      case 'down': {
        downIdx = K.canTouch() ? K.pick(g.x, g.y) : -1;
        if (downIdx < 0) return false;
        g0.x = g.x; g0.y = g.y;
        if (g.pointerType === 'touch') { pressAt = now; K.flashEdges(downIdx, 'white', 1); }
        return true;
      }
      case 'tap': {
        const i = downIdx >= 0 ? downIdx : (K.canTouch() ? K.pick(g.x, g.y) : -1);
        downIdx = -1;
        if (i < 0 || !K.interactive) return false;
        bus.emit('key:click', { index: i, x: g.x, y: g.y });
        return true;
      }
      case 'dragstart': {
        if (downIdx < 0 && !g.afterHold && K.canTouch()) downIdx = K.pick(g.x - g.tx, g.y - g.ty);   // a hall may keep the 'down'
        if (downIdx < 0 || g.afterHold || !K.interactive) { downIdx = -1; return false; }
        axis = Math.abs(g.tx) >= Math.abs(g.ty) ? 1 : 2;
        K.dragging = true; flipped = false;
        yaw0 = yawS.x; vel = 0; releasedAt = -1; ret.t0 = -1;
        return true;
      }
      case 'drag': {
        if (!K.dragging) return false;
        if (axis === 1) {
          const prev = yawS.x;
          yawS.snap(clampYaw(yaw0 + g.tx / Math.max(40, rPx)));
          vel = yawS.x - prev;
        } else if (!flipped) {
          const raw = g.ty * PITCH_GAIN;
          if (Math.abs(raw) >= KEY.pitchFlipDeg * DEG) {
            flipped = true;
            bus.emit('key:flip', { dir: raw > 0 ? 'over' : 'back' });
            flipTurn = raw > 0 ? 2 * PI : -2 * PI;
            pitchS.omega = SPRING.heavy.omega; pitchS.zeta = 1;
            pitchS.target = flipTurn;
          } else {
            const m = KEY.pitchResistMaxDeg * DEG;
            pitchS.snap(m * Math.tanh((KEY.pitchResist * raw) / m));
          }
        }
        return true;
      }
      case 'dragend': case 'cancel': {
        downIdx = -1;
        if (!K.dragging) return false;
        K.dragging = false;
        if (axis === 1) {
          releasedAt = now;
          vel = g.type === 'cancel' ? 0 : (g.vx * 16.7) / Math.max(40, rPx);     // px/ms → rad per 16.7 ms frame
        } else if (!flipped) {
          pitchS.omega = 9; pitchS.zeta = zetaFor(MOTION.settleOvershoot); pitchS.target = 0;
        }
        return true;
      }
      case 'up': if (!K.dragging) downIdx = downIdx >= 0 && g.t < 350 ? downIdx : -1; return false;
      default: return false;
    }
  };

  /** dt s · t loop ms */
  D.update = function update(dt, t) {
    now = t;
    if (!K.dragging) {
      if (releasedAt >= 0) {
        if (t - releasedAt < KEY.yawReturnMs) {
          if (Math.abs(vel) > 1e-5) { yawS.snap(clampYaw(yawS.x + vel * (dt * 1000 / MOTION.frameMs))); vel *= Math.pow(MOTION.inertiaDecay, (dt * 1000) / MOTION.frameMs); }
        } else { releasedAt = -1; ret.from = yawS.x; ret.t0 = t; }
      }
      // The spring-back (heavy, ω 6) is evaluated in closed form on the loop clock, so it keeps its wall-clock timing
      // even when frames are long (the integrated springs slow down under the 50 ms dt clamp).
      if (ret.t0 >= 0) {
        const x = critical(ret.from, 0, SPRING.heavy.omega, (t - ret.t0) / 1000);
        yawS.snap(x);
        if (Math.abs(x) < 1e-4) { yawS.snap(0); ret.t0 = -1; }
      } else yawS.step(dt);
      pitchS.step(dt);
      if (flipped && Math.abs(pitchS.x - flipTurn) < 0.01) { pitchS.snap(0); flipped = false; }
    }
    if (prog.t0 >= 0) {
      D.prog = critical(prog.from, prog.to, prog.w, (t - prog.t0) / 1000);
      if ((t - prog.t0) / 1000 * prog.w > 12) { D.prog = prog.to; prog.t0 = -1; }
    }
    if (t - spinAt > KEY.yawReturnMs) spinS.target = Math.round(spinS.x / (2 * PI)) * 2 * PI;
    spinS.step(dt);
    // Touch-down press (SPEC §10.3): down to 0.96 within 24 ms, held to 90 ms, back over 120 ms (closed form on the loop
    // clock, so a slow frame never stretches or skips it).
    const pd = t - pressAt;
    const pe = pd < 0 || pd > MOTION.pressMs + 120 ? 0 : pd < 24 ? pd / 24 : pd <= MOTION.pressMs ? 1 : 1 - (pd - MOTION.pressMs) / 120;
    D.press = 1 - (1 - MOTION.pressScale) * pe;
    D.yaw = yawS.x + D.prog + spinS.x;
    D.pitch = pitchS.x;
    // isShowingBack bookkeeping on the total group yaw (A3.3: 180° ± 35° for ≥ 240 ms).
    const y = Math.atan2(Math.sin(D.yaw + K.idleYaw()), Math.cos(D.yaw + K.idleYaw()));
    if (Math.abs(Math.abs(y) - PI) <= 35 * DEG) { if (backSince < 0) backSince = t; } else backSince = -1;
  };
  D.isShowingBack = () => backSince >= 0 && now - backSince >= 240;
  D.yawTo = (deg, ms) => {
    prog.from = D.prog; prog.to = (+deg || 0) * DEG;
    prog.w = Math.min(30, (7.2 * 1000) / Math.max(1, +ms || 0));     // ω·ms = 7.2 s⁻¹·s: 99.4 % there at ms
    prog.t0 = now;
    if (ENV.reducedMotion || !(ms > 0)) { D.prog = prog.to; prog.t0 = -1; }
    return new Promise((res) => after(ms > 0 ? ms : 0, res));
  };
  D.addYaw = (rad) => { spinS.x += +rad || 0; spinS.target = spinS.x; spinAt = now; };
  D.nudgePitch = (deg) => { if (!K.dragging) { pitchS.omega = 9; pitchS.zeta = zetaFor(MOTION.settleOvershoot); pitchS.x += (+deg || 0) * DEG; pitchS.target = 0; } };
  D.resetYaw = () => { if (!K.dragging) { releasedAt = -1; vel = 0; ret.t0 = -1; yawS.snap(0); } };
  void app;
  return D;
}
