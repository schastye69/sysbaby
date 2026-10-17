// audio/recipes/ui.js — WP3. Locks, notes and UI (SPEC §9.4; §9.6 flinch). Every recipe here is a UI-bus recipe: its
// pitch follows E.transpose (−5 semitones while ИЗНАНКА is on, S08). Pans are positional (hover tick by screen x) or
// centred (A6.4). Reactive sounds: they fire now (no latency compensation, A6.3); planned callers pass `when`.
import { STRATUM_NOTE } from '../notes.js';
import { db2gain, osc, filt, fmBell, voice, add, finish, burst, tr, ad, ahr, gn, part, modal, hit, xr, lr, tone as tn, lockPair } from '../synth.js';


const N6 = 1.75;   // peak of Σ sin(kωt)/k, k = 1…6 (a struck modal note) re its fundamental

/** A short sine tone (attack 0.5 ms, linear release) into v.out, stopped with the voice. */
function tone(ac, v, f, s, dur, peak = 1) {
  ahr(tn(v, ac, f, s)[1].gain, s, peak, 0.0005, s + Math.max(0.001, dur * 0.4), s + dur);
}

/** hoverTick { x } — 1.8 kHz sine, 6 ms, −30 dB, pan (x/w·2 − 1)·0.6. */
export function hoverTick(E, p = {}) {
  const w = (typeof window !== 'undefined' && window.innerWidth) || 1440;
  const x = p.x != null && isFinite(+p.x) ? +p.x : w / 2;
  const v = voice(E, p, { bus: 'ui', db: -30, pan: Math.max(-0.6, Math.min(0.6, (x / w * 2 - 1) * 0.6)), panNode: true });
  tone(E.ctx, v, 1800 * tr(E), v.t, 0.006);
  return finish(E, v, v.t + 0.012);
}

/** select {} — 2 ms noise (HP 4 kHz) + a 900 Hz sine for 20 ms, −24 dB. */
export function select(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'ui', db: -24 }), t = v.t;
  burst(ac, t, { type: 'highpass', f: 4000, Q: 0.707, a: 0.0002, d: 0.0018, peak: 0.55 }, v);
  tone(ac, v, 900 * tr(E), t, 0.02, 0.55);
  return finish(E, v, t + 0.03);
}

let tickN = 0, tickAt = -1;
/** tick { n? } — detents, telescoping, irises, boundaries: 2.2 kHz, 3 ms, +2 % per consecutive tick, −28 dB.
 *  Without n, consecutive ticks (< 250 ms apart) count up by themselves (max 12). */
export function tick(E, p = {}) {
  const ac = E.ctx, now = ac.currentTime;
  if (p.n != null && isFinite(+p.n)) tickN = Math.max(0, +p.n | 0);
  else tickN = now - tickAt < 0.25 ? Math.min(12, tickN + 1) : 0;
  tickAt = now;
  const v = voice(E, p, { bus: 'ui', db: -28 });
  tone(ac, v, 2200 * Math.pow(1.02, tickN) * tr(E), v.t, 0.003);
  return finish(E, v, v.t + 0.008);
}

/** stringPluck { root } — edge strings: modal on root × 4, decay 900 ms, −24 dB. */
export function stringPluck(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'ui', db: -24 }), g = gn(ac, 1 / N6);
  g.connect(v.out);
  return finish(E, v, modal(ac, (+p.root || 146.83) * 4 * tr(E), v.t, 0.9, 1, 6, g));
}

/** lockedThud {} — 120 Hz sine through LP 600 Hz, 140 ms, −18 dB. Never a buzzer. */
export function lockedThud(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'ui', db: -18 }), t = v.t, lp = filt(ac, 'lowpass', 600);
  lp.connect(v.out);
  ad(tn(v, ac, 120 * tr(E), t, lp)[1].gain, t, 1, 0.004, 0.14 / 5);
  return finish(E, v, t + 0.16);
}

/** chisel {} — each typed key: noise BP 5 kHz, 6 ms, pitch ±8 % random, −26 dB. */
export function chisel(E, p = {}) {
  return hit(E, p, { bus: 'ui', db: -26 }, { type: 'bandpass', f: 5000 * (0.92 + Math.random() * 0.16) * tr(E), Q: 4, a: 0.0005, d: 0.0055, peak: 2.8 }, 0.012);
}

/** stratumNote { i, quiet? } — S A M • V I N = G4 A4 B4 D5 E5 G5 A5: modal partials 1–6 at 1/n, decays 1,200 → 200 ms,
 *  −18 dB (desktop hover: −30 dB). */
export function stratumNote(E, p = {}) {
  const ac = E.ctx, i = Math.max(0, Math.min(6, +p.i | 0)), v = voice(E, p, { bus: 'ui', db: p.quiet ? -30 : -18 }), g = gn(ac, 1 / N6);
  g.connect(v.out);
  return finish(E, v, modal(ac, STRATUM_NOTE[i] * tr(E), v.t, 1.2, 1, 6, g));
}

/** memberNote { hz } — from member.note: modal, decay 2.0 s, −16 dB. */
export function memberNote(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'room', db: -16, wet: 0.08 }), g = gn(ac, 1 / N6);
  g.connect(v.out);
  return finish(E, v, modal(ac, (+p.hz || 392) * tr(E), v.t, 2.0, 1, 6, g));
}

/** workshopNode { hz } — that node's pentatonic note as a short bell (decay 400 ms), −22 dB. */
export function workshopNode(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'ui', db: -22 }), g = gn(ac, 1 / 1.3);
  g.connect(v.out);
  return finish(E, v, modal(ac, (+p.hz || 392) * tr(E), v.t, 0.4, 1, 3, g));
}

/** wordBell { root } — a typed recognised word: root plus fifth bell (two octaves up), −18 dB. */
export function wordBell(E, p = {}) {
  const ac = E.ctx, f = (+p.root || 146.83) * 4 * tr(E), v = voice(E, p, { bus: 'ui', db: -18 - 5, wet: 0.15 }), t = v.t;
  const a = fmBell(ac, f, 1.4, 2, t, 1.6, 0.8), b = fmBell(ac, f * 1.5, 1.4, 2, t + 0.012, 1.6, 0.8);
  a.out.connect(v.out); b.out.connect(v.out);
  add(v, a, b);
  return finish(E, v, b.end);
}

/** arrivalLock { root, when? } — a beat-to-lock miniature on every hall arrival: sines root × 2 and root × 3, the upper
 *  +5 Hz sharp gliding to exact over 240 ms, 480 ms in all, −22 dB; plus a 48 Hz sine thud, 160 ms, −14 dB. */
export function arrivalLock(E, p = {}) {
  const ac = E.ctx, k = tr(E), r = (+p.root || 146.83) * k, v = voice(E, p, { bus: 'ui', db: 0, wet: 0.1 }), t = v.t;
  lockPair(v, ac, r * 2, r * 3, 5, 0.24, t, v.out, db2gain(-22) / 2, 0.008, 0.36, 0.48);
  add(v, part(ac, 48, t, v.out, db2gain(-14), 0.004, 0.16 / 5, 0));
  return finish(E, v, t + 0.49);
}

/** flinch {} — a 4 ms tick plus a "huff" (noise LP 400 Hz, 120 ms), −26 dB. */
export function flinch(E, p = {}) {
  const ac = E.ctx, v = voice(E, p, { bus: 'ui', db: -26 }), t = v.t;
  tone(ac, v, 2400 * tr(E), t, 0.004, 1);
  burst(ac, t + 0.004, { type: 'lowpass', f: 400 * tr(E), Q: 0.707, a: 0.025, d: 0.095, peak: 2.6 }, v);
  return finish(E, v, t + 0.13);
}
