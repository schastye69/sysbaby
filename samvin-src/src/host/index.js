// host/index.js — initHost(ctx): ctx.deeds + ctx.host (ARCH-ADDENDUM X§2.6; SPEC-ADDENDUM A3–A5, A11). OWNER: WP13.
// Bootstrap step 11a (right after initSecrets): ctx.deeds = createDeeds(ctx) (the КОДЕКС queue + the drag-to-read
// watcher inside), ctx.host = { guests, show, sbor, lost, proposals }; deeds.derive(); proposals.promoteFromWorld();
// the earned, already shown laws are restored on the Key; the TL verb ГОСТИ appears at boot:done; hook fields deeds,
// code, show, guests, lost, sbor, proposals. Dev builds also attach the placeholder-hall СБОР adapter (devAdapter.js).
import { createDeeds } from '../deeds/deeds.js';
import { STRATUM_SIGN } from '../deeds/deedsModel.js';
import { createSbor } from '../deeds/sbor.js';
import { createLost } from '../deeds/lost.js';
import { createProposals } from '../deeds/proposals.js';
import { registerHookField } from '../core/testhook.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { logOnce } from '../core/env.js';
import { createGuests } from './guests.js';
import { createShow } from './show.js';
import { installDevAdapter } from './devAdapter.js';

export function initHost(ctx) {
  const step = (name, fn, fallback) => { try { return fn(); } catch (e) { logOnce(`host:${name}`, e); return fallback; } };
  ctx.deeds = createDeeds(ctx);
  const guests = step('guests', () => createGuests(ctx), null);
  const proposals = step('proposals', () => createProposals(ctx), null);
  const sbor = step('sbor', () => createSbor(ctx, { deeds: ctx.deeds, guests }), null);
  const lost = step('lost', () => createLost(ctx, { deeds: ctx.deeds }), null);
  ctx.host = { guests, show: null, sbor, lost, proposals };
  ctx.host.show = step('show', () => createShow(ctx), null);
  try { ctx.deeds.derive(); } catch (e) { logOnce('host:derive', e); /* a broken profile never blocks the boot */ }
  if (proposals) step('promote', () => proposals.promoteFromWorld());
  step('laws', () => ctx.deeds.restoreLaws());

  // The TL verb (A1.3 §2.3): ГОСТИ on every device from the end of the first boot.
  const verb = () => {
    if (!ctx.chrome || !ctx.chrome.setTLVerb || !guests) return;
    ctx.chrome.setTLVerb({ label: 'ГОСТИ', qa: 'tl-guests', onActivate: () => guests.open('tl') }, { fadeMs: 0 });   // it arrives with the assembled corners
  };
  // from the end of the first boot: the boot's idle phase (≈ 7,200 ms) or boot:done, whichever comes first
  if (app.booting || app.phase === 'boot' || app.phase === 'start') {
    let shown = false;
    const once = () => { if (shown) return; shown = true; offA(); offB(); verb(); };
    const offA = ctx.bus.on('boot:done', once);
    const offB = ctx.bus.on('phase:change', (e) => { if (e && e.phase === 'idle') once(); });
  } else verb();

  const d = () => state.data || {};
  registerHookField('deeds', () => Object.keys(d().deeds || {}).filter((k) => typeof d().deeds[k] === 'string'));
  registerHookField('code', () => STRATUM_SIGN.filter((s) => d().code && typeof d().code[s] === 'string'));
  registerHookField('show', () => ({ active: !!app.show.active, scene: app.show.scene }));
  registerHookField('guests', () => app.guests | 0);
  registerHookField('sbor', () => ({ count: (d().sbor && d().sbor.count) | 0 }));
  registerHookField('proposals', () => (Array.isArray(d().proposals) ? d().proposals.length : 0));
  registerHookField('lost', () => (lost ? lost.snapshot() : null));

  if (__DEV__) step('dev', () => installDevAdapter(ctx));
}
