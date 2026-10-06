// ui/overlay.js — anchors, leaders, survey crosses, live coordinates, DOM proxies (ARCH §3.12.2, §6.1.6 A1; SPEC §2.3).
//
// Every anchor follows a RENDER-space point (opts.get, called at ORDER.OVERLAY, no allocation) projected by the rig
// (no layout reads), low-passed (τ 120 ms by default). Writes are transform-only for HTML (translate3d) and the `d` /
// `transform` attributes for SVG. Leaders are one 45° elbow + a horizontal run; blocks sit at the run's end (left-side
// blocks use translate(−100 %, −50 %) so nothing is measured). A proxy is a real <button> centred on the anchor (≥ 44 px):
// Tab focus shows the 1 px --ember survey cross + the leader; Enter / Space activate. When more than `max` anchors are on
// screen the lowest-priority ones are hidden for that frame (24; 16 on T1 and phones, SPEC §10.4).
import { Vector3 } from 'three';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { loop, ORDER } from '../core/loop.js';
import { layout } from '../core/layout.js';
import { LAYOUT, TIMING } from '../core/tokens.js';

const SVG = 'http://www.w3.org/2000/svg';
const anchors = [];
let overlayEl = null, leadersEl = null;
const _w = new Vector3(), _c = new Vector3();
const _p = { x: 0, y: 0, depth: 0, visible: false };
let lastCoord = 0;

function svg(tag, cls, owner) {
  const n = document.createElementNS(SVG, tag);
  n.setAttribute('class', cls);
  n.dataset.owner = owner;
  return n;
}
const fmtC = (v) => `${v < 0 ? '−' : v > 0 ? '+' : ''}${Math.abs(v).toFixed(2)}`;

function setLeaderGeom(a) {
  const L = a.leader || (a.focused ? { side: 'right', len: 40, rise: -24 } : null);
  if (!L || !a.path) return;
  const s = L.side === 'left' ? -1 : 1;
  const r = L.rise || 0;
  const ex = a.sx + s * Math.abs(r), ey = a.sy + r;
  const lx = ex + s * Math.max(LAYOUT.leader.elbowMin, Math.min(LAYOUT.leader.runMax, L.len || 40));
  a.path.setAttribute('d', `M${a.sx.toFixed(1)} ${a.sy.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${lx.toFixed(1)} ${ey.toFixed(1)}`);
  a.endX = lx + s * 6; a.endY = ey;
}

function show(a, on) {
  if (a.shown === on) return;
  a.shown = on;
  const showFrame = on && (a.el || a.focused);
  if (a.el) a.el.classList.toggle('is-hidden', !on);
  if (a.button) a.button.classList.toggle('is-hidden', !on);
  if (a.path) a.path.classList.toggle('is-hidden', !(showFrame && (a.leader || a.focused)));
  if (a.cross) a.cross.classList.toggle('is-hidden', !(showFrame && (a.crossOn || a.focused)));
  if (a.coordEl) a.coordEl.classList.toggle('is-hidden', !(on && a.coordOn));
}

function refreshFrameVis(a) { const s = a.shown; a.shown = !s; show(a, s); }

function frame(dt) {
  if (!rig.camera) return;
  const k = 1 - Math.exp(-(dt * 1000) / 120);
  const doCoord = loop.now - lastCoord >= 1000 / TIMING.coordHz;
  if (doCoord) lastCoord = loop.now;
  let visible = 0;
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    a.get(_w);
    rig.project(_w, _p);
    const inView = _p.depth > 0 || !a.hideBehind;
    a.want = a.visible && inView;
    if (!a.want) continue;
    visible++;
    if (!a.init || a.lowpass <= 0) { a.sx = _p.x; a.sy = _p.y; a.init = true; }
    else { const kk = a.lowpass === 120 ? k : 1 - Math.exp(-(dt * 1000) / a.lowpass); a.sx += (_p.x - a.sx) * kk; a.sy += (_p.y - a.sy) * kk; }
    a.screen.x = a.sx; a.screen.y = a.sy;
    if (doCoord && a.coordEl) { scaleEngine.toCanonical(_w, _c); a.coordEl.textContent = `x ${fmtC(_c.x)} · y ${fmtC(_c.y)}`; }
  }
  // Priority culling: more visible than max → hide the lowest priorities this frame.
  let cut = -Infinity;
  if (visible > overlay.max) {
    const pr = [];
    for (const a of anchors) if (a.want) pr.push(a.priority);
    pr.sort((x, y) => y - x);
    cut = pr[overlay.max - 1];
  }
  overlay.visibleCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    const on = a.want && (a.priority >= cut || a.focused);
    a.screen.visible = on;
    show(a, on);
    if (!on) continue;
    overlay.visibleCount++;
    if (Math.abs(a.sx - a.wx) < 0.1 && Math.abs(a.sy - a.wy) < 0.1) continue;
    a.wx = a.sx; a.wy = a.sy;
    const x = a.sx.toFixed(1), y = a.sy.toFixed(1);
    if (a.button) a.button.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (a.cross) a.cross.setAttribute('transform', `translate(${x} ${y})`);
    if (a.coordEl) a.coordEl.style.transform = `translate3d(${(a.sx + 8).toFixed(1)}px,${(a.sy + 6).toFixed(1)}px,0)`;
    setLeaderGeom(a);
    if (a.el) {
      const ex = a.path && (a.leader || a.focused) ? a.endX : a.sx, ey = a.path && (a.leader || a.focused) ? a.endY : a.sy;
      const left = a.leader && a.leader.side === 'left';
      a.el.style.transform = `translate3d(${ex.toFixed(1)}px,${ey.toFixed(1)}px,0) translate(${left ? '-100%' : '0'},-50%)`;
    }
  }
}

export const overlay = {
  max: 24,
  /** WP0 addition: anchors visible in the last frame (test hook _stats.labels). */
  visibleCount: 0,

  init(ctx) {
    overlayEl = document.getElementById('overlay');
    leadersEl = document.getElementById('leaders');
    const low = () => (ctx.app.tier === 'T1' || layout.isPhone ? LAYOUT.leader.maxAnchorsLow : LAYOUT.leader.maxAnchors);
    overlay.max = low();
    ctx.bus.on('tier:change', () => { overlay.max = low(); });
    ctx.bus.on('layout:change', () => { overlay.max = low(); for (const a of anchors) a.wx = NaN; });
    loop.add(frame, ORDER.OVERLAY);
    return overlay;
  },

  /** @returns {Anchor} */
  add(opts) {
    const owner = String(opts.owner || 'anon');
    const a = {
      owner, id: opts.id != null ? String(opts.id) : null, get: opts.get, leader: opts.leader || null,
      crossOn: opts.cross != null ? !!opts.cross : !!opts.leader, coordOn: !!opts.coord,
      priority: opts.priority || 0, lowpass: opts.lowpass != null ? opts.lowpass : TIMING.labelLowpass,
      hideBehind: opts.hideBehind !== false, visible: true, want: false, shown: true, focused: false, init: false,
      sx: 0, sy: 0, wx: NaN, wy: NaN, endX: 0, endY: 0,
      screen: { x: 0, y: 0, visible: false },
      el: opts.el || null, button: null, path: null, cross: null, coordEl: null,
    };
    if (a.el) {
      a.el.classList.add('anchor');
      if (opts.scrim !== false) a.el.classList.add('scrim');
      a.el.dataset.owner = owner;
      if (a.id) a.el.dataset.id = a.id;
      if (overlayEl) overlayEl.appendChild(a.el);
    }
    if (leadersEl) {
      a.path = svg('path', 'leader', owner);
      a.path.setAttribute('pathLength', '1');
      a.cross = svg('g', 'cross', owner);
      for (const [x1, y1, x2, y2] of [[-3.5, 0, 3.5, 0], [0, -3.5, 0, 3.5]]) {
        const l = document.createElementNS(SVG, 'line');
        l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
        a.cross.appendChild(l);
      }
      leadersEl.appendChild(a.path);
      leadersEl.appendChild(a.cross);
    }
    if (a.coordOn && overlayEl) {
      a.coordEl = document.createElement('span');
      a.coordEl.className = 't-micro coord';
      overlayEl.appendChild(a.coordEl);
    }
    const setFocus = (b) => {
      a.focused = b;
      if (a.cross) a.cross.classList.toggle('focus', b);
      if (a.path) a.path.classList.toggle('focus', b);
      a.wx = NaN;
      refreshFrameVis(a);
    };
    if (opts.button && overlayEl) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'proxy';
      b.dataset.owner = owner;
      if (a.id) b.dataset.id = a.id;
      b.setAttribute('aria-label', opts.button.label || '');
      if (opts.button.size && opts.button.size > 44) { b.style.width = `${opts.button.size}px`; b.style.height = `${opts.button.size}px`; b.style.margin = `${-opts.button.size / 2}px 0 0 ${-opts.button.size / 2}px`; }
      const btn = opts.button;
      b.addEventListener('click', () => { if (typeof a.onActivate === 'function') a.onActivate(); });
      b.addEventListener('focus', () => { setFocus(true); if (a.onFocus) a.onFocus(); });
      b.addEventListener('blur', () => { setFocus(false); if (a.onBlur) a.onBlur(); });
      a.onActivate = btn.onActivate; a.onFocus = btn.onFocus || null; a.onBlur = btn.onBlur || null;
      overlayEl.appendChild(b);
      a.button = b;
    }
    a.shown = false;
    show(a, false);
    show(a, true);
    anchors.push(a);

    const anchor = {
      el: a.el, button: a.button, screen: a.screen,
      setVisible(b) { a.visible = !!b; if (!b) show(a, false); },
      setAlpha(x) { const s = String(Math.max(0, Math.min(1, x))); if (a.el) a.el.style.opacity = s; if (a.path) a.path.style.opacity = s; },
      drawIn(ms = TIMING.leaderDraw) {
        if (a.el) a.el.classList.add('is-pending');
        if (a.path) { a.path.classList.remove('is-drawing'); a.path.style.strokeDasharray = '1'; a.path.style.strokeDashoffset = '1'; }
        return new Promise((res) => {
          requestAnimationFrame(() => {
            if (a.path) { a.path.classList.add('is-drawing'); a.path.style.transitionDuration = `${ms}ms`; a.path.style.strokeDashoffset = '0'; }
            setTimeoutLoop(ms, () => { if (a.el) a.el.classList.remove('is-pending'); res(); });
          });
        });
      },
      update(o) {
        if ('leader' in o) a.leader = o.leader || null;
        if ('cross' in o) a.crossOn = !!o.cross;
        if ('coord' in o) a.coordOn = !!o.coord;
        if (o.button && a.button) {
          if (o.button.label != null) a.button.setAttribute('aria-label', o.button.label);
          if (o.button.onActivate) a.onActivate = o.button.onActivate;
        }
        if ('priority' in o) a.priority = o.priority || 0;
        a.wx = NaN;
        refreshFrameVis(a);
      },
      remove() {
        const k = anchors.indexOf(a);
        if (k >= 0) anchors.splice(k, 1);
        for (const n of [a.el, a.button, a.path, a.cross, a.coordEl]) if (n && n.parentNode) n.parentNode.removeChild(n);
      },
    };
    a.api = anchor;
    return anchor;
  },

  /** Removes every anchor added with this owner. */
  clear(owner) {
    for (let i = anchors.length - 1; i >= 0; i--) if (anchors[i].owner === owner) anchors[i].api.remove();
  },
};

/** A loop-time timeout (the overlay must not pull in clock.js' cycle-sensitive imports at module load). */
function setTimeoutLoop(ms, fn) {
  const t0 = loop.now;
  const id = loop.add(() => { if (loop.now - t0 >= ms) { loop.remove(id); fn(); } }, ORDER.UI);
}
