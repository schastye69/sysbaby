// secrets/companion.js — S14 СПУТНИК (SPEC §8.1 S14, §8.4, §9.6; ARCH §6.11; tokens COMPANION). OWNER: WP10.
// Before it arrives (k = distinct days < 10): a faint ember point (1.5 px at 30 %, growing to 4 px as k rises) with its
// own 71 BPM pulse hangs beyond the CORE rim, to the right of the Key, at D_k = 400 + 3,000·(1 − k/10) m (depth-tested,
// so VIN's solids hide it; never in other halls). At boot end: days 1–3 «кто-то летит к нам.», days 4–9 «он ближе.
// осталось {n} {день|дня|дней}.».
// Distinct day 10, at boot end (stage 'companion', after the boot): the point flies in along a curve (2,400 ms, the
// `companion` glide 392 → 784 Hz ending in its chirp as it lands) and resolves into a 0.24 m COMPANION KEY — the Key's
// own structure at 1:10, cryptex aligned — its nucleus electrum for 2,500 ms, then ember. It settles into orbit around
// the Key forever (r 1.6 m, period 60 s, a 12° tilt). LEAD «Он прилетел. Его зовут {companion.name}.», status
// «он прилетел. его зовут {name}.», secrets.discover('S14'), companionArrived persisted, app.companion, 'companion:arrive'.
// Clicking it (its DOM proxy, data-qa="companion") spins it twice with a chirp.
// T0: a DOM point beside the SVG Key, then a small SVG companion orbiting it, same timings and rules.
import { Vector3, Group } from 'three';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { createPoints } from '../render/points.js';
import { createLines } from '../render/lines.js';
import { layout } from '../core/layout.js';
import { WORLD } from '../data/world.js';
import { COMPANION, companionDistance, ALPHA, TIMING, STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { W, has, say, safe, reduced, isT0, clamp01, easeInOut, keyScreen, fxRoot, overlayRoot } from './util.js';

const DEG = Math.PI / 180, TILT = 12 * DEG, BEAT_MS = 60000 / COMPANION.bpm;
const SVGNS = 'http://www.w3.org/2000/svg';

let ctx = null, k = 1;
let spark = null, sparkPos = null;           // WebGL far point
let comp = null;                             // { group, body (lines), nucleus (point), theta0, spinT, bornAt, electrumUntil }
let flight = null;                           // { t, from: Vector3 (render), to (render) }
let anchor = null, t0spark = null, t0comp = null, t0btn = null;
const _v = new Vector3(), _f = new Vector3(), _r = new Vector3(), _u = new Vector3(), _a = new Vector3(), _b = new Vector3();
const _s = { x: 0, y: 0, depth: 0, visible: false };
const K = { x: 0, y: 0, r: 0 };

const sparkSize = () => 1.5 + 2.5 * clamp01((k - 1) / 9);
const pulse = (tMs) => { const ph = (tMs % BEAT_MS) / BEAT_MS; return Math.exp(-ph * 7); };

/** Render-space point of the far spark: from the camera, to the right of the Key, at D_k (clamped inside the far plane). */
function sparkPoint(out) {
  const cam = rig.camera;
  _f.set(0, 0, -1).transformDirection(cam.matrixWorld);
  _r.set(1, 0, 0).transformDirection(cam.matrixWorld);
  _u.set(0, 1, 0).transformDirection(cam.matrixWorld);
  const half = Math.atan(Math.tan(((cam.fov || 35) * DEG) / 2) * Math.max(0.3, layout.w / Math.max(1, layout.h)));
  const ax = Math.tan(half * (layout.isPhone ? 0.62 : 0.4)), ay = Math.tan(((cam.fov || 35) * DEG) / 2) * 0.16;
  _v.copy(_f).addScaledVector(_r, ax).addScaledVector(_u, ay).normalize();
  const D = companionDistance(Math.min(k, 10)) * scaleEngine.s;
  const dist = Math.min(D, cam.far * 0.8);
  return out.copy(cam.position).addScaledVector(_v, dist);
}

/** Canonical (Key-local) orbit point at angle th → out. */
function orbitPoint(th, out) {
  const r = COMPANION.r;
  out.set(Math.cos(th) * r, 0.32 + Math.sin(th) * r * Math.sin(TILT), Math.sin(th) * r * Math.cos(TILT));
  return out;
}

// ─── WebGL pieces ───────────────────────────────────────────────────────────────────────────────────────────────
function ensureSpark() {
  if (spark || !ctx.worldFx) return;
  sparkPos = new Float32Array(3);
  spark = createPoints({ positions: sparkPos, count: 1, sizePx: sparkSize(), color: 'ember', alpha: 0, fog: false, renderOrder: 4 });
  ctx.scene.add(spark.object);                 // render space (it is placed from the camera every frame)
}

/** The companion: the Key's own strata at 1:10 drawn as one hairline batch (rings at each stratum's top and bottom —
 *  and the waist of • — with the edges between them), cryptex aligned. Key-local metres. */
function companionSegments() {
  const k = COMPANION.size / 2.4, out = [];
  const pt = (n, j, y) => { const a = (j / n) * Math.PI * 2 + Math.PI / n; const r = radiusAt(y); return [Math.sin(a) * r * k, y * k, Math.cos(a) * r * k]; };
  for (const st of STRATA_GEOM) {
    const ys = st.top > 0 && st.bot < 0 ? [st.top, 0, st.bot] : [st.top, st.bot];
    for (const y of ys) {
      if (radiusAt(y) < 1e-4) continue;
      for (let j = 0; j < st.n; j++) out.push(...pt(st.n, j, y), ...pt(st.n, j + 1, y));
    }
    for (let q = 0; q + 1 < ys.length; q++) for (let j = 0; j < st.n; j++) out.push(...pt(st.n, j, ys[q]), ...pt(st.n, j, ys[q + 1]));
  }
  return new Float32Array(out);
}

function buildCompanion() {
  if (comp || !ctx.nest) return;
  const group = new Group();
  group.name = 'companion';
  const body = createLines({ segments: companionSegments(), color: 'silver', width: 1, alpha: 0.9, far: 60, glint: 0.9 });
  group.add(body.mesh);
  const nucPos = new Float32Array(3);
  const nucleus = createPoints({ positions: nucPos, count: 1, sizePx: 3, color: 'ember', alpha: 1, fog: false });
  group.add(nucleus.object);
  ctx.nest.level(0).add(group);
  comp = { group, body, nucleus, theta0: Math.random() * Math.PI * 2, bornAt: loop.now, spin: 0, spinT: -1, electrumUntil: -1 };
  if (ctx.overlay && has(ctx.overlay, 'add')) {
    anchor = ctx.overlay.add({ owner: 'secrets', id: 'companion', get: compGet, cross: false, lowpass: 40,
      button: { label: 'спутник', onActivate: spin } });
    if (anchor.button) anchor.button.dataset.qa = 'companion';
    anchor.setVisible(app.room === 'CORE');
  }
}
function compGet(out) {
  if (!comp) return out.set(0, 0, -1e6);
  return out.setFromMatrixPosition(comp.group.matrixWorld);
}

function spin() {
  if (!comp) return;
  comp.spinT = loop.now;
  audio.play('droneDodge', {});
}

// ─── T0 pieces ──────────────────────────────────────────────────────────────────────────────────────────────────
function ensureT0Spark() {
  if (t0spark) return;
  t0spark = document.createElement('i');
  t0spark.className = 'sec-t0mote sec-t0spark';
  const root = fxRoot();
  if (root) root.appendChild(t0spark);
}
function ensureT0Comp() {
  if (t0comp) return;
  t0comp = document.createElementNS(SVGNS, 'svg');
  t0comp.setAttribute('class', 'sec-t0comp');
  t0comp.setAttribute('viewBox', '-8 -14 16 28');
  t0comp.setAttribute('width', '16'); t0comp.setAttribute('height', '28');
  const body = document.createElementNS(SVGNS, 'path');
  // the Key's elevation at 1:10 (a lozenge of seven strata)
  body.setAttribute('d', 'M0 -12L6.2 -3L6.2 3L0 12L-6.2 3L-6.2 -3Z M-4.1 -6H4.1 M-6.2 -3H6.2 M-6.2 0H6.2 M-6.2 3H6.2 M-4.1 6H4.1');
  const nuc = document.createElementNS(SVGNS, 'circle');
  nuc.setAttribute('r', '1.3'); nuc.setAttribute('class', 'sec-t0comp-nuc');
  t0comp.append(body, nuc);
  t0btn = document.createElement('button');
  t0btn.type = 'button'; t0btn.className = 'proxy'; t0btn.dataset.qa = 'companion'; t0btn.setAttribute('aria-label', 'спутник');
  t0btn.addEventListener('click', () => { if (t0comp) { t0comp.classList.remove('is-spin'); requestAnimationFrame(() => t0comp.classList.add('is-spin')); } audio.play('droneDodge', {}); });
  const root = fxRoot(), ov = overlayRoot();
  if (root) root.appendChild(t0comp);
  if (ov) ov.appendChild(t0btn);
}

// ─── the frame ──────────────────────────────────────────────────────────────────────────────────────────────────
function frame() {
  const inCore = app.room === 'CORE' && app.phase !== 'transition';
  const t = loop.now;
  if (!isT0() && rig.camera) {
    if (spark) {
      const on = inCore && !flight && !comp && !state.data.companionArrived;
      if (on) {
        sparkPoint(_a);
        sparkPos[0] = _a.x; sparkPos[1] = _a.y; sparkPos[2] = _a.z;
        spark.setPositions(sparkPos, 1);
        spark.setSize(sparkSize());
        spark.setAlpha(ALPHA.spark * (0.55 + 0.45 * pulse(t)));
      } else if (!flight) spark.setAlpha(0);
    }
    if (flight) flyFrame();
    if (comp) compFrame(t);
  } else t0Frame(t, inCore);
}

function flyFrame() {
  // world time (a ПАУЗА holds it), never the clamped frame dt: at a few fps the flight keeps its 2,400 ms
  const u = reduced() ? 1 : clamp01((loop.worldNow - flight.t0) / COMPANION.flyMs);
  const e = easeInOut(u);
  // a curve: the start, a control swung wide to the right and above, the orbit entry
  orbitPoint(flight.theta, _b);
  ctx.nest.level(0).localToWorld(_b);
  _v.copy(flight.from).lerp(_b, 0.5).addScaledVector(flight.side, flight.from.distanceTo(_b) * 0.35);
  const a = 1 - e;
  _a.copy(flight.from).multiplyScalar(a * a).addScaledVector(_v, 2 * a * e).addScaledVector(_b, e * e);
  sparkPos[0] = _a.x; sparkPos[1] = _a.y; sparkPos[2] = _a.z;
  spark.setPositions(sparkPos, 1);
  spark.setSize(4 + 2 * e);
  spark.setAlpha(Math.min(1, ALPHA.spark + e));
  if (u >= 1) { const f = flight; flight = null; spark.setAlpha(0); land(f.theta); f.done(); }
}

function compFrame(t) {
  const th = comp.theta0 + (2 * Math.PI * (t - comp.bornAt)) / (COMPANION.periodS * 1000);
  orbitPoint(th, comp.group.position);
  let yaw = -th + Math.PI / 2;                                   // it faces where it is going
  if (comp.spinT >= 0) {
    const x = clamp01((t - comp.spinT) / 900);
    yaw += 4 * Math.PI * (1 - (1 - x) * (1 - x) * (1 - x));
    if (x >= 1) comp.spinT = -1;
  }
  comp.group.rotation.set(0, yaw, 0);
  // the nucleus: electrum for 2,500 ms after it lands, then ember (cools over 600)
  const el = comp.electrumUntil;
  if (el > 0) {
    if (t < el) comp.nucleus.setColor('electrum');
    else { comp.nucleus.setColor('ember'); comp.electrumUntil = -1; }
  }
  comp.nucleus.setAlpha(0.8 + 0.2 * pulse(t));
  const vis = app.room === 'CORE';
  comp.group.visible = vis;
  if (anchor) anchor.setVisible(vis && app.phase !== 'transition');
}

function t0Frame(t, inCore) {
  if (!t0spark && !t0comp) return;
  keyScreen(K);
  if (t0spark) {
    const on = inCore && !state.data.companionArrived && !flight;
    t0spark.style.opacity = on ? String(ALPHA.spark * (0.55 + 0.45 * pulse(t)) / 0.3) : '0';
    const s = sparkSize();
    t0spark.style.width = t0spark.style.height = `${s}px`;
    if (!flight) t0spark.style.transform = `translate3d(${(K.x + K.r * 3.7).toFixed(1)}px,${(K.y - K.r * 0.8).toFixed(1)}px,0)`;
  }
  if (t0comp) {
    const th = (2 * Math.PI * t) / (COMPANION.periodS * 1000);
    const R = K.r * (COMPANION.r / 0.62);
    const x = K.x + Math.cos(th) * R, y = K.y - K.r * 0.3 + Math.sin(th) * R * 0.2;
    t0comp.style.transform = `translate3d(${(x - 8).toFixed(1)}px,${(y - 14).toFixed(1)}px,0)`;
    t0comp.style.opacity = !inCore ? '0' : Math.sin(th) < 0 ? '0.45' : '1';
    if (t0btn) t0btn.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  }
}

// ─── the arrival (distinct day 10) ──────────────────────────────────────────────────────────────────────────────
function land(theta) {
  if (!isT0()) {
    buildCompanion();
    if (comp) { comp.theta0 = theta; comp.bornAt = loop.now; comp.electrumUntil = loop.now + TIMING.electrum; comp.nucleus.setColor('electrum'); }
  } else {
    ensureT0Comp();
    if (t0comp) t0comp.classList.add('is-electrum');
    after(TIMING.electrum, () => { if (t0comp) t0comp.classList.remove('is-electrum'); });
  }
  state.set('companionArrived', true);
  app.companion = true;
  bus.emit('companion:arrive', {});
  const name = WORLD.companion.name;
  if (ctx.lead && has(ctx.lead, 'show')) safe('comp:lead', () => ctx.lead.show(`Он прилетел. Его зовут ${name}.`, { ms: 4200 }));
  say('companion.arrived', { name });
  keyScreen(K);
  if (ctx.secrets) safe('comp:discover', () => ctx.secrets.discover('S14', { anchor: { x: K.x + K.r * 2.4, y: K.y } }));
}

function arrive() {
  return new Promise((resolve) => {
    audio.play('companion', {});
    const theta = Math.PI * 0.08;
    if (!isT0() && spark && rig.camera) {
      const from = sparkPoint(new Vector3());
      _r.set(1, 0, 0).transformDirection(rig.camera.matrixWorld);
      flight = { t0: loop.worldNow, from, theta, side: new Vector3().copy(_r).add(_u.set(0, 0.6, 0)).normalize() };
      flight.done = resolve;
    } else {
      // T0: the DOM point glides along a curve onto the orbit
      ensureT0Spark();
      keyScreen(K);
      const x0 = K.x + K.r * 3.7, y0 = K.y - K.r * 0.8, x1 = K.x + K.r * (COMPANION.r / 0.62), y1 = K.y - K.r * 0.3;
      flight = { t0: loop.worldNow };
      const step = () => {
        const u = reduced() ? 1 : clamp01((loop.worldNow - flight.t0) / COMPANION.flyMs);
        const e = easeInOut(u), a = 1 - e;
        const cx = (x0 + x1) / 2 + K.r * 1.2, cy = Math.min(y0, y1) - K.r;
        const x = a * a * x0 + 2 * a * e * cx + e * e * x1, y = a * a * y0 + 2 * a * e * cy + e * e * y1;
        t0spark.style.opacity = '1';
        t0spark.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      };
      const id = loop.add(() => { step(); if (reduced() || loop.worldNow - flight.t0 >= COMPANION.flyMs) { loop.remove(id); flight = null; t0spark.style.opacity = '0'; land(theta); resolve(); } }, ORDER.UI);
    }
  });
}

function onBootDone() {
  const d = state.data;
  if (!d || d.companionArrived) return;
  if (k >= COMPANION.arriveDay) {
    const stage = ctx.fx && ctx.fx.stage;
    if (stage && has(stage, 'run')) stage.run('companion', () => arrive());
    else arrive();
  } else {
    const line = () => (k <= 3 ? say('companion.far') : say('companion.near', { n: COMPANION.arriveDay - k }));
    // a night / drowsy / birthday visit opens with its own line; the news of the companion comes after it
    if (app.night || app.drowsy || app.birthday) after(TIMING.statusHold + 400, line); else line();
  }
}

export function initCompanion(c) {
  ctx = c;
  k = state.distinctDays | 0;
  loop.add(frame, ORDER.FX);
  bus.on('boot:done', onBootDone);
  if (!isT0()) {
    if (state.data.companionArrived) buildCompanion();
    else ensureSpark();
  } else if (state.data.companionArrived) ensureT0Comp();
  else ensureT0Spark();
  if (state.data.companionArrived) app.companion = true;
  bus.on('travel:start', () => { if (anchor) anchor.setVisible(false); });
  void W;
}
