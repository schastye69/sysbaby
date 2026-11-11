// secrets/night.js — S10 НОЧЬ, drowsy and the birthday (SPEC §8.1 S10 + «Birthday», §8.4; SPEC-ADDENDUM A6.5.6;
// ARCH §6.11). OWNER: WP10 (app.night after boot, app.drowsy, 'night:change').
// Night = local 21:00–06:59 (WORLD.night) at load — WP0 already boots the palette in night — or when the clock crosses
// 21:00 while he is here (checked every 15 s of loop time and on every return to the tab). Asleep, cosy: the nucleus
// glows electrum at 55 % (palette.setNight → U.uNight), breath 7,000 ms, lit nodes as warm windows at 70 % (WP1/WP0
// listen to 'night:change'), the drone a fourth lower and −3 dB (audio.setNight), status «спокойной ночи, {имя}.»; the
// discovery S10 follows once that line has been read («Ты видел, как VIN спит.»). The tab-away «…сплю» is WP0's (it reads
// app.night); the night flinch yawn is WP1's. Drowsy from 20:00: breath 5,600 ms + «скоро ночь.». Morning (07:00) gives
// the day palette back.
// Birthday (operator.birthday's day and month; WP0 sets app.birthday): the GIANT numeral in CORE is his age, outlined
// in electrum all day (datum.setGiant), the nucleus pulses ×1.3 (key.setNucleusPulse), status «с днём рождения, {имя}!»,
// and once a day LEAD «С днём рождения, {Имя}» BEAM WRITES with ПРОВАЛ under it (birthdayLeadDay persisted).
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { after, breath } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { palette } from '../render/palette.js';
import * as time from '../core/time.js';
import { NIGHT, BREATH, TIMING } from '../core/tokens.js';
import { W, has, say, safe, nameVars, NAME, keyScreen } from './util.js';

const CHECK_MS = 15000;
let ctx = null;
const K = { x: 0, y: 0, r: 0 };

function breathFor() { return app.night ? NIGHT.breathMs : app.drowsy ? NIGHT.drowsyBreathMs : BREATH.periodMs; }

function setNight(b) {
  if (app.night === b) return;
  app.night = b;
  if (b) app.drowsy = false;
  if (ctx.renderer) safe('night:palette', () => palette.setNight(b));
  else if (typeof document !== 'undefined') {             // T0: the CSS night (tokens.css [data-night])
    if (b) document.documentElement.setAttribute('data-night', ''); else document.documentElement.removeAttribute('data-night');
  }
  breath.setPeriod(breathFor());
  audio.setNight(b);
  bus.emit('night:change', { night: b });
  if (b) say('night', nameVars());
}

function setDrowsy(b) {
  if (app.drowsy === b) return;
  app.drowsy = b;
  breath.setPeriod(breathFor());
  if (b) say('drowsy');
}

function check() {
  const t = time.now();
  setNight(time.isNight(t));
  setDrowsy(!app.night && time.isDrowsy(t));
}
function tick() { check(); after(CHECK_MS, tick); }

function discoverS10() {
  if (!app.night || !ctx.secrets) return;
  keyScreen(K);
  safe('night:discover', () => ctx.secrets.discover('S10', { anchor: { x: K.x, y: K.y } }));
}

// ─── birthday ───────────────────────────────────────────────────────────────────────────────────────────────────
function giantForRoom(room) {
  if (!app.birthday || !ctx.datum || !has(ctx.datum, 'setGiant')) return;
  const age = time.ageOn(time.now());
  safe('bday:giant', () => ctx.datum.setGiant(room === 'CORE' && age > 0 ? String(age) : null, { electrum: room === 'CORE' }));
}

function birthdayLead() {
  const d = state.data;
  if (!d || d.birthdayLeadDay === state.today) return;
  state.set('birthdayLeadDay', state.today);
  const text = `С днём рождения, ${NAME()}`;
  const ms = Math.round([...text].length * (1000 / TIMING.beamCps));
  if (ctx.fx && has(ctx.fx, 'provalFor')) safe('bday:proval', () => ctx.fx.provalFor(ms));
  if (ctx.lead && has(ctx.lead, 'show')) safe('bday:lead', () => ctx.lead.show(text, { beam: true, ms: 3600 }));
  audio.play('wordBell', {});
}

function onBootDone() {
  if (app.night) say('night', nameVars());
  else if (app.drowsy) say('drowsy');
  if (app.birthday) {
    say('birthday', nameVars());
    after(600, birthdayLead);
  }
  after(CHECK_MS, tick);
}

export function initNight(c) {
  ctx = c;
  // at load: WP0 set app.night / app.drowsy / app.birthday and the night palette; the breath and the drone are ours
  breath.setPeriod(breathFor());
  if (app.night) audio.setNight(true);
  if (app.birthday) {
    if (c.key && has(c.key, 'setNucleusPulse')) safe('bday:pulse', () => c.key.setNucleusPulse(1.3));
    giantForRoom('CORE');
    bus.on('room:arrive', (e) => giantForRoom(e && e.room));
    bus.on('travel:start', (e) => giantForRoom(e && e.to ? e.to.room : null));
  }
  bus.on('boot:done', onBootDone);
  bus.on('visibility', (e) => { if (e && !e.hidden && !app.booting) check(); });
  // «Ты видел, как VIN спит»: found once the good-night line has been read
  bus.on('status:show', (e) => { if (e && e.key === 'night') after(TIMING.statusHold + 200, discoverS10); });
  void W;
}
