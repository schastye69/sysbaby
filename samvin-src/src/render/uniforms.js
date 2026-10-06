// render/uniforms.js — shared uniform objects and layers (ARCH §3.5.1, A2).
//
// Every custom material takes these objects BY REFERENCE (material.uniforms.uLamp = U.uLamp), so one write here
// updates every shader at once: palette swaps (palette.js), the lamp (lamp.js), fog (fog.js), time and breath (main),
// camera facts (cameraRig.js) and the resolution (renderer.js).
//
// Also the WP0 texture registry (A2): every module that creates a GPU texture registers it with its byte size so the
// test hook can report `_stats.texMB`.
import { Vector2, Vector3, Color, Matrix4 } from 'three';

export const LAYER = Object.freeze({ DEFAULT: 0, EMISSIVE: 1, NOFOG: 2 });

const col = () => ({ value: new Color(0, 0, 0) });

export const U = {
  uTime: { value: 0 },                       // seconds (loop time)
  uBreath: { value: 0.5 },                   // breath.mix(0, 1)
  uLamp: { value: new Vector3(0, 0, 3) },    // render space
  uLampOn: { value: 1 },
  uCamPos: { value: new Vector3() },
  uResolution: { value: new Vector2(1, 1) }, // device px
  uPixelRatio: { value: 1 },
  uPxPerUnit: { value: 1 },                  // CSS px per render unit at depth 1
  uWorldScale: { value: 1 },
  uFogDensity: { value: 0.00485 },
  uInvert: { value: 0 },                     // 0..1 ИЗНАНКА mix
  uNight: { value: 0 },                      // 0..1 sleep mix
  uEmissivePass: { value: 0 },               // WP0 addition: 1 while the composite renders the T3 emissive layer
  // palette (display-space values; palette.js writes them)
  cVoid: col(), cAbyss: col(), cDeep: col(), cSteel: col(), cSlate: col(), cPewter: col(), cSilver: col(),
  cWhite: col(), cObsidian: col(), cEmber: col(), cEmberDeep: col(), cElectrum: col(), cPaper: col(), cInk: col(),
};

/** Token name ('silver', 'emberDeep' …) → the U key of its colour uniform ('cSilver' …). */
export function colorKey(token) {
  return 'c' + token.charAt(0).toUpperCase() + token.slice(1);
}
/** Token name → the shared colour uniform object (falls back to silver for unknown tokens). */
export function colorUniform(token) {
  return U[colorKey(token)] || U.cSilver;
}

/** Seven identity matrices: the default "stratum matrices" for structures that are not animated per stratum. */
export function identityStrata() {
  const a = new Array(7);
  for (let i = 0; i < 7; i++) a[i] = new Matrix4();
  return { value: a };
}
/** Seven per-stratum alphas (all 1): the default for STRATA_GLSL's uStrataA. */
export function onesStrata() {
  return { value: [1, 1, 1, 1, 1, 1, 1] };
}

// ─── Texture registry (A2) ───────────────────────────────────────────────────────────────────────────────────
const textures = new Map();   // Texture → bytes

export function registerTexture(tex, bytes) {
  if (tex) textures.set(tex, Math.max(0, bytes || 0));
}
export function unregisterTexture(tex) {
  textures.delete(tex);
}
/** Σ registered texture bytes / 2^20 */
export function textureMB() {
  let b = 0;
  for (const v of textures.values()) b += v;
  return b / 1048576;
}
