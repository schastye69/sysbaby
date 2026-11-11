// host/dom.js — WP13's small DOM helpers (textContent only; no innerHTML anywhere in WP13).
import { app } from '../core/store.js';
import { ENV } from '../core/env.js';
import { fmtDate } from '../core/ru.js';
import { tween } from '../core/clock.js';

/** el('p', 't-body', 'text', parent, { qa: 'x', aria: 'label' }) → HTMLElement */
export function el(tag, cls, text, parent, attrs) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = String(text);
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'qa') n.setAttribute('data-qa', String(v));
      else if (k === 'aria') n.setAttribute('aria-label', String(v));
      else n.setAttribute(k, v === true ? '' : String(v));
    }
  }
  if (parent) parent.appendChild(n);
  return n;
}

/** A verb button (.verb LABEL, ≥ 44 px hit area by base.css). */
export function verb(label, parent, qa, onActivate, cls) {
  const b = el('button', `verb t-label${cls ? ` ${cls}` : ''}`, label, parent, { qa, type: 'button' });
  if (onActivate) b.addEventListener('click', (e) => { e.stopPropagation(); onActivate(e); });
  return b;
}

export const reduced = () => !!ENV.reducedMotion;
export const isT0 = () => app.tier === 'T0';
/** dd.mm.yyyy of an ISO time or a day key */
export const dmy = (iso) => fmtDate(iso, 'dd.mm.yyyy');
/** dd.mm */
export const dm = (iso) => fmtDate(iso, 'dd.mm');
export const two = (n) => String(Math.max(0, n | 0)).padStart(2, '0');
/** Promise that resolves after ms of wall-clock time (used only where the SPEC times a beat against the picture). */
export const wait = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms | 0)));
/** pan (−1 … 1) from a screen x */
export const panOf = (x) => {
  const w = (typeof innerWidth === 'number' && innerWidth > 0) ? innerWidth : 1440;
  const p = (x / w) * 2 - 1;
  return Number.isFinite(p) ? Math.max(-1, Math.min(1, p)) : 0;
};

/** JS-driven opacity fade on loop time (CSS opacity transitions only start on a committed compositor frame, which a
 *  software-GL frame can delay by hundreds of ms; a tween keeps the SPEC duration on every device). → Promise */
const fades = new WeakMap();
export function fade(node, to, ms = 240) {
  if (!node) return Promise.resolve();
  const prev = fades.get(node);
  if (prev) prev.cancel();
  const from = node.style.opacity === '' ? (to > 0 ? 0 : 1) : +node.style.opacity;
  if (!(ms > 0)) { node.style.opacity = String(to); return Promise.resolve(); }
  const tw = tween(reduced() ? 160 : ms, (x) => { node.style.opacity = String(from + (to - from) * x); });
  fades.set(node, tw);
  return tw.done;
}
