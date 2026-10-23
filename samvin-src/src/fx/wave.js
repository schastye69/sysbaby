// fx/wave.js — ВОЛНА 343 (SPEC-ADDENDUM A2.0.4; ARCH-ADDENDUM X§2.5.5). OWNER: WP12.
// A spherical (or axis) shell leaves `origin` at 343 m/s: r = 343·t canonical m, written to uWave{0|1}a/b in RENDER space
// every frame (r·s, width 9·s), until r > maxDist. Side effects: the struck Key shiver (origin at the nucleus), a 1 px
// camera tremble when the shell passes the camera (desktop, not reduced), the dust impulse, the echo (a planned cue
// audible at 2·dist/343). Reduced motion: a sphere writes mode 0 (no displacement, no brightening; the clock and the echo
// stay); an axis wave lights every bead AT ONCE for 400 ms, without the travelling order (A2.5): its shell centre sits
// FLAT_L m away horizontally (opposite the view), so every axis point lies inside the 137 m lit window of the axis rule.
// ≤ 1 wave per 8,000 ms (a capped request returns null).
import { Vector3 } from 'three';
import { U } from '../render/uniforms.js';
import { scaleEngine } from '../render/scale.js';
import { rig } from '../render/cameraRig.js';
import { layout } from '../core/layout.js';
import { ENV } from '../core/env.js';
import { audio } from '../audio/engine.js';
import { SPEED_OF_SOUND, perf, clk } from './cue.js';

const C = SPEED_OF_SOUND;
const FLAT_L = 1e5, FLAT_MS = 400;

export function createWave(F) {
  const { ctx } = F;
  const slots = [{ a: U.uWave0a.value, b: U.uWave0b.value, w: null }, { a: U.uWave1a.value, b: U.uWave1b.value, w: null }];
  let next = 0, last = -Infinity;
  const _o = new Vector3(), _c = new Vector3();
  const wave = {
    lastArrival300: null,
    /** → { startAt, arrival(distM), stop() } | null */
    fire(opts) {
      const o = opts || {};
      const now = perf();
      if (now - last < 8000) return null;
      last = now;
      const origin = new Vector3();
      if (o.origin) origin.copy(o.origin);
      // o.at: the perf ms the shell leaves (the exact hit of a ПАУЗА, delivered on the frame nearest to it — maybe up to
      // half a frame before or a stalled frame after); the shell, its arrivals and the echo all count from it.
      const start = Number.isFinite(o.at) ? Math.max(now - 1000, Math.min(now + 250, o.at)) : now;
      const w = { origin, mode: o.mode === 'axis' ? 2 : 1, amp: o.ampRel != null ? o.ampRel : 0.004, width: o.width != null ? o.width : 9,
        gain: o.gain != null ? o.gain : 0.6, max: o.maxDist != null ? o.maxDist : 1300, startAt: start, on: true, slot: null,
        flat: false, fo: null };
      if (!F.t0 && ENV.reducedMotion && w.mode === 2 && rig.camera) {
        w.flat = true;
        const alt = scaleEngine.toCanonical(rig.camera.position, _c).y;
        rig.camera.getWorldDirection(_o); _o.y = 0;
        if (_o.lengthSq() < 1e-8) _o.set(0, 0, -1);
        _o.normalize();
        w.fo = new Vector3(0, alt, 0).addScaledVector(_o, -FLAT_L);
      }
      const arrival = (d) => w.startAt + (1000 * (+d || 0)) / C;
      wave.lastArrival300 = Math.round(arrival(300) - w.startAt);
      if (F.impact) F.impact.note('wave', w.startAt);
      if (!F.t0) {
        const s = slots[next]; next = 1 - next;
        if (s.w) s.w.on = false;
        s.w = w; w.slot = s;
        if (origin.length() < 2 && ctx.key) ctx.key.strike(0.004);
        if (rig.camera && layout.kind === 'desktop' && !ENV.reducedMotion) {
          const camD = scaleEngine.toCanonical(rig.camera.position, _c).distanceTo(origin);
          F.cue.at(arrival(camD), { id: 'pass', visual: () => rig.tremble(1, 120) });
        }
        F.dust.impulse(origin, 1.2, 2);
      } else F.twin('wave', { ms: 875 });
      if (o.echo) {
        const dist = +o.echo.dist || 300;
        F.cue.at(w.startAt + (2000 * dist) / C, { id: 'farEcho', audio: (T) => audio.play('farEcho', { dist, when: T }) });
      }
      return {
        startAt: w.startAt, arrival,
        stop() { w.on = false; if (w.slot && w.slot.w === w) { w.slot.b.w = 0; w.slot.w = null; } },
      };
    },
    frame() {
      const s = scaleEngine.s;
      for (let k = 0; k < 2; k++) {
        const sl = slots[k], w = sl.w;
        if (!w) continue;
        if (w.flat) {
          if (!w.on || perf() - w.startAt > FLAT_MS) { sl.b.w = 0; sl.w = null; continue; }
          scaleEngine.toRender(w.fo, _o);
          sl.a.set(_o.x, _o.y, _o.z, (FLAT_L + 60) * s);
          sl.b.set(0, w.width * s, w.gain, 2);
          continue;
        }
        const r = (C * Math.max(0, clk.pres - w.startAt)) / 1000;   // the shell where it is on this frame's PRESENTED time
        if (!w.on || r > w.max) { sl.b.w = 0; sl.w = null; continue; }
        scaleEngine.toRender(w.origin, _o);
        sl.a.set(_o.x, _o.y, _o.z, r * s);
        sl.b.set(w.amp, w.width * s, w.gain, ENV.reducedMotion ? 0 : w.mode);
      }
    },
  };
  return wave;
}
