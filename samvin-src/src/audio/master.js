// audio/master.js — «МАСТЕР-ЦЕПЬ», the one insert chain after the compressor (ARCH-ADDENDUM X§2.3.3; SPEC-ADDENDUM
// A6.1, binding). OWNER: WP3.
//
//   COMPRESSOR ─┬──────────────────────────────────────────────────────────────┐
//               └→ SHADOW: LP 120 ×2 → |x| (WaveShaper, 2× oversample) → HP 90 → BP 200 Q 0.9 → g_sh ─┤ (sum)
//   → MUFFLE: lowshelf 110 Hz → lowpass (20 kHz open · 260 Hz Q 1.1 blocked) → makeup
//   → TAPE:   DelayNode (max 2 s), delayTime follows t²/(2T) on a tape stop (pitch 1 → 0 linearly)
//   → WIDTH:  splitter → [a b; b a] → R-side Haas delay (fine pointers only) → merger    (L′+R′ = L+R for any w)
//   → GATE:   the only node allowed to produce digital silence (ПАУЗА 0.4, СВЁРТКА zero)
//   → output (the engine's master gain −6 dBFS → analyser → destination)
//
// gate(at) also swaps the A/B convolvers (A6.1.3): the live one's input and return close over the 6 ms that end at `at`,
// the idle one opens at `at` — it has heard only silence, so no tail from before the pause returns after the hit.
// Nothing here creates a node after construction except pop()'s popClick (scheduled outside the gate window).
import { db2gain, filt, gn, lr } from './synth.js';
import { popClick } from './recipes/grammar.js';
import { PRERENDER_ORDER } from './prerender.js';
// QA affordance: the dev build exposes this module as __SAMVIN_DEV__.mods.audioMaster; the offline bed checks need the
// bed factory without an unlocked context.
export { createBed } from './bed.js';

const LOG_BLOCK = Math.log(20000 / 260);
const SH_CAL = 7.5;   // dB: shadow peak re the sub peak with g_sh = 1 is ≈ −7.5 dB

/** @returns {Chain} */
export function createMasterChain(E, input /* the compressor */, output /* the master gain */) {
  const ac = E.ctx;
  const gain = (v) => gn(ac, v);
  const now = () => ac.currentTime;
  const st = { w: 1, gateAt: -1, hitAt: -1, shadowDb: E.coarse ? -12 : -26, muffle: 20000 };

  // ── SHADOW (A6.1.2): even harmonics of the sub-120 Hz content, kept around 200 Hz, so a phone speaker "hears" the
  // 48 Hz thump. A full-wave rectifier is homogeneous (|a·x| = a·|x|): the harmonic ratio does not depend on level.
  const lp1 = filt(ac, 'lowpass', 120, 0.707), lp2 = filt(ac, 'lowpass', 120, 0.707);
  const ws = ac.createWaveShaper();
  const curve = new Float32Array(4097);
  for (let i = 0; i < curve.length; i++) curve[i] = Math.abs(i / 2048 - 1);
  ws.curve = curve;
  ws.oversample = '2x';
  const hp = filt(ac, 'highpass', 90, 0.707), bp = filt(ac, 'bandpass', 200, 0.9);
  // Calibrated on the 42 Hz thud: the rectifier + filters land ≈ −7.5 dB below the sub peak, so g_sh = gainDb + 7.5.
  const gsh = gain(db2gain(st.shadowDb + SH_CAL));
  input.connect(lp1).connect(lp2).connect(ws).connect(hp).connect(bp).connect(gsh);

  // ── MUFFLE (A6.1.1)
  const shelf = filt(ac, 'lowshelf', 110);
  const mlp = filt(ac, 'lowpass', 20000, 0.707), mk = gain(1);
  input.connect(shelf);
  gsh.connect(shelf);
  shelf.connect(mlp).connect(mk);

  // ── TAPE (A6.1.1) — explicit stereo so a mono mix is up-mixed before the width matrix.
  const tape = ac.createDelay(2.0);
  tape.delayTime.value = 0;
  tape.channelCount = 2; tape.channelCountMode = 'explicit'; tape.channelInterpretation = 'speakers';
  mk.connect(tape);

  // ── WIDTH (A6.1.1)
  const sp = ac.createChannelSplitter(2), mg = ac.createChannelMerger(2);
  const ll = gain(1), rl = gain(0), lrg = gain(0), rr = gain(1), haas = ac.createDelay(0.05);
  tape.connect(sp);
  sp.connect(ll, 0); sp.connect(rl, 1); sp.connect(lrg, 0); sp.connect(rr, 1);
  ll.connect(mg, 0, 0); rl.connect(mg, 0, 0);
  lrg.connect(haas); rr.connect(haas); haas.connect(mg, 0, 1);

  // ── GATE
  const gate = gain(1);
  mg.connect(gate).connect(output);

  const nodes = [lp1, lp2, ws, hp, bp, gsh, shelf, mlp, mk, tape, sp, ll, rl, lrg, rr, haas, mg, gate];

  /** Holds a param at its value at time t (cancelAndHold where supported) before new automation. */
  function hold(p, t, v) {
    if (typeof p.cancelAndHoldAtTime === 'function') p.cancelAndHoldAtTime(t);
    else { p.cancelScheduledValues(t); p.setValueAtTime(v, t); }
  }
  const T = (o) => Math.max(now(), o && isFinite(o.at) && o.at !== null ? +o.at : 0);
  /** Every param of `list` [[param, value]…] moves from its value at t to `value`: linear over d, or a step. */
  const move = (list, t, d) => { for (const [p, v] of list) { hold(p, t, p.value); if (d > 0) p.linearRampToValueAtTime(v, t + d); else p.setValueAtTime(v, t); } };

  function muffle(hzv, ms = 0, o = {}) {
    const t = T(o), d = Math.max(0, +ms || 0) / 1000, f = Math.max(40, Math.min(20000, +hzv || 20000));
    const b = Math.max(0, Math.min(1, Math.log(20000 / f) / LOG_BLOCK)), shelfDb = o && o.shelfDb != null ? o.shelfDb : 7;
    const q = 0.707 + (1.1 - 0.707) * b, sg = shelfDb * b, m = db2gain(-3 * b);
    hold(mlp.frequency, t, st.muffle);
    if (d > 0) mlp.frequency.exponentialRampToValueAtTime(f, t + d); else mlp.frequency.setValueAtTime(f, t);
    move([[mlp.Q, q], [shelf.gain, sg], [mk.gain, m]], t, d);
    st.muffle = f;
  }

  function width(w, ms = 0, o = {}) {
    const t = T(o), d = Math.max(0, +ms || 0) / 1000, ww = Math.max(0, Math.min(2, +w));
    const a = (1 + ww) / 2, b = (1 - ww) / 2, hz = E.coarse ? 0 : Math.max(0, Math.min(14, +(o && o.haasMs) || 0)) / 1000;
    move([[ll.gain, a], [rr.gain, a], [lrg.gain, b], [rl.gain, b], [haas.delayTime, hz]], t, d);
    st.w = ww;
  }

  const fx = {
    gate(ms = 400, o = {}) {
      const a = T(o), hit = a + Math.max(0.004, (+ms || 400) / 1000), g = gate.gain, a6 = Math.max(now(), a - 0.006);
      g.cancelScheduledValues(a6);
      lr(g, 1, 0, a6, a - a6);
      g.setValueAtTime(0, hit - 0.002);
      g.linearRampToValueAtTime(1, hit);
      // A/B convolver swap at `a`
      const W = E.wet;
      if (W && W.inA) {
        const live = W.live === 'B' ? 'B' : 'A', idle = live === 'A' ? 'B' : 'A';
        const ci = W['in' + live].gain, cr = W['ret' + live].gain, ni = W['in' + idle].gain, nr = W['ret' + idle].gain;
        for (const p of [ci, cr]) { hold(p, a6, 1); p.linearRampToValueAtTime(0, a); }
        for (const p of [ni, nr]) { p.cancelScheduledValues(Math.max(now(), a - 0.007)); p.setValueAtTime(0, Math.max(now(), a - 0.007)); p.setValueAtTime(1, a); }
        W.live = idle;
      }
      st.gateAt = a; st.hitAt = hit;
      return { hitAt: hit };
    },
    advanceHit(at) {
      const n = now();
      if (!(st.hitAt > n)) return null;
      // input during the ПАУЗА: the reopen (and the hit cue) moves to max(at, now + 30 ms) — never before the close
      const hit = Math.min(st.hitAt, Math.max(+at || 0, n + 0.03, st.gateAt + 0.004)), g = gate.gain, c = Math.max(n, st.gateAt);
      g.cancelScheduledValues(c + 1e-4);
      if (n >= st.gateAt) g.setValueAtTime(0, n);
      g.setValueAtTime(0, Math.max(c, hit - 0.002));
      g.linearRampToValueAtTime(1, hit);
      st.hitAt = hit;
      return hit;
    },
    muffle,
    pop(ms = 700, o = {}) {
      const t = T(o), end = t + Math.max(0, +ms || 0) / 1000;
      muffle(20000, ms, { at: t });
      try { popClick(E, { when: end }); } catch (e) { /* silent-safe */ }
      return end;
    },
    width,
    tape(stopMs = 900, o = {}) {
      const t = T(o), Ts = Math.max(0.05, (+stopMs || 900) / 1000), c = new Float32Array(128);
      for (let i = 0; i < 128; i++) { const x = (i * Ts) / 127; c[i] = (x * x) / (2 * Ts); }
      tape.delayTime.cancelScheduledValues(t);
      tape.delayTime.setValueCurveAtTime(c, t, Ts);
    },
    tapeReset(o = {}) {
      const t = T(o);
      tape.delayTime.cancelScheduledValues(t);
      tape.delayTime.setValueAtTime(0, t);
    },
    shadow(gainDb) {
      st.shadowDb = +gainDb;
      gsh.gain.setTargetAtTime(db2gain(st.shadowDb + SH_CAL), now(), 0.02);
    },
    snapshot() {
      const need = E.tier === 'T1' ? ['dustA'] : PRERENDER_ORDER;
      let ready = !!E.buf;
      if (ready) for (const n of need) if (!E.buf[n]) { ready = false; break; }
      return { muffleHz: Math.round(mlp.frequency.value), width: st.w, buffersReady: ready };
    },
  };

  return {
    fx,
    postGate: gate,
    /** true while the gate is closing, closed or reopening (no node creation, no rhythmic scheduling then). */
    closed(t = now(), pre = 0) { return t >= st.gateAt - 0.006 - pre && t <= st.hitAt; },
    dispose() {
      try { input.disconnect(lp1); input.disconnect(shelf); } catch (e) { /* gone */ }
      for (const n of nodes) { try { n.disconnect(); } catch (e) { /* gone */ } }
    },
  };
}
