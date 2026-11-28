// halls/members/readout.js — the member readout (SPEC §6.2 table, A3.1 РОЛЬ, A3.2 СБОР row, A11.5 O12 MEMBER / O43 LEVEL).
//
//   MEMBER        Лёва · «ЯКОРЬ»            HEADING
//   STATUS        ● на связи                BODY + 6 px dot (--ember «на связи», --silver «в пути», --pewter «отдыхает»)
//   РОЛЬ          защита                    BODY (omitted when empty; the operator's empty role reads «основатель»)
//   LEVEL         11                        BODY 17 px, exactly like MISSIONS (O43: no giant numeral on a friend's card)
//   MISSIONS      17                        BODY
//   ACHIEVEMENTS  ◇ ◇ ◇                     24 px line icons of their relics → #/insignia/<id>
//   «Если Лёва держит точку — точка держится.»          BODY
//   (focus)  ВНУТРЕННЯЯ ШУТКА + joke                    LABEL + BODY
//   (his)    «Твой знак ещё не вырезан.» | «Это твой знак. Можно вырезать новый.»  +  МАСТЕРСКАЯ →
//   (his focus) СБОР   «удержи колонну — клан услышит» until the first СБОР, then MICRO ПОСЛЕДНИЙ {dd.mm}
//
// The rows write one by one, 60 ms apart; each LABEL does a one-shot wdth 75 → 100 (CSS .mb-wd). DOM text is only
// ever set through textContent. The phone peek variant shows the name, STATUS and РОЛЬ only (O43).
import { relicIconSvg } from '../insignia/shapes.js';
import { achievementById, EMPTY_LINE } from '../../data/world.js';
import { revealBody } from '../../ui/text.js';
import { after, cancelAfter } from '../../core/clock.js';
import { ENV } from '../../core/env.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const DOT = { 'на связи': 'ember', 'в пути': 'silver', 'отдыхает': 'pewter' };

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

/** The member's role as shown (A3.1): lower case; the operator's empty role reads «основатель»; '' = no row. */
export function roleOf(m, isOp) {
  const r = (m && typeof m.role === 'string' ? m.role : '').trim();
  if (r) return r.toLocaleLowerCase('ru');
  return isOp ? 'основатель' : '';
}

function row(name, valueNode, cls = '') {
  const r = el('div', `mb-row ${cls}`.trim());
  r.dataset.qa = 'readout-row';
  r.dataset.row = name;
  const k = el('span', 't-label mb-k', name);
  r.append(k, valueNode);
  return r;
}

function statusNode(m) {
  const v = el('span', 't-body mb-v mb-status');
  const d = el('i', `dot dot--${DOT[m.status] || 'pewter'}`);
  d.setAttribute('aria-hidden', 'true');
  v.append(d, el('span', '', m.status || ''));
  return v;
}

function relicsNode(m, go) {
  const v = el('span', 'mb-v mb-relics');
  const ids = Array.isArray(m.achievements) ? m.achievements : [];
  let any = false;
  for (const id of ids) {
    const a = achievementById(id);
    if (!a) continue;
    any = true;
    const b = el('button', 'mb-relic');
    b.type = 'button';
    b.setAttribute('aria-label', a.title || id);
    b.dataset.id = id;
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '24'); svg.setAttribute('height', '24');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', relicIconSvg(a.shape, 24));
    svg.appendChild(p);
    b.appendChild(svg);
    b.addEventListener('click', (e) => { e.stopPropagation(); go(`#/insignia/${id}`); });
    v.appendChild(b);
  }
  if (!any) v.appendChild(el('span', 't-body', EMPTY_LINE.achievements));
  return v;
}

/**
 * opts: { member, isOp, focus:boolean, hasGlyph:boolean, sbor:{count,last,hint}|null, phone:boolean,
 *         go(hash), onWorkshop(), sborVerb:{ down(), up() } }
 * → { el, rows: HTMLElement[], write(), sborRow, workshopVerb, peek (phone) }
 */
export function buildReadout(opts) {
  const m = opts.member, isOp = !!opts.isOp;
  const root = el('div', 'mb-ro');
  root.dataset.qa = 'readout';
  root.dataset.id = m.id;
  const rows = [];

  if (!opts.phone) {           // phone: name, STATUS and РОЛЬ live in the sheet peek (buildPeek)
    const name = el('span', 't-heading mb-v mb-name', `${m.name} · «${m.callsign}»`);
    rows.push(row('MEMBER', name, 'mb-row--name'));
    rows.push(row('STATUS', statusNode(m)));
    const role = roleOf(m, isOp);
    if (role) rows.push(row('РОЛЬ', el('span', 't-body mb-v', role)));
  }
  rows.push(row('LEVEL', el('span', 't-body mb-v mb-num', String(m.level | 0))));
  rows.push(row('MISSIONS', el('span', 't-body mb-v mb-num', String(m.missions | 0))));
  rows.push(row('ACHIEVEMENTS', relicsNode(m, opts.go)));

  const list = el('div', 'mb-rows');
  for (const r of rows) list.appendChild(r);
  root.appendChild(list);

  const extra = [];
  if (m.trait) { const t = el('p', 't-body mb-trait', `«${m.trait}»`); root.appendChild(t); extra.push(t); }
  if (opts.focus && m.joke) {
    const j = el('div', 'mb-joke');
    j.append(el('p', 't-label mb-k', 'ВНУТРЕННЯЯ ШУТКА'), el('p', 't-body', m.joke));
    root.appendChild(j); extra.push(j);
  }
  let workshopVerb = null, sborRow = null;
  if (isOp) {
    const box = el('div', 'mb-op');
    box.appendChild(el('p', 't-body', opts.hasGlyph ? 'Это твой знак. Можно вырезать новый.' : 'Твой знак ещё не вырезан.'));
    workshopVerb = el('button', 'verb mb-verb', 'МАСТЕРСКАЯ →');
    workshopVerb.type = 'button';
    workshopVerb.dataset.qa = 'workshop-verb';
    workshopVerb.addEventListener('click', (e) => { e.stopPropagation(); opts.onWorkshop(); });
    box.appendChild(workshopVerb);
    root.appendChild(box); extra.push(box);
    if (opts.focus && opts.sbor) {
      const info = opts.sbor;
      const verb = el('button', 'verb mb-k mb-sbor-verb', 'СБОР');
      verb.type = 'button';
      verb.dataset.qa = 'sbor-verb';
      const first = !(info.count > 0) || !info.last;
      const val = first ? el('span', 't-body mb-v', 'удержи колонну — клан услышит')
        : el('span', 't-micro mb-v', `ПОСЛЕДНИЙ ${fmtDayMonth(info.last)}`);
      sborRow = el('div', 'mb-row mb-row--sbor');
      sborRow.dataset.qa = 'readout-row';
      sborRow.dataset.row = 'СБОР';
      sborRow.append(verb, val);
      if (opts.sborVerb) {
        let held = false;
        const down = (e) => {
          if (e.repeat || (e.key !== 'Enter' && e.key !== ' ' && e.code !== 'Space')) return;
          e.preventDefault(); e.stopPropagation();
          held = true; opts.sborVerb.down();
        };
        const up = (e) => {
          if (e.key !== 'Enter' && e.key !== ' ' && e.code !== 'Space') return;
          e.preventDefault(); e.stopPropagation();
          if (held) { held = false; opts.sborVerb.up(); }
        };
        verb.addEventListener('keydown', down);
        verb.addEventListener('keyup', up);
        verb.addEventListener('blur', () => { if (held) { held = false; opts.sborVerb.up(); } });
        verb.addEventListener('pointerdown', (e) => { e.stopPropagation(); held = true; opts.sborVerb.down(); try { verb.setPointerCapture(e.pointerId); } catch (er) { /* none */ } });
        const pu = (e) => { e.stopPropagation(); if (held) { held = false; opts.sborVerb.up(); } };
        verb.addEventListener('pointerup', pu);
        verb.addEventListener('pointercancel', pu);
        verb.addEventListener('click', (e) => e.preventDefault());
      }
      root.appendChild(sborRow); extra.push(sborRow);
    }
  }

  let timers = [];
  /** Row-by-row write (60 ms per row, LABEL wdth one-shot, values revealed). */
  function write() {
    for (const t of timers) cancelAfter(t);
    timers = [];
    const seq = rows.concat(extra);
    if (ENV.reducedMotion) { for (const r of seq) r.classList.remove('mb-pend'); return; }
    seq.forEach((r, i) => {
      r.classList.add('mb-pend');
      timers.push(after(60 * i, () => {
        r.classList.remove('mb-pend');
        const k = r.querySelector('.mb-k');
        if (k) { k.classList.remove('mb-wd'); void k.offsetWidth; k.classList.add('mb-wd'); }
        const v = r.querySelector('.t-body, .t-heading');
        if (v && v.textContent.length < 60) revealBody(v);
      }));
    });
  }
  function stop() { for (const t of timers) cancelAfter(t); timers = []; }

  return { el: root, rows, extra, write, stop, workshopVerb, sborRow };
}

/** Phone peek (O43): name, STATUS and РОЛЬ — never LEVEL. */
export function buildPeek(m, isOp) {
  const root = el('div', 'mb-peek');
  root.dataset.qa = 'readout';
  root.dataset.id = m.id;
  root.appendChild(row('MEMBER', el('span', 't-heading mb-v mb-name', `${m.name} · «${m.callsign}»`), 'mb-row--name'));
  root.appendChild(row('STATUS', statusNode(m)));
  const role = roleOf(m, isOp);
  if (role) root.appendChild(row('РОЛЬ', el('span', 't-body mb-v', role)));
  return root;
}

/** 'YYYY-MM-DD' → 'dd.mm' */
export function fmtDayMonth(day) {
  const s = String(day || '');
  const mm = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return mm ? `${mm[3]}.${mm[2]}` : '';
}
