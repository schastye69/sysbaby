// core/layout.js — viewport facts (ARCH §3.1.3, SPEC §10.2).
//   phone = matchMedia('(pointer:coarse)').matches && min(w, h) ≤ 600 ; phone-land = phone && h < 500.
// Updated on resize / orientationchange (rAF-throttled, no layout reads elsewhere); emits 'layout:change' {kind, w, h}
// when anything changes. Safe areas are read from a hidden probe element styled with env(safe-area-inset-*).
import { bus } from './bus.js';
import { LAYOUT } from './tokens.js';

export const layout = {
  kind: 'desktop',
  isPhone: false,
  w: 0,
  h: 0,
  dpr: 1,
  safe: { t: 0, r: 0, b: 0, l: 0 },
};

let probe = null;
function readSafe() {
  if (typeof document === 'undefined' || !document.body) return;
  if (!probe) {
    probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
      'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    document.body.appendChild(probe);
  }
  const cs = getComputedStyle(probe);
  layout.safe.t = parseFloat(cs.paddingTop) || 0;
  layout.safe.r = parseFloat(cs.paddingRight) || 0;
  layout.safe.b = parseFloat(cs.paddingBottom) || 0;
  layout.safe.l = parseFloat(cs.paddingLeft) || 0;
}

let coarseMql = null;
function coarse() {
  try {
    if (!coarseMql) coarseMql = matchMedia('(pointer: coarse)');
    return coarseMql.matches;
  } catch (e) { return false; }
}

/** Measures now. → true when anything changed. */
export function measureLayout() {
  if (typeof window === 'undefined') return false;
  const w = Math.max(1, Math.round(window.innerWidth || document.documentElement.clientWidth || 1));
  const h = Math.max(1, Math.round(window.innerHeight || document.documentElement.clientHeight || 1));
  const phone = coarse() && Math.min(w, h) <= LAYOUT.phoneMaxShort;
  const kind = phone ? (h < LAYOUT.landMaxH ? 'phone-land' : 'phone') : 'desktop';
  const dpr = window.devicePixelRatio || 1;
  const st = layout.safe.t, sr = layout.safe.r, sb = layout.safe.b, sl = layout.safe.l;
  readSafe();
  const changed = w !== layout.w || h !== layout.h || kind !== layout.kind || dpr !== layout.dpr ||
    st !== layout.safe.t || sr !== layout.safe.r || sb !== layout.safe.b || sl !== layout.safe.l;
  layout.w = w; layout.h = h; layout.kind = kind; layout.isPhone = phone; layout.dpr = dpr;
  return changed;
}

let pending = 0;
function schedule() {
  if (pending) return;
  const run = () => {
    pending = 0;
    if (measureLayout()) bus.emit('layout:change', { kind: layout.kind, w: layout.w, h: layout.h });
  };
  pending = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(run) : setTimeout(run, 16);
}

if (typeof window !== 'undefined') {
  measureLayout();
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  try { matchMedia('(pointer: coarse)').addEventListener('change', schedule); } catch (e) { /* old Safari */ }
}
