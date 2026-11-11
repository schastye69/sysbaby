// render/lamp.js — R5, the one light (ARCH §3.5.6, SPEC §2.4 R5).
//
// With pointer NDC p, camera right R, camera up Uc and the unit vector F from the focus toward the camera:
//   L = C + 2.2·radius·( cos12°·normalize(p.x·R + p.y·Uc) + sin12°·F )
// Modes: desktop 'pointer' while the pointer moved within the last 3,000 ms (and is over the window), else 'sweep';
// phone 'finger' while a finger is down, else 'sweep'. Sweep: the same 12° grazing light orbiting the focus in the
// screen plane, one revolution per 9,000 ms, starting from the last pointer direction. Mode changes blend over 600 ms.
// hold(pos) overrides (WORKSHOP save sweep); sweepOnce(ms) runs one fast revolution. Writes U.uLamp (render space).
import { Vector3 } from 'three';
import { U } from './uniforms.js';
import { rig } from './cameraRig.js';
import { layout } from '../core/layout.js';
import { loop } from '../core/loop.js';
import { input } from '../core/input.js';
import { KEY, RENDER } from '../core/tokens.js';
import { EASE } from '../core/ease.js';

const R5 = RENDER.r5;
const EL = (R5.elevationDeg * Math.PI) / 180;
const COS_EL = Math.cos(EL), SIN_EL = Math.sin(EL);
const TAU = Math.PI * 2;

const C = new Vector3(0, 0, 0);
let radius = KEY.radius;
const holdPos = new Vector3();
let holding = false;
let az = Math.PI * 0.75;                 // sweep azimuth in the screen plane (rad), from camera right toward up
let lastDirX = -0.7, lastDirY = 0.7;     // last pointer direction (screen plane, unit)
let fastUntil = 0, fastMs = 0;           // sweepOnce
const from = new Vector3(), target = new Vector3();
let blendT = 1;                          // 0..1 over 600 ms
let lastMode = '';
const _R = new Vector3(), _Up = new Vector3(), _F = new Vector3(), _d = new Vector3();

export const lamp = {
  /** render space; the same object as U.uLamp.value */
  position: U.uLamp.value,
  /** 'pointer' | 'finger' | 'sweep' (read-only) */
  mode: 'sweep',
  ctx: null,

  init(ctx) {
    lamp.ctx = ctx;
    lamp.setFocus(C.set(0, 0, 0), KEY.radius);
    return lamp;
  },

  /** Halls call on arrive (render space, copied). Default: the Key (origin, 1.25). */
  setFocus(center, r) {
    C.copy(center);
    radius = r != null ? r : radius;
  },

  /** Explicit override; null releases (blends back). */
  hold(pos) {
    if (pos) { holdPos.copy(pos); if (!holding) { from.copy(lamp.position); blendT = 0; } holding = true; }
    else if (holding) { holding = false; from.copy(lamp.position); blendT = 0; }
  },

  /** One fast idle-sweep revolution over ms. */
  sweepOnce(ms) { fastMs = Math.max(200, ms || 1200); fastUntil = loop.now + fastMs; },

  /** ORDER.LAMP */
  update(dt) {
    const cam = rig.camera;
    if (!cam) return;
    const p = input.pointer;
    const touch = p.type === 'touch' || layout.isPhone;
    let mode;
    if (loop.now < fastUntil) mode = 'sweep';
    else if (touch) mode = p.down ? 'finger' : 'sweep';
    else mode = p.inside !== false && p.x > -9000 && loop.now - p.lastMove < R5.idleMs ? 'pointer' : 'sweep';
    if (mode !== lastMode) {
      if (lastMode) { from.copy(lamp.position); blendT = 0; }
      if (mode === 'sweep') az = Math.atan2(lastDirY, lastDirX);       // continue from the last pointer direction
      lastMode = mode;
    }
    lamp.mode = mode;

    _R.setFromMatrixColumn(cam.matrixWorld, 0);
    _Up.setFromMatrixColumn(cam.matrixWorld, 1);
    _F.copy(cam.position).sub(C);
    if (_F.lengthSq() < 1e-12) _F.setFromMatrixColumn(cam.matrixWorld, 2); else _F.normalize();

    let dx, dy;
    if (mode === 'sweep') {
      const period = loop.now < fastUntil ? fastMs : R5.sweepMs;
      az += (TAU * dt * 1000) / period;
      if (az > TAU) az -= TAU;
      dx = Math.cos(az); dy = Math.sin(az);
    } else {
      const nx = (p.x / Math.max(1, layout.w)) * 2 - 1, ny = -(p.y / Math.max(1, layout.h)) * 2 + 1;
      const l = Math.hypot(nx, ny);
      if (l > 1e-4) { lastDirX = nx / l; lastDirY = ny / l; }
      dx = lastDirX; dy = lastDirY;
    }
    _d.copy(_R).multiplyScalar(dx).addScaledVector(_Up, dy).normalize();
    const rr = R5.radiusFactor * radius;
    target.copy(C).addScaledVector(_d, rr * COS_EL).addScaledVector(_F, rr * SIN_EL);
    if (holding) target.copy(holdPos);

    if (blendT < 1) {
      blendT = Math.min(1, blendT + (dt * 1000) / R5.blendMs);
      lamp.position.copy(from).lerp(target, EASE.reveal(blendT));
    } else {
      lamp.position.copy(target);
    }
  },
};
