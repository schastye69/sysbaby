// main.js — bootstrap (ARCH §3.1.1). Runs once, after the DOM is parsed (the bundle is `defer`).
// Every step runs inside try/catch; a failure in steps 6–11 switches to T0 (step 6b) instead of a blank screen.
//
// Extra ctx fields (WP0 additions): ctx.composite (the boot sets the grain), ctx.navMap, ctx.cursor, ctx.pillar.
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
import { chrome } from './ui/chrome.js';
import { lead } from './ui/lead.js';
import { dims } from './ui/dims.js';
import { edges } from './ui/edges.js';
import { cursor } from './ui/cursor.js';
import { keyNav } from './nav/navigator.js';
import { navMap } from './nav/navMap.js';
import { hint } from './nav/hint.js';
import { installKeyboard } from './nav/keyboard.js';
import * as registry from './audio/registry.js';
import { runBoot } from './boot/boot.js';
import { mountT0 } from './t0/t0.js';
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
  U: null, worldFx: null, t0: null, composite: null, navMap: null, cursor: null, pillar: null,
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

  // 6a. WebGL path (tier ≥ T1) — 6b. T0 path (no WebGL, or 6a failed).
  if (app.tier !== 'T0') {
    if (!step('webgl', () => { ctx.composite = initWebGL(gl); })) fallbackT0();
  }
  if (app.tier === 'T0' && !ctx.t0) step('t0', () => { ctx.t0 = mountT0(ctx); app.tier = 'T0'; });

  // 7. DOM layer, in §3.1.1 order.
  const domOk = step('dom', () => {
    ctx.chrome = chrome; chrome.init(ctx);
    ctx.status = status; status.init(ctx);
    ctx.lead = lead; lead.init(ctx);
    ctx.overlay = overlay; overlay.init(ctx);
    ctx.dims = dims; dims.init(ctx);
    ctx.datum = datum; datum.init(ctx);
    ctx.edges = edges; edges.init(ctx);
    ctx.sheet = sheet; sheet.init(ctx);
    ctx.navMap = navMap; navMap.init(ctx);
    ctx.keyNav = keyNav; keyNav.init(ctx);
    ctx.cursor = cursor; cursor.init(ctx);
    if (app.tier === 'T0') chrome.setT0Marker(true);
  });

  // 8. Audio (no AudioContext yet).
  const audioOk = step('audio', () => { audio.init(ctx); });

  // 9. Input + keyboard (motion is passive).
  const inputOk = step('input', () => { input.init(ctx); installKeyboard(ctx); });

  // 10. Navigation: hall host, director (+ router listeners: hashchange, popstate). The initial route is parsed but not
  //     travelled to yet; CORE is built and made current with pose(null).
  let initialRoute = router.parseHash('#/core');
  const navOk = step('navigation', () => {
    initialRoute = router.parseHash(location.hash);
    hallHost.init(ctx);
    director.init(ctx);
  });

  // 11. Secrets, WP10's installs, the hint, the test hook.
  const secOk = step('secrets', () => { secrets.init(ctx); initSecrets(ctx); hint.init(ctx); });
  step('hook', () => { installTestHook(ctx); });

  // Steps 6–11 failed in the WebGL path → T0 instead of a blank screen.
  if (app.tier !== 'T0' && !(domOk && audioOk && inputOk && navOk && secOk)) {
    fallbackT0();
    step('t0', () => { ctx.t0 = mountT0(ctx); if (ctx.chrome) chrome.setT0Marker(true); });
  }

  // 12. Loop. The composite removes #ff-grain after the first presented WebGL frame; body.is-ff goes with it.
  step('loop', () => {
    quality.init(ctx);
    const composite = app.tier !== 'T0' ? ctx.composite : null;
    if (composite) {
      warmPrograms();
      loop.add(composite.render, ORDER.RENDER);
      composite.onFirstFrame(() => document.body.classList.remove('is-ff'));
    } else document.body.classList.remove('is-ff');
    loop.start();
    if (app.tier !== 'T0') quality.benchmark();
    bus.emit('app:ready', {});
  });

  // 13. Boot (WP2). It owns app.phase until setPhase('idle'); then CORE settles and the deep link is travelled to.
  step('boot', () => {
    const start = () => runBoot(ctx, initialRoute).then(() => finishBoot(initialRoute), (e) => { logOnce('main:boot', e); finishBoot(initialRoute); });
    if (ctx.composite && app.tier !== 'T0') ctx.composite.onFirstFrame(start); else start();
  });

  if (__DEV__) {
    // A3: dev-only handle for QA (removed from production builds).
    window.__SAMVIN_DEV__ = Object.freeze({
      ctx,
      mods: { bus, app, state, clock, ru, time, glyph, world, quality, audio, router, loop, rooms, registry,
        store, ease, spring, rng, env, layout, input, motion, fonts: { fontsReady },
        scale: scaleEngine, nest, rig, lamp, palette, fog, atlas, U, vin, structure: structureMod,
        paths, director, hallHost, overlay, datum, sheet, status, lead, dims, chrome, edges, cursor, keyNav, navMap, hint,
        secrets, secretRegistry,
        models: { resonanceModel, workshopModel, missionModel, timeline, strokeModel, dialModel, shapes, capsuleModel } },
      discover(id, vars) { return secrets.discover(id, { vars: vars || null }); },
      say(key, vars) { return status.say(key, vars || {}); },
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
  // Context loss: the T0 CORE is drawn over the canvas until the context is restored (mounted lazily).
  bus.on('gl:lost', () => { try { if (!ctx.t0) ctx.t0 = mountT0(ctx); ctx.t0.showLost(); } catch (e) { logOnce('main:t0', e); } });
  bus.on('gl:restored', () => { if (ctx.t0 && ctx.t0.hideLost) ctx.t0.hideLost(); });
  return createComposite(renderer);
}

/** Compiles every program the boot scene will need (incl. objects that only appear later: the rim name, the axis
 *  extension, the breathing ring), before the loop starts, so no shader link stalls a frame mid-boot or the first
 *  travel right after it (SwiftShader links take 100–300 ms each). Visibility is restored afterwards. */
function warmPrograms() {
  const three = ctx.renderer && ctx.renderer.three;
  if (!three || !ctx.scene || !ctx.camera) return;
  const hidden = [];
  ctx.scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
  try { three.compile(ctx.scene, ctx.camera); } catch (e) { logOnce('main:warm', e); }
  for (const o of hidden) o.visible = false;
}

/** After runBoot resolves (phase idle, datum «ЯДРО»): the CORE hall gets its arrival, then the deep link
 *  (ARCH §3.1.1 step 13, §4.3 "deep link on any visit"). */
function finishBoot(initialRoute) {
  if (app.phase === 'boot' || app.phase === 'start') setPhase('idle');
  app.booting = false;
  if (ctx.director) {
    ctx.director.settle();
    if (initialRoute && (initialRoute.room !== 'CORE' || initialRoute.sub)) ctx.director.go(initialRoute.hash, { source: 'deeplink' });
  }
}

/** A failure in steps 6–11 switches to T0 (step 6b): the three.js objects are dropped and the canvas hidden. */
function fallbackT0() {
  ctx.renderer = ctx.scene = ctx.camera = ctx.key = ctx.rim = ctx.rig = ctx.scale = ctx.nest = ctx.lamp = null;
  ctx.composite = null;
  quality.tier = 'T0';
  app.tier = 'T0';
  const gl = document.getElementById('gl');
  if (gl) gl.hidden = true;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
