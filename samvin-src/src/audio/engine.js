// audio/engine.js — MINIMAL placeholder written by WP0 stage 0A so core/input.js and main.js compile and run.
// Stage 0D replaces it with the full engine of ARCH §3.10.1 (graph, IRs, voice cap, bed, analyser, visibility fades on
// the 'visibility' bus event). The exported object already has every §3.10.1 member with a silent, safe body.
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { state, saveSoon } from '../core/state.js';

const NOOP_VOICE = Object.freeze({ set() {}, stop() {}, alive: false });

export const audio = {
  ctx: null,
  unlocked: false,
  on: true,
  bed: null,
  init(appCtx) {
    void appCtx;
    audio.on = !(state.data && state.data.sound === 'off');
    app.soundOn = audio.on;
  },
  unlock() {
    if (audio.unlocked) return;
    audio.unlocked = true;
    bus.emit('audio:unlocked', {});
  },
  resume() {},
  isOn() { return audio.on; },
  setOn(on) {
    const v = !!on;
    if (v === audio.on) return;
    audio.on = v;
    app.soundOn = v;
    if (state.data) { state.data.sound = v ? 'on' : 'off'; saveSoon(); }
    bus.emit('sound:change', { on: v });
  },
  toggle() { audio.setOn(!audio.on); },
  play(name, params) { void name; void params; return null; },
  start(name, params) { void name; void params; return NOOP_VOICE; },
  setRoom() {}, setRootU() {}, setNight() {}, setRank() {}, setInverted() {},
  levels(out8) { if (out8) out8.fill(0); },
  now() { return 0; },
};
