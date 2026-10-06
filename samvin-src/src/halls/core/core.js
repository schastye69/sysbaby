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
  let dist = ZOOM.rest, current = false, offKey = null, open = false;

  function restPose() {
    const c = CAMERA.core;
    return { pos: new Vector3(...c.pos), target: new Vector3(...c.target), fov: c.fov,
      offsetY: hctx.layout.kind === 'desktop' ? 0 : c.phoneOffsetY, roll: 0 };
  }
  const rest = restPose();

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
      if (Math.abs(dist - ZOOM.rest) < 1e-4) return false;
      const p = restPose();
      out.target.copy(p.target);
      out.pos.copy(p.pos).sub(p.target).multiplyScalar(dist / ZOOM.rest).add(p.target);
      out.fov = p.fov; out.offsetY = p.offsetY; out.roll = 0;
      return true;
    },
    enter() {},
    exit() {},
    arrive() { current = true; dist = ZOOM.rest; },
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
    update() {},
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
    resize() { const p = restPose(); rest.pos.copy(p.pos); rest.offsetY = p.offsetY; },
    dispose() {
      if (offKey) { offKey(); offKey = null; }
      if (open) setOpen(false);
      current = false;
    },
  };
  return hall;
}
