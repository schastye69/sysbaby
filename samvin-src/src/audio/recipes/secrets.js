// audio/recipes/secrets.js — WP3. Secret and special sounds (SPEC §9.6; §9.4 drone dodge; SPEC-ADDENDUM A6.5.4).
// Secrets peak −12 … −18 dB (SPEC §9.7) unless SPEC gives the row its own level. All centred (A6.4).
import { db2gain, osc, noise, filt, fmBell, voice, add, finish, burst, conv, shell, live, ad, ahr, gn, part, modal, bell, xr, lr, tone, windBand, glide1 } from '../synth.js';


const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
/** shard { when? } — the landing bell: additive G6 1,567.98 Hz, partials ×1, ×2.76, ×5.40 decaying over 4.0, 1.6, 0.6 s,
 *  −16 dB. (Its 400 ms reversed swell is now the bell's own reverb arriving first: reverseTail('vin', rate 2.67,
 *  −16 dB) planned by the flight, A6.5.4.) */
export function shard(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -16, wet: 0.25 }), t = v.t;
  add(v, ...bell(ac, 1567.98, t, v.out, [[1, 4.0, 1 / 1.7], [2.76, 1.6, 0.5 / 1.7], [5.4, 0.6, 0.28 / 1.7]]));
  return finish(E, v, t + 4.06);
}

/** resRise { k: 0..5 } LIVE — РЕЗОНАНС rising tone: a sine stepping to 110·2^(k/2) Hz with a 200 ms glide per step. */
export function resRise(E, p = {}) {
  const ac = E.ctx, v = shell(E), fk = (k) => 110 * Math.pow(2, clamp(+k, 0, 6) / 2), o = osc(ac, p.k != null ? fk(p.k) : 110);
  o.connect(v.out);
  o.start();
  v.srcs.push(o);
  v.out.gain.setTargetAtTime(db2gain(-18), ac.currentTime, 0.08);
  v.set = (q) => {
    if (!v.alive || !q || q.k == null) return;
    const t = ac.currentTime;
    o.frequency.cancelScheduledValues(t); xr(o.frequency, o.frequency.value, fk(q.k), t, 0.2);
  };
  return live(E, v);
}

/** resSub {} LIVE — the sub swell under РЕЗОНАНС: 55 Hz, 0 → −16 dB over 6 s. */
export function resSub(E, p = {}) {
  const ac = E.ctx, v = shell(E), o = osc(ac, 55), t = ac.currentTime;
  o.connect(v.out); o.start(); v.srcs.push(o);
  lr(v.out.gain, 0, db2gain(-16), t, 6);
  v.set = () => {};
  void p;
  return live(E, v);
}

/** chunk {} — per РЕЗОНАНС step: a 30 ms noise burst (LP 900 Hz) + a 70 Hz sine for 60 ms, −12 dB. */
export function chunk(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -12 }), t = v.t, [, g] = tone(v, ac, 70, t);
  burst(ac, t, { type: 'lowpass', f: 900, Q: 0.707, a: 0.002, d: 0.028, peak: 0.9 }, v);
  ahr(g.gain, t, 0.62, 0.003, t + 0.04, t + 0.06);
  return finish(E, v, t + 0.07);
}

/** FM bells / modal notes on every hz at once, the sum held to `db` peak. */
function cluster(E, p, db, fm) {
  const ac = E.ctx, list = (Array.isArray(p.hz) ? p.hz : []).map(Number).filter((f) => f > 20 && f < 8000);
  if (!list.length) list.push(392);
  const v = voice(E, p, { bus: 'room', db, wet: 0.2 }), t = v.t, g = gn(ac, 1 / Math.pow(list.length, 0.75) / (fm ? 1 : 1.75));
  g.connect(v.out);
  let end = t;
  list.forEach((f, i) => {
    const s = t + i * 0.004;
    if (fm) { const b = fmBell(ac, f, 1.4, 2.4, s, 2.6, 1.0, 0.006); b.out.connect(g); add(v, b); end = Math.max(end, b.end); }
    else end = Math.max(end, modal(ac, f, s, 2.4, 1, 6, g));
  });
  return finish(E, v, end);
}

/** resChord { hz[] } — РЕЗОНАНС mode 7: all member notes as FM bells at once, −14 dB. */
export function resChord(E, p = {}) { return cluster(E, p, -15.5, true); }

/** chord { hz[] } — S04 АККОРД: all member notes, modal, struck together, −12 dB. */
export function chord(E, p = {}) { return cluster(E, p, -12, false); }

/** hiss {} — РЕЗОНАНС release: noise HP 2 kHz decaying over 900 ms, −24 dB. */
export function hiss(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -24 }), t = v.t, n = noise(ac, 'white'), g = gn(ac);
  ad(g.gain, t, 0.68, 0.01, 0.9 / 6.91);
  n.connect(filt(ac, 'highpass', 2000, 0.707)).connect(g).connect(v.out);
  n.start(t, Math.random());
  add(v, n);
  return finish(E, v, t + 0.92);
}

/** shepard { d } LIVE — Shepard–Risset (PULL, DESCENT): 8 sines at 27.5·2^(i + φ), gaussian amplitude over log2 f
 *  (centre log2 440, σ 1.1 octaves), φ = (−3·log10(d/12)) mod 1: it falls 3 octaves per outward loop and rises
 *  inward, seamlessly. −20 dB. Fades in on engage, out over 800 ms after stop. */
export function shepard(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'fx', false, 800), os = [], gs = [], L440 = Math.log2(440);
  for (let i = 0; i < 8; i++) { const o = osc(ac, 440), g = gn(ac); g.gain.value = 0; o.connect(g).connect(v.out); o.start(); os.push(o); gs.push(g); v.srcs.push(o); }
  // Each sine owns a slot u_i = (i + x) mod 8 on the unwrapped phase x: it wraps (7,040 Hz → 27.5 Hz) only when it sits
  // at the gaussian's −57 dB edge, so the endless rise / fall has no seam. The frequency set repeats every octave, so a
  // jump of x is first reduced by whole octaves (K): every sine then glides less than half an octave (τ 12 ms).
  const pu = new Float32Array(8).fill(-1);
  let K = 0, xe = null;
  v.set = (q) => {
    if (!v.alive || !q || q.d == null) return;
    const x = -3 * Math.log10(Math.max(1e-6, +q.d) / 12), t = ac.currentTime;
    if (xe !== null) K += Math.round(x - K - xe);
    xe = x - K;
    for (let i = 0; i < 8; i++) {
      const u = (((i + xe) % 8) + 8) % 8, lf = Math.log2(27.5) + u, f = Math.pow(2, lf), a = Math.exp(-((lf - L440) * (lf - L440)) / (2 * 1.21));
      if (pu[i] < 0 || Math.abs(u - pu[i]) > 4) { os[i].frequency.setValueAtTime(f, t); gs[i].gain.setValueAtTime(a * 0.59, t); }
      else { os[i].frequency.setTargetAtTime(f, t, 0.012); gs[i].gain.setTargetAtTime(a * 0.59, t, 0.012); }
      pu[i] = u;
    }
  };
  v.set({ d: p.d != null ? p.d : 12 });
  v.out.gain.setTargetAtTime(db2gain(-20), ac.currentTime, 0.12);
  return live(E, v);
}

/** whale {} — S07 deep call: two tones detuned 0.7 Hz gliding 90 → 140 → 70 Hz over 5 s, through two bandpass formants
 *  (400 and 800 Hz, Q 6) wobbled ±60 Hz by a 0.2 Hz LFO; 60 % send to the 6 s impulse response; −18 dB. The tones are
 *  sines with a saw twin feeding the formants (sines alone carry no energy at 400/800 Hz). */
export function whale(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -20.5 }), t = v.t, end = t + 5, mix = gn(ac);
  const lfo = osc(ac, 0.2), lg = gn(ac, 60);
  lfo.connect(lg);
  const F = [filt(ac, 'bandpass', 400, 6), filt(ac, 'bandpass', 800, 6)];
  for (const f of F) { lg.connect(f.frequency); f.connect(mix); }
  const env = gn(ac);
  ahr(env.gain, t, 1, 0.9, t + 3.6, end);
  mix.connect(env);
  for (const det of [0, 0.7]) {
    const s = osc(ac, 90 + det), w = osc(ac, 90 + det, 'sawtooth'), sg = gn(ac, 0.18), wg = gn(ac);
    for (const o of [s, w]) { lr(o.frequency, 90 + det, 140 + det, t, 2); o.frequency.linearRampToValueAtTime(70 + det, end); }
    wg.gain.value = 0.9;
    s.connect(sg).connect(mix);
    w.connect(wg); for (const f of F) wg.connect(f);
    s.start(t); w.start(t);
    add(v, s, w);
  }
  lfo.start(t);
  add(v, lfo);
  env.connect(v.out);
  if (E.irLong) { const r = conv(ac, E.irLong), wet = gn(ac); wet.gain.value = 0.6; env.connect(r.input); r.output.connect(wet).connect(v.out); }
  return finish(E, v, end + 6.1);
}

/** dizzy {} — S03: glissando 880 → 440 Hz over 1.2 s with 6 Hz vibrato at ±40 cents, −24 dB. */
export function dizzy(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -24 }), t = v.t, [o, g] = tone(v, ac, 880, t);
  tone(v, ac, 6, t, o.detune)[1].gain.value = 40;
  xr(o.frequency, 880, 440, t, 1.2);
  ahr(g.gain, t, 1, 0.02, t + 1.0, t + 1.2);
  return finish(E, v, t + 1.21);
}

/** capsule {} — S12: five cracks (2 ms noise, BP 6 kHz, 160 ms apart), then a G4–B4–D5 bell chord. −14 dB. */
export function capsule(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -14, wet: 0.25 }), t = v.t;
  for (let i = 0; i < 5; i++) {
    burst(ac, t + 0.16 * i, { type: 'bandpass', f: 6000, Q: 1.5, a: 0.0002, d: 0.0018, peak: 2.0 }, v);
  }
  const s = t + 0.8, g = gn(ac, 0.26);
  g.connect(v.out);
  let end = s;
  [392.0, 493.88, 587.33].forEach((f, i) => { const b = fmBell(ac, f, 1.4, 2.4, s + i * 0.012, 3.0, 1.0, 0.006); b.out.connect(g); add(v, b); end = b.end; });
  return finish(E, v, end);
}

/** companion {} — S14: an FM bell gliding 392 → 784 Hz over 2.4 s, ending in a 3,000 Hz chirp. −16 dB. */
export function companion(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -16, wet: 0.2 }), t = v.t;
  const car = osc(ac, 392), mod = osc(ac, 392 * 1.4), mg = gn(ac), g = gn(ac);
  xr(car.frequency, 392, 784, t, 2.4);
  xr(mod.frequency, 392 * 1.4, 784 * 1.4, t, 2.4);
  lr(mg.gain, 392 * 1.4 * 1.6, 784 * 1.4 * 0.3, t, 2.4);
  mod.connect(mg).connect(car.frequency);
  lr(g.gain, 0, 0.8, t, 0.01); g.gain.linearRampToValueAtTime(0.55, t + 2.3); g.gain.linearRampToValueAtTime(0, t + 2.42);
  car.connect(g).connect(v.out);
  const c0 = t + 2.4, ch = part(ac, 2400, c0, v.out, 0.45, 0.004, 0.012, 0);
  xr(ch.frequency, 2400, 3000, c0, 0.05);
  car.start(t); mod.start(t);
  add(v, car, mod, ch);
  return finish(E, v, c0 + 0.12);
}

/** zenithPad {} LIVE — ZENITH: a very quiet G-major add9 pad (G3, B3, D4, A4) with a 0.07 Hz amplitude LFO, −40 dB,
 *  plus wind (pink noise BP 600 Hz Q 0.5, 0.07 Hz LFO, −40 dB). */
export function zenithPad(E, p = {}) {
  const ac = E.ctx, v = shell(E, 'room', false, 300), lfo = osc(ac, 0.07), lg = gn(ac, 0.3), pad = gn(ac, 0.7);
  lfo.connect(lg).connect(pad.gain);
  for (const f of [196.0, 246.94, 293.66, 440.0]) { const o = osc(ac, f), g = gn(ac); g.gain.value = 0.25; o.connect(g).connect(pad); o.start(); v.srcs.push(o); }
  pad.connect(v.out);
  lfo.start();
  v.srcs.push(lfo, ...windBand(ac, v.out));
  v.out.gain.setTargetAtTime(db2gain(-40) * 0.66, ac.currentTime, 0.6);
  v.set = () => {};
  void p;
  return live(E, v);
}

/** invertRoll {} — S08 ИЗНАНКА: a 1.4 s low sweep 60 → 30 Hz (−14 dB; its shadow carries it on phones). */
export function invertRoll(E, p = {}) {
  return glide1(E, p, { bus: 'fx', db: -14 }, 60, 30, 1.4, 0.08, 1.1, 1.4);
}

/** droneDodge {} — S09: sine 2,400 → 3,200 Hz, 40 ms, −30 dB. */
export function droneDodge(E, p = {}) {
  return glide1(E, p, { bus: 'ui', db: -30 }, 2400, 3200, 0.04, 0.003, 0.03, 0.04);
}

