// key/litNodes.js — lit nodes (ARCH §3.18.1, §6.1.5 seed; SPEC §3.1 "Lit nodes", §3.10). Owner after the gate: WP1.
//
// sigilNodes(sigil) → Vector3[] Key-local: the lattice crossings (intersections of the two generator families of
// stratum 3, exactly as world/structure.js lays them out) on faces 11, 0 and 1, mapped from the 7×7 sigil grid (the grid
// spans the three faces horizontally and the stratum height vertically, 10 % margins), ordered along the sigil's edges
// (each edge is sampled every grid unit; each sample takes its nearest crossing; duplicates dropped, edge order kept),
// skipping crossings within 0.06 m of the aperture centre. Node k lights when distinctDays ≥ k (state.litNodes).
//
// createLitNodes({ scale, dotPx, emitterM }) → { object, setCount(n), setNight(b), dispose() }
//   scale 1      — 1.5 px --ember dots (createPoints), for the Key (attach to stratum 3's group).
//   scale ≥ 1000 — 1.2 m --ember emitters (one instanced draw call), for VIN levels (attach inside the ×1000^j group).
//   Positions are Key-local, pushed 3 mm outward so they never z-fight the face. setNight(b) → 70 % warm.
import { Vector3 } from 'three';
import { STRATA_GEOM, radiusAt, LIT_NODES, NIGHT } from '../core/tokens.js';
import { normalizeGlyph, nodeXY } from '../core/glyph.js';
import { generatorParam } from '../world/structure.js';
import { createPoints } from '../render/points.js';
import { createEmitterBatch } from '../render/glow.js';
import { WORLD } from '../data/world.js';

const ST = STRATA_GEOM[LIT_NODES.stratum];
const DELTA = ST.n / ST.k;                      // generator spacing in face units (1/24 face)
const ROWS = Math.floor(1.5 / DELTA - 0.5) + 1; // crossing rows between the rings (t_m = (m + ½)·Δ / 1.5)
const PUSH = 0.003;

/** Crossing nearest to perimeter parameter s* (face units, face 0 = [0, 1)) and height fraction t* (0 top … 1 bottom). */
function nearestCrossing(sStar, tStar) {
  let m = Math.round((tStar * 1.5) / DELTA - 0.5);
  m = Math.max(0, Math.min(ROWS - 1, m));
  const t = ((m + 0.5) * DELTA) / 1.5;
  const base = generatorParam(ST, 1, 0, t);      // family + at g = 0
  const g = Math.round((sStar - base) / DELTA);
  return { s: base + g * DELTA, t, key: `${m}:${g}` };
}

function crossingPoint(s, t, out) {
  const y = ST.top + (ST.bot - ST.top) * t;
  const r = radiusAt(y);
  const n = ST.n;
  const w = ((s % n) + n) % n;
  const j = Math.floor(w), f = w - j;
  const a0 = (Math.PI * 2 * j) / n - Math.PI / n, a1 = a0 + (Math.PI * 2) / n;
  return out.set(Math.sin(a0) * r + (Math.sin(a1) - Math.sin(a0)) * r * f, y, Math.cos(a0) * r + (Math.cos(a1) - Math.cos(a0)) * r * f);
}

/** → Vector3[] Key-local positions, ordered along the sigil */
export function sigilNodes(sigil) {
  const edges = normalizeGlyph(sigil || []);
  const out = [];
  const seen = new Set();
  const gridS = (col) => -1 + 3 * (0.1 + 0.8 * col);   // col, row as 0..1 (nodeXY)
  const gridT = (row) => 0.1 + 0.8 * row;
  for (const [a, b] of edges) {
    const A = nodeXY(a), B = nodeXY(b);
    const len = Math.hypot((B.x - A.x) * 6, (B.y - A.y) * 6);
    const steps = Math.max(1, Math.round(len));
    for (let q = 0; q <= steps; q++) {
      const u = q / steps;
      const c = nearestCrossing(gridS(A.x + (B.x - A.x) * u), gridT(A.y + (B.y - A.y) * u));
      if (seen.has(c.key)) continue;
      seen.add(c.key);
      const p = crossingPoint(c.s, c.t, new Vector3());
      if (Math.hypot(p.x, p.y) < LIT_NODES.apertureSkip) continue;
      out.push(p);
    }
  }
  return out;
}

/** opts: { scale = 1 (1 | 1000 | 1e6), dotPx = 1.5, emitterM = 1.2, nodes?: Vector3[] (default: the clan sigil) } */
export function createLitNodes(opts = {}) {
  const scale = opts.scale || 1;
  const nodes = opts.nodes || sigilNodes(WORLD.clan.sigil);
  const pos = new Float32Array(Math.max(1, nodes.length) * 3);
  nodes.forEach((p, i) => {
    const rl = Math.hypot(p.x, p.z) || 1;
    pos[i * 3] = p.x + (p.x / rl) * PUSH; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z + (p.z / rl) * PUSH;
  });
  let count = 0;
  let night = false;
  const nightA = NIGHT && NIGHT.litAlpha != null ? NIGHT.litAlpha : 0.7;

  if (scale < 1000) {
    const pts = createPoints({ positions: pos, count: 0, sizePx: opts.dotPx || LIT_NODES.dotPx, color: 'ember', alpha: 1 });
    pts.object.name = 'litNodes';
    pts.object.renderOrder = 3;
    return {
      object: pts.object, nodes,
      get count() { return count; },
      setCount(n) { count = Math.max(0, Math.min(nodes.length, n | 0)); pts.setCount(count); pts.object.visible = count > 0; },
      setNight(b) { night = !!b; pts.setAlpha(night ? nightA : 1); },
      dispose() { pts.dispose(); },
    };
  }
  const batch = createEmitterBatch({ positions: pos, count: 0, color: 'ember', radius: (opts.emitterM || LIT_NODES.emitterM) / scale,
    intensity: 1, night: false });
  batch.object.name = 'litNodes';
  return {
    object: batch.object, nodes,
    get count() { return count; },
    setCount(n) { count = Math.max(0, Math.min(nodes.length, n | 0)); batch.setCount(count); },
    setNight(b) { night = !!b; batch.setIntensity(night ? nightA : 1); },
    dispose() { batch.dispose(); },
  };
}
