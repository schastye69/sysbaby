// render/renderer.js — the one WebGLRenderer, Scene and PerspectiveCamera (ARCH §3.2).
//
// • Context: the WebGL2 context quality.detect() created on #gl (antialias = TIER_PARAMS[tier].msaa, fixed at creation).
// • Colour pipeline: ColorManagement off, LinearSRGB output, no tone mapping — palette hexes reach the screen unchanged.
// • Transparent canvas: clear (0, 0, 0, 0); the body (--void) and the #giant numeral show through empty pixels.
// • DPR: max(1, min(devicePixelRatio, dprCap[tier]) − 0.25·dropSteps); dropSteps only from the governor.
// • info.autoReset = false: the composite resets it once per frame so stats cover every pass.
// • Context loss: preventDefault, loop.stop(), emit 'gl:lost' (main shows the T0 overlay); restore → 'gl:restored',
//   loop.start().
import { WebGLRenderer, Scene, PerspectiveCamera, ColorManagement, LinearSRGBColorSpace, NoToneMapping } from 'three';
import { TIER_PARAMS } from '../core/quality.js';
import { layout } from '../core/layout.js';
import { bus } from '../core/bus.js';
import { loop } from '../core/loop.js';
import { U } from './uniforms.js';
import { RENDER, CAMERA } from '../core/tokens.js';

/** @returns {Renderer} */
export function createRenderer(canvas, gl, tier) {
  ColorManagement.enabled = false;
  const params = TIER_PARAMS[tier] || TIER_PARAMS.T2;
  const three = new WebGLRenderer({
    canvas, context: gl || undefined, antialias: !!params.msaa, alpha: true, premultipliedAlpha: true, depth: true,
    stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false,
  });
  three.outputColorSpace = LinearSRGBColorSpace;
  three.toneMapping = NoToneMapping;
  three.setClearColor(0x000000, 0);
  three.info.autoReset = false;
  three.autoClear = true;
  // Production: no synchronous shader-log queries on a program's first use (each one waits for the GPU to finish the
  // link — 100–300 ms per program on software GL). Dev builds keep three's error reporting.
  three.debug.checkShaderErrors = !!__DEV__;

  const scene = new Scene();
  scene.background = null;
  scene.matrixWorldAutoUpdate = true;
  const camera = new PerspectiveCamera(CAMERA.fov, Math.max(1, layout.w) / Math.max(1, layout.h), 0.01, 1000);
  camera.position.set(0, 0.75, 7.2);

  let cap = params.dprCap;
  let pinned = 0;
  const warmedPrograms = new WeakSet();
  let drop = 0;

  const r = {
    three, scene, camera,
    tier,
    dpr: 1,
    /** copied from three.info.render each frame by the composite (+ WP0 diagnostics) */
    stats: { calls: 0, triangles: 0, points: 0, geometries: 0, textures: 0, frameMs: 0, fps: 0 },
    setDprDrop(steps) { drop = Math.max(0, steps | 0); r.resize(); },
    setTier(t) { r.tier = t; cap = (TIER_PARAMS[t] || params).dprCap; r.resize(); },
    resize() {
      const dev = typeof devicePixelRatio === 'number' && devicePixelRatio > 0 ? devicePixelRatio : 1;
      r.dpr = Math.max(1, Math.min(dev, cap) - RENDER.dprStep * drop);
      const w = Math.max(1, layout.w), h = Math.max(1, layout.h);
      three.setPixelRatio(r.dpr);
      three.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      U.uPixelRatio.value = r.dpr;
      U.uResolution.value.set(Math.round(w * r.dpr), Math.round(h * r.dpr));
      for (const fn of resizeHooks) fn(r);
    },
    /** WP0 addition: program pinning. Every shader program three creates is kept for the session (one extra use
     *  count), so a hall disposed on leaving and rebuilt on the next visit reuses its programs instead of relinking
     *  them inside the travel. The set is small and bounded (one program per material variant). Called per frame. */
    pinPrograms() {
      const list = three.info.programs;
      if (!list || list.length === pinned) return;
      for (let i = pinned; i < list.length; i++) list[i].usedTimes++;
      pinned = list.length;
    },
    /** WP0 addition: compiles `object`'s programs (three.compile) AND completes their first use now (uniform and
     *  attribute queries wait for the link), so neither happens inside a later frame. Used at boot (main) and when a
     *  travel builds its destination hall (director), outside every travel clock. */
    warm(object, camera, scene) {
      three.compile(object, camera, scene || object);
      object.traverse((o) => {
        const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : null;
        if (!mats) return;
        for (const m of mats) {
          const pr = three.properties.get(m).currentProgram;
          if (pr && !warmedPrograms.has(pr)) { warmedPrograms.add(pr); pr.getUniforms(); pr.getAttributes(); }
        }
      });
      r.pinPrograms();
      // One real draw of everything into a 1 × 1 scissor of the scene's own target: uploads the buffers and builds the
      // driver's pipeline states (software GL compiles one per program × vertex layout × blend on first draw), then
      // waits for the GPU. Invisible (one corner pixel, redrawn by the next frame).
      const gl = three.getContext();
      const prevTarget = three.getRenderTarget(), prevAuto = three.autoClear, mask = camera.layers.mask;
      const parent = object.parent;
      try {
        three.setRenderTarget(r.sceneTarget || null);
        three.autoClear = false;
        three.setScissorTest(true);
        three.setScissor(0, 0, 1, 1);
        camera.layers.enableAll();
        three.render(object, camera);
      } finally {
        three.setScissorTest(false);
        three.autoClear = prevAuto;
        three.setRenderTarget(prevTarget);
        camera.layers.mask = mask;
        if (parent && object !== scene) object.updateWorldMatrix(true, true);   // render(object) dropped its parents
      }
      gl.finish();
    },
    /** The target the scene pass renders into (T3: the composite's rtScene; else null = the canvas). */
    sceneTarget: null,
    /** WP0 addition: called after every resize (composite render targets). → off() */
    onResize(fn) { resizeHooks.add(fn); return () => resizeHooks.delete(fn); },
    lost: false,
  };
  const resizeHooks = new Set();

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    r.lost = true;
    loop.stop();
    bus.emit('gl:lost', {});
  }, false);
  canvas.addEventListener('webglcontextrestored', () => {
    r.lost = false;
    r.resize();
    bus.emit('gl:restored', {});
    loop.start();
  }, false);

  bus.on('layout:change', () => r.resize());
  r.resize();
  return r;
}
