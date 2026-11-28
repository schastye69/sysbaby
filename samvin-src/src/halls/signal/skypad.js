// halls/signal/skypad.js — WP8: «НЕБО», the sky pad (SPEC §6.5 part 2; §7.4 «Голос» trace; A6.4 reply capture).
//
// The apex disc on screen is the drawing surface: a circle 46vh (phone 80vw) centred on the projected apex, a 1 px
// --slate outline broken at the top for MICRO `НЕБО`, four survey ticks. Pressing inside starts a beam stroke, 2 px
// --white with a 300 ms phosphor decay to --ember (one CSS animation per segment, no per-frame JS). Release runs the
// SPEC pipeline (stroke.js: 8 px resample, Chaikin ×2, RDP 1.5, auto-close 12 px, ≤ 256 pts), then
//   (a) it sounds — 1,200 ms: a white beam dot retraces the figure while x drives pitch and y drives pan (playStroke's
//       onFrame is the dot, so the twin runs with sound off),
//   (b) it transmits — 800 ms: the figure shrinks and rises through the apex into its star (a four-ray glint lights
//       where it lands, and its remembered star flares),
//   (c) it is remembered — saveDrawing (the last 7, ≤ 64 points in [−1, 1]) and status «запомнил.», said as the
//       figure leaves (the start of b) so the word and the flight read as one gesture.
// After 6,000 ms of idle a ghost stroke (silver 30 %) draws a small five-point star in the pad and fades (once per idle
// stretch, until he has drawn). The «Голос» arrival trace is drawn here too: a straight luminous line on the pad's lower
// tangent that curls, at constant length, into the pad's outline.
// QA hook: [data-qa="pad"] (an invisible box over the circle) with data-cx, data-cy, data-r (CSS px).
import { processStroke, normalizeStroke, playStroke, saveDrawing } from './stroke.js';
import { EASE, clamp01, smoothstep } from '../../core/ease.js';
import { ENV } from '../../core/env.js';

const NS = 'http://www.w3.org/2000/svg';
const TRACE_N = 120;
const GAP = 0.20;                     // radians of outline left open round the `НЕБО` label (top)
function svg(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const f1 = (v) => v.toFixed(1);

/** @returns the pad: { art, box, layout(geo, w, h), hit(x, y), begin(x, y), add(x, y), end(), abort(), busy, setReply(i),
 *  replyIndex, setGolos(u), setAlpha(a), idle(tMs), touch(tMs), update(tMs, reduced), arrive(), depart(), dispose() } */
export function createSkyPad(hctx, host, hooks) {
  // The «Голос» trace spans the full width (2πR), so it has its own viewport-sized SVG that exists on screen only
  // while the build runs; the pad's SVG covers just the disc (+ 24 px), so a stroke repaints a small layer.
  const traceArt = svg('svg', { class: 'sg-trace-art', 'aria-hidden': 'true' });
  host.appendChild(traceArt);
  const trace = svg('path', { class: 'sg-trace' }, traceArt);
  const art = svg('svg', { class: 'sg-pad-art', 'aria-hidden': 'true' });
  host.appendChild(art);
  const ring = svg('path', { class: 'sg-pad__ring' }, art);
  const marks = svg('path', { class: 'sg-pad__marks' }, art);
  const ghost = svg('path', { class: 'sg-ghost', pathLength: 1 }, art);
  const ink = svg('g', { class: 'sg-ink' }, art);
  const figG = svg('g', { class: 'sg-fig' }, art);
  const fig = svg('path', { class: 'sg-fig__path' }, figG);
  const beam = svg('rect', { class: 'sg-beam', width: 4, height: 4 }, art);
  const glint = svg('path', { class: 'sg-glint' }, art);           // the new star's four-ray glint where the figure lands
  const box = document.createElement('div');
  box.className = 'sg-pad';
  box.dataset.qa = 'pad';
  host.appendChild(box);
  const label = document.createElement('span');
  label.className = 't-micro sg-pad__label';
  label.textContent = 'НЕБО';
  host.appendChild(label);

  const st = {
    cx: 0, cy: 0, r: 100, w: 1, h: 1, raw: [], drawing: false, lastX: 0, lastY: 0, seq: null, reply: -1,
    idleFrom: 0, ghostT: -1, drawnThisVisit: false, alpha: 1, golos: 1,
  };

  function ringPath(cx, cy, r) {
    // Clockwise from just right of the top gap round to just left of it.
    const a0 = -Math.PI / 2 + GAP, a1 = -Math.PI / 2 - GAP + 2 * Math.PI;
    const x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r, x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
    return `M${f1(x0)} ${f1(y0)}A${f1(r)} ${f1(r)} 0 1 1 ${f1(x1)} ${f1(y1)}`;
  }
  function layout(geo, w, h) {
    st.cx = geo.cx; st.cy = geo.cy; st.r = geo.padR; st.w = w; st.h = h;
    traceArt.setAttribute('viewBox', `0 0 ${w} ${h}`);
    traceArt.setAttribute('width', String(w)); traceArt.setAttribute('height', String(h));
    const M = 24, bx = Math.floor(geo.cx - geo.padR - M), by = Math.floor(geo.cy - geo.padR - M), bs = Math.ceil(2 * (geo.padR + M));
    art.setAttribute('viewBox', `${bx} ${by} ${bs} ${bs}`);
    art.setAttribute('width', String(bs)); art.setAttribute('height', String(bs));
    art.style.left = `${bx}px`; art.style.top = `${by}px`;
    ring.setAttribute('d', ringPath(st.cx, st.cy, st.r));
    // Survey ticks at 3, 6 and 9 o'clock (6 px, outward) — the drawing's register marks.
    const t = 6, R = st.r;
    marks.setAttribute('d', `M${f1(st.cx + R)} ${f1(st.cy)}h${t}M${f1(st.cx - R)} ${f1(st.cy)}h${-t}M${f1(st.cx)} ${f1(st.cy + R)}v${t}`);
    box.style.transform = `translate(${f1(st.cx - R)}px,${f1(st.cy - R)}px)`;
    box.style.width = box.style.height = `${f1(2 * R)}px`;
    box.dataset.cx = f1(st.cx); box.dataset.cy = f1(st.cy); box.dataset.r = f1(R);
    label.style.transform = `translate(${f1(st.cx)}px,${f1(st.cy - R)}px) translate(-50%,-50%)`;
    ghost.setAttribute('d', ghostStar());
  }
  function ghostStar() {
    // A small five-point star (one continuous pentagram) in the pad's lower-left, ~22 % of the radius.
    const gx = st.cx - st.r * 0.34, gy = st.cy + st.r * 0.30, gr = st.r * 0.22;
    let d = '';
    for (let k = 0; k <= 5; k++) {
      const a = -Math.PI / 2 + (k * 4 * Math.PI) / 5;
      d += (k ? 'L' : 'M') + f1(gx + Math.cos(a) * gr) + ' ' + f1(gy + Math.sin(a) * gr);
    }
    return d;
  }

  // ── drawing ──────────────────────────────────────────────────────────────────────────────────────────────
  function hit(x, y) { return Math.hypot(x - st.cx, y - st.cy) <= st.r; }
  function seg(x0, y0, x1, y1) {
    const l = svg('line', { x1: f1(x0), y1: f1(y0), x2: f1(x1), y2: f1(y1), class: ENV.reducedMotion ? 'sg-hot is-cold' : 'sg-hot' }, ink);
    return l;
  }
  function begin(x, y) {
    finishSeq(true);                                   // a new stroke completes the previous one at once
    st.raw.length = 0;
    st.raw.push({ x, y });
    st.drawing = true; st.lastX = st.px = x; st.lastY = st.py = y;
    st.drawnThisVisit = true;
    ink.textContent = '';
    hideGhost();
    if (hctx.audio) hctx.audio.play('select', {});
  }
  function add(x, y) {
    if (!st.drawing) return;
    // Clamp to the disc so the beam never leaves the sky.
    const dx = x - st.cx, dy = y - st.cy, d = Math.hypot(dx, dy);
    if (d > st.r) { x = st.cx + (dx / d) * st.r; y = st.cy + (dy / d) * st.r; }
    st.px = x; st.py = y;
    if (Math.hypot(x - st.lastX, y - st.lastY) < 4) return;          // the drawn trace: one segment per ≥ 4 px
    seg(st.lastX, st.lastY, x, y);
    st.raw.push({ x, y });
    st.lastX = x; st.lastY = y;
  }
  function abort() { st.drawing = false; st.raw.length = 0; ink.textContent = ''; }
  function end() {
    if (!st.drawing) return;
    st.drawing = false;
    if (st.raw.length && (st.px !== st.lastX || st.py !== st.lastY)) st.raw.push({ x: st.px, y: st.py });
    const pts = processStroke(st.raw);
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (pts.length < 3 || len < 24) { ink.textContent = ''; return; }   // a tap or a scratch is not a drawing
    const norm = normalizeStroke(pts);
    // The settled figure: the processed (smoothed, closed) stroke in ember.
    let d = '';
    for (let i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + f1(pts[i].x) + ' ' + f1(pts[i].y);
    fig.setAttribute('d', d);
    figG.removeAttribute('transform');
    figG.style.opacity = '1';
    figG.classList.add('is-on');
    ink.textContent = '';
    // Bounding box (for mapping the normalised beam back to the screen and for the rise).
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
    const bc = { x: (x0 + x1) / 2, y: (y0 + y1) / 2, h: Math.max(x1 - x0, y1 - y0) / 2 || 1 };
    const reply = st.reply;
    st.reply = -1;
    host.classList.remove('is-reply');
    runSeq(norm, bc, reply);
  }

  // ── release sequence: (a) sound 1,200 ms → (b) rise 800 ms → (c) remembered ──────────────────────────────
  function runSeq(norm, bc, reply) {
    const seq = { norm, bc, reply, phase: 'a', t0: hctx.loop.now, play: null, target: null, done: false, saved: false };
    st.seq = seq;
    beam.style.opacity = '1';
    seq.play = playStroke(norm, 1200, {
      onFrame: (x, y) => {
        beam.setAttribute('x', f1(bc.x + x * bc.h - 2)); beam.setAttribute('y', f1(bc.y + y * bc.h - 2));
      },
    });
    seq.play.done.then(() => { if (st.seq === seq && seq.phase === 'a') startRise(seq); });
  }
  function startRise(seq) {
    seq.phase = 'b'; seq.t0 = hctx.loop.now;
    beam.style.opacity = '0';
    seq.target = hooks.starTarget();                   // {x, y} where the new star will shine
    // (c) It is remembered as it leaves: saved + «запомнил.» now, the star lights when the figure arrives.
    seq.saved = true;
    hooks.remembered(seq.norm, seq.reply);
  }
  function finishSeq(instant) {
    const seq = st.seq;
    if (!seq || seq.done) return;
    seq.done = true;
    if (seq.play) seq.play.stop();
    st.seq = null;
    beam.style.opacity = '0';
    figG.classList.remove('is-on');
    figG.style.opacity = '0';
    if (!instant && seq.target) {
      const x = seq.target.x, y = seq.target.y;
      glint.setAttribute('d', `M${f1(x - 9)} ${f1(y)}H${f1(x + 9)}M${f1(x)} ${f1(y - 9)}V${f1(y + 9)}M${f1(x - 3)} ${f1(y - 3)}L${f1(x + 3)} ${f1(y + 3)}M${f1(x + 3)} ${f1(y - 3)}L${f1(x - 3)} ${f1(y + 3)}`);
      glint.classList.remove('is-on'); void glint.getBoundingClientRect(); glint.classList.add('is-on');
    }
    if (!seq.saved) hooks.remembered(seq.norm, seq.reply);
    hooks.landed(instant);
  }
  function stepSeq(tMs, reduced) {
    const seq = st.seq;
    if (!seq || seq.phase !== 'b') return;
    const u = clamp01((tMs - seq.t0) / 800);
    const tgx = seq.target ? seq.target.x : st.cx, tgy = seq.target ? seq.target.y : st.cy;
    if (reduced) {
      figG.style.opacity = String(1 - smoothstep(0, 0.2, u));
    } else {
      const e = EASE.camera(u);
      const s = 1 - 0.985 * e;                          // shrinks to a point
      // Rises: the centre travels up into the apex, then on to the star (a slight arc, never a straight slide).
      const lift = Math.sin(Math.PI * u) * st.r * 0.10;
      const tx = seq.bc.x + (tgx - seq.bc.x) * e, ty = seq.bc.y + (tgy - seq.bc.y) * e - lift;
      figG.setAttribute('transform', `translate(${f1(tx)} ${f1(ty)}) scale(${s.toFixed(4)}) translate(${f1(-seq.bc.x)} ${f1(-seq.bc.y)})`);
      figG.style.opacity = String(1 - smoothstep(0.82, 1, u));
    }
    if (u >= 1) finishSeq(false);
  }

  // ── ghost star ───────────────────────────────────────────────────────────────────────────────────────────
  function hideGhost() { st.ghostT = -1; ghost.classList.remove('is-on'); }
  function stepGhost(tMs, reduced) {
    if (st.ghostT < 0) {
      if (!st.drawnThisVisit && !st.drawing && !st.seq && st.golos >= 1 && tMs - st.idleFrom >= 6000) {
        st.ghostT = tMs;
        ghost.classList.toggle('is-still', !!reduced);
        ghost.classList.add('is-on');
      }
      return;
    }
    if (tMs - st.ghostT > 2400) { ghost.classList.remove('is-on'); st.ghostT = -2; }   // once per idle stretch
  }

  // ── «Голос»: the luminous trace (pad lower tangent → the outline) ──────────────────────────────────────────
  function traceAt(k) {
    const R = st.r, L = 2 * Math.PI * R, bx = st.cx, by = st.cy + R;
    let d = '';
    for (let i = 0; i <= TRACE_N; i++) {
      const s = (i / TRACE_N - 0.5) * L;
      let x, y;
      if (k < 1e-4) { x = bx + s; y = by; } else {
        const kap = k / R, th = kap * s;
        x = bx + Math.sin(th) / kap; y = by - (1 - Math.cos(th)) / kap;
      }
      d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y);
    }
    return d;
  }
  /** u = the hall's arrival build 0..1 (pure in u). */
  function setGolos(u) {
    st.golos = u;
    traceArt.style.display = u >= 1 ? 'none' : '';
    if (u >= 1) {
      trace.style.opacity = '0';
      ring.style.opacity = ''; marks.style.opacity = ''; label.style.opacity = '';
      return;
    }
    const k = EASE.camera(clamp01((u - 0.15) / 0.5));
    trace.setAttribute('d', traceAt(k));
    trace.style.opacity = String(smoothstep(0, 0.10, u) * (1 - smoothstep(0.86, 1, u)));
    // White while straight; cools toward --slate as it closes into the outline.
    trace.style.setProperty('--cool', String(smoothstep(0.55, 0.95, u)));
    const o = smoothstep(0.86, 1, u);
    ring.style.opacity = String(o); marks.style.opacity = String(o); label.style.opacity = String(o);
  }

  return {
    art, box, label,
    layout, hit, begin, add, end, abort, setGolos,
    get busy() { return !!st.seq; },
    get drawing() { return st.drawing; },
    get replyIndex() { return st.reply; },
    /** ОТВЕТИТЬ РИСУНКОМ: the next stroke is also the reply to transmission i (−1 cancels). */
    setReply(i) {
      st.reply = i;
      host.classList.toggle('is-reply', i >= 0);
      if (i >= 0) { st.drawnThisVisit = true; hideGhost(); }
    },
    setAlpha(a) { st.alpha = a; art.style.opacity = String(a); label.style.opacity = st.golos >= 1 ? String(a) : label.style.opacity; },
    touch(tMs) { st.idleFrom = tMs; if (st.ghostT === -2) st.ghostT = -1; if (st.ghostT >= 0) hideGhost(); },
    update(tMs, reduced) { stepSeq(tMs, reduced); stepGhost(tMs, reduced); },
    arrive(tMs) { st.idleFrom = tMs; st.ghostT = -1; st.drawnThisVisit = false; setGolos(1); },
    depart() { finishSeq(true); abort(); hideGhost(); st.reply = -1; host.classList.remove('is-reply'); },
    dispose() {
      finishSeq(true);
      for (const n of [traceArt, art, box, label]) if (n.parentNode) n.parentNode.removeChild(n);
    },
  };
}
