// ui/text.js — text effects (ARCH §3.12.5, SPEC §2.2). DOM text is only ever written through textContent.
//   lockIn      SHRP 0 → var(--shrp), wght 120 → weight over 480 ms (EASE.reveal), per-letter jitter
//               sin(17t + i)·(1 − lock)·4 px; at most 2 concurrent (a third completes instantly); reduced motion: 160 ms fade.
//   revealBody  left-to-right mask + opacity 0 → 1, 12 ms per char capped at 240 ms; never jitters.
//   beamWrite   a 3×3 px --ember head on the baseline; each letter revealed by a clip sweep, colour --white → --ember →
//               --silver over 900 ms (CSS .beam-letter.is-lit); reduced motion: a 160 ms fade.
import { tween, after } from '../core/clock.js';
import { EASE } from '../core/ease.js';
import { ENV } from '../core/env.js';
import { loop } from '../core/loop.js';
import { state } from '../core/state.js';
import { TIMING } from '../core/tokens.js';

let active = 0;

/** Replaces el's content with one span per letter (textContent only). → HTMLSpanElement[] */
export function splitLetters(el, text) {
  const t = text == null ? el.textContent : String(text);
  el.textContent = '';
  const out = [];
  for (const ch of t) {
    const s = document.createElement('span');
    s.className = 'lock-letter';
    s.textContent = ch;
    el.appendChild(s);
    out.push(s);
  }
  return out;
}

function fade(el, ms) {
  el.style.opacity = '0';
  return tween(ms, (u) => { el.style.opacity = String(u); }, EASE.reveal).done.then(() => { el.style.opacity = ''; });
}

/** → Promise (resolves when locked). weight 220 (titles) or 560 (headings). */
export function lockIn(el, opts = {}) {
  if (!el) return Promise.resolve();
  const weight = opts.weight || 220, ms = opts.ms || TIMING.lockIn;
  if (ENV.reducedMotion) return fade(el, TIMING.lockInReduced);
  if (active >= 2) return Promise.resolve();
  active += 1;
  const text = el.textContent;
  const letters = splitLetters(el, text);
  const shrp = state.shrp || 28;
  const set = (u) => {
    const L = EASE.reveal(u);
    const fvs = `"SHRP" ${(shrp * L).toFixed(1)}, "wght" ${Math.round(120 + (weight - 120) * L)}, "CRSV" 0, "slnt" 0`;
    const tt = loop.now / 1000;
    for (let i = 0; i < letters.length; i++) {
      const s = letters[i].style;
      s.fontVariationSettings = fvs;
      s.transform = L < 1 ? `translateY(${(Math.sin(17 * tt + i) * (1 - L) * 4).toFixed(2)}px)` : '';
    }
  };
  set(0);
  return tween(ms, set).done.then(() => { active -= 1; if (el.textContent === text) el.textContent = text; });
}

/** → Promise. Left-to-right mask reveal, opacity 0 → 1. */
export function revealBody(el, opts = {}) {
  if (!el) return Promise.resolve();
  const per = opts.msPerChar || TIMING.revealMsPerChar, max = opts.maxMs || TIMING.revealMax;
  if (ENV.reducedMotion) return fade(el, TIMING.lockInReduced);
  const ms = Math.min(max, Math.max(1, el.textContent.length * per));
  el.classList.add('reveal-mask');
  const set = (u) => { el.style.setProperty('--reveal', `${(u * 108).toFixed(1)}%`); el.style.opacity = String(Math.min(1, u * 2)); };
  set(0);
  return tween(ms, set).done.then(() => { el.classList.remove('reveal-mask'); el.style.removeProperty('--reveal'); el.style.opacity = ''; });
}

/** → Promise (resolves when the last letter is lit). */
export function beamWrite(el, text, opts = {}) {
  if (!el) return Promise.resolve();
  const cps = opts.cps || TIMING.beamCps;
  if (ENV.reducedMotion) { el.textContent = String(text); return fade(el, TIMING.lockInReduced); }
  el.textContent = '';
  const letters = [];
  for (const ch of String(text)) {
    const s = document.createElement('span');
    s.className = 'beam-letter';
    s.textContent = ch;
    el.appendChild(s);
    letters.push(s);
  }
  const fx = document.getElementById('fx');
  const head = document.createElement('i');
  head.className = 'beam-head';
  if (fx) fx.appendChild(head);
  // One layout read up front (not a projection loop): the letters' boxes for the head's path.
  const rects = letters.map((s) => s.getBoundingClientRect());
  const step = 1000 / cps;
  return new Promise((resolve) => {
    let i = 0;
    const next = () => {
      if (i >= letters.length) {
        after(160, () => { if (head.parentNode) head.parentNode.removeChild(head); });
        resolve();
        return;
      }
      const r = rects[i];
      head.style.transform = `translate3d(${(r.right - 1.5).toFixed(1)}px, ${(r.bottom - r.height * 0.2).toFixed(1)}px, 0)`;
      letters[i].classList.add('is-lit');
      i += 1;
      after(step, next);
    };
    next();
  });
}
