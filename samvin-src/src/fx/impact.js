// fx/impact.js — ПАУЗА 0.4 and ПРОСВЕТ (SPEC-ADDENDUM A2.0.2, A2.0.3; laws L2, L3; ARCH-ADDENDUM X§2.5.4). OWNER: WP12.
// pause(): from `at`, timeScale 1 → 0 over 60 ms (ease-out quad), grain frozen, audio gate(400) at the same instant, every
// sub-pulse stopped ≥ 50 ms before it; the warm frame at hit − 100 (when ПРОСВЕТ follows); on the hit frame everything
// snaps back, vibrate(30), ПРОСВЕТ, onHit. Input inside the window brings the hit onto his input (now + 30 ms, never
// later). ≤ 1 per 20 s (else the hit plays at once, skipped); never inside DIVE / RECALL / LIFT. Nothing here creates
// nodes or touches layout inside the window: the frame only flips flags and writes uniforms.
// prosvet(): uImpact = 1 for ≥ 33 ms of PRESENTED time from the hit frame, then exp(−t/70), 0 at +240; fog × (1 − 0.85·u).
import { U } from '../render/uniforms.js';
import { fog } from '../render/fog.js';
import { loop } from '../core/loop.js';
import { bus } from '../core/bus.js';
import { audio } from '../audio/engine.js';
import { input } from '../core/input.js';
import { app } from '../core/store.js';
import { vibrate } from '../ui/tactile.js';
import { clk, perf } from './cue.js';

const PAUSE_KINDS = { boot: 1, wake: 1, s05: 1, nadir: 1, s02: 1 };
const PROSVET_KINDS = { first: 1, wake: 1, dive: 1, s05: 1, nadir: 1 };

export function createImpact(F) {
  const { ctx } = F;
  const impacts = [], prosvetLog = [];
  let P = null;                 // the live pause
  let pv = null;                // the live ПРОСВЕТ { e: log entry, p0, hold, done }
  const rec = (kind, at) => { impacts.push({ kind, at }); if (impacts.length > 32) impacts.shift(); bus.emit('fx:impact', { kind, at }); };

  input.observeDown(() => {
    if (!P || P.hit) return;
    const now = perf();
    if (now < P.at) return;
    const h = now + 30;
    if (h >= P.hitAt) return;
    P.hitAt = h; P.adv = true;
    if (audio.fx.ready()) audio.fx.advanceHit(audio.fx.ctxTimeFor(h));
  });

  function hit() {
    const p = P; P = null;
    loop.timeScale = 1;
    F.freeze(false);
    U.uImpactWarm.value = 0;
    vibrate(30);
    if (ctx.edges) ctx.edges.twitch(2);                 // the hard entry: edge strings twitch 2 px
    F.twin('nucleus', { level: 1 });
    if (p.o.prosvet) impact.prosvet({ kind: p.o.kind === 'boot' ? 'first' : p.o.kind });
    rec('hit', p.hitAt);
    if (p.o.onHit) { try { p.o.onHit(p.hitAt); } catch (e) { /* caller's */ } }
    p.res({ hitAt: p.hitAt, advanced: p.adv, skipped: false });
  }

  // Context loss: a pause in flight jumps to its hit (the loop is stopped; nothing may hang), ПРОСВЕТ ends.
  bus.on('gl:lost', () => {
    if (P && !P.hit) { P.hit = true; hit(); }
    if (pv) { pv = null; U.uImpact.value = 0; F.fogFactor('impact', 1); }
    U.uImpactWarm.value = 0;
  });

  // The flash has a source (FX_LIGHT_GLSL): the nucleus (or the caller's render-space origin — the axis point of a hall).
  // CORE: the nearest lit walls are the 300 m rim, the 620 m walls take about half; the light is a sheet out of the
  // gap planes, centred behind the Key. The first DIVE stands INSIDE the Key's lattice: the struts round the lens take
  // the full flash and the hall beyond falls off over its 2–3 decades of distance, with no sheet (the light is all round).
  function lightFrom(kind, origin) {
    const src = U.uImpactSrc.value;
    if (origin) src.copy(origin);
    else if (ctx.key && ctx.key.nucleusWorld) src.copy(ctx.key.nucleusWorld);
    else src.set(0, 0, 0);
    if (kind === 'dive') U.uImpactShape.value.set(1.0, 0.08, 3.2, 3.2);
    else if (!origin && app.room === 'CORE') U.uImpactShape.value.set(300, 0.55, 0.45, 0.12);
    else U.uImpactShape.value.set(1e7, 0, 3.2, 3.2);              // any other hall (S05 away from CORE, NADIR): the even SPEC flash
  }

  const impact = {
    lastPauseAt: -Infinity,
    lastProsvetAt: -Infinity,
    impacts, prosvetLog,
    /** log + bus fx:impact for the other kinds (the wave) */
    note: rec,
    /** opts { kind, at?, prosvet?, onHit? } → Promise<{ hitAt, advanced, skipped }> */
    pause(opts) {
      const o = opts || {};
      const now = perf();
      const at = Number.isFinite(o.at) ? Math.max(o.at, now) : now;
      const busy = !!(ctx.director && ctx.director.busy() && !ctx.director.playing);
      // Only the four moment classes (A2.0.2); anything else plays its hit without the pause.
      if (P || busy || !PAUSE_KINDS[o.kind] || at - impact.lastPauseAt < 20000) {
        const hitAt = Math.max(now, at);
        return new Promise((res) => {
          const go = () => {
            rec('hit', hitAt);
            if (o.onHit) { try { o.onHit(hitAt); } catch (e) { /* caller's */ } }
            res({ hitAt, advanced: false, skipped: true });
          };
          if (hitAt <= now + 1) go(); else F.cue.at(hitAt, { id: 'hit', visual: go });
        });
      }
      const prevPauseAt = impact.lastPauseAt;
      impact.lastPauseAt = at;
      F.pulse.stopAll(at);
      const ready = audio.fx.ready();
      if (ready) audio.fx.gate(400, { at: Math.max(audio.fx.ctxTimeFor(at), audio.now() + 0.008) });
      return new Promise((res) => {
        P = { o, at, hitAt: at + 400, adv: false, res, started: false, warm: false, hit: false, prevPauseAt };
        rec('pause', at);
      });
    },
    inPause() { return !!(P && P.started); },
    /** A planned pause whose freeze has not begun (a skip landed between the plan and `at`): no freeze, no gate (its
     *  close is still ahead), no hit of its own; resolves { hitAt: now, skipped, cancelled } and frees the 20 s cap.
     *  → false once the freeze has begun (an input inside the window already brings the hit to now + 30 ms). */
    cancel() {
      if (!P || P.started || P.hit) return false;
      const p = P; P = null;
      impact.lastPauseAt = p.prevPauseAt;
      if (audio.fx.ready() && audio.fx.ungate) audio.fx.ungate();
      for (let i = impacts.length - 1; i >= 0; i--) if (impacts[i].kind === 'pause' && impacts[i].at === p.at) { impacts.splice(i, 1); break; }
      p.res({ hitAt: perf(), advanced: false, skipped: true, cancelled: true });
      return true;
    },
    /** opts { kind: 'first'|'wake'|'dive'|'s05'|'nadir', origin?: Vector3 (render space; default the nucleus) } → false when capped */
    prosvet(opts) {
      const kind = (opts && opts.kind) || 'first';
      const now = perf();
      if (!PROSVET_KINDS[kind]) return false;
      // Never in DIVE / RECALL / LIFT except the first DIVE's own (law L3); a played ПОКАЗ path (the wake) is not a travel.
      if (kind !== 'dive' && ctx.director && ctx.director.busy() && !ctx.director.playing) return false;
      if (now - impact.lastProsvetAt < (kind === 'dive' ? 10000 : 20000)) return false;
      impact.lastProsvetAt = now;
      const e = { at: now, heldMs: 0, litArea: null };
      prosvetLog.push(e);
      if (prosvetLog.length > 16) prosvetLog.shift();
      pv = { e, p0: -1, hold: -1 };
      lightFrom(kind, opts && opts.origin);
      U.uImpact.value = 1;
      F.fogFactor('impact', 0.15);
      F.twin('prosvet', {});
      rec('prosvet', now);
      return true;
    },
    /** Marks the next frame as the warm frame (uImpactWarm = 1 for one frame). */
    warm() { F.warmNext = true; },
    /** fx frame (order 25). */
    frame() {
      if (U.uImpactWarm.value && !F.warmNow) U.uImpactWarm.value = 0;
      F.warmNow = false;
      if (F.warmNext) { F.warmNext = false; F.warmNow = true; U.uImpactWarm.value = 1; }
      if (P) {
        const t = clk.pres;
        if (!P.started && t >= P.at - clk.med / 2) { P.started = true; F.freeze(true); }
        if (P.started && !P.hit) {
          const x = Math.min(1, Math.max(0, (clk.now - P.at) / 60));
          loop.timeScale = (1 - x) * (1 - x);
          if (P.o.prosvet && !P.warm && t >= P.hitAt - 100 - clk.med / 2) { P.warm = true; impact.warm(); }
          if (t >= P.hitAt - clk.med / 2) { P.hit = true; hit(); }
        }
      }
      if (pv) {
        const t = clk.pres;
        if (pv.p0 < 0) pv.p0 = t;
        const el = t - pv.p0;
        if (pv.hold < 0) {
          if (el >= 33) { pv.hold = t; pv.e.heldMs = Math.round(el * 10) / 10; }
          U.uImpact.value = 1;
        }
        if (__DEV__ && impact.debugHold && pv.hold >= 0) pv.hold = t;   // dev QA: keep the hold for a screenshot
        if (pv.hold >= 0) {
          const d = t - pv.hold;
          U.uImpact.value = d >= 240 ? 0 : Math.exp(-d / 70);
        }
        if (pv.hold >= 0 && pv.hold < t && U.uImpact.value === 0) { pv = null; F.fogFactor('impact', 1); }
        else F.fogFactor('impact', 1 - 0.85 * U.uImpact.value);
      }
    },
    snapshot() {
      return { impacts: impacts.map((x) => ({ kind: x.kind, at: x.at })), prosvet: prosvetLog.map((x) => ({ at: x.at, heldMs: x.heldMs, litArea: x.litArea })) };
    },
  };
  return impact;
}
