// fx/pathDeco.js — the path decorators (SPEC-ADDENDUM A2.2, A6.5.4; ARCH-ADDENDUM X§2.5.9 "Path decorators"). OWNER: WP12.
// DIVE: rack focus (0–120 → the sign face, aperture 0 → 3; tracking the face; 3 → 0 over the arrival), the scale bar
// (fades in at 120, counts 1 М → 10 М → 100 М → 1 000 М with a planned tick {n} per step, holds to 1,400, out by 1,520),
// the sub-drop and the arrival lock planned on the cue clock with the lock's own reverse tail ending on its onset; the
// first DIVE ever adds ПРОСВЕТ at 1,240 (warm frame before) and the strut dimension line `↔ 1.61 СМ` that re-reads
// `↔ 16.1 М` on the swap frame. RECALL: the scale bar backwards (240–1,000, out by 1,120, ticks at −2 % steps), subRise,
// reverseTail('thud') ending on the planned 42 Hz thud at 1,000, the planned lock. LIFT: the planned lock and its tail.
// SLICE (reduced motion / T0): `×1 000` under the level mark on arrival in a hall from CORE.
// path.fx(u, o) is PURE in u (tables sampled once at decoration); the cue plan is made on the path's first frame from
// director.predict() and re-made on ×3 / retarget; while scrubbing nothing is planned and cues fire as u crosses them.
import { Vector3 } from 'three';
import { registerDecorator, createPoseOut } from '../nav/paths.js';
import { tOfU, msU } from '../nav/pathKit.js';
import { ROOMS } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { scaleEngine } from '../render/scale.js';
import { rig } from '../render/cameraRig.js';
import { audio } from '../audio/engine.js';
import { bus } from '../core/bus.js';
import { ENV } from '../core/env.js';
import { after } from '../core/clock.js';
import { perf, tickClock, clk } from './cue.js';

const N = 96;
const fmt3 = (v) => v.toPrecision(3);

export function createPathDeco(F) {
  const { ctx } = F;
  const scratch = createPoseOut();
  const _f = { F: new Vector3(), n: new Vector3() }, _c = new Vector3(), _t = new Vector3();
  let cur = null, plan = [], speed = 1, strut = null, sliceFrom = null, drv = false;

  function item(ms, id, audioFn, visual) { return { ms, id, audio: audioFn, visual, h: null, fired: false, pin: false }; }
  const play = (name, p) => (T) => audio.play(name, { ...p, when: T });

  registerDecorator((path, info) => {
    const k = path.kind, D = path.duration;
    if (k === 'SLICE' || F.t0) return;                         // reduced motion / T0: only the `×1 000` label (below)
    if (info.reduced || (k !== 'DIVE' && k !== 'RECALL' && k !== 'LIFT')) return;
    const to = ROOMS[path.to] || ROOMS[info.to] || ROOMS.CORE;
    const root = to.root || 146.83;
    const its = [];
    // A reverse tail must END on its event: endAt is the event's own planned audible time (predicted on the path clock),
    // so a late-scheduled start (a slow frame) shortens the swell instead of pushing the cut past the event.
    // The event is re-timed to that same prediction and pinned there: a tail's end is fixed once its voice exists.
    const endAt = (ev, T, ms) => {
      const V = ctx.director ? ctx.director.predict(ev.ms) : null;
      if (V != null && ev.h) ev.h.move(V);
      ev.pin = true;
      const e = V != null ? audio.fx.ctxTimeFor(V) : NaN;
      return Number.isFinite(e) && e >= T ? e : T + ms / 1000;
    };
    const lock = item(D, 'arrivalLock', play('arrivalLock', { root }));
    its.push(item(D - 360, 'reverseTail:lock', (T) => audio.play('reverseTail', { src: 'lock', endAt: endAt(lock, T, 360), ms: 360, rate: root / 146.83, when: T })));
    its.push(lock);
    path.planned = new Set(['arrivalLock']);
    const d = { kind: k, first: false, sw: path.swapAt, D, tabS: null, tabF: null, R: (b) => b };
    if (k !== 'LIFT' && path.swapAt > 0) {
      // Pure tables over u: pre-swap world scale s and the canonical focus distance.
      d.tabS = new Float32Array(N + 1); d.tabF = new Float32Array(N + 1);
      let Fc = null;
      if (k === 'DIVE' && ctx.key && Math.abs(scaleEngine.s - 1) < 1e-6) { ctx.key.faceFrame(path.stratum | 0, _f); Fc = _f.F.clone(); }
      for (let j = 0; j <= N; j++) {
        const u = j / N;
        path.pose(Math.min(u, 1), scratch);
        d.tabS[j] = u < path.swapAt ? Math.log10(Math.max(1e-6, scratch.s)) : (k === 'DIVE' ? 3 : -3);
        const s = Math.max(1e-9, scratch.s);
        _c.copy(scratch.cam.pos).sub(scratch.Q).multiplyScalar(1 / s);
        if (u < path.swapAt && Fc) d.tabF[j] = Math.max(0.05, _c.distanceTo(Fc));
        else { _t.copy(scratch.cam.target).sub(scratch.Q).multiplyScalar(1 / s); d.tabF[j] = Math.max(0.05, _c.distanceTo(_t)); }
      }
      const crossAt = (lv) => { for (let j = 1; j <= N; j++) { const a = d.tabS[j - 1], b = d.tabS[j]; if ((a - lv) * (b - lv) <= 0 && a !== b) return tOfU((j - 1 + (lv - a) / (b - a)) / N, D); } return -1; };
      if (k === 'DIVE') {
        d.first = !!path.first;
        d.R = d.first ? (b) => (b < 1000 ? b * 1.375 : b * 1.375 + 200) : (b) => (b * D) / 1600;
        if (!path.retarget) { path.planned.add('subDrop'); its.push(item(d.R(480), 'subDrop', play('subDrop', {}))); }
        for (let n = 1; n <= 3; n++) { const t = crossAt(n - 1e-6); if (t >= 0) its.push(item(t, 'tick', play('tick', { n }))); }
        if (d.first) {
          its.push(item(1240 - 20, 'warm', null, () => F.impact.warm()));   // the frame before the hold
          its.push(item(1240, 'prosvet', null, () => F.impact.prosvet({ kind: 'dive' })));
        }
      } else {
        d.R = (b) => (b * D) / 1200;
        path.planned.add('recallThud');
        its.push(item(d.R(240), 'subRise', play('subRise', {})));
        const thud = item(d.R(1000), 'recallThud', play('recallThud', {}));
        its.push(item(d.R(500), 'reverseTail:thud', (T) => audio.play('reverseTail', { src: 'thud', endAt: endAt(thud, T, 500), ms: 500, when: T })));
        its.push(thud);
        for (let n = 1; n <= 3; n++) { const t = crossAt(-n + 1e-6); if (t >= 0) its.push(item(t, 'tick', play('tick', { n: 4 - n }))); }
      }
    }
    path.fxDeco = d; path.fxPlan = its;
    path.fx = (u, o) => {
      const t = tOfU(u, D);
      o.deco = d; o.t = t;
      o.scaleDir = k === 'DIVE' ? 'dive' : 'recall';
      if (!d.tabS) { o.sb = 0; o.aperturePx = 0; o.strutDim = 0; return; }
      const x = Math.min(N, Math.max(0, u * N)), j = Math.min(N - 1, Math.floor(x)), f = x - j;
      o.scaleS = Math.pow(10, d.tabS[j] + (d.tabS[j + 1] - d.tabS[j]) * f);
      o.focalM = d.tabF[j] + (d.tabF[j + 1] - d.tabF[j]) * f;
      const R = d.R;
      if (k === 'DIVE') {
        o.sb = t < R(120) ? 0 : t < R(1400) ? 1 : t < R(1520) ? 2 : 0;
        o.aperturePx = t < R(120) ? (3 * t) / R(120) : t < R(1200) ? 3 : Math.max(0, 3 * (1 - (t - R(1200)) / (D - R(1200))));
        o.strutDim = d.first ? (t < 1240 ? 0 : u < path.swapAt ? 1 : t < 2000 ? 2 : t < 2240 ? 3 : 0) : 0;
      } else {
        o.sb = t < R(240) ? 0 : t < R(1000) ? 1 : t < R(1120) ? 2 : 0;
        o.aperturePx = 0; o.strutDim = 0;
      }
    };
  });

  // ── Strut dimension line (first DIVE, A2.2.2): the two adjacent struts of stratum i's far wall nearest the view centre
  //    (the wall the lens looks at from inside the lattice), at the camera's height; the value is the true spacing
  //    perimeter_i / k_i in Key units (3 s.f.). The WP0 DIVE path cuts its camera at the swap (in fog), so on the swap
  //    frame the line keeps its place ON SCREEN — the same line, the same strut in the picture — and re-reads in hall
  //    units: its ends are re-anchored at the same screen points and at the same depth ×(1000 / s). The value is a
  //    .t-label --white block above the 0.5 px --slate line (the dims label stays empty so the short span keeps its line
  //    and arrowheads visible; a 1.6 cm span is ≈ 27 px at the far wall).
  const _pa = { x: 0, y: 0, depth: 0, visible: false }, _pb = { x: 0, y: 0, depth: 0, visible: false };
  function strutBegin(i) {
    if (!ctx.dims || !ctx.key || !ctx.overlay) return;
    ctx.key.faceFrame(i, _f);                                     // live (render space): the face has turned and slid
    const st = STRATA_GEOM[i];
    const Fc = scaleEngine.toCanonical(_f.F, new Vector3());
    const nh = new Vector3(_f.n.x, 0, _f.n.z).normalize(), tg = new Vector3(-nh.z, 0, nh.x);
    const s = { st, nh, tg, Fc, y: st.mid, sp: 0.016, label: '', d: null, k: 1, v: -1, lk: 0,
      A: new Vector3(), B: new Vector3(), M: new Vector3(), fixed: false, fixing: false, sa: { x: 0, y: 0, d: 0 }, sb: { x: 0, y: 0, d: 0 }, sPre: 1 };
    const back = (y) => (st.n % 2 ? radiusAt(y) : Math.cos(Math.PI / st.n) * radiusAt(y)) + Math.cos(Math.PI / st.n) * radiusAt(st.mid);
    const pt = (sign, out) => out.copy(s.Fc).addScaledVector(s.nh, -back(s.y)).addScaledVector(s.tg, sign * s.sp / 2)
      .setY(s.Fc.y + s.y - s.st.mid);
    // The swap re-anchoring runs inside the getters (ORDER.OVERLAY), i.e. after the rig has applied this frame's camera.
    const fix = () => {
      if (!s.fixing || !rig.camera) return;
      const k = 1000 / Math.max(1e-6, s.sPre);
      s.fixing = false;
      // No valid pre-swap screen record (a scrub or a stalled frame jumped past the lattice frames, or an end was behind
      // the lens): the line cannot keep its place across the swap, so it ends (never a NaN anchor).
      if (!(s.sa.d > 0 && s.sb.d > 0)) { s.bad = true; return; }
      rig.unproject(s.sa.x, s.sa.y, s.sa.d * k, s.A); rig.unproject(s.sb.x, s.sb.y, s.sb.d * k, s.B);
      if (!(Number.isFinite(s.A.x + s.A.y + s.A.z) && Number.isFinite(s.B.x + s.B.y + s.B.z))) { s.bad = true; return; }
      s.fixed = true;
    };
    s.a = (out) => { fix(); return s.fixed ? out.copy(s.A) : scaleEngine.toRender(pt(-1, out), out); };
    s.b = (out) => { fix(); return s.fixed ? out.copy(s.B) : scaleEngine.toRender(pt(1, out), out); };
    s.d = ctx.dims.add({ owner: 'fx', side: 'above', offset: 6, label: '', a: s.a, b: s.b });
    s.g = document.querySelector('#leaders > g.dim:last-of-type');
    const el = document.createElement('span');
    el.className = 't-label fx-sd';
    el.dataset.qa = 'strut-dim';
    s.txt = document.createElement('span');
    el.append(s.txt);
    s.lab = el;
    s.an = ctx.overlay.add({ owner: 'fx', id: 'strut', el, scrim: false, lowpass: 0, priority: 6, hideBehind: false,
      get: (out) => { s.a(out); s.b(_t); return out.add(_t).multiplyScalar(0.5); } });
    s.d.drawIn(120);
    el.style.transition = 'none';                                  // appears at once when its line has drawn (no .anchor fade)
    el.classList.add('fx-out');
    s.inAt = perf() + 120;                                         // the value appears as the line's draw completes
    strut = s;
  }
  function strutEnd() { if (strut) { strut.d.remove(); strut.an.remove(); strut = null; } }
  // Past the swap the hall-unit reading is always seen for ≥ 150 ms, even when a slow frame jumps over its window.
  function strutLinger() {
    const s = strut;
    if (!s || s.ending) return;
    s.ending = true;
    if (!s.mAt) { s.fixing = true; s.k = 1000; s.mAt = perf(); s.txt.textContent = s.label = `↔ ${fmt3(s.sp * 1000)} М`; }
    s.inAt = 0; s.lab.classList.remove('fx-out');
    after(Math.max(0, 150 - (perf() - s.mAt)), () => { if (strut === s) strutEnd(); });
  }
  function strutFrame(mode, t) {
    const s = strut;
    if (!s) return;
    if (s.bad) { strutEnd(); return; }
    if (s.ending) return;
    if (mode === 0) { if (s.sa.d > 0 && t >= 2000) strutLinger(); else strutEnd(); return; }   // 0 after the swap window
    if (mode === 1 && rig.camera && !s.fixed) {
      const y = scaleEngine.toCanonical(rig.camera.position, _c).y - s.Fc.y + s.st.mid;
      s.y = Math.max(s.st.bot, Math.min(s.st.top, y));
      s.sp = (2 * s.st.n * radiusAt(s.y) * Math.sin(Math.PI / s.st.n)) / s.st.k;
      s.k = 1;
      rig.project(s.a(_c), _pa); rig.project(s.b(_c), _pb);    // remembered for the swap frame
      s.sa.x = _pa.x; s.sa.y = _pa.y; s.sa.d = _pa.depth; s.sb.x = _pb.x; s.sb.y = _pb.y; s.sb.d = _pb.depth;
      s.sPre = scaleEngine.s;
    } else if (mode >= 2 && !s.fixed && !s.fixing) {
      s.fixing = true; s.k = 1000; s.mAt = perf();
    }
    const v = Math.round((s.k === 1 ? s.sp * 100 : s.sp * 1000) * 1e3);   // the label is rebuilt only when it changes
    if (v !== s.v || s.k !== s.lk) {
      s.v = v; s.lk = s.k;
      const l = s.k === 1 ? `↔ ${fmt3(s.sp * 100)} СМ` : `↔ ${fmt3(s.sp * 1000)} М`;
      if (l !== s.label) { s.label = l; s.txt.textContent = l; }
    }
    if (s.inAt && perf() >= s.inAt) { s.inAt = 0; s.lab.classList.remove('fx-out'); }
    const fade = mode === 3 && perf() - (s.mAt || 0) >= 150;      // the hall-unit reading is always seen (≥ 150 ms)
    if (fade && !s.lab.classList.contains('fx-out')) { s.lab.style.transition = 'opacity 240ms linear'; s.lab.classList.add('fx-out'); }
    if (s.g) s.g.classList.toggle('fx-out', fade);
  }

  const mk = (it, V) => F.cue.at(V, {
    id: it.id,
    audio: it.audio ? (T) => { it.fired = true; it.audio(T); } : null,
    visual: () => { it.fired = true; if (it.visual) it.visual(); },
  });
  function replan(st) {
    const now = perf();
    for (const it of plan) {
      if (it.h) { it.h.cancel(); it.h = null; }
      if (it.fired || it.ms < st.t - 1) continue;
      const V = ctx.director.predict(it.ms);
      if (V == null) continue;
      it.h = mk(it, Math.max(V, now));
    }
  }

  bus.on('travel:end', ({ completed, kind }) => {
    // A completed DIVE / RECALL / LIFT always gets its arrival lock (and RECALL its thud): if the planned cue has not started its voice yet
    // (a slow last frame), it is re-planned onto this arrival frame; everything else not yet started is dropped.
    const keep = !!cur && completed && kind !== 'SLICE';
    let late = false;
    for (const it of plan) {
      if (it.fired) continue;
      if (it.h) { it.h.cancel(); it.h = null; }
      if (keep && (it.id === 'arrivalLock' || it.id === 'recallThud')) late = true;   // planned ⇒ the director skips its own
    }
    if (late) {                                                      // on THIS arrival frame, not the next one
      tickClock();
      for (const it of plan) if (!it.fired && (it.id === 'arrivalLock' || it.id === 'recallThud')) it.h = mk(it, clk.raf);
      F.cue.frame();
    }
    cur = null; plan = [];
    if (completed && strut && strut.sa.d > 0) strutLinger(); else strutEnd();
  });
  bus.on('travel:start', ({ from, kind }) => { sliceFrom = kind === 'SLICE' || F.t0 || ENV.reducedMotion ? from && from.room : null; });
  bus.on('room:arrive', ({ room, kind }) => {
    if (sliceFrom === 'CORE' && room !== 'CORE' && (kind === 'SLICE' || F.t0 || ENV.reducedMotion)) F.scalebar.rmLabel(1200);
    sliceFrom = null;
  });

  if (__DEV__) F.dbgStrut = () => strut;
  return {
    /** fx frame (order 25): plans, drives the scale bar, the focus and the strut line from the director's fxOut. */
    frame() {
      const dir = ctx.director;
      if (!dir) return;
      const st = dir.state, o = dir.fxOut();
      const p = o.active && st.path && st.path.fxPlan ? st.path : null;
      if (p !== cur) {
        if (cur) for (const it of plan) if (it.h && !it.fired) it.h.cancel();
        cur = p; plan = p ? p.fxPlan : []; speed = st.speed;
        if (p) replan(st);
      } else if (p && st.speed !== speed) { speed = st.speed; replan(st); }
      else if (p && !st.scrubbing) {
        // The path clock is the truth: when slow frames make it lag the wall clock (the loop caps a step at 250 ms),
        // every cue whose voices are not yet created is re-timed onto the path's current prediction.
        for (let i = 0; i < plan.length; i++) {
          const it = plan[i];
          if (!it.h || it.fired || it.pin) continue;
          const V = dir.predict(it.ms);
          if (V != null) it.h.move(V);
        }
      }
      if (p && (st.scrubbing || dir.predict(st.t) == null)) {
        const tp = o.t != null ? o.t : st.t;                          // scrubbing: the path time of the live u
        for (const it of plan) if (!it.fired && !it.h && it.ms <= tp) { it.fired = true; if (it.visual) it.visual(); if (it.audio) F.cue.now({ audio: () => it.audio(audio.now()) }); }
      }
      const d = p && o.deco;
      if (d && d.tabS) {
        if (o.sb === 1) { F.scalebar.show(); F.scalebar.set(o.scaleS, o.scaleDir); } else F.scalebar.hide(120);
        if (o.aperturePx > 0.01) { drv = true; F.focus.drive(o.focalM, o.aperturePx); } else if (drv) { drv = false; F.focus.release(); }
        if (o.strutDim && !strut) strutBegin(st.path.stratum | 0);
        if (strut) strutFrame(o.strutDim, o.t);
      } else {
        F.scalebar.hide(120);
        if (drv) { drv = false; F.focus.release(); }
        if (strut && !strut.ending) strutEnd();
      }
    },
  };
}
