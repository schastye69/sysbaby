// halls/members/columns.js — the clan's columns: geometry, per-column state and the per-frame writer (SPEC §6.2, §2.7,
// §7.4 «Подъём колонн», A3.2 visuals, A5.2 curtain call).
//
// Rendering (one hall batch, few draw calls): every 7 columns share ONE R3 ribbon batch (createLines with faces + the
// 7 "strata" matrices = the 7 column transforms: base · bow · sway shear · telescope), per-segment colour/alpha written
// only while light runs on a column (climb, pluck pulse). Each capital is its own obsidian mesh engraved from the atlas
// region capital:k (R2 + R4), placed by the same transform; the operator's capital has the 1.5 px ember soffit edge
// (2 px in owner mode) and, before his glyph exists, the dotted 7×7 --pewter grid.
// Per-frame code allocates nothing; transforms are built from preallocated matrices.
import { Matrix4, Mesh, Vector3, Group } from 'three';
import { createLines } from '../../render/lines.js';
import { createObsidian } from '../../render/obsidian.js';
import { createPoints } from '../../render/points.js';
import { atlas } from '../../render/engraveAtlas.js';
import { U } from '../../render/uniforms.js';
import { drawGlyph, normalizeGlyph } from '../../core/glyph.js';
import { SPRINGS } from '../../core/tokens.js';
import { COL, columnShape, columnSegments, capitalGeometry, capitalEdge, soffitGrid, capitalWedge } from './shape.js';

const DEG = Math.PI / 180;
const CHUNK = 7;
const BASE_A = 0.70;                       // SPEC §6.2: 1 px --silver 70 %
const ARC_R = 48;

/** Arc angle (rad) → hall-local base position on the 48 m arc centred on the camera's ground point (0, 0, 48). */
export function arcX(th) { return ARC_R * Math.sin(th); }
export function arcZ(th) { return ARC_R - ARC_R * Math.cos(th); }

/** Paints a member glyph into an atlas region: R4 height (cut strokes) + the 1 px base inlay outline. Empty glyph →
 *  the region is cleared (uncut). → true when drawn */
export function engraveCapital(k, edges) {
  const list = normalizeGlyph(edges);
  return atlas.draw(`capital:${k}`, {
    // a V-groove: the cut is deepest on the stroke's centre line (R falls to 0 there), shallower toward its lips
    height(c, w, h) {
      if (!list.length) return;
      const m = w / 16, lw = Math.max(2.5, w * 0.036);
      drawGlyph(c, list, { x: m, y: m, size: w - 2 * m, lineWidth: lw, color: 'rgba(255,255,255,0.3)' });
      drawGlyph(c, list, { x: m, y: m, size: w - 2 * m, lineWidth: Math.max(1, lw * 0.45), color: 'rgba(255,255,255,0.52)' });
      void h;
    },
    // the base inlay: only the groove's two lips, faint (R2 always shows it at 45 % --silver × this mask)
    inlay(c, w) {
      if (!list.length) return;
      const m = w / 16, lw = Math.max(2.5, w * 0.036);
      drawGlyph(c, list, { x: m, y: m, size: w - 2 * m, lineWidth: lw + 1.5, color: 'rgba(255,255,255,0.5)' });
      c.globalCompositeOperation = 'destination-out';
      drawGlyph(c, list, { x: m, y: m, size: w - 2 * m, lineWidth: Math.max(1, lw - 1.5), color: '#fff' });
      c.globalCompositeOperation = 'source-over';
    },
  });
}

/** @returns {Columns} */
export function createColumns(opts) {
  const { members, operatorId, group, far = 800 } = opts;
  const n = members.length;
  const root = new Group();
  root.name = 'members:columns';
  group.add(root);

  const cols = [];
  const batches = [];
  // ─── column state + geometry ──────────────────────────────────────────────────────────────────────────────────
  for (let b = 0; b * CHUNK < n; b++) {
    const seg = [], hs = [], faces = [];
    const strata = { value: [] }, strataA = { value: [1, 1, 1, 1, 1, 1, 1] };
    for (let i = 0; i < 7; i++) strata.value.push(new Matrix4());
    const members7 = members.slice(b * CHUNK, b * CHUNK + CHUNK);
    members7.forEach((m, i) => {
      const k = b * CHUNK + i;
      const shape = columnShape(m.seed);
      const s0 = hs.length;
      const c = columnSegments(shape, seg, hs);
      for (let q = 0; q < c; q++) faces.push(i * 16);
      cols.push({
        k, id: m.id, member: m, op: m.id === operatorId, shape, batch: b, slot: i, s0, s1: s0 + c,
        // layout
        th: 0, thV: 0, thT: 0, x: 0, z: 0,
        // telescope (hover / focus): integer steps toward the target, 45 ms apart
        teleStep: 0, teleTarget: 0, teleNext: 0, tele: 1,
        // arrival build: rise 0..1 (quantised ratchet), capital drop (m)
        rise: 1, drop: 0, enterA: 1,
        // struck sway at the capital (m) + velocity
        sx: 0, sz: 0, svx: 0, svz: 0,
        // СБОР push (A3.2): a one-sided pulse A·x·e^(1−x) away from him — it never swings back toward him
        px: 0, pz: 0, pT0: -1e9, pDx: 0, pDz: 0, pA: 0,
        // bow (rad, forward = toward the camera), driven by the hall
        bow: 0,
        // dim (0.4 when another column is focused)
        dim: 1, dimT: 1,
        // light: up to 3 concurrent runs [start, dur, peak]
        light: new Float32Array(9), lightN: 0, lit: false,
        // capital: flash to --white (decays), silver glow until, re-index turn (spring ω 9)
        flash: 0, flashUntil: 0, glowUntil: 0, rot: 0, rotV: 0, rotT: 0,
        // the 1 px «в пути» ring breathing at the capital (СБОР)
        breathe: false, here: false,
        mesh: null, mat: null, matrix: new Matrix4(), capM: new Matrix4(),
      });
    });
    const segF = new Float32Array(seg);
    const count = hs.length;
    const colr = new Float32Array(count * 3);
    const alph = new Float32Array(count);
    alph.fill(BASE_A);
    const lines = createLines({
      segments: segF, color: colr, alpha: alph, width: 1, far,
      faces: new Float32Array(faces), strata, strataAlpha: strataA,
    });
    lines.uniforms.uAlpha.value = 1;
    lines.mesh.name = `members:columns:${b}`;
    root.add(lines.mesh);
    batches.push({ lines, strata, strataA, colr, alph, hs: new Float32Array(hs), cols: cols.filter((c) => c.batch === b), dirty: true });
  }

  // ─── capitals ───────────────────────────────────────────────────────────────────────────────────────────────
  for (const c of cols) {
    const geo = capitalGeometry(c.shape.n);
    const mat = createObsidian({ engrave: `capital:${c.k}`, r1: false });
    const mesh = new Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    mesh.name = `members:capital:${c.id}`;
    root.add(mesh);
    c.mesh = mesh; c.mat = mat;
  }
  const op = cols.find((c) => c.op) || null;

  // the operator's ember soffit edge + dotted grid
  let edge = null, dots = null;
  if (op) {
    edge = createLines({ segments: new Float32Array(capitalEdge(op.shape.n)), color: 'ember', width: 1.5, alpha: 1, far });
    edge.mesh.matrixAutoUpdate = false;
    edge.mesh.name = 'members:opEdge';
    root.add(edge.mesh);
    dots = createPoints({ positions: soffitGrid(), sizePx: 2.5, color: 'pewter', alpha: 0.95 });
    dots.object.matrixAutoUpdate = false;
    dots.object.name = 'members:opGrid';
    root.add(dots.object);
  }

  // Effects ribbon batch (A3.2 perf: the СБОР call ring 64 segments + ≤ 6 threads × 32 + breathing rings), built here
  // so every column effect lives in this module's batches. Segments are rewritten while an effect runs.
  const FX_CAP = 64 + 6 * 32 + 12 * 24;
  const fxSeg = new Float32Array(FX_CAP * 6);
  const fxAl = new Float32Array(FX_CAP);
  const fxCol = new Float32Array(FX_CAP * 3);
  const fxW = new Float32Array(FX_CAP).fill(1);
  const fxLines = createLines({ segments: fxSeg, count: 0, color: fxCol, alpha: fxAl, width: fxW, far, fog: true });
  fxLines.uniforms.uAlpha.value = 1;
  fxLines.mesh.name = 'members:fx';
  fxLines.setSegments(fxSeg, 0);
  root.add(fxLines.mesh);

  // WORKSHOP iris (built on demand): the operator capital as n wedges hinged at their outer edges
  let wedges = null, irisOpen = 0;

  // ─── preallocated scratch ──────────────────────────────────────────────────────────────────────────────────
  const _A = new Matrix4(), _R = new Matrix4(), _T = new Matrix4(), _Q = new Matrix4(), _S = new Matrix4();
  const _axis = new Vector3(), _v = new Vector3();
  const pal = { sr: -1, sg: -1, sb: -1 };

  let alphaAll = 1, ownerW = 1.5, camZ = 48, dotsLit = false;

  /** Recomputes x, z from the current arc angle. */
  function place(c) { c.x = arcX(c.th); c.z = arcZ(c.th); }

  /** Column transform: T(base) · R_bow · [shear(sway) · scale(telescope · rise)] into c.matrix; the capital's into c.capM. */
  function transforms(c) {
    const h = c.tele * c.rise;
    const sx = c.sx + c.px, sz = c.sz + c.pz;
    _A.set(
      1, sx / COL.H, 0, 0,
      0, h, 0, 0,
      0, sz / COL.H, 1, 0,
      0, 0, 0, 1,
    );
    // bow axis = up × f, f = horizontal direction toward the camera's ground point
    let fx = -c.x, fz = camZ - c.z;
    const fl = Math.hypot(fx, fz) || 1;
    fx /= fl; fz /= fl;
    if (c.bow !== 0) { _axis.set(fz, 0, -fx); _R.makeRotationAxis(_axis, c.bow); } else _R.identity();
    c.matrix.multiplyMatrices(_R, _A);
    c.matrix.elements[12] = c.x; c.matrix.elements[13] = 0; c.matrix.elements[14] = c.z;
    // capital: T(base) · R_bow · T(sway, top + gap + drop) · Ry(face the clan) · Rx(−tilt) · Ry(re-index)
    _T.makeTranslation(sx, COL.H * h + (COL.capY - COL.H) + c.drop, sz);
    _Q.makeRotationY(Math.atan2(fx, fz));
    _S.makeRotationX(-COL.capTiltDeg * DEG);
    _Q.multiply(_S);
    _S.makeRotationY(c.rot);
    _Q.multiply(_S);
    _T.multiply(_Q);
    c.capM.multiplyMatrices(_R, _T);
    c.capM.elements[12] += c.x; c.capM.elements[14] += c.z;
  }

  /** Light at normalised height hh for column c at time now (0..~1.6). */
  function lightAt(c, hh, now) {
    let L = 0;
    for (let j = 0; j < c.lightN; j++) {
      const st = c.light[3 * j], dur = c.light[3 * j + 1], pk = c.light[3 * j + 2];
      const t = (now - st) / dur;
      if (t < 0) continue;
      const head = Math.min(1, t);
      const tail = t > 1 ? Math.max(0, 1 - (t - 1) * (dur / 300)) : 1;   // the lit column fades over 300 ms after the head arrives
      if (hh <= head) {
        const d = head - hh;
        L += pk * tail * (0.42 * Math.exp(-d * 3.2) + (t <= 1 ? Math.exp(-(d * d) / 0.0036) : 0));
      }
    }
    return L;
  }

  function writeLight(bt, now) {
    const sr = U.cSilver.value.r, sg = U.cSilver.value.g, sb = U.cSilver.value.b;
    const wr = U.cWhite.value.r, wg = U.cWhite.value.g, wb = U.cWhite.value.b;
    const palChanged = sr !== pal.sr || sg !== pal.sg || sb !== pal.sb;
    let wrote = false;
    for (let q = 0; q < bt.cols.length; q++) {
      const c = bt.cols[q];
      // drop finished runs
      let w = 0;
      for (let j = 0; j < c.lightN; j++) {
        const st = c.light[3 * j], dur = c.light[3 * j + 1];
        if (now - st < dur + 300) { if (w !== j) { c.light[3 * w] = st; c.light[3 * w + 1] = dur; c.light[3 * w + 2] = c.light[3 * j + 2]; } w++; }
      }
      c.lightN = w;
      const active = w > 0;
      if (!active && !c.lit && !palChanged && !bt.dirty) continue;
      for (let s = c.s0; s < c.s1; s++) {
        const L = active ? Math.min(1.4, lightAt(c, bt.hs[s], now)) : 0;
        const m = Math.min(1, L);
        bt.colr[3 * s] = sr + (wr - sr) * m;
        bt.colr[3 * s + 1] = sg + (wg - sg) * m;
        bt.colr[3 * s + 2] = sb + (wb - sb) * m;
        bt.alph[s] = Math.min(1, BASE_A * (1 + 0.9 * L));
      }
      c.lit = active;
      wrote = true;
    }
    if (palChanged) { pal.sr = sr; pal.sg = sg; pal.sb = sb; }
    bt.dirty = false;
    if (wrote) {
      const g = bt.lines.mesh.geometry;
      g.attributes.aCol.needsUpdate = true;
      g.attributes.aAl.needsUpdate = true;
    }
  }

  const struck = SPRINGS.struck, reidx = SPRINGS.reindex;

  const api = {
    list: cols,
    op,
    root,
    count: n,
    fxLines, fxSeg, fxAl, fxCol, fxW, FX_CAP,

    /** Arc layout: sets every column's target angle (rad); instant snaps. */
    setTargets(thetas, instant) {
      for (let i = 0; i < cols.length; i++) {
        cols[i].thT = thetas[i];
        if (instant) { cols[i].th = thetas[i]; cols[i].thV = 0; place(cols[i]); }
      }
    },
    setCameraZ(z) { camZ = z; },
    setAlpha(a) { alphaAll = a; },
    setOwner(on) { ownerW = on ? 2 : 1.5; if (edge) edge.setWidth(ownerW); },
    setDots(on) { if (dots) dots.object.visible = !!on; },
    dotsShown() { return !!(dots && dots.object.visible); },
    /** S06 hint: the dotted grid flashes (--white, larger) while on. */
    dotsFlash(on) {
      if (!dots || dotsLit === !!on) return;
      dotsLit = !!on;
      dots.setColor(on ? 'white' : 'pewter');
      dots.setSize(on ? 4 : 2.5);
    },

    /** Telescope target (0 = rest, 1 = +15 %): ratchets one step per 45 ms; returns the steps to run. */
    telescope(c, on, now) {
      const tgt = on ? COL.teleSteps : 0;
      if (c.teleTarget === tgt) return 0;
      c.teleTarget = tgt;
      if (c.teleNext < now) c.teleNext = now;
      return Math.abs(tgt - c.teleStep);
    },
    /** Light climbs the generators base → capital over ms (peak 1); queue a second run with `delayMs`. */
    climb(c, ms, now, peak = 1, delayMs = 0) {
      let j = c.lightN;
      if (j >= 3) { j = 0; for (let q = 1; q < 3; q++) if (c.light[3 * q] < c.light[3 * j]) j = q; } else c.lightN++;
      c.light[3 * j] = now + delayMs; c.light[3 * j + 1] = Math.max(16, ms); c.light[3 * j + 2] = peak;
    },
    /** SPEC §6.2 strum: the struck spring kick toward (dx, dz) (unit), peak ≈ amp m at the capital. */
    kick(c, dx, dz, amp) {
      const v0 = (amp * struck.omega) / 0.82;
      c.svx += dx * v0; c.svz += dz * v0;
    },
    /** A one-sided push of amp m at the capital toward (dx, dz) (unit), peaking at 160 ms, gone by ≈ 1 s. */
    push(c, dx, dz, amp, now) { c.pT0 = now; c.pDx = dx; c.pDz = dz; c.pA = amp; },
    flash(c, ms, now, amount = 1) { c.flash = Math.max(c.flash, amount); c.flashUntil = Math.max(c.flashUntil, now + ms); },
    glow(c, ms, now) { c.glowUntil = Math.max(c.glowUntil, now + ms); },
    reindex(c) { c.rotT += (Math.PI * 2) / c.shape.n; },
    engrave(c, edges) { return engraveCapital(c.k, edges); },

    /** Hall-local capital centre (the soffit centre) of column c. */
    capitalPoint(c, out) { return out.set(c.capM.elements[12], c.capM.elements[13], c.capM.elements[14]); },
    /** Hall-local point at height y (m, before telescope) on the column axis (sway and bow applied). */
    axisPoint(c, y, out) { return out.set(0, y, 0).applyMatrix4(c.matrix); },

    /** WORKSHOP iris on the operator capital (0 closed … 1 = each wedge turned 50° outward). */
    setIris(u) {
      if (!op) return;
      irisOpen = u;
      if (u > 0 && !wedges) {
        const mat = createObsidian({ engrave: null, r1: false, rim: 0.18 });   // seen edge-on from inside: keep the plates dark
        wedges = [];
        for (let k = 0; k < op.shape.n; k++) {
          const w = capitalWedge(op.shape.n, k);
          const m = new Mesh(w.geometry, mat);
          m.matrixAutoUpdate = false;
          m.name = 'members:iris';
          root.add(m);
          wedges.push({ mesh: m, hinge: w.hinge, tangent: w.tangent, M: new Matrix4() });
        }
        wedges.mat = mat;
      }
    },

    /** Per frame. dt seconds, now ms. */
    update(dt, now) {
      const dts = Math.min(dt, 0.1), nSub = dts > 1 / 60 ? 2 : 1, h = dts / nSub;
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        for (let q = 0; q < nSub; q++) {   // two substeps on a long frame keep the springs stable and on time
          // arc angle: medium spring (ω 12, critically damped)
          const w = SPRINGS.medium.omega;
          const a = w * w * (c.thT - c.th) - 2 * w * c.thV;
          c.thV += a * h; c.th += c.thV * h;
          // struck sway
          const so = struck.omega, sz = struck.zeta;
          c.svx += (-so * so * c.sx - 2 * sz * so * c.svx) * h; c.sx += c.svx * h;
          c.svz += (-so * so * c.sz - 2 * sz * so * c.svz) * h; c.sz += c.svz * h;
          // capital re-index (ω 9)
          const ro = reidx.omega;
          c.rotV += (ro * ro * (c.rotT - c.rot) - 2 * ro * c.rotV) * h; c.rot += c.rotV * h;
        }
        if (Math.abs(c.thT - c.th) < 1e-5 && Math.abs(c.thV) < 1e-5) { c.th = c.thT; c.thV = 0; }
        place(c);
        // telescope ratchet
        while (c.teleStep !== c.teleTarget && now >= c.teleNext) {
          c.teleStep += c.teleTarget > c.teleStep ? 1 : -1;
          c.teleNext = now + COL.teleStepMs;
          if (api.onTeleStep) api.onTeleStep(c, c.teleStep);
        }
        if (c.pA > 0) {
          const x = (now - c.pT0) / 160;
          const v = x <= 0 ? 0 : x > 7 ? 0 : c.pA * x * Math.exp(1 - x);
          c.px = c.pDx * v; c.pz = c.pDz * v;
          if (x > 7) { c.pA = 0; c.px = 0; c.pz = 0; }
        }
        const tt = 1 + (COL.teleMax - 1) * (c.teleStep / COL.teleSteps);
        c.tele += (tt - c.tele) * (1 - Math.exp(-dts / 0.012));   // each ratchet snaps in ≈ 30 ms
        // dim (≈ 480 ms)
        c.dim += (c.dimT - c.dim) * (1 - Math.exp(-dts / 0.14));
        transforms(c);
        // capital material
        let f = 0;
        if (now < c.flashUntil) f = c.flash; else c.flash = 0;
        if (now < c.glowUntil) f = Math.max(f, 0.34);
        // dimmed (another column focused): the plate darkens toward --void (a negative flash), never dithers
        if (f === 0 && c.dim < 0.999) f = -0.22 * (1 - c.dim) / 0.6;
        c.mat.uniforms.uFlash.value = f;
        const ca = alphaAll * c.enterA;   // capitals never dither-dim: obsidian is already dark; the lines carry the 40 %
        c.mat.uniforms.uAlpha.value = ca;
        c.mesh.visible = ca > 0.004 && !(c.op && irisOpen > 0);
        c.mesh.matrix.copy(c.capM);
        c.mesh.matrixWorldNeedsUpdate = true;
      }
      for (let b = 0; b < batches.length; b++) {
        const bt = batches[b];
        for (let q = 0; q < bt.cols.length; q++) {
          const c = bt.cols[q];
          bt.strata.value[c.slot].copy(c.matrix);
          bt.strataA.value[c.slot] = alphaAll * c.enterA * c.dim * (c.rise > 0 ? 1 : 0);
        }
        writeLight(bt, now);
        bt.lines.mesh.visible = alphaAll > 0.004;
      }
      if (op) {
        const oa = alphaAll * op.enterA;
        edge.mesh.matrix.copy(op.capM); edge.mesh.matrixWorldNeedsUpdate = true;
        edge.setAlpha(irisOpen > 0 ? 0 : oa);
        dots.object.matrix.copy(op.capM); dots.object.matrixWorldNeedsUpdate = true;
        if (dots.object.visible) dots.uniforms.uAlpha.value = api.dotsA * oa;
        if (wedges) {
          const on = irisOpen > 0;
          const ang = 50 * DEG * irisOpen;
          for (let k = 0; k < wedges.length; k++) {
            const wd = wedges[k];
            wd.mesh.visible = on;
            if (!on) continue;
            // hinge at the outer edge: rotate about the edge tangent so the inner tip swings up and outward
            _axis.set(wd.tangent[0], 0, wd.tangent[1]);
            _R.makeRotationAxis(_axis, -ang);
            _T.makeTranslation(wd.hinge[0], 0, wd.hinge[1]);
            wd.M.multiplyMatrices(_T, _R);
            wd.mesh.matrix.multiplyMatrices(op.capM, wd.M);
            wd.mesh.matrixWorldNeedsUpdate = true;
          }
          wedges.mat.uniforms.uAlpha.value = alphaAll;
        }
      }
      void _v;
    },
    dotsA: 0.95,
    onTeleStep: null,

    dispose() {
      for (const bt of batches) bt.lines.dispose();
      for (const c of cols) { c.mesh.geometry.dispose(); c.mat.dispose(); if (c.mesh.parent) c.mesh.parent.remove(c.mesh); }
      if (edge) edge.dispose();
      if (dots) { dots.dispose(); if (dots.object.parent) dots.object.parent.remove(dots.object); }
      fxLines.dispose();
      if (wedges) { for (const wd of wedges) { wd.mesh.geometry.dispose(); if (wd.mesh.parent) wd.mesh.parent.remove(wd.mesh); } wedges.mat.dispose(); wedges = null; }
      if (root.parent) root.parent.remove(root);
    },
  };
  return api;
}
