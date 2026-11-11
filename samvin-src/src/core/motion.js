// core/motion.js — device orientation (ARCH §3.9.4). A bonus only: every motion feature has a pointer route.
// available only where DeviceOrientationEvent exists AND needs no permission (Android-style). iOS motion permission
// is NEVER requested (SPEC §10.1).

const HAS = typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';
const listeners = [];
let attached = false;
// One reused sample object (no allocation per event).
const sample = { alpha: 0, beta: 0, gamma: 0, t: 0 };

function onOrient(e) {
  sample.alpha = e.alpha || 0;
  sample.beta = e.beta || 0;
  sample.gamma = e.gamma || 0;
  sample.t = typeof performance !== 'undefined' ? performance.now() : Date.now();
  for (let i = 0; i < listeners.length; i++) {
    try { listeners[i](sample); } catch (err) { /* a bonus feature never breaks the app */ }
  }
}

export const motion = {
  available: HAS && typeof window.DeviceOrientationEvent.requestPermission !== 'function',
  /** fn({ alpha, beta, gamma, t }) — attaches the window listener lazily on the first subscriber. */
  on(fn) {
    if (!motion.available || listeners.includes(fn)) return;
    listeners.push(fn);
    if (!attached) { window.addEventListener('deviceorientation', onOrient); attached = true; }
  },
  off(fn) {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
    if (attached && listeners.length === 0) { window.removeEventListener('deviceorientation', onOrient); attached = false; }
  },
};
