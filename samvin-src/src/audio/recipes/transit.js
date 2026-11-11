// audio/recipes/transit.js — WP3. Transitions (SPEC §9.5; §4.1 boot swell; §7.5 ZENITH snap; SPEC-ADDENDUM A6.5.4).
// whoosh and liftRumble are LIVE: the director calls set({speed01, pan}) every travel frame, so while scrubbing the
// sound follows `u` in real time. Sub content (sub-drop, thud, rumble, swell) carries its harmonic shadow on phones
// through the master chain (A6.1.2). Transitions peak ≤ −10 dB (SPEC §9.7).
import { db2gain, osc, noise, filt, voice, add, finish, burst, impulse, shell, live, ad, ahr, gn, part, xr, lr, glide1, hit } from '../synth.js';

const clamp01 = (x) => Math.max(0, Math.min(1, +x || 0));

/** whoosh { speed01, pan, reverse? } LIVE — pink noise → BP (Q 1.0) whose centre maps 300 → 2,400 Hz with speed
 *  (normalised to the transition's maximum); gain silence → −18 dB ∝ speed; a StereoPanner follows lateral velocity.
 *  reverse (RECALL): the contour runs high → low — the centre holds the top until the speed peak has passed. */
export function whoosh(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'fx', true), { out, pn } = v, n = noise(ac, 'pink'), bp = filt(ac, 'bandpass', 300, 1.0);
  n.connect(bp).connect(out);
  n.start(ac.currentTime, Math.random() * 1.5);
  v.srcs.push(n);
  let peak = 0, falling = false;
  const rev = !!p.reverse;
  v.set = (q) => {
    if (!v.alive || !q) return;
    const s = clamp01(q.speed01), t = ac.currentTime;
    if (s > peak) peak = s; else if (s < peak * 0.85) falling = true;
    const c = rev && !falling ? 1 : s;
    bp.frequency.setTargetAtTime(300 + 2100 * c, t, 0.025);
    out.gain.setTargetAtTime(db2gain(-18) * 1.9 * v.k * s, t, 0.025);
    if (pn && pn.pan && q.pan != null) pn.pan.setTargetAtTime(Math.max(-1, Math.min(1, +q.pan || 0)), t, 0.04);
  };
  v.set(p);
  return live(E, v);
}

/** subDrop { ms = 1300, from = 120, to = 30, gainDb = −10 } — DIVE (and the boot): a sine falling exponentially. */
export function subDrop(E, p = {}) {
  const d = Math.max(0.1, (+p.ms || 1300) / 1000);
  return glide1(E, p, { bus: 'fx', db: p.gainDb != null ? +p.gainDb : -10 }, +p.from || 120, +p.to || 30, d, 0.03, d * 0.7, d);
}

/** strutTick {} — passing between struts: 1 ms noise, HP 3 kHz, −32 dB (the caller limits to 30/s). */
export function strutTick(E, p = {}) {
  return hit(E, p, { bus: 'fx', db: -32 }, { type: 'highpass', f: 3000, Q: 0.707, a: 0.0001, d: 0.0009, peak: 1.1 }, 0.006);
}

/** recallThud {} — the RECALL settle: a 42 Hz sine, 300 ms, −8 dB. */
export function recallThud(E, p = {}) {
  const v = voice(E, p, { bus: 'fx', db: -8 }), t = v.t;
  add(v, part(E.ctx, 42, t, v.out, 1, 0.004, 0.3 / 6.91, 0));
  return finish(E, v, t + 0.31);
}

/** liftRumble { speed01 } LIVE — the elevator: brown noise LP 120 Hz + a 36 Hz sine, gain ∝ velocity, max −20 dB. */
export function liftRumble(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'fx', false), { out } = v, n = noise(ac, 'brown'), lp = filt(ac, 'lowpass', 120, 0.707);
  const s = osc(ac, 36), sg = gn(ac, 0.45);
  n.connect(lp).connect(out);
  s.connect(sg).connect(out);
  n.start(ac.currentTime, Math.random() * 1.5); s.start();
  v.srcs.push(n, s);
  v.set = (q) => { if (v.alive && q) out.gain.setTargetAtTime(db2gain(-20) * 0.45 * clamp01(q.speed01), ac.currentTime, 0.04); };
  v.set(p);
  return live(E, v);
}

/** irisWhoosh {} — per iris passed: noise bandpass 800 → 200 Hz over 400 ms, −24 dB. */
export function irisWhoosh(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -24 }), t = v.t, n = noise(ac, 'white'), bp = filt(ac, 'bandpass', 800, 2.2), g = gn(ac);
  xr(bp.frequency, 800, 200, t, 0.4);
  lr(g.gain, 0, 5, t, 0.12); g.gain.linearRampToValueAtTime(0, t + 0.4);
  n.connect(bp).connect(g).connect(v.out);
  n.start(t, Math.random() * 1.5);
  add(v, n);
  return finish(E, v, t + 0.41);
}

/** bootSwell {} — THE LINE: a low swell rising into the ignition. Rises over 800 ms with the scan (−2,340 → −1,540),
 *  then keeps opening under the locks (sub 36 → 49 Hz, the bed's own pitch; noise LP 120 → 900 Hz) until the ПАУЗА
 *  gate takes it at −400 (it would end by itself at the ignition). Peak −12 dB. */
export function bootSwell(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -13.6 }), t = v.t, end = t + 2.34;
  const a = osc(ac, 36), b = osc(ac, 36.3), g = gn(ac), n = noise(ac, 'brown'), lp = filt(ac, 'lowpass', 120, 1.2), ng = gn(ac);
  xr(a.frequency, 36, 49, t, 2.34); xr(b.frequency, 36.3, 49.3, t, 2.34);
  xr(g.gain, 0.0001, 0.42, t, 0.8); g.gain.linearRampToValueAtTime(0.5, end - 0.06); g.gain.linearRampToValueAtTime(0, end);
  xr(lp.frequency, 120, 900, t, 2.34);
  xr(ng.gain, 0.0001, 0.35, t, 0.8); ng.gain.linearRampToValueAtTime(0.5, end - 0.06); ng.gain.linearRampToValueAtTime(0, end);
  a.connect(g); b.connect(g); g.connect(v.out);
  n.connect(lp).connect(ng).connect(v.out);
  a.start(t); b.start(t); n.start(t, Math.random() * 1.5);
  add(v, a, b, n);
  return finish(E, v, end + 0.01);
}

/** snapAir {} — ZENITH: the navigator's rubber band gives — a soft snap, then a rising air tone (600 ms). */
export function snapAir(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -16, wet: 0.2 }), t = v.t;
  const im = impulse(ac, 1), sl = filt(ac, 'bandpass', 2200, 1.5), sg = gn(ac, 2.2);
  im.connect(sl).connect(sg).connect(v.out);
  burst(ac, t, { type: 'bandpass', f: 2000, Q: 1.2, a: 0.0003, d: 0.003, peak: 1.2 }, v);
  const n = noise(ac, 'pink'), bp = filt(ac, 'bandpass', 500, 2), ag = gn(ac), o = osc(ac, 660), og = gn(ac);
  const s = t + 0.02;
  xr(bp.frequency, 500, 3200, s, 0.58);
  ahr(ag.gain, s, 1.6, 0.43, s + 0.43, t + 0.62);
  xr(o.frequency, 660, 1320, s, 0.58);
  ahr(og.gain, s, 0.12, 0.43, s + 0.43, t + 0.62);
  n.connect(bp).connect(ag).connect(v.out);
  o.connect(og).connect(v.out);
  im.start(t); n.start(t, Math.random() * 1.5); o.start(t);
  add(v, im, n, o);
  return finish(E, v, t + 0.63);
}
