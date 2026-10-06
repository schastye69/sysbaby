// nav/paths.js — transition paths (ARCH §3.6, SPEC §7). Every builder returns a Path whose pose(u, out) is PURE and
// allocation-free: the same u always writes the same PoseOut, so auto-travel, scrubbing, back/forward, retargets and
// reduced-motion slices all share one code path (SPEC §7.1).
//
// Frames. A DIVE's camera lives in stratum i's local frame of the Key (Key-local metres = canonical at nest level 0):
// Key-local p = c(t)·(q + o_i(t)), where c is the 3 % anticipation contraction and o_i the stratum's slide/gap offset —
// the same channels the Key's setMorph('dive') animates, so "the stratum's slide carries the camera". Render space is
// then Q(s) + s·p with Q following scaleAbout continuity from the start (s0, Q0) about a fixed pivot. At the swap the
// world is rebased (s = 1, Q = 0) and the same q continues at VIN scale (render = 1000·q): the stratum's displacement
// is dropped exactly as ARCH §3.6.3 prescribes. RECALL is authored in render space around a pivot P chosen so the
// shrunk VIN centre lands 7.2 m in front of the camera. LIFT / retargets / slices are authored in canonical space with
// s easing back to 1 about the current fixed point.
//
// Choreography windows given in ms are mapped through msU (ARCH §3.6.1); millisecond-exact channels (the Key morph,
// exit/enter phases, cue times) use tOfU, the exact inverse of the camera ease.
import { Vector3 } from 'three';
import { ROOMS, roomByStratum } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt } from '../world/structure.js';
import { EASE, clamp01, lerp } from '../core/ease.js';
import { TIMING, GAP, KEY, HALL, CAMERA, STRUT_TICKS_PER_S, MOTION } from '../core/tokens.js';
import {
  createPoseOut, copyPoseOut, settleDefaults, tOfU, msU, win, logLerp, smooth, ratchet, knotCurve, toRenderAt,
  fixedPointOf, snapPose,
} from './pathKit.js';

export { msU, createPoseOut, copyPoseOut };

// ─── Environment (WP0 addition: the director wires the live world in) ────────────────────────────────────────
const env = {
  /** (roomId, sub, out:CameraPose) → out, CANONICAL rest pose (hall-local pose + anchor) */
  restPose: null,
  /** (i, out:{F, n}) → render-space face frame of the live Key (null in T0) */
  faceFrame: null,
};
/** WP0 addition: { restPose(roomId, sub, out), faceFrame(i, out) } (set by director.init). */
export function configurePaths(o) { Object.assign(env, o || {}); }

const _poseScratch = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
/** Canonical rest pose of a room (falls back to a generic pose before the host is wired). */
function restPose(roomId, sub) {
  const out = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };
  if (env.restPose) env.restPose(roomId, sub || null, out);
  else {
    const m = ROOMS[roomId] || ROOMS.CORE;
    if (m.id === 'CORE') { out.pos.fromArray(CAMERA.core.pos); out.target.fromArray(CAMERA.core.target); }
    else { out.pos.set(0, m.alt + 10, 48); out.target.set(0, m.alt + 12.5, 0); }
  }
  return out;
}
void _poseScratch;

// ─── Kinds & durations ───────────────────────────────────────────────────────────────────────────────────────
/** A5: hidden rooms take their parent's place for the kind (WORKSHOP ≡ MEMBERS, ZENITH ≡ SIGNAL). */
const kindRoom = (r) => (r === 'WORKSHOP' ? 'MEMBERS' : r === 'ZENITH' ? 'SIGNAL' : r);

/** → 'DIVE'|'RECALL'|'LIFT' (never 'SPECIAL'; same-room returns are LIFTs of B = 0). */
export function transitionKind(fromRoom, toRoom) {
  const a = kindRoom(fromRoom), b = kindRoom(toRoom);
  if (a === 'CORE' && b !== 'CORE') return 'DIVE';
  if (b === 'CORE' && a !== 'CORE') return 'RECALL';
  return 'LIFT';
}

/** Boundaries crossed: |stratum(from) − stratum(to)| with ZENITH = −1 and WORKSHOP = 2 (A5). */
export function liftBoundaries(fromRoom, toRoom) {
  const a = ROOMS[fromRoom] || ROOMS.CORE, b = ROOMS[toRoom] || ROOMS.CORE;
  return Math.abs(a.stratum - b.stratum);
}

/** min(1800, 900 + 280·(B − 1)) ms; B = 0 (WORKSHOP ↔ MEMBERS) → 900. */
export function liftDuration(fromRoom, toRoom) {
  const B = liftBoundaries(fromRoom, toRoom);
  if (B <= 1) return TIMING.liftBase;
  return Math.min(TIMING.liftMax, TIMING.liftBase + TIMING.liftPerBoundary * (B - 1));
}

/** Normal duration of a kind between two rooms (DIVE = the later-DIVE 1,600 ms). */
export function normalDuration(kind, fromRoom, toRoom) {
  if (kind === 'DIVE') return TIMING.dive;
  if (kind === 'RECALL') return TIMING.recall;
  if (kind === 'SLICE') return TIMING.slice;
  return liftDuration(fromRoom, toRoom);
}

/** SPEC §2.5 anticipation: a 3 % counter-move over the first 120 ms of a move whose displacement is ≥ 10 % of the view
 *  distance. u = the move's progress as its driver measures it (linear time fraction), D its duration (ms),
 *  dist the current view distance (default |to − from|). Writes the ADDITIVE camera offset into `out`. */
export function anticipation(u, from, to, out, D = 900, dist = -1) {
  out.set(0, 0, 0);
  const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const view = dist > 0 ? dist : len;
  if (len < 1e-9 || len < MOTION.anticipationMinDisp * view) return out;
  const t = clamp01(u) * D, A = MOTION.anticipationMs;
  const b = t < A ? EASE.reveal(t / A) : t < 3 * A ? 1 - smooth((t - A) / (2 * A)) : 0;   // out over 120 ms, back over 240
  const k = -(MOTION.anticipationFrac * view * b) / len;
  return out.set(dx * k, dy * k, dz * k);
}

// ─── Shared pose pieces ──────────────────────────────────────────────────────────────────────────────────────
function phases(out, t, D, enterFrom) {
  out.exitU = clamp01(t / TIMING.depart);
  out.enterU = enterFrom >= 0
    ? (t < enterFrom ? 0 : clamp01((t - enterFrom) / Math.max(1, D - enterFrom)))
    : clamp01((t - (D - TIMING.arrive)) / TIMING.arrive);
}
const bell = (x) => Math.sin(Math.PI * clamp01(x));

/** The DIVE stratum-frame channels at base time tb (identical to the Key seed's setMorph('dive')). */
function diveFrame(tb, st, n, oOut) {
  const c01 = clamp01(tb / 120);
  const e = EASE.camera(clamp01((tb - 120) / 360));
  const c = tb < 120 ? 1 - KEY.contract * EASE.camera(c01) : 1 - KEY.contract * (1 - smoothstepf(120, 480, tb));
  const gap = lerp(GAP.rest, GAP.dive, e);
  oOut.copy(n).multiplyScalar(KEY.diveSlide * e);
  oOut.y += (3 - st) * (gap - GAP.rest);
  return c;
}
function smoothstepf(a, b, x) { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }

/** Nominal (aligned, rest) face-0 frame of stratum i in Key-local metres. */
export function nominalFace(i, out) {
  const st = STRATA_GEOM[i];
  const y1 = st.top + (st.bot - st.top) / 3, y2 = st.top + (st.bot - st.top) * 2 / 3;
  const r = (radiusAt(y1) + radiusAt(y2)) / 2;
  out.F.set(0, st.mid, r * Math.cos(Math.PI / st.n));
  out.n.set(0, 0, 1);
  return out;
}

// ─── DIVE ────────────────────────────────────────────────────────────────────────────────────────────────────
/** CORE → stratum i's hall (SPEC §7.2). opts: { first, fromUnfold, sub, to (RoomId; default the stratum's room — A5
 *  hidden rooms pass ZENITH / WORKSHOP), D (retarget duration), tb0 (base ms the morph starts at; retargets) }. */
export function buildDive(start, stratum, opts = {}) {
  const i = Math.max(0, Math.min(6, stratum | 0));
  const to = opts.to || roomByStratum(i).id;
  const first = !!opts.first && !opts.D;
  const tb0 = Math.max(0, Math.min(1100, opts.tb0 || 0));
  const D = opts.D || (first ? TIMING.diveFirst : TIMING.dive - tb0);
  const K = TIMING.diveFirstScale, HOLD = TIMING.diveFirstHold, H0 = 1000 * K;
  /** real ms → base ms (first DIVE: ×1.375 plus a 200 ms hold inside the lattice) */
  const baseOf = first
    ? (t) => (t < H0 ? t / K : t < H0 + HOLD ? 1000 : (t - HOLD) / K)
    : (t) => tb0 + (t * (TIMING.dive - tb0)) / D;
  /** base ms → real ms */
  const realOf = first
    ? (b) => (b < 1000 ? b * K : b * K + HOLD)
    : (b) => ((b - tb0) * D) / (TIMING.dive - tb0);
  const tSwap = realOf(TIMING.diveSwapAt);
  const swapAt = msU(tSwap, D);

  const s0 = start.s, Q0 = start.Q.clone();
  // Face frame: the live Key at departure (fresh dives), the nominal aligned face for retargets.
  const fr = { F: new Vector3(), n: new Vector3() };
  if (env.faceFrame && Math.abs(s0 - 1) < 1e-6 && Q0.lengthSq() < 1e-12 && !opts.D) {
    env.faceFrame(i, fr);
  } else nominalFace(i, fr);
  const F = fr.F, n = fr.n.normalize();
  const apothem = Math.hypot(F.x, F.z);
  const depthIn = Math.min(0.3, 0.5 * apothem);
  const o = new Vector3();
  const cStart = diveFrame(tb0, i, n, o);
  const pivot = n.clone().multiplyScalar(KEY.diveSlide).add(F);
  pivot.y += (3 - i) * (GAP.dive - GAP.rest);

  const H = restPose(to, opts.sub);
  const toFog = (ROOMS[to] || ROOMS.CORE).fog;
  // Camera + target in stratum-local Key metres.
  const q0 = start.cam.pos.clone().sub(Q0).multiplyScalar(1 / (s0 * cStart)).sub(o);
  const qt0 = start.cam.target.clone().sub(Q0).multiplyScalar(1 / (s0 * cStart)).sub(o);
  const camPts = [q0], camK = [0], tgtPts = [qt0], tgtK = [0];
  const far = q0.distanceTo(F) > 2.2 && tb0 < 480;
  if (far) { camPts.push(F.clone().addScaledVector(n, 2.0)); camK.push(msU(realOf(480), D)); }
  if (tb0 < 700) { camPts.push(F.clone().addScaledVector(n, 0.4)); camK.push(msU(realOf(700), D)); }
  camPts.push(F.clone().addScaledVector(n, -depthIn)); camK.push(swapAt);
  camPts.push(H.pos.clone().multiplyScalar(1 / 1000)); camK.push(1);
  if (tb0 < 480) { tgtPts.push(F.clone()); tgtK.push(msU(realOf(480), D)); }
  tgtPts.push(F.clone().addScaledVector(n, -depthIn - 0.6)); tgtK.push(swapAt);
  tgtPts.push(H.target.clone().multiplyScalar(1 / 1000)); tgtK.push(1);
  const camC = knotCurve(camPts, camK), tgtC = knotCurve(tgtPts, tgtK);

  const sw0 = Math.max(0, realOf(Math.max(480, tb0)));
  const fov0 = start.cam.fov, off0 = start.cam.offsetY, roll0 = start.cam.roll;
  const fog0 = start.fog, alt0 = start.alt, rim0 = start.rim, pil0 = start.pillar, vin0 = start.fade.vin;
  const view0 = start.cam.pos.distanceTo(start.cam.target);
  const antTo = camPts[1].clone();
  // Cue schedule (u values): sub-drop at 480 base ms; strut ticks while crossing the face (≤ 30 / s).
  const uSubDrop = tb0 < 480 ? msU(realOf(480), D) : -1;
  const ticks = [];
  for (let b = Math.max(tb0, 860); b <= 1120; b += 1000 / STRUT_TICKS_PER_S) ticks.push(msU(realOf(b), D));
  const _q = new Vector3(), _p = new Vector3(), _a = new Vector3(), _st = new Vector3();

  return {
    kind: 'DIVE', from: 'CORE', to, duration: D, swapAt, swapKind: 'grow', stratum: i, first,
    pose(u, out) {
      const t = tOfU(u, D);
      const tb = baseOf(t);
      settleDefaults(out, false);
      if (u < swapAt) {
        const c = diveFrame(tb, i, n, _st);
        const s = logLerp(s0, 1000, win(u, sw0, tSwap, D));
        out.s = s; out.pivot.copy(pivot);
        out.Q.copy(Q0).addScaledVector(pivot, s0 - s);
        camC.sample(u, _q).add(_st).multiplyScalar(c);
        toRenderAt(_q, s, s0, Q0, pivot, out.cam.pos);
        if (tb0 === 0 && t < 3 * MOTION.anticipationMs) {
          anticipation(t / D, _p.copy(q0), antTo, _a, D, view0);
          out.cam.pos.addScaledVector(_a, s);
        }
        tgtC.sample(u, _q).add(_st).multiplyScalar(c);
        toRenderAt(_q, s, s0, Q0, pivot, out.cam.target);
        const fogT = Math.log(s / s0) / Math.log(1000 / s0);
        out.fog = logLerp(fog0, toFog, clamp01(fogT));
        const fadeOut = 1 - win(u, sw0, tSwap, D);
        out.fade.vin = vin0 * fadeOut;
        out.rim = rim0 * fadeOut; out.pillar = pil0 * fadeOut;
        out.shellFrom = fadeOut; out.shellTo = 0;
        out.morph.kind = 'dive'; out.morph.i = i; out.morph.tMs = first ? tb * K : tb; out.morph.D = first ? TIMING.diveFirst : TIMING.dive;
      } else {
        out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
        camC.sample(u, out.cam.pos).multiplyScalar(1000);
        tgtC.sample(u, out.cam.target).multiplyScalar(1000);
        out.fog = toFog;
        const a = win(u, tSwap, D, D);
        for (let j = 0; j < 7; j++) out.vinStrata[j] = j === i ? 1 : a;
        out.rim = 0; out.pillar = a; out.shellFrom = 0; out.shellTo = a;
      }
      const wv = win(u, tSwap, D, D);
      out.cam.fov = lerp(fov0, H.fov, wv); out.cam.offsetY = lerp(off0, H.offsetY, wv); out.cam.roll = lerp(roll0, H.roll, wv);
      out.alt = lerp(alt0, (ROOMS[to] || ROOMS.CORE).alt, u);
      phases(out, t, D, tSwap);
      out.speed01 = bell(win(u, sw0 * 0.5, tSwap, D));
      return out;
    },
    cues(u, prevU, ctx) {
      if (u <= prevU || !ctx || !ctx.audio) return;
      if (uSubDrop >= 0 && prevU < uSubDrop && u >= uSubDrop) ctx.audio.play('subDrop', {});
      for (let k = 0; k < ticks.length; k++) if (prevU < ticks[k] && u >= ticks[k]) { ctx.audio.play('strutTick', {}); break; }
    },
  };
}

// ─── RECALL ──────────────────────────────────────────────────────────────────────────────────────────────────
/** Any hall → CORE (SPEC §7.3): the world shrinks ×1 → ×0.001 about P while the camera holds; VIN becomes the Key
 *  7.2 m in front of it; swap at 1,000 ms; the Key closes its gaps with 7 ratchets. opts: { D } (retargets). */
export function buildRecall(start, fromRoom, opts = {}) {
  const D = opts.D || TIMING.recall;
  const k = D / TIMING.recall;
  const tSwap = TIMING.recallSwapAt * k, tS0 = TIMING.depart * k;
  const swapAt = msU(tSwap, D);
  const core = restPose('CORE', null);
  const s0 = start.s, Q0 = start.Q.clone();
  const C0 = start.cam.pos.clone(), T0 = start.cam.target.clone();
  const SMIN = 1 / 1000;
  // Q(s) = Q0 + P(s0 − s) and Q(0.001) + core.pos = C0  →  P = (C0 − core.pos − Q0) / (s0 − 0.001)
  const P = C0.clone().sub(core.pos).sub(Q0).multiplyScalar(1 / (s0 - SMIN));
  const coreT = core.target.clone();
  const fov0 = start.cam.fov, off0 = start.cam.offsetY, roll0 = start.cam.roll;
  const fog0 = start.fog, alt0 = start.alt, rim0 = start.rim, pil0 = start.pillar;
  const coreFog = ROOMS.CORE.fog;
  const _c = new Vector3();
  return {
    kind: 'RECALL', from: fromRoom, to: 'CORE', duration: D, swapAt, swapKind: 'shrink',
    pose(u, out) {
      const t = tOfU(u, D);
      settleDefaults(out, false);
      if (u < swapAt) {
        const w = win(u, tS0, tSwap, D);
        const s = logLerp(s0, SMIN, w);
        out.s = s; out.pivot.copy(P);
        out.Q.copy(Q0).addScaledVector(P, s0 - s);
        out.cam.pos.copy(C0);
        _c.copy(coreT).multiplyScalar(s).add(out.Q);                    // the shrinking VIN centre (render)
        out.cam.target.copy(T0).lerp(_c, smooth(win(u, tS0, tSwap * 0.92, D)));
        out.cam.fov = lerp(fov0, core.fov, w); out.cam.offsetY = lerp(off0, core.offsetY, w); out.cam.roll = lerp(roll0, 0, w);
        out.fog = logLerp(fog0, coreFog, clamp01(Math.log(s / s0) / Math.log(SMIN / s0)));
        out.fade.parent = win(u, tSwap * 0.55, tSwap, D);
        out.vinGap = lerp(GAP.rest, GAP.recallStart, w);
        out.rim = rim0 * (1 - win(u, 0, tS0, D)); out.pillar = pil0;
        out.shellFrom = 1; out.shellTo = 0;
      } else {
        out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
        out.cam.pos.copy(core.pos); out.cam.target.copy(core.target);
        out.cam.fov = core.fov; out.cam.offsetY = core.offsetY; out.cam.roll = 0;
        out.fog = coreFog;
        const a = win(u, tSwap, D, D);
        out.rim = a; out.pillar = a; out.shellFrom = 0; out.shellTo = a;
        out.morph.kind = 'recall'; out.morph.i = 3; out.morph.tMs = t / k; out.morph.D = TIMING.recall;
      }
      out.alt = lerp(alt0, 0, u);
      phases(out, t, D, -1);
      out.speed01 = bell(win(u, tS0, tSwap, D));
      return out;
    },
    cues(u, prevU, ctx) {
      if (u <= prevU || !ctx || !ctx.audio) return;
      if (prevU < swapAt && u >= swapAt) ctx.audio.play('recallThud', {});
    },
  };
}

// ─── LIFT ────────────────────────────────────────────────────────────────────────────────────────────────────
/** Iris altitudes use the parent's band for WORKSHOP (it sits inside MEMBERS); ZENITH keeps its own (above S). */
const irisRoom = (r) => (r === 'WORKSHOP' ? 'MEMBERS' : r);
const ROOM_SEQ = ['ZENITH', 'SIGNAL', 'ARCHIVE', 'MEMBERS', 'CORE', 'VOYAGES', 'INSIGNIA', 'NADIR'];

/** X → Y, neither CORE (SPEC §7.4): source rest pose → source iris (12 m off the axis) → along the axis at (x +12,
 *  z +6) beside the pillar → destination iris → destination rest pose. Also used for retargets (start may carry
 *  s ≠ 1: s eases back to 1 about the current fixed point) and same-room returns (B = 0, no irises).
 *  opts: { sub, D, vel (render m/s start tangent), shellFrom0 } */
export function buildLift(start, fromRoom, toRoom, opts = {}) {
  const D = opts.D || liftDuration(fromRoom, toRoom);
  const s0 = start.s, Q0 = start.Q.clone();
  const X = fixedPointOf(s0, Q0, new Vector3());
  const c0 = start.cam.pos.clone().sub(Q0).multiplyScalar(1 / s0);
  const ct0 = start.cam.target.clone().sub(Q0).multiplyScalar(1 / s0);
  const H = restPose(toRoom, opts.sub);
  const B = liftBoundaries(fromRoom, toRoom);
  const up = H.pos.y > c0.y;
  const dir = up ? 1 : -1;
  const [ox, , oz] = HALL.liftOffset;

  const pts = [c0];
  if (opts.vel && opts.vel.length() / s0 > 1) pts.push(c0.clone().addScaledVector(opts.vel, 0.12 / s0));
  let iA = -1, iB = -1;
  if (B >= 1) {
    const fI = ROOMS[irisRoom(fromRoom)], tI = ROOMS[irisRoom(toRoom)];
    const yIF = up ? fI.ceil : fI.floor, yIT = up ? tI.floor : tI.ceil;
    const onShaft = Math.abs(c0.x - ox) < 4 && Math.abs(c0.z - oz) < 4;
    if (!onShaft && (yIF - c0.y) * dir > -5) { pts.push(new Vector3(ox, yIF, oz)); iA = pts.length - 1; }
    if (iA < 0 || Math.abs(yIT - yIF) > 2) { pts.push(new Vector3(ox, yIT, oz)); iB = pts.length - 1; } else iB = iA;
    if (iA < 0) iA = iB;
  }
  pts.push(H.pos.clone());
  // Knots by cumulative chord length (u is eased in time, so the ride starts and ends slow).
  const ks = [0];
  let total = 0;
  for (let k = 1; k < pts.length; k++) { total += pts[k].distanceTo(pts[k - 1]); ks.push(total); }
  for (let k = 0; k < ks.length; k++) ks[k] = total > 0 ? ks[k] / total : k / (ks.length - 1);
  const camC = knotCurve(pts, ks);
  const uA = iA >= 0 ? ks[iA] : 0.3, uB = iB >= 0 ? ks[iB] : 0.7;

  // Start snapshot for blends (pure: everything captured here).
  const fov0 = start.cam.fov, off0 = start.cam.offsetY, roll0 = start.cam.roll, fog0 = start.fog;
  const f0 = { ...start.fade }, strata0 = Float32Array.from(start.vinStrata), gap0 = start.vinGap, rim0 = start.rim;
  const shellFrom0 = opts.shellFrom0 != null ? opts.shellFrom0 : 1;
  const morph0 = start.morph.kind === 'dive' ? { i: start.morph.i, tMs: start.morph.tMs, D: start.morph.D } : null;
  const toFog = (ROOMS[toRoom] || ROOMS.CORE).fog;
  const view0 = start.cam.pos.distanceTo(start.cam.target);
  const antTo = pts[1].clone();

  // Intermediate rooms (codename flashes) and boundary ticks, located on the curve once.
  const lo = Math.min(ROOM_SEQ.indexOf(fromRoom === 'WORKSHOP' ? 'MEMBERS' : fromRoom), ROOM_SEQ.indexOf(toRoom === 'WORKSHOP' ? 'MEMBERS' : toRoom));
  const hi = Math.max(ROOM_SEQ.indexOf(fromRoom === 'WORKSHOP' ? 'MEMBERS' : fromRoom), ROOM_SEQ.indexOf(toRoom === 'WORKSHOP' ? 'MEMBERS' : toRoom));
  const flashes = [];            // { room, t0 }
  const tickU = [];
  const _s = new Vector3(), _s2 = new Vector3();
  const crossU = (y) => {
    camC.sample(0, _s);
    for (let k = 1; k <= 240; k++) {
      const u = k / 240;
      camC.sample(u, _s2);
      if ((_s.y - y) * (_s2.y - y) <= 0 && _s.y !== _s2.y) return u - (1 / 240) * ((_s2.y - y) / (_s2.y - _s.y));
      _s.copy(_s2);
    }
    return -1;
  };
  for (let q = lo + 1; q < hi; q++) {
    const r = ROOMS[ROOM_SEQ[q]];
    const u = crossU(r.alt);
    if (u >= 0) flashes.push({ room: r.id, t0: tOfU(u, D) });
  }
  for (let q = lo; q < hi; q++) {
    const a = ROOMS[ROOM_SEQ[q]], b = ROOMS[ROOM_SEQ[q + 1]];
    const u = crossU((a.floor + b.ceil) / 2);
    if (u >= 0) tickU.push(u);
  }
  const whooshU = B >= 1 ? [uA, uB] : [];
  const _p = new Vector3(), _a = new Vector3(), _t = new Vector3();

  return {
    kind: 'LIFT', from: fromRoom, to: toRoom, duration: D, swapAt: -1, swapKind: null, boundaries: B,
    pose(u, out) {
      const t = tOfU(u, D);
      settleDefaults(out, false);
      const s = logLerp(s0, 1, win(u, 0, D * 0.5, D));
      out.s = s; out.pivot.copy(X);
      out.Q.copy(Q0).addScaledVector(X, s0 - s);
      camC.sample(u, _p);
      const yNow = _p.y;
      if (t < 3 * MOTION.anticipationMs) { anticipation(t / D, c0, antTo, _a, D, view0); _p.add(_a); }
      toRenderAt(_p, s, s0, Q0, X, out.cam.pos);
      // Target: hall target → ahead along the axis (beside the pillar) → destination target.
      if (B >= 1) {
        _t.set(0, yNow + dir * 30, 0);
        _p.copy(ct0).lerp(_t, smooth(uA > 0 ? u / uA : 1));
        _p.lerp(H.target, smooth(uB < 1 ? (u - uB) / (1 - uB) : 0));
      } else _p.copy(ct0).lerp(H.target, smooth(u));
      toRenderAt(_p, s, s0, Q0, X, out.cam.target);
      const w = smooth(u);
      out.cam.fov = lerp(fov0, H.fov, w); out.cam.offsetY = lerp(off0, H.offsetY, w); out.cam.roll = lerp(roll0, H.roll, w);
      out.fog = logLerp(fog0, toFog, w);
      const b0 = win(u, 0, TIMING.depart, D);
      out.fade.mini = lerp(f0.mini, 0, b0); out.fade.key = lerp(f0.key, 1, b0);
      out.fade.vin = lerp(f0.vin, 1, b0); out.fade.parent = lerp(f0.parent, 0, b0);
      for (let j = 0; j < 7; j++) out.vinStrata[j] = lerp(strata0[j], 1, b0);
      out.vinGap = lerp(gap0, GAP.rest, b0);
      out.rim = rim0 * (1 - b0);
      out.shellFrom = lerp(shellFrom0, 1, b0); out.shellTo = 1;
      if (morph0) { out.morph.kind = 'dive'; out.morph.i = morph0.i; out.morph.D = morph0.D; out.morph.tMs = morph0.tMs * (1 - win(u, 0, D * 0.6, D)); }
      if (B >= 1) {
        const open = ratchet(t / TIMING.depart);
        const close = t < D - 300 ? 1 : 1 - ratchet((t - (D - 300)) / 300);
        if (up) { out.iris.fromTop = open; out.iris.toBottom = close; } else { out.iris.fromBottom = open; out.iris.toTop = close; }
        out.counter = t > 120 && t < D - 240 ? 0.12 : 0;
      }
      out.alt = (out.cam.pos.y - out.Q.y) / s;
      out.flashCode = null;
      for (let k = 0; k < flashes.length; k++) if (t >= flashes[k].t0 && t < flashes[k].t0 + 180) out.flashCode = flashes[k].room;
      phases(out, t, D, -1);
      out.speed01 = bell(u);
      out.pan = 0;
      return out;
    },
    cues(u, prevU, ctx) {
      if (u <= prevU || !ctx || !ctx.audio) return;
      for (let k = 0; k < whooshU.length; k++) if (prevU < whooshU[k] && u >= whooshU[k]) ctx.audio.play('irisWhoosh', {});
      for (let k = 0; k < tickU.length; k++) if (prevU < tickU[k] && u >= tickU[k]) ctx.audio.play('tick', {});
    },
  };
}

// ─── SLICE (reduced motion, T0) ──────────────────────────────────────────────────────────────────────────────
/** 280 ms; the scene swaps to pose(1) at 140 ms (SPEC §7.8). The hairline itself is DOM (director). */
export function buildSlice(start, toRoute) {
  const D = TIMING.slice, tS = TIMING.sliceSwap;
  const to = toRoute.room;
  const snap = copyPoseOut(start, createPoseOut());
  const H = restPose(to, toRoute.sub);
  const X = fixedPointOf(start.s, start.Q, new Vector3());
  const toFog = (ROOMS[to] || ROOMS.CORE).fog;
  const swapU = msU(tS, D);
  return {
    kind: 'SLICE', from: null, to, duration: D, swapAt: -1, swapKind: null, cutAt: swapU,
    pose(u, out) {
      const t = tOfU(u, D);
      if (t < tS) { copyPoseOut(snap, out); out.exitU = 0; out.enterU = 0; out.counter = 0; out.flashCode = null; return out; }
      settleDefaults(out, to === 'CORE');
      out.s = 1; out.pivot.copy(X); out.Q.set(0, 0, 0);
      out.cam.pos.copy(H.pos); out.cam.target.copy(H.target);
      out.cam.fov = H.fov; out.cam.offsetY = H.offsetY; out.cam.roll = H.roll;
      out.fog = toFog;
      out.alt = (ROOMS[to] || ROOMS.CORE).alt;
      out.shellFrom = 0; out.shellTo = 1;
      out.exitU = 1; out.enterU = 1;
      return out;
    },
    cues(u, prevU, ctx) {
      if (prevU < swapU && u >= swapU && ctx && ctx.t0 && ctx.app && ctx.app.tier === 'T0') ctx.t0.show(toRoute);
    },
  };
}

// ─── Hall-authored paths ─────────────────────────────────────────────────────────────────────────────────────
/** A camera move inside one hall (focus dollies, ШЛЮЗ, relic …). pose(u) applies `ease` to u, so the caller passes
 *  LINEAR progress (t / ms). Render space; s = 1; fog < 0 means "leave the fog alone". kind 'SPECIAL', from = to = null. */
export function buildFocusPath(fromPose, toPose, ms, ease = EASE.camera) {
  const A = snapPose(fromPose), Bp = snapPose(toPose);
  const D = Math.max(1, ms);
  const view0 = A.pos.distanceTo(A.target);
  const _a = new Vector3();
  return {
    kind: 'SPECIAL', from: null, to: null, duration: D, swapAt: -1, swapKind: null,
    pose(u, out) {
      const w = ease(clamp01(u));
      settleDefaults(out, false);
      out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0); out.fog = -1;
      out.cam.pos.copy(A.pos).lerp(Bp.pos, w);
      anticipation(u, A.pos, Bp.pos, _a, D, view0);
      out.cam.pos.add(_a);
      out.cam.target.copy(A.target).lerp(Bp.target, w);
      out.cam.fov = lerp(A.fov, Bp.fov, w); out.cam.offsetY = lerp(A.offsetY, Bp.offsetY, w); out.cam.roll = lerp(A.roll, Bp.roll, w);
      out.alt = out.cam.pos.y; out.exitU = 0; out.enterU = 1;
      return out;
    },
  };
}

/** A SPECIAL path through render-space points (s = 1): { from, to, duration, points, targets, fov:[a,b], fog:[a,b], cues? }.
 *  Knots by chord length; u is used as given (the director passes eased u). */
export function curvePath(spec) {
  const D = Math.max(1, spec.duration || 1000);
  const P = spec.points, T = spec.targets && spec.targets.length ? spec.targets : [new Vector3()];
  const knots = (arr) => {
    const k = [0]; let tot = 0;
    for (let i = 1; i < arr.length; i++) { tot += arr[i].distanceTo(arr[i - 1]); k.push(tot); }
    return k.map((v, i) => (tot > 0 ? v / tot : i / Math.max(1, arr.length - 1)));
  };
  const camC = knotCurve(P, knots(P));
  const tgtC = T.length > 1 ? knotCurve(T, knots(T)) : null;
  const T0 = T[0].clone();
  const fov = spec.fov || [35, 35], fg = spec.fog || [ROOMS.CORE.fog, ROOMS.CORE.fog];
  const to = spec.to || null;
  return {
    kind: 'SPECIAL', from: spec.from || null, to, duration: D, swapAt: -1, swapKind: null,
    pose(u, out) {
      const t = tOfU(u, D);
      settleDefaults(out, to === 'CORE');
      out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
      camC.sample(u, out.cam.pos);
      if (tgtC) tgtC.sample(u, out.cam.target); else out.cam.target.copy(T0);
      out.cam.fov = lerp(fov[0], fov[1], u); out.cam.offsetY = 0; out.cam.roll = 0;
      out.fog = logLerp(fg[0], fg[1], u);
      out.alt = out.cam.pos.y;
      phases(out, t, D, -1);
      out.speed01 = bell(u);
      return out;
    },
    cues: spec.cues || null,
  };
}

/** Paths in sequence: durations add, u is split by duration share. One swap at most (kept with its global u). */
export function concatPaths(...paths) {
  const list = paths.filter(Boolean);
  const D = list.reduce((a, p) => a + p.duration, 0) || 1;
  const a = [], b = [];
  let acc = 0;
  for (const p of list) { a.push(acc / D); acc += p.duration; b.push(acc / D); }
  let swapAt = -1, swapKind = null;
  list.forEach((p, k) => { if (p.swapAt >= 0 && swapAt < 0) { swapAt = a[k] + (b[k] - a[k]) * p.swapAt; swapKind = p.swapKind; } });
  return {
    kind: 'SPECIAL', from: list[0].from, to: list[list.length - 1].to, duration: D, swapAt, swapKind, parts: list,
    pose(u, out) {
      let k = 0;
      while (k < list.length - 1 && u > b[k]) k++;
      const span = b[k] - a[k];
      list[k].pose(span > 0 ? clamp01((u - a[k]) / span) : 1, out);
      const t = tOfU(u, D);
      out.exitU = clamp01(t / TIMING.depart);
      out.enterU = clamp01((t - (D - TIMING.arrive)) / TIMING.arrive);
      return out;
    },
    cues(u, prevU, ctx) {
      for (let k = 0; k < list.length; k++) {
        if (!list[k].cues || u <= a[k] || prevU >= b[k]) continue;
        const span = b[k] - a[k] || 1;
        list[k].cues(clamp01((u - a[k]) / span), clamp01((prevU - a[k]) / span), ctx);
      }
    },
  };
}

// ─── Retarget ────────────────────────────────────────────────────────────────────────────────────────────────
/** A new destination mid-flight (SPEC §7.7): the kind follows from the LOGICAL room, the duration is
 *  max(600, 0.8 × normal), the start is the current PoseOut (incl. s and the root transform; swap kinds continue to
 *  their swap value, others return s → 1 about the fixed point), the start tangent is the camera velocity. */
export function buildRetarget(start, logicalRoom, toRoute, opts = {}) {
  const to = toRoute.room;
  const kind = transitionKind(logicalRoom, to);
  const D = Math.max(TIMING.retargetMin, TIMING.retargetFactor * normalDuration(kind, logicalRoom, to));
  let path;
  if (kind === 'DIVE') {
    const st = ROOMS[kindRoom(to)].stratum;
    path = buildDive(start, st, { to, sub: toRoute.sub, D, tb0: start.s > 1.0001 ? 480 : 0 });
  } else if (kind === 'RECALL') {
    path = buildRecall(start, logicalRoom, { D });
  } else {
    path = buildLift(start, logicalRoom, to, { sub: toRoute.sub, D, vel: start.vel, shellFrom0: opts.shellFrom0 });
  }
  path.retarget = true;
  path.from = logicalRoom;
  return path;
}
