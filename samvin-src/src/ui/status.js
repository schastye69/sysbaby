// ui/status.js — MINIMAL placeholder written by WP0 stage 0A (core/loop.js says 'tab.back' through it).
// Stage 0D replaces it with the full status engine of ARCH §3.12.5 (STATUS_COPY, priorities, queue, 4 s hold,
// idle rotation, #status rendering, #status-live mirror). The signature is final.
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';

const COPY = {
  'tab.back': { text: 'вот ты где.', p: 3 },
  'sealed': { text: 'запечатано. осколков {k} из 5.', p: 1 },          // router guard (stage 0C)
  'route.missing': { text: 'здесь ничего нет. пока.', p: 1 },          // router guard (stage 0C)
};

export const status = {
  current: null,
  init(ctx) { void ctx; },
  say(key, vars = {}, opts = { force: false }) {
    void opts;
    const c = COPY[key];
    if (!c) return false;
    const text = c.text.replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? String(vars[k]) : m));
    status.current = { key, text, p: c.p, at: Date.now() };
    app.status = text;
    const live = document.getElementById('status-live');
    if (live) live.textContent = text;
    bus.emit('status:show', { key, text, p: c.p });
    return true;
  },
  clear() { status.current = null; app.status = ''; },
};
