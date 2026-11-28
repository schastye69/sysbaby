// halls/signal/inbox.js — WP8: «ВХОДЯЩИЕ», the daily inbox (SPEC §6.5 part 1, ARCH §4.3.7, §4.5; A6.4 reply verb).
//
//   ВХОДЯЩИЕ · 3                                  LABEL (= delivered count)
//   05.10  VIN  ● Добро пожаловать в VIN…         MICRO date · LABEL from · 6 px ember dot if unread · BODY first line, 34ch
//
// Desktop: a left column under the datum (rows in data order, the newest last and scrolled into view). Phone: the
// bottom sheet — the peek shows the unread count and the latest item, the body every row. At night (WORLD.night
// hours, app.night) a pinned first row «НОЧНАЯ ПЕРЕДАЧА» (night.story) appears; it is not counted. An empty list shows
// `ВХОДЯЩИЕ · 0` and the calm line «Передач пока нет.». Opening a row: its text BEAM WRITES in LEAD 22 px, the item is
// marked read (state.markRead), the select click plays. Under every ПАПА row: `ОТВЕТИТЬ РИСУНКОМ` and, once answered,
// the 48 px `ТВОЙ ОТВЕТ` figure (replies.js).
// QA hooks: [data-qa="inbox"], [data-qa="inbox-row"][data-index][data-unread], [data-qa="inbox-night"],
// [data-qa="reply-verb"][data-index], [data-qa="reply-figure"].
import { WORLD, EMPTY_LINE, worldCounts } from '../../data/world.js';
import { state } from '../../core/state.js';
import { app } from '../../core/store.js';
import { fmtDate } from '../../core/ru.js';
import { PAPA, getReply, createReplyFigure } from './replies.js';

const FIRST = 34;
function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
/** First line, 34 characters (an ellipsis when cut). */
export function firstLine(text) {
  const line = String(text || '').split('\n')[0].trim();
  return line.length > FIRST ? line.slice(0, FIRST - 1).trimEnd() + '…' : line;
}
/** The day item i was delivered on (ARCH §4.3.7): days[i], else today. */
export function deliveredDay(i) {
  const days = state.data && Array.isArray(state.data.days) ? state.data.days : [];
  return fmtDate(days[i] || state.today, 'dd.mm');
}

/** @returns {{ desk: HTMLElement, peek: HTMLElement, body: HTMLElement, refresh(), markOpen(i), dispose() }} */
export function createInbox(hctx, handlers) {
  const figures = [];
  const desk = el('div', 'sg-inbox scrim');
  const peek = el('div', 'sg-inbox sg-inbox--peek');
  const body = el('div', 'sg-inbox sg-inbox--sheet');
  let openIndex = -1;

  function row(list, i, tr, unread, opts) {
    const li = el('li', 'sg-item', list);
    const b = el('button', 'sg-row', li);
    b.type = 'button';
    if (opts.qa) { b.dataset.qa = 'inbox-row'; b.dataset.index = String(i); if (unread) b.dataset.unread = ''; }
    if (i === openIndex) b.classList.add('is-open');
    el('span', 't-micro sg-row__date', b, deliveredDay(i));
    el('span', 't-label sg-row__from', b, tr.from);
    const dot = el('span', 'sg-row__dot', b);
    if (unread) dot.classList.add('is-on');
    el('span', 't-body sg-row__text', b, firstLine(tr.text));
    b.setAttribute('aria-label', `${tr.from}: ${tr.text}`);
    b.addEventListener('click', () => handlers.open(i));
    if (opts.reply && tr.from === PAPA) {
      const act = el('div', 'sg-act', li);
      const verb = el('button', 'verb sg-act__verb', act, 'ОТВЕТИТЬ РИСУНКОМ');
      verb.type = 'button';
      verb.dataset.qa = 'reply-verb';
      verb.dataset.index = String(i);
      verb.addEventListener('click', () => handlers.reply(i));
      const fig = createReplyFigure(hctx, i);
      fig.set(getReply(i));
      act.appendChild(fig.el);
      figures.push(fig);
    }
    return b;
  }
  function nightRow(list) {
    const li = el('li', 'sg-item sg-item--night', list);
    const b = el('button', 'sg-row sg-row--night', li);
    b.type = 'button';
    b.dataset.qa = 'inbox-night';
    el('span', 't-micro sg-row__date', b, fmtDate(state.today, 'dd.mm'));
    el('span', 't-label sg-row__from', b, 'НОЧНАЯ ПЕРЕДАЧА');
    el('span', 'sg-row__dot', b);
    el('span', 't-body sg-row__text', b, firstLine(WORLD.night.story));
    b.setAttribute('aria-label', `НОЧНАЯ ПЕРЕДАЧА: ${WORLD.night.story}`);
    b.addEventListener('click', () => handlers.night());
  }
  function header(parent, c) {
    const h = el('p', 't-label sg-inbox__head', parent);
    el('span', null, h, `ВХОДЯЩИЕ · ${c.delivered}`);
    return h;
  }

  function build(target, mode) {
    target.textContent = '';
    target.dataset.qa = 'inbox';
    const c = worldCounts();
    const h = header(target, c);
    if (mode === 'peek' && c.unread > 0) el('span', 'sg-inbox__new', h, `НОВЫХ ${c.unread}`);
    const list = el('ol', 'sg-list', target);
    if (app.night) nightRow(list);
    const items = WORLD.transmissions;
    const read = state.data.transmissions.read;
    if (!items.length) { el('p', 't-body sg-inbox__empty', target, EMPTY_LINE.transmissions); return null; }
    if (mode === 'peek') {
      const i = c.delivered - 1;
      if (i >= 0) row(list, i, items[i], !read.includes(i), { qa: false, reply: false });
      return null;
    }
    let last = null;
    for (let i = 0; i < c.delivered; i++) last = row(list, i, items[i], !read.includes(i), { qa: true, reply: true });
    return { list, last };
  }

  function disposeFigures() { for (const f of figures) f.dispose(); figures.length = 0; }

  return {
    desk, peek, body,
    /** Rebuilds the inbox for the layout in use (desktop column, or the phone sheet's peek + body). */
    refresh() {
      disposeFigures();
      if (hctx.layout.isPhone) {
        desk.textContent = '';
        build(peek, 'peek');
        build(body, 'sheet');
      } else {
        peek.textContent = ''; body.textContent = '';
        const r = build(desk, 'desk');
        // Newest in view: the column scrolls to its last row (no layout read beyond this one-off on build).
        if (r && r.list && r.list.scrollHeight > r.list.clientHeight) {
          r.list.scrollTop = r.list.scrollHeight;
          // Rows scrolled out above fade under a 44 px mask (the column reads as continuing, never as cut).
          const cut = () => r.list.classList.toggle('is-cut', r.list.scrollTop > 2);
          r.list.addEventListener('scroll', cut, { passive: true });
          cut();
        }
      }
    },
    markOpen(i) { openIndex = i; },
    dispose() {
      disposeFigures();
      for (const n of [desk, peek, body]) if (n.parentNode) n.parentNode.removeChild(n);
    },
  };
}
