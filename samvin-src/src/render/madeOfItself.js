// render/madeOfItself.js — R1 "made of itself" (ARCH §3.5.3, SPEC §2.4 R1).
//
// Every VIN surface has a solid and a lattice rendering. Per fragment/vertex the projected strut spacing in CSS px is
//   sp = strut · modelScale · uPxPerUnit / depth
// lattice alpha = smoothstep(3, 6, sp); solid alpha = 1 − that, applied as an 8×8 Bayer-dithered discard (no sorting).
// Dense lattices therefore never moiré: they turn solid first.
//
//   Solid fragment:  if (1.0 - r1Lattice(...) <= bayer8(gl_FragCoord.xy)) discard;
//   Lattice vertex:  if (r1Lattice(...) < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // collapsed
//
// STRATA_GLSL (WP0 addition, vertex chunk): structures animated per stratum (the Key) and merged structures (VIN levels)
// draw all 7 strata in ONE draw call per material; each vertex carries aFace = i·16 + j and is moved by
// uStrataM[i] (stratum-local → structure-local) and faded by uStrataA[i] (setStratumFade). Non-animated structures pass
// identity matrices and ones.

export const R1_GLSL = /* glsl */ `
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`;

export const STRATA_GLSL = /* glsl */ `
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;
