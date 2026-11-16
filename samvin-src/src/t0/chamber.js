// t0/chamber.js — WP11. The mission chamber in T0 (SPEC §6.3 "Mission chamber", "Probe"; SPEC-ADDENDUM A11.6, O21/O35):
// the terrain as a contour map — a 64 × 64 seeded simplex heightfield (seed = code), 12 marching-squares contour levels
// (index contours brighter) — the seeded route (done: ember dots every 2 m; otherwise a silver dashed line with survey
// crosses), GIANT `{code}` behind, and the readable block ([data-qa=chamber-block]): LABEL `MISSION 004 · В ПУТИ · В ИГРЕ`
// ([data-qa=chamber-label]), HEADING title, ЗАДАЧА + BRIEF, УСЛОВИЯ (+ survey crosses), КТО БЫЛ chips (24 px glyph + LABEL
// → the member), ИТОГ, НАГРАДА (mini relic), ПРЕДЛОЖИЛ (promoted proposals), ЗАПИСЬ ЗОНДА + log once the probe is back.
// The probe: a 64 px circle ([data-qa=probe]) + LABEL ([data-qa=probe-label]); hold 1,200 ms (2 px ember ring, 220 → 440 Hz),
// early release unwinds 240 ms (no deny); complete → sendProbe, an ember beam dot with a 300 ms tail flies the route
// (2,500 ms) and leaves upward; label «ЗОНД В ПУТИ · ВЕРНЁТСЯ ЗАВТРА». Locked / sealed: «Зонд не пройдёт: сигнал зашифрован.»
import { missionByCode, whereLabel, memberById, achievementById, EMPTY_LINE } from '../data/world.js';
import { missionView, sendProbe, probeStatus, markLogRead } from '../halls/voyages/missionModel.js';
import { simplex2, mulberry32, hashStr } from '../core/rng.js';
import { layout } from '../core/layout.js';
import { loop, ORDER } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { relicIconSvg } from '../halls/insignia/shapes.js';
import { svg, el, fmt, clear, block, glyphPath, reduced } from './dom.js';

const N = 64, LEVELS = 12;

function contours(code, x0, y0, w, h) {
  const nz = simplex2(hashStr(`terrain:${code}`));
  const v = new Float32Array((N + 1) * (N + 1));
  let lo = 1e9, hi = -1e9;
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const x = i / N, y = j / N;
    const z = 0.65 * nz(x * 2.2, y * 2.2) + 0.28 * nz(x * 5.1 + 7, y * 5.1 + 3) + 0.07 * nz(x * 11, y * 11);
    v[j * (N + 1) + i] = z; lo = Math.min(lo, z); hi = Math.max(hi, z);
  }
  const sx = w / N, sy = h / N;
  const out = [];
  for (let L = 1; L <= LEVELS; L++) {
    const iso = lo + ((hi - lo) * L) / (LEVELS + 1);
    let d = '';
    const P = (x, y) => `${fmt(x0 + x * sx)} ${fmt(y0 + y * sy)}`;
    const t = (a, b) => (Math.abs(a - b) < 1e-9 ? 0.5 : (iso - a) / (b - a));
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = v[j * (N + 1) + i], b = v[j * (N + 1) + i + 1], c = v[(j + 1) * (N + 1) + i + 1], e = v[(j + 1) * (N + 1) + i];
      const k = (a > iso ? 1 : 0) | (b > iso ? 2 : 0) | (c > iso ? 4 : 0) | (e > iso ? 8 : 0);
      if (k === 0 || k === 15) continue;
      const T_ = () => P(i + t(a, b), j), R_ = () => P(i + 1, j + t(b, c)), B_ = () => P(i + t(e, c), j + 1), L_ = () => P(i, j + t(a, e));
      const sg = (p, q) => { d += `M${p}L${q}`; };
      switch (k) {
        case 1: case 14: sg(L_(), T_()); break;
        case 2: case 13: sg(T_(), R_()); break;
        case 3: case 12: sg(L_(), R_()); break;
        case 4: case 11: sg(R_(), B_()); break;
        case 6: case 9: sg(T_(), B_()); break;
        case 7: case 8: sg(L_(), B_()); break;
        case 5: sg(L_(), T_()); sg(R_(), B_()); break;
        case 10: sg(T_(), R_()); sg(L_(), B_()); break;
        default: break;
      }
    }
    out.push({ d, index: L % 4 === 0 });
  }
  return out;
}

export function createChamber(ctx, T, sec) {
  const wrap = el('div', 't0-chamber', null, sec);
  wrap.hidden = true;
  const map = svg('svg', { class: 't0-terrain', 'aria-hidden': 'true' }, wrap);
  const blk = block(wrap, 't0-chblock', { qa: 'chamber-block' });
  const C = { code: null, route: [], routeD: '', probeT: 0, holdId: 0, voice: null, flying: false };

  function draw(m, st) {
    clear(map);
    const w = layout.w, h = layout.h;
    map.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const box = layout.isPhone ? { x: 16, y: 130 + layout.safe.t, w: w - 32, h: Math.min(320, h * 0.38) }
      : { x: w * 0.06, y: h * 0.07, w: w * 0.5, h: h * 0.37 };
    for (const c of contours(m.code, box.x, box.y, box.w, box.h)) svg('path', { d: c.d, class: c.index ? 't0-ct t0-ct--i' : 't0-ct' }, map);
    // seeded route, 5–9 waypoints
    const r = mulberry32(hashStr(`route:${m.code}`));
    const n = 5 + Math.floor(r() * 5);
    C.route = [];
    for (let i = 0; i < n; i++) C.route.push([box.x + box.w * (0.1 + (0.8 * i) / (n - 1)), box.y + box.h * (0.2 + 0.6 * r())]);
    C.routeD = C.route.map((p, i) => `${i ? 'L' : 'M'}${fmt(p[0])} ${fmt(p[1])}`).join('');
    const done = st === 'done';
    svg('path', { d: C.routeD, class: done ? 't0-route t0-route--done' : 't0-route' }, map);
    for (const p of C.route) svg('path', { d: `M${fmt(p[0] - 3.5)} ${fmt(p[1])}h7M${fmt(p[0])} ${fmt(p[1] - 3.5)}v7`, class: 't0-cross' }, map);
    C.dot = svg('circle', { r: 2, class: 't0-beam' }, map);
    C.tail = svg('path', { class: 't0-beam__t' }, map);
  }

  function row(label, cls, text) { el('p', 't-label t0-ch__l', label, blk); if (text != null) return el('p', cls, text, blk); return null; }

  function fill(m, v) {
    clear(blk);
    el('i', 't0-tick', null, blk, { attrs: { 'aria-hidden': 'true' } });
    const w = whereLabel(m.where);
    el('p', 't-label', `MISSION ${m.code} · ${v.label}${w ? ` · ${w}` : ''}`, blk, { qa: 'chamber-label' });
    el('p', 't-heading', v.state === 'locked' ? '' : m.title, blk);
    row('ЗАДАЧА', 't-brief', m.brief);
    if (m.conditions && m.conditions.length) {
      el('p', 't-label t0-ch__l', 'УСЛОВИЯ', blk);
      const ul = el('ul', 't0-cond', null, blk);
      for (const c of m.conditions) { const li = el('li', 't-body', null, ul); el('i', 'cross', null, li, { attrs: { 'aria-hidden': 'true' } }); li.appendChild(document.createTextNode(c)); }
    }
    el('p', 't-label t0-ch__l', 'КТО БЫЛ', blk);
    const chips = el('div', 't0-chips', null, blk);
    const crew = (m.crew || []).map(memberById).filter(Boolean);
    if (!crew.length) el('p', 't-body', '—', chips);
    for (const p of crew) {
      const b = el('button', 'chip', null, chips, { attrs: { type: 'button' } });
      if (p.glyph && p.glyph.length) { const s = svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', class: 't0-chipg' }, b); svg('path', { d: glyphPath(p.glyph, 3, 3, 18) }, s); }
      b.appendChild(document.createTextNode(p.callsign));
      b.addEventListener('click', () => ctx.director.go(`#/members/${p.id}`, { source: 'hall' }));
    }
    row('ИТОГ', 't-body', v.state === 'done' ? (m.result || '—') : v.state === 'active' ? 'Ещё не закончена.' : 'Никто ещё не ходил.');
    const rew = m.reward ? achievementById(m.reward) : null;
    if (rew) {
      el('p', 't-label t0-ch__l', 'НАГРАДА', blk);
      const r = el('div', `t0-reward${rew.earned ? ' is-earned' : ''}`, null, blk);
      const s = svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24' }, r);
      svg('path', { d: relicIconSvg(rew.shape, 24) }, s);
      el('p', 't-label', rew.title, r);
    }
    const by = ctx.host && ctx.host.proposals ? ctx.host.proposals.proposedByName(m.code) : null;
    if (by) row('ПРЕДЛОЖИЛ', 't-body', by);
    if (probeStatus(m.code) === 'back') {
      row('ЗАПИСЬ ЗОНДА', 't-body', m.log || EMPTY_LINE.probeLog);
      markLogRead(m.code);
    }
    // the probe
    const pr = el('div', 't0-probe', null, blk);
    if (v.state === 'locked' || v.state === 'sealed') { el('p', 't-body', 'Зонд не пройдёт: сигнал зашифрован.', pr); return; }
    const btn = el('button', 't0-probe__b', null, pr, { qa: 'probe', attrs: { type: 'button', 'aria-label': 'ОТПРАВИТЬ ЗОНД' } });
    const s = svg('svg', { width: 64, height: 64, viewBox: '-32 -32 64 64' }, btn);
    svg('circle', { r: 31, class: 't0-probe__c' }, s);
    const ring = svg('circle', { r: 28, class: 't0-probe__ring', pathLength: '1', transform: 'rotate(-90)' }, s);
    const st = probeStatus(m.code);
    const lab = el('p', 't-label', st === 'none' ? 'ОТПРАВИТЬ ЗОНД' : st === 'out' ? 'ЗОНД В ПУТИ · ВЕРНЁТСЯ ЗАВТРА' : 'ЗОНД ВЕРНУЛСЯ', pr, { qa: 'probe-label' });
    if (!v.canProbe) btn.classList.add('is-spent');
    const setFill = (f) => { ring.style.strokeDashoffset = fmt(1 - f); ring.classList.toggle('is-on', f > 0); };
    setFill(0);
    let t0 = 0, held = 0;
    const stop = (complete) => {
      if (C.holdId) { loop.remove(C.holdId); C.holdId = 0; }
      if (C.voice && C.voice.stop) { try { C.voice.stop(80); } catch (e) { /* voice */ } }
      C.voice = null;
      if (!complete) { const f0 = held; tween(reduced() ? 0 : 240, (u) => setFill(f0 * (1 - u))); }
    };
    btn.addEventListener('pointerdown', (e) => {
      if (!v.canProbe || C.flying || probeStatus(m.code) !== 'none') return;
      e.preventDefault();
      t0 = performance.now(); held = 0;
      if (ctx.audio) C.voice = ctx.audio.start('probeHold', {});
      C.holdId = loop.add(() => {
        held = Math.min(1, (performance.now() - t0) / 1200);
        setFill(held);
        if (held >= 1) { stop(true); setFill(0); launch(m, lab); }
      }, ORDER.UI);
    });
    // a release after the full 1,200 ms completes even when the page skipped the frame that would have (lagging device)
    const up = () => { if (!C.holdId) return; if (performance.now() - t0 >= 1200) { stop(true); setFill(0); launch(m, lab); } else stop(false); };
    btn.addEventListener('pointerup', up); btn.addEventListener('pointerleave', up); btn.addEventListener('pointercancel', up);
  }

  /** the beam dot flies the route (2,500 ms) with a 300 ms tail, then leaves upward */
  function launch(m, lab) {
    if (!sendProbe(m.code)) return;
    lab.textContent = 'ЗОНД В ПУТИ · ВЕРНЁТСЯ ЗАВТРА';
    if (ctx.audio) ctx.audio.play('probeFlight', {});
    C.flying = true;
    const pts = C.route;
    const seg = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
    const at = (u) => {
      let d = u * total;
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i]) { const k = d / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; }
        d -= seg[i];
      }
      return pts[pts.length - 1];
    };
    C.dot.classList.add('is-on'); C.tail.classList.add('is-on');
    const trail = [];
    tween(reduced() ? 0 : 2500, (u) => {
      const p = at(u);
      C.dot.setAttribute('cx', fmt(p[0])); C.dot.setAttribute('cy', fmt(p[1]));
      trail.push([p[0], p[1], performance.now()]);
      while (trail.length && performance.now() - trail[0][2] > 300) trail.shift();
      C.tail.setAttribute('d', trail.map((q, i) => `${i ? 'L' : 'M'}${fmt(q[0])} ${fmt(q[1])}`).join(''));
    }).done.then(() => {
      const p = at(1);
      tween(reduced() ? 0 : 500, (u) => { C.dot.setAttribute('cy', fmt(p[1] - u * 260)); C.dot.style.opacity = fmt(1 - u); }).done.then(() => {
        C.dot.classList.remove('is-on'); C.tail.classList.remove('is-on'); C.dot.style.opacity = ''; C.flying = false;
      });
    });
  }

  return {
    show(code) {
      const m = missionByCode(code);
      if (!m) return;
      C.code = code;
      const v = missionView(m);
      draw(m, v.state);
      fill(m, v);
      wrap.hidden = false;
      (void wrap.offsetWidth, wrap.classList.add('is-in'));
      if (ctx.datum && ctx.datum.setGiant) ctx.datum.setGiant(v.numberShown);
      if (layout.isPhone && ctx.sheet) {
        const peek = el('div');
        el('p', 't-label', `MISSION ${m.code} · ${v.label}`, peek);
        el('p', 't-heading', v.state === 'locked' ? '' : m.title, peek);
        ctx.sheet.set(blk, { peek, state: 'peek' });
      }
    },
    hide() {
      if (blk.parentNode !== wrap) { wrap.appendChild(blk); if (ctx.sheet) ctx.sheet.set(null); }
      if (C.code && ctx.datum && ctx.datum.setGiant) ctx.datum.setGiant(null);
      C.code = null;
      wrap.classList.remove('is-in');
      wrap.hidden = true;
      if (C.holdId) { loop.remove(C.holdId); C.holdId = 0; }
    },
    relayout() { if (C.code) this.show(C.code); },
  };
}
