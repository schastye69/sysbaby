// ui/sheet.js — the phone bottom sheet and extra modal sheets (ARCH §3.12.6; SPEC §6.0 "Readable blocks", §10.2).
// Solid --deep, a 1 px --slate top hairline, a 24 px handle, max 62 % of the height, a 120 px peek, above the 88 px Key
// band; landscape phones: a right-side panel 44 % wide. Never frosted. Desktop: never shown (CSS).
// Drag the sheet vertically: release with ≥ 40 px or ≥ 0.3 px/ms steps one state (down: full → peek → closed; up:
// peek → full); the CSS transition (480 ms, EASE.reveal) is the spring that snaps it.
// DOM contract (sheet.css): #sheets > section#sheet.sheet[data-state] > div.sheet-handle, div.sheet-peek, div.sheet-body.
import { layout } from '../core/layout.js';
import { GESTURE } from '../core/input.js';

const listeners = new Set();
let root = null, handle = null, peekEl = null, body = null;
const drag = { id: -1, y0: 0, t0: 0, y: 0, t: 0, h: 0, base: 0, moved: false };

function setState(s) {
  if (sheet.state === s) return;
  sheet.state = s;
  if (root) root.dataset.state = s;
  try { document.body.dataset.sheet = s; } catch (e) { /* no DOM */ }   // fx.css lifts the scale bar above a shown sheet
  for (const fn of listeners) { try { fn(s); } catch (e) { /* listener errors never break the sheet */ } }
}

function baseOffset(state, h) {
  if (state === 'full') return 0;
  if (state === 'peek') return Math.max(0, h - 120);
  return h;
}

function onDown(e) {
  if (sheet.state === 'closed' || drag.id >= 0 || layout.kind === 'phone-land') return;
  if (sheet.state === 'full' && body && body.contains(e.target) && body.scrollTop > 0) return;   // let the body scroll
  const r = root.getBoundingClientRect();                                                    // allowed on down
  drag.id = e.pointerId; drag.y0 = drag.y = e.clientY; drag.t0 = drag.t = e.timeStamp;
  drag.h = r.height; drag.base = baseOffset(sheet.state, r.height); drag.moved = false;
}
function onMove(e) {
  if (e.pointerId !== drag.id) return;
  const dy = e.clientY - drag.y0;
  if (!drag.moved && Math.abs(dy) < GESTURE.SLOP_PX) return;
  if (!drag.moved) { drag.moved = true; root.classList.add('is-dragging'); try { root.setPointerCapture(e.pointerId); } catch (err) { /* no capture */ } }
  drag.y = e.clientY; drag.t = e.timeStamp;
  const off = Math.max(0, Math.min(drag.h, drag.base + dy));
  root.style.transform = `translateY(${off.toFixed(1)}px)`;
}
function onUp(e) {
  if (e.pointerId !== drag.id) return;
  drag.id = -1;
  if (!drag.moved) return;
  root.classList.remove('is-dragging');
  root.style.transform = '';
  const dy = drag.y - drag.y0;
  const v = dy / Math.max(1, drag.t - drag.t0);
  const step = Math.abs(dy) >= 40 || Math.abs(v) >= GESTURE.SWIPE_V;
  if (!step) return;
  if (dy > 0) setState(sheet.state === 'full' ? 'peek' : 'closed');
  else if (sheet.state === 'peek') setState('full');
}

export const sheet = {
  /** 'closed' | 'peek' | 'full' */
  state: 'closed',

  init(ctx) {
    void ctx;
    const host = document.getElementById('sheets');
    if (!host) return sheet;
    root = document.createElement('section');
    root.id = 'sheet';
    root.className = 'sheet';
    root.dataset.state = 'closed';
    handle = document.createElement('div'); handle.className = 'sheet-handle';
    peekEl = document.createElement('div'); peekEl.className = 'sheet-peek';
    body = document.createElement('div'); body.className = 'sheet-body';
    root.append(handle, peekEl, body);
    host.appendChild(root);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    return sheet;
  },

  /** The hall whose content is up (owner of the last non-empty set), or null. */
  owner: null,
  /** Hall-owned nodes; replaces the previous content. content null = empty + closed. owner (the per-hall handle in
   *  halls/host.js passes it): a hall that has handed the sheet on (it departed, its exit tail runs on) can no longer
   *  clear the next hall's content. */
  set(content, opts = {}, owner = null) {
    if (!root) return;
    const empty = !content && !opts.peek;
    if (empty && owner != null && sheet.owner != null && owner !== sheet.owner) return;
    sheet.owner = empty ? null : owner;
    peekEl.textContent = '';
    body.textContent = '';
    body.scrollTop = 0;
    if (opts.peek) peekEl.appendChild(opts.peek);
    if (content) body.appendChild(content);
    if (!content && !opts.peek) { setState('closed'); return; }
    setState(opts.state === 'full' ? 'full' : opts.state === 'closed' ? 'closed' : 'peek');
  },
  open(level = 'peek') { if (root && (peekEl.firstChild || body.firstChild)) setState(level === 'full' ? 'full' : 'peek'); },
  close(owner = null) { if (owner != null && sheet.owner != null && owner !== sheet.owner) return; setState('closed'); },
  /** → off() */
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};

/** body.modal-on while a modal sheet is up: the world's own DOM text under it steps back (CSS), so the plate is the
 *  one readable thing on screen instead of a box dropped on top of other copy. */
const openModals = new Set();
function modalOn(el, on) {
  if (on) openModals.add(el); else openModals.delete(el);
  try { document.body.classList.toggle('modal-on', openModals.size > 0); } catch (e) { /* no DOM */ }
}

/** Extra modal sheets (e.g. WP10's «Кто ты?»): → { el, body, open(), close(), destroy() } */
export function createSheet(opts = {}) {
  const host = document.getElementById('sheets');
  const el = document.createElement('section');
  if (opts.id) el.id = opts.id;
  el.className = 'sheet sheet--modal';
  el.dataset.state = 'closed';
  const h = document.createElement('div'); h.className = 'sheet-handle';
  const b = document.createElement('div'); b.className = 'sheet-body';
  el.append(h, b);
  let veil = null;
  if (opts.modal !== false) { veil = document.createElement('div'); veil.className = 'sheet-veil'; }
  if (host) { if (veil) host.appendChild(veil); host.appendChild(el); }
  const api = {
    el, body: b,
    open() { el.dataset.state = 'full'; if (veil) veil.classList.add('is-on'); modalOn(el, true); },
    close() { el.dataset.state = 'closed'; if (veil) veil.classList.remove('is-on'); modalOn(el, false); },
    destroy() { modalOn(el, false); for (const n of [el, veil]) if (n && n.parentNode) n.parentNode.removeChild(n); },
  };
  if (veil) veil.addEventListener('click', () => api.close());
  return api;
}
