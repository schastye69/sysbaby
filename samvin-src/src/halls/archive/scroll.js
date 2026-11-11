// halls/archive/scroll.js — WP7: moving through time (SPEC §6.4 "Moving through time", §5.2 ARCHIVE wheel row, §10.1,
// §2.5 inertia, §12.4). The scroll position s is in band-index units (0 = newest band … n − 1 = «ДО НАЧАЛА»); the
// camera eye follows s along the axis, between band centres (eye = centre − 0.4 m).
//   wheel   one notch of 120 px deltaY = one band (trackpads: fractional, then a soft detent after 140 ms of quiet);
//           continued wheel for 800 ms past either end → the adjacent hall (older/down → MEMBERS, newer/up → SIGNAL)
//   drag    vertical drag / phone vertical swipe: 1 : 1 in metres, release → inertia × 0.92 per 16.7 ms, then the
//           medium spring snaps to the nearest band centre; dragged past an end it resists (rubber 0.35) and a release
//           ≥ 0.6 band beyond the end goes to the adjacent hall
//   keys    → = one band older, ← = one band newer
// Reduced motion: every move is a cut (no spring, no inertia; the reading block crossfades 160 ms in CSS).
import { Spring, SPRING } from '../../core/spring.js';
import { MOTION } from '../../core/tokens.js';

const NOTCH = 120;                  // px of deltaY per band
const DETENT_MS = 140;              // soft detent after this much wheel quiet
const OVERRUN_MS = 800;             // continued wheel past an end → adjacent hall
const OVERRUN_GAP = 260;            // a wheel pause longer than this (or 3 frames on a slow device) restarts the clock
const RUBBER = 0.35;

export function createScroll(bandCount, centreY, opts) {
  const n = bandCount;
  const sp = Spring.from(SPRING.medium, 0);
  let ts = 0, reduced = false, frameMs = 16.7;
  let lastGap = 0;                    // the previous wheel interval (a steady stream at any rate counts as continued)
  const gapMs = () => Math.max(OVERRUN_GAP, 3 * frameMs, Math.min(1500, 1.2 * lastGap));
  let lastWheel = -1e9, overDir = 0, overStart = -1, overLast = -1e9, overrun = 0;
  // The notch run past an end: a slow device delivers wheel notches irregularly (one per long frame), so a run of
  // ≥ 6 notches past the same end, none more than 2 s apart, spanning ≥ 800 ms, also counts as continued wheel.
  let runDir = 0, runStart = -1, runCount = 0, runLast = -1e9;
  let dragging = false, dragS0 = 0, dragM0 = 0, fling = 0, flinging = false;
  const clampS = (s) => (s < 0 ? 0 : s > n - 1 ? n - 1 : s);

  /** Eye height at a fractional band index (hall-local). */
  function eyeAt(s) {
    const c = s < 0 ? 0 : s > n - 1 ? n - 1 : s;
    const i = Math.floor(c), f = c - i;
    const a = centreY(i), b = i + 1 < n ? centreY(i + 1) : a;
    let y = a + (b - a) * f;
    // past an end (rubber): extrapolate with the end band's pitch
    if (s < 0) y += (n > 1 ? centreY(0) - centreY(1) : 1) * -s;
    else if (s > n - 1) y -= (n > 1 ? centreY(n - 2) - centreY(n - 1) : 1) * (s - (n - 1));
    return y - opts.eyeBelow;
  }
  /** Metres between band i's centre and the next (for drag 1 : 1). */
  function pitch(s) {
    const i = Math.max(0, Math.min(n - 2, Math.floor(s)));
    return n > 1 ? Math.max(0.6, centreY(i) - centreY(i + 1)) : 1;
  }
  function setTarget(t) {
    ts = clampS(t);
    sp.target = ts;
    if (reduced) sp.snap(ts);
  }

  const scroll = {
    get s() { return sp.x; },
    get target() { return ts; },
    get dragging() { return dragging; },
    get overrun() { return overrun; },
    get moving() { return dragging || flinging || Math.abs(sp.x - ts) > 0.004 || Math.abs(sp.v) > 0.02; },
    eye() { return eyeAt(sp.x); },
    eyeAt,
    setReduced(b) { reduced = !!b; if (reduced) sp.snap(ts); },
    /** The device's recent frame interval (ms): wheel events arrive at most once per frame, so a pause is judged on it. */
    setFrameMs(ms) { frameMs = ms; },
    /** Jump (instant) or glide to band i. */
    goTo(i, instant) { flinging = false; setTarget(Math.round(i)); if (instant) sp.snap(ts); },
    step(dir) { flinging = false; setTarget(Math.round(ts) + dir); },
    /** → 'stay' | 'next' | 'prev' (the overrun fired toward the hall below / above). now = performance.now() ms. */
    wheel(deltaY, now) {
      if (!deltaY) return 'stay';
      flinging = false;
      const dir = deltaY > 0 ? 1 : -1;
      const atEnd = (dir > 0 && ts >= n - 1 - 1e-6) || (dir < 0 && ts <= 1e-6);
      const gap = now - lastWheel;
      const tol = gapMs();
      lastGap = gap > 0 && gap < 5000 ? gap : 0;
      lastWheel = now;
      if (atEnd) {
        if (runDir !== dir || now - runLast > 2000) { runDir = dir; runStart = now; runCount = 0; }
        runCount += Math.max(1, Math.round(Math.abs(deltaY) / NOTCH)); runLast = now;   // coalesced events carry several notches
        if (runCount >= 6 && now - runStart >= OVERRUN_MS) { runDir = 0; runCount = 0; overDir = 0; overStart = -1; overrun = 0; sp.target = ts; return dir > 0 ? 'next' : 'prev'; }
        if (overDir !== dir || now - overLast > tol) { overDir = dir; overStart = now; }
        overLast = now;
        overrun = Math.min(1, (now - overStart) / OVERRUN_MS);
        if (!reduced) { sp.target = ts + dir * 0.22 * overrun; }
        if (now - overStart >= OVERRUN_MS) { overDir = 0; overStart = -1; overrun = 0; sp.target = ts; return dir > 0 ? 'next' : 'prev'; }
        return 'stay';
      }
      overDir = 0; overStart = -1; overrun = 0; runDir = 0; runCount = 0;
      setTarget(ts + deltaY / NOTCH);
      return 'stay';
    },
    dragStart() { dragging = true; flinging = false; dragS0 = sp.x; dragM0 = 0; overrun = 0; },
    /** ty: px since down (+ = finger moved down → newer); pxPerM: screen px per metre at the wall. */
    drag(ty, pxPerM) {
      if (!dragging) return;
      const m = -ty / pxPerM;
      void dragM0;
      let s = dragS0 + m / pitch(dragS0);
      if (s < 0) s *= RUBBER; else if (s > n - 1) s = n - 1 + (s - (n - 1)) * RUBBER;
      sp.x = s; sp.target = s; sp.v = 0; ts = clampS(s);
    },
    /** vy: px/ms (+ = down). → 'stay' | 'next' | 'prev' */
    dragEnd(vy, pxPerM) {
      if (!dragging) return 'stay';
      dragging = false;
      const s = sp.x;
      if (s > n - 1 + 0.6 * RUBBER) { setTarget(n - 1); return 'next'; }
      if (s < -0.6 * RUBBER) { setTarget(0); return 'prev'; }
      if (reduced) { setTarget(Math.round(s + Math.sign(-vy) * (Math.abs(vy) > 0.3 ? 0.5 : 0))); return 'stay'; }
      fling = (-vy * 1000 / pxPerM) / pitch(s);                 // bands per second
      flinging = Math.abs(fling) > 0.4;
      if (!flinging) setTarget(Math.round(s));
      return 'stay';
    },
    /** Per frame. → true when the eye moved. */
    update(dt, now) {
      const x0 = sp.x;
      if (flinging) {
        let s = sp.x + fling * dt;
        fling *= Math.pow(MOTION.inertiaDecay, (dt * 1000) / MOTION.frameMs);
        if (s <= 0 || s >= n - 1) { s = clampS(s); fling = 0; }
        sp.x = s; sp.v = 0;
        if (Math.abs(fling) < 0.6) { flinging = false; setTarget(Math.round(s)); }
      } else if (!dragging) {
        // soft detent after the wheel goes quiet; the overrun rubber relaxes
        const wall = performance.now();                         // the wheel runs on event time (performance.now)
        if (wall - lastWheel > DETENT_MS && Math.abs(ts - Math.round(ts)) > 1e-6) setTarget(Math.round(ts));
        if (overStart >= 0 && wall - overLast > gapMs()) { overStart = -1; overDir = 0; overrun = 0; sp.target = ts; }
        if (reduced) sp.snap(sp.target);
        else for (let r = dt; r > 1e-6; r -= 0.12) sp.step(r > 0.12 ? 0.12 : r);
      }
      return sp.x !== x0;
    },
    /** The band index under the eye (nearest centre). */
    centre() { return Math.max(0, Math.min(n - 1, Math.round(sp.x))); },
  };
  return scroll;
}
