// deeds/deeds.js — ctx.deeds (ARCH-ADDENDUM X§2.6.1; SPEC-ADDENDUM A3.3, A11.3). OWNER: WP13.
// WP0 SEED (hook H28b): done(id) persists deeds[id] and, when the deed has a stratum and a non-empty law, code[sign], and
// emits deed:done / code:earned — no status, no ceremony (WP13 adds 'code.new', the КОДЕКС ceremony on stage 'codex'
// and the drag-to-read leaders). derive() is real (A3.3 boot rules). law / earned / bands delegate to deedsModel.
// The seed also listens to the deed sources WP13 owns (rope ← S04, wait ← capsule:open, finish ← probe:read).
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { daysBetween } from '../core/time.js';
import { DEED_IDS, DEED_STRATUM, STRATUM_SIGN, lawOf, earnedStrata, deedBands } from './deedsModel.js';
import { WORLD } from '../data/world.js';

/** @returns {Deeds} */
export function createDeeds(ctx) {
  void ctx;
  const deeds = {
    /** → true if newly earned */
    done(id, opts = {}) {
      if (!DEED_IDS.includes(id) || !state.data) return false;
      const d = state.data;
      if (!d.deeds || typeof d.deeds !== 'object') d.deeds = {};
      if (typeof d.deeds[id] === 'string') return false;
      const at = opts && typeof opts.at === 'string' ? opts.at : new Date().toISOString();
      state.patch((dd) => { dd.deeds[id] = at; });
      bus.emit('deed:done', { id });
      const i = DEED_STRATUM[id];
      if (i == null) return true;                                  // 'gentle': no stratum, no law (A11.3)
      const text = (WORLD.clan.code || [])[i];
      if (!text) return true;                                      // the parent hid this law: deed stored, no law
      const sign = STRATUM_SIGN[i];
      if (!d.code || typeof d.code !== 'object') d.code = {};
      if (typeof d.code[sign] !== 'string') {
        state.patch((dd) => { dd.code[sign] = at; });
        bus.emit('code:earned', { stratum: i });
      }
      return true;
    },
    /** Boot (A3.3): S04 found → rope; capsuleOpened → wait; probes[c].back && probes[c].read → finish. */
    derive() {
      const d = state.data;
      if (!d) return;
      if (d.found && typeof d.found.S04 === 'string') deeds.done('rope');
      if (d.capsuleOpened === true) deeds.done('wait');
      const probes = d.probes || {};
      for (const c of Object.keys(probes)) { const p = probes[c]; if (p && p.back && p.read === true) { deeds.done('finish'); break; } }
    },
    law: (i) => lawOf(i),
    earned: () => earnedStrata(),
    bands: () => deedBands(),
    /** T0 (WP11) installs its SVG view; null restores the Key view. Seed: no ceremony, nothing to view. */
    setView(view) { void view; },
  };

  // Deed sources (X§2.6.1).
  bus.on('secret:found', (e) => { if (e && e.id === 'S04') deeds.done('rope'); });
  bus.on('capsule:open', () => deeds.done('wait'));
  bus.on('probe:read', (e) => {
    const p = e && state.data && state.data.probes ? state.data.probes[e.code] : null;
    if (p && p.back && typeof p.sent === 'string' && daysBetween(p.sent, state.today) > 0) deeds.done('finish');
  });
  return deeds;
}
