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

const queue = [];
let el = null, live = null, holdTimer = 0, idleTimer = 0, idleIdx = 0, raf = 0;

/** Fill a template: {var} → value; {var:one|few|many} → plural word for var. Unknown vars stay visible as written. */
export function fillStatus(tpl, vars) {
  return tpl.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g, (m, k, one, few, many) => {
    const v = vars ? vars[k] : undefined;
    if (v == null) return m;
    return one != null ? plural(v, one, few, many) : String(v);
  });
}

function render(msg) {
  status.current = msg;
  app.status = msg.text;
  if (live) live.textContent = msg.text;
  if (el) {
    el.classList.remove('is-in');
    el.textContent = msg.text;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { raf = 0; el.classList.add('is-in'); });
  }
  if (holdTimer) cancelAfter(holdTimer);
  holdTimer = after(TIMING.statusHold, onHoldEnd);
  bus.emit('status:show', { key: msg.key, text: msg.text, p: msg.p });
}

function held() { return !status.current || loop.now - status.current.at >= TIMING.statusHold; }

function onHoldEnd() {
  holdTimer = 0;
  if (queue.length) show(queue.shift());
}

function show(msg) { msg.at = loop.now; render(msg); }

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
    return status;
  },

  /** → boolean: shown or queued. */
  say(key, vars = {}, opts = {}) {
    const c = STATUS_COPY[key];
    if (!c) return false;
    const msg = { key, text: fillStatus(c.text, vars), p: c.p, at: 0 };
    const cur = status.current;
    if (cur && cur.text === msg.text && !held()) return true;            // already on screen
    if (opts && opts.force) { show(msg); return true; }
    if (!cur || held()) { show(msg); return true; }
    if (msg.p === 1 && cur.p > 1) { show(msg); return true; }
    enqueue(msg);
    return true;
  },

  clear() {
    queue.length = 0;
    status.current = null;
    app.status = '';
    if (holdTimer) { cancelAfter(holdTimer); holdTimer = 0; }
    if (el) { el.classList.remove('is-in'); el.textContent = ''; }
    if (live) live.textContent = '';
  },
};
