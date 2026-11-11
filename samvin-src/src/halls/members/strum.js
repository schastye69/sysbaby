// halls/members/strum.js — strumming the clan (SPEC §6.2 «Strum», §8.1 S04 АККОРД, §10.1).
//
// A pointer crossing a column's projected x-band faster than 0.25 px/ms plucks it (mouse with or without a button,
// a finger swipe on phone). Each column is plucked at most once per 120 ms. АККОРД: every column plucked within
// 1,500 ms (either direction) → onChord(), and the window starts over. Bands are written each frame by the hall
// (screen x of the column axis at the pointer's height, the column's screen half-width, its vertical extent).
// Pure state machine: no DOM, no allocation per sample.

export const STRUM = Object.freeze({ minPxMs: 0.25, chordMs: 1500, debounceMs: 120, gapMs: 320, slackPx: 24 });

export function createStrum(count, hooks) {
  const xc = new Float32Array(count), hw = new Float32Array(count), y0 = new Float32Array(count), y1 = new Float32Array(count);
  const on = new Uint8Array(count);
  const last = new Float64Array(count).fill(-1e9);
  let px = NaN, py = NaN, pt = 0;

  const api = {
    count,
    /** Screen band of column k (CSS px). */
    setBand(k, x, halfW, yTop, yBottom, visible) { xc[k] = x; hw[k] = halfW; y0[k] = yTop; y1[k] = yBottom; on[k] = visible ? 1 : 0; },
    /** Last pluck time of column k (ms, loop clock). */
    lastPluck(k) { return last[k]; },
    /** A raw pointer sample (CSS px, ms). */
    sample(x, y, t) {
      const dt = t - pt;
      const fresh = !(px === px) || dt > STRUM.gapMs || dt <= 0;
      const ox = px, oy = py;
      px = x; py = y; pt = t;
      if (fresh) return;
      const dx = x - ox;
      if (dx === 0) return;
      const v = Math.abs(dx) / dt;
      if (v < STRUM.minPxMs) return;
      for (let k = 0; k < count; k++) {
        if (!on[k]) continue;
        const c = xc[k], h = hw[k];
        if (Math.min(ox, x) > c + h || Math.max(ox, x) < c - h) continue;   // the stroke did not pass the column's band
        const f = Math.max(0, Math.min(1, (c - ox) / dx));
        const yc = oy + (y - oy) * f;
        if (yc < y0[k] - STRUM.slackPx || yc > y1[k] + STRUM.slackPx) continue;
        if (t - last[k] < STRUM.debounceMs) continue;
        last[k] = t;
        hooks.onPluck(k, dx > 0 ? 1 : -1, v);
        api.checkChord(t);
      }
    },
    /** Phone (or any) pluck that did not come from a crossing (e.g. a swipe across off-screen columns). */
    pluck(k, dir, t) {
      if (t - last[k] < STRUM.debounceMs) return;
      last[k] = t;
      hooks.onPluck(k, dir, 1);
      api.checkChord(t);
    },
    checkChord(t) {
      if (count < 1) return;
      let oldest = Infinity;
      for (let k = 0; k < count; k++) if (last[k] < oldest) oldest = last[k];
      if (t - oldest <= STRUM.chordMs) {
        for (let k = 0; k < count; k++) last[k] = -1e9;
        last.fill(-1e9);
        hooks.onChord();
      }
    },
    reset() { px = NaN; py = NaN; pt = 0; last.fill(-1e9); },
    lift() { px = NaN; },
  };
  return api;
}
