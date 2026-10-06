// render/points.js — round screen-size points (ARCH §3.5.6): structure vertices, stars, grains base, beads at distance.
//
// createPoints(opts) → { object, setCount(n), setAlpha(a), setSize(px), setPositions(arr, count?), setColor(token),
//                        uniforms, dispose() }
//   opts: { positions: Float32Array (xyz), count?, sizePx = 2, color = 'white' (token), alpha = 0.4, fog = true,
//           layer = LAYER.DEFAULT, sizes?: Float32Array (per-point px multiplier), alphas?: Float32Array,
//           faces?: Float32Array + strata?/strataAlpha? (WP0 addition: move with per-stratum matrices, one draw call),
//           depthTest = true, renderOrder? }
// Sizes are CSS px (× uPixelRatio). The disc is anti-aliased over ~1 device px. Colours are shared palette uniforms, so
// ИЗНАНКА and night follow automatically. Points never write depth.
import { BufferGeometry, BufferAttribute, Points, ShaderMaterial, NormalBlending } from 'three';
import { U, LAYER, colorUniform, identityStrata, onesStrata } from './uniforms.js';
import { FOG_GLSL } from './fog.js';
import { STRATA_GLSL } from './madeOfItself.js';

const VERT = /* glsl */ `
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${STRATA_GLSL}
#endif
uniform float uSize, uPixelRatio;
varying float vAlpha; varying float vDist; varying float vPx;
void main() {
  mat4 M = modelMatrix;
  float a = aAlpha;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
  a *= strataAlpha(aFace);
#endif
  vec4 v = viewMatrix * (M * vec4(position, 1.0));
  gl_Position = projectionMatrix * v;
  float px = max(uSize * aSize * uPixelRatio, 1.0);
  gl_PointSize = px + 1.0;
  vPx = px;
  vAlpha = a;
  vDist = length(v.xyz);
}`;

const FRAG = /* glsl */ `
${FOG_GLSL}
uniform vec3 uColor; uniform float uAlpha;
varying float vAlpha; varying float vDist; varying float vPx;
void main() {
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);     // device px from the centre
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  float a = cov * vAlpha * uAlpha;
  if (a <= 0.003) discard;
  vec3 col = uColor;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, a);
}`;

function filled(n, v) { const a = new Float32Array(Math.max(1, n)); a.fill(v); return a; }

export function createPoints(opts = {}) {
  let positions = opts.positions || new Float32Array(3);
  let capacity = Math.floor(positions.length / 3);
  let count = opts.count != null ? Math.min(opts.count, capacity) : capacity;

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.setAttribute('aSize', new BufferAttribute(opts.sizes || filled(capacity, 1), 1));
  geo.setAttribute('aAlpha', new BufferAttribute(opts.alphas || filled(capacity, 1), 1));
  const defines = {};
  if (opts.faces && opts.strata) { geo.setAttribute('aFace', new BufferAttribute(opts.faces, 1)); defines.USE_STRATA = ''; }
  if (opts.fog !== false) defines.USE_FOG = '';
  geo.setDrawRange(0, count);

  const uniforms = {
    uColor: colorUniform(opts.color || 'white'),
    uAlpha: { value: opts.alpha != null ? opts.alpha : 0.4 },
    uSize: { value: opts.sizePx != null ? opts.sizePx : 2 },
    uStrataM: opts.strata || identityStrata(),
    uStrataA: opts.strataAlpha || onesStrata(),
    uPixelRatio: U.uPixelRatio, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity,
  };
  const mat = new ShaderMaterial({
    uniforms, defines, vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthWrite: false, depthTest: opts.depthTest !== false, blending: NormalBlending,
  });
  const object = new Points(geo, mat);
  object.frustumCulled = opts.frustumCulled === true;
  object.layers.set(opts.layer != null ? opts.layer : LAYER.DEFAULT);
  if (opts.renderOrder != null) object.renderOrder = opts.renderOrder;

  return {
    object,
    uniforms,
    get count() { return count; },
    setCount(n) { count = Math.max(0, Math.min(capacity, n | 0)); geo.setDrawRange(0, count); },
    setAlpha(a) { uniforms.uAlpha.value = a; object.visible = a > 0; },
    setSize(px) { uniforms.uSize.value = px; },
    setColor(token) { uniforms.uColor = colorUniform(token); mat.uniforms.uColor = uniforms.uColor; },
    /** Replaces the positions (reuses the buffer when it fits). */
    setPositions(arr, n) {
      const c = n != null ? n : Math.floor(arr.length / 3);
      if (c <= capacity && arr !== positions) {
        positions.set(arr.subarray(0, c * 3));
      } else if (arr !== positions) {
        positions = arr;
        capacity = Math.floor(arr.length / 3);
        geo.setAttribute('position', new BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new BufferAttribute(filled(capacity, 1), 1));
        geo.setAttribute('aAlpha', new BufferAttribute(filled(capacity, 1), 1));
      }
      geo.attributes.position.needsUpdate = true;
      count = Math.min(c, capacity);
      geo.setDrawRange(0, count);
    },
    dispose() { geo.dispose(); mat.dispose(); if (object.parent) object.parent.remove(object); },
  };
}
