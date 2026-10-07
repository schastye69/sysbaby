// key/key.js — the Key, WP0 SEED (ARCH §3.18.1, §6.1.5; SPEC §3.1–§3.2). Owner after the gate: WP1, which rewrites it
// completely but keeps every export and signature.
//
// The seed renders a static aligned Key with the real cryptex mechanics: buildStructure({perStratum, vertices}) under
// key.group (child of nest.level(0)); the signs S A M • V I N painted into the engraving atlas (readable through the
// 45 % base inlay even without the lamp) and 12 ticks per face; the nucleus (icosahedron r 0.035 + glow sprite 0.0528,
// SPEC visibility rule, electrum 55 % at night); the 2 px ember axis (±1.20, +3.2 m after shootAxis); the breathing
// ring; lit-node dots; a static Keplerian grain cloud. Real: faceFrame, stratumMatrix, pick, screenInfo,
// stratumScreenY, setScramble, lockSequence, alignStratum, spinStratum, ignite, douse, shootAxis, setMorph (DIVE
// 0–480 ms + non-target fade by 1,000 ms; RECALL after-swap closing), overrides, onRebase, shudder, addYaw, wobble, bow,
// nudgePitch, flashNucleus, setNucleusPulse, setReveal, setIdle (breath only), setInteractive, onGesture (tap →
// 'key:click'). No hover, no drag, no idle drift (WP1).
//
// The Key starts as every boot begins: aligned but unrevealed (setReveal alpha 0), nucleus doused, axis not shot.
import { Group, Mesh, IcosahedronGeometry, ShaderMaterial, Vector3 } from 'three';
import { buildStructure, STRATA_GEOM, radiusAt } from '../world/structure.js';
import { createLines } from '../render/lines.js';
import { createPoints } from '../render/points.js';
import { createEmitter } from '../render/glow.js';
import { atlas } from '../render/engraveAtlas.js';
import { U, LAYER } from '../render/uniforms.js';
import { rig } from '../render/cameraRig.js';
import { pickScreen } from '../render/pick.js';
import { createLitNodes } from './litNodes.js';
import { Spring } from '../core/spring.js';
import { breath, after, tween } from '../core/clock.js';
import { EASE, clamp01, smoothstep, lerp } from '../core/ease.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { quality, TIER_PARAMS } from '../core/quality.js';
import { fontsReady } from '../core/fonts.js';
import { audio } from '../audio/engine.js';
import { ENV } from '../core/env.js';
import { GAP, KEY, NUCLEUS, AXIS, GRAINS, CANVAS_FONT, SIGNS, MOTION, TIMING, NIGHT } from '../core/tokens.js';

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const GOLDEN = 137.508 * DEG;

// ─── Atlas: signs + ticks (the seed's painters; WP1 adds the frieze, glyph and the lamp-raked detail) ─────────────
function paintSign(i) {
  const st = STRATA_GEOM[i];
  const S = KEY.sign.heightFrac * st.height;                  // metres covered by the region square
  atlas.draw(`sign:${i}`, {
    height: (c, w, h) => drawSign(c, w, h, i, S, false),
    inlay: (c, w, h) => drawSign(c, w, h, i, S, true),
  });
}
function drawSign(c, w, h, i, S, inlay) {
  c.fillStyle = '#fff'; c.strokeStyle = '#fff';
  const pxPerM = w / S;
  if (SIGNS[i] === '•') {
    const r = (KEY.apertureD / 2 + 0.0045) * pxPerM, ring = KEY.ringEngraveW * pxPerM;
    c.beginPath();
    if (inlay) { c.lineWidth = 1; c.arc(w / 2, h / 2, r - ring / 2, 0, TAU); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, r + ring / 2, 0, TAU); c.stroke(); }
    else { c.lineWidth = Math.max(1.5, ring); c.arc(w / 2, h / 2, r, 0, TAU); c.stroke(); }
    return;
  }
  // Apex strata (S, N) narrow to a point: the letter sits in the wide half of the face, smaller.
  const apex = i === 0 || i === 6;
  // S sits low on its face (the camera looks down onto its wide base); N stays central (I's rim overhangs its top).
  const capH = (apex ? 0.5 : 0.9) * h;
  const cy = h / 2 + (i === 0 ? 0.17 * h : i === 6 ? 0.02 * h : 0);
  c.font = CANVAS_FONT.sign.replace('{px}', String(Math.round(capH * 1.38)));
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  const m = c.measureText(SIGNS[i]);
  const asc = m.actualBoundingBoxAscent || capH, desc = m.actualBoundingBoxDescent || 0;
  const y = cy + (asc - desc) / 2;
  if (inlay) { c.lineWidth = 1; c.strokeText(SIGNS[i], w / 2, y); }
  else c.fillText(SIGNS[i], w / 2, y);
}
function paintTicks() {
  atlas.draw('ticks', {
    height: (c, w, h) => { c.fillStyle = '#fff'; for (let k = 0; k < KEY.ticksPerFace; k++) c.fillRect(((k + 0.5) / KEY.ticksPerFace) * w - 1, 0, 2, h * 0.9); },
    inlay: (c, w, h) => { c.fillStyle = '#fff'; for (let k = 0; k < KEY.ticksPerFace; k++) c.fillRect(Math.round(((k + 0.5) / KEY.ticksPerFace) * w), 0, 1, h * 0.9); },
  });
}
function paintAtlas() {
  if (!atlas.texture) atlas.init(quality.tier);
  for (let i = 0; i < 7; i++) paintSign(i);
  paintTicks();
  for (let i = 0; i < 7; i++) if (lawText[i]) paintLaw(i, lawText[i]);
}
// H28c: КОДЕКС laws — atlas `code:i` (8:1 strip), drawn once per text, centred, cap ≈ 62 % of the strip height.
const lawText = ['', '', '', '', '', '', ''];
function drawLaw(c, w, h, text, inlay) {
  c.fillStyle = '#fff'; c.strokeStyle = '#fff';
  let px = Math.round(h * 0.86);
  c.font = CANVAS_FONT.sign.replace('{px}', String(px));
  const tw = c.measureText(text).width;
  if (tw > w * 0.98) { px = Math.max(6, Math.floor(px * (w * 0.98) / tw)); c.font = CANVAS_FONT.sign.replace('{px}', String(px)); }
  c.textAlign = 'center'; c.textBaseline = 'middle';
  if (inlay) { c.lineWidth = 1; c.strokeText(text, w / 2, h / 2); } else c.fillText(text, w / 2, h / 2);
}
function paintLaw(i, text) {
  atlas.draw(`code:${i}`, { height: (c, w, h) => drawLaw(c, w, h, text, false), inlay: (c, w, h) => drawLaw(c, w, h, text, true) });
}

// ─── Nucleus material (emissive, --ember; electrum 55 % at night; one-frame --white flash) ──────────────────────
const NUC_VERT = /* glsl */ `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const NUC_FRAG = /* glsl */ `
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${NIGHT.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;

/** Face-0 centre of stratum i in stratum-local coordinates (the middle loft segment). */
function faceCentre(i, out) {
  const st = STRATA_GEOM[i];
  const y1 = st.top + (st.bot - st.top) / 3, y2 = st.top + (st.bot - st.top) * 2 / 3;
  const r = (radiusAt(y1) + radiusAt(y2)) / 2;
  return out.set(0, st.mid, r * Math.cos(Math.PI / st.n));
}

/** A per-stratum override channel (additive). */
const zeroO = () => ({ dy: 0, slide: 0, yaw: 0, pitch: 0, scaleR: 1, scaleY: 1, alpha: 1, edgeFlash: 0 });

export function createKey(ctx) {
  paintAtlas();
  fontsReady().then(paintAtlas);

  const group = new Group();
  group.name = 'key';
  const structure = buildStructure({ perStratum: true, vertices: true, far: 700 });
  group.add(structure.group);
  const strata = structure.strata;

  // Nucleus + glow.
  const nucMat = new ShaderMaterial({
    uniforms: { uColor: { value: U.cEmber.value }, cElectrum: U.cElectrum, cWhite: U.cWhite, uNight: U.uNight,
      uI: { value: 1 }, uFlash: { value: 0 }, uEmissivePass: U.uEmissivePass, uGlowVis: { value: 1 } },
    vertexShader: NUC_VERT, fragmentShader: NUC_FRAG,
  });
  const nucleus = new Mesh(new IcosahedronGeometry(NUCLEUS.r, NUCLEUS.detail), nucMat);
  nucleus.name = 'nucleus';
  nucleus.userData.stratum = 3;
  const glow = createEmitter({ color: 'ember', radius: NUCLEUS.glowR, intensity: 1, core: nucleus, depthTest: false,
    night: true, nightIntensity: NIGHT.nucleusIntensity, fog: false, renderOrder: 6 });
  group.add(glow.object);

  // Axis: core ±1.20 at α .35 + extensions (+len beyond each tip, fading to 0).
  const axisCore = createLines({ segments: new Float32Array([0, -AXIS.half, 0, 0, AXIS.half, 0]), color: 'ember',
    width: AXIS.widthPx, alpha: AXIS.alphaInside, glint: 0.3 });
  const EXT_N = 8;
  const extSeg = new Float32Array(EXT_N * 2 * 6), extAlpha = new Float32Array(EXT_N * 2);
  const axisExt = createLines({ segments: extSeg, alpha: extAlpha, color: 'ember', width: AXIS.widthPx, glint: 0.3 });
  for (const l of [axisCore, axisExt]) { l.mesh.layers.enable(LAYER.EMISSIVE); l.mesh.renderOrder = 4; group.add(l.mesh); }
  let extLen = -1;
  function setExt(len) {
    if (len === extLen) return;
    extLen = len;
    for (let s = 0; s < 2; s++) {
      const sg = s ? -1 : 1;
      for (let k = 0; k < EXT_N; k++) {
        const a = AXIS.half + (len * k) / EXT_N, b = AXIS.half + (len * (k + 1)) / EXT_N, o = (s * EXT_N + k) * 6;
        extSeg[o] = 0; extSeg[o + 1] = sg * a; extSeg[o + 2] = 0; extSeg[o + 3] = 0; extSeg[o + 4] = sg * b; extSeg[o + 5] = 0;
        extAlpha[s * EXT_N + k] = AXIS.alphaInside * (1 - (k + 0.5) / EXT_N);
      }
    }
    axisExt.setSegments(extSeg);
    axisExt.mesh.geometry.attributes.aAl.needsUpdate = true;
    axisExt.mesh.visible = len > 0;
  }
  setExt(AXIS.extend);

  // Breathing ring (1 px ember, r 0.09) on the • face, around the aperture.
  const RING_N = 48, ringSeg = new Float32Array(RING_N * 6);
  const zFace = faceCentre(3, new Vector3()).z + 0.002;
  for (let k = 0; k < RING_N; k++) {
    const a0 = (k / RING_N) * TAU, a1 = ((k + 1) / RING_N) * TAU, o = k * 6;
    ringSeg.set([Math.cos(a0) * NUCLEUS.breathRingR, Math.sin(a0) * NUCLEUS.breathRingR, zFace,
      Math.cos(a1) * NUCLEUS.breathRingR, Math.sin(a1) * NUCLEUS.breathRingR, zFace], o);
  }
  const ring = createLines({ segments: ringSeg, color: 'ember', width: 1, alpha: 0.8, glint: 0 });
  ring.mesh.visible = false;
  strata[3].add(ring.mesh);

  // Lit-node dots on stratum 3.
  const lit = createLitNodes({ scale: 1 });
  lit.setCount(state.litNodes);
  strata[3].add(lit.object);

  // Grains: a static Keplerian cloud on the 7 planes (6 gap planes + y = 0); tier changes shrink the draw range only.
  const grainCap = TIER_PARAMS.T3.grains;
  const gpos = new Float32Array(grainCap * 3), gsize = new Float32Array(grainCap);
  const planes = [0];
  for (let i = 1; i < 7; i++) planes.push((STRATA_GEOM[i - 1].bot + STRATA_GEOM[i].top) / 2);
  let seed = 0x9e3779b9;
  const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let g = 0; g < grainCap; g++) {
    const y = planes[g % 7], rp = Math.max(0.12, radiusAt(y));
    const r = rp * lerp(GRAINS.annulus[0], GRAINS.annulus[1], Math.sqrt(rnd())), a = rnd() * TAU;
    gpos[g * 3] = Math.sin(a) * r; gpos[g * 3 + 1] = y + (rnd() - 0.5) * 2 * GRAINS.jitter; gpos[g * 3 + 2] = Math.cos(a) * r;
    gsize[g] = lerp(GRAINS.sizePx[0], GRAINS.sizePx[1], rnd());
  }
  const grainPts = createPoints({ positions: gpos, sizes: gsize, sizePx: 1, color: 'silver', alpha: 0.35,
    count: (quality.params || TIER_PARAMS.T2).grains });
  grainPts.object.name = 'grains';
  group.add(grainPts.object);
  const grains = {
    count: (quality.params || TIER_PARAMS.T2).grains,
    mode: 'rings',
    setMode(m) { grains.mode = m; },
    setPlate() {}, writeTargets() {}, commitTargets() {}, flyToTargets() {}, shiver() {}, scatter() {},
  };
  bus.on('tier:change', ({ tier }) => {
    const p = TIER_PARAMS[tier];
    if (!p) return;
    grains.count = Math.min(grainCap, p.grains);
    grainPts.setCount(grains.count);
  });

  // Satellites (count only in the seed).
  const satCount = () => { app.satellites = Math.min(7, (state.data && state.data.drawings ? state.data.drawings.length : 0)); };
  satCount();
  bus.on('drawing:saved', satCount);

  // ─── Pose state ───────────────────────────────────────────────────────────────────────────────────────────
  const snapZeta = (os) => (os <= 0 ? 1 : -Math.log(os) / Math.sqrt(Math.PI * Math.PI + Math.log(os) ** 2));
  const yaw = [];
  for (let i = 0; i < 7; i++) yaw.push(new Spring(22, snapZeta(0.04), 0));
  const spin = new Float32Array(7), spinFace = new Int32Array(7);
  const over = [], morph = [];
  for (let i = 0; i < 7; i++) { over.push(null); morph.push(zeroO()); }
  let overG = null, overW = 1;
  const morphG = { scale: 1, nucleus: 1, gap: -1 };
  const gapS = new Spring(6, 1, GAP.rest);                  // the rest gap (onRebase blend, setIdle breath)
  const yawG = new Spring(6, 1, 0), pitchG = new Spring(6, 0.8, 0);
  let idle = false, interactive = true, revealFill = 1;
  const nuc = { on: true, base: 1, pulse: 1, flashUntil: 0, flashToken: null, oneFrameFlash: 0 };
  const shud = { t0: -1, amp: 0 };
  const wob = { t0: -1, amp: 0, hz: 0, decay: 1, ms: 0 };
  const bowS = { t0: -1 };
  let nowMs = 0;
  let nucColor = U.cEmber.value;

  const _v = new Vector3(), _v2 = new Vector3(), _n = new Vector3(), _c = new Vector3();
  const _p = { x: 0, y: 0, depth: 0, visible: false }, _p2 = { x: 0, y: 0, depth: 0, visible: false };
  const nucleusWorld = new Vector3();
  const pickables = structure.solids.concat([nucleus]);
  const COS35 = Math.cos(NUCLEUS.apertureAlignDeg[0] * DEG), COS10 = Math.cos(NUCLEUS.apertureAlignDeg[1] * DEG);

  function resetMorph() {
    for (let i = 0; i < 7; i++) Object.assign(morph[i], zeroO());
    morphG.scale = 1; morphG.nucleus = 1; morphG.gap = -1;
  }

  // ─── Per frame (ORDER.WORLD) ──────────────────────────────────────────────────────────────────────────────
  function update(dt, t) {
    nowMs = t;
    for (let i = 0; i < 7; i++) {
      const s = yaw[i];
      if (spin[i] !== 0) {
        s.x += spin[i] * dt; s.v = 0; s.target = s.x;
        spin[i] *= Math.pow(MOTION.spinDecay, dt * 1000 / MOTION.frameMs);
        const fw = TAU / STRATA_GEOM[i].n, f = Math.floor(s.x / fw);
        if (f !== spinFace[i]) { spinFace[i] = f; audio.play('tick', {}); }
        if (Math.abs(spin[i]) < 0.35) { spin[i] = 0; s.omega = 6; s.zeta = 1; s.target = Math.round(s.x / TAU) * TAU; }
      }
      s.step(dt);
    }
    gapS.step(dt); yawG.step(dt); pitchG.step(dt);

    let gap = gapS.x;
    if (idle) gap += breath.mix(GAP.rest, GAP.breath) - GAP.rest;     // breath.amp is 0.25 under reduced motion
    if (morphG.gap >= 0) gap = morphG.gap;
    if (overG && overG.gap != null) gap = lerp(gap, overG.gap, overW);
    curGap = gap;
    U.uGap.value = gap;                                                // H28c
    // H28c: a law draw requested inside a ПАУЗА waits for its end; isShowingBack bookkeeping.
    if (lawPending >= 0 && !inPause()) { const i = lawPending; lawPending = -1; for (let j = 0; j < 7; j++) if (lawDirty[j]) { lawDirty[j] = 0; paintLaw(j, lawText[j]); } void i; }
    {
      const yw = Math.atan2(Math.sin(yawG.x), Math.cos(yawG.x));
      const back = Math.abs(Math.abs(yw) - Math.PI) <= 35 * DEG;
      if (!back) backSince = -1; else if (backSince < 0) backSince = t;
    }

    let flash = 0;
    for (let i = 0; i < 7; i++) {
      const m = morph[i], o = over[i], w = o ? overW : 0;
      const dy = (3 - i) * (gap - GAP.rest) + m.dy + (o && o.dy ? o.dy * w : 0);
      const slide = m.slide + (o && o.slide ? o.slide * w : 0);
      let y = yaw[i].x + m.yaw + (o && o.yaw ? o.yaw * w : 0);
      if (wob.t0 >= 0) {
        const tau = t - wob.t0;
        if (tau > wob.ms) wob.t0 = -1;
        else y += wob.amp * Math.sin(TAU * wob.hz * tau / 1000 + i * 0.9) * Math.exp(-tau / wob.decay);
      }
      const p = m.pitch + (o && o.pitch ? o.pitch * w : 0);
      const sR = m.scaleR * (o && o.scaleR != null ? lerp(1, o.scaleR, w) : 1);
      const sY = m.scaleY * (o && o.scaleY != null ? lerp(1, o.scaleY, w) : 1);
      const a = m.alpha * (o && o.alpha != null ? lerp(1, o.alpha, w) : 1);
      flash = Math.max(flash, m.edgeFlash + (o && o.edgeFlash ? o.edgeFlash * w : 0));
      const st = strata[i];
      st.position.set(Math.sin(y) * slide, dy, Math.cos(y) * slide);
      st.rotation.set(p, y, 0, 'YXZ');
      st.scale.set(sR, sY, sR);
      structure.setStratumFade(i, a);
    }
    if (edgeFlashFrames > 0) { edgeFlashFrames--; flash = Math.max(flash, 1 / 0.6); }   // H28c flashEdges (seed: the one batch)
    for (let q = 0; q < structure.edges.length; q++) structure.edges[q].uniforms.uFlash.value = Math.min(1, flash * 0.6);

    // Group: morph scale, overrides, shudder, bow.
    const sc = morphG.scale * (overG && overG.scale != null ? lerp(1, overG.scale, overW) : 1);
    group.scale.setScalar(sc);
    let gp = pitchG.x + (overG && overG.pitch ? overG.pitch * overW : 0);
    if (bowS.t0 >= 0) { const tau = t - bowS.t0; if (tau > 600) bowS.t0 = -1; else gp += 8 * DEG * Math.sin(Math.PI * tau / 600); }
    group.rotation.set(gp, yawG.x + (overG && overG.yaw ? overG.yaw * overW : 0), overG && overG.roll ? overG.roll * overW : 0, 'YXZ');
    let sx = 0;
    if (shud.t0 >= 0) {
      const tau = t - shud.t0;
      if (tau > TIMING.shudder) shud.t0 = -1;
      else sx = Math.sin(TAU * 3 * tau / TIMING.shudder) * shud.amp * (1 - tau / TIMING.shudder);
    }
    group.position.set(sx, 0, overG && overG.dz ? overG.dz * overW : 0);
    group.updateWorldMatrix(true, true);
    nucleusWorld.setFromMatrixPosition(group.matrixWorld);

    // Nucleus: intensity (breath, pulse, morph), colour, flash, SPEC visibility rule for the glow sprite.
    let k = nuc.on ? (idle ? breath.mix(NUCLEUS.intensity[0], NUCLEUS.intensity[1]) : 1) * nuc.pulse * morphG.nucleus : 0;
    if (nucOverride != null) k = nucOverride;                          // H28c setNucleus
    if (nuc.flashUntil && t > nuc.flashUntil) { nuc.flashUntil = 0; nucColor = U.cEmber.value; glow.setColor('ember'); }
    nucMat.uniforms.uColor.value = nucColor;
    nucMat.uniforms.uI.value = k;
    nucMat.uniforms.uFlash.value = nuc.oneFrameFlash > 0 ? 1 : 0;
    glow.setFlash(nucMat.uniforms.uFlash.value);
    if (nuc.oneFrameFlash > 0) nuc.oneFrameFlash--;
    let vis = NUCLEUS.minVisibility;
    if (rig.camera) {
      _n.set(0, 0, 1).transformDirection(strata[3].matrixWorld);
      _v.copy(rig.camera.position).sub(nucleusWorld).normalize();
      vis = Math.max(vis, smoothstep(COS35, COS10, _v.dot(_n)), smoothstep(NUCLEUS.gapOpen[0], NUCLEUS.gapOpen[1], gap));
    }
    glow.setIntensity(k * vis * revealFill);
    nucMat.uniforms.uGlowVis.value = vis * revealFill;
    if (ring.mesh.visible) {
      const b = breath.mix(0, 1);
      ring.mesh.scale.setScalar(1 + 0.04 * b);
      ring.setAlpha(0.55 + 0.35 * b);
    }
  }
  let curGap = GAP.rest;
  // H28c state
  let edgeFlashFrames = 0, lawPending = -1, backSince = -1, nucOverride = null, yawTw = null;
  const lawDirty = new Uint8Array(7);
  const inPause = () => { try { return !!(ctx && ctx.fx && ctx.fx.impact && ctx.fx.impact.inPause()); } catch (e) { return false; } };
  const _bf = new Vector3(), _bn = new Vector3();

  // ─── API ──────────────────────────────────────────────────────────────────────────────────────────────────
  const key = {
    group, structure, radius: KEY.radius, nucleusWorld, grains,
    /** WP0 seed extras (WP1 may drop them): the nucleus mesh, its emitter, the lit-node set. */
    nucleus, glow, litNodes: lit,

    faceFrame(i, out) {
      faceCentre(i, _c);
      out.F.copy(_c).applyMatrix4(strata[i].matrixWorld);
      out.n.set(0, 0, 1).transformDirection(strata[i].matrixWorld);
      return out;
    },
    stratumMatrix(i, out) { return out.copy(strata[i].matrixWorld); },
    pick(x, y) {
      const h = pickScreen(x, y, pickables);
      return h && h.object && h.object.userData.stratum != null ? h.object.userData.stratum : -1;
    },
    screenInfo(out) {
      const cam = rig.camera;
      rig.project(nucleusWorld, _p);
      out.x = _p.x; out.y = _p.y;
      if (!cam) { out.r = out.rx = out.ry = 0; return out; }
      const sc = group.scale.x;
      _v.setFromMatrixColumn(cam.matrixWorld, 0);
      _v2.copy(nucleusWorld).addScaledVector(_v, KEY.radius * sc); rig.project(_v2, _p2); out.r = Math.abs(_p2.x - _p.x);
      _v2.copy(nucleusWorld).addScaledVector(_v, 0.62 * sc); rig.project(_v2, _p2); out.rx = Math.abs(_p2.x - _p.x);
      _v.setFromMatrixColumn(cam.matrixWorld, 1);
      _v2.copy(nucleusWorld).addScaledVector(_v, 1.2 * sc); rig.project(_v2, _p2); out.ry = Math.abs(_p2.y - _p.y);
      return out;
    },
    stratumScreenY(i) {
      _v.set(0, STRATA_GEOM[i].mid, 0).applyMatrix4(strata[i].matrixWorld);
      return rig.project(_v, _p).y;
    },

    update,
    onGesture(g) {
      if (!interactive || !g || g.type !== 'tap') return false;
      const index = key.pick(g.x, g.y);
      if (index < 0) return false;
      bus.emit('key:click', { index, x: g.x, y: g.y });
      return true;
    },
    setInteractive(b) { interactive = !!b; },
    setIdle(b) { idle = !!b; },

    setReveal(r) {
      if (!r) return;
      revealFill = r.fill != null ? clamp01(r.fill) : 1;
      structure.setParts({ vertices: r.points != null ? clamp01(r.points) : 1, solid: revealFill, edges: 1, lattice: revealFill });
      structure.setFade(r.alpha != null ? clamp01(r.alpha) : 1);
      for (let q = 0; q < structure.edges.length; q++) structure.edges[q].uniforms.uFlash.value = r.scanY != null ? 0.35 : 0;
      const on = r.alpha == null || r.alpha > 0;
      axisCore.mesh.visible = on;
      axisExt.mesh.visible = on && extLen > 0;
      ring.mesh.visible = on && ringOn;
      lit.object.visible = (r.alpha == null || r.alpha > 0) && lit.count > 0;
      grainPts.setAlpha(0.35 * (r.alpha != null ? clamp01(r.alpha) : 1));
    },
    setScramble(angles) {
      for (let i = 0; i < 7; i++) {
        let a = 0;
        if (angles === 'golden') a = i * GOLDEN;
        else if (angles === 'random') a = (rnd() - 0.5) * TAU;
        else if (Array.isArray(angles)) a = +angles[i] || 0;
        a = Math.atan2(Math.sin(a), Math.cos(a));
        spin[i] = 0;
        yaw[i].snap(a);
      }
    },
    lockSequence(opts = {}) {
      const order = opts.order === 'up' ? [6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6];
      const step = opts.stepMs != null ? opts.stepMs : TIMING.lockStep;
      if (opts.spin) for (const i of order) if (Math.abs(yaw[i].x) > 0.01) spin[i] = 3;
      return new Promise((resolve) => {
        order.forEach((i, k) => after(k * step, () => {
          key.alignStratum(i, { spring: 'light', overshoot: opts.snap != null ? opts.snap : MOTION.snapOvershoot });
          audio.play('ratchet', { i });
          if (opts.onLock) { try { opts.onLock(i); } catch (e) { /* caller's */ } }
          if (k === order.length - 1) after(320, resolve);
        }));
      });
    },
    alignStratum(i, opts = {}) {
      const s = yaw[i];
      spin[i] = 0;
      s.omega = opts.spring === 'heavy' ? 6 : 22;
      s.zeta = snapZeta(opts.overshoot != null ? opts.overshoot : 0);
      s.target = Math.round(s.x / TAU) * TAU;
    },
    spinStratum(i, angVel) {
      spin[i] = angVel;
      spinFace[i] = Math.floor(yaw[i].x / (TAU / STRATA_GEOM[i].n));
    },
    ignite(opts = {}) {
      nuc.on = true;
      nuc.oneFrameFlash = opts.flash === false ? 0 : 1;
      nucColor = opts.color === 'electrum' ? U.cElectrum.value : U.cEmber.value;
      glow.setColor(opts.color === 'electrum' ? 'electrum' : 'ember');
    },
    douse() { nuc.on = false; },
    shootAxis(len = AXIS.extend, ms = AXIS.shootMs) {
      const tw = tween(ms, (u) => setExt(len * u), EASE.reveal);
      return tw.done;
    },
    setBreathingRing(on) { ringOn = !!on; ring.mesh.visible = ringOn; },

    setMorph(kind, i, tMs, D) {
      resetMorph();
      if (kind === 'dive') {
        const k = D > 1600 ? 1.375 : 1;
        const tt = tMs / k;
        const c = clamp01(tt / 120), e = EASE.camera(clamp01((tt - 120) / 360));
        morphG.scale = tt < 120 ? 1 - KEY.contract * EASE.camera(c) : 1 - KEY.contract * (1 - smoothstep(120, 480, tt));
        morphG.nucleus = 1 + (KEY.nucleusAnticipation - 1) * (tt < 120 ? c : 1 - smoothstep(120, 480, tt));
        morphG.gap = lerp(GAP.rest, GAP.dive, e);
        for (let j = 0; j < 7; j++) {
          const m = morph[j];
          if (j === i) {
            m.slide = KEY.diveSlide * e;
            m.yaw = -yaw[j].x * e;                      // its sign turns to the camera
            m.edgeFlash = tt < 120 ? c : 1 - smoothstep(480, 900, tt);
          } else {
            m.yaw = (j < i ? -1 : 1) * KEY.diveTurnAwayDeg * DEG * e;
            m.alpha = 1 - smoothstep(480 * k, 1000 * k, tMs);
          }
        }
      } else if (kind === 'recall') {
        const swapAt = (TIMING.recallSwapAt * D) / TIMING.recall;
        const tau = tMs - swapAt;
        if (tau < 0) { morphG.gap = GAP.recallStart; return; }
        const x = clamp01(tau / (D - swapAt || 200));
        morphG.gap = GAP.rest + (GAP.recallStart - GAP.rest) * (1 - EASE.camera(x)) - (GAP.recallStart - GAP.rest) * MOTION.settleOvershoot * Math.sin(Math.PI * x);
        for (let j = 0; j < 7; j++) if (tau < TIMING.recallRatchetMs * (j + 1)) morph[j].yaw = (j % 2 ? -1 : 1) * 6 * DEG;
      } else if (morphG.gap < 0 && curGap !== gapS.x) {
        gapS.snap(curGap); gapS.target = GAP.rest;
      }
    },
    override(i, o) { if (i >= 0 && i < 7) over[i] = o || null; },
    overrideGroup(o) { overG = o || null; },
    setOverrideWeight(w) { overW = clamp01(w); },
    onRebase(kind) {
      resetMorph();
      for (let i = 0; i < 7; i++) { spin[i] = 0; yaw[i].snap(0); }
      gapS.snap(kind === 'shrink' ? GAP.recallStart : GAP.rest);
      gapS.omega = 4; gapS.target = GAP.rest;
    },

    shudder(px = 6) {
      if (ENV.reducedMotion) px = Math.min(px, 2);
      const d = rig.camera ? rig.camera.position.distanceTo(nucleusWorld) : 7.2;
      shud.amp = (px * d) / Math.max(1, U.uPxPerUnit.value);
      shud.t0 = nowMs;
    },
    addYaw(rad) { yawG.x += rad; },
    wobble(amp, hz, decayMs, ms) { if (ENV.reducedMotion) return; Object.assign(wob, { t0: nowMs, amp, hz, decay: Math.max(1, decayMs), ms }); },
    bow() { bowS.t0 = nowMs; yawG.target = 0; return new Promise((r) => after(600, r)); },
    nudgePitch(deg) { pitchG.x += deg * DEG; },
    flashNucleus(token, ms) {
      nucColor = token === 'white' ? U.cWhite.value : U.cElectrum.value;
      glow.setColor(token === 'white' ? 'white' : 'electrum');
      nuc.flashUntil = nowMs + Math.max(16, ms || 0);
    },
    setNucleusPulse(mult) { nuc.pulse = mult > 0 ? mult : 1; },

    // ── H28c (ARCH-ADDENDUM X§2.8.1) — WP1 seeds ──
    /** 1-frame (or n-frame) flash of stratum i's primary edges (seed: the one edge batch). */
    flashEdges(i, token = 'white', frames = 1) { void i; void token; edgeFlashFrames = Math.max(edgeFlashFrames, Math.max(1, frames | 0)); },
    /** Draws atlas `code:i` (once per text; never inside a ПАУЗА) and sets U.uCut[i] = cut01. */
    setLaw(i, text, cut01) {
      if (!(i >= 0 && i < 7)) return;
      const t = String(text == null ? '' : text);
      if (t !== lawText[i]) {
        lawText[i] = t;
        if (inPause()) { lawDirty[i] = 1; lawPending = i; } else paintLaw(i, t);
      }
      U.uCut.value[i] = clamp01(+cut01 || 0);
    },
    /** Group yaw tween (КОДЕКС 180°, ПОКАЗ ФИНАЛ). → Promise (resolves after ms) */
    yawTo(deg, ms) {
      if (yawTw) yawTw.cancel();
      const from = yawG.x, to = (deg || 0) * DEG, d = Math.max(0, ms || 0);
      if (d <= 0) { yawG.snap(to); yawG.target = to; return Promise.resolve(); }
      yawTw = tween(d, (u) => { yawG.x = from + (to - from) * u; yawG.v = 0; yawG.target = yawG.x; }, EASE.camera);
      return yawTw.done;
    },
    /** Render-space centre + normal of face (i, floor(n/2)). */
    backFaceFrame(i, out) {
      const st = STRATA_GEOM[i];
      if (!st) return out;
      const jb = Math.floor(st.n / 2), a = (TAU * jb) / st.n;
      faceCentre(i, _bf);
      const r = _bf.z;
      _bf.set(Math.sin(a) * r, _bf.y, Math.cos(a) * r).applyMatrix4(strata[i].matrixWorld);
      _bn.set(Math.sin(a), 0, Math.cos(a)).transformDirection(strata[i].matrixWorld);
      out.F.copy(_bf); out.n.copy(_bn);
      return out;
    },
    /** yaw within 180° ± 35° for ≥ 240 ms */
    isShowingBack() { return backSince >= 0 && nowMs - backSince >= 240; },
    setScrambleQuant(step, lagMs) { void step; void lagMs; },
    /** Nucleus intensity override 0..1; null releases. */
    setNucleus(level) { nucOverride = level == null ? null : clamp01(+level || 0); },
    strike(amp) { void amp; },
    bowTo(deg, ms) { void deg; void ms; return key.bow(); },
  };
  grains.markSaved = (n, pairs) => { void n; void pairs; };
  grains.spiral = (p) => { void p; };
  let ringOn = false;
  // Initial state = the start of any boot: unrevealed, nucleus dark, axis not shot (the boot reveals, ignites, shoots).
  key.setReveal({ points: 0, scanY: null, fill: 0, alpha: 0 });
  key.douse();
  setExt(0);
  bus.on('night:change', ({ night }) => lit.setNight(night));
  if (app.night) lit.setNight(true);
  void ctx;
  return key;
}
