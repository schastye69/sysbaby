// core/loop.js — the one requestAnimationFrame loop (ARCH §3.1.3, §3.15.3, §6.1.6 A8).
//
// • Callbacks run in ORDER, same order → insertion order. A throwing callback is removed and logged once.
// • loop.now (ms) advances by the REAL frame interval capped at 250 ms; it stops while stopped/hidden. Every SPEC
//   duration is measured on loop.now. Only the dt passed to callbacks is clamped (≤ 0.05 s) to keep physics stable.
// • stop() means no requestAnimationFrame at all.
// • Visibility: hidden → stop, title «…ты где?» / «…сплю» (night), audio fade + suspend, flush state, emit
//   'visibility' {hidden:true} (audio/engine.js fades + suspends on that event); visible → title = titleFor(route), start, status 'tab.back', ('visibility' → audio resumes if on),
//   emit 'visibility' {hidden:false}.
import { logOnce } from './env.js';
import { bus } from './bus.js';
import { app } from './store.js';
import { flush } from './state.js';
import { titleFor } from '../nav/router.js';
import { status } from '../ui/status.js';

export const ORDER = Object.freeze({ INPUT: 0, CLOCK: 10, DIRECTOR: 20, WORLD: 30, FX: 40, LAMP: 50, CAMERA: 60, OVERLAY: 70, RENDER: 80, UI: 90 });

const DT_MAX = 0.05;      // s, physics clamp
const STEP_MAX = 250;     // ms, loop-time advance cap per frame

/** @type {{id:number, fn:Function, order:number}[]} kept sorted; replaced (copy-on-write) on add/remove so a frame
 *  in progress keeps iterating its own snapshot without per-frame allocation. */
let list = [];
let nextId = 1;
let raf = 0;
let lastTs = -1;

function insert(entry) {
  const next = list.slice();
  let i = next.length;
  while (i > 0 && next[i - 1].order > entry.order) i--;
  next.splice(i, 0, entry);
  list = next;
}

function tick(ts) {
  raf = 0;
  if (!loop.running) return;
  raf = requestAnimationFrame(tick);
  let step = lastTs < 0 ? 16.7 : ts - lastTs;
  lastTs = ts;
  if (!(step > 0)) step = 0;
  if (step > STEP_MAX) step = STEP_MAX;
  loop.now += step;
  loop.frame++;
  const dt = Math.min(DT_MAX, step / 1000);
  const t = loop.now;
  const snap = list;
  for (let i = 0; i < snap.length; i++) {
    const e = snap[i];
    if (e.dead) continue;
    try { e.fn(dt, t); } catch (err) {
      logOnce(`loop:${e.id}`, 'frame callback threw and was removed', err);
      loop.remove(e.id);
    }
  }
}

export const loop = {
  running: false,
  frame: 0,
  /** loop time in ms (stops while hidden / stopped) */
  now: 0,
  /** WP0 addition: the loop time of THIS instant between two frames — loop.now plus the real time since the last
   *  frame's timestamp (capped like a frame step). A travel started from an input event starts its clock here, so its
   *  first frame advances by the part of the interval after the event (durations stay wall-clock exact). */
  at() {
    if (!loop.running || lastTs < 0 || typeof performance === 'undefined') return loop.now;
    const d = performance.now() - lastTs;
    return loop.now + (d > 0 ? Math.min(d, STEP_MAX) : 0);
  },
  /** fn(dt seconds ≤ 0.05, t loop ms) → id */
  add(fn, order = ORDER.UI) {
    const id = nextId++;
    insert({ id, fn, order, dead: false });
    return id;
  },
  remove(id) {
    const i = list.findIndex((e) => e.id === id);
    if (i < 0) return;
    list[i].dead = true;
    const next = list.slice();
    next.splice(i, 1);
    list = next;
  },
  start() {
    if (loop.running) return;
    loop.running = true;
    lastTs = -1;
    if (typeof requestAnimationFrame === 'function') raf = requestAnimationFrame(tick);
  },
  stop() {
    loop.running = false;
    if (raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf);
    raf = 0;
  },
};

// ─── Visibility (ARCH §3.15.3) ────────────────────────────────────────────────────────────────────────────────
let resumeOnVisible = false;
let hiddenNow = false;

function onVisibility() {
  const hidden = document.visibilityState === 'hidden' || document.hidden === true;
  if (hidden === hiddenNow) return;
  hiddenNow = hidden;
  if (hidden) {
    resumeOnVisible = loop.running;
    loop.stop();
    try { document.title = app.night ? '…сплю' : '…ты где?'; } catch (e) { /* ignore */ }
    try { flush(); } catch (e) { logOnce('loop:flush', e); }
    bus.emit('visibility', { hidden: true });
  } else {
    try { document.title = titleFor(app.route); } catch (e) { document.title = 'SAM.VIN'; }
    if (resumeOnVisible) loop.start();
    try { status.say('tab.back', {}, { force: true }); } catch (e) { logOnce('loop:status', e); }
    bus.emit('visibility', { hidden: false });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', onVisibility);
}
