// render/cameraRig.js — the camera rig (ARCH §3.4).
//
// The director (during travel) or the current hall's livePose (idle) writes the base pose with setPose(); named
// additive offsets ('drift', 'lean', 'tremble', 'anticip' …) are added on top. apply() runs at ORDER.CAMERA:
//   pos = pose.pos + Σ offsets; lookAt(target) with up = +Y (−Z when looking straight up/down); fov; roll;
//   setViewOffset for offsetY (the target projects to y = (0.5 + offsetY)·H); scaleEngine.focus = target;
//   scaleEngine.fitClip(camera); U.uCamPos; U.uPxPerUnit = layout.h / (2·tan(fov/2)); velocity (one-pole, τ 80 ms).
// project/unproject/ray work in CSS px from layout.w/h — no layout reads.
import { Vector3, Vector2, Ray } from 'three';
import { U } from './uniforms.js';
import { layout } from '../core/layout.js';
import { ENV } from '../core/env.js';
import { loop } from '../core/loop.js';
import { scaleEngine } from './scale.js';
import { CAMERA } from '../core/tokens.js';

const DEG = Math.PI / 180;
const TAU_V = 0.080;                 // velocity smoothing (s)
const _sum = new Vector3(), _dir = new Vector3(), _v = new Vector3(), _prev = new Vector3(), _inst = new Vector3();
const _n = new Vector2();
let hasPrev = false;

/** name → { pos: Vector3, fov: number, on: boolean } (allocated once per name); offList mirrors it for the frame loop. */
const offsets = new Map();
const offList = [];
const trem = { until: 0, ms: 0, amp: 0, off: new Vector3() };

export const rig = {
  camera: null,
  /** base pose for this frame (render space) */
  pose: { pos: new Vector3(0, 0.75, 7.2), target: new Vector3(0, 0, 0), fov: CAMERA.fov, offsetY: 0, roll: 0 },
  /** render-space camera velocity, m/s, one-pole smoothed (τ 80 ms) */
  velocity: new Vector3(),

  init(camera) {
    rig.camera = camera;
    hasPrev = false;
    return rig;
  },

  /** Copies the pose values (no reference kept). */
  setPose(p) {
    if (!p) return;
    if (p.pos) rig.pose.pos.copy(p.pos);
    if (p.target) rig.pose.target.copy(p.target);
    rig.pose.fov = p.fov != null ? p.fov : CAMERA.fov;
    rig.pose.offsetY = p.offsetY || 0;
    rig.pose.roll = p.roll || 0;
  },

  /** Additive offset by name; pos null removes it. */
  setOffset(name, pos, fovDelta = 0) {
    let o = offsets.get(name);
    if (!pos && !fovDelta) { if (o) o.on = false; return; }
    if (!o) { o = { pos: new Vector3(), fov: 0, on: true }; offsets.set(name, o); offList.push(o); }
    if (pos) o.pos.copy(pos); else o.pos.set(0, 0, 0);
    o.fov = fovDelta;
    o.on = true;
  },

  /** A short screen-space shake of `px` CSS px over `ms` (no-op under reduced motion). */
  tremble(px = 1, ms = 120) {
    if (ENV.reducedMotion) return;
    trem.amp = px; trem.ms = ms; trem.until = loop.now + ms;
  },

  /** ORDER.CAMERA. dt in seconds. */
  apply(dt = 1 / 60) {
    const cam = rig.camera;
    if (!cam) return;
    const p = rig.pose;
    _sum.set(0, 0, 0);
    let fov = p.fov;
    for (let i = 0; i < offList.length; i++) { const o = offList[i]; if (o.on) { _sum.add(o.pos); fov += o.fov; } }
    const dist = Math.max(1e-6, _dir.copy(p.target).sub(p.pos).length());
    if (trem.until > loop.now && trem.ms > 0) {
      const k = (trem.until - loop.now) / trem.ms;
      const m = (trem.amp * k * dist) / Math.max(1e-6, U.uPxPerUnit.value);
      trem.off.set((Math.random() * 2 - 1) * m, (Math.random() * 2 - 1) * m, 0).applyQuaternion(cam.quaternion);
      _sum.add(trem.off);
    }
    cam.position.copy(p.pos).add(_sum);
    _dir.copy(p.target).sub(cam.position);
    const len = _dir.length();
    if (len > 1e-9 && Math.abs(_dir.y / len) > 0.999) cam.up.set(0, 0, -1); else cam.up.set(0, 1, 0);
    cam.lookAt(p.target);
    if (p.roll) cam.rotateZ(p.roll);
    cam.fov = fov;
    const w = Math.max(1, layout.w), h = Math.max(1, layout.h);
    cam.aspect = w / h;
    if (p.offsetY) cam.setViewOffset(w, h, 0, -p.offsetY * h, w, h);
    else if (cam.view && cam.view.enabled) cam.clearViewOffset();
    scaleEngine.focus.copy(p.target);
    scaleEngine.fitClip(cam);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    U.uCamPos.value.copy(cam.position);
    U.uPxPerUnit.value = h / (2 * Math.tan((fov * DEG) / 2));
    // Velocity (render space, m/s), one-pole smoothed.
    if (hasPrev && dt > 0) {
      _inst.copy(cam.position).sub(_prev).multiplyScalar(1 / dt);
      rig.velocity.lerp(_inst, 1 - Math.exp(-dt / TAU_V));
    }
    _prev.copy(cam.position);
    hasPrev = true;
  },

  /** Render-space point → CSS px {x, y, depth (view-space, render units), visible}. No layout reads. */
  project(v, out) {
    const cam = rig.camera;
    if (!cam) { out.x = -9999; out.y = -9999; out.depth = 0; out.visible = false; return out; }
    _v.copy(v).applyMatrix4(cam.matrixWorldInverse);
    out.depth = -_v.z;
    _v.applyMatrix4(cam.projectionMatrix);
    out.x = (_v.x + 1) * 0.5 * layout.w;
    out.y = (1 - _v.y) * 0.5 * layout.h;
    out.visible = out.depth > 0 && _v.x >= -1 && _v.x <= 1 && _v.y >= -1 && _v.y <= 1;
    return out;
  },

  /** CSS px + view depth → render-space point. */
  unproject(x, y, depth, out) {
    const cam = rig.camera;
    if (!cam) return out.set(0, 0, 0);
    rig.ray(x, y, _ray);
    _v.set(0, 0, -1).transformDirection(cam.matrixWorld);           // forward
    const c = Math.max(1e-6, _ray.direction.dot(_v));
    return out.copy(_ray.origin).addScaledVector(_ray.direction, depth / c);
  },

  /** CSS px → render-space Ray from the camera. */
  ray(x, y, out) {
    const cam = rig.camera;
    _n.set((x / Math.max(1, layout.w)) * 2 - 1, -(y / Math.max(1, layout.h)) * 2 + 1);
    out.origin.setFromMatrixPosition(cam.matrixWorld);
    out.direction.set(_n.x, _n.y, 0.5).unproject(cam).sub(out.origin).normalize();
    return out;
  },

  /** WP0 internal: the scale engine maps the velocity history across a rebase (so no velocity spike). */
  remapHistory(fn) { if (hasPrev) fn(_prev); },
};

const _ray = new Ray();
