// fx/pieces/owner.js — «ВЛАДЕЛЕЦ», the FX part of S05's first recognition (SPEC-ADDENDUM A2.4.1; X§2.5.9). OWNER: WP12.
// t₀ = the call (recognition). ПАУЗА 120–520 (kind 's05'), on the hit ПРОСВЕТ and ВОЛНА — from the nucleus in CORE (the rim
// steps and the name re-burns at hit + 875 ms, the echo `farEcho` audible at hit + 1,750), or in any other hall an axis
// wave from the camera's altitude (the axis beads light --white one by one outward as the front passes, one per 73 ms).
// Resolves on the hit with the times WP10 sequences the bow, the electrum flash, the LEADs, the letters and the rim
// re-burn on; the stage stays 's05' until the S05 shard leaves (t₀ + 3,620 = hit + 3,100: the electrum has cooled), so no
// other set-piece can land on its slots. Reduced motion: no displacement (the wave writes mode 0), everything else kept.
import { Vector3 } from 'three';
import { app } from '../../core/store.js';
import { after } from '../../core/clock.js';
import { perf } from '../cue.js';

const HOLD_MS = 3100;

export function createOwner(F) {
  return function owner(opts) {
    const room = (opts && opts.room) || app.room;
    const core = room === 'CORE';
    return new Promise((resolve) => {
      let out = null;
      const done = (r) => { if (!out) out = r; resolve(out); };
      F.stage.run('s05', (h) => {
        if (h.reduced) { done({ hitAt: perf(), rimAt: null, echoAt: null }); return undefined; }
        return F.impact.pause({
          kind: 's05', at: perf() + 120, prosvet: true,
          onHit: (hitAt) => {
            const alt = F.ctx.director ? F.ctx.director.altitude() : 0;
            const w = core ? F.wave.fire({ origin: new Vector3(0, 0, 0), echo: { dist: 300 } })
              : F.wave.fire({ origin: new Vector3(0, alt, 0), mode: 'axis', maxDist: 2600 });
            done({ hitAt, rimAt: core ? (w ? w.arrival(300) : hitAt + 875) : null, echoAt: core ? hitAt + 1750 : null });
          },
        }).then((r) => {
          if (!out) done({ hitAt: r.hitAt, rimAt: core ? r.hitAt + 875 : null, echoAt: core ? r.hitAt + 1750 : null });
          return new Promise((res) => after(Math.max(0, out.hitAt + HOLD_MS - perf()), res));
        });
      }).then(() => { if (!out) done({ hitAt: perf(), rimAt: null, echoAt: null }); });
    });
  };
}
