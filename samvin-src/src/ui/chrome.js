// ui/chrome.js — the fixed corner chrome (ARCH §3.12.4, §6.1.8; SPEC §2.3, §9.8). Adopts the first-frame #c-* labels:
//   TL  span#c-tl-name.t-label «SAM.VIN» + span#c-tl-micro.t-micro `{CODE} · ▽ {level}`
//   TR  button#sound (≥ 44 × 44, aria-pressed) > span#sound-label.t-label «ЗВУК»/«ТИХО» + svg.sound-wave: 8 bars 32×12
//       driven at 30 fps by audio.levels(); off → a flat 1 px line and «ТИХО». Click / M toggles (audio.toggle()).
//   BL  `ДЕНЬ {distinctDays} · УЗЛОВ {litNodes} · {HH:MM}` (minute timer; phone: hidden by CSS) — T0: «РЕЖИМ ЧЕРТЕЖА»
//   BR  span.found-count `НАЙДЕНО {nn} / ??` + span.rank (phone: under ЗВУК). The total is never shown.
// The corners stay at the first-frame 30 % (.corner--dim) until assemble(); typeIn() types them at that alpha.
import { loop, ORDER } from '../core/loop.js';
import { after, cancelAfter, tween } from '../core/clock.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { now } from '../core/time.js';
import { ROOMS } from '../world/rooms.js';
import { LAYOUT, TIMING } from '../core/tokens.js';

const SVG = 'http://www.w3.org/2000/svg';
const levels = new Float32Array(8);
const barH = new Float32Array(8);
let ctxRef = null, bars = [], minuteTimer = 0, lastWave = -1e9, t0Marker = false, soundOn = true, relockTimer = 0;
let foundEl = null, rankEl = null, labelEl = null;

function mk(tag, cls, text, parent, id) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (id) n.id = id;
  if (text != null) n.textContent = text;
  if (parent) parent.appendChild(n);
  return n;
}
const two = (n) => String(n).padStart(2, '0');

function adopt(id) {
  const n = document.getElementById(id);
  if (!n) return null;
  n.classList.remove('ff-c');
  n.classList.add('corner', 'corner--dim');
  n.textContent = '';
  return n;
}

function setSoundUi(on) {
  soundOn = on;
  if (chrome.el.sound) chrome.el.sound.setAttribute('aria-pressed', on ? 'true' : 'false');
  if (labelEl) labelEl.textContent = on ? 'ЗВУК' : 'ТИХО';
}

function scheduleMinute() {
  if (minuteTimer) cancelAfter(minuteTimer);
  const d = new Date(now());
  minuteTimer = after((60 - d.getSeconds()) * 1000 - d.getMilliseconds() + 20, () => { minuteTimer = 0; chrome.refresh(); });
}

/** ЗВУК waveform at 30 fps (ORDER.UI). Writes only changed bar heights. */
function wave() {
  if (!bars.length || loop.now - lastWave < 1000 / LAYOUT.sound.fps) return;
  lastWave = loop.now;
  const a = ctxRef && ctxRef.audio;
  if (a && soundOn) a.levels(levels); else levels.fill(0);
  const H = LAYOUT.sound.h;
  for (let i = 0; i < 8; i++) {
    const h = Math.max(1, Math.round(levels[i] * H * 2) / 2);
    if (h === barH[i]) continue;
    barH[i] = h;
    bars[i].setAttribute('y', String(H - h));
    bars[i].setAttribute('height', String(h));
  }
}

export const chrome = {
  el: { tl: null, tlName: null, tlMicro: null, tr: null, sound: null, bl: null, br: null },

  init(ctx) {
    ctxRef = ctx;
    const E = chrome.el;
    E.tl = adopt('c-tl');
    if (E.tl) {
      E.tlName = mk('span', 't-label', 'SAM.VIN', E.tl, 'c-tl-name');
      E.tlMicro = mk('span', 't-micro', '', E.tl, 'c-tl-micro');
    }
    E.tr = adopt('c-tr');
    if (E.tr) {
      const b = mk('button', '', null, E.tr, 'sound');
      b.type = 'button';
      b.setAttribute('aria-label', 'Звук');
      labelEl = mk('span', 't-label', 'ЗВУК', b, 'sound-label');
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('class', 'sound-wave');
      svg.setAttribute('viewBox', `0 0 ${LAYOUT.sound.w} ${LAYOUT.sound.h}`);
      svg.setAttribute('aria-hidden', 'true');
      bars = [];
      for (let i = 0; i < 8; i++) {
        const r = document.createElementNS(SVG, 'rect');
        r.setAttribute('class', 'bar');
        r.setAttribute('x', String(i * 4 + 0.5));
        r.setAttribute('width', '2');
        r.setAttribute('y', String(LAYOUT.sound.h - 1));
        r.setAttribute('height', '1');
        barH[i] = 1;
        svg.appendChild(r);
        bars.push(r);
      }
      const flat = document.createElementNS(SVG, 'line');
      flat.setAttribute('class', 'flat');
      flat.setAttribute('x1', '0'); flat.setAttribute('x2', String(LAYOUT.sound.w));
      flat.setAttribute('y1', String(LAYOUT.sound.h - 0.5)); flat.setAttribute('y2', String(LAYOUT.sound.h - 0.5));
      svg.appendChild(flat);
      b.appendChild(svg);
      b.addEventListener('click', () => { if (ctx.audio) ctx.audio.toggle(); });
      E.sound = b;
    }
    E.bl = adopt('c-bl');
    if (E.bl) E.bl.classList.add('t-micro');
    E.br = adopt('c-br');
    if (E.br) {
      E.br.classList.add('t-micro');
      foundEl = mk('span', 'found-count', '', E.br);
      rankEl = mk('span', 'rank', '', E.br);
    }
    setSoundUi(!(state.data && state.data.sound === 'off'));
    bus.on('sound:change', (e) => setSoundUi(!!e.on));
    bus.on('rank:change', () => chrome.refresh());
    bus.on('visibility', (e) => { if (!e.hidden) chrome.refresh(); });
    chrome.setRoom('CORE');
    chrome.refresh();
    loop.add(wave, ORDER.UI);
    return chrome;
  },

  /** TL MICRO `${code} · ▽ ${level}`. */
  setRoom(roomId) {
    const m = ROOMS[roomId] || ROOMS.CORE;
    if (chrome.el.tlMicro) chrome.el.tlMicro.textContent = `${m.code} · ▽ ${m.level}`;
  },

  /** BL day/nodes/clock (re-armed every minute) and BR found count + rank. */
  refresh() {
    const E = chrome.el;
    if (E.bl) {
      if (t0Marker) E.bl.textContent = 'РЕЖИМ ЧЕРТЕЖА';
      else {
        const d = new Date(now());
        E.bl.textContent = `ДЕНЬ ${state.distinctDays | 0} · УЗЛОВ ${state.litNodes | 0} · ${two(d.getHours())}:${two(d.getMinutes())}`;
      }
      scheduleMinute();
    }
    if (foundEl) {
      const n = ctxRef && ctxRef.secrets ? ctxRef.secrets.count() : Object.keys((state.data && state.data.found) || {}).length;
      foundEl.textContent = `НАЙДЕНО ${two(Math.min(99, n))} / ??`;
      rankEl.textContent = state.data ? state.rank().name : '';
    }
  },

  /** Boot: the four corners type in at 30 % alpha (msPerChar each). → Promise */
  typeIn(msPerChar = TIMING.typeMsPerChar) {
    const E = chrome.el;
    const nodes = [E.tlName, E.tlMicro, labelEl, E.bl && !t0Marker ? E.bl : null, foundEl, rankEl].filter(Boolean);
    const full = nodes.map((n) => n.textContent);
    const len = Math.max(1, ...full.map((s) => s.length));
    for (const n of nodes) n.textContent = '';
    return tween(len * msPerChar, (u) => {
      const k = Math.round(u * len);
      for (let i = 0; i < nodes.length; i++) { const s = full[i].slice(0, k); if (nodes[i].textContent !== s) nodes[i].textContent = s; }
    }).done.then(() => { for (let i = 0; i < nodes.length; i++) nodes[i].textContent = full[i]; });
  },

  /** Chrome to full alpha. → Promise */
  assemble(ms = TIMING.assemble) {
    const E = chrome.el;
    for (const n of [E.tl, E.tr, E.bl, E.br]) if (n) { n.style.transitionDuration = `${ms}ms`; n.classList.remove('corner--dim'); }
    return new Promise((res) => after(ms, res));
  },

  /** BR count lock-in after a shard lands (white, cooling back to pewter over 960 ms). */
  relockFound() {
    chrome.refresh();
    const br = chrome.el.br;
    if (!br) return;
    br.classList.add('is-relock');
    if (relockTimer) cancelAfter(relockTimer);
    relockTimer = after(TIMING.statusIn, () => { relockTimer = 0; br.classList.remove('is-relock'); });
  },

  /** BL reads «РЕЖИМ ЧЕРТЕЖА» in T0. */
  setT0Marker(b) { t0Marker = !!b; chrome.refresh(); },
};
