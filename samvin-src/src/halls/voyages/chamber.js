// halls/voyages/chamber.js — WP6: the mission chamber's readable block and the probe (SPEC §6.3, A3.3, A3.4, A11.6).
//
//   MISSION 004 · В ПУТИ · В ИГРЕ          LABEL (A11.6: the where mark joins the LABEL; locked: 0?? and its signal)
//   Северная башня                          HEADING (lock-in)
//   ЗАДАЧА / brief                          LABEL + BRIEF
//   УСЛОВИЯ / + lines                       LABEL + BODY lines, each after a 7 px survey cross
//   КТО БЫЛ / chips                         LABEL + 24 px glyph + callsign LABEL → #/members/<id>
//   ПРЕДЛОЖИЛ / name                        promoted proposals (A3.4)
//   ИТОГ / result                           done: data `result`; active: «Ещё не закончена.»; new: «Никто ещё не ходил.»
//   НАГРАДА / mini relic                    earned: silver; otherwise a pewter outline
//   ЗАПИСЬ ЗОНДА / log                      after the probe came back (EMPTY_LINE.probeLog when the log is empty)
//   ( 64 px ) ОТПРАВИТЬ ЗОНД                the probe: hold 1,200 ms (2 px ember ring + rising tone); early release unwinds
//                                           240 ms with no deny; locked / sealed: «Зонд не пройдёт: сигнал зашифрован.»
// The proposal chamber (A3.4): LABEL `ПРЕДЛОЖЕНИЕ · П-1 · В ИГРЕ · 12.10.2026`, HEADING, ЗАДАЧА + text, ПРЕДЛОЖИЛ + his
// name, the O21 BODY, and `УБРАТЬ` (a 1,200 ms hold).
// Desktop: a left column at 48 px on a scrim (max 36ch); phone: the same node goes into the bottom sheet.
import { memberById, achievementById, whereLabel, EMPTY_LINE } from '../../data/world.js';
import { drawGlyph } from '../../core/glyph.js';
import { relicIconSvg } from '../insignia/shapes.js';
import { fmtDate, nbsp } from '../../core/ru.js';
import { palette } from '../../render/palette.js';

export const HOLD_MS = 1200;
export const UNWIND_MS = 240;
export const PROBE_COPY = Object.freeze({ send: 'ОТПРАВИТЬ ЗОНД', out: 'ЗОНД В ПУТИ · ВЕРНЁТСЯ ЗАВТРА', sealed: 'Зонд не пройдёт: сигнал зашифрован.' });
export const PROPOSAL_BODY = 'Обсуди с командой и покажи папе. Если папа впишет идею в мир — она станет настоящей вылазкой.';
const RESULT = { active: 'Ещё не закончена.', new: 'Никто ещё не ходил.' };
const SVGNS = 'http://www.w3.org/2000/svg';
const RING_R = 31, RING_C = 2 * Math.PI * RING_R;

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = nbsp(String(text));
  return e;
}
function row(parent, label, ...nodes) {
  const r = el('div', 'vy-row');
  r.appendChild(el('p', 't-label vy-row-label', label));
  for (const n of nodes) if (n) r.appendChild(n);
  parent.appendChild(r);
  return r;
}

/** The 64 px probe circle: a 1 px silver ring at rest, a 2 px ember ring filling with the hold. */
function probeButton() {
  const b = el('button', 'vy-probe-btn');
  b.type = 'button';
  b.dataset.qa = 'probe';
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('aria-hidden', 'true');
  const rest = document.createElementNS(SVGNS, 'circle');
  rest.setAttribute('class', 'vy-probe-rest'); rest.setAttribute('cx', '32'); rest.setAttribute('cy', '32'); rest.setAttribute('r', String(RING_R));
  const fill = document.createElementNS(SVGNS, 'circle');
  fill.setAttribute('class', 'vy-probe-fill'); fill.setAttribute('cx', '32'); fill.setAttribute('cy', '32'); fill.setAttribute('r', String(RING_R));
  fill.setAttribute('transform', 'rotate(-90 32 32)');
  fill.style.strokeDasharray = `${RING_C} ${RING_C}`;
  fill.style.strokeDashoffset = String(RING_C);
  const dot = document.createElementNS(SVGNS, 'circle');
  dot.setAttribute('class', 'vy-probe-dot'); dot.setAttribute('cx', '32'); dot.setAttribute('cy', '32'); dot.setAttribute('r', '1.5');
  svg.append(rest, fill, dot);
  b.appendChild(svg);
  return { b, fill };
}

/** One member chip: 24 px glyph + callsign LABEL. */
function chip(m, onMember) {
  const b = el('button', 'chip vy-chip');
  b.type = 'button';
  b.dataset.member = m.id;
  const c = document.createElement('canvas');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = c.height = Math.round(24 * dpr);
  const g = c.getContext('2d');
  if (g) drawGlyph(g, m.glyph || [], { x: 3 * dpr, y: 3 * dpr, size: 18 * dpr, lineWidth: 1.25 * dpr, color: palette.hex('silver'), dots: !m.glyph || !m.glyph.length });
  b.appendChild(c);
  b.appendChild(el('span', 't-label', m.callsign || m.name));
  b.setAttribute('aria-label', m.name);
  b.addEventListener('click', () => onMember(m.id));
  return b;
}

/** @param opts { onMember(id), onProbeDown(), onProbeUp(), onRemoveDown(), onRemoveUp() } */
export function createChamberBlock(opts) {
  const root = el('div', 'vy-chamber readable');
  root.dataset.qa = 'chamber-block';
  let probe = null, probeLabel = null, logRow = null, logBody = null, heading = null, removeBtn = null;

  function wireHold(btn, down, up) {
    btn.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; e.preventDefault(); try { btn.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } down(); });
    btn.addEventListener('pointerup', () => up());
    btn.addEventListener('pointercancel', () => up());
    btn.addEventListener('lostpointercapture', () => up());
    btn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(); } });
    btn.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') up(); });
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const block = {
    root,
    get heading() { return heading; },
    /** Mission chamber for a MissionView v (+ promoted-by name or null). */
    mission(v, proposedBy) {
      root.textContent = '';
      root.dataset.kind = 'mission';
      root.dataset.code = v.code;
      const m = v.mission;
      const locked = v.state === 'locked' || v.state === 'sealed';
      const where = locked ? null : whereLabel(m.where);
      const lab = el('p', 't-label vy-ch-label', `MISSION ${v.numberShown} · ${v.label}${where ? ' · ' + where : ''}`);
      lab.dataset.qa = 'chamber-label';
      root.appendChild(lab);
      heading = null;
      if (!locked) { heading = el('h2', 't-heading vy-ch-title', m.title); root.appendChild(heading); }
      if (locked) root.appendChild(el('p', 't-body', v.lockedText));
      else {
        if (m.brief) row(root, 'ЗАДАЧА', el('p', 't-brief', m.brief));
        if (m.conditions && m.conditions.length) {
          const ul = el('ul', 'vy-conds');
          for (const c of m.conditions) { const li = el('li', 't-body'); li.appendChild(el('span', 'cross')); li.appendChild(document.createTextNode(nbsp(c))); ul.appendChild(li); }
          row(root, 'УСЛОВИЯ', ul);
        }
        const crew = (m.crew || []).map(memberById).filter(Boolean);
        if (crew.length) {
          const box = el('div', 'vy-chips');
          for (const mm of crew) box.appendChild(chip(mm, opts.onMember));
          row(root, 'КТО БЫЛ', box);
        }
        if (proposedBy) row(root, 'ПРЕДЛОЖИЛ', el('p', 't-body', proposedBy));
        const res = v.state === 'done' ? (m.result || '') : RESULT[v.state] || '';
        if (res) row(root, 'ИТОГ', el('p', 't-body', res));
        const a = m.reward ? achievementById(m.reward) : null;
        if (a) {
          const rw = el('div', `vy-reward${a.earned ? ' is-earned' : ''}`);
          const svg = document.createElementNS(SVGNS, 'svg');
          svg.setAttribute('viewBox', '0 0 28 28'); svg.setAttribute('aria-hidden', 'true');
          const p = document.createElementNS(SVGNS, 'path');
          p.setAttribute('d', relicIconSvg(a.shape, 28));
          svg.appendChild(p);
          rw.appendChild(svg);
          rw.appendChild(el('span', 't-body', a.title));
          row(root, 'НАГРАДА', rw);
        }
      }
      logBody = el('p', 't-body');
      logRow = row(root, 'ЗАПИСЬ ЗОНДА', logBody);
      logRow.dataset.qa = 'probe-log';
      logRow.hidden = true;
      const pr = el('div', 'vy-probe');
      if (locked) {
        pr.appendChild(el('p', 't-body', PROBE_COPY.sealed));
        probe = null; probeLabel = null;
      } else {
        const pb = probeButton();
        probe = pb;
        probeLabel = el('span', 't-label vy-probe-label', PROBE_COPY.send);
        probeLabel.dataset.qa = 'probe-label';
        pb.b.setAttribute('aria-label', PROBE_COPY.send);
        wireHold(pb.b, opts.onProbeDown, opts.onProbeUp);
        pr.append(pb.b, probeLabel);
      }
      root.appendChild(pr);
      return block;
    },
    /** Proposal chamber (A3.4). p = { id, title, text, where, day }, by = his name. */
    proposal(p, by) {
      root.textContent = '';
      root.dataset.kind = 'proposal';
      root.dataset.code = p.id;
      const lab = el('p', 't-label vy-ch-label', `ПРЕДЛОЖЕНИЕ · ${p.id} · ${whereLabel(p.where) || 'В ИГРЕ'} · ${fmtDate(p.day, 'dd.mm.yyyy')}`);
      lab.dataset.qa = 'chamber-label';
      root.appendChild(lab);
      heading = el('h2', 't-heading vy-ch-title', p.title);
      root.appendChild(heading);
      if (p.text) row(root, 'ЗАДАЧА', el('p', 't-brief', p.text));
      row(root, 'ПРЕДЛОЖИЛ', el('p', 't-body', by));
      root.appendChild(el('p', 't-body vy-ch-proposal', PROPOSAL_BODY));
      removeBtn = el('button', 'verb t-label vy-remove', 'УБРАТЬ');
      removeBtn.type = 'button';
      removeBtn.dataset.qa = 'proposal-remove';
      wireHold(removeBtn, opts.onRemoveDown, opts.onRemoveUp);
      root.appendChild(removeBtn);
      probe = null; probeLabel = null; logRow = null;
      return block;
    },
    /** Probe UI: 'none' (can send) | 'out' (in flight / sent) | 'back' (gone; the log shows) | 'locked' */
    setProbe(st, log) {
      if (logRow) {
        logRow.hidden = st !== 'back';
        if (st === 'back') logBody.textContent = nbsp(log || EMPTY_LINE.probeLog);
      }
      if (!probe) return;
      const row2 = probe.b.parentNode;
      if (st === 'back') { row2.hidden = true; return; }
      row2.hidden = false;
      probe.b.disabled = st === 'out';
      probeLabel.textContent = st === 'out' ? PROBE_COPY.out : PROBE_COPY.send;
      probe.b.setAttribute('aria-label', probeLabel.textContent);
      block.setHold(0);                                   // sent: the ring cools back to the hairline (the beam head is the focus)
    },
    /** 0..1 ring fill of the hold (probe or УБРАТЬ). */
    setHold(f) {
      if (probe) probe.fill.style.strokeDashoffset = String(RING_C * (1 - f));
      if (removeBtn) removeBtn.style.setProperty('--hold', String(f));
    },
    probeButton() { return probe ? probe.b : null; },
    dispose() { root.remove(); },
  };
  return block;
}

