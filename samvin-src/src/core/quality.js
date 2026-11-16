// core/quality.js — quality tiers, detection, boot benchmark and the FPS governor (ARCH §3.15.1, SPEC §12.1–§12.3).
//
//   detect()     probe WebGL2 → renderer string → start tier → the real context on #gl (antialias per tier) | T0
//   init(ctx)    (WP0 addition) binds ctx (renderer) and registers the benchmark + governor on the loop
//   benchmark()  30 frame intervals from loop time 600 ms: median > 20 ms → T1; 12–20 ms → one tier down; else keep
//   governor     90-frame rolling fps; < 52 → DPR −0.25 (≥ 1.0); still < 52 after 3 s → tier down; one upgrade per
//                session after 10 s > 58 fps; never within the first 300 ms of a transition; paused while hidden.
//   A stable tier (10 s without change) is persisted to state.data.tier and used as the next start.
//   Dev only (A3): ?tier=T1|T2|T3 forces a tier (no benchmark, no governor); ?gov=0 disables only the governor.
import { logOnce, ENV } from './env.js';
import { bus } from './bus.js';
import { app } from './store.js';
import { state } from './state.js';
import { loop, ORDER } from './loop.js';
import { RENDER } from './tokens.js';

// H15 (ARCH-ADDENDUM X§3, X§7.3.3): fx pools (WP12) and audio params (WP3) per tier; unused until those WPs land.
const FX = {
  T3: Object.freeze({ dustPool: 65536, dustAmbient: 49152, stir: true, heptagon: true, deposition: true, prosvetWidth: 1.5, threadDust: 2000, swarf: 900, shed: 300, puff: 200, widthDof: true }),
  T2: Object.freeze({ dustPool: 32768, dustAmbient: 24576, stir: true, heptagon: true, deposition: true, prosvetWidth: 1.5, threadDust: 600, swarf: 900, shed: 300, puff: 200, widthDof: true }),
  T1: Object.freeze({ dustPool: 6144, dustAmbient: 4096, stir: false, heptagon: false, deposition: false, prosvetWidth: 1.0, threadDust: 0, swarf: 300, shed: 0, puff: 0, widthDof: false }),
};
const AUDIO = (t) => Object.freeze({ dustLoops: t === 'T1' ? 1 : 2, shadowDb: ENV.coarse ? -12 : -26 });

export const TIER_PARAMS = Object.freeze({
  T3: Object.freeze({ dprCap: 2.0, msaa: true, grains: 24576, stars: Object.freeze({ signal: 2000, zenith: 3000 }), bloom: 'kawase', lattice: 1.0, atlas: 1024, contours: 12, ringTex: Object.freeze([2048, 128]), labels: 24, sandText: true, fx: FX.T3, audio: AUDIO('T3') }),
  T2: Object.freeze({ dprCap: 1.5, msaa: true, grains: 16384, stars: Object.freeze({ signal: 2000, zenith: 3000 }), bloom: 'sprites', lattice: 1.0, atlas: 1024, contours: 12, ringTex: Object.freeze([2048, 128]), labels: 24, sandText: true, fx: FX.T2, audio: AUDIO('T2') }),
  T1: Object.freeze({ dprCap: 1.25, msaa: false, grains: 8192, stars: Object.freeze({ signal: 800, zenith: 1200 }), bloom: 'sprites', lattice: 0.5, atlas: 512, contours: 8, ringTex: Object.freeze([1024, 64]), labels: 16, sandText: false, fx: FX.T1, audio: AUDIO('T1') }),
});
/** H15: the T2-phone fx adjustment. */
const FX_T2_PHONE = Object.freeze({ ...FX.T2, dustPool: 16384, dustAmbient: 12288, heptagon: false, deposition: false, prosvetWidth: 1.0, threadDust: 300, swarf: 400, widthDof: false });
const ORDER_T = ['T1', 'T2', 'T3'];
const SOFTWARE = /SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i;
const G = RENDER.governor;

function isPhone() {
  try {
    const coarse = matchMedia('(pointer: coarse)').matches;
    return coarse && Math.min(window.innerWidth, window.innerHeight) <= 600;
  } catch (e) { return false; }
}

/** TIER_PARAMS[t] with phone adjustments (T2 MSAA off; labels 16 on phones). T0 → null. */
function paramsFor(t) {
  const base = TIER_PARAMS[t];
  if (!base) return null;
  if (!isPhone()) return base;
  return Object.freeze({ ...base, msaa: t === 'T2' ? false : base.msaa, labels: 16, fx: t === 'T2' ? FX_T2_PHONE : base.fx });
}

function devParam(name) {
  if (!__DEV__) return null;
  try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
}

let ctxRef = null;
let forced = false;          // ?tier= (dev): no benchmark, no governor
let govOn = true;
let travelStart = -1e9;      // loop ms of the last travel:start
let pendingTier = null;      // a tier change deferred out of a transition's first 300 ms
let stableSince = 0;
let upgraded = false;

// Governor ring buffer of frame intervals (ms).
const ring = new Float32Array(G.windowFrames);
let ringN = 0, ringI = 0, ringSum = 0;
let lowSince = -1, highSince = -1;
let lastNow = -1;

function resetRing() { ringN = 0; ringI = 0; ringSum = 0; lowSince = -1; highSince = -1; }

// Benchmark state.
const BENCH_FRAMES = 30;
const bench = new Float32Array(BENCH_FRAMES);
let benchN = 0;
let benchState = 'off';      // 'off' | 'wait' | 'run' | 'done'
let benchStartAt = 0;
let benchResolve = null;

function median(arr, n) {
  const a = Array.prototype.slice.call(arr, 0, n).sort((x, y) => x - y);
  return n ? (n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2) : 0;
}

function tierDown(t) { const i = ORDER_T.indexOf(t); return i > 0 ? ORDER_T[i - 1] : t; }
function tierUp(t) { const i = ORDER_T.indexOf(t); return i >= 0 && i < ORDER_T.length - 1 ? ORDER_T[i + 1] : t; }

function frame() {
  const now = loop.now;
  const step = lastNow < 0 ? 0 : now - lastNow;
  lastNow = now;
  if (quality.tier === 'T0' || step <= 0) return;

  // Deferred tier change once the transition's first 300 ms have passed.
  if (pendingTier && now - travelStart >= 300) { const t = pendingTier; pendingTier = null; quality.setTier(t, 'deferred'); }

  // Boot benchmark (first frames of the session).
  if (benchState === 'wait' && now >= benchStartAt) benchState = 'run';
  if (benchState === 'run') {
    bench[benchN++] = step;
    if (benchN >= BENCH_FRAMES) {
      benchState = 'done';
      const med = median(bench, benchN);
      let t = quality.tier;
      if (med > 20) t = 'T1'; else if (med >= 12) t = tierDown(t);
      if (t !== quality.tier) quality.setTier(t, `benchmark ${med.toFixed(1)} ms`);
      if (benchResolve) { benchResolve(quality.tier); benchResolve = null; }
      resetRing();
      stableSince = now;
    }
    return;
  }

  // Persist a tier that has been stable for 10 s.
  if (!forced && now - stableSince > G.upgradeAfterMs && state.data && state.data.tier !== quality.tier) {
    try { state.set('tier', quality.tier); } catch (e) { /* storage is optional */ }
  }

  if (forced || !govOn) return;
  quality.governor.update(step / 1000);
}

export const quality = {
  tier: 'T2',
  /** TIER_PARAMS[tier] with phone adjustments (null in T0) */
  params: TIER_PARAMS.T2,

  /** → { tier, gl: WebGL2RenderingContext|null } (sets quality.tier/params and app.tier) */
  detect() {
    let tier = 'T0';
    let gl = null;
    try {
      // (1) WebGL2 probe.
      const probe = document.createElement('canvas');
      const pgl = probe.getContext('webgl2');
      if (!pgl) throw new Error('no WebGL2');
      // (2) Renderer string.
      let renderer = '';
      try {
        const ext = pgl.getExtension('WEBGL_debug_renderer_info');
        renderer = String(ext ? pgl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : pgl.getParameter(pgl.RENDERER) || '');
      } catch (e) { renderer = ''; }
      try { const lose = pgl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); } catch (e) { /* ignore */ }
      // (3) Start tier.
      const soft = SOFTWARE.test(renderer);
      const hc = navigator.hardwareConcurrency || 4;
      const mem = navigator.deviceMemory;
      const fine = (() => { try { return matchMedia('(pointer: fine)').matches; } catch (e) { return false; } })();
      const phone = isPhone();
      const stored = state.data && state.data.tier;
      if (stored) tier = stored;
      else if (soft || hc <= 4 || (mem != null && mem <= 3)) tier = 'T1';
      else if (fine && hc >= 8) tier = 'T3';
      else if (!phone || (mem != null && mem >= 6)) tier = 'T2';
      else tier = 'T2';
      if (soft) tier = 'T1';                                              // the regex T1 cap always wins (even over a stored tier)
      const want = devParam('tier');
      if (want && /^T[0-3]$/.test(want)) { tier = want; forced = true; }
      if (devParam('gov') === '0') govOn = false;
      if (tier === 'T0') throw new Error('forced T0');
      // (4) The real context on #gl.
      const params = paramsFor(tier);
      const canvas = document.getElementById('gl');
      gl = canvas && canvas.getContext('webgl2', {
        antialias: params.msaa, alpha: true, premultipliedAlpha: true, depth: true, stencil: false,
        powerPreference: 'high-performance', preserveDrawingBuffer: false,
      });
      if (!gl) throw new Error('context creation failed');
    } catch (e) {
      // No WebGL2 is an expected environment (T0 is a designed mode): silent in production (ARCH §7.5).
      if (__DEV__ && String(e && e.message) !== 'forced T0') logOnce('quality', 'WebGL2 unavailable → T0', String(e && e.message || e));
      tier = 'T0';
      gl = null;
    }
    quality.tier = tier;
    quality.params = paramsFor(tier);
    app.tier = tier;
    return { tier, gl };
  },

  /** Starts the 30-frame boot benchmark at loop time 600 ms (no-op when forced / T0). → Promise<tier> */
  benchmark() {
    if (forced || quality.tier === 'T0' || benchState !== 'off') return Promise.resolve(quality.tier);
    benchState = 'wait';
    benchN = 0;
    benchStartAt = loop.now + 600;
    return new Promise((r) => { benchResolve = r; });
  },

  /** Emits 'tier:change' {tier, prev}; never inside the first 300 ms of a transition (deferred instead). */
  setTier(t, reason = '') {
    if (!TIER_PARAMS[t] || t === quality.tier || quality.tier === 'T0') return;
    if (app.phase === 'transition' && loop.now - travelStart < 300) { pendingTier = t; return; }
    const prev = quality.tier;
    quality.tier = t;
    quality.params = paramsFor(t);
    app.tier = t;
    quality.governor.dropSteps = 0;
    stableSince = loop.now;
    resetRing();
    const r = ctxRef && ctxRef.renderer;
    if (r) { try { r.setTier(t); r.setDprDrop(0); } catch (e) { logOnce('quality:renderer', e); } }
    if (__DEV__) logOnce(`tier:${prev}->${t}`, `tier ${prev} → ${t}`, reason);
    bus.emit('tier:change', { tier: t, prev });
  },

  governor: {
    fps: 60,
    dropSteps: 0,
    /** dt in seconds (real frame interval). */
    update(dt) {
      const ms = dt * 1000;
      if (!(ms > 0)) return;
      if (ringN === G.windowFrames) ringSum -= ring[ringI]; else ringN++;
      ring[ringI] = ms;
      ringSum += ms;
      ringI = (ringI + 1) % G.windowFrames;
      if (ringN < G.windowFrames) return;
      const fps = 1000 / (ringSum / ringN);
      quality.governor.fps = fps;
      const now = loop.now;
      if (fps < G.lowFps) {
        highSince = -1;
        if (lowSince < 0) lowSince = now;
        const r = ctxRef && ctxRef.renderer;
        const cap = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, TIER_PARAMS[quality.tier].dprCap);
        if (now - lowSince > G.dropAfterMs) {
          // Still below 52 fps 3 s after it first dropped: one tier down (T1 is the floor; DPR steps keep going there).
          if (quality.tier !== 'T1') { quality.setTier(tierDown(quality.tier), `governor ${fps.toFixed(0)} fps`); return; }
        }
        if (r && cap - RENDER.dprStep * (quality.governor.dropSteps + 1) >= 1.0 - 1e-6) {
          quality.governor.dropSteps++;
          try { r.setDprDrop(quality.governor.dropSteps); } catch (e) { logOnce('quality:dpr', e); }
          ringN = 0; ringI = 0; ringSum = 0;      // measure the new DPR afresh over 90 frames (keep lowSince)
        }
      } else {
        lowSince = -1;
        if (fps > G.highFps && !upgraded) {
          if (highSince < 0) highSince = now;
          if (now - highSince > G.upgradeAfterMs && quality.tier !== 'T3') {
            upgraded = true;
            quality.setTier(tierUp(quality.tier), `governor ${fps.toFixed(0)} fps`);
          }
        } else highSince = -1;
      }
    },
  },

  /** WP0 addition: binds ctx (for ctx.renderer) and registers the benchmark + governor frame hook. */
  init(ctx) {
    ctxRef = ctx;
    stableSince = loop.now;
    loop.add(frame, ORDER.UI);
  },
};

bus.on('travel:start', () => { travelStart = loop.now; });
bus.on('visibility', () => { resetRing(); lastNow = -1; });
