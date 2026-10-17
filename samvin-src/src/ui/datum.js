// ui/datum.js — the common hall frame on the DOM side (ARCH §3.12.3, §6.1.6 A7; SPEC §6.0, §7.4):
// the datum line (desktop 62 % height, phone 120 px), the Russian DISPLAY title (lock-in 480 ms), LABEL `0i · CODE`
// above it, MICRO `▽ level` at its left end, the GIANT level numeral behind the canvas (0 → 7 % over 480 ms, 0.25×
// parallax with the camera's lateral motion), the elevator counter on #giant during LIFTs (12 %, sign, thin-space
// thousands, tabular) and the 180 ms codename flash of an intermediate hall.
// DOM contract (chrome.css, QA selectors §6.1.8): #frame > div#datum > i#datum-line, p#datum-label.t-label,
// h1#datum-title.t-display[data-room], p#datum-level.t-micro; #frame > p#datum-flash.t-label; #giant.t-giant.
import { Vector3 } from 'three';
import { ROOMS } from '../world/rooms.js';
import { fmtLevel } from '../core/ru.js';
import { lockIn } from './text.js';
import { loop, ORDER } from '../core/loop.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { rig } from '../render/cameraRig.js';
import { LAYOUT } from '../core/tokens.js';

const el = { datum: null, line: null, label: null, title: null, level: null, flash: null, giant: null };
let giantOverride = null, giantElectrum = false, room = 'CORE', counterOn = false, flashing = null, lastCounter = '';
let parallaxX = 0;
const base = new Vector3(), right = new Vector3(), _d = new Vector3();
let hasBase = false;

function mk(tag, id, cls, parent) {
  const n = document.createElement(tag);
  n.id = id;
  if (cls) n.className = cls;
  parent.appendChild(n);
  return n;
}

function roomGiant() {
  if (giantOverride != null) return giantOverride;
  return (ROOMS[room] || ROOMS.CORE).giant;
}
function writeGiant(text) { if (el.giant && el.giant.textContent !== text) el.giant.textContent = text; }

/** GIANT parallax (ORDER.UI): 0.25 × the camera's lateral screen motion since arrival. Transform writes only. */
function frame() {
  if (!el.giant || !rig.camera || counterOn) return;
  if (!hasBase) { base.copy(rig.camera.position); hasBase = true; }
  right.setFromMatrixColumn(rig.camera.matrixWorld, 0);
  const dist = Math.max(1e-3, _d.copy(rig.pose.target).sub(rig.camera.position).length());
  const px = (_d.copy(rig.camera.position).sub(base).dot(right) * rig.camera.zoom * (layout.h / (2 * Math.tan((rig.camera.fov * Math.PI) / 360)))) / dist;
  const x = Math.max(-200, Math.min(200, -0.25 * px));
  if (Math.abs(x - parallaxX) < 0.25) return;
  parallaxX = x;
  el.giant.style.transform = `translate3d(${x.toFixed(1)}px,-50%,0)`;
}

export const datum = {
  init(ctx) {
    void ctx;
    const frameEl = document.getElementById('frame');
    el.giant = document.getElementById('giant');
    if (!frameEl) return datum;
    el.datum = document.getElementById('datum') || mk('div', 'datum', '', frameEl);
    el.datum.classList.add('is-out');
    el.line = mk('i', 'datum-line', '', el.datum);
    el.label = mk('p', 'datum-label', 't-label', el.datum);
    el.title = mk('h1', 'datum-title', 't-display', el.datum);
    el.level = mk('p', 'datum-level', 't-micro', el.datum);
    el.flash = mk('p', 'datum-flash', 't-label', frameEl);
    el.flash.setAttribute('aria-hidden', 'true');
    loop.add(frame, ORDER.UI);
    return datum;
  },

  /** Datum draws (240 ms), DISPLAY title locks in (480 ms), LABEL + MICRO level, GIANT 0 → 7 % (480 ms). */
  arrive(roomId, opts = {}) {
    room = ROOMS[roomId] ? roomId : 'CORE';
    const m = ROOMS[room];
    if (!el.datum) return;
    const open = room === 'NADIR' && state.data && state.data.nadirOpen;
    // A7: the text and data-room are set BEFORE the lock-in starts.
    el.title.textContent = open && m.titleOpen ? m.titleOpen : m.title;
    el.title.dataset.room = room;
    el.label.textContent = `${m.num} · ${m.code}`;
    el.level.textContent = `▽ ${m.level}`;
    el.datum.classList.remove('is-out');
    el.datum.classList.remove('is-drawn');
    const draw = () => { el.datum.classList.add('is-drawn'); };
    if (opts.instant) draw(); else requestAnimationFrame(draw);
    if (!opts.instant) lockIn(el.title, { weight: 220, ms: 480 });
    counterOn = false;
    lastCounter = '';
    hasBase = false; parallaxX = 0;
    if (el.giant) {
      el.giant.classList.remove('is-counter');
      el.giant.style.transform = '';
      writeGiant(roomGiant());
      el.giant.classList.add('is-in');
      if (giantElectrum) el.giant.dataset.electrum = ''; else delete el.giant.dataset.electrum;
    }
  },

  /** Title + datum (and the GIANT numeral) fade out in 120 ms. */
  depart() {
    if (el.datum) el.datum.classList.add('is-out');
    if (el.giant) el.giant.classList.remove('is-in');
  },

  /** Override the GIANT text (null = the room default). Birthday: electrum outline all day. */
  setGiant(text, opts = {}) {
    giantOverride = text == null ? null : String(text);
    giantElectrum = !!opts.electrum;
    if (!el.giant || counterOn) return;
    writeGiant(roomGiant());
    if (giantElectrum) el.giant.dataset.electrum = ''; else delete el.giant.dataset.electrum;
  },

  /** Elevator counter on #giant: alpha 0.12 during a LIFT, 0 otherwise. */
  counter(alt, alpha) {
    if (!el.giant) return;
    const on = alpha > 0;
    if (on !== counterOn) {
      counterOn = on;
      el.giant.classList.toggle('is-counter', on);
      if (on) el.giant.style.transform = '';
      else { lastCounter = ''; writeGiant(roomGiant()); }
    }
    if (!on) return;
    const text = fmtLevel(Math.round(alt), 0);
    if (text !== lastCounter) { lastCounter = text; el.giant.textContent = text; }
  },

  /** 180 ms LABEL codename flash of an intermediate hall (null = none). */
  flashCode(roomId) {
    if (!el.flash || roomId === flashing) return;
    flashing = roomId;
    if (roomId && ROOMS[roomId]) {
      const m = ROOMS[roomId];
      el.flash.textContent = `${m.num} · ${m.code}`;
      el.flash.classList.add('is-on');
    } else el.flash.classList.remove('is-on');
  },

  /** Datum y in CSS px for the current layout. */
  yPx() { return layout.kind === 'desktop' ? layout.h * LAYOUT.desktop.datumFrac : LAYOUT.phone.datumPx + layout.safe.t; },

  setVisible(b) {
    if (el.datum) el.datum.hidden = !b;
    if (el.giant) el.giant.hidden = !b;
  },
};
