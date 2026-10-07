// halls/registry.js — RoomId → hall factory (ARCH §3.7, §2.3). Imports exactly the nine factories; never edited by
// other WPs (each hall WP replaces its own seed file, keeping the factory name).
import { createCoreHall } from './core/core.js';
import { createMembersHall } from './members/members.js';
import { createWorkshopHall } from './members/workshop.js';
import { createVoyagesHall } from './voyages/voyages.js';
import { createArchiveHall } from './archive/archive.js';
import { createSignalHall } from './signal/signal.js';
import { createInsigniaHall } from './insignia/insignia.js';
import { createNadirHall } from './nadir/nadir.js';
import { createZenithHall } from './zenith/zenith.js';

export const HALL_FACTORIES = Object.freeze({
  CORE: createCoreHall,
  MEMBERS: createMembersHall,
  WORKSHOP: createWorkshopHall,
  VOYAGES: createVoyagesHall,
  ARCHIVE: createArchiveHall,
  SIGNAL: createSignalHall,
  INSIGNIA: createInsigniaHall,
  NADIR: createNadirHall,
  ZENITH: createZenithHall,
});
