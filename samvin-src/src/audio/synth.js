// audio/synth.js — WP3. The synthesis primitives every recipe, the bed, the master chain and the pre-renders share
// (ARCH §3.10.2: osc, noise, env, modal, fmBell, bell, filt, pan, db2gain; SPEC §9; SPEC-ADDENDUM A6). Web Audio only:
// oscillators, noise buffers, filters, panners, convolvers. Every primitive takes the context as its first argument (an
// AudioContext or an OfflineAudioContext), so the same code renders live and offline (A6.2). Levels are peak dBFS at
// the bus (QA renders recipes straight into a destination).
//
// Voice model: `voice(E, p, o)` builds `src… → out (level) → [pan] → E.bus[o.bus]` (+ an optional reverb send),
// `finish(E, v, end)` schedules the end, auto-disconnects and registers the voice with the engine's cap (E.track).

/** dB → linear gain */
export function db2gain(db) { return Math.pow(10, db / 20); }

/** GainNode at value v. */
export function gn(ac, v = 1) { const g = ac.createGain(); g.gain.value = v; return g; }

/** OscillatorNode (not started). */
export function osc(ac, freq = 440, type = 'sine') {
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  return o;
}

const noiseCache = new WeakMap();
/** Looping white / pink / brown noise source (not started). Buffers (2 s) are cached per context and normalised to the
 *  RMS of uniform white noise (0.577), so a gain in dB means the same loudness for every colour. */
export function noise(ac, color = 'white') {
  let c = noiseCache.get(ac);
  if (!c) noiseCache.set(ac, (c = {}));
  if (!c[color]) {
    const n = ac.sampleRate * 2, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, last = 0, s = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (color === 'pink') { b0 = 0.997 * b0 + 0.029591 * w; b1 = 0.985 * b1 + 0.032534 * w; b2 = 0.95 * b2 + 0.048056 * w; d[i] = b0 + b1 + b2 + w * 0.1848; }
      else if (color === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last; }
      else d[i] = w;
      s += d[i] * d[i];
    }
    const k = 0.577 / Math.sqrt(s / n);
    for (let i = 0; i < n; i++) d[i] *= k;
    c[color] = buf;
  }
  const src = ac.createBufferSource();
  src.buffer = c[color];
  src.loop = true;
  return src;
}

/** Attack–decay on a param: 0 at s, linear to `peak` at s + a, then exponential toward 0 with time constant tau. */
export function ad(prm, s, peak, a, tau) { prm.setValueAtTime(0, s); prm.linearRampToValueAtTime(peak, s + a); prm.setTargetAtTime(0, s + a, tau); return prm; }
/** Attack–hold–release on a param: 0 at s, linear to `peak` at s + a, held to h, linear to 0 at r (absolute times). */
export function ahr(prm, s, peak, a, h, r) { prm.setValueAtTime(0, s); prm.linearRampToValueAtTime(peak, s + a); prm.setValueAtTime(peak, h); prm.linearRampToValueAtTime(0, r); return prm; }
/** Exponential sweep a → b over d from t. */
export function xr(prm, a, b, t, d) { prm.setValueAtTime(a, t); prm.exponentialRampToValueAtTime(b, t + d); return prm; }
/** Linear sweep a → b over d from t. */
export function lr(prm, a, b, t, d) { prm.setValueAtTime(a, t); prm.linearRampToValueAtTime(b, t + d); return prm; }

/** GainNode with an attack / decay envelope from t0: linear attack a, then exponential decay to −60 dB over d. */
export function env(ac, { a = 0.005, d = 0.2, peak = 1, t0 = ac.currentTime } = {}) { const g = gn(ac, 0); ad(g.gain, t0, peak, a, d / 6.91); return g; }

/** One enveloped partial: osc f (type) → gain (ad: peak, attack a, time constant tau) → dest, started at s, stopped at
 *  s + life (life 0: the caller stops it). → the osc */
export function part(ac, f, s, dest, peak, a, tau, life, type) {
  const o = osc(ac, f, type), g = gn(ac);
  ad(g.gain, s, peak, a, tau);
  o.connect(g).connect(dest);
  o.start(s);
  if (life) o.stop(s + life);
  return o;
}

/** A one-shot noise hit: voice(E, p, o) + burst(bo) at its start, ending dur s later. → finished Voice */
export function hit(E, p, o, bo, dur) { const v = voice(E, p, o); burst(E.ctx, v.t, bo, v); return finish(E, v, v.t + dur); }

/** A tracked tone: osc f (type) → gain → dest (default v.out), started at s and added to voice v. → [osc, gain] */
export function tone(v, ac, f, s, dest = v.out, type) {
  const o = osc(ac, f, type), g = gn(ac);
  o.connect(g).connect(dest);
  o.start(s);
  v.srcs.push(o);
  return [o, g];
}

/** The SPEC wind band: pink noise → BP 600 Hz Q 0.5 → gain k·(0.7 ± 0.3 at 0.07 Hz) → dest. → its two sources (started) */
export function windBand(ac, dest, k = 1) {
  const n = noise(ac, 'pink'), lfo = osc(ac, 0.07), g = gn(ac, 0.7 * k);
  lfo.connect(gn(ac, 0.3 * k)).connect(g.gain);
  n.connect(filt(ac, 'bandpass', 600, 0.5)).connect(g).connect(dest);
  n.start(); lfo.start();
  return [n, lfo];
}

/** A one-shot swept sine: f0 → f1 (exponential) over sw s, attack a, held to h, released to 0 at r (s from the start;
 *  peak 1 at the voice level). → finished Voice */
export function glide1(E, p, o, f0, f1, sw, a, h, r) {
  const v = voice(E, p, o), t = v.t, [os, g] = tone(v, E.ctx, f0, t);
  xr(os.frequency, f0, f1, t, sw);
  ahr(g.gain, t, 1, a, t + h, t + r);
  return finish(E, v, t + r + 0.005);
}

/** Beat-to-lock pair into dest: lo steady + hi starting `off` Hz sharp, gliding exponentially to exact over gl s (the
 *  beating slows to zero); envelope ahr(peak, attack a, hold to s + h, end s + r). */
export function lockPair(v, ac, lo, hi, off, gl, s, dest, peak, a, h, r) {
  const g = gn(ac);
  g.connect(dest);
  tone(v, ac, lo, s, g);
  xr(tone(v, ac, hi + off, s, g)[0].frequency, hi + off, hi, s, gl);
  ahr(g.gain, s, peak, a, s + h, s + r);
}

/** Modal note: partials k = 1…n at 1/k, decays dec → dec/6 (higher partials faster); fundamental amplitude `f1`.
 *  → end time */
export function modal(ac, f, t0, dec, f1 = 1, n = 6, dest) {
  for (let k = 1; k <= n; k++) {
    const d = dec * (1 - ((k - 1) / Math.max(1, n - 1)) * (5 / 6));
    part(ac, f * k, t0, dest, f1 / k, 0.002, d / 6.91, d + 0.05);
  }
  return t0 + dec + 0.05;
}

/** Additive (glass) bell: partials P = [[ratio, decay s, amplitude]…] on f from s into dest, each decaying to −60 dB
 *  over its own time. → the oscs */
export function bell(ac, f, s, dest, P, a = 0.003) {
  return P.map(([r, d, k]) => part(ac, f * r, s, dest, k, a, d / 6.91, d + 0.05));
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
  if (!ac.createStereoPanner) return gn(ac);
  const n = ac.createStereoPanner();
  n.pan.value = Math.max(-1, Math.min(1, +p || 0));
  return n;
}

/** Two-operator FM bell: carrier f, modulator f·ratio, index `index` → 0 (linear) over idxDur; attack a, decay dur
 *  (−60 dB). Peak 1. → { out, stop(t), end } (started at t0). */
export function fmBell(ac, f, ratio = 1.4, index = 2, t0 = ac.currentTime, dur = 1.2, idxDur = dur, a = 0.003) {
  const car = osc(ac, f), mod = osc(ac, f * ratio), mg = gn(ac), out = gn(ac);
  lr(mg.gain, f * ratio * index, 0, t0, idxDur);
  mod.connect(mg).connect(car.frequency);
  ad(out.gain, t0, 1, a, dur / 6.91);
  car.connect(out);
  const end = t0 + a + dur + 0.05;
  car.start(t0); mod.start(t0);
  car.stop(end); mod.stop(end);
  return { out, end, stop(t = ac.currentTime) { try { car.stop(t); mod.stop(t); } catch (e) { /* stopped */ } } };
}

// ─── voices ─────────────────────────────────────────────────────────────────────────────────────────────────────
/** Start time of a recipe: params.when (ctx s, the engine already clamped it) or now. */
export function at(E, p) { const n = E.ctx.currentTime; return p && p.when != null && p.when > n ? +p.when : n; }
/** UI transposition factor (−5 semitones while ИЗНАНКА is on, else 1). */
export function tr(E) { return Math.pow(2, (E.transpose || 0) / 12); }

/** Fades `out` to 0 over ms and stops v.srcs (+ extra), then disconnects `head`. */
function fade(v, ac, out, head, ms, extra = 0.01) {
  if (!v.alive) return;
  v.alive = false;
  const n = ac.currentTime, r = Math.max(0.008, ms / 1000);
  out.gain.cancelScheduledValues(n);
  out.gain.setValueAtTime(out.gain.value, n);
  out.gain.linearRampToValueAtTime(0, n + r);
  for (const s of v.srcs) { try { s.stop(n + r + extra); } catch (e) { /* not started / stopped */ } }
  setTimeout(() => { try { head.disconnect(); } catch (e) { /* gone */ } }, (r + 0.2) * 1000);
}

/** out (level db) → [pan] → E.bus[bus] (+ E.send(wet)). → Voice with `t` (start time) and `out`. */
export function voice(E, p, { bus = 'ui', db = 0, pan: pn = 0, wet = 0, panNode = false } = {}) {
  const ac = E.ctx, out = gn(ac);
  let head = out;
  // a mono source through an equal-power StereoPanner loses 3 dB at the centre: compensate, so `db` is the level heard
  if (pn || panNode) out.connect((head = pan(ac, pn)));
  out.gain.value = db2gain(db) * (head === out ? 1 : Math.SQRT2);
  head.connect(E.bus[bus] || E.bus.ui);
  if (wet > 0 && E.send) head.connect(E.send(wet));
  const v = { alive: true, t: at(E, p), out, head, srcs: [], end: 0, stop(ms = 30) { fade(v, ac, out, head, ms); } };
  return v;
}

/** Adds started sources to a voice (they are stopped with it). */
export function add(v, ...s) { for (const x of s) v.srcs.push(x.src || x); return v; }

/** Schedules the end of a one-shot voice at absolute ctx time `end`; registers it with the voice cap. → v */
export function finish(E, v, end) {
  const ac = E.ctx;
  v.end = end;
  let last = null;
  for (const s of v.srcs) { try { s.stop(end); } catch (e) { /* already scheduled */ } if ('onended' in s) last = s; }
  const fin = () => { if (v.alive) { v.alive = false; try { v.head.disconnect(); } catch (e) { /* gone */ } } };
  if (last) last.onended = fin; else setTimeout(fin, (end - ac.currentTime + 0.1) * 1000);
  return E.track ? E.track(v, Math.max(0.05, end - ac.currentTime)) : v;
}

/** A one-sample impulse of value `a` (cached per context and value). */
const impCache = new WeakMap();
export function impulse(ac, a = 1) {
  let c = impCache.get(ac);
  if (!c) impCache.set(ac, (c = {}));
  if (!c[a]) { const b = ac.createBuffer(1, 2, ac.sampleRate); b.getChannelData(0)[0] = a; c[a] = b; }
  const s = ac.createBufferSource();
  s.buffer = c[a];
  return s;
}

/** A noise burst: `color` noise → filter → envelope (a, d), started at t0, peak `peak`; with a voice v it also feeds
 *  dest (default v.out) and is stopped with v. → { src, out, end } */
export function burst(ac, t0, { type = 'bandpass', f = 3200, Q = 1, a = 0.0005, d = 0.002, peak = 1, color = 'white' } = {}, v, dest = v && v.out) {
  const src = noise(ac, color), g = gn(ac);
  if (v) { g.connect(dest); v.srcs.push(src); }
  ahr(g.gain, t0, peak, a, t0 + a, t0 + a + d);
  src.connect(filt(ac, type, f, Q)).connect(g);
  src.start(t0, Math.random() * 1.5);
  src.stop(t0 + a + d + 0.02);
  return { src, out: g, end: t0 + a + d + 0.02 };
}

/** Stereo-decorrelated exponentially decaying noise, one-pole high-passed (hp Hz) or low-passed (lp Hz).
 *  decaySec = time to −60 dB (SPEC IR) unless tau is given (seconds, e^−t/τ). */
export function makeIR(ac, seconds, { decaySec = seconds, tau = 0, hp = 120, lp = 0 } = {}) {
  const sr = ac.sampleRate, n = Math.floor(sr * seconds), buf = ac.createBuffer(2, n, sr);
  const k = tau ? Math.exp(-1 / (tau * sr)) : Math.exp(-6.91 / (decaySec * sr));
  const ah = Math.exp(-2 * Math.PI * hp / sr), al = lp ? Math.exp(-2 * Math.PI * lp / sr) : 0;
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let px = 0, py = 0, g = 1;
    for (let i = 0; i < n; i++) {
      const x = (Math.random() * 2 - 1) * g;
      g *= k;
      py = lp ? (1 - al) * x + al * py : ah * (py + x - px);
      px = x;
      d[i] = py;
    }
  }
  return buf;
}

/** A private convolver on `buf`, energy-normalised (1 / √Σ IR², cached): its output has ≈ the input's level.
 *  → { input, output } */
const irNorm = new WeakMap();
export function irGain(buf) {
  let g = irNorm.get(buf);
  if (g == null) {
    let s = 0;
    for (const x of buf.getChannelData(0)) s += x * x;
    irNorm.set(buf, (g = s > 0 ? 1 / Math.sqrt(s) : 1));
  }
  return g;
}
export function conv(ac, buf) {
  const c = ac.createConvolver();
  c.normalize = false;
  c.buffer = buf;
  return { input: c, output: c.connect(gn(ac, irGain(buf))) };
}

/** True for an OfflineAudioContext (QA renders): live schedulers then plan everything up front. */
export function offline(ac) { return typeof OfflineAudioContext !== 'undefined' && ac instanceof OfflineAudioContext; }

/** A LIVE voice shell: out (gain 0) → [pan] → E.bus[busName]. stop(ms = rel) fades out and stops v.srcs.
 *  Owners call set(params) per frame (no allocation) and stop() when done. → { alive, srcs, out, pn, k, stop } */
export function shell(E, busName = 'fx', withPan = false, rel = 200) {
  const ac = E.ctx, out = gn(ac, 0), pn = withPan ? pan(ac, 0) : null, head = pn ? (out.connect(pn), pn) : out;
  head.connect(E.bus[busName] || E.bus.fx);
  const v = { alive: true, srcs: [], out, pn, k: pn ? Math.SQRT2 : 1, set() {}, stop(ms = rel) { fade(v, ac, out, head, ms, 0.02); } };
  return v;
}

/** Registers a LIVE voice with the engine's cap (as one long voice). */
export function live(E, v) { return E.track ? E.track(v, 3600) : v; }
