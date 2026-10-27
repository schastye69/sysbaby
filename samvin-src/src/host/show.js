// host/show.js — «ПОКАЗ»: the host conducts the world for his guests (SPEC-ADDENDUM A4.2 as amended by A11.3 / A11.7,
// O22 / O23; ARCH-ADDENDUM X§2.6.6). OWNER: WP13. A MODE, not a route: app.show = { active, scene }. Nothing advances
// unless he presses ДАЛЬШЕ → (or → / Space / PgDn); ← / PgUp goes back; Esc or ВЫЙТИ ends it (the world restores over
// 600 ms). Scenes never auto-advance; when a scene's gesture completes the ДАЛЬШЕ → underline draws once.
//   0 ТЕМНОТА      RECALL to CORE; the Key sleeps (golden scramble 900 ms, nucleus dark), chrome → 0 except the strip
//                  (navigator 30 %), bed → −60 dB, the rim names go dark; «разбуди меня.»
//   1 ПРОБУЖДЕНИЕ  waits for him; his click / stroke → the wake (WP2, ctx.wake({show:true})): his name on the wave, the
//                  guests 600 ms after (with their bells), LEAD «Добро пожаловать в SAM.VIN.»; the chrome reassembles
//   2 КЛАН         DIVE to MEMBERS; +1,200 ms the one-time ghost ring on his capital (hint 'sbor'); he holds → СБОР
//   3 ИМЕНА        RECALL; the S01 ghost press ring; his holds write the guests' names in sand (WP4), then his own
//   4 МАСШТАБ      the S02 ghost zoom; the PULL with «ТЫ» (WP4/WP12). Skipped in T0
//   5 СНАРУЖИ      the hull descent (hullPath.js, director.play; any input → end pose in 600 ms). Skipped in T0
//   6 ФИНАЛ        (a) earned laws: the Key yaws to its back 2,400 ms with their leaders; (b) the Key bows TO THE ROOM
//                  (the S05 bow, 8° toward the camera) + nucleus electrum; LEAD «SAM.VIN. Основатель — {Имя}.» (4,000);
//                  +600 `clan.about` BODY (to 6,000; omitted when ""); then LEAD `{clan.motto}` (2,400); (c) СВЁРТКА
//                  (context 'show') → «сплю. разбуди меня.»; the strip offers СНОВА (→ scene 1, guests stay) / ВЫЙТИ
// Completing scene 6: deed `host` (ПОКАЗ), a `показ` band (shows.log), shows.count + 1, show:end {completed:true}.
// ВЫЙТИ / Esc / 20 s without input after the finale re-ignite the world with the same-day lock (7 × 110 ms, no ПАУЗА).
import { Vector3 } from 'three';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { loop, ORDER } from '../core/loop.js';
import { after, cancelAfter, tween } from '../core/clock.js';
import { input } from '../core/input.js';
import { layout } from '../core/layout.js';
import { keyboard } from '../nav/keyboard.js';
import { registerSpecial, buildSpecial } from '../nav/paths.js';
import { upper } from '../core/ru.js';
import { WORLD } from '../data/world.js';
import { KEY } from '../core/tokens.js';
import { ROOMS } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt, codeCapHeightM } from '../world/structure.js';
import { earnedStrata } from '../deeds/deedsModel.js';
import { createStrip } from './strip.js';
import { buildHull } from './hullPath.js';
import { el, reduced, wait } from './dom.js';
import { revealBody } from '../ui/text.js';

const GOLD = (137.508 * Math.PI) / 180;
const OV = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ yaw: Math.atan2(Math.sin(i * GOLD), Math.cos(i * GOLD)) }));
const ORIGIN = new Vector3();

export function createShow(ctx) {
  registerSpecial('hull', (start, opts) => buildHull(start, opts));
  const S = {
    gen: 0, mode: 'scene', asleep: false, waking: null, woke: false, ended: false, consumer: null, popKey: null,
    offDown: null, offs: [], sceneOffs: [], idleT: 0, own: 0, about: null, hullTick: 0, wind: null, keyOv: false,
    settling: false, wakePending: false,
  };
  const strip = createStrip({ next: () => api.next(), back: () => api.back(), again: () => again(), exit: () => api.exit() });
  const live = () => app.show.active;
  const T0 = () => app.tier === 'T0';
  const k = () => ctx.key;

  function clearSceneOffs() { for (const o of S.sceneOffs) { try { o(); } catch (e) { /* gone */ } } S.sceneOffs = []; }
  const onScene = (name, fn) => { S.sceneOffs.push(ctx.bus.on(name, fn)); };
  /** a travel the show itself starts (any other travel while live = he left the script through the navigator) */
  async function go(hash) {
    if (!ctx.director) return false;
    S.own++;
    try { return await ctx.director.go(hash, { source: 'show' }); } finally { S.own--; }
  }
  async function toCoreIdle() {
    if (ctx.director && ctx.director.busy()) { ctx.director.speedUp(); await new Promise((r) => { const off = ctx.bus.on('travel:end', () => { off(); r(); }); }); }
    if (app.room !== 'CORE') await go('#/core');
  }

  // ─── the sleeping Key and the dark world (scene 0) ──────────────────────────────────────────────────────────────
  function keyOverride(on) {
    const key = k();
    if (!key || !key.override) return;
    for (let i = 0; i < 7; i++) key.override(i, on ? OV[i] : null);
    S.keyOv = on;
    if (!on) key.setOverrideWeight(0);
  }
  async function sleep(g) {
    S.asleep = true; S.woke = false;
    document.body.classList.add('show-dark');
    if (ctx.audio && ctx.audio.bed) ctx.audio.bed.duck(-60, 600);
    const rim = ctx.rim, names = ctx.host.guests ? ctx.host.guests.names() : [];
    if (rim) {
      if (names.length && rim.burnGuests) rim.burnGuests(names, { height: ctx.host.guests.letterHeightM(), gapMs: 240, msPerLetter: 70 });
      if (rim.hideName) rim.hideName(); else if (rim.clearGuests) rim.clearGuests();
      if (rim.setLitNodes) rim.setLitNodes(0);                       // the horizon goes dark with him
    }
    if (ctx.status) ctx.status.say('show.dark', {}, { force: true });
    const key = k();
    // his click may come while the Key is still falling asleep: it is kept and wakes it as soon as it sleeps
    if (!layout.isPhone) installWakeConsumer();
    S.settling = true;
    if (key) {
      key.setInteractive(false);                                      // asleep: no hover reading, no drag
      key.setIdle(false);
      key.douse();
      key.setBreathingRing(false);
      keyOverride(true);
      if (reduced()) key.setOverrideWeight(1);
      else await tween(900, (x) => key.setOverrideWeight(x)).done;
      if (g !== S.gen) { S.settling = false; return; }
      key.setScramble('golden');
      keyOverride(false);
    }
    S.settling = false;
    // phone: the wake IS the start screen's stroke (WP2), so the dark Key waits for that stroke directly
    if (layout.isPhone && key && ctx.wake) { wake(g); return; }
    installWakeConsumer();
    if (S.wakePending) { S.wakePending = false; wakeFromInput(); }
  }
  function installWakeConsumer() {
    if (S.consumer) return;
    const c = {
      name: 'show-asleep',
      onGesture(gs) {
        if (gs.type === 'hover' || gs.type === 'leave') return false;
        if (gs.type === 'tap' || gs.type === 'swipe' || gs.type === 'dragend') wakeFromInput();
        return true;
      },
    };
    S.consumer = { off: input.push(c) };
  }
  function removeWakeConsumer() { if (S.consumer) { S.consumer.off(); S.consumer = null; } }
  function wakeFromInput() {
    if (!S.asleep || S.waking) return;
    if (S.settling) { S.wakePending = true; return; }
    if (app.show.scene === 0 || app.show.scene === 6) setScene(1);
    wake(S.gen);
  }
  /** scene 1's wake (WP2) + the guests' burn on the wave with their bells, then LEAD */
  async function wake(g) {
    removeWakeConsumer();
    const rim = ctx.rim;
    const guests = ctx.host.guests;
    let burnt = null;
    const welcome = () => { if (g === S.gen && live() && ctx.lead) ctx.lead.show('Добро пожаловать в SAM.VIN.', { ms: 4000 }); strip.pulseNext(); };
    if (rim && guests && guests.names().length && rim.reburnGuests) {
      // WP2's wake calls rim.reburnGuests() after his name: it is routed through WP13's burn, which adds the guestBurn
      // bells on the cue clock (A4.1) and tells us when the last name has cooled (then the LEAD).
      const orig = rim.reburnGuests;
      rim.reburnGuests = () => { rim.reburnGuests = orig; burnt = guests.burnNow(); burnt.then(welcome); return burnt; };
      S.sceneOffs.push(() => { if (rim.reburnGuests !== orig) rim.reburnGuests = orig; });
    }
    keyOverride(false);
    S.waking = ctx.wake ? Promise.resolve(ctx.wake({ show: true })).catch(() => {}) : Promise.resolve();
    await S.waking;
    S.waking = null;
    if (g !== S.gen) return;
    if (app.show.scene === 0) setScene(1);
    S.asleep = false; S.woke = true;
    document.body.classList.remove('show-dark');
    if (ctx.audio && ctx.audio.bed) ctx.audio.bed.duck(0, 1200);
    clearDarkLine();
    const key = k();
    if (key) { key.setIdle(true); key.setInteractive(true); }
    if (!burnt) {
      if (guests && guests.names().length && rim && rim.burnGuests) { await wait(600); if (g !== S.gen) return; burnt = guests.burnNow(); burnt.then(welcome); }
      else welcome();
    }
  }
  /** the same-day lock (7 × 110 ms, no ПАУЗА, no ПРОСВЕТ) — ВЫЙТИ, Esc, 20 s idle, or a scene skipped while asleep */
  async function reignite() {
    removeWakeConsumer();
    if (ctx.fx && ctx.fx.pieces && ctx.fx.pieces.wakeReset) ctx.fx.pieces.wakeReset();
    keyOverride(false);
    const key = k();
    document.body.classList.remove('show-dark');
    if (ctx.audio && ctx.audio.bed) ctx.audio.bed.duck(0, 600);
    const rim = ctx.rim;
    if (rim) { if (rim.showName) rim.showName(); if (rim.reburnGuests && ctx.host.guests && ctx.host.guests.names().length) rim.reburnGuests(); }
    S.asleep = false; S.woke = true;
    clearDarkLine();
    if (key) {
      key.setScramble('golden');
      key.ignite({});
      key.setBreathingRing(true);
      key.setIdle(true);
      await key.lockSequence({ stepMs: 110 });
      key.setInteractive(true);
    }
  }

  /** the dark scene's «разбуди меня.» / the finale's «сплю. разбуди меня.» leave with the dark */
  function clearDarkLine() {
    const cur = ctx.status && ctx.status.current;
    if (cur && (cur.key === 'show.dark' || cur.key === 'relaunch') && ctx.status.clear) ctx.status.clear();
  }

  // ─── scenes ─────────────────────────────────────────────────────────────────────────────────────────────────────
  function setScene(i) {
    app.show.scene = i;
    strip.set(i, S.mode === 'off' ? 'off' : i === 6 && S.ended ? 'end' : 'scene');
    bus.emit('show:scene', { index: i });
  }
  async function enter(i) {
    S.gen++;
    const g = S.gen;
    clearSceneOffs();
    S.mode = 'scene';
    hullStop();
    if (S.about) { S.about.remove(); S.about = null; }
    setScene(i);
    if (S.asleep && i >= 2) {
      // a wake still waiting for him (the phone start screen) ends here: its layer goes, the chrome and band return
      if (S.waking) { if (ctx.wake && ctx.wake.end) ctx.wake.end(); await S.waking; }
      if (g !== S.gen) return;
      if (S.asleep) await reignite();
    }
    if (g !== S.gen) return;
    try { await SCENES[i](g); } catch (e) { /* a scene's failure leaves the show navigable */ }
  }
  const SCENES = [
    // 0 ТЕМНОТА
    async (g) => {
      await toCoreIdle();
      if (g !== S.gen) return;
      await ctx.fx.stage.run('show', () => sleep(g), { maxWaitMs: 1200 });
    },
    // 1 ПРОБУЖДЕНИЕ
    async (g) => {
      if (!S.asleep) { await toCoreIdle(); if (g !== S.gen) return; await sleep(g); }
      if (g !== S.gen) return;
      installWakeConsumer();
    },
    // 2 КЛАН
    async (g) => {
      await go('#/members');
      if (g !== S.gen) return;
      const t = after(1200, () => { if (g === S.gen && ctx.hint) ctx.hint.playMotion('sbor', { source: 'show' }); });
      S.sceneOffs.push(() => cancelAfter(t));
      onScene('sbor:done', () => strip.pulseNext());
    },
    // 3 ИМЕНА
    async (g) => {
      await toCoreIdle();
      if (g !== S.gen) return;
      if (ctx.hint) ctx.hint.playMotion('S01', { source: 'show' });
      onScene('resonance:done', () => strip.pulseNext());
    },
    // 4 МАСШТАБ
    async (g) => {
      await toCoreIdle();
      if (g !== S.gen) return;
      if (ctx.hint) ctx.hint.playMotion('S02', { source: 'show' });
      onScene('pull:done', () => strip.pulseNext());
    },
    // 5 СНАРУЖИ
    async (g) => {
      await toCoreIdle();
      if (g !== S.gen || !ctx.director || !ctx.key) return;
      const path = buildSpecial('hull', ctx.director.pose(), { laws: earnedStrata().length > 0, tier: app.tier, reduced: reduced() });
      if (!path) return;
      hullStart(path);
      S.own++;
      try { await ctx.director.play(path, { source: 'show', skipMs: 600 }); } finally { S.own--; }
      hullStop();
      if (g === S.gen) strip.pulseNext();
    },
    // 6 ФИНАЛ
    async (g) => finale(g),
  ];

  // ─── scene 5 helpers: the lamp on the hull, the wind outside, the КОДЕКС height MICRO ─────────────────────────────
  const faceF = STRATA_GEOM.map(() => new Vector3()), faceN = STRATA_GEOM.map(() => new Vector3());
  const _d = new Vector3();
  for (const st of STRATA_GEOM) {
    const jb = Math.floor(st.n / 2), a = (Math.PI * 2 * jb) / st.n;
    const ap = radiusAt(st.mid) * Math.cos(Math.PI / st.n) * 1000;
    faceF[st.i].set(Math.sin(a) * ap, st.mid * 1000, Math.cos(a) * ap);
    faceN[st.i].set(Math.sin(a), 0, Math.cos(a));
  }
  const cos40 = Math.cos((40 * Math.PI) / 180);
  let earnedNow = [];
  // the bed root glides with the altitude outside the hull (SPEC §9.5): between the two strata bracketing the camera
  const BY_ALT = ['NADIR', 'INSIGNIA', 'VOYAGES', 'CORE', 'MEMBERS', 'ARCHIVE', 'SIGNAL'].filter((id) => ROOMS[id]);
  function rootGlide(y) {
    if (!ctx.audio || !ctx.audio.setRootU) return;
    let k = 0;
    while (k < BY_ALT.length - 2 && ROOMS[BY_ALT[k + 1]].alt < y) k++;
    const a = ROOMS[BY_ALT[k]], b = ROOMS[BY_ALT[k + 1]];
    ctx.audio.setRootU(a.id, b.id, Math.max(0, Math.min(1, (y - a.alt) / Math.max(1, b.alt - a.alt))));
  }
  function hullFrame() {
    const cam = ctx.rig && ctx.rig.camera;
    if (!cam) return;
    rootGlide(cam.position.y / Math.max(1e-6, ctx.scale ? ctx.scale.s || 1 : 1));
    let best = -1, bc = cos40;
    for (let q = 0; q < earnedNow.length; q++) {
      const i = earnedNow[q];
      _d.copy(cam.position).sub(faceF[i]);
      const len = _d.length();
      if (len < 1e-6) continue;
      const c = _d.dot(faceN[i]) / len;                            // the face turned to the view direction within 40°
      if (c > bc) { bc = c; best = i; }
    }
    strip.codex(best >= 0 ? HULL_TXT[best] : null);
  }
  const HULL_TXT = STRATA_GEOM.map((st) => `КОДЕКС · ВЫСОТА БУКВ ${Math.round(codeCapHeightM(st.i, 1000))} М`);
  function hullStart(path) {
    earnedNow = earnedStrata();
    if (ctx.lamp) ctx.lamp.setFocus(ORIGIN, 620);
    if (!S.hullTick) S.hullTick = loop.add(hullFrame, ORDER.UI);
    if (!reduced() && path && path.hull) {
      const tw = after(1500, () => { if (!S.wind) S.wind = ctx.audio.start('wind', { level01: 0.3 }); });
      const tw2 = after(Math.max(2000, path.hull.tHelix), () => { if (S.wind) { S.wind.stop(600); S.wind = null; } });
      S.sceneOffs.push(() => { cancelAfter(tw); cancelAfter(tw2); });
    }
  }
  function hullStop() {
    if (S.hullTick) { loop.remove(S.hullTick); S.hullTick = 0; }
    strip.codex(null);
    if (S.wind) { try { S.wind.stop(300); } catch (e) { /* gone */ } S.wind = null; }
    if (ctx.lamp) ctx.lamp.setFocus(ORIGIN, KEY.radius);
    if (ctx.audio && ctx.audio.setRootU) ctx.audio.setRootU('CORE', 'CORE', 1);
  }

  // ─── 6 ФИНАЛ ────────────────────────────────────────────────────────────────────────────────────────────────────
  async function finale(g) {
    await toCoreIdle();
    if (g !== S.gen) return;
    const key = k();
    const rm = reduced();
    if (key) key.setInteractive(false);                              // the finale is his to watch, not to hover-read
    // (a) the earned laws on the back (no ceremony)
    if (earnedStrata().length && key) {
      key.yawTo(180, rm ? 0 : 900);
      await wait(rm ? 0 : 700);
      if (g !== S.gen) return;
      ctx.deeds.readHold(true);
      await wait(rm ? 2400 : 1700);
      ctx.deeds.readHold(false);
      if (g !== S.gen) return;
      await key.yawTo(0, rm ? 0 : 900);
      if (g !== S.gen) return;
    }
    // (b) the bow to the room + the founder, who we are, the motto
    if (key) { key.bow(); key.flashNucleus('electrum', 2500); }
    const name = WORLD.operator.name;
    if (ctx.lead) ctx.lead.show(`SAM.VIN. Основатель — ${name}.`, { ms: 4000 });
    const about = String((WORLD.clan && WORLD.clan.about) || '').trim();
    if (about) {
      await wait(600);
      if (g !== S.gen) return;
      S.about = showAbout(about);
      await wait(5400);
      if (S.about) { S.about.remove(); S.about = null; }
    } else await wait(4000);
    if (g !== S.gen) return;
    const motto = String((WORLD.clan && WORLD.clan.motto) || '').trim();
    if (motto && ctx.lead) { await ctx.lead.show(motto, { ms: 2400 }); }
    if (g !== S.gen) return;
    // (c) СВЁРТКА → «сплю. разбуди меня.»; the horizon goes dark with the zero (1,850 ms; the names stay for СНОВА)
    const rim = ctx.rim;
    const darkRim = () => { if (rim) { if (rim.hideName) rim.hideName(); if (rim.setLitNodes) rim.setLitNodes(0); } };
    const tZero = after(1850, darkRim);
    if (ctx.fx && ctx.fx.pieces && ctx.fx.pieces.fold) await ctx.fx.pieces.fold({ context: 'show' });
    cancelAfter(tZero);
    if (g !== S.gen) return;
    darkRim();
    S.asleep = true; S.woke = false;
    if (key) { key.douse(); key.setIdle(false); }
    if (ctx.status) ctx.status.say('relaunch');
    complete();
    installWakeConsumer();
    armIdle();
  }
  function showAbout(text) {
    const host = strip.el.parentNode ? strip.el : document.body;
    const b = el('p', 't-body show-about scrim', text, null, { qa: 'show-about' });
    (document.getElementById('frame') || host).appendChild(b);
    b.classList.add('is-in');
    revealBody(b, { maxMs: 480 });
    return { remove() { b.classList.remove('is-in'); b.style.transition = 'opacity .24s linear'; b.style.opacity = '0'; after(260, () => b.remove()); } };
  }
  function complete() {
    if (S.ended) return;
    S.ended = true;
    strip.set(6, 'end');
    if (ctx.deeds) ctx.deeds.done('host', { name: 'ПОКАЗ' });
    const ids = ctx.host.guests ? ctx.host.guests.rosterIds() : [];
    const n = ctx.host.guests ? ctx.host.guests.names().length : 0;
    state.patch((d) => {
      if (!d.shows || typeof d.shows !== 'object') d.shows = { count: 0, lastDay: null };
      d.shows.count = (d.shows.count | 0) + 1;
      d.shows.lastDay = state.today;
      if (!Array.isArray(d.shows.log)) d.shows.log = [];
      d.shows.log = d.shows.log.filter((e) => e && e.day !== state.today);
      d.shows.log.push({ day: state.today, guests: n, who: ids });
      if (d.shows.log.length > 120) d.shows.log.splice(0, d.shows.log.length - 120);
    });
    bus.emit('show:end', { completed: true });
  }
  function armIdle() {
    if (S.idleT) cancelAfter(S.idleT);
    S.idleT = after(20000, () => { S.idleT = 0; if (live() && S.ended) api.exit(); });
  }
  /** СНОВА → scene 1, the guests stay */
  function again() {
    if (!live()) return;
    S.ended = false;
    if (S.idleT) { cancelAfter(S.idleT); S.idleT = 0; }
    const rim = ctx.rim;
    if (rim && rim.hideName) rim.hideName();
    S.asleep = true;
    enter(1);
  }

  // ─── input while live ───────────────────────────────────────────────────────────────────────────────────────────
  function onKey(e) {
    if (!live()) return false;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': api.next(); return true;
      case 'ArrowLeft': case 'PageUp': api.prev(); return true;
      case 'Escape': api.exit(); return true;
      default: return false;
    }
  }

  const api = {
    get active() { return !!app.show.active; },
    get scene() { return app.show.scene; },
    start() {
      if (live()) return;
      S.ended = false; S.mode = 'scene';
      app.show.active = true; app.show.scene = 0;
      strip.show();
      if (ctx.chrome && ctx.chrome.setTLMicro) ctx.chrome.setTLMicro(`ПОКАЗ · ВЕДЁТ ${upper(WORLD.operator.name)}`);
      document.body.classList.add('show-on');
      S.popKey = keyboard.pushHandler(onKey);
      S.offDown = input.observeDown(() => { if (S.idleT) armIdle(); });
      S.offs.push(ctx.bus.on('travel:start', () => {
        if (!live() || S.own > 0 || (ctx.director && ctx.director.playing)) return;
        S.mode = 'off'; strip.set(app.show.scene, 'off');        // he left the script through the navigator
      }));
      if (ctx.host.guests) ctx.host.guests.close();
      enter(0);
    },
    next() {
      if (!live() || S.ended) return;
      if (S.mode === 'off') { api.back(); return; }
      let i = app.show.scene + 1;
      if (T0() && (i === 4 || i === 5)) i = 6;
      if (i > 6) return;
      if (ctx.director && ctx.director.busy()) ctx.director.speedUp();
      enter(i);
    },
    prev() {
      if (!live()) return;
      let i = app.show.scene - 1;
      if (T0() && (i === 4 || i === 5)) i = 3;
      if (i < 0) return;
      S.ended = false;
      if (ctx.director && ctx.director.busy()) ctx.director.speedUp();
      enter(i);
    },
    /** dev / QA: straight to scene i (starts the show if needed; the scenes in between do not run) */
    jump(i) { if (!live()) api.start(); enter(Math.max(0, Math.min(6, i | 0))); },
    /** ВЕРНУТЬСЯ К ПОКАЗУ: back to the current scene */
    back() { if (live()) enter(app.show.scene); },
    exit() {
      if (!live()) return;
      S.gen++;
      clearSceneOffs(); hullStop();
      if (S.about) { S.about.remove(); S.about = null; }
      if (S.idleT) { cancelAfter(S.idleT); S.idleT = 0; }
      if (S.popKey) { S.popKey(); S.popKey = null; }
      if (S.offDown) { S.offDown(); S.offDown = null; }
      for (const o of S.offs) { try { o(); } catch (e) { /* gone */ } }
      S.offs = [];
      removeWakeConsumer();
      S.settling = false; S.wakePending = false;
      if (ctx.deeds) ctx.deeds.readHold(false);
      if (ctx.director && ctx.director.busy()) ctx.director.speedUp();
      const wasAsleep = S.asleep && !S.waking;
      const completed = S.ended;
      app.show.active = false; app.show.scene = -1;
      strip.hide();
      document.body.classList.remove('show-on');
      if (ctx.chrome && ctx.chrome.setTLMicro) ctx.chrome.setTLMicro(null);
      if (wasAsleep) reignite();
      else {
        document.body.classList.remove('show-dark');
        if (ctx.audio && ctx.audio.bed) ctx.audio.bed.duck(0, 600);
        keyOverride(false);
        const key = k();
        if (key && !S.waking) { key.yawTo(0, 600); key.setIdle(true); key.setInteractive(true); }
      }
      S.ended = false;
      if (!completed) bus.emit('show:end', { completed: false });
      after(800, () => { if (ctx.deeds && ctx.deeds.requestCeremony) ctx.deeds.requestCeremony(); });
    },
  };
  return api;
}
