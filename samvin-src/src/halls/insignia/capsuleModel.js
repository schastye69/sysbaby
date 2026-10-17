// halls/insignia/capsuleModel.js — WP9 SEED, functionally correct (ARCH §3.19, §4.3.8, §6.1.5; SPEC §6.6, S12).
// The capsule opens at firstVisit + capsule.openAfterDays·86 400 000 ms (no firstVisit yet → counted from now).
import { WORLD } from '../../data/world.js';
import { state } from '../../core/state.js';
import { bus } from '../../core/bus.js';
import { now } from '../../core/time.js';
import { status } from '../../ui/status.js';
import { secrets } from '../../secrets/secrets.js';

const DAY = 86400000, HOUR = 3600000;

/** → { open, opened, msLeft, d, h } (d, h = floors of the remaining time, for «Откроется через {d} д {h} ч.»). */
export function capsuleInfo() {
  const t = now();
  const first = state.data && state.data.firstVisit ? Date.parse(state.data.firstVisit) : NaN;
  const openAt = (Number.isFinite(first) ? first : t) + WORLD.capsule.openAfterDays * DAY;
  const msLeft = Math.max(0, openAt - t);
  return { open: msLeft === 0, opened: !!(state.data && state.data.capsuleOpened), msLeft, d: Math.floor(msLeft / DAY), h: Math.floor((msLeft % DAY) / HOUR) };
}

/** → boolean newly opened (persists, status 'capsule.open', discover S12, 'capsule:open'); false if not due or opened. */
export function openCapsule() {
  const info = capsuleInfo();
  if (!info.open || info.opened || !state.data) return false;
  state.set('capsuleOpened', true);
  status.say('capsule.open');
  secrets.discover('S12');
  bus.emit('capsule:open', {});
  return true;
}
