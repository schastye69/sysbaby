// core/bus.js — the event bus (ARCH §3.8): synchronous, in registration order; a throwing listener is logged once
// and skipped (the remaining listeners still run). Only the events listed in ARCH §3.8 exist. Never per-frame data.
import { logOnce } from './env.js';

/** @type {Map<string, Function[]>} */
const map = new Map();

export const bus = {
  /** → off() */
  on(name, fn) {
    let list = map.get(name);
    if (!list) { list = []; map.set(name, list); }
    list.push(fn);
    return () => bus.off(name, fn);
  },
  off(name, fn) {
    const list = map.get(name);
    if (!list) return;
    let i = list.indexOf(fn);
    if (i < 0) i = list.findIndex((l) => l.orig === fn);   // a listener added with once()
    if (i >= 0) list.splice(i, 1);
  },
  /** → off() */
  once(name, fn) {
    const wrap = (p) => { bus.off(name, wrap); fn(p); };
    wrap.orig = fn;
    bus.on(name, wrap);
    return () => bus.off(name, wrap);
  },
  emit(name, payload) {
    const list = map.get(name);
    if (!list || list.length === 0) return;
    // Snapshot so listeners that subscribe/unsubscribe during dispatch do not disturb this emit.
    const snap = list.slice();
    for (let i = 0; i < snap.length; i++) {
      try { snap[i](payload); } catch (e) { logOnce(`bus:${name}`, `listener for '${name}' threw`, e); }
    }
  },
};

// Dev builds only: total number of registered listeners (leak checks, ARCH §6.1.6 A3).
if (__DEV__) {
  bus._count = () => { let n = 0; for (const l of map.values()) n += l.length; return n; };
}
