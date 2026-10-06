// core/state.js — persistence in localStorage["samvin.v1"] (ARCH §3.11.2, SPEC §8.5) + derived session facts.
// Every storage access is inside try/catch; blocked storage → in-memory state for the session (storageOk = false) and
// everything still works. Unknown fields are preserved on write. Writes are debounced 500 ms and flushed on pagehide
// (and on hidden, by core/loop.js).
import { logOnce } from './env.js';
import { dayKey, daysBetween } from './time.js';
import { bondOf, shrpOf } from './tokens.js';
import { WORLD } from '../data/world.js';
import { sigilNodes } from '../key/litNodes.js';

const KEY = 'samvin.v1';
const SESSION_KEY = 'samvin.session';
const MAX_DAYS = 400;
const SECRET_ID = /^S(0[1-9]|1[0-4])$/;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStrArr = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Defaults for every StateData field (a fresh object each call). */
function defaults() {
  return {
    v: 1, firstVisit: null, lastVisit: null, days: [], found: {}, shards: 0, nadirOpen: false, owner: false, glyph: null,
    drawings: [], jokesFound: [], drones: { day: null, count: 0, arrivals: 0 }, resonanceNext: 0, maxNest: 0,
    transmissions: { delivered: 0, read: [], lastDay: null }, probes: {}, decoded: [], capsuleOpened: false,
    companionArrived: false, whaleSeen: false, inverted: false, sound: 'on', tier: null, lastRoom: '#/core',
    firstDive: false, firstUnfold: false, whaleDay: null, birthdayLeadDay: null, foundVars: {},
  };
}

/** Field validators: a loaded value that fails takes the default (unknown fields are kept untouched). */
const CHECK = {
  v: (x) => x === 1,
  firstVisit: (x) => x === null || (typeof x === 'string' && Number.isFinite(Date.parse(x))),
  lastVisit: (x) => x === null || (typeof x === 'string' && Number.isFinite(Date.parse(x))),
  days: (x) => isStrArr(x),
  found: (x) => isObj(x),
  shards: (x) => Number.isInteger(x) && x >= 0 && x <= 5,
  nadirOpen: (x) => typeof x === 'boolean',
  owner: (x) => typeof x === 'boolean',
  glyph: (x) => x === null || Array.isArray(x),
  drawings: (x) => Array.isArray(x),
  jokesFound: (x) => isStrArr(x),
  drones: (x) => isObj(x),
  resonanceNext: (x) => Number.isInteger(x) && x >= 0,
  maxNest: (x) => typeof x === 'number' && Number.isFinite(x),
  transmissions: (x) => isObj(x),
  probes: (x) => isObj(x),
  decoded: (x) => isStrArr(x),
  capsuleOpened: (x) => typeof x === 'boolean',
  companionArrived: (x) => typeof x === 'boolean',
  whaleSeen: (x) => typeof x === 'boolean',
  inverted: (x) => typeof x === 'boolean',
  sound: (x) => x === 'on' || x === 'off',
  tier: (x) => x === null || x === 'T1' || x === 'T2' || x === 'T3',
  lastRoom: (x) => typeof x === 'string' && x.startsWith('#'),
  firstDive: (x) => typeof x === 'boolean',
  firstUnfold: (x) => typeof x === 'boolean',
  whaleDay: (x) => x === null || typeof x === 'string',
  birthdayLeadDay: (x) => x === null || typeof x === 'string',
  foundVars: (x) => isObj(x),
};

function migrate(raw) {
  const d = isObj(raw) ? raw : {};
  const def = defaults();
  for (const k of Object.keys(def)) if (!(k in d) || !CHECK[k](d[k])) d[k] = def[k];
  // Nested shapes.
  const dr = d.drones;
  if (!(dr.day === null || typeof dr.day === 'string')) dr.day = null;
  if (!Number.isInteger(dr.count)) dr.count = 0;
  if (!Number.isInteger(dr.arrivals)) dr.arrivals = 0;
  const tr = d.transmissions;
  if (!Number.isInteger(tr.delivered) || tr.delivered < 0) tr.delivered = 0;
  if (!Array.isArray(tr.read)) tr.read = [];
  tr.read = tr.read.filter((i) => Number.isInteger(i) && i >= 0);
  if (!(tr.lastDay === null || typeof tr.lastDay === 'string')) tr.lastDay = null;
  for (const id of Object.keys(d.found)) if (!SECRET_ID.test(id) || typeof d.found[id] !== 'string') delete d.found[id];
  d.days = [...new Set(d.days.filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)))].sort();
  return d;
}

// ─── Storage access (always guarded) ──────────────────────────────────────────────────────────────────────────
function readStore() {
  try {
    const s = localStorage.getItem(KEY);
    if (s == null) return {};
    try { return JSON.parse(s); } catch (e) { if (__DEV__) logOnce('state:json', 'saved state unreadable — starting fresh'); return {}; }
  } catch (e) {
    state.storageOk = false;
    // An expected environment (private mode, blocked site data): silent in production (ARCH §7.5 allows no warn here).
    if (__DEV__) logOnce('state:storage', 'localStorage blocked — state lives in memory for this session');
    return {};
  }
}

let timer = 0;
let dirty = false;

/** Immediate write; also on 'pagehide' and when hidden. */
export function flush() {
  if (timer) { clearTimeout(timer); timer = 0; }
  if (!dirty || !state.data) return;
  dirty = false;
  if (!state.storageOk) return;
  try { localStorage.setItem(KEY, JSON.stringify(state.data)); } catch (e) {
    state.storageOk = false;
    if (__DEV__) logOnce('state:write', 'localStorage write failed — state lives in memory for this session');
  }
}

/** Debounced write (500 ms). */
export function saveSoon() {
  dirty = true;
  if (timer) return;
  try { timer = setTimeout(flush, 500); } catch (e) { flush(); }
}

// ─── The state object ─────────────────────────────────────────────────────────────────────────────────────────
let litCap = -1;   // sigilNodes(WORLD.clan.sigil).length, computed lazily (needs the Key geometry module)

export const state = {
  /** @type {Object|null} StateData (live; read freely; write only through set/patch) */
  data: null,
  storageOk: true,
  today: '',
  distinctDays: 1,
  isNewDay: false,
  returning: false,
  sameDaySession: false,
  daysAway: 0,
  bond: 0,
  shrp: 28,
  /** min(distinctDays, sigilNodes(WORLD.clan.sigil).length) — node k is lit when distinctDays ≥ k */
  get litNodes() {
    if (litCap < 0) {
      try { litCap = sigilNodes(WORLD.clan.sigil).length; } catch (e) { litCap = 0; logOnce('state:lit', e); }
    }
    return Math.min(state.distinctDays, litCap);
  },
  /** Shallow set + saveSoon(). */
  set(key, value) { state.data[key] = value; saveSoon(); },
  /** Mutate + saveSoon(). */
  patch(fn) { fn(state.data); saveSoon(); },
  /** Item 0 on the first visit, then one more per new distinct day (≤ list length). → number newly delivered. */
  deliverTransmissions() {
    const tr = state.data.transmissions;
    if (tr.lastDay === state.today) return 0;
    const len = WORLD.transmissions.length;
    const target = Math.min(len, Math.max(tr.delivered, state.distinctDays));
    const newly = Math.max(0, target - tr.delivered);
    tr.delivered = Math.max(tr.delivered, target);
    tr.lastDay = state.today;
    saveSoon();
    return newly;
  },
  markRead(index) {
    const tr = state.data.transmissions;
    if (!Number.isInteger(index) || index < 0 || tr.read.includes(index)) return;
    tr.read.push(index);
    saveSoon();
  },
  /** SPEC §8.2: НАБЛЮДАТЕЛЬ · ИССЛЕДОВАТЕЛЬ (≥3 secrets or ≥3 days) · СМОТРИТЕЛЬ (≥7 and ≥5) · АРХИТЕКТОР (≥12 and ≥14) */
  rank() {
    const s = Object.keys(state.data.found).filter((k) => SECRET_ID.test(k)).length;
    const d = state.distinctDays;
    if (s >= 12 && d >= 14) return { name: 'АРХИТЕКТОР', index: 3 };
    if (s >= 7 && d >= 5) return { name: 'СМОТРИТЕЛЬ', index: 2 };
    if (s >= 3 || d >= 3) return { name: 'ИССЛЕДОВАТЕЛЬ', index: 1 };
    return { name: 'НАБЛЮДАТЕЛЬ', index: 0 };
  },
};

/** Load, migrate, add today, compute derived fields, write the sessionStorage flag. */
export function initState(nowMs) {
  const t = Number.isFinite(nowMs) ? nowMs : Date.now();
  const d = migrate(readStore());
  state.data = d;
  state.today = dayKey(t);

  let newSession = true;
  try {
    newSession = sessionStorage.getItem(SESSION_KEY) == null;
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch (e) { newSession = true; }

  const prevFirst = d.firstVisit;
  const prevLastDay = d.lastVisit ? dayKey(Date.parse(d.lastVisit)) : null;
  state.returning = prevFirst != null && newSession;
  state.sameDaySession = state.returning && prevLastDay === state.today;
  state.daysAway = prevLastDay ? Math.max(0, daysBetween(prevLastDay, state.today)) : 0;

  state.isNewDay = !d.days.includes(state.today);
  if (state.isNewDay) {
    d.days.push(state.today);
    d.days.sort();
    while (d.days.length > MAX_DAYS) d.days.shift();
  }
  state.distinctDays = Math.max(1, d.days.length);

  const iso = new Date(t).toISOString();
  if (d.firstVisit == null) d.firstVisit = iso;
  d.lastVisit = iso;

  const secretsFound = Object.keys(d.found).length;
  state.bond = bondOf(state.distinctDays, secretsFound);
  state.shrp = shrpOf(state.distinctDays, secretsFound);

  dirty = true;
  flush();
  return state;
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
}
