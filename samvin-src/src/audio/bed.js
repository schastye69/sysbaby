// audio/bed.js — WP3. The ambient bed (SPEC §9.2 ≈ −34 dB total; SPEC-ADDENDUM A6.5.2 dust layer, ДРЕЙФ, A6.5.6
// ПРОВАЛ via duck). Five layers on E.bus.bed:
//   1 beat pair 49.0 / 49.3 Hz (a 0.3 Hz beat), −34 dB
//   2 brown noise low-passed at 140·(900/140)^((alt + 1090)/2180) Hz (NADIR 140 → SIGNAL 900), −42 dB;
//     SIGNAL adds a wind band: pink noise BP 600 Hz Q 0.5 with a 0.07 Hz LFO, −40 dB
//   3 room drone: root −38 dB + fifth −44 dB, LP 400 Hz, riding the world breath ±2 dB
//   4 rank harmonics 98 / 147 / 196 Hz at −42 dB each, added at ranks 2, 3, 4
//   5 «ЗЕРНО ВОЗДУХА» dust (grammar.makeDust) at −56 dB; INSIGNIA −58; night −3 dB + LP 7 kHz, drift 0.02 Hz; pointer
//     > 200 px/s: −3 dB for 600 ms; ДРЕЙФ 0.03 → 0.06 → 0.03 Hz at 2,800…6,800 ms after the ignition. Never > −40 dB.
// duck(db, ms) moves layers 1–4 only (INSIGNIA −60 over 960 ms; ПРОВАЛ −80 over 12 ms and back): the dust stays — the
// air remains while the bed holds its breath. Night: every bed frequency ×0.75 (down a fourth) and −3 dB.
// narrow(u) (SIGNAL «Голос»): everything folds into one 220 Hz tone and reopens.
import { db2gain, osc, noise, filt, gn, windBand } from './synth.js';
import { makeDust } from './recipes/grammar.js';
import { ROOMS } from '../world/rooms.js';
import { breath } from '../core/clock.js';
import { bus } from '../core/bus.js';
import { input } from '../core/input.js';

const lpFor = (alt) => 140 * Math.pow(900 / 140, (alt + 1090) / 2180);
const RANK_HZ = [98.0, 147.0, 196.0];
const DRIFT = { drift: 0.03 };   // reused (no per-frame allocation)

/** @returns {Bed} */
export function createBed(E) {
  const ac = E.ctx;
  let n = null;                  // the node set (built on start, dropped on stop)
  let acc = 0, pollAcc = 0, duckUntil = 0, igniteAt = -1, drift = 0.03, lastDrift = -1, ov = null, ovUntil = 0;
  // the cleared grain circle is cleared air: pointer > 200 px/s → dust −3 dB for 600 ms (event-driven, frame-rate free)
  if (input.observe) input.observe((q) => { if (q.speed > 200) duckUntil = ac.currentTime + 0.6; });
  const T = () => ac.currentTime;
  const to = (prm, v, tau) => prm.setTargetAtTime(v, ac.currentTime, tau);

  function build() {
    const g = (v) => gn(ac, v);
    const o = { out: g(0), duck: g(db2gain(bed.duckDb)), narrow: g(1 - bed.narrowU), srcs: [] };
    o.duck.connect(o.out);
    o.narrow.connect(o.duck);
    o.out.connect(E.bus.bed);
    // 1 beat pair
    o.beat = [osc(ac, 49.0), osc(ac, 49.3)];
    const bg = g(db2gain(-34));
    for (const x of o.beat) x.connect(bg);
    bg.connect(o.narrow);
    // 2 brown noise by altitude + SIGNAL wind
    const br = noise(ac, 'brown');
    o.lp = filt(ac, 'lowpass', bed.lpHz, 0.707);
    br.connect(o.lp).connect(g(db2gain(-42))).connect(o.narrow);
    o.wind = g(bed.room === 'SIGNAL' ? 1 : 0);
    o.wind.connect(o.narrow);
    const wsrc = windBand(ac, o.wind, db2gain(-40));
    // 3 drone
    o.root = osc(ac, bed.root); o.fifth = osc(ac, bed.root * 1.5);
    const dl = filt(ac, 'lowpass', 400);
    o.drone = g(1);
    o.root.connect(g(db2gain(-38))).connect(dl);
    o.fifth.connect(g(db2gain(-44))).connect(dl);
    dl.connect(o.drone).connect(o.narrow);
    // 4 rank harmonics
    o.rank = RANK_HZ.map((f, i) => { const x = osc(ac, f), rg = g(bed.rank >= i + 1 ? db2gain(-42) : 0); x.connect(rg).connect(o.narrow); o.srcs.push(x); return rg; });
    o.rankOsc = o.srcs.slice();
    // «Голос»: one 220 Hz tone
    o.tone = osc(ac, 220);
    o.toneG = g(bed.narrowU * db2gain(-38));
    o.tone.connect(o.toneG).connect(o.duck);
    // 5 dust (its own path to the bed bus: not ducked)
    o.dustLp = filt(ac, 'lowpass', bed.night ? 7000 : 20000, 0.707);
    o.dustG = g(1 - bed.narrowU);
    o.dustLp.connect(o.dustG).connect(o.out);
    o.dust = makeDust(E, { level01: dustLevel(), drift: bed.night ? 0.02 : 0.03 }, false, o.dustLp);
    o.srcs.push(...o.beat, br, o.root, o.fifth, o.tone);
    const t = T();
    for (const s of o.srcs) { if (s.loop) s.start(t, Math.random() * 1.5); else s.start(t); }
    o.srcs.push(...wsrc);
    return o;
  }

  const nightK = () => (bed.night ? 0.75 : 1);
  const dustLevel = () => (bed.room === 'INSIGNIA' ? 0 : 1 / 9);   // −58 / −56 dB
  function tune(tau = 0.03) {
    if (!n) return;
    const k = nightK();
    to(n.beat[0].frequency, 49.0 * k, tau);
    to(n.beat[1].frequency, 49.3 * k, tau);
    to(n.root.frequency, bed.root * k, tau);
    to(n.fifth.frequency, bed.root * 1.5 * k, tau);
    for (let i = 0; i < 3; i++) to(n.rankOsc[i].frequency, RANK_HZ[i] * k, tau);
  }

  const bed = {
    room: 'CORE', root: 146.83, night: false, rank: 0, duckDb: 0, narrowU: 0, lpHz: lpFor(0), on: false,
    start() {
      if (n) return;
      n = build();
      bed.on = true;
      tune(0.001);
      to(n.out.gain, db2gain(bed.night ? -3 : 0), 0.5);
    },
    stop() {
      if (!n) return;
      const o = n, t = T();
      n = null; bed.on = false;
      o.out.gain.cancelScheduledValues(t);
      to(o.out.gain, 0, 0.08);
      for (const s of o.srcs) { try { s.stop(t + 0.6); } catch (e) { /* stopped */ } }
      try { o.dust.stop(400); } catch (e) { /* gone */ }
      setTimeout(() => { try { o.out.disconnect(); } catch (e) { /* gone */ } }, 800);
    },
    setRoom(roomId) {
      const m = ROOMS[roomId];
      if (!m) return;
      bed.room = roomId;
      bed.root = m.root;
      bed.lpHz = lpFor(m.alt);
      if (!n) return;
      to(n.lp.frequency, bed.lpHz, 0.3);
      to(n.wind.gain, roomId === 'SIGNAL' ? 1 : 0, 0.5);
      if (!ov || ov.level01 == null) n.dust.set({ level01: dustLevel() });
      tune(0.25);
    },
    setRootGlide(fromHz, toHz, u) {
      const a = +fromHz || bed.root, b = +toHz || a, x = Math.max(0, Math.min(1, +u || 0));
      bed.root = a * Math.pow(b / a, x);
      if (n) { const k = nightK(); to(n.root.frequency, bed.root * k, 0.02); to(n.fifth.frequency, bed.root * 1.5 * k, 0.02); }
    },
    setNight(b) {
      bed.night = !!b;
      if (!n) return;
      tune(0.6);
      to(n.out.gain, db2gain(bed.night ? -3 : 0), 0.4);
      to(n.dustLp.frequency, bed.night ? 7000 : 20000, 0.4);
    },
    setRank(i) {
      bed.rank = Math.max(0, Math.min(3, i | 0));
      if (n) for (let k = 0; k < 3; k++) to(n.rank[k].gain, bed.rank >= k + 1 ? db2gain(-42) : 0, 0.5);
    },
    duck(db, ms) {
      bed.duckDb = Math.min(0, +db || 0);
      if (!n) return;
      const p = n.duck.gain, t = T(), d = Math.max(0, +ms || 0) / 1000, v = db2gain(bed.duckDb);
      if (typeof p.cancelAndHoldAtTime === 'function') p.cancelAndHoldAtTime(t); else { p.cancelScheduledValues(t); p.setValueAtTime(p.value, t); }
      if (d > 0) p.exponentialRampToValueAtTime(Math.max(1e-6, v), t + d); else p.setValueAtTime(v, t);
    },
    narrow(u) {
      bed.narrowU = Math.max(0, Math.min(1, +u || 0));
      if (!n) return;
      const t = T();
      to(n.narrow.gain, 1 - bed.narrowU, 0.03);
      to(n.dustG.gain, 1 - bed.narrowU, 0.03);
      to(n.toneG.gain, bed.narrowU * db2gain(-38), 0.03);
    },
    /** Caller override of the dust layer (A2.1.1 boot −48 dB drift 0; A6.5.7 release drift 0.10 Hz 1,600 ms; the
     *  fold −40 dB drift 0.12): `{level01?, drift?, ms?}` holds for `ms` (none: until `dust(null)`), then the bed's own
     *  values return. level01 maps −58 + 18·level01 dB (1/9 = −56, 0.556 = −48, 1 = −40, the ceiling). */
    dust(o) {
      ov = o || null; ovUntil = o && o.ms > 0 ? T() + o.ms / 1000 : Infinity; lastDrift = -1;
      if (n) n.dust.set({ level01: o && o.level01 != null ? o.level01 : dustLevel(), drift: o && o.drift != null ? o.drift : drift });
    },
    update(dt) {
      if (!n) return;
      if (ov && T() >= ovUntil) bed.dust(null);
      acc += dt; pollAcc += dt;
      if (acc < 1 / 30) return;
      acc = 0;
      const t = T();
      // the drone rides the world breath ±2 dB
      to(n.drone.gain, db2gain(2 * (2 * breath.value - 1)), 0.06);
      to(n.dustG.gain, (1 - bed.narrowU) * (t < duckUntil ? db2gain(-3) : 1), 0.05);
      // ДРЕЙФ after the ignition
      const base = bed.night ? 0.02 : 0.03, x = igniteAt >= 0 ? t - igniteAt : -1;
      drift = x >= 2.8 && x <= 6.8 ? base + 0.03 * Math.sin((Math.PI * (x - 2.8)) / 4) : base;
      if ((!ov || ov.drift == null) && Math.abs(drift - lastDrift) > 0.0015) { lastDrift = DRIFT.drift = drift; n.dust.set(DRIFT); }
      // late buffers (dustA right after unlock, dustB after boot) attach outside any gate
      if (pollAcc > 0.5 && !(E.chain && E.chain.closed && E.chain.closed())) { pollAcc = 0; n.dust.poll(); }
    },
  };
  bus.on('boot:ignite', () => { igniteAt = T(); });
  // QA readouts (dev builds only): the dust level in dB (peak, incl. night), the rendered buffers, the node set, the
  // total bed gain re nominal (ПРОВАЛ, INSIGNIA duck).
  if (__DEV__) {
    Object.assign(bed, {
      dustDb: () => (n ? -58 + 18 * n.dust.level01 + 20 * Math.log10(Math.max(1e-9, n.dustG.gain.value * n.out.gain.value)) : -120),
      buffers: () => (E.buf ? Object.keys(E.buf) : []),
      _n: () => n,
      levelDb: () => (n ? 20 * Math.log10(Math.max(1e-9, n.duck.gain.value * n.out.gain.value)) : -120),
    });
  }
  return bed;
}
