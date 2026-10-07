// fx/fx.js — ctx.fx, the time & scale layer (ARCH-ADDENDUM X§2.5; SPEC-ADDENDUM A2, A6.3). OWNER: WP12.
// WP0 SEED (hook H28a): the full Fx surface with inert-but-correct behaviour so every caller works before WP12 lands:
//   stage.run runs fn at once (serially chained) → 'ran'; cue.at fires visual (+ audio at ctxTimeFor(V) when ready) at V;
//   impact.pause resolves after 400 ms with NO freeze and NO gate; prosvet → false; wave.fire returns the 343 m/s arrival
//   clock without uniforms; focus / scale bar / figure / dust are no-ops (dust.enabled = false, emitters are no-op
//   handles); pulse.run → a no-op handle; pieces.fold = key.setScramble('golden') + key.douse(), resolving after 600 ms;
//   pieces.owner / nadirUnseal resolve at once; setLineAlpha / fogFactor write through. createFxT0 has the same surface.
import { U } from '../render/uniforms.js';
import { fog } from '../render/fog.js';
import { loop } from '../core/loop.js';
import { after, cancelAfter } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { app } from '../core/store.js';
import { registerHookField } from '../core/testhook.js';

export const SPEED_OF_SOUND = 343;
const perf = () => performance.now();
const noopHandle = () => ({ set() {}, release() {}, alive: false });

function createSurface(ctx, t0mode) {
  // ── stage lock (seed: serial, never reduced, never deferred) ──
  let chain = Promise.resolve();
  const stage = {
    current: null,
    queue: [],
    run(name, fn, opts = { maxWaitMs: 1200 }) {
      void opts;
      const p = chain.then(async () => {
        stage.current = name; app.fx.stage = name;
        try { await (typeof fn === 'function' ? fn({ reduced: false, signal: { aborted: false } }) : null); } catch (e) { /* the piece's own */ }
        stage.current = null; app.fx.stage = null;
        return 'ran';
      });
      chain = p.catch(() => 'ran');
      return p;
    },
    busy() { return stage.current != null; },
    deferToIdleCore(name, fn) { return stage.run(name, fn); },
  };

  // ── cue clock (seed: loop-time timers; no latency compensation beyond the facade mapping) ──
  const cue = {
    at(V, spec) {
      const s = spec || {};
      const id = after(Math.max(0, V - perf()), () => {
        try { if (s.visual) s.visual(); } catch (e) { /* caller's */ }
        try { if (s.audio && audio.fx.ready()) s.audio(audio.fx.ctxTimeFor(V)); } catch (e) { /* caller's */ }
      });
      return { cancel() { cancelAfter(id); } };
    },
    now(spec) {
      const s = spec || {};
      try { if (s.visual) s.visual(); } catch (e) { /* caller's */ }
      try { if (s.audio && audio.fx.ready()) s.audio(); } catch (e) { /* caller's */ }
    },
    cancelAfter(V) { void V; },
    presentAt(rafTs) { return rafTs + 16.7; },
    log() { return []; },
    nowPerf() { return perf(); },
  };

  // ── ПАУЗА / ПРОСВЕТ (seed: timing only) ──
  const impact = {
    lastPauseAt: -Infinity,
    lastProsvetAt: -Infinity,
    pause(opts = {}) {
      const at = opts && Number.isFinite(opts.at) ? opts.at : perf();
      impact.lastPauseAt = at;
      return new Promise((res) => after(Math.max(0, at + 400 - perf()), () => {
        const hitAt = at + 400;
        try { if (opts && opts.onHit) opts.onHit(hitAt); } catch (e) { /* caller's */ }
        res({ hitAt, advanced: false, skipped: false });
      }));
    },
    inPause() { return false; },
    prosvet(opts) { void opts; return false; },
  };

  // ── ВОЛНА 343 (seed: the arrival clock only) ──
  const wave = {
    fire(opts) {
      void opts;
      const startAt = perf();
      return { startAt, arrival: (distM) => startAt + (1000 * (+distM || 0)) / SPEED_OF_SOUND, stop() {} };
    },
  };

  const focus = { rack(opts) { void opts; return Promise.resolve(); }, set() {}, clear() {} };
  const pulse = { run(opts) { void opts; return { stop() {} }; }, stopAll() {} };
  const scalebar = { show() {}, hide() {}, set() {}, rmLabel() {} };
  const scaleFigure = { show() {}, hide() {}, state: () => ({ visible: false, heightPx: 0 }) };
  const dust = {
    enabled: false,
    emitter() { return noopHandle(); },
    splat() {}, impulse() {}, sheet() {},
    stats: () => ({ pool: 0, live: 0 }),
  };

  // ── pieces ──
  const twin = (kind, opts) => { try { if (ctx.t0 && typeof ctx.t0.twin === 'function') ctx.t0.twin(kind, opts); } catch (e) { /* cosmetic */ } };
  const pieces = {
    titleFx(opts) { void opts; return { stop() {} }; },
    swarf() {},
    fold(opts) {
      void opts;
      const k = ctx.key;
      if (k) { k.setScramble('golden'); k.douse(); } else if (t0mode) twin('close', { phase: 'asleep', t01: 1 });
      return new Promise((res) => after(600, res));
    },
    wakeReset() {},
    owner(opts) { void opts; return Promise.resolve({ hitAt: perf(), rimAt: null, echoAt: null }); },
    nadirUnseal() { return Promise.resolve({ hitAt: perf() }); },
  };

  const fx = {
    stage, cue, impact, wave, focus, pulse, scalebar, scaleFigure, dust, pieces,
    setLineAlpha(a, ms) { void ms; U.uFxLineA.value = Math.max(0, +a || 0); },
    fogFactor(name, f, ms) { void ms; fog.factor(name, f); },
    ears: { tabReturn() {}, descent() {}, popAt() {} },
    provalFor(ms) { return new Promise((res) => after(Math.max(0, ms || 0), res)); },
    setTier(tier) { void tier; },
    snapshot() {
      return { stage: stage.current, queue: stage.queue.slice(), impacts: [], prosvet: [], waveArrivalMs: null, timeScale: loop.timeScale, dust: dust.stats() };
    },
  };
  registerHookField('fx', () => fx.snapshot());
  registerHookField('scaleBar', () => null);
  registerHookField('figure', () => null);
  return fx;
}

/** → Fx (WebGL tiers) */
export function createFx(ctx) { return createSurface(ctx, false); }
/** → Fx (T0): identical method names and timing; visuals via ctx.t0?.twin(kind, opts) (no-ops without ctx.t0). */
export function createFxT0(ctx) { return createSurface(ctx, true); }
