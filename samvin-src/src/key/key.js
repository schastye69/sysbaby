// key/key.js — WP1. КЛЮЧ, the central artifact (ARCH §3.18.1, X§2.8.1; SPEC §3.1–§3.5, §3.9, §2.7, §10.3, §12.2,
// §12.4, §8.1 S06/S10, §6.5 (c); SPEC-ADDENDUM A2.0.4, A2.3, A2.6.1, A2.9, A3.3, A5.1, A6.5.9, A11.4).
// The cryptex that reads S·A·M·•·V·I·N: R2 obsidian strata with R4 engravings (signs, Hepta frieze, ticks, his glyph,
// the КОДЕКС laws), the R1 lattice twin, R3 edges, 2 px white vertices — all from buildStructure — plus the nucleus,
// the ember axis, the grains, the lit nodes and the drawing satellites. Pose = the sum of independent channels:
//   stratum i:  cryptex yaw (scramble / lock / spin; quantised + lagged for the СВЁРТКА digital tail) + sway + re-index +
//               notice lag + hover turn/slide/push + morph (DIVE/RECALL) + overrides + wobble + struck shiver
//   group:      drift + notice (idle.js) + drag / yawTo / addYaw (drag.js) + bow + nudge + overrides; lean; press
//   stratum 6:  + the sealed-N shudder (6 px, 3 cycles, 240 ms)
// Sub-modules: signs (atlas), nucleus, grains, idle, hover, drag, marks, litNodes.
import { Group, Vector3, Matrix4, Mesh, PlaneGeometry, ShaderMaterial, AdditiveBlending } from 'three';
import { buildStructure, STRATA_GEOM, radiusAt } from '../world/structure.js';
import { createLines } from '../render/lines.js';
import { atlas } from '../render/engraveAtlas.js';
import { U, LAYER, onesStrata } from '../render/uniforms.js';
import { rig } from '../render/cameraRig.js';
import { pickScreen } from '../render/pick.js';
import { Spring } from '../core/spring.js';
import { breath, after, tween } from '../core/clock.js';
import { EASE, clamp01, smoothstep, lerp } from '../core/ease.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { quality, TIER_PARAMS } from '../core/quality.js';
import { fontsReady } from '../core/fonts.js';
import { loop } from '../core/loop.js';
import { audio } from '../audio/engine.js';
import { ENV } from '../core/env.js';
import { GAP, KEY, AXIS, MOTION, TIMING, LOFT_RINGS, RENDER, IDLE, CORE_REST_D } from '../core/tokens.js';
import { signs } from './signs.js';
import { createNucleus } from './nucleus.js';
import { createGrains, SPARK } from './grains.js';
import { createIdle } from './idle.js';
import { createHover } from './hover.js';
import { createDrag } from './drag.js';
import { createMarks } from './marks.js';
import { keepout } from '../ui/keepout.js';

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const GOLDEN = 137.508 * DEG;
const HIST = 24;
const NO_OPTS = {};   // shared, so the spin tick allocates nothing per face crossing
const zeroO = () => ({ dy: 0, slide: 0, yaw: 0, pitch: 0, scaleR: 1, scaleY: 1, alpha: 1, edgeFlash: 0 });
const snapZeta = (os) => (os <= 0 ? 1 : -Math.log(os) / Math.sqrt(Math.PI * Math.PI + Math.log(os) ** 2));

/** Face-0 centre of stratum i, stratum-local (the middle loft segment). */
function faceCentre(i, out, face = 0) {
  const st = STRATA_GEOM[i];
  const r = ((radiusAt(st.top + (st.bot - st.top) / 3) + radiusAt(st.top + ((st.bot - st.top) * 2) / 3)) / 2) * Math.cos(Math.PI / st.n);
  const a = (TAU * face) / st.n;
  return out.set(Math.sin(a) * r, st.mid, Math.cos(a) * r);
}

/** The 12 primary silhouette edges per stratum (the faces nearest face 0, top/bottom rings) — structure.js's choice. */
function primaryEdges() {
  const seg = [], face = [];
  for (const st of STRATA_GEOM) {
    const ys = LOFT_RINGS.map((f) => st.top + (st.bot - st.top) * f);
    const order = [...Array(st.n).keys()].sort((p, q) => Math.min(p, st.n - p) - Math.min(q, st.n - q));
    let c = 0;
    for (const j of order) for (const q of [0, 3]) {
      const r = radiusAt(ys[q]);
      if (c >= RENDER.r3.primaryEdges || r <= 1e-6) continue;
      const a0 = (TAU * j) / st.n - Math.PI / st.n, a1 = a0 + TAU / st.n;
      seg.push(Math.sin(a0) * r, ys[q], Math.cos(a0) * r, Math.sin(a1) * r, ys[q], Math.cos(a1) * r);
      face.push(st.i * 16 + j);
      c++;
    }
  }
  return { seg: new Float32Array(seg), face: new Float32Array(face) };
}

export function createKey(ctx) {
  if (!atlas.texture) atlas.init(quality.tier);
  const lawText = ['', '', '', '', '', '', ''], lawDirty = new Uint8Array(7);
  const paintAll = () => { signs.paintStatic(); for (let i = 0; i < 7; i++) if (lawText[i]) signs.paintLaw(i, lawText[i]); };
  paintAll();
  fontsReady().then(() => { paintAll(); signs.paintGlyph(state.data.glyph || []); });

  const group = new Group();
  group.name = 'key';
  // SPEC §6.7: the 5 N slot dots ride in the vertex draw (stratum 6, a row 0.06 m under the apex; styled by marks.js).
  const slotPos = new Float32Array(15), slotFace = new Float32Array(5).fill(6 * 16);
  for (let k = 0; k < 5; k++) { slotPos[k * 3] = (k - 2) * 0.04; slotPos[k * 3 + 1] = STRATA_GEOM[6].bot - 0.06; slotPos[k * 3 + 2] = 0.01; }
  const structure = buildStructure({ perStratum: true, vertices: true, far: 700, strutScale: 0.55, solidEmissive: true, extraVertices: { pos: slotPos, face: slotFace } });
  group.add(structure.group);
  const strata = structure.strata;

  // Primary-edge flash batch (latch twins, codex electrum, touch-down, DIVE focus edge): drawn only while flashing.
  const pe = primaryEdges();
  const flashA = onesStrata();
  const flash = createLines({ segments: pe.seg, faces: pe.face, strata: structure.strataMatrices, strataAlpha: flashA,
    color: 'white', width: RENDER.r3.primaryPx, alpha: 1, glint: 0.3, renderOrder: 3 });
  flash.mesh.name = 'edgeFlash';
  flash.mesh.onBeforeRender = () => { for (let i = 0; i < 7; i++) structure.strataMatrices.value[i].copy(strata[i].matrix); };
  structure.group.add(flash.mesh);
  const fl = { frames: new Int32Array(7), until: new Float64Array(7), token: 'white' };

  const K = {
    group, strata, structure, idle: false, interactive: true, dragging: false, hoverAmt: 0,
    nucleusLocal: new Vector3(),
    pick: (x, y) => key.pick(x, y),
    flashEdges: (i, tk, fr) => key.flashEdges(i, tk, fr),
    yawn: (t) => { nucleus.yawn(t); if (ctx.status) ctx.status.say('night.flinch'); },
    attentive: () => K.interactive && !K.dragging && app.room === 'CORE' && app.phase === 'idle',
    canTouch: () => K.interactive && app.room === 'CORE' && (app.phase === 'idle' || app.phase === 'unfolded'),
    idleYaw: () => idleI.yaw,
  };

  const zFace = faceCentre(3, new Vector3()).z + 0.002;
  const nucleus = createNucleus(group, strata[3], zFace);

  // Axis: core ±1.20 at α .35 + extensions (+len beyond each tip, fading to 0).
  // МОНОЛИТ: the core axis skips the hollow (r 0.30) so it never draws a dark bar across the lit window.
  const axisCore = createLines({ segments: new Float32Array([0, -AXIS.half, 0, 0, -KEY.hollowR, 0, 0, KEY.hollowR, 0, 0, AXIS.half, 0]), color: 'ember', width: AXIS.widthPx, alpha: AXIS.alphaInside, glint: 0.3 });
  // The extensions break behind text, as a centre line does on a drawing: wherever the projected axis would run
  // through a keep-out box (his name and subline, the Ø value, the status line, … ui/keepout.js) it is cut, 4 px clear
  // of the glyphs. Each of the EXT_N fade steps may split into up to 3 pieces (capacity), unused pieces are empty.
  const EXT_N = 8, EXT_CAP = EXT_N * 2 * 3, extSeg = new Float32Array(EXT_CAP * 6), extAlpha = new Float32Array(EXT_CAP);
  const axisExt = createLines({ segments: extSeg, alpha: extAlpha, color: 'ember', width: AXIS.widthPx, glint: 0.3 });
  for (const l of [axisCore, axisExt]) { l.mesh.layers.enable(LAYER.EMISSIVE); l.mesh.renderOrder = 4; group.add(l.mesh); }
  let extLen = -1;
  const brk = new Float32Array(16);            // screen y intervals from keepout
  const cut = new Float32Array(2 * 2 * 8);      // per side: up to 8 (lo, hi) |y| intervals in Key metres
  const cutN = new Int8Array(2), lastCut = new Float32Array(2 * 2 * 8), lastCutN = new Int8Array(2);
  function writeExt() {
    let n = 0;
    for (let s = 0; s < 2; s++) for (let k = 0; k < EXT_N; k++) {
      const sg = s ? -1 : 1, al = AXIS.alphaInside * (1 - (k + 0.5) / EXT_N);
      let a = AXIS.half + (extLen * k) / EXT_N;
      const b = AXIS.half + (extLen * (k + 1)) / EXT_N;
      for (let c = 0; c < cutN[s] && a < b; c++) {
        const lo = cut[(s * 8 + c) * 2], hi = cut[(s * 8 + c) * 2 + 1];
        if (hi <= a || lo >= b) continue;
        if (lo > a && n < EXT_CAP) { const o = n * 6; extSeg[o] = 0; extSeg[o + 1] = sg * a; extSeg[o + 2] = 0; extSeg[o + 3] = 0; extSeg[o + 4] = sg * lo; extSeg[o + 5] = 0; extAlpha[n++] = al; }
        a = Math.max(a, hi);
      }
      if (a < b && n < EXT_CAP) { const o = n * 6; extSeg[o] = 0; extSeg[o + 1] = sg * a; extSeg[o + 2] = 0; extSeg[o + 3] = 0; extSeg[o + 4] = sg * b; extSeg[o + 5] = 0; extAlpha[n++] = al; }
    }
    for (let k = n; k < EXT_CAP; k++) { extSeg.fill(0, k * 6, k * 6 + 6); extAlpha[k] = 0; }
    axisExt.setSegments(extSeg);
    axisExt.mesh.geometry.attributes.aAl.needsUpdate = true;
  }
  function setExt(len) {
    if (len === extLen) return;
    extLen = len;
    writeExt();
    axisExt.mesh.visible = len > 0 && revealA > 0;
  }
  /** Screen y of the Key-local axis point (0, y, 0). */
  const axisY = (y) => { _v.set(0, y, 0).applyMatrix4(group.matrixWorld); return rig.project(_v, _p).y; };
  /** |y| (Key metres, along side sg) whose projection is screen y `ys`, between |y| a and b (monotonic; bisection). */
  function axisInv(ys, sg, a, b) {
    const ya = axisY(sg * a), up = axisY(sg * b) > ya;
    for (let k = 0; k < 14; k++) { const m = (a + b) / 2; if ((axisY(sg * m) < ys) === up) a = m; else b = m; }
    return (a + b) / 2;
  }
  /** Per frame, after the pose: recompute the cuts; rewrite the ribbon only when they moved (≥ 2 mm). */
  function breakExt() {
    if (extLen <= 0 || !rig.camera || !axisExt.mesh.visible) { if (cutN[0] || cutN[1]) { cutN[0] = cutN[1] = 0; lastCutN[0] = lastCutN[1] = 0; writeExt(); } return; }
    let changed = false;
    for (let s = 0; s < 2; s++) {
      const sg = s ? -1 : 1, a = AXIS.half, b = AXIS.half + extLen;
      _v.set(0, sg * a, 0).applyMatrix4(group.matrixWorld); rig.project(_v, _p);
      const xa = _p.x, ya = _p.y;
      _v.set(0, sg * b, 0).applyMatrix4(group.matrixWorld); rig.project(_v, _p);
      const xb = _p.x, yb = _p.y;
      const nb = _p.depth > 0 ? keepout.verticalBreaks((xa + xb) / 2, 1 + Math.abs(xb - xa) / 2, Math.min(ya, yb), Math.max(ya, yb), 4, brk, 28) : 0;
      let m = 0;
      for (let q = 0; q < nb && m < 8; q++) {
        let lo = axisInv(brk[q * 2], sg, a, b), hi = axisInv(brk[q * 2 + 1], sg, a, b);
        if (lo > hi) { const t = lo; lo = hi; hi = t; }
        cut[(s * 8 + m) * 2] = Math.round(lo * 500) / 500; cut[(s * 8 + m) * 2 + 1] = Math.round(hi * 500) / 500; m++;
      }
      cutN[s] = m;
      if (m !== lastCutN[s]) changed = true;
      for (let q = 0; q < m * 2 && !changed; q++) if (cut[s * 16 + q] !== lastCut[s * 16 + q]) changed = true;
    }
    if (!changed) return;
    lastCut.set(cut); lastCutN[0] = cutN[0]; lastCutN[1] = cutN[1];
    writeExt();
  }

  // МОНОЛИТ: the cavern air behind it — a cold backlit haze (billboard 1.6 m behind the Key, never rotating with it) so the
  // silhouette stands out of the dark like something huge in a mine, with a faint warm breath at the heart.
  const hazeU = { uI: { value: 0 }, uWarm: { value: 0 }, cSlate: U.cSlate, cSteel: U.cSteel, cEmberDeep: U.cEmberDeep, cElectrum: U.cElectrum, uNight: U.uNight };
  const haze = new Mesh(new PlaneGeometry(1, 1), new ShaderMaterial({
    uniforms: hazeU, transparent: true, depthWrite: false, blending: AdditiveBlending, premultipliedAlpha: true,
    vertexShader: `varying vec2 vUv; void main() { vUv = position.xy;
      float s = length(modelMatrix[0].xyz); vec4 v = viewMatrix * (modelMatrix * vec4(0.0, 0.05, 0.0, 1.0));
      v.z -= 1.6 * s; v.xy += position.xy * vec2(6.4, 7.6) * s; gl_Position = projectionMatrix * v; }`,
    fragmentShader: `uniform float uI, uWarm, uNight; uniform vec3 cSlate, cSteel, cEmberDeep, cElectrum; varying vec2 vUv;
      void main() { vec2 q = vUv * vec2(1.0, 1.0); float r2 = dot(q, q) * 4.0;
        float a = exp(-r2 * 2.2) * 0.55 + exp(-r2 * 7.0) * 0.45;
        float w = exp(-dot(vUv * vec2(1.6, 2.6), vUv * vec2(1.6, 2.6)) * 9.0);
        vec3 c = mix(cSteel, cSlate, 0.6) * a * uI + mix(cEmberDeep, cElectrum, uNight) * w * uWarm;
        float o = max(c.r, max(c.g, c.b)); if (o <= 0.002) discard; gl_FragColor = vec4(c, o); }`,
  }));
  haze.name = 'keyHaze'; haze.frustumCulled = false; haze.renderOrder = -2;
  group.add(haze);

  // Grains.
  const grains = createGrains((quality.params || TIER_PARAMS.T2).grains);
  group.add(grains.object);
  K.grains = grains;
  bus.on('tier:change', ({ tier }) => { const p = TIER_PARAMS[tier]; if (p) grains.setTierCount(p.grains); });

  const idleI = createIdle(K);
  // A2.7.1 stir: the flinch adds one dust splat at the nucleus with a radial 0.08 m/s impulse toward the hot side
  // (X§2.7 `dust.splat` is public for this). Render-space point and velocity; Key-scale m → render via the group scale.
  const _fp = new Vector3(), _fv = new Vector3();
  bus.on('key:flinch', () => {
    const d = ctx.fx && ctx.fx.dust;
    if (!d || !d.splat || ENV.reducedMotion || app.night) return;
    _fp.copy(K.nucleusLocal).applyMatrix4(group.matrixWorld);
    _fv.copy(idleI.hot).transformDirection(group.matrixWorld).multiplyScalar(0.08 * group.matrixWorld.getMaxScaleOnAxis());
    d.splat(_fp, _fv);
  });
  const H = createHover(K, ctx);
  const D = createDrag(K);
  const marks = createMarks(K);

  // ── Pose state ──
  const yaw = [];
  for (let i = 0; i < 7; i++) yaw.push(new Spring(22, snapZeta(0.04), 0));
  const spin = new Float32Array(7), spinFace = new Int32Array(7);
  const over = [], morph = [];
  for (let i = 0; i < 7; i++) { over.push(null); morph.push(zeroO()); }
  let overG = null, overW = 1;
  const morphG = { scale: 1, nucleus: 1, gap: -1 };
  const gapS = new Spring(6, 1, GAP.rest);
  let litAt = 0, revealFill = 1, revealA = 1, nowMs = 0, curGap = GAP.rest, rebaseAt = -1e9, lawPending = false;
  const shud = { t0: -1, amp: 0 }, wob = { t0: -1, amp: 0, hz: 0, decay: 1, ms: 0 }, bowS = { t0: -1, ms: 600, deg: 8 }, strk = { t0: -1, amp: 0 };
  const quant = { step: 0, lag: 0 };
  const hT = new Float64Array(HIST), hY = new Float32Array(HIST * 7);
  let hHead = 0;
  const dyArr = new Float32Array(7), planeDy = new Float32Array(7);
  const si = { x: 0, y: 0, r: 0, rx: 0, ry: 0 };
  const _v = new Vector3(), _v2 = new Vector3(), _c = new Vector3(), _m = new Matrix4();
  const _p = { x: 0, y: 0, depth: 0, visible: false }, _p2 = { x: 0, y: 0, depth: 0, visible: false };
  const nucleusWorld = new Vector3();
  const pickables = structure.solids.concat([nucleus.mesh]);
  const monoU = structure.solidMaterial ? structure.solidMaterial.uniforms : null;
  // МОНОЛИТ: the solids join the T3 bloom layer (their shader writes only the ember light in that pass), so the seams,
  // the forged letters' lips and the window really glow; the solids also occlude the nucleus bloom behind the metal.
  // That is structure.solidEmissive — one merged draw on LAYER.EMISSIVE (built with solidEmissive: true above).
  const inPause = () => { try { return !!(ctx.fx && ctx.fx.impact && ctx.fx.impact.inPause()); } catch (e) { return false; } };

  function resetMorph() {
    for (let i = 0; i < 7; i++) Object.assign(morph[i], zeroO());
    morphG.scale = 1; morphG.nucleus = 1; morphG.gap = -1;
  }
  /** Cryptex yaw of stratum i as displayed: lagged by quant.lag ms and quantised to quant.step face angles. */
  function shownYaw(i) {
    let y = yaw[i].x;
    if (quant.lag > 0) {
      for (let k = 1; k < HIST; k++) { const j = (hHead - k + HIST) % HIST; if (nowMs - hT[j] >= quant.lag) { y = hY[j * 7 + i]; break; } }
    }
    if (quant.step > 0) { const q = (quant.step * TAU) / STRATA_GEOM[i].n; y = Math.round(y / q) * q; }
    return y;
  }

  // ─── Per frame (ORDER.WORLD; dt is world-scaled) ─────────────────────────────────────────────────────────────
  function update(dt, t) {
    nowMs = t;
    key.screenInfo(si);
    for (let i = 0; i < 7; i++) {
      const s = yaw[i];
      if (spin[i] !== 0) {
        s.x += spin[i] * dt; s.v = 0; s.target = s.x;
        spin[i] *= Math.pow(MOTION.spinDecay, (dt * 1000) / MOTION.frameMs);
        const f = Math.floor(s.x / (TAU / STRATA_GEOM[i].n));
        if (f !== spinFace[i]) { spinFace[i] = f; audio.play('tick', NO_OPTS); }
        if (Math.abs(spin[i]) < 0.35) { spin[i] = 0; s.omega = 6; s.zeta = 1; s.target = Math.round(s.x / TAU) * TAU; }
      }
      s.step(dt);
      hY[hHead * 7 + i] = s.x;
    }
    hT[hHead] = t; hHead = (hHead + 1) % HIST;
    gapS.step(dt);

    idleI.update(dt, t, si);
    const rest = K.interactive && app.room === 'CORE' && app.phase === 'idle' && morphG.gap < 0;
    // A14 dims: drawn as soon as the Key is interactive in CORE, including the boot's ASSEMBLY (6,400, SPEC A2.1.1),
    // not only once the phase is idle; hover/leaders still wait for idle.
    H.update(dt, t, si, rest, rest || (K.interactive && app.room === 'CORE' && app.phase === 'boot' && morphG.gap < 0));
    D.update(dt, t);
    K.hoverAmt = H.amt;
    // Idle blends back over 1,600 ms after a rebase; it holds still while the layers are being read (hover).
    const iw = clamp01((t - rebaseAt) / 1600) * (1 - H.amt);

    let gap = gapS.x;
    if (K.idle) gap += breath.mix(GAP.rest, GAP.breath) - GAP.rest + GAP.leanAdd * idleI.lean * iw;
    gap = lerp(gap, H.gap, H.amt);
    if (morphG.gap >= 0) gap = morphG.gap;
    if (overG && overG.gap != null) gap = lerp(gap, overG.gap, overW);
    curGap = gap;
    U.uGap.value = gap;
    if (lawPending && !inPause()) { lawPending = false; for (let j = 0; j < 7; j++) if (lawDirty[j]) { lawDirty[j] = 0; signs.paintLaw(j, lawText[j]); } }

    const sk = strk.t0 >= 0 ? t - strk.t0 : -1;
    if (sk > 1600) strk.t0 = -1;
    let flashMax = 0;
    for (let i = 0; i < 7; i++) {
      const m = morph[i], o = over[i], w = o ? overW : 0;
      let shv = 0;
      if (sk >= 0) shv = strk.amp * Math.exp(-0.18 * 18 * sk / 1000) * Math.sin(17.7 * sk / 1000 - i * 0.35) * (i % 2 ? -1 : 1);
      const dy = (3 - i) * (gap - GAP.rest) + H.push[i] + m.dy + (o && o.dy ? o.dy * w : 0) + shv * 0.5;
      dyArr[i] = dy;
      let y = shownYaw(i) + iw * (idleI.sway[i] + idleI.lagYaw[i]) + H.turn[i] + m.yaw + (o && o.yaw ? o.yaw * w : 0);
      if (wob.t0 >= 0) {
        const tau = t - wob.t0;
        if (tau > wob.ms) wob.t0 = -1;
        else y += wob.amp * Math.sin((TAU * wob.hz * tau) / 1000 + i * 0.9) * Math.exp(-tau / wob.decay);
      }
      const p = iw * idleI.lagPitch[i] + m.pitch + (o && o.pitch ? o.pitch * w : 0);
      const sR = m.scaleR * (o && o.scaleR != null ? lerp(1, o.scaleR, w) : 1) * (1 - KEY.contract * idleI.flinch) * (1 + shv / STRATA_GEOM[i].rMax);
      const sY = m.scaleY * (o && o.scaleY != null ? lerp(1, o.scaleY, w) : 1);
      const a = m.alpha * (o && o.alpha != null ? lerp(1, o.alpha, w) : 1);
      const ms = m.slide + (o && o.slide ? o.slide * w : 0), hs = H.slide[i];
      strata[i].position.set(Math.sin(y) * ms + H.lx * hs, dy, Math.cos(y) * ms + H.lz * hs);
      strata[i].rotation.set(p, y, 0, 'YXZ');
      strata[i].scale.set(sR, sY, sR);
      structure.setStratumFade(i, a);
      // Edge flash: latch / codex / touch (fl) or a morph / override focus edge.
      let f = Math.max(m.edgeFlash, o && o.edgeFlash ? o.edgeFlash * w : 0);
      if (fl.frames[i] > 0) { fl.frames[i]--; f = 1; }
      else if (fl.until[i] > t) f = 1;
      else if (fl.until[i] > 0 && t - fl.until[i] < TIMING.electrumCool) f = Math.max(f, 1 - (t - fl.until[i]) / TIMING.electrumCool);
      flashA.value[i] = Math.min(1, f) * a;
      flashMax = Math.max(flashMax, flashA.value[i]);
    }
    flash.mesh.visible = flashMax > 0.002 && revealA > 0;
    for (let q = 1; q < 7; q++) planeDy[q] = (dyArr[q - 1] + dyArr[q]) / 2;

    // Group.
    const bw = bowS.t0 >= 0 ? clamp01((t - bowS.t0) / bowS.ms) : -1;
    if (bw >= 1) bowS.t0 = -1;
    const turnToCam = bw >= 0 ? smoothstep(0, 0.3, bw) * (1 - smoothstep(0.75, 1, bw)) : 0;
    const sc = morphG.scale * (overG && overG.scale != null ? lerp(1, overG.scale, overW) : 1) * D.press;
    group.scale.setScalar(sc);
    let gp = iw * idleI.pitch + D.pitch + (overG && overG.pitch ? overG.pitch * overW : 0);
    if (bw >= 0) gp += bowS.deg * DEG * Math.sin(Math.PI * bw);
    const gy = (iw * idleI.yaw + D.yaw) * (1 - turnToCam) + (overG && overG.yaw ? overG.yaw * overW : 0);
    group.rotation.set(gp, gy, overG && overG.roll ? overG.roll * overW : 0, 'YXZ');
    let sx = 0;
    if (shud.t0 >= 0) {
      const tau = t - shud.t0;
      if (tau > TIMING.shudder) shud.t0 = -1;
      else sx = Math.sin((TAU * 3 * tau) / TIMING.shudder) * shud.amp * (1 - tau / TIMING.shudder);
    }
    // Lean: 0.08 m toward the camera, in the parent frame.
    let lx = 0, ly = 0, lz = 0;
    const ln = idleI.lean * iw * IDLE.leanDz;
    if (ln > 1e-5 && rig.camera && group.parent) {
      _v.setFromMatrixPosition(rig.camera.matrixWorld);
      group.parent.worldToLocal(_v).normalize().multiplyScalar(ln);
      lx = _v.x; ly = _v.y; lz = _v.z;
    }
    // SPEC §3.5: the sealed N stratum shudders (not the whole Key).
    if (sx !== 0) strata[6].position.x += sx;
    group.position.set(lx, ly, lz + (overG && overG.dz ? overG.dz * overW : 0));
    group.updateWorldMatrix(true, true);
    nucleusWorld.setFromMatrixPosition(group.matrixWorld);

    grains.update(dt, t, loop.worldNow / 1000, planeDy);
    nucleus.setHot(idleI.hot.x, idleI.hot.y, idleI.hot.z);
    nucleus.morph = morphG.nucleus;
    nucleus.update(K.idle, t, gap, nucleusWorld, strata[3].matrixWorld);
    // МОНОЛИТ: the surface knows where the nucleus burns and how bright (the seams breathe with it).
    hazeU.uI.value = 0.95 * revealA * revealFill;
    hazeU.uWarm.value = 0.22 * (monoU ? monoU.uSeam.value : 0);
    if (monoU && monoU.uNuc) {
      monoU.uNuc.value.copy(nucleusWorld);
      monoU.uNucS.value = group.matrixWorld.getMaxScaleOnAxis();
      const ni = nucleus.mesh.material.uniforms.uI.value * nucleus.reveal;
      monoU.uNucI.value = ni;
      monoU.uSeam.value = Math.max(ni, 0.14) * revealFill;     // asleep, the seams still smoulder
      SPARK.value = Math.min(1, Math.max(0.2, ni * 1.1)) * revealFill;
    }
    H.layout(dt, si);
    breakExt();
    marks.update(revealA);
    if (t - litAt > 2000) { litAt = t; marks.setLitCount(state.litNodes); }
  }

  // ─── API ─────────────────────────────────────────────────────────────────────────────────────────────────────
  const key = {
    group, structure, radius: KEY.radius, nucleusWorld, grains,
    nucleus: nucleus.mesh, glow: nucleus.glow, litNodes: marks.lit,

    faceFrame(i, out) {
      faceCentre(i, _c);
      out.F.copy(_c).applyMatrix4(strata[i].matrixWorld);
      out.n.set(0, 0, 1).transformDirection(strata[i].matrixWorld);
      return out;
    },
    backFaceFrame(i, out) {
      const st = STRATA_GEOM[i];
      if (!st) return out;
      const jb = Math.floor(st.n / 2), a = (TAU * jb) / st.n;
      faceCentre(i, _c, jb);
      out.F.copy(_c).applyMatrix4(strata[i].matrixWorld);
      out.n.set(Math.sin(a), 0, Math.cos(a)).transformDirection(strata[i].matrixWorld);
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
      const s = group.matrixWorld.elements, sc = Math.hypot(s[0], s[1], s[2]);
      _v.setFromMatrixColumn(cam.matrixWorld, 0);
      _v2.copy(nucleusWorld).addScaledVector(_v, KEY.radius * sc); rig.project(_v2, _p2); out.r = Math.abs(_p2.x - _p.x);
      out.rx = (out.r * 0.62) / KEY.radius;
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
      if (!g) return false;
      if (g.type === 'hover' || g.type === 'leave' || g.type === 'wheel' || g.type === 'hold' || g.type === 'longpress') return false;
      return D.onGesture(g, si.r * 0.62 / KEY.radius);
    },
    setInteractive(b) { K.interactive = !!b; if (!b && K.dragging) K.dragging = false; },
    setIdle(b) { K.idle = !!b; },

    setReveal(r) {
      if (!r) return;
      revealFill = r.fill != null ? clamp01(r.fill) : 1;
      revealA = r.alpha != null ? clamp01(r.alpha) : 1;
      // МОНОЛИТ: the forged surface carries its own creases (worn bevels), so the R3 hairlines and the 2 px vertex points
      // recede as the solid fills (DETECTION, fill 0, still shows them at full strength).
      structure.setParts({ vertices: (r.points != null ? clamp01(r.points) : 1) * (1 - 0.9 * revealFill), solid: revealFill,
        edges: 1 - 0.9 * revealFill, lattice: revealFill });
      structure.setFade(revealA);
      for (let q = 0; q < structure.edges.length; q++) structure.edges[q].uniforms.uFlash.value = r.scanY != null ? 0.35 : 0;
      // The axis core and the grains belong to the solid object: DETECTION (points only, fill 0) shows the vertices
      // and nothing else (SPEC-ADDENDUM A2.1.1); they appear with the fill and fade with the alpha.
      const on = revealA > 0 && revealFill > 0;
      axisCore.mesh.visible = on;
      axisExt.mesh.visible = on && extLen > 0;
      nucleus.reveal = revealFill;
      nucleus.setRing(nucleus.ringOn);
      marks.lit.object.visible = on && marks.lit.count > 0;
      grains.setReveal(revealA * revealFill);
    },
    setScramble(angles) {
      for (let i = 0; i < 7; i++) {
        let a = 0;
        if (angles === 'golden') a = i * GOLDEN;
        else if (angles === 'random') a = (Math.random() - 0.5) * TAU;
        else if (Array.isArray(angles)) a = +angles[i] || 0;
        spin[i] = 0;
        yaw[i].snap(Math.atan2(Math.sin(a), Math.cos(a)));
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
          if (opts.onLock) { try { opts.onLock(i); } catch (e) { /* the caller's */ } }
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
    spinStratum(i, angVel) { spin[i] = angVel; spinFace[i] = Math.floor(yaw[i].x / (TAU / STRATA_GEOM[i].n)); },
    ignite(opts = {}) { nucleus.ignite(opts.color, opts.flash); },
    douse() { nucleus.on = false; },
    shootAxis(len = AXIS.extend, ms = AXIS.shootMs) { return tween(ms, (u) => setExt(len * u), EASE.reveal).done; },
    setBreathingRing(on) { nucleus.setRing(on); },

    setMorph(kind, i, tMs, D2) {
      // the gap the morph last asked for: the director applies a travel's end pose (RECALL u = 1 → GAP.rest) and releases
      // the morph in the same call, before any Key frame has drawn it — the release continues from that gap, not from the
      // previous frame's (on a slow frame still RECALL's 0.30 open start, which would then spring shut seconds late)
      const prevGap = morphG.gap;
      resetMorph();
      if (kind === 'dive') {
        const k = D2 > 1600 ? 1.375 : 1, tt = tMs / k;
        const c = clamp01(tt / 120), e = EASE.camera(clamp01((tt - 120) / 360));
        morphG.scale = tt < 120 ? 1 - KEY.contract * EASE.camera(c) : 1 - KEY.contract * (1 - smoothstep(120, 480, tt));
        morphG.nucleus = 1 + (KEY.nucleusAnticipation - 1) * (tt < 120 ? c : 1 - smoothstep(120, 480, tt));
        morphG.gap = lerp(GAP.rest, GAP.dive, e);
        for (let j = 0; j < 7; j++) {
          const m = morph[j];
          if (j === i) { m.slide = KEY.diveSlide * e; m.yaw = -yaw[j].x * e; m.edgeFlash = tt < 120 ? c : 1 - smoothstep(480, 900, tt); }
          else { m.yaw = (j < i ? -1 : 1) * KEY.diveTurnAwayDeg * DEG * e; m.alpha = 1 - smoothstep(480 * k, 1000 * k, tMs); }
        }
      } else if (kind === 'recall') {
        const swapAt = (TIMING.recallSwapAt * D2) / TIMING.recall, tau = tMs - swapAt;
        if (tau < 0) { morphG.gap = GAP.recallStart; return; }
        const x = clamp01(tau / (D2 - swapAt || 200));
        morphG.gap = GAP.rest + (GAP.recallStart - GAP.rest) * (1 - EASE.camera(x)) - (GAP.recallStart - GAP.rest) * MOTION.settleOvershoot * Math.sin(Math.PI * x);
        for (let j = 0; j < 7; j++) if (tau < TIMING.recallRatchetMs * (j + 1)) morph[j].yaw = (j % 2 ? -1 : 1) * 6 * DEG;
      } else {
        const g0 = prevGap >= 0 ? prevGap : curGap;
        if (g0 !== gapS.x) { gapS.snap(g0); gapS.target = GAP.rest; }
      }
    },
    override(i, o) { if (i >= 0 && i < 7) over[i] = o || null; },
    overrideGroup(o) { overG = o || null; },
    setOverrideWeight(w) { overW = clamp01(w); },
    onRebase(kind) {
      resetMorph();
      for (let i = 0; i < 7; i++) { spin[i] = 0; yaw[i].snap(0); }
      D.resetYaw();
      gapS.snap(kind === 'shrink' ? GAP.recallStart : GAP.rest);
      gapS.omega = 4; gapS.target = GAP.rest;
      rebaseAt = nowMs;
    },

    shudder(px = 6) {
      if (ENV.reducedMotion) px = Math.min(px, 2);
      const d = rig.camera ? rig.camera.position.distanceTo(nucleusWorld) : CORE_REST_D;
      shud.amp = (px * d) / Math.max(1, U.uPxPerUnit.value);
      shud.t0 = nowMs;
      marks.flashSlots();                                      // SPEC §3.5: N shudders and its 5 slot dots flash
    },
    addYaw(rad) { D.addYaw(rad); },
    wobble(amp, hz, decayMs, ms) { if (ENV.reducedMotion) return; Object.assign(wob, { t0: nowMs, amp, hz, decay: Math.max(1, decayMs), ms }); },
    bow() { return key.bowTo(8, 600); },
    bowTo(deg, ms) { bowS.t0 = nowMs; bowS.deg = +deg || 8; bowS.ms = Math.max(120, +ms || 600); return new Promise((r) => after(bowS.ms, r)); },
    nudgePitch(deg) { D.nudgePitch(deg); },
    flashNucleus(token, ms) { nucleus.flash(token, ms, nowMs); },
    setNucleusPulse(mult) { nucleus.pulse = mult > 0 ? mult : 1; },

    // ── X§2.8.1 ──
    flashEdges(i, token = 'white', frames) {
      if (!(i >= 0 && i < 7)) return;
      if (token !== fl.token) { fl.token = token; flash.setColor(token === 'electrum' ? 'electrum' : 'white'); }
      if (token === 'electrum' && frames == null) fl.until[i] = nowMs + TIMING.electrum;
      else fl.frames[i] = Math.max(fl.frames[i], Math.max(1, frames | 0));
    },
    setLaw(i, text, cut01) {
      if (!(i >= 0 && i < 7)) return;
      const t = String(text == null ? '' : text);
      if (t !== lawText[i]) {
        lawText[i] = t;
        if (inPause()) { lawDirty[i] = 1; lawPending = true; } else signs.paintLaw(i, t);
      }
      U.uCut.value[i] = clamp01(+cut01 || 0);
    },
    yawTo(deg, ms) { return D.yawTo(deg, ms); },
    isShowingBack() { return D.isShowingBack(); },
    setScrambleQuant(step, lagMs) { quant.step = Math.max(0, +step || 0); quant.lag = Math.max(0, +lagMs || 0); },
    setNucleus(level) { nucleus.level = level == null ? null : clamp01(+level || 0); },
    strike(amp) { if (ENV.reducedMotion) return; strk.amp = Math.max(0, +amp || 0); strk.t0 = nowMs; },
  };

  marks.init();
  // Initial state = the start of any boot: unrevealed, nucleus dark, axis not shot (the boot reveals, ignites, shoots).
  key.setReveal({ points: 0, scanY: null, fill: 0, alpha: 0 });
  key.douse();
  setExt(0);
  void ctx;
  return key;
}
