// boot/desktop.js — THE TITLE SEQUENCE (SPEC §4.1 as replaced by SPEC-ADDENDUM A2.1.1; A2.1.2 skips; A2.1.6 the wake,
// which is this table from 1,800 ms). WP2.
//
//      0   void, 2.5 % grain, the corners type in at 28 ms/char (30 %)
//    600   DEPTH: dolly 16 → 9.5 m (camera ease) + Lissajous drift ±0.08 m; rim lattice 0 → 6 %; axis beads dim
//          (the benchmark window: nothing heavy is drawn)                 · titleFx rack focus 30 → 9.5 m (WP12)
//  1,800   DETECTION: the Key's vertices appear as 2 px points in random order, 1 ms ticks ≤ 30/s
//  2,600   THE LINE: the ember plane sweeps y +1.6 → −1.6 m (800 ms); crossed edges flash white, the solid fills
//          behind it; bootSwell; the ears pop (if they were blocked)
//  2,900   the strata spin (2–4 rev/s) and decelerate onto their lock frames
//  3,400   CRYPTEX LOCK, 190 ms: S 3,400 · A 3,590 · M 3,780 · • 3,970 · V 4,160 · I 4,350 · N 4,540 — latch gen 1,
//          edge flash twin, swarf
//  4,540   ПАУЗА 0.4 (fx.impact.pause; ПРОСВЕТ on the first visit and the wake)
//  4,940   IGNITION: nucleus 1 frame white → ember, axis ±3.2 m in 240 ms, ВОЛНА 343 with its echo, the signature;
//          the notice (setIdle) and «вижу тебя.» / «система проснулась.»
//  5,600   THE WORLD OPENS: camera 9.5 m → the CORE rest pose (A12), the pillar fires to the irises (±260 m, 600 ms), sub-drop
//  5,815   the wave reaches the rim: rim 6 → 12 %, his name burns (70 ms/letter, ember → silver 1,200 ms)
//  6,400   ASSEMBLY: navigator + dims + chrome + datum «ЯДРО» (latch gen 2 +0.6) · 6,640 edge strings (−0.6) ·
//          6,880 «ЯДРО» locked (0); each a 2 px struck twitch · bed fades in over 2,000 ms · 6,690 the echo
//  7,200   phase idle, 'boot:done' (WP13's ГОСТИ verb appears)
import { Vector3 } from 'three';
import { setPhase } from '../core/store.js';
import { EASE, clamp01 } from '../core/ease.js';
import { STRATA_GEOM } from '../world/structure.js';
import { layer } from './layer.js';
import { cueLatch, LATCH_PANS, ASSEMBLY_PANS } from './signature.js';
import { audio } from '../audio/engine.js';

export const LOCKS = [3400, 3590, 3780, 3970, 4160, 4350, 4540];
const SPIN_FROM = 2900;
const PAUSE_AT = 4540, HIT = 4940;
const ORIGIN = new Vector3(0, 0, 0);
const _sv = new Vector3();
const _sp = { x: 0, y: 0, depth: 0, visible: false };

/** CSS px y of the Key-local height y (the Key sits at the origin through the boot) */
function screenYOf(ctx, y) {
  if (!ctx.rig) return 0;
  _sv.set(0, y, 0);
  ctx.rig.project(_sv, _sp);
  return _sp.y;
}

/** The shared title timeline: variant 'first' (from 0) or 'wake' (from 1,800). */
export function buildTitle(ctx, B, marks, o) {
  const k = B.k, fx = ctx.fx, wake = o.variant === 'wake';
  const tl = B.newTimeline(o.from || 0);
  tl.realtime(PAUSE_AT, HIT);
  B.scanY = null;

  // ── initial state ──
  if (!wake) {
    B.reveal.hidden();
    B.strata.scramble('random');
    k.douse();
    B.cam.at(16);
    B.world.rim(0); B.world.beads(0); B.world.ribbon(0);
  } else {
    B.reveal.restorePoints();
    B.reveal.set(1, 1, 1, 0.4, null);
    B.reveal.points(0);
    B.strata.scramble('golden');
    k.douse(); k.shootAxis(0, 0);
  }
  k.setInteractive(false);
  k.setIdle(false);
  k.setBreathingRing(false);
  if (ctx.rim) { if (ctx.rim.hideName) ctx.rim.hideName(); if (!wake) ctx.rim.setLitNodes(0); }
  for (let i = 0; i < 7; i++) B.strata.plan(i, SPIN_FROM, LOCKS[i]);
  let title = null;
  try { if (fx && fx.pieces && fx.pieces.titleFx) title = fx.pieces.titleFx({ variant: wake ? 'wake' : 'first', t0: tl.t0Perf || performance.now() - (o.from || 0), sheetY: () => B.scanY }); } catch (e) { title = null; }

  // ── DEPTH (600–1,800) ──
  if (!wake) {
    tl.span(600, 1800, (u) => {
      const e = EASE.camera(u);
      B.cam.at(16 + (9.5 - 16) * e);
      B.world.rim(0.5 * EASE.reveal(u));
      B.world.beads(0.3 * u);
    });
  }
  // ── DETECTION (1,800–2,600) ──
  tl.at(1800, () => { if (!wake) { B.reveal.points(0); B.reveal.set(1, 0, 1, 0, null); } });
  tl.span(1800, 2600, (u) => { if (B.reveal.points(Math.min(1, u * 1.08)) > 0) B.sound.tick(); });
  // ── THE LINE (2,600–3,400) ──
  tl.cue(2600, 'bootSwell', (T) => audio.play('bootSwell', { when: T }), null);
  B.sound.cuePop(tl, 2600, 800);
  const crossed = new Uint8Array(7);
  tl.span(2600, 3400, (u) => {
    const y = 1.6 - 3.2 * u;
    if (u >= 1) {
      B.scanY = null; layer.scan(null);
      B.reveal.set(1, 1, 1, 1, null);
      return;
    }
    B.scanY = y;
    const sy = screenYOf(ctx, y), sTail = screenYOf(ctx, Math.min(1.6, y + 3.2 * (120 / 800)));
    layer.scan(sy, Math.abs(sy - sTail), 1);
    B.reveal.set(1, clamp01(u * 1.06), 1, Math.max(wake ? 0.4 : 0, clamp01(u * 1.1)), y);
    for (let i = 0; i < 7; i++) if (!crossed[i] && y <= STRATA_GEOM[i].mid) { crossed[i] = 1; B.strata.flash(i, tl.v); }
  });
  // ── CRYPTEX LOCK (3,400–4,540) ──
  for (let i = 0; i < 7; i++) {
    const v = LOCKS[i];
    const visual = () => {
      if (k.flashEdges) k.flashEdges(i, 'white', 1);
      try { if (fx && fx.pieces && fx.pieces.swarf) fx.pieces.swarf(i); } catch (e) { /* fx */ }
      if (i === 6) marks.nLockAt = tl.perfAt(v);
    };
    if (i < 6) cueLatch(tl, v, 1, i, LATCH_PANS[i], visual);
    else { cueLatch(tl, v - 12, 1, i, LATCH_PANS[i], null); tl.at(v, visual); }
  }
  // ── ПАУЗА → IGNITION ──
  const hit = (hitPerf) => {
    if (!B.hitPrelude(tl, HIT, hitPerf)) return;
    B.ignite({ at: hitPerf });
    try { if (fx && fx.wave) fx.wave.fire({ origin: ORIGIN, echo: { dist: 300 }, at: hitPerf }); } catch (e) { /* fx */ }
    // the name burn starts on the wave's arrival at the 300 m rim (A2.0.4): the shell leaves at the hit itself, so the
    // arrival is hit + 874.6 ms — from the exact hit, not from the frame that delivered it (a slow frame can run the
    // fx hit pass up to half a frame either side of hitAt)
    B.arrival = hitPerf + 300000 / 343;
    if (!wake) B.sayNotice(true);
  };
  B.planPause(tl, PAUSE_AT, HIT, { kind: wake ? 'wake' : 'boot', prosvet: true, end: 7200 }, hit);
  // ── THE WORLD OPENS (5,600–6,400) ──
  // the tilt leads the pull-back (rest pitch by ≈ 5,920), so the name burning from 5,815 stands in its rest band
  // above the status line instead of sliding up through «вижу тебя.»
  if (!wake) tl.span(5600, 6400, (u) => B.cam.toRest(9.5, EASE.camera(u), undefined, 0, EASE.camera(Math.min(1, u * 2.5))));
  B.sound.cueSubDrop(tl, 5600);
  tl.span(5600, 6200, (u) => {
    B.world.ribbon(u >= 1 ? 1200 : 260 * EASE.phosphor(u), 1);
    B.world.flashRibbon(u >= 1 ? 0 : 0.6 * (1 - u));
    B.world.beads(0.3 + 0.7 * u);
  });
  const burnName = (now) => {
    B.world.rim(1);
    if (ctx.rim && !B.nameBurning) {
      B.nameBurning = true;
      const p0 = performance.now();
      const at = now || !Number.isFinite(B.arrival) ? Math.min(p0, Number.isFinite(B.arrival) ? B.arrival : p0) : B.arrival;
      B.nameMark(at);
      const p = ctx.rim.burn({ dir: 'ltr', msPerLetter: 70, at });
      if (o.show && ctx.rim.reburnGuests) p.then(() => ctx.rim.reburnGuests());
    }
  };
  tl.at(HIT + 875, () => burnName(false));
  // the echo line ends the «сплю. разбуди меня.» state at once (that P1 line would otherwise hold it back)
  if (wake) tl.at(HIT + 1750, () => { if (ctx.status) ctx.status.say('echo', { m: 300 }, { force: true }); });
  // ── ASSEMBLY (6,400–7,200) ──
  cueLatch(tl, 6400, 2, 0, ASSEMBLY_PANS[0], () => {
    B.twitch(2);
    k.setInteractive(true);
    k.setBreathingRing(true);
    if (!wake) { B.navShow(600); B.chromeAssemble(480); B.datumArrive(false); }
    B.sound.releaseBed(2000);
  });
  cueLatch(tl, 6640, 2, 1, ASSEMBLY_PANS[1], () => { B.twitch(2); if (!wake) B.edgesDraw(560); });
  cueLatch(tl, 6880, 2, 2, ASSEMBLY_PANS[2], () => B.twitch(2));
  tl.at(7200, () => B.finish());

  // ── drift (first visit) ──
  if (!wake) {
    B.onFrame = (v) => {
      const amp = v < 600 ? 0 : v < 1000 ? (v - 600) / 400 : v < 5600 ? 1 : Math.max(0, 1 - (v - 5600) / 800);
      B.cam.drift(v, amp);
    };
  }
  // ── skips (A2.1.2) ──
  const jump = () => {
    if (B.finished || tl.v >= 6400) return;
    layer.scan(null); B.scanY = null;
    B.reveal.full();
    B.strata.aligned();
    if (!B.ignited) {
      B.cancelSig();
      B.ignite();
      B.sound.playSignatureNow(-3);
      if (!wake) B.sayNotice();
    }
    burnName(true);
    tl.jumpTo(6400);
  };
  B.installSkip((r) => tl.setRate(r), jump, wake ? 1 : 0);
  B.onSkipToEnd = () => { jump(); B.finish({ instant: true }); };
  B.onFinish = () => { if (title) { try { title.stop(); } catch (e) { /* fx */ } } B.scanY = null; };
  return tl;
}

/** → B (B.done resolves at phase idle) */
export function runDesktop(ctx, B, marks) {
  setPhase('boot');
  document.body.classList.add('boot-pre');
  if (ctx.composite) ctx.composite.setGrain(0.025);
  B.chromeTypeIn();
  const tl = buildTitle(ctx, B, marks, { variant: 'first', from: 0 });
  marks.t0 = performance.now();
  tl.start();
  marks.t0 = tl.t0Perf;
  B.watchdog(7200);
  return B;
}
