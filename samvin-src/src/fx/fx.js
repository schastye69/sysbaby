// fx/fx.js — ctx.fx, «ВРЕМЯ И МАСШТАБ»: the time grammar and the truthful-scale layer (ARCH-ADDENDUM X§2.5; SPEC-ADDENDUM
// A1.1 L1–L6, A2, A6.3). OWNER: WP12. createFx (WebGL tiers) and createFxT0 (T0) expose the same surface with the same
// timing; in T0 the pictures are ctx.t0.twin() calls and dust / focus / the scale figure are no-ops.
// One fx frame at loop order 25 (after the director, before WORLD, so a ПАУЗА's timeScale applies to the same frame):
// clock → cue clock → ПАУЗА / ПРОСВЕТ → pulse → wave → path decorators → pieces → focus → scale figure → dust.
// Hook fields: fx, scaleBar, figure. Bus: fx:stage, fx:impact (emitted by stage / impact).
import { U } from '../render/uniforms.js';
import { fog } from '../render/fog.js';
import { loop } from '../core/loop.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { logOnce } from '../core/env.js';
import { registerHookField } from '../core/testhook.js';
import { clk, tickClock, createCue, perf } from './cue.js';
import { createStage } from './stage.js';
import { createImpact } from './impact.js';
import { createWave } from './wave.js';
import { createFocus } from './focus.js';
import { attachDofTaps } from '../render/lines.js';
import { Vector3 } from 'three';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { KEY } from '../core/tokens.js';
import { createPulse } from './pulse.js';
import { createScalebar } from './scalebar.js';
import { createScaleFigure } from './scaleFigure.js';
import { createPathDeco } from './pathDeco.js';
import { createEars } from './ears.js';
import { createTwins } from './t0fx.js';
import { createDust } from './dust/dust.js';
import { titleFx } from './pieces/title.js';
import { createFold } from './pieces/fold.js';
import { createOwner } from './pieces/owner.js';
import { createNadir } from './pieces/nadir.js';
import { swarf } from './pieces/swarf.js';

export { SPEED_OF_SOUND } from './cue.js';

const NOFIG = { show() {}, hide() {}, state: () => ({ visible: false, heightPx: 0 }), frame() {} };
const NODUST = { enabled: false, live: 0, splats: 0, emitter: () => ({ set() {}, release() {}, alive: false }), splat() {}, impulse() {},
  sheet() {}, stats: () => ({ pool: 0, live: 0 }), ambientTerm() {}, lampTerm() {}, deposit() {}, collapse() {}, frame() {} };

function build(ctx, t0) {
  const F = { ctx, t0, warmNext: false, warmNow: false, folded: false };
  const tw = createTwins(ctx, t0);
  F.twin = tw.twin; F.freeze = tw.freeze;
  // Tweened fog factor channels ('impact', 'ears', 'close'): immediate when ms is 0.
  const fogVal = new Map(), fogT = new Map();
  const fogSet = (name, f) => { fogVal.set(name, f); fog.factor(name, f); };
  F.fogFactor = (name, f, ms) => {
    if (t0) return;
    if (!(ms > 0)) { fogT.delete(name); fogSet(name, f); return; }
    fogT.set(name, { from: fogVal.get(name) || 1, to: f, t0: perf(), ms });
  };
  let lineT = null;
  F.setLineAlpha = (a, ms) => {
    if (!(ms > 0)) { lineT = null; U.uFxLineA.value = Math.max(0, +a || 0); return; }
    lineT = { from: U.uFxLineA.value, to: Math.max(0, +a || 0), t0: perf(), ms };
  };
  const ticks = [];
  F.addTick = (fn) => { const e = { fn, on: true }; ticks.push(e); return () => { e.on = false; }; };

  F.cue = createCue();
  F.stage = createStage(ctx);
  F.pulse = createPulse(F);
  F.impact = createImpact(F);
  F.dust = t0 ? NODUST : createDust(F);
  F.wave = createWave(F);
  F.focus = createFocus();
  // The hairline lattices (the Key's and VIN's) spread their circle of confusion over two DOF taps (A2.6.2).
  // The Key's own lattice only shows (R1) once the camera is within ≈ 2.4 m of it — the DIVE; at rest and through the
  // title it is collapsed, so its taps are only drawn while the camera is that close.
  if (!t0) {
    const _k = new Vector3();
    const keyNear = () => !!(ctx.key && rig.camera)
      && _k.copy(ctx.key.nucleusWorld).distanceTo(rig.camera.position) / Math.max(1e-9, scaleEngine.s) < 2 * KEY.lattice.solidBelowCamDist;
    if (ctx.key && ctx.key.structure && ctx.key.structure.lattice) attachDofTaps(ctx.key.structure.lattice, keyNear);
    for (const j of [1, 2]) { const st = ctx.nest && ctx.nest.structure(j); if (st && st.lattice) attachDofTaps(st.lattice); }
  }
  F.scalebar = createScalebar(F);
  F.figure = t0 || !ctx.nest ? NOFIG : createScaleFigure(F);
  const deco = createPathDeco(F);
  const { ears, provalFor } = createEars(F);
  const fold = createFold(F);
  F.focus.caps();
  bus.on('tier:change', () => F.focus.caps());
  bus.on('layout:change', () => F.focus.caps());
  bus.on('travel:start', () => { if (F.folded) fold.wakeReset(); });

  function frame() {
    tickClock();
    F.cue.frame();
    F.impact.frame();
    F.pulse.frame();
    F.wave.frame();
    F.scalebar.frame();
    deco.frame();
    for (let i = ticks.length - 1; i >= 0; i--) {
      const e = ticks[i];
      let keep = false;
      if (e.on) { try { keep = e.fn() !== false; } catch (err) { logOnce('fx:tick', err); } }
      if (!keep) { e.on = false; ticks.splice(i, 1); }
    }
    fogT.forEach(stepFog);
    if (lineT) {
      const x = Math.min(1, (perf() - lineT.t0) / lineT.ms);
      U.uFxLineA.value = lineT.from + (lineT.to - lineT.from) * x;
      if (x >= 1) lineT = null;
    }
    F.focus.frame();
    F.figure.frame();
    F.dust.frame();
  }
  function stepFog(o, name) {
    const x = Math.min(1, (perf() - o.t0) / o.ms);
    fogSet(name, o.from + (o.to - o.from) * x);
    if (x >= 1) fogT.delete(name);
  }
  loop.add(frame, 25);

  const fx = {
    stage: F.stage, cue: F.cue, impact: F.impact, wave: F.wave, focus: F.focus, pulse: F.pulse,
    scalebar: F.scalebar, scaleFigure: F.figure, dust: F.dust,
    pieces: {
      titleFx: (o) => titleFx(F, o),
      swarf: (i) => swarf(F, i),
      fold: fold.fold,
      wakeReset: fold.wakeReset,
      owner: createOwner(F),
      nadirUnseal: createNadir(F),
    },
    setLineAlpha: F.setLineAlpha,
    fogFactor: F.fogFactor,
    ears,
    provalFor,
    setTier(tier) { void tier; F.focus.caps(); },
    snapshot() {
      const s = F.impact.snapshot();
      return { stage: F.stage.current, queue: F.stage.queue.slice(), impacts: s.impacts, prosvet: s.prosvet,
        waveArrivalMs: F.wave.lastArrival300, timeScale: loop.timeScale, dust: F.dust.stats() };
    },
  };
  if (__DEV__) fx._F = F;                                  // dev QA / debugging only (stripped from production)
  registerHookField('fx', () => fx.snapshot());
  registerHookField('scaleBar', () => { const l = F.scalebar.label; return l ? { label: l } : null; });
  registerHookField('figure', () => (t0 ? null : F.figure.state()));
  void clk; void app;
  return fx;
}

/** → Fx (WebGL tiers) */
export function createFx(ctx) { return build(ctx, false); }
/** → Fx (T0): identical method names and timing; visuals via ctx.t0?.twin(kind, opts); dust / focus / figure no-ops. */
export function createFxT0(ctx) { return build(ctx, true); }
