// halls/lazyHall.js — a hall whose code is a feature chunk (core/chunk.js; build.mjs §3c'). The factory the hall host
// calls returns a stand-in at once: build() is the chunk's arrival (then the real factory and its build()). Until the
// real hall exists, the lifecycle calls (enter, exit, arrive, depart, setSub, resize) are recorded and replayed to it in
// order once it is built, so an arrival that beat the chunk (a deep link, a reduced-motion cut) lands exactly as it
// would have; the questions (pose, entryPath, onGesture, onKey, lostSpots) answer "nothing" meanwhile, which the host
// and the director read as the SPEC defaults. The chunk is prefetched long before the hall can be reached (registry.js).
const REPLAY = ['enter', 'exit', 'arrive', 'depart', 'setSub', 'resize'];
const ASK = ['pose', 'entryPath', 'update', 'onGesture', 'onKey', 'lostSpots'];

/** load: () => Promise<factory>; ready: () => factory | null (the chunk is already here: the real hall, no stand-in).
 *  → a hall factory (hctx) → Hall */
export function lazyHall(load, ready) {
  return (hctx) => {
    const f = ready();
    if (f) return f(hctx);
    let inner = null, dead = false;
    const queue = [];
    const hall = {
      id: hctx.id,
      build() {
        return load().then((factory) => {
          if (dead) return undefined;
          const real = factory(hctx);
          const done = real.build();
          const replay = () => {
            if (dead) return;
            inner = real;
            for (const [m, args] of queue) if (typeof real[m] === 'function') real[m](...args);
            queue.length = 0;
          };
          if (done && typeof done.then === 'function') return done.then(replay);
          replay();
          return undefined;
        });
      },
      dispose() { dead = true; queue.length = 0; if (inner) inner.dispose(); },
    };
    for (const m of REPLAY) hall[m] = (...a) => { if (inner) return typeof inner[m] === 'function' ? inner[m](...a) : undefined; const last = queue[queue.length - 1]; if (last && last[0] === m) last[1] = a; else queue.push([m, a]); return m === 'setSub' ? 0 : undefined; };
    for (const m of ASK) hall[m] = (...a) => (inner && typeof inner[m] === 'function' ? inner[m](...a) : undefined);
    return hall;
  };
}
