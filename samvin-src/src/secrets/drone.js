// secrets/drone.js — S09 ДРОН (SPEC §8.1 S09, §8.3; SPEC-ADDENDUM A1.3 §8.1 S09, A11.4; ARCH §6.11 + X§5.3). OWNER: WP10.
// When: the 2nd room arrival of the first visit day (guaranteed); then on arrivals where (arrivals·7 + dayOfYear) % 4
// == 0; at most 3 a day (drones {day, count, arrivals} persisted; arrivals count today's travel arrivals). Never in the
// hall holding today's unrescued ПОТЕРЯШКА — either kind, the ДОГОВОРИЛИСЬ pair too (ctx.host.lost.blocksDrone(room)),
// never during ПОКАЗ. The S09 motion hint makes one appear at once.
// What: a 3 px --white mote with a 1 px glint antenna, drifting along a strut 3–6 m from the camera (the strut itself a
// faint hairline it rides on), crossing the view in ≈ 8 s. When the pointer or a finger comes within 60 px it DODGES
// 80–140 px along the strut, away from him, in 180 ms with a chirp (`droneDodge`) — twice. The third approach lets it be
// caught: a click / tap within 44 px (its DOM proxy, data-qa="drone"). Then it OPENS (the shell parts, the antenna
// flicks) and a joke BEAM WRITES in LEAD — hidden jokes he has not found first, then random moments; the joke joins
// jokesFound (ARCHIVE marginalia); status «дрон принёс шутку.»; secrets.discover('S09').
// T0: the same rules and timings with a DOM mote in #fx and a DOM proxy (no WebGL). Reduced motion: it still crosses;
// the dodge is a cut instead of a 180 ms glide.
import { Vector3 } from 'three';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { loop, ORDER } from '../core/loop.js';
import { audio } from '../audio/engine.js';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { createLines } from '../render/lines.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import * as time from '../core/time.js';
import { WORLD } from '../data/world.js';
import { registerHookField } from '../core/testhook.js';
import { W, has, say, safe, reduced, isT0, clamp01, easeOut, fxRoot, overlayRoot } from './util.js';

const CROSS_MS = 8000, NEAR_PX = 60, CATCH_PX = 44, DODGE_MS = 180, DODGES = 2, MAX_A_DAY = 3;
const DEG = Math.PI / 180;

let ctx = null;
let lines = null, segs = null, segAlpha = null, segW = null;
let d = null;   // the live drone
let t0el = null, t0btn = null, anchor = null;
const hook = { active: false, x: 0, y: 0, dodges: 0, approaches: 0, caught: false };
const _c = new Vector3(), _f = new Vector3(), _r = new Vector3(), _u = new Vector3(), _dir = new Vector3();
const _p = new Vector3(), _q = new Vector3(), _w = new Vector3();
const _s = { x: 0, y: 0, depth: 0, visible: false }, _s2 = { x: 0, y: 0, depth: 0, visible: false };

/** One R3 batch (one draw call): [0] the strut it rides (1 px, 10 %), [1] the antenna (1 px), [2] and [3] the two halves
 *  of its shell — each a 3 px-wide stub of 3 mm, i.e. a 3 px mote; they part when it opens. */
function ensureGl() {
  if (lines) return;
  segs = new Float32Array(24);
  segAlpha = new Float32Array([0.1, 1, 1, 1]);
  segW = new Float32Array([1, 1, 3, 3]);
  lines = createLines({ segments: segs, color: 'white', width: segW, alpha: segAlpha, far: 60, fog: false, glint: 0.4, depthTest: false, renderOrder: 9 });
  lines.mesh.visible = false;
}

// ─── the path ───────────────────────────────────────────────────────────────────────────────────────────────────
/** Mote position (canonical) at `along` metres on the strut + its little bob → out. */
function glPos(along, tSec, out) {
  out.copy(d.origin).addScaledVector(d.dir, along);
  out.addScaledVector(d.up, 0.018 * Math.sin(tSec * 2 * Math.PI * 0.7));
  return out;
}
function screenOf(out) {
  if (d.gl) {
    glPos(d.along, d.tSec, _p);
    scaleEngine.toRender(_p, _q);
    rig.project(_q, out);
  } else {
    const k = d.along;   // px along the screen path
    out.x = d.sx0 + d.sdx * k; out.y = d.sy0 + d.sdy * k + 2 * Math.sin(d.tSec * 2 * Math.PI * 0.7); out.depth = 1;
    out.visible = out.x >= 0 && out.x <= layout.w && out.y >= 0 && out.y <= layout.h;
  }
  return out;
}

function spawn(why) {
  if (d) return;
  const gl = !isT0() && !!rig.camera && !!ctx.worldFx;
  d = { gl, why, t: 0, tSec: 0, along: 0, speed: 0, end: 0, dodges: 0, approaches: 0, near: false, catchable: false,
    caught: false, dodge: null, out: -1, origin: new Vector3(), dir: new Vector3(), up: new Vector3(), sx0: 0, sy0: 0, sdx: 1, sdy: 0, sx: 0, sy: 0 };
  if (gl) {
    ensureGl();
    const cam = rig.camera;
    scaleEngine.toCanonical(cam.position, _c);
    _f.set(0, 0, -1).transformDirection(cam.matrixWorld);
    _r.set(1, 0, 0).transformDirection(cam.matrixWorld);
    _u.set(0, 1, 0).transformDirection(cam.matrixWorld);
    const depth = 3 + Math.random() * 3;
    const vh = depth * Math.tan(((cam.fov || 35) * DEG) / 2);
    const hw = vh * Math.max(0.3, layout.w / Math.max(1, layout.h));
    const slant = (Math.random() - 0.5) * 0.5;
    const yOff = (Math.random() * 0.5 - 0.1) * vh;          // a strut a little above the middle of the view, mostly
    const ltr = Math.random() < 0.5 ? 1 : -1;
    _dir.copy(_r).multiplyScalar(ltr).addScaledVector(_u, slant).normalize();
    d.dir.copy(_dir); d.up.copy(_u);
    d.origin.copy(_c).addScaledVector(_f, depth).addScaledVector(_u, yOff);
    const len = (hw + 0.25) / Math.max(0.5, Math.abs(_dir.dot(_r)));
    d.along = -len * 0.92; d.end = len * 1.05;
    d.speed = (d.end - d.along) / CROSS_MS;                 // m per ms
    // the strut it rides on: a faint hairline through the whole view
    glPos(-len * 1.4, 0, _p); glPos(len * 1.4, 0, _q);
    segs[0] = _p.x; segs[1] = _p.y; segs[2] = _p.z; segs[3] = _q.x; segs[4] = _q.y; segs[5] = _q.z;
    if (lines.mesh.parent !== ctx.worldFx) ctx.worldFx.add(lines.mesh);
    lines.mesh.visible = true;
    if (ctx.overlay && has(ctx.overlay, 'add')) {
      anchor = ctx.overlay.add({ owner: 'secrets', id: 'drone', get: proxyGet, lowpass: 20, cross: false, hideBehind: true,
        button: { label: 'дрон', onActivate: tryCatch } });
      if (anchor.button) { anchor.button.dataset.qa = 'drone'; anchor.button.classList.add('sec-drone-proxy'); }
    }
  } else {
    const ltr = Math.random() < 0.5 ? 1 : -1;
    const w = layout.w, h = layout.h;
    d.sx0 = ltr > 0 ? w * 0.06 : w * 0.94; d.sy0 = h * (0.28 + Math.random() * 0.2);
    const ex = ltr > 0 ? w + 20 : -20, ey = d.sy0 + (Math.random() - 0.5) * h * 0.2;
    const L = Math.hypot(ex - d.sx0, ey - d.sy0);
    d.sdx = (ex - d.sx0) / L; d.sdy = (ey - d.sy0) / L;
    d.along = 0; d.end = L; d.speed = L / (CROSS_MS * 0.94);
    const fx = fxRoot(), ov = overlayRoot();
    if (!t0el) {
      t0el = document.createElement('i'); t0el.className = 'sec-t0mote sec-t0drone';
      t0btn = document.createElement('button'); t0btn.type = 'button'; t0btn.className = 'proxy sec-drone-proxy';
      t0btn.dataset.qa = 'drone'; t0btn.setAttribute('aria-label', 'дрон');
      t0btn.addEventListener('click', tryCatch);
    }
    if (fx) fx.appendChild(t0el);
    if (ov) ov.appendChild(t0btn);
  }
  hook.active = true; hook.dodges = 0; hook.approaches = 0; hook.caught = false;
}

function proxyGet(out) {
  if (!d || !d.gl) return out.set(0, 0, -1e6);
  glPos(d.along, d.tSec, _w);
  return scaleEngine.toRender(_w, out);
}

function remove() {
  if (!d) return;
  if (lines) lines.mesh.visible = false;
  if (anchor) { safe('drone:rm', () => anchor.remove()); anchor = null; }
  if (t0el && t0el.parentNode) t0el.parentNode.removeChild(t0el);
  if (t0btn && t0btn.parentNode) t0btn.parentNode.removeChild(t0btn);
  d = null;
  hook.active = false;
}

// ─── dodge & catch ──────────────────────────────────────────────────────────────────────────────────────────────
/** Screen px per path unit along the strut at the drone (WebGL: per metre; T0: 1). */
function pxPerUnit() {
  if (!d.gl) return 1;
  glPos(d.along, d.tSec, _p); scaleEngine.toRender(_p, _q); rig.project(_q, _s);
  glPos(d.along + 0.1, d.tSec, _p); scaleEngine.toRender(_p, _q); rig.project(_q, _s2);
  return Math.max(1, Math.hypot(_s2.x - _s.x, _s2.y - _s.y) * 10);
}

function approach(px, py) {
  if (!d || d.caught || d.out >= 0) return;
  d.approaches++; hook.approaches = d.approaches;
  if (d.approaches > DODGES) { d.catchable = true; return; }
  // away from him, along the strut
  const ppu = pxPerUnit();
  screenOf(_s);
  glPos(d.along + 0.1, d.tSec, _p);
  let sdx = d.sdx, sdy = d.sdy;
  if (d.gl) { scaleEngine.toRender(_p, _q); rig.project(_q, _s2); sdx = _s2.x - _s.x; sdy = _s2.y - _s.y; }
  const away = (_s.x - px) * sdx + (_s.y - py) * sdy >= 0 ? 1 : -1;
  const jumpPx = 80 + Math.random() * 60;
  d.dodge = { from: d.along, to: d.along + (away * jumpPx) / ppu, t: 0 };
  d.dodges++; hook.dodges = d.dodges;
  audio.play('droneDodge', {});
}

function tryCatch() {
  if (!d || d.caught || d.out >= 0) return;
  if (!d.catchable) return;                 // a tap before the third approach only makes it dodge (observeDown)
  d.caught = true; hook.caught = true;
  screenOf(_s);
  const anchorPt = { x: _s.x, y: _s.y };
  audio.play('select', {});
  // the drone opens: the shell parts and fades (500 ms), then it is gone
  d.out = loop.now;
  const text = pickJoke();
  if (ctx.lead && has(ctx.lead, 'show')) safe('drone:lead', () => ctx.lead.show(text, { beam: true, ms: 3600 }));
  say('drone');
  if (ctx.secrets) safe('drone:discover', () => ctx.secrets.discover('S09', { anchor: anchorPt }));
}

/** Hidden jokes he has not found first (data order), then a random moment. */
function pickJoke() {
  const found = state.data.jokesFound;
  for (const j of WORLD.jokes || []) {
    if (j && j.hidden && !found.includes(j.id)) {
      state.patch((dd) => { if (!dd.jokesFound.includes(j.id)) dd.jokesFound.push(j.id); });
      return j.text;
    }
  }
  const ms = (WORLD.moments || []).filter((m) => m && m.text);
  if (ms.length) return ms[Math.floor(Math.random() * ms.length)].text;
  const js = (WORLD.jokes || []).filter((j) => j && j.text);
  return js.length ? js[Math.floor(Math.random() * js.length)].text : '';
}

function onDown(e) {
  if (!d || e.type === 'key') return;
  screenOf(_s);
  if (Math.hypot(e.x - _s.x, e.y - _s.y) <= NEAR_PX && !d.near) { d.near = true; approach(e.x, e.y); }
}

// ─── the frame ──────────────────────────────────────────────────────────────────────────────────────────────────
let lastWorld = -1;
function frame() {
  // world time (a ПАУЗА holds it), never the clamped frame dt: at a few fps it still crosses in ≈ 8 s
  const w = loop.worldNow, ms = lastWorld < 0 ? 0 : Math.max(0, w - lastWorld);
  lastWorld = w;
  if (!d) return;
  d.t += ms; d.tSec = d.t / 1000;
  if (d.dodge) {
    d.dodge.t += ms;
    const k = reduced() ? 1 : clamp01(d.dodge.t / DODGE_MS);
    d.along = d.dodge.from + (d.dodge.to - d.dodge.from) * easeOut(k);
    if (k >= 1) d.dodge = null;
  } else if (!d.caught) d.along += d.speed * ms;
  screenOf(_s);
  d.sx = _s.x; d.sy = _s.y; hook.x = _s.x; hook.y = _s.y;
  // his pointer comes within 60 px (edge-triggered; it re-arms once he is farther than that)
  const p = input.pointer;
  if (!d.caught && !d.dodge && p.inside && p.x > -9000) {
    const dist = Math.hypot(p.x - _s.x, p.y - _s.y);
    if (dist <= NEAR_PX && !d.near) { d.near = true; approach(p.x, p.y); }
    else if (dist > NEAR_PX + 4) d.near = false;
  }
  const opening = d.out >= 0 ? clamp01((loop.now - d.out) / 500) : 0;
  if (d.out >= 0 && opening >= 1) { remove(); return; }
  if (d.along > d.end + 0.01 || d.along < -d.end * 1.6) { remove(); return; }
  if (d.gl) {
    glPos(d.along, d.tSec, _p);
    // the shell: two 3 mm stubs along the strut; they part across it as the drone opens
    const gap = opening * 0.035, h = 0.0015;
    for (let q = 0; q < 2; q++) {
      const o = 12 + q * 6, sg = q ? 1 : -1;
      segs[o] = _p.x - d.dir.x * h + d.up.x * gap * sg; segs[o + 1] = _p.y - d.dir.y * h + d.up.y * gap * sg; segs[o + 2] = _p.z - d.dir.z * h + d.up.z * gap * sg;
      segs[o + 3] = _p.x + d.dir.x * h + d.up.x * gap * sg; segs[o + 4] = _p.y + d.dir.y * h + d.up.y * gap * sg; segs[o + 5] = _p.z + d.dir.z * h + d.up.z * gap * sg;
    }
    segW[2] = segW[3] = opening > 0 ? 2 : 3;
    // the antenna: 1 px, 2.4 cm up and back from the mote; it flicks up as the drone opens
    const back = d.dodge ? 0.02 : 0.012;
    segs[6] = _p.x; segs[7] = _p.y; segs[8] = _p.z;
    segs[9] = _p.x - d.dir.x * back + d.up.x * (0.022 + opening * 0.02);
    segs[10] = _p.y - d.dir.y * back + d.up.y * (0.022 + opening * 0.02);
    segs[11] = _p.z - d.dir.z * back + d.up.z * (0.022 + opening * 0.02);
    segAlpha[0] = 0.1 * clamp01(d.t / 400) * (1 - opening);
    segAlpha[1] = segAlpha[2] = segAlpha[3] = 1 - opening;
    lines.setSegments(segs, 4);
    const at = lines.mesh.geometry.attributes;
    at.aAl.needsUpdate = true; at.aW.needsUpdate = true;
  } else {
    const tf = `translate3d(${_s.x.toFixed(1)}px,${_s.y.toFixed(1)}px,0)`;
    t0el.style.transform = tf;
    t0el.style.opacity = String(1 - opening);
    t0btn.style.transform = tf;
  }
}

// ─── when ───────────────────────────────────────────────────────────────────────────────────────────────────────
function dayOfYear() {
  const n = new Date(time.now());
  return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 86400000);
}

function onArrive(e) {
  if (app.booting) return;
  const dd = state.data;
  if (!dd) return;
  state.patch((x) => {
    if (x.drones.day !== state.today) { x.drones.day = state.today; x.drones.count = 0; x.drones.arrivals = 0; }
    x.drones.arrivals += 1;
  });
  if (d) return;
  const room = e && e.room ? e.room : app.room;
  if (app.show && app.show.active) return;
  const lost = ctx.host && ctx.host.lost;
  if (lost && has(lost, 'blocksDrone') && safe('drone:guard', () => lost.blocksDrone(room))) return;
  const dr = dd.drones;
  if (dr.count >= MAX_A_DAY) return;
  const firstDay = dd.firstVisit != null && time.dayKey(Date.parse(dd.firstVisit)) === state.today;
  const guaranteed = firstDay && dr.arrivals === 2;
  if (!guaranteed && (dr.arrivals * 7 + dayOfYear()) % 4 !== 0) return;
  state.patch((x) => { x.drones.count += 1; });
  spawn('arrival');
}

/** The S09 motion hint: a drone appears at once in the current hall (it does not count toward the daily three). */
export function droneNow() {
  if (d || app.phase !== 'idle') return;
  const lost = ctx.host && ctx.host.lost;
  if (lost && has(lost, 'blocksDrone') && safe('drone:guard', () => lost.blocksDrone(app.room))) return;
  spawn('hint');
}

export function initDrone(c) {
  ctx = c;
  loop.add(frame, ORDER.FX);
  bus.on('room:arrive', onArrive);
  bus.on('travel:start', remove);
  if (c.input && has(c.input, 'observeDown')) c.input.observeDown(onDown);
  registerHookField('drone', () => ({ ...hook }));
}
