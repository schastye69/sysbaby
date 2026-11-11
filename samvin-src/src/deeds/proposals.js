// deeds/proposals.js — «ПРЕДЛОЖЕНИЕ», the data and the sheet (SPEC-ADDENDUM A3.4, A11.3, A11.6; ARCH-ADDENDUM X§2.6.5).
// OWNER: WP13. A founder proposes; a team agrees; the father makes it real. At most 3 open proposals `П-1`…`П-3`
// { id, title ≤ 32, text ≤ 80, where 'игра'|'жизнь' (chip, `В ИГРЕ` preselected), day } in state.data.proposals.
// add() persists, says «записано. покажи папе.» (P1) and emits proposal:saved {id} (WP6 drops the silver bead, cuts the
// dashed-rim hatch and shows the chamber). Promotion at load: a WORLD mission with proposedBy === operator.id and the
// same title (trimmed, case-insensitive) removes the proposal; «твоя вылазка {code} стала настоящей.» once (P2) — the
// proposal is gone from storage, so a later reload stays quiet. Proposals never touch data missions, never count in the V
// data ring, never enter a URL.
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { after } from '../core/clock.js';
import { WORLD, memberById } from '../data/world.js';
import { createProposalSheet } from '../host/sheets.js';

const IDS = ['П-1', 'П-2', 'П-3'];
const norm = (s) => String(s == null ? '' : s).trim().toLocaleLowerCase('ru');

export function createProposals(ctx) {
  const list = () => (state.data && Array.isArray(state.data.proposals) ? state.data.proposals : []);
  let sheet = null;
  const getSheet = () => {
    if (!sheet) sheet = createProposalSheet(ctx, { onSave: (t, x, w) => api.add(t, x, w) !== null });
    return sheet;
  };

  const api = {
    list() { return list().map((p) => ({ id: p.id, title: p.title, text: p.text || '', where: p.where === 'жизнь' ? 'жизнь' : 'игра', day: p.day })); },
    /** WP6's verb (and the dev hook) opens it */
    openSheet() {
      if (list().length >= 3) return;
      getSheet().open();
    },
    /** → the new id, or null (3 already open / no title) */
    add(title, text, where) {
      const t = String(title == null ? '' : title).trim().slice(0, 32);
      if (t.length < 2 || !state.data) return null;
      const cur = list();
      if (cur.length >= 3) return null;
      const id = IDS.find((x) => !cur.some((p) => p.id === x));
      if (!id) return null;
      const p = { id, title: t, text: String(text == null ? '' : text).trim().slice(0, 80), where: where === 'жизнь' ? 'жизнь' : 'игра', day: state.today };
      state.patch((d) => { if (!Array.isArray(d.proposals)) d.proposals = []; d.proposals.push(p); });
      if (ctx.status) ctx.status.say('proposal.saved');
      bus.emit('proposal:saved', { id });
      return id;
    },
    /** the 1,200 ms УБРАТЬ hold in the chamber (WP6) */
    remove(id) {
      if (!state.data || !list().some((p) => p.id === id)) return;
      state.patch((d) => { d.proposals = d.proposals.filter((p) => p.id !== id); });
    },
    /** load: real missions proposed by him replace his proposals (status once, P2) */
    promoteFromWorld() {
      if (!state.data) return;
      const op = WORLD.operator.id;
      const mine = (WORLD.missions || []).filter((m) => m && m.proposedBy === op);
      if (!mine.length) return;
      const promoted = [];
      const keep = list().filter((p) => {
        const m = mine.find((x) => norm(x.title) === norm(p.title));
        if (m) { promoted.push(m.code); return false; }
        return true;
      });
      if (!promoted.length) return;
      state.patch((d) => { d.proposals = keep; });          // gone from storage: the next load stays quiet
      // said once, after the boot settled (P2): the line belongs to the moment he sees the world, not to the black frame
      const say = () => { for (const c of promoted) if (ctx.status) ctx.status.say('proposal.real', { code: c }); };
      if (!ctx.app || ctx.app.booting || ctx.app.phase !== 'idle') { const off = bus.on('boot:done', () => { off(); after(1200, say); }); } else say();
    },
    /** WP6 chamber row ПРЕДЛОЖИЛ for promoted missions */
    proposedByName(code) {
      const m = (WORLD.missions || []).find((x) => x && x.code === code);
      if (!m || !m.proposedBy) return null;
      const who = memberById(m.proposedBy);
      return who ? who.name : null;
    },
  };
  return api;
}
