// host/strip.js — the ПОКАЗ host strip `#hoststrip` (SPEC-ADDENDUM A4.2; ARCH-ADDENDUM X§2.6.6, X§0.3). OWNER: WP13.
//   ПОКАЗ · ВЕДЁТ СЭМ          КЛАН          ДАЛЬШЕ →          ВЫЙТИ
//   LABEL --silver             LABEL --white  verb ≥ 44 px       verb ≥ 44 px, --pewter
// One row above the status line (phone: 12 px above the Key band; host.css). Only the CURRENT scene's label is shown,
// never the list. {ИМЯ} = operator.name uppercased, never the callsign. After the finale: `СНОВА` and `ВЫЙТИ`; when he
// leaves the script through the navigator: `ВЕРНУТЬСЯ К ПОКАЗУ` and `ВЫЙТИ`. Also the hull MICRO
// `КОДЕКС · ВЫСОТА БУКВ {h} М` (scene 5) sits in this layer, under the elevator counter's place.
import { WORLD } from '../data/world.js';
import { upper } from '../core/ru.js';
import { after, cancelAfter } from '../core/clock.js';
import { el, verb, fade } from './dom.js';

export const SCENES = ['ТЕМНОТА', 'ПРОБУЖДЕНИЕ', 'КЛАН', 'ИМЕНА', 'МАСШТАБ', 'СНАРУЖИ', 'ФИНАЛ'];

export function createStrip(handlers) {
  const root = document.getElementById('hoststrip');
  const host = root || el('div', 'hoststrip', null, document.body, { id: 'hoststrip' });
  host.textContent = '';
  host.setAttribute('data-qa', 'hoststrip');
  host.setAttribute('role', 'toolbar');
  host.setAttribute('aria-label', 'ПОКАЗ');
  const row = el('div', 'hs-row', null, host);
  const label = el('p', 't-label hs-label', `ПОКАЗ · ВЕДЁТ ${upper(WORLD.operator.name)}`, row, { qa: 'show-label' });
  const scene = el('p', 't-label hs-scene', '', row, { qa: 'show-scene', 'aria-live': 'polite' });
  const next = verb('ДАЛЬШЕ →', row, 'show-next', () => handlers.next(), 'hs-next');
  const back = verb('ВЕРНУТЬСЯ К ПОКАЗУ', row, 'show-back', () => handlers.back(), 'hs-back');
  const again = verb('СНОВА', row, 'show-again', () => handlers.again(), 'hs-again');
  const exit = verb('ВЫЙТИ', row, 'show-exit', () => handlers.exit(), 'hs-exit');
  const micro = el('p', 't-micro hs-codex', '', host, { qa: 'show-codex', 'aria-hidden': 'true' });
  micro.hidden = true;
  host.hidden = true;
  let pulseT = 0;
  void label;
  const api = {
    el: host,
    show() { host.style.opacity = '0'; host.hidden = false; host.classList.add('is-in'); fade(host, 1, 480); },
    hide() { host.classList.remove('is-in'); host.hidden = true; micro.hidden = true; },
    /** mode: 'scene' | 'end' | 'off' (off-script) */
    set(index, mode = 'scene') {
      scene.textContent = mode === 'off' ? '' : SCENES[Math.max(0, Math.min(6, index))] || '';
      next.hidden = mode !== 'scene' || index >= 6;
      back.hidden = mode !== 'off';
      again.hidden = mode !== 'end';
      exit.hidden = false;
      host.dataset.mode = mode;
    },
    /** a scene's gesture completed: the ДАЛЬШЕ → underline draws and retracts once (480 ms) — nothing else happens */
    pulseNext() {
      if (next.hidden) return;
      next.classList.remove('is-pulse');
      void next.offsetWidth;
      next.classList.add('is-pulse');
      if (pulseT) cancelAfter(pulseT);
      pulseT = after(520, () => { pulseT = 0; next.classList.remove('is-pulse'); });
    },
    /** scene 5: `КОДЕКС · ВЫСОТА БУКВ {h} М` (null hides) */
    codex(text) {
      if (!text) { micro.hidden = true; return; }
      if (micro.textContent !== text) micro.textContent = text;
      micro.hidden = false;
    },
  };
  return api;
}
