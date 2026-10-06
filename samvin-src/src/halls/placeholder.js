// halls/placeholder.js — the WP0 placeholder hall (ARCH §3.7.5, §6.1.5). Every hall seed returns one of these until its
// WP replaces it: the host's shell + a few hairline props laid out like the real hall (so screenshots differ from CORE),
// the SPEC §6 rest pose (desktop / phone / landscape), one BODY line «Зал строится.» on a scrim (desktop) or in the
// sheet peek (phone), setSub() accepting any sub, enter/exit fading the props, the hall elevator on wheel / vertical
// swipe (VOYAGES: wheel altitude 60–140 m), and Tab-focusable DOM proxies on MEMBERS' columns.
// The copy «Зал строится.» exists only here and must never be visible once the owning WP has merged (§7.6 C6).
import { Vector3, IcosahedronGeometry } from 'three';
import { createLines } from '../render/lines.js';
import { createPoints } from '../render/points.js';
import { LAYER } from '../render/uniforms.js';
import { createElevator } from '../nav/elevator.js';
import { mulberry32 } from '../core/rng.js';
import { clamp01 } from '../core/ease.js';
import { CAMERA } from '../core/tokens.js';

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const ELEVATOR_ROOMS = new Set(['SIGNAL', 'MEMBERS', 'INSIGNIA', 'NADIR', 'ZENITH', 'ARCHIVE']);
const COPY = 'Зал строится.';

// Pose writers (module level: pose() is on the G9 hot-path list — no allocation, no closures per call).
const _pp = [0, 0, 0];
function P(out, pos, tx, ty, tz, fov = CAMERA.fov, offsetY = 0) {
  out.pos.set(pos[0], pos[1], pos[2]); out.target.set(tx, ty, tz);
  out.fov = fov; out.offsetY = offsetY; out.roll = 0;
  return out;
}
/** Looking along −Z, pitched by deg, aimed where the ray meets y = groundY. */
function pitched(out, pos, deg, groundY, fov) {
  return P(out, pos, pos[0], groundY, pos[2] + (groundY - pos[1]) / Math.tan(deg * DEG), fov);
}
function xyz(x, y, z) { _pp[0] = x; _pp[1] = y; _pp[2] = z; return _pp; }

/** Hall-local rest pose (SPEC §6, ARCH §6.1.5) for the current layout, written into `out`. */
function restPose(id, kind, alt, out) {
  const phone = kind === 'phone';
  let t;
  switch (id) {
    case 'MEMBERS': t = CAMERA.members.target; return P(out, phone ? CAMERA.members.phonePos : CAMERA.members.pos, t[0], t[1], t[2]);
    case 'VOYAGES':
      if (phone) return pitched(out, CAMERA.voyages.phonePos, -CAMERA.voyages.phonePitchDeg, 0);
      return P(out, xyz(0, alt, alt * (44 / 70)), 0, 0, -6 * (alt / 70));
    case 'ARCHIVE': return P(out, xyz(0, 1.6, 0), 0, 1.6, CAMERA.archive.tubeR);
    case 'SIGNAL':
      if (phone) return P(out, CAMERA.signal.phonePos, 0, 2 + 30 * Math.tan(CAMERA.signal.phonePitchDeg * DEG), 0, CAMERA.fovWide);
      t = CAMERA.signal.target; return P(out, CAMERA.signal.pos, t[0], t[1], t[2], CAMERA.signal.fov);
    case 'INSIGNIA': return P(out, CAMERA.insignia.pos, 0, 1.7, -10, CAMERA.insignia.fov);
    case 'NADIR': return P(out, xyz(0, 20, 40), 0, 0, 0);
    case 'ZENITH': return pitched(out, xyz(0, 50, 30), phone ? CAMERA.zenith.phonePitchDeg : CAMERA.zenith.pitchDeg, -110);
    case 'WORKSHOP': return P(out, xyz(0, 0, 3.2), 0, 0, 0);
    default: t = CAMERA.core.target; return P(out, CAMERA.core.pos, t[0], t[1], t[2], CAMERA.core.fov, kind === 'desktop' ? 0 : CAMERA.core.phoneOffsetY);
  }
}

// ─── Props (hall-local segment / point arrays) ────────────────────────────────────────────────────────────────
function ring(out, r, y, n = 48, cx = 0, cz = 0) {
  for (let k = 0; k < n; k++) {
    const a0 = (TAU * k) / n, a1 = (TAU * (k + 1)) / n;
    out.push(cx + Math.sin(a0) * r, y, cz + Math.cos(a0) * r, cx + Math.sin(a1) * r, y, cz + Math.cos(a1) * r);
  }
}
/** A 24 m hyperboloid hairline column at (x, z): two twisted generator families + end rings. */
function column(out, x, z) {
  const H = 24, R = 1.2, G = 10, TW = 0.75 * Math.PI;
  for (const s of [1, -1]) {
    for (let g = 0; g < G; g++) {
      const a = (TAU * g) / G;
      out.push(x + Math.sin(a) * R, 0, z + Math.cos(a) * R, x + Math.sin(a + s * TW) * R, H, z + Math.cos(a + s * TW) * R);
    }
  }
  ring(out, R, 0, 14, x, z); ring(out, R, H, 14, x, z); ring(out, R * 1.6, H, 14, x, z);
}
function stars(count, seed, minY, r) {
  const rnd = mulberry32(seed);
  const p = new Float32Array(count * 3);
  for (let k = 0; k < count; k++) {
    const a = rnd() * TAU, e = Math.asin(0.15 + 0.85 * rnd());
    p[3 * k] = Math.cos(e) * Math.sin(a) * r; p[3 * k + 1] = minY + Math.sin(e) * r; p[3 * k + 2] = Math.cos(e) * Math.cos(a) * r;
  }
  return p;
}

function buildProps(kind, hctx) {
  const seg = [];
  let pts = null;
  const anchors = [];                       // [{ id, label, pos: Vector3 (hall-local) }]
  switch (kind) {
    case 'columns': {
      const ms = hctx.world.members;
      const n = ms.length;
      // Roster order with the operator in the middle (SPEC §6.2).
      const order = ms.filter((m) => m.id !== hctx.world.operator.id);
      const op = ms.find((m) => m.id === hctx.world.operator.id);
      if (op) order.splice(Math.floor(order.length / 2), 0, op);
      order.forEach((m, k) => {
        const th = n > 1 ? (-25 + (50 * k) / (n - 1)) * DEG : 0;
        const x = 48 * Math.sin(th), z = 48 - 48 * Math.cos(th);
        column(seg, x, z);
        anchors.push({ id: m.id, label: m.name, pos: new Vector3(x, 24, z) });
      });
      break;
    }
    case 'hatches':
      for (let k = 0; k < 9; k++) { const r = 14 * Math.sqrt(k), a = k * 137.508 * DEG; ring(seg, 2.25, 0.05, 24, Math.sin(a) * r, Math.cos(a) * r); }
      break;
    case 'bands':
      for (let k = 0; k < 12; k++) ring(seg, CAMERA.archive.tubeR, 2.0 - 1.6 * k, 56);
      break;
    case 'sky': {
      // The ceiling converging 110 m up into the open apex: two twisted families of 24 hairline generators from the
      // deck ring (r 60) to the 12 m apex ring, plus the apex ring itself.
      const H = CAMERA.signal.apexH, Ra = CAMERA.signal.apexR;
      ring(seg, Ra, H, 36);
      for (let k = 1; k < 6; k++) ring(seg, 60 + (Ra - 60) * (k / 6), (H * k) / 6, 48);   // survey rings up the cone
      for (const sgn of [1, -1]) {
        for (let g = 0; g < 24; g++) {
          const a = (TAU * g) / 24, b = a + sgn * (TAU / 6);
          seg.push(Math.sin(a) * 60, 0, Math.cos(a) * 60, Math.sin(b) * Ra, H, Math.cos(b) * Ra);
        }
      }
      pts = stars(300, 0x5161, CAMERA.signal.apexH, 900);
      break;
    }
    case 'dome': {
      // Every edge of the frequency-1 icosphere once (what EdgesGeometry(…, 1°) yields; done here to keep it out of the
      // bundle), lifted to the eye height 1.7 m.
      const ico = new IcosahedronGeometry(CAMERA.insignia.sphereR, 1);
      const a = ico.attributes.position.array, seen = new Set();
      const key = (o) => `${a[o].toFixed(3)},${a[o + 1].toFixed(3)},${a[o + 2].toFixed(3)}`;
      for (let t = 0; t < a.length; t += 9) {
        for (const [p, q] of [[0, 3], [3, 6], [6, 0]]) {
          const ka = key(t + p), kb = key(t + q), k = ka < kb ? ka + '|' + kb : kb + '|' + ka;
          if (seen.has(k)) continue;
          seen.add(k);
          seg.push(a[t + p], a[t + p + 1] + 1.7, a[t + p + 2], a[t + q], a[t + q + 1] + 1.7, a[t + q + 2]);
        }
      }
      ico.dispose();
      break;
    }
    case 'chamber': {
      const D = CAMERA.nadir.depth, R = 40;
      for (let j = 0; j < 3; j++) {
        const a0 = (TAU * j) / 3, a1 = (TAU * (j + 1)) / 3;
        seg.push(Math.sin(a0) * R, 0, Math.cos(a0) * R, Math.sin(a1) * R, 0, Math.cos(a1) * R);
        seg.push(Math.sin(a0) * R, 0, Math.cos(a0) * R, 0, -D, 0);
      }
      break;
    }
    case 'zenith':
      pts = stars(400, 0x2e17, -40, 1200);
      break;
    case 'grid':
    default: {
      pts = new Float32Array(49 * 3);
      for (let k = 0; k < 49; k++) { pts[3 * k] = ((k % 7) - 3) * 0.4; pts[3 * k + 1] = (3 - Math.floor(k / 7)) * 0.4; pts[3 * k + 2] = 0; }
      break;
    }
  }
  return { seg, pts, anchors };
}

/** @returns {Hall} */
export function createPlaceholderHall(hctx, opts = {}) {
  const id = hctx.id, meta = hctx.meta;
  const kind = opts.props || 'grid';
  let lines = null, points = null, block = null, elevator = null;
  const proxies = [];
  let enterA = 0, exitA = 0, sub = null, current = false, vAlt = CAMERA.voyages.pos[1];
  const _v = new Vector3();
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };

  function applyAlpha() {
    const a = clamp01(enterA) * (1 - clamp01(exitA));
    if (lines) lines.setAlpha(0.55 * a);
    if (points) points.setAlpha((kind === 'grid' ? 0.9 : 0.4) * a);
    if (block) block.style.opacity = String(clamp01(enterA) * (1 - clamp01(exitA * 2)));
    const on = enterA >= 0.7 && exitA === 0;
    for (const p of proxies) p.setVisible(on);
  }

  function readable() {
    const el = document.createElement('div');
    el.className = 'ph-block scrim';
    const p = document.createElement('p');
    p.className = 't-body';
    p.textContent = COPY;
    el.appendChild(p);
    return el;
  }

  const hall = {
    id,
    build() {
      const { seg, pts, anchors } = buildProps(kind, hctx);
      if (hctx.group) {
        if (seg.length) {
          lines = createLines({ segments: new Float32Array(seg), color: 'silver', alpha: 0.55, width: 1, far: Math.max(meta.far, 200) });
          lines.mesh.name = `ph:${kind}`;
          hctx.group.add(lines.mesh);
        }
        if (pts) {
          const sky = kind === 'sky' || kind === 'zenith';
          points = createPoints({ positions: pts, sizePx: sky ? 2 : 4, color: sky ? 'white' : 'silver', alpha: 0.4, fog: !sky,
            layer: sky ? LAYER.NOFOG : LAYER.DEFAULT });
          hctx.group.add(points.object);
        }
      }
      if (hctx.overlay && anchors.length && hctx.scale) {
        for (const a of anchors) {
          const local = a.pos.clone();
          proxies.push(hctx.overlay.add({
            owner: 'placeholder', id: a.id,
            get: (out) => { hctx.toCanonical(local, _v); hctx.scale.toRender(_v, out); },
            leader: { side: 'right', len: 40, rise: -24 },
            button: { label: a.label, onActivate: () => hctx.director.go(`#/members/${a.id}`, { source: 'hall' }) },
          }));
        }
      }
      if (!(hctx.layout.isPhone)) { block = readable(); hctx.section.appendChild(block); }
      if (ELEVATOR_ROOMS.has(id)) elevator = createElevator(hctx);
      applyAlpha();
    },
    pose(s) { void s; return restPose(id, hctx.layout.kind, vAlt, poseOut); },
    /** H18 (X§2.4.5): 6 hall-local points on a ring of radius 11 m around the rest camera's target, at deck height
     *  (so WP13's ПОТЕРЯШКА works before the hall WPs land). PURE. */
    lostSpots() {
      const p = restPose(id, hctx.layout.kind, vAlt, { pos: new Vector3(), target: new Vector3(), fov: 0, offsetY: 0, roll: 0 });
      const out = [];
      for (let k = 0; k < 6; k++) {
        const a = (TAU * k) / 6;
        out.push(new Vector3(p.target.x + Math.sin(a) * 11, 0, p.target.z + Math.cos(a) * 11));
      }
      return out;
    },
    livePose(out) {
      // VOYAGES wheel altitude 60–140 m (desktop pitch kept); allocation-free.
      if (id !== 'VOYAGES' || vAlt === CAMERA.voyages.pos[1] || hctx.layout.kind === 'phone') return false;
      out.pos.set(0, vAlt, vAlt * (44 / 70)); out.target.set(0, 0, -6 * (vAlt / 70));
      out.fov = CAMERA.fov; out.offsetY = 0; out.roll = 0;
      return true;
    },
    enter(u) { enterA = u; if (u > 0) exitA = 0; applyAlpha(); },
    exit(u) { exitA = u; applyAlpha(); },
    arrive() {
      current = true; enterA = 1; exitA = 0; applyAlpha();
      if (hctx.layout.isPhone && hctx.sheet) {
        hctx.sheet.set(readable(), { peek: null, state: 'peek' });
      }
    },
    depart() {
      current = false;
      if (elevator) elevator.reset();
      if (hctx.layout.isPhone && hctx.sheet) hctx.sheet.set(null);
    },
    setSub(s) { sub = s == null ? null : String(s); return 0; },
    update() {},
    onGesture(g) {
      if (!current) return false;
      if (id === 'VOYAGES' && g.type === 'wheel') {
        const r = CAMERA.voyages.altRange;
        vAlt = Math.max(r[0], Math.min(r[1], vAlt + g.deltaY * 0.08));
        return true;
      }
      if (!elevator) return false;
      if (g.type === 'wheel') return elevator.onWheel(g);
      if (g.type === 'swipe') return elevator.onSwipe(g);
      return false;
    },
    onKey() { return false; },
    resize() {
      if (!current || !hctx.sheet) return;
      if (hctx.layout.isPhone && !block) hctx.sheet.set(readable(), { peek: null, state: 'peek' });
    },
    dispose() {
      if (lines) { lines.dispose(); if (lines.mesh.parent) lines.mesh.parent.remove(lines.mesh); lines = null; }
      if (points) { if (points.dispose) points.dispose(); if (points.object.parent) points.object.parent.remove(points.object); points = null; }
      for (const p of proxies) p.remove();
      proxies.length = 0;
      if (block && block.parentNode) block.parentNode.removeChild(block);
      block = null;
      if (current && hctx.layout.isPhone && hctx.sheet) hctx.sheet.set(null);
      current = false;
    },
    /** WP0 seed extra: the last sub set (tests). */
    get sub() { return sub; },
  };
  return hall;
}
