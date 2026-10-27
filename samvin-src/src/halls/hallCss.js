// halls/hallCss.js — the halls' own stylesheets on demand (build.mjs §3–5: a/hall-<name>.<hash>.css). A hall's sheet is
// fetched when the hall is first built (hallHost.createResident, i.e. at the start of the DIVE / LIFT that goes there —
// ≥ 1,200 ms before its section is shown at arrival); the section stays hidden until the sheet has loaded (or failed),
// so a hall never shows unstyled. T0 (no WebGL) loads them all before it mounts (t0/load.js).
const FILES = __HALL_CSS__;               // { members: './a/hall-members.<hash>.css', … }
const ROOM_SHEET = { MEMBERS: 'members', WORKSHOP: 'members', VOYAGES: 'voyages', ARCHIVE: 'archive', SIGNAL: 'signal',
  INSIGNIA: 'insignia', NADIR: 'insignia', ZENITH: 'insignia' };
const sheets = new Map();                 // name → { done, promise }

function load(name, before) {
  let s = sheets.get(name);
  if (s) return s;
  const href = FILES[name];
  if (!href || typeof document === 'undefined') { s = { done: true, promise: Promise.resolve() }; sheets.set(name, s); return s; }
  s = { done: false, promise: null };
  s.promise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.hallCss = name;
    link.onload = link.onerror = () => { s.done = true; resolve(); };
    if (before && before.parentNode) before.parentNode.insertBefore(link, before); else document.head.appendChild(link);
  });
  sheets.set(name, s);
  return s;
}

/** The stylesheet of a room (RoomId) → { done, promise }; CORE (and any room without one) is done at once. */
export function hallCss(room) {
  const name = ROOM_SHEET[room];
  return name ? load(name) : { done: true, promise: Promise.resolve() };
}

/** Every hall stylesheet (T0): inserted before `before` (the T0 sheet) so the T0 rules keep the last word. → Promise */
export function allHallCss(before) {
  return Promise.all(Object.keys(FILES).map((n) => load(n, before).promise));
}
