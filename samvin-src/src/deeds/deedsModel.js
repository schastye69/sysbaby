// deeds/deedsModel.js — the shared deeds / КОДЕКС model (ARCH-ADDENDUM X§2.7; SPEC-ADDENDUM A3.3, A3.5, A11.3, A11.4).
// OWNER: WP13. Seeded FUNCTIONALLY CORRECT by WP0 in the hooks pass (H28b). Pure: reads WORLD and state only; no DOM,
// no three.js. Any WP may import it (WP0's testhook too); WP13 may rewrite it but must return identical results.
//
// ЛЕТОПИСЬ bands (deedBands): 'sbor' (one aggregate band once sbor.count ≥ 1 + dated bands from sbor.here, at most one
// per ISO week, the week's last wins, max 30), 'deed' (the 1st and every 10th single rescue and the 1st and every 10th
// agreement, numbered together in date order) and 'show' (a completed ПОКАЗ, at most one per day). Per-event records
// are read from the optional, WP13-written `lost.log` [{ kind:'one'|'pair', day, room }] and `shows.log`
// [{ day, guests:number, who:string[] }]; without them only the aggregate facts (sbor.last, shows.lastDay) produce bands.
import { WORLD } from '../data/world.js';
import { state } from '../core/state.js';
import { fmtDate } from '../core/ru.js';

export const DEED_IDS = ['wait', 'finish', 'call', 'host', 'rope', 'gentle', 'notice', 'word'];   // 'word' appended (A11.4)
export const DEED_STRATUM = { wait: 0, finish: 1, call: 2, host: 3, rope: 4, word: 5, notice: 6 };   // A11.3: I ← word; 'gentle' has NO stratum
export const DEED_NAME = { wait: 'КАПСУЛА', finish: 'ЗОНД', call: 'СБОР', host: 'ГОСТИ', rope: 'ВСЕ ВМЕСТЕ', word: 'ДОГОВОРИЛИСЬ', notice: 'ПОТЕРЯШКА' };
export const STRATUM_SIGN = ['S', 'A', 'M', '•', 'V', 'I', 'N'];
export { codeCapHeightM } from '../world/structure.js';

/** Band height (m) of every deed band kind (A3.5: his bands never outrank his father's 3.0 m legends). */
export const DEED_BAND_HEIGHT = 1.0;
/** Room → the hall word of the `дело` band BRIEF (A3.5). */
const HALL_WORD = { SIGNAL: 'Связь', ARCHIVE: 'Летопись', MEMBERS: 'Клан', VOYAGES: 'Вылазки', INSIGNIA: 'Хранилище', NADIR: 'Исток' };

const data = () => state.data || {};
const deedOfStratum = (i) => {
  for (const id of Object.keys(DEED_STRATUM)) if (DEED_STRATUM[id] === i) return id;
  return null;
};

/** → { text: WORLD.clan.code[i], at: state.data.code[sign], deedId, deedName } | null (not earned or text "") */
export function lawOf(i) {
  const sign = STRATUM_SIGN[i];
  if (!sign) return null;
  const code = (WORLD.clan && WORLD.clan.code) || [];
  const text = typeof code[i] === 'string' ? code[i] : '';
  const at = data().code && typeof data().code[sign] === 'string' ? data().code[sign] : null;
  if (!at || !text) return null;
  const deedId = deedOfStratum(i);
  return { text, at, deedId, deedName: deedId ? DEED_NAME[deedId] : '' };
}

/** → number[] ascending: strata with an earned, non-empty law */
export function earnedStrata() {
  const out = [];
  for (let i = 0; i < 7; i++) if (lawOf(i)) out.push(i);
  return out;
}

/** → number[]: earned − codeShown */
export function pendingCeremonies() {
  const shown = new Set(Array.isArray(data().codeShown) ? data().codeShown : []);
  return earnedStrata().filter((i) => !shown.has(STRATUM_SIGN[i]));
}

/** ISO week key 'YYYY-Www' of a 'YYYY-MM-DD' day. */
function isoWeek(day) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(day || ''));
  if (!m) return '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const wd = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - wd);
  const y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((d - y0) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(w).padStart(2, '0')}`;
}
const dayOf = (s) => (typeof s === 'string' ? s.slice(0, 10) : null);
const memberName = (id) => { const m = WORLD.members.find((x) => x.id === id); return m ? m.name : null; };

/** → Band[] (kinds 'sbor' | 'deed' | 'show'; height 1.0 m; A3.5 / A11.4 copy), newest first. Band fields: kind, id, date,
 *  label, title (HEADING), text (BRIEF), who, height, sub ('one' | 'pair' on 'deed' bands). */
export function deedBands() {
  const d = data();
  const bands = [];
  const band = (kind, id, date, label, title, text, who, extra) => {
    const b = { kind, id, date, label, title, text, who: who || [], height: DEED_BAND_HEIGHT };
    if (extra) Object.assign(b, extra);
    bands.push(b);
  };
  // СБОР — the aggregate band + dated bands (ЗДЕСЬ used; one per ISO week, the week's last wins; max 30).
  const sb = d.sbor || {};
  const n = sb.count | 0;
  const last = dayOf(sb.last);
  if (n >= 1 && last) {
    band('sbor', 'sbor-all', last, `СБОРЫ · ${n}`, 'Сборы клана', `Сборов: ${n}. Последний — ${fmtDate(last, 'dd.mm.yyyy')}.`, []);
  }
  const weeks = new Map();
  for (const h of Array.isArray(sb.here) ? sb.here : []) {
    const day = dayOf(h && h.day);
    if (!day || !Array.isArray(h.ids) || !h.ids.length) continue;
    weeks.set(isoWeek(day), { day, ids: h.ids.slice() });
  }
  const dated = [...weeks.values()].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0)).slice(-30);
  for (const h of dated) {
    const who = h.ids.filter((id) => memberName(id));
    band('sbor', `sbor-${h.day}`, h.day, `СБОР · ${fmtDate(h.day, 'dd.mm.yyyy')}`, 'Сбор клана',
      `Здесь были: ${who.map(memberName).join(', ')}.`, who);
  }
  // ДЕЛО — the 1st and every 10th rescue / agreement (numbered together in date order).
  const lo = d.lost || {};
  const log = Array.isArray(lo.log) ? lo.log.filter((e) => e && dayOf(e.day) && (e.kind === 'one' || e.kind === 'pair')) : [];
  log.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
  let ones = 0, pairs = 0, k = 0;
  for (const e of log) {
    k += 1;
    const c = e.kind === 'pair' ? ++pairs : ++ones;
    if (c !== 1 && c % 10 !== 0) continue;
    const hall = HALL_WORD[e.room] || 'Ядро';
    const day = dayOf(e.day);
    if (e.kind === 'pair') {
      band('deed', `deed-${k}`, day, `ДЕЛО · ${fmtDate(day, 'dd.mm.yyyy')}`, 'Договорились',
        `Двое не слышали друг друга. Зал: ${hall}. Ты помог им договориться.`, [], { sub: 'pair' });
    } else {
      band('deed', `deed-${k}`, day, `ДЕЛО · ${fmtDate(day, 'dd.mm.yyyy')}`, 'Не прошёл мимо',
        `Маленький ключ потерялся. Зал: ${hall}. Ты привёл его домой.`, [], { sub: 'one' });
    }
  }
  // ПОКАЗ — a completed show, at most one per day.
  const sh = d.shows || {};
  const shows = new Map();
  if (Array.isArray(sh.log)) for (const e of sh.log) { const day = dayOf(e && e.day); if (day) shows.set(day, e); }
  else if (dayOf(sh.lastDay) && (sh.count | 0) > 0) shows.set(dayOf(sh.lastDay), { day: sh.lastDay, guests: 0, who: [] });
  const host = WORLD.operator.name;
  for (const [day, e] of shows) {
    const who = Array.isArray(e.who) ? e.who.filter((id) => memberName(id)) : [];
    const g = Math.max(e.guests | 0, who.length);
    band('show', `show-${day}`, day, `ПОКАЗ · ${fmtDate(day, 'dd.mm.yyyy')}`, 'Показ для гостей', `Гостей: ${g}. Вёл ${host}.`, who);
  }
  bands.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return bands;
}
