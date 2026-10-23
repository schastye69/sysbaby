// halls/core/today.js — WP4. The CORE «СЕГОДНЯ» block (SPEC §6.1 DOM; SPEC-ADDENDUM A11.6 `where`).
//   LABEL  СЕГОДНЯ · {dd.mm}[ · В ИГРЕ | · В ЖИЗНИ]      (whereLabel(); no suffix when the moment has no mark)
//   BODY   WORLD.moments[dayIndex mod moments.length].text   (dayIndex = days since 2025-01-01: one per calendar day)
// Desktop: leader-anchored (overlay, 45° elbow + run, on a scrim) to the Key's lower-left silhouette.
// Phone: a block at the top, under the title (CSS in core.css). Hidden when `moments` is empty, and whenever the CORE is
// not at rest (unfold, РЕЗОНАНС, PULL, travel): nothing readable competes with a set-piece.
import { Vector3 } from 'three';
import { WORLD, whereLabel } from '../../data/world.js';
import { dayIndex, now } from '../../core/time.js';

import { revealBody } from '../../ui/text.js';

/** → { label, body } | null for the given time (ms). Pure. */
export function todayMoment(t = now()) {
  const list = WORLD.moments || [];
  if (!list.length) return null;
  const i = ((dayIndex(t) % list.length) + list.length) % list.length;
  const m = list[i];
  const d = new Date(t);
  const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0');
  const w = whereLabel(m.where);
  return { label: `СЕГОДНЯ · ${dd}.${mm}${w ? ` · ${w}` : ''}`, body: String(m.text || ''), moment: m };
}


export function createToday(hctx) {
  const phone = () => hctx.layout.kind !== 'desktop';
  let el = null, anchor = null, shown = false, dayKeyShown = '', checkedAt = 0;
  const P = new Vector3(-0.44, -0.42, 0.18);           // Key-local: the lower-left silhouette (V/I strata, left flank)

  function build() {
    const m = todayMoment();
    if (!m) return;
    el = document.createElement('div');
    el.className = 'core-today';
    el.dataset.qa = 'today';
    const lab = document.createElement('p');
    lab.className = 't-label core-today__label';
    lab.textContent = m.label;
    const body = document.createElement('p');
    body.className = 't-body core-today__body';
    body.textContent = m.body;
    el.append(lab, body);
    dayKeyShown = m.label;
    place();
  }
  function place() {
    if (!el) return;
    if (anchor) { anchor.remove(); anchor = null; }
    if (el.parentNode) el.parentNode.removeChild(el);
    if (phone()) {
      el.classList.add('core-today--phone', 'scrim');
      hctx.section.appendChild(el);
    } else {
      el.classList.remove('core-today--phone');
      el.classList.add('scrim');
      const key = hctx.key;
      anchor = hctx.overlay.add({
        owner: 'core-today', el, scrim: true, cross: true, priority: 3, lowpass: 120,
        leader: { side: 'left', len: 72, rise: 104 },
        get: (out) => { out.copy(P); if (key) out.applyMatrix4(key.group.matrixWorld); },
      });
    }
    setShown(shown, true);
  }
  function setShown(b, force) {
    if (!el || (b === shown && !force)) return;
    const was = shown;
    shown = b;
    el.classList.toggle('is-in', b);
    if (anchor) anchor.setVisible(b);
    if (b && !was) { const body = el.querySelector('.core-today__body'); if (body) revealBody(body); }
  }

  return {
    build,
    /** visible = the CORE is current and at rest */
    update(visible) {
      if (!el) return;
      if (visible && Date.now() - checkedAt > 1000) {
        checkedAt = Date.now();
        const m = todayMoment();          // a new calendar day while he watches: the block follows
        if (m && m.label !== dayKeyShown) {
          dayKeyShown = m.label;
          el.querySelector('.core-today__label').textContent = m.label;
          el.querySelector('.core-today__body').textContent = m.body;
        }
      }
      setShown(!!visible);
    },
    resize() { place(); },
    dispose() {
      if (anchor) { anchor.remove(); anchor = null; }
      if (el && el.parentNode) el.parentNode.removeChild(el);
      el = null;
    },
  };
}
