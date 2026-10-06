// audio/engine.js — the audio engine (ARCH §3.10.1; SPEC §9.1, §9.8). Web Audio only, no files.
// Graph: voices → bus (ui | fx | room) → [dry → compressor] + [send (wet) → ConvolverNode → compressor];
//        bed → its own bus → compressor; compressor (−18 dB, 3:1, 3 ms / 250 ms) → master (−6 dBFS) → analyser → out.
// The AudioContext exists only after the first gesture (unlock(), called by core/input.js). Convolver IRs are generated
// at unlock (3.4 s stereo-decorrelated noise, exp decay, high-passed at 120 Hz; a 6 s IR for the whale). Voice cap 24,
// the oldest stolen with an 8 ms fade. play()/start() return null / a no-op live voice while locked or off — callers
// never branch on sound (their visual twin always runs). setOn: master fade 400 ms, then suspend (off); persisted as
// state 'sound'. A hidden page fades out over 400 ms and suspends; visible resumes and fades in if on.
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { loop, ORDER } from '../core/loop.js';
import { logOnce } from '../core/env.js';
import { ROOMS } from '../world/rooms.js';
import { RECIPES, LIVE } from './registry.js';
import { createBed } from './bed.js';
import { hz } from './notes.js';

const MASTER = Math.pow(10, -6 / 20);
const NOOP_LIVE = Object.freeze({ set() {}, stop() {}, alive: false });
const voices = [];
const bins = new Uint8Array(32);
let irLong = null;
let ac = null, master = null, analyser = null, comp = null, conv = null, sends = null, hidden = false, suspendTimer = 0;

/** E — what recipes receive (ARCH §3.10.2). */
const E = {
  ctx: null, bus: { ui: null, fx: null, room: null, bed: null }, transpose: 0, night: false, hz,
  /** 6 s IR for the whale — generated on first use (it is the only caller), so unlock stays short. */
  get irLong() { if (!irLong && ac) irLong = makeIR(6); return irLong; },
  /** A send into the convolver at the given level (0..1). */
  send(wet) { const g = ac.createGain(); g.gain.value = wet; g.connect(conv); return g; },
  /** Voice-cap accounting (24, oldest stolen with an 8 ms fade) + auto cleanup after durSec. */
  track(voice, durSec) {
    if (!voice) return voice;
    const t = ac ? ac.currentTime : 0;
    for (let i = voices.length - 1; i >= 0; i--) if (!voices[i].v.alive || voices[i].end < t) voices.splice(i, 1);
    voices.push({ v: voice, end: t + (durSec || 1) });
    while (voices.length > 24) { const o = voices.shift(); try { o.v.stop(8); } catch (e) { /* gone */ } }
    return voice;
  },
};

/** Stereo-decorrelated exponentially decaying noise, high-passed at 120 Hz (one-pole). */
function makeIR(seconds) {
  const sr = ac.sampleRate, n = Math.floor(sr * seconds), buf = ac.createBuffer(2, n, sr);
  const a = Math.exp(-2 * Math.PI * 120 / sr), k = Math.exp(-6.9 / (seconds * sr));   // −60 dB at `seconds`
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let px = 0, py = 0, g = 1;
    for (let i = 0; i < n; i++) {
      const x = (Math.random() * 2 - 1) * g;
      g *= k;
      py = a * (py + x - px);        // one-pole high-pass at 120 Hz
      px = x;
      d[i] = py;
    }
  }
  return buf;
}

function ramp(param, v, ms) {
  const t = ac.currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(v, t + ms / 1000);
}

function fadeOutSuspend() {
  if (!ac) return;
  ramp(master.gain, 0, 400);
  clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => { suspendTimer = 0; if (ac && (hidden || !audio.on)) ac.suspend().catch(() => {}); }, 420);
}
function resumeFadeIn() {
  if (!ac || !audio.on || hidden) return;
  clearTimeout(suspendTimer); suspendTimer = 0;
  ac.resume().catch(() => {});
  ramp(master.gain, MASTER, 400);
}

function build() {
  comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
  master = ac.createGain();
  master.gain.value = 0;
  analyser = ac.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.6;
  comp.connect(master).connect(analyser).connect(ac.destination);
  conv = ac.createConvolver();
  conv.buffer = makeIR(3.4);
  conv.connect(comp);
  sends = {};
  for (const name of ['ui', 'fx', 'room']) {
    const b = ac.createGain();
    b.connect(comp);
    const s = ac.createGain();
    s.gain.value = name === 'ui' ? 0.11 : 0.22;
    b.connect(s).connect(conv);
    E.bus[name] = b;
    sends[name] = s;
  }
  E.bus.bed = ac.createGain();
  E.bus.bed.connect(comp);
  E.ctx = ac;
}

export const audio = {
  ctx: null,
  unlocked: false,
  on: true,
  bed: null,

  init(appCtx) {
    void appCtx;
    audio.on = !(state.data && state.data.sound === 'off');
    app.soundOn = audio.on;
    bus.on('visibility', (e) => { hidden = !!e.hidden; if (hidden) fadeOutSuspend(); else resumeFadeIn(); });
    bus.on('room:arrive', (e) => audio.setRoom(e.room));
    return audio;
  },

  /** First pointerdown / keydown anywhere. Idempotent; never plays anything before a gesture. */
  unlock() {
    if (audio.unlocked) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ac = new AC();
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* unsupported */ }
      build();
      audio.ctx = ac;
      audio.unlocked = true;
      try { audio.bed = createBed(E); } catch (e) { logOnce('audio:bed', e); }
      audio.setRoom(app.room || 'CORE');
      audio.setNight(app.night);
      if (audio.on) { if (audio.bed) audio.bed.start(); resumeFadeIn(); } else ac.suspend().catch(() => {});
      loop.add((dt) => { if (audio.bed && audio.on) audio.bed.update(dt); }, ORDER.FX);
      bus.emit('audio:unlocked', {});
    } catch (e) {
      logOnce('audio:unlock', 'audio unavailable', e);
    }
  },

  /** ctx.resume() if on (iOS: also on pointerup / touchend). */
  resume() { if (ac && audio.on && !hidden && ac.state !== 'running') ac.resume().catch(() => {}); },

  isOn() { return audio.on; },

  setOn(on) {
    const v = !!on;
    if (v === audio.on) return;
    audio.on = v;
    app.soundOn = v;
    state.set('sound', v ? 'on' : 'off');
    if (ac) {
      if (v) { if (audio.bed) audio.bed.start(); resumeFadeIn(); }
      else { fadeOutSuspend(); if (audio.bed) setTimeout(() => { if (!audio.on && audio.bed) audio.bed.stop(); }, 400); }
    }
    bus.emit('sound:change', { on: v });
  },

  toggle() { audio.setOn(!audio.on); },

  /** One-shot recipe. → Voice | null (locked / off / unknown). */
  play(name, params = {}) {
    if (!ac || !audio.on || hidden) return null;
    const r = RECIPES[name];
    if (!r) return null;
    try { return r(E, params || {}) || null; } catch (e) { logOnce(`audio:${name}`, 'recipe failed', name, e); return null; }
  },

  /** Continuous recipe (LIVE names). → LiveVoice (a no-op one while locked / off). */
  start(name, params = {}) {
    if (!ac || !audio.on || hidden || !LIVE.has(name)) return NOOP_LIVE;
    try { return RECIPES[name](E, params || {}) || NOOP_LIVE; } catch (e) { logOnce(`audio:${name}`, 'recipe failed', name, e); return NOOP_LIVE; }
  },

  /** On arrival: bed room, convolver wet ROOMS[id].wet, INSIGNIA duck −60 dB over 960 ms. */
  setRoom(roomId) {
    const m = ROOMS[roomId];
    if (!m || !ac) return;
    if (sends) { ramp(sends.room.gain, m.wet, 300); ramp(sends.fx.gain, m.wet, 300); }
    if (audio.bed) { audio.bed.setRoom(roomId); audio.bed.duck(roomId === 'INSIGNIA' ? -60 : 0, 960); }
  },
  /** Director, every travel frame: the bed root glides exponentially across u. */
  setRootU(fromRoomId, toRoomId, u) {
    if (!audio.bed) return;
    const a = ROOMS[fromRoomId], b = ROOMS[toRoomId];
    if (a && b) audio.bed.setRootGlide(a.root, b.root, u);
  },
  setNight(b) { E.night = !!b; if (audio.bed) audio.bed.setNight(!!b); },
  setRank(index) { if (audio.bed) audio.bed.setRank(index | 0); },
  /** UI-bus recipes transpose −5 semitones while inverted. */
  setInverted(b) { E.transpose = b ? -5 : 0; },

  /** 8 bar levels 0..1 from the analyser (fftSize 64); zeros when off / locked. */
  levels(out8) {
    if (!out8) return;
    if (!analyser || !audio.on || hidden) { out8.fill(0); return; }
    analyser.getByteFrequencyData(bins);
    for (let i = 0; i < 8; i++) {
      const s = bins[i * 2] + bins[i * 2 + 1];
      out8[i] = Math.min(1, (s / 510) * 1.6);
    }
  },

  now() { return ac ? ac.currentTime : 0; },
};
