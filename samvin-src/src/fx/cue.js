// fx/cue.js — the cue clock (SPEC-ADDENDUM A6.3, law L4; ARCH-ADDENDUM X§2.5.3). OWNER: WP12.
// The picture is master. A PLANNED cue has a visual time V (perf ms): its audio(T) is called once, in the frame where
// T − ctx.currentTime ≤ 60 ms + one frame, with T = audio.fx.ctxTimeFor(V) (so it is AUDIBLE at V); its visual() runs
// in the frame whose presentAt is nearest V. A REACTIVE cue (now) fires both at once. Locked / off / muted: the audio
// is skipped, the visual runs unchanged. clk (shared with every fx module) is refreshed once per frame at order 25:
//   raf = the rAF timestamp of this frame, now = performance.now(), med = median of the last 30 frame deltas,
//   pres = raf + med (the frame's presentation time).
import { audio } from '../audio/engine.js';
import { logOnce } from '../core/env.js';

export const SPEED_OF_SOUND = 343;
export const perf = () => performance.now();
export const clk = { raf: 0, now: 0, med: 16.7, pres: 0, frame: 0 };

let rafTs = -1;
const capture = (ts) => { rafTs = ts; requestAnimationFrame(capture); };
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(capture);

const D = new Float32Array(30), DS = new Float32Array(30);
let dn = 0, di = 0, lastRaf = -1;

/** Called first thing in the fx frame (order 25). */
export function tickClock() {
  const now = perf();
  const raf = rafTs > 0 && now - rafTs < 100 ? rafTs : now;
  if (lastRaf >= 0 && raf > lastRaf) {
    D[di] = Math.min(100, raf - lastRaf); di = (di + 1) % 30; if (dn < 30) dn++;
    for (let i = 0; i < dn; i++) DS[i] = D[i];
    const v = DS.subarray(0, dn); v.sort();
    clk.med = v[dn >> 1];
  }
  lastRaf = raf;
  clk.raf = raf; clk.now = now; clk.pres = raf + clk.med; clk.frame++;
}

const safe = (f, a) => { try { return f(a); } catch (e) { logOnce('fx:cue', e); return undefined; } };

export function createCue() {
  const pend = [];
  const log = [];
  let inPass = false;                    // a callback that re-enters frame() (a bus handler) waits for the next frame
  const push = (c, frameAt) => {
    if (!c.audio) return;
    log.push({ id: c.id, frameAt, audibleAt: c.aud });
    if (log.length > 64) log.shift();
  };
  const cue = {
    /** V perf ms, spec { id, audio?: (T) => void, visual?: () => void } → { cancel() } */
    at(V, spec) {
      const c = { V: +V || perf(), id: (spec && spec.id) || 'cue', audio: spec && spec.audio, visual: spec && spec.visual,
        aDone: !(spec && spec.audio), vDone: false, aud: null, dead: false, fAt: null };   // an audio-only cue still logs its visual frame (frameAt = the frame nearest V)
      pend.push(c);
      return {
        cancel() { if (!c.aStarted) c.dead = true; },
        /** Re-times a cue whose voices are not yet created (path decorators follow the path clock every frame). */
        move(V2) { if (!c.aStarted && !c.vDone && !c.dead && Number.isFinite(V2)) c.V = V2; },
      };
    },
    /** Reactive: both at once, no compensation. */
    now(spec) {
      const s = spec || {};
      if (s.visual) safe(s.visual);
      if (s.audio && audio.fx.ready()) safe(s.audio);
    },
    /** Drops every cue later than V whose voices are not yet created. */
    cancelAfter(V) { for (let i = 0; i < pend.length; i++) { const c = pend[i]; if (c.V > V && !c.aStarted) c.dead = true; } },
    presentAt(raf) { return raf + clk.med; },
    log() { return log.map((x) => ({ id: x.id, frameAt: x.frameAt, audibleAt: x.audibleAt })); },
    nowPerf: perf,
    /** fx frame (order 25), after tickClock(). */
    frame() {
      const ready = audio.fx.ready();
      const ct = ready ? audio.now() : 0, fs = clk.med / 1000;
      // In plan order (cues due in the same frame fire in the order they were planned); a cue planned by a callback
      // during this pass is seen next frame. Finished cues are compacted out in place (no allocation).
      if (inPass) return;
      inPass = true;
      const n = pend.length;
      let w = 0;
      for (let i = 0; i < n; i++) {
        const c = pend[i];
        if (c.dead) continue;
        if (!c.aDone) {
          if (ready) {
            const T = audio.fx.ctxTimeFor(c.V);
            if (T - ct <= 0.06 + 2 * fs) {
              c.aDone = true; c.aStarted = true;
              const Tc = Math.max(T, ct);
              safe(c.audio, Tc);
              c.aud = audio.fx.toPerf(Tc);
            }
          } else if (c.V <= clk.pres + clk.med / 2) c.aDone = true;
        }
        if (!c.vDone && c.V <= clk.pres + clk.med / 2) {
          c.vDone = true; c.fAt = clk.pres;
          if (c.visual) safe(c.visual);
        }
        if (c.aDone && c.vDone) push(c, c.fAt == null ? clk.pres : c.fAt);
        else pend[w++] = c;
      }
      // keep cues planned by callbacks during the pass (appended after n)
      for (let i = n; i < pend.length; i++) pend[w++] = pend[i];
      pend.length = w;
      inPass = false;
    },
  };
  return cue;
}
