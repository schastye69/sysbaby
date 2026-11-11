// halls/core/core.js — WP4. The CORE hall «ЯДРО» (SPEC §6.1) and its three «ЧЕГОООО» mechanics: UNFOLD with the live data
// rings (§3.6), РЕЗОНАНС (§3.7, S01) and the infinite PULL / DESCENT (§3.8, S02); the §3.5 click table, the §5.2 wheel
// contexts, the §8.3 motion hints S01 / S02 / S08 and the phone gestures of §10.1. SPEC-ADDENDUM A3.1, A4.1, A6.5.7, A2.3,
// A3.3, A2.4.2, A2.8, A11, A12 as amended for WP4 (ARCH-ADDENDUM X§5.3).
// No shell lattice of its own: CORE is the inside of VIN's 12-gon stratum (nest level 1) with the rim and the pillar
// (WP0/WP2). Rest pose = CAMERA.core (A12 МОНОЛИТ: low, looking up; phone: the Key centred at 44 %).
// Modules: today (СЕГОДНЯ), pull (zoom / PULL / DESCENT), unfold (+ rings), resonance, hints. This file routes input,
// owns the phases' hand-offs and composes the live camera.
import { Vector3 } from 'three';
import { roomByStratum } from '../../world/rooms.js';
import { app } from '../../core/store.js';
import { registerHookField } from '../../core/testhook.js';
import { CAMERA, coreFov, coreOffY } from '../../core/tokens.js';
import { createToday } from './today.js';
import { createPull } from './pull.js';
import { createUnfold } from './unfold.js';
import { createResonance } from './resonance.js';
import { createHints } from './hints.js';

/** @returns {Hall} */
export function createCoreHall(hctx) {
  const C = CAMERA.core;
  const restPos = new Vector3(...C.pos), restTarget = new Vector3(...C.target);
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: C.fov, offsetY: 0, roll: 0 };
  let current = false, built = false, slotOn = false, offKey = null, offVis = null;
  let today = null, pull = null, unfold = null, res = null, hints = null;

  /** Allocation-free (pose() is on the G9 hot-path list). sub 'open' → the unfolded pose. */
  function restPose(sub) {
    if (sub === 'open' && unfold) return unfold.pose(poseOut);
    poseOut.pos.copy(restPos); poseOut.target.copy(restTarget); poseOut.fov = coreFov(hctx.layout.kind);
    poseOut.offsetY = coreOffY(hctx.layout.kind); poseOut.roll = 0;
    return poseOut;
  }

  /** CORE is live: arrived — or the boot has already handed over (phase idle in CORE) while the director's arrival call
   *  is still queued behind the boot's last timeline frames: that gap counts as the arrival, so a first click in it is
   *  not dropped (arrive() later is idempotent). */
  const live = () => {
    if (!current && built && app.room === 'CORE' && !app.booting && app.phase === 'idle' && !hctx.director.busy()) current = true;
    return current;
  };
  /** The folded CORE at rest: the Key's clicks, the hold and the depth gestures are live. */
  const restIdle = () => live() && app.phase === 'idle' && !hctx.director.busy();

  function onKeyClick({ index }) {
    if (!restIdle() || (pull && pull.busy())) return;          // zoomed in or out (normal zoom) still clicks; a PULL does not
    if (res && res.pressing()) res.cancelPress();
    if (index === 3) { hctx.director.go('#/core/open', { source: 'key' }); return; }
    const r = roomByStratum(index);
    if (r) hctx.director.go(`#/${r.slug}`, { source: 'key' });     // N while sealed: the router guard shudders + «запечатано»
  }

  const hall = {
    id: 'CORE',
    build() {
      if (built) return;
      built = true;
      today = createToday(hctx);
      pull = createPull(hctx);
      unfold = createUnfold(hctx);
      res = createResonance(hctx, (index) => onKeyClick({ index }));
      hints = createHints(hctx, { pull, res });
      today.build();
      offKey = hctx.bus.on('key:click', onKeyClick);
      // G12: a hidden tab ends a hold (its voices stop) and silences the Shepard voice; the PULL's voice returns with the tab
      offVis = hctx.bus.on('visibility', ({ hidden }) => {
        if (hidden) { if (res) res.cancel(); if (pull) pull.sleep(true); } else if (pull) pull.sleep(false);
      });
      registerHookField('resonance', () => ({ mode: res ? res.mode() : null, t0: res ? res.t0() : null }));
    },
    pose(sub) { return restPose(sub); },
    livePose(out, dt) {
      if (res && res.livePose(out, dt)) return true;
      if (unfold && unfold.livePose(out, dt)) return true;
      if (pull && pull.livePose(out, dt)) return true;
      return false;
    },
    enter() {},
    exit() {},
    arrive() { current = true; },
    depart() {
      current = false;
      if (res) res.cancel();
      if (pull) pull.reset();
      if (unfold) unfold.depart();
      if (today) today.update(false);
    },
    setSub(sub, opts) {
      if (!unfold) return sub === 'open' || sub == null ? 0 : false;
      if (sub === 'open') {
        if (res) res.cancel();
        if (pull) pull.reset();
        return unfold.open(opts && opts.instant);
      }
      if (sub == null) return unfold.close(opts && opts.instant);
      return false;
    },
    update(dt, t) {
      if (pull) pull.update(dt, t);
      if (unfold) unfold.update(dt, t);
      if (res) res.update(dt, t);
      if (hints) hints.update(dt, t);
      const cur = live();
      if (today) today.update(cur && app.phase === 'idle' && !hctx.director.busy() && !(pull && (pull.moved() || pull.leading())) && !(res && res.pressing()));
      // phone portrait veil (chrome.css body.axis-slot): the top band lets the axis through only at the rest view
      const slot = cur && app.phase === 'idle' && !(pull && pull.moved());
      if (slot !== slotOn) { slotOn = slot; try { document.body.classList.toggle('axis-slot', slot); } catch (e) { /* no DOM */ } }
    },
    onGesture(g) {
      if (!live()) return false;
      // 1. РЕЗОНАНС owns its press from the first frame (shiver) to the release.
      if (res && res.onGesture(g)) return true;
      // 2. UNFOLD: rings, orbit, refold.
      if (unfold && unfold.isOpen()) return unfold.onGesture(g);
      // 3. Depth: zoom, PULL, DESCENT (and the absorbed input of a running PULL).
      if (pull && (pull.busy() || g.type === 'wheel' || g.type === 'pinchstart' || g.type === 'pinch' || g.type === 'pinchend')) {
        if (pull.onGesture(g)) return true;
      }
      if (app.phase !== 'idle') return false;
      // 4. The Key: hover explode, tap → key:click, drag yaw / pitch.
      return hctx.key ? hctx.key.onGesture(g) : false;
    },
    onKey(e) {
      if (res && res.onKey(e)) return true;
      if (unfold && unfold.isOpen() && e.key === 'Escape') { hctx.director.go('#/core', { source: 'kbd' }); return true; }
      return false;
    },
    resize() { if (today) today.resize(); if (pull) pull.resize(); if (unfold) unfold.resize(); if (res) res.resize(); },
    dispose() {
      if (offKey) { offKey(); offKey = null; }
      if (offVis) { offVis(); offVis = null; }
      for (const m of [hints, res, unfold, pull, today]) if (m) { try { m.dispose(); } catch (e) { /* idempotent */ } }
      hints = res = unfold = pull = today = null;
      current = false; built = false;
      registerHookField('resonance', () => null);
    },
  };
  if (__DEV__) hall._dev = { get pull() { return pull; }, get unfold() { return unfold; }, get res() { return res; } };
  return hall;
}
