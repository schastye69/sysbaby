// core/spring.js — springs (ARCH §3.1.3, SPEC §2.5): semi-implicit Euler of x'' = ω²(target − x) − 2ζω x'.
// Large frame steps are sub-stepped (≤ 1/120 s) so stiff springs stay stable at 15 fps. No allocation in step().
import { Vector3 } from 'three';
import { SPRINGS } from './tokens.js';

/** Presets: heavy ω6 · medium ω12 · light ω22 · struck ω18 ζ.18 · notice ω6.3 ζ.95 · reindex ω9 · hot ω14 · hint ω8 ζ.25 */
export const SPRING = SPRINGS;

const MAX_SUB = 1 / 120;

export class Spring {
  constructor(omega, zeta = 1, x0 = 0) {
    this.omega = omega;
    this.zeta = zeta;
    this.x = x0;
    this.v = 0;
    this.target = x0;
  }
  /** Advances by dt seconds. → x */
  step(dt) {
    if (!(dt > 0)) return this.x;
    const n = Math.min(16, Math.ceil(dt / MAX_SUB));
    const h = dt / n;
    const w = this.omega, w2 = w * w, c = 2 * this.zeta * w;
    for (let i = 0; i < n; i++) {
      this.v += (w2 * (this.target - this.x) - c * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
  /** Jumps to x (and target) with zero velocity. */
  snap(x) { this.x = x; this.target = x; this.v = 0; }
  settled(eps = 1e-3) { return Math.abs(this.target - this.x) < eps && Math.abs(this.v) < eps * 10; }
  /** Spring.from(SPRING.heavy, x0) */
  static from(preset, x0 = 0) { return new Spring(preset.omega, preset.zeta == null ? 1 : preset.zeta, x0); }
}

export class SpringV3 {
  constructor(omega, zeta = 1) {
    this.omega = omega;
    this.zeta = zeta;
    this.x = new Vector3();
    this.v = new Vector3();
    this.target = new Vector3();
  }
  /** Advances by dt seconds. → x (the same Vector3) */
  step(dt) {
    if (!(dt > 0)) return this.x;
    const n = Math.min(16, Math.ceil(dt / MAX_SUB));
    const h = dt / n;
    const w = this.omega, w2 = w * w, c = 2 * this.zeta * w;
    const x = this.x, v = this.v, t = this.target;
    for (let i = 0; i < n; i++) {
      v.x += (w2 * (t.x - x.x) - c * v.x) * h;
      v.y += (w2 * (t.y - x.y) - c * v.y) * h;
      v.z += (w2 * (t.z - x.z) - c * v.z) * h;
      x.x += v.x * h; x.y += v.y * h; x.z += v.z * h;
    }
    return x;
  }
  snap(v3) { this.x.copy(v3); this.target.copy(v3); this.v.set(0, 0, 0); }
  settled(eps = 1e-3) { return this.x.distanceTo(this.target) < eps && this.v.length() < eps * 10; }
}
