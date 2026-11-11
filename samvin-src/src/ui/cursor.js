// ui/cursor.js — desktop only (ARCH §3.12.6): a 6 px hollow --ember circle (#cursor in #fx) following the pointer while
// it is over the canvas (#gl has cursor:none; DOM controls keep the system cursor). Transform writes only.
import { layout } from '../core/layout.js';

let el = null, over = false, shown = false, want = true, color = null;

function sync() {
  const on = want && over && !layout.isPhone;
  if (on === shown || !el) return;
  shown = on;
  el.classList.toggle('is-on', on);
}

export const cursor = {
  init(ctx) {
    const fx = document.getElementById('fx');
    const gl = document.getElementById('gl');
    if (!fx) return cursor;
    el = document.createElement('i');
    el.id = 'cursor';
    fx.appendChild(el);
    if (gl) {
      gl.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') { over = true; sync(); } });
      gl.addEventListener('pointerout', () => { over = false; sync(); });
      gl.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') { over = false; sync(); } });
    }
    ctx.input.observe((p) => {
      if (p.type === 'touch') return;
      el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
    });
    return cursor;
  },
  setVisible(b) { want = !!b; sync(); },
  /** 'ember' (default) | 'electrum' | 'silver' — a token name. */
  setColor(token) {
    color = token && token !== 'ember' ? token : null;
    if (el) el.style.boxShadow = color ? `inset 0 0 0 1px var(--${color})` : '';
  },
};
