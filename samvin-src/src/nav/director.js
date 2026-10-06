// nav/director.js — the one driver of u ∈ [0, 1] (ARCH §3.6.2–§3.6.4, §3.16 history; SPEC §5.3, §7).
//
// go(target) → FOCUS (same room, hall.setSub) | travel (DIVE / RECALL / LIFT / SLICE / a hall's entryPath) | retarget
// (mid-flight: new path from the LOGICAL room, current pose, current scale, velocity tangent). Every frame of a travel
// evaluates the path's PURE pose(u) and applies it: swap crossings (rebase forward, unrebase backward while
// scrubbing), the scale root, the rig, fog, nest level fades, VIN per-stratum fades + gap, the Key morph channel, rim /
// pillar / shell alphas and irises, the halls' exit(u) / enter(u), the navigator needle, the elevator counter and
// codename flashes, live voices and cues. Arrival performs ARCH §3.6.2 step 7 (history, title, datum, lock …).
// Idle frames hand the camera to the current hall's livePose() (or its rest pose). While app.phase is 'boot' / 'start'
// the camera belongs to the boot (WP2) and the director does not write it.
import { Vector3 } from 'three';
import { app, setPhase } from '../core/store.js';
import { bus } from '../core/bus.js';
import { loop, ORDER } from '../core/loop.js';
import { after, cancelAfter } from '../core/clock.js';
import { ENV } from '../core/env.js';
import { EASE, clamp01 } from '../core/ease.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { ROOMS, ROOM_ORDER } from '../world/rooms.js';
import { nest } from '../world/nest.js';
import { scaleEngine } from '../render/scale.js';
import { rig } from '../render/cameraRig.js';
import { fog } from '../render/fog.js';
import { hallHost } from '../halls/host.js';
import { parseHash, applyGuards, titleFor } from './router.js';
import {
  buildDive, buildRecall, buildLift, buildSlice, buildRetarget, transitionKind, configurePaths, createPoseOut, copyPoseOut,
} from './paths.js';
import { tOfU } from './pathKit.js';
import { TIMING, MOTION } from '../core/tokens.js';

const out = createPoseOut();          // written by path.pose every frame
const cur = createPoseOut();          // the last APPLIED pose (retarget start)
const tmp = createPoseOut();
const restCache = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
const live = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
const applied = { strata: new Float32Array([1, 1, 1, 1, 1, 1, 1]), gap: 0.020, rim: 1, pillar: 1, morph: 'none' };

let ctx = null;
let pending = null;            // resolve() of the current travel's promise
let opts0 = {};                // opts of the current travel
let rec = null;                // RebaseRecord while a swap is in effect
let prevU = 0, lastNow = 0, startNow = 0;
let mode = 'forward';          // 'forward' | 'inertia' | 'reverse'
let inertiaV = 0, scrubU = 0;
let interactiveSent = false;
let fresh = false;              // the first frame of a path adds no time (go() may land just before a frame)
let fromHall = null;           // the hall receiving exit(u) (the logical source)
let voice = null;
let focusTimer = -1, focusResolve = null;
let lastHash = '';
let arrivals = 0;
const seen = new Set();

const st = { phase: 'idle', path: null, from: null, to: null, u: 0, t: 0, speed: 1, scrubbing: false, swapped: false };

const has = (o, m) => o && typeof o[m] === 'function';
const call = (o, m, a, b, c) => (has(o, m) ? o[m](a, b, c) : undefined);

// ─── World application ───────────────────────────────────────────────────────────────────────────────────────
function setPillarAlpha(a) {
  const p = ctx.pillar;
  if (!p || applied.pillar === a) return;
  applied.pillar = a;
  const ud = p.userData;
  if (ud.ribbon) ud.ribbon.setAlpha(a);
  if (ud.beads) {
    ud.beads.visible = a > 0.001;
    const m = ud.beads.material;
    m.uniforms.uAlpha.value = a;
    m.transparent = a < 0.999;
  }
  p.visible = a > 0.001;
}
function setRim(a) { if (ctx.rim && applied.rim !== a) { applied.rim = a; ctx.rim.setAlpha(a); } }

function applyWorld(o) {
  if (!ctx.renderer) return;
  scaleEngine.scaleAbout(o.s, o.pivot);
  rig.setPose(o.cam);
  if (o.fog >= 0) fog.set(o.fog);
  nest.setFade(-1, o.fade.mini); nest.setFade(0, o.fade.key); nest.setFade(1, o.fade.vin); nest.setFade(2, o.fade.parent);
  const s1 = nest.structure(1);
  if (s1) {
    for (let j = 0; j < 7; j++) if (applied.strata[j] !== o.vinStrata[j]) { applied.strata[j] = o.vinStrata[j]; s1.setStratumFade(j, o.vinStrata[j]); }
    if (applied.gap !== o.vinGap) { applied.gap = o.vinGap; s1.setGap(o.vinGap); }
  }
  if (ctx.key) {
    if (o.morph.kind !== 'none') ctx.key.setMorph(o.morph.kind, o.morph.i, o.morph.tMs, o.morph.D);
    else if (applied.morph !== 'none') ctx.key.setMorph('none', 3, 0, 1);
    applied.morph = o.morph.kind;
  }
  setRim(o.rim);
  setPillarAlpha(o.pillar);
  const sTo = st.to ? hallHost.shell(st.to.room) : null;
  const sFrom = fromHall ? hallHost.shell(fromHall) : null;
  if (sFrom && sFrom !== sTo) {
    sFrom.setAlpha(o.shellFrom); sFrom.setIris('top', o.iris.fromTop); sFrom.setIris('bottom', o.iris.fromBottom);
  }
  if (sTo) { sTo.setAlpha(o.shellTo); sTo.setIris('top', o.iris.toTop); sTo.setIris('bottom', o.iris.toBottom); }
}

/** Snapshot of the live world into `cur` (idle → the start of a travel). */
function snapshot() {
  settleSnapshot(cur);
  if (ctx.renderer) {
    cur.cam.pos.copy(rig.pose.pos); cur.cam.target.copy(rig.pose.target);
    cur.cam.fov = rig.pose.fov; cur.cam.offsetY = rig.pose.offsetY; cur.cam.roll = rig.pose.roll;
    cur.s = scaleEngine.s; cur.Q.copy(scaleEngine.Q); scaleEngine.fixedPoint(cur.pivot);
    cur.fog = fog.density;
    cur.fade.mini = nest.fade(-1); cur.fade.key = nest.fade(0); cur.fade.vin = nest.fade(1); cur.fade.parent = nest.fade(2);
    cur.vel.copy(rig.velocity);
  }
  cur.alt = director.altitude();
}
function settleSnapshot(o) {
  o.vinStrata.set(applied.strata); o.vinGap = applied.gap; o.rim = applied.rim; o.pillar = applied.pillar;
  o.morph.kind = 'none'; o.exitU = 0; o.enterU = 0; o.counter = 0; o.flashCode = null;
  o.shellFrom = 1; o.shellTo = 0;
  o.iris.fromTop = o.iris.fromBottom = o.iris.toTop = o.iris.toBottom = 0;
}

function refreshRest() {
  const r = director.current || { room: 'CORE', sub: null };
  hallHost.restPose(r.room, r.sub, restCache);
}

// ─── Travel lifecycle ────────────────────────────────────────────────────────────────────────────────────────
function startVoice(kind) {
  stopVoice();
  const name = kind === 'LIFT' ? 'liftRumble' : kind === 'DIVE' || kind === 'RECALL' ? 'whoosh' : null;
  if (name && ctx.audio) voice = ctx.audio.start(name, { speed01: 0 });
}
function stopVoice() { if (voice) { try { voice.stop(); } catch (e) { /* voice already gone */ } voice = null; } }

function sliceLine() {
  const fx = document.getElementById('fx');
  if (!fx) return;
  const el = document.createElement('i');
  el.className = 'slice';
  fx.appendChild(el);
  after(TIMING.slice + 40, () => { if (el.parentNode) el.parentNode.removeChild(el); });
}

function buildPath(start, from, to, retargetFrom) {
  const reduced = ENV.reducedMotion || app.tier === 'T0';
  if (reduced) return buildSlice(start, to);
  if (retargetFrom) return buildRetarget(start, retargetFrom, to, { shellFrom0: start.shellTo });
  const hall = hallHost.get(to.room);
  if (has(hall, 'entryPath')) {
    const p = hallHost.call(to.room, 'entryPath', from.room, start);
    if (p) return p;
  }
  const kind = transitionKind(from.room, to.room);
  if (kind === 'DIVE') {
    const kr = to.room === 'WORKSHOP' ? 'MEMBERS' : to.room === 'ZENITH' ? 'SIGNAL' : to.room;
    return buildDive(start, ROOMS[kr].stratum, { first: !(state.data && state.data.firstDive), fromUnfold: !!app.unfolded, sub: to.sub, to: to.room });
  }
  if (kind === 'RECALL') return buildRecall(start, from.room);
  return buildLift(start, from.room, to.room, { sub: to.sub });
}

function begin(path, from, to, opts) {
  st.path = path; st.from = from; st.to = to;
  st.t = 0; st.u = 0; st.speed = 1; st.swapped = false; st.phase = 'transition';
  st.scrubbing = !!opts.scrub; scrubU = 0; mode = 'forward';
  prevU = 0; lastNow = loop.at(); startNow = lastNow; interactiveSent = false; rec = null; fresh = true;
  opts0 = opts;
  app.u = 0;
  if (path.kind === 'SLICE') sliceLine();
  startVoice(path.kind);
  bus.emit('travel:start', { from, to, kind: path.kind, duration: path.duration });
}

/** Compiles the destination hall's shader programs now, so a first visit never hitches inside the travel clock. */
function warm(id) {
  const g = hallHost.group(id);
  if (!g || !ctx.renderer || !rig.camera) return;
  try { ctx.renderer.three.compile(g, rig.camera, ctx.scene); } catch (e) { /* compile is an optimisation only */ }
}

function startTravel(to, opts) {
  const from = director.current;
  snapshot();
  hallHost.ensure(to.room);
  warm(to.room);
  fromHall = from.room;
  const path = buildPath(cur, from, to, null);
  setPhase('transition');
  hallHost.call(from.room, 'depart');
  call(ctx.datum, 'depart');
  if (ctx.renderer) nest.setHallLod(null);
  bus.emit('room:depart', { room: from.room, to });
  begin(path, from, to, opts);
  return new Promise((res) => { pending = res; });
}

/** The logical room (ARCH §3.6.3): swap kinds → source before the swap, destination after; LIFT → the hall whose band
 *  holds the camera altitude (else the nearer); SLICE → source before the cut. */
function logicalRoom() {
  const p = st.path;
  if (!p) return app.room;
  const from = fromHall || (st.from && st.from.room) || app.room, to = st.to.room;
  if (p.swapAt >= 0) return st.swapped ? to : from;
  if (p.kind === 'SLICE') return st.u >= (p.cutAt || 0.5) ? to : from;
  if (p.kind !== 'LIFT') return st.u < 0.5 ? from : to;
  const alt = cur.alt;
  for (const id of [from, to]) { const m = ROOMS[id]; if (m && alt >= m.floor && alt <= m.ceil) return id; }
  let best = from, bd = Infinity;
  for (const id of ROOM_ORDER.concat(['ZENITH'])) {
    const m = ROOMS[id];
    const d = alt < m.floor ? m.floor - alt : alt > m.ceil ? alt - m.ceil : 0;
    if (d < bd) { bd = d; best = id; }
  }
  return best;
}

function retarget(to, opts) {
  const logical = logicalRoom();
  const oldTo = st.to.room, oldFrom = fromHall;
  // Supersede the old travel.
  if (pending) { const r = pending; pending = null; r(false); }
  bus.emit('travel:end', { from: st.from, to: st.to, kind: st.path.kind, completed: false });
  // Halls: the logical room becomes the source; everything else not taking part goes.
  if (logical === oldTo && oldTo !== to.room) { hallHost.call(oldTo, 'depart'); hallHost.call(oldTo, 'exit', 1); }
  fromHall = logical;
  hallHost.ensure(to.room);
  warm(to.room);
  for (const id of hallHost.residents()) {
    if (id !== to.room && id !== logical && id !== oldFrom) hallHost.release(id);
  }
  if (oldFrom && oldFrom !== logical && oldFrom !== to.room) { hallHost.call(oldFrom, 'exit', 1); releaseLater(oldFrom); }
  copyPoseOut(cur, tmp);
  if (ctx.renderer) { tmp.vel.copy(rig.velocity); tmp.Q.copy(scaleEngine.Q); tmp.s = scaleEngine.s; }
  const from = { room: logical, sub: null, hash: `#/${ROOMS[logical].slug}` };
  const path = buildPath(tmp, from, to, logical);
  rec = null;
  begin(path, from, to, opts);
  return new Promise((res) => { pending = res; });
}

function releaseLater(id) {
  after(TIMING.releaseSourceMs, () => {
    if (id === app.room && st.phase !== 'transition') return;
    if (st.phase === 'transition' && (st.to.room === id || fromHall === id)) return;
    hallHost.release(id);
  });
}

/** History rules (ARCH §3.6.2 step 7, §3.16): 'history' → nothing (only canonicalise a redirected URL); 'hash' / 'go' /
 *  'deeplink' / replace → replaceState (the browser already made the entry); otherwise pushState. */
function writeHistory(route, source, replace) {
  const target = route.hash;
  try {
    const here = location.hash;
    if (source === 'history') { if (here !== target && !(here === '' && target === '#/core')) window.history.replaceState(null, '', target); }
    else if (replace || source === 'hash' || source === 'go' || source === 'deeplink' || here === target) window.history.replaceState(null, '', target);
    else window.history.pushState(null, '', target);
  } catch (e) { /* history unavailable (sandboxed frame) — the route still applies */ }
  lastHash = location.hash;
}

function arrive() {
  const path = st.path, from = st.from, to = st.to;
  path.pose(1, out);
  applyWorld(out);
  copyPoseOut(out, cur);
  stopVoice();
  const first = !seen.has(to.room);
  seen.add(to.room);
  arrivals += 1;
  app.room = to.room;
  app.route = to;
  app.u = 0;
  director.current = to;
  st.phase = 'idle'; st.scrubbing = false; st.u = 0;
  const kind = path.kind;
  if (ctx.renderer) nest.setHallLod(to.room);
  hallHost.show(to.room, true);
  hallHost.call(to.room, 'enter', 1);
  setPhase('idle');
  hallHost.call(to.room, 'arrive', { first, sub: to.sub, kind, arrivals });
  let route = to;
  if (to.sub) {
    const ms = hallHost.call(to.room, 'setSub', to.sub, { instant: true });
    if (ms === false) { route = parseHash(`#/${ROOMS[to.room].slug}`); director.current = route; app.route = route; opts0 = { ...opts0, replace: true }; }
  }
  call(ctx.datum, 'counter', ROOMS[to.room].alt, 0);
  call(ctx.datum, 'flashCode', null);
  call(ctx.datum, 'arrive', to.room);
  call(ctx.chrome, 'setRoom', to.room);
  call(ctx.keyNav, 'setNeedle', ROOMS[to.room].alt);
  call(ctx.keyNav, 'setCurrent', to.room);
  call(ctx.keyNav, 'lockTwin');
  if (ctx.audio) ctx.audio.play('arrivalLock', { root: ROOMS[to.room].root });
  call(ctx.edges, 'twitch');
  if (layout.isPhone) vibrate(VIBE.lock);
  document.title = titleFor(route);
  writeHistory(route, opts0.source, !!opts0.replace);
  state.set('lastRoom', route.hash);
  if (kind === 'DIVE' && state.data && !state.data.firstDive) state.set('firstDive', true);
  refreshRest();
  director.lastTravel = { kind, from: from.hash, to: route.hash, plannedMs: path.duration, ms: loop.now - startNow, completed: true };
  st.path = null;
  bus.emit('room:arrive', { room: to.room, sub: route.sub, first, kind, arrivals });
  bus.emit('route:change', { route, prev: from });
  bus.emit('travel:end', { from, to: route, kind, completed: true });
  if (app.tier === 'T0' && ctx.t0) call(ctx.t0, 'show', route);
  for (const id of hallHost.residents()) if (id !== to.room) releaseLater(id);
  const r = pending; pending = null;
  if (r) r(true);
}

/** Scrub released below 0.5: the travel plays back to u = 0 and the source is current again. */
function revert() {
  const path = st.path, from = st.from, to = st.to;
  path.pose(0, out);
  applyWorld(out);
  copyPoseOut(out, cur);
  stopVoice();
  st.phase = 'idle'; st.scrubbing = false; st.u = 0; app.u = 0;
  const back = fromHall || from.room;
  if (ctx.renderer) nest.setHallLod(back);
  hallHost.call(back, 'exit', 0);
  hallHost.show(back, true);
  setPhase('idle');
  hallHost.call(back, 'arrive', { first: false, sub: director.current.sub, kind: 'REVERT', arrivals });
  call(ctx.datum, 'counter', ROOMS[back].alt, 0);
  call(ctx.datum, 'arrive', back);
  call(ctx.keyNav, 'setNeedle', ROOMS[back].alt);
  call(ctx.keyNav, 'setCurrent', back);
  director.lastTravel = { kind: path.kind, from: from.hash, to: to.hash, plannedMs: path.duration, ms: loop.now - startNow, completed: false };
  st.path = null;
  bus.emit('travel:end', { from, to, kind: path.kind, completed: false });
  if (to.room !== back) releaseLater(to.room);
  refreshRest();
  const r = pending; pending = null;
  if (r) r(false);
}

// ─── Per frame ───────────────────────────────────────────────────────────────────────────────────────────────
const voiceParams = { speed01: 0, pan: 0 };

function applyU(u) {
  const p = st.path;
  if (p.swapAt >= 0) {
    if (!st.swapped && u >= p.swapAt) {
      if (ctx.renderer) {
        p.pose(Math.max(0, p.swapAt - 1e-6), tmp);                 // the last pre-swap frame → its pivot
        scaleEngine.scaleAbout(p.swapKind === 'grow' ? 1000 : 0.001, tmp.pivot);   // exactly the swap value
        rec = scaleEngine.rebase(p.swapKind);
      }
      st.swapped = true;
    } else if (st.swapped && u < p.swapAt) {
      if (rec && ctx.renderer) scaleEngine.unrebase(rec);            // scrubbing back across the swap: exact inverse
      rec = null;
      st.swapped = false;
    }
  }
  p.pose(u, out);
  applyWorld(out);
  if (fromHall && fromHall !== st.to.room) hallHost.call(fromHall, 'exit', out.exitU);
  hallHost.call(st.to.room, 'enter', out.enterU);
  call(ctx.keyNav, 'setNeedle', out.alt);
  if (ctx.audio) ctx.audio.setRootU(st.from.room, st.to.room, u);
  call(ctx.datum, 'counter', out.alt, out.counter);
  call(ctx.datum, 'flashCode', out.flashCode);
  if (voice) { voiceParams.speed01 = out.speed01; voiceParams.pan = out.pan; voice.set(voiceParams); }
  if (p.cues) p.cues(u, prevU, ctx);
  if (!interactiveSent && u >= TIMING.interactiveU) {
    interactiveSent = true;
    hallHost.show(st.to.room);
    bus.emit('travel:interactive', { to: st.to });
  }
  app.u = u; st.u = u; prevU = u;
  copyPoseOut(out, cur);
}

function idleFrame(dt) {
  if (!ctx.renderer || app.phase === 'boot' || app.phase === 'start') return;
  const room = app.room;
  const hall = hallHost.get(room);
  if (hall && typeof hall.livePose === 'function') {
    if (hallHost.call(room, 'livePose', live, dt) === true) {
      const a = ROOMS[room].anchor;
      live.pos.add(a); live.target.add(a);
      rig.setPose(live);
      return;
    }
  }
  rig.setPose(restCache);
}

function frame(dt) {
  const now = loop.now;
  let dms = now - lastNow;
  lastNow = now;
  if (fresh) { fresh = false; if (dms < 0) dms = 0; }
  if (st.phase !== 'transition') { idleFrame(dt); return; }
  const D = st.path.duration;
  let u;
  if (st.scrubbing) u = scrubU;
  else if (mode === 'inertia') {
    u = clamp01(st.u + (inertiaV * dms) / 1000);
    inertiaV *= Math.pow(MOTION.inertiaDecay, dms / MOTION.frameMs);
    if (Math.abs(inertiaV) < 0.05 || u <= 0 || u >= 1) { mode = u < 0.5 ? 'reverse' : 'forward'; st.t = tOfU(u, D); }
  } else if (mode === 'reverse') {
    st.t = Math.max(0, st.t - dms * st.speed);
    u = EASE.camera(st.t / D);
    if (st.t <= 0) { applyU(0); revert(); return; }
  } else {
    st.t = Math.min(D, st.t + dms * st.speed);
    u = EASE.camera(st.t / D);
  }
  applyU(u);
  if (!st.scrubbing && mode === 'forward' && st.t >= D) arrive();
}

// ─── FOCUS (same room, another sub) ──────────────────────────────────────────────────────────────────────────
function cancelFocus() {
  if (focusTimer >= 0) { cancelAfter(focusTimer); focusTimer = -1; }
  if (focusResolve) { const r = focusResolve; focusResolve = null; r(false); }
}
function completeFocus(route, prev, opts) {
  director.current = route;
  app.route = route;
  writeHistory(route, opts.source, !!opts.replace);
  document.title = titleFor(route);
  state.set('lastRoom', route.hash);
  refreshRest();
  bus.emit('route:change', { route, prev });
  if (app.tier === 'T0' && ctx.t0) call(ctx.t0, 'show', route);
}
function focus(r, opts) {
  cancelFocus();
  const prev = director.current;
  const ms = hallHost.call(r.room, 'setSub', r.sub, { instant: ENV.reducedMotion });
  if (ms === false || ms === undefined) {
    // Unknown sub → canonicalise to the room (replaceState); the hall goes back to its overview if it had a sub.
    const room = parseHash(`#/${ROOMS[r.room].slug}`);
    if (prev.sub) hallHost.call(r.room, 'setSub', null, { instant: true });
    completeFocus(room, prev, { ...opts, replace: true });
    return Promise.resolve(true);
  }
  return new Promise((res) => {
    focusResolve = res;
    focusTimer = after(Math.max(0, +ms || 0), () => {
      focusTimer = -1; focusResolve = null;
      completeFocus(r, prev, opts);
      res(true);
    });
  });
}

// ─── Input consumers, history listeners ──────────────────────────────────────────────────────────────────────
function onPop() { lastHash = location.hash; director.go(location.hash, { source: 'history' }); }
function onHash() { if (location.hash === lastHash) return; lastHash = location.hash; director.go(location.hash, { source: 'hash' }); }

// ─── The director ────────────────────────────────────────────────────────────────────────────────────────────
export const director = {
  state: st,
  /** Route — last completed arrival / focus */
  current: null,
  /** WP0 addition (test hook `_travel`): { kind, from, to, plannedMs, ms, completed } of the last finished travel. */
  lastTravel: null,

  init(c) {
    ctx = c;
    c.director = director;
    c.halls = hallHost;
    configurePaths({
      restPose: (id, sub, o) => hallHost.restPose(id, sub, o),
      faceFrame: c.key ? (i, o) => c.key.faceFrame(i, o) : null,
    });
    director.current = parseHash('#/core');
    app.room = 'CORE';
    app.route = director.current;
    seen.add('CORE');
    lastHash = location.hash;
    loop.add(frame, ORDER.DIRECTOR);
    // The base consumer stack (hall, then director) is installed once by core/input.js (ARCH §3.9.2); pushing it
    // again here dispatched every unconsumed gesture to the hall twice.
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onHash);
    bus.on('layout:change', refreshRest);
    // ARCH §3.1.1 step 10: CORE is built and made current with pose(null).
    hallHost.ensure('CORE');
    hallHost.show('CORE', true);
    refreshRest();
    if (c.renderer && app.phase !== 'boot' && app.phase !== 'start') rig.setPose(restCache);
    return director;
  },

  /** WP0 addition: the boot has finished in CORE — the CORE hall gets its arrival (main calls it after runBoot). */
  settle() {
    if (st.phase === 'transition' || app.room !== 'CORE') return;
    refreshRest();
    hallHost.call('CORE', 'enter', 1);
    hallHost.call('CORE', 'arrive', { first: true, sub: null, kind: 'BOOT', arrivals });
    call(ctx.chrome, 'setRoom', 'CORE');
    call(ctx.keyNav, 'setCurrent', 'CORE');
    call(ctx.keyNav, 'setNeedle', 0);
  },

  /** Navigate. Same room + another sub → FOCUS; another room → travel; during travel → retarget. Never throws. */
  go(target, opts = {}) {
    try {
      const source = opts.source || 'go';
      const o = { ...opts, source };
      const g = applyGuards(parseHash(target), source);
      if (g.status) call(ctx.status, 'say', g.status, g.vars || {});
      if (g.shudder) {
        call(ctx.keyNav, 'shudder', g.shudder);
        if (app.room === 'CORE' && st.phase !== 'transition' && ctx.key) ctx.key.shudder(6);
      }
      const r = g.route;
      if (st.phase === 'transition') {
        if (r.hash === st.to.hash) return new Promise((res) => { bus.once('travel:end', (e) => res(!!e.completed)); });
        cancelFocus();
        return retarget(r, o);
      }
      const now = director.current;
      if (r.hash === now.hash) {
        cancelFocus();
        if (location.hash && location.hash !== r.hash) writeHistory(r, 'history', true);
        return Promise.resolve(true);
      }
      if (r.room === now.room) return focus(r, o);
      cancelFocus();
      return startTravel(r, o);
    } catch (e) {
      if (__DEV__) console.warn('director.go failed', e);   // eslint-disable-line no-console
      return Promise.resolve(false);
    }
  },

  /** ×3 for the remainder (taps on empty space, non-navigation keys). */
  speedUp() { if (st.phase === 'transition' && !st.scrubbing && mode === 'forward') st.speed = TIMING.skipSpeed; },

  scrub: {
    /** idle: builds the path and parks at u = 0; travelling: takes over the current u. Reduced motion / T0: false. */
    begin(target) {
      if (ENV.reducedMotion || app.tier === 'T0' || !ctx.renderer) return false;
      if (st.phase === 'transition') { st.scrubbing = true; scrubU = st.u; mode = 'forward'; return true; }
      const r = applyGuards(parseHash(target), 'nav').route;
      if (r.room === director.current.room) return false;
      startTravel(r, { source: 'nav', scrub: true });
      return true;
    },
    set(u) { if (st.phase === 'transition' && st.scrubbing) scrubU = clamp01(u); },
    /** Release with u-velocity vu (u/s): inertia ×0.92 per 16.7 ms, then u < 0.5 → back to the source, else complete. */
    end(vu = 0) {
      if (st.phase !== 'transition' || !st.scrubbing) return;
      st.scrubbing = false;
      st.u = scrubU;
      st.speed = 1;
      inertiaV = vu || 0;
      mode = 'inertia';
    },
  },

  /** Live altitude (canonical m). */
  altitude() { return st.phase === 'transition' ? cur.alt : (ROOMS[app.room] || ROOMS.CORE).alt; },
  busy() { return st.phase === 'transition'; },
  /** WP0 addition: the hall currently departing (receives exit(u)); null when idle. */
  logicalSource() { return st.phase === 'transition' ? fromHall : null; },
  /** WP0 addition: the logical room of the current travel (ARCH §3.6.3). */
  logicalRoom() { return st.phase === 'transition' ? logicalRoom() : app.room; },
};
