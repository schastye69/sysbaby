// halls/archive/timeline.js — WP7 SEED, functionally correct (ARCH §3.19, §4.3.6, §6.1.5; SPEC §6.4). Pure: reads WORLD
// and state.data.jokesFound only. WP7 may rewrite it but must return identical bands for the same inputs.
//
// Bands: every legend, every EARNED achievement with a date, every moment, and every joke that is visible
// (hidden === false) or found (id in state.data.jokesFound); newest first; equal dates → legend, achievement, moment,
// joke, then array order; then the final «ДО НАЧАЛА» band. Heights: legend 3.0, achievement 1.6, moment 1.2,
// joke 0.8, «ДО НАЧАЛА» 3.0 m; gap 0.4 m. `y` is the band CENTRE, stacked downward from 0 (the first band's top edge is
// y = 0). Ids are `<kind>-<id>` (the archive route sub); the last band's id is 'before'.
import { WORLD } from '../../data/world.js';
import { state } from '../../core/state.js';

/** @typedef {{ kind:'legend'|'achievement'|'moment'|'joke'|'before', id:string, date:string, title:string, text:string,
 *   who:string[], rarity?:string, height:number, y:number }} Band */

export const BAND_HEIGHT = Object.freeze({ legend: 3.0, achievement: 1.6, moment: 1.2, joke: 0.8, before: 3.0 });
export const BAND_GAP = 0.4;
const KIND_ORDER = { legend: 0, achievement: 1, moment: 2, joke: 3 };
export const BEFORE_TEXT = 'Здесь ещё ничего не было. Потом пришли вы.';

/** → Band[] newest first (+ the final 'before' band). */
export function buildTimeline() {
  const found = new Set((state.data && Array.isArray(state.data.jokesFound)) ? state.data.jokesFound : []);
  const items = [];
  const push = (kind, idx, o) => items.push({ kind, idx, o });
  WORLD.legends.forEach((l, i) => push('legend', i, { id: l.id, date: l.date, title: l.title, text: l.text || '', who: [] }));
  WORLD.achievements.forEach((a, i) => {
    if (a.earned && a.date) push('achievement', i, { id: a.id, date: a.date, title: a.title, text: a.text || '', who: (a.who || []).slice(), rarity: a.rarity });
  });
  WORLD.moments.forEach((m, i) => push('moment', i, { id: m.id, date: m.date, title: m.title, text: m.text || m.title, who: (m.who || []).slice() }));
  WORLD.jokes.forEach((j, i) => {
    if (!j.hidden || found.has(j.id)) push('joke', i, { id: j.id, date: j.date || WORLD.clan.founded, title: '', text: j.text, who: [] });
  });
  items.sort((a, b) => (a.o.date < b.o.date ? 1 : a.o.date > b.o.date ? -1 : KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.idx - b.idx));

  const bands = [];
  let top = 0;
  const add = (kind, id, o) => {
    const h = BAND_HEIGHT[kind];
    const band = { kind, id, date: o.date, title: o.title, text: o.text, who: o.who, height: h, y: top - h / 2 };
    if (o.rarity) band.rarity = o.rarity;
    bands.push(band);
    top -= h + BAND_GAP;
  };
  for (const it of items) add(it.kind, `${it.kind}-${it.o.id}`, it.o);
  add('before', 'before', { date: WORLD.clan.founded, title: 'ДО НАЧАЛА', text: BEFORE_TEXT, who: [] });
  return bands;
}
