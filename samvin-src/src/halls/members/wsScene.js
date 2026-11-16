// halls/members/wsScene.js — the 3D of WORKSHOP «МАСТЕРСКАЯ» (SPEC §6.2.1), hall-local metres:
//   • the chamber: the inside of his capital's throat — an n-gon section 4.4 m across (circumradius 2.2 m) running back
//     along −z behind the grid: its n edges in 1 px --steel, the back plate's outline, no ring parade (§2.8)
//   • the 7×7 node grid floating at z = 0 facing the camera: 2.4 m square, 0.4 m apart, 4 px --silver dots
//   • his edges: 1.5 px --white ribbons; the live rubber band from the last node to the pointer (1 px --silver 50 %)
//   • ОТПЕЧАТОК: the ember beam trace (2 px --ember edges drawn in order + a 4 px ember head), the backing turning into a
//     solid obsidian plate (R2) with the glyph cut into it (R4, atlas region free:1), the ≤ 2,500 ms electrum edge
//     flash, and the plate's flight up out of the chamber toward his capital.
import { Mesh, Vector3 } from 'three';
import { U } from '../../render/uniforms.js';
import { createLines } from '../../render/lines.js';
import { createPoints } from '../../render/points.js';
import { createObsidian } from '../../render/obsidian.js';
import { atlas } from '../../render/engraveAtlas.js';
import { drawGlyph, normalizeGlyph } from '../../core/glyph.js';
import { capitalGeometry, capitalEdge } from './shape.js';

const TAU = Math.PI * 2;
/** cx: the chamber stands 9 m off the axis (the world's ember axis pillar runs through x = z = 0 and must not cross
 *  the grid); gridY 3 m above the hall anchor (+487 m, above his capital at ≈ +485 m, which the camera rises through). */
export const WS = Object.freeze({ step: 0.4, half: 1.2, cx: 9, gridY: 3.0, back: -1.2, depth: 14, chamberR: 2.2 });

/** Hall-local position of node i (row 0 at the top). */
export function nodePos(i, out) {
  const col = i % 7, row = Math.floor(i / 7);
  return out.set(WS.cx + (col - 3) * WS.step, WS.gridY + (3 - row) * WS.step, 0);
}

export function createWorkshopScene(group, n) {
  const root = group;
  // chamber: n longitudinal edges + the back outline + the mouth outline (fogged away)
  const seg = [];
  const P = (k) => { const a = (TAU * k) / n + Math.PI / n; return [WS.cx + Math.sin(a) * WS.chamberR, WS.gridY + Math.cos(a) * WS.chamberR]; };
  for (let k = 0; k < n; k++) {
    const [x0, y0] = P(k), [x1, y1] = P(k + 1);
    seg.push(x0, y0, WS.back, x0, y0, WS.depth);
    seg.push(x0, y0, WS.back, x1, y1, WS.back);
    // the plate seat: the n-gon frame the grid floats in, a hair in front of the back plate
    const f = 0.92, ax = WS.cx * (1 - f), ay = WS.gridY * (1 - f);
    seg.push(x0 * f + ax, y0 * f + ay, -0.6, x1 * f + ax, y1 * f + ay, -0.6);
  }
  const chamber = createLines({ segments: new Float32Array(seg), color: 'steel', alpha: 0.9, width: 1, far: 30 });
  chamber.mesh.name = 'ws:chamber';
  root.add(chamber.mesh);

  // grid
  const gp = new Float32Array(49 * 3), _v = new Vector3();
  for (let i = 0; i < 49; i++) { nodePos(i, _v); gp[3 * i] = _v.x; gp[3 * i + 1] = _v.y; gp[3 * i + 2] = 0; }
  const sizes = new Float32Array(49).fill(1);
  const grid = createPoints({ positions: gp, sizePx: 4, color: 'silver', alpha: 0.9, sizes });
  grid.object.name = 'ws:grid';
  root.add(grid.object);

  // edges (≤ 24) + the rubber band (1) in one batch
  const eSeg = new Float32Array(25 * 6), eW = new Float32Array(25).fill(1.5), eA = new Float32Array(25).fill(1);
  const eCol = new Float32Array(25 * 3);
  const edges = createLines({ segments: eSeg, count: 0, width: eW, alpha: eA, color: eCol, far: 30 });
  edges.uniforms.uAlpha.value = 1;
  edges.mesh.name = 'ws:edges';
  root.add(edges.mesh);

  // ОТПЕЧАТОК: trace (ember) + head point
  const tSeg = new Float32Array(24 * 6);
  const trace = createLines({ segments: tSeg, count: 0, color: 'ember', width: 2, alpha: 1, far: 30 });
  trace.mesh.name = 'ws:trace';
  trace.mesh.visible = false;
  root.add(trace.mesh);
  const head = createPoints({ positions: new Float32Array(3), sizePx: 4, color: 'ember', alpha: 1 });
  head.object.visible = false;
  root.add(head.object);

  // the plate: his capital's n-gon, soffit turned to face the camera, engraved from free:1
  const plateGeo = capitalGeometry(n);
  const plateMat = createObsidian({ engrave: 'free:1', r1: false });
  const plate = new Mesh(plateGeo, plateMat);
  // soffit (−y) → +z facing the camera, its v (z) running down the screen: rotate −90° about x with local z mirrored
  plate.rotation.x = -Math.PI / 2;
  plate.scale.set(1, 1, -1);                // the soffit's 2.4 m glyph square = the grid square (nodes at ±1.2 m)
  plate.position.set(WS.cx, WS.gridY, -0.25);
  plate.visible = false;
  plate.name = 'ws:plate';
  root.add(plate);
  const flash = createLines({ segments: new Float32Array(capitalEdge(n)), color: 'electrum', width: 1.5, alpha: 0, far: 30 });
  flash.mesh.name = 'ws:flash';
  plate.add(flash.mesh);

  let palR = -1;
  const _a = new Vector3(), _b = new Vector3(), headPos = new Float32Array(3);
  const api = {
    chamber, grid, edges, trace, head, plate, plateMat, flash,
    /** Writes his edges (and the rubber band from node `from` to the hall-local point `to`, or none). */
    setEdges(list, from = -1, to = null) {
      const w = U.cWhite.value, s = U.cSilver.value;
      let k = 0;
      for (; k < list.length && k < 24; k++) {
        const [a, b] = list[k];
        nodePos(a, _v); eSeg[k * 6] = _v.x; eSeg[k * 6 + 1] = _v.y; eSeg[k * 6 + 2] = 0.002;
        nodePos(b, _v); eSeg[k * 6 + 3] = _v.x; eSeg[k * 6 + 4] = _v.y; eSeg[k * 6 + 5] = 0.002;
        eCol[3 * k] = w.r; eCol[3 * k + 1] = w.g; eCol[3 * k + 2] = w.b; eW[k] = 1.5; eA[k] = 1;
      }
      if (from >= 0 && to) {
        nodePos(from, _v);
        eSeg[k * 6] = _v.x; eSeg[k * 6 + 1] = _v.y; eSeg[k * 6 + 2] = 0.002;
        eSeg[k * 6 + 3] = to.x; eSeg[k * 6 + 4] = to.y; eSeg[k * 6 + 5] = 0.002;
        eCol[3 * k] = s.r; eCol[3 * k + 1] = s.g; eCol[3 * k + 2] = s.b; eW[k] = 1; eA[k] = 0.5;
        k++;
      }
      edges.setSegments(eSeg, k);
      const g = edges.mesh.geometry;
      g.attributes.aCol.needsUpdate = true; g.attributes.aW.needsUpdate = true; g.attributes.aAl.needsUpdate = true;
      palR = w.r;
    },
    paletteChanged() { return U.cWhite.value.r !== palR; },
    /** The trace: the first `count` edges fully + the current one up to `frac`; head at its tip. */
    setTrace(list, count, frac) {
      let k = 0;
      for (let i = 0; i < list.length && i <= count; i++) {
        const f = i < count ? 1 : frac;
        if (f <= 0) break;
        nodePos(list[i][0], _a); nodePos(list[i][1], _b);
        _b.sub(_a).multiplyScalar(f).add(_a);
        const o = k * 6;
        tSeg[o] = _a.x; tSeg[o + 1] = _a.y; tSeg[o + 2] = 0.004; tSeg[o + 3] = _b.x; tSeg[o + 4] = _b.y; tSeg[o + 5] = 0.004;
        k++;
        if (i === count || (i === list.length - 1 && f >= 1)) { headPos[0] = _b.x; headPos[1] = _b.y; headPos[2] = 0.006; head.setPositions(headPos, 1); }
      }
      trace.setSegments(tSeg, k);
      head.object.visible = k > 0;
      trace.mesh.visible = k > 0;
    },
    clearTrace() { trace.setSegments(tSeg, 0); trace.mesh.visible = false; head.object.visible = false; },
    /** Cuts the glyph into the plate's region (R4 height + inlay). */
    engrave(list) {
      const g = normalizeGlyph(list);
      atlas.draw('free:1', {
        height(c, w) {
          const m = w / 16, lw = Math.max(3, w * 0.036);
          // the plate fills a third of the screen from a 128 px (T1) region: a soft height ramp keeps the bevel from
          // stair-stepping when the region is magnified (the cut stays crisp in the inlay)
          const f0 = c.filter;
          c.filter = `blur(${Math.max(0.8, w / 160).toFixed(2)}px)`;
          drawGlyph(c, g, { x: m, y: m, size: w - 2 * m, lineWidth: lw, color: 'rgba(255,255,255,0.3)' });
          drawGlyph(c, g, { x: m, y: m, size: w - 2 * m, lineWidth: Math.max(1, lw * 0.45), color: 'rgba(255,255,255,0.52)' });
          c.filter = f0 || 'none';
        },
        inlay(c, w) {
          const m = w / 16, lw = Math.max(3, w * 0.036);
          drawGlyph(c, g, { x: m, y: m, size: w - 2 * m, lineWidth: lw + 1.5, color: 'rgba(255,255,255,0.5)' });
          c.globalCompositeOperation = 'destination-out';
          drawGlyph(c, g, { x: m, y: m, size: w - 2 * m, lineWidth: Math.max(1, lw - 1.5), color: '#fff' });
          c.globalCompositeOperation = 'source-over';
        },
      });
    },
    setAlpha(a) {
      chamber.setAlpha(0.9 * a);
      grid.setAlpha(0.9 * a);
      edges.uniforms.uAlpha.value = a; edges.mesh.visible = a > 0.004;
    },
    dispose() {
      for (const l of [chamber, edges, trace, flash]) l.dispose();
      for (const p of [grid, head]) { p.dispose(); if (p.object.parent) p.object.parent.remove(p.object); }
      plateGeo.dispose(); plateMat.dispose();
      if (plate.parent) plate.parent.remove(plate);
    },
  };
  return api;
}
