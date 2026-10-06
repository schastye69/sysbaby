// host/index.js — initHost(ctx): ctx.deeds + ctx.host (ARCH-ADDENDUM X§2.6; SPEC-ADDENDUM A3–A5, A11.4). OWNER: WP13.
// WP0 SEED (hook H28b): the exact X§2.6 surface with inert members — no ГОСТИ sheet, no ПОКАЗ, no СБОР timeline, no
// ПОТЕРЯШКА (and no pair day), no ПРЕДЛОЖЕНИЕ sheet. ctx.deeds is the seed of deeds.js (real persistence + derive()).
// Registers the seed values of the hook fields WP13 owns: deeds, code, show, guests, lost, sbor, proposals.
import { createDeeds } from '../deeds/deeds.js';
import { STRATUM_SIGN } from '../deeds/deedsModel.js';
import { registerHookField } from '../core/testhook.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';

export function initHost(ctx) {
  ctx.deeds = createDeeds(ctx);
  ctx.host = {
    guests: { active: false, list: () => [], isHere: () => false, open() {}, clear() {}, letterHeightM: () => 38 },
    show: { active: false, scene: -1, start() {}, next() {}, prev() {}, exit() {} },
    sbor: { attach() {}, holdProgress() {}, holdCancel() {}, holdComplete: () => Promise.resolve(), toggleHere() {}, info: () => ({ count: 0, last: null, hint: true }) },
    lost: { today: () => null, blocksDrone: () => false, snapshot: () => null, setView() {} },
    proposals: { list: () => [], openSheet() {}, add: (title, text, where) => { void title; void text; void where; return null; }, remove() {}, promoteFromWorld() {}, proposedByName: () => null },
  };
  try { ctx.deeds.derive(); } catch (e) { /* a broken profile never blocks the boot */ }
  ctx.host.proposals.promoteFromWorld();

  const d = () => state.data || {};
  registerHookField('deeds', () => Object.keys(d().deeds || {}).filter((k) => typeof d().deeds[k] === 'string'));
  registerHookField('code', () => STRATUM_SIGN.filter((s) => d().code && typeof d().code[s] === 'string'));
  registerHookField('show', () => ({ active: !!app.show.active, scene: app.show.scene }));
  registerHookField('guests', () => app.guests | 0);
  registerHookField('sbor', () => ({ count: (d().sbor && d().sbor.count) | 0 }));
  registerHookField('proposals', () => (Array.isArray(d().proposals) ? d().proposals.length : 0));
  registerHookField('lost', () => ctx.host.lost.snapshot());
}
