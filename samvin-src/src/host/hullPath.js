// host/hullPath.js — ПОКАЗ scene 5 «СНАРУЖИ», the hull descent (SPEC-ADDENDUM A4.2; ARCH-ADDENDUM X§2.6.6, X§0.2).
// OWNER: WP13. A SPECIAL path (paths.registerSpecial('hull', buildHull)); director.play() runs it from CORE back to CORE
// with no route change. pose(u) is PURE and allocation-free over the resident nest levels (no hall residency):
//   0–2,500        from the CORE rest pose the camera rises and pulls out through the rim lattice (strut ticks ≤ 30/s)
//                  to (0, +1,100, 1,700) looking at (0, +200, 0); VIN resolves solid from outside, fog thins to PULL far
//   2,500–10,000   a helical descent around VIN's axis at radius 820 m, altitude +1,100 → −300, sweeping 220°
//                  (front → side → back): the lit nodes of the • stratum slide past like windows; on the back the earned
//                  laws stand on the hull as tall as towers (no law: 140°, ending at 7,500 — the shot is 2,500 ms shorter)
//   …–end          the camera swings back to the front while closing in, passes between the • stratum's struts into the
//                  CORE hall and settles at the CORE rest pose (camera ease); the rim and the names return
// Total 14,000 ms (11,500 with no law); T1: 9,000 (helix 140°, no back pass). Reduced motion: three cuts with 280 ms
// slices — outside front (2,000), outside back (2,000, only with laws), CORE.
import { Vector3 } from 'three';
import { settleDefaults, tOfU, logLerp } from '../nav/pathKit.js';
import { EASE, clamp01, lerp } from '../core/ease.js';
import { TIMING } from '../core/tokens.js';
import { ROOMS } from '../world/rooms.js';

const DEG = Math.PI / 180;
const FOG_OUT = 0.00032;                        // render-unit density outside the hull (PULL far)
const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const sine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));

/** start: PoseOut (the director's live pose); opts { laws: boolean, tier: 'T1'|'T2'|'T3', reduced: boolean } → Path */
export function buildHull(start, opts = {}) {
  const T1 = opts.tier === 'T1';
  const laws = !!opts.laws && !T1;
  const rm = !!opts.reduced;
  const D = rm ? (laws ? 4000 : 2000) + 900 : T1 ? 9000 : laws ? 14000 : 11500;
  const tOut = 2500, tHelix = T1 ? 6000 : laws ? 10000 : 7500;
  const sweep = (laws ? 220 : 140) * DEG;
  const fogCore = (ROOMS.CORE && ROOMS.CORE.fog) || 0.00485;
  const rest = { pos: new Vector3().copy(start.cam.pos), target: new Vector3().copy(start.cam.target), fov: start.cam.fov || 35, offsetY: start.cam.offsetY || 0 };
  // seg 1 Bézier: rest → up and out through the rim lattice → (0, 1,100, 1,700)
  const A = new Vector3(0, 1100, 1700);
  const c1 = new Vector3(rest.pos.x, rest.pos.y + 30, rest.pos.z + 140);
  const c2 = new Vector3(0, 560, 1250);
  const tgtOut = new Vector3(0, 200, 0);
  const R = 820, yTop = 1100, yBot = -300;
  const thetaEnd = sweep, thetaHome = sweep > Math.PI ? Math.PI * 2 : 0;
  const _q = new Vector3();
  const helixAt = (e, out) => {
    // the altitude leads the sweep (e^1.6): the back faces pass at the height of the strata that carry the laws
    const th = thetaEnd * e, y = lerp(yTop, yBot, Math.pow(e, 1.6));
    const r = lerp(1700, R, smooth(e / 0.22));
    return out.set(Math.sin(th) * r, y, Math.cos(th) * r);
  };
  // cut poses (reduced motion)
  const cutFront = { pos: new Vector3(0, 380, 1650), target: new Vector3(0, 120, 0) };
  const cutBack = { pos: new Vector3(Math.sin(200 * DEG) * R, 60, Math.cos(200 * DEG) * R), target: new Vector3(0, 0, 0) };

  function posAt(t, out, tgt) {
    if (rm) {
      const p = t < 2000 ? cutFront : laws && t < 4000 ? cutBack : null;
      if (p) { out.copy(p.pos); tgt.copy(p.target); return FOG_OUT; }
      out.copy(rest.pos); tgt.copy(rest.target); return fogCore;
    }
    if (t <= tOut) {
      const x = EASE.camera(t / tOut), w = 1 - x;
      out.set(0, 0, 0)
        .addScaledVector(rest.pos, w * w * w).addScaledVector(c1, 3 * w * w * x)
        .addScaledVector(c2, 3 * w * x * x).addScaledVector(A, x * x * x);
      tgt.copy(rest.target).lerp(tgtOut, smooth(t / (tOut * 0.8)));
      return logLerp(fogCore, FOG_OUT, smooth(t / 1600));
    }
    if (t <= tHelix) {
      const e = sine((t - tOut) / (tHelix - tOut));
      helixAt(e, out);
      tgt.set(0, out.y - 230, 0);
      if (t - tOut < 900) tgt.lerpVectors(tgtOut, tgt, smooth((t - tOut) / 900));   // continuous look
      return FOG_OUT;
    }
    // home: swing back to the front while closing in, through the • stratum into CORE
    const x = clamp01((t - tHelix) / (D - tHelix));
    const e = EASE.camera(x);
    const th = lerp(thetaEnd, thetaHome, sine(Math.min(1, x / 0.7)));
    const r = lerp(R, 6, e);
    const y = lerp(yBot, rest.pos.y, smooth(x / 0.75));
    out.set(Math.sin(th) * r, y, Math.cos(th) * r);
    const b = smooth((x - 0.62) / 0.38);                         // the last metres settle onto the rest pose
    out.lerp(rest.pos, b);
    tgt.set(0, y - 230 * (1 - smooth(x / 0.6)), 0).lerp(rest.target, b);
    return logLerp(FOG_OUT, fogCore, smooth((x - 0.45) / 0.5));
  }

  let tick = -1;
  return {
    kind: 'SPECIAL', from: 'CORE', to: 'CORE', duration: D, swapAt: -1, swapKind: null, special: 'hull',
    hull: { laws, T1, rm, tOut, tHelix, D },
    pose(u, out) {
      const t = tOfU(u, D);
      settleDefaults(out, true);
      out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
      out.fog = posAt(t, out.cam.pos, out.cam.target);
      out.cam.fov = rest.fov; out.cam.offsetY = rest.offsetY * (t > D - 1500 || t < 600 ? 1 : 0); out.cam.roll = 0;
      // the rim (his name + the guests) leaves as he climbs out and returns as he comes home
      out.rim = rm ? (t >= (laws ? 4000 : 2000) ? 1 : 0) : 1 - smooth(t / 1400) + smooth((t - (D - 2200)) / 1600);
      // the CORE hall's own shell belongs to the inside: it leaves with him and is there again when he comes home
      out.shellFrom = out.shellTo = rm ? out.rim : 1 - smooth((t - 300) / 1100) + smooth((t - (D - 2600)) / 1400);
      out.alt = out.cam.pos.y;
      out.speed01 = rm ? 0 : 0.7 * Math.sin(Math.PI * clamp01(u));
      out.exitU = clamp01(t / TIMING.depart);
      out.enterU = clamp01((t - (D - TIMING.arrive)) / TIMING.arrive);
      return out;
    },
    /** strut ticks while the camera crosses the rim lattice going out (≈ 300 → 620 m) and coming home: ≤ 30/s */
    cues(u, prevU, ctx) {
      if (rm || !ctx || !ctx.audio) return;
      const t = tOfU(u, D);
      const inLattice = (t > 500 && t < 1500) || (t > D - 3200 && t < D - 1400);
      if (!inLattice) return;
      const k = Math.floor(t / 40);                              // 25 ticks per second
      if (k !== tick) { tick = k; ctx.audio.play('strutTick', {}); }
      void prevU; void _q;
    },
  };
}
