// core/ru.js — Russian typesetting helpers (ARCH §3.1.3, SPEC §2.2). Typography is applied at display time only.
//   thin space U+202F groups thousands · minus U+2212 · NBSP U+00A0 after short prepositions.

const THIN = ' ';
const MINUS = '−';
const NBSP = ' ';

/** plural(n, 'день', 'дня', 'дней'): 1 день, 2 дня, 5 дней, 11 дней, 21 день, 111 дней. Uses |n|, integer part. */
export function plural(n, one, few, many) {
  const a = Math.floor(Math.abs(Number(n) || 0));
  const m10 = a % 10, m100 = a % 100;
  if (m100 >= 11 && m100 <= 14) return many;
  if (m10 === 1) return one;
  if (m10 >= 2 && m10 <= 4) return few;
  return many;
}

function groupDigits(intStr) {
  let out = '';
  for (let i = 0; i < intStr.length; i++) {
    if (i > 0 && (intStr.length - i) % 3 === 0) out += THIN;
    out += intStr[i];
  }
  return out;
}

/** 2400 → "2 400" (U+202F); −1090 → "−1 090" (U+2212); decimals kept as given ("14.03"). */
export function thin(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  const s = String(Math.abs(num));
  const dot = s.indexOf('.');
  const intPart = dot >= 0 ? s.slice(0, dot) : s;
  const frac = dot >= 0 ? s.slice(dot) : '';
  return (num < 0 ? MINUS : '') + groupDigits(intPart) + frac;
}

/** Datum level: 0 → "±0.00", 460 → "+460.00", −1090 → "−1 090.00", 1090 → "+1 090.00". */
export function fmtLevel(alt, decimals = 2) {
  const a = Number(alt) || 0;
  const fixed = Math.abs(a).toFixed(decimals);
  const dot = fixed.indexOf('.');
  const intPart = dot >= 0 ? fixed.slice(0, dot) : fixed;
  const frac = dot >= 0 ? fixed.slice(dot) : '';
  const zero = Number(fixed) === 0;
  const sign = zero ? '±' : a > 0 ? '+' : MINUS;
  return sign + groupDigits(intPart) + frac;
}

const pad2 = (n) => (n < 10 ? '0' : '') + n;

/** 'YYYY-MM-DD' day key or an ISO time → 'dd.mm' | 'dd.mm.yyyy' (ISO times are shown in local time). '' if invalid. */
export function fmtDate(isoOrKey, fmt = 'dd.mm.yyyy') {
  if (isoOrKey == null) return '';
  const s = String(isoOrKey);
  let y, m, d;
  const key = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (key) { y = +key[1]; m = +key[2]; d = +key[3]; } else {
    const t = Date.parse(s);
    if (!Number.isFinite(t)) return '';
    const dt = new Date(t);
    y = dt.getFullYear(); m = dt.getMonth() + 1; d = dt.getDate();
  }
  const dm = `${pad2(d)}.${pad2(m)}`;
  return fmt === 'dd.mm' ? dm : `${dm}.${y}`;
}

// No lookbehind (Safari 15 target): the preceding boundary character is captured and put back. Two passes cover
// adjacent prepositions ("в к …") whose separating space the first match consumed.
const PREP = /(^|[^\p{L}\p{N}])(в|к|с|у|о|на|по|за|до|из|от) /giu;
/** NBSP after в к с у о на по за до из от (case-insensitive, word-bounded). */
export function nbsp(text) {
  if (text == null) return '';
  let s = String(text);
  s = s.replace(PREP, `$1$2${NBSP}`);
  s = s.replace(PREP, `$1$2${NBSP}`);
  return s;
}

/** toLocaleUpperCase('ru') */
export function upper(s) {
  return String(s == null ? '' : s).toLocaleUpperCase('ru');
}
