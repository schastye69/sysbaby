// halls/voyages/chamberCtl.js — WP6: the mission chamber as a place (SPEC §6.3 «Mission chamber», A3.3, A3.4):
// the terrain of the open mission under its hatch, the orbit camera (drag: yaw ±40°, pitch −35…−70°, rest −50°, drags
// decay ×0.92 per frame), the chamber fog, the readable block (desktop left column / phone sheet), GIANT `004`, the
// probe hold (1,200 ms, `probeHold` rising tone, 2 px ember ring; early release unwinds 240 ms, no deny) and its flight,
// `ЗАПИСЬ ЗОНДА` + markLogRead (A3.3 `finish`), and the proposal chamber's `УБРАТЬ` hold.
import { createTerrain } from './terrain.js';
import { createChamberBlock, HOLD_MS, UNWIND_MS } from './chamber.js';
import { missionView, sendProbe, probeStatus, markLogRead } from './missionModel.js';
import { CHAMBER_Y, CHAMBER_AIM, ORBIT, chamberPose, chamberAt } from './layout.js';
import { lockIn, revealBody } from '../../ui/text.js';
import { vibrate, VIBE } from '../../ui/tactile.js';
import { ENV } from '../../core/env.js';
import { clamp01 } from '../../core/ease.js';
import { quality } from '../../core/quality.js';

export const CHAMBER_FOG = 0.0105;          // the chamber floats in fog: the terrain's far corners at ≈ 30 % visibility

export function createChamberCtl(hctx) {
  let terrain = null, kind = null, code = null, k = -1, proposal = null, visibleBlock = false;
  let hold = -1, holdAt = 0, unwind = -1, unwindFrom = 0, voice = null, removing = -1, removeAt = 0;
  const orbit = { yaw: 0, pitch: ORBIT.pitch, vy: 0, vp: 0, drag: false };
  const centre = { x: 0, z: 0, ux: 0, uz: -1 };
  const _pt = { x: 0, z: 0, ux: 0, uz: -1 };

  const block = createChamberBlock({
    onMember: (id) => hctx.director.go(`#/members/${id}`, { source: 'hall' }),
    onProbeDown: () => {
      if (kind !== 'mission' || hold >= 0 || probeStatus(code) !== 'none') return;
      hold = 0; holdAt = performance.now(); unwind = -1;
      voice = hctx.audio.start('probeHold', {});
      vibrate(VIBE.tap);
    },
    onProbeUp: () => {
      if (hold < 0) return;
      hold = performance.now() - holdAt;                     // the hold is measured on the wall clock (frame stalls never lengthen it)
      if (hold >= HOLD_MS) { completeProbe(); return; }
      unwindFrom = hold / HOLD_MS; unwind = 0;
      hold = -1;
      if (voice) { voice.stop(160); voice = null; }
    },
    onRemoveDown: () => { if (kind === 'proposal') { removing = 0; removeAt = performance.now(); } },
    onRemoveUp: () => {
      if (removing < 0) return;
      if (performance.now() - removeAt >= HOLD_MS) { removing = HOLD_MS; ctl.update(0, 0); return; }
      block.setHold(0); removing = -1;
    },
  });

  function completeProbe() {
    hold = -1;
    if (voice) { voice.stop(120); voice = null; }
    if (!sendProbe(code)) { block.setProbe(probeStatus(code)); return; }
    hctx.audio.play('probeFlight', {});                // its picture twin: the beam dot (always)
    vibrate(VIBE.step);
    if (terrain) terrain.launch();
    block.setProbe('out');
  }

  let sheetBusy = false;
  function sheetSet(c, o) { sheetBusy = true; try { hctx.sheet.set(c, o); } finally { sheetBusy = false; } }

  function placeBlock() {
    if (hctx.layout.isPhone) {
      sheetSet(block.root, { state: 'peek' });
    } else if (block.root.parentNode !== hctx.section) hctx.section.appendChild(block.root);
  }

  const ctl = {
    block,
    get kind() { return kind; },
    get code() { return code; },
    get index() { return k; },
    get terrain() { return terrain; },
    /** Prepares the chamber of mission `c` at spiral slot `kk` (terrain built, hidden); proposal p for a proposal. */
    prepare(c, kk, p) {
      if (terrain && code === c && kind === (p ? 'proposal' : 'mission')) return;
      ctl.release();
      code = c; k = kk; proposal = p || null; kind = p ? 'proposal' : 'mission';
      chamberAt(kk, centre);
      orbit.yaw = 0; orbit.pitch = ORBIT.pitch; orbit.vy = orbit.vp = 0;
      if (!p && hctx.group) {
        const m = hctx.world.missions.find((x) => x.code === c);
        const v = m ? missionView(m) : null;
        terrain = createTerrain({ code: c, levels: (quality.params && quality.params.contours) || 12, done: !!v && v.state === 'done' });
        terrain.group.position.set(centre.x, CHAMBER_Y, centre.z);
        terrain.setAlpha(0);
        hctx.group.add(terrain.group);
      }
    },
    /** Builds and shows the readable block (after the ШЛЮЗ, or at once on a deep link / reduced motion). */
    showBlock(instant) {
      if (kind === 'mission') {
        const m = hctx.world.missions.find((x) => x.code === code);
        if (!m) return;
        const v = missionView(m);
        const by = hctx.host && hctx.host.proposals ? hctx.host.proposals.proposedByName(code) : null;
        block.mission(v, by);
        const st = v.canProbe ? 'none' : v.probe === 'none' ? 'locked' : v.probe;
        block.setProbe(st, m.log);
        hctx.datum.setGiant(v.numberShown);
      } else if (kind === 'proposal') {
        const op = hctx.world.members.find((x) => x.id === hctx.world.operator.id);
        block.proposal(proposal, (op && op.name) || hctx.world.operator.name);
        hctx.datum.setGiant(proposal.id);
      } else return;
      placeBlock();
      visibleBlock = true;
      block.root.classList.remove('is-out');
      if (ENV.reducedMotion) {                                        // §12.4: the readout crossfades in 160 ms
        block.root.style.opacity = '0';
        requestAnimationFrame(() => { block.root.style.opacity = ''; });
      }
      if (!instant && !ENV.reducedMotion) {
        if (block.heading) lockIn(block.heading, { weight: 560, ms: 480 });
        for (const p of block.root.querySelectorAll('.t-brief, .t-body')) revealBody(p);
      }
      if (kind === 'mission' && probeStatus(code) === 'back') markLogRead(code);   // A3.3: ЗАПИСЬ ЗОНДА is on screen
    },
    hideBlock() {
      if (!visibleBlock) return;
      visibleBlock = false;
      block.root.classList.add('is-out');
      if (hctx.layout.isPhone) sheetSet(null);
      else block.root.remove();
      hctx.datum.setGiant(null);
      ctl.cancelHolds();
    },
    setBlockAlpha(a) { block.root.style.opacity = String(a); },
    /** Orbit camera, hall-local (allocation-free). */
    pose(out) { return chamberPose(centre.x, CHAMBER_AIM, centre.z, orbit.yaw, orbit.pitch, out, centre.ux, centre.uz); },
    restPose(kk, out) { chamberAt(kk, _pt); return chamberPose(_pt.x, CHAMBER_AIM, _pt.z, 0, ORBIT.pitch, out, _pt.ux, _pt.uz); },
    get centre() { return centre; },
    /** true while this module itself is changing the sheet (its 'closed' is not the visitor's swipe) */
    get sheetBusy() { return sheetBusy; },
    debug() { return { hold, unwind, kind, code, removing }; },
    drag(g) {
      if (g.type === 'dragstart') { orbit.drag = true; orbit.vy = orbit.vp = 0; return true; }
      if (g.type === 'drag') {
        orbit.vy = -g.dx * 0.22; orbit.vp = -g.dy * 0.18;
        orbit.yaw = Math.max(-ORBIT.yawMax, Math.min(ORBIT.yawMax, orbit.yaw + orbit.vy));
        orbit.pitch = Math.max(ORBIT.pitchMin, Math.min(ORBIT.pitchMax, orbit.pitch + orbit.vp));
        return true;
      }
      if (g.type === 'dragend' || g.type === 'cancel') { orbit.drag = false; return true; }
      return false;
    },
    /** Per frame (dt s). */
    update(dt, msLoop) {
      const ms = msLoop != null ? msLoop : dt * 1000;
      if (!orbit.drag && (orbit.vy || orbit.vp)) {           // inertia ×0.92 per 16.7 ms
        const d = Math.pow(0.92, ms / 16.7);
        orbit.vy *= d; orbit.vp *= d;
        if (Math.abs(orbit.vy) < 0.01 && Math.abs(orbit.vp) < 0.01) orbit.vy = orbit.vp = 0;
        orbit.yaw = Math.max(-ORBIT.yawMax, Math.min(ORBIT.yawMax, orbit.yaw + orbit.vy));
        orbit.pitch = Math.max(ORBIT.pitchMin, Math.min(ORBIT.pitchMax, orbit.pitch + orbit.vp));
      }
      if (hold >= 0) {
        hold = performance.now() - holdAt;
        block.setHold(clamp01(hold / HOLD_MS));
        if (hold >= HOLD_MS) completeProbe();
      } else if (unwind >= 0) {
        unwind += ms;
        const f = unwindFrom * (1 - clamp01(unwind / UNWIND_MS));
        block.setHold(f);
        if (unwind >= UNWIND_MS) unwind = -1;
      }
      if (removing >= 0) {
        removing = Math.max(removing, performance.now() - removeAt);
        block.setHold(clamp01(removing / HOLD_MS));
        if (removing >= HOLD_MS) {
          removing = -1;
          const id = proposal && proposal.id;
          if (id && hctx.host && hctx.host.proposals) hctx.host.proposals.remove(id);
          if (ctl.onRemoved) ctl.onRemoved(id);
        }
      }
      if (terrain) terrain.update(ms);
    },
    cancelHolds() {
      if (hold >= 0) { hold = -1; block.setHold(0); }
      unwind = -1; removing = -1;
      if (voice) { voice.stop(80); voice = null; }
    },
    /** Disposes the terrain and forgets the chamber. */
    release() {
      ctl.cancelHolds();
      if (terrain) { terrain.dispose(); terrain = null; }
      kind = null; code = null; k = -1; proposal = null;
    },
    onRemoved: null,
    dispose() { ctl.hideBlock(); ctl.release(); block.dispose(); },
  };
  return ctl;
}
