// boot/phone.js — the phone start screen and the stroke (SPEC §4.2; SPEC-ADDENDUM A2.1.3, A2.1.4, A2.1.6). WP2.
// A separate scene: the Key fills 78 % of the height at 47 % (camera 5.2 m), scrambled at the golden angles; top-centre
// MICRO `VIN / КЛЮЧ / СПИТ`; from 2,200 ms the ghost dot runs the axis (S → N, 900 ms, every 2,400 ms) and the BODY hint
// «Проведи пальцем по ключу». His finger crossing a stratum's projected centre (within the Key's width ±40 px) snaps it
// aligned (ω 22, 4 %; a crossing = the finger's vertical path running through the stratum's projected band, see
// the consumer), plays its note + a ratchet tick, vibrate(7), flashes its edges and leaves a 2 px ember trail.
// ≥ 5 of 7 strata within 1,500 ms in one touch activates: the rest cascade (60 ms each), ПАУЗА (first activation /
// new calendar day / wake), the hit (ПРОСВЕТ + ВОЛНА on the first activation and the wake), the signature, the axis, the
// pull-back 5.2 → 7.2 m (900 ms), the name (on the wave's arrival, else with the pull; right-to-left after an upward
// stroke), the band (480 ms) and the chrome (480 ms) with one latch gen 2. Partial strokes: no deny, the crossed strata
// hold 2,500 ms then drift back over 900 ms with soft ticks; after 3 partials the hint becomes «До конца ↓» and the ghost
// runs every 1,600 ms. A horizontal flick on one stratum spins it (fidget, never counted).
import { Vector3 } from 'three';
import { setPhase, app } from '../core/store.js';
import { state } from '../core/state.js';
import { EASE } from '../core/ease.js';
import { STRATA_GEOM } from '../world/structure.js';
import { audio } from '../audio/engine.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { layer } from './layer.js';
import { cueLatch } from './signature.js';
import { sayGreeting } from './returning.js';
import { bootNews } from './boot.js';

const ORIGIN = new Vector3(0, 0, 0);
const START_D = 5.2, Y16 = (0.75 * 16) / 7.2, OFF = -0.03;   // the rest elevation at 5.2 m; Key centre at 47 %
// SPEC §4.2 states both «78 % of the height» and «camera at 5.2 m»; at the CORE's 35° lens 5.2 m gives 72.5 %. The
// distance is kept: at 78 % the standard start stroke of every QA pre-roll (ARCH §6.0.4, y 230 → 650) crosses only
// 4 strata and never activates.
const _v = new Vector3();
const _p = { x: 0, y: 0, depth: 0, visible: false };
const _si = { x: 0, y: 0, r: 0, rx: 0, ry: 0 };
const ghostA = { x: 0, y: 0 }, ghostB = { x: 0, y: 0 }, ghostP = { x: 0, y: 0 };

function proj(ctx, y, out) { _v.set(0, y, 0); ctx.rig.project(_v, _p); out.x = _p.x; out.y = _p.y; return out; }

/** → B. kind 'phone' (boot) or 'phoneWake' (after СВЁРТКА). */
export function runPhone(ctx, B, marks) {
  const k = B.k, fx = ctx.fx;
  const wake = B.kind === 'phoneWake';
  const returning = !!state.returning && !wake;
  const firstAct = !returning && !wake;
  const pauseOn = wake || firstAct || (state.isNewDay && !state.sameDaySession);
  const prosvet = wake || firstAct;
  // reduced motion (SPEC §4.4, A2.1.5): the stroke is kept; the Key fades in (no detection, no sweep), strata snap
  // without spin (no fidget spin, 160 ms drift-backs), the ПАУЗА and ПРОСВЕТ are kept, the camera does not travel
  const rm = B.rm;
  setPhase('start');
  app.booting = true;
  document.body.classList.add('boot-start');
  if (ctx.composite) ctx.composite.setGrain(0.025);
  if (wake) { if (ctx.keyNav) ctx.keyNav.hide(); if (ctx.datum) ctx.datum.depart(); }   // the start screen has neither
  const tl = B.newTimeline(0);

  // ── the scene ──
  B.cam.at(START_D, Y16, OFF);
  B.strata.scramble('golden');
  k.douse(); k.setInteractive(false); k.setIdle(false); k.setBreathingRing(false);
  if (ctx.rim) { if (ctx.rim.hideName) ctx.rim.hideName(); ctx.rim.setLitNodes(0); }
  layer.start(true);
  if (firstAct && !rm) {
    B.reveal.hidden();
    B.world.rim(0); B.world.beads(0); B.world.ribbon(0);
    tl.span(300, 900, (u) => { B.world.rim(0.5 * u); B.world.beads(0.3 * u); });
    tl.at(600, () => { B.reveal.points(0); B.reveal.set(1, 0, 1, 0, null); });
    tl.span(600, 1000, (u) => { if (B.reveal.points(u) > 0) B.sound.tick(); });
    tl.span(1000, 1800, (u) => {
      const y = 1.6 - 3.2 * u;
      if (u >= 1) { layer.scan(null); B.reveal.set(1, 1, 1, 1, null); return; }
      const a = proj(ctx, y, ghostP).y, b = proj(ctx, Math.min(1.6, y + 0.48), ghostA).y;
      layer.scan(a, Math.abs(a - b), 1);
      B.reveal.set(1, u, 1, u, y);
    });
  } else {
    B.reveal.restorePoints();
    if (wake) B.reveal.set(1, 1, 1, 0.4, null); else B.reveal.hidden();
    B.world.rim(0.5); B.world.beads(0.3); B.world.ribbon(0);
    const fa = wake ? 0 : rm && firstAct ? 200 : 100, fb = rm && firstAct ? 600 : 300;
    tl.span(fa, fb, (u) => B.reveal.set(1, u, 1, wake ? 0.4 + 0.6 * u : u, null));
  }
  const hintAt = firstAct ? 2200 : wake ? 600 : 4000;

  // ── ghost + hint ──
  let partials = 0, hintShown = false, ghostFrom = hintAt, touching = false, active = true, lastTouchV = 0;   // returning: 4,000 ms without a touch
  const hintText = () => (partials >= 3 ? 'До конца ↓' : 'Проведи пальцем по ключу');
  B.onFrame = (v) => {
    if (!active) return;
    if (!hintShown && v - (returning ? lastTouchV : 0) >= hintAt) { hintShown = true; layer.hint(hintText()); ghostFrom = v; }
    if (hintShown && !touching && ctx.rig) {
      const period = partials >= 3 ? 1600 : 2400;
      const ph = (v - ghostFrom) % period;
      if (ph < 900) {
        proj(ctx, 1.2, ghostA); proj(ctx, -1.2, ghostB);
        const u = EASE.camera(ph / 900);
        ghostP.x = ghostA.x + (ghostB.x - ghostA.x) * u; ghostP.y = ghostA.y + (ghostB.y - ghostA.y) * u;
        const a = ph < 120 ? ph / 120 : ph > 780 ? (900 - ph) / 120 : 1;
        layer.ghost(ghostP, a);
      } else layer.ghost(null);
    } else layer.ghost(null);
  };

  // ── the stroke ──
  const cross = new Float64Array(7);          // perf ms of the crossing in this touch (0 = not crossed)
  const holdT = new Int32Array(7);            // after-touch hold timers (timeline ms of release, 0 = none)
  let lastY = 0, lastX = 0, startX = 0, startY = 0, dirSum = 0, crossedN = 0, activated = false;
  const stratumY = new Float32Array(7), bandA = new Float32Array(7), bandB = new Float32Array(7);
  let yMin = 0, yMax = 0;
  // the raw events' own timestamps (window capture: before input.js turns them into gestures), so a busy main thread
  // never stretches the stroke's 1,500 ms window
  let evNow = 0, evDown = 0;
  const onEv = (e) => { evNow = e.timeStamp || performance.now(); if (e.type === 'pointerdown') evDown = evNow; };
  window.addEventListener('pointerdown', onEv, { capture: true, passive: true });
  window.addEventListener('pointermove', onEv, { capture: true, passive: true });
  B.offs.push(() => { window.removeEventListener('pointerdown', onEv, { capture: true }); window.removeEventListener('pointermove', onEv, { capture: true }); });
  const now = () => performance.now();

  // tEv: the event's own time since the touch began
  const crossStratum = (i, dir, tEv) => {
    if (cross[i]) return;
    cross[i] = 1 + Math.max(0, tEv); crossedN++;
    B.strata.lockNow(i, tl.v);
    holdT[i] = 0;
    audio.play('stratumNote', { i });
    audio.play('ratchet', { i });
    vibrate(VIBE.stratum);
    if (k.flashEdges) k.flashEdges(i, 'white', 1);
    void dir;
    // activation: ≥ 5 distinct strata within 1,500 ms in this touch
    let n = 0;
    const t = 1 + Math.max(0, tEv);
    for (let j = 0; j < 7; j++) if (cross[j] && t - cross[j] <= 1500) n++;
    if (n >= 5 && !activated) activate(dirSum >= 0 ? 'down' : 'up');
  };

  const endTouch = () => {
    if (!touching) return;
    touching = false;
    layer.trailBreak();
    if (activated) return;
    const vertical = Math.abs(lastY - startY) >= 20;
    if (vertical || crossedN > 0) {
      partials++;
      if (partials === 3) { layer.hint(hintText()); ghostFrom = tl.v; hintShown = true; }
      // crossed strata hold 2,500 ms, then drift back over 900 ms with soft ticks
      for (let i = 0; i < 7; i++) if (cross[i]) holdT[i] = Math.round(tl.v + 2500);
    }
    for (let i = 0; i < 7; i++) cross[i] = 0;
    crossedN = 0;
  };
  // drift-backs
  tl.span(0, 1e9, () => {
    for (let i = 0; i < 7; i++) {
      if (holdT[i] && tl.v >= holdT[i]) {
        holdT[i] = 0;
        B.strata.release(i, tl.v, rm ? 160 : 900, B.strata.home(i));
        const ii = i;
        tl.at(tl.v + 300, () => { if (!activated) audio.play('tick', { n: ii }); });
      }
    }
  });
  B.strata.onFace = () => audio.play('tick', {});

  const consumer = {
    name: 'start',
    onGesture(g) {
      if (activated || B.finished) return true;
      if (g.type === 'down') {
        touching = true; startX = lastX = g.x; startY = lastY = g.y; dirSum = 0; crossedN = 0; lastTouchV = tl.v;
        for (let i = 0; i < 7; i++) {
          cross[i] = 0; stratumY[i] = k.stratumScreenY(i);
          bandA[i] = proj(ctx, STRATA_GEOM[i].top, ghostP).y; bandB[i] = proj(ctx, STRATA_GEOM[i].bot, ghostP).y;
        }
        yMin = yMax = g.y;
        k.screenInfo(_si);
        layer.trailBreak(); layer.trailAdd(g.x, g.y);
        return true;
      }
      if (g.type === 'drag' || g.type === 'dragstart') {
        if (!touching) return true;
        const x = g.x, y = g.y;
        layer.trailAdd(x, y);
        dirSum += y - lastY;
        // a stratum is crossed when the finger's vertical path (≥ 24 px of travel in this touch, within the Key's
        // projected width ± 40 px) runs through its projected band; in path order, so the notes follow the finger
        const halfW = (_si.rx || 80) + 40;
        if (Math.abs(x - _si.x) <= halfW) {
          yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
          if (yMax - yMin >= 24) {
            const down = dirSum >= 0;
            for (let n = 0; n < 7; n++) {
              const i = down ? n : 6 - n;
              if (!cross[i] && Math.min(yMax, bandB[i]) - Math.max(yMin, bandA[i]) > 0) crossStratum(i, down ? 1 : -1, evNow - evDown);
            }
          }
        }
        lastX = x; lastY = y;
        return true;
      }
      if (g.type === 'swipe') {
        // a horizontal flick on one stratum: a fidget spin (never counts toward activation)
        if (Math.abs(g.tx) > 40 && Math.abs(g.ty) < 20) {
          let i = k.pick(startX, startY);
          if (i < 0) { let best = 1e9; for (let j = 0; j < 7; j++) { const d = Math.abs(stratumY[j] - startY); if (d < best) { best = d; i = j; } } }
          if (i >= 0 && !rm) B.strata.fidget(i, tl.v, Math.max(-30, Math.min(30, g.vx * 9)));
          touching = false; layer.trailBreak();
          for (let j = 0; j < 7; j++) cross[j] = 0;
          crossedN = 0;
          return true;
        }
        endTouch();
        return true;
      }
      if (g.type === 'dragend' || g.type === 'up' || g.type === 'tap' || g.type === 'cancel') { endTouch(); return true; }
      return g.type !== 'hover' && g.type !== 'leave';
    },
    onKey() { return true; },
  };
  B.offs.push(ctx.input.push(consumer));

  // ── activation ──
  function activate(dir) {
    activated = true;
    touching = false;
    layer.hint(null); layer.ghost(null);
    active = false;
    // the remaining strata cascade into alignment, 60 ms each (in the stroke's direction)
    const order = dir === 'up' ? [6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6];
    const rest = order.filter((i) => !cross[i]);
    const t0 = tl.v;
    rest.forEach((i, n) => tl.at(t0 + 60 * (n + 1), () => {
      B.strata.lockNow(i, tl.v);
      audio.play('ratchet', { i });
      if (k.flashEdges) k.flashEdges(i, 'white', 1);
    }));
    for (let i = 0; i < 7; i++) holdT[i] = 0;
    const lastAt = t0 + 60 * rest.length;
    marks.nLockAt = tl.perfAt(lastAt);
    const hitV = pauseOn ? lastAt + 400 : lastAt + 30;
    if (pauseOn) tl.realtime(lastAt, hitV);
    const hit = (hp) => {
      if (!B.hitPrelude(tl, hitV, hp)) return;
      B.ignite({ at: hp, axisMs: rm ? 0 : 240 });
      vibrate(VIBE.activation);
      let arrive = -1;
      if (prosvet) {
        try { if (fx && fx.wave) fx.wave.fire({ origin: ORIGIN, echo: { dist: 300 }, at: hp }); } catch (e) { /* fx */ }
        arrive = hitV + 875;
      }
      const burnAt = arrive > 0 ? arrive : hitV;
      tl.at(burnAt, () => {
        B.world.rim(1);
        if (!ctx.rim) return;
        const at = tl.perfAt(burnAt);
        if (rm && ctx.rim.fadeName) ctx.rim.fadeName(160);            // reduced motion: the name appears, no burn
        else ctx.rim.burn({ dir: dir === 'up' ? 'rtl' : 'ltr', msPerLetter: 70, at });
        B.nameMark(at);
      });
      if (wake) tl.at(hitV + 1750, () => { if (ctx.status) ctx.status.say('echo', { m: 300 }, { force: true }); });
      if (returning) {
        if (ctx.rim) ctx.rim.setLitNodes(Math.max(0, state.litNodes - (state.isNewDay && !state.sameDaySession ? 1 : 0)));
        if (state.isNewDay && !state.sameDaySession && ctx.rim && ctx.rim.flashNewNode) ctx.rim.flashNewNode();
        const news = bootNews(ctx);
        sayGreeting(ctx, news);
        B.said = true;
        if (news.transmission) tl.at(hitV + 1400, () => { if (ctx.keyNav) ctx.keyNav.blink('S'); });
      } else if (!wake) B.sayNotice();
    };
    B.planPause(tl, lastAt, hitV, { kind: wake ? 'wake' : 'boot', prosvet, pause: pauseOn, lead: 150 }, hit);
    // the axis, the pull-back, the band and the chrome
    if (!rm) {
      tl.span(hitV, hitV + 900, (u) => {
        B.cam.toRest(START_D, EASE.camera(u), Y16, OFF);
        B.world.beads(0.3 + 0.7 * u);
        B.world.ribbon(u >= 1 ? 1200 : 1200 * EASE.phosphor(u), 1);
      });
    } else tl.at(hitV, () => { B.world.beads(1); B.world.ribbon(1200, 1); });
    const bandAt = hitV + 900;
    tl.at(bandAt, () => {
      if (rm) B.cam.rest();                    // no travel: the CORE view arrives as a cut with the band
      layer.start(false);
      k.setInteractive(true); k.setBreathingRing(true);
      B.navShow(480); B.chromeAssemble(480); B.edgesDraw(480); B.datumArrive(false);
      B.sound.releaseBed(2000);
    });
    cueLatch(tl, bandAt + 480, 2, 0, 0, () => B.twitch(2));
    tl.at(bandAt + 560, () => B.finish());
  }
  B.onFinish = () => { layer.start(false); layer.stopTrail(); };
  B.offs.push(ctx.bus.on('audio:unlocked', () => B.sound.onUnlock(0, B.ignited)));
  tl.start();
  marks.t0 = tl.t0Perf;
  return B;
}
