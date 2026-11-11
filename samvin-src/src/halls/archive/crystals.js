// halls/archive/crystals.js — WP7: the procedural finds of the wall of time (SPEC §6.4 "Finds embedded in bands";
// SPEC-ADDENDUM A3.5 deed finds). Every solid is flat-faceted (non-indexed, face normals) and comes with its feature
// edges (≥ 30° creases) as xyz pairs for the R3 ribbon.
//   legend  0.8 m fossil crystal by kind: победа = heptagonal bipyramid · смешное = 3-turn spiral solid ·
//           эпичное = 12-point starburst
//   moment  0.5 m seeded polyhedron (a jittered Platonic seed: octa / icosa / dodeca, anisotropic)
//   achievement 0.6 m mini of its relic (buildRelicGeometry, WP9's shapes)
//   sbor    0.4 m heptagonal ring (the call wave, frozen) · deed 0.3 m mini-Key · show 0.4 m heptagonal bipyramid
import { BufferGeometry, Float32BufferAttribute, EdgesGeometry, IcosahedronGeometry, OctahedronGeometry, DodecahedronGeometry } from 'three';
import { buildRelicGeometry } from '../insignia/shapes.js';
import { mulberry32 } from '../../core/rng.js';
import { STRATA_GEOM } from '../../core/tokens.js';

export const FIND_SIZE = Object.freeze({ legend: 0.8, moment: 0.5, achievement: 0.6, sbor: 0.4, deed: 0.3, show: 0.4 });
const TAU = Math.PI * 2;

/** Triangles (flat list of xyz triples) → non-indexed geometry with face normals, centred, largest extent = size. */
function finish(tri, size) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(tri, 3));
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const ext = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z) || 1;
  g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
  g.scale(size / ext, size / ext, size / ext);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}
function edgesOf(g) {
  const e = new EdgesGeometry(g, 30);
  const a = Float32Array.from(e.attributes.position.array);
  e.dispose();
  return a;
}
const P = (out, v) => { out.push(v[0], v[1], v[2]); };
function tri(out, a, b, c) { P(out, a); P(out, b); P(out, c); }

/** Heptagonal bipyramid (n = 7), equator radius k·half-height. */
function bipyramid(k = 0.62) {
  const out = [], n = 7, top = [0, 1, 0], bot = [0, -1, 0];
  for (let j = 0; j < n; j++) {
    const a0 = (TAU * j) / n, a1 = (TAU * (j + 1)) / n;
    const p0 = [Math.sin(a0) * k, 0, Math.cos(a0) * k], p1 = [Math.sin(a1) * k, 0, Math.cos(a1) * k];
    tri(out, top, p0, p1); tri(out, bot, p1, p0);
  }
  return out;
}

/** 12-point starburst: the icosahedron's 12 vertices as long spikes. Every face is cut down to its valleys — the edge
 *  midpoints sink to 0.36 and the face centre to 0.30 of the tip radius — so each vertex stands alone as a sharp
 *  five-sided spike (an icosahedron with dimpled faces would read as a lumpy ball, not a star). */
function starburst() {
  const ico = new IcosahedronGeometry(1, 0);
  const a = ico.attributes.position.array, out = [];
  const pull = (p, q, r) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]; const l = Math.hypot(m[0], m[1], m[2]) || 1; return [m[0] * r / l, m[1] * r / l, m[2] * r / l]; };
  for (let t = 0; t < a.length; t += 9) {
    const A = [a[t], a[t + 1], a[t + 2]], B = [a[t + 3], a[t + 4], a[t + 5]], C = [a[t + 6], a[t + 7], a[t + 8]];
    const c = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
    const l = Math.hypot(c[0], c[1], c[2]) || 1;
    const M = [c[0] * 0.30 / l, c[1] * 0.30 / l, c[2] * 0.30 / l];
    const ab = pull(A, B, 0.36), bc = pull(B, C, 0.36), ca = pull(C, A, 0.36);
    tri(out, A, ab, M); tri(out, ab, B, M); tri(out, B, bc, M); tri(out, bc, C, M); tri(out, C, ca, M); tri(out, ca, A, M);
  }
  ico.dispose();
  return out;
}

/** 3-turn spiral solid: a triangular section swept along a conical helix (a fossil whorl), capped. */
function spiral() {
  const out = [], N = 96, S = 3;
  const ring = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, ang = 3 * TAU * t;
    const R = 0.5 * (1 - 0.78 * t), y = -0.42 + 0.84 * t, r = 0.2 * (1 - 0.72 * t) + 0.012;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const c = [R * ca, y, R * sa];
    const pts = [];
    for (let s = 0; s < S; s++) {
      const b = (TAU * s) / S + 0.3;
      // section in the (radial, vertical) plane
      const dr = Math.cos(b) * r, dy = Math.sin(b) * r;
      pts.push([c[0] + ca * dr, c[1] + dy, c[2] + sa * dr]);
    }
    ring.push({ c, pts });
  }
  for (let i = 0; i < N; i++) {
    const A = ring[i].pts, B = ring[i + 1].pts;
    for (let s = 0; s < S; s++) {
      const s1 = (s + 1) % S;
      tri(out, A[s], B[s], B[s1]); tri(out, A[s], B[s1], A[s1]);
    }
  }
  const f = ring[0], l = ring[N];
  tri(out, f.pts[0], f.pts[2], f.pts[1]);
  tri(out, l.pts[0], l.pts[1], l.pts[2]);
  return out;
}

/** Seeded polyhedron: a Platonic seed with each unique vertex jittered radially, then scaled anisotropically. */
function polyhedron(seed) {
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  const pick = rnd();
  const g = pick < 0.34 ? new OctahedronGeometry(1, 0) : pick < 0.67 ? new IcosahedronGeometry(1, 0) : new DodecahedronGeometry(1, 0);
  const a = g.attributes.position.array, jit = new Map(), out = [];
  const sx = 0.78 + 0.44 * rnd(), sy = 0.78 + 0.44 * rnd(), sz = 0.78 + 0.44 * rnd();
  for (let i = 0; i < a.length; i += 3) {
    const k = `${a[i].toFixed(4)},${a[i + 1].toFixed(4)},${a[i + 2].toFixed(4)}`;
    let j = jit.get(k);
    if (j == null) { j = 0.72 + 0.42 * rnd(); jit.set(k, j); }
    out.push(a[i] * j * sx, a[i + 1] * j * sy, a[i + 2] * j * sz);
  }
  g.dispose();
  return out;
}

/** Heptagonal ring: a 7-gon torus with a square section. */
function heptRing() {
  const out = [], n = 7, R = 0.5, w = 0.11;
  const corner = (a, dr, dy) => [Math.sin(a) * (R + dr), dy, Math.cos(a) * (R + dr)];
  const sec = [[-w, -w], [w, -w], [w, w], [-w, w]];
  for (let j = 0; j < n; j++) {
    const a0 = (TAU * j) / n, a1 = (TAU * (j + 1)) / n;
    for (let s = 0; s < 4; s++) {
      const p = sec[s], q = sec[(s + 1) % 4];
      const A = corner(a0, p[0], p[1]), B = corner(a1, p[0], p[1]), C = corner(a1, q[0], q[1]), D = corner(a0, q[0], q[1]);
      tri(out, A, B, C); tri(out, A, C, D);
    }
  }
  return out;
}

/** Mini-Key: seven stacked n-gon frusta (the Key's strata n = 3, 5, 7, 12, 7, 5, 3) on a spindle profile, small gaps. */
function miniKey() {
  const out = [], H = 2.4, gap = 0.04;
  const prof = (y) => 0.62 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y) / 1.2, 1.35)), 0.55) + 0.05;
  for (let i = 0; i < 7; i++) {
    const st = STRATA_GEOM[i];
    const n = st.n, yt = st.top * 1.2 - gap / 2, yb = st.bot * 1.2 + gap / 2;
    const rt = prof(yt), rb = prof(yb);
    for (let j = 0; j < n; j++) {
      const a0 = (TAU * j) / n, a1 = (TAU * (j + 1)) / n;
      const t0 = [Math.sin(a0) * rt, yt, Math.cos(a0) * rt], t1 = [Math.sin(a1) * rt, yt, Math.cos(a1) * rt];
      const b0 = [Math.sin(a0) * rb, yb, Math.cos(a0) * rb], b1 = [Math.sin(a1) * rb, yb, Math.cos(a1) * rb];
      tri(out, t0, b0, b1); tri(out, t0, b1, t1);
      tri(out, [0, yt, 0], t0, t1); tri(out, [0, yb, 0], b1, b0);
    }
  }
  void H;
  return out;
}

const cache = new Map();
/** → { solid, edges, size, shared } for a band (shared geometries are cached by type and must not be disposed per find). */
export function findGeometry(band) {
  const size = FIND_SIZE[band.kind];
  if (!size) return null;
  let key = band.kind, build = null;
  switch (band.kind) {
    case 'legend':
      key = `legend:${band.legendKind}`;
      build = () => (band.legendKind === 'победа' ? bipyramid(0.62) : band.legendKind === 'смешное' ? spiral() : starburst());
      break;
    case 'moment': key = null; build = () => polyhedron(band.seed); break;
    case 'achievement': {
      key = `ach:${band.shape || 'knot'}`;
      if (!cache.has(key)) {
        const r = buildRelicGeometry(band.shape || 'knot', size);
        const flat = r.solid.index ? r.solid.toNonIndexed() : r.solid;   // faceted: face normals
        if (flat !== r.solid) r.solid.dispose();
        flat.computeVertexNormals();
        cache.set(key, { solid: flat, edges: r.edges, size });
      }
      return { ...cache.get(key), shared: true };
    }
    case 'sbor': key = 'sbor'; build = heptRing; break;
    case 'deed': key = 'deed'; build = miniKey; break;
    case 'show': key = 'show'; build = () => bipyramid(0.62); break;
    default: return null;
  }
  if (key && cache.has(key)) return { ...cache.get(key), shared: true };
  const solid = finish(build(), size);
  const out = { solid, edges: edgesOf(solid), size };
  if (key) { cache.set(key, out); return { ...out, shared: true }; }
  return { ...out, shared: false };
}
/** Frees the cached shared geometries (hall dispose). */
export function disposeFindCache() {
  for (const v of cache.values()) v.solid.dispose();
  cache.clear();
}
