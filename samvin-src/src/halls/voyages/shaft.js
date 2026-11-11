// halls/voyages/shaft.js — WP6: «ШЛЮЗ», hatch → mission chamber (SPEC §7.6), 1,400 ms; back = the reverse, 900 ms.
//
//    0–400   the camera glides 12 m above the hatch and pitches to −90°
//  400–900   the 8-blade iris opens (ratchet, 8 steps — the hall drives the blades from irisOpen())
//  700–1200  the camera dives through the shaft: hairline rings r 4.5 m every 3 m under the hatch rush past (≈ 8 / s)
// 1000–1400  the rings flatten and wobble into the terrain's contour lines (ring i lerps onto contour level i) and the
//            camera pulls up to the chamber pose (45 m from the terrain centre, pitch −50°)
//
// Pure in t: pose(t) and rings(t) are functions of the timeline clock only, so the back trip is pose(1400·(1 − u)).
// One Lines (12 rings × 48 segments), rewritten in place per frame while the lock runs; hidden otherwise.
import { Vector3 } from 'three';
import { createLines } from '../../render/lines.js';
import { EASE, clamp01 } from '../../core/ease.js';
import { HATCH_R, SHAFT, CHAMBER_Y, CHAMBER_AIM, ORBIT, chamberPose, chamberAt } from './layout.js';

export const SHLUZ_MS = 1400;
export const BACK_MS = 900;
const SEG = 48;
const DIVE_TO = -12;                 // camera y at the end of the dive (4 rings passed)

const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

export function createShaft() {
  const R = SHAFT.rings;
  const seg = new Float32Array(R * SEG * 6);
  const alpha = new Float32Array(R * SEG);
  alpha.fill(1);
  const lines = createLines({ segments: seg, alpha, color: 'silver', width: 1, far: 260, glint: 0.9 });
  lines.mesh.name = 'voyages:shaft';
  lines.setAlpha(0);

  const A = { pos: new Vector3(), target: new Vector3() };      // start (field) pose, captured at start()
  const C = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  let hx = 0, hz = 0, terrain = null;
  const cc = { x: 0, z: 0, ux: 0, uz: -1 };
  const _p = new Vector3(), _t = new Vector3();

  function divePos(t, out, tgt) {
    // glide (0–400) → hover (400–700) → dive (700–1200)
    if (t <= 400) {
      const e = EASE.camera(t / 400);
      out.set(A.pos.x + (hx - A.pos.x) * e, A.pos.y + (SHAFT.glideY - A.pos.y) * e, A.pos.z + (hz - A.pos.z) * e);
      tgt.set(A.target.x + (hx - A.target.x) * e, A.target.y + (0 - A.target.y) * e, A.target.z + (hz - 0.05 - A.target.z) * e);
      return;
    }
    const s = clamp01((t - 700) / 500);
    const y = SHAFT.glideY + (DIVE_TO - SHAFT.glideY) * s * s * (1.6 - 0.6 * s);   // accelerating, then holding speed
    out.set(hx, y, hz);
    tgt.set(hx, y - 30, hz - 0.05);
  }

  const shaft = {
    lines,
    /** Captures the start pose and the destination; terrain = the chamber terrain (loops in terrain-local space). */
    start(fromPose, k, hatchX, hatchZ, terr) {
      A.pos.copy(fromPose.pos); A.target.copy(fromPose.target);
      hx = hatchX; hz = hatchZ; terrain = terr;
      chamberAt(k, cc);
      chamberPose(cc.x, CHAMBER_AIM, cc.z, 0, ORBIT.pitch, C, cc.ux, cc.uz);
    },
    /** Camera at timeline time t (ms, 0…1400), hall-local. Allocation-free. */
    pose(t, out) {
      divePos(Math.min(t, 1200), _p, _t);
      const k = EASE.reveal(clamp01((t - 1000) / 400));
      out.pos.set(_p.x + (C.pos.x - _p.x) * k, _p.y + (C.pos.y - _p.y) * k, _p.z + (C.pos.z - _p.z) * k);
      out.target.set(_t.x + (C.target.x - _t.x) * k, _t.y + (C.target.y - _t.y) * k, _t.z + (C.target.z - _t.z) * k);
      out.fov = C.fov; out.offsetY = 0; out.roll = 0;
      return out;
    },
    /** 0..1 iris aperture of the chosen hatch at t: 8 ratchet steps over 400–900 ms. */
    irisOpen(t) { return Math.min(8, Math.floor(clamp01((t - 400) / 500) * 8 + 1e-6)) / 8; },
    /** Ring index the camera passes at time t (−1 before the first), for the per-ring tick. */
    ringPassed(t) { divePos(Math.min(t, 1200), _p, _t); return _p.y < -SHAFT.step ? Math.min(R, Math.floor(-_p.y / SHAFT.step)) : 0; },
    /** Writes the ring geometry for time t (pure in t). levels = terrain levels (rings beyond it fade out). */
    rings(t) {
      const show = t > 380 && t < SHLUZ_MS;
      if (!show || !terrain) { lines.setAlpha(0); return; }
      const m = smooth((t - 1000) / 400);                       // flatten / morph progress
      const appear = clamp01((t - 380) / 300);
      const loops = terrain.loops, L = terrain.levels;
      for (let i = 0; i < R; i++) {
        const y0 = -SHAFT.step * (i + 1);
        const wob = (1 - m) * m * 4;                             // the wobble peaks mid-morph and settles
        const has = i < L;
        const lp = has ? loops[i] : null;
        const ly = has ? terrain.levelY[i] : 0;
        for (let q = 0; q < SEG; q++) {
          for (let e = 0; e < 2; e++) {
            const qq = (q + e) % SEG;
            const a = (qq / SEG) * Math.PI * 2;
            const r = HATCH_R * (1 + 0.12 * wob * Math.sin(a * 3 + i * 1.7 + t * 0.012));
            let x = hx + Math.sin(a) * r, y = y0, z = hz + Math.cos(a) * r;
            if (has && m > 0) {
              const tx = cc.x + lp[qq * 3], ty = CHAMBER_Y + ly, tz = cc.z + lp[qq * 3 + 2];
              x += (tx - x) * m; y += (ty - y) * m; z += (tz - z) * m;
            }
            const o = (i * SEG + q) * 6 + e * 3;
            seg[o] = x; seg[o + 1] = y; seg[o + 2] = z;
          }
          alpha[i * SEG + q] = (has ? 1 : 1 - m) * (0.45 + 0.35 * (1 - i / R));
        }
      }
      lines.setSegments(seg, R * SEG);
      lines.mesh.geometry.attributes.aAl.needsUpdate = true;
      // fades as the real contours take over (1250–1400)
      lines.setAlpha(appear * (1 - smooth((t - 1250) / 150)));
    },
    hide() { lines.setAlpha(0); },
    dispose() { lines.dispose(); },
  };
  return shaft;
}
