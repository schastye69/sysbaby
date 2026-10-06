// halls/core/resonanceModel.js — WP4 SEED, functionally correct (ARCH §3.19, §6.1.5; SPEC §3.7). Pure apart from
// nextSubject() advancing + persisting state.data.resonanceNext. WP4 may rewrite it but must keep identical results.
import { WORLD, operatorMember } from '../../data/world.js';
import { state } from '../../core/state.js';
import { mulberry32, hashStr } from '../../core/rng.js';
import { upper } from '../../core/ru.js';
import { now, isBirthday, ageOn, dayKey } from '../../core/time.js';
import { normalizeGlyph, GRID } from '../../core/glyph.js';
import { CANVAS_FONT } from '../../core/tokens.js';

/** (n, m) of the six mode steps (SPEC §3.7). */
export const MODES = Object.freeze([[1, 2], [2, 3], [1, 4], [3, 5], [2, 7], [4, 7]].map((p) => Object.freeze(p)));

/** u(x, y) = cos(nπx)cos(mπy) − cos(mπx)cos(nπy), x, y ∈ [−1, 1]. */
export function plateField(n, m, x, y) {
  const P = Math.PI;
  return Math.cos(n * P * x) * Math.cos(m * P * y) - Math.cos(m * P * x) * Math.cos(n * P * y);
}

const maxCache = new Map();
function maxAbs(n, m) {
  const k = n * 1000 + m;
  let v = maxCache.get(k);
  if (v == null) {
    v = 0;
    for (let i = 0; i <= 96; i++) for (let j = 0; j <= 96; j++) v = Math.max(v, Math.abs(plateField(n, m, -1 + i / 48, -1 + j / 48)));
    maxCache.set(k, v);
  }
  return v;
}

/** Rejection sampling of nodal lines: accept |u| < 0.08·max|u| (32 tries, else the best try). Writes `count` xy pairs
 *  into out starting at PAIR index `offset`; deterministic per (n, m, offset) — seed mulberry32(n·97 + m) (+ offset). */
export function sampleNodal(n, m, count, out, offset = 0) {
  const lim = 0.08 * maxAbs(n, m);
  const rnd = mulberry32((n * 97 + m + offset * 7919) >>> 0);
  for (let k = 0; k < count; k++) {
    let bx = 0, by = 0, bu = Infinity;
    for (let t = 0; t < 32; t++) {
      const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
      const u = Math.abs(plateField(n, m, x, y));
      if (u < bu) { bu = u; bx = x; by = y; }
      if (u < lim) break;
    }
    out[2 * (offset + k)] = bx;
    out[2 * (offset + k) + 1] = by;
  }
  return out;
}

/** Text targets inside `text` rendered in Geologica 700 on a 1024×256 canvas (alpha > 0.5), mapped to x ∈ [−1, 1],
 *  y ∈ [−0.25, 0.25]. Returns false WITHOUT writing when count < 16,384 (the grains half of the SPEC condition; the
 *  letterHeightPx ≥ 64 half is the caller's) or when nothing rasterised. */
export function sampleTextTargets(text, count, out) {
  if (count < 16384 || !text) return false;
  let c;
  try { c = document.createElement('canvas'); } catch (e) { return false; }
  c.width = 1024; c.height = 256;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return false;
  const s = String(text);
  let px = 200;
  const font = (p) => (CANVAS_FONT && CANVAS_FONT.sign ? CANVAS_FONT.sign.replace('{px}', String(p)) : `700 ${p}px Geologica, sans-serif`);
  g.font = font(px);
  const w = g.measureText(s).width;
  if (w > 960) { px = Math.floor((px * 960) / w); g.font = font(px); }
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(s, 512, 132);
  const data = g.getImageData(0, 0, 1024, 256).data;
  const hits = [];
  for (let y = 0; y < 256; y += 1) for (let x = 0; x < 1024; x += 1) if (data[(y * 1024 + x) * 4 + 3] > 127) hits.push(x, y);
  if (!hits.length) return false;
  const rnd = mulberry32(hashStr(s));
  const nHits = hits.length / 2;
  for (let k = 0; k < count; k++) {
    const h = Math.floor(rnd() * nHits);
    out[2 * k] = ((hits[2 * h] + rnd()) / 1024) * 2 - 1;
    out[2 * k + 1] = (0.5 - (hits[2 * h + 1] + rnd()) / 256) * 0.5;
  }
  return true;
}

/** Targets along the 7×7 glyph strokes, 0.035 m wide on the 1.20 m plate (grid spans 80 % of the plate). */
export function sampleGlyphTargets(edges, count, out) {
  const list = normalizeGlyph(edges);
  if (!list.length) return sampleNodal(MODES[0][0], MODES[0][1], count, out, 0);
  const span = 0.8, half = 0.035 / 1.2;                       // 1 plate unit = 0.6 m; stroke width 0.035 m
  const P = (i) => [((i % GRID) / (GRID - 1) * 2 - 1) * span, (1 - (Math.floor(i / GRID) / (GRID - 1)) * 2) * span];
  const segs = list.map(([a, b]) => { const A = P(a), B = P(b); return { A, B, len: Math.hypot(B[0] - A[0], B[1] - A[1]) }; });
  const total = segs.reduce((t, sg) => t + sg.len, 0) || 1;
  const rnd = mulberry32(hashStr(JSON.stringify(list)));
  for (let k = 0; k < count; k++) {
    let r = rnd() * total, q = 0;
    while (q < segs.length - 1 && r > segs[q].len) { r -= segs[q].len; q++; }
    const { A, B, len } = segs[q];
    const t = rnd(), o = (rnd() - 0.5) * 2 * half;
    const nx = len > 0 ? -(B[1] - A[1]) / len : 0, ny = len > 0 ? (B[0] - A[0]) / len : 1;
    out[2 * k] = A[0] + (B[0] - A[0]) * t + nx * o;
    out[2 * k + 1] = A[1] + (B[1] - A[1]) * t + ny * o;
  }
  return out;
}

/** The mode-7 subject (SPEC §3.7): operator name → 'SAM.VIN' → each member's callsign (roster order) → 'joke' (clan
 *  sigil in sand + a random affectionate joke as the BODY caption) → … The pointer persists in resonanceNext.
 *  On his birthday the subject is his age as a numeral (the pointer does not advance).
 *  → { kind:'name'|'clan'|'member'|'joke'|'age', text, glyph:number[][]|null, caption, captionClass } */
// H28e (ARCH-ADDENDUM X§2.7; SPEC-ADDENDUM A4.1 Payoff B): while guests are active the subject queue is each guest in
// selection order, then his own name last; resonanceNext is NOT advanced (his private cycle resumes untouched).
let guestKey = '', guestPos = 0;
function guestSubject(guests, sigil) {
  const key = guests.map((g) => `${g.id || ''}:${g.name || ''}`).join('|');
  if (key !== guestKey) { guestKey = key; guestPos = 0; }
  const n = guests.length + 1;
  const i = guestPos % n;
  guestPos = (guestPos + 1) % n;
  if (i < guests.length) {
    const g = guests[i];
    const m = g.id ? WORLD.members.find((x) => x.id === g.id) : null;
    const text = upper(String(g.name || (m ? m.name : '')));
    return { kind: 'guest', text, glyph: m && m.glyph && m.glyph.length ? m.glyph : sigil, caption: text, captionClass: 't-heading' };
  }
  const name = upper(WORLD.operator.name);
  const d = state.data || {};
  const own = (d.glyph && d.glyph.length) ? d.glyph : (operatorMember() && operatorMember().glyph) || sigil;
  return { kind: 'name', text: name, glyph: own, caption: name, captionClass: 't-heading' };
}

export function nextSubject(opts = { guests: [] }) {
  const t = now();
  const sigil = WORLD.clan.sigil;
  if (isBirthday(t)) {
    const age = String(ageOn(t));
    return { kind: 'age', text: age, glyph: sigil, caption: age, captionClass: 't-heading' };
  }
  const guests = opts && Array.isArray(opts.guests) ? opts.guests.filter((g) => g && (g.name || g.id)) : [];
  if (guests.length) return guestSubject(guests, sigil);
  const members = WORLD.members;
  const len = 2 + members.length + 1;
  const d = state.data || {};
  const i = ((d.resonanceNext | 0) % len + len) % len;
  if (state.data) state.set('resonanceNext', (i + 1) % len);
  if (i === 0) {
    const name = upper(WORLD.operator.name);
    const own = (d.glyph && d.glyph.length) ? d.glyph : (operatorMember() && operatorMember().glyph) || sigil;
    return { kind: 'name', text: name, glyph: own, caption: name, captionClass: 't-heading' };
  }
  if (i === 1) return { kind: 'clan', text: WORLD.clan.name, glyph: sigil, caption: WORLD.clan.name, captionClass: 't-heading' };
  if (i < 2 + members.length) {
    const m = members[i - 2];
    return { kind: 'member', text: m.callsign, glyph: m.glyph && m.glyph.length ? m.glyph : sigil, caption: m.callsign, captionClass: 't-heading' };
  }
  const jokes = WORLD.jokes.filter((j) => !j.hidden);
  const pool = jokes.length ? jokes : WORLD.jokes;
  const rnd = mulberry32(hashStr(`${dayKey(t)}:${d.resonanceNext | 0}`));
  const caption = pool.length ? pool[Math.floor(rnd() * pool.length)].text : WORLD.clan.motto;
  return { kind: 'joke', text: '', glyph: sigil, caption, captionClass: 't-body' };
}
