// halls/insignia/batch.js — WP9: CPU batches so a vault of 15 relics, up to 14 shards, the capsule and the NADIR plate
// cost a handful of draw calls (SPEC §6.0 ≤ 40 per hall). Each item keeps its own hall-local base arrays and a Matrix4;
// only items whose matrix changed are re-written (flush), so a still vault uploads nothing.
//   createSolidBatch({ cap, material }) → { mesh, add(flat) → slot, setMatrix(slot, m), setVisible(slot, b), flush(), dispose() }
//   createLineBatch(opts)               → { lines, add(edges, {alpha, width}) → slot, setMatrix, setVisible,
//                                            setAlpha(slot, a), setWidth(slot, w), setDraw(slot, 0..1), flush(), dispose() }
// Hidden items write degenerate (zero-area / zero-length) primitives. No allocation in setMatrix / flush.
import { BufferGeometry, BufferAttribute, Mesh, Matrix4, Matrix3 } from 'three';
import { createLines } from '../../render/lines.js';

const _n = new Matrix3();

/** @returns {{ mesh: Mesh, add(flat:{pos:Float32Array,nrm:Float32Array}):number, setMatrix(slot:number, m:Matrix4):void,
 *   setVisible(slot:number, b:boolean):void, flush():void, dispose():void }} */
export function createSolidBatch({ cap, material, name = 'batch' }) {
  const pos = new Float32Array(cap * 3), nrm = new Float32Array(cap * 3);
  const geo = new BufferGeometry();
  const pa = new BufferAttribute(pos, 3), na = new BufferAttribute(nrm, 3);
  geo.setAttribute('position', pa);
  geo.setAttribute('normal', na);
  geo.setDrawRange(0, 0);
  const mesh = new Mesh(geo, material);
  mesh.frustumCulled = false;
  mesh.name = name;
  const items = [];
  let used = 0, dirty = false;

  function write(it) {
    const o = it.off * 3, P = it.pos, N = it.nrm, e = it.m.elements;
    if (!it.visible) { pos.fill(0, o, o + P.length); return; }
    _n.getNormalMatrix(it.m);
    const n = _n.elements;
    for (let i = 0; i < P.length; i += 3) {
      const x = P[i], y = P[i + 1], z = P[i + 2];
      pos[o + i] = e[0] * x + e[4] * y + e[8] * z + e[12];
      pos[o + i + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
      pos[o + i + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
      const a = N[i], b = N[i + 1], c = N[i + 2];
      let nx = n[0] * a + n[3] * b + n[6] * c, ny = n[1] * a + n[4] * b + n[7] * c, nz = n[2] * a + n[5] * b + n[8] * c;
      const l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nrm[o + i] = nx / l; nrm[o + i + 1] = ny / l; nrm[o + i + 2] = nz / l;
    }
  }
  return {
    mesh,
    add(flat) {
      const n = flat.pos.length / 3;
      if (used + n > cap) return -1;
      const it = { off: used, pos: flat.pos, nrm: flat.nrm, m: new Matrix4(), visible: true, dirty: true };
      items.push(it);
      used += n;
      geo.setDrawRange(0, used);
      dirty = true;
      return items.length - 1;
    },
    setMatrix(slot, m) { const it = items[slot]; if (!it) return; it.m.copy(m); it.dirty = true; dirty = true; },
    setVisible(slot, b) { const it = items[slot]; if (!it || it.visible === !!b) return; it.visible = !!b; it.dirty = true; dirty = true; },
    flush() {
      if (!dirty) return;
      dirty = false;
      for (let k = 0; k < items.length; k++) { const it = items[k]; if (it.dirty) { it.dirty = false; write(it); } }
      pa.needsUpdate = true; na.needsUpdate = true;
    },
    dispose() { geo.dispose(); if (mesh.parent) mesh.parent.remove(mesh); },
  };
}

/** opts: createLines opts (color, dash, far, glint, fog …) + cap (segments). Per-item alpha / width multiply the
 *  per-segment attributes; setDraw(slot, f) draws the first f of an item's segments (a crack spreading). */
export function createLineBatch(opts) {
  const cap = opts.cap;
  const seg = new Float32Array(cap * 6);
  const width = new Float32Array(cap).fill(1), alpha = new Float32Array(cap).fill(1);
  const lines = createLines({ ...opts, segments: seg, count: 0, width, alpha });
  if (opts.name) lines.mesh.name = opts.name;
  const geo = lines.mesh.geometry;
  const items = [];
  let used = 0, dirty = false, attrDirty = false;

  function write(it) {
    const o = it.off * 6, E = it.edges, e = it.m.elements;
    const nSeg = E.length / 6, shown = it.visible ? Math.round(nSeg * it.draw) : 0;
    for (let s = 0; s < nSeg; s++) {
      const i = s * 6;
      if (s >= shown) { seg.fill(0, o + i, o + i + 6); continue; }
      for (let h = 0; h < 6; h += 3) {
        const x = E[i + h], y = E[i + h + 1], z = E[i + h + 2];
        seg[o + i + h] = e[0] * x + e[4] * y + e[8] * z + e[12];
        seg[o + i + h + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
        seg[o + i + h + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
      }
    }
  }
  function writeAttr(it) {
    const n = it.edges.length / 6;
    width.fill(it.width, it.off, it.off + n);
    alpha.fill(it.alpha, it.off, it.off + n);
  }
  return {
    lines,
    add(edges, o = {}) {
      const n = edges.length / 6;
      if (used + n > cap) return -1;
      const it = { off: used, edges, m: new Matrix4(), visible: true, draw: 1, alpha: o.alpha != null ? o.alpha : 1,
        width: o.width != null ? o.width : 1, dirty: true };
      items.push(it);
      used += n;
      writeAttr(it);
      dirty = true; attrDirty = true;
      return items.length - 1;
    },
    setMatrix(slot, m) { const it = items[slot]; if (!it) return; it.m.copy(m); it.dirty = true; dirty = true; },
    setVisible(slot, b) { const it = items[slot]; if (!it || it.visible === !!b) return; it.visible = !!b; it.dirty = true; dirty = true; },
    /** Replaces an item's base segments (same length; the dome's «Купол» morph). */
    setEdges(slot, edges) { const it = items[slot]; if (!it || edges.length !== it.edges.length) return; it.edges = edges; it.dirty = true; dirty = true; },
    setDraw(slot, f) { const it = items[slot]; if (!it) return; const v = Math.max(0, Math.min(1, f)); if (v === it.draw) return; it.draw = v; it.dirty = true; dirty = true; },
    setAlpha(slot, a) { const it = items[slot]; if (!it || it.alpha === a) return; it.alpha = a; writeAttr(it); attrDirty = true; },
    setWidth(slot, w) { const it = items[slot]; if (!it || it.width === w) return; it.width = w; writeAttr(it); attrDirty = true; },
    /** Per-segment access (glint sweeps): → { off, n } of the item; write width/alpha arrays, then touch(). */
    range(slot) { const it = items[slot]; return it ? { off: it.off, n: it.edges.length / 6 } : { off: 0, n: 0 }; },
    width, alpha,
    touch() { attrDirty = true; },
    flush() {
      if (dirty) {
        dirty = false;
        for (let k = 0; k < items.length; k++) { const it = items[k]; if (it.dirty) { it.dirty = false; write(it); } }
        lines.setSegments(seg, used);
      }
      if (attrDirty) {
        attrDirty = false;
        if (geo.attributes.aW) geo.attributes.aW.needsUpdate = true;
        if (geo.attributes.aAl) geo.attributes.aAl.needsUpdate = true;
      }
    },
    dispose() { lines.dispose(); },
  };
}

/** A view on a batch for items that must stay still while the batch's group turns (the vault's yaw): every matrix set
 *  through the view is stored and applied as R_y(−yaw) · m, and re-applied when the yaw changes (setYaw). The rest of
 *  the batch API passes through. */
export function createStaticView(batch) {
  const stored = new Map();                       // slot → Matrix4 (the hall-frame matrix)
  const slots = [];
  const inv = new Matrix4(), tmp = new Matrix4();
  let yaw = 0;
  const apply = (slot) => { tmp.multiplyMatrices(inv, stored.get(slot)); batch.setMatrix(slot, tmp); };
  const view = Object.create(batch);
  view.setMatrix = (slot, m) => {
    if (slot < 0) return;
    let s = stored.get(slot);
    if (!s) { s = new Matrix4(); stored.set(slot, s); slots.push(slot); }
    s.copy(m);
    apply(slot);
  };
  view.setYaw = (y) => {
    if (y === yaw) return;
    yaw = y;
    inv.makeRotationY(-y);
    for (let k = 0; k < slots.length; k++) apply(slots[k]);
  };
  return view;
}
