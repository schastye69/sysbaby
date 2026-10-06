// audio/recipes/grammar.js — WP3 SEED (ARCH-ADDENDUM X§2.3.5, hook H9; SPEC-ADDENDUM A6.5.5, A6.6).
// The 18 time-grammar / founder recipes with their exact registry names and params. Seed bodies follow §6.1.5: a −30 dB
// 40 ms sine blip on E.bus.ui; the two LIVE ones (dust, subPulse) return a silent live voice. WP3 replaces the bodies.
import { seedBlip } from '../synth.js';

const silentLive = () => ({ set() {}, stop() {}, alive: true });

export const latch = (E) => seedBlip(E, 'latch');                 // { gen: 1|2, pan = 0, n = 0, when? }
export const reverseTail = (E) => seedBlip(E, 'reverseTail');     // { src, endAt, ms = 300, gainDb = -22, pan = 0, rate = 1 }
export const popClick = (E) => seedBlip(E, 'popClick');           // { when? }
export const foldNoise = (E) => seedBlip(E, 'foldNoise');         // { when }
export const digiTail = (E) => seedBlip(E, 'digiTail');           // { when, pans }
export const subRise = (E) => seedBlip(E, 'subRise');             // { when }
export const farEcho = (E) => seedBlip(E, 'farEcho');             // { dist = 300, gainDb = -22, when }
export const farBoom = (E) => seedBlip(E, 'farBoom');             // { dist, lpHz = 180, when }
export const debrisKnock = (E) => seedBlip(E, 'debrisKnock');     // { n = 5, when }
export const bondThread = (E) => seedBlip(E, 'bondThread');       // { panFrom, panTo, ms = 480, when? }
export const sborCall = (E) => seedBlip(E, 'sborCall');           // { hz, pan, when? }
export const sborAnswer = (E) => seedBlip(E, 'sborAnswer');       // { hz, pan, kind: 'on'|'way'|'rest', when? }
export const guestBurn = (E) => seedBlip(E, 'guestBurn');         // { hz, pan, when? }
export const lostChirp = (E) => seedBlip(E, 'lostChirp');         // { pan, night = false }
export const lostHide = (E) => seedBlip(E, 'lostHide');           // { pan }
export const rescue = (E) => seedBlip(E, 'rescue');               // { when?, pair = false }
export const dust = () => silentLive();                            // LIVE { level01, pan = 0, drift = 0.03 } → set({level01, drift})
export const subPulse = () => silentLive();                        // LIVE { periodMs = 900, level01, steps?, t0Perf } → set, stop(ms)
