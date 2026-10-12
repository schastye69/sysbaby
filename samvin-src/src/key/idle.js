// key/idle.js — WP1. Idle life & attention (SPEC §3.3; ARCH §6.2 notes; §12.4 reduced motion). Alive, not a creature:
//   drift      group yaw ±14°, sine 40 s; per-stratum sway ±1.5° at 11 13 17 19 23 29 31 s (world time: ПАУЗА/СВЁРТКА stop it)
//   re-index   every 23–41 s one random stratum ≠ • turns +360/n (ω 9, ≈ 620 ms, n ratchet ticks), back 1,600 ms later
//   notice     the group leans +Z toward the pointer ray, ≤ 7° (6° while booting; a virtual pointer at (w/3, h/2) before the
//              first move), spring ω 6.3 ζ .95; every stratum follows through its own low-pass τ_i = 40 + 40·|i − 3| ms
//   hot side   g follows the pointer through a 220 ms delay line (→ 90 ms after 3 s of continuous tracking, ramped over
//              1 s), then a spring ω 14; nothing resets it on a tab return, so it resumes where it was left
//   lean in    slow pointer (< 300 px/s) within 1.2× the screen radius: 0.08 m toward the camera, gaps +0.010 (ω 6)
//   flinch     > 2,500 px/s within 1.5× the radius: strata −3 % toward the axis in 120 ms, grains +0.05 m, relax 700 ms,
//              sound `flinch`, `key:flinch {speed}`; at night a yawn instead (nucleus ember 1,200 ms + «ещё не сплю.»)
//   repulsion  the pointer ray (Key-local) goes to the grains every frame
// The name always faces the viewer within ±16°: drift + notice is soft-limited to 15.8°.
// Reduced motion (SPEC §12.4): no drift, no sway, no notice tilt, no lean, no flinch contraction or scatter.
import { Vector3, Matrix4 } from 'three';
import { Spring, SpringV3, SPRING } from '../core/spring.js';
import { after } from '../core/clock.js';
import { loop } from '../core/loop.js';
import { input } from '../core/input.js';
import { layout } from '../core/layout.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { ENV } from '../core/env.js';
import { audio } from '../audio/engine.js';
import { rig } from '../render/cameraRig.js';
import { IDLE, STRATA_GEOM } from '../core/tokens.js';

const DEG = Math.PI / 180;
const LIMIT = 15.8 * DEG;
const HN = 64;   // delay-line samples
const NO_OPTS = {};   // shared: the flinch sound allocates nothing in the frame
const FL = { speed: 0 };   // shared key:flinch payload

export function createIdle(K) {
  const I = {
    yaw: 0, pitch: 0,                         // group: drift + notice (soft-limited)
    sway: new Float32Array(7), lagYaw: new Float32Array(7), lagPitch: new Float32Array(7),
    lean: 0, flinch: 0, hot: new Vector3(0, 0, 1),
  };
  const nY = Spring.from(SPRING.notice), nP = Spring.from(SPRING.notice);
  const lean = Spring.from(SPRING.heavy);
  const rx = []; for (let i = 0; i < 7; i++) rx.push(Spring.from(SPRING.reindex));
  const hot = new SpringV3(SPRING.hot.omega, 1); hot.snap(I.hot);
  const lpY = new Float32Array(7), lpP = new Float32Array(7);
  const hT = new Float64Array(HN), hX = new Float32Array(HN * 3);
  let hN = 0, hHead = 0, trackSince = -1, env = 0, amp = 0;
  let nextReindex = -1, flinchAt = -1e9, wasIdle = false;
  const _o = new Vector3(), _d = new Vector3(), _n = new Vector3(), _p = new Vector3(), _c = new Vector3(), _inv = new Matrix4();

  // Flinch detection runs on every raw pointer sample (not once per frame), on the segment since the previous sample:
  // a fast stroke that crosses the Key between two frames still counts.
  const fast = { at: -1e9, px: -9999, py: -9999, cx: 0, cy: 0, R: 0 };
  input.observe((sm) => {
    const x0 = fast.px, y0 = fast.py;
    fast.px = sm.x; fast.py = sm.y;
    if (sm.type === 'touch' || sm.speed <= IDLE.flinchSpeedPx || x0 < -9000 || fast.R <= 0) return;
    const dx = sm.x - x0, dy = sm.y - y0, L2 = dx * dx + dy * dy;
    const u = L2 > 0 ? Math.max(0, Math.min(1, ((fast.cx - x0) * dx + (fast.cy - y0) * dy) / L2)) : 0;
    if (Math.hypot(x0 + dx * u - fast.cx, y0 + dy * u - fast.cy) < IDLE.flinchRadius * fast.R) fast.at = loop.at();
  });

  function scheduleReindex(t) { nextReindex = t + IDLE.reindexMs[0] + Math.random() * (IDLE.reindexMs[1] - IDLE.reindexMs[0]); }
  // Re-index callbacks are built once (G9: the frame that fires a re-index allocates nothing).
  const tickOpts = [], tickFn = [], backFn = [];
  for (let i = 0; i < 7; i++) {
    tickOpts.push({ i, soft: true });
    tickFn.push(() => audio.play('tick', tickOpts[i]));
    backFn.push(() => { rx[i].target = 0; });
  }
  function reindex() {
    let i = 3;
    while (i === 3) i = Math.floor(Math.random() * 7);
    const n = STRATA_GEOM[i].n;
    rx[i].target = (Math.PI * 2) / n;
    for (let c = 0; c < n; c++) after((IDLE.reindexTurnMs * (c + 0.5)) / n, tickFn[i]);
    after(IDLE.reindexBackMs, backFn[i]);
  }

  /** Writes the Key-local pointer ray into _o/_d. → false without a camera or pointer. */
  function ray(px, py) {
    const cam = rig.camera;
    if (!cam) return false;
    _o.setFromMatrixPosition(cam.matrixWorld);
    _d.set((px / Math.max(1, layout.w)) * 2 - 1, -(py / Math.max(1, layout.h)) * 2 + 1, 0.5).unproject(cam).sub(_o);
    _inv.copy(K.group.matrixWorld).invert();
    _o.applyMatrix4(_inv);
    _d.transformDirection(_inv);
    return true;
  }

  /** dt world-scaled s · t loop ms · si = { x, y, r } Key screen centre / radius (CSS px) */
  I.update = function update(dt, t, si) {
    const idle = K.idle && !ENV.reducedMotion;
    const live = K.idle && K.attentive();          // CORE, idle phase, interactive, not dragged
    if (K.idle && !wasIdle) { scheduleReindex(t); amp = 0; }
    wasIdle = K.idle;
    // Drift & sway (fade in over 2 s whenever idle life starts, so nothing jumps).
    amp = idle ? Math.min(1, amp + dt / 2) : Math.max(0, amp - dt / 0.6);
    const ws = loop.worldNow / 1000;
    const drift = amp * IDLE.driftYawDeg * DEG * Math.sin((Math.PI * 2 * ws) / IDLE.driftPeriodS) * (1 - K.hoverAmt);
    for (let i = 0; i < 7; i++) I.sway[i] = amp * IDLE.swayDeg * DEG * Math.sin((Math.PI * 2 * ws) / IDLE.swayPeriodsS[i] + i * 1.7);
    if (idle && live && nextReindex > 0 && t >= nextReindex) { reindex(); scheduleReindex(t); }
    for (let i = 0; i < 7; i++) { rx[i].step(dt); I.sway[i] += rx[i].x; }

    // Pointer facts.
    const p = input.pointer;
    const moved = p.lastMove > 0 && p.x > -9000;
    const px = moved ? p.x : layout.w / 3, py = moved ? p.y : layout.h / 2;
    const dist = Math.hypot(px - si.x, py - si.y), R = Math.max(8, si.r);
    const mouseIn = moved && p.inside && (p.type !== 'touch' || p.down);
    const hasRay = ray(px, py);

    // Notice.
    const maxN = (app.booting ? IDLE.noticeBootDeg : IDLE.noticeMaxDeg) * DEG;
    const pxPerM = si.r / 1.25;
    // Reduced motion: the Key does not lean after the pointer (nor toward the camera); the hot side still follows it.
    if (live && K.idle && hasRay && !ENV.reducedMotion) {
      const dist0 = Math.max(1, _o.length());
      nY.target = maxN * Math.tanh(Math.atan2((px - si.x) / pxPerM, dist0) / maxN);
      nP.target = maxN * Math.tanh(Math.atan2((py - si.y) / pxPerM, dist0) / maxN);
    } else { nY.target = 0; nP.target = 0; }
    nY.step(dt); nP.step(dt);
    let gy = drift + nY.x;
    gy = LIMIT * Math.tanh(gy / LIMIT);
    I.yaw = gy; I.pitch = nP.x;
    for (let i = 0; i < 7; i++) {
      const k = 1 - Math.exp(-(dt * 1000) / (IDLE.tauBaseMs + IDLE.tauStepMs * Math.abs(i - 3)));
      lpY[i] += (nY.x - lpY[i]) * k; lpP[i] += (nP.x - lpP[i]) * k;
      I.lagYaw[i] = lpY[i] - nY.x; I.lagPitch[i] = lpP[i] - nP.x;
    }

    // Hot side: g toward the pointer ray (Key-local), through the delay line, then ω 14.
    if (hasRay && live) {
      _n.copy(K.nucleusLocal);
      _p.copy(_n).sub(_o); const s = _p.dot(_d);
      _p.copy(_o).addScaledVector(_d, s).sub(_n).multiplyScalar(1 / 0.6);
      _c.copy(_o).sub(_n).normalize();
      _p.add(_c).normalize();
      hT[hHead] = t; hX[hHead * 3] = _p.x; hX[hHead * 3 + 1] = _p.y; hX[hHead * 3 + 2] = _p.z;
      hHead = (hHead + 1) % HN; hN = Math.min(HN, hN + 1);
      if (t - p.lastMove < 400) { if (trackSince < 0) trackSince = t; } else trackSince = -1;
      const tr = trackSince < 0 ? 0 : Math.min(1, Math.max(0, (t - trackSince - IDLE.hotTrackMs) / IDLE.hotRampMs));
      const delay = IDLE.hotDelayMs + (IDLE.hotDelayLateMs - IDLE.hotDelayMs) * tr;
      for (let k = 1; k <= hN; k++) {
        const j = (hHead - k + HN) % HN;
        if (t - hT[j] >= delay || k === hN) { hot.target.set(hX[j * 3], hX[j * 3 + 1], hX[j * 3 + 2]); break; }
      }
    }
    hot.step(dt);
    I.hot.copy(hot.x);
    if (I.hot.lengthSq() < 1e-6) I.hot.set(0, 0, 1); else I.hot.normalize();

    // Lean in, flinch.
    lean.target = live && mouseIn && !ENV.reducedMotion && p.speed < IDLE.leanSpeedPx && dist < IDLE.leanRadius * R ? 1 : 0;
    lean.step(dt);
    I.lean = lean.x;
    fast.cx = si.x; fast.cy = si.y; fast.R = R;
    const fastNow = t - fast.at < 260 || (moved && p.speed > IDLE.flinchSpeedPx && dist < IDLE.flinchRadius * R);
    if (live && fastNow && t - flinchAt > IDLE.flinchInMs + IDLE.flinchRelaxMs) {
      fast.at = -1e9;
      flinchAt = t;
      FL.speed = Math.round(Math.max(p.speed, IDLE.flinchSpeedPx)); bus.emit('key:flinch', FL);
      if (app.night) { K.yawn(t); }
      else {
        audio.play('flinch', NO_OPTS);
        if (!ENV.reducedMotion) K.grains.scatter(IDLE.flinchScatter);
      }
    }
    const f = t - flinchAt;
    env = app.night || ENV.reducedMotion ? 0 : f < IDLE.flinchInMs ? f / IDLE.flinchInMs : f < IDLE.flinchInMs + IDLE.flinchRelaxMs ? 1 - (f - IDLE.flinchInMs) / IDLE.flinchRelaxMs : 0;
    I.flinch = env;
    K.grains.setRay(_o, _d, hasRay && live && mouseIn);
  };
  return I;
}
