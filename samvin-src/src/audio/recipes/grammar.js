// audio/recipes/grammar.js — WP3. «ЗВУКОВАЯ ГРАММАТИКА»: the 18 time-grammar / founder recipes (ARCH-ADDENDUM X§2.3.5;
// SPEC-ADDENDUM A6.5.5 exact synthesis, A6.5.4 reverse tails, A6.5.7 sub-pulse, A6.5.8 mixing targets, A11.4 pair).
// Pan law (A6.4): positional (sborCall/sborAnswer/guestBurn/lost*: the caller's screen x), grammar (latch gen 1 spread,
// digiTail steps, dust drift, bondThread glide) or centred (rescue, popClick, fold, echoes). No fixed pan for a person.
import { STRATUM_NOTE } from '../notes.js';
import { audio } from '../engine.js';
import { db2gain, osc, noise, filt, pan as panNode, fmBell, voice, add, finish, impulse, burst, conv, at, offline, hit, ad, ahr, gn, part, modal, bell, xr, lr } from '../synth.js';

const RD = (x, d) => (x == null || !isFinite(+x) ? d : +x);
const P1 = (x) => Math.max(-1, Math.min(1, RD(x, 0)));

/** latch — «защёлка». gen 1 (dry, a click of the lock): a 1-sample impulse (+0.9) + a 4,200 Hz sine burst of 6 ms
 *  (τ 1.2 ms) through HP 1.5 kHz, −22 dB, no send. gen 2 (system commits only): 1,180 Hz 22 ms (τ 6 ms) + 2,950 Hz at
 *  −9 dB rel (τ 3 ms) + a 2 ms click LP 3 kHz, through the private irTight room at 45 % + a 12 % main send, −20 dB.
 *  Pitch +3 % per consecutive n. */
export function latch(E, p = {}) {
  const ac = E.ctx, gen = p.gen === 2 ? 2 : 1, k = Math.pow(1.03, RD(p.n, 0));
  const v = voice(E, p, { bus: 'ui', db: gen === 1 ? -22 : -20, pan: RD(p.pan, 0), panNode: true, wet: gen === 2 ? 0.12 : 0 });
  const t = v.t;
  if (gen === 1) {
    const hp = filt(ac, 'highpass', 1500, 0.707), im = impulse(ac, 0.9), o = osc(ac, 4200 * k), g = gn(ac);
    g.gain.setValueAtTime(0.75, t);
    g.gain.setTargetAtTime(0, t, 0.0012);
    im.connect(hp); o.connect(g).connect(hp); hp.connect(v.out);
    im.start(t); o.start(t);
    add(v, im, o);
    return finish(E, v, t + 0.012);
  }
  const dry = gn(ac), a = osc(ac, 1180 * k), b = osc(ac, 2950 * k), ga = gn(ac), gb = gn(ac);
  ga.gain.setValueAtTime(0.62, t); ga.gain.setTargetAtTime(0, t, 0.006); ga.gain.setValueAtTime(0, t + 0.022);
  gb.gain.setValueAtTime(0.62 * db2gain(-9), t); gb.gain.setTargetAtTime(0, t, 0.003);
  a.connect(ga).connect(dry); b.connect(gb).connect(dry);
  burst(ac, t, { type: 'lowpass', f: 3000, Q: 0.707, d: 0.002, peak: 0.3 }, v, dry);
  a.start(t); b.start(t);
  add(v, a, b);
  dry.connect(v.out);
  if (E.buf && E.buf.irTight) {
    const r = conv(ac, E.buf.irTight), w = gn(ac, 0.45);
    dry.connect(r.input); r.output.connect(w).connect(v.out);
  }
  return finish(E, v, t + 0.4);
}

/** reverseTail — the event's own reverb arriving before it: plays the last `ms` of E.buf['rev.'+src] so that its end
 *  lands exactly on endAt: start(endAt − ms/1000, 0.7 − ms·rate/1000, ms·rate/1000) at playbackRate = rate. The span
 *  swells x² into the landing (the picture twin's brightness curve, A6.5.9) and peaks at gainDb. */
export function reverseTail(E, p = {}) {
  const ac = E.ctx, b = E.buf && E.buf['rev.' + p.src];
  if (!b || p.endAt == null || !isFinite(+p.endAt)) return null;
  const rate = Math.max(0.25, RD(p.rate, 1)), dur = Math.max(0.01, RD(p.ms, 300) / 1000), n = ac.currentTime;
  const len0 = Math.min(b.duration, dur * rate), st0 = +p.endAt - len0 / rate, off0 = b.duration - len0;
  let st = st0, off = off0, len = len0;
  if (st < n) { const skip = (n - st) * rate; off += skip; len -= skip; st = n; }
  if (len <= 0.003) return null;
  // the level that puts the enveloped span's peak at gainDb (≤ 34k samples per channel; planned calls only)
  const sr = b.sampleRate, i0 = Math.floor(off0 * sr), N = len0 * sr;
  let pk = 1e-9;
  for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = i0; i < d.length; i++) { const x = (i - i0) / N, a = Math.abs(d[i]) * x * x; if (a > pk) pk = a; } }
  const v = voice(E, { when: st }, { bus: 'fx', db: RD(p.gainDb, -22) - 20 * Math.log10(pk), pan: RD(p.pan, 0) });
  const s = ac.createBufferSource(), g = gn(ac), sw = new Float32Array(16), sec = len / rate;
  for (let i = 0; i < 16; i++) { const x = ((st - st0) + (i / 15) * sec) / (len0 / rate); sw[i] = x * x; }
  g.gain.setValueCurveAtTime(sw, st, sec);
  s.buffer = b;
  s.playbackRate.value = rate;
  s.connect(g).connect(v.out);
  s.start(st, off, len);
  add(v, s);
  return finish(E, v, st + sec + 0.005);
}

/** popClick — a soft pressure release: a 1-sample impulse through LP 1 kHz at −32 dB + an 80 Hz sine for 30 ms at
 *  −30 dB (its shadow carries it on phones). Centred. */
export function popClick(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: 0 }), t = v.t;
  const im = impulse(ac, 1), lp = filt(ac, 'lowpass', 1000, 0.707), gi = gn(ac, db2gain(-32) * ac.sampleRate / (0.456 * 2 * Math.PI * 1000));
  // LP impulse-response peak → −32 dB
  im.connect(lp).connect(gi).connect(v.out);
  const o = osc(ac, 80), g = gn(ac);
  ahr(g.gain, t, db2gain(-30), 0.003, t + 0.022, t + 0.03);
  o.connect(g).connect(v.out);
  im.start(t); o.start(t);
  add(v, im, o);
  return finish(E, v, t + 0.04);
}

/** foldNoise — СВЁРТКА 0–400 ms: white noise → LP 2.5 kHz Q 0.5, −50 → −28 dB (linear gain) over 400 ms, held into
 *  the tape stop (the gate closes on it at 1,300 ms). */
export function foldNoise(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: 0 }), t = v.t, s = noise(ac, 'white'), g = gn(ac);
  lr(g.gain, db2gain(-50) * 1.03, db2gain(-28) * 1.03, t, 0.4);
  lr(g.gain, db2gain(-28) * 1.03, 0, t + 1.3, 0.03);
  s.connect(filt(ac, 'lowpass', 2500, 0.5)).connect(g).connect(v.out);
  s.start(t);
  add(v, s);
  return finish(E, v, t + 1.34);
}

/** digiTail — E.buf.digiTail at −20 dB through a StereoPanner stepped per 40 ms slice (slice 5 centred). */
export function digiTail(E, p = {}) {
  const ac = E.ctx, b = E.buf && E.buf.digiTail;
  if (!b) return null;
  const pans = Array.isArray(p.pans) && p.pans.length ? p.pans : [0, -0.2, 0.4, -0.6, 0.8, 0];
  const v = voice(E, p, { bus: 'fx', db: -23, panNode: true }), t = v.t, s = ac.createBufferSource();
  if (v.head.pan) for (let k = 0; k < 6; k++) v.head.pan.setValueAtTime(k === 5 ? 0 : P1(pans[k]), t + 0.04 * k);
  s.buffer = b;
  s.connect(v.out);
  s.start(t);
  add(v, s);
  return finish(E, v, t + b.duration + 0.005);
}

/** subRise — RECALL, the DIVE backwards: sine 30 → 120 Hz exponential over 240–1,000 ms, −14 dB, 120 ms release. */
export function subRise(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: -14 }), t = v.t, o = osc(ac, 30), g = gn(ac);
  xr(o.frequency, 30, 120, t + 0.24, 0.76);
  ahr(g.gain, t + 0.24, 1, 0.06, t + 1.0, t + 1.12);
  o.connect(g).connect(v.out);
  o.start(t + 0.24);
  add(v, o);
  return finish(E, v, t + 1.13);
}

/** The thump's body (sine 96 → 48 Hz exponential over 120 ms, attack 4 ms, decay 900 ms) into `dest`. → osc */
export function thumpBody(ac, t, dest, peak = 1) {
  const o = part(ac, 96, t, dest, peak, 0.004, 0.9 / 6.91, 1.0);
  xr(o.frequency, 96, 48, t, 0.12);
  return o;
}

/** Sends `src` 100 % (wet) or `wet` (plus dry) into the 6 s whale IR; returns nothing. */
function longRoom(E, src, dest, wet, dry = 0) {
  const ac = E.ctx;
  if (dry) src.connect(gn(ac, dry)).connect(dest);
  const ir = E.irLong;
  if (!ir) return;
  const r = conv(ac, ir), w = gn(ac, wet);
  src.connect(r.input); r.output.connect(w).connect(dest);
}

/** farEcho — the echo from the 300 m wall: the thump re-synthesised through LP 300 Hz into E.irLong (100 % wet,
 *  stereo-decorrelated), audible at `when` (the caller plans hit + 2·dist/343 s). −22 dB. */
export function farEcho(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'fx', db: RD(p.gainDb, -22) + 9 }), t = v.t, lp = filt(ac, 'lowpass', 300, 0.707);
  add(v, thumpBody(ac, t, lp, 1));
  longRoom(E, lp, v.out, 1, 0);
  return finish(E, v, t + 6.2);
}

/** farBoom — ИСТОК: sine 60 → 32 Hz over 400 ms + a 200 ms noise burst LP lpHz, into E.irLong at 60 %;
 *  −20 dB + 10·log10(300/dist). */
export function farBoom(E, p = {}) {
  const ac = E.ctx, dist = Math.max(1, RD(p.dist, 300));
  const v = voice(E, p, { bus: 'fx', db: -18 + 10 * Math.log10(300 / dist) }), t = v.t, mix = gn(ac);
  const o = part(ac, 60, t, mix, 0.75, 0.006, 0.4 / 4.6, 0);
  xr(o.frequency, 60, 32, t, 0.4);
  burst(ac, t, { type: 'lowpass', f: RD(p.lpHz, 180), Q: 0.707, a: 0.004, d: 0.196, peak: 0.6 }, v, mix);
  add(v, o);
  longRoom(E, mix, v.out, 0.6, 1);
  return finish(E, v, t + 6.2);
}

/** debrisKnock — NADIR first entry (Phase C): n × (sine 90 Hz 80 ms + 3 ms noise), 60 ms apart, LP 400 Hz, −26 dB,
 *  40 % into E.irLong. */
export function debrisKnock(E, p = {}) {
  const ac = E.ctx, n = Math.max(1, Math.min(12, RD(p.n, 5) | 0)), v = voice(E, p, { bus: 'fx', db: -23.5 }), t = v.t;
  const lp = filt(ac, 'lowpass', 400, 0.707);
  for (let i = 0; i < n; i++) {
    const s = t + i * 0.06, o = part(ac, 90, s, lp, 0.7, 0.003, 0.08 / 4.6, 0.1);
    burst(ac, s, { type: 'lowpass', f: 2000, d: 0.003, peak: 0.5 }, v, lp);
    add(v, o);
  }
  longRoom(E, lp, v.out, 0.4, 1);
  return finish(E, v, t + n * 0.06 + 6.1);
}

/** bondThread — СБОР: sine 1,320 → 880 Hz exponential over ms (480; 960 for «в пути»), −30 dB, pan gliding from → to. */
export function bondThread(E, p = {}) {
  const ac = E.ctx, d = Math.max(0.05, RD(p.ms, 480) / 1000);
  const v = voice(E, p, { bus: 'ui', db: -30, pan: RD(p.panFrom, 0), panNode: true }), t = v.t, o = osc(ac, 1320), g = gn(ac);
  xr(o.frequency, 1320, 880, t, d);
  ahr(g.gain, t, 1, 0.012, t + d - 0.04, t + d);
  if (v.head.pan) lr(v.head.pan, P1(p.panFrom), P1(p.panTo), t, d);
  o.connect(g).connect(v.out);
  o.start(t);
  add(v, o);
  return finish(E, v, t + d + 0.01);
}

/** sborCall — the founder's call: FM bell on hz (ratio 1.4, index 3 → 0 over 0.8 s, decay 1.6 s), then the same on
 *  hz × 1.5 at +180 ms; −14 dB; pan = his column's screen x; 30 % send. */
export function sborCall(E, p = {}) {
  const ac = E.ctx, f = RD(p.hz, 392), v = voice(E, p, { bus: 'room', db: -17.5, pan: RD(p.pan, 0), panNode: true, wet: 0.3 }), t = v.t;
  const a = fmBell(ac, f, 1.4, 3, t, 1.6, 0.8), b = fmBell(ac, f * 1.5, 1.4, 3, t + 0.18, 1.6, 0.8);
  a.out.connect(v.out); b.out.connect(v.out);
  add(v, a, b);
  return finish(E, v, b.end);
}

/** sborAnswer — a member answers: on = the member-note modal at −18 dB; way = the same with a 400 ms linear attack at
 *  −20 dB; rest = a 1.8 kHz sine 6 ms at −32 dB + the modal note at hz/2, −30 dB. Positional pan. */
export function sborAnswer(E, p = {}) {
  const ac = E.ctx, f = RD(p.hz, 392), kind = p.kind === 'way' || p.kind === 'rest' ? p.kind : 'on';
  const v = voice(E, p, { bus: 'room', db: 0, pan: RD(p.pan, 0), panNode: true, wet: 0.2 }), t = v.t, g = gn(ac);
  g.connect(v.out);
  let end;
  if (kind === 'rest') {
    const o = osc(ac, 1800), e = gn(ac);
    ahr(e.gain, t, db2gain(-32), 0.001, t + 0.005, t + 0.006);
    o.connect(e).connect(v.out); o.start(t); add(v, o);
    g.gain.value = db2gain(-30) / 1.75;
    end = modal(ac, f / 2, t + 0.02, 2.0, 1, 6, g);
  } else if (kind === 'way') {
    lr(g.gain, 0, db2gain(-20) / 1.75, t, 0.4);
    end = modal(ac, f, t, 2.4, 1, 6, g);
  } else {
    g.gain.value = db2gain(-18) / 1.75;
    end = modal(ac, f, t, 2.0, 1, 6, g);
  }
  return finish(E, v, end);
}

/** guestBurn — a guest's name burns into the rim: FM bell (ratio 1.4, index 2 → 0 over 0.9 s, decay 2.0 s), −16 dB. */
export function guestBurn(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'room', db: -16, pan: RD(p.pan, 0), panNode: true, wet: 0.25 }), t = v.t;
  const b = fmBell(ac, RD(p.hz, 392), 1.4, 2, t, 2.0, 0.9);
  b.out.connect(v.out);
  add(v, b);
  return finish(E, v, b.end);
}

/** lostChirp — ПОТЕРЯШКА: G6 then B6, 40 ms each, 30 ms apart, −30 dB (night: a fourth lower). */
export function lostChirp(E, p = {}) {
  const ac = E.ctx, k = p.night ? 0.75 : 1, v = voice(E, p, { bus: 'ui', db: -30, pan: RD(p.pan, 0), panNode: true }), t = v.t;
  [1567.98, 1975.53].forEach((f, i) => {
    const s = t + i * 0.07, o = osc(ac, f * k), g = gn(ac);
    ahr(g.gain, s, 1, 0.004, s + 0.032, s + 0.04);
    o.connect(g).connect(v.out); o.start(s); o.stop(s + 0.045);
    add(v, o);
  });
  return finish(E, v, t + 0.12);
}

/** lostHide — a soft huff: noise LP 400 Hz, 120 ms, −30 dB. */
export function lostHide(E, p = {}) {
  return hit(E, p, { bus: 'ui', db: -30, pan: RD(p.pan, 0), panNode: true }, { type: 'lowpass', f: 400, Q: 0.707, a: 0.02, d: 0.1, peak: 3.5 }, 0.14);
}

/** rescue — «ты не прошёл мимо»: the 7 stratum notes as short modal bells (decay 400 ms) 60 ms apart at −24 dB, then a
 *  D6 1,174.66 Hz FM bell at +480 ms, −20 dB, preceded by reverseTail('vin', rate 2) ending on it. Centred.
 *  pair (ДОГОВОРИЛИСЬ, A11.4): each stratum bell sounds with its fifth above at −27 dB. */
export function rescue(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'room', db: 0, wet: 0.18 }), t = v.t, g = gn(ac, db2gain(-24.5));
  g.connect(v.out);
  // the fifth is a cosine against the bell's sine: the pair's crest stays at −20 dBFS (sine + sine would sum to −19.4)
  const cw = p.pair ? ac.createPeriodicWave(new Float32Array([0, 1]), new Float32Array([0, 0]), { disableNormalization: true }) : null;
  for (let i = 0; i < 7; i++) {
    // a mallet run: each bar is damped −22 dB over the 20 ms before the next strike, so the run stays clean
    const s = t + 0.06 * i, f = STRATUM_NOTE[i], bg = gn(ac);
    // (the last bar, N, is damped −16 dB over 400 → 420 ms, as the D6 bell's reverse tail swells in)
    if (i < 6) lr(bg.gain, 1, 0.08, s + 0.04, 0.02);
    else lr(bg.gain, 1, 0.16, t + 0.4, 0.02);
    bg.connect(g);
    bell(ac, f, s, bg, [[1, 0.4, 1], [2, 0.24, 0.1], [3, 0.12, 0.03]], 0.002);
    if (cw) {
      const o = ac.createOscillator(), e = gn(ac);
      o.setPeriodicWave(cw);
      o.frequency.value = f * 1.5;
      ad(e.gain, s, db2gain(-3), 0.002, 0.4 / 6.91);
      o.connect(e).connect(bg);
      o.start(s); o.stop(s + 0.45);
    }
  }
  const d6 = t + 0.48, gb = gn(ac, db2gain(-20) * 0.9), b = fmBell(ac, 1174.66, 1.4, 2, d6, 1.6, 0.9);
  b.out.connect(gb).connect(v.out);
  add(v, b);
  // the D6 bell's own reverb, reversed an octave up, arrives in the 100 ms between the run and the bell
  reverseTail(E, { src: 'vin', endAt: d6, ms: 120, rate: 2.0, gainDb: -24 });
  return finish(E, v, b.end);
}

const AB = ['A', 'B'];

/** The particle air (also the bed's 5th layer): dustA (T2/T3 + dustB, both looped) → HP 3 kHz Q 0.5 → StereoPanner
 *  with a drift LFO (0–0.12 Hz, ±0.6) → E.bus.bed. level01 → −58 … −40 dB peak. Buffers attach when ready (poll). */
export function makeDust(E, p = {}, track = true, dest = E.bus.bed) {
  const ac = E.ctx, out = gn(ac), hp = filt(ac, 'highpass', 3000, 0.5), pn = panNode(ac, RD(p.pan, 0));
  const lfo = osc(ac, Math.max(0.001, RD(p.drift, 0.03))), depth = gn(ac, 0.6);
  lfo.connect(depth);
  if (pn.pan) depth.connect(pn.pan);
  lfo.start();
  hp.connect(pn).connect(out).connect(dest);
  const lvl = (l) => db2gain(-58 + 18 * Math.max(0, Math.min(1, l)) + 6);   // buffers peak at −6 dBFS
  const srcs = { A: null, B: null };
  const v = {
    alive: true, level01: RD(p.level01, 1 / 9), drift: RD(p.drift, 0.03),
    poll() {
      if (!v.alive || !E.buf) return;
      for (const k of AB) {
        const b = E.buf['dust' + k];
        if (srcs[k] || !b || (k === 'B' && E.tier === 'T1')) continue;
        const s = ac.createBufferSource(), g = gn(ac, 0.71);
        s.buffer = b; s.loop = true;
        s.connect(g).connect(hp);
        s.start(ac.currentTime + 0.01, Math.random() * b.duration);
        srcs[k] = s;
      }
    },
    set(q) {
      if (!v.alive || !q) return;
      const n = ac.currentTime;
      if (q.level01 != null) { v.level01 = +q.level01; out.gain.setTargetAtTime(lvl(v.level01), n, 0.08); }
      if (q.drift != null) { v.drift = +q.drift; lfo.frequency.setTargetAtTime(Math.max(0.001, Math.min(0.12, v.drift)), n, 0.3); }
      if (q.pan != null && pn.pan) pn.pan.setTargetAtTime(Math.max(-1, Math.min(1, +q.pan)), n, 0.05);
      v.poll();
    },
    stop(ms = 200) {
      if (!v.alive) return;
      v.alive = false;
      const n = ac.currentTime, r = Math.max(0.008, ms / 1000);
      out.gain.cancelScheduledValues(n); lr(out.gain, out.gain.value, 0, n, r);
      for (const s of [srcs.A, srcs.B, lfo]) if (s) { try { s.stop(n + r + 0.02); } catch (e) { /* stopped */ } }
    },
  };
  out.gain.value = lvl(v.level01);
  v.poll();
  return track && E.track ? E.track(v, 3600) : v;
}
export function dust(E, p) { return makeDust(E, p, true); }

/** subPulse — the hidden pulse (L6): per beat a 49 Hz sine (attack 6 ms, τ 110 ms) + 98 Hz at −8 dB rel + a 2 ms
 *  click LP 600 Hz at −30 dB rel. level01 → −52 … −28 dB. Grid periodMs from t0Perf, or `steps` (ms offsets from
 *  t0Perf). 25 ms scheduler, 100 ms look-ahead; each beat is one voice of the cap. Beats inside a gate are skipped. */
export function subPulse(E, p = {}) {
  const ac = E.ctx, out = gn(ac);
  out.connect(E.bus.fx);
  const per = Math.max(0.1, RD(p.periodMs, 900) / 1000), steps = Array.isArray(p.steps) ? p.steps.map((x) => +x / 1000) : null;
  const t0 = p.t0Perf != null && isFinite(+p.t0Perf) && !offline(ac) ? audio.fx.ctxTimeFor(+p.t0Perf) : at(E, p);
  const lvl = (l) => db2gain(-52 + 24 * Math.max(0, Math.min(1, l)));
  out.gain.value = lvl(RD(p.level01, 0.5));
  let k = 0, timer = 0;
  const beat = (s) => {
    if (E.chain && E.chain.closed && E.chain.closed(s, 0.03)) return;
    const a = part(ac, 49, s, out, 0.88, 0.006, 0.11, 0.8), b = part(ac, 98, s, out, 0.88 * db2gain(-8), 0.006, 0.11, 0.8);
    burst(ac, s, { type: 'lowpass', f: 600, d: 0.002, peak: 0.7 * db2gain(-30) * 4 }).out.connect(out);
    if (E.track) E.track({ alive: true, stop(ms = 8) { try { const n = ac.currentTime + ms / 1000; a.stop(n); b.stop(n); } catch (e) { /* gone */ } } }, s + 0.8 - ac.currentTime);
  };
  const next = () => (steps ? (k < steps.length ? t0 + steps[k] : Infinity) : t0 + k * per);
  const pump = (horizon) => {
    for (let s = next(); s <= horizon; s = next()) { if (s >= ac.currentTime - 0.005) beat(Math.max(s, ac.currentTime)); k++; }
    if (next() === Infinity) clearInterval(timer);
  };
  const v = {
    alive: true,
    set(q) { if (v.alive && q && q.level01 != null) out.gain.setTargetAtTime(lvl(+q.level01), ac.currentTime, 0.05); },
    stop(ms = 60) {
      if (!v.alive) return;
      v.alive = false;
      clearInterval(timer);
      const n = ac.currentTime;
      out.gain.cancelScheduledValues(n); lr(out.gain, out.gain.value, 0, n, Math.max(0.006, ms / 1000));
    },
  };
  if (offline(ac)) pump(t0 + (steps ? 30 : 8));
  else { pump(ac.currentTime + 0.1); timer = setInterval(() => { if (v.alive) pump(ac.currentTime + 0.1); }, 25); }
  return v;
}
