// halls/insignia/labels.js — WP9: construction-drawing labels that live INSIDE the hall's own <section> (SPEC §2.3
// "Leaders"): a 7 px `+` survey cross on the 3D anchor, a 0.5 px --silver 70 % hairline with one 45° elbow and a 24–64 px
// run, the text block at the run's end on the radial --deep scrim. The blocks are section children so the room's text is
// the section's text (QA reads it there); WP0's overlay keeps the keyboard proxies.
// Projection writes transform / `d` only (no layout reads), follows the anchor through a 120 ms one-pole low-pass, and
// hides anchors behind the camera or off screen. Used by INSIGNIA (relics, shards, capsule), NADIR and ZENITH.
//   createLabels(hctx, parent) → { add({ el, get(out:Vector3 hall-local), side, len, rise, cross }) → Label, update(dt),
//                                  setAlpha(a), dispose() }
//   Label: { el, show(b), visible, screen:{x,y,on}, setSide(side, rise), remeasure(), remove() }
import { Vector3 } from 'three';

const SVG = 'http://www.w3.org/2000/svg';
const _l = new Vector3(), _c = new Vector3();
const _p = { x: 0, y: 0, depth: 0, visible: false };

export function createLabels(hctx, parent) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'wp9-leaders');
  svg.setAttribute('aria-hidden', 'true');
  parent.appendChild(svg);
  const list = [];
  let alpha = 1, avoid = null, floor = null;

  function project(L) {
    L.get(_l);
    hctx.toCanonical(_l, _c);
    if (hctx.scale && hctx.scale.toRender) hctx.scale.toRender(_c, _c);
    hctx.rig.project(_c, _p);
    const w = hctx.layout.w, h = hctx.layout.h;
    return _p.depth > 0 && _p.x > -40 && _p.x < w + 40 && _p.y > -40 && _p.y < h + 40;
  }

  function place(L) {
    if (L.centre) { L.el.style.transform = `translate3d(${L.sx.toFixed(1)}px,${L.sy.toFixed(1)}px,0) translate(-50%,-50%)`; return; }
    const s = L.side === 'left' ? -1 : 1, r = L.rise;
    const ex = L.sx + s * Math.abs(r);
    if (L.bw == null) { L.bw = L.el.offsetWidth || 0; L.bh = L.el.offsetHeight || 0; }
    // the floor (phone: the sheet peek's top) — the block's lower edge stays above it
    const fl = floor ? floor() : null;
    const ey = fl != null ? Math.min(L.sy + r, fl - L.bh / 2) : L.sy + r;
    let lx = ex + s * L.len;
    // keep the block on screen (phone: a left-side block can run past x = 0); size cached on show
    const W = hctx.layout.w, m = 12;
    if (s < 0 && lx - 8 - L.bw < m) lx = Math.min(m + L.bw + 8, W - m);
    else if (s > 0 && lx + 8 + L.bw > W - m) lx = Math.max(W - m - L.bw - 8, m);
    L.path.setAttribute('d', `M${L.sx.toFixed(1)} ${L.sy.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${lx.toFixed(1)} ${ey.toFixed(1)}`);
    L.cross.setAttribute('transform', `translate(${L.sx.toFixed(1)} ${L.sy.toFixed(1)})`);
    const bx = lx + s * 8;
    L.el.style.transform = s < 0
      ? `translate3d(${bx.toFixed(1)}px,${ey.toFixed(1)}px,0) translate(-100%,-50%)`
      : `translate3d(${bx.toFixed(1)}px,${ey.toFixed(1)}px,0) translate(0,-50%)`;
  }

  function setOn(L, on) {
    if (L.on === on) return;
    L.on = on;
    L.bw = null;
    L.el.classList.toggle('is-off', !on);
    L.path.classList.toggle('is-off', !on || !L.leader);
    L.cross.classList.toggle('is-off', !on || !L.crossOn);
  }

  const api = {
    add(o) {
      const L = { el: o.el, get: o.get, side: o.side || 'right', len: o.len != null ? o.len : 40, rise: o.rise != null ? o.rise : -24,
        leader: o.leader !== false, crossOn: o.cross !== false, centre: !!o.centre, want: false, on: true, init: false, sx: 0, sy: 0,
        screen: { x: 0, y: 0, on: false }, path: document.createElementNS(SVG, 'path'), cross: document.createElementNS(SVG, 'path') };
      L.el.classList.add('wp9-lbl');
      L.path.setAttribute('class', 'wp9-leader');
      L.cross.setAttribute('class', 'wp9-cross');
      L.cross.setAttribute('d', 'M-3.5 0H3.5M0 -3.5V3.5');
      svg.appendChild(L.path); svg.appendChild(L.cross);
      parent.appendChild(L.el);
      setOn(L, false);
      const lbl = {
        el: L.el, screen: L.screen,
        get visible() { return L.on; },
        show(b) { L.want = !!b; if (!b) setOn(L, false); },
        setSide(side, rise) { L.side = side; if (rise != null) L.rise = rise; },
        /** The block's text changed: its size is measured again on the next placement (the on-screen clamp uses it). */
        remeasure() { L.bw = null; },
        remove() {
          const k = list.indexOf(L);
          if (k >= 0) list.splice(k, 1);
          for (const n of [L.el, L.path, L.cross]) if (n.parentNode) n.parentNode.removeChild(n);
        },
      };
      list.push(L);
      return lbl;
    },
    /** Every frame while the hall is current (dt seconds). */
    update(dt) {
      const k = 1 - Math.exp(-(dt * 1000) / 120);
      for (let i = 0; i < list.length; i++) {
        const L = list[i];
        if (!L.want || alpha <= 0) { L.screen.on = false; if (L.on) setOn(L, false); continue; }
        const inView = project(L) && !(avoid && avoid(_p.x, _p.y));
        L.screen.on = inView;
        if (!inView) { if (L.on) setOn(L, false); L.init = false; continue; }
        if (!L.init) { L.sx = _p.x; L.sy = _p.y; L.init = true; }
        else { L.sx += (_p.x - L.sx) * k; L.sy += (_p.y - L.sy) * k; }
        L.screen.x = L.sx; L.screen.y = L.sy;
        place(L);
        if (!L.on) setOn(L, true);
      }
    },
    /** (x, y) → true where no label may stand (readable columns). */
    setAvoid(fn) { avoid = typeof fn === 'function' ? fn : null; },
    /** () → y (CSS px) a block's lower edge may not pass, or null. */
    setFloor(fn) { floor = typeof fn === 'function' ? fn : null; },
    setAlpha(a) { alpha = a; svg.style.opacity = String(a); for (const L of list) L.el.style.opacity = String(a); },
    dispose() {
      for (const L of list.slice()) for (const n of [L.el, L.path, L.cross]) if (n.parentNode) n.parentNode.removeChild(n);
      list.length = 0;
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    },
  };
  return api;
}
