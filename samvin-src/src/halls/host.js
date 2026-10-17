// halls/host.js — the hall host (ARCH §3.7.3, §6.1.6 A6/A17, SPEC §6.0, §7.1, §12.6).
//
// Builds halls on demand (HallCtx = Object.create(ctx) + the hall's own fields), keeps at most three resident (source,
// destination, and a source still inside its 300 ms release delay), and routes EVERY call into a hall through call(),
// the error guard: a throwing hall is logged once (console.warn 'hall:<RoomId>'), disposed, and the visitor is RECALLed to
// CORE; a throwing CORE is rebuilt as the seed placeholder so the app never blanks. Each hall owns one
// <section class="hall" data-room> in #halls, hidden unless the hall is current or arriving (u ≥ 0.7).
// In T0 (A17) no WebGL factory is ever called: ensure() returns an inert stub and WP11's sections are the halls.
import { Group, Vector3 } from 'three';
import { ROOMS } from '../world/rooms.js';
import { createHallShell } from '../world/vin.js';
import { HALL_FACTORIES } from './registry.js';
import { createPlaceholderHall } from './placeholder.js';
import { logOnce } from '../core/env.js';
import { loop, ORDER } from '../core/loop.js';
import { app } from '../core/store.js';
import { CAMERA } from '../core/tokens.js';

/** @typedef {{ id:string, hall:Object, hctx:Object, section:HTMLElement, shell:Object|null, group:Group|null,
 *              shown:boolean, dead:boolean, throwArmed:boolean }} Resident */

const residents = new Map();          // RoomId → Resident
const list = [];                      // residents in creation order (allocation-free frame loop)
let ctxRef = null;
let throwRoom = null;                 // dev: ?throw=<RoomId>

const NOOP = () => {};
/** H18 (ARCH-ADDENDUM X§2.4.5): hall extensions — { name, arrive(hctx, info), depart(hctx), update?(hctx, dt), dispose(hctx) }. */
let exts = [];
function extCall(r, method, a) {
  if (!exts.length || !r || r.dead) return;
  const snap = exts;
  for (let k = 0; k < snap.length; k++) {
    const e = snap[k];
    const f = e[method];
    if (typeof f !== 'function') continue;
    try { f.call(e, r.hctx, a); } catch (err) {
      logOnce(`ext:${e.name}`, `hall extension ${e.name} failed — removed`, err);
      exts = exts.filter((x) => x !== e);
    }
  }
}
/** The T0 stub (A17): every method inert; pose() a fixed pose; setSub() accepts any sub. */
function stubHall(id) {
  const pose = { pos: new Vector3(0, 0.75, 7.2), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };
  return { id, build: NOOP, pose: () => pose, enter: NOOP, exit: NOOP, arrive: NOOP, depart: NOOP, setSub: () => 0,
    update: NOOP, onGesture: () => false, onKey: () => false, resize: NOOP, dispose: NOOP, stub: true };
}

function makeSection(id) {
  const el = document.createElement('section');
  el.className = 'hall';
  el.dataset.room = id;
  el.hidden = true;
  const host = document.getElementById('halls');
  if (host) host.appendChild(el);
  return el;
}

function makeHctx(id, section, shell, group) {
  const meta = ROOMS[id];
  const hctx = Object.create(ctxRef);
  hctx.id = id;
  hctx.meta = meta;
  hctx.group = group;
  hctx.section = section;
  hctx.shell = shell;
  hctx.toCanonical = (local, out) => out.copy(local).add(meta.anchor);
  return hctx;
}

function createResident(id, factory) {
  const section = makeSection(id);
  let group = null, shell = null;
  if (app.tier !== 'T0' && hallHost.root) {
    group = new Group();
    group.name = `hall:${id}`;
    group.position.copy(ROOMS[id].anchor);
    group.visible = false;                      // until build() returns
    hallHost.root.add(group);
    shell = createHallShell(id);
    group.add(shell.group);
  }
  const hctx = makeHctx(id, section, shell, group);
  /** @type {Resident} */
  const r = { id, hall: null, hctx, section, shell, group, shown: false, dead: false, throwArmed: throwRoom === id };
  residents.set(id, r);
  list.push(r);
  try {
    r.hall = app.tier === 'T0' ? stubHall(id) : factory(hctx);
    const done = r.hall.build();
    if (done && typeof done.then === 'function') done.then(null, (e) => fail(id, e));
  } catch (e) {
    fail(id, e);
    return residents.get(id) || null;
  }
  if (group) group.visible = true;
  return r;
}

function destroy(r) {
  extCall(r, 'dispose');
  r.dead = true;
  try { if (r.hall) r.hall.dispose(); } catch (e) { logOnce(`hall:${r.id}`, `hall ${r.id} dispose failed`, e); }
  if (r.shell) r.shell.dispose();
  if (r.group && r.group.parent) r.group.parent.remove(r.group);
  if (r.section && r.section.parentNode) r.section.parentNode.removeChild(r.section);
  residents.delete(r.id);
  const k = list.indexOf(r);
  if (k >= 0) list.splice(k, 1);
}

/** The guard's failure path (ARCH §3.7.3, SPEC §12.6). */
function fail(id, err) {
  logOnce(`hall:${id}`, `hall ${id} failed — recalled to CORE`, err);
  const r = residents.get(id);
  if (r) destroy(r);
  const dir = ctxRef && ctxRef.director;
  if (id === 'CORE') {
    // Never blank: rebuild CORE as the seed placeholder and carry on.
    createResident('CORE', (h) => createPlaceholderHall(h, { props: 'grid' }));
    const nr = residents.get('CORE');
    if (nr && app.room === 'CORE') { hallHost.show('CORE', true); if (nr.hall) safe(nr, 'enter', 1); }
    return;
  }
  if (dir) Promise.resolve().then(() => dir.go('#/core', { source: 'error' }));
}

function safe(r, method, a, b, c) {
  if (!r || r.dead || !r.hall || typeof r.hall[method] !== 'function') return undefined;
  let out;
  try { out = r.hall[method](a, b, c); } catch (e) { fail(r.id, e); return undefined; }
  if (method === 'arrive' || method === 'depart' || method === 'update') extCall(r, method, a);   // H18: right after the hall's own
  return out;
}

function frame(dt, t) {
  for (let k = 0; k < list.length; k++) {
    const r = list[k];
    if (r.dead || !r.hall) continue;
    if (__DEV__ && r.throwArmed && app.room === r.id && app.phase !== 'transition') {
      r.throwArmed = false;
      try { throw new Error(`?throw=${r.id}`); } catch (e) { fail(r.id, e); continue; }
    }
    safe(r, 'update', dt, t);
  }
}

export const hallHost = {
  /** Group, canonical, child of scaleEngine.root (null in T0). */
  root: null,

  init(ctx) {
    ctxRef = ctx;
    if (ctx.scale && ctx.scale.root && !hallHost.root) {
      hallHost.root = new Group();
      hallHost.root.name = 'halls';
      ctx.scale.root.add(hallHost.root);
    }
    if (__DEV__) {
      try { const q = new URLSearchParams(location.search).get('throw'); throwRoom = q && ROOMS[q] ? q : null; } catch (e) { throwRoom = null; }
    }
    loop.add(frame, ORDER.WORLD);
    ctx.bus.on('layout:change', () => { for (let k = 0; k < list.length; k++) safe(list[k], 'resize'); });
    return hallHost;
  },

  /** → Hall (built or building). Creates the HallCtx, section, shell, calls the factory + build(). */
  ensure(id) {
    if (!ROOMS[id]) id = 'CORE';
    const r = residents.get(id) || createResident(id, HALL_FACTORIES[id] || ((h) => createPlaceholderHall(h, { props: 'grid' })));
    return r && r.hall ? r.hall : null;
  },
  get(id) { const r = residents.get(id); return r && !r.dead ? r.hall : null; },
  current() { return hallHost.get(app.room); },
  /** dispose() + remove section + shell; no-op for the current hall and for halls the director is travelling between. */
  release(id) {
    const r = residents.get(id);
    if (!r) return;
    if (id === app.room && app.phase !== 'transition') return;
    const d = ctxRef && ctxRef.director;
    if (d && d.busy() && d.state.to && (d.state.to.room === id || d.logicalSource() === id)) return;
    destroy(r);
  },
  /** Every call into a hall goes through this guard. */
  call(id, method, a, b, c) {
    const out = safe(residents.get(id), method, a, b, c);
    if (method === 'lostSpots') return Array.isArray(out) ? out : [];   // H18: optional; [] when absent
    return out;
  },
  /** H18: registers a hall extension for every resident hall. → remove() */
  addExtension(ext) {
    if (!ext || typeof ext !== 'object') return NOOP;
    exts = exts.concat([ext]);
    return () => { exts = exts.filter((x) => x !== ext); };
  },

  // ── WP0 additions ──────────────────────────────────────────────────────────────────────────────────────
  /** The hall's shell (null when not resident / T0). */
  shell(id) { const r = residents.get(id); return r ? r.shell : null; },
  /** The hall's canonical group (null when not resident / T0). */
  group(id) { const r = residents.get(id); return r ? r.group : null; },
  /** Resident ids (oldest first). */
  residents() { return list.map((r) => r.id); },
  /** CANONICAL rest pose of a hall for a sub: hall.pose(sub) (hall-local) + anchor. Falls back to SPEC poses. */
  restPose(id, sub, out) {
    const meta = ROOMS[id] || ROOMS.CORE;
    const r = residents.get(meta.id);
    const p = r ? safe(r, 'pose', sub || null) : undefined;
    if (p && p.pos && p.target) {
      out.pos.copy(p.pos).add(meta.anchor);
      out.target.copy(p.target).add(meta.anchor);
      out.fov = p.fov || CAMERA.fov; out.offsetY = p.offsetY || 0; out.roll = p.roll || 0;
    } else if (meta.id === 'CORE') {
      out.pos.fromArray(CAMERA.core.pos); out.target.fromArray(CAMERA.core.target); out.fov = CAMERA.core.fov;
      out.offsetY = ctxRef && ctxRef.layout && ctxRef.layout.kind !== 'desktop' ? CAMERA.core.phoneOffsetY : 0; out.roll = 0;
    } else {
      out.pos.set(0, meta.alt + 10, 48); out.target.set(0, meta.alt + 12.5, 0); out.fov = CAMERA.fov; out.offsetY = 0; out.roll = 0;
    }
    return out;
  },
  /** A6: a hall's section is visible only while it is current or arriving (u ≥ 0.7). only = hide every other section. */
  show(id, only = false) {
    for (let k = 0; k < list.length; k++) {
      const r = list[k];
      if (r.id === id) { r.shown = true; r.section.hidden = false; } else if (only) { r.shown = false; r.section.hidden = true; }
    }
  },
  hide(id) { const r = residents.get(id); if (r) { r.shown = false; r.section.hidden = true; } },
};
