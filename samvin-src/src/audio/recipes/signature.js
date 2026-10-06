// audio/recipes/signature.js — WP3 SEED (ARCH §3.10.2–§3.10.3, §6.1.5): SPEC §9.3 startup signature, ratchets, owner bell.
// Every recipe is (E, params) => Voice with its exact registry name. Seed body: a −30 dB 40 ms sine blip on E.bus.ui
// (hashStr(name) % 600 + 300 Hz). WP3 replaces the bodies.
import { seedBlip } from '../synth.js';

export const signature = (E) => seedBlip(E, 'signature');
export const ratchet = (E) => seedBlip(E, 'ratchet');
export const owner = (E) => seedBlip(E, 'owner');
