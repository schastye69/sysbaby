// boot/timeline.js — the boot clock (WP2). Every boot / start / wake table of SPEC §4 and SPEC-ADDENDUM A2.1 is written
// in "timeline ms" v. This driver advances v by the real time between presented frames (performance time of the rAF
// timestamps — a janky frame never makes the boot run slow), except across a hidden-tab gap (the loop was stopped:
// v does not advance), at rate 1 or ×2 (skip), never scaling the windows marked `realtime` (the ПАУЗА, A2.0.2).
//
//   at(v, fn)                      a picture beat, fired on the frame whose presentation is nearest v (≤ half a frame
//                                  early, never more)
//   cue(v, id, audio, visual)      a planned cue (A6.3): its audio(T) is handed to ctx.fx.cue.at(V) ≈ 180 ms ahead
//                                  (V = the perf time at which v will be presented, audible on that frame); its visual
//                                  is a beat at v. Re-planned when the rate changes or the timeline jumps.
//   span(a, b, fn(u))              per-frame tween over [a, b] (u 0..1, ends with fn(1) exactly once)
//   realtime(a, b)                 [a, b] advances 1:1 with real time whatever the rate
//   hold(at, ok)                   v never passes `at` while ok() is false (the ПАУЗА owns the hit: the timeline waits
//                                  for the pause to start and for the hit, so a late frame never splits picture/pause)
//   catchUp(v, at)                 v := v at perf `at` (the hit's late frame); skipped beats still fire next frame
//   setRate(r), jumpTo(v)          skip ×2 / jump (spans ending before v are finalised with fn(1); beats and cues before
//                                  v are dropped — the caller settles the state of a jump itself)
//   vNow()                         v by the wall clock (for planning that must not wait for a stalled frame)
//   perfOf(v), perfAt(v), t0Perf   perf ms at which v will be / was presented; of v = 0 (the boot hook's t0)
import { loop } from '../core/loop.js';

const ORDER_BOOT = 22;
const STALL = 50;               // real ms without a frame before the wall-clock pump steps the table (3 frames at 60 Hz)
const LOOKAHEAD = 180;          // real ms: planned audio is handed to the cue clock this far ahead (≥ 100 ms, A6.3)

const rafPerf = () => {
  const p = performance.now();
  const since = loop.at() - loop.now;
  return p - (since > 0 ? since : 0);
};

export function createTimeline(ctx, opts = {}) {
  const beats = [];            // { v, fn, done }
  const cues = [];             // { v, id, audio, h, planned, fired }
  const spans = [];            // { a, b, fn, done }
  const rt = [];               // realtime windows [a, b]
  const holds = [];            // { at, ok }
  const deltas = new Float32Array(15);
  let hiddenGap = false;
  const offVis = ctx.bus.on('visibility', (e) => { if (e && e.hidden) hiddenGap = true; });
  let nd = 0, v = opts.from || 0, rate = 1, lastLoop = loop.now, lastPerf = 0, running = false, ended = false, frameId = 0;

  const inRt = (x) => { for (let i = 0; i < rt.length; i++) if (x >= rt[i][0] && x < rt[i][1]) return true; return false; };
  const sortBeats = () => beats.sort((x, y) => x.v - y.v);
  function medianFrame() {
    if (!nd) return 16.7;
    const n = Math.min(nd, deltas.length);
    let s = 0;
    for (let i = 0; i < n; i++) s += deltas[i];
    return Math.min(120, s / n);          // a mean of the last frames, capped (one hitch never pulls beats far early)
  }

  const tl = {
    t0Perf: 0,
    get v() { return v; },
    get rate() { return rate; },
    get ended() { return ended; },
    get running() { return running; },
    at(at, fn) { beats.push({ v: at, fn, done: false }); sortBeats(); return tl; },
    cue(at, id, audio, visual) {
      if (audio) cues.push({ v: at, id, audio, h: null, planned: false, fired: false });
      if (visual) tl.at(at, visual);
      return tl;
    },
    span(a, b, fn) { spans.push({ a, b, fn, done: false }); return tl; },
    realtime(a, b) { rt.push([a, b]); return tl; },
    hold(at, ok) { holds.push({ at, ok }); return tl; },

    /** real ms from the current v to target (rate-aware, realtime windows 1:1) */
    realTo(target) { return tl.realBetween(v, target); },
    realBetween(from, target) {
      if (target <= from) return 0;
      let ms = 0, x = from;
      while (x < target - 1e-9) {
        let next = target;                                   // the next window edge after x (no allocation)
        for (let i = 0; i < rt.length; i++) {
          const a = rt[i][0], b = rt[i][1];
          if (a > x && a < next) next = a;
          if (b > x && b < next) next = b;
        }
        ms += (next - x) / (inRt((x + next) / 2) ? 1 : rate);
        x = next;
      }
      return ms;
    },
    perfOf(target) { return (lastPerf || rafPerf()) + tl.realTo(target); },
    /** perf ms at which v = x was (or will be) presented: a beat that fired a frame late still reports its time */
    perfAt(x) { return x >= v ? tl.perfOf(x) : (lastPerf || rafPerf()) - tl.realBetween(x, v); },

    /** the v the wall clock says now (between frames: a stalled frame has not advanced v yet), held at a pending hold */
    vNow() {
      if (!running) return v;
      let x = adv(v, Math.max(0, performance.now() - lastPerf));
      for (let i = 0; i < holds.length; i++) if (holds[i].at >= v && holds[i].at < x && !holds[i].ok()) x = holds[i].at;
      return x;
    },
    setRate(r) { if (r !== rate) { rate = r; replan(); } },
    /** v := target now (perf `at`), counting the next frame's advance from `at`; the beats and spans between the old v
     *  and target still run on the next frame (a catch-up, not a jump). Used on the hit: the table resumes in step with
     *  the hit however late the frame that delivered it. */
    catchUp(target, at) {
      if (!(target >= v)) return;
      v = target;
      lastPerf = at;
      replan();
    },
    jumpTo(target) {
      if (target <= v) return;
      v = target;
      for (const s of spans) if (!s.done && s.b <= v) { s.done = true; try { s.fn(1); } catch (e) { /* owner's */ } }
      for (const b of beats) if (!b.done && b.v < v) b.done = true;
      for (const c of cues) if (!c.fired && c.v < v) { c.fired = true; if (c.h) { c.h.cancel(); c.h = null; } }
      replan();
    },
    start() {
      if (running) return tl;
      running = true;
      lastLoop = loop.now;
      lastPerf = rafPerf();
      tl.t0Perf = lastPerf - (opts.from || 0);
      frameId = loop.add(frame, ORDER_BOOT);
      framePerf = performance.now();
      pumpT = setTimeout(pump, 25);
      return tl;
    },
    stop() {
      if (!running) return;
      running = false; ended = true;
      loop.remove(frameId);
      if (pumpT) { clearTimeout(pumpT); pumpT = 0; }
      offVis();
      // a cue the table has already passed stays with the cue clock (a stalled frame must not swallow the last
      // ASSEMBLY click at the end); only cues still ahead of v are dropped
      for (const c of cues) if (c.h && !c.fired && c.v > v) { c.h.cancel(); c.h = null; }
    },
  };

  function replan() { for (const c of cues) if (c.planned && !c.fired) { if (c.h) c.h.cancel(); c.h = null; c.planned = false; } }

  function plan(c) {
    c.planned = true;
    const V = tl.perfOf(c.v);
    c.h = ctx.fx.cue.at(V, { id: c.id, audio: c.audio, visual() { c.fired = true; } });
  }

  /** x advanced by d real ms (rate-aware, realtime windows 1:1) */
  function adv(x, d) {
    let left = d;
    while (left > 1e-6) {
      if (inRt(x)) {
        let end = Infinity;
        for (let i = 0; i < rt.length; i++) if (x >= rt[i][0] && x < rt[i][1]) end = Math.min(end, rt[i][1]);
        const step = Math.min(left, end - x); x += step; left -= step; continue;
      }
      let next = Infinity;
      for (let i = 0; i < rt.length; i++) if (rt[i][0] > x && rt[i][0] < next) next = rt[i][0];
      const step = Math.min(left, (next - x) / rate);
      x += step * rate; left -= step;
    }
    return x;
  }
  const advance = (d) => { v = adv(v, d); };

  let framePerf = 0;
  function frame() {
    if (!running) return;
    // never before lastPerf: a pump (or a catch-up) between frames already counted the time up to it
    const p = Math.max(rafPerf(), lastPerf), dl = loop.now - lastLoop, dp = p - lastPerf;
    lastLoop = loop.now; lastPerf = p; framePerf = performance.now();
    let d = dp;
    if (dl <= 0) d = 0;
    else if (hiddenGap) { hiddenGap = false; d = Math.min(dp, dl); }   // the tab was hidden: not through the gap
    step(d, true);
  }
  /** a stalled frame (software GL, a shader link) must not stall the table: between frames that are > STALL ms apart,
   *  a wall-clock pump runs the same step, so beats and the end keep their schedule (the picture follows on the next
   *  frame). Never while hidden (the loop is stopped there, and so is the table). */
  function pump() {
    pumpT = 0;
    if (!running) return;
    const p = performance.now();
    if (!document.hidden && !hiddenGap && p - framePerf > STALL && p - lastPerf > STALL) {
      const d = p - lastPerf;
      lastPerf = p;
      step(d, false);
    }
    if (running) pumpT = setTimeout(pump, 25);
  }
  let pumpT = 0;
  function step(d, isFrame) {
    const v0 = v;
    if (d > 0) { if (isFrame) { deltas[nd % deltas.length] = d; nd++; } advance(d); }
    let limit = Infinity;                 // beats at or after an unreleased hold wait for it (the hit comes first)
    for (let i = 0; i < holds.length; i++) {
      const h = holds[i];
      if (h.at >= v0 && h.at < limit && !h.ok()) { limit = h.at; if (v > h.at) v = h.at; }
    }
    const ahead = 0.5 * medianFrame() * (inRt(v) ? 1 : rate);
    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      if (s.done || v < s.a) continue;
      const u = s.b > s.a ? Math.min(1, (v - s.a) / (s.b - s.a)) : 1;
      if (u >= 1) s.done = true;
      try { s.fn(u); } catch (e) { s.done = true; }
    }
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i];
      if (b.done) continue;
      if (b.v > v + ahead || b.v >= limit) break;
      b.done = true;
      try { b.fn(); } catch (e) { /* owner's */ }
    }
    const hasCue = !!(ctx.fx && ctx.fx.cue && typeof ctx.fx.cue.at === 'function');
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i];
      if (c.fired || c.planned) continue;
      if (hasCue) { if (tl.realTo(c.v) <= LOOKAHEAD) plan(c); continue; }
      if (c.v <= v + ahead) {
        c.fired = true;
        try { if (ctx.audio && ctx.audio.fx && ctx.audio.fx.ready()) c.audio(ctx.audio.now()); } catch (e) { /* owner's */ }
      }
    }
    if (opts.onFrame) opts.onFrame(v);
  }
  return tl;
}
