// key/grains.js — WP1. key.grains (ARCH §3.18.2, X§2.8.1; SPEC §3.1 "Grains", §3.3, §3.7; SPEC-ADDENDUM A2.6.1, A2.9,
// A5.1, A11.4). One THREE.Points, one draw call; every grain position is a closed-form function of its seed and a few
// uniforms (no GPGPU, no per-frame buffer writes):
//   rings  7 planes (the 6 gap planes + y = 0), annulus r ∈ [1.15, 1.90]·r_plane, Kepler ω = 0.06 / r^1.5, Brownian 2 mm
//   shell  UNFOLD: the grains lift off their planes into a loose shell (per-grain stagger)
//   plate  РЕЗОНАНС: plate-local targets written by WP4 in CPU chunks; each commit jumps prev → target with a per-grain
//          delay, travel and an arc ∝ |u| at the old position; flyToTargets = mode 7 (stagger by distance, arrive --ember,
//          cool to --white); uPulse kicks antinode grains along the plate normal (A6.5.7)
//   fall   release: 9.8 m/s² along plate −Y for 700 ms while fading, then re-form on the rings over 900 ms
// plus: breath alpha 0.32 ↔ 0.38, pointer repulsion (a 4-sample ray trail → the wake drifts back over 900 ms), flinch
// scatter +0.05 m, shiver, СВЕТ ИЗ ЩЕЛЕЙ on the gap planes, saved grains (2.6 px --white 85 %, singles then couples
// Δθ = 2°, ≤ 64), the СВЁРТКА spiral (radius × (1 − p), flat on the planes), FX_GLSL (ВОЛНА, DOF/heptagon bokeh).
import { BufferGeometry, BufferAttribute, Points, ShaderMaterial, NormalBlending, Matrix4, Vector3, Vector4 } from 'three';
import { U } from '../render/uniforms.js';
import { FOG_GLSL } from '../render/fog.js';
import { FX_GLSL, FX_HEPTAGON_GLSL, fxUniforms } from '../render/fxChunk.js';
import { STRATA_GEOM, radiusAt, GRAINS } from '../core/tokens.js';
import { mulberry32 } from '../core/rng.js';
import { breath } from '../core/clock.js';
import { ENV } from '../core/env.js';

const VERT = /* glsl */ `
${FX_GLSL}
attribute vec4 aG; attribute vec4 aM; attribute vec4 aPT;
uniform float uPlaneY[7]; uniform vec3 uRo[4]; uniform vec3 uRd[4]; uniform float uRw[4];
uniform float uKep, uT, uSpiral, uScatter, uShiver, uShell, uPlate, uFromRing, uStepT, uDelayMax, uTravel, uArc, uStagger,
  uWarm, uCool, uHalf, uFall, uReform, uMarks, uPairs, uGap, uPixelRatio, uA, uRev;
uniform vec4 uNM; uniform mat4 uPlateM;
uniform vec3 cSilver, cWhite, cEmber, cEmberDeep;
varying vec3 vCol; varying float vA; varying float vPx; varying float vDist; varying float vCoc; varying float vSaved;
float field(vec2 q, vec2 nm) {
  q = clamp(q, -1.0, 1.0) * 3.14159265;
  return cos(nm.x * q.x) * cos(nm.y * q.y) - cos(nm.y * q.x) * cos(nm.x * q.y);
}
void main() {
  float r = aG.y, th = aG.z, s = aG.w, k = aM.x, a = 1.0, px = aM.w, sv = 0.0;
  vec3 col = cSilver;
  if (k >= 0.0) {                                           // saved grains (A5.1) and couples (A11.4)
    float singles = min(uMarks, 64.0), total = min(64.0, singles + 2.0 * uPairs);
    if (k < total) {
      if (k >= singles && mod(k - singles, 2.0) > 0.5) { r = aM.y; th = aM.z + 0.0349066; }
      col = cWhite; sv = 1.0; px = 2.6;
    }
  }
  float rr = r * (1.0 - uSpiral) * (1.0 + 0.25 * (1.0 - uReform));
  float ang = th + 0.06 * pow(max(r, 0.05), -1.5) * uKep;
  vec3 ring = vec3(sin(ang) * rr, uPlaneY[int(aG.x + 0.5)], cos(ang) * rr);
  ring += 0.002 * vec3(sin(uT * 1.3 + s * 91.0), sin(uT * 1.7 + s * 37.0), sin(uT * 1.1 + s * 53.0));
  ring.xz += normalize(ring.xz + 1e-6) * uScatter;
  vec3 push = vec3(0.0);
  for (int q = 0; q < 4; q++) {                             // pointer repulsion: inverse-square, capped 0.06 m, 0.35 m reach
    vec3 w = ring - uRo[q]; vec3 pp = w - dot(w, uRd[q]) * uRd[q]; float d = max(length(pp), 0.02);
    push += pp / d * (uRw[q] * clamp(0.0015 * (1.0 / (d * d) - 8.163), 0.0, 0.06));
  }
  float pl = length(push); ring += pl > 0.06 ? push * (0.06 / pl) : push;
  float c = cos(acos(1.0 - 2.0 * fract(s * 7.31))), sn = sqrt(max(0.0, 1.0 - c * c));
  vec3 shell = vec3(sn * sin(ang), c * 0.8, sn * cos(ang)) * (1.25 + 0.55 * fract(s * 13.7));
  vec3 pos = mix(ring, shell, smoothstep(0.0, 1.0, clamp(uShell * 1.35 - fract(s * 3.7) * 0.35, 0.0, 1.0)));
  if (uPlate > 0.0) {
    vec3 nrm = normalize(uPlateM[2].xyz), up = normalize(uPlateM[1].xyz);
    vec3 tgt = (uPlateM * vec4(aPT.zw, 0.0, 1.0)).xyz;
    vec3 prv = uFromRing > 0.5 ? pos : (uPlateM * vec4(aPT.xy, 0.0, 1.0)).xyz;
    float dl = uStagger > 0.5 ? length(aPT.zw) / (uHalf * 1.4142) * uDelayMax : fract(s * 17.3) * uDelayMax;
    float x = uTravel > 0.0 ? clamp((uStepT - dl) / uTravel, 0.0, 1.0) : step(dl, uStepT);
    float e = x * x * (3.0 - 2.0 * x);
    float h = uArc * 0.07 * abs(field(aPT.xy / uHalf, uNM.xy)) * 0.5 * sin(3.14159265 * x);
    float kick = uPulse * 0.012 * abs(field(aPT.zw / uHalf, uNM.zw)) * 0.5;
    vec3 pp = mix(prv, tgt, e) + nrm * (h + kick);
    if (uWarm > 0.5) col = mix(col, mix(cEmber, cWhite, clamp((uStepT - dl - uTravel) / uCool, 0.0, 1.0)), smoothstep(0.75, 1.0, x));
    if (uFall >= 0.0) { float tf = min(uFall, 700.0) * 0.001; pp -= up * 4.9 * tf * tf; a *= 1.0 - clamp(uFall / 700.0, 0.0, 1.0); }
    pos = mix(pos, pp, uPlate);
  }
  pos += uShiver * vec3(sin(uT * 97.0 + s * 300.0), sin(uT * 89.0 + s * 211.0), sin(uT * 101.0 + s * 157.0));
  if (aG.x > 0.5) col = mix(col, cEmberDeep, 0.40 * smoothstep(0.03, 0.09, uGap) * pow(0.12 / max(length(pos.xz), 0.12), 2.0));  // СВЕТ ИЗ ЩЕЛЕЙ
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  wp.xyz = fxDisplace(wp.xyz);
  vec4 v = viewMatrix * wp;
  gl_Position = projectionMatrix * v;
  float coc = fxCoc(-v.z);
  float s0 = max(px, 1.0);
  vPx = max(px * uPixelRatio, 1.0) + coc * uPixelRatio;
  gl_PointSize = vPx + 1.0;
  // Saved grains: --white at 85 % (not breathing), only following the reveal.
  vA = (sv > 0.5 ? 0.85 * uRev : uA) * a * uReform * pow(s0 / (s0 + coc), 2.0);
  vSaved = sv;
  vCoc = coc;
  vCol = col * (1.0 + fxWaveBright(wp.xyz));
  vDist = length(v.xyz);
}`;

const FRAG = /* glsl */ `
${FOG_GLSL}
${FX_HEPTAGON_GLSL}
uniform vec2 uFxCaps;
varying vec3 vCol; varying float vA; varying float vPx; varying float vDist; varying float vCoc; varying float vSaved;
void main() {
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  // A saved grain is a struck point of light: its 85 % disc carries an opaque core (≈ 1 px wherever the point lands).
  if (vSaved > 0.5) cov = max(cov, clamp(2.0 - 1.5 * r, 0.0, 1.0) / max(vA, 0.01));
  if (uFxCaps.y > 0.5 && vCoc >= 2.0) cov = clamp((0.9009689 - fxHeptagon((gl_PointCoord - 0.5) * 2.0)) * (vPx + 1.0) * 0.5, 0.0, 1.0);
  float a = min(1.0, cov * vA);
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(vCol, vDist), a);
}`;

const TAU = Math.PI * 2;
const MARKS = 64;
/** Rest y of plane q: 0 = the y = 0 plane, 1…6 = the gap between stratum q − 1 and q. */
const PLANE0 = [0];
for (let q = 1; q < 7; q++) PLANE0.push((STRATA_GEOM[q - 1].bot + STRATA_GEOM[q].top) / 2);

export function createGrains(tierCount) {
  const cap = GRAINS.T3;
  const G = new Float32Array(cap * 4), M = new Float32Array(cap * 4), PT = new Float32Array(cap * 4), next = new Float32Array(cap * 2);
  const rnd = mulberry32(0x5a11);
  for (let g = 0; g < cap; g++) {
    const q = g < MARKS ? 0 : g % 7;
    const rp = Math.max(0.12, radiusAt(PLANE0[q]));
    const r = rp * (GRAINS.annulus[0] + (GRAINS.annulus[1] - GRAINS.annulus[0]) * Math.sqrt(rnd()));
    // Saved-grain slots sit on the y = 0 ring: the first eight alternate left / right across the front arc (so the first
    // ones saved are seen in front of the Key), the rest golden-angle spaced round the ring.
    const th = g < 8 ? (g % 2 ? 1 : -1) * (0.62 + 0.38 * (g >> 1)) : g < MARKS ? g * 2.39996 : rnd() * TAU;
    G.set([q, r, th, rnd()], g * 4);
    M.set([g < MARKS ? g : -1, 0, 0, GRAINS.sizePx[0] + (GRAINS.sizePx[1] - GRAINS.sizePx[0]) * rnd()], g * 4);
    if (g > 0 && g < MARKS) { M[g * 4 + 1] = G[(g - 1) * 4 + 1]; M[g * 4 + 2] = G[(g - 1) * 4 + 2]; }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(new Float32Array(cap * 3), 3));   // unused (the shader builds it)
  geo.setAttribute('aG', new BufferAttribute(G, 4));
  geo.setAttribute('aM', new BufferAttribute(M, 4));
  const aPT = new BufferAttribute(PT, 4);
  geo.setAttribute('aPT', aPT);
  geo.boundingSphere = null;
  const vec3s = () => [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  const u = {
    uPlaneY: { value: PLANE0.slice() }, uRo: { value: vec3s() }, uRd: { value: vec3s() }, uRw: { value: [0, 0, 0, 0] },
    uKep: { value: 0 }, uT: { value: 0 }, uSpiral: { value: 0 }, uScatter: { value: 0 }, uShiver: { value: 0 }, uShell: { value: 0 },
    uPlate: { value: 0 }, uFromRing: { value: 1 }, uStepT: { value: 0 }, uDelayMax: { value: 120 }, uTravel: { value: 260 },
    uArc: { value: 1 }, uStagger: { value: 0 }, uWarm: { value: 0 }, uCool: { value: 1500 }, uHalf: { value: 0.6 },
    uFall: { value: -1 }, uReform: { value: 1 }, uMarks: { value: 0 }, uPairs: { value: 0 }, uA: { value: 0.35 }, uRev: { value: 1 },
    uNM: { value: new Vector4(1, 2, 1, 2) }, uPlateM: { value: new Matrix4() },
    uGap: U.uGap, uPulse: U.uPulse, uPixelRatio: U.uPixelRatio, uFogDensity: U.uFogDensity, cAbyss: U.cAbyss,
    cSilver: U.cSilver, cWhite: U.cWhite, cEmber: U.cEmber, cEmberDeep: U.cEmberDeep, ...fxUniforms(),
  };
  const mat = new ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: NormalBlending });
  const object = new Points(geo, mat);
  object.name = 'grains';
  object.frustumCulled = false;

  let count = Math.min(cap, tierCount), mode = 'rings', reveal = 1;
  const st = { stepAt: -1, fallAt: -1, reformAt: -1, shell: 0, shellTarget: 0, scatterAt: -1e9, scatterM: 0, kep: 1 };
  const live = [new Vector3(), new Vector3(0, 0, -1)], hist = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  const histT = [-1e9, -1e9, -1e9];
  let lastSample = -1e9, rayOn = false, rayOffAt = -1e9, now = 0;
  geo.setDrawRange(0, count);

  function commit(opts, warm) {
    const o = opts || {};
    const n = count;
    for (let g = 0; g < n; g++) { const b = g * 4; PT[b] = PT[b + 2]; PT[b + 1] = PT[b + 3]; PT[b + 2] = next[g * 2]; PT[b + 3] = next[g * 2 + 1]; }
    aPT.needsUpdate = true;
    const cut = !!o.cut || ENV.reducedMotion;
    u.uFromRing.value = u.uPlate.value > 0 && mode === 'plate' && st.stepAt >= 0 ? 0 : 1;
    u.uPlate.value = 1;
    u.uWarm.value = warm ? 1 : 0;
    if (warm) {
      const ms = o.ms != null ? o.ms : 900;
      u.uDelayMax.value = cut ? 0 : ms * 0.35; u.uTravel.value = cut ? 0 : ms * 0.65; u.uStagger.value = 1; u.uArc.value = 0;
      u.uCool.value = o.coolMs != null ? o.coolMs : 1500;
    } else {
      u.uDelayMax.value = cut ? 0 : (o.delayMaxMs != null ? o.delayMaxMs : 120);
      u.uTravel.value = cut ? 0 : (o.travelMs != null ? o.travelMs : 260);
      u.uStagger.value = 0; u.uArc.value = o.arc === false || cut ? 0 : 1;
    }
    st.stepAt = now;
    st.fallAt = -1; u.uFall.value = -1;
  }

  const grains = {
    object,
    get count() { return count; },
    get mode() { return mode; },
    /** Grains drawn as saved (singles + both grains of every couple), ≤ 64. */
    get marked() { return Math.min(MARKS, u.uMarks.value + 2 * u.uPairs.value); },
    setMode(m) {
      const prev = mode;
      mode = m;
      if (m === 'shell') st.shellTarget = 1;
      else if (m === 'rings') { st.shellTarget = 0; u.uPlate.value = 0; st.stepAt = -1; st.fallAt = -1; u.uFall.value = -1; }
      else if (m === 'plate') { st.shellTarget = 0; if (prev !== 'plate') { st.stepAt = -1; u.uPlate.value = 0; } }
      else if (m === 'fall') { if (u.uPlate.value > 0) st.fallAt = now; else { mode = 'rings'; } }
    },
    setPlate(m, size) { if (m) u.uPlateM.value.copy(m); u.uHalf.value = (size || 1.2) / 2; },
    /** CPU chunks: plate-local metres, pairs; n grains from offset. */
    writeTargets(offset, xy, n) {
      const o = Math.max(0, offset | 0), c = Math.min(n | 0, cap - o);
      for (let i = 0; i < c * 2; i++) next[o * 2 + i] = xy[i];
    },
    /** Mode step jump. opts.nm = [n, m] of the new mode (WP4), so arcs and pulse kicks follow the right field. */
    commitTargets(opts) {
      const nm = opts && opts.nm, v = u.uNM.value;
      v.x = v.z; v.y = v.w;
      if (nm) { v.z = nm[0]; v.w = nm[1]; }
      commit(opts, false);
    },
    flyToTargets(opts) { commit(opts, true); },
    shiver(amp) { u.uShiver.value = ENV.reducedMotion ? 0 : Math.max(0, Math.min(0.01, +amp || 0)); },
    scatter(m) { if (!ENV.reducedMotion) { st.scatterAt = now; st.scatterM = m != null ? m : 0.05; } },
    /** A5.1 / A11.4: n single saved grains, then `pairs` couples (each two adjacent grains, Δθ = 2°); 64 grains at most. */
    markSaved(n, pairs = 0) { u.uMarks.value = Math.max(0, Math.min(MARKS, n | 0)); u.uPairs.value = Math.max(0, pairs | 0); },
    /** A2.9: rings spiral inward flat on their planes (radius × (1 − p)); 0 releases. kepler (optional) multiplies ω. */
    spiral(p, kepler) { u.uSpiral.value = Math.max(0, Math.min(1, +p || 0)); st.kep = kepler > 0 ? kepler : 1; },

    // ── WP1-internal ──
    setTierCount(n) { count = Math.max(0, Math.min(cap, n | 0)); geo.setDrawRange(0, count); },
    setReveal(a) { reveal = a; object.visible = a > 0; },
    /** Key-local pointer ray (origin, unit direction); on = false withdraws it (the wake relaxes over 900 ms). */
    setRay(o, d, on) {
      if (rayOn && !on) rayOffAt = now;
      rayOn = !!on;
      if (!on) return;
      live[0].copy(o); live[1].copy(d);
      if (now - lastSample < 225) return;
      lastSample = now;
      for (let q = 2; q > 0; q--) { histT[q] = histT[q - 1]; hist[q * 2].copy(hist[q * 2 - 2]); hist[q * 2 + 1].copy(hist[q * 2 - 1]); }
      histT[0] = now; hist[0].copy(o); hist[1].copy(d);
    },
    /** dt (world-scaled s), t (loop ms), gapDy(q) = the plane's current Δy, idle (breath on) */
    update(dt, t, worldS, planeDy) {
      now = t;
      // Reduced motion (SPEC §12.4): no idle drift — the rings hold still (no Kepler orbit, no Brownian jitter).
      if (!ENV.reducedMotion) { u.uKep.value += dt * st.kep; u.uT.value = worldS; }
      for (let q = 0; q < 7; q++) u.uPlaneY.value[q] = PLANE0[q] + planeDy[q];
      st.shell += (st.shellTarget - st.shell) * (1 - Math.exp(-dt / 0.16));
      u.uShell.value = st.shell;
      u.uStepT.value = st.stepAt >= 0 ? t - st.stepAt : 0;
      const sc = t - st.scatterAt;
      u.uScatter.value = sc < 0 ? 0 : sc < 120 ? st.scatterM * (sc / 120) : sc < 820 ? st.scatterM * (1 - (sc - 120) / 700) : 0;
      if (st.fallAt >= 0) {
        const f = t - st.fallAt;
        u.uFall.value = f;
        if (f >= 700) { st.fallAt = -1; u.uFall.value = -1; u.uPlate.value = 0; st.stepAt = -1; mode = 'rings'; st.reformAt = t; }
      }
      u.uReform.value = st.reformAt < 0 ? 1 : Math.min(1, (t - st.reformAt) / 900);
      if (u.uReform.value >= 1) st.reformAt = -1;
      // Ray trail: slot 0 = live (1 while on, then relaxing over 900 ms), slots 1…3 = 225 ms samples aging out over 900 ms.
      const ro = u.uRo.value, rd = u.uRd.value, rw = u.uRw.value;
      ro[0].copy(live[0]); rd[0].copy(live[1]); rw[0] = rayOn ? 1 : Math.max(0, 1 - (t - rayOffAt) / 900);
      for (let q = 1; q < 4; q++) { ro[q].copy(hist[(q - 1) * 2]); rd[q].copy(hist[(q - 1) * 2 + 1]); rw[q] = Math.max(0, 1 - (t - histT[q - 1]) / 900) * 0.8; }
      u.uA.value = breath.mix(0.32, 0.38) * reveal;
      u.uRev.value = reveal;
    },
  };
  return grains;
}
