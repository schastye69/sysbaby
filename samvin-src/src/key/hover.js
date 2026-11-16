// key/hover.js — WP1. The layers become legible (SPEC §3.4, §2.7 "Key stratum", §2.3 leaders & dimension lines;
// ARCH §6.1.6 A14; SPEC-ADDENDUM A2.3 caller duty).
//   trigger   desktop pointer inside the Key's projected ellipse for ≥ 120 ms (or resting on one of its labels)
//   explode   heavy spring: gaps 0.020 → 0.090 m; the hovered stratum's neighbours pushed a further 0.012 m; the hovered
//             stratum slides 0.06 m toward the lamp and turns its sign face toward it (ω 6; ≤ 24° so it stays legible)
//   layout    a construction-drawing pass in screen space: the blocks never overlap (isotonic column); each live
//             coordinate takes the quadrant beside its cross that collides with nothing — the label column, every
//             leader, the dimension values, the rim name, the scale figure (ui/keepout.js) — with hysteresis
//   leaders   7 overlay anchors (owner 'key', id = sign), each from a 7 px survey cross at the stratum's right silhouette
//             point, one 45° elbow, to a column 64 px right of the Key's box; 40 ms stagger; the 4-line SPEC block;
//             hovered 100 %, the others 55 %; the block is a real button (click = key:click, Tab-focusable while shown)
//   exit      520 ms collapse with a 2 % overshoot
//   dims      A14: ↕ 2.40 М (left) and Ø 1.24 М (below), owner 'key', drawn (240 ms) whenever the Key is interactive and at
//             rest in CORE, drawn again with every hover; the scale figure «ТЫ» shows/hides with the hover (A2.3)
import { Vector3 } from 'three';
import { Spring, SPRING } from '../core/spring.js';
import { after } from '../core/clock.js';
import { input } from '../core/input.js';
import { layout } from '../core/layout.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { ROOMS, ROOM_ORDER, NADIR_LINE_OPEN } from '../world/rooms.js';
import { rig } from '../render/cameraRig.js';
import { U } from '../render/uniforms.js';
import { audio } from '../audio/engine.js';
import { keepout } from '../ui/keepout.js';
import { GAP, KEY, STRATA_GEOM, TIMING, MOTION, LAYOUT, radiusAt } from '../core/tokens.js';

const DEG = Math.PI / 180;
const zetaFor = (os) => -Math.log(os) / Math.sqrt(Math.PI * Math.PI + Math.log(os) ** 2);
const OUT_ZETA = zetaFor(MOTION.settleOvershoot);           // 2 % overshoot
const BLOCK_H = 78, MIN_RISE = 17, NEAR_RISE = 40, COORD_W = 122, HYST = 5;
/** The coordinate lane: every leader's horizontal run (its shoulder) is at least SHOULDER px long, and its live
 *  coordinate rides on it — right-aligned SHOULDER_END px short of the label column, above the run (a note on a
 *  leader's shoulder, as a drawing sets it). The lane lies between the Key's silhouette and the column, so the MICRO
 *  text never enters the column, never sits on the Key's faces, and no other leader crosses it (every diagonal ends
 *  before the lane, every shoulder is a block pitch from the next). COL_RESERVE: the widest block + the navigator. */
const SHOULDER_END = 10, SHOULDER_AIR = 16, COL_RESERVE = 330;
/** Live-coordinate candidates beside the cross: [dx, dy, left] — dy > 0 = top edge below the cross by dy, dy < 0 =
 *  bottom edge above it by −dy; then the cost bias (right of the cross first: left of it lies on the Key's faces). */
const CAND = [[8, 6, 0, 0], [8, -6, 0, 4], [8, 20, 0, 40], [8, -20, 0, 44], [30, 6, 0, 60], [30, -6, 0, 64],
  [8, 34, 0, 90], [8, -34, 0, 94], [-8, 6, 1, 4000], [-8, -6, 1, 4004]];
const COORD_PAD = 3, NC = CAND.length + 2;
function clip(p, q, t) {          // one Liang–Barsky edge; t = [t0, t1] (shared scratch), false = outside
  if (p === 0) return q >= 0;
  const r = q / p;
  if (p < 0) { if (r > t[1]) return false; if (r > t[0]) t[0] = r; } else { if (r < t[0]) return false; if (r < t[1]) t[1] = r; }
  return true;
}
const LB = new Float64Array(2);
function segHits(ax, ay, bx, by, x0, y0, x1, y1) {
  const dx = bx - ax, dy = by - ay;
  LB[0] = 0; LB[1] = 1;
  return clip(-dx, ax - x0, LB) && clip(dx, x1 - ax, LB) && clip(-dy, ay - y0, LB) && clip(dy, y1 - ay, LB);
}
const UPD = {};
/** SPEC §9.4: on desktop hover the stratum's note plays at −30 dB (ARCH stratumNote {i, quiet}); shared option objects. */
const HOV = { index: -1 };   // shared key:hover payload (G9: nothing allocated in the frame)
const NOTE = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ i, quiet: true }));
/** The right silhouette point of each stratum: at its mid height, on its profile radius there. */
const MID_R = STRATA_GEOM.map((s) => radiusAt(s.mid));
/** N's tip (Key metres) and its cone's half-width per unit of depth below its top ring (screen-scale invariant). */
const N_BOT = STRATA_GEOM[6].bot, N_SLOPE = radiusAt(STRATA_GEOM[6].top) / Math.max(1e-3, STRATA_GEOM[6].top - STRATA_GEOM[6].bot);

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

export function createHover(K, ctx) {
  const H = {
    amt: 0, idx: -1, slide: new Float32Array(7), turn: new Float32Array(7), push: new Float32Array(7), gap: GAP.rest,
  };
  const amt = new Spring(SPRING.heavy.omega, 1, 0);
  const slide = [], turn = [];
  for (let i = 0; i < 7; i++) { slide.push(Spring.from(SPRING.heavy)); turn.push(Spring.from(SPRING.heavy)); }
  let insideSince = -1, overLabel = false, active = false, lastIdx = -1, lastPick = -1e9, emitted = -2;
  let dimsOn = false, dimsSnap = true, dimsKey = 0, dimsCheck = 0, laid = false, colShown = 0;
  const blockY = new Float32Array(7);
  const _w = new Vector3(), _r = new Vector3(), _l = new Vector3();
  const _pp = { x: 0, y: 0, depth: 0, visible: false };

  // ── Label blocks (overlay anchors) ──
  const anchors = [], blocks = [], leaders = [], titleEls = [], lineEls = [], wraps = [];
  const zv = new Float64Array(7), pv = new Float64Array(7), pw = new Float64Array(7), pn = new Float64Array(7);
  const capHi = new Float64Array(7), capLo = new Float64Array(7);   // hard block limits from text its elbow must not cross
  const sy = new Float32Array(7), ty = new Float32Array(7), sxs = new Float32Array(7), lastX = new Float32Array(7), lastY = new Float32Array(7);
  const blockW = new Float32Array(7), blockH = new Float32Array(7), coordPick = new Int8Array(7).fill(-1), placed = new Float32Array(28);
  const csz = { w: 0, h: 0 };
  let shoulder = COORD_W + 2 * COORD_PAD + SHOULDER_END + SHOULDER_AIR;
  const anchorPoint = (i) => (out) => {
    // Right silhouette point at the widest ring, in render space (camera-right of the stratum axis).
    out.set(0, STRATA_GEOM[i].mid, 0).applyMatrix4(K.strata[i].matrixWorld);
    if (rig.camera) {
      _r.setFromMatrixColumn(rig.camera.matrixWorld, 0);
      const e = K.strata[i].matrixWorld.elements;
      out.addScaledVector(_r, MID_R[i] * Math.hypot(e[0], e[1], e[2]));
    }
    return out;
  };
  const getters = [0, 1, 2, 3, 4, 5, 6].map(anchorPoint);
  function nadirCopy() {
    const open = !!state.data.nadirOpen;
    titleEls[6].textContent = open ? ROOMS.NADIR.nameOpen : ROOMS.NADIR.name;
    lineEls[6].textContent = open ? NADIR_LINE_OPEN : ROOMS.NADIR.line.replace('{k}', String(state.data.shards | 0));
    blocks[6].setAttribute('aria-label', `${titleEls[6].textContent} — ${lineEls[6].textContent}`);
  }
  function build() {
    if (anchors.length || !ctx.overlay) return;
    for (let i = 0; i < 7; i++) {
      const r = ROOMS[ROOM_ORDER[i]];
      const wrap = el('div', 'key-lbl');
      const b = el('button', 'proxy key-lbl__b');
      b.type = 'button';
      b.dataset.owner = 'key'; b.dataset.id = r.sign;
      b.append(el('span', 't-label', `${r.num} · ${r.code}`), titleEls[i] = el('span', 't-body t-body--em key-lbl__t', r.name),
        lineEls[i] = el('span', 't-body t-body--15 key-lbl__l', r.line), el('span', 't-micro', `▽ ${r.level}`));
      b.setAttribute('aria-label', `${r.name} — ${r.line}`);
      b.addEventListener('click', () => { if (K.interactive) bus.emit('key:click', { index: i, x: H.sx(i), y: H.sy(i) }); });
      b.addEventListener('pointerenter', () => { overLabel = true; H.focusIdx = i; });
      b.addEventListener('pointerleave', () => { overLabel = false; });
      b.addEventListener('focus', () => { H.focusIdx = i; H.kbd = true; });
      b.addEventListener('blur', () => { H.kbd = false; });
      wrap.append(b);
      // runMax: the column is one aligned edge; a run may outgrow the default cap when its block had to step around text
      const L = { side: 'right', len: 40, rise: -MIN_RISE, runMax: 1e4 };
      const a = ctx.overlay.add({ owner: 'key', id: r.sign, el: wrap, get: getters[i], leader: L, cross: true, coord: true, priority: 5 });
      a.setVisible(false);
      anchors.push(a); blocks.push(b); leaders.push(L); wraps.push(wrap);
    }
    nadirCopy();
  }
  H.sx = (i) => (anchors[i] ? anchors[i].screen.x : 0);
  H.sy = (i) => (anchors[i] ? anchors[i].screen.y : 0);
  H.focusIdx = -1; H.kbd = false;
  bus.on('shard:landed', () => { if (anchors.length) nadirCopy(); });
  bus.on('nadir:open', () => { if (anchors.length) nadirCopy(); });

  function show(on) {
    if (on === active) return;
    active = on;
    laid = false;
    build();
    for (let i = 0; i < anchors.length; i++) {
      // The block fades in with its leader (CSS delay = the 40 ms stagger), never after it: the overlay's draw-in
      // 'is-pending' hold is lifted at once, so the label is legible while its leader is still drawing.
      wraps[i].style.transitionDelay = on ? `${i * TIMING.leaderStagger}ms` : '0ms';
      anchors[i].setVisible(on);
      if (on) {
        const a = anchors[i], w = wraps[i];
        after(i * TIMING.leaderStagger, () => { if (active) { a.drawIn(TIMING.leaderDraw); w.classList.remove('is-pending'); } });
      }
    }
    if (on) { nadirCopy(); blockW.fill(0); blockH.fill(0); coordPick.fill(-1); }
    const fig = ctx.fx && ctx.fx.scaleFigure;
    try { if (fig) { if (on) fig.show('hover'); else fig.hide(); } } catch (e) { /* the FX layer's own */ }
    if (on && dimsOn) for (const d of dims) d.drawIn(TIMING.dimsDraw);
  }

  // ── A14 dimension lines ──
  const dims = [];
  let oCover = false;
  let dimRx = 0, vOffIdle = 0, vOff = 0, oOff = 0, oAt = 0.5, vAt = 0.5;
  const P = (x, y) => (out) => out.set(x, y, 0).applyMatrix4(K.group.parent ? K.group.parent.matrixWorld : K.group.matrixWorld);
  function makeDims(si) {
    for (const d of dims) d.remove();
    dims.length = 0;
    if (!ctx.dims) return;
    dimRx = si.rx;
    vOffIdle = vOff = idleOffsets(si);
    dims.push(ctx.dims.add({ owner: 'key', a: P(0, 1.2), b: P(0, -1.2), side: 'left', label: '↕ 2.40 М', offset: vOff }));
    dims.push(ctx.dims.add({ owner: 'key', a: P(-0.62, 0), b: P(0.62, 0), side: 'below', label: 'Ø 1.24 М', offset: oOff }));
  }
  /** The rest offsets, every frame (the camera may still be settling — the boot's ASSEMBLY draws them mid-dolly):
   *  ↕ clears the grain rings (outer edge 1.90 × 0.62 m) where the screen allows; Ø sits keyBelowPx under the real
   *  projected (assembled) tip — the camera is pitched (A12: below, looking up), so the tip is not si.ry below the centre. → ↕ offset. */
  function idleOffsets(si) {
    const ring = (1.9 * 0.62 * si.r) / KEY.radius;
    P(0, -1.2)(_w); rig.project(_w, _pp); const tipY = _pp.y;
    P(0, 0)(_w); rig.project(_w, _pp);
    oOff = (tipY > _pp.y ? tipY - _pp.y : si.ry) + LAYOUT.dims.keyBelowPx;
    return Math.max(si.rx + 26, Math.min(ring + 46, si.x - 40));
  }
  function setDims(on, si) {
    if (on && !(Number.isFinite(si.x) && Number.isFinite(si.r))) on = false;
    if (on && (!dims.length || Math.abs(si.rx - dimRx) > dimRx * 0.08)) { makeDims(si); dimsOn = false; }
    if (on === dimsOn) return;
    dimsOn = on;
    if (on) dimsSnap = true;
    for (const d of dims) { d.setVisible(on && !(d === dims[1] && oCover)); if (on) d.drawIn(TIMING.dimsDraw); }
  }

  /** dt s · t loop ms · si Key screen info · interactiveRest: interactive, CORE, idle phase, not travelling ·
   *  dimsRest: interactive in CORE (idle or the boot's ASSEMBLY) — the A14 dims draw on the first such frame */
  H.update = function update(dt, t, si, interactiveRest, dimsRest = interactiveRest) {
    if (t - dimsCheck > 250 || !dimsRest || !dimsOn) { dimsCheck = t; setDims(dimsRest && dimsKey >= 0, si); }
    // ↕ 2.40 М and the scale figure: while «ТЫ» stands beside the Key the height dimension runs in the aisle between
    // them (its value clear of the figure's head and of its own ↕ value), and glides back to clear the grain rings
    // when the figure leaves. Too narrow an aisle → it goes outside the figure.
    // (a frame whose Key projection is degenerate — the camera mid-cut, the nucleus behind it — leaves the dims as they
    // were: a non-finite offset would otherwise stick in the low-pass and write NaN paths)
    const siOk = Number.isFinite(si.x) && Number.isFinite(si.y) && Number.isFinite(si.r) && Number.isFinite(si.ry);
    if (dims.length && rig.camera && siOk && (dimsRest || dimsOn)) {
      vOffIdle = idleOffsets(si);
      dims[1].setOffset(oOff);
      const fb = keepout.get('fig:ty');
      let want = vOffIdle, wantAt = 0.5;
      if (fb) {
        const keyL = si.x - si.rx * 1.02, aisle = keyL - fb.x1;
        want = si.x - (aisle >= 70 ? (fb.x1 + keyL) / 2 : fb.x0 - 44);
        // in the aisle the value rides high, beside S·A·M where the grain orbits are narrow (the • orbits fill the
        // aisle at mid-height) and well above the figure's head
        if (aisle >= 70) wantAt = 0.26;
      }
      const kk = 1 - Math.exp(-(dt * 1000) / 90);
      // the low-pass glides only between rest frames; dims drawn (again) start at their place — after a travel the Key
      // returns from another scale, and its projection there is no place to glide from
      if (dimsSnap || !Number.isFinite(vOff)) vOff = want;
      if (dimsSnap || !Number.isFinite(vAt)) vAt = wantAt;
      if (dimsSnap || !Number.isFinite(oAt)) oAt = 0.5;
      dimsSnap = false;
      vOff += (want - vOff) * kk;
      if (Math.abs(want - vOff) < 0.25) vOff = want;
      dims[0].setOffset(vOff);
      vAt += (wantAt - vAt) * kk;
      if (Math.abs(wantAt - vAt) < 0.002) vAt = wantAt;
      dims[0].setLabelAt(vAt);
      // Ø 1.24 М stays the assembled Key's diameter, under the assembled tip. When the exploded N reaches through it, the
      // line breaks around the cone (it passes behind the object) and the value steps aside to the left of the tip.
      if (dims[1] && rig.camera) {
        _w.set(0, N_BOT, 0).applyMatrix4(K.strata[6].matrixWorld); rig.project(_w, _pp);
        const lineY = si.y + dims[1].offset, depth = _pp.y - lineY;
        let at = 0.5, bh = 0, bt = 0.5;
        if (depth > -3 && si.rx > 4) {
          bt = (_pp.x - (si.x - si.rx)) / (2 * si.rx);
          bh = Math.max(0, depth + 3) * N_SLOPE + 5;
          at = Math.max(0.16, bt - (bh + 40) / (2 * si.rx));
        }
        oAt += (at - oAt) * kk;
        if (Math.abs(at - oAt) < 0.002) oAt = at;
        dims[1].setLabelAt(oAt);
        dims[1].setBreak(bt, bh);
        // the rim caption (guest rows on a portrait phone, a long guest row on desktop) may take the Ø band: the
        // dimension yields to the names rather than run through them
        const rb = keepout.get('rim');
        const cover = !!rb && rb.y0 < lineY + 8 && rb.x0 < si.x + si.rx && rb.x1 > si.x - si.rx;
        if (cover !== oCover) { oCover = cover; dims[1].setVisible(dimsOn && !cover); }
      }
    }
    const p = input.pointer;
    const can = interactiveRest && !K.dragging && layout.kind === 'desktop' && p.type === 'mouse' && p.x > -9000 && !p.down;
    let inside = false;
    if (can && (p.inside || overLabel)) {
      const ex = (p.x - si.x) / Math.max(8, si.rx * 1.06), ey = (p.y - si.y) / Math.max(8, si.ry * (1 + 0.18 * H.amt));
      inside = ex * ex + ey * ey <= 1 || overLabel;
    }
    if (can && H.kbd && H.focusIdx >= 0) inside = true;
    if (inside) { if (insideSince < 0) insideSince = t; } else insideSince = -1;
    const want = insideSince >= 0 && t - insideSince >= TIMING.keyHoverTrigger;
    // Which stratum: under the pointer (picked at ≤ 30 Hz), else the label he rests on, else the last one.
    if (want) {
      if (H.kbd || overLabel) lastIdx = H.focusIdx;
      else if (t - lastPick > 33) { lastPick = t; const k = K.pick(p.x, p.y); if (k >= 0) lastIdx = k; else if (lastIdx < 0) lastIdx = 3; }
    }
    H.idx = want ? lastIdx : -1;
    if (H.idx !== emitted) { emitted = H.idx; HOV.index = H.idx; bus.emit('key:hover', HOV); if (H.idx >= 0) audio.play('stratumNote', NOTE[H.idx]); }
    show(want);
    amt.target = want ? 1 : 0;
    amt.zeta = want ? 1 : OUT_ZETA;
    amt.omega = want ? 9 : 7.6;            // in: the heavy character, settled in ≈ 480 ms; out: 520 ms with 2 % overshoot
    amt.step(dt);
    H.amt = Math.max(0, amt.x);
    H.gap = GAP.rest + (GAP.hover - GAP.rest) * H.amt;

    // The hovered stratum: slide toward the lamp, sign toward the lamp (group-local azimuth of the lamp).
    _l.copy(U.uLamp.value);
    K.group.worldToLocal(_l);
    const az = Math.atan2(_l.x, _l.z), lx = Math.sin(az), lz = Math.cos(az);
    for (let i = 0; i < 7; i++) {
      const on = want && i === H.idx;
      slide[i].target = on ? KEY.hoverSlide : 0;
      const lim = (i === 3 ? 8 : 14) * DEG;
      turn[i].target = on ? Math.max(-lim, Math.min(lim, az)) : 0;
      slide[i].step(dt); turn[i].step(dt);
      H.slide[i] = slide[i].x; H.turn[i] = turn[i].x;
      H.push[i] = H.idx < 0 ? 0 : (i < H.idx ? 1 : i > H.idx ? -1 : 0) * GAP.hoverNeighbourPush * H.amt;
    }
    H.lx = lx; H.lz = lz;
  };

  /** After the Key's pose for this frame is final (key.update calls it last): the leader column. */
  H.layout = function layout_(dt, si) {
    if (!active) return;

    // Leader layout: the seven blocks never overlap (≥ BLOCK_H apart). Each block prefers to sit MIN_RISE above (S A M •)
    // or below (V I N) its anchor so every leader shows its 45° elbow; the least-squares placement under the spacing
    // constraint is an isotonic regression of (preferred − i·BLOCK_H), solved exactly by pool-adjacent-violators.
    // The lane for the live coordinates is the leaders' shoulder: the column stands a shoulder further right.
    anchors[3].coordSize(csz);
    shoulder = (csz.w || COORD_W) + 2 * COORD_PAD + SHOULDER_END + SHOULDER_AIR;
    const runMax = shoulder + 72;
    let colX = si.x + si.rx * 1.04 + 24 + shoulder;
    for (let i = 0; i < 7; i++) {
      getters[i](_w); rig.project(_w, _pp);
      sy[i] = _pp.y; sxs[i] = _pp.x;
      // The run is at most LAYOUT.leader.runMax: a stratum far left of the column (the apexes) takes the rest as elbow.
      // A stratum whose silhouette is near the column (its live coordinate, drawn right-below the cross, would run into
      // the block) puts its block above the coordinate line.
      const gapX = colX - sxs[i];
      const near = gapX < COORD_W;
      const need = Math.max(near ? NEAR_RISE : MIN_RISE, gapX - runMax);
      let tgt = sy[i] + (i <= 3 || near ? -need : need);
      capHi[i] = Infinity; capLo[i] = -Infinity;
      // A leader's run never crosses text the drawing owns (his name on the rim, the status line…): its block moves
      // to the nearer side of that box (the column solve below keeps every block clear of the others).
      for (let q = 0; q < keepout.boxes.length; q++) {
        const b = keepout.boxes[q];
        if (!b.on || b.id.startsWith('fig:') || colX < b.x0 || sxs[i] > b.x1) continue;
        if (tgt > b.y0 - 10 && tgt < b.y1 + 10) tgt = tgt - (b.y0 - 10) < b.y1 + 10 - tgt ? b.y0 - 10 : b.y1 + 10;
        // …nor does its 45° elbow: МОНОЛИТ's low CORE camera (A12) brings N's tip close above his name, and an elbow
        // dropping to a block below the name would cut through its letters — the block then stays on the near side.
        const rise = tgt - sy[i];
        if (Math.abs(rise) > 1 && (sy[i] < b.y0 - 10 || sy[i] > b.y1 + 10)
          && segHits(sxs[i], sy[i], sxs[i] + Math.abs(rise), tgt, b.x0 - 28, b.y0 - 12, b.x1 + 28, b.y1 + 12)) {   // a clear berth, not a graze
          tgt = rise > 0 ? Math.max(sy[i], b.y0 - 10) : Math.min(sy[i], b.y1 + 10);
          if (rise > 0) capHi[i] = Math.min(capHi[i], tgt); else capLo[i] = Math.max(capLo[i], tgt);
        }
      }
      zv[i] = tgt - i * BLOCK_H;
    }
    let nb = 0;
    for (let i = 0; i < 7; i++) {
      pv[nb] = zv[i]; pw[nb] = 1; pn[nb] = 1; nb++;
      while (nb > 1 && pv[nb - 2] > pv[nb - 1]) {
        const w2 = pw[nb - 2] + pw[nb - 1];
        pv[nb - 2] = (pv[nb - 2] * pw[nb - 2] + pv[nb - 1] * pw[nb - 1]) / w2; pw[nb - 2] = w2; pn[nb - 2] += pn[nb - 1]; nb--;
      }
    }
    for (let b = 0, i = 0; b < nb; b++) for (let k = 0; k < pn[b]; k++, i++) ty[i] = pv[b] + i * BLOCK_H;
    // Keep the column on screen (a 64 px margin top and bottom), shifting the whole stack.
    const lo = 64 + BLOCK_H / 2 - ty[0], hi = layout.h - 64 - BLOCK_H / 2 - ty[6];
    const shift = lo > 0 ? lo : hi < 0 ? hi : 0;
    // The text limits are hard (the least-squares stack may have pushed a block back across them): clamp the block and
    // carry the spacing on to its neighbours — the blocks beyond it move with it, the leaders' elbows take the rest.
    for (let i = 0; i < 7; i++) {
      if (ty[i] + shift > capHi[i]) { ty[i] = capHi[i] - shift; for (let j = i - 1; j >= 0; j--) ty[j] = Math.min(ty[j], ty[j + 1] - BLOCK_H); }
      if (ty[i] + shift < capLo[i]) { ty[i] = capLo[i] - shift; for (let j = i + 1; j < 7; j++) ty[j] = Math.max(ty[j], ty[j - 1] + BLOCK_H); }
    }
    // …but the screen is harder still: a cap carried down (or up) the stack must never push a block off the screen
    // (seen while RECALL's gaps are still closing under a resting pointer — the Key then stands taller than the column).
    // Clamping each block to its own on-screen slot keeps the BLOCK_H spacing intact.
    for (let i = 0; i < 7; i++) {
      const top = 64 + BLOCK_H / 2 + i * BLOCK_H - shift, bot = layout.h - 64 - BLOCK_H / 2 - (6 - i) * BLOCK_H - shift;
      if (bot >= top) ty[i] = Math.min(bot, Math.max(top, ty[i]));
    }
    // Every shoulder at least a lane long: the column moves right of the furthest elbow (never off the screen's
    // right side, where the widest block and the navigator need COL_RESERVE px).
    for (let i = 0; i < 7; i++) colX = Math.max(colX, sxs[i] + Math.abs(ty[i] + shift - sy[i]) + shoulder);
    colX = Math.min(colX, (layout.w || 1440) - COL_RESERVE);
    // The blocks hold still while the Key settles (explode spring, notice, lean): a block moves only when its ideal place
    // drifts more than HYST px; meanwhile the leader's elbow absorbs the anchor's motion. The rise is set against the
    // overlay's own low-passed anchor for this frame (same projection, same τ), so the block lands exactly on blockY.
    if (!laid || Math.abs(colX - colShown) > HYST) colShown = Math.round(colX);
    const k = 1 - Math.exp(-(dt * 1000) / TIMING.labelLowpass);
    for (let i = 0; i < 7; i++) {
      const want = ty[i] + shift;
      if (!laid || Math.abs(want - blockY[i]) > HYST) blockY[i] = Math.round(want);
      const scr = anchors[i].screen, fresh = scr.x === 0 && scr.y === 0;
      const ex = fresh ? sxs[i] : scr.x + (sxs[i] - scr.x) * k, ey = fresh ? sy[i] : scr.y + (sy[i] - scr.y) * k;
      const room = Math.max(0, colShown - ex - Math.max(LAYOUT.leader.elbowMin, shoulder));   // the elbow ends before the lane
      const rise = Math.max(-room, Math.min(room, blockY[i] - ey));
      const len = colShown - (ex + Math.abs(rise));
      const L = leaders[i];
      // The overlay re-lays a leader whenever its anchor moves; force it only when the anchor stands still.
      const still = Math.abs(scr.x - lastX[i]) < 0.1 && Math.abs(scr.y - lastY[i]) < 0.1;
      lastX[i] = scr.x; lastY[i] = scr.y;
      if (L.rise !== rise || L.len !== len) { L.rise = rise; L.len = len; if (still) anchors[i].update(UPD); }
      const op = i === H.idx || H.idx < 0 ? '1' : '0.55';
      if (blocks[i].style.opacity !== op) blocks[i].style.opacity = op;
    }
    laid = true;
    placeCoords();
  };

  /** The live coordinates (MICRO, beside each survey cross): a deterministic, greedy screen-space pass. For each
   *  anchor, every candidate quadrant is scored by its overlap with the label column, the coordinates already placed,
   *  every leader (its own one counts double) and the keep-out boxes (dimension values, rim name, scale figure,
   *  status); the cheapest wins, but the current one is kept unless the new one is clearly better (no flicker). */
  function placeCoords() {
    const W = layout.w || 1440, Hh = layout.h || 900;
    for (let i = 0; i < 7; i++) if (!blockW[i]) { blockW[i] = Math.max(120, wraps[i].offsetWidth || 0); blockH[i] = Math.min(BLOCK_H, Math.max(40, wraps[i].offsetHeight || 0)); }
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const a = anchors[i];
      a.coordSize(csz);
      const cw = csz.w || COORD_W, ch = csz.h || 12;
      const cx = a.screen.x, cy = a.screen.y;
      const runY = cy + leaders[i].rise, elbowX = cx + Math.abs(leaders[i].rise);
      let best = -1, bestC = Infinity, prevC = Infinity;
      for (let c = 0; c < NC; c++) {
        // 0, 1: on the shoulder (above, below its run), right-aligned short of the column; then the fallbacks beside
        // the cross (a column pushed against the screen edge leaves no lane)
        const sh = c < 2;
        const cd = sh ? null : CAND[c - 2], left = sh ? 0 : cd[2];
        const x0 = sh ? colShown - SHOULDER_END - cw : left ? cx + cd[0] - cw : cx + cd[0], x1 = x0 + cw;
        const y0 = sh ? (c === 0 ? runY - 4 - ch : runY + 4) : cd[1] >= 0 ? cy + cd[1] : cy + cd[1] - ch, y1 = y0 + ch;
        const bias = sh ? (c === 0 ? 0 : 24) + (x0 - COORD_PAD < elbowX + 4 ? 6000 : 0) : 200 + cd[3];
        const X0 = x0 - COORD_PAD, Y0 = y0 - COORD_PAD, X1 = x1 + COORD_PAD, Y1 = y1 + COORD_PAD;
        let cost = bias + keepout.overlap(X0, Y0, X1, Y1);
        if (x0 < 8 || x1 > W - 8 || y0 < 8 || y1 > Hh - 8) cost += 1e5;
        for (let j = 0; j < 7; j++) {
          const bx0 = colShown - 4, by0 = blockY[j] - blockH[j] / 2 - 5;     // a block keeps 5 px of air around it
          const w = Math.min(X1, bx0 + blockW[j] + 4) - Math.max(X0, bx0), h = Math.min(Y1, by0 + blockH[j] + 10) - Math.max(Y0, by0);
          if (w > 0 && h > 0) cost += 2 * w * h;
          const L = leaders[j], sx = anchors[j].screen.x, sy2 = anchors[j].screen.y;
          const ex = sx + Math.abs(L.rise), ey = sy2 + L.rise;
          if (segHits(sx, sy2, ex, ey, X0, Y0, X1, Y1) || segHits(ex, ey, colShown, ey, X0, Y0, X1, Y1)) cost += j === i ? 900 : 500;
          if (j !== i && segHits(sx - 5, sy2, sx + 5, sy2, X0, Y0, X1, Y1)) cost += 500;   // another survey cross
        }
        for (let k = 0; k < n; k++) {
          const w = Math.min(X1, placed[k * 4 + 2]) - Math.max(X0, placed[k * 4]), h = Math.min(Y1, placed[k * 4 + 3]) - Math.max(Y0, placed[k * 4 + 1]);
          if (w > 0 && h > 0) cost += 2 * w * h;
        }
        if (c === coordPick[i]) prevC = cost;
        if (cost < bestC) { bestC = cost; best = c; }
      }
      if (coordPick[i] >= 0 && prevC <= bestC + 60) best = coordPick[i];
      coordPick[i] = best;
      let x0, y0;
      if (best < 2) {
        x0 = colShown - SHOULDER_END - cw; y0 = best === 0 ? runY - 4 - ch : runY + 4;
        a.setCoordPlace(Math.round(x0 - cx), Math.round(y0 - cy), false);
      } else {
        const cd = CAND[best - 2], dx = cd[0], dy = cd[1], left = cd[2];
        const ry = dy >= 0 ? dy : dy - ch;
        a.setCoordPlace(dx, ry, !!left);
        x0 = left ? cx + dx - cw : cx + dx; y0 = cy + ry;
      }
      placed[n * 4] = x0; placed[n * 4 + 1] = y0; placed[n * 4 + 2] = x0 + cw; placed[n * 4 + 3] = y0 + ch; n++;
    }
  }
  /** A14: the dims may be withheld (e.g. while UNFOLD is open) — WP1-internal switch. */
  H.setDimsAllowed = (b) => { dimsKey = b ? 0 : -1; };
  return H;
}
