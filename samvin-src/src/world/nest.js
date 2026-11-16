// world/nest.js — the nest levels of the one continuous world (ARCH §3.3.1, SPEC §3.8, §3.10).
//
//   j = −1  mini Key: static structure ×0.001 + mini nucleus glow, inside the nucleus; visible only when the camera is
//           within 0.05 m (canonical) of the origin, or while fade(−1) > 0.
//   j =  0  the Key (WP1's animated Key: main attaches ctx.key.group to level(0)); always resident.
//   j =  1  VIN: static structure ×1000 with hall LOD (its strata are the hall walls; R1 lattice from inside, 50 %
//           density on T1), lit-node emitters (1.2 m), level glow.
//   j =  2  parent VIN ×10⁶: only while fade(2) > 0 (DIVE, PULL, ZENITH far view).
// Level glow rule (SPEC §3.8): a level's nucleus glow draws only when the camera is farther than 1.5 × that level's
// height (2.4·1000^j·1.5 canonical m). Each level group is canonical-space, scale 1000^j, child of scaleEngine.root.
// Hall LOD of level 0 (PERF-11): the Key's parts are drawn with frustumCulled = false (their vertices move in the
// shader), so seen from a hall it cost ~11 main-pass + 3 emissive-pass calls while it lay outside the view or deep in the
// fog. Each frame, after the camera is posed, the Key group is hidden while a sphere round everything it can draw (the
// unfolded strata, the ember axis extensions, the haze) is outside the view frustum or lies where the fog leaves less
// than 1/800 of it (exp²: density · distance > 2.6). Purely geometric, so it holds in every room and phase (a travel
// toward CORE brings the Key back the frame it can be seen).
// shift(kind) (called only by scaleEngine.rebase/unrebase) moves the level fades one level up ('grow') or down
// ('shrink') and remembers what fell off the end, so shift('grow') then shift('shrink') is an exact identity.
import { Group, Vector3, Frustum, Matrix4, Sphere } from 'three';
import { scaleEngine } from '../render/scale.js';
import { rig } from '../render/cameraRig.js';
import { buildStructure } from './structure.js';
import { createEmitter } from '../render/glow.js';
import { createLitNodes } from '../key/litNodes.js';
import { ROOMS } from './rooms.js';
import { bus } from '../core/bus.js';
import { loop, ORDER } from '../core/loop.js';
import { quality, TIER_PARAMS } from '../core/quality.js';
import { state } from '../core/state.js';
import { NUCLEUS, LEVEL_GLOW_FACTOR, PROFILE, DESCENT } from '../core/tokens.js';
import { U } from '../render/uniforms.js';

const LEVELS = [-1, 0, 1, 2];
const groups = new Map();
const structures = new Map();
const glows = new Map();
const glowList = [];        // [{ j, e }] for the allocation-free frame loop
const lit = new Map();
const fades = new Map([[-1, 0], [0, 1], [1, 1], [2, 0]]);
const dropped = { grow: [], shrink: [] };   // values pushed off either end by shift()
const _c = new Vector3();
let ctxRef = null;
let lodStratum = -1;
const KEY_REACH = 6;        // Key metres: axis tips 1.2 + extension 3.2; haze 3.8 tall, 1.6 behind; unfold ring 3.1
const FOG_GONE = 2.6;       // exp(−2.6²) < 1/800
const _frustum = new Frustum(), _pv = new Matrix4(), _sphere = new Sphere(), _cw = new Vector3();
let keyCulled = false;

function applyFade(j) {
  const a = fades.get(j);
  const s = structures.get(j);
  if (s) s.setFade(j === -1 && miniNear ? 1 : a);     // the mini Key shows whenever the camera is inside the nucleus
  const g = groups.get(j);
  if (g && j !== 0) g.visible = a > 0 || (j === -1 && miniNear);
  if (j === 0 && ctxRef && ctxRef.key && ctxRef.key.group) ctxRef.key.group.visible = a > 0 && !keyCulled;
}

/** ORDER.RENDER − 1 (after the camera rig): the level-0 hall LOD (see the header). */
function keyLod() {
  const g = ctxRef && ctxRef.key && ctxRef.key.group, cam = rig.camera;
  if (!g || !cam) return;
  let cull = false;
  if (fades.get(0) > 0) {
    g.updateWorldMatrix(true, false);
    const e = g.matrixWorld.elements;
    _sphere.center.set(e[12], e[13], e[14]);
    _sphere.radius = KEY_REACH * Math.hypot(e[0], e[1], e[2]);
    const gap = _sphere.center.distanceTo(_cw.setFromMatrixPosition(cam.matrixWorld)) - _sphere.radius;
    if (gap > 0) {
      if (U.uFogDensity.value * gap > FOG_GONE) cull = true;
      else {
        _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
        cull = !_frustum.setFromProjectionMatrix(_pv).intersectsSphere(_sphere);
      }
    }
  }
  if (cull !== keyCulled) { keyCulled = cull; applyFade(0); }
}
let miniNear = false;

export const nest = {
  init(ctx) {
    ctxRef = ctx;
    const root = scaleEngine.root;
    for (const j of LEVELS) {
      const g = new Group();
      g.name = `nest:${j}`;
      g.scale.setScalar(Math.pow(1000, j));
      root.add(g);
      groups.set(j, g);
    }
    const density = (quality.params || TIER_PARAMS.T2).lattice;
    // VIN (level 1) and parent VIN (level 2): merged static structures.
    for (const j of [1, 2]) {
      const s = buildStructure({ perStratum: false, latticeDensity: j === 1 ? density : 0.5, hallLod: j === 1, far: ROOMS.CORE.far });
      groups.get(j).add(s.group);
      structures.set(j, s);
      const ln = createLitNodes({ scale: Math.pow(1000, j) });
      ln.setCount(state.litNodes);
      groups.get(j).add(ln.object);
      lit.set(j, ln);
    }
    // Mini Key (level −1): solid + edges only.
    const mini = buildStructure({ perStratum: false, lattice: false, far: 1 });
    groups.get(-1).add(mini.group);
    structures.set(-1, mini);
    // Level nucleus glows (−1, 1, 2), drawn through everything (like the Key's), subject to the level glow rule.
    for (const j of [-1, 1, 2]) {
      const e = createEmitter({ color: 'ember', radius: NUCLEUS.glowR, intensity: 1, depthTest: false, night: true, fog: false });
      groups.get(j).add(e.object);
      glows.set(j, e);
      glowList.push({ j, e, g: groups.get(j), h: PROFILE.H * Math.pow(1000, j) });
    }
    for (const j of LEVELS) applyFade(j);
    loop.add(nest.update, ORDER.WORLD);
    loop.add(keyLod, ORDER.RENDER - 1);
    bus.on('room:arrive', ({ room }) => {
      const far = (ROOMS[room] || ROOMS.CORE).far;
      for (const j of [1, 2]) structures.get(j).setFar(far);
    });
    bus.on('tier:change', ({ tier }) => {
      const p = TIER_PARAMS[tier];
      if (p) structures.get(1).setLatticeDensity(p.lattice);
    });
    bus.on('night:change', ({ night }) => { for (const l of lit.values()) l.setNight(night); });
    return nest;
  },

  /** → Group (canonical space; scale 1000^j; child of scaleEngine.root) */
  level(j) { return groups.get(j) || null; },
  /** → Structure (−1 | 1 | 2) */
  structure(j) { return structures.get(j) || null; },
  /** PERF-11: true while the hall LOD hides the Key (outside the view or lost in the fog). */
  keyCulled() { return keyCulled; },
  /** WP0 addition: the lit-node set of level 1 | 2. */
  litNodes(j) { return lit.get(j) || null; },

  fade(j) { return fades.has(j) ? fades.get(j) : 0; },
  setFade(j, a) {
    if (!fades.has(j)) return;
    const v = Math.max(0, Math.min(1, a));
    if (v === fades.get(j)) return;
    fades.set(j, v);
    applyFade(j);
  },

  /** Level 1: hides the caps of that room's stratum (its interior shell belongs to the hall). null = none. */
  setHallLod(roomId) {
    const r = roomId ? ROOMS[roomId] : null;
    lodStratum = r && r.stratum >= 0 ? r.stratum : -1;
    const s = structures.get(1);
    if (s) s.setHideCaps(lodStratum);
  },

  /** Called only by scaleEngine.rebase()/unrebase(). */
  shift(kind) {
    const f = LEVELS.map((j) => fades.get(j));
    if (kind === 'grow') {
      dropped.grow.push(f[3]);
      const inMini = dropped.shrink.length ? dropped.shrink.pop() : 0;
      fades.set(2, f[2]); fades.set(1, f[1]); fades.set(0, f[0]); fades.set(-1, inMini);
    } else {
      dropped.shrink.push(f[0]);
      const inParent = dropped.grow.length ? dropped.grow.pop() : 0;
      fades.set(-1, f[1]); fades.set(0, f[2]); fades.set(1, f[3]); fades.set(2, inParent);
    }
    if (dropped.grow.length > 8) dropped.grow.shift();
    if (dropped.shrink.length > 8) dropped.shrink.shift();
    for (const j of LEVELS) applyFade(j);
  },

  /** ORDER.WORLD: mini-Key visibility and the level glow rule. */
  update() {
    const cam = rig.camera;
    if (!cam) return;
    const s = scaleEngine.s;
    const d = _c.copy(cam.position).sub(scaleEngine.Q).length() / s;     // canonical distance to the origin
    const near = d < DESCENT.miniKeyBelow;
    if (near !== miniNear) { miniNear = near; applyFade(-1); }
    for (let k = 0; k < glowList.length; k++) {
      const { j, e, g, h } = glowList[k];
      const on = (j === -1 ? (miniNear || fades.get(-1) > 0) : fades.get(j) > 0) && d > h * LEVEL_GLOW_FACTOR;
      e.object.visible = on && g.visible !== false;
    }
  },
};
