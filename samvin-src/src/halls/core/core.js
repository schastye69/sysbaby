// halls/core/core.js — WP4 SEED (ARCH §6.1.5): the CORE hall «ЯДРО». No shell lattice of its own (CORE uses the nest
// levels + the rim). Rest pose SPEC §6.1 (desktop; phone the same with the Key centred at 44 %: offsetY −0.06); livePose =
// wheel / pinch zoom 3.2–12.0 m (×1.1 per 100 px), no PULL. Gestures go to the Key first; a click on a stratum DIVEs,
// • unfolds (#/core/open → app.unfolded, phase 'unfolded', gaps 0.42), N is sealed until NADIR opens (router guard).
// WP4 replaces this file completely (keeping createCoreHall).
import { Vector3 } from 'three';
import { roomByStratum } from '../../world/rooms.js';
import { setPhase } from '../../core/store.js';
import { CAMERA, ZOOM, GAP } from '../../core/tokens.js';

/** @returns {Hall} */
export function createCoreHall(hctx) {
  const app = hctx.app;
  const C = CAMERA.core;
  const restPos = new Vector3(...C.pos), restTarget = new Vector3(...C.target);
  // The zoom works in real metres from the Key (SPEC §3.8: 3.2–12.0 m) and starts at the rest pose's own distance (A12:
  // МОНОЛИТ's low hero angle sits ≈ 6.1 m out) — measured from the pose itself, so it can never disagree with it.
  const REST_D = restPos.distanceTo(restTarget);
  let dist = REST_D, current = false, offKey = null, open = false, slotOn = false;

  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: C.fov, offsetY: 0, roll: 0 };
  /** Allocation-free (pose() is on the G9 hot-path list). */
  function restPose() {
    poseOut.pos.copy(restPos); poseOut.target.copy(restTarget); poseOut.fov = C.fov;
    poseOut.offsetY = hctx.layout.kind === 'desktop' ? 0 : C.phoneOffsetY; poseOut.roll = 0;
    return poseOut;
  }

  function onKeyClick({ index }) {
    if (!current || hctx.director.busy() || (app.phase !== 'idle' && app.phase !== 'unfolded')) return;
    if (index === 3) { hctx.director.go(open ? '#/core' : '#/core/open', { source: 'key' }); return; }
    const r = roomByStratum(index);
    if (r) hctx.director.go(`#/${r.slug}`, { source: 'key' });     // N while sealed: the router guard shudders
  }

  function setOpen(b) {
    open = b;
    app.unfolded = b;
    if (hctx.key) {
      hctx.key.overrideGroup(b ? { gap: GAP.unfold } : null);
      hctx.key.setOverrideWeight(1);
    }
  }

  const hall = {
    id: 'CORE',
    build() { offKey = hctx.bus.on('key:click', onKeyClick); },
    pose() { return restPose(); },
    livePose(out) {
      if (Math.abs(dist - REST_D) < 1e-4) return false;
      out.target.copy(restTarget);
      out.pos.copy(restPos).sub(restTarget).multiplyScalar(dist / REST_D).add(restTarget);
      out.fov = C.fov; out.offsetY = hctx.layout.kind === 'desktop' ? 0 : C.phoneOffsetY; out.roll = 0;
      return true;
    },
    enter() {},
    exit() {},
    arrive() { current = true; dist = REST_D; },
    depart() {
      current = false;
      if (open) setOpen(false);
    },
    setSub(sub) {
      if (sub === 'open') {
        if (!open) { setOpen(true); if (app.phase === 'idle') setPhase('unfolded'); }
        return 0;
      }
      if (sub == null) {
        if (open) { setOpen(false); if (app.phase === 'unfolded') setPhase('idle'); }
        return 0;
      }
      return false;
    },
    update() {
      // phone portrait veil (chrome.css body.axis-slot): the top band lets the axis through only at the rest view
      const slot = current && app.phase === 'idle' && dist >= REST_D - 1e-3;
      if (slot !== slotOn) { slotOn = slot; try { document.body.classList.toggle('axis-slot', slot); } catch (e) { /* no DOM */ } }
    },
    onGesture(g) {
      if (hctx.key && hctx.key.onGesture(g)) return true;
      if (g.type === 'wheel') {
        dist = Math.max(ZOOM.min, Math.min(ZOOM.max, dist * Math.pow(ZOOM.wheelFactor, g.deltaY / ZOOM.wheelStepPx)));
        return true;
      }
      if (g.type === 'pinch') {
        dist = Math.max(ZOOM.min, Math.min(ZOOM.max, dist / Math.max(0.2, g.dScale || 1)));
        return true;
      }
      return false;
    },
    onKey(e) {
      if (e.key === 'Escape' && open) { hctx.director.go('#/core', { source: 'kbd' }); return true; }
      return false;
    },
    resize() {},
    dispose() {
      if (offKey) { offKey(); offKey = null; }
      if (open) setOpen(false);
      current = false;
    },
  };
  return hall;
}
