// fx/ears.js — «УШИ» and «ПРОВАЛ» (SPEC-ADDENDUM A2.8, A6.5.6; ARCH-ADDENDUM X§5.1). OWNER: WP12.
// Tab return («вот ты где.»): ears blocked at 350 Hz on the visible frame, pop over 900 ms with its popClick; the picture
// twin on the same span — fog ×1.5 → ×1 and the aperture 4 → 0 px at the current focus distance (kept under reduced
// motion), a 1 px edge-string twitch on the popClick frame. DESCENT: muffle follows s (20 kHz·(400/20 kHz)^s), pop(700)
// at the swap. ПРОВАЛ: the bed drops out for one word (duck −80 dB in 12 ms, back in 40 ms at the end), the dust stays;
// twin: grain frozen + breath held for exactly that span. ≤ 1 ПРОВАЛ per 60 s.
import { audio } from '../audio/engine.js';
import { breath, after } from '../core/clock.js';
import { rig } from '../render/cameraRig.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { perf } from './cue.js';

export function createEars(F) {
  const { ctx } = F;
  let lastProval = -1e9;
  const ears = {
    tabReturn() {
      const now = perf();
      if (audio.fx.ready()) { audio.fx.muffle(350, 0); }
      const pc = audio.fx.ready() ? audio.fx.pop(900) : null;
      const at = pc != null ? audio.fx.toPerf(pc) : now + 900;
      F.fogFactor('ears', 1.5);
      F.fogFactor('ears', 1, 900);
      const fd = rig.camera ? rig.camera.position.distanceTo(rig.pose.target) : 7.2;
      if (!F.t0) F.focus.rack({ focalM: fd, focalFrom: fd, from: 4, apertPx: 0, ms: 900, force: true });
      F.twin('ears', { blurPx: 2, ms: 900 });
      F.cue.at(Number.isFinite(at) ? at : now + 900, { id: 'popClick', visual: () => { if (ctx.edges) ctx.edges.twitch(1); } });
    },
    descent(s01) {
      const s = Math.max(0, Math.min(1, +s01 || 0));
      audio.fx.muffle(20000 * Math.pow(400 / 20000, s), 0);
    },
    /** ms: the perf time of the swap frame (a small value is read as a delay from now) */
    popAt(ms) {
      const v = +ms || 0;
      const at = v >= perf() - 2000 ? v : perf() + v;
      if (audio.fx.ready()) audio.fx.pop(700, { at: Math.max(audio.now(), audio.fx.ctxTimeFor(at)) });
    },
  };
  bus.on('visibility', ({ hidden }) => { if (!hidden && !app.booting && app.phase !== 'start') ears.tabReturn(); });

  /** ПРОВАЛ for one word: → Promise (resolves at the end of the span) */
  function provalFor(ms) {
    const d = Math.max(0, +ms || 0);
    const now = perf();
    if (now - lastProval < 60000) return new Promise((r) => after(d, r));
    lastProval = now;
    const bed = audio.bed;
    if (bed && audio.fx.ready()) bed.duck(-80, 12);
    F.freeze(true, 'proval');
    breath.hold(true);
    return new Promise((r) => after(d, () => {
      F.freeze(false, 'proval');
      breath.hold(false);
      after(60, () => { if (audio.bed && audio.fx.ready()) audio.bed.duck(0, 40); });
      r();
    }));
  }
  return { ears, provalFor };
}
