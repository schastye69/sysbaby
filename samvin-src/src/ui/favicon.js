// ui/favicon.js — his glyph as the favicon (ARCH §3.12.6, SPEC §6.2.1 S06): a 64×64 canvas, the glyph in --ember 4 px
// strokes on --void → link#favicon href = a data:image/png URL. resetFavicon() restores ./favicon.svg.
import { drawGlyph } from '../core/glyph.js';
import { PALETTE } from '../core/tokens.js';

const DEFAULT_HREF = './favicon.svg';

function link() { return document.getElementById('favicon'); }

export function setGlyphFavicon(edges) {
  const l = link();
  if (!l) return;
  try {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = PALETTE.void;
    g.fillRect(0, 0, 64, 64);
    drawGlyph(g, edges, { x: 8, y: 8, size: 48, lineWidth: 4, color: PALETTE.ember, dots: false });
    l.type = 'image/png';
    l.href = c.toDataURL('image/png');
  } catch (e) { /* canvas unavailable: keep the default icon */ }
}

export function resetFavicon() {
  const l = link();
  if (!l) return;
  l.type = 'image/svg+xml';
  l.href = DEFAULT_HREF;
}
