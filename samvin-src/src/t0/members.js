// t0/members.js — WP11. MEMBERS «КЛАН» in T0 (SPEC §6.2, §12.5; SPEC-ADDENDUM A3.1 РОЛЬ, A3.2 СБОР T0, A5.2 curtain call,
// O12 `MEMBER`, O43 LEVEL BODY): SVG elevations of the twisted Shukhov columns, all 24 m (equal heights; height never
// encodes level), standing on the datum on the 48 m arc ±25° (operator in the middle), generators of both families, rings
// every 6 m, the capital plate 0.8 m above the top with the member's 7×7 glyph (his: 1.5 px ember edge; no glyph yet: a
// dotted pewter grid), BODY name + LABEL callsign on the deck. Hover: light climbs base → capital (320 ms), the column
// telescopes +15 % in 5 ratchet steps (45 ms, a tick each), the others dim to 40 % and part to 2.2× spacing, the
// readout writes row by row (60 ms) on a left tick. Click / Enter → #/members/<id> (readout pinned + ВНУТРЕННЯЯ ШУТКА +
// the glyph melody). Strum: the pointer crossing a column's band at > 0.25 px/ms plucks it (struck sway, its note, a
// light pulse); every column within 1,500 ms → ВСЕ ВМЕСТЕ (S04): the chord, his column bows first, the clan 240 ms
// later, capitals flash --white, the motto beam-writes. Phone: 2–3 columns, a horizontal swipe turns the arc by one
// (and plucks what it crosses), the centred column is auto-focused (sheet peek: name, status, РОЛЬ). СБОР: t0/sbor.js.
import { WORLD, operatorMember } from '../data/world.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { loop, ORDER } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { glyphNotes } from '../core/glyph.js';
import { hz } from '../audio/notes.js';
import { relicIconSvg } from '../halls/insignia/shapes.js';
import { achievementById, EMPTY_LINE } from '../data/world.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { svg, el, fmt, clear, block, glyphPath, svgCross, reduced } from './dom.js';
import { createSbor } from './sbor.js';

const H = 24, R = 1.6, ARC = 48, SPAN = (25 * Math.PI) / 180;
const DOT = { 'на связи': 'ember', 'в пути': 'silver', 'отдыхает': 'pewter' };

function order() {
  const ms = WORLD.members.slice();
  const op = ms.findIndex((m) => m.id === WORLD.operator.id);
  if (op < 0) return ms;
  const me = ms.splice(op, 1)[0];
  ms.splice(Math.floor(ms.length / 2), 0, me);
  return ms;
}

/** Twisted hyperboloid elevation (seeded): both generator families + rings every 6 m → { gen, rings } path data. */
function columnPaths(seed, k, x0, y0) {
  const waist = 0.45 + 0.25 * ((seed * 0.618) % 1);
  const tw = 2 * Math.acos(Math.max(-1, Math.min(1, waist)));
  const n = 8 + (seed % 7);
  const P = (x, y) => `${fmt(x0 + x * k)} ${fmt(y0 - y * k)}`;
  let gen = '', back = '';
  for (const s of [1, -1]) {
    for (let j = 0; j < n; j++) {
      const a = (2 * Math.PI * j) / n + seed;
      const xa = R * Math.sin(a), xb = R * Math.sin(a + s * tw);
      const za = Math.cos(a) + Math.cos(a + s * tw);
      const d = `M${P(xa, 0)}L${P(xb, H)}`;
      if (za >= 0) gen += d; else back += d;
    }
  }
  let rings = '';
  for (let y = 0; y <= H; y += 6) {
    const u = y / H;
    const r = R * Math.sqrt((1 - u) * (1 - u) + u * u + 2 * u * (1 - u) * Math.cos(tw));
    rings += `M${P(-r, y)}L${P(r, y)}`;
  }
  return { gen, back, rings, waist: R * Math.cos(tw / 2) };
}

export function createMembers(ctx, T) {
  const sec = T.section('MEMBERS');
  const list = order();
  const opId = WORLD.operator.id;
  const rail = el('div', 't0-cols', null, sec, { attrs: { 'aria-hidden': 'true' } });
  const sborLayer = svg('svg', { class: 't0-cols__fx', 'aria-hidden': 'true' }, sec);
  const names = el('div', 't0-colnames', null, sec);
  const proxies = el('div', 't0-colproxies', null, sec);
  const ro = block(sec, 't0-readout scrim', { qa: 'readout' });
  ro.hidden = true;
  const empty = el('p', 't-body t0-empty', EMPTY_LINE.members, sec);
  empty.hidden = list.length > 0;
  const M = { fxLayer: sborLayer, cols: [], k: 15.8, base: 0, cx: 0, hover: -1, focus: -1, centred: 0, plucks: new Float64Array(list.length), chordAt: -1e9, shown: false };

  // ── geometry ─────────────────────────────────────────────────────────────────────────────────────────────────
  function geom() {
    const w = layout.w, h = layout.h;
    if (layout.isPhone) {
      const base = h - (layout.safe.b + 88 + 120);
      const k = Math.min(15.8, (base - 200) / (H + 3));
      return { k, base, cx: w / 2, step: 132 };
    }
    const base = h * 0.62;
    const k = Math.min(15.8, (base - 140) / (H + 3));
    return { k, base, cx: 0.5 * w + 0.1 * w, step: 0 };
  }
  function baseX(i, g, focus) {
    if (layout.isPhone) return g.cx + (i - M.centred) * g.step;
    const n = list.length;
    const th = n > 1 ? -SPAN + (2 * SPAN * i) / (n - 1) : 0;
    let x = ARC * Math.sin(th);
    if (focus >= 0 && n > 1) {
      const d = (2 * SPAN) / (n - 1) * ARC * 0.85;
      if (i < focus) x -= d * 0.6; else if (i > focus) x += d * 0.6;
    }
    return g.cx + x * g.k;
  }

  function build() {
    clear(rail); clear(names); clear(proxies);
    M.cols.length = 0;
    const g = geom();
    M.k = g.k; M.base = g.base; M.cx = g.cx;
    const w = Math.round(Math.max(96, 8 * g.k)), hpx = Math.round((H + 7) * g.k + 60), ox = w / 2, oy = hpx - 24;
    M.w = w; M.h = hpx; M.ox = ox; M.oy = oy;
    list.forEach((m, i) => {
      const own = m.id === opId;
      const col = el('div', `t0-col${own ? ' is-op' : ''}`, null, rail, { data: { id: m.id } });
      col.style.width = `${w}px`; col.style.height = `${hpx}px`;
      col.style.transformOrigin = `${ox}px ${oy}px`;
      const body = svg('svg', { class: 't0-col__svg', width: w, height: hpx, viewBox: `0 0 ${w} ${hpx}`, 'aria-hidden': 'true' }, col);
      const p = columnPaths(m.seed | 0, g.k, ox, oy);
      svg('path', { d: p.back, class: 't0-col__back' }, body);
      svg('path', { d: p.rings, class: 't0-col__ring' }, body);
      svg('path', { d: p.gen, class: 't0-col__gen' }, body);
      // capital: plate 4.4 m × 0.4 m, 0.8 m above the top; the glyph plaque above it
      const cy = oy - (H + 0.8) * g.k;
      const cap = svg('g', { class: 't0-cap' }, body);
      svg('rect', { x: ox - 2.2 * g.k, y: cy - 0.4 * g.k, width: 4.4 * g.k, height: Math.max(3, 0.4 * g.k), class: 't0-cap__plate' }, cap);
      const gs = Math.max(22, 2.4 * g.k), gx = ox - gs / 2, gy = cy - 0.4 * g.k - gs - 8;
      const glyph = own ? (state.data && state.data.glyph) || null : m.glyph;
      if (glyph && glyph.length) svg('path', { d: glyphPath(glyph, gx, gy, gs), class: 't0-cap__glyph' }, cap);
      else {
        let d = '';
        for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) d += `M${fmt(gx + (c * gs) / 6)} ${fmt(gy + (r * gs) / 6)}h.01`;
        svg('path', { d, class: 't0-cap__grid' }, cap);
      }
      svgCross(cap, gx - 6, gy - 6); svgCross(cap, gx + gs + 6, gy + gs + 6);
      const ringEl = svg('circle', { cx: ox, cy: cy - 0.2 * g.k, r: 36, class: 't0-cap__hold', pathLength: '1' }, body);
      const breathe = svg('circle', { cx: ox, cy: cy - 0.2 * g.k, r: 3.2 * g.k, class: 't0-cap__br' }, body);
      const here = svg('path', { d: `M${fmt(ox - 3.5)} ${fmt(gy - 18)}h7M${fmt(ox)} ${fmt(gy - 21.5)}v7`, class: 't0-cap__here' }, body);
      svgCross(body, ox, oy);
      const light = svg('svg', { class: 't0-col__light', width: w, height: hpx, viewBox: `0 0 ${w} ${hpx}`, 'aria-hidden': 'true' }, col);
      svg('path', { d: p.gen, class: 't0-col__lg' }, light);
      // deck label + proxy button
      const nm = el('div', 't0-colname', null, names, { data: { id: m.id } });
      el('p', 't-body', m.name, nm);
      el('p', 't-label', m.callsign, nm);
      const hereL = el('p', 't-label t0-colname__here', 'ЗДЕСЬ', nm);
      const btn = el('button', 't0-colproxy', null, proxies, { qa: 'column', data: { id: m.id }, attrs: { 'aria-label': `${m.name} · ${m.callsign}`, type: 'button' } });
      btn.addEventListener('click', () => go(m.id));
      btn.addEventListener('focus', () => { if (!layout.isPhone) setHover(i, true); });
      btn.addEventListener('blur', () => { if (M.focus < 0) setHover(-1); });
      M.cols.push({ m, i, own, col, body, light, ringEl, breathe, here, hereL, nm, btn, cy: cy - oy, skew: 0, sy: 1, x: 0, top: gy - 8 - oy });
    });
    place(0);
  }
  /** One transform per column element (compositor only): position + struck sway + telescope / bow. */
  function applyT(c) {
    c.col.style.transform = `translate(${fmt(c.x - M.ox)}px,${fmt(M.base - M.oy)}px)${c.skew ? ` skewX(${fmt(c.skew)}deg)` : ''}${c.sy !== 1 ? ` scaleY(${fmt(c.sy)})` : ''}`;
  }

  /** Writes every column's x (focus spacing on desktop; the phone rail centres M.centred). */
  function place(ms) {
    const g = { k: M.k, base: M.base, cx: M.cx, step: layout.isPhone ? 132 : 0 };
    const f = layout.isPhone ? -1 : (M.focus >= 0 ? M.focus : M.hover);
    for (const c of M.cols) {
      const x = baseX(c.i, g, f);
      c.x = x;
      c.col.style.transition = ms > 0 && !reduced() ? `transform ${ms}ms cubic-bezier(.16,1,.3,1),opacity .48s linear` : '';
      applyT(c);
      c.nm.style.transform = `translate(${fmt(x)}px,${fmt(M.base + 10)}px) translateX(-50%)`;
      const top = M.base + c.top - 6;
      Object.assign(c.btn.style, { left: `${fmt(x - Math.max(30, 2.4 * M.k))}px`, top: `${fmt(top)}px`, width: `${fmt(2 * Math.max(30, 2.4 * M.k))}px`, height: `${fmt(M.base - top + 40)}px` });
      c.nm.classList.toggle('is-off', layout.isPhone && Math.abs(c.i - M.centred) > 1);
    }
  }

  // ── readout ──────────────────────────────────────────────────────────────────────────────────────────────────
  function row(label, cls, text, key) {
    const r = el('div', 't0-row', null, ro, { data: { row: key } });
    el('p', 't-label', label, r);
    const v = el('p', cls, text, r);
    return { r, v };
  }
  function fillReadout(c, focused) {
    clear(ro);
    el('i', 't0-tick', null, ro, { attrs: { 'aria-hidden': 'true' } });
    const m = c.m;
    row('MEMBER', 't-heading', `${m.name} · «${m.callsign}»`, 'member');
    const st = row('STATUS', 't-body', null, 'status');
    el('i', `t0-dot t0-dot--${DOT[m.status] || 'pewter'}`, null, st.v);
    st.v.appendChild(document.createTextNode(m.status));
    if (m.role) row('РОЛЬ', 't-body', m.role.toLowerCase(), 'role');
    row('LEVEL', 't-body', String(m.level), 'level');
    row('MISSIONS', 't-body', String(m.missions), 'missions');
    const ach = (m.achievements || []).map(achievementById).filter(Boolean);
    if (ach.length) {
      const a = row('ACHIEVEMENTS', 't0-icons', null, 'achievements');
      for (const r of ach) {
        const b = el('button', 't0-icon', null, a.v, { attrs: { 'aria-label': r.title, type: 'button' }, data: { go: `#/insignia/${r.id}` } });
        const s = svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24' }, b);
        svg('path', { d: relicIconSvg(r.shape, 24) }, s);
        b.addEventListener('click', () => ctx.director.go(`#/insignia/${r.id}`, { source: 'hall' }));
      }
    }
    if (m.trait) el('p', 't-body t0-row__trait', `«${m.trait}»`, ro);
    if (focused && m.joke) { el('p', 't-label t0-row__k', 'ВНУТРЕННЯЯ ШУТКА', ro); el('p', 't-body', m.joke, ro); }
    if (c.own) {
      const has = !!(state.data && state.data.glyph && state.data.glyph.length);
      el('p', 't-body t0-row__k', has ? 'Это твой знак. Можно вырезать новый.' : 'Твой знак ещё не вырезан.', ro);
      const v = el('button', 'verb t-label', 'МАСТЕРСКАЯ →', ro, { qa: 'workshop-verb', attrs: { type: 'button' } });
      v.addEventListener('click', () => ctx.director.go('#/members/workshop', { source: 'hall' }));
      if (focused) sbor.readoutRow(ro);
    }
    // rows write in, 60 ms apart
    Array.from(ro.children).forEach((n, k) => { if (k) { n.classList.add('t0-in'); n.style.transitionDelay = `${reduced() ? 0 : k * 60}ms`; } });
    ro.hidden = false;
    (void ro.offsetWidth, ro.classList.add('is-in'));
    placeReadout(c);
  }
  function placeReadout(c) {
    if (layout.isPhone) return;
    const left = c.i < list.length / 2;
    const x = left ? c.x + 3.4 * M.k + 30 : c.x - 3.4 * M.k - 30 - 360;
    ro.style.transform = `translate(${fmt(Math.max(24, x))}px,${fmt(Math.max(96, M.base + c.cy - 40))}px)`;
  }
  function setHover(i, keyboard) {
    if (M.hover === i) return;
    M.hover = i;
    for (const c of M.cols) c.col.classList.toggle('is-dim', i >= 0 && c.i !== i);
    if (i >= 0) {
      const c = M.cols[i];
      climb(i, 320);
      telescope(c);
      // the leader / readout starts at 120 ms (SPEC §6.2), only if the column is still the hovered one
      if (!layout.isPhone) after(120, () => { if (M.hover === i && M.focus < 0) fillReadout(c, false); });
      if (ctx.audio && !keyboard) ctx.audio.play('hoverTick', { x: c.x });
    } else if (M.focus < 0 && !layout.isPhone) { ro.classList.remove('is-in'); ro.hidden = true; }
    place(480);
  }
  function telescope(c) {
    if (reduced()) return;
    for (let st = 1; st <= 5; st++) after(st * 45, () => { if (M.hover === c.i || M.focus === c.i) { c.sy = 1 + 0.03 * st; c.col.style.transition = ''; applyT(c); if (ctx.audio) ctx.audio.play('tick', { n: st }); } });
  }
  function relax(c) { if (c.sy !== 1 || c.skew) { c.sy = 1; c.skew = 0; applyT(c); } }

  /** Light climbing the generators base → capital (ms); times 2 = a double climb (ГОСТИ). */
  function climb(i, ms, times = 1) {
    const c = M.cols[i];
    if (!c) return;
    let n = 0;
    const run = () => {
      c.col.style.setProperty('--climb', `${reduced() ? 0 : ms}ms`);
      c.col.classList.remove('is-lit');
      void c.light.getBoundingClientRect;
      requestAnimationFrame(() => {
        c.col.classList.add('is-lit');
        after((reduced() ? 0 : ms) + 20, () => { if (++n < times) run(); else after(420, () => c.col.classList.remove('is-lit')); });
      });
    };
    run();
  }
  function flashCap(i, token = 'white', ms = 140) {
    const c = M.cols[i];
    if (!c) return;
    const cls = token === 'silver40' ? 'is-cap40' : 'is-capw';
    c.col.classList.add(cls);
    after(ms, () => c.col.classList.remove(cls));
  }
  /** Struck sway (ω 18, ζ 0.18) at the capital, up to `amp` px (sign = direction) — a compositor skew. */
  function sway(i, amp) {
    const c = M.cols[i];
    if (!c || reduced()) return;
    const t0 = loop.now;
    if (c.swayId) loop.remove(c.swayId);
    c.col.style.transition = '';
    c.swayId = loop.add(() => {
      const t = (loop.now - t0) / 1000;
      const a = amp * Math.exp(-0.18 * 18 * t) * Math.sin(18 * Math.sqrt(1 - 0.0324) * t);
      c.skew = -Math.atan(a / (H * M.k)) * 57.3;
      if (t > 0.9) { loop.remove(c.swayId); c.swayId = 0; c.skew = 0; }
      applyT(c);
    }, ORDER.UI);
  }

  // ── strum / ВСЕ ВМЕСТЕ ───────────────────────────────────────────────────────────────────────────────────────
  /** at: the gesture's own event time (perf ms) — the 1,500 ms window is the hand's, not the renderer's */
  function pluck(i, dir, at) {
    const c = M.cols[i];
    if (!c) return;
    const now = at > 0 ? at : performance.now();
    M.plucks[i] = now;
    sway(i, 0.4 * M.k * (dir || 1));
    climb(i, 180);
    if (ctx.audio) ctx.audio.play('memberNote', { hz: hz(c.m.note) });
    if (layout.isPhone) vibrate(VIBE.tick);
    let all = list.length >= 2;
    for (let k = 0; k < list.length; k++) if (!(M.plucks[k] && now - M.plucks[k] <= 1500)) all = false;
    if (all && performance.now() - M.chordAt > 4000) chord();
  }
  function chord() {
    M.chordAt = performance.now();
    if (ctx.audio) ctx.audio.play('chord', { hz: list.map((m) => hz(m.note)) });
    const op = M.cols.find((c) => c.own) || M.cols[0];
    const bow = (c) => {
      flashCap(c.i, 'white', 160);
      if (reduced()) return;
      c.col.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      c.sy = 0.93; applyT(c);
      after(600 + 1600, () => { c.col.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)'; c.sy = 1; applyT(c); });
    };
    bow(op);
    after(240, () => M.cols.forEach((c) => { if (c !== op) bow(c); }));
    if (ctx.lead) ctx.lead.show(WORLD.clan.motto, { ms: 3200 });
    if (ctx.secrets) ctx.secrets.discover('S04', { anchor: { x: op.x, y: M.base + op.cy } });
  }
  let prev = { x: NaN, t: 0 };
  input.observe((p) => {
    if (!M.shown || app.room !== 'MEMBERS' || app.phase !== 'idle' || layout.isPhone || T.lostMode) { prev.x = NaN; return; }
    const x = p.x, t = input.pointer._t > 0 ? input.pointer._t : performance.now();
    const dx = Number.isFinite(prev.x) ? x - prev.x : 0;
    // fast = the SPEC 0.25 px/ms, measured on the raw segment too (a lagging page delivers a sweep as long jumps)
    const fast = p.speed > 250 || Math.abs(dx) / Math.max(1, t - prev.t) > 0.25 || Math.abs(dx) >= 24;
    if (Math.abs(dx) >= 12) M.sweepAt = t;
    if (Number.isFinite(prev.x) && fast && p.y > M.base - (H + 6) * M.k && p.y < M.base + 60) {
      for (const c of M.cols) {
        const band = Math.max(18, 1.6 * M.k);
        if ((prev.x < c.x - band && x >= c.x - band) || (prev.x > c.x + band && x <= c.x + band) || (Math.min(prev.x, x) < c.x && Math.max(prev.x, x) > c.x)) {
          if (t - (c.lastPluck || 0) > 120) { c.lastPluck = t; pluck(c.i, Math.sign(x - prev.x), t); }
        }
      }
    }
    prev.x = x; prev.t = t;
  });
  // hover by pointer position (desktop), polled per frame so a resting pointer still hovers; not while strumming fast
  loop.add(() => {
    if (!M.shown || layout.isPhone || M.focus >= 0 || app.room !== 'MEMBERS' || app.phase !== 'idle' || T.lostMode) return;
    const p = input.pointer;
    if (p.type === 'touch' || performance.now() - (M.sweepAt || 0) < 160) return;   // a sweep is a strum, not a hover
    let hit = -1;
    for (const c of M.cols) if (Math.abs(p.x - c.x) < Math.max(26, 2.4 * M.k) && p.y > M.base + c.top - 10 && p.y < M.base + 50) hit = c.i;
    setHover(hit);
  }, ORDER.UI);

  // ── navigation ───────────────────────────────────────────────────────────────────────────────────────────────
  function colAt(x, y) {
    for (const c of M.cols) if (Math.abs(x - c.x) < Math.max(26, 2.4 * M.k) && y > M.base + c.top - 10 && y < M.base + 60) return c;
    return null;
  }
  function go(id) { if (ctx.director && !ctx.director.busy()) ctx.director.go(`#/members/${id}`, { source: 'hall' }); }
  function focusOn(id) {
    const c = M.cols.find((x) => x.m.id === id);
    if (!c) return;
    M.focus = c.i;
    if (layout.isPhone) { M.centred = c.i; place(480); }
    setHover(-1); M.hover = -2; setHover(c.i);
    fillReadout(c, true);
    melody(c);
    if (layout.isPhone) sheetFor(c, true);
  }
  function melody(c) {
    const edges = c.own ? (state.data && state.data.glyph) : c.m.glyph;
    if (!edges || !ctx.audio) return;
    glyphNotes(edges).forEach((f, k) => after(k * 120, () => ctx.audio.play('workshopNode', { hz: f })));
  }
  function sheetFor(c, full) {
    if (!ctx.sheet) return;
    const box = el('div', 't0-sheetbox');
    const peek = el('div', null, null, box);
    el('p', 't-heading', `${c.m.name} · «${c.m.callsign}»`, peek);
    const st = el('p', 't-body t0-peekrow', null, peek);
    el('i', `t0-dot t0-dot--${DOT[c.m.status] || 'pewter'}`, null, st);
    st.appendChild(document.createTextNode(c.m.status));
    if (c.m.role) { el('span', 't-label', 'РОЛЬ', st); el('span', 't-body', c.m.role.toLowerCase(), st); }
    fillReadout(c, full);
    const rest = ro.cloneNode(true);
    rest.hidden = false; rest.className = 't0-sheetro is-in'; rest.style.transform = '';
    rest.querySelectorAll('.t0-tick,[data-row="member"],[data-row="status"],[data-row="role"]').forEach((x) => x.remove());
    rest.addEventListener('click', (e) => { const b = e.target.closest('.t0-icon[data-go]'); if (b) ctx.director.go(b.dataset.go, { source: 'hall' }); });
    rest.querySelectorAll('[data-qa="workshop-verb"]').forEach((b) => b.addEventListener('click', () => ctx.director.go('#/members/workshop', { source: 'hall' })));
    clear(ro); ro.hidden = true;   // one copy of each control: the sheet's
    ctx.sheet.set(rest, { peek, state: full ? 'full' : 'peek' });
  }

  // phone: a horizontal swipe turns the arc by one column (and plucks what it crosses); tap the centred one → focus
  input.push({
    name: 't0-members',
    onGesture(g) {
      if (!M.shown || app.room !== 'MEMBERS' || T.lostMode) return false;
      // a tap on a column focuses it (the proxies' own clicks only serve the keyboard: WP0 captures the press)
      if (g.type === 'tap') {
        const c = colAt(g.x, g.y);
        if (!c || M.suppressClick) { M.suppressClick = false; return !!c; }
        if (layout.isPhone && c.i !== M.centred) { M.centred = c.i; M.focus = -1; place(480); sheetFor(c, false); return true; }
        go(c.m.id);
        return true;
      }
      if (!layout.isPhone) return false;
      if (g.type === 'swipe' && (g.dir === 'left' || g.dir === 'right')) {
        const from = M.centred;
        M.centred = Math.max(0, Math.min(list.length - 1, M.centred + (g.dir === 'left' ? 1 : -1)));
        if (M.centred !== from) {
          for (let k = Math.min(from, M.centred); k <= Math.max(from, M.centred); k++) pluck(k, g.dir === 'left' ? -1 : 1);
          if (ctx.audio) ctx.audio.play('tick', {});
          vibrate(VIBE.tick);
          M.focus = -1;
          place(480);
          sheetFor(M.cols[M.centred], false);
        }
        return true;
      }
      return false;
    },
  });

  const sbor = createSbor(ctx, T, M, { climb, flashCap, sway, list, go });
  ctx.bus.on('glyph:saved', () => { if (M.cols.length) build(); });

  const hall = {
    id: 'MEMBERS',
    section: sec,
    show(route) {
      if (!M.cols.length) build();
      M.shown = true;
      const id = route && route.sub && route.sub !== 'workshop' ? route.sub : null;
      sbor.attach(true);
      if (id) focusOn(id);
      else {
        M.focus = -1; M.hover = -2; setHover(-1);
        for (const c of M.cols) relax(c);
        ro.classList.remove('is-in'); ro.hidden = true;
        if (layout.isPhone) { const op = list.findIndex((m) => m.id === opId); M.centred = op >= 0 ? op : 0; place(0); sheetFor(M.cols[M.centred], false); }
        else place(480);
      }
    },
    hide() {
      M.shown = false; M.focus = -1; M.hover = -1;
      sbor.attach(false);
      if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
    },
    relayout() { if (M.cols.length) { build(); if (M.focus >= 0) fillReadout(M.cols[M.focus], true); } },
    onKey(e) {
      if (e.key === 'Escape' && M.focus >= 0) { ctx.director.go('#/members', { source: 'kbd' }); return true; }
      return false;
    },
    hint(secret) {
      if (secret !== 'S04') return;
      M.cols.forEach((c, k) => after(k * 90, () => climb(c.i, 180)));
    },
  };
  void operatorMember; void svgCross;
  return hall;
}
