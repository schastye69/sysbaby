// t0/dom.js — WP11. Small DOM / SVG helpers shared by the T0 «ЧЕРТЁЖ» modules (no layout reads, no innerHTML).
// Construction-drawing primitives: survey crosses, left ticks (the T0 replacement of leaders), dimension lines.
import { ENV } from '../core/env.js';
import { app } from '../core/store.js';

export const SVGNS = 'http://www.w3.org/2000/svg';

/** SVG element with attributes (numbers are written with 2 decimals at most). */
export function svg(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) { const v = attrs[k]; if (v != null) n.setAttribute(k, typeof v === 'number' ? fmt(v) : v); }
  if (parent) parent.appendChild(n);
  return n;
}
export function fmt(v) { return Math.abs(v) < 1e-6 ? '0' : String(Math.round(v * 100) / 100); }

/** HTML element: el('p', 't-body', 'text', parent, { qa: 'x', id: 'y' }). */
export function el(tag, cls, text, parent, opts) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null && text !== '') n.textContent = text;
  if (opts) {
    if (opts.qa) n.dataset.qa = opts.qa;
    if (opts.data) for (const k in opts.data) n.dataset[k] = opts.data[k];
    if (opts.attrs) for (const k in opts.attrs) n.setAttribute(k, opts.attrs[k]);
  }
  if (parent) parent.appendChild(n);
  return n;
}

export function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

/** A readable block with its left tick: a 7 px survey cross at the end of a 24 px hairline run (the T0 leader). */
export function block(parent, cls, opts) {
  const b = el('div', `t0-block${cls ? ` ${cls}` : ''}`, null, parent, opts);
  el('i', 't0-tick', null, b, { attrs: { 'aria-hidden': 'true' } });
  return b;
}

/** A 7 px survey cross as a DOM node (base.css .cross). */
export function cross(parent, cls) { return el('i', `cross${cls ? ` ${cls}` : ''}`, null, parent, { attrs: { 'aria-hidden': 'true' } }); }

/** SVG survey cross at (x, y), 7 px. */
export function svgCross(g, x, y, cls) {
  return svg('path', { d: `M${fmt(x - 3.5)} ${fmt(y)}h7M${fmt(x)} ${fmt(y - 3.5)}v7`, class: cls || 't0-cross' }, g);
}

/** SVG dimension line between two points with 6 px open arrowheads, 4 px extension stubs and the MICRO value centred
 *  in a 4 px gap. `vertical` puts the label rotated beside the line. → <g> */
export function dimLine(g, x1, y1, x2, y2, label, opts = {}) {
  const d = svg('g', { class: `t0-dim${opts.cls ? ` ${opts.cls}` : ''}` }, g);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
  const gap = opts.gap != null ? opts.gap : (label ? Math.min(len * 0.6, label.length * 6.4 + 8) : 0);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const a = (x, y, s) => `M${fmt(x + (ux * 6 + nx * 3) * s)} ${fmt(y + (uy * 6 + ny * 3) * s)}L${fmt(x)} ${fmt(y)}L${fmt(x + (ux * 6 - nx * 3) * s)} ${fmt(y + (uy * 6 - ny * 3) * s)}`;
  const ext = (x, y) => `M${fmt(x - nx * 4)} ${fmt(y - ny * 4)}L${fmt(x + nx * 4)} ${fmt(y + ny * 4)}`;
  const p = gap > 0
    ? `M${fmt(x1)} ${fmt(y1)}L${fmt(mx - ux * gap / 2)} ${fmt(my - uy * gap / 2)}M${fmt(mx + ux * gap / 2)} ${fmt(my + uy * gap / 2)}L${fmt(x2)} ${fmt(y2)}`
    : `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`;
  svg('path', { d: `${p}${a(x1, y1, 1)}${a(x2, y2, -1)}${ext(x1, y1)}${ext(x2, y2)}`, class: 't0-dim__l' }, d);
  if (label) {
    const vertical = Math.abs(uy) > Math.abs(ux);
    const t = svg('text', { x: mx, y: my, class: 't-micro t0-svgmicro', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, d);
    if (vertical) t.setAttribute('transform', `rotate(-90 ${fmt(mx)} ${fmt(my)})`);
    t.textContent = label;
  }
  return d;
}

/** Reduced motion is live (ENV) and T0 is always "static" for camera work. */
export const reduced = () => !!ENV.reducedMotion;
export const isT0 = () => app.tier === 'T0';

/** Sets a CSS custom property with a number (rounded). */
export function setVar(n, name, v) { n.style.setProperty(name, typeof v === 'number' ? fmt(v) : v); }

/** Seeded [0,1) generator (mulberry32) for stable drawing jitter. */
export function rand(seed) {
  let a = (seed | 0) + 0x6d2b79f5;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Glyph (7×7 edge list) as an SVG path `d` in a size×size box at (x, y) top-left. */
export function glyphPath(edges, x, y, size) {
  let d = '';
  const s = size / 6;
  for (const e of edges || []) {
    const a = e[0], b = e[1];
    d += `M${fmt(x + (a % 7) * s)} ${fmt(y + Math.floor(a / 7) * s)}L${fmt(x + (b % 7) * s)} ${fmt(y + Math.floor(b / 7) * s)}`;
  }
  return d;
}
