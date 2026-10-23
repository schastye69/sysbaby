// halls/zenith/zenith.js — WP9: ZENITH «НАД ВСЕМ», ▽ +1 260.00, hidden (SPEC §6.8, §7.5, §8.1 S13, §9.6 ZENITH, §12.2;
// SPEC-ADDENDUM A3.3 scale pride, A5.1 `· СПАСЕНО {n}`; ARCH §6.10 + ARCH-ADDENDUM X§5.3 WP9).
// Open sky 60 m above the S apex. The camera looks down at −62° (phone −70°) at the whole of VIN, solid in the fog (the
// nest's level 1 — WP0 — with its lit nodes as warm windows on the • faces); the beacon is just below. A horizontal drag
// orbits the view about the axis (inertia ×0.92 per 16.7 ms) — the sky and its constellations turn with it, so the
// drawings stay where he left them in the frame's upper sky; the wheel / a vertical swipe is the elevator (→ SIGNAL).
// Readable: the datum title (WP0), the message BEAM WRITTEN in LEAD on every arrival, the MICRO line (data-qa
// "zenith-micro") `ВЫСОТА +1 260 М · УЗЛОВ ГОРИТ {lit}` (+ ` · СПАСЕНО {n}`), and `КОДЕКС · ВЫСОТА БУКВ {h} М` while an
// earned back face of VIN faces the view within 40°. Sound: `zenithPad` (G-major add9 + wind) while here. S13 on the
// first arrival.
import { Group, Vector3 } from 'three';
import { createSky, APEX_Y } from './sky.js';
import { buildAscent } from './ascent.js';
import { createLabels } from '../insignia/labels.js';
import { createElevator } from '../../nav/elevator.js';
import { playStroke } from '../signal/stroke.js';
import { TIER_PARAMS } from '../../core/quality.js';
import { STRATA_GEOM } from '../../core/tokens.js';
import { earnedStrata, codeCapHeightM } from '../../deeds/deedsModel.js';
import { clamp01 } from '../../core/ease.js';
import { buildStructure } from '../../world/structure.js';
import { createLitNodes } from '../../key/litNodes.js';

const DEG = Math.PI / 180;
const COS40 = Math.cos(40 * DEG);
const NB = ' ';

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

/** @returns {Hall} */
export function createZenithHall(hctx) {
  const phone = () => hctx.layout.kind === 'phone';
  let vin = null, lit = null;
  let group = null, sky = null, labels = null, elevator = null, block = null, micro = null, codexEl = null;
  let built = false, current = false, lastT = -1, orbit = 0, orbitV = 0, dragging = false, pad = null, stroke = null;
  const clock = { t: -1 };
  let swiped = false;
  let codexOrbit = NaN, codexAt = -1e9;
  const offs = [];
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  const scratch = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  const _f = new Vector3(), _n = new Vector3(), _v = new Vector3();
  let selfSheet = false;
  function sheetSet(c, o) { selfSheet = true; try { hctx.sheet.set(c, o); } finally { selfSheet = false; } }

  function rest(out, yaw = 0) {
    const ph = phone();
    // 60 m above the apex, close enough to the axis that the beacon (36 m below) stands in the frame's upper part
    const pitch = (ph ? -70 : -62) * DEG, d = ph ? 30 : 36;
    out.pos.set(Math.sin(yaw) * d, 0, Math.cos(yaw) * d);
    _f.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    out.target.copy(out.pos).addScaledVector(_f, 120);
    out.fov = ph ? 55 : 50; out.offsetY = 0; out.roll = 0;
    return out;
  }

  function microText() {
    const d = hctx.state.data || {};
    let s = `ВЫСОТА +1${NB}260 М · УЗЛОВ ГОРИТ ${hctx.state.litNodes}`;
    const saved = d.lost && d.lost.saved | 0;
    if (saved >= 1) s += ` · СПАСЕНО ${saved}`;
    return s;
  }
  /** The earned law whose back face of VIN looks at the view within 40° (→ cap height in m) or null. */
  function codexInView(yaw) {
    const list = earnedStrata();
    if (!list.length) return null;
    rest(scratch, yaw);
    _v.copy(scratch.target).sub(scratch.pos).normalize();          // view direction
    for (const i of list) {
      const st = STRATA_GEOM[i];
      const j = Math.floor(st.n / 2), a = (Math.PI * 2 * j) / st.n;
      _n.set(Math.sin(a), 0, Math.cos(a));
      if (-_n.dot(_v) >= COS40) return Math.round(codeCapHeightM(i, 1000));
    }
    return null;
  }

  function placeDom() {
    if (!block) return;
    if (phone()) {
      if (block.parentNode === hctx.section) block.remove();
      if (current) sheetSet(block, { peek: null, state: 'peek' });
    } else if (block.parentNode !== hctx.section) hctx.section.appendChild(block);
  }

  const hall = {
    id: hctx.id,
    build() {
      if (hctx.shell) { hctx.shell.setDeckVisible(false); hctx.shell.setAlpha(0); }
      group = new Group();
      group.name = 'zenith:sky';
      const tier = TIER_PARAMS[hctx.app.tier] || TIER_PARAMS.T2;
      const ph = phone();
      const vfov = ph ? 55 : 50, asp = Math.max(0.3, hctx.layout.w / Math.max(1, hctx.layout.h));
      const hfov = (2 * Math.atan(Math.tan((vfov * DEG) / 2) * asp)) / DEG;
      sky = createSky(hctx, {
        stars: tier.stars ? tier.stars.zenith : 3000,
        view: { pitch: (ph ? -70 : -62) * DEG, hfov, vfov },
        drawings: (hctx.state.data && hctx.state.data.drawings) || [],
        night: !!hctx.app.night,
        members: hctx.world.members,
      });
      group.add(...sky.objects);
      if (hctx.group) hctx.group.add(group);
      // VIN whole and SOLID far below (SPEC §6.8 "R1 far"): the Key's own structure ×1000 (its МОНОЛИТ solid, its 12
      // primary edges per stratum) with the strut scale set so R1 keeps it solid at 1.3 km; the nest's level-1 lattice
      // fades out while we are here (nest.setFade, ARCH §6.10). Lit nodes: the same sigil nodes, 1.2 m warm windows.
      try {
        vin = buildStructure({ perStratum: true, mono: true, strutScale: 0.004, lattice: false, scale: 1000, far: 6000 });
        vin.group.name = 'zenith:vin';
        vin.group.position.set(0, -1260, 0);
        lit = createLitNodes({ scale: 1000 });
        lit.setCount(hctx.state.litNodes);
        lit.setNight(!!hctx.app.night);
        vin.group.add(lit.object);
        if (hctx.group) hctx.group.add(vin.group);
        vin.setFade(0);
      } catch (e) { vin = null; lit = null; }
      labels = createLabels(hctx, hctx.section);
      for (const s of sky.slots) {
        const b = el('button', 'zn-con');
        b.type = 'button';
        b.dataset.qa = 'constellation';
        b.dataset.index = String(s.index);
        b.setAttribute('aria-label', s.kind === 'drawing' ? `рисунок ${s.index + 1}` : 'знак');
        if (s.norm) b.addEventListener('click', () => { if (stroke) stroke.stop(); stroke = playStroke(s.norm, 1200); hctx.audio.play('select', {}); });
        else b.disabled = true;
        const L = labels.add({ el: b, get: (out) => out.copy(s.centre).applyAxisAngle(group.up, orbit), leader: false, cross: false, centre: true });
        L.show(s.kind === 'drawing');
      }
      block = el('div', 'zn-block');
      block.dataset.qa = 'zenith-block';
      micro = el('p', 't-micro zn-micro', microText());
      micro.dataset.qa = 'zenith-micro';
      codexEl = el('p', 't-micro zn-codex');
      codexEl.hidden = true;
      block.append(micro, codexEl);
      placeDom();
      elevator = createElevator(hctx);
      offs.push(hctx.bus.on('travel:start', ({ to }) => { if (!(to && to.room === hctx.id)) clock.t = -1; }));
      // G12: the pad is a live voice — it stops with the tab and comes back with it (only while we are here)
      offs.push(hctx.bus.on('visibility', ({ hidden }) => {
        if (!current) return;
        if (hidden) { if (pad) { pad.stop(); pad = null; } if (stroke) { stroke.stop(); stroke = null; } }
        else if (!pad) pad = hctx.audio.start('zenithPad', {});
      }));
      hall.enter(0);
      built = true;
      if (__DEV__) hctx.section.__qa = () => ({ orbit, clock: clock.t, slots: sky.slots.length });
    },
    pose() { return rest(poseOut, 0); },
    livePose(out) {
      if (!built || Math.abs(orbit) < 1e-6) return false;
      rest(out, orbit);
      return true;
    },
    entryPath(from, start) {
      clock.t = -1;
      return buildAscent(hctx, from, start, rest({ pos: new Vector3(), target: new Vector3(), fov: 35 }, 0), clock);
    },
    enter(u) {
      if (!sky) return;
      sky.setAlpha(clamp01(u * 1.5));
      if (vin) { vin.setFade(clamp01(u)); vin.group.visible = u > 0; }
      if (labels) labels.setAlpha(u >= 0.7 ? (u - 0.7) / 0.3 : 0);
      if (block) block.style.opacity = String(u >= 0.7 ? (u - 0.7) / 0.3 : 0);
    },
    exit(u) {
      const a = 1 - clamp01(u * 2);
      if (vin) { vin.setFade(1 - clamp01(u)); vin.group.visible = u < 1; }
      if (labels) labels.setAlpha(a);
      if (block) block.style.opacity = String(a);
      if (sky) sky.setAlpha(1 - u);
    },
    arrive() {
      current = true;
      clock.t = -1;
      sky.pinch(APEX_Y, 0, 0);
      hall.enter(1);
      micro.textContent = microText();
      placeDom();
      hctx.fog.set(hctx.meta.fog);
      if (hctx.nest && hctx.nest.setFade) hctx.nest.setFade(1, 0);
      if (hctx.shell) hctx.shell.setAlpha(0);
      if (vin) { vin.setFade(1); vin.group.visible = true; }
      if (lit) lit.setCount(hctx.state.litNodes);
      if (hctx.lamp) { _v.set(0, 1150, 0); hctx.lamp.setFocus(_v, 90); }
      if (pad) pad.stop();
      pad = hctx.audio.start('zenithPad', {});
      if (hctx.secrets && !hctx.secrets.isFound('S13')) hctx.secrets.discover('S13', { anchor: { x: hctx.layout.w / 2, y: hctx.layout.h * 0.3 } });
      const msg = hctx.world.zenith && hctx.world.zenith.message;
      if (msg && hctx.lead) hctx.lead.show(msg, { beam: true, ms: 6500 });
    },
    depart() {
      current = false;
      if (pad) { pad.stop(); pad = null; }
      if (stroke) { stroke.stop(); stroke = null; }
      if (elevator) elevator.reset();
      if (phone()) sheetSet(null);
    },
    setSub() { return 0; },
    update(dt0, t) {
      if (!built) return;
      const ms = lastT < 0 ? dt0 * 1000 : Math.max(0, Math.min(250, t - lastT));
      lastT = t;
      // the ascent's pinch, from the path's own clock (scrubbable)
      if (clock.t >= 0 && !current) {
        const tt = clock.t;
        const cam = hctx.rig && hctx.rig.camera ? hctx.rig.camera.position.y - 1260 : APEX_Y;
        const k = clamp01((tt - 450) / 350) * (1 - clamp01((tt - 1300) / 400));
        sky.pinch(cam, k, clamp01((tt - 300) / 300) * (1 - clamp01((tt - 1500) / 400)));
      }
      if (!dragging && Math.abs(orbitV) > 1e-6) {
        orbit += orbitV * ms;
        orbitV *= Math.pow(0.92, ms / 16.7);
        if (Math.abs(orbitV) < 1e-6) orbitV = 0;
      }
      group.rotation.y = orbit;
      if (current && hctx.app.phase === 'idle' && block && block.style.opacity !== '1') hall.enter(1);
      if (current) {
        // the КОДЕКС line follows the view (re-checked when the orbit moved, and twice a second for new laws)
        if (orbit !== codexOrbit || t - codexAt > 500) {
          codexOrbit = orbit; codexAt = t;
          const h = codexInView(orbit);
          const txt = h != null ? `КОДЕКС · ВЫСОТА БУКВ ${h} М` : '';
          if (codexEl.textContent !== txt) { codexEl.textContent = txt; codexEl.hidden = !txt; }
        }
        labels.update(ms / 1000);
      }
    },
    onGesture(g) {
      if (!current || !built) return false;
      switch (g.type) {
        case 'wheel': return phone() ? false : elevator.onWheel(g);
        case 'dragstart': dragging = Math.abs(g.tx) >= Math.abs(g.ty); return dragging;
        case 'drag':
          if (!dragging) return false;
          orbit -= g.dx * 0.0035; orbitV = -(g.vx || 0) * 0.0035;
          return true;
        case 'dragend':
          if (dragging) { dragging = false; return true; }
          if (phone() && Math.abs(g.ty) >= 60 && Math.abs(g.ty) > Math.abs(g.tx) * 1.2) {
            swiped = true;
            return elevator.onSwipe({ type: 'swipe', dir: g.ty > 0 ? 'down' : 'up', x: g.x, y: g.y });
          }
          return false;
        case 'swipe':
          if (swiped) { swiped = false; return true; }
          if (phone() && (g.dir === 'up' || g.dir === 'down')) return elevator.onSwipe(g);
          return dragging;
        case 'down': swiped = false; return false;
        default: return false;
      }
    },
    onKey(e) {
      if (!current) return false;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { orbitV += (e.key === 'ArrowLeft' ? 1 : -1) * 0.0012; return true; }
      return false;
    },
    resize() { if (built) placeDom(); },
    lostSpots() { return []; },
    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* gone */ } }
      offs.length = 0;
      if (pad) { pad.stop(); pad = null; }
      if (stroke) { stroke.stop(); stroke = null; }
      if (sky) sky.dispose();
      if (lit) lit.dispose();
      if (vin) vin.dispose();
      if (current && hctx.nest && hctx.nest.setFade) hctx.nest.setFade(1, 1);
      if (labels) labels.dispose();
      if (group && group.parent) group.parent.remove(group);
      if (block) block.remove();
      if (current && phone()) sheetSet(null);
      if (hctx.shell) hctx.shell.setDeckVisible(true);
      current = false; built = false;
    },
  };
  return hall;
}
