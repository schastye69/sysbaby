// halls/insignia/shapes.js — WP9 SEED (ARCH §3.19, §4.3.5, §6.1.5; SPEC §6.6 relics). three.js allowed.
// buildRelicGeometry(shape, size) → { solid: indexed BufferGeometry scaled so its largest extent = size,
//   edges: Float32Array feature edges (≥ 30° crease) as xyz pairs }:
//   stellated = two interpenetrating tetrahedra; twisted = 5-gon prism, 3 segments, 72° twist; nested = 3 tetrahedra at
//   scales 1 / 0.62 / 0.38; bipyramid = 7-gon bipyramid; knot = TorusKnotGeometry(p 2, q 3) with tube 0.08·size.
// relicIconSvg(shape, sizePx) → SVG path `d` only (one distinct line icon per shape in a sizePx box; no markup).
import { BufferGeometry, Float32BufferAttribute, TetrahedronGeometry, TorusKnotGeometry, EdgesGeometry, Matrix4 } from 'three';

export const SHAPES = Object.freeze(['stellated', 'twisted', 'nested', 'bipyramid', 'knot']);

/** Merges geometries (non-indexed copies) and welds them into one indexed geometry. */
function weld(geos) {
  const pos = [];
  for (const g of geos) {
    const n = g.index ? g.toNonIndexed() : g;
    const a = n.attributes.position.array;
    for (let i = 0; i < a.length; i++) pos.push(a[i]);
    if (n !== g) n.dispose();
    g.dispose();
  }
  const map = new Map(), verts = [], index = [];
  for (let i = 0; i < pos.length; i += 3) {
    const k = `${pos[i].toFixed(5)},${pos[i + 1].toFixed(5)},${pos[i + 2].toFixed(5)}`;
    let v = map.get(k);
    if (v == null) { v = verts.length / 3; map.set(k, v); verts.push(pos[i], pos[i + 1], pos[i + 2]); }
    index.push(v);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(verts, 3));
  g.setIndex(index);
  return g;
}
function fromTris(verts, tris) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(verts, 3));
  g.setIndex(tris);
  return g;
}

function twisted() {
  const n = 5, segs = 3, R = 1, H = 1.6, tw = (72 * Math.PI) / 180;
  const v = [], t = [];
  for (let s = 0; s <= segs; s++) {
    const y = -H / 2 + (H * s) / segs, rot = (tw * s) / segs;
    for (let j = 0; j < n; j++) { const a = (2 * Math.PI * j) / n + rot; v.push(Math.sin(a) * R, y, Math.cos(a) * R); }
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
  for (let j = 0; j < n; j++) { const a = (2 * Math.PI * j) / n; v.push(Math.sin(a) * 0.62, 0, Math.cos(a) * 0.62); }
  for (let j = 0; j < n; j++) { const a = 2 + j, b = 2 + ((j + 1) % n); t.push(0, a, b, 1, b, a); }
  return fromTris(v, t);
}

/** → { solid, edges } */
export function buildRelicGeometry(shape, size = 1) {
  let g;
  switch (shape) {
    case 'stellated': {
      const a = new TetrahedronGeometry(1, 0), b = new TetrahedronGeometry(1, 0);
      b.applyMatrix4(new Matrix4().makeRotationY(Math.PI / 2));
      g = weld([a, b]);
      break;
    }
    case 'twisted': g = twisted(); break;
    case 'nested': g = weld([new TetrahedronGeometry(1, 0), new TetrahedronGeometry(0.62, 0), new TetrahedronGeometry(0.38, 0)]); break;
    case 'bipyramid': g = bipyramid(); break;
    case 'knot':
    default: g = weld([new TorusKnotGeometry(1, 0.08 * 3.2, 96, 8, 2, 3)]); break;
  }
  g.computeBoundingBox();
  const bb = g.boundingBox;
  const ext = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z) || 1;
  const k = size / ext;
  g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -(bb.max.z + bb.min.z) / 2);
  g.scale(k, k, k);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  const e = new EdgesGeometry(g, 30);
  const edges = Float32Array.from(e.attributes.position.array);
  e.dispose();
  return { solid: g, edges };
}

/** → SVG path `d` (one stroke-only icon per shape in a sizePx × sizePx box). */
export function relicIconSvg(shape, sizePx = 24) {
  const s = sizePx, c = s / 2, r = s * 0.42;
  const f = (v) => Math.round(v * 100) / 100;
  const poly = (n, rad, rot = 0, cy = c) => {
    let d = '';
    for (let j = 0; j < n; j++) {
      const a = rot + (2 * Math.PI * j) / n;
      d += `${j ? 'L' : 'M'}${f(c + Math.sin(a) * rad)} ${f(cy - Math.cos(a) * rad)}`;
    }
    return `${d}Z`;
  };
  switch (shape) {
    case 'stellated': return `${poly(3, r)}${poly(3, r, Math.PI)}`;
    case 'twisted': return `${poly(5, r)}${poly(5, r * 0.55, Math.PI / 5)}M${f(c)} ${f(c - r)}L${f(c + Math.sin(Math.PI / 5) * r * 0.55)} ${f(c - Math.cos(Math.PI / 5) * r * 0.55)}`;
    case 'nested': return `${poly(3, r)}${poly(3, r * 0.62)}${poly(3, r * 0.38)}`;
    case 'bipyramid': return `M${f(c)} ${f(c - r)}L${f(c + r * 0.62)} ${f(c)}L${f(c)} ${f(c + r)}L${f(c - r * 0.62)} ${f(c)}ZM${f(c - r * 0.62)} ${f(c)}L${f(c + r * 0.62)} ${f(c)}`;
    case 'knot':
    default: {
      let d = '';
      for (let k = 0; k <= 96; k++) {
        const t = (2 * Math.PI * k) / 96;
        const rr = r * (0.62 + 0.38 * Math.cos(3 * t));
        d += `${k ? 'L' : 'M'}${f(c + rr * Math.cos(2 * t))} ${f(c + rr * Math.sin(2 * t))}`;
      }
      return `${d}Z`;
    }
  }
}
