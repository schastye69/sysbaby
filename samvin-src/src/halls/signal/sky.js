// halls/signal/sky.js — WP8: the 3D of SIGNAL «СВЯЗЬ» (SPEC §6.5 Space, §7.4 «Голос», §12.2 stars per tier).
//
// Inside stratum S the triangular deck funnels 110 m up into a round 12 m opening: two twisted families of hairline
// generators (a ruled spire whose contours morph from the deck's triangle to the opening's circle), three ridge struts,
// contour rings every 10 m, a machined double rim with 72 ticks round the opening, the axis rising through it as the
// mast (ember, three yards, three stays) with the 6 px ember beacon at its tip, the two rails of the listening gallery
// 12.5 m above the deck, and beyond the opening the sky: 2,000 / 800 stars on a 3 km sphere (LAYER.NOFOG), plus the
// remembered drawings as stars just above the opening.
//
// «Голос» (SPEC §7.4): every line of the hall lives in a frame whose local y is the normal of the plane through the
// rest camera's eye that projects onto the pad's lower tangent row; createLines' flatten (y' = mix(y, 0, u)) therefore
// collapses the whole spire into ONE luminous horizontal trace on screen, and un-flattening raises it back. The shell
// (rings, deck, irises) flattens onto the true horizon (the eye height), i.e. sinks out of the upward view.
import { Group, Matrix4, Vector3 } from 'three';
import { createLines } from '../../render/lines.js';
import { createPoints } from '../../render/points.js';
import { createEmitter } from '../../render/glow.js';
import { LAYER } from '../../render/uniforms.js';
import { mulberry32 } from '../../core/rng.js';
import { APEX_H, OPEN_R, MAST_TOP, RAIL_Y, RAIL_D, RAIL_P, triPoint, project, traceNormal, basis } from './geom.js';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const DECK_R = 74;                 // the spire springs where stratum S's walls stand at deck height (VIN radius 74 m)
const FAM = 24;                    // generators per twisted family (8 per side)
const TWIST = 26 * DEG;            // each family turns 26° on its way up: the pinch around the opening
const STAR_R = 3000;
export const REMEMBERED_MAX = 7;
const MEM_SIZE = 1.5;              // remembered stars: 3 px (the field's uSize is 2 px)
const PEWTER_K = 0.5;              // pewter ≈ silver × 0.5 on the void (contours and rails ride in the silver batch)

// ─── Hall-local segment builders ─────────────────────────────────────────────────────────────────────────────
const _t = [0, 0];
/** Generator g of family sgn at height y (ruled line deck-triangle → opening-circle). */
function genPoint(g, sgn, y, out) {
  const s = g / FAM;
  triPoint(DECK_R, s, _t);
  const a = Math.atan2(_t[0], _t[1]) + sgn * TWIST;
  const k = y / APEX_H;
  out[0] = _t[0] + (Math.sin(a) * OPEN_R - _t[0]) * k;
  out[1] = y;
  out[2] = _t[1] + (Math.cos(a) * OPEN_R - _t[1]) * k;
  return out;
}

function buildSegments() {
  const silver = [], silverW = [], silverA = [];      // generators + ridges + stays
  const steel = [], steelA = [];                      // contours + rails
  const white = [], whiteA = [];                      // rim, ticks, yards
  const ember = [];                                   // the mast
  const p = [0, 0, 0], q = [0, 0, 0];
  // Two twisted families of generators, drawn in 8 slices each so their alpha can fall toward the deck.
  for (const sgn of [1, -1]) {
    for (let g = 0; g < FAM; g++) {
      for (let k = 0; k < 8; k++) {
        genPoint(g, sgn, (APEX_H * k) / 8, p); genPoint(g, sgn, (APEX_H * (k + 1)) / 8, q);
        silver.push(p[0], p[1], p[2], q[0], q[1], q[2]);
        { const t = (k + 0.5) / 8; silverW.push(1); silverA.push((0.03 + 0.55 * Math.pow(t, 1.5)) * (k === 7 ? 0.55 : 1)); }
      }
    }
  }
  // Three ridge struts: the deck triangle's vertices straight to the rim.
  for (let v = 0; v < 3; v++) {
    triPoint(DECK_R, v / 3, _t);
    const a = Math.atan2(_t[0], _t[1]);
    silver.push(_t[0], 0, _t[1], Math.sin(a) * OPEN_R, APEX_H, Math.cos(a) * OPEN_R);
    silverW.push(1.5); silverA.push(0.5);
  }
  // Three stays from the top yard down to the rim, 120° apart.
  for (let v = 0; v < 3; v++) {
    const a = v * (TAU / 3) + Math.PI;
    silver.push(0, MAST_TOP - 7, 0, Math.sin(a) * OPEN_R * 1.12, APEX_H + 0.4, Math.cos(a) * OPEN_R * 1.12);
    silverW.push(1); silverA.push(0.42);
  }
  // Contours every 10 m: the polygon through family +1 at that height (triangle at the deck → circle at the rim).
  for (let y = 10; y < APEX_H - 1; y += 10) {
    for (let g = 0; g < FAM; g++) {
      genPoint(g, 1, y, p); genPoint((g + 1) % FAM, 1, y, q);
      steel.push(p[0], p[1], p[2], q[0], q[1], q[2]);
      steelA.push(0.10 + 0.55 * Math.pow(y / APEX_H, 1.4));
    }
  }
  // The gallery: two triangular rails 12.5 m up (inradius 20 and 29.7), with a bolt tick every 3 m.
  for (const rin of [RAIL_D, RAIL_P]) {
    const R = rin * 2;                                   // circumradius of an equilateral triangle = 2 × inradius
    for (let j = 0; j < 3; j++) {
      triPoint(R, j / 3, _t); const ax = _t[0], az = _t[1];
      triPoint(R, (j + 1) / 3, _t); const bx = _t[0], bz = _t[1];
      steel.push(ax, RAIL_Y, az, bx, RAIL_Y, bz); steelA.push(1);
      const L = Math.hypot(bx - ax, bz - az), n = Math.floor(L / 3);
      for (let i = 1; i < n; i++) {
        const f = i / n, x = ax + (bx - ax) * f, z = az + (bz - az) * f;
        steel.push(x, RAIL_Y, z, x, RAIL_Y - 0.45, z); steelA.push(0.8);
      }
    }
  }
  // The opening: a machined double rim with 72 ticks (every 30° longer).
  const RS = 96;
  for (let i = 0; i < RS; i++) {
    const a0 = (TAU * i) / RS, a1 = (TAU * (i + 1)) / RS;
    white.push(Math.sin(a0) * OPEN_R, APEX_H, Math.cos(a0) * OPEN_R, Math.sin(a1) * OPEN_R, APEX_H, Math.cos(a1) * OPEN_R); whiteA.push(0.9);
    const r2 = OPEN_R * 1.14;
    white.push(Math.sin(a0) * r2, APEX_H + 0.5, Math.cos(a0) * r2, Math.sin(a1) * r2, APEX_H + 0.5, Math.cos(a1) * r2); whiteA.push(0.22);
    if (i % 8 === 0) {                                     // 12 register ticks between the two rims
      white.push(Math.sin(a0) * OPEN_R, APEX_H, Math.cos(a0) * OPEN_R, Math.sin(a0) * r2, APEX_H + 0.5, Math.cos(a0) * r2); whiteA.push(0.6);
    }
  }
  // Mast yards (crossed pairs), shrinking toward the tip.
  for (const [y, h] of [[APEX_H + 9, 3.0], [APEX_H + 17, 2.2], [MAST_TOP - 7, 1.4]]) {
    white.push(-h, y, 0, h, y, 0); whiteA.push(0.8);
    white.push(0, y, -h, 0, y, h); whiteA.push(0.8);
  }
  // The axis continues through the opening as the mast (ember, 2 px).
  ember.push(0, APEX_H - 6, 0, 0, MAST_TOP - 0.6, 0);
  return {
    silver: new Float32Array(silver.concat(steel)), silverW: new Float32Array(silverW.concat(steelA.map(() => 1))),
    silverA: new Float32Array(silverA.concat(steelA.map((a) => a * PEWTER_K))),
    white: new Float32Array(white), whiteA: new Float32Array(whiteA),
    ember: new Float32Array(ember),
  };
}

function buildStars(count, seed) {
  const rnd = mulberry32(seed);
  const pos = new Float32Array(count * 3), size = new Float32Array(count), alpha = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // Upper sky, denser toward the zenith (where the opening looks); a few bright ones.
    const az = rnd() * TAU, el = Math.asin(0.08 + 0.92 * Math.pow(rnd(), 0.7));
    pos[3 * i] = Math.cos(el) * Math.sin(az) * STAR_R;
    pos[3 * i + 1] = Math.sin(el) * STAR_R;
    pos[3 * i + 2] = Math.cos(el) * Math.cos(az) * STAR_R;
    const m = Math.pow(rnd(), 3.2);
    size[i] = 0.7 + 1.5 * m;
    alpha[i] = 0.22 + 0.68 * Math.pow(rnd(), 1.6) * (0.5 + 0.5 * m) + 0.25 * m;
  }
  return { pos, size, alpha };
}

/** Where remembered drawing k sits: on the ray from the rest eye through the opening, offset around the apex. */
export function rememberedDir(k, pose, out) {
  const b = basis(pose);
  const apex = new Vector3(0, APEX_H, 0).sub(pose.pos).normalize();
  const ring = k === 0 ? 0 : 1, a = (k * 2.39996) % TAU;               // golden-angle spread inside the opening
  const rad = (0.55 + 0.45 * ring) * 1.6 * DEG * (k === 0 ? 0.35 : 1);
  out.copy(apex).addScaledVector(b.r, Math.cos(a) * Math.tan(rad)).addScaledVector(b.u, Math.sin(a) * Math.tan(rad) + 0.9 * DEG).normalize();
  return out;
}

/** @returns the hall's 3D: { group, frame, setFrame(pose, h, traceY), setFlatten(u), setAlpha(a), setStars(n),
 *  setRemembered(drawings, pose), flareRemembered(k, x), setBeacon(x), update(dt), dispose() } */
export function createSky(hctx, tierStars) {
  const S = buildSegments();
  const group = new Group(); group.name = 'signal:sky';
  const frame = new Group(); frame.name = 'signal:frame';            // the «Голос» frame (camera-plane basis)
  group.add(frame);
  const far = 900;
  // Draw-call economy (G4: the resident Key and CORE stay drawn below): the pewter contours and rails ride in the
  // silver batch at PEWTER_K of their alpha (pewter ≈ silver × 0.5 on the void), so the spire is ONE draw.
  const silver = createLines({ segments: S.silver.slice(), width: S.silverW, alpha: S.silverA, color: 'silver', far, flatten: true, fog: false, glint: 0.9 });
  const white = createLines({ segments: S.white.slice(), alpha: S.whiteA, color: 'white', far, flatten: true, fog: false, glint: 0.6 });
  const ember = createLines({ segments: S.ember.slice(), width: 2, alpha: 1, color: 'ember', far, flatten: true, fog: false, glint: 0 });
  silver.mesh.name = 'signal:spire'; white.mesh.name = 'signal:rim'; ember.mesh.name = 'signal:mast';
  const lines = [silver, white, ember];
  const base = [1, 1, 1];
  for (const l of lines) frame.add(l.mesh);

  // Stars: one Points. Slots 0…6 are the remembered drawings (3 px, lit one by one as he draws), then the field
  // (2 px; the tier's count is a draw range, never a reallocation).
  const NS = REMEMBERED_MAX + 2000;
  const st = buildStars(2000, 0x51c4a1);
  const sPos = new Float32Array(NS * 3), sSize = new Float32Array(NS), sAlpha = new Float32Array(NS);
  sPos.set(st.pos, REMEMBERED_MAX * 3); sSize.set(st.size, REMEMBERED_MAX); sAlpha.set(st.alpha, REMEMBERED_MAX);
  for (let k = 0; k < REMEMBERED_MAX; k++) { sSize[k] = MEM_SIZE; sAlpha[k] = 0; sPos[3 * k + 1] = STAR_R; }
  const stars = createPoints({ positions: sPos, sizes: sSize, alphas: sAlpha, count: REMEMBERED_MAX + tierStars, sizePx: 2, color: 'white',
    alpha: 1, fog: false, layer: LAYER.NOFOG });
  stars.object.name = 'signal:stars';
  group.add(stars.object);
  const starPos = stars.object.geometry.getAttribute('position');
  const starSize = stars.object.geometry.getAttribute('aSize');
  const starAlpha = stars.object.geometry.getAttribute('aAlpha');

  // The beacon: a 6 px ember point, the core of a small ember emitter (on T3 the bloom makes its halo).
  const beaconCore = createPoints({ positions: new Float32Array([0, 0, 0]), sizePx: 6, color: 'ember', alpha: 1, fog: false, layer: LAYER.NOFOG });
  beaconCore.object.name = 'signal:beacon';
  const beaconGlow = createEmitter({ color: 'ember', radius: 1.6, intensity: 0.55, fog: false, core: beaconCore.object });
  beaconGlow.object.position.set(0, MAST_TOP, 0);
  group.add(beaconGlow.object);

  const _m = new Matrix4(), _x = new Vector3(), _y = new Vector3(), _z = new Vector3(), _d = new Vector3();
  const _b = { f: new Vector3(), r: new Vector3(), u: new Vector3() };
  const SRC = [S.silver, S.white, S.ember];
  const DST = SRC.map((a) => new Float32Array(a.length));
  let alpha = 1, beacon = 1, flat = 0;

  function toFrame(src, dst, eye) {
    for (let i = 0; i < src.length; i += 3) {
      _d.set(src[i] - eye.x, src[i + 1] - eye.y, src[i + 2] - eye.z);
      dst[i] = _d.dot(_x); dst[i + 1] = _d.dot(_y); dst[i + 2] = _d.dot(_z);
    }
  }
  function applyAlpha() {
    for (let i = 0; i < lines.length; i++) lines[i].setAlpha(base[i] * alpha);
    beaconCore.setAlpha(alpha * beacon);
    beaconGlow.setIntensity(0.55 * alpha * beacon);
  }

  const sky = {
    group, frame, stars,
    /** Re-expresses every line in the «Голос» frame of a camera pose (hall-local pos/target/fov): local y = the normal
     *  of the plane through the eye that projects onto screen row traceY. Allocation-free (called per frame while the
     *  hall folds or builds, so the trace sits on that row whatever the camera does on its way in). */
    setFrame(pose, h, traceY) {
      traceNormal(pose, h, traceY, _y);
      basis(pose, _b);
      _x.copy(_b.r); _z.copy(_x).cross(_y).normalize(); _x.copy(_y).cross(_z).normalize();
      _m.makeBasis(_x, _y, _z);
      frame.position.copy(pose.pos);
      frame.quaternion.setFromRotationMatrix(_m);
      frame.updateMatrix();
      for (let i = 0; i < SRC.length; i++) { toFrame(SRC[i], DST[i], pose.pos); lines[i].setSegments(DST[i]); }
    },
    /** 0 = at rest, 1 = the whole spire is one horizontal trace. */
    setFlatten(u) {
      flat = u;
      for (const l of lines) l.setFlatten(u, 0);
    },
    /** Luminous trace: white flash 0..1 on every line. */
    setFlash(x) { for (const l of lines) l.uniforms.uFlash.value = x; },
    setAlpha(a) { alpha = a; applyAlpha(); },
    setStarsAlpha(a) { stars.setAlpha(a); },
    setStars(n) { stars.setCount(REMEMBERED_MAX + n); },
    /** Places up to 7 remembered stars (one per saved drawing). */
    setRemembered(n, pose) {
      const c = Math.min(REMEMBERED_MAX, n), P = starPos.array;
      for (let k = 0; k < REMEMBERED_MAX; k++) {
        rememberedDir(k, pose, _d);
        P[3 * k] = pose.pos.x + _d.x * (STAR_R - 200);
        P[3 * k + 1] = pose.pos.y + _d.y * (STAR_R - 200);
        P[3 * k + 2] = pose.pos.z + _d.z * (STAR_R - 200);
        starSize.array[k] = MEM_SIZE;
        starAlpha.array[k] = k < c ? 0.95 : 0;
      }
      starPos.needsUpdate = true; starSize.needsUpdate = true; starAlpha.needsUpdate = true;
    },
    /** Screen point of remembered star k for a pose / viewport (where the rising figure lands). */
    rememberedScreen(k, pose, w, h, out) {
      rememberedDir(k, pose, _d);
      _d.multiplyScalar(STAR_R - 200).add(pose.pos);
      return project(pose, w, h, _d, out);
    },
    /** Remembered star k flares (size multiplier). */
    flareRemembered(k, x) {
      if (k < 0 || k >= REMEMBERED_MAX) return;
      starSize.array[k] = MEM_SIZE * (1 + x); starSize.needsUpdate = true;
    },
    setBeacon(x) { beacon = x; applyAlpha(); },
    get flat() { return flat; },
    dispose() {
      for (const l of lines) l.dispose();
      stars.dispose(); beaconCore.dispose(); beaconGlow.dispose();
      if (group.parent) group.parent.remove(group);
    },
  };
  return sky;
}
