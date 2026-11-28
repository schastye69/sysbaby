// audio/prerender.js — «ЗАГОТОВКИ», buffers rendered once (ARCH-ADDENDUM X§2.3.4; SPEC-ADDENDUM A6.2, exact content).
// OWNER: WP3. One OfflineAudioContext per rendered item, sequential, built from the same synth.js primitives the live
// recipes use (bells, reverse tails); the purely arithmetic buffers (dust, digiTail, irTight) are computed directly. The engine renders 'dustA'
// right after unlock and the rest one item per idle slot after boot:done. T1 renders 'dustA' only. Until a buffer
// exists its recipe falls back to silence (reverse tails: to nothing) while the picture twin still runs.
import { fmBell, osc, makeIR, irGain, gn, part, ahr, xr } from './synth.js';
import { bus } from '../core/bus.js';

export const PRERENDER_ORDER = ['dustA', 'bellSam', 'bellVin', 'rev.sam', 'rev.vin', 'rev.lock', 'rev.thud', 'digiTail', 'irTight', 'dustB'];

/** Renders `sec` seconds of `ch` channels with build(oc) → AudioBuffer. */
function render(sr, ch, sec, build) {
  const oc = new OfflineAudioContext(ch, Math.ceil(sec * sr), sr);
  build(oc);
  return oc.startRendering();
}

/** Scales every channel so the peak sits at `db` dBFS. */
function normalize(buf, db) {
  let pk = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > pk) pk = a; } }
  const k = pk > 0 ? Math.pow(10, db / 20) / pk : 1;
  for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
  return buf;
}

/** dustA / dustB — particle air: Poisson grains at 140/s, 0.4–1.4 ms white noise × Hann, bandpass 4.5–11 kHz Q 2,
 *  gain log-uniform −24…0 dB, pan ±0.9 (equal power); peak −6 dBFS. Prime-ratio lengths 1.73 s / 2.31 s.
 *  Computed sample by sample (the Web Audio bandpass biquad, RBJ, and the StereoPanner law written out): ≈1 ms of
 *  main-thread work instead of ≈1,000 offline nodes, so dustA is ready well inside 100 ms of the unlock. */
function dust(ac, sec) {
  const sr = ac.sampleRate, n = Math.ceil(sec * sr), b = ac.createBuffer(2, n, sr), L = b.getChannelData(0), R = b.getChannelData(1);
  let t = -Math.log(1 - Math.random()) / 140;
  while (t < sec - 0.004) {
    const m = Math.max(4, Math.floor((0.0004 + Math.random() * 0.001) * sr)), i0 = Math.floor(t * sr);
    const w0 = (2 * Math.PI * (4500 + Math.random() * 6500)) / sr, al = Math.sin(w0) / 4, a0 = 1 + al;   // Q 2 → α = sin ω / 2Q
    const b0 = al / a0, a1 = (-2 * Math.cos(w0)) / a0, a2 = (1 - al) / a0;
    const g = Math.pow(10, (-24 * Math.random()) / 20), x = ((Math.random() * 2 - 1) * 0.9 + 1) / 2;
    const gl = g * Math.cos((x * Math.PI) / 2), gr = g * Math.sin((x * Math.PI) / 2);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let k = 0, len = m + Math.floor(0.004 * sr); k < len && i0 + k < n; k++) {
      const xi = k < m ? (Math.random() * 2 - 1) * (0.5 - 0.5 * Math.cos((2 * Math.PI * k) / (m - 1))) : 0;
      const y = b0 * xi - b0 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = xi; y2 = y1; y1 = y;
      L[i0 + k] += y * gl; R[i0 + k] += y * gr;
    }
    t += -Math.log(1 - Math.random()) / 140;
  }
  return normalize(b, -6);
}

/** bellSam / bellVin — the SPEC §9.3 FM bells dry (ratio 1.4, index 3 → 0 over 1.2 s, attack 8 ms, decay 2.4 s). */
const bellOut = (oc, f) => fmBell(oc, f, 1.4, 3, 0, 2.4, 1.2, 0.008).out;
function bellBuf(sr, f) {
  return render(sr, 1, 1.6, (oc) => bellOut(oc, f).connect(oc.destination)).then((b) => normalize(b, -6));
}

/** The four reverse-tail sources, dry (rendered inside the reverse render). */
const SOURCES = {
  sam: (oc) => bellOut(oc, 392.0),
  vin: (oc) => bellOut(oc, 587.33),
  lock: (oc) => {                       // the arrival-lock pair at the CORE root (×2, ×3; upper +5 Hz → exact over 240 ms)
    const g = gn(oc);
    ahr(g.gain, 0, 0.5, 0.006, 0.36, 0.48);
    for (const f of [293.66, 440.49]) { const o = osc(oc, f); if (f > 300) xr(o.frequency, f + 5, f, 0, 0.24); o.connect(g); o.start(0); o.stop(0.5); }
    return g;
  },
  thud: (oc) => {                       // the 42 Hz thud (sine, 300 ms)
    const g = gn(oc);
    part(oc, 42, 0, g, 1, 0.004, 0.3 / 6.91, 0.32);
    return g;
  },
};

/** rev.* — the source through the 3.4 s IR, wet only; first 700 ms, reversed, x² fade-in over the first 40 %, −12 dBFS. */
function reverse(E, sr, key) {
  return render(sr, 2, 0.7, (oc) => {
    const c = oc.createConvolver();
    c.normalize = false;
    const live = E.wet && E.wet.convA && E.wet.convA.buffer && E.wet.convA.buffer.sampleRate === sr ? E.wet.convA.buffer : null;
    c.buffer = live || makeIR(oc, 3.4);
    const g = gn(oc, irGain(c.buffer));
    SOURCES[key](oc).connect(c).connect(g).connect(oc.destination);
  }).then((b) => {
    const n = b.length, f = Math.floor(n * 0.4);
    for (let c = 0; c < b.numberOfChannels; c++) {
      const d = b.getChannelData(c);
      d.reverse();
      for (let i = 0; i < f; i++) { const x = i / f; d[i] *= x * x; }
    }
    return normalize(b, -12);
  });
}

/** digiTail — six 40 ms slices of the locked beat-to-lock pair (196.00 + 293.66 Hz); slice k sample-and-held every
 *  [1,2,4,8,16,32][k] samples and quantised to [4096,64,16,8,4,3][k] levels (round(x·L/2)/(L/2)); 2 ms edge fades are
 *  applied before the hold/quantiser, so every output sample is one of the slice's levels. */
function digiTail(ac) {
  const sr = ac.sampleRate, sl = Math.round(0.04 * sr), n = sl * 6, b = ac.createBuffer(1, n, sr), d = b.getChannelData(0);
  const HOLD = [1, 2, 4, 8, 16, 32], LEV = [4096, 64, 16, 8, 4, 3], fd = Math.round(0.002 * sr);
  for (let k = 0; k < 6; k++) {
    const h = HOLD[k], q = LEV[k] / 2;
    let held = 0;
    for (let j = 0; j < sl; j++) {
      const i = k * sl + j;
      if (j % h === 0) {
        const t = i / sr, e = Math.min(1, j / fd, (sl - 1 - j) / fd);
        held = 0.45 * (Math.sin(2 * Math.PI * 196.0 * t) + Math.sin(2 * Math.PI * 293.66 * t)) * Math.max(0, e);
      }
      d[i] = Math.round(held * q) / q;
    }
  }
  return b;
}

/** irTight — a small room: stereo-decorrelated noise × e^(−t/70 ms), LP 5 kHz, 0.35 s. */
function irTight(ac) { return makeIR(ac, 0.35, { tau: 0.07, lp: 5000 }); }

// E._fl: { name: Promise } — each buffer is rendered once

function make(E, name) {
  const ac = E.ctx, sr = ac.sampleRate;
  if (name === 'dustA') return dust(ac, 1.73);
  if (name === 'dustB') return dust(ac, 2.31);
  if (name === 'bellSam') return bellBuf(sr, 392.0);
  if (name === 'bellVin') return bellBuf(sr, 587.33);
  if (name === 'digiTail') return digiTail(ac);
  if (name === 'irTight') return irTight(ac);
  return reverse(E, sr, name.slice(4));
}

/** Fills E.buf[name] for each name (A6.2 exact content); T1: only 'dustA'. → Promise<void>
 *  After boot:done the engine asks for the rest one name per idle slot. Idle slots are scarce exactly when the GPU is
 *  busiest, so the first such call starts every remaining item at once: the bells and reverse tails render off the
 *  main thread (OfflineAudioContext, concurrently), the arithmetic buffers cost ≈1 ms each; later calls find their
 *  buffer ready or in flight. */
export function prerender(E, names) {
  if (!E || !E.ctx) return Promise.resolve();
  if (!E.buf) E.buf = {};
  const fl = E._fl || (E._fl = {});
  // the unlock call (dustA) also arms the rest for boot:done with an idle deadline (300 ms), so a busy GPU cannot starve it
  if (names + '' === 'dustA') bus.on('boot:done', () => { const go = () => prerender(E, PRERENDER_ORDER); if (typeof requestIdleCallback === 'function') requestIdleCallback(go, { timeout: 300 }); else setTimeout(go, 200); });
  const want = (x) => PRERENDER_ORDER.indexOf(x) >= 0 && !E.buf[x] && (E.tier !== 'T1' || x === 'dustA');
  let list = (Array.isArray(names) ? names : []).filter(want);
  if (list.some((x) => x !== 'dustA')) list = PRERENDER_ORDER.filter((x) => (x !== 'dustA' || list.indexOf(x) >= 0) && want(x));
  return Promise.all(list.map((name) => fl[name] || (fl[name] = Promise.resolve()
    .then(() => (E.buf[name] ? null : make(E, name)))
    .then((b) => { if (b) E.buf[name] = b; })
    .catch(() => { /* silent-safe: the recipe stays silent */ })))).then(() => {});
}
