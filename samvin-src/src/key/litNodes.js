// key/litNodes.js — MINIMAL placeholder written by WP0 stage 0A (core/state.js needs sigilNodes(...).length for
// state.litNodes). Stage 0B replaces it with the real seed of ARCH §6.1.5: lattice crossings (generator family
// intersections) on faces 11, 0, 1 of stratum 3, and createLitNodes() built on createPoints / createEmitter.
// Until then sigilNodes returns one Key-local point per distinct sigil node (edge order), mapped from the 7×7 grid
// onto the three front faces (10 % margins), skipping points within 0.06 m of the aperture centre.
import { Vector3, Group } from 'three';
import { STRATA_GEOM, radiusAt, LIT_NODES } from '../core/tokens.js';
import { normalizeGlyph } from '../core/glyph.js';

/** → Vector3[] Key-local positions, ordered along the sigil */
export function sigilNodes(sigil) {
  const s = STRATA_GEOM[LIT_NODES.stratum];
  const edges = normalizeGlyph(sigil);
  const seen = new Set();
  const out = [];
  const span = (Math.PI * 2 / s.n) * 3;            // three faces (11, 0, 1) centred on face 0 (+Z)
  for (const e of edges) {
    for (const node of e) {
      if (seen.has(node)) continue;
      seen.add(node);
      const col = node % 7, row = Math.floor(node / 7);
      const a = (-0.5 + 0.1 + 0.8 * (col / 6)) * span;
      const y = s.top - (0.1 + 0.8 * (row / 6)) * (s.top - s.bot);
      const r = radiusAt(y) * Math.cos(Math.PI / s.n);
      const p = new Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
      if (Math.hypot(p.x, p.y) < LIT_NODES.apertureSkip) continue;
      out.push(p);
    }
  }
  return out;
}

/** Placeholder: an empty group with the LitNodes API (0B implements the dots / emitters). */
export function createLitNodes(opts = {}) {
  void opts;
  const group = new Group();
  return { group, object: group, count: 0, setCount(n) { this.count = n | 0; }, setNight() {}, update() {}, dispose() {} };
}
