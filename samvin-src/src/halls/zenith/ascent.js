// halls/zenith/ascent.js — WP9: into ZENITH (SPEC §7.5; ARCH §3.6.3 SPECIAL 2,400 ms, + a LIFT to SIGNAL first ≤ 1,800).
//      0–600   the navigator's rubber band gives (`snapAir`); the camera rises toward SIGNAL's apex
//    600–1,400 the generators pinch around the lens as it passes the 12 m opening (strut ticks, ≤ 30/s)
//  1,400–2,000 fog → 0, the stars resolve; the camera arcs over and turns down to −62° (phone −70°)
//  2,000–2,400 VIN resolves below, solid, with its lit nodes; the hall's arrival writes the title and the message
// PURE in u; publishes its scene time on `clock` (the hall draws the pinch from it, scrubbing included). The axis pillar
// fades out on the way up (the camera climbs the axis through its beads) and stays out in the open sky.
import { Vector3, CatmullRomCurve3 } from 'three';
import { buildLift, concatPaths } from '../../nav/paths.js';
import { settleDefaults, tOfU, createPoseOut } from '../../nav/pathKit.js';
import { EASE, clamp01, lerp } from '../../core/ease.js';

export const ASCENT_MS = 2400;
const ANCHOR = 1260;
const _d = new Vector3(), _a = new Vector3(), _b = new Vector3();

/** rest: { pos, target, fov } hall-local (ZENITH rest pose); → Path */
export function buildAscent(hctx, from, start, rest, clock) {
  const lift = from === 'SIGNAL' ? null : buildLift(start, from, 'SIGNAL', {});
  const p0 = new Vector3(), q0 = new Vector3();
  let fov0 = start.cam.fov || 40, fog0 = start.fog > 0 ? start.fog : 0.014;
  if (lift) {
    const tmp = createPoseOut();
    lift.pose(1, tmp);
    p0.copy(tmp.cam.pos); q0.copy(tmp.cam.target); fov0 = tmp.cam.fov; fog0 = tmp.fog;
  } else { p0.copy(start.cam.pos); q0.copy(start.cam.target); }
  const R = rest.pos.clone().add(new Vector3(0, ANCHOR, 0));
  const RT = rest.target.clone().add(new Vector3(0, ANCHOR, 0));
  const restDir = RT.clone().sub(R).normalize();
  const pts = [p0.clone(), new Vector3(1.6, 1152, 11), new Vector3(1.1, 1197, 3), new Vector3(0.5, 1228, 5),
    new Vector3(0, 1252, R.z * 0.6), R.clone()];
  const tk = [0, 520, 900, 1300, 1850, 2250];                     // when the camera passes each point (ms)
  const curve = new CatmullRomCurve3(pts, false, 'centripetal');
  const at = pts.map((p) => { // curve parameter of each control point (closest sample)
    let best = 0, bd = Infinity;
    for (let i = 0; i <= 400; i++) { const d = curve.getPoint(i / 400).distanceTo(p); if (d < bd) { bd = d; best = i / 400; } }
    return best;
  });
  const D = ASCENT_MS;
  const up = new Vector3(0, 1, 0), level = new Vector3(0, 0, -1);
  function curveU(t) {
    if (t >= tk[tk.length - 1]) return 1;
    let k = 0;
    while (k < tk.length - 2 && t > tk[k + 1]) k++;
    const f = clamp01((t - tk[k]) / (tk[k + 1] - tk[k]));
    const g = k === 0 ? EASE.camera(f) * 0.6 + f * 0.4 : f;       // a gentle start (the band gives), then steady
    return lerp(at[k], at[k + 1], g);
  }

  const scene = {
    kind: 'SPECIAL', from: 'SIGNAL', to: 'ZENITH', duration: D, swapAt: -1, swapKind: null,
    pose(u, out) {
      const t = tOfU(u, D);
      clock.t = t;
      settleDefaults(out, false);
      out.s = 1; out.pivot.set(0, 0, 0); out.Q.set(0, 0, 0);
      curve.getPoint(curveU(t), out.cam.pos);
      if (t >= tk[tk.length - 1]) out.cam.pos.lerp(R, clamp01((t - tk[tk.length - 1]) / (D - tk[tk.length - 1])));
      // the look: the start target → straight up the apex (0–900) → over the horizon → down to the rest pitch
      if (t < 900) {
        const k = EASE.camera(clamp01(t / 900));
        _a.copy(q0).sub(p0).normalize();
        _d.copy(_a).lerp(up, k).normalize();
      } else if (t < 1650) {
        const k = EASE.camera(clamp01((t - 1400) / 250));
        _d.copy(up).lerp(level, k * 0.999).normalize();
      } else {
        const k = EASE.camera(clamp01((t - 1650) / 600));
        _d.copy(level).lerp(restDir, k).normalize();
      }
      _b.copy(out.cam.pos).addScaledVector(_d, 60);
      out.cam.target.copy(_b);
      if (t >= 2250) out.cam.target.lerp(RT, clamp01((t - 2250) / 150));
      out.cam.fov = lerp(fov0, rest.fov, EASE.camera(clamp01((t - 1400) / 800)));
      out.cam.offsetY = 0; out.cam.roll = 0;
      out.fog = t < 1400 ? fog0 : t < 2000 ? lerp(fog0, 0, EASE.camera((t - 1400) / 600)) : lerp(0, hctx.meta.fog, clamp01((t - 2000) / 400));
      out.pillar = 1 - clamp01(t / 420);
      // the nest's lattice VIN gives way to ZENITH's solid VIN as it resolves below (2,000–2,400)
      out.fade.vin = 1 - clamp01((t - 1850) / 450);
      out.shellTo = 1 - clamp01((t - 1400) / 600);       // open sky: ZENITH's own survey rings and iris never show
      out.alt = out.cam.pos.y;
      out.exitU = clamp01(t / 240);
      out.enterU = clamp01((t - (D - 600)) / 600);
      out.speed01 = Math.sin(Math.PI * clamp01(t / 2000));
      out.iris.fromTop = 0;
      return out;
    },
    cues(u, prevU, ctx) {
      if (u <= prevU || !ctx || !ctx.audio) return;
      const t = tOfU(u, D), tp = tOfU(prevU, D);
      if (tp <= 0 && t > 0) ctx.audio.play('snapAir', {});
      if (t > 600 && tp < 1400) {                                  // strut ticks as the generators pass (≤ 30/s)
        const a = Math.floor(Math.max(600, tp) / 70), b = Math.floor(Math.min(1400, t) / 70);
        if (b > a) ctx.audio.play('strutTick', {});
      }
    },
  };
  return lift ? concatPaths(lift, scene) : scene;
}
