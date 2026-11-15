/* sys.baby — СМАЙЛИКИ «ПЕРЛАМУТР» · решения D-590 (рисунок, основатель 01–02.11.2026)
 * и D-940…D-945 (ЕДИНАЯ СИСТЕМА, архив «Смайлики», основатель 12.11.2026).
 *
 * Восемь чувств — замочек-перламутр с лицом: радость, смех, люблю, ого,
 * грусть, хм, подмиг, спокойно. Каждое двигается по-своему; при снятом
 * движении — неподвижно (подмиг в покое — с закрытым правым глазом).
 *
 * ПОВОД ЕДИНОЙ СИСТЕМЫ — видео основателя 12.11: смайлик был нашим только в
 * покое; стоило начать писать — в поле стояли жёлтые эмодзи телефона; при
 * вставке рядом с текстом вырастала огромная копия; меню закрывалось само.
 *
 * ЗНАК (D-940, D-946, D-947). Смайлик в записи — ОДНА БУКВА. Маленький Перламутр —
 * сам эмодзи своего чувства (😊 😂 😍 😮 😢 🤔 😉 😌), и знак с клавиатуры телефона
 * тоже наш. Другой набор или размер — своя буква частной зоны U+E900…E9FF
 * (64·размер + 8·набор + чувство). Буква одна: курсор не встаёт внутрь, «стереть»
 * стирает целиком, выделение и отмена — родные, клавиатура телефона (IME,
 * автозамена) не видит ничего особенного. Наружу (копия, «Передать», файл) уходит
 * обычный эмодзи-аналог, внутри системы буква возвращается целиком.
 * ПОЧЕМУ НЕ contenteditable: атомарные узлы в нём ломают набор на Android
 * (композиция вокруг узла, прыжки курсора, отмена). ПОЧЕМУ НЕ эмодзи + невидимый
 * селектор: Chromium отрезает селектор от эмодзи, и набор и размер в поле
 * рисовались маленьким Перламутром (проверено замером, 12.11).
 *
 * ВИД (D-941). Видом знака управляет шрифт. У системы свой цветной шрифт
 * «SB Smile» (core/smiles-font.css, рисунок — этот канон, слои сплошного
 * цвета) — первым в каждом стеке шрифтов: поле при наборе, список, поиск,
 * имя, названия файлов и стопок, холст голоса рисуют НАШ перламутр, а не
 * эмодзи телефона. Ширина буквы 1.05em — та же мерка у живого слоя.
 *
 * КРУПНЫЙ — БОЛЬШАЯ БУКВА В СТРОКЕ (D-1151, видео основателя 13.11, 12:05). Смайлик любого
 * размера стоит где угодно: рядом с другим любым, рядом с текстом, в одной строке; строка
 * растёт под самый высокий. Так устроено: у «SB Smile» четыре грани по размерам со своими
 * вертикальными мерками, а поле пишется с line-height: normal и невидимой гранью-опорой
 * (strut, FontFace с ascent/descent-override), которая держит обычную строку ровно той же
 * высоты, что и прежде (--lh-read). Курсор, стрелки и «стереть» — родные: смайлик — одна
 * буква, касание по левой половине ставит курсор перед ним, по правой — за ним.
 * ОТКАТ: крупный в своей строке с пустыми строками над ним (D-950) — крупные не вставали
 * рядом, налезали друг на друга, слева от смайлика курсор не ставился (видео 13.11).
 *
 * ЖИВОЙ СЛОЙ (D-942). Там, где текст показывается (render) и поверх поля в
 * покое (field), рисунок живой: svg лежит на якоре у базовой линии ровно
 * поверх буквы (left −0.1em, bottom −0.245em, сторона 1.25em) и не меняет
 * строку — поэтому живой вид и поле совпадают до точки, и копии «вне текста»
 * больше нет. Крупный лежит так же — на месте своей крупной буквы.
 *
 * ОДНО МЕНЮ, ОДНА ВСТАВКА (D-943). sbSmiles.menu — одно на систему; у любого
 * поля ввода при фокусе — знак-смайлик (кнопка у поля); касание меню не
 * забирает фокус у поля (клавиатура не падает, меню не закрывается само);
 * вставка — sbSmiles.insert: execCommand("insertText") — с родной отменой.
 * Коротко — выбранным размером, долго — средним. Набор выбирают ПОД ОДЕЯЛОМ
 * (D-948, apps/smiles-blanket), «недавние» — в памяти страницы.
 *
 * ИМЯ (D-945). Экранный чтец слышит имя чувства («радость»), голос и копия
 * «текстом» — тоже (sbSmiles.plain(text, "name") → «:радость:»).
 *
 * Модуль ничего не хранит и никуда не ходит: рисует SVG из своих формул.
 * Стерегут tools/smiles-check.mjs, tools/smiles-one-check.mjs, tools/smiles-font-check.mjs.
 */
(function () {
  "use strict";
  /* где лежит сам этот файл: от него — свои файлы (грань-опора), с какой бы страницы его ни взяли */
  var SRC0 = document.currentScript && document.currentScript.src || "";
  if (window.sbSmiles) return;
  /* Грани шрифта «SB Smile» (D-1151 — четыре по размерам; D-1290 — свои файлы с того же адреса; D-1293) — здесь,
     а не @font-face в smiles-font.css: так же, как грани голоса (voice.js). Адреса берутся у
     link rel="sb-precache" data-smile-face в index.html (их же читает опись офлайна), Ковчег подменяет их
     data:-адресами — и файл без сети пишет знак тем же шрифтом. unicode-range — ровно FACES_UR генератора
     tools/smiles-font.mjs (сверяет tools/smiles-font-check.mjs). Ставятся сразу, до первого смайлика. */
  var SMILE_FACES = { s: "U+1F602, U+1F609, U+1F60A, U+1F60C, U+1F60D, U+1F622, U+1F62E, U+1F914, U+FE00-FE0F, U+E900-E93F", m: "U+E940-E97F", l: "U+E980-E9BF", h: "U+E9C0-E9FF" };
  if (window.FontFace && document.fonts && document.fonts.add && document.querySelectorAll) {
    Array.prototype.forEach.call(document.querySelectorAll('link[rel="sb-precache"][data-smile-face]'), function (l) {
      var k = l.getAttribute("data-smile-face");
      if (!SMILE_FACES[k]) return;
      try { document.fonts.add(new FontFace("SB Smile", 'url("' + l.href + '") format("woff2")', { display: "block", unicodeRange: SMILE_FACES[k] })); }
      catch (e) { /* грань не встала — знак пишется следующим шрифтом стека */ }
    });
  }
  var LIST = [
    { e: "happy", ch: "\uD83D\uDE0A" }, { e: "laugh", ch: "\uD83D\uDE02" }, { e: "love", ch: "\uD83D\uDE0D" }, { e: "wow", ch: "\uD83D\uDE2E" },
    { e: "sad", ch: "\uD83D\uDE22" }, { e: "think", ch: "\uD83E\uDD14" }, { e: "wink", ch: "\uD83D\uDE09" }, { e: "calm", ch: "\uD83D\uDE0C" }
  ];
  var BY_CH = {}, IDX = {};
  LIST.forEach(function (x, i) { BY_CH[x.ch] = x.e; IDX[x.e] = i; });
  /* Имена чувств — для чтеца, голоса и копии текстом (D-945). Словарь свой:
     модуль живёт и без таблицы строк. RU — без латиницы, ET — без кириллицы. */
  var NAMES = {
    ru: { happy: "радость", laugh: "смех", love: "люблю", wow: "ого", sad: "грусть", think: "хм", wink: "подмиг", calm: "спокойно" },
    en: { happy: "joy", laugh: "laughter", love: "love", wow: "wow", sad: "sadness", think: "hmm", wink: "wink", calm: "calm" },
    ee: { happy: "rõõm", laugh: "naer", love: "armastus", wow: "vau", sad: "kurbus", think: "hmm", wink: "silmapilgutus", calm: "rahu" }
  };
  var WORDS = {
    ru: { menu: "смайлики", key: "смайлик", recent: "недавние", sets: "наборы", size: "размер", blanket: "под одеялом — все наборы", hint: "размер — снизу; долго — средний" },
    en: { menu: "smileys", key: "smiley", recent: "recent", sets: "sets", size: "size", blanket: "under the blanket — all sets", hint: "size — below; hold — medium" },
    ee: { menu: "emotikonid", key: "emotikon", recent: "hiljutised", sets: "komplektid", size: "suurus", blanket: "teki all — kõik komplektid", hint: "suurus — all; kauem — keskmine" }
  };
  function lang() {
    var l = "en";
    try { l = typeof window.sbLang === "function" ? String(window.sbLang()) : (document.documentElement.lang || "en"); } catch (e) { /* без таблицы строк — английский */ }
    l = l.toLowerCase().slice(0, 2);
    return l === "et" ? "ee" : (NAMES[l] ? l : "en");
  }
  function word(k) { var l = lang(); return (WORDS[l] && WORDS[l][k]) || WORDS.en[k]; }
  function nameOf(e) { var l = lang(); return (NAMES[l] && NAMES[l][e]) || NAMES.en[e] || e; }
  var CSS = `svg.sb-sm[data-e]{--a:1;--s:1}\nsvg.sb-sm[data-e] .all,svg.sb-sm[data-e] .sh,svg.sb-sm[data-e] .shd,svg.sb-sm[data-e] .fx *{transform-box:view-box}\nsvg.sb-sm[data-e] .all{transform-origin:50px 94px} svg.sb-sm[data-e] .sh{transform-origin:50px 46px} svg.sb-sm[data-e] .shd{transform-origin:50px 95px}\nsvg.sb-sm[data-e] .eye,svg.sb-sm[data-e] .mouth,svg.sb-sm[data-e] .blush,svg.sb-sm[data-e] .brows,svg.sb-sm[data-e] .brow,svg.sb-sm[data-e] .eyes,svg.sb-sm[data-e] .open,svg.sb-sm[data-e] .shut,svg.sb-sm[data-e] .face{transform-box:fill-box;transform-origin:center}\nsvg.sb-sm[data-e] .mouth{transform-origin:50% 0}\nsvg.sb-sm[data-e] .bd,svg.sb-sm[data-e] .sh{animation:sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-pearl{0%,100%{filter:hue-rotate(0)}50%{filter:hue-rotate(18deg)}}\n/* радость */\n .sb-sm[data-e=happy] .all{animation:sbe-hop 2.6s cubic-bezier(.3,.7,.4,1) infinite}\n .sb-sm[data-e=happy] .shd{animation:sbe-shd 2.6s cubic-bezier(.3,.7,.4,1) infinite}\n@keyframes sbe-hop{0%,58%,100%{transform:none}66%{transform:translateY(calc(var(--a)*1px)) scale(calc(1 + var(--s)*.05),calc(1 - var(--s)*.05))}76%{transform:translateY(calc(var(--a)*-7px)) scale(calc(1 - var(--s)*.03),calc(1 + var(--s)*.03))}86%{transform:scale(calc(1 + var(--s)*.04),calc(1 - var(--s)*.04))}93%{transform:none}}\n@keyframes sbe-shd{0%,58%,100%{transform:none;opacity:.3}76%{transform:scale(.8);opacity:.18}}\n .sb-sm[data-e=happy] .eye{animation:sbe-blink 2.6s infinite}\n@keyframes sbe-blink{0%,38%,46%,100%{transform:none}42%{transform:scaleY(.08)}}\n .sb-sm[data-e=happy] .mouth{animation:sbe-grin 2.6s infinite}\n@keyframes sbe-grin{0%,60%,100%{transform:none}76%{transform:scale(calc(1 + var(--s)*.25),calc(1 + var(--s)*.15))}}\n/* смех */\n .sb-sm[data-e=laugh] .all{animation:sbe-jig 1.9s ease-in-out infinite}\n .sb-sm[data-e=laugh] .sh{animation:sbe-throw 1.9s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-jig{0%,40%,100%{transform:none}48%{transform:rotate(calc(var(--a)*-3deg))}56%{transform:rotate(calc(var(--a)*3deg))}64%{transform:rotate(calc(var(--a)*-2.5deg))}72%{transform:rotate(calc(var(--a)*2deg))}80%{transform:none}}\n@keyframes sbe-throw{0%,40%,100%{transform:none}50%{transform:rotate(calc(var(--a)*-9deg)) translateY(-2px)}60%{transform:rotate(calc(var(--a)*-3deg))}70%{transform:rotate(calc(var(--a)*-9deg)) translateY(-2px)}82%{transform:none}}\n .sb-sm[data-e=laugh] .mouth{animation:sbe-haha 1.9s infinite}\n@keyframes sbe-haha{0%,40%,100%{transform:none}48%,64%{transform:scaleY(.5)}56%,72%{transform:scaleY(1.18)}80%{transform:none}}\n .sb-sm[data-e=laugh] .eyes{animation:sbe-squint 1.9s infinite}\n@keyframes sbe-squint{0%,40%,100%{transform:none}48%,72%{transform:translateY(calc(var(--a)*-1px)) scaleY(1.2)}60%{transform:translateY(.5px)}}\n .sb-sm[data-e=laugh] .blush, .sb-sm[data-e=love] .blush{animation:sbe-glow 1.9s infinite}\n@keyframes sbe-glow{0%,40%,100%{transform:none}60%{transform:scale(1.3)}}\n/* люблю */\n .sb-sm[data-e=love] .sh{animation:sbe-beat 1.6s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite;transform-origin:50px 30px}\n@keyframes sbe-beat{0%,60%,100%{transform:none}10%{transform:scale(calc(1 + var(--s)*.14))}22%{transform:scale(.98)}32%{transform:scale(calc(1 + var(--s)*.1))}44%{transform:none}}\n .sb-sm[data-e=love] .eye{animation:sbe-beatE 1.6s infinite}\n@keyframes sbe-beatE{0%,60%,100%{transform:none}10%{transform:scale(calc(1 + var(--s)*.3))}22%{transform:scale(.95)}32%{transform:scale(calc(1 + var(--s)*.22))}44%{transform:none}}\n .sb-sm[data-e=love] .hf{animation:sbe-fly 3.2s ease-out infinite;transform-origin:78px 37px}\n@keyframes sbe-fly{0%,20%{opacity:0;transform:translate(0,4px) scale(.6)}35%{opacity:1}100%{opacity:0;transform:translate(6px,-22px) scale(1.1)}}\n/* ого */\n .sb-sm[data-e=wow] .sh{animation:sbe-pop 2.4s cubic-bezier(.2,1.6,.4,1) infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=wow] .all{animation:sbe-stretch 2.4s ease-out infinite}\n@keyframes sbe-pop{0%,55%,100%{transform:none}63%{transform:translateY(calc(var(--a)*-8px))}75%{transform:translateY(calc(var(--a)*-2px))}85%{transform:none}}\n@keyframes sbe-stretch{0%,55%,100%{transform:none}61%{transform:scale(calc(1 - var(--s)*.04),calc(1 + var(--s)*.05))}72%{transform:none}}\n .sb-sm[data-e=wow] .eye{animation:sbe-wide 2.4s cubic-bezier(.2,1.6,.4,1) infinite}\n@keyframes sbe-wide{0%,55%,100%{transform:none}63%{transform:scale(calc(1 + var(--s)*.35))}80%{transform:scale(1.1)}92%{transform:none}}\n .sb-sm[data-e=wow] .brows{animation:sbe-raise 2.4s cubic-bezier(.2,1.6,.4,1) infinite}\n@keyframes sbe-raise{0%,55%,100%{transform:none}63%{transform:translateY(calc(var(--a)*-2.5px))}88%{transform:none}}\n .sb-sm[data-e=wow] .mouth{animation:sbe-oh 2.4s cubic-bezier(.2,1.6,.4,1) infinite;transform-origin:center}\n@keyframes sbe-oh{0%,55%,100%{transform:none}63%{transform:scale(calc(1 + var(--s)*.45))}85%{transform:none}}\n/* грусть */\n .sb-sm[data-e=sad] .sh{animation:sbe-droop 4.5s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=sad] .all{animation:sbe-sink 4.5s ease-in-out infinite}\n@keyframes sbe-droop{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*2px)) scaleY(calc(1 - var(--a)*.12))}}\n@keyframes sbe-sink{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*1.5px))}}\n .sb-sm[data-e=sad] .eyes{animation:sbe-down 4.5s ease-in-out infinite}\n@keyframes sbe-down{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*1.6px))}}\n .sb-sm[data-e=sad] .eye{animation:sbe-slowblink 4.5s infinite}\n@keyframes sbe-slowblink{0%,66%,80%,100%{transform:none}73%{transform:scaleY(.12)}}\n .sb-sm[data-e=sad] .mouth{animation:sbe-wobble 4.5s ease-in-out infinite;transform-origin:center}\n@keyframes sbe-wobble{0%,100%{transform:none}45%{transform:scaleX(.86) translateY(.6px)}55%{transform:scaleX(.92)}}\n .sb-sm[data-e=sad] .drop{animation:sbe-tear 4.5s ease-in infinite}\n@keyframes sbe-tear{0%,30%{opacity:0;transform:none}40%{opacity:1}85%{opacity:.9;transform:translateY(16px)}100%{opacity:0;transform:translateY(20px)}}\n/* хм */\n .sb-sm[data-e=think] .sh{animation:sbe-ponder 3.4s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-ponder{0%,100%{transform:rotate(calc(var(--a)*-7deg))}50%{transform:rotate(calc(var(--a)*7deg))}}\n .sb-sm[data-e=think] .eyes{animation:sbe-look 3.4s ease-in-out infinite}\n@keyframes sbe-look{0%,100%{transform:translate(calc(var(--a)*-1.6px),-1px)}50%{transform:translate(calc(var(--a)*1.6px),-1.6px)}}\n .sb-sm[data-e=think] .brow{animation:sbe-bob 3.4s ease-in-out infinite}\n@keyframes sbe-bob{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*-1.6px))}}\n .sb-sm[data-e=think] .mouth{animation:sbe-hmm 3.4s ease-in-out infinite}\n@keyframes sbe-hmm{0%,100%{transform:translateX(calc(var(--a)*-1.2px))}50%{transform:translateX(calc(var(--a)*1.2px)) rotate(-4deg)}}\n .sb-sm[data-e=think] .fx circle{animation:sbe-bub 3.4s ease-out infinite;opacity:0}\n .sb-sm[data-e=think] .b2{animation-delay:.35s!important} .sb-sm[data-e=think] .b3{animation-delay:.7s!important}\n@keyframes sbe-bub{0%{opacity:0;transform:translateY(3px)}20%{opacity:.75}70%{opacity:.75}100%{opacity:0;transform:translateY(-3px)}}\n/* подмиг — в покое правый глаз закрыт; в движении: открыт → подмигивает */\n .sb-sm[data-e=wink] .open{opacity:0}  .sb-sm[data-e=wink] .shut{opacity:1}\n .sb-sm[data-e=wink] .sh{animation:sbe-lid 2.8s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=wink] .all{animation:sbe-lean 2.8s ease-in-out infinite}\n@keyframes sbe-lid{0%,62%,100%{transform:none}70%{transform:scaleY(.45) translateY(6px)}80%{transform:none}}\n@keyframes sbe-lean{0%,60%,100%{transform:none}70%{transform:rotate(calc(var(--a)*4deg))}84%{transform:none}}\n .sb-sm[data-e=wink] .open{animation:sbe-open 2.8s infinite} .sb-sm[data-e=wink] .shut{animation:sbe-shut 2.8s infinite}\n@keyframes sbe-open{0%,62%,82%,100%{opacity:1;transform:none}66%,78%{opacity:0;transform:scaleY(.1)}}\n@keyframes sbe-shut{0%,62%,82%,100%{opacity:0}66%,78%{opacity:1}}\n .sb-sm[data-e=wink] .mouth{animation:sbe-smirk 2.8s infinite;transform-origin:center}\n@keyframes sbe-smirk{0%,60%,100%{transform:none}70%{transform:rotate(-7deg) scale(calc(1 + var(--s)*.12))}84%{transform:none}}\n/* спокойно */\n .sb-sm[data-e=calm] .all{animation:sbe-breathe 5s ease-in-out infinite}\n .sb-sm[data-e=calm] .sh{animation:sbe-rock 5s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite;transform-origin:56px 44px}\n@keyframes sbe-breathe{0%,100%{transform:none}50%{transform:scale(calc(1 + var(--s)*.025),calc(1 + var(--s)*.035))}}\n@keyframes sbe-rock{0%,100%{transform:rotate(calc(var(--a)*-5deg))}50%{transform:rotate(calc(var(--a)*5deg))}}\n .sb-sm[data-e=calm] .t1{animation:sbe-tw 2.6s ease-in-out infinite} .sb-sm[data-e=calm] .t2{animation:sbe-tw 2.6s ease-in-out 1.3s infinite}\n@keyframes sbe-tw{0%,100%{opacity:.2}50%{opacity:1}}\n .sb-sm[data-e=calm] .z1, .sb-sm[data-e=calm] .z2{transform-box:fill-box;transform-origin:center;opacity:0;animation:sbe-zz 5s ease-out infinite}\n .sb-sm[data-e=calm] .z2{animation-delay:1.2s}\n@keyframes sbe-zz{0%{opacity:0;transform:translate(0,3px) scale(.7)}25%{opacity:.85}100%{opacity:0;transform:translate(6px,-12px) scale(1.15)}}\nsvg.sb-sm.go .all{animation:sbe-tap .6s cubic-bezier(.3,1.6,.5,1)!important}\n@keyframes sbe-tap{0%{transform:scale(.9)}60%{transform:scale(1.12)}100%{transform:none}}\n@media (prefers-reduced-motion:reduce){svg.sb-sm[data-e] *{animation:none!important} .sb-sm[data-e=wink] .open{opacity:0!important} .sb-sm[data-e=wink] .shut{opacity:1!important} .sb-sm[data-e=calm] .z1{opacity:.7!important}}\n\nsvg.sb-sm{overflow:visible}\nsvg.sb-sm.inl{width:1.9em;height:1.9em;vertical-align:-0.55em;--a:5;--s:2.6}\n/* ЖИВОЙ СЛОЙ (D-942): мерки буквы шрифта SB Smile — ширина 1.05em; svg 1.25em, left −0.1em, низ −0.245em от базовой линии (tools/smiles-font.mjs) */\n.sb-sm-slot{white-space:nowrap}.sb-sm-tall{display:inline-block;vertical-align:baseline;line-height:normal}.sb-sm-tall-m{padding-top:1.1em}.sb-sm-tall-l{padding-top:2.7em}.sb-sm-tall-h{padding-top:8.6em}.sb-sm-ch{color:transparent;-webkit-text-fill-color:transparent}\n.sb-sm-at{display:inline-block;position:relative;width:0;height:0;vertical-align:baseline}\n.sb-sm-at>svg.sb-sm.inl{position:absolute;left:-0.1em;bottom:-0.245em;width:1.25em;height:1.25em;vertical-align:0;pointer-events:none}\n.sb-sm-live{position:absolute;z-index:1;box-sizing:border-box;overflow:hidden;margin:0;border:0;background:none;pointer-events:none;align-items:center}\n.sb-sm-live[hidden]{display:none!important}.sb-sm-live .sb-sm-run{white-space:pre;flex:none}\ninput.sb-sm-keyed{padding-inline-end:36px!important}\n.sb-sm-key{position:fixed;z-index:var(--z-menu,80);width:28px;height:28px;padding:2px;border:0;border-radius:var(--r-ctrl,8px);background:none;cursor:pointer;opacity:.85}\n.sb-sm-key[hidden],.sb-sm-menu[hidden]{display:none}.sb-sm-key svg.sb-sm{width:24px;height:24px}.sb-sm-key svg.sb-sm *{animation:none!important}\n.sb-sm-menu{position:fixed;z-index:var(--z-menu,80);padding:8px;border-radius:var(--r-card,14px);border:1px solid var(--line,rgba(255,255,255,.12));background:var(--menu-bg,#1d1a22);box-shadow:var(--shadow-soft,0 8px 28px rgba(0,0,0,.35));color:var(--ink,#eee)}\n.sb-sm-grid{display:grid;grid-template-columns:repeat(4,48px);gap:4px}\n.sb-sm-grid button{width:48px;height:48px;padding:2px;border:0;border-radius:var(--r-ctrl,8px);background:none;cursor:pointer;touch-action:manipulation}\n.sb-sm-grid svg.sb-sm.big{width:44px;height:44px;margin:0}\n.sb-sm-grid .sb-sm-img{width:44px;height:44px;display:block}\n.sb-sm-at>.sb-sm-img{position:absolute;left:-0.1em;bottom:-0.245em;width:1.25em;height:1.25em;pointer-events:none}\n.sb-sm-sizes{display:grid;grid-template-columns:repeat(4,48px);gap:4px;margin-top:6px;padding-top:2px;border-top:1px solid var(--line,rgba(255,255,255,.1))}\n.sb-sm-sizes button{width:48px;height:44px;display:grid;place-items:center;padding:0;border:0;background:none;cursor:pointer;color:var(--ink-3,#aaa);touch-action:manipulation;-webkit-tap-highlight-color:transparent}\n.sb-sm-zc{display:block;box-sizing:border-box;border-radius:50%;border:1.5px solid currentColor;background:transparent;opacity:.55;transition:background-color .2s ease,border-color .2s ease,opacity .2s ease}.sb-sm-sizes button[aria-checked=true] .sb-sm-zc{background:var(--accent,#e0663c);border-color:var(--accent,#e0663c);opacity:1}\n@media (hover: hover){:where(html:not([data-input="touch"])) .sb-sm-sizes button:hover .sb-sm-zc{opacity:.85}}@media (prefers-reduced-motion:reduce){.sb-sm-zc{transition:none}}\n.sb-sm-menu button:focus-visible,.sb-sm-key:focus-visible{outline:2px solid var(--accent,#f90);outline-offset:1px}\n@media (hover: hover){:where(html:not([data-input="touch"])) .sb-sm-grid button:hover{background:var(--glass,rgba(255,255,255,.06))}}\nsvg.sb-sm.inl .bd,svg.sb-sm.inl .sh{animation-name:none}\n\n.sb-sm-at>svg.sb-sm.big,.sb-sm-at>.sb-sm-img.big{position:absolute;display:block;margin:0;pointer-events:none}\nsvg.sb-sm.big{width:96px;height:96px;display:block;margin:6px 0}\n.sb-sm-head{display:flex;align-items:center;gap:10px;padding:0 2px 6px}\n.sb-sm-set{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 6px 0 2px;border:0;border-radius:var(--r-ctrl,8px);background:none;color:var(--ink,#eee);font:inherit;font-size:12.5px;letter-spacing:.02em;text-transform:lowercase;cursor:pointer}\n.sb-sm-set-ic{width:24px;height:24px;display:inline-block}.sb-sm-set-ic>*{width:24px!important;height:24px!important;margin:0!important}\n.sb-sm-more{width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);opacity:.55;margin-left:2px}\n.sb-sm-rec{margin-left:auto;min-height:28px;padding:0 2px;border:0;border-bottom:1px solid transparent;background:none;color:var(--ink-3,#aaa);font:inherit;font-size:12.5px;letter-spacing:.02em;text-transform:lowercase;cursor:pointer}\n.sb-sm-rec[aria-pressed=true]{color:var(--ink,#eee);border-bottom-color:var(--accent-ring,currentColor)}\n.sb-sm-zc-s{width:8px;height:8px}.sb-sm-zc-m{width:13px;height:13px}.sb-sm-zc-l{width:19px;height:19px}.sb-sm-zc-h{width:26px;height:26px}\n.sb-sm-blanket{position:fixed;inset:0;z-index:var(--z-palette,110);background:#050406}.sb-sm-blanket iframe{width:100%;height:100%;border:0;display:block}\n/* размеры (D-947, D-950): крупная картинка стоит на базовой линии и растёт вверх — как буква шрифта SB Smile */\n.sb-sm-at-m>*{left:-0.192em!important;bottom:-0.2em!important;width:2.4em!important;height:2.4em!important}\n.sb-sm-at-l>*{left:-0.32em!important;bottom:-0.2em!important;width:4em!important;height:4em!important}\n.sb-sm-at-h>*{left:-0.8em!important;bottom:-0.2em!important;width:10em!important;height:10em!important}\n.sb-sm-rest{color:transparent!important;-webkit-text-fill-color:transparent!important;caret-color:var(--sb-sm-ink,currentColor)!important}\n.sb-sm-rest::selection{background:var(--accent-soft,rgba(255,170,90,.3))}\n.sb-sm-img{display:inline-block;background:no-repeat center/contain}\n.sb-sm-odeyalo{display:flex;align-items:center;gap:8px;width:100%;min-height:38px;margin:0 0 8px;padding:0 10px;border:0;border-radius:var(--r-ctrl,8px);background:rgba(var(--accent-rgb,224,102,60),.14);color:var(--ink,#eee);font:inherit;font-size:13px;letter-spacing:.01em;text-transform:lowercase;cursor:pointer}\n.sb-sm-odeyalo svg{width:24px;height:16px;flex:none;color:rgb(var(--accent-rgb,224,102,60))}.sb-sm-odeyalo .sb-sm-more{margin-left:auto}\n.sb-sm-odeyalo:focus-visible{outline:2px solid var(--accent,#f90);outline-offset:1px}`; /* шаблонная строка: кавычки в [data-input="touch"] — как в стилях (D-1283) */
  function style() {
    if (document.getElementById("sbSmilesCss")) return;
    var st = document.createElement("style");
    st.id = "sbSmilesCss";
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  /* формулы — те же, что в утверждённом демо (smayliki-zhivye-v4) */
  const OPEN=e=>e==='love'||e==='laugh';
  const shackle=(e,stroke,w,extra='')=>`<path d="M34 46 V32 a16 16 0 0 1 32 0 V${OPEN(e)?'22':'46'}" stroke="${stroke}" stroke-width="${w}" fill="none" stroke-linecap="round" ${OPEN(e)?'transform="translate(9 -6) rotate(18 66 30)"':''} ${extra}/>`;
  const PAL=['#f0a560','#e88a6a','#ef8fb0','#f2c86a','#8fb2ef','#b29ae8','#86d6b4','#c9c0d6'];
  // kawaii face: big shiny eyes with two highlights; the rest borrows from face()
  function face2(e,ink,blush,cx,cy,s){const X=v=>cx+(v-50)*s,Y=v=>cy+(v-54)*s;const eye=(x,y,r=6)=>`<ellipse cx="${X(x)}" cy="${Y(y)}" rx="${r*s}" ry="${(r+1)*s}" fill="${ink}"/><circle cx="${X(x+1.8)}" cy="${Y(y-2.2)}" r="${2.2*s}" fill="#fff"/><circle cx="${X(x-1.6)}" cy="${Y(y+2)}" r="${1*s}" fill="#fff" opacity=".85"/>`;
   const arc=(x1,y1,qx,qy,x2,y2,w=3)=>`<path d="M${X(x1)} ${Y(y1)} Q${X(qx)} ${Y(qy)} ${X(x2)} ${Y(y2)}" stroke="${ink}" stroke-width="${w*s}" fill="none" stroke-linecap="round"/>`;
   let g=blush?`<ellipse cx="${X(28)}" cy="${Y(62)}" rx="${7*s}" ry="${4.2*s}" fill="${blush}"/><ellipse cx="${X(72)}" cy="${Y(62)}" rx="${7*s}" ry="${4.2*s}" fill="${blush}"/>`:'';
   if(e==='happy')return g+eye(37,50)+eye(63,50)+arc(44,63,50,68,56,63);
   if(e==='wow')return g+eye(37,48,7)+eye(63,48,7)+`<ellipse cx="${X(50)}" cy="${Y(66)}" rx="${3.5*s}" ry="${4.5*s}" fill="${ink}"/>`;
   if(e==='sad')return g+eye(37,51)+eye(63,51)+arc(44,67,50,63,56,67)+`<path d="M${X(70)} ${Y(56)} q${2.2*s} ${5*s} 0 ${7*s} q${-2.2*s} ${-2*s} 0 ${-7*s}" fill="#7fc4ff"/>`;
   if(e==='think')return g+eye(37,50)+arc(57,50,63,47,69,50)+arc(44,65,50,64,56,66)+`<circle cx="${X(78)}" cy="${Y(30)}" r="${2.6*s}" fill="${ink}" opacity=".45"/><circle cx="${X(85)}" cy="${Y(22)}" r="${4*s}" fill="${ink}" opacity=".45"/>`;
   return face(e,ink,blush,cx,cy,s);}
  const sh2=(e,c,w,hi)=>{const o=OPEN(e);const t=o?'transform="translate(9 -6) rotate(18 66 30)"':'';return `<path d="M35 47 V33 a15 15 0 0 1 30 0 V${o?'23':'47'}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" ${t}/>`+(hi?`<path d="M35 44 V33 a15 15 0 0 1 9 -13.5" stroke="#fff" stroke-width="${w*0.3}" fill="none" stroke-linecap="round" opacity=".85" ${t}/>`:'');};
  const HU=[[20,320],[350,280],[330,260],[45,330],[210,290],[270,330],[160,230],[300,200]];
  const star=(x,y,r,o=.9)=>`<path d="M${x} ${y-r} L${x+r*.28} ${y-r*.28} L${x+r} ${y} L${x+r*.28} ${y+r*.28} L${x} ${y+r} L${x-r*.28} ${y+r*.28} L${x-r} ${y} L${x-r*.28} ${y-r*.28}Z" fill="#fff" opacity="${o}"/>`;
  // the gesture of the shackle, shared by all hybrids; o: {c: paint, w: width, k: 0..1 how far the gesture goes, hi: highlight}
  function gest(e,o){const c=o.c,w=o.w,k=o.k==null?1:o.k;const L=(d,extra='')=>`<g ${extra}><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+(o.hi?`<path d="${d}" stroke="#fff" stroke-width="${w*.28}" fill="none" stroke-linecap="round" opacity=".7" transform="translate(-${w*.18} -${w*.12})"/>`:'')+'</g>';
   if(e==='love')return L(`M50 44 C50 44 ${50-20*k} ${44-10*k} ${50-20*k} ${44-21*k} a${10*k} ${10*k} 0 0 1 ${20*k} -2 a${10*k} ${10*k} 0 0 1 ${20*k} 2 C${50+20*k} ${44-10*k} 50 44 50 44Z`);
   if(e==='think')return L(`M${40} ${28} a11 11 0 1 1 16 9 q-6 4 -6 8`);
   if(e==='wow')return L(`M37 46 V${22+(1-k)*8} a13 13 0 0 1 26 0 V46`)+(o.fx?`<path d="M27 15 l-4 -4 M73 15 l4 -4" stroke="${o.fxc||'#fff'}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`:'');
   if(e==='sad')return L(`M34 47 C34 ${30+(1-k)*8} 40 ${30+(1-k)*8} 44 38 M66 47 C66 ${30+(1-k)*8} 60 ${30+(1-k)*8} 56 38`);
   if(e==='calm')return `<path d="M60 14 a18 18 0 1 0 6 30 a14 14 0 1 1 -6 -30Z" fill="${c}"/>`;
   if(e==='wink')return L('M33 46 C35 37 42 35 50 35 C58 35 65 37 67 46');
   if(e==='laugh'){const v=o.lv||0;
    if(v===1)return L('M35 47 V33 a15 15 0 0 1 30 0 V47','transform="translate(0 -9)"')+`<path d="M30 44 h6 M64 44 h6 M28 38 h5 M67 38 h5" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
    if(v===2)return L('M35 47 C30 43 40 40 35 36 C30 32 40 29 37 25 a13 13 0 0 1 26 0 C60 29 70 32 65 36 C60 40 70 43 65 47');
    if(v===3)return L('M35 47 q-4 -4 0 -8 q4 -4 0 -8 a15 15 0 0 1 30 0 q-4 4 0 8 q4 4 0 8')+`<path d="M27 30 q-3 3 0 6 M73 30 q3 3 0 6" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`;
    if(v===4)return L('M35 47 V36 a15 15 0 0 1 30 0 V47','transform="rotate(-10 50 46) translate(0 -4)"')+`<path d="M73 22 l5 -3 M76 30 l6 0 M24 26 l-5 -3" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
    return L('M35 47 V30 a15 15 0 0 1 30 0 V47','transform="translate(0 -7) scale(1 1)"')+`<path d="M40 49 h4 M56 49 h4" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;}
   return L('M35 47 V33 a15 15 0 0 1 30 0 V47');}
  const FX={love:(x,y)=>`<path d="M${x} ${y} l-3.5 -3.5 a2.2 2.2 0 0 1 3.5 -3 a2.2 2.2 0 0 1 3.5 3z" fill="#ff7a9a"/>`,sad:(x,y)=>`<path d="M${x} ${y-4} q2 4 0 6 q-2 -2 0 -6" fill="#8fc8ff"/>`,think:(x,y)=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".7"/><circle cx="${x+5}" cy="${y-4}" r="2.4" fill="#fff" opacity=".7"/>`,calm:(x,y)=>star(x,y,2.6,.9)+star(x+7,y+8,1.8,.7),laugh:(x,y)=>`<path d="M${x} ${y} q3 -3 6 0 M${x+2} ${y+6} q3 -3 6 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".75"/>`,wink:(x,y)=>star(x,y,3,.95),happy:(x,y)=>star(x,y,3.2,.9),wow:()=>''};
  const body=(i,id,extra='')=>{const h=HU[i];return `<defs><linearGradient id="${id}${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h[0]},90%,88%)"/><stop offset=".5" stop-color="hsl(${(h[0]+h[1])/2|0},80%,80%)"/><stop offset="1" stop-color="hsl(${h[1]},75%,74%)"/></linearGradient>${extra}</defs>`;};
  const BL={love:'#ff8fb0aa',laugh:'#ff9fb099',wink:'#ff9fb099'};
  const EI={happy:0,laugh:1,love:2,wow:3,sad:4,think:5,wink:6,calm:7};
  // five ways to light the pearl
  function HL(t,i,e){const k=EI[e];
   if(t===1)return `<ellipse cx="36" cy="52" rx="20" ry="6" fill="url(#hw)" transform="rotate(-14 36 52)"/>`; // same place, soft
   if(t===2){const P=[[34,52,-18],[66,51,18],[30,56,-30],[50,48,0],[68,53,22],[36,50,-12],[64,50,15],[44,49,-6]][k];return `<ellipse cx="${P[0]}" cy="${P[1]}" rx="8.5" ry="3.4" fill="url(#hs)" transform="rotate(${P[2]} ${P[0]} ${P[1]})"/>`;}
   if(t===3)return `<path d="M26 47.5 Q50 41.5 74 47.5" stroke="url(#hr)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; // rim light from above
   if(t===4)return ['happy','laugh','love','wow','wink'].includes(e)?`<ellipse cx="34" cy="52" rx="9" ry="3.6" fill="url(#hs)" transform="rotate(-18 34 52)"/>`:'';
   const G=[[30,53],[70,52],[32,50],[50,48],[69,55],[31,55],[67,50],[36,49]][k];return `<circle cx="${G[0]}" cy="${G[1]}" r="1.8" fill="#fff" opacity=".9"/><path d="M${G[0]-5} ${G[1]+3} q3 -2 6 -3" stroke="#fff" stroke-width="1.2" fill="none" opacity=".45" stroke-linecap="round"/>`;}
  const DEFS=`<defs><radialGradient id="hs"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="hr" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><radialGradient id="hw"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".6" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  const pearlBody=(i,id,face_e,src,t)=>DEFS+`<rect x="16" y="42" width="68" height="52" rx="24" fill="url(#${id}${i})"/>`+HL(t,i,src||face_e)+face2(face_e,'#3a2a44',BL[src||face_e]||null,50,70,.64);
  const fe=e=>e==='love'?'happy':e;
  // animated: each part in its own group so it can move on its own
  const AFX={
   think:`<g class="fx"><circle class="b1" cx="80" cy="38" r="1.7" fill="#fff"/><circle class="b2" cx="85" cy="31" r="2.4" fill="#fff"/><circle class="b3" cx="91" cy="23" r="3.2" fill="#fff"/></g>`,
   calm:`<g class="fx">${star(84,36,2.6,.9).replace('<path','<path class="t1"')}${star(91,44,1.8,.7).replace('<path','<path class="t2"')}</g>`,
   sad:`<g class="fx"><path class="drop" d="M71 64 q2.2 4.6 0 6.6 q-2.2 -2 0 -6.6" fill="#8fc8ff"/></g>`,
   love:`<g class="fx"><path class="hf" d="M78 40 l-3.5 -3.5 a2.2 2.2 0 0 1 3.5 -3 a2.2 2.2 0 0 1 3.5 3z" fill="#ff8fb0"/></g>`
  };
  // a bigger, living face: every part in its own group, so eyes, mouth and cheeks can move
  function faceA(e,small){const K='#33243f';
   const eye=(x,cls)=>`<g class="eye ${cls}"><ellipse cx="${x}" cy="65" rx="4.9" ry="5.8" fill="${K}"/><ellipse cx="${x}" cy="66.6" rx="3.1" ry="2.6" fill="#5b4672" opacity=".55"/><circle cx="${x+1.7}" cy="62.8" r="2" fill="#fff"/><circle cx="${x-1.5}" cy="67.4" r=".95" fill="#fff" opacity=".9"/></g>`;
   const arcUp=x=>`<path d="M${x-5.2} 66.5 Q${x} 60 ${x+5.2} 66.5" stroke="${K}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
   const arcDn=x=>`<path d="M${x-5.2} 64.5 Q${x} 69.2 ${x+5.2} 64.5" stroke="${K}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
   const heart=x=>`<path d="M${x} 70 l-5.4 -5.4 a3.3 3.3 0 0 1 5.4 -4.5 a3.3 3.3 0 0 1 5.4 4.5z" fill="#ff5480"/><circle cx="${x-2.6}" cy="62.6" r="1" fill="#fff" opacity=".8"/>`;
   const line=(d,w=2.8)=>`<path d="${d}" stroke="${K}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
   const cheeks=BL[e]?`<g class="blush"><ellipse cx="31" cy="73" rx="5.6" ry="3.2" fill="${BL[e]}"/><ellipse cx="69" cy="73" rx="5.6" ry="3.2" fill="${BL[e]}"/></g>`:'';
   let eyes='',mouth='',brows='';
   if(e==='happy'){eyes=eye(38,'eL')+eye(62,'eR');mouth=line('M43.5 75 Q50 81.8 56.5 75');}
   if(e==='laugh'){eyes=`<g class="eye eL">${arcUp(38)}</g><g class="eye eR">${arcUp(62)}</g>`;mouth=`<path d="M41.5 74 Q50 87 58.5 74 Z" fill="${K}"/><path d="M45.5 80.6 Q50 84.6 54.5 80.6 Q50 78.6 45.5 80.6Z" fill="#ff8fa8"/>`;}
   if(e==='love'){eyes=`<g class="eye eL">${heart(38)}</g><g class="eye eR">${heart(62)}</g>`;mouth=line('M44 76 Q50 81.2 56 76');}
   if(e==='wow'){eyes=eye(38,'eL')+eye(62,'eR');mouth=`<ellipse cx="50" cy="79" rx="3.7" ry="4.7" fill="${K}"/>`;brows=line('M33 56.5 Q38 53 43 55.5',2.2)+line('M57 55.5 Q62 53 67 56.5',2.2);}
   if(e==='sad'){eyes=eye(38,'eL')+eye(62,'eR');mouth=line('M44 80.5 Q50 75.5 56 80.5');brows=line('M33 59 L42.5 56.2',2.2)+line('M67 59 L57.5 56.2',2.2);}
   if(e==='think'){eyes=eye(38,'eL')+`<g class="eye eR">${line('M57 64.5 Q62 62 67 64.5')}</g>`;mouth=line('M45 79 Q50.5 77.4 56 77.4');brows=line('M33.5 57.8 L42.5 57.8',2.2)+`<g class="brow">${line('M57 55.5 Q62 51.5 67 54.5',2.2)}</g>`;}
   if(e==='wink'){eyes=eye(38,'eL')+`<g class="eye eR"><g class="open">${eye(62,'')}</g><g class="shut">${arcUp(62)}</g></g>`;mouth=line('M43.5 75 Q50 81.8 56.5 75')+`<path d="M52 78.7 q3 4.4 5.4 0" fill="#ff8fa8"/>`;brows=line('M33 57 Q38 54.8 43 56.4',2.2);}
   if(e==='calm'){eyes=`<g class="eye eL">${arcDn(38)}</g><g class="eye eR">${arcDn(62)}</g>`;mouth=line('M46 76.5 Q50 79.6 54 76.5');}
   const k=small?1.32:1.14, dy=small?-3:-1.5;
   return `<g transform="translate(0 ${dy}) translate(50 68) scale(${k}) translate(-50 -68)">`+cheeks+`<g class="brows">${brows}</g><g class="eyes">${eyes}</g><g class="mouth">${mouth}</g></g>`;}
  AFX.calm=`<g class="fx">${star(84,36,2.6,.9).replace('<path','<path class="t1"')}${star(91,44,1.8,.7).replace('<path','<path class="t2"')}<text class="z1" x="74" y="50" font-size="7" font-family="Georgia" fill="#e9e2f5">z</text><text class="z2" x="79" y="44" font-size="5.5" font-family="Georgia" fill="#e9e2f5">z</text></g>`;
  AFX.sad=`<g class="fx"><path class="drop" d="M67 70 q2.2 4.6 0 6.6 q-2.2 -2 0 -6.6" fill="#8fc8ff"/></g>`;
  function smiley(e,i,small){const h=HU[i];
   const defs=body(i,'g0',`<linearGradient id="g0s${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="hsl(${h[0]},80%,90%)"/><stop offset="1" stop-color="hsl(${h[1]},70%,84%)"/></linearGradient>`);
   return defs+DEFS+`<ellipse class="shd" cx="50" cy="95" rx="26" ry="3" fill="#000" opacity=".3"/><g class="all"><g class="sh">`+gest(e,{c:`url(#g0s${i})`,w:8.5,hi:true,lv:4,fx:true})+`</g><g class="bd"><rect x="16" y="42" width="68" height="52" rx="24" fill="url(#g0${i})"/>`+HL(1,i,e)+`</g><g class="face">`+faceA(e,small)+`</g></g>`+(AFX[e]||'');}
  
  var UID = 0;
  function svg(e, size) {
    if (!(e in IDX)) return "";
    style();
    var small = size !== "big";
    /* У каждого смайлика свои имена градиентов: одинаковые id на странице
       брали краску у первого, а первый мог лежать в скрытой палитре — и
       тело перламутра пропадало (найдено 02.11 на снимке Заметок). */
    var u = "_" + (++UID);
    var body = smiley(e, IDX[e], small).replace(/id="([^"]+)"/g, 'id="$1' + u + '"').replace(/url\(#([^)]+)\)/g, "url(#$1" + u + ")");
    return '<svg class="sb-sm ' + (small ? "inl" : "big") + '" viewBox="0 0 100 100" data-e="' + e + '" role="img" aria-label="' + esc(nameOf(e)) + '">' + body + "</svg>";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ── НАБОРЫ (D-946): восемь; номер набора — в букве (см. ЗНАК) ──
     Перламутр — живой вектор этого канона; семь остальных — картинки утверждённого
     показа «все наборы» (core/smiles-sets.css), без движения. Порядок — п.3 плана. */
  var SETS = [
    { id: "perlamutr", n: { ru: "перламутр", en: "pearl", ee: "pärlmutter" } },
    { id: "plyush", n: { ru: "мягкая игрушка", en: "plush toy", ee: "pehme mänguasi" } },
    { id: "zhele", n: { ru: "мармелад", en: "jelly", ee: "marmelaad" } },
    { id: "neon", n: { ru: "неон", en: "neon", ee: "neoon" } },
    { id: "mir", n: { ru: "мир внутри", en: "world inside", ee: "sisemaailm" } },
    { id: "steklo", n: { ru: "стекло", en: "glass", ee: "klaas" } },
    { id: "chastitsy", n: { ru: "частицы", en: "particles", ee: "osakesed" } },
    { id: "kosmos", n: { ru: "космос", en: "cosmos", ee: "kosmos" } }
  ];
  /* ПРЕДСТАВИТЕЛЬ НАБОРА (D-1154; основатель 13.11: «каждый смайлик должен конкретно позиционировать свою категорию»).
     Один выбор на систему: лицо набора на кнопке набора в меню, фигура под одеялом, «Крупно» и плитки сцены
     (сцена берёт его отсюда — sbSmiles.reps()). Только из своих смайликов набора, новых рисунков нет.
     REP_NOW — действующие (как было под одеялом); REP_PROPOSED — предложение 13.11 (scratchpad/h5b/predstaviteli):
     «Мир внутри» — «ого» (небо, радуга, холмы, домик видны целиком), «Стекло» — «радость» (тёплое ядро сквозь стекло).
     Поменять — одно слово: REP = REP_PROPOSED; посмотреть до решения — #rep=proposed в адресе. */
  var REP_NOW = { perlamutr: "happy", plyush: "love", zhele: "laugh", neon: "wink", mir: "think", steklo: "sad", chastitsy: "wow", kosmos: "calm" };
  var REP_PROPOSED = { perlamutr: "happy", plyush: "love", zhele: "laugh", neon: "wink", mir: "wow", steklo: "happy", chastitsy: "wow", kosmos: "calm" };
  var REP = /(^|[#&])rep=proposed\b/.test(String(typeof location !== "undefined" && location.hash || "")) ? REP_PROPOSED : REP_NOW;
  function repOf(i) { return REP[SETS[i] && SETS[i].id] || "happy"; }
  /* ОТКАТ: у набора нет имени на языке системы (новый язык раньше слов) — английское имя честнее пустой кнопки (D-1144). */
  function setName(i) { var l = lang(); return SETS[i].n[l] || SETS[i].n.en; }
  /* РАЗМЕРЫ (D-947, основатель 12.11: «маленький, средний, большой, огромный»). Маленький — строчный;
     средний 2.4em, большой 4em, огромный — СТИКЕР 10em. Крупный стоит на базовой линии своей строки и
     растёт ВВЕРХ, как большой эмодзи; строка растёт вместе с ним (D-1151: своя грань шрифта с высокими
     мерками и line-height: normal у поля) — ни пустых строк над ним, ни налезания на соседей.
     ЗНАК (D-940, D-946, D-947): маленький Перламутр — сам эмодзи чувства (и с клавиатуры телефона);
     любой другой набор или размер — одна буква частной зоны U+E900 + 64·размер + 8·набор + чувство.
     Буква одна — курсор, «стереть», выделение и отмена работают с ней целиком; наружу уходит эмодзи.
     ОТКАТ: эмодзи + невидимый селектор (FE00…, E0100…, теги E0040…) — Chromium отрезает селектор от
     эмодзи, и в поле при наборе набор и размер рисовались маленьким Перламутром (замер законом, 12.11). */
  var SIZES = ["s", "m", "l", "h"], SIZE_EM = { s: 1.25, m: 2.4, l: 4, h: 10 }, PUA0 = 0xE900;
  var SIZE_NAMES = { ru: { s: "маленький", m: "средний", l: "большой", h: "огромный" }, en: { s: "small", m: "medium", l: "large", h: "huge" }, ee: { s: "väike", m: "keskmine", l: "suur", h: "hiiglaslik" } };
  function sizeName(z) { var l = lang(); return (SIZE_NAMES[l] || SIZE_NAMES.en)[z]; }
  /* Знак смайлика: чувство + набор + размер. */
  function sign(e, set, size) {
    var x = LIST[IDX[e]], zi = SIZES.indexOf(size || "s");
    if (!x) return "";
    if (!set && zi <= 0) return x.ch;
    return String.fromCharCode(PUA0 + Math.max(0, zi) * 64 + (set || 0) * 8 + IDX[e]);
  }
  var RE_SRC = "(" + LIST.map(function (x) { return x.ch; }).join("|") + ")\\uFE0F?|([\\uE900-\\uE9FF])";
  function re() { return new RegExp(RE_SRC, "g"); }
  /* Обход текста: кусок — onText(s, at), смайлик — onSm(e, весь знак, набор, размер, at). */
  function walk(text, onText, onSm, base) {
    var s = String(text == null ? "" : text), R = re(), m, at = 0, out = "", b = base || 0;
    while ((m = R.exec(s))) {
      if (m.index > at) out += onText(s.slice(at, m.index), b + at);
      var e, set = 0, size = "s";
      if (m[1]) e = BY_CH[m[1]];
      else { var k = m[2].charCodeAt(0) - PUA0; e = LIST[k % 8].e; set = (k >> 3) % 8; size = SIZES[k >> 6]; }
      out += onSm(e, m[0], set, size, b + m.index);
      at = m.index + m[0].length;
    }
    return out + (at < s.length ? onText(s.slice(at), b + at) : "");
  }
  function has(text) { return re().test(String(text || "")); }
  function hasBig(text) { var hit = false; walk(text, String, function (e, ch, set, size) { if (size !== "s") hit = true; return ""; }); return hit; }

  /* Картинка смайлика: Перламутр — живой svg канона; прочие наборы — картинка. */
  /* Живые наборы (D-949): по файлу на набор (core/smiles-sets/<набор>.css, анимированный WebP двух
     размеров) — подключается, только когда набор впервые нужен. Демо в одном файле кладёт CSS в
     window.SB_SMILE_SETS_CSS. */
  var SETS_ON = {};
  function needSet(i) {
    /* ОТКАТ: нет DOM (законы в node:vm) — CSS набора не подключается, знак остаётся буквой шрифта (D-1144). */
    if (!i || SETS_ON[i] || !document.createElement) return;
    SETS_ON[i] = 1;
    var id = SETS[i].id, inl = window.SB_SMILE_SETS_CSS && window.SB_SMILE_SETS_CSS[id], n;
    if (inl) { n = document.createElement("style"); n.textContent = inl; }
    else { n = document.createElement("link"); n.rel = "stylesheet"; n.href = "core/smiles-sets/" + id + ".css"; }
    n.setAttribute("data-sb-smile-set", id);
    (document.head || document.documentElement).appendChild(n);
  }
  /* hi — картинка 256 px (большой, огромный); иначе 96 px — её хватает строке, среднему и меню при ×2 */
  function pic(e, set, big, hi) {
    if (!set) return svg(e, big ? "big" : "small");
    style(); needSet(set);
    return '<span class="sb-sm-img ' + (hi ? "big" : "inl") + '" data-s="' + SETS[set].id + '" data-e="' + e + '" role="img" aria-label="' + esc(nameOf(e)) + '"></span>';
  }
  /* ЖИВОЙ СЛОЙ (D-942): буква шрифта держит место (прозрачная), живая картинка лежит на якоре
     у базовой линии ровно поверх буквы — строка не меняется ни на точку. Крупный (D-947) — так же:
     картинка стоит на базовой линии и растёт вверх — как и сама буква шрифта (D-950). */
  function slot(e, ch, set, size) {
    return '<span class="sb-sm-slot" role="img" aria-label="' + esc(nameOf(e)) + '"><i class="sb-sm-at sb-sm-at-' + size + '" aria-hidden="true">' + pic(e, set, size !== "s", size === "l" || size === "h") +
      '</i><span class="sb-sm-ch" aria-hidden="true">' + ch + "</span></span>";
  }
  /* Текст → разметка: одна и та же для поля в покое и для показа (Передать, просмотр).
     Перенос строк и место каждого смайлика задаёт сам текст: крупный стоит в своей строке, а
     свободные строки под ним — настоящие строки текста. Поэтому живой вид совпадает с полем. */
  function render(text, opts) {
    var field = !!(opts && opts.field), s = String(text == null ? "" : text);
    if (field) return walk(s.slice(-1) === "\n" ? s + " " : s, esc, slot);
    /* в показе (не поле) строка растёт под крупный так же, как в поле: слот крупного — столбик его высоты (D-1151) */
    return s.split("\n").map(function (line) { return walk(line, esc, function (e, ch, set, size) { var h = slot(e, ch, set, size); return size === "s" ? h : h.replace('class="sb-sm-slot"', 'class="sb-sm-slot sb-sm-tall sb-sm-tall-' + size + '"'); }); }).join("<br>");
  }
  /* Для списков и имён: буквы рисует шрифт, чтец слышит имя чувства (D-945). В строке списка
     крупный показывается строчным: строка списка одна, и крупному в ней негде висеть. */
  function html(text) {
    return walk(text, esc, function (e, ch, set) { return '<span role="img" aria-label="' + esc(nameOf(e)) + '">' + sign(e, set, "s") + "</span>"; });
  }
  /* Наружу: эмодзи-аналог (невидимые селекторы сняты) или «:имя:». */
  function plain(text, mode) {
    if (mode === "name") return walk(text, String, function (e) { return ":" + nameOf(e) + ":"; });
    return walk(text, String, function (e) { return LIST[IDX[e]].ch; });
  }
  /* Для голоса и чтения вслух: имя словом. */
  function speak(text) {
    return walk(text, String, function (e) { return " " + nameOf(e) + " "; }).replace(/ {2,}/g, " ").trim();
  }

  /* ── ПОЛЯ ──────────────────────────────────────────────────────────────── */
  var SEL = typeof WeakMap === "function" ? new WeakMap() : null, LAST = null, LIVE = typeof WeakMap === "function" ? new WeakMap() : null;
  function textual(el) {
    if (!el || !el.tagName) return false;
    if (el.tagName === "TEXTAREA") return true;
    return el.tagName === "INPUT" && /^(text|search|)$/i.test(el.getAttribute("type") || "");
  }
  /* Знак у поля — у всякого поля ввода системы, кроме закрытых мест:
     ворота и двери (слово-ключ — не текст), терминал, середина стола, и
     поля, которые сказали data-sm="off". */
  function eligible(el) {
    return textual(el) && !el.readOnly && !el.disabled &&
      !(el.closest && el.closest('[data-sm="off"], #sbVaultGate, [data-sb-door], .sb-terminal, #sbDeskTools, .vg-win-body'));
  }
  function remember(el) {
    if (!textual(el) || !SEL) return;
    try { SEL.set(el, [el.selectionStart, el.selectionEnd]); } catch (e) { /* поле без выделения */ }
  }
  /* СТРОКА РАСТЁТ ПОД КРУПНЫЙ (D-1151). Поле пишется с line-height: normal: высота строки — по граням, которыми
     она написана, и строка с крупным смайликом растёт сама (у граней крупных — высокие мерки, smiles-font.css).
     Обычная строка держит прежнюю высоту: первой в стеке стоит невидимая грань-опора (strut, ни одной своей
     буквы — все буквы рисуют прежние шрифты), её ascent/descent-override = мерки текста поля + половина
     прежнего межстрочья. Мерки текста — замер canvas (fontBoundingBox) шрифтом самого поля. */
  /* грань-опора — свой файл с того же адреса: строгая страница не грузит шрифт из data: (page-strictness) */
  var STRUT = SRC0 ? new URL("../fonts/sb-strut.woff2", SRC0).href : "fonts/sb-strut.woff2", STRUTS = {}, GROWN = typeof WeakMap === "function" ? new WeakMap() : null;
  function grow(el) {
    if (!el || el.tagName !== "TEXTAREA" || !GROWN || !window.FontFace || !document.fonts) return;
    var g = GROWN.get(el), cs = getComputedStyle(el);
    if (!g) { g = { fam: cs.fontFamily, lh: cs.lineHeight }; GROWN.set(el, g); }
    var fs = parseFloat(cs.fontSize), lh = parseFloat(g.lh) / fs;
    /* ОТКАТ: у поля нет числовой высоты строки (normal) — опора не нужна, строка и так по граням (D-1151) */
    if (!fs || !(lh > 0)) return;
    var c = (grow.cv = grow.cv || document.createElement("canvas")).getContext("2d");
    c.font = cs.fontStyle + " " + cs.fontWeight + " " + fs + "px " + g.fam;
    var m = c.measureText("Hg"), a = m.fontBoundingBoxAscent / fs, d = m.fontBoundingBoxDescent / fs;
    /* ОТКАТ: браузер без fontBoundingBox — поле остаётся с прежней высотой строки, крупный — без роста строки (D-1151) */
    if (!(a > 0) || !(d >= 0)) return;
    var half = Math.max(0, (lh - a - d) / 2), A = Math.round((a + half) * 1000) / 10, D = Math.round((d + half) * 1000) / 10, name = "SB Smile Strut " + A + " " + D;
    if (!STRUTS[name]) {
      STRUTS[name] = 1;
      try { var f = new FontFace(name, 'url("' + STRUT + '") format("woff2")', { ascentOverride: A + "%", descentOverride: D + "%", lineGapOverride: "0%" }); document.fonts.add(f); f.load().then(function () { paintSoon(el); }, function () {}); }
      catch (e) { /* ОТКАТ: FontFace не принял опору — поле с прежней высотой строки (D-1151) */ return; }
    }
    var fam = '"' + name + '", ' + g.fam;
    if (el.style.fontFamily !== fam) { el.style.fontFamily = fam; el.style.lineHeight = "normal"; el.classList.add("sb-sm-grow"); }
  }
  /* ОДНА ВСТАВКА (D-943). execCommand("insertText") — как набор с клавиатуры: родная отмена,
     событие input, курсор после знака. Где его нет — setRangeText. size — размер знака (D-947):
     любой размер встаёт на место курсора, в ту же строку (D-1151). */
  function insert(el, ch, size) {
    el = el || LAST;
    if (size === true) size = "m";
    var q = null;
    walk(ch, String, function (e, c, set, z) { q = { e: e, set: set, z: z }; return ""; });
    if (!textual(el) || !q) return false;
    if (el.tagName !== "TEXTAREA") { size = "s"; ch = sign(q.e, q.set, "s"); }   /* в поле одной строки — только маленький */
    else if (size && size !== q.z) ch = sign(q.e, q.set, size);
    size = size || q.z;
    if (document.activeElement !== el) {
      try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
      var s0 = SEL && SEL.get(el);
      if (s0) try { el.setSelectionRange(s0[0], s0[1]); } catch (e) { /* поле без выделения */ }
    }
    var v = el.value, a = el.selectionStart == null ? v.length : el.selectionStart, b = el.selectionEnd == null ? a : el.selectionEnd;
    /* любой размер — одна буква на месте курсора, в той же строке (D-1151): строка растёт под него сама */
    var txt = ch, done = false;
    grow(el);
    try { done = document.execCommand("insertText", false, txt); } catch (e) { done = false; }
    if (!done || el.value === v) {
      try { el.setRangeText(txt, a, b, "end"); } catch (e) { el.value = v.slice(0, a) + txt + v.slice(b); }
      try { el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: txt })); }
      catch (e) { el.dispatchEvent(new Event("input", { bubbles: true })); }
    }
    remember(el);
    if (LIVE && !LIVE.get(el)) field(el); else paintSoon(el);
    var k = q.e + ":" + q.set;
    RECENT = [k].concat(RECENT.filter(function (x) { return x !== k; })).slice(0, 8);
    return true;
  }

  /* ЖИВОЙ ВИД ПОЛЯ (D-942, D-950). Слой лежит ровно поверх поля (та же коробка, отступы, кегль,
     перенос); буквы поля прозрачны, слой пишет тот же текст их цветом и кладёт живую чёткую
     картинку на место буквы — и в покое, и ПРИ НАБОРЕ: вид не меняется в миг касания (видео 12.11:
     «как только касаешься, смайлик теряет качество»). Курсор и выделение рисует само поле (цвет
     курсора — цвет текста); касание проходит сквозь слой в поле. */
  var COPY = ["fontFamily", "fontSize", "fontWeight", "fontStyle", "fontStretch", "fontVariant", "fontFeatureSettings", "fontVariationSettings", "fontKerning",
    "letterSpacing", "wordSpacing", "lineHeight", "textTransform", "textIndent", "textAlign", "direction", "tabSize",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "overflowWrap", "wordBreak", "textRendering"];
  function paintField(el) {
    var L = LIVE && LIVE.get(el);
    if (!L) return;
    var on = has(el.value) && el.isConnected && el.getClientRects().length > 0;
    if (!on) { if (!L.hidden) { L.hidden = true; L.innerHTML = ""; } el.classList.remove("sb-sm-rest"); return; }
    if (L.parentNode !== el.parentNode || L.previousSibling !== el) el.insertAdjacentElement("afterend", L);
    el.classList.remove("sb-sm-rest");
    grow(el);
    var cs = getComputedStyle(el), st = L.style;
    el.style.setProperty("--sb-sm-ink", cs.color);
    COPY.forEach(function (k) { st[k] = cs[k]; });
    st.color = cs.color;
    var area = el.tagName === "TEXTAREA";
    st.whiteSpace = area ? "pre-wrap" : "pre";
    st.left = (el.offsetLeft + el.clientLeft) + "px"; st.top = (el.offsetTop + el.clientTop) + "px";
    st.width = el.clientWidth + "px"; st.height = el.clientHeight + "px";
    st.display = area ? "block" : "flex";
    L.innerHTML = area ? render(el.value, { field: true }) : '<span class="sb-sm-run">' + render(el.value, { field: true }) + "</span>";
    L.hidden = false;
    el.classList.add("sb-sm-rest");
    syncScroll(el);
    /* живые смайлики не начинают движение заново при каждой букве: фаза — от общих часов */
    var now = performance.now();
    [].forEach.call(L.querySelectorAll("svg.sb-sm"), function (sv) { try { sv.getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = now; }); } catch (e) { /* без часов анимаций */ } });
  }
  var SOON = typeof WeakMap === "function" ? new WeakMap() : null;
  function paintSoon(el) {
    if (!SOON || SOON.get(el)) return;
    SOON.set(el, requestAnimationFrame(function () { SOON.delete(el); paintField(el); }));
  }
  function syncScroll(el) {
    var L = LIVE && LIVE.get(el);
    if (!L || L.hidden) return;
    if (el.tagName === "TEXTAREA") L.scrollTop = el.scrollTop;
    else if (L.firstChild) L.firstChild.style.transform = "translateX(" + (-el.scrollLeft) + "px)";
  }
  function field(el) {
    if (!textual(el) || !LIVE) return;
    if (!LIVE.get(el)) {
      var L = document.createElement("div");
      L.className = "sb-sm-live"; L.setAttribute("aria-hidden", "true"); L.hidden = true;
      LIVE.set(el, L);
      el.insertAdjacentElement("afterend", L);
      el.addEventListener("scroll", function () { syncScroll(el); });
      /* при наборе слой пишется сразу, в том же кадре, что и поле: буквы поля прозрачны, и ждать кадра анимации — значит
         показать набранное с опозданием (на занятом устройстве — до полусекунды; замер 13.11, D-1151) */
      el.addEventListener("input", function () { paintField(el); });
      el.addEventListener("focus", function () { paintSoon(el); });
      if (typeof ResizeObserver === "function") new ResizeObserver(function () { if (!L.hidden) paintField(el); }).observe(el);
    }
    paintField(el);
  }

  /* ── ОДНО МЕНЮ (D-943, D-944) ──────────────────────────────────────────── */
  var RECENT = [], TAB = "s0", SIZE = "s", KEY = null, MENU = null, TARGET = null, BTN_ANCHOR = null;
  /* Категории (D-944, D-946): восемь наборов и «недавние». Набор выбирают ПОД ОДЕЯЛОМ (D-948):
     кнопка набора в меню открывает утверждённую сцену «Под одеялом» — фонарик поворачивается к
     выбранному; «Выбрать» возвращает набор в меню. Стрелки на кнопке — соседний набор без сцены. */
  function cats() {
    var c = SETS.map(function (x, i) { return { id: "s" + i, label: setName(i), items: LIST.map(function (y) { return y.e + ":" + i; }) }; });
    if (RECENT.length) c.push({ id: "recent", label: word("recent"), items: RECENT.slice() });
    return c;
  }
  function oneLine() { var t = TARGET || LAST; return !t || t.tagName !== "TEXTAREA"; }
  function curSet() { return /^s\d$/.test(TAB) ? +TAB.slice(1) : 0; }
  function buildMenu() {
    if (MENU) return MENU;
    style();
    MENU = document.createElement("div");
    MENU.id = "sbSmMenu"; MENU.className = "sb-sm-menu"; MENU.hidden = true;
    MENU.setAttribute("role", "dialog");
    /* касание меню не забирает фокус у поля: клавиатура телефона остаётся,
       меню не закрывается само (повод — «выбор не работает», видео 12.11) */
    var HIT = "[data-sm-e], [data-sm-tab], [data-sm-z], [data-sm-blanket]";
    MENU.addEventListener("pointerdown", function (ev) { if (ev.target.closest(HIT)) ev.preventDefault(); });
    MENU.addEventListener("mousedown", function (ev) { if (ev.target.closest(HIT)) ev.preventDefault(); });
    MENU.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-sm-tab]"), z = ev.target.closest("[data-sm-z]"), bl = ev.target.closest("[data-sm-blanket]");
      var had = MENU.contains(document.activeElement);
      if (bl) { blanket(); return; }
      if (t) { TAB = t.getAttribute("data-sm-tab") === TAB && TAB === "recent" ? "s" + curSetMem : t.getAttribute("data-sm-tab"); if (TAB !== "recent") curSetMem = curSet(); fill(); var f = MENU.querySelector("[data-sm-tab]"); if (had && f) f.focus(); }
      if (z) { SIZE = z.getAttribute("data-sm-z"); markSize(); var g = MENU.querySelector('[data-sm-z="' + SIZE + '"]'); if (had && g) g.focus(); }
    });
    MENU.addEventListener("pointerdown", function (ev) {
      var b = ev.target.closest("[data-sm-e]");
      if (!b || (ev.button !== undefined && ev.button > 0)) return;
      var long = false, gone = false;
      var tm = setTimeout(function () { long = true; pick(b, true); }, LONG_MS);
      function end() { clearTimeout(tm); b.removeEventListener("pointerup", up); b.removeEventListener("pointercancel", cancel); b.removeEventListener("pointerleave", cancel); }
      function up() { end(); if (!long && !gone) pick(b, false); }
      function cancel() { gone = true; end(); }
      b.addEventListener("pointerup", up); b.addEventListener("pointercancel", cancel); b.addEventListener("pointerleave", cancel);
    });
    MENU.addEventListener("keydown", function (ev) {
      var all = [].slice.call(MENU.querySelectorAll("[data-sm-e]")), i = all.indexOf(document.activeElement);
      /* Esc — меню, и только ему: дальше он не идёт, иначе закрыл бы и окно с полем */
      if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); close(true); return; }
      var bl = ev.target.closest && ev.target.closest("[data-sm-blanket]");
      if (bl && (ev.key === "ArrowRight" || ev.key === "ArrowLeft")) {
        ev.preventDefault(); TAB = "s" + ((curSet() + (ev.key === "ArrowRight" ? 1 : SETS.length - 1)) % SETS.length); curSetMem = curSet(); fill(); MENU.querySelector("[data-sm-blanket]").focus(); return;
      }
      var zb = ev.target.closest && ev.target.closest("[data-sm-z]");
      if (zb && (ev.key === "ArrowRight" || ev.key === "ArrowLeft")) {
        ev.preventDefault(); SIZE = SIZES[(SIZES.indexOf(SIZE) + (ev.key === "ArrowRight" ? 1 : SIZES.length - 1)) % SIZES.length]; markSize(); MENU.querySelector('[data-sm-z="' + SIZE + '"]').focus(); return;
      }
      if (i < 0) return;
      var step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }[ev.key];
      if (step) { ev.preventDefault(); var j = i + step; if (j >= 0 && j < all.length) all[j].focus(); return; }
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(all[i], ev.shiftKey); }
    });
    document.body.appendChild(MENU);
    return MENU;
  }
  var LONG_MS = 450, curSetMem = 0;   /* ПОСТОЯННАЯ: долгое касание палитры (D-590) */
  function fill() {
    var C = cats();
    if (!C.some(function (c) { return c.id === TAB; })) TAB = C[0].id;
    var cur = C.filter(function (c) { return c.id === TAB; })[0], one = oneLine(), si = TAB === "recent" ? curSetMem : curSet();
    MENU.setAttribute("aria-label", word("menu"));
    /* набор — кнопкой с его лицом и именем: касание — сцена «Под одеялом» */
    var head = '<div class="sb-sm-head"><button type="button" class="sb-sm-set" data-sm-blanket aria-haspopup="dialog" aria-label="' + esc(word("sets") + ": " + setName(si)) + '">' +
      '<span class="sb-sm-set-ic">' + pic(repOf(si), si, true) + "</span><span>" + esc(setName(si)) + "</span><i class=\"sb-sm-more\" aria-hidden=\"true\"></i></button>" +
      (RECENT.length ? '<button type="button" class="sb-sm-rec" data-sm-tab="recent" aria-pressed="' + (TAB === "recent") + '">' + esc(word("recent")) + "</button>" : "") + "</div>" +
      /* вход под одеяло — видимой полосой (основатель 12.11: «не могу найти выбор под одеялом») */
      '<button type="button" class="sb-sm-odeyalo" data-sm-blanket aria-haspopup="dialog"><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M2 13c2-6 6-9 10-9s8 3 10 9" fill="currentColor" opacity=".35"/><path d="M2 13c2-6 6-9 10-9s8 3 10 9M7 8.5l2 4.5M12 4v9M17 8.5l-2 4.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="19.5" cy="3" r="1.6" fill="currentColor"/></svg><span>' + esc(word("blanket")) + '</span><i class="sb-sm-more" aria-hidden="true"></i></button>';
    /* четыре размера (D-947) — четыре круга растущего поперечника, от маленького к огромному (D-1150; основатель 13.11:
       смайлики-миниатюры в квадратной рамке и подпись «путают и неаккуратны»). Выбранный круг отмечен сам — залит
       цветом темы, остальные — контуром; рамок нет, смена — только цветом (ряд не сдвигается). Касание — 48×44 px вокруг
       круга; имя размера словом — для чтеца (aria-label). В поле одной строки — только маленький, размеров там нет. */
    var sizes = one ? "" : '<div class="sb-sm-sizes" role="radiogroup" aria-label="' + esc(word("size")) + '">' + SIZES.map(function (z) {
      return '<button type="button" role="radio" data-sm-z="' + z + '" aria-checked="' + (z === SIZE) + '" tabindex="' + (z === SIZE ? 0 : -1) + '" aria-label="' + esc(sizeName(z)) + '"><i class="sb-sm-zc sb-sm-zc-' + z + '" aria-hidden="true"></i></button>';
    }).join("") + "</div>";
    MENU.innerHTML = head + '<div class="sb-sm-grid" role="group" aria-label="' + esc(cur.label) + '" aria-description="' + esc(word("hint")) + '">' +
      cur.items.map(function (it) {
        var e = it.split(":")[0], set = +it.split(":")[1] || 0;
        return '<button type="button" data-sm-e="' + e + '" data-sm-s="' + set + '" aria-label="' + esc(nameOf(e) + (set ? " · " + setName(set) : "")) + '">' + pic(e, set, true) + "</button>";
      }).join("") + "</div>" + sizes;
  }
  /* выбор размера — на месте, без пересборки меню: круг меняет только цвет, мягко (D-1150) */
  function markSize() {
    [].forEach.call(MENU.querySelectorAll("[data-sm-z]"), function (b) { var on = b.getAttribute("data-sm-z") === SIZE; b.setAttribute("aria-checked", on ? "true" : "false"); b.tabIndex = on ? 0 : -1; });
  }
  /* Коротко — выбранным размером; долго — средним (D-590). */
  function pick(b, long) {
    var e = b.getAttribute("data-sm-e"), set = +b.getAttribute("data-sm-s") || 0;
    if (!LIST[IDX[e]]) return;
    var z = oneLine() ? "s" : (long && SIZE === "s" ? "m" : SIZE);
    insert(TARGET || LAST, sign(e, set, z), z);
    close(false);
  }

  /* ── ПОД ОДЕЯЛОМ (D-948): выбор набора — сцена из утверждённого показа ────── */
  var BLK = null;
  function blanket() {
    if (BLK) return;
    var url = window.SB_SMILE_BLANKET_URL || "apps/smiles-blanket/blanket.html";
    BLK = document.createElement("div");
    BLK.id = "sbSmBlanket"; BLK.className = "sb-sm-blanket"; BLK.setAttribute("role", "dialog"); BLK.setAttribute("aria-modal", "true"); BLK.setAttribute("aria-label", word("sets"));
    var f = document.createElement("iframe");
    f.title = word("sets"); f.src = url + "#set=" + SETS[TAB === "recent" ? curSetMem : curSet()].id + "&lang=" + lang();
    BLK.appendChild(f);
    document.body.appendChild(BLK);
    window.addEventListener("message", onBlanket);
  }
  function blanketClose() {
    window.removeEventListener("message", onBlanket);
    if (BLK) { BLK.remove(); BLK = null; }
  }
  function onBlanket(ev) {
    var d = ev.data;
    if (!d || typeof d !== "object" || !d.sbBlanket || !BLK || ev.source !== BLK.firstChild.contentWindow) return;
    if (d.sbBlanket === "pick") {
      var i = -1;
      SETS.forEach(function (x, k) { if (x.id === d.set) i = k; });
      if (i >= 0) { TAB = "s" + i; curSetMem = i; }
    }
    blanketClose();
    if (MENU && !MENU.hidden) { fill(); placeMenu(); var t = TARGET || LAST; if (t) { try { t.focus({ preventScroll: true }); } catch (e) { /* поле ушло */ } } }
  }
  function placeMenu() {
    if (!MENU || MENU.hidden) return;
    var vv = window.visualViewport, top0 = vv ? vv.offsetTop : 0, h = vv ? vv.height : innerHeight, w = innerWidth;
    var a = (BTN_ANCHOR && BTN_ANCHOR.isConnected ? BTN_ANCHOR : (KEY && !KEY.hidden ? KEY : TARGET)), r = a ? a.getBoundingClientRect() : { left: w / 2, right: w / 2, top: h / 2, bottom: h / 2 };
    var mw = MENU.offsetWidth, mh = MENU.offsetHeight;
    var x = Math.max(8, Math.min(w - mw - 8, r.right - mw));
    var y = r.bottom + 6;
    if (y + mh > top0 + h - 8) y = r.top - mh - 6;
    y = Math.max(top0 + 8, Math.min(top0 + h - mh - 8, y));
    MENU.style.left = Math.round(x) + "px"; MENU.style.top = Math.round(y) + "px";
  }
  function open(o) {
    o = o || {};
    TARGET = textual(o.field) ? o.field : LAST;
    BTN_ANCHOR = o.anchor || null;
    buildMenu(); fill();
    MENU.hidden = false;
    placeMenu();
    if (BTN_ANCHOR) BTN_ANCHOR.setAttribute("aria-expanded", "true");
    if (o.keyboard) { var f = MENU.querySelector("[data-sm-e]"); if (f) f.focus(); }
  }
  function close(back) {
    if (!MENU || MENU.hidden) return;
    var hadFocus = MENU.contains(document.activeElement);
    MENU.hidden = true;
    if (BTN_ANCHOR) BTN_ANCHOR.setAttribute("aria-expanded", "false");
    if ((back || hadFocus) && TARGET && TARGET.isConnected) { try { TARGET.focus({ preventScroll: true }); } catch (e) { /* поле ушло */ } }
    BTN_ANCHOR = null;
  }
  function toggle(o) { if (MENU && !MENU.hidden) close(false); else open(o); }

  /* ЗНАК У ПОЛЯ: одна кнопка на систему, встаёт у поля в фокусе. Поле со
     своей кнопкой (data-sm-key — Записи) её не получает. */
  function buildKey() {
    if (KEY) return KEY;
    style();
    KEY = document.createElement("button");
    KEY.type = "button"; KEY.id = "sbSmKey"; KEY.className = "sb-sm-key"; KEY.hidden = true; KEY.tabIndex = -1;
    KEY.innerHTML = svg("happy", "small");
    KEY.addEventListener("pointerdown", function (ev) { ev.preventDefault(); });
    KEY.addEventListener("mousedown", function (ev) { ev.preventDefault(); });
    KEY.addEventListener("click", function () { toggle({ field: LAST }); });
    document.body.appendChild(KEY);
    return KEY;
  }
  var placing = 0;
  function placeKey() {
    placing = 0;
    var el = document.activeElement;
    if (!KEY) return;
    var keyed = document.querySelectorAll(".sb-sm-keyed");
    for (var i = 0; i < keyed.length; i++) if (keyed[i] !== el) keyed[i].classList.remove("sb-sm-keyed");
    if (!eligible(el) || el.hasAttribute("data-sm-key") || !el.getClientRects().length) { KEY.hidden = true; return; }
    var r = el.getBoundingClientRect(), s = 28;
    if (r.width < 90 || r.height < 18) { KEY.hidden = true; el.classList.remove("sb-sm-keyed"); return; }
    /* у однострочного поля — место под знак справа, чтобы буквы не уходили под него */
    if (el.tagName === "INPUT") el.classList.add("sb-sm-keyed");
    KEY.setAttribute("aria-label", word("key"));
    var area = el.tagName === "TEXTAREA";
    KEY.style.left = Math.round(r.right - s - (area ? 6 : 4)) + "px";
    KEY.style.top = Math.round(area ? r.bottom - s - 6 : r.top + (r.height - s) / 2) + "px";
    KEY.hidden = false;
    placeMenu();
  }
  function later() { if (!placing) placing = requestAnimationFrame(placeKey); }

  function onFocusIn(ev) {
    var el = ev.target;
    if (!textual(el)) return;
    LAST = el;
    if (eligible(el)) grow(el);
    var L = LIVE && LIVE.get(el);
    if (L) paintField(el);
    if (eligible(el) && !el.hasAttribute("data-sm-key")) buildKey();
    later();
  }
  function onFocusOut(ev) {
    var el = ev.target;
    if (!textual(el)) return;
    remember(el);
    el.classList.remove("sb-sm-keyed");
    setTimeout(function () { if (has(el.value)) field(el); later(); }, 0);
  }
  /* поле со смайликом оживает сразу — у любого поля системы, и при наборе */
  function onAnyInput(ev) { var el = ev.target; if (textual(el) && LIVE && !LIVE.get(el) && has(el.value)) field(el); }

  /* ── «СТЕРЕТЬ» У СМАЙЛИКА (D-1151) ──────────────────────────────────────────
     Курсор, стрелки и «стереть» — родные: смайлик любого размера — одна буква в строке, пустых строк над
     крупным больше нет (D-950 снято). Одно «стереть» убирает ровно один смайлик; крупный при этом тихо
     тает 0,18 с (призрак поверх, само стирание — родное, с родной отменой). */
  function fadeOut(el, at) {
    var L = LIVE && LIVE.get(el);
    if (!L || L.hidden) return;
    var slots = L.querySelectorAll(".sb-sm-slot"), n = 0, v = el.value, k = -1;
    walk(v, String, function (e, c, set, z, o) { if (o === at) k = n; n++; return ""; });
    var sl = k >= 0 ? slots[k] : null, pic0 = sl && sl.querySelector(".sb-sm-at > *");
    if (!pic0 || window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var r = pic0.getBoundingClientRect(), g = pic0.cloneNode(true), host = document.body;
    g.classList.add("sb-sm-ghost");
    g.style.cssText = "position:fixed;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;margin:0;pointer-events:none;z-index:var(--z-menu,80);transition:opacity .18s ease-out,transform .18s ease-out";
    host.appendChild(g);
    requestAnimationFrame(function () { g.style.opacity = "0"; g.style.transform = "scale(.92)"; });
    setTimeout(function () { g.remove(); }, 260);
  }
  function onBeforeInput(ev) {
    var el = ev.target;
    if (!el || el.tagName !== "TEXTAREA" || el.selectionStart !== el.selectionEnd) return;
    var v = el.value, p = el.selectionStart;
    if (ev.inputType === "deleteContentBackward" && p > 0 && /[\uE940-\uE9FF]/.test(v.charAt(p - 1))) fadeOut(el, p - 1);
    else if (ev.inputType === "deleteContentForward" && /[\uE940-\uE9FF]/.test(v.charAt(p))) fadeOut(el, p);
  }
  function onOutside(ev) {
    if (!MENU || MENU.hidden || BLK) return;
    var t = ev.target;
    if (MENU.contains(t) || (KEY && KEY.contains(t)) || (BTN_ANCHOR && BTN_ANCHOR.contains(t))) return;
    close(false);
  }
  /* Копия наружу — эмодзи-аналог: своя буква набора и размера не уходит в
     чужие программы; внутри системы знак возвращается целиком. */
  var CLIP = "text/x-sb-smile";
  function selected() {
    var el = document.activeElement;
    if (textual(el)) return el.value.slice(el.selectionStart, el.selectionEnd);
    var s = window.getSelection && window.getSelection();
    return s ? String(s) : "";
  }
  function onCopy(ev) {
    var t = selected();
    if (!ev.clipboardData || plain(t) === t) return;
    ev.clipboardData.setData("text/plain", plain(t));
    ev.clipboardData.setData(CLIP, t);
    ev.preventDefault();
    if (ev.type === "cut" && textual(document.activeElement)) { try { document.execCommand("delete"); } catch (e) { /* только копия */ } }
  }
  function onPaste(ev) {
    var raw = ev.clipboardData && ev.clipboardData.getData(CLIP), el = ev.target;
    if (!raw || !textual(el) || plain(raw) !== ev.clipboardData.getData("text/plain")) return;
    ev.preventDefault();
    try { document.execCommand("insertText", false, raw); } catch (e) { /* без вставки */ }
  }

  function wire() {
    if (wire.done || !document.addEventListener || !window.addEventListener) return;
    wire.done = true;
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("pointerdown", onOutside, true);
    ["select", "keyup", "pointerup", "input"].forEach(function (n) { document.addEventListener(n, function (ev) { if (textual(ev.target)) remember(ev.target); }, true); });
    document.addEventListener("input", onAnyInput, true);
    document.addEventListener("beforeinput", onBeforeInput, true);
    /* шрифт текста догрузился — мерки опоры пересчитываются по нему (иначе строка была бы по запасному шрифту) */
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", function () { var el = document.activeElement; [el, LAST].forEach(function (x) { if (x && x.tagName === "TEXTAREA" && GROWN && GROWN.get(x)) { grow(x); paintSoon(x); } }); });
    document.addEventListener("copy", onCopy, true); document.addEventListener("cut", onCopy, true); document.addEventListener("paste", onPaste, true);
    window.addEventListener("scroll", later, true); window.addEventListener("resize", later);
    if (window.visualViewport) { window.visualViewport.addEventListener("resize", later); window.visualViewport.addEventListener("scroll", later); }
    document.addEventListener("input", later, true);
    /* Esc при открытом меню — только меню: ловим на window раньше оболочки (её Escape на document закрыл бы окно с полем) */
    window.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && MENU && !MENU.hidden && !BLK) { ev.preventDefault(); ev.stopPropagation(); close(true); } }, true);
    /* шрифт набора — заранее: холсты (голос, мысль) рисуют знак им сразу */
    try { if (document.fonts && document.fonts.load) document.fonts.load('16px "SB Smile"', LIST.map(function (x) { return x.ch; }).join("")); } catch (e) { /* без шрифтов — эмодзи телефона */ }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();

  window.sbSmiles = {
    list: function () { return LIST.map(function (x) { return { e: x.e, ch: x.ch, name: nameOf(x.e) }; }); },
    svg: svg, render: render, has: has, html: html, plain: plain, speak: speak, name: function (e) { return nameOf(BY_CH[e] || e); },
    reps: function () { var o = {}; for (var k in REP) o[k] = REP[k]; return o; },
    insert: insert, field: field, sign: sign, sizes: SIZES.slice(), sets: function () { return SETS.map(function (x, i) { return { id: x.id, name: setName(i) }; }); },
    menu: { open: open, close: close, toggle: toggle, isOpen: function () { return !!(MENU && !MENU.hidden); } },
    FAMILY: '"SB Smile"'
  };
})();
