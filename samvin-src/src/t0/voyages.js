// t0/voyages.js — WP11. VOYAGES «ВЫЛАЗКИ» in T0 (SPEC §6.3, §12.5; SPEC-ADDENDUM A3.4 T0, A11.6 where): the polar
// survey floor in plan (24 radials, rings every 10 m), the hatches on the golden spiral (mission k at r = 14·√k,
// θ = k·137.508°) as 4.5 m rings with 8 hairline iris blades (done: ember rim, iris open, faint light; active: the iris
// breathes 10 ↔ 35 % with an ember tick at the rim top; new: silver rim, hover opens 18 %; locked: closed, pewter blades
// flickering at 12 Hz; sealed 000: closed, steel; a proposal: dashed rim) — each hatch its own small layer — and the
// schedule beside the plan: one row per hatch ([data-qa=hatch] data-code / data-k / data-state): LABEL `004 · В ПУТИ`
// (locked: `0?? · СИГНАЛ ЗАШИФРОВАН 20%`), BODY 15 px title and MICRO `В ИГРЕ` / `В ЖИЗНИ` for unlocked states.
// Select → ШЛЮЗ → the chamber (#/voyages/<code>, t0/chamber.js); locked / sealed → the shudder, a soft thud and the
// BODY reason. On arrival: returned probes (status probe.back) and live decodes (status mission.decoded). Proposals:
// the verb `ПРЕДЛОЖИТЬ ВЫЛАЗКУ →` (WP13's sheet), the dashed hatches and their chamber text inline (never a URL).
import { WORLD, whereLabel, EMPTY_LINE } from '../data/world.js';
import { missionView, collectReturnedProbes, collectDecoded } from '../halls/voyages/missionModel.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { after } from '../core/clock.js';
import { fmtDate } from '../core/ru.js';
import { beamWrite } from '../ui/text.js';
import { svg, el, fmt, clear, block, reduced } from './dom.js';
import { createChamber } from './chamber.js';

const GOLD = (137.508 * Math.PI) / 180;

function irisPath(r, ap) {
  let d = '';
  const rho = r * Math.max(0, Math.min(1, ap));
  for (let j = 0; j < 8; j++) {
    const a = (j * Math.PI) / 4;
    const x0 = r * Math.cos(a), y0 = r * Math.sin(a);
    const b = a + 1.05;
    const x1 = rho * Math.cos(b), y1 = rho * Math.sin(b);
    d += `M${fmt(x0)} ${fmt(y0)}L${fmt(x1)} ${fmt(y1)}`;
  }
  return d;
}

export function createVoyages(ctx, T) {
  const sec = T.section('VOYAGES');
  const field = el('div', 't0-field', null, sec, { attrs: { 'aria-hidden': 'true' } });
  const floor = svg('svg', { class: 't0-floor' }, field);
  const hatchLayer = el('div', 't0-hatches', null, field);
  const sched = el('div', 't0-sched', null, sec);
  const listEl = el('ol', 't0-sched__list', null, sched);
  const why = el('p', 't-body t0-why', null, sched);
  const propV = el('button', 'verb t-label t0-propv', 'ПРЕДЛОЖИТЬ ВЫЛАЗКУ →', sec, { qa: 'propose', attrs: { type: 'button' } });
  const propFull = el('p', 't-micro t0-propv', null, sec);
  const propBox = block(sec, 't0-propbox');
  propBox.hidden = true;
  const empty = el('p', 't-body t0-empty', EMPTY_LINE.missions, sec);
  const chamber = createChamber(ctx, T, sec);
  const V = { k: 3.8, cx: 0, cy: 0, items: [], open: null, breath: 0 };

  propV.addEventListener('click', () => { if (ctx.host && ctx.host.proposals) ctx.host.proposals.openSheet(); });

  function geom() {
    if (layout.isPhone) { const R = Math.min(layout.w * 0.46, 200); return { cx: layout.w / 2, cy: 150 + layout.safe.t + R, k: R / 60, R }; }
    const R = Math.min(layout.h * 0.30, 260);
    return { cx: layout.w * 0.40, cy: layout.h * 0.33, k: R / 60, R };
  }
  function drawFloor(g) {
    clear(floor);
    const w = layout.w, h = layout.h;
    floor.setAttribute('viewBox', `0 0 ${w} ${h}`);
    let d = '';
    for (let r = 10; r <= 90; r += 10) {
      const rr = r * g.k;
      d += `M${fmt(g.cx + rr)} ${fmt(g.cy)}A${fmt(rr)} ${fmt(rr)} 0 1 0 ${fmt(g.cx - rr)} ${fmt(g.cy)}A${fmt(rr)} ${fmt(rr)} 0 1 0 ${fmt(g.cx + rr)} ${fmt(g.cy)}`;
    }
    let rad = '';
    for (let j = 0; j < 24; j++) { const a = (j * Math.PI) / 12; rad += `M${fmt(g.cx + 4 * g.k * Math.cos(a))} ${fmt(g.cy + 4 * g.k * Math.sin(a))}L${fmt(g.cx + 90 * g.k * Math.cos(a))} ${fmt(g.cy + 90 * g.k * Math.sin(a))}`; }
    svg('path', { d, class: 't0-floor__r' }, floor);
    svg('path', { d: rad, class: 't0-floor__a' }, floor);
    svg('path', { d: `M${fmt(g.cx - 5)} ${fmt(g.cy)}h10M${fmt(g.cx)} ${fmt(g.cy - 5)}v10`, class: 't0-cross' }, floor);
    // 10 m scale bar under the plan
    const y = g.cy + 66 * g.k;
    svg('path', { d: `M${fmt(g.cx - 5 * g.k)} ${fmt(y)}h${fmt(10 * g.k)}M${fmt(g.cx - 5 * g.k)} ${fmt(y - 3)}v6M${fmt(g.cx + 5 * g.k)} ${fmt(y - 3)}v6`, class: 't0-dim__l' }, floor);
    const t = svg('text', { x: g.cx, y: y + 14, class: 't-micro', 'text-anchor': 'middle' }, floor);
    t.textContent = '10 М';
  }

  /** One hatch: its own small SVG layer (state classes animate on the compositor). */
  function hatch(item, g) {
    const r = Math.max(10, 4.5 * g.k);
    const size = Math.ceil(r * 2 + 16);
    const box = el('div', `t0-hatch t0-hatch--${item.state}`, null, hatchLayer, { data: { code: item.code } });
    Object.assign(box.style, { width: `${size}px`, height: `${size}px`, transform: `translate(${fmt(item.x - size / 2)}px,${fmt(item.y - size / 2)}px)` });
    const s = svg('svg', { width: size, height: size, viewBox: `${-size / 2} ${-size / 2} ${size} ${size}` }, box);
    if (item.state === 'done') svg('circle', { r: r * 0.92, class: 't0-hatch__light' }, s);
    svg('circle', { r, class: 't0-hatch__rim' }, s);
    const ap = item.state === 'done' ? 1 : item.state === 'active' ? 0.22 : 0.02;
    const iris = svg('path', { d: irisPath(r, ap), class: 't0-hatch__iris' }, s);
    if (item.state === 'active') svg('path', { d: `M0 ${fmt(-r - 4)}V${fmt(-r + 3)}`, class: 't0-hatch__tick' }, s);
    const lab = svg('text', { x: 0, y: r + 13, class: 't-micro', 'text-anchor': 'middle' }, s);
    lab.textContent = item.numberShown;
    item.box = box; item.iris = iris; item.r = r;
    return box;
  }

  function build() {
    clear(hatchLayer); clear(listEl);
    const g = geom();
    V.k = g.k; V.cx = g.cx; V.cy = g.cy;
    drawFloor(g);
    V.items = WORLD.missions.map((m, k) => {
      const v = missionView(m);
      const rr = 14 * Math.sqrt(k) * g.k, a = k * GOLD;
      return { ...v, k, x: g.cx + rr * Math.cos(a), y: g.cy + rr * Math.sin(a), where: m.where };
    });
    const props = ctx.host && ctx.host.proposals ? ctx.host.proposals.list() : [];
    props.forEach((p, j) => {
      const k = WORLD.missions.length + j;
      const rr = 14 * Math.sqrt(k) * g.k, a = k * GOLD;
      V.items.push({ code: p.id, title: p.title, state: 'proposal', label: '', numberShown: p.id, k, x: g.cx + rr * Math.cos(a), y: g.cy + rr * Math.sin(a), where: p.where, proposal: p });
    });
    for (const it of V.items) {
      hatch(it, g);
      const li = el('li', `t0-hrow t0-hrow--${it.state}`, null, listEl, { qa: 'hatch', data: { code: it.code, k: String(it.k), state: it.state } });
      if (it.where) li.dataset.where = it.where;
      const b = el('button', 't0-hrow__b', null, li, { attrs: { type: 'button' } });
      const locked = it.state === 'locked' || it.state === 'sealed';
      el('p', 't-label', it.state === 'proposal' ? it.code : `${it.numberShown} · ${it.label}`, b);
      if (!locked) {
        el('p', 't-body t0-hrow__t', it.title, b);
        const w = whereLabel(it.where);
        if (w) el('p', 't-micro t0-where', w, b);
      }
      b.addEventListener('click', () => select(it, li));
      b.addEventListener('pointerenter', () => hover(it, true));
      b.addEventListener('pointerleave', () => hover(it, false));
      b.addEventListener('focus', () => hover(it, true));
      b.addEventListener('blur', () => hover(it, false));
      it.li = li;
    }
    empty.hidden = WORLD.missions.length > 0;
    const full = props.length >= 3;
    propV.hidden = full;
    propFull.hidden = !full;
    propFull.textContent = full ? 'ПРЕДЛОЖЕНИЙ 3 · ЖДУТ ПАПУ' : '';
  }
  function hover(it, on) {
    if (!it.box) return;
    it.box.classList.toggle('is-hover', on);
    if (it.state === 'new') it.iris.setAttribute('d', irisPath(it.r, on ? 0.18 : 0.02));
    if (on && ctx.audio) ctx.audio.play('hoverTick', { x: it.x });
  }
  function select(it, li) {
    if (it.state === 'locked' || it.state === 'sealed') {
      li.classList.remove('is-shudder'); it.box.classList.remove('is-shudder');
      requestAnimationFrame(() => { li.classList.add('is-shudder'); it.box.classList.add('is-shudder'); });
      if (ctx.audio) ctx.audio.play('lockedThud', {});
      why.textContent = it.lockedText || '';
      why.classList.add('is-in');
      after(4000, () => why.classList.remove('is-in'));
      return;
    }
    if (it.state === 'proposal') { openProposal(it); return; }
    if (ctx.audio) ctx.audio.play('select', {});
    ctx.director.go(`#/voyages/${it.code}`, { source: 'hall' });
  }
  function openProposal(it) {
    const p = it.proposal;
    clear(propBox);
    el('i', 't0-tick', null, propBox, { attrs: { 'aria-hidden': 'true' } });
    const w = whereLabel(p.where) || 'В ИГРЕ';
    el('p', 't-label', `ПРЕДЛОЖЕНИЕ · ${p.id} · ${w}${p.day ? ` · ${fmtDate(p.day, 'dd.mm.yyyy')}` : ''}`, propBox);
    el('p', 't-heading', p.title, propBox);
    el('p', 't-label', 'ЗАДАЧА', propBox);
    el('p', 't-brief', p.text || '', propBox);
    el('p', 't-label', 'ПРЕДЛОЖИЛ', propBox);
    el('p', 't-body', WORLD.operator.name, propBox);
    el('p', 't-body', 'Обсуди с командой и покажи папе. Если папа впишет идею в мир — она станет настоящей вылазкой.', propBox);
    const rm = el('button', 'verb t-label', 'УБРАТЬ', propBox, { attrs: { type: 'button' } });
    let tm = 0;
    rm.addEventListener('pointerdown', () => { tm = after(1200, () => { tm = 0; if (ctx.host && ctx.host.proposals) ctx.host.proposals.remove(p.id); propBox.hidden = true; build(); }); });
    const cancel = () => { if (tm) { tm = 0; } };
    rm.addEventListener('pointerup', cancel); rm.addEventListener('pointerleave', cancel);
    propBox.hidden = false;
    V.open = p.id;
  }

  /** Arrival news: returned probes, live decodes. */
  function news() {
    for (const code of collectReturnedProbes()) {
      if (ctx.status) ctx.status.say('probe.back', { code });
      ctx.bus.emit('probe:back', { code });
      if (ctx.audio) ctx.audio.play('probeReturn', {});
    }
    const dec = collectDecoded();
    dec.forEach((code, n) => after(600 + n * 900, () => {
      const it = V.items.find((x) => x.code === code);
      build();
      const it2 = V.items.find((x) => x.code === code);
      if (it2 && it2.li) {
        const lab = it2.li.querySelector('.t-label'), tt = it2.li.querySelector('.t0-hrow__t');
        if (lab) beamWrite(lab, `${it2.numberShown} · ${it2.label}`);
        if (tt) beamWrite(tt, it2.title);
      }
      if (ctx.status) ctx.status.say('mission.decoded', { code });
      void it;
    }));
  }
  // the active iris breathes on the world breath (10 % ↔ 35 %), written at most every other frame
  ctx.loop.add(() => {
    if (app.room !== 'VOYAGES' || T.lostMode || reduced()) return;
    if ((V.breath = (V.breath + 1) % 3) !== 0) return;
    for (const it of V.items) if (it.state === 'active' && it.iris) {
      const u = ctx.loop.now % 4200 / 4200, b = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
      it.iris.setAttribute('d', irisPath(it.r, 0.10 + 0.25 * b));
    }
  });
  ctx.bus.on('proposal:saved', () => { if (app.room === 'VOYAGES') build(); });

  const hall = {
    id: 'VOYAGES',
    section: sec,
    show(route) {
      const sub = route && route.sub;
      if (!V.items.length || !sub) build();
      if (sub) {
        sec.classList.add('is-chamber');
        chamber.show(sub);
      } else {
        sec.classList.remove('is-chamber');
        chamber.hide();
        propBox.hidden = true;
        if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
        news();
      }
    },
    hide() { chamber.hide(); sec.classList.remove('is-chamber'); propBox.hidden = true; if (layout.isPhone && ctx.sheet) ctx.sheet.set(null); },
    relayout() { build(); chamber.relayout(); },
    onKey(e) {
      if (e.key === 'Escape' && sec.classList.contains('is-chamber')) { ctx.director.go('#/voyages', { source: 'kbd' }); return true; }
      if (e.key === 'Escape' && !propBox.hidden) { propBox.hidden = true; return true; }
      return false;
    },
  };
  void state;
  return hall;
}
