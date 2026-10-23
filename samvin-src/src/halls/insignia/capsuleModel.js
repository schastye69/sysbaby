// halls/insignia/capsuleModel.js — WP9: the time capsule's model (ARCH §3.19, §4.3.8; SPEC §6.6, §8.1 S12; SPEC-ADDENDUM
// A3.3: WP13 earns `wait` on capsule:open). The capsule opens at firstVisit + capsule.openAfterDays·86 400 000 ms (no
// firstVisit yet → counted from now). Pure reads + one idempotent opener; the INSIGNIA hall runs the picture.
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

/** → boolean newly opened (persists, status 'capsule.open', discover S12, 'capsule:open'); false if not due or opened.
 *  opts.anchor: where the S12 shard leaves from (render-space Vector3 or {x, y} CSS px; default the viewport centre). */
export function openCapsule(opts = {}) {
  const info = capsuleInfo();
  if (!info.open || info.opened || !state.data) return false;
  state.set('capsuleOpened', true);
  status.say('capsule.open');
  secrets.discover('S12', opts && opts.anchor ? { anchor: opts.anchor } : {});
  bus.emit('capsule:open', {});
  return true;
}
