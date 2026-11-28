// nav/router.js — routes, aliases, guards, titles (ARCH §3.16, SPEC §5.3). Pure apart from reading `state`/`app`.
// History itself (pushState / replaceState / popstate / hashchange) lives in the director (ARCH §3.6.2 step 7).
//
// Canonical hashes: '#/core', '#/core/open', '#/signal', '#/archive[/<id>]', '#/members[/<id>]', '#/members/workshop',
// '#/voyages[/<code>]', '#/insignia[/<id>]', '#/nadir', '#/zenith'. Aliases apply to the first segment (also with a sub).
// Slugs are case-insensitive; anything unknown → CORE.
import { WORLD } from '../data/world.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { upper } from '../core/ru.js';
import { ROOMS, roomBySlug } from '../world/rooms.js';

/** @typedef {{ hash:string, room:string, sub:string|null }} Route */

export const ALIASES = Object.freeze({ clan: 'members', crew: 'members', missions: 'voyages', vault: 'insignia', legends: 'archive' });

/** Rooms whose routes may carry a sub (CORE only knows 'open'). */
const WITH_SUB = new Set(['MEMBERS', 'VOYAGES', 'ARCHIVE', 'INSIGNIA']);

function decode(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

function make(room, sub) {
  const r = { hash: '', room, sub: sub == null || sub === '' ? null : sub };
  r.hash = routeHash(r);
  return r;
}

/** '#/members/lev' (or a Route) → Route with the canonical hash. Never throws. */
export function parseHash(hash) {
  if (hash && typeof hash === 'object' && hash.room) return make(ROOMS[hash.room] ? hash.room : 'CORE', hash.sub || null);
  const raw = String(hash == null ? '' : hash).trim();
  const parts = raw.replace(/^#?\/?/, '').split(/[/?]/).filter(Boolean);
  let slug = (parts[0] || 'core').toLowerCase();
  if (ALIASES[slug]) slug = ALIASES[slug];
  const meta = roomBySlug(slug);
  // WORKSHOP is only reachable as '#/members/workshop'; '#/workshop' is unknown.
  if (!meta || meta.id === 'WORKSHOP') return make('CORE', null);
  const sub = parts[1] ? decode(parts[1]) : null;
  if (meta.id === 'MEMBERS' && sub && sub.toLowerCase() === 'workshop') return make('WORKSHOP', null);
  if (meta.id === 'CORE') return make('CORE', sub && sub.toLowerCase() === 'open' ? 'open' : null);
  return make(meta.id, WITH_SUB.has(meta.id) ? sub : null);
}

/** Route → '#/members/lev' (canonical). */
export function routeHash(route) {
  const room = route && ROOMS[route.room] ? route.room : 'CORE';
  if (room === 'WORKSHOP') return '#/members/workshop';
  const sub = route.sub;
  const keep = sub != null && sub !== '' && (WITH_SUB.has(room) || (room === 'CORE' && sub === 'open'));
  return `#/${ROOMS[room].slug}${keep ? '/' + encodeURIComponent(String(sub)) : ''}`;
}

const isFound = (id) => !!(state.data && state.data.found && state.data.found[id]);

/** @returns {{ route:Route, status?:string, vars?:Object, shudder?:'N' }} */
export function applyGuards(route, source) {
  const r = route && route.room ? route : parseHash(route);
  const d = state.data || {};
  if (r.room === 'NADIR' && !d.nadirOpen) {
    return { route: make('CORE', null), status: 'sealed', vars: { k: d.shards | 0 }, shudder: 'N' };
  }
  if (r.room === 'ZENITH' && !isFound('S13') && source !== 'overpull') {
    return { route: make('CORE', null), status: 'route.missing', vars: {} };
  }
  if (r.room === 'WORKSHOP' && !isFound('S06') && source !== 'hall') {
    return { route: make('MEMBERS', WORLD.operator.id || null) };
  }
  return { route: r };
}

/** 'SAM.VIN' in CORE (owner: 'SAM.VIN · СЭМ'); 'SAM.VIN · Клан' elsewhere (NADIR: 'Исток' once open). */
export function titleFor(route) {
  const clan = WORLD.clan.name;
  const room = route && ROOMS[route.room] ? route.room : 'CORE';
  if (room === 'CORE') return app.owner ? `${clan} · ${upper(WORLD.operator.name)}` : clan;
  const meta = ROOMS[room];
  const name = room === 'NADIR' && state.data && state.data.nadirOpen && meta.nameOpen ? meta.nameOpen : meta.name;
  return `${clan} · ${name}`;
}
