// nav/navigator.js — КЛЮЧ, the only navigator (ARCH §3.13, §6.1.6 A9–A11, A13; SPEC §5.2, §10.1).
// An SVG elevation drawing of the Key + one real <button> per stratum. Three layouts (CSS decides placement; JS keeps
// the geometry in step with layout.kind, no measuring outside pointerdown):
//   desktop  right edge, 56 × 300 px, rows at the true altitudes (y = 150 − alt_m · 125), hover expands to 260 px
//   phone    bottom band 88 px, 7 equal cells reading S A M • V I N, the Key drawn on its side, needle vertical
//   land     right band 72 px, 7 equal cells S…N top → bottom
// Gestures on the gauge: click/tap a row → travel · drag → director.scrub (inertia + magnetic detent on release;
// reduced motion / T0 → detent jump) · wheel → elevator, one hall per 120 px · drag above S (phone: from S leftward,
// A9) → rubber band ×0.35 (≤ 48 px), ≥ 140 px held 600 ms → ZENITH · long-press 800 ms (not •) → hint swing ·
// long-press 2,000 ms on • → ПЕРЕЗАПУСК (ring from 300 ms) · phone: swipe up from the band → КАРТА.
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt, LAYOUT, TIMING } from '../core/tokens.js';
import { layout } from '../core/layout.js';
import { loop, ORDER } from '../core/loop.js';
import { after, cancelAfter, tween } from '../core/clock.js';
import { Spring } from '../core/spring.js';
import { ENV } from '../core/env.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { mulberry32 } from '../core/rng.js';
import { worldCounts } from '../data/world.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { adjacentRoom } from './elevator.js';
import { GESTURE } from '../core/input.js';

const SVG = 'http://www.w3.org/2000/svg';
const SIGNS = ['S', 'A', 'M', '•', 'V', 'I', 'N'];
const C = new Float64Array(7);                 // row / cell centres along the gauge axis (nav-local px)
const ALT = ROOM_ORDER.map((id) => ROOMS[id].alt);
let ctx = null, mode = 'desktop', W = 56, H = 300;
let root = null, drawSvg = null, crackPath = null, needleEl = null, tickEl = null, twinEl = null, twinPaths = null;
let slotsEl = null, zenithEl = null, ringEl = null, ringFill = null, nameEl = null;
const rows = [], strata = [];
let current = 'CORE', liveAlt = 0, shownNeedle = NaN, hot = -1, expanded = false, wheelAcc = 0, wheelT = -1e9;
// needle overrides: a pendulum (hint swing), the rubber band (overpull), the S13 pull hint
const swing = new Spring(8, 0.25, 0);
let swinging = false, swingEnd = 0;
const band = new Spring(12, 1, 0);           // rubber band offset (px, negative = above S)
let pullHint = 0;

// ─── geometry ───────────────────────────────────────────────────────────────────────────────────────────────
function measure() {
  mode = layout.kind === 'desktop' ? 'desktop' : layout.kind === 'phone' ? 'phone' : 'land';
  if (mode === 'desktop') { W = LAYOUT.nav.w; H = LAYOUT.nav.h; for (let i = 0; i < 7; i++) C[i] = H / 2 - (ALT[i] / 1000) * (H / 2.4); }
  else if (mode === 'phone') { W = Math.max(100, layout.w - 32); H = LAYOUT.band.h; for (let i = 0; i < 7; i++) C[i] = 16 + ((i + 0.5) * W) / 7; }
  else { W = LAYOUT.band.sideW; H = Math.max(100, layout.h - 32); for (let i = 0; i < 7; i++) C[i] = 16 + ((i + 0.5) * H) / 7; }
}

/** Canonical altitude (m) → position along the gauge axis (nav-local px); piecewise linear between the rooms. */
function posOfAlt(alt) {
  if (alt >= ALT[0]) return C[0] + ((alt - ALT[0]) * (C[1] - C[0])) / (ALT[1] - ALT[0]);
  for (let i = 1; i < 7; i++) if (alt >= ALT[i]) return C[i] + ((alt - ALT[i]) * (C[i - 1] - C[i])) / (ALT[i - 1] - ALT[i]);
  return C[6] + ((alt - ALT[6]) * (C[6] - C[5])) / (ALT[6] - ALT[5]);
}
const rowOf = (roomId) => (roomId === 'WORKSHOP' ? 2 : ROOM_ORDER.indexOf(roomId));
function nearestRow(p) { let k = 0; for (let i = 1; i < 7; i++) if (Math.abs(p - C[i]) < Math.abs(p - C[k])) k = i; return k; }

/** The elevation outline of stratum i in the current layout. */
function stratumPath(s) {
  const pts = [];
  const N = 4;
  for (let side = 0; side < 2; side++) {
    for (let j = 0; j <= N; j++) {
      const f = side === 0 ? j / N : 1 - j / N;
      const y = s.top + (s.bot - s.top) * f;
      const r = (s.top > 0 && s.bot < 0 && j === N / 2) ? 0.62 : radiusAt(y);
      let a, b;   // a along the gauge axis, b across it
      if (mode === 'desktop') { a = H / 2 - y * (H / 2.4); b = r * (H / 2.4) * LAYOUT.nav.widthScale; }
      else { const cell = (mode === 'phone' ? W : H) / 7; a = s.i * cell + cell * f; b = (r / 0.62) * ((mode === 'phone' ? H : W) * 0.36); }
      const sgn = side === 0 ? 1 : -1;
      const mid = mode === 'phone' ? H / 2 : W / 2;
      pts.push(mode === 'phone' ? `${a.toFixed(1)} ${(mid - sgn * b).toFixed(1)}` : `${(mid + sgn * b).toFixed(1)} ${a.toFixed(1)}`);
    }
  }
  return `M${pts.join('L')}Z`;
}

function crackD() {
  const s = STRATA_GEOM[6], rnd = mulberry32(7);
  const tmp = [];
  for (let k = 0; k < 5; k++) {
    const f = 0.1 + 0.2 * k;
    let seg = '';
    for (let j = 0; j <= 4; j++) {
      const y = s.top + (s.bot - s.top) * (j / 4);
      const r = radiusAt(y);
      const across = (f - 0.5 + (rnd() - 0.5) * 0.15) * 2 * r;
      let x, yy;
      if (mode === 'desktop') { yy = H / 2 - y * (H / 2.4); x = W / 2 + across * (H / 2.4) * LAYOUT.nav.widthScale; }
      else if (mode === 'phone') { const cell = W / 7; x = 6 * cell + cell * (j / 4); yy = H / 2 + (across / 0.62) * H * 0.36; }
      else { const cell = H / 7; yy = 6 * cell + cell * (j / 4); x = W / 2 + (across / 0.62) * W * 0.36; }
      seg += `${j ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`;
    }
    tmp.push(seg);
  }
  return tmp.join('');
}

function layoutDom() {
  measure();
  drawSvg.setAttribute('viewBox', `0 0 ${W.toFixed(1)} ${H.toFixed(1)}`);
  for (let i = 0; i < 7; i++) strata[i].setAttribute('d', stratumPath(STRATA_GEOM[i]));
  crackPath.setAttribute('d', crackD());
  const desk = mode === 'desktop';
  for (let i = 0; i < 7; i++) rows[i].style.top = desk ? `${C[i].toFixed(1)}px` : '';
  slotsEl.style.top = desk ? `${(C[6] + 12).toFixed(1)}px` : '';
  ringEl.style.top = desk ? `${C[3].toFixed(1)}px` : '';
  shownNeedle = NaN;
}

// ─── visuals ────────────────────────────────────────────────────────────────────────────────────────────────
function needlePos() {
  let p = swinging ? swing.x : posOfAlt(liveAlt);
  p += band.x + pullHint;
  return p;
}
function writeAxis(el, p) {
  el.style.transform = mode === 'phone' ? `translate3d(${(p - 0.5).toFixed(1)}px,0,0)` : `translate3d(0,${(p - 0.5).toFixed(1)}px,0)`;
}

function frame(dt) {
  if (!root) return;
  if (swinging) {
    swing.step(dt);
    if (loop.now > swingEnd) { swing.target = posOfAlt(liveAlt); if (Math.abs(swing.x - swing.target) < 0.3 && Math.abs(swing.v) < 2) swinging = false; }
  }
  if (band.x !== 0 || band.v !== 0) { band.step(dt); if (band.target === 0 && Math.abs(band.x) < 0.05 && Math.abs(band.v) < 0.5) band.snap(0); }
  const p = needlePos();
  if (Math.abs(p - shownNeedle) < 0.05) return;
  shownNeedle = p;
  writeAxis(needleEl, p);
  if (twinEl) writeAxis(twinEl, p);
}

function rowAttr(i, name, ms, value) {
  const r = rows[i];
  if (!r) return;
  if (r['_' + name]) cancelAfter(r['_' + name]);
  r.setAttribute(name, name === 'data-glint' ? (value || 'electrum') : '');
  r['_' + name] = after(ms, () => { r['_' + name] = 0; r.removeAttribute(name); });
}

function nadirLabels() {
  const open = !!(state.data && state.data.nadirOpen);
  const r = rows[6], m = ROOMS.NADIR;
  r.setAttribute('aria-label', open ? m.nameOpen : m.name);
  r.querySelector('.kn-name').textContent = open ? m.nameOpen : m.name;
  const k = state.data ? state.data.shards | 0 : 0;
  r.querySelector('.kn-level').textContent = open ? `▽ ${m.giant}` : '●'.repeat(k) + '○'.repeat(5 - k);
}

function setHot(i) {
  if (i === hot) return;
  if (hot >= 0) rows[hot].classList.remove('is-hot');
  hot = i;
  if (i < 0) { tickEl.classList.remove('is-on'); return; }
  rows[i].classList.add('is-hot');
  tickEl.style.transform = `translate3d(0,${(C[i] - 0.5).toFixed(1)}px,0)`;
  tickEl.classList.add('is-on');
  if (ctx.audio) ctx.audio.play('hoverTick', { x: layout.w - 52 });
}
function setExpanded(b) {
  if (mode !== 'desktop') b = false;
  if (b === expanded) return;
  expanded = b;
  if (b) root.setAttribute('data-expanded', ''); else { root.removeAttribute('data-expanded'); setHot(-1); }
}

// ─── navigation helpers ─────────────────────────────────────────────────────────────────────────────────────
const hashOf = (roomId) => `#/${ROOMS[roomId].slug}`;
function goRow(i, source = 'nav') { if (ctx.director) ctx.director.go(hashOf(ROOM_ORDER[i]), { source }); }
function baseRoom() { const d = ctx.director; return d && d.busy() && d.state.to ? d.state.to.room : app.room; }

function onWheel(e) {
  e.preventDefault();
  if (mode !== 'desktop') return;
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= layout.h;
  if (loop.now - wheelT > 600 || Math.sign(dy) !== Math.sign(wheelAcc)) wheelAcc = 0;
  wheelT = loop.now;
  wheelAcc += dy;
  if (Math.abs(wheelAcc) < LAYOUT.nav.wheelPxPerDetent) return;
  const dir = Math.sign(wheelAcc);
  wheelAcc = 0;
  const to = adjacentRoom(baseRoom(), dir);       // A11: deltaY > 0 → the hall below
  if (!to) return;
  if (ctx.audio) ctx.audio.play('tick', {});
  ctx.director.go(hashOf(to), { source: 'nav' });
}

// ─── pointer gestures on the gauge ──────────────────────────────────────────────────────────────────────────
const P = { id: -1, row: -1, x0: 0, y0: 0, p0: 0, left: 0, top: 0, moved: false, mode: null, done: false,
  timers: [], v: 0, lastP: 0, lastT: 0, target: -1, from: 0, u0: 0, pull: 0, pullTimer: 0, mapDy: 0 };

function local(e) { return mode === 'phone' ? e.clientX - P.left : e.clientY - P.top; }
// Press timers (long-press, ПЕРЕЗАПУСК, overpull hold) run on the wall clock like core/input.js's hold/longpress:
// they measure how long a finger has been held, which a slow frame must not stretch.
const wall = (ms, fn) => setTimeout(fn, ms);
function clearTimers() { for (const t of P.timers) clearTimeout(t); P.timers.length = 0; if (P.pullTimer) { clearTimeout(P.pullTimer); P.pullTimer = 0; } }
function ringOff() { ringEl.classList.remove('is-on'); ringFill.style.transition = 'none'; ringFill.style.strokeDashoffset = '1'; }

function onDown(e) {
  if (P.id >= 0 || (e.pointerType === 'mouse' && e.button !== 0)) return;
  const r = root.getBoundingClientRect();                  // allowed on down
  P.id = e.pointerId; P.left = r.left; P.top = r.top; P.x0 = e.clientX; P.y0 = e.clientY;
  P.moved = false; P.mode = null; P.done = false; P.v = 0; P.target = -1;
  P.p0 = P.lastP = local(e); P.lastT = e.timeStamp;
  P.row = nearestRow(P.p0);
  if (Math.abs(P.p0 - C[P.row]) > 30) P.row = -1;
  try { root.setPointerCapture(e.pointerId); } catch (err) { /* no capture */ }
  if (P.row === 3) {
    P.timers.push(wall(TIMING.relaunchRingDelay, () => {
      ringEl.classList.add('is-on');
      ringFill.style.transition = 'none'; ringFill.style.strokeDashoffset = '1';
      requestAnimationFrame(() => { ringFill.style.transition = `stroke-dashoffset ${TIMING.relaunch - TIMING.relaunchRingDelay}ms linear`; ringFill.style.strokeDashoffset = '0'; });
    }));
    P.timers.push(wall(TIMING.relaunch, () => {
      P.done = true; ringOff();
      vibrate(VIBE.lock);
      if (app.room !== 'CORE' && ctx.director) ctx.director.go('#/core', { source: 'nav' });
      bus.emit('relaunch', {});
    }));
  } else if (P.row >= 0) {
    P.timers.push(wall(TIMING.longPress, () => { P.done = true; if (ctx.hint) ctx.hint.swing(); }));
  }
}

function beginDrag(e, dx, dy) {
  clearTimers(); ringOff();
  const along = mode === 'phone' ? dx : dy, across = mode === 'phone' ? dy : dx;
  // A9 / SPEC: overpull starts on S and first moves "up the building" (desktop/land: up; phone: left).
  if (P.row === 0 && along < 0 && Math.abs(along) >= Math.abs(across) * 0.5) { P.mode = 'pull'; return; }
  if (mode === 'phone' && dy < 0 && Math.abs(dy) > Math.abs(dx)) { P.mode = 'map'; return; }
  const d = ctx.director;
  if (!d) { P.mode = 'none'; return; }
  const p = local(e);
  if (d.busy()) {
    if (!d.scrub.begin(d.state.to.hash)) { P.mode = 'detent'; return; }
    P.target = rowOf(d.state.to.room); P.from = p; P.u0 = d.state.u; P.mode = 'scrub';
    return;
  }
  const cur = posOfAlt(ROOMS[app.room].alt);
  const dir = Math.sign(p - cur) || Math.sign(along) || 1;
  let t = nearestRow(p);
  if (t === rowOf(app.room) || Math.abs(p - cur) < 12) t = rowOf(app.room) + dir;
  if (t < 0 || t > 6) { P.mode = 'none'; return; }
  P.target = t; P.from = cur; P.u0 = 0;
  if (!d.scrub.begin(hashOf(ROOM_ORDER[t]))) { P.mode = 'detent'; return; }
  P.mode = 'scrub';
}

function scrubU(p) {
  const span = C[P.target] - P.from;
  if (Math.abs(span) < 1) return 1;
  return Math.max(0, Math.min(1, P.u0 + ((p - P.from) / span) * (1 - P.u0)));
}

function onMove(e) {
  if (e.pointerId !== P.id) { if (mode === 'desktop' && e.pointerType === 'mouse' && P.id < 0) hover(e); return; }
  const dx = e.clientX - P.x0, dy = e.clientY - P.y0;
  if (!P.moved) {
    const d = Math.hypot(dx, dy);
    // A press that has started to travel is no longer a long-press (half the drag slop, so slow event streams on a
    // loaded device cannot turn the start of a drag into a hint swing).
    if (d >= GESTURE.SLOP_PX / 2 && P.timers.length && !P.done) { clearTimers(); ringOff(); }
    if (d < GESTURE.SLOP_PX) return;
    P.moved = true;
    if (P.done) { P.mode = 'none'; return; }
    beginDrag(e, dx, dy);
  }
  const p = local(e);
  const dt = Math.max(1, e.timeStamp - P.lastT);
  P.v += ((p - P.lastP) / dt - P.v) * Math.min(1, dt / 60);
  P.lastP = p; P.lastT = e.timeStamp;
  if (P.mode === 'scrub') ctx.director.scrub.set(scrubU(p));
  else if (P.mode === 'pull') {
    let pull = C[0] - p;
    if (mode === 'phone') pull += Math.max(0, P.top - e.clientY);
    else if (mode === 'land') pull += Math.max(0, P.left - e.clientX);
    P.pull = Math.max(0, pull);
    band.snap(-Math.min(LAYOUT.nav.rubberMax, P.pull * LAYOUT.nav.rubber));
    if (P.pull >= LAYOUT.nav.overpullPx && !P.pullTimer) {
      P.pullTimer = wall(TIMING.overpullHold, () => {
        P.pullTimer = 0; P.done = true; P.mode = 'none';
        band.target = 0;
        if (ctx.director) ctx.director.go('#/zenith', { source: 'overpull' });
      });
    } else if (P.pull < LAYOUT.nav.overpullPx && P.pullTimer) { clearTimeout(P.pullTimer); P.pullTimer = 0; }
  } else if (P.mode === 'map') P.mapDy = e.clientY - P.y0;
  if (mode === 'desktop' && (P.mode === 'scrub' || P.mode === 'detent')) setHot(nearestRow(p));
}

function onUp(e, cancelled) {
  if (e.pointerId !== P.id) return;
  P.id = -1;
  clearTimers(); ringOff();
  const d = ctx.director;
  const p = P.lastP;
  if (P.mode === 'scrub' && d) {
    if (cancelled) d.scrub.end(-4);
    else {
      let vu = (P.v * 1000) / (C[P.target] - P.from || 1);
      const M = LAYOUT.nav.magnetPx;
      if (Math.abs(p - C[P.target]) <= M) vu = Math.max(vu, 2);
      else if (Math.abs(p - P.from) <= M) vu = Math.min(vu, -2);
      d.scrub.end(vu);
    }
  } else if (P.mode === 'pull') {
    band.target = 0;
  } else if (P.mode === 'detent' && !cancelled) {
    const t = nearestRow(p);
    if (t !== rowOf(app.room)) goRow(t);
  } else if (P.mode === 'map' && !cancelled) {
    if (P.mapDy <= -40 && ctx.navMap) ctx.navMap.open();
  } else if (!P.moved && !P.done && !cancelled && P.row >= 0) {
    goRow(P.row);
  }
  P.mode = null;
}

function hover(e) {
  setExpanded(true);
  const top = layout.h / 2 - H / 2;                 // the gauge is vertically centred (CSS)
  const y = e.clientY - top;
  const i = nearestRow(y);
  setHot(Math.abs(y - C[i]) <= 22 ? i : -1);
}

// ─── DOM ────────────────────────────────────────────────────────────────────────────────────────────────────
function el(tag, cls, parent, id) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (id) n.id = id;
  parent.appendChild(n);
  return n;
}
function svgEl(tag, cls, parent) { const n = document.createElementNS(SVG, tag); if (cls) n.setAttribute('class', cls); parent.appendChild(n); return n; }

function build() {
  root = document.createElement('nav');
  root.id = 'keynav';
  root.setAttribute('aria-label', 'КЛЮЧ');
  drawSvg = svgEl('svg', 'kn-draw', root);
  drawSvg.setAttribute('aria-hidden', 'true');
  drawSvg.setAttribute('preserveAspectRatio', 'none');
  for (let i = 0; i < 7; i++) {
    const p = svgEl('path', 'kn-stratum', drawSvg);
    p.setAttribute('data-stratum', SIGNS[i]);   // not data-sign: QA's '#keynav [data-sign]' must hit the row button
    p.setAttribute('pathLength', '1');
    strata.push(p);
  }
  crackPath = svgEl('path', 'kn-crack', drawSvg);
  crackPath.setAttribute('pathLength', '1');
  crackPath.style.strokeDasharray = '1';
  crackPath.style.strokeDashoffset = '1';
  for (let i = 0; i < 7; i++) {
    const id = ROOM_ORDER[i], m = ROOMS[id];
    const b = el('button', 'kn-row', root);
    b.type = 'button';
    b.dataset.sign = SIGNS[i];
    b.dataset.room = id;
    b.style.setProperty('--i', String(i));
    b.setAttribute('aria-label', m.name);
    const L = el('span', 'kn-letter t-label', b); L.textContent = SIGNS[i];
    const T = el('span', 'kn-text', b);
    const hd = el('span', 'kn-head', T);   // line 1: LABEL code + Russian name; line 2: MICRO level (fits 35 px rows)
    el('span', 'kn-code t-label', hd).textContent = `${SIGNS[i]} · ${m.code}`;
    el('span', 'kn-name t-body t-body--15 t-body--em', hd).textContent = m.name;
    el('span', 'kn-level t-micro', T).textContent = `▽ ${m.giant}`;
    // Keyboard activation (pointer activation is handled on pointerup; detail 0 = keyboard click).
    b.addEventListener('click', (e) => { if (e.detail === 0) goRow(i); });
    rows.push(b);
  }
  tickEl = el('i', 'kn-tick', root);
  needleEl = el('i', '', root, 'keynav-needle');
  twinEl = svgEl('svg', 'kn-twin', root);
  twinEl.setAttribute('viewBox', '0 0 40 12');
  twinPaths = [svgEl('path', '', twinEl), svgEl('path', '', twinEl)];
  slotsEl = el('div', '', root, 'keynav-slots');
  for (let k = 0; k < 5; k++) el('i', 'slot', slotsEl);
  zenithEl = el('i', '', root, 'keynav-zenith');
  ringEl = el('div', '', root, 'keynav-ring');
  const rs = svgEl('svg', '', ringEl);
  rs.setAttribute('viewBox', '0 0 44 44');
  const tr = svgEl('circle', 'track', rs); tr.setAttribute('cx', '22'); tr.setAttribute('cy', '22'); tr.setAttribute('r', '18');
  ringFill = svgEl('circle', 'fill', rs); ringFill.setAttribute('cx', '22'); ringFill.setAttribute('cy', '22'); ringFill.setAttribute('r', '18');
  ringFill.setAttribute('pathLength', '1'); ringFill.style.strokeDasharray = '1'; ringFill.style.strokeDashoffset = '1';
  el('span', 't-label', ringEl).textContent = 'ПЕРЕЗАПУСК';
  nameEl = el('p', 't-body t-body--15 t-body--em', root, 'keynav-name');
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', (e) => onUp(e, false));
  root.addEventListener('pointercancel', (e) => onUp(e, true));
  root.addEventListener('pointerleave', (e) => { if (P.id < 0 && e.pointerType === 'mouse') setExpanded(false); });
  root.addEventListener('wheel', onWheel, { passive: false });
  root.addEventListener('contextmenu', (e) => e.preventDefault());
}

export const keyNav = {
  el: null,

  init(c) {
    ctx = c;
    const chromeEl = document.getElementById('chrome');
    if (!chromeEl) return keyNav;
    build();
    chromeEl.appendChild(root);
    keyNav.el = root;
    layoutDom();
    nadirLabels();
    keyNav.refreshSlots();
    if (state.data && state.data.nadirOpen) { crackPath.style.strokeDashoffset = '0'; crackPath.classList.add('is-cool'); }
    keyNav.showZenith(!!(state.data && state.data.found && state.data.found.S13));
    keyNav.setCurrent(app.room || 'CORE');
    bus.on('layout:change', () => { layoutDom(); setExpanded(false); });
    bus.on('secret:found', (e) => { if (e.id === 'S13') keyNav.showZenith(true); });
    bus.on('room:arrive', () => { try { if (worldCounts().unread > 0) keyNav.blink('S'); } catch (err) { /* counts unavailable */ } });
    loop.add(frame, ORDER.UI);
    return keyNav;
  },

  /** Desktop: the drawing draws in; phone: the band rises. → Promise */
  show(opts = {}) {
    if (!root) return Promise.resolve();
    const ms = opts.ms != null ? opts.ms : TIMING.drawIn;
    root.classList.add('is-shown');
    for (const s of strata) { s.style.transition = 'none'; s.style.strokeDasharray = '1'; s.style.strokeDashoffset = '1'; }
    requestAnimationFrame(() => { for (const s of strata) { s.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(.16,1,.3,1),stroke .24s`; s.style.strokeDashoffset = '0'; } });
    return new Promise((res) => after(ms, () => { for (const s of strata) { s.style.strokeDasharray = ''; s.style.strokeDashoffset = ''; s.style.transition = ''; } res(); }));
  },
  hide() { if (root) { root.classList.remove('is-shown'); setExpanded(false); } },

  /** Outline --silver + letter --ember; phone: the Russian name above the band. */
  setCurrent(roomId) {
    current = ROOMS[roomId] ? roomId : 'CORE';
    const k = rowOf(current);
    for (let i = 0; i < 7; i++) {
      if (i === k) rows[i].setAttribute('aria-current', 'true'); else rows[i].removeAttribute('aria-current');
      strata[i].classList.toggle('is-current', i === k);
    }
    const m = ROOMS[current];
    if (nameEl) nameEl.textContent = current === 'NADIR' && state.data && state.data.nadirOpen ? m.nameOpen : m.name;
    liveAlt = m.alt;
  },
  /** The needle at the live canonical altitude (m). */
  setNeedle(alt) { liveAlt = Number.isFinite(alt) ? alt : 0; },
  /** Beat-to-lock twin: two 1 px sines converge onto the needle over 240 ms. */
  lockTwin() {
    if (!twinEl || mode !== 'desktop') return;
    twinEl.classList.add('is-on');
    const [a, b] = twinPaths;
    tween(TIMING.navTwin, (u) => {
      const amp = 5 * (1 - u), fa = 3, fb = 3 + 2 * (1 - u);
      let da = 'M0 6', db = 'M0 6';
      for (let x = 2; x <= 40; x += 2) {
        da += `L${x} ${(6 + amp * Math.sin((x / 40) * fa * 6.283)).toFixed(2)}`;
        db += `L${x} ${(6 + amp * Math.sin((x / 40) * fb * 6.283 + 1)).toFixed(2)}`;
      }
      a.setAttribute('d', da); b.setAttribute('d', db);
    }).done.then(() => after(120, () => twinEl.classList.remove('is-on')));
  },
  flashLetter(sign, token, ms) {   // H21: token 'ember' | 'electrum' | 'white' (data-glint="white")
    const i = SIGNS.indexOf(sign);
    if (i >= 0) rowAttr(i, token === 'electrum' || token === 'white' ? 'data-glint' : 'data-flash', ms || TIMING.hintGlint, token);
  },
  /** S05 owner: every letter ember for one breath. */
  flashAll(ms, token = 'ember') {   // H21: S05 first recognition uses 'white'
    for (let i = 0; i < 7; i++) {
      if (token === 'electrum' || token === 'white') rowAttr(i, 'data-glint', ms || 4200, token);
      else rowAttr(i, 'data-flash', ms || 4200);
    }
  },
  blink(sign) { const i = SIGNS.indexOf(sign); if (i >= 0) rowAttr(i, 'data-blink', 480); },
  /** 6 px, 3 cycles, 240 ms (+ the N slot dots flash). data-shudder stays readable for QA a little longer. */
  shudder(sign) {
    const i = SIGNS.indexOf(sign);
    if (i < 0) return;
    const r = rows[i];
    if (r.hasAttribute('data-shudder')) { r.removeAttribute('data-shudder'); requestAnimationFrame(() => rowAttr(i, 'data-shudder', 1000)); }
    else rowAttr(i, 'data-shudder', 1000);
    if (sign === 'N') { slotsEl.classList.add('is-flash'); after(TIMING.shudder, () => slotsEl.classList.remove('is-flash')); }
  },
  /** N slot dots from state.data.shards (filled --silver / empty --slate). */
  refreshSlots() {
    const k = state.data ? Math.min(5, state.data.shards | 0) : 0;
    if (slotsEl) for (let j = 0; j < 5; j++) slotsEl.children[j].classList.toggle('filled', j < k);
    if (rows.length) nadirLabels();
  },
  /** CSS px of N slot k (shard flight target). */
  slotPoint(k) {
    const s = slotsEl && slotsEl.children[Math.max(0, Math.min(4, k | 0))];
    if (!s) return { x: layout.w / 2, y: layout.h / 2 };
    const r = s.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  },
  letterPoint(sign) {
    const i = Math.max(0, SIGNS.indexOf(sign));
    const L = rows[i] && rows[i].firstChild;
    if (!L) return { x: layout.w / 2, y: layout.h / 2 };
    const r = L.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  },
  /** 2,800 ms electrum crack along 5 lines; N becomes «Исток». → Promise */
  crack() {
    if (!crackPath) return Promise.resolve();
    crackPath.classList.remove('is-cool');
    crackPath.style.transition = 'none';
    crackPath.style.strokeDashoffset = '1';
    requestAnimationFrame(() => { crackPath.style.transition = 'stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s'; crackPath.style.strokeDashoffset = '0'; });
    after(1400, () => { nadirLabels(); keyNav.setCurrent(current); });
    return new Promise((res) => after(2800, () => { crackPath.classList.add('is-cool'); res(); }));
  },
  /** 2 px '·' 10 px above S (after S13). */
  showZenith(b) { if (zenithEl) zenithEl.classList.toggle('is-on', !!b); },
  /** S13 motion hint: the needle pulls px above S and snaps back. */
  pullAboveS(px = 20, ms = 600) {
    const base = posOfAlt(liveAlt), to = C[0] - px - base;
    tween(ms, (u) => { pullHint = to * Math.sin(Math.PI * u); }).done.then(() => { pullHint = 0; });
  },
  /** WP0 addition (hint.js): the pendulum swing that settles on a row (0…6) or above S (−1, ZENITH). */
  swingTo(row, holdMs = TIMING.hintGlint) {
    swing.snap(needlePos());
    swing.target = row < 0 ? C[0] - LAYOUT.nav.zenithDotAbove * 2 : C[row];
    swinging = true;
    swingEnd = loop.now + 900 + holdMs;
    if (row < 0) { zenithEl.classList.add('is-ghost'); after(900 + holdMs, () => zenithEl.classList.remove('is-ghost')); }
    else after(450, () => rowAttr(row, 'data-glint', holdMs));
  },
};
