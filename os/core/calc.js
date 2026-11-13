/* sys.baby OS — core/calc.js
 * СЧЁТ СВЕТОМ · решение D-881 (основатель 11.11.2026, архив «Инструменты
 * стола», plan-dalshe/instrumenty-stola.md, п.2). Чистая арифметика и
 * единицы — без DOM, без сети, без eval/Function: свой разбор выражения.
 * Им пользуются три входа (core/desktools.js): «12 × 7 =» в заметке,
 * набор цифр на столе и клавиши из света.
 *
 * ПРАВИЛА, РАДИ КОТОРЫХ МОДУЛЬ СВОЙ:
 *   · ТОЧНОСТЬ ПО ВИДУ. Двоичная дробь честна для машины, а не для человека:
 *     0.1 + 0.2 считается в числах с плавающей точкой и показывается после
 *     округления до 12 значащих цифр — «0,3», а не «0,30000000000000004».
 *   · ДЕЛЕНИЕ НА НОЛЬ — СЛОВОМ. Не «Infinity», не «NaN», не «ошибка»:
 *     ответ { ok:false, word:"calc.div0" }, слово говорит модуль стола.
 *   · ДВОЕТОЧИЕ — НЕ ДЕЛЕНИЕ. «12:30» в заметке — час (sbNoteHour); делить
 *     можно знаками ÷ и /.
 *   · ЕДИНИЦЫ — «5 миль в км», «5 miles to km», «20 °C в F»: длина, масса,
 *     объём, площадь, скорость, время, температура. Валют нет — курс живёт
 *     в сети, а система наружу не ходит (решение основателя: «не берём»).
 * Охраняется tools/calc-precision-check.mjs (без браузера) и
 * tools/calc-light-check.mjs (три входа живьём). */
(function () {
  "use strict";

  var SIG = 12;   /* ПОСТОЯННАЯ: значащих цифр в ответе — двоичный хвост double начинается дальше 15-й, 12 прячут его с запасом. */
  var MAXLEN = 160;   /* ПОСТОЯННАЯ: длиннее строки калькулятор не разбирает — это уже текст, а не счёт. */

  function langOf(l) { l = l || (typeof window !== "undefined" && typeof window.sbLang === "function" ? window.sbLang() : "en"); return l === "ru" || l === "ee" ? l : "en"; }
  function round(v) { if (!isFinite(v)) return v; if (v === 0) return 0; return Number(v.toPrecision(SIG)); }

  /* ---------- число для глаза ---------- */
  /* ru/ee — запятая, en — точка. Без разделителя тысяч: число из света
     рисуется знаками, и пробел в нём читается как два числа. */
  function format(v, lang, sig) {
    lang = langOf(lang);
    if (typeof v !== "number" || !isFinite(v)) return "";
    v = sig ? Number(v.toPrecision(sig)) : round(v);
    if (Object.is(v, -0)) v = 0;
    var a = Math.abs(v), s;
    /* очень большое и очень малое — «1,5·10¹⁵»: буквы «e» человек на столе не пишет */
    if (a !== 0 && (a >= 1e15 || a < 1e-9)) {
      var ex = v.toExponential(8).split("e"), SUP = { "-": "\u207b", "+": "", "0": "\u2070", "1": "\u00b9", "2": "\u00b2", "3": "\u00b3", "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079" };
      s = ex[0].replace(/\.?0+$/, "") + "\u00b710" + ex[1].split("").map(function (c) { return SUP[c]; }).join("");
    }
    else { s = String(v); if (/e/.test(s)) s = v.toFixed(12).replace(/\.?0+$/, ""); }
    if (lang !== "en") s = s.replace(".", ",");
    /* разряды — узким неразрывным пробелом, начиная с пяти цифр (10 000; 1240 — без пробела) (D-905) */
    s = s.replace(/^(-?)(\d{5,})/, function (m, sg, d) { return sg + d.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); });
    return s.replace("-", "\u2212");
  }

  /* ---------- разбор: лексемы ---------- */
  /* × x х * · — умножить; ÷ / — делить; − – - — минус; ^ — степень; % — процент. */
  var OPS = { "+": "+", "-": "-", "−": "-", "–": "-", "*": "*", "×": "*", "x": "*", "X": "*", "х": "*", "Х": "*", "·": "*", "/": "/", "÷": "/", "^": "^" };
  function lex(src) {
    var s = String(src == null ? "" : src).replace(/[   ]/g, " ").trim(), out = [], i = 0, m;
    if (!s || s.length > MAXLEN) return null;
    while (i < s.length) {
      var c = s[i], rest = s.slice(i);
      if (c === " ") { i++; continue; }
      /* число: 12 · 1,5 · 1.5 · ,5 · 1 000 000 (тройки через пробел) */
      if ((m = rest.match(/^(\d{1,3}(?: \d{3})+(?![\d]))([.,]\d+)?/)) || (m = rest.match(/^(\d+)([.,]\d*)?/)) || (m = rest.match(/^()([.,]\d+)/))) {
        var t = (m[1] || "0").replace(/ /g, "") + (m[2] ? "." + m[2].slice(1) : "");
        out.push({ k: "n", v: parseFloat(t) }); i += m[0].length; continue;
      }
      if (c === "(" || c === ")") { out.push({ k: c }); i++; continue; }
      if (c === "%") { out.push({ k: "%" }); i++; continue; }
      if (OPS[c]) { out.push({ k: "o", v: OPS[c] }); i++; continue; }
      return null;   /* буква, двоеточие, что угодно ещё — не счёт */
    }
    return out;
  }

  /* ---------- разбор: рекурсивный спуск ----------
     expr := term (('+'|'-') term)*        a ± b%  →  a ± a·b/100
     term := power (('*'|'/') power)*
     power:= unary ('^' power)?
     unary:= '-' unary | '+' unary | atom '%'?
     atom := number | '(' expr ')'                                     */
  function parse(tokens) {
    var p = 0, div0 = false;
    function peek() { return tokens[p]; }
    function isOp(v) { var t = peek(); return t && t.k === "o" && t.v === v; }
    function atom() {
      var t = peek(); if (!t) throw 0;
      if (t.k === "n") { p++; return { v: t.v, pct: false }; }
      if (t.k === "(") { p++; var e = expr(); if (!peek() || peek().k !== ")") throw 0; p++; return { v: e, pct: false }; }
      throw 0;
    }
    function unary() {
      if (isOp("-")) { p++; var u = unary(); return { v: -u.v, pct: u.pct }; }
      if (isOp("+")) { p++; return unary(); }
      var a = atom();
      if (peek() && peek().k === "%") { p++; return { v: a.v / 100, pct: true }; }
      return a;
    }
    function power() {
      var b = unary();
      if (isOp("^")) { p++; var e = power(); return { v: Math.pow(b.v, e.v), pct: false }; }
      return b;
    }
    function term() {
      var a = power();
      while (isOp("*") || isOp("/")) {
        var op = peek().v; p++; var b = power();
        if (op === "*") a = { v: a.v * b.v, pct: false };
        else { if (b.v === 0) div0 = true; a = { v: b.v === 0 ? NaN : a.v / b.v, pct: false }; }
      }
      return a;
    }
    function expr() {
      var a = term();
      while (isOp("+") || isOp("-")) {
        var op = peek().v; p++; var b = term();
        /* «200 + 10%» — как у любого калькулятора: двести и ещё десять процентов от двухсот */
        var bv = b.pct ? a.v * b.v : b.v;
        a = { v: op === "+" ? a.v + bv : a.v - bv, pct: false };
      }
      return a.v;
    }
    var v;
    try { v = expr(); } catch (e) { return { bad: true }; }
    if (p !== tokens.length) return { bad: true };
    return { v: v, div0: div0 };
  }

  /* Выражение ли это вообще: хотя бы одно действие между числами
     («12» — число, а не счёт; «−5» — тоже число). */
  function hasAction(tokens) {
    var nums = 0, ops = 0;
    tokens.forEach(function (t, i) { if (t.k === "n") nums++; if ((t.k === "o" && i > 0) || t.k === "%") ops++; });
    return nums >= 1 && ops >= 1 && !(nums === 1 && tokens.length === 2 && tokens[0].k === "o");
  }

  /* evaluate(src) → { ok, value, text } | { ok:false, word } | null (не счёт) */
  function evaluate(src, lang) {
    var tk = lex(src); if (!tk || !tk.length) return null;
    var r = parse(tk); if (r.bad) return null;
    if (r.div0) return { ok: false, word: "calc.div0" };
    if (!isFinite(r.v)) return { ok: false, word: isNaN(r.v) ? "calc.nan" : "calc.huge" };
    var v = round(r.v);
    return { ok: true, value: v, text: format(v, lang), action: hasAction(tk) };
  }

  /* ---------- единицы ---------- */
  /* f — во сколько раз больше основной единицы рода; a — как её называют
     люди (ru — основы с окончаниями, en, ee); s — краткое имя для ответа. */
  var U = [
    /* длина, основа — метр */
    { id: "mm", d: "len", f: 0.001, s: { ru: "мм", en: "mm", ee: "mm" }, a: /^(мм|миллиметр\S*|mm|millimet\S*|millimeet\S*)$/ },
    { id: "cm", d: "len", f: 0.01, s: { ru: "см", en: "cm", ee: "cm" }, a: /^(см|сантиметр\S*|cm|centimet\S*|sentimeet\S*)$/ },
    { id: "m", d: "len", f: 1, s: { ru: "м", en: "m", ee: "m" }, a: /^(м|метр\S*|m|meter|meters|metre|metres|meet\S*)$/ },
    { id: "km", d: "len", f: 1000, s: { ru: "км", en: "km", ee: "km" }, a: /^(км|километр\S*|km|kilomet\S*|kilomeet\S*)$/ },
    { id: "in", d: "len", f: 0.0254, s: { ru: "дюйм.", en: "in", ee: "tolli" }, a: /^(дюйм\S*|in|inch|inches|toll\S*)$/ },
    { id: "ft", d: "len", f: 0.3048, s: { ru: "фут.", en: "ft", ee: "jalga" }, a: /^(фут\S*|ft|foot|feet|jalg\S*)$/ },
    { id: "yd", d: "len", f: 0.9144, s: { ru: "ярд.", en: "yd", ee: "jardi" }, a: /^(ярд\S*|yd|yard|yards|jard\S*)$/ },
    { id: "mi", d: "len", f: 1609.344, s: { ru: "мили", en: "mi", ee: "miili" }, a: /^(мил[ьяиюе]\S*|миль|mi|mile|miles|miil\S*)$/ },
    { id: "nmi", d: "len", f: 1852, s: { ru: "мор. мили", en: "nmi", ee: "meremiili" }, a: /^(морск\S*\s?мил\S*|nmi|nautical\s?miles?|meremiil\S*)$/ },
    /* масса, основа — килограмм */
    { id: "mg", d: "mass", f: 1e-6, s: { ru: "мг", en: "mg", ee: "mg" }, a: /^(мг|миллиграмм\S*|mg|milligram\S*|milligramm\S*)$/ },
    { id: "g", d: "mass", f: 0.001, s: { ru: "г", en: "g", ee: "g" }, a: /^(г|гр|грамм\S*|g|gram|grams|gramm\S*)$/ },
    { id: "kg", d: "mass", f: 1, s: { ru: "кг", en: "kg", ee: "kg" }, a: /^(кг|килограмм\S*|kg|kilogram\S*|kilogramm\S*|kilo)$/ },
    { id: "t", d: "mass", f: 1000, s: { ru: "т", en: "t", ee: "t" }, a: /^(т|тонн\S*|t|tonne|tonnes|ton|tons|tonn\S*)$/ },
    { id: "oz", d: "mass", f: 0.028349523125, s: { ru: "унц.", en: "oz", ee: "untsi" }, a: /^(унци\S*|унц\S*|oz|ounce|ounces|unts\S*)$/ },
    { id: "lb", d: "mass", f: 0.45359237, s: { ru: "фунт.", en: "lb", ee: "naela" }, a: /^(фунт\S*|lb|lbs|pound|pounds|nael\S*)$/ },
    /* объём, основа — литр */
    { id: "ml", d: "vol", f: 0.001, s: { ru: "мл", en: "ml", ee: "ml" }, a: /^(мл|миллилитр\S*|ml|millilit\S*|milliliit\S*)$/ },
    { id: "l", d: "vol", f: 1, s: { ru: "л", en: "l", ee: "l" }, a: /^(л|литр\S*|l|liter|liters|litre|litres|liit\S*)$/ },
    { id: "gal", d: "vol", f: 3.785411784, s: { ru: "галл.", en: "gal", ee: "gallonit" }, a: /^(галлон\S*|gal|gallon|gallons|gallon|gallonit|gallonites)$/ },
    { id: "floz", d: "vol", f: 0.0295735295625, s: { ru: "жидк. унц.", en: "fl oz", ee: "vedelikuuntsi" }, a: /^(fl\.?\s?oz|жидк\S*\s?унц\S*)$/ },
    /* площадь, основа — квадратный метр */
    { id: "m2", d: "area", f: 1, s: { ru: "м²", en: "m²", ee: "m²" }, a: /^(м2|м²|кв\.?\s?м|m2|m²|sq\.?\s?m|ruutmeet\S*)$/ },
    { id: "km2", d: "area", f: 1e6, s: { ru: "км²", en: "km²", ee: "km²" }, a: /^(км2|км²|кв\.?\s?км|km2|km²|sq\.?\s?km|ruutkilomeet\S*)$/ },
    { id: "ha", d: "area", f: 1e4, s: { ru: "га", en: "ha", ee: "ha" }, a: /^(га|гектар\S*|ha|hectare|hectares|hektar\S*)$/ },
    { id: "sotka", d: "area", f: 100, s: { ru: "сот.", en: "ares", ee: "aari" }, a: /^(сотк\S*|сот|ар|are|ares|aar|aari|aarides)$/ },
    { id: "acre", d: "area", f: 4046.8564224, s: { ru: "акр.", en: "acres", ee: "aakrit" }, a: /^(акр\S*|acre|acres|aaker|aakrit|aakrites)$/ },
    /* скорость, основа — метр в секунду */
    { id: "kmh", d: "speed", f: 1 / 3.6, s: { ru: "км/ч", en: "km/h", ee: "km/h" }, a: /^(км\/ч|кмч|km\/h|kmh|kph)$/ },
    { id: "mph", d: "speed", f: 0.44704, s: { ru: "миль/ч", en: "mph", ee: "mph" }, a: /^(миль\/ч|mph|mi\/h)$/ },
    { id: "ms", d: "speed", f: 1, s: { ru: "м/с", en: "m/s", ee: "m/s" }, a: /^(м\/с|m\/s)$/ },
    { id: "kn", d: "speed", f: 1852 / 3600, s: { ru: "уз.", en: "kn", ee: "sõlme" }, a: /^(узл\S*|узел|уз|kn|knot|knots|sõlm|sõlme|sõlmedes)$/ },
    /* время, основа — секунда */
    { id: "s", d: "time", f: 1, s: { ru: "с", en: "s", ee: "s" }, a: /^(с|сек|секунд\S*|s|sec|second|seconds|sekund\S*)$/ },
    { id: "min", d: "time", f: 60, s: { ru: "мин", en: "min", ee: "min" }, a: /^(мин|минут\S*|min|minute|minutes|minut\S*)$/ },
    { id: "h", d: "time", f: 3600, s: { ru: "ч", en: "h", ee: "t" }, a: /^(ч|час|часа|часов|часах|h|hr|hour|hours|tund\S*)$/ },
    { id: "day", d: "time", f: 86400, s: { ru: "дн.", en: "days", ee: "päeva" }, a: /^(день|дня|дней|днях|сут\S*|d|day|days|päev\S*)$/ },
    { id: "wk", d: "time", f: 604800, s: { ru: "нед.", en: "weeks", ee: "nädalat" }, a: /^(недел\S*|wk|week|weeks|nädal\S*)$/ },
    /* температура: свой счёт, не множитель */
    { id: "C", d: "temp", s: { ru: "°C", en: "°C", ee: "°C" }, a: /^(°?c|°?с|цельси\S*|celsius|градус\S*\s?цельси\S*|celsiuse\S*)$/ },
    { id: "F", d: "temp", s: { ru: "°F", en: "°F", ee: "°F" }, a: /^(°?f|°?ф|фаренгейт\S*|fahrenheit|fahrenheiti\S*)$/ },
    { id: "K", d: "temp", s: { ru: "K", en: "K", ee: "K" }, a: /^(k|к|кельвин\S*|kelvin\S*)$/ }
  ];
  function unitOf(word) {
    var w = String(word || "").toLowerCase().replace(/[.,;!?]+$/, "").replace(/\s+/g, " ").trim();
    if (!w) return null;
    for (var i = 0; i < U.length; i++) if (U[i].a.test(w)) return U[i];
    return null;
  }
  function toBase(u, v) { if (u.d !== "temp") return v * u.f; return u.id === "C" ? v : u.id === "F" ? (v - 32) * 5 / 9 : v - 273.15; }
  function fromBase(u, v) { if (u.d !== "temp") return v / u.f; return u.id === "C" ? v : u.id === "F" ? v * 9 / 5 + 32 : v + 273.15; }

  /* «5 миль в км» · «5 miles to km» · «5,5 kg in lb» · «20°C в F» · «5 miili → km» */
  var CONV = /^\s*([−\-]?\s*\d[\d\s]*(?:[.,]\d+)?)\s*(.+?)\s+(?:в|во|to|in|into|→|->|=>)\s+(.+?)\s*$/i;
  function convert(src, lang) {
    lang = langOf(lang);
    var s = String(src == null ? "" : src).replace(/[   ]/g, " ");
    if (s.length > MAXLEN) return null;
    /* эстонский говорит падежом, без «в»: «5 miili kilomeetrites», «10 kg naeltes» */
    var m = s.match(CONV) || s.match(/^\s*([\u2212\-]?\s*\d[\d\s]*(?:[.,]\d+)?)\s*(.+?)\s+(\S+(?:tes|des|teks|deks))\s*$/i); if (!m) return null;
    var num = parseFloat(m[1].replace(/[\s]/g, "").replace("−", "-").replace(",", "."));
    var a = unitOf(m[2]), b = unitOf(m[3]);
    if (!isFinite(num) || !a || !b) return null;
    if (a.d !== b.d) return { ok: false, word: "calc.unitsApart" };
    var v = fromBase(b, toBase(a, num));
    var shown = Number(v.toPrecision(6));
    /* ОТКАТ: у единицы нет подписи на языке человека — подпись по-английски (единица справочника), а не пустое место после числа. */
    return { ok: true, value: shown, unit: b.s[lang] || b.s.en, from: a.s[lang] || a.s.en, text: format(shown, lang, 6) + " " + (b.s[lang] || b.s.en) };
  }

  /* ---------- проценты и даты словами (D-897) ----------
     «15% от 80» = 12 · «сколько процентов 12 от 80» = 15 % · «1240 / 3 на троих»,
     «1240 на троих» = 413,33 · «через 45 дней» — какой это день · «какой день
     25.12» — день недели и сколько до него · «сколько дней до 25.12».
     Тот же разбор без eval: фраза узнаётся шаблоном, числа — evaluate(). */
  var NUM = "([\\u2212\\-]?\\d[\\d ]*(?:[.,]\\d+)?)";
  function num(t) { return parseFloat(String(t).replace(/ /g, "").replace("\u2212", "-").replace(",", ".")); }
  var PEOPLE = { "двоих": 2, "троих": 3, "четверых": 4, "пятерых": 5, "шестерых": 6, "семерых": 7, "восьмерых": 8, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6 };
  var MON = [/^(январ|jan|jaan)/, /^(феврал|feb|veeb)/, /^(март|mar|märts)/, /^(апрел|apr|aprill)/, /^(ма[йя]|may|mai)/, /^(июн|jun|juun)/, /^(июл|jul|juul)/, /^(август|aug)/, /^(сентябр|sep)/, /^(октябр|oct|okt)/, /^(ноябр|nov)/, /^(декабр|dec|dets)/];
  function locOf(lang) { return lang === "ru" ? "ru-RU" : lang === "ee" ? "et-EE" : "en-GB"; }
  function day0(ms) { var d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function daysWord(n, lang) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (lang === "ru") return a > 10 && a < 20 ? "дней" : b === 1 ? "день" : b >= 2 && b <= 4 ? "дня" : "дней";
    if (lang === "ee") return Math.abs(n) === 1 ? "päev" : "päeva";
    return Math.abs(n) === 1 ? "day" : "days";
  }
  function dateText(ms, lang, nowAt) {
    var d = new Date(ms), o = { weekday: "long", day: "numeric", month: "long" };
    if (d.getFullYear() !== new Date(nowAt).getFullYear()) o.year = "numeric";
    try { return d.toLocaleDateString(locOf(lang), o); } catch (e) { return d.toDateString(); }
  }
  /* «25.12», «25.12.2027», «25 декабря», «Dec 25» — ближайший не прошедший день */
  function parseDay(t, nowAt) {
    var s = String(t || "").trim().toLowerCase().replace(/[?.!]+$/, ""), m, y = null, mo, d;
    if ((m = s.match(/^(\d{1,2})[.\/](\d{1,2})(?:[.\/](\d{2,4}))?$/))) { d = +m[1]; mo = +m[2] - 1; if (m[3]) y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; }
    else if ((m = s.match(/^(\d{1,2})\.?\s+([a-zа-яёõäöü]+)(?:\s+(\d{4}))?$/)) || (m = s.match(/^([a-z]+)\s+(\d{1,2})(?:,?\s+(\d{4}))?$/))) {
      var word = /^\d/.test(m[1]) ? m[2] : m[1]; d = +(/^\d/.test(m[1]) ? m[1] : m[2]); mo = -1;
      for (var i = 0; i < 12; i++) if (MON[i].test(word)) { mo = i; break; }
      if (mo < 0) return null; if (m[3]) y = +m[3];
    } else return null;
    if (mo < 0 || mo > 11 || d < 1 || d > 31) return null;
    var t0 = day0(nowAt), yy = y || new Date(nowAt).getFullYear(), at = new Date(yy, mo, d).getTime();
    if (new Date(at).getDate() !== d) return null;   /* 31.02 не существует */
    if (!y && at < t0) at = new Date(yy + 1, mo, d).getTime();
    return at;
  }
  function phrase(src, lang, nowAt) {
    lang = langOf(lang); nowAt = typeof nowAt === "number" ? nowAt : Date.now();
    var s = String(src == null ? "" : src).replace(/[\u00a0\u2009\u202f]/g, " ").replace(/\s+/g, " ").trim().replace(/[?]$/, "").trim(), m, v, low = s.toLowerCase();
    if (!s || s.length > MAXLEN) return null;
    /* процент от числа */
    if ((m = low.match(new RegExp("^" + NUM + "\\s*%\\s*(?:от|из|of|from)\\s+" + NUM + "$"))) || (m = low.match(new RegExp("^" + NUM + "\\s*%\\s+" + NUM + "-?(?:st|lt)$")))) {
      v = round(num(m[1]) * num(m[2]) / 100); return { ok: true, value: v, text: format(v, lang), kind: "pct" };
    }
    /* сколько это процентов */
    if ((m = low.match(new RegExp("^(?:сколько процентов\\s+)?" + NUM + "\\s+(?:от|из)\\s+" + NUM + "(?:\\s+в\\s*(?:процентах|%))?$"))) && (/^сколько/.test(low) || /в\s*(процентах|%)$/.test(low)) ||
        (m = low.match(new RegExp("^(?:what percent(?: is)?\\s+)?" + NUM + "\\s+of\\s+" + NUM + "(?:\\s+in percent)?$"))) && (/^what/.test(low) || /in percent$/.test(low))) {
      if (num(m[2]) === 0) return { ok: false, word: "calc.div0" };
      v = round(num(m[1]) / num(m[2]) * 100); return { ok: true, value: v, unit: "%", text: format(v, lang) + " %", kind: "pctOf" };
    }
    /* поровну: «1240 на троих», «1240 / 3 на троих», «90 for 4», «90 3 peale» */
    if ((m = s.match(/^(.+?)\s+(?:на|for|between)\s+(двоих|троих|четверых|пятерых|шестерых|семерых|восьмерых|two|three|four|five|six|\d+)(?:\s+(?:человек|people|persons))?$/i)) || (m = s.match(/^(.+?)\s+(\d+)\s+peale$/i))) {
      var n = PEOPLE[m[2].toLowerCase()] || parseInt(m[2], 10), inner = evaluate(m[1], lang);
      if (!inner || !n) return null;
      if (!inner.ok) return inner;
      v = /[\/\u00f7]/.test(m[1]) ? inner.value : round(inner.value / n);
      return { ok: true, value: v, text: format(Number(v.toFixed(2)), lang), kind: "split" };
    }
    /* через N дней / недель / месяцев */
    if ((m = low.match(/^(?:через|in)\s+(\d{1,4})\s+(дн\S*|день|сут\S*|недел\S*|месяц\S*|days?|weeks?|months?)$/)) || (m = low.match(/^(\d{1,4})\s+(päeva|nädala|kuu)\s+pärast$/))) {
      var k = +m[1], u = m[2], d0 = new Date(day0(nowAt));
      if (/^(недел|week|nädal)/.test(u)) d0.setDate(d0.getDate() + 7 * k);
      else if (/^(месяц|month|kuu)/.test(u)) d0.setMonth(d0.getMonth() + k);
      else d0.setDate(d0.getDate() + k);
      return { ok: true, at: d0.getTime(), text: dateText(d0.getTime(), lang, nowAt), kind: "date" };
    }
    /* какой день 25.12 · what day is 25.12 · mis päev on 25.12 */
    if ((m = low.match(/^(?:какой день(?: недели)?|what day(?: is)?|mis päev(?: on)?)\s+(.+)$/))) {
      var at = parseDay(m[1], nowAt); if (at == null) return null;
      var dd = Math.round((at - day0(nowAt)) / 86400000);
      return { ok: true, at: at, days: dd, text: dateText(at, lang, nowAt) + (dd > 0 ? " \u00b7 " + (lang === "ru" ? "через " + dd + " " + daysWord(dd, lang) : lang === "ee" ? dd + " " + daysWord(dd, lang) + " pärast" : "in " + dd + " " + daysWord(dd, lang)) : ""), kind: "weekday" };
    }
    /* сколько дней до 25.12 · days until 25.12 */
    if ((m = low.match(/^(?:сколько\s+)?дней\s+до\s+(.+)$/)) || (m = low.match(/^(?:how many\s+)?days\s+(?:until|till|to)\s+(.+)$/))) {
      var at2 = parseDay(m[1], nowAt); if (at2 == null) return null;
      v = Math.round((at2 - day0(nowAt)) / 86400000);
      return { ok: true, value: v, unit: daysWord(v, lang), text: v + " " + daysWord(v, lang), kind: "days" };
    }
    return null;
  }

  /* answer(src) — то, что сказать на «… =»: сначала единицы, потом фразы, потом счёт. */
  function answer(src, lang, nowAt) {
    var c = convert(src, lang); if (c) return c;
    var ph = phrase(src, lang, nowAt); if (ph) return ph;
    var e = evaluate(src, lang);
    if (e && e.ok && !e.action) return null;   /* «12 =» — не счёт */
    return e;
  }

  /* Строка заметки, кончающаяся «=» (D-903): считается, ТОЛЬКО если всё до знака —
     чистое выражение (цифры, знаки, единицы, проценты и даты словами). «купить 3 × 4 =»,
     «итог =», «a = b» — текст человека, их не трогаем. Возвращает { expr, res } | null. */
  function lineAnswer(line, lang, nowAt) {
    var s = String(line == null ? "" : line);
    if (!/=\s*$/.test(s)) return null;
    var body = s.replace(/=\s*$/, "").trim();
    if (!body || /=/.test(body) || !/\d/.test(body)) return null;
    var r = answer(body, lang, nowAt);
    return r ? { expr: body, res: r } : null;
  }

  var api = { evaluate: evaluate, convert: convert, phrase: phrase, answer: answer, lineAnswer: lineAnswer, format: format, unitOf: function (w) { var u = unitOf(w); return u ? u.id : null; } };
  if (typeof window !== "undefined") window.sbCalc = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
