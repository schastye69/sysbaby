// secrets/shardFlight.js — WP10 SEED (ARCH §3.14.2, §6.1.5): no visual yet; resolves on the next frame.
// WP10 replaces it with the 900 ms electrum tetra flight (quadratic Bézier, control 30 % above the midpoint).
/** → Promise<void> */
export function flyShard(id, from, to) {
  void id; void from; void to;
  return new Promise((resolve) => { requestAnimationFrame(() => resolve()); });
}

/** H28e (ARCH-ADDENDUM X§2.8.4): a mote flying from → to (quadratic Bézier, control 30 % above the midpoint) —
 *  the ПОТЕРЯШКА flight. WP10 SEED: no visual yet; resolves on the next frame. → Promise<void> */
export function flyMote(from, to, opts = { colour: 'ember', ms: 900, sizePx: 3 }) {
  void from; void to; void opts;
  return new Promise((resolve) => { requestAnimationFrame(() => resolve()); });
}
