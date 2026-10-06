// core/input.js — pointer gestures, consumer stack, capture, raw observers (ARCH §3.9.1–§3.9.2, SPEC §10.1).
//
// Gestures are recognised from Pointer Events on #gl (and #t0 in T0). DOM controls get their own native events.
// Recognition (one primary pointer; a second touch turns the sequence into a pinch and cancels hold/tap):
//   down → 350 ms still (< 8 px): hold (once) → 800 ms: longpress (once)
//   ≥ 8 px from down: dragstart (afterHold if hold fired), drag per move, dragend on up
//   up within 350 ms and < 8 px total: tap (after up); never after hold
//   dragend with distance ≥ 40 px and release speed ≥ 0.3 px/ms: swipe {dir} (dominant axis)
//   pointercancel → cancel · mouse move without buttons: hover · leaving the window: leave · wheel (default prevented)
// The gesture object passed to consumers is REUSED (no per-event allocation): read it synchronously, copy what you keep.
// No layout reads in move handlers.
import { logOnce } from './env.js';
import { loop } from './loop.js';
import { layout } from './layout.js';
import { audio } from '../audio/engine.js';
import { ripple, vibrate, VIBE } from '../ui/tactile.js';

export const GESTURE = Object.freeze({ TAP_MS: 350, HOLD_MS: 350, LONG_MS: 800, SLOP_PX: 8, SWIPE_PX: 40, SWIPE_V: 0.3 });
const VEL_TAU = 60;   // ms, one-pole velocity smoothing

/** @type {{name:string, onGesture:(g:Object)=>boolean}[]} bottom → top */
const stack = [];
let captured = null;
const observers = [];
const keyObservers = [];
let ctxRef = null;

// The reused gesture object.
const g = {
  type: 'down', x: 0, y: 0, dx: 0, dy: 0, tx: 0, ty: 0, vx: 0, vy: 0, speed: 0, t: 0, id: 0, pointerType: 'mouse', button: 0,
  scale: 1, dScale: 1, deltaY: 0, dir: null, afterHold: false, shift: false, alt: false,
};
// The reused raw sample for observers.
const sample = { x: 0, y: 0, vx: 0, vy: 0, speed: 0, type: 'mouse', buttons: 0, t: 0 };

// Primary sequence state.
const seq = { active: false, id: -1, type: 'mouse', x0: 0, y0: 0, t0: 0, lastX: 0, lastY: 0, lastT: 0, dragging: false,
  holdFired: false, longFired: false, pinch: false, moved: 0, button: 0 };
let holdTimer = 0, longTimer = 0;
// Pinch.
const touches = new Map();   // pointerId → {x, y}
let pinchD0 = 0, pinchDPrev = 0;

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

function dispatch(type, e) {
  g.type = type;
  if (e) { g.shift = !!e.shiftKey; g.alt = !!e.altKey; }
  if (type !== 'swipe') g.dir = null;
  if (captured) {
    try { captured.onGesture(g); } catch (err) { logOnce(`input:${captured.name}`, 'captured consumer threw', err); }
    return;
  }
  for (let i = stack.length - 1; i >= 0; i--) {
    const c = stack[i];
    let used = false;
    try { used = !!c.onGesture(g); } catch (err) { logOnce(`input:${c.name}`, 'consumer threw', err); }
    if (used) return;
  }
}

function fill(e, x, y) {
  g.x = x; g.y = y;
  g.id = e.pointerId; g.pointerType = e.pointerType || 'mouse'; g.button = e.button | 0;
  g.scale = 1; g.dScale = 1; g.deltaY = 0;
}

function clearTimers() {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = 0; }
  if (longTimer) { clearTimeout(longTimer); longTimer = 0; }
}

function updatePointer(e) {
  const p = input.pointer;
  const t = now();
  const dtMs = Math.max(1, t - (p._t || t - 16));
  const ivx = (e.clientX - p.x) / dtMs, ivy = (e.clientY - p.y) / dtMs;
  const k = 1 - Math.exp(-dtMs / VEL_TAU);
  if (p.x > -9000) { p.vx += (ivx - p.vx) * k; p.vy += (ivy - p.vy) * k; }
  p._t = t;
  p.x = e.clientX; p.y = e.clientY;
  p.speed = Math.hypot(p.vx, p.vy) * 1000;
  p.type = e.pointerType || 'mouse';
  p.lastMove = loop.now;
  p.inside = true;
}

function notifyObservers(e) {
  if (!observers.length) return;
  const p = input.pointer;
  sample.x = p.x; sample.y = p.y; sample.vx = p.vx; sample.vy = p.vy; sample.speed = p.speed;
  sample.type = p.type; sample.buttons = e.buttons | 0; sample.t = loop.now;
  for (let i = 0; i < observers.length; i++) {
    try { observers[i](sample); } catch (err) { logOnce('input:observer', 'observer threw', err); }
  }
}

// ─── Surface handlers (#gl / #t0) ─────────────────────────────────────────────────────────────────────────────
function onDown(e) {
  if (e.pointerType === 'touch') {
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    ripple(e.clientX, e.clientY);
    vibrate(VIBE.tap);
    if (touches.size === 2 && seq.active) { startPinch(e); return; }
    if (touches.size > 2) return;
  }
  if (seq.active) return;   // one primary pointer
  try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  const t = now();
  const p = input.pointer;   // a new press starts the velocity estimate afresh (touches jump between fingers)
  p.x = e.clientX; p.y = e.clientY; p.vx = 0; p.vy = 0; p.speed = 0; p._t = t;
  p.type = e.pointerType || 'mouse'; p.lastMove = loop.now; p.inside = true;
  seq.active = true; seq.id = e.pointerId; seq.type = e.pointerType || 'mouse';
  seq.x0 = seq.lastX = e.clientX; seq.y0 = seq.lastY = e.clientY; seq.t0 = seq.lastT = t;
  seq.dragging = false; seq.holdFired = false; seq.longFired = false; seq.pinch = false; seq.moved = 0; seq.button = e.button | 0;
  input.pointer.down = true;
  fill(e, e.clientX, e.clientY);
  g.dx = 0; g.dy = 0; g.tx = 0; g.ty = 0; g.vx = 0; g.vy = 0; g.speed = 0; g.t = 0; g.afterHold = false;
  dispatch('down', e);
  clearTimers();
  holdTimer = setTimeout(() => {
    holdTimer = 0;
    if (!seq.active || seq.dragging || seq.pinch) return;
    seq.holdFired = true;
    g.t = now() - seq.t0; g.dx = 0; g.dy = 0; g.afterHold = true;
    dispatch('hold', null);
    longTimer = setTimeout(() => {
      longTimer = 0;
      if (!seq.active || seq.dragging || seq.pinch) return;
      seq.longFired = true;
      g.t = now() - seq.t0;
      dispatch('longpress', null);
    }, GESTURE.LONG_MS - GESTURE.HOLD_MS);
  }, GESTURE.HOLD_MS);
}

function startPinch(e) {
  clearTimers();
  if (seq.dragging) { g.t = now() - seq.t0; dispatch('dragend', e); }
  seq.pinch = true; seq.dragging = false;
  const [a, b] = [...touches.values()];
  pinchD0 = pinchDPrev = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
  fill(e, (a.x + b.x) / 2, (a.y + b.y) / 2);
  g.scale = 1; g.dScale = 1;
  dispatch('pinchstart', e);
}

function onMove(e) {
  updatePointer(e);
  notifyObservers(e);
  if (e.pointerType === 'touch' && touches.has(e.pointerId)) {
    const tp = touches.get(e.pointerId); tp.x = e.clientX; tp.y = e.clientY;
  }
  if (seq.pinch) {
    if (touches.size < 2) return;
    let ax = 0, ay = 0, bx = 0, by = 0, i = 0;
    touches.forEach((p) => { if (i === 0) { ax = p.x; ay = p.y; } else if (i === 1) { bx = p.x; by = p.y; } i++; });
    const d = Math.max(1, Math.hypot(ax - bx, ay - by));
    fill(e, (ax + bx) / 2, (ay + by) / 2);
    g.scale = d / pinchD0; g.dScale = d / pinchDPrev; pinchDPrev = d;
    dispatch('pinch', e);
    return;
  }
  if (!seq.active || e.pointerId !== seq.id) {
    if (!seq.active && (e.pointerType || 'mouse') === 'mouse' && (e.buttons | 0) === 0) {
      fill(e, e.clientX, e.clientY);
      g.dx = e.movementX || 0; g.dy = e.movementY || 0; g.tx = 0; g.ty = 0;
      g.vx = input.pointer.vx; g.vy = input.pointer.vy; g.speed = input.pointer.speed; g.t = 0; g.afterHold = false;
      dispatch('hover', e);
    }
    return;
  }
  const t = now();
  fill(e, e.clientX, e.clientY);
  g.dx = e.clientX - seq.lastX; g.dy = e.clientY - seq.lastY;
  g.tx = e.clientX - seq.x0; g.ty = e.clientY - seq.y0;
  g.vx = input.pointer.vx; g.vy = input.pointer.vy; g.speed = input.pointer.speed;
  g.t = t - seq.t0; g.afterHold = seq.holdFired;
  seq.lastX = e.clientX; seq.lastY = e.clientY; seq.lastT = t;
  seq.moved = Math.max(seq.moved, Math.hypot(g.tx, g.ty));
  if (!seq.dragging) {
    if (seq.moved >= GESTURE.SLOP_PX) {
      seq.dragging = true;
      clearTimers();
      dispatch('dragstart', e);
      dispatch('drag', e);
    } else dispatch('move', e);
  } else dispatch('drag', e);
}

function endSequence(e, cancelled) {
  const t = now();
  clearTimers();
  input.pointer.down = false;
  try { if (e.currentTarget && e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  fill(e, e.clientX, e.clientY);
  g.dx = e.clientX - seq.lastX; g.dy = e.clientY - seq.lastY;
  g.tx = e.clientX - seq.x0; g.ty = e.clientY - seq.y0;
  g.vx = input.pointer.vx; g.vy = input.pointer.vy; g.speed = input.pointer.speed;
  g.t = t - seq.t0; g.afterHold = seq.holdFired;
  const wasDragging = seq.dragging, wasPinch = seq.pinch;
  seq.active = false; seq.dragging = false; seq.pinch = false;
  if (cancelled) { dispatch('cancel', e); releaseCapture(); return; }
  if (wasPinch) { dispatch('pinchend', e); releaseCapture(); return; }
  dispatch('up', e);
  if (wasDragging) {
    dispatch('dragend', e);
    const dist = Math.hypot(g.tx, g.ty);
    const v = Math.hypot(g.vx, g.vy);
    if (dist >= GESTURE.SWIPE_PX && v >= GESTURE.SWIPE_V) {
      g.dir = Math.abs(g.tx) >= Math.abs(g.ty) ? (g.tx > 0 ? 'right' : 'left') : (g.ty > 0 ? 'down' : 'up');
      dispatch('swipe', e);
    }
  } else if (!seq.holdFired && g.t < GESTURE.TAP_MS && seq.moved < GESTURE.SLOP_PX) {
    dispatch('tap', e);
  }
  releaseCapture();
}

function releaseCapture() { captured = null; }

function onUp(e) {
  if (e.pointerType === 'touch') {
    touches.delete(e.pointerId);
    try { audio.resume(); } catch (err) { /* ignore */ }
    if (seq.pinch) {
      if (touches.size < 2 && seq.active) {
        if (touches.size === 0 || e.pointerId === seq.id) endSequence(e, false);
        else { fill(e, e.clientX, e.clientY); dispatch('pinchend', e); seq.pinch = false; seq.active = false; input.pointer.down = false; releaseCapture(); }
      }
      return;
    }
  }
  if (!seq.active || e.pointerId !== seq.id) return;
  endSequence(e, false);
}

function onCancel(e) {
  if (e.pointerType === 'touch') touches.delete(e.pointerId);
  if (!seq.active) return;
  if (e.pointerId !== seq.id && !seq.pinch) return;
  touches.clear();
  endSequence(e, true);
}

function onWheel(e) {
  e.preventDefault();
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= layout.h || 800;
  g.x = e.clientX; g.y = e.clientY; g.dx = 0; g.dy = 0; g.tx = 0; g.ty = 0; g.vx = 0; g.vy = 0; g.speed = 0; g.t = 0;
  g.id = 0; g.pointerType = 'mouse'; g.button = 0; g.scale = 1; g.dScale = 1; g.deltaY = dy; g.afterHold = false;
  dispatch('wheel', e);
}

function onLeaveWindow(e) {
  if (e.relatedTarget) return;   // moved to another element, still inside the window
  input.pointer.inside = false;
  fill(e, e.clientX, e.clientY);
  dispatch('leave', e);
}

function attach(el) {
  if (!el || el.__samvinInput) return;
  el.__samvinInput = true;
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onCancel);
  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ─── Base consumers (bottom → top): hall, then director (ARCH §3.9.2) ─────────────────────────────────────────
const hallConsumer = {
  name: 'hall',
  onGesture(ge) {
    const halls = ctxRef && ctxRef.halls;
    if (!halls || typeof halls.current !== 'function') return false;
    const h = halls.current();
    if (!h) return false;
    return !!halls.call(h.id, 'onGesture', ge);
  },
};
const directorConsumer = {
  name: 'director',
  onGesture(ge) {
    const d = ctxRef && ctxRef.director;
    if (!d || typeof d.busy !== 'function' || !d.busy()) return false;   // idle: pass
    const st = d.state;
    const halls = ctxRef.halls;
    // u ≥ 0.7: the destination hall is offered the gesture first (SPEC §7.7, input is never dead).
    if (st && st.u >= 0.7 && st.to && halls && typeof halls.call === 'function') {
      if (halls.call(st.to.room, 'onGesture', ge)) return true;
    }
    if (ge.type === 'tap' && typeof d.speedUp === 'function') d.speedUp();
    return true;
  },
};

export const input = {
  pointer: { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, type: 'mouse', down: false, lastMove: 0, inside: false },
  /** Attaches listeners to #gl and #t0, the window observers, audio unlock, and the base consumer stack. */
  init(ctx) {
    ctxRef = ctx;
    attach(document.getElementById('gl'));
    attach(document.getElementById('t0'));
    // Raw samples anywhere in the window (hover over DOM too): pointer position, velocity, observers.
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onLeaveWindow);
    // First gesture anywhere unlocks audio (never plays before it); touch-ups resume it again (iOS).
    const unlock = () => { try { audio.unlock(); } catch (err) { logOnce('input:unlock', err); } };
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('touchend', () => { try { audio.resume(); } catch (err) { /* ignore */ } }, { passive: true });
    // Keys: audio unlock + passive key observers (outside text inputs), in the capture phase so they precede
    // nav/keyboard.js (ARCH §3.9.3 order step 2).
    window.addEventListener('keydown', (e) => {
      unlock();
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
      for (let i = 0; i < keyObservers.length; i++) {
        try { keyObservers[i](e); } catch (err) { logOnce('input:keyobserver', 'key observer threw', err); }
      }
    }, { capture: true });
    if (!stack.includes(hallConsumer)) { stack.unshift(directorConsumer); stack.unshift(hallConsumer); }
  },
  /** Pushes a consumer on top of the stack. → remove() */
  push(consumer) {
    stack.push(consumer);
    return () => { const i = stack.indexOf(consumer); if (i >= 0) stack.splice(i, 1); };
  },
  /** Exclusive capture of the current pointer sequence until its up/cancel. */
  capture(consumer) { captured = consumer; },
  release(consumer) { if (!consumer || captured === consumer) captured = null; },
  /** Passive raw pointer observer anywhere in the window. → remove() */
  observe(fn) {
    observers.push(fn);
    return () => { const i = observers.indexOf(fn); if (i >= 0) observers.splice(i, 1); };
  },
  /** Passive keydown observer outside text inputs. → remove() */
  observeKeys(fn) {
    keyObservers.push(fn);
    return () => { const i = keyObservers.indexOf(fn); if (i >= 0) keyObservers.splice(i, 1); };
  },
};
