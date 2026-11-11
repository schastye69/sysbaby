// t0/resonance.js — WP11. РЕЗОНАНС drawn (SPEC §3.7, §12.5 S01 in T0; SPEC-ADDENDUM A4.1 guest caption): hold the SVG
// Key → at 350 ms the 1.20 m plate appears in front of it (slate frame, survey crosses, ↔ / ↕ 1.20 М, MICRO
// `ПЛАСТИНА · МОДА n / m`, readout LABEL `РЕЗОНАНС` + DATA `pct%` with a left tick); the nodal lines of the Chladni field
// u = cos(nπx)cos(mπy) − cos(mπx)cos(nπy) are traced by MARCHING SQUARES on a 64² grid and drawn as sand (a dotted
// silver line) stepping through the six modes at 600, 1,500, 2,400, 3,300, 4,200, 5,100 ms; at 6,000 the subject
// (nextSubject, guests first): its glyph in ember sand cooling to white over 1,500 ms, the plate frame ember for 1,500 ms,
// the DOM caption (HEADING / BODY) + LABEL `РЕЗОНАНС 100%` — the first time, S01. Release: the sand falls and fades
// (700 ms), the readout counts down to 00 % (300 ms). Reduced motion: cuts, timings kept.
import { MODES, plateField, nextSubject } from '../halls/core/resonanceModel.js';
import { loop, ORDER } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { layout } from '../core/layout.js';
import { app, setPhase } from '../core/store.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { svg, el, fmt, dimLine, svgCross, block, glyphPath, reduced } from './dom.js';

const STEPS = [600, 1500, 2400, 3300, 4200, 5100];
const N = 64;

/** Nodal set of mode (n, m) by marching squares (iso 0) on an N² grid over [−1, 1]², in a box of `size` px at (x0, y0). */
export function nodalPath(n, m, x0, y0, size) {
  const v = new Float32Array((N + 1) * (N + 1));
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) v[j * (N + 1) + i] = plateField(n, m, -1 + (2 * i) / N, -1 + (2 * j) / N);
  const s = size / N;
  let d = '';
  const P = (x, y) => `${fmt(x0 + x * s)} ${fmt(y0 + y * s)}`;
  const lerp = (a, b) => (Math.abs(a - b) < 1e-9 ? 0.5 : a / (a - b));
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = v[j * (N + 1) + i], b = v[j * (N + 1) + i + 1], c = v[(j + 1) * (N + 1) + i + 1], e = v[(j + 1) * (N + 1) + i];
      const k = (a > 0 ? 1 : 0) | (b > 0 ? 2 : 0) | (c > 0 ? 4 : 0) | (e > 0 ? 8 : 0);
      if (k === 0 || k === 15) continue;
      // edge points: top (a-b), right (b-c), bottom (e-c), left (a-e)
      const T = () => P(i + lerp(a, b), j), R = () => P(i + 1, j + lerp(b, c)), B = () => P(i + lerp(e, c), j + 1), L = () => P(i, j + lerp(a, e));
      const seg = (p, q) => { d += `M${p}L${q}`; };
      switch (k) {
        case 1: case 14: seg(L(), T()); break;
        case 2: case 13: seg(T(), R()); break;
        case 3: case 12: seg(L(), R()); break;
        case 4: case 11: seg(R(), B()); break;
        case 6: case 9: seg(T(), B()); break;
        case 7: case 8: seg(L(), B()); break;
        case 5: seg(L(), T()); seg(R(), B()); break;
        case 10: seg(T(), R()); seg(L(), B()); break;
        default: break;
      }
    }
  }
  return d;
}

export function createResonance(ctx, L, parent) {
  const K = L.K;
  const wrap = el('div', 't0-res', null, parent, { attrs: { 'aria-hidden': 'false' } });
  wrap.hidden = true;
  const pl = svg('svg', { class: 't0-res__svg', 'aria-hidden': 'true' }, wrap);
  const frame = svg('rect', { class: 't0-res__frame' }, pl);
  const deco = svg('g', null, pl);
  const sand = svg('path', { class: 't0-res__sand' }, pl);
  const fig = svg('path', { class: 't0-res__fig' }, pl);
  const modeL = el('p', 't-micro t0-res__mode', null, wrap);
  const ro = block(wrap, 't0-res__ro');
  el('p', 't-label', 'РЕЗОНАНС', ro);
  const pctEl = el('p', 't-data t0-res__pct', '00%', ro);
  const cap = el('div', 't0-res__cap', null, wrap);
  const capT = el('p', 't-heading', null, cap, { qa: 'res-caption' });
  const capL = el('p', 't-label', 'РЕЗОНАНС 100%', cap);
  const R = { active: false, t0: 0, step: -1, subj: false, frameId: 0, voice: null, box: null, mode: null };

  function geom() {
    const size = layout.isPhone ? 0.88 * layout.w : Math.min(0.70 * layout.h, 0.6 * layout.w);
    const x0 = K.cx - size / 2, y0 = K.cy - size / 2;
    return { size, x0, y0 };
  }
  function layoutPlate() {
    const g = geom();
    R.box = g;
    frame.setAttribute('x', fmt(g.x0)); frame.setAttribute('y', fmt(g.y0));
    frame.setAttribute('width', fmt(g.size)); frame.setAttribute('height', fmt(g.size));
    while (deco.firstChild) deco.removeChild(deco.firstChild);
    [[g.x0, g.y0], [g.x0 + g.size, g.y0], [g.x0, g.y0 + g.size], [g.x0 + g.size, g.y0 + g.size]].forEach(([x, y]) => svgCross(deco, x, y));
    dimLine(deco, g.x0, g.y0 - 18, g.x0 + g.size, g.y0 - 18, '↔ 1.20 М');
    dimLine(deco, g.x0 + g.size + 18, g.y0, g.x0 + g.size + 18, g.y0 + g.size, '↕ 1.20 М');
    modeL.style.transform = `translate(${fmt(g.x0 + 8)}px,${fmt(g.y0 + 8)}px)`;
    ro.style.transform = `translate(${fmt(Math.max(16, g.x0 - (layout.isPhone ? 0 : 230)))}px,${fmt(layout.isPhone ? g.y0 - 120 : g.y0 + 16)}px)`;
    cap.style.transform = `translate(-50%,${fmt(g.y0 + g.size + 24)}px)`;
  }
  function setMode(k) {
    const [n, m] = MODES[k];
    const g = R.box;
    modeL.textContent = `ПЛАСТИНА · МОДА ${n} / ${m}`;
    sand.setAttribute('d', nodalPath(n, m, g.x0, g.y0, g.size));
    sand.classList.remove('is-in'); (void sand.offsetWidth, sand.classList.add('is-in'));
    if (ctx.audio) { ctx.audio.play('chunk', {}); if (R.voice && R.voice.set) R.voice.set({ k }); }
    if (layout.isPhone) vibrate(VIBE.step);
    if (ctx.edges && ctx.edges.twitch) ctx.edges.twitch();
  }
  function subject() {
    R.subj = true;
    const guests = ctx.host && ctx.host.guests && ctx.host.guests.active ? ctx.host.guests.list() : [];
    const s = nextSubject({ guests });
    const g = R.box;
    const gs = g.size * 0.62;
    fig.setAttribute('d', glyphPath(s.glyph || [], g.x0 + (g.size - gs) / 2, g.y0 + (g.size - gs) / 2, gs));
    sand.classList.add('is-gone');
    fig.classList.remove('is-cool');
    fig.classList.add('is-in');
    after(60, () => fig.classList.add('is-cool'));
    frame.classList.add('is-ember');
    after(1500, () => frame.classList.remove('is-ember'));
    capT.className = s.captionClass === 't-body' ? 't-body' : 't-heading';
    capT.textContent = s.caption;
    cap.classList.add('is-in');
    R.mode = s.glyph && !s.text ? 'glyph' : 'text';
    if (ctx.audio) ctx.audio.play('resChord', { hz: [392.0, 493.88, 587.33, 783.99] });
    if (ctx.secrets) ctx.secrets.discover('S01', { anchor: { x: K.cx, y: K.cy } });
  }
  function frameFn() {
    if (!R.active) return;
    const t = performance.now() - R.t0;
    const pct = Math.min(100, Math.round((100 * t) / 6000));
    app.resonancePct = pct;
    pctEl.textContent = `${String(pct).padStart(2, '0')}%`;
    let k = -1;
    for (let i = 0; i < STEPS.length; i++) if (t >= STEPS[i]) k = i;
    if (k !== R.step && k >= 0 && !R.subj) { R.step = k; setMode(k); }   // a late frame shows the mode it is in
    if (t >= 6000 && !R.subj) subject();
  }

  /** Starts at the hold (t measured from the pointerdown, perf ms). */
  R.start = (downAt) => {
    if (R.active) return;
    R.active = true; R.t0 = downAt; R.step = -1; R.subj = false; R.mode = null;
    layoutPlate();
    sand.setAttribute('d', ''); fig.setAttribute('d', '');
    sand.classList.remove('is-gone', 'is-fall'); fig.classList.remove('is-in', 'is-cool', 'is-fall');
    cap.classList.remove('is-in');
    modeL.textContent = 'ПЛАСТИНА';
    wrap.hidden = false;
    (void wrap.offsetWidth, wrap.classList.add('is-in'));
    L.wrap.classList.add('is-recede');
    if (app.phase === 'idle') setPhase('resonance');
    if (ctx.audio) { R.voice = ctx.audio.start('resRise', { k: 0 }); }
    R.frameId = loop.add(frameFn, ORDER.UI);
  };
  /** Release (any time): the sand falls and fades, the readout counts down, the Key returns. */
  R.release = () => {
    if (!R.active) return;
    frameFn();   // a lagging page may release before the frame that would have reached the next mode / the name
    R.active = false;
    if (R.frameId) { loop.remove(R.frameId); R.frameId = 0; }
    if (R.voice && R.voice.stop) { try { R.voice.stop(200); } catch (e) { /* voice */ } }
    R.voice = null;
    if (ctx.audio) ctx.audio.play('hiss', {});
    sand.classList.add('is-fall'); fig.classList.add('is-fall');
    const from = app.resonancePct;
    tween(reduced() ? 0 : 300, (u) => { const v = Math.round(from * (1 - u)); app.resonancePct = v; pctEl.textContent = `${String(v).padStart(2, '0')}%`; });
    after(reduced() ? 160 : 700, () => {
      wrap.classList.remove('is-in');
      L.wrap.classList.remove('is-recede');
      after(240, () => { if (!R.active) wrap.hidden = true; });
    });
    if (app.phase === 'resonance') setPhase('idle');
  };
  return R;
}
