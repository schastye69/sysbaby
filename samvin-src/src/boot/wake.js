// boot/wake.js — ПЕРЕЗАПУСК and the wake (SPEC §5.2 as amended by SPEC-ADDENDUM A2.9 СВЁРТКА and A2.1.6). WP2.
// On 'relaunch' (the navigator's 2,000 ms long-press on •; it RECALLs to CORE first if needed): wait for the CORE
// settle, then ctx.fx.pieces.fold({context:'relaunch'}) — the one shared finale (WP12) — while the guests leave the
// rim during the collapse and his name goes dark with the zero; then the SPEC status «сплю. разбуди меня.». The Key
// sleeps (dark scrambled silhouette) until the next input:
//   desktop — any press or key: runWake = the title sequence from 1,800 ms (5,400 ms): the ears snap blocked on the
//             waking input and pop with THE LINE, seven clicks, ПАУЗА, ПРОСВЕТ, ВОЛНА, the signature, the name
//             re-burns on the wave's arrival, «эхо от стены: 300 м.» on the echo, the ASSEMBLY clicks;
//   phone   — the start screen returns; its activation is the wake (ПАУЗА + ПРОСВЕТ + ВОЛНА).
// ПОКАЗ scene 1 calls ctx.wake({show:true}) after its own fold: the guests' names burn again after his.
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { after, cancelAfter } from '../core/clock.js';
import { buildTitle } from './desktop.js';
import { runPhone } from './phone.js';
import { layer } from './layer.js';

let asleep = false, waking = null, sleepOffs = [];

function waitCore(ctx, ms) {
  return new Promise((res) => {
    if (app.room === 'CORE' && !(ctx.director && ctx.director.busy())) { res(); return; }
    let done = false;
    const fin = () => { if (done) return; done = true; off(); res(); };
    const off = ctx.bus.on('room:arrive', (e) => { if (e && e.room === 'CORE') after(30, fin); });
    after(ms, fin);
  });
}

function clearSleep() { for (const o of sleepOffs) { try { o(); } catch (e) { /* gone */ } } sleepOffs = []; }

/** → Promise<void> (resolves in the «сплю. разбуди меня.» state) */
export async function runRelaunch(ctx, createSession, marks) {
  if (asleep || waking || app.booting) return;
  asleep = true;
  await waitCore(ctx, 4000);
  const k = ctx.key, fx = ctx.fx, rim = ctx.rim;
  if (k) { k.setInteractive(false); }
  // the guests leave the rim during the collapse (400–1,300); his name goes dark with the zero (1,850)
  const tGuests = after(900, () => { if (rim && rim.clearGuests) rim.clearGuests(); });
  const tName = after(1850, () => { if (rim) { if (rim.hideName) rim.hideName(); rim.setLitNodes(0); } });
  try { if (fx && fx.pieces && fx.pieces.fold) await fx.pieces.fold({ context: 'relaunch' }); } catch (e) { /* fx */ }
  cancelAfter(tGuests); cancelAfter(tName);            // the fold is over: its beats are settled below at once
  if (rim) { if (rim.clearGuests) rim.clearGuests(); if (rim.hideName) rim.hideName(); rim.setLitNodes(0); }
  // asleep: dark nucleus and no ember axis (the axis belongs to the ignition; the wake shoots it again)
  if (k) { k.douse(); k.shootAxis(0, 0); k.setBreathingRing(false); k.setIdle(false); }
  if (ctx.status) ctx.status.say('relaunch');
  if (layout.isPhone && k) { asleep = false; startWake(ctx, { show: false }, createSession, marks, true); return; }
  // desktop / T0: the next input wakes
  const wakeNow = () => { if (!asleep) return; asleep = false; clearSleep(); startWake(ctx, { show: false }, createSession, marks, false); };
  sleepOffs.push(ctx.input.observeDown(() => wakeNow()));
  sleepOffs.push(ctx.input.observeKeys(() => wakeNow()));
  sleepOffs.push(ctx.input.push({ name: 'asleep', onGesture(g) { return g.type !== 'hover' && g.type !== 'leave'; }, onKey() { return true; } }));
}

function startWake(ctx, opts, createSession, marks, phone) {
  const run = () => wakeSession(ctx, opts, createSession, marks, phone);
  const fx = ctx.fx;
  let p;
  if (fx && fx.stage && typeof fx.stage.run === 'function') {
    let done;
    p = new Promise((r) => { done = r; });
    fx.stage.run('wake', () => run().then(done, done)).catch(() => done());
  } else p = run();
  waking = p;
  p.then(() => { waking = null; }, () => { waking = null; });
  return p;
}

function wakeSession(ctx, opts, createSession, marks, phone) {
  const k = ctx.key, fx = ctx.fx;
  try { if (fx && fx.pieces && fx.pieces.wakeReset) fx.pieces.wakeReset(); } catch (e) { /* fx */ }
  layer.mount();
  if (!k) {                                            // T0: the SVG Key's own boot does the picture
    const B = createSession(ctx, 'wake');
    const p = ctx.t0 && ctx.t0.boot ? ctx.t0.boot({ phone: layout.isPhone, returning: true, sameDay: false, reduced: false }) : Promise.resolve();
    p.then(() => { B.ignite(); if (ctx.rim) ctx.rim.burn({ dir: 'ltr', msPerLetter: 70 }); B.finish(); }, () => B.finish());
    return B.done;
  }
  if (phone) {
    const B = createSession(ctx, 'phoneWake', { ears: false });
    runPhone(ctx, B, marks);
    return B.done;
  }
  const B = createSession(ctx, 'wake', { ears: true });
  app.booting = true;
  // the ears snap blocked on the waking input (pop with THE LINE)
  B.sound.onUnlock(0, false);
  const tl = buildTitle(ctx, B, marks, { variant: 'wake', from: 1800, show: !!(opts && opts.show) });
  B.offs.push(ctx.bus.on('travel:start', () => B.skipToEnd()));
  tl.start();
  marks.t0 = tl.t0Perf;
  B.watchdog(5400);
  return B.done;
}

/** H28d: ctx.wake / runWake — also ПОКАЗ scene 1 ({show:true}). → Promise<void> */
export function runWake(ctx, opts, createSession, marks) {
  if (waking) return waking;
  asleep = false; clearSleep();
  return startWake(ctx, opts || {}, createSession, marks, layout.isPhone);
}

