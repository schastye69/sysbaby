// halls/registry.js — RoomId → hall factory (ARCH §3.7, §2.3). Imports exactly the nine factories; never edited by
// other WPs (each hall WP replaces its own seed file, keeping the factory name).
import { createCoreHall } from './core/core.js';
import { createMembersHall } from './members/members.js';
import { createWorkshopHall } from './members/workshop.js';
import { createVoyagesHall } from './voyages/voyages.js';
import { createArchiveHall } from './archive/archive.js';
import { createSignalHall } from './signal/signal.js';
import { createInsigniaHall } from './insignia/insignia.js';
import KIT_NADIR from 'samvin:chunk-kit/nadir';
import { lazyHall } from './lazyHall.js';
import { loadChunk } from '../core/chunk.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { createZenithHall } from './zenith/zenith.js';

export const HALL_FACTORIES = Object.freeze({
  CORE: createCoreHall,
  MEMBERS: createMembersHall,
  WORKSHOP: createWorkshopHall,
  VOYAGES: createVoyagesHall,
  ARCHIVE: createArchiveHall,
  SIGNAL: createSignalHall,
  INSIGNIA: createInsigniaHall,
  NADIR: lazyHall(nadirFactory, () => nadirReady),
  ZENITH: createZenithHall,
});

// NADIR «ИСТОК» is a feature chunk (build.mjs §3c' `nadir`): sealed until the fifth shard, so a visit that never opens it
// never fetches it. It is fetched the moment it opens ('nadir:open', 2,800 ms of crack before he can travel there), with
// the boot of any visit that finds it open (prefetchLazyHalls, from hallHost.init), and by the hall host itself on the first build (a deep link).
let nadirReady = null;
function nadirFactory() { return loadChunk('nadir', KIT_NADIR).then((m) => (nadirReady = m.createNadirHall)); }
const prefetch = () => { nadirFactory().catch(() => {}); };
bus.on('nadir:open', prefetch);
/** hallHost.init (WebGL path, the profile loaded): an already-open NADIR is fetched alongside the boot. */
export function prefetchLazyHalls() { if (state.data && state.data.nadirOpen) prefetch(); }
