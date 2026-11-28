// halls/archive/reading.js — WP7: the readable DOM of the wall of time (SPEC §6.4, §2.7, §6.0; SPEC-ADDENDUM A3.5, A11.6).
//   • the reading block of the centred band: desktop = a leader-anchored block on the right (overlay owner 'archive'),
//     phone = the bottom sheet (peek: LABEL + HEADING; body: BRIEF, КТО chips, rarity, verb). data-qa="archive-reading".
//     LABEL `ЛЕГЕНДА · В ИГРЕ · 14.11.2025` (whereLabel after the kind; jokes and deed bands carry none).
//   • the date column (data-qa="band", data-id = band id): every band near the eye carries its date at the left margin — the centred band as DATA 72 px
//     `dd.mm` (phone 48) + MICRO year, the others as a MICRO `dd.mm.yyyy` index; hover slides it 12 px right.
//   • marginalia: visible/found jokes written along their band, BODY 15 px --silver 80 % (data-qa="marginalia").
//   • «ДО НАЧАЛА»: BODY «Здесь ещё ничего не было. Потом пришли вы.» + LABEL founded date under the white point
//     (data-qa="before").
// Projection is our own (≤ 12 elements per frame, transform writes only, no layout reads); text only via textContent.
import { Vector3 } from 'three';
import { WORLD, memberById, whereLabel } from '../../data/world.js';
import { drawGlyph } from '../../core/glyph.js';
import { fmtDate, upper, nbsp } from '../../core/ru.js';
import { revealBody, lockIn } from '../../ui/text.js';
import { TUBE_R } from './bands.js';

const KIND_WORD = { legend: 'ЛЕГЕНДА', achievement: 'ДОСТИЖЕНИЕ', moment: 'МОМЕНТ', joke: 'ШУТКА' };
const DEG = Math.PI / 180;
export const READ_THETA = 5.5 * DEG;                            // the reading block's anchor on the band (screen right)
const NEAR = 6.5;                                               // m: bands within this of the eye get their DOM

const _v = new Vector3(), _w = new Vector3(), _p = { x: 0, y: 0, depth: 0, visible: false };

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

/** The LABEL of a band's reading block. */
export function readingLabel(b) {
  if (b.kind === 'before') return `ДО НАЧАЛА · ${fmtDate(b.date, 'dd.mm.yyyy')}`;
  if (b.label) return b.label;                                  // deed bands: the deeds model's own LABEL (A3.5)
  const parts = [KIND_WORD[b.kind] || ''];
  if (b.kind !== 'joke') { const w = whereLabel(b.where); if (w) parts.push(w); }
  parts.push(fmtDate(b.date, 'dd.mm.yyyy'));
  return parts.join(' · ');
}

function glyphFor(m, state) {
  if (m && m.glyph && m.glyph.length) return m.glyph;
  if (m && m.id === WORLD.operator.id && state.data && Array.isArray(state.data.glyph)) return state.data.glyph;
  return null;
}

export function createReading(hctx, bands, y0, opts) {
  const phone = () => hctx.layout.isPhone;
  const go = (hash) => hctx.director.go(hash, { source: 'hall' });

  // ── The reading block (one structure, re-parented between the overlay anchor and the sheet) ──
  const block = el('div', 'ar-read readable');
  block.dataset.qa = 'archive-reading';
  const head = el('div', 'ar-read-head');
  const label = el('p', 't-label ar-kind');
  const heading = el('h2', 't-heading');
  head.append(label, heading);
  const rest = el('div', 'ar-read-rest');
  const brief = el('p', 't-brief');
  const whoRow = el('div', 'ar-who');
  const whoLabel = el('span', 't-label ar-who-k', 'КТО');
  const chips = el('span', 'ar-chips');
  whoRow.append(whoLabel, chips);
  const rarity = el('p', 't-label ar-rarity');
  const verb = el('button', 'verb ar-verb', 'В ХРАНИЛИЩЕ →');
  verb.type = 'button';
  rest.append(brief, whoRow, rarity, verb);
  let verbTarget = null;
  verb.addEventListener('click', () => { if (verbTarget) go(verbTarget); });

  let anchor = null;                                            // desktop overlay anchor
  const anchorPos = new Vector3();
  let mounted = '';                                             // 'desk' | 'sheet' | ''
  const peekBox = el('div', 'ar-sheet-peek');
  const bodyBox = el('div', 'ar-sheet-body');

  function mount() {
    if (phone()) {
      if (anchor) { anchor.remove(); anchor = null; }
      block.textContent = '';
      peekBox.textContent = ''; bodyBox.textContent = '';
      peekBox.append(head); bodyBox.append(rest);
      peekBox.dataset.qa = 'archive-reading';
      block.removeAttribute('data-qa');
      if (hctx.sheet) hctx.sheet.set(bodyBox, { peek: peekBox, state: 'peek' });
      mounted = 'sheet';
    } else {
      peekBox.removeAttribute('data-qa');
      block.dataset.qa = 'archive-reading';
      block.textContent = '';
      block.append(head, rest);
      if (!anchor && hctx.overlay && hctx.scale) {
        anchor = hctx.overlay.add({
          owner: 'archive', id: 'reading', el: block,
          get: (out) => { hctx.toCanonical(anchorPos, _v); hctx.scale.toRender(_v, out); },
          leader: { side: 'right', len: 40, rise: -28 },
          lowpass: 120,
        });
      }
      mounted = 'desk';
    }
  }
  function unmount() {
    if (anchor) { anchor.remove(); anchor = null; }
    if (mounted === 'sheet' && hctx.sheet) hctx.sheet.set(null);
    mounted = '';
  }

  function makeChip(id) {
    const m = memberById(id);
    if (!m) return null;
    const b = el('button', 'chip');
    b.type = 'button';
    const c = document.createElement('canvas');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = c.height = Math.round(24 * dpr);
    const g = c.getContext('2d');
    if (g) {
      g.scale(dpr, dpr);
      const edges = glyphFor(m, hctx.state);
      drawGlyph(g, edges || [], { x: 3, y: 3, size: 18, lineWidth: 1.25, color: '#B8C4D0', dots: !edges });
    }
    b.append(c, el('span', 't-label', upper(m.callsign || m.name)));
    b.setAttribute('aria-label', m.name);
    b.addEventListener('click', () => go(`#/members/${m.id}`));
    return b;
  }

  let shown = -1;
  /** Fills the block for band i (reveal: lock-in HEADING + BODY reveal). */
  function show(i, reveal) {
    if (i === shown) return;
    shown = i;
    const b = bands[i];
    if (!b) return;
    const isBefore = b.kind === 'before', isJoke = b.kind === 'joke';
    label.textContent = readingLabel(b);
    heading.textContent = isBefore || isJoke ? '' : nbsp(b.title || '');
    heading.hidden = !heading.textContent;
    brief.textContent = isBefore ? '' : isJoke ? (phone() ? b.text : '') : nbsp(b.text || '');
    brief.hidden = !brief.textContent;
    chips.textContent = '';
    let nChips = 0;
    if (b.kind === 'moment' || b.kind === 'achievement' || b.kind === 'sbor' || b.kind === 'show') {
      for (const id of b.who || []) { const c = makeChip(id); if (c) { chips.appendChild(c); nChips++; } }
    }
    whoRow.hidden = nChips === 0;
    whoLabel.textContent = nChips ? 'КТО' : '';
    rarity.textContent = b.kind === 'achievement' && b.rarity ? upper(b.rarity) : '';
    rarity.hidden = !rarity.textContent;
    verbTarget = b.kind === 'achievement' ? `#/insignia/${b.dataId}` : null;
    verb.hidden = !verbTarget;
    verb.textContent = verbTarget ? 'В ХРАНИЛИЩЕ →' : '';
    block.classList.toggle('is-before', isBefore);
    if (anchor) anchor.setVisible(!isBefore && visibleA > 0.5);
    if (reveal) reading.reveal();
  }

  // ── Date column, marginalia, «ДО НАЧАЛА» ──
  const layer = el('div', 'ar-layer');
  hctx.section.appendChild(layer);
  const items = bands.map((b, i) => {
    const d = el('div', 'ar-date');
    d.dataset.id = b.id;
    if (b.kind !== 'before') d.dataset.qa = 'band';              // ARCH §6.8 hook: one per band, data-id = <kind>-<id>
    const inner = el('div', 'ar-date-in');
    const big = el('span', 't-data ar-dm', fmtDate(b.date, 'dd.mm'));
    const yr = el('span', 't-micro ar-yr', String(b.date).slice(0, 4));
    const small = el('span', 't-micro ar-short', fmtDate(b.date, 'dd.mm.yyyy'));
    inner.append(big, yr, small);
    d.appendChild(inner);
    layer.appendChild(d);
    let marg = null;
    if (b.kind === 'joke') {
      marg = el('p', 't-body t-body--15 ar-marg', b.text);
      marg.dataset.qa = 'marginalia';
      marg.dataset.id = b.id;
      layer.appendChild(marg);
    }
    return { i, d, marg, on: false, y: 0, centre: false, hover: false, mOn: false, mx: -1, my: -1 };
  });
  const beforeIdx = bands.length - 1;
  const before = el('div', 'ar-before');
  before.dataset.qa = 'before';
  before.append(el('p', 't-body', bands[beforeIdx].text), el('p', 't-label', fmtDate(WORLD.clan.founded, 'dd.mm.yyyy')));
  layer.appendChild(before);

  let visibleA = 0, centre = -1, hover = -1, beforeOn = false;
  const datumY = () => (phone() ? 120 : 0.62 * hctx.layout.h);

  /** Projects a hall-local point → _p (CSS px). */
  function project(x, y, z) {
    _w.set(x, y, z);
    hctx.toCanonical(_w, _v); hctx.scale.toRender(_v, _w);
    return hctx.rig.project(_w, _p);
  }
  /** Wall point x for a screen x (the camera looks along +z from the axis). */
  function wallAt(sx, y) {
    const f = (hctx.layout.h / 2) / Math.tan(17.5 * DEG);
    const th = Math.atan((hctx.layout.w / 2 - sx) / f);       // + = left of centre (x > 0 hall-local)
    return project(TUBE_R * Math.sin(th), y, TUBE_R * Math.cos(th));
  }

  const reading = {
    block, mount, unmount, show,
    /** HEADING lock-in + BODY reveal of the shown band (once the wall has settled on it). */
    reveal() {
      if (heading.textContent && !heading.hidden) lockIn(heading, { weight: 560 });
      if (brief.textContent && !brief.hidden) revealBody(brief);
    },
    get shown() { return shown; },
    setCentre(i) {
      if (centre === i) return;
      if (centre >= 0 && items[centre]) { items[centre].centre = false; items[centre].d.classList.remove('is-centre'); }
      centre = i;
      if (i >= 0 && items[i]) { items[i].centre = true; items[i].d.classList.add('is-centre'); }
    },
    setHover(i) {
      if (hover === i) return;
      if (hover >= 0 && items[hover]) items[hover].d.classList.remove('is-hover');
      hover = i;
      if (i >= 0 && items[i]) items[i].d.classList.add('is-hover');
    },
    /** 0..1 visibility of all readable DOM (enter/exit). */
    setVisible(a) {
      visibleA = a;
      layer.style.opacity = a >= 1 ? '' : String(a);
      if (anchor) anchor.setVisible(a > 0.5 && !(bands[shown] && bands[shown].kind === 'before'));
      if (anchor) anchor.setAlpha(a);
      if (mounted === 'sheet' && hctx.sheet && a < 0.5 && hctx.sheet.state !== 'closed') hctx.sheet.close();
    },
    /** Per frame: anchor follows the reading height; date column, marginalia and «ДО НАЧАЛА» follow their bands. */
    update(eye) {
      anchorPos.set(-TUBE_R * Math.sin(READ_THETA), eye + 0.4, TUBE_R * Math.cos(READ_THETA));
      if (!hctx.rig || !hctx.rig.camera || visibleA <= 0) return;
      const ph = phone(), dY = datumY(), H = hctx.layout.h, W = hctx.layout.w;
      const left = ph ? 16 : 48;
      for (let k = 0; k < items.length; k++) {
        const it = items[k], b = bands[k];
        const cy = y0 + b.y;
        let on = Math.abs(cy - eye) < NEAR;
        if (on) {
          wallAt(left + 40, cy);
          const y = _p.y;
          // keep clear of the title block (desktop: around the datum at 62 %; phone: the top title band)
          const clear = ph ? y > 150 && y < H - 230 : (y < dY - 170 || y > dY + 60) && y > 70 && y < H - 60;
          // Phone: «ДО НАЧАЛА» carries its date in its own LABEL under the centred BODY (no room for both).
          on = clear && _p.depth > 0 && !(ph && k === beforeIdx);
          if (on && (it.y !== y || !it.on)) { it.y = y; it.d.style.transform = `translate3d(${left}px,${y.toFixed(1)}px,0)`; }
          if (it.marg) {
            const my = ph ? y + 62 : y;
            const mx = ph ? left : Math.round(W * 0.25);
            // Never under the hall title (desktop: the DISPLAY title around the datum at 62 %; phone: the top band).
            const mOn = Math.abs(cy - eye) < NEAR && my > (ph ? 150 : 70) && my < H - (ph ? 230 : 60)
              && (ph || my < dY - 190 || my > dY + 70);
            if (it.my !== my || it.mx !== mx) { it.my = my; it.mx = mx; it.marg.style.transform = `translate3d(${mx}px,${my.toFixed(1)}px,0) translateY(-50%)`; }
            if (it.mOn !== mOn) { it.mOn = mOn; it.marg.classList.toggle('is-on', mOn); }
          }
        } else if (it.marg && it.mOn) { it.mOn = false; it.marg.classList.remove('is-on'); }
        if (on !== it.on) { it.on = on; it.d.classList.toggle('is-on', on); }
      }
      // «ДО НАЧАЛА»: centred under the white point.
      const bb = bands[beforeIdx];
      const bOn = Math.abs(y0 + bb.y - eye) < 2.2;
      if (bOn) {
        project(0, y0 + bb.y, TUBE_R - 0.05);
        before.style.transform = `translate3d(${(W / 2).toFixed(1)}px,${(_p.y + 22).toFixed(1)}px,0) translateX(-50%)`;
      }
      if (bOn !== beforeOn) { beforeOn = bOn; before.classList.toggle('is-on', bOn); }
    },
    dispose() {
      unmount();
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    },
  };
  void opts;
  return reading;
}
