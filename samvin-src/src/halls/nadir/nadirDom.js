// halls/nadir/nadirDom.js — WP9: NADIR's readable column (SPEC §1 shown lore, §6.7 Readable; SPEC-ADDENDUM A3.1, A3.3,
// A11.5 O11, A11.7). One block, data-qa="nadir-block", in two parts so the DISPLAY title «ИСТОК» (WP0 datum) stands
// between them like a plaque on desktop:
//   story (above the title) — LEAD the lore (SPEC §1, verbatim), BRIEF `nadir.origin`, BODY `clan.about`
//                             (data-qa="nadir-about"; omitted when "")
//   facts (under the datum) — LABEL `ОСНОВАН {dd.mm.yyyy}`, LABEL `ОСНОВАТЕЛЬ: {name} · {callsign}`, LABEL
//                             `MISSION 000 ОТКРЫТА` + the verb `К ВЫЛАЗКЕ 000 →` (→ #/voyages/000), then the КОДЕКС
//                             (data-qa="nadir-codex"): LABEL `КОДЕКС SAM.VIN`, HEADING «Правила клана», each earned law as
//                             BODY with a MICRO date, in stratum order — absent while none is earned (L9).
// Phone: the whole block in the sheet (peek = the lore line).
import { fmtDate } from '../../core/ru.js';
import { revealBody } from '../../ui/text.js';
import { lawOf } from '../../deeds/deedsModel.js';

export const LORE = 'VIN строит себя сам. Он спал, пока вы не коснулись ключа. Теперь каждое ваше возвращение зажигает в нём новый узел.';
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

export function createNadirDom(hctx) {
  const W = hctx.world;
  const block = el('div', 'nd-block');
  block.dataset.qa = 'nadir-block';
  const story = el('div', 'nd-story');
  const lore = el('p', 't-lead nd-lore', LORE);
  const origin = el('p', 't-brief nd-origin', (W.nadir && W.nadir.origin) || '');
  story.append(lore, origin);
  let about = null;
  if (W.clan && typeof W.clan.about === 'string' && W.clan.about.trim()) {
    about = el('p', 't-body nd-about', W.clan.about);
    about.dataset.qa = 'nadir-about';
    story.append(about);
  }
  const facts = el('div', 'nd-facts');
  const op = W.members.find((m) => m.id === W.operator.id) || { name: W.operator.name || '', callsign: W.operator.callsign || '' };
  const founded = W.clan && W.clan.founded ? fmtDate(W.clan.founded) : '';
  if (founded) facts.append(el('p', 't-label nd-fact', `ОСНОВАН ${founded}`));
  facts.append(el('p', 't-label nd-fact', `ОСНОВАТЕЛЬ: ${op.name || W.operator.name || ''}${op.callsign ? ` · ${op.callsign}` : ''}`));
  const m0 = W.missions.find((m) => m.code === '000');
  if (m0) {
    const row = el('div', 'nd-mission');
    row.append(el('p', 't-label nd-fact', 'MISSION 000 ОТКРЫТА'));
    const verb = el('button', 'verb t-label nd-verb', 'К ВЫЛАЗКЕ 000 →');
    verb.type = 'button';
    verb.dataset.qa = 'nadir-verb';
    verb.addEventListener('click', () => hctx.director.go('#/voyages/000', { source: 'hall' }));
    row.append(verb);
    facts.append(row);
  }
  const codex = el('div', 'nd-codex');
  codex.dataset.qa = 'nadir-codex';
  facts.append(codex);
  block.append(story, facts);

  function renderCodex() {
    codex.textContent = '';
    const laws = [];
    for (let i = 0; i < 7; i++) { const l = lawOf(i); if (l) laws.push(l); }
    codex.hidden = laws.length === 0;
    if (!laws.length) { if (codex.parentNode) codex.remove(); return; }
    if (!codex.parentNode) facts.append(codex);
    codex.append(el('p', 't-label nd-codex-head', 'КОДЕКС SAM.VIN'), el('h3', 't-heading nd-codex-title', 'Правила клана'));
    const list = el('ol', 'nd-laws');
    for (const l of laws) {
      const li = el('li', 'nd-law');
      li.append(el('p', 't-body nd-law-text', l.text), el('p', 't-micro nd-law-date', fmtDate(l.at)));
      list.append(li);
    }
    codex.append(list);
  }
  renderCodex();

  return {
    block, story, facts, lore,
    refresh() { renderCodex(); },
    reveal() { revealBody(origin); if (about) revealBody(about); },
    setAlpha(a) { block.style.opacity = String(a); },
  };
}
