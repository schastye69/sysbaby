// halls/insignia/dome.js — WP9: the geodesic sphere «Купол» and the view down to the sealed NADIR plate (SPEC §6.6
// Space / Looking down, §7.4 «Купол»).
// Dome: frequency-3 icosphere, r 30 m, centred on the eye (0, 1.7, 0), 1 px --silver at 45 %, one pole turned to the
// nadir and the edges within 45° of it left out — the sphere's lower opening, through which the floor iris and the
// plate 280 m below are seen. «Купол» (900 ms): every vertex starts on the hall's converging lower generators (a cone
// from a 62 m ring 60 m up to the floor 150 m down) and lerps onto the sphere, lower vertices first, so the sphere
// closes around the camera last at the top. setBuild(p) is PURE in p (scrubbable).
// Plate: the 5-piece seal 280 m below (nadir/seal.js): slots filled = --white 4 px dots, empty = rings at slate weight.
// Once NADIR has been entered the plate is gone (its pieces fell). Everything lives in the vault's shared batches
// (static views: they do not turn with the relics), so the dome, the plate and the slots cost no draw call of their own.
import { IcosahedronGeometry, Matrix4, Vector3 } from 'three';
import { sealWhole, sealSlots, slotRing } from '../nadir/seal.js';

const R = 30, EYE = 1.7, OPEN_DEG = 45;
export const PLATE_Y = -280;                     // INSIGNIA-local: the NADIR deck (−1 090) seen from −810
const _m = new Matrix4();

function domeEdges() {
  const ico = new IcosahedronGeometry(1, 2);
  // turn a vertex of the base icosahedron (−1, φ, 0) onto the pole: rotate about z by atan(1/φ)
  ico.applyMatrix4(new Matrix4().makeRotationZ(-Math.atan2(1, (1 + Math.sqrt(5)) / 2)));
  const a = ico.attributes.position.array;
  const seen = new Set(), out = [];
  const key = (o) => `${a[o].toFixed(4)},${a[o + 1].toFixed(4)},${a[o + 2].toFixed(4)}`;
  const lim = -Math.cos((OPEN_DEG * Math.PI) / 180);
  for (let t = 0; t < a.length; t += 9) {
    for (const [p, q] of [[0, 3], [3, 6], [6, 0]]) {
      const ka = key(t + p), kb = key(t + q), k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      if (seen.has(k)) continue;
      seen.add(k);
      const ya = a[t + p + 1] / Math.hypot(a[t + p], a[t + p + 1], a[t + p + 2]);
      const yb = a[t + q + 1] / Math.hypot(a[t + q], a[t + q + 1], a[t + q + 2]);
      if (ya < lim + 1e-3 || yb < lim + 1e-3) continue;               // the lower opening
      for (const o of [t + p, t + q]) {
        const l = Math.hypot(a[o], a[o + 1], a[o + 2]);
        out.push(a[o] / l, a[o + 1] / l, a[o + 2] / l);
      }
    }
  }
  ico.dispose();
  return Float32Array.from(out);                 // unit directions, pairs
}

/** dir (unit) → the vertex's place on the converging lower generators (hall-local). */
function conePoint(x, y, z, out, o) {
  const t = (1 - y) / 2;                         // top 0 … nadir 1
  const az = Math.atan2(x, z);
  const rho = 62 * (1 - t) + 4;
  out[o] = Math.sin(az) * rho; out[o + 1] = 60 - 210 * t; out[o + 2] = Math.cos(az) * rho;
}

/** A filled 4 px "dot" in line form: a tiny triangle of 2 px strokes (0.9 m across at 280 m ≈ 4 px). */
function dotSegs(r) {
  const out = [];
  for (let j = 0; j < 3; j++) {
    const a0 = (Math.PI * 2 * j) / 3, a1 = (Math.PI * 2 * (j + 1)) / 3;
    out.push(Math.sin(a0) * r, 0, Math.cos(a0) * r, Math.sin(a1) * r, 0, Math.cos(a1) * r);
  }
  return Float32Array.from(out);
}

/** stat: static views { solids, silver, white } (batch.js createStaticView). */
export function createDome(hctx, stat) {
  const dirs = domeEdges();
  const nV = dirs.length / 3;
  const cone = new Float32Array(dirs.length), seg = new Float32Array(dirs.length);
  for (let i = 0; i < nV; i++) conePoint(dirs[i * 3], dirs[i * 3 + 1], dirs[i * 3 + 2], cone, i * 3);
  const domeSlot = stat.silver.add(seg, { alpha: 0.45, width: 1 });
  stat.silver.setMatrix(domeSlot, _m.identity());
  let built = -1;

  // ── the sealed plate, 280 m below ──
  const plate = sealWhole();
  const slots = sealSlots();
  const pSolid = stat.solids.add(plate.flat);
  const pEdge = stat.silver.add(plate.edges, { alpha: 0.75 });
  const ring = slotRing(0.9), dot = dotSegs(0.5);
  const rings = slots.map(() => stat.silver.add(ring, { alpha: 0.32, width: 1 }));
  const dots = slots.map(() => stat.white.add(dot, { alpha: 1, width: 2 }));
  _m.makeTranslation(0, PLATE_Y, 0);
  stat.solids.setMatrix(pSolid, _m);
  stat.silver.setMatrix(pEdge, _m);
  slots.forEach((p, k) => {
    _m.makeTranslation(p.x, PLATE_Y + p.y + 0.05, p.z);
    stat.silver.setMatrix(rings[k], _m);
    stat.white.setMatrix(dots[k], _m);
  });

  const api = {
    /** 0 = on the cone (nothing of the sphere yet) … 1 = the closed sphere. PURE. */
    setBuild(p) {
      const P = Math.max(0, Math.min(1, p));
      if (P === built) return;
      built = P;
      for (let i = 0; i < nV; i++) {
        const o = i * 3, t = (1 - dirs[o + 1]) / 2;
        // lower vertices first: start offset 0 (nadir) … 0.4 (top); 0.6 of the build each
        const u = Math.max(0, Math.min(1, (P - (1 - t) * 0.4) / 0.6));
        const w = u * u * (3 - 2 * u);
        seg[o] = cone[o] + (dirs[o] * R - cone[o]) * w;
        seg[o + 1] = cone[o + 1] + (dirs[o + 1] * R + EYE - cone[o + 1]) * w;
        seg[o + 2] = cone[o + 2] + (dirs[o + 2] * R - cone[o + 2]) * w;
      }
      stat.silver.setEdges(domeSlot, seg);
      stat.silver.setAlpha(domeSlot, 0.45 * Math.min(1, P * 2.5));
    },
    setDomeAlpha(a) { stat.silver.setAlpha(domeSlot, 0.45 * a); },
    /** Plate state: filled slots (0..5), gone (NADIR entered). */
    setPlate(filled, gone) {
      const show = !gone;
      stat.solids.setVisible(pSolid, show);
      stat.silver.setVisible(pEdge, show);
      for (let k = 0; k < 5; k++) {
        const f = k < filled;
        stat.silver.setVisible(rings[k], show && !f);
        stat.white.setVisible(dots[k], show && f);
      }
    },
    /** Hall-local centre of the plate (for the look-down pose). */
    plateCentre: new Vector3(0, PLATE_Y, 0),
    dispose() {},
  };
  api.setBuild(1);
  return api;
}
