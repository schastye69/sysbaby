// halls/members/arc.js — the arc and the cameras of MEMBERS (SPEC §6.2 «Layout», «Phone», «Click or Enter»). Pure.
//
// Columns stand on an arc of radius 48 m centred on the camera's ground point (0, 0, 48), spanning ±25°, evenly
// spaced, in roster order with the operator in the middle. Hover/focus re-solves the angles so the focused column gets
// 2.2× spacing (desktop). Phone: the arc rotates by one column per swipe; the centred column is auto-focused.
import { CAMERA } from '../../core/tokens.js';
import { arcX, arcZ } from './columns.js';
import { COL } from './shape.js';

const DEG = Math.PI / 180;
/** desktop focus: the aim point sits 1.4 m right of the capital so its 120 px leader and readout fit beside it */
export const FOCUS_AIM = 1.4;
/** Phone (SPEC §6.2 «Phone»: (0, 11, 40) → (0, 12.5, 0), 2–3 columns visible): on a 390 × 844 portrait screen a 35°
 *  vertical FOV is only 16° across (one column, its capital cut by the title); 64° vertical (32° across) shows 3 columns
 *  whole, capitals under the datum and bases above the sheet. Focus: 40°, the capital in the top third above the sheet. */
export const PHONE = Object.freeze({ fov: 64, focusFov: 40, focusOffsetY: -0.265 });
export const ARC = Object.freeze({ spanDeg: 25, spread: 2.2, focusMs: 900, backMs: 600, reducedMs: 160 });

/** Roster order with the operator in the middle (SPEC §6.2; the WP0 placeholder used the same rule). */
export function arcOrder(members, operatorId) {
  const others = members.filter((m) => m.id !== operatorId);
  const op = members.find((m) => m.id === operatorId);
  if (op) others.splice(Math.floor(others.length / 2), 0, op);
  return others;
}

/** Angular step between neighbours (rad). */
export function stepOf(n) { return n > 1 ? ((2 * ARC.spanDeg) / (n - 1)) * DEG : 0; }

/** Rest angles (rad), −25° … +25°. */
export function restAngles(n, out) {
  const d = stepOf(n);
  for (let k = 0; k < n; k++) out[k] = n > 1 ? -ARC.spanDeg * DEG + d * k : 0;
  return out;
}

/** Desktop hover/focus: the focused column keeps its angle; its neighbours step out so it gets 2.2× spacing. */
export function spreadAngles(n, f, out) {
  restAngles(n, out);
  if (f < 0 || n < 2) return out;
  const d = stepOf(n), extra = (ARC.spread - 1) * d;
  for (let k = 0; k < n; k++) if (k !== f) out[k] += k < f ? -extra : extra;
  return out;
}

/** Phone: the arc rotated so column `c` stands at 0 (evenly spaced, no spread). */
export function phoneAngles(n, c, out) {
  const d = stepOf(n);
  for (let k = 0; k < n; k++) out[k] = (k - c) * d;
  return out;
}

function P(out, px, py, pz, tx, ty, tz, fov) {
  out.pos.set(px, py, pz); out.target.set(tx, ty, tz); out.fov = fov; out.offsetY = 0; out.roll = 0;
  return out;
}

/** The arc rest pose (hall-local). */
export function restPose(kind, out) {
  const m = CAMERA.members, t = m.target;
  if (kind === 'phone') return P(out, m.phonePos[0], m.phonePos[1], m.phonePos[2], t[0], t[1], t[2], PHONE.fov);
  return P(out, m.pos[0], m.pos[1], m.pos[2], t[0], t[1], t[2], m.fov);
}

/** Member focus (SPEC §6.2): dolly to (col.x·0.9, 22, col.z + 14) looking at the capital. Phone: the same line of
 *  sight from 24 m, so the 4.4 m plate and its readout fit a 390 px screen. th = the column's rest angle. */
export function focusPose(th, kind, out) {
  const x = arcX(th), z = arcZ(th);
  const cy = COL.capY + COL.H * (COL.teleMax - 1);   // the focused column stands telescoped (27.6 m): look at that capital
  if (kind === 'phone') { P(out, x * 0.9, 20.5, z + 24, x, cy, z, PHONE.focusFov); out.offsetY = PHONE.focusOffsetY; return out; }
  // looking at the capital, framed a third from the left (aim 1.4 m to its right): the readout takes the right
  return P(out, x * 0.9, 22, z + 14, x + FOCUS_AIM, cy, z, CAMERA.members.fov);
}
