// render/obsidian.js — R2 obsidian solid with R4 raking engraving (ARCH §3.5.5, SPEC §2.4 R2/R4, §6.1.6 A15).
//
// createObsidian(opts) → ShaderMaterial. Terms:
//   base cObsidian (or opts.tint) · Fresnel rim pow(1 − N·V, 3) → cSilver × rim (0.55) · two-lobe lamp specular
//   (power 24 @ 0.35, power 160 @ 0.6) · engraving from the atlas (normal from 4 height taps, shading ×
//   smoothstep(0.55, 0.90, 1 − dot(N_face, L))) · base inlay (atlas G) always at 45 % cSilver · exp² fog.
//   R1: solid alpha = (1 − r1Lattice) · uAlpha · stratum alpha, as an 8×8 Bayer-dithered discard (no sorting).
//   A15: with U.uInvert = u the solid mixes toward cPaper and draws 45° screen-space hatching (6 CSS px, 1 px cInk).
// No environment map, no PBR, no three lights.
//
// opts: { engrave?: 'key' | '<atlas region key>' | null, r1 = true, fog = true, side = FrontSide, rim = 0.55,
//         tint = 'obsidian', strut?: number (uniform strut when the geometry has no aStrut),
//         strata?: uniform (7 Matrix4) + strataAlpha?: uniform (7 floats) — merged structures (one draw call),
//         strataAlpha alone — per-stratum meshes (alpha indexed by aFace) }
// engrave 'key' expects the structure attributes (world/structure.js): aFace, aFaceUV, aEng (sign u, sign v, metres from
// the top edge, metres to the bottom edge), aKind (0 outer wall, 1 top cap, 2 bottom cap, 3 inner wall), aStrut.
// A region key (e.g. 'capital:3') maps that atlas region over the geometry's `uv`.
// Uniforms added: uAlpha, uFlash (→ cWhite), uEdgeEmber (reserved, tints nothing), uHideCapsOf (hall LOD: caps of that
// stratum are discarded; −1 none).
import { ShaderMaterial, FrontSide, Vector4 } from 'three';
import { U, colorUniform, identityStrata, onesStrata } from './uniforms.js';
import { FOG_GLSL } from './fog.js';
import { R1_GLSL, STRATA_GLSL } from './madeOfItself.js';
import { atlas } from './engraveAtlas.js';
import { RENDER, KEY } from '../core/tokens.js';
import { quality } from '../core/quality.js';

const VERT = /* glsl */ `
${R1_GLSL}
${STRATA_GLSL}
#ifdef USE_KEYGEO
attribute float aFace; attribute vec2 aFaceUV; attribute vec4 aEng; attribute float aKind;
varying vec2 vFaceUV; varying vec4 vEng; varying float vKind; varying float vFace; varying vec3 vLocal;
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_REGION
varying vec2 vUv;
#endif
uniform float uStrut;
varying vec3 vWorld; varying vec3 vN; varying float vSolid;
void main() {
  mat4 M = modelMatrix;
  float sa = 1.0;
#ifdef USE_KEYGEO
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
#if defined(USE_STRATA) || defined(USE_STRATA_A)
  sa = strataAlpha(aFace);
#endif
  vFaceUV = aFaceUV; vEng = aEng; vKind = aKind; vFace = aFace; vLocal = position;
#endif
#ifdef USE_REGION
  vUv = uv;
#endif
  vec4 w = M * vec4(position, 1.0);
  vec4 v = viewMatrix * w;
  gl_Position = projectionMatrix * v;
  vWorld = w.xyz;
  vN = normalize(mat3(M) * normal);
#ifdef USE_ASTRUT
  float strut = aStrut;
#else
  float strut = uStrut;
#endif
#ifdef USE_R1
  sa *= 1.0 - r1Lattice(strut, length(M[0].xyz), -v.z);
#endif
  vSolid = sa;
}`;

const FRAG = /* glsl */ `
${FOG_GLSL}
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
uniform vec3 uBase; uniform vec3 cSilver; uniform vec3 cWhite; uniform vec3 cPaper; uniform vec3 cInk;
uniform vec3 uLamp; uniform float uLampOn; uniform float uAlpha, uFlash, uRim, uInvert, uPixelRatio, uHideCapsOf;
uniform sampler2D uAtlas; uniform float uTexel; uniform vec4 uRegion;
uniform float uFriezeH, uTickL, uApertureR;
varying vec3 vWorld; varying vec3 vN; varying float vSolid;
#ifdef USE_KEYGEO
varying vec2 vFaceUV; varying vec4 vEng; varying float vKind; varying float vFace; varying vec3 vLocal;
#endif
#ifdef USE_REGION
varying vec2 vUv;
#endif

// → atlas uv of the engraving under this fragment (x < 0: none)
vec2 engraveUV() {
#ifdef USE_KEYGEO
  float si = floor(vFace / 16.0 + 0.001);
  float fj = vFace - si * 16.0;
  if (vKind > 0.5) return vec2(-1.0);
  if (vEng.z < uFriezeH) {                                   // top bevel: frieze cells ((i·12 + j)·3 + c) mod 64
    float c = mod((si * 12.0 + fj) * 3.0 + floor(clamp(vFaceUV.x, 0.0, 0.999) * 3.0), 64.0);
    return vec2((c + fract(vFaceUV.x * 3.0)) / 64.0, 0.125 + clamp(vEng.z / uFriezeH, 0.0, 1.0) * 0.03125);
  }
  if (vEng.w < uFriezeH) {                                   // bottom bevel
    float c = mod((si * 12.0 + fj) * 3.0 + floor(clamp(vFaceUV.x, 0.0, 0.999) * 3.0), 64.0);
    return vec2((c + fract(vFaceUV.x * 3.0)) / 64.0, 0.125 + clamp(1.0 - vEng.w / uFriezeH, 0.0, 1.0) * 0.03125);
  }
  if (vEng.z < uFriezeH + uTickL) {                          // the 12 radial ticks along the top edge
    return vec2(clamp(vFaceUV.x, 0.0, 1.0), 0.15625 + clamp((vEng.z - uFriezeH) / uTickL, 0.0, 1.0) * 0.03125);
  }
  bool sign = fj < 0.5;
  bool back = abs(si - 3.0) < 0.5 && abs(fj - 6.0) < 0.5;
  if ((sign || back) && vEng.x > 0.0 && vEng.x < 1.0 && vEng.y > 0.0 && vEng.y < 1.0) {
    vec2 o = sign ? vec2(si * 0.125, 0.0) : vec2(0.875, 0.0);
    return o + vEng.xy * 0.125;
  }
  return vec2(-1.0);
#elif defined(USE_REGION)
  return uRegion.xy + clamp(vUv, 0.0, 1.0) * (uRegion.zw - uRegion.xy);
#else
  return vec2(-1.0);
#endif
}

void main() {
#ifdef USE_KEYGEO
  float si = floor(vFace / 16.0 + 0.001);
  if (abs(si - 3.0) < 0.5 && vLocal.z > 0.0 && length(vLocal.xy) < uApertureR) discard;   // the • through-aperture
  if (vKind > 0.5 && vKind < 2.5 && abs(si - uHideCapsOf) < 0.5) discard;                 // hall LOD
#endif
  float a = vSolid * uAlpha;
  if (a <= bayer8(gl_FragCoord.xy)) discard;

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(uLamp - vWorld);
  float nl = dot(N, L);

  vec3 col = uBase;
  col += cSilver * (0.035 * (0.5 + 0.5 * N.y) + 0.05 * max(nl, 0.0) * uLampOn);   // just enough form to read facets
  float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
  col = mix(col, cSilver, fr * uRim);
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  col += uLampOn * (cSilver * 0.35 * pow(nh, 24.0) + cWhite * 0.6 * pow(nh, 160.0));

  vec2 auv = engraveUV();
  if (auv.x >= 0.0) {
    vec4 t = texture2D(uAtlas, auv);
    float h = t.r, inlay = t.g;
    if (h < 0.999 || inlay > 0.0) {
      float hl = texture2D(uAtlas, auv - vec2(uTexel, 0.0)).r, hr = texture2D(uAtlas, auv + vec2(uTexel, 0.0)).r;
      float hu = texture2D(uAtlas, auv - vec2(0.0, uTexel)).r, hd = texture2D(uAtlas, auv + vec2(0.0, uTexel)).r;
      vec3 up = normalize(vec3(0.0, 1.0, 0.0) - N * N.y + vec3(1e-4, 0.0, 0.0));
      vec3 T = normalize(cross(up, N));
      float k = 2.4;
      vec3 Ne = normalize(N + (-(hr - hl) * T + (hd - hu) * up) * k);
      float rake = smoothstep(0.55, 0.90, 1.0 - nl) * uLampOn;
      float e = dot(Ne, L) - nl;
      col += cSilver * rake * (max(e, 0.0) * 2.6 + (1.0 - h) * 0.10);
      col *= 1.0 - (1.0 - h) * 0.35 * (1.0 - rake);
      col = mix(col, cSilver, clamp(inlay, 0.0, 1.0) * 0.45);
    }
  }
  col = mix(col, cWhite, uFlash);
#ifdef USE_FOG
  col = applyFog(col, length(vWorld - cameraPosition));
#endif
  if (uInvert > 0.0) {
    col = mix(col, cPaper, uInvert * 0.85);
    vec2 fc = gl_FragCoord.xy / uPixelRatio;
    float hatch = 1.0 - step(1.0, mod((fc.x + fc.y) * 0.70710678, 6.0));
    col = mix(col, cInk, hatch * uInvert);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

/** @returns {import('three').ShaderMaterial} */
export function createObsidian(opts = {}) {
  const defines = {};
  const engrave = opts.engrave != null ? opts.engrave : null;
  if (engrave === 'key') defines.USE_KEYGEO = '';
  else if (typeof engrave === 'string') defines.USE_REGION = '';
  if (opts.r1 !== false) defines.USE_R1 = '';
  if (opts.strut == null && (engrave === 'key' || opts.aStrut)) defines.USE_ASTRUT = '';
  if (opts.strata) defines.USE_STRATA = '';
  else if (opts.strataAlpha) defines.USE_STRATA_A = '';
  if (opts.fog !== false) defines.USE_FOG = '';

  if (!atlas.texture) atlas.init(quality.tier);        // the atlas exists from boot; this only guards early callers
  const reg = typeof engrave === 'string' && engrave !== 'key' ? atlas.region(engrave) : null;
  const size = atlas.size || 1024;
  const mat = new ShaderMaterial({
    uniforms: {
      uBase: colorUniform(opts.tint || 'obsidian'),
      uAlpha: { value: 1 }, uFlash: { value: 0 }, uEdgeEmber: { value: 0 },
      uRim: { value: opts.rim != null ? opts.rim : RENDER.r2.fresnelGain },
      uStrut: { value: opts.strut != null ? opts.strut : 0.05 },
      uHideCapsOf: { value: -1 },
      uAtlas: { value: atlas.texture },
      uTexel: { value: 1 / size },
      uRegion: { value: reg ? reg.rect : new Vector4(0, 0, 0, 0) },
      uFriezeH: { value: KEY.friezeH }, uTickL: { value: KEY.tickLen }, uApertureR: { value: KEY.apertureD / 2 },
      uStrataM: opts.strata || identityStrata(),
      uStrataA: opts.strataAlpha || onesStrata(),
      cSilver: U.cSilver, cWhite: U.cWhite, cPaper: U.cPaper, cInk: U.cInk, cAbyss: U.cAbyss,
      uLamp: U.uLamp, uLampOn: U.uLampOn, uInvert: U.uInvert, uPixelRatio: U.uPixelRatio, uPxPerUnit: U.uPxPerUnit,
      uFogDensity: U.uFogDensity,
    },
    defines, vertexShader: VERT, fragmentShader: FRAG,
    side: opts.side != null ? opts.side : FrontSide,
    transparent: false, depthWrite: true,
  });
  return mat;
}
