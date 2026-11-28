// t0/secrets.js — WP11. The T0 versions of the hall-bound secrets (SPEC §12.5 "Secrets in T0"; ARCH §6.12, A16):
//   S01 РЕЗОНАНС   t0/resonance.js (hold the SVG Key 6,000 ms: marching-squares nodal lines through the six modes, then
//                   the DOM name)
//   S04 ВСЕ ВМЕСТЕ  t0/members.js (every SVG column plucked within 1,500 ms by the pointer's sweep)
//   S06 МАСТЕРСКАЯ  t0/workshop.js (the first ВЫРЕЗАТЬ ЗНАК → commitGlyph)
//   S11 ЧАСТОТА    t0/signal.js (the dial held within ±0.05 for 600 ms)
//   S12 КАПСУЛА    t0/insignia.js (the first arrival at or after the opening moment → openCapsule)
//   S13 ЗЕНИТ      here: ZENITH reached (only the navigator's overpull can reach it before S13 — the router guard)
// The global ones (S03, S05, S08, S09, S10, S14) stay WP10's in both modes; S02 and S07 are unavailable in T0.
// The one-time motion hint (bus hint:arrive) is forwarded to the current T0 hall's `hint(secret)`.
import { app } from '../core/store.js';
import { after } from '../core/clock.js';
import { layout } from '../core/layout.js';

export function installT0Secrets(ctx, T) {
  ctx.bus.on('room:arrive', (e) => {
    if (app.tier !== 'T0' || !e || e.room !== 'ZENITH' || !ctx.secrets) return;
    if (ctx.secrets.isFound('S13')) return;
    after(200, () => ctx.secrets.discover('S13', { anchor: { x: layout.w / 2, y: layout.h * 0.3 } }));
  });
  ctx.bus.on('hint:arrive', (e) => {
    if (app.tier !== 'T0' || !e || !T.halls) return;
    const h = T.halls[app.room];
    if (h && typeof h.hint === 'function') { try { h.hint(e.secret); } catch (err) { /* a hint never breaks a hall */ } }
  });
}
