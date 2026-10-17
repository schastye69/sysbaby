// core/store.js — `app`, the live app state (ARCH §3.11.1). One plain object; each field has exactly one writer
// (see the ARCH table); everyone may read. The test hook reads from here.
import { bus } from './bus.js';

/** @typedef {{ room:string, sub:string|null, hash:string }} Route */

export const app = {
  /** 'boot'|'start'|'idle'|'transition'|'unfolded'|'resonance'|'pull' — written only through setPhase() */
  phase: 'boot',
  /** RoomId — director */
  room: 'CORE',
  /** Route — director (last completed route) */
  route: { room: 'CORE', sub: null, hash: '#/core' },
  /** transition u (0 when idle) — director */
  u: 0,
  /** 'T0'…'T3' — quality */
  tier: 'T2',
  /** audio */
  soundOn: true,
  /** WP0 at boot (step 3), then WP10 */
  night: false,
  drowsy: false,
  /** WP0 at boot */
  birthday: false,
  /** WP0 at boot from state.data.owner, then WP10 */
  owner: false,
  /** WP0 at boot from state.data.inverted, then WP10 */
  inverted: false,
  /** WP4 */
  unfolded: false,
  pullNest: 0,
  resonancePct: 0,
  /** WP0 status — current status text */
  status: '',
  /** WP5 — column heights in m; [] when MEMBERS was never built */
  columns: [],
  /** WP1 — drawing satellites orbiting the Key */
  satellites: 0,
  /** WP10 */
  companion: false,
  /** WP2 — true until boot:done */
  booting: true,
  /** WP0 hint — { secret, room, at } | null */
  hintTarget: null,
  /** H12 (ARCH-ADDENDUM X§2.9.2): WP13 ПОКАЗ mirror */
  show: { active: false, scene: -1 },
  /** H12: WP13 — guest COUNT only (names live in WP13 memory) */
  guests: 0,
  /** H12: WP12 — the current stage lock */
  fx: { stage: null },
};

/** Writes app.phase and emits 'phase:change' {phase, prev} only when it changes. */
export function setPhase(p) {
  const prev = app.phase;
  if (p === prev) return;
  app.phase = p;
  bus.emit('phase:change', { phase: p, prev });
}
