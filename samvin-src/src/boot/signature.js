// boot/signature.js — WP2 internal: the boot's sound beats on the cue clock (SPEC §9.3; SPEC-ADDENDUM A6.5.3, A2.1.1,
// A2.1.2, A2.8). Every beat is planned on the boot timeline (`tl.cue`), so it is audible on its visual frame (A6.3);
// every picture twin runs whether audio plays or not (muted parity, A6.5.9).
//   latch gen 1 × 7 on the lock frames (pans 0 · 0 · 0 · −0.3 · +0.3 · −0.5 · +0.5; N 12 ms early)
//   the signature at the hit (`found` = his growth), −3 dB when it plays late (unlocked after the ignition, or a jump)
//   sub-drop 120 → 30 Hz from 5,600 over 1,300 ms; latch gen 2 on the three ASSEMBLY commits; the ambient bed held
//   under the boot and faded in over 2,000 ms from the ASSEMBLY
//   УШИ: unlocked before 2,600 → the chain starts blocked (muffle 260 Hz); pop(800) audible exactly at 2,600 (THE LINE)
//   detection ticks ≤ 30/s (strutTick, 1 ms)
import { audio } from '../audio/engine.js';
import { loop } from '../core/loop.js';

export const LATCH_PANS = [0, 0, 0, -0.3, 0.3, -0.5, 0.5];
export const ASSEMBLY_PANS = [0.6, -0.6, 0];

const fxa = () => audio.fx;
const ready = () => { try { return !!(audio.fx && audio.fx.ready()); } catch (e) { return false; } };

/** A planned latch on the timeline. gen 1: n = stratum order 0…6; gen 2: n = 0…2. */
export function cueLatch(tl, v, gen, n, pan, visual) {
  tl.cue(v, 'latch', (T) => audio.play('latch', { gen, pan, n, when: T }), visual);
}

/** Holds the boot's sound state: blocked ears, the bed, the signature once. */
export function createBootSound(ctx, opts = {}) {
  const s = {
    signed: false,          // the signature has been planned or played
    ignited: false,
    blocked: false,
    bedHeld: false,
    lastTick: -1e9,
    offs: [],
  };
  // The bed (WP3) starts at unlock; under the boot it is held down (layers 1–4; the dust stays) until the ASSEMBLY.
  function holdBed() {
    if (s.bedHeld || !audio.bed || opts.bed === false) return;
    s.bedHeld = true;
    try { audio.bed.duck(-80, 0); } catch (e) { /* bed */ }
  }
  s.onUnlock = (vNow, ignitedAlready) => {
    holdBed();
    if (opts.ears && vNow < 2600 && !s.blocked) {
      s.blocked = true;
      try { fxa().muffle(260, 0, { shelfDb: 7 }); } catch (e) { /* chain */ }
    }
    if (ignitedAlready && !s.signed) s.playSignatureNow(-3);
  };
  if (audio.unlocked) holdBed();

  /** УШИ pop: audible exactly at v (2,600) — only if the chain was blocked. */
  s.cuePop = (tl, v, ms = 800) => {
    tl.cue(v, 'pop', (T) => { if (s.blocked) { try { fxa().pop(ms, { at: T }); } catch (e) { /* chain */ } s.blocked = false; } }, null);
  };
  s.playSignatureNow = (gainDb = -3) => {
    if (s.signed || !ready()) return;
    s.signed = true;
    audio.play('signature', { gainDb, found: ctx.secrets ? ctx.secrets.found() : [] });
  };
  /** the signature audible at perf time V (the hit) */
  s.cueSignatureAt = (V, gainDb = 0) => {
    if (s.signed) return null;
    const fx = ctx.fx;
    // `signed` is set when the audio really goes out (locked at the hit → the unlock plays it at −3 dB, SPEC §4.1)
    const spec = { id: 'signature', audio: (T) => { if (s.signed) return; s.signed = true; audio.play('signature', { when: T, gainDb, found: ctx.secrets ? ctx.secrets.found() : [] }); } };
    if (fx && fx.cue) return fx.cue.at(V, spec);
    if (ready()) spec.audio(audio.now());
    return null;
  };
  s.cueSubDrop = (tl, v) => tl.cue(v, 'subDrop', (T) => audio.play('subDrop', { ms: 1300, from: 120, to: 30, when: T }), null);
  s.cueBed = (tl, v, ms = 2000) => tl.cue(v, 'bed', null, () => s.releaseBed(ms));
  s.releaseBed = (ms = 2000) => {
    s.bedHeld = false;
    if (audio.bed) { try { audio.bed.duck(0, ms); } catch (e) { /* bed */ } }
  };
  /** a detection tick, reactive, ≤ 30/s */
  s.tick = () => {
    if (loop.now - s.lastTick < 34) return;
    s.lastTick = loop.now;
    if (ready()) audio.play('strutTick', {});
  };
  s.dispose = () => { for (const o of s.offs) { try { o(); } catch (e) { /* gone */ } } s.offs.length = 0; };
  return s;
}
