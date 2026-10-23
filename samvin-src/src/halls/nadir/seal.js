// halls/nadir/seal.js — WP9: the sealed NADIR plate, shared by INSIGNIA (seen 280 m below through the floor iris,
// SPEC §6.6 "Looking down") and NADIR (the first-entry fracture, SPEC §7.5 / SPEC-ADDENDUM A2.5).
// NADIR-local frame: the plate lies on the deck (y = 0) at the axis; a triangle of circumradius SEAL_R oriented like the
// N stratum (vertices at −60°, 60°, 180° from +z, VIN's n-gon convention), 0.8 m thick obsidian with silver edges.
// It is pre-scored into 5 pieces by 5 fracture lines from an off-centre point to the rim; the 5 slots sit on a
// pentagon around the centre, one inside each piece.
//   SEAL_R, SEAL_T, sealSlots() → Vector3[5] (top surface), sealPieces() → [{ flat, edges, c: Vector3 }],
//   sealCracks() → Float32Array (segments, crack k's segments contiguous, cracks in order), slotRing(r) → segments.
import { Vector3 } from 'three';
import { mulberry32 } from '../../core/rng.js';

export const SEAL_R = 16;
export const SEAL_T = 0.8;
const TAU = Math.PI * 2;
const CORNERS = [-Math.PI / 3, Math.PI / 3, Math.PI].map((a) => [Math.sin(a) * SEAL_R, Math.cos(a) * SEAL_R]);
const CENTRE = [1.1, -0.8];

/** Point on the triangle's rim at perimeter fraction f (0..1, corner 0 → 1 → 2 → 0). */
function rimAt(f) {
  const g = ((f % 1) + 1) % 1 * 3, k = Math.floor(g), u = g - k;
  const a = CORNERS[k], b = CORNERS[(k + 1) % 3];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
}
const RIM_F = [0.04, 0.23, 0.41, 0.63, 0.82];

/** The 5 crack polylines (x, z) from CENTRE to the rim, 6 jittered steps each (seeded: identical every visit). */
function crackPolys() {
  const rnd = mulberry32(0x9ad1);
  return RIM_F.map((f) => {
    const end = rimAt(f), pts = [CENTRE.slice()];
    for (let s = 1; s < 6; s++) {
      const u = s / 6, nx = -(end[1] - CENTRE[1]), nz = end[0] - CENTRE[0], l = Math.hypot(nx, nz) || 1;
      const j = (rnd() - 0.5) * 2.2;
      pts.push([CENTRE[0] + (end[0] - CENTRE[0]) * u + (nx / l) * j, CENTRE[1] + (end[1] - CENTRE[1]) * u + (nz / l) * j]);
    }
    pts.push(end);
    return pts;
  });
}

/** → Vector3[5] on the plate's top surface, one in each piece. */
export function sealSlots() {
  const out = [];
  for (let k = 0; k < 5; k++) {
    const m = rimAt((RIM_F[k] + RIM_F[(k + 1) % 5] + (k === 4 ? 1 : 0)) / 2);
    out.push(new Vector3(CENTRE[0] + (m[0] - CENTRE[0]) * 0.45, SEAL_T / 2 + 0.02, CENTRE[1] + (m[1] - CENTRE[1]) * 0.45));
  }
  return out;
}

/** → Float32Array of segments: the 5 cracks on the top surface, crack after crack (each 7 segments). */
export function sealCracks() {
  const out = [];
  for (const p of crackPolys()) for (let s = 0; s < p.length - 1; s++) out.push(p[s][0], SEAL_T / 2 + 0.03, p[s][1], p[s + 1][0], SEAL_T / 2 + 0.03, p[s + 1][1]);
  return Float32Array.from(out);
}

/** A slot ring of radius r (16 segments) around the origin in the xz plane → segments. */
export function slotRing(r) {
  const out = [];
  for (let q = 0; q < 16; q++) {
    const a0 = (TAU * q) / 16, a1 = (TAU * (q + 1)) / 16;
    out.push(Math.sin(a0) * r, 0, Math.cos(a0) * r, Math.sin(a1) * r, 0, Math.cos(a1) * r);
  }
  return Float32Array.from(out);
}

/** Prism of a simple polygon (x, z) with thickness SEAL_T centred on y = 0 → { flat, edges, c }. Positions are relative
 *  to the piece centroid c (so a piece can tumble about its own centre). Fan triangulation from the centroid. */
function prism(poly) {
  let cx = 0, cz = 0;
  for (const p of poly) { cx += p[0]; cz += p[1]; }
  cx /= poly.length; cz /= poly.length;
  const h = SEAL_T / 2, n = poly.length;
  const pos = [], nrm = [], edges = [];
  const tri = (a, b, c, N) => { pos.push(...a, ...b, ...c); for (let i = 0; i < 3; i++) nrm.push(...N); };
  const P = (p, y) => [p[0] - cx, y, p[1] - cz];
  const C = (y) => [0, y, 0];
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    // orientation-independent: build both cap triangles facing ±y explicitly
    const cross = (a[0] - cx) * (b[1] - cz) - (a[1] - cz) * (b[0] - cx);
    if (cross < 0) { tri(C(h), P(a, h), P(b, h), [0, 1, 0]); tri(C(-h), P(b, -h), P(a, -h), [0, -1, 0]); }
    else { tri(C(h), P(b, h), P(a, h), [0, 1, 0]); tri(C(-h), P(a, -h), P(b, -h), [0, -1, 0]); }
    const ex = b[0] - a[0], ez = b[1] - a[1], l = Math.hypot(ex, ez) || 1;
    let nx = ez / l, nz = -ex / l;
    const mx = (a[0] + b[0]) / 2 - cx, mz = (a[1] + b[1]) / 2 - cz;
    if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz; }
    tri(P(a, h), P(a, -h), P(b, -h), [nx, 0, nz]);
    tri(P(a, h), P(b, -h), P(b, h), [nx, 0, nz]);
    edges.push(...P(a, h), ...P(b, h), ...P(a, -h), ...P(b, -h));
    edges.push(...P(a, h), ...P(a, -h));
  }
  return { flat: { pos: Float32Array.from(pos), nrm: Float32Array.from(nrm) }, edges: Float32Array.from(edges), c: new Vector3(cx, 0, cz) };
}

/** The 5 pieces between consecutive cracks (each closed along the rim through the corners it spans). */
export function sealPieces() {
  const cracks = crackPolys();
  const out = [];
  for (let k = 0; k < 5; k++) {
    const f0 = RIM_F[k], f1 = k === 4 ? RIM_F[0] + 1 : RIM_F[k + 1];
    const poly = cracks[k].slice();                                     // centre → rim at f0
    for (const cf of [0, 1 / 3, 2 / 3, 1, 4 / 3]) if (cf > f0 && cf < f1) poly.push(rimAt(cf));   // corners on the way
    const back = cracks[(k + 1) % 5].slice().reverse();                 // rim at f1 → centre
    back.pop();                                                         // the centre is already first
    for (const p of back) poly.push(p);
    out.push(prism(poly));
  }
  return out;
}

/** The whole plate (all 5 pieces at rest) for the sealed view: → { flat, edges } in plate-local coordinates. */
export function sealWhole() {
  const ps = sealPieces();
  let nP = 0, nE = 0;
  for (const p of ps) { nP += p.flat.pos.length; nE += p.edges.length; }
  const pos = new Float32Array(nP), nrm = new Float32Array(nP), edges = new Float32Array(nE);
  let o = 0, oe = 0;
  for (const p of ps) {
    for (let i = 0; i < p.flat.pos.length; i += 3) {
      pos[o + i] = p.flat.pos[i] + p.c.x; pos[o + i + 1] = p.flat.pos[i + 1]; pos[o + i + 2] = p.flat.pos[i + 2] + p.c.z;
    }
    nrm.set(p.flat.nrm, o);
    o += p.flat.pos.length;
    for (let i = 0; i < p.edges.length; i += 3) {
      edges[oe + i] = p.edges[i] + p.c.x; edges[oe + i + 1] = p.edges[i + 1]; edges[oe + i + 2] = p.edges[i + 2] + p.c.z;
    }
    oe += p.edges.length;
  }
  return { flat: { pos, nrm }, edges };
}
