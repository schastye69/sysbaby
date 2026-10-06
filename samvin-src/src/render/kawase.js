// render/kawase.js — R6 bloom for T3: a custom dual-Kawase pyramid (ARCH §3.2, SPEC §2.4 R6).
//
// createKawaseBloom(renderer, levels = 4) → { render(srcTexture) → Texture, resize(w, h), dispose() }
// `levels` down passes (each ½ size; the first applies the 0.82 threshold as a soft knee on the brightest channel) and
// `levels` up passes back to the source size, each adding the down level of its size (progressive accumulation, so a
// few-pixel emitter still gets a visible halo at every scale). Input: the emissive-only layer (rendered at ½ resolution, cleared black).
// Half-float targets, no depth. Never UnrealBloomPass; no chromatic aberration.
import {
  WebGLRenderTarget, HalfFloatType, LinearFilter, RGBAFormat, ShaderMaterial, Mesh, BufferGeometry, BufferAttribute,
  Scene, OrthographicCamera, Vector2, NoBlending,
} from 'three';
import { RENDER } from '../core/tokens.js';
import { registerTexture, unregisterTexture } from './uniforms.js';

const FS_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const DOWN = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uHalf; uniform float uThreshold;
varying vec2 vUv;
vec3 tap(vec2 uv) {
  vec3 c = texture2D(tSrc, uv).rgb;
#ifdef USE_THRESHOLD
  float m = max(c.r, max(c.g, c.b));
  c *= smoothstep(uThreshold - 0.25, uThreshold + 0.05, m);
#endif
  return c;
}
void main() {
  vec3 s = tap(vUv) * 4.0;
  s += tap(vUv - uHalf); s += tap(vUv + uHalf);
  s += tap(vUv + vec2(uHalf.x, -uHalf.y)); s += tap(vUv - vec2(uHalf.x, -uHalf.y));
  gl_FragColor = vec4(s / 8.0, 1.0);
}`;

const UP = /* glsl */ `
uniform sampler2D tSrc; uniform vec2 uHalf;
#ifdef USE_ADD
uniform sampler2D tAdd; uniform float uAddGain;
#endif
varying vec2 vUv;
void main() {
  vec2 h = uHalf;
  vec3 s = texture2D(tSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
  s /= 12.0;
#ifdef USE_ADD
  s += texture2D(tAdd, vUv).rgb * uAddGain;     // progressive: every scale keeps its energy (a small nucleus still glows)
#endif
  gl_FragColor = vec4(s, 1.0);
}`;

/** A shared full-screen triangle. */
export function fullscreenTriangle() {
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  return g;
}

export function createKawaseBloom(renderer, levels = RENDER.r6.levels) {
  const three = renderer.three || renderer;
  const geo = fullscreenTriangle();
  const scene = new Scene();
  const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mk = (frag, threshold, add) => new ShaderMaterial({
    uniforms: { tSrc: { value: null }, uHalf: { value: new Vector2() }, uThreshold: { value: RENDER.r6.threshold },
      tAdd: { value: null }, uAddGain: { value: 1 } },
    defines: Object.assign(threshold ? { USE_THRESHOLD: '' } : {}, add ? { USE_ADD: '' } : {}),
    vertexShader: FS_VERT, fragmentShader: frag, depthTest: false, depthWrite: false, blending: NoBlending,
  });
  const downFirst = mk(DOWN, true), down = mk(DOWN, false), up = mk(UP, false, true), upLast = mk(UP, false, false);
  const quad = new Mesh(geo, down);
  quad.frustumCulled = false;
  scene.add(quad);

  const opts = { type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false };
  const downRT = [], upRT = [];
  let W = 0, H = 0;
  const bytesOf = (rt) => rt.width * rt.height * 8;

  function alloc(w, h) {
    free();
    W = w; H = h;
    let cw = w, ch = h;
    for (let i = 0; i < levels; i++) {
      cw = Math.max(1, cw >> 1); ch = Math.max(1, ch >> 1);
      const rt = new WebGLRenderTarget(cw, ch, opts);
      registerTexture(rt.texture, bytesOf(rt));
      downRT.push(rt);
    }
    // up i writes into the size of down i−1 (up 0 = the source size)
    for (let i = 0; i < levels; i++) {
      const s = i === 0 ? { width: w, height: h } : downRT[i - 1];
      const rt = new WebGLRenderTarget(s.width, s.height, opts);
      registerTexture(rt.texture, bytesOf(rt));
      upRT.push(rt);
    }
  }
  function free() {
    for (const rt of downRT.concat(upRT)) { unregisterTexture(rt.texture); rt.dispose(); }
    downRT.length = 0; upRT.length = 0;
  }

  function pass(mat, src, srcW, srcH, dst) {
    quad.material = mat;
    mat.uniforms.tSrc.value = src;
    mat.uniforms.uHalf.value.set(0.5 / srcW, 0.5 / srcH);
    three.setRenderTarget(dst);
    three.render(scene, cam);
  }

  return {
    /** srcTexture: the emissive layer (size W × H) → the bloom texture (same size). */
    render(srcTexture) {
      if (!downRT.length) return null;
      let src = srcTexture, sw = W, sh = H;
      for (let i = 0; i < levels; i++) {
        pass(i === 0 ? downFirst : down, src, sw, sh, downRT[i]);
        src = downRT[i].texture; sw = downRT[i].width; sh = downRT[i].height;
      }
      // up i lands on the size of down i−1 and adds that level (the full-size source itself is not re-added).
      for (let i = levels - 1; i >= 0; i--) {
        const mat = i > 0 ? up : upLast;
        if (i > 0) mat.uniforms.tAdd.value = downRT[i - 1].texture;
        pass(mat, src, sw, sh, upRT[i]);
        src = upRT[i].texture; sw = upRT[i].width; sh = upRT[i].height;
      }
      return upRT[0].texture;
    },
    resize(w, h) { if (w !== W || h !== H) alloc(Math.max(2, w | 0), Math.max(2, h | 0)); },
    dispose() { free(); geo.dispose(); downFirst.dispose(); down.dispose(); up.dispose(); upLast.dispose(); },
  };
}
