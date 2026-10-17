// core/glyph.js — the 7×7 glyph grid shared by the sigil, member glyphs and his МАСТЕРСКАЯ glyph (ARCH §3.19, §4.2).
//   node = row·7 + col, rows/cols 0…6, row 0 at the top; node 24 is the centre. An edge is [a, b] with a < b.

export const GRID = 7;
const LAST = GRID * GRID - 1;   // 48
const MAX_EDGES = 24;

/** → { x: col/6, y: row/6 } (0..1, y down) */
export function nodeXY(i) {
  const n = Math.max(0, Math.min(LAST, i | 0));
  return { x: (n % GRID) / (GRID - 1), y: Math.floor(n / GRID) / (GRID - 1) };
}

function toInt(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? Math.round(v) : NaN;
  if (typeof v === 'string' && v.trim() !== '') { const n = Number(v.trim()); return Number.isFinite(n) ? Math.round(n) : NaN; }
  return NaN;
}

/** → number[][]: valid pairs only (0…48, a ≠ b), each ordered [min, max], duplicates dropped (first wins), ≤ 24, original
 *  order kept. Never throws; a non-array gives []. */
export function normalizeGlyph(edges) {
  const out = [];
  if (!Array.isArray(edges)) return out;
  const seen = new Set();
  for (let i = 0; i < edges.length && out.length < MAX_EDGES; i++) {
    const e = edges[i];
    if (!Array.isArray(e) || e.length !== 2) continue;
    const a = toInt(e[0]), b = toInt(e[1]);
    if (!(a >= 0 && a <= LAST && b >= 0 && b <= LAST) || a === b) continue;
    const lo = Math.min(a, b), hi = Math.max(a, b);
    const key = lo * 64 + hi;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([lo, hi]);
  }
  return out;
}

/** Draws the glyph into a 2D canvas context, inside the square (x, y, size). opts.dots also draws the 49 grid dots. */
export function drawGlyph(ctx2d, edges, opts = {}) {
  const { x = 0, y = 0, size = 64, lineWidth = 2, color = '#B8C4D0', dots = false } = opts;
  const list = normalizeGlyph(edges);
  const px = (i) => x + ((i % GRID) / (GRID - 1)) * size;
  const py = (i) => y + (Math.floor(i / GRID) / (GRID - 1)) * size;
  ctx2d.save();
  if (dots) {
    ctx2d.fillStyle = color;
    const r = Math.max(0.75, lineWidth * 0.5);
    for (let i = 0; i <= LAST; i++) { ctx2d.beginPath(); ctx2d.arc(px(i), py(i), r, 0, Math.PI * 2); ctx2d.fill(); }
  }
  if (list.length) {
    ctx2d.strokeStyle = color;
    ctx2d.lineWidth = lineWidth;
    ctx2d.lineCap = 'round';
    ctx2d.lineJoin = 'round';
    ctx2d.beginPath();
    for (let k = 0; k < list.length; k++) {
      const [a, b] = list[k];
      ctx2d.moveTo(px(a), py(a));
      ctx2d.lineTo(px(b), py(b));
    }
    ctx2d.stroke();
  }
  ctx2d.restore();
}

/** → Float32Array of xyz pairs (6 floats per edge), centred on the origin, y up, z = 0, spanning `size` metres. */
export function glyphSegments(edges, size = 1) {
  const list = normalizeGlyph(edges);
  const out = new Float32Array(list.length * 6);
  const s = size / (GRID - 1);
  const h = size / 2;
  for (let k = 0; k < list.length; k++) {
    for (let j = 0; j < 2; j++) {
      const n = list[k][j];
      out[k * 6 + j * 3] = (n % GRID) * s - h;
      out[k * 6 + j * 3 + 1] = h - Math.floor(n / GRID) * s;
      out[k * 6 + j * 3 + 2] = 0;
    }
  }
  return out;
}

// Columns 0…6 → G A B D E G A (G3 pentatonic); rows → octave, top highest, 2-octave span over the 7 rows.
const DEGREE_HZ = [196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0];

/** → Hz per edge (one note per edge, in edge order). The note of an edge is taken at its midpoint cell. */
export function glyphNotes(edges) {
  const list = normalizeGlyph(edges);
  const out = new Array(list.length);
  for (let k = 0; k < list.length; k++) {
    const [a, b] = list[k];
    const col = Math.round(((a % GRID) + (b % GRID)) / 2);
    const row = Math.round((Math.floor(a / GRID) + Math.floor(b / GRID)) / 2);
    const octave = Math.round((GRID - 1 - row) / 3);   // row 0 → +2 octaves … row 6 → +0
    out[k] = Math.round(DEGREE_HZ[col] * Math.pow(2, octave) * 100) / 100;
  }
  return out;
}
