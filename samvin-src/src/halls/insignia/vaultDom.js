// halls/insignia/vaultDom.js — WP9: INSIGNIA's readable DOM (SPEC §6.6, §6.0 Readable blocks, §4.5, A11.6).
//   index — the vault in plan: one 44 px line-icon button per relic (relicIconSvg; earned --silver, legendary --white,
//           unearned dashed --pewter), in ring order, with a 1 px --ember tick under the relic that faces the eye (the
//           one ember focus). Buttons carry data-qa="relic" + data-id + data-earned; hover/focus turn the vault to the
//           relic, Enter/click hold it (#/insignia/<id>). Desktop: the left column under the datum. Phone: the sheet peek.
//   block — the held relic (data-qa="relic-block"): HEADING title (lock-in), LABEL rarity, BODY story, LABEL `КТО` +
//           member chips, LABEL `КОГДА` + date, LABEL `ГДЕ` + «в игре» / «в жизни» (row omitted for no `where`).
//           Unearned: LABEL `УСЛОВИЕ` + the condition. Desktop: right column; phone: the sheet (full).
//   empty — EMPTY_LINE.achievements when the world has no achievements.
import { relicIconSvg } from './shapes.js';
import { EMPTY_LINE } from '../../data/world.js';
import { fmtDate, upper } from '../../core/ru.js';
import { lockIn, revealBody } from '../../ui/text.js';
import { relicMicro, whoNames } from './relics.js';

const SVG = 'http://www.w3.org/2000/svg';
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

export function createVaultDom(hctx, relics, handlers) {
  const left = el('div', 'ins-left');
  const index = el('div', 'ins-index');
  index.setAttribute('role', 'list');
  const buttons = [];
  relics.list.forEach((R, k) => {
    const b = el('button', 'ins-idx');
    b.type = 'button';
    b.dataset.qa = 'relic';
    b.dataset.id = R.id;
    b.dataset.earned = String(!!R.earned);
    if (R.legendary) b.dataset.legendary = 'true';
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', R.earned ? R.a.title : `${R.a.title}: ещё не найден`);
    const s = document.createElementNS(SVG, 'svg');
    s.setAttribute('viewBox', '0 0 22 22');
    s.setAttribute('width', '22'); s.setAttribute('height', '22');
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', relicIconSvg(R.a.shape, 22));
    s.appendChild(p);
    b.appendChild(s);
    b.appendChild(el('i', 'ins-idx-tick'));
    b.addEventListener('pointerenter', () => handlers.preview(k, true));
    b.addEventListener('pointerleave', () => handlers.preview(k, false));
    b.addEventListener('focus', () => handlers.preview(k, true));
    b.addEventListener('blur', () => handlers.preview(k, false));
    b.addEventListener('click', () => handlers.activate(k));
    buttons.push(b);
    index.appendChild(b);
  });
  const empty = el('p', 't-body ins-empty', EMPTY_LINE.achievements);
  empty.hidden = relics.list.length > 0;
  left.append(index, empty);

  // ── the held relic's block ──
  const block = el('div', 'ins-block');
  block.dataset.qa = 'relic-block';
  block.hidden = true;
  let front = -1, shownId = null;

  function fillBlock(R) {
    const a = R.a;
    block.textContent = '';
    const h = el('h2', 't-heading ins-b-title', a.title);
    const meta = el('p', 'ins-b-meta');
    meta.append(el('span', 't-label', upper(a.rarity || '')));
    const mic = relicMicro(a);
    if (mic) meta.append(el('span', 't-micro', mic));
    block.append(meta, h);
    if (R.earned) {
      const story = el('p', 't-body ins-b-story', a.text || '');
      block.append(story);
      const who = whoNames(a);
      if (who.length) {
        const row = el('div', 'ins-b-row');
        row.append(el('p', 't-label', 'КТО'));
        const chips = el('div', 'ins-b-chips');
        (a.who || []).forEach((id) => {
          const m = hctx.world.members.find((x) => x.id === id);
          if (!m) return;
          const c = el('button', 'chip t-label', m.name);
          c.type = 'button';
          c.addEventListener('click', () => hctx.director.go(`#/members/${m.id}`, { source: 'hall' }));
          chips.appendChild(c);
        });
        row.append(chips);
        block.append(row);
      }
      const when = el('div', 'ins-b-row');
      when.append(el('p', 't-label', 'КОГДА'), el('p', 't-body', a.date ? fmtDate(a.date) : '—'));
      block.append(when);
      revealBody(story);
    } else {
      const cond = el('div', 'ins-b-row');
      cond.append(el('p', 't-label', 'УСЛОВИЕ'), el('p', 't-body', a.text || ''));
      block.append(cond);
    }
    if (a.where === 'игра' || a.where === 'жизнь') {
      const where = el('div', 'ins-b-row');
      where.dataset.qa = 'relic-where';
      where.append(el('p', 't-label', 'ГДЕ'), el('p', 't-body', a.where === 'жизнь' ? 'в жизни' : 'в игре'));
      block.append(where);
    }
    const back = el('button', 'verb t-label ins-b-back', '← К ХРАНИЛИЩУ');
    back.type = 'button';
    back.addEventListener('click', () => hctx.director.go('#/insignia', { source: 'hall' }));
    block.append(back);
    return h;
  }

  const api = {
    left, block, buttons,
    /** The relic now facing the eye (ember tick). */
    setFront(k) {
      if (k === front) return;
      if (front >= 0 && buttons[front]) buttons[front].classList.remove('is-front');
      front = k;
      if (k >= 0 && buttons[k]) buttons[k].classList.add('is-front');
    },
    setHover(k) { buttons.forEach((b, i) => b.classList.toggle('is-hover', i === k)); },
    /** Shows the held relic's block (null hides). */
    showBlock(R, instant) {
      if (!R) { block.hidden = true; shownId = null; return; }
      if (shownId === R.id && !block.hidden) return;
      shownId = R.id;
      const h = fillBlock(R);
      block.hidden = false;
      if (!instant) lockIn(h, { weight: 560 });
    },
    get blockId() { return shownId; },
    setAlpha(a) { left.style.opacity = String(a); },
  };
  return api;
}
