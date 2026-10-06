// main.js — bootstrap (ARCH §3.1.1). Runs once, after the DOM is parsed (the bundle is `defer`).
// Every step runs inside try/catch; a failure in steps 6–11 switches to T0 (step 6b) instead of a blank screen.
//
// STAGE 0A: steps 1–5, 8, 9 (input), 12 are live. Steps 6a/6b (renderer, nest, Key, rim, lamp, rig, composite / T0),
// 7 (DOM layer), 9 (keyboard), 10 (navigation), 11 (secrets + test hook) and 13 (boot) are wired by stages 0B–0D at the
// marked places, keeping this order.
import { ENV, logOnce } from './core/env.js';
import { layout, measureLayout } from './core/layout.js';
import { bus } from './core/bus.js';
import * as store from './core/store.js';
import { app } from './core/store.js';
import { loop } from './core/loop.js';
import * as clock from './core/clock.js';
import * as ru from './core/ru.js';
import * as time from './core/time.js';
import * as glyph from './core/glyph.js';
import * as ease from './core/ease.js';
import * as spring from './core/spring.js';
import * as rng from './core/rng.js';
import * as env from './core/env.js';
import { motion } from './core/motion.js';
import { state, initState } from './core/state.js';
import { fontsReady } from './core/fonts.js';
import { quality } from './core/quality.js';
import { input } from './core/input.js';
import * as world from './data/world.js';
import { WORLD } from './data/world.js';
import { audio } from './audio/engine.js';
import * as router from './nav/router.js';
import { Group, Vector3 } from 'three';
import { breath } from './core/clock.js';
import { ORDER } from './core/loop.js';
import { createRenderer } from './render/renderer.js';
import { createComposite } from './render/composite.js';
import { U } from './render/uniforms.js';
import { palette } from './render/palette.js';
import { fog } from './render/fog.js';
import { atlas } from './render/engraveAtlas.js';
import { scaleEngine } from './render/scale.js';
import { rig } from './render/cameraRig.js';
import { lamp } from './render/lamp.js';
import { nest } from './world/nest.js';
import * as vin from './world/vin.js';
import { createAxisPillar } from './world/vin.js';
import * as structureMod from './world/structure.js';
import * as rooms from './world/rooms.js';
import { ROOMS } from './world/rooms.js';
import { createKey } from './key/key.js';
import { createRim } from './world/rim.js';
import { CAMERA } from './core/tokens.js';
import { setPhase } from './core/store.js';
import { hallHost } from './halls/host.js';
import { director } from './nav/director.js';
import * as paths from './nav/paths.js';
import { datum } from './ui/datum.js';
import { overlay } from './ui/overlay.js';
import { sheet } from './ui/sheet.js';
import { status } from './ui/status.js';
import { installTestHook } from './core/testhook.js';
import { secrets } from './secrets/secrets.js';
import { initSecrets } from './secrets/index.js';
import * as secretRegistry from './secrets/registry.js';
import * as resonanceModel from './halls/core/resonanceModel.js';
import * as workshopModel from './halls/members/workshopModel.js';
import * as missionModel from './halls/voyages/missionModel.js';
import * as timeline from './halls/archive/timeline.js';
import * as strokeModel from './halls/signal/stroke.js';
import * as dialModel from './halls/signal/dial.js';
import * as shapes from './halls/insignia/shapes.js';
import * as capsuleModel from './halls/insignia/capsuleModel.js';

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

  // 6a. WebGL path (tier ≥ T1).
  let composite = null;
  if (app.tier !== 'T0') {
    const ok = step('webgl', () => { composite = initWebGL(gl); });
    if (!ok) fallbackT0();
  }
  // 6b. T0 path — stage 0D: ctx.t0 = mountT0(ctx); app.tier = 'T0'.

  // 7. DOM layer. Stage 0C: overlay, datum, sheet (the hall frame + readable-block mechanisms). Stage 0D adds chrome,
  //    status (full engine), lead, dims, edges, navMap, keyNav, cursor — in this order: chrome, status, lead, overlay, dims,
  //    datum, edges, sheet, navMap, keyNav, cursor.
  step('dom', () => {
    ctx.status = status; status.init(ctx);
    ctx.overlay = overlay; overlay.init(ctx);
    ctx.datum = datum; datum.init(ctx);
    ctx.sheet = sheet; sheet.init(ctx);
  });

  // 8. Audio (no AudioContext yet).
  step('audio', () => { audio.init(ctx); });

  // 9. Input (+ keyboard, stage 0D).
  step('input', () => { input.init(ctx); });

  // 10. Navigation: hall host, director (+ router listeners: hashchange, popstate). The initial route is parsed but not
  //     travelled to yet; CORE is built and made current with pose(null).
  let initialRoute = router.parseHash('#/core');
  const navOk = step('navigation', () => {
    initialRoute = router.parseHash(location.hash);
    hallHost.init(ctx);
    director.init(ctx);
  });
  if (!navOk && app.tier !== 'T0') fallbackT0();
  // 11. Secrets & test hook. Stage 0D adds secrets.init, initSecrets (WP10 seed) and hint.init before the hook.
  step('secrets', () => { secrets.init(ctx); initSecrets(ctx); });
  step('hook', () => { installTestHook(ctx); });

  // 12. Loop. The composite (0B) removes #ff-grain after the first presented WebGL frame; body.is-ff goes then.
  step('loop', () => {
    quality.init(ctx);
    if (composite) {
      loop.add(composite.render, ORDER.RENDER);
      composite.onFirstFrame(() => document.body.classList.remove('is-ff'));
    }
    loop.start();
    if (app.tier !== 'T0') quality.benchmark();
    bus.emit('app:ready', {});
  });

  // 13. Boot — stage 0D seed / WP2: runBoot(ctx, initialRoute).
  //     STAND-IN until runBoot exists (stage 0B): the rim rises from 600 ms, the Key reveals from 1,000 ms (400 ms),
  //     ignited, the axis shot, the rim name shown, breath on. Stage 0D replaces this block with runBoot.
  if (ctx.key) step('boot-standin', () => standInBoot(composite, initialRoute));
  else step('boot-standin', () => finishBoot(initialRoute));

  if (__DEV__) {
    // A3: dev-only handle for QA (removed from production builds). Later stages add their modules to `mods`.
    window.__SAMVIN_DEV__ = Object.freeze({
      ctx,
      // ARCH A3 names (later stages add rooms, paths, director, secrets, registry, status, lead, keyNav, overlay, datum,
      // hallHost) plus WP0-internal extras for qa/wp0/unit.mjs (ease, spring, rng, env, layout, input, motion, fonts).
      mods: { bus, app, state, clock, ru, time, glyph, world, quality, audio, router, loop, rooms,
        store, ease, spring, rng, env, layout, input, motion, fonts: { fontsReady },
        scale: scaleEngine, nest, rig, lamp, palette, fog, atlas, U, vin, structure: structureMod,
        paths, director, hallHost, overlay, datum, sheet, status, secrets, secretRegistry,
        models: { resonanceModel, workshopModel, missionModel, timeline, strokeModel, dialModel, shapes, capsuleModel } },
      discover(id, vars) { return secrets.discover(id, { vars: vars || null }); },
      say() { return false; },
      emit(name, payload) { bus.emit(name, payload); },
    });
  }
}

/** The CORE rest pose (SPEC §6.1): desktop (0, 0.75, 7.2) → origin, fov 35; phone the same with offsetY −0.06. */
function corePose() {
  const c = CAMERA.core;
  return { pos: new Vector3(...c.pos), target: new Vector3(...c.target), fov: c.fov, offsetY: layout.kind === 'desktop' ? 0 : c.phoneOffsetY, roll: 0 };
}

/** Step 6a: renderer, palette/U/fog, scale engine, nest, Key, rim, lamp, rig, composite. → composite */
function initWebGL(gl) {
  const renderer = createRenderer(document.getElementById('gl'), gl, app.tier);
  ctx.renderer = renderer; ctx.scene = renderer.scene; ctx.camera = renderer.camera;
  ctx.palette = palette; ctx.U = U; ctx.fog = fog;
  palette.init();
  atlas.init(app.tier);
  ctx.atlas = atlas;
  fog.set(ROOMS.CORE.fog);
  scaleEngine.init(renderer.scene, ctx);
  ctx.scale = scaleEngine;
  ctx.worldFx = new Group();
  ctx.worldFx.name = 'worldFx';
  scaleEngine.root.add(ctx.worldFx);
  nest.init(ctx);
  ctx.nest = nest;
  ctx.pillar = createAxisPillar();
  scaleEngine.root.add(ctx.pillar);
  ctx.key = createKey(ctx);
  nest.level(0).add(ctx.key.group);
  loop.add(ctx.key.update, ORDER.WORLD);
  ctx.rim = createRim(ctx);
  scaleEngine.root.add(ctx.rim.group);
  lamp.init(ctx);
  ctx.lamp = lamp;
  rig.init(renderer.camera);
  ctx.rig = rig;
  rig.setPose(corePose());
  // Until the director exists (stage 0C) the CORE rest pose follows layout changes.
  bus.on('layout:change', () => { if (!ctx.director) rig.setPose(corePose()); });
  loop.add((dt, t) => { U.uTime.value = t / 1000; U.uBreath.value = breath.mix(0, 1); }, ORDER.CLOCK);
  loop.add((dt) => lamp.update(dt), ORDER.LAMP);
  loop.add((dt) => rig.apply(dt), ORDER.CAMERA);
  bus.on('gl:lost', () => { if (ctx.t0 && ctx.t0.showLost) ctx.t0.showLost(); });
  bus.on('gl:restored', () => { if (ctx.t0 && ctx.t0.hideLost) ctx.t0.hideLost(); });
  return createComposite(renderer);
}

/** Stage-0B stand-in for runBoot (see step 13): SPEC §4.1's first 600 ms are void + grain only, then the rim lattice
 *  rises (600–1,600 ms) and the Key reveals (1,000–1,400 ms), ignites and shoots its axis. Replaced by runBoot (0D). */
function standInBoot(composite, initialRoute) {
  const k = ctx.key;
  nest.setFade(1, 0);
  const go = () => {
    clock.after(600, () => clock.tween(1000, (u) => nest.setFade(1, u), ease.EASE.reveal));
    clock.after(1000, () => {
      clock.tween(400, (u) => k.setReveal({ points: u, scanY: null, fill: u, alpha: u }), ease.EASE.reveal).done.then(() => {
        k.ignite({ color: app.night ? 'electrum' : 'ember', flash: true });
        k.shootAxis(3.2, 240);
        if (ctx.rim) ctx.rim.showName();
        k.setIdle(true);
        if (composite) composite.setGrain(0.02);
        finishBoot(initialRoute);
      });
    });
  };
  if (composite) composite.onFirstFrame(go); else go();
}

/** End of the (stand-in) boot: phase idle, datum «ЯДРО», the CORE hall arrives, then the deep link (ARCH §3.1.1 step 13). */
function finishBoot(initialRoute) {
  setPhase('idle');
  app.booting = false;
  if (ctx.datum) ctx.datum.arrive('CORE');
  if (ctx.director) {
    ctx.director.settle();
    if (initialRoute && (initialRoute.room !== 'CORE' || initialRoute.sub)) ctx.director.go(initialRoute.hash, { source: 'deeplink' });
  }
}

/** A failure in steps 6–11 switches to T0 (the T0 mount itself is stage 0D / WP11). */
function fallbackT0() {
  ctx.renderer = ctx.scene = ctx.camera = ctx.key = ctx.rim = ctx.rig = ctx.scale = ctx.nest = ctx.lamp = null;
  quality.tier = 'T0';
  app.tier = 'T0';
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
