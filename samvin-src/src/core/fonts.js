// core/fonts.js — fontsReady() (ARCH §1.6, §3.1.3). Canvas text (atlas signs, ring strips, name burn, sand text)
// awaits it before rasterising so canvases use Geologica/Martian, not the fallback.

let memo = null;

/** Resolves once both faces have loaded (or failed), or after 2,500 ms. Never rejects. Memoised. */
export function fontsReady() {
  if (memo) return memo;
  memo = new Promise((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    setTimeout(finish, 2500);
    try {
      const f = typeof document !== 'undefined' ? document.fonts : null;
      if (!f || typeof f.load !== 'function') { finish(); return; }
      Promise.allSettled([
        f.load('700 64px Geologica', 'SAMVINСЭМ'),
        f.load('500 32px Martian', 'SAMVIN 0123'),
      ]).then(finish, finish);
    } catch (e) { finish(); }
  });
  return memo;
}
