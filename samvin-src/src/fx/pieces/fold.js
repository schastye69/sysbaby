// fx/pieces/fold.js — «СВЁРТКА», the one shared finale (SPEC-ADDENDUM A2.9; ARCH-ADDENDUM X§2.5.9). OWNER: WP12.
//      0–400  NOISE    foldNoise; a dust layer −56 → −40 dB; fog ×1 → ×1.4; screen grain 2 → 2.5 % (until the ZERO); dust churns (curl ×4)
//   400–1300  COLLAPSE audio.fx.tape(900) + width 1 → 0.6; loop.timeScale = 1 − (t − 400)/900 (motion and pitch die together);
//                       strata scramble toward the golden angles while their gaps close; grain rings spiral in flat;
//                       line alpha ×1 → ×0.4; fog ×1.4 → ×1.6; dust spirals flat onto the gap planes
//  1300–1310  gate closed; tapeReset, bed duck −80 dB, A/B swap under it
//  1310–1550  DIGITAL TAIL digiTail; per 40 ms slice the scramble quantises 1/32 … 1 face angle, slices 2 and 4 step back
//                       66 ms; nucleus 100 % / 40 %; dust sample-and-hold; slice 5 width → 0
//  1550–1850  reverseTail('sam') ending at 1,850; the nucleus dot brightens along x² and goes dark at 1,850
//  1850–2450  ZERO     gate 600 ms; width back to 1 under it; dark scrambled Key at 40 % silver, fog ×1.6, grain 2 %, chrome
//       2450  the gate reopens on the dust layer only (−58 dB): the air came back, the bed did not; resolves («сплю. разбуди
//             меня.» is the caller's). Any input before → that state at once (the zero skipped). wakeReset() ends it.
// Reduced motion: no timeScale ramp / spiral — a 400 ms crossfade to the dark Key at 400–800; tail steps, blinks and
// every sound kept. T0: ctx.t0.twin('close', { phase, t01 }).
import { loop } from '../../core/loop.js';
import { ENV } from '../../core/env.js';
import { audio } from '../../audio/engine.js';
import { input } from '../../core/input.js';
import { clk, perf } from '../cue.js';

const GOLD = 137.508 * Math.PI / 180;
const Q = [1 / 32, 1 / 16, 1 / 8, 1 / 4, 1 / 2, 1];
const DV = { level01: 0.11, drift: 0.12 };          // reused by the per-frame dust-layer ramp (no allocation)

export function createFold(F) {
  const { ctx } = F;
  let dv = null, over = false;
  const OV = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ yaw: Math.atan2(Math.sin(i * GOLD), Math.cos(i * GOLD)) })), OG = { gap: 0 };
  const keyOver = (w) => {
    const k = ctx.key;
    if (!k || !k.override) return;
    if ((w != null) !== over) {
      over = w != null;
      for (let i = 0; i < 7; i++) k.override(i, over ? OV[i] : null);
      k.overrideGroup(over ? OG : null);
    }
    k.setOverrideWeight(w == null ? 0 : w);
  };
  function asleep(k) {
    loop.timeScale = 0;
    F.setLineAlpha(0.4); F.fogFactor('close', 1.6);
    if (k) {
      keyOver(null); k.setScramble('golden');
      k.overrideGroup(OG); k.setOverrideWeight(1);
      if (k.grains && k.grains.spiral) k.grains.spiral(1);
      k.douse(); k.setNucleus(null);
    }
    if (ctx.composite) ctx.composite.setGrain(0.02);
    F.dust.collapse(3);
    if (dv && dv.set) dv.set({ level01: 0, drift: 0.03 });   // the air came back (−58 dB), the bed did not
  }

  function fold(opts) {
    const context = (opts && opts.context) || 'relaunch';
    return F.stage.run('close', () => new Promise((resolve) => {
      const t0 = perf(), rm = ENV.reducedMotion, k = F.t0 ? null : ctx.key;
      const hs = [];
      const at = (ms, id, a, v) => hs.push(F.cue.at(t0 + ms, { id, audio: a, visual: v }));
      F.folded = true;
      F.pulse.stopAll(t0 + 50);
      at(0, 'foldNoise', (Tc) => audio.play('foldNoise', { when: Tc }));
      if (dv) { try { dv.stop(20); } catch (e) { /* gone */ } }
      dv = audio.start('dust', { level01: 0.11, drift: 0.12 });
      at(400, 'tape', (Tc) => { audio.fx.tape(900, { at: Tc }); audio.fx.width(0.6, 900, { at: Tc }); });
      at(1300, 'gate', (Tc) => { audio.fx.gate(10, { at: Tc }); audio.fx.tapeReset({ at: Tc + 0.005 }); },
        () => { if (audio.bed) audio.bed.duck(-80, 0); if (dv && dv.set) dv.set({ level01: 0, drift: 0.03 }); });   // under the closed gate: the churned air (−40 dB) does not come back after tapeReset
      at(1310, 'digiTail', (Tc) => audio.play('digiTail', { when: Tc }));
      at(1510, 'width0', (Tc) => audio.fx.width(0, 0, { at: Tc }));
      at(1550, 'reverseTail:sam', (Tc) => audio.play('reverseTail', { src: 'sam', endAt: Tc + 0.3, ms: 300, gainDb: -24, when: Tc }));
      at(1850, 'zero', (Tc) => { audio.fx.gate(600, { at: Tc }); audio.fx.width(1, 0, { at: Tc + 0.01 }); });
      if (ctx.composite) ctx.composite.setGrain(0.025);
      let done = false, slice = -1, rim = false, shut = false;
      // The end of the COLLAPSE (t ≥ 1,300): motion and pitch are dead, the Key holds its scrambled golden pose, lines at
      // 40 %, fog ×1.6. Applied once, by whichever later frame comes first (a slow frame may jump past the tail).
      const shutDown = () => {
        if (shut) return;
        shut = true;
        loop.timeScale = 0; F.setLineAlpha(0.4); F.fogFactor('close', 1.6);
        if (k) { keyOver(null); k.setScramble('golden'); k.overrideGroup(OG); k.setOverrideWeight(1); }
        F.dust.collapse(3);
      };
      const finish = (skip) => {
        if (done) return;
        done = true; offTick(); offIn(); clearTimeout(endT);
        if (skip) {
          for (const h of hs) h.cancel();
          if (audio.fx.ready()) {
            audio.fx.tapeReset(); audio.fx.width(1, 0); if (audio.bed) audio.bed.duck(-80, 0);
            audio.fx.advanceHit(audio.now() + 0.03);                 // a gate already scheduled (1,300 / the zero) reopens now: the zero is skipped
          }
        }
        asleep(k);
        if (context === 'relaunch' && ctx.rim && ctx.rim.clearGuests) ctx.rim.clearGuests();
        F.twin('close', { phase: 'asleep', t01: 1 });
        resolve();
      };
      const offIn = input.observeDown(() => { if (perf() - t0 > 30) finish(true); });
      const endT = setTimeout(() => finish(false), 2450);            // wall-clock end (a late frame never delays the state)
      const offTick = F.addTick(() => {
        const t = clk.raf + clk.med / 2 - t0;                 // the frame nearest each beat (presented-time grammar)
        if (t < 400) {
          F.fogFactor('close', 1 + 0.4 * (t / 400));
          F.dust.collapse(1);
          if (k && !rm && k.grains && k.grains.spiral) k.grains.spiral(0, 1 + 2 * (t / 400));   // A2.9 NOISE: Kepler ω ×1 → ×3
          if (dv && dv.set) { DV.level01 = 0.11 + 0.89 * (t / 400); dv.set(DV); }
          if (F.t0) F.twin('close', { phase: 'noise', t01: t / 400 });
        } else if (t < 1300) {
          const x = (t - 400) / 900;
          if (!rim && context === 'relaunch' && ctx.rim && ctx.rim.clearGuests) { rim = true; ctx.rim.clearGuests(); }
          F.fogFactor('close', 1.4 + 0.2 * x);
          if (rm) {
            const y = Math.min(1, x * 900 / 400);
            F.setLineAlpha(1 - 0.6 * y);
            if (k) keyOver(1);
          } else {
            loop.timeScale = 1 - x;
            F.setLineAlpha(1 - 0.6 * x);
            if (k) { keyOver(x); if (k.grains && k.grains.spiral) k.grains.spiral(x, 3); }
            F.dust.collapse(2);
          }
          if (F.t0) F.twin('close', { phase: 'collapse', t01: x });
        } else if (t < 1550) {
          shutDown();
          const s = Math.max(0, Math.min(5, Math.floor((t - 1310) / 40)));
          if (t >= 1310 && s !== slice) {
            slice = s;
            if (k) { k.setScrambleQuant(Q[s], s === 2 || s === 4 ? 66 : 0); k.setNucleus(s % 2 ? 0.4 : 1); }
            F.dust.collapse(3);
            F.twin('close', { phase: 'tail', t01: s / 5 });
          }
        } else if (t < 1850) {
          shutDown();
          const x = (t - 1550) / 300;
          if (k) k.setNucleus(x * x);
          if (F.t0) F.twin('nucleus', { level: x * x });
        } else {
          shutDown();
          if (slice !== 9) { slice = 9; if (ctx.composite) ctx.composite.setGrain(0.02); if (k) { k.douse(); k.setNucleus(null); } if (dv && dv.set) dv.set({ level01: 0, drift: 0.03 }); F.twin('close', { phase: 'zero', t01: 1 }); }
          if (t >= 2450) { finish(false); return false; }
        }
        return true;
      });
    }));
  }

  function wakeReset() {
    F.folded = false;
    loop.timeScale = 1;
    F.fogFactor('close', 1);
    F.setLineAlpha(1);
    F.dust.collapse(0);
    const k = ctx.key;
    if (k && !F.t0) {
      keyOver(null);
      if (k.overrideGroup) { k.overrideGroup(null); k.setOverrideWeight(0); }
      if (k.setScrambleQuant) k.setScrambleQuant(0, 0);
      if (k.setNucleus) k.setNucleus(null);
      if (k.grains && k.grains.spiral) k.grains.spiral(0);
    }
    if (dv) { try { dv.stop(60); } catch (e) { /* gone */ } dv = null; }
    if (audio.fx.ready()) audio.fx.width(1, 0);
  }
  return { fold, wakeReset };
}
