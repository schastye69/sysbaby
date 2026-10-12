// key/hover.js — WP1. The layers become legible (SPEC §3.4, §2.7 "Key stratum", §2.3 leaders & dimension lines;
// ARCH §6.1.6 A14; SPEC-ADDENDUM A2.3 caller duty).
//   trigger   desktop pointer inside the Key's projected ellipse for ≥ 120 ms (or resting on one of its labels)
//   explode   heavy spring: gaps 0.020 → 0.090 m; the hovered stratum's neighbours pushed a further 0.012 m; the hovered
//             stratum slides 0.06 m toward the lamp and turns its sign face toward it (ω 6; ≤ 24° so it stays legible)
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
import { GAP, KEY, STRATA_GEOM, TIMING, MOTION, LAYOUT, radiusAt } from '../core/tokens.js';

const DEG = Math.PI / 180;
const zetaFor = (os) => -Math.log(os) / Math.sqrt(Math.PI * Math.PI + Math.log(os) ** 2);
const OUT_ZETA = zetaFor(MOTION.settleOvershoot);           // 2 % overshoot
const BLOCK_H = 78, MIN_RISE = 17, NEAR_RISE = 40, COORD_W = 122, HYST = 5;
const UPD = {};
/** SPEC §9.4: on desktop hover the stratum's note plays at −30 dB (ARCH stratumNote {i, quiet}); shared option objects. */
const HOV = { index: -1 };   // shared key:hover payload (G9: nothing allocated in the frame)
const NOTE = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ i, quiet: true }));
/** The right silhouette point of each stratum: at its mid height, on its profile radius there. */
const MID_R = STRATA_GEOM.map((s) => radiusAt(s.mid));

function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

export function createHover(K, ctx) {
  const H = {
    amt: 0, idx: -1, slide: new Float32Array(7), turn: new Float32Array(7), push: new Float32Array(7), gap: GAP.rest,
  };
  const amt = new Spring(SPRING.heavy.omega, 1, 0);
  const slide = [], turn = [];
  for (let i = 0; i < 7; i++) { slide.push(Spring.from(SPRING.heavy)); turn.push(Spring.from(SPRING.heavy)); }
  let insideSince = -1, overLabel = false, active = false, lastIdx = -1, lastPick = -1e9, emitted = -2;
  let dimsOn = false, dimsKey = 0, dimsCheck = 0, laid = false, colShown = 0;
  const blockY = new Float32Array(7);
  const _w = new Vector3(), _r = new Vector3(), _l = new Vector3();
  const _pp = { x: 0, y: 0, depth: 0, visible: false };

  // ── Label blocks (overlay anchors) ──
  const anchors = [], blocks = [], leaders = [], titleEls = [], lineEls = [], wraps = [];
  const zv = new Float64Array(7), pv = new Float64Array(7), pw = new Float64Array(7), pn = new Float64Array(7);
  const sy = new Float32Array(7), ty = new Float32Array(7), sxs = new Float32Array(7), lastX = new Float32Array(7), lastY = new Float32Array(7);
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
      const L = { side: 'right', len: 40, rise: -MIN_RISE };
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
    if (on) nadirCopy();
    const fig = ctx.fx && ctx.fx.scaleFigure;
    try { if (fig) { if (on) fig.show('hover'); else fig.hide(); } } catch (e) { /* the FX layer's own */ }
    if (on && dimsOn) for (const d of dims) d.drawIn(TIMING.dimsDraw);
  }

  // ── A14 dimension lines ──
  const dims = [];
  let dimRx = 0;
  const P = (x, y) => (out) => out.set(x, y, 0).applyMatrix4(K.group.parent ? K.group.parent.matrixWorld : K.group.matrixWorld);
  function makeDims(si) {
    for (const d of dims) d.remove();
    dims.length = 0;
    if (!ctx.dims) return;
    dimRx = si.rx;
    // ↕ clears the grain rings (outer edge 1.90 × 0.62 m) where the screen allows; Ø sits under the bottom tip.
    const ring = (1.9 * 0.62 * si.r) / KEY.radius;
    dims.push(ctx.dims.add({ owner: 'key', a: P(0, 1.2), b: P(0, -1.2), side: 'left', label: '↕ 2.40 М', offset: Math.max(si.rx + 26, Math.min(ring + 46, si.x - 40)) }));
    dims.push(ctx.dims.add({ owner: 'key', a: P(-0.62, 0), b: P(0.62, 0), side: 'below', label: 'Ø 1.24 М', offset: si.ry + 26 }));
  }
  function setDims(on, si) {
    if (on && (!dims.length || Math.abs(si.rx - dimRx) > dimRx * 0.08)) { makeDims(si); dimsOn = false; }
    if (on === dimsOn) return;
    dimsOn = on;
    for (const d of dims) { d.setVisible(on); if (on) d.drawIn(TIMING.dimsDraw); }
  }

  /** dt s · t loop ms · si Key screen info · interactiveRest: interactive, CORE, idle phase, not travelling ·
   *  dimsRest: interactive in CORE (idle or the boot's ASSEMBLY) — the A14 dims draw on the first such frame */
  H.update = function update(dt, t, si, interactiveRest, dimsRest = interactiveRest) {
    if (t - dimsCheck > 250 || !dimsRest || !dimsOn) { dimsCheck = t; setDims(dimsRest && dimsKey >= 0, si); }
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
    const colX = si.x + si.rx * 1.04 + 64;
    for (let i = 0; i < 7; i++) {
      getters[i](_w); rig.project(_w, _pp);
      sy[i] = _pp.y; sxs[i] = _pp.x;
      // The run is at most LAYOUT.leader.runMax: a stratum far left of the column (the apexes) takes the rest as elbow.
      // A stratum whose silhouette is near the column (its live coordinate, drawn right-below the cross, would run into
      // the block) puts its block above the coordinate line.
      const gapX = colX - sxs[i];
      const near = gapX < COORD_W;
      const need = Math.max(near ? NEAR_RISE : MIN_RISE, gapX - LAYOUT.leader.runMax);
      zv[i] = sy[i] + (i <= 3 || near ? -need : need) - i * BLOCK_H;
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
      const room = Math.max(0, colShown - ex - LAYOUT.leader.elbowMin);   // the 45° elbow must end before the column
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
  };
  /** A14: the dims may be withheld (e.g. while UNFOLD is open) — WP1-internal switch. */
  H.setDimsAllowed = (b) => { dimsKey = b ? 0 : -1; };
  return H;
}
