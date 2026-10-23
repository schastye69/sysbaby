// host/guests.js — «ГОСТИ» (SPEC-ADDENDUM A4.1, A11.3; ARCH-ADDENDUM X§2.6.2). OWNER: WP13.
// The «Кто сегодня с тобой?» sheet (host/sheets.js) chooses up to 8 guests: roster members (every member but him, in
// roster order) and up to 4 typed names. On ГОТОВО: nobody → «покажу сам.» (P4), no burn, no deed. Otherwise the sheet
// closes (240 ms), REFOLD if unfolded / RECALL to CORE, the camera rests, and at +600 ms the rim (WP2) burns the
// guests beside his name at ONE letter height h_g = min(H0, 0.9·W / (L_max·0.66)) (law L10), --white → --silver,
// never ember, 70 ms per letter, 240 ms between names, each with a `guestBurn` bell panned by the name's screen x on the
// cue clock. Then LEAD «Добро пожаловать в SAM.VIN.» (4,000 ms), status «гости приняты.» (P1), deed `host` (first
// burn with ≥ 1 guest), guests:change {count}. All of it runs on the stage lock ('guests').
// Privacy (law L12): names live only in this module's memory; app.guests, the bus, the hook and storage get the count.
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { after } from '../core/clock.js';
import { WORLD, memberById } from '../data/world.js';
import { hz } from '../audio/notes.js';
import { createGuestsSheet, MAX_GUESTS, MAX_TYPED } from './sheets.js';
import { panOf, wait } from './dom.js';

const RIM_R = 300;           // m, the horizon the names burn on (SPEC §4.1)

export function createGuests(ctx) {
  /** selection order: { id: string|null (typed: null), key: string (chip id), name: string, typed: boolean } */
  const chosen = [];
  let typedSeq = 0, burning = null;
  const pt = { x: 0, y: 0 };

  const countAll = () => chosen.length;
  const sync = () => {
    app.guests = chosen.length;
    if (sheet) sheet.setCount(chosen.length);
  };

  const sheet = createGuestsSheet(ctx, {
    onToggle(m, on, chip) {
      const k = chosen.findIndex((g) => g.id === m.id);
      if (on) {
        if (k >= 0 || countAll() >= MAX_GUESTS) return;          // further chips stop toggling on
        chosen.push({ id: m.id, key: m.id, name: m.name, typed: false });
        chip.setAttribute('aria-pressed', 'true');
        const r = chip.getBoundingClientRect();                   // a tap, not a frame: one layout read is fine
        ctx.fx.cue.at(performance.now(), { id: 'memberNote', audio: (T) => ctx.audio.play('memberNote', { hz: hz(m.note), when: T, pan: panOf(r.left + r.width / 2) }) });
      } else {
        if (k >= 0) chosen.splice(k, 1);
        chip.setAttribute('aria-pressed', 'false');
      }
      sync();
    },
    onTyped(name) {
      if (countAll() >= MAX_GUESTS) return null;
      if (chosen.filter((g) => g.typed).length >= MAX_TYPED) return null;
      const key = `typed-${++typedSeq}`;
      chosen.push({ id: null, key, name, typed: true });
      sync();
      return key;
    },
    onRemoveTyped(key) {
      const k = chosen.findIndex((g) => g.key === key);
      if (k >= 0) chosen.splice(k, 1);
      sync();
    },
    onDone() { confirm('done'); },
    onShow() { confirm('show'); },
  });

  /** h_g of A4.1 for this device: min(H0, 0.9·W / (L_max · 0.66)), W = the rim width seen from the rest pose. */
  function letterHeightM(names) {
    const rim = ctx.rim;
    const h0 = rim && rim.letterHeightM ? rim.letterHeightM() : 38;
    const cam = ctx.rig && ctx.rig.camera;
    const vfov = ((cam ? cam.fov : 35) * Math.PI) / 180;
    const aspect = cam && cam.aspect > 0 ? cam.aspect : (innerWidth / Math.max(1, innerHeight));
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const W = 2 * RIM_R * Math.tan(hfov / 2);
    const his = String(WORLD.operator.name || '').length;
    const list = names || chosen.map((g) => g.name);
    const lmax = Math.max(his, ...list.map((s) => s.length), 1);
    return Math.min(h0, (0.9 * W) / (lmax * 0.66));
  }

  /** The rim burn + its bells + LEAD + status + deed. → Promise */
  async function burn() {
    const rim = ctx.rim;
    const names = chosen.map((g) => g.name);
    if (!names.length) return;
    if (!rim || !rim.burnGuests) return;
    const h0 = rim.letterHeightM ? rim.letterHeightM() : 0;
    const t0 = performance.now();
    const p = rim.burnGuests(names, { height: letterHeightM(names), gapMs: 240, msPerLetter: 70 });
    const reburn = rim.letterHeightM && rim.letterHeightM() < h0 - 1e-3;
    let off = reburn ? String(WORLD.operator.name || '').length * 70 + 240 : 0;
    names.forEach((n, k) => {
      const g = chosen[k];
      const m = g && g.id ? memberById(g.id) : null;
      const f = m ? hz(m.note) : 392;                              // typed guests: G4
      const at = t0 + off;
      ctx.fx.cue.at(at, {
        id: 'guestBurn',
        audio: (T) => { if (rim.namePoint) rim.namePoint(k + 1, pt); ctx.audio.play('guestBurn', { hz: f, when: T, pan: panOf(pt.x) }); },
      });
      off += n.length * 70 + 240;
    });
    await p;
  }

  /** ГОТОВО / НАЧАТЬ ПОКАЗ */
  function confirm(kind) {
    sheet.close();
    const n = chosen.length;
    bus.emit('guests:change', { count: n });
    if (kind === 'show') {
      if (!n) { if (ctx.status) ctx.status.say('guests.none'); return; }
      if (ctx.host && ctx.host.show) after(240, () => ctx.host.show.start());
      return;
    }
    if (!n) { if (ctx.status) ctx.status.say('guests.none'); return; }
    ctx.fx.stage.run('guests', async () => {
      if (app.unfolded || app.room !== 'CORE') {
        if (ctx.director) await ctx.director.go('#/core', { source: 'guests' });
      }
      await wait(600);
      burning = burn();
      await burning;
      burning = null;
      if (ctx.lead) ctx.lead.show('Добро пожаловать в SAM.VIN.', { ms: 4000 });
      if (ctx.status) ctx.status.say('guests.in');
      if (ctx.deeds) ctx.deeds.done('host', { name: 'ГОСТИ' });
    });
  }

  const api = {
    get active() { return chosen.length > 0; },
    /** selection order; typed names in memory only */
    list() { return chosen.map((g) => ({ id: g.id, name: g.name, typed: g.typed })); },
    /** roster member chosen as guest or marked ЗДЕСЬ today (СБОР) */
    isHere(id) {
      if (chosen.some((g) => g.id === id)) return true;
      const sb = state.data && state.data.sbor;
      const today = state.today;
      return !!(sb && Array.isArray(sb.here) && sb.here.some((h) => h && h.day === today && Array.isArray(h.ids) && h.ids.includes(id)));
    },
    /** source: 'tl' | 'unfold' | 'show' */
    open(source) {
      void source;
      if (app.show && app.show.active && source !== 'show') return;
      sheet.open(new Set(chosen.filter((g) => !g.typed).map((g) => g.id)));
    },
    close() { sheet.close(); },
    /** ПЕРЕЗАПУСК / reload behaviour (A4.1): the session list goes */
    clear() {
      chosen.length = 0;
      sheet.clearTyped();
      sync();
      bus.emit('guests:change', { count: 0 });
    },
    letterHeightM: () => letterHeightM(),
    /** internal: the names for ПОКАЗ (rim relayout before the dark scene) */
    names: () => chosen.map((g) => g.name),
    /** internal: the roster guests (ПОКАЗ band «КТО» chips, СБОР pre-marks) */
    rosterIds: () => chosen.filter((g) => !g.typed && g.id).map((g) => g.id),
    get burning() { return !!burning; },
    burnNow: () => burn(),
  };
  bus.on('relaunch', () => { if (!(app.show && app.show.active)) api.clear(); });
  sync();
  return api;
}
