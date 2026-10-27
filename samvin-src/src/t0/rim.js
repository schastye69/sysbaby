// t0/rim.js — WP11. The T0 DOM rim (ARCH-ADDENDUM X§2.8.2–X§2.8.3; SPEC §4.1 name burn, A3.1 ОСНОВАТЕЛЬ, A4.1 ГОСТИ):
// his name under the SVG Key's Ø line, burnt letter by letter (70 ms; ember → silver over 1,200 ms — the one ember text
// exception), the role subline as MICRO at 70 % («ОСНОВАТЕЛЬ», 300 ms after the last letter cooled; hidden DOM duplicate
// «Основатель: {Имя}»), guest names as DOM spans in rows under his at the SAME computed font size (--white → --silver,
// never ember), the lit-node count as 1.5 px dots after the name. The full Rim API: burn, showName, fadeName, hideName,
// shown, burnGuests, reburnGuests, clearGuests, rows, setRole, namePoint, letterHeightM, setLitNodes, flashNewNode,
// setAlpha (group = null).
import { WORLD, operatorMember } from '../data/world.js';
import { upper } from '../core/ru.js';
import { after, cancelAfter } from '../core/clock.js';
import { layout } from '../core/layout.js';
import { state } from '../core/state.js';
import { TIMING } from '../core/tokens.js';
import { registerHookField } from '../core/testhook.js';
import { el, clear, reduced } from './dom.js';

const LETTER_M = 38;           // his letter height on the 300 m horizon (m) — the rows() value WebGL reports
const MAX_GUESTS = 12;

/** opts: { anchorY: () => px (top of the rim block), owner: boolean (T0 is the tier → registers the `rim` hook) } */
export function createDomRim(parent, opts = {}) {
  const nameText = upper(WORLD.operator.name || '');
  const role0 = (operatorMember() && operatorMember().role) || 'основатель';
  let roleText = upper(role0), guests = [], guestCaps = [], shown = false, roleShown = false, alpha = 1, lit = 0, hG = LETTER_M;
  const timers = [];
  const box = el('div', 't0-rim', null, parent, { attrs: { 'aria-hidden': 'true' } });
  const nameRow = el('p', 't-lead t0-rim__row', null, box);
  const roleEl = el('p', 't-micro t0-rim__role', null, box);
  const guestBox = el('div', 't0-rim__guests', null, box);
  const sr = el('p', 'sr-only', null, parent);
  const srRole = el('p', 'sr-only', null, parent);
  let nameSpan = null, letters = [], dots = null;
  const spans = [];

  function place() {
    const y = typeof opts.anchorY === 'function' ? opts.anchorY() : layout.h * 0.8;
    box.style.transform = `translate(-50%, ${Math.round(y)}px)`;
  }
  function paintName() {
    clear(nameRow);
    nameSpan = el('span', 't0-rim__name', null, nameRow);
    letters = [];
    for (const ch of nameText) letters.push(el('span', 't0-rim__l', ch, nameSpan));
    dots = el('span', 't0-rim__dots', null, nameRow);
    paintDots();
    sr.textContent = nameText;
  }
  function paintDots() {
    if (!dots) return;
    clear(dots);
    for (let i = 0; i < Math.min(lit, 12); i++) el('i', 't0-rim__dot', null, dots);
  }
  function paintRole() {
    roleEl.textContent = roleText;
    roleEl.hidden = !roleText;
    srRole.textContent = roleText ? `${roleText.charAt(0)}${roleText.slice(1).toLowerCase()}: ${WORLD.operator.name}` : '';
  }
  function paintGuests() {
    clear(guestBox);
    spans.length = 0;
    spans.push(nameSpan);
    guests.forEach((g) => {
      const row = el('p', 't-lead t0-rim__row t0-rim__grow', null, guestBox);
      const s = el('span', 't0-rim__name t0-rim__guest', null, row);
      for (const ch of g) el('span', 't0-rim__l', ch, s);
      spans.push(s);
    });
    // one equal CSS height for every name: shrink all rows together when the block would not fit
    const n = 1 + guests.length;
    const fs = layout.isPhone ? Math.max(15, Math.min(20, 132 / n)) : Math.max(15, Math.min(26, 168 / n));
    box.style.setProperty('--rim-fs', `${fs}px`);
    hG = LETTER_M * (fs / (layout.isPhone ? 20 : 26));
  }
  function apply() { box.style.opacity = String(alpha); box.hidden = !shown || alpha <= 0; }
  const clearTimers = () => { while (timers.length) cancelAfter(timers.pop()); };
  function showRoleAt(ms) {
    if (!roleText) return;
    timers.push(after(Math.max(0, ms), () => { roleShown = true; roleEl.classList.add('is-in'); }));
  }

  paintName(); paintRole(); paintGuests(); place();

  const rim = {
    group: null,
    get shown() { return shown; },
    /** opts: { dir:'ltr'|'rtl', msPerLetter = 70, at?: perf ms (start exactly then), role = true } → Promise (last letter cooled) */
    burn(o = {}) {
      clearTimers();
      const ms = o.msPerLetter > 0 ? o.msPerLetter : TIMING.burnMsPerLetter;
      const wait = Number.isFinite(o.at) ? Math.max(0, o.at - performance.now()) : 0;
      shown = true; apply(); place();
      if (reduced()) { rim.fadeName(160); return Promise.resolve(); }
      letters.forEach((l) => { l.classList.remove('is-lit', 'is-cool'); });
      const order = o.dir === 'rtl' ? letters.slice().reverse() : letters;
      order.forEach((l, k) => {
        timers.push(after(wait + k * ms, () => { l.classList.add('is-lit'); timers.push(after(30, () => l.classList.add('is-cool'))); }));
      });
      const end = wait + letters.length * ms + TIMING.burnCoolMs;
      timers.push(after(wait + (letters.length - 1) * ms + ms, () => rim.setLitNodes(Math.max(lit, state.litNodes))));
      if (o.role !== false && !roleShown) showRoleAt(end + 300);
      return new Promise((res) => after(end, res));
    },
    showName() {
      clearTimers();
      shown = true; apply(); place();
      letters.forEach((l) => l.classList.add('is-lit', 'is-cool', 'is-now'));
      if (roleText) { roleShown = true; roleEl.classList.add('is-in'); }
      rim.setLitNodes(Math.max(lit, state.litNodes));
    },
    fadeName(ms = 160) {
      clearTimers();
      shown = true; apply(); place();
      box.classList.add('is-fade');
      letters.forEach((l) => l.classList.add('is-lit', 'is-cool', 'is-now'));
      timers.push(after(ms, () => box.classList.remove('is-fade')));
      if (!roleShown) showRoleAt(ms + 300);
      rim.setLitNodes(Math.max(lit, state.litNodes));
    },
    hideName() {
      clearTimers();
      shown = false; roleShown = false;
      roleEl.classList.remove('is-in');
      letters.forEach((l) => l.classList.remove('is-lit', 'is-cool', 'is-now'));
      apply();
    },
    /** names[], opts { height, gapMs = 240, msPerLetter = 70 } → Promise (last guest cooled). --white → --silver. */
    burnGuests(names, o = {}) {
      guestCaps = (Array.isArray(names) ? names : []).map((s) => String(s || '').trim()).filter(Boolean).slice(0, MAX_GUESTS);
      guests = guestCaps.map((s) => upper(s));
      paintGuests();
      shown = true; apply(); place();
      letters.forEach((l) => l.classList.add('is-lit', 'is-cool', 'is-now'));
      const ms = o.msPerLetter > 0 ? o.msPerLetter : TIMING.burnMsPerLetter, gap = o.gapMs != null ? o.gapMs : 240;
      let t = 0;
      spans.slice(1).forEach((s) => {
        const ls = Array.from(s.children);
        if (reduced()) { timers.push(after(t, () => ls.forEach((l) => l.classList.add('is-lit', 'is-cool', 'is-now')))); t += 240; return; }
        ls.forEach((l, k) => timers.push(after(t + k * ms, () => { l.classList.add('is-lit'); timers.push(after(30, () => l.classList.add('is-cool'))); })));
        t += ls.length * ms + gap;
      });
      return new Promise((res) => after(t + (reduced() ? 160 : TIMING.burnCoolMs), res));
    },
    reburnGuests() { return guestCaps.length ? rim.burnGuests(guestCaps.slice()) : Promise.resolve(); },
    clearGuests() { guests = []; guestCaps = []; paintGuests(); },
    rows() { return [nameText].concat(guests).map((text, i) => ({ text, heightM: Math.round((i ? hG : (guests.length ? hG : LETTER_M)) * 1000) / 1000, row: i })); },
    setRole(text) {
      const t = text ? upper(String(text)) : '';
      if (t === roleText) return;
      roleText = t;
      paintRole();
      if (!t) { roleShown = false; roleEl.classList.remove('is-in'); }
    },
    /** screen point (CSS px) of rim name i (0 = his) */
    namePoint(i, out) {
      const o = out || { x: 0, y: 0 };
      const sp = spans[Math.max(0, Math.min(spans.length - 1, i | 0))];
      const r = sp && shown ? sp.getBoundingClientRect() : null;
      if (r && r.width) { o.x = r.left + r.width / 2; o.y = r.top + r.height / 2; } else { o.x = layout.w / 2; o.y = layout.h * 0.82; }
      return o;
    },
    letterHeightM() { return guests.length ? hG : LETTER_M; },
    setLitNodes(n) { lit = Math.max(0, n | 0); paintDots(); },
    flashNewNode() {
      rim.setLitNodes(Math.max(lit, state.litNodes));
      const d = dots && dots.lastChild;
      if (d) { d.classList.add('is-new'); after(TIMING.electrum, () => d.classList.remove('is-new')); }
    },
    setAlpha(a) { alpha = Math.max(0, Math.min(1, +a || 0)); apply(); },
    /** WP11: re-anchors under the Key after a layout change / placement. */
    place,
  };
  if (opts.owner) registerHookField('rim', () => rim.rows());
  apply();
  return rim;
}
