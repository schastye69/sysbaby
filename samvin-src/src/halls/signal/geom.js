// halls/signal/geom.js — WP8: the SIGNAL hall's shared geometry (SPEC §6.5, ARCH §6.9).
//
// One place for every number that ties the 3D apex to the screen: the rest camera per layout, the screen circle of the
// sky pad (centred on the projected apex), the dial arc, the «Голос» trace line, and a pure projector used by the pad
// (where the remembered stars sit on screen) and by lostSpots(). Everything here is pure and allocation-light; the
// per-frame paths never call it (results are cached by the hall on build / resize).
//
// Camera note (reported to the integrator): SPEC §6.5 gives desktop (0, 2, 26) → target (0, 30, 0), "pitch ≈ +35°",
// FOV 40, and phone (0, 2, 30) pitch +40°. From those positions the 12 m opening 110 m up sits at 76.5° / 74.5° of
// elevation, outside any 40° frame aimed at 35–47°, yet §6.5 / case 8-hall require the pad "centred on the apex" and the
// shot "looking up into the converging apex". The positions and the desktop FOV are kept; the pitch is solved so the
// apex lands at one third of the height on desktop (pad 46vh fits between the top chrome and the datum at 62 %) and at
// 43 % on phone (FOV 60, pad 80vw between the datum at 120 px and the dial / sheet peek).
import { Vector3 } from 'three';
import { CAMERA } from '../../core/tokens.js';

const DEG = Math.PI / 180;
export const APEX_H = CAMERA.signal.apexH;          // 110 m: the ceiling of stratum S above the deck
export const OPEN_R = CAMERA.signal.apexR / 2;      // the 12 m opening (radius 6 m)
export const MAST_TOP = APEX_H + 32;                // the mast rises 32 m through the opening; the beacon at its tip
export const RAIL_Y = 12.5;                         // the listening gallery, 12.5 m above the deck
export const RAIL_D = 20.0;                         // inradius of the inner rail (seen below the pad on desktop)
export const RAIL_P = 29.7;                         // inradius of the outer rail (seen overhead on phone)

/** Per-layout camera + screen rules. */
const RULES = {
  desktop: { pos: CAMERA.signal.pos, fov: CAMERA.signal.fov, apexFrac: 1 / 3 },
  phone: { pos: CAMERA.signal.phonePos, fov: 60, apexFrac: 0.43 },
  'phone-land': { pos: CAMERA.signal.pos, fov: CAMERA.signal.fov, apexFrac: 0.40 },
};
export function rules(kind) { return RULES[kind] || RULES.desktop; }

/** Pitch (deg) that puts the apex at apexFrac of the viewport height. */
function pitchFor(r) {
  const alpha = Math.atan2(APEX_H - r.pos[1], r.pos[2]);
  const off = Math.atan((0.5 - r.apexFrac) * 2 * Math.tan((r.fov * DEG) / 2));
  return alpha - off;
}

/** Writes the hall-local rest pose for a layout kind into out ({pos, target, fov, offsetY, roll}). PURE. */
export function restPose(kind, out) {
  const r = rules(kind);
  const th = pitchFor(r);
  out.pos.set(r.pos[0], r.pos[1], r.pos[2]);
  out.target.set(0, r.pos[1] + r.pos[2] * Math.tan(th), 0);
  out.fov = r.fov; out.offsetY = 0; out.roll = 0;
  return out;
}

/** Camera basis of a pose: f (forward), r (right), u (up). */
export function basis(pose, o = { f: new Vector3(), r: new Vector3(), u: new Vector3() }) {
  o.f.copy(pose.target).sub(pose.pos).normalize();
  o.r.set(0, 1, 0).cross(o.f).multiplyScalar(-1).normalize();      // f × up
  o.u.copy(o.r).cross(o.f);
  return o;
}

/** Projects a hall-local point through a pose onto a w×h viewport → {x, y, depth, ndcX, ndcY}. */
export function project(pose, w, h, p, out = {}) {
  const b = basis(pose, project._b || (project._b = { f: new Vector3(), r: new Vector3(), u: new Vector3() }));
  const d = project._d || (project._d = new Vector3());
  d.copy(p).sub(pose.pos);
  const z = d.dot(b.f), t = Math.tan((pose.fov * DEG) / 2), a = w / h;
  out.depth = z;
  out.ndcX = d.dot(b.r) / z / (t * a);
  out.ndcY = d.dot(b.u) / z / t;
  out.x = (0.5 + 0.5 * out.ndcX) * w;
  out.y = (0.5 - 0.5 * out.ndcY) * h;
  return out;
}

/** Screen geometry of the hall's DOM layer for the current layout. */
export function screen(kind, w, h) {
  const r = rules(kind);
  const phone = kind === 'phone';
  const cx = w / 2, cy = h * r.apexFrac;
  const padR = phone ? 0.40 * w : 0.23 * h;                          // 80vw / 46vh across
  let dial;
  if (phone) {
    // A half-ring under the pad, concentric with it; values grow left → right along the bottom (a0 180° → a1 0°).
    dial = { cx, cy, r: padR + 20, a0: 180, a1: 0, kind: 'half' };
  } else {
    // Desktop: a 140° hairline arc, r 160, on the right side; the hub sits right of the arc, values grow upward
    // (a0 110° at the bottom-left of the hub → a1 250° at the top-left), level with the pad centre.
    const hubX = Math.min(w - 150, Math.max(cx + padR + 330, w * 0.86));
    dial = { cx: hubX, cy, r: 160, a0: 110, a1: 250, kind: 'arc' };
  }
  return { cx, cy, padR, dial, traceY: cy + padR };
}

/** Normal (hall-local, unit) of the plane through the eye whose every ray projects onto the screen row y = yPx. */
export function traceNormal(pose, h, yPx, out) {
  const b = basis(pose, traceNormal._b || (traceNormal._b = { f: new Vector3(), r: new Vector3(), u: new Vector3() }));
  const k = (1 - 2 * yPx / h) * Math.tan((pose.fov * DEG) / 2);   // ndcY · tan(fov/2)
  return out.copy(b.u).addScaledVector(b.f, -k).normalize();
}

/** The 6 ПОТЕРЯШКА spots (X§2.4.5): on the gallery rail the rest camera sees inside the central 60 % of its view,
 *  9–14 m away, clear of the pad, the inbox, the dial and the phone sheet peek. PURE. */
export function lostSpots(kind) {
  const out = [];
  if (kind === 'phone') {
    // The outer rail runs overhead between the datum and the pad (≈ y 200 of 844), ≈ 10.5 m from the eye.
    for (const x of [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5]) out.push(new Vector3(x, RAIL_Y, RAIL_P));
  } else {
    // The inner rail crosses below the pad (≈ y 650 of 900), ≈ 12 m from the eye; right of centre, clear of the inbox.
    for (const x of [0.2, 1.0, 1.8, 2.6, 3.4, 4.1]) out.push(new Vector3(x, RAIL_Y, RAIL_D));
  }
  return out;
}

/** Point on a triangle (ngon convention of world/vin.js: face 0 faces +z) of circumradius R at perimeter param s. */
export function triPoint(R, s, out) {
  const t = ((s % 1) + 1) % 1 * 3, k = Math.floor(t), f = t - k;
  const a0 = -Math.PI / 3 + (2 * Math.PI * k) / 3, a1 = a0 + (2 * Math.PI) / 3;
  out[0] = R * (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * f);
  out[1] = R * (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * f);
  return out;
}
