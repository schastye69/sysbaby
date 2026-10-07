// halls/archive/archive.js — WP7 SEED (ARCH §3.7.5, §6.1.5): the placeholder hall with 'bands' props until WP7 replaces this file.
// WP7 keeps the factory name and signature (registry.js imports it).
import { createPlaceholderHall } from '../placeholder.js';

/** @returns {Hall} */
export function createArchiveHall(hctx) {
  return createPlaceholderHall(hctx, { props: 'bands' });
}
