// halls/signal/replies.js — WP8: «ОТВЕТ РИСУНКОМ» (SPEC-ADDENDUM A6.4; ARCH-ADDENDUM §5.3 WP8, X§2.9.3 `replies`).
//
// Under every ПАПА transmission the verb `ОТВЕТИТЬ РИСУНКОМ` focuses the sky pad; his next stroke (the SPEC pipeline,
// unchanged) is ALSO stored as replies[i] (≤ 64 points in [−1, 1]) and drawn beside that transmission as a 48 px
// hairline figure with MICRO `ТВОЙ ОТВЕТ`; tapping the figure replays it with the sky-pad sound (the beam dot runs on
// the small figure). Status 'reply.saved' «ответ сохранён. покажи папе.». Nothing else changes: the transmission's
// LEAD and sounds are exactly SPEC §6.5's.
import { state } from '../../core/state.js';
import { playStroke } from './stroke.js';

const NS = 'http://www.w3.org/2000/svg';
export const PAPA = 'ПАПА';
export const FIG_PX = 48;

/** The stored reply to transmission i, or null. */
export function getReply(i) {
  const r = state.data && state.data.replies ? state.data.replies[String(i)] : null;
  return Array.isArray(r) && r.length >= 2 ? r : null;
}

/** Stores norm (≤ 64 points, [−1, 1]) as the reply to transmission i (replaces an earlier one). */
export function saveReply(i, norm) {
  const pts = (Array.isArray(norm) ? norm : []).slice(0, 64)
    .filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
    .map((p) => [Math.max(-1, Math.min(1, p[0])), Math.max(-1, Math.min(1, p[1]))]);
  if (pts.length < 2) return false;
  state.patch((d) => {
    if (!d.replies || typeof d.replies !== 'object') d.replies = {};
    d.replies[String(i)] = pts;
  });
  return true;
}

/** SVG path data of a normalised drawing inside a box of `px` (2 px inset), closed when its ends meet. */
export function figurePath(norm, px) {
  const h = px / 2 - 2;
  let d = '';
  for (let k = 0; k < norm.length; k++) d += (k ? 'L' : 'M') + (px / 2 + norm[k][0] * h).toFixed(1) + ' ' + (px / 2 + norm[k][1] * h).toFixed(1);
  return d;
}

/** → { el, set(norm|null), dispose() } — the 48 px hairline answer with MICRO `ТВОЙ ОТВЕТ` (a button: tap replays). */
export function createReplyFigure(hctx, index) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'sg-reply';
  el.dataset.qa = 'reply-figure';
  el.dataset.index = String(index);
  el.setAttribute('aria-label', 'твой ответ');
  const art = document.createElementNS(NS, 'svg');
  art.setAttribute('viewBox', `0 0 ${FIG_PX} ${FIG_PX}`);
  art.setAttribute('class', 'sg-reply__art');
  art.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('class', 'sg-reply__path');
  const dot = document.createElementNS(NS, 'rect');
  dot.setAttribute('class', 'sg-reply__dot');
  dot.setAttribute('width', '3'); dot.setAttribute('height', '3');
  art.append(path, dot);
  const micro = document.createElement('span');
  micro.className = 't-micro sg-reply__micro';
  micro.textContent = 'ТВОЙ ОТВЕТ';
  el.append(art, micro);
  let norm = null, play = null;
  const h = FIG_PX / 2 - 2;
  const onFrame = (x, y) => { dot.setAttribute('x', (FIG_PX / 2 + x * h - 1.5).toFixed(1)); dot.setAttribute('y', (FIG_PX / 2 + y * h - 1.5).toFixed(1)); };
  el.addEventListener('click', () => {
    if (!norm) return;
    if (play) play.stop();
    el.classList.add('is-playing');
    play = playStroke(norm, 1200, { onFrame });
    play.done.then(() => { el.classList.remove('is-playing'); play = null; });
  });
  return {
    el,
    set(n) {
      norm = n;
      el.hidden = !n;
      path.setAttribute('d', n ? figurePath(n, FIG_PX) : '');
    },
    dispose() { if (play) play.stop(); play = null; if (el.parentNode) el.parentNode.removeChild(el); },
  };
}
