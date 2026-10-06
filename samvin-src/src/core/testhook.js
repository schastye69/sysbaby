// core/testhook.js — window.__SAMVIN__ (ARCH §3.17 + §6.1.6 A2; SPEC §13.0). Ships in production; read-only except go().
// state() returns a fresh plain object each call; fields prefixed `_` are diagnostics (WP0 may extend them).
import { app } from './store.js';
import { state } from './state.js';
import { WORLD_SOURCE, WORLD_ISSUES } from '../data/world.js';
import { textureMB } from '../render/uniforms.js';

const IDS = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13', 'S14'];

export function installTestHook(ctx) {
  const foundList = () => {
    if (ctx.secrets && typeof ctx.secrets.found === 'function') return ctx.secrets.found();
    const f = (state.data && state.data.found) || {};
    return IDS.filter((id) => !!f[id]);
  };
  const hook = Object.freeze({
    version: 1,
    state() {
      const r = ctx.renderer;
      const d = state.data || {};
      const st = r ? r.stats : null;
      return {
        route: app.route.hash, room: app.room, phase: app.phase, tier: app.tier, u: app.u, soundOn: app.soundOn,
        night: app.night, owner: app.owner, inverted: app.inverted, secrets: foundList(), shards: d.shards | 0,
        nadirOpen: !!d.nadirOpen, pullNest: app.pullNest, resonancePct: app.resonancePct, status: app.status,
        columns: app.columns.slice(), satellites: app.satellites, companion: app.companion, whaleSeen: !!d.whaleSeen,
        _stats: st ? {
          calls: st.calls, triangles: st.triangles, dpr: r.dpr, texMB: textureMB(), geometries: st.geometries,
          points: st.points, frameMs: st.frameMs, fps: st.fps, tier: app.tier,
          labels: ctx.overlay ? ctx.overlay.visibleCount | 0 : 0,
        } : null,
        _travel: ctx.director && ctx.director.lastTravel ? { ...ctx.director.lastTravel } : null,
        _world: { source: WORLD_SOURCE, issues: WORLD_ISSUES.length },
      };
    },
    /** Exactly like a hash change: location.hash = hash (if already equal: director.go(hash, {source:'go'})). */
    go(hash) {
      const h = String(hash);
      if (location.hash === h) { if (ctx.director) ctx.director.go(h, { source: 'go' }); }
      else location.hash = h;
    },
  });
  try {
    Object.defineProperty(window, '__SAMVIN__', { value: hook, writable: false, configurable: false, enumerable: false });
  } catch (e) { /* already installed */ }
  return hook;
}
