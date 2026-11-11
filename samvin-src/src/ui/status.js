// ui/status.js — the world's single readable voice (ARCH §3.12.5; SPEC §2.7, §8.4).
// Priority 1 (discovery) … 5 (idle facts). A shown message holds ≥ 4,000 ms (loop time, so a hidden tab never eats it).
//   • A P1 message replaces the current one at once — unless the current one is itself a P1 still inside its hold
//     (then it waits at the front of the queue, so «найдено.» → «осколок 1 из 5 на месте.» are both read).
//   • Any message replaces a current one that has held 4,000 ms; otherwise it is queued (max 4, by p then FIFO; the
//     least important newest entry is dropped on overflow). The queue drains as each hold ends.
//   • opts.force shows at once (the tab-return greeting answers the visitor immediately).
//   • P5 idle facts ('idle.nodes', 'idle.mission' for the first active/new mission) rotate every 20,000 ms while the
//     queue is empty and nothing more important is holding.
// Renders #status (.is-in → 240 ms fade-in), mirrors the text into #status-live (aria-live="polite"), sets app.status,
// emits 'status:show' {key, text, p}.
//   • The line speaks about the place he is in (SPEC §2.7 "event-driven from real state only"): when a travel starts,
//     a greeting / fact (P3–P5) or any message whose hold is over fades out (240 ms); a P1/P2 still inside its hold
//     finishes it and then leaves, unless the queue has the next one. So a boot «вижу тебя.» never follows him into
//     MEMBERS. The idle facts rotate again from the new hall.
//   • Its box is a keep-out (ui/keepout.js): the drawing's lines break behind it.
import { STATUS_COPY } from './statusCopy.js';
import { plural } from '../core/ru.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { loop } from '../core/loop.js';
import { after, cancelAfter } from '../core/clock.js';
import { state } from '../core/state.js';
import { WORLD } from '../data/world.js';
import { missionView } from '../halls/voyages/missionModel.js';
import { TIMING } from '../core/tokens.js';
import { keepout } from './keepout.js';
import { layout } from '../core/layout.js';

const queue = [];
let el = null, live = null, holdTimer = 0, idleTimer = 0, idleIdx = 0, raf = 0, boxRaf = 0;

/** The line's box → keep-out (one layout read per message / relayout, in the frame after it is written). Until that
 *  read, the new line holds the last measured line band, centred, at an estimated width (16 px STATUS ≈ 0.52 em per
 *  glyph): a line said on a hit frame (ПРОСВЕТ) is clear of the axis from its first frame, without a forced layout. */
const lastBand = { top: 0, bottom: 0, cx: 0, ok: false };
function boxSoon() {
  if (!el) return;
  if (status.current && lastBand.ok) {
    const hw = Math.min(lastBand.cx - 8, status.current.text.length * 4.2 + 4);
    keepout.set('status', lastBand.cx - hw, lastBand.top, lastBand.cx + hw, lastBand.bottom);
  }
  if (boxRaf) return;
  boxRaf = requestAnimationFrame(() => {
    boxRaf = 0;
    if (!el || !status.current) {
      keepout.off('status');
      // no line: still learn where the line band is (its bottom is fixed; one 22 px line), for the first message
      try { const r = el && el.getBoundingClientRect(); if (r) { lastBand.bottom = r.bottom; lastBand.top = r.bottom - 22; lastBand.cx = (layout.w || innerWidth) / 2; lastBand.ok = r.bottom > 0; } } catch (e) { /* none */ }
      return;
    }
    try {
      const r = el.getBoundingClientRect();
      if (r.width > 0) {
        keepout.set('status', r.left, r.top, r.right, r.bottom);
        lastBand.top = r.top; lastBand.bottom = r.bottom; lastBand.cx = (r.left + r.right) / 2; lastBand.ok = true;
      } else keepout.off('status');
    } catch (e) { keepout.off('status'); }
  });
}

/** The line leaves (fade-out 240 ms); the text stays in place under opacity 0 until the next message. */
function fadeOut() {
  status.current = null;
  app.status = '';
  if (holdTimer) { cancelAfter(holdTimer); holdTimer = 0; }
  if (raf) { cancelAnimationFrame(raf); raf = 0; }
  if (el) el.classList.remove('is-in');
  if (live) live.textContent = '';
  keepout.off('status');
}

/** Fill a template: {var} → value; {var:one|few|many} → plural word for var. Unknown vars stay visible as written. */
export function fillStatus(tpl, vars) {
  return tpl.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g, (m, k, one, few, many) => {
    const v = vars ? vars[k] : undefined;
    if (v == null) return m;
    return one != null ? plural(v, one, few, many) : String(v);
  });
}

function render(msg, cut) {
  status.current = msg;
  app.status = msg.text;
  if (live) live.textContent = msg.text;
  if (el) {
    if (raf) cancelAnimationFrame(raf);
    el.textContent = msg.text;
    if (cut) {
      // a line said on a hit (the flash of ПРОСВЕТ) is there with the flash: no fade-in to be caught half-way
      el.classList.add('is-cut', 'is-in');
      raf = requestAnimationFrame(() => { raf = 0; el.classList.remove('is-cut'); });
    } else {
      el.classList.remove('is-in');
      raf = requestAnimationFrame(() => { raf = 0; el.classList.add('is-in'); });
    }
  }
  if (holdTimer) cancelAfter(holdTimer);
  holdTimer = after(TIMING.statusHold, onHoldEnd);
  boxSoon();
  bus.emit('status:show', { key: msg.key, text: msg.text, p: msg.p });
}

function held() { return !status.current || loop.now - status.current.at >= TIMING.statusHold; }

function onHoldEnd() {
  holdTimer = 0;
  if (queue.length) show(queue.shift());
  else if (status.current && status.current.leaving) fadeOut();
}

function show(msg, cut) { msg.at = loop.now; msg.leaving = false; render(msg, cut); }

/** A travel starts: what was said about the old place goes (see the header). */
function onTravel() {
  const cur = status.current;
  if (!cur) return;
  if (cur.p < 3 && !held()) { cur.leaving = true; return; }
  if (queue.length) show(queue.shift());
  else fadeOut();
}

function enqueue(msg) {
  if (queue.some((q) => q.text === msg.text)) return;
  let i = queue.length;
  while (i > 0 && queue[i - 1].p > msg.p) i--;
  queue.splice(i, 0, msg);
  if (queue.length > 4) queue.pop();
}

/** The next idle fact (alternating nodes / mission; the mission only when one is active or new). */
function idleFact() {
  for (let n = 0; n < 2; n++) {
    const k = (idleIdx++) % 2;
    if (k === 0) return { key: 'idle.nodes', vars: { n: state.litNodes | 0 } };
    const ms = WORLD.missions || [];
    for (let j = 0; j < ms.length; j++) {
      let v = null;
      try { v = missionView(ms[j]); } catch (e) { v = null; }
      if (v && (v.state === 'active' || v.state === 'new')) return { key: 'idle.mission', vars: { code: v.numberShown || ms[j].code } };
    }
  }
  return { key: 'idle.nodes', vars: { n: state.litNodes | 0 } };
}

function onIdleTick() {
  idleTimer = after(TIMING.idleRotate, onIdleTick);
  if (app.booting || queue.length || !held()) return;
  const cur = status.current;
  if (cur && cur.p < 5 && loop.now - cur.at < TIMING.idleRotate) return;   // let a fresh greeting breathe
  const f = idleFact();
  status.say(f.key, f.vars);
}

export const status = {
  /** { key, text, p, at } | null */
  current: null,

  init(ctx) {
    void ctx;
    const chromeEl = document.getElementById('chrome');
    el = document.getElementById('status');
    if (!el && chromeEl) {
      el = document.createElement('p');
      el.id = 'status';
      el.className = 't-status';
      el.setAttribute('aria-hidden', 'true');   // #status-live is the accessible copy
      chromeEl.appendChild(el);
    }
    live = document.getElementById('status-live');
    if (live && live.getAttribute('aria-live') !== 'polite') live.setAttribute('aria-live', 'polite');
    if (!idleTimer) idleTimer = after(TIMING.idleRotate, onIdleTick);
    bus.on('travel:start', onTravel);
    bus.on('layout:change', boxSoon);
    boxSoon();
    return status;
  },

  /** → boolean: shown or queued. */
  say(key, vars = {}, opts = {}) {
    const c = STATUS_COPY[key];
    if (!c) return false;
    const msg = { key, text: fillStatus(c.text, vars), p: c.p, at: 0 };
    const cur = status.current;
    if (cur && cur.text === msg.text && !held()) return true;            // already on screen
    const cut = !!(opts && opts.cut);
    if (opts && opts.force) { show(msg, cut); return true; }
    if (!cur || held()) { show(msg, cut); return true; }
    if (msg.p === 1 && cur.p > 1) { show(msg); return true; }
    enqueue(msg);
    return true;
  },

  clear() {
    keepout.off('status');
    queue.length = 0;
    status.current = null;
    app.status = '';
    if (holdTimer) { cancelAfter(holdTimer); holdTimer = 0; }
    if (el) { el.classList.remove('is-in'); el.textContent = ''; }
    if (live) live.textContent = '';
  },
};
