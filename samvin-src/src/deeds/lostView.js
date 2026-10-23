// deeds/lostView.js — the WebGL picture of ПОТЕРЯШКА and ДОГОВОРИЛИСЬ (SPEC-ADDENDUM A5.1, A11.4; ARCH-ADDENDUM X§2.6.4).
// OWNER: WP13. One R3 ribbon batch = ONE draw call for everything: the 0.30 m mini-Key(s) (the SPEC profile × 0.125, its 7
// strata as hairline outlines — top ring, bottom ring and the n edges of every stratum, 126 segments — 1 px --silver at
// 80 %), each nucleus (a 2 px dot-length segment, --pewter, stuttering), and on a pair day the two bond threads
// (1 px --silver drawn by a moving 2 px --white head) and the agreement line. ≈ 127 segments for one, ≈ 281 for a pair.
// The controller (lost.js) writes `st` every frame; frame() turns it into hall-local segments (allocation-free).
import { Vector3 } from 'three';
import { createLines } from '../render/lines.js';
import { U } from '../render/uniforms.js';
import { STRATA_GEOM, radiusAt } from '../world/structure.js';

const S = 0.125;                                  // mini-Key scale (2.4 m → 0.30 m)
const GOLD = (137.508 * Math.PI) / 180;
const TAU = Math.PI * 2;
const PER_KEY = STRATA_GEOM.reduce((a, s) => a + 3 * s.n, 0) + 1;   // 126 outline + 1 nucleus
const THREAD_SEG = 12;
const CAP = PER_KEY * 2 + 2 * (THREAD_SEG + 1) + 1;
const C_SILVER = 0, C_WHITE = 1, C_PEWTER = 2, C_EMBER = 3;
const TOK = ['cSilver', 'cWhite', 'cPewter', 'cEmber'];

/** Per mini-Key state written by the controller. */
function keyState() {
  return {
    align: new Float32Array(7),        // 0 scrambled (stratum i at i·137.508°) … 1 aligned
    face: 0,                           // rad, hall-local yaw of face 0 (atan2(dx, dz) of the direction it faces)
    hide: 0,                           // 0 shown … 1 hidden (0.4 m behind, dimmed)
    nucOn: 1,                          // stutter gate 0/1 (or a fade on reduced motion)
    nuc: C_PEWTER,                     // colour index of the nucleus
    nucDark: 0,                        // 1 = dark (hidden)
    scale: 1,                          // the flight shrinks it
    alpha: 1,
    shiver: 0,                         // m, along the camera right
    off: 0,                            // m along `right` (glide toward the other)
    visible: true,
  };
}

export function createLostView(hctx, kind, spotLocal, rightLocal, camLocal) {
  const seg = new Float32Array(CAP * 6);
  const col = new Float32Array(CAP * 3);
  const wid = new Float32Array(CAP);
  const alp = new Float32Array(CAP);
  const ci = new Uint8Array(CAP);               // colour index per segment
  const lines = createLines({ segments: seg, count: 0, color: col, width: wid, alpha: alp, glint: 0.25, far: 120 });
  lines.uniforms.uAlpha.value = 1;
  lines.mesh.name = 'lost';
  lines.mesh.renderOrder = 5;
  hctx.group.add(lines.mesh);
  const pair = kind === 'pair';
  const keys = pair ? [keyState(), keyState()] : [keyState()];
  const st = {
    keys,
    threads: 0,         // 0..1: the heads meet at 1 (the midpoint)
    threadA: 1,         // thread alpha (retract / fade)
    line: 0,            // agreement line alpha
  };
  const centre = new Vector3().copy(spotLocal);
  const right = new Vector3().copy(rightLocal).setY(0);
  if (right.lengthSq() < 1e-9) right.set(1, 0, 0); else right.normalize();
  const away = new Vector3();
  const camL = new Vector3().copy(camLocal);
  const pos = [new Vector3(), new Vector3()];
  const nucP = [new Vector3(), new Vector3()];
  const _a = new Vector3(), _b = new Vector3(), _w = new Vector3();
  let n = 0;

  function push(ax, ay, az, bx, by, bz, c, w, a) {
    const o = n * 6;
    seg[o] = ax; seg[o + 1] = ay; seg[o + 2] = az; seg[o + 3] = bx; seg[o + 4] = by; seg[o + 5] = bz;
    ci[n] = c; wid[n] = w; alp[n] = a;
    n++;
  }

  /** Base position of mini-Key m (hall-local) → pos[m] */
  function place(m, k) {
    const half = pair ? 0.8 - k.off : 0;
    pos[m].copy(centre).addScaledVector(right, pair ? (m === 0 ? -half : half) : 0).addScaledVector(right, k.shiver);
    if (k.hide > 0) {
      away.copy(centre).sub(camL).setY(0);
      if (away.lengthSq() < 1e-9) away.set(0, 0, -1); else away.normalize();
      pos[m].addScaledVector(away, 0.4 * k.hide);
    }
    return pos[m];
  }

  function key(m, k) {
    const p = place(m, k);
    const s = S * k.scale;
    const a0 = k.face;                                   // absolute hall-local yaw of face 0 (signs)
    const vis = (k.visible ? 1 : 0) * k.alpha * (1 - 0.75 * k.hide);
    for (const g of STRATA_GEOM) {
      const yaw = a0 + (1 - k.align[g.i]) * g.i * GOLD;
      const rt = radiusAt(g.top) * s, rb = radiusAt(g.bot) * s, yt = p.y + g.top * s, yb = p.y + g.bot * s;
      const a = 0.8 * vis;
      for (let j = 0; j < g.n; j++) {
        const t0 = yaw + (TAU * j) / g.n - Math.PI / g.n, t1 = t0 + TAU / g.n;
        const s0 = Math.sin(t0), c0 = Math.cos(t0), s1 = Math.sin(t1), c1 = Math.cos(t1);
        push(p.x + s0 * rt, yt, p.z + c0 * rt, p.x + s1 * rt, yt, p.z + c1 * rt, C_SILVER, 1, rt > 1e-6 ? a : 0);
        push(p.x + s0 * rb, yb, p.z + c0 * rb, p.x + s1 * rb, yb, p.z + c1 * rb, C_SILVER, 1, rb > 1e-6 ? a : 0);
        push(p.x + s0 * rt, yt, p.z + c0 * rt, p.x + s0 * rb, yb, p.z + c0 * rb, C_SILVER, 1, a);
      }
    }
    // the nucleus: a 2 px dot (a 4 mm segment along the right vector)
    nucP[m].copy(p);
    const on = k.nucDark ? 0 : k.nucOn;
    push(p.x - right.x * 0.002 * s / S, p.y, p.z - right.z * 0.002 * s / S, p.x + right.x * 0.002 * s / S, p.y, p.z + right.z * 0.002 * s / S,
      k.nuc, 2, vis > 0 ? on * Math.max(0.35, vis) : 0);
  }

  function threads() {
    const g = Math.max(0, Math.min(1, st.threads));
    for (let m = 0; m < 2; m++) {
      _a.copy(nucP[m]);
      _b.copy(nucP[1 - m]).add(nucP[m]).multiplyScalar(0.5);                 // the midpoint
      for (let q = 0; q < THREAD_SEG; q++) {
        const u0 = (q / THREAD_SEG) * g, u1 = ((q + 1) / THREAD_SEG) * g;
        const h0 = Math.sin(Math.PI * u0 * 0.5) * 0.06, h1 = Math.sin(Math.PI * u1 * 0.5) * 0.06;   // a low arc
        push(_a.x + (_b.x - _a.x) * u0, _a.y + (_b.y - _a.y) * u0 + h0 * (1 - u0), _a.z + (_b.z - _a.z) * u0,
          _a.x + (_b.x - _a.x) * u1, _a.y + (_b.y - _a.y) * u1 + h1 * (1 - u1), _a.z + (_b.z - _a.z) * u1,
          C_SILVER, 1, g > 0 ? st.threadA : 0);
      }
      // the moving 2 px white head
      const hu = g;
      _w.copy(_a).lerp(_b, hu);
      push(_w.x - right.x * 0.003, _w.y, _w.z - right.z * 0.003, _w.x + right.x * 0.003, _w.y, _w.z + right.z * 0.003, C_WHITE, 2,
        g > 0 && g < 1 ? st.threadA : 0);
    }
    push(nucP[0].x, nucP[0].y, nucP[0].z, nucP[1].x, nucP[1].y, nucP[1].z, C_WHITE, 1, st.line);
  }

  const view = {
    st,
    kind,
    centre,
    right,
    mesh: lines.mesh,
    /** rebuilds the segments from st (call every frame while resident) */
    frame() {
      n = 0;
      for (let m = 0; m < keys.length; m++) key(m, keys[m]);
      if (pair) threads();
      for (let q = 0; q < n; q++) {
        const c = U[TOK[ci[q]]].value;
        col[q * 3] = c.r; col[q * 3 + 1] = c.g; col[q * 3 + 2] = c.b;
      }
      lines.setSegments(seg, n);
      const ga = lines.mesh.geometry.attributes;
      if (ga.aCol) ga.aCol.needsUpdate = true;
      if (ga.aW) ga.aW.needsUpdate = true;
      if (ga.aAl) ga.aAl.needsUpdate = true;
    },
    /** render-space point of mini-Key m (or the midpoint with m = -1) → out */
    world(m, out) {
      if (m < 0 && pair) out.copy(nucP[0]).add(nucP[1]).multiplyScalar(0.5);
      else out.copy(nucP[Math.max(0, m)]);
      return hctx.group.localToWorld(out);
    },
    /** render-space anchor of the DOM proxy / ring: the spot itself (the pair: the midpoint), no shiver — a proxy
     *  that trembles by a sub-pixel every frame is never "stable" for a pointer (and needs no tremble) → out */
    anchor(m, out) {
      if (m < 0 || !pair) out.copy(centre); else out.copy(centre).addScaledVector(right, m === 0 ? -0.8 : 0.8);
      return hctx.group.localToWorld(out);
    },
    /** hall-local base positions (before frame() ran) */
    local(m, out) { return out.copy(place(Math.max(0, m), keys[Math.max(0, m)])); },
    setVisible(b) { lines.mesh.visible = !!b; },
    dispose() { lines.dispose(); },
  };
  for (const k of keys) k.align.fill(0);
  view.frame();
  return view;
}

export const COLOR = { SILVER: C_SILVER, WHITE: C_WHITE, PEWTER: C_PEWTER, EMBER: C_EMBER };
