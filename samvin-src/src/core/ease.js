// core/ease.js — easing & scalar helpers (ARCH §3.1.3). `bezier` and `EASE` come from tokens.js (ARCH §5.3).
import { cubicBezier, EASINGS } from './tokens.js';

/** (x1, y1, x2, y2) → (x:0..1) => y — CSS cubic-bezier semantics, allocation-free per call. */
export const bezier = cubicBezier;

/** camera bezier(0.7,0,0.15,1) · reveal bezier(0.16,1,0.3,1) · phosphor bezier(0.2,0,0,1) · linear · sine */
export const EASE = Object.freeze({ ...EASINGS });

export function clamp01(x) { return x <= 0 ? 0 : x >= 1 ? 1 : x; }
export function lerp(a, b, t) { return a + (b - a) * t; }
/** Hermite smoothstep (GLSL semantics). */
export function smoothstep(e0, e1, x) {
  if (e0 === e1) return x < e0 ? 0 : 1;
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
/** Maps x from [a0, a1] to [b0, b1]; clamped to the target range unless clamp = false. */
export function remap(x, a0, a1, b0, b1, clamp = true) {
  if (a0 === a1) return b0;
  let t = (x - a0) / (a1 - a0);
  if (clamp) t = clamp01(t);
  return b0 + (b1 - b0) * t;
}
