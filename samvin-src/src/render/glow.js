// render/glow.js — R6 emitters (ARCH §3.5.6, SPEC §2.4 R6).
//
// createEmitter(opts) → Emitter: an additive camera-facing glow quad (64×64 pre-blurred radial canvas texture) plus an
// optional `core` object (e.g. the nucleus icosahedron). Tier handling lives here (tier:change), not in the owners:
//   T3 — the core (or, without a core, the sprite itself) is also enabled on LAYER.EMISSIVE, so the Kawase bloom makes
//        the halo; with a core the sprite is hidden (the bloom replaces it).
//   T1/T2 — the additive sprite alone carries the glow.
// createEmitterBatch(opts) (WP0 addition) — many identical emitters (lit nodes ×1000 / ×10⁶) in ONE instanced draw call.
// Sizes are LOCAL metres (radius), so an emitter inside a ×1000 group grows with it. Colours are palette uniforms
// (night: optional mix toward electrum by U.uNight). Fog scales the glow intensity (it fades with distance, it never
// tints toward --abyss), unless fog:false.
import {
  CanvasTexture, LinearFilter, ClampToEdgeWrapping, PlaneGeometry, InstancedBufferGeometry, InstancedBufferAttribute,
  ShaderMaterial, Mesh, Group, AdditiveBlending,
} from 'three';
import { U, LAYER, colorUniform, registerTexture } from './uniforms.js';
import { FOG_GLSL } from './fog.js';
import { bus } from '../core/bus.js';
import { quality } from '../core/quality.js';

let tex = null;
/** → Texture (shared, memoised): 64×64 radial falloff, white on transparent. */
export function glowTexture() {
  if (tex) return tex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const img = g.createImageData(64, 64);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const dx = (x + 0.5) / 32 - 1, dy = (y + 0.5) / 32 - 1;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      // Pre-blurred: a bright core (Gaussian) over a long soft tail, exactly 0 at the rim.
      const a = (0.72 * Math.exp(-r * r * 18) + 0.28 * Math.exp(-r * r * 4.2)) * (1 - r * r) * (1 - r);
      const p = (y * 64 + x) * 4;
      img.data[p] = img.data[p + 1] = img.data[p + 2] = 255;
      img.data[p + 3] = Math.round(255 * Math.min(1, a));
    }
  }
  g.putImageData(img, 0, 0);
  tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter; tex.magFilter = LinearFilter; tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  registerTexture(tex, 64 * 64 * 4);
  return tex;
}

const VERT = /* glsl */ `
#ifdef USE_BATCH
attribute vec3 aOffset;
#endif
uniform float uRadius;
varying vec2 vUv; varying float vDist;
void main() {
  vec3 c = vec3(0.0);
#ifdef USE_BATCH
  c = aOffset;
#endif
  float s = length(modelMatrix[0].xyz);
  vec4 v = viewMatrix * (modelMatrix * vec4(c, 1.0));
  v.xy += position.xy * 2.0 * uRadius * s;
  gl_Position = projectionMatrix * v;
  vUv = uv;
  vDist = length(v.xyz);
}`;

const FRAG = /* glsl */ `
${FOG_GLSL}
uniform sampler2D uTex; uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite;
uniform float uIntensity, uNight, uNightMix, uNightI, uFlash;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a;
  vec3 col = mix(uColor, cElectrum, uNight * uNightMix);
  col = mix(col, cWhite, uFlash);
  float k = uIntensity * mix(1.0, uNightI, uNight * uNightMix);
#ifdef USE_FOG
  k *= fogVis(vDist);
#endif
  float o = a * k;
  if (o <= 0.002) discard;
  gl_FragColor = vec4(col * o, o);
}`;

const live = new Set();
let quad = null;
function quadGeo() { if (!quad) quad = new PlaneGeometry(1, 1); return quad; }

function makeMaterial(opts, batch) {
  const defines = {};
  if (batch) defines.USE_BATCH = '';
  if (opts.fog !== false) defines.USE_FOG = '';
  const uniforms = {
    uTex: { value: glowTexture() },
    uColor: colorUniform(opts.color || 'ember'),
    uRadius: { value: opts.radius != null ? opts.radius : 0.05 },
    uIntensity: { value: opts.intensity != null ? opts.intensity : 1 },
    uNightMix: { value: opts.night ? 1 : 0 },               // 1 → follows U.uNight toward electrum
    uNightI: { value: opts.nightIntensity != null ? opts.nightIntensity : 0.55 },
    uFlash: { value: 0 },
    uNight: U.uNight, cElectrum: U.cElectrum, cWhite: U.cWhite, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity,
  };
  // Premultiplied additive: ONE, ONE (three's AdditiveBlending with premultipliedAlpha).
  const mat = new ShaderMaterial({
    uniforms, defines, vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthWrite: false, depthTest: opts.depthTest !== false,
    blending: AdditiveBlending, premultipliedAlpha: true,
  });
  return mat;
}

function applyTier(e, tier) {
  const t3 = tier === 'T3';
  if (e.core) {
    if (t3) e.core.layers.enable(LAYER.EMISSIVE); else e.core.layers.disable(LAYER.EMISSIVE);
    e._tierHidden = t3;
  } else {
    if (t3) e.sprite.layers.enable(LAYER.EMISSIVE); else e.sprite.layers.disable(LAYER.EMISSIVE);
    e._tierHidden = false;
  }
  e._sync();
}

bus.on('tier:change', ({ tier }) => { for (const e of live) applyTier(e, tier); });

/** @returns {Emitter} opts: { color: 'ember'|'electrum'|'white'|'silver', radius (local m), intensity = 1, core?: Object3D,
 *  depthTest = true, fog = true, night = false (mix toward electrum by U.uNight), nightIntensity = 0.55, renderOrder? } */
export function createEmitter(opts = {}) {
  const object = new Group();
  const mat = makeMaterial(opts, false);
  const sprite = new Mesh(quadGeo(), mat);
  sprite.frustumCulled = false;
  sprite.renderOrder = opts.renderOrder != null ? opts.renderOrder : 5;
  object.add(sprite);
  if (opts.core) object.add(opts.core);
  const e = {
    object, sprite, core: opts.core || null, uniforms: mat.uniforms,
    _tierHidden: false,
    _sync() { sprite.visible = !e._tierHidden && mat.uniforms.uIntensity.value > 0; },
    setIntensity(x) { mat.uniforms.uIntensity.value = x; e._sync(); },
    setColor(token) { mat.uniforms.uColor = colorUniform(token); },
    setRadius(r) { mat.uniforms.uRadius.value = r; },
    setFlash(x) { mat.uniforms.uFlash.value = x; },
    dispose() {
      live.delete(e);
      mat.dispose();
      if (object.parent) object.parent.remove(object);
    },
  };
  live.add(e);
  applyTier(e, quality.tier);
  return e;
}

/** WP0 addition — N identical emitters in one draw call.
 *  opts: { positions: Float32Array (xyz, local), count?, color, radius, intensity, night, nightIntensity, fog, depthTest }
 *  → { object, setCount(n), setIntensity(x), setColor(t), setRadius(r), setPositions(arr, n?), dispose() } */
export function createEmitterBatch(opts = {}) {
  let positions = opts.positions || new Float32Array(3);
  const cap = Math.max(1, Math.floor(positions.length / 3));
  const base = quadGeo();
  const geo = new InstancedBufferGeometry();
  geo.setIndex(base.index.clone());                       // own copies: disposing the batch never touches the shared quad
  geo.setAttribute('position', base.getAttribute('position').clone());
  geo.setAttribute('uv', base.getAttribute('uv').clone());
  const offs = new InstancedBufferAttribute(new Float32Array(cap * 3), 3);
  offs.array.set(positions.subarray(0, cap * 3));
  geo.setAttribute('aOffset', offs);
  let count = opts.count != null ? Math.min(cap, opts.count) : cap;
  geo.instanceCount = count;
  const mat = makeMaterial(opts, true);
  const object = new Mesh(geo, mat);
  object.frustumCulled = false;
  object.renderOrder = opts.renderOrder != null ? opts.renderOrder : 5;
  const e = {
    object, sprite: object, core: null, uniforms: mat.uniforms, _tierHidden: false,
    _sync() { object.visible = count > 0 && mat.uniforms.uIntensity.value > 0; },
    get count() { return count; },
    setCount(n) { count = Math.max(0, Math.min(cap, n | 0)); geo.instanceCount = count; e._sync(); },
    setIntensity(x) { mat.uniforms.uIntensity.value = x; e._sync(); },
    setColor(token) { mat.uniforms.uColor = colorUniform(token); },
    setRadius(r) { mat.uniforms.uRadius.value = r; },
    setPositions(arr, n) {
      const c = Math.min(cap, n != null ? n : Math.floor(arr.length / 3));
      offs.array.set(arr.subarray(0, c * 3));
      offs.needsUpdate = true;
      e.setCount(c);
    },
    dispose() {
      live.delete(e);
      geo.dispose(); mat.dispose();
      if (object.parent) object.parent.remove(object);
    },
  };
  live.add(e);
  applyTier(e, quality.tier);
  return e;
}
