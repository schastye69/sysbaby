
(function () {
'use strict';
if (!window.sbScenes) return;
window.sbScenes.register('porog', function (root, kit) {
/* the door's own clock, listeners and address: everything a scene asks for goes through the kit, so destroy() takes it all away */
const { setTimeout, setInterval, requestAnimationFrame, location } = kit;
const addEventListener = (t, f, o) => kit.on(window, t, f, o);
let held = false; // while the lock turns a key, the scene holds still: its frames must not cost the key anything
root.innerHTML = '<div data-d="stage"><div data-d="cam"><canvas data-d="cv"></canvas></div><div data-d="vig"></div><div data-d="grain"></div></div>';
/* ПОРОГ — the calm entrance. Light under a closed door.
   Deep dark; a heavy door whose blackened-bronze kick plate is lit only by its own leak; a honed stone threshold
   that receives the light in a fan with a real falloff. The leak IS the word line: a pearl per letter, the light
   grows warmer with each one. Wrong word: someone inside switches the light off — a thin cold line, grey stone,
   then the warmth slowly returns. Right word: the door rises, the light floods the stone toward us.
   Canvas 2D only: the lit stone/door is prerendered once per size into four offscreen layers (idle, full, cold,
   flood); a frame is 1–3 blits, a few gradients and ≤ 32 motes. */
const SERIF = '"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua","Times New Roman","Liberation Serif","Noto Serif",Georgia,serif';
const $ = (id) => root.querySelector('[data-d="' + id + '"]');
const stage = $('stage'), cv = $('cv'), ctx = cv.getContext('2d', { alpha: false }), wordEl = kit.word; // the door tells the scene only how many signs were typed, never the letters
const msg = document.createElement('p');
const mq = matchMedia('(prefers-reduced-motion: reduce)');
let RM = kit.reduced || mq.matches;
const STEPPED = /[?&]step\b/.test(location.search); let vclock = 0; // ?step: a frozen clock advanced by __adv(ms), for frame-exact checks
const now = () => (STEPPED ? vclock : performance.now() / 1000);
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const mixc = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const rgb = (c) => `${c[0] | 0},${c[1] | 0},${c[2] | 0}`;

// ---------- noise (seeded, so every visitor sees the same stone) ----------
function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry(26102026);
const LAT = new Float32Array(65536); for (let i = 0; i < 65536; i++) LAT[i] = rnd();
function vn(x, y) {
  let xi = Math.floor(x), yi = Math.floor(y); const xf = x - xi, yf = y - yi;
  xi &= 255; yi &= 255; const x1 = (xi + 1) & 255, y1 = (yi + 1) & 255;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = LAT[(yi << 8) + xi], b = LAT[(yi << 8) + x1], c = LAT[(y1 << 8) + xi], d = LAT[(y1 << 8) + x1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const n1 = (t, row) => vn(t, row * 17.3) * 2 - 1;

// ---------- the world, in metres ----------
// camera 1.5 m high, 2.2 m from the door; door 0.9 m wide; gap 7.5 mm; threshold 0.42 m deep, 25 mm proud of the floor
const HALF = 0.45, GAP = 0.0075, PT = 0.072, DT = 0.42, CZ = 0.006, STEP = 0.025, HC = 1.5, DD = 2.2, JAMB = 0.075;
// light along the gap: a little brighter in the worn middle (the gap is larger there), never perfectly even
// every night the door sits a little differently: the gap's unevenness and a small bump on the sill are seeded by the date
const DNOW = new Date(), DS = (DNOW.getFullYear() * 372 + DNOW.getMonth() * 31 + DNOW.getDate()) % 997, DR = mulberry(DS * 7 + 1);
const SILL = { x: (DR() - 0.5) * 0.6, w: 0.03 + DR() * 0.04, a: 0.06 + DR() * 0.1 }, DOFF = DR() * 50;
function gapI(X) {
  const ax = Math.abs(X); if (ax >= HALF) return 0;
  const bump = 1 - SILL.a * Math.exp(-(((X - SILL.x) / SILL.w) ** 2));
  return sstep(HALF, HALF - 0.03, ax) * (0.9 + 0.14 * Math.exp(-(X / 0.22) * (X / 0.22))) * bump * (1 + 0.1 * (vn(X * 7 + 3.1 + DOFF, 5.5) * 2 - 1) + 0.09 * (vn(X * 2.2 + 8.4 + DOFF * 0.3, 2.5) * 2 - 1) + 0.035 * (vn(X * 31 + DOFF, 8.5) * 2 - 1) - 0.07 * X / HALF);
}
// illuminance tables E(X, d) on the floor: the slit (line source at the floor) and the open doorway (tall rectangle)
const TX = 241, TD = 140, XMAX = 1.25, DMAX = 1.0;
let EL = null, EF = null, tablesDone = false;
function* tables() {
  EL = new Float32Array(TX * TD); EF = new Float32Array(TX * TD);
  const N = 48, dx = (2 * HALF) / N, xs = [], is = [];
  for (let k = 0; k < N; k++) { const X = -HALF + (k + 0.5) * dx; xs.push(X); is.push(gapI(X)); }
  const HS = [0.02, 0.07, 0.15, 0.27, 0.43, 0.63, 0.88, 1.18, 1.52, 1.9], dh = [0.04, 0.06, 0.1, 0.14, 0.18, 0.22, 0.28, 0.32, 0.36, 0.4];
  for (let j = 0; j < TD; j++) {
    const q = j / (TD - 1), d = DMAX * q * q, dd = d + 0.022, df = d + 0.03;
    for (let i = 0; i < TX; i++) {
      const X = -XMAX + (2 * XMAX * i) / (TX - 1); let s = 0, f = 0;
      for (let k = 0; k < N; k += 1) { const rx = X - xs[k], R2 = rx * rx + dd * dd; s += (is[k] * dd) / (R2 * Math.sqrt(R2)); }
      for (let k = 0; k < N; k += 4) {
        const rx = X - xs[k], b = rx * rx + df * df;
        for (let m = 0; m < HS.length; m++) { const R2 = b + HS[m] * HS[m]; f += (dh[m] * HS[m] * df) / (R2 * R2); }
      }
      EL[j * TX + i] = s * dx; EF[j * TX + i] = f * dx * 4;
    }
    yield;
  }
}
function look(T, X, d) {
  const fi = clamp(((X + XMAX) / (2 * XMAX)) * (TX - 1), 0, TX - 1.001), fj = clamp(Math.sqrt(Math.max(0, d) / DMAX) * (TD - 1), 0, TD - 1.001);
  const i = fi | 0, j = fj | 0, u = fi - i, v = fj - j, o = j * TX + i;
  return (T[o] * (1 - u) + T[o + 1] * u) * (1 - v) + (T[o + TX] * (1 - u) + T[o + TX + 1] * u) * v;
}
// filmic: 1 - e^-x, then display gamma; indexed by sqrt so the deep shadows keep their steps
const LN = 4096, LMAX = 14, LUT = new Float32Array(LN);
for (let i = 0; i < LN; i++) { const x = (i / (LN - 1)) * (i / (LN - 1)) * LMAX, y = Math.pow(1 - Math.exp(-x), 1 / 2.2); LUT[i] = (255 * y * y * 1.16) / (y + 0.16); } // with a toe: blacks stay black
const tm = (x) => (x <= 0 ? 0 : LUT[Math.min(LN - 1, (Math.sqrt(x / LMAX) * (LN - 1)) | 0)]);

// lights (linear rgb × exposure)
const T_IDLE = [1.0, 0.42, 0.115], T_FULL = [1.0, 0.37, 0.07], T_COLD = [0.4, 0.46, 0.6], T_FLOOD = [1.0, 0.68, 0.42];
const X_IDLE = 0.135, X_FULL = 0.34, X_COLD = 0.06, X_FLOOD = 0.05;

// ---------- layout ----------
let vw = 1, vh = 1, dpr = 1, baseH = 0, lastW = 0, L = null, G = null, tLayout = 0;
function fy(d, h) { return G.yh + (G.fD * (HC - h) * DD) / (DD - d); }
function fx(X, d) { return G.cx + (G.fD * X * DD) / (DD - d); }
function geom() {
  const portrait = vh > vw * 1.05;
  const y = Math.round(vh * (portrait ? 0.7 : 0.64));
  const dw = Math.round(portrait ? Math.min(vw * 0.8, 380) : clamp(vw * 0.34, 340, 560));
  const fD = dw / (2 * HALF);
  G = { portrait, y, cx: vw / 2, dw, fD, yh: y - fD * HC, gapPx: fD * GAP };
  G.ly = y - G.gapPx * 0.5;
  G.ry0 = Math.floor(y - Math.max(120, fD * 0.34));
  G.yA = fy(DT, 0);
  // the mark sits between the message and the chamfer
  const ym = y + (G.yA - y) * 0.74, s = (ym - G.yh) / (fD * HC); // well below #msg
  G.dm = DD * (1 - 1 / s); G.mEm = portrait ? 14.5 : 17;
}
function layout() {
  const iw = innerWidth, ih = innerHeight;
  if (!(wordEl.focused && iw === lastW && ih < baseH)) baseH = ih;
  lastW = iw; vw = iw; vh = baseH;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); cv.style.width = vw + 'px'; cv.style.height = vh + 'px';
  stage.style.height = vh + 'px';
  geom(); kit.line(G.ly); // the door's word line is the strip of light under this door
  const w = G.dw;
  L = { cx: G.cx, y: G.ly, w, x0: G.cx - w / 2, x1: G.cx + w / 2 };
  L.fs = clamp(w * 0.055, 15, 26); L.ls = clamp(L.fs * 0.5, 10, 12.5);
  Object.assign(wordEl.style, { left: L.x0 + 'px', top: L.y - 40 + 'px', width: w + 'px', height: 40 + L.ls * 2.8 + 'px' });
  msg.style.top = Math.min(L.y + L.ls * 2.5 + 10, vh - 40) + 'px';
  tLayout = now(); startJob(); fitKeyboard(); kick();
  if (RM || !running) setTimeout(kick, 260);
}
function fitKeyboard() { stage.style.transform = ''; } // the word line lives in the door's own field now

// ---------- small things that make it real ----------
const DENTS = [[-0.31, 0.105, 0.007], [0.12, 0.142, 0.005], [0.27, 0.098, 0.009], [-0.06, 0.19, 0.006]]; // X, h, radius (m)
const GRIT = [[-0.17, 0.05, 0.0026], [0.21, 0.08, 0.0034], [0.045, 0.115, 0.0022]];          // X, d, radius (m)
function crackAt(X, d) { // a hairline crack running in from the left jamb, wandering, dying out mid-stone
  if (d < 0 || d > 0.3) return 0;
  const xc = -0.33 + 0.07 * d + 0.012 * (vn(d * 34 + 4, 7.7) - 0.5) + 0.004 * (vn(d * 160, 9.1) - 0.5);
  const wdt = 0.0005 + 0.0004 * vn(d * 90, 3.3), q = (X - xc) / wdt;
  return Math.exp(-q * q) * sstep(0.3, 0.17, d) * sstep(0, 0.012, d);
}
// ---------- prerender: door + threshold, lit four ways ----------
let LAY = null; // { A, B, C, F, MK, rs, W, H, mk:{x,y,w,h} }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function markMask() {
  // the engraving, drawn flat in threshold coordinates (1 px = m metres)
  const em = 64, sp = em * 0.34, txt = [...'sys.baby'];
  const c0 = mkCanvas(8, 8).getContext('2d'); c0.font = `${em}px ${SERIF}`;
  const ws = txt.map((ch) => c0.measureText(ch).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
  const w = Math.ceil(tw + em * 0.5), h = Math.ceil(em * 1.25), c = mkCanvas(w, h), x = c.getContext('2d');
  x.font = `${em}px ${SERIF}`; x.fillStyle = '#fff'; x.textBaseline = 'alphabetic';
  let px = em * 0.25; txt.forEach((ch, k) => { x.fillText(ch, px, em * 0.92); px += ws[k] + sp; });
  const id = x.getImageData(0, 0, w, h).data, a = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = id[i * 4 + 3] / 255;
  // physical size: em ≈ G.mEm px on screen at the mark's depth
  const m = G.mEm / (G.fD * (DD / (DD - G.dm))) / em;
  return { a, w, h, m, X0: (-w / 2) * m, d0: G.dm - (h / 2) * m };
}
function* prepare() {
  const t0 = performance.now();
  if (!tablesDone) { yield* tables(); tablesDone = true; }
  if (!OAK) yield* textures();
  const g = G, rw = vw, rh = vh - g.ry0;
  const rs = Math.min(dpr, 1.5, Math.sqrt(0.9e6 / (rw * rh))); // stone is soft-edged by nature; 1.5× keeps it crisp enough
  const W = Math.max(1, Math.round(rw * rs)), H = Math.max(1, Math.round(rh * rs));
  const cA = mkCanvas(W, H), cB = mkCanvas(W, H), cC = mkCanvas(W, H), cF = mkCanvas(W, H);
  const iA = new ImageData(W, H); yield; const iB = new ImageData(W, H); yield; const iC = new ImageData(W, H); yield; const iF = new ImageData(W, H); yield;
  const A = iA.data, B = iB.data, C = iC.data, F = iF.data;
  yield; const MM = markMask(); yield;
  const mx0 = Math.max(0, Math.floor((fx(MM.X0 * 1.05, MM.d0) - 0) * rs)), mx1 = Math.min(W, Math.ceil(fx(-MM.X0 * 1.05, MM.d0) * rs));
  const my0 = Math.max(0, Math.floor((fy(MM.d0, 0) - g.ry0) * rs) - 1), my1 = Math.min(H, Math.ceil((fy(MM.d0 + MM.h * MM.m, 0) - g.ry0) * rs) + 1);
  const mkw = Math.max(1, mx1 - mx0), mkh = Math.max(1, my1 - my0), cM = mkCanvas(mkw, mkh), iM = cM.getContext('2d').createImageData(mkw, mkh), M = iM.data;
  const maskAt = (X, d) => {
    const u = (X - MM.X0) / MM.m, v = (d - MM.d0) / MM.m;
    if (u < 0 || v < 0 || u >= MM.w - 1 || v >= MM.h - 1) return 0;
    const i = u | 0, j = v | 0, fu = u - i, fv = v - j, o = j * MM.w + i, a = MM.a;
    return (a[o] * (1 - fu) + a[o + 1] * fu) * (1 - fv) + (a[o + MM.w] * (1 - fu) + a[o + MM.w + 1] * fu) * fv;
  };
  const yGap = g.y - g.gapPx, yC = fy(DT + CZ, -CZ), yF = fy(DT + CZ, -STEP);
  const lip = 0.0011; // engraving wall offset, metres
  let o = 0;
  const put = (r0, g0, b0, r1, g1, b1, r2, g2, b2, r3, g3, b3, dz) => {
    A[o] = tm(r0) + dz; A[o + 1] = tm(g0) + dz; A[o + 2] = tm(b0) + dz; A[o + 3] = 255;
    B[o] = tm(r1) + dz; B[o + 1] = tm(g1) + dz; B[o + 2] = tm(b1) + dz; B[o + 3] = 255;
    C[o] = tm(r2) + dz; C[o + 1] = tm(g2) + dz; C[o + 2] = tm(b2) + dz; C[o + 3] = 255;
    F[o] = tm(r3) + dz; F[o + 1] = tm(g3) + dz; F[o + 2] = tm(b3) + dz; F[o + 3] = 255;
  };
  for (let iy = 0; iy < H; iy++) {
    const py = g.ry0 + (iy + 0.5) / rs;
    for (let ix = 0; ix < W; ix++, o += 4) {
      if (ix && ix % 192 === 0) yield; // ≤ 192 px per slice step
      const px = (ix + 0.5) / rs, dz = (LAT[((iy & 255) << 8) + (ix & 255)] - 0.5) * 1.1; // dither
      let rad = 0, ar = 0, ag = 0, ab = 0, spec = 0, fl = -1, flr = 0;
      if (py < g.y) {
        // ----- the door plane: door, jambs, wall -----
        const h = (g.y - py) / g.fD, X = (px - g.cx) / g.fD, ax = Math.abs(X);
        if (ax < HALF) {
          if (py >= yGap) { put(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); continue; } // the slit itself is drawn live
          const hh = h - GAP;
          if (hh < 0.0016) { // the bottom arris of the plate sees the slit directly
            const e = gapI(X) * 1.1 * (1 - hh / 0.0016);
            const fe = look(EL, X, 0.004) * 0.05;
            rad = e + fe; ar = 1; ag = 0.86; ab = 0.7;
          } else if (h < PT) { // blackened bronze, brushed horizontally, mirroring the lit stone
            const Lr = look(EL, X, 1.47 * h + 0.006) * 0.045, br = 0.62 + 0.38 * (0.55 * vn(X * 3 + 2, h * 820) + 0.45 * vn(X * 22 + 5, h * 2300));
            const pat = 0.85 + 0.3 * vn(X * 9 + 11, h * 40);
            // a few fine scratches across the brushing, brighter where they catch the glow
            const sc1 = vn((X * 0.95 + h * 0.31) * 26 + 3, (h * 0.95 - X * 0.31) * 3800), sc2 = vn((X * 0.97 - h * 0.24) * 31 + 9, (h * 0.97 + X * 0.24) * 4300 + 5);
            const scratch = sstep(0.9, 0.985, sc1) * sstep(0.45, 0.7, vn(X * 11, h * 30)) + 0.7 * sstep(0.92, 0.99, sc2) * sstep(0.5, 0.75, vn(X * 7 + 4, h * 25));
            const edge = Math.min(HALF - ax, PT - h, hh * 3), patina = 0.5 + 0.5 * sstep(0, 0.035, edge) * (0.8 + 0.2 * vn(X * 30, h * 30));
            rad = Lr * 0.8 * Math.exp(-hh / 0.024) * br * pat * patina * (1 + 2.6 * scratch);
            rad += gapI(X) * 0.06 * Math.exp(-hh / 0.006) * (0.8 + 0.2 * br); // the slit's own soft reflection along the lowest centimetre
            if (PT - h < 0.0022) rad += look(EL, X, 0.08) * 0.006; // the plate's top bevel catches the stone's glow
            ar = 1; ag = 0.74 - 0.06 * (1 - patina); ab = 0.5 - 0.04 * (1 - patina);
          } else if (h < PT + 0.0025) { rad = 0; } // seam
          else { // dark oak, vertical grain: grazing light picks out a few lines, then falls off fast
            const wx = X * 70 + 1.6 * vn(X * 4 + 7, h * 2.2), g1 = vn(wx, h * 1.4 + 3), g2 = vn(X * 230 + 9, h * 3);
            const pores = sstep(0.68, 0.9, vn(wx * 9 + 2, h * 70)) * sstep(0.45, 0.62, g1); // ring pores: short dark dashes in the early wood
            const lines = sstep(0.6, 0.86, g1) * 0.9 + 0.35 * g2;
            let dent = 1;
            if (h < 0.2) for (let q = 0; q < 4; q++) { const D = DENTS[q], u = (X - D[0]) / D[2]; if (u > -1 && u < 1) { const v = (h - D[1]) / (D[2] * 0.8), r2 = u * u + v * v; if (r2 < 1) dent += 1.5 * v * (1 - r2) - 0.35 * (1 - r2); } } // the wall facing the glow below lights up
            const worn = sstep(0.55, 0.78, vn(X * 9 + 2, h * 22 + 6)) * Math.exp(-(h - PT) / 0.06); // varnish rubbed off: paler, matte
            const Lw = look(EL, X, 1.3 * (h - PT) + 0.02) * 0.045, sheen = Lw * 0.09 * (1 - worn) * Math.exp(-(h - PT) / 0.035) * (0.7 + 0.3 * vn(X * 40, h * 9));
            const b = look(EL, X, 0.45 * h + 0.03) * 0.0026 * Math.exp(-(h - PT) / 0.04);
            const bead = (h - PT - 0.0065) / 0.0011, vline = Lw * 0.5 * Math.exp(-bead * bead) * (1 - 0.8 * worn) * (0.55 + 0.45 * vn(X * 26 + 1, 1.7)); // the varnish catches a narrow line
            rad = b * (0.3 + lines) * (1 - 0.55 * pores) * (1 + 0.8 * worn) * dent + sheen + vline; ar = 1; ag = 0.6 + 0.06 * worn; ab = 0.36 + 0.08 * worn;
          }
        } else if (ax < HALF + JAMB) { // jamb: matte, a joint against the door
          const j = ax - HALF, b = look(EL, Math.sign(X) * (HALF - 0.02), 0.5 * h + 0.025) * 0.0009 * Math.exp(-h / 0.05);
          const edge = j < 0.0025 ? 0 : j < 0.007 ? 3.2 : JAMB - j < 0.004 ? 1.8 : 1; // the two arrises of the jamb catch a sliver
          rad = b * (0.75 + 0.25 * vn(X * 60, h * 60)) * edge;
          ar = 0.95; ag = 0.9; ab = 0.86;
        } else { // wall
          const b = look(EL, Math.sign(X) * (HALF - 0.02), 0.5 * h + 0.03 + (ax - HALF - JAMB) * 0.7) * 0.0016 * Math.exp(-h / 0.06);
          const plaster = 0.72 + 0.16 * vn(X * 14 + 3, h * 14) + 0.12 * vn(X * 160, h * 160) + 0.1 * (vn(X * 700, h * 700) - 0.5);
          rad = b * plaster * (1 - 0.6 * Math.exp(-(ax - HALF - JAMB) / 0.004)); ar = 0.92; ag = 0.88; ab = 0.84; // shadow line where plaster meets the jamb
        }
        rad *= sstep(g.ry0, g.ry0 + (g.y - g.ry0) * 0.6, py); // dissolves into black
        const r = rad * ar, gg = rad * ag, bb = rad * ab;
        put(r * X_IDLE * T_IDLE[0], gg * X_IDLE * T_IDLE[1], bb * X_IDLE * T_IDLE[2],
          r * X_FULL * T_FULL[0], gg * X_FULL * T_FULL[1], bb * X_FULL * T_FULL[2],
          r * X_COLD * 0.6 * T_COLD[0], gg * X_COLD * 0.6 * T_COLD[1], bb * X_COLD * 0.6 * T_COLD[2], 0, 0, 0, dz);
        continue;
      }
      // ----- the floor -----
      let d, X, surf; // 0 top, 1 arris, 2 chamfer, 3 face, 4 lower floor
      if (py < g.yA - 0.5 / rs) { const s = (py - g.yh) / (g.fD * HC); d = DD * (1 - 1 / s); X = (px - g.cx) / (g.fD * s); surf = 0; }
      else if (py < g.yA + 0.7) { d = DT; X = ((px - g.cx) * (DD - DT)) / (g.fD * DD); surf = 1; }
      else if (py < yC) { d = DT; X = ((px - g.cx) * (DD - DT)) / (g.fD * DD); surf = 2; }
      else if (py < yF) { d = DT + CZ; X = ((px - g.cx) * (DD - DT)) / (g.fD * DD); surf = 3; }
      else { const s = (py - g.yh) / (g.fD * (HC + STEP)); d = DD * (1 - 1 / s); X = (px - g.cx) / (g.fD * s); surf = 4; }
      // honed dark stone (bluestone): cloud, grain, crinoid specks, a hairline calcite vein; a worn centre
      const big = 0.6 * vn(X * 5 + 11, d * 5 + 3) + 0.4 * vn(X * 17 + 5, d * 17 + 9);
      const micro = vn(X * 330, d * 330), fine = vn(X * 900 + 3, d * 900 + 1);
      const sp = sstep(0.8, 0.93, vn(X * 240 + 40, d * 240 + 17)) * (0.4 + 0.6 * vn(X * 70, d * 70));
      const w = vn(X * 1.3 + 8, d * 1.3 + 2), vv = vn(X * 1.9 + d * 1.2 + w * 0.7, d * 9 + w * 0.5 + 3), vein = Math.exp(-((vv - 0.5) * 90) * ((vv - 0.5) * 90)) * sstep(0.55, 0.85, vn(X * 1.1 + 20, d * 1.1 + 5));
      const cloud = vn(X * 9 + 31, d * 9 + 7);
      const wear = surf === 0 ? Math.exp(-(X / 0.23) * (X / 0.23)) * sstep(0, 0.07, d) * sstep(0.4, 0.16, d) : 0;
      const rough = 1 - 0.6 * wear; // feet have polished the middle: less grain, more mirror
      let alb = 0.042 + 0.024 * (big - 0.5) + 0.012 * (cloud - 0.5) + rough * (0.008 * (micro - 0.5) + 0.0025 * (fine - 0.5)) + 0.026 * sp + 0.006 * vein;
      const pore = sstep(0.83, 0.95, vn(X * 520 + 13, d * 520 + 29)) * rough;
      const dl0 = 0.0016, Hn = (dd) => 0.45 * rough * vn(X * 330, dd * 330) - sstep(0.83, 0.95, vn(X * 520 + 13, dd * 520 + 29)) * rough;
      let relief = surf === 0 ? clamp(1 + 1.1 * (Hn(d + dl0) - Hn(d - dl0)), 0.25, 2) : 1;
      const dust = sstep(0.88, 0.97, vn(X * 760 + 51, d * 760 + 3)) * (1 - 0.85 * wear) * (0.5 + 0.5 * sstep(0.25, 0.42, Math.abs(X)));
      alb = alb * (1 - 0.16 * wear) * (1 - 0.6 * pore) + 0.05 * dust;
      let gloss = clamp(0.25 + 1.0 * wear + 0.3 * (big - 0.5) + 0.12 * rough * (micro - 0.5), 0, 1.4) * (1 - pore) * (1 - 0.7 * dust);
      let shade = 1;
      if (surf === 0 && d < 0.3 && X < -0.25 && X > -0.36) { const ck = crackAt(X, d); if (ck > 0.01) { alb *= 1 - 0.7 * ck; gloss *= 1 - ck; } relief *= clamp(1 + 1.6 * (crackAt(X, d - 0.0012) - crackAt(X, d + 0.0012)), 0.2, 2); } // the crack's far lip lit, its near lip in shadow
      if (surf === 0 && d < 0.2) {
        for (let q = 0; q < 3; q++) {
          const gx = GRIT[q][0], gd = GRIT[q][1], gr = GRIT[q][2];
          if (X - gx > 0.02 || gx - X > 0.02 || d < gd - gr || d > gd + 0.05) continue; // a grain of grit: lit cap facing the door, a long soft shadow toward us
          const u = (X - gx) / gr, v = (d - gd) / gr, r2 = u * u + v * v;
          if (r2 < 1) { alb = 0.09 + 0.05 * (1 - r2); gloss = 0; shade *= 1.3 - 1.1 * clamp(v, 0, 1); }
          else if (v > 0) { const len = (gr * gd) / 0.006, wsp = gr * (1 + v * gr / (gd * 1.1)) ; const q = (X - gx) / wsp; shade *= 1 - 0.6 * Math.exp(-q * q) * Math.exp(-(d - gd) / len) * (gr / wsp); }
        }
      }
      // the leak lies close to the stone: a bright skin of light right at the door, then the long fall-off
      let E = look(EL, X, d) * (1 + 2.4 * Math.exp(-d / 0.03)) * shade * relief, Ef = look(EF, X, d), k = 1, kf = 1;
      if (surf === 0) {
        spec = gloss * gapI(X) * 1.15 * Math.exp(-d / (0.005 + 0.02 * gloss)) * Math.min(1, shade) * (1 - wear + wear * (0.25 + 1.3 * sstep(0.38, 0.7, vn(X * 22 + 3, d * 70 + 1)))); // a broken specular streak on the polished middle
        const mk = maskAt(X, d);
        if (mk > 0.003 || maskAt(X, d + lip) > 0.003 || maskAt(X, d - lip) > 0.003) {
          const near = maskAt(X, d + lip), far = maskAt(X, d - lip);
          const facing = Math.max(0, mk - near), away = Math.max(0, mk - far);
          k = 1 + 1.5 * mk + 19 * facing - 0.8 * away; kf = 1 + 0.2 * mk + 1.5 * facing; alb = alb * (1 - mk) + 0.05 * mk; // a fresh cut: the wall facing the door catches the light
          spec *= 1 - mk;
          const mi = (iy - my0) * mkw + (ix - mx0);
          if (ix >= mx0 && ix < mx1 && iy >= my0 && iy < my1) { const q = clamp(facing * 1.8 + mk * 0.3, 0, 1); M[mi * 4] = 255; M[mi * 4 + 1] = 255; M[mi * 4 + 2] = 255; M[mi * 4 + 3] = q * 255; }
        }
      } else if (surf === 1) { k = 2.4; kf = 1.6; }
      else if (surf === 2) { k = 0.3; kf = 0.7; }
      else if (surf === 3) { k = 0.05; kf = 0.25; alb *= 0.8; }
      else { k = 0.035 * sstep(DT + 0.4, DT, d); kf = 1; alb = alb * 0.8 + 0.004 * (vn(X * 3, d * 3) - 0.5); }
      const ae = alb * E * k, sr = ae * 0.92 + spec, sg = ae * 0.97 + spec, sb = ae * 1.04 + spec;
      const fe = (0.042 + 0.35 * (alb - 0.042) + 0.004 * (big - 0.5)) * Ef * kf + 0.003 * Ef * wear;
      put(sr * X_IDLE * T_IDLE[0], sg * X_IDLE * T_IDLE[1], sb * X_IDLE * T_IDLE[2],
        sr * X_FULL * T_FULL[0], sg * X_FULL * T_FULL[1], sb * X_FULL * T_FULL[2],
        (ae * 0.96 + spec * 0.6) * X_COLD * T_COLD[0], (ae * 0.98 + spec * 0.6) * X_COLD * T_COLD[1], (ae * 1.02 + spec * 0.6) * X_COLD * T_COLD[2],
        fe * 0.95 * X_FLOOD * T_FLOOD[0] * 40, fe * X_FLOOD * T_FLOOD[1] * 40, fe * 1.05 * X_FLOOD * T_FLOOD[2] * 40, dz);
    }
    yield;
  }
  for (const [cv2, im] of [[cA, iA], [cB, iB], [cC, iC], [cF, iF]]) { // uploaded in strips, one per slice step
    const x2 = cv2.getContext('2d'), st = Math.max(16, Math.ceil(H / 8));
    for (let y0 = 0; y0 < H; y0 += st) { x2.putImageData(im, 0, 0, 0, y0, W, Math.min(st, H - y0)); yield; }
  }
  cM.getContext('2d').putImageData(iM, 0, 0);
  LAY = { A: cA, B: cB, C: cC, F: cF, M: cM, rs, W, H, mk: { x: mx0 / rs, y: g.ry0 + my0 / rs, w: mkw / rs, h: mkh / rs }, ms: performance.now() - t0 };
}
// the whole leaf's oak and the wall's plaster, as grey multipliers (shown only where the room's light reaches)
let OAK = null, PLASTER = null;
function* textures() {
  const ow = 256, oh = 1024, oc = mkCanvas(ow, oh), oi = new ImageData(ow, oh), od = oi.data;
  for (let y = 0; y < oh; y++) {
    const h = (1 - y / oh) * 2.15;
    for (let x = 0; x < ow; x++) {
      const X = -HALF + (x / ow) * LEAF, wx = X * 70 + 1.6 * vn(X * 4 + 7, h * 2.2), g1 = vn(wx, h * 1.4 + 3), g2 = vn(X * 230 + 9, h * 3);
      const pores = sstep(0.68, 0.9, vn(wx * 9 + 2, h * 70)) * sstep(0.45, 0.62, g1);
      let v = (0.5 + 0.32 * sstep(0.6, 0.86, g1) + 0.12 * g2) * (1 - 0.45 * pores);
      for (let q = 0; q < 4; q++) { const D = DENTS[q], u = (X - D[0]) / D[2], w2 = (h - D[1] - 0.9) / (D[2] * 0.8), r2 = u * u + w2 * w2; if (r2 < 1) v *= 1 + 0.8 * w2 * (1 - r2); }
      const stile = Math.abs(X) > 0.33 ? 1.05 : 1; // stiles and panel read as slightly different boards
      const o = (y * ow + x) * 4; od[o] = od[o + 1] = od[o + 2] = clamp(v * stile, 0, 1) * 255; od[o + 3] = 255;
    }
    if ((y & 31) === 31) yield;
  }
  oc.getContext('2d').putImageData(oi, 0, 0); yield;
  const ps = 192, pc = mkCanvas(ps, ps), pi = new ImageData(ps, ps), pd = pi.data;
  for (let y = 0; y < ps; y++) { for (let x = 0; x < ps; x++) {
    const u = x / ps, v = y / ps, tile = (f, a, b) => vn(u * f + a, v * f + b) * (1 - u) * (1 - v) + vn((u - 1) * f + a, v * f + b) * u * (1 - v) + vn(u * f + a, (v - 1) * f + b) * (1 - u) * v + vn((u - 1) * f + a, (v - 1) * f + b) * u * v;
    const val = 0.72 + 0.12 * tile(6, 3, 5) + 0.1 * tile(40, 11, 2) + 0.1 * (tile(150, 7, 9) - 0.5);
    const o = (y * ps + x) * 4; pd[o] = pd[o + 1] = pd[o + 2] = clamp(val, 0, 1) * 255; pd[o + 3] = 255; }
    if ((y & 31) === 31) yield; }
  pc.getContext('2d').putImageData(pi, 0, 0);
  OAK = oc; PLASTER = ctx.createPattern(pc, 'repeat');
}
// the detailed prerender is built in slices of ≤ 7 ms between frames; until then a cheap threshold glow stands in, then crossfades
let job = null, jobKey = '', tLay = -1e9, maxChunk = 0;
function startJob() {
  const key = vw + 'x' + vh;
  if (key === jobKey) return;
  jobKey = key; LAY = null; job = prepare(); maxChunk = 0; setTimeout(pump, 0);
}
function pump() {
  if (!job) return;
  const t0 = performance.now(), gen = job;
  while (performance.now() - t0 < 3) { if (gen.next().done) { if (job === gen) { job = null; tLay = now(); } break; } }
  maxChunk = Math.max(maxChunk, performance.now() - t0);
  if (job) setTimeout(pump, 0); else { kick(); kit.ready(); }
}
function drawCheap(a) { // a warm wash on the stone falling off from the slit — no texture, two gradients
  ctx.save(); ctx.beginPath(); ctx.rect(0, G.y, vw, G.yA - G.y); ctx.clip();
  ctx.translate(G.cx, G.y); ctx.scale(1, 0.34); dot(0, 0, G.dw * 0.95, '150,82,34', 0.55 * a); dot(0, 0, G.dw * 0.6, '200,120,56', 0.35 * a);
  ctx.restore();
}

// ---------- sprites ----------
function sprite(r, core) {
  const s = Math.ceil(r * 2), c = mkCanvas(s, s), x = c.getContext('2d'), gr = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  gr.addColorStop(0, `rgba(${core},1)`); gr.addColorStop(0.25, `rgba(${core},.55)`); gr.addColorStop(0.6, `rgba(${core},.12)`); gr.addColorStop(1, `rgba(${core},0)`);
  x.fillStyle = gr; x.fillRect(0, 0, s, s); return c;
}
const MOTE = sprite(16, '255,222,180');
const BOKEH = (() => { const s = 64, c = mkCanvas(s, s), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 31);
  g.addColorStop(0, 'rgba(255,214,170,.55)'); g.addColorStop(0.78, 'rgba(255,214,170,.7)'); g.addColorStop(0.9, 'rgba(255,224,186,.9)'); g.addColorStop(1, 'rgba(255,214,170,0)');
  x.fillStyle = g; x.fillRect(0, 0, s, s); return c; })();
const near = [0, 1, 2].map((i) => ({ s: 40 + i * 9.3, X: [-0.22, 0.16, 0.34][i], d: [1.0, 1.25, 0.85][i], h: [0.62, 0.8, 0.5][i] }));

// ---------- motes in the leak ----------
const motes = [];
function seedMotes() {
  motes.length = 0;
  const n = vw < 600 ? 16 : 24, r = mulberry(7);
  for (let i = 0; i < n; i++) motes.push({ X: (r() * 2 - 1) * 0.62, d: 0.004 + Math.pow(r(), 1.6) * 0.3, h: 0.004 + Math.pow(r(), 2) * 0.16, s: r() * 100, sz: 0.55 + r() * 0.9, tw: 0.8 + r() * 2.6, ph: r() * 6.28 });
}
seedMotes();
const par = { x: 0, y: 0, tx: 0, ty: 0 }; let tilt0 = null; // parallax, see the end
let air = 0, roomLit = 0; // 0..1 while the door swings in: the corridor's air follows it into the room
function stepMotes(dt, sp) {
  for (const m of motes) {
    const t = m.s + mtime * 0.18;
    m.X += (n1(t, 1 + m.s) * 0.009 + 0.0015 + air * n1(t * 3, 7 + m.s) * 0.05) * dt * sp;
    m.d += (n1(t * 1.1, 3 + m.s) * 0.006 + air * 0.22 * (0.6 + 0.4 * vn(m.s, 2.2))) * dt * sp;
    m.h += (n1(t * 0.9, 5 + m.s) * 0.004 + 0.0022 + air * 0.035 * n1(t * 2, 11 + m.s)) * dt * sp; // the warm air rises a little
    if (m.h > 0.17) { m.h = 0.004; m.X = (vn(m.s, mtime) * 2 - 1) * 0.6; }
    if (m.X > 0.64) m.X = -0.64; if (m.X < -0.64) m.X = 0.64;
    if (m.d < 0.003) m.d = 0.003; if (m.d > (state === 'win' ? 1.2 : 0.32)) m.d = state === 'win' ? 1.2 : 0.004;
    if (m.h < 0.002) m.h = 0.002;
  }
  for (let i = puffs.length - 1; i >= 0; i--) { // the settle's little puff: thrown out, slowed by the air, sinking
    const p = puffs[i], dr = Math.exp(-dt * 2.2); p.vX *= dr; p.vd *= dr; p.vh = p.vh * dr - 0.004 * dt;
    p.X += p.vX * dt; p.d += p.vd * dt; p.h = Math.max(0.001, p.h + p.vh * dt); p.age += dt;
    if (p.age > p.life) puffs.splice(i, 1);
  }
}
const puffs = [];
let settleAt = 0, settled = 0;
function settle() { // once, the heavy door settles in its frame: a 1 px shift of the light and a breath of dust
  const r = mulberry(31), X0 = (r() * 2 - 1) * 0.28;
  for (let i = 0; i < 9; i++) puffs.push({ X: X0 + (r() - 0.5) * 0.06, d: 0.002, h: 0.002 + r() * 0.004, vX: (r() - 0.5) * 0.09, vd: 0.03 + r() * 0.08, vh: 0.01 + r() * 0.03, age: -r() * 0.12, life: 1.8 + r() * 1.4, sz: 0.5 + r() * 0.6 });
}
function drawMotes(lvl, cold, alphaAll) {
  ctx.globalCompositeOperation = 'lighter';
  for (const p of puffs) {
    if (p.age < 0) continue;
    const a = lvl * (1 - cold) * alphaAll * gapI(clamp(p.X, -0.44, 0.44)) * 0.9 * sstep(0, 0.15, p.age) * (1 - p.age / p.life) / (1 + (p.d * p.d + p.h * p.h) / 0.003);
    if (a < 0.01) continue;
    const s = DD / (DD - p.d), x = G.cx + G.fD * p.X * s, y = G.yh + G.fD * (HC - p.h) * s, r = p.sz * (G.fD / 540 + 0.5) * 1.5;
    ctx.globalAlpha = Math.min(1, a); ctx.drawImage(MOTE, x - r, y - r, 2 * r, 2 * r);
  }
  for (const m of near) { // a few motes close to us, far out of focus, barely lit
    const tt = mtime * 0.05 + m.s, X = m.X + 0.05 * n1(tt, 21), dd = m.d + 0.06 * n1(tt * 0.8, 23), hh = m.h + 0.04 * n1(tt * 0.7, 25);
    const a = alphaAll * (1 - cold) * (0.012 * lvl + 0.014 * roomLit) * (0.6 + 0.4 * n1(tt * 2, 27));
    if (a < 0.005) continue;
    const q = DD / (DD - dd), x = G.cx + G.fD * X * q, y = G.yh + G.fD * (HC - hh) * q, r = G.fD * 0.018 * q;
    ctx.globalAlpha = a; ctx.drawImage(BOKEH, x - r, y - r, 2 * r, 2 * r);
  }
  for (const m of motes) {
    const I = gapI(clamp(m.X, -HALF + 0.001, HALF - 0.001)) + 0.25 * gapI(clamp(m.X * 0.7, -0.44, 0.44));
    const r2 = m.d * m.d + (m.h - GAP * 0.5) * (m.h - GAP * 0.5);
    let a = (I * lvl) / (1 + r2 / 0.0022) + roomLit * 0.5 * sstep(0.45, 0.2, Math.abs(m.X - 0.1));
    a *= sstep(0.17, 0.12, m.h) * sstep(0.32 + 0.9 * roomLit, 0.24 + 0.9 * roomLit, m.d) * sstep(0.64, 0.5, Math.abs(m.X));
    a *= 0.62 + 0.38 * Math.sin(mtime * m.tw + m.ph);
    a *= (1 - cold) * alphaAll;
    if (a < 0.01) continue;
    const s = DD / (DD - m.d), x = G.cx + G.fD * m.X * s, y = G.yh + G.fD * (HC - m.h) * s;
    const r = m.sz * (G.fD / 540 + 0.5) * 1.25;
    ctx.globalAlpha = Math.min(1, a * 0.9); ctx.drawImage(MOTE, x - r, y - r, 2 * r, 2 * r);
  }
  ctx.globalAlpha = 1;
}

// ---------- state ----------
let state = 'idle', tCold = -1e9, tWin = 0, focus = 0, msgTimer = 0, lastT = now(), lvlK = 0, pulse = 0, mtime = 0;
const births = [], ghosts = [];
let prev = '';
wordEl.addEventListener('input', () => {
  const v = [...wordEl.value], o = [...prev], t = now();
  let i = 0; while (i < v.length && i < o.length && v[i] === o[i]) i++;
  for (let j = v.length; j < o.length; j++) ghosts.push({ x: beadX(j, o.length), t0: t, cold: 0 });
  births.length = v.length; for (let j = i; j < v.length; j++) births[j] = t;
  if (v.length > o.length) pulse = Math.min(1, pulse + 0.55);
  prev = wordEl.value; kick();
});
['focus', 'blur', 'keyup', 'select', 'click'].forEach((e) => wordEl.addEventListener(e, () => { fitKeyboard(); kick(); }));
function wrong() {
  const t = now(), n = [...wordEl.value].length;
  for (let j = 0; j < n; j++) ghosts.push({ x: beadX(j, n), t0: t + j * 0.04, cold: 1 });
  wordEl.value = ''; prev = ''; births.length = 0; tCold = t; wGoneWrong(t);
  msg.textContent = 'Это слово не открывает'; msg.classList.add('on');
  clearTimeout(msgTimer); msgTimer = setTimeout(() => { msg.classList.remove('on'); kick(); }, 8000);
  wordEl.focus(); kick(); if (RM) setTimeout(kick, 1700);
}
function win() {
  state = 'win'; tWin = now(); stage.classList.add('won');
  msg.classList.remove('on'); clearTimeout(msgTimer);
  wordEl.blur(); wordEl.disabled = true;
  if (RM) { showOpen(); return; }
  start();
}
let openDone = null;
function showOpen() { state = 'open'; stop(); const f = openDone; openDone = null; if (f) f(); }

// ---------- the word on the line of light ----------
function beadGap(n) { return Math.min(L.fs * 0.95, (L.w * 0.78) / Math.max(1, n)); }
function beadX(j, n) { return L.cx + (j - (n - 1) / 2) * beadGap(n); }
function dot(x, y, r, c, a) {
  if (a <= 0.004 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(0.3, `rgba(${c},${a * 0.38})`); g.addColorStop(1, `rgba(${c},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function spaced(text, x, y, sp) {
  const ch = [...text], ws = ch.map((c) => ctx.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
  let px = x - tot / 2; ch.forEach((c, k) => { ctx.fillText(c, px, y); px += ws[k] + sp; });
}
// the slit: a horizontal gradient that follows the light along the gap (and the fire's slow wander)
// ---------- someone is home: human feet in the light under the door ----------
// The physics. The lamp is high in the room, behind whoever stands there. A foot planted on the floor near the gap
// cuts the light over its own width: close to the door the shadow is narrow, sharp and deep; farther back its
// penumbra widens and it grows shallow. A lifted foot's shadow softens and fades as it rises; it lands heel first
// (a narrow shadow), then flat. Each foot's shadow also runs out across the lit stone on our side, widening away
// from the lamp. The body takes a little of the room's light, and hides the keyhole when it stands in front of it.
// The gait. Feet alternate; the planted one stays exactly still; a step is ~0.6 s, irregular, slower at the end.
const prnd = mulberry(4242);
let tNow = 0, passNext = 0;
const LAMPX = 0.1, FOOT = 0.1, PST = { swing: 0.42 }; // half the gap between the feet; swing share of a step
const W = { final: false, on: false, mode: '', vis: 0, feet: [{ x: 0, z: 2, h: 0, tL: -9 }, { x: 0, z: 2, h: 0, tL: -9 }], sw: -1, t0: 0, dur: 0.6, from: null, to: null,
  next: 0, tx: 0, tz: 2.4, cross: 0, dirx: 1, plan: [], leave: 0, shift: prnd() * 6 };
const zFor = (n) => (W.final ? 0.15 : n <= 0 ? 1.6 : 0.3 + 1.3 * Math.pow(0.62, n)); // metres behind the door
function wCenter() { const a = W.feet[0], b = W.feet[1]; return [(a.x + b.x) / 2, (a.z + b.z) / 2]; }
let FLK = 0.97;
function newPrint(side) { // seeded per step (never per frame): a shoe, not a rectangle
  const r = mulberry(DS * 1009 + (W.stepN = (W.stepN || 0) + 1) * 7919 + 13);
  return { side, w: 0.09 + 0.03 * r(), L: 0.24 + 0.05 * r(), ang: (8 + 7 * r()) * Math.PI / 180, heel: 0.88 + 0.12 * r(), toe: 0.86 + 0.14 * r(), arch: 0.004 + 0.014 * r(),
    round: 0.5 + 0.5 * r(), dx: (r() - 0.5) * 0.06, dz: (r() - 0.5) * 0.03, scuff: r() < 0.25 ? (r() < 0.5 ? -1 : 1) * (0.01 + 0.01 * r()) : 0, n: r() * 100, roll: r() };
}
function wPlace(x, z, cross) { // stand still at (x, z), feet side by side
  W.cross = cross; W.sw = -1;
  W.feet[0] = cross ? { x: x - 0.05, z: z - 0.01, h: 0, tL: -9 } : { x: x - FOOT, z, h: 0, tL: -9 };
  W.feet[1] = cross ? { x: x + 0.05, z: z + 0.01, h: 0, tL: -9 } : { x: x + FOOT, z: z + 0.012, h: 0, tL: -9 };
  W.feet[0].p = newPrint(-1); W.feet[1].p = newPrint(1);
}
function wGo(tx, tz, cross) { W.tx = tx; W.tz = tz; W.cross = cross; }
function startPass(t) { // someone crossing the room, not coming to the door
  const d = prnd() < 0.5 ? -1 : 1, z = 0.75 + prnd() * 0.4;
  W.on = true; W.mode = 'pass'; W.vis = 1; W.dirx = d; wPlace(-d * 1.35, z, 1); wGo(d * 1.45, z + (prnd() - 0.5) * 0.1, 1); W.next = t;
}
function wStep(t) { // plan the next footstep toward the target
  const [cx, cz] = wCenter(), dx = W.tx - cx, dz = W.tz - cz, dist = Math.hypot(dx, dz);
  const a = W.feet[0], b = W.feet[1], apart = W.cross ? Math.abs(a.x - b.x) : Math.abs(a.z - b.z);
  if (dist < 0.035 && apart < 0.03 && !(W.tokens > 0)) return false;
  if (W.tokens > 0) W.tokens--;
  const ux = dist > 1e-4 ? dx / dist : 0, uz = dist > 1e-4 ? dz / dist : -1;
  // the trailing foot (farther behind along the way) swings
  const pa = (a.x - cx) * ux + (a.z - cz) * uz, pb = (b.x - cx) * ux + (b.z - cz) * uz, s = dist < 0.035 ? (pa < pb ? 0 : 1) : (pa < pb ? 0 : 1), st = W.feet[1 - s], f = W.feet[s];
  const back = !W.cross && uz > 0.3; // stepping back from the door: shorter, slower
  let len = Math.min(dist, W.cross ? 0.5 : back ? 0.3 : 0.46), dur = 0.64 * (1 + (prnd() - 0.5) * 0.24);
  const hurry = W.cross ? 0 : sstep(0.3, 0.9, dist) * sstep(0.25, 0.6, (W.lag || 0)); // behind the letters: quicker, shorter steps
  const near = !W.cross && dist < 0.75 && hurry < 0.3; if (near) { len = Math.min(dist, 0.27); dur += 0.16; } // the last steps: short, slower
  if (hurry > 0) { len = Math.min(dist, mix(len, 0.34, hurry)); dur = mix(dur, 0.36, hurry); }
  let lx, lz;
  if (W.cross) { lx = st.x + ux * Math.max(len, 0.05) * 1.0 + (prnd() - 0.5) * 0.02; lz = cz + (s === 0 ? -0.05 : 0.05) + (prnd() - 0.5) * 0.015; if (dist < 0.035) lx = st.x + (s === 0 ? -0.1 : 0.1); }
  else {
    const side = s === 0 ? -1 : 1, along = dist < 0.035 ? 0 : len;
    lx = cx + ux * along + side * FOOT + (prnd() - 0.5) * 0.018;
    lz = (dist < 0.035 ? st.z : st.z + uz * along) + (prnd() - 0.5) * 0.01;
    if (uz < 0) lz = Math.max(lz, W.tz - 0.015); else if (uz > 0) lz = Math.min(lz, W.tz + 0.015); // never past the place they mean to stand
    if (dist < 0.035 || Math.abs(W.tz - lz) < 0.05) lz = W.tz + (prnd() - 0.5) * 0.012; // close the feet at the stop
  }
  if (!W.final && hurry < 0.2 && !W.cross && dist > 0.12 && prnd() < 0.1) { len *= 0.5; lz = st.z + uz * len; } // a half step
  const print = newPrint(W.cross ? (s === 0 ? -1 : 1) : (s === 0 ? -1 : 1));
  if (!W.final) { lx += print.dx * 0.5; lz += print.dz * 0.5; } // where a foot lands is never exactly planned
  if (W.final) dur = 0.36; // the last step to the door: quick and short
  W.pause = !W.final && hurry < 0.2 && prnd() < 0.12 ? 0.3 + prnd() * 0.35 : 0; // a breath between steps, sometimes
  W.toP = print;
  W.sw = s; W.t0 = t; W.dur = dur; W.swing = hurry > 0.3 || W.final ? 0.55 : PST.swing; W.from = { x: f.x, z: f.z }; W.to = { x: lx, z: lz };
  return true;
}
function wUpdate(t, n) {
  // the story: passers-by when nothing happens; at the first letter someone comes; a letter = a step closer
  if (state === 'idle') {
    if (n > 0 && W.mode !== 'come') {
      if (!(W.on && W.mode === 'pass' && Math.abs(wCenter()[0]) < 0.8)) { W.on = true; W.vis = 0; wPlace(0.12 + prnd() * 0.08, 1.75, 0); W.vis = 0.35; }
      W.mode = 'come'; W.cross = 0; W.leave = 0; W.lastN = 0; W.tokens = 0;
    }
    if (W.mode === 'come') {
      if (n > 0) { if (W.lastN !== undefined && n !== W.lastN) W.tokens = Math.min(3, (W.tokens || 0) + 1); W.lastN = n; wGo(0.17, zFor(n), 0); W.leave = t + 12; } // toward the latch side, where the handle is
      else if (W.plan.length === 0) { wGo(0.17, zFor(0), 0); if (t > W.leave && W.sw < 0) { W.mode = 'leave'; const d = prnd() < 0.5 ? -1 : 1; W.plan = [[d * 1.5, 2.2, 1]]; } }
    }
    if (W.mode === 'pass' && W.sw < 0 && Math.abs(wCenter()[0]) > 1.38) W.on = false;
    if (W.mode === 'leave' && Math.abs(wCenter()[0]) > 1.38) W.on = false;
    if (!W.on && t > passNext && n === 0) { startPass(t); passNext = t + 40 + prnd() * 50; }
  }
  { const [lx, lz] = wCenter(); W.lag = Math.hypot(W.tx - lx, W.tz - lz) / 0.75; }
  if (W.plan.length && W.sw < 0 && Math.hypot(W.tx - wCenter()[0], W.tz - wCenter()[1]) < 0.06) { const p = W.plan.shift(); wGo(p[0], p[1], p[2]); }
  if (RM && !W.on && state === 'idle') { W.on = true; W.mode = 'still'; } // reduced motion: someone stands a little way in, quietly
  if (!W.on) return;
  if (RM) { // reduced motion: states only — the feet are where they would stand
    const z = W.mode === 'come' ? zFor(n) : 0.8; wPlace(0.17, z, 0); W.vis = 1; return;
  }
  W.vis = Math.min(1, W.vis + 0.02);
  if (W.sw >= 0) {
    const sd = W.dur * (W.swing || PST.swing), u = clamp((t - W.t0) / sd, 0, 1), e = u * u * (3 - 2 * u), f = W.feet[W.sw];
    f.x = mix(W.from.x, W.to.x, e); f.z = mix(W.from.z, W.to.z, e); f.h = 0.07 * Math.pow(Math.sin(Math.PI * u), 0.8);
    if (u >= 1 && f.tL < W.t0) { f.h = 0; f.tL = t; if (W.toP) { f.p = W.toP; W.toP = null; } }
    if (t - W.t0 >= W.dur) W.sw = -1;
  } else if (t >= W.next) { if (wStep(t)) W.next = t + W.dur + (W.pause || 0); }
}
function wGoneWrong(t) { // the word didn't open: a step back, a turn, and the steps recede into the room
  if (!W.on || W.mode !== 'come') return;
  const [cx, cz] = wCenter(), d = cx < 0.1 ? -1 : 1;
  W.mode = 'leave'; W.plan = [[d * 1.5, Math.max(cz + 0.9, 1.6), 1]]; wGo(cx, cz + 0.32, 0); W.next = t + 0.35;
}
// one foot's shadow on the gap: a few blurred blocks [x0, x1, softness left, softness right, depth, z]
function footShadow(f, t, k) {
  if (!W.on || W.vis <= 0 || !f.p) return [];
  const p = f.p, side = p.side, sa = Math.sin(p.ang), ca = Math.cos(p.ang);
  const lift = f.h, sinceL = t - f.tL, heel = sinceL >= 0 && sinceL < 0.09;
  // a scuff: sometimes the foot slides a centimetre or two as the weight comes onto it
  const sx = p.scuff && sinceL >= 0 ? p.scuff * (1 - Math.exp(-sinceL / 0.05)) : 0;
  // which part is on the floor: on a swing the heel lifts first, then the toe; on landing the heel comes down first
  let hOn = 1, tOn = 1;
  if (W.sw === k) { const u = clamp((t - W.t0) / (W.dur * (W.swing || PST.swing)), 0, 1); hOn = 1 - sstep(0, 0.2, u); tOn = 1 - sstep(0.1, 0.35, u); }
  else if (W.sw >= 0 && W.sw !== k && W.next - t < 0.15) hOn = 1 - 0.35 * sstep(0.15, 0, W.next - t) * p.roll; // the planted foot rolls before it goes
  if (heel) tOn *= 0.3;
  const land = sinceL >= 0 ? Math.exp(-sinceL / 0.16) : 0, shift = W.sw < 0 ? Math.sin(t * 1.7 + W.shift + (k ? Math.PI : 0)) : 0;
  const zc = Math.max(0.04, f.z), zt = Math.max(0.03, zc - 0.25 * p.L * ca), zh = zc + 0.3 * p.L * ca;
  const dep = (z) => 1.1 * Math.exp(-(z - 0.05) / 1.8) * Math.exp(-lift / 0.028) * (1 + 0.3 * land) * (1 + 0.05 * shift) * W.vis;
  const sg = (z) => (0.004 + 0.036 * z + 0.5 * lift) * (1 - 0.3 * land) * (1 - 0.04 * shift) * (1 + 1.4 * (0.97 - FLK)); // the flame's flicker breathes in the penumbra
  const x = f.x + sx + (W.sw < 0 ? 0.003 * Math.sin(t * 0.9 + W.shift) : 0);
  if (W.cross) { const w = 0.22 + 0.06 * p.round; const sgv = sg(zc); return [[x - w / 2, x + w / 2, sgv * 1.1, sgv * 0.9, Math.min(0.95, dep(zc)) * (0.6 + 0.4 * tOn), zc]]; }
  // toe-out: the forefoot projects outward, the heel inward; the outer edge is the near, sharper one
  const xt = x + side * sa * p.L * 0.22, wt = p.w * (0.85 + 0.15 * p.round), xh = x - side * (sa * p.L * 0.25 + 0.17 * p.w + p.arch), wh = 0.62 * p.w;
  const st = sg(zt), sh = sg(zh), out = 0.7, inn = 1.35;
  const fore = [xt - wt / 2, xt + wt / 2, side < 0 ? st * out : st * inn, side < 0 ? st * inn : st * out, Math.min(0.95, dep(zt) * p.toe) * tOn, zt];
  const heelB = [xh - wh / 2, xh + wh / 2, sh, sh, Math.min(0.97, dep(zh) * p.heel) * hOn, zh];
  return [fore, heelB];
}
let SH = [], SF = [];
function unionB(bs) { // one streak per foot on our stone: the whole shoe's extent, the sharper block's edges, the deeper block's depth
  bs = bs.filter((b) => b[4] > 0.01); if (!bs.length) return null;
  const s0 = bs.reduce((m, b) => (b[4] > m[4] ? b : m), bs[0]);
  return [Math.min(...bs.map((b) => b[0])), Math.max(...bs.map((b) => b[1])), s0[2], s0[3], Math.max(...bs.map((b) => b[4])), s0[5]];
}
function feetAt(X) { // what the shoes alone let through
  let s = 1;
  for (const h of SH) { if (h[4] < 0.004) continue; const c = 0.5 * (Math.tanh((X - h[0]) / h[2] * 1.15) - Math.tanh((X - h[1]) / h[3] * 1.15)); s *= 1 - h[4] * c; }
  return s;
}
function shadeAt(X) {
  let s = feetAt(X);
  const de = distEnv(tNow); if (de > 0) { const xd = DIST.dir * mix(-0.9, 0.9, (tNow - DIST.t0) / DIST.dur); s *= 1 - 0.12 * de * Math.exp(-(((X - xd) / 0.55) ** 2)); }
  if (W.on && W.mode !== 'pass') { const [cx, cz] = wCenter(), cl = sstep(1.6, 0.35, cz) * W.vis; s *= 1 - 0.1 * cl * Math.exp(-(((X - cx) / (0.3 + 0.2 * cz)) ** 2)); }
  return s;
}
function leakDim() { if (!W.on) return 1; const cz = wCenter()[1]; return 1 - 0.09 * sstep(1.4, 0.3, cz) * W.vis; } // the body takes some of the room's light
function torsoOverKeyhole() { if (!W.on) return 0; const [cx, cz] = wCenter(); return sstep(0.32, 0.12, Math.abs(KH.X - cx)) * sstep(1.3, 0.4, cz) * W.vis; }
function drawStreaks(lvl) { // each foot's shadow runs out across the lit stone — soft, uneven, never a clean wedge
  if (!W.on) return;
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.beginPath(); ctx.rect(0, G.y - G.gapPx, vw, G.yA - G.y + G.gapPx); ctx.clip();
  const N = 22, dEnd = 0.22, K = 11;
  for (const h of SF) {
    if (h[4] < 0.03) continue;
    const xc = (h[0] + h[1]) / 2, hw = (h[1] - h[0]) / 2, seed = xc * 37 + h[5] * 11;
    const f1 = 0.45 + 0.25 * vn(seed, 1.9), f2 = 0.12 + 0.2 * vn(seed + 4, 2.7); // it fades unevenly
    for (let i = 0; i < N; i++) {
      const d0 = (i / N) * dEnd, d1 = ((i + 1) / N) * dEnd, d = (d0 + d1) / 2, q = d / dEnd;
      // fade: steep near the gap, then an uneven tail
      const fade = q < 0.1 ? 1 : q < 0.38 ? mix(1, f1 * 0.45, sstep(0.1, 0.38, q)) : f1 * 0.45 * (1 - sstep(0.38, 1, q)); // dense under the gap, gone by a third of the way, a thin uneven tail
      const al = 0.82 * h[4] * lvl * fade * (0.9 + 0.2 * vn(seed + d * 40, 5.3)); if (al < 0.004) continue;
      const spread = 1 + d * (0.7 + 0.5 * vn(seed + d * 9, 3.3)); // an area light: the penumbra grows, unevenly
      const rough = (u) => 0.007 * (vn(u * 90 + seed, d * 60 + 1) - 0.5) + 0.004 * (vn(u * 330, d * 330 + 7) - 0.5); // the stone's relief breaks the edge
      const cxd = xc + (xc - LAMPX) * d * 0.5;
      const xl = cxd - hw * spread + rough(cxd - hw), xr = cxd + hw * spread + rough(cxd + hw + 3);
      const pl = h[2] * (0.8 + 0.7 * vn(seed + d * 14, 7.1)) + d * 0.06, pr = h[3] * (0.8 + 0.7 * vn(seed + 2 + d * 14, 7.9)) + d * 0.06;
      const a0 = xl - 2.2 * pl, a1 = xr + 2.2 * pr, y0 = Math.round(d0 ? fy(d0, 0) : G.y - G.gapPx), y1 = Math.round(fy(d1, 0)); if (y1 <= y0) continue; // whole-pixel bands: no seams
      const g = ctx.createLinearGradient(fx(a0, d), 0, fx(a1, d), 0);
      for (let k = 0; k <= K; k++) {
        const X = mix(a0, a1, k / K), c = 0.5 * (Math.tanh((X - xl) / pl * 1.2) - Math.tanh((X - xr) / pr * 1.2));
        const w = clamp(c, 0, 1), cr = Math.round(mix(132, 118, w)), cg = Math.round(mix(70, 46, w)), cb = Math.round(mix(34, 12, w)); // a cooler penumbra, a warmer core
        g.addColorStop(k / K, `rgba(${cr},${cg},${cb},${(al * c).toFixed(4)})`);
      }
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(fx(a0, d0), y0); ctx.lineTo(fx(a1, d0), y0); ctx.lineTo(fx(a1, d1), y1); ctx.lineTo(fx(a0, d1), y1); ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}
function stopQs() { // where the strip gradients sample: evenly, and densely through every notch the feet cut
  const qs = []; for (let i = 0; i <= 26; i++) qs.push(i / 26);
  for (const h of SH) {
    if (h[4] < 0.02) continue;
    const a = h[0] - 2.5 * h[2], b = h[1] + 2.5 * h[3], n = Math.min(40, Math.ceil((b - a) / 0.006));
    for (let i = 0; i <= n; i++) { const q = (mix(a, b, i / n) / (HALF * 0.999) + 1) / 2; if (q > 0 && q < 1) qs.push(q); }
  }
  qs.sort((u, v) => u - v); const out = [qs[0]]; for (const q of qs) if (q - out[out.length - 1] > 0.0015) out.push(q);
  if (out[out.length - 1] < 1) out.push(1); return out;
}
let QS = [0, 1];
function stripGrad(c2, x0, x1, core, a, bal, ox) {
  const g = c2.createLinearGradient(x0 - (ox || 0), 0, x1 - (ox || 0), 0);
  for (const q of QS) {
    const X = (q - 0.5) * 2 * HALF * 0.999, v = gapI(X) * (1 + bal * (q - 0.5) * 2) * shadeAt(X) * (1 + 0.16 * (vn(X * 36 + 5, 4.4) * 2 - 1));
    g.addColorStop(q, `rgba(${core},${clamp(a * v, 0, 1)})`);
  }
  return g;
}
// the light that falls out of the gap onto the threshold: a short bright fan, sharp where it leaves the door, soft far edge
let fanC = null, fanM = null, fanKey = '';
function drawFan(a, bal, core) {
  const W = Math.ceil(G.dw * 1.12), H = Math.ceil(Math.max(14, G.fD * 0.07)), key = W + 'x' + H;
  if (fanKey !== key) {
    fanKey = key; fanC = mkCanvas(W, H); fanM = mkCanvas(W, H);
    const m = fanM.getContext('2d'), vg = m.createLinearGradient(0, 0, 0, H);
    vg.addColorStop(0, 'rgba(255,255,255,1)'); vg.addColorStop(0.08, 'rgba(255,255,255,.72)'); vg.addColorStop(0.3, 'rgba(255,255,255,.3)'); vg.addColorStop(0.65, 'rgba(255,255,255,.08)'); vg.addColorStop(1, 'rgba(255,255,255,0)');
    m.fillStyle = vg; m.fillRect(0, 0, W, H);
    // the fan spreads a little sideways as it falls toward us
    m.globalCompositeOperation = 'destination-in'; const hg = m.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(0.06, 'rgba(0,0,0,1)'); hg.addColorStop(0.94, 'rgba(0,0,0,1)'); hg.addColorStop(1, 'rgba(0,0,0,0)'); m.fillStyle = hg; m.fillRect(0, 0, W, H);
  }
  const f = fanC.getContext('2d'), x0 = G.cx - W / 2;
  f.globalCompositeOperation = 'copy'; f.fillStyle = stripGrad(f, L.x0, L.x1, core, a, bal, x0); f.fillRect(0, 0, W, H);
  f.globalCompositeOperation = 'destination-in'; f.drawImage(fanM, 0, 0);
  ctx.drawImage(fanC, x0, G.y, W, H);
}
function slit(y, hgt, core, a, bal, x0, x1, wave) {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  for (const q of QS) {
    const X = (q - 0.5) * 2 * HALF * 0.999, v = gapI(X) * (1 + bal * (q - 0.5) * 2) * shadeAt(X) * (1 + 0.16 * (vn(X * 36 + 5, 4.4) * 2 - 1));
    g.addColorStop(q, `rgba(${core},${clamp(a * v, 0, 1)})`);
  }
  ctx.fillStyle = g;
  if (!wave) { ctx.fillRect(x0, y - hgt / 2, x1 - x0, hgt); return; }
  // the door doesn't sit perfectly flat: the core is a touch thicker here, thinner there
  const M = 28; ctx.beginPath();
  for (let i = 0; i <= M; i++) { const q = i / M, X = (q - 0.5) * 2 * HALF, th = hgt * (0.72 + 0.56 * vn(X * 4.5 + 2.2, 1.3)); ctx.lineTo(x0 + q * (x1 - x0), y - th * 0.5); }
  for (let i = M; i >= 0; i--) { const q = i / M, X = (q - 0.5) * 2 * HALF, th = hgt * (0.72 + 0.56 * vn(X * 4.5 + 2.2, 1.3)); ctx.lineTo(x0 + q * (x1 - x0), y + th * 0.5); }
  ctx.closePath(); ctx.fill();
}
// the keyhole at handle height: a tiny warm hole, its beam falling toward us through dusty air
const KH = { X: 0.355, h: 0.86 };
const khDust = Array.from({ length: 7 }, (_, i) => ({ s: i * 13.7 + 3, r: 0.4 + 0.6 * ((i * 0.618) % 1) }));
function drawKeyhole(a, x, y, s) {
  if (a < 0.01) return;
  const rr = Math.max(1.3, 0.0048 * s), sw = Math.max(1, 0.0022 * s), sl = 0.011 * s;
  ctx.globalCompositeOperation = 'lighter';
  // the beam: light from a lamp inside, falling out and down toward us — only the dust in it shows
  const hz = RM ? 0 : n1(mtime * 0.083 + 1.7, 14), sway = RM ? 0 : 0.014 * s * n1(mtime * 0.051 + 9.1, 15);
  const len = 0.32 * s * (1 + 0.08 * hz), bg = ctx.createLinearGradient(0, y, 0, y + len), ha = a * (1 + 0.25 * hz);
  bg.addColorStop(0, `rgba(255,186,118,${0.11 * ha})`); bg.addColorStop(0.35 + 0.1 * hz, `rgba(255,176,104,${0.04 * ha})`); bg.addColorStop(1, 'rgba(255,170,100,0)');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - rr * 0.7, y); ctx.lineTo(x + rr * 0.7, y); ctx.lineTo(x + 0.05 * s + sway, y + len); ctx.lineTo(x - 0.03 * s + sway, y + len); ctx.closePath(); ctx.fill();
  for (const m of khDust) { // a few motes turning in the beam
    const q = (mtime * 0.05 * m.r + m.s * 0.137) % 1, dy = q * len * 0.8, dx = (n1(mtime * 0.2 + m.s, 9) * 0.5 + 0.1) * (0.004 + 0.06 * q) * s;
    const al = a * 0.55 * (1 - q) * sstep(0, 0.08, q) * (0.5 + 0.5 * Math.sin(mtime * (1.3 + m.r) + m.s));
    if (al > 0.02) { ctx.globalAlpha = al; ctx.drawImage(MOTE, x + dx - 1.6, y + dy + rr - 1.6, 3.2, 3.2); }
  }
  ctx.globalAlpha = 1;
  dot(x, y + rr * 0.6, 0.03 * s, '255,160,90', 0.16 * a);   // scatter around the hole
  dot(x, y + rr * 0.6, 0.009 * s, '255,206,150', 0.4 * a);
  // the escutcheon: a dark bronze oval whose rim catches that glow
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = `rgba(170,118,72,${0.22 * a})`; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.ellipse(x, y + rr * 0.8, 0.013 * s, 0.032 * s, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
  // the hole: round head, tapering slot
  ctx.fillStyle = `rgba(255,232,196,${Math.min(1, 1.1 * a)})`; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.2832); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - sw * 0.5, y); ctx.lineTo(x + sw * 0.5, y); ctx.lineTo(x + sw * 0.85, y + sl); ctx.lineTo(x - sw * 0.85, y + sl); ctx.closePath(); ctx.fill();
}

// ---------- the swing ----------
const THETA = (94 * Math.PI) / 180, LEAF = 2 * HALF, THICK = 0.045;
function swing(tw) { // a heavy door: a beat of resistance as the latch lets go, then a long ease-out, no bounce
  if (tw < 0) return { f: 0, v: 0, c: 1, s: 0, th: 0, Xa: HALF };
  const u = clamp((tw - 0.22) / 1.95, 0, 1), us = Math.pow(u, 1.45), f = 1 - Math.pow(1 - us, 2.7);
  const u2 = clamp((tw - 0.22 + 0.02) / 1.95, 0, 1), f2 = 1 - Math.pow(1 - Math.pow(u2, 1.45), 2.7);
  const th = THETA * f, c = Math.cos(th), s = Math.sin(th);
  // the leaf swings OUT, toward us. Seen from the lamp deep in the room (0, -3 m), its latch edge marks where
  // the leaf's shadow ends on the stone: the lit wedge spans door-plane X from Xa to the latch jamb
  const Xl = -HALF + LEAF * c, dl = LEAF * s, Xa = (Xl * 3) / (3 + dl);
  return { f: th / THETA, v: clamp((f2 - f) * 50 * 0.6, 0, 1), c, s, th, Xa };
}
function leafPt(sAlong, h, sw, back) { // a point of the leaf: sAlong metres from the hinge, h metres up
  let X = -HALF + sAlong * sw.c, d = sAlong * sw.s;
  if (back) { X += THICK * sw.s; d -= THICK * sw.c; }
  const q = DD / (DD - d);
  return [G.cx + G.fD * X * q, G.yh + G.fD * (HC - h) * q, q];
}
function quad(a, b, c2, d2) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(d2[0], d2[1]); ctx.closePath(); }
function oakSlices(sw, back, hBase) {
  const M2 = 28, ohh = OAK.height;
  for (let i = 0; i < M2; i++) {
    const s0 = (LEAF * i) / M2, s1 = (LEAF * (i + 1)) / M2, p0 = leafPt(s0, hBase, sw, back), p1 = leafPt(s1, hBase, sw, back), q = (p0[2] + p1[2]) / 2, hgt = 2.15 * G.fD * q;
    const x = Math.min(p0[0], p1[0]), wd = Math.abs(p1[0] - p0[0]) + 0.5;
    ctx.drawImage(OAK, (OAK.width * i) / M2, 0, OAK.width / M2, ohh, x, Math.max(p0[1], p1[1]) - hgt, wd, hgt);
  }
}
function drawLeaf(R, sw, fin, flood) {
  const H2 = 2.15, hb = GAP; // the leaf's foot clears the threshold by the gap
  const b0 = leafPt(0, hb, sw), b1 = leafPt(LEAF, hb, sw), t1 = leafPt(LEAF, H2, sw), t0 = leafPt(0, H2, sw);
  // which face do we see? the corridor face until the leaf passes our line of sight, then its room face, lit by the room
  const mX = -HALF + 0.45 * sw.c, mD = 0.45 * sw.s, front = (-sw.s) * (0 - mX) + sw.c * (DD - mD) > 0;
  const Xl = -HALF + LEAF * sw.c, dl = LEAF * sw.s, edgeVis = sw.c * (0 - Xl) + sw.s * (DD - dl) > 0;
  ctx.save(); ctx.globalAlpha = 1;
  if (front) {
    // the corridor face: dark oak; the flooded stone below lights its lower part warm, falling off upward
    quad(b0, b1, t1, t0); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fill();
    ctx.save(); ctx.clip();
    const wf = sstep(0.05, 0.7, sw.f), yb = Math.max(b0[1], b1[1]), bg = ctx.createLinearGradient(0, yb, 0, yb - G.fD * 1.2);
    bg.addColorStop(0, `rgba(96,60,34,${0.3 * wf})`); bg.addColorStop(0.3, `rgba(60,36,20,${0.14 * wf})`); bg.addColorStop(1, 'rgba(30,18,10,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = bg; ctx.fillRect(Math.min(b0[0], b1[0], t0[0], t1[0]) - 4, -60, Math.abs(b1[0] - b0[0]) + Math.abs(t1[0] - t0[0]) + 8, vh + 120);
    if (OAK) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.5; oakSlices(sw, false, hb); ctx.globalAlpha = 1; }
    // its lit foot (plate, grain) carried in perspective, slice by slice
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fin * (1 - sstep(0, 0.3, sw.f));
    const N = 32, rows = (G.y - G.ry0) * R.rs;
    for (let i = 0; i < N; i++) {
      const s0 = (LEAF * i) / N, s1 = (LEAF * (i + 1)) / N, p0 = leafPt(s0, 0, sw), p1 = leafPt(s1, 0, sw), q = (p0[2] + p1[2]) / 2;
      const sx = (G.cx + G.fD * (-HALF + s0)) * R.rs, swd = (G.fD * (s1 - s0)) * R.rs, hgt = (G.y - G.ry0) * q;
      ctx.drawImage(R.B, sx, 0, swd, rows, Math.min(p0[0], p1[0]), Math.max(p0[1], p1[1]) - hgt, Math.abs(p1[0] - p0[0]) + 0.5, hgt);
    }
    ctx.restore();
  } else {
    // the room face, now turned to us: lit by the room, brighter toward its free edge
    const c0 = leafPt(0, hb, sw, true), c1 = leafPt(LEAF, hb, sw, true), u1 = leafPt(LEAF, H2, sw, true), u0 = leafPt(0, H2, sw, true);
    quad(c0, c1, u1, u0); ctx.save(); ctx.clip();
    // only spill reaches it: warm near the doorway (the hinge end), falling to near-black toward its free end
    const lg = ctx.createLinearGradient(c0[0], 0, c1[0], 0); lg.addColorStop(0, 'rgb(58,36,21)'); lg.addColorStop(0.35, 'rgb(26,16,9)'); lg.addColorStop(1, 'rgb(9,6,4)');
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = lg; ctx.fillRect(Math.min(c0[0], c1[0]) - 4, -60, Math.abs(c1[0] - c0[0]) + 8, vh + 120);
    if (OAK) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.5; oakSlices(sw, true, hb); ctx.globalAlpha = 1; }
    ctx.restore();
  }
  // the latch edge turns to us first and catches the room's light
  if (edgeVis) {
    const e0 = leafPt(LEAF, hb, sw, true), e1 = leafPt(LEAF, H2, sw, true);
    ctx.globalCompositeOperation = 'source-over';
    const eg = ctx.createLinearGradient(0, G.y, 0, 0); eg.addColorStop(0, 'rgb(92,58,34)'); eg.addColorStop(0.6, 'rgb(62,40,24)'); eg.addColorStop(1, 'rgb(36,23,14)');
    ctx.fillStyle = eg; quad(b1, e0, e1, t1); ctx.fill();
    ctx.fillStyle = 'rgba(255,228,190,.8)'; ctx.fillRect(Math.round(Math.max(e0[0], b1[0])) - 0.5, -60, 1, Math.min(e0[1], b1[1]) + 60); // the rim nearest the doorway's light
  }
  // the light under the door rides the leaf's bottom edge as it lifts off toward us, then drowns in the room's light
  const sl = 1 - sstep(0.12, 0.45, sw.f);
  if (sl > 0.01) {
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = sl; ctx.lineCap = 'butt';
    const g0 = leafPt(0, 0, sw), g1 = leafPt(LEAF, 0, sw);
    ctx.strokeStyle = 'rgba(255,150,70,.4)'; ctx.lineWidth = Math.max(2, G.gapPx * 1.8); ctx.beginPath(); ctx.moveTo(g0[0], (g0[1] + b0[1]) / 2); ctx.lineTo(g1[0], (g1[1] + b1[1]) / 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,236,206,.95)'; ctx.lineWidth = Math.max(1, G.gapPx * 0.6); ctx.beginPath(); ctx.moveTo(g0[0], (g0[1] + b0[1]) / 2); ctx.lineTo(g1[0], (g1[1] + b1[1]) / 2); ctx.stroke();
  }
  ctx.restore(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter';
}
// ---------- frame ----------
const WIN = 3.5;
let running = false, raf = 0, fpsN = 0;
function flicker(t) { // a lamp, or a small fire, lives inside: slow, irregular, never a sine
  const a = 0.5 * n1(t * 0.47, 1) + 0.3 * n1(t * 1.6, 2) + 0.2 * n1(t * 4.1, 3);
  const ev = sstep(0.5, 0.85, n1(t * 0.13, 4)), dip = ev * Math.max(0, n1(t * 6.3, 5));
  // and it breathes: a slow, irregular swell (periods ~9 s and ~14 s, never in step), ±7 %
  const breath = RM ? 0 : 0.6 * n1(t / 9.3 + 2.1, 11) + 0.4 * n1(t / 13.7 + 5.3, 12);
  return clamp((0.935 + 0.05 * a - 0.07 * dip) * (0.94 + 0.065 * breath) * distDip(t), 0.72, 1);
}
// now and then (every 20–40 s) someone far inside crosses the lamp: no feet, only the room's light dipping softly
const DIST = { t0: -99, dur: 4, dir: 1, next: 25 };
function distEnv(t) { const q = (t - DIST.t0) / DIST.dur; return q > 0 && q < 1 ? Math.sin(Math.PI * q) ** 2 : 0; }
function distDip(t) { return 1 - 0.1 * distEnv(t); }
function draw() {
  const t = now(), dt = Math.min(0.05, Math.max(0, t - lastT)); lastT = t; fpsN++; tNow = t;
  const live = !RM, ae = wordEl.focused ? wordEl : null;
  focus += ((ae === wordEl ? 1 : 0) - focus) * (live ? Math.min(1, dt * 7) : 1);
  const n = [...wordEl.value].length;
  // light level follows the word: each letter a little stronger and warmer
  const kT = 1 - Math.exp(-n / 3.2);
  lvlK += (kT - lvlK) * (live ? Math.min(1, dt * 2.4) : 1);
  pulse *= live ? Math.exp(-dt / 0.45) : 0;
  const ca = t - tCold;
  const cold = ca < 0 ? 0 : RM ? (msg.classList.contains('on') && ca < 1.6 ? 1 : 0) : ca < 0.12 ? ca / 0.12 : ca < 1.25 ? 1 : Math.max(0, 1 - (ca - 1.25) / 2.6);
  const coldE = cold * cold * (3 - 2 * cold);
  const w = state === 'win' ? (t - tWin) / WIN : -1;
  if (live && state === 'idle' && t > DIST.next && !(W.on && W.mode !== 'pass')) { /* never while someone stands at the door */ DIST.t0 = t; DIST.dur = 3.2 + prnd() * 1.6; DIST.dir = prnd() < 0.5 ? -1 : 1; DIST.next = t + 20 + prnd() * 20; }
  // the warmth drifts along the gap, as if the lamp's light moved across the room (two slow, unrelated drifts)
  const fl = live ? flicker(t) : 0.97, bal = live ? 0.07 * n1(t * 0.31, 6) + 0.06 * n1(t * 0.067 + 3.7, 13) : 0; FLK = fl;
  const k = clamp(lvlK + 0.22 * pulse, 0, 1);
  wUpdate(t, n); { const f0 = footShadow(W.feet[0], t, 0), f1 = footShadow(W.feet[1], t, 1); SH = f0.concat(f1); SF = [unionB(f0), unionB(f1)].filter(Boolean); QS = stopQs(); }
  mtime += dt * (1 + 0.8 * lvlK + 0.6 * pulse);
  if (live) stepMotes(dt, 1 + 0.9 * lvlK);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, vw, vh);
  const R = LAY, ry0 = G.ry0, rh = vh - ry0, fin = !R ? 0 : RM ? 1 : sstep(0, 0.8, t - tLay);
  // opening: a real hinged swing. Hinge on the left, latch (keyhole) on the right; the leaf turns into the room.
  const tw = w < 0 ? -1 : t - tWin, sw = swing(tw), rise = sw.f, push = w < 0 ? 0 : sstep(0, 1, w);
  const flood = w < 0 ? 0 : sstep(0, 1, sw.f) * 0.9 + 0.1 * sstep(2.0, 2.6, tw);
  air = sw.v; roomLit = sw.f;
  par.x += (par.tx * (1 - sstep(0, 0.3, Math.max(0, w))) - par.x) * Math.min(1, dt * 3); par.y += (par.ty - par.y) * Math.min(1, dt * 3);
  const pdx = RM ? 0 : par.x * 2.2, pdy = RM ? 0 : par.y * 1.4, parF = RM ? 0 : par.x * 2.6; // px: the threshold is nearer than the door
  ctx.translate(pdx, pdy);
  if (push > 0) { const s = 1 + 0.05 * push; ctx.translate(G.cx, G.y); ctx.scale(s, s); ctx.translate(-G.cx, -G.y); }
  const warmW = (1 - coldE) * fl;
  const wA = warmW * (1 - k), wB = warmW * k + (w > 0 ? sstep(0, 0.2, w) * (1 - k) * fl : 0);
  ctx.globalCompositeOperation = 'lighter';
  if (fin < 1) drawCheap((1 - fin) * (warmW + 0.25 * k) + 0.3 * flood);
  const lay = (img, a) => { if (!R) return; a *= fin; if (a > 0.003) { ctx.globalAlpha = Math.min(1, a); // door plane and stone at different depths
    const sy0 = (G.y - ry0) * R.rs; ctx.drawImage(R[img], 0, 0, R.W, sy0, 0, ry0, vw, G.y - ry0); ctx.drawImage(R[img], 0, sy0, R.W, R.H - sy0, parF, G.y, vw, vh - G.y); } };
  if (!R) { /* the stone is still being cut */ }
  else if (rise <= 0) { lay("A", w > 0 ? wA * (1 - sstep(0, 0.2, w)) : wA); lay("B", wB); lay("C", coldE); }
  else {
    // the floor and the jambs stay; the leak's own glow on the stone fades as the room's light takes over
    const sy = (G.y - ry0) * R.rs, dx0 = G.cx - G.dw / 2;
    ctx.globalAlpha = Math.min(1, wB) * fin * (1 - 0.5 * rise);
    ctx.drawImage(R.B, 0, sy, R.W, R.H - sy, 0, G.y, vw, vh - G.y);
    ctx.globalAlpha = Math.min(1, wB) * fin;
    // the room's light on the wall around the doorway (bounce from the bright floor), behind everything else
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, vw, G.y); ctx.clip();
    ctx.translate(G.cx, G.y); ctx.scale(1, 0.6 + 0.4 * rise); dot(0, 0, G.dw * 1.7, '150,92,50', 0.5 * sstep(0, 0.6, rise)); ctx.restore();
    if (PLASTER) { // the plaster's texture, only as strong as the spill on it
      const jw0 = JAMB * G.fD; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.fillStyle = PLASTER;
      ctx.fillRect(0, 0, dx0 - jw0, G.y); ctx.fillRect(dx0 + G.dw + jw0, 0, vw - (dx0 + G.dw + jw0), G.y); ctx.restore();
    }
    const jx0 = Math.floor(dx0 * R.rs), jx1 = Math.ceil((dx0 + G.dw) * R.rs);
    ctx.drawImage(R.B, 0, 0, jx0, sy, 0, ry0, jx0 / R.rs, G.y - ry0);
    ctx.drawImage(R.B, jx1, 0, R.W - jx1, sy, jx1 / R.rs, ry0, vw - jx1 / R.rs, G.y - ry0);
    // the doorway: the lit room (its floor runs away from us, brightest near the lamp-lit middle)
    const top = -40, gr = ctx.createLinearGradient(0, top, 0, G.y);
    gr.addColorStop(0, 'rgb(226,176,134)'); gr.addColorStop(0.5, 'rgb(250,216,184)'); gr.addColorStop(0.88, 'rgb(255,236,216)'); gr.addColorStop(1, 'rgb(255,246,236)');
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.fillRect(dx0, top, G.dw, G.y - top);
    // the frame, lit from inside: the two reveals (seen in perspective inside the opening) and the jamb faces
    const rv = G.dw * 0.042;
    for (const sgn of [-1, 1]) {
      const xo = sgn < 0 ? dx0 : dx0 + G.dw, xi = xo - sgn * rv, rg = ctx.createLinearGradient(xo, 0, xi, 0);
      rg.addColorStop(0, 'rgb(96,58,34)'); rg.addColorStop(0.75, 'rgb(196,138,92)'); rg.addColorStop(1, 'rgb(236,184,136)');
      ctx.fillStyle = rg; ctx.fillRect(Math.min(xo, xi), top, rv, G.y - top);
      const jw = JAMB * G.fD, jx = sgn < 0 ? dx0 - jw : dx0 + G.dw, jg = ctx.createLinearGradient(sgn < 0 ? dx0 : dx0 + G.dw, 0, sgn < 0 ? dx0 - jw : dx0 + G.dw + jw, 0);
      jg.addColorStop(0, `rgba(176,116,70,${0.75 * rise})`); jg.addColorStop(0.12, `rgba(92,56,32,${0.7 * rise})`); jg.addColorStop(1, `rgba(40,24,14,${0.6 * rise})`);
      ctx.fillStyle = jg; ctx.fillRect(jx, 0, jw, G.y);
      ctx.fillStyle = `rgba(150,100,62,${0.5 * rise})`; ctx.fillRect(sgn < 0 ? dx0 - jw - 1 : dx0 + G.dw + jw, 0, 1, G.y);
    }
    // the room's light through the opening falls on the threshold in a wedge bounded by the leaf and the jambs:
    // jamb shadows on either side, a narrow blade first, then the full doorway
    const Xa = Math.max(-HALF, sw.Xa), Xb = HALF;
    if (Xb - Xa > 0.002) {
      ctx.globalCompositeOperation = 'lighter';
      for (const [sp, al] of [[0.025, 1]]) {
        ctx.save(); ctx.beginPath();
        const a0 = Xa - sp * 0.3, b0 = Xb + sp * 0.3, a1 = (Xa - sp) * 4 / 3, b1 = (Xb + sp) * 4 / 3;
        ctx.moveTo(fx(a0, 0), G.y - G.gapPx); ctx.lineTo(fx(b0, 0), G.y - G.gapPx); ctx.lineTo(fx(b1, 1), fy(1, 0)); ctx.lineTo(fx(a1, 1), fy(1, 0)); ctx.closePath(); ctx.clip();
        ctx.globalAlpha = al * fin * sstep(0, 0.12, (Xb - Xa) / (2 * HALF)) * (0.55 + 0.45 * flood); ctx.drawImage(R.F, 0, ry0, vw, rh);
        ctx.restore();
      }
    }
    drawLeaf(R, sw, fin, flood);
    ctx.globalCompositeOperation = 'lighter';
  }
  // the slit itself: a warm 2700 K core, a little bloom only where it is brightest
  const lvl = fl * (0.82 + 0.18 * k) * (1 - coldE) * leakDim() + (w > 0 ? 0.3 * sstep(0, 0.15, w) : 0);
  const coreW = mixc([255, 240, 214], [255, 232, 196], k), glowW = mixc([255, 166, 84], [255, 150, 66], k), edgeW = mixc([236, 108, 34], [228, 96, 26], k);
  const sx0 = L.x0, sx1 = L.x1, gy = G.y - G.gapPx * 0.5, gp = Math.max(2, G.gapPx);
  ctx.globalAlpha = 1;
  if (rise < 0.004) {
    if (settled) { ctx.save(); ctx.translate(0, settled); }
    if (SH.length) { // the shoes also stand in the light already baked into the slit and the first centimetres of stone
      const gco = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'multiply'; const g = ctx.createLinearGradient(sx0, 0, sx1, 0);
      for (const q of QS) { const v = Math.round(255 * clamp(feetAt((q - 0.5) * 2 * HALF * 0.999), 0, 1)); g.addColorStop(q, `rgb(${v},${v},${v})`); }
      ctx.fillStyle = g; const ga = ctx.globalAlpha, yT = Math.floor(G.y - gp * 2.4), yB = Math.ceil(G.y + Math.max(2, G.fD * 0.012));
      for (let y = yT; y < yB; y++) { // full strength inside the gap, feathered into the bloom above and the stone below
        const u = y + 0.5, a = u < G.y - gp ? sstep(yT, G.y - gp, u) : u > G.y ? 1 - sstep(G.y, yB, u) : 1;
        if (a > 0.01) { ctx.globalAlpha = ga * a; ctx.fillRect(sx0, y, sx1 - sx0, 1); }
      }
      ctx.globalAlpha = ga;
      ctx.globalCompositeOperation = gco;
    }
    drawFan(0.5 * lvl, bal, rgb(glowW));
    slit(gy, gp * 4.2, rgb(edgeW), 0.11 * lvl, bal, sx0, sx1);
    slit(gy - gp * 1.6, gp * 2.4, rgb(edgeW), 0.05 * lvl, bal, sx0, sx1); // the door's underside edge, faintly
    slit(G.y - G.gapPx - 0.5, 1, rgb(glowW), 0.28 * lvl, bal, sx0, sx1);
    slit(gy, gp * 1.5, rgb(glowW), 0.42 * lvl, bal, sx0, sx1);
    slit(G.y - Math.max(0.6, gp * 0.22), Math.max(1, gp * 0.42), '255,247,230', lvl, bal, sx0, sx1, true); // the hot line, at the floor
    if (coldE > 0.01) { // switched off: a thin cold line remains (the hall, not the room)
      slit(gy, gp * 1.6, '110,150,230', 0.2 * coldE, 0, sx0, sx1);
      slit(gy + gp * 0.15, 1, '196,214,250', 0.62 * coldE, 0, sx0, sx1);
    }
    if (settled) ctx.restore();
  }
  if (live && state === 'idle' && !settled && settleAt && t > settleAt && coldE < 0.01) { settled = 0.8; settle(); }
  if (rise < 0.02) drawStreaks(fin * (1 - coldE));
  if (rise < 0.004) drawKeyhole(fin * lvl * (1 - coldE) * shadeAt(KH.X) * (1 - 0.9 * torsoOverKeyhole()), G.cx + KH.X * G.fD, G.y - KH.h * G.fD, G.fD);
  else { // the keyhole rides away on the leaf; its beam dies as the room's light takes over
    const sk = 0.805, X = -HALF + sk * sw.c, d = sk * sw.s, q = DD / (DD - d);
    drawKeyhole(fin * lvl * (1 - sstep(0.02, 0.16, rise)), G.cx + G.fD * X * q, G.yh + G.fD * (HC - KH.h) * q, G.fD * q);
  }
  // the door in its wall: hairlines of light up the door/jamb joints and the jamb arrises, falling off fast
  if (rise < 0.02 && fin > 0) {
    const jw = JAMB * G.fD, hh = G.fD * 0.75, cw = coldE > 0.05 ? '150,180,235' : rgb(glowW);
    const vline = (x, a, len) => { const g = ctx.createLinearGradient(0, G.y, 0, G.y - len); g.addColorStop(0, `rgba(${cw},${a})`); g.addColorStop(0.25, `rgba(${cw},${a * 0.35})`); g.addColorStop(1, `rgba(${cw},0)`); ctx.fillStyle = g; ctx.fillRect(x, G.y - len, 1, len); };
    const a0 = fin * (lvl + 0.35 * coldE);
    vline(L.x1, 0.3 * a0, hh * 0.65); vline(L.x0 - 1, 0.13 * a0, hh * 0.35);   // latch side leaks a little more
    vline(L.x1 + jw, 0.06 * a0, hh * 0.22); vline(L.x0 - jw - 1, 0.06 * a0, hh * 0.22);
  }
  // bloom
  const bl = (0.5 + 0.5 * k) * lvl + (w > 0 ? 1.6 * flood : 0);
  if (bl > 0.01) {
    ctx.save(); ctx.translate(G.cx + (w > 0 ? 0.2 * G.dw * (1 - rise) * sstep(0, 0.1, rise) : 0), gy - (w > 0 ? rise * G.y * 0.25 : 0));
    ctx.scale(1, 0.05 + (w > 0 ? 0.9 * flood : 0)); dot(0, 0, G.dw * (0.55 + 0.2 * k + 0.6 * flood), rgb(glowW), 0.09 * bl / (1 + 2.2 * flood));
    ctx.restore();
    if (rise < 0.02) { // anamorphic: a long hair-thin streak through the hottest point, a touch cooler than the core
      ctx.save(); ctx.translate(G.cx + G.fD * 0.02, G.y - G.gapPx * 0.3); ctx.scale(1, 0.006); dot(0, 0, G.dw * (0.85 + 0.2 * k), '255,226,196', 0.32 * lvl * shadeAt(0.02)); ctx.restore();
      ctx.save(); ctx.translate(G.cx + G.fD * 0.02, G.y - G.gapPx * 0.3); ctx.scale(1, 0.05); dot(0, 0, G.dw * 0.2, rgb(coreW), 0.12 * bl); ctx.restore();
    }
  }
  // the mark: lit only by the leak; one slow light sweep on arrival, like an engraving on a watch case
  const ts = t - tLay - 1.0;
  if (R && live && ts > 0 && ts < 2.6 && state === 'idle') {
    const q = sstep(0, 2.6, ts), mk = R.mk, bx = mk.x - mk.w * 0.3 + q * mk.w * 1.6, sw = mk.w * 0.22;
    if (!R.tmp) { R.tmp = mkCanvas(R.M.width, R.M.height); }
    const tx = R.tmp.getContext('2d'); tx.globalCompositeOperation = 'copy'; tx.drawImage(R.M, 0, 0);
    tx.globalCompositeOperation = 'source-in';
    const sgr = tx.createLinearGradient((bx - sw - mk.x) * R.rs, 0, (bx + sw - mk.x) * R.rs, 0);
    sgr.addColorStop(0, 'rgba(255,226,186,0)'); sgr.addColorStop(0.5, 'rgba(255,236,206,1)'); sgr.addColorStop(1, 'rgba(255,226,186,0)');
    tx.fillStyle = sgr; tx.fillRect(0, 0, R.tmp.width, R.tmp.height);
    ctx.globalAlpha = 0.7 * Math.sin(Math.PI * clamp(ts / 2.6, 0, 1)); ctx.drawImage(R.tmp, mk.x, mk.y, mk.w, mk.h); ctx.globalAlpha = 1;
  }
  drawMotes(lvl * (1 + 0.5 * flood), coldE, 1 - sstep(0.62, 0.86, w < 0 ? 0 : w));
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(pdx, pdy);
  /* the pearls live in the door's own field: the threshold keeps only the light the letters raise */
  if (state === 'win') {
    const f = sstep(2.45, 3.35, tw);
    if (f > 0) { ctx.fillStyle = `rgba(255,250,242,${f})`; ctx.fillRect(0, 0, vw, vh); }
    if (tw >= 3.5) showOpen();
  }
}
function loop() { draw(); if (running) raf = requestAnimationFrame(loop); }
function start() { if (running || held || RM || document.hidden || state === 'open') { if (RM) draw(); return; } running = true; lastT = now(); raf = requestAnimationFrame(loop); }
function stop() { running = false; cancelAnimationFrame(raf); }
function kick() { if (!running && state !== 'open') draw(); }
kit.on(document, 'visibilitychange', () => { if (document.hidden) stop(); else start(); });
kit.on(mq, 'change', () => { RM = kit.reduced || mq.matches; if (RM) { stop(); kick(); } else start(); });
addEventListener('resize', layout);

// film grain: one small noise tile, moved by the compositor (no per-frame cost)
(function grain() {
  const s = 192, c = mkCanvas(s, s), x = c.getContext('2d'), im = x.createImageData(s, s), r = mulberry(99);
  for (let i = 0; i < s * s; i++) { const v = 128 + (r() + r() + r() - 1.5) * 46; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
  x.putImageData(im, 0, 0);
  try { $('grain').style.backgroundImage = `url(${kit.blobURL(c)})`; } catch (e) { /* no grain, no harm */ }
})();

layout();
start();
// parallax sources: the pointer on a desk, the tilt of a phone (iOS asks once, after the first tap; silent fallback)
addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { par.tx = clamp((e.clientX / vw) * 2 - 1, -1, 1); par.ty = clamp((e.clientY / vh) * 2 - 1, -1, 1) * 0.6; } }, { passive: true });
function onTilt(e) { if (e.gamma == null) return; if (!tilt0) tilt0 = { g: e.gamma, b: e.beta }; par.tx = clamp((e.gamma - tilt0.g) / 18, -1, 1); par.ty = clamp((e.beta - tilt0.b) / 24, -1, 1) * 0.6; }
addEventListener('deviceorientation', onTilt);
settleAt = now() + 13 + prnd() * 9;
passNext = now() + 16 + prnd() * 14;
return {
  typing(n) { if (state !== 'idle') return; wordEl.value = '•'.repeat(n); wordEl.dispatchEvent(new Event('input')); },
  focus(on) { wordEl.focused = on; wordEl.dispatchEvent(new Event(on ? 'focus' : 'blur')); },
  wrong() { if (state !== 'idle') return; wrong(); },
  open(done) { openDone = done; if (state !== 'idle') { showOpen(); return; } win(); },
  hold(on) { held = on; if (on) stop(); else start(); },
  destroy() { stop(); state = 'open'; openDone = null; },
};
});
})();

