// halls/members/members.js — WP5 SEED (ARCH §3.7.5, §6.1.5): the placeholder hall with 'columns' props until WP5 replaces this file.
// WP5 keeps the factory name and signature (registry.js imports it).
import { createPlaceholderHall } from '../placeholder.js';

/** @returns {Hall} */
export function createMembersHall(hctx) {
  return createPlaceholderHall(hctx, { props: 'columns' });
}
