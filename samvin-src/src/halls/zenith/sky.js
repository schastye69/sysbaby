// halls/zenith/sky.js — WP9: ZENITH's open sky (SPEC §6.8, §12.2 stars per tier). Hall-local metres: the hall origin
// is 60 m above VIN's S apex (canonical +1 260), so the apex is at y −60 and the beacon at the mast tip at y −36.
//   stars          — 3,000 (T1: 1,200) points on a 3 km sphere all around (open sky above VIN; LAYER.NOFOG), 1–2 px
//                    --white, seeded so the sky is the same every visit;
//   constellations — every saved drawing (≤ 7): its points as 2 px --white stars joined by 0.5 px --slate lines, at
//                    fixed places in the band of sky above VIN's tip; at night the members' glyphs too, lower on the
//                    sides. → slots { index, kind, centre: Vector3 (hall-local), norm (the drawing) };
//   mast + beacon  — the S mast rising 24 m from the apex, a 6 px --ember beacon at its tip, "just below" the eye;
//   pinch          — 24 generators around the 12 m opening (the ascent): pinch(t) bends them toward the lens.
import { Vector3 } from 'three';
import { createPoints } from '../../render/points.js';
import { createLines } from '../../render/lines.js';
import { createEmitter } from '../../render/glow.js';
import { LAYER } from '../../render/uniforms.js';
import { mulberry32 } from '../../core/rng.js';
import { glyphSegments, normalizeGlyph } from '../../core/glyph.js';

const TAU = Math.PI * 2, DEG = Math.PI / 180;
export const APEX_Y = -60, MAST_TIP = -36, OPEN_R = 12;
const SKY_R = 3000, CON_R = 900;

/** A direction from yaw az (0 = −z, the rest view's forward) and elevation el (rad) → unit Vector3. */
function dir(az, el, out) { return out.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)); }

export function createSky(hctx, opts) {
  const n = opts.stars;
  const rnd = mulberry32(0x2e17);
  const pos = new Float32Array(n * 3), sizes = new Float32Array(n), alphas = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    // uniform on the sphere (no galaxy band: that would be wallpaper)
    const u = rnd() * 2 - 1, a = rnd() * TAU, r = Math.sqrt(1 - u * u);
    pos[3 * k] = Math.cos(a) * r * SKY_R; pos[3 * k + 1] = u * SKY_R; pos[3 * k + 2] = Math.sin(a) * r * SKY_R;
    const m = rnd();
    sizes[k] = m > 0.97 ? 1.6 : m > 0.8 ? 1.1 : 0.8;
    alphas[k] = 0.25 + 0.6 * Math.pow(rnd(), 2);
  }
  const stars = createPoints({ positions: pos, sizes, alphas, sizePx: 1.6, color: 'white', alpha: 1, fog: false, layer: LAYER.NOFOG });
  stars.object.name = 'zenith:stars';

  // ── constellations ──
  const slots = [];
  const cPts = [], cSeg = [];
  const _d = new Vector3(), _r = new Vector3(), _u = new Vector3(), _c = new Vector3();
  const Y = new Vector3(0, 1, 0);
  function place(points, segs, az, el, size, kind, index, norm) {
    dir(az, el, _d);
    _r.crossVectors(_d, Y).normalize();                          // screen-right at that place
    _u.crossVectors(_r, _d).normalize();                          // screen-up
    _c.copy(_d).multiplyScalar(CON_R);
    const s = (size * DEG) * CON_R;                               // angular size → metres at CON_R
    const P = (x, y, out) => out.copy(_c).addScaledVector(_r, x * s * 0.5).addScaledVector(_u, -y * s * 0.5);
    const a = new Vector3(), b = new Vector3();
    for (const p of points) { P(p[0], p[1], a); cPts.push(a.x, a.y, a.z); }
    for (const [p, q] of segs) { P(p[0], p[1], a); P(q[0], q[1], b); cSeg.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    slots.push({ index, kind, centre: _c.clone(), norm });
  }
  const view = opts.view;                                          // { pitch (rad, negative), hfov (deg), vfov (deg) }
  const top = view.pitch + (view.vfov / 2 - 7) * DEG;               // the band just under the frame's top edge
  const drawings = Array.isArray(opts.drawings) ? opts.drawings.slice(-7) : [];
  // fixed places across the upper sky, leaving the mast and the beacon (the centre ±7°) clear
  const half = view.hfov / 2 - 8;
  const placesDeg = [];
  for (let i = 0; i < 7; i++) { const k = (i % 2 ? 1 : -1) * (Math.floor(i / 2) + 1); placesDeg.push(k * Math.min(half / 4, 9) + Math.sign(k) * 5); }
  drawings.forEach((d, i) => {
    const pts = (Array.isArray(d) ? d : []).filter((p) => Array.isArray(p) && p.length >= 2).map((p) => [+p[0], +p[1]]);
    if (pts.length < 2) return;
    const segs = [];
    for (let k = 0; k < pts.length - 1; k++) segs.push([pts[k], pts[k + 1]]);
    const az = Math.max(-half, Math.min(half, placesDeg[i])) * DEG;
    place(pts, segs, az, top - (Math.floor(i / 2) % 2) * 3 * DEG, 5.5, 'drawing', i, pts);
  });
  if (opts.night) {
    const ms = opts.members || [];
    ms.forEach((m, i) => {
      const edges = normalizeGlyph(m.glyph || []);
      if (!edges.length) return;
      const gs = glyphSegments(edges, 2);                          // centred, spanning 2 → ±1
      const segs = [], pts = [];
      for (let k = 0; k < gs.length; k += 6) {
        const p = [gs[k], -gs[k + 1]], q = [gs[k + 3], -gs[k + 4]];
        segs.push([p, q]); pts.push(p, q);
      }
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
      const az = side * (view.hfov / 2 - 6 - row * 1.5) * DEG;
      place(pts, segs, az, view.pitch + (6 - row * 5) * DEG, 4, 'member', i, null);
    });
  }
  const conPts = createPoints({ positions: Float32Array.from(cPts.length ? cPts : [0, 0, 0]), count: cPts.length / 3, sizePx: 2,
    color: 'white', alpha: 0.95, fog: false, layer: LAYER.NOFOG });
  conPts.object.name = 'zenith:con-stars';
  const conLines = createLines({ segments: Float32Array.from(cSeg.length ? cSeg : [0, 0, 0, 0, 0, 0]), count: cSeg.length / 6,
    color: 'slate', alpha: 1, width: 0.5, fog: false, far: 5000, glint: 0, layer: LAYER.NOFOG });
  conLines.mesh.name = 'zenith:con-lines';

  // ── mast + beacon (S apex, "just below") ──
  const mast = [0, APEX_Y, 0, 0, MAST_TIP, 0];
  for (const [y, h] of [[APEX_Y + 9, 3.0], [APEX_Y + 17, 2.2], [MAST_TIP - 7, 1.4]]) mast.push(-h, y, 0, h, y, 0, 0, y, -h, 0, y, h);
  const mastL = createLines({ segments: Float32Array.from(mast), color: 'silver', alpha: 0.55, width: 1, far: 2000 });
  mastL.mesh.name = 'zenith:mast';
  const beacon = createEmitter({ color: 'ember', radius: 0.16, intensity: 1, fog: false });
  beacon.object.position.set(0, MAST_TIP, 0);
  beacon.object.name = 'zenith:beacon';

  // ── the pinch (ascent): 24 generators of a waisted hyperboloid around the opening, 8 segments each ──
  const G = 24, SEG = 8, H0 = APEX_Y - 34, H1 = APEX_Y + 26;
  const pinchSeg = new Float32Array(G * SEG * 6);
  const pinch = createLines({ segments: pinchSeg, color: 'silver', alpha: 0, width: 1, far: 400 });
  pinch.mesh.name = 'zenith:pinch';

  const api = {
    objects: [stars.object, conPts.object, conLines.mesh, mastL.mesh, beacon.object, pinch.mesh],
    slots,
    /** Generators around the lens: camY = the camera's hall-local height, k 0..1 = how tightly they pinch. */
    pinch(camY, k, a) {
      let o = 0;
      for (let g = 0; g < G; g++) {
        const a0 = (TAU * g) / G;
        for (let s = 0; s < SEG; s++) {
          for (let e = 0; e < 2; e++) {
            const f = (s + e) / SEG, y = H0 + (H1 - H0) * f;
            const tw = a0 + (f - 0.5) * 0.9;                       // the hyperboloid's twist
            const w = Math.exp(-((y - camY) * (y - camY)) / 180);  // the waist follows the lens
            const r = OPEN_R * (1.35 - 0.35 * (1 - Math.abs(f - 0.5) * 2)) * (1 - 0.72 * k * w);
            pinchSeg[o++] = Math.sin(tw) * r; pinchSeg[o++] = y; pinchSeg[o++] = Math.cos(tw) * r;
          }
        }
      }
      pinch.setSegments(pinchSeg);
      pinch.setAlpha(0.6 * a);
    },
    setAlpha(a) {
      stars.setAlpha(a); conPts.setAlpha(0.95 * a); conLines.setAlpha(a); mastL.setAlpha(0.55 * a);
      beacon.setIntensity(a);
    },
    dispose() {
      stars.dispose(); conPts.dispose(); conLines.dispose(); mastL.dispose(); beacon.dispose(); pinch.dispose();
    },
  };
  api.pinch(APEX_Y, 0, 0);
  return api;
}
