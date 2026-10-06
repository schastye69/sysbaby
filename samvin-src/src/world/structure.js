// world/structure.js — the structure generator (ARCH §3.3.3, SPEC §3.1, §3.2, §3.10).
//
// One generator builds the Key (perStratum: 7 animated stratum groups) and every VIN level (merged: one group,
// scaled ×1000^j by its nest level). Units are Key metres; the owner scales the group.
//
//   solids   R2 obsidian with R4 engraving and R1 solid alpha. Per stratum: n faces × 3 loft segments (4 rings:
//            top, ⅓, ⅔, bottom following r(y)), caps (stratum 3: annuli around the hollow), stratum 3's inner wall
//            (faces facing the axis); the 0.09 m through-aperture is cut in the shader.
//            perStratum: 7 meshes (one per stratum group); merged: ONE mesh moved per stratum by uStrataM.
//   lattice  the R1 lattice twin: two families of k = 24·n straight generators per stratum, each joining perimeter
//            parameter s on the top ring to s ± 0.75 face widths on the bottom ring, 8 segments, lying on the surface.
//            ONE LineSegments for all strata (2,016 generators / 16,128 segments at density 1) plus, as a WP0 addition,
//            stratum 3's inner wall (2 × 288 generators) — that inner wall is the CORE hall's horizon rim.
//   edges    R3 ribbons in ONE draw call: vertical creases 1 px, top/bottom ring outlines (12 primary per stratum, the
//            faces nearest face 0, at 1.5 px), the hollow's inner rings.
//   vertices 7 × 4 rings × n points, 2 px --white 40 % (optional).
//
// Attributes (WP0 defines them, nobody changes them): position, normal, aFaceUV (0..1 across / down the face),
// aFace (i·16 + j), aStrut (local perimeter / 2k — see strutAt), plus aEng (sign u, sign v, metres from the face's top edge, metres to
// its bottom edge) and aKind (0 outer wall, 1 top cap, 2 bottom cap, 3 inner wall). Face j of stratum i has horizontal
// outward normal (sin 2πj/n, 0, cos 2πj/n): face 0 looks at +Z.
import {
  BufferGeometry, Float32BufferAttribute, Group, Mesh, LineSegments, Matrix4,
} from 'three';
import { PROFILE, STRATA_GEOM, radiusAt, LOFT_RINGS, GAP, KEY, RENDER } from '../core/tokens.js';
import { createObsidian } from '../render/obsidian.js';
import { createLines, createLatticeMaterial } from '../render/lines.js';
import { createPoints } from '../render/points.js';

export { PROFILE, STRATA_GEOM, radiusAt };

const TAU = Math.PI * 2;
const NO_ENG = 99;                               // aEng.zw for faces that carry no engraving
const SIGN_FRAC = KEY.sign.heightFrac;           // the sign square side = 70 % of the face height

/** Point on stratum st's n-gon of circumradius r at height y, at perimeter parameter s (face units, face j = ⌊s⌋). */
function ringPoint(n, r, y, s, out, o) {
  const j = Math.floor(s);
  const f = s - j;
  const a0 = (TAU * j) / n - Math.PI / n, a1 = a0 + TAU / n;
  const x0 = Math.sin(a0) * r, z0 = Math.cos(a0) * r, x1 = Math.sin(a1) * r, z1 = Math.cos(a1) * r;
  out[o] = x0 + (x1 - x0) * f; out[o + 1] = y; out[o + 2] = z0 + (z1 - z0) * f;
}
/** Perimeter parameter (face units, unwrapped) of generator g of family fam (+1 | −1) at height fraction t (0 top … 1
 *  bottom), for kd generators per family. The two families are offset by half a spacing so their crossings sit between
 *  the rings. key/litNodes.js uses this to find the lattice crossings. */
export function generatorParam(st, fam, g, t, kd = st.k) {
  return (g * st.n) / kd + (fam < 0 ? (0.5 * st.n) / kd : 0) + fam * KEY.lattice.faceShift * t;
}
/** aStrut: the spacing between NEIGHBOURING struts of the two interleaved families = local perimeter / (2k). With R1's
 *  smoothstep(3, 6) px this keeps the Key solid at the 7.2 m rest distance and dissolves it below ≈ 2.4 m, exactly as
 *  SPEC §3.2 describes (perimeter / k alone would leave the 7-gon strata ≈ 10 % dissolved at rest). */
const STRUT_FAMILIES = 2;
const strutAt = (n, k, y) => Math.max(1e-4, (2 * radiusAt(y) * Math.sin(Math.PI / n) * n) / (k * STRUT_FAMILIES));

/** Accumulates flat-shaded triangles with the structure attributes. */
class Builder {
  constructor() { this.p = []; this.n = []; this.uv = []; this.eng = []; this.face = []; this.kind = []; this.strut = []; }
  /** v = [x,y,z, u,v, eu,ev,ez,ew, strut] × 3; the winding is fixed so the normal agrees with `want`. */
  tri(v0, v1, v2, face, kind, want) {
    let ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2];
    let bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2];
    let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) return;                                    // degenerate (apex)
    nx /= len; ny /= len; nz /= len;
    let a = v0, b = v1, c = v2;
    if (nx * want[0] + ny * want[1] + nz * want[2] < 0) { b = v2; c = v1; nx = -nx; ny = -ny; nz = -nz; }
    for (const v of [a, b, c]) {
      this.p.push(v[0], v[1], v[2]); this.n.push(nx, ny, nz); this.uv.push(v[3], v[4]);
      this.eng.push(v[5], v[6], v[7], v[8]); this.face.push(face); this.kind.push(kind); this.strut.push(v[9]);
    }
  }
  geometry() {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new Float32BufferAttribute(this.n, 3));
    g.setAttribute('aFaceUV', new Float32BufferAttribute(this.uv, 2));
    g.setAttribute('aEng', new Float32BufferAttribute(this.eng, 4));
    g.setAttribute('aFace', new Float32BufferAttribute(this.face, 1));
    g.setAttribute('aKind', new Float32BufferAttribute(this.kind, 1));
    g.setAttribute('aStrut', new Float32BufferAttribute(this.strut, 1));
    g.computeBoundingSphere();
    return g;
  }
}

const _p = new Float32Array(3);
/** Adds stratum st's solid triangles to builder b. */
function addStratumSolid(b, st) {
  const { i, n, k, top, bot, hollow } = st;
  const H = top - bot, mid = (top + bot) / 2, S = SIGN_FRAC * H;
  const ys = LOFT_RINGS.map((f) => top + (bot - top) * f);
  const rs = ys.map((y) => radiusAt(y));
  for (let j = 0; j < n; j++) {
    const th = (TAU * j) / n, tx = Math.cos(th), tz = -Math.sin(th);   // face tangent (left → right seen from outside)
    const want = [Math.sin(th), 0, Math.cos(th)];
    const face = i * 16 + j;
    const V = (q, side) => {                                           // side 0 = left vertex A, 1 = right vertex B
      ringPoint(n, rs[q], ys[q], j + side, _p, 0);
      const x = _p[0] * tx + _p[2] * tz;
      return [_p[0], _p[1], _p[2], side, (top - ys[q]) / H, x / S + 0.5, 0.5 - (ys[q] - mid) / S, top - ys[q], ys[q] - bot,
        strutAt(n, k, ys[q])];
    };
    for (let q = 0; q < 3; q++) {
      const At = V(q, 0), Bt = V(q, 1), Ab = V(q + 1, 0), Bb = V(q + 1, 1);
      b.tri(At, Ab, Bb, face, 0, want);
      b.tri(At, Bb, Bt, face, 0, want);
    }
    // Caps (stratum 3: annuli around the hollow).
    for (const [y, r, kind, ny] of [[top, rs[0], 1, 1], [bot, rs[3], 2, -1]]) {
      if (r <= 1e-6) continue;
      const sv = strutAt(n, k, y);
      const P = (rad, s) => { ringPoint(n, rad, y, s, _p, 0); return [_p[0], _p[1], _p[2], 0.5, kind === 1 ? 0 : 1, -1, -1, NO_ENG, NO_ENG, sv]; };
      if (hollow > 0) {
        const o0 = P(r, j), o1 = P(r, j + 1), i0 = P(hollow, j), i1 = P(hollow, j + 1);
        b.tri(o0, o1, i1, face, kind, [0, ny, 0]);
        b.tri(o0, i1, i0, face, kind, [0, ny, 0]);
      } else {
        b.tri([0, y, 0, 0.5, kind === 1 ? 0 : 1, -1, -1, NO_ENG, NO_ENG, sv], P(r, j), P(r, j + 1), face, kind, [0, ny, 0]);
      }
    }
    // Inner wall of the hollow (faces facing the axis).
    if (hollow > 0) {
      const sv = (2 * hollow * Math.sin(Math.PI / n) * n) / (k * STRUT_FAMILIES);
      const P = (y, s) => { ringPoint(n, hollow, y, s, _p, 0); return [_p[0], _p[1], _p[2], s - j, (top - y) / H, -1, -1, NO_ENG, NO_ENG, sv]; };
      const a = P(top, j), c = P(top, j + 1), d = P(bot, j), e = P(bot, j + 1);
      const inward = [-Math.sin(th), 0, -Math.cos(th)];
      b.tri(a, d, e, face, 3, inward);
      b.tri(a, e, c, face, 3, inward);
    }
  }
}

/** Lattice twin positions (+ aFace, aStrut, aDir) for the given strata at density d. */
function latticeGeometry(density) {
  const pos = [], face = [], strut = [], dir = [];
  const a = new Float32Array(3), b = new Float32Array(3);
  const push = (st, s, p, q, sv0, sv1) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
    const l = Math.hypot(dx, dy, dz) || 1;
    const f = st.i * 16 + (((Math.floor(s) % st.n) + st.n) % st.n);
    pos.push(p[0], p[1], p[2], q[0], q[1], q[2]);
    face.push(f, f); strut.push(sv0, sv1);
    dir.push(dx / l, dy / l, dz / l, dx / l, dy / l, dz / l);
  };
  const SEG = KEY.lattice.segmentsPerGenerator;
  for (const st of STRATA_GEOM) {
    const kd = Math.max(1, Math.round(st.k * density));
    const walls = st.hollow > 0 ? [false, true] : [false];
    for (const inner of walls) {
      for (const fam of [1, -1]) {
        for (let g = 0; g < kd; g++) {
          for (let m = 0; m < SEG; m++) {
            const t0 = m / SEG, t1 = (m + 1) / SEG;
            const y0 = st.top + (st.bot - st.top) * t0, y1 = st.top + (st.bot - st.top) * t1;
            const r0 = inner ? st.hollow : radiusAt(y0), r1 = inner ? st.hollow : radiusAt(y1);
            const sA = generatorParam(st, fam, g, t0, kd), sB = generatorParam(st, fam, g, t1, kd);
            const wrap = (s) => ((s % st.n) + st.n) % st.n;
            ringPoint(st.n, r0, y0, wrap(sA), a, 0);
            ringPoint(st.n, r1, y1, wrap(sB), b, 0);
            const sv0 = inner ? (2 * st.hollow * Math.sin(Math.PI / st.n) * st.n) / (st.k * STRUT_FAMILIES) : strutAt(st.n, st.k, y0);
            const sv1 = inner ? sv0 : strutAt(st.n, st.k, y1);
            push(st, wrap((sA + sB) / 2), a, b, sv0, sv1);
          }
        }
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('aFace', new Float32BufferAttribute(face, 1));
  g.setAttribute('aStrut', new Float32BufferAttribute(strut, 1));
  g.setAttribute('aDir', new Float32BufferAttribute(dir, 3));
  g.computeBoundingSphere();
  return g;
}

/** Edge ribbons (segments, per-segment widths, faces). */
function edgeData() {
  const seg = [], width = [], face = [];
  const a = new Float32Array(3), b = new Float32Array(3);
  const add = (i, j, w) => { seg.push(a[0], a[1], a[2], b[0], b[1], b[2]); width.push(w); face.push(i * 16 + j); };
  for (const st of STRATA_GEOM) {
    const { i, n, top, bot, hollow } = st;
    const ys = LOFT_RINGS.map((f) => top + (bot - top) * f);
    // Primary: ring outline faces nearest face 0, alternating top / bottom, 12 per stratum.
    const order = [...Array(n).keys()].sort((p, q) => Math.min(p, n - p) - Math.min(q, n - q));
    let primary = 0;
    const prim = new Set();
    for (const j of order) { for (const ring of [0, 3]) { if (primary < RENDER.r3.primaryEdges && radiusAt(ys[ring]) > 1e-6) { prim.add(`${ring}:${j}`); primary++; } } }
    for (let j = 0; j < n; j++) {
      for (let q = 0; q < 3; q++) {                         // vertical crease through vertex j (left vertex of face j)
        ringPoint(n, radiusAt(ys[q]), ys[q], j, a, 0); ringPoint(n, radiusAt(ys[q + 1]), ys[q + 1], j, b, 0);
        add(i, j, RENDER.r3.widthPx);
      }
      for (const ring of [0, 3]) {
        const r = radiusAt(ys[ring]);
        if (r <= 1e-6) continue;
        ringPoint(n, r, ys[ring], j, a, 0); ringPoint(n, r, ys[ring], j + 0.999999, b, 0);
        add(i, j, prim.has(`${ring}:${j}`) ? RENDER.r3.primaryPx : RENDER.r3.widthPx);
      }
      if (hollow > 0) {
        for (const y of [top, bot]) { ringPoint(n, hollow, y, j, a, 0); ringPoint(n, hollow, y, j + 0.999999, b, 0); add(i, j, RENDER.r3.widthPx); }
      }
    }
  }
  return { seg: new Float32Array(seg), width: new Float32Array(width), face: new Float32Array(face) };
}

function vertexData() {
  const pos = [], face = [];
  for (const st of STRATA_GEOM) {
    for (const f of LOFT_RINGS) {
      const y = st.top + (st.bot - st.top) * f, r = radiusAt(y);
      for (let j = 0; j < st.n; j++) { ringPoint(st.n, r, y, j, _p, 0); pos.push(_p[0], _p[1], _p[2]); face.push(st.i * 16 + j); if (r <= 1e-6) break; }
    }
  }
  return { pos: new Float32Array(pos), face: new Float32Array(face) };
}

/** @returns {Structure}
 *  opts: { scale = 1, perStratum = false, solid = true, lattice = true, edges = true, vertices = false,
 *          latticeDensity = 1, hallLod = false, far = 700 } */
export function buildStructure(opts = {}) {
  const per = !!opts.perStratum;
  const group = new Group();
  group.name = per ? 'structure:key' : 'structure';
  const sc = opts.scale != null ? opts.scale : 1;
  group.scale.setScalar(sc);
  const far = opts.far != null ? opts.far : 700;

  const strataM = { value: Array.from({ length: 7 }, () => new Matrix4()) };
  const strataA = { value: [1, 1, 1, 1, 1, 1, 1] };
  const strata = [];
  if (per) for (let i = 0; i < 7; i++) { const g = new Group(); g.name = `stratum:${i}`; group.add(g); strata.push(g); }
  else strata.push(group);

  // Per-stratum matrices: perStratum → copied from the stratum groups before each draw; merged → owned here.
  const syncStrata = () => { if (per) for (let i = 0; i < 7; i++) strataM.value[i].copy(strata[i].matrix); };

  const solids = [];
  let solidMat = null;
  if (opts.solid !== false) {
    if (per) {
      solidMat = createObsidian({ engrave: 'key', strataAlpha: strataA });
      for (const st of STRATA_GEOM) {
        const b = new Builder();
        addStratumSolid(b, st);
        const m = new Mesh(b.geometry(), solidMat);
        m.name = `solid:${st.i}`;
        m.userData.stratum = st.i;
        strata[st.i].add(m);
        solids.push(m);
      }
    } else {
      solidMat = createObsidian({ engrave: 'key', strata: strataM, strataAlpha: strataA });
      const b = new Builder();
      for (const st of STRATA_GEOM) addStratumSolid(b, st);
      const m = new Mesh(b.geometry(), solidMat);
      m.name = 'solid';
      m.frustumCulled = false;
      group.add(m);
      solids.push(m);
    }
  }

  let lattice = null, latMat = null;
  let density = opts.latticeDensity != null ? opts.latticeDensity : 1;
  if (opts.lattice !== false) {
    latMat = createLatticeMaterial({ strata: strataM, strataAlpha: strataA, far, dir: true });
    lattice = new LineSegments(latticeGeometry(density), latMat);
    lattice.name = 'lattice';
    lattice.frustumCulled = false;
    lattice.onBeforeRender = syncStrata;
    group.add(lattice);
  }

  const edges = [];
  const EDGE_ALPHA = RENDER.r3.alpha;
  if (opts.edges !== false) {
    const d = edgeData();
    const l = createLines({ segments: d.seg, width: d.width, faces: d.face, strata: strataM, strataAlpha: strataA, far, alpha: EDGE_ALPHA });
    l.mesh.name = 'edges';
    l.mesh.onBeforeRender = syncStrata;
    group.add(l.mesh);
    edges.push(l);
  }

  let vertices = null, vpts = null;
  const V_ALPHA = 0.4;
  if (opts.vertices) {
    const d = vertexData();
    vpts = createPoints({ positions: d.pos, faces: d.face, strata: strataM, strataAlpha: strataA, sizePx: 2, color: 'white', alpha: V_ALPHA });
    vertices = vpts.object;
    vertices.name = 'vertices';
    vertices.onBeforeRender = syncStrata;
    group.add(vertices);
  }

  let fade = 1;
  const parts = { solid: 1, lattice: 1, edges: 1, vertices: 1 };
  const applyAlpha = () => {
    group.visible = fade > 0;
    if (solidMat) solidMat.uniforms.uAlpha.value = fade * parts.solid;
    for (const m of solids) m.visible = fade * parts.solid > 0;
    if (latMat) { latMat.uniforms.uFade.value = fade * parts.lattice; lattice.visible = fade * parts.lattice > 0; }
    for (const e of edges) e.setAlpha(EDGE_ALPHA * fade * parts.edges);
    if (vpts) vpts.setAlpha(V_ALPHA * fade * parts.vertices);
  };

  const structure = {
    group, strata, solids, lattice, edges, vertices,
    /** WP0 additions: the shared per-stratum uniforms, materials and helpers (owners may read / tune them). */
    strataMatrices: strataM, strataAlpha: strataA, solidMaterial: solidMat, latticeMaterial: latMat,
    perStratum: per,
    setGap(g) {
      for (let i = 0; i < 7; i++) {
        const dy = (3 - i) * (g - GAP.rest);
        if (per) strata[i].position.y = dy;
        else strataM.value[i].makeTranslation(0, dy, 0);
      }
    },
    setFade(a) { fade = Math.max(0, Math.min(1, a)); applyAlpha(); },
    get fade() { return fade; },
    setStratumFade(i, a) { if (i >= 0 && i < 7) strataA.value[i] = Math.max(0, Math.min(1, a)); },
    /** Part multipliers (0..1) under the overall fade: { solid, lattice, edges, vertices }. */
    setParts(p) { for (const k in p) if (k in parts) parts[k] = p[k]; applyAlpha(); },
    /** Distance-fade far (canonical m) for lattice + edges (the current room's ROOMS[id].far). */
    setFar(f) { if (latMat) latMat.uniforms.uFar.value = f; for (const e of edges) e.uniforms.uFar.value = f; },
    /** Hall LOD: discard the caps of stratum i (−1 = none). */
    setHideCaps(i) { if (solidMat) solidMat.uniforms.uHideCapsOf.value = i; },
    /** Rebuilds the lattice twin at a new density (tier change: 0.5 on T1 for hall walls). */
    setLatticeDensity(d) {
      if (!lattice || d === density) return;
      density = d;
      const old = lattice.geometry;
      lattice.geometry = latticeGeometry(d);
      old.dispose();
    },
    dispose() {
      for (const m of solids) m.geometry.dispose();
      if (solidMat) solidMat.dispose();
      if (lattice) { lattice.geometry.dispose(); latMat.dispose(); }
      for (const e of edges) e.dispose();
      if (vpts) vpts.dispose();
      if (group.parent) group.parent.remove(group);
    },
  };
  structure.setGap(GAP.rest);
  if (opts.hallLod) structure.setHideCaps(-1);
  return structure;
}
