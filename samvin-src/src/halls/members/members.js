// halls/members/members.js — MEMBERS «КЛАН», ▽ +460.00 (SPEC §6.2, §2.7, §7.4 «Подъём колонн», §7.6, §8.1 S04,
// §8.3, §10.1, §12.4; SPEC-ADDENDUM A3.1 РОЛЬ, A3.2 СБОР gestures + visuals, A4.1 payoff C, A5.2 curtain call,
// A2.7 shed; A11 O12 MEMBER, O43 LEVEL).
//
// The clan as a hall of equal Shukhov columns (24 m for everyone) on a 48 m arc, the operator in the middle with his
// ember capital. Hover (or Tab, or the phone's centred column) runs the choreography: light climbs 320 ms, the column
// telescopes 24 → 27.6 m in 5 ratchet steps 45 ms apart, neighbours re-solve to 2.2× spacing and dim to 40 %, a
// leader runs 120 px from the capital and the readout writes row by row. Strum (> 0.25 px/ms across a column) plucks;
// every column within 1,500 ms is АККОРД (S04). Click / Enter / tap → #/members/<id> (900 ms dolly; back 600 ms).
// Holding his own column 1,200 ms is СБОР (WP13 drives the adapter in sbor.js).
import { Vector3 } from 'three';
import { createColumns } from './columns.js';
import { createLayer } from './layer.js';
import { createStrum } from './strum.js';
import { createSborFx, createSborAdapter } from './sbor.js';
import { createPayoffs } from './payoffs.js';
import { buildReadout, buildPeek } from './readout.js';
import { arcX, arcZ } from './columns.js';
import { arcOrder, restAngles, spreadAngles, phoneAngles, restPose, focusPose, ARC } from './arc.js';
import { link } from './link.js';
import { COL } from './shape.js';
import { createElevator } from '../../nav/elevator.js';
import { curvePath } from '../../nav/paths.js';
import { EMPTY_LINE } from '../../data/world.js';
import { normalizeGlyph } from '../../core/glyph.js';
import { hz } from '../../audio/notes.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01 } from '../../core/ease.js';
import { after, cancelAfter } from '../../core/clock.js';
import { beamWrite } from '../../ui/text.js';
import { vibrate, VIBE } from '../../ui/tactile.js';
import { dayKey } from '../../core/time.js';
import { ROOMS } from '../../world/rooms.js';

/** A4.1 payoff C plays on the first MEMBERS arrival while guests are active (reset when the guests leave). */
let guestClimbOnce = false;
/** the readout leader's 45° rise below the capital (px) before its 120 px run */
const RISE = 56;
/** hover «attention»: the camera steps back 8 m along its line of sight so the telescoped capital (28.6 m) and the
 *  deck labels both stay in frame (SPEC's rest pose frames the 24 m columns edge to edge). */
const ATTN_BACK = 18;
/** СБОР: the camera steps back 30 m along its line of sight, so the deck ring, every answering column and the
 *  threads arcing 6 m above the capitals are all in frame (A3.2) — the whole clan, together. */
const SBOR_BACK = 30;
/** The hold is classified on the wall clock, like WP0's hold / longpress (a stalled frame must not stretch it). */
const wall = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const HOLD = Object.freeze({ ringFrom: 150, clickMs: 350, completeMs: 1200, hereMs: 12000 });

/** @returns {Hall} */
export function createMembersHall(hctx) {
  const world = hctx.world;
  const opId = world.operator && world.operator.id;
  const order = arcOrder(world.members, opId);
  const n = order.length;
  const now = () => hctx.loop.now;
  const reduced = () => !!ENV.reducedMotion;
  const kind = () => (hctx.layout.kind === 'phone' ? 'phone' : 'desktop');
  const phone = () => kind() === 'phone';
  const host = () => (hctx.host && hctx.host.sbor ? hctx.host : null);

  let columns = null, layer = null, strum = null, fxr = null, pay = null, elevator = null;
  let emptyEl = null, mottoEl = null, roWrap = null, roAnchor = null, ro = null, roK = -1, roPinned = false;
  const proxies = [];
  const offs = [];
  let current = false, enterU = 0, exitU = 0, prevEnterMs = -1;
  let sub = null, focusK = -1, activeK = -1, kbdK = -1, centreK = 0, hoverGraceUntil = 0, readoutGrace = 0, overReadout = false;
  let lastTickAt = -1e9, capClicked = false, roTimer = -1, roSide = 1, swiped = false, sborRunning = false;
  const opK = order.findIndex((m) => m.id === opId);
  centreK = Math.max(0, opK);
  const ang = new Float32Array(Math.max(1, n));
  const rest = new Float32Array(Math.max(1, n));
  restAngles(n, rest);

  // camera (hall-local): an eased move a → b over ms (reduced: a cut at the midpoint)
  const mk = () => ({ pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 });
  const camA = mk(), camB = mk(), camLive = mk(), tmpPose = mk();
  let camT0 = 0, camMs = 0, camCut = false, camOn = false, camLiveOk = false;
  const poseOut = mk();

  // scratch
  const _l = new Vector3(), _c = new Vector3(), _r = new Vector3(), _d = new Vector3();
  let attn = 0, attnV = 0, sview = 0, sviewV = 0;
  const plucked = new Array(Math.max(1, n)).fill(0);
  const actLog = [];
  const _p = { x: 0, y: 0, depth: 0, visible: false };
  const scr = new Float32Array(Math.max(1, n) * 8);   // per column: baseX, baseY, midX, midY, topX, topY, capX, capY
  const press = { on: false, wall: 0, dragged: false, tapped: false };
  const hold = { on: false, t0: 0, src: '', voice: null, reported: false, done: false, suppressClick: 0 };
  let hereUntil = 0;

  // ─── projection helpers ───────────────────────────────────────────────────────────────────────────────────────
  function toRender(local, out) { hctx.toCanonical(local, out); return hctx.scale ? hctx.scale.toRender(out, out) : out; }
  function project(local) { toRender(local, _r); hctx.rig.project(_r, _p); return _p; }
  function screenOf(c, which, out) {
    const o = c.k * 8;
    if (which === 'base') { out.x = scr[o]; out.y = scr[o + 1]; }
    else if (which === 'mid') { out.x = scr[o + 2]; out.y = scr[o + 3]; }
    else if (which === 'top') { out.x = scr[o + 4]; out.y = scr[o + 5]; }
    else { out.x = scr[o + 6]; out.y = scr[o + 7]; }
    return out;
  }
  function refreshScreen() {
    if (!columns || !hctx.rig || !hctx.rig.camera) return;
    for (let i = 0; i < n; i++) {
      const c = columns.list[i], o = i * 8;
      columns.axisPoint(c, 0, _l); project(_l); scr[o] = _p.x; scr[o + 1] = _p.y;
      columns.axisPoint(c, COL.H * 0.5, _l); project(_l); scr[o + 2] = _p.x; scr[o + 3] = _p.y;
      columns.axisPoint(c, COL.H, _l); project(_l); scr[o + 4] = _p.x; scr[o + 5] = _p.y;
      columns.capitalPoint(c, _l); project(_l); scr[o + 6] = _p.x; scr[o + 7] = _p.y;
    }
  }
  /** Hover zones from the REST arc (the hovered column keeps its rest angle; neighbours move away, the zones do not),
   *  so the hover never chases a column the spread is moving. → column index, −1 none. */
  const restScr = new Float32Array(Math.max(1, n) * 4);   // per column: baseX, baseY, topX, capY (rest pose)
  function refreshRest() {
    if (!hctx.rig || !hctx.rig.camera) return;
    for (let i = 0; i < n; i++) {
      const th = phone() ? ang[i] : rest[i];   // phone: the rotated arc (never spread)
      const x = arcX(th), z = arcZ(th), o = i * 4;
      _l.set(x, 0, z); project(_l); restScr[o] = _p.x; restScr[o + 1] = _p.y;
      _l.set(x, COL.capY, z); project(_l); restScr[o + 2] = _p.x; restScr[o + 3] = _p.y;
    }
  }
  function hoverColumn(x, y, sticky) {
    let best = -1, bd = 1e9;
    for (let i = 0; i < n; i++) {
      const o = i * 4;
      const yb = restScr[o + 1], yc = restScr[o + 3];
      if (y < yc - 40 || y > yb + 30) continue;
      const f = clamp01((y - yb) / ((yc - yb) || 1));
      const xa = restScr[o] + (restScr[o + 2] - restScr[o]) * f;
      // zone: 0.34 of the rest spacing to either side (0.5 for the column already hovered)
      const nb = i > 0 ? Math.abs(restScr[o] - restScr[o - 4]) : Math.abs(restScr[o + 4] - restScr[o]);
      const zone = (i === sticky ? 0.5 : 0.34) * (nb || 120);
      const d = Math.abs(x - xa);
      if (d <= zone && d < bd) { bd = d; best = i; }
    }
    return best;
  }
  /** Column under a screen point (axis band at that height, or the capital), −1 none. */
  function hitColumn(x, y, slack = 0) {
    let best = -1, bd = 1e9;
    for (let i = 0; i < n; i++) {
      const o = i * 8;
      const yb = scr[o + 1], yt = scr[o + 7] - 20;
      const hpx = Math.max(1, Math.abs(yb - scr[o + 5]));
      const half = Math.max(16, (COL.R / COL.H) * hpx * 1.1) + slack;
      if (Math.hypot(x - scr[o + 6], y - scr[o + 7]) < Math.max(28, half * 1.4)) return i;
      if (y < yt || y > yb + 12) continue;
      const f = (y - scr[o + 1]) / ((scr[o + 5] - scr[o + 1]) || 1);
      const xa = scr[o] + (scr[o + 4] - scr[o]) * clamp01(f);
      const d = Math.abs(x - xa);
      if (d <= half && d < bd) { bd = d; best = i; }
    }
    return best;
  }

  // ─── camera ──────────────────────────────────────────────────────────────────────────────────────────────────
  function targetPose(out) {
    if (focusK >= 0) return focusPose(phone() ? 0 : rest[focusK], kind(), out);
    restPose(kind(), out);
    const back = ATTN_BACK * attn + SBOR_BACK * sview;
    if (back > 1e-4) {
      _d.copy(out.pos).sub(out.target);
      const L = _d.length();
      out.pos.copy(out.target).addScaledVector(_d, (L + back) / L);
    }
    return out;
  }
  function moveCamera(ms) {
    copyPose(camA, camLiveOk ? camLive : currentRigPose());
    targetPose(camB);
    camT0 = now(); camMs = ms; camCut = reduced(); camOn = true;
  }
  function currentRigPose() {
    // the rig's current pose, hall-local
    const rp = hctx.rig.pose, a = hctx.meta.anchor;
    tmpPose.pos.copy(rp.pos).sub(a); tmpPose.target.copy(rp.target).sub(a); tmpPose.fov = rp.fov; tmpPose.offsetY = rp.offsetY || 0; tmpPose.roll = 0;
    return tmpPose;
  }
  function copyPose(o, s) { o.pos.copy(s.pos); o.target.copy(s.target); o.fov = s.fov; o.offsetY = s.offsetY || 0; o.roll = 0; return o; }

  // ─── arc layout & the hover/focus choreography ──────────────────────────────────────────────────────────────
  function layoutArc(instant) {
    if (!columns) return;
    if (phone()) phoneAngles(n, centreK, ang);
    else spreadAngles(n, activeK, ang);
    columns.setCameraZ(phone() ? 40 : 48);
    columns.setTargets(ang, instant);
  }
  function setActive(k) {
    if (k === activeK || !columns) return;
    const t = now();
    const prev = activeK;
    activeK = k;
    if (actLog.length > 24) actLog.shift();
    actLog.push(k);
    if (prev >= 0) columns.telescope(columns.list[prev], false, t);
    for (const c of columns.list) c.dimT = k < 0 || c.k === k ? 1 : 0.4;
    if (k >= 0) {
      const c = columns.list[k];
      columns.telescope(c, true, t);
      columns.climb(c, reduced() ? 16 : 320, t, 1);
      if (hctx.lamp) { columns.capitalPoint(c, _l); toRender(_l, _c); hctx.lamp.setFocus(_c, 4.5); }
    } else if (hctx.lamp) aimLampAtArc();
    layoutArc(false);
    showReadout(k, focusK >= 0 && k === focusK);
  }
  function aimLampAtArc() { _l.set(0, 20, 6); toRender(_l, _c); hctx.lamp.setFocus(_c, 14); }

  // ─── readout ────────────────────────────────────────────────────────────────────────────────────────────────
  function sborInfo() { const h = host(); try { return h ? h.sbor.info() : null; } catch (e) { return null; } }
  function hasGlyph() { const g = normalizeGlyph(hctx.state.data && hctx.state.data.glyph); return g.length >= 2; }
  function showReadout(k, pinned) {
    if (k >= 0 && k === roK && pinned === roPinned && ro) return;   // already showing (or about to)
    if (roTimer >= 0) { cancelAfter(roTimer); roTimer = -1; }
    if (k < 0) {
      roK = -1; roPinned = false;
      if (ro) ro.stop();
      if (roAnchor) roAnchor.setVisible(false);
      if (phone() && current) hctx.sheet.set(null);
      return;
    }
    const m = order[k], isOp = m.id === opId;
    roK = k; roPinned = pinned;
    const opts = {
      member: m, isOp, focus: pinned, hasGlyph: isOp && hasGlyph(), sbor: isOp && pinned ? sborInfo() : null, phone: phone(),
      go: (h) => hctx.director.go(h, { source: 'hall' }),
      onWorkshop: () => hctx.director.go('#/members/workshop', { source: 'hall' }),
      sborVerb: { down: () => startHold('kbd'), up: () => endHold() },
    };
    if (ro) ro.stop();
    ro = buildReadout(opts);
    if (phone()) {
      if (!current) return;
      hctx.sheet.set(ro.el, { peek: buildPeek(m, isOp), state: pinned ? 'full' : 'peek' });
      ro.write();
      return;
    }
    roWrap.textContent = '';
    roWrap.appendChild(ro.el);
    refreshRest();   // the side follows the column's REST place (a hover may arrive while the arc is still re-spacing)
    const right = pinned || restScr[k * 4 + 2] <= hctx.layout.w / 2 + 48;   // focus and the centre column read to the right (the title owns the left)
    roWrap.classList.toggle('is-left', !right);
    roSide = right ? 1 : -1;
    roAnchor.update({ leader: { side: right ? 'right' : 'left', len: 120, rise: RISE, runMax: 120 } });
    roAnchor.setVisible(false);
    const delay = reduced() ? 0 : 120;
    roTimer = after(delay, () => {
      roTimer = -1;
      if (roK !== k || !roAnchor) return;
      roAnchor.setVisible(true);
      if (!reduced()) roAnchor.drawIn(240);
      ro.write();
    });
  }

  // ─── СБОР hold (A3.2) ───────────────────────────────────────────────────────────────────────────────────────
  function canHold() { return !!(columns && columns.op && current && (!phone() || centreK === opK)); }
  function startHold(src) {
    if (actLog.length > 24) actLog.shift();
    actLog.push(`hold:${src}:${canHold() ? 1 : 0}:${hold.on ? 1 : 0}`);
    if (!canHold() || hold.on) return;
    hold.on = true; hold.t0 = wall(); hold.src = src; hold.reported = false; hold.done = false; hold.suppressClick = 0;
  }
  function stopVoice() { if (hold.voice) { try { hold.voice.stop(); } catch (e) { /* gone */ } hold.voice = null; } }
  function endHold() {
    if (!hold.on) return;
    hold.on = false;
    const el = wall() - hold.t0;
    actLog.push(`end:${Math.round(el)}`);
    stopVoice();
    if (hold.done) { hold.suppressClick = wall() + 400; return; }
    if (el >= HOLD.completeMs) { completeHold(); return; }   // a stalled frame skipped the 1,200 ms tick: still a СБОР
    if (el >= HOLD.clickMs) hold.suppressClick = wall() + 400;   // swallow only the click this release produces
    if (el >= HOLD.ringFrom) {
      fxr.unwind();
      const h = host(); if (h) try { h.sbor.holdCancel(); } catch (e) { /* WP13 */ }
    }
  }
  function abortHold() { if (hold.on) { endHold(); hold.suppressClick = 0; } }
  function updateHold() {
    if (!hold.on) return;
    const el = wall() - hold.t0;
    if (el < HOLD.ringFrom) return;
    if (!hold.voice && hctx.audio && !hold.done) hold.voice = hctx.audio.start('probeHold', {});
    fxr.ring((el - HOLD.ringFrom) / (HOLD.completeMs - HOLD.ringFrom));
    const h = host();
    if (h) try { h.sbor.holdProgress(el); } catch (e) { /* WP13 */ }
    if (el >= HOLD.completeMs && !hold.done) completeHold();
  }
  function completeHold() {
    {
      const h = host();
      hold.done = true; hold.suppressClick = hold.on ? Infinity : wall() + 400; fxr.ring(1);
      stopVoice();
      after(120, () => fxr.ring(0));
      vibrate([10, 30, 10]);
      let p = null;
      if (h) try { p = h.sbor.holdComplete(); } catch (e) { p = null; }
      sborRunning = true;
      Promise.resolve(p).then(() => { sborRunning = false; if (current) hereUntil = now() + HOLD.hereMs; }, () => { sborRunning = false; });
    }
  }
  function toggleHere(c) {
    const on = !layer.isHere(c.k);
    setHere(c, on);
    if (hctx.audio) hctx.audio.play('memberNote', { hz: hz(c.member.note) });
    const h = host(); if (h) try { h.sbor.toggleHere(c.id); } catch (e) { /* WP13 */ }
  }
  function setHere(c, on) { c.here = !!on; }

  // ─── pluck / chord ──────────────────────────────────────────────────────────────────────────────────────────
  function onPluck(k, dir, v) {
    const c = columns.list[k];
    plucked[k]++;
    const t = now();
    columns.kick(c, dir, 0, 0.4 * Math.min(1, 0.45 + v / 2.5));
    columns.climb(c, 180, t, 0.75);
    if (hctx.audio) hctx.audio.play('memberNote', { hz: hz(c.member.note) });
    if (hctx.fx && hctx.fx.dust) {
      columns.axisPoint(c, 12, _l); toRender(_l, _c);
      try { hctx.fx.dust.emitter('shed', { originRender: _c, count: 300 }); } catch (e) { /* dust is seasoning */ }
    }
  }
  function onChord() {
    pay.chord();
    let anchor = null;
    if (columns.op) { const o = columns.op.k * 8; anchor = { x: scr[o + 6], y: scr[o + 7] }; }
    hctx.secrets.discover('S04', { anchor });
  }
  function beamMotto() {
    if (!mottoEl) return;
    const text = (world.clan && world.clan.motto) || '';
    if (!text) return;
    mottoEl.hidden = false;
    mottoEl.classList.remove('is-out');
    beamWrite(mottoEl, text).then(() => after(4200, () => { if (mottoEl) mottoEl.classList.add('is-out'); }));
  }

  // ─── hall interface ─────────────────────────────────────────────────────────────────────────────────────────
  const hall = {
    id: hctx.id,
    build() {
      hctx.app.columns = order.map(() => COL.H);
      roWrap = document.createElement('div');
      roWrap.className = 'mb-ro-anchor';
      roWrap.addEventListener('pointerenter', () => { overReadout = true; });
      roWrap.addEventListener('pointerleave', () => { overReadout = false; readoutGrace = now() + 200; });
      mottoEl = document.createElement('p');
      mottoEl.className = 't-lead mb-motto';
      mottoEl.hidden = true;
      hctx.section.appendChild(mottoEl);
      if (!n) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'mb-empty scrim';
        const p = document.createElement('p');
        p.className = 't-body';
        p.textContent = EMPTY_LINE.members;
        emptyEl.appendChild(p);
        hctx.section.appendChild(emptyEl);
        elevator = createElevator(hctx);
        return;
      }
      columns = createColumns({ members: order, operatorId: opId, group: hctx.group, far: Math.max(hctx.meta.far, 300) });
      columns.onTeleStep = (c, step) => {
        const t = now();
        if (hctx.audio && current && t - lastTickAt > 20) { lastTickAt = t; hctx.audio.play('tick', { n: step }); }
      };
      for (const c of columns.list) {
        const g = c.op ? hctx.state.data && hctx.state.data.glyph : c.member.glyph;
        if (normalizeGlyph(g).length) columns.engrave(c, g); else columns.engrave(c, []);
      }
      columns.setDots(!!columns.op && !hasGlyph());
      columns.setOwner(!!hctx.app.owner);
      layer = createLayer(hctx.section, columns.list);
      strum = createStrum(n, { onPluck, onChord });
      fxr = createSborFx({ columns, op: columns.op, now });
      const worldOrder = world.members.map((m) => columns.list[order.indexOf(m)]);
      const adapter = createSborAdapter({
        columns, worldOrder, fx: fxr, toRender, audio: hctx.audio, reduced, now,
        screenX: (c) => scr[c.k * 8 + 6], here: (c, on) => setHere(c, on),
      });
      hall.adapter = adapter;
      pay = createPayoffs({
        columns, audio: hctx.audio, now, reduced, layer, screenOf,
        hzOf: (m) => hz(m.note), beam: beamMotto,
        flashCap: (c, ms, amt = 1) => columns.flash(c, ms, now(), amt),
      });
      // proxies (Tab / Enter / phone hit targets) — added before the readout anchor so Tab reaches a column first
      if (hctx.overlay) {
        for (const c of columns.list) {
          const a = hctx.overlay.add({
            owner: 'members', id: c.id, priority: 10, lowpass: 0,
            get: (out) => { columns.capitalPoint(c, _l); toRender(_l, out); },
            button: {
              label: `${c.member.name} · ${c.member.callsign}`,
              onActivate: () => { if (wall() < hold.suppressClick) { hold.suppressClick = 0; return; } activate(c.k); },
              onFocus: () => { kbdK = c.k; },
              onBlur: () => { if (kbdK === c.k) kbdK = -1; },
            },
          });
          if (a.button) {
            a.button.dataset.qa = 'column';
            if (c.op) {
              a.button.addEventListener('pointerdown', () => startHold('proxy'));
              a.button.addEventListener('pointerup', () => endHold());
              a.button.addEventListener('pointercancel', () => abortHold());
            }
          }
          a.setVisible(false);
          proxies.push(a);
        }
        roAnchor = hctx.overlay.add({
          owner: 'members', id: 'readout', el: roWrap, scrim: false, priority: 20, cross: false, lowpass: 0,
          // the leader leaves the capital's rim on the readout's side (camera right ≈ +x hall-local)
          get: (out) => { const c = columns.list[Math.max(0, roK)]; columns.capitalPoint(c, _l); _l.x += roSide * (COL.capR + 0.2); toRender(_l, out); },
          leader: { side: 'right', len: 120, rise: 24 },
        });
        roAnchor.setVisible(false);
      }
      elevator = createElevator(hctx);
      restAngles(n, ang);
      columns.setTargets(ang, true);
      for (const c of columns.list) { c.rise = 0; c.enterA = 0; }
      columns.update(0, now());
      // input: strum (raw samples anywhere: hovering a label or a proxy still strums)
      offs.push(hctx.input.observe((s) => { if (current && enterU >= 1 && strum) strum.sample(s.x, s.y, performance.now()); }));
      // a hold that began on his proxy ends wherever the button is released (the capital may move under the finger)
      const upAnywhere = () => { if (hold.on && hold.src === 'proxy') endHold(); };
      window.addEventListener('pointerup', upAnywhere, true);
      window.addEventListener('pointercancel', upAnywhere, true);
      offs.push(() => { window.removeEventListener('pointerup', upAnywhere, true); window.removeEventListener('pointercancel', upAnywhere, true); });
      offs.push(hctx.bus.on('hint:arrive', (e) => {
        if (!current || !e) return;
        if (e.secret === 'S04' || e.secret === 'S06' || e.secret === 'sbor') pay.hint(e.secret);
      }));
      offs.push(hctx.bus.on('owner:change', () => columns.setOwner(true)));
      offs.push(hctx.bus.on('glyph:saved', (e) => {
        if (!columns.op) return;
        columns.engrave(columns.op, e && e.edges);
        columns.setDots(false);
      }));
      link.iris = (u) => columns.setIris(u);
      link.capital = (out) => (columns.op ? toRender(columns.capitalPoint(columns.op, _l), out) : null);
      // QA (prod-safe, zero cost): tilts, sway, bases — read by the 5-accord / 5-sbor cases
      hctx.section.__qa = () => ({
        tilts: pay.tilts(), op: opK, ids: order.map((m) => m.id),
        sway: columns.list.map((c) => [c.sx, c.sz]), push: columns.list.map((c) => [c.px, c.pz]), base: columns.list.map((c) => [c.x, c.z]),
        here: columns.list.filter((c) => c.here).map((c) => c.id), hereOpen: hereUntil > now(), active: activeK, centre: centreK,
        ro: roAnchor ? { ...roAnchor.screen, k: roK, pinned: roPinned } : null, plucks: plucked.slice(), act: actLog.slice(), th: columns.list.map((c) => [c.th, c.thT]), bands: Array.from(restScr),
      });
    },

    pose(s) {
      const k = s ? order.findIndex((m) => m.id === s) : -1;
      if (k >= 0) return focusPose(phone() ? 0 : rest[k], kind(), poseOut);
      return restPose(kind(), poseOut);
    },

    livePose(out) {
      camLiveOk = true;
      if (!camOn) { targetPose(out); copyPose(camLive, out); return true; }
      const u = clamp01((now() - camT0) / Math.max(1, camMs));
      if (camCut) copyPose(out, u < 0.5 ? camA : camB);
      else {
        const w = EASE.camera(u);
        out.pos.copy(camA.pos).lerp(camB.pos, w); out.target.copy(camA.target).lerp(camB.target, w);
        out.fov = camA.fov + (camB.fov - camA.fov) * w;
        out.offsetY = (camA.offsetY || 0) + ((camB.offsetY || 0) - (camA.offsetY || 0)) * w; out.roll = 0;
      }
      if (u >= 1) { camOn = false; targetPose(out); }
      copyPose(camLive, out);
      return true;
    },

    /** «Подъём колонн» (SPEC §7.4): the last 600 ms of any travel in. Pure in u apart from its ratchet ticks. */
    enter(u) {
      enterU = u;
      if (u > 0) exitU = 0;
      if (!columns) { if (emptyEl) emptyEl.style.opacity = String(u); return; }
      const t = u * 600;
      const mid = (n - 1) / 2;
      let stepsTotal = 0;
      for (let ci = 0; ci < columns.list.length; ci++) {
        const c = columns.list[ci];
        const r = Math.round(Math.abs(c.k - mid) + (n % 2 ? 0 : -0.5));
        const t0 = 60 * Math.max(0, r);
        const steps = Math.max(0, Math.min(5, Math.floor((t - t0) / 45) + 1));
        const frac = clamp01(((t - t0) - (steps - 1) * 45) / 25);
        c.rise = u >= 1 ? 1 : Math.max(0, Math.min(1, (steps - 1 + (steps > 0 ? frac : 0)) / 5));
        if (steps <= 0) c.rise = 0;
        stepsTotal += steps;
        c.enterA = c.rise > 0 ? 1 : 0;
        // the capitals land last: 440 → 580 ms, from 3.2 m above
        const cu = clamp01((t - 440) / 140);
        c.drop = u >= 1 ? 0 : 3.2 * (1 - EASE.reveal(cu));
      }
      // ratchet ticks / the capitals' click (forward only)
      if (t > prevEnterMs && current === false && hctx.audio && !reduced()) {
        if (Math.floor(t / 45) !== Math.floor(Math.max(0, prevEnterMs) / 45) && t < 440) hctx.audio.play('tick', { n: Math.floor(t / 45) % 8 });
        if (t >= 580 && prevEnterMs < 580 && !capClicked) { capClicked = true; hctx.audio.play('tick', { n: 0 }); }
      }
      // A4.1 payoff C: guest columns climb twice + flash, once per arrival while guests are active
      if (t >= 420 && prevEnterMs < 420) guestClimb();
      prevEnterMs = t;
      void stepsTotal;
      const showUi = u >= 0.7 && exitU === 0;
      for (let i = 0; i < proxies.length; i++) proxies[i].setVisible(showUi);
    },

    exit(u) {
      exitU = u;
      const a = clamp01(1 - u * 2);
      if (layer) layer.root.style.opacity = String(a);
      if (roAnchor) roAnchor.setAlpha(a);
      if (emptyEl) emptyEl.style.opacity = String(a);
      if (u > 0) for (let i = 0; i < proxies.length; i++) proxies[i].setVisible(false);
    },

    arrive(info) {
      current = true; enterU = 1; exitU = 0; capClicked = false; prevEnterMs = -1;
      hall.enter(1);
      if (layer) layer.root.style.opacity = '1';
      if (roAnchor) roAnchor.setAlpha(1);
      if (!columns) {
        if (phone() && emptyEl) hctx.sheet.set(null);
        return;
      }
      const h = host();
      if (h) try { h.sbor.attach(hall.adapter); } catch (e) { /* WP13 */ }
      // ЗДЕСЬ: today's marks (state) and guests picked in ГОСТИ
      const today = dayKey(new Date());
      const sb = hctx.state.data && hctx.state.data.sbor;
      const marked = new Set();
      if (sb && Array.isArray(sb.here)) for (const e of sb.here) if (e && e.day === today && Array.isArray(e.ids)) e.ids.forEach((id) => marked.add(id));
      const g = h && h.guests;
      for (const c of columns.list) {
        let isG = false;
        try { isG = !!(g && g.isHere(c.id)); } catch (e) { isG = false; }
        if (marked.has(c.id) || isG) setHere(c, true);
      }
      guestClimb();
      if (phone()) { centreK = Math.max(0, opK); if (info && info.sub) { const k = order.findIndex((m) => m.id === info.sub); if (k >= 0) centreK = k; } }
      layoutArc(true);
      camOn = false;
      if (hctx.lamp) aimLampAtArc();
      if (phone()) setActive(centreK);
      void info;
    },

    depart() {
      current = false;
      abortHold();
      fxr && fxr.ring(0);
      hereUntil = 0;
      if (elevator) elevator.reset();
      if (strum) strum.reset();
      if (pay) pay.stopMelody();
      activeK = -1; kbdK = -1;
      showReadout(-1, false);
      if (phone()) hctx.sheet.set(null);
      const h = host();
      if (h && hall.adapter) try { h.sbor.attach(null); } catch (e) { /* WP13 */ }
    },

    setSub(s, opts = {}) {
      const id = s == null ? null : String(s);
      const k = id ? order.findIndex((m) => m.id === id) : -1;
      if (id && k < 0) return false;
      if (!columns) return id ? false : 0;
      const instant = !!opts.instant && !(reduced() && current);
      const ms = reduced() ? ARC.reducedMs : id ? ARC.focusMs : ARC.backMs;
      if (k === focusK) return 0;
      sub = id;
      focusK = k;
      if (phone() && k >= 0) { centreK = k; }
      if (pay) pay.stopMelody();
      setActive(k >= 0 ? k : (phone() ? centreK : -1));
      if (k >= 0) {
        if (activeK === k) showReadout(k, true);
        const c = columns.list[k];
        const g = c.op ? hctx.state.data && hctx.state.data.glyph : c.member.glyph;
        pay.melody(c, g);
      }
      layoutArc(instant);
      if (instant) { camOn = false; return 0; }
      moveCamera(ms);
      return ms;
    },

    update(dt) {
      if (!columns) return;
      const t = now();
      // desktop hover → active column (focus pins it; Tab focus counts as hover)
      if (current && !phone() && focusK < 0) {
        const pt = hctx.input.pointer;
        let k = -1;
        if (kbdK >= 0) k = kbdK;
        else if (pt.inside !== false && pt.type !== 'touch' && t - pt.lastMove < 6000) {
          // a strum (fast pointer) never opens a hover: the arc must not re-space under a sweep
          const sweeping = t - pt.lastMove < 90 && Math.hypot(pt.vx, pt.vy) > 0.6;   // the velocity is stale once the pointer rests
          k = sweeping ? activeK : hoverColumn(pt.x, pt.y, activeK);
        }
        if (k < 0 && (overReadout || t < readoutGrace) && activeK >= 0) k = activeK;
        // СБОР: from the first held moment to the end of the ЗДЕСЬ window the whole clan stands on its rest arc (every
        // column must be seen answering; WP13's GATHERED readout owns his capital) — no hover re-spacing, no readout
        if ((hold.on && wall() - hold.t0 >= HOLD.ringFrom) || hold.done && sborRunning || hereUntil > t) k = -1;
        if (pay.chordActive) k = -1;   // the curtain call: the whole clan bows together on its rest arc
        if (k !== activeK) {
          if (k >= 0) { hoverGraceUntil = 0; setActive(k); }
          else if (!hoverGraceUntil) hoverGraceUntil = t + 120;
          else if (t >= hoverGraceUntil) { hoverGraceUntil = 0; setActive(-1); }
        } else hoverGraceUntil = 0;
      }
      // attention: heavy spring (ω 6) toward 1 while a column is hovered at the arc (desktop)
      const at = current && !phone() && focusK < 0 && activeK >= 0 ? 1 : 0;
      const hw = Math.min(dt, 1 / 30);
      attnV += (36 * (at - attn) - 12 * attnV) * hw; attn += attnV * hw;
      if (Math.abs(at - attn) < 1e-4 && Math.abs(attnV) < 1e-4) { attn = at; attnV = 0; }
      const sv = current && !phone() && focusK < 0 && ((hold.on && wall() - hold.t0 >= HOLD.ringFrom) || (hold.done && sborRunning) || hereUntil > t) ? 1 : 0;
      sviewV += (36 * (sv - sview) - 12 * sviewV) * hw; sview += sviewV * hw;
      if (Math.abs(sv - sview) < 1e-4 && Math.abs(sviewV) < 1e-4) { sview = sv; sviewV = 0; }
      updateHold();
      pay.update(t);
      columns.update(dt, t);
      fxr.update();
      refreshScreen();
      refreshRest();
      // strum bands + deck labels + marks + the hold ring
      const w = hctx.layout.w;
      for (let i = 0; i < n; i++) {
        const c = columns.list[i], o = i * 8;
        // strum bands: the REST arc (stable harp strings; the hovered column keeps its rest angle anyway)
        const hpx = Math.max(1, Math.abs(scr[o + 1] - scr[o + 5]));
        const ro = i * 4;
        let x = (restScr[ro] + restScr[ro + 2]) / 2;
        if (!phone() && !(Math.abs(x) < 1e6)) x = scr[o + 2];
        const vis = enterU >= 1;
        if (phone()) x = Math.max(6, Math.min(w - 6, x));
        strum.setBand(i, x, (COL.R / COL.H) * hpx, Math.min(scr[o + 5], scr[o + 7]), scr[o + 1], vis);
        const la = clamp01((enterU - 0.75) * 4) * (0.45 + 0.55 * c.dim);
        // labels near the screen's lower corners stand higher, clear of the corner chrome and the scale bar
        const edge = !phone() && (scr[o] < 230 || scr[o] > w - 230) ? 46 : 0;
        // a base still on screen keeps its whole label inside the frame (the edge columns stand at the frame's edge)
        const lx = scr[o] > 0 && scr[o] < w ? Math.max(64, Math.min(w - 64, scr[o])) : scr[o];
        layer.label(i, lx, scr[o + 1] - 14 - edge, la * c.enterA);
        layer.here(i, c.here, scr[o + 6], scr[o + 7] - 34);
      }
      if (columns.op) { const o = columns.op.k * 8; layer.hold(scr[o + 6], scr[o + 7], fxr.ringFill, 1); }
      if (hereUntil && t > hereUntil) hereUntil = 0;
    },

    onGesture(g) {
      if (!current) return false;
      if (!columns) {
        if (g.type === 'wheel') return elevator.onWheel(g);
        if (g.type === 'swipe') return elevator.onSwipe(g);
        return false;
      }
      switch (g.type) {
        case 'down': {
          swiped = false;
          press.on = true; press.wall = wall(); press.dragged = false; press.tapped = false;
          const k = hitColumn(g.x, g.y);
          if (k >= 0 && columns.list[k].op) startHold('canvas');
          return k >= 0;
        }
        case 'dragstart': press.dragged = true; abortHold(); return false;
        case 'dragend': {
          // decided on displacement, not release speed: under a stalled frame the touch moves arrive late and the
          // smoothed velocity reads low, but a 48 px horizontal stroke is still a swipe of the arc (SPEC §10.1)
          const ax = Math.abs(g.tx), ay = Math.abs(g.ty);
          if (phone() && ax >= 48 && ax > 1.4 * ay) { swiped = true; rotate(g.tx < 0 ? 1 : -1); return true; }
          if (ay >= 80 && ay > 1.4 * ax) { swiped = true; return elevator.onSwipe({ type: 'swipe', dir: g.ty < 0 ? 'up' : 'down' }); }
          return false;
        }
        case 'up': case 'cancel': {
          endHold();
          // a short press without a drag is a tap — decided here on the wall clock as well, because a stalled frame
          // can delay the input layer's own 'tap' past its 350 ms window (it then reads as a hold)
          // (inside the 12 s ЗДЕСЬ window any press-and-release on a friend's column marks them, short or long)
          if (g.type === 'up' && press.on && !press.dragged && (wall() - press.wall < HOLD.clickMs || hereUntil > now())) { press.tapped = true; press.on = false; return tapAt(g.x, g.y); }
          press.on = false;
          return false;
        }
        case 'tap':
          if (press.tapped) { press.tapped = false; return true; }
          return tapAt(g.x, g.y);
        case 'swipe':
          if (swiped) { swiped = false; return true; }
          if (g.dir === 'left' || g.dir === 'right') {
            if (phone()) { rotate(g.dir === 'left' ? 1 : -1); return true; }
            return false;
          }
          abortHold();
          return elevator.onSwipe(g);
        case 'wheel': return elevator.onWheel(g);
        default: return false;
      }
    },

    onKey(e) {
      if (!columns) return false;
      const k = e.key;
      if (k === 'Escape') {
        if (hereUntil) { hereUntil = 0; return true; }
        if (sub) { hctx.director.go('#/members', { source: 'kbd' }); return true; }
        return false;
      }
      if (k === 'ArrowLeft' || k === 'ArrowRight') {
        const d = k === 'ArrowLeft' ? -1 : 1;
        if (phone()) { rotate(d); return true; }
        const base = focusK >= 0 ? focusK : activeK >= 0 ? activeK : Math.max(0, opK);
        const j = Math.max(0, Math.min(n - 1, base + d));
        if (focusK >= 0) hctx.director.go(`#/members/${order[j].id}`, { source: 'kbd' });
        else { kbdK = j; if (proxies[j] && proxies[j].button) proxies[j].button.focus(); }
        return true;
      }
      if ((k === 'Enter' || k === ' ') && focusK < 0) {
        const j = activeK >= 0 ? activeK : -1;
        if (j >= 0 && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.qa === 'column') return false;
        if (j >= 0) { activate(j); return true; }
      }
      return false;
    },

    resize() {
      if (!columns) return;
      layoutArc(true);
      camOn = false;
      if (current) {
        const k = activeK;
        roK = -1;
        if (phone()) { if (k < 0) setActive(centreK); else showReadout(k, focusK === k); }
        else { hctx.sheet.set(null); showReadout(k, focusK === k && k >= 0); }
      }
    },

    /** WORKSHOP → MEMBERS: back down through his capital's iris to his column focus (900 ms). */
    entryPath(from, start) {
      if (from !== 'WORKSHOP' || !columns || !columns.op || reduced()) return null;
      const op = columns.op;
      const a = hctx.meta.anchor;
      const pts = [], tgs = [];
      pts.push(start.cam.pos.clone());
      tgs.push(start.cam.target.clone());
      columns.capitalPoint(op, _l);
      const cap = _l.clone();
      const fp = focusPose(phone() ? 0 : rest[op.k], kind(), mk());
      pts.push(toRender(new Vector3(cap.x, cap.y + 1.2, cap.z + 0.4), new Vector3()));
      pts.push(toRender(new Vector3(cap.x, cap.y - 2.0, cap.z + 1.2), new Vector3()));
      pts.push(toRender(fp.pos, new Vector3()));
      tgs.push(toRender(new Vector3(cap.x, cap.y - 12, cap.z + 3), new Vector3()));
      tgs.push(toRender(fp.target, new Vector3()));
      void a;
      return curvePath({
        from: 'WORKSHOP', to: 'MEMBERS', duration: 900, points: pts, targets: tgs, fov: [35, 35],
        fog: [ROOMS.WORKSHOP.fog, ROOMS.MEMBERS.fog],
        cues(u) { columns.setIris(u < 0.12 ? u / 0.12 : u < 0.55 ? 1 : Math.max(0, 1 - (u - 0.55) / 0.35)); },
      });
    },

    /** H18: six hall-local deck spots between the columns, in front of them (PURE). */
    lostSpots() {
      const out = [];
      for (let i = 0; i < 6; i++) {
        const th = ((i + 0.5) / 6 - 0.5) * 50 * (Math.PI / 180);
        out.push(new Vector3(48 * Math.sin(th) * 0.86, 0, 48 - 48 * Math.cos(th) + 7));
      }
      return out;
    },

    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* gone */ } }
      offs.length = 0;
      stopVoice();
      if (roTimer >= 0) cancelAfter(roTimer);
      for (const p of proxies) p.remove();
      proxies.length = 0;
      if (roAnchor) { roAnchor.remove(); roAnchor = null; }
      if (current && phone()) hctx.sheet.set(null);
      const h = host();
      if (h && hall.adapter) try { h.sbor.attach(null); } catch (e) { /* WP13 */ }
      if (link.iris) { link.iris = null; link.capital = null; }
      if (layer) { layer.dispose(); layer = null; }
      if (columns) { columns.dispose(); columns = null; }
      for (const el of [emptyEl, mottoEl]) if (el && el.parentNode) el.parentNode.removeChild(el);
      emptyEl = null; mottoEl = null;
      if (hctx.section) delete hctx.section.__qa;
      current = false;
    },
    adapter: null,
  };

  function tapAt(x, y) {
    if (wall() < hold.suppressClick) { hold.suppressClick = 0; return true; }
    const k = hitColumn(x, y);
    if (k < 0) { if (focusK >= 0) { hctx.director.go('#/members', { source: 'hall' }); return true; } return false; }
    activate(k);
    return true;
  }
  function activate(k) {
    const c = columns.list[k];
    actLog.push(`act:${k}:${hereUntil > now() ? 1 : 0}`);
    if (hereUntil && now() < hereUntil && !c.op) { toggleHere(c); return; }
    if (phone() && k !== centreK && focusK < 0) { rotateTo(k); return; }
    hctx.director.go(`#/members/${c.id}`, { source: 'hall' });
  }
  function rotate(d) { rotateTo(Math.max(0, Math.min(n - 1, centreK + d))); }
  function rotateTo(k) {
    if (k === centreK) return;
    centreK = k;
    if (hctx.audio) hctx.audio.play('tick', {});
    vibrate(VIBE.tick);
    if (focusK >= 0) { hctx.director.go(`#/members/${order[k].id}`, { source: 'hall' }); return; }
    setActive(k);
    layoutArc(false);
  }
  function guestClimb() {
    const h = host();
    const g = h && h.guests;
    if (!g || !g.active || !columns) { if (g && !g.active) guestClimbOnce = false; return; }
    if (guestClimbOnce) return;
    guestClimbOnce = true;
    const t = now();
    for (const c of columns.list) {
      let on = false;
      try { on = !!g.isHere(c.id); } catch (e) { on = false; }
      if (!on) continue;
      columns.climb(c, 320, t, 1);
      columns.climb(c, 320, t, 1, 360);
      columns.flash(c, 34, t, 1);
      setHere(c, true);
    }
  }
  return hall;
}
