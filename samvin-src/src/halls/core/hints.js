// halls/core/hints.js — WP4. The one-time motion hints of the CORE (SPEC §8.3; ARCH §3.14.3 'hint:arrive'). No text.
//   S01  a ghost press ring contracts 44 → 22 px at the Key's centre and holds 1,200 ms while the grains shiver once
//   S02  the Key zooms out and back by 15 % and the counter flashes 12.0 М (pull.hint)
//   S08  the Key pitches 25° and springs back (key.nudgePitch)
import { loop } from '../../core/loop.js';
import { ENV } from '../../core/env.js';
import { clamp01, EASE } from '../../core/ease.js';
import { app } from '../../core/store.js';

export function createHints(hctx, mods) {
  const ring = document.createElement('span');
  ring.className = 'core-ghost';
  ring.setAttribute('aria-hidden', 'true');
  hctx.section.appendChild(ring);
  const si = { x: 0, y: 0, r: 0, rx: 0, ry: 0 };
  let s01 = -1;
  const off = hctx.bus.on('hint:arrive', ({ secret, room }) => {
    if (room && room !== 'CORE') return;
    if (app.room !== 'CORE') return;
    if (secret === 'S01') { s01 = loop.now; ring.classList.add('is-in'); }
    else if (secret === 'S02' && mods.pull) mods.pull.hint();
    else if (secret === 'S08' && hctx.key) hctx.key.nudgePitch(25);
  });
  return {
    update() {
      if (s01 < 0) return;
      const t = loop.now - s01;
      const key = hctx.key;
      if (key) key.screenInfo(si);
      // contract 44 → 22 px over 360 ms, hold to 1,200 ms, fade 240 ms; the grains shiver once (240 ms)
      const d = ENV.reducedMotion ? 22 : 44 - 22 * EASE.reveal(clamp01(t / 360));
      ring.style.transform = `translate3d(${si.x.toFixed(1)}px,${si.y.toFixed(1)}px,0) translate(-50%,-50%)`;
      ring.style.width = ring.style.height = `${d.toFixed(1)}px`;
      if (key && key.grains && !ENV.reducedMotion) key.grains.shiver(t < 240 ? 0.006 * Math.sin((Math.PI * t) / 240) : 0);
      if (t > 1200) ring.classList.remove('is-in');
      if (t > 1460) { s01 = -1; if (key && key.grains) key.grains.shiver(0); }
    },
    dispose() { off(); ring.remove(); },
  };
}
