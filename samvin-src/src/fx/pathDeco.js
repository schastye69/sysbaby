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
import { Vector3, Matrix4 } from 'three';
import { registerDecorator, createPoseOut } from '../nav/paths.js';
import { tOfU, msU } from '../nav/pathKit.js';
import { ROOMS } from '../world/rooms.js';
import { STRATA_GEOM, radiusAt, KEY } from '../core/tokens.js';
import { generatorParam } from '../world/structure.js';
import { createLines } from '../render/lines.js';
import { loop, ORDER } from '../core/loop.js';
import { EASE } from '../core/ease.js';
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

  // ── Strut dimension line (first DIVE, A2.2.2) — "same strut, two scales" ──
  // The two neighbouring struts of stratum i's far wall nearest the view centre are LIT: --white hairline ribbons along
  // their whole generators (brightest at the measured height, fading toward the strata edges), drawn over the lattice.
  // Between them the construction-drawing dimension: extension lines rising from both struts, the dimension line with
  // 6 px open arrowheads (outside, pointing in, when the span is too short to hold them — standard drafting), the value
  // .t-label --white above it on a void knock-out. The focus racks onto the measured wall as the line draws, so the
  // dimensioned struts are the sharp plane and the lattice round the lens goes soft.
  // Value: the SPEC's strut spacing perimeter_i / k_i at the face's mean radius r̄ = (r_top + r_bot) / 2, to the mm as the
  // SPEC table states radii (MEMBERS: r̄ 0.444 m, 2.697 m / 168 → ↔ 1.61 СМ / ↔ 16.1 М). It is computed once, when the line draws, and held — it used to follow the
  // camera's spline height every frame (1.64 → 1.63 on desktop, 1.65 → 1.63 on phone). The struts are two real
  // generators of the Key's lattice (family +1, the same generatorParam the lattice is built from), both on one face
  // (never across a crease), at the height where the lofted wall has radius r̄.
  // The WP0 DIVE path cuts its camera at the swap (in fog), so on the swap frame every point keeps its place ON SCREEN
  // — the same struts in the picture — at its depth × (1000 / s): the same dimension re-reads in hall units.
  const SEG = KEY.lattice.segmentsPerGenerator, NPT = 2 * (SEG + 1) + 2, IA = NPT - 2, IB = NPT - 1;
  // OFF: the dimension line stands well clear of the struts' crossing (long extension lines carry the eye from the two
  // lit struts to it, as a drawing dimensions a small feature at a readable distance); OUTER: the outside arrows' tails.
  const TAU = Math.PI * 2, ARROW = 6, EXT = 4, OFF = 52, OUTER = 22;
  const SVG = 'http://www.w3.org/2000/svg';
  const _m = new Matrix4(), _pp = { x: 0, y: 0, depth: 0, visible: false };
  const ringPt = (n, r, y, s, out) => {
    const j = Math.floor(s), f = s - j, a0 = (TAU * j) / n - Math.PI / n, a1 = a0 + TAU / n;
    const x0 = Math.sin(a0) * r, z0 = Math.cos(a0) * r;
    return out.set(x0 + (Math.sin(a1) * r - x0) * f, y, z0 + (Math.cos(a1) * r - z0) * f);
  };
  const wrapS = (s, n) => ((s % n) + n) % n;
  /** Height (Key m) where stratum st's lofted wall has radius r (monotonic within a stratum off the equator). */
  function heightAt(st, r) {
    if (st.top > 0 === st.bot > 0) {
      let lo = Math.min(st.top, st.bot), hi = Math.max(st.top, st.bot);
      for (let q = 0; q < 40; q++) { const m = (lo + hi) / 2; if ((radiusAt(m) > r) === (st.mid > 0)) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    return st.mid;
  }
  function strutBegin(i) {
    if (!ctx.key || !ctx.scene) return;
    const st = STRATA_GEOM[i], n = st.n, k = st.k;
    const rb = Math.round(((st.rTop + st.rBot) / 2) * 1000) / 1000, yh = heightAt(st, rb);   // the SPEC table's mm radii
    const th = Math.max(0, Math.min(1, (st.top - yh) / (st.top - st.bot)));
    const D = n / k, sBack = n / 2 + 0.5;                          // face 0 (the sign face) looks at +Z; the back is s = n/2 + ½
    const sc = n % 2 ? sBack - 1.5 * D : sBack;                    // odd n: the back is a crease — take the pair beside it
    const g = Math.round((sc - 0.5 * D - generatorParam(st, 1, 0, th, k)) / D);
    const L = [];
    for (const gi of [g, g + 1]) for (let m = 0; m <= SEG; m++) {
      const t = m / SEG, y = st.top + (st.bot - st.top) * t;
      L.push(ringPt(n, radiusAt(y), y, wrapS(generatorParam(st, 1, gi, t, k), n), new Vector3()));
    }
    const mi = Math.min(SEG - 1, Math.floor(th * SEG)), fi = th * SEG - mi;
    L.push(new Vector3().lerpVectors(L[mi], L[mi + 1], fi), new Vector3().lerpVectors(L[SEG + 1 + mi], L[SEG + 2 + mi], fi));
    const sp = (2 * n * rb * Math.sin(Math.PI / n)) / k;
    // the lit struts (render space, rewritten each frame until the swap)
    const segs = new Float32Array(2 * SEG * 6), al = new Float32Array(2 * SEG);
    for (let q = 0; q < 2; q++) for (let m = 0; m < SEG; m++) al[q * SEG + m] = Math.max(0.12, 1 - Math.abs((m + 0.5) / SEG - th) / 0.5);
    // the two measured struts are singled out of the lattice: --white at twice the lattice's hairline weight
    const lines = createLines({ segments: segs, alpha: al, color: 'white', width: 2, glint: 0, far: 1e12, fog: false, depthTest: false, renderOrder: 9 });
    lines.mesh.name = 'strutLit';
    lines.setAlpha(0);
    ctx.scene.add(lines.mesh);
    // the dimension (SVG in #leaders) and its value (#fx)
    const leaders = document.getElementById('leaders');
    const gEl = document.createElementNS(SVG, 'g');
    gEl.setAttribute('class', 'fx-strut');
    const ext = document.createElementNS(SVG, 'path'), dim = document.createElementNS(SVG, 'path');
    ext.setAttribute('class', 'ext'); dim.setAttribute('class', 'dim');
    for (const p of [ext, dim]) { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; }
    gEl.append(ext, dim);
    if (leaders) leaders.appendChild(gEl);
    const el = document.createElement('div');
    el.className = 'fx-sd';
    el.dataset.qa = 'strut-dim';
    const txt = document.createElement('span');
    txt.className = 't-label';
    el.append(txt);
    el.classList.add('fx-out');
    const root = document.getElementById('fx');
    if (root) root.append(el);
    const s = { i, st, L, W: L.map(() => new Vector3()), scr: new Float32Array(NPT * 3), segs, lines, gEl, ext, dim, el, txt,
      sp, k: 1, label: '', sPre: 1, fixed: false, fixing: false, bad: false, ending: false, drawT0: perf(), inAt: perf() + 120,
      mAt: 0, fadeAt: 0, focalC: -1, lastD: '' };
    setLabel(s, `↔ ${fmt3(sp * 100)} СМ`);
    strut = s;
  }
  function setLabel(s, l) { if (l !== s.label) { s.label = l; s.txt.textContent = l; } }
  function strutEnd() {
    const s = strut;
    if (!s) return;
    strut = null;
    s.lines.dispose();
    if (s.gEl.parentNode) s.gEl.parentNode.removeChild(s.gEl);
    if (s.el.parentNode) s.el.parentNode.removeChild(s.el);
  }
  function toHall(s) {                                            // the swap frame's reading, in hall units
    s.fixing = true; s.k = 1000; s.mAt = perf();
    setLabel(s, `↔ ${fmt3(s.sp * 1000)} М`);
  }
  // Past the swap the hall-unit reading is always seen for ≥ 150 ms, even when a slow frame jumps over its window.
  function strutLinger() {
    const s = strut;
    if (!s || s.ending) return;
    s.ending = true;
    if (!s.mAt) toHall(s);
    s.inAt = 0; s.el.classList.remove('fx-out');
    after(Math.max(0, 150 - (perf() - s.mAt)), () => { if (strut === s) strutEnd(); });
  }
  function strutFrame(mode) {
    const s = strut;
    if (!s) return;
    if (s.bad) { strutEnd(); return; }
    if (s.ending) return;
    if (mode === 0) { if (s.scr[IA * 3 + 2] > 0 && s.mAt) strutLinger(); else strutEnd(); return; }   // 0 after the swap window
    if (mode >= 2 && !s.fixed && !s.fixing) toHall(s);
    if (mode === 3 && !s.fadeAt && perf() - s.mAt >= 150) s.fadeAt = perf();   // the hall-unit reading is always seen (≥ 150 ms)
  }
  /** ORDER.OVERLAY (after the rig has applied this frame's camera): the lit struts, the dimension and its value. */
  function strutDraw() {
    const s = strut;
    if (!s || !rig.camera) return;
    if (!s.fixed && !s.fixing) {
      const S = ctx.key.strata && ctx.key.strata[s.i];
      if (S) S.updateWorldMatrix(true, false);
      ctx.key.stratumMatrix(s.i, _m);
      for (let j = 0; j < NPT; j++) {
        s.W[j].copy(s.L[j]).applyMatrix4(_m);
        rig.project(s.W[j], _pp);
        s.scr[j * 3] = _pp.x; s.scr[j * 3 + 1] = _pp.y; s.scr[j * 3 + 2] = _pp.depth;
      }
      s.sPre = scaleEngine.s;
      s.focalC = _c.copy(s.W[IA]).add(s.W[IB]).multiplyScalar(0.5).distanceTo(rig.camera.position) / Math.max(1e-9, scaleEngine.s);
      writeSegs(s);
    } else if (s.fixing) {
      // No valid pre-swap screen record (a scrub or a stalled frame jumped past the lattice frames, or an end was behind
      // the lens): the dimension cannot keep its place across the swap, so it ends (never a NaN anchor).
      s.fixing = false;
      const kk = 1000 / Math.max(1e-6, s.sPre);
      for (let j = 0; j < NPT && !s.bad; j++) {
        const d = s.scr[j * 3 + 2];
        if (!(d > 0)) { s.bad = true; break; }
        rig.unproject(s.scr[j * 3], s.scr[j * 3 + 1], d * kk, s.W[j]);
        if (!Number.isFinite(s.W[j].x + s.W[j].y + s.W[j].z)) s.bad = true;
      }
      if (s.bad) { s.lines.setAlpha(0); s.gEl.style.opacity = '0'; s.el.classList.add('fx-out'); return; }
      s.fixed = true;
      writeSegs(s);
    }
    const now = perf();
    const draw = Math.min(1, Math.max(0, (now - s.drawT0) / 120));
    const fade = s.fadeAt ? Math.max(0, 1 - (now - s.fadeAt) / 240) : 1;
    s.lines.setAlpha(EASE.reveal(draw) * fade);
    // dimension geometry (screen px)
    rig.project(s.W[IA], _pp); const ax = _pp.x, ay = _pp.y, ad = _pp.depth;
    rig.project(s.W[IB], _pp); const bx = _pp.x, by = _pp.y, bd = _pp.depth;
    const len = Math.hypot(bx - ax, by - ay);
    const on = ad > 0 && bd > 0 && len >= 3;
    if (on) {
      const ux = (bx - ax) / len, uy = (by - ay) / len;
      let nx = -uy, ny = ux;
      if (ny > 0) { nx = -nx; ny = -ny; }                          // the dimension stands above the struts' crossing
      const Ax = ax + nx * OFF, Ay = ay + ny * OFF, Bx = bx + nx * OFF, By = by + ny * OFF;
      const f = (v) => v.toFixed(1);
      const pe = `M${f(ax + nx * 3)} ${f(ay + ny * 3)}L${f(Ax + nx * EXT)} ${f(Ay + ny * EXT)}M${f(bx + nx * 3)} ${f(by + ny * 3)}L${f(Bx + nx * EXT)} ${f(By + ny * EXT)}`;
      const inside = len >= 3 * ARROW + 4;
      const k1 = inside ? 1 : -1;                                  // arrow wings point back along the line (inside) / outward
      const wing = (x, y, dx, dy) => `M${f(x + (dx * 0.866 - dy * 0.5) * ARROW)} ${f(y + (dy * 0.866 + dx * 0.5) * ARROW)}L${f(x)} ${f(y)}L${f(x + (dx * 0.866 + dy * 0.5) * ARROW)} ${f(y + (dy * 0.866 - dx * 0.5) * ARROW)}`;
      const pd = (inside ? `M${f(Ax)} ${f(Ay)}L${f(Bx)} ${f(By)}`
        : `M${f(Ax - ux * OUTER)} ${f(Ay - uy * OUTER)}L${f(Ax)} ${f(Ay)}M${f(Bx)} ${f(By)}L${f(Bx + ux * OUTER)} ${f(By + uy * OUTER)}`)
        + wing(Ax, Ay, ux * k1, uy * k1) + wing(Bx, By, -ux * k1, -uy * k1);
      const dd = pe + '|' + pd;
      if (dd !== s.lastD) { s.lastD = dd; s.ext.setAttribute('d', pe); s.dim.setAttribute('d', pd); }
      const off = String(1 - EASE.reveal(draw));
      s.ext.style.strokeDashoffset = off; s.dim.style.strokeDashoffset = off;
      s.el.style.transform = `translate3d(${f((Ax + Bx) / 2 + nx * 9)}px,${f((Ay + By) / 2 + ny * 9)}px,0)`;
    }
    s.gEl.style.opacity = on ? String(fade) : '0';
    if (s.inAt && now >= s.inAt) { s.inAt = 0; s.el.classList.remove('fx-out'); }
    if (s.fadeAt && !s.el.classList.contains('fx-out')) s.el.classList.add('fx-out');
    if (!on && !s.el.classList.contains('fx-out')) s.el.classList.add('fx-out');
  }
  function writeSegs(s) {
    const a = s.segs;
    let o = 0;
    for (let q = 0; q < 2; q++) for (let m = 0; m < SEG; m++) {
      const p = s.W[q * (SEG + 1) + m], r = s.W[q * (SEG + 1) + m + 1];
      a[o++] = p.x; a[o++] = p.y; a[o++] = p.z; a[o++] = r.x; a[o++] = r.y; a[o++] = r.z;
    }
    s.lines.setSegments(a);
  }
  loop.add(strutDraw, ORDER.OVERLAY);

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
    if (completed && strut && strut.scr[IA * 3 + 2] > 0 && !strut.bad) strutLinger(); else strutEnd();
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
        let focal = o.focalM;
        // The strut dimension pulls the focus onto the wall it measures while it draws (pre-swap only).
        if (strut && !strut.fixed && !strut.fixing && strut.focalC > 0) focal += (strut.focalC - focal) * EASE.camera(Math.min(1, (perf() - strut.drawT0) / 240));
        if (o.aperturePx > 0.01) { drv = true; F.focus.drive(focal, o.aperturePx); } else if (drv) { drv = false; F.focus.release(); }
        if (o.strutDim && !strut) strutBegin(st.path.stratum | 0);
        if (strut) strutFrame(o.strutDim);
      } else {
        F.scalebar.hide(120);
        if (drv) { drv = false; F.focus.release(); }
        if (strut && !strut.ending) strutEnd();
      }
    },
  };
}
