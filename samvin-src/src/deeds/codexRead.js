// deeds/codexRead.js — КОДЕКС readable copy (SPEC-ADDENDUM A3.3 "How he reads it"; ARCH-ADDENDUM X§2.6.1). OWNER: WP13.
// • lawBlock(i)      the DOM reading block of law i: LABEL `КОДЕКС · 0{i+1}` · BODY 17 px wght 560 --white · MICRO
//                    `ПРАВИЛО КЛАНА · {ДЕЛО} · dd.mm.yyyy` (data-qa="codex-leader", data-stratum).
// • lawLeader(...)   one overlay anchor (owner 'codex') from the back face of stratum i (key.backFaceFrame) to a column
//                    64 px left of the Key's bounding box; the column is shared by every block shown together.
// • createCodexRead  drag-to-read: in CORE, while key.isShowingBack() (yaw within 180° ± 35° for ≥ 240 ms) and the
//                    press is held, leaders draw from each EARNED back face (40 ms stagger); on release (or when the
//                    back turns away) they retract in 240 ms. Phone: the same blocks as a list in a bottom-sheet peek.
//                    Never during a КОДЕКС ceremony (it shows its own leader) or while another reader holds the blocks.
import { Vector3 } from 'three';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { createSheet } from '../ui/sheet.js';
import { lawOf, earnedStrata, STRATUM_SIGN } from './deedsModel.js';
import { el, dmy, two, fade } from '../host/dom.js';

const COL_GAP = 64;          // px between the Key's bounding box and the right edge of the reading column
const ROW = 84;              // px between two blocks of the column
const _f = { F: new Vector3(), n: new Vector3() };
const _si = { x: 0, y: 0, r: 0, rx: 0, ry: 0 };
const _p = { x: 0, y: 0, depth: 0, visible: false };

/** The reading block of law i (null when it is not earned or its text is ""). */
export function lawBlock(i, extraCls) {
  const law = lawOf(i);
  if (!law) return null;
  const b = el('div', `codex-block${extraCls ? ` ${extraCls}` : ''}`, null, null, { qa: 'codex-leader', 'data-stratum': String(i) });
  el('p', 't-label codex-block__k', `КОДЕКС · ${two(i + 1)}`, b);
  el('p', 't-body t-body--em codex-block__law', law.text, b);
  el('p', 't-micro codex-block__m', `ПРАВИЛО КЛАНА · ${law.deedName} · ${dmy(law.at)}`, b);
  return b;
}

/** Screen rectangle of the Key (CSS px): centre + projected max radius. → _si (shared) or null */
function keyScreen(ctx) {
  const k = ctx.key;
  if (!k || !k.screenInfo) return null;
  k.screenInfo(_si);
  return Number.isFinite(_si.x) && _si.rx > 0 ? _si : null;
}

/** The reading column: blocks 64 px left of the Key's bounding box, stacked around their faces' heights but kept clear of
 *  the hall title block under the datum (a block never sits on the DISPLAY title); what does not fit there continues in
 *  the mirror column 64 px right of the Key. One layout read per opening (never per frame). → [{ side, y }] */
export function columnSlots(ctx, list) {
  const key = ctx.key, rig = ctx.rig;
  const si = keyScreen(ctx);
  if (!key || !rig || !si) return list.map(() => null);
  let titleTop = Infinity;
  try {
    const t = document.getElementById('datum-title'), l = document.getElementById('datum-label');
    for (const n of [t, l]) if (n) { const r = n.getBoundingClientRect(); if (r.height > 0 && r.right > 0) titleTop = Math.min(titleTop, r.top); }
  } catch (e) { /* no title */ }
  const top = 96, bottom = Math.min(titleTop - 18, (ctx.layout && ctx.layout.h ? ctx.layout.h : innerHeight) - 120);
  const want = list.map((i) => { key.backFaceFrame(i, _f); rig.project(_f.F, _p); return _p.y; });
  const out = [];
  let y = top - ROW;
  let side = 'left';
  list.forEach((i, k) => {
    let ty = Math.max(want[k], y + ROW);
    if (side === 'left' && ty > bottom) { side = 'right'; y = top - ROW; ty = Math.max(want[k], y + ROW); }
    y = ty;
    out.push({ side, y: ty });
  });
  // the left column floats up when its lowest block would still touch the title
  return out;
}

/** One leader from the back face of stratum i to its slot (columnSlots). → { anchor, remove(ms) } | null */
export function lawLeader(ctx, i, block, slot) {
  const key = ctx.key, rig = ctx.rig;
  if (!key || !ctx.overlay || !rig || !rig.camera || !slot) return null;
  const si = keyScreen(ctx);
  if (!si) return null;
  key.backFaceFrame(i, _f);
  rig.project(_f.F, _p);
  const right = slot.side === 'right';
  const colEdge = right ? Math.min((ctx.layout ? ctx.layout.w : innerWidth) - 16 - 260, si.x + si.rx + COL_GAP)
    : Math.max(16 + 260, si.x - si.rx - COL_GAP);
  const rise = Math.round(slot.y - _p.y);
  const len = Math.max(24, right ? colEdge - _p.x - Math.abs(rise) - 6 : _p.x - Math.abs(rise) - colEdge - 6);
  if (right) block.classList.add('codex-block--right');
  const anchor = ctx.overlay.add({
    owner: 'codex', id: `law-${i}`, el: block,
    get(out) { key.backFaceFrame(i, _f); return out.copy(_f.F); },
    leader: { side: right ? 'right' : 'left', len, rise, runMax: 2000 }, cross: true, priority: 50, lowpass: 60, hideBehind: false,
  });
  // the hairline draws (240 ms); the block itself reveals with its leader instead of waiting behind is-pending
  anchor.drawIn(240);
  block.classList.remove('is-pending');
  block.classList.add('codex-block--in');
  [...block.children].forEach((c, k) => { c.style.opacity = '0'; after(40 * k, () => fade(c, 1, 240)); });
  let gone = false;
  return {
    anchor,
    remove(ms = 240) {
      if (gone) return;
      gone = true;
      fade(block, 0, ms);
      anchor.setAlpha(0);
      after(ms, () => anchor.remove());
    },
  };
}

/** Drag-to-read watcher. → { busy(): boolean, hold(b) } */
export function createCodexRead(ctx, deps) {
  let shown = null;            // [{ remove }] while the blocks are out
  let sheet = null, held = false, stagger = [];
  const phone = () => layout.isPhone;

  function open() {
    const list = earnedStrata();
    if (!list.length) return;
    shown = [];
    if (phone()) {
      if (!sheet) sheet = createSheet({ id: 'sheet-codex', modal: false });
      sheet.body.textContent = '';
      sheet.el.classList.add('sheet--codex');
      const ul = el('div', 'codex-list', null, sheet.body);
      for (const i of list) { const b = lawBlock(i, 'codex-block--list'); if (b) ul.appendChild(b); }
      sheet.open();
      shown.push({ remove() { if (sheet) sheet.close(); } });
      return;
    }
    const slots = columnSlots(ctx, list);
    list.forEach((i, k) => {
      stagger.push(after(k * 40, () => {
        if (!shown) return;
        const b = lawBlock(i);
        const L = b && lawLeader(ctx, i, b, slots[k]);
        if (L) shown.push(L);
      }));
    });
  }
  function close(ms = 240) {
    if (!shown) return;
    const s = shown;
    shown = null;
    for (const L of s) L.remove(ms);
    stagger = [];
  }
  function frame() {
    const key = ctx.key;
    if (!key || held) return;
    const can = app.room === 'CORE' && (app.phase === 'idle' || app.phase === 'unfolded') && !(deps.ceremonyActive && deps.ceremonyActive())
      && !(app.show && app.show.active);
    const back = can && key.isShowingBack && key.isShowingBack();
    if (back && input.pointer.down && !shown) open();
    else if (shown && (!back || !input.pointer.down)) close(240);
  }
  loop.add(frame, ORDER.UI);
  ctx.bus.on('travel:start', () => close(120));
  return {
    busy: () => !!shown,
    /** ПОКАЗ ФИНАЛ (a): the earned laws' leaders while the Key shows its back (no ceremony). */
    hold(b) {
      if (b) { held = true; close(0); open(); } else { held = false; close(240); }
    },
    STRATUM_SIGN,
  };
}
