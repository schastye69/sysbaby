// ui/dims.js — construction-drawing dimension lines (ARCH §3.12.2, §6.1.6 A1; SPEC §2.3): a 0.5 px --slate line
// offset perpendicular to the measured span, 4 px extension lines, 6 px open arrowheads, the MICRO value centred in
// a 4 px gap. Ends are RENDER-space points (a/b getters, no allocation) projected every frame at ORDER.OVERLAY; writes
// are SVG `d` + label transform only (no layout reads). Labels: span.t-micro.dim-label[data-owner] in #overlay.
import { Vector3 } from 'three';
import { rig } from '../render/cameraRig.js';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { LAYOUT, TIMING } from '../core/tokens.js';

const SVG = 'http://www.w3.org/2000/svg';
const items = [];
let leadersEl = null, overlayEl = null;
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
  const ax = pa.x + nx * o, ay = pa.y + ny * o, bx = pb.x + nx * o, by = pb.y + ny * o;
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const half = Math.min(len / 2 - 2, d.gapHalf);
  const A = D.arrowPx, e = D.extPx;
  // Extension lines run from near the object out past the dimension line by 4 px.
  const p = `M${f1(pa.x + nx * 4)} ${f1(pa.y + ny * 4)}L${f1(ax + nx * e)} ${f1(ay + ny * e)}`
    + `M${f1(pb.x + nx * 4)} ${f1(pb.y + ny * 4)}L${f1(bx + nx * e)} ${f1(by + ny * e)}`
    + `M${f1(ax)} ${f1(ay)}L${f1(mx - dx * half)} ${f1(my - dy * half)}`
    + `M${f1(mx + dx * half)} ${f1(my + dy * half)}L${f1(bx)} ${f1(by)}`
    // open arrowheads (±30°) at both ends
    + `M${f1(ax + (dx * 0.866 - dy * 0.5) * A)} ${f1(ay + (dy * 0.866 + dx * 0.5) * A)}L${f1(ax)} ${f1(ay)}`
    + `L${f1(ax + (dx * 0.866 + dy * 0.5) * A)} ${f1(ay + (dy * 0.866 - dx * 0.5) * A)}`
    + `M${f1(bx - (dx * 0.866 - dy * 0.5) * A)} ${f1(by - (dy * 0.866 + dx * 0.5) * A)}L${f1(bx)} ${f1(by)}`
    + `L${f1(bx - (dx * 0.866 + dy * 0.5) * A)} ${f1(by - (dy * 0.866 - dx * 0.5) * A)}`;
  if (p !== d.lastD) { d.lastD = p; d.path.setAttribute('d', p); }
  d.label.style.transform = `translate3d(${f1(mx)}px,${f1(my)}px,0) translate(-50%,-50%)`;
  return true;
}

function frame() {
  if (!rig.camera) return;
  for (let i = 0; i < items.length; i++) {
    const d = items[i];
    const on = d.visible && geometry(d);
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
      g, path, label, visible: true, shown: false, lastD: '', gapHalf: 0,
    };
    const setLabel = (s) => { label.textContent = String(s || ''); d.gapHalf = (label.textContent.length * 6.2 + 2 * D.gapPx) / 2; };
    setLabel(opts.label);
    items.push(d);
    const api = {
      setVisible(b) { d.visible = !!b; },
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
