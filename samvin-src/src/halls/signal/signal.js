// halls/signal/signal.js — WP8 SEED (ARCH §3.7.5, §6.1.5): the placeholder hall with 'sky' props until WP8 replaces this file.
// WP8 keeps the factory name and signature (registry.js imports it).
import { createPlaceholderHall } from '../placeholder.js';

/** @returns {Hall} */
export function createSignalHall(hctx) {
  return createPlaceholderHall(hctx, { props: 'sky' });
}
