// deeds/lost.js — «ПОТЕРЯШКА» and its pair day «ДОГОВОРИЛИСЬ» (SPEC-ADDENDUM A5.1, A5.3, A11.4; ARCH-ADDENDUM X§2.6.4).
// OWNER: WP13. One lost thing per distinct day from day 2, deterministic: hall = [SIGNAL, ARCHIVE, MEMBERS, VOYAGES,
// INSIGNIA (+ NADIR once open)][(dayIndex·3) % n], spot = hall.lostSpots()[floor(mulberry32(dayIndex)()·6)]; on distinct
// days d ≥ 4 with d % 4 === 0 it is a PAIR (two mini-Keys back to back, 0.8 m either side of the spot). Rushing makes it
// hide; calm earns trust; only a hold completes (1,500 ms; the pair 2,400 ms) — clicks never do. An unrescued one is
// simply gone the next day and no line ever mentions it (L11). The WebGL picture is a hall extension (lostView.js); T0
// draws through the view WP11 installs (setView) — or, until it does, a DOM proxy alone — with identical data.
import { Vector3 } from 'three';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { loop } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { input } from '../core/input.js';
import { layout } from '../core/layout.js';
import { mulberry32 } from '../core/rng.js';
import { dayIndex, now as clockNow } from '../core/time.js';
import { vibrate } from '../ui/tactile.js';
import { beamWrite } from '../ui/text.js';
import { hallHost } from '../halls/host.js';
import { flyMote } from '../secrets/shardFlight.js';
import { createLostView, COLOR } from './lostView.js';
import { el, panOf, reduced, wait } from '../host/dom.js';

const HALLS = ['SIGNAL', 'ARCHIVE', 'MEMBERS', 'VOYAGES', 'INSIGNIA'];
const TAU = Math.PI * 2;
const _v = new Vector3(), _w = new Vector3(), _t = new Vector3();
const _p = { x: 0, y: 0, depth: 0, visible: false };
const pose = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
let rigRef = null;
/** screen point of mini-Key m (−1: the pair's midpoint) → o (allocation-free) */
function project(v, m, o) { rigRef.project(v.world(m, _w), _p); o.x = _p.x; o.y = _p.y; return o; }

/** Today's lost thing (null before distinct day 2). */
export function lostDay() {
  const d = state.distinctDays | 0;
  if (d < 2 || !state.data) return null;
  const di = dayIndex(clockNow());
  const halls = state.data.nadirOpen ? HALLS.concat(['NADIR']) : HALLS;
  const room = halls[(((di * 3) % halls.length) + halls.length) % halls.length];
  const spot = Math.floor(mulberry32(di)() * 6);
  return { room, spot, dayIndex: di, kind: d >= 4 && d % 4 === 0 ? 'pair' : 'one' };
}

export function createLost(ctx, deps) {
  const lo = () => state.data.lost;
  rigRef = ctx.rig;
  let info = lostDay();
  // a new distinct day resets the day fields (saved / pairs are forever)
  if (info && lo().day !== state.today) {
    state.patch((d) => { Object.assign(d.lost, { kind: info.kind, day: state.today, rescued: false, hid: false }); });
  }
  const phone = () => layout.isPhone;
  const T = {
    view: null, ext: null, t0view: null, t0: null,
    screen: { x: -1, y: -1 }, a: { x: -1, y: -1 }, b: { x: -1, y: -1 },
    saidHere: false,
  };

  /** The controller state of the current spawn (one instance per resident spawn). */
  function makeRun(hctx, v) {
    return {
      hctx, v, hidden: 0, hideT: 0, hiddenAt: -1e9, calmMs: 0, peekCalm: 0, aligned: 0, driftAt: -1, holding: false,
      holdMs: 0, holdAligned: 0, lastT: 0, ring: null, ringFill: 0, voice: null, done: false, proxy: null, clicks: [], lastDown: -1e9,
      face: [0, 0], toCam: 0, pairYaw: 0, threadsT: 0, releaseAt: -1, kbHold: false, focus: false, t: 0,
    };
  }

  // ─── spot (hall-local), sanitised so a hall that breaks the 9–14 m / central-60 % contract still shows it ───────
  function spotFor(hctx) {
    const pts = hallHost.call(hctx.id, 'lostSpots');
    hallHost.restPose(hctx.id, null, pose);                     // canonical
    const camL = new Vector3().copy(pose.pos).sub(hctx.meta.anchor);
    const tgtL = new Vector3().copy(pose.target).sub(hctx.meta.anchor);
    const fwd = new Vector3().copy(tgtL).sub(camL).normalize();
    const right = new Vector3().crossVectors(fwd, new Vector3(0, 1, 0));
    if (right.lengthSq() < 1e-9) right.set(1, 0, 0); else right.normalize();
    const up = new Vector3().crossVectors(right, fwd).normalize();
    const tf = Math.tan(((pose.fov || 35) * Math.PI) / 360), aspect = Math.max(0.3, layout.w / Math.max(1, layout.h));
    const ok = (p) => {
      _v.copy(p).sub(camL);
      const dz = _v.dot(fwd), d = _v.length();
      if (!(dz > 0) || d < 9 || d > 14) return false;
      const nx = _v.dot(right) / dz / (tf * aspect), ny = _v.dot(up) / dz / tf;
      return Math.abs(nx) <= 0.6 && Math.abs(ny) <= 0.6;
    };
    let spot = Array.isArray(pts) && pts.length >= 6 ? new Vector3().copy(pts[info.spot % pts.length]) : null;
    if (!spot || !ok(spot)) {
      // the hall's six candidates do not meet A5.1 (WP0 placeholder halls): six seeded points in the central view at 11.5 m
      const k = info.spot % 6;
      const nx = [-0.08, 0.3, 0.12, 0.38, 0.22, -0.02][k], ny = [-0.16, -0.22, 0.18, 0.1, -0.28, 0.24][k];   // clear of the title column (left) and the navigator (right)
      const dir = new Vector3().copy(fwd).addScaledVector(right, nx * tf * aspect).addScaledVector(up, ny * tf).normalize();
      spot = new Vector3().copy(camL).addScaledVector(dir, 11.5);
    }
    return { spot, right, camL };
  }

  // ─── spawn / despawn ────────────────────────────────────────────────────────────────────────────────────────────
  function spawn(hctx) {
    if (!info || T.ext || app.tier === 'T0' || !hctx.group) return;
    const { spot, right, camL } = spotFor(hctx);
    const v = createLostView(hctx, info.kind, spot, right, camL);
    const r = makeRun(hctx, v);
    // faces: toCam = the yaw facing the camera; the pair stands back to back along `right`
    const tc = _t.copy(camL).sub(spot); r.toCam = Math.atan2(tc.x, tc.z);
    r.pairYaw = Math.atan2(right.x, right.z);                    // the yaw that faces +right (A, at −right, sees B)
    if (info.kind === 'pair') {
      r.face[0] = wrap(r.pairYaw + Math.PI);                       // A back to B: faces −right
      r.face[1] = wrap(r.pairYaw);                                 // B back to A: faces +right
    } else {
      r.face[0] = wrap(r.toCam + 0.9);
    }
    for (let m = 0; m < v.st.keys.length; m++) v.st.keys[m].face = r.face[m];
    makeProxy(r);
    T.ext = r;
    if (lo().rescued) { v.setVisible(false); if (r.proxy) r.proxy.setVisible(false); r.done = true; }
  }
  function despawn() {
    const r = T.ext;
    if (!r) return;
    T.ext = null;
    if (r.voice) { try { r.voice.stop(40); } catch (e) { /* gone */ } }
    if (r.proxy) r.proxy.remove();
    if (r.ring) r.ring.remove();
    r.v.dispose();
  }

  // ─── the DOM proxy (≥ 44 × 44, phone ≥ 56 × 56) + the hold ring ────────────────────────────────────────────────
  function makeProxy(r) {
    const pair = info.kind === 'pair';
    const label = pair ? 'два маленьких ключа' : 'маленький ключ';
    const size = phone() ? 56 : 44;
    const ringEl = el('div', 'lost-ring');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    const R = phone() ? 28 : 22;
    svg.setAttribute('viewBox', `${-R - 2} ${-R - 2} ${2 * R + 4} ${2 * R + 4}`);
    svg.setAttribute('width', String(2 * R + 4)); svg.setAttribute('height', String(2 * R + 4));
    const circ = document.createElementNS(svgNS, 'circle');
    circ.setAttribute('r', String(R)); circ.setAttribute('pathLength', '1');
    circ.setAttribute('transform', 'rotate(-90)');
    svg.appendChild(circ);
    ringEl.appendChild(svg);
    r.ringCirc = circ;
    const get = (out) => r.v.anchor(pair ? -1 : 0, out);
    r.ring = ctx.overlay.add({ owner: 'lost', id: 'ring', el: ringEl, get, scrim: false, cross: false, lowpass: 0, priority: 70 });
    r.proxy = ctx.overlay.add({
      owner: 'lost', id: 'proxy', get, lowpass: 0, priority: 70,
      button: { label, size, onActivate() { /* a click never completes anything (A11.4) */ }, onFocus() { r.focus = true; }, onBlur() { r.focus = false; endHold(r, true); } },
    });
    const b = r.proxy.button;
    b.setAttribute('data-qa', 'lost');
    b.setAttribute('data-kind', pair ? 'pair' : 'one');
    b.classList.add('lost-proxy');
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); onDown(r, e.pointerType || 'mouse'); });
    const up = () => endHold(r, true);
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    b.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); r.kbHold = true; startHold(r); } });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') { r.kbHold = false; endHold(r, true); } });
  }
  function setRing(r, f) {
    r.ringFill = f;
    if (r.ringCirc) r.ringCirc.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, f)));
    if (r.ring && r.ring.el) r.ring.el.classList.toggle('is-on', f > 0.001);
  }

  // ─── input ──────────────────────────────────────────────────────────────────────────────────────────────────────
  function onDown(r, type) {
    if (r.done) return;
    const t = loop.now;
    // ≥ 4 clicks within 1,000 ms near it → it hides (force never works)
    r.clicks.push(t);
    while (r.clicks.length && t - r.clicks[0] > 1000) r.clicks.shift();
    if (r.clicks.length >= 4) { hide(r); r.clicks.length = 0; return; }
    if (type === 'touch' && t - r.lastDown >= 600) r.calmMs = Math.max(r.calmMs, 1);      // a calm touch-down (phone)
    r.lastDown = t;
    startHold(r);
  }
  function startHold(r) {
    if (r.done || r.holding) return;
    r.holding = true; r.holdMs = 0; r.holdAligned = r.aligned; r.holdStart = performance.now();
    if (!r.voice) r.voice = ctx.audio.start('probeHold', {});
  }
  function endHold(r, early) {
    if (!r.holding) return;
    // the release itself is a moment of the hold: a hold that reached its time between two (slow) frames completes
    if (early && !r.done && !r.hidden && performance.now() - r.holdStart >= (info.kind === 'pair' ? 2400 : 1500) && app.room === r.hctx.id) {
      complete(r);
      return;
    }
    r.holding = false;
    if (r.voice) { try { r.voice.stop(60); } catch (e) { /* gone */ } r.voice = null; }
    if (!early || r.done) return;
    const from = r.ringFill;
    tween(240, (x) => setRing(r, from * (1 - x)));                // unwinds, no deny sound
    if (info.kind === 'pair') { r.releaseAt = loop.now; const f = r.v.st.threads; tween(240, (x) => { if (!r.holding) r.v.st.threads = f * (1 - x); }); }
    r.holdMs = 0;
  }
  function hide(r) {
    if (r.hidden || r.done) return;
    r.hidden = 1; r.hiddenAt = loop.now; r.peekCalm = 0; r.calmMs = 0;
    endHold(r, true);
    const x = T.screen.x;
    ctx.fx.cue.at(performance.now(), { id: 'lostHide', audio: (Tc) => ctx.audio.play('lostHide', { when: Tc, pan: panOf(x) }) });
    if (!lo().hid) state.patch((d) => { d.lost.hid = true; });
  }

  // ─── per-frame logic (hall extension update, ORDER.WORLD) ───────────────────────────────────────────────────────
  function frame(dt) {
    const r = T.ext;
    if (!r || !info || app.room !== r.hctx.id) return;
    if (ctx.fx.impact && ctx.fx.impact.inPause()) { r.lastT = 0; return; }    // a ПАУЗА holds everything still
    const v = r.v, keys = v.st.keys, pair = info.kind === 'pair', rm = reduced();
    // his gestures are wall-clock (a held finger is 1,500 ms on any device): the step is the real interval, capped
    const pn = performance.now();
    const ms = r.lastT > 0 ? Math.min(600, Math.max(0, pn - r.lastT)) : dt * 1000;
    r.lastT = pn;
    dt = ms / 1000;
    r.t += ms;
    // screen points
    project(v, pair ? -1 : 0, T.screen);
    if (pair) { project(v, 0, T.a); project(v, 1, T.b); }
    if (r.done) { v.frame(); return; }
    // the pointer: distance to the mini-Key (pair: the midpoint) and speed
    const P = input.pointer;
    const d = Math.hypot(P.x - T.screen.x, P.y - T.screen.y);
    const speed = loop.now - P.lastMove > 120 ? 0 : P.speed;
    const touch = P.type === 'touch';
    const rushV = touch ? 1200 : 900, rushD = touch ? 80 : 160;
    // hide / peek back (a pass between two frames is caught by the pointer observer below)
    if (!r.hidden && !r.holding && d < rushD && speed > rushV && app.phase === 'idle') hide(r);
    if (r.hidden) {
      if (d > 160 || speed < 300) r.peekCalm += ms; else r.peekCalm = 0;
      if (r.peekCalm >= 2000) { r.hidden = 0; r.peekCalm = 0; }
    }
    const hideTarget = r.hidden ? 1 : 0;
    r.hideT += (hideTarget - r.hideT) * Math.min(1, ms / (rm ? 160 : r.hidden ? 240 : 400) * 3);
    // calm / trust (keyboard focus = a calm approach)
    const calm = !r.hidden && (r.focus || (d < 220 && speed < 300) || (touch && P.down && d < 56));
    if (calm) r.calmMs += ms; else if (d > 260 && !r.holding) r.calmMs = 0;
    // hold
    const H = pair ? 2400 : 1500;
    if (r.holding && r.hidden) r.holdStart += ms;              // a hidden one does not count the hold
    if (r.holding && !r.hidden) {
      r.holdMs = pn - r.holdStart;
      setRing(r, r.holdMs / H);
      if (r.holdMs >= H) { complete(r); v.frame(); return; }
    }
    // alignment
    let want;
    if (pair && r.holding) want = Math.min(7, Math.floor(r.holdMs / 343));
    else if (r.holding) want = Math.max(r.holdAligned, Math.min(7, Math.floor((r.holdMs / H) * 7)));
    else if (pair) want = r.releaseAt > 0 && loop.now - r.releaseAt < 2000 ? r.aligned : 0;
    else want = calm ? Math.min(7, Math.floor(r.calmMs / 140)) : r.aligned;
    if (want > r.aligned) {
      for (let i = r.aligned; i < want; i++) {
        const pn = panOf(T.screen.x);
        ctx.fx.cue.at(performance.now(), { id: 'ratchet', audio: (Tc) => ctx.audio.play('ratchet', { i, when: Tc, pan: pn }) });
        if (pair) ctx.fx.cue.at(performance.now() + 30, { id: 'ratchet', audio: (Tc) => ctx.audio.play('ratchet', { i, when: Tc, pan: pn }) });
        if (r.holding) vibrate(6);
      }
      r.aligned = want;
    } else if (d > 260 && !r.holding && r.aligned > 0 && (!pair || r.releaseAt < 0 || loop.now - r.releaseAt > 2000)) {
      r.aligned = 0;                                                   // trust fades gently (the drift below takes 1,600 ms)
    }
    for (let m = 0; m < keys.length; m++) {
      const k = keys[m];
      for (let i = 0; i < 7; i++) {
        const tgt = i < r.aligned ? 1 : 0;
        const rate = tgt > k.align[i] ? ms / 140 : ms / 1600;
        k.align[i] = tgt > k.align[i] ? Math.min(tgt, k.align[i] + rate) : Math.max(tgt, k.align[i] - rate);
      }
      // faces (ω 6)
      let ft;
      if (pair) {
        const toOther = m === 0 ? r.pairYaw : r.pairYaw + Math.PI;     // A at −right faces +right to see B
        if (r.holding) ft = r.toCam + wrap(toOther - r.toCam) * Math.min(1, r.holdMs / 2400);
        else if (calm) ft = r.toCam;
        else ft = toOther + Math.PI;                                    // back to back
      } else ft = calm || r.holding ? r.toCam : r.toCam + 0.9;
      r.face[m] += wrap(ft - r.face[m]) * Math.min(1, 6 * dt);
      k.face = r.face[m];
      k.hide = r.hideT;
      k.shiver = rm ? 0 : 0.006 * Math.sin(TAU * 9 * (r.t / 1000) + m * 1.7);
      // the stutter: 3 bursts of 120 ms at 16 Hz every 2,600 ms (night, calm: half rate; hold: halves every 500 ms)
      let period = 2600 * (app.night ? 2 : 1) * (calm && pair ? 2 : 1);
      if (r.holding && !pair) period *= Math.pow(2, Math.floor(r.holdMs / 500));
      const inStep = pair && r.holding && r.holdMs >= 1200;
      const ph = ((r.t + (pair && !inStep && m === 1 ? 1300 : 0)) % period + period) % period;
      let on = 1;
      if (rm) on = 0.55 + 0.45 * Math.cos((TAU * (r.t + (pair && !inStep && m === 1 ? 1000 : 0))) / 2000);
      else if (ph < 600 && (ph % 240) < 120) on = Math.floor((ph % 240) / 31.25) % 2 === 0 ? 1 : 0;
      if (pair && !inStep && !rm) {                                    // A bursts while B is dark, then B while A is dark
        const other = ((r.t + (m === 0 ? 1300 : 0)) % period + period) % period;
        if (other < 600) on = 0;
      }
      k.nucOn = on;
      k.nucDark = r.hidden ? 1 : 0;
    }
    if (pair) {
      if (r.holding) v.st.threads = Math.min(1, r.holdMs / 1200);
      v.st.threadA = 1;
    }
    v.frame();
  }

  // ─── completion: rescue (one) / agreement (pair) ─────────────────────────────────────────────────────────────────
  function complete(r) {
    if (r.done) return;
    r.done = true;
    r.holding = false;
    if (r.voice) { try { r.voice.stop(40); } catch (e) { /* gone */ } r.voice = null; }
    setRing(r, 0);
    ctx.fx.stage.run('lost', () => (info.kind === 'pair' ? agree(r) : rescue(r)));
  }
  function ignite(r) {
    const keys = r.v.st.keys;
    for (const k of keys) { k.align.fill(1); k.nuc = COLOR.WHITE; k.nucOn = 1; k.nucDark = 0; }
    r.v.frame();
    requestAnimationFrame(() => { for (const k of keys) k.nuc = COLOR.EMBER; r.v.frame(); });
  }
  function puff(r, m) {
    if (!ctx.fx.dust || app.tier === 'T1') return;
    const h = ctx.fx.dust.emitter('puff', { originRender: r.v.world(m, new Vector3()), count: 200 });
    after(2400, () => h.release(600));
  }
  /** the flight to the navigator •: two dots 6 px apart on a pair day */
  async function fly(r, n) {
    const to = ctx.keyNav ? ctx.keyNav.letterPoint('•') : { x: layout.w / 2, y: layout.h / 2 };
    const rm = reduced();
    const pts = n === 2 ? [{ x: T.a.x, y: T.a.y }, { x: T.b.x, y: T.b.y }] : [{ x: T.screen.x, y: T.screen.y }];
    const keys = r.v.st.keys;
    if (rm) {
      for (const k of keys) k.alpha = 0;
      r.v.frame();
      const ring = el('i', 'lost-land', null, document.getElementById('fx'));
      ring.style.transform = `translate3d(${to.x}px,${to.y}px,0)`;
      after(600, () => ring.remove());
    } else {
      tween(900, (x) => { for (const k of keys) { k.scale = 1 - 0.95 * x; k.alpha = 1 - x; } r.v.frame(); });
      const flights = pts.map((p, i) => flyMote(p, { x: to.x + (n === 2 ? (i ? 3 : -3) : 0), y: to.y }, { colour: 'white', ms: 900, sizePx: 3 }));
      await Promise.all([Promise.all(flights), wait(900)]);
    }
    r.v.setVisible(false);
    if (r.proxy) r.proxy.setVisible(false);
    if (ctx.keyNav) ctx.keyNav.flashLetter('•', 'white', 50);
    vibrate([8, 40, 8]);
  }
  function record(kind) {
    state.patch((d) => {
      const L = d.lost;
      if (kind === 'pair') L.pairs = (L.pairs | 0) + 1; else L.saved = (L.saved | 0) + 1;
      L.rescued = true;
      if (!Array.isArray(L.log)) L.log = [];
      L.log.push({ kind, day: state.today, room: info.room });
      if (L.log.length > 400) L.log.splice(0, L.log.length - 400);
    });
    if (ctx.key && ctx.key.grains) ctx.key.grains.markSaved(lo().saved | 0, lo().pairs | 0);
  }
  async function rescue(r) {
    const neverHid = !lo().hid;
    ignite(r);
    ctx.fx.cue.at(performance.now(), { id: 'rescue', audio: (Tc) => ctx.audio.play('rescue', { when: Tc }) });
    puff(r, 0);
    await fly(r, 1);
    record('one');
    if (ctx.status) ctx.status.say('lost.saved');
    if (deps.deeds) deps.deeds.done('notice');
    if (neverHid && deps.deeds) deps.deeds.done('gentle');
    bus.emit('lost:rescued', { saved: lo().saved | 0, gentle: neverHid });
    if (neverHid) after(4000, () => { if (ctx.status) ctx.status.say('lost.gentle'); });
  }
  async function agree(r) {
    const v = r.v, st = v.st;
    ignite(r);
    st.threads = 1; st.line = 1;
    tween(600, (x) => { st.threadA = 1 - x; st.line = 1 - x; v.frame(); });
    micro(r);
    ctx.fx.cue.at(performance.now(), { id: 'rescue', audio: (Tc) => ctx.audio.play('rescue', { pair: true, when: Tc }) });
    puff(r, -1);
    // 2,400–3,000: they glide toward each other until they stand 0.36 m apart
    if (reduced()) { for (const k of st.keys) k.off = 0.62; v.frame(); await wait(600); } else {
      await tween(600, (x) => { const e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; for (const k of st.keys) k.off = 0.62 * e; v.frame(); }).done;
    }
    await fly(r, 2);
    record('pair');
    if (ctx.status) ctx.status.say('pair.done');
    if (deps.deeds) deps.deeds.done('word');
    bus.emit('pair:agreed', { pairs: lo().pairs | 0 });
    after(4000, () => { if (ctx.status) ctx.status.say('pair.fact'); });
  }
  /** MICRO ДОГОВОРИЛИСЬ, BEAM WRITE above the midpoint (2,400 ms) */
  function micro(r) {
    const box = el('div', 'pair-micro');
    const p = el('p', 't-micro pair-micro__t', null, box, { qa: 'pair-micro' });
    const a = ctx.overlay.add({ owner: 'lost', id: 'pair-micro', el: box, scrim: false, lowpass: 0, priority: 80,
      get(out) { r.v.world(-1, out); return out; } });
    beamWrite(p, 'ДОГОВОРИЛИСЬ', {});
    after(2400, () => { box.classList.add('is-out'); after(240, () => a.remove()); });
  }

  // ─── arrival in its hall ────────────────────────────────────────────────────────────────────────────────────────
  function arrived(hctx) {
    if (!info || hctx.id !== info.room || lo().rescued) return;
    if (app.tier === 'T0') { t0Arrive(hctx); return; }
    spawn(hctx);
    if (app.show && app.show.active) return;                          // ПОКАЗ holds the stage: no chirp
    const r = T.ext;
    after(1200, () => {
      if (!T.ext || T.ext !== r || app.room !== info.room || r.done) return;
      const night = !!app.night;
      if (info.kind === 'pair') {
        const pa = panOf(T.a.x), pb = panOf(T.b.x), t0 = performance.now();
        ctx.fx.cue.at(t0, { id: 'lostChirp', audio: (Tc) => ctx.audio.play('lostChirp', { when: Tc, pan: pa, night }) });
        ctx.fx.cue.at(t0 + 180, { id: 'lostChirp', audio: (Tc) => ctx.audio.play('lostChirp', { when: Tc, pan: pb, night }) });
      } else {
        const pn = panOf(T.screen.x);
        ctx.fx.cue.at(performance.now(), { id: 'lostChirp', audio: (Tc) => ctx.audio.play('lostChirp', { when: Tc, pan: pn, night }) });
      }
      if (!T.saidHere && ctx.status) { T.saidHere = true; ctx.status.say(info.kind === 'pair' ? 'pair.here' : 'lost.here'); }
    });
  }

  // ─── T0: WP11's view (the same rules, data, sounds, statuses and deeds; driven here) ─────────────────────────────
  // T0 has no camera: the mini-Key(s) stand still where the view drew them, so the screen points are fixed. A real
  // <button data-qa="lost"> over them carries the press / hold (≥ 4 clicks in 1,000 ms → it hides; a rushing pointer
  // within 160 px → it hides; it peeks back after 2,000 ms of calm); the view shows the hold ring, the threads (pair)
  // and the agreement; the flight home is the same DOM mote.
  function t0Arrive(hctx) {
    void hctx;
    const v = T.t0view;
    if (v && v.spawn && !T.t0 && !lo().rescued) {
      const rnd = mulberry32(info.dayIndex + 17);
      v.spawn(info.kind, { x: 0.3 + 0.4 * rnd(), y: 0.35 + 0.3 * rnd() });
      t0Controls(v);
      if (!(app.show && app.show.active)) {
        after(1200, () => {
          if (!T.t0 || app.room !== info.room || T.t0.done) return;
          const night = !!app.night, t0 = performance.now();
          const pts = info.kind === 'pair' ? [T.a, T.b] : [T.screen];
          pts.forEach((p, i) => { const pn = panOf(p.x); ctx.fx.cue.at(t0 + 180 * i, { id: 'lostChirp', audio: (Tc) => ctx.audio.play('lostChirp', { when: Tc, pan: pn, night }) }); });
        });
      }
    }
    if (!T.saidHere && ctx.status) { T.saidHere = true; ctx.status.say(info.kind === 'pair' ? 'pair.here' : 'lost.here'); }
  }
  function t0Controls(v) {
    const pair = info.kind === 'pair';
    const kp = v.keyPoints ? v.keyPoints() : [];
    if (!kp.length) return;
    if (pair) { T.a.x = kp[0].x; T.a.y = kp[0].y; T.b.x = kp[1].x; T.b.y = kp[1].y; T.screen.x = (kp[0].x + kp[1].x) / 2; T.screen.y = (kp[0].y + kp[1].y) / 2; }
    else { T.screen.x = kp[0].x; T.screen.y = kp[0].y; }
    const size = phone() ? 56 : 44, H = pair ? 2400 : 1500;
    const b = el('button', 'proxy lost-proxy', null, document.getElementById('overlay'), { qa: 'lost', 'data-kind': pair ? 'pair' : 'one', type: 'button', 'aria-label': pair ? 'два маленьких ключа' : 'маленький ключ' });
    if (size > 44) { b.style.width = b.style.height = `${size}px`; b.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`; }
    b.style.transform = `translate3d(${T.screen.x.toFixed(1)}px,${T.screen.y.toFixed(1)}px,0)`;
    const R = { done: false, holding: false, holdStart: 0, hidden: false, clicks: [], voice: null, tick: 0, peek: 0, el: b };
    T.t0 = R;
    const stopVoice = () => { if (R.voice) { try { R.voice.stop(60); } catch (e) { /* gone */ } R.voice = null; } };
    const hideIt = () => {
      if (R.done || R.hidden) return;
      R.hidden = true; release(true);
      v.pose('hid', 240);
      const x = T.screen.x;
      ctx.fx.cue.at(performance.now(), { id: 'lostHide', audio: (Tc) => ctx.audio.play('lostHide', { when: Tc, pan: panOf(x) }) });
      if (!lo().hid) state.patch((d) => { d.lost.hid = true; });
      after(2000, function peek() { if (R.done || !R.hidden) return; R.hidden = false; v.pose('idle', 400); });
    };
    const frame = () => {
      R.tick = 0;
      if (R.done || !R.holding) return;
      const p = (performance.now() - R.holdStart) / H;
      v.hold(p);
      if (p >= 1) { finish(); return; }
      R.tick = requestAnimationFrame(frame);
    };
    const press = () => {
      if (R.done || R.hidden || R.holding) return;
      const t = performance.now();
      R.clicks.push(t);
      while (R.clicks.length && t - R.clicks[0] > 1000) R.clicks.shift();
      if (R.clicks.length >= 4) { R.clicks.length = 0; hideIt(); return; }
      R.holding = true; R.holdStart = t;
      v.pose('calm', 240);
      if (!R.voice) R.voice = ctx.audio.start('probeHold', {});
      if (!R.tick) R.tick = requestAnimationFrame(frame);
    };
    function release(early) {
      if (!R.holding) return;
      // a hold that reached its time between two (slow) frames still completes on release
      if (early && !R.done && !R.hidden && performance.now() - R.holdStart >= H && app.room === info.room) { finish(); return; }
      R.holding = false;
      stopVoice();
      if (R.tick) { cancelAnimationFrame(R.tick); R.tick = 0; }
      const from = Math.min(1, (performance.now() - R.holdStart) / H);
      tween(240, (x) => { if (!R.holding && !R.done) v.hold(from * (1 - x)); });
    }
    function finish() {
      if (R.done) return;
      R.done = true; R.holding = false;
      stopVoice();
      if (R.tick) { cancelAnimationFrame(R.tick); R.tick = 0; }
      v.hold(0);
      b.disabled = true;
      ctx.fx.stage.run('lost', () => t0Complete(v));
    }
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); press(); });
    const up = () => release(true);
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    b.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); press(); } });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') release(true); });
    // rushing past it (any pointer within 160 px faster than 900 px/s; touch 80 px / 1,200 px/s) → it hides
    const prev = { x: NaN, y: NaN, t: 0 };
    R.offInput = input.observe((sm) => {
      const now = performance.now(), px = prev.x, py = prev.y, pt = prev.t;
      prev.x = sm.x; prev.y = sm.y; prev.t = now;
      if (R.done || R.hidden || R.holding || app.room !== info.room || app.phase !== 'idle' || !Number.isFinite(px)) return;
      const touch = sm.type === 'touch';
      const dx = sm.x - px, dy = sm.y - py, L2 = dx * dx + dy * dy;
      const u = L2 > 0 ? Math.max(0, Math.min(1, ((T.screen.x - px) * dx + (T.screen.y - py) * dy) / L2)) : 1;
      const d = Math.hypot(px + dx * u - T.screen.x, py + dy * u - T.screen.y);
      const sp = Math.max(sm.speed || 0, Math.sqrt(L2) / Math.max(1, now - pt) * 1000);
      if (d < (touch ? 80 : 160) && sp > (touch ? 1200 : 900)) hideIt();
    });
  }
  async function t0Complete(v) {
    const pair = info.kind === 'pair', neverHid = !lo().hid;
    ctx.fx.cue.at(performance.now(), { id: 'rescue', audio: (Tc) => ctx.audio.play('rescue', pair ? { pair: true, when: Tc } : { when: Tc }) });
    if (pair) await v.agree();
    const to = ctx.keyNav ? ctx.keyNav.letterPoint('•') : { x: layout.w / 2, y: layout.h / 2 };
    const pts = v.homePoints ? v.homePoints() : [{ x: T.screen.x, y: T.screen.y }];
    if (reduced()) await wait(600);
    else await Promise.all([Promise.all(pts.map((p, i) => flyMote(p, { x: to.x + (pts.length === 2 ? (i ? 3 : -3) : 0), y: to.y }, { colour: 'white', ms: 900, sizePx: 3 }))), wait(900)]);
    t0Despawn();
    if (ctx.keyNav) ctx.keyNav.flashLetter('•', 'white', 50);
    vibrate([8, 40, 8]);
    record(pair ? 'pair' : 'one');
    if (pair) {
      if (ctx.status) ctx.status.say('pair.done');
      if (deps.deeds) deps.deeds.done('word');
      bus.emit('pair:agreed', { pairs: lo().pairs | 0 });
      after(4000, () => { if (ctx.status) ctx.status.say('pair.fact'); });
    } else {
      if (ctx.status) ctx.status.say('lost.saved');
      if (deps.deeds) deps.deeds.done('notice');
      if (neverHid && deps.deeds) deps.deeds.done('gentle');
      bus.emit('lost:rescued', { saved: lo().saved | 0, gentle: neverHid });
      if (neverHid) after(4000, () => { if (ctx.status) ctx.status.say('lost.gentle'); });
    }
  }
  function t0Despawn() {
    const R = T.t0;
    if (!R) return;
    T.t0 = null;
    if (R.offInput) R.offInput();
    if (R.voice) { try { R.voice.stop(40); } catch (e) { /* gone */ } }
    if (R.el && R.el.parentNode) R.el.parentNode.removeChild(R.el);
    if (T.t0view && T.t0view.dispose) T.t0view.dispose();
  }
  bus.on('room:depart', (e) => { if (T.t0 && e && e.room === info.room && !T.t0.done) t0Despawn(); });

  hallHost.addExtension({
    name: 'lost',
    arrive(hctx) { arrived(hctx); },
    depart(hctx) { if (T.ext && T.ext.hctx === hctx) { endHold(T.ext, true); } },
    update(hctx, dt) { if (T.ext && T.ext.hctx === hctx) frame(dt); },
    dispose(hctx) { if (T.ext && T.ext.hctx === hctx) despawn(); },
  });
  // Rushing is judged per pointer event, on the segment between two samples (a fast pass can cross the 160 px disc
  // between two frames): the closest approach of that segment to the mini-Key (pair: the midpoint) and its speed.
  const prevP = { x: NaN, y: NaN, t: 0 };
  input.observe((sm) => {
    const r = T.ext, now = performance.now();
    const px = prevP.x, py = prevP.y, pt = prevP.t;
    prevP.x = sm.x; prevP.y = sm.y; prevP.t = now;
    if (!r || r.done || r.hidden || r.holding || !info || app.room !== r.hctx.id || app.phase !== 'idle' || !Number.isFinite(px)) return;
    const touch = sm.type === 'touch';
    const dx = sm.x - px, dy = sm.y - py, L2 = dx * dx + dy * dy;
    const u = L2 > 0 ? Math.max(0, Math.min(1, ((T.screen.x - px) * dx + (T.screen.y - py) * dy) / L2)) : 1;
    const d = Math.hypot(px + dx * u - T.screen.x, py + dy * u - T.screen.y);
    const v = Math.max(sm.speed || 0, Math.sqrt(L2) / Math.max(1, now - pt) * 1000);
    if (d < (touch ? 80 : 160) && v > (touch ? 1200 : 900)) hide(r);
  });
  bus.on('travel:start', () => { if (T.ext) endHold(T.ext, true); });
  bus.on('visibility', () => { if (T.ext) { T.ext.lastT = 0; endHold(T.ext, true); } });
  // a day boundary inside a long session: the new day's lost one (or none) takes over
  bus.on('visibility', (e) => { if (e && !e.hidden) { const n = lostDay(); if (n && info && n.dayIndex !== info.dayIndex) { despawn(); info = n; } } });
  if (ctx.key && ctx.key.grains) ctx.key.grains.markSaved(lo().saved | 0, lo().pairs | 0);

  return {
    today() {
      if (!info) return null;
      return { room: info.room, spot: info.spot, dayIndex: info.dayIndex, kind: info.kind, rescued: !!lo().rescued, hid: !!lo().hid };
    },
    blocksDrone(room) { return !!(info && room === info.room && !lo().rescued); },
    snapshot() {
      if (!info) return null;
      const pair = info.kind === 'pair';
      return {
        room: info.room, kind: info.kind,
        screen: { x: Math.round(T.screen.x * 10) / 10, y: Math.round(T.screen.y * 10) / 10 },
        a: pair ? { x: Math.round(T.a.x * 10) / 10, y: Math.round(T.a.y * 10) / 10 } : null,
        b: pair ? { x: Math.round(T.b.x * 10) / 10, y: Math.round(T.b.y * 10) / 10 } : null,
        saved: lo().saved | 0, pairs: lo().pairs | 0, hid: !!lo().hid,
      };
    },
    setView(view) { T.t0view = view || null; },
  };
}
