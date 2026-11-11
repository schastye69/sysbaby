// secrets/dizzy.js — S03 ГОЛОВОКРУЖЕНИЕ (SPEC §8.1 S03, §8.3; ARCH §6.11). OWNER: WP10.
// The pointer or finger circles the Key's projected centre: the cumulative SIGNED angle swept at a radius between 0.6×
// and 3× the Key's screen radius reaches 3 × 360° within 4,000 ms. While he circles (≥ 60° swept in the last 700 ms)
// the Key's yaw spins up with him at gain 0.5. When he stops (no angular progress for 220 ms, or he leaves the band):
// the Key wobbles 9° at 1.6 Hz with a 900 ms decay, strata out of phase, for 3,000 ms (key.wobble — WP1); a LABEL
// readout `ГОЛОВОКРУЖЕНИЕ {p}%` with p = min(99, round(°/s ÷ 12)) from his real speed hangs off the Key on a leader;
// status «всё кружится.», then «уже лучше.» 3,000 ms later; sound `dizzy`; secrets.discover('S03', {vars:{p}}). The
// payoff replays every time. T0: the same rule around ctx.t0.keyScreen() (no yaw, no wobble; the readout is DOM).
// Allocation-free per sample: a fixed ring of (t, dθ) samples.
import { app } from '../core/store.js';
import { loop, ORDER } from '../core/loop.js';
import { after } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { revealBody } from '../ui/text.js';
import { W, has, say, safe, keyScreen, fxRoot, isT0 } from './util.js';

const TURNS = 3, WINDOW_MS = 4000, R_MIN = 0.6, R_MAX = 3, GAIN = 0.5;
const STOP_MS = 220, SPIN_WIN_MS = 700, SPIN_MIN = Math.PI / 3, COOLDOWN_MS = 3000;
const DEG = Math.PI / 180;
const N = 1024;
const T = new Float64Array(N), D = new Float32Array(N);
let head = 0, len = 0, sum = 0;
let lastAng = NaN, lastProgress = -1e9, armed = false, bestP = 0, quietUntil = -1e9;
const K = { x: 0, y: 0, r: 0 };

let ctx = null, readout = null, anchor = null, hideTimer = 0;

function reset() { head = 0; len = 0; sum = 0; lastAng = NaN; }
function eligible() {
  return app.room === 'CORE' && app.phase === 'idle' && !app.booting && performance.now() >= quietUntil;
}
/** Σ dθ over the last ms (newest first). */
function recentSum(now, ms) {
  let s = 0;
  for (let k = 0; k < len; k++) {
    const i = (head - 1 - k + N) % N;
    if (now - T[i] > ms) break;
    s += D[i];
  }
  return s;
}

function onSample(s) {
  if (!eligible()) { if (!armed) reset(); return; }
  keyScreen(K);
  if (!(K.r > 4)) return;
  const dx = s.x - K.x, dy = s.y - K.y, r = Math.hypot(dx, dy);
  if (r < R_MIN * K.r || r > R_MAX * K.r) { if (armed) payoff(); reset(); return; }
  const ang = Math.atan2(dy, dx), t = performance.now();   // the sample's real time (frames may stall)
  if (Number.isNaN(lastAng)) { lastAng = ang; return; }
  let d = ang - lastAng;
  if (d > Math.PI) d -= 2 * Math.PI; else if (d < -Math.PI) d += 2 * Math.PI;
  lastAng = ang;
  if (Math.abs(d) > 1.6) { reset(); return; }         // a jump (a new touch elsewhere), not a circle
  if (len === N) { sum -= D[head]; len--; }           // full ring: the oldest sample is overwritten
  T[head] = t; D[head] = d; head = (head + 1) % N; sum += d; len++;
  while (len > 0) {                                   // drop samples older than the 4,000 ms window
    const o = (head - len + N) % N;
    if (t - T[o] <= WINDOW_MS) break;
    sum -= D[o]; len--;
  }
  if (Math.abs(d) > 0.004) lastProgress = t;
  // While circling: the Key spins up with him (gain 0.5), only once a real circling motion is under way.
  if (!isT0() && ctx.key && has(ctx.key, 'addYaw') && Math.abs(recentSum(t, SPIN_WIN_MS)) >= SPIN_MIN) ctx.key.addYaw(d * GAIN);
  if (Math.abs(sum) >= TURNS * 2 * Math.PI) {
    const o = (head - len + N) % N;
    const secs = Math.max(0.05, (t - T[o]) / 1000);
    const p = Math.min(99, Math.round((Math.abs(sum) / DEG) / secs / 12));
    if (p > bestP) bestP = p;
    armed = true;
  }
}

/** ORDER.UI: he stopped circling → the payoff. */
function frame() {
  if (armed && performance.now() - lastProgress > STOP_MS) payoff();
}

function readoutGet(out) {
  const key = ctx.key;
  if (key && key.nucleusWorld) out.copy(key.nucleusWorld);
  else out.set(0, 0, 0);
  out.x += 0.62; out.y += 0.78;
  return out;
}

function showReadout(p) {
  const text = `ГОЛОВОКРУЖЕНИЕ ${p}%`;
  if (!readout) {
    readout = document.createElement('p');
    readout.className = 't-label sec-dizzy';
    readout.dataset.qa = 'dizzy';
  }
  readout.textContent = text;
  readout.classList.remove('is-out');
  if (hideTimer) { hideTimer = 0; }
  if (!isT0() && ctx.overlay && has(ctx.overlay, 'add') && ctx.rig) {
    if (!anchor) {
      anchor = ctx.overlay.add({ owner: 'secrets', id: 'dizzy', el: readout, get: readoutGet, scrim: false, priority: 9,
        leader: { side: 'right', len: 48, rise: -28 } });
    } else anchor.setVisible(true);
  } else {
    const root = fxRoot();
    if (root && readout.parentNode !== root) root.appendChild(readout);
    keyScreen(K);
    readout.classList.add('sec-dizzy--t0');
    readout.style.transform = `translate3d(${(K.x + K.r * 1.3).toFixed(1)}px,${(K.y - K.r * 1.2).toFixed(1)}px,0)`;
  }
  revealBody(readout);
  const my = ++showGen;
  after(3000, () => {
    if (my !== showGen) return;
    readout.classList.add('is-out');
    after(260, () => { if (my === showGen && anchor) anchor.setVisible(false); });
  });
}
let showGen = 0;

function payoff() {
  const p = Math.max(1, bestP);
  armed = false; bestP = 0;
  reset();
  quietUntil = performance.now() + COOLDOWN_MS;
  const key = ctx.key;
  if (!isT0() && key && has(key, 'wobble')) safe('dizzy:wobble', () => key.wobble(9 * DEG, 1.6, 900, 3000));
  showReadout(p);
  audio.play('dizzy', {});
  say('dizzy');
  after(3000, () => say('dizzy.after'));
  keyScreen(K);
  if (ctx.secrets) safe('dizzy:discover', () => ctx.secrets.discover('S03', { vars: { p }, anchor: { x: K.x, y: K.y } }));
}

export function initDizzy(c) {
  ctx = c;
  if (!c.input || !has(c.input, 'observe')) return;
  c.input.observe(onSample);
  loop.add(frame, ORDER.UI);
  // a travel or a phase change ends any half-drawn circle
  c.bus.on('travel:start', () => { armed = false; bestP = 0; reset(); });
}
