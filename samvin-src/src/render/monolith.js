// render/monolith.js — HERO PROTOTYPE «МОНОЛИТ»: the Key's own surface (replaces R2's main() for the Key solids only;
// VIN levels and halls keep obsidian.js). An ancient artifact of dark forged metal:
//   · procedural micro-detail (value-noise fbm in stratum-local metres: patina patches, pitting, oxidised steel)
//   · rounded worn bevels on every crease (normal bent within 12 mm of an edge) whose polished metal catches the lamp
//   · machined grooves (two lathe channels per face) and the Hepta frieze cut as runes that hold a faint ember heat
//   · the seven signs FORGED IN RELIEF: polished silver tops, a soft contact shadow round them, their lower lips lit
//     ember from below (the light breathing out of the seams beneath)
//   · ember light breathing out of the strata seams: the gap caps glow from the axis outward, the outer lips warm
//   · the hollow of stratum 3 lit by the nucleus (inverse-square), and the • window's bore and rim spilling ember
//   · light: the R5 lamp (normalised Blinn, roughness from the noise), a fixed «cavern» environment (an overhead
//     softbox + two back strip lights + a warm floor bounce, blurred by roughness), cold silver rim, all in ≈linear
//     space (c²) with a soft shoulder, back to display space (√) before R8 fog.
// Palette: obsidian / steel / pewter / silver body, the ONE warm accent ember (electrum at night, like the nucleus).
// Quality: MONO_Q 3 (T3) · 2 (T2) · 1 (T1) octaves / taps.
export const MONO_GLSL = /* glsl */ `
uniform vec3 cEmber, cEmberDeep, cSteel, cPewter, cSlate, cObsidian, cElectrum;
uniform float uNight, uBreath, uWorldTime, uGap, uEmissivePass;
uniform vec3 uNuc; uniform float uNucI, uNucS, uSeam;
varying vec3 vUp;

float h31(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1.0, 0.0, 0.0)), f.x), mix(h31(i + vec3(0.0, 1.0, 0.0)), h31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(h31(i + vec3(0.0, 0.0, 1.0)), h31(i + vec3(1.0, 0.0, 1.0)), f.x), mix(h31(i + vec3(0.0, 1.0, 1.0)), h31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float s = vnoise(p) * 0.55;
#if MONO_Q > 1
  s += vnoise(p * 2.63 + 3.1) * 0.30;
#else
  s += 0.15;
#endif
#if MONO_Q > 2
  s += vnoise(p * 6.91 + 7.7) * 0.15;
#else
  s += 0.075;
#endif
  return s;
}
vec3 lin(vec3 c) { return c * c; }

void main() {
  float si = floor(vFace / 16.0 + 0.001);
  float fj = vFace - si * 16.0;
  if (abs(si - 3.0) < 0.5 && vLocal.z > 0.0 && length(vLocal.xy) < uApertureR) discard;   // the • through-aperture
  if (vKind > 0.5 && vKind < 2.5 && abs(si - uHideCapsOf) < 0.5) discard;
  float alpha = vSolid * uAlpha;
  if (alpha <= bayer8(gl_FragCoord.xy)) discard;

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(uLamp - vWorld);
  vec3 up = normalize(vUp);
  int ii = int(si + 0.5);
  float n = uN[ii];
  vec3 p = vLocal;
  bool outer = vKind < 0.5, inner = vKind > 2.5, cap = !outer && !inner;
  // lathe-turned: each face keeps its flat facet round the ring but follows the profile r(y) smoothly from lip to lip
  // (the loft rows' creases vanish; the light glides down the face like on a turned barrel)
  if (outer) {
    float ay = min(abs(p.y) / 1.2, 1.0);
    float drdy = -0.62 * 1.35 * pow(max(ay, 1e-4), 0.35) / 1.2 * sign(p.y) * cos(3.14159265 / n);
    vec3 Nh = N - up * dot(N, up);
    N = normalize(normalize(Nh) - up * drdy);
  }
  // the hollow is a bored shaft: its wall turns smoothly round the axis (the flat facets would mirror the cavern's
  // strip lights as hard-edged bright panels seen down the shaft through an open gap) — the facet normal is turned
  // about the stratum's up by the fragment's angle from its facet's centre (face j faces 2πj/n)
  if (inner) {
    float dA = atan(p.x, p.z) - 6.28318531 * fj / n;
    dA -= 6.28318531 * floor(dA / 6.28318531 + 0.5);
    N = normalize(N * cos(dA) + cross(up, N) * sin(dA));
  }

  // ── micro-detail ──
  float nz = fbm(p * 6.5 + vec3(si * 13.1, si * 3.7, 0.0));
#if MONO_Q > 1
  float nz2 = vnoise(p * 41.0 + 5.0);
  float pit = smoothstep(0.86, 0.96, nz2) * smoothstep(0.40, 0.70, nz) * 0.7;
#else
  float pit = 0.0;
#endif

  // ── worn, rounded bevels ──
  vec3 T = cross(up, N); T = T / max(length(T), 1e-4);
  vec3 S = up - N * dot(N, up); S = S / max(length(S), 1e-4);
  float fw = 2.0 * length(p.xz) * tan(3.14159265 / n);
  float dz = outer ? vEng.z : 1.0, dw = outer ? vEng.w : 1.0;
  float dl = outer ? vFaceUV.x * fw : 1.0, dr = outer ? (1.0 - vFaceUV.x) * fw : 1.0;
  float kl = 1.0 - smoothstep(0.0, 0.013, dl), kr = 1.0 - smoothstep(0.0, 0.013, dr);
  float kt = 1.0 - smoothstep(0.0, 0.010, dz), kb = 1.0 - smoothstep(0.0, 0.010, dw);
  kl *= kl; kr *= kr; kt *= kt; kb *= kb;
  vec3 Nm = N + T * (kr - kl) * 0.70 + S * (kt - kb) * 0.80;
  float edge = max(max(kl, kr), max(kt, kb));
  vec3 N0bend = vec3(0.0);
  float wear = smoothstep(0.30, 0.85, edge * 1.25 + (nz - 0.5) * 0.9 - pit * 0.4);
  float cav = 1.0 - 0.45 * pit;
#if MONO_Q > 1
  // forged: a slow hammered unevenness bends every face a little, so the lamp's highlight breaks up across it
  if (outer) {
    vec3 tH = normalize(vec3(p.z, 0.0, -p.x) + 1e-5);
    vec3 hp = p * 7.0 + vec3(si * 5.3);
    float h0 = vnoise(hp), hx = vnoise(hp + tH * 0.06), hy = vnoise(hp + vec3(0.0, 0.06, 0.0));
    float hk = 0.55 * (1.0 - edge);
    N0bend = (T * (hx - h0) + S * (hy - h0)) * hk * 4.0;
  }
#endif
  Nm += N0bend;
  // age: vertical run-off streaks and a darker crust toward the lower lip of every stratum
#if MONO_Q > 1
  float streak = vnoise(vec3(atan(p.x, p.z) * 38.0, p.y * 2.2, si * 3.0));
  cav *= 1.0 - 0.10 * smoothstep(0.55, 0.95, streak) * (outer ? 1.0 : 0.0);
#endif

  // machined lathe channels: one under the tick row, one over the bottom frieze
  if (outer) {
    float w = 0.0042;
    float g1 = (dz - (uFriezeH + uTickL + 0.010)) / w, g2 = (dw - (uFriezeH + 0.008)) / w;
    float e1 = exp(-g1 * g1), e2 = exp(-g2 * g2);
    Nm += S * (g1 * e1 - g2 * e2) * 0.9;
    cav *= 1.0 - 0.35 * (e1 + e2);
    wear = max(wear, 0.55 * smoothstep(0.2, 0.9, exp(-(g1 + 1.2) * (g1 + 1.2)) + exp(-(g2 - 1.2) * (g2 - 1.2))) * (0.6 + 0.4 * nz));
  }

  // the recessed panel on every face (a carved cartouche: walls catch the lamp, the floor holds shadow)
  float recess = 0.0;
  if (outer) {
    float pl = dl - 0.020, pr = dr - 0.020, pt = dz - 0.032, pb = dw - 0.026;
    float pm = min(min(pl, pr), min(pt, pb));
    recess = smoothstep(0.0, 0.0055, pm);
    float ramp = recess * (1.0 - recess) * 4.0;
    vec3 wallN = pm == pl ? T : pm == pr ? -T : pm == pt ? -S : S;
    Nm += wallN * ramp * 1.1;
    cav *= 1.0 - 0.42 * recess * exp(-max(pm, 0.0) / 0.014);
    wear = max(wear, (1.0 - recess) * smoothstep(-0.006, 0.0, pm) * (0.5 + 0.5 * nz));   // the frame's lip is polished
  }

  // ── ember: the nucleus and the seams ──
  // (the • window's iris, bore and spill below are the nucleus's own light: electrum at 55 % at night, like it — S10)
  vec3 emberC = lin(mix(cEmber, cElectrum, uNight)) * mix(1.0, 0.55, uNight);
  float open = smoothstep(0.022, 0.09, uGap);
  float seamS = uSeam * (0.30 + 0.70 * exp(-abs(si - 3.0) * 0.55)) * (0.78 + 0.22 * uBreath) * (1.0 + 1.5 * open);
  // a sleeping machine: the heat is uneven round the ring and slowly travels
  float ang = atan(p.x, p.z);
#if MONO_Q > 1
  float seamMod = 0.30 + 0.95 * smoothstep(0.30, 0.80, vnoise(vec3(ang * 2.6 + uWorldTime * 0.12, si * 7.0, uWorldTime * 0.05)))
                * (0.65 + 0.35 * sin(ang * 2.0 - uWorldTime * 0.55 + si * 1.7));
#else
  float seamMod = 0.55 + 0.45 * sin(ang * 2.0 - uWorldTime * 0.55 + si * 1.7) * sin(ang * 3.0 + uWorldTime * 0.21 + si);
#endif
  vec3 em = vec3(0.0);

  // ── engraving / relief ──
  vec3 F0 = lin(cPewter) * (0.42 + 0.40 * nz);
  float pw = mix(16.0, 54.0, nz);
  vec3 base = lin(cObsidian) * (0.45 + 0.85 * nz);
  base = mix(base, lin(cSteel), smoothstep(0.55, 0.85, nz) * 0.45);
  float relief = 0.0;
  vec2 auv = engraveUV();
  if (auv.x >= 0.0) {
    vec4 t = texture2D(uAtlas, auv);
    float h = t.r;
    float hl = texture2D(uAtlas, auv - vec2(uTexel, 0.0)).r, hr = texture2D(uAtlas, auv + vec2(uTexel, 0.0)).r;
    float hu = texture2D(uAtlas, auv - vec2(0.0, uTexel)).r, hd = texture2D(uAtlas, auv + vec2(0.0, uTexel)).r;
    if (gEng > 3.5) {
      // FORGED RELIEF: height = 1 − h, the normal tilts the other way; polished tops; contact shadow; ember lower lips
      relief = 1.0 - h;
      Nm += ((hr - hl) * T - (hd - hu) * S) * 2.2;
      float o = uTexel * 4.0;
      float halo = (1.0 - texture2D(uAtlas, auv + vec2(o, 0.0)).r) + (1.0 - texture2D(uAtlas, auv - vec2(o, 0.0)).r)
                 + (1.0 - texture2D(uAtlas, auv + vec2(0.0, o)).r) + (1.0 - texture2D(uAtlas, auv - vec2(0.0, o)).r);
#if MONO_Q > 1
      float o2 = uTexel * 9.0;
      halo += 0.5 * ((1.0 - texture2D(uAtlas, auv + vec2(0.0, o2)).r) + (1.0 - texture2D(uAtlas, auv - vec2(o2 * 0.7, -o2 * 0.7)).r)
                   + (1.0 - texture2D(uAtlas, auv + vec2(o2 * 0.7, o2 * 0.7)).r) + (1.0 - texture2D(uAtlas, auv - vec2(0.0, o2)).r));
      halo /= 6.0;
#else
      halo /= 4.0;
#endif
      cav *= 1.0 - 0.70 * halo * (1.0 - relief);
      // the lip: inside the stroke, with open face 3 texels below (atlas v grows downward)
      float below = texture2D(uAtlas, auv + vec2(0.0, uTexel * 3.0)).r;
      float lip = relief * below;
      em += emberC * lip * seamS * 1.25;
      // the face just under a stroke catches the same warm light
      float above = 1.0 - texture2D(uAtlas, auv - vec2(0.0, uTexel * 4.0)).r;
      em += emberC * above * (1.0 - relief) * seamS * 0.22;
      F0 = mix(F0, lin(cSilver) * 1.05, relief * 0.95);
      pw = mix(pw, 90.0, relief);
      base = mix(base, lin(cSlate) * 0.6, relief);
      wear = max(wear, relief * (0.55 + 0.45 * nz));
    } else {
      // engraved: frieze runes (hold the heat), ticks, laws
      float k = 2.4;
      Nm += (-(hr - hl) * T + (hd - hu) * S) * k;
      float depth = 1.0 - h;
      cav *= 1.0 - depth * 0.55;
      if (gEng < 1.5) em += emberC * depth * seamS * seamMod * 0.5;
      else if (gEng > 2.5) { F0 = mix(F0, lin(cSilver) * 0.8, t.g * 0.6); em += emberC * depth * 0.10 * uSeam; }
    }
  }
#if MONO_Q > 1
  // inscriptions: the panel floors of the plain faces carry rows of Hepta runes (the frieze cells, cut faint and shallow)
  if (outer && auv.x < 0.0 && recess > 0.9 && fj > 0.5 && abs(fj - floor(n / 2.0)) > 0.5 && !(abs(si - 3.0) < 0.5 && abs(fj - 5.0) < 0.5)) {
    // one inscription line across the panel's middle, cells 34 × 46 mm, word gaps, on about half of the faces
    vec2 cell = vec2(0.034, 0.046);
    float hf = dz + dw;
    vec2 q = vec2(dl - 0.5 * fw, dz - 0.5 * hf) / cell + vec2(0.0, 0.5);
    float halfN = floor((fw - 0.064) / cell.x * 0.5);
    vec2 ci = floor(q), cf = fract(q);
    float hsh = h31(vec3(ci.x + 11.0, 3.0, si * 16.0 + fj));
    bool onFace = h31(vec3(si, fj, 7.0)) > 0.35;
    if (onFace && ci.y == 0.0 && abs(ci.x + 0.5) < halfN && hsh > 0.2 && hf > 0.24) {
      float c = floor(h31(vec3(ci.yx + 3.0, fj + si * 5.0)) * 64.0);
      vec2 ruv = vec2((c + mix(0.12, 0.88, cf.x)) / 64.0, 0.125 + mix(0.10, 0.90, cf.y) * 0.03125);
      float rh = smoothstep(0.25, 0.75, texture2D(uAtlas, ruv).r);
      float rl = smoothstep(0.25, 0.75, texture2D(uAtlas, ruv - vec2(uTexel, 0.0)).r), rr2 = smoothstep(0.25, 0.75, texture2D(uAtlas, ruv + vec2(uTexel, 0.0)).r);
      float ru = smoothstep(0.25, 0.75, texture2D(uAtlas, ruv - vec2(0.0, uTexel)).r), rd = smoothstep(0.25, 0.75, texture2D(uAtlas, ruv + vec2(0.0, uTexel)).r);
      Nm += (-(rr2 - rl) * T + (rd - ru) * S) * 1.4;
      cav *= 1.0 - (1.0 - rh) * 0.35;
      em += emberC * (1.0 - rh) * seamS * seamMod * 0.16;
    }
  }
#endif
  // the • window: a machined iris — three stepped rings funnel into the aperture, their lips polished, the grooves
  // between them holding a thin ring of ember light
  float iris = 0.0, irisX = 1.0;
  if (abs(si - 3.0) < 0.5 && outer && fj < 0.5) {
    float rr = length(p.xy);
    irisX = (rr - uApertureR) / 0.085;
    if (irisX < 1.0) {
      vec3 rad = normalize(T * p.x + S * p.y + 1e-5);
      float f = fract(irisX * 3.0);
      float lipE = exp(-pow(f / 0.07, 2.0)), grv = exp(-pow((f - 0.93) / 0.05, 2.0));
      iris = 1.0 - smoothstep(0.92, 1.0, irisX);
      Nm += rad * (-0.30 * (1.0 - irisX) + 1.6 * lipE - 1.2 * grv) * iris;
      recess *= 1.0 - iris;
      wear = mix(wear, max(lipE, 0.35), iris);
      cav *= 1.0 - 0.55 * grv * iris;
      em += emberC * uNucI * grv * iris * (0.55 + 0.45 * uBreath) * (1.4 - irisX) * 0.9;
    }
  }
  vec3 Nf = normalize(Nm);

  // the • window: its bore and its rim spill the nucleus
  if (abs(si - 3.0) < 0.5 && outer && fj < 0.5) {
    float rA = length(p.xy) - uApertureR;
    em += emberC * uNucI * (1.15 * exp(-max(rA, 0.0) / 0.0045) + 0.32 * exp(-max(rA, 0.0) / 0.03));
  }
  // the seams: outer lips warm, caps glow from the axis outward (they show through the gaps)
  if (outer) {
    float lipK = exp(-dz / 0.003) + exp(-dw / 0.003);
    em += emberC * seamS * seamMod * (1.25 * lipK + 0.14 * exp(-dz / 0.035) + 0.14 * exp(-dw / 0.035));
    em += lin(mix(cEmber, cElectrum, 0.55)) * seamS * seamS * seamMod * seamMod * exp(-min(dz, dw) / 0.0012) * 0.9;
  } else if (cap) {
    float rr = length(p.xz);
    // a molten face: hottest round the axis, cooling to deep ember at the rim, veined by the slow noise
    float c = 1.0 - smoothstep(0.03, 0.66, rr);
    float vein = smoothstep(0.35, 0.75, nz);
    vec3 capC = mix(lin(cEmberDeep) * 0.8, emberC, 0.35 + 0.65 * c);
    em += capC * seamS * (0.30 + 1.15 * c * c) * (0.55 + 0.6 * vein) * (0.45 + 0.55 * seamMod);
    em += lin(mix(cEmber, cElectrum, 0.5)) * seamS * open * pow(c, 3.0) * 0.45;
    base *= 0.25;
    F0 *= 0.35;
  } else {
    // the hollow, lit by the nucleus
    float d = distance(vWorld, uNuc) / max(uNucS, 1e-4);
    float fall = 0.06 / (0.06 + d * d);
    float swirl = vnoise(vec3(p.x * 9.0, p.y * 14.0 - uWorldTime * 0.35, p.z * 9.0));
    em += lin(mix(cEmber, cElectrum, uNight)) * uNucI * (0.10 + 1.25 * fall) * (0.45 + 1.1 * nz * swirl);
    em += lin(cElectrum) * uNucI * fall * fall * 0.8 * swirl;
    base *= 0.5;
  }

#ifdef MONO_EMISSIVE
  // the T3 bloom twin (world/structure.js solidEmissive): only the ember light is needed — the metal's shading below is
  // compiled out (the em terms never read it), so the second pass costs a fraction of the first
  { vec3 e = em / (1.0 + 0.18 * max(em.r, max(em.g, em.b)));
    gl_FragColor = vec4(sqrt(max(e, vec3(0.0))) * 1.35, 1.0);
    return; }
#endif
  // ── wear: polished metal ──
  F0 *= 1.0 - 0.3 * recess * (1.0 - relief);
  base *= 1.0 - 0.25 * recess;
  F0 = mix(F0, lin(cSilver) * 0.95, wear);
  pw = mix(pw, 220.0, wear);
  base *= 1.0 - 0.5 * wear;

  // ── light ──
  float nl = max(dot(Nf, L), 0.0);
  float nv = max(dot(Nf, V), 1e-3);
  vec3 H = normalize(L + V);
  float nh = max(dot(Nf, H), 0.0);
  vec3 F = F0 + (vec3(1.0) - F0) * pow(1.0 - nv, 5.0) * 0.6;
  vec3 Li = lin(cWhite) * 2.6 * uLampOn;
  vec3 col = base * nl * Li * 0.42;
  col += F * ((pw + 8.0) / 25.13) * pow(nh, pw) * nl * Li;
  vec3 R = reflect(-V, Nf);
  float ew = 0.10 + 2.2 / sqrt(pw);
  vec3 env = lin(cSilver) * 0.62 * smoothstep(0.05 - ew, 1.0, R.y) * smoothstep(0.05 - ew, 1.0, R.y)
           + lin(cWhite) * 0.85 * smoothstep(0.90 - ew, 0.995, dot(R, vec3(-0.80, 0.22, -0.56)))
           + lin(cSilver) * 0.45 * smoothstep(0.90 - ew, 0.995, dot(R, vec3(0.86, 0.06, -0.50)))
           + lin(cSteel) * 0.22 + lin(cSteel) * 0.50 * exp(-R.y * R.y * 4.0)
           + lin(cSilver) * 0.22 * exp(-pow((R.y + 0.12) / (0.05 + 0.6 * ew), 2.0))
           + emberC * uSeam * 0.10 * smoothstep(-0.15, -0.85, R.y);
  col += env * F * cav;
  col += base * lin(cSteel) * 0.5 * (0.5 + 0.5 * Nf.y);                               // cavern ambient
  if (outer) {   // the seams light the metal next to them (a warm sheen that follows the metal's reflectance)
    float nearSeam = exp(-dz / 0.045) * max(-Nf.y + 0.35, 0.0) + exp(-dw / 0.045) * max(Nf.y + 0.35, 0.0);
    col += (F * 1.4 + base * 0.6) * emberC * seamS * seamMod * nearSeam * 1.3 * cav;
    // the window's spill on the polished iris and the face round it
    col += F * emberC * uNucI * (iris * 1.3 * exp(-max(irisX, 0.0) * 3.2) + 0.12 * exp(-max(irisX, 0.0) * 2.0)) * (abs(si - 3.0) < 0.5 && fj < 0.5 ? 1.0 : 0.0);
  }
  col += lin(cSilver) * 0.16 * pow(1.0 - nv, 4.0) * (0.35 + 0.65 * max(Nf.y, 0.0)) * cav;   // cold rim
  // the cavern's back light: a cold sheet of light behind and above-left — it draws the silhouette out of the dark,
  // brightest on the polished edges (so the huge outline reads first, then the detail)
  vec3 Lb = normalize(vec3(-0.55, 0.45, -0.70));
  float bk = pow(1.0 - nv, 2.2) * smoothstep(-0.25, 0.6, dot(Nf, Lb));
  col += lin(cSilver) * bk * (0.35 + 0.9 * wear) * F * 3.2 * cav;
  // the floor of the cavern glows faintly warm: down-facing metal catches it
  col += F * emberC * uSeam * 0.35 * smoothstep(0.0, -0.9, Nf.y) * cav;
  col *= cav;
  if (uEmissivePass > 0.5) {                       // T3 bloom source: only the ember light, the metal stays black
    vec3 e = em / (1.0 + 0.18 * max(em.r, max(em.g, em.b)));
    gl_FragColor = vec4(sqrt(max(e, vec3(0.0))) * 1.35, 1.0);
    return;
  }
  col += em;
  col = col / (1.0 + 0.18 * max(col.r, max(col.g, col.b)));
  // hue-preserving shoulder: an over-bright ember stays ember (never drifts to peach), with only a little white heat
  float mx = max(col.r, max(col.g, col.b));
  if (mx > 1.0) col = col / mx + (1.0 - 1.0 / mx) * 0.12;
  col = sqrt(max(col, vec3(0.0)));
#if MONO_Q < 3
  // T1 / T2 have no bloom pass. On T3 the bloom of the solids' ember light is what turns a parted cap and the nucleus-lit
  // shaft below it into molten metal — white-hot at the core, ember toward the rim (the approved look). Without it the
  // same light is an even orange plate, so while the strata stand apart the heat gradient is put in the surface itself,
  // from its own ember light: ember → amber-gold → white-gold (electrum, A12: the molten cap centres) where it is
  // hottest. Closed (the rest pose) nothing changes.
  if (!outer && open > 0.0) {
    float hm = max(em.r, max(em.g, em.b));
    float th = inner ? smoothstep(0.05, 0.55, hm) : smoothstep(0.10, 0.85, hm);   // the shaft: nearer the nucleus, hotter
    vec3 heat = mix(mix(cEmber, cElectrum, 0.66), mix(cElectrum, cWhite, 0.6), smoothstep(0.45, 1.0, th));
    col = mix(col, heat * (0.86 + 0.14 * th), th * 0.95 * open);
  }
#endif

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
