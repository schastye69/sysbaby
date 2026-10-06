// nav/elevator.js — the hall elevator helper (ARCH §3.13.3, §6.1.6 A11; SPEC §5.2 wheel table, §10.1 vertical swipe).
// For SIGNAL, MEMBERS, INSIGNIA, NADIR, ZENITH (and the placeholder ARCHIVE).
//   Wheel: 360 px of deltaY per hall, the first 22 % of it resisting (counts half), a `tick` every 60 px, then
//          director.go(adjacent hall). The accumulator relaxes after 600 ms without wheel input.
//   Phone: a vertical swipe on empty space goes to the adjacent hall with vibrate(14).
// One direction convention everywhere (A11): deltaY > 0 / swipe up → the hall BELOW; deltaY < 0 / swipe down → ABOVE.
// Nothing happens below NADIR or above SIGNAL (the elevator never enters ZENITH); sealed NADIR shudders through the
// router guard (status 'sealed').
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { LAYOUT } from '../core/tokens.js';

/** The hall above (dir −1) or below (dir +1) a room by stratum; null past the ends. WORKSHOP counts as MEMBERS,
 *  ZENITH sits above SIGNAL. */
export function adjacentRoom(room, dir) {
  if (room === 'ZENITH') return dir > 0 ? 'SIGNAL' : null;
  const r = room === 'WORKSHOP' ? 'MEMBERS' : room;
  const k = ROOM_ORDER.indexOf(r);
  if (k < 0) return null;
  const n = k + (dir > 0 ? 1 : -1);
  return n >= 0 && n < ROOM_ORDER.length ? ROOM_ORDER[n] : null;
}

/** @returns {{ onWheel(g):boolean, onSwipe(g):boolean, reset():void }} */
export function createElevator(hctx) {
  const E = LAYOUT.elevator;
  let acc = 0, lastT = -1e9, ticks = 0;

  function go(dir) {
    const to = adjacentRoom(hctx.id, dir);
    acc = 0; ticks = 0;
    if (!to) return false;
    hctx.director.go(`#/${ROOMS[to].slug}`, { source: 'hall' });
    return true;
  }

  return {
    onWheel(g) {
      const now = hctx.loop.now;
      if (now - lastT > 600) { acc = 0; ticks = 0; }
      lastT = now;
      const d = g.deltaY || 0;
      if (!d) return true;
      if (acc !== 0 && Math.sign(d) !== Math.sign(acc)) { acc = 0; ticks = 0; }
      if (!adjacentRoom(hctx.id, Math.sign(d))) return true;               // the end of the building: nothing
      const resist = Math.abs(acc) < E.resistance * E.pxPerHall ? 0.5 : 1;
      acc += d * resist;
      const t = Math.floor(Math.abs(acc) / E.tickPx);
      if (t > ticks) { ticks = t; if (hctx.audio) hctx.audio.play('tick', {}); }
      if (Math.abs(acc) >= E.pxPerHall) go(Math.sign(acc));
      return true;
    },
    onSwipe(g) {
      if (g.dir !== 'up' && g.dir !== 'down') return false;
      const dir = g.dir === 'up' ? 1 : -1;
      if (!adjacentRoom(hctx.id, dir)) return false;
      vibrate(VIBE.lock);
      return go(dir);
    },
    reset() { acc = 0; ticks = 0; lastT = -1e9; },
  };
}
