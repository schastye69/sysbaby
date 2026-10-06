// audio/recipes/rooms.js — WP3 SEED (ARCH §3.10.2–§3.10.3, §6.1.5): SPEC §9.4 / §6.x room sounds.
// Every recipe is (E, params) => Voice with its exact registry name. Seed body: a −30 dB 40 ms sine blip on E.bus.ui
// (hashStr(name) % 600 + 300 Hz); LIVE recipes return a −40 dB sine that follows set(). WP3 replaces the bodies.
import { seedBlip, seedLive } from '../synth.js';

export const probeHold = (E, p) => seedLive(E, 'probeHold', p);
export const probeFlight = (E) => seedBlip(E, 'probeFlight');
export const probeReturn = (E) => seedBlip(E, 'probeReturn');
export const skyVoice = (E, p) => seedLive(E, 'skyVoice', p);
export const dialStatic = (E, p) => seedLive(E, 'dialStatic', p);
export const dialCarrier = (E, p) => seedLive(E, 'dialCarrier', p);
export const beatLock = (E) => seedBlip(E, 'beatLock');
export const vaultNote = (E) => seedBlip(E, 'vaultNote');
export const wind = (E, p) => seedLive(E, 'wind', p);
