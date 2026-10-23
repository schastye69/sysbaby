// halls/archive/timeline.js — WP7 (ARCH §3.19, §4.3.6; ARCH-ADDENDUM X§5.3 WP7; SPEC §6.4; SPEC-ADDENDUM A3.5, A11.4, A11.6).
// PURE: reads WORLD, state.data.jokesFound and the deeds model (deedsModel.deedBands(), itself pure) — no DOM, no three.js,
// so WP11's T0 imports it too.
//
// Bands: every legend, every EARNED achievement with a date, every moment, every joke that is visible (hidden === false)
// or found (id in state.data.jokesFound), and his deed bands (A3.5: 'sbor' aggregate + dated, 'deed' incl. the
// ДОГОВОРИЛИСЬ variant with sub 'pair', 'show'); newest first; equal dates → legend, achievement, moment, joke, sbor,
// deed, show, then array order; then the final «ДО НАЧАЛА» band. Heights: legend 3.0, achievement 1.6, moment 1.2,
// joke 0.8, deed bands 1.0 (A3.5: his bands never outrank his father's 3.0 m legends), «ДО НАЧАЛА» 3.0 m; gap 0.4 m.
// `y` is the band CENTRE, stacked downward from 0 (the first band's top edge is y = 0). Ids are `<kind>-<id>` for the
// world kinds (the archive route sub), the deeds model's own ids for deed bands (`sbor-all`, `sbor-<day>`, `deed-<n>`,
// `show-<day>`); the last band's id is 'before' (no route).
import { WORLD } from '../../data/world.js';
import { state } from '../../core/state.js';
import { deedBands } from '../../deeds/deedsModel.js';

/** @typedef {{ kind:'legend'|'achievement'|'moment'|'joke'|'sbor'|'deed'|'show'|'before', id:string, date:string,
 *   title:string, text:string, who:string[], height:number, y:number, rarity?:string, where?:string|null,
 *   legendKind?:string, shape?:string, label?:string, sub?:string, dataId:string, seed:number }} Band */

export const BAND_HEIGHT = Object.freeze({ legend: 3.0, achievement: 1.6, moment: 1.2, joke: 0.8, sbor: 1.0, deed: 1.0, show: 1.0, before: 3.0 });
export const BAND_GAP = 0.4;
const KIND_ORDER = { legend: 0, achievement: 1, moment: 2, joke: 3, sbor: 4, deed: 5, show: 6 };
export const BEFORE_TEXT = 'Здесь ещё ничего не было. Потом пришли вы.';
/** Deed band kinds (A3.5) — silver 30 % hairlines, 1.0 m. */
export const DEED_KINDS = Object.freeze(['sbor', 'deed', 'show']);

/** FNV-1a of a string → uint32 (the per-band seed: waviness, line count, find angle). */
export function hashSeed(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/** → Band[] newest first (+ the final 'before' band). */
export function buildTimeline() {
  const found = new Set((state.data && Array.isArray(state.data.jokesFound)) ? state.data.jokesFound : []);
  const items = [];
  const push = (kind, idx, o) => items.push({ kind, idx, o });
  WORLD.legends.forEach((l, i) => push('legend', i, { id: l.id, date: l.date, title: l.title, text: l.text || '', who: [],
    where: l.where == null ? null : l.where, legendKind: l.kind || 'эпичное' }));
  WORLD.achievements.forEach((a, i) => {
    if (a.earned && a.date) {
      push('achievement', i, { id: a.id, date: a.date, title: a.title, text: a.text || '', who: (a.who || []).slice(), rarity: a.rarity,
        where: a.where == null ? null : a.where, shape: a.shape });
    }
  });
  WORLD.moments.forEach((m, i) => push('moment', i, { id: m.id, date: m.date, title: m.title, text: m.text || m.title, who: (m.who || []).slice(),
    where: m.where == null ? null : m.where }));
  WORLD.jokes.forEach((j, i) => {
    if (!j.hidden || found.has(j.id)) push('joke', i, { id: j.id, date: j.date || WORLD.clan.founded, title: '', text: j.text, who: [] });
  });
  let deeds = [];
  try { deeds = deedBands(); } catch (e) { deeds = []; }
  deeds.forEach((b, i) => {
    if (!b || !DEED_KINDS.includes(b.kind) || typeof b.date !== 'string') return;
    push(b.kind, i, { id: b.id, date: b.date, title: b.title || '', text: b.text || '', who: (b.who || []).slice(), label: b.label || '',
      sub: b.sub || null, deedId: true });
  });
  items.sort((a, b) => (a.o.date < b.o.date ? 1 : a.o.date > b.o.date ? -1 : KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.idx - b.idx));

  const bands = [];
  let top = 0;
  const add = (kind, id, dataId, o) => {
    const h = BAND_HEIGHT[kind];
    const band = { kind, id, date: o.date, title: o.title, text: o.text, who: o.who, height: h, y: top - h / 2, dataId, seed: hashSeed(id) };
    if (o.rarity) band.rarity = o.rarity;
    if ('where' in o) band.where = o.where;
    if (o.legendKind) band.legendKind = o.legendKind;
    if (o.shape) band.shape = o.shape;
    if (o.label) band.label = o.label;
    if (o.sub) band.sub = o.sub;
    bands.push(band);
    top -= h + BAND_GAP;
  };
  for (const it of items) {
    if (it.o.deedId) add(it.kind, it.o.id, it.o.id, it.o);
    else add(it.kind, `${it.kind}-${it.o.id}`, it.o.id, it.o);
  }
  add('before', 'before', 'before', { date: WORLD.clan.founded, title: 'ДО НАЧАЛА', text: BEFORE_TEXT, who: [] });
  return bands;
}

/** The band index of an archive sub ('<kind>-<id>' or a deed band id); −1 when unknown. 'before' has no route. */
export function indexOfSub(bands, sub) {
  if (sub == null) return -1;
  const s = String(sub);
  if (s === 'before') return -1;
  for (let i = 0; i < bands.length; i++) if (bands[i].id === s) return i;
  return -1;
}
