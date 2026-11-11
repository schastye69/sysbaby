// halls/members/shape.js — the pure geometry of one member column and its capital (SPEC §6.2 table).
//
// A twisted Shukhov hyperboloid, 24 m for everyone (height never encodes level, L10): base and top radius 1.6 m,
// waist (0.45 + 0.25·fract(seed·0.618))·R at mid-height, 8 + seed % 7 generators per family, twist
// ±(40° + (seed % 5)·10°) with the sign from the seed's parity, horizontal rings every 6 m. The capital: a solid
// obsidian n-gon plate (n = 5 + seed % 4, circumradius 2.2 m, 0.4 m thick) 0.8 m above the top, its soffit facing the
// clan (engraved glyph or the dotted 7×7 grid). Column-local metres: base centre at the origin, y up.
// Everything here runs at build time only (allocation is fine).
import { BufferGeometry, Float32BufferAttribute } from 'three';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

export const COL = Object.freeze({
  H: 24, R: 1.6, ringStep: 6, sub: 12, ringSeg: 28,
  capR: 2.2, capT: 0.4, capGap: 0.8,
  /** the capital's centre above the base (m): 24 + 0.8 + 0.2 */
  capY: 24 + 0.8 + 0.2,
  /** the capital plate tips its soffit 14° toward the clan's centre, so the cut glyph reads from the deck */
  capTiltDeg: 14,
  /** hover / focus telescoping: 24 → 27.6 m (+15 %) in 5 ratchet steps 45 ms apart */
  teleMax: 1.15, teleSteps: 5, teleStepMs: 45,
  /** the glyph square on the soffit (m): 7×7 nodes, 0.4 m apart */
  glyphM: 2.4,
});

const fract = (x) => x - Math.floor(x);
/** The atlas region spans the glyph square plus a 1/16 margin each side (painters draw nodes in [w/16, 15w/16]). */
export const UV_PAD = 8 / 7;

/** → { waist (m), G, twist (rad, signed), n } for a member seed (SPEC §6.2). */
export function columnShape(seed) {
  const s = Math.max(0, Math.floor(Math.abs(+seed || 0)));
  const waist = (0.45 + 0.25 * fract(s * 0.618)) * COL.R;
  const G = 8 + (s % 7);
  const sign = s % 2 === 0 ? 1 : -1;
  const twist = sign * (40 + (s % 5) * 10) * DEG;
  const n = 5 + (s % 4);
  return { waist, G, twist, n, seed: s };
}

/** Hyperbolic radius profile: R at y = 0 and y = H, `waist` at H/2. */
export function radiusAt(y, waist) {
  const t = (2 * y) / COL.H - 1;
  return Math.sqrt(waist * waist + (COL.R * COL.R - waist * waist) * t * t);
}

/** Appends the column's segments (xyz pairs) to `seg` and the normalised height of each segment's midpoint to `hs`.
 *  → the number of segments appended. */
export function columnSegments(shape, seg, hs) {
  const { waist, G, twist } = shape;
  const H = COL.H, S = COL.sub;
  let count = 0;
  // Two generator families, each a curve on the hyperboloid that turns by ±twist from base to top.
  for (let fam = 0; fam < 2; fam++) {
    const tw = fam === 0 ? twist : -twist;
    const off = fam === 0 ? 0 : Math.PI / G;
    for (let g = 0; g < G; g++) {
      const a0 = (TAU * g) / G + off;
      let px = 0, py = 0, pz = 0;
      for (let i = 0; i <= S; i++) {
        const t = i / S, y = t * H;
        const r = radiusAt(y, waist), a = a0 + tw * t;
        const x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (i > 0) { seg.push(px, py, pz, x, y, z); hs.push((t + (i - 1) / S) * 0.5); count++; }
        px = x; py = y; pz = z;
      }
    }
  }
  // Horizontal rings every 6 m (0, 6, 12, 18, 24), each turned by the mean twist at its height.
  for (let y = 0; y <= H + 1e-6; y += COL.ringStep) {
    const r = radiusAt(y, waist), t = y / H, n = COL.ringSeg;
    for (let k = 0; k < n; k++) {
      const a0 = (TAU * k) / n, a1 = (TAU * (k + 1)) / n;
      seg.push(Math.sin(a0) * r, y, Math.cos(a0) * r, Math.sin(a1) * r, y, Math.cos(a1) * r);
      hs.push(t);
      count++;
    }
  }
  return count;
}

/** The capital plate: an n-gon prism centred on the origin (y = ±capT/2), circumradius capR. The soffit (y = −capT/2,
 *  facing down) carries `uv` over the 2.4 m glyph square (u right, v toward +z = toward the viewer), so the atlas
 *  region capital:k lands on it; top and sides take uv (0.5, 0.5)·… outside the square (clamped → surface, no cut).
 *  Flat normals. → BufferGeometry */
export function capitalGeometry(n, rot = 0) {
  const R = COL.capR, h = COL.capT / 2, gs = COL.glyphM * UV_PAD;
  const pos = [], nor = [], uv = [];
  const P = (k) => { const a = rot + (TAU * k) / n + Math.PI / n; return [Math.sin(a) * R, Math.cos(a) * R]; };
  const uvOf = (x, z) => [x / gs + 0.5, z / gs + 0.5];
  const tri = (a, b, c, nx, ny, nz, uvA, uvB, uvC) => {   // listed clockwise from outside → emitted counter-clockwise
    pos.push(...a, ...c, ...b);
    for (let i = 0; i < 3; i++) nor.push(nx, ny, nz);
    uv.push(...uvA, ...uvC, ...uvB);
  };
  const FAR = [-4, -4];   // top + sides: far outside the region → clamped edge texels (uncut surface)
  for (let k = 0; k < n; k++) {
    const [x0, z0] = P(k), [x1, z1] = P(k + 1);
    // soffit (normal −y; wound so the face points down)
    tri([0, -h, 0], [x0, -h, z0], [x1, -h, z1], 0, -1, 0, uvOf(0, 0), uvOf(x0, z0), uvOf(x1, z1));
    // top (normal +y)
    tri([0, h, 0], [x1, h, z1], [x0, h, z0], 0, 1, 0, FAR, FAR, FAR);
    // side quad
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, l = Math.hypot(mx, mz) || 1;
    tri([x0, -h, z0], [x0, h, z0], [x1, h, z1], mx / l, 0, mz / l, FAR, FAR, FAR);
    tri([x0, -h, z0], [x1, h, z1], [x1, -h, z1], mx / l, 0, mz / l, FAR, FAR, FAR);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  return g;
}

/** One wedge (sector k of n) of the capital plate, for the WORKSHOP iris: its local frame has the hinge (the outer
 *  edge's midpoint) at the origin, so a rotation about the hinge's tangent opens it outward. → { geometry, hinge:[x,z], tangent:[x,z] } */
export function capitalWedge(n, k, rot = 0) {
  const R = COL.capR, h = COL.capT / 2;
  const a0 = rot + (TAU * k) / n + Math.PI / n, a1 = rot + (TAU * (k + 1)) / n + Math.PI / n;
  const x0 = Math.sin(a0) * R, z0 = Math.cos(a0) * R, x1 = Math.sin(a1) * R, z1 = Math.cos(a1) * R;
  const hx = (x0 + x1) / 2, hz = (z0 + z1) / 2;
  const pos = [], nor = [];
  const T = (a, b, c, nx, ny, nz) => { pos.push(a[0] - hx, a[1], a[2] - hz, c[0] - hx, c[1], c[2] - hz, b[0] - hx, b[1], b[2] - hz); for (let i = 0; i < 3; i++) nor.push(nx, ny, nz); };
  T([0, -h, 0], [x0, -h, z0], [x1, -h, z1], 0, -1, 0);
  T([0, h, 0], [x1, h, z1], [x0, h, z0], 0, 1, 0);
  const l = Math.hypot(hx, hz) || 1;
  T([x0, -h, z0], [x0, h, z0], [x1, h, z1], hx / l, 0, hz / l);
  T([x0, -h, z0], [x1, h, z1], [x1, -h, z1], hx / l, 0, hz / l);
  // the two cut faces toward the centre
  T([0, -h, 0], [0, h, 0], [x0, h, z0], -z0 / R, 0, x0 / R);
  T([0, -h, 0], [x0, h, z0], [x0, -h, z0], -z0 / R, 0, x0 / R);
  T([0, -h, 0], [x1, h, z1], [0, h, 0], z1 / R, 0, -x1 / R);
  T([0, -h, 0], [x1, -h, z1], [x1, h, z1], z1 / R, 0, -x1 / R);
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new Float32BufferAttribute(nor, 3));
  return { geometry: g, hinge: [hx, hz], tangent: [(x1 - x0) / (2 * R * Math.sin(Math.PI / n)), (z1 - z0) / (2 * R * Math.sin(Math.PI / n))] };
}

/** The soffit's n-gon outline (capital-local, y = −capT/2 − 0.005), as segments. */
export function capitalEdge(n, rot = 0) {
  const R = COL.capR, y = -COL.capT / 2 - 0.005, out = [];
  for (let k = 0; k < n; k++) {
    const a0 = rot + (TAU * k) / n + Math.PI / n, a1 = rot + (TAU * (k + 1)) / n + Math.PI / n;
    out.push(Math.sin(a0) * R, y, Math.cos(a0) * R, Math.sin(a1) * R, y, Math.cos(a1) * R);
  }
  return out;
}

/** The 49 nodes of the 7×7 grid on the soffit (capital-local xyz, row 0 farthest from the viewer). */
export function soffitGrid() {
  const out = new Float32Array(49 * 3), s = COL.glyphM / 6, y = -COL.capT / 2 - 0.01;
  for (let i = 0; i < 49; i++) {
    out[3 * i] = (i % 7) * s - COL.glyphM / 2;
    out[3 * i + 1] = y;
    out[3 * i + 2] = Math.floor(i / 7) * s - COL.glyphM / 2;
  }
  return out;
}
