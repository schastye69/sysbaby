// boot/reduced.js — the reduced-motion boot on desktop (SPEC §4.4 as amended by SPEC-ADDENDUM A2.1.5). WP2.
// 2,000 ms, no camera travel, no spin, no burn:
//      0   grain
//    200   the Key fades in already aligned (400 ms opacity)
//    600   ПАУЗА 0.4 (gate + grain freeze) — first visit and new calendar days only
//  1,000   ignition: nucleus flash, the thump; ПРОСВЕТ on the first visit; the wave (no displacement) for its echo
//  1,200   the chrome fades in, one latch gen 2
//  1,875   the rim steps to 12 % and his name appears (160 ms fade); the echo is audible at 2,750
//  2,000   phase idle
// Returning visitors use the same table; the greeting is said at the ignition.
import { Vector3 } from 'three';
import { setPhase } from '../core/store.js';
import { state } from '../core/state.js';
import { cueLatch } from './signature.js';
import { sayGreeting } from './returning.js';
import { bootNews } from './boot.js';

const ORIGIN = new Vector3(0, 0, 0);

/** → B */
export function runReduced(ctx, B, marks) {
  const k = B.k, fx = ctx.fx;
  const pause = !state.returning || (state.isNewDay && !state.sameDaySession);
  const first = !state.returning;
  setPhase('boot');
  if (first) document.body.classList.add('boot-pre');
  if (ctx.composite) ctx.composite.setGrain(0.025);
  if (first) B.chromeTypeIn();
  const tl = B.newTimeline(0);
  if (pause) tl.realtime(600, 1000);

  B.reveal.restorePoints();
  B.reveal.hidden();
  B.strata.aligned();
  k.douse(); k.setInteractive(false); k.setIdle(false); k.setBreathingRing(false);
  B.cam.rest();
  B.world.rim(0.5); B.world.beads(1); B.world.ribbon(1200, 1);
  if (ctx.rim) { if (ctx.rim.hideName) ctx.rim.hideName(); ctx.rim.setLitNodes(0); }

  tl.span(200, 600, (u) => B.reveal.set(1, u, u, u, null));
  const hit = (hp) => {
    if (!B.hitPrelude(tl, 1000, hp)) return;
    B.ignite({ axisMs: 0, at: hp });
    try { if (fx && fx.wave && first) fx.wave.fire({ origin: ORIGIN, echo: { dist: 300 }, at: hp }); } catch (e) { /* fx */ }
    if (state.returning) {
      const news = bootNews(ctx);
      if (news.transmission && ctx.keyNav) ctx.keyNav.blink('S');
      sayGreeting(ctx, news);
      B.said = true;
    } else B.sayNotice();
  };
  B.planPause(tl, 600, 1000, { kind: 'boot', prosvet: first, pause, end: 2000 }, hit);
  cueLatch(tl, 1200, 2, 0, 0, () => {
    k.setInteractive(true); k.setBreathingRing(true);
    B.chromeAssemble(160); B.navShow(0); B.edgesDraw(0); B.datumArrive(false);
    B.sound.releaseBed(2000);
  });
  tl.at(1875, () => {
    B.world.rim(1);
    if (ctx.rim) { if (ctx.rim.fadeName) ctx.rim.fadeName(160); else ctx.rim.showName(); B.nameMark(tl.perfAt(1875)); }
    // the new day's node with its 1-frame electrum flash, now that the name it stands beside is there (SPEC §4.3)
    if (state.returning && state.isNewDay && !state.sameDaySession && ctx.rim && ctx.rim.flashNewNode) ctx.rim.flashNewNode();
  });
  tl.at(2000, () => B.finish());
  const jump = () => { if (!B.ignited) { B.cancelSig(); hit(performance.now()); B.sound.playSignatureNow(-3); } B.reveal.full(); tl.jumpTo(1200); };
  B.installSkip((r) => tl.setRate(r), jump);
  B.onSkipToEnd = () => { jump(); B.finish({ instant: true }); };
  tl.start();
  marks.t0 = tl.t0Perf;
  B.watchdog(2000);
  return B;
}
