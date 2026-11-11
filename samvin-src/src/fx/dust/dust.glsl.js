// fx/dust/dust.glsl.js — «ПЫЛЬ ПОД ЛАМПОЙ» shaders (SPEC-ADDENDUM A2.7; law L5). OWNER: WP12.
// Every mote is a closed-form function of its seed (position attribute = 3 uniform randoms, + a hash of gl_VertexID),
// its emitter slot (found from gl_VertexID in the slot table) and world time — so ПАУЗА and the СВЁРТКА tape stop freeze
// it for free. Slot vec4s: E0 (type, birth t, start, count), E1, E2, E3 (per type, see emitters.js).
// Light: lamp (Henyey–Greenstein g 0.62, forward scattering, inverse-square reach r0), the boot light sheet (--white),
// the nucleus and the open gap planes (--ember-deep ≤ 40 %, A2.6.1), the boot's 3 % ambient term; glitter
// (0.6 + 0.4·step(0.92, fract(seed·91.7 + lampAngle·7))) keeps sparkling when positions are frozen. Alpha ≤ 0.30, never
// emissive, hidden during ПРОСВЕТ, ×fog. Analytic DOF from FX_GLSL; heptagon bokeh in the fragment.
import { FX_GLSL, FX_HEPTAGON_GLSL } from '../../render/fxChunk.js';

export const DUST_VERT = /* glsl */ `
${FX_GLSL}
uniform vec4 E0[8], E1[8], E2[8], E3[8], uSp[8], uSv[8], uImp, uSheet, uDep;
uniform vec3 uThr[24], uLamp, uCamPos, uNuc; uniform mat4 uStr[7];
uniform float uT, uLampAng, uLampI, uAmb, uCol, uColT, uBreath, uPixelRatio, uGap, uFogDensity, uStrY[14], uStrN[7];
varying float vA, vCoc, vPx, vW, vE;
float h1(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
vec3 cr(vec3 a, vec3 b, vec3 c, vec3 d, float t){ float t2 = t*t, t3 = t2*t; return 0.5*((2.0*b) + (-a+c)*t + (2.0*a-5.0*b+4.0*c-d)*t2 + (-a+3.0*b-3.0*c+d)*t3); }
vec3 ballistic(vec3 p0, vec3 v0, float g, float k, float tau){ float e = (1.0 - exp(-k*tau))/k; return p0 + v0*e + vec3(0.0, -g, 0.0)*(tau - e)/k; }
float rr(float y){ float a = min(1.0, abs(y)/1.2); return 0.62*(1.0 - pow(a, 1.35)); }
void main(){
  float id = float(gl_VertexID);
  vec3 s = position; float sw = h1(id * 0.7131 + 3.1);
  int k = -1;
  for (int i = 0; i < 8; i++) { if (E0[i].x > 0.5 && id >= E0[i].z && id < E0[i].z + E0[i].w) k = i; }
  if (k < 0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec4 e0 = E0[k], e1 = E1[k], e2 = E2[k], e3 = E3[k];
  float ty = e0.x, tau = max(0.0, uT - e0.y), sc = e1.w;
  vec3 p; float self = 0.0, fade = 1.0; bool amb = ty < 1.5;
  if (amb) {
    float a = 6.2831853 * s.y;
    if (e2.x < 0.5) { vec3 d = vec3(cos(a)*sqrt(1.0 - (2.0*s.z-1.0)*(2.0*s.z-1.0)), 2.0*s.z - 1.0, sin(a)*sqrt(1.0-(2.0*s.z-1.0)*(2.0*s.z-1.0))); p = d * (e3.w > 0.0 ? (s.x < 0.7 ? mix(1.2, 4.2, s.x / 0.7) : mix(e3.w, e2.y, (s.x - 0.7) / 0.3)) : e2.y * pow(s.x, 0.75)); if (e2.z > 0.0) p.y = abs(p.y); }
    else p = vec3(cos(a)*e2.y*sqrt(s.x), mix(e2.z, e2.w, s.z), sin(a)*e2.y*sqrt(s.x));
    vec3 ph = fract(s * 17.13 + sw) * 6.2831853, w = 0.1 + 0.3 * fract(s.yzx * 9.71);
    float amp = e3.x * (uCol > 0.5 && uCol < 1.5 ? 4.0 : 1.0);
    p += amp * (sin(w * uT + ph) + 0.5 * sin((0.5 - w.yzx) * uT + ph.zxy)) / 1.5;   // every ω in 0.1–0.4 rad/s (A2.7.1)
    p += e1.xyz;
    if (sc < 1.5) p += normalize(uNuc - p + 1e-5) * (uBreath - 0.5) * 0.03 * smoothstep(3.0, 0.5, length(p - uNuc));
    fade = smoothstep(e3.y, e3.y + 0.6, uT);
    if (uDep.x > 0.5 && sc < 1.5) {
      float si = floor(h1(id*0.37)*6.999); int ii = int(si);
      float top = uStrY[ii*2], bot = uStrY[ii*2+1], n = uStrN[ii];
      float fy = mix(bot, top, h1(id*1.91)); float j = floor(h1(id*2.73)*n), fu = h1(id*3.37);
      float a0 = 6.2831853*(j-0.5)/n, a1 = 6.2831853*(j+0.5)/n, r = rr(fy);
      vec3 tl = vec3(mix(vec2(sin(a0), cos(a0)), vec2(sin(a1), cos(a1)), fu) * r, 0.0).xzy; tl.y = fy;
      vec3 tg = (uStr[ii] * vec4(tl, 1.0)).xyz;
      float tp = uDep.y + (1.6 - tg.y) / 3.2 * uDep.z;
      if (length(p - tg) < 0.25) { p = mix(p, tg, smoothstep(0.0, 0.16, uT - tp)); fade *= 1.0 - smoothstep(uDep.w, uDep.w + 0.6, uT); if (uT > tp) self = max(self, 0.5); }
    }
    if (uCol > 1.5 && sc < 1.5) {
      float x = clamp((uT - uColT) / 0.45, 0.0, 1.0); if (uCol > 2.5) x = 1.0;
      float gy = uStrY[int(floor(h1(id*0.53)*5.999))*2 + 1] - 0.01;
      vec2 q = p.xz; float rq = length(q) * (1.0 - 0.85 * x), aq = atan(q.y, q.x) + 6.0 * x;
      p = vec3(cos(aq)*rq, mix(p.y, gy, smoothstep(0.0, 0.5, x)), sin(aq)*rq);
    }
  } else if (ty < 2.5) {
    float a = 6.2831853 * s.x;
    float y = s.y < 0.5 ? e2.x : e2.y, r = rr(y) * (0.92 + 0.08 * s.z);
    vec3 p0 = vec3(cos(a)*r, y, sin(a)*r), tn = vec3(-sin(a), 0.0, cos(a)) * e2.z;
    p = ballistic(p0, tn * 0.15 + normalize(p0 + 1e-5) * 0.04 * sw + vec3(0.0, 0.03*(s.z-0.5), 0.0), 2.0, 1.2, tau);
    fade = 1.0 - smoothstep(0.0, 1.4, tau); self = 0.75;
  } else if (ty < 3.5) {
    int j = int(floor(s.x * e1.x)); float dir = s.z < 0.5 ? 1.0 : -1.0;
    float u = fract(s.y + dir * 0.35 * min(uT, e2.x) + sw * 0.01);
    vec3 a = uThr[j*4], b = uThr[j*4+1], c = uThr[j*4+2], d = uThr[j*4+3];
    float g4 = u * 3.0; int sg = int(min(2.0, floor(g4))); float f = g4 - float(sg);
    p = sg == 0 ? cr(a, a, b, c, f) : sg == 1 ? cr(a, b, c, d, f) : cr(b, c, d, d, f);
    p += (vec3(h1(id*1.3), h1(id*2.1), h1(id*3.7)) - 0.5) * e1.y;
    float tr = max(0.0, uT - e2.x); p.y = max(e2.y, p.y - 0.5 * 9.8 * tr * tr);
    fade = 1.0 - smoothstep(0.0, 1.8, tr); self = 0.5;
  } else {
    vec3 v = normalize(s - 0.5 + 1e-4) * e2.x * (0.5 + 0.5*sw);
    p = ballistic(e1.xyz, v, e2.y, e2.z, tau); p.y = max(e2.w, p.y);
    fade = 1.0 - smoothstep(0.0, e3.x, tau); self = 0.55;
  }
  for (int i = 0; i < 8; i++) {
    vec4 sp = uSp[i]; float age = uT - sp.w; if (age < 0.0 || age > 4.0) continue;
    vec3 d = p - sp.xyz; float R = 0.35 * sc; float fl = exp(-dot(d, d)/(R*R)) * exp(-age/1.6);
    vec3 vv = uSv[i].xyz; float vl = length(vv);
    if (vl > 1e-4) p += (cross(vv/vl, normalize(uCamPos - sp.xyz)) * vl * 0.25 + vv * 0.1) * fl;
  }
  float ia = uT - uImp.w;
  if (ia >= 0.0 && ia < 6.0) { vec3 d = p - uImp.xyz; float L = length(d); p += d / max(L, 1e-4) * (1.2/2.5) * (1.0 - exp(-2.5*ia)) * (1.0 - smoothstep(1.2, 2.0, L)) * sc; }
  vec4 wp = modelMatrix * vec4(p, 1.0);
  wp.xyz = fxDisplace(wp.xyz);
  vec4 v = viewMatrix * wp;
  gl_Position = projectionMatrix * v;
  vec3 tl = wp.xyz - uLamp; float dl = length(tl);
  float c = dot(tl / max(dl, 1e-5), normalize(uCamPos - wp.xyz));
  float hg = 0.6156 / pow(1.3844 - 1.24 * c, 1.5) / 11.2;
  float r0 = e3.z * uWorldScale;
  float b = 18.0 * uLampI * hg / (1.0 + (dl/r0)*(dl/r0));   // uLampI: 0 while the title's world is still unlit
  b *= 0.6 + 0.4 * step(0.92, fract(sw * 91.7 + uLampAng * 7.0));
  b = max(b, self);
  float wh = 0.0;
  if (uSheet.z > 0.5 && abs(p.y - uSheet.x) < uSheet.y) { b = 3.0; wh = 1.0; }
  vE = 0.0;
  if (sc < 1.5) {
    float rn = max(length(p - uNuc), 0.12), ne = (0.12/rn)*(0.12/rn);
    float gl = 0.0; for (int i = 1; i < 7; i++) { float gy = (uStrY[i*2-1] + uStrY[i*2]) * 0.5; gl = max(gl, step(abs(p.y - gy), 0.01)); }
    float rx = max(length(p.xz), 0.12);
    vE = max(ne * 0.4, gl * 0.4 * smoothstep(0.03, 0.09, uGap) * (0.12/rx)*(0.12/rx)) * uLampI;
    b = max(b, vE * 2.0);
  }
  float coc = fxCoc(-v.z);
  float s0 = 1.0 + sw;
  // the boot's 3 % air (A2.1.1 DEPTH, ART-6): one mote in four takes it; the far ones are the 3 % heptagonal bokeh discs,
  // the near ones (sharp, coc → 0) catch the same light as points four times as bright, so the parallax out of nothing reads
  float a = min(0.30, 0.30 * b) * pow(s0 / (s0 + coc), 2.0) + uAmb * step(0.75, fract(sw * 37.13)) * mix(4.0, 1.0, clamp(coc / 3.0, 0.0, 1.0));
  float fv = exp(-pow(uFogDensity * length(v.xyz), 2.0));
  a *= fade * (1.0 - uImpact) * fv;
  vW = wh;
  vA = a; vCoc = coc;
  float px = (s0 + coc) * uPixelRatio;
  vPx = px;
  if (a < 0.004) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  gl_PointSize = px + 1.0;
}`;

export const DUST_FRAG = /* glsl */ `
${FX_HEPTAGON_GLSL}
uniform vec3 cSilver, cWhite, cEmberDeep; uniform vec2 uFxCaps;
varying float vA, vCoc, vPx, vW, vE;
void main(){
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  if (uFxCaps.y > 0.5 && vCoc >= 2.0) cov = clamp((0.9009689 - fxHeptagon((gl_PointCoord - 0.5) * 2.0)) * (vPx + 1.0) * 0.5, 0.0, 1.0);
  float a = cov * vA;
  if (a <= 0.003) discard;
  vec3 col = mix(mix(cSilver, cEmberDeep, clamp(vE * 2.5, 0.0, 0.4)), cWhite, vW);
  gl_FragColor = vec4(col, a);
}`;
