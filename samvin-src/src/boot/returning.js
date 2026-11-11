// boot/returning.js — the returning visitor on desktop (SPEC §4.3 as amended by SPEC-ADDENDUM A2.1.4, A6.5.3). WP2.
//
// New calendar day, 3,500 ms:
//      0   CSS void, grain, the corners with real values (30 %)
//    300   the Key fades in solid and scrambled (no detection); his last drawing traced over it as a 2 px ember figure
//          0.9 m tall (800 ms) with «помню твой рисунок.»
//  1,100   locks at 190 ms (S 1,100 … N 2,240), latch gen 1 with the A2.1.1 pans
//  2,240   ПАУЗА (no ПРОСВЕТ)
//  2,640   ignition: nucleus white → ember (night: electrum 55 %), the new lit node's 1-frame electrum flash, the thump
//          (signature, no echo, no wave); S blinks if a transmission arrived; returned probes; the greeting by priority
//  2,640–3,500 camera 9.5 m → the CORE rest pose (A12), the name burns (70 ms/letter), all chrome at once (480 ms), latch gen 2 at 3,120
// Same calendar day, new session (SPEC unchanged), 2,000 ms: 110 ms locks with ratchets, no pause, «снова ты.»
import { setPhase } from '../core/store.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { WORLD } from '../data/world.js';
import { EASE, clamp01 } from '../core/ease.js';
import { Vector3 } from 'three';
import { CAMERA } from '../core/tokens.js';
import { audio } from '../audio/engine.js';
import { layer } from './layer.js';
import { cueLatch, LATCH_PANS } from './signature.js';
import { bootNews } from './boot.js';

const Y_REST16 = (CAMERA.core.pos[1] * 16) / CAMERA.core.pos[2];     // CAMERA.core pos y at 16 m along its line (rest pitch)
const _v = new Vector3();
const _p = { x: 0, y: 0, depth: 0, visible: false };
function proj(ctx, y) { if (!ctx.rig) return { x: 0, y: 0 }; _v.set(0, y, 0); ctx.rig.project(_v, _p); return { x: _p.x, y: _p.y }; }

/** The greeting by priority (SPEC §8.4): P3 greeting, then the P2 facts (queued by the status line). */
export function sayGreeting(ctx, news) {
  const st = ctx.status;
  if (!st) return;
  // the greeting takes the line at the ignition (SPEC §4.3 2,640), even over «помню твой рисунок.» still in its hold
  const F = { force: true };
  if (state.sameDaySession) st.say('return.sameDay', {}, F);
  else if (state.data && state.data.owner) st.say('return.days.owner', { N: state.daysAway, name: WORLD.operator.name }, F);
  else st.say('return.days', { N: state.daysAway }, F);
  if (state.isNewDay && !state.sameDaySession) st.say('return.node');
  if (news.transmission) st.say('transmission.new');
  for (const code of news.probes) { st.say('probe.back', { code }); ctx.bus.emit('probe:back', { code }); }
}

/** his last saved drawing traced over the Key (300–1,100 ms), then fading */
function traceDrawing(ctx, B, tl, a, b) {
  const d = state.data && Array.isArray(state.data.drawings) ? state.data.drawings : [];
  const pts = d.length ? d[d.length - 1] : null;
  if (!pts || pts.length < 2) return;
  let h = null;
  tl.at(a, () => {
    const top = proj(ctx, 0.45), bot = proj(ctx, -0.45), c = proj(ctx, 0);
    h = layer.trace(pts, c.x || layout.w / 2, c.y || layout.h / 2, Math.abs(bot.y - top.y) || 120);
    if (ctx.status) ctx.status.say('drawing.boot');
  });
  tl.span(a, b, (u) => { if (h) h.set(EASE.phosphor(u), 1); });
  tl.span(b + 200, b + 700, (u) => { if (h) { h.set(1, 1 - u); if (u >= 1) h.remove(); } });
}

/** → B */
export function runReturning(ctx, B, marks) {
  const k = B.k, same = B.kind === 'sameDay';
  setPhase('boot');
  document.body.classList.add('boot-pre');
  if (ctx.composite) ctx.composite.setGrain(0.025);
  const tl = B.newTimeline(0);
  const T = same
    ? { fadeA: 200, fadeB: 600, spin: 450, lock0: 700, step: 110, ign: 1480, end: 1950, pause: false }
    : { fadeA: 300, fadeB: 1100, spin: 900, lock0: 1100, step: 190, ign: 2640, end: 3500, pause: true };
  const locks = [];
  for (let i = 0; i < 7; i++) locks.push(T.lock0 + T.step * i);
  if (T.pause) tl.realtime(T.ign - 400, T.ign);

  // initial: dark, scrambled, at 9.5 m on the boot line
  B.reveal.restorePoints();
  B.reveal.hidden();
  B.strata.scramble('random');
  k.douse(); k.setInteractive(false); k.setIdle(false); k.setBreathingRing(false);
  // on the rest line of sight (the CORE pitch): the dolly to the rest distance then leaves the far rim — and his name burning on it
  // from the ignition — standing still in its band above the greeting
  B.cam.at(9.5, Y_REST16);
  B.world.rim(0); B.world.beads(0); B.world.ribbon(0);
  if (ctx.rim) {
    if (ctx.rim.hideName) ctx.rim.hideName();
    ctx.rim.setLitNodes(0);          // the nodes come with the name (never a lone ember dot on an empty rim)
  }
  for (let i = 0; i < 7; i++) B.strata.plan(i, T.spin, locks[i]);

  tl.span(T.fadeA, T.fadeB, (u) => {
    const e = EASE.reveal(u);
    B.reveal.set(1, e, e, e, null);
    B.world.rim(0.5 * e); B.world.beads(0.3 * e);
  });
  if (!same) traceDrawing(ctx, B, tl, T.fadeA, T.fadeB);

  // locks
  for (let i = 0; i < 7; i++) {
    const visual = () => { if (k.flashEdges) k.flashEdges(i, 'white', 1); if (i === 6) marks.nLockAt = tl.perfAt(locks[6]); };
    if (same) tl.cue(locks[i], 'ratchet', (Tc) => audio.play('ratchet', { i, when: Tc }), visual);
    else if (i < 6) cueLatch(tl, locks[i], 1, i, LATCH_PANS[i], visual);
    else { cueLatch(tl, locks[i] - 12, 1, i, LATCH_PANS[i], null); tl.at(locks[i], visual); }
  }

  // ignition
  const news = { transmission: false, probes: [] };
  const hit = (hp) => {
    if (!B.hitPrelude(tl, T.ign, hp)) return;
    B.ignite({ at: hp });
    B.hitPerf = hp;
    if (ctx.rim) ctx.rim.setLitNodes(Math.max(0, state.litNodes - (state.isNewDay && !state.sameDaySession ? 1 : 0)));
    if (!same && state.isNewDay && ctx.rim && ctx.rim.flashNewNode) ctx.rim.flashNewNode();
    Object.assign(news, bootNews(ctx));
    if (news.transmission && ctx.keyNav) ctx.keyNav.blink('S');
    sayGreeting(ctx, news);
    B.said = true;
  };
  B.planPause(tl, T.ign - 400, T.ign, { kind: 'boot', prosvet: false, pause: T.pause, end: T.end }, hit);

  // the world opens, the name, the chrome
  const camB = T.end - 60;
  tl.span(T.ign, camB, (u) => {
    B.cam.toRest(9.5, EASE.camera(u), Y_REST16);
    B.world.rim(0.5 + 0.5 * clamp01(u * 2));
    B.world.beads(0.3 + 0.7 * u);
  });
  tl.span(T.ign, T.ign + 480, (u) => B.world.ribbon(u >= 1 ? 1200 : 260 * EASE.phosphor(u), 1));
  tl.at(T.ign, () => {
    if (ctx.rim) {
      const at = Math.min(performance.now(), Number.isFinite(B.hitPerf) ? B.hitPerf : performance.now());
      if (same) ctx.rim.showName(); else ctx.rim.burn({ dir: 'ltr', msPerLetter: 70, at });
      B.nameMark(same ? undefined : at);
    }
    const ms = same ? 400 : 480;
    k.setInteractive(true); k.setBreathingRing(true);
    B.chromeAssemble(ms); B.navShow(ms); B.edgesDraw(ms); B.datumArrive(false);
    B.sound.releaseBed(2000);
  });
  if (!same) cueLatch(tl, T.ign + 480, 2, 0, 0, () => B.twitch(2));
  tl.at(T.end, () => B.finish());

  B.onFrame = (v) => B.cam.drift(v, v < T.ign ? 1 : Math.max(0, 1 - (v - T.ign) / (camB - T.ign)));
  const jump = () => {
    if (B.finished) return;
    B.reveal.full(); B.strata.aligned();
    if (!B.ignited) { B.cancelSig(); hit(performance.now()); B.sound.playSignatureNow(-3); }
    tl.jumpTo(T.ign);
  };
  B.installSkip((r) => tl.setRate(r), jump);
  B.onSkipToEnd = () => { jump(); B.finish({ instant: true }); };
  tl.start();
  marks.t0 = tl.t0Perf;
  B.watchdog(T.end);
  return B;
}
