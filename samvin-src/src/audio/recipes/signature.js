// audio/recipes/signature.js — WP3. The startup signature «SAM — VIN» (SPEC §9.3; SPEC-ADDENDUM A6.5.3: t = 0 is the
// ignition hit, `when`), the ratchet clicks and the owner variant (SPEC §9.6 S05). All centred (A6.4).
//
//   0      THUMP     sine 96 → 48 Hz (exp, 120 ms), attack 4 ms, decay 900 ms, −6 dBFS + 3 ms click BP 3.2 kHz Q 1.2 −18 dB
//   60     "SAM"     FM bell G4 392.00 (ratio 1.4, index 3 → 0 over 1.2 s, attack 8 ms, decay 2.4 s) −10 dB + 1,176 Hz −24 dB
//   340    "VIN"     the same bell on D5 587.33 (the rising fifth), decay 2.8 s, 30 % reverb send
//   340    LOCK      196.00 Hz + (293.66 + 14) Hz gliding exponentially to 293.66 over 600 ms (beating 14 Hz → 0);
//                    hold 900 ms, release 800 ms, −16 dB
//   420    ANSWERS   three saw pairs ±6 cents on G2 98, D3 146.83, A3 220 → LP 180 → 1,800 Hz over 1.6 s, Q 4;
//                    attack 600 ms, release 2 s, −16 dB
//   420…2,800 LIGHT  noise → BP 300 → 6,000 Hz, panned L → R with the axis ignition, −26 dB
//   340+60·k GROWTH  one soft sine bell per found secret (its SECRET_NOTE), decay 1.2 s, −30 dB — his system sounds
//                    unlike a fresh one.
//
// Mix law (SPEC §9.7, A6.5.8): nothing is louder than the thump. The layers ride a sidechain bus that dips 10 dB under
// the thump and recovers with it (τ 120 ms) and sits 5 dB under the SPEC layer values, so the bells bloom out of the
// hit and the whole signature peaks at the thump: −6 dBFS (measured after the shadow on phones, A6.1.2).
import { SECRET_NOTE, hz } from '../notes.js';
import { db2gain, osc, noise, filt, pan, hit, fmBell, voice, add, finish, burst, ad, ahr, gn, part, xr, lr, lockPair } from '../synth.js';
import { thumpBody } from './grammar.js';
import { state } from '../../core/state.js';

const LAYERS_DB = -5;

function build(E, p, extraDb, ownerBell) {
  const ac = E.ctx, top = (p.gainDb === -3 ? -3 : 0) + extraDb;
  const v = voice(E, p, { bus: 'fx', db: top }), t = v.t;
  // THUMP (+ click)
  add(v, thumpBody(ac, t, v.out, db2gain(-6)));
  burst(ac, t, { type: 'bandpass', f: 3200, Q: 1.2, a: 0.0003, d: 0.0027, peak: db2gain(-18) * 2.2 }, v);
  // the layer bus: sidechained under the thump
  const L = gn(ac);
  L.gain.setValueAtTime(db2gain(LAYERS_DB - 10), t);
  L.gain.setTargetAtTime(db2gain(LAYERS_DB), t + 0.004, 0.12);
  L.connect(v.out);
  const wet = E.send ? E.send(0.3) : null;
  // "SAM" and "VIN"
  const bellAt = (f, s, dec, send) => {
    const b = fmBell(ac, f, 1.4, 3, s, dec, 1.2, 0.008), g = gn(ac, db2gain(-10)), h = part(ac, f * 3, s, L, db2gain(-24), 0.008, dec / 3 / 6.91, dec / 3 + 0.05);
    b.out.connect(g).connect(L);
    if (send && wet) g.connect(wet);
    add(v, b, h);
  };
  bellAt(392.0, t + 0.06, 2.4, false);
  bellAt(587.33, t + 0.34, 2.8, true);
  // BEAT-TO-LOCK
  lockPair(v, ac, 196.0, 293.66, 14, 0.6, t + 0.34, L, db2gain(-16) / 2, 0.03, 0.9, 1.7);
  // STRUCTURE ANSWERS
  const s4 = t + 0.42, lp = filt(ac, 'lowpass', 180, 4), ag = gn(ac);
  xr(lp.frequency, 180, 1800, s4, 1.6);
  ad(ag.gain, s4, db2gain(-16) / 3.2, 0.6, 2 / 6.91);
  for (const f of [98.0, 146.83, 220.0]) for (const c6 of [-6, 6]) {
    const o = osc(ac, f, 'sawtooth');
    o.detune.value = c6;
    o.connect(lp);
    o.start(s4);
    add(v, o);
  }
  lp.connect(ag).connect(L);
  // LIGHT WAVE, L → R
  const n = noise(ac, 'white'), bp = filt(ac, 'bandpass', 300, 1.4), wg = gn(ac), pn = pan(ac, -1);
  xr(bp.frequency, 300, 6000, s4, 2.38);
  ahr(wg.gain, s4, db2gain(-26) * 2.4, 0.9, s4 + 0.9, t + 2.8);
  if (pn.pan) lr(pn.pan, -1, 1, s4, 2.38);
  n.connect(bp).connect(wg).connect(pn).connect(L);
  n.start(s4);
  add(v, n);
  // HIS GROWTH — one bell per found secret, at 340 + 60·k ms (k = 1…)
  const found = Array.isArray(p.found) ? p.found : [];
  found.forEach((id, i) => {
    const f = hz(SECRET_NOTE[id] || ''), s = t + 0.34 + 0.06 * (i + 1);
    if (!SECRET_NOTE[id]) return;
    const g = gn(ac), o = part(ac, f, s, g, db2gain(-30), 0.005, 1.2 / 6.91, 1.3), o2 = part(ac, f * 2.76, s, L, db2gain(-42), 0.004, 0.3 / 6.91, 0.4);
    g.connect(L);
    if (wet) g.connect(wet);
    add(v, o, o2);
  });
  // OWNER — the major third, B4, a beat after VIN
  if (ownerBell) {
    const s = t + 0.62, b = fmBell(ac, 493.88, 1.4, 2.4, s, 2.6, 1.0, 0.008), g = gn(ac, db2gain(-12));
    b.out.connect(g).connect(L);
    if (wet) g.connect(wet);
    add(v, b);
  }
  return finish(E, v, t + 3.3);
}

/** signature { when?, gainDb?: 0 | -3, found: SecretId[] } */
export function signature(E, p = {}) { return build(E, p, 0, false); }

/** ratchet { i: 0..6 } — 2 ms noise through BP 3.2 kHz Q 8, +4 % per click, −24 dB. */
export function ratchet(E, p = {}) {
  return hit(E, p, { bus: 'ui', db: -24 }, { type: 'bandpass', f: 3200 * Math.pow(1.04, Math.max(0, Math.min(12, +p.i || 0))), Q: 8, a: 0.0002, d: 0.0018, peak: 20 }, 0.03);
}

/** owner {} — S05: the full signature at −6 dB plus a B4 493.88 Hz bell (the major third). Centred; his growth kept. */
export function owner(E, p = {}) {
  const found = state.data && state.data.found ? Object.keys(state.data.found) : [];
  return build(E, { when: p.when, found: Array.isArray(p.found) ? p.found : found }, -6, true);
}
