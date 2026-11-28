// fx/scalebar.js — «СКВОЗЬ» scale bar and the reduced-motion `×1 000` label (SPEC-ADDENDUM A2.2; X§2.5.7). OWNER: WP12.
// A construction-drawing bar in #fx, bottom-left (desktop 48 / 40 px, phone 16 px and 12 px above the Key band): a 1 px
// --silver line with 4 px ticks at 0, ½ and 1, 80 px at rest; label .t-label --white centred above it. It states what
// one metre of the Key measures now: 10^floor(log10 s) М (RECALL: 10^floor(log10(1000·s))). Inside a decade the bar
// grows 80 → 160 px log-linearly; every re-snap flashes the bar --white for one frame (the tick sound is planned by
// the path decorator). Driven only by WP12's own decorator.
import { thin } from '../core/ru.js';
import { after, cancelAfter } from '../core/clock.js';

const LABELS = [1, 10, 100, 1000].map((v) => `${thin(v)} М`);   // built once: the per-frame set() allocates nothing

export function createScalebar(F) {
  const root = document.getElementById('fx');
  const el = document.createElement('div');
  el.className = 'fx-sb';
  el.dataset.qa = 'scalebar';
  const lab = document.createElement('span');
  lab.className = 't-label';
  lab.dataset.qa = 'scalebar-label';
  const bar = document.createElement('i');
  el.append(lab, bar);
  const rm = document.createElement('span');
  rm.className = 't-label fx-rm';
  rm.dataset.qa = 'scalebar-rm';
  rm.textContent = '×1' + ' ' + '000';
  if (root) root.append(el, rm);
  let on = false, label = null, cur = -1, end = 3, pendMs = 0, stepped = false, w = -1, flash = 0, hideT = 0, rmT = 0;
  const sb = {
    get label() { return on ? label : null; },
    show() {
      if (pendMs && on) return;                     // the last trip's count is still completing: it finishes first
      if (hideT) { cancelAfter(hideT); hideT = 0; }
      if (!on) { label = null; cur = -1; }   // a new trip: a new count
      el.style.transitionDuration = '120ms';
      el.classList.add('is-on'); on = true;
    },
    hide(ms = 120) {
      if (!on) return;
      // The count always completes: a bar hidden before its last decade steps on to it first (one step per frame; the
      // step is written before this frame renders, so every step is presented).
      if ((cur >= 0 && cur !== end) || stepped) { pendMs = ms; return; }   // (stepped: this frame's step is presented first)
      pendMs = 0;
      on = false;
      el.style.transitionDuration = `${ms}ms`;
      el.classList.remove('is-on');
      hideT = after(ms, () => { hideT = 0; label = null; cur = -1; lab.textContent = ''; });
    },
    /** s: world scale 1…1000, dir 'dive' | 'recall' */
    set(s, dir) {
      if (pendMs && on) return;                     // (see show) — a trip that starts within the completion's frames waits
      end = dir === 'recall' ? 0 : 3;
      const x = Math.log10(Math.max(1e-6, dir === 'recall' ? 1000 * s : s));
      let k = Math.max(0, Math.min(3, Math.floor(x + 1e-9)));
      // It counts: it starts at the count's first value (DIVE 1 М, RECALL 1 000 М) and moves one decade per frame at most,
      // so a slow or late frame never skips a step of the count.
      if (label === null || cur < 0) k = dir === 'recall' ? 3 : 0;
      else if (Math.abs(k - cur) > 1) k = cur + Math.sign(k - cur);
      cur = k;
      const l = LABELS[k];
      if (l !== label) {
        if (label !== null) { flash = 1; el.classList.add('is-flash'); }
        label = l; lab.textContent = l;
      }
      const px = Math.round(80 * Math.pow(2, Math.max(0, Math.min(1, k === 3 ? 0 : x - k))));
      if (px !== w) { w = px; bar.style.width = `${px}px`; }
    },
    /** reduced motion / T0: `×1 000` under the level mark for ms */
    rmLabel(ms = 1200) {
      if (rmT) cancelAfter(rmT);
      rm.classList.add('is-on');
      F.twin('scaleLabel', {});
      rmT = after(ms, () => { rmT = 0; rm.classList.remove('is-on'); });
    },
    frame() {
      if (flash > 0 && --flash === 0) el.classList.remove('is-flash');
      stepped = false;
      if (pendMs && on) {
        const ms = pendMs;
        if (cur !== end) {                                        // one decade per frame, each one presented
          cur += Math.sign(end - cur); stepped = true;
          label = LABELS[cur]; lab.textContent = label; flash = 1; el.classList.add('is-flash');
        } else sb.hide(ms);                                       // the frame after the last step
      }
    },
  };
  return sb;
}
