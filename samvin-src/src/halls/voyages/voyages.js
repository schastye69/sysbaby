// halls/voyages/voyages.js — WP6 SEED (ARCH §3.7.5, §6.1.5): the placeholder hall with 'hatches' props until WP6 replaces this file.
// WP6 keeps the factory name and signature (registry.js imports it).
import { createPlaceholderHall } from '../placeholder.js';

/** @returns {Hall} */
export function createVoyagesHall(hctx) {
  return createPlaceholderHall(hctx, { props: 'hatches' });
}
