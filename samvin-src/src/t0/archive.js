// t0/archive.js — WP11. ARCHIVE «ЛЕТОПИСЬ» in T0 (SPEC §6.4, §12.5 "vertical timeline of bands"; SPEC-ADDENDUM A3.5 deed
// bands, A11.6 where): the wall of time as a vertical core sample — one horizontal band per entry, newest at the top
// (legend 3.0 m, achievement 1.6, moment 1.2, joke 0.8, his deed bands 1.0 m at --silver 30 %, gaps 0.4 m), each drawn as
// 3–5 stratification hairlines with seeded waviness (legends --silver 40 %, the rest --slate); the joke bands carry their
// marginalia (BODY 15 px, --silver 80 %, [data-qa=marginalia]) along the band, readable whenever it is in view; unfound
// hidden jokes leave no trace. The centred band sits on the reading hairline: DATA `dd.mm` + MICRO year beside it and
// the reading block on its tick (LABEL `ЛЕГЕНДА · В ЖИЗНИ · dd.mm.yyyy`, HEADING, BRIEF, КТО chips, rarity, В ХРАНИЛИЩЕ →).
// Wheel / vertical drag / ← → ↑ ↓ move band by band (soft detents); 800 ms of wheel past an end goes to the next hall.
// «ДО НАЧАЛА»: one 2 px --white point, BODY «Здесь ещё ничего не было. Потом пришли вы.», LABEL founded. Anniversary:
// that legend's band glows electrum 2,500 ms on arrival and keeps an ember edge all day; status «сегодня …».
import { WORLD, whereLabel, memberById, achievementById } from '../data/world.js';
import { buildTimeline, BEFORE_TEXT } from '../halls/archive/timeline.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { after } from '../core/clock.js';
import { fmtDate } from '../core/ru.js';
import { anniversaries, now as clockNow } from '../core/time.js';
import { svg, el, fmt, clear, block, glyphPath, rand, reduced } from './dom.js';
import { relicIconSvg } from '../halls/insignia/shapes.js';

const KIND = { legend: 'ЛЕГЕНДА', achievement: 'ДОСТИЖЕНИЕ', moment: 'МОМЕНТ', joke: 'ШУТКА' };
const RARITY = { 'обычная': 'ОБЫЧНАЯ', 'редкая': 'РЕДКАЯ', 'легендарная': 'ЛЕГЕНДАРНАЯ' };

function allBands(ctx) {
  const base = buildTimeline();
  const before = base.pop();
  let deeds = [];
  try { deeds = ctx.deeds && ctx.deeds.bands ? ctx.deeds.bands() : []; } catch (e) { deeds = []; }
  const list = base.concat(deeds.map((d) => ({ kind: 'deed', id: d.id, date: d.date, title: d.title, text: d.text, label: d.label, who: d.who || [], height: 1.0 })));
  list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  list.push(before);
  return list;
}

export function createArchive(ctx, T) {
  const sec = T.section('ARCHIVE');
  const view = el('div', 't0-core', null, sec);
  const strip = el('div', 't0-strip', null, view);
  const lines = svg('svg', { class: 't0-strip__svg', 'aria-hidden': 'true' }, strip);
  const marg = el('div', 't0-strip__m', null, strip);
  const reading = svg('svg', { class: 't0-readline', 'aria-hidden': 'true' }, view);
  const date = el('div', 't0-date', null, view);
  const dateD = el('p', 't-data', null, date);
  const dateY = el('p', 't-micro', null, date);
  const rb = block(sec, 't0-reading');
  const A = { bands: [], ys: [], s: 40, i: 0, x0: 0, w: 0, lineY: 0, wheelAcc: 0, wheelEnd: 0, drag: null, anniv: null };

  function geom() {
    if (layout.isPhone) return { x0: 112, w: layout.w - 120, lineY: 300 + layout.safe.t, s: 34 };
    return { x0: layout.w * 0.40, w: layout.w * 0.33, lineY: layout.h * 0.30, s: 40 };
  }
  function build() {
    const g = geom();
    A.s = g.s; A.x0 = g.x0; A.w = g.w; A.lineY = g.lineY;
    A.bands = allBands(ctx);
    clear(lines); clear(marg);
    let y = 0;
    A.ys = [];
    A.groups = [];
    const W = g.w;
    let total = 0;
    for (const b of A.bands) total += b.height * g.s + 0.4 * g.s;
    lines.setAttribute('width', fmt(W + 140)); lines.setAttribute('height', fmt(total + 40));
    lines.setAttribute('viewBox', `-140 0 ${fmt(W + 140)} ${fmt(total + 40)}`);
    const ann = new Set(anniversaries(clockNow()).map((l) => `legend-${l.id}`));
    // the core sample: its two sides and the dated ruler on the left
    svg('path', { d: `M0 0V${fmt(total)}M${fmt(W)} 0V${fmt(total)}`, class: 't0-core__side' }, lines);
    A.bands.forEach((b, i) => {
      const h = b.height * g.s;
      const r = rand(i * 131 + b.id.length * 7);
      const grp = svg('g', { class: `t0-band t0-band--${b.kind}${ann.has(b.id) ? ' is-anniv' : ''}`, 'data-id': b.id }, lines);
      // boundaries + the stratification hairlines inside (seeded waviness, 0.08 m)
      let d = `M0 ${fmt(y)}H${fmt(W)}M0 ${fmt(y + h)}H${fmt(W)}`;
      const n = b.kind === 'legend' ? 3 : b.kind === 'joke' || b.kind === 'before' ? 0 : 2;
      for (let q = 0; q < n; q++) {
        const yy = y + (h * (q + 1)) / (n + 1);
        const ph = r() * 6.28, f = 1 + r() * 2, amp = 0.06 * g.s;
        let w = '';
        for (let k = 0; k <= 16; k++) { const xx = (W * k) / 16; w += `${k ? 'L' : 'M'}${fmt(xx)} ${fmt(yy + amp * Math.sin(ph + (f * 6.28 * k) / 16))}`; }
        svg('path', { d: w, class: 't0-band__w' }, grp);
      }
      if (b.kind !== 'before') svg('path', { d, class: 't0-band__b' }, grp);
      else svg('circle', { cx: W * 0.5, cy: y + h / 2, r: 1, class: 't0-band__pt' }, lines);
      // ruler: a tick + MICRO date at the band's top
      svg('path', { d: `M-10 ${fmt(y)}H0`, class: 't0-core__tick' }, lines);
      if (b.kind !== 'before') {
        const t = svg('text', { x: -16, y: y + 3, class: 't-micro t0-core__date', 'text-anchor': 'end', 'dominant-baseline': 'hanging' }, grp);
        t.textContent = fmtDate(b.date, 'dd.mm.yyyy');
      }
      // finds: the relic of an achievement, a fossil for a legend, a pebble for a moment (outline icons, right side)
      if (b.kind === 'achievement' || b.kind === 'legend' || b.kind === 'moment') {
        const a = b.kind === 'achievement' ? achievementById(b.id.replace(/^achievement-/, '')) : null;
        const shape = a ? a.shape : b.kind === 'legend' ? 'stellated' : 'twisted';
        const sz = Math.min(24, h * 0.7);
        const ig = svg('g', { class: 't0-band__find', transform: `translate(${fmt(W - sz - 10)} ${fmt(y + (h - sz) / 2)}) scale(${fmt(sz / 24)})` }, grp);
        svg('path', { d: relicIconSvg(shape, 24) }, ig);
      }
      if (b.kind === 'joke') {
        const mg = el('p', 't-body t0-marg', b.text, marg, { qa: 'marginalia', data: { id: b.id } });
        mg.style.transform = `translate(${fmt(W * 0.04)}px,${fmt(y + h / 2)}px) translateY(-50%)`;
      }
      A.groups.push(grp);
      A.ys.push(y + h / 2);
      y += h + 0.4 * g.s;
    });
    strip.style.left = `${fmt(g.x0 - 140)}px`; strip.style.width = `${fmt(W + 140)}px`;
    marg.style.left = '140px';
    clear(reading);
    reading.setAttribute('viewBox', `0 0 ${layout.w} ${layout.h}`);
    svg('path', { d: `M${fmt(g.x0 - 24)} ${fmt(g.lineY)}H${fmt(g.x0 + W + 24)}`, class: 't0-readline__l' }, reading);
    svg('path', { d: `M${fmt(g.x0 + W + 20.5)} ${fmt(g.lineY)}h7M${fmt(g.x0 + W + 24)} ${fmt(g.lineY - 3.5)}v7`, class: 't0-cross' }, reading);
    A.anniv = A.bands.findIndex((b) => ann.has(b.id));
  }
  function focus(i, ms) {
    A.i = Math.max(0, Math.min(A.bands.length - 1, i));
    const y = A.lineY - A.ys[A.i];
    strip.style.transition = ms > 0 && !reduced() ? `transform ${ms}ms cubic-bezier(.16,1,.3,1)` : 'none';
    strip.style.transform = `translate3d(0,${fmt(y)}px,0)`;
    (A.groups || []).forEach((g, j) => g.classList.toggle('is-focus', j === A.i));
    fillReading(A.bands[A.i]);
  }
  function fillReading(b) {
    clear(rb);
    el('i', 't0-tick', null, rb, { attrs: { 'aria-hidden': 'true' } });
    if (b.kind === 'before') {
      el('p', 't-label', fmtDate(WORLD.clan.founded, 'dd.mm.yyyy'), rb);
      el('p', 't-body', BEFORE_TEXT, rb);
      dateD.textContent = ''; dateY.textContent = '';
    } else {
      const src = b.kind === 'legend' ? WORLD.legends.find((l) => `legend-${l.id}` === b.id)
        : b.kind === 'moment' ? WORLD.moments.find((l) => `moment-${l.id}` === b.id)
          : b.kind === 'achievement' ? WORLD.achievements.find((l) => `achievement-${l.id}` === b.id) : null;
      const w = src && b.kind !== 'joke' ? whereLabel(src.where) : null;
      const kind = b.kind === 'deed' ? (b.label || 'ДЕЛО') : KIND[b.kind];
      el('p', 't-label', `${kind}${w ? ` · ${w}` : ''} · ${fmtDate(b.date, 'dd.mm.yyyy')}`, rb, { qa: 'reading-label' });
      if (b.title) el('p', 't-heading', b.title, rb);
      if (b.text && b.kind !== 'joke') el('p', 't-brief', b.text, rb);
      if (b.kind === 'joke') el('p', 't-body', b.text, rb);
      const who = (b.who || []).map(memberById).filter(Boolean);
      if (who.length) {
        el('p', 't-label t0-ch__l', 'КТО', rb);
        const chips = el('div', 't0-chips', null, rb);
        for (const p of who) {
          const c = el('button', 'chip', null, chips, { attrs: { type: 'button' } });
          if (p.glyph && p.glyph.length) { const s = svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', class: 't0-chipg' }, c); svg('path', { d: glyphPath(p.glyph, 3, 3, 18) }, s); }
          c.appendChild(document.createTextNode(p.callsign));
          c.dataset.go = `#/members/${p.id}`;
        }
      }
      if (b.kind === 'achievement') {
        if (b.rarity) el('p', 't-label t0-ch__l', RARITY[b.rarity] || String(b.rarity).toUpperCase(), rb);
        const a = achievementById(b.id.replace(/^achievement-/, ''));
        if (a) el('button', 'verb t-label', 'В ХРАНИЛИЩЕ →', rb, { attrs: { type: 'button' }, data: { go: `#/insignia/${a.id}` } });
      }
      dateD.textContent = fmtDate(b.date, 'dd.mm');
      dateY.textContent = String(b.date).slice(0, 4);
    }
    date.style.transform = `translate(${fmt(A.x0 - (layout.isPhone ? 10 : 150))}px,${fmt(A.lineY)}px) translate(-100%,-50%)`;
    if (layout.isPhone && ctx.sheet) {
      const peek = el('div');
      el('p', 't-label', rb.querySelector('.t-label') ? rb.querySelector('.t-label').textContent : '', peek);
      if (b.title) el('p', 't-heading', b.title, peek);
      // the sheet body: the reading without the peek's label and title (one copy of each), its verbs live
      const body = rb.cloneNode(true);
      body.className = 't0-sheetread';
      body.querySelectorAll('.t0-tick,[data-qa="reading-label"],.t-heading').forEach((x) => x.remove());
      body.addEventListener('click', goFrom);
      ctx.sheet.set(body, { peek, state: 'peek' });
    }
  }
  function goFrom(e) {
    const b = e.target && e.target.closest ? e.target.closest('[data-go]') : null;
    if (b && ctx.director) ctx.director.go(b.dataset.go, { source: 'hall' });
  }
  rb.addEventListener('click', goFrom);
  function step(d) {
    const j = Math.max(0, Math.min(A.bands.length - 1, A.i + d));
    if (j === A.i) return false;
    focus(j, 480);
    if (ctx.audio) ctx.audio.play('tick', { n: j });
    const b = A.bands[j];
    ctx.director.go(`#/archive/${b.id}`, { source: 'hall', replace: true });
    return true;
  }

  input.push({
    name: 't0-archive',
    onGesture(g) {
      if (app.room !== 'ARCHIVE' || T.lostMode || app.phase !== 'idle') return false;
      if (g.type === 'wheel') {
        A.wheelAcc += g.deltaY;
        const now = performance.now();
        if (Math.abs(A.wheelAcc) >= 80) {
          const d = A.wheelAcc > 0 ? 1 : -1;
          A.wheelAcc = 0;
          if (!step(d)) {
            if (!A.wheelEnd) A.wheelEnd = now;
            else if (now - A.wheelEnd >= 800) { A.wheelEnd = 0; ctx.director.go(d > 0 ? '#/members' : '#/signal', { source: 'wheel' }); }
          } else A.wheelEnd = 0;
        }
        return true;
      }
      if (g.type === 'down') { A.drag = { y0: g.y, i0: A.i }; return false; }
      if (g.type === 'swipe' && (g.dir === 'up' || g.dir === 'down')) { step(g.dir === 'up' ? 1 : -1); return true; }
      return false;
    },
  });

  const hall = {
    id: 'ARCHIVE',
    section: sec,
    show(route) {
      if (!A.bands.length) build();
      const sub = route && route.sub;
      let i = sub ? A.bands.findIndex((b) => b.id === sub) : -1;
      if (i < 0 && !sub && A.anniv >= 0) {
        i = A.anniv;
        const l = anniversaries(clockNow())[0];
        if (l && ctx.status) ctx.status.say('anniversary', { title: l.title, years: l.years });
        const p = lines.querySelector(`[data-id="${A.bands[i].id}"]`);
        if (p) { p.classList.add('is-electrum'); after(2500, () => p.classList.remove('is-electrum')); }
      }
      if (sub && i < 0) i = A.i;
      if (i < 0) i = 0;
      focus(i, sub && i !== A.i ? 480 : 0);
    },
    hide() { if (layout.isPhone && ctx.sheet) ctx.sheet.set(null); },
    relayout() { build(); focus(A.i, 0); },
    onKey(e) {
      if (e.key === 'ArrowRight') return step(1) || true;
      if (e.key === 'ArrowLeft') return step(-1) || true;
      return false;
    },
  };
  ctx.bus.on('deed:done', () => { if (A.bands.length) { build(); if (app.room === 'ARCHIVE') focus(A.i, 0); } });
  return hall;
}
