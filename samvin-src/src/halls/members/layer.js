// halls/members/layer.js — the screen-space layer of MEMBERS (inside the hall's own <section>, under #halls):
//   • the deck labels at each base: BODY {name}, LABEL {CALLSIGN} under it, LABEL ЗДЕСЬ (--white) under that (A3.2/A4.1)
//   • the ЗДЕСЬ 7 px --white survey + above a capital
//   • the СБОР hold ring: 2 px --ember, r 36 px around his capital, filling 0 → 1 (A3.2)
//   • the hint ghost ring (2 px --silver, r 36 px, A4.2 scene 2 / hint 'sbor') and the S04 ghost dot (SPEC §8.3)
// Writes are transform-only (translate3d) and only when a value moved ≥ 0.25 px; no layout reads.
const SVGNS = 'http://www.w3.org/2000/svg';
const R = 36, C = 2 * Math.PI * R;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

export function createLayer(section, cols) {
  const root = el('div', 'mb-layer');
  root.setAttribute('aria-hidden', 'false');
  section.appendChild(root);

  const labels = cols.map((c) => {
    const L = el('div', 'mb-label');
    L.dataset.id = c.id;
    L.dataset.qa = 'member-label';
    const nm = el('span', 't-body mb-label-name', c.member.name);
    const cs = el('span', 't-label mb-label-call', c.member.callsign);
    const here = el('span', 't-label mb-label-here', 'ЗДЕСЬ');
    here.hidden = true;
    L.append(nm, cs, here);
    root.appendChild(L);
    const cross = el('i', 'cross mb-here-cross');
    cross.hidden = true;
    root.appendChild(cross);
    return { el: L, here, cross, x: NaN, y: NaN, cx: NaN, cy: NaN, a: -1, on: false, hereOn: false };
  });

  // SVG rings (hold ring + ghost ring) share one svg
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'mb-rings');
  svg.setAttribute('aria-hidden', 'true');
  const ring = (cls) => {
    const g = document.createElementNS(SVGNS, 'circle');
    g.setAttribute('class', cls);
    g.setAttribute('r', String(R));
    g.setAttribute('cx', '0'); g.setAttribute('cy', '0');
    g.style.strokeDasharray = `${C.toFixed(2)}`;
    g.style.strokeDashoffset = `${C.toFixed(2)}`;
    svg.appendChild(g);
    return { el: g, x: NaN, y: NaN, fill: -1, on: false };
  };
  const hold = ring('mb-hold');
  const ghost = ring('mb-ghost');
  root.appendChild(svg);
  const dot = el('i', 'mb-ghost-dot');
  dot.hidden = true;
  root.appendChild(dot);

  function placeRing(r, x, y, fill, alpha) {
    const on = fill > 0.001 && alpha > 0.001;
    if (on !== r.on) { r.on = on; r.el.style.visibility = on ? 'visible' : 'hidden'; }
    if (!on) return;
    if (!(Math.abs(x - r.x) < 0.25) || !(Math.abs(y - r.y) < 0.25)) {
      r.x = x; r.y = y;
      r.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(-90)`);
    }
    const f = Math.round(fill * 400) / 400;
    if (f !== r.fill) { r.fill = f; r.el.style.strokeDashoffset = `${((1 - f) * C).toFixed(2)}`; }
    r.el.style.opacity = alpha.toFixed(3);
  }

  return {
    root,
    /** Deck label k standing at screen (x, y) (its bottom on the base), alpha a (0 hides). */
    label(k, x, y, a) {
      const L = labels[k];
      const on = a > 0.01;
      if (on !== L.on) { L.on = on; L.el.style.visibility = on ? 'visible' : 'hidden'; }
      if (!on) return;
      if (!(Math.abs(x - L.x) < 0.25) || !(Math.abs(y - L.y) < 0.25)) {
        L.x = x; L.y = y;
        L.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translateY(-100%)`;
      }
      const aq = Math.round(a * 50) / 50;
      if (aq !== L.a) { L.a = aq; L.el.style.opacity = String(aq); }
    },
    /** ЗДЕСЬ under the callsign + the 7 px --white + at (x, y) above the capital. */
    here(k, on, x, y) {
      const L = labels[k];
      if (on !== L.hereOn) { L.hereOn = on; L.here.hidden = !on; L.cross.hidden = !on; L.el.classList.toggle('is-here', on); }
      if (!on) return;
      if (!(Math.abs(x - L.cx) < 0.25) || !(Math.abs(y - L.cy) < 0.25)) {
        L.cx = x; L.cy = y;
        L.cross.style.transform = `translate3d(${(x - 3.5).toFixed(1)}px,${(y - 3.5).toFixed(1)}px,0)`;
      }
    },
    isHere(k) { return labels[k].hereOn; },
    hold(x, y, fill, alpha = 1) { placeRing(hold, x, y, fill, alpha); },
    ghost(x, y, fill, alpha) { placeRing(ghost, x, y, fill, alpha); },
    dot(x, y, on, alpha = 1) {
      dot.hidden = !on;
      if (!on) return;
      dot.style.transform = `translate3d(${(x - 3).toFixed(1)}px,${(y - 3).toFixed(1)}px,0)`;
      dot.style.opacity = alpha.toFixed(3);
    },
    setVisible(b) { root.style.visibility = b ? '' : 'hidden'; },
    dispose() { if (root.parentNode) root.parentNode.removeChild(root); },
  };
}
