// t0/halls.js — WP11. The T0 hall registry (SPEC §12.5 table): every hall is a DOM/SVG section in the same
// construction-drawing language — the WP0 datum carries the title and the level mark, leaders become left ticks.
// Each factory (ctx, T) → { id, section, show(route), hide(), relayout?(), hint?(secret) }; CORE lives in t0/core.js.
import { createMembers } from './members.js';
import { createWorkshop } from './workshop.js';
import { createVoyages } from './voyages.js';
import { createArchive } from './archive.js';
import { createSignal } from './signal.js';
import { createInsignia } from './insignia.js';
import { createNadir, createZenith } from './pages.js';

export const HALL_FACTORIES = {
  MEMBERS: createMembers,
  WORKSHOP: createWorkshop,
  VOYAGES: createVoyages,
  ARCHIVE: createArchive,
  SIGNAL: createSignal,
  INSIGNIA: createInsignia,
  NADIR: createNadir,
  ZENITH: createZenith,
};
