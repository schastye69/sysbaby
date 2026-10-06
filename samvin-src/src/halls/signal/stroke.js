// halls/signal/stroke.js — WP8 SEED, functionally correct (ARCH §3.19, §6.1.5; SPEC §6.5 sky pad).
//   processStroke: 8 px resample → Chaikin ×2 → RDP ε 1.5 → auto-close (ends ≤ 12 px apart) → ≤ 256 points.
//   normalizeStroke: ≤ 64 points in [−1, 1], aspect kept (centred on the bounding box, scaled by the larger half-extent).
//   playStroke: the 'skyVoice' live voice, x → 220–880 Hz (log), y → pan, over `ms`; → { stop() }.
//   saveDrawing: the last 7 in state.drawings; 'drawing:saved' {index, count}; status 'drawing.saved'.
import { state } from '../../core/state.js';
import { bus } from '../../core/bus.js';
import { audio } from '../../audio/engine.js';
import { status } from '../../ui/status.js';
import { tween } from '../../core/clock.js';

function resample(pts, step) {
  if (pts.length < 2) return pts.map((p) => ({ x: p.x, y: p.y }));
  const out = [{ x: pts[0].x, y: pts[0].y }];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    let ax = pts[i - 1].x, ay = pts[i - 1].y;
    const bx = pts[i].x, by = pts[i].y;
    let d = Math.hypot(bx - ax, by - ay);
    while (acc + d >= step && d > 0) {
      const t = (step - acc) / d;
      ax += (bx - ax) * t; ay += (by - ay) * t;
      out.push({ x: ax, y: ay });
      d = Math.hypot(bx - ax, by - ay);
      acc = 0;
    }
    acc += d;
  }
  const last = pts[pts.length - 1], tail = out[out.length - 1];
  if (tail.x !== last.x || tail.y !== last.y) out.push({ x: last.x, y: last.y });
  return out;
}
function chaikin(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    out.push({ x: 0.75 * a.x + 0.25 * b.x, y: 0.75 * a.y + 0.25 * b.y }, { x: 0.25 * a.x + 0.75 * b.x, y: 0.25 * a.y + 0.75 * b.y });
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const A = pts[s], B = pts[e];
    const L = Math.hypot(B.x - A.x, B.y - A.y);
    let best = -1, bd = 0;
    for (let i = s + 1; i < e; i++) {
      const P = pts[i];
      const d = L > 0 ? Math.abs((B.x - A.x) * (A.y - P.y) - (A.x - P.x) * (B.y - A.y)) / L : Math.hypot(P.x - A.x, P.y - A.y);
      if (d > bd) { bd = d; best = i; }
    }
    if (best > 0 && bd > eps) { keep[best] = 1; stack.push([s, best], [best, e]); }
  }
  return pts.filter((p, i) => keep[i]);
}
function cap(pts, n) {
  if (pts.length <= n) return pts;
  const out = [];
  for (let k = 0; k < n; k++) out.push(pts[Math.round((k * (pts.length - 1)) / (n - 1))]);
  return out;
}

/** [{x,y}] CSS px → [{x,y}] */
export function processStroke(points) {
  const src = (points || []).filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y));
  if (src.length < 2) return src.map((p) => ({ x: p.x, y: p.y }));
  let p = rdp(chaikin(chaikin(resample(src, 8))), 1.5);
  const a = p[0], b = p[p.length - 1];
  if (p.length > 2 && Math.hypot(b.x - a.x, b.y - a.y) <= 12) p = p.slice(0, -1).concat([{ x: a.x, y: a.y }]);
  return cap(p, 256);
}

/** → number[][] ≤ 64 points in [−1, 1], aspect kept. */
export function normalizeStroke(points) {
  const p = cap((points || []).filter((q) => q && Number.isFinite(q.x) && Number.isFinite(q.y)), 64);
  if (!p.length) return [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const q of p) { x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y); }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, h = Math.max(x1 - x0, y1 - y0) / 2 || 1;
  const r = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 1000) / 1000;
  return p.map((q) => [r((q.x - cx) / h), r((q.y - cy) / h)]);
}

/** → { stop() } — plays the drawing on 'skyVoice': x → 220–880 Hz (log), y → pan, over ms. */
export function playStroke(norm, ms = 1200) {
  const pts = Array.isArray(norm) ? norm : [];
  const voice = audio.start('skyVoice', { freq: 220, pan: 0 });
  const params = { freq: 220, pan: 0 };
  if (!pts.length) { voice.stop(); return { stop() {} }; }
  const tw = tween(Math.max(1, ms), (u) => {
    const f = u * (pts.length - 1), i = Math.floor(f), t = f - i;
    const a = pts[i], b = pts[Math.min(pts.length - 1, i + 1)];
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
    params.freq = 220 * Math.pow(4, (x + 1) / 2);
    params.pan = Math.max(-1, Math.min(1, -y));
    voice.set(params);
  });
  let stopped = false;
  const stop = () => { if (stopped) return; stopped = true; tw.cancel(); voice.stop(); };
  tw.done.then(stop);
  return { stop };
}

/** Keeps the last 7 drawings; 'drawing:saved' {index, count}; status 'drawing.saved'. */
export function saveDrawing(norm) {
  const d = (Array.isArray(norm) ? norm : []).slice(0, 64).map((q) => [q[0], q[1]]);
  if (d.length < 2) return;
  state.patch((data) => {
    const list = Array.isArray(data.drawings) ? data.drawings : [];
    list.push(d);
    while (list.length > 7) list.shift();
    data.drawings = list;
  });
  const count = state.data.drawings.length;
  bus.emit('drawing:saved', { index: count - 1, count });
  status.say('drawing.saved');
}
