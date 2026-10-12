// fx/dust/emitters.js — emitter types and the per-hall ambient volumes (SPEC-ADDENDUM A2.7.1, A2.7.3). OWNER: WP12.
// Slot layout (vec4 ×4, read by dust.glsl.js): E0 (type, birth t, start, count) · E1 (centre / origin xyz, unit scale) ·
// E2 (per type) · E3 (fade s, respawn t, lamp reach r0, —). Types: 1 ambient · 2 swarf · 3 threads · 4 shed · 5 puff.
// Volumes, canonical metres around the hall anchor: CORE a 14 m sphere round the Key (unit 1: drift ≤ 0.04 m, lamp reach
// 0.6 m; 70 % of the motes in the 1.2–4.2 m shell where the lamp, 2.2 Key radii out, actually lights them, 30 % fill
// 0.3–7 m); MEMBERS / VOYAGES a 90 m disc 0–30 m above the deck; ARCHIVE the 9 m tube; INSIGNIA the 30 m dome; SIGNAL a 40 m
// cylinder 0–80 m round the mast; NADIR the chamber; ZENITH and WORKSHOP none. Hall lamp reach = ¼ of the volume radius.
import { ROOMS } from '../../world/rooms.js';

export const TYPE = { ambient: 1, swarf: 2, threads: 3, shed: 4, puff: 5 };

/** room → { shape 0 sphere | 1 cylinder, r, y0, y1 (or dome flag for spheres), unit, drift, r0 } | null */
export const VOLUME = {
  CORE: { shape: 0, r: 7, y0: 0, y1: 0, unit: 1, drift: 0.04, r0: 0.6, rin: 0.3 },
  MEMBERS: { shape: 1, r: 45, y0: 0, y1: 30, unit: 25, drift: 0.6, r0: 11.25 },
  VOYAGES: { shape: 1, r: 45, y0: 0, y1: 30, unit: 25, drift: 0.6, r0: 11.25 },
  ARCHIVE: { shape: 1, r: 9, y0: -45, y1: 45, unit: 6, drift: 0.3, r0: 2.25 },
  INSIGNIA: { shape: 0, r: 30, y0: 1, y1: 0, unit: 15, drift: 0.5, r0: 7.5 },
  SIGNAL: { shape: 1, r: 40, y0: 0, y1: 80, unit: 20, drift: 0.6, r0: 10 },
  NADIR: { shape: 1, r: 20, y0: -110, y1: 0, unit: 12, drift: 0.4, r0: 5 },
  ZENITH: null,
  WORKSHOP: null,
};

/** Writes an ambient slot for a room into the four vec4s. → false when the room has no dust. */
export function ambientSlot(room, e1, e2, e3, t) {
  const v = VOLUME[room];
  if (!v) return false;
  const a = (ROOMS[room] || ROOMS.CORE).anchor;
  e1.set(a.x, a.y, a.z, v.unit);
  e2.set(v.shape, v.r, v.y0, v.y1);
  e3.set(v.drift, t, v.r0, v.rin || 0);
  return true;
}
