// t0/load.js — the T0 bundle on demand (build.mjs §3c). A page with WebGL never fetches it; T0 (no WebGL, or a step
// 6–11 failure) and a lost WebGL context call loadT0() → Promise<mountT0>. The bundle reads the app's live modules from
// the kit set here (the exact names src/t0 imports) and hands mountT0 back through done(); the stylesheet is awaited
// too (or its failure), so T0 never mounts unstyled while the sheet is still on its way.
import KIT from 'samvin:t0-kit';

let pending = null;

export function loadT0() {
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    let mount = null, styled = false;
    const settle = () => {
      if (!mount || !styled) return;
      try { delete globalThis.__samvinT0; } catch (e) { globalThis.__samvinT0 = undefined; }
      resolve(mount);
    };
    globalThis.__samvinT0 = { kit: KIT, done(m) { mount = m; settle(); } };
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = __T0_CSS__;
    link.onload = link.onerror = () => { styled = true; settle(); };
    document.head.appendChild(link);
    const s = document.createElement('script');
    s.src = __T0_JS__;
    s.onerror = () => { pending = null; reject(new Error(`${__T0_JS__} failed to load`)); };
    document.head.appendChild(s);
  });
  return pending;
}
