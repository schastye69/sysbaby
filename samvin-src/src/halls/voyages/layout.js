// halls/voyages/layout.js — WP6: the pure geometry of VOYAGES (SPEC §6.3, §7.6). Hall-local metres, origin = the deck
// centre on the axis, +Y up. Everything here is allocation-free on the hot path (writes into caller-owned outputs).
//
// • The spiral: mission k (display order, k = 0 for 001) sits at r = 14·√k, θ = k·137.508°. SPEC fixes r and θ but not
//   the zero direction or the handedness; SPIRAL picks the pair that keeps the most hatches (and every hatch the
//   acceptance cases touch: 002, 006, 007) inside the SPEC desktop frame, with the outer hatches leaving the frame at
//   its sides and bottom (where their tags pin to the sheet border, hatches.js).
// • The chamber of hatch k floats under the floor at the foot of its shaft, set CHAMBER_OFF m further out from the axis
//   (u = the unit vector axis → hatch; 001 sits on the axis and uses −Z). The orbit camera sits on the axis side looking
//   outward, so the axis pillar always stays behind it and the terrain fills the view.
// • Cameras: the SPEC field pose (desktop (0, 70, 44) → (0, 0, −6), FOV 35, wheel altitude 60–140 m keeping that pitch;
//   phone (0, 96, 30) pitched −70°, following the selected hatch along the spiral), the chamber orbit (45 m from the
//   terrain centre, yaw ±40°, pitch −35…−70°, rest −50°).
import { CAMERA } from '../../core/tokens.js';

const DEG = Math.PI / 180;
export const HATCH_R = 4.5;                 // m — the hatch ring (and the ШЛЮЗ shaft rings, SPEC §7.6 «r 4.5 m»)
export const SPIRAL = Object.freeze({ step: 137.508 * DEG, phi: 212.5 * DEG, hand: -1 });
export const FLOOR_R = 90;                  // polar survey floor: rings every 10 m to r 90, 24 radials (SPEC §6.3)
export const CHAMBER_Y = -48;               // m below the deck: the terrain plane of every chamber
export const CHAMBER_OFF = 36;              // m outward from the hatch (away from the axis)
export const CHAMBER_AIM = -42;             // the orbit aims at mid-relief (the terrain plane + 6 m), so its summit sits mid-frame
export const TERRAIN_SIZE = 120;            // 120 × 120 m (SPEC §6.3)
export const ORBIT = Object.freeze({ dist: 45, pitch: -50, pitchMin: -70, pitchMax: -35, yawMax: 40 });
export const SHAFT = Object.freeze({ glideY: 12, step: 3, rings: 12 });   // ШЛЮЗ: 12 m above the hatch, rings every 3 m

/** Hall-local deck point of spiral slot k → out {x, z} (also used for proposal slots k = missions.length + i). */
export function slotPoint(k, out) {
  const r = 14 * Math.sqrt(Math.max(0, k));
  const a = SPIRAL.hand * k * SPIRAL.step + SPIRAL.phi;
  out.x = Math.sin(a) * r;
  out.z = Math.cos(a) * r;
  return out;
}

function look(out, px, py, pz, tx, ty, tz, fov) {
  out.pos.set(px, py, pz); out.target.set(tx, ty, tz);
  out.fov = fov; out.offsetY = 0; out.roll = 0;
  return out;
}

/** Desktop field pose at altitude alt (SPEC: (0, 70, 44) → (0, 0, −6) at alt 70; the wheel keeps the pitch). */
export function fieldPoseDesktop(alt, out) {
  const k = alt / CAMERA.voyages.pos[1];
  return look(out, 0, alt, CAMERA.voyages.pos[2] * k, 0, 0, CAMERA.voyages.target[2] * k, CAMERA.fov);
}

/** Phone field pose: SPEC (0, 96, 30) pitched −70°, carried over the selected hatch (sx, sz) (001 sits at the origin,
 *  so the first selection is the SPEC pose exactly). */
export function fieldPosePhone(sx, sz, out) {
  const p = CAMERA.voyages.phonePos;
  const pitch = CAMERA.voyages.phonePitchDeg * DEG;
  const run = p[1] / Math.tan(-pitch);
  return look(out, sx + p[0], p[1], sz + p[2], sx + p[0], 0, sz + p[2] - run, CAMERA.fov);
}

/** Chamber of spiral slot k → out {x, z, ux, uz}: terrain centre (deck plane coordinates) and the outward unit vector. */
export function chamberAt(k, out) {
  slotPoint(k, out);
  const r = Math.hypot(out.x, out.z);
  out.ux = r > 1e-6 ? out.x / r : 0; out.uz = r > 1e-6 ? out.z / r : -1;
  out.x += out.ux * CHAMBER_OFF; out.z += out.uz * CHAMBER_OFF;
  return out;
}

/** The chamber orbit pose around terrain centre c: 45 m away, yaw / pitch in degrees; yaw 0 = looking along u (outward). */
export function chamberPose(cx, cy, cz, yawDeg, pitchDeg, out, ux = 0, uz = -1) {
  const p = -pitchDeg * DEG, y = yawDeg * DEG, d = ORBIT.dist;
  const h = Math.cos(p) * d;
  const c = Math.cos(y), s = Math.sin(y);
  const bx = -(ux * c - uz * s), bz = -(ux * s + uz * c);          // from the centre back toward the camera
  return look(out, cx + bx * h, cy + Math.sin(p) * d, cz + bz * h, cx, cy, cz, CAMERA.fov);
}

/** Field rest pose for the layout kind (desktop / phone / phone-land). sel = {x, z} of the selected hatch (phone). */
export function fieldPose(kind, alt, sel, out) {
  if (kind === 'phone') return fieldPosePhone(sel ? sel.x : 0, sel ? sel.z : 0, out);
  return fieldPoseDesktop(alt, out);
}

/** Pure screen test (desktop field pose at altitude alt, viewport w × h): is deck point (x, z) inside the drawing's
 *  safe frame (the tag can sit at it, not pinned)? Used to lift the camera over a freshly proposed hatch. */
export function inFrame(x, z, alt, w, h) {
  const k = alt / CAMERA.voyages.pos[1];
  const cy = alt, cz = CAMERA.voyages.pos[2] * k, tz = CAMERA.voyages.target[2] * k;
  let fx = 0, fy = -cy, fz = tz - cz;
  const fl = Math.hypot(fy, fz); fy /= fl; fz /= fl;
  const ux = 0, uy = -fz, uz = fy;                                  // up = right × forward, right = +X
  const dx = x, dy = -cy, dz = z - cz;
  const depth = dx * fx + dy * fy + dz * fz;
  if (depth <= 0) return false;
  const t = Math.tan((CAMERA.fov * DEG) / 2);
  const sx = w / 2 + (dx / depth / t) * (h / 2), sy = h / 2 - ((dx * ux + dy * uy + dz * uz) / depth / t) * (h / 2);
  return sx > 40 && sx < w - 130 && sy > 70 && sy < h - 92;
}
