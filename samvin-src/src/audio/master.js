// audio/master.js — the master insert chain (ARCH-ADDENDUM X§2.3.3; SPEC-ADDENDUM A6.1). OWNER: WP3.
// WP0 SEED (hook H8): a pass-through (compressor → master) with safe no-op fx methods. WP3 replaces the internals with
// SHADOW ∥ dry → MUFFLE → TAPE → WIDTH → GATE (A6.1 binding), keeping this signature and the Chain shape.

/** @typedef {Object} Chain
 * @property {Object} fx           // the audio.fx methods of X§2.3.2 marked "forwarded"
 * @property {AudioNode} postGate  // the node the engine's analyser should follow (the GATE); the seed returns `output`
 * @property {() => void} dispose
 */

/** @returns {Chain} */
export function createMasterChain(E, input /* the compressor */, output /* the master gain */) {
  void E;
  input.connect(output);
  return {
    fx: {
      gate: (ms = 400, { at } = {}) => ({ hitAt: (at != null ? at : 0) + ms / 1000 }),
      advanceHit: (at) => at,
      muffle() {},
      pop() { return null; },
      width() {},
      tape() {},
      tapeReset() {},
      shadow() {},
      snapshot: () => ({ gateLog: [], muffleHz: 20000, width: 1, buffersReady: false }),
    },
    postGate: output,
    dispose() { try { input.disconnect(output); } catch (e) { /* already gone */ } },
  };
}
