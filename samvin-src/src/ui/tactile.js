// ui/tactile.js — touch ripple + vibration (ARCH §3.12.6, SPEC §2.7, §10.3).
import { ENV } from '../core/env.js';

export const VIBE = Object.freeze({ tap: 8, tick: 6, stratum: 7, lock: 14, step: 20, activation: [8, 40, 8, 40, 14, 90, 30],
  shard: [8, 40, 8, 40, 60], locked: [10, 30, 10] });

const MAX_RIPPLES = 6;
let live = 0;

/** 1 px --silver ring 0 → 48 px over 260 ms at (x, y) CSS px in #fx (input calls it on every touch-down on #gl). */
export function ripple(x, y) {
  const fx = document.getElementById('fx');
  if (!fx || live >= MAX_RIPPLES) return;
  const el = document.createElement('div');
  el.className = 'ripple';
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  if (ENV.reducedMotion) el.classList.add('ripple--still');
  live++;
  const done = () => { live--; el.remove(); };
  el.addEventListener('animationend', done, { once: true });
  setTimeout(() => { if (el.isConnected) done(); }, 600);   // safety net (animation suppressed / tab hidden)
  fx.appendChild(el);
}

/** Guarded navigator.vibrate. */
export function vibrate(pattern) {
  try { if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (e) { /* ignore */ }
}
