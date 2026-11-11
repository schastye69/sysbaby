// halls/nadir/entry.js — WP9: NADIR's first entry (SPEC §6.7, §7.5; SPEC-ADDENDUM A2.5 first entry; ARCH §6.10).
// 2,800 ms after a LIFT to INSIGNIA (when not already there):
//     0–900   --electrum fracture lines spread across the sealed plate (the camera, at the vault's centre, turns to look
//             straight down through the lower opening and the floor iris)
//   900–1,800 the plate splits along them into 5 pre-scored obsidian pieces (R3 edges) that tumble (random axis,
//             40–90°/s) and drop into the depth (breaking away at 7 m/s, then g); a `latch` (gen 2) at the split
//  1,800–2,800 the camera descends through the opening into the chamber (rest pose)
//   Phase C: `debrisKnock {n: 5}` planned on the cue clock at 5,960 ms after the scene start (the pieces land far below).
// The path is PURE in u; it publishes its scene time on `clock` so the NADIR hall draws the fracture in step with it
// (scrubbing included). The pieces keep falling on the hall's own clock after the arrival.
import { Vector3, Matrix4, Quaternion, CatmullRomCurve3, DoubleSide } from 'three';
import { createSolidBatch, createLineBatch } from '../insignia/batch.js';
import { sealPieces, sealCracks } from './seal.js';
import { createObsidian } from '../../render/obsidian.js';
import { buildLift, concatPaths } from '../../nav/paths.js';
import { settleDefaults, tOfU, createPoseOut } from '../../nav/pathKit.js';
import { EASE, clamp01, lerp } from '../../core/ease.js';
import { mulberry32 } from '../../core/rng.js';

export const FIRST_MS = 2800;
/** NADIR's own exp² density while current: the keystone 85 m away at ≈ 74 %, the apex fading into the depth. */
export const NADIR_FOG = 0.0048;
const CRACK_MS = 900, SPLIT_MS = 900, DESC_MS = 1800, FALL_END = 900 + 2900, KNOCK_MS = 5960;
const V0 = 7;                                          // the pieces break away downward (m/s), then fall under g
const G = 9.8;
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(1, 1, 1);

/** The 5 seal pieces + their cracks, drawn in the NADIR hall group (deck y = 0). */
export function createFracture() {
  const mat = createObsidian({ r1: false, side: DoubleSide });
  const pieces = sealPieces();
  let nV = 0, nE = 0;
  for (const p of pieces) { nV += p.flat.pos.length / 3; nE += p.edges.length / 6; }
  const solids = createSolidBatch({ cap: nV, material: mat, name: 'nadir:seal' });
  const edges = createLineBatch({ cap: nE, color: 'silver', far: 400, name: 'nadir:seal-edges' });
  const cracksSeg = sealCracks();
  const nC = cracksSeg.length / 6 / 5;
  const cracks = createLineBatch({ cap: cracksSeg.length / 6, color: 'electrum', far: 500, fog: false, glint: 0.2, name: 'nadir:cracks' });
  const rnd = mulberry32(0x0b5e);
  const P = pieces.map((p) => {
    const ax = new Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
    const w = ((40 + 50 * rnd()) * Math.PI) / 180;
    const out = new Vector3(p.c.x, 0, p.c.z).normalize();
    return { c: p.c, ax, w, out, drift: 0.6 + 0.8 * rnd(), s: solids.add(p.flat), e: edges.add(p.edges, { alpha: 0.8 }) };
  });
  const C = [];
  for (let k = 0; k < 5; k++) C.push(cracks.add(cracksSeg.subarray(k * nC * 6, (k + 1) * nC * 6), { alpha: 1, width: 1.6 }));
  let shownT = NaN;

  const api = {
    objects: [solids.mesh, edges.lines.mesh, cracks.lines.mesh],
    /** t = ms since the scene start (< 0 = intact & sealed); gone = NADIR already entered (nothing drawn). */
    set(t, gone) {
      if (gone || t >= FALL_END) {
        // gone for good: no draw calls left behind
        solids.mesh.visible = false; edges.lines.mesh.visible = false; cracks.lines.mesh.visible = false;
        shownT = Infinity;
        return;
      }
      if (t === shownT) return;
      shownT = t;
      solids.mesh.visible = true; edges.lines.mesh.visible = true;
      cracks.lines.mesh.visible = t >= 0 && t < SPLIT_MS + 120;
      const tc = Math.max(0, t);
      for (let k = 0; k < 5; k++) {
        cracks.setVisible(C[k], t >= 0 && t < SPLIT_MS + 120);
        cracks.setDraw(C[k], clamp01((tc - k * 90) / (CRACK_MS - 4 * 90)));
      }
      const tau = Math.max(0, tc - SPLIT_MS) / 1000;
      for (let q = 0; q < P.length; q++) {
        const p = P[q];
        solids.setVisible(p.s, true); edges.setVisible(p.e, true);
        _p.copy(p.c).addScaledVector(p.out, p.drift * tau * (1 + tau));
        _p.y -= V0 * tau + 0.5 * G * tau * tau;            // ≈ 62 m (the keystone) at 2.9 s: they are gone into the depth
        _q.setFromAxisAngle(p.ax, p.w * tau);
        _m.compose(_p, _q, _s);
        solids.setMatrix(p.s, _m); edges.setMatrix(p.e, _m);
      }
      if (t >= 0 && t < CRACK_MS) for (let k = 0; k < C.length; k++) cracks.setMatrix(C[k], _m.identity());
      solids.flush(); edges.flush(); cracks.flush();
    },
    setAlpha(a) { mat.uniforms.uAlpha.value = a; edges.lines.setAlpha(a); },
    dispose() { solids.dispose(); edges.dispose(); cracks.dispose(); mat.dispose(); },
  };
  for (const c of C) cracks.setMatrix(c, _m.identity());
  return api;
}

/** The first-entry path from `from` (a LIFT to INSIGNIA first when needed). clock.t (ms) follows the scene. */
export function buildFirstEntry(hctx, from, start, clock) {
  const lift = from === 'INSIGNIA' ? null : buildLift(start, from, 'INSIGNIA', {});
  // the scene starts where the vault's eye rests (the lift's end pose, or the current pose)
  const p0 = new Vector3(), t0 = new Vector3();
  if (lift) {
    const tmp = createPoseOut();
    lift.pose(1, tmp);
    p0.copy(tmp.cam.pos); t0.copy(tmp.cam.target);
  } else { p0.copy(start.cam.pos); t0.copy(start.cam.target); }
  const fov0 = start.cam.fov || 40;
  // NADIR rest pose (canonical)
  const nadirRest = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  const rp = hctx.halls && typeof hctx.halls.restPose === 'function' ? hctx.halls.restPose('NADIR', null, nadirRest) : null;
  if (!rp) { nadirRest.pos.set(0, -1050, 70); nadirRest.target.set(4, -1146, 0); }
  const down = new Vector3(p0.x, -1090, p0.z - 22);             // straight down at the plate (a hair off the pole)
  // the eye leans 5 m off the axis (the pillar's beads hang on it) while it looks down, then sinks
  const lean = p0.clone().add(new Vector3(5, -1, 3));
  const sink = lean.clone().add(new Vector3(0, -14, 0));
  const curve = new CatmullRomCurve3([sink, new Vector3(3, -958, 5), new Vector3(10, -1010, 30), nadirRest.pos.clone()], false, 'centripetal');
  const D = FIRST_MS;
  const fogIns = start.fog > 0 ? start.fog : 0.006, fogLook = 0.0021, fogN = NADIR_FOG;
  const _a = new Vector3(), _b = new Vector3();

  const scene = {
    kind: 'SPECIAL', from: 'INSIGNIA', to: 'NADIR', duration: D, swapAt: -1, swapKind: null,
    pose(u, out) {
      const t = tOfU(u, D);
      clock.t = t; clock.at = performance.now();
      settleDefaults(out, false);
      out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
      if (t < DESC_MS) {
        const k = EASE.camera(clamp01(t / CRACK_MS));
        const sk = EASE.camera(clamp01((t - CRACK_MS) / (DESC_MS - CRACK_MS)));
        out.cam.pos.copy(p0).lerp(lean, k);
        out.cam.pos.lerp(sink, sk * 0.999);
        _a.copy(t0).lerp(down, k);
        out.cam.target.copy(_a);
        out.cam.fov = lerp(fov0, 40, k);
        out.fog = lerp(fogIns, fogLook, k);
      } else {
        const v = EASE.camera(clamp01((t - DESC_MS) / (D - DESC_MS)));
        curve.getPoint(v, out.cam.pos);
        _b.copy(down).lerp(nadirRest.target, v);
        out.cam.target.copy(_b);
        out.cam.fov = lerp(40, nadirRest.fov, v);
        out.fog = Math.exp(lerp(Math.log(fogLook), Math.log(fogN), v));
      }
      out.cam.offsetY = 0; out.cam.roll = 0;
      out.pillar = 1 - clamp01(t / 500);               // the axis steps aside for the look down (and stays out below)
      out.alt = out.cam.pos.y;
      out.iris.fromBottom = t < DESC_MS ? 0 : clamp01((t - DESC_MS) / 240);
      out.iris.toTop = t < DESC_MS ? 0 : t < D - 300 ? 1 : 1 - (t - (D - 300)) / 300;
      out.exitU = clamp01(t / 240);
      out.enterU = clamp01((t - (D - 600)) / 600);
      out.speed01 = t < DESC_MS ? 0 : Math.sin(Math.PI * clamp01((t - DESC_MS) / (D - DESC_MS)));
      return out;
    },
    cues(u, prevU, ctx) {
      if (u <= prevU || !ctx) return;
      const t = tOfU(u, D), tp = tOfU(prevU, D);
      if (tp <= 0.5 && t > 0.5) {
        // Phase C: the knocks far below, planned on the cue clock from the scene start
        const fx = ctx.fx, V = performance.now() + KNOCK_MS - t;
        if (fx && fx.cue && fx.cue.at) fx.cue.at(V, { id: 'debrisKnock', audio: (T) => ctx.audio.play('debrisKnock', { n: 5, when: T }) });
      }
      if (tp < SPLIT_MS && t >= SPLIT_MS && ctx.audio) ctx.audio.play('latch', { gen: 2 });
      if (tp < DESC_MS && t >= DESC_MS && ctx.audio) ctx.audio.play('irisWhoosh', {});
    },
  };
  return lift ? concatPaths(lift, scene) : scene;
}
