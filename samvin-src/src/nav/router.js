// nav/router.js — MINIMAL placeholder written by WP0 stage 0A (core/loop.js needs titleFor on 'visible').
// Stage 0C completes it per ARCH §3.16 (parse/canonicalise, aliases, guards with status/shudder, titles via ROOMS,
// owner suffix). Signatures are final; parseHash/routeHash/titleFor already follow §3.16 for the plain cases.
import { WORLD } from '../data/world.js';
import { app } from '../core/store.js';
import { upper } from '../core/ru.js';

export const ALIASES = { clan: 'members', crew: 'members', missions: 'voyages', vault: 'insignia', legends: 'archive' };
const SLUG = { core: 'CORE', signal: 'SIGNAL', archive: 'ARCHIVE', members: 'MEMBERS', voyages: 'VOYAGES',
  insignia: 'INSIGNIA', nadir: 'NADIR', zenith: 'ZENITH', workshop: 'WORKSHOP' };
const NAME = { SIGNAL: 'Связь', ARCHIVE: 'Летопись', MEMBERS: 'Клан', VOYAGES: 'Вылазки', INSIGNIA: 'Хранилище',
  NADIR: 'Запечатано', ZENITH: 'Над всем', WORKSHOP: 'Мастерская' };
const WITH_SUB = new Set(['members', 'voyages', 'archive', 'insignia']);

/** → Route { room, sub, hash } (canonical hash) */
export function parseHash(hash) {
  const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  let slug = (parts[0] || 'core').toLowerCase();
  if (ALIASES[slug]) slug = ALIASES[slug];
  let sub = parts[1] ? decodeURIComponent(parts[1]) : null;
  if (slug === 'members' && sub && sub.toLowerCase() === 'workshop') return route('WORKSHOP', null);
  if (slug === 'core') return route('CORE', sub === 'open' ? 'open' : null);
  if (!SLUG[slug] || slug === 'workshop') return route('CORE', null);
  if (!WITH_SUB.has(slug)) sub = null;
  return route(SLUG[slug], sub);
}

function route(room, sub) { const r = { room, sub, hash: '' }; r.hash = routeHash(r); return r; }

/** → '#/members/lev' */
export function routeHash(r) {
  if (r.room === 'WORKSHOP') return '#/members/workshop';
  const slug = Object.keys(SLUG).find((k) => SLUG[k] === r.room) || 'core';
  return `#/${slug}${r.sub ? '/' + r.sub : ''}`;
}

/** Placeholder: no guards yet (0C implements NADIR/ZENITH/WORKSHOP). */
export function applyGuards(r, source) { void source; return { route: r }; }

/** 'SAM.VIN' in CORE (owner: 'SAM.VIN · СЭМ'), else 'SAM.VIN · Клан' … (SAM.VIN = WORLD.clan.name) */
export function titleFor(r) {
  const clan = WORLD.clan.name;
  const room = r && r.room ? r.room : 'CORE';
  if (room === 'CORE') return app.owner ? `${clan} · ${upper(WORLD.operator.name)}` : clan;
  return `${clan} · ${NAME[room] || ''}`;
}
