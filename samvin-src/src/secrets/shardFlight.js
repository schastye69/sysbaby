// secrets/shardFlight.js — the visible collection (SPEC §8.2; ARCH §3.14.2; SPEC-ADDENDUM A6.5.4, A1.2 R23). OWNER: WP10.
//
// flyShard(id, from, to): a 12 px electrum TETRA (a real tetrahedron, turning as it flies, drawn as hairline edges over a
// faint face fill) leaves the event's screen anchor and flies 900 ms along a quadratic Bézier whose control point sits
// 30 % of the chord above the midpoint, into the navigator (N's next empty slot, or the I letter — the caller passes the
// point). The promise resolves on the landing frame (WP0's secrets.js then fills the slot, plays the G6 bell, vibrates,
// re-locks НАЙДЕНО and speaks). After landing the shard settles into the slot (120 ms) and its electrum cools to --silver
// by 2,500 ms from launch, then it is gone (the slot dot stays). At launch the bell's own reversed reverb is planned on
// the cue clock so that it ENDS exactly on the landing frame (A6.5.4: reverseTail 'vin', 400 ms, rate G6/D5, −16 dB).
// Reduced motion: no travel — the shard fades in (160 ms) already at the slot, lands at the same 900 ms, cools.
//
// flyMote(from, to, opts) (H28e, X§2.8.4): a round mote of `sizePx` in --ember | --white | --silver along the same curve
// over `ms` (ПОТЕРЯШКА's flight home, WP13). Resolves on arrival; the mote fades out 160 ms later.
// Both work identically in T0 (they are DOM, in #fx) and never throw.
import { tween, after } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { TIMING } from '../core/tokens.js';
import { W, fxRoot, clamp01, easeInOut, reduced, safe } from './util.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const TETRA_PX = 12;
const G6 = 1567.98, D5 = 587.33;

// Regular tetrahedron, circumradius 1.
const TV = [[0, 1, 0], [0.9428, -0.3333, 0], [-0.4714, -0.3333, 0.8165], [-0.4714, -0.3333, -0.8165]];
const EDGES = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
const P = new Float32Array(8);   // projected xy of the 4 vertices

/** Projects the turning tetra (angles a, b) at radius r into P. */
function project(a, b, r) {
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  for (let i = 0; i < 4; i++) {
    const v = TV[i];
    const x1 = v[0] * ca + v[2] * sa, z1 = -v[0] * sa + v[2] * ca;   // yaw
    const y2 = v[1] * cb - z1 * sb;                                   // pitch
    P[i * 2] = x1 * r; P[i * 2 + 1] = -y2 * r;
  }
}

/** Convex hull path of the 4 projected points (gift wrap, ≤ 4 points). */
function hullPath() {
  let start = 0;
  for (let i = 1; i < 4; i++) if (P[i * 2] < P[start * 2]) start = i;
  let d = '', p = start, guard = 0;
  do {
    d += (d ? 'L' : 'M') + P[p * 2].toFixed(2) + ' ' + P[p * 2 + 1].toFixed(2);
    let q = (p + 1) % 4;
    for (let i = 0; i < 4; i++) {
      const cr = (P[q * 2] - P[p * 2]) * (P[i * 2 + 1] - P[p * 2 + 1]) - (P[q * 2 + 1] - P[p * 2 + 1]) * (P[i * 2] - P[p * 2]);
      if (cr < 0) q = i;
    }
    p = q;
  } while (p !== start && ++guard < 5);
  return d + 'Z';
}
function edgePath() {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const a = EDGES[k][0], b = EDGES[k][1];
    d += 'M' + P[a * 2].toFixed(2) + ' ' + P[a * 2 + 1].toFixed(2) + 'L' + P[b * 2].toFixed(2) + ' ' + P[b * 2 + 1].toFixed(2);
  }
  return d;
}

/** Quadratic Bézier with the control 30 % of the chord above the midpoint. Writes out {x,y}. */
function bez(from, to, t, out) {
  const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const cx = mx, cy = my - 0.3 * len;
  const u = 1 - t;
  out.x = u * u * from.x + 2 * u * t * cx + t * t * to.x;
  out.y = u * u * from.y + 2 * u * t * cy + t * t * to.y;
  return out;
}

const pt = (p, fb) => (p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: p.x, y: p.y } : fb);
const centre = () => ({ x: innerWidth / 2, y: innerHeight / 2 });
const mixCol = (e01) => `color-mix(in srgb, var(--electrum) ${(clamp01(e01) * 100).toFixed(1)}%, var(--silver))`;

/** The reversed reverb of the G6 bell, ending exactly on the landing frame (planned on the cue clock). */
function planTail(landPerf) {
  const fx = W.ctx && W.ctx.fx;
  if (!fx || !fx.cue || typeof fx.cue.at !== 'function') return;
  safe('shardTail', () => fx.cue.at(landPerf - 400, {
    id: 'shardTail',
    audio: (T) => audio.play('reverseTail', { src: 'vin', endAt: T + 0.4, ms: 400, rate: G6 / D5, gainDb: -16 }),
  }));
}

/** → Promise<void> (resolves on the landing frame) */
export function flyShard(id, from, to) {
  void id;
  const root = fxRoot();
  const a = pt(from, centre()), b = pt(to, centre());
  const ms = TIMING.shardFlight;                          // 900
  planTail(performance.now() + ms);
  if (!root) return new Promise((res) => after(ms, res));
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'sec-shard');
  svg.setAttribute('width', '24'); svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '-12 -12 24 24');
  const face = document.createElementNS(SVGNS, 'path'); face.setAttribute('class', 'sec-shard-face');
  const edge = document.createElementNS(SVGNS, 'path'); edge.setAttribute('class', 'sec-shard-edge');
  svg.append(face, edge);
  root.appendChild(svg);
  const rm = reduced();
  const p = { x: 0, y: 0 };
  const draw = (x, y, rot, scale, e01, op) => {
    project(rot * 2.3, 0.6 + rot * 1.1, (TETRA_PX / 2) * scale);
    face.setAttribute('d', hullPath());
    edge.setAttribute('d', edgePath());
    svg.style.transform = `translate3d(${(x - 12).toFixed(1)}px,${(y - 12).toFixed(1)}px,0)`;
    svg.style.color = mixCol(e01);
    svg.style.opacity = String(op);
  };
  return new Promise((resolve) => {
    let landed = false;
    const land = () => { if (!landed) { landed = true; resolve(); } };
    // 0–900: flight (or, reduced, a fade-in at the slot); 900–1,020 settle; electrum → silver by 2,500; gone by 2,740.
    tween(2740, (u) => {
      const t = u * 2740;
      if (t < ms) {
        const k = t / ms;
        if (rm) draw(b.x, b.y, 0.4, 1, 1, clamp01(t / 160));
        else { bez(a, b, easeInOut(k), p); draw(p.x, p.y, k * 3.2, 1, 1, clamp01(t / 60)); }
        return;
      }
      land();
      const s = t < ms + 120 ? 1 - 0.7 * ((t - ms) / 120) : 0.3;
      const cool = 1 - clamp01((t - ms) / (2500 - ms));
      draw(b.x, b.y, rm ? 0.4 : 3.2 + (t - ms) / 2400, s, cool, t > 2500 ? 1 - (t - 2500) / 240 : 1);
    }).done.then(() => { land(); if (svg.parentNode) svg.parentNode.removeChild(svg); });
  });
}

/** H28e (X§2.8.4): → Promise<void> (resolves on arrival) */
export function flyMote(from, to, opts = { colour: 'ember', ms: 900, sizePx: 3 }) {
  const o = opts || {};
  const ms = o.ms > 0 ? o.ms : 900;
  const size = o.sizePx > 0 ? o.sizePx : 3;
  const colour = o.colour === 'white' || o.colour === 'silver' ? o.colour : 'ember';
  const root = fxRoot();
  const a = pt(from, centre()), b = pt(to, centre());
  if (!root) return new Promise((res) => after(ms, res));
  const el = document.createElement('i');
  el.className = 'sec-mote';
  el.style.width = el.style.height = `${size}px`;
  el.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
  el.style.background = `var(--${colour})`;
  root.appendChild(el);
  const rm = reduced();
  const p = { x: 0, y: 0 };
  return new Promise((resolve) => {
    tween(ms, (u) => {
      if (rm) { p.x = u < 0.5 ? a.x : b.x; p.y = u < 0.5 ? a.y : b.y; } else bez(a, b, easeInOut(u), p);
      el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0)`;
    }).done.then(() => {
      resolve();
      el.style.transition = 'opacity 160ms linear';
      el.style.opacity = '0';
      after(180, () => { if (el.parentNode) el.parentNode.removeChild(el); });
    });
  });
}
