// world/rooms.js — ROOMS, the hall registry (ARCH §3.7.1). Fully populated by WP0; nobody else edits it.
// Altitudes and bands come from core/tokens.js (HALL_ALT / HALL_BAND, ARCH §5.1), so the two can never drift.
// Strings use U+202F (thin space) in thousands and U+2212 (minus) as SPEC writes them.
import { Vector3 } from 'three';
import { HALL_ALT, HALL_BAND } from '../core/tokens.js';

/** @typedef {'CORE'|'SIGNAL'|'ARCHIVE'|'MEMBERS'|'VOYAGES'|'INSIGNIA'|'NADIR'|'ZENITH'|'WORKSHOP'} RoomId */

const T = ' ';   // thin space
const M = '−';   // minus

function room(id, slug, sign, stratum, num, code, title, titleOpen, name, nameOpen, line, level, giant, n, fog, far, wet, root, note, hidden, parent) {
  const alt = HALL_ALT[id];
  const [floor, ceil] = HALL_BAND[id];
  return Object.freeze({
    id, slug, sign, stratum, num, code, title, titleOpen, name, nameOpen, line, alt, level, giant, floor, ceil, n, fog, far,
    wet, root, note, hidden, parent, anchor: Object.freeze(new Vector3(0, alt, 0)),
  });
}

/** @type {Readonly<Record<RoomId, RoomMeta>>} */
export const ROOMS = Object.freeze({
  SIGNAL:   room('SIGNAL', 'signal', 'S', 0, '01', 'SIGNAL', 'СВЯЗЬ', null, 'Связь', null, 'передачи и сигналы',
    `+1${T}090.00`, `+1${T}090`, 3, 0.0140, 400, 0.22, 220.00, 392.00, false, null),
  ARCHIVE:  room('ARCHIVE', 'archive', 'A', 1, '02', 'ARCHIVE', 'ЛЕТОПИСЬ', null, 'Летопись', null, 'легенды, моменты, шутки',
    '+810.00', '+810', 5, 0.0060, 500, 0.22, 196.00, 440.00, false, null),
  MEMBERS:  room('MEMBERS', 'members', 'M', 2, '03', 'MEMBERS', 'КЛАН', null, 'Клан', null, 'кто с нами',
    '+460.00', '+460', 7, 0.0034, 800, 0.22, 164.81, 493.88, false, null),
  CORE:     room('CORE', 'core', '•', 3, '04', 'CORE', 'ЯДРО', null, 'Ядро', null, 'имя, девиз, всё о нас',
    '±0.00', '±0', 12, 0.00485, 700, 0.22, 146.83, 587.33, false, null),
  VOYAGES:  room('VOYAGES', 'voyages', 'V', 4, '05', 'VOYAGES', 'ВЫЛАЗКИ', null, 'Вылазки', null, 'экспедиции и зонды',
    `${M}460.00`, `${M}460`, 7, 0.0034, 800, 0.30, 123.47, 659.25, false, null),
  INSIGNIA: room('INSIGNIA', 'insignia', 'I', 5, '06', 'INSIGNIA', 'ХРАНИЛИЩЕ', null, 'Хранилище', null, 'трофеи и находки',
    `${M}810.00`, `${M}810`, 5, 0.0060, 500, 0.00, 110.00, 783.99, false, null),
  NADIR:    room('NADIR', 'nadir', 'N', 6, '07', 'NADIR', 'ЗАПЕЧАТАНО', 'ИСТОК', 'Запечатано', 'Исток', 'осколков {k} из 5',
    `${M}1${T}090.00`, `${M}1${T}090`, 3, 0.0140, 400, 0.22, 98.00, 880.00, false, null),
  ZENITH:   room('ZENITH', 'zenith', null, -1, '00', 'ZENITH', 'НАД ВСЕМ', null, 'Над всем', null, '—',
    `+1${T}260.00`, `+1${T}260`, 3, 0.00035, 4000, 0.35, 220.00, 392.00, true, 'SIGNAL'),
  WORKSHOP: room('WORKSHOP', 'workshop', null, 2, '03', 'WORKSHOP', 'МАСТЕРСКАЯ', null, 'Мастерская', null, '—',
    '+484.00', '+484', 7, 0.0600, 30, 0.22, 164.81, 493.88, true, 'MEMBERS'),
});

/** NADIR's hover line once open (SPEC §3.4); ROOMS.NADIR.line is the sealed template `осколков {k} из 5`. */
export const NADIR_LINE_OPEN = 'откуда всё началось';

/** Top → bottom (= stratum order). */
export const ROOM_ORDER = Object.freeze(['SIGNAL', 'ARCHIVE', 'MEMBERS', 'CORE', 'VOYAGES', 'INSIGNIA', 'NADIR']);
/** ROOM_ORDER indexed by stratum. */
export const STRATA = ROOM_ORDER;

const BY_SIGN = new Map(ROOM_ORDER.map((id) => [ROOMS[id].sign, ROOMS[id]]));
const BY_SLUG = new Map(Object.values(ROOMS).map((r) => [r.slug, r]));

/** 'S' … 'N' (also '•') → RoomMeta | null */
export function roomBySign(sign) { return BY_SIGN.get(sign) || null; }
/** 'members' (case-insensitive) → RoomMeta | null */
export function roomBySlug(slug) { return BY_SLUG.get(String(slug || '').toLowerCase()) || null; }
/** 0 … 6 → RoomMeta | null */
export function roomByStratum(i) { const id = ROOM_ORDER[i]; return id ? ROOMS[id] : null; }
