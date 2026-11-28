// deeds/deeds.js — ctx.deeds (ARCH-ADDENDUM X§2.6.1; SPEC-ADDENDUM A3.3, A3.5, A11.3). OWNER: WP13.
// done(id) persists deeds[id]; a deed with a stratum and a non-empty law also writes code[sign], says «новое правило
// клана.» (P1) and queues the КОДЕКС ceremony (stage 'codex', next idle CORE moment). `gentle` has no stratum (A11.3):
// it is stored and emits deed:done only. A law the parent hid ("") stores the deed, no law, no ceremony.
// derive() (boot, A3.3): S04 found → rope; capsuleOpened → wait; a probe with back && read → finish (no source for word).
// Deed sources WP13 listens to: rope ← secret:found {S04}; wait ← capsule:open; finish ← probe:read when the probe came
// back and the read day is later than the sent day (he kept the appointment). call/host/notice/gentle/word are earned
// by WP13's own mechanics (СБОР, ГОСТИ/ПОКАЗ, ПОТЕРЯШКА, ДОГОВОРИЛИСЬ).
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { daysBetween, dayKey } from '../core/time.js';
import { DEED_IDS, DEED_STRATUM, STRATUM_SIGN, lawOf, earnedStrata, deedBands } from './deedsModel.js';
import { WORLD } from '../data/world.js';
import { createCeremony } from './ceremony.js';
import { createCodexRead } from './codexRead.js';

const isIso = (x) => typeof x === 'string' && Number.isFinite(Date.parse(x));

/** @returns {Deeds} */
export function createDeeds(ctx) {
  const ceremony = createCeremony(ctx);
  const reader = createCodexRead(ctx, { ceremonyActive: () => ceremony.active });

  const deeds = {
    /** → true if newly earned */
    done(id, opts = {}) {
      if (!DEED_IDS.includes(id) || !state.data) return false;
      const d = state.data;
      if (!d.deeds || typeof d.deeds !== 'object') d.deeds = {};
      if (typeof d.deeds[id] === 'string') return false;
      const at = opts && isIso(opts.at) ? opts.at : new Date().toISOString();
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
        // the deed's MICRO name (ПОКАЗ earns • with «ПОКАЗ», A3.3 table) is part of the law record
        if (opts && opts.name) state.patch((dd) => { if (!dd.codeNames || typeof dd.codeNames !== 'object') dd.codeNames = {}; dd.codeNames[sign] = String(opts.name).slice(0, 16); });
        ceremony.announce(i);
        if (ctx.status) ctx.status.say('code.new');
        bus.emit('code:earned', { stratum: i });
      }
      return true;
    },
    /** Boot (A3.3): S04 found → rope; capsuleOpened → wait; probes[c].back && probes[c].read → finish. */
    derive() {
      const d = state.data;
      if (!d) return;
      if (d.found && isIso(d.found.S04)) deeds.done('rope', { at: d.found.S04 });
      if (d.capsuleOpened === true) deeds.done('wait');
      const probes = d.probes || {};
      for (const c of Object.keys(probes)) {
        const p = probes[c];
        if (p && p.back === true && p.read === true) { deeds.done('finish'); break; }
      }
    },
    law: (i) => lawOf(i),
    earned: () => earnedStrata(),
    bands: () => deedBands(),
    /** T0 (WP11) installs its SVG view; null restores the Key view. */
    setView(view) { ceremony.setView(view); },
    /** internal (ПОКАЗ ФИНАЛ): hold the earned laws' leaders while the Key shows its back */
    readHold(b) { reader.hold(b); },
    get ceremonyActive() { return ceremony.active; },
    restoreLaws() { ceremony.restore(); },
    requestCeremony() { ceremony.request(); },
  };

  // Deed sources (X§2.6.1).
  bus.on('secret:found', (e) => { if (e && e.id === 'S04') deeds.done('rope'); });
  bus.on('capsule:open', () => deeds.done('wait'));
  bus.on('probe:read', (e) => {
    const p = e && state.data && state.data.probes ? state.data.probes[e.code] : null;
    if (!p || p.back !== true) return;
    const sent = typeof p.sent === 'string' ? p.sent.slice(0, 10) : null;
    const today = state.today || dayKey();
    if (sent && daysBetween(sent, today) > 0) deeds.done('finish');
  });
  return deeds;
}
