// nav/hint.js — the only hint system (ARCH §3.14.3; SPEC §8.3). A long-press on the navigator swings the needle as a
// pendulum (ω 8, ζ 0.25) onto the stratum of the first unfound secret in HINT_ORDER; that letter glints electrum for
// 1,200 ms (S13: the '·' ghost above S). Only time-gated secrets left → • + «остальное придёт само. возвращайся.»;
// everything found → • + «пока всё найдено.». After a swing, the first arrival in the hinted hall within 30 s (or at
// once when it is the current hall, e.g. S09) emits 'hint:arrive' once; the motion-hint owner plays it. No text.
import { HINT_ORDER, TIME_GATED, secretById } from '../secrets/registry.js';
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { loop } from '../core/loop.js';
import { state } from '../core/state.js';
import { TIMING } from '../core/tokens.js';

let ctx = null, pending = null;
const found = (id) => !!(state.data && state.data.found && state.data.found[id]);

function arrive(room) {
  const p = pending;
  if (!p || loop.now - p.at > TIMING.hintArriveWindow) { pending = null; return; }
  if (p.room !== room) return;
  pending = null;
  bus.emit('hint:arrive', { secret: p.secret, room, source: 'hint' });   // H22: source (additive)
}

export const hint = {
  /** H22 (ARCH-ADDENDUM X§2.4.4): replays a motion hint WITHOUT touching app.hintTarget ('sbor' → WP5's ghost ring). */
  playMotion(id, opts = { source: 'show' }) {
    bus.emit('hint:arrive', { secret: id, room: app.room, source: (opts && opts.source) || 'show' });
  },
  init(c) {
    ctx = c;
    c.hint = hint;
    bus.on('room:arrive', (e) => arrive(e.room));
    return hint;
  },

  /** → { secret, room, kind: 'secret' | 'time' | 'done' } */
  target() {
    for (const id of HINT_ORDER) {
      if (found(id)) continue;
      const s = secretById(id);
      let room = s.hintRoom;
      if (room === 'CURRENT') room = app.room;
      return { secret: id, room, kind: 'secret' };
    }
    if (TIME_GATED.some((id) => !found(id))) return { secret: null, room: null, kind: 'time' };
    return { secret: null, room: null, kind: 'done' };
  },

  swing() {
    const t = hint.target();
    const kn = ctx && ctx.keyNav;
    let row = 3;
    if (t.kind === 'secret') row = t.room === 'ZENITH' ? -1 : Math.max(0, ROOM_ORDER.indexOf(t.room === 'WORKSHOP' ? 'MEMBERS' : t.room));
    if (kn && kn.swingTo) kn.swingTo(row);
    if (t.kind !== 'secret' && ctx.status) ctx.status.say(t.kind === 'time' ? 'hint.time' : 'hint.done');
    app.hintTarget = { secret: t.secret, room: t.room, at: loop.now };
    bus.emit('hint:swing', { secret: t.secret, room: t.room });
    pending = t.kind === 'secret' && ROOMS[t.room] ? { secret: t.secret, room: t.room, at: loop.now } : null;
    // The hinted hall is the current one (e.g. S09 → CURRENT): the motion hint plays right after the swing.
    if (pending && pending.room === app.room && !(ctx.director && ctx.director.busy())) setTimeout(() => arrive(app.room), 0);
    return t;
  },
};
