// halls/core/pull.js — WP4. Depth in the folded CORE: the normal zoom, THE INFINITE PULL and the DESCENT (SPEC §3.8,
// §5.2 wheel, §10.1 pinch, §12.4; SPEC-ADDENDUM A2.3 scale figure, A2.4.2 S02 first swap, A2.8 ears, A3.3 КОДЕКС height,
// A12.1 rest pose).
//   zoom     camera distance 3.2–12.0 m from the nucleus (×1.1 per 100 px of wheel; pinch by its factor)
//   PULL     at 12 m, continued wheel-out / pinch-out (no pause > 400 ms) engages: s += deltaY/2400 | 1.5·log10(f),
//            d = 12·e^(6.9078·s), elevation eases to +8°; at s = 1 the world is rebased ×1/1000 (n += 1, pull:swap)
//   DESCENT  at 3.2 m, continued wheel-in / pinch-in: d = 0.06·e^(−6.9078·s) toward the nucleus (s starts where d = 3.2,
//            so the move is continuous); at s = 1 the world is rebased ×1000 (n −= 1); ears muffled by s, pop at the swap
//   settle   600 ms after the input stops: the camera eases to the rest pose over 1,600 ms (cubic-bezier .7,0,.15,1);
//            after a swap: the strata spin and lock, the nucleus flashes, LEAD + MICRO МАСШТАБ … · ВЛОЖЕННОСТЬ n,
//            status «ты всё ещё внутри sam.vin.». The first swap ever: latch gen 1 ×7 → ПАУЗА 400 → hit → S02.
// A swap spends the gesture: further input of the same stroke is absorbed until it pauses (one stroke = one level).
// Reduced motion: one notch / pinch = one stage, cut with the 280 ms slice; the swap and the payoff are kept.
import { Vector3 } from 'three';
import { app, setPhase } from '../../core/store.js';
import { bus } from '../../core/bus.js';
import { loop } from '../../core/loop.js';
import { after } from '../../core/clock.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01, smoothstep, lerp } from '../../core/ease.js';
import { state } from '../../core/state.js';
import { thin } from '../../core/ru.js';
import { scaleEngine } from '../../render/scale.js';
import { rig } from '../../render/cameraRig.js';
import { fog } from '../../render/fog.js';
import { nest } from '../../world/nest.js';
import { audio } from '../../audio/engine.js';
import { vibrate, VIBE } from '../../ui/tactile.js';
import { codeCapHeightM, STRATA_GEOM } from '../../world/structure.js';
import { createEmitter } from '../../render/glow.js';
import { earnedStrata } from '../../deeds/deedsModel.js';
import { CAMERA, coreFov, coreOffY, ZOOM, PULL, DESCENT, CORE_REST_D, STRUT_TICKS_PER_S, NUCLEUS } from '../../core/tokens.js';

const DEG = Math.PI / 180;
const K = PULL.k;
const S_D0 = Math.log(DESCENT.d0 / ZOOM.min) / DESCENT.k;          // ≈ −0.576: the descent's s where d = 3.2 m
const LATCH_PANS = [0, 0, 0, -0.3, 0.3, -0.5, 0.5];                // the boot's latch pans (A2.1.1)
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const RATE_OUT = 0.55, RATE_IN = 0.8;                                 // s per second, at most
const sup = (n) => String(n).split('').map((c) => SUP[+c] || c).join('');
const MINUS = '−';

/** {d} М for the counter: thin-space thousands, one decimal under 10, millimetres below 1 m. */
export function fmtDist(d) {
  if (d >= 10) return `${thin(Math.round(d))} М`;
  if (d >= 1) return `${d.toFixed(1)} М`;
  const mm = d * 1000;
  if (mm >= 10) return `${thin(Math.round(mm))} ММ`;
  if (mm >= 1) return `${mm.toFixed(1)} ММ`;
  return `${mm.toFixed(mm >= 0.1 ? 2 : 3)} ММ`;
}
/** МАСШТАБ … · ВЛОЖЕННОСТЬ n (SPEC §3.8; n ≥ 4 → 10^{3n}; a descent reads the other way). */
export function scaleLine(n) {
  const a = Math.abs(n);
  const big = a >= 4 ? `10${sup(3 * a)}` : thin(Math.pow(1000, a));
  const scale = n >= 0 ? `1 : ${big}` : `${big} : 1`;
  return `МАСШТАБ ${scale} · ВЛОЖЕННОСТЬ ${n < 0 ? MINUS + a : a}`;
}
/** Stage MICRO by the equivalent distance (the descent reads the mini-world's stages: d·1000). */
export function stageOf(dEq) {
  for (const [name, lim] of PULL.stages) if (dEq < lim) return name;
  return PULL.stages[PULL.stages.length - 1][0];
}

export function createPull(hctx, api) {
  const ctx = hctx;
  const C = CAMERA.core;
  const REST_D = CORE_REST_D;
  const E_REST = Math.atan2(C.pos[1], Math.hypot(C.pos[0], C.pos[2]));
  const YAW_REST = Math.atan2(C.pos[0], C.pos[2]);
  const st = {
    mode: 'zoom', d: REST_D, e: E_REST, yaw: YAW_REST, s: 0, sT: 0, sV: 0, vYaw: 0, dragging: false,
    lastIn: -1e9, lastOut: -1e9, lastInward: -1e9, spent: false, swapped: 0, swapDir: 'out', settle: null,
    hint: null, ticks: 0, tickAt: -1e9, lastD: REST_D, phaseOwned: false, figure: false, codexOn: -1, rdStage: 0, earned: [],
  };
  const _v = new Vector3();

  // ── DOM: the counter (a giant vertical dimension line at the right third, DATA, stage MICRO, КОДЕКС MICRO) ──
  const el = document.createElement('div');
  el.className = 'core-counter';
  el.setAttribute('aria-hidden', 'true');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
  svg.setAttribute('class', 'core-counter__dim'); svg.setAttribute('width', '40'); svg.setAttribute('height', '100');
  svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
  path.setAttribute('vector-effect', 'non-scaling-stroke');
  svg.appendChild(path);
  const read = document.createElement('div'); read.className = 'core-counter__read';
  const mk = (cls) => { const p = document.createElement('p'); p.className = cls; read.appendChild(p); return p; };
  const dataEl = mk('t-data core-counter__data'), stageEl = mk('t-micro core-counter__stage'), codexEl = mk('t-micro core-counter__codex');
  codexEl.dataset.qa = 'pull-codex'; codexEl.hidden = true;
  el.append(svg, read);
  hctx.section.appendChild(el);
  dataEl.dataset.qa = 'pull-counter';
  const slice = document.createElement('div');
  slice.className = 'core-slice';
  hctx.section.appendChild(slice);
  let counterOn = false, lastText = '', lastStage = '';
  function layoutCounter() {
    const h = hctx.layout.h, H = Math.round(h * 0.6);
    svg.setAttribute('height', String(H));
    svg.setAttribute('viewBox', `0 0 40 ${H}`);
    // dimension line at x 20: extension ticks, open 6 px arrowheads, the line itself
    path.setAttribute('d', `M8 0.5L32 0.5M8 ${H - 0.5}L32 ${H - 0.5}M20 1L20 ${H - 1}M14.5 10L20 1L25.5 10M14.5 ${H - 10}L20 ${H - 1}L25.5 ${H - 10}`);
  }
  layoutCounter();
  function showCounter(b) {
    if (b === counterOn) return;
    counterOn = b;
    el.classList.toggle('is-in', b);
  }
  function writeCounter(text, stage) {
    if (text !== lastText) { lastText = text; dataEl.textContent = text; }
    if (stage !== lastStage) { lastStage = stage; stageEl.textContent = stage; }
  }

  // The mini Key's nucleus light (DESCENT): the nest's mini glow obeys the level-glow rule (off this close), so the last
  // stretch into the 2.4 mm Key's own ember glow is drawn here — the frame warms the way the Key's nucleus fills the frame
  // just after the swap, so the ×1000 cut lands light-on-light instead of dark-on-gold.
  const mini = createEmitter({ color: 'ember', radius: NUCLEUS.glowR * 0.001, intensity: 0, depthTest: false, fog: false, renderOrder: 6 });
  mini.object.name = 'miniNucleusGlow';
  hctx.group.add(mini.object);

  // ── helpers ──
  const dPull = (s) => PULL.d0 * Math.exp(K * s);
  const dDesc = (s) => DESCENT.d0 * Math.exp(-DESCENT.k * s);
  const reduced = () => ENV.reducedMotion;
  const deep = () => st.mode === 'pull' || st.mode === 'descent' || st.mode === 'held' || st.mode === 'settle';
  function own(b) {
    if (b === st.phaseOwned) return;
    st.phaseOwned = b;
    if (b) {
      setPhase('pull');
      if (ctx.key) ctx.key.setInteractive(false);
      if (ctx.datum) ctx.datum.setVisible(false);
      if (ctx.fx && ctx.fx.scaleFigure && !st.figure) { st.figure = true; ctx.fx.scaleFigure.show('pull'); }
      voiceStart();
    } else {
      if (app.phase === 'pull') setPhase('idle');
      if (ctx.key) ctx.key.setInteractive(true);
      if (ctx.datum) ctx.datum.setVisible(true);
    }
  }
  let voice = null;
  const vp = { d: 12 };
  function voiceStart() { if (!voice) voice = audio.start('shepard', { d: PULL.d0 }); }
  function voiceStop() { if (voice) { try { voice.stop(800); } catch (e) { /* gone */ } voice = null; } }

  function engage(kind) {
    st.mode = kind;
    st.s = st.sT = kind === 'pull' ? 0 : S_D0;
    st.sV = 0;
    st.swapped = 0;
    st.spent = false;
    st.settle = null;
    st.rdStage = 0;
    st.e0 = st.e;
    st.earned = earnedStrata();          // read once per engage (no per-frame allocation)
    own(true);
    showCounter(true);
  }

  /** Feed one input step: ds > 0 = outward (wheel-out, pinch closing). */
  function feed(ds, now, wheel) {
    st.lastIn = now;
    if (st.mode === 'payoff') return;
    if (st.mode === 'settle') {
      if (st.settle && st.settle.swapped) return;            // the payoff is coming: absorbed
      // input during a plain settle takes the camera back from where it is
      st.settle = null;
      if (st.d > ZOOM.max) { st.mode = 'pull'; st.s = st.sT = Math.log(st.d / PULL.d0) / K; st.sV = 0; }
      else if (st.d < ZOOM.min) { st.mode = 'descent'; st.s = st.sT = -Math.log(st.d / DESCENT.d0) / DESCENT.k; st.sV = 0; }
      else { st.mode = 'zoom'; own(false); }
      if (st.mode !== 'zoom') { showCounter(true); voiceStart(); }
    }
    if (st.mode === 'held') {
      // the swap spent this stroke: absorbed until it pauses (lastIn keeps the settle waiting)
      return;
    }
    if (st.mode === 'zoom') {
      const f = Math.exp(ds * (wheel ? Math.log(ZOOM.wheelFactor) * PULL.wheelDiv / ZOOM.wheelStepPx : Math.LN10 / PULL.pinchGain));
      const out = ds > 0;
      const atMax = st.d >= ZOOM.max - 1e-3, atMin = st.d <= ZOOM.min + 1e-3;
      const cont = out ? now - st.lastOut <= PULL.pauseMs : now - st.lastInward <= PULL.pauseMs;
      if (out) st.lastOut = now; else st.lastInward = now;
      if (out && atMax && cont) { engage('pull'); feed(ds, now, wheel); return; }
      if (!out && atMin && cont) { engage('descent'); feed(ds, now, wheel); return; }
      st.d = Math.max(ZOOM.min, Math.min(ZOOM.max, st.d * f));
      return;
    }
    if (st.mode === 'pull') { st.lastOut = now; st.sT += ds; }
    else if (st.mode === 'descent') { st.lastInward = now; st.sT -= ds; }
  }

  // ── reduced motion: one notch = one stage, cut with the 280 ms slice ──
  const RD_OUT = [ZOOM.max, 340, 2400, 9000];               // КЛЮЧ edge · ЗАЛ ЯДРА · VIN · VIN ЦЕЛИКОМ, then the swap
  const RD_IN = [ZOOM.min, 0.34, 0.012];                    // the mini-world's VIN · ЗАЛ ЯДРА · КЛЮЧ, then the swap
  let cutting = false, queued = 0, queuedOut = true;
  function cut(fn) {
    if (cutting) return;
    cutting = true;
    slice.classList.remove('is-run'); void slice.offsetWidth; slice.classList.add('is-run');
    after(140, () => {
      try { fn(); } finally {
        after(140, () => {
          cutting = false; slice.classList.remove('is-run');
          // a notch that came during the slice is not lost: it plays next
          if (queued > 0) { queued--; reducedNotch(queuedOut, loop.now); }
        });
      }
    });
  }
  function reducedNotch(out, now) {
    st.lastIn = now;
    if (cutting) { if (st.mode !== 'held' && st.mode !== 'settle' && st.mode !== 'payoff') { queued = Math.min(4, queued + 1); queuedOut = out; } return; }
    if (st.mode === 'held' || st.mode === 'settle' || st.mode === 'payoff') return;
    if (st.mode === 'zoom') {
      if (out && st.d < ZOOM.max - 1e-3) { cut(() => { st.d = ZOOM.max; }); return; }
      if (!out && st.d > ZOOM.min + 1e-3) { cut(() => { st.d = ZOOM.min; }); return; }
      engage(out ? 'pull' : 'descent');
      st.rdStage = 0;
    }
    if (st.mode === 'pull' && out) {
      st.rdStage++;
      cut(() => {
        if (st.rdStage < RD_OUT.length) { st.d = RD_OUT[st.rdStage]; st.s = st.sT = Math.log(st.d / PULL.d0) / K; st.e = pullElev(st.s); }
        else { st.s = st.sT = 1; swap('out'); }
      });
    } else if (st.mode === 'descent' && !out) {
      st.rdStage++;
      cut(() => {
        if (st.rdStage < RD_IN.length) { st.d = RD_IN[st.rdStage]; st.s = st.sT = -Math.log(st.d / DESCENT.d0) / DESCENT.k; }
        else { st.s = st.sT = 1; swap('in'); }
      });
    } else {
      // reversing direction steps back to the normal zoom
      cut(() => { leaveDeep(); });
    }
  }
  const pullElev = (s) => lerp(E_REST, PULL.elevationDeg * DEG, smoothstep(0, 0.5, s));

  function leaveDeep() {
    st.mode = 'zoom';
    st.d = Math.max(ZOOM.min, Math.min(ZOOM.max, st.d));
    st.e = E_REST;
    fog.factor('pull', 1);
    if (ctx.fx && ctx.fx.ears) ctx.fx.ears.descent(0);
    if (ctx.rim) ctx.rim.setAlpha(1);
    nest.setFade(2, 0);
    mini.setIntensity(0);
    showCounter(false);
    voiceStop();
    hideFigure(0);
    own(false);
  }
  function hideFigure(delay) {
    if (!st.figure) return;
    const go = () => { if (st.figure && !deep()) { st.figure = false; if (ctx.fx && ctx.fx.scaleFigure) ctx.fx.scaleFigure.hide(240); } };
    if (delay > 0) after(delay, go); else go();
  }

  // ── THE SWAP (s = 1): one frame, the world rescaled, n ± 1 ──
  function swap(dir) {
    if (dir === 'out') {
      nest.setFade(2, 1);                         // parent VIN becomes VIN (level 1) after the shift
      scaleEngine.rebase('shrink');
      scaleEngine.n += 1;
      st.d = PULL.d0;
    } else {
      nest.setFade(-1, 1);                        // the mini Key becomes the Key (level 0)
      scaleEngine.rebase('grow');
      scaleEngine.n -= 1;
      st.d = DESCENT.d0;
      if (ctx.fx && ctx.fx.ears) { ctx.fx.ears.descent(0); ctx.fx.ears.popAt(performance.now()); }
    }
    nest.setFade(-1, 0); nest.setFade(2, 0); nest.setFade(1, 1); nest.setFade(0, 1);
    mini.setIntensity(0);
    app.pullNest = scaleEngine.n;
    const n = scaleEngine.n;
    state.patch((d) => { d.maxNest = Math.max(d.maxNest | 0, Math.abs(n)); });
    st.s = st.sT = 0; st.sV = 0;
    st.swapped += 1; st.swapDir = dir;
    st.mode = 'held';
    st.lastIn = loop.now;
    fog.factor('pull', 1);
    if (ctx.rim) ctx.rim.setAlpha(0);
    vibrate(VIBE.lock);
    bus.emit('pull:swap', { n, dir });
  }

  function startSettle(now) {
    st.mode = 'settle';
    st.settle = { t0: now, d0: st.d, e0: st.e, y0: st.yaw, swapped: st.swapped > 0, ms: reduced() ? 0 : PULL.settleMs };
    showCounter(false);
    voiceStop();
    if (ctx.fx && ctx.fx.ears) ctx.fx.ears.descent(0);
    st.settle.spun = !st.settle.swapped;
    if (reduced()) cut(() => { st.d = REST_D; st.e = E_REST; st.yaw = YAW_REST; if (st.settle && st.settle.swapped && ctx.key) ctx.key.setScramble('golden'); });
  }
  function endSettle() {
    const sw = st.settle && st.settle.swapped;
    st.settleEndAt = performance.now();
    st.settle = null;
    st.d = REST_D; st.e = E_REST; st.yaw = YAW_REST;
    if (ctx.rim) ctx.rim.setAlpha(1);
    if (!sw) { st.mode = 'zoom'; hideFigure(0); own(false); return; }
    st.mode = 'payoff';
    st.payoffAt = st.settleEndAt;          // QA: the settle end that led to this payoff (and the first one, kept)
    if (st.firstPayoffAt == null) st.firstPayoffAt = st.settleEndAt;
    payoff().catch(() => {}).then(() => { if (st.mode === 'payoff') { st.mode = 'zoom'; own(false); } });
  }

  // ── the payoff: strata spin and lock, the nucleus flashes, the LEAD (A2.4.2: the first swap ever pauses first) ──
  async function payoff() {
    const key = ctx.key, fx = ctx.fx;
    const n = scaleEngine.n, dir = st.swapDir;
    const first = !(ctx.secrets && ctx.secrets.isFound('S02'));
    const lead = () => {
      st.mode = 'zoom';
      own(false);
      // the payoff is read without the hover explode on top of it: the Key takes the pointer back 1,200 ms into the LEAD
      if (key) { key.setInteractive(false); after(1200, () => { if (st.mode === 'zoom' && !st.phaseOwned && app.phase === 'idle') key.setInteractive(true); }); }
      const text = dir === 'in' ? 'Внутри ключа — снова ключ' : 'Ты всё ещё внутри SAM.VIN';
      if (ctx.status) ctx.status.say('pull');
      st.leadUntil = loop.now + PULL.leadMs + 600;
      const p = ctx.lead ? ctx.lead.show(text, { ms: PULL.leadMs, micro: scaleLine(n) }) : null;
      hideFigure(PULL.leadMs);
      return p;
    };
    if (!first) {
      if (key) await key.lockSequence({ order: 'down', stepMs: 120, spin: false, snap: 0.04 });
      if (key) key.flashNucleus('white', 120);
      lead();
      return;
    }
    // A2.4.2: latch gen 1 × 7 at 120 ms (the boot pans; twin: a 1-frame --white edge flash), then ПАУЗА 400, then the hit.
    const latchAll = () => new Promise((res) => {
      for (let i = 0; i < 7; i++) {
        const V = performance.now() + i * 120 + 30;
        const visual = () => { if (key) { key.alignStratum(i, { spring: 'light', overshoot: 0.04 }); key.flashEdges(i, 'white', 1); } if (i === 6) after(160, res); };
        if (fx && fx.cue) fx.cue.at(V, { id: 'latch', audio: (T) => audio.play('latch', { gen: 1, n: i, pan: LATCH_PANS[i], when: T }), visual });
        else after(i * 120 + 30, () => { audio.play('latch', { gen: 1, n: i, pan: LATCH_PANS[i] }); visual(); });
      }
    });
    const hit = () => {
      if (key) key.flashNucleus('white', 17);
      audio.play('recallThud', {});                   // the thump's body (no thump-only layer in the registry)
      if (ctx.edges) ctx.edges.twitch(2);
      const a = key ? key.screenInfo({ x: 0, y: 0, r: 0, rx: 0, ry: 0 }) : null;
      if (ctx.secrets) ctx.secrets.discover('S02', { anchor: a ? { x: a.x, y: a.y } : null });
    };
    const run = async (h) => {
      await latchAll();
      if (h && h.reduced) { hit(); return; }
      if (fx && fx.impact) await fx.impact.pause({ kind: 's02', at: performance.now(), onHit: hit });
      else hit();
    };
    if (fx && fx.stage) await fx.stage.run('s02', run);
    else await run(null);
    lead();
  }

  const moved = () => (st.mode !== 'zoom' && st.mode !== 'payoff') || Math.abs(st.d - REST_D) > 1e-4 || !!st.hint;

  // ── per frame (hall update) ──
  function update(dt, t) {
    const now = t;
    // the motion hint (S02): zoom out 15 % and back, the counter flashes 12.0 М
    if (st.hint) {
      const x = (now - st.hint.t0) / 1200;
      if (x >= 1) { st.hint = null; showCounter(false); } else if (x > 0.85) showCounter(false);
    }
    if (st.mode === 'held') {
      writeCounter(fmtDist(st.d), stageOf(st.swapDir === 'out' ? st.d : st.d * 1000));
      if (now - st.lastIn >= PULL.settleIdleMs) startSettle(now);
    }
    if (st.mode === 'pull' || st.mode === 'descent') {
      if (!reduced()) {
        // s follows the input (τ 80 ms); after release the s-velocity decays ×0.92 per frame
        const prev = st.s;
        const k = 1 - Math.exp(-dt / 0.08);
        // the journey keeps its screen time: however hard the flick, s moves ≤ RATE per second (a full PULL ≥ 1.8 s)
        // and never more than 0.05 per frame, so even a slow device draws every stage of the journey (≥ 20 frames)
        const lim = Math.min(0.05, (st.mode === 'pull' ? RATE_OUT : RATE_IN) * dt);
        st.s += Math.max(-lim, Math.min(lim, (st.sT - st.s) * k));
        const idle = now - st.lastIn > 60;
        if (idle) { st.sT += st.sV * (dt * 1000 / 16.7); st.sV *= Math.pow(PULL.decay, dt * 1000 / 16.7); }
        else st.sV = st.sV * 0.7 + 0.3 * (st.s - prev) / Math.max(1e-3, dt * 1000 / 16.7);
      }
      if (st.mode === 'pull') {
        if (st.s < 0 && st.sT < 0) { st.d = ZOOM.max; leaveDeep(); return; }
        if (st.s >= 1 || st.sT >= 1 && st.s > 0.995) { swap('out'); return; }
        st.d = dPull(Math.max(0, st.s));
        st.e = pullElev(Math.max(0, st.s));
        fog.factor('pull', Math.min(1, PULL.d0 / st.d));
        nest.setFade(2, smoothstep(600, 9000, st.d));
        if (ctx.rim) ctx.rim.setAlpha(1 - smoothstep(30, 240, st.d));
      } else {
        if (st.s < S_D0 && st.sT < S_D0) { st.d = ZOOM.min; leaveDeep(); return; }
        if (st.s >= 1 || st.sT >= 1 && st.s > 0.995) { swap('in'); return; }
        st.d = dDesc(Math.max(S_D0, st.s));
        // the descent levels out on the way in, so the camera flies through the lit • window into the nucleus
        st.e = lerp(st.e0 != null ? st.e0 : E_REST, 0, smoothstep(S_D0, S_D0 * 0.35, st.s));
        fog.factor('pull', Math.max(1, DESCENT.d0 / st.d));
        if (ctx.fx && ctx.fx.ears) ctx.fx.ears.descent(clamp01(st.s));
        mini.setIntensity(smoothstep(0.004, 0.0006, st.d));
      }
      // reduced motion: each notch is a still stage he reads — the stepwise PULL waits twice as long before settling
      if (now - st.lastIn >= (reduced() ? 2 * PULL.settleIdleMs : PULL.settleIdleMs) && Math.abs(st.sV) < 2e-4 && Math.abs(st.sT - st.s) < 0.01) startSettle(now);
      // strut ticks while the camera passes the CORE ring's lattice (d 300–620 m), ≤ 30 per second
      if (st.mode === 'pull' && st.d >= PULL.passLatticeD[0] && st.d <= PULL.passLatticeD[1]) {
        const speed = Math.abs(st.d - st.lastD) / Math.max(1e-3, dt);
        const rate = Math.min(STRUT_TICKS_PER_S, speed / 20);
        if (rate > 0.5 && now - st.tickAt >= 1000 / rate) { st.tickAt = now; audio.play('strutTick', {}); }
      }
      st.lastD = st.d;
      if (voice) { vp.d = st.d; try { voice.set(vp); } catch (e) { /* gone */ } }
      const dEq = st.mode === 'pull' ? st.d : st.d * 1000;
      writeCounter(fmtDist(st.d), stageOf(dEq));
      codex();
      // «ТЫ» belongs to the PULL from the engage on: if the hover explode's retract (it shares the figure) took it down
      // as the PULL began, it is put back at once
      const fig = ctx.fx && ctx.fx.scaleFigure;
      if (st.figure && fig && st.mode === 'pull' && !fig.state().visible) fig.show('pull');
    }
    if (st.mode === 'settle' && st.settle) {
      const S = st.settle;
      const x = S.ms > 0 ? clamp01((now - S.t0) / S.ms) : 1;
      const w = EASE.camera(x);
      st.d = Math.exp(lerp(Math.log(S.d0), Math.log(REST_D), w));
      st.e = lerp(S.e0, E_REST, w);
      st.yaw = lerp(S.y0, YAW_REST, w);
      if (ctx.rim) ctx.rim.setAlpha(smoothstep(0.5, 1, x));
      // the payoff's spin: the strata start turning 600 ms before the camera lands, so they are still spinning at the lock
      if (!S.spun && x >= 0.62 && ctx.key) { S.spun = true; for (let i = 0; i < 7; i++) ctx.key.spinStratum(i, (i % 2 ? -1 : 1) * (6 + 0.7 * i)); }
      if (x >= 1 && !cutting) endSettle();
    }
    // orbit inertia (drag during the PULL)
    if (!st.dragging && Math.abs(st.vYaw) > 1e-5 && (st.mode === 'pull' || st.mode === 'descent' || st.mode === 'held')) {
      st.yaw += st.vYaw * (dt * 1000 / 16.7);
      st.vYaw *= Math.pow(0.92, dt * 1000 / 16.7);
    }
  }

  // A3.3: «КОДЕКС · ВЫСОТА БУКВ {h} М» while an earned law's back face on VIN's hull faces the camera within 40°.
  const _n = new Vector3(), _f = new Vector3(), _cam = new Vector3();
  function codex() {
    let best = -1, bestDot = Math.cos(40 * DEG);
    if (st.mode === 'pull' && st.d >= 600 && rig.camera) {
      const list = st.earned;
      scaleEngine.toCanonical(rig.camera.position, _cam);
      for (let q = 0; q < list.length; q++) {
        const i = list[q], g = STRATA_GEOM[i], jb = Math.floor(g.n / 2), a = (2 * Math.PI * jb) / g.n;
        _n.set(Math.sin(a), 0, Math.cos(a));
        _f.copy(_n).multiplyScalar(1000 * g.rMax * 0.9); _f.y = 1000 * g.mid;
        const c = _v.copy(_cam).sub(_f).normalize().dot(_n);
        if (c >= bestDot) { bestDot = c; best = i; }
      }
    }
    if (best !== st.codexOn) {
      st.codexOn = best;
      codexEl.hidden = best < 0;
      if (best >= 0) codexEl.textContent = `КОДЕКС · ВЫСОТА БУКВ ${Math.round(codeCapHeightM(best, 1000))} М`;
    }
  }

  const self = {
    get mode() { return st.mode; },
    /** the settle LEAD is on screen */
    leading: () => loop.now < (st.leadUntil || 0),
    /** phase 'pull' belongs to this module (engage → payoff LEAD) */
    busy: () => st.phaseOwned,
    get d() { return st.d; },
    deep,
    /** true while the camera is not at the rest pose (zoomed, pulled, settling, hinting) */
    moved,
    onGesture(g) {
      const now = loop.now;
      if (g.type === 'wheel') {
        if (!g.deltaY) return true;
        if (reduced()) { if (Math.abs(g.deltaY) >= 1) reducedNotch(g.deltaY > 0, now); return true; }
        feed(g.deltaY / PULL.wheelDiv, now, true);
        return true;
      }
      if (g.type === 'pinchstart') return true;
      if (g.type === 'pinch') {
        const f = g.dScale > 0 ? g.dScale : 1;
        if (Math.abs(f - 1) < 1e-4) return true;
        if (reduced()) return true;
        feed(PULL.pinchGain * Math.log10(1 / f), now, false);
        return true;
      }
      if (g.type === 'pinchend') {
        if (reduced() && Math.abs((g.scale || 1) - 1) > 0.08) reducedNotch(g.scale < 1, now);
        return true;
      }
      if (st.mode === 'payoff' || (st.mode === 'settle' && st.settle && st.settle.swapped)) return g.type !== 'hover' && g.type !== 'leave';
      if (deep() && st.mode !== 'settle') {
        if (g.type === 'down') return true;
        if (g.type === 'dragstart') { st.dragging = true; st.vYaw = 0; return true; }
        if (g.type === 'drag' && st.dragging) { const dy = -g.dx * 0.004; st.yaw += dy; st.vYaw = dy; return true; }
        if (g.type === 'dragend' || g.type === 'cancel') { st.dragging = false; return true; }
        if (g.type === 'tap' || g.type === 'up') return true;
      }
      return false;
    },
    livePose(out) {
      if (!moved()) return false;
      let d = st.d;
      if (st.hint) { const x = clamp01((loop.now - st.hint.t0) / 1200); d *= 1 + 0.15 * Math.sin(Math.PI * EASE.camera(x)); }
      const ce = Math.cos(st.e);
      out.pos.set(Math.sin(st.yaw) * ce * d, Math.sin(st.e) * d, Math.cos(st.yaw) * ce * d);
      out.target.set(0, 0, 0);
      out.fov = coreFov(hctx.layout.kind); out.offsetY = coreOffY(hctx.layout.kind); out.roll = 0;
      return true;
    },
    update,
    /** S02 motion hint (SPEC §8.3): the Key zooms out and back by 15 %, the counter flashes 12.0 М. */
    hint() {
      if (st.mode !== 'zoom' || reduced()) { if (reduced()) { writeCounter('12.0 М', stageOf(12)); showCounter(true); after(900, () => { if (!deep()) showCounter(false); }); } return; }
      st.hint = { t0: loop.now };
      writeCounter('12.0 М', stageOf(12));
      showCounter(true);
    },
    /** back to the rest pose at once (departure, unfold) */
    reset() {
      if (deep()) leaveDeep();
      st.d = REST_D; st.e = E_REST; st.yaw = YAW_REST; st.settle = null; st.hint = null; st.mode = 'zoom';
      showCounter(false);
    },
    resize() { layoutCounter(); },
    /** hidden tab: the live voice stops; it restarts on return if the PULL is still running */
    sleep(b) { if (b) voiceStop(); else if (st.mode === 'pull' || st.mode === 'descent') voiceStart(); },
    dispose() {
      leaveDeep();
      if (el.parentNode) el.parentNode.removeChild(el);
      if (slice.parentNode) slice.parentNode.removeChild(slice);
      mini.dispose();
    },
    _st: st,
  };
  if (__DEV__) {
    // QA only (dev build): hold the PULL at s with the camera at yaw (no input, no settle) / let it settle. The
    // SwiftShader harness delivers a wheel stroke in pieces 0.4–3 s apart, so a pose-dependent check (КОДЕКС) cannot
    // rely on one continuous stroke reaching a given distance and yaw.
    self._qaHold = (s, yaw) => {
      if (st.mode !== 'pull') engage('pull');
      st.s = st.sT = s; st.sV = 0; if (yaw != null) st.yaw = yaw;
      st.lastIn = loop.now + 1e9;
    };
    self._qaRelease = () => { st.lastIn = loop.now; };
  }
  void api;
  return self;
}
