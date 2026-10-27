// t0/pages.js — WP11. NADIR «ИСТОК» and ZENITH «НАД ВСЕМ» as T0 text pages (SPEC §6.7, §6.8, §12.5; SPEC-ADDENDUM A3.1
// ОСНОВАТЕЛЬ, A3.3 КОДЕКС block, A5.1 СПАСЕНО, A11.7 about).
//   NADIR (open): the triangular chamber narrowing to its apex in elevation, ember root nodes every 13 m along its three
//   edges (the only hall whose lattice carries ember), his glyph engraved on the deck (electrum 2,500 ms, then silver;
//   the clan sigil if he has none); the column: LEAD lore, BRIEF origin, BODY about, LABEL `КОДЕКС SAM.VIN` + HEADING
//   «Правила клана» + each earned law (BODY + MICRO date), LABEL `ОСНОВАН dd.mm.yyyy`, LABEL `ОСНОВАТЕЛЬ: Имя · ПОЗЫВНОЙ`,
//   LABEL `MISSION 000 ОТКРЫТА` + `К ВЫЛАЗКЕ 000 →`. Sealed: the five slots and `осколков k из 5`.
//   ZENITH: the sky (seeded stars), VIN far below with its lit nodes like windows, his drawings as constellations
//   (2 px stars joined by 0.5 px --slate lines; a tap replays the sound), at night the members' glyphs too; LEAD message
//   beam-written; MICRO `ВЫСОТА +1 260 М · УЗЛОВ ГОРИТ {lit}` (+ `· СПАСЕНО {n}`); the zenith pad.
import { WORLD, operatorMember } from '../data/world.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { after } from '../core/clock.js';
import { fmtDate, upper } from '../core/ru.js';
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { beamWrite } from '../ui/text.js';
import { playStroke } from '../halls/signal/stroke.js';
import { svg, el, fmt, clear, block, glyphPath, rand } from './dom.js';

const LORE = 'VIN строит себя сам. Он спал, пока вы не коснулись ключа. Теперь каждое ваше возвращение зажигает в нём новый узел.';

export function createNadir(ctx, T) {
  const sec = T.section('NADIR');
  const art = svg('svg', { class: 't0-page__art', 'aria-hidden': 'true' }, sec);
  const col = block(sec, 't0-page__col');
  let shown = false;
  function draw() {
    clear(art); clear(col);
    const w = layout.w, h = layout.h;
    art.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const open = !!(state.data && state.data.nadirOpen);
    const cx = layout.isPhone ? w / 2 : w * 0.38, top = layout.isPhone ? 150 : h * 0.1, H = layout.isPhone ? 260 : h * 0.5, W = H * 0.62;
    // the chamber: three edges converging to the apex below
    const A = [cx - W, top], B = [cx + W, top], C = [cx + W * 0.2, top + H * 0.08], N = [cx, top + H];
    svg('path', { d: `M${fmt(A[0])} ${fmt(A[1])}L${fmt(N[0])} ${fmt(N[1])}L${fmt(B[0])} ${fmt(B[1])}M${fmt(C[0])} ${fmt(C[1])}L${fmt(N[0])} ${fmt(N[1])}M${fmt(A[0])} ${fmt(A[1])}L${fmt(C[0])} ${fmt(C[1])}L${fmt(B[0])} ${fmt(B[1])}L${fmt(A[0])} ${fmt(A[1])}`, class: 't0-page__l' }, art);
    if (open) {
      // the roots: ember nodes every 13 m along the three edges (110 m deep)
      const n = Math.floor(110 / 13);
      for (const P of [A, B, C]) for (let k = 1; k <= n; k++) {
        const u = k / (n + 1);
        svg('circle', { cx: P[0] + (N[0] - P[0]) * u, cy: P[1] + (N[1] - P[1]) * u, r: 1, class: 't0-root' }, art);
      }
      // his glyph on the deck, 12 m across: electrum for 2,500 ms, then silver
      const g = (state.data && state.data.glyph && state.data.glyph.length) ? state.data.glyph : WORLD.clan.sigil;
      const gs = W * 0.55;
      const gp = svg('path', { d: glyphPath(g, cx - gs / 2, top - gs * 0.34 - 18, gs), class: 't0-deckglyph is-hot', transform: `matrix(1 0 0 .34 0 ${fmt((top - 18) * 0.66 + gs * 0.12)})` }, art);
      after(2500, () => gp.classList.remove('is-hot'));
      el('p', 't-lead', LORE, col);
      el('p', 't-brief', WORLD.nadir.origin, col);
      if (WORLD.clan.about) el('p', 't-body t0-page__about', WORLD.clan.about, col);
      const earned = ctx.deeds && ctx.deeds.earned ? ctx.deeds.earned() : [];
      if (earned.length) {
        el('p', 't-label t0-ch__l', 'КОДЕКС SAM.VIN', col);
        el('p', 't-heading', 'Правила клана', col);
        for (const i of earned) {
          const law = ctx.deeds.law(i);
          if (!law || !law.text) continue;
          const r = el('div', 't0-page__law', null, col);
          el('p', 't-body', law.text, r);
          if (law.at) el('p', 't-micro', fmtDate(law.at, 'dd.mm.yyyy'), r);
        }
      }
      el('p', 't-label t0-ch__l', `ОСНОВАН ${fmtDate(WORLD.clan.founded, 'dd.mm.yyyy')}`, col);
      el('p', 't-label', `ОСНОВАТЕЛЬ: ${WORLD.operator.name} · ${WORLD.operator.callsign || (operatorMember() || {}).callsign || ''}`, col);
      el('p', 't-label t0-ch__l', 'MISSION 000 ОТКРЫТА', col);
      const v = el('button', 'verb t-label', 'К ВЫЛАЗКЕ 000 →', col, { attrs: { type: 'button' } });
      v.addEventListener('click', () => ctx.director.go('#/voyages/000', { source: 'hall' }));
    } else {
      const k = (state.data && state.data.shards) | 0;
      for (let s = 0; s < 5; s++) svg('circle', { cx: N[0] + (s - 2) * 16, cy: N[1] + 26, r: s < k ? 2 : 3, class: s < k ? 't0-slot is-full' : 't0-slot' }, art);
      el('p', 't-label', `ОСКОЛКОВ ${k} ИЗ 5`, col);
    }
    if (layout.isPhone && ctx.sheet && shown) {
      const peek = el('div');
      el('p', 't-label', open ? 'ИСТОК' : 'ЗАПЕЧАТАНО', peek);
      ctx.sheet.set(col, { peek, state: 'peek' });
    }
  }
  void STRATA_GEOM; void radiusAt; void upper;
  return {
    id: 'NADIR', section: sec,
    show() { shown = true; draw(); },
    hide() { shown = false; if (layout.isPhone && ctx.sheet) { sec.appendChild(col); ctx.sheet.set(null); } },
    relayout() { draw(); },
  };
}

export function createZenith(ctx, T) {
  const sec = T.section('ZENITH');
  const art = svg('svg', { class: 't0-page__art', 'aria-hidden': 'true' }, sec);
  const col = block(sec, 't0-page__col t0-zen');
  const lead = el('p', 't-lead', null, col);
  const micro = el('p', 't-micro', null, col);
  let pad = null;
  function draw() {
    clear(art);
    const w = layout.w, h = layout.h;
    art.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const r = rand(1260);
    let d = '';
    for (let i = 0; i < 360; i++) { const x = r() * w, y = r() * h * 0.8; d += `M${fmt(x)} ${fmt(y)}h.01`; }
    svg('path', { d, class: 't0-stars' }, art);
    // VIN far below: its elevation small at the bottom, fading into fog; the lit nodes like windows
    const cx = w / 2, cy = h * (layout.isPhone ? 0.72 : 0.8), k = Math.min(w, h) * 0.08;
    let o = '';
    for (const s of STRATA_GEOM) {
      const ys = s.top > 0 && s.bot < 0 ? [s.top, 0, s.bot] : [s.top, s.bot];
      ys.forEach((y, q) => { o += `${q ? 'L' : 'M'}${fmt(cx + radiusAt(y) * k * 0.866)} ${fmt(cy - y * k)}`; });
      for (let q = ys.length - 1; q >= 0; q--) o += `L${fmt(cx - radiusAt(ys[q]) * k * 0.866)} ${fmt(cy - ys[q] * k)}`;
      o += 'Z';
    }
    svg('path', { d: o, class: 't0-vinfar' }, art);
    const lit = Math.min(12, state.litNodes || 1);
    for (let i = 0; i < lit; i++) svg('circle', { cx: cx + ((i % 4) - 1.5) * k * 0.12, cy: cy + (Math.floor(i / 4) - 1) * k * 0.08, r: 1, class: 't0-root' }, art);
    // his drawings as constellations (2 px stars, 0.5 px --slate lines), at night the members' glyphs too
    const list = (state.data && state.data.drawings) || [];
    list.forEach((norm, i) => {
      const gx = w * (0.18 + 0.64 * ((i * 0.37) % 1)), gy = h * (0.14 + 0.1 * (i % 3)), s = Math.min(w, h) * 0.07;
      const g = svg('g', { class: 't0-const' }, art);
      let l = '';
      norm.forEach((p, q) => { l += `${q ? 'L' : 'M'}${fmt(gx + p[0] * s)} ${fmt(gy + p[1] * s)}`; });
      svg('path', { d: l, class: 't0-const__l' }, g);
      for (let q = 0; q < norm.length; q += Math.max(1, Math.floor(norm.length / 9))) svg('circle', { cx: gx + norm[q][0] * s, cy: gy + norm[q][1] * s, r: 1, class: 't0-const__s' }, g);
      const hit = svg('circle', { cx: gx, cy: gy, r: s * 1.1, class: 't0-const__hit' }, g);
      hit.addEventListener('click', () => playStroke(norm, 1200));
    });
    if (app.night) WORLD.members.forEach((m, i) => {
      if (!m.glyph || !m.glyph.length) return;
      const gx = w * (0.1 + 0.8 * ((i + 0.5) / WORLD.members.length)), gy = h * 0.42, s = 26;
      svg('path', { d: glyphPath(m.glyph, gx - s / 2, gy - s / 2, s), class: 't0-const__l' }, art);
    });
    const saved = (state.data && state.data.lost && state.data.lost.saved) | 0;
    micro.textContent = `ВЫСОТА +1 260 М · УЗЛОВ ГОРИТ ${state.litNodes}${saved >= 1 ? ` · СПАСЕНО ${saved}` : ''}`;
  }
  return {
    id: 'ZENITH', section: sec,
    show() {
      draw();
      lead.textContent = '';
      after(400, () => beamWrite(lead, WORLD.zenith.message));
      if (ctx.audio && !pad) pad = ctx.audio.start('zenithPad', {});
    },
    hide() { if (pad && pad.stop) { try { pad.stop(400); } catch (e) { /* voice */ } } pad = null; },
    relayout() { draw(); },
  };
}
