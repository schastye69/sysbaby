// data/world.js — the world data loader (ARCH §4.4). Reads window.SAMVIN_WORLD (the hand-edited samvin/world.js),
// validates it against DEFAULT_WORLD (§4.2 types, §4.3 schema), deep-freezes it and exports WORLD.
// No DOM access and no state access at module load. validateWorld is pure and never throws.
// Every other module reads world data only through WORLD and the lookup helpers below.
import { DEFAULT_WORLD } from './defaults.js';
import { normalizeGlyph } from '../core/glyph.js';
import { hashStr } from '../core/rng.js';
import { logOnce } from '../core/env.js';
import { fmtDate } from '../core/ru.js';
import { daysBetween } from '../core/time.js';
import { state } from '../core/state.js';
import { missionView, probeStatus } from '../halls/voyages/missionModel.js';

const KEYS = ['operator', 'clan', 'members', 'missions', 'achievements', 'legends', 'moments', 'jokes', 'transmissions',
  'signal', 'capsule', 'zenith', 'nadir', 'night', 'companion'];
const LIST_KEYS = { members: 12, missions: 24, achievements: 24, legends: 32, moments: 64, jokes: 64, transmissions: 400 };
const NOTE_NAMES = ['G2', 'A2', 'B2', 'D3', 'E3', 'G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4', 'B4', 'D5', 'E5', 'G5', 'A5', 'B5',
  'D6', 'E6', 'G6', 'A6', 'B6', 'D7'];
const MEMBER_NOTES = ['D4', 'G3', 'A3', 'B3', 'E4', 'G4', 'A4', 'B4', 'D5', 'E5', 'G5', 'A5'];
const SHAPES = ['stellated', 'twisted', 'nested', 'bipyramid', 'knot'];

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const has = (o, k) => o[k] !== undefined && o[k] !== null;   // null counts as missing (silent default)
const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));
const q = (v) => { try { return JSON.stringify(v).slice(0, 40); } catch (e) { return String(v); } };

// ─── §4.2 value types. Each returns { ok, v } and records issues through the `iss` callback. ────────────────────
function tText(raw, max, nonEmpty, path, iss) {
  if (typeof raw !== 'string' && !(typeof raw === 'number' && Number.isFinite(raw))) { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  let s = String(raw).normalize('NFC').trim().replace(/\s+/g, ' ');
  if (s === '' && nonEmpty) { iss(`${path}: empty`); return { ok: false }; }
  if (s.length > max) { s = s.slice(0, max - 1) + '…'; iss(`${path}: longer than ${max}, cut`); }
  return { ok: true, v: s };
}
function tId(raw, path, iss) {
  if (typeof raw !== 'string' && typeof raw !== 'number') { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  let s = String(raw).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!s) { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  if (s.length > 24) { s = s.slice(0, 24); iss(`${path}: longer than 24, cut`); }
  if (s !== String(raw)) iss(`${path}: ${q(raw)} → "${s}"`);
  return { ok: true, v: s };
}
function tCode(raw, path, iss) {
  if (typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 && raw <= 999) return { ok: true, v: String(raw).padStart(3, '0') };
  if (typeof raw === 'string' && /^\d{3}$/.test(raw.trim())) return { ok: true, v: raw.trim() };
  iss(`${path}: ${q(raw)} invalid`);
  return { ok: false };
}
function realDate(y, m, d) {
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1) return false;
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d <= dim;
}
function tDate(raw, path, iss) {
  if (typeof raw === 'string') {
    const s = raw.trim();
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m && realDate(+m[1], +m[2], +m[3])) return { ok: true, v: s };
    m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s);
    if (m && realDate(+m[3], +m[2], +m[1])) return { ok: true, v: `${m[3]}-${m[2]}-${m[1]}` };
  }
  iss(`${path}: ${q(raw)} invalid date`);
  return { ok: false };
}
function toNum(raw, comma) {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string' && raw.trim() !== '') return Number(comma ? raw.trim().replace(',', '.') : raw.trim());
  return NaN;
}
function tInt(raw, min, max, path, iss) {
  const n = toNum(raw, false);
  if (!Number.isFinite(n)) { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  let v = Math.round(n);
  if (v < min || v > max) { v = Math.min(max, Math.max(min, v)); iss(`${path}: ${q(raw)} clamped → ${v}`); }
  return { ok: true, v };
}
function tNum(raw, min, max, dp, path, iss) {
  const n = toNum(raw, true);
  if (!Number.isFinite(n)) { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  const f = Math.pow(10, dp);
  let v = Math.round(n * f) / f;
  if (v < min || v > max) { v = Math.min(max, Math.max(min, v)); iss(`${path}: ${q(raw)} clamped → ${v}`); }
  return { ok: true, v };
}
function tBool(raw, path, iss) {
  if (raw === true || raw === 1 || raw === 'true' || raw === 'да') return { ok: true, v: true };
  if (raw === false || raw === 0 || raw === 'false' || raw === 'нет') return { ok: true, v: false };
  iss(`${path}: ${q(raw)} invalid`);
  return { ok: false };
}
function tEnum(raw, values, path, iss) {
  if (typeof raw === 'string') { const s = raw.trim().toLowerCase(); if (values.includes(s)) return { ok: true, v: s }; }
  iss(`${path}: ${q(raw)} invalid`);
  return { ok: false };
}
function tGlyph(raw, path, iss) {
  if (!Array.isArray(raw)) { iss(`${path}: not a list`); return { ok: false }; }
  const g = normalizeGlyph(raw);
  if (g.length !== raw.length) iss(`${path}: ${raw.length - g.length} edge(s) dropped`);
  if (!g.length) return { ok: false };
  return { ok: true, v: g };
}
/** H10: Num(min, max, dp) that is NOT clamped: out of range → invalid (the caller's default) + issue. */
function tNumStrict(raw, min, max, dp, path, iss) {
  const n = toNum(raw, true);
  if (!Number.isFinite(n)) { iss(`${path}: ${q(raw)} invalid`); return { ok: false }; }
  const f = Math.pow(10, dp);
  const v = Math.round(n * f) / f;
  if (v < min || v > max) { iss(`${path}: ${q(raw)} out of range`); return { ok: false }; }
  return { ok: true, v };
}
const WHERE = ['игра', 'жизнь'];
/** H10: the `where` mark — Enum(игра|жизнь) or null; a present invalid value → null + issue; missing → null silently. */
const whereOf = (o, p, iss) => field(o, 'where', (v) => tEnum(v, WHERE, `${p}.where`, iss), null);

/** field(o, k, check, def): present → check (invalid → default); missing → default (silent). */
function field(o, k, check, def) {
  if (!has(o, k)) return def;
  const r = check(o[k]);
  return r.ok ? r.v : def;
}
function textList(o, k, max, itemMax, path, iss) {
  if (!has(o, k)) return [];
  const raw = o[k];
  if (!Array.isArray(raw)) { iss(`${path}: not a list`); return []; }
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    if (out.length >= max) { iss(`${path}: more than ${max}, rest dropped`); break; }
    const r = tText(raw[i], itemMax, true, `${path}[${i}]`, iss);
    if (r.ok) out.push(r.v);
  }
  return out;
}
function idList(o, k, max, path, iss) {
  if (!has(o, k)) return [];
  const raw = o[k];
  if (!Array.isArray(raw)) { iss(`${path}: not a list`); return []; }
  const out = [];
  for (let i = 0; i < raw.length && out.length < max; i++) { const r = tId(raw[i], `${path}[${i}]`, iss); if (r.ok) out.push(r.v); }
  if (raw.length > max) iss(`${path}: more than ${max}, rest dropped`);
  return out;
}
function uniqueId(base, used) {
  let id = base, n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}
/** Cleans a typed-word trigger / alias: lowercase, only [a-zа-яё0-9]. */
function cleanWord(s) { return String(s).toLocaleLowerCase('ru').replace(/[^a-zа-яё0-9]/g, ''); }

// ─── §4.3 lists, own fields ───────────────────────────────────────────────────────────────────────────────────
/** Iterates a raw list: non-objects dropped (issue), max enforced (issue). fn(item, index, path) → validated|null. */
function eachItem(raw, key, fn, iss) {
  const out = [];
  const max = LIST_KEYS[key];
  for (let i = 0; i < raw.length; i++) {
    const path = `${key}[${i}]`;
    if (out.length >= max) { iss(`${key}: more than ${max}, rest dropped`); break; }
    if (!isObj(raw[i])) { iss(`${path}: not an object, dropped`); continue; }
    const v = fn(raw[i], i, path);
    if (v) out.push(v);
  }
  return out;
}

function vAchievements(raw, iss) {
  const used = new Set();
  return eachItem(raw, 'achievements', (o, i, p) => {
    const title = has(o, 'title') ? tText(o.title, 40, true, `${p}.title`, iss) : { ok: false };
    if (!title.ok) { iss(`${p}: no title, dropped`); return null; }
    const idr = has(o, 'id') ? tId(o.id, `${p}.id`, iss) : { ok: false };
    const id = uniqueId(idr.ok ? idr.v : `a${i + 1}`, used);
    const earned = field(o, 'earned', (v) => tBool(v, `${p}.earned`, iss), false);
    return {
      id, title: title.v,
      shape: field(o, 'shape', (v) => tEnum(v, SHAPES, `${p}.shape`, iss), SHAPES[i % 5]),
      rarity: field(o, 'rarity', (v) => tEnum(v, ['обычная', 'редкая', 'легендарная'], `${p}.rarity`, iss), 'обычная'),
      earned,
      date: earned ? field(o, 'date', (v) => tDate(v, `${p}.date`, iss), null) : null,
      who: idList(o, 'who', 12, `${p}.who`, iss),
      text: field(o, 'text', (v) => tText(v, 200, false, `${p}.text`, iss), ''),
      where: whereOf(o, p, iss),
    };
  }, iss);
}

function vMembers(raw, iss) {
  const used = new Set(['workshop']);   // reserved: it would collide with #/members/workshop
  return eachItem(raw, 'members', (o, i, p) => {
    const name = has(o, 'name') ? tText(o.name, 24, true, `${p}.name`, iss) : { ok: false };
    if (!name.ok) { iss(`${p}: no name, dropped`); return null; }
    const idr = has(o, 'id') ? tId(o.id, `${p}.id`, iss) : { ok: false };
    const id = uniqueId(idr.ok ? idr.v : `m${i + 1}`, used);
    let note = MEMBER_NOTES[i % 12];
    if (has(o, 'note')) {
      const n = typeof o.note === 'string' ? o.note.trim().toUpperCase() : '';
      if (NOTE_NAMES.includes(n)) note = n; else iss(`${p}.note: ${q(o.note)} invalid → "${note}"`);
    }
    return {
      id, name: name.v,
      callsign: field(o, 'callsign', (v) => tText(v, 16, false, `${p}.callsign`, iss), ''),
      role: field(o, 'role', (v) => tText(v, 32, false, `${p}.role`, iss), ''),
      status: field(o, 'status', (v) => tEnum(v, ['на связи', 'в пути', 'отдыхает'], `${p}.status`, iss), 'на связи'),
      level: field(o, 'level', (v) => tInt(v, 0, 99, `${p}.level`, iss), 1),
      missions: field(o, 'missions', (v) => tInt(v, 0, 999, `${p}.missions`, iss), 0),
      seed: field(o, 'seed', (v) => tInt(v, 0, 9999, `${p}.seed`, iss), hashStr(id) % 100),
      note,
      glyph: field(o, 'glyph', (v) => tGlyph(v, `${p}.glyph`, iss), null),
      trait: field(o, 'trait', (v) => tText(v, 120, false, `${p}.trait`, iss), ''),
      joke: field(o, 'joke', (v) => tText(v, 160, false, `${p}.joke`, iss), ''),
      achievements: idList(o, 'achievements', 16, `${p}.achievements`, iss),
    };
  }, iss);
}

function vMissions(raw, iss) {
  // Codes given explicitly are reserved first, so a generated default code never steals one.
  const explicit = new Set();
  for (const o of raw) if (isObj(o) && has(o, 'code')) { const r = tCode(o.code, '', () => {}); if (r.ok) explicit.add(r.v); }
  const used = new Set();
  return eachItem(raw, 'missions', (o, i, p) => {
    let code = null;
    if (has(o, 'code')) {
      const r = tCode(o.code, `${p}.code`, iss);   // invalid → the default code below (§4.2)
      if (r.ok) {
        code = r.v;
        if (used.has(code)) { iss(`${p}: duplicate code ${code}, dropped`); return null; }
      }
    }
    if (code === null) {
      code = String(i + 1).padStart(3, '0');
      if (used.has(code) || explicit.has(code)) { iss(`${p}: no code (${code} taken), dropped`); return null; }
    }
    used.add(code);
    const status = field(o, 'status', (v) => tEnum(v, ['done', 'active', 'new', 'locked', 'sealed'], `${p}.status`, iss), 'new');
    let decodeDays = field(o, 'decodeDays', (v) => tInt(v, 1, 365, `${p}.decodeDays`, iss), null);
    let unlockAtDays = field(o, 'unlockAtDays', (v) => tInt(v, 1, 365, `${p}.unlockAtDays`, iss), null);
    if (status !== 'locked') { decodeDays = null; unlockAtDays = null; } else if (decodeDays != null && unlockAtDays != null) {
      unlockAtDays = null; iss(`${p}: locked with both day fields → decodeDays kept`);
    } else if (decodeDays == null && unlockAtDays == null) { decodeDays = 7; iss(`${p}: locked without days → decodeDays 7`); }
    return {
      code,
      title: field(o, 'title', (v) => tText(v, 48, true, `${p}.title`, iss), `Вылазка ${code}`),
      status,
      brief: field(o, 'brief', (v) => tText(v, 240, false, `${p}.brief`, iss), ''),
      conditions: textList(o, 'conditions', 6, 40, `${p}.conditions`, iss),
      crew: idList(o, 'crew', 12, `${p}.crew`, iss),
      result: field(o, 'result', (v) => tText(v, 160, false, `${p}.result`, iss), ''),
      reward: field(o, 'reward', (v) => tId(v, `${p}.reward`, iss), null),
      log: field(o, 'log', (v) => tText(v, 200, false, `${p}.log`, iss), ''),
      decodeDays, unlockAtDays,
      proposedBy: field(o, 'proposedBy', (v) => tId(v, `${p}.proposedBy`, iss), null),   // Ref(members), resolved in step 4
      where: whereOf(o, p, iss),
    };
  }, iss);
}

function vLegends(raw, iss) {
  const used = new Set();
  return eachItem(raw, 'legends', (o, i, p) => {
    const date = has(o, 'date') ? tDate(o.date, `${p}.date`, iss) : { ok: false };
    const title = has(o, 'title') ? tText(o.title, 48, true, `${p}.title`, iss) : { ok: false };
    if (!date.ok || !title.ok) { iss(`${p}: needs date and title, dropped`); return null; }
    const idr = has(o, 'id') ? tId(o.id, `${p}.id`, iss) : { ok: false };
    return {
      id: uniqueId(idr.ok ? idr.v : `l${i + 1}`, used),
      date: date.v,
      kind: field(o, 'kind', (v) => tEnum(v, ['победа', 'смешное', 'эпичное'], `${p}.kind`, iss), 'эпичное'),
      title: title.v,
      text: field(o, 'text', (v) => tText(v, 300, false, `${p}.text`, iss), ''),
      where: whereOf(o, p, iss),
    };
  }, iss);
}

function vMoments(raw, iss) {
  const used = new Set();
  return eachItem(raw, 'moments', (o, i, p) => {
    const date = has(o, 'date') ? tDate(o.date, `${p}.date`, iss) : { ok: false };
    const title = has(o, 'title') ? tText(o.title, 48, true, `${p}.title`, iss) : { ok: false };
    if (!date.ok || !title.ok) { iss(`${p}: needs date and title, dropped`); return null; }
    const idr = has(o, 'id') ? tId(o.id, `${p}.id`, iss) : { ok: false };
    return {
      id: uniqueId(idr.ok ? idr.v : `mo${i + 1}`, used),
      date: date.v,
      title: title.v,
      who: idList(o, 'who', 12, `${p}.who`, iss),
      text: field(o, 'text', (v) => tText(v, 300, true, `${p}.text`, iss), title.v),
      where: whereOf(o, p, iss),
    };
  }, iss);
}

function vJokes(raw, iss) {
  const used = new Set();
  return eachItem(raw, 'jokes', (o, i, p) => {
    const text = has(o, 'text') ? tText(o.text, 160, true, `${p}.text`, iss) : { ok: false };
    if (!text.ok) { iss(`${p}: no text, dropped`); return null; }
    const idr = has(o, 'id') ? tId(o.id, `${p}.id`, iss) : { ok: false };
    const trig = field(o, 'trigger', (v) => tText(v, 24, false, `${p}.trigger`, iss), '');
    return {
      id: uniqueId(idr.ok ? idr.v : `j${i + 1}`, used),
      date: field(o, 'date', (v) => tDate(v, `${p}.date`, iss), null),   // null → clan.founded in step 5
      hidden: field(o, 'hidden', (v) => tBool(v, `${p}.hidden`, iss), false),
      trigger: cleanWord(trig),
      text: text.v,
    };
  }, iss);
}

function vTransmissions(raw, iss) {
  return eachItem(raw, 'transmissions', (o, i, p) => {
    const text = has(o, 'text') ? tText(o.text, 240, true, `${p}.text`, iss) : { ok: false };
    if (!text.ok) { iss(`${p}: no text, dropped`); return null; }
    return { from: field(o, 'from', (v) => tText(v, 16, true, `${p}.from`, iss), 'VIN'), text: text.v };   // O10: was ШТАБ
  }, iss);
}

// ─── §4.3 objects ─────────────────────────────────────────────────────────────────────────────────────────────
function vClan(o, iss) {
  const D = DEFAULT_WORLD.clan;
  return {
    name: field(o, 'name', (v) => tText(v, 24, true, 'clan.name', iss), D.name),
    motto: field(o, 'motto', (v) => tText(v, 80, true, 'clan.motto', iss), D.motto),
    about: field(o, 'about', (v) => tText(v, 120, false, 'clan.about', iss), D.about),   // "" allowed (= hidden everywhere)
    founded: field(o, 'founded', (v) => tDate(v, 'clan.founded', iss), D.founded),
    frequency: field(o, 'frequency', (v) => tNum(v, 0, 99.99, 2, 'clan.frequency', iss), D.frequency),
    sigil: field(o, 'sigil', (v) => tGlyph(v, 'clan.sigil', iss), normalizeGlyph(D.sigil)),   // the default, normalised like any glyph
    code: vCode(o, iss),
  };
}

/** H10: clan.code — List(Text(40), 7) with exactly 7 slots (A11.3): non-string item → "" (issue); missing items → that
 *  slot's default; extra items dropped (issue); not an array → the 7 defaults. */
function vCode(o, iss) {
  const D = DEFAULT_WORLD.clan.code;
  if (!has(o, 'code')) return D.slice();
  const raw = o.code;
  if (!Array.isArray(raw)) { iss('clan.code: not a list, default used'); return D.slice(); }
  if (raw.length > 7) iss(`clan.code: more than 7, rest dropped`);
  const out = [];
  for (let i = 0; i < 7; i++) {
    if (i >= raw.length) { out.push(D[i]); continue; }
    const v = raw[i];
    if (typeof v !== 'string') { iss(`clan.code[${i}]: ${q(v)} invalid → ""`); out.push(''); continue; }
    const r = tText(v, 40, false, `clan.code[${i}]`, iss);
    out.push(r.ok ? r.v : '');
  }
  return out;
}

function vOperator(o, members, iss) {
  const D = DEFAULT_WORLD.operator;
  const rawName = has(o, 'name') ? tText(o.name, 24, true, 'operator.name', iss) : { ok: false };
  let id;
  const idr = has(o, 'id') ? tId(o.id, 'operator.id', iss) : { ok: false };
  if (idr.ok) {
    id = idr.v;
    if (!members.some((m) => m.id === id)) iss(`operator.id: "${id}" matches no member (kept)`);
  } else {
    const byName = rawName.ok ? members.find((m) => m.name.toLocaleLowerCase('ru') === rawName.v.toLocaleLowerCase('ru')) : null;
    id = byName ? byName.id : members.length ? members[0].id : 'sam';
  }
  const om = members.find((m) => m.id === id) || null;
  const name = rawName.ok ? rawName.v : om ? om.name : D.name;
  return {
    id, name,
    aliases: textList(o, 'aliases', 8, 24, 'operator.aliases', iss),   // completed in step 5
    callsign: field(o, 'callsign', (v) => tText(v, 16, false, 'operator.callsign', iss), om ? om.callsign : ''),
    birthday: field(o, 'birthday', (v) => tDate(v, 'operator.birthday', iss), null),
    heightM: field(o, 'heightM', (v) => tNumStrict(v, 0.8, 2.2, 2, 'operator.heightM', iss), D.heightM != null ? D.heightM : 1.3),
    papaHeightM: field(o, 'papaHeightM', (v) => tNumStrict(v, 1.4, 2.3, 2, 'operator.papaHeightM', iss), null),
  };
}

function vSingles(w, raw, iss) {
  const D = DEFAULT_WORLD;
  const sec = (key, fn) => {
    try { w[key] = fn(isObj(raw[key]) ? raw[key] : D[key]); } catch (e) { iss(`${key}: crashed, default used`); w[key] = clone(D[key]); }
  };
  sec('signal', (o) => ({ secret: field(o, 'secret', (v) => tText(v, 240, true, 'signal.secret', iss), D.signal.secret) }));
  sec('capsule', (o) => ({
    openAfterDays: field(o, 'openAfterDays', (v) => tInt(v, 0, 365, 'capsule.openAfterDays', iss), D.capsule.openAfterDays),
    text: field(o, 'text', (v) => tText(v, 300, true, 'capsule.text', iss), D.capsule.text),
  }));
  sec('zenith', (o) => ({ message: field(o, 'message', (v) => tText(v, 160, true, 'zenith.message', iss), D.zenith.message) }));
  sec('nadir', (o) => ({ origin: field(o, 'origin', (v) => tText(v, 400, true, 'nadir.origin', iss), D.nadir.origin) }));
  sec('night', (o) => ({
    from: field(o, 'from', (v) => tInt(v, 0, 23, 'night.from', iss), D.night.from),
    to: field(o, 'to', (v) => tInt(v, 0, 23, 'night.to', iss), D.night.to),
    drowsyFrom: field(o, 'drowsyFrom', (v) => tInt(v, 0, 23, 'night.drowsyFrom', iss), D.night.drowsyFrom),
    story: field(o, 'story', (v) => tText(v, 240, true, 'night.story', iss), D.night.story),
  }));
  sec('companion', (o) => ({ name: field(o, 'name', (v) => tText(v, 16, true, 'companion.name', iss), D.companion.name) }));
}

// ─── validateWorld (§4.4) ─────────────────────────────────────────────────────────────────────────────────────
/** PURE: → { world, issues }. Never throws, never freezes. */
export function validateWorld(raw) {
  const issues = [];
  const iss = (s) => { issues.push(s); };
  const D = DEFAULT_WORLD;
  let src = raw;
  if (!isObj(src)) { src = {}; }
  const w = {};

  // 1. Containers + unknown keys.
  let keys = [];
  try { keys = Object.keys(src); } catch (e) { keys = []; }
  for (const k of keys) if (!KEYS.includes(k)) iss(`unknown key ${k}`);
  const box = {};
  for (const k of KEYS) {
    let v;
    try { v = src[k]; } catch (e) { v = undefined; }
    const wantList = k in LIST_KEYS;
    const ok = wantList ? Array.isArray(v) : isObj(v);
    if (!ok && v !== undefined) iss(`${k}: default used`);
    box[k] = ok ? v : clone(D[k]);
  }

  // 2. Lists, own fields (each key guarded: a crash → that key's default).
  const listFns = [['achievements', vAchievements], ['members', vMembers], ['missions', vMissions], ['legends', vLegends],
    ['moments', vMoments], ['jokes', vJokes], ['transmissions', vTransmissions]];
  for (const [k, fn] of listFns) {
    try { w[k] = fn(box[k], iss); } catch (e) {
      iss(`${k}: crashed, default used`);
      try { w[k] = fn(clone(D[k]), () => {}); } catch (e2) { w[k] = []; }
    }
  }

  // 3. Objects.
  try { w.clan = vClan(box.clan, iss); } catch (e) { iss('clan: crashed, default used'); w.clan = clone(D.clan); }
  try { w.operator = vOperator(box.operator, w.members, iss); } catch (e) {
    iss('operator: crashed, default used');
    w.operator = { ...clone(D.operator), aliases: [] };
  }
  vSingles(w, box, iss);

  // 4. Refs (after every list exists). Unknown ids removed; duplicates removed.
  try {
    const mIds = new Set(w.members.map((m) => m.id));
    const aIds = new Set(w.achievements.map((a) => a.id));
    const refs = (arr, ids, path) => {
      const out = [];
      for (const id of arr) {
        if (!ids.has(id)) { iss(`${path}: unknown "${id}" removed`); continue; }
        if (!out.includes(id)) out.push(id);
      }
      return out;
    };
    w.members.forEach((m, i) => { m.achievements = refs(m.achievements, aIds, `members[${i}].achievements`); });
    w.missions.forEach((m, i) => {
      m.crew = refs(m.crew, mIds, `missions[${i}].crew`);
      if (m.reward != null && !aIds.has(m.reward)) { iss(`missions[${i}].reward: unknown "${m.reward}" removed`); m.reward = null; }
      if (m.proposedBy != null && !mIds.has(m.proposedBy)) { iss(`missions[${i}].proposedBy: unknown "${m.proposedBy}" removed`); m.proposedBy = null; }
    });
    w.achievements.forEach((a, i) => { a.who = refs(a.who, mIds, `achievements[${i}].who`); });
    w.moments.forEach((m, i) => { m.who = refs(m.who, mIds, `moments[${i}].who`); });
  } catch (e) { iss('refs: crashed'); }

  // 5. Late defaults: undated jokes ← clan.founded; operator aliases completion (§4.3.1).
  for (const j of w.jokes) if (j.date == null) j.date = w.clan.founded;
  try {
    const out = [];
    for (const a of w.operator.aliases) { const c = cleanWord(a); if (c.length >= 2 && c.length <= 24 && !out.includes(c)) out.push(c); }
    const own = cleanWord(w.operator.name);
    if (own.length >= 2 && !out.includes(own)) out.push(own);
    w.operator.aliases = out;
  } catch (e) { w.operator.aliases = []; }

  // 6. Exact output shape and key order (§4.3).
  const world = {};
  for (const k of KEYS) world[k] = w[k];
  return { world, issues };
}

function deepFreeze(o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

// ─── Module load (§4.4) ───────────────────────────────────────────────────────────────────────────────────────
let rawWorld;
let source = 'file';
try { rawWorld = typeof window !== 'undefined' ? window.SAMVIN_WORLD : undefined; } catch (e) { rawWorld = undefined; }
if (!isObj(rawWorld)) {
  source = 'default';
  rawWorld = DEFAULT_WORLD;
  logOnce('world', 'world.js missing or broken — using built-in defaults');
}
const validated = validateWorld(rawWorld);
if (validated.issues.length) logOnce('world-issues', `world.js: ${validated.issues.length} issue(s)`, validated.issues);

/** 'file' | 'default' */
export const WORLD_SOURCE = source;
/** every repair made (empty for the shipped file) */
export const WORLD_ISSUES = Object.freeze(validated.issues.slice());
/** validated, defaults filled, deep-frozen */
export const WORLD = deepFreeze(validated.world);

// ─── Lookups ──────────────────────────────────────────────────────────────────────────────────────────────────
export function memberById(id) { return WORLD.members.find((m) => m.id === id) || null; }
export function operatorMember() { return memberById(WORLD.operator.id); }
export function missionByCode(code) {
  const c = typeof code === 'number' ? String(code).padStart(3, '0') : String(code == null ? '' : code).trim();
  return WORLD.missions.find((m) => m.code === c) || null;
}
export function achievementById(id) { return WORLD.achievements.find((a) => a.id === id) || null; }

/** H10 (X§4.2, A11.6): the one display string of the `where` mark. Every surface uses it; nobody re-spells the label. */
export function whereLabel(where) {
  return where === 'игра' ? 'В ИГРЕ' : where === 'жизнь' ? 'В ЖИЗНИ' : null;
}

// ─── §4.5 calm lines ──────────────────────────────────────────────────────────────────────────────────────────
export const EMPTY_LINE = Object.freeze({ members: 'Здесь пока никого нет.', missions: 'Вылазок пока нет.', achievements: 'Трофеев пока нет.',
  transmissions: 'Передач пока нет.', probeLog: 'Зонд вернулся. Записи нет.' });

// ─── §4.6 derived counts: the one formula for every live number ───────────────────────────────────────────────
const SECRET_ID = /^S(0[1-9]|1[0-4])$/;
/** → Counts, recomputed on each call from WORLD + state (cheap). */
export function worldCounts() {
  const d = state.data || {};
  const tr = d.transmissions || { delivered: 0, read: [] };
  const delivered = Math.max(0, Math.min(tr.delivered | 0, WORLD.transmissions.length));
  const read = Array.isArray(tr.read) ? tr.read : [];
  let unread = 0;
  for (let i = 0; i < delivered; i++) if (!read.includes(i)) unread++;
  const jokeIds = new Set(WORLD.jokes.map((j) => j.id));
  const jokesFound = new Set((Array.isArray(d.jokesFound) ? d.jokesFound : []).filter((id) => jokeIds.has(id))).size;
  let done = 0, probesOut = 0;
  for (const m of WORLD.missions) {
    if (missionView(m).state === 'done') done++;
    if (probeStatus(m.code) === 'out') probesOut++;
  }
  const found = d.found && typeof d.found === 'object' ? Object.keys(d.found).filter((k) => SECRET_ID.test(k)).length : 0;
  return {
    delivered, unread,
    legends: WORLD.legends.length,
    moments: WORLD.moments.length,
    jokesFound,
    members: WORLD.members.length,
    online: WORLD.members.filter((m) => m.status === 'на связи').length,
    founded: fmtDate(WORLD.clan.founded, 'dd.mm.yyyy'),
    daysSinceFounded: Math.max(0, daysBetween(WORLD.clan.founded, state.today || WORLD.clan.founded)),
    missions: WORLD.missions.length,
    done, probesOut,
    earned: WORLD.achievements.filter((a) => a.earned).length,
    achievements: WORLD.achievements.length,
    secrets: found,   // = secrets.count() (§3.14.2): the found ids, counted from the same persisted record
    shards: d.shards | 0,
    nadirOpen: !!d.nadirOpen,
    life: WORLD.missions.filter((m) => m.where === 'жизнь').length,   // H10: V ring `· В ЖИЗНИ {n}` (shown when ≥ 1)
  };
}
