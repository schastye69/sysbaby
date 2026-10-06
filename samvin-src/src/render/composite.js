// render/composite.js — the whole frame (ARCH §3.2, SPEC §2.4 R6/R7).
//
//   T1, T2: (1) scene → canvas (MSAA per tier). (2) one full-screen grain + vignette overlay (CustomBlending One /
//           OneMinusSrcAlpha, premultiplied output).
//   T3:     (1) scene, layers DEFAULT + NOFOG → rtScene (HalfFloat, 4 samples). (2) layer EMISSIVE only → rtEmissive at
//           ½ resolution, cleared black. (3) dual-Kawase bloom, 4 levels, threshold 0.82. (4) final quad → canvas:
//           scene + bloom, then the same grain + vignette.
// Grain: hash noise per device pixel, re-seeded on a 24 fps step clock (static under reduced motion), amplitude uGrain
// (0.025 until the boot calls setGrain(0.02)); emitted as premultiplied white/black with alpha |g| so it shows on the
// void too; × smoothstep(120, 180, CSS px distance to the pointer) — the grain clears around his cursor.
// Vignette: 0.18 · smoothstep(0.35, 1, length(uvc · (aspect, 1)) / length((aspect, 1))), uvc ∈ [−1, 1].
// After the first presented WebGL frame: #ff-grain is removed and the onFirstFrame callbacks run (main: body.is-ff).
import {
  WebGLRenderTarget, HalfFloatType, RGBAFormat, LinearFilter, ShaderMaterial, Mesh, Scene, OrthographicCamera,
  Vector2, CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation, NoBlending,
} from 'three';
import { U, LAYER, registerTexture, unregisterTexture } from './uniforms.js';
import { createKawaseBloom, fullscreenTriangle } from './kawase.js';
import { RENDER } from '../core/tokens.js';
import { ENV } from '../core/env.js';
import { loop } from '../core/loop.js';
import { input } from '../core/input.js';
import { bus } from '../core/bus.js';

const R7 = RENDER.r7;

const VERT = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const FRAG = /* glsl */ `
uniform vec2 uRes; uniform float uPR, uGrain, uSeed, uVig; uniform vec2 uPointer;
#ifdef USE_SCENE
uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uBloom;
#endif
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float g = (hash(fc + vec2(uSeed * 61.0, uSeed * 37.0)) - 0.5) * 2.0 * uGrain;
  vec2 css = vec2(fc.x, uRes.y - fc.y) / uPR;
  g *= smoothstep(${R7.clearInPx.toFixed(1)}, ${R7.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${R7.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
  float a = 1.0 - (1.0 - v) * (1.0 - abs(g));
  float w = max(g, 0.0);
#ifdef USE_SCENE
  vec4 s = texture2D(tScene, uv);
  vec3 b = texture2D(tBloom, uv).rgb * uBloom;
  vec3 col = s.rgb + b;
  float A = min(1.0, s.a + max(b.r, max(b.g, b.b)));
  gl_FragColor = vec4(min(col, vec3(A)) * (1.0 - a) + vec3(w), A * (1.0 - a) + a);
#else
  gl_FragColor = vec4(vec3(w), a);
#endif
}`;

const FRAMES = 120;

/** @returns {Composite} */
export function createComposite(renderer) {
  const three = renderer.three, scene = renderer.scene, camera = renderer.camera;
  const post = new Scene();
  const postCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uRes: { value: new Vector2(1, 1) }, uPR: { value: 1 }, uGrain: { value: R7.grainBoot }, uSeed: { value: 0 },
    uVig: { value: R7.vignette }, uPointer: { value: new Vector2(-9999, -9999) },
    tScene: { value: null }, tBloom: { value: null }, uBloom: { value: 1.0 },
  };
  const overlayMat = new ShaderMaterial({
    uniforms, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false, transparent: true,
    blending: CustomBlending, blendEquation: AddEquation, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor,
    blendSrcAlpha: OneFactor, blendDstAlpha: OneMinusSrcAlphaFactor,
  });
  const finalMat = new ShaderMaterial({
    uniforms, defines: { USE_SCENE: '' }, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false,
    blending: NoBlending,
  });
  const quad = new Mesh(fullscreenTriangle(), overlayMat);
  quad.frustumCulled = false;
  post.add(quad);

  let tier = renderer.tier;
  let rtScene = null, rtEmissive = null, bloom = null;
  const firstFns = [];
  let first = true;

  function freeT3() {
    if (rtScene) { unregisterTexture(rtScene.texture); rtScene.dispose(); rtScene = null; }
    if (rtEmissive) { unregisterTexture(rtEmissive.texture); rtEmissive.dispose(); rtEmissive = null; }
    if (bloom) { bloom.dispose(); bloom = null; }
  }
  function sizeT3() {
    if (tier !== 'T3') { freeT3(); return; }
    const w = uniforms.uRes.value.x, h = uniforms.uRes.value.y;
    if (!rtScene) {
      rtScene = new WebGLRenderTarget(w, h, { type: HalfFloatType, format: RGBAFormat, samples: 4, depthBuffer: true,
        minFilter: LinearFilter, magFilter: LinearFilter });
      rtEmissive = new WebGLRenderTarget(Math.max(2, w >> 1), Math.max(2, h >> 1), { type: HalfFloatType, format: RGBAFormat,
        depthBuffer: true, minFilter: LinearFilter, magFilter: LinearFilter });
      bloom = createKawaseBloom(renderer, RENDER.r6.levels);
    } else {
      rtScene.setSize(w, h);
      rtEmissive.setSize(Math.max(2, w >> 1), Math.max(2, h >> 1));
    }
    registerTexture(rtScene.texture, w * h * 8 * 5);                 // colour (×4 samples) + resolve
    registerTexture(rtEmissive.texture, rtEmissive.width * rtEmissive.height * 8);
    bloom.resize(rtEmissive.width, rtEmissive.height);
  }
  function onResize() {
    const s = three.getDrawingBufferSize(new Vector2());
    uniforms.uRes.value.copy(s);
    uniforms.uPR.value = renderer.dpr;
    sizeT3();
  }
  renderer.onResize(onResize);
  onResize();

  // Frame-interval ring (diagnostics: median frame ms over 120 frames).
  const ring = new Float32Array(FRAMES), sorted = new Float32Array(FRAMES);
  let ringN = 0, ringI = 0, lastNow = -1;

  const MASK_SCENE = (1 << LAYER.DEFAULT) | (1 << LAYER.NOFOG);
  const MASK_EMISSIVE = 1 << LAYER.EMISSIVE;

  const comp = {
    render(dt) {
      void dt;
      if (renderer.lost) return;
      // Grain clock + pointer.
      uniforms.uSeed.value = ENV.reducedMotion ? 7 : Math.floor(loop.now / (1000 / R7.grainFps)) % 997;
      const p = input.pointer;
      const none = p.x < -9000 || p.inside === false || (p.type === 'touch' && !p.down);
      uniforms.uPointer.value.set(none ? -9999 : p.x, none ? -9999 : p.y);

      three.info.reset();
      three.autoClear = false;
      if (tier === 'T3' && rtScene) {
        camera.layers.mask = MASK_SCENE;
        three.setRenderTarget(rtScene);
        three.setClearColor(0x000000, 0); three.clear(true, true, false);
        three.render(scene, camera);
        renderer.stats.points = three.info.render.points;
        camera.layers.mask = MASK_EMISSIVE;
        three.setRenderTarget(rtEmissive);
        three.clear(true, true, false);
        U.uEmissivePass.value = 1;
        three.render(scene, camera);
        U.uEmissivePass.value = 0;
        camera.layers.mask = MASK_SCENE;
        uniforms.tBloom.value = bloom.render(rtEmissive.texture);
        uniforms.tScene.value = rtScene.texture;
        quad.material = finalMat;
        three.setRenderTarget(null);
        three.render(post, postCam);
      } else {
        camera.layers.mask = MASK_SCENE;
        three.setRenderTarget(null);
        three.setClearColor(0x000000, 0); three.clear(true, true, false);
        three.render(scene, camera);
        renderer.stats.points = three.info.render.points;
        quad.material = overlayMat;
        three.render(post, postCam);
      }
      const st = renderer.stats, info = three.info;
      st.calls = info.render.calls;
      st.triangles = info.render.triangles;
      st.geometries = info.memory.geometries;
      st.textures = info.memory.textures;

      const now = loop.now;
      if (lastNow >= 0) {
        ring[ringI] = now - lastNow; ringI = (ringI + 1) % FRAMES; if (ringN < FRAMES) ringN++;
        if ((loop.frame & 15) === 0 && ringN > 0) {
          for (let i = 0; i < ringN; i++) sorted[i] = ring[i];
          const view = sorted.subarray(0, ringN);
          view.sort();
          st.frameMs = view[ringN >> 1];
          st.fps = st.frameMs > 0 ? 1000 / st.frameMs : 0;
        }
      }
      lastNow = now;

      if (first) {
        first = false;
        const ff = document.getElementById('ff-grain');
        if (ff && ff.parentNode) ff.parentNode.removeChild(ff);
        for (const fn of firstFns) { try { fn(); } catch (e) { /* owner errors are theirs */ } }
        firstFns.length = 0;
      }
    },
    /** luminance amplitude: 0.025 during boot 0–1,800 ms, then 0.02 (WP2 calls) */
    setGrain(amount) { uniforms.uGrain.value = Math.max(0, +amount || 0); },
    /** switches bloom ↔ sprites path */
    setTier(t) { tier = t; sizeT3(); },
    onFirstFrame(fn) { if (first) firstFns.push(fn); else { try { fn(); } catch (e) { /* ignore */ } } },
    /** WP0 diagnostics */
    get tier() { return tier; },
    uniforms,
  };
  bus.on('tier:change', ({ tier: t }) => comp.setTier(t));
  return comp;
}
