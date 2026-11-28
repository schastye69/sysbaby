// halls/nadir/nadir.js — WP9: NADIR «ЗАПЕЧАТАНО» → «ИСТОК», ▽ −1 090.00 (SPEC §1 lore, §6.7, §7.4 «Корни», §7.5 first
// entry; SPEC-ADDENDUM A2.5 first entry, A3.1, A3.3, A11.7; ARCH §6.10 + ARCH-ADDENDUM X§5.3 WP9).
// The camera stands over the deck's open centre and looks down the narrowing chamber at the keystone that carries his
// glyph; the clan's roots (ember dots) run down the three edges. entryPath() returns the first-entry path (a LIFT to
// INSIGNIA when needed, then the 2,800 ms fracture) only while WP9's persisted `state.data.nadirEntered` is false; the
// arrival sets it true (also after a reduced-motion slice), and later entries are ordinary LIFTs / DIVEs.
import { Group, Vector3 } from 'three';
import { createChamber } from './chamber.js';
import { createFracture, buildFirstEntry, FIRST_MS, NADIR_FOG } from './entry.js';
import { createNadirDom } from './nadirDom.js';
import { createElevator } from '../../nav/elevator.js';
import { ENV } from '../../core/env.js';
import { clamp01 } from '../../core/ease.js';

/** @returns {Hall} */
export function createNadirHall(hctx) {
  const phone = () => hctx.layout.kind === 'phone';
  let chamber = null, fracture = null, dom = null, elevator = null, root = null;
  let built = false, current = false, lastT = -1, enterU = 0;
  const clock = { t: -1, at: 0, active: false };
  let swiped = false;
  let afterT = -1;                                   // the pieces keep falling after the arrival (ms of scene time)
  const offs = [];
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  let selfSheet = false;
  function sheetSet(c, o) { selfSheet = true; try { hctx.sheet.set(c, o); } finally { selfSheet = false; } }
  const entered = () => !!(hctx.state.data && hctx.state.data.nadirEntered);

  function placeDom() {
    if (!dom) return;
    if (phone()) {
      if (dom.block.parentNode === hctx.section) dom.block.remove();
      if (current) sheetSet(dom.block, { peek: null, state: 'peek' });
    } else if (dom.block.parentNode !== hctx.section) hctx.section.appendChild(dom.block);
  }
  function readable(a) { if (dom) dom.setAlpha(clamp01(a)); }

  const hall = {
    id: hctx.id,
    build() {
      if (hctx.shell) hctx.shell.setDeckVisible(false);
      root = new Group();
      root.name = 'nadir';
      chamber = createChamber(hctx);
      fracture = createFracture();
      root.add(...chamber.objects, ...fracture.objects);
      if (hctx.group) hctx.group.add(root);
      fracture.set(-1, entered());
      dom = createNadirDom(hctx);
      placeDom();
      elevator = createElevator(hctx);
      offs.push(hctx.bus.on('travel:start', ({ to }) => { clock.active = !!(to && to.room === hctx.id && !entered()); if (!clock.active) clock.t = -1; }));
      offs.push(hctx.bus.on('code:earned', () => { if (dom) dom.refresh(); }));
      hall.enter(0);
      built = true;
      if (__DEV__) hctx.section.__qa = () => ({ clock: clock.t, after: afterT, enterU, entered: entered()});
    },
    pose() {
      // high in the chamber, looking down the funnel at the keystone: the three edges and their roots converge on it
      const ky = chamber ? chamber.keyY : -64;
      if (phone()) { poseOut.pos.set(0, 46, 64); poseOut.target.set(0, ky + 6, 0); poseOut.fov = 44; }
      else { poseOut.pos.set(0, 40, 70); poseOut.target.set(4, ky + 8, 0); poseOut.fov = 35; }
      poseOut.offsetY = 0; poseOut.roll = 0;
      return poseOut;
    },
    entryPath(from, start) {
      if (entered() || ENV.reducedMotion) return null;
      clock.t = -1; clock.active = true;
      return buildFirstEntry(hctx, from, start, clock);
    },
    enter(u) {
      enterU = u;
      if (!chamber) return;
      // «Корни»: the chamber resolves and the roots light from the centre outward over the arrival build
      chamber.setAlpha(clamp01(u * 1.4));
      chamber.setRoots(u);
      readable(u >= 0.7 ? (u - 0.7) / 0.3 : 0);
    },
    exit(u) {
      readable(1 - clamp01(u * 2));
      if (chamber) chamber.setAlpha(1 - u);
    },
    arrive(info) {
      current = true;
      const first = !entered();
      if (first) hctx.state.set('nadirEntered', true);
      chamber.setAlpha(1);
      chamber.setRoots(1);
      readable(1);
      placeDom();
      dom.refresh();
      dom.reveal();
      hctx.fog.set(NADIR_FOG);
      if (hctx.lamp) { const c = new Vector3(0, chamber.keyY - 1090, 0); hctx.lamp.setFocus(c, 14); }
      if (first) {
        chamber.burn();
        afterT = clock.t >= 0 ? Math.max(clock.t, FIRST_MS) : -1;   // keep the pieces falling on our own clock
        if (afterT < 0) fracture.set(-1, true);
      } else fracture.set(-1, true);
      clock.active = false;
      void info;
    },
    depart() {
      current = false;
      if (elevator) elevator.reset();
      if (phone()) sheetSet(null);
    },
    setSub() { return 0; },
    update(dt0, t) {
      if (!built) return;
      const ms = lastT < 0 ? dt0 * 1000 : Math.max(0, Math.min(250, t - lastT));
      lastT = t;
      if (clock.active && clock.t >= 0) fracture.set(clock.t, false);
      else if (afterT >= 0) {
        afterT += ms;
        fracture.set(afterT, false);
        if (afterT > 6000) { afterT = -1; fracture.set(-1, true); }
      }
      chamber.update(ms);
      // the readable column stays up while this is the current, settled hall (a stray late enter(u) cannot hide it)
      if (current && hctx.app.phase === 'idle' && dom && dom.block.style.opacity !== '1') { readable(1); chamber.setAlpha(1); chamber.setRoots(1); }
    },
    onGesture(g) {
      if (!current || !built) return false;
      if (g.type === 'wheel') return phone() ? false : elevator.onWheel(g);
      if (g.type === 'down') { swiped = false; return false; }
      if (g.type === 'dragend' && phone() && Math.abs(g.ty) >= 60 && Math.abs(g.ty) > Math.abs(g.tx) * 1.2) {
        swiped = true;
        return elevator.onSwipe({ type: 'swipe', dir: g.ty > 0 ? 'down' : 'up', x: g.x, y: g.y });
      }
      if (g.type === 'swipe' && swiped) { swiped = false; return true; }
      if (g.type === 'swipe' && phone() && (g.dir === 'up' || g.dir === 'down')) return elevator.onSwipe(g);
      return false;
    },
    onKey() { return false; },
    resize() { if (built) placeDom(); },
    /** X§2.4.5: 6 points on the deck ring around the opening, in the front half of the rest view. PURE. */
    lostSpots() {
      const out = [];
      const pts = phone() ? [[-9, 0.6, 26], [8, 0.6, 24], [-14, 0.6, 18], [13, 0.6, 16], [-4, 0.6, 30], [5, 0.6, 20]]
        : [[-16, 0.6, 26], [14, 0.6, 24], [-24, 0.6, 14], [22, 0.6, 12], [-6, 0.6, 30], [8, 0.6, 19]];
      for (const [x, y, z] of pts) out.push(new Vector3(x, y, z));
      return out;
    },
    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* gone */ } }
      offs.length = 0;
      if (chamber) chamber.dispose();
      if (fracture) fracture.dispose();
      if (root && root.parent) root.parent.remove(root);
      if (dom) dom.block.remove();
      if (current && phone()) sheetSet(null);
      if (hctx.shell) hctx.shell.setDeckVisible(true);
      current = false; built = false;
    },
  };
  return hall;
}
