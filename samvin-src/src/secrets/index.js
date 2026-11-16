// secrets/index.js — WP10's installs (ARCH §3.14.2, §6.11): everything is installed once by initSecrets(ctx) at boot
// step 11 (after secrets.init) and lives for the session — S03 dizzy, S05 owner (+ the typed words), S07 whale,
// S08 ИЗНАНКА, S09 drone, S10 night (+ drowsy + the birthday), S14 companion, and the motion hints S03/S05/S09.
// The shard flight (flyShard) and flyMote live in shardFlight.js. Each install is guarded: one failing secret never
// takes the others (or the boot) down.
import { logOnce } from '../core/env.js';
import { W } from './util.js';
import { initDizzy } from './dizzy.js';
import { initOwner } from './owner.js';
import { initWhale } from './whale.js';
import { initInvert } from './invert.js';
import { initDrone } from './drone.js';
import { initNight } from './night.js';
import { initCompanion } from './companion.js';
import { initHints } from './hints.js';

export function initSecrets(ctx) {
  W.ctx = ctx;
  const run = (name, fn) => { try { fn(ctx); } catch (e) { logOnce(`secrets:init:${name}`, `WP10 ${name} failed to install`, e); } };
  run('night', initNight);
  run('dizzy', initDizzy);
  run('owner', initOwner);
  run('whale', initWhale);
  run('invert', initInvert);
  run('drone', initDrone);
  run('companion', initCompanion);
  run('hints', initHints);
}
