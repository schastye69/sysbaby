// host/showLazy.js — ctx.host.show until «ПОКАЗ» is first needed (core/chunk.js; build.mjs §3c' chunk `show`). The show
// itself (host/show.js, its strip and the hull path) is fetched when the guests sheet opens (the only way into a show:
// НАЧАТЬ ПОКАЗ) or, at the latest, by start(). Same surface as createShow(): active / scene read app.show; start, next,
// prev, jump, back, exit go to the real show once it is there (next / prev / back / exit are no-ops before: no show runs).
import KIT from 'samvin:chunk-kit/show';
import { app } from '../core/store.js';
import { logOnce } from '../core/env.js';
import { loadChunk } from '../core/chunk.js';

export function createShowLazy(ctx) {
  let real = null, loading = null;
  const load = () => {
    if (!loading) {
      loading = loadChunk('show', KIT).then((m) => { if (!real) real = m.createShow(ctx); return real; });
      loading.catch((e) => { loading = null; logOnce('host:show', 'ПОКАЗ failed to load', e); });
    }
    return loading;
  };
  const later = (method) => (...a) => {
    if (real) return real[method](...a);
    load().then((r) => r[method](...a), () => {});
    return undefined;
  };
  const now = (method) => (...a) => (real ? real[method](...a) : undefined);
  return {
    get active() { return !!app.show.active; },
    get scene() { return app.show.scene; },
    get loaded() { return !!real; },
    preload: () => { load().catch(() => {}); },
    start: later('start'),
    jump: later('jump'),
    next: now('next'), prev: now('prev'), back: now('back'), exit: now('exit'),
  };
}
