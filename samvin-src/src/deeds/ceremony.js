// deeds/ceremony.js — the КОДЕКС engraving ceremony (SPEC-ADDENDUM A3.3, A11.3; ARCH-ADDENDUM X§2.6.1). OWNER: WP13.
// A law earned by a deed is cut into the back face of its stratum on the next idle moment in CORE (at once if he is
// idle there; else 600 ms after the next CORE arrival lock), through the stage lock ('codex'), never during ПОКАЗ;
// queued laws follow 1,200 ms apart (the stage spaces consecutive 'codex' runs).
//   0–1,200        the Key yaws to 180° by itself (heavy spring), strata gaps 0.020 → 0.050 m, the lamp grazes the back
//   1,200 → +45.5·len  CUT: a 3×3 px --ember head travels the baseline at 22 chars/s (uCut 0 → 1), a `chisel` per letter
//   end of cut     the face's 12 primary edges flash electrum (≤ 2,500 ms + 600 cool); stratum note + low thud; the DOM
//                  leader block draws (240 ms) and holds 4,000 ms
//   +4,000         the leader retracts, the Key yaws back to its drift, gaps close; codeShown gains the stratum
// ≈ 6,800 ms per law. Any tap: ×3. Esc: ends at once (the engraving is already permanent). Reduced motion: cut to the
// back pose, the text appears in a 160 ms fade, the leader holds 4,000 ms, cut back. T0: the installed CodexView
// (WP11, X§2.6.1) does the picture with the same calls.
import { Vector3, Matrix4 } from 'three';
import { loop, ORDER } from '../core/loop.js';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { after, cancelAfter, tween } from '../core/clock.js';
import { input } from '../core/input.js';
import { keyboard } from '../nav/keyboard.js';
import { layout } from '../core/layout.js';
import { createSheet } from '../ui/sheet.js';
import { STRATA_GEOM, STRATA_CODE_BAND, radiusAt } from '../world/structure.js';
import { lawOf, pendingCeremonies, STRATUM_SIGN } from './deedsModel.js';
import { lawBlock, lawLeader, columnSlots } from './codexRead.js';
import { reduced } from '../host/dom.js';

const TAU = Math.PI * 2;
const CPS = 22;                          // chars per second of the cut (45.5 ms per letter)
const GAP_OPEN = { gap: 0.050 };         // overrideGroup gap while the back is shown (A3.3: 0.020 → 0.050 m)
const _m = new Matrix4(), _v = new Vector3(), _w = new Vector3(), _c = new Vector3(), _n = new Vector3();
const _f = { F: new Vector3(), n: new Vector3() };
const _p = { x: 0, y: 0, depth: 0, visible: false };

/** A loop-time clock with a speed factor (tap → ×3) and an end flag (Esc). */
function runClock() {
  const c = { t: 0, speed: 1, ended: false, last: loop.now, waits: [], id: 0 };
  const settle = () => {
    for (let k = c.waits.length - 1; k >= 0; k--) {
      const w = c.waits[k];
      if (c.ended || c.t >= w.at) { c.waits.splice(k, 1); w.res(); }
    }
  };
  c.id = loop.add((dt, t) => { const st = Math.max(0, t - c.last); c.last = t; c.t += st * c.speed; if (c.waits.length) settle(); }, ORDER.UI);
  c.until = (ms) => new Promise((res) => { if (c.ended || c.t >= ms) res(); else c.waits.push({ at: ms, res }); });
  c.end = () => { c.ended = true; settle(); };
  c.stop = () => { loop.remove(c.id); c.ended = true; settle(); };
  return c;
}

/** Baseline point of law i at cut fraction u (render space) → _w */
function baselinePoint(key, i, u) {
  const st = STRATA_GEOM[i], band = STRATA_CODE_BAND[i];
  const jb = Math.floor(st.n / 2), a = (TAU * jb) / st.n;
  const vb = band.vc + band.vh * 0.62;
  const y = st.top + (st.bot - st.top) * vb;
  const r = radiusAt(y), ap = r * Math.cos(Math.PI / st.n), w = 2 * r * Math.sin(Math.PI / st.n);
  const x = (band.u0 + (band.u1 - band.u0) * u - 0.5) * w;
  _v.set(x * Math.cos(a) + ap * Math.sin(a), y, -x * Math.sin(a) + ap * Math.cos(a));
  key.stratumMatrix(i, _m);
  return _w.copy(_v).applyMatrix4(_m);
}

/** The WebGL CodexView (WP1 Key API). The ceremony's clock is passed so the beats follow ×3 / Esc. */
function createKeyView(ctx) {
  let wTw = null, head = null, sheet = null;
  const weight = (to, ms) => {
    const k = ctx.key;
    if (wTw) wTw.cancel();
    if (!(ms > 0)) { k.setOverrideWeight(to); return Promise.resolve(); }
    let from = to > 0.5 ? 0 : 1;
    wTw = tween(ms, (x) => k.setOverrideWeight(from + (to - from) * x));
    return wTw.done;
  };
  const lampOnBack = (i) => {
    const k = ctx.key, lamp = ctx.lamp, rig = ctx.rig;
    if (!lamp || !rig || !rig.camera) return;
    k.backFaceFrame(i, _f);
    _c.setFromMatrixColumn(rig.camera.matrixWorld, 0);                  // camera right: the lamp rakes along the line
    _n.copy(_f.n).normalize();
    lamp.hold(_v.copy(_f.F).addScaledVector(_c, -2.2 * Math.cos((12 * Math.PI) / 180)).addScaledVector(_n, 2.2 * Math.sin((12 * Math.PI) / 180)));
  };
  return {
    clk: null,
    toBack(ms, i) {
      const k = ctx.key;
      k.setInteractive(false);
      k.overrideGroup(GAP_OPEN);
      weight(1, ms);
      lampOnBack(i);
      return k.yawTo(180, ms);
    },
    cut(i, text, cps, clk) {
      const k = ctx.key;
      const n = Math.max(1, [...text].length), D = (1000 * n) / cps;
      if (reduced() || D <= 0) {
        return tween(160, (x) => k.setLaw(i, text, x)).done;
      }
      if (!head) { head = document.createElement('i'); head.className = 'beam-head codex-head'; }
      const fx = document.getElementById('fx');
      if (fx && !head.parentNode) fx.appendChild(head);
      const t0 = clk.t;
      let letter = -1;
      return new Promise((res) => {
        const id = loop.add(() => {
          const u = clk.ended ? 1 : Math.min(1, (clk.t - t0) / D);
          k.setLaw(i, text, u);
          const L = Math.min(n - 1, Math.floor(u * n));
          if (L > letter && u < 1) {
            letter = L;
            ctx.fx.cue.at(performance.now(), { id: 'chisel', audio: (T) => ctx.audio.play('chisel', { when: T, pan: -0.3 + 0.6 * (L / Math.max(1, n - 1)) }) });
          }
          if (ctx.rig && ctx.rig.camera) {
            ctx.rig.project(baselinePoint(k, i, u), _p);
            head.style.transform = `translate3d(${(_p.x - 1.5).toFixed(1)}px,${(_p.y - 1.5).toFixed(1)}px,0)`;
          }
          if (u >= 1) { loop.remove(id); if (head.parentNode) head.parentNode.removeChild(head); res(); }
        }, ORDER.OVERLAY);
      });
    },
    flashFace(i) { ctx.key.flashEdges(i, 'electrum'); },
    leader(i, block) {
      if (layout.isPhone) {
        if (!sheet) sheet = createSheet({ id: 'sheet-codex-cut', modal: false });
        sheet.el.classList.add('sheet--codex');
        sheet.body.textContent = '';
        block.classList.add('codex-block--list');
        sheet.body.appendChild(block);
        sheet.open();
        return { remove() { sheet.close(); } };
      }
      return lawLeader(ctx, i, block, columnSlots(ctx, [i])[0]) || { remove() {} };
    },
    toFront(ms) {
      const k = ctx.key;
      if (ctx.lamp) ctx.lamp.hold(null);
      const p = k.yawTo(0, ms);
      weight(0, ms).then(() => k.overrideGroup(null));
      return p.then(() => { k.setInteractive(true); });
    },
  };
}

/** A view for T0 without WP11's SVG Key: the readable block alone (data stays identical). */
function createDomView() {
  let sheet = null;
  return {
    toBack: () => Promise.resolve(),
    cut: (i, text, cps, clk) => clk.until(clk.t + (1000 * [...text].length) / cps),
    flashFace() {},
    leader(i, block) {
      if (!sheet) sheet = createSheet({ id: 'sheet-codex-cut', modal: false });
      sheet.el.classList.add('sheet--codex');
      sheet.body.textContent = '';
      block.classList.add('codex-block--list');
      sheet.body.appendChild(block);
      sheet.open();
      return { remove() { sheet.close(); } };
    },
    toFront: () => Promise.resolve(),
  };
}

export function createCeremony(ctx) {
  const S = { view: null, running: null, waiting: false, timer: 0 };
  const announced = new Set();
  const keyView = ctx.key ? createKeyView(ctx) : null;
  const domView = createDomView();
  const view = () => S.view || keyView || domView;

  const idleCore = () => app.room === 'CORE' && app.phase === 'idle' && !app.booting && !(app.show && app.show.active)
    && !(ctx.director && ctx.director.busy());

  function markShown(i) {
    const sign = STRATUM_SIGN[i];
    const d = state.data;
    if (!d) return;
    if (!Array.isArray(d.codeShown)) d.codeShown = [];
    if (d.codeShown.includes(sign)) return;
    state.patch((dd) => { dd.codeShown.push(sign); });
    bus.emit('code:shown', { stratum: i });
  }

  async function runOne() {
    const list = pendingCeremonies();
    if (!list.length) return;
    const i = list[0];
    const law = lawOf(i);
    if (!law) { markShown(i); return; }
    const v = view();
    const clk = runClock();
    const rm = reduced();
    S.running = { i, clk };
    const offDown = input.observeDown((e) => { if (e.type !== 'key') clk.speed = 3; });
    const popKey = keyboard.pushHandler((e) => {
      if (e.key === 'Escape') { clk.end(); return true; }
      if (e.key !== 'Tab' && e.key !== 'Shift') clk.speed = 3;
      return false;
    });
    let leader = null;
    try {
      if (!announced.has(i)) { announced.add(i); if (ctx.status) ctx.status.say('code.new'); }
      // 0–1,200: to the back
      const tb = rm ? 0 : 1200;
      const pBack = v.toBack(rm ? 0 : tb, i, clk);
      await clk.until(tb);
      void pBack;
      // CUT
      if (!clk.ended) await v.cut(i, law.text, CPS, clk);
      if (ctx.key && !S.view) ctx.key.setLaw(i, law.text, 1);
      // end of cut: electrum edges, note + thud, the leader
      v.flashFace(i);
      const now = performance.now();
      ctx.fx.cue.at(now, { id: 'stratumNote', audio: (T) => ctx.audio.play('stratumNote', { i, when: T }) });
      ctx.fx.cue.at(now, { id: 'codexThud', audio: (T) => ctx.audio.play('recallThud', { when: T }) });
      const block = lawBlock(i);
      if (block) leader = v.leader(i, block);
      const tLead = clk.t;
      await clk.until(tLead + 4000);
      if (leader) leader.remove(240);
      leader = null;
      markShown(i);
      await v.toFront(rm ? 0 : clk.ended ? 600 : Math.round(1200 / clk.speed), clk);
    } catch (e) {
      if (leader) leader.remove(0);
      if (ctx.key && !S.view) { ctx.key.setLaw(i, law.text, 1); }
      markShown(i);
    } finally {
      offDown(); popKey(); clk.stop();
      S.running = null;
    }
  }

  function start() {
    if (S.waiting || S.running || !pendingCeremonies().length) return;
    S.waiting = true;
    const fn = async () => {
      S.waiting = false;
      if (!idleCore()) { soon(600); return; }
      await runOne();
      soon(0);
    };
    ctx.fx.stage.run('codex', fn).then((r) => {
      if (r === 'dropped') S.waiting = false;
    }, () => { S.waiting = false; });
  }
  /** Try again after ms (the stage itself spaces consecutive ceremonies 1,200 ms apart). */
  function soon(ms) {
    if (S.timer) cancelAfter(S.timer);
    S.timer = after(ms, () => { S.timer = 0; request(); });
  }
  function request() {
    if (S.waiting || S.running || !pendingCeremonies().length) return;
    if (idleCore()) start();
  }

  bus.on('code:earned', () => request());
  bus.on('boot:done', () => soon(600));
  bus.on('room:arrive', (e) => { if (e && e.room === 'CORE') soon(600); });
  bus.on('phase:change', (e) => { if (e && e.phase === 'idle' && app.room === 'CORE') soon(600); });
  bus.on('show:end', () => soon(600));

  return {
    get active() { return !!S.running; },
    /** «новое правило клана.» was said for stratum i in this session (deeds.done says it at the earning) */
    announce(i) { announced.add(i); },
    request,
    setView(v) { S.view = v || null; },
    /** restores the earned, already shown laws on the Key (load) */
    restore() {
      if (!ctx.key) return;
      const shown = Array.isArray(state.data && state.data.codeShown) ? state.data.codeShown : [];
      for (let i = 0; i < 7; i++) {
        const law = lawOf(i);
        if (law && shown.includes(STRATUM_SIGN[i])) ctx.key.setLaw(i, law.text, 1);
      }
    },
  };
}
