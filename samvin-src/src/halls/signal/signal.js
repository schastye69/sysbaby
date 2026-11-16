// halls/signal/signal.js — WP8: SIGNAL «СВЯЗЬ» `#/signal` ▽ +1 090.00 (SPEC §6.5, §7.4 «Голос», §8.3 S11 hint,
// §10.1 gestures, §4.5 empty inbox, §12.2 stars; SPEC-ADDENDUM A6.4 ОТВЕТ РИСУНКОМ; ARCH §6.9, ARCH-ADDENDUM §5.3 WP8).
//
// The apex hall under the open sky. Modules: sky.js (the spire, rim, mast, beacon, gallery rails, stars), skypad.js
// («НЕБО»: the pad, strokes, the release pipeline, the ghost star, the «Голос» trace), dial.js («ЧАСТОТА», S11),
// inbox.js («ВХОДЯЩИЕ»), replies.js (ОТВЕТ РИСУНКОМ), geom.js (poses and the screen layout), stroke.js (the shared
// stroke pipeline). Gestures: press inside the pad draws; press on the dial tunes; wheel / vertical swipe anywhere else
// rides the elevator (SIGNAL is the top: only down). Keyboard: the dial is a focusable slider (arrows ± 0.05, Shift
// 0.01); Esc leaves reply mode.
import { Vector3 } from 'three';
import { createElevator } from '../../nav/elevator.js';
import { TIER_PARAMS } from '../../core/quality.js';
import { app } from '../../core/store.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01, smoothstep } from '../../core/ease.js';
import { worldCounts, WORLD } from '../../data/world.js';
import { fmtDate } from '../../core/ru.js';
import { state } from '../../core/state.js';
import { saveDrawing } from './stroke.js';
import { saveReply } from './replies.js';
import { createSky, REMEMBERED_MAX } from './sky.js';
import { createSkyPad } from './skypad.js';
import { createDial } from './dial.js';
import { createInbox, deliveredDay } from './inbox.js';
import { restPose, screen, lostSpots as spotsFor, APEX_H } from './geom.js';

const EYE_Y = 2;                     // the horizon the shell flattens onto («Голос»)
const NARROW_EPS = 0.004;

/** @returns {Hall} */
export function createSignalHall(hctx) {
  const id = hctx.id;
  let sky = null, pad = null, dial = null, inbox = null, elevator = null, root = null;
  let current = false, built = false;
  const offs = [];
  const rest = { pos: new Vector3(), target: new Vector3(), fov: 40, offsetY: 0, roll: 0 };
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: 40, offsetY: 0, roll: 0 };
  const livePose = { pos: new Vector3(), target: new Vector3(), fov: 40, offsetY: 0, roll: 0 };
  let liveFramed = false;
  let geo = null, kind = '';
  let enterU = 1, exitU = 0, narrowed = -1, flareT = -1, flareK = -1, unread = 0;
  const _c = new Vector3(), _r = new Vector3();
  const tmpScreen = { x: 0, y: 0, depth: 0, ndcX: 0, ndcY: 0 };

  const tierStars = () => { const p = TIER_PARAMS[app.tier] || TIER_PARAMS.T2; return p.stars ? p.stars.signal : 2000; };
  const drawingsCount = () => (Array.isArray(state.data.drawings) ? state.data.drawings.length : 0);

  // ── layout ───────────────────────────────────────────────────────────────────────────────────────────────
  function relayout() {
    const L = hctx.layout;
    kind = L.kind;
    restPose(kind, rest);
    geo = screen(kind, L.w || window.innerWidth, L.h || window.innerHeight);
    if (sky) {
      sky.setFrame(rest, L.h || window.innerHeight, geo.traceY);
      sky.setRemembered(drawingsCount(), rest);
    }
    if (pad) pad.layout(geo, L.w || window.innerWidth, L.h || window.innerHeight);
    if (dial) dial.layout(geo.dial);
    if (root) root.classList.toggle('is-phone', !!L.isPhone);
  }

  // ── the inbox ────────────────────────────────────────────────────────────────────────────────────────────
  function refreshInbox() {
    if (!inbox) return;
    inbox.refresh();
    unread = worldCounts().unread;
    if (current && hctx.layout.isPhone && hctx.sheet) {
      const keep = hctx.sheet.state === 'full' ? 'full' : 'peek';
      hctx.sheet.set(inbox.body, { peek: inbox.peek, state: keep });
    }
  }
  function openTransmission(i) {
    const tr = WORLD.transmissions[i];
    if (!tr) return;
    if (hctx.audio) hctx.audio.play('select', {});
    if (hctx.lead) hctx.lead.show(tr.text, { beam: true, ms: 4000 + 60 * tr.text.length, micro: `${tr.from} · ${deliveredDay(i)}` });
    state.markRead(i);
    inbox.markOpen(i);
    refreshInbox();
    touch();
  }
  function openNight() {
    if (hctx.audio) hctx.audio.play('select', {});
    if (hctx.lead) hctx.lead.show(WORLD.night.story, { beam: true, ms: 4000 + 60 * WORLD.night.story.length, micro: `НОЧНАЯ ПЕРЕДАЧА · ${fmtDate(state.today, 'dd.mm')}` });
    touch();
  }
  function replyTo(i) {
    if (hctx.audio) hctx.audio.play('select', {});
    pad.setReply(i);
    if (hctx.layout.isPhone && hctx.sheet && hctx.sheet.state === 'full') hctx.sheet.open('peek');
    touch();
  }

  // ── the release pipeline's hooks (skypad → hall) ─────────────────────────────────────────────────────────
  const padHooks = {
    /** Where the new star will shine (screen px): remembered slot min(count, 6). */
    starTarget() {
      const k = Math.min(drawingsCount(), REMEMBERED_MAX - 1);
      const L = hctx.layout;
      sky.rememberedScreen(k, rest, L.w || window.innerWidth, L.h || window.innerHeight, tmpScreen);
      return { x: tmpScreen.x, y: tmpScreen.y };
    },
    /** (c) It is remembered (saved as the figure leaves; the star is placed now, lit on landing). */
    remembered(norm, reply) {
      if (reply >= 0) {
        saveDrawing(norm, { status: false });
        saveReply(reply, norm);
        if (hctx.status) hctx.status.say('reply.saved');
        refreshInbox();
      } else saveDrawing(norm);
      if (sky) { sky.setRemembered(drawingsCount(), rest); flareK = Math.min(drawingsCount(), REMEMBERED_MAX) - 1; sky.flareRemembered(flareK, -0.9); }
    },
    /** The figure reached its star: the remembered star flares (no flare when cut short). */
    landed(instant) {
      if (!sky || flareK < 0) return;
      if (instant) { sky.flareRemembered(flareK, 0); flareT = -1; } else flareT = hctx.loop.now;
    },
  };

  // ── input ────────────────────────────────────────────────────────────────────────────────────────────────
  const padConsumer = {
    name: 'signal-pad',
    onGesture(g) {
      if (g.type === 'move' || g.type === 'drag' || g.type === 'dragstart') pad.add(g.x, g.y);
      else if (g.type === 'up') { pad.add(g.x, g.y); pad.end(); hctx.input.release(padConsumer); touch(); }
      else if (g.type === 'cancel') { pad.abort(); hctx.input.release(padConsumer); }
      return true;
    },
  };
  const dialConsumer = {
    name: 'signal-dial',
    onGesture(g) {
      if (g.type === 'move' || g.type === 'drag' || g.type === 'dragstart') dial.move(g);
      else if (g.type === 'up' || g.type === 'cancel') { dial.end(); hctx.input.release(dialConsumer); touch(); }
      return true;
    },
  };
  function touch() { if (pad) pad.touch(hctx.loop.now); }

  // ── arrival build «Голос» and departure fold (pure in u) ───────────────────────────────────────────────────
  function applyBuild() {
    if (!sky) return;
    const u = enterU, x = exitU;
    if (root) root.dataset.enter = u.toFixed(2);           // QA: the «Голос» build progress (case 8-golos)
    // 3D spire: flat (a luminous trace) → fades while the trace curls → rises back (un-flattens) into the apex.
    const unflat = EASE.camera(clamp01((u - 0.5) / 0.5));
    const flatIn = 1 - unflat;
    const flatOut = EASE.camera(clamp01(x));
    const flat = Math.max(flatIn, flatOut);
    const a3 = (smoothstep(0, 0.10, u) * (1 - smoothstep(0.32, 0.55, u)) + smoothstep(0.5, 0.88, u)) * (1 - smoothstep(0.2, 1, x));
    // While the spire is (partly) flat, its frame follows this frame's camera pose, so the trace lies on the pad's
    // lower tangent row even while the camera is still easing in; at rest it is the rest pose's frame.
    if (flat > 0 && hctx.rig && hctx.rig.pose && hctx.scale && geo) {
      const rp = hctx.rig.pose;
      hctx.scale.toCanonical(rp.pos, livePose.pos).sub(hctx.meta.anchor);
      hctx.scale.toCanonical(rp.target, livePose.target).sub(hctx.meta.anchor);
      livePose.fov = rp.fov || rest.fov;
      sky.setFrame(livePose, hctx.layout.h || window.innerHeight, geo.traceY);
      liveFramed = true;
    } else if (liveFramed && geo) { sky.setFrame(rest, hctx.layout.h || window.innerHeight, geo.traceY); liveFramed = false; }
    sky.setFlatten(flat);
    sky.setFlash(u < 1 ? 1 - smoothstep(0.55, 1, u) : 0);
    sky.setAlpha(Math.min(1, a3));
    sky.setStarsAlpha(smoothstep(0.35, 0.9, u) * (1 - smoothstep(0.3, 1, x)));
    sky.setBeacon(beaconLevel() * smoothstep(0.8, 1, u) * (1 - smoothstep(0, 0.5, x)));
    if (hctx.shell) hctx.shell.setFlatten(flat, EYE_Y);
    // The pad's trace (the 3D trace curls into the pad outline), DOM blocks after it.
    if (pad) { pad.setGolos(u); pad.setAlpha(1 - clamp01(x * 2)); }
    const dom = smoothstep(0.7, 1, u) * (1 - clamp01(x * 2));
    if (dial) dial.setAlpha(dom);
    if (inbox) inbox.desk.style.opacity = String(dom);
    // The ambient bed narrows to one 220 Hz tone while the hall is a single trace, then reopens.
    const n = x > 0 ? 0 : (u < 0.5 ? smoothstep(0, 0.25, u) : 1 - smoothstep(0.55, 0.95, u));
    if (Math.abs(n - narrowed) > NARROW_EPS || (n === 0 && narrowed !== 0)) {
      narrowed = n;
      const bed = hctx.audio && hctx.audio.bed;
      if (bed && typeof bed.narrow === 'function') bed.narrow(n);
    }
  }

  // ── the beacon: 6 px ember; while anything is unread it blinks 120 ms on every 1,200 ms ────────────────────
  let beaconT = 0;
  function beaconLevel() { return unread > 0 ? (beaconT % 1200 < 120 ? 1 : 0.5) : 1; }

  const hall = {
    id,
    build() {
      root = document.createElement('div');
      root.className = 'sg-root';
      hctx.section.appendChild(root);
      sky = createSky(hctx, tierStars());
      if (hctx.group) hctx.group.add(sky.group);
      pad = createSkyPad(hctx, root, padHooks);
      dial = createDial(hctx, root);
      inbox = createInbox(hctx, { open: openTransmission, night: openNight, reply: replyTo });
      root.appendChild(inbox.desk);
      elevator = createElevator(hctx);
      relayout();
      refreshInbox();
      enterU = 0; exitU = 0;
      applyBuild();
      const bus = hctx.bus;
      offs.push(bus.on('hint:arrive', (p) => { if (current && p && p.secret === 'S11' && dial) dial.hint(); }));
      offs.push(bus.on('sound:change', (p) => { if (dial) dial.soundChanged(!!(p && p.on)); }));
      offs.push(bus.on('visibility', (p) => { if (dial) dial.visibility(!!(p && p.hidden)); }));
      offs.push(bus.on('tier:change', ({ tier }) => { const t = TIER_PARAMS[tier]; if (t && t.stars && sky) sky.setStars(t.stars.signal); }));
      offs.push(bus.on('night:change', () => { if (current) refreshInbox(); }));
      built = true;
    },
    pose(sub) { void sub; return restPose(hctx.layout.kind, poseOut); },
    livePose() { return false; },
    enter(u) { enterU = u; if (u > 0) exitU = 0; applyBuild(); },
    exit(u) { exitU = u; applyBuild(); },
    arrive() {
      current = true;
      enterU = 1; exitU = 0;
      relayout();
      refreshInbox();
      dial.arrive();
      pad.arrive(hctx.loop.now);
      applyBuild();
      if (hctx.layout.isPhone && hctx.sheet) hctx.sheet.set(inbox.body, { peek: inbox.peek, state: 'peek' });
      // The lamp's focus: the opening (glints slide along the upper generators round the rim).
      if (hctx.lamp && hctx.scale) {
        hctx.toCanonical(_c.set(0, APEX_H - 10, 0), _r);
        hctx.scale.toRender(_r, _c);
        hctx.lamp.setFocus(_c, 16);
      }
    },
    depart() {
      current = false;
      if (pad) pad.depart();
      if (dial) dial.depart();
      if (elevator) elevator.reset();
      hctx.input.release(padConsumer); hctx.input.release(dialConsumer);
      if (hctx.layout.isPhone && hctx.sheet) hctx.sheet.set(null);
      if (narrowed !== 0) { narrowed = 0; const bed = hctx.audio && hctx.audio.bed; if (bed && bed.narrow) bed.narrow(0); }
    },
    setSub(s) { return s == null ? 0 : false; },
    update(dt, t) {
      if (!built) return;
      beaconT = t;
      if (current) {
        applyBeaconOnly();
        dial.update(dt * 1000, t, ENV.reducedMotion);
        pad.update(t, ENV.reducedMotion);
        if (flareT >= 0) {
          const k = clamp01((t - flareT) / 3200);
          sky.flareRemembered(flareK, 2.4 * (1 - EASE.reveal(k)));
          if (k >= 1) flareT = -1;
        }
      }
    },
    onGesture(g) {
      if (!current || !pad) return false;
      if (g.type === 'hover' || g.type === 'down' || g.type === 'wheel') touch();
      if (g.type === 'down') {
        if (pad.hit(g.x, g.y)) { pad.begin(g.x, g.y); hctx.input.capture(padConsumer); return true; }
        if (dial.hit(g.x, g.y)) { dial.begin(g); hctx.input.capture(dialConsumer); return true; }
        return false;
      }
      if (g.type === 'wheel') return elevator.onWheel(g);
      if (g.type === 'swipe') return elevator.onSwipe(g);
      return false;
    },
    onKey(e) {
      if (!current) return false;
      touch();
      if (dial && document.activeElement === dial.root && dial.key(e)) return true;
      if (e.key === 'Escape' && pad && pad.replyIndex >= 0) { pad.setReply(-1); return true; }
      return false;
    },
    resize() { relayout(); if (current) refreshInbox(); },
    lostSpots() { return spotsFor(hctx.layout.kind); },
    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* already off */ } }
      offs.length = 0;
      if (current && hctx.layout.isPhone && hctx.sheet) hctx.sheet.set(null);
      if (hctx.input) { hctx.input.release(padConsumer); hctx.input.release(dialConsumer); }
      if (pad) pad.dispose();
      if (dial) dial.dispose();
      if (inbox) inbox.dispose();
      if (sky) sky.dispose();
      if (root && root.parentNode) root.parentNode.removeChild(root);
      if (narrowed > 0) { const bed = hctx.audio && hctx.audio.bed; if (bed && bed.narrow) bed.narrow(0); }
      pad = dial = inbox = sky = root = null;
      current = false; built = false;
    },
  };
  function applyBeaconOnly() { if (sky && enterU >= 1 && exitU === 0) sky.setBeacon(beaconLevel()); }
  return hall;
}
