// halls/core/unfold.js — WP4. UNFOLD / REFOLD, route #/core/open (SPEC §3.6, §7.6; SPEC-ADDENDUM A3.1, A4.1 entry verb,
// A6.5 width, A11.7 motto + about; A12 rest pose).
// The open timeline (ms; the first ever 2,200 with the stretched windows A 120–900 · B 900–1,900 · C 1,900–2,200):
//   0–120      anticipation: strata contract 3 %, nucleus ×1.6, the sub swell
//   A 120–600  gaps 0.02 → 0.42 m (heavy), signs to the camera, grains lift into the loose shell; width 1 → 1.5 (haas 8 ms desktop)
//   B 600–1300 the camera dollies from the rest pose to (0, 0.04, 0.95) inside the Key, level with the nucleus; every stratum
//              ×2.4 in radius, its rim a horizontal data ring round the camera (the lens opens 35° → 56° so the strata
//              above and below read as stacked rings)
//   C 1300–1600 the nucleus ignites (1 frame --white → ember), the motto BEAM WRITES under it (LEAD), the member plates orbit
// REFOLD = the exact reverse in 900 ms, ending in the 42 Hz thud (recallThud); width → 1. Every visual is a pure
// function of the timeline position, so a refold started mid-unfold reverses from where it is.
// Open: ring hover brightens 25 % + LABEL «→ {room}», ring click / proxy → DIVE from this pose, drag → orbit yaw ±35°
// with inertia; Esc, a click on empty space, wheel-out or a closing pinch → REFOLD (#/core).
import { Vector3, Matrix4 } from 'three';
import { app, setPhase } from '../../core/store.js';
import { loop } from '../../core/loop.js';
import { after } from '../../core/clock.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01, smoothstep, lerp } from '../../core/ease.js';
import { state } from '../../core/state.js';
import { audio } from '../../audio/engine.js';
import { rig } from '../../render/cameraRig.js';
import { anticipation } from '../../nav/paths.js';
import { WORLD } from '../../data/world.js';
import { STRATA_GEOM, CAMERA, KEY, GAP, TIMING, CORE_REST_D } from '../../core/tokens.js';
import { createRings, togetherLine } from './rings.js';

const DEG = Math.PI / 180;
const UNF = KEY.unfold;
const FOV_OPEN = 56;
const W1 = { A: [120, 600], B: [600, 1300], C: [1300, 1600], D: 1600 };
const WF = { A: [120, 900], B: [900, 1900], C: [1900, 2200], D: 2200 };
const crit = (x, w) => { const t = clamp01(x) * w; return 1 - (1 + t) * Math.exp(-t); };   // heavy spring, critically damped

export function createUnfold(hctx) {
  const ctx = hctx;
  const C = CAMERA.core;
  const restPos = new Vector3(...C.pos), restTgt = new Vector3(...C.target);
  const openPos = new Vector3(...UNF.camTo), openTgt = new Vector3(0, 0, 0);
  const rings = createRings(hctx);
  const overs = []; for (let i = 0; i < 7; i++) overs.push({ scaleR: 1 });
  const grp = { gap: GAP.rest, scale: 1, yaw: 0 };
  const st = {
    open: false, dir: 0, t0: 0, tl: 0, W: W1, closeFrom: 0, yaw: 0, vYaw: 0, drag: false, hot: -1, ang: 0,
    fired: { sub: false, wide: false, ign: false }, beamDone: false, departing: -1, refoldAt: 0, settled: true,
    fromPos: new Vector3(...C.pos), fromFov: C.fov,
  };
  const _a = new Vector3(), _p = new Vector3(), _o = new Vector3(), _d = new Vector3(), _m = { F: new Vector3(), n: new Vector3() };
  const _ray = { origin: _o, direction: _d };

  // ── DOM: under the motto LEAD — LABEL МЫ ВМЕСТЕ…, the clan description, the guests verb ──
  const block = document.createElement('div');
  block.className = 'core-open scrim';
  const together = document.createElement('p');
  together.className = 't-label core-open__together';
  const about = document.createElement('p');
  about.className = 't-body core-open__about';
  about.dataset.qa = 'unfold-about';
  const guests = document.createElement('button');
  guests.type = 'button';
  guests.className = 'verb t-label core-open__guests';
  guests.dataset.qa = 'unfold-guests';
  guests.textContent = 'ПРИНЯТЬ ГОСТЕЙ →';
  guests.addEventListener('click', () => { try { if (ctx.host && ctx.host.guests) ctx.host.guests.open('unfold'); } catch (e) { /* WP13 */ } });
  block.append(together, about, guests);
  hctx.section.appendChild(block);
  const aboutText = () => (WORLD.clan && typeof WORLD.clan.about === 'string' ? WORLD.clan.about.trim() : '');

  // hover label «→ {room}» at the ring's back
  const hoverEl = document.createElement('span');
  hoverEl.className = 't-label core-ring-label';
  let hoverAnchor = null;

  function setBody(b) { try { document.body.classList.toggle('core-open-on', b); } catch (e) { /* no DOM */ } }

  // ── the timeline (pure in tl) ──
  function apply(tl) {
    const W = st.W, key = ctx.key;
    const a = clamp01((tl - W.A[0]) / (W.A[1] - W.A[0]));
    const b = clamp01((tl - W.B[0]) / (W.B[1] - W.B[0]));
    const c = clamp01((tl - W.C[0]) / (W.C[1] - W.C[0]));
    const contract = tl < 120 ? 0.03 * EASE.reveal(tl / 120) : 0.03 * (1 - smoothstep(120, 360, tl));
    grp.scale = 1 - contract;
    grp.gap = lerp(GAP.rest, GAP.unfold, crit(a, 6.6));
    const sR = 1 + (UNF.ringScale - 1) * EASE.camera(b);
    for (let i = 0; i < 7; i++) { overs[i].scaleR = sR; if (key) key.override(i, overs[i]); }
    // signs to the camera: the group's drift (and any hand yaw) is taken back over window A, given back on the refold
    if (key) { const base = key.group.rotation.y - (grp.yaw || 0); grp.yaw = -base * crit(a, 6.6); key.overrideGroup(grp); }
    if (key) key.setNucleusPulse(tl < 120 ? 1 + 0.6 * Math.sin((Math.PI * tl) / 240) : app.birthday ? 1.3 : 1);
    st.ringK = smoothstep(0.35, 1, b);
    st.plateA = c;
    st.camB = b;
  }

  function ringY(i) {
    if (!ctx.key) return 0;
    ctx.key.stratumMatrix(i, _mat);
    return _v.set(0, STRATA_GEOM[i].mid, 0).applyMatrix4(_mat).y;
  }
  const _v = new Vector3();
  const _mat = new Matrix4();

  function begin(dir) {
    st.dir = dir;
    st.t0 = loop.now;
    st.settled = false;
  }

  function onOpenStart(instant) {
    const first = !(state.data && state.data.firstUnfold);
    st.W = first ? WF : W1;
    if (first && state.data) state.set('firstUnfold', true);
    st.open = true;
    app.unfolded = true;
    setPhase('unfolded');
    if (ctx.key) { ctx.key.setInteractive(false); ctx.key.setIdle(false); ctx.key.setOverrideWeight(1); }
    if (ctx.datum) ctx.datum.setVisible(false);
    st.fired = { sub: false, wide: false, ign: false };
    st.beamDone = false;
    st.yaw = 0; st.vYaw = 0;
    // the dolly starts where the camera is (the normal zoom may have it nearer or farther than the rest pose)
    st.fromPos.copy(rig.pose && rig.camera ? rig.pose.pos : restPos);
    st.fromFov = rig.pose && rig.camera ? rig.pose.fov : C.fov;
    rings.refresh(aboutText());
    together.textContent = togetherLine();
    const ab = aboutText();
    about.textContent = ab;
    about.hidden = !ab;
    block.classList.remove('is-in', 'is-about');
    setBody(true);
    hctx.bus.emit('unfold:change', { open: true });
    begin(1);
    if (instant || ENV.reducedMotion) { st.t0 = loop.now - st.W.D; }
    rings.addProxies((i) => dive(i), (i) => `→ ${rings.roomName(i)}`, (i) => setHot(i));
  }

  function dive(i) {
    if (!st.open || st.dir < 0) return;
    const r = rings.ROOM_OF[i];
    if (r === 'CORE') return;
    const slug = { SIGNAL: 'signal', ARCHIVE: 'archive', MEMBERS: 'members', VOYAGES: 'voyages', INSIGNIA: 'insignia', NADIR: 'nadir' }[r];
    if (audio) audio.play('select', {});
    hctx.director.go(`#/${slug}`, { source: 'key' });
  }

  function onCloseStart(instant) {
    if (!st.open && st.dir <= 0) return;
    st.closeFrom = st.tl;
    begin(-1);
    if (instant || ENV.reducedMotion) st.t0 = loop.now - TIMING.refold;
    if (ctx.lead) ctx.lead.hide();
    block.classList.remove('is-in', 'is-about');
    rings.clearProxies();
    setHot(-1);
    audio.fx.width(1, TIMING.refold, {});
    if (ctx.key && ctx.key.grains) ctx.key.grains.setMode('rings');
    hctx.bus.emit('unfold:change', { open: false });
  }

  function finishClose() {
    st.open = false; st.dir = 0; st.tl = 0; st.settled = true;
    app.unfolded = false;
    if (ctx.key) {
      for (let i = 0; i < 7; i++) ctx.key.override(i, null);
      ctx.key.overrideGroup(null);
      ctx.key.setNucleusPulse(app.birthday ? 1.3 : 1);
      ctx.key.setInteractive(true); ctx.key.setIdle(true);
    }
    if (ctx.datum) ctx.datum.setVisible(true);
    setBody(false);
    rings.frame(0, ringY, 0, 0, -1);
    if (app.phase === 'unfolded') setPhase('idle');
  }

  function setHot(i) {
    if (i === st.hot) return;
    st.hot = i;
    if (hoverAnchor) { hoverAnchor.remove(); hoverAnchor = null; }
    if (i >= 0 && i !== 3) {
      hoverEl.textContent = `→ ${rings.roomName(i)}`;
      hoverAnchor = ctx.overlay.add({ owner: 'core-ring-hover', el: hoverEl, scrim: true, cross: true, lowpass: 0, priority: 4,
        leader: { side: 'right', len: 24, rise: -18 }, get: (out) => rings.backPoint(i, out) });
      audio.play('hoverTick', { pan: 0 });
    }
  }

  function update(dt) {
    const now = loop.now;
    if (st.departing >= 0) {
      // a DIVE left from the open pose: the Key's unfold overrides hand over to the dive morph over 600 ms
      const x = clamp01((now - st.departing) / 600);
      if (ctx.key) ctx.key.setOverrideWeight(1 - x);
      rings.frame(st.ringK * (1 - clamp01(x * 2.5)), ringY, st.plateA * (1 - clamp01(x * 2.5)), st.ang, -1);
      if (x >= 1) { st.departing = -1; finishClose(); }
      return;
    }
    if (st.dir === 0 && !st.open) return;
    if (st.dir > 0) {
      st.tl = Math.min(st.W.D, now - st.t0);
      const tl = st.tl;
      if (!st.fired.sub) { st.fired.sub = true; audio.play('subRise', {}); }
      if (!st.fired.wide && tl >= 120) {
        st.fired.wide = true;
        audio.fx.width(1.5, st.W.A[1] - 120, { haasMs: hctx.layout.kind === 'desktop' ? 8 : 0 });
        if (ctx.key && ctx.key.grains) ctx.key.grains.setMode('shell');
      }
      if (!st.fired.ign && tl >= st.W.C[0]) {
        st.fired.ign = true;
        if (ctx.key) ctx.key.ignite({ color: app.night ? 'electrum' : 'ember', flash: true });
        block.classList.add('is-in');
        const motto = String(WORLD.clan.motto || '');
        if (ctx.lead) {
          ctx.lead.show(motto, { beam: true, ms: 1e9 });
          // the LABEL under it with the LEAD; the description fades in 240 ms after the beam has written the line
          const beamMs = ENV.reducedMotion ? 160 : Math.min(2400, (motto.length / TIMING.beamCps) * 1000 + 120);
          after(beamMs + 240, () => { if (st.open && st.dir > 0) { block.classList.add('is-about'); st.beamDone = true; } });
        }
      }
      if (tl >= st.W.D && !st.settled) st.settled = true;
    } else if (st.dir < 0) {
      const x = clamp01((now - st.t0) / TIMING.refold);
      st.tl = st.closeFrom * (1 - x);
      if (x >= 1) { audio.play('recallThud', {}); apply(0); finishClose(); return; }
    }
    apply(st.tl);
    // orbit inertia
    if (!st.drag && Math.abs(st.vYaw) > 1e-5) {
      st.yaw = Math.max(-UNF.orbitYawDeg * DEG, Math.min(UNF.orbitYawDeg * DEG, st.yaw + st.vYaw * (dt * 1000 / 16.7)));
      st.vYaw *= Math.pow(0.92, dt * 1000 / 16.7);
    }
    st.ang = ((loop.worldNow || now) / 1000) * (2 * Math.PI / UNF.platesPeriodS);
    rings.frame(st.ringK, ringY, st.plateA, st.ang, st.hot);
  }

  function pose(out) {
    out.pos.copy(openPos); out.target.copy(openTgt); out.fov = FOV_OPEN; out.offsetY = 0; out.roll = 0;
    return out;
  }

  return {
    isOpen: () => st.open || st.dir !== 0,
    open(instant) { if (st.open && st.dir > 0) return 0; onOpenStart(instant); return instant || ENV.reducedMotion ? 0 : st.W.D; },
    close(instant) {
      if (!st.open) return 0;
      onCloseStart(instant);
      return instant || ENV.reducedMotion ? 0 : TIMING.refold;
    },
    pose,
    livePose(out) {
      if (!st.open && st.dir === 0) return false;
      const b = EASE.camera(st.camB || 0), tl = st.tl;
      // opening: from where the camera was; refolding: back to the rest pose
      out.pos.copy(st.dir >= 0 ? st.fromPos : restPos).lerp(openPos, b);
      // SPEC §2.5 anticipation on the dolly's first 120 ms (forward only)
      if (st.dir > 0 && tl >= st.W.B[0] && tl < st.W.B[0] + 360) {
        anticipation((tl - st.W.B[0]) / (st.W.B[1] - st.W.B[0]), restPos, openPos, _a, st.W.B[1] - st.W.B[0], CORE_REST_D);
        out.pos.add(_a);
      }
      if (st.yaw) { const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), x = out.pos.x, z = out.pos.z; out.pos.x = x * cy + z * sy; out.pos.z = -x * sy + z * cy; }
      out.target.copy(restTgt).lerp(openTgt, b);
      out.fov = lerp(st.dir >= 0 ? st.fromFov : C.fov, FOV_OPEN, b);
      out.offsetY = lerp(hctx.layout.kind === 'desktop' ? 0 : C.phoneOffsetY, 0, b);
      out.roll = 0;
      return true;
    },
    update,
    onGesture(g) {
      if (!st.open || st.dir < 0) return g.type !== 'hover' && g.type !== 'leave';
      switch (g.type) {
        case 'hover': case 'move': {
          if (!rig.camera || st.tl < st.W.B[1]) return false;
          rig.ray(g.x, g.y, _ray);
          setHot(rings.pick(_o, _d));
          return false;
        }
        case 'leave': setHot(-1); return false;
        case 'down': return true;
        case 'tap': {
          if (!rig.camera) return true;
          rig.ray(g.x, g.y, _ray);
          const i = rings.pick(_o, _d);
          if (i >= 0 && i !== 3 && st.tl >= st.W.B[1]) { dive(i); return true; }
          // the nucleus or its ring: stays open; empty space → refold
          if (i === 3) return true;
          hctx.director.go('#/core', { source: 'key' });
          return true;
        }
        case 'dragstart': st.drag = true; st.vYaw = 0; return true;
        case 'drag': {
          if (!st.drag) return true;
          const dy = -g.dx * 0.0045;
          st.yaw = Math.max(-UNF.orbitYawDeg * DEG, Math.min(UNF.orbitYawDeg * DEG, st.yaw + dy));
          st.vYaw = dy;
          return true;
        }
        case 'dragend': case 'cancel': st.drag = false; return true;
        case 'wheel': if (g.deltaY > 0) hctx.director.go('#/core', { source: 'key' }); return true;
        case 'pinch': if (g.dScale < 0.97) hctx.director.go('#/core', { source: 'key' }); return true;
        default: return true;
      }
    },
    /** a DIVE leaves from the open pose (ring click): hand the Key back over 600 ms, the readable things go at once */
    depart() {
      if (!st.open && st.dir === 0) return;
      if (ctx.lead) ctx.lead.hide();
      block.classList.remove('is-in', 'is-about');
      rings.clearProxies();
      setHot(-1);
      audio.fx.width(1, 600, {});
      if (ctx.key && ctx.key.grains) ctx.key.grains.setMode('rings');
      st.dir = 0; st.open = false; app.unfolded = false;
      st.departing = loop.now;
      setBody(false);
      if (ctx.datum) ctx.datum.setVisible(true);
      after(700, () => { if (st.departing >= 0) { st.departing = -1; finishClose(); } });   // even if no frame of this hall runs again
      hctx.bus.emit('unfold:change', { open: false });
    },
    resize() {},
    dispose() {
      if (st.open || st.dir !== 0 || st.departing >= 0) { st.departing = -1; finishClose(); }
      if (hoverAnchor) { hoverAnchor.remove(); hoverAnchor = null; }
      rings.dispose();
      if (block.parentNode) block.parentNode.removeChild(block);
    },
    _st: st,
  };
  void _p; void _m;
}
