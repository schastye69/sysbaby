// ui/lead.js — the one centred LEAD message (#lead; ARCH §3.12.5, SPEC §2.2). Also used for HEADING-sized captions.
// show() writes the text (BEAM WRITE when opts.beam, otherwise the body reveal), an optional MICRO line under it, holds
// for opts.ms of loop time and fades out; the promise resolves once hidden. A new show() replaces the current one.
// DOM contract (chrome.css, QA §6.1.8): #frame > div#lead (.is-in) > p#lead-text.<cls> + p#lead-micro.t-micro.
import { after, cancelAfter } from '../core/clock.js';
import { beamWrite, revealBody } from './text.js';
import { TIMING } from '../core/tokens.js';

let root = null, textEl = null, microEl = null, timer = 0, gen = 0, done = null;

function finish() {
  timer = 0;
  if (root) root.classList.remove('is-in');
  const d = done; done = null;
  if (d) after(240, d);
}

export const lead = {
  init(ctx) {
    void ctx;
    const frame = document.getElementById('frame');
    root = document.getElementById('lead');
    if (!root && frame) {
      root = document.createElement('div');
      root.id = 'lead';
      root.className = 'scrim';                // readable over the Key: the radial --deep scrim, no box
      frame.appendChild(root);
    }
    if (!root) return lead;
    textEl = document.getElementById('lead-text') || root.appendChild(document.createElement('p'));
    textEl.id = 'lead-text';
    textEl.className = 't-lead';
    microEl = document.getElementById('lead-micro') || root.appendChild(document.createElement('p'));
    microEl.id = 'lead-micro';
    microEl.className = 't-micro';
    microEl.hidden = true;
    return lead;
  },

  /** → Promise (resolves when hidden). */
  show(text, opts = {}) {
    if (!root) return Promise.resolve();
    const ms = opts.ms != null ? opts.ms : TIMING.leadDefault;
    if (timer) { cancelAfter(timer); timer = 0; }
    if (done) { const d = done; done = null; d(); }
    const my = ++gen;
    textEl.className = opts.cls || 't-lead';
    microEl.textContent = opts.micro ? String(opts.micro) : '';
    microEl.hidden = !opts.micro;
    root.classList.add('is-in');
    const p = new Promise((res) => { done = res; });
    if (opts.beam) {
      beamWrite(textEl, String(text), {}).then(() => { if (my === gen) timer = after(ms, finish); });
    } else {
      textEl.textContent = String(text);
      revealBody(textEl);
      timer = after(ms, finish);
    }
    return p;
  },

  hide() {
    if (timer) { cancelAfter(timer); timer = 0; }
    gen++;
    finish();
  },
};
