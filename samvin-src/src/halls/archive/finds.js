// halls/archive/finds.js — WP7: finds embedded in the bands (SPEC §6.4, §7.6 "Relic or find extraction" 600 ms medium
// spring; SPEC-ADDENDUM A3.5). Each find = one obsidian solid (R2, faceted) + its silver crease edges (R3), placed at a
// seeded angle within the front of the tube (±30° of the view; the layout's free column, see FIND_WINDOW), 0.2 m proud
// of the wall, at its band's height. Only finds near the camera are drawn (≤ 2 draw calls each). Achievements carry a
// 1 px ember outline while their band is the focus (SPEC: "earned ones have a 1 px ember outline when focused").
// Every find has a DOM proxy (<button data-qa="find" data-id="<band id>">) so Tab/Enter and phone taps reach it.
// Extraction: the find floats 2.5 m in front of the camera (medium spring ω 12), can be held: drag rotates with inertia,
// a flick spins it on (angular velocity × 0.96 per frame); Esc / a tap on it puts it back (the same spring).
import { Mesh, Vector3 } from 'three';
import { createObsidian } from '../../render/obsidian.js';
import { createLines } from '../../render/lines.js';
import { Spring, SPRING } from '../../core/spring.js';
import { mulberry32 } from '../../core/rng.js';
import { MOTION } from '../../core/tokens.js';
import { findGeometry, disposeFindCache } from './crystals.js';
import { TUBE_R, CAM_Z } from './bands.js';

const DEG = Math.PI / 180;
/** The free column where finds sit, as fractions of the half horizontal FOV (θ > 0 = screen right):
 *  desktop/landscape between the date column (left) and the reading block (right); phone right of the date numeral. */
const FIND_WINDOW = Object.freeze({ wide: [-0.42, 0.1], phone: [0.14, 0.58] });
export const HOLD_DIST = 2.5;                                   // m in front of the camera
// Draw only finds inside the view's vertical span (eye level sits at ≈ 40 % of the height: 2.3 m above, 3.2 m below at
// the wall) plus their size — every drawn find costs two draw calls.
const VIEW_UP = 3.0, VIEW_DOWN = 4.0;
const PHONE_TITLE_PX = 150;
/** Held-find offset from the line of sight (hall-local m: −x = screen right, −y = down). */
const HOLD_AT = Object.freeze({ desktop: [-0.34, -0.46], 'phone-land': [-0.22, -0.18], phone: [0, -0.12] });

const _v = new Vector3(), _w = new Vector3(), _p = { x: 0, y: 0, depth: 0, visible: false };

/** Half horizontal FOV (rad) for a vertical fov (deg) and aspect. */
export function halfHfov(fovDeg, aspect) { return Math.atan(Math.tan((fovDeg * DEG) / 2) * aspect); }

export function createFinds(hctx, bands, y0) {
  const group = hctx.group;
  const list = [];
  const byBand = new Int16Array(bands.length).fill(-1);
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const g = findGeometry(b);
    if (!g) continue;
    const mat = createObsidian({ r1: false, rim: 0.62 });
    const mesh = new Mesh(g.solid, mat);
    mesh.name = `archive:find:${b.id}`;
    mesh.frustumCulled = false;
    const edges = createLines({ segments: g.edges, color: 'silver', alpha: 0.62, width: 1, far: 120 });
    mesh.add(edges.mesh);
    let ember = null;
    if (b.kind === 'achievement') {
      ember = createLines({ segments: g.edges, color: 'ember', alpha: 0.8, width: 1, far: 120 });
      ember.mesh.visible = false;
      mesh.add(ember.mesh);
    }
    const rnd = mulberry32(b.seed ^ 0xf1d5);
    const f = {
      bi: i, band: b, size: g.size, shared: g.shared, mesh, mat, edges, ember, proxy: null,
      s: rnd(), dy: (rnd() * 2 - 1) * 0.2 * Math.max(0, b.height - g.size),
      // A seeded three-quarter attitude (never face-on: a tetrahedron seen square to a face reads as a flat triangle).
      bx: (rnd() < 0.5 ? -1 : 1) * (0.42 + 0.3 * rnd()), by: rnd() * Math.PI * 2, bz: (rnd() < 0.5 ? -1 : 1) * (0.22 + 0.25 * rnd()),
      home: new Vector3(), on: false,
    };
    mesh.visible = false;
    group.add(mesh);
    byBand[i] = list.length;
    list.push(f);
  }

  // Extraction state.
  let held = -1, putting = -1;                                  // held: extracted (or extracting); putting: returning
  const ext = Spring.from(SPRING.medium, 0);
  let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, dragging = false;
  let eyeY = 0, alpha = 1, focusBand = -1, reduced = false;
  // Where the held find floats, still 2.5 m in front of the eye: desktop/landscape a little right of and below the line of
  // sight, in the open field between the hall title (left, at the datum) and the reading block (upper right), so the
  // held crystal never covers a word; phone a little low, between the title band and the sheet.
  let holdX = 0, holdY = 0;

  function place(kind) {
    const phone = kind === 'phone';
    const aspect = Math.max(0.3, hctx.layout.w / Math.max(1, hctx.layout.h));
    const half = halfHfov(35, aspect);
    const win = phone ? FIND_WINDOW.phone : FIND_WINDOW.wide;
    const lo = Math.max(-30 * DEG, win[0] * half), hi = Math.min(30 * DEG, win[1] * half);
    const hold = HOLD_AT[kind] || HOLD_AT.desktop;
    holdX = hold[0]; holdY = hold[1];
    for (const f of list) {
      const th = lo + (hi - lo) * f.s;
      const r = TUBE_R - 0.2 + 0.45 * f.size;                   // the front-most point 0.2 m proud of the wall
      f.home.set(-r * Math.sin(th), y0 + f.band.y + f.dy, r * Math.cos(th));
      f.mesh.position.copy(f.home);
    }
  }

  function addProxies(onActivate, onHover) {
    if (!hctx.overlay || !hctx.scale) return;
    for (let k = 0; k < list.length; k++) {
      const f = list[k];
      const label = f.band.title || f.band.label || 'находка';
      f.proxy = hctx.overlay.add({
        owner: 'archive', id: f.band.id,
        get: (out) => { hctx.toCanonical(f.mesh.position, _v); hctx.scale.toRender(_v, out); },
        button: { label, onActivate: () => onActivate(k) },
        lowpass: 0,
      });
      if (f.proxy.button) {
        f.proxy.button.dataset.qa = 'find';
        if (onHover) {
          f.proxy.button.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') onHover(k); });
          f.proxy.button.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') onHover(-1); });
        }
      }
      f.proxy.setVisible(false);
    }
  }

  const finds = {
    list, byBand,
    get held() { return held; },
    get busy() { return held >= 0 || putting >= 0; },
    place,
    addProxies,
    setReduced(b) { reduced = !!b; },
    /** k = find index; starts the extraction (600 ms medium spring; reduced motion: a cut). */
    extract(k) {
      if (k < 0 || k >= list.length) return false;
      if (putting >= 0 && putting !== k) { list[putting].mesh.position.copy(list[putting].home); putting = -1; }
      if (held >= 0 && held !== k) finds.putBack(true);
      held = k; putting = -1;
      yaw = 0; pitch = 0; vYaw = 0; vPitch = 0;
      ext.target = 1;
      if (reduced) ext.snap(1);
      return true;
    },
    putBack(instant = false) {
      if (held < 0) return false;
      putting = held; held = -1; dragging = false;
      ext.target = 0;
      if (instant || reduced) { ext.snap(0); }
      return true;
    },
    /** Hold-drag rotation (px). */
    rotateBy(dx, dy) { if (held < 0) return; dragging = true; yaw += dx * 0.012; pitch += dy * 0.012; vYaw = 0; vPitch = 0; },
    /** Release with the pointer's velocity (px/ms) → spin on (× 0.96 per frame). */
    fling(vx, vy) { if (held < 0) return; dragging = false; vYaw = vx * 12; vPitch = vy * 12; },
    /** Screen hit test (CSS px) → find index or −1 (only drawn finds). */
    hit(x, y) {
      if (!hctx.rig) return -1;
      let best = -1, bd = Infinity;
      for (let k = 0; k < list.length; k++) {
        const f = list[k];
        if (!f.mesh.visible) continue;
        hctx.toCanonical(f.mesh.position, _v); hctx.scale.toRender(_v, _w);
        hctx.rig.project(_w, _p);
        if (!(_p.depth > 0)) continue;
        const rpx = Math.max(26, (0.55 * f.size * hctx.scale.s / _p.depth) * hctx.layout.h / (2 * Math.tan(17.5 * DEG)));
        const d = Math.hypot(_p.x - x, _p.y - y);
        if (d < rpx && d < bd) { bd = d; best = k; }
      }
      return best;
    },
    /** Render-space position of a find (lamp focus). */
    renderPos(k, out) { hctx.toCanonical(list[k].mesh.position, _v); return hctx.scale.toRender(_v, out); },
    setAlpha(a) { alpha = a; },
    setFocusBand(i) { focusBand = i; },
    /** Per frame (allocation-free). eye = camera eye y (hall-local); proxiesOn = destination interactive. */
    update(dt, eye, proxiesOn) {
      eyeY = eye;
      for (let r = dt; r > 1e-6; r -= 0.12) ext.step(r > 0.12 ? 0.12 : r);
      if (!reduced) {
        if (!dragging && held >= 0) {
          const k = Math.pow(MOTION.spinDecay, (dt * 1000) / MOTION.frameMs);
          yaw += vYaw * dt; pitch += vPitch * dt; vYaw *= k; vPitch *= k;
        }
      } else { yaw += vYaw * dt; pitch += vPitch * dt; vYaw = 0; vPitch = 0; }
      const e = Math.max(0, Math.min(1.04, ext.x));
      if (putting >= 0 && ext.x < 0.002 && Math.abs(ext.v) < 0.02) { list[putting].mesh.position.copy(list[putting].home); putting = -1; ext.snap(0); }
      const active = held >= 0 ? held : putting;
      for (let k = 0; k < list.length; k++) {
        const f = list[k];
        const dyv = f.home.y - eyeY;
        let near = dyv < VIEW_UP && dyv > -VIEW_DOWN;
        // Phone: the hall title owns the top 150 px — a find whose top would reach into it stays in the dark.
        if (near && k !== active && hctx.layout.isPhone && hctx.rig) {
          hctx.toCanonical(f.home, _v); hctx.scale.toRender(_v, _w);
          hctx.rig.project(_w, _p);
          const rpx = (0.5 * f.size * hctx.scale.s / Math.max(1e-6, _p.depth)) * hctx.layout.h / (2 * Math.tan(17.5 * DEG));
          if (_p.y - rpx < PHONE_TITLE_PX) near = false;
        }
        const on = alpha > 0.001 && (near || k === active);
        if (on !== f.on) { f.on = on; f.mesh.visible = on; }
        if (f.proxy) f.proxy.setVisible(on && proxiesOn && near);
        if (!on) continue;
        if (k === active) {
          // home → 2.5 m in front of the eye (hall-local: the camera looks along +z).
          f.mesh.position.set(f.home.x + (holdX - f.home.x) * e, f.home.y + (eyeY + holdY - f.home.y) * e, f.home.z + (CAM_Z + HOLD_DIST - f.home.z) * e);
          f.mesh.rotation.set(f.bx + pitch * Math.min(1, e), f.by + yaw * Math.min(1, e), f.bz * (1 - 0.6 * Math.min(1, e)));
        } else {
          f.mesh.rotation.set(f.bx, f.by, f.bz);
        }
        f.mat.uniforms.uAlpha.value = alpha;
        f.edges.setAlpha(0.62 * alpha);
        if (f.ember) f.ember.mesh.visible = alpha > 0.5 && (f.bi === focusBand || k === held);
      }
      if (held < 0 && putting < 0) { yaw = 0; pitch = 0; }
    },
    dispose() {
      for (const f of list) {
        if (f.proxy) f.proxy.remove();
        f.edges.dispose();
        if (f.ember) f.ember.dispose();
        f.mat.dispose();
        if (!f.shared) f.mesh.geometry.dispose();
        if (f.mesh.parent) f.mesh.parent.remove(f.mesh);
      }
      list.length = 0;
      disposeFindCache();
    },
  };
  return finds;
}
