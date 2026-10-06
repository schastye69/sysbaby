// audio/notes.js — tuning (ARCH §3.10.3; SPEC §9.1): G major pentatonic, pitch rises with altitude.
import { ROOMS } from '../world/rooms.js';

export const NOTE = Object.freeze({ G2: 98.00, A2: 110.00, B2: 123.47, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00, B3: 246.94,
  D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00, B4: 493.88, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00, B5: 987.77,
  D6: 1174.66, E6: 1318.51, G6: 1567.98, A6: 1760.00, B6: 1975.53, D7: 2349.32 });

/** S A M • V I N */
export const STRATUM_NOTE = Object.freeze([392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00]);

/** RoomId → ROOMS[id].root (Hz) */
export const ROOM_ROOT = Object.freeze(Object.fromEntries(Object.keys(ROOMS).map((id) => [id, ROOMS[id].root])));

export const SECRET_NOTE = Object.freeze({ S01: 'G4', S02: 'A4', S03: 'B4', S04: 'D5', S05: 'E5', S06: 'G5', S07: 'A5', S08: 'B5',
  S09: 'D6', S10: 'E6', S11: 'G6', S12: 'A6', S13: 'B6', S14: 'D7' });

/** 'D4' → 293.66; unknown → 440 */
export function hz(name) { const v = NOTE[name]; return v == null ? 440 : v; }
