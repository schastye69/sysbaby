// audio/bed.js — WP3 SEED (ARCH §3.10.3, §6.1.5): the ambient bed. start() plays only the beat pair 49.0 / 49.3 Hz at
// −34 dB on E.bus.bed; the other methods store their values (no sound yet). WP3 implements the full bed (room drone
// root/fifth, brown-noise LP by altitude, SIGNAL wind band, root glides, night, rank harmonics, duck, «Голос» narrow,
// the ±2 dB breath ride).
import { osc, db2gain } from './synth.js';

/** @returns {Bed} */
export function createBed(E) {
  let oscs = null, out = null;
  const bed = {
    room: 'CORE', root: 146.83, night: false, rank: 0, duckDb: 0, narrowU: 0,
    start() {
      if (oscs) return;
      const ac = E.ctx;
      out = ac.createGain();
      out.gain.value = 0;
      out.gain.setTargetAtTime(db2gain(-34), ac.currentTime, 0.4);
      out.connect(E.bus.bed);
      oscs = [osc(ac, 49.0), osc(ac, 49.3)];
      for (const o of oscs) { o.connect(out); o.start(); }
    },
    stop() {
      if (!oscs) return;
      const ac = E.ctx, t = ac.currentTime;
      out.gain.setTargetAtTime(0, t, 0.1);
      for (const o of oscs) { try { o.stop(t + 0.6); } catch (e) { /* stopped */ } }
      oscs = null;
    },
    setRoom(roomId) { bed.room = roomId; },
    setRootGlide(fromHz, toHz, u) { bed.root = fromHz * Math.pow(toHz / fromHz, Math.max(0, Math.min(1, u))); },
    setNight(b) { bed.night = !!b; },
    setRank(i) { bed.rank = i | 0; },
    duck(db, ms) { bed.duckDb = db; void ms; },
    narrow(u) { bed.narrowU = u; },
    update(dt) { void dt; },
  };
  return bed;
}
