// secrets/hints.js — WP10's one-time motion hints (SPEC §8.3; ARCH §3.14.3, §6.11; X§2.4.4 hint.playMotion). OWNER: WP10.
// 'hint:arrive' {secret} (the hinted hall reached within 30 s, or a ПОКАЗ replay) plays, without any text:
//   S03  a ghost dot circles the Key once (1,600 ms) at 1.6× its body's screen radius — the gesture he has to make;
//   S05  desktop: a 1 px caret blinks at the status-line slot for 2,400 ms (type something); phone: the TL «SAM.VIN»
//        flickers twice (press it);
//   S09  a drone appears at once (drone.js).
import { tween } from '../core/clock.js';
import { app } from '../core/store.js';
import { W, fxRoot, keyScreen, reduced, isPhone, easeInOut } from './util.js';
import { droneNow } from './drone.js';

const K = { x: 0, y: 0, r: 0 };

function ghostCircle() {
  const root = fxRoot();
  if (!root) return;
  const el = document.createElement('i');
  el.className = 'sec-ghost';
  root.appendChild(el);
  const ms = 1600;
  tween(ms, (u) => {
    keyScreen(K);
    const R = K.r * 1.6;
    const e = easeInOut(u);
    // counter-clockwise from the right, like a finger drawing the circle; fades in and out at the ends
    const a = -e * Math.PI * 2;
    const x = K.x + Math.cos(a) * R, y = K.y + Math.sin(a) * R;
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    el.style.opacity = String(Math.min(1, u * 6, (1 - u) * 6));
  }).done.then(() => { if (el.parentNode) el.parentNode.removeChild(el); });
}

function caret() {
  const root = fxRoot();
  const st = document.getElementById('status');
  if (!root || !st) return;
  const r = st.getBoundingClientRect();
  const x = r.width > 0 ? r.left + r.width / 2 : innerWidth / 2, y = r.bottom > 0 ? r.bottom - 2 : innerHeight - 96;
  const el = document.createElement('i');
  el.className = 'sec-caret';
  el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  root.appendChild(el);
  // a text caret's blink: 530 ms on / 270 off, for 2,400 ms (reduced motion: steady)
  tween(2400, (u) => {
    const t = u * 2400;
    el.style.opacity = reduced() ? '1' : (t % 800) < 530 ? '1' : '0';
  }).done.then(() => { if (el.parentNode) el.parentNode.removeChild(el); });
}

function flickerName() {
  const ctx = W.ctx;
  const el = ctx && ctx.chrome && ctx.chrome.el && ctx.chrome.el.tlName;
  if (!el) return;
  // twice: down to 15 % and back, a short rest between (a CSS animation: exact at any frame rate)
  el.classList.remove('sec-flicker');
  requestAnimationFrame(() => {
    el.classList.add('sec-flicker');
    const off = () => { el.classList.remove('sec-flicker'); el.removeEventListener('animationend', off); };
    el.addEventListener('animationend', off);
    setTimeout(off, 800);                                    // reduced motion / no animation: never left on
  });
}

function onHint(e) {
  const id = e && e.secret;
  if (id === 'S03') { if (app.room === 'CORE') ghostCircle(); }
  else if (id === 'S05') { if (isPhone()) flickerName(); else caret(); }
  else if (id === 'S09') droneNow();
}

export function initHints(ctx) {
  ctx.bus.on('hint:arrive', onHint);
}
