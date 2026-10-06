// main.js — bootstrap (ARCH §3.1.1). Runs once, after the DOM is parsed (the bundle is `defer`).
// Every step runs inside try/catch; a failure in steps 6–11 switches to T0 (step 6b) instead of a blank screen.
//
// STAGE 0A: steps 1–5, 8, 9 (input), 12 are live. Steps 6a/6b (renderer, nest, Key, rim, lamp, rig, composite / T0),
// 7 (DOM layer), 9 (keyboard), 10 (navigation), 11 (secrets + test hook) and 13 (boot) are wired by stages 0B–0D at the
// marked places, keeping this order.
import { ENV, logOnce } from './core/env.js';
import { layout, measureLayout } from './core/layout.js';
import { bus } from './core/bus.js';
import { app } from './core/store.js';
import { loop } from './core/loop.js';
import * as clock from './core/clock.js';
import * as ru from './core/ru.js';
import * as time from './core/time.js';
import * as glyph from './core/glyph.js';
import { state, initState } from './core/state.js';
import { fontsReady } from './core/fonts.js';
import { quality } from './core/quality.js';
import { input } from './core/input.js';
import * as world from './data/world.js';
import { WORLD } from './data/world.js';
import { audio } from './audio/engine.js';
import * as router from './nav/router.js';

/** AppCtx (ARCH §3.1.2) — created once; the same object goes to every factory and init. */
const ctx = {
  world: WORLD, state, app, bus, loop, quality, layout, input, audio,
  secrets: null, status: null, sheet: null, edges: null, hint: null, fog: null, palette: null, atlas: null, lead: null,
  overlay: null, dims: null, datum: null, chrome: null, keyNav: null, director: null, halls: null,
  renderer: null, scene: null, camera: null, rig: null, scale: null, nest: null, key: null, rim: null, lamp: null,
  U: null, worldFx: null, t0: null,
};

function step(name, fn) {
  try { fn(); return true; } catch (e) { logOnce(`main:${name}`, `boot step "${name}" failed`, e); return false; }
}

function boot() {
  // 1. Environment.
  step('env', () => { void ENV.reducedMotion; measureLayout(); });

  // 2. Data — WORLD was validated at module load (data/world.js).

  // 3. State.
  step('state', () => {
    initState(time.now());
    const t = time.now();
    app.night = time.isNight(t);
    app.drowsy = time.isDrowsy(t);
    app.birthday = time.isBirthday(t);
    app.owner = !!state.data.owner;
    app.inverted = !!state.data.inverted;
    document.documentElement.style.setProperty('--shrp', String(state.shrp));
    state.deliverTransmissions();
  });

  // 4. Fonts (started, not awaited).
  step('fonts', () => { fontsReady(); });

  // 5. Quality.
  let gl = null;
  step('quality', () => { gl = quality.detect().gl; });

  // 6a. WebGL path (tier ≥ T1) — stage 0B: createRenderer(#gl, gl, tier); palette, U, fog; scaleEngine.init(scene);
  //     nest.init(ctx); ctx.key = createKey(ctx); ctx.rim = createRim(ctx); lamp.init(ctx); rig.init(camera);
  //     composite = createComposite(renderer) (+ loop.add(composite.render, ORDER.RENDER), onFirstFrame).
  // 6b. T0 path — stage 0D: ctx.t0 = mountT0(ctx); app.tier = 'T0'.
  void gl;

  // 7. DOM layer — stage 0D: chrome, status, lead, overlay, dims, datum, edges, sheet, navMap, keyNav, cursor.

  // 8. Audio (no AudioContext yet).
  step('audio', () => { audio.init(ctx); });

  // 9. Input (+ keyboard, stage 0D).
  step('input', () => { input.init(ctx); });

  // 10. Navigation — stage 0C: hallHost.init, director.init, router listeners, initial route, CORE built.
  // 11. Secrets & test hook — stage 0D.

  // 12. Loop. The composite (0B) removes #ff-grain after the first presented WebGL frame; body.is-ff goes then.
  step('loop', () => {
    quality.init(ctx);
    loop.start();
    if (app.tier !== 'T0') quality.benchmark();
    bus.emit('app:ready', {});
  });

  // 13. Boot — stage 0D seed / WP2: runBoot(ctx, initialRoute).

  if (__DEV__) {
    // A3: dev-only handle for QA (removed from production builds). Later stages add their modules to `mods`.
    window.__SAMVIN_DEV__ = Object.freeze({
      ctx,
      mods: { bus, app, state, clock, ru, time, glyph, world, quality, audio, router, loop },
      discover() { return false; },
      say() { return false; },
      emit(name, payload) { bus.emit(name, payload); },
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
