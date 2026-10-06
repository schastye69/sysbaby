// audio/prerender.js — buffers rendered once with OfflineAudioContext (ARCH-ADDENDUM X§2.3.4; SPEC-ADDENDUM A6.2).
// OWNER: WP3. WP0 SEED (hook H8): no-op — resolves at once and fills nothing.

export const PRERENDER_ORDER = ['dustA', 'bellSam', 'bellVin', 'rev.sam', 'rev.vin', 'rev.lock', 'rev.thud', 'digiTail', 'irTight', 'dustB'];

/** Fills E.buf[name] (A6.2 exact content); T1: only 'dustA'. → Promise<void> */
export function prerender(E, names) {
  void E; void names;
  return Promise.resolve();
}
