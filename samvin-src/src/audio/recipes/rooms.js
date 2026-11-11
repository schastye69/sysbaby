// audio/recipes/rooms.js — WP3. Room sounds: VOYAGES probes (SPEC §9.4), SIGNAL sky voice / dial / beat-lock (§6.5,
// §9.3), INSIGNIA vault notes (§6.6), the wind band (ARCH §6.1.6 A12). Pans: the sky voice follows the drawing's y
// (positional, A6.4); everything else is centred.
import { db2gain, osc, noise, filt, voice, add, finish, shell, live, ad, ahr, gn, part, bell, xr, lr, tone, windBand, lockPair } from '../synth.js';

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** probeHold {} LIVE — hold-to-launch: sine 220 → 440 Hz linear over 1,200 ms, −22 dB (the caller plays the arrival lock
 *  in V's key on completion, and stops this voice). */
export function probeHold(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'ui', false), o = osc(ac, 220), t = ac.currentTime;
  lr(o.frequency, 220, 440, t, 1.2);
  o.connect(v.out); o.start(t); v.srcs.push(o);
  lr(v.out.gain, 0, db2gain(-22), t, 0.02);
  v.set = () => {};
  void p;
  return live(E, v);
}

/** probeFlight {} — sine 660 → 440 Hz over 2.5 s with a 9 Hz tremolo, −28 dB. */
export function probeFlight(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'room', db: -28, wet: 0.15 }), t = v.t, [o, g] = tone(v, ac, 660, t);
  xr(o.frequency, 660, 440, t, 2.5);
  ahr(g.gain, t, 0.65, 0.05, t + 2.2, t + 2.5);
  tone(v, ac, 9, t, g.gain)[1].gain.value = 0.35;
  return finish(E, v, t + 2.51);
}

/** probeReturn {} — three pings at 1,318.5 Hz, 90 ms apart, −24 dB. */
export function probeReturn(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'room', db: -24, wet: 0.2 }), t = v.t;
  for (let i = 0; i < 3; i++) {
    add(v, part(ac, 1318.51, t + 0.09 * i, v.out, 1, 0.002, 0.012, 0.09));
  }
  return finish(E, v, t + 0.27);
}

/** skyVoice { hz, pan } LIVE — the sky pad replays a drawing: x → pitch (220–880 Hz, log), y → pan. A glass-clear sine
 *  with a soft octave and a slow shimmer, −24 dB. (Also accepts { freq }.) */
export function skyVoice(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'room', true), o = osc(ac, 440), o2 = osc(ac, 880), g2 = gn(ac, 0.16), vib = osc(ac, 5.2), vg = gn(ac, 6);
  vib.connect(vg); vg.connect(o.detune); vg.connect(o2.detune);
  o.connect(v.out); o2.connect(g2).connect(v.out);
  o.start(); o2.start(); vib.start();
  v.srcs.push(o, o2, vib);
  let first = true;
  v.set = (q) => {
    if (!v.alive || !q) return;
    const f = clamp(+q.hz || 440, 40, 4000), t = ac.currentTime;
    if (first) { o.frequency.setValueAtTime(f, t); o2.frequency.setValueAtTime(2 * f, t); first = false; }
    else { o.frequency.setTargetAtTime(f, t, 0.02); o2.frequency.setTargetAtTime(2 * f, t, 0.02); }
    if (v.pn && v.pn.pan && q.pan != null) v.pn.pan.setTargetAtTime(clamp(+q.pan || 0, -1, 1), t, 0.03);
  };
  v.set(p);
  v.out.gain.setTargetAtTime(db2gain(-24) / 1.16 * v.k, ac.currentTime, 0.012);
  return live(E, v);
}

/** dialStatic { amount: 0..1 } LIVE — static on the frequency dial: a noise hiss at amount × −30 dB. */
export function dialStatic(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'room', false), n = noise(ac, 'white'), bp = filt(ac, 'bandpass', 3200, 0.6), cr = gn(ac, 1.05);
  n.connect(bp).connect(cr).connect(v.out);
  n.start(); v.srcs.push(n);
  v.set = (q) => { if (v.alive && q && q.amount != null) v.out.gain.setTargetAtTime(db2gain(-30) * clamp(+q.amount, 0, 1), ac.currentTime, 0.04); };
  v.set({ amount: p.amount != null ? p.amount : 0 });
  return live(E, v);
}

/** dialCarrier { amount: 0..1 } LIVE — within 0.5 of the clan frequency a faint carrier tone rises (≤ −30 dB). */
export function dialCarrier(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'room', false), o = osc(ac, 1403);
  o.connect(v.out); o.start(); v.srcs.push(o);
  v.set = (q) => {
    if (!v.alive || !q || q.amount == null) return;
    const a = clamp(+q.amount, 0, 1), t = ac.currentTime;
    v.out.gain.setTargetAtTime(db2gain(-30) * a, t, 0.06);
    o.frequency.setTargetAtTime(1403 * (0.985 + 0.015 * a), t, 0.06);
  };
  v.set({ amount: p.amount != null ? p.amount : 0 });
  return live(E, v);
}

/** beatLock { lo, hi } — S11: the beat-to-lock: lo steady, the upper starts +14 Hz and glides exponentially to hi over
 *  600 ms (the beating slows to zero); hold 900 ms, release 800 ms, −16 dB. */
export function beatLock(E, p = {}) {
  const v = voice(E, p, { bus: 'room', db: -16, wet: 0.2 }), t = v.t;
  lockPair(v, E.ctx, +p.lo || 196.0, +p.hi || 293.66, 14, 0.6, t, v.out, 0.5, 0.03, 0.9, 1.7);
  return finish(E, v, t + 1.71);
}

/** vaultNote { hz } — VAULT MELODY (INSIGNIA, dry): one glass bell per found secret, partials 1 / 2.76 / 5.4,
 *  decays 1.4 / 0.5 / 0.2 s, −18 dB. */
export function vaultNote(E, p = {}) {
  const ac = E.ctx, f = +p.hz || 440, v = voice(E, p, { bus: 'room', db: -18 }), t = v.t;
  add(v, ...bell(ac, f, t, v.out, [[1, 1.4, 1 / 1.3], [2.76, 0.5, 0.3 / 1.3], [5.4, 0.2, 0.12 / 1.3]]));
  return finish(E, v, t + 1.46);
}

/** wind { amount: 0..1 } LIVE — pink noise, bandpass 600 Hz Q 0.5, with a 0.07 Hz LFO, at amount × −40 dB. */
export function wind(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'room', false);
  v.srcs.push(...windBand(ac, v.out));
  v.set = (q) => { if (v.alive && q && q.amount != null) v.out.gain.setTargetAtTime(db2gain(-40) * clamp(+q.amount, 0, 1), ac.currentTime, 0.3); };
  v.set({ amount: p.amount != null ? p.amount : 1 });
  return live(E, v);
}
