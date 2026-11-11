// halls/members/payoffs.js — the timed column choreographies of MEMBERS:
//   • S04 АККОРД as a curtain call led by him (A5.2, amends SPEC §8.1): all member notes together; his column bows
//     10° forward (toward the camera, pivot at the base, 600 ms), every other column 240 ms later; the clan holds the
//     bow 1,600 ms and returns over 900 ms; each capital flashes --white as its column starts to bow; the motto
//     BEAM WRITES on the datum. Reduced motion: no bow, the capitals flash in the same order.
//   • the glyph melody of a focused member (SPEC §6.2): each glyph edge a note, 120 ms apart (twin: a capital flash).
//   • the motion hints (SPEC §8.3, A4.2): S04 a ghost dot sweeps all columns in 1,000 ms; S06 his dotted grid flashes
//     twice; 'sbor' a 2 px --silver ghost ring fills around his capital over 1,200 ms and fades.
// Everything is evaluated from a start time in update(now) — pure in time, allocation-free per frame.
import { EASE } from '../../core/ease.js';
import { glyphNotes } from '../../core/glyph.js';

const DEG = Math.PI / 180;
export const BOW = Object.freeze({ deg: 10, inMs: 600, lagMs: 240, holdMs: 1600, outMs: 900 });

/** Bow angle (rad) of a column whose bow starts at s (ms after the chord), at time t after the chord. */
export function bowAt(t, s) {
  const x = t - s;
  if (x <= 0) return 0;
  const A = BOW.deg * DEG;
  if (x < BOW.inMs) return A * EASE.camera(x / BOW.inMs);
  const y = x - BOW.inMs - BOW.holdMs;
  if (y <= 0) return A;
  if (y < BOW.outMs) return A * (1 - EASE.camera(y / BOW.outMs));
  return 0;
}

export function createPayoffs(p) {
  // p: { columns, op, audio, now(), reduced(), hzOf(member), flashCap(c, ms), beam(), layer, screenOf(c, which, out) }
  const chord = { t0: -1, flashed: null };
  const melody = { t0: -1, notes: [], i: 0, c: null };
  const hint = { kind: null, t0: 0 };
  const _s = { x: 0, y: 0 };

  return {
    get chordActive() { return chord.t0 >= 0; },
    chord() {
      const now = p.now();
      chord.t0 = now;
      chord.flashed = new Uint8Array(p.columns.list.length);
      if (p.audio) p.audio.play('chord', { hz: p.columns.list.map((c) => p.hzOf(c.member)) });
      p.beam();
    },
    melody(c, edges) {
      melody.notes = glyphNotes(edges || []);
      melody.t0 = p.now() + 240; melody.i = 0; melody.c = c;
    },
    stopMelody() { melody.t0 = -1; melody.notes = []; },
    hint(kind) { hint.kind = kind; hint.t0 = p.now(); },
    /** Per frame. */
    update(now) {
      const cols = p.columns.list;
      // curtain call
      if (chord.t0 >= 0) {
        const t = now - chord.t0;
        let any = false;
        for (let i = 0; i < cols.length; i++) {
          const c = cols[i];
          const s = c.op ? 0 : (p.columns.op ? BOW.lagMs : 0);
          if (t >= s && !chord.flashed[i]) { chord.flashed[i] = 1; p.flashCap(c, 240); }
          c.bow = p.reduced() ? 0 : bowAt(t, s);
          if (t < s + BOW.inMs + BOW.holdMs + BOW.outMs) any = true;
        }
        if (!any) { chord.t0 = -1; for (let i = 0; i < cols.length; i++) cols[i].bow = 0; }
      }
      // glyph melody
      if (melody.t0 >= 0 && melody.i < melody.notes.length && now >= melody.t0 + 120 * melody.i) {
        const hz = melody.notes[melody.i];
        if (p.audio) p.audio.play('workshopNode', { hz });
        if (melody.c) p.flashCap(melody.c, 90, 0.12);
        melody.i++;
        if (melody.i >= melody.notes.length) melody.t0 = -1;
      }
      // hints
      const L = p.layer;
      if (hint.kind) {
        const t = now - hint.t0;
        if (hint.kind === 'S04') {
          const u = t / 1000;
          if (u >= 1 || cols.length < 1) { L.dot(0, 0, false); hint.kind = null; }
          else {
            // sweep across all columns at mid-height, left → right on screen
            const f = u * (cols.length - 1), i = Math.min(cols.length - 2, Math.floor(f));
            const a = cols[Math.max(0, i)], b = cols[Math.min(cols.length - 1, i + 1)];
            p.screenOf(a, 'mid', _s); const ax = _s.x, ay = _s.y;
            p.screenOf(b, 'mid', _s);
            const w = cols.length > 1 ? f - i : 0;
            L.dot(ax + (_s.x - ax) * w, ay + (_s.y - ay) * w, true, Math.min(1, u * 6, (1 - u) * 6));
          }
        } else if (hint.kind === 'S06') {
          // his dotted grid flashes twice (2 × 260 ms on, 160 ms apart); with a glyph already cut: the capital flashes
          const k = Math.floor(t / 420), ph = t - k * 420;
          const on = k < 2 && ph < 260;
          if (p.columns.op) {
            if (p.columns.dotsShown()) p.columns.dotsFlash(on);
            else if (on && ph < 20) p.flashCap(p.columns.op, 200, 0.5);
          }
          if (t > 900) { hint.kind = null; p.columns.dotsFlash(false); }
        } else if (hint.kind === 'sbor') {
          const op = p.columns.op;
          if (!op || t > 1600) { L.ghost(0, 0, 0, 0); hint.kind = null; }
          else {
            p.screenOf(op, 'cap', _s);
            const fill = Math.min(1, t / 1200), a = t <= 1200 ? 1 : 1 - (t - 1200) / 400;
            L.ghost(_s.x, _s.y, fill, a);
          }
        }
      }
    },
    /** QA: the forward tilt of each column (deg), arc order. */
    tilts() { return p.columns.list.map((c) => Math.round((c.bow / DEG) * 100) / 100); },
  };
}
