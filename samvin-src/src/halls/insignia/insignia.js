// halls/insignia/insignia.js — WP9 SEED (ARCH §3.7.5, §6.1.5): the placeholder hall with 'dome' props until WP9 replaces this file.
// WP9 keeps the factory name and signature (registry.js imports it).
import { createPlaceholderHall } from '../placeholder.js';

/** @returns {Hall} */
export function createInsigniaHall(hctx) {
  return createPlaceholderHall(hctx, { props: 'dome' });
}
