// halls/archive/bands.js — WP7: the wall of time (SPEC §6.4, §7.4 «Керн», §2.7; SPEC-ADDENDUM A3.5). Hall-local metres.
//
// The core sample is a vertical tube of radius 9 m around the camera's axis. Each band is 3–5 stratification hairlines
// with seeded waviness (amplitude 0.08 m) drawn as arcs over the front of the tube (θ = ±80°, θ > 0 = screen right with
// the camera looking along +z). Colours are palette uniforms (so ИЗНАНКА/night follow): regular bands --slate at 55 %;
// legend bands --silver at 40 % (≈ 3× brighter); his deed bands --silver at 30 % (A3.5). One Lines per colour → two draw
// calls for the whole wall; a per-segment alpha carries hover (+25 %) and the edge/inner weight; setDrawRange01 limits
// each frame to the bands near the camera. The anniversary band gets two extra Lines: an electrum twin (2,500 ms glow,
// 600 ms cool) and an ember edge on its top hairline (all day). The reading datum is a 10 m hairline arc at eye level
// with 1 m ticks; the «ДО НАЧАЛА» band carries one 2 px --white point. The «Керн» arrival build is drawn by createCurl:
// the deck survey pentagons (r 4…60 m every 4 m) map (x, z) → (9·sin(x/9), y_band(z), 9·cos(x/9)) with eased progress.
import { createLines } from '../../render/lines.js';
import { createPoints } from '../../render/points.js';
import { mulberry32 } from '../../core/rng.js';
import { CAMERA, HALL } from '../../core/tokens.js';

export const TUBE_R = CAMERA.archive.tubeR;                    // 9 m
export const EYE_BELOW = CAMERA.archive.eyeBelowBand;          // 0.4 m
/** The eye stands on the axis, 0.6 m forward of the pillar's ember line (so the line never cuts the view at the eye). */
export const CAM_Z = 0.6;
const DEG = Math.PI / 180;
const ARC_FROM = -80 * DEG, ARC_TO = 80 * DEG, ARC_SEGS = 64;
const WAVE = 0.08;                                              // seeded waviness amplitude (m)
const WHICH = ['slate', 'silver'];
export const ALPHA_WALL = Object.freeze({ slate: 1.0, legend: 0.40, deed: 0.30, inner: 0.7 });
/** Line widths (CSS px): legend edges 1.5 px (with silver 40 % ≈ 3× a slate band), every other hairline 1 px. */
const WIDTH_LEGEND_EDGE = 1.5;

/** Hall-local wall point at angle θ (rad, + = screen right) and height y, radius r. */
export function wallPoint(theta, y, r, out) { return out.set(-r * Math.sin(theta), y, r * Math.cos(theta)); }

/** Seeded hairline fractions (0 = top edge … 1 = bottom edge) of a band: 3–5 lines. */
function lineFractions(band) {
  const rnd = mulberry32(band.seed ^ 0x51ed);
  if (band.kind === 'before') return [0, 1];                    // the empty band: its two edges only
  const n = 3 + Math.floor(rnd() * 3);
  const f = [0, 1];
  for (let k = 0; k < n - 2; k++) f.push(0.18 + 0.64 * rnd());
  return f.sort((a, b) => a - b);
}

/** → { k1, p1, k2, p2 } — the seeded wave of one hairline. */
function waveOf(seed) {
  const rnd = mulberry32(seed);
  return { k1: 3 + 3 * rnd(), p1: rnd() * 6.283, k2: 9 + 7 * rnd(), p2: rnd() * 6.283 };
}
const waveY = (w, th) => WAVE * (0.62 * Math.sin(w.k1 * th + w.p1) + 0.38 * Math.sin(w.k2 * th + w.p2));

/** Builds the wall. bands: Band[]; y0: hall-local y of the timeline origin (band.y + y0 = band centre). */
export function createWall(bands, y0, group) {
  const segs = { slate: [], silver: [] }, alphas = { slate: [], silver: [] }, widths = { slate: [], silver: [] };
  const range = [];                                             // per band: { which, start, count, base:[…] }
  const cum = { slate: new Int32Array(bands.length + 1), silver: new Int32Array(bands.length + 1) };
  const lineYs = [];                                            // per band: [{ y, wave }] (for the accent twins)
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    cum.slate[i] = segs.slate.length / 6; cum.silver[i] = segs.silver.length / 6;
    const which = b.kind === 'legend' || b.kind === 'sbor' || b.kind === 'deed' || b.kind === 'show' ? 'silver' : 'slate';
    const baseA = b.kind === 'legend' ? ALPHA_WALL.legend : which === 'silver' ? ALPHA_WALL.deed : ALPHA_WALL.slate;
    const S = segs[which], A = alphas[which], Wd = widths[which];
    const start = S.length / 6;
    const top = y0 + b.y + b.height / 2;
    const fr = lineFractions(b);
    const ys = [];
    for (let k = 0; k < fr.length; k++) {
      const yl = top - fr[k] * b.height;
      const w = waveOf((b.seed + 7919 * (k + 1)) >>> 0);
      ys.push({ y: yl, w });
      const edge = k === 0 || k === fr.length - 1;
      const a = baseA * (edge ? 1 : ALPHA_WALL.inner);
      for (let j = 0; j < ARC_SEGS; j++) {
        const t0 = ARC_FROM + ((ARC_TO - ARC_FROM) * j) / ARC_SEGS, t1 = ARC_FROM + ((ARC_TO - ARC_FROM) * (j + 1)) / ARC_SEGS;
        S.push(-TUBE_R * Math.sin(t0), yl + waveY(w, t0), TUBE_R * Math.cos(t0), -TUBE_R * Math.sin(t1), yl + waveY(w, t1), TUBE_R * Math.cos(t1));
        A.push(a);
        Wd.push(edge && b.kind === 'legend' ? WIDTH_LEGEND_EDGE : 1);
      }
    }
    lineYs.push(ys);
    range.push({ which, start, count: S.length / 6 - start });
  }
  cum.slate[bands.length] = segs.slate.length / 6; cum.silver[bands.length] = segs.silver.length / 6;

  const mk = (which) => {
    const n = segs[which].length / 6;
    const l = createLines({ segments: new Float32Array(n ? segs[which] : [0, 0, 0, 0, 0, 0]), alpha: new Float32Array(n ? alphas[which] : [0]),
      width: new Float32Array(n ? widths[which] : [1]), color: which, far: 120 });
    l.mesh.name = `archive:wall:${which}`;
    l.uniforms.uAlpha.value = n ? 1 : 0;
    l.mesh.visible = n > 0;
    group.add(l.mesh);
    return { lines: l, base: Float32Array.from(n ? alphas[which] : [0]), attr: l.mesh.geometry.getAttribute('aAl'), n };
  };
  const L = { slate: mk('slate'), silver: mk('silver') };
  const gain = new Float32Array(bands.length).fill(1);
  const dimOf = new Float32Array(bands.length).fill(1);         // anniversary glow: the band's own lines step back
  let globalA = 1, accentDim = 1;

  // Accent twins of one band (anniversary): an electrum twin of every hairline (a 1.6 px core flanked by two soft
  // hairlines ±3 cm, so the band reads as glowing on every tier without a bloom pass; unfogged, so 9 m of hall haze
  // never greys the acceptance colour) and an ember edge on the upper side of each of its hairlines (all day).
  let accent = null;
  function buildAccent(i) {
    if (accent) { accent.el.dispose(); accent.em.dispose(); accent = null; }
    if (accentDim !== 1) { dimOf.fill(1); accentDim = 1; writeAlpha('slate'); writeAlpha('silver'); }
    if (i < 0 || i >= bands.length) return;
    const ys = lineYs[i];
    const se = [], sa = [], sw = [], sm = [];
    const r = TUBE_R - 0.004;
    const HALO = [[0, 1, 1.6], [0.03, 0.32, 1], [-0.03, 0.32, 1]];
    for (let k = 0; k < ys.length; k++) {
      for (let j = 0; j < ARC_SEGS; j++) {
        const t0 = ARC_FROM + ((ARC_TO - ARC_FROM) * j) / ARC_SEGS, t1 = ARC_FROM + ((ARC_TO - ARC_FROM) * (j + 1)) / ARC_SEGS;
        const a0 = ys[k].y + waveY(ys[k].w, t0), a1 = ys[k].y + waveY(ys[k].w, t1);
        for (let h = 0; h < HALO.length; h++) {
          const o = HALO[h][0];
          se.push(-r * Math.sin(t0), a0 + o, r * Math.cos(t0), -r * Math.sin(t1), a1 + o, r * Math.cos(t1));
          sa.push(HALO[h][1]); sw.push(HALO[h][2]);
        }
        sm.push(-r * Math.sin(t0), a0 + 0.016, r * Math.cos(t0), -r * Math.sin(t1), a1 + 0.016, r * Math.cos(t1));
      }
    }
    const el = createLines({ segments: new Float32Array(se), alpha: new Float32Array(sa), width: new Float32Array(sw), color: 'electrum',
      fog: false, far: 120 });
    const em = createLines({ segments: new Float32Array(sm), color: 'ember', width: 1, alpha: 0, far: 120, fog: false });
    el.setAlpha(0);
    el.mesh.name = 'archive:wall:electrum'; em.mesh.name = 'archive:wall:ember';
    group.add(el.mesh, em.mesh);
    accent = { i, el, em };
  }

  function writeAlpha(which) {
    const o = L[which];
    if (!o.n) return;
    const arr = o.attr.array;
    for (let i = 0; i < bands.length; i++) {
      const r = range[i];
      if (r.which !== which) continue;
      const g = gain[i] * dimOf[i];
      for (let s = r.start, e = r.start + r.count; s < e; s++) arr[s] = o.base[s] * g;
    }
    o.attr.needsUpdate = true;
  }

  const wall = {
    lines: L,
    /** Brightness multiplier of one band (hover +25 %, focus); writes the per-segment alphas (on change only). */
    setGain(i, g) {
      if (i < 0 || i >= bands.length || gain[i] === g) return;
      gain[i] = g;
      writeAlpha(range[i].which);
    },
    /** Global alpha (enter/exit). */
    setAlpha(a) {
      globalA = a;
      for (let q = 0; q < 2; q++) { const o = L[WHICH[q]]; o.lines.uniforms.uAlpha.value = a; o.lines.mesh.visible = o.n > 0 && a > 0.001; }
    },
    get alpha() { return globalA; },
    /** Draw only bands i0…i1 (inclusive). */
    setVisibleRange(i0, i1) {
      const a = Math.max(0, i0), b = Math.min(bands.length - 1, i1);
      for (let q = 0; q < 2; q++) {
        const w = WHICH[q], o = L[w];
        if (!o.n) continue;
        o.lines.setDrawRange01(cum[w][a] / o.n, cum[w][b + 1] / o.n);
      }
    },
    /** «Керн» condensation: the band lines spread ×k about yC (k = 1 at rest). */
    setSpread(k, yC) {
      for (let q = 0; q < 2; q++) { const m = L[WHICH[q]].lines.mesh; m.scale.y = k; m.position.y = yC * (1 - k); }
      if (accent) { accent.el.mesh.scale.y = k; accent.el.mesh.position.y = yC * (1 - k); accent.em.mesh.scale.y = k; accent.em.mesh.position.y = yC * (1 - k); }
    },
    /** Anniversary twin: el = electrum alpha 0..1, em = ember edge alpha 0..1 (−1 builds nothing). */
    setAccentBand(i) { buildAccent(i); },
    setAccent(el, em) {
      if (!accent) return;
      accent.el.setAlpha(el * globalA);
      accent.em.setAlpha(0.8 * em * globalA * (1 - 0.7 * el));
      // While it glows, the band's own hairlines step back so the glow reads as electrum, not silver + yellow.
      const g = Math.round((1 - 0.85 * el) * 50) / 50;
      if (accentDim !== g) { accentDim = g; dimOf[accent.i] = g; writeAlpha(range[accent.i].which); }
    },
    /** Hairline heights of a band (top → bottom, without waviness). */
    lineYs(i) { return lineYs[i] || []; },
    dispose() {
      for (let q = 0; q < 2; q++) L[WHICH[q]].lines.dispose();
      if (accent) { accent.el.dispose(); accent.em.dispose(); accent = null; }
    },
  };
  return wall;
}

/** The 10 m reading datum (arc at eye level, 1 m ticks), drawn at y = 0; the hall moves mesh.position.y. */
export function createDatum(group) {
  const seg = [];
  const r = TUBE_R - 0.02, half = 5 / r;                        // ±5 m of arc
  const n = 48;
  for (let j = 0; j < n; j++) {
    const t0 = -half + (2 * half * j) / n, t1 = -half + (2 * half * (j + 1)) / n;
    seg.push(-r * Math.sin(t0), 0, r * Math.cos(t0), -r * Math.sin(t1), 0, r * Math.cos(t1));
  }
  for (let m = -5; m <= 5; m++) {
    const t = m / r, h = m % 5 === 0 ? 0.09 : 0.045;
    seg.push(-r * Math.sin(t), -h, r * Math.cos(t), -r * Math.sin(t), h, r * Math.cos(t));
  }
  const l = createLines({ segments: new Float32Array(seg), color: 'silver', alpha: 0.30, width: 1, far: 120 });
  l.mesh.name = 'archive:datum';
  group.add(l.mesh);
  return l;
}

/** The «ДО НАЧАЛА» point: one 2 px --white point at the band centre. */
export function createBeforePoint(group, y) {
  const p = createPoints({ positions: new Float32Array([0, y, TUBE_R - 0.05]), sizePx: 2, color: 'white', alpha: 1, fog: false });
  p.object.name = 'archive:before';
  group.add(p.object);
  return p;
}

/** «Керн» (SPEC §7.4): the deck survey pentagons curl up into the tube. setU(p, yDeck, yC) is pure in its inputs. */
export function createCurl(group, n) {
  const flat = [], alpha = [];
  for (let r = HALL.deckRingStep; r <= HALL.deckR + 1e-6; r += HALL.deckRingStep) {
    for (let j = 0; j < n; j++) {
      const a0 = (2 * Math.PI * j) / n, a1 = (2 * Math.PI * (j + 1)) / n;
      const x0 = Math.sin(a0) * r, z0 = Math.cos(a0) * r, x1 = Math.sin(a1) * r, z1 = Math.cos(a1) * r;
      const len = Math.hypot(x1 - x0, z1 - z0), m = Math.max(1, Math.ceil(len / 1.2));
      for (let k = 0; k < m; k++) {
        const u0 = k / m, u1 = (k + 1) / m;
        flat.push(x0 + (x1 - x0) * u0, z0 + (z1 - z0) * u0, x0 + (x1 - x0) * u1, z0 + (z1 - z0) * u1, r / HALL.deckR);
        alpha.push(1 - 0.75 * (r / HALL.deckR));
      }
    }
  }
  const count = alpha.length;
  const seg = new Float32Array(count * 6);
  const lines = createLines({ segments: seg, alpha: new Float32Array(alpha), color: 'steel', width: 1, far: 300 });
  lines.mesh.name = 'archive:curl';
  lines.setAlpha(0);
  group.add(lines.mesh);
  let lastP = -1, lastD = NaN, lastC = NaN;
  const K = 0.22;                                               // y_band(z) = yC − 0.22·z (deck ±60 m → ±13 m of wall)
  function put(o, x, z, rn, p, yDeck, yC) {
    // Outer rings start a little later (the curl rolls outward); e = eased local progress.
    let e = (p * 1.35 - 0.35 * rn);
    e = e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e);
    const th = x / TUBE_R;
    const wx = -TUBE_R * Math.sin(th), wy = yC - K * z, wz = TUBE_R * Math.cos(th);
    seg[o] = x + (wx - x) * e;
    seg[o + 1] = yDeck + (wy - yDeck) * e + Math.sin(Math.PI * e) * 2.2 * (1 - rn);
    seg[o + 2] = z + (wz - z) * e;
  }
  return {
    lines,
    setU(p, yDeck, yC) {
      if (p === lastP && yDeck === lastD && yC === lastC) return;
      lastP = p; lastD = yDeck; lastC = yC;
      for (let s = 0; s < count; s++) {
        const f = s * 5;
        put(s * 6, flat[f], flat[f + 1], flat[f + 4], p, yDeck, yC);
        put(s * 6 + 3, flat[f + 2], flat[f + 3], flat[f + 4], p, yDeck, yC);
      }
      lines.setSegments(seg, count);
    },
    setAlpha(a) { lines.setAlpha(a); },
    dispose() { lines.dispose(); },
  };
}
