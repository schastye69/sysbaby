// sam.vin — DESIGN TOKENS, JS twin of tokens.css (SPEC §2, §3.1, §3.10, §5, §7).
// Verbatim copy → samvin-src/src/core/tokens.js (WP0). Pure data + pure helpers: no DOM, no three.js import, no side effects.
// Every number here is a SPEC number (section noted). Nobody hard-codes these values anywhere else:
// import them. Other WP0 modules re-export from here (ARCH §5.3) so there is exactly one source.

// ═══ 1. PALETTE (SPEC §2.1) ═══════════════════════════════════════════════════════════════════════════════
/** Token names = SPEC names without '--' (ember-deep → emberDeep). Order is fixed. */
export const TOKEN_NAMES = Object.freeze(['void', 'abyss', 'deep', 'steel', 'slate', 'pewter', 'silver', 'white',
  'obsidian', 'ember', 'emberDeep', 'electrum', 'paper', 'ink']);

/** token → CSS custom property name */
export const CSS_VAR = Object.freeze({ void: '--void', abyss: '--abyss', deep: '--deep', steel: '--steel', slate: '--slate',
  pewter: '--pewter', silver: '--silver', white: '--white', obsidian: '--obsidian', ember: '--ember', emberDeep: '--ember-deep',
  electrum: '--electrum', paper: '--paper', ink: '--ink' });

/** token → '#RRGGBB' (display space; ColorManagement is disabled, so these go into shaders unchanged — ARCH §3.2) */
export const PALETTE = Object.freeze({
  void: '#04060A', abyss: '#070B12', deep: '#0C1420', steel: '#13202F', slate: '#233446', pewter: '#5E6E80',
  silver: '#B8C4D0', white: '#EEF2F6', obsidian: '#0B1119', ember: '#FF6A2B', emberDeep: '#B23A12',
  electrum: '#E8C872', paper: '#E6EAEE', ink: '#0C1420',
});

/** ИЗНАНКА swap (SPEC §2.1 rule 5): only the tokens that change; every other token keeps its PALETTE value. Ember stays ember.
 *  void→paper, silver/white→ink, steel/slate→#9AA6B4, obsidian→#D3D9DF (SPEC); abyss/deep→paper (ARCH §5.1 completion:
 *  fog and scrims must not paint dark on paper). Identical to tokens.css :root[data-inverted]. */
export const PALETTE_INVERT = Object.freeze({
  void: '#E6EAEE', abyss: '#E6EAEE', deep: '#E6EAEE', steel: '#9AA6B4', slate: '#9AA6B4',
  silver: '#0C1420', white: '#0C1420', obsidian: '#D3D9DF',
});

/** '#FF6A2B' → 0xFF6A2B (THREE.Color.setHex / material.color ready) */
export function hexToNum(hex) { return parseInt(hex.slice(1), 16); }
/** '#FF6A2B' → [1, 0.41568…, 0.16862…] (vec3 0..1, display space, no linearisation) */
export function hexToVec3(hex, out = [0, 0, 0]) {
  const n = hexToNum(hex);
  out[0] = ((n >> 16) & 255) / 255; out[1] = ((n >> 8) & 255) / 255; out[2] = (n & 255) / 255;
  return out;
}
/** '#FF6A2B' → '255,106,43' (the CSS --x-rgb triplet) */
export function hexToRgbTriplet(hex) { const n = hexToNum(hex); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; }

function mapTokens(src, fn) { const o = {}; for (const k of Object.keys(src)) o[k] = fn(src[k]); return Object.freeze(o); }
/** token → 0xRRGGBB */
export const PALETTE_NUM = mapTokens(PALETTE, hexToNum);
/** token → frozen [r, g, b] 0..1 */
export const PALETTE_VEC3 = mapTokens(PALETTE, (h) => Object.freeze(hexToVec3(h)));
export const PALETTE_INVERT_NUM = mapTokens(PALETTE_INVERT, hexToNum);
export const PALETTE_INVERT_VEC3 = mapTokens(PALETTE_INVERT, (h) => Object.freeze(hexToVec3(h)));

/** The colour of `token` at ИЗНАНКА mix u (0 = normal, 1 = inverted), written into out (vec3 0..1). Allocation-free. */
export function paletteMix(token, u, out = [0, 0, 0]) {
  const a = PALETTE_VEC3[token], b = PALETTE_INVERT_VEC3[token] || a;
  out[0] = a[0] + (b[0] - a[0]) * u; out[1] = a[1] + (b[1] - a[1]) * u; out[2] = a[2] + (b[2] - a[2]) * u;
  return out;
}
const _mix = [0, 0, 0];
/** Same as paletteMix but → '#RRGGBB' (for the inline CSS vars palette.setInverted writes during the roll). */
export function paletteMixHex(token, u) {
  const c = paletteMix(token, u, _mix);
  let s = '#';
  for (let i = 0; i < 3; i++) s += Math.round(c[i] * 255).toString(16).padStart(2, '0').toUpperCase();
  return s;
}

/** Alphas and gains that SPEC attaches to colours (SPEC §2–§3, §6). */
export const ALPHA = Object.freeze({
  giant: 0.07,            // GIANT numeral at rest (§2.2)
  counter: 0.12,          // GIANT elevator counter during travel (§7.4)
  status: 0.85,           // STATUS line silver (§2.2)
  scrim: 0.60,            // radial --deep scrim (§2.3)
  scrimBreath: [0.58, 0.62],
  leader: 0.70,           // 0.5 px leader hairline (§2.3)
  line: 0.55,             // R3 default edge/line alpha (--silver at 55 %) (§2.4)
  vertex: 0.40,           // 2 px --white vertex points (§3.2, §4.1)
  inlay: 0.45,            // R4 base inlay, --silver (§2.4)
  fresnel: 0.55,          // R2 Fresnel rim gain toward --silver (§2.4)
  grains: 0.35,           // idle grains, --silver (§3.1)
  grainsBreath: [0.32, 0.38],
  axisInside: 0.35,       // ember axis ribbon inside the Key (§3.1)
  marginalia: 0.80,       // ARCHIVE jokes (§6.4)
  legendBand: 0.40,       // legend band lines, --silver (§6.4)
  column: 0.70,           // MEMBERS column ribbons, --silver (§6.2)
  dimmed: 0.40,           // other columns while one is focused (§6.2)
  hoverOthers: 0.55,      // other Key hover labels (§3.4)
  dome: 0.45,             // INSIGNIA geodesic sphere lines (§6.6)
  contours: 0.40,         // mission terrain contours (§6.3)
  doneLight: 0.12,        // done-hatch 30 m silver light column (§6.3)
  ghost: 0.60,            // phone-start ghost dot (§4.2)
  ghostStroke: 0.30,      // SIGNAL ghost star (§6.5)
  whale: 0.30,            // lattice whale (§8.1 S07)
  spark: 0.30,            // companion spark before it arrives (§8.1 S14)
  rimBoot: [0.06, 0.12],  // CORE rim visibility during boot (§4.1)
  bandHover: 1.25,        // archive band / data ring brighten +25 % (multiplier)
});

/** Accent budget rules (SPEC §2.1). QA measures them; owners respect them. */
export const EMBER = Object.freeze({ maxFrac: 0.03, peakFrac: 0.06, peakMs: 1500, maxLinePx: 2, maxDotPx: 6, maxTextPx: 11, burnCoolMs: 1200 });
export const ELECTRUM = Object.freeze({ maxMs: 2500, coolMs: 600, nightNucleus: 0.55 });
/** Night (SPEC §8.1 S10, §4.3) */
export const NIGHT = Object.freeze({ nucleusIntensity: 0.55, litAlpha: 0.70, breathMs: 7000, drowsyBreathMs: 5600, mixMs: 1200, yawnMs: 1200 });

// ═══ 2. TYPE (SPEC §2.2) — for canvas text and JS-built styles; DOM uses the .t-* classes ══════════════════
export const FONT = Object.freeze({ sans: '"Geologica", system-ui, sans-serif', mono: '"Martian", ui-monospace, monospace' });
/** px sizes / line heights / axes. 'vw'/'vmin'/'clamp' sizes are CSS strings (DOM only). */
export const TYPE = Object.freeze({
  giant:   { family: 'sans', wght: 100, tracking: -0.04,  lh: 0.8, desktop: '38vw', phone: '62vmin', alpha: 0.07 },
  display: { family: 'sans', wght: 220, tracking: -0.035, lh: 0.9, desktop: 'clamp(56px, 8.4vw, 148px)', phone: '13vmin' },
  heading: { family: 'sans', wght: 560, desktop: [28, 34], phone: [26, 31] },
  lead:    { family: 'sans', wght: 300, desktop: [22, 30], phone: [19, 26] },
  brief:   { family: 'sans', wght: 380, desktop: [19, 28], phone: [17, 25] },
  body:    { family: 'sans', wght: 380, desktop: [17, 25], phone: [16, 24], measureCh: 36 },
  status:  { family: 'sans', wght: 400, desktop: [16, 22], phone: [16, 22], maxChars: 34, measureCh: 44 },
  label:   { family: 'mono', wght: 500, wdth: 87.5, tracking: 0.08, upper: true, desktop: [11, 14], phone: [11, 14] },
  data:    { family: 'mono', wght: 250, wdth: 100, tabular: true, desktop: [72, 72], phone: [48, 48] },
  micro:   { family: 'mono', wght: 450, wdth: 75, tracking: 0.10, upper: true, desktop: [9.5, 12], phone: [10, 13] },
});
/** Canvas fonts (ctx.font strings). Await fontsReady() before rasterising (ARCH §1.6). */
export const CANVAS_FONT = Object.freeze({
  sign: '700 {px}px "Geologica"',        // Key signs in the height atlas (Geologica wght 700) (§3.1)
  burn: '700 {px}px "Geologica"',        // his name on the rim (§4.1)
  sand: '700 {px}px "Geologica"',        // РЕЗОНАНС text targets on a 1024×256 canvas (§3.7)
  ring: '500 {px}px "Martian"',          // UNFOLD data-ring strips, uppercase (§3.6)
});
/** Readability floor (SPEC §2.2): readable Russian ≥ 15 px, contrast ≥ 7:1; micro < 12 px only for codes/labels. */
export const READABLE_MIN_PX = 15;

/** SHRP bond meter (SPEC §2.2): bond = min(1, 0.08·distinctDays + 0.06·secretsFound); SHRP = round(20 + 80·bond). */
export const SHRP = Object.freeze({ base: 20, range: 80, perDay: 0.08, perSecret: 0.06 });
export function bondOf(distinctDays, secretsFound) { return Math.min(1, SHRP.perDay * distinctDays + SHRP.perSecret * secretsFound); }
export function shrpOf(distinctDays, secretsFound) { return Math.round(SHRP.base + SHRP.range * bondOf(distinctDays, secretsFound)); }

// ═══ 3. MOTION (SPEC §2.5) ═════════════════════════════════════════════════════════════════════════════════
/** UI durations come in octaves (ms). */
export const OCTAVE = Object.freeze([120, 240, 480, 960, 1920]);
export const DUR = Object.freeze({ o1: 120, o2: 240, o3: 480, o4: 960, o5: 1920 });

/** Springs: x'' = ω²(target − x) − 2ζω x'. Critically damped unless named. core/spring.js exports SPRING = SPRINGS. */
export const SPRINGS = Object.freeze({
  heavy:   Object.freeze({ omega: 6,   zeta: 1 }),     // camera, strata (settles ≈ 700 ms)
  medium:  Object.freeze({ omega: 12,  zeta: 1 }),     // column re-spacing, panels, relics, detent snaps
  light:   Object.freeze({ omega: 22,  zeta: 1 }),     // labels, ticks, needle, phone-stroke stratum snap
  struck:  Object.freeze({ omega: 18,  zeta: 0.18 }),  // everything that is hit rings: columns, edge strings, rings
  notice:  Object.freeze({ omega: 6.3, zeta: 0.95 }),  // Key leans toward the pointer (§3.3)
  reindex: Object.freeze({ omega: 9,   zeta: 1 }),     // idle re-index turn (§3.3)
  hot:     Object.freeze({ omega: 14,  zeta: 1 }),     // nucleus hot side (§3.3)
  hint:    Object.freeze({ omega: 8,   zeta: 0.25 }),  // navigator needle pendulum (§5.2)
});

/** Inertia & overshoot (SPEC §2.5, §6.4, §6.6). */
export const MOTION = Object.freeze({
  inertiaDecay: 0.92,          // velocity × 0.92 per 16.7 ms frame (drags, scrub, pull s-velocity); per dt: pow(0.92, dt/0.0167)
  frameMs: 16.7,
  spinDecay: 0.96,             // held relics / finds: angular velocity × 0.96 per frame
  overshootMax: 0.04,          // mechanical snaps only; nothing bounces
  snapOvershoot: 0.04,         // cryptex lock snap 4 %
  settleOvershoot: 0.02,       // RECALL settle, hover exit, pitch spring-back 2 %
  anticipationFrac: 0.03,      // 3 % counter-move …
  anticipationMs: 120,         // … over 120 ms …
  anticipationMinDisp: 0.10,   // … when displacement ≥ 10 % of the current view distance
  responseMs: 80,              // every interaction answers within 80 ms (§2.7)
  pressScale: 0.96, pressMs: 90, rippleMs: 260, ripplePx: 48,   // phone touch-down (§2.7, §10.3)
});

/** The world breath (SPEC §2.5): one clock drives every idle motion. */
export const BREATH = Object.freeze({ periodMs: 4200, inhaleMs: 1800, exhaleMs: 2400, drowsyMs: 5600, nightMs: 7000, reducedAmp: 0.25,
  nucleus: [0.80, 1.00], gap: [0.020, 0.026], grainAlpha: [0.32, 0.38], scrim: [0.58, 0.62], edgeSwayPx: 0.2, droneDb: 2 });

/** Cubic-bezier easing (CSS semantics). Pure, allocation-free per call: Newton–Raphson with a bisection fallback. */
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return function ease(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return sy(t);
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1; t = x;
    for (let i = 0; i < 24; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return sy(t);
  };
}
/** Control points (also used verbatim in CSS). */
export const EASE_CURVES = Object.freeze({
  camera:   Object.freeze([0.7, 0, 0.15, 1]),    // "excavation": camera, transition time → u (§2.5, §7.1)
  reveal:   Object.freeze([0.16, 1, 0.3, 1]),    // reveals, lock-in (§2.2, §2.5)
  phosphor: Object.freeze([0.2, 0, 0, 1]),       // BEAM WRITE colour decay (§2.2)
});
/** Easing functions. core/ease.js: `bezier = cubicBezier`, `EASE = { ...EASINGS, linear }`. */
export const EASINGS = Object.freeze({
  camera: cubicBezier(0.7, 0, 0.15, 1),
  reveal: cubicBezier(0.16, 1, 0.3, 1),
  phosphor: cubicBezier(0.2, 0, 0, 1),
  linear: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x),
  sine: (x) => 0.5 - 0.5 * Math.cos(Math.PI * (x <= 0 ? 0 : x >= 1 ? 1 : x)),   // breath halves (sine-shaped)
});

/** Named durations (ms) from SPEC. Owners read these instead of retyping numbers. */
export const TIMING = Object.freeze({
  // transitions (§7, ARCH §3.6.3)
  dive: 1600, diveFirst: 2400, diveFirstScale: 1.375, diveFirstHold: 200, diveSwapAt: 1200, diveSwapAtFirst: 1850,
  recall: 1200, recallSwapAt: 1000, recallRatchetMs: 40,
  liftBase: 900, liftPerBoundary: 280, liftMax: 1800,        // min(1800, 900 + 280·(B − 1))
  slice: 280, sliceSwap: 140,
  depart: 240, arrive: 600, readableOut: 120,
  retargetMin: 600, retargetFactor: 0.8, skipSpeed: 3, interactiveU: 0.7, releaseSourceMs: 300, tierFreezeMs: 300,
  unfold: 1600, unfoldFirst: 2200, refold: 900,
  memberFocus: 900, memberBack: 600, shluz: 1400, shluzBack: 900, extract: 600, workshop: 1200,
  zenith: 2400, nadirFirst: 2800, focusReduced: 160,
  // boot (§4)
  bootDesktop: 7200, bootReturning: 3500, bootSameDay: 2000, bootReduced: 2000,
  lockStep: 220, lockStepSameDay: 110, firstLock: 3400, ignite: 4940, ignitionReturning: 2640,
  typeMsPerChar: 28, scanMs: 800, burnMsPerLetter: 70, burnCoolMs: 1200, assemble: 480, drawIn: 600,
  phoneActivateWindow: 1500, phonePartialHold: 2500, phonePartialDrift: 900, phoneHintDelay: 2200, phoneHintReturning: 4000,
  // text (§2.2)
  lockIn: 480, lockInReduced: 160, revealMsPerChar: 12, revealMax: 240, beamCps: 22, phosphor: 900,
  statusIn: 240, statusHold: 4000, idleRotate: 20000, leadDefault: 4000,
  // UI (§2.3, §3.4, §5.2)
  leaderDraw: 240, leaderStagger: 40, labelLowpass: 120, coordHz: 10,
  keyHoverTrigger: 120, keyHoverIn: 480, keyHoverOut: 520, dimsDraw: 240,
  navHover: 240, navTwin: 240, longPress: 800, relaunch: 2000, relaunchRingDelay: 300, hintGlint: 1200,
  overpullHold: 600, stringRing: 900, stringFlash: 120, shudder: 240, hintArriveWindow: 30000,
  idleLampMs: 3000, lampSweepMs: 9000, lampBlendMs: 600,
  shardFlight: 900, electrum: 2500, electrumCool: 600,
});

// ═══ 4. SCALE — one world nested ×1000 (SPEC §3.8, §3.10, §7.1; ARCH §3.3) ═════════════════════════════════
export const WORLD_SCALE = 1000;                 // VIN = the Key ×1000; the Key is VIN at 1 : 1,000
export const LN_WORLD_SCALE = Math.log(1000);    // 6.907755… (SPEC writes 6.9078)
export const NEST_LEVELS = Object.freeze([-1, 0, 1, 2]);   // mini Key, the Key, VIN, parent VIN
export const LEVEL_GLOW_FACTOR = 1.5;            // a level's nucleus glow draws only beyond 1.5 × its height
export const CLIP = Object.freeze({ near: 0.002, far: 400 });   // near = 0.002·d, far = 400·d (no log depth buffer)
/** CORE zoom, PULL and DESCENT (SPEC §3.8). */
export const ZOOM = Object.freeze({ min: 3.2, max: 12.0, rest: 7.2, wheelFactor: 1.1, wheelStepPx: 100 });
export const PULL = Object.freeze({
  d0: 12, k: LN_WORLD_SCALE,                  // d = 12·e^(k·s); s = 1 → ×1000
  wheelDiv: 2400, pinchGain: 1.5,             // wheel s += deltaY/2400; pinch s += 1.5·log10(f)
  pauseMs: 400, decay: 0.92, elevationDeg: 8,
  settleIdleMs: 600, settleMs: 1600, settleTo: 7.2, leadMs: 4000, strutTickMax: 30,
  stages: Object.freeze([['КЛЮЧ', 60], ['ЗАЛ ЯДРА', 600], ['VIN', 3600], ['VIN ЦЕЛИКОМ', 12000]]),   // MICRO label while d < limit
  passLatticeD: [300, 620],
});
export const DESCENT = Object.freeze({ d0: 0.06, k: LN_WORLD_SCALE, miniKeyBelow: 0.05 });   // d = 0.06·e^(−k·s)
/** VIN as a whole (SPEC §3.10). */
export const VIN = Object.freeze({ height: 2400, diameter: 1240, radius: 620 });

// ═══ 5. THE KEY — geometry (SPEC §3.1). world/structure.js re-exports PROFILE, STRATA_GEOM, radiusAt from here. ═══
/** r(y) = 0.62 · (1 − |y / 1.20|^1.35): circumradius of the n-gon at height y. */
export const PROFILE = Object.freeze({ H: 2.4, R: 0.62, k: 1.35, halfH: 1.2 });
export function radiusAt(y) { const a = Math.min(1, Math.abs(y) / PROFILE.halfH); return PROFILE.R * (1 - Math.pow(a, PROFILE.k)); }

/** Seven strata, top → bottom. y ranges already contain the 0.020 m rest gaps. k = generators per family = 24·n.
 *  rTop/rBot = radiusAt(top/bot) (SPEC table rounds them: S 0→0.148, A 0.161→0.343, M 0.355→0.533, • 0.541→0.620→0.541 …). */
export const STRATA_GEOM = Object.freeze([
  { i: 0, sign: 'S', code: 'SIGNAL',   top:  1.20, bot:  0.98, n: 3,  hollow: 0,    k: 72  },
  { i: 1, sign: 'A', code: 'ARCHIVE',  top:  0.96, bot:  0.66, n: 5,  hollow: 0,    k: 120 },
  { i: 2, sign: 'M', code: 'MEMBERS',  top:  0.64, bot:  0.28, n: 7,  hollow: 0,    k: 168 },
  { i: 3, sign: '•', code: 'CORE',     top:  0.26, bot: -0.26, n: 12, hollow: 0.30, k: 288 },
  { i: 4, sign: 'V', code: 'VOYAGES',  top: -0.28, bot: -0.64, n: 7,  hollow: 0,    k: 168 },
  { i: 5, sign: 'I', code: 'INSIGNIA', top: -0.66, bot: -0.96, n: 5,  hollow: 0,    k: 120 },
  { i: 6, sign: 'N', code: 'NADIR',    top: -0.98, bot: -1.20, n: 3,  hollow: 0,    k: 72  },
].map((s) => Object.freeze({ ...s, height: Math.round((s.top - s.bot) * 1000) / 1000, mid: (s.top + s.bot) / 2,
  rTop: radiusAt(s.top), rBot: radiusAt(s.bot), rMax: (s.top > 0 && s.bot < 0) ? PROFILE.R : Math.max(radiusAt(s.top), radiusAt(s.bot)) })));
export const SIGNS = Object.freeze(['S', 'A', 'M', '•', 'V', 'I', 'N']);
/** Ring fractions each stratum is lofted through (top, ⅓, ⅔, bottom). */
export const LOFT_RINGS = Object.freeze([0, 1 / 3, 2 / 3, 1]);

/** Gaps between strata (m). A gap g moves stratum i by Δy_i = (3 − i)·(g − 0.020) (ARCH §3.3.3). */
export const GAP = Object.freeze({ rest: 0.020, breath: 0.026, leanAdd: 0.010, hover: 0.090, hoverNeighbourPush: 0.012,
  dive: 0.30, unfold: 0.42, recallStart: 0.30 });
export const KEY = Object.freeze({
  radius: 1.25,                 // bounding radius used for the lamp focus and screen info (ARCH §3.18)
  apertureD: 0.09, ringEngraveW: 0.004, hollowR: 0.30,
  sign: Object.freeze({ depth: 0.004, heightFrac: 0.70, strokeFrac: 0.12, face: 0 }),
  friezeH: 0.018, ticksPerFace: 12, tickLen: 0.025,
  backFace: 6,                  // stratum 3, face 6: his glyph
  hoverSlide: 0.06, diveSlide: 0.25, diveTurnAwayDeg: 20, contract: 0.03, nucleusAnticipation: 1.6,
  lattice: Object.freeze({ faceShift: 0.75, segmentsPerGenerator: 8, generators: 2016, segments: 16128, solidBelowCamDist: 2.4 }),
  r1: Object.freeze({ spLo: 3.0, spHi: 6.0 }),    // R1: lattice alpha = smoothstep(3, 6, projected strut spacing px)
  unfold: Object.freeze({ camFrom: 7.2, camTo: Object.freeze([0, 0.04, 0.95]), ringScale: 2.4, ringR: 1.3, ringArcDeg: 300,
    ringCap: 0.06, coreRingCap: 0.12, platesR: 0.16, plateSize: 0.05, platesPeriodS: 24, orbitYawDeg: 35 }),
  pitchFlipDeg: 110, pitchResist: 0.35, pitchResistMaxDeg: 30, yawMaxDeg: 180, yawReturnMs: 2000,
});
export const NUCLEUS = Object.freeze({ r: 0.035, detail: 1, glowR: 0.0528, breathRingR: 0.09,
  apertureAlignDeg: Object.freeze([35, 10]), gapOpen: Object.freeze([0.03, 0.09]), minVisibility: 0.25, hotGain: 0.40,
  intensity: Object.freeze([0.80, 1.00]), birthdayPulse: 1.3 });
export const AXIS = Object.freeze({ half: 1.20, extend: 3.2, widthPx: 2, alphaInside: 0.35, shootMs: 240 });
/** Idle life & attention (SPEC §3.3). Periods in seconds, delays in ms. */
export const IDLE = Object.freeze({
  driftYawDeg: 14, driftPeriodS: 40, swayDeg: 1.5, swayPeriodsS: Object.freeze([11, 13, 17, 19, 23, 29, 31]), faceViewerDeg: 16,
  reindexMs: Object.freeze([23000, 41000]), reindexBackMs: 1600, reindexTurnMs: 620,
  noticeMaxDeg: 7, noticeBootDeg: 6, tauBaseMs: 40, tauStepMs: 40,        // τ_i = 40 + 40·|i − 3|
  hotDelayMs: 220, hotDelayLateMs: 90, hotTrackMs: 3000, hotRampMs: 1000,
  leanSpeedPx: 300, leanRadius: 1.2, leanDz: 0.08,
  flinchSpeedPx: 2500, flinchRadius: 1.5, flinchInMs: 120, flinchRelaxMs: 700, flinchScatter: 0.05,
  repelR: 0.35, repelCap: 0.06, repelBackMs: 900,
});
export const GRAINS = Object.freeze({ T3: 24576, T2: 16384, T1: 8192, annulus: Object.freeze([1.15, 1.90]), kepler: 0.06,
  jitter: 0.002, sizePx: Object.freeze([1.2, 2.0]), chunk: 4096 });
export const LIT_NODES = Object.freeze({ faces: Object.freeze([11, 0, 1]), stratum: 3, apertureSkip: 0.06, dotPx: 1.5, emitterM: 1.2 });
export const SATELLITES = Object.freeze({ max: 7, size: 0.10, r: 1.05, tiltDeg: 12, periodS: 90 });
export const COMPANION = Object.freeze({ size: 0.24, r: 1.6, periodS: 60, bpm: 71, arriveDay: 10, flyMs: 2400 });
/** D_k = 400 + 3000·(1 − k/10) m, k = distinct days (S14). */
export function companionDistance(k) { return 400 + 3000 * (1 - Math.min(10, k) / 10); }

// ═══ 6. VIN HALLS — altitudes, shell, cameras (SPEC §1, §3.10, §6, §7) ═════════════════════════════════════
/** Canonical anchor altitude (m) of every hall = stratum centre × 1000. world/rooms.js reads ROOMS[id].alt from here. */
export const HALL_ALT = Object.freeze({ SIGNAL: 1090, ARCHIVE: 810, MEMBERS: 460, CORE: 0, VOYAGES: -460, INSIGNIA: -810,
  NADIR: -1090, ZENITH: 1260, WORKSHOP: 484 });
/** Hall bands [floor, ceil] (canonical m) = stratum y range × 1000 (ZENITH/WORKSHOP: ARCH §3.7.1). */
export const HALL_BAND = Object.freeze({ SIGNAL: [980, 1200], ARCHIVE: [660, 960], MEMBERS: [280, 640], CORE: [-260, 260],
  VOYAGES: [-640, -280], INSIGNIA: [-960, -660], NADIR: [-1200, -980], ZENITH: [1200, 1400], WORKSHOP: [482, 487] });
/** The generic interior (SPEC §3.10, §6.0; ARCH §3.7.4). Metres, hall-local. */
export const HALL = Object.freeze({
  wallsNear: 300, wallsFar: 620, wallVis: Object.freeze([0.08, 0.14]),   // walls 300–620 m away at 8–14 % visibility
  strutSpacing: Object.freeze([13, 60]),
  ringStep: 20, irisR: 18, irisBlades: 7, irisBladeDeg: 51.4, irisPassR: 12,
  deckR: 60, deckRingStep: 4,
  beadR: 1.8, beadStep: 25, beadCount: 97,                                  // axis pillar: y −1,200…+1,200
  coreRimR: 300, coreIrisY: 260,
  liftOffset: Object.freeze([12, 0, 6]),                                    // ride beside the pillar (x +12, z +6)
  drawCalls: 40, triangles: 120000, labels: 24, labelsLow: 16,              // per-hall budgets (SPEC §6.0, §10.4)
});
/** Rest camera poses from SPEC (hall-local metres; owners build CameraPose from these). pitch in degrees when no target is given. */
export const CAMERA = Object.freeze({
  fov: 35, fovWide: 40,
  core:     Object.freeze({ pos: [0, 0.75, 7.2], target: [0, 0, 0], fov: 35, phoneOffsetY: -0.06 }),   // phone: Key centred at 44 %
  boot:     Object.freeze({ start: [0, 0.4, 16], dolly: 9.5, rest: 7.2, driftM: 0.08, driftHz: [0.13, 0.11], tiltDeg: 3 }),
  phoneStart: Object.freeze({ dist: 5.2, keyFrac: 0.78, centreFrac: 0.47 }),
  members:  Object.freeze({ pos: [0, 10, 48], target: [0, 12.5, 0], fov: 35, phonePos: [0, 11, 40] }),
  voyages:  Object.freeze({ pos: [0, 70, 44], target: [0, 0, -6], fov: 35, altRange: [60, 140], phonePos: [0, 96, 30], phonePitchDeg: -70 }),
  archive:  Object.freeze({ tubeR: 9, eyeBelowBand: 0.4 }),
  signal:   Object.freeze({ pos: [0, 2, 26], target: [0, 30, 0], fov: 40, phonePos: [0, 2, 30], phonePitchDeg: 40, apexH: 110, apexR: 12 }),
  insignia: Object.freeze({ pos: [0, 1.7, 0], fov: 40, sphereR: 30 }),
  nadir:    Object.freeze({ depth: 110 }),
  zenith:   Object.freeze({ aboveApex: 60, pitchDeg: -62, phonePitchDeg: -70 }),
  workshop: Object.freeze({ chamber: 4.4, grid: 2.4, nodeStep: 0.4 }),
});

// ═══ 7. LAYOUT & CHROME (SPEC §2.3, §5.2, §6.0, §10.2) — same values as tokens.css ════════════════════════
export const LAYOUT = Object.freeze({
  phoneMaxShort: 600, landMaxH: 500,                       // phone = coarse && min(w,h) ≤ 600; phone-land = phone && h < 500
  desktop: Object.freeze({ cols: 12, margin: 48, gutter: 24, chrome: 24, edgeInset: 14, statusBottom: 40, datumFrac: 0.62 }),
  phone:   Object.freeze({ cols: 4, margin: 16, gutter: 12, chrome: 16, edgeInset: 10, statusAboveBand: 12, datumPx: 120, titleTopPx: 72 }),
  measureCh: 36, statusMeasureCh: 44, hit: 44, hitRow: 56, crossPx: 7,
  leader: Object.freeze({ widthPx: 0.5, alpha: 0.70, elbowMin: 24, elbowMax: 64, runMax: 120, maxAnchors: 24, maxAnchorsLow: 16 }),
  dims: Object.freeze({ widthPx: 0.5, arrowPx: 6, extPx: 4, gapPx: 4, offsetPx: 24 }),
  scrim: Object.freeze({ scale: 1.4, featherPx: 40 }),
  nav: Object.freeze({ w: 56, h: 300, hoverW: 260, right: 24, widthScale: 0.36, needlePx: 12, slotPx: 3, zenithDotPx: 2, zenithDotAbove: 10,
    twinPx: 40, magnetPx: 12, wheelPxPerDetent: 120, rubber: 0.35, rubberMax: 48, overpullPx: 140, letterPx: 11 }),
  band: Object.freeze({ h: 88, sideW: 72, letterPx: 13, minCell: 44 }),
  sheet: Object.freeze({ maxFrac: 0.62, peek: 120, handle: 24, sideFrac: 0.44 }),
  elevator: Object.freeze({ pxPerHall: 360, resistance: 0.22, tickPx: 60 }),
  edge: Object.freeze({ pluckPxMs: 0.4, bendPx: 8, twitchPx: 2 }),
  sound: Object.freeze({ w: 32, h: 12, bars: 8, fps: 30 }),
  cursorPx: 6, rippleMaxPx: 48, beamHeadPx: 3, statusDotPx: 6,
});

// ═══ 8. RENDER CONSTANTS (SPEC §2.4 R1–R8) ═══════════════════════════════════════════════════════════════════
export const RENDER = Object.freeze({
  r1: Object.freeze({ lo: 3.0, hi: 6.0, bayer: 8 }),
  r2: Object.freeze({ fresnelPow: 3.0, fresnelGain: 0.55, spec: Object.freeze([[24, 0.35], [160, 0.6]]) }),
  r3: Object.freeze({ widthPx: 1, primaryPx: 1.5, axisPx: 2, alpha: 0.55, glintPow: 24, glintGain: 0.9, farFadeStart: 0.55, primaryEdges: 12 }),
  r4: Object.freeze({ atlas: 1024, atlasLow: 512, rakeLo: 0.55, rakeHi: 0.90, inlay: 0.45, heightTaps: 4 }),
  r5: Object.freeze({ radiusFactor: 2.2, elevationDeg: 12, idleMs: 3000, sweepMs: 9000, blendMs: 600 }),
  r6: Object.freeze({ threshold: 0.82, levels: 4, spritePx: 64 }),
  r7: Object.freeze({ grain: 0.02, grainBoot: 0.025, grainBootUntilMs: 1800, grainFps: 24, clearInPx: 120, clearOutPx: 180, vignette: 0.18,
    vignetteFrom: 0.35 }),
  r8: Object.freeze({ fogVis: Object.freeze([0.08, 0.14]) }),
  dprCap: Object.freeze({ T3: 2.0, T2: 1.5, T1: 1.25 }), dprStep: 0.25,
  governor: Object.freeze({ windowFrames: 90, lowFps: 52, dropAfterMs: 3000, highFps: 58, upgradeAfterMs: 10000 }),
  budget: Object.freeze({ drawCalls: 40, triangles: 120000, textureMB: 12 }),
});

/** Strut-tick rate limit for passes through lattices (SPEC §3.8, §4.1, §7.2). */
export const STRUT_TICKS_PER_S = 30;
