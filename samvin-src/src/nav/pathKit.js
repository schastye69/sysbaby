// nav/pathKit.js — WP0-internal helpers for nav/paths.js and nav/director.js (ARCH §3.6).
//
// Everything here is allocation-free at pose time: builders allocate their curves and scratch vectors once, pose(u)
// only writes into preallocated objects.
//
// Time ↔ u. During auto-travel u = EASE.camera(t / D) (SPEC §7.1). A choreography window [a, b] ms applies for
// u ∈ [msU(a), msU(b)] (ARCH §3.6.1), progress inside a window is linear in u. Events that SPEC times in ms and that
// other modules evaluate in ms (the Key's setMorph is PURE in tMs) use tOfU(u, D), the exact inverse of the ease.
import { Vector3, CatmullRomCurve3 } from 'three';
import { EASE, clamp01, lerp } from '../core/ease.js';

// ─── PoseOut ─────────────────────────────────────────────────────────────────────────────────────────────────
/** A fresh PoseOut (ARCH §3.6.1) plus WP0 additions the director applies every frame:
 *  Q (render position of the canonical origin implied by s/pivot), morph (Key morph channel), vinStrata (per-stratum
 *  alpha of nest.structure(1)), vinGap, rim (ctx.rim alpha), pillar (axis pillar alpha), shellFrom/shellTo (hall shell
 *  alphas), iris (shell iris openings), vel (render-space camera velocity; only meaningful on a retarget start). */
export function createPoseOut() {
  return {
    cam: { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 },
    s: 1, pivot: new Vector3(), Q: new Vector3(), fog: 0.00485,
    fade: { mini: 0, key: 1, vin: 1, parent: 0 },
    alt: 0, exitU: 0, enterU: 0, speed01: 0, pan: 0, counter: 0, flashCode: null,
    morph: { kind: 'none', i: 3, tMs: 0, D: 1 },
    vinStrata: new Float32Array([1, 1, 1, 1, 1, 1, 1]), vinGap: 0.020,
    rim: 1, pillar: 1, shellFrom: 1, shellTo: 1,
    iris: { fromTop: 0, fromBottom: 0, toTop: 0, toBottom: 0 },
    vel: new Vector3(),
  };
}

/** Deep copy a → b (both PoseOut). */
export function copyPoseOut(a, b) {
  b.cam.pos.copy(a.cam.pos); b.cam.target.copy(a.cam.target);
  b.cam.fov = a.cam.fov; b.cam.offsetY = a.cam.offsetY; b.cam.roll = a.cam.roll;
  b.s = a.s; b.pivot.copy(a.pivot); b.Q.copy(a.Q); b.fog = a.fog;
  b.fade.mini = a.fade.mini; b.fade.key = a.fade.key; b.fade.vin = a.fade.vin; b.fade.parent = a.fade.parent;
  b.alt = a.alt; b.exitU = a.exitU; b.enterU = a.enterU; b.speed01 = a.speed01; b.pan = a.pan;
  b.counter = a.counter; b.flashCode = a.flashCode;
  b.morph.kind = a.morph.kind; b.morph.i = a.morph.i; b.morph.tMs = a.morph.tMs; b.morph.D = a.morph.D;
  b.vinStrata.set(a.vinStrata); b.vinGap = a.vinGap;
  b.rim = a.rim; b.pillar = a.pillar; b.shellFrom = a.shellFrom; b.shellTo = a.shellTo;
  b.iris.fromTop = a.iris.fromTop; b.iris.fromBottom = a.iris.fromBottom;
  b.iris.toTop = a.iris.toTop; b.iris.toBottom = a.iris.toBottom;
  b.vel.copy(a.vel);
  return b;
}

/** Resets the "world furniture" fields to the settled-hall defaults (fades, strata, gap, irises closed, …). */
export function settleDefaults(out, inCore) {
  out.fade.mini = 0; out.fade.key = 1; out.fade.vin = 1; out.fade.parent = 0;
  out.morph.kind = 'none';
  out.vinStrata.fill(1); out.vinGap = 0.020;
  out.rim = inCore ? 1 : 0; out.pillar = 1; out.shellFrom = 1; out.shellTo = 1;
  out.iris.fromTop = 0; out.iris.fromBottom = 0; out.iris.toTop = 0; out.iris.toBottom = 0;
  out.speed01 = 0; out.pan = 0; out.counter = 0; out.flashCode = null;
}

// ─── Easing inverse ──────────────────────────────────────────────────────────────────────────────────────────
const LUT_N = 1024;
const LUT = new Float32Array(LUT_N + 1);           // LUT[k] = EASE.camera(k / LUT_N), monotone
for (let k = 0; k <= LUT_N; k++) LUT[k] = EASE.camera(k / LUT_N);

/** x such that EASE.camera(x) = u (binary search + linear interpolation; exact at the ends). */
export function easeInv(u) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let lo = 0, hi = LUT_N;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (LUT[m] < u) lo = m; else hi = m; }
  const a = LUT[lo], b = LUT[hi];
  return (lo + (b > a ? (u - a) / (b - a) : 0)) / LUT_N;
}
/** ms at u for a path of duration D. */
export const tOfU = (u, D) => easeInv(u) * D;
/** u at ms for a path of duration D (ARCH §3.6.1). */
export const msU = (ms, D) => EASE.camera(clamp01(ms / D));
/** Progress 0..1 inside the ms window [a, b], linear in u. */
export function win(u, a, b, D) {
  const ua = msU(a, D), ub = msU(b, D);
  if (ub <= ua) return u >= ub ? 1 : 0;
  return clamp01((u - ua) / (ub - ua));
}
/** exp(mix(ln a, ln b, t)) */
export const logLerp = (a, b, t) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
export const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
/** 7-step ratchet 0..1: each step snaps in its first third, then holds (iris blades, SPEC §7.4). */
export function ratchet(x, steps = 7) {
  const v = clamp01(x) * steps;
  const k = Math.floor(v);
  if (k >= steps) return 1;
  return (k + smooth((v - k) * 3)) / steps;
}

// ─── Knot curves ─────────────────────────────────────────────────────────────────────────────────────────────
/** A centripetal Catmull-Rom through `points` (Vector3[], copied) reached at the monotone parameters `knots`
 *  (same length; usually u values). sample(x, out): piecewise-linear x → curve parameter, allocation-free. */
export function knotCurve(points, knots) {
  const pts = [];
  const ks = [];
  // Drop points that coincide with their predecessor (a zero-length CR segment has no tangent).
  for (let i = 0; i < points.length; i++) {
    if (pts.length && pts[pts.length - 1].distanceToSquared(points[i]) < 1e-12) { ks[ks.length - 1] = knots[i]; continue; }
    pts.push(points[i].clone()); ks.push(knots[i]);
  }
  if (pts.length === 1) { pts.push(pts[0].clone()); ks.push(ks[0] + 1e-6); }
  const curve = new CatmullRomCurve3(pts, false, 'centripetal');
  const n = pts.length - 1;
  return {
    curve, points: pts, knots: ks,
    sample(x, out) {
      if (x <= ks[0]) return out.copy(pts[0]);
      if (x >= ks[n]) return out.copy(pts[n]);
      let k = 0;
      while (k < n - 1 && x > ks[k + 1]) k++;
      const span = ks[k + 1] - ks[k];
      const f = span > 0 ? (x - ks[k]) / span : 1;
      return curve.getPoint((k + f) / n, out);
    },
  };
}

/** Writes render = Q0 + pivot·(s0 − s) + s·p (the scaleAbout-continuous transform from a start (s0, Q0)). */
export function toRenderAt(p, s, s0, Q0, pivot, out) {
  return out.set(
    Q0.x + pivot.x * (s0 - s) + s * p.x,
    Q0.y + pivot.y * (s0 - s) + s * p.y,
    Q0.z + pivot.z * (s0 - s) + s * p.z,
  );
}
/** The inverse: canonical p of a render point r under (s, Q). */
export function toFrame(r, s, Q, out) { return out.copy(r).sub(Q).multiplyScalar(1 / s); }

/** The canonical point invariant under (s, Q): Q / (1 − s) (origin when s = 1). */
export function fixedPointOf(s, Q, out) {
  const d = 1 - s;
  if (Math.abs(d) < 1e-9) return out.set(0, 0, 0);
  return out.copy(Q).multiplyScalar(1 / d);
}

/** A pose copied into plain vectors (builders snapshot start/end poses). */
export function snapPose(p) {
  return { pos: p.pos.clone(), target: p.target.clone(), fov: p.fov || 35, offsetY: p.offsetY || 0, roll: p.roll || 0 };
}

export { lerp, clamp01 };
