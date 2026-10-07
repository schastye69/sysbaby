// audio/synth.js — WP3 SEED (ARCH §3.10.2, §6.1.5): thin, correct Web Audio primitives used by the recipes.
// Each returns its node(s); callers connect, start and stop them. Plus seedBlip / seedLive, the WP0 seed bodies every
// recipe uses until WP3 lands (a −30 dB 40 ms sine blip at hashStr(name) % 600 + 300 Hz; live: a −40 dB sine that
// follows set({speed01 | amount | k | d})).
import { hashStr } from '../core/rng.js';

/** dB → linear gain */
export function db2gain(db) { return Math.pow(10, db / 20); }

/** OscillatorNode (not started). */
export function osc(ac, freq = 440, type = 'sine') {
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  return o;
}

const noiseCache = new WeakMap();
/** Looping white / pink / brown noise source (not started); buffers are cached per context. */
export function noise(ac, color = 'white') {
  let c = noiseCache.get(ac);
  if (!c) { c = {}; noiseCache.set(ac, c); }
  if (!c[color]) {
    const n = ac.sampleRate * 2, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (color === 'pink') { b0 = 0.997 * b0 + 0.029591 * w; b1 = 0.985 * b1 + 0.032534 * w; b2 = 0.95 * b2 + 0.048056 * w; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.5; }
      else if (color === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else d[i] = w;
    }
    c[color] = buf;
  }
  const s = ac.createBufferSource();
  s.buffer = c[color];
  s.loop = true;
  return s;
}

/** GainNode with an attack/decay envelope scheduled from t0 (s). → GainNode */
export function env(ac, { a = 0.005, d = 0.2, peak = 1, t0 = ac.currentTime } = {}) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + a);
  g.gain.exponentialRampToValueAtTime(Math.max(1e-5, peak * 1e-4), t0 + a + d);
  return g;
}

/** BiquadFilterNode */
export function filt(ac, type = 'lowpass', freq = 1000, Q = 0.707) {
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = Q;
  return f;
}

/** StereoPannerNode (or a plain gain where unsupported). */
export function pan(ac, p = 0) {
  if (typeof ac.createStereoPanner !== 'function') return ac.createGain();
  const n = ac.createStereoPanner();
  n.pan.value = Math.max(-1, Math.min(1, p));
  return n;
}

/** A modal bank: decaying sines. → { out: GainNode, stop(t) } (started at t0). */
export function modal(ac, freqs, decays, gains, t0 = ac.currentTime) {
  const out = ac.createGain();
  const oscs = freqs.map((f, i) => {
    const o = osc(ac, f);
    const g = env(ac, { a: 0.002, d: decays[i] || 0.5, peak: gains ? gains[i] : 1 / freqs.length, t0 });
    o.connect(g).connect(out);
    o.start(t0);
    o.stop(t0 + (decays[i] || 0.5) + 0.05);
    return o;
  });
  return { out, stop(t = ac.currentTime) { for (const o of oscs) { try { o.stop(t); } catch (e) { /* stopped */ } } } };
}

/** A struck bell: inharmonic partials 1, 2.76, 5.4, 8.93. → modal() result */
export function bell(ac, f, t0 = ac.currentTime, dur = 1.6) {
  return modal(ac, [f, f * 2.76, f * 5.4, f * 8.93], [dur, dur * 0.6, dur * 0.35, dur * 0.2], [0.5, 0.25, 0.15, 0.1], t0);
}

/** Two-operator FM bell. → { out: GainNode, stop(t) } (started at t0). */
export function fmBell(ac, f, ratio = 1.4, index = 2, t0 = ac.currentTime, dur = 1.2) {
  const car = osc(ac, f), mod = osc(ac, f * ratio), mg = ac.createGain();
  mg.gain.setValueAtTime(f * index, t0);
  mg.gain.exponentialRampToValueAtTime(1e-3, t0 + dur);
  mod.connect(mg).connect(car.frequency);
  const out = env(ac, { a: 0.003, d: dur, peak: 1, t0 });
  car.connect(out);
  car.start(t0); mod.start(t0);
  car.stop(t0 + dur + 0.05); mod.stop(t0 + dur + 0.05);
  return { out, stop(t = ac.currentTime) { try { car.stop(t); mod.stop(t); } catch (e) { /* stopped */ } } };
}

const seedHz = (name) => (hashStr(name) % 600) + 300;

/** WP0 seed recipe body: a −30 dB, 40 ms sine blip on the UI bus. → Voice */
export function seedBlip(E, name) {
  const ac = E.ctx, t = ac.currentTime;
  const o = osc(ac, seedHz(name) * Math.pow(2, (E.transpose || 0) / 12));
  const g = env(ac, { a: 0.004, d: 0.036, peak: db2gain(-30), t0: t });
  o.connect(g).connect(E.bus.ui);
  o.start(t);
  o.stop(t + 0.06);
  const v = { alive: true, stop() { if (!v.alive) return; v.alive = false; try { o.stop(); } catch (e) { /* stopped */ } } };
  o.onended = () => { v.alive = false; };
  return E.track(v, 0.06);
}

/** WP0 seed LIVE body: a −40 dB sine that follows set({speed01 | amount | k | d}). → LiveVoice */
export function seedLive(E, name, params) {
  const ac = E.ctx, f = seedHz(name);
  const o = osc(ac, f), g = ac.createGain();
  g.gain.value = 0;
  o.connect(g).connect(E.bus.fx);
  o.start();
  const v = {
    alive: true,
    set(p) {
      if (!v.alive || !p) return;
      const x = p.speed01 != null ? p.speed01 : p.amount != null ? p.amount : p.k != null ? p.k / 5 : p.d != null ? Math.min(1, p.d / 12) : 1;
      const u = Math.max(0, Math.min(1, x)), t = ac.currentTime;
      g.gain.setTargetAtTime(db2gain(-40) * (0.25 + 0.75 * u), t, 0.03);
      o.frequency.setTargetAtTime(f * (1 + 0.5 * u), t, 0.03);
    },
    stop(releaseMs = 200) {
      if (!v.alive) return;
      v.alive = false;
      const t = ac.currentTime, r = Math.max(0.008, releaseMs / 1000);
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + r);
      try { o.stop(t + r + 0.02); } catch (e) { /* stopped */ }
    },
  };
  v.set(params || { speed01: 0 });
  return E.track(v, 3600);
}
