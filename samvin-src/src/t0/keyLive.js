// t0/keyLive.js — WP11. The living SVG Key of T0 (SPEC §12.5 CORE; SPEC-ADDENDUM A2.0.2–A2.0.4, A2.3, A2.5, A2.9, A9.1):
// placement (desktop: centred, 56 % of the height like the WebGL Key; phone start: 78 % at 47 %; phone idle: centred at
// 44 %), the cryptex (each band's strip slides as a turning, locks with a 4 % snap), the breathing ember nucleus, the
// lamp (a radial mask that follows the pointer and brightens the edges; after 3,000 ms still it sweeps round the Key
// every 9,000 ms), the construction annotations (↕ 2.40 М, Ø 1.24 М, survey crosses, the scale figure «ТЫ» / «ПАПА»),
// and the picture twins: ПРОСВЕТ, the 343 wave ring, nucleus level/flash, СВЁРТКА retract, lock flashes, ПАУЗА freeze,
// the ИСТОК cracks on N.
import { STRATA_GEOM, radiusAt, TIMING } from '../core/tokens.js';
import { loop, ORDER } from '../core/loop.js';
import { breath, after, tween } from '../core/clock.js';
import { layout } from '../core/layout.js';
import { app } from '../core/store.js';
import { input } from '../core/input.js';
import { WORLD } from '../data/world.js';
import { createKeySvg } from './keySvg.js';
import { svg, el, fmt, dimLine, svgCross, reduced } from './dom.js';

const GOLDEN = (137.508 * Math.PI) / 180;
export const SCRAMBLE = (i) => i * GOLDEN;
const easeSnap = (u) => { const c = 1.70158 * 0.55; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };   // ≈ 4 % overshoot
const FIG = [[0.030, 0.860], [0.105, 0.830], [0.135, 0.790], [0.140, 0.640], [0.130, 0.470], [0.108, 0.465], [0.102, 0.640],
  [0.092, 0.735], [0.088, 0.500], [0.078, 0.020], [0.080, 0.000], [0.018, 0.000], [0.012, 0.455]];

export function createKeyLive(ctx, parent) {
  const wrap = el('div', 't0-keywrap', null, parent);
  const K = createKeySvg({ sigil: WORLD.clan.sigil });
  const axUp = el('i', 't0-axis t0-axis--up', null, wrap), axDn = el('i', 't0-axis t0-axis--dn', null, wrap);
  wrap.appendChild(K.root);
  // the lamp: a 240 px window (static radial mask) that moves with the light over a counter-moved white copy of the
  // edges — two compositor transforms per frame, no repaint
  const lampWin = el('div', 't0-lamp', null, wrap);
  lampWin.appendChild(K.brightSvg);
  const LR = 120;
  const px = svg('svg', { class: 't0-px', 'aria-hidden': 'true' }, wrap);
  const annot = svg('g', { class: 't0-annot' }, px);
  const fxG = svg('g', null, px);
  const cracks = K.cracks;

  const st = STRATA_GEOM.map((s) => ({ i: s.i, rot: 0, vel: 0, from: 0, to: 0, t0: -1, dur: 0, onDone: null }));
  const L = {
    K, wrap, px, mode: 'idle', level: 1, paused: false, lit: false, dark: false, visible: true,
    lampX: 0, lampY: 0, lampA: 0.0, sweepT: 0, placeTw: null,
  };

  // ── placement ────────────────────────────────────────────────────────────────────────────────────────────────
  function target(mode) {
    const w = layout.w || innerWidth, h = layout.h || innerHeight;
    // SPEC §4.2: camera 5.2 m (WP2: 72.5 % of the height at the CORE lens — the 78 % figure would miss the pre-roll stroke)
    if (mode === 'start') { const k = Math.min((0.725 * h) / 2.4, (0.9 * w) / 1.24); return { cx: w / 2, cy: 0.47 * h, k }; }
    // phone: the Key sits below the «СЕГОДНЯ» block, its rim name and Ø line clear of the band bar
    if (layout.isPhone) { const k = Math.min((0.41 * h) / 2.4, (0.62 * w) / 1.24); return { cx: w / 2, cy: Math.max(0.3 * h, 250) + 1.2 * k, k }; }
    return { cx: w / 2, cy: h / 2, k: (0.56 * h) / 2.4 };
  }
  /** mode 'idle' | 'start'; ms > 0 eases (the phone pull-back, 900 ms). */
  /** The axis: two DOM hairlines (2 px ember, 0.35 inside fading to 0 at ±(1.20 + 3.2) m), skipping the hollow. */
  function placeAxis() {
    const k = K.k, top = (1.2 + 3.2) * k, hole = 0.30 * k;
    Object.assign(axUp.style, { left: `${fmt(K.cx - 1)}px`, top: `${fmt(K.cy - top)}px`, height: `${fmt(top - hole)}px` });
    Object.assign(axDn.style, { left: `${fmt(K.cx - 1)}px`, top: `${fmt(K.cy + hole)}px`, height: `${fmt(top - hole)}px` });
  }
  /** A CSS-transform view of the drawing at (cx, cy, k) relative to the built geometry (compositor only). */
  L.view = (cx, cy, k) => {
    const s = k / K.k, t = `translate(${fmt(cx - K.cx * s)}px,${fmt(cy - K.cy * s)}px) scale(${fmt(s * 1000) / 1000})`;
    K.root.style.transformOrigin = '0 0'; K.root.style.transform = t;
    wrap.classList.add('is-moving');
  };
  L.clearView = () => { K.root.style.transform = ''; wrap.classList.remove('is-moving'); };
  L.place = (cx, cy, k) => { L.clearView(); K.place(cx, cy, k); placeAxis(); };
  L.setMode = (mode, ms = 0) => {
    L.mode = mode;
    const T = target(mode);
    if (L.placeTw) { L.placeTw.cancel(); L.placeTw = null; }
    if (!(ms > 0) || reduced()) { L.place(T.cx, T.cy, T.k); annotate(); return; }
    const A = { cx: K.cx, cy: K.cy, k: K.k };
    px.classList.add('is-off');
    wrap.classList.add('is-moving');
    L.placeTw = tween(ms, (u) => L.view(A.cx + (T.cx - A.cx) * u, A.cy + (T.cy - A.cy) * u, A.k + (T.k - A.k) * u), (u) => 1 - Math.pow(1 - u, 3));
    L.placeTw.done.then(() => { L.placeTw = null; wrap.classList.remove('is-moving'); L.place(T.cx, T.cy, T.k); annotate(); px.classList.remove('is-off'); });
  };
  L.target = target;
  L.screen = () => ({ x: K.cx, y: K.cy, r: 1.2 * K.k });

  // ── annotations: dimension lines, survey crosses, the scale figure (desktop) ────────────────────────────────
  function annotate() {
    while (annot.firstChild) annot.removeChild(annot.firstChild);
    const k = K.k, cx = K.cx, cy = K.cy;
    const top = cy - 1.2 * k, bot = cy + 1.2 * k, R = 0.62 * k;
    const dx = cx + R + (layout.isPhone ? 18 : 40);
    svg('path', { d: `M${fmt(cx + 6)} ${fmt(top)}H${fmt(dx + 4)}M${fmt(cx + 6)} ${fmt(bot)}H${fmt(dx + 4)}`, class: 't0-ext' }, annot);
    dimLine(annot, dx, top, dx, bot, '↕ 2.40 М', { cls: 't0-dim--key' });
    const dy = bot + 22;
    svg('path', { d: `M${fmt(cx - R)} ${fmt(cy + 8)}V${fmt(dy + 4)}M${fmt(cx + R)} ${fmt(cy + 8)}V${fmt(dy + 4)}`, class: 't0-ext' }, annot);
    dimLine(annot, cx - R, dy, cx + R, dy, 'Ø 1.24 М', { cls: 't0-dim--key' });
    svgCross(annot, cx, top - 10); svgCross(annot, cx - R, cy); svgCross(annot, cx + R, cy);
    if (!layout.isPhone) figures(cx, k, bot);
    L.annotY = dy;
    if (L.onAnnotate) L.onAnnotate();
  }
  /** «ТЫ» (and «ПАПА») at true scale beside the Key, feet level with the bottom tip (A2.3 T0: an SVG outline). */
  function figures(cx, k, ground) {
    const list = [];
    const h = WORLD.operator.heightM || 1.3, hp = WORLD.operator.papaHeightM;
    if (hp) { list.push({ x: -1.15, h, label: 'ТЫ' }, { x: -1.75, h: hp, label: 'ПАПА' }); } else list.push({ x: -1.25, h, label: 'ТЫ' });
    for (const f of list) {
      const x0 = cx + f.x * k, H = f.h * k;
      if (x0 - 0.2 * k < 24) continue;
      let d = '';
      const pts = FIG.map(([x, y]) => [x, y]).concat(FIG.slice().reverse().map(([x, y]) => [-x, y]));
      pts.forEach(([x, y], j) => { d += `${j ? 'L' : 'M'}${fmt(x0 + x * H)} ${fmt(ground - y * H)}`; });
      const g = svg('g', { class: 't0-fig' }, annot);
      svg('path', { d: `${d}Z`, class: 't0-fig__l' }, g);
      svg('circle', { cx: x0, cy: ground - 0.935 * H, r: 0.065 * H, class: 't0-fig__l' }, g);
      svg('path', { d: `M${fmt(x0 - 0.3 * k)} ${fmt(ground)}H${fmt(x0 + 0.3 * k)}`, class: 't0-fig__g' }, g);
      dimLine(g, x0 - 0.1 * k - 0.15 * H, ground, x0 - 0.1 * k - 0.15 * H, ground - H, `↕ ${f.h.toFixed(2)} М`);
      const t = svg('text', { x: x0, y: ground - H - 8, class: 't-label t0-svglabel', 'text-anchor': 'middle' }, g);
      t.textContent = f.label;
    }
  }

  // ── cryptex ──────────────────────────────────────────────────────────────────────────────────────────────────
  L.scramble = () => { for (const s of st) { s.t0 = -1; s.vel = 0; s.rot = SCRAMBLE(s.i); K.setRot(s.i, s.rot); } };
  L.aligned = () => st.every((s) => Math.abs(s.rot) < 1e-3 && s.t0 < 0 && s.vel === 0);
  /** Spin every unlocked band (rad/s, alternating directions like a cryptex being worked). */
  L.spin = (speed = 3.2) => { for (const s of st) { if (s.t0 >= 0) continue; s.vel = speed * (s.i % 2 ? -1 : 1) * (0.8 + 0.06 * s.i); } };
  /** Lock band i: settles to aligned over `ms` with a 4 % snap; the white 1-frame flash on its edges on landing. */
  L.lock = (i, ms = 160, flash = true) => new Promise((res) => {
    const s = st[i];
    if (!s) { res(); return; }
    const per = (Math.PI * 2) / STRATA_GEOM[i].n;
    let r = s.rot % per;
    if (r > per / 2) r -= per; else if (r < -per / 2) r += per;
    s.rot = r; s.vel = 0;
    if (reduced() || ms <= 0) { s.rot = 0; s.t0 = -1; K.setRot(i, 0); if (flash) K.flash(i); res(); return; }
    s.from = r; s.to = 0; s.t0 = loop.now; s.dur = ms;
    s.onDone = () => { if (flash) K.flash(i); res(); };
  });
  /** Turn band i to rad (no lock flash), used by the phone stroke drift and СВЁРТКА. */
  L.turnTo = (i, rad, ms) => new Promise((res) => {
    const s = st[i];
    if (!s) { res(); return; }
    s.vel = 0;
    if (!(ms > 0) || reduced()) { s.rot = rad; s.t0 = -1; K.setRot(i, rad); res(); return; }
    s.from = s.rot; s.to = rad; s.t0 = loop.now; s.dur = ms; s.onDone = res;
  });
  L.alignAll = () => { for (const s of st) { s.vel = 0; s.t0 = -1; s.rot = 0; K.setRot(s.i, 0); } };

  // ── nucleus / ring / lit nodes ──────────────────────────────────────────────────────────────────────────────
  L.ignite = (flash = true) => {
    L.lit = true; L.dark = false; L.level = 1;
    K.root.classList.remove('is-dark', 'is-asleep');
    if (flash) L.nucleusFlash();
  };
  L.douse = () => { L.lit = false; K.root.classList.add('is-dark'); };
  L.nucleusFlash = () => {
    K.nucleus.classList.add('is-white');
    requestAnimationFrame(() => requestAnimationFrame(() => K.nucleus.classList.remove('is-white')));
  };
  L.setRing = (b) => K.root.classList.toggle('has-ring', !!b);
  L.setLit = (n) => K.setLit(n);

  // ── twins ────────────────────────────────────────────────────────────────────────────────────────────────────
  /** ПРОСВЕТ: every stroke --white at 1.5 px for ≥ 33 ms of presented time, then eases back over 240 ms. */
  L.prosvet = () => {
    const r = K.root;
    r.classList.remove('is-prosvet-out');
    r.classList.add('is-prosvet');
    const t0 = performance.now();
    let frames = 0;
    const step = (t) => {
      frames++;
      if (frames < 3 || t - t0 < 33) { requestAnimationFrame(step); return; }
      r.classList.remove('is-prosvet');
      r.classList.add('is-prosvet-out');
      after(260, () => r.classList.remove('is-prosvet-out'));
    };
    requestAnimationFrame(step);
  };
  /** ВОЛНА 343: a 1 px --silver circle from the nucleus to the farthest viewport corner in 875 ms, fades over 240 ms. */
  L.wave = (ms = 875) => {
    const cx = K.cx, cy = K.cy, w = layout.w || innerWidth, h = layout.h || innerHeight;
    const R = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy));
    const c = svg('circle', { cx, cy, r: 1, class: 't0-wave' }, fxG);
    L.waveAt = performance.now();
    tween(ms, (u) => c.setAttribute('r', fmt(1 + u * R))).done.then(() => {
      c.classList.add('is-out');
      after(260, () => { if (c.parentNode) c.parentNode.removeChild(c); });
    });
  };
  L.lockFlash = (i) => K.flash(i | 0, 'white', 1);
  L.nucleus = (level) => { L.level = Math.max(0, Math.min(1.5, +level || 0)); };
  L.pause = (on) => { L.paused = !!on; K.root.classList.toggle('is-paused', L.paused); };
  /** СВЁРТКА (A2.9 T0): noise → collapse (strokes retract toward the nucleus, bands scramble to the golden angles,
   *  grain rings spiral in) → tail (the nucleus blinks per slice) → zero / asleep (dark Key, edges at 40 %). */
  L.close = (phase, t01) => {
    const r = K.root, u = Math.max(0, Math.min(1, +t01 || 0));
    if (phase === 'noise') { r.classList.add('is-closing'); r.style.setProperty('--retract', '0'); return; }
    if (phase === 'collapse') {
      r.classList.add('is-closing');
      r.style.setProperty('--retract', fmt(u));
      r.style.setProperty('--gscale', fmt(1 - 0.85 * u));
      r.style.setProperty('--gx', `${fmt(K.cx)}px`); r.style.setProperty('--gy', `${fmt(K.cy)}px`);
      for (const s of st) { s.t0 = -1; s.vel = 0; s.rot = SCRAMBLE(s.i) * u; K.setRot(s.i, s.rot); }
      return;
    }
    if (phase === 'tail') { L.level = (Math.round(u * 5) % 2) ? 0.4 : 1; return; }
    if (phase === 'zero' || phase === 'asleep') {
      r.classList.add('is-closing', 'is-asleep');
      r.style.setProperty('--retract', '0');
      L.douse(); L.setRing(false); L.level = 0;
    }
  };
  /** A wake / new boot clears the СВЁРТКА state. */
  L.reset = () => {
    const r = K.root;
    r.classList.remove('is-closing', 'is-asleep', 'is-prosvet', 'is-prosvet-out');
    r.style.removeProperty('--retract'); r.style.removeProperty('--gscale');
    L.level = 1;
  };
  /** ИСТОК (A2.5 T0): five electrum crack lines spread across the N band, then cool to silver. */
  L.crackN = () => {
    while (cracks.firstChild) cracks.removeChild(cracks.firstChild);
    const st = STRATA_GEOM[6], k = K.k;
    for (let c = 0; c < 5; c++) {
      let x = (c - 2) * 0.026, y = st.top - 0.004;
      let d = `M${fmt(K.cx + x * k)} ${fmt(K.cy - y * k)}`;
      for (let q = 0; q < 4; q++) {
        y -= (st.top - st.bot) / 4.6;
        x += (((c * 7 + q * 3) % 5) - 2) * 0.006;
        const rr = radiusAt(y) * 0.8;
        x = Math.max(-rr, Math.min(rr, x));
        d += `L${fmt(K.cx + x * k)} ${fmt(K.cy - y * k)}`;
      }
      svg('path', { d, class: 't0k-crack', pathLength: '1' }, cracks);
    }
    cracks.classList.remove('is-cool');
    requestAnimationFrame(() => cracks.classList.add('is-on'));
    after(TIMING.electrum, () => cracks.classList.add('is-cool'));
  };

  // ── per frame: cryptex tweens / spin, nucleus breath, lamp ──────────────────────────────────────────────────
  const m = { x: 0, y: 0, a: -1 };
  function frame(dt) {
    if (!L.visible) return;
    const frozen = L.paused;
    for (const s of st) {
      if (s.t0 >= 0) {
        const u = Math.min(1, (loop.now - s.t0) / Math.max(1, s.dur));
        s.rot = s.from + (s.to - s.from) * (s.to === 0 ? easeSnap(u) : u);
        K.setRot(s.i, s.rot);
        if (u >= 1) { s.t0 = -1; s.rot = s.to; K.setRot(s.i, s.rot); const f = s.onDone; s.onDone = null; if (f) f(); }
      } else if (s.vel !== 0 && !frozen) { s.rot += s.vel * dt; K.setRot(s.i, s.rot); }
    }
    // nucleus: intensity 0.80 ↔ 1.00 on the world breath (reduced: 25 % amplitude, via breath.amp)
    const b = frozen ? 0.5 : breath.mix(0, 1);
    const lv = L.lit ? L.level * (0.8 + 0.2 * b) : 0;
    const no = Math.round(Math.min(1, lv) * 50) / 50, ro = Math.round((0.35 + 0.4 * b) * 50) / 50;
    if (no !== L.no) { L.no = no; K.nucleusEl.style.opacity = String(no); }
    if (ro !== L.ro) { L.ro = ro; K.ringEl.style.opacity = String(ro); }
    // the lamp: the pointer while it moved in the last 3,000 ms (or the finger while down), else the idle sweep
    const p = input.pointer;
    const live = (p.type !== 'touch' && p.x > -9000 && loop.now - p.lastMove < TIMING.idleLampMs) || (p.type === 'touch' && p.down);
    let tx, ty;
    if (live) { tx = p.x; ty = p.y; } else {
      L.sweepT += dt * 1000;
      const a = (L.sweepT / TIMING.lampSweepMs) * Math.PI * 2;
      tx = K.cx + Math.cos(a) * 0.9 * K.k; ty = K.cy + Math.sin(a) * 1.05 * K.k;
    }
    const kk = 1 - Math.exp(-dt / 0.09);
    L.lampX += (tx - L.lampX) * kk; L.lampY += (ty - L.lampY) * kk;
    L.lampA += ((live ? 1 : 0.75) - L.lampA) * kk;
    if (Math.abs(L.lampX - m.x) > 0.3 || Math.abs(L.lampY - m.y) > 0.3 || Math.abs(L.lampA - m.a) > 0.01) {
      m.x = L.lampX; m.y = L.lampY; m.a = L.lampA;
      const lx = Math.round(L.lampX - LR), ly = Math.round(L.lampY - LR);
      lampWin.style.transform = `translate3d(${lx}px,${ly}px,0)`;
      K.brightSvg.style.transform = `translate3d(${-lx}px,${-ly}px,0)`;
      lampWin.style.opacity = fmt(L.lampA);
    }
  }
  loop.add(frame, ORDER.UI);

  L.show = (b) => { L.visible = !!b; wrap.hidden = !b; };
  L.relayout = () => { if (!L.placeTw) L.setMode(L.mode, 0); };
  L.setMode('idle', 0);
  L.lampX = K.cx; L.lampY = K.cy;
  return L;
}
