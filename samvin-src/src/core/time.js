// core/time.js — wall-clock time (ARCH §3.11.3, §4.3.8). Every wall-clock read goes through now() = Date.now(), so
// QA's faked Date works. Day keys are LOCAL 'YYYY-MM-DD'.
import { WORLD } from '../data/world.js';

const DAY_MS = 86400000;
const pad2 = (n) => (n < 10 ? '0' : '') + n;
const toDate = (d) => (d instanceof Date ? d : new Date(d == null ? now() : d));

/** → Date.now() */
export function now() { return Date.now(); }

/** → local 'YYYY-MM-DD' */
export function dayKey(d) {
  const dt = toDate(d);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

/** Calendar day number of a 'YYYY-MM-DD' key (UTC-anchored, so DST never skews it). NaN when invalid. */
function keyDays(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(key || ''));
  if (!m) return NaN;
  return Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS);
}

/** → integer calendar days b − a (0 when either key is invalid) */
export function daysBetween(aKey, bKey) {
  const a = keyDays(aKey), b = keyDays(bKey);
  return Number.isFinite(a) && Number.isFinite(b) ? b - a : 0;
}

/** → days since 2025-01-01 local (CORE «СЕГОДНЯ»: moments[dayIndex mod length]) */
export function dayIndex(d) { return daysBetween('2025-01-01', dayKey(d)); }

/** night per §4.3.8: from > to → h ≥ from || h < to; from < to → from ≤ h < to; from === to → never */
function inWindow(h, from, to) {
  if (from > to) return h >= from || h < to;
  if (from < to) return h >= from && h < to;
  return false;
}

export function isNight(d) {
  const n = WORLD.night;
  return inWindow(toDate(d).getHours(), n.from, n.to);
}

/** drowsy = !night && drowsyFrom ≠ from && h ∈ [drowsyFrom, from) (same wrap rule) */
export function isDrowsy(d) {
  const n = WORLD.night;
  if (isNight(d) || n.drowsyFrom === n.from) return false;
  return inWindow(toDate(d).getHours(), n.drowsyFrom, n.from);
}

function parseKey(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ''));
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

/** → true on the day+month of WORLD.operator.birthday (false when no birthday). 29 Feb is celebrated on 28 Feb in
 *  non-leap years. */
export function isBirthday(d) {
  const b = parseKey(WORLD.operator.birthday);
  if (!b) return false;
  const dt = toDate(d);
  const y = dt.getFullYear(), m = dt.getMonth() + 1, day = dt.getDate();
  if (b.m === 2 && b.d === 29 && !((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0)) return m === 2 && day === 28;
  return m === b.m && day === b.d;
}

/** → whole years since operator.birthday (0 when unknown) */
export function ageOn(d) {
  const b = parseKey(WORLD.operator.birthday);
  if (!b) return 0;
  const dt = toDate(d);
  let age = dt.getFullYear() - b.y;
  const m = dt.getMonth() + 1, day = dt.getDate();
  if (m < b.m || (m === b.m && day < b.d)) age--;
  return Math.max(0, age);
}

/** → Legend[] whose day+month is today and whose year is earlier than this year, each with `.years` (copies). */
export function anniversaries(d) {
  const dt = toDate(d);
  const y = dt.getFullYear(), m = dt.getMonth() + 1, day = dt.getDate();
  const out = [];
  for (const l of WORLD.legends) {
    const k = parseKey(l.date);
    if (k && k.m === m && k.d === day && k.y < y) out.push({ ...l, years: y - k.y });
  }
  return out;
}
