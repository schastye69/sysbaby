// t0/lostView.js — WP11. The T0 LostView of ПОТЕРЯШКА and its pair day ДОГОВОРИЛИСЬ (ARCH-ADDENDUM X§2.6.4; SPEC-ADDENDUM
// A5.1, A11.4 T0): a 22 px SVG mini-Key (the seven strata in elevation, an ember nucleus point) at the seeded position in
// the hall section; on a pair day two mini-Keys back to back (0.8 m either side ≈ 30 px), the two threads as SVG lines
// drawn with stroke-dashoffset over the hold, an SVG hold ring (r 22 / phone 28 px) at the midpoint. Calm turns them
// (SVG transforms), hiding ducks them, the agreement ignites both (1 white frame), one straight white line fading
// 600 ms, and they glide together (600 ms). WP13 drives every rule, sound, status, deed and storage through these calls.
import { STRATA_GEOM, radiusAt } from '../core/tokens.js';
import { layout } from '../core/layout.js';
import { app } from '../core/store.js';
import { after, tween } from '../core/clock.js';
import { svg, fmt, reduced } from './dom.js';

const H = 22;                       // mini-Key height, CSS px
const K = H / 2.4;                  // px per metre
const PAIR_DX = 90;                 // px either side: the WebGL pair's on-screen spacing in a hall (0.8 m at ≈ 11.5 m ≈ 150–260 px apart)

function miniKey(parent, x, y, flip) {
  const g = svg('g', { class: 't0-mini', transform: `translate(${fmt(x)} ${fmt(y)})` }, parent);
  const body = svg('g', { class: 't0-mini__b' }, g);
  if (flip) body.setAttribute('transform', 'scale(-1 1)');
  let d = '';
  for (const s of STRATA_GEOM) {
    const ys = s.top > 0 && s.bot < 0 ? [s.top, 0, s.bot] : [s.top, s.bot];
    ys.forEach((yy, k) => { d += `${k ? 'L' : 'M'}${fmt(radiusAt(yy) * K * 0.866)} ${fmt(-yy * K)}`; });
    for (let k = ys.length - 1; k >= 0; k--) d += `L${fmt(-radiusAt(ys[k]) * K * 0.866)} ${fmt(-ys[k] * K)}`;
    d += 'Z';
  }
  svg('path', { d, class: 't0-mini__l' }, body);
  svg('path', { d: `M${fmt(-0.25 * K)} ${fmt(-0.6 * K)}L${fmt(0.25 * K)} ${fmt(-0.6 * K)}`, class: 't0-mini__face' }, body);
  const n = svg('circle', { cx: 0, cy: 0, r: 1, class: 't0-mini__n' }, g);
  return { g, body, n, x, y };
}

export function createLostView(ctx, T) {
  let host = null, A = null, B = null, ring = null, thrA = null, thrB = null, line = null, kind = 'one';
  const mid = { x: 0, y: 0 };
  const ringR = () => (layout.isPhone ? 28 : 22);

  function clearAll() { if (host && host.parentNode) host.parentNode.removeChild(host); host = A = B = ring = thrA = thrB = line = null; }

  const view = {
    /** spot: {x,y} as viewport fractions (≤ 1) or CSS px. */
    spawn(k, spot) {
      clearAll();
      kind = k === 'pair' ? 'pair' : 'one';
      const sec = T.section(app.room);
      host = svg('svg', { class: `t0-lost t0-lost--${kind}`, 'aria-hidden': 'true' }, sec);
      const w = layout.w || innerWidth, h = layout.h || innerHeight;
      const sx = spot && Number.isFinite(spot.x) ? spot.x : 0.5, sy = spot && Number.isFinite(spot.y) ? spot.y : 0.5;
      mid.x = sx <= 1 ? sx * w : sx; mid.y = sy <= 1 ? sy * h : sy;
      ring = svg('circle', { cx: mid.x, cy: mid.y, r: ringR(), class: 't0-lost__ring', pathLength: '1' }, host);
      if (kind === 'pair') {
        thrA = svg('path', { d: `M${fmt(mid.x - PAIR_DX)} ${fmt(mid.y)}L${fmt(mid.x)} ${fmt(mid.y)}`, class: 't0-lost__thr', pathLength: '1' }, host);
        thrB = svg('path', { d: `M${fmt(mid.x + PAIR_DX)} ${fmt(mid.y)}L${fmt(mid.x)} ${fmt(mid.y)}`, class: 't0-lost__thr', pathLength: '1' }, host);
        A = miniKey(host, mid.x - PAIR_DX, mid.y, false);
        B = miniKey(host, mid.x + PAIR_DX, mid.y, true);
        A.g.classList.add('is-turned'); B.g.classList.add('is-turned', 'is-late');
      } else A = miniKey(host, mid.x, mid.y, false);
      view.hold(0);
    },
    /** 'idle' (stutter) | 'calm' (turn toward him; pair: both 90°) | 'hid' (duck away) | 'turnBack' (drift back 1,600 ms) */
    pose(state, ms) {
      if (!host) return;
      host.style.setProperty('--pose-ms', `${Math.max(0, reduced() ? 160 : (ms || 240))}ms`);
      host.classList.remove('is-idle', 'is-calm', 'is-hid', 'is-back');
      host.classList.add(state === 'calm' ? 'is-calm' : state === 'hid' ? 'is-hid' : state === 'turnBack' ? 'is-back' : 'is-idle');
    },
    /** Hold ring fill; pair: the threads grow to the midpoint, the faces turn 90° → 0°. */
    hold(p01) {
      if (!host) return;
      const p = Math.max(0, Math.min(1, +p01 || 0));
      ring.style.strokeDashoffset = fmt(1 - p);
      ring.classList.toggle('is-on', p > 0);
      if (kind === 'pair') {
        const t = Math.min(1, p * 2);
        thrA.style.strokeDashoffset = fmt(1 - t); thrB.style.strokeDashoffset = fmt(1 - t);
        const s = 0.25 + 0.75 * p;
        A.body.setAttribute('transform', `scale(${fmt(s)} 1)`); B.body.setAttribute('transform', `scale(${fmt(-s)} 1)`);
      }
    },
    /** pair: ignite both (1 white frame), one straight white line fading 600 ms, glide together 600 ms. */
    agree() {
      if (!host || kind !== 'pair') return Promise.resolve();
      A.g.classList.add('is-white'); B.g.classList.add('is-white');
      requestAnimationFrame(() => requestAnimationFrame(() => { if (A) A.g.classList.remove('is-white'); if (B) B.g.classList.remove('is-white'); }));
      line = svg('path', { d: `M${fmt(mid.x - PAIR_DX)} ${fmt(mid.y)}L${fmt(mid.x + PAIR_DX)} ${fmt(mid.y)}`, class: 't0-lost__line' }, host);
      after(30, () => { if (line) line.classList.add('is-out'); });
      thrA.style.opacity = '0'; thrB.style.opacity = '0';
      const a0 = A.x, b0 = B.x;
      return tween(reduced() ? 0 : 600, (u) => {
        if (!A || !B) return;
        A.g.setAttribute('transform', `translate(${fmt(a0 + (mid.x - 3 - a0) * u)} ${fmt(mid.y)})`);
        B.g.setAttribute('transform', `translate(${fmt(b0 + (mid.x + 3 - b0) * u)} ${fmt(mid.y)})`);
      }, (u) => u * u * (3 - 2 * u)).done;
    },
    /** screen points of the mini-Key(s) (A, then B on a pair day) */
    keyPoints() { return !host ? [] : kind === 'pair' ? [{ x: A.x, y: A.y }, { x: B.x, y: B.y }] : [{ x: A.x, y: A.y }]; },
    /** screen points for the flight to the navigator • (one point, or two 6 px apart) */
    homePoints() { return kind === 'pair' ? [{ x: mid.x - 3, y: mid.y }, { x: mid.x + 3, y: mid.y }] : [{ x: mid.x, y: mid.y }]; },
    dispose() { clearAll(); },
  };
  return view;
}
