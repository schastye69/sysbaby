// secrets/shardFlight.js — WP10 SEED (ARCH §3.14.2, §6.1.5): no visual yet; resolves on the next frame.
// WP10 replaces it with the 900 ms electrum tetra flight (quadratic Bézier, control 30 % above the midpoint).
/** → Promise<void> */
export function flyShard(id, from, to) {
  void id; void from; void to;
  return new Promise((resolve) => { requestAnimationFrame(() => resolve()); });
}
