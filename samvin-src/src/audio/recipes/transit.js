// audio/recipes/transit.js — WP3 SEED (ARCH §3.10.2–§3.10.3, §6.1.5): SPEC §9.5 transitions.
// Every recipe is (E, params) => Voice with its exact registry name. Seed body: a −30 dB 40 ms sine blip on E.bus.ui
// (hashStr(name) % 600 + 300 Hz); LIVE recipes return a −40 dB sine that follows set(). WP3 replaces the bodies.
import { seedBlip, seedLive } from '../synth.js';

export const whoosh = (E, p) => seedLive(E, 'whoosh', p);
export const subDrop = (E) => seedBlip(E, 'subDrop');
export const strutTick = (E) => seedBlip(E, 'strutTick');
export const recallThud = (E) => seedBlip(E, 'recallThud');
export const liftRumble = (E, p) => seedLive(E, 'liftRumble', p);
export const irisWhoosh = (E) => seedBlip(E, 'irisWhoosh');
export const bootSwell = (E) => seedBlip(E, 'bootSwell');
export const snapAir = (E) => seedBlip(E, 'snapAir');
