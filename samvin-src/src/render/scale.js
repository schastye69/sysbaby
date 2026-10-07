// render/scale.js — the scale engine (ARCH §3.3.2, SPEC §7.1 "Large scales").
//
// The root transform is (s, Q): render = Q + canonical·s (root.scale = s, root.position = Q). Identity: s = 1, Q = 0.
// The camera always lives in render space (never a child of the root). Only the director (DIVE, RECALL, retargets) and
// WP4 (PULL, DESCENT) write; everyone else reads.
//
// rebase(kind) is the swap frame: 'grow' at s = 1000 (DIVE, DESCENT), 'shrink' at s = 0.001 (RECALL) or at s = 1 with
// the camera 12 km out (PULL). With f = 1000 | 0.001, k = f / s, T = Q it maps x → k·(x − T) for the camera and the rig
// pose, resets s = 1, Q = 0, shifts the nest one level (nest.shift), snaps the Key (ctx.key.onRebase) and emits
// 'scale:rebase' {kind, k, T}. Because the canonical world already holds the Key AND every hall, the frame before and
// after the swap is identical; unrebase(rec) is the exact inverse (scrubbing back across a swap).
import { Group, Vector3 } from 'three';
import { U } from './uniforms.js';
import { bus } from '../core/bus.js';
import { rig } from './cameraRig.js';
import { nest } from '../world/nest.js';
import { CLIP } from '../core/tokens.js';

const _a = new Vector3();
let ctxRef = null;

function applyRoot() {
  const r = scaleEngine.root;
  if (r) { r.scale.setScalar(scaleEngine.s); r.position.copy(scaleEngine.Q); r.updateMatrix(); }
  U.uWorldScale.value = scaleEngine.s;
}

function mapCamera(fn) {
  const cam = rig.camera;
  if (cam) fn(cam.position);
  if (rig.pose) { fn(rig.pose.pos); fn(rig.pose.target); }
  rig.remapHistory(fn);
  if (scaleEngine.focus) fn(scaleEngine.focus);
}

export const scaleEngine = {
  /** Group, child of the scene; every canonical object hangs below it. */
  root: null,
  s: 1,
  /** render position of the canonical origin */
  Q: new Vector3(),
  /** PULL/DESCENT nesting (session); DIVE/RECALL never change it */
  n: 0,
  /** render-space near/far reference, written by the rig every frame */
  focus: new Vector3(),

  /** scene: the renderer's Scene; ctx (WP0 addition, optional): AppCtx, for ctx.key.onRebase. */
  init(scene, ctx) {
    if (ctx) ctxRef = ctx;
    if (!scaleEngine.root) {
      scaleEngine.root = new Group();
      scaleEngine.root.name = 'scaleRoot';
      scaleEngine.root.matrixAutoUpdate = false;
    }
    if (scene && scaleEngine.root.parent !== scene) scene.add(scaleEngine.root);
    applyRoot();
    return scaleEngine;
  },

  /** Raw write. */
  set(s, Q) {
    scaleEngine.s = s;
    if (Q) scaleEngine.Q.copy(Q);
    applyRoot();
  },

  /** Sets scale s while the canonical point `pivot` keeps its CURRENT render position: Q ← (Q + pivot·s_old) − pivot·s. */
  scaleAbout(s, pivot) {
    const so = scaleEngine.s;
    if (s === so) return;
    scaleEngine.Q.x += pivot.x * (so - s);
    scaleEngine.Q.y += pivot.y * (so - s);
    scaleEngine.Q.z += pivot.z * (so - s);
    scaleEngine.s = s;
    applyRoot();
  },

  /** The canonical point invariant under the current transform: Q / (1 − s) (origin when s = 1). */
  fixedPoint(out) {
    const d = 1 - scaleEngine.s;
    if (Math.abs(d) < 1e-9) return out.set(0, 0, 0);
    return out.copy(scaleEngine.Q).multiplyScalar(1 / d);
  },

  logLerp(s0, s1, t) { return Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * t); },

  toRender(v, out) { return out.copy(v).multiplyScalar(scaleEngine.s).add(scaleEngine.Q); },
  toCanonical(v, out) { return out.copy(v).sub(scaleEngine.Q).multiplyScalar(1 / scaleEngine.s); },

  /** → RebaseRecord { kind, k, T, s, Q } */
  rebase(kind) {
    const f = kind === 'grow' ? 1000 : 0.001;
    const rec = { kind, k: f / scaleEngine.s, T: scaleEngine.Q.clone(), s: scaleEngine.s, Q: scaleEngine.Q.clone() };
    mapCamera((v) => scaleEngine.mapPoint(v, rec, v));
    scaleEngine.s = 1;
    scaleEngine.Q.set(0, 0, 0);
    applyRoot();
    nest.shift(kind);
    const key = ctxRef && ctxRef.key;
    if (key && typeof key.onRebase === 'function') key.onRebase(kind);
    bus.emit('scale:rebase', { kind, k: rec.k, T: rec.T });
    return rec;
  },

  /** Exact inverse of rebase(rec): x → x / k + T, restores s, Q, shifts the nest back. */
  unrebase(rec) {
    mapCamera((v) => v.multiplyScalar(1 / rec.k).add(rec.T));
    scaleEngine.s = rec.s;
    scaleEngine.Q.copy(rec.Q);
    applyRoot();
    nest.shift(rec.kind === 'grow' ? 'shrink' : 'grow');
  },

  /** out = rec.k·(v − rec.T) */
  mapPoint(v, rec, out) { return out.copy(v).sub(rec.T).multiplyScalar(rec.k); },

  /** Near/far refit (rig, ORDER.CAMERA): d = |camera − focus|; near = 0.002·d; far = 400·d. */
  fitClip(camera) {
    const d = Math.max(1e-5, _a.copy(camera.position).sub(scaleEngine.focus).length());
    camera.near = CLIP.near * d;
    camera.far = CLIP.far * d;
  },
};
