// render/fxChunk.js — the one FX shader chunk (ARCH-ADDENDUM X§2.2.3, hook H4; WP0-owned).
//
// Every addendum effect is a shader term inside an existing material (no new render pass, X§0.2). Materials that
// include FX_GLSL take the uniforms of fxUniforms() BY REFERENCE (they are the shared U objects), and must not declare
// uWorldScale themselves (FX_GLSL declares it). Identity defaults (all 0, uFxLineA 1) produce zero visual change.
// FX_LINES_GLSL / FX_POINTS_GLSL are documentation strings: the code is in lines.js / points.js.
import { U } from './uniforms.js';

export const FX_GLSL = /* glsl */ `
uniform vec4 uWave0a, uWave0b, uWave1a, uWave1b;
uniform float uImpact, uImpactWarm, uPulse, uFxLineA, uWorldScale;
uniform vec3 uFocus; uniform vec2 uFxCaps;
float fxShell(vec4 a, vec4 b, vec3 p) {                 // gaussian shell weight 0..1 (mode 1 only)
  if (b.w < 0.5 || b.w > 1.5) return 0.0;
  float d = length(p - a.xyz); float x = (d - a.w) / max(b.y, 1e-4); return exp(-x * x);
}
vec3 fxDisplace(vec3 p) {                               // render-space position → displaced position
  vec3 q = p;
  for (int k = 0; k < 2; k++) {
    vec4 a = k == 0 ? uWave0a : uWave1a; vec4 b = k == 0 ? uWave0b : uWave1b;
    float d = length(p - a.xyz);
    if (b.w > 0.5 && b.w < 1.5 && d >= 2.0 * uWorldScale) q += normalize(p - a.xyz) * (b.x * d) * fxShell(a, b, p);
  }
  return q;
}
float fxWaveBright(vec3 p) {                            // additive brightness (lines/lattice/points)
  float g = uWave0b.z * fxShell(uWave0a, uWave0b, p) + uWave1b.z * fxShell(uWave1a, uWave1b, p);
  for (int k = 0; k < 2; k++) {                          // axis mode: lit for 400 ms after the front passes
    vec4 a = k == 0 ? uWave0a : uWave1a; vec4 b = k == 0 ? uWave0b : uWave1b;
    if (b.w > 1.5) { float lag = a.w - length(p - a.xyz); g += step(0.0, lag) * step(lag, 137.2 * uWorldScale); }
  }
  return g;
}
float fxCoc(float depth) {                              // circle of confusion, CSS px, ≤ 10
  return uFocus.z > 0.5 ? min(10.0, uFocus.y * abs(depth - uFocus.x) / max(depth, 1e-4)) : 0.0;
}`;
export const FX_LINES_GLSL = /* glsl */ `            // R3 ribbons (lines.js VERT): after computing col/al/wpx
// wpx_fx = wpx * (1.0 + 0.5 * max(uImpact, uImpactWarm) * uFxCaps.x) + coc * uFxCaps.x   (quad width)
// visible width stays wpx * (1.0 + 0.5 * uImpact * uFxCaps.x) + coc * uFxCaps.x            (coverage width)
// col = mix(col, cWhite, uImpact) * (1.0 + fxWaveBright(wp));
// al  = mix(al, min(1.0, 2.5 * al), uImpact) * uFxLineA * (w0 / (w0 + coc))               (w0 = aW·uWidth)`;
export const FX_POINTS_GLSL = /* glsl */ ` /* gl_PointSize += coc·uPixelRatio; alpha *= pow(s0/(s0+coc), 2.0); vCoc = coc */ `;
export const FX_HEPTAGON_GLSL = /* glsl */ `
float fxHeptagon(vec2 pc) {                             // 7-blade aperture SDF, one flat side down; pc in [-1,1]
  float a = atan(pc.x, -pc.y); float k = 6.2831853 / 7.0;
  float r = cos(floor(0.5 + a / k) * k - a) * length(pc); return r;  // < cos(π/7) inside
}`;

/** → { uWave0a, uWave0b, uWave1a, uWave1b, uImpact, uImpactWarm, uPulse, uFxLineA, uFocus, uFxCaps, uWorldScale }
 *  (the shared U objects, by reference). */
export function fxUniforms() {
  return {
    uWave0a: U.uWave0a, uWave0b: U.uWave0b, uWave1a: U.uWave1a, uWave1b: U.uWave1b,
    uImpact: U.uImpact, uImpactWarm: U.uImpactWarm, uPulse: U.uPulse, uFxLineA: U.uFxLineA,
    uFocus: U.uFocus, uFxCaps: U.uFxCaps, uWorldScale: U.uWorldScale,
  };
}
