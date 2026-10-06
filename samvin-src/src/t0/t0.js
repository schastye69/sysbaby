// t0/t0.js — WP11 SEED (ARCH §3.15.4, §6.1.5): «ЧЕРТЁЖ» without WebGL. Un-hides #t0 and draws a static SVG elevation
// of the Key (7 stratum outlines from STRATA_GEOM, 1 px --silver, the signs as LABEL text, the ember nucleus) plus one
// DOM section per route showing the room's level line only (the datum/title are the WP0 datum's). show(route) swaps
// the section; boot() resolves after 600 ms; showLost()/hideLost() put the T0 CORE over the canvas on context loss.
// t0.css stays an empty seed, so the few layout rules live here as CSSOM writes.
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { ROOMS } from '../world/rooms.js';
import { layout } from '../core/layout.js';
import { after } from '../core/clock.js';

const SVG = 'http://www.w3.org/2000/svg';
const KEY_FRAC = 0.56;            // Key height as a fraction of the viewport height

function svg(tag, attrs, parent) {
  const n = document.createElementNS(SVG, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}

function keySvg() {
  const s = svg('svg', { viewBox: '-0.8 -1.3 1.6 2.6', 'aria-hidden': 'true' });
  Object.assign(s.style, { position: 'absolute', left: '50%', top: '50%', height: `${KEY_FRAC * 100}vh`, transform: 'translate(-50%,-50%)', overflow: 'visible' });
  for (const st of STRATA_GEOM) {
    const pts = [];
    const ys = st.top > 0 && st.bot < 0 ? [st.top, 0, st.bot] : [st.top, st.bot];
    for (const y of ys) pts.push(`${radiusAt(y).toFixed(3)},${(-y).toFixed(3)}`);
    for (let j = ys.length - 1; j >= 0; j--) pts.push(`${(-radiusAt(ys[j])).toFixed(3)},${(-ys[j]).toFixed(3)}`);
    svg('polygon', { points: pts.join(' '), fill: 'none', stroke: 'var(--silver)', 'stroke-width': '1', 'vector-effect': 'non-scaling-stroke' }, s);
    if (st.sign !== '•') {
      const t = svg('text', { x: '0', y: (-st.mid).toFixed(3), 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: 'var(--pewter)' }, s);
      t.style.font = '500 0.07px "Martian", ui-monospace, monospace';
      t.style.letterSpacing = '0.008px';
      t.textContent = st.sign;
    }
  }
  svg('circle', { cx: '0', cy: '0', r: '0.022', fill: 'var(--ember)' }, s);
  return s;
}

export function mountT0(ctx) {
  const root = document.getElementById('t0');
  const sections = {};
  let lostMode = false, current = 'CORE';
  const key = keySvg();
  if (root) {
    root.textContent = '';
    Object.assign(root.style, { background: 'var(--void)' });
    root.appendChild(key);
    for (const id of Object.keys(ROOMS)) {
      const sec = document.createElement('section');
      sec.dataset.room = id;
      sec.hidden = id !== 'CORE';
      Object.assign(sec.style, { position: 'absolute', left: 'var(--title-x)', top: 'calc(var(--datum-y) + 36px)' });
      const p = document.createElement('p');
      p.className = 't-micro';
      p.textContent = `${ROOMS[id].num} · ${ROOMS[id].code} · ▽ ${ROOMS[id].level}`;
      sec.appendChild(p);
      root.appendChild(sec);
      sections[id] = sec;
    }
    root.hidden = ctx.app.tier !== 'T0';
  }
  const t0 = {
    root,
    boot(opts) { void opts; return new Promise((res) => after(600, res)); },
    show(route) {
      const id = route && ROOMS[route.room] ? route.room : 'CORE';
      current = id;
      for (const k in sections) sections[k].hidden = k !== id;
      key.style.display = id === 'CORE' ? '' : 'none';
    },
    keyScreen() { return { x: layout.w / 2, y: layout.h / 2, r: (layout.h * KEY_FRAC) / 2 }; },
    showLost() { const prev = current; lostMode = true; if (root) root.hidden = false; t0.show({ room: 'CORE' }); current = prev; },
    hideLost() { if (!lostMode) return; lostMode = false; if (root && ctx.app.tier !== 'T0') root.hidden = true; t0.show({ room: current }); },
  };
  return t0;
}
