// halls/signal/dial.js — WP8 SEED, functionally correct (ARCH §3.19, §6.1.5; SPEC §6.5 dial, S11).
import { WORLD } from '../../data/world.js';

/** Static amount of the frequency dial: clamp(|f − F| / 8, 0, 1), F = WORLD.clan.frequency. */
export function dialStatic(f) {
  const F = WORLD.clan.frequency;
  return Math.max(0, Math.min(1, Math.abs(f - F) / 8));
}

/** → { feed(f, dtMs) } — fires onLock once per hold when f stays within ±0.05 of F for 600 ms; re-arms after
 *  leaving the ±0.05 window. */
export function createDialLock(onLock) {
  let held = 0, fired = false;
  return {
    feed(f, dtMs) {
      const inside = Math.abs(f - WORLD.clan.frequency) <= 0.05;
      if (!inside) { held = 0; fired = false; return false; }
      held += Math.max(0, dtMs || 0);
      if (!fired && held >= 600) { fired = true; if (typeof onLock === 'function') onLock(f); return true; }
      return false;
    },
  };
}
