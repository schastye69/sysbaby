// secrets/secrets.js — discovery (ARCH §3.14.2, SPEC §8.0–§8.2). Call discover() on EVERY trigger: the payoff (owned
// by the trigger's WP) replays every time; the shard flies only on the first discovery.
// First discovery: persist found[id] (ISO) + foundVars[id]; emit 'secret:found'; await flyShard(from → the next empty N
// slot, or the I letter once NADIR is open / all 5 slots are full); on landing: shards += 1 (while < 5 and sealed),
// slots refresh, 'shard' sound, vibrate, BR relock, status 'found' then 'shard' {k}; 'shard:landed'; the rank check
// ('rank:change' + status 'rank' + audio.setRank); the 5th shard unseals NADIR (status 'shard' {k:5}, await
// ctx.fx.pieces.nadirUnseal() (H25), nadirOpen, LEAD «Внизу что-то открылось.» 3,000 ms, keyNav.crack(), status
// 'nadir.open', 'nadir:open').
// The DOM pieces are reached through ctx (keyNav, chrome, lead, status), each guarded, so T0 and early boot work too.
import { SECRETS, secretById } from './registry.js';
import { flyShard } from './shardFlight.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { layout } from '../core/layout.js';
import { audio } from '../audio/engine.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { rig } from '../render/cameraRig.js';

let ctx = null;
const _p = { x: 0, y: 0, depth: 0, visible: false };
const has = (o, m) => o && typeof o[m] === 'function';

/** {x,y} CSS px from an anchor ({x,y} | render-space Vector3 | null → viewport centre). */
function screenOf(anchor) {
  if (anchor && anchor.isVector3 && rig.camera) { rig.project(anchor, _p); return { x: _p.x, y: _p.y }; }
  if (anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) return { x: anchor.x, y: anchor.y };
  return { x: layout.w / 2, y: layout.h / 2 };
}

function say(key, vars) { const s = ctx && ctx.status; if (has(s, 'say')) s.say(key, vars || {}); }

async function land(id, from) {
  const d = state.data;
  const kn = ctx && ctx.keyNav;
  const sealedSlot = d.shards < 5 && !d.nadirOpen;
  const to = sealedSlot && has(kn, 'slotPoint') ? kn.slotPoint(d.shards)
    : has(kn, 'letterPoint') ? kn.letterPoint('I') : { x: layout.w / 2, y: layout.h / 2 };
  const before = state.rank().index;
  try { await flyShard(id, from, to); } catch (e) { /* the flight is cosmetic */ }
  if (sealedSlot) state.patch((dd) => { dd.shards = Math.min(5, (dd.shards | 0) + 1); });
  if (has(kn, 'refreshSlots')) kn.refreshSlots();
  audio.play('shard', {});
  vibrate(VIBE.shard);
  if (ctx && has(ctx.chrome, 'relockFound')) ctx.chrome.relockFound();
  say('found');
  if (sealedSlot && d.shards < 5) say('shard', { k: d.shards });
  bus.emit('shard:landed', { id, k: d.shards, count: secrets.count() });
  const r = state.rank();
  if (r.index > before) {
    bus.emit('rank:change', { rank: r.name, index: r.index });
    say('rank', { rank: r.name.toLocaleLowerCase('ru') });      // the status copy is lowercase (SPEC §2.2 STATUS)
    if (has(audio, 'setRank')) audio.setRank(r.index);
  }
  if (sealedSlot && d.shards >= 5 && !d.nadirOpen) {
    // H25 (ARCH-ADDENDUM X§2.4.7): slot 5 + 'shard' sound are done; status, then the ИСТОК unseal FX (WP12; resolves on
    // the hit frame — the seed at once), then the opening itself.
    say('shard', { k: 5 });
    const pieces = ctx && ctx.fx && ctx.fx.pieces;
    if (has(pieces, 'nadirUnseal')) { try { await pieces.nadirUnseal(); } catch (e) { /* the FX is cosmetic */ } }
    if (state.data.nadirOpen) return;
    state.set('nadirOpen', true);
    if (ctx && has(ctx.lead, 'show')) ctx.lead.show('Внизу что-то открылось.', { ms: 3000 });
    if (has(kn, 'crack')) kn.crack();
    say('nadir.open');
    bus.emit('nadir:open', {});
  }
}

export const secrets = {
  init(c) { ctx = c; c.secrets = secrets; return secrets; },

  /** @returns {boolean} true on the first discovery */
  discover(id, opts = {}) {
    if (!secretById(id) || !state.data) return false;
    if (secrets.isFound(id)) return false;
    const vars = opts && opts.vars ? { ...opts.vars } : {};
    state.patch((d) => {
      d.found[id] = new Date(Date.now()).toISOString();
      if (!d.foundVars || typeof d.foundVars !== 'object') d.foundVars = {};
      d.foundVars[id] = vars;
    });
    const anchor = screenOf(opts && opts.anchor);
    bus.emit('secret:found', { id, anchor });
    land(id, anchor);
    return true;
  },
  isFound(id) { return !!(state.data && state.data.found && state.data.found[id]); },
  /** → SecretId[] in S01…S14 order */
  found() { return SECRETS.filter((s) => secrets.isFound(s.id)).map((s) => s.id); },
  count() { return secrets.found().length; },
  /** → { name, index } (SPEC §8.2) */
  rank() { return state.rank(); },
  /** N slots filled (0..5) */
  get shards() { return state.data ? state.data.shards | 0 : 0; },
};
