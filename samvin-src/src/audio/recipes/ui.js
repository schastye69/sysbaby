// audio/recipes/ui.js — WP3 SEED (ARCH §3.10.2–§3.10.3, §6.1.5): SPEC §9.4 locks, notes, UI.
// Every recipe is (E, params) => Voice with its exact registry name. Seed body: a −30 dB 40 ms sine blip on E.bus.ui
// (hashStr(name) % 600 + 300 Hz). WP3 replaces the bodies.
import { seedBlip } from '../synth.js';

export const hoverTick = (E) => seedBlip(E, 'hoverTick');
export const select = (E) => seedBlip(E, 'select');
export const tick = (E) => seedBlip(E, 'tick');
export const stringPluck = (E) => seedBlip(E, 'stringPluck');
export const lockedThud = (E) => seedBlip(E, 'lockedThud');
export const chisel = (E) => seedBlip(E, 'chisel');
export const stratumNote = (E) => seedBlip(E, 'stratumNote');
export const memberNote = (E) => seedBlip(E, 'memberNote');
export const workshopNode = (E) => seedBlip(E, 'workshopNode');
export const wordBell = (E) => seedBlip(E, 'wordBell');
export const arrivalLock = (E) => seedBlip(E, 'arrivalLock');
export const flinch = (E) => seedBlip(E, 'flinch');
