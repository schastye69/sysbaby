// halls/insignia/shapes.js — WP9: the vault's solids (ARCH §3.19, §4.3.5; SPEC §6.6 relics, НАХОДКИ, КАПСУЛА). three.js.
//
// buildRelicGeometry(shape, size) → { solid: indexed BufferGeometry (largest extent = size, centred), edges: Float32Array
//   xyz pairs, flat: { pos, nrm } non-indexed Float32Arrays for the vault's CPU batch }:
//   stellated — two interpenetrating tetrahedra (the stella octangula: the second is the first turned 90° about y);
//   twisted   — pentagonal prism, 3 segments, 72° twist;
//   nested    — three tetrahedra, 1 / 0.62 / 0.38, alternating orientation: the two outer ones are hairline frames,
//               the 0.38 core is the solid (an opaque outer shell would hide the nesting it is named for);
//   bipyramid — heptagonal bipyramid;
//   knot      — torus knot (2, 3) as a tube of radius 0.08·size, smooth; its edges are four rails along the tube.
// Polyhedra are faceted (flat normals); the knot keeps smooth normals.
// buildShardGeometry(seed, len) — a slim tetrahedral sliver (len along +y), one per found secret.
// buildCapsuleGeometry() — the 0.8 m time capsule (octagonal, axis x) as two halves split at x = 0 (body, lid).
// relicIconSvg(shape, sizePx) → SVG path `d` only (one distinct line icon per shape in a sizePx box; no markup).
import { BufferGeometry, Float32BufferAttribute, TetrahedronGeometry, TorusKnotGeometry, EdgesGeometry, Matrix4 } from 'three';
import { mulberry32 } from '../../core/rng.js';

export const SHAPES = Object.freeze(['stellated', 'twisted', 'nested', 'bipyramid', 'knot']);
const TAU = Math.PI * 2;

function fromTris(verts, tris) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(verts, 3));
  g.setIndex(tris);
  return g;
}
/** Concatenates geometries into one indexed geometry (no welding: faces of different solids stay separate). */
function merge(geos) {
  const v = [], t = [];
  for (const g of geos) {
    const p = g.attributes.position.array, base = v.length / 3;
    for (let i = 0; i < p.length; i++) v.push(p[i]);
    if (g.index) { const ix = g.index.array; for (let i = 0; i < ix.length; i++) t.push(base + ix[i]); }
    else for (let i = 0; i < p.length / 3; i++) t.push(base + i);
    g.dispose();
  }
  return fromTris(v, t);
}
function tetra(r, flip) {
  const g = new TetrahedronGeometry(r, 0);
  if (flip) g.applyMatrix4(new Matrix4().makeRotationY(Math.PI / 2));
  return g;
}
function twisted() {
  const n = 5, segs = 3, R = 1, H = 1.6, tw = (72 * Math.PI) / 180;
  const v = [], t = [];
  for (let s = 0; s <= segs; s++) {
    const y = -H / 2 + (H * s) / segs, rot = (tw * s) / segs;
    for (let j = 0; j < n; j++) { const a = (TAU * j) / n + rot; v.push(Math.sin(a) * R, y, Math.cos(a) * R); }
  }
  for (let s = 0; s < segs; s++) for (let j = 0; j < n; j++) {
    const a = s * n + j, b = s * n + ((j + 1) % n), c = a + n, d = b + n;
    t.push(a, b, d, a, d, c);
  }
  const top = v.length / 3; v.push(0, H / 2, 0);
  const bot = v.length / 3; v.push(0, -H / 2, 0);
  for (let j = 0; j < n; j++) { t.push(top, segs * n + j, segs * n + ((j + 1) % n)); t.push(bot, (j + 1) % n, j); }
  return fromTris(v, t);
}
function bipyramid() {
  const n = 7, v = [0, 1, 0, 0, -1, 0], t = [];
  for (let j = 0; j < n; j++) { const a = (TAU * j) / n; v.push(Math.sin(a) * 0.62, 0, Math.cos(a) * 0.62); }
  for (let j = 0; j < n; j++) { const a = 2 + j, b = 2 + ((j + 1) % n); t.push(0, a, b, 1, b, a); }
  return fromTris(v, t);
}
/** Feature edges (≥ 30° crease) of an indexed or plain geometry → Float32Array xyz pairs. */
function creases(g, deg = 30) {
  const e = new EdgesGeometry(g, deg);
  const out = Float32Array.from(e.attributes.position.array);
  e.dispose();
  return out;
}
/** Non-indexed position + normal arrays; flat = faceted normals, else the geometry's own (smooth) normals. */
function flatArrays(g, faceted) {
  let n;
  if (faceted) { n = g.index ? g.toNonIndexed() : g.clone(); n.computeVertexNormals(); }
  else { g.computeVertexNormals(); n = g.index ? g.toNonIndexed() : g.clone(); }
  const out = { pos: Float32Array.from(n.attributes.position.array), nrm: Float32Array.from(n.attributes.normal.array) };
  n.dispose();
  if (faceted) {
    // outward facets whatever the source winding (the vault draws both sides; shading needs the outer normal)
    const P = out.pos, N = out.nrm;
    for (let q = 0; q < P.length; q += 9) {
      const cx = P[q] + P[q + 3] + P[q + 6], cy = P[q + 1] + P[q + 4] + P[q + 7], cz = P[q + 2] + P[q + 5] + P[q + 8];
      if (cx * N[q] + cy * N[q + 1] + cz * N[q + 2] < 0) for (let i = 0; i < 9; i++) N[q + i] = -N[q + i];
    }
  }
  return out;
}
/** Uniform fit: centre the box on the origin and scale so the largest extent = size (applied to edge arrays too). */
function fit(g, extra, size) {
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const ext = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z) || 1;
  const k = size / ext, cx = (bb.max.x + bb.min.x) / 2, cy = (bb.max.y + bb.min.y) / 2, cz = (bb.max.z + bb.min.z) / 2;
  g.translate(-cx, -cy, -cz);
  g.scale(k, k, k);
  for (const a of extra) for (let i = 0; i < a.length; i += 3) { a[i] = (a[i] - cx) * k; a[i + 1] = (a[i + 1] - cy) * k; a[i + 2] = (a[i + 2] - cz) * k; }
}

/** → { solid, edges, flat } */
export function buildRelicGeometry(shape, size = 1) {
  let g, edges, faceted = true;
  switch (shape) {
    case 'stellated': g = merge([tetra(1, false), tetra(1, true)]); edges = creases(g); break;
    case 'twisted': g = twisted(); edges = creases(g); break;
    case 'nested': {
      const shells = [tetra(1, false), tetra(0.62, true)];
      const parts = shells.map((s) => creases(s, 1));
      shells.forEach((s) => s.dispose());
      g = tetra(0.38, false);
      parts.push(creases(g, 1));
      edges = new Float32Array(parts.reduce((a, p) => a + p.length, 0));
      let o = 0;
      for (const p of parts) { edges.set(p, o); o += p.length; }
      // fit by the outer frame (the core is small inside it)
      const box = tetra(1, false);
      box.computeBoundingBox();
      const bb = box.boundingBox;
      const ext = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);
      const cx = (bb.max.x + bb.min.x) / 2, cy = (bb.max.y + bb.min.y) / 2, cz = (bb.max.z + bb.min.z) / 2;
      box.dispose();
      const k = size / ext;
      g.translate(-cx, -cy, -cz); g.scale(k, k, k);
      for (let i = 0; i < edges.length; i += 3) { edges[i] = (edges[i] - cx) * k; edges[i + 1] = (edges[i + 1] - cy) * k; edges[i + 2] = (edges[i + 2] - cz) * k; }
      g.computeVertexNormals(); g.computeBoundingSphere();
      return { solid: g, edges, flat: flatArrays(g, true) };
    }
    case 'bipyramid': g = bipyramid(); edges = creases(g); break;
    case 'knot':
    default: {
      const TS = 96, RS = 8;
      g = new TorusKnotGeometry(1, 0.256, TS, RS, 2, 3);          // tube 0.256 / extent 3.32 ≈ 0.08 after the fit
      const p = g.attributes.position.array, rails = [];
      for (const j of [0, 2, 4, 6]) {
        for (let i = 0; i < TS; i++) {
          const a = (i * (RS + 1) + j) * 3, b = ((i + 1) * (RS + 1) + j) * 3;
          rails.push(p[a], p[a + 1], p[a + 2], p[b], p[b + 1], p[b + 2]);
        }
      }
      edges = Float32Array.from(rails);
      faceted = false;
      break;
    }
  }
  fit(g, [edges], size);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return { solid: g, edges, flat: flatArrays(g, faceted) };
}

/** A slim tetrahedral sliver, `len` m along +y (seeded per secret so no two are alike). → { flat, edges } */
export function buildShardGeometry(seed = 1, len = 0.4) {
  const rnd = mulberry32(seed >>> 0 || 1);
  const h = len / 2, w = len * 0.13;
  const a0 = rnd() * TAU;
  const v = [(rnd() - 0.5) * w * 0.4, h, (rnd() - 0.5) * w * 0.4];
  for (let k = 0; k < 3; k++) {
    const a = a0 + (TAU * k) / 3 + (rnd() - 0.5) * 0.5, r = w * (0.7 + 0.6 * rnd());
    v.push(Math.sin(a) * r, -h + len * 0.08 * rnd(), Math.cos(a) * r);
  }
  const g = fromTris(v, [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2]);
  const edges = new Float32Array(36);
  const E = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
  E.forEach(([a, b], k) => { for (let c = 0; c < 3; c++) { edges[k * 6 + c] = v[a * 3 + c]; edges[k * 6 + 3 + c] = v[b * 3 + c]; } });
  const flat = flatArrays(g, true);
  // the winding above is not guaranteed outward for every seed: flip faces whose normal points to the centroid
  for (let t = 0; t < flat.pos.length; t += 9) {
    const cx = (flat.pos[t] + flat.pos[t + 3] + flat.pos[t + 6]) / 3, cy = (flat.pos[t + 1] + flat.pos[t + 4] + flat.pos[t + 7]) / 3, cz = (flat.pos[t + 2] + flat.pos[t + 5] + flat.pos[t + 8]) / 3;
    const d = cx * flat.nrm[t] + cy * flat.nrm[t + 1] + cz * flat.nrm[t + 2];
    if (d < 0) for (let i = 0; i < 9; i++) flat.nrm[t + i] = -flat.nrm[t + i];
  }
  g.dispose();
  return { flat, edges };
}

/** The 0.8 m capsule: an octagonal cylinder (axis x, r 0.17) with chamfered ends, split at x = 0.
 *  → { body: {flat, edges}, lid: {flat, edges}, seam: Float32Array (the 5 fracture polylines as segments, 0..4 in order) } */
export function buildCapsuleGeometry() {
  const N = 8, R = 0.17, r = 0.12, L = 0.4, C = 0.06;
  const ring = (x, rad) => { const p = []; for (let j = 0; j < N; j++) { const a = (TAU * (j + 0.5)) / N; p.push([x, Math.sin(a) * rad, Math.cos(a) * rad]); } return p; };
  function half(sign) {
    const xs = [0, sign * (L - C), sign * L];
    const rs = [R, R, r];
    const rings = xs.map((x, i) => ring(x, rs[i]));
    const v = [], t = [];
    const push = (p) => { v.push(p[0], p[1], p[2]); return v.length / 3 - 1; };
    const ids = rings.map((rg) => rg.map(push));
    for (let k = 0; k < 2; k++) for (let j = 0; j < N; j++) {
      const a = ids[k][j], b = ids[k][(j + 1) % N], c = ids[k + 1][j], d = ids[k + 1][(j + 1) % N];
      if (sign > 0) t.push(a, c, d, a, d, b); else t.push(a, d, c, a, b, d);
    }
    const cEnd = push([sign * L, 0, 0]), cMid = push([0, 0, 0]);
    for (let j = 0; j < N; j++) {
      const a = ids[2][j], b = ids[2][(j + 1) % N];
      if (sign > 0) t.push(cEnd, a, b); else t.push(cEnd, b, a);
      const m = ids[0][j], n = ids[0][(j + 1) % N];
      if (sign > 0) t.push(cMid, n, m); else t.push(cMid, m, n);
    }
    const g = fromTris(v, t);
    const e = [];
    for (let k = 0; k < 3; k++) for (let j = 0; j < N; j++) { const a = rings[k][j], b = rings[k][(j + 1) % N]; e.push(...a, ...b); }
    for (let k = 0; k < 2; k++) for (let j = 0; j < N; j++) { const a = rings[k][j], b = rings[k + 1][j]; e.push(...a, ...b); }
    const out = { flat: flatArrays(g, true), edges: Float32Array.from(e) };
    // outward normals (the hand-wound fan can face inward on one side): flip toward the outside of the half
    const P = out.flat.pos, Nn = out.flat.nrm;
    for (let q = 0; q < P.length; q += 9) {
      const cx = (P[q] + P[q + 3] + P[q + 6]) / 3 - sign * L / 2, cy = (P[q + 1] + P[q + 4] + P[q + 7]) / 3, cz = (P[q + 2] + P[q + 5] + P[q + 8]) / 3;
      if (cx * Nn[q] + cy * Nn[q + 1] + cz * Nn[q + 2] < 0) for (let i = 0; i < 9; i++) Nn[q + i] = -Nn[q + i];
    }
    g.dispose();
    return out;
  }
  // Five fracture lines: zig-zag paths over the surface, each 7 segments, spreading from the seam toward the ends.
  const rnd = mulberry32(0x5c12);
  const seam = [];
  for (let k = 0; k < 5; k++) {
    const a0 = (TAU * k) / 5 + 0.3, dir = k % 2 ? 1 : -1;
    let x = 0, a = a0;
    for (let s = 0; s < 7; s++) {
      const nx = x + dir * (0.03 + 0.035 * rnd()), na = a + (rnd() - 0.5) * 0.7;
      const rr = R * 1.003;
      seam.push(x, Math.sin(a) * rr, Math.cos(a) * rr, nx, Math.sin(na) * rr, Math.cos(na) * rr);
      x = nx; a = na;
    }
  }
  return { body: half(-1), lid: half(1), seam: Float32Array.from(seam) };
}

/** → SVG path `d` (one stroke-only icon per shape in a sizePx × sizePx box). */
export function relicIconSvg(shape, sizePx = 24) {
  const s = sizePx, c = s / 2, r = s * 0.42;
  const f = (v) => Math.round(v * 100) / 100;
  const poly = (n, rad, rot = 0, cy = c) => {
    let d = '';
    for (let j = 0; j < n; j++) {
      const a = rot + (TAU * j) / n;
      d += `${j ? 'L' : 'M'}${f(c + Math.sin(a) * rad)} ${f(cy - Math.cos(a) * rad)}`;
    }
    return `${d}Z`;
  };
  switch (shape) {
    case 'stellated': return `${poly(3, r)}${poly(3, r, Math.PI)}`;
    case 'twisted': return `${poly(5, r)}${poly(5, r * 0.55, Math.PI / 5)}M${f(c)} ${f(c - r)}L${f(c + Math.sin(Math.PI / 5) * r * 0.55)} ${f(c - Math.cos(Math.PI / 5) * r * 0.55)}`;
    case 'nested': return `${poly(3, r)}${poly(3, r * 0.62, Math.PI)}${poly(3, r * 0.38)}`;
    case 'bipyramid': return `M${f(c)} ${f(c - r)}L${f(c + r * 0.62)} ${f(c)}L${f(c)} ${f(c + r)}L${f(c - r * 0.62)} ${f(c)}ZM${f(c - r * 0.62)} ${f(c)}L${f(c + r * 0.62)} ${f(c)}`;
    case 'knot':
    default: {
      let d = '';
      for (let k = 0; k <= 96; k++) {
        const t = (TAU * k) / 96;
        const rr = r * (0.62 + 0.38 * Math.cos(3 * t));
        d += `${k ? 'L' : 'M'}${f(c + rr * Math.cos(2 * t))} ${f(c + rr * Math.sin(2 * t))}`;
      }
      return `${d}Z`;
    }
  }
}
