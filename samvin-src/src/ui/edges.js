// ui/edges.js — the four edge strings (ARCH §3.12.6; SPEC §2.3): 1 px --slate lines inset 14 px (phone 10 px), the
// drawing-sheet border. A pointer crossing one faster than 0.4 px/ms plucks it: it bends toward the pointer (≤ 8 px),
// rings on the struck spring (ω 18, ζ 0.18; visibly gone by ≈ 900 ms), flashes --silver for 120 ms and plays the current
// room's root (`stringPluck`). Phones: only top + bottom respond (the side edges belong to the OS back gesture).
// 0.2 px sway on the breath; twitch(2 px) on every room lock. svg#edges in #frame > svg.edge-strip ×4 > path.edge.
import { Spring, SPRING } from '../core/spring.js';
import { breath, after, cancelAfter } from '../core/clock.js';
import { loop, ORDER } from '../core/loop.js';
import { layout } from '../core/layout.js';
import { app } from '../core/store.js';
import { ROOMS } from '../world/rooms.js';
import { LAYOUT, TIMING } from '../core/tokens.js';

const SVG = 'http://www.w3.org/2000/svg';
// 0 top, 1 right, 2 bottom, 3 left. `at` = pluck position along the string (px), `sp` = bend spring (px, + = inward).
const S = [0, 1, 2, 3].map((i) => ({ i, el: null, svg: null, sp: Spring.from(SPRING.struck, 0), at: 0, flash: 0, lastD: '' }));
let svgEl = null, ctxRef = null, inset = 14, prevX = NaN, prevY = NaN, visible = true;
const f1 = (v) => v.toFixed(1);

// Each string is its own small SVG strip (its own compositor layer), so a ringing string re-rasters a 1440 × 26 px
// strip instead of invalidating tiles across the whole viewport. Strip-local coordinates; T = strip thickness.
function stripT() { return inset + 12; }
function pathOf(s, sway) {
  const w = layout.w, h = layout.h, k = inset, T = stripT();
  const b = 2 * (s.sp.x + sway);          // a quadratic's control point at 2× the wanted peak displacement
  switch (s.i) {
    case 0: return `M${k} ${k}Q${f1(s.at)} ${f1(k + b)} ${w - k} ${k}`;
    case 2: return `M${k} ${T - k}Q${f1(s.at)} ${f1(T - k - b)} ${w - k} ${T - k}`;
    case 1: return `M${T - k} ${k}Q${f1(T - k - b)} ${f1(s.at)} ${T - k} ${h - k}`;
    default: return `M${k} ${k}Q${f1(k + b)} ${f1(s.at)} ${k} ${h - k}`;
  }
}

function placeStrips() {
  const w = layout.w, h = layout.h, T = stripT();
  for (const s of S) {
    if (!s.svg) continue;
    const horiz = s.i % 2 === 0;
    const sw = horiz ? w : T, sh = horiz ? T : h;
    s.svg.setAttribute('viewBox', `0 0 ${sw} ${sh}`);
    s.svg.setAttribute('width', String(sw));
    s.svg.setAttribute('height', String(sh));
    s.svg.style.transform = `translate3d(${s.i === 1 ? w - T : 0}px,${s.i === 2 ? h - T : 0}px,0)`;
  }
}

function pluck(s, along, dir, speed) {
  if (s.flash) cancelAfter(s.flash);
  s.at = along;
  s.sp.x = dir * Math.min(LAYOUT.edge.bendPx, 3 + speed * 4);
  s.sp.v = 0;
  s.sp.target = 0;
  s.el.classList.add('is-flash');
  s.flash = after(TIMING.stringFlash, () => { s.flash = 0; s.el.classList.remove('is-flash'); });
  const a = ctxRef && ctxRef.audio;
  if (a) a.play('stringPluck', { root: (ROOMS[app.room] || ROOMS.CORE).root });
}

/** Raw pointer observer: detect a fast crossing of each string's line. */
function observe(p) {
  const x = p.x, y = p.y;
  if (Number.isFinite(prevX) && visible) {
    const v = Math.hypot(p.vx, p.vy);           // px/ms
    if (v > LAYOUT.edge.pluckPxMs) {
      const w = layout.w, h = layout.h, k = inset, phone = layout.isPhone;
      if ((prevY - k) * (y - k) < 0) pluck(S[0], x, y > prevY ? 1 : -1, v);
      if ((prevY - (h - k)) * (y - (h - k)) < 0) pluck(S[2], x, y < prevY ? 1 : -1, v);
      if (!phone && (prevX - (w - k)) * (x - (w - k)) < 0) pluck(S[1], y, x < prevX ? 1 : -1, v);
      if (!phone && (prevX - k) * (x - k) < 0) pluck(S[3], y, x > prevX ? 1 : -1, v);
    }
  }
  prevX = x; prevY = y;
}

function frame(dt) {
  if (!svgEl || !visible) return;
  const sway = 0.2 * (breath.value - 0.5) * 2 * breath.amp;
  for (let n = 0; n < 4; n++) {
    const s = S[n];
    if (s.sp.x !== 0 || s.sp.v !== 0) {
      s.sp.step(dt);
      if (Math.abs(s.sp.x) < 0.01 && Math.abs(s.sp.v) < 0.05) s.sp.snap(0);
    }
    const d = pathOf(s, sway);
    if (d !== s.lastD) { s.lastD = d; s.el.setAttribute('d', d); }
  }
}

function measure() {
  inset = layout.isPhone ? LAYOUT.phone.edgeInset : LAYOUT.desktop.edgeInset;
  for (const s of S) { s.at = (s.i % 2 === 0 ? layout.w : layout.h) / 2; s.lastD = ''; }
  placeStrips();
}

export const edges = {
  init(ctx) {
    ctxRef = ctx;
    const frameEl = document.getElementById('frame');
    if (!frameEl) return edges;
    svgEl = document.createElementNS(SVG, 'svg');
    svgEl.id = 'edges';
    svgEl.setAttribute('aria-hidden', 'true');
    for (const s of S) {
      s.svg = document.createElementNS(SVG, 'svg');
      s.svg.setAttribute('class', 'edge-strip');
      s.el = document.createElementNS(SVG, 'path');
      s.el.setAttribute('class', 'edge');
      s.el.setAttribute('pathLength', '1');
      s.svg.appendChild(s.el);
      svgEl.appendChild(s.svg);
    }
    frameEl.insertBefore(svgEl, frameEl.firstChild);
    measure();
    ctx.bus.on('layout:change', measure);
    ctx.input.observe(observe);
    loop.add(frame, ORDER.UI);
    return edges;
  },

  /** Boot: the strings draw in (stroke-dashoffset). → Promise */
  drawIn(ms = TIMING.drawIn) {
    if (!svgEl) return Promise.resolve();
    for (const s of S) { s.el.style.transition = 'none'; s.el.style.strokeDasharray = '1'; s.el.style.strokeDashoffset = '1'; }
    return new Promise((res) => {
      requestAnimationFrame(() => {
        for (const s of S) { s.el.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(.16,1,.3,1)`; s.el.style.strokeDashoffset = '0'; }
        after(ms, () => { for (const s of S) { s.el.style.transition = ''; s.el.style.strokeDasharray = ''; s.el.style.strokeDashoffset = ''; } res(); });
      });
    });
  },

  /** Every room lock: all four strings twitch px inward and ring out. */
  twitch(px = LAYOUT.edge.twitchPx) { for (const s of S) { s.sp.x = px; s.sp.v = 0; s.sp.target = 0; } },

  setVisible(b) { visible = !!b; if (svgEl) svgEl.classList.toggle('is-off', !visible); for (const s of S) if (s.el) s.el.classList.toggle('is-off', !visible); },
};
