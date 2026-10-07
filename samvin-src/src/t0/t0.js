// t0/t0.js — WP11 SEED (ARCH §3.15.4, §6.1.5): «ЧЕРТЁЖ» without WebGL. Un-hides #t0 and draws a static SVG elevation
// of the Key (7 stratum outlines from STRATA_GEOM, 1 px --silver, the signs as LABEL text, the ember nucleus) plus one
// DOM section per route showing the room's level line only (the datum/title are the WP0 datum's). show(route) swaps
// the section; boot() resolves after 600 ms; showLost()/hideLost() put the T0 CORE over the canvas on context loss.
// t0.css stays an empty seed, so the few layout rules live here as CSSOM writes.
// Hooks pass (ARCH-ADDENDUM X§2.8.3, H27): twin(kind, opts) (no-op seed) and `rim` — a minimal DOM Rim with the full
// Rim API (his uppercased name in an .sr-only + a visible span under the SVG Key; burn = show; rows() real).
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { ROOMS } from '../world/rooms.js';
import { layout } from '../core/layout.js';
import { after } from '../core/clock.js';
import { WORLD } from '../data/world.js';
import { upper } from '../core/ru.js';
import { registerHookField } from '../core/testhook.js';

/** H27: the T0 DOM rim (WP11 replaces it). */
function createDomRim(root, owner) {
  const name = upper(WORLD.operator.name || '');
  const LETTER_M = 38;
  let guests = [], role = null, alpha = 1, shown = false, lit = 0;
  const box = document.createElement('div');
  Object.assign(box.style, { position: 'absolute', left: '50%', top: `calc(50% + ${(KEY_FRAC * 50).toFixed(1)}vh + 24px)`,
    transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap', color: 'var(--silver)' });
  box.hidden = true;
  const line = document.createElement('p');
  line.className = 't-label';
  line.setAttribute('aria-hidden', 'true');
  line.style.margin = '0';
  const sub = document.createElement('p');
  sub.className = 't-micro';
  sub.setAttribute('aria-hidden', 'true');
  sub.style.margin = '4px 0 0';
  sub.style.opacity = '0.7';
  box.appendChild(line); box.appendChild(sub);
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = name;
  if (root) { root.appendChild(box); root.appendChild(sr); }
  const spans = [];
  function paint() {
    line.textContent = '';
    spans.length = 0;
    [name].concat(guests).forEach((n, i) => {
      if (i) line.appendChild(document.createTextNode('   '));
      const sp = document.createElement('span');
      sp.textContent = n;
      line.appendChild(sp);
      spans.push(sp);
    });
    sub.textContent = role || '';
    sub.hidden = !role;
    box.style.opacity = String(alpha);
  }
  paint();
  const rim = {
    group: null,
    burn(opts) {
      const at = opts && Number.isFinite(opts.at) ? opts.at : null;
      const wait = at != null ? Math.max(0, at - performance.now()) : 0;
      if (wait <= 0) { rim.showName(); return Promise.resolve(); }
      return new Promise((res) => after(wait, () => { rim.showName(); res(); }));
    },
    showName() { shown = true; box.hidden = !(alpha > 0); },
    burnGuests(names) { guests = (Array.isArray(names) ? names : []).map((n) => upper(String(n || ''))).filter(Boolean); paint(); rim.showName(); return Promise.resolve(); },
    clearGuests() { guests = []; paint(); },
    rows() { return [name].concat(guests).map((text) => ({ text, heightM: LETTER_M, row: 0 })); },
    setRole(text) { role = text ? upper(String(text)) : null; paint(); },
    namePoint(i, out) {
      const o = out || { x: 0, y: 0 };
      const sp = spans[Math.max(0, Math.min(spans.length - 1, i | 0))];
      const r = sp && !box.hidden ? sp.getBoundingClientRect() : null;
      if (r && r.width) { o.x = r.left + r.width / 2; o.y = r.top + r.height / 2; } else { o.x = layout.w / 2; o.y = layout.h * 0.85; }
      return o;
    },
    letterHeightM() { return LETTER_M; },
    setLitNodes(n) { lit = Math.max(0, n | 0); void lit; },
    setAlpha(a) { alpha = Math.max(0, Math.min(1, +a || 0)); box.style.opacity = String(alpha); box.hidden = !shown || !(alpha > 0); },
  };
  if (owner) registerHookField('rim', () => rim.rows());   // only when T0 is the tier (not the context-loss overlay)
  return rim;
}

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
  const domRim = createDomRim(root, ctx.app.tier === 'T0');
  const t0 = {
    root,
    /** H27: the DOM rim (full Rim API); main.js uses it as ctx.rim in T0. */
    rim: domRim,
    /** H27 seed: CSS/SVG picture twins driven by createFxT0 (WP12) — no-op until WP11. */
    twin(kind, opts) { void kind; void opts; },
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
