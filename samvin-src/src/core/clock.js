// core/clock.js — the world breath, loop-time timers and tweens (ARCH §3.1.3, SPEC §2.5).
// Everything here runs on loop.now, so it pauses while the tab is hidden and keeps wall-clock-exact durations on
// slow GPUs (A8).
import { ENV, logOnce } from './env.js';
import { loop, ORDER } from './loop.js';
import { BREATH } from './tokens.js';

const INHALE_FRAC = BREATH.inhaleMs / BREATH.periodMs;   // 1,800 / 4,200: the inhale share, kept when the period changes

/** One clock drives every idle motion. value: 0 = fully exhaled … 1 = fully inhaled (sine-shaped halves). */
export const breath = {
  value: 0,
  phase: 0,
  periodMs: BREATH.periodMs,
  amp: ENV.reducedMotion ? BREATH.reducedAmp : 1,
  /** Changes the period without a phase jump (normal 4,200 · drowsy 5,600 · night 7,000). */
  setPeriod(ms) { if (ms > 0) breath.periodMs = ms; },
  /** a + (b − a)·(0.5 + (value − 0.5)·amp) */
  mix(a, b) { return a + (b - a) * (0.5 + (breath.value - 0.5) * breath.amp); },
};

function breathValue(p) {
  if (p < INHALE_FRAC) return 0.5 - 0.5 * Math.cos(Math.PI * (p / INHALE_FRAC));
  return 0.5 + 0.5 * Math.cos(Math.PI * ((p - INHALE_FRAC) / (1 - INHALE_FRAC)));
}

// ─── Timers (loop time) ───────────────────────────────────────────────────────────────────────────────────────
/** @type {Map<number, {at:number, fn:Function}>} */
const timers = new Map();
let nextTimer = 1;

/** Loop-time timeout (pauses while hidden). → id */
export function after(ms, fn) {
  const id = nextTimer++;
  timers.set(id, { at: loop.now + Math.max(0, ms || 0), fn });
  return id;
}
export function cancelAfter(id) { timers.delete(id); }

/** @type {Set<{start:number, ms:number, fn:Function, ease:Function, resolve:Function, live:boolean}>} */
const tweens = new Set();

/** fn(u) every frame for ms of loop time (u eased), ending with fn(1). → { done: Promise<void>, cancel() }.
 *  cancel() stops it without the final fn(1) and resolves `done`. */
export function tween(ms, fn, ease) {
  let resolve;
  const done = new Promise((r) => { resolve = r; });
  const tw = { start: loop.now, ms: Math.max(0, ms || 0), fn, ease: ease || null, resolve, live: true };
  if (tw.ms === 0) {
    try { fn(1); } finally { resolve(); }
    return { done, cancel() {} };
  }
  tweens.add(tw);
  return {
    done,
    cancel() { if (tw.live) { tw.live = false; tweens.delete(tw); resolve(); } },
  };
}

// Module-scope scratch + callbacks: the per-frame step allocates nothing (no iterators, no closures).
const due = [];
let lastT = -1;
let curT = 0;
function collectDue(tm, id) { if (tm.at <= curT) due.push(id); }
function stepTween(tw) {
  const x = (curT - tw.start) / tw.ms;
  if (x >= 1) {
    tw.live = false;
    tweens.delete(tw);
    try { tw.fn(1); } catch (e) { logOnce('clock:tween', 'tween callback threw', e); }
    tw.resolve();
  } else {
    const u = x <= 0 ? 0 : x;
    try { tw.fn(tw.ease ? tw.ease(u) : u); } catch (e) {
      logOnce('clock:tween', 'tween callback threw', e);
      tw.live = false; tweens.delete(tw); tw.resolve();
    }
  }
}

loop.add((dt, t) => {
  curT = t;
  // Breath — advanced by loop time (not the clamped dt) so the period stays wall-clock exact at low fps.
  breath.amp = ENV.reducedMotion ? BREATH.reducedAmp : 1;
  const stepMs = lastT < 0 ? 0 : Math.max(0, t - lastT);
  lastT = t;
  breath.phase = (breath.phase + stepMs / breath.periodMs) % 1;
  breath.value = breathValue(breath.phase);

  // Timers.
  if (timers.size) {
    due.length = 0;
    timers.forEach(collectDue);
    for (let i = 0; i < due.length; i++) {
      const tm = timers.get(due[i]);
      if (!tm) continue;
      timers.delete(due[i]);
      try { tm.fn(); } catch (e) { logOnce('clock:after', 'timer callback threw', e); }
    }
  }

  // Tweens (Set.forEach visits entries added during the walk; a tween created this frame starts at x = 0).
  if (tweens.size) tweens.forEach(stepTween);
}, ORDER.CLOCK);
