// halls/voyages/hatches.js — WP6: the polar survey floor and its hatches, in 3D (SPEC §6.3, §2.7, §7.4 «Капля», A3.4).
//
// ONE Lines (one draw call) holds the whole field: the floor (24 radials and rings every 10 m out to r = 90 m, 1 px
// --steel; the WP0 deck is hidden), every hatch — a 4.5 m rim + an 8-blade iris drawn as hairline blade edges and the octagonal
// aperture they leave (blade rotation = aperture 0…100 %), per-segment colour / width / alpha:
//   done     1.5 px ember rim, iris 100 %, a faint 30 m silver light column (alpha 0.12, 24 hairlines)
//   active   silver; the iris breathes 10 % ↔ 35 % on the world breath; an ember tick at the rim top
//   new      silver rim, closed; hover opens 18 % and a 6 m silver light rises
//   locked   closed, the blades flicker 1 px at 12 Hz in --pewter
//   sealed   closed, no flicker, --steel
//   proposal closed, rim 1 px dashed --silver (8 dashes) — distinct from every data state
// Hover (any hatch, §2.7): iris +18 % in 240 ms and the 6 m light. Locked / sealed click: a 6 px × 3 / 240 ms shudder.
// «Капля» (the arrival build, last 600 ms, pure in u): an ember bead peels off the axis bead at +10 m, drops onto the
// deck centre and becomes hatch 001's iris; the others open in spiral order (30 ms apart for 9 hatches; 14 share the
// same window). The bead emitter is reused for the probe-return dot that descends into a hatch.
// Allocation-free per frame (G9): every buffer is preallocated at build; colours come from the live palette.
import { createLines } from '../../render/lines.js';
import { createEmitter } from '../../render/glow.js';
import { palette } from '../../render/palette.js';
import { breath } from '../../core/clock.js';
import { clamp01, EASE } from '../../core/ease.js';
import { HATCH_R, FLOOR_R, slotPoint } from './layout.js';

const TAU = Math.PI * 2;
const RIM = 64, BLADES = 8, BLADE_SEG = 3;
const PER = RIM + BLADES * BLADE_SEG + BLADES + 1;            // rim + blade edges + aperture octagon + ember tick
const COL_LINES = 24, COL_SEG = 3;                            // light column: 24 verticals × 3 fading segments
const BEAD_Y = 10;                                            // the first axis bead above the VOYAGES deck (25 m pitch)
const APERTURE = { done: 1, active: 0.225, new: 0, locked: 0, sealed: 0, proposal: 0 };

/** @param {number} cap maximum number of hatches (missions + 3 proposals) */
export function createHatchField(cap) {
  // ── polar floor ──
  const fs = [];
  for (let r = 10; r <= FLOOR_R; r += 10) {
    const n = Math.max(48, Math.round(r * 1.6));
    for (let q = 0; q < n; q++) {
      const a0 = (q / n) * TAU, a1 = ((q + 1) / n) * TAU;
      fs.push(Math.sin(a0) * r, 0, Math.cos(a0) * r, Math.sin(a1) * r, 0, Math.cos(a1) * r);
    }
  }
  for (let q = 0; q < 24; q++) {
    const a = (q / 24) * TAU;
    for (let r = 0; r < FLOOR_R; r += 10) fs.push(Math.sin(a) * r, 0, Math.cos(a) * r, Math.sin(a) * (r + 10), 0, Math.cos(a) * (r + 10));
  }
  const floorN = fs.length / 6;
  const floorR = new Float32Array(floorN);                    // radius of each floor segment's midpoint (build order)
  const floorAlpha = new Float32Array(floorN);
  for (let s = 0; s < floorN; s++) {
    floorR[s] = Math.hypot((fs[s * 6] + fs[s * 6 + 3]) / 2, (fs[s * 6 + 2] + fs[s * 6 + 5]) / 2);
    floorAlpha[s] = 1;
  }

  // ── ONE Lines for the whole field (one draw call): [floor | hatches | light columns], per-segment colour / width /
  //    alpha. The light columns are normal-blended hairlines at their SPEC alphas (0.12 · 6 m hover light).
  const HB = floorN, CB = floorN + cap * PER;
  const total = CB + cap * COL_LINES * COL_SEG;
  const seg = new Float32Array(total * 6);
  seg.set(fs, 0);
  const col = new Float32Array(total * 3);
  const alpha = new Float32Array(total);
  const width = new Float32Array(total);
  width.fill(1);
  const lines = createLines({ segments: seg, color: col, alpha, width, far: 420, glint: 0.9 });
  lines.mesh.name = 'voyages:field';

  // ── the bead (Капля) / the returning probe dot ──
  const bead = createEmitter({ color: 'ember', radius: 1.6, intensity: 0 });
  bead.object.name = 'voyages:bead';

  /** @type {Array<{k:number, x:number, z:number, state:string, hover:number, hoverTo:number, ap:number, shake:number,
   *   decode:number, build:number, alpha:number, sel:boolean}>} */
  const H = [];
  const _pt = { x: 0, z: 0 };
  let n = 0, t = 0, floorA = 1, fieldA = 1;
  const tmp = { r: 0, g: 0, b: 0 };

  function setHatches(list /* [{ code, state }] in spiral order */) {
    n = Math.min(cap, list.length);
    for (let k = 0; k < n; k++) {
      slotPoint(k, _pt);
      const prev = H[k];
      const h = prev && prev.code === list[k].code ? prev
        : { k, code: '', x: 0, z: 0, state: 'new', hover: 0, hoverTo: 0, ap: 0, apOv: -1, shake: -1, decode: -1, build: 1, alpha: 1, sel: false };
      h.k = k; h.code = list[k].code; h.x = _pt.x; h.z = _pt.z;
      if (h.state !== list[k].state) { h.state = list[k].state; if (!prev) h.ap = APERTURE[h.state] || 0; }
      H[k] = h;
    }
    H.length = n;
    for (let o = HB + n * PER; o < CB; o++) alpha[o] = 0;             // unused hatch / column slots draw nothing
    for (let o = CB + n * COL_LINES * COL_SEG; o < total; o++) alpha[o] = 0;
  }

  function rgb(token, k) { const c = palette.color(token); tmp.r = c.r * k; tmp.g = c.g * k; tmp.b = c.b * k; return tmp; }
  function put(o, ax, ay, az, bx, by, bz, c, a, w) {
    const s = o * 6; seg[s] = ax; seg[s + 1] = ay; seg[s + 2] = az; seg[s + 3] = bx; seg[s + 4] = by; seg[s + 5] = bz;
    col[o * 3] = c.r; col[o * 3 + 1] = c.g; col[o * 3 + 2] = c.b;
    alpha[o] = a; width[o] = w;
  }

  /** Writes one hatch's segments (rim, iris, tick). */
  function writeHatch(h, base) {
    const st = h.state;
    const vis = h.alpha * fieldA * clamp01(h.build * 1.6);
    const scale = 0.55 + 0.45 * EASE.reveal(clamp01(h.build));
    const R = HATCH_R * scale;
    let ox = h.x, oz = h.z;
    if (h.shake >= 0 && h.shake < 240) {
      const u = h.shake / 240;
      ox += Math.sin(u * TAU * 3) * (1 - u) * 0.36;           // 6 px at the SPEC camera distance, 3 cycles in 240 ms
    }
    // rim
    const rimTok = st === 'done' ? 'ember' : st === 'locked' ? 'pewter' : st === 'sealed' ? 'steel' : 'silver';
    const rimA = st === 'done' ? 0.9 : st === 'sealed' ? 1 : st === 'locked' ? 0.85 : 0.75;
    const rimW = st === 'done' ? 1.5 : 1;
    const c = rgb(rimTok, 1);
    for (let q = 0; q < RIM; q++) {
      const a0 = (q / RIM) * TAU, a1 = ((q + 1) / RIM) * TAU;
      const dashOff = st === 'proposal' && (q % 8) >= 5;      // 8 dashes
      put(base + q, ox + Math.sin(a0) * R, 0.03, oz + Math.cos(a0) * R, ox + Math.sin(a1) * R, 0.03, oz + Math.cos(a1) * R,
        c, dashOff ? 0 : rimA * vis, rimW);
    }
    // iris: aperture with breath (active), hover (+18 %), decode opening
    let ap = h.ap;
    if (st === 'active' && h.apOv < 0) ap = 0.10 + 0.25 * breath.value;
    ap = clamp01(ap + 0.18 * h.hover);
    const rho = Math.max(0.001, ap) * R * 0.94;
    const bladeTok = st === 'locked' ? 'pewter' : st === 'sealed' ? 'steel' : 'silver';
    let jitter = 0, flick = 1;
    if (st === 'locked' && h.decode < 0) {                     // static: 1 px at 12 Hz
      const step = Math.floor(t / 83.333) + h.k * 7;
      jitter = (((step * 2654435761) >>> 0) % 1000) / 1000 - 0.5;
      flick = 0.7 + 0.3 * ((((step * 40503) >>> 0) % 997) / 997);
    }
    const bc = rgb(bladeTok, 1);
    const bladeA = (st === 'done' ? 0.35 : st === 'sealed' ? 0.9 : 0.55) * vis * flick;
    const rot = h.k * 0.3 + jitter * 0.024;
    const turn = Math.acos(Math.min(0.999, rho / R));
    let o = base + RIM;
    for (let b = 0; b < BLADES; b++) {
      const th = rot + (b / BLADES) * TAU;
      const px = Math.sin(th) * R, pz = Math.cos(th) * R;
      const tx = Math.sin(th + turn) * rho, tz = Math.cos(th + turn) * rho;
      // a gently curved blade edge: P → (bulge) → T in 3 segments
      const mx = (px + tx) / 2, mz = (pz + tz) / 2;
      const nx = -(tz - pz), nz = tx - px, nl = Math.hypot(nx, nz) || 1;
      const bulge = 0.10 * R * (1 - ap);
      const cx = mx + (nx / nl) * bulge, cz = mz + (nz / nl) * bulge;
      let lx = px, lz = pz;
      for (let s = 1; s <= BLADE_SEG; s++) {
        const u = s / BLADE_SEG, iu = 1 - u;
        const qx = iu * iu * px + 2 * iu * u * cx + u * u * tx, qz = iu * iu * pz + 2 * iu * u * cz + u * u * tz;
        put(o++, ox + lx, 0.03, oz + lz, ox + qx, 0.03, oz + qz, bc, bladeA, 1);
        lx = qx; lz = qz;
      }
    }
    for (let b = 0; b < BLADES; b++) {                         // the aperture octagon
      const th0 = rot + (b / BLADES) * TAU + turn, th1 = rot + ((b + 1) / BLADES) * TAU + turn;
      put(o++, ox + Math.sin(th0) * rho, 0.03, oz + Math.cos(th0) * rho, ox + Math.sin(th1) * rho, 0.03, oz + Math.cos(th1) * rho,
        bc, ap > 0.02 ? bladeA * 1.2 : 0, 1);
    }
    // active: the ember tick at the rim top (far side, −Z)
    const ec = rgb('ember', 1);
    put(o++, ox, 0.03, oz - R, ox, 0.03, oz - R - 1.3, ec, st === 'active' ? vis : 0, 2);
  }

  function writeColumn(h, base) {
    const vis = h.alpha * fieldA * clamp01(h.build);
    const done = h.state === 'done' ? 1 : 0;
    const hv = h.hover;
    const cc = rgb('silver', 1);
    for (let l = 0; l < COL_LINES; l++) {
      const a = (l / COL_LINES) * TAU + 0.13;
      const x = h.x + Math.sin(a) * HATCH_R * 0.98, z = h.z + Math.cos(a) * HATCH_R * 0.98;
      for (let s = 0; s < COL_SEG; s++) {
        const o = base + l * COL_SEG + s, so = o * 6;
        col[o * 3] = cc.r; col[o * 3 + 1] = cc.g; col[o * 3 + 2] = cc.b; width[o] = 1;
        const h0 = done ? (s / COL_SEG) * 30 : (s / COL_SEG) * 6 * hv;
        const h1 = done ? ((s + 1) / COL_SEG) * 30 : ((s + 1) / COL_SEG) * 6 * hv;
        seg[so] = x; seg[so + 1] = h0; seg[so + 2] = z; seg[so + 3] = x; seg[so + 4] = h1; seg[so + 5] = z;
        const fade = 1 - s / COL_SEG;
        alpha[o] = vis * (done ? 0.12 * fade + 0.12 * hv * fade : 0.22 * hv * fade);
      }
    }
  }

  const field = {
    lines, bead,
    get hatches() { return H; },
    get count() { return n; },
    setHatches,
    /** 0..1 — the whole field (ШЛЮЗ / chamber fade). */
    setFieldAlpha(a) { fieldA = a; lines.mesh.visible = a > 0; },
    /** Arrival build «Капля», pure in u (0…1 over the last 600 ms). */
    build(u) {
      const ms = clamp01(u) * 600;
      // bead: 0–240 ms falling from the axis bead (+10 m) to the deck centre
      const f = clamp01(ms / 240);
      bead.object.position.set(0, BEAD_Y * (1 - f * f), 0);
      bead.setIntensity(u > 0 && ms < 330 ? (ms < 240 ? 1 : 1 - (ms - 240) / 90) : 0);
      const span = 600 - 260 - 120;
      const d = n > 2 ? Math.min(30, span / (n - 2)) : 30;
      for (let k = 0; k < n; k++) {
        const start = k === 0 ? 220 : 260 + (k - 1) * d;
        H[k].build = clamp01((ms - start) / 120);
      }
      floorA = clamp01(ms / 320);
      for (let s = 0; s < floorN; s++) floorAlpha[s] = clamp01((ms - floorR[s] * 2.4) / 160);
    },
    /** Snaps the build complete (deep link to a chamber, reduced motion). */
    built() {
      for (let k = 0; k < n; k++) H[k].build = 1;
      floorA = 1; floorAlpha.fill(1);
      bead.setIntensity(0);
    },
    /** The probe-return dot: s 0…1 descends from 40 m into hatch k (ember dot, then gone). */
    returnDot(k, s) {
      if (k < 0 || k >= n || s >= 1) { bead.setIntensity(0); return; }
      const h = H[k], e = s * s;
      bead.object.position.set(h.x, 40 * (1 - e), h.z);
      bead.setIntensity(s < 0.85 ? 1 : (1 - s) / 0.15);
    },
    /** Per frame. dt seconds; tMs loop time. */
    update(dt, tMs) {
      t = tMs;
      const kHover = 1 - Math.exp(-dt / 0.08);                 // ≈ 240 ms to settle (§2.7 iris 0 → 18 % in 240 ms)
      for (let k = 0; k < n; k++) {
        const h = H[k];
        h.hover += (h.hoverTo - h.hover) * kHover;
        if (h.apOv >= 0) h.ap = h.apOv;
        else h.ap += ((APERTURE[h.state] || 0) - h.ap) * (1 - Math.exp(-dt / 0.16));
        if (h.shake >= 0) { h.shake += dt * 1000; if (h.shake > 240) h.shake = -1; }
        writeHatch(h, HB + k * PER);
        writeColumn(h, CB + k * COL_LINES * COL_SEG);
      }
      const fc = rgb('steel', 1), fa = floorA * fieldA;
      for (let s = 0; s < floorN; s++) { alpha[s] = floorAlpha[s] * fa; col[s * 3] = fc.r; col[s * 3 + 1] = fc.g; col[s * 3 + 2] = fc.b; }
      lines.setSegments(seg, total);
      const g = lines.mesh.geometry.attributes;
      g.aCol.needsUpdate = true; g.aAl.needsUpdate = true; g.aW.needsUpdate = true;
    },
    shudder(k) { if (H[k]) H[k].shake = 0; },
    hover(k, on) { if (H[k]) H[k].hoverTo = on ? 1 : 0; },
    /** live decode: the iris opens to the new look (0 → 18 % → closed, 1,200 ms) */
    decodeOpen(k) { if (H[k]) { H[k].hoverTo = 1; H[k].decode = 0; } },
    decodeSettle(k) { if (H[k]) { H[k].hoverTo = 0; H[k].decode = -1; } },
    /** ШЛЮЗ: force hatch k's aperture (0..1); −1 releases it. */
    setOpenOverride(k, ap) { if (H[k]) H[k].apOv = ap; },
    /** per-hatch alpha (0..1), e.g. the chosen hatch stays while the field fades */
    setHatchAlpha(k, a) { if (H[k]) H[k].alpha = a; },
    dispose() { lines.dispose(); bead.dispose(); },
  };
  return field;
}

export const HATCH_SEGMENTS = PER;
