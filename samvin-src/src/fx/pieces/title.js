// fx/pieces/title.js — the title sequence's FX layer (SPEC-ADDENDUM A2.1.1, A2.7.3; ARCH-ADDENDUM X§2.5.9). OWNER: WP12.
// WP2 owns every boot timeline; this runs only the FX beats on its clock (t0 = timeline 0, perf ms):
//   600–1,800 rack focus 30 → 9.5 m (camera ease) at aperture 6 px; 1,800–2,600 aperture 6 → 2; 2,600–3,400 2 → 0 (the
//   Key is tack-sharp from 3,400). Bead points render as heptagonal bokeh on T3 / T2 desktop (uFxCaps.y).
//   600–1,800 (first visit only) the 3 % ambient term lights the dust; far motes are bokeh discs, near ones points.
//   2,600–3,400 the scan plane is a light sheet in the dust (sheetY(tMs) → render y | null); behind it, on T3 / T2
//   desktop (device gate), motes within 0.25 m of a face deposit onto it and fade into the solid 600 ms after THE LINE.
// 'wake' starts at 1,800 (the ears snap blocked on the wake input; WP2 calls audio.fx). 'return' / 'reduced': no rack.
import { ENV } from '../../core/env.js';
import { EASE } from '../../core/ease.js';
import { quality } from '../../core/quality.js';
import { perf } from '../cue.js';

export function titleFx(F, opts) {
  const o = opts || {};
  const v = o.variant || 'first';
  if (v === 'return' || v === 'reduced' || F.t0) return { stop() {} };
  const t0 = Number.isFinite(o.t0) ? o.t0 : perf();
  const rm = ENV.reducedMotion;
  const dep = !!(quality.params && quality.params.fx && quality.params.fx.deposition) && (v === 'first' || v === 'wake');   // the wake replays THE LINE
  let stopped = false, sheetOn = false, depOn = false;
  const off = F.addTick(() => {
    if (stopped) return false;
    const t = perf() - t0;
    if (!rm) {
      if (t >= 600 && t < 1800) {
        const x = EASE.camera((t - 600) / 1200);
        F.focus.drive(30 + (9.5 - 30) * x, 6);
      } else if (t >= 1800 && t < 3400) {
        F.focus.drive(9.5, t < 2600 ? 6 - (4 * (t - 1800)) / 800 : 2 - (2 * (t - 2600)) / 800);
      } else F.focus.release();
    }
    F.dust.ambientTerm(v === 'first' && t >= 600 && t < 1800 ? 0.03 : 0);
    const y = typeof o.sheetY === 'function' ? o.sheetY(t) : null;
    if (y != null && t >= 2400 && t < 3600) {
      F.dust.sheet(y, 0.03, true); sheetOn = true;
      if (dep && !depOn) { depOn = true; F.dust.deposit(true, t0 + 2600, 800); }
    } else if (sheetOn) { sheetOn = false; F.dust.sheet(0, 0.03, false); }
    if (depOn && t > 4600) { depOn = false; F.dust.deposit(false); }
    if (t > 4700) { F.focus.release(); F.dust.ambientTerm(0); return false; }
    return true;
  });
  return {
    stop() {
      if (stopped) return;
      stopped = true; off();
      F.focus.release(); F.dust.ambientTerm(0);
      if (sheetOn) F.dust.sheet(0, 0.03, false);
      if (depOn) F.dust.deposit(false);
    },
  };
}
