// t0/insignia.js — WP11. INSIGNIA «ХРАНИЛИЩЕ» in T0 (SPEC §6.6, §12.5 "relic list with SVG line icons, capsule"; S12;
// SPEC-ADDENDUM A11.6 where): the vault in elevation — the geodesic hairline sphere, the equator ring with the earned
// relics (legendary edges --white), the lower ring with the dashed --pewter goals, the shards' upper ring, the sealed
// capsule below — and the relic schedule ([data-qa=relic] data-id / data-earned): 24 px line icon, LABEL title, MICRO
// `dd.mm.yyyy · В ЖИЗНИ`; unearned: dashed icon, LABEL «НЕ НАЙДЕНО», title and BODY condition. Hover: HEADING, LABEL
// rarity, MICRO date, BODY «Кто: …». Click → #/insignia/<id>: the relic held (drag turns it, a flick spins it, decay
// ×0.96), BODY story, LABEL КТО + chips, LABEL КОГДА, LABEL ГДЕ + «в игре» / «в жизни». НАХОДКИ ([data-qa=shard]): each
// found secret's Russian name + MICRO date, a tap shows its one-line memory; unfound ones leave no trace. VAULT melody
// 600 ms after arrival (14 × 280 ms; found = note + shard flash; rests = a 1 px ring pulse). КАПСУЛА ([data-qa=capsule]):
// «Откроется через {d} д {h} ч.» updated each minute; due on arrival → five electrum fractures (1,200 ms), the parent's
// text beam-written in LEAD, openCapsule → «капсула открыта.», S12.
import { WORLD, memberById, whereLabel, EMPTY_LINE } from '../data/world.js';
import { relicIconSvg } from '../halls/insignia/shapes.js';
import { capsuleInfo, openCapsule } from '../halls/insignia/capsuleModel.js';
import { SECRETS } from '../secrets/registry.js';
import { SECRET_NOTE, hz } from '../audio/notes.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { fmtDate } from '../core/ru.js';
import { svg, el, fmt, clear, block, glyphPath, reduced } from './dom.js';

const RARITY = { 'обычная': 'ОБЫЧНАЯ', 'редкая': 'РЕДКАЯ', 'легендарная': 'ЛЕГЕНДАРНАЯ' };

function icon(parent, shape, size, cls) {
  const s = svg('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}`, class: cls || '' }, parent);
  svg('path', { d: relicIconSvg(shape, size) }, s);
  return s;
}
function fillFill(s, text) { s.textContent = text; }

export function createInsignia(ctx, T) {
  const sec = T.section('INSIGNIA');
  const vault = svg('svg', { class: 't0-vault', 'aria-hidden': 'true' }, sec);
  const list = el('ol', 't0-relics', null, sec);
  const ro = block(sec, 't0-relicro scrim');
  ro.hidden = true;
  const finds = block(sec, 't0-finds');
  const cap = block(sec, 't0-capsule', { qa: 'capsule' });
  const held = el('div', 't0-held', null, sec);
  held.hidden = true;
  const empty = el('p', 't-body t0-empty', EMPTY_LINE.achievements, sec);
  const I = { rows: [], shards: [], minuteT: 0, id: null, rot: 0, vel: 0, spinId: 0, shown: false, capG: null, centre: null };

  function sorted() {
    const a = WORLD.achievements.slice();
    return a.filter((x) => x.earned).concat(a.filter((x) => !x.earned));
  }
  function drawVault() {
    clear(vault);
    const w = layout.w, h = layout.h;
    vault.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const cx = layout.isPhone ? w / 2 : w * 0.36, cy = layout.isPhone ? 300 : h * 0.32, R = layout.isPhone ? w * 0.42 : Math.min(h * 0.27, 250);
    I.centre = { cx, cy, R };
    // geodesic sphere in elevation: outline, latitude ellipses, a few meridians (frequency 3 feel)
    let d = `M${fmt(cx + R)} ${fmt(cy)}A${fmt(R)} ${fmt(R)} 0 1 0 ${fmt(cx - R)} ${fmt(cy)}A${fmt(R)} ${fmt(R)} 0 1 0 ${fmt(cx + R)} ${fmt(cy)}`;
    for (const lat of [-0.66, -0.33, 0, 0.33, 0.66]) {
      const y = cy - lat * R, rx = R * Math.sqrt(1 - lat * lat), ry = rx * 0.16;
      d += `M${fmt(cx + rx)} ${fmt(y)}A${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx - rx)} ${fmt(y)}A${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx + rx)} ${fmt(y)}`;
    }
    for (const m of [0.2, 0.45, 0.7, 0.92]) for (const s of [-1, 1]) {
      const rx = R * m;
      d += `M${fmt(cx)} ${fmt(cy - R)}A${fmt(rx)} ${fmt(R)} 0 0 ${s > 0 ? 1 : 0} ${fmt(cx)} ${fmt(cy + R)}`;
    }
    svg('path', { d, class: 't0-vault__l' }, vault);
    svg('path', { d: `M${fmt(cx - 3.5)} ${fmt(cy)}h7M${fmt(cx)} ${fmt(cy - 3.5)}v7`, class: 't0-cross' }, vault);
    I.pulse = svg('circle', { cx, cy, r: 6, class: 't0-vault__pulse' }, vault);
    // relics on their rings (front half): earned on the equator, goals on the lower ring
    const earned = WORLD.achievements.filter((a) => a.earned), goals = WORLD.achievements.filter((a) => !a.earned);
    const ring = (arr, lat, cls) => arr.forEach((a, i) => {
      const t = arr.length > 1 ? -0.85 + (1.7 * i) / (arr.length - 1) : 0;
      const rx = R * Math.sqrt(1 - lat * lat) * 0.92;
      const x = cx + Math.sin(t) * rx, y = cy - lat * R + Math.cos(t) * rx * 0.16;
      const g = svg('g', { class: `t0-vrel ${cls}${a.rarity === 'легендарная' ? ' is-leg' : ''}`, transform: `translate(${fmt(x - 12)} ${fmt(y - 12)})`, 'data-id': a.id }, vault);
      svg('path', { d: relicIconSvg(a.shape, 24) }, g);
    });
    ring(earned, 0, 'is-earned');
    ring(goals, -0.5, 'is-goal');
    // shards on the upper ring
    I.shards = [];
    SECRETS.forEach((s, k) => {
      if (!(state.data && state.data.found && state.data.found[s.id])) return;
      const t = -0.9 + (1.8 * I.shards.length) / 13;
      const rx = R * 0.8 * 0.92, x = cx + Math.sin(t) * rx, y = cy - 0.6 * R + Math.cos(t) * rx * 0.16;
      const p = svg('path', { d: `M${fmt(x)} ${fmt(y - 7)}L${fmt(x + 3)} ${fmt(y + 5)}L${fmt(x - 3)} ${fmt(y + 5)}Z`, class: 't0-vshard' }, vault);
      I.shards.push({ id: s.id, el: p, k });
    });
  }
  function buildList() {
    clear(list);
    I.rows = [];
    for (const a of sorted()) {
      const li = el('li', `t0-relic${a.earned ? ' is-earned' : ''}`, null, list, { qa: 'relic', data: { id: a.id, earned: a.earned ? 'true' : 'false' } });
      const b = el('button', 't0-relic__b', null, li, { attrs: { type: 'button' } });
      icon(b, a.shape, 24, a.earned ? 't0-ricon' : 't0-ricon is-goal');
      const tx = el('div', 't0-relic__t', null, b);
      if (a.earned) {
        el('p', 't-label', a.title, tx);
        const w = whereLabel(a.where);
        el('p', 't-micro', `${a.date ? fmtDate(a.date, 'dd.mm.yyyy') : ''}${a.date && w ? ' · ' : ''}${w || ''}`, tx);
      } else {
        el('p', 't-label t0-relic__nf', 'НЕ НАЙДЕНО', tx);
        el('p', 't-label', a.title, tx);
        if (!layout.isPhone) el('p', 't-body t0-relic__c', a.text || '', tx);
      }
      b.addEventListener('pointerenter', () => hover(a, li));
      b.addEventListener('focus', () => hover(a, li));
      b.addEventListener('pointerleave', () => hover(null));
      b.addEventListener('click', () => ctx.director.go(`#/insignia/${a.id}`, { source: 'hall' }));
      I.rows.push({ a, li });
    }
    empty.hidden = WORLD.achievements.length > 0;
  }
  function hover(a, li) {
    for (const g of vault.querySelectorAll('.t0-vrel')) g.classList.toggle('is-hover', !!a && g.getAttribute('data-id') === a.id);
    if (!a || layout.isPhone || I.id) { ro.hidden = true; return; }
    clear(ro);
    el('i', 't0-tick', null, ro, { attrs: { 'aria-hidden': 'true' } });
    el('p', 't-heading', a.title, ro);
    el('p', 't-label', RARITY[a.rarity] || '', ro);
    const w = whereLabel(a.where);
    const m = `${a.date ? fmtDate(a.date, 'dd.mm.yyyy') : ''}${a.date && w ? ' · ' : ''}${w || ''}`;
    if (m) el('p', 't-micro', m, ro);
    const who = (a.who || []).map(memberById).filter(Boolean).map((p) => p.name);
    if (a.earned && who.length) el('p', 't-body', `Кто: ${who.join(', ')}`, ro);
    else if (!a.earned) el('p', 't-body', a.text || '', ro);
    const r = li.getBoundingClientRect();
    ro.style.transform = `translate(${fmt(Math.max(24, r.left - 380))}px,${fmt(Math.max(90, r.top - 8))}px)`;
    ro.hidden = false;
  }
  function fillFinds() {
    clear(finds);
    el('i', 't0-tick', null, finds, { attrs: { 'aria-hidden': 'true' } });
    const found = SECRETS.filter((s) => state.data && state.data.found && state.data.found[s.id]);
    if (!found.length) { finds.hidden = true; return; }
    finds.hidden = false;
    el('p', 't-label', `НАХОДКИ · ${String(found.length).padStart(2, '0')}`, finds);
    const ul = el('ul', 't0-finds__l', null, finds);
    const line = el('p', 't-body t0-finds__line', null, finds);
    for (const s of found) {
      const li = el('li', null, null, ul, { qa: 'shard', data: { id: s.id } });
      const b = el('button', 't0-shard', null, li, { attrs: { type: 'button' } });
      el('span', 't-label', s.name, b);
      el('span', 't-micro', fmtDate(state.data.found[s.id], 'dd.mm.yyyy'), b);
      const vars = (state.data.foundVars && state.data.foundVars[s.id]) || {};
      const fills = { p: vars.p != null ? vars.p : '', freq: Number(WORLD.clan.frequency).toFixed(2), name: (WORLD.companion && WORLD.companion.name) || '' };
      b.addEventListener('click', () => { fillFill(line, String(s.line || '').replace(/\{(\w+)\}/g, (q, k) => (fills[k] != null ? fills[k] : ''))); });
    }
  }
  function fillCapsule() {
    clear(cap);
    el('i', 't0-tick', null, cap, { attrs: { 'aria-hidden': 'true' } });
    // the sealed 0.8 m capsule, seen from the side (its fractures are drawn here when it opens)
    const s = svg('svg', { class: 't0-vcap', width: 40, height: 40, viewBox: '-20 -20 40 40', 'aria-hidden': 'true' }, cap);
    svg('path', { d: 'M-12 -10V10M12 -10V10M-12 -10A12 4 0 0 1 12 -10A12 4 0 0 1 -12 -10M-12 10A12 4 0 0 0 12 10', class: 't0-vcap__l' }, s);
    I.capG = s; I.capPt = { x: 0, y: 0 };
    if (capsuleInfo().opened) s.classList.add('is-open');
    el('p', 't-label', 'КАПСУЛА', cap);
    const info = capsuleInfo();
    if (info.opened) el('p', 't-body', WORLD.capsule.text, cap);
    else el('p', 't-body', `Откроется через ${info.d} д ${info.h} ч.`, cap);
  }
  function crackCapsule() {
    if (!I.capG) return;
    const { x, y } = I.capPt;
    for (let c = 0; c < 5; c++) {
      const a = -0.9 + c * 0.45;
      svg('path', { d: `M${fmt(x)} ${fmt(y)}L${fmt(x + Math.sin(a) * 6)} ${fmt(y - Math.cos(a) * 5)}L${fmt(x + Math.sin(a) * 11)} ${fmt(y - Math.cos(a) * 11)}`, class: 't0-crack', pathLength: '1' }, I.capG);
    }
    requestAnimationFrame(() => I.capG.classList.add('is-cracked'));
    after(2500, () => I.capG.classList.add('is-cool'));
  }
  function melody() {
    if (reduced() && !ctx.audio) return;
    SECRETS.forEach((s, k) => after(600 + k * 280, () => {
      if (app.room !== 'INSIGNIA' || I.id) return;
      const sh = I.shards.find((x) => x.id === s.id);
      if (sh) {
        if (ctx.audio) ctx.audio.play('vaultNote', { hz: hz(SECRET_NOTE[s.id]) });
        sh.el.classList.add('is-flash'); after(140, () => sh.el.classList.remove('is-flash'));
      } else if (I.pulse) { I.pulse.classList.remove('is-on'); requestAnimationFrame(() => I.pulse.classList.add('is-on')); }
    }));
  }
  // ── a relic held ─────────────────────────────────────────────────────────────────────────────────────────────
  function holdRelic(id) {
    const a = WORLD.achievements.find((x) => x.id === id);
    if (!a) return;
    I.id = id;
    clear(held);
    const stage = el('div', 't0-held__stage', null, held);
    const big = icon(stage, a.shape, 200, a.earned ? 't0-ricon t0-held__icon' : 't0-ricon is-goal t0-held__icon');
    const txt = block(held, 't0-held__txt');
    el('p', 't-label', `${RARITY[a.rarity] || ''}${a.earned ? '' : ' · НЕ НАЙДЕНО'}`, txt);
    el('p', 't-heading', a.title, txt);
    el('p', 't-body', a.text || '', txt);
    const who = (a.who || []).map(memberById).filter(Boolean);
    if (who.length) {
      el('p', 't-label t0-ch__l', 'КТО', txt);
      const chips = el('div', 't0-chips', null, txt);
      for (const p of who) {
        const c = el('button', 'chip', null, chips, { attrs: { type: 'button' } });
        if (p.glyph && p.glyph.length) { const s = svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', class: 't0-chipg' }, c); svg('path', { d: glyphPath(p.glyph, 3, 3, 18) }, s); }
        c.appendChild(document.createTextNode(p.callsign));
        c.addEventListener('click', () => ctx.director.go(`#/members/${p.id}`, { source: 'hall' }));
      }
    }
    if (a.date) { el('p', 't-label t0-ch__l', 'КОГДА', txt); el('p', 't-body', fmtDate(a.date, 'dd.mm.yyyy'), txt); }
    if (a.where) { el('p', 't-label t0-ch__l', 'ГДЕ', txt); el('p', 't-body', a.where === 'жизнь' ? 'в жизни' : 'в игре', txt); }
    // drag turns it with inertia; a flick spins it (decay ×0.96 per frame)
    I.rot = 0; I.vel = 0;
    let last = null;
    stage.addEventListener('pointerdown', (e) => { last = { x: e.clientX, t: performance.now() }; try { stage.setPointerCapture(e.pointerId); } catch (err) { /* synthetic */ } });
    stage.addEventListener('pointermove', (e) => {
      if (!last) return;
      const t = performance.now(), dx = e.clientX - last.x;
      I.rot += dx * 0.6; I.vel = (dx * 0.6) / Math.max(1, (t - last.t) / 16.7);
      last = { x: e.clientX, t };
      big.style.transform = `rotate(${fmt(I.rot)}deg)`;
    });
    const up = () => { last = null; };
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    if (I.spinId) loop.remove(I.spinId);
    I.spinId = loop.add(() => {
      if (last || Math.abs(I.vel) < 0.02) return;
      I.rot += I.vel; I.vel *= 0.96;
      big.style.transform = `rotate(${fmt(I.rot)}deg)`;
    }, ORDER.UI);
    held.hidden = false;
    sec.classList.add('is-held');
    if (layout.isPhone && ctx.sheet) { ctx.sheet.set(txt, { state: 'peek' }); }
  }
  function release() {
    if (!I.id) return;
    I.id = null;
    if (I.spinId) { loop.remove(I.spinId); I.spinId = 0; }
    held.hidden = true; clear(held);
    sec.classList.remove('is-held');
    if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
  }

  const hall = {
    id: 'INSIGNIA',
    section: sec,
    show(route) {
      const sub = route && route.sub;
      if (!I.shown || !sub) { drawVault(); buildList(); fillFinds(); fillCapsule(); }
      const first = !I.shown;
      I.shown = true;
      if (sub) { holdRelic(sub); return; }
      release();
      if (first || !route.sub) {
        const info = capsuleInfo();
        if (info.open && !info.opened) {
          crackCapsule();
          if (ctx.audio) ctx.audio.play('capsule', {});
          after(reduced() ? 160 : 1200, () => { if (openCapsule() && ctx.lead) ctx.lead.show(WORLD.capsule.text, { ms: 6000 }); fillCapsule(); crackCapsule(); });
        }
        melody();
      }
      if (I.minuteT) clearInterval(I.minuteT);
      I.minuteT = setInterval(() => { if (app.room === 'INSIGNIA' && !document.hidden) fillCapsule(); }, 60000);
    },
    hide() {
      release();
      ro.hidden = true;
      if (I.minuteT) { clearInterval(I.minuteT); I.minuteT = 0; }
      I.shown = false;
      if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
    },
    relayout() { drawVault(); },
    onKey(e) { if (e.key === 'Escape' && I.id) { ctx.director.go('#/insignia', { source: 'kbd' }); return true; } return false; },
  };
  ctx.bus.on('shard:landed', () => { if (app.room === 'INSIGNIA' && I.shown) { drawVault(); fillFinds(); } });
  return hall;
}
