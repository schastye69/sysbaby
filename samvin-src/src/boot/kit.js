// boot/kit.js — WP2 internal: the boot's picture instruments, shared by every variant (desktop first visit, returning,
// same day, reduced, phone start, wake). Nothing here allocates per frame.
//   reveal      the Key's reveal (Key.setReveal + Structure parts): detection points one by one in a random order
//               (structure.vertices aAlpha), THE LINE (edges / fill behind the scan), full.
//   strata      the cryptex: per-stratum yaw through key.override (scramble, spin 2–4 rev/s decelerating so that each
//               stratum arrives aligned exactly on its lock frame, then the 4 % snap — a pure function of time, so ×2
//               and jumps stay exact; no face ticks while spinning: the lock clicks are the only sound).
//   camera      the boot camera (rig.setPose + the Lissajous 'drift' offset), the CORE rest pose.
//   world       rim lattice 0 → 6 % → 12 % (nest level 1 fade 0.5 / 1), axis beads and the pillar fire-up.
import { Vector3 } from 'three';
import { STRATA_GEOM } from '../world/structure.js';
import { layout } from '../core/layout.js';
import { CAMERA, HALL } from '../core/tokens.js';
import { EASE, clamp01 } from '../core/ease.js';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
export const GOLDEN = 137.508 * DEG;

// ─── reveal ──────────────────────────────────────────────────────────────────────────────────────────────────
export function createReveal(k) {
  const st = k.structure;
  const vObj = st && st.vertices;
  const aAl = vObj && vObj.geometry && vObj.geometry.attributes.aAlpha;
  // only the ring vertices are detected one by one; the extra points after them in the same draw (WP1's N slot dots,
  // structure.vertexExtra) keep the alphas their owner styled: hidden during detection, given back by restorePoints
  const n = aAl ? (st.vertexExtra ? st.vertexExtra.base : aAl.count) : 0;
  let saved = null;
  const order = new Uint32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  let seed = 0x2f6b9d1;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
  let shown = -1;
  const r = { points: 1, scanY: null, fill: 1, alpha: 1 };
  const rv = {
    count: n,
    /** detection: the first round(u·n) vertices in the shuffled order at full alpha. → number newly shown */
    points(u) {
      if (!aAl) return 0;
      const m = Math.round(clamp01(u) * n);
      if (m === shown) return 0;
      const arr = aAl.array;
      if (!saved && arr.length > n && m < n) { saved = arr.slice(n); arr.fill(0, n); }
      if (shown < 0) { arr.fill(0, 0, n); shown = 0; }
      const was = shown;
      if (m > shown) for (let i = shown; i < m; i++) arr[order[i]] = 1;
      else for (let i = m; i < shown; i++) arr[order[i]] = 0;
      shown = m;
      if (m === n && saved) { arr.set(saved, n); saved = null; }      // every ring vertex is in: the extras come back
      aAl.needsUpdate = true;
      return Math.max(0, m - was);
    },
    restorePoints() {
      if (!aAl || shown < 0 || (shown === n && !saved)) return;
      aAl.array.fill(1, 0, n);
      if (saved) { aAl.array.set(saved, n); saved = null; }
      aAl.needsUpdate = true; shown = n;
    },
    /** Key.setReveal + edges part. scanY: Key-local y of the plane (null = none). */
    set(points, fill, alpha, edges, scanY = null) {
      r.points = points; r.fill = fill; r.alpha = alpha; r.scanY = scanY;
      k.setReveal(r);
      if (st && typeof st.setParts === 'function') st.setParts({ edges });
    },
    full() { rv.restorePoints(); rv.set(1, 1, 1, 1, null); },
    hidden() { rv.set(0, 0, 0, 0, null); },
  };
  return rv;
}

// ─── strata (the cryptex) ───────────────────────────────────────────────────────────────────────────────────
const SNAP_W = 22, SNAP_Z = 0.716;                       // the 4 % overshoot spring (ζ for 4 %, ω 22)
const SNAP_WD = SNAP_W * Math.sqrt(1 - SNAP_Z * SNAP_Z);
const SNAP_S = 0.16;                                     // the deceleration lands this far short; the snap closes it
function snapResp(tau) {                                 // step response 0 → 1 with 4 % overshoot (tau s)
  if (tau <= 0) return 0;
  const e = Math.exp(-SNAP_Z * SNAP_W * tau);
  return 1 - e * (Math.cos(SNAP_WD * tau) + (SNAP_Z / Math.sqrt(1 - SNAP_Z * SNAP_Z)) * Math.sin(SNAP_WD * tau));
}

export function createStrata(k) {
  const o = [], st = [];
  for (let i = 0; i < 7; i++) {
    o.push({ yaw: 0, edgeFlash: 0 });
    st.push({ a0: 0, spinFrom: -1, lockAt: -1, d: 0, dir: 1, held: false, flash: -1, out: 0, snapFrom: null, relFrom: null, relMs: 0, relTo: 0, relA: 0, figT: -1, figW: 0, figA: 0, face: 0 });
  }
  let rnd = 0x51ed27;
  const R = () => { rnd = (rnd * 1103515245 + 12345) >>> 0; return rnd / 4294967296; };
  const norm = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  let attached = false;
  const S = {
    /** 'golden' (i·137.508°), 'random', or an array of radians; aligned strata stay aligned until spun. */
    scramble(kind) {
      for (let i = 0; i < 7; i++) {
        const s = st[i];
        s.a0 = kind === 'golden' ? norm(i * GOLDEN) : Array.isArray(kind) ? (+kind[i] || 0) : norm((R() - 0.5) * TAU * 0.9 + (i % 2 ? 0.6 : -0.6));
        if (Math.abs(s.a0) < 0.35) s.a0 += s.a0 < 0 ? -0.5 : 0.5;    // visibly scrambled, never almost aligned
        s.spinFrom = -1; s.lockAt = -1; s.held = false; s.out = s.a0; s.snapFrom = null; s.relFrom = null; s.figT = -1; s.home = s.a0;
      }
      S.attach();
    },
    aligned() { for (let i = 0; i < 7; i++) { const s = st[i]; s.a0 = 0; s.spinFrom = -1; s.lockAt = -1; s.out = 0; s.snapFrom = null; s.relFrom = null; s.figT = -1; } S.attach(); },
    attach() {
      if (attached) return;
      attached = true;
      k.setScramble(null);
      k.setOverrideWeight(1);
      for (let i = 0; i < 7; i++) k.override(i, o[i]);
    },
    /** stratum i spins from tSpin (ms) and locks exactly at tLock (ms): 2–4 rev/s, decelerating. */
    plan(i, tSpin, tLock) {
      const s = st[i];
      const T = Math.max(0.12, (tLock - tSpin) / 1000);
      const w0 = (2 + 2 * R()) * TAU * (i % 2 ? -1 : 1);            // target initial ω (rad/s), alternating directions
      const want = (w0 * T) / 2;                                     // constant deceleration to rest: Δ = ω0·T/2
      const start = s.a0;
      // land SNAP_S short of an aligned angle (in the direction of travel), as close to `want` as possible
      const dir = Math.sign(want) || 1;
      const m = Math.round((start + want + dir * SNAP_S) / TAU);
      s.d = m * TAU - dir * SNAP_S - start;
      s.dir = dir;
      s.spinFrom = tSpin; s.lockAt = tLock; s.held = false; s.snapFrom = null; s.relFrom = null; s.figT = -1;
    },
    /** snap stratum i to aligned now-ish without a spin (phone crossing, reduced motion, same-day locks) */
    lockNow(i, t, from = null) {
      const s = st[i];
      s.a0 = from != null ? from : s.out;
      s.spinFrom = t; s.lockAt = t; s.d = 0; s.dir = Math.sign(-norm(s.a0)) || 1;
      s.snapFrom = norm(s.a0);
      s.held = false; s.figT = -1; s.relFrom = null;
    },
    /** drift a stratum back to its scramble over ms (phone partial stroke) */
    release(i, t, ms, to) {
      const s = st[i];
      s.relFrom = t; s.relMs = ms; s.relTo = to; s.relA = s.out;
      s.spinFrom = -1; s.lockAt = -1; s.figT = -1; s.snapFrom = null;
    },
    /** phone fidget: a horizontal flick spins stratum i by velocity w0 (rad/s), decaying (τ 0.45 s); onFace(i) per face */
    fidget(i, t, w0) {
      const s = st[i];
      if (s.lockAt >= 0 && t >= s.lockAt) { s.a0 = s.out; }
      s.figT = t; s.figW = w0; s.figA = s.out; s.spinFrom = -1; s.lockAt = -1; s.relFrom = null; s.snapFrom = null;
      s.face = Math.floor(s.out / (TAU / STRATA_GEOM[i].n));
    },
    onFace: null,
    /** the scramble angle stratum i returns to after a partial stroke */
    home(i) { return st[i].home != null ? st[i].home : st[i].a0; },
    isLocked(i, t) { const s = st[i]; return s.lockAt >= 0 && t >= s.lockAt; },
    /** writes the overrides for timeline time t (ms) */
    update(t) {
      for (let i = 0; i < 7; i++) {
        const s = st[i];
        let y;
        if (s.figT >= 0) {
          const x = (t - s.figT) / 1000;
          y = s.figA + s.figW * 0.45 * (1 - Math.exp(-x / 0.45));
          const f = Math.floor(y / (TAU / STRATA_GEOM[i].n));
          if (f !== s.face) { s.face = f; if (S.onFace) S.onFace(i); }
          if (x > 2.2) { s.figT = -1; s.a0 = norm(y); y = s.a0; s.face = Math.floor(y / (TAU / STRATA_GEOM[i].n)); }
        } else if (s.relFrom != null && s.lockAt < 0 && s.spinFrom < 0) {
          const u = clamp01((t - s.relFrom) / Math.max(1, s.relMs));
          y = s.relA + (s.relTo - s.relA) * EASE.camera(u);
          if (u >= 1) { s.a0 = s.relTo; s.relFrom = null; }
        } else if (s.spinFrom < 0 || t < s.spinFrom) y = s.a0;
        else if (s.snapFrom != null && s.lockAt === s.spinFrom) {
          // an immediate lock: the 4 % snap from wherever it was
          y = s.snapFrom * (1 - snapResp((t - s.lockAt) / 1000));
          if (t - s.lockAt > 400) { y = 0; }
        } else if (t < s.lockAt) {
          const x = (t - s.spinFrom) / Math.max(1, s.lockAt - s.spinFrom);
          y = s.a0 + s.d * (2 * x - x * x);
        } else {
          const tau = (t - s.lockAt) / 1000;
          y = -s.dir * SNAP_S * (1 - snapResp(tau));
          if (tau > 0.4) y = 0;
        }
        s.out = y;
        o[i].yaw = y;
        let f = 0;
        if (s.flash >= 0) { const a = t - s.flash; f = a < 0 ? 0 : a < 50 ? 1 : Math.max(0, 1 - (a - 50) / 260); if (a > 400) s.flash = -1; }
        o[i].edgeFlash = f;
      }
    },
    /** the edges of stratum i flash --white and settle to --silver (THE LINE crossing) */
    flash(i, t) { st[i].flash = t; },
    clearSnap(i) { st[i].snapFrom = null; },
    detach() {
      if (!attached) return;
      attached = false;
      for (let i = 0; i < 7; i++) { o[i].yaw = 0; o[i].edgeFlash = 0; k.override(i, null); }
    },
    get out() { return st.map((s) => s.out); },
  };
  return S;
}

/** Key-local y of stratum i's centre (canonical m) */
export const stratumMid = (i) => STRATA_GEOM[i].mid;

// ─── camera ─────────────────────────────────────────────────────────────────────────────────────────────────
const C = CAMERA.core, B = CAMERA.boot;
export function corePose(out) {
  out.pos.set(C.pos[0], C.pos[1], C.pos[2]); out.target.set(0, 0, 0); out.fov = C.fov;
  out.offsetY = layout.kind === 'desktop' ? 0 : C.phoneOffsetY; out.roll = 0;
  return out;
}
export function createCamera(ctx) {
  const pose = { pos: new Vector3(), target: new Vector3(), fov: C.fov, offsetY: 0, roll: 0 };
  const a = new Vector3(), b = new Vector3(), drift = new Vector3();
  let driftAmp = 0;
  const rig = ctx.rig;
  const cam = {
    pose,
    /** the camera at distance d (m) along the boot line (y scales with d from the boot start elevation) */
    at(d, yAt16 = B.start[1], offsetY = 0) {
      pose.pos.set(0, (yAt16 * d) / 16, d); pose.target.set(0, 0, 0); pose.fov = C.fov; pose.offsetY = offsetY; pose.roll = 0;
      if (rig) rig.setPose(pose);
    },
    /** blend from a (d0 on the boot line) to the CORE rest pose, u 0..1 (eased by caller); up (default u) is the
     *  pitch's own progress: the far rim's screen height follows the pitch alone, so a pitch that leads the dolly
     *  brings his name up to its rest place (between the Key's tip and the status line) as it starts to burn. */
    toRest(d0, u, yAt16 = B.start[1], off0 = 0, up = u) {
      a.set(0, (yAt16 * d0) / 16, d0); b.set(C.pos[0], C.pos[1], C.pos[2]);
      const la = a.length(), lb = b.length(), d = la + (lb - la) * u;
      const ta = Math.atan2(a.y, a.z), tb = Math.atan2(b.y, b.z), th = ta + (tb - ta) * up;
      pose.pos.set(a.x + (b.x - a.x) * u, d * Math.sin(th), d * Math.cos(th)); pose.target.set(0, 0, 0); pose.fov = C.fov;
      const offR = layout.kind === 'desktop' ? 0 : C.phoneOffsetY;
      pose.offsetY = off0 + (offR - off0) * u; pose.roll = 0;
      if (rig) rig.setPose(pose);
    },
    rest() { corePose(pose); if (rig) rig.setPose(pose); },
    /** the Lissajous micro-drift ±0.08 m (0.13 / 0.11 Hz), amp 0..1 */
    drift(tMs, amp) {
      driftAmp = amp;
      if (!rig) return;
      if (amp <= 0) { rig.setOffset('drift', null); return; }
      const s = tMs / 1000;
      drift.set(B.driftM * amp * Math.sin(TAU * B.driftHz[0] * s), B.driftM * amp * Math.sin(TAU * B.driftHz[1] * s + 1.1), 0);
      rig.setOffset('drift', drift);
    },
    clearDrift() { driftAmp = 0; if (rig) rig.setOffset('drift', null); },
    get driftAmp() { return driftAmp; },
  };
  return cam;
}

// ─── world: rim lattice, beads, pillar ──────────────────────────────────────────────────────────────────────
export function createWorld(ctx) {
  const p = ctx.pillar, ud = p ? p.userData : null;
  const rib = ud && ud.ribbon, beads = ud && ud.beads;
  const w = {
    /** rim lattice visibility: 0 … 1 (= 12 %); 0.5 = the boot's 6 % */
    rim(a) { if (ctx.nest) ctx.nest.setFade(1, clamp01(a)); },
    /** axis beads alpha (dim points far above and below) */
    beads(a) {
      if (!beads) return;
      beads.visible = a > 0.001; beads.material.uniforms.uAlpha.value = a; beads.material.transparent = a < 0.999;
      if (p) p.visible = true;
    },
    /** the pillar ribbon drawn to ±r m around the Key (0 = none), alpha a */
    ribbon(r, a = 1) {
      if (!rib) return;
      const f = clamp01(r / 1200);
      rib.setDrawRange01(0.5 - 0.5 * f, 0.5 + 0.5 * f);
      rib.setAlpha(r > 0 ? a : 0);
      if (rib.uniforms && rib.uniforms.uFlash) rib.uniforms.uFlash.value = 0;
    },
    flashRibbon(x) { if (rib && rib.uniforms && rib.uniforms.uFlash) rib.uniforms.uFlash.value = x; },
    /** the state the director expects at rest (pillar alpha 1, full range) */
    restore() {
      if (rib) { rib.setDrawRange01(0, 1); rib.setAlpha(1); if (rib.uniforms && rib.uniforms.uFlash) rib.uniforms.uFlash.value = 0; }
      if (beads) { beads.visible = true; beads.material.uniforms.uAlpha.value = 1; beads.material.transparent = false; }
      if (p) p.visible = true;
      if (ctx.nest) ctx.nest.setFade(1, 1);
    },
    irisY: HALL.coreIrisY,
  };
  return w;
}

