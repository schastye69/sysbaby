// ui/status.js — MINIMAL placeholder written by WP0 stage 0A (core/loop.js says 'tab.back' through it).
// Stage 0D replaces it with the full status engine of ARCH §3.12.5 (STATUS_COPY, priorities, queue, 4 s hold,
// idle rotation, #status rendering, #status-live mirror). The signature is final.
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';

const COPY = { 'tab.back': { text: 'вот ты где.', p: 3 } };

export const status = {
  current: null,
  init(ctx) { void ctx; },
  say(key, vars = {}, opts = { force: false }) {
    void vars; void opts;
    const c = COPY[key];
    if (!c) return false;
    status.current = { key, text: c.text, p: c.p, at: Date.now() };
    app.status = c.text;
    const live = document.getElementById('status-live');
    if (live) live.textContent = c.text;
    bus.emit('status:show', { key, text: c.text, p: c.p });
    return true;
  },
  clear() { status.current = null; app.status = ''; },
};
