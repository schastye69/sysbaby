// boot/boot.js — the first five seconds and every return (ARCH §6.3, X§2.8.2; SPEC §0.1, §4, §5.2; SPEC-ADDENDUM A2.1,
// A2.9, A6.5.3). WP2.
//
// runBoot(ctx, initialRoute) picks the variant and owns app.phase ('boot' | 'start') until it calls setPhase('idle'):
//   desktop first visit (7,200 ms, desktop.js) · returning new day (3,500) / same day (2,000) (returning.js) ·
//   reduced motion (2,000, reduced.js) · phone start screen + stroke (phone.js) · T0 (ctx.t0.boot, then the DOM rim).
// The whole boot runs through the stage lock as 'boot' (A2.0.1). The deep link is travelled by main.js after it resolves.
// runRelaunch / runWake (wake.js): ПЕРЕЗАПУСК → СВЁРТКА → «сплю. разбуди меня.» → the next input wakes (A2.1.6).
// The shared finish() leaves the assembled CORE: chrome at full alpha, navigator, edge strings, datum «ЯДРО», dims,
// breathing ring, idle life, his name on the rim, grain 2 %, the bed released — then phase idle and 'boot:done'.
// Test-hook field `boot` = { t0, nLockAt, ignitionAt, idleAt } (perf ms).
import { Vector3 } from 'three';
import { app, setPhase } from '../core/store.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { ENV } from '../core/env.js';
import { WORLD } from '../data/world.js';
import { anniversaries, now as timeNow } from '../core/time.js';
import { registerHookField } from '../core/testhook.js';
import { after } from '../core/clock.js';
import { collectReturnedProbes } from '../halls/voyages/missionModel.js';
import { createTimeline } from './timeline.js';
import { createReveal, createStrata, createCamera, createWorld } from './kit.js';
import { createBootSound } from './signature.js';
import { layer } from './layer.js';
import { runDesktop, LOCKS } from './desktop.js';
import { cueLatch, LATCH_PANS, ASSEMBLY_PANS } from './signature.js';
import { runReturning } from './returning.js';
import { runReduced } from './reduced.js';
import { runPhone } from './phone.js';
import { runWake as wakeImpl, runRelaunch as relaunchImpl } from './wake.js';

const perf = () => performance.now();
const T0_ORIGIN = new Vector3(0, 0, 0);
const marks = { t0: null, nLockAt: null, ignitionAt: null, idleAt: null, nameAt: null };
// + nameAt (additive): perf ms at which his name started to burn / appear on the rim
registerHookField('boot', () => ({ t0: marks.t0, nLockAt: marks.nLockAt, ignitionAt: marks.ignitionAt, idleAt: marks.idleAt, nameAt: marks.nameAt }));

let relaunchHooked = false;
let anniversaryDone = false;

/** The session object every variant module works through. */
export function createSession(ctx, kind, opts = {}) {
  const k = ctx.key;
  const B = {
    ctx, k, kind, marks,
    rm: ENV.reducedMotion,
    phone: layout.isPhone,
    wake: kind === 'wake' || kind === 'phoneWake',
    first: !state.returning && kind !== 'wake' && kind !== 'phoneWake',
    finished: false,
    ignited: false,
    said: false,
    assembled: { chrome: false, nav: false, edges: false, datum: false },
    offs: [],
    tl: null,
    resolve: null,
  };
  B.done = new Promise((r) => { B.resolve = r; });
  B.settled = new Promise((r) => { B.settle = r; });          // at finish(): phase idle (the stage lock ends here)
  if (k) {
    B.reveal = createReveal(k);
    B.strata = createStrata(k);
  }
  B.cam = createCamera(ctx);
  B.world = createWorld(ctx);
  B.sound = createBootSound(ctx, { ears: !!opts.ears, bed: opts.bed });
  B.newTimeline = (from = 0) => {
    B.tl = createTimeline(ctx, { from, onFrame: (v) => {
      if (B.strata) B.strata.update(v);
      if (B.pauseGuard) B.pauseGuard();
      if (B.onFrame) B.onFrame(v);
    } });
    if (__DEV__) window.__wp2Boot = B;      // dev QA only (the boot's timeline v, rate, holds)
    return B.tl;
  };

  /** ПАУЗА 0.4 → hit (A2.0.2), owned by fx.impact.pause. Planned `lead` timeline ms before pauseV (the signature is cued
   *  for the planned hit); the timeline holds at pauseV until the pause has started and at hitV until the hit, so a
   *  late frame never lets the picture run ahead of the freeze. o: { kind, prosvet, pause = true, lead = 200, end (the table's last v) }.
   *  Without a pause (same day, no fx) the hitV beat is the hit. hit(hp) receives the hit's perf time. */
  B.sigH = null; B.hitPlanned = 0;
  B.planPause = (tl, pauseV, hitV, o, hit) => {
    const usePause = o.pause !== false;
    B.endV = o.end || 0;
    let pauseAt = 0, pausing = false;
    if (usePause) tl.hold(pauseV, () => B.ignited || (pauseAt > 0 && perf() >= pauseAt - 8));
    tl.hold(hitV, () => B.ignited || !pausing || perf() > B.hitPlanned + 1500);
    // the plan is not a picture beat: a wall-clock timer makes it too, so a stalled frame before the ПАУЗА can neither
    // start the pause late nor move the hit (the beat stays as the fallback when timers are throttled)
    const planV = Math.max(0, (usePause ? pauseV : hitV) - (o.lead || 200));
    let planned = false;
    const poll = () => {
      B.planTimer = 0;
      if (planned || B.ignited || B.finished || tl.ended) return;
      if (!tl.running || document.hidden) { B.planTimer = setTimeout(poll, 40); return; }
      const x = tl.vNow();
      if (x >= planV) plan(performance.now() + tl.realBetween(x, pauseV));
      else if (x < planV) B.planTimer = setTimeout(poll, Math.min(40, Math.max(4, tl.realBetween(x, planV))));
    };
    B.planTimer = setTimeout(poll, Math.max(4, tl.realBetween(tl.v, planV) - 60));
    tl.at(planV, () => plan(tl.perfOf(pauseV)));
    const plan = (pAt) => {
      if (planned || B.ignited) return;
      planned = true;
      pauseAt = pAt;
      B.hitPlanned = usePause ? pauseAt + (hitV - pauseV) : tl.perfOf(hitV);
      B.sigH = B.sound.cueSignatureAt(B.hitPlanned, 0);
      const fx = ctx.fx;
      if (usePause && fx && fx.impact && fx.impact.pause) {
        pausing = true;
        fx.impact.pause({ kind: o.kind || 'boot', at: pauseAt, prosvet: !!o.prosvet, onHit: (hp) => hit(hp) })
          .then((r) => { if (!B.ignited) hit(r && Number.isFinite(r.hitAt) ? r.hitAt : perf()); }, () => hit(perf()));
      }
    };
    tl.at(hitV, () => { if (!pausing) hit(tl.perfAt(hitV)); });
    B.pauseGuard = () => { if (pausing && !B.ignited && !B.finished && perf() > B.hitPlanned + 1500) hit(perf()); };   // fx never answered
  };
  /** Common start of every hit: false when already ignited; re-times the signature when his input moved the hit
   *  (A2.0.2 advanceHit) and brings the timeline to the hit. */
  B.hitPrelude = (tl, hitV, hp) => {
    if (B.ignited || B.finished) return false;
    if (B.sigH && Math.abs(hp - B.hitPlanned) > 25) { B.sigH.cancel(); B.sigH = null; B.sound.signed = false; B.sound.playSignatureNow(0); }
    if (B.hitPlanned && B.hitPlanned - hp > 80 && tl.v < hitV) tl.jumpTo(hitV);
    // the hit arrives in fx's frame pass (after the timeline's), maybe on a late frame, and hp is a presentation time
    // (it can lie up to a frame AHEAD of now): the table resumes in step with the hit itself (v = hitV at perf hp),
    // so the beats and cues after it keep their exact distance from it (never early by a frame)
    if (tl.v <= hitV + 1) tl.catchUp(Math.max(tl.v, hitV), hp);
    // never blocking: a hit that came late itself (hp after its slot) is absorbed by the rest of the table (≤ ×2), so
    // the boot still ends on its scheduled frame (rate 1 only — a skip already runs ×2)
    if (B.endV > hitV && tl.rate === 1 && tl.t0Perf > 0) {
      const lag = hp - (tl.t0Perf + hitV), seg = B.endV - hitV;
      if (lag > 40) tl.setRate(Math.min(2, seg / Math.max(seg / 2, seg - lag)));
    }
    return true;
  };
  /** A jump (skip) before the hit: the planned signature is cancelled and plays now at −3 dB (SPEC §4.1). */
  B.cancelSig = () => {
    if (B.sigH) { B.sigH.cancel(); B.sigH = null; B.sound.signed = false; }
    // a skip between the plan and the ПАУЗА: the freeze and the gate are not played after the picture has jumped
    const fx = ctx.fx;
    if (fx && fx.impact && fx.impact.cancel) fx.impact.cancel();
  };

  /** The nucleus ignition of any boot / start / wake (1 frame --white, then ember; night electrum 55 %). */
  B.ignite = (o = {}) => {
    if (B.reveal) B.reveal.restorePoints();       // the N slot dots come in with the light (no Key on T0)
    if (B.ignited) return;
    B.ignited = true;
    // the hit's perf time (the planned / advanced hit of the ПАУЗА, or the frame's presentation time of the beat)
    if (marks.ignitionAt == null || B.wake) marks.ignitionAt = Number.isFinite(o.at) ? o.at : perf();
    if (k) {
      k.ignite({ color: app.night ? 'electrum' : 'ember', flash: true });
      if (o.axis !== false) k.shootAxis(3.2, o.axisMs != null ? o.axisMs : 240);
      k.setIdle(true);
    }
    ctx.bus.emit('boot:ignite', { returning: !!state.returning, wake: B.wake });
  };

  /** The status said at the ignition / notice (first visit: pointer seen or not). */
  /** cut: said on the hit frame (the ignition, phone activation) — the line arrives with the flash, not fading in under it */
  B.sayNotice = (cut) => {
    if (B.said || !ctx.status) return;
    B.said = true;
    ctx.status.say(ctx.input.pointer.lastMove > 0 ? 'boot.pointer' : 'boot.nopointer', {}, cut ? { cut: true } : undefined);
  };

  // ── ASSEMBLY pieces (each idempotent) ──
  B.chromeTypeIn = () => { if (ctx.chrome) ctx.chrome.typeIn(); };
  B.chromeAssemble = (ms) => {
    if (B.assembled.chrome) return;
    B.assembled.chrome = true;
    document.body.classList.remove('boot-pre', 'boot-start');
    document.body.classList.add('boot-assembled');
    if (ctx.chrome) ctx.chrome.assemble(ms);
  };
  B.navShow = (ms) => { if (B.assembled.nav) return; B.assembled.nav = true; if (ctx.keyNav) ctx.keyNav.show({ ms }); };
  // the edge strings are part of the ASSEMBLY (SPEC §4.1 6,640; §4.2 the start screen has none): hidden until drawn.
  // Not in T0: there the strings' sway is the page's only steady repaint, and headless Chromium stops issuing frames
  // (and the loop with them) when a T0 page has no damage.
  if (kind !== 'wake' && kind !== 't0' && ctx.edges && ctx.edges.setVisible) ctx.edges.setVisible(false);
  B.edgesDraw = (ms) => {
    if (B.assembled.edges) return;
    B.assembled.edges = true;
    if (ctx.edges) { if (ctx.edges.setVisible) ctx.edges.setVisible(true); ctx.edges.drawIn(ms); }
  };
  B.datumArrive = (instant) => { if (B.assembled.datum) return; B.assembled.datum = true; if (ctx.datum) ctx.datum.arrive('CORE', { instant: !!instant }); };
  B.nameMark = (at) => { if (marks.nameAt == null || B.wake) marks.nameAt = Number.isFinite(at) ? at : perf(); };
  B.twitch = (px = 2) => { if (ctx.edges && ctx.edges.twitch) ctx.edges.twitch(px); };

  /** «never blocking» (SPEC §4.1): if the frames stop coming (a starved compositor, a stalled software-GL frame), a
   *  wall-clock watchdog completes the boot instantly `ms` + 3,000 after its start; it waits while the tab is hidden. */
  let dog = 0;
  B.watchdog = (ms, grace = 3000) => {
    const check = () => {
      dog = 0;
      if (B.finished) return;
      if (document.hidden) { dog = setTimeout(check, 1000); return; }
      B.skipToEnd();
    };
    dog = setTimeout(check, ms + grace);
  };

  /** Final state; phase idle; 'boot:done'. Idempotent. */
  B.finish = (o = {}) => {
    if (B.finished) return;
    B.finished = true;
    if (dog) { clearTimeout(dog); dog = 0; }
    if (B.planTimer) { clearTimeout(B.planTimer); B.planTimer = 0; }
    if (B.tl) B.tl.stop();
    for (const off of B.offs) { try { off(); } catch (e) { /* gone */ } }
    B.offs.length = 0;
    if (B.onFinish) { try { B.onFinish(); } catch (e) { /* variant's */ } }
    if (k) {
      B.reveal.full();
      B.strata.detach();
      if (!B.ignited) B.ignite({ axisMs: 0 });
      k.setBreathingRing(true);
      k.setIdle(true);
      k.setInteractive(true);
    }
    if (!B.wake) {
      B.world.restore();
      B.cam.clearDrift();
      if (ctx.rig) B.cam.rest();
    } else B.world.restore();
    if (ctx.rim && !ctx.rim.shown) { if (typeof ctx.rim.showName === 'function') { ctx.rim.showName(); B.nameMark(); } }
    B.chromeAssemble(o.instant ? 0 : undefined);
    B.navShow(o.instant ? 0 : undefined);
    B.edgesDraw(o.instant ? 0 : undefined);
    B.datumArrive(!!o.instant);
    document.body.classList.remove('boot-pre', 'boot-start', 'boot-assembled');
    if (ctx.composite) { ctx.composite.setGrain(0.02); if (ctx.composite.freezeGrain) ctx.composite.freezeGrain(false); }
    B.sound.releaseBed(o.instant ? 600 : 2000);
    B.sound.dispose();
    layer.scan(null); layer.start(false); layer.stopTrail();
    if (!B.wake) B.sayNotice();
    if (!B.wake && !anniversaryDone) {
      anniversaryDone = true;
      try { for (const a of anniversaries(timeNow())) ctx.status.say('anniversary', { title: a.title, years: a.years }); } catch (e) { /* data */ }
    }
    if (B.wake) {
      app.booting = false;
      if (app.phase === 'start' || app.phase === 'boot') setPhase('idle');
    } else {
      setPhase('idle');
      app.booting = false;
      marks.idleAt = perf();
      ctx.bus.emit('boot:done', { returning: !!state.returning, sameDay: !!state.sameDaySession, phone: layout.isPhone });
    }
    B.settle();
    // the assembled CORE holds a beat before main.js travels a deep link (the dive starts from rest, not mid-assembly)
    if (B.wake) B.resolve(); else after(140, () => B.resolve());
  };

  /** Skip counting (A2.1.2): 1st input unlocks audio only · 2nd ×2 · 3rd or Esc → jump · none inside the ПАУЗА. */
  B.installSkip = (onRate, onJump, start = 0) => {
    let n = start;
    const since = perf();
    const inPause = () => { try { return !!(ctx.fx && ctx.fx.impact && ctx.fx.impact.inPause()); } catch (e) { return false; } };
    const count = (esc) => {
      if (B.finished || inPause() || perf() - since < 40) return;
      if (esc) { onJump(); return; }
      n++;
      if (n === 2) onRate(2);
      else if (n >= 3) onJump();
    };
    B.offs.push(ctx.input.observeDown((d) => { if (d.type !== 'key') count(false); }));
    B.offs.push(ctx.input.observeKeys((e) => { if (!e.repeat) count(e.key === 'Escape'); }));
    // the boot input is never a Key click: every canvas gesture is swallowed while the boot runs
    const consumer = {
      name: 'boot',
      onGesture(g) { return g.type !== 'hover' && g.type !== 'leave'; },
      onKey() { return true; },
    };
    B.offs.push(ctx.input.push(consumer));
    B.offs.push(ctx.bus.on('audio:unlocked', () => B.sound.onUnlock(B.tl ? B.tl.v : 0, B.ignited)));
    return { get count() { return n; } };
  };

  /** A hidden tab mid-boot: the boot completes instantly on return (no runaway timers, no lost state). */
  B.offs.push(ctx.bus.on('visibility', (e) => { if (!e.hidden && !B.finished && B.tl && B.kind !== 'phone' && B.kind !== 'phoneWake') B.skipToEnd(); }));
  B.skipToEnd = () => { if (B.onSkipToEnd) B.onSkipToEnd(); else B.finish({ instant: true }); };
  return B;
}

/** Boot-time facts (SPEC §4.3): transmission arrived, probes back. Said in priority order by the caller. */
export function bootNews(ctx) {
  const news = { transmission: false, probes: [] };
  if (state.returning && state.isNewDay) {
    news.transmission = state.distinctDays <= WORLD.transmissions.length && WORLD.transmissions.length > 0;
    try { news.probes = collectReturnedProbes(); } catch (e) { news.probes = []; }
  }
  return news;
}

/** → Promise<void> (resolves at phase 'idle') */
export function runBoot(ctx, initialRoute) {
  void initialRoute;
  ctx.wake = (o) => runWake(ctx, o);
  marks.t0 = perf(); marks.nLockAt = null; marks.ignitionAt = null; marks.idleAt = null; marks.nameAt = null;
  if (!relaunchHooked) { relaunchHooked = true; ctx.bus.on('relaunch', () => runRelaunch(ctx)); }
  app.booting = true;
  const fx = ctx.fx;
  const go = () => {
    layer.mount();
    let B;
    if (!ctx.key) B = runT0(ctx);
    else if (layout.isPhone) B = runPhone(ctx, createSession(ctx, 'phone', { ears: false }), marks);
    else if (ENV.reducedMotion) B = runReduced(ctx, createSession(ctx, 'reduced', { ears: false }), marks);
    else if (state.returning) B = runReturning(ctx, createSession(ctx, state.sameDaySession ? 'sameDay' : 'return', { ears: false }), marks);
    else B = runDesktop(ctx, createSession(ctx, 'first', { ears: true }), marks);
    return B;
  };
  if (fx && fx.stage && typeof fx.stage.run === 'function') {
    let done;
    const p = new Promise((r) => { done = r; });
    // the stage lock is the boot's until phase idle (finish), not the 140 ms hold before a deep link travels
    fx.stage.run('boot', () => { const B = go(); B.done.then(done, done); return B.settled; }).catch(() => done());
    return p;
  }
  return go().done;
}

/** T0 (no WebGL): the SVG Key's own boot (WP11), the DOM rim's name, then the assembled chrome. */
function runT0(ctx) {
  const B = createSession(ctx, 't0', { ears: !layout.isPhone && !state.returning && !ENV.reducedMotion });
  const phone = layout.isPhone;
  const first = !phone && !state.returning && !ENV.reducedMotion;
  setPhase(phone ? 'start' : 'boot');
  if (!phone) document.body.classList.add('boot-pre');
  if (ctx.chrome && !phone && !state.returning) ctx.chrome.typeIn();
  const p = ctx.t0 && ctx.t0.boot ? ctx.t0.boot({ phone, returning: !!state.returning, sameDay: !!state.sameDaySession, reduced: ENV.reducedMotion }) : Promise.resolve();
  // at: perf ms the burn starts (the DOM rim waits for it), so a late frame never moves his name off the wave's arrival
  const burn = (at) => {
    if (B.nameDone || !ctx.rim) return;
    B.nameDone = true;
    if (ENV.reducedMotion || state.sameDaySession) ctx.rim.showName();
    else ctx.rim.burn({ dir: 'ltr', msPerLetter: 70, at });
    B.nameMark(at);
  };
  if (!first) {
    // returning / reduced / phone: the SVG Key's own boot (WP11) is the timeline; the name and the chrome follow it
    const end = () => { if (B.finished) return; B.ignite(); burn(); B.finish(); };
    p.then(end, end);
    marks.t0 = perf();
    if (!phone) B.watchdog(state.returning && !state.sameDaySession ? 3500 : 2000, 800);
    return B;
  }
  // desktop first visit (A2.1.7): the SVG cryptex is WP11's; WP2 keeps the same sound timeline and set-piece beats —
  // the 190 ms latches, the ПАУЗА 4,540–4,940 (the T0 facade pauses the CSS grain), ПРОСВЕТ and the wave ring at
  // 4,940 (SVG twins), the name burn at 5,815, the ASSEMBLY clicks, idle at 7,200 (or when the SVG boot ends, later).
  const fx = ctx.fx;
  const tl = B.newTimeline(0);
  tl.realtime(4540, 4940);
  for (let i = 0; i < 7; i++) cueLatch(tl, LOCKS[i] - (i === 6 ? 12 : 0), 1, i, LATCH_PANS[i], i === 6 ? () => { marks.nLockAt = tl.perfAt(LOCKS[6]); } : null);
  tl.cue(2600, 'bootSwell', (T) => ctx.audio.play('bootSwell', { when: T }), null);
  B.sound.cuePop(tl, 2600, 800);
  const hit = (hp) => {
    if (!B.hitPrelude(tl, 4940, hp)) return;
    B.ignite({ at: hp });
    try { if (fx && fx.wave) fx.wave.fire({ origin: T0_ORIGIN, echo: { dist: 300 }, at: hp }); } catch (e) { /* fx */ }
    B.arrival = hp + 300000 / 343;                    // the wave reaches the 300 m rim (A2.1.7: 5,815)
    B.sayNotice();
  };
  B.planPause(tl, 4540, 4940, { kind: 'boot', prosvet: true, end: 7200 }, hit);
  B.sound.cueSubDrop(tl, 5600);
  tl.at(5615, () => burn(Number.isFinite(B.arrival) ? B.arrival : tl.perfOf(5815)));   // planned 200 ms ahead
  cueLatch(tl, 6400, 2, 0, ASSEMBLY_PANS[0], () => { B.twitch(2); B.navShow(600); B.chromeAssemble(480); B.datumArrive(false); B.sound.releaseBed(2000); });
  cueLatch(tl, 6640, 2, 1, ASSEMBLY_PANS[1], () => { B.twitch(2); B.edgesDraw(560); });
  cueLatch(tl, 6880, 2, 2, ASSEMBLY_PANS[2], () => B.twitch(2));
  let svgDone = false;
  p.then(() => { svgDone = true; if (tl.v >= 7200) B.finish(); }, () => { svgDone = true; });
  tl.at(7200, () => { if (svgDone) B.finish(); });
  tl.span(7200, 1e9, () => { if (svgDone) B.finish(); });
  const jump = () => {
    if (B.finished || tl.v >= 6400) return;
    if (!B.ignited) { B.cancelSig(); B.ignite(); B.sound.playSignatureNow(-3); B.sayNotice(); }
    burn(performance.now());
    tl.jumpTo(6400);
  };
  B.installSkip((r) => tl.setRate(r), jump);
  B.onSkipToEnd = () => { jump(); B.finish({ instant: true }); };
  tl.start();
  marks.t0 = tl.t0Perf;
  // a DOM-only page has no GPU stall to wait out: if the frames stop (a headless compositor with no damage), 800 ms grace
  B.watchdog(7200, 800);
  return B;
}

/** H28d (X§2.8.2, A2.1.6): the wake after СВЁРТКА (also ПОКАЗ scene 1 with show:true). → Promise<void> */
export function runWake(ctx, opts = { show: false }) { return wakeImpl(ctx, opts || {}, createSession, marks); }

/** ПЕРЕЗАПУСК (SPEC §5.2, A2.9): СВЁРТКА, «сплю. разбуди меня.», the next input wakes. → Promise<void> */
export function runRelaunch(ctx) { return relaunchImpl(ctx, createSession, marks); }
