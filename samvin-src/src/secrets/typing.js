// secrets/typing.js — the typed-word reader behind S05 (SPEC §8.1 S05; ARCH §6.11). OWNER: WP10.
// Keys outside any input are buffered by `event.code` and read TWICE — as QWERTY and as ЙЦУКЕН — so «сэм» typed on an
// English layout (c ' v) and «sam» typed on a Russian one (ы ф ь) both count. Case-insensitive, ё = е. The buffer
// clears 1,600 ms after the last key. A key whose code is not on the map (a non-standard layout) falls back to e.key.
// Words: operator.aliases → owner mode; members[].callsign → status «{callsign} на связи.»; jokes[].trigger → the joke.
// The key that completes a word is not passed on (so the M of «sam» does not also mute the sound).
import { WORLD } from '../data/world.js';
import { loop } from '../core/loop.js';

const ROWS = [
  ['KeyQ', 'q', 'й'], ['KeyW', 'w', 'ц'], ['KeyE', 'e', 'у'], ['KeyR', 'r', 'к'], ['KeyT', 't', 'е'], ['KeyY', 'y', 'н'],
  ['KeyU', 'u', 'г'], ['KeyI', 'i', 'ш'], ['KeyO', 'o', 'щ'], ['KeyP', 'p', 'з'], ['BracketLeft', '[', 'х'],
  ['BracketRight', ']', 'ъ'], ['KeyA', 'a', 'ф'], ['KeyS', 's', 'ы'], ['KeyD', 'd', 'в'], ['KeyF', 'f', 'а'],
  ['KeyG', 'g', 'п'], ['KeyH', 'h', 'р'], ['KeyJ', 'j', 'о'], ['KeyK', 'k', 'л'], ['KeyL', 'l', 'д'],
  ['Semicolon', ';', 'ж'], ['Quote', "'", 'э'], ['KeyZ', 'z', 'я'], ['KeyX', 'x', 'ч'], ['KeyC', 'c', 'с'],
  ['KeyV', 'v', 'м'], ['KeyB', 'b', 'и'], ['KeyN', 'n', 'т'], ['KeyM', 'm', 'ь'], ['Comma', ',', 'б'],
  ['Period', '.', 'ю'], ['Backquote', '`', 'ё'], ['Space', ' ', ' '], ['Minus', '-', '-'],
  ['Digit0', '0', '0'], ['Digit1', '1', '1'], ['Digit2', '2', '2'], ['Digit3', '3', '3'], ['Digit4', '4', '4'],
  ['Digit5', '5', '5'], ['Digit6', '6', '6'], ['Digit7', '7', '7'], ['Digit8', '8', '8'], ['Digit9', '9', '9'],
];
const LAT = new Map(), CYR = new Map();
for (const [c, l, r] of ROWS) { LAT.set(c, l); CYR.set(c, r); }

const CLEAR_MS = 1600, MAX = 32;
/** lowercase, ё → е, collapsed spaces */
export const norm = (s) => String(s == null ? '' : s).toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();

let lat = '', cyr = '', lastAt = -1e9;
let words = null;

function buildWords() {
  const out = [];
  const add = (kind, w, ref) => { const n = norm(w); if (n.length >= 2 && !out.some((x) => x.w === n)) out.push({ kind, w: n, ref }); };
  for (const a of WORLD.operator.aliases || []) add('owner', a, null);
  add('owner', WORLD.operator.name, null);
  for (const m of WORLD.members || []) if (m && m.callsign && m.id !== WORLD.operator.id) add('member', m.callsign, m);
  for (const j of WORLD.jokes || []) if (j && j.trigger) add('joke', j.trigger, j);
  // longest first, so «сэмми» is not cut short by «сэм» when both end on the same key
  out.sort((a, b) => b.w.length - a.w.length);
  return out;
}

/** Matches typed (or sheet) text against the world's words. → { kind, w, ref } | null */
export function matchWord(text) {
  if (!words) words = buildWords();
  const n = norm(text);
  for (const x of words) if (n === x.w) return x;
  return null;
}

/** → { kind, w, ref } | null when this key completes a word. */
export function feedKey(e) {
  if (!e || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return null;
  if (!words) words = buildWords();
  const now = loop.now;
  if (now - lastAt > CLEAR_MS) { lat = ''; cyr = ''; }
  let l = LAT.get(e.code), r = CYR.get(e.code);
  if (l == null || r == null) {
    const k = typeof e.key === 'string' && e.key.length === 1 ? e.key : null;
    if (!k) return null;
    l = r = k;
  }
  lastAt = now;
  lat = (lat + l).slice(-MAX);
  cyr = (cyr + r).slice(-MAX);
  const nl = norm(lat), nc = norm(cyr);
  for (const x of words) {
    if (nl.endsWith(x.w) || nc.endsWith(x.w)) { lat = ''; cyr = ''; return x; }
  }
  return null;
}
