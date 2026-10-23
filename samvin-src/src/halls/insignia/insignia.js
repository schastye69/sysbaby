// halls/insignia/insignia.js — WP9: INSIGNIA «ХРАНИЛИЩЕ», ▽ −810.00 (SPEC §6.6, §7.4 «Купол», §7.6, §2.7, §10.1, §4.5;
// SPEC-ADDENDUM A3.3 (capsule → `wait` through capsule:open), A11.6 `where`; ARCH §6.10 + ARCH-ADDENDUM X§5.3 WP9).
//
// The eye sits at the sphere's centre (0, 1.7, 0), FOV 40°. The vault turns, not the camera: a drag (phone: horizontal
// swipe) yaws the whole arrangement with inertia (×0.92 per 16.7 ms) and settles on the nearest relic (medium spring).
// Desktop: a vertical drag (or the capsule line) looks down (detents rest / −78°) at the capsule and, through the opening, at the NADIR
// plate 280 m below (the fog thins while looking down); the wheel is the elevator. Phone: a vertical swipe is the
// elevator. Draw calls: one shared set of vault batches — solids, silver (edges, dome, plate, slot rings), white
// (legendary edges, shards, filled slots), dashed pewter — = 4 over the shell, + 1 (electrum) while the capsule cracks.
import { Group, DoubleSide, Vector3 } from 'three';
import { createObsidian } from '../../render/obsidian.js';
import { createSolidBatch, createLineBatch, createStaticView } from './batch.js';
import { createLabels } from './labels.js';
import { createDome } from './dome.js';
import { createRelics, RELIC } from './relics.js';
import { createVault } from './vault.js';
import { createCapsule } from './capsule.js';
import { createVaultDom } from './vaultDom.js';
import { openCapsule } from './capsuleModel.js';
import { createElevator } from '../../nav/elevator.js';
import { Spring, SPRING } from '../../core/spring.js';
import { ENV } from '../../core/env.js';
import { CAMERA } from '../../core/tokens.js';
import { clamp01 } from '../../core/ease.js';
import { after, cancelAfter } from '../../core/clock.js';

const EYE = CAMERA.insignia.pos;                     // [0, 1.7, 0]
const FOV = CAMERA.insignia.fov;                     // 40
const DEG = Math.PI / 180;
const LOOK_DOWN = -78 * DEG;
// Rest framing (FOV 40 from the centre cannot hold all three rings): with finds, the relics and the shards above
// (+1°); without, the relics and the goals below (−9°). Desktop: the facing relic sits 10° right of the axis, clear of
// the DISPLAY title on the left.
const PITCH_SHARDS = 1 * DEG, PITCH_GOALS = -9 * DEG, FRONT_DESK = 10 * DEG;
const DOME_MS = 900, ENTER_SHARE = 600 / 900;
const FOG_DOWN = 0.0021;
const TAU = Math.PI * 2;
const _v = new Vector3(), _c = new Vector3();

/** @returns {Hall} */
export function createInsigniaHall(hctx) {
  const meta = hctx.meta;
  const phone = () => hctx.layout.kind === 'phone';
  let mat = null, ringGroup = null, ring = null, stat = null, labels = null;
  let dome = null, relics = null, vault = null, capsule = null, dom = null, elevator = null;
  let built = false, current = false, domeP = 0, domeT = -1, enterU = 0, exitU = 0;
  let hasEarned = false;
  let yaw = 0, yawV = 0, dragging = false, settleArmed = false, dragAxis = '', swiped = false;
  const yawS = new Spring(SPRING.medium.omega, 1, 0);
  const look = Spring.from(SPRING.heavy, 0);
  let capsuleBusy = false, lookHoldTimer = 0, heldId = null, pendingSub = null;
  const offs = [];
  let lastT = -1;
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: FOV, offsetY: 0, roll: 0 };
  const holdPoint = new Vector3();
  let selfSheet = false;
  function sheetSet(c, o) { selfSheet = true; try { hctx.sheet.set(c, o); } finally { selfSheet = false; } }

  /** The eye-frame point the held relic comes to: 3 m ahead (desktop a little left of the block, phone a little up). */
  function holdAt(out) {
    // on the rest view axis (pitched), desktop a little left of the block, phone a little up (above the sheet)
    const p = restPitch() + (phone() ? 6 * DEG : 0), d = RELIC.holdDist;
    return out.set(phone() ? 0 : -0.42, EYE[1] + Math.sin(p) * d, EYE[2] - Math.cos(p) * d);
  }

  /** The yaw that brings relic k in front (nearest to the current yaw). */
  function detentOf(k) {
    const R = relics.list[k];
    let y = R.th - frontOff();
    while (y - yaw > Math.PI) y -= TAU;
    while (y - yaw < -Math.PI) y += TAU;
    return y;
  }
  function nearestDetent() {
    let best = yaw, bd = Infinity;
    for (let k = 0; k < relics.list.length; k++) {
      if (!relics.list[k].earned && hasEarned) continue;
      const d = detentOf(k);
      if (Math.abs(d - yaw) < bd) { bd = Math.abs(d - yaw); best = d; }
    }
    return best;
  }
  function frontOff() { return phone() ? 0 : FRONT_DESK; }
  function restPitch() { return vault && vault.shards.length ? PITCH_SHARDS : PITCH_GOALS; }
  function turnTo(k) { if (k < 0) return; yawV = 0; settleArmed = false; yawS.x = yaw; yawS.v = 0; yawS.target = detentOf(k); }
  function frontRelic() {
    let best = -1, bd = Infinity;
    for (let k = 0; k < relics.list.length; k++) {
      const R = relics.list[k];
      let d = ((R.th - yaw - frontOff()) % TAU + TAU) % TAU; if (d > Math.PI) d = TAU - d;
      if (R.earned && d < bd) { bd = d; best = k; }
    }
    return best;
  }

  let readA = 0;
  function readable(a) {
    readA = clamp01(a);
    const v = String(readA);
    if (dom) { dom.left.style.opacity = v; dom.block.style.opacity = v; }
    if (labels) labels.setAlpha(heldId ? 0 : readA);
  }
  function placeDom() {
    if (!dom) return;
    if (phone()) {
      if (dom.left.parentNode === hctx.section) dom.left.remove();
      if (dom.block.parentNode === hctx.section) dom.block.remove();
      if (current) {
        if (heldId) sheetSet(dom.block, { peek: null, state: 'full' });
        else sheetSet(null, { peek: dom.left, state: 'peek' });
      }
    } else {
      if (dom.left.parentNode !== hctx.section) hctx.section.appendChild(dom.left);
      if (dom.block.parentNode !== hctx.section) hctx.section.appendChild(dom.block);
    }
  }

  let pillarHidden = false;
  function pillarAside(b) {
    const p = hctx.pillar;
    if (!p || b === pillarHidden) return;
    pillarHidden = b;
    p.visible = !b;
  }
  function heldClass(b) { try { document.body.classList.toggle('ins-held', !!b); } catch (e) { /* no DOM */ } }
  function setHeld(id, rm) {
    heldId = id;
    heldClass(!!id && current);
    if (labels) labels.setAlpha(id ? 0 : readA);
    const k = id ? relics.index(id) : -1;
    if (k >= 0) {
      turnTo(k);
      relics.hold(k, holdAt(holdPoint), rm);
      dom.showBlock(relics.list[k], rm);
      look.target = 0;
    } else {
      relics.hold(-1, null, rm);
      dom.showBlock(null);
    }
    if (current && phone()) placeDom();
    if (hctx.lamp) {
      if (k >= 0) { hctx.toCanonical(holdPoint, _c); hctx.lamp.setFocus(_c, 0.9); }
      else lampOverview();
    }
  }
  function lampOverview() {
    if (!hctx.lamp) return;
    _v.set(0, EYE[1], -RELIC.rE);
    hctx.toCanonical(_v, _c);
    hctx.lamp.setFocus(_c, 5.5);
  }

  async function runCapsule() {
    if (capsuleBusy || !capsule.due()) return;
    capsuleBusy = true;
    const go = async (h) => {
      const reduced = !!(h && h.reduced) || ENV.reducedMotion;
      // the eye tilts down to the capsule while the cracks already spread (the 1,200 ms crack is the beat)
      look.target = 1;
      if (reduced) look.snap(1);
      await capsule.open(reduced);
      _v.copy(capsule.pos); hctx.toCanonical(_v, _c);
      openCapsule({ anchor: _c.clone() });
      if (hctx.lead && hctx.world.capsule.text) await hctx.lead.show(hctx.world.capsule.text, { beam: true, ms: 5200 });
    };
    try {
      if (hctx.fx && hctx.fx.stage && typeof hctx.fx.stage.run === 'function') await hctx.fx.stage.run('capsule', go);
      else await go(null);
    } catch (e) { /* the set-piece is cosmetic; the model already persisted */ }
    capsuleBusy = false;
    if (current) { if (lookHoldTimer) cancelAfter(lookHoldTimer); lookHoldTimer = after(1200, () => { lookHoldTimer = 0; if (!dragging) look.target = 0; }); }
  }

  const hall = {
    id: hctx.id,
    build() {
      if (hctx.shell) hctx.shell.setDeckVisible(false);
      mat = createObsidian({ r1: false, side: DoubleSide });
      ringGroup = new Group();
      ringGroup.name = 'insignia:vault';
      const far = 400;
      // ONE set of batches for the whole vault (A9 call budget): relics and shards turn with the ring group; the dome,
      // the plate below and the capsule go through static views (R_y(−yaw)), so they stay put while the vault turns.
      ring = {
        group: ringGroup,
        solids: createSolidBatch({ cap: 32000, material: mat, name: 'insignia:solids' }),
        silver: createLineBatch({ cap: 2600, color: 'silver', far, name: 'insignia:edges' }),
        white: createLineBatch({ cap: 1800, color: 'white', far, glint: 1.2, name: 'insignia:white' }),
        pewter: createLineBatch({ cap: 1400, color: 'pewter', dash: [5, 4], far, glint: 0.3, name: 'insignia:open' }),
      };
      const electrum = createLineBatch({ cap: 80, color: 'electrum', far: 60, glint: 0.2, fog: false, name: 'insignia:cracks' });
      electrum.lines.setAlpha(0);
      stat = {
        solids: createStaticView(ring.solids), silver: createStaticView(ring.silver),
        white: createStaticView(ring.white), electrum: createStaticView(electrum), electrumBatch: electrum,
      };
      ringGroup.add(ring.solids.mesh, ring.silver.lines.mesh, ring.white.lines.mesh, ring.pewter.lines.mesh, electrum.lines.mesh);
      labels = createLabels(hctx, hctx.section);
      // desktop: no 3D label inside the readable column (title, relic index, capsule line)
      labels.setAvoid((x, y) => !phone() && x < 470 && y > hctx.layout.h * 0.62 - 150);
      dome = createDome(hctx, stat);
      relics = createRelics(hctx, ring, labels);
      hasEarned = relics.list.some((r) => r.earned);
      vault = createVault(hctx, ring, labels, hctx.section);
      capsule = createCapsule(hctx, stat, labels);
      if (hctx.group) hctx.group.add(ringGroup);
      dom = createVaultDom(hctx, relics, {
        preview(k, on) {
          relics.setHover(on ? k : -1);
          dom.setHover(on ? k : -1);
          if (on && !heldId) turnTo(k);
        },
        activate(k) { const R = relics.list[k]; if (R) hctx.director.go(`#/insignia/${R.id}`, { source: 'hall' }); },
      });
      dom.left.appendChild(capsule.col);
      // the capsule line also turns the eye down to it (and back): the phone's way to look down at the plate
      capsule.col.addEventListener('click', () => { if (!heldId && !capsuleBusy) look.target = look.target > 0.5 ? 0 : 1; });
      placeDom();
      elevator = createElevator(hctx);
      const d = hctx.state.data || {};
      dome.setPlate(d.nadirOpen ? 5 : d.shards | 0, !!d.nadirEntered);
      offs.push(hctx.bus.on('shard:landed', () => { const dd = hctx.state.data || {}; dome.setPlate(dd.nadirOpen ? 5 : dd.shards | 0, !!dd.nadirEntered); }));
      offs.push(hctx.bus.on('travel:start', ({ to }) => { pendingSub = to && to.room === hctx.id ? to.sub : null; }));
      offs.push(hctx.bus.on('visibility', ({ hidden }) => { if (hidden) { vault.stop(); dragging = false; } }));
      offs.push(hctx.sheet.onChange((s) => {
        if (!current || selfSheet || !phone()) return;
        if (s === 'closed' && heldId) hctx.director.go('#/insignia', { source: 'hall' });
      }));
      hall.enter(0);
      built = true;
      if (__DEV__) hctx.section.__qa = () => ({ yaw, look: look.x, held: heldId, dome: domeP, front: frontRelic(), shards: vault.shards.length, cap: capsule.debug });
    },
    pose(sub) {
      void sub;
      const p = restPitch();
      poseOut.pos.set(EYE[0], EYE[1], EYE[2]);
      poseOut.target.set(EYE[0], EYE[1] + Math.sin(p) * 10, EYE[2] - Math.cos(p) * 10);
      poseOut.fov = FOV; poseOut.offsetY = 0; poseOut.roll = 0;
      return poseOut;
    },
    livePose(out) {
      if (!built) return false;
      const r = restPitch(), p = r + (LOOK_DOWN - r) * look.x;
      // looking down, the eye leans 2.6 m forward over the opening (the axis' beads hang straight below the centre)
      out.pos.set(EYE[0], EYE[1], EYE[2] - 2.6 * look.x);
      out.target.set(EYE[0], EYE[1] + Math.sin(p) * 10, out.pos.z - Math.cos(p) * 10);
      out.fov = FOV; out.offsetY = 0; out.roll = 0;
      return true;
    },
    enter(u) {
      enterU = u;
      if (!built && u > 0) return;
      if (dome && domeT < 0) dome.setBuild(u * ENTER_SHARE);
      const a = clamp01(u * 1.6);
      if (relics) relics.setAlpha(a);
      if (ring) { ring.silver.lines.setAlpha(a); ring.white.lines.setAlpha(a); ring.pewter.lines.setAlpha(a); }
      readable(u >= 0.7 ? (u - 0.7) / 0.3 : 0);
    },
    exit(u) {
      // the departure fold takes the readable copy away; the vault itself stays until the hall is released (the
      // camera rises or sinks out of the sphere). The plate below belongs to NADIR from the first frame of a departure.
      exitU = u;
      readable(1 - clamp01(u * 2));
      if (dome && u > 0) dome.setPlate(0, true);
    },
    arrive(info) {
      current = true;
      enterU = 1; exitU = 0;
      readable(1);
      hall.exit(0);
      hall.enter(1);
      domeP = ENTER_SHARE;
      domeT = ENV.reducedMotion || info.kind === 'SLICE' ? DOME_MS : DOME_MS * ENTER_SHARE;
      if (domeT >= DOME_MS) dome.setBuild(1);
      placeDom();
      if (heldId) heldClass(true); else lampOverview();
      hctx.fog.set(meta.fog);
      const d = hctx.state.data || {};
      dome.setPlate(d.nadirOpen ? 5 : d.shards | 0, !!d.nadirEntered);
      capsule.sync();
      vault.play();
      if (!pendingSub && !(info && info.sub)) { yaw = -frontOff(); yawS.snap(yaw); yawV = 0; }
      pendingSub = null;
      if (capsule.due()) runCapsule();
    },
    depart() {
      current = false;
      heldClass(false);
      pillarAside(false);
      vault.stop();
      relics.setHover(-1); dom.setHover(-1);
      look.target = 0;
      if (lookHoldTimer) { cancelAfter(lookHoldTimer); lookHoldTimer = 0; }
      if (elevator) elevator.reset();
      if (phone()) sheetSet(null);
    },
    setSub(s, o = {}) {
      if (!built) return 0;
      const rm = !!o.instant || ENV.reducedMotion;
      if (s == null) {
        if (!heldId) return 0;
        setHeld(null, rm);
        return rm ? (o.instant ? 0 : 160) : 600;
      }
      if (relics.index(s) < 0) return false;
      if (heldId === s) return 0;
      setHeld(s, rm);
      return rm ? (o.instant ? 0 : 160) : 600;
    },
    update(dt0, t) {
      if (!built) return;
      // timelines and springs run on loop time (wall-clock exact on a slow GPU; a frame counts ≤ 250 ms)
      const ms = lastT < 0 ? dt0 * 1000 : Math.max(0, Math.min(250, t - lastT));
      lastT = t;
      const dt = ms / 1000;
      // «Купол»: the last 300 ms of the 900 ms build run on after the arrival
      if (domeT >= 0 && domeT < DOME_MS) { domeT += dt * 1000; dome.setBuild(domeT / DOME_MS); domeP = Math.min(1, domeT / DOME_MS); }
      // the vault's yaw: drag → inertia ×0.92 per 16.7 ms → the medium spring onto the nearest relic
      if (!dragging) {
        if (Math.abs(yawV) > 0.00002) {
          yaw += yawV * dt * 1000;
          yawV *= Math.pow(0.92, (dt * 1000) / 16.7);
          settleArmed = true;
        } else {
          if (settleArmed) { settleArmed = false; yawS.x = yaw; yawS.v = 0; yawS.target = nearestDetent(); }
          if (!yawS.settled(1e-5)) yaw = yawS.step(dt);
          yawV = 0;
        }
      }
      ringGroup.rotation.y = yaw;
      relics.setYaw(yaw); vault.setYaw(yaw);
      stat.solids.setYaw(yaw); stat.silver.setYaw(yaw); stat.white.setYaw(yaw); stat.electrum.setYaw(yaw);
      look.step(dt);
      if (current) {
        const f = look.x;
        hctx.fog.set(meta.fog + (FOG_DOWN - meta.fog) * f);
        // the axis pillar runs straight through the plate's centre: its beads would stack across the view down, so it
        // steps aside while the eye looks down (restored on the way up, on departure and on dispose)
        pillarAside(f > 0.35);
      }
      relics.update(dt, t);
      vault.update(dt);
      capsule.update(dt);
      for (let k = 0; k < relics.list.length; k++) { const R = relics.list[k]; R.label.setSide(R.sx < hctx.layout.w * 0.5 ? 'right' : 'left'); }
      dom.setFront(frontRelic());
      ring.solids.flush(); ring.silver.flush(); ring.white.flush(); ring.pewter.flush(); stat.electrumBatch.flush();
      if (current && hctx.app.phase === 'idle' && readA < 1 && exitU === 0) readable(1);
      if (current || enterU > 0.7) labels.update(dt);
      // reconcile with the route (a focus cancelled by the director)
      if (current && hctx.app.phase === 'idle') {
        const cur = hctx.director.current;
        const want = cur && cur.room === hctx.id && cur.sub && relics.index(cur.sub) >= 0 ? cur.sub : null;
        if (want !== heldId) setHeld(want, true);
      }
    },
    onGesture(g) {
      if (!current || !built) return false;
      switch (g.type) {
        case 'wheel':
          if (phone()) return false;
          return elevator.onWheel(g);
        case 'hover': {
          if (phone()) return false;
          const k = heldId ? -1 : relics.hit(g.x, g.y);
          relics.setHover(k); dom.setHover(k);
          return false;
        }
        case 'leave': relics.setHover(-1); dom.setHover(-1); return false;
        case 'tap': {
          const s = vault.hit(g.x, g.y);
          if (s >= 0) { vault.open(s); return true; }
          if (heldId) { hctx.director.go('#/insignia', { source: 'hall' }); return true; }
          const k = relics.hit(g.x, g.y);
          if (k >= 0) { hctx.audio.play('select', {}); hctx.director.go(`#/insignia/${relics.list[k].id}`, { source: 'hall' }); return true; }
          return false;
        }
        case 'dragstart':
          dragging = true; dragAxis = '';
          if (heldId) relics.grab();
          return true;
        case 'drag': {
          if (heldId) { relics.spin(g.dx, g.dy); return true; }
          if (!dragAxis) dragAxis = Math.abs(g.tx) >= Math.abs(g.ty) ? 'x' : 'y';
          if (dragAxis === 'x') {
            const k = (FOV * Math.PI) / 180 / Math.max(1, hctx.layout.h);     // one px of drag ≈ one px of sweep at the ring
            yaw -= g.dx * k * 1.1;
            yawV = -(g.vx || 0) * k * 1.1;
          } else if (!phone()) {
            look.target = clamp01(look.target + g.dy / 220);
          }
          return true;
        }
        case 'dragend':
          dragging = false;
          if (heldId) { relics.fling(g.vx || 0, g.vy || 0); return true; }
          if (dragAxis === 'y' && !phone()) look.target = look.target > 0.5 ? 1 : 0;
          if (dragAxis === 'x') settleArmed = true;
          // phone: a vertical stroke (≥ 60 px, mostly vertical) is the elevator, however slowly it ends (SPEC §10.1)
          if (phone() && dragAxis === 'y' && Math.abs(g.ty) >= 60 && Math.abs(g.ty) > Math.abs(g.tx) * 1.2) {
            swiped = true;
            elevator.onSwipe({ type: 'swipe', dir: g.ty > 0 ? 'down' : 'up', x: g.x, y: g.y });
          }
          return true;
        case 'swipe':
          if (swiped) { swiped = false; return true; }
          if (heldId) return true;
          if (phone() && (g.dir === 'up' || g.dir === 'down') && dragAxis !== 'x') return elevator.onSwipe(g);
          return true;
        case 'down': swiped = false; return false;
        case 'cancel': dragging = false; return false;
        default: return false;
      }
    },
    onKey(e) {
      if (!current || !built) return false;
      if (e.key === 'Escape' && heldId) { hctx.director.go('#/insignia', { source: 'kbd' }); return true; }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !heldId) {
        const f = frontRelic();
        const earned = relics.list.map((R, k) => (R.earned ? k : -1)).filter((k) => k >= 0);
        const i = earned.indexOf(f);
        const n = earned[(i + (e.key === 'ArrowRight' ? 1 : -1) + earned.length) % Math.max(1, earned.length)];
        if (n != null) turnTo(n);
        return true;
      }
      return false;
    },
    resize() { if (built) placeDom(); },
    /** X§2.4.5: 6 points in the eye's front view, between the relic ring and the shards, hall-local. PURE. */
    lostSpots() {
      const out = [];
      const spots = phone() ? [[-0.6, 2.6, 7], [0.5, 1.0, 8], [-0.3, 0.4, 6.5], [0.7, 2.2, 9], [0, 3.0, 8.5], [-0.8, 1.4, 7.5]]
        : [[-2.4, 2.6, 8], [2.1, 1.0, 8.5], [-1.2, 0.5, 7], [3.0, 2.3, 9.5], [0.6, 3.1, 9], [-3.2, 1.3, 9]];
      for (const [x, y, d] of spots) out.push(new Vector3(x, y, -d));
      return out;
    },
    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* gone */ } }
      offs.length = 0;
      if (lookHoldTimer) cancelAfter(lookHoldTimer);
      if (vault) vault.dispose();
      if (capsule) capsule.dispose();
      if (relics) relics.dispose();
      if (dome) dome.dispose();
      if (labels) labels.dispose();
      if (ring) { ring.solids.dispose(); ring.silver.dispose(); ring.white.dispose(); ring.pewter.dispose(); }
      if (stat) stat.electrumBatch.dispose();
      if (mat) mat.dispose();
      if (dom) { dom.left.remove(); dom.block.remove(); }
      if (current && phone()) sheetSet(null);
      if (current) heldClass(false);
      pillarAside(false);
      if (hctx.shell) hctx.shell.setDeckVisible(true);
      if (ringGroup && ringGroup.parent) ringGroup.parent.remove(ringGroup);
      current = false; built = false;
    },
  };
  return hall;
}
