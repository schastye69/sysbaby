// t0/sbor.js — WP11. СБОР in T0 (SPEC-ADDENDUM A3.2 "T0", ARCH-ADDENDUM X§2.6.3): the T0 SborAdapter on the SVG column
// elevations (WP13 runs the timeline, sound, data, deed and readout through it) and WP5's side of the gesture — press
// and hold HIS column 1,200 ms (desktop: overview or his focus; phone: when his column is the centred one): from 150 ms
// the 2 px ember ring (r 36 px) fills round his capital (holdProgress), released early it unwinds (holdCancel, no deny),
// complete → holdComplete; a click (< 350 ms, < 8 px) is a focus; > 8 px is a strum. Inside WP13's 12 s ЗДЕСЬ window a
// tap on another column toggles ЗДЕСЬ. The call ring is an SVG ellipse on the deck, threads are SVG arcs drawn with
// stroke-dashoffset (480 ms / 960 ms), «в пути» keeps a breathing 1 px ring at the capital. Keyboard: the `СБОР` verb in
// his focus readout, Enter / Space held 1,200 ms. Readout row: BODY «удержи колонну — клан услышит» until the first СБОР,
// then MICRO `ПОСЛЕДНИЙ dd.mm`.
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { loop, ORDER } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { fmtDate } from '../core/ru.js';
import { svg, el, fmt, reduced } from './dom.js';

export function createSbor(ctx, T, M, H) {
  const host = () => (ctx.host && ctx.host.sbor) || null;
  const ringLayer = svg('g', { class: 't0-sbor' }, M.fxLayer);
  const callRing = svg('ellipse', { class: 't0-sbor__ring', rx: 0, ry: 0 }, ringLayer);
  const op = () => M.cols.find((c) => c.own) || null;
  const capPt = (c) => ({ x: c.x, y: M.base + c.cy - 0.2 * M.k });

  const adapter = {
    get ids() { return H.list.map((m) => m.id); },
    get operatorIndex() { return H.list.findIndex((m) => m.id === ctx.world.operator.id); },
    /** distance (m) of column k's base from his base on the 48 m arc */
    baseDistM(k) {
      const n = H.list.length, o = adapter.operatorIndex;
      if (n < 2 || o < 0) return 0;
      const step = ((50 * Math.PI) / 180) / (n - 1);
      return 2 * 48 * Math.abs(Math.sin(((k - o) * step) / 2));
    },
    /** T0 has no render space: the capital's SCREEN point (x, y px; z = 0) */
    capital(k, out) { const c = M.cols[k]; const p = c ? capPt(c) : { x: 0, y: 0 }; if (out && out.set) out.set(p.x, p.y, 0); else if (out) { out.x = p.x; out.y = p.y; out.z = 0; } return out; },
    screenX(k) { const c = M.cols[k]; return c ? c.x : layout.w / 2; },
    ring(fill01) {
      const c = op();
      if (!c) return;
      const f = Math.max(0, Math.min(1, +fill01 || 0));
      c.ringEl.style.strokeDashoffset = fmt(1 - f);
      c.ringEl.classList.toggle('is-on', f > 0);
    },
    callRing(radiusM, alpha) {
      const c = op();
      if (!c) return;
      callRing.setAttribute('cx', fmt(c.x)); callRing.setAttribute('cy', fmt(M.base));
      callRing.setAttribute('rx', fmt(Math.max(0, radiusM) * M.k)); callRing.setAttribute('ry', fmt(Math.max(0, radiusM) * M.k * 0.16));
      callRing.style.opacity = fmt(Math.max(0, Math.min(1, alpha)));
    },
    /** struck sway AWAY from him (0.12 m) + the capital re-indexes (a tick, a flash) */
    strike(k) {
      const c = M.cols[k], o = op();
      if (!c) return;
      H.sway(k, 0.12 * M.k * 3 * (o && c.x < o.x ? -1 : 1));
      H.flashCap(k, 'white', 60);
      if (ctx.audio) ctx.audio.play('tick', { n: k });
    },
    climb(k, ms, times) { H.climb(k, ms || 320, times || 1); },
    flashCapital(k, token, ms) { H.flashCap(k, token, ms || 140); },
    breatheRing(k, on) { const c = M.cols[k]; if (c) c.col.classList.toggle('is-breathe', !!on); },
    thread(k, ms) {
      const c = M.cols[k], o = op();
      if (!c || !o) return { release() {} };
      const a = capPt(c), b = capPt(o);
      const lift = 6 * M.k;
      const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - lift;
      const p = svg('path', { d: `M${fmt(a.x)} ${fmt(a.y)}Q${fmt(mx)} ${fmt(my)} ${fmt(b.x)} ${fmt(b.y)}`, class: 't0-sbor__thr', pathLength: '1' }, ringLayer);
      const dur = reduced() ? 160 : Math.max(1, ms || 480);
      if (reduced()) { p.style.strokeDashoffset = '0'; p.style.opacity = '0'; requestAnimationFrame(() => { p.style.transition = 'opacity .16s'; p.style.opacity = '1'; }); }
      else tween(dur, (u) => { p.style.strokeDashoffset = fmt(1 - u); });
      return {
        release(rms = 600) {
          tween(reduced() ? 0 : rms, (u) => { p.style.strokeDashoffset = fmt(-u); }).done.then(() => { if (p.parentNode) p.parentNode.removeChild(p); });
        },
      };
    },
    markHere(k, on) { const c = M.cols[k]; if (c) { c.col.classList.toggle('is-here', !!on); c.hereL.classList.toggle('is-on', !!on); } },
  };

  // ── the hold on his column ──────────────────────────────────────────────────────────────────────────────────
  const Hd = { on: false, t0: 0, id: 0, x: 0, y: 0, k: -1, moved: false, done: false };
  function overCol(x, y) {
    for (const c of M.cols) if (Math.abs(x - c.x) < Math.max(28, 2.6 * M.k) && y > M.base + c.top - 14 && y < M.base + 50) return c;
    return null;
  }
  function stopHold(cancel) {
    if (!Hd.on) return;
    Hd.on = false;
    if (Hd.id) { loop.remove(Hd.id); Hd.id = 0; }
    const s = host();
    const ms = performance.now() - Hd.t0;
    // released after the full 1,200 ms on a page that skipped the completing frame: it still completes
    if (cancel && !Hd.done && s && ms >= 1200 && !Hd.moved) { Hd.done = true; M.suppressClick = true; s.holdComplete(); return; }
    if (cancel && !Hd.done && s && ms >= 150) s.holdCancel();
  }
  function startHold(x, y) {
    Hd.on = true; Hd.t0 = performance.now(); Hd.x = x; Hd.y = y; Hd.done = false; Hd.moved = false;
    Hd.id = loop.add(() => {
      const s = host();
      const ms = performance.now() - Hd.t0;
      if (!s || !Hd.on) return;
      if (ms >= 1200 && !Hd.done) { Hd.done = true; M.suppressClick = true; s.holdComplete(); stopHold(false); return; }
      s.holdProgress(ms);
      if (ms >= 350) M.suppressClick = true;
    }, ORDER.UI);
  }
  input.push({
    name: 't0-sbor',
    onGesture(g) {
      if (!M.shown || app.room !== 'MEMBERS' || T.lostMode || app.phase !== 'idle') return false;
      if (g.type === 'down') {
        const c = overCol(g.x, g.y);
        if (!c) return false;
        const s = host();
        if (s && s.hereOpen && !c.own) { s.toggleHere(c.m.id); M.suppressClick = true; return true; }
        if (!c.own || !s) return false;
        if (layout.isPhone && M.centred !== c.i) return false;
        M.suppressClick = false;
        startHold(g.x, g.y);
        Hd.k = c.i;
        return true;
      }
      if (!Hd.on) return false;
      if (g.type === 'drag' || g.type === 'dragstart') { if (Math.hypot(g.tx, g.ty) > 8) { Hd.moved = true; stopHold(true); } return true; }
      if (g.type === 'tap') {
        // a short press on his column is a click: focus it (a hold past 350 ms never focuses)
        const wasHold = M.suppressClick || Hd.done;
        const k = Hd.k;
        stopHold(true);
        if (!wasHold && H.go && H.list[k]) H.go(H.list[k].id);
        M.suppressClick = false;
        return true;
      }
      if (g.type === 'up' || g.type === 'cancel' || g.type === 'dragend') { stopHold(true); return true; }
      return true;
    },
  });
  // proxies: a click that was a hold (or a ЗДЕСЬ tap) never focuses
  T.section('MEMBERS').addEventListener('click', (e) => { if (M.suppressClick) { M.suppressClick = false; e.stopPropagation(); e.preventDefault(); } }, true);

  function keyHold(btn) {
    let t = 0;
    const down = (e) => {
      if ((e.key !== 'Enter' && e.key !== ' ') || e.repeat || Hd.on) return;
      e.preventDefault();
      startHold(0, 0);
      t = 1;
    };
    const up = (e) => { if ((e.key === 'Enter' || e.key === ' ') && t) { t = 0; stopHold(true); } };
    btn.addEventListener('keydown', down);
    btn.addEventListener('keyup', up);
    btn.addEventListener('blur', () => { if (t) { t = 0; stopHold(true); } });
  }

  return {
    adapter,
    /** while the MEMBERS section is shown */
    attach(on) {
      const s = host();
      if (!s || !s.attach) return;
      try { s.attach(on ? adapter : null); } catch (e) { /* seed */ }
      if (!on) { Hd.moved = true; stopHold(true); }
    },
    /** his focus readout: the СБОР row (+ the keyboard verb) */
    readoutRow(ro) {
      const s = host();
      const info = s && s.info ? s.info() : { count: 0, last: null, hint: true };
      // one СБОР: the verb itself is the row's label (NEW-2: a label СБОР over a verb СБОР read twice)
      const r = el('div', 't0-row', null, ro, { data: { row: 'sbor' } });
      const v = el('button', 'verb t-label t0-sborverb', 'СБОР', r, { qa: 'sbor-verb', attrs: { type: 'button' } });
      if (info.hint || !info.last) el('p', 't-body', 'удержи колонну — клан услышит', r);
      else el('p', 't-micro', `ПОСЛЕДНИЙ ${fmtDate(info.last, 'dd.mm')}`, r);
      keyHold(v);
      v.addEventListener('click', (e) => e.preventDefault());
    },
  };
}
