// core/env.js — environment facts (ARCH §3.1.3).
//
// `__DEV__` is a global boolean constant injected by build.mjs (esbuild `define`): true in `--dev` builds, false in
// production, where every `if (__DEV__) { … }` block is removed. Use it directly; never `typeof`-guard it.
/** @type {boolean} */
/* global __DEV__ */

const mm = (q) => {
  try { return typeof matchMedia === 'function' ? matchMedia(q) : null; } catch (e) { return null; }
};

const RM = mm('(prefers-reduced-motion: reduce)');
const COARSE = mm('(pointer: coarse)');
const UA = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
const MTP = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;

/** Live environment flags. `reducedMotion` and `coarse` follow their media queries. */
export const ENV = {
  reducedMotion: !!(RM && RM.matches),
  coarse: !!(COARSE && COARSE.matches),
  touch: MTP > 0,
  // iPadOS reports a Mac UA; maxTouchPoints > 1 separates it from a real Mac.
  ios: /iPad|iPhone|iPod/.test(UA) || (/Macintosh/.test(UA) && MTP > 1),
  android: /Android/i.test(UA),
};

const rmListeners = [];

function listen(mql, fn) {
  if (!mql) return;
  if (mql.addEventListener) mql.addEventListener('change', fn);
  else if (mql.addListener) mql.addListener(fn);
}

listen(RM, (e) => {
  ENV.reducedMotion = !!e.matches;
  for (let i = 0; i < rmListeners.length; i++) {
    try { rmListeners[i](ENV.reducedMotion); } catch (err) { logOnce('env:rm', 'reduced-motion listener failed', err); }
  }
});
listen(COARSE, (e) => { ENV.coarse = !!e.matches; });

/** Subscribe to prefers-reduced-motion changes. → off() */
export function onReducedMotionChange(fn) {
  rmListeners.push(fn);
  return () => { const i = rmListeners.indexOf(fn); if (i >= 0) rmListeners.splice(i, 1); };
}

const logged = new Set();
/** console.warn once per key. Never console.error (QA counts errors as failures). */
export function logOnce(key, ...args) {
  if (logged.has(key)) return;
  logged.add(key);
  try { console.warn(`[sam.vin] ${key}:`, ...args); } catch (e) { /* console missing */ }
}
