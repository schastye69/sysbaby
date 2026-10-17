// key/signs.js — WP1. Everything the Key engraves into the R4 height atlas (SPEC §3.1 "Signs", "Decoration",
// "Personal marks"; SPEC-ADDENDUM A3.3; ARCH §3.5.5, X§2.2.6). Painters draw WHITE on transparent in region-local px;
// the atlas turns them into height (R) + the 45 % base inlay (G).
//   sign:0…6    the cryptex letters S A M • V I N — Geologica 700, 70 % of the face height, stroke ≈ 12 % of the
//               letter height (700 weight at this size); the • is the 0.004 m engraved ring round the 0.09 m aperture.
//   frieze      64 Hepta cipher cells (3–5 edges of a heptagon-plus-centre graph, seeded by cell index), 0.018 m bevels.
//   ticks       12 radial ticks per face along the top edge (0.025 m).
//   glyph:back  his МАСТЕРСКАЯ glyph (7×7 edge list), engraved on stratum 3 face 5 (A3.3: moved from face 6).
//   code:i      a КОДЕКС law, one line of Geologica 700 sized to the band (cap height per STRATA_CODE_BAND).
import { STRATA_GEOM, CODE_FIT } from '../world/structure.js';
import { atlas } from '../render/engraveAtlas.js';
import { normalizeGlyph } from '../core/glyph.js';
import { mulberry32 } from '../core/rng.js';
import { CANVAS_FONT, SIGNS, KEY } from '../core/tokens.js';

const TAU = Math.PI * 2;
const font = (px) => CANVAS_FONT.sign.replace('{px}', String(Math.max(4, Math.round(px))));

/** Letter cap height / centre (fractions of the region) per stratum: the apex strata narrow to a point, so their letter
 *  sits in the wide part of the face (S low, N high — the camera looks down onto S's base; I's rim overhangs N). */
const CAP = [0.6, 0.9, 0.9, 0, 0.9, 0.9, 0.6];
const CY = [0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.44];

function sign(c, w, h, i, inlay) {
  c.fillStyle = c.strokeStyle = '#fff';
  if (SIGNS[i] === '•') {
    const S = KEY.sign.heightFrac * STRATA_GEOM[3].height, k = w / S;
    const r = (KEY.apertureD / 2 + 0.0045) * k, rw = KEY.ringEngraveW * k;
    c.lineWidth = inlay ? 1 : Math.max(1.5, rw);
    for (const rr of inlay ? [r - rw / 2, r + rw / 2] : [r]) { c.beginPath(); c.arc(w / 2, h / 2, rr, 0, TAU); c.stroke(); }
    return;
  }
  const cap = CAP[i] * h;
  c.font = font(cap * 1.38);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const m = c.measureText(SIGNS[i]);
  const y = CY[i] * h + ((m.actualBoundingBoxAscent || cap) - (m.actualBoundingBoxDescent || 0)) / 2;
  if (inlay) { c.lineWidth = 1; c.strokeText(SIGNS[i], w / 2, y); } else c.fillText(SIGNS[i], w / 2, y);
}

/** The Hepta graph: node 0 = centre, 1…7 = heptagon vertices (one flat side down). Edges: 7 spokes + 7 rim sides. */
const HEPTA_EDGES = [];
for (let v = 1; v <= 7; v++) { HEPTA_EDGES.push([0, v]); HEPTA_EDGES.push([v, (v % 7) + 1]); }
function heptaCell(c, x0, w, h, idx, inlay) {
  const rnd = mulberry32(idx * 7919 + 17);
  const k = 3 + Math.floor(rnd() * 3);                    // 3–5 edges
  const pool = HEPTA_EDGES.slice();
  const cx = x0 + w / 2, cy = h / 2, rx = w * 0.34, ry = h * 0.36;
  const P = (n) => (n === 0 ? [cx, cy] : [cx + Math.sin((TAU * (n - 1)) / 7 + Math.PI / 7) * rx, cy - Math.cos((TAU * (n - 1)) / 7 + Math.PI / 7) * ry]);
  c.beginPath();
  for (let e = 0; e < k; e++) {
    const [a, b] = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
    const A = P(a), B = P(b);
    c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]);
  }
  c.lineWidth = inlay ? 0.75 : Math.max(1, h * 0.07);
  c.lineCap = 'round';
  c.stroke();
}
function frieze(c, w, h, inlay) {
  c.strokeStyle = '#fff';
  const cw = w / 64;
  for (let i = 0; i < 64; i++) heptaCell(c, i * cw, cw, h, i, inlay);
}

function ticks(c, w, h, inlay) {
  c.fillStyle = '#fff';
  const n = KEY.ticksPerFace;
  for (let k = 0; k < n; k++) {
    const x = ((k + 0.5) / n) * w, len = (k % 3 === 1 ? 0.95 : 0.7) * h;    // every third tick runs the full 0.025 m
    if (inlay) c.fillRect(Math.round(x), 0, 1, len); else c.fillRect(x - 1, 0, 2, len);
  }
}

function glyph(c, w, h, edges, inlay) {
  const list = normalizeGlyph(edges);
  if (!list.length) return;
  // The sign square spans 0.364 m on the • face; the glyph takes its middle 62 % (≈ 0.23 m), strokes ≈ 7 mm.
  const s = w * 0.62, x0 = (w - s) / 2, y0 = (h - s) / 2, q = s / 6;
  c.strokeStyle = c.fillStyle = '#fff';
  c.lineCap = c.lineJoin = 'round';
  c.lineWidth = inlay ? 1 : Math.max(1.5, w * 0.026);
  c.beginPath();
  for (const [a, b] of list) { c.moveTo(x0 + (a % 7) * q, y0 + Math.floor(a / 7) * q); c.lineTo(x0 + (b % 7) * q, y0 + Math.floor(b / 7) * q); }
  c.stroke();
  if (inlay) return;
  // Drilled nodes at every used grid point (the WORKSHOP grid's nodes, cut deeper than the strokes).
  const used = new Set();
  for (const e of list) { used.add(e[0]); used.add(e[1]); }
  for (const n of used) { c.beginPath(); c.arc(x0 + (n % 7) * q, y0 + Math.floor(n / 7) * q, c.lineWidth * 0.85, 0, TAU); c.fill(); }
}

/** One line of law text, centred, cap height filling ≈ 75 % of the 8:1 strip (the band already holds 80 % of the face
 *  width at its centre: X§2.2.6), shrunk only if a long text would overflow. */
function law(c, w, h, text, inlay, i) {
  c.fillStyle = c.strokeStyle = '#fff';
  let px = h * 0.75 * 1.38, fit = 1;
  c.font = font(px);
  const tw = c.measureText(text).width;
  if (tw > w * 0.98) { fit = (w * 0.98) / tw; px *= fit; c.font = font(px); }
  CODE_FIT[i] = fit;                                    // codeCapHeightM reports the true engraved cap (A3.3)
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const m = c.measureText(text);
  const y = h / 2 + ((m.actualBoundingBoxAscent || px * 0.72) - (m.actualBoundingBoxDescent || 0)) / 2;
  if (inlay) { c.lineWidth = 1; c.strokeText(text, w / 2, y); } else c.fillText(text, w / 2, y);
}

const P2 = (fn) => ({ height: (c, w, h) => fn(c, w, h, false), inlay: (c, w, h) => fn(c, w, h, true) });

export const signs = {
  /** Paints signs, frieze and ticks (boot and again once the fonts are in). */
  paintStatic() {
    for (let i = 0; i < 7; i++) atlas.draw(`sign:${i}`, P2((c, w, h, inl) => sign(c, w, h, i, inl)));
    atlas.draw('frieze', P2(frieze));
    atlas.draw('ticks', P2(ticks));
  },
  /** His glyph on the • back (face 5); null / [] clears it. */
  paintGlyph(edges) { atlas.draw('glyph:back', P2((c, w, h, inl) => glyph(c, w, h, edges, inl))); },
  /** КОДЕКС law i. → ms spent (the ≤ 6 ms budget is logged in dev builds). */
  paintLaw(i, text) {
    const t0 = performance.now();
    CODE_FIT[i] = 1;
    atlas.draw(`code:${i}`, P2((c, w, h, inl) => { if (text) law(c, w, h, text, inl, i); }));
    const ms = performance.now() - t0;
    if (__DEV__) (window.__keyLawMs || (window.__keyLawMs = [])).push(ms);
    return ms;
  },
};
