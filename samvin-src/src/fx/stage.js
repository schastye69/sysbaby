// fx/stage.js — the stage lock (SPEC-ADDENDUM A2.0.1, law L1; ARCH-ADDENDUM X§2.5.2). OWNER: WP12.
// One named set-piece at a time. A request while busy waits ≤ maxWaitMs (1,200), then: boot/wake/show/close/s05/nadir/
// companion/capsule/sbor/guests/lost keep queueing until free (each happens once and must not be lost); s02 and whale
// run their REDUCED form at once (no ПАУЗА/ПРОСВЕТ/wave, without taking the stage); codex defers to the next idle CORE
// moment. During `show`, codex / whale / lost wait for show:end. The highest priority waiting request runs next;
// consecutive КОДЕКС ceremonies are 1,200 ms apart; nothing starts within 300 ms of a tier change (A9.2).
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { after } from '../core/clock.js';
import { loop } from '../core/loop.js';
import { logOnce } from '../core/env.js';

const PRI = { boot: 9, wake: 9, show: 9, close: 8, s05: 7, nadir: 6, companion: 5, capsule: 4, s02: 3, codex: 2, sbor: 1, guests: 1, lost: 1, whale: 0 };
const REDUCE = { s02: 1, whale: 1 };
const SHOW_WAIT = { codex: 1, whale: 1, lost: 1 };

export function createStage(ctx) {
  const wait = [];
  let lastName = null, lastEnd = -1e9, tierAt = -1e9, pumpT = 0;
  bus.on('tier:change', () => { tierAt = loop.now; });
  const showOn = () => stage.current === 'show' || !!(app.show && app.show.active);

  function set(name) {
    stage.current = name; app.fx.stage = name;
    stage.queue = wait.map((r) => r.name);
  }
  async function start(r, reduced) {
    const i = wait.indexOf(r);
    if (i >= 0) wait.splice(i, 1);
    if (r.timer) r.timer = 0;
    if (reduced) {
      stage.queue = wait.map((x) => x.name);
      try { await r.fn({ reduced: true, signal: r.signal }); } catch (e) { logOnce('fx:stage:' + r.name, e); }
      r.resolve('reduced');
      return;
    }
    set(r.name);
    bus.emit('fx:stage', { name: r.name, phase: 'start' });
    try { await r.fn({ reduced: false, signal: r.signal }); } catch (e) { logOnce('fx:stage:' + r.name, e); }
    set(null);
    lastName = r.name; lastEnd = loop.now;
    bus.emit('fx:stage', { name: r.name, phase: 'end' });
    r.resolve('ran');
    pump();
  }
  function pick() {
    let best = null;
    for (const r of wait) {
      if (r.deferred) continue;
      if (SHOW_WAIT[r.name] && showOn()) continue;
      if (!best || PRI[r.name] > PRI[best.name]) best = r;
    }
    return best;
  }
  function pump() {
    if (stage.current || pumpT) return;
    const r = pick();
    if (!r) { stage.queue = wait.map((x) => x.name); return; }
    let delay = Math.max(0, tierAt + 300 - loop.now);
    if (r.name === 'codex' && lastName === 'codex') delay = Math.max(delay, lastEnd + 1200 - loop.now);
    if (delay > 0) { pumpT = after(delay, () => { pumpT = 0; pump(); }); return; }
    start(r, false);
  }
  bus.on('show:end', () => pump());

  const stage = {
    current: null,
    queue: [],
    /** → Promise<'ran'|'reduced'|'deferred'|'dropped'> */
    run(name, fn, opts) {
      const maxWait = opts && opts.maxWaitMs != null ? opts.maxWaitMs : 1200;
      return new Promise((resolve) => {
        if (!(name in PRI) || typeof fn !== 'function') { resolve('dropped'); return; }
        const r = { name, fn, resolve, signal: { aborted: false }, timer: 0, deferred: false };
        wait.push(r);
        stage.queue = wait.map((x) => x.name);
        if (!stage.current && pick() === r && !pumpT) { pump(); return; }
        if (SHOW_WAIT[name] && showOn()) return;                 // waits for show:end, no timeout
        r.timer = after(maxWait, () => {
          if (!r.timer || wait.indexOf(r) < 0) return;
          r.timer = 0;
          if (REDUCE[name]) start(r, true);
          else if (name === 'codex') {
            const i = wait.indexOf(r);
            if (i >= 0) wait.splice(i, 1);
            stage.queue = wait.map((x) => x.name);
            resolve('deferred');
            stage.deferToIdleCore(name, fn);
          }
        });
      });
    },
    busy() { return stage.current != null; },
    /** 'codex': at once if idle in CORE, else 600 ms after the next CORE arrival lock. */
    deferToIdleCore(name, fn) {
      const idleCore = () => app.room === 'CORE' && app.phase === 'idle' && !stage.current && !(ctx.director && ctx.director.busy());
      if (idleCore()) return stage.run(name, fn);
      return new Promise((res) => {
        const off = bus.on('room:arrive', ({ room }) => {
          if (room !== 'CORE') return;
          off();
          after(600, () => stage.run(name, fn).then(res));
        });
      });
    },
  };
  return stage;
}
