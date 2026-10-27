// world/vin.js — the generic hall interior and the axis pillar (ARCH §3.7.4, SPEC §3.10, §6.0).
//
// createHallShell(roomId) → HallShell, in HALL-LOCAL coordinates (origin = the room's anchor, the deck centre on the
// axis). The hall WALLS are not here: they are VIN's strata (nest level 1, R1 lattice from inside).
//   rings      floor + ceiling survey n-gon rings every 20 m (out to VIN's radius at that height; CORE: to the hollow),
//              1 px --steel — one Lines
//   deck       n-gon r 60 m, rings every 4 m, 1 px --steel, alpha falling with radius (CORE: none)
//   irisTop / irisBottom   7-blade iris r 18 m at the ceiling / floor; set(open01) turns the blades 51.4° as they retract
// createAxisPillar() → Object3D (canonical): a 2 px ember ribbon y −1,200…+1,200 (open around the Key, |y| < 12 m, where
// the Key's own axis takes over) plus 97 octahedral --silver beads r 1.8 m every 25 m in ONE InstancedMesh (the bead at
// the Key's centre is collapsed).
import {
  Group, InstancedMesh, OctahedronGeometry, ShaderMaterial, Matrix4, Vector3, Quaternion,
} from 'three';
import { ROOMS } from './rooms.js';
import { radiusAt } from './structure.js';
import { createLines } from '../render/lines.js';
import { U, colorUniform } from '../render/uniforms.js';
import { FOG_GLSL } from '../render/fog.js';
import { FX_GLSL, fxUniforms } from '../render/fxChunk.js';
import { HALL } from '../core/tokens.js';

const TAU = Math.PI * 2;
const BLADE_TURN = (HALL.irisBladeDeg * Math.PI) / 180;

/** Appends an n-gon of circumradius r at height y (face j's outward normal at angle 2πj/n). */
function ngon(out, n, r, y) {
  for (let j = 0; j < n; j++) {
    const a0 = (TAU * j) / n - Math.PI / n, a1 = a0 + TAU / n;
    out.push(Math.sin(a0) * r, y, Math.cos(a0) * r, Math.sin(a1) * r, y, Math.cos(a1) * r);
  }
}

/** VIN's circumradius (m) at canonical altitude y. */
const vinRadius = (y) => radiusAt(y / 1000) * 1000;

/** The 7-blade iris at hall-local height y. */
function createIris(y, far) {
  const SEGS = HALL.irisBlades * 2 + 28;
  const seg = new Float32Array(SEGS * 6);
  const lines = createLines({ segments: seg, color: 'silver', alpha: 0.42, far });
  const R = HALL.irisR;
  let open = 0;
  function write(o) {
    let k = 0;
    const put = (x0, z0, x1, z1) => { seg[k++] = x0; seg[k++] = y; seg[k++] = z0; seg[k++] = x1; seg[k++] = y; seg[k++] = z1; };
    for (let b = 0; b < HALL.irisBlades; b++) {
      const p0 = (TAU * b) / HALL.irisBlades, p1 = (TAU * (b + 1)) / HALL.irisBlades;
      const rt = R * (0.06 + 0.94 * o);
      const tt = p0 + Math.PI / HALL.irisBlades + BLADE_TURN * (1 - o);
      const tx = Math.sin(tt) * rt, tz = Math.cos(tt) * rt;
      put(Math.sin(p0) * R, Math.cos(p0) * R, tx, tz);
      put(tx, tz, Math.sin(p1) * R, Math.cos(p1) * R);
    }
    for (let q = 0; q < 28; q++) {
      const a0 = (TAU * q) / 28, a1 = (TAU * (q + 1)) / 28;
      put(Math.sin(a0) * R, Math.cos(a0) * R, Math.sin(a1) * R, Math.cos(a1) * R);
    }
    lines.setSegments(seg);
  }
  write(0);
  return {
    object: lines.mesh, lines,
    get open() { return open; },
    set(open01) {
      const o = Math.max(0, Math.min(1, open01));
      if (o === open) return;
      open = o;
      write(o);
    },
  };
}

/** @returns {HallShell} */
export function createHallShell(roomId) {
  const meta = ROOMS[roomId] || ROOMS.CORE;
  const n = meta.n;
  const group = new Group();
  group.name = `shell:${meta.id}`;
  const yF = meta.floor - meta.alt, yC = meta.ceil - meta.alt;
  const isCore = meta.id === 'CORE';
  const far = meta.far;

  // Survey rings, floor + ceiling.
  const rs = [];
  for (const [yl, ycan] of [[yF, meta.floor], [yC, meta.ceil]]) {
    const rmax = isCore ? 300 : vinRadius(ycan);
    for (let r = HALL.ringStep; r < rmax - 1; r += HALL.ringStep) ngon(rs, n, r, yl);
  }
  const rings = createLines({ segments: new Float32Array(rs.length ? rs : [0, 0, 0, 0, 0, 0]), color: 'steel', alpha: rs.length ? 1 : 0, far, flatten: true });
  rings.mesh.name = 'rings';
  group.add(rings.mesh);

  // Deck.
  let deck = null;
  if (!isCore) {
    const ds = [], da = [];
    for (let r = HALL.deckRingStep; r <= HALL.deckR + 1e-6; r += HALL.deckRingStep) {
      ngon(ds, n, r, 0);
      for (let j = 0; j < n; j++) da.push(1 - 0.75 * (r / HALL.deckR));
    }
    deck = createLines({ segments: new Float32Array(ds), alpha: new Float32Array(da), color: 'steel', far, flatten: true });
    deck.mesh.name = 'deck';
    group.add(deck.mesh);
  }

  const irisTop = createIris(yC, far), irisBottom = createIris(yF, far);
  group.add(irisTop.object, irisBottom.object);
  let alpha = 1, deckOn = true;
  const base = { rings: rs.length ? 1 : 0, deck: 1, iris: 0.42 };

  const shell = {
    group, rings, deck, irisTop, irisBottom,
    setDeckVisible(b) { deckOn = !!b; if (deck) deck.mesh.visible = deckOn && alpha > 0; },
    setIris(which, open01) { (which === 'top' ? irisTop : irisBottom).set(open01); },
    setFlatten(u, yLocal) {
      rings.setFlatten(u, yLocal);
      if (deck) deck.setFlatten(u, yLocal);
    },
    setAlpha(a) {
      alpha = Math.max(0, Math.min(1, a));
      rings.setAlpha(base.rings * alpha);
      if (deck) { deck.setAlpha(base.deck * alpha); deck.mesh.visible = deckOn && alpha > 0; }
      irisTop.lines.setAlpha(base.iris * alpha);
      irisBottom.lines.setAlpha(base.iris * alpha);
    },
    dispose() {
      rings.dispose();
      if (deck) deck.dispose();
      irisTop.lines.dispose(); irisBottom.lines.dispose();
      if (group.parent) group.parent.remove(group);
    },
  };
  return shell;
}

// ─── Axis pillar ─────────────────────────────────────────────────────────────────────────────────────────────
const BEAD_VERT = /* glsl */ `
varying vec3 vN; varying vec3 vW;
void main() {
  mat4 m = modelMatrix;
#ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
#endif
  vec4 w = m * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(m) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const BEAD_FRAG = /* glsl */ `
${FOG_GLSL}
${FX_GLSL}
uniform vec3 uColor; uniform vec3 uBase; uniform vec3 cWhite; uniform vec3 uLamp; uniform float uAlpha, uFlash;
varying vec3 vN; varying vec3 vW;
void main() {
  // Obsidian body with a silver Fresnel rim and a lamp glint, like every other solid in the world.
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uLamp - vW);
  float d = max(dot(N, L), 0.0);
  float fr = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 3.0);
  float sp = pow(max(dot(N, normalize(L + V)), 0.0), 24.0);
  vec3 col = uBase + uColor * (0.06 + 0.10 * d + 0.55 * fr + 0.35 * sp);
  col = mix(col, cWhite, uFlash);
  col = mix(col, cWhite, clamp(max(uImpact, fxWaveBright(vW)), 0.0, 1.0));   // H4: ПРОСВЕТ / ВОЛНА axis beads
  col = applyFog(col, length(vW - cameraPosition));
  gl_FragColor = vec4(col, uAlpha);
}`;

/** → Object3D: 2 px ember ribbon y −1,200…+1,200 plus 97 silver octahedral beads r 1.8 m every 25 m (one InstancedMesh). */
export function createAxisPillar() {
  const group = new Group();
  group.name = 'axisPillar';
  const GAP_Y = 12;
  const seg = [];
  const SPAN = 1200, STEP = 50;
  for (let y = -SPAN; y < SPAN; y += STEP) {
    const a = y, b = Math.min(SPAN, y + STEP);
    if (b <= -GAP_Y || a >= GAP_Y) seg.push(0, a, 0, 0, b, 0);
    else { if (a < -GAP_Y) seg.push(0, a, 0, 0, -GAP_Y, 0); if (b > GAP_Y) seg.push(0, GAP_Y, 0, 0, b, 0); }
  }
  const ribbon = createLines({ segments: new Float32Array(seg), color: 'ember', width: 2, alpha: 0.5, glint: 0.4, far: 4000 });
  ribbon.mesh.name = 'pillarRibbon';
  group.add(ribbon.mesh);

  const geo = new OctahedronGeometry(HALL.beadR, 0);
  const mat = new ShaderMaterial({
    uniforms: { uColor: colorUniform('silver'), uBase: colorUniform('obsidian'), cWhite: U.cWhite, uLamp: U.uLamp, uAlpha: { value: 1 }, uFlash: { value: 0 },
      cAbyss: U.cAbyss, uFogDensity: U.uFogDensity, ...fxUniforms() },
    vertexShader: BEAD_VERT, fragmentShader: BEAD_FRAG,
  });
  const beads = new InstancedMesh(geo, mat, HALL.beadCount);
  beads.name = 'pillarBeads';
  const m = new Matrix4(), q = new Quaternion(), p = new Vector3(), s = new Vector3();
  for (let k = 0; k < HALL.beadCount; k++) {
    const y = -SPAN + HALL.beadStep * k;
    p.set(0, y, 0);
    s.setScalar(Math.abs(y) < GAP_Y ? 0 : 1);          // the bead at the Key's centre is collapsed
    beads.setMatrixAt(k, m.compose(p, q, s));
  }
  beads.instanceMatrix.needsUpdate = true;
  beads.frustumCulled = false;
  group.add(beads);
  group.userData.ribbon = ribbon;
  group.userData.beads = beads;
  group.userData.uniforms = { ribbon: ribbon.uniforms, beads: mat.uniforms };
  return group;
}
