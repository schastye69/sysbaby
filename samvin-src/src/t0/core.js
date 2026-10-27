// t0/core.js — WP11. CORE in T0 (SPEC §6.1, §3.5, §3.6, §3.7, §3.9, §12.5; SPEC-ADDENDUM A3.3 T0 flip, A11.6 СЕГОДНЯ,
// A11.7 about): the «СЕГОДНЯ» block (LABEL `СЕГОДНЯ · dd.mm · В ЖИЗНИ` + BODY moment of the day), the gestures on the
// SVG Key — tap a band → key:click {index, x, y} and the same director targets as the WebGL CORE (• unfolds / refolds,
// any other band DIVEs, N while sealed is the router's shudder); hold → РЕЗОНАНС (S01); a vertical drag past the
// equivalent of 110° (WebGL: 330 px of a 504 px Key = 0.655 × the Key's screen height) → key:flip {dir}; a horizontal
// drag across > 50 % of the Key's width → the back elevation (КОДЕКС: the earned laws as BODY lines in their bands,
// 280 ms scaleX through 0). UNFOLD (#/core/open): the strata part, every band carries its data ring as a LABEL line, the
// motto LEAD, `МЫ ВМЕСТЕ`, `clan.about`, `ПРИНЯТЬ ГОСТЕЙ →`.
import { WORLD, worldCounts, whereLabel } from '../data/world.js';
import { state } from '../core/state.js';
import { app, setPhase } from '../core/store.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { after, tween } from '../core/clock.js';
import { dayIndex, now as clockNow } from '../core/time.js';
import { fmtDate, plural, upper } from '../core/ru.js';
import { roomByStratum, ROOMS } from '../world/rooms.js';
import { STRATA_GEOM, GAP } from '../core/tokens.js';
import { beamWrite, revealBody } from '../ui/text.js';
import { el, block, clear, glyphPath, svg, fmt, reduced } from './dom.js';
import { createResonance } from './resonance.js';

export function createCore(ctx, T) {
  const L = T.key, K = L.K;
  const sec = T.section('CORE');
  const today = block(sec, 't0-today');
  const todayL = el('p', 't-label', null, today);
  const todayB = el('p', 't-body', null, today);
  // UNFOLD
  const unf = el('div', 't0-unfold', null, sec);
  unf.hidden = true;
  const ringsBox = el('div', 't0-rings', null, unf);
  const motto = block(unf, 't0-motto');
  const mottoL = el('p', 't-lead', null, motto);
  const togetherL = el('p', 't-label', null, motto);
  const aboutB = el('p', 't-body t0-about', null, motto, { qa: 'about' });
  const guestsV = el('button', 'verb t-label', 'ПРИНЯТЬ ГОСТЕЙ →', motto, { qa: 'unfold-guests' });
  guestsV.addEventListener('click', () => { if (ctx.host && ctx.host.guests) ctx.host.guests.open('unfold'); });
  const srRings = el('ul', 'sr-only', null, unf);
  // КОДЕКС back elevation
  const laws = el('div', 't0-laws', null, T.root);
  laws.hidden = true;
  const res = createResonance(ctx, L, T.root);
  const C = { open: false, back: false, flipping: false, backTimer: 0 };

  function fillToday() {
    const ms = WORLD.moments;
    if (!ms.length) { today.hidden = true; return; }
    const m = ms[((dayIndex(clockNow()) % ms.length) + ms.length) % ms.length];
    const w = whereLabel(m.where);
    todayL.textContent = `СЕГОДНЯ · ${fmtDate(state.today, 'dd.mm')}${w ? ` · ${w}` : ''}`;
    todayB.textContent = m.text || m.title;
    today.hidden = false;
  }

  // ── UNFOLD ──────────────────────────────────────────────────────────────────────────────────────────────────
  function ringTexts() {
    const c = worldCounts();
    const d = state.data || {};
    const sbor = (d.sbor && d.sbor.count) | 0, saved = (d.lost && d.lost.saved) | 0, pairs = (d.lost && d.lost.pairs) | 0;
    return [
      `СВЯЗЬ · ПЕРЕДАЧ ${c.delivered} · НОВЫХ ${c.unread}`,
      `ЛЕТОПИСЬ · ЛЕГЕНД ${c.legends} · МОМЕНТОВ ${c.moments} · ШУТОК ${c.jokesFound}`,
      `КЛАН · УЧАСТНИКОВ ${c.members} · НА СВЯЗИ ${c.online}${sbor >= 1 ? ` · СБОРОВ ${sbor}` : ''}`,
      `SAM.VIN · ОСНОВАН ${c.founded} · ОСНОВАТЕЛЬ ${upper(WORLD.operator.name)} · ДНЕЙ ${c.daysSinceFounded}${saved >= 1 ? ` · СПАСЕНО ${saved}` : ''}${pairs >= 1 ? ` · ДОГОВОРИЛИСЬ ${pairs}` : ''}`,
      `ВЫЛАЗКИ · ВСЕГО ${c.missions} · ЗАВЕРШЕНО ${c.done} · ЗОНДОВ В ПУТИ ${c.probesOut}${c.life >= 1 ? ` · В ЖИЗНИ ${c.life}` : ''}`,
      `ХРАНИЛИЩЕ · РЕЛИКВИЙ ${c.earned} / ${c.achievements} · НАЙДЕНО ${c.secrets}`,
      c.nadirOpen ? 'ИСТОК · ОТКРЫТО' : `ЗАПЕЧАТАНО · ОСКОЛКОВ ${c.shards} / 5`,
    ];
  }
  function layoutRings() {
    clear(ringsBox); clear(srRings);
    const texts = ringTexts();
    texts.forEach((t, i) => {
      const b = K.band(i);
      const row = block(ringsBox, 't0-ring');
      el('p', 't-label', t, row, { data: { stratum: String(i) } });
      const room = roomByStratum(i);
      if (room) el('p', 't-micro t0-ring__to', `→ ${room.name}`, row);
      if (b && !layout.isPhone) row.style.transform = `translate(${fmt(b.cx + b.w / 2 + 28)}px,${fmt(b.cy - 9)}px)`;
      el('li', null, t, srRings);
    });
    if (WORLD.clan.about) el('li', null, WORLD.clan.about, srRings);
  }
  function openUnfold(first) {
    if (C.open) return;
    C.open = true;
    app.unfolded = true;
    if (app.phase === 'idle') setPhase('unfolded');
    const k0 = K.k, cx = K.cx, cy = K.cy, k1 = k0 * (layout.isPhone ? 0.7 : 0.66);
    tween(reduced() ? 0 : (first ? 900 : 600), (u) => { L.view(cx, cy, k0 + (k1 - k0) * u); K.setGap(GAP.rest + (0.2 - GAP.rest) * u); }, (u) => 1 - Math.pow(1 - u, 3))
      .done.then(() => { if (!C.open) return; L.place(cx, cy, k1); K.setGap(0.2); layoutRings(); unf.hidden = false; (void unf.offsetWidth, unf.classList.add('is-in')); });
    L.px.classList.add('is-off');
    today.hidden = true;
    const c = worldCounts();
    mottoL.textContent = '';
    togetherL.textContent = `МЫ ВМЕСТЕ ${c.daysSinceFounded} ${plural(c.daysSinceFounded, 'день', 'дня', 'дней')}`;
    aboutB.textContent = WORLD.clan.about || '';
    aboutB.hidden = !WORLD.clan.about;
    after(reduced() ? 0 : (first ? 900 : 600), () => {
      if (!C.open) return;
      L.nucleusFlash();
      beamWrite(mottoL, WORLD.clan.motto).then(() => { if (C.open && WORLD.clan.about) after(240, () => revealBody(aboutB)); });
    });
    if (ctx.audio) ctx.audio.play('select', {});
  }
  function closeUnfold() {
    if (!C.open) return;
    C.open = false;
    app.unfolded = false;
    unf.classList.remove('is-in'); unf.hidden = true;
    if (app.phase === 'unfolded') setPhase('idle');
    const k0 = K.k, cx = K.cx, cy = K.cy, T1 = L.target('idle'), k1 = T1.k;
    tween(reduced() ? 0 : 900, (u) => { L.view(cx + (T1.cx - cx) * u, cy + (T1.cy - cy) * u, k0 + (k1 - k0) * u); K.setGap(0.2 + (GAP.rest - 0.2) * u); }, (u) => u * u * (3 - 2 * u))
      .done.then(() => { if (!C.open) { K.setGap(GAP.rest); L.setMode(L.mode, 0); L.px.classList.remove('is-off'); fillToday(); } });
    if (ctx.audio) ctx.audio.play('recallThud', {});
  }

  // ── КОДЕКС back elevation (A3.3 T0) ─────────────────────────────────────────────────────────────────────────
  const lawRows = [];
  function buildLaws() {
    clear(laws); lawRows.length = 0;
    const earned = ctx.deeds && ctx.deeds.earned ? ctx.deeds.earned() : [];
    for (let i = 0; i < 7; i++) {
      const b = K.band(i);
      const row = el('div', 't0-law', null, laws, { data: { stratum: String(i) } });
      el('p', 't-micro t0-law__sign', STRATA_GEOM[i].sign, row);
      const tx = el('p', 't-body t0-law__t', null, row);
      const law = earned.includes(i) && ctx.deeds.law ? ctx.deeds.law(i) : null;
      if (law && law.text) tx.textContent = law.text; else row.classList.add('is-empty');
      if (b) row.style.transform = `translate(-50%,${fmt(b.cy)}px) translateY(-50%)`;
      lawRows.push({ row, tx });
    }
    // his glyph on the • back face (stratum 3, face 6)
    const g = state.data && state.data.glyph;
    if (g && g.length) {
      const b = K.band(3);
      const gs = Math.min(36, b.h * 0.5);
      const s = svg('svg', { class: 't0-law__glyph', width: gs, height: gs, viewBox: `0 0 ${gs} ${gs}` }, laws);
      svg('path', { d: glyphPath(g, 2, 2, gs - 4) }, s);
      s.style.transform = `translate(${fmt(b.cx - gs / 2)}px,${fmt(b.cy + b.h * 0.12)}px)`;
    }
  }
  /** 280 ms scaleX through 0; the content swaps at the middle. → Promise */
  function flip(toBack, ms = 280) {
    if (C.back === toBack) return Promise.resolve();
    C.flipping = true;
    const half = reduced() ? 0 : ms / 2;
    const r = K.root;
    r.style.transformOrigin = `${fmt(K.cx)}px ${fmt(K.cy)}px`;
    return new Promise((resolve) => {
      tween(half, (u) => { r.style.transform = `scaleX(${fmt(1 - u)})`; if (!laws.hidden) laws.style.opacity = fmt(1 - u); }).done.then(() => {
        C.back = toBack;
        r.classList.toggle('is-back', toBack);
        if (toBack) { buildLaws(); laws.hidden = false; } else laws.hidden = true;
        tween(half, (u) => { r.style.transform = `scaleX(${fmt(u)})`; laws.style.opacity = fmt(u); }).done.then(() => {
          r.style.transform = ''; C.flipping = false; resolve();
        });
      });
    });
  }
  const codexView = {
    toBack(ms) { return flip(true, Math.max(280, ms || 0)); },
    cut(i, text) {
      const r = lawRows[i];
      if (!r) return Promise.resolve();
      r.row.classList.remove('is-empty');
      if (ctx.audio) ctx.audio.play('chisel', {});
      return beamWrite(r.tx, text);
    },
    flashFace(i) { K.flash(i, 'electrum', 24); },
    leader(i, blockEl) {
      const b = K.band(i);
      const wrapB = el('div', 't0-block t0-codexleader', null, T.root);
      el('i', 't0-tick', null, wrapB, { attrs: { 'aria-hidden': 'true' } });
      if (blockEl) wrapB.appendChild(blockEl);
      if (b) wrapB.style.transform = `translate(${fmt(b.cx + Math.max(b.w / 2, 90) + 24)}px,${fmt(b.cy - 12)}px)`;
      return { remove(ms = 240) { wrapB.classList.add('is-out'); after(ms, () => { if (wrapB.parentNode) wrapB.parentNode.removeChild(wrapB); }); } };
    },
    toFront(ms) { return flip(false, Math.max(280, ms || 0)); },
  };

  // ── gestures on the SVG Key ────────────────────────────────────────────────────────────────────────────────
  const G = { owned: false, idx: -1, axis: 0, flipped: false, read: false, downAt: 0, holding: false };
  const usable = () => app.room === 'CORE' && !T.lostMode && L.visible && (app.phase === 'idle' || app.phase === 'unfolded' || app.phase === 'resonance')
    && !(ctx.director && ctx.director.busy && ctx.director.busy()) && !(app.show && app.show.active && ctx.host && ctx.host.show && ctx.host.show.scene === -2);
  input.push({
    name: 't0-key',
    onGesture(g) {
      switch (g.type) {
        case 'down': {
          if (!usable()) return false;
          const i = K.pick(g.x, g.y);
          if (i < 0) {
            if (C.open && app.phase === 'unfolded') { G.owned = true; G.idx = -1; return true; }   // a click on empty space refolds
            return false;
          }
          G.owned = true; G.idx = i; G.axis = 0; G.flipped = false; G.read = false; G.downAt = performance.now();
          if (g.pointerType === 'touch') K.flash(i, 'white', 1);
          return true;
        }
        case 'tap': {
          if (!G.owned) return false;
          G.owned = false;
          if (G.idx < 0) { if (C.open) ctx.director.go('#/core', { source: 'key' }); return true; }
          if (C.back) { flip(false); return true; }
          ctx.bus.emit('key:click', { index: G.idx, x: g.x, y: g.y });
          route(G.idx);
          return true;
        }
        case 'hold': {
          if (!G.owned || G.idx < 0 || C.open || C.back) return true;
          G.holding = true;
          res.start(G.downAt);
          return true;
        }
        case 'dragstart': {
          if (!G.owned || G.idx < 0) return !!G.owned;
          if (G.holding) return true;
          G.axis = Math.abs(g.tx) >= Math.abs(g.ty) ? 1 : 2;
          return true;
        }
        case 'drag': {
          if (!G.owned || G.idx < 0 || G.holding) return !!G.owned;
          if (G.axis === 2 && !G.flipped && Math.abs(g.ty) >= 0.655 * 2.4 * K.k) {
            G.flipped = true;
            ctx.bus.emit('key:flip', { dir: g.ty > 0 ? 'over' : 'back' });
            K.root.classList.add(g.ty > 0 ? 'is-turn-over' : 'is-turn-back');
            after(700, () => K.root.classList.remove('is-turn-over', 'is-turn-back'));
          }
          if (G.axis === 1 && !G.read && Math.abs(g.tx) > 0.5 * 1.24 * K.k && !C.flipping && !C.open) {
            G.read = true;
            if (C.backTimer) { C.backTimer = 0; }
            flip(!C.back);
          }
          return true;
        }
        case 'up': case 'cancel': case 'dragend': case 'swipe': {
          if (!G.owned) return false;
          if (g.type === 'up' || g.type === 'cancel') {
            G.owned = false;
            if (G.holding) { G.holding = false; res.release(); }
            if (C.back && G.read) {
              const my = ++C.backTimer;
              after(4000, () => { if (C.backTimer === my && C.back && !C.flipping) flip(false); });
            }
          }
          return true;
        }
        default: return false;
      }
    },
    onKey(e) {
      if (app.room !== 'CORE' || T.lostMode) return false;
      if (e.key === 'Escape' && C.open) { ctx.director.go('#/core', { source: 'kbd' }); return true; }
      if (e.key === 'Escape' && C.back) { flip(false); return true; }
      return false;
    },
  });

  /** WebGL CORE seed targets (WP0/WP4): • unfolds / refolds, every other band DIVEs (N sealed → the router shudders). */
  function route(index) {
    if (!ctx.director || ctx.director.busy() || (app.phase !== 'idle' && app.phase !== 'unfolded')) return;
    if (index === 3) { ctx.director.go(C.open ? '#/core' : '#/core/open', { source: 'key' }); return; }
    const r = roomByStratum(index);
    if (r) ctx.director.go(`#/${r.slug}`, { source: 'key' });
  }

  const hall = {
    id: 'CORE',
    section: sec,
    codexView,
    resonance: res,
    show(route) {
      L.show(true);
      if (route && route.sub === 'open') openUnfold(false);
      else { closeUnfold(); fillToday(); }
      if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
    },
    hide() {
      if (C.open) { C.open = false; app.unfolded = false; unf.hidden = true; unf.classList.remove('is-in'); K.setGap(GAP.rest); L.setMode(L.mode, 0); L.px.classList.remove('is-off'); }
      if (C.back) { C.back = false; K.root.classList.remove('is-back'); laws.hidden = true; }
      if (res.active) res.release();
      L.show(false);
    },
    relayout() { if (C.open) layoutRings(); if (C.back) buildLaws(); },
    onKey(e) {
      if (e.key === 'Escape' && C.open) { ctx.director.go('#/core', { source: 'kbd' }); return true; }
      if (e.key === 'Escape' && C.back) { flip(false); return true; }
      return false;
    },
    flipBack: () => flip(false),
  };
  fillToday();
  // a DIVE into #/core/open arrives with phase 'transition': the unfolded phase is set on arrival
  ctx.bus.on('route:change', (e) => { if (C.open && app.tier === 'T0' && e && e.route && e.route.room === 'CORE' && e.route.sub === 'open' && app.phase === 'idle') setPhase('unfolded'); });
  void ROOMS;
  return hall;
}
