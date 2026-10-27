// render/lines.js — R3: the one line/ribbon shader (ARCH §3.5.4, SPEC §2.4 R3).
//
// createLines(opts) → Lines: one instanced screen-space quad per segment, ONE draw call per Lines.
//   • width in CSS px (× uPixelRatio), 1 px AA feather; near-plane clipped in view space (camera may sit among struts)
//   • wire glint: brightness × (1 + pow(1 − |dot(dir, normalize(uLamp − P))|, 24) · glint · lampReach(P))
//   • distance fade: alpha × (1 − smoothstep(0.55·far, far, depth)); depth is CANONICAL (render depth ÷ uWorldScale)
//     so a hall's `far` keeps meaning metres while the director scales the world
//   • optional R1 density fade (strut), dash, flatten (SIGNAL «Голос»), fog, additive, layer, partial draw range
//   • colours are the shared palette uniforms (token) or per-segment rgb; ИЗНАНКА follows automatically (A15)
// createLatticeMaterial({strut}) — the hairline (1 device px) material for the Key/VIN lattice twin LineSegments:
//   same glint, fog, far fade and R1 vertex collapse. attachDofTaps(ls): its circle of confusion is spread over two
//   hairline taps (energy kept) instead of dimming the line away.
// ПРОСВЕТ (A2.0.3) in both: every member takes its share of the flash from FX_LIGHT_GLSL (source, distance, sheet).
// WP0 additions (optional opts): faces (per-segment aFace = i·16 + j) + strata (uniform of 7 Matrix4) + strataAlpha
// (uniform of 7 floats) to move/fade each segment with its stratum inside one draw call (structure.js); depthTest,
// renderOrder.
import {
  InstancedBufferGeometry, InstancedInterleavedBuffer, InterleavedBufferAttribute, InstancedBufferAttribute,
  BufferAttribute, ShaderMaterial, Mesh, LineSegments, NormalBlending, AdditiveBlending, Vector2,
} from 'three';
import { U, colorUniform, identityStrata, onesStrata } from './uniforms.js';
import { FOG_GLSL } from './fog.js';
import { R1_GLSL, STRATA_GLSL } from './madeOfItself.js';
import { FX_GLSL, FX_LIGHT_GLSL, fxUniforms } from './fxChunk.js';
import { RENDER } from '../core/tokens.js';
import { ROOMS } from '../world/rooms.js';
import { app } from '../core/store.js';

/** Default distance-fade far: the current room's ROOMS[id].far (ARCH §3.5.4). */
const defaultFar = () => (ROOMS[app.room] || ROOMS.CORE).far;

/** The lamp's reach for the wire glint: full on struts near the lamp, fading with distance on the scale of the
 *  camera–lamp distance, so highlights slide along the struts around the focus while walls hundreds of metres away keep
 *  their fogged 8–14 % (every far-wall strut is perpendicular to L − P, so the bare SPEC term would light them all). */
export const GLINT_GLSL = /* glsl */ `
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`;

const QUAD_POS = new Float32Array([0, -1, 0, 1, -1, 0, 0, 1, 0, 1, 1, 0]);
const QUAD_IDX = [0, 1, 2, 2, 1, 3];

const VERT = /* glsl */ `
${R1_GLSL}
${FX_GLSL}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${STRATA_GLSL}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform vec3 uCamPos;   // uWorldScale: FX_GLSL
${GLINT_GLSL}
${FX_LIGHT_GLSL}
varying vec3 vCol; varying float vAlpha; varying float vSide; varying float vHalfW; varying float vAlong; varying float vDist;
void main() {
  vec3 a = aA, b = aB;
#ifdef USE_FLATTEN
  a.y = mix(a.y, uFlattenY, uFlatten); b.y = mix(b.y, uFlattenY, uFlatten);
#endif
  float id = float(gl_InstanceID);
  float t0 = clamp(uDrawA * uCount - id, 0.0, 1.0), t1 = clamp(uDrawB * uCount - id, 0.0, 1.0);
  if (t1 <= t0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 a2 = mix(a, b, t0), b2 = mix(a, b, t1);
  mat4 M = modelMatrix;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
  vec4 wa = M * vec4(a2, 1.0), wb = M * vec4(b2, 1.0);
  wa.xyz = fxDisplace(wa.xyz); wb.xyz = fxDisplace(wb.xyz);
  vec4 va = viewMatrix * wa, vb = viewMatrix * wb;
  float zc = -1.0001 * projectionMatrix[3][2] / (projectionMatrix[2][2] - 1.0);   // −near
  if (va.z > zc && vb.z > zc) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (va.z > zc) va = mix(va, vb, (va.z - zc) / (va.z - vb.z));
  else if (vb.z > zc) vb = mix(vb, va, (vb.z - zc) / (vb.z - va.z));
  vec4 ca = projectionMatrix * va, cb = projectionMatrix * vb;
  vec2 hr = 0.5 * uResolution;
  vec2 sa = ca.xy / ca.w * hr, sb = cb.xy / cb.w * hr;
  vec2 d = sb - sa; float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  float coc = fxCoc(-va.z * 0.5 + -vb.z * 0.5);
  float wpx = max(aW * uWidth * uPixelRatio, 0.0);
  float flm = uImpact > 0.0 ? fxImpactLight(0.5 * (wa.xyz + wb.xyz)) : 1.0;   // ПРОСВЕТ: this member's share of the flash
  // ПРОСВЕТ width (T3 / T2 desktop, uFxCaps.x): SPEC's × (1 + 0.5·u), plus the light's own weight — a hall member the
  // flash lights fully (the near walls on the sheet) draws up to 3× its width, the far / off-sheet ones barely widen, the
  // Key itself (near field) keeps the SPEC's × 1.5: near/far
  // line weight, so the flash reads as a hall in depth lit from one source (quad sized for the widest case).
  float wpxQuad = wpx * (1.0 + 2.0 * max(uImpact, uImpactWarm) * uFxCaps.x) + coc * uFxCaps.x * uPixelRatio;
  float halfW = 0.5 * wpxQuad + 1.0;
  vec4 c = mix(ca, cb, position.x);
  vec4 v = mix(va, vb, position.x);
  c.xy += vec2(-dir.y, dir.x) * position.y * halfW / hr * c.w;
  gl_Position = c;
  vSide = position.y * halfW; vHalfW = 0.5 * (wpx * (1.0 + uImpact * uFxCaps.x * (0.5 * flm
    + 1.5 * smoothstep(0.4, 0.9, flm) * (uImpact > 0.0 ? fxImpactHall(0.5 * (wa.xyz + wb.xyz)) : 0.0))) + coc * uFxCaps.x * uPixelRatio);
  vAlong = position.x * len / uPixelRatio;
  float depth = -v.z;
  float al = aAl * uAlpha;
#ifdef USE_STRATA
  al *= strataAlpha(aFace);
#endif
#ifdef USE_STRUT
  al *= r1Lattice(uStrut, length(M[0].xyz), depth);
#endif
  // ПРОСВЕТ carries the distance fade out with the fog (fog × 0.15): the flash draws the hall to its 620 m walls (A2.0.3).
  float farI = uFar * (1.0 + 0.7 * uImpact);
  al *= 1.0 - smoothstep(0.55 * farI, farI, depth / max(uWorldScale, 1e-9));
  float w0 = max(aW * uWidth, 0.5);
  vec3 wp = mix(wa.xyz, wb.xyz, position.x);
  float fl = uImpact > 0.0 ? fxImpactLight(wp) : 1.0;
  al = mix(al, min(1.0, al * max(PV_FLOOR, 4.0 * fl * fl)), uImpact) * uFxLineA * (w0 / (w0 + coc));
  vec3 sd = wb.xyz - wa.xyz; float sl = length(sd);
  float g = sl > 1e-9 ? pow(1.0 - abs(dot(sd / sl, normalize(uLamp - wp))), 24.0) * uGlint * lampReach(wp) : 0.0;
#ifdef USE_COL_ATTR
  vec3 col = aCol;
#else
  vec3 col = uColor;
#endif
  col = mix(col, cWhite, uFlash);
  col = mix(col, cWhite, uImpact * fl) * (1.0 + fxWaveBright(wp));
  vCol = col * (1.0 + g);
  vAlpha = al;
  vDist = length(v.xyz);
}`;

const FRAG = /* glsl */ `
${FOG_GLSL}
uniform vec2 uDash;
varying vec3 vCol; varying float vAlpha; varying float vSide; varying float vHalfW; varying float vAlong; varying float vDist;
void main() {
  float cov = clamp(vHalfW + 0.5 - abs(vSide), 0.0, 1.0);
  if (vHalfW < 0.5) cov *= 2.0 * vHalfW + 0.0001;
#ifdef USE_DASH
  if (mod(vAlong, uDash.x + uDash.y) > uDash.x) discard;
#endif
  float a = vAlpha * cov;
  if (a <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, a);
}`;

function fillArray(n, v) { const a = new Float32Array(n); a.fill(v); return a; }

/** @returns {Lines} */
export function createLines(opts = {}) {
  const segments = opts.segments || new Float32Array(6);
  let count = opts.count != null ? opts.count : Math.floor(segments.length / 6);
  let capacity = Math.max(1, Math.floor(segments.length / 6));

  const geo = new InstancedBufferGeometry();
  geo.setAttribute('position', new BufferAttribute(QUAD_POS, 3));
  geo.setIndex(QUAD_IDX);

  let ib = new InstancedInterleavedBuffer(segments, 6);
  const setSegAttrs = () => {
    geo.setAttribute('aA', new InterleavedBufferAttribute(ib, 3, 0));
    geo.setAttribute('aB', new InterleavedBufferAttribute(ib, 3, 3));
  };
  setSegAttrs();

  const widthArr = opts.width instanceof Float32Array ? opts.width : fillArray(capacity, 1);
  const alphaArr = opts.alpha instanceof Float32Array ? opts.alpha : fillArray(capacity, 1);
  geo.setAttribute('aW', new InstancedBufferAttribute(widthArr, 1));
  geo.setAttribute('aAl', new InstancedBufferAttribute(alphaArr, 1));
  const defines = {};
  const colorIsArray = opts.color instanceof Float32Array;
  if (colorIsArray) { geo.setAttribute('aCol', new InstancedBufferAttribute(opts.color, 3)); defines.USE_COL_ATTR = ''; }
  if (opts.faces && opts.strata) { geo.setAttribute('aFace', new InstancedBufferAttribute(opts.faces, 1)); defines.USE_STRATA = ''; }
  if (opts.dash) defines.USE_DASH = '';
  if (opts.strut != null) defines.USE_STRUT = '';
  if (opts.flatten) defines.USE_FLATTEN = '';
  if (opts.fog !== false) defines.USE_FOG = '';
  geo.instanceCount = count;

  const uniforms = {
    uColor: colorUniform(colorIsArray ? 'silver' : (opts.color || 'silver')),
    uWidth: { value: typeof opts.width === 'number' ? opts.width : 1 },
    uAlpha: { value: typeof opts.alpha === 'number' ? opts.alpha : (opts.alpha instanceof Float32Array ? 1 : RENDER.r3.alpha) },
    uFar: { value: opts.far != null ? opts.far : defaultFar() },
    uGlint: { value: opts.glint != null ? opts.glint : RENDER.r3.glintGain },
    uFlatten: { value: 0 }, uFlattenY: { value: 0 },
    uDrawA: { value: 0 }, uDrawB: { value: 1 }, uCount: { value: count },
    uFlash: { value: 0 },
    uStrut: { value: opts.strut != null ? opts.strut : 0 },
    uDash: { value: new Vector2(opts.dash ? opts.dash[0] : 1, opts.dash ? opts.dash[1] : 0) },
    uStrataM: opts.strata || identityStrata(),
    uStrataA: opts.strataAlpha || onesStrata(),
    cWhite: U.cWhite, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity, uLamp: U.uLamp, uCamPos: U.uCamPos,
    uResolution: U.uResolution, uPixelRatio: U.uPixelRatio, uPxPerUnit: U.uPxPerUnit, uWorldScale: U.uWorldScale,
    ...fxUniforms(),
  };

  const mat = new ShaderMaterial({
    uniforms, defines, vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthWrite: false, depthTest: opts.depthTest !== false,
    blending: opts.additive ? AdditiveBlending : NormalBlending,
  });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  if (opts.layer != null) mesh.layers.set(opts.layer);
  if (opts.renderOrder != null) mesh.renderOrder = opts.renderOrder;

  const lines = {
    mesh,
    uniforms,
    get count() { return count; },
    setSegments(seg, n) {
      const c = n != null ? n : Math.floor(seg.length / 6);
      if (c <= capacity && seg !== ib.array) {
        ib.array.set(seg.subarray(0, c * 6));
        ib.needsUpdate = true;
      } else if (seg !== ib.array) {
        capacity = Math.max(c, Math.floor(seg.length / 6));
        ib = new InstancedInterleavedBuffer(seg, 6);
        setSegAttrs();
        if (widthArr.length < capacity && !(opts.width instanceof Float32Array)) geo.setAttribute('aW', new InstancedBufferAttribute(fillArray(capacity, 1), 1));
        if (alphaArr.length < capacity && !(opts.alpha instanceof Float32Array)) geo.setAttribute('aAl', new InstancedBufferAttribute(fillArray(capacity, 1), 1));
      } else {
        ib.needsUpdate = true;
      }
      count = c;
      geo.instanceCount = c;
      uniforms.uCount.value = c;
    },
    setColor(c) {
      if (c instanceof Float32Array) {
        geo.setAttribute('aCol', new InstancedBufferAttribute(c, 3));
        if (mat.defines.USE_COL_ATTR === undefined) { mat.defines.USE_COL_ATTR = ''; mat.needsUpdate = true; }
      } else {
        uniforms.uColor = colorUniform(c || 'silver');
        if (mat.defines.USE_COL_ATTR !== undefined) { delete mat.defines.USE_COL_ATTR; mat.needsUpdate = true; }
      }
    },
    setAlpha(a) { uniforms.uAlpha.value = a; mesh.visible = a > 0; },
    setWidth(w) { uniforms.uWidth.value = w; },
    setDrawRange01(a, b) { uniforms.uDrawA.value = a; uniforms.uDrawB.value = b; },
    setFlatten(u, y) { uniforms.uFlatten.value = u; uniforms.uFlattenY.value = y; },
    dispose() { geo.dispose(); mat.dispose(); if (mesh.parent) mesh.parent.remove(mesh); },
  };
  return lines;
}

// ─── Lattice twin material (LineSegments) ────────────────────────────────────────────────────────────────────
const LVERT = /* glsl */ `
${R1_GLSL}
${FX_GLSL}
#ifdef USE_STRATA
attribute float aFace;
${STRATA_GLSL}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
#ifdef DOF_TAP
uniform vec2 uResolution; uniform float uPixelRatio;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos; uniform vec3 cWhite;
${GLINT_GLSL}
${FX_LIGHT_GLSL}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  mat4 M = modelMatrix;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
  vec4 w = M * vec4(position, 1.0);
  w.xyz = fxDisplace(w.xyz);
  vec4 v = viewMatrix * w;
  float depth = -v.z;
#ifdef USE_ASTRUT
  float strut = aStrut;
#else
  float strut = uStrut;
#endif
  float la = r1Lattice(strut, length(M[0].xyz), depth);
  if (la < 0.002 || uFade <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  gl_Position = projectionMatrix * v;
  float g = 0.0;
#ifdef USE_DIR
  vec3 dw = normalize(mat3(M) * aDir);
  g = pow(1.0 - abs(dot(dw, normalize(uLamp - w.xyz))), 24.0) * uGlint * lampReach(w.xyz);
#endif
  float fl = uImpact > 0.0 ? fxImpactLight(w.xyz) : 1.0;   // ПРОСВЕТ: this strut's share of the flash
  vCol = mix(uColor, cWhite, uImpact * fl) * (1.0 + g + fxWaveBright(w.xyz));
  float farI = uFar * (1.0 + 0.7 * uImpact);                // ПРОСВЕТ: the fade follows the fog out to the 620 m walls
  vAlpha = uAlpha * uFade * la * (1.0 - smoothstep(0.55 * farI, farI, depth / max(uWorldScale, 1e-9)));
#ifdef USE_STRATA
  vAlpha *= strataAlpha(aFace);
#endif
  // DOF (A2.6.2): a 1-device-px GL hairline cannot widen, so its circle of confusion is SPREAD, not discarded: the line and
  // its two taps (attachDofTaps) sit across the CoC at −½, 0, +½ of it, a third of the alpha each — the energy of the
  // SPEC's widened line (alpha · w0/(w0+coc) over w0+coc px). A soft far wall stays a soft wall instead of vanishing.
  float coc = fxCoc(depth), spread = clamp(coc, 0.0, 1.0);
#ifdef DOF_TAP
  if (spread <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 pp = vec2(1.0, 0.0);
#ifdef USE_DIR
  vec4 c2 = projectionMatrix * viewMatrix * vec4(w.xyz + normalize(mat3(M) * aDir) * max(depth, 1e-3) * 0.01, 1.0);
  vec2 sd = (c2.xy / c2.w - gl_Position.xy / gl_Position.w) * uResolution; float sl = length(sd);
  if (sl > 1e-6) pp = vec2(-sd.y, sd.x) / sl;
#endif
  gl_Position.xy += pp * (DOF_TAP * coc * uPixelRatio / uResolution) * gl_Position.w;   // ±½ coc px (NDC = 2 px / res)
  float tapW = spread / 3.0;
#else
  float tapW = 1.0 - spread * 2.0 / 3.0;
#endif
  // the flash's share: the lit struts up to 4×, the ones it barely reaches recede (the eye adapts to the flash)
  vAlpha = min(1.0, vAlpha * uFxLineA * mix(1.0, max(PV_FLOOR, 4.0 * fl * fl), uImpact) * tapW);
  vDist = length(v.xyz);
}`;

const LFRAG = /* glsl */ `
${FOG_GLSL}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;

/** Hairline lattice material (1 device px GL lines). opts: { strut?: number (else per-vertex aStrut), color = 'silver',
 *  alpha = 0.55, far = 700, glint = 0.9, fog = true, strata?: uniform, strataAlpha?: uniform, dir?: boolean (geometry has aDir) } */
export function createLatticeMaterial(opts = {}) {
  const defines = {};
  if (opts.strut == null) defines.USE_ASTRUT = '';
  if (opts.strata) defines.USE_STRATA = '';
  if (opts.dir !== false) defines.USE_DIR = '';
  if (opts.fog !== false) defines.USE_FOG = '';
  return new ShaderMaterial({
    uniforms: {
      uStrut: { value: opts.strut != null ? opts.strut : 0 },
      uAlpha: { value: opts.alpha != null ? opts.alpha : RENDER.r3.alpha },
      uFade: { value: 1 },
      uFar: { value: opts.far != null ? opts.far : defaultFar() },
      uGlint: { value: opts.glint != null ? opts.glint : RENDER.r3.glintGain },
      uColor: colorUniform(opts.color || 'silver'),
      uStrataM: opts.strata || identityStrata(),
      uStrataA: opts.strataAlpha || onesStrata(),
      uLamp: U.uLamp, uCamPos: U.uCamPos, uWorldScale: U.uWorldScale, uPxPerUnit: U.uPxPerUnit, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity,
      uResolution: U.uResolution, uPixelRatio: U.uPixelRatio, cWhite: U.cWhite, ...fxUniforms(),
    },
    defines, vertexShader: LVERT, fragmentShader: LFRAG,
    transparent: true, depthWrite: false, blending: NormalBlending,
  });
}

// ─── DOF taps for the hairline lattices (A2.6.2) ─────────────────────────────────────────────────────────────
const TAPPED = [];
/** Adds the two DOF taps (−½ coc, +½ coc) to a lattice LineSegments made with createLatticeMaterial: children sharing
 *  its geometry and its uniform objects (fade, strata, far … follow), drawn only while a rack is on (syncDofTaps) and,
 *  with `when`, only while when() is true. */
export function attachDofTaps(ls, when) {
  if (!ls || !ls.material || ls.userData.dofTaps) return;
  ls.userData.dofWhen = typeof when === 'function' ? when : null;
  const m = ls.material;
  ls.userData.dofTaps = [-1, 1].map((k) => {
    const tm = new ShaderMaterial({ uniforms: m.uniforms, defines: { ...m.defines, DOF_TAP: k.toFixed(1) },
      vertexShader: m.vertexShader, fragmentShader: m.fragmentShader, transparent: true, depthWrite: false, blending: m.blending });
    const t = new LineSegments(ls.geometry, tm);
    t.name = 'latticeDofTap';
    t.frustumCulled = false;
    t.visible = false;
    t.renderOrder = ls.renderOrder;
    if (ls.onBeforeRender) t.onBeforeRender = ls.onBeforeRender;    // the strata sync, whichever draws first
    ls.add(t);
    return t;
  });
  TAPPED.push(ls);
}
/** Per frame (fx focus): taps on while the aperture is open; they follow a geometry rebuilt by a tier change. */
export function syncDofTaps(on) {
  for (let i = 0; i < TAPPED.length; i++) {
    const ls = TAPPED[i];
    // Only a lattice that is drawn at all takes taps (faded-out levels, a hidden Key, a Key whose lattice R1 keeps
    // collapsed at its viewing distance cost no vertex work twice over).
    const v = on && ls.material.uniforms.uFade.value > 0 && (!ls.userData.dofWhen || ls.userData.dofWhen());
    for (const t of ls.userData.dofTaps) { t.visible = v; if (v && t.geometry !== ls.geometry) t.geometry = ls.geometry; }
  }
}
