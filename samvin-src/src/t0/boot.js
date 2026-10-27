// t0/boot.js — WP11. The T0 picture of every boot (ARCH §3.15.4 `boot`; SPEC §4.1–§4.4, §12.5; SPEC-ADDENDUM A2.1.1,
// A2.1.3–A2.1.7). WP2 owns the timelines, sound, ПАУЗА, ignition, name and chrome; this draws the SVG Key's side:
//   desktop first visit  0–600 void · 600–1,800 depth (grain rings, axis beads) · 1,800–2,600 detection (the edges as
//                        points) · 2,600–3,400 THE LINE (2 px ember scan, the strata revealed behind it) · from 2,900 the
//                        bands spin · cryptex locks S 3,400 … N 4,540 (190 ms steps, 4 % snap, 1-frame white) → resolves
//   returning, new day   300–1,100 fades in scrambled · locks 1,100 … 2,240 (190 ms) · resolves at 2,640 (ignition)
//   same day             300–700 fades in · locks 110 ms each · resolves at 1,400
//   reduced motion       400–1,000 fades in aligned · resolves at 1,000
//   phone                the start screen: scrambled at 72.5 % / 47 %, `VIN / КЛЮЧ / СПИТ`, the ghost dot and the hint,
//                        the stroke (a band is crossed when the finger's vertical path runs through it, within the Key's
//                        width ± 40 px: aligns + note + tick + vibrate(7) + white flash + a 2 px ember trail); ≥ 5 of 7
//                        within 1,500 ms → the rest cascade 60 ms each → resolves; partial strokes hold 2,500 ms then drift
//                        back over 900 ms (no deny); after 3 partials «До конца ↓». Then the pull-back to the idle place.
import { after, cancelAfter } from '../core/clock.js';
import { loop, ORDER } from '../core/loop.js';
import { layout } from '../core/layout.js';
import { input } from '../core/input.js';
import { vibrate, VIBE } from '../ui/tactile.js';
import { STRATA_GEOM } from '../core/tokens.js';
import { svg, el, fmt } from './dom.js';
import { SCRAMBLE } from './keyLive.js';

const LOCKS = [3400, 3590, 3780, 3970, 4160, 4350, 4540];

export function createT0Boot(ctx, L, parent) {
  const K = L.K;
  const layer = el('div', 't0-bootlayer', null, parent, { attrs: { 'aria-hidden': 'true' } });
  const top = el('p', 't-micro t0-boot-top', 'VIN / КЛЮЧ / СПИТ', layer);
  const hint = el('p', 't-body t0-boot-hint', null, layer, { qa: 'start-hint' });
  const ghost = el('i', 't0-ghost', null, layer);
  const trailSvg = svg('svg', { class: 't0-trail' }, layer);
  const scan = el('i', 't0-scan', null, layer);
  const timers = [];
  let session = 0, offInput = null, frameId = 0;

  const at = (ms, fn) => timers.push(after(ms, fn));
  const clearAll = () => { while (timers.length) cancelAfter(timers.pop()); if (offInput) { offInput(); offInput = null; } if (frameId) { loop.remove(frameId); frameId = 0; } };
  const stage = (cls, on) => K.root.classList.toggle(cls, !!on);

  function resetPicture() {
    L.reset();
    stage('is-hidden', false); stage('is-faint', false);
    for (const s of K.strata) K.stratumClass(s.st.i, 'is-detect', false);
    scan.classList.remove('is-on');
    layer.classList.remove('is-start');
    top.classList.remove('is-in'); hint.classList.remove('is-in'); ghost.classList.remove('is-on');
  }

  // ── desktop first visit ─────────────────────────────────────────────────────────────────────────────────────
  function firstVisit(res) {
    L.setMode('idle'); L.douse(); L.setRing(false); L.scramble();
    stage('is-hidden', true);
    const det = (on) => { for (const s of K.strata) K.stratumClass(s.st.i, 'is-detect', on); };
    at(600, () => { stage('is-hidden', false); stage('is-faint', true); });
    at(1800, () => { stage('is-faint', false); det(true); });
    at(2600, () => {
      // THE LINE: +1.6 → −1.6 m in 800 ms; each band turns from detected points to the solid as the line passes it
      const t0 = loop.now;
      const passed = new Set();
      scan.classList.add('is-on');
      frameId = loop.add(() => {
        const u = Math.min(1, (loop.now - t0) / 800);
        const ym = 1.6 - 3.2 * u;
        scan.style.transform = `translate3d(0,${fmt(K.cy - ym * K.k)}px,0)`;
        for (const s of K.strata) if (!passed.has(s.st.i) && ym < s.st.top) { passed.add(s.st.i); K.stratumClass(s.st.i, 'is-detect', false); K.flash(s.st.i, 'white', 2); }
        if (u >= 1) { loop.remove(frameId); frameId = 0; det(false); scan.classList.remove('is-on'); }
      }, ORDER.UI);
    });
    at(2900, () => L.spin(3.4));
    LOCKS.forEach((t, i) => at(t - 150, () => L.lock(i, 150, true)));
    at(LOCKS[6] + 10, res);
  }

  // ── returning (new day / wake), same day, reduced ───────────────────────────────────────────────────────────
  function returning(res, step, first, fadeAt, endAt) {
    L.setMode('idle'); L.douse(); L.setRing(false); L.scramble();
    stage('is-hidden', true);
    at(fadeAt, () => { stage('is-hidden', false); L.spin(1.6); });
    for (let i = 0; i < 7; i++) at(first + i * step - Math.min(150, step - 20), () => L.lock(i, Math.min(150, step - 20), true));
    at(endAt, res);
  }
  function reducedBoot(res) {
    L.setMode('idle'); L.douse(); L.setRing(false); L.alignAll();
    stage('is-hidden', true);
    at(400, () => stage('is-hidden', false));
    at(1000, res);
  }

  // ── phone start screen + the stroke ─────────────────────────────────────────────────────────────────────────
  function phone(res, opts) {
    L.setMode('start'); L.douse(); L.setRing(false); L.scramble();
    layer.classList.add('is-start');
    stage('is-hidden', true);
    at(opts.returning ? 300 : 600, () => { stage('is-hidden', false); top.classList.add('is-in'); });
    const rm = !!opts.reduced;
    let partials = 0, ghostEvery = 2400, ghostT = -1, done = false;
    const hintAt = opts.returning ? 4000 : 2200;
    const showHint = () => { if (done) return; hint.textContent = partials >= 3 ? 'До конца ↓' : 'Проведи пальцем по ключу'; hint.classList.add('is-in'); ghostT = loop.now; };
    at(hintAt, showHint);
    const holdT = new Float64Array(7);
    const aligned = new Uint8Array(7);
    frameId = loop.add(() => {
      // ghost dot down the axis (S tip → N tip in 900 ms, repeating)
      if (ghostT >= 0 && !done) {
        const u = ((loop.now - ghostT) % ghostEvery) / 900;
        if (u <= 1) {
          const y = K.cy - (1.2 - 2.4 * u) * K.k;
          ghost.style.transform = `translate3d(${fmt(K.cx - 2)}px,${fmt(y - 2)}px,0)`;
          ghost.classList.add('is-on');
        } else ghost.classList.remove('is-on');
      }
      // partial strokes: aligned bands hold 2,500 ms then drift back over 900 ms
      for (let i = 0; i < 7; i++) if (aligned[i] && holdT[i] > 0 && loop.now >= holdT[i]) {
        aligned[i] = 0; holdT[i] = 0;
        L.turnTo(i, SCRAMBLE(i), rm ? 0 : 900);
        if (ctx.audio) ctx.audio.play('tick', { n: i });
      }
    }, ORDER.UI);
    // the stroke
    const cross = new Float64Array(7);
    let yMin = 0, yMax = 0, lastY = 0, dirSum = 0, touching = false, path = '', trail = null;
    const band = (i) => { const s = STRATA_GEOM[i]; return [K.cy - s.top * K.k, K.cy - s.bot * K.k]; };
    /** gt: the event's own time since the touch began (the 1,500 ms window is the finger's, not the renderer's) */
    function crossIt(i, gt) {
      cross[i] = 1 + Math.max(0, gt);
      aligned[i] = 1; holdT[i] = 0;
      L.lock(i, rm ? 0 : 120, true);
      if (ctx.audio) { ctx.audio.play('stratumNote', { i }); ctx.audio.play('tick', { n: i }); }
      vibrate(VIBE.stratum);
      let n = 0;
      for (let j = 0; j < 7; j++) if (cross[j] && 1 + gt - cross[j] <= 1500) n++;
      if (n >= 5 && !done) activate(dirSum >= 0);
    }
    function activate(down) {
      done = true;
      hint.classList.remove('is-in'); ghost.classList.remove('is-on'); top.classList.remove('is-in');
      const order = down ? [0, 1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1, 0];
      const rest = order.filter((i) => !aligned[i]);
      rest.forEach((i, n) => at(60 * (n + 1), () => { aligned[i] = 1; holdT[i] = 0; L.lock(i, rm ? 0 : 60, true); }));
      at(60 * rest.length + 20, () => {
        for (let i = 0; i < 7; i++) holdT[i] = 0;
        if (offInput) { offInput(); offInput = null; }
        layer.classList.remove('is-start');
        touching = false; fadeTrail();
        L.setMode('idle', rm ? 0 : 900);
        res();
      });
    }
    function endTouch() {
      if (!touching) return;
      touching = false;
      const now = performance.now();
      let any = false;
      for (let i = 0; i < 7; i++) if (cross[i]) { any = true; holdT[i] = loop.now + 2500; cross[i] = 0; }
      if (any && !done) { partials++; if (partials >= 3) { ghostEvery = 1600; showHint(); } }
      void now;
      fadeTrail();
    }
    function fadeTrail() { if (trail) { const t = trail; t.classList.add('is-out'); after(620, () => { if (t.parentNode) t.parentNode.removeChild(t); }); trail = null; } }
    offInput = input.push({
      name: 't0-start',
      onGesture(g) {
        if (done) return false;
        if (g.type === 'down') {
          touching = true; yMin = yMax = lastY = g.y; dirSum = 0; cross.fill(0);
          path = `M${fmt(g.x)} ${fmt(g.y)}`;
          trail = svg('path', { d: path, class: 't0-trail__p' }, trailSvg);
          return true;
        }
        if (g.type === 'drag' || g.type === 'dragstart' || g.type === 'move') {
          if (!touching) return true;
          path += `L${fmt(g.x)} ${fmt(g.y)}`;
          if (trail) trail.setAttribute('d', path);
          dirSum += g.y - lastY; lastY = g.y;
          if (Math.abs(g.x - K.cx) <= 0.62 * K.k + 40) {
            yMin = Math.min(yMin, g.y); yMax = Math.max(yMax, g.y);
            if (yMax - yMin >= 24) {
              const down = dirSum >= 0;
              for (let n = 0; n < 7; n++) {
                const i = down ? n : 6 - n;
                const [a, b] = band(i);
                if (!cross[i] && Math.min(yMax, b) - Math.max(yMin, a) > 0) crossIt(i, g.t);
              }
            }
          }
          return true;
        }
        if (g.type === 'up' || g.type === 'cancel' || g.type === 'dragend' || g.type === 'tap' || g.type === 'swipe') { endTouch(); return true; }
        return true;
      },
    });
  }

  /** opts: { phone, returning, sameDay, reduced } → Promise<void> (WP2 ignites and finishes after it). */
  function boot(opts = {}) {
    clearAll();
    resetPicture();
    parent.classList.add('is-booting');
    const my = ++session;
    return new Promise((resolve) => {
      const res = () => { if (my !== session) return; if (frameId) { loop.remove(frameId); frameId = 0; } stage('is-hidden', false); resolve(); };
      if (opts.phone) phone(res, opts);
      else if (opts.reduced) reducedBoot(res);
      else if (opts.returning && opts.sameDay) returning(res, 110, 700, 300, 1400);
      else if (opts.returning) returning(res, 190, 1100, 300, 2640);
      else firstVisit(res);
    });
  }
  /** WP2's ignition (bus boot:ignite): the nucleus 1 frame white, then ember; a skip lands every band at once. */
  ctx.bus.on('boot:ignite', () => {
    if (!L.aligned()) { for (let i = 0; i < 7; i++) L.lock(i, 0, false); }
    stage('is-hidden', false); stage('is-faint', false);
    for (const s of K.strata) K.stratumClass(s.st.i, 'is-detect', false);
    L.ignite(true);
    L.wrap.classList.add('has-axis');
  });
  ctx.bus.on('boot:done', () => { L.setRing(true); L.px.classList.add('is-drawn'); parent.classList.remove('is-booting'); });
  void layout;
  return { boot, layer };
}
