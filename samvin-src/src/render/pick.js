// render/pick.js — screen-space picking helpers (ARCH §2.3, §3.4). CSS px in, no layout reads (layout.w/h).
import { Raycaster, Vector3 } from 'three';
import { rig } from './cameraRig.js';
import { layout } from '../core/layout.js';

const caster = new Raycaster();
const hits = [];
const _p = { x: 0, y: 0, depth: 0, visible: false };
const _v = new Vector3();

/** CSS px → NDC (Vector2-like out). */
export function ndc(x, y, out) {
  out.x = (x / Math.max(1, layout.w)) * 2 - 1;
  out.y = -(y / Math.max(1, layout.h)) * 2 + 1;
  return out;
}

/** Nearest intersection of the screen ray with `objects` (recursive) → Intersection | null (copied into out if given). */
export function pickScreen(x, y, objects, out) {
  if (!rig.camera || !objects || !objects.length) return null;
  rig.ray(x, y, caster.ray);
  caster.near = rig.camera.near;
  caster.far = rig.camera.far;
  caster.layers.mask = 0xffffffff;
  hits.length = 0;
  caster.intersectObjects(objects, true, hits);
  let best = null;
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    if (!visibleChain(h.object)) continue;
    best = h; break;                                   // hits are sorted by distance
  }
  hits.length = 0;
  if (!best) return null;
  if (out) { Object.assign(out, best); return out; }
  return best;
}

function visibleChain(o) {
  for (let n = o; n; n = n.parent) if (!n.visible) return false;
  return true;
}

/** Render-space Vector3 → out2 {x, y} CSS px; returns true when in front of the camera and inside the viewport. */
export function project(v3, out2) {
  rig.project(_v.copy(v3), _p);
  out2.x = _p.x; out2.y = _p.y;
  return _p.visible;
}
