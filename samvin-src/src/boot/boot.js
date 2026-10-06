// boot/boot.js — WP2 SEED (ARCH §3.1.1 step 13, §6.1.5). A short, real boot so the app runs end to end:
// void + grain → the rim lattice rises (600 ms) → the Key reveals (900 ms, 400 ms) while its strata lock top → bottom
// from golden angles (220 ms steps) → ignition + axis shot → chrome assembled, navigator, edge strings, datum «ЯДРО»,
// the rim name, breathing ring, idle breath → status → phase idle (≤ 3,000 ms; reduced motion ≤ 1,200 ms, no lock).
// Desktop and phone are identical here (no stroke; WP2 adds the start screen). Any input during the boot skips to the
// end (a boot input consumer on top of the stack, keys via onKey). T0: ctx.t0.boot() draws the SVG Key.
// runRelaunch (on 'relaunch' from the navigator's ПЕРЕЗАПУСК): ctx.fx.pieces.fold({context:'relaunch'}) (seed: scramble +
// douse), «сплю. разбуди меня.»; the next click on the Key runs runWake (seed: lock + ignition + the signature).
// Hooks pass (ARCH-ADDENDUM X§2.8.2, H28d): runWake export, ctx.wake, the `boot` test-hook field.
import { after, cancelAfter, tween } from '../core/clock.js';
import { EASE } from '../core/ease.js';
import { ENV } from '../core/env.js';
import { app, setPhase } from '../core/store.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { registerHookField } from '../core/testhook.js';

// H28d: the boot test-hook field { t0, nLockAt, ignitionAt, idleAt } (perf ms, measured by the seed).
const marks = { t0: null, nLockAt: null, ignitionAt: null, idleAt: null };
registerHookField('boot', () => ({ ...marks }));
const perf = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

let relaunchHooked = false;

let said = false;
function bootStatus(ctx) {
  if (said) return;
  said = true;
  if (ctx.status) ctx.status.say(ctx.input.pointer.lastMove ? 'boot.pointer' : 'boot.nopointer');
}

/** → Promise<void> (resolves at phase 'idle') */
export function runBoot(ctx, initialRoute) {
  ctx.wake = (o) => runWake(ctx, o);          // H28d: before anything else
  void initialRoute;
  marks.t0 = perf(); marks.nLockAt = null; marks.ignitionAt = null; marks.idleAt = null;
  if (!relaunchHooked) { relaunchHooked = true; ctx.bus.on('relaunch', () => runRelaunch(ctx)); }
  const k = ctx.key, rm = ENV.reducedMotion;
  const timers = [], tweens = [];
  let finished = false, resolveBoot;
  const done = new Promise((r) => { resolveBoot = r; });
  const at = (ms, fn) => timers.push(after(ms, fn));
  const tw = (ms, fn, ease) => { const t = tween(ms, fn, ease); tweens.push(t); return t; };
  app.booting = true;
  said = false;
  if (app.phase !== 'boot') setPhase('boot');

  const ignite = () => {
    if (marks.ignitionAt == null) marks.ignitionAt = perf();
    if (!k) return;
    k.ignite({ color: app.night ? 'electrum' : 'ember', flash: true });
    ctx.bus.emit('boot:ignite', { returning: state.returning });
  };
  const assemble = (instant) => {
    if (ctx.chrome) (instant ? Promise.resolve() : ctx.chrome.typeIn()).then(() => ctx.chrome.assemble(instant ? 0 : undefined));
    if (ctx.keyNav) ctx.keyNav.show(instant ? { ms: 0 } : {});
    if (ctx.edges) ctx.edges.drawIn(instant ? 0 : undefined);
  };
  const finish = (skipped) => {
    if (finished) return;
    finished = true;
    for (const t of timers) cancelAfter(t);
    for (const t of tweens) t.cancel();
    removeConsumer();
    if (skipped) {
      if (k) {
        k.setScramble([0, 0, 0, 0, 0, 0, 0]);
        k.setReveal({ points: 1, scanY: null, fill: 1, alpha: 1 });
        ignite();
        k.shootAxis(3.2, 0);
      }
      if (ctx.nest) ctx.nest.setFade(1, 1);
      assemble(true);
    }
    if (ctx.composite) ctx.composite.setGrain(0.02);
    if (ctx.datum) ctx.datum.arrive('CORE', { instant: !!skipped });
    if (ctx.rim) ctx.rim.showName();
    if (k) { k.setBreathingRing(true); k.setIdle(true); k.setInteractive(true); }
    bootStatus(ctx);
    setPhase('idle');
    app.booting = false;
    marks.idleAt = perf();
    ctx.bus.emit('boot:done', { returning: state.returning, sameDay: state.sameDaySession, phone: layout.isPhone });
    resolveBoot();
  };
  const consumer = {
    name: 'boot',
    onGesture(g) { if (g.type === 'down' || g.type === 'tap' || g.type === 'wheel' || g.type === 'dragstart') finish(true); return true; },
    onKey() { finish(true); return true; },
  };
  const removeConsumer = ctx.input.push(consumer);

  if (!k) {
    // T0 (or no Key): the SVG Key's own boot, then the chrome.
    const t0 = ctx.t0 && ctx.t0.boot ? ctx.t0.boot({ phone: layout.isPhone, returning: state.returning, sameDay: state.sameDaySession, reduced: rm }) : Promise.resolve();
    assemble(false);
    t0.then(() => finish(false), () => finish(false));
    return done;
  }

  if (ctx.nest) ctx.nest.setFade(1, 0);
  if (ctx.audio) ctx.audio.play('bootSwell', {});
  if (rm) {
    // Reduced motion: aligned, no lock; fades only (≤ 1,200 ms).
    at(200, () => { if (ctx.nest) tw(400, (u) => ctx.nest.setFade(1, u)); });
    at(300, () => tw(400, (u) => k.setReveal({ points: u, scanY: null, fill: u, alpha: u })));
    at(700, () => { ignite(); bootStatus(ctx); k.shootAxis(3.2, 0); assemble(false); });
    at(1000, () => finish(false));
    return done;
  }
  k.setScramble('golden');
  at(600, () => { if (ctx.nest) tw(1000, (u) => ctx.nest.setFade(1, u), EASE.reveal); });
  // The chrome keeps its first-frame state (corner labels at 30 %) until the lock has begun, then types in + assembles.
  at(1300, () => assemble(false));
  at(900, () => tw(400, (u) => k.setReveal({ points: u, scanY: null, fill: u, alpha: u }), EASE.reveal));
  at(1000, () => {
    k.lockSequence({ order: 'down', stepMs: 220, spin: false, snap: 0.04 }).then(() => {
      if (finished) return;
      if (marks.nLockAt == null) marks.nLockAt = perf();   // order 'down': N locks last
      ignite();
      bootStatus(ctx);                 // said with the ignition, so it has faded in by the time the boot is idle
      k.shootAxis(3.2, 240).then(() => { if (!finished) finish(false); });
    });
  });
  return done;
}

/** H28d (X§2.8.2): the wake after СВЁРТКА (seed = the relaunch wake: lock + ignition + signature). → Promise<void>
 *  ПОКАЗ scene 1 passes show:true (WP2's real timeline burns the guest names after his). */
export function runWake(ctx, opts = { show: false }) {
  void opts;
  const k = ctx.key;
  if (ctx.fx && ctx.fx.pieces && typeof ctx.fx.pieces.wakeReset === 'function') { try { ctx.fx.pieces.wakeReset(); } catch (e) { /* cosmetic */ } }
  if (!k) return Promise.resolve();
  return k.lockSequence({ order: 'down', stepMs: 220, spin: false, snap: 0.04 }).then(() => {
    k.ignite({ color: app.night ? 'electrum' : 'ember', flash: true });
    ctx.bus.emit('boot:ignite', { returning: true, wake: true });
    if (ctx.audio) ctx.audio.play('signature', { found: ctx.secrets ? ctx.secrets.found() : [] });
  });
}

/** ПЕРЕЗАПУСК (seed): СВЁРТКА (ctx.fx.pieces.fold), «сплю. разбуди меня.»; the Key sleeps until the next click on it,
 *  which runs runWake. */
export async function runRelaunch(ctx) {
  const k = ctx.key;
  const pieces = ctx.fx && ctx.fx.pieces;
  if (pieces && typeof pieces.fold === 'function') { try { await pieces.fold({ context: 'relaunch' }); } catch (e) { /* cosmetic */ } }
  if (ctx.status) ctx.status.say('relaunch');
  if (!k) return;
  k.setScramble('golden');
  k.douse();
  let remove = null;
  remove = ctx.input.push({
    name: 'relaunch',
    onGesture(g) {
      if (g.type !== 'tap' || app.room !== 'CORE' || k.pick(g.x, g.y) < 0) return false;
      remove();
      runWake(ctx, { show: false });
      return true;
    },
  });
}
