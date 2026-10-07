// audio/recipes/secrets.js — WP3 SEED (ARCH §3.10.2–§3.10.3, §6.1.5): SPEC §9.6 secret and special sounds.
// Every recipe is (E, params) => Voice with its exact registry name. Seed body: a −30 dB 40 ms sine blip on E.bus.ui
// (hashStr(name) % 600 + 300 Hz); LIVE recipes return a −40 dB sine that follows set(). WP3 replaces the bodies.
import { seedBlip, seedLive } from '../synth.js';

export const shard = (E) => seedBlip(E, 'shard');
export const resRise = (E, p) => seedLive(E, 'resRise', p);
export const resSub = (E, p) => seedLive(E, 'resSub', p);
export const chunk = (E) => seedBlip(E, 'chunk');
export const resChord = (E) => seedBlip(E, 'resChord');
export const hiss = (E) => seedBlip(E, 'hiss');
export const shepard = (E, p) => seedLive(E, 'shepard', p);
export const whale = (E) => seedBlip(E, 'whale');
export const dizzy = (E) => seedBlip(E, 'dizzy');
export const chord = (E) => seedBlip(E, 'chord');
export const capsule = (E) => seedBlip(E, 'capsule');
export const companion = (E) => seedBlip(E, 'companion');
export const zenithPad = (E, p) => seedLive(E, 'zenithPad', p);
export const invertRoll = (E) => seedBlip(E, 'invertRoll');
export const droneDodge = (E) => seedBlip(E, 'droneDodge');
