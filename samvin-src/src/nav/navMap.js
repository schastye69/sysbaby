// nav/navMap.js — КАРТА (ARCH §3.13.2; SPEC §5.2 phone): a full-height solid --deep sheet with a vertical elevation
// drawing of VIN and one ≥ 56 px row per hall (MICRO level, LABEL codename, BODY Russian name). Opened by a swipe up
// that starts on the phone band; a swipe down, Esc or a tap on a row (which also travels) closes it. Never blurred.
// DOM contract (navigator.css): div#map[hidden] > div.map-head + div.map-body > svg.map-draw + div.map-rows >
// button.map-row[data-room] (aria-current, [data-sealed]).
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { after } from '../core/clock.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';

const SVG = 'http://www.w3.org/2000/svg';
let ctx = null, root = null, rowsEl = [], drawPaths = [], closeTimer = 0;
const sw = { id: -1, y0: 0 };

function refresh() {
  const open = !!(state.data && state.data.nadirOpen);
  const cur = app.room === 'WORKSHOP' ? 'MEMBERS' : app.room;
  for (let i = 0; i < 7; i++) {
    const id = ROOM_ORDER[i], m = ROOMS[id], b = rowsEl[i];
    const sealed = id === 'NADIR' && !open;
    b.querySelector('.t-body').textContent = id === 'NADIR' && open ? m.nameOpen : m.name;
    if (sealed) b.setAttribute('data-sealed', ''); else b.removeAttribute('data-sealed');
    if (id === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    drawPaths[i].classList.toggle('is-current', id === cur);
  }
}

function svgPath(s) {
  // VIN elevation, 72 px wide × 300 px tall (2,400 m → 300 px; widths ×0.5 so the drawing reads as the building).
  const pts = [];
  for (let side = 0; side < 2; side++) for (let j = 0; j <= 4; j++) {
    const f = side === 0 ? j / 4 : 1 - j / 4;
    const y = s.top + (s.bot - s.top) * f;
    const r = (s.top > 0 && s.bot < 0 && j === 2) ? 0.62 : radiusAt(y);
    const x = 36 + (side === 0 ? 1 : -1) * r * 125 * 0.45;
    pts.push(`${x.toFixed(1)} ${(150 - y * 125).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

export const navMap = {
  isOpen: false,

  init(c) {
    ctx = c;
    const sheets = document.getElementById('sheets');
    if (!sheets) return navMap;
    root = document.createElement('div');
    root.id = 'map';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'КАРТА');
    const head = document.createElement('div');
    head.className = 'map-head';
    const t = document.createElement('p');
    t.className = 't-label';
    t.textContent = 'КАРТА · VIN';
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'verb';
    x.textContent = 'ЗАКРЫТЬ';
    x.addEventListener('click', () => navMap.close());
    head.append(t, x);
    const body = document.createElement('div');
    body.className = 'map-body';
    const draw = document.createElementNS(SVG, 'svg');
    draw.setAttribute('class', 'map-draw');
    draw.setAttribute('viewBox', '0 0 72 300');
    draw.setAttribute('preserveAspectRatio', 'xMidYMin meet');   // the elevation sits at the top, beside the rows
    draw.setAttribute('aria-hidden', 'true');
    for (const s of STRATA_GEOM) {
      const p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', svgPath(s));
      draw.appendChild(p);
      drawPaths.push(p);
    }
    const list = document.createElement('div');
    list.className = 'map-rows';
    rowsEl = ROOM_ORDER.map((id) => {
      const m = ROOMS[id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'map-row';
      b.dataset.room = id;
      const lv = document.createElement('span'); lv.className = 't-micro'; lv.textContent = `▽ ${m.level}`;
      const cd = document.createElement('span'); cd.className = 't-label'; cd.textContent = `${m.num} · ${m.code}`;
      const nm = document.createElement('span'); nm.className = 't-body'; nm.textContent = m.name;
      b.append(lv, cd, nm);
      b.addEventListener('click', () => { navMap.close(); if (ctx.director) ctx.director.go(`#/${m.slug}`, { source: 'nav' }); });
      list.appendChild(b);
      return b;
    });
    body.append(draw, list);
    root.append(head, body);
    // Swipe down anywhere on the sheet closes it.
    root.addEventListener('pointerdown', (e) => { sw.id = e.pointerId; sw.y0 = e.clientY; });
    root.addEventListener('pointerup', (e) => { if (e.pointerId === sw.id && e.clientY - sw.y0 > 60) navMap.close(); sw.id = -1; });
    sheets.appendChild(root);
    bus.on('room:arrive', refresh);
    bus.on('nadir:open', refresh);
    return navMap;
  },

  open() {
    if (!root || navMap.isOpen) return;
    if (closeTimer) { closeTimer = 0; }
    refresh();
    navMap.isOpen = true;
    root.hidden = false;
    root.classList.add('is-closing');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-closing')));
  },

  close() {
    if (!root || !navMap.isOpen) return;
    navMap.isOpen = false;
    root.classList.add('is-closing');
    const my = ++closeTimer;
    after(480, () => { if (my === closeTimer && !navMap.isOpen) root.hidden = true; });
  },
};
