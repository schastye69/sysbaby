// secrets/owner.js — S05 ПОЗЫВНОЙ, owner mode (SPEC §8.1 S05; SPEC-ADDENDUM A2.4.1, A6.5.6; ARCH §6.11 + X§5.3 WP10).
// Desktop: a typed alias (typing.js). Phone (and any pointer): an 800 ms long-press on the TL «SAM.VIN» opens a solid
// sheet — BODY «Кто ты?», a 16 px input (max 24), verb ГОТОВО; t₀ is the sheet finishing its 240 ms close.
//
// FIRST recognition (once per profile; A2.4.1), t from t₀:
//      0  the last key's chisel                       120–520  ПАУЗА (fx.pieces.owner)
//    520  hit: ПРОСВЕТ + ВОЛНА (fx); the nucleus flashes electrum (≤ 2,500 ms, then cools 600); `owner` sound
// 520–1,120  CORE: the bow (600 ms; not under reduced motion)
//  1,120  LEAD «ВЛАДЕЛЕЦ ОПОЗНАН» BEAM WRITES with ПРОВАЛ for exactly its duration; every navigator letter --white
//         for one breath (1,120–1,520) — white, so the rim burn stays the single ember focus
//  1,395  CORE: the wave reaches the rim → his name re-burns (ctx.rim.burn({at: rimAt}))
//  3,620  the S05 shard leaves (secrets.discover — after the electrum has cooled)
//  4,000  LEAD «Привет, {Имя}.»
// LATER recognitions: the SPEC payoff (bow, electrum flash, every letter ember for one breath, both LEADs) plus ПРОВАЛ
// under «ВЛАДЕЛЕЦ ОПОЗНАН» with the B4 bell (`owner`) landing on the bed's return; no pause, ПРОСВЕТ, wave or re-burn.
// Persistence: state.owner = true, app.owner, 'owner:change' {owner:true}; the title becomes `SAM.VIN · {ИМЯ}` (WP0's
// titleFor reads app.owner). A typed member callsign → status «{callsign} на связи.»; a typed joke trigger → the joke
// BEAM WRITES in LEAD and joins jokesFound (ARCHIVE marginalia, WP7).
import { app } from '../core/store.js';
import { logOnce } from '../core/env.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { after } from '../core/clock.js';
import { breath } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { createSheet } from '../ui/sheet.js';
import { titleFor } from '../nav/router.js';
import { TIMING } from '../core/tokens.js';
import { W, has, say, safe, reduced, NAME, keyScreen } from './util.js';
import { feedKey, matchWord } from './typing.js';

const LEAD_1 = 'ВЛАДЕЛЕЦ ОПОЗНАН';
const beamMs = (text) => Math.round([...text].length * (1000 / TIMING.beamCps));
const perf = () => performance.now();
const at = (perfMs, fn) => after(Math.max(0, perfMs - perf()), fn);

let ctx = null, busy = false, sheet = null, input = null, openedAt = -1e9;
const K = { x: 0, y: 0, r: 0 };

function lead(text, opts) { if (ctx.lead && has(ctx.lead, 'show')) safe('owner:lead', () => ctx.lead.show(text, opts)); }

function persistOwner() {
  if (!state.data.owner) state.set('owner', true);
  if (!app.owner) {
    app.owner = true;
    bus.emit('owner:change', { owner: true });
  }
  try { document.title = titleFor(app.route); } catch (e) { /* title is cosmetic */ }
}

function discoverS05() {
  keyScreen(K);
  if (ctx.secrets) safe('owner:discover', () => ctx.secrets.discover('S05', { anchor: { x: K.x, y: K.y } }));
}

/** The whole S05 payoff. t0 = perf ms of the recognition. */
async function recognize(t0) {
  if (busy) return;
  busy = true;
  const first = !state.data.owner;
  persistOwner();
  const key = ctx.key, core = app.room === 'CORE';
  const kn = ctx.keyNav;
  try {
    if (first) {
      // The t₀-anchored slots run on their own clock (a late hit on a stalled frame never pushes the words back).
      at(t0 + 1120, () => {
        const ms = beamMs(LEAD_1);
        if (ctx.fx && has(ctx.fx, 'provalFor')) safe('owner:proval', () => ctx.fx.provalFor(ms));
        lead(LEAD_1, { beam: true, ms: 2100 });
        if (kn && has(kn, 'flashAll')) safe('owner:white', () => kn.flashAll(400, 'white'));
      });
      at(t0 + 4000, () => { lead(`Привет, ${NAME()}.`, { ms: 3000 }); busy = false; });
      const fx = ctx.fx;
      const r = fx && fx.pieces && has(fx.pieces, 'owner')
        ? await fx.pieces.owner({ room: app.room }).catch(() => null)
        : null;
      const hit = r && Number.isFinite(r.hitAt) ? r.hitAt : perf();
      // the hit (t₀ + 520): electrum nucleus, the owner sound, the bow (CORE, 600 ms)
      if (key && has(key, 'flashNucleus')) safe('owner:flash', () => key.flashNucleus('electrum', TIMING.electrum));
      audio.play('owner', {});
      if (core && key && has(key, 'bow') && !reduced()) safe('owner:bow', () => key.bow());
      // the rim re-burns his name when the wave reaches it (CORE, t₀ + 1,395)
      if (core && r && Number.isFinite(r.rimAt) && ctx.rim && has(ctx.rim, 'burn')) {
        safe('owner:rim', () => ctx.rim.burn({ dir: 'ltr', msPerLetter: TIMING.burnMsPerLetter, at: r.rimAt }));
      }
      // t₀ + 3,620: the S05 shard leaves once the nucleus electrum has cooled (hit + 3,100)
      at(Math.max(t0 + 3620, hit + 3100), discoverS05);
    } else {
      if (key && has(key, 'flashNucleus')) safe('owner:flash', () => key.flashNucleus('electrum', TIMING.electrum));
      if (core && key && has(key, 'bow') && !reduced()) safe('owner:bow', () => key.bow());
      if (kn && has(kn, 'flashAll')) safe('owner:ember', () => kn.flashAll(breath.periodMs || 4200, 'ember'));
      const ms = beamMs(LEAD_1);
      const proval = ctx.fx && has(ctx.fx, 'provalFor') ? ctx.fx.provalFor(ms) : new Promise((res) => after(ms, res));
      lead(LEAD_1, { beam: true, ms: 1700 });
      // the B4 bell lands on the bed's return (A6.5.6)
      Promise.resolve(proval).catch(() => null).then(() => after(60, () => audio.play('owner', {})));
      discoverS05();                                              // a profile with owner:true but no S05 yet
      after(2900, () => { lead(`Привет, ${NAME()}.`, { ms: 3000 }); busy = false; });
    }
  } catch (e) {
    busy = false;
    logOnce('secrets:owner', e);
  }
}

function onWord(w) {
  if (!w) return;
  if (w.kind === 'owner') {
    audio.play('chisel', {});
    recognize(perf());
  } else if (w.kind === 'member') {
    audio.play('select', {});
    say('member.typed', { callsign: w.ref.callsign });
  } else if (w.kind === 'joke') {
    const j = w.ref;
    audio.play('wordBell', {});
    lead(j.text, { beam: true, ms: 3200 });
    if (!state.data.jokesFound.includes(j.id)) state.patch((d) => { d.jokesFound.push(j.id); });
  }
}

function onKey(e) {
  if (app.booting || app.phase === 'boot' || app.phase === 'start') return;
  const w = feedKey(e);
  if (!w) return;
  // the completing key belongs to the word (the M of «sam» must not also toggle the sound)
  try { e.stopImmediatePropagation(); } catch (err) { /* ignore */ }
  onWord(w);
}

// ─── The «Кто ты?» sheet ─────────────────────────────────────────────────────────────────────────────────────
function buildSheet() {
  sheet = createSheet({ id: 'sheet-owner' });
  sheet.el.dataset.qa = 'owner-sheet';
  sheet.el.classList.add('sec-owner');
  const q = document.createElement('p');
  q.className = 't-body sec-owner-q';
  q.textContent = 'Кто ты?';
  input = document.createElement('input');
  input.type = 'text';
  input.className = 't-body sec-owner-input';
  input.maxLength = 24;
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'words');
  input.setAttribute('aria-label', 'Кто ты?');
  input.dataset.qa = 'owner-input';
  const done = document.createElement('button');
  done.type = 'button';
  done.className = 'verb t-label sec-owner-done';
  done.textContent = 'ГОТОВО';
  done.dataset.qa = 'owner-done';
  const row = document.createElement('div');
  row.className = 'sec-owner-row';
  row.append(input, done);
  sheet.body.append(q, row);
  done.addEventListener('click', submit);
  // the finger that long-pressed is still down when the sheet opens: its lift must not count as a tap on the veil
  const veil = sheet.el.previousElementSibling;
  if (veil && veil.classList.contains('sheet-veil')) {
    veil.addEventListener('click', (e) => { if (performance.now() - openedAt < 700) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  }
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
}

function openSheet() {
  if (!sheet) buildSheet();
  input.value = '';
  openedAt = performance.now();
  sheet.open();
  audio.play('select', {});
}

function submit() {
  if (!sheet) return;
  const text = input.value;
  try { input.blur(); } catch (e) { /* ignore */ }
  sheet.close();
  const w = matchWord(text);
  // t₀ = the sheet finishing its 240 ms close
  after(240, () => { if (w) { if (w.kind === 'owner') { audio.play('chisel', {}); recognize(perf()); } else onWord(w); } });
}

function installLongPress(el) {
  if (!el) return;
  // real time (not loop time): at a few frames per second a loop-time timer would land after his finger lifts
  let timer = 0, x0 = 0, y0 = 0, id = -1;
  const cancel = () => { if (timer) { clearTimeout(timer); timer = 0; } id = -1; };
  el.addEventListener('pointerdown', (e) => {
    cancel();
    id = e.pointerId; x0 = e.clientX; y0 = e.clientY;
    timer = setTimeout(() => { timer = 0; id = -1; if (!app.booting) openSheet(); }, TIMING.longPress);
  });
  el.addEventListener('pointermove', (e) => { if (e.pointerId === id && Math.hypot(e.clientX - x0, e.clientY - y0) > 8) cancel(); });
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointercancel', cancel);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}

export function initOwner(c) {
  ctx = c;
  if (c.input && has(c.input, 'observeKeys')) c.input.observeKeys(onKey);
  installLongPress(c.chrome && c.chrome.el && c.chrome.el.tlName);
  // a returning owner: the title already carries his name
  if (app.owner) bus.on('boot:done', () => { try { document.title = titleFor(app.route); } catch (e) { /* ignore */ } });
}
