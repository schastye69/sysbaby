// fx/focus.js — analytic depth of field (SPEC-ADDENDUM A2.6.2; ARCH-ADDENDUM X§2.5.5). OWNER: WP12.
// U.uFocus = (focal depth in RENDER units = focalM·s, aperture CSS px, on). Only at rack moments — the boot depth, the
// DIVE, the tab return — never at rest (aperture 0 → off). Under reduced motion every rack is ignored except opts.force
// (the tab-return pull: a focus change is not motion). uFxCaps (x: width terms, y: heptagon bokeh) follow the tier;
// without the heptagon (phones, T1) the aperture written to uFocus is capped at 3 px, so coc ≤ 3 px.
import { U } from '../render/uniforms.js';
import { scaleEngine } from '../render/scale.js';
import { quality } from '../core/quality.js';
import { ENV } from '../core/env.js';
import { EASE } from '../core/ease.js';
import { perf } from './cue.js';

export function createFocus() {
  const st = { f0: 30, f1: 30, a0: 0, a1: 0, t0: 0, ms: 0, ease: EASE.camera, res: null, focal: 30, aper: 0, ext: false, maxA: 10 };
  const done = () => { const r = st.res; st.res = null; if (r) r(); };
  const focus = {
    /** opts { focalM, apertPx, ms, ease?, force? } → Promise */
    rack(opts) {
      const o = opts || {};
      if (ENV.reducedMotion && !o.force) return Promise.resolve();
      done();
      st.f0 = st.focal; st.a0 = st.aper;
      st.f1 = o.focalM != null ? +o.focalM : st.focal;
      st.a1 = o.apertPx != null ? +o.apertPx : st.aper;
      st.t0 = perf(); st.ms = Math.max(0, +o.ms || 0); st.ease = o.ease || EASE.camera;
      if (o.from != null) st.a0 = +o.from;
      if (o.focalFrom != null) st.f0 = +o.focalFrom;
      if (!st.ms) { st.focal = st.f1; st.aper = st.a1; return Promise.resolve(); }
      return new Promise((r) => { st.res = r; });
    },
    set(focalM, apertPx, force) {
      if (ENV.reducedMotion && !force) return;
      done();
      st.focal = st.f0 = st.f1 = +focalM || 0; st.aper = st.a0 = st.a1 = +apertPx || 0; st.ms = 0;
    },
    clear(ms = 400) { return focus.rack({ focalM: st.focal, apertPx: 0, ms, force: true }); },
    /** Path decorators drive the focus directly while a travel owns it. */
    drive(focalM, apertPx) { st.ext = true; st.focal = focalM; st.aper = apertPx; },
    release() { if (st.ext) { st.ext = false; st.a0 = st.a1 = st.aper = 0; st.f0 = st.f1 = st.focal; } },
    caps() {
      const p = quality.params && quality.params.fx;
      U.uFxCaps.value.set(p && p.widthDof ? 1 : 0, p && p.heptagon ? 1 : 0);
      // Phones and T1: round points with coc ≤ 3 px (A2.6.2). coc = aperture·|z − z_f|/z ≤ aperture, so the cap is
      // applied to the aperture written to U.uFocus (the boot rack's 6 px and the tab return's 4 px become 3 px there).
      st.maxA = p && p.heptagon ? 10 : 3;
    },
    frame() {
      if (!st.ext) {
        if (st.ms > 0) {
          const x = Math.min(1, (perf() - st.t0) / st.ms), e = st.ease(x);
          st.focal = st.f0 + (st.f1 - st.f0) * e; st.aper = st.a0 + (st.a1 - st.a0) * e;
          if (x >= 1) { st.ms = 0; done(); }
        } else if (st.res) done();
      }
      const on = st.aper > 0.01 ? 1 : 0;
      U.uFocus.value.set(st.focal * scaleEngine.s, on ? Math.min(st.aper, st.maxA) : 0, on);
    },
    get state() { return st; },
  };
  return focus;
}
