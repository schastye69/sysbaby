// fx/t0fx.js — the picture side of ctx.fx in T0 and the grain freeze on every tier (SPEC-ADDENDUM A9.1; X§2.2.5,
// X§2.8.3). OWNER: WP12. T0 has no composite: the ПАУЗА / ПРОВАЛ / СВЁРТКА freeze pauses #ff-grain's CSS animation and the
// SVG Key's transitions (ctx.t0.twin('pause')); every other picture twin is a ctx.t0.twin(kind, opts) call
// ('prosvet', 'wave', 'ears', 'nucleus', 'close', 'lockFlash', 'scaleLabel'). A missing ctx.t0 makes them no-ops.
import { logOnce } from '../core/env.js';

export function createTwins(ctx, t0) {
  const holds = new Set();
  const twin = (kind, opts) => {
    if (!t0) return;
    try { if (ctx.t0 && typeof ctx.t0.twin === 'function') ctx.t0.twin(kind, opts || {}); } catch (e) { logOnce('fx:twin', e); }
  };
  /** Grain + motion freeze with independent holders ('pause', 'proval', 'close'). */
  const freeze = (on, who = 'pause') => {
    const was = holds.size > 0;
    if (on) holds.add(who); else holds.delete(who);
    const now = holds.size > 0;
    if (now === was) return;
    if (ctx.composite) ctx.composite.freezeGrain(now);
    if (t0 || !ctx.composite) {
      const g = document.getElementById('ff-grain');
      if (g) g.style.animationPlayState = now ? 'paused' : '';
      twin('pause', { on: now });
    }
  };
  return { twin, freeze };
}
