// halls/archive/archive.js — WP7: ARCHIVE «ЛЕТОПИСЬ» `#/archive` ▽ +810.00 (SPEC §6.4, §7.4 «Керн», §2.7, §7.6, §10.1,
// §4.5, §12.4; SPEC-ADDENDUM A3.5, A11.4, A11.6; ARCH §6.8, ARCH-ADDENDUM X§5.3 WP7).
//
// The camera stands on the axis of a vertical core sample (r 9 m) that the deck curls into on arrival. Time is the wall:
// one band per legend / achievement / moment / joke / deed, newest at the top, «ДО НАЧАЛА» at the bottom. Wheel, drag
// and ←/→ move the eye along the axis (scroll.js); the centred band is read on the right (desktop) or in the sheet
// (phone); finds can be extracted and held (finds.js). Sub routes `#/archive/<band id>` centre that band; the route
// follows the reading position (replaceState) once the wall comes to rest.
import { Vector3 } from 'three';
import { buildTimeline, indexOfSub } from './timeline.js';
import { createWall, createDatum, createBeforePoint, createCurl, TUBE_R, EYE_BELOW, CAM_Z } from './bands.js';
import { createFinds } from './finds.js';
import { createReading, READ_THETA } from './reading.js';
import { createScroll } from './scroll.js';
import { adjacentRoom } from '../../nav/elevator.js';
import { ROOMS } from '../../world/rooms.js';
import { anniversaries, now as timeNow } from '../../core/time.js';
import { ENV } from '../../core/env.js';
import { CAMERA, ELECTRUM } from '../../core/tokens.js';
import { vibrate, VIBE } from '../../ui/tactile.js';

const DEG = Math.PI / 180;
const FOV = CAMERA.fov;
const OFFSET = Object.freeze({ desktop: -0.10, phone: -0.075, 'phone-land': -0.04 });
const ROUTE_REST_MS = 420;          // the wall at rest this long → the route follows the reading position
const s01 = (a, b, x) => { const t = x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a); return t * t * (3 - 2 * t); };

/** @returns {Hall} */
export function createArchiveHall(hctx) {
  const id = hctx.id;
  let bands = [], y0 = 0, wall = null, datum = null, beforePt = null, curl = null, finds = null, reading = null, scroll = null;
  let current = false, enterA = 0, exitA = 0, annIdx = -1, annStart = -1, built = false;
  let hover = -1, focus = -1, lastCentre = -1, lastTick = -1e9, restSince = -1, selfRoute = false;
  let entrySub = undefined, entryIdx = 0, sig = -1, sigT = 0, lastNow = -1, revealed = true, frameEma = 16.7;
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: FOV, offsetY: 0, roll: 0 };
  const _c = new Vector3(), _r = new Vector3(), _q = new Vector3(), _dir = new Vector3();
  const ray = { origin: new Vector3(), direction: new Vector3() };

  const centreY = (i) => y0 + bands[i].y;
  const eyeOf = (i) => centreY(i) - EYE_BELOW;
  const kind = () => hctx.layout.kind;
  const reduced = () => !!ENV.reducedMotion;

  /** The band ARCHIVE opens at without a sub: today's anniversary legend, else the newest band. */
  function restIndex() { return annIdx >= 0 ? annIdx : 0; }
  function anniversaryIndex() {
    let list = [];
    try { list = anniversaries(timeNow()); } catch (e) { list = []; }
    if (!list.length) return -1;
    return indexOfSub(bands, `legend-${list[0].id}`);
  }
  /** A cheap numeric signature of the data the timeline reads (found jokes, deed records). */
  function dataSig() {
    const d = hctx.state.data || {};
    const jf = Array.isArray(d.jokesFound) ? d.jokesFound.length : 0;
    const sb = d.sbor || {}, lo = d.lost || {}, sh = d.shows || {};
    return jf * 1e8 + ((sb.count | 0) + (Array.isArray(sb.here) ? sb.here.length * 37 : 0)) * 1e5
      + ((lo.saved | 0) + (lo.pairs | 0) * 13 + (Array.isArray(lo.log) ? lo.log.length * 101 : 0)) * 100
      + (sh.count | 0) + (Array.isArray(sh.log) ? sh.log.length * 7 : 0);
  }

  function buildAll() {
    bands = buildTimeline();
    y0 = 2.0 + EYE_BELOW - bands[0].y;                          // the newest band's eye at 2.0 m above the deck
    if (hctx.group) {
      wall = createWall(bands, y0, hctx.group);
      datum = createDatum(hctx.group);
      beforePt = createBeforePoint(hctx.group, centreY(bands.length - 1));
      curl = curl || createCurl(hctx.group, hctx.meta.n);
      finds = createFinds(hctx, bands, y0);
      finds.place(kind());
      finds.setReduced(reduced());
      finds.addProxies((k) => onFindActivate(k), (k) => { if (current && (!finds || finds.held < 0)) setHover(k >= 0 ? finds.list[k].bi : -1); });
    }
    reading = createReading(hctx, bands, y0);
    scroll = createScroll(bands.length, centreY, { eyeBelow: EYE_BELOW });
    scroll.setReduced(reduced());
    annIdx = anniversaryIndex();
    if (wall) wall.setAccentBand(annIdx);
    sig = dataSig();
  }
  function disposeAll() {
    if (wall) { wall.dispose(); wall = null; }
    if (datum) { datum.dispose(); datum = null; }
    if (beforePt) { beforePt.dispose ? beforePt.dispose() : null; if (beforePt.object.parent) beforePt.object.parent.remove(beforePt.object); beforePt = null; }
    if (finds) { finds.dispose(); finds = null; }
    if (reading) { reading.dispose(); reading = null; }
  }
  /** Data changed (a joke found, a deed band): rebuild, keeping the band being read. */
  function rebuild() {
    const keep = bands[scroll ? scroll.centre() : 0];
    const keepId = keep ? keep.id : null;
    const wasCurrent = current;
    disposeAll();
    buildAll();
    const i = keepId ? (keepId === 'before' ? bands.length - 1 : Math.max(0, indexOfSub(bands, keepId))) : 0;
    scroll.goTo(i, true);
    lastCentre = -1; focus = -1; hover = -1;
    applyAlpha();
    if (wasCurrent) { reading.mount(); reading.show(i, false); }
  }

  // ── Alpha (enter/exit) ──
  function applyAlpha() {
    const a = s01(0.38, 1, enterA) * (1 - s01(0, 1, exitA));
    if (wall) wall.setAlpha(a);
    if (datum) datum.setAlpha(0.30 * s01(0.5, 1, enterA) * (1 - exitA));
    if (beforePt) beforePt.setAlpha(a);
    if (finds) finds.setAlpha(s01(0.6, 1, enterA) * (1 - s01(0, 0.8, exitA)));
    if (reading) reading.setVisible(current || enterA >= 0.7 ? s01(0.7, 1, enterA) * (1 - Math.min(1, exitA * 2)) : 0);
  }

  // ── Finds ──
  function onFindActivate(k) {
    if (!finds || !current) return;
    if (finds.held === k) { putBack(); return; }
    const f = finds.list[k];
    if (scroll.centre() !== f.bi) scroll.goTo(f.bi, false);
    finds.extract(k);
    // A pointer activation leaves no keyboard focus ring (the ember cross is for Tab focus only).
    const btn = f.proxy && f.proxy.button;
    if (btn && document.activeElement === btn && !btn.matches(':focus-visible')) btn.blur();
    if (hctx.audio) hctx.audio.play('select', {});
    if (hctx.layout.isPhone) vibrate(VIBE.tap);
  }
  function putBack(instant) {
    if (!finds || finds.held < 0) return false;
    finds.putBack(instant);
    if (hctx.audio && !instant) hctx.audio.play('tick', {});
    return true;
  }

  // ── Overrun to the adjacent hall (A11 direction: older/down → MEMBERS, newer/up → SIGNAL) ──
  function overrun(dir) {
    const to = adjacentRoom(id, dir);
    if (!to) return;
    putBack(true);
    hctx.director.go(`#/${ROOMS[to].slug}`, { source: 'hall' });
  }

  // ── Hover: which band / find is under the pointer (ray ∩ the tube) ──
  function bandAt(x, y) {
    if (!hctx.rig || !hctx.rig.camera) return -1;
    hctx.rig.ray(x, y, ray);
    hctx.scale.toCanonical(ray.origin, _c); _c.sub(hctx.meta.anchor);
    _dir.copy(ray.direction);
    const a = _dir.x * _dir.x + _dir.z * _dir.z;
    if (a < 1e-6) return -1;
    const b = 2 * (_c.x * _dir.x + _c.z * _dir.z), c = _c.x * _c.x + _c.z * _c.z - TUBE_R * TUBE_R;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return -1;
    const t = (-b + Math.sqrt(disc)) / (2 * a);
    const yy = _c.y + _dir.y * t;
    for (let i = 0; i < bands.length; i++) {
      const b0 = centreY(i);
      if (Math.abs(yy - b0) <= bands[i].height / 2 + 0.2) return i;
    }
    return -1;
  }
  function setHover(i) {
    if (i === hover) return;
    if (wall && hover >= 0) wall.setGain(hover, 1);
    hover = i;
    if (wall && hover >= 0) wall.setGain(hover, 1.25);
    if (reading) reading.setHover(i);
  }

  /** The wheel's own time: the native event's timeStamp while it is being dispatched (a burst of events delivered
   *  late behind a slow frame keeps its real spacing), else performance.now(). */
  function evNow() {
    const e = typeof window !== 'undefined' ? window.event : null;
    return e && typeof e.timeStamp === 'number' && e.timeStamp > 0 ? e.timeStamp : performance.now();
  }
  function pxPerM() { return (hctx.layout.h / 2) / Math.tan((FOV * DEG) / 2) / (TUBE_R - CAM_Z); }

  // ── Route follows the reading position (replaceState), once the wall rests ──
  function syncRoute(now) {
    if (!current || !scroll || scroll.moving || (finds && finds.busy)) { restSince = -1; return; }
    if (hctx.app.phase !== 'idle' || (hctx.director.busy && hctx.director.busy())) { restSince = -1; return; }
    if (restSince < 0) { restSince = now; return; }
    if (now - restSince < ROUTE_REST_MS) return;
    const b = bands[scroll.centre()];
    const want = b.kind === 'before' ? null : b.id;
    const cur = hctx.app.route && hctx.app.route.room === 'ARCHIVE' ? hctx.app.route.sub : undefined;
    if (cur === undefined || cur === want) return;
    selfRoute = true;
    try { hctx.director.go(want ? `#/archive/${want}` : '#/archive', { source: 'hall', replace: true }); } finally { selfRoute = false; }
  }

  /** Reduced motion: a band move is a cut, so the reading follows on the same frame as the input. */
  function syncCentre() {
    if (!reduced() || !scroll) return;
    const c = scroll.centre();
    if (c !== lastCentre) { lastCentre = c; centreChanged(c, true); }
  }
  function centreChanged(i, reveal) {
    if (reading) reading.show(i, reveal);
    if (reading) reading.setCentre(i);
    if (finds) finds.setFocusBand(i);
    focus = i;
    lampToCentre();
  }
  function lampToCentre() {
    if (!hctx.lamp || !finds || focus < 0) return;
    const k = finds.byBand[focus];
    if (finds.held >= 0) { finds.renderPos(finds.held, _r); hctx.lamp.setFocus(_r, 0.5); return; }
    if (k >= 0) { finds.renderPos(k, _r); hctx.lamp.setFocus(_r, 1.1); return; }
    _q.set(-TUBE_R * Math.sin(READ_THETA * 0.3), centreY(focus), TUBE_R * 0.98);
    hctx.toCanonical(_q, _c); hctx.scale.toRender(_c, _r);
    hctx.lamp.setFocus(_r, 1.4);
  }

  /** Camera eye (hall-local y) from the rig (travel, source/destination) — allocation-free. */
  function camEye() {
    if (!hctx.rig || !hctx.rig.camera || !hctx.scale) return scroll ? scroll.eye() : 0;
    hctx.scale.toCanonical(hctx.rig.camera.position, _c);
    return _c.y - hctx.meta.anchor.y;
  }

  const hall = {
    id,
    build() {
      buildAll();
      if (hctx.shell) hctx.shell.setDeckVisible(false);
      built = true;
      enterA = 0; exitA = 0;
      applyAlpha();
      if (curl) curl.setAlpha(0);
    },
    /** PURE rest pose: the band of `sub` (or today's anniversary / the newest band) at eye level, looking at the wall. */
    pose(sub) {
      let i = sub == null ? restIndex() : indexOfSub(bands, sub);
      if (i < 0) i = restIndex();
      const eye = bands.length ? eyeOf(i) : 1.6;
      poseOut.pos.set(0, eye, CAM_Z);
      poseOut.target.set(0, eye, TUBE_R);
      poseOut.fov = FOV; poseOut.offsetY = OFFSET[kind()] != null ? OFFSET[kind()] : 0; poseOut.roll = 0;
      return poseOut;
    },
    livePose(out) {
      if (!current || !scroll) return false;
      const eye = scroll.eye();
      out.pos.set(0, eye, CAM_Z);
      out.target.set(0, eye, TUBE_R);
      out.fov = FOV; out.offsetY = OFFSET[kind()] != null ? OFFSET[kind()] : 0; out.roll = 0;
      return true;
    },
    /** «Керн» arrival build (PURE in u): the deck curls into the tube, the bands condense, finds and DOM fade in. */
    enter(u) {
      enterA = u;
      if (u > 0) exitA = 0;
      if (curl && wall && bands.length) {
        const to = hctx.director && hctx.director.state ? hctx.director.state.to : null;
        const sub = to && to.room === id ? to.sub : null;
        if (sub !== entrySub) { entrySub = sub; const k = sub == null ? -1 : indexOfSub(bands, sub); entryIdx = k >= 0 ? k : restIndex(); }
        const yC = centreY(entryIdx);
        const p = s01(0, 0.92, u);
        const ca = s01(0, 0.12, u) * (1 - s01(0.6, 0.98, u));
        if (ca > 0.001 && !reduced()) { curl.setU(p, eyeOf(entryIdx) - 1.6, yC); curl.setAlpha(0.95 * ca); } else curl.setAlpha(0);
        wall.setSpread(reduced() ? 1 : 1 + 0.9 * (1 - s01(0.3, 1, u)), yC);
      }
      applyAlpha();
    },
    exit(u) {
      exitA = u;
      if (wall && bands.length && !reduced()) wall.setSpread(1 + 0.5 * u, scroll ? scroll.eye() + EYE_BELOW : 0);
      applyAlpha();
    },
    arrive(info) {
      current = true; enterA = 1; exitA = 0;
      if (curl) curl.setAlpha(0);
      if (wall) wall.setSpread(1, 0);
      const sub = info && info.sub ? info.sub : null;
      const k = sub == null ? -1 : indexOfSub(bands, sub);
      const i = k >= 0 ? k : restIndex();
      scroll.setReduced(reduced());
      if (finds) finds.setReduced(reduced());
      scroll.goTo(i, true);
      reading.mount();
      lastCentre = i;
      centreChanged(i, true);
      annStart = annIdx >= 0 && i === annIdx && info && info.first ? hctx.loop.now : -1;   // SPEC durations: loop time
      applyAlpha();
    },
    depart() {
      current = false;
      putBack(true);
      setHover(-1);
      restSince = -1;
      if (reading) reading.unmount();
      annStart = -1;
    },
    setSub(sub, opts) {
      if (selfRoute) return 0;
      if (!scroll) return false;
      const k = sub == null ? restIndex() : indexOfSub(bands, sub);
      if (k < 0) return false;
      putBack(true);
      const instant = !!(opts && opts.instant) || reduced();
      scroll.goTo(k, instant);
      if (instant) { lastCentre = k; centreChanged(k, false); return 0; }
      return 480;
    },
    update(dt0, t) {
      if (!built || !scroll) return;
      const now = hctx.loop.now;
      // UI physics (scroll spring, detents, extraction) run on wall-clock frame time (capped 500 ms), not the 50 ms-
      // clamped world dt, so a slow frame never stretches a 600 ms spring or a detent snap.
      const pn = performance.now();
      const dt = lastNow < 0 ? dt0 : Math.min(0.5, Math.max(0, (pn - lastNow) / 1000));
      lastNow = pn;
      frameEma += (dt * 1000 - frameEma) * 0.2;
      scroll.setFrameMs(frameEma);
      if (current) {
        scroll.update(dt, now);
        const c = scroll.centre();
        if (c !== lastCentre) {
          lastCentre = c;
          // While the wall is moving the block swaps its text instantly; the lock-in plays once it settles.
          centreChanged(c, false);
          revealed = false;
          if (now - lastTick > 60) { lastTick = now; if (hctx.audio) hctx.audio.play('tick', {}); if (hctx.layout.isPhone) vibrate(VIBE.tick); }
        }
        if (!revealed && !scroll.moving) { revealed = true; if (reading) reading.reveal(); }
        syncRoute(now);
        if (now - sigT > 500) { sigT = now; if (dataSig() !== sig && (!finds || !finds.busy)) rebuild(); }
      }
      // Everything drawn or projected follows the camera actually rendered (the director writes livePose each idle frame).
      const eye = camEye();
      // Draw only the bands near the eye (± 9 m).
      if (wall) {
        let i0 = 0, i1 = bands.length - 1;
        while (i0 < bands.length - 1 && centreY(i0) - bands[i0].height / 2 > eye + 9) i0++;
        while (i1 > 0 && centreY(i1) + bands[i1].height / 2 < eye - 9) i1--;
        wall.setVisibleRange(i0, Math.max(i0, i1));
        // Anniversary: electrum 2,500 ms then 600 ms cool to silver; the ember edge all day.
        if (annIdx >= 0) {
          let el = 0;
          if (annStart >= 0) {
            const e = now - annStart;
            el = e < ELECTRUM.maxMs ? 1 : Math.max(0, 1 - (e - ELECTRUM.maxMs) / ELECTRUM.coolMs);
            if (el <= 0) annStart = -1;
          }
          wall.setAccent(el, Math.abs(centreY(annIdx) - eye) < 6 ? 1 : 0);
        }
      }
      if (datum) datum.mesh.position.y = eye;
      if (beforePt) beforePt.object.visible = enterA > 0 && Math.abs(centreY(bands.length - 1) - eye) < 4;
      if (finds) {
        const proxiesOn = current || enterA >= 0.7;
        finds.update(dt, eye, proxiesOn && exitA === 0);
        if (finds.held >= 0 && hctx.lamp && current) { finds.renderPos(finds.held, _r); hctx.lamp.setFocus(_r, 0.5); }
      }
      if (reading) reading.update(eye);
      void t;
    },
    onGesture(g) {
      if (!current || !scroll) return false;
      const held = finds ? finds.held : -1;
      switch (g.type) {
        case 'wheel': {
          if (held >= 0) return true;
          const r = scroll.wheel(g.deltaY || 0, evNow());
          syncCentre();
          if (r === 'next') overrun(1); else if (r === 'prev') overrun(-1);
          return true;
        }
        case 'hover': {
          if (held >= 0) { setHover(-1); return false; }
          const fk = finds ? finds.hit(g.x, g.y) : -1;
          setHover(fk >= 0 ? finds.list[fk].bi : bandAt(g.x, g.y));
          return false;
        }
        case 'leave': setHover(-1); return false;
        case 'tap': {
          if (held >= 0) { putBack(); return true; }
          const fk = finds ? finds.hit(g.x, g.y) : -1;
          if (fk >= 0) { onFindActivate(fk); return true; }
          const bi = bandAt(g.x, g.y);
          if (bi >= 0 && bi !== scroll.centre()) { scroll.goTo(bi, false); return true; }
          return false;
        }
        case 'dragstart':
          if (held >= 0) { finds.rotateBy(g.dx, g.dy); return true; }
          if (Math.abs(g.ty) < Math.abs(g.tx)) return false;    // horizontal: not time
          scroll.dragStart(); scroll.drag(g.ty, pxPerM());
          return true;
        case 'drag':
          if (held >= 0) { finds.rotateBy(g.dx, g.dy); return true; }
          if (!scroll.dragging) return false;
          scroll.drag(g.ty, pxPerM());
          return true;
        case 'dragend': {
          if (held >= 0) { finds.fling(g.vx, g.vy); return true; }
          if (!scroll.dragging) return false;
          const r = scroll.dragEnd(g.vy, pxPerM());
          if (r === 'next') overrun(1); else if (r === 'prev') overrun(-1);
          return true;
        }
        case 'swipe': return g.dir === 'up' || g.dir === 'down' || held >= 0;
        case 'cancel':
          if (scroll.dragging) scroll.dragEnd(0, pxPerM());
          return false;
        default: return false;
      }
    },
    onKey(e) {
      if (!current || !scroll) return false;
      const held = finds ? finds.held : -1;
      switch (e.key) {
        case 'ArrowRight': if (held >= 0) putBack(true); scroll.step(1); syncCentre(); return true;
        case 'ArrowLeft': if (held >= 0) putBack(true); scroll.step(-1); syncCentre(); return true;
        case 'Escape': return putBack();
        case 'Enter': case ' ': case 'Spacebar': {
          if (held >= 0) { putBack(); return true; }
          const k = finds ? finds.byBand[scroll.centre()] : -1;
          if (k >= 0) { onFindActivate(k); return true; }
          return false;
        }
        default: return false;
      }
    },
    resize() {
      if (finds) finds.place(kind());
      if (current && reading) { reading.unmount(); reading.mount(); const i = reading.shown; if (i >= 0) { reading.show(-1); reading.show(i, false); } }
    },
    /** X§2.4.5: where a lost mini-Key may stand — six points 6 m out in front of the reading eye (PURE). */
    lostSpots() {
      const eye = scroll ? scroll.eye() : 1.6;
      const out = [];
      const ths = [-14, -7, 0, 7, -10, 4];
      for (let k = 0; k < ths.length; k++) {
        const th = ths[k] * DEG, r = 6;
        out.push(new Vector3(-r * Math.sin(th), eye + (k % 2 ? -0.35 : 0.25), r * Math.cos(th)));
      }
      return out;
    },
    dispose() {
      current = false;
      disposeAll();
      if (curl) { curl.dispose(); curl = null; }
      built = false;
    },
  };
  if (__DEV__) {
    Object.defineProperty(hall, '_bands', { get: () => bands.map((b) => ({ id: b.id, kind: b.kind, height: b.height, title: b.title })) });
    Object.defineProperty(hall, '_qa', { get: () => ({ s: scroll ? scroll.s : 0, target: scroll ? scroll.target : 0, centre: scroll ? scroll.centre() : -1,
      held: finds ? finds.held : -1, hover, ann: annIdx, eye: scroll ? scroll.eye() : 0 }) });
  }
  return hall;
}
