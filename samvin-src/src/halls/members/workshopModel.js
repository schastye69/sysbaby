// halls/members/workshopModel.js — the glyph editor model (ARCH §3.19; SPEC §6.2.1). Pure apart from commitGlyph's
// documented side effects (T0 WP11 imports createGlyphEditor / commitGlyph; results unchanged from the WP0 seed).
//
// createGlyphEditor: press on a node and drag through further nodes — each newly entered node adds an edge from the
// previous node (re-entering the same node is ignored; an existing edge is not duplicated, the stroke moves on);
// lift() ends the stroke; removeEdge(a, b) deletes one; clear(); max 24 edges; canSave() needs ≥ 2 edges.
// Edges are [a, b] with a < b, nodes 0…48 (row·7 + col, row 0 at the top).
import { normalizeGlyph, GRID } from '../../core/glyph.js';
import { state } from '../../core/state.js';
import { bus } from '../../core/bus.js';
import { setGlyphFavicon } from '../../ui/favicon.js';
import { status } from '../../ui/status.js';
import { secrets } from '../../secrets/secrets.js';

const LAST = GRID * GRID - 1;

/** → { edges, enter(node), lift(), removeEdge(a, b), clear(), canSave() } */
export function createGlyphEditor(opts = {}) {
  const max = opts.maxEdges || 24;
  const onNode = typeof opts.onNode === 'function' ? opts.onNode : null;
  const onChange = typeof opts.onChange === 'function' ? opts.onChange : null;
  const edges = Array.isArray(opts.edges) ? normalizeGlyph(opts.edges).slice(0, max) : [];
  let prev = -1;
  const idx = (a, b) => edges.findIndex((e) => e[0] === a && e[1] === b);
  const changed = () => { if (onChange) onChange(edges); };
  const editor = {
    edges,
    enter(node) {
      const n = node | 0;
      if (n < 0 || n > LAST || n === prev) return false;
      let added = false;
      if (prev >= 0) {
        const a = Math.min(prev, n), b = Math.max(prev, n);
        if (idx(a, b) < 0 && edges.length < max) { edges.push([a, b]); added = true; }
      }
      prev = n;
      if (onNode) onNode(n);
      if (added) changed();
      return added;
    },
    lift() { prev = -1; },
    removeEdge(a, b) {
      const k = idx(Math.min(a, b), Math.max(a, b));
      if (k < 0) return false;
      edges.splice(k, 1);
      changed();
      return true;
    },
    clear() { if (!edges.length) return; edges.length = 0; prev = -1; changed(); },
    canSave() { return edges.length >= 2; },
  };
  return editor;
}

/** Saves his glyph: state.glyph, favicon, 'glyph:saved', status 'glyph.saved', secrets.discover('S06', {anchor}). */
export function commitGlyph(edges, anchor) {
  const g = normalizeGlyph(edges);
  if (g.length < 2) return;
  state.set('glyph', g.map((e) => e.slice()));
  setGlyphFavicon(g);
  bus.emit('glyph:saved', { edges: g.map((e) => e.slice()) });
  status.say('glyph.saved');
  secrets.discover('S06', { anchor: anchor || null });
}

// Columns 0…6 → G A B D E G A (the G3 pentatonic); rows → octave, top highest, two octaves over the 7 rows
// (the same rule glyphNotes uses for an edge's midpoint cell).
const DEGREE_HZ = [196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0];

/** → the note (Hz) of node i (0…48) entered in the WORKSHOP grid (SPEC §6.2.1 «Each node entered plays its note»). */
export function nodeHz(i) {
  const n = Math.max(0, Math.min(LAST, i | 0));
  const col = n % GRID, row = Math.floor(n / GRID);
  return Math.round(DEGREE_HZ[col] * Math.pow(2, Math.round((GRID - 1 - row) / 3)) * 100) / 100;
}
