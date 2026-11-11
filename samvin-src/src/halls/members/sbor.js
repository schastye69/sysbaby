// halls/members/sbor.js — СБОР on the columns (A3.2; ARCH-ADDENDUM X§2.6.3): the SborAdapter WP13 drives, and the
// effect ribbons it draws in the columns' existing fx batch (one draw call): the 1 px --silver call ring on the deck
// (64 segments), ≤ 6 bond threads (32 segments each: a 1 px --silver ribbon drawn by a moving 2 px --white head
// along a cubic arc rising 6 m above the capitals), and the 1 px «в пути» rings breathing on the world breath.
// WP5 owns every column effect; WP13 owns the timeline, the sounds, the readout and the data.
// Columns are addressed by k = the index in WORLD.members (X§2.6.3: "answer kind = WORLD.members[k].status").
import { Vector3 } from 'three';
import { breath } from '../../core/clock.js';
import { U } from '../../render/uniforms.js';
import { COL } from './shape.js';

const TAU = Math.PI * 2;
const RING_SEG = 64, THREAD_SEG = 32, BREATHE_SEG = 24, MAX_THREADS = 6;

/**
 * ctx: { columns, worldOrder: col[] (WORLD.members order → column), op: col, now(): ms, toRender(local, out),
 *        project(render) → {x, y}, layer, audio, reduced(): boolean }
 */
export function createSborFx(ctx) {
  const { columns } = ctx;
  const seg = columns.fxSeg, al = columns.fxAl, colr = columns.fxCol, wid = columns.fxW;
  const call = { on: false, r: 0, a: 0 };
  const threads = [];
  for (let i = 0; i < MAX_THREADS; i++) {
    threads.push({ on: false, c: null, t0: 0, ms: 480, rel0: 0, relMs: 0, A: new Vector3(), B: new Vector3() });
  }
  let ringFill = 0, ringFrom = 0, ringT0 = 0, ringUnwind = false;
  const _p = new Vector3(), _q = new Vector3(), _a = new Vector3(), _b = new Vector3();

  function bez(th, t, out) {
    // cubic Bézier A → B lifted by 8 m at both control points (apex ≈ 6 m above the capitals)
    const u = 1 - t, A = th.A, B = th.B;
    const w0 = u * u * u, w1 = 3 * u * u * t, w2 = 3 * u * t * t, w3 = t * t * t;
    out.set(
      w0 * A.x + w1 * A.x + w2 * B.x + w3 * B.x,
      w0 * A.y + w1 * (A.y + 8) + w2 * (B.y + 8) + w3 * B.y,
      w0 * A.z + w1 * A.z + w2 * B.z + w3 * B.z,
    );
    return out;
  }

  let n = 0;
  function push(ax, ay, az, bx, by, bz, a, white, w) {
    if (n >= columns.FX_CAP) return;
    const o = n * 6;
    seg[o] = ax; seg[o + 1] = ay; seg[o + 2] = az; seg[o + 3] = bx; seg[o + 4] = by; seg[o + 5] = bz;
    const c = white ? U.cWhite.value : U.cSilver.value;
    colr[3 * n] = c.r; colr[3 * n + 1] = c.g; colr[3 * n + 2] = c.b;
    al[n] = a; wid[n] = w;
    n++;
  }

  const fx = {
    /** the 2 px ember hold ring (screen space, layer) — fill 0 hides */
    ring(f) { ringUnwind = false; ringFill = Math.max(0, Math.min(1, f)); },
    /** released early: the ring unwinds over 240 ms (no deny sound) */
    unwind() { if (ringFill <= 0) return; ringUnwind = true; ringFrom = ringFill; ringT0 = ctx.now(); },
    get ringFill() { return ringFill; },
    callRing(r, a) { call.on = a > 0.001; call.r = r; call.a = a; },
    thread(c, ms) {
      let th = threads.find((x) => !x.on) || threads[0];
      th.on = true; th.c = c; th.t0 = ctx.now(); th.ms = Math.max(16, ms); th.rel0 = 0; th.relMs = 0;
      return { release(rms) { th.rel0 = ctx.now(); th.relMs = Math.max(16, rms || 600); } };
    },
    clearThreads() { for (const th of threads) th.on = false; },
    /** Per frame: rebuild the fx segments (hall-local). */
    update() {
      const now = ctx.now();
      n = 0;
      // hold ring (screen space)
      if (ringUnwind) {
        const u = Math.min(1, (now - ringT0) / 240);
        ringFill = ringFrom * (1 - u);
        if (u >= 1) { ringUnwind = false; ringFill = 0; }
      }
      // call ring on the deck around his base
      const op = ctx.op;
      if (call.on && op) {
        for (let k = 0; k < RING_SEG; k++) {
          const a0 = (TAU * k) / RING_SEG, a1 = (TAU * (k + 1)) / RING_SEG;
          push(op.x + Math.sin(a0) * call.r, 0.05, op.z + Math.cos(a0) * call.r, op.x + Math.sin(a1) * call.r, 0.05, op.z + Math.cos(a1) * call.r, call.a, false, 1);
        }
      }
      // threads: capital k → his capital
      for (let ti = 0; ti < threads.length; ti++) {
        const th = threads[ti];
        if (!th.on || !op) continue;
        columns.capitalPoint(th.c, th.A); columns.capitalPoint(op, th.B);
        const head = Math.min(1, (now - th.t0) / th.ms);
        let tail = 0;
        if (th.relMs > 0) {
          tail = Math.min(1, (now - th.rel0) / th.relMs);
          if (tail >= 1) { th.on = false; continue; }
        }
        const s0 = Math.floor(tail * THREAD_SEG), s1 = Math.ceil(head * THREAD_SEG);
        for (let s = s0; s < s1; s++) {
          const ta = Math.max(tail, s / THREAD_SEG), tb = Math.min(head, (s + 1) / THREAD_SEG);
          if (tb <= ta) continue;
          bez(th, ta, _a); bez(th, tb, _b);
          push(_a.x, _a.y, _a.z, _b.x, _b.y, _b.z, 0.85, false, 1);
        }
        if (head < 1) {   // the moving 2 px --white head
          bez(th, Math.max(0, head - 0.035), _a); bez(th, head, _b);
          push(_a.x, _a.y, _a.z, _b.x, _b.y, _b.z, 1, true, 2);
        }
      }
      // «в пути»: 1 px rings breathing at their capitals
      const br = 0.35 + 0.45 * breath.mix(0, 1);
      for (let ci = 0; ci < columns.list.length; ci++) {
        const c = columns.list[ci];
        if (!c.breathe) continue;
        columns.capitalPoint(c, _p);
        const r = COL.capR + 0.45;
        for (let k = 0; k < BREATHE_SEG; k++) {
          const a0 = (TAU * k) / BREATHE_SEG, a1 = (TAU * (k + 1)) / BREATHE_SEG;
          push(_p.x + Math.sin(a0) * r, _p.y - 0.25, _p.z + Math.cos(a0) * r, _p.x + Math.sin(a1) * r, _p.y - 0.25, _p.z + Math.cos(a1) * r, br * c.enterA, false, 1);
        }
      }
      const lines = columns.fxLines;
      if (n > 0 || lines.count > 0) {
        lines.setSegments(seg, n);
        const g = lines.mesh.geometry;
        g.attributes.aCol.needsUpdate = true; g.attributes.aAl.needsUpdate = true; g.attributes.aW.needsUpdate = true;
      }
      lines.mesh.visible = n > 0;
      void _q;
    },
  };
  return fx;
}

/**
 * The SborAdapter (X§2.6.3), k = WORLD.members index.
 * hooks: { columns, worldOrder, fx, toRender(local, out), screenX(col), audio, reduced(), here(col, on), now() }
 */
export function createSborAdapter(h) {
  const { columns, worldOrder, fx } = h;
  const op = columns.op;
  const _l = new Vector3();
  const colOf = (k) => worldOrder[k] || null;
  return {
    ids: worldOrder.map((c) => c.id),
    operatorIndex: Math.max(0, worldOrder.indexOf(op)),
    baseDistM(k) { const c = colOf(k); return c && op ? Math.hypot(c.x - op.x, c.z - op.z) : 0; },
    capital(k, out) { const c = colOf(k); if (!c) return out.set(0, 0, 0); columns.capitalPoint(c, _l); return h.toRender(_l, out); },
    screenX(k) { const c = colOf(k); return c ? h.screenX(c) : 0; },
    ring(f) { fx.ring(f); },
    callRing(r, a) { fx.callRing(r, a); },
    strike(k) {
      const c = colOf(k);
      if (!c || !op || c === op) return;
      // a soft struck sway of 0.12 m in the ring's travel direction: away from him, never toward him (A3.2)
      if (!h.reduced()) {
        let dx = c.x - op.x, dz = c.z - op.z;
        const l = Math.hypot(dx, dz) || 1;
        dx /= l; dz /= l;
        columns.push(c, dx, dz, 0.12, h.now());
      }
      columns.reindex(c);
      if (h.audio) h.audio.play('tick', {});
    },
    climb(k, ms, times = 1) {
      const c = colOf(k);
      if (!c) return;
      const now = h.now();
      for (let i = 0; i < Math.max(1, times | 0); i++) columns.climb(c, h.reduced() ? 16 : ms, now, 1, i * (ms + 40));
    },
    flashCapital(k, token, ms) {
      const c = colOf(k);
      if (!c) return;
      const now = h.now();
      if (token === 'silver40') columns.glow(c, ms || 1200, now);
      else columns.flash(c, ms || 34, now, 1);
    },
    breatheRing(k, on) { const c = colOf(k); if (c) c.breathe = !!on; },
    thread(k, ms) {
      const c = colOf(k);
      if (!c) return { release() {} };
      return fx.thread(c, h.reduced() ? 16 : ms);
    },
    markHere(k, on) { const c = colOf(k); if (c) h.here(c, !!on); },
  };
}
