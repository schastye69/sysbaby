// ui/dims.js — construction-drawing dimension lines (ARCH §3.12.2, §6.1.6 A1; SPEC §2.3): a 0.5 px --slate line
// offset perpendicular to the measured span, 4 px extension lines, 6 px open arrowheads, the MICRO value centred in
// a 4 px gap. Ends are RENDER-space points (a/b getters, no allocation) projected every frame at ORDER.OVERLAY; writes
// are SVG `d` + label transform only (no layout reads). Labels: span.t-micro.dim-label[data-owner] in #overlay.
import { Vector3 } from 'three';
import { rig } from '../render/cameraRig.js';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { LAYOUT, TIMING } from '../core/tokens.js';
import { keepout } from './keepout.js';
import { fontsReady } from '../core/fonts.js';

const SVG = 'http://www.w3.org/2000/svg';
const items = [];
let leadersEl = null, overlayEl = null, uid = 0;
const _a = new Vector3(), _b = new Vector3();
const pa = { x: 0, y: 0, depth: 0, visible: false }, pb = { x: 0, y: 0, depth: 0, visible: false };
const D = LAYOUT.dims;
const f1 = (v) => v.toFixed(1);

function geometry(d) {
  d.a(_a); d.b(_b);
  rig.project(_a, pa); rig.project(_b, pb);
  if (pa.depth <= 0 || pb.depth <= 0) return false;
  let dx = pb.x - pa.x, dy = pb.y - pa.y;
  const len = Math.hypot(dx, dy);
  if (len < 8) return false;
  dx /= len; dy /= len;
  // Perpendicular toward the requested side (screen space; y down).
  let nx = -dy, ny = dx;
  const s = d.side;
  if ((s === 'left' && nx > 0) || (s === 'right' && nx < 0) || (s === 'above' && ny > 0) || (s === 'below' && ny < 0)) { nx = -nx; ny = -ny; }
  const o = d.offset;
  if (!Number.isFinite(o + pa.x + pa.y + pb.x + pb.y + d.at)) return false;   // never a NaN path
  const ax = pa.x + nx * o, ay = pa.y + ny * o, bx = pb.x + nx * o, by = pb.y + ny * o;
  // The value sits at d.at along the line (½ = centred; an owner moves it aside when the centre is taken).
  const tl = len * d.at, mx = ax + dx * tl, my = ay + dy * tl;
  // The line breaks behind its own value (a construction drawing never draws through its figures): the gap is the
  // label's real box (measured once per text) projected on the line's direction, plus 2 px of air either side.
  if (d.lw <= 0) measure(d);
  const half = Math.min(len / 2 - 2, Math.abs(dx) * d.lw * 0.5 + Math.abs(dy) * d.lh * 0.5 + 2);
  // …and where it crosses the object itself (setBreak: e.g. the exploded Key's tip reaching through it).
  let g0 = Math.max(0, tl - half), g1 = Math.min(len, tl + half), h0 = 0, h1 = 0;
  if (d.bh > 0) {
    h0 = Math.max(0, len * d.bt - d.bh); h1 = Math.min(len, len * d.bt + d.bh);
    if (h1 >= g0 && h0 <= g1) { g0 = Math.min(g0, h0); g1 = Math.max(g1, h1); h0 = h1 = 0; }
    else if (h0 > g1) { const t0 = g0, t1 = g1; g0 = h0; g1 = h1; h0 = t0; h1 = t1; }
  }
  // pieces: [0, first gap) · (between gaps) · (last gap, len]
  const f0 = h1 > h0 ? h0 : g0, f1_ = h1 > h0 ? h1 : g1;
  let segs = `M${f1(ax)} ${f1(ay)}L${f1(ax + dx * f0)} ${f1(ay + dy * f0)}`;
  if (h1 > h0) segs += `M${f1(ax + dx * f1_)} ${f1(ay + dy * f1_)}L${f1(ax + dx * g0)} ${f1(ay + dy * g0)}`;
  segs += `M${f1(ax + dx * g1)} ${f1(ay + dy * g1)}L${f1(bx)} ${f1(by)}`;
  const A = D.arrowPx, e = D.extPx;
  // Extension lines run from near the object out past the dimension line by 4 px.
  const p = `M${f1(pa.x + nx * 4)} ${f1(pa.y + ny * 4)}L${f1(ax + nx * e)} ${f1(ay + ny * e)}`
    + `M${f1(pb.x + nx * 4)} ${f1(pb.y + ny * 4)}L${f1(bx + nx * e)} ${f1(by + ny * e)}`
    + segs
    // open arrowheads (±30°) at both ends
    + `M${f1(ax + (dx * 0.866 - dy * 0.5) * A)} ${f1(ay + (dy * 0.866 + dx * 0.5) * A)}L${f1(ax)} ${f1(ay)}`
    + `L${f1(ax + (dx * 0.866 + dy * 0.5) * A)} ${f1(ay + (dy * 0.866 - dx * 0.5) * A)}`
    + `M${f1(bx - (dx * 0.866 - dy * 0.5) * A)} ${f1(by - (dy * 0.866 + dx * 0.5) * A)}L${f1(bx)} ${f1(by)}`
    + `L${f1(bx - (dx * 0.866 + dy * 0.5) * A)} ${f1(by - (dy * 0.866 - dx * 0.5) * A)}`;
  if (p !== d.lastD) { d.lastD = p; d.path.setAttribute('d', p); }
  d.label.style.transform = `translate3d(${f1(mx)}px,${f1(my)}px,0) translate(-50%,-50%)`;
  keepout.set(d.kid, mx - d.lw * 0.5, my - d.lh * 0.5, mx + d.lw * 0.5, my + d.lh * 0.5);
  return true;
}

/** One layout read per label text (and after the fonts land): the label's box incl. its --dim-gap padding. */
function measure(d) {
  let w = 0, h = 0;
  try { w = d.label.offsetWidth; h = d.label.offsetHeight; } catch (e) { /* detached */ }
  d.lw = w > 0 ? w : d.label.textContent.length * 7 + 2 * D.gapPx;
  d.lh = h > 0 ? h : 12;
}

function frame() {
  if (!rig.camera) return;
  for (let i = 0; i < items.length; i++) {
    const d = items[i];
    const on = d.visible && geometry(d);
    if (!on) keepout.off(d.kid);
    if (on !== d.shown) {
      d.shown = on;
      d.g.classList.toggle('is-hidden', !on);
      d.label.classList.toggle('is-hidden', !on);
    }
  }
}

export const dims = {
  init(ctx) {
    void ctx;
    leadersEl = document.getElementById('leaders');
    overlayEl = document.getElementById('overlay');
    loop.add(frame, ORDER.OVERLAY);
    fontsReady().then(() => { for (const d of items) d.lw = 0; });
    return dims;
  },

  /** → { setVisible(b), drawIn(ms = 240) → Promise, setLabel(s), remove() } */
  add(opts) {
    const owner = String(opts.owner || 'anon');
    const g = document.createElementNS(SVG, 'g');
    g.setAttribute('class', 'dim is-hidden');
    g.dataset.owner = owner;
    const path = document.createElementNS(SVG, 'path');
    path.setAttribute('pathLength', '1');
    g.appendChild(path);
    const label = document.createElement('span');
    label.className = 't-micro dim-label is-hidden';
    label.dataset.owner = owner;
    if (leadersEl) leadersEl.appendChild(g);
    if (overlayEl) overlayEl.appendChild(label);
    const d = {
      owner, a: opts.a, b: opts.b, side: opts.side || 'right', offset: opts.offset != null ? opts.offset : D.offsetPx,
      g, path, label, visible: true, shown: false, lastD: '', lw: 0, lh: 0, kid: `dim:${owner}:${uid++}`, at: 0.5, bt: 0.5, bh: 0,
    };
    const setLabel = (s) => { const t = String(s || ''); if (label.textContent !== t) { label.textContent = t; d.lw = 0; } };
    setLabel(opts.label);
    items.push(d);
    const api = {
      setVisible(b) { d.visible = !!b; },
      /** px between the measured span and the dimension line (perpendicular, toward `side`). */
      setOffset(px) { d.offset = px; },
      /** where the value sits along the line, 0…1 (default ½) */
      setLabelAt(t) { d.at = Math.max(0.12, Math.min(0.88, t)); },
      /** an extra break (the line passes behind the object): centred at fraction t, half-length px (0 = none) */
      setBreak(t, halfPx) { d.bt = t; d.bh = Math.max(0, halfPx); },
      get offset() { return d.offset; },
      drawIn(ms = TIMING.dimsDraw) {
        path.classList.remove('is-drawing');
        path.style.strokeDasharray = '1';
        path.style.strokeDashoffset = '1';
        label.style.opacity = '0';
        return new Promise((res) => {
          requestAnimationFrame(() => {
            path.classList.add('is-drawing');
            path.style.transitionDuration = `${ms}ms`;
            path.style.strokeDashoffset = '0';
            after(ms, () => { label.style.opacity = ''; res(); });
          });
        });
      },
      setLabel,
      remove() {
        const k = items.indexOf(d);
        if (k >= 0) items.splice(k, 1);
        keepout.off(d.kid);
        if (g.parentNode) g.parentNode.removeChild(g);
        if (label.parentNode) label.parentNode.removeChild(label);
      },
    };
    d.api = api;
    return api;
  },

  clear(owner) {
    for (let i = items.length - 1; i >= 0; i--) if (items[i].owner === owner) items[i].api.remove();
  },
};
