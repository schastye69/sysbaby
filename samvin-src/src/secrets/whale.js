// secrets/whale.js — S07 КИТ (SPEC §8.1 S07, §9.6; SPEC-ADDENDUM A1.3 §8.1 S07, A2.10, A2.0.1; ARCH §6.11). OWNER: WP10.
// When: guaranteed on the first room arrival on distinct day ≥ 5 until seen; afterwards 1/12 per arrival, at most once a
// day. Through the stage lock ('whale', the lowest priority: busy → its reduced form, which for the whale is the same
// crossing). What: a giant gentle LATTICE whale glides past outside the hall's walls — 7 hairline rings forming a 400 m
// tapering body, eight longitudinal hairlines, two fin planes and the flukes, all ONE R3 line batch (one draw call), in
// --silver at 30 %, 700 m from the camera, crossing the view in 8,000 ms, its tail undulating at 0.25 Hz (the bend
// grows toward the flukes). The deep call (`whale`) is planned on the cue clock to be audible 2,040 ms after the first
// frame on which its body is visible (700 m ÷ 343 m/s, A2.10). Status «смотри. кит.»; whaleSeen / whaleDay persisted;
// secrets.discover('S07') on that first visible frame. Reduced motion: it still crosses (no tail undulation). T0: none
// (SPEC §12.5: S07 is unavailable in T0). A travel fades it out at once.
import { Object3D, Vector3, Matrix4 } from 'three';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { loop, ORDER } from '../core/loop.js';
import { audio } from '../audio/engine.js';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { createLines } from '../render/lines.js';
import { layout } from '../core/layout.js';
import { ALPHA } from '../core/tokens.js';
import { registerHookField } from '../core/testhook.js';
import { W, has, say, safe, reduced, isT0, clamp01 } from './util.js';

const L = 400, DIST = 700, CROSS_MS = 8000, TAIL_HZ = 0.25, TAIL_AMP = 20, RING_SEG = 40, SOUND_DELAY = 2040;
const RADII = [30, 40, 38, 32, 24, 14, 5];
const DEG = Math.PI / 180;

let ctx = null;
let base = null, seg = null, lines = null, holder = null;
let run = null;   // { t0 (loop ms), from, to (Vector3 canonical), visibleAt, plannedAt, fadeOut, done }
let lastVisibleAt = null, lastPlannedAt = null;
const _c = new Vector3(), _f = new Vector3(), _r = new Vector3(), _u = new Vector3(0, 1, 0), _p = new Vector3();
const _m = new Matrix4(), _x = new Vector3(), _y = new Vector3(), _z = new Vector3();
const _s = { x: 0, y: 0, depth: 0, visible: false };

/** The body in its own frame: x along the body (head at +x), y up, z lateral. → Float32Array of segments. */
function buildBody() {
  const out = [];
  const seg6 = (a, b) => out.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  const ringX = (i) => L / 2 - (L * i) / 6;
  const ring = (i, j) => {
    const a = (j / RING_SEG) * Math.PI * 2, r = RADII[i];
    return [ringX(i), Math.cos(a) * r * 0.92, Math.sin(a) * r];
  };
  for (let i = 0; i < 7; i++) for (let j = 0; j < RING_SEG; j++) seg6(ring(i, j), ring(i, (j + 1) % RING_SEG));
  for (let k = 0; k < 8; k++) {
    const j = k * (RING_SEG / 8);
    seg6([L / 2 + 26, 0, 0], ring(0, j));                         // the blunt head
    for (let i = 0; i < 6; i++) seg6(ring(i, j), ring(i + 1, j));
  }
  // two fin planes (pectoral), flat and swept back
  for (const s of [1, -1]) {
    const a = [118, -16, 30 * s], b = [86, -20, 32 * s], tip = [58, -48, 104 * s], mid = [92, -30, 66 * s];
    seg6(a, tip); seg6(tip, b); seg6(b, a); seg6(mid, [100, -18, 31 * s]);
  }
  // the flukes: a horizontal crescent behind the last ring
  const tx = ringX(6);
  for (const s of [1, -1]) {
    const root = [tx - 6, 0, 0], lead = [tx - 28, 0, 44 * s], tip = [tx - 54, 0, 70 * s], trail = [tx - 40, 0, 26 * s], notch = [tx - 34, 0, 0];
    seg6(root, lead); seg6(lead, tip); seg6(tip, trail); seg6(trail, notch);
  }
  return new Float32Array(out);
}

function ensureLines() {
  if (lines) return;
  base = buildBody();
  seg = new Float32Array(base);
  lines = createLines({ segments: seg, color: 'silver', width: 1, alpha: 0, far: 3000, fog: false, glint: 0.15 });
  holder = new Object3D();
  holder.matrixAutoUpdate = false;
  holder.add(lines.mesh);
  lines.mesh.visible = false;
}

/** Tail undulation: the bend grows toward the flukes. */
function deform(tSec) {
  const n = base.length;
  const w = 2 * Math.PI * TAIL_HZ * tSec;
  const amp = reduced() ? 0 : TAIL_AMP;
  for (let i = 0; i < n; i += 3) {
    const x = base[i];
    const u = clamp01((L / 2 - x) / (L + 60));
    const dy = amp * u * u * Math.sin(w - u * 2.6);
    seg[i] = x; seg[i + 1] = base[i + 1] + dy; seg[i + 2] = base[i + 2];
  }
  lines.setSegments(seg);
}

function shouldSpawn() {
  const d = state.data;
  if (!d) return false;
  if (!d.whaleSeen) return state.distinctDays >= 5;
  if (d.whaleDay === state.today) return false;
  return Math.random() < 1 / 12;
}

function begin() {
  if (!rig.camera || !ctx.worldFx) return;
  ensureLines();
  // the crossing line, in canonical metres, from the camera as it rests in this hall
  scaleEngine.toCanonical(rig.camera.position, _c);
  _f.set(0, 0, -1).transformDirection(rig.camera.matrixWorld);
  _f.y = 0;
  if (_f.lengthSq() < 1e-6) _f.set(0, 0, -1);
  _f.normalize();
  _r.crossVectors(_f, _u).normalize();
  const vfov = (rig.camera.fov || 35) * DEG;
  const aspect = Math.max(0.3, layout.w / Math.max(1, layout.h));
  const hw = DIST * Math.tan(vfov / 2) * aspect;
  const lift = DIST * Math.tan(vfov / 2) * 0.34;
  const from = new Vector3().copy(_c).addScaledVector(_f, DIST).addScaledVector(_r, -(hw + L / 2 + 40)).addScaledVector(_u, lift);
  const to = new Vector3().copy(_c).addScaledVector(_f, DIST).addScaledVector(_r, hw + L / 2 + 40).addScaledVector(_u, lift * 0.8);
  run = { t0: loop.worldNow, from, to, visibleAt: null, plannedAt: null, fadeOut: -1, done: null };
  if (holder.parent !== ctx.worldFx) ctx.worldFx.add(holder);
  lines.mesh.visible = true;
  state.patch((d) => { d.whaleSeen = true; d.whaleDay = state.today; });
  return new Promise((res) => { run.done = res; });
}

function end() {
  if (lines) { lines.mesh.visible = false; lines.setAlpha(0); }
  if (holder && holder.parent) holder.parent.remove(holder);
  const r = run;
  run = null;
  if (r && r.done) r.done();
}

function frame() {
  if (!run) return;
  const t = loop.worldNow - run.t0;   // world time: a ПАУЗА holds it too
  if (t >= CROSS_MS || (run.fadeOut >= 0 && loop.now - run.fadeOut > 300)) { end(); return; }
  const k = t / CROSS_MS;
  _p.lerpVectors(run.from, run.to, k);
  // body frame: x = heading, y = up, z = x × y
  _x.subVectors(run.to, run.from).normalize();
  _y.copy(_u);
  _z.crossVectors(_x, _y).normalize();
  _m.makeBasis(_x, _y, _z).setPosition(_p);
  holder.matrix.copy(_m);
  holder.matrixWorldNeedsUpdate = true;
  deform(t / 1000);
  let a = ALPHA.whale * clamp01(t / 600) * clamp01((CROSS_MS - t) / 600);
  if (run.fadeOut >= 0) a *= 1 - clamp01((loop.now - run.fadeOut) / 300);
  lines.setAlpha(a);
  if (run.visibleAt == null) firstVisible();
}

/** The first frame on which the body is on screen: the call is planned 2,040 ms later; status; the discovery. */
function firstVisible() {
  let seen = false, sx = 0, sy = 0;
  for (let q = -1; q <= 1 && !seen; q++) {
    _x.subVectors(run.to, run.from).normalize();
    _c.copy(_p).addScaledVector(_x, q * (L / 2 - 10));
    scaleEngine.toRender(_c, _f);
    rig.project(_f, _s);
    if (_s.depth > 0 && _s.x >= 0 && _s.x <= layout.w && _s.y >= 0 && _s.y <= layout.h) { seen = true; sx = _s.x; sy = _s.y; }
  }
  if (!seen) return;
  const fx = ctx.fx;
  const now = performance.now();
  const V = fx && fx.cue && has(fx.cue, 'presentAt') ? fx.cue.presentAt(now) : now;
  run.visibleAt = V; lastVisibleAt = V;
  run.plannedAt = V + SOUND_DELAY; lastPlannedAt = run.plannedAt;
  if (fx && fx.cue && has(fx.cue, 'at')) {
    safe('whale:cue', () => fx.cue.at(run.plannedAt, { id: 'whale', audio: (T) => audio.play('whale', { when: T }) }));
  } else setTimeout(() => audio.play('whale', {}), SOUND_DELAY);
  say('whale');
  if (ctx.secrets) safe('whale:discover', () => ctx.secrets.discover('S07', { anchor: { x: sx, y: sy } }));
}

function onArrive() {
  if (isT0() || run || app.booting) return;
  if (app.show && app.show.active) return;
  if (!shouldSpawn()) return;
  const stage = ctx.fx && ctx.fx.stage;
  if (stage && has(stage, 'run')) stage.run('whale', () => begin());
  else begin();
}

export function initWhale(c) {
  ctx = c;
  if (isT0()) return;
  loop.add(frame, ORDER.FX);
  bus.on('room:arrive', onArrive);
  bus.on('travel:start', () => { if (run && run.fadeOut < 0) run.fadeOut = loop.now; });
  registerHookField('whale', () => ({ active: !!run, visibleAt: lastVisibleAt, plannedAt: lastPlannedAt }));
}
