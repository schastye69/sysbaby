// host/sheets.js — the two WP13 sheets (SPEC-ADDENDUM A4.1 «Кто сегодня с тобой?», A3.4 + A11.3 «Что ты предлагаешь
// команде?»; ARCH-ADDENDUM X§2.6.2, X§2.6.5). OWNER: WP13.
// Solid --deep, a 1 px --slate top hairline; phone: the SPEC bottom sheet; desktop: a 420 px block centred on a scrim.
// No border box, no blur, no card. Chips are LABEL/BODY text with a 1 px --silver underline drawn left → right in
// 120 ms when selected (CSS). Every control ≥ 44 px. Typed guest names live only in WP13 module memory (law L12): the
// input is cleared as soon as a name becomes a chip and nothing here writes storage, the URL or a log.
import { WORLD } from '../data/world.js';
import { createSheet } from '../ui/sheet.js';
import { el, verb } from './dom.js';

const NAME_OK = /[^A-Za-zА-Яа-яЁё \-]/g;      // letters (Cyrillic or Latin), space and hyphen only
export const MAX_GUESTS = 8, MAX_TYPED = 4, TYPED_LEN = 12;

/** Normalises a typed guest name (null when empty). */
export function cleanName(s) {
  const t = String(s == null ? '' : s).replace(NAME_OK, '').replace(/\s+/g, ' ').replace(/^[\s-]+|[\s-]+$/g, '').slice(0, TYPED_LEN);
  return t.length ? t : null;
}

/** The ГОСТИ sheet. opts: { onToggle(member, on, chipEl), onDone(), onShow(), onTyped(name) → id|null, onRemoveTyped(id) }
 *  → { open(selection), close(), isOpen(), setCount(n) } */
export function createGuestsSheet(ctx, opts) {
  const sh = createSheet({ id: 'sheet-guests' });
  sh.el.classList.add('host-sheet', 'host-sheet--guests');
  sh.el.setAttribute('data-qa', 'guests-sheet');
  sh.el.setAttribute('role', 'dialog');
  sh.el.setAttribute('aria-label', 'Кто сегодня с тобой?');
  const b = sh.body;
  el('p', 't-label host-sheet__k', 'ГОСТИ', b);
  el('h2', 't-heading host-sheet__h', 'Кто сегодня с тобой?', b);
  const chips = el('div', 'guest-chips', null, b);
  const roster = WORLD.members.filter((m) => m.id !== WORLD.operator.id);
  const chipById = new Map();
  for (const m of roster) {
    const c = el('button', 'guest-chip', null, chips, { qa: 'guest-chip', 'data-id': m.id, type: 'button', 'aria-pressed': 'false' });
    el('span', 't-body guest-chip__name', m.name, c);
    el('span', 't-label guest-chip__cs', m.callsign, c);
    c.addEventListener('click', (e) => { e.stopPropagation(); opts.onToggle(m, c.getAttribute('aria-pressed') !== 'true', c); });
    chipById.set(m.id, c);
  }
  const typedRow = el('div', 'guest-chips guest-chips--typed', null, b);
  const addRow = el('div', 'guest-add', null, b);
  const add = verb('+ ГОСТЬ', addRow, 'guest-add', () => { input.hidden = false; add.hidden = true; input.focus(); });
  const input = el('input', 'guest-input t-body', null, addRow, {
    qa: 'guest-input', type: 'text', maxlength: String(TYPED_LEN), placeholder: 'Имя гостя', autocomplete: 'off',
    autocapitalize: 'words', spellcheck: 'false', enterkeyhint: 'done', 'aria-label': 'Имя гостя',
  });
  input.hidden = true;
  input.addEventListener('input', () => {
    const v = input.value.replace(NAME_OK, '');
    if (v !== input.value) input.value = v;
  });
  const commitTyped = () => {
    const name = cleanName(input.value);
    input.value = '';
    if (!name) return;
    const id = opts.onTyped(name);
    if (!id) return;
    const c = el('button', 'guest-chip guest-chip--typed', null, typedRow, { qa: 'guest-chip', 'data-id': id, type: 'button', 'aria-pressed': 'true' });
    el('span', 't-body guest-chip__name', name, c);
    el('span', 't-label guest-chip__x', '×', c, { 'aria-hidden': 'true' });
    c.setAttribute('aria-label', `${name} ×`);
    c.addEventListener('click', (e) => { e.stopPropagation(); opts.onRemoveTyped(id); c.remove(); syncTypedRoom(); });
    syncTypedRoom();
  };
  const syncTypedRoom = () => {
    const full = typedRow.children.length >= MAX_TYPED;
    add.hidden = full || !input.hidden;
    if (full) input.hidden = true;
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commitTyped(); }
    else if (e.key === 'Escape') { e.preventDefault(); input.value = ''; input.hidden = true; syncTypedRoom(); }
  });
  input.addEventListener('blur', () => { if (input.value) commitTyped(); });
  const verbs = el('div', 'host-sheet__verbs', null, b);
  verb('ГОТОВО', verbs, 'guests-done', () => { if (input.value) commitTyped(); opts.onDone(); });
  const showV = verb('НАЧАТЬ ПОКАЗ', verbs, 'show-start', () => { if (input.value) commitTyped(); opts.onShow(); }, 'verb--white');
  showV.hidden = true;
  sh.el.addEventListener('keydown', (e) => { if (e.key === 'Escape' && e.target !== input) { e.stopPropagation(); api.close(); } });

  const api = {
    open(sel) {
      for (const [id, c] of chipById) c.setAttribute('aria-pressed', sel.has(id) ? 'true' : 'false');
      api.setCount(sel.size + typedRow.children.length);
      input.hidden = true; input.value = '';
      syncTypedRoom();
      sh.open();                                   // the plate slides 16 px into place (CSS); the veil fades
      const first = chips.querySelector('.guest-chip');
      if (first && ctx.layout && !ctx.layout.isPhone) try { first.focus({ preventScroll: true }); } catch (e) { /* none */ }
    },
    close() { input.blur(); sh.close(); },
    isOpen: () => sh.el.dataset.state === 'full',
    setCount(n) { showV.hidden = !(n > 0); },
    setPressed(id, on) { const c = chipById.get(id); if (c) c.setAttribute('aria-pressed', on ? 'true' : 'false'); },
    /** reload / ПЕРЕЗАПУСК: typed chips go with the session list */
    clearTyped() { typedRow.textContent = ''; syncTypedRoom(); },
  };
  return api;
}

/** The ПРЕДЛОЖЕНИЕ sheet. opts: { onSave(title, text, where) } → { open(), close(), isOpen() } */
export function createProposalSheet(ctx, opts) {
  const sh = createSheet({ id: 'sheet-proposal' });
  sh.el.classList.add('host-sheet', 'host-sheet--proposal');
  sh.el.setAttribute('data-qa', 'proposal-sheet');
  sh.el.setAttribute('role', 'dialog');
  sh.el.setAttribute('aria-label', 'Что ты предлагаешь команде?');
  const b = sh.body;
  el('p', 't-label host-sheet__k', 'ПРЕДЛОЖЕНИЕ', b);
  el('h2', 't-heading host-sheet__h', 'Что ты предлагаешь команде?', b);
  const title = el('input', 'host-input t-body', null, b, { qa: 'proposal-title', type: 'text', maxlength: '32', placeholder: 'Название', 'aria-label': 'Название', autocomplete: 'off' });
  const text = el('input', 'host-input t-body', null, b, { qa: 'proposal-text', type: 'text', maxlength: '80', placeholder: 'Что нужно сделать?', 'aria-label': 'Что нужно сделать?', autocomplete: 'off' });
  const whereRow = el('div', 'guest-chips where-chips', null, b, { role: 'radiogroup', 'aria-label': 'Где' });
  let where = 'игра';
  const chips = [['игра', 'В ИГРЕ'], ['жизнь', 'В ЖИЗНИ']].map(([w, label]) => {
    const c = el('button', 'guest-chip where-chip t-label', label, whereRow, { qa: 'proposal-where', 'data-where': w, type: 'button', role: 'radio' });
    c.addEventListener('click', (e) => { e.stopPropagation(); setWhere(w); });
    return c;
  });
  const setWhere = (w) => {
    where = w === 'жизнь' ? 'жизнь' : 'игра';
    for (const c of chips) {
      const on = c.getAttribute('data-where') === where;
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    }
  };
  const verbs = el('div', 'host-sheet__verbs', null, b);
  const save = verb('ЗАПИСАТЬ', verbs, 'proposal-save', () => {
    if (save.getAttribute('aria-disabled') === 'true') return;
    const t = title.value.trim(), x = text.value.trim();
    if (t.length < 2) return;
    if (opts.onSave(t, x, where) !== false) api.close();
  }, 'verb--white');
  verb('ОТМЕНА', verbs, 'proposal-cancel', () => api.close());
  const sync = () => save.setAttribute('aria-disabled', title.value.trim().length >= 2 ? 'false' : 'true');
  title.addEventListener('input', sync);
  for (const inp of [title, text]) {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); if (inp === title) text.focus(); else save.click(); }
      else if (e.key === 'Escape') { e.preventDefault(); api.close(); }
    });
  }
  const api = {
    open() {
      title.value = ''; text.value = ''; setWhere('игра'); sync();
      sh.open();                                   // the plate slides 16 px into place (CSS); the veil fades
      try { title.focus({ preventScroll: true }); } catch (e) { /* none */ }
    },
    close() { title.blur(); text.blur(); sh.close(); },
    isOpen: () => sh.el.dataset.state === 'full',
  };
  return api;
}
