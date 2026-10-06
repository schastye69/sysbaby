// nav/keyboard.js — the keyboard (ARCH §3.9.3; SPEC §5.2). Order for each keydown:
//  (1) inside input / textarea / [contenteditable] → ignored except Esc (closes the sheet);
//  (2) observeKeys observers (core/input.js, capture phase — they already ran);
//  (3) while booting: the boot consumer's onKey (any key skips, Esc jumps to 6,400 ms) via input.offerKey;
//  (4) while travelling: navigation keys retarget, Esc → #/core, any other key → director.speedUp();
//  (5) hallHost.call(current, 'onKey', e);
//  (6) the global map: ↑/PgUp hall above · ↓/PgDn hall below · 1–7 S A M • V I N · Home CORE · Esc CORE · M sound.
// Letters and digits match e.code so the Russian layout works (KeyM = «ь»). ← → Enter Space have no global meaning.
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { app } from '../core/store.js';
import { adjacentRoom } from './elevator.js';

const NAV = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'Escape']);
const isText = (t) => !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''));
const digit = (code) => { const m = /^(?:Digit|Numpad)([1-7])$/.exec(code); return m ? Number(m[1]) - 1 : -1; };

/** → '#/<slug>' for a navigation key, '' for none (end of the building), null when not a navigation key. */
function navTarget(e, from) {
  const d = digit(e.code);
  if (d >= 0) return `#/${ROOMS[ROOM_ORDER[d]].slug}`;
  switch (e.key) {
    case 'ArrowUp': case 'PageUp': { const r = adjacentRoom(from, -1); return r ? `#/${ROOMS[r].slug}` : ''; }
    case 'ArrowDown': case 'PageDown': { const r = adjacentRoom(from, 1); return r ? `#/${ROOMS[r].slug}` : ''; }
    case 'Home': case 'Escape': return '#/core';
    default: return null;
  }
}

export function installKeyboard(ctx) {
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    const esc = e.key === 'Escape';
    if (isText(e.target)) {                                                       // (1)
      if (esc && ctx.sheet && ctx.sheet.state !== 'closed') ctx.sheet.close();
      return;
    }
    if (esc && ctx.navMap && ctx.navMap.isOpen) { ctx.navMap.close(); e.preventDefault(); return; }
    if (app.booting && ctx.input.offerKey && ctx.input.offerKey(e)) { e.preventDefault(); return; }   // (3)
    const d = ctx.director;
    if (d && d.busy()) {                                                          // (4)
      const to = d.state.to ? d.state.to.room : app.room;
      const h = navTarget(e, to);
      if (h != null) { if (h) d.go(h, { source: 'kbd' }); e.preventDefault(); return; }
      if (e.key !== 'Tab' && e.key !== 'Shift' && e.key.length) d.speedUp();
      return;
    }
    if (ctx.halls && ctx.halls.call(app.room, 'onKey', e) === true) { e.preventDefault(); return; }   // (5)
    if (e.code === 'KeyM') { if (ctx.audio) ctx.audio.toggle(); return; }          // (6)
    if (!d) return;
    if (NAV.has(e.key) || digit(e.code) >= 0) {
      const h = navTarget(e, app.room);
      if (h) d.go(h, { source: 'kbd' });
      e.preventDefault();
    }
  });
}
