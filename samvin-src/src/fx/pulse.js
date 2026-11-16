// fx/pulse.js — the sub-pulse twin (SPEC-ADDENDUM A3.2, A6.5.5, A6.5.7; law L6; ARCH-ADDENDUM X§2.5.6). OWNER: WP12.
// run(): starts audio 'subPulse' with the same grid anchor (t0Perf) and drives U.uPulse = 1 on each beat's presented
// frame, decaying τ 110 ms — regardless of sound (muted parity). Refuses to start inside a ПАУЗА; stopAll(at) ends
// every run ≥ 50 ms before a gate (L6: the pulse is never heard into silence). Callers: WP4 РЕЗОНАНС, WP13 СБОР.
import { U } from '../render/uniforms.js';
import { audio } from '../audio/engine.js';
import { clk, perf } from './cue.js';

export function createPulse(F) {
  const runs = [];
  let lastBeat = -1e9;
  const noop = { stop() {} };
  function end(r, atPerf) {
    const at = atPerf != null ? atPerf : perf();
    r.stopAt = Math.min(r.stopAt, at);
    if (r.voice && r.voice.alive !== false) {
      const ms = Math.max(0, at - perf());
      if (ms <= 20) { try { r.voice.stop(20); } catch (e) { /* gone */ } } else F.cue.at(at, { id: 'pulseStop', visual: () => { try { r.voice.stop(20); } catch (e) { /* gone */ } } });
    }
  }
  const pulse = {
    /** opts { periodMs = 900, level01, steps?, t0?, beats?, stopAt? } → { stop(atPerf?) } */
    run(opts) {
      const o = opts || {};
      if (F.impact && F.impact.inPause()) return noop;
      const period = +o.periodMs || 900;
      const t0 = Number.isFinite(o.t0) ? o.t0 : perf() + clk.med;
      let steps = Array.isArray(o.steps) ? o.steps.map(Number) : null;
      if (!steps && o.beats > 0) { steps = []; for (let k = 0; k < o.beats; k++) steps.push(k * period); }
      const r = { t0, period, steps, k: 0, stopAt: Number.isFinite(o.stopAt) ? o.stopAt : Infinity, voice: null };
      runs.push(r);
      r.voice = audio.start('subPulse', { periodMs: period, level01: o.level01 != null ? o.level01 : 0.5, steps: steps || undefined, t0Perf: t0 });
      if (Number.isFinite(o.stopAt)) end(r, o.stopAt);
      return { stop(atPerf) { end(r, atPerf); }, set(p) { if (r.voice && r.voice.set) r.voice.set(p); } };
    },
    stopAll(atPerf) { const at = (atPerf != null ? atPerf : perf()) - 50; for (const r of runs) end(r, at); },
    frame() {
      const t = clk.pres + clk.med / 2;
      for (let i = runs.length - 1; i >= 0; i--) {
        const r = runs[i];
        for (;;) {
          const b = r.steps ? (r.k < r.steps.length ? r.t0 + r.steps[r.k] : Infinity) : r.t0 + r.k * r.period;
          if (b > t) { if (b === Infinity || b > r.stopAt) runs.splice(i, 1); break; }
          r.k++;
          if (b <= r.stopAt && b > lastBeat) lastBeat = b;
        }
      }
      // Decay from the beat's own time (presented-time grammar): the beat's frame shows 1; a frame that arrives late
      // (a stall) shows the decayed value, never a fresh peak inside a later ПАУЗА (L6).
      const d = clk.pres - lastBeat, h = clk.med / 2;
      U.uPulse.value = d > 600 ? 0 : d <= h ? 1 : Math.exp(-(d - h) / 110);
    },
  };
  return pulse;
}
