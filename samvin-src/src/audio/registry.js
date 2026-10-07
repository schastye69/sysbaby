// audio/registry.js — the recipe registry (ARCH §3.10.3, §6.1.6 A12). Complete; nobody else edits it.
// RECIPES = the 46 names of the §3.10.3 table + `wind` = 47, + the 18 names of ARCH-ADDENDUM X§2.3.5 (H9) = 65.
// LIVE = the 13 continuous recipes (started with audio.start; everything else with audio.play).
import * as signature from './recipes/signature.js';
import * as ui from './recipes/ui.js';
import * as transit from './recipes/transit.js';
import * as secrets from './recipes/secrets.js';
import * as rooms from './recipes/rooms.js';
import * as grammar from './recipes/grammar.js';

export const RECIPES = Object.freeze({
  signature: signature.signature, ratchet: signature.ratchet, owner: signature.owner,
  hoverTick: ui.hoverTick, select: ui.select, tick: ui.tick, stringPluck: ui.stringPluck, lockedThud: ui.lockedThud,
  chisel: ui.chisel, stratumNote: ui.stratumNote, memberNote: ui.memberNote, workshopNode: ui.workshopNode,
  wordBell: ui.wordBell, arrivalLock: ui.arrivalLock, flinch: ui.flinch,
  whoosh: transit.whoosh, subDrop: transit.subDrop, strutTick: transit.strutTick, recallThud: transit.recallThud,
  liftRumble: transit.liftRumble, irisWhoosh: transit.irisWhoosh, bootSwell: transit.bootSwell, snapAir: transit.snapAir,
  shard: secrets.shard, resRise: secrets.resRise, resSub: secrets.resSub, chunk: secrets.chunk, resChord: secrets.resChord,
  hiss: secrets.hiss, shepard: secrets.shepard, whale: secrets.whale, dizzy: secrets.dizzy, chord: secrets.chord,
  capsule: secrets.capsule, companion: secrets.companion, zenithPad: secrets.zenithPad, invertRoll: secrets.invertRoll,
  droneDodge: secrets.droneDodge,
  probeHold: rooms.probeHold, probeFlight: rooms.probeFlight, probeReturn: rooms.probeReturn, skyVoice: rooms.skyVoice,
  dialStatic: rooms.dialStatic, dialCarrier: rooms.dialCarrier, beatLock: rooms.beatLock, vaultNote: rooms.vaultNote,
  wind: rooms.wind,
  // H9 (X§2.3.5)
  latch: grammar.latch, reverseTail: grammar.reverseTail, popClick: grammar.popClick, foldNoise: grammar.foldNoise,
  digiTail: grammar.digiTail, subRise: grammar.subRise, farEcho: grammar.farEcho, farBoom: grammar.farBoom,
  debrisKnock: grammar.debrisKnock, bondThread: grammar.bondThread, sborCall: grammar.sborCall, sborAnswer: grammar.sborAnswer,
  guestBurn: grammar.guestBurn, lostChirp: grammar.lostChirp, lostHide: grammar.lostHide, rescue: grammar.rescue,
  dust: grammar.dust, subPulse: grammar.subPulse,
});

export const LIVE = new Set(['whoosh', 'liftRumble', 'resRise', 'resSub', 'shepard', 'zenithPad', 'probeHold', 'skyVoice',
  'dialStatic', 'dialCarrier', 'wind', 'dust', 'subPulse']);
