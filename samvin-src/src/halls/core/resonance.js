// halls/core/resonance.js — WP4. РЕЗОНАНС, hold the Key (SPEC §3.7, §9.6, §10.1, §12.2 sand-text tier rule, §12.4; S01;
// SPEC-ADDENDUM A4.1 Payoff B, A6.5.7 sub-pulse, A12 rest pose). t from the pointerdown:
//   0          grains shiver 0 → 0.01 m over 350 ms, the rising tone starts; < 350 ms and < 8 px = a click; > 8 px = a drag
//   350        RESONANCE: strata lock aligned (80 ms each, top → bottom, ratchet) and recede 0.6 m along −Z; the square plate
//              (1.20 m, 0.8 m in front of the Key, facing the camera): --slate hairline frame, 7 px survey crosses at the
//              corners, `↔ 1.20 М` / `↕ 1.20 М`, MICRO `ПЛАСТИНА · МОДА 1 / 2`; the camera dollies until the plate fills
//              70 % of the height (desktop) / 88 % of the width (phone); readout LABEL РЕЗОНАНС + DATA {nn}% on a leader
//              from the plate's top-left, round(100·t/6000), per frame
//   600 … 5,100 (900 ms) mode steps (1,2) (2,3) (1,4) (3,5) (2,7) (4,7): chunk, vibrate(20), edge strings 2 px, camera
//              tremble 1 px / 120 ms, MICRO update, grains jump to the new nodal targets (sampled in chunks over the step's
//              first 4 frames; delay 0–120, travel 260, arc ∝ |u|); the hidden sub-pulse on 600 + 450·k, −52 → −34 dB,
//              stopping dead at 6,000; its twin uPulse: frame alpha +20 % per beat (antinode kicks in the grain shader)
//   6,000      mode 7: the subject (nextSubject(); guests first while hosting) — sand text if grains ≥ 16,384 and the
//              letter height ≥ 64 px (52 for guests; never on T1), else his / the member's glyph / the sigil; 900 ms flight
//              staggered by distance, arriving --ember and cooling to --white over 1,500 ms; the frame --ember 1,500 ms; the
//              DOM caption 24 px below the plate (HEADING subject + LABEL РЕЗОНАНС 100%); the member chord; S01 the first time
//   release    grains fall at 9.8 m/s² for 700 ms and fade, re-form on the rings over 900 ms; the hiss; the readout counts
//              down to 00% over 300 ms; the strata return (heavy spring); dust drift 0.10 Hz for 1,600 ms
// Reduced motion: figures cut, no tremble, camera cuts; the timings are kept. The timeline runs on the wall clock.
import { Vector3, Matrix4, Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { app, setPhase } from '../../core/store.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01, smoothstep, lerp } from '../../core/ease.js';
import { quality, TIER_PARAMS } from '../../core/quality.js';
import { audio } from '../../audio/engine.js';
import { hz } from '../../audio/notes.js';
import { rig } from '../../render/cameraRig.js';
import { U } from '../../render/uniforms.js';
import { vibrate, VIBE } from '../../ui/tactile.js';
import { WORLD } from '../../data/world.js';
import { CAMERA, coreFov, coreOffY } from '../../core/tokens.js';
import { MODES, sampleNodal, sampleTextTargets, sampleGlyphTargets, nextSubject } from './resonanceModel.js';

const STEPS = [600, 1500, 2400, 3300, 4200, 5100];
const T_START = 350, T_SUBJECT = 6000, SIZE = 1.2, HALF = 0.6;
const PULSE = []; for (let k = 0; k < 12; k++) PULSE.push(600 + 450 * k);
const pad2 = (n) => (n < 10 ? '0' : '') + n;

export function createResonance(hctx, onClick) {
  const ctx = hctx;
  const C = CAMERA.core;
  const restPos = new Vector3(...C.pos);
  const dir = restPos.clone().normalize();
  const plateC = dir.clone().multiplyScalar(0.8);
  const st = {
    phase: 'idle', downAt: 0, downPerf: 0, x: 0, y: 0, mode: -1, sample: null, subject: null, figure: null,
    relAt: 0, relPct: 0, cam: 0, camFrom: 0, recede: 0, emberUntil: 0, tremble: 0, lastPct: -1, voices: [], pulse: null,
    shiverRel: -1, captionOn: false, found: false, beats: [],
  };
  const BEAT = { id: 'subPulse', audio: () => {} };
  // ── the plate: hall-local group at plateC facing the camera ──
  const plate = new Group();
  plate.name = 'resPlate';
  const z = dir.clone(), x = new Vector3(0, 1, 0).cross(z).normalize(), y = z.clone().cross(x).normalize();
  plate.matrix.makeBasis(x, y, z).setPosition(plateC);
  plate.matrixAutoUpdate = false;
  plate.visible = false;
  hctx.group.add(plate);
  // The plate is ONE draw: a dark sheet the sand lies on (the receded Key reads through it only as a silhouette) and its
  // hairline frame, 1 px at any distance (screen-space derivatives) — --silver at 55 % (R3 line; a lit --slate reads
  // as banned blue on the dark sheet), +20 % per sub-pulse beat, --ember for
  // 1,500 ms when the subject forms.
  const fillU = { uA: { value: 0 }, uLine: { value: 0 }, uEmber: { value: 0 }, cAbyss: U.cAbyss, cDeep: U.cDeep, cSilver: U.cSilver, cEmber: U.cEmber };
  const fill = new Mesh(new PlaneGeometry(SIZE, SIZE), new ShaderMaterial({
    uniforms: fillU, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uA, uLine, uEmber; uniform vec3 cAbyss, cDeep, cSilver, cEmber; varying vec2 vUv;
      void main() {
        vec2 q = abs(vUv - 0.5) * 2.0;
        vec3 c = mix(cDeep, cAbyss, smoothstep(0.0, 1.3, length(q * 0.9)));
        vec2 w = max(fwidth(vUv), vec2(1e-6));
        float e = min(min(vUv.x, 1.0 - vUv.x) / w.x, min(vUv.y, 1.0 - vUv.y) / w.y);
        float line = 1.0 - smoothstep(0.6, 1.4, e);
        vec3 lc = mix(cSilver * 0.55, cEmber, uEmber);
        float la = line * max(uLine, uEmber);
        gl_FragColor = vec4(mix(c, lc, la), max(uA * 0.9, la)); }`,
  }));
  fill.renderOrder = 9; fill.frustumCulled = false;
  plate.add(fill);
  const plateM = new Matrix4(), inv = new Matrix4();
  plate.updateMatrixWorld(true);

  // ── DOM: crosses, MICRO mode label, readout (overlay leader), caption ──
  const crosses = [];
  for (let k = 0; k < 4; k++) { const c = document.createElement('span'); c.className = 'core-cross'; hctx.section.appendChild(c); crosses.push(c); }
  const micro = document.createElement('p'); micro.className = 't-micro core-res-micro'; hctx.section.appendChild(micro);
  const caption = document.createElement('div'); caption.className = 'core-res-caption'; caption.dataset.qa = 'res-caption';
  const capMain = document.createElement('p'); const capLab = document.createElement('p'); capLab.className = 't-label core-res-caption__lab';
  caption.append(capMain, capLab); hctx.section.appendChild(caption);
  const readout = document.createElement('div'); readout.className = 'core-res-readout';
  readout.dataset.qa = 'res-readout';
  const roLab = document.createElement('p'); roLab.className = 't-label'; roLab.textContent = 'РЕЗОНАНС';
  const roVal = document.createElement('p'); roVal.className = 't-data core-res-readout__val'; roVal.textContent = '00%';
  readout.append(roLab, roVal);
  let roAnchor = null, dimW = null, dimH = null;
  const _c = [new Vector3(-HALF, HALF, 0), new Vector3(HALF, HALF, 0), new Vector3(HALF, -HALF, 0), new Vector3(-HALF, -HALF, 0)];
  const corner = (k, out) => out.copy(_c[k]).applyMatrix4(plate.matrixWorld);
  const _p = { x: 0, y: 0, depth: 0, visible: false }, _v = new Vector3(), _w = new Vector3();

  function domOn(b) {
    for (const c of crosses) c.classList.toggle('is-in', b);
    micro.classList.toggle('is-in', b);
    if (b && !roAnchor) {
      const phone = hctx.layout.kind !== 'desktop';
      // desktop: the readout hangs left of the plate's top-left corner; phone (the plate spans 88 % of the width): above it
      roAnchor = ctx.overlay.add({ owner: 'core-res', el: readout, scrim: true, cross: true, lowpass: 0, priority: 6,
        leader: phone ? { side: 'right', len: 24, rise: -34 } : { side: 'left', len: 56, rise: 30 }, get: (out) => corner(0, out) });
      dimW = ctx.dims.add({ owner: 'core-res', label: '↔ 1.20 М', offset: 22, side: 'above', a: (o) => corner(0, o), b: (o) => corner(1, o) });
      dimW.setLabelAt(0.8);                     // off the centre line: the receded Key's apex stands there
      // the leader draws in (240 ms); the readout itself is there from the first frame (its value counts from 06%)
      dimW.drawIn(240); roAnchor.drawIn(240); readout.classList.remove('is-pending');
      // the vertical one needs the side margin a phone does not have (the plate already spans 88 % of the width)
      if (!phone) {
        dimH = ctx.dims.add({ owner: 'core-res', label: '↕ 1.20 М', offset: 22, side: 'right', a: (o) => corner(1, o), b: (o) => corner(2, o) });
        dimH.drawIn(240);
      }
    } else if (!b && roAnchor) {
      roAnchor.remove(); roAnchor = null;
      dimsOff();
    }
  }
  function dimsOff() {
    if (dimW) { dimW.remove(); dimW = null; }
    if (dimH) { dimH.remove(); dimH = null; }
  }
  /** release: the frame's furniture goes at once; the readout stays for its 300 ms count-down to 00% */
  function furnitureOff() {
    for (const c of crosses) c.classList.remove('is-in');
    micro.classList.remove('is-in');
    dimsOff();
  }
  function placeDom() {
    if (!rig.camera) return;
    for (let k = 0; k < 4; k++) {
      rig.project(corner(k, _v), _p);
      crosses[k].style.transform = `translate3d(${_p.x.toFixed(1)}px,${_p.y.toFixed(1)}px,0)`;
    }
    rig.project(corner(3, _v), _p);
    // the mode MICRO sits inside the plate's bottom-left corner, on the dark sheet (never over the Key's metal)
    micro.style.transform = `translate3d(${(_p.x + 12).toFixed(1)}px,${(_p.y - 24).toFixed(1)}px,0)`;
    _w.set(0, -HALF, 0).applyMatrix4(plate.matrixWorld);
    rig.project(_w, _p);
    caption.style.transform = `translate3d(${_p.x.toFixed(1)}px,${(_p.y + 24).toFixed(1)}px,0) translateX(-50%)`;
  }

  // ── targets ──
  const grains = () => (ctx.key ? ctx.key.grains : null);
  let buf = null;
  function ensureBuf(n) { if (!buf || buf.length < n * 2) buf = new Float32Array(n * 2); return buf; }
  /** schedule nodal sampling for mode k (chunks of count/4 per frame), commit when done */
  function startSampling(k) {
    const g = grains();
    if (!g) return;
    ensureBuf(g.count);
    st.sample = { k, done: 0, n: g.count, per: Math.max(1, Math.ceil(g.count / 4)) };
  }
  function pumpSampling() {
    const s = st.sample, g = grains();
    if (!s || !g) return;
    const [n, m] = MODES[s.k];
    const c = Math.min(s.per, s.n - s.done);
    sampleNodal(n, m, c, buf, s.done);
    for (let i = s.done * 2; i < (s.done + c) * 2; i++) buf[i] *= HALF;
    g.writeTargets(s.done, buf.subarray(s.done * 2, (s.done + c) * 2), c);
    s.done += c;
    if (s.done >= s.n) { st.sample = null; g.commitTargets({ delayMaxMs: 120, travelMs: 260, arc: true, cut: ENV.reducedMotion, nm: MODES[s.k] }); }
  }
  function plateHeightPx() {
    if (!rig.camera) return 600;
    rig.project(corner(0, _v), _p); const y0 = _p.y;
    rig.project(corner(3, _v), _p);
    return Math.abs(_p.y - y0);
  }
  function plateWidthPx() {
    if (!rig.camera) return 600;
    rig.project(corner(0, _v), _p); const x0 = _p.x;
    rig.project(corner(1, _v), _p);
    return Math.abs(_p.x - x0);
  }
  function subjectTargets() {
    const g = grains();
    const guests = (() => { try { const G = ctx.host && ctx.host.guests; return G && G.active && typeof G.list === 'function' ? G.list() : []; } catch (e) { return []; } })();
    const sub = nextSubject({ guests });
    st.subject = sub;
    const count = g ? g.count : 0;
    const tierOk = (quality.params || TIER_PARAMS[app.tier] || TIER_PARAMS.T2).sandText !== false && app.tier !== 'T1';
    const len = Math.max(1, (sub.text || '').length);
    const letterPx = Math.min(0.30 * plateHeightPx(), (0.80 * plateWidthPx()) / (len * 0.62));
    const minPx = sub.kind === 'guest' ? 52 : 64;
    ensureBuf(Math.max(1, count));
    let mode = 'glyph';
    if (sub.text && tierOk && count >= 16384 && letterPx >= minPx && sampleTextTargets(sub.text, count, buf)) mode = 'text';
    else sampleGlyphTargets(sub.glyph || WORLD.clan.sigil, count, buf);
    for (let i = 0; i < count * 2; i++) buf[i] *= HALF;
    if (g) g.writeTargets(0, buf, count);
    st.figure = mode;
    return sub;
  }

  // ── lifecycle ──
  function press(g) {
    st.phase = 'press';
    st.downPerf = performance.now(); st.downAt = st.downPerf;
    st.x = g.x; st.y = g.y;
    st.shiverRel = -1;
    const v = audio.start('resRise', { k: 0 });
    if (v) st.voices.push(v);
    startPulse();
  }
  function startPulse() {
    if (!(ctx.fx && ctx.fx.pulse) || st.pulse) return;
    st.pulse = ctx.fx.pulse.run({ steps: PULSE, t0: st.downPerf, level01: 0, stopAt: st.downPerf + T_SUBJECT });
    // each beat is also planned on the cue clock (the voice above already sounds it): the cue log then shows the grid
    // the pulse was audible on — 600 + 450·k from the press, nothing after 6,000
    if (ctx.fx.cue) for (let k = 0; k < PULSE.length; k++) st.beats.push(ctx.fx.cue.at(st.downPerf + PULSE[k], BEAT));
  }
  function stopPulse() {
    if (st.pulse) { st.pulse.stop(); st.pulse = null; }
    for (const b of st.beats) b.cancel();
    st.beats.length = 0;
  }
  function dropPress() {
    st.phase = 'idle';
    st.shiverRel = performance.now();
    stopVoices(120);
    stopPulse();
  }
  function stopVoices(ms) { for (const v of st.voices) { try { v.stop(ms); } catch (e) { /* gone */ } } st.voices.length = 0; }

  function begin() {
    st.phase = 'active';
    st.mode = -1; st.subject = null; st.figure = null; st.emberUntil = 0; st.captionOn = false; st.found = false;
    setPhase('resonance');
    hctx.bus.emit('resonance:change', { active: true, mode: 0 });
    const key = ctx.key;
    if (key) {
      key.setInteractive(false); key.setIdle(false);
      key.lockSequence({ order: 'down', stepMs: 80, spin: false, snap: 0.04 });
      key.setOverrideWeight(1);
    }
    const g = grains();
    if (g) { g.setPlate(plateM, SIZE); g.setMode('plate'); g.object.renderOrder = 12; }     // the sand draws on the plate
    const sub = audio.start('resSub', {});
    if (sub) st.voices.push(sub);
    plate.visible = true;
    st.camFrom = 0;
    micro.textContent = 'ПЛАСТИНА · МОДА 1 / 2';
    domOn(true);
    caption.classList.remove('is-in');
    startPulse();
    startSampling(0);
  }
  function step(k) {
    st.mode = k;
    audio.play('chunk', {});
    vibrate(VIBE.step);
    if (ctx.edges) ctx.edges.twitch(2);
    if (!ENV.reducedMotion) rig.tremble(1, 120);
    const [n, m] = MODES[k];
    micro.textContent = `ПЛАСТИНА · МОДА ${n} / ${m}`;
    for (const v of st.voices) { try { if (v.set) v.set({ k }); } catch (e) { /* gone */ } }
    if (st.pulse && st.pulse.set) st.pulse.set({ level01: (0.75 * k) / 5 });
    hctx.bus.emit('resonance:change', { active: true, mode: k });
    if (k > 0) startSampling(k);
    else { const s = st.sample; if (s && s.k === 0) { /* already sampling since 350 ms */ } }
  }
  function subject() {
    st.mode = 6;
    const sub = subjectTargets();
    const g = grains();
    if (g) g.flyToTargets({ ms: 900, stagger: 'distance', coolMs: 1500, cut: ENV.reducedMotion });
    st.emberUntil = performance.now() + 1500;
    capMain.className = sub.captionClass === 't-body' ? 't-body core-res-caption__main' : 't-heading core-res-caption__main';
    capMain.textContent = sub.caption;
    capLab.textContent = 'РЕЗОНАНС 100%';
    caption.classList.add('is-in');
    st.captionOn = true;
    micro.classList.remove('is-in');
    const notes = WORLD.members.map((m) => hz(m.note)).filter((f) => f > 0);
    audio.play('resChord', { hz: notes });
    hctx.bus.emit('resonance:change', { active: true, mode: 6 });
    if (ctx.secrets && !ctx.secrets.isFound('S01')) {
      rig.project(_w.copy(plateC), _p);
      ctx.secrets.discover('S01', { anchor: { x: _p.x, y: _p.y } });
    }
  }
  function release() {
    if (st.phase !== 'active') { if (st.phase === 'press') dropPress(); return; }
    st.phase = 'release';
    st.relAt = performance.now();
    st.relPct = app.resonancePct;
    const g = grains();
    if (g) { if (st.sample) st.sample = null; g.setMode('fall'); g.shiver(0); }
    audio.play('hiss', {});
    stopVoices(200);
    stopPulse();
    if (audio.bed && audio.bed.dust) { try { audio.bed.dust({ drift: 0.10, ms: 1600 }); } catch (e) { /* bed */ } }
    furnitureOff();
    caption.classList.remove('is-in');
    micro.classList.remove('is-in');
    // the hold is over the moment he lets go: the phase returns at once, the fall / re-form / strata return play out
    // under it (this module still owns the input until finish())
    if (app.phase === 'resonance') setPhase('idle');
    hctx.bus.emit('resonance:change', { active: false, mode: Math.max(0, st.mode) });
  }
  function abort() {
    stopVoices(40);
    stopPulse();
    st.sample = null;
    const g = grains();
    if (g) { g.setMode('rings'); g.shiver(0); }
    domOn(false);
    caption.classList.remove('is-in');
    micro.classList.remove('is-in');
    if (ctx.key) ctx.key.setOverrideWeight(1);
    st.cam = 0; st.recede = 0;
    hctx.bus.emit('resonance:change', { active: false, mode: 0 });
    finish();
  }
  function finish() {
    st.phase = 'idle';
    domOn(false);
    plate.visible = false;
    fillU.uA.value = 0; fillU.uLine.value = 0; fillU.uEmber.value = 0;
    const g = grains(); if (g) g.object.renderOrder = 0;
    app.resonancePct = 0;
    st.figure = null;
    if (ctx.key) { ctx.key.overrideGroup(null); ctx.key.setInteractive(true); ctx.key.setIdle(true); }
    if (app.phase === 'resonance') setPhase('idle');
  }

  // ── per frame ──
  const grp = { dz: 0 };
  function update(dt) {
    // the hold is measured on the wall clock (the press is), so the mode steps and the sub-pulse grid (perf time, fx/cue)
    // stay one grid even when frames are long
    const now = performance.now();
    const g = grains();
    // the press shiver (0 → 0.01 m over 350 ms) and its death over 200 ms
    if (st.phase === 'press' || st.phase === 'active') {
      const a = clamp01((now - st.downAt) / T_START) * 0.01;
      if (g) g.shiver(st.phase === 'active' && st.mode >= 6 ? 0 : a);
      if (st.phase === 'press' && now - st.downAt >= T_START + 40) begin();      // the hold gesture normally starts it
    } else if (st.shiverRel >= 0) {
      const x = clamp01((now - st.shiverRel) / 200);
      if (g) g.shiver(0.01 * (1 - x));
      if (x >= 1) st.shiverRel = -1;
    }
    if (st.phase === 'active') {
      const t = now - st.downAt;
      if (st.sample) pumpSampling();
      for (let k = Math.max(0, st.mode + 1); k < STEPS.length; k++) if (t >= STEPS[k]) step(k); else break;
      if (st.mode < 6 && t >= T_SUBJECT) subject();
      app.resonancePct = Math.min(100, Math.round((100 * t) / T_SUBJECT));
      st.recede = clamp01((t - T_START) / 600);
      st.cam = ENV.reducedMotion ? 1 : clamp01((t - T_START) / 700);
    } else if (st.phase === 'release') {
      const x = clamp01((now - st.relAt) / 300);
      app.resonancePct = Math.round(st.relPct * (1 - x));
      if (x >= 1 && roAnchor && now - st.relAt >= 420) domOn(false);     // 00% read for a beat, then the readout goes
      const r = clamp01((now - st.relAt) / 900);
      st.recede = 1 - r; st.cam = ENV.reducedMotion ? 0 : 1 - r;
      if (r >= 1 && x >= 1) finish();
    }
    if (st.phase === 'active' || st.phase === 'release') {
      if (st.lastPct !== app.resonancePct) { st.lastPct = app.resonancePct; roVal.textContent = `${pad2(app.resonancePct)}%`; }
      grp.dz = -0.6 * (ENV.reducedMotion ? (st.recede > 0 ? 1 : 0) : EASE.camera(st.recede));
      if (ctx.key) ctx.key.overrideGroup(grp);
      // the plate frame: --slate hairline, +20 % per sub-pulse beat; --ember for 1,500 ms at the subject
      const show = st.phase === 'active' ? smoothstep(T_START, T_START + 200, now - st.downAt) : 1 - clamp01((now - st.relAt) / 240);
      const pulse = U.uPulse ? U.uPulse.value : 0;
      const em = now < st.emberUntil ? 1 : st.emberUntil > 0 ? 1 - clamp01((now - st.emberUntil) / 300) : 0;
      fillU.uLine.value = Math.min(1, show * 0.9 * (1 + 0.2 * pulse));
      fillU.uEmber.value = show * em;
      fillU.uA.value = show;
      // the grains follow the plate (the Key recedes and keeps its drift: plate-local → Key-local every frame)
      if (ctx.key && g) {
        plate.updateMatrixWorld(true);
        inv.copy(ctx.key.group.matrixWorld).invert();
        plateM.multiplyMatrices(inv, plate.matrixWorld);
        g.setPlate(plateM, SIZE);
      }
      placeDom();
    }
    void dt;
  }

  // ── camera: the plate fills 70 % of the height (desktop) / 88 % of the width (phone) ──
  function plateDist() {
    const t = Math.tan((coreFov(hctx.layout.kind) * Math.PI) / 360);
    if (hctx.layout.kind === 'desktop') return SIZE / (0.70 * 2 * t);
    const aspect = Math.max(0.2, hctx.layout.w / Math.max(1, hctx.layout.h));
    return SIZE / (0.88 * 2 * t * aspect);
  }

  return {
    mode: () => (st.phase === 'active' || st.phase === 'release' ? st.figure : null),
    /** perf ms of the press that started the current hold (null when none) — the test hook's `t0` */
    t0: () => (st.phase === 'idle' ? null : Math.round(st.downPerf * 10) / 10),
    pressing: () => st.phase !== 'idle',
    cancelPress() { if (st.phase === 'press') dropPress(); },
    cancel() { if (st.phase === 'press') dropPress(); else if (st.phase === 'active') release(); if (st.phase === 'release') finish(); },
    livePose(out) {
      if (st.cam <= 0 || (st.phase !== 'active' && st.phase !== 'release')) return false;
      const w = EASE.camera(st.cam);
      _v.copy(plateC).addScaledVector(dir, plateDist());
      out.pos.copy(restPos).lerp(_v, w);
      out.target.set(0, 0, 0).lerp(plateC, w);
      out.fov = coreFov(hctx.layout.kind);
      // the plate sits a little above centre, so its caption clears the status line (desktop) / the Key band (phone)
      out.offsetY = lerp(coreOffY(hctx.layout.kind), hctx.layout.kind === 'desktop' ? -0.075 : coreOffY(hctx.layout.kind), w);
      out.roll = 0;
      return true;
    },
    onGesture(g) {
      const key = ctx.key;
      if (st.phase === 'active' || st.phase === 'release') {
        if (g.type === 'up' && st.phase === 'active' && g.t < T_START && Math.hypot(g.tx, g.ty) < 8) {
          // the hold fired only because a long frame delayed the lift (the input layer times the press on the events'
          // own clock): it was a click — take the resonance back at once and let the click happen
          abort();
          if (onClick && key) onClick(key.pick(g.x, g.y));
          return true;
        }
        if (g.type === 'up' || g.type === 'cancel' || g.type === 'dragend') { if (st.phase === 'active') release(); return true; }
        return g.type !== 'hover' && g.type !== 'leave' && (g.type !== 'wheel' || st.phase === 'release');
      }
      if (st.phase === 'press') {
        if (g.type === 'hold') { begin(); return true; }
        if (g.type === 'tap') { dropPress(); return false; }                   // a click: the Key handles it
        if (g.type === 'dragstart' || g.type === 'cancel' || g.type === 'pinchstart') { dropPress(); return false; }
        if (g.type === 'up') { if (g.afterHold) { release(); return true; } dropPress(); return false; }
        return false;
      }
      if (g.type === 'down' && app.phase === 'idle' && !hctx.director.busy() && key && app.room === 'CORE') {
        if (g.button > 0) return false;
        const used = key.onGesture(g);          // the Key takes its own 'down' (touch press, stratum pick)
        if (key.pick(g.x, g.y) >= 0) { press(g); return true; }
        return used;
      }
      return false;
    },
    onKey(e) {
      if ((st.phase === 'active') && e.key === 'Escape') { release(); return true; }
      return false;
    },
    update,
    resize() {},
    dispose() {
      if (st.phase !== 'idle') { this.cancel(); finish(); }
      domOn(false);
      fill.geometry.dispose(); fill.material.dispose();
      if (plate.parent) plate.parent.remove(plate);
      for (const c of crosses) c.remove();
      micro.remove(); caption.remove();
    },
    _st: st,
  };
}
