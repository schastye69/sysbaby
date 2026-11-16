// fx/pieces/nadir.js — «ИСТОК», the unsealing FX (SPEC-ADDENDUM A2.5; X§2.5.9, X§2.4.7). OWNER: WP12.
// Called by WP0 secrets on the 5th landing: ПАУЗА 120–520 (the shard bell choked by the gate); on the hit ПРОСВЕТ, a
// «защёлка» gen 2 at centre + a 48 Hz sine thud (160 ms, −14 dB: the crack), both sample-exact on the hit, and a wave
// from canonical (0, −1,090, 0) climbing the axis at 343 m/s (axis mode: every bead lights --white for 400 ms as the
// front passes — one bead per 73 ms; reduced motion: all beads at once for 400 ms, no travelling order). The boom
// arrives at his altitude: farBoom { dist: alt + 1,090 } audible at hit + 1000·(alt + 1,090)/343 — light first,
// thunder later. Resolves on the hit; the stage stays 'nadir' through the N crack (hit + 2,800).
import { Vector3 } from 'three';
import { audio } from '../../audio/engine.js';
import { after } from '../../core/clock.js';
import { SPEED_OF_SOUND, perf } from '../cue.js';

const HOLD_MS = 2800;

export function createNadir(F) {
  return function nadirUnseal() {
    return new Promise((resolve) => {
      let hit = null;
      const done = (t) => { if (hit == null) hit = t; resolve({ hitAt: hit }); };
      F.stage.run('nadir', () => {
        // The crack (latch gen 2 + the 48 Hz thud) is PLANNED on the cue clock for the hit, so it is sample-exact on it
        // (scheduled ahead, like every planned cue); an input-advanced hit (or a capped pause) plays it at once instead.
        const at = perf() + 120;
        let sounded = false;
        const crack = (T) => {
          sounded = true;
          audio.play('latch', { gen: 2, when: T });
          audio.play('subDrop', { ms: 160, from: 48, to: 48, gainDb: -14, when: T });
        };
        const plan = F.cue.at(at + 400, { id: 'nadirCrack', audio: crack });
        return F.impact.pause({
          kind: 'nadir', at, prosvet: true,
          onHit: (hitAt) => {
            if (!sounded) {
              plan.cancel();
              F.cue.now({ audio: () => crack(Math.max(audio.now(), audio.fx.ctxTimeFor(hitAt) || 0)) });
            }
            F.wave.fire({ origin: new Vector3(0, -1090, 0), mode: 'axis', maxDist: 2700 });
            const alt = F.ctx.director ? F.ctx.director.altitude() : 0;
            const dist = Math.max(1, alt + 1090);
            F.cue.at(hitAt + (1000 * dist) / SPEED_OF_SOUND, { id: 'farBoom', audio: (T) => audio.play('farBoom', { dist, when: T }) });
            done(hitAt);
          },
        }).then((r) => {
          done(r.hitAt);
          return new Promise((res) => after(Math.max(0, hit + HOLD_MS - perf()), res));
        });
      }).then(() => done(perf()));
    });
  };
}
