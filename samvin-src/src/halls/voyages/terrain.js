// halls/voyages/terrain.js — WP6: the mission chamber's ground (SPEC §6.3 «Mission chamber»).
//
// A 64 × 64 seeded-simplex heightfield (seed = the mission code), 120 × 120 m, drawn ONLY as marching-squares contour
// lines (12 levels; T1: 8) in --silver at 40 %, floating in fog — no surface, no
// fill. A route of 5–9 seeded waypoints crosses it: `done` = ember dots, 3 px, every 2 m; any other state = a silver
// dashed line; small 1.2 m survey crosses mark the waypoints. The probe: an ember beam head with a 300 ms tail flies
// the route in 2,500 ms while the contours ripple +1.5 m where it passes, then it leaves upward.
//
// Terrain-local coordinates: the terrain centre is (0, 0, 0); the hall places the group at (hx, CHAMBER_Y, hz).
// Draw calls: ONE Lines (contours, survey crosses, route dashes and the probe's tail share it), the probe head sprite
// while it flies, and the ember route dots of a `done` mission (Points) — all hidden outside the chamber. Every per-frame function is allocation-free (G9).
import { Group, Vector3, CatmullRomCurve3 } from 'three';
import { createLines } from '../../render/lines.js';
import { createPoints } from '../../render/points.js';
import { createEmitter } from '../../render/glow.js';
import { simplex2, mulberry32, hashStr } from '../../core/rng.js';
import { palette } from '../../render/palette.js';
import { U } from '../../render/uniforms.js';
import { TERRAIN_SIZE } from './layout.js';

const N = 64;                              // grid nodes per side
const CELL = TERRAIN_SIZE / (N - 1);
const HALF = TERRAIN_SIZE / 2;
const AMP = 13;                            // m of relief
export const FLIGHT_MS = 2500;             // SPEC: the beam dot flies the route in 2,500 ms
const TAIL_MS = 300, LEAVE_MS = 900, RIPPLE = 1.5, RIPPLE_R = 7;
const LOOP_PTS = 48;                       // shaft ring ↔ contour morph resolution

/** The seeded heightfield (pure, deterministic per code). → Float32Array N×N heights (m, ≥ 0) */
function heightfield(code) {
  const seed = hashStr(`voyage:${code}`);
  const n1 = simplex2(seed), n2 = simplex2(seed ^ 0x9e3779b9), n3 = simplex2(seed ^ 0x51ed27);
  const h = new Float32Array(N * N);
  const sr = mulberry32(seed ^ 0x2545f491);
  const peaks = [[0, 0, 7.5, 1]];                                        // [x, z, σ (m), height]: the mission's summit
  for (let q = 0; q < 8; q++) {
    const a = sr() * Math.PI * 2, d = 10 + sr() * 26;
    peaks.push([Math.cos(a) * d, Math.sin(a) * d, 3.6 + sr() * 3.2, 0.3 + sr() * 0.5]);
  }
  let lo = Infinity, hi = -Infinity;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1) * 2 - 1, z = j / (N - 1) * 2 - 1;
      // a summit under the camera's aim (the mission's «place») and five seeded neighbours inside the ~50 m the 45 m
      // orbit sees, ridges and gullies on top: the 12 levels stack into nested rings — a relief read from lines alone
      const X = x * HALF, Z = z * HALF, r = Math.hypot(X, Z);
      let v = 0;
      for (const p of peaks) v += p[3] * Math.exp(-((X - p[0]) ** 2 + (Z - p[1]) ** 2) / (2 * p[2] * p[2]));
      v += 0.10 * n1(x * 3.1, z * 3.1) + 0.10 * n2(x * 6.7 + 3.1, z * 6.7 - 1.7) + 0.05 * n3(x * 13.1, z * 13.1);
      v -= 0.3 * (r / HALF) * (r / HALF);                                  // the edges settle into the fog
      h[j * N + i] = v;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  const k = AMP / Math.max(1e-6, hi - lo);
  for (let q = 0; q < h.length; q++) h[q] = (h[q] - lo) * k;
  return h;
}

/** Marching squares at one level → appends segments (terrain-local xyz pairs) to out[] */
function contour(h, level, out) {
  const X = (i) => i * CELL - HALF;
  for (let j = 0; j < N - 1; j++) {
    for (let i = 0; i < N - 1; i++) {
      const a = h[j * N + i], b = h[j * N + i + 1], c = h[(j + 1) * N + i + 1], d = h[(j + 1) * N + i];
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x0 = X(i), z0 = X(j), x1 = x0 + CELL, z1 = z0 + CELL;
      const t = (p, q) => (level - p) / (q - p);
      const top = [x0 + (x1 - x0) * t(a, b), z0];
      const right = [x1, z0 + (z1 - z0) * t(b, c)];
      const bottom = [x0 + (x1 - x0) * t(d, c), z1];
      const left = [x0, z0 + (z1 - z0) * t(a, d)];
      const seg = (p, q) => out.push(p[0], level, p[1], q[0], level, q[1]);
      switch (idx) {
        case 1: case 14: seg(left, bottom); break;
        case 2: case 13: seg(bottom, right); break;
        case 3: case 12: seg(left, right); break;
        case 4: case 11: seg(top, right); break;
        case 6: case 9: seg(top, bottom); break;
        case 7: case 8: seg(left, top); break;
        case 5: seg(left, top); seg(bottom, right); break;
        case 10: seg(top, right); seg(left, bottom); break;
        default: break;
      }
    }
  }
}

/** Chains a level's raw marching-squares segments (seg[from…to)) into polylines → [{ pts: [[x,y,z]…], closed }]. */
function chains(seg, from, to) {
  const key = (x, z) => `${Math.round(x * 100)},${Math.round(z * 100)}`;
  const adj = new Map();
  const n = (to - from) / 6;
  const used = new Uint8Array(n);
  for (let s = from, q = 0; s < to; s += 6, q++) {
    for (const e of [0, 3]) {
      const k = key(seg[s + e], seg[s + e + 2]);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push(q);
    }
  }
  const P = (q, e) => { const s = from + q * 6 + e; return [seg[s], seg[s + 1], seg[s + 2]]; };
  const walk = (pts) => {
    for (;;) {
      const tail = pts[pts.length - 1];
      const nx = (adj.get(key(tail[0], tail[2])) || []).find((m) => !used[m]);
      if (nx === undefined) return;
      used[nx] = 1;
      const a = P(nx, 0), b = P(nx, 3);
      pts.push(key(a[0], a[2]) === key(tail[0], tail[2]) ? b : a);
    }
  };
  const out = [];
  for (let q0 = 0; q0 < n; q0++) {
    if (used[q0]) continue;
    used[q0] = 1;
    const fwd = [P(q0, 0), P(q0, 3)];
    walk(fwd);
    const back = [fwd[0]];
    walk(back);
    const pts = back.reverse().concat(fwd.slice(1));
    const f = pts[0], l = pts[pts.length - 1];
    const closed = pts.length > 3 && key(f[0], f[2]) === key(l[0], l[2]);
    if (closed) pts.pop();
    out.push({ pts, closed });
  }
  return out;
}

/** Chaikin corner cutting (×it): the 1.9 m grid's facets become a drawn line. */
function chaikin(pts, closed, it) {
  let p = pts;
  for (let k = 0; k < it && p.length > 2; k++) {
    const o = [];
    const n = p.length;
    if (!closed) o.push(p[0]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = p[i], b = p[(i + 1) % n];
      o.push([0.75 * a[0] + 0.25 * b[0], a[1], 0.75 * a[2] + 0.25 * b[2]], [0.25 * a[0] + 0.75 * b[0], a[1], 0.25 * a[2] + 0.75 * b[2]]);
    }
    if (!closed) o.push(p[n - 1]);
    p = o;
  }
  return p;
}

/** Resamples a polyline into LOOP_PTS points (the ШЛЮЗ ring ↔ contour morph target). */
function resample(pts, closed) {
  const out = new Float32Array(LOOP_PTS * 3);
  const P = closed ? pts.concat([pts[0]]) : pts;
  const cum = [0];
  for (let q = 1; q < P.length; q++) cum.push(cum[q - 1] + Math.hypot(P[q][0] - P[q - 1][0], P[q][2] - P[q - 1][2]));
  const L = cum[cum.length - 1];
  let q = 0;
  for (let m = 0; m < LOOP_PTS; m++) {
    const d = (m / LOOP_PTS) * L;
    while (q < P.length - 2 && cum[q + 1] < d) q++;
    const f = (d - cum[q]) / Math.max(1e-6, cum[q + 1] - cum[q]);
    out[m * 3] = P[q][0] + (P[q + 1][0] - P[q][0]) * f;
    out[m * 3 + 1] = P[q][1];
    out[m * 3 + 2] = P[q][2] + (P[q + 1][2] - P[q][2]) * f;
  }
  return out;
}

/** Bilinear height at terrain-local (x, z). */
function sample(h, x, z) {
  const fx = Math.min(N - 1.001, Math.max(0, (x + HALF) / CELL)), fz = Math.min(N - 1.001, Math.max(0, (z + HALF) / CELL));
  const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j;
  const a = h[j * N + i], b = h[j * N + i + 1], c = h[(j + 1) * N + i + 1], d = h[(j + 1) * N + i];
  return (a * (1 - u) + b * u) * (1 - v) + (d * (1 - u) + c * u) * v;
}

/** @returns the chamber terrain for one mission. opts: { code, levels (12 | 8), done: boolean } */
export function createTerrain(opts) {
  const { code, levels } = opts;
  const h = heightfield(code);
  const group = new Group();
  group.name = `terrain:${code}`;

  // ── contours (+ waypoint crosses) ──
  const seg = [];
  const levelRange = [];
  const loops = [];
  const raw = [];
  for (let l = 0; l < levels; l++) {
    const y = AMP * (0.10 + 0.88 * ((l + 0.5) / levels));          // the levels live where the relief is (not the flats)
    raw.length = 0;
    contour(h, y, raw);
    const from = seg.length;
    let best = null, bestN = 0;
    for (const c of chains(raw, 0, raw.length)) {
      const sm = chaikin(c.pts, c.closed, 2);
      const n = sm.length;
      for (let q = 0; q < (c.closed ? n : n - 1); q++) {
        const p0 = sm[q], p1 = sm[(q + 1) % n];
        seg.push(p0[0], y, p0[2], p1[0], y, p1[2]);
      }
      if (n > bestN) { bestN = n; best = { pts: sm, closed: c.closed }; }
    }
    loops.push(best ? resample(best.pts, best.closed) : new Float32Array(LOOP_PTS * 3).fill(0));
    levelRange.push([from, seg.length, y]);
  }

  // ── route: 5–9 seeded waypoints across the terrain ──
  const rnd = mulberry32(hashStr(`route:${code}`));
  const nWay = 5 + Math.floor(rnd() * 5);
  const a0 = rnd() * Math.PI * 2;
  const way = [];
  for (let w = 0; w < nWay; w++) {
    const t = w / (nWay - 1);
    const along = (t * 2 - 1) * HALF * 0.42;
    const side = (rnd() * 2 - 1) * HALF * 0.2 * Math.sin(Math.PI * (t * 0.8 + 0.1));
    const x = Math.cos(a0) * along - Math.sin(a0) * side, z = Math.sin(a0) * along + Math.cos(a0) * side;
    way.push(new Vector3(x, sample(h, x, z) + 0.6, z));
  }
  const crossBase = seg.length;
  for (const p of way) {
    seg.push(p.x - 0.6, p.y, p.z, p.x + 0.6, p.y, p.z, p.x, p.y, p.z - 0.6, p.x, p.y, p.z + 0.6);
  }

  // ── route geometry ──
  const curve = new CatmullRomCurve3(way, false, 'centripetal');
  const routeLen = curve.getLength();
  const SAMPLES = 160;
  const routePts = new Float32Array((SAMPLES + 1) * 3);
  const _p = new Vector3();
  for (let q = 0; q <= SAMPLES; q++) {
    curve.getPointAt(q / SAMPLES, _p);
    _p.y = Math.max(_p.y, sample(h, _p.x, _p.z) + 0.5);
    routePts[q * 3] = _p.x; routePts[q * 3 + 1] = _p.y; routePts[q * 3 + 2] = _p.z;
  }
  // not done: a silver dashed line — the dashes are geometry (0.45 m on / 0.35 m off), so the route shares the draw
  const routeBase = seg.length;
  let routeDots = null;
  if (!opts.done) {
    const ON = 0.45, OFF = 0.35;
    for (let d = 0; d < routeLen; d += ON + OFF) {
      curve.getPointAt(Math.min(1, d / routeLen), _p);
      const ax = _p.x, az = _p.z, ay = Math.max(_p.y, sample(h, _p.x, _p.z) + 0.5);
      curve.getPointAt(Math.min(1, (d + ON) / routeLen), _p);
      seg.push(ax, ay, az, _p.x, Math.max(_p.y, sample(h, _p.x, _p.z) + 0.5), _p.z);
    }
  } else {                                                         // done: ember dots, 3 px, every 2 m
    const nd = Math.max(2, Math.floor(routeLen / 2) + 1);
    const dp = new Float32Array(nd * 3);
    for (let q = 0; q < nd; q++) {
      curve.getPointAt(Math.min(1, (q * 2) / routeLen), _p);
      _p.y = Math.max(_p.y, sample(h, _p.x, _p.z) + 0.5);
      dp[q * 3] = _p.x; dp[q * 3 + 1] = _p.y; dp[q * 3 + 2] = _p.z;
    }
    routeDots = createPoints({ positions: dp, sizePx: 3, color: 'ember', alpha: 0.9, fog: true });
    routeDots.object.name = 'voyages:route-dots';
    group.add(routeDots.object);
  }
  // the probe's 300 ms ember tail: the last TAIL_N segments of the same buffer
  const TAIL_N = 16;
  const tailBase = seg.length / 6;
  for (let q = 0; q < TAIL_N; q++) seg.push(0, 0, 0, 0, 0, 0);

  // ── ONE Lines for the chamber: contours + crosses + route dashes + tail (per-segment colour / width / alpha) ──
  const segCount = seg.length / 6;
  const base = new Float32Array(seg);
  const live = new Float32Array(seg);
  const alpha = new Float32Array(segCount);
  const width = new Float32Array(segCount);
  const col = new Float32Array(segCount * 3);
  for (let q = 0; q < crossBase / 6; q++) { alpha[q] = 0.40; width[q] = 1; }   // every contour: --silver at 40 % (SPEC)
  for (let q = crossBase / 6; q < routeBase / 6; q++) { alpha[q] = 0.55; width[q] = 1; }
  for (let q = routeBase / 6; q < tailBase; q++) { alpha[q] = 0.85; width[q] = 1; }
  for (let q = tailBase; q < segCount; q++) { alpha[q] = 0; width[q] = 2; }
  let colInvert = -1;
  function paint() {
    const sv = palette.color('silver'), em = palette.color('ember');
    for (let q = 0; q < segCount; q++) {
      const c = q >= tailBase ? em : sv;
      col[q * 3] = c.r; col[q * 3 + 1] = c.g; col[q * 3 + 2] = c.b;
    }
    lines.mesh.geometry.attributes.aCol.needsUpdate = true;
  }
  const lines = createLines({ segments: live, alpha, width, color: col, far: 220, glint: 0.6 });
  lines.mesh.name = 'voyages:chamber';
  group.add(lines.mesh);
  paint();
  const head = createEmitter({ color: 'ember', radius: 0.9, intensity: 0 });
  head.object.name = 'voyages:probe-head';
  group.add(head.object);
  const headPos = head.object.position;

  const routeAt = (s, out) => {                      // s ∈ [0, 1] along the sampled route
    const f = Math.min(SAMPLES, Math.max(0, s * SAMPLES)), q = Math.min(SAMPLES - 1, Math.floor(f)), u = f - q;
    out.x = routePts[q * 3] + (routePts[q * 3 + 3] - routePts[q * 3]) * u;
    out.y = routePts[q * 3 + 1] + (routePts[q * 3 + 4] - routePts[q * 3 + 1]) * u;
    out.z = routePts[q * 3 + 2] + (routePts[q * 3 + 5] - routePts[q * 3 + 2]) * u;
    return out;
  };
  /** probe position at flight time ms (0…FLIGHT_MS along the route, then LEAVE_MS rising up and away) */
  const probeAt = (ms, out) => {
    if (ms <= FLIGHT_MS) return routeAt(ms / FLIGHT_MS, out);
    routeAt(1, out);
    const u = Math.min(1, (ms - FLIGHT_MS) / LEAVE_MS);
    out.y += u * u * 60;
    return out;
  };

  let flying = -1;                                     // flight clock (ms), −1 = none
  let rippled = false;
  const _q = { x: 0, y: 0, z: 0 };
  const _r = { x: 0, y: 0, z: 0 };

  function writeRipple(px, pz, amp) {
    const inv = 1 / (2 * RIPPLE_R * RIPPLE_R);
    for (let s = 0; s < crossBase; s += 3) {
      const dx = base[s] - px, dz = base[s + 2] - pz;
      live[s + 1] = base[s + 1] + amp * Math.exp(-(dx * dx + dz * dz) * inv);
    }
    lines.setSegments(live, segCount);
  }

  const terrain = {
    group,
    code,
    levels,
    loops,                                             // Float32Array(LOOP_PTS·3) per level (terrain-local)
    loopPts: LOOP_PTS,
    levelY: levelRange.map((r) => r[2]),
    routeLen,
    /** Overall alpha (chamber fade / ШЛЮЗ build). k ∈ [0, 1]; contours can be drawn partially (build). */
    setAlpha(k) {
      lines.setAlpha(k);
      if (routeDots) routeDots.setAlpha(0.9 * k);
      group.visible = k > 0;
      const inv = U.uInvert.value;
      if (k > 0 && inv !== colInvert) { colInvert = inv; paint(); }   // the ИЗНАНКА palette follows (A15)
    },
    setContourAlpha(k) { lines.setAlpha(k); },
    /** Starts the probe flight (sendProbe already succeeded). */
    launch() { flying = 0; },
    get flying() { return flying >= 0; },
    /** Per-frame (allocation-free). dtMs = elapsed ms; returns true while the flight runs. */
    update(dtMs) {
      if (flying < 0) return false;
      flying += dtMs;
      probeAt(flying, _q);
      headPos.set(_q.x, _q.y, _q.z);
      const fadeOut = flying > FLIGHT_MS ? 1 - Math.min(1, (flying - FLIGHT_MS) / LEAVE_MS) : 1;
      head.setIntensity(Math.min(1, flying / 120) * fadeOut);
      for (let q = 0; q < TAIL_N; q++) {
        probeAt(Math.max(0, flying - (q * TAIL_MS) / TAIL_N), _q);
        probeAt(Math.max(0, flying - ((q + 1) * TAIL_MS) / TAIL_N), _r);
        const o = (tailBase + q) * 6;
        live[o] = _q.x; live[o + 1] = _q.y; live[o + 2] = _q.z; live[o + 3] = _r.x; live[o + 4] = _r.y; live[o + 5] = _r.z;
        alpha[tailBase + q] = (1 - q / TAIL_N) * fadeOut;
      }
      lines.mesh.geometry.attributes.aAl.needsUpdate = true;
      lines.setSegments(live, segCount);
      if (flying <= FLIGHT_MS + 200) {
        const s = Math.min(FLIGHT_MS, flying);
        routeAt(s / FLIGHT_MS, _r);
        writeRipple(_r.x, _r.z, RIPPLE * Math.min(1, (FLIGHT_MS + 200 - flying) / 200));
        rippled = true;
      } else if (rippled) {
        live.set(base.subarray(0, crossBase)); lines.setSegments(live, segCount); rippled = false;
      }
      if (flying >= FLIGHT_MS + LEAVE_MS) { terrain.stop(); return false; }
      return true;
    },
    /** Ends any flight at once (hidden tab return, chamber exit). */
    stop() {
      flying = -1; head.setIntensity(0);
      for (let q = tailBase; q < segCount; q++) alpha[q] = 0;
      lines.mesh.geometry.attributes.aAl.needsUpdate = true;
      if (rippled) { live.set(base.subarray(0, crossBase)); lines.setSegments(live, segCount); rippled = false; }
    },
    /** World (terrain-local) point on the route at s (hall uses it for the return dot). */
    routeAt(s, out) { return routeAt(s, out); },
    dispose() {
      lines.dispose(); head.dispose();
      if (routeDots) routeDots.dispose();
      if (group.parent) group.parent.remove(group);
    },
  };
  return terrain;
}
