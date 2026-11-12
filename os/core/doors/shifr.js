/* sys.baby — СЦЕНА ДВЕРИ «ШИФР» · решение D-587. Дверь по умолчанию у всех.
 * Права и порядок — у хозяина сцен (doors.js): сцена знает только ЧИСЛО набранных знаков,
 * не ходит в сеть и не пишет на диск; каждая печать здесь — свежая случайность, не выведенная ни из чего.
 * Стережёт tools/shifr-door-check.mjs (и общие законы двери). */
(function () {
'use strict';
if (!window.sbScenes) return;
window.sbScenes.register('shifr', function (root, kit) {
/* ШИФР — the plain entrance, drawn in the system's own cipher language: the seal faces of sbSeals (D-216),
   sixteen bits on a 4 × 4 grid in a tint of their own — the same marks that lie under Собор and Порог.
   The whole screen is a quiet field of seals laid out in blocks of sixteen; above the word field stands one block —
   the 4×4 state of AES, each cell a large seal — inside a dial of 14 marks (AES-256 has 14 rounds). Every sign typed changes every seal
   of the state and sends a wave across the lattice: the avalanche effect, the property that makes a cipher a cipher.
   Wrong word: the state scrambles and goes cold. Right word: 14 rounds play out (rows shift, columns mix), the block
   comes apart like bolts withdrawing, and the lattice dissolves.
   The scene never sees the word: it learns only how many signs were typed; every seal drawn here is fresh randomness,
   not derived from anything (the real carrier's seals stay where the door already shows them). Canvas 2D: the lattice is drawn once per size; a frame redraws only the cells in motion
   and the block. While the lock turns the key, nothing is drawn at all. */
const { setTimeout, requestAnimationFrame } = kit;
root.innerHTML = '<canvas data-d="lat"></canvas><canvas data-d="blk"></canvas>';
const lat = root.querySelector('[data-d="lat"]'), blk = root.querySelector('[data-d="blk"]');
const lx = lat.getContext('2d', { alpha: false }), bx = blk.getContext('2d');
const wordEl = kit.word;
const RM = kit.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const mix = (a, b, t) => a + (b - a) * t;
const mixc = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a.toFixed(3) + ')';
// fresh randomness for every byte drawn: nothing on screen is derived from the word
const POOL = new Uint8Array(1024); let pi = POOL.length;
const rb = () => { if (pi >= POOL.length) { crypto.getRandomValues(POOL); pi = 0; } return POOL[pi++]; };
const rf = () => rb() / 256;

/* The look the founder chose (30.10.2026, «Круг · своя шкала у каждого колеса»), with the light and typing of the
   final demo (vvod-6): rim light, a shadow floor of 0.24 under the field, no wave on typing, and rings that turn at
   random, no more than three at once. The other looks of the demo were subtracted. */
const P = { name: 'Круг · своя шкала у каждого колеса', base: [9, 10], polar: true, mono: true, cmode: 'rings', a0: 0.2, frames: false, big: 0.6, rosettes: 0, emblem: 'limb', logo: 6, wheels: [[32, 0.95], [24, 0.76], [16, 0.57]], band: 0, rims: true, sk: 0.8, notch: true, ticks: 'all' };
const LOOK = { shade: 1, shadeFloor: 0.24, rimLight: 1, rimK: 1.32, rimK2: 1.5 };

const PEARL = [236, 232, 248], EMBER = [255, 150, 92], COLD = [138, 164, 206], GOLD = [255, 226, 170];

let vw = 1, vh = 1, dpr = 1, baseH = 0, lastW = 0;
let NEED = kit.need || null;
// lattice
let fs = 11, cw = 25, ch = 19, cols = 0, rows = 0, N = 0, PX = null, PY = null, BYTES = null, HUES = null, SZ = null, MONOC = null, CX = null, CY = null, VOID = null, LUM = null, TINT = null, MASK = null, GONE = null;
let HOLE = null, KW = null, LB = null; // D-806: печати под знаком; знак, уменьшенный под клавиатурой; тихое место у слова
let act = [], inAct = null, bg = null, RINGS = new Map(), RA = new Map(), RT = new Map();
// how the field answers a sign: no wave; rings that turn at random, at most three at once (founder, vvod-6)
const TM = { wave: 'none', spin: 'rand', max: 3 };
// the block
let S = 0, R = 0, BX = 0, BY = 0, boxTop = 0, tapeY = 0;
const ST = new Uint16Array(16), SH = new Uint16Array(16), SL = new Float32Array(16), FLIP = new Float64Array(16);
let tape = [], typed = 0, focusOn = false;
// state
let cold = 0, coldAt = -1, held = false, running = false, last = 0, ripples = [], sparkle = 0, breathe = 0;
let opening = null, shake = 0;
const rbits = () => (rb() << 8 | rb()) || 0x9669;
const rhue = () => (rb() * 360 / 256) | 0;
for (let k = 0; k < 16; k++) { ST[k] = rbits(); SH[k] = rhue(); }

function geom() {
  if (NEED && NEED.y > 0) { // D-603: «one height»: the block stands at the given height; the wheel above it, sized to the room
    const at = NEED.y - (NEED.off || 0);
    let s1 = Math.min(vw * 0.4, 208, (at - 34 - 18) / 1.52);
    if (s1 < 76) s1 = 0;
    S = s1; R = s1 * 0.76;
    const top1 = s1 ? at - 34 - 2 * R : at;
    BX = vw / 2; BY = top1 + R; tapeY = top1 + 2 * R + 17; boxTop = at;
    return;
  }
  /* 09.11: низ, названный от опорного знака входа (fix), — как назван: полосы браузера, укоротившие экран, знак не двигают */
  const nh = NEED && NEED.h > 0 ? NEED.h : 250, nb = NEED && NEED.bottom ? (NEED.fix ? NEED.bottom : Math.min(vh, NEED.bottom)) : vh;
  const room = nb - 18 - nh - 34 - 18;
  let s = Math.min(vw * 0.4, 208, room / 1.62);
  if (s < 76) s = 0;
  S = s; R = s * 0.76;
  const comp = (s ? 2 * R + 34 : 0) + nh;
  const top = Math.max(18, (nb - comp) * 0.44);
  BX = vw / 2; BY = top + R; tapeY = top + 2 * R + 17; boxTop = s ? top + 2 * R + 34 : top;
}

function layout() {
  const iw = innerWidth, ih = innerHeight;
  if (!((wordEl.focused || true) && iw === lastW && ih < baseH)) baseH = ih; // the keyboard does not move the door
  lastW = iw; vw = iw; vh = baseH;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const c of [lat, blk]) { c.width = Math.round(vw * dpr); c.height = Math.round(vh * dpr); c.style.width = vw + 'px'; c.style.height = vh + 'px'; }
  lx.setTransform(dpr, 0, 0, dpr, 0, 0); bx.setTransform(dpr, 0, 0, dpr, 0, 0);
  geom();
  kit.line(boxTop); kit.place(boxTop, 1);
  if (P.emblem === 'stars') starsLayout();
  if (true) { BUILD = true; if (BUILD_X) BUILD_X(); BUILD_X = ZSTEP.run((function* () { yield* gridG(); yield; paintBg(); yield; yield* paintLatticeG(); yield; drawBlock(performance.now() / 1000); if (true) { yield; yield* POL.layoutG(); } BUILD = false; kwRead(); if (!S) sayReady(); loop(); })()); return; } // D-603: in steps
  grid(); paintBg(); paintLattice(); drawBlock(performance.now() / 1000);
  if (true && true) POL.layout();
}

// ---------- DEMO «one height»: the floor below the field ----------
// Polished obsidian, as a real slab meets darkness: no drawn line and no edge — the floor emerges through a soft horizon
// band (≈60 px) where the lattice above melts into the slab's sheen; a faint warm ambient light lies on the stone near the
// horizon (the cipher's glow); the wheel is mirrored live (one small blit a frame) with a Fresnel falloff — brightest just
// under the horizon, fading toward the viewer — and broken up by the slab's roughness; the nearest seals are mirrored once
// per size; a perspective grid of seal cells fades out before it reaches the horizon (atmospheric falloff), its two seal
// fillings cross-fading slowly. Nothing travels. Drawn once per size; opacity only. Reduced motion: still.
// The light behind the mark, made real (founder: «не детское солнышко»): a warm source hidden behind the sign.
// · a backlight bloom around the sign's silhouette, brightest at its edges, falling off ~ 1 / (1 + (d/d0)²);
// · light escapes only through the real openings — the sign's hollow, and the actual gaps between the seals and between
//   their bits on the three wheels — found by marching rays from the (extended) source through a raster of those
//   occluders: so the shafts are irregular in width, spacing and length, and the seals cast soft shadows into the light;
// · the shafts are seen only through dust and haze (a static density field, no specks), faint, fading with distance;
//   the colour cools from warm near the source to neutral far away;
// · the sign gets only a thin rim where the light grazes its edges — no outline glow;
// · the light and the shadows turn WITH the wheels (founder: «свет и тень должны крутиться во время ввода вместе с
//   кругами»): each wheel's shadow in the light is a polar mask drawn once in the wheel's own frame — transmittance
//   through its seals, bit by bit, from five points across the source (the sign's width), so the penumbra widens with
//   distance from the wheel — and every frame the masks are laid over the base light rotated by exactly the wheel's
//   angle w.a about the same centre: the shafts turn at the wheel's speed and easing, and stop when it stops. A mask is
//   redrawn only when its wheel's bits change (a sign typed). The source is fixed; the haze in the air stays put (the
//   shafts sweep through it); the haze breathes over 37 s. Reduced motion: the wheels do not turn, the light is still.
const POL = (function () {
  const api = { on: false };
  const BAND = 120;                                                     // the soft horizon band, above the field line
  let wrap = null, obs = null, gA = null, gB = null, refl = null, rx = null, rough = null, H = 0, fh = 0, rH = 0, rX0 = 0, rW = 0;
  let bl = null, flSpot = null, bloomC = null, LA = [], geo = null, HAZE = null, latRef = null, latMask = null, latB = null;
  api.I = 1;
  function seeded(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function build() {
    wrap = document.createElement('div');
    wrap.className = 'pol pol-shifr' + (RM ? ' pol-still' : '');
    wrap.innerHTML = '<canvas class="pol-obs"></canvas><canvas class="pol-g pol-ga"></canvas><canvas class="pol-g pol-gb"></canvas><canvas class="pol-refl"></canvas>';
    root.appendChild(wrap);
    obs = wrap.querySelector('.pol-obs'); gA = wrap.querySelector('.pol-ga'); gB = wrap.querySelector('.pol-gb');
    refl = wrap.querySelector('.pol-refl'); rx = refl.getContext('2d');
    flSpot = document.createElement('i'); flSpot.className = 'pol-blref'; wrap.appendChild(flSpot);
    bl = document.createElement('div'); bl.className = 'pol-bl' + (RM ? ' pol-still' : '');
    bl.innerHTML = '<div class="bl-haze"><canvas class="bl-bloom"></canvas><canvas class="bl-l"></canvas><canvas class="bl-l"></canvas></div>';
    root.insertBefore(bl, blk);                                         // behind the wheel and the sign
    bloomC = bl.querySelector('.bl-bloom'); LA = [...bl.querySelectorAll('.bl-l')];
  }
  const NL = 240;                                                       // the light field's raster (per side)
  function noise2(seed, n, cells) { const it = noise2G(seed, n, cells); let r; do { r = it.next(); } while (!r.done); return r.value; }
  function* noise2G(seed, n, cells) {                                  // smooth value noise, n×n, for the haze (in steps: a few rows each)
    const r = seeded(seed), L = new Float32Array((cells + 1) * (cells + 1)); for (let i = 0; i < L.length; i++) L[i] = r();
    const out = new Float32Array(n * n), sm3 = (t) => t * t * (3 - 2 * t);
    for (let y = 0; y < n; y++) { if ((y & 7) === 7) yield; for (let x = 0; x < n; x++) { const fx = x / n * cells, fy = y / n * cells, x0 = fx | 0, y0 = fy | 0, tx = sm3(fx - x0), ty = sm3(fy - y0), q = (a, b) => L[b * (cells + 1) + a];
      out[y * n + x] = (q(x0, y0) * (1 - tx) + q(x0 + 1, y0) * tx) * (1 - ty) + (q(x0, y0 + 1) * (1 - tx) + q(x0 + 1, y0 + 1) * tx) * ty; } }
    return out;
  }
  function blLayout() { const it = blLayoutG(); let r; do { r = it.next(); } while (!r.done); }
  function* blLayoutG() {
    if (!S) { bl.style.display = 'none'; return; }
    bl.style.display = '';
    const Rb = R * 1.75, D2 = Rb * 2;
    Object.assign(bl.style, { left: (BX - Rb) + 'px', top: (BY - Rb) + 'px', width: D2 + 'px', height: D2 + 'px' });
    const side = (fs * 0.95 / 0.7) * (252 / 62), kk = NL / D2;
    geo = { Rb, D2, side, kk };
    // haze: two octaves of slow noise — what the light needs to be seen at all (no point-like specks)
    const h1 = yield* noise2G(77 + vw, NL, 7), h2 = yield* noise2G(91 + vh, NL, 19), r = seeded(5 + vw * 3);
    yield;
    HAZE = new Float32Array(NL * NL);
    for (let i = 0; i < HAZE.length; i++) HAZE[i] = 0.38 + 0.42 * h1[i] + 0.2 * h2[i];   // no dust specks (founder 04.11: «точки света … убрать»)
    yield;
    // the bloom: the sign's silhouette, blurred, its own body cut out — brightest right at its edges
    const g = size(bloomC, D2, D2, Math.min(2, dpr)), k = side / 252, x0 = Rb - side / 2, y0 = Rb - side / 2, U = P.logo === 6 ? signPath(x0, y0, side) : null, [w, o] = U ? [U, new Path2D()] : markPaths(x0, y0, k);
    const sil = document.createElement('canvas'); sil.width = sil.height = Math.round(D2); const sg = sil.getContext('2d');
    sg.fillStyle = '#fff'; sg.fill(w); sg.fill(o);
    for (const [bpx, a] of [[side * 0.12, 0.5], [side * 0.35, 0.32], [side * 0.8, 0.16]]) { g.save(); g.filter = 'blur(' + bpx.toFixed(1) + 'px)'; g.globalAlpha = a; g.drawImage(sil, 0, 0); g.restore(); yield; }
    g.globalCompositeOperation = 'source-in'; g.fillStyle = 'rgb(255,176,124)'; g.fillRect(0, 0, D2, D2);
    g.globalCompositeOperation = 'destination-out'; g.fill(w); g.fill(o); g.globalCompositeOperation = 'source-over';
    for (const c of LA) { c.width = c.height = NL; c.style.width = c.style.height = D2 + 'px'; }
    LA[1].style.opacity = '0'; LA[0].style.opacity = '0';
    const lg = (api.lg = (api.lg || 0) + 1); setTimeout(() => { if (lg === api.lg) buildLight(); }, 40);   // its own task, after the door is up
  }
  // ---- the light field, made of the wheels themselves (see the header) ----
  let base = null, masks = [], bkeys = [], akey = '', MN = 0, ready = false, gen = 0, rebuild = [];
  const NA = 2048, QS5 = [-1, -0.5, 0, 0.5, 1];
  const ringR = (w) => R * w.f, ringZ = (w) => Math.min((6.283 * ringR(w)) / w.n * 0.5, S * 0.1) * (P.sk || 1);   // as the wheel is drawn
  function profile(w) {                                                 // transmittance through the wheel's band, per angle
    const r = ringR(w), z = ringZ(w), sc = 2, ext = Math.ceil((r + z) * 2 * sc) + 6;
    const c = document.createElement('canvas'); c.width = c.height = ext; const g = c.getContext('2d', { willReadFrequently: true });   // read back: keep it on the CPU
    g.setTransform(sc, 0, 0, sc, ext / 2, ext / 2); g.fillStyle = '#000';
    for (let i = 0; i < w.n; i++) { if (i === w.gap) continue; const a = -Math.PI / 2 + (i / w.n) * 6.283;
      g.save(); g.translate(Math.cos(a) * r, Math.sin(a) * r); g.rotate(a + Math.PI / 2); seal(g, -z / 2, -z / 2, z, w.b[i]); g.restore(); }
    const d = g.getImageData(0, 0, ext, ext).data, T = new Float32Array(NA), cx = ext / 2, q0 = (r - z * 0.8) * sc, q1 = (r + z * 0.8) * sc, k = 1 / (0.9 * sc);
    for (let j = 0; j < NA; j++) {
      const th = (j + 0.5) / NA * 6.283, ux = Math.cos(th), uy = Math.sin(th); let od = 0;
      for (let q = q0; q < q1; q += 1) { const x = (cx + ux * q) | 0, y = (cx + uy * q) | 0, oc = d[(y * ext + x) * 4 + 3] / 255; if (oc > 0.02) od -= Math.log(1 - 0.9 * oc) * k; }
      T[j] = Math.exp(-od);
    }
    return T;
  }
  function buildMask(k, done) {                                               // the wheel's shadow in the light, in its own frame
    if (done) { const g0 = gen; setTimeout(() => { if (g0 === gen && !kit.dead()) buildMask2(k, done, profile(WH[k])); }, 0); return; }   // D-603: the profile in its own task
    buildMask2(k, null, profile(WH[k]));
  }
  function buildMask2(k, done, T) {
    const w = WH[k], r = ringR(w) * geo.kk, z = ringZ(w) * geo.kk, rs = geo.side / 2 * geo.kk * 0.9, c0 = MN / 2;
    const c = done && masks[k] ? document.createElement('canvas') : masks[k] || (masks[k] = document.createElement('canvas')); c.width = c.height = MN;   // D-603: a rebuild draws aside, the old mask shows meanwhile
    const g = c.getContext('2d'), img = g.createImageData(MN, MN), px = img.data, r0 = r - z * 0.8, r1 = r + z * 0.8;
    const at = (th) => { let u = th / 6.283 * NA - 0.5; u = ((u % NA) + NA) % NA; const j = u | 0, f = u - j; return T[j] * (1 - f) + T[(j + 1) % NA] * f; };
    let y = 0; const g0 = gen;   // the light was rebuilt meanwhile (a new size): this mask belongs to the old one and stops
    const slice = () => { if (done && (g0 !== gen || kit.dead())) return; const y1 = done ? Math.min(MN, y + 6) : MN; for (; y < y1; y++) for (let x = 0; x < MN; x++) {
      const dx = x + 0.5 - c0, dy = y + 0.5 - c0, rho = Math.hypot(dx, dy), p = (y * MN + x) * 4;
      px[p] = px[p + 1] = px[p + 2] = 255;
      if (rho <= r0) { px[p + 3] = 255; continue; }
      const th = Math.atan2(dy, dx), sp = rs * Math.max(0, rho - r) / (r * rho);   // five points across the source
      let v = 0; for (const q of QS5) v += at(th + q * sp); v /= 5;
      if (rho < r1) v = 1 + (v - 1) * (rho - r0) / (r1 - r0);
      px[p + 3] = Math.round(255 * v);
    }
    if (y < MN) { setTimeout(slice, 0); return; }   // (a slice of 6 rows per task)
    g.putImageData(img, 0, 0); masks[k] = c;
    bkeys[k] = w.b.join(','); if (done) done(); };
    if (done) setTimeout(slice, 0); else slice();
  }
  function buildLight() {                                               // the base light: falloff from the source × the dust
    MN = Math.ceil(NL * 1.4143) + 2;
    base = document.createElement('canvas'); base.width = base.height = NL;
    const g = base.getContext('2d'), img = g.createImageData(NL, NL), px = img.data, cxy = NL / 2, r0 = geo.side / 2 * geo.kk * 2.2;
    for (let y = 0; y < NL; y++) for (let x = 0; x < NL; x++) {
      const i = y * NL + x, d = Math.hypot(x + 0.5 - cxy, y + 0.5 - cxy), dd = Math.min(1, d / cxy), p = i * 4;
      const v = 1 / (1 + (d / r0) * (d / r0)) * HAZE[i];
      px[p] = 255 - 18 * dd; px[p + 1] = 170 + 52 * dd; px[p + 2] = 120 + 84 * dd;   // warm near the source → neutral far
      px[p + 3] = Math.min(255, v * 210);
    }
    g.putImageData(img, 0, 0);
    masks = []; bkeys = []; rebuild = []; ready = false; LA[0].style.transition = 'none'; LA[0].style.opacity = '0';
    const my = ++gen, step = (k) => { if (my !== gen) return; buildMask(k, () => { if (my !== gen) return; if (k + 1 < WH.length) setTimeout(() => step(k + 1), 16); else { ready = true; akey = ''; compose(); requestAnimationFrame(() => { LA[0].style.transition = RM ? 'none' : 'opacity .6s ease'; LA[0].style.opacity = '1'; sayReady(); }); } }); };
    setTimeout(() => step(0), 60);   // one wheel per task: the door stays responsive while its light is made
  }
  function compose() {                                                  // each wheel's mask at the wheel's own angle
    const g = LA[0].getContext('2d'), h = NL / 2;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'copy'; g.drawImage(base, 0, 0);
    g.globalCompositeOperation = 'destination-in';
    for (let k = 0; k < WH.length; k++) { g.setTransform(1, 0, 0, 1, h, h); g.rotate(WH[k].a); g.drawImage(masks[k], -MN / 2, -MN / 2); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over';
    akey = WH.map((w) => w.a).join(',');
  }
  // the sign as a silhouette against the light: dark plates, a fine warm rim, the hollow letting the light through
  api.mark = function (w, o, X, Y, t62) {
    const I = api.I, hx0 = X(192), hy0 = Y(192), hx1 = X(320), hy1 = Y(318), cx = (hx0 + hx1) / 2, cy = (hy0 + hy1) / 2, hr = Math.max(hx1 - hx0, hy1 - hy0);
    let g = bx.createRadialGradient(cx, cy, 0, cx, cy, hr * 0.75);                          // the light seen through the hollow
    g.addColorStop(0, 'rgba(255,214,176,' + (0.7 * I).toFixed(3) + ')'); g.addColorStop(0.5, 'rgba(255,180,128,' + (0.42 * I).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,160,110,0)');
    bx.fillStyle = g; bx.fillRect(hx0 - hr, hy0 - hr, hr * 3, hr * 3);
    bx.fillStyle = 'rgba(12,10,10,.94)'; bx.fill(w); bx.fill(o);                            // the plates, backlit: dark
    bx.lineWidth = 0.6; bx.strokeStyle = 'rgba(255,200,160,' + (0.26 * I).toFixed(3) + ')'; bx.stroke(w); bx.stroke(o);  // a thin rim where the light grazes
  };
  /* The sign («витраж»), founder 04.11: the plates are the clean mark's own geometry (stol-veer/zakryt.js — geo(0,0,100,25,20,8.68):
     bars 25, outer corners r 20, the hollow's two inner corners filleted r 8.68), so the entry mark lands on it exactly; the two halves
     are ONE fill and touch corner to corner at (75,25) and (25,75), with a one-device-pixel bridge there so no light shows between
     them; the seals are smaller (half a bar) with an even inset from every edge, and smaller still and drawn in from the rounded corners. */
  function signPath(x0, y0, side) {                                     // the clean mark's outline (zakryt geo), both halves, one path
    const q = side / 100, b = 25, Ro = 20, ri = 8.68;
    const half = (m) => { const P = (u, v) => (m > 0 ? [x0 + u * q, y0 + v * q] : [x0 + (100 - u) * q, y0 + (100 - v) * q]), p = new Path2D();
      const mv = (u, v) => { const a = P(u, v); p.moveTo(a[0], a[1]); }, ln = (u, v) => { const a = P(u, v); p.lineTo(a[0], a[1]); }, at = (u1, v1, u2, v2, r) => { const a = P(u1, v1), c = P(u2, v2); p.arcTo(a[0], a[1], c[0], c[1], r * q); };
      mv(Ro, 0); ln(100 - b, 0); ln(100 - b, b); ln(b + 2 * ri, b); at(b, b, b, b + 2 * ri, ri); ln(b, 100 - b); ln(0, 100 - b); ln(0, Ro); at(0, 0, Ro, 0, Ro); p.closePath(); return p; };
    const U = new Path2D(), Hw = half(1), Ho = half(-1); U.addPath(Hw); U.addPath(Ho); U.halves = [Hw, Ho]; return U;
  }
  /* D-702 (основатель 10.11.2026): верное слово зажигает знак в ЕГО контуре — те же пластины и те же печати, что в покое,
     только светлее (B: 0 покой … 1 зажжён). Прежняя ветка открытия рисовала по контуру иконки 512 и печатями 0,7 бруса —
     печати вырастали и на углах выходили за знак. Стережёт tools/sign-seals-inside-check.mjs. */
  api.sign = function (side, B) {
    B = B > 0 ? Math.min(1, B) : 0;
    const I = api.I, x0 = BX - side / 2, y0 = BY - side / 2, q = side / 100, b = 25, Ro = 20, ri = 8.68;
    const U = signPath(x0, y0, side);
    const hx0 = x0 + b * q, hy0 = y0 + b * q, hx1 = x0 + (100 - b) * q, cx = (hx0 + hx1) / 2, cy = cx - x0 + y0, hr = hx1 - hx0;
    let g = bx.createRadialGradient(cx, cy, 0, cx, cy, hr * 0.75);                          // the light seen through the hollow (as before)
    g.addColorStop(0, 'rgba(255,214,176,' + (0.7 * I).toFixed(3) + ')'); g.addColorStop(0.5, 'rgba(255,180,128,' + (0.42 * I).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,160,110,0)');
    bx.save(); bx.beginPath(); bx.rect(hx0, hy0, hr, hr); bx.clip(); bx.fillStyle = g; bx.fillRect(hx0, hy0, hr, hr); bx.restore();   // only in the hollow
    bx.fillStyle = 'rgba(12,10,10,.94)'; bx.fill(U);                                       // the plates, backlit: dark, one fill
    if (B > 0) { bx.fillStyle = 'hsla(36,10%,95%,' + (0.66 * B).toFixed(3) + ')'; bx.fill(U.halves[0]); bx.fillStyle = 'hsla(16,76%,58%,' + (0.72 * B).toFixed(3) + ')'; bx.fill(U.halves[1]); }   // lit by the right word, in the same outline
    bx.save(); bx.clip(U); bx.lineWidth = 0.6; bx.strokeStyle = 'rgba(255,200,160,' + (0.26 * I).toFixed(3) + ')'; bx.stroke(U); bx.restore();   // a thin rim where the light grazes — inside the outline only
    const jb = 1.1 / Math.max(1, dpr); bx.fillStyle = 'rgba(12,10,10,.94)';                // the junctions: nothing between the halves
    for (const [u, v] of [[100 - b, b], [b, 100 - b]]) bx.fillRect(x0 + u * q - jb / 2, y0 + v * q - jb / 2, jb, jb);
    const cells = [[0, 0, 1], [1, 0, 1], [2, 0, 1], [0, 1, 1], [0, 2, 1], [3, 1, 2], [3, 2, 2], [3, 3, 2], [1, 3, 2], [2, 3, 2]];
    for (const [i, j, c] of cells) {
      const key = j * 4 + i, corner = (i === 0 && j === 0) || (i === 3 && j === 3), z = (corner ? 10 : 12.5) * q;
      const ccx = corner ? (i ? 100 - 14.5 : 14.5) : i * 25 + 12.5, ccy = corner ? (j ? 100 - 14.5 : 14.5) : j * 25 + 12.5;
      bx.fillStyle = c === 1 ? 'hsla(' + mix(SH[key], 40, 0.5) + ',' + mix(30, 60, B).toFixed(0) + '%,' + mix(66, 84, B).toFixed(0) + '%,0.9)' : 'hsla(' + (12 + (SH[key] % 24)) + ',' + mix(60, 85, B).toFixed(0) + '%,' + mix(56, 70, B).toFixed(0) + '%,0.95)';
      seal(bx, x0 + ccx * q - z / 2, y0 + ccy * q - z / 2, z, ST[key] ^ MB[key]);
    }
  };
  function size(c, w, h, d) { c.width = Math.max(1, Math.round(w * d)); c.height = Math.max(1, Math.round(h * d)); c.style.width = w + 'px'; c.style.height = h + 'px'; const g = c.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); return g; }
  // depth rows z = 1, 1.42, … toward the horizon (y measured from the horizon), rays from the vanishing point on it
  function rows() { const Y0 = fh * 1.08, out = []; for (let k = 0; k < 40; k++) { const y = Y0 / (1 + k * 0.42); if (y < 3) break; out.push(y); } return out; }
  const haze = (y) => sm(0.06, 0.32, y / fh);                          // atmospheric falloff: nothing reaches the horizon
  function cellsInto(g, seed) {
    const r = seeded(seed), ys = rows(), cx = vw / 2, Y0 = fh * 1.08, cw0 = Math.max(40, vw / 10);
    g.translate(0, BAND);
    for (let k = 0; k + 1 < ys.length; k++) {
      const y1 = ys[k], y0 = ys[k + 1], ym = (y0 + y1) / 2, sc = ym / Y0, cwy = cw0 * sc, nx = Math.ceil((vw / 2) / Math.max(4, cwy)) + 1, hz = haze(ym);
      if (hz < 0.02) continue;
      for (let j = -nx; j < nx; j++) {
        if (r() > 0.2) continue;
        const xm = cx + (j + 0.5) * cwy, z = Math.min(16, Math.min(cwy, y1 - y0) * 0.34); if (z < 2.2) continue;
        const bits = ((r() * 65536) | 0) | 0x0660, hue = (r() * 360) | 0, a = (0.035 + 0.07 * Math.min(1, ym / fh)) * hz;
        g.fillStyle = 'hsla(' + hue + ',50%,68%,' + a.toFixed(3) + ')';
        const c = z / 4, x0 = xm - z / 2, yy0 = ym - z / 2;
        for (let b = 0; b < 16; b++) if ((bits >>> b) & 1) g.fillRect(x0 + (b & 3) * c, yy0 + (b >> 2) * c, c * 0.82, c * 0.82);
      }
    }
  }
  api.layout = function () { const it = api.layoutG(); let r; do { r = it.next(); } while (!r.done); };
  api.layoutG = function* () {                                         // D-603: in steps when the scene is built in steps
    if (!wrap) build();
    api.on = true;
    H = Math.round((NEED && NEED.y > 0 ? NEED.y : boxTop + 24) - 6);   // the horizon lies at the field line
    fh = Math.max(1, vh - H);
    const T = fh + BAND, top = H - BAND, d = Math.min(1.5, dpr), r = seeded(77 + vw + vh * 3);
    wrap.style.top = top + 'px'; wrap.style.height = T + 'px';
    const o = size(obs, vw, T, d);
    // the slab: it rises out of the dark through the band — no line, only density
    let gr = o.createLinearGradient(0, 0, 0, T), at = (y) => Math.max(0, Math.min(1, y / T));
    gr.addColorStop(0, 'rgba(3,4,7,0)'); gr.addColorStop(at(BAND * 0.25), 'rgba(3,4,7,.008)'); gr.addColorStop(at(BAND * 0.5), 'rgba(3,4,7,.05)'); gr.addColorStop(at(BAND * 0.75), 'rgba(3,4,7,.17)'); gr.addColorStop(at(BAND), 'rgba(3,4,7,.42)');   // a smooth start: no first-row step
    gr.addColorStop(at(BAND + fh * 0.1), 'rgba(3,4,7,.68)'); gr.addColorStop(at(BAND + fh * 0.45), 'rgba(2,3,6,.84)'); gr.addColorStop(1, 'rgba(2,2,4,.92)');
    o.fillStyle = gr; o.fillRect(0, 0, vw, T);
    // the sheen of the slab at grazing angles: the lattice above melts into it (cool, very faint, peaking at the horizon)
    gr = o.createLinearGradient(0, BAND * 0.2, 0, BAND + fh * 0.22);
    gr.addColorStop(0, 'rgba(150,160,190,0)'); gr.addColorStop(0.32, 'rgba(150,160,190,.045)'); gr.addColorStop(0.5, 'rgba(150,160,190,.03)'); gr.addColorStop(1, 'rgba(150,160,190,0)');
    o.fillStyle = gr; o.fillRect(0, 0, vw, T);
    // a faint ambient light on the stone near the horizon, in the cipher's warm glow, under the wheel
    o.save(); o.translate(BX, BAND + 6); o.scale(1, 0.16);
    gr = o.createRadialGradient(0, 0, 0, 0, 0, vw * 0.5);
    gr.addColorStop(0, 'rgba(255,170,120,.07)'); gr.addColorStop(0.35, 'rgba(255,160,110,.035)'); gr.addColorStop(0.7, 'rgba(255,150,100,.01)'); gr.addColorStop(1, 'rgba(255,150,100,0)');
    o.fillStyle = gr; o.fillRect(-vw * 0.5, -vw * 0.5, vw, vw); o.restore();
    yield;
    // the nearest seals of the lattice, mirrored in the slab: they fade in from the horizon and fade with depth (Fresnel)
    // live (one blit a frame): the field's rings turn and its seals change, and their reflection follows them
    const band = Math.min(H, 150);
    if (!latRef) { latRef = document.createElement('canvas'); latRef.className = 'pol-latref'; obs.after(latRef); }
    size(latRef, vw, band, d); latRef.style.top = BAND + 'px';
    latMask = document.createElement('canvas'); latMask.width = latRef.width; latMask.height = latRef.height;
    { const mg = latMask.getContext('2d'); mg.setTransform(d, 0, 0, d, 0, 0);
      gr = mg.createLinearGradient(0, 0, 0, band); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.08, 'rgba(0,0,0,1)'); gr.addColorStop(0.4, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mg.fillStyle = gr; mg.fillRect(0, 0, vw, band); }
    latB = { band, d };
    // the grid lines: faint, and gone before the horizon (atmospheric depth)
    const ys = rows(), cx = vw / 2, Y0 = fh * 1.08, cw0 = Math.max(40, vw / 10);
    o.save(); o.translate(0, BAND); o.lineWidth = 1;
    // (no horizontal grid lines: a line across the whole floor reads as a seam; the receding rays and the cells give the depth)
    const nr = Math.ceil((vw * 2.6) / cw0);
    gr = o.createLinearGradient(0, 0, 0, fh); gr.addColorStop(0, 'rgba(190,200,240,0)'); gr.addColorStop(0.1, 'rgba(190,200,240,0)'); gr.addColorStop(0.35, 'rgba(190,200,240,.03)'); gr.addColorStop(1, 'rgba(190,200,240,.055)');
    o.strokeStyle = gr;
    for (let j = -nr; j <= nr; j++) { const xb = cx + j * cw0 * (fh / Y0); o.beginPath(); o.moveTo(cx, 0); o.lineTo(xb, fh); o.stroke(); }
    o.restore();
    // two fillings of the cells: they cross-fade, so the grid shimmers slowly as seals change
    yield;
    cellsInto(size(gA, vw, T, d), 9001 + vw + vh);
    yield;
    cellsInto(size(gB, vw, T, d), 4242 + vw * 3 + vh);
    yield;
    // the live reflection of the wheel, starting at the horizon; the slab's roughness breaks it up (a static mask)
    rH = Math.min(fh, Math.max(60, (S ? 2 * R + 60 : 120)));
    rW = Math.min(vw, (S ? R * 2.7 : vw)); rX0 = Math.max(0, BX - rW / 2);
    size(refl, rW, rH, Math.min(2, dpr));
    refl.style.left = rX0 + 'px'; refl.style.top = BAND + 'px';
    yield* blLayoutG();
    yield;
    root.setAttribute('data-mark', BX.toFixed(3) + ',' + BY.toFixed(3) + ',' + ((fs * 0.95 / 0.7) * (252 / 62)).toFixed(4)); root.setAttribute('data-wheel', (S ? R * 1.06 : 0).toFixed(2));   // D-606: the entry's clean mark starts exactly here; 09.11: data-wheel — the dial's outer radius, so the shell can fit the sign above the keyboard
    const ym = 2 * H - BY - top, sr = R * 0.9;                           // the backlight seen in the slab, under the mirrored sign
    Object.assign(flSpot.style, { left: (BX - sr) + 'px', top: (ym - sr * 0.35) + 'px', width: (sr * 2) + 'px', height: (sr * 0.7) + 'px' });
    rough = document.createElement('canvas'); rough.width = refl.width; rough.height = refl.height;
    const rg = rough.getContext('2d'), k = refl.width / rW;
    rg.setTransform(k, 0, 0, k, 0, 0);
    for (let i = 0; i < 70; i++) {                                    // patches of duller polish: the reflection thins there
      const x = r() * rW, y = r() * rH, rr = 14 + r() * 46, a = 0.12 + r() * 0.3;
      const g2 = rg.createRadialGradient(x, y, 0, x, y, rr); g2.addColorStop(0, 'rgba(0,0,0,' + a.toFixed(3) + ')'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      rg.fillStyle = g2; rg.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      if ((i % 24) === 23) yield;
    }
    api.frame();
  };
  api.frame = function () {
    if (!api.on || !refl) return;
    // the light field: a wheel's bits changed → its mask is redrawn; any wheel turned → the masks are laid again
    if (bl && geo && base && ready) {
      let ch = false;
      for (let k = 0; k < WH.length; k++) { const bk = WH[k].b.join(','); if (bk !== bkeys[k] && rebuild[k] !== bk) { rebuild[k] = bk; buildMask(k, () => { rebuild[k] = null; akey = ''; }); } }   // D-603: in the background, sliced — never a whole mask inside a frame
      if (ch || WH.map((w) => w.a).join(',') !== akey) compose();
    }
    if (latRef && latB) {                                                // the field mirrored in the slab, as it is now
      const lg = latRef.getContext('2d'), ld = lat.width / vw, b = latB.band, d = latB.d;
      lg.setTransform(d, 0, 0, -d, 0, b * d); lg.globalCompositeOperation = 'copy';
      lg.drawImage(lat, 0, Math.max(0, (H - b) * ld), lat.width, b * ld, 0, 0, vw, b);
      lg.setTransform(1, 0, 0, 1, 0, 0); lg.globalCompositeOperation = 'destination-in'; lg.drawImage(latMask, 0, 0);
      lg.globalCompositeOperation = 'source-over';
    }
    const bd = blk.width / vw, sh = Math.min(H, rH);
    rx.setTransform(1, 0, 0, 1, 0, 0); rx.globalCompositeOperation = 'source-over'; rx.clearRect(0, 0, refl.width, refl.height);
    const k = refl.width / rW;
    rx.setTransform(k, 0, 0, -k, 0, 0);                                   // mirrored about the horizon
    rx.globalAlpha = 0.6;                                                 // calm: no flare
    rx.drawImage(blk, rX0 * bd, (H - sh) * bd, rW * bd, sh * bd, 0, -sh, rW, sh);
    rx.globalAlpha = 1;
    rx.setTransform(1, 0, 0, 1, 0, 0); rx.globalCompositeOperation = 'destination-out';
    if (rough) rx.drawImage(rough, 0, 0);
    rx.globalCompositeOperation = 'source-over';
  };
  return api;
})();

// ---------- DEMO «one height»: the scene is built in steps (≤ 6 ms each, yielding to input) ----------
// A tap on another door must never wait behind the build: the long loops (the lattice, the paths, the stars) run as
// generators, a few milliseconds per task (MessageChannel), stopping early when input is pending; while the scene is
// being built it draws no frames; a new door kills the scene and with it the build in flight.
let BUILD = false, BUILD_X = null, PREP = 0; // PREP: textures of the first look still being made (the scene is shown after them)
kit.__isBuilding = () => BUILD || PREP > 0; // D-603: the mount runner shows the scene once this is false
const ZSTEP = (function () {
  const ch = typeof MessageChannel === 'function' ? new MessageChannel() : null, q = [];
  if (ch) ch.port1.onmessage = () => { const f = q.shift(); if (f) f(); };
  const post = (f) => { if (ch) { q.push(f); ch.port2.postMessage(0); } else setTimeout(f, 0); };
  const pending = () => { try { return !!(navigator.scheduling && navigator.scheduling.isInputPending && navigator.scheduling.isInputPending()); } catch (e) { return false; } };
  function run(it, done, budget) {
    const B = budget || 6; let dead = false;
    const step = () => { if (dead || kit.dead()) return; const t0 = performance.now(); let r;
      try { do { r = it.next(); } while (!r.done && performance.now() - t0 < B && !pending()); } catch (e) { dead = true; BUILD = false; throw e; }
      if (r.done) { if (done) done(); } else post(step); };
    post(step); return () => { dead = true; };
  }
  return { run };
})();
function* gridG() {
  fs = vw < 520 ? P.base[0] : P.base[1]; cw = fs * (P.scatter ? 2.1 : P.depth ? 1.75 : P.word ? 1.42 : 1.6); ch = cw;
  const gx = P.blocks ? cw * 0.55 : 0, gy = P.blocks ? ch * 0.62 : 0, bw = 4 * cw + gx, bh = 4 * ch + gy;
  let PLX = null, PLY = null, PLR = null;
  if (P.polar) {
    // Лимб: the field lies in rings around the lock, like the wheels of a safe seen from above
    const xs = [], ys = [], far = Math.hypot(Math.max(BX, vw - BX), Math.max(BY, vh - BY)) + cw;
    PLR = [];
    /* D-806: кольца поля идут и внутри круга (от cw·2), под знаком они спрятаны (HOLE) — их показывает только знак,
       уменьшенный под клавиатурой (kwRead): вокруг маленького знака то же поле, а не пустота на месте большого */
    const r0 = S ? R * 1.18 : cw * 2, nin = S ? Math.floor((r0 - cw * 2) / (ch * 1.05)) : 0;
    for (let r = r0 - nin * ch * 1.05, ring = -nin; r < far; r += ch * 1.05, ring++) {
      const n = Math.floor((2 * Math.PI * r) / cw), off = rf() * 6.283;
      for (let j = 0; j < n; j++) { const a = off + (j / n) * 6.283, x = BX + Math.cos(a) * r - fs / 2, y = BY + Math.sin(a) * r - fs / 2; if (x > -fs && y > -fs && x < vw && y < vh) { xs.push(x); ys.push(y); PLR.push([ring, r / far, a, r]); } }
    }
    PLX = xs; PLY = ys; cols = xs.length; rows = 1; N = cols;
    PX = new Float32Array(cols); PY = new Float32Array([BY]);
  } else {
  const nbx = Math.ceil(vw / bw) + 1, nby = Math.ceil(vh / bh) + 1;
  const ox = (vw - nbx * bw + gx) / 2, oy = (vh - nby * bh + gy) / 2;
  cols = nbx * 4; rows = nby * 4; N = cols * rows;
  PX = new Float32Array(cols); PY = new Float32Array(rows);
  for (let c = 0; c < cols; c++) PX[c] = ox + Math.floor(c / 4) * bw + (c % 4) * cw;
  for (let r = 0; r < rows; r++) PY[r] = oy + Math.floor(r / 4) * bh + (r % 4) * ch;
  }
  BYTES = new Uint16Array(N); HUES = new Uint16Array(N); HOLE = new Uint8Array(N); SZ = new Float32Array(N); MONOC = new Uint8Array(N); CX = new Float32Array(N); CY = new Float32Array(N); VOID = new Uint8Array(N);
  const WM = P.word ? wordMask() : null; LUM = new Float32Array(N); TINT = new Uint8Array(N); MASK = new Float32Array(N); GONE = new Uint8Array(N);
  inAct = new Uint8Array(N); act = []; RINGS = new Map(); RA = new Map(); RT = new Map();
  // quiet around the word and the block: the lattice steps back where people read
  const bxw = Math.min(vw * 0.9, 360) / 2 + 26, x0 = vw / 2 - bxw, x1 = vw / 2 + bxw, y0 = boxTop - 12, y1 = boxTop + (NEED && NEED.h > 0 ? NEED.h : 250) + 14;
  KW = null; LB = { x0, x1, y0, y1 }; ALB = new Float32Array(N); LITF = litAt;
  let __k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if ((++__k & 31) === 0) yield;
    const i = r * cols + c;
    // Россыпь: no grid — each seal is pushed off its place, and some places stay empty
    CX[i] = PLX ? PLX[i] : PX[c] + (P.scatter ? (rf() - 0.5) * cw * 0.55 : 0); CY[i] = PLY ? PLY[i] : PY[r] + (P.scatter ? (rf() - 0.5) * ch * 0.55 : 0);
    if (P.scatter && rf() < (P.voidp || 0.3)) VOID[i] = 1;
    if (PLR && PLR[i][0] >= 0 && (TM.spin === 'rand' || PLR[i][3] < R * 3.4)) { const g = PLR[i][0]; if (!RINGS.has(g)) { RINGS.set(g, []); RA.set(g, 0); RT.set(g, 0); } RINGS.get(g).push([i, PLR[i][2], PLR[i][3]]); } // the rings near the lock may turn
    // where colour lives: everywhere (full), nowhere (mono), every fourth ring (rings), or growing outward (radial)
    { const pr = PLR ? PLR[i] : [r, 0.5, 0]; MONOC[i] = P.cmode === 'full' ? 0 : P.cmode === 'rings' ? ((pr[0] % 4 + 4) % 4 === 3 ? 0 : 1) : P.cmode === 'radial' ? (rf() < Math.pow(pr[1], 1.6) * 1.3 ? 0 : 1) : P.mono ? 1 : 0; }
    const x = CX[i] + fs / 2, y = CY[i] + fs / 2;
    // Имя пустотами: where the name lies, there is no seal — sys.baby is written by absence
    if (WM && WM(x, y)) VOID[i] = 1;
    BYTES[i] = rbits(); HUES[i] = rhue();
    const layer = P.depth ? rb() % 3 : 2; SZ[i] = P.depth ? [0.5, 0.75, 1.12][layer] : 1;
    const dxr = Math.max(x0 - x, 0, x - x1), dyr = Math.max(y0 - y, 0, y - y1), dr = Math.hypot(dxr, dyr);
    const db = S ? Math.max(0, Math.hypot(x - BX, y - BY) - R - 10) : 1e9;
    const d = Math.min(shadeDist(x, y, dr), db), inRing = S && Math.hypot(x - BX, y - BY) < R + 8;
    const edge = Math.min(x, vw - x, y, vh - y);
    MASK[i] = (inRing ? 0.05 : (P.word ? 0.3 : (LOOK.shadeFloor || 0.12)) + (1 - (P.word ? 0.3 : (LOOK.shadeFloor || 0.12))) * ease(d / 110)) * (P.word ? 0.8 + 0.2 * ease(edge / 140) : 0.55 + 0.45 * ease(edge / 140)) * (P.word ? 0.92 + 0.16 * rf() : 0.72 + 0.56 * rf()) * (P.depth ? [0.55, 0.8, 1.15][SZ[i] < 0.6 ? 0 : SZ[i] < 1 ? 1 : 2] : 1);
    if (PLR && S && PLR[i][3] < R * 1.18) { HOLE[i] = 1; MASK[i] = 0; ALB[i] = (P.word ? 0.92 + 0.16 * rf() : 0.72 + 0.56 * rf()); continue; } // D-806: под знаком — спрятано
    if (LITF) ALB[i] = MASK[i] / Math.max(1e-4, LITF(x, y));
  }
}
function* paintLatticeG() {
  lx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, vw, vh);
  yield;
  for (let i = 0; i < N; i++) {
    if ((i & 63) === 63) yield;
    const a = cellAlpha(i);
    if (a > 0.004) { lx.fillStyle = sealColor(HUES[i], LUM[i], a, GONE[i] ? 2 : TINT[i], MONOC ? !!MONOC[i] : P.mono); { const z = fs * SZ[i]; seal(lx, CX[i] + (fs - z) / 2, CY[i] + (fs - z) / 2, z, BYTES[i]); } }
  }
}
// ---------- the lattice: bytes in 16-byte blocks (4 × 4), like the state above the field ----------
function grid() {
  fs = vw < 520 ? P.base[0] : P.base[1]; cw = fs * (P.scatter ? 2.1 : P.depth ? 1.75 : P.word ? 1.42 : 1.6); ch = cw;
  const gx = P.blocks ? cw * 0.55 : 0, gy = P.blocks ? ch * 0.62 : 0, bw = 4 * cw + gx, bh = 4 * ch + gy;
  let PLX = null, PLY = null, PLR = null;
  if (P.polar) {
    // Лимб: the field lies in rings around the lock, like the wheels of a safe seen from above
    const xs = [], ys = [], far = Math.hypot(Math.max(BX, vw - BX), Math.max(BY, vh - BY)) + cw;
    PLR = [];
    /* D-806: кольца поля идут и внутри круга (от cw·2), под знаком они спрятаны (HOLE) — их показывает только знак,
       уменьшенный под клавиатурой (kwRead): вокруг маленького знака то же поле, а не пустота на месте большого */
    const r0 = S ? R * 1.18 : cw * 2, nin = S ? Math.floor((r0 - cw * 2) / (ch * 1.05)) : 0;
    for (let r = r0 - nin * ch * 1.05, ring = -nin; r < far; r += ch * 1.05, ring++) {
      const n = Math.floor((2 * Math.PI * r) / cw), off = rf() * 6.283;
      for (let j = 0; j < n; j++) { const a = off + (j / n) * 6.283, x = BX + Math.cos(a) * r - fs / 2, y = BY + Math.sin(a) * r - fs / 2; if (x > -fs && y > -fs && x < vw && y < vh) { xs.push(x); ys.push(y); PLR.push([ring, r / far, a, r]); } }
    }
    PLX = xs; PLY = ys; cols = xs.length; rows = 1; N = cols;
    PX = new Float32Array(cols); PY = new Float32Array([BY]);
  } else {
  const nbx = Math.ceil(vw / bw) + 1, nby = Math.ceil(vh / bh) + 1;
  const ox = (vw - nbx * bw + gx) / 2, oy = (vh - nby * bh + gy) / 2;
  cols = nbx * 4; rows = nby * 4; N = cols * rows;
  PX = new Float32Array(cols); PY = new Float32Array(rows);
  for (let c = 0; c < cols; c++) PX[c] = ox + Math.floor(c / 4) * bw + (c % 4) * cw;
  for (let r = 0; r < rows; r++) PY[r] = oy + Math.floor(r / 4) * bh + (r % 4) * ch;
  }
  BYTES = new Uint16Array(N); HUES = new Uint16Array(N); HOLE = new Uint8Array(N); SZ = new Float32Array(N); MONOC = new Uint8Array(N); CX = new Float32Array(N); CY = new Float32Array(N); VOID = new Uint8Array(N);
  const WM = P.word ? wordMask() : null; LUM = new Float32Array(N); TINT = new Uint8Array(N); MASK = new Float32Array(N); GONE = new Uint8Array(N);
  inAct = new Uint8Array(N); act = []; RINGS = new Map(); RA = new Map(); RT = new Map();
  // quiet around the word and the block: the lattice steps back where people read
  const bxw = Math.min(vw * 0.9, 360) / 2 + 26, x0 = vw / 2 - bxw, x1 = vw / 2 + bxw, y0 = boxTop - 12, y1 = boxTop + (NEED && NEED.h > 0 ? NEED.h : 250) + 14;
  KW = null; LB = { x0, x1, y0, y1 }; ALB = new Float32Array(N); LITF = litAt;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    // Россыпь: no grid — each seal is pushed off its place, and some places stay empty
    CX[i] = PLX ? PLX[i] : PX[c] + (P.scatter ? (rf() - 0.5) * cw * 0.55 : 0); CY[i] = PLY ? PLY[i] : PY[r] + (P.scatter ? (rf() - 0.5) * ch * 0.55 : 0);
    if (P.scatter && rf() < (P.voidp || 0.3)) VOID[i] = 1;
    if (PLR && PLR[i][0] >= 0 && (TM.spin === 'rand' || PLR[i][3] < R * 3.4)) { const g = PLR[i][0]; if (!RINGS.has(g)) { RINGS.set(g, []); RA.set(g, 0); RT.set(g, 0); } RINGS.get(g).push([i, PLR[i][2], PLR[i][3]]); } // the rings near the lock may turn
    // where colour lives: everywhere (full), nowhere (mono), every fourth ring (rings), or growing outward (radial)
    { const pr = PLR ? PLR[i] : [r, 0.5, 0]; MONOC[i] = P.cmode === 'full' ? 0 : P.cmode === 'rings' ? ((pr[0] % 4 + 4) % 4 === 3 ? 0 : 1) : P.cmode === 'radial' ? (rf() < Math.pow(pr[1], 1.6) * 1.3 ? 0 : 1) : P.mono ? 1 : 0; }
    const x = CX[i] + fs / 2, y = CY[i] + fs / 2;
    // Имя пустотами: where the name lies, there is no seal — sys.baby is written by absence
    if (WM && WM(x, y)) VOID[i] = 1;
    BYTES[i] = rbits(); HUES[i] = rhue();
    const layer = P.depth ? rb() % 3 : 2; SZ[i] = P.depth ? [0.5, 0.75, 1.12][layer] : 1;
    const dxr = Math.max(x0 - x, 0, x - x1), dyr = Math.max(y0 - y, 0, y - y1), dr = Math.hypot(dxr, dyr);
    const db = S ? Math.max(0, Math.hypot(x - BX, y - BY) - R - 10) : 1e9;
    const d = Math.min(shadeDist(x, y, dr), db), inRing = S && Math.hypot(x - BX, y - BY) < R + 8;
    const edge = Math.min(x, vw - x, y, vh - y);
    MASK[i] = (inRing ? 0.05 : (P.word ? 0.3 : (LOOK.shadeFloor || 0.12)) + (1 - (P.word ? 0.3 : (LOOK.shadeFloor || 0.12))) * ease(d / 110)) * (P.word ? 0.8 + 0.2 * ease(edge / 140) : 0.55 + 0.45 * ease(edge / 140)) * (P.word ? 0.92 + 0.16 * rf() : 0.72 + 0.56 * rf()) * (P.depth ? [0.55, 0.8, 1.15][SZ[i] < 0.6 ? 0 : SZ[i] < 1 ? 1 : 2] : 1);
    if (PLR && S && PLR[i][3] < R * 1.18) { HOLE[i] = 1; MASK[i] = 0; ALB[i] = (P.word ? 0.92 + 0.16 * rf() : 0.72 + 0.56 * rf()); continue; } // D-806: под знаком — спрятано
    if (LITF) ALB[i] = MASK[i] / Math.max(1e-4, LITF(x, y));
  }
}

// the name, once, written by absence: where sys.baby lies there is no seal — in a programmer's typeface,
// small, in the free band below the door (above it, if the screen leaves no room below)
function wordMask() {
  const nh = NEED && NEED.h > 0 ? NEED.h : 250, below = vh - (boxTop + nh) - 56, above = (S ? BY - R : boxTop) - 20;
  const px = vw < 520 ? 52 : 74, need = px * 1.15, y = below >= need ? boxTop + nh + 18 + below / 2 : above >= need ? 10 + above / 2 : -1;
  if (y < 0) return null;
  const c = document.createElement('canvas'), W = Math.ceil(vw), H = Math.ceil(vh); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.font = '800 ' + px + 'px "JetBrains Mono","SF Mono","Cascadia Mono",Menlo,Consolas,"DejaVu Sans Mono","Liberation Mono",monospace';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('sys.baby', vw / 2, y);
  const d = g.getImageData(0, 0, W, H).data;
  return (x, yy) => { const xi = x | 0, yi = yy | 0; return xi >= 0 && yi >= 0 && xi < W && yi < H && d[(yi * W + xi) * 4 + 3] > 90; };
}
function paintBg() {
  bg = document.createElement('canvas'); bg.width = lat.width; bg.height = lat.height;
  const g = bg.getContext('2d', { alpha: false }); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const lin = g.createLinearGradient(0, 0, 0, vh); lin.addColorStop(0, '#0b0c12'); lin.addColorStop(1, '#040507');
  g.fillStyle = lin; g.fillRect(0, 0, vw, vh);
  if (S) {
    const rad = g.createRadialGradient(BX, BY, R * 0.2, BX, BY, R * 2.6);
    rad.addColorStop(0, 'rgba(255,150,92,0.075)'); rad.addColorStop(1, 'rgba(255,150,92,0)');
    g.fillStyle = rad; g.fillRect(0, 0, vw, vh);
  }
  if (S) for (let q = 0; q < P.rosettes; q++) guilloche(g, q);
  // grain, fixed: the night has texture, but it does not crawl
  const t = document.createElement('canvas'); t.width = t.height = 96; const tg = t.getContext('2d'), im = tg.createImageData(96, 96);
  for (let i = 0; i < im.data.length; i += 4) { const v = rb(); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 7; }
  tg.putImageData(im, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = g.createPattern(t, 'repeat'); g.fillRect(0, 0, bg.width, bg.height);
}

// THE SHADOW the form sits in (demo: ?s=1..5). Not a box any more: 1 cast by the dial, 2 a pool, 3 none,
// 4 a beam from the lock down through the form, 5 the dial's disc laid on the floor under the form.
const SHADE = LOOK.shade; let LITF = null, ALB = null; // D-603: light by place, albedo by seal
/* Свет поля по месту: тень круга и тихое место у слова. D-806 (основатель 11.11.2026, планшет лёжа, видео: «круг
   уменьшается и фон теряется»): пока клавиатура держит знак уменьшенным (shell.js kbSign — transform холста знака),
   тень берётся от уменьшенного круга (KW), а не от прежнего большого — поле вокруг него то же, что без клавиатуры. */
function litAt(x, y) {
  const wx = KW ? KW.x : BX, wy = KW ? KW.y : BY, wr = KW ? KW.r : R;
  const dr = Math.hypot(Math.max(LB.x0 - x, 0, x - LB.x1), Math.max(LB.y0 - y, 0, y - LB.y1)), db = S ? Math.max(0, Math.hypot(x - wx, y - wy) - wr - 10) : 1e9;
  const d = Math.min(shadeDist(x, y, dr, wx, wy, wr), db), inRing = S && Math.hypot(x - wx, y - wy) < wr + 8, edge = Math.min(x, vw - x, y, vh - y), fl = P.word ? 0.3 : (LOOK.shadeFloor || 0.12);
  return (inRing ? 0.05 : fl + (1 - fl) * ease(d / 110)) * (P.word ? 0.8 + 0.2 * ease(edge / 140) : 0.55 + 0.45 * ease(edge / 140));
}
/* Знак уменьшен клавиатурой? Оболочка ставит холсту знака transform «translate(x, y) scale(k)» от его начала (0 0):
   центр круга — (x + k·BX, y + k·BY), радиус — k·R. Поле не перестраивается: печати, чей свет изменился, и печати
   под прежним кругом перерисовываются по одной, по шагам (ZSTEP, ≤ 6 мс) — без пустого кадра и без рывка. */
let KW_X = null;
function kwRead() {
  if (!S || !MASK || BUILD) return;
  const m = /translate\(\s*(-?[\d.]+)px\s*,\s*(-?[\d.]+)px\s*\)\s*scale\(\s*([\d.]+)\s*\)/.exec(blk.style.transform || '');
  const kw = m && +m[3] > 0 ? { x: +m[1] + +m[3] * BX, y: +m[2] + +m[3] * BY, r: +m[3] * R } : null;
  if (!kw && !KW) return;
  if (kw && KW && Math.abs(kw.x - KW.x) < 0.5 && Math.abs(kw.y - KW.y) < 0.5 && Math.abs(kw.r - KW.r) < 0.5) return;
  KW = kw;
  if (KW_X) KW_X();
  KW_X = ZSTEP.run((function* () {
    for (let i = 0; i < N; i++) {
      if ((i & 127) === 127) yield;
      const nm = HOLE[i] && !KW ? 0 : litAt(CX[i] + fs / 2, CY[i] + fs / 2) * ALB[i];
      if (Math.abs(nm - MASK[i]) > 0.002) { MASK[i] = nm; if (!inAct[i]) redrawCell(i); }
    }
    KW_X = null;
  })());
}
const KW_MO = new MutationObserver(() => kwRead()); KW_MO.observe(blk, { attributes: true, attributeFilter: ['style'] });
function shadeDist(x, y, dr, wx = BX, wy = BY, wr = R) {
  const nh = NEED && NEED.h > 0 ? NEED.h : 250, bw = (NEED && NEED.w) || Math.min(vw * 0.86, 340), cyB = boxTop + nh / 2, bot = boxTop + nh;
  if (SHADE === 1) { const tt = clamp((y - wy) / Math.max(1, bot + 30 - wy), 0, 1), rad = wr * (0.75 + 0.45 * tt) + (bw / 2 - wr * 0.75) * tt * 0.6, cy = clamp(y, wy, bot + 30); return Math.max(0, Math.hypot(x - wx, y - cy) - rad) * 0.9; }
  if (SHADE === 2) { const top = S ? BY - R : boxTop, cy = (top + bot) / 2, rx = Math.max(R, bw / 2) * 1.35, ry = ((bot - top) / 2) * 1.12, q = Math.hypot((x - BX) / rx, (y - cy) / ry); return Math.max(0, q - 0.78) * 260; }
  if (SHADE === 3) return 1e9;
  if (SHADE === 4) { const hw = Math.max(R * 0.92, bw / 2 + 10), top = S ? BY - R : boxTop; return y < top - 30 || y > bot + 70 ? 1e9 : Math.max(0, Math.abs(x - BX) - hw) * 1.1; }
  if (SHADE === 5) return Math.max(0, Math.hypot(x - BX, (y - cyB) * 1.15) - R * 1.02);
  return dr;
}
// GUILLOCHE — the pattern of banknotes and passports, the oldest visual promise that something is protected.
// Its parameters come from fresh randomness, so the rosette behind the state is new on every visit.
function guilloche(g, q) {
  const n = 7 + (rb() % 6) + q * 5, m = 3 + (rb() % 5), ph = rf() * 6.283, lines = q ? 40 : 26, r0 = q ? S * 0.74 : S * 0.62, r1 = q ? R * 1.0 : R * 0.97;
  g.lineWidth = 0.6;
  for (let j = 0; j < lines; j++) {
    const f = j / lines, a1 = (r1 - r0) * 0.32, a2 = (r1 - r0) * 0.16, off = f * 6.283 / n;
    g.strokeStyle = 'rgba(' + (j % 3 ? '236,232,248' : '255,150,92') + ',' + (j % 3 ? 0.05 : 0.07) + ')';
    g.beginPath();
    for (let k = 0; k <= 720; k++) {
      const th = (k / 720) * 6.283, rad = (r0 + r1) / 2 + a1 * Math.sin(n * th + off + ph) + a2 * Math.sin(m * th - off * 2);
      const x = BX + Math.cos(th) * rad, y = BY + Math.sin(th) * rad;
      k ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
}
// a seal face: the 16 bits on a 4 × 4 grid, each set bit a small square — exactly as sbSeals paints it
function seal(g, x, y, side, bits) {
  const step = side / 4, q = Math.max(1, step * 0.82);
  for (let k = 0; k < 16; k++) if ((bits >>> k) & 1) g.fillRect(x + (k & 3) * step, y + (k >> 2) * step, q, q);
}
// the tint of a seal: its own hue at rest (hsla(h, 60%, 62%) like sbSeals), warmer and lighter when a wave passes,
// steel when the word was wrong, gold while the door opens
function sealColor(h, l, a, tint, mono) {
  if (mono === undefined) mono = P.mono;
  const c = cold, rv = mono ? Math.min(1, l * 1.6) : 1, sat = mix(mix(24, 60, rv), 26, c), hue = mix(mono ? mix(28, h, rv) : h, 214, c);
  if (tint === 2) return 'hsla(' + mix(hue, 40, Math.min(1, l * 1.3)).toFixed(0) + ',' + mix(sat, 92, Math.min(1, l)).toFixed(0) + '%,' + mix(62, 84, Math.min(1, l)).toFixed(0) + '%,' + a.toFixed(3) + ')';
  if (tint === 1) return 'hsla(214,' + mix(sat, 34, Math.min(1, l)).toFixed(0) + '%,' + mix(62, 76, Math.min(1, l)).toFixed(0) + '%,' + a.toFixed(3) + ')';
  return 'hsla(' + hue.toFixed(0) + ',' + sat.toFixed(0) + '%,' + mix(mono ? 74 : 62, 80, Math.min(1, l)).toFixed(0) + '%,' + a.toFixed(3) + ')';
}
function cellAlpha(i) {
  const l = LUM[i], m = MASK[i];
  /* ОТКАТ: не откат на чужое значение — «||» здесь логическое «или»: клетка пуста, если она пустота знака или дыра под клавиатурой. */
  if (VOID[i] || (HOLE[i] && !KW)) return 0;
  if (GONE[i]) return l > 0.01 ? Math.min(0.95, l * 0.9) : 0;
  return Math.min(0.95, P.a0 * m + l * (0.12 + 0.75 * m));
}
function paintLattice() {
  lx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, vw, vh);
  for (let i = 0; i < N; i++) {
    const a = cellAlpha(i);
    if (a > 0.004) { lx.fillStyle = sealColor(HUES[i], LUM[i], a, GONE[i] ? 2 : TINT[i], MONOC ? !!MONOC[i] : P.mono); { const z = fs * SZ[i]; seal(lx, CX[i] + (fs - z) / 2, CY[i] + (fs - z) / 2, z, BYTES[i]); } }
  }
}
function redrawCell(i) {
  const e = fs * 0.1 + 1, x = CX[i] - e, y = CY[i] - e, w = fs + 2 * e, h = fs + 2 * e;
  lx.drawImage(bg, x * dpr, y * dpr, w * dpr, h * dpr, x, y, w, h);
  const a = cellAlpha(i);
  if (a > 0.004) { lx.fillStyle = sealColor(HUES[i], LUM[i], a, GONE[i] ? 2 : TINT[i], MONOC ? !!MONOC[i] : P.mono); { const z = fs * SZ[i]; seal(lx, CX[i] + (fs - z) / 2, CY[i] + (fs - z) / 2, z, BYTES[i]); } }
}
function touch(i, l, tint, flip) {
  if (VOID[i]) return;
  if (flip) { BYTES[i] = rbits(); HUES[i] = rhue(); }
  if (l > LUM[i]) LUM[i] = l;
  TINT[i] = tint;
  if (!inAct[i]) { inAct[i] = 1; act.push(i); }
}

// ---------- the block: 4 × 4 state inside a dial of 14 rounds ----------
let ticksLit = 0, rowShift = [0, 0, 0, 0], colGlow = new Float32Array(4), apart = 0, dialK = 1, dialA = 1, blockA = 1;
function cellXY(k) {
  const g = S * 0.06, c = (S - 3 * g) / 4, r = k >> 2, q = k & 3;
  let qx = q + rowShift[r]; if (qx > 3.5) qx -= 4;
  const x = BX - S / 2 + qx * (c + g), y = BY - S / 2 + r * (c + g);
  return [x, y, c];
}
function drawBlock(t) {
  bx.clearRect(0, 0, vw, vh);
  if (!S) { drawTape(); return; }
  if (P.emblem) { bx.save(); bx.translate(shake ? Math.sin(t * 52) * 5 * shake : 0, 0); EMB[P.emblem](t); bx.restore(); bx.globalAlpha = 1; drawTape(); return; }
  const sh = shake ? Math.sin(t * 52) * 5 * shake : 0;
  const ring = mixc(PEARL, COLD, cold), hot = mixc(EMBER, COLD, cold);
  bx.save(); bx.translate(sh, 0);
  // the dial
  const RR = R * dialK;
  bx.globalAlpha = dialA;
  bx.lineWidth = 1; bx.strokeStyle = rgba(ring, focusOn ? 0.26 : 0.17);
  bx.beginPath(); bx.arc(BX, BY, RR, 0, Math.PI * 2); bx.stroke();
  bx.strokeStyle = rgba(ring, 0.07); bx.beginPath(); bx.arc(BX, BY, RR * 1.045, 0, Math.PI * 2); bx.stroke();
  for (let m = 0; m < 56; m++) {
    const a = -Math.PI / 2 + (m / 56) * Math.PI * 2, major = m % 4 === 0, k = m / 4;
    const lit = major && k < ticksLit, len = major ? 8 : 3.5;
    bx.strokeStyle = lit ? rgba(hot, 0.95) : rgba(ring, major ? 0.36 : 0.13);
    bx.lineWidth = major ? 1.4 : 1;
    bx.beginPath(); bx.moveTo(BX + Math.cos(a) * (RR - 2), BY + Math.sin(a) * (RR - 2)); bx.lineTo(BX + Math.cos(a) * (RR - 2 - len), BY + Math.sin(a) * (RR - 2 - len)); bx.stroke();
  }
  bx.globalAlpha = 1;
  // the state: sixteen large seals
  for (let k = 0; k < 16; k++) {
    let [x, y, c] = cellXY(k);
    const l = SL[k], cg = colGlow[k & 3];
    if (apart) {
      const dx = x + c / 2 - BX, dy = y + c / 2 - BY, d = Math.hypot(dx, dy) || 1, far = ease(apart) * Math.max(vw, vh) * 0.7;
      x += (dx / d) * far; y += (dy / d) * far;
    }
    const a = blockA * (apart ? 1 - ease(apart * 1.25) : 1);
    if (a <= 0.01) continue;
    bx.globalAlpha = a;
    if (P.frames) {
      bx.fillStyle = rgba(mixc([255, 255, 255], hot, Math.min(1, l + cg)), 0.022 + 0.13 * Math.min(1, l + cg * 0.6));
      rr(x, y, c, c, c * 0.14); bx.fill();
      bx.strokeStyle = rgba(mixc(ring, hot, Math.min(1, l + cg)), 0.17 + 0.5 * Math.min(1, l + cg));
      bx.lineWidth = 1; rr(x + 0.5, y + 0.5, c - 1, c - 1, c * 0.14); bx.stroke();
    } else if (l + cg > 0.05) {
      const gl = bx.createRadialGradient(x + c / 2, y + c / 2, 0, x + c / 2, y + c / 2, c * 0.8);
      gl.addColorStop(0, rgba(hot, 0.22 * Math.min(1, l + cg))); gl.addColorStop(1, rgba(hot, 0));
      bx.fillStyle = gl; bx.fillRect(x - c * 0.3, y - c * 0.3, c * 1.6, c * 1.6);
    }
    bx.fillStyle = sealColor(SH[k], Math.min(1, l + cg * 0.5), 0.62 + 0.38 * Math.min(1, l), opening ? 2 : 0);
    seal(bx, x + c * (1 - P.big) / 2, y + c * (1 - P.big) / 2, c * P.big, ST[k]);
  }
  bx.globalAlpha = 1; bx.restore();
  drawTape();
}
function rr(x, y, w, h, r) { bx.beginPath(); bx.moveTo(x + r, y); bx.arcTo(x + w, y, x + w, y + h, r); bx.arcTo(x + w, y + h, x, y + h, r); bx.arcTo(x, y + h, x, y, r); bx.arcTo(x, y, x + w, y, r); bx.closePath(); }
// what was typed, shown only as what it becomes: one fresh byte of ciphertext per sign
function drawTape() {
  return; // the signs now appear only inside the word field, drawn by the door
  if (!tape.length || !S) return;
  const f = Math.max(9, Math.round(S * 0.055)), gap = f * 0.7, fit = Math.max(4, Math.floor(Math.min(vw * 0.86, 360) / (f + gap)));
  const show = tape.slice(-fit), w = show.length * (f + gap) - gap; let x = BX - w / 2;
  for (const b of show) { bx.fillStyle = sealColor(b.h, 0.6, 0.8 * blockA, 0); seal(bx, x, tapeY - f / 2, f, b.v); x += f + gap; }
}

// ---------- five emblems: each says something true about the cipher ----------
const at = (g, x, y, z, bits, col) => { g.fillStyle = col; seal(g, x - z / 2, y - z / 2, z, bits); };
// КЛЮЧ: the 256 bits of an AES-256 key engraved around the state like the edge of a coin
const KEY = new Uint8Array(256), KL = new Float32Array(256), KF = new Float64Array(256); for (let i = 0; i < 256; i++) KEY[i] = rb() & 1;
let keyRot = 0, keyFill = 0;
// СОЗВЕЗДИЕ: the sixteen bytes of the state as stars; the lines are MixColumns (each column mixes its four bytes)
let rimBoost = 0, rimFlare = 0; // the rim light's answer to typing and to the right word
const CPX = new Float32Array(16), CPY = new Float32Array(16);
function starsLayout() {
  for (let k = 0, tries = 0; k < 16; tries++) {
    const a = rf() * 6.283, r = Math.sqrt(rf()) * R * 0.8, x = Math.cos(a) * r, y = Math.sin(a) * r;
    let ok = tries > 3000; for (let j = 0; j < k && !ok; j++) if (Math.hypot(CPX[j] - x, CPY[j] - y) < S * 0.2) break; else if (j === k - 1) ok = true;
    if (ok || k === 0) { CPX[k] = x; CPY[k] = y; k++; }
  }
}
// ЛИМБ: three wheels of a combination lock made of seals; each sign turns one wheel a notch; the right word lines the gates up
const WH = (P.wheels ? P.wheels.map(([n, f]) => ({ n, f })) : [{ n: 30, f: 0.95 }, { n: 22, f: 0.74 }, { n: 14, f: 0.53 }]).map((w) => ({ n: w.n, f: w.f, a: 0, ta: 0, gap: rb() % w.n, b: Array.from({ length: w.n }, rbits), h: Array.from({ length: w.n }, rhue), l: new Float32Array(w.n) }));
let gate = 0;
// ПЕЧАТЬ ИЗ ПЕЧАТЕЙ: one great seal whose sixteen bits are themselves seals — the cipher is made of ciphers
let BIG = rbits(), zoomK = 5;
// СФЕРА МИРА: the world as a globe of seals; a sign sends a band of light from pole to pole
const SPN = 190, SX = new Float32Array(SPN), SY = new Float32Array(SPN), SZ3 = new Float32Array(SPN), SB = new Uint16Array(SPN), SHU = new Uint16Array(SPN), SPL = new Float32Array(SPN), SORD = new Uint16Array(SPN);
for (let i = 0; i < SPN; i++) { const y = 1 - (2 * (i + 0.5)) / SPN, r = Math.sqrt(1 - y * y), ph = i * 2.39996; SX[i] = Math.cos(ph) * r; SY[i] = y; SZ3[i] = Math.sin(ph) * r; SB[i] = rbits(); SHU[i] = rhue(); SORD[i] = i; }
let yaw = 0, spin = 0, bands = [];
const EMB = {
  key(t) {
    const hot = mixc(EMBER, COLD, cold), RR = R * (1 + ease(apart) * 1.2), A = 1 - ease(apart);
    bx.globalAlpha = A;
    bx.strokeStyle = rgba(mixc(PEARL, COLD, cold), focusOn ? 0.14 : 0.08); bx.lineWidth = 1;
    bx.beginPath(); bx.arc(BX, BY, RR - 13, 0, 6.283); bx.stroke();
    for (let i = 0; i < 256; i++) {
      const a = -Math.PI / 2 + (i / 256) * 6.283 + keyRot, c = Math.cos(a), sn = Math.sin(a), l = KL[i];
      /* ОТКАТ: здесь не подмена значения — условие «черта ключа есть или ещё заполняется», только да/нет. */
      if (KEY[i] || i < keyFill) {
        bx.strokeStyle = sealColor((i * 360) / 256, l, 0.42 + 0.5 * l, opening ? 2 : 0); bx.lineWidth = 1.6;
        bx.beginPath(); bx.moveTo(BX + c * (RR - 9), BY + sn * (RR - 9)); bx.lineTo(BX + c * (RR + 1), BY + sn * (RR + 1)); bx.stroke();
      } else { bx.fillStyle = rgba(PEARL, 0.16); bx.fillRect(BX + c * (RR - 4) - 0.7, BY + sn * (RR - 4) - 0.7, 1.4, 1.4); }
    }
    bx.globalAlpha = 1; stateGrid(hot);
  },
  stars(t) {
    const hot = mixc(EMBER, COLD, cold), k2 = 1 + ease(apart) * 3, A = 1 - ease(apart);
    bx.globalAlpha = A; bx.lineWidth = 1;
    for (let q = 0; q < 4; q++) {
      const g = colGlow[q];
      bx.strokeStyle = rgba(mixc(PEARL, hot, Math.min(1, g)), 0.1 + 0.5 * g);
      bx.beginPath();
      for (let r = 0; r < 4; r++) { const k = r * 4 + ((q + Math.round(rowShift[r])) & 3), x = BX + CPX[k] * k2, y = BY + CPY[k] * k2; r ? bx.lineTo(x, y) : bx.moveTo(x, y); }
      bx.stroke();
    }
    for (let k = 0; k < 16; k++) {
      const x = BX + CPX[k] * k2, y = BY + CPY[k] * k2, l = SL[k], z = S * (0.13 + 0.05 * l);
      if (l > 0.05) { const gl = bx.createRadialGradient(x, y, 0, x, y, z * 1.6); gl.addColorStop(0, rgba(hot, 0.3 * l)); gl.addColorStop(1, rgba(hot, 0)); bx.fillStyle = gl; bx.fillRect(x - z * 1.6, y - z * 1.6, z * 3.2, z * 3.2); }
      at(bx, x, y, z, ST[k], sealColor(SH[k], l, 0.7 + 0.3 * l, opening ? 2 : 0));
    }
    bx.globalAlpha = 1;
  },
  limb(t) {
    const hot = mixc(EMBER, COLD, cold), A = 1 - ease(apart);
    bx.globalAlpha = A;
    for (const w of WH) {
      const r = R * w.f * (1 + ease(apart) * (2.4 - w.f)), z = Math.min((6.283 * r) / w.n * 0.5, S * 0.1) * (P.sk ? P.sk / 0.72 * 0.72 : 1);
      const band = P.band === undefined ? 1.7 : P.band * 1.7;
      if (band > 0) { bx.strokeStyle = rgba(mixc(PEARL, COLD, cold), 0.06); bx.lineWidth = z * band; bx.beginPath(); bx.arc(BX, BY, r, 0, 6.283); bx.stroke(); }
      if (P.rims) { bx.strokeStyle = rgba(PEARL, 0.09); bx.lineWidth = 0.8; for (const d of [-1, 1]) { bx.beginPath(); bx.arc(BX, BY, r + d * z * 0.95, 0, 6.283); bx.stroke(); } }
      for (let i = 0; i < w.n; i++) {
        if (i === w.gap) continue;
        const a = -Math.PI / 2 + w.a + (i / w.n) * 6.283, x = BX + Math.cos(a) * r, y = BY + Math.sin(a) * r;
        bx.save(); bx.translate(x, y); bx.rotate(a + Math.PI / 2);
        bx.fillStyle = sealColor(w.h[i], w.l[i], 0.5 + 0.5 * w.l[i], opening ? 2 : 0); seal(bx, -z / 2, -z / 2, z, w.b[i]);
        bx.restore();
      }
    }
    // LIGHT ON THE RIM: the light that casts the shadow below catches the top of the outer wheel —
    // a thin warm arc, brightest at twelve, gone by the sides; and a breath of it on the air above
    if (LOOK.rimLight) {
      const w0 = WH[0], r = R * w0.f * (1 + ease(apart) * (2.4 - w0.f)), z = Math.min((6.283 * r) / w0.n * 0.5, S * 0.1) * (P.sk || 1), rr1 = r + z * 0.95;
      const K = (LOOK.rimK || 1) * (1 + 0.55 * rimBoost + 1.2 * rimFlare), K2 = (LOOK.rimK2 || 1) * (1 + 0.8 * rimBoost + 1.6 * rimFlare), fade = 1 - ease(apart);
      const cA = mixc(mixc([255, 228, 196], [255, 196, 140], rimBoost), COLD, cold), cB = mixc(mixc([255, 200, 150], [255, 170, 110], rimBoost), COLD, cold);
      for (let k = 0; k < 48; k++) { const a0 = -Math.PI + (k / 48) * Math.PI, a1 = a0 + Math.PI / 48, m = Math.pow(Math.sin(((k + 0.5) / 48) * Math.PI), 2.2);
        bx.strokeStyle = rgba(cA, Math.min(0.95, 0.5 * K * m * fade)); bx.lineWidth = 1.3; bx.beginPath(); bx.arc(BX, BY, rr1, a0, a1); bx.stroke();
        bx.strokeStyle = rgba(cB, Math.min(0.4, 0.06 * K2 * m * fade)); bx.lineWidth = 7; bx.beginPath(); bx.arc(BX, BY, rr1 + 1, a0, a1); bx.stroke(); }
      const gl = bx.createRadialGradient(BX, BY - R * 1.15, 0, BX, BY - R * 1.15, R * 0.9); gl.addColorStop(0, rgba(cB, Math.min(0.2, 0.045 * K2 * fade))); gl.addColorStop(1, 'rgba(255,214,170,0)'); bx.fillStyle = gl; bx.fillRect(BX - R, BY - R * 2.1, R * 2, R * 1.9);
    }
    if (P.ticks === 'all') for (const w of WH) { // every wheel carries its own scale, one mark per seal, and turns with it
      const r = R * w.f * (1 + ease(apart) * (2.4 - w.f)), z = Math.min((6.283 * r) / w.n * 0.5, S * 0.1) * (P.sk || 1), rr0 = r + z * 1.05;
      for (let m = 0; m < w.n * 2; m++) { const a = -Math.PI / 2 + w.a + (m / (w.n * 2)) * 6.283, L = m % 2 ? 2 : 4; bx.strokeStyle = rgba(PEARL, m % 2 ? 0.12 : 0.26); bx.lineWidth = 0.8; bx.beginPath(); bx.moveTo(BX + Math.cos(a) * rr0, BY + Math.sin(a) * rr0); bx.lineTo(BX + Math.cos(a) * (rr0 + L), BY + Math.sin(a) * (rr0 + L)); bx.stroke(); }
    }
    if (P.ticks === 'clock') { const rt = R * 1.06 * (1 + ease(apart) * 1.4); for (let m = 0; m < 60; m++) { const a = -Math.PI / 2 + (m / 60) * 6.283; if (m % 5) { bx.fillStyle = rgba(PEARL, 0.22); bx.beginPath(); bx.arc(BX + Math.cos(a) * rt, BY + Math.sin(a) * rt, 0.9, 0, 6.283); bx.fill(); } else { bx.strokeStyle = rgba(PEARL, m ? 0.38 : 0); bx.lineWidth = 1.4; bx.beginPath(); bx.moveTo(BX + Math.cos(a) * (rt - 4), BY + Math.sin(a) * (rt - 4)); bx.lineTo(BX + Math.cos(a) * (rt + 4), BY + Math.sin(a) * (rt + 4)); bx.stroke(); } } }
    if (P.ticks === true || P.ticks === 'outer' || P.ticks === 'all') { const rt = R * (P.ticks === true ? 0.99 : 1.09) * (1 + ease(apart) * 1.4); for (let m = 0; m < 100; m++) { const a = -Math.PI / 2 + (m / 100) * 6.283, L = m % 10 === 0 ? 7 : m % 5 === 0 ? 4.5 : 2.5; bx.strokeStyle = rgba(PEARL, m % 10 === 0 ? 0.32 : 0.14); bx.lineWidth = m % 10 === 0 ? 1.2 : 0.8; bx.beginPath(); bx.moveTo(BX + Math.cos(a) * rt, BY + Math.sin(a) * rt); bx.lineTo(BX + Math.cos(a) * (rt - L), BY + Math.sin(a) * (rt - L)); bx.stroke(); } }
    if (P.notch) { const ry = BY - R * 1.04; bx.fillStyle = rgba(mixc(EMBER, GOLD, gate), 0.55 + 0.45 * gate); bx.beginPath(); bx.moveTo(BX - 4, ry - 6); bx.lineTo(BX + 4, ry - 6); bx.lineTo(BX, ry); bx.closePath(); bx.fill(); }
    /* Шифр 09.11.2026, решение основателя: вертикальной светлой линии из середины знака при открытии нет (прочие эффекты открытия — прежние). */
    if (P.logo) drawMark(R * 0.62, SL[0]); else at(bx, BX, BY, S * 0.3, ST[0], sealColor(SH[0], SL[0], 0.85, opening ? 2 : 0));
    bx.globalAlpha = 1;
  },
  fractal(t) {
    const g = S * 0.03, c = (S * 1.12 - 3 * g) / 4, x0 = BX - (4 * c + 3 * g) / 2, y0 = BY - (4 * c + 3 * g) / 2;
    const zk = zoomK, px = x0 + (zk & 3) * (c + g) + c / 2, py = y0 + (zk >> 2) * (c + g) + c / 2, z = 1 + Math.pow(ease(apart), 3) * 28;
    bx.save(); bx.globalAlpha = apart > 0.75 ? 1 - (apart - 0.75) / 0.25 : 1;
    bx.translate(px, py); bx.scale(z, z); bx.translate(-px, -py);
    for (let k = 0; k < 16; k++) {
      const q = k & 3, r = k >> 2, x = x0 + q * (c + g) + c / 2, y = y0 + r * (c + g) + c / 2, l = SL[k];
      if ((BIG >>> k) & 1) at(bx, x, y, c * 0.86, ST[k], sealColor(SH[k], l, 0.62 + 0.38 * l, opening ? 2 : 0));
      else { bx.fillStyle = rgba(PEARL, 0.16 + 0.3 * l); bx.fillRect(x - 1, y - 1, 2, 2); }
    }
    bx.restore();
  },
  sphere(t) {
    const RS = R * 0.95 * (1 + ease(apart) * 4), A = 1 - ease(apart), tilt = 0.38, cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
    const PXs = new Float32Array(SPN), PYs = new Float32Array(SPN), PZs = new Float32Array(SPN);
    for (let i = 0; i < SPN; i++) { const x = SX[i] * cy + SZ3[i] * sy, z = -SX[i] * sy + SZ3[i] * cy; PXs[i] = x; PYs[i] = SY[i] * ct - z * st; PZs[i] = SY[i] * st + z * ct; }
    SORD.sort((a, b) => PZs[a] - PZs[b]);
    bx.globalAlpha = A;
    const halo = bx.createRadialGradient(BX, BY, RS * 0.2, BX, BY, RS * 1.25); halo.addColorStop(0, rgba(EMBER, 0.05)); halo.addColorStop(1, rgba(EMBER, 0)); bx.fillStyle = halo; bx.fillRect(BX - RS * 1.3, BY - RS * 1.3, RS * 2.6, RS * 2.6);
    for (let j = 0; j < SPN; j++) {
      const i = SORD[j], d = (PZs[i] + 1) / 2, l = SPL[i], z = S * 0.075 * (0.45 + 0.75 * d) * (1 + 0.3 * l);
      at(bx, BX + PXs[i] * RS, BY + PYs[i] * RS, z, SB[i], sealColor(SHU[i], l, (0.08 + 0.85 * d * d) * (0.75 + 0.25 * l) + 0.2 * l, opening ? 2 : 0));
    }
    bx.globalAlpha = 1;
  }
};
// THE MARK: the two corners of sys.baby — light above-left, ember below-right — laid in seals
const MARK = [[0, 0, 0.754, 0.246, 0], [0, 0, 0.246, 0.746, 0], [0.754, 0.246, 1, 1, 1], [0.246, 0.746, 1, 1, 1]];
const inMark = (u, v) => { for (const b of MARK) if (u >= b[0] && u <= b[2] && v >= b[1] && v <= b[3]) return b[4] + 1; return 0; };
const MB = Array.from({ length: 1024 }, rbits), MH = Array.from({ length: 1024 }, rhue);
// The mark is itself a seal: the closed sys.baby sign laid on a 4 × 4 grid — light corner above-left,
// ember corner below-right closing at the top — eleven cells, each as large as the seals of the field or larger.
// the two corners meet corner to corner — below-left, and above-right too: the sign is closed, nothing overlaps
const MCELL = [[0, 0, 1], [1, 0, 1], [2, 0, 1], [0, 1, 1], [0, 2, 1], [3, 1, 2], [3, 2, 2], [3, 3, 2], [1, 3, 2], [2, 3, 2]];
// The sign in the clean mark's geometry (D-608, founder 04.11: the new mark everywhere — zakryt geo(0,0,100,25,20,8.68)),
// in the 512-unit icon's sign box 130…382: the light corner and the orange corner meet corner to corner.
function markPaths(x0, y0, k) {
  const q = 2.52 * k, M = new DOMMatrix([q, 0, 0, q, x0, y0]), w = new Path2D(), o = new Path2D();
  w.addPath(new Path2D('M20 0H75V25H33.68A8.68 8.68 0 0 0 25 33.68V75H0V20A20 20 0 0 1 20 0Z'), M);
  o.addPath(new Path2D('M80 100H25V75H66.32A8.68 8.68 0 0 0 75 66.32V25H100V80A20 20 0 0 1 80 100Z'), M);
  return [w, o];
}
// the sign whole, and the field's own seals cut out of it as dark hollows
function drawSolidMark(side, l) {
  const k = side / 252, x0 = BX - side / 2, y0 = BY - side / 2, [w, o] = markPaths(x0, y0, k), lv = P.logo;
  bx.fillStyle = 'hsla(36,10%,' + (93 + 4 * l).toFixed(0) + '%,1)'; bx.fill(w);
  bx.fillStyle = 'hsla(16,72%,' + (56 + 10 * l).toFixed(0) + '%,1)'; bx.fill(o);
  bx.save(); bx.globalCompositeOperation = 'destination-out';
  // one row of seals along each bar: the pitch is the bar's own thickness (62 of 252), so the sign is a 4 × 4 of seals
  const t = 62 * k, z = t * (lv === 3 ? 0.84 : 0.7);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const key = j * 4 + i, cx = x0 + t / 2 + i * t * (190 / 186), cy = y0 + t / 2 + j * t * (188 / 186);
    if (lv === 4 && MB[key] % 10 < 3) continue;
    if (!bx.isPointInPath(w, cx * dpr, cy * dpr) && !bx.isPointInPath(o, cx * dpr, cy * dpr)) continue; // the test is in device pixels
    bx.fillStyle = '#000'; seal(bx, cx - z / 2, cy - z / 2, z, ST[key] ^ MB[key]);
  }
  bx.restore();
}
// The chosen sign, quiet at rest so it belongs to the night; it burns to full colour only when the word is right.
function drawSign(l) {
  if (true && POL.on && P.logo === 6 && POL.sign) { POL.sign((fs * 0.95 / 0.7) * (252 / 62), opening ? ease(Math.min(1, (performance.now() / 1000 - opening.t0) / 0.7)) : 0); return; } // D-603: pol/shifr.js api.sign; D-702: lit in its own outline
  const lv = P.logo, side = (fs * 0.95 / 0.7) * (252 / 62), k = side / 252, x0 = BX - side / 2, y0 = BY - side / 2, [w, o] = markPaths(x0, y0, k), t = 62 * k;
  const B = opening ? ease(Math.min(1, (performance.now() / 1000 - opening.t0) / 0.7)) : 0; // 0 quiet … 1 lit by the right word
  const W = (a) => 'hsla(36,' + mix(6, 10, B).toFixed(0) + '%,' + mix(58, 95, B).toFixed(0) + '%,' + a + ')', O = (a) => 'hsla(16,' + mix(40, 76, B).toFixed(0) + '%,' + mix(38, 58, B).toFixed(0) + '%,' + a + ')';
  const cells = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const cx = x0 + t / 2 + i * t * (190 / 186), cy = y0 + t / 2 + j * t * (188 / 186), key = j * 4 + i; if (bx.isPointInPath(w, cx * dpr, cy * dpr)) cells.push([cx, cy, key, 1]); else if (bx.isPointInPath(o, cx * dpr, cy * dpr)) cells.push([cx, cy, key, 2]); }
  const z = t * 0.7, hue = (key) => SH[key], bits = (key) => ST[key] ^ MB[key];
  if (lv === 5) { // цветные печати: quiet plates, each seal in its own colour
    bx.fillStyle = W(0.62 + 0.38 * B); bx.fill(w); bx.fillStyle = O(0.7 + 0.3 * B); bx.fill(o);
    for (const [cx, cy, key] of cells) { bx.fillStyle = 'hsla(' + hue(key) + ',' + mix(55, 70, B).toFixed(0) + '%,' + mix(30, 34, B).toFixed(0) + '%,0.95)'; seal(bx, cx - z / 2, cy - z / 2, z, bits(key)); }
  } else if (lv === 6) { // витраж: dark plates, the seals are the light — coloured glass set into the sign
    if (POL.on && !opening) POL.mark(w, o, (u) => x0 + (u - 130) * k, (v) => y0 + (v - 130) * k, t); // D-603: backlit sign
    else { bx.fillStyle = W(0.16 + 0.5 * B); bx.fill(w); bx.fillStyle = O(0.22 + 0.5 * B); bx.fill(o);
    bx.lineWidth = 1; bx.strokeStyle = W(0.3 + 0.5 * B); bx.stroke(w); bx.strokeStyle = O(0.4 + 0.5 * B); bx.stroke(o); }
    for (const [cx, cy, key, c] of cells) { bx.fillStyle = c === 1 ? 'hsla(' + mix(hue(key), 40, 0.5) + ',' + mix(30, 60, B).toFixed(0) + '%,' + mix(66, 84, B).toFixed(0) + '%,0.9)' : 'hsla(' + (12 + (hue(key) % 24)) + ',' + mix(60, 85, B).toFixed(0) + '%,' + mix(56, 70, B).toFixed(0) + '%,0.95)'; seal(bx, cx - z / 2, cy - z / 2, z, bits(key)); }
  } else if (lv === 7) { // гравировка: the sign is only a fine outline; the seals inside are cut faintly into the dark
    bx.lineWidth = 1.2; bx.strokeStyle = W(0.55 + 0.45 * B); bx.stroke(w); bx.strokeStyle = O(0.65 + 0.35 * B); bx.stroke(o);
    for (const [cx, cy, key, c] of cells) { bx.fillStyle = c === 1 ? W(0.38 + 0.5 * B) : O(0.5 + 0.45 * B); seal(bx, cx - z / 2, cy - z / 2, z, bits(key)); }
  } else { // только печати: no plates at all — ten seals stand where the sign is, and their places are the sign
    for (const [cx, cy, key, c] of cells) { const zz = t * 0.86; bx.fillStyle = c === 1 ? W(0.7 + 0.3 * B) : O(0.8 + 0.2 * B); seal(bx, cx - zz / 2, cy - zz / 2, zz, bits(key) | 0x0660); }
    return;
  }
  if (lv === 5) return;
}
function drawMark(side, l) {
  if (P.logo >= 5) return drawSign(l);
  if (P.logo !== 1) return drawSolidMark((fs * (P.logo === 3 ? 1.15 : 0.95) / 0.7) * (252 / 62), l); // as small as one row of field-sized seals allows
  const lv = P.logo, z = fs * 0.9, gap = z * 0.12, st = z + gap, x0 = BX - (4 * st - gap) / 2, y0 = BY - (4 * st - gap) / 2;
  const col = (w, k, a) => (w === 1 ? 'hsla(36,22%,' + (86 + 6 * l).toFixed(0) + '%,' + a + ')' : 'hsla(' + (17 + (SH[k] % 10)) + ',80%,' + (58 + 12 * l).toFixed(0) + '%,' + a + ')');
  if (lv === 4) for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { bx.fillStyle = rgba(PEARL, 0.1); bx.fillRect(x0 + i * st + z / 2 - 1, y0 + j * st + z / 2 - 1, 2, 2); }
  MCELL.forEach(([i, j, w], k) => {
    const x = x0 + i * st, y = y0 + j * st;
    if (lv === 2) { bx.fillStyle = col(w, k, 0.95); rr(x, y, z, z, z * 0.18); bx.fill(); return; } // pure bits: the sign as one great seal
    if (lv === 3 && w === 1) { bx.fillStyle = rgba(PEARL, 0.85); seal(bx, x, y, z, ST[k] | 0x0660); return; } // pearl, only the closing corner burns
    if (lv === 3) { const g = bx.createRadialGradient(x + z / 2, y + z / 2, 0, x + z / 2, y + z / 2, z); g.addColorStop(0, rgba(EMBER, 0.25)); g.addColorStop(1, rgba(EMBER, 0)); bx.fillStyle = g; bx.fillRect(x - z / 2, y - z / 2, z * 2, z * 2); }
    bx.fillStyle = col(w, k, 0.95); seal(bx, x, y, z, ST[k] | 0x0660);
  });
}
// the state as a plain 4 × 4 of seals (used inside the key ring)
function stateGrid(hot) {
  for (let k = 0; k < 16; k++) {
    let [x, y, c] = cellXY(k); const l = SL[k], cg = colGlow[k & 3];
    if (apart) { const dx = x + c / 2 - BX, dy = y + c / 2 - BY, d = Math.hypot(dx, dy) || 1, far = ease(apart) * Math.max(vw, vh) * 0.7; x += (dx / d) * far; y += (dy / d) * far; }
    const a = apart ? 1 - ease(apart * 1.25) : 1; if (a <= 0.01) continue;
    bx.globalAlpha = a;
    if (P.frames) { bx.strokeStyle = rgba(mixc(PEARL, hot, Math.min(1, l + cg)), 0.14 + 0.5 * Math.min(1, l + cg)); bx.lineWidth = 1; rr(x + 0.5, y + 0.5, c - 1, c - 1, c * 0.14); bx.stroke(); }
    bx.fillStyle = sealColor(SH[k], Math.min(1, l + cg * 0.5), 0.62 + 0.38 * Math.min(1, l), opening ? 2 : 0);
    seal(bx, x + c * (1 - P.big) / 2, y + c * (1 - P.big) / 2, c * P.big, ST[k]);
  }
  bx.globalAlpha = 1;
}
function emblemSign(t) {
  if (P.emblem === 'key') { const s0 = rb(); for (let i = 0; i < 256; i++) { const d = Math.min(Math.abs(i - s0), 256 - Math.abs(i - s0)); KF[i] = t + d * 0.004; } }
  if (P.emblem === 'limb') { const w = WH[(typed) % 3], dir = typed % 2 ? 1 : -1; w.ta += (dir * 6.283) / w.n; for (let i = 0; i < w.n; i++) { w.l[i] = 0.9; if (rf() < 0.5) w.b[i] = rbits(); } }
  if (P.emblem === 'fractal') BIG = rbits() | 1 << (rb() & 15);
  if (P.emblem === 'sphere') { bands.push(t); spin += 0.9; }
  rimBoost = Math.min(1, rimBoost + 0.35);
}
function emblemFrame(t, dt) {
  rimBoost *= Math.exp(-dt / 0.9);
  if (opening) rimFlare = Math.min(1, rimFlare + dt * 3); else rimFlare *= Math.exp(-dt / 0.4);
  if (P.emblem === 'key') for (let i = 0; i < 256; i++) { if (KF[i] && t >= KF[i]) { KEY[i] = rb() & 1; KL[i] = 1; KF[i] = 0; } KL[i] *= Math.exp(-dt / 0.5); }
  if (P.emblem === 'limb') for (const w of WH) { w.a += (w.ta - w.a) * Math.min(1, dt * (opening ? 3.2 : 14)); for (let i = 0; i < w.n; i++) w.l[i] *= Math.exp(-dt / 0.5); }
  if (P.emblem === 'sphere') {
    if (!RM) { yaw += dt * (0.13 + spin); spin *= Math.exp(-dt / 0.5); }
    for (let i = 0; i < SPN; i++) SPL[i] *= Math.exp(-dt / 0.6);
    bands = bands.filter((b0) => { const lat = 1.1 - ((t - b0) / 0.55) * 2.2; for (let i = 0; i < SPN; i++) if (Math.abs(SY[i] - lat) < 0.1 && SPL[i] < 0.9) { SPL[i] = 1; SB[i] = rbits(); } return lat > -1.2; });
  }
}
function emblemOpen(o) {
  if (P.emblem === 'limb') for (const w of WH) { let ta = -(w.gap / w.n) * 6.283; while (ta < w.a + 6.283) ta += 6.283; w.ta = ta; }
  if (P.emblem === 'fractal') { const on = []; for (let k = 0; k < 16; k++) if ((BIG >>> k) & 1) on.push(k); zoomK = on.length ? on[rb() % on.length] : 5; }
  if (P.emblem === 'sphere') spin = 3;
}

// ---------- motion ----------
function avalanche(t) {
  // one sign changes every byte of the state: the flip starts at one cell and diffuses
  const s = rb() & 15, sr = s >> 2, sq = s & 3;
  for (let k = 0; k < 16; k++) FLIP[k] = t + (Math.abs((k >> 2) - sr) + Math.abs((k & 3) - sq)) * 0.024;
  if (P.emblem) emblemSign(t);
  spinSign();
  if (TM.wave === 'none') return;
  if (TM.wave === 'calm') { ripples.push({ t0: t + 0.03, r0: S ? R * 0.9 : 0, v: R * 2.2, w: 0.4, tint: 0, flip: true, done: -1, rmax: R * 2.7 }); return; }
  ripples.push({ t0: t + 0.03, r0: S ? R * 0.9 : 0, v: Math.max(vw, vh) * 1.05, w: 0.75, tint: 0, flip: true, done: -1 });
}
function frame(now) {
  running = false;
  if (held || kit.dead()) return;
  if (BUILD) { loop(); return; } // D-603: no frames while the scene is being built
  const t = now / 1000, dt = Math.min(0.05, last ? t - last : 0.016); last = t;
  if (coldAt >= 0) { const e = t - coldAt; cold = e < 1.5 ? 1 : Math.max(0, 1 - (e - 1.5) / 1.1); if (cold === 0) coldAt = -1; }
  if (shake) shake = Math.max(0, shake - dt * 2.8);
  // the state: scheduled flips light their cell, then cool
  for (let k = 0; k < 16; k++) {
    if (FLIP[k] && t >= FLIP[k]) { ST[k] = rbits(); SH[k] = rhue(); SL[k] = 1; FLIP[k] = 0; }
    SL[k] *= Math.exp(-dt / 0.45);
  }
  for (let q = 0; q < 4; q++) colGlow[q] *= Math.exp(-dt / 0.12);
  // the cipher breathes: now and then one byte of the state and a few in the lattice change on their own
  if (!opening && !RM) {
    /* Дыхание интенсивнее (основатель 03.11.2026, D-600: «Дышать должны интенсивнее» — по присланному демо
       «Круг 2 · без дорожек + деления»): байт состояния меняется каждые 2,6 с, печати решётки вздрагивают
       ~12 раз в секунду. Прежнее «спокойное» дыхание H3a (5,5 с и 0,42 с) — снято. */
    breathe += dt; if (breathe > 2.6) { breathe = 0; const k = rb() & 15; ST[k] = rbits(); SH[k] = rhue(); SL[k] = Math.max(SL[k], 0.28); }
    sparkle += dt; while (sparkle > 0.085) { sparkle -= 0.085; if (N) touch((rb() * 256 + rb()) % N, 0.3 + 0.25 * rf(), cold > 0.5 ? 1 : 0, true); }
  }
  // waves across the lattice
  for (const w of ripples) {
    const e = t - w.t0; if (e < 0) continue;
    const r1 = w.r0 + e * w.v, r0 = w.done;
    for (let rI = 0; rI < rows; rI++) {
      const dyr = PY[rI] + fs / 2 - BY;
      if (!P.polar && Math.abs(dyr) > r1 + ch) continue;
      for (let c = 0; c < cols; c++) {
        const i = rI * cols + c, dx = CX[i] + fs / 2 - BX, dy = CY[i] + fs / 2 - BY, d = Math.sqrt(dx * dx + dy * dy);
        if (d > r0 && d <= r1 && (!w.rmax || d < w.rmax)) {
          if (w.erase) { GONE[i] = 1; touch(i, 0.9 * w.w, 2, false); }
          else touch(i, w.w * (w.rmax ? Math.max(0, 1 - d / w.rmax) : 0.55 + 0.45 * Math.max(0, 1 - d / (Math.max(vw, vh) * 1.1))), w.tint, w.flip);
        }
      }
    }
    w.done = r1;
  }
  ripples = ripples.filter((w) => w.done < (w.rmax ? w.rmax + 20 : Math.hypot(vw, vh) + 40));
  spinFrame(dt);
  // cells in motion cool down and are redrawn; only they cost anything
  if (act.length) {
    const k = Math.exp(-dt / 0.55), keep = [];
    for (const i of act) {
      LUM[i] *= k;
      if (LUM[i] < 0.012) { LUM[i] = 0; inAct[i] = 0; redrawCell(i); } else { redrawCell(i); keep.push(i); }
    }
    act = keep;
  }
  if (P.emblem) emblemFrame(t, dt);
  if (opening) stepOpen(t);
  drawBlock(t);
  if (POL.on) POL.frame();
  loop();
}
function loop() { if (!running && !held && !kit.dead()) { running = true; requestAnimationFrame(frame); } }

// ---------- the field's rings turn, slower than the wheels: all, a few, or like gears ----------
function spinSign() {
  if (!TM.spin || RM || BUILD || !RINGS || !RINGS.size) return;
  const dir = typed % 2 ? 1 : -1;
  if (TM.spin === 'rand') {
    // any rings, near or far: one, two or three per sign, never more than SPINMAX turning at once (weak devices)
    const moving = [...RINGS.keys()].filter((g) => Math.abs(RT.get(g) - RA.get(g)) > 1e-3).length, keys = [...RINGS.keys()];
    const want = Math.min(1 + (rb() % 3), Math.max(0, (TM.max || 6) - moving));
    for (let n = 0, tries = 0; n < want && tries < 20; tries++) {
      const g = keys[rb() % keys.length]; if (Math.abs(RT.get(g) - RA.get(g)) > 1e-3) continue;
      const cells = RINGS.get(g), step = (6.283 / Math.max(8, Math.round((6.283 * cells[0][2]) / cw))) * 0.6;
      RT.set(g, RT.get(g) + step * (g % 2 ? 1 : -1)); n++;
    }
    return;
  }
  for (const [g, cells] of RINGS) {
    if (TM.spin === 'sel' && rf() > 0.4) continue;
    const step = (6.283 / Math.max(8, Math.round((6.283 * cells[0][2]) / cw))) * 0.6; // a little over half a seal per sign
    RT.set(g, RT.get(g) + step * (TM.spin === 'gear' ? (g % 2 ? 1 : -1) : TM.spin === 'sel' ? (rf() < 0.5 ? 1 : -1) : dir));
  }
}
function spinFrame(dt) {
  if (!TM.spin || !RINGS.size) return;
  for (const [g, cells] of RINGS) {
    const a = RA.get(g), tgt = RT.get(g); if (Math.abs(tgt - a) < 1e-4) continue;
    const na = a + (tgt - a) * Math.min(1, dt * 2.2); RA.set(g, na);
    const e = fs * 0.1 + 1;
    for (const [i] of cells) { const x = CX[i] - e, y = CY[i] - e, w = fs + 2 * e; lx.drawImage(bg, x * dpr, y * dpr, w * dpr, w * dpr, x, y, w, w); } // lift the ring
    for (const [i, a0, r] of cells) { CX[i] = BX + Math.cos(a0 + na) * r - fs / 2; CY[i] = BY + Math.sin(a0 + na) * r - fs / 2; } // turn it
    if (LITF && ALB) for (const [i] of cells) MASK[i] = LITF(CX[i] + fs / 2, CY[i] + fs / 2) * ALB[i]; // D-603: the shade stays with the light
    for (const [i] of cells) { const al = cellAlpha(i); if (al > 0.004) { lx.fillStyle = sealColor(HUES[i], LUM[i], al, GONE[i] ? 2 : TINT[i], MONOC ? !!MONOC[i] : P.mono); const z = fs * SZ[i]; seal(lx, CX[i] + (fs - z) / 2, CY[i] + (fs - z) / 2, z, BYTES[i]); } } // lay it down
  }
}

// ---------- opening: 14 rounds, then the block comes apart ----------
function stepOpen(t) {
  const o = opening, e = t - o.t0, RD = 0.1, n = Math.min(14, Math.floor(e / RD) + 1);
  if (e < 14 * RD) {
    while (o.round < n) {
      o.round++; ticksLit = o.round; keyFill = Math.round((o.round / 14) * 256); keyRot += 0.02; if (o.round > 10) gate = (o.round - 10) / 4;
      for (let r = 1; r < 4; r++) { const row = [0, 1, 2, 3].map((q) => [ST[r * 4 + q], SH[r * 4 + q]]); for (let q = 0; q < 4; q++) { ST[r * 4 + q] = row[(q + r) & 3][0]; SH[r * 4 + q] = row[(q + r) & 3][1]; } } // ShiftRows
      for (let k = 0; k < 16; k++) { if (rf() < 0.5) ST[k] = rbits(); SL[k] = Math.max(SL[k], 0.55); } // SubBytes
      colGlow[o.round & 3] = 1; // MixColumns
      if (o.round === 7 || o.round === 14) ripples.push({ t0: t, r0: R, v: Math.max(vw, vh) * 1.4, w: 0.8, tint: 2, flip: true, done: -1 });
    }
    // ShiftRows: row r turns r cells to the left, every round; the bytes slide into their new places
    const pr = (e % RD) / RD;
    for (let r = 1; r < 4; r++) rowShift[r] = r * (1 - ease(Math.min(1, pr / 0.6)));
  } else {
    for (let r = 0; r < 4; r++) rowShift[r] = 0;
    if (!o.apartAt) { o.apartAt = t; ripples.push({ t0: t, r0: 0, v: Math.max(vw, vh) * 0.9, w: 1, erase: true, done: -1 }); for (let k = 0; k < 16; k++) SL[k] = 1; }
    const a = (t - o.apartAt) / 1.05;
    apart = clamp(a, 0, 1); dialK = 1 + ease(a) * 0.9; dialA = 1 - ease(a);
    if (a > 0.55 && !o.fade) { o.fade = 1; root.style.transition = 'opacity .55s ease'; root.style.opacity = '0'; }
    if (a >= 1.15 && !o.fired) { o.fired = 1; o.done && o.done(); }
  }
}

// ---------- the door talks to the scene ----------
let rt = 0;
kit.on(window, 'resize', () => { if (true && innerWidth === lastW && innerHeight <= baseH) return; clearTimeout(rt); rt = setTimeout(() => { if (!held) layout(); }, 120); });
layout();
/* D-603: «сцена встала» — когда она нарисована: после сборки по шагам и её света, а не в миг, когда её поставили
   (иначе «уменьшить движение» видело бы, как свет ещё дособирается). Запас — 8 с. */
let saidReady = false;
function sayReady() { if (saidReady) return; saidReady = true; kit.ready(); }
setTimeout(sayReady, 8000);
loop();

return {
  typing(n) {
    if (opening) return;
    const t = performance.now() / 1000;
    if (n > typed) { for (let j = typed; j < n; j++) tape.push({ v: rbits(), h: rhue() }); if (!RM) avalanche(t); else for (let k = 0; k < 16; k++) { ST[k] = rbits(); SH[k] = rhue(); } }
    else if (n < typed) { tape.length = n; if (!RM) { const k = rb() & 15; FLIP[k] = t; } }
    typed = n; loop();
  },
  focus(on) { focusOn = !!on; loop(); },
  need(n) { NEED = n; if (!held) layout(); },
  hold(on) {
    held = !!on; // while the key turns, the scene draws nothing: its frames must cost the key nothing
    if (!held) { last = 0; loop(); }
  },
  wrong() {
    const t = performance.now() / 1000;
    typed = 0; coldAt = t; cold = 1; shake = RM ? 0 : 1;
    for (let k = 0; k < 16; k++) { ST[k] = rbits(); SL[k] = 0.5; }
    const drain = () => { if (tape.length) { tape.pop(); loop(); setTimeout(drain, 28); } };
    drain();
    /* Шифр 09.11.2026, решение основателя (после демо 3): после неверного слова вспышка тише и без лучей — не похожа на
       открытие (у его волн сила 0,8): волна по решётке вдвое слабее прежней (было 0,6); свет знака при этом не
       перестраивается (строка ответа не меняет названную сцене высоту — shell.js placeCluster) */
    if (!RM) ripples.push({ t0: t, r0: R, v: Math.max(vw, vh) * 1.2, w: 0.28, tint: 1, flip: true, done: -1 });
    loop();
  },
  open(done) {
    tape = []; typed = 0;
    if (RM) { root.style.transition = 'opacity .6s ease'; root.style.opacity = '0'; setTimeout(done, 650); return; }
    opening = { t0: performance.now() / 1000, round: 0, done };
    if (P.emblem) emblemOpen(opening);
    loop();
  },
  destroy() { held = true; KW_MO.disconnect(); if (KW_X) KW_X(); }
};
});
})();
