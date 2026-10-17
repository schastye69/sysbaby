// fx/dust/dust.js — one stateless analytic dust system (SPEC-ADDENDUM A2.7; ARCH-ADDENDUM X§2.5.8). OWNER: WP12.
// One THREE.Points (one draw call) under ctx.worldFx; no render targets, no worker, no GPGPU. The pool is allocated once
// for the tier the boot benchmark settles on (TIER_PARAMS.fx.dustPool) and never grows; a later tier drop only shrinks
// the draw range. ≤ 8 emitter slots: slot 0 is the current hall's ambient air (rebuilt on arrival, and on the swap frame
// of a DIVE / RECALL), transients take ranges after the ambient share. The CPU writes only uniforms and an 8-splat ring
// (pointer speed > 200 px/s, the lamp-side point of the pointer ray). Reduced motion: positions frozen (t = 0), no stir,
// no transient emitters — a static field of glitter that still sparkles as the lamp moves. Context loss: the GPU buffers
// come back with the context; the ambient respawns over 600 ms. Callers never branch on `enabled`: every emitter type
// returns a working handle (a no-op one when dust is off).
import { BufferGeometry, BufferAttribute, Points, ShaderMaterial, NormalBlending, Vector3, Vector4, Matrix4, Ray } from 'three';
import { U } from '../../render/uniforms.js';
import { fxUniforms } from '../../render/fxChunk.js';
import { scaleEngine } from '../../render/scale.js';
import { rig } from '../../render/cameraRig.js';
import { input } from '../../core/input.js';
import { quality } from '../../core/quality.js';
import { ENV } from '../../core/env.js';
import { app } from '../../core/store.js';
import { bus } from '../../core/bus.js';
import { loop } from '../../core/loop.js';
import { layout } from '../../core/layout.js';
import { ROOMS } from '../../world/rooms.js';
import { STRATA_GEOM } from '../../core/tokens.js';
import { DUST_VERT, DUST_FRAG } from './dust.glsl.js';
import { TYPE, ambientSlot } from './emitters.js';

const NOOP = { set() {}, release() {}, alive: false };
const v4 = (n) => { const a = []; for (let i = 0; i < n; i++) a.push(new Vector4()); return a; };

export function createDust(F) {
  const { ctx } = F;
  const fxp = () => (quality.params && quality.params.fx) || null;
  let off = false;
  if (__DEV__) { try { off = new URLSearchParams(location.search).get('dust') === '0'; } catch (e) { off = false; } }   // dev A/B flag (X§7.3.4)
  const on0 = !off && !F.t0 && !!ctx.worldFx && !!(fxp() && fxp().dustPool > 0);
  const api = { enabled: on0 };
  let geo = null, mat = null, pts = null, pool = 0, ambMax = 0, ambN = 0, booted = false;
  const E0 = v4(8), E1 = v4(8), E2 = v4(8), E3 = v4(8), SP = v4(8), SV = v4(8);
  const thr = []; for (let i = 0; i < 24; i++) thr.push(new Vector3());
  const strM = []; for (let i = 0; i < 7; i++) strM.push(new Matrix4());
  const strY = [], strN = [];
  STRATA_GEOM.forEach((s) => { strY.push(s.top, s.bot); strN.push(s.n); });
  const slots = [];                         // 1..7: { type, start, count, until (world s) }
  const uni = {
    E0: { value: E0 }, E1: { value: E1 }, E2: { value: E2 }, E3: { value: E3 }, uSp: { value: SP }, uSv: { value: SV },
    uImp: { value: new Vector4(0, 0, 0, -99) }, uSheet: { value: new Vector3() }, uDep: { value: new Vector4() },
    uThr: { value: thr }, uStr: { value: strM }, uStrY: { value: strY }, uStrN: { value: strN },
    uLamp: U.uLamp, uCamPos: U.uCamPos, uNuc: { value: new Vector3() }, uT: { value: 0 }, uLampAng: { value: 0 }, uLampI: { value: 1 },
    uAmb: { value: 0 }, uCol: { value: 0 }, uColT: { value: 0 }, uBreath: U.uBreath, uPixelRatio: U.uPixelRatio, uGap: U.uGap,
    uFogDensity: U.uFogDensity, cSilver: U.cSilver, cWhite: U.cWhite, cEmberDeep: U.cEmberDeep, ...fxUniforms(),
  };
  const wt = () => (ENV.reducedMotion ? 0 : loop.worldNow / 1000);

  function build(n) {
    if (pts) { pts.parent && pts.parent.remove(pts); geo.dispose(); }
    pool = n;
    const seeds = new Float32Array(n * 3);
    let x = 0x9e3779b9;
    for (let i = 0; i < seeds.length; i++) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; seeds[i] = (x >>> 0) / 4294967296; }
    geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(seeds, 3));
    geo.setDrawRange(0, 0);
    if (!mat) mat = new ShaderMaterial({ uniforms: uni, vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, transparent: true,
      depthWrite: false, depthTest: true, blending: NormalBlending });
    pts = new Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = 3;
    ctx.worldFx.add(pts);
  }
  function tierShare() { const p = fxp(); return p ? Math.min(pool, p.dustAmbient) : 0; }
  function ambient(room, respawn) {
    const ok = ambientSlot(room, E1[0], E2[0], E3[0], respawn ? wt() : -1);
    ambMax = tierShare(); ambN = ok ? ambMax : 0;
    E0[0].set(ok ? TYPE.ambient : 0, 0, 0, ambN);
    range();
  }
  function range() {
    let top = ambN;
    for (const s of slots) if (s && s.type) top = Math.max(top, s.start + s.count);
    if (geo) geo.setDrawRange(0, Math.min(pool, top));
    api.live = Math.min(pool, top);
  }
  function alloc(type, count, life) {
    if (!api.enabled || ENV.reducedMotion || !(count > 0)) return null;
    let k = 1; while (k < 8 && slots[k] && slots[k].type) k++;
    if (k >= 8) return null;
    const used = [];
    for (const s of slots) if (s && s.type) used.push(s);
    used.sort((a, b) => a.start - b.start);
    let st = Math.max(ambMax, ambN);
    for (const u of used) { if (st + count <= u.start) break; st = Math.max(st, u.start + u.count); }
    const n = Math.min(count, pool - st);
    if (n <= 0) return null;
    const s = { type, start: st, count: n, until: wt() + life, k };
    slots[k] = s;
    E0[k].set(type, wt(), st, n);
    range();
    return s;
  }
  function free(s) { if (!s || !s.type) return; s.type = 0; E0[s.k].x = 0; slots[s.k] = null; range(); }
  const canon = (vRender, out) => scaleEngine.toCanonical(vRender, out);
  const _a = new Vector3(), _b = new Vector3(), _r = new Ray();

  function handle(s) {
    if (!s) return NOOP;
    return {
      get alive() { return !!s.type; },
      set(p) { if (s.type === TYPE.threads && p && p.curves) threads(s, p); },
      release(ms) {
        if (!s.type) return;
        if (s.type === TYPE.threads) { E2[s.k].x = wt(); s.until = wt() + 2; } else if (!(ms > 0)) free(s);
        else s.until = Math.min(s.until, wt() + ms / 1000);
      },
    };
  }
  function threads(s, p) {
    const cs = (p.curves || []).slice(0, 6);
    for (let j = 0; j < cs.length; j++) for (let q = 0; q < 4; q++) canon(cs[j][Math.min(q, cs[j].length - 1)], thr[j * 4 + q]);
    const room = ROOMS[app.room] || ROOMS.CORE;
    E1[s.k].set(cs.length, 0.06 * (room.id === 'CORE' ? 1 : 10), 0, room.id === 'CORE' ? 1 : 25);
    E2[s.k].set(1e9, room.anchor.y, 0, 0);
    E3[s.k].set(0, 0, room.id === 'CORE' ? 0.6 : 11, 0);
  }

  Object.assign(api, {
    live: 0,
    splats: 0,                             // pointer splats written so far (QA: T1 has no stir)
    /** type 'ambient'|'deposit'|'swarf'|'threads'|'collapse'|'shed'|'puff' → { set(params), release(ms?), alive } */
    emitter(type, params) {
      const p = params || {};
      if (!api.enabled) return NOOP;
      if (type === 'ambient') { ambient(app.room, true); return NOOP; }
      if (type === 'deposit') { api.deposit(true, performance.now(), 800); return { set() {}, release() { api.deposit(false); }, alive: true }; }
      if (type === 'collapse') { api.collapse(1); return { set(q) { api.collapse(q && q.mode != null ? q.mode : 2); }, release() { api.collapse(0); }, alive: true }; }
      const fx = fxp() || {};
      if (type === 'swarf') {
        const s = alloc(TYPE.swarf, Math.min(+p.count || fx.swarf || 0, fx.swarf || 0), 1.5);
        if (!s) return NOOP;
        const st = STRATA_GEOM[p.stratum | 0] || STRATA_GEOM[3];
        E1[s.k].set(0, 0, 0, 1); E2[s.k].set(st.top + 0.008, st.bot - 0.008, (p.stratum | 0) % 2 ? -1 : 1, 0); E3[s.k].set(0, 0, 0.6, 0);
        return handle(s);
      }
      if (type === 'threads') {
        const per = Math.min(+p.perThread || fx.threadDust || 0, fx.threadDust || 0);
        const n = Math.min(6, (p.curves || []).length);
        const s = alloc(TYPE.threads, per * n, 3600);
        if (!s) return NOOP;
        threads(s, p);
        return handle(s);
      }
      if (type === 'shed' || type === 'puff') {
        const shed = type === 'shed';
        const cap = shed ? fx.shed : fx.puff;
        const s = alloc(shed ? TYPE.shed : TYPE.puff, Math.min(+p.count || cap || 0, cap || 0), shed ? 2.2 : 1.0);
        if (!s) return NOOP;
        canon(p.originRender || _a.set(0, 0, 0), _b);
        const hall = app.room !== 'CORE';
        E1[s.k].set(_b.x, _b.y, _b.z, hall ? 25 : 1);
        E2[s.k].set(shed ? 1.2 : 0.3 * (hall ? 1 : 0.1), shed ? 17 : 0, shed ? 1.8 : 2.0, shed ? (ROOMS[app.room] || ROOMS.CORE).anchor.y : -1e9);
        E3[s.k].set(shed ? 1.8 : 0.9, 0, hall ? 11 : 0.6, 0);
        return handle(s);
      }
      return NOOP;
    },
    /** pointer splat (render-space point and velocity) */
    splat(pRender, vRender) {
      const p = fxp();
      if (!api.enabled || ENV.reducedMotion || !p || !p.stir) return;   // the stir (pointer and flinch splats) is off on T1 (A2.7.1)
      canon(pRender, _a);
      const k = (splatI = (splatI + 1) % 8);
      api.splats++;
      SP[k].set(_a.x, _a.y, _a.z, wt());
      const s = 1 / Math.max(1e-9, scaleEngine.s);
      SV[k].set(vRender.x * s, vRender.y * s, vRender.z * s, 0);
    },
    impulse(o, speed = 1.2, radius = 2) {
      void speed; void radius;
      if (api.enabled && !ENV.reducedMotion && o) uni.uImp.value.set(o.x, o.y, o.z, wt());
    },
    /** the boot light sheet: render y, half thickness (m), on */
    sheet(yRender, half = 0.03, on = true) {
      uni.uSheet.value.set((yRender - scaleEngine.Q.y) / Math.max(1e-9, scaleEngine.s), half, on ? 1 : 0);
    },
    stats() { return { pool: api.enabled ? pool : 0, live: api.enabled ? api.live : 0 }; },
    ambientTerm(a) { uni.uAmb.value = a; },
    /** The lamp's (and the nucleus's) light on the dust, 0..1. The title holds it at 0 until THE LINE: the void and the
     *  depth are unlit air (A2.1.1 — only the 3 % ambient term and the light sheet light dust there). */
    lampTerm(a) { uni.uLampI.value = Math.max(0, Math.min(1, +a || 0)); },
    /** deposition (internal; title piece): startPerf = THE LINE's start, durMs its sweep */
    deposit(on, startPerf, durMs) {
      const d = uni.uDep.value;
      if (!on) { d.x = 0; return; }
      const w0 = wt() + (startPerf - performance.now()) / 1000;
      d.set(1, w0, durMs / 1000, w0 + durMs / 1000);
    },
    /** 0 off · 1 noise (curl ×4) · 2 collapse (flat spiral onto the gap planes) · 3 held (asleep) */
    collapse(mode) {
      if (mode === 2 && uni.uCol.value !== 2) uni.uColT.value = wt();
      uni.uCol.value = mode;
    },
    frame() {
      if (!api.enabled) return;
      uni.uT.value = wt();
      if (ctx.key) uni.uNuc.value.copy(ctx.key.nucleusWorld);
      const cam = rig.camera;
      if (cam) {
        _a.copy(U.uLamp.value).sub(rig.pose.target);
        _b.setFromMatrixColumn(cam.matrixWorld, 0);
        const x = _a.dot(_b);
        _b.setFromMatrixColumn(cam.matrixWorld, 1);
        uni.uLampAng.value = Math.atan2(_a.dot(_b), x);
      }
      if (uni.uDep.value.x > 0.5 && ctx.key) for (let i = 0; i < 7; i++) ctx.key.stratumMatrix(i, strM[i]);
      const t = wt();
      for (const s of slots) if (s && s.type && t > s.until) free(s);
    },
  });
  let splatI = 0, lastSplat = 0;

  if (on0) {
    build(fxp().dustPool);
    ambient(app.room, false);
    // The pool is fixed by the boot benchmark: a tier change before boot:done re-allocates once; afterwards only the
    // draw range shrinks.
    bus.on('tier:change', () => {
      if (!api.enabled) return;
      const p = fxp();
      if (!booted && p && p.dustPool !== pool) build(p.dustPool);
      ambient(app.room, false);
    });
    bus.on('boot:done', () => { booted = true; });
    bus.on('room:arrive', ({ room }) => ambient(room, true));
    bus.on('scale:rebase', () => { const st = ctx.director && ctx.director.state; if (st && st.to) ambient(st.to.room, true); });
    bus.on('gl:lost', () => {                                   // all fx state is transient: transients end, sheet/deposit off
      for (const sl of slots) if (sl && sl.type) free(sl);
      uni.uDep.value.x = 0; uni.uSheet.value.z = 0; uni.uImp.value.w = -99;
      for (let i = 0; i < 8; i++) SP[i].w = -99;
      ambN = 0; E0[0].w = 0; range();
    });
    bus.on('gl:restored', () => ambient(app.room, true));          // the ambient respawns over 600 ms
    input.observe((sm) => {
      const p = fxp();
      if (!p || !p.stir || ENV.reducedMotion || !cam()) return;
      const fast = layout.isPhone ? sm.buttons > 0 || input.pointer.down : sm.speed > 200;
      const now = performance.now();
      if (!fast || now - lastSplat < 60) return;
      lastSplat = now;
      rig.ray(sm.x, sm.y, _r);
      _r.closestPointToPoint(U.uLamp.value, _a);
      const depth = Math.max(0.05, _a.distanceTo(_r.origin));
      const k = depth / Math.max(1, U.uPxPerUnit.value);
      const c = rig.camera;
      _b.setFromMatrixColumn(c.matrixWorld, 0).multiplyScalar(sm.vx * 1000 * k);
      const vx = _b.x, vy = _b.y, vz = _b.z;
      _b.setFromMatrixColumn(c.matrixWorld, 1).multiplyScalar(-sm.vy * 1000 * k);
      _b.x += vx; _b.y += vy; _b.z += vz;
      const L = _b.length(), cap = 2 * scaleEngine.s * (app.room === 'CORE' ? 1 : 25);
      if (L > cap) _b.multiplyScalar(cap / L);
      api.splat(_a, _b);
    });
  }
  function cam() { return rig.camera; }
  return api;
}
