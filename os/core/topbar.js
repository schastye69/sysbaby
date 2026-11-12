/* sys.baby OS — core/topbar.js
 * Topbar (identity, bell, app sequence, tips, clock, battery,
 * connectivity), Control Center (all shell settings), Session Timer,
 * and the i18n mechanism (authored en/ru/ee chrome table). */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function readJSON(k, f) { return window.sbReadJSON ? window.sbReadJSON(k, f) : f; }
  function writeJSON(k, v) { if (window.sbWriteJSON) window.sbWriteJSON(k, v); }
  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function reduced() { return root.getAttribute("data-motion") === "reduced"; }

  /* ============================================================ i18n (§9) */
  /* Option (b): the selector offers the three languages whose strings are
     authored (en/ru/ee) and translates the chrome from this bundled table.
     Authored voice lines (terminal) are never machine-translated. */
  /* Сама таблица строк вынесена в core/strings.js (D-800, v178-H4a) и
     грузится раньше этого файла; здесь — та же таблица по ссылке, поэтому
     слова, влитые window.sbAddStrings позже, видны sbT сразу. Запасной
     пустой английский — чтобы шапка не упала, если strings.js не дошёл. */
  var STRINGS = window.sbStrings || (window.sbStrings = { en: {} });
  /* ЯЗЫКИ СИСТЕМЫ. Порядок и вид — те же, что на витрине: моноширинные коды,
     а не флаги (D-041). Финский пока живёт только в витрине: у оболочки его
     строк нет, и система об этом ГОВОРИТ, а не притворяется — код помечен, и
     при выборе она честно остаётся на английском, пока витрина в окне build
     переходит на финский. Пометка исчезнет сама в тот день, когда появятся
     строки: она считается из таблицы, а не проставляется рукой. */
  /* Внутренний код языка и то, что видит человек, — разные вещи. Эстонский
     внутри проекта исторически «ee», но человеку показывается ET: это его
     настоящий код (ISO 639-1), и ровно так он написан на витрине. Показывать
     «EE» значило бы показывать код СТРАНЫ — та же ошибка, что флаг вместо
     языка, из-за которой и появилось решение D-041. */
  var LANGS = [
    { code: "ee", show: "ET", label: "Eesti" },
    { code: "en", show: "EN", label: "English" },
    { code: "ru", show: "RU", label: "Русский" },
    /* resting: финский временно убран из выбора языка в пульте (основатель
       09.11.2026, решение D-633: «финский язык временно убрать»). Язык и его
       строки остаются в системе — снимается только слово в пульте. */
    { code: "fi", show: "FI", label: "Suomi", resting: true }
  ];

  function lang() {
    var v = rawGet("sysbaby.i18n.lang") || "en";
    return LANGS.some(function (l) { return l.code === v; }) ? v : "en";
  }
  window.sbLang = lang;
  /* Языки системы — наружу, чтобы законы СПРАШИВАЛИ их, а не держали свой
     список (D-200, D-278). Копия: снаружи список не правится. */
  /* partial — язык, на котором говорит витрина, но ещё не система: словаря
     нет, и система честно отвечает по-английски (D-286 спрашивает это,
     чтобы не требовать своих слов там, где их не обещали). */
  window.sbLangs = function () { return LANGS.map(function (l) { return { code: l.code, show: l.show, label: l.label, partial: !STRINGS[l.code], resting: !!l.resting }; }); };
  /* sbT(key) -> the string; sbT(key, {name: "x"}) -> the string with {name}
     filled in. Interpolation lives here rather than at the call sites because
     word order differs between the three languages: a sentence assembled from
     English fragments ("Open " + name) cannot be translated at all, while one
     with a placeholder can be rewritten freely in each language.
     An unknown key returns the key itself, which is loud in the UI and
     therefore gets fixed, rather than silently rendering an empty string. */
  /* ── ФОРМЫ ЧИСЕЛ (D-586) ──────────────────────────────────────────────
     «1 локальных ключей» — так система не говорит. Если в словаре есть
     key.one / key.few / key.many и передано {count}, форма выбирается
     правилами самого языка (Intl.PluralRules; наш ee — это et). Нет
     формы — берётся сам ключ. Охраняется tools/about-words-check.mjs. */
  var PLURAL_TAG = { en: "en", ru: "ru", ee: "et" };
  function pluralKey(L, key, vars) {
    if (!vars || typeof vars.count !== "number" || !window.Intl || !Intl.PluralRules) return key;
    var form;
    try { form = new Intl.PluralRules(PLURAL_TAG[lang()] || "en").select(vars.count); } catch (e) { return key; }
    if (form === "other") return key;
    var k = key + "." + form;
    return (L && L[k]) || STRINGS.en[k] ? k : key;
  }
  window.sbT = function (key, vars) {
    var L = STRINGS[lang()];
    key = pluralKey(L, key, vars);
    var s = (L && L[key]) || STRINGS.en[key] || key;
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  };
  /* Строка на ЗАДАННОМ языке, а не на текущем. Понадобилось экрану замка
     (D-164): язык системы теперь заперт, и до пароля он берёт язык у самого
     браузера. Отдельная дверь, а не второй словарь: словарь один. */
  window.sbTIn = function (code, key) {
    /* ОТКАТ: перевода на этот язык нет — честно падаем на английский.
     Это объявленный договор перевода, а не подмена: неполный язык
     система показывает человеку отдельной меткой в полосе языков. */
    var L = STRINGS[code] || STRINGS.en;
    return (L && L[key]) || STRINGS.en[key] || key;
  };

  /* The document's own language, not just its visible text. A screen reader
     picks its voice from this and the browser hyphenates from it, so a page
     full of Russian still labelled lang="en" is read out in an English accent.
     Estonian's IETF tag is `et` — `ee` is this project's internal code for it
     and is not a language tag, so it is mapped rather than copied. */
  var DOC_LANG = { en: "en", ru: "ru", ee: "et" };

  /* Полоса языков: всё состояние видно сразу, переключение — одно нажатие. */
  function tr(k) { return window.sbT ? window.sbT(k) : k; }

  /* ── ЯЗЫК: ОДИН КОД, КОТОРЫЙ И ЕСТЬ КНОПКА (v47, вторая редакция) ────────
   *
   * Первая редакция показывала все четыре кода разом: ноль нажатий, чтобы
   * увидеть язык, одно — чтобы сменить. Основатель посмотрел на телефоне и
   * снял её одной фразой: столько места занимать нельзя, и часы из-за неё не
   * помещались в экран. Он прав, и вот почему: четыре кода — это состояние
   * ЧЕТЫРЁХ языков, а человеку нужно состояние ОДНОГО, своего. Остальные три
   * нужны ему один раз в жизни, при первой встрече.
   *
   * Поэтому здесь один код — тот, на котором система говорит сейчас. Он же и
   * кнопка: нажатие переводит на следующий язык, долгое нажатие раскрывает
   * все четыре, если нужен конкретный. Место — правый угол верхней панели,
   * рядом с часами; занимает он ширину двух букв.
   *
   * Почему понятно, что это язык, без слова «язык»: код набран моноширинным,
   * как коды языков на витрине (D-041 — коды, а не флаги, потому что флаг
   * обозначает страну), одет в ту же стеклянную плашку с волосяной рамкой,
   * что и остальные значки панели, — плашка и говорит «это можно нажать», —
   * и озвучен полностью для тех, кто читает экран голосом. Пунктир под кодом
   * тут стоял до v53 и был снят: на телефоне тонкая точечная линия под двумя
   * буквами читается как подчёркивание ОПЕЧАТКИ, а не как приглашение.
   */
  function nextLang(code) {
    var i = 0, k;
    for (k = 0; k < LANGS.length; k++) if (LANGS[k].code === code) i = k;
    return LANGS[(i + 1) % LANGS.length].code;
  }

  function closeLangMenu() {
    var m = doc.getElementById("sbLangMenu");
    if (m && m.parentNode) m.parentNode.removeChild(m);
    doc.removeEventListener("pointerdown", onOutsideLang, true);
  }
  function onOutsideLang(ev) {
    if (ev.target && ev.target.closest && ev.target.closest("#sbLangMenu, #sbLangs")) return;
    closeLangMenu();
  }

  function openLangMenu() {
    closeLangMenu();
    var host = doc.getElementById("sbLangs");
    if (!host) return;
    var cur = lang();
    var m = doc.createElement("div");
    m.id = "sbLangMenu";
    m.className = "tb-lang-menu";
    m.setAttribute("role", "menu");
    LANGS.forEach(function (l) {
      var partial = !STRINGS[l.code];
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "tb-lang-item" + (l.code === cur ? " is-active" : "") + (partial ? " is-partial" : "");
      b.setAttribute("data-lang", l.code);
      b.setAttribute("lang", l.code === "ee" ? "et" : l.code);
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", l.code === cur ? "true" : "false");
      b.innerHTML = '<span class="tb-lang-code">' + l.show + '</span><span class="tb-lang-name">' + l.label + '</span>';
      b.title = partial ? l.label + " — " + tr("lang.partial") : l.label;
      b.addEventListener("click", function () { closeLangMenu(); window.sbSetLang(l.code); });
      m.appendChild(b);
    });
    host.appendChild(m);
    setTimeout(function () { doc.addEventListener("pointerdown", onOutsideLang, true); }, 0);
  }
  window.sbOpenLangMenu = openLangMenu;
  window.sbCloseLangMenu = closeLangMenu;

  function paintLangs() {
    var host = doc.getElementById("sbLangs");
    if (!host) return;
    var cur = lang();
    var rec = LANGS.filter(function (l) { return l.code === cur; })[0] || LANGS[1];
    closeLangMenu();
    host.innerHTML = "";

    var b = doc.createElement("button");
    b.type = "button";
    b.className = "tb-lang-now" + (!STRINGS[cur] ? " is-partial" : "");
    b.id = "sbLangNow";
    b.setAttribute("data-lang", cur);
    b.setAttribute("lang", cur === "ee" ? "et" : cur);
    b.textContent = rec.show;
    b.title = tr("aria.langs") + ": " + rec.label;
    b.setAttribute("aria-label", tr("aria.langs") + ": " + rec.label);
    b.setAttribute("aria-haspopup", "menu");

    /* Короткое нажатие — следующий язык. Долгое — выбрать любой.
       Порог 420 мс: короче человек не успевает понять, что держит. */
    var holdTimer = null, held = false;
    var startHold = function () {
      held = false;
      holdTimer = setTimeout(function () { held = true; openLangMenu(); }, 420);
    };
    var endHold = function () { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
    b.addEventListener("pointerdown", startHold);
    b.addEventListener("pointerup", endHold);
    b.addEventListener("pointerleave", endHold);
    b.addEventListener("pointercancel", endHold);
    b.addEventListener("click", function () {
      if (held) { held = false; return; }
      window.sbSetLang(nextLang(lang()));
    });
    b.addEventListener("contextmenu", function (ev) { ev.preventDefault(); openLangMenu(); });
    host.appendChild(b);
  }
  window.sbPaintLangs = paintLangs;

  function applyLang() {
    paintLangs();
    var code = lang();
    root.setAttribute("lang", DOC_LANG[code] || code);
    $$("[data-i18n]").forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      var v = window.sbT(k);
      if (v) n.textContent = v;
    });
    $$("[data-i18n-title]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-title"));
      if (v) n.setAttribute("title", v);
    });
    $$("[data-i18n-aria]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-aria"));
      if (v) n.setAttribute("aria-label", v);
    });
    $$("[data-i18n-ph]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-ph"));
      if (v) n.setAttribute("placeholder", v);
    });
    /* The status strip is painted from live values, not from markup, so it
       has to be repainted rather than translated in place. */
    paintNet();
    if (window.sbBus) window.sbBus.emit("translate:done", { to: code });
  }
  /* Наружу — чтобы восстановление вида после открытия замка (D-164) могло
     позвать перевод той же дверью, что и всё остальное. */
  window.sbApplyLang = applyLang;
  window.sbSetLang = function (code) {
    var known = LANGS.some(function (l) { return l.code === code; });
    var c = known ? code : "en";
    rawSet("sysbaby.i18n.lang", c);
    applyLang();
    paintClock(true);
    if (typeof window.sbAnnounceSetting === "function") window.sbAnnounceSetting("lang", { code: c });
    return c;
  };

  /* ========================================================= identity (§5) */
  var USER_KEY = "sysbaby.username";
  /* Имя — буквы любого письма (сборка H4: «Анна» из знакомства и Настроек
     доходит до шапки; раньше пропускалась только латиница и кириллица
     превращалась в «guest»). Латиница, как прежде, строчная; буквы других
     письменностей — как набраны. Знаки разметки и пробелы не проходят. */
  function sanitize(v) { return String(v || "").replace(/[A-Z]/g, function (c) { return c.toLowerCase(); }).replace(/[^\p{L}\p{M}\p{N}_.\-]/gu, "").slice(0, 18); }

  window.sbGetUsername = function () {
    var v = window.sbDB ? window.sbDB.get(USER_KEY) : null;
    return sanitize(v) || "guest";
  };
  window.sbSetUsername = function (name) {
    var v = sanitize(name) || "guest";
    if (window.sbDB) window.sbDB.set(USER_KEY, v);
    paintIdentity();
    try { doc.dispatchEvent(new CustomEvent("sysbaby:username-changed", { detail: { username: v } })); } catch (e) { /* ignore */ }
    return v;
  };

  function paintIdentity() {
    var el = $("#sbIdentityName");
    if (el) el.textContent = window.sbGetUsername();
  }

  /* ── ЗНАЧОК СИСТЕМЫ УБИРАЕТ СО СТОЛА (v47.1) ────────────────────────────
   *
   * Основатель: «так же при нажатии на иконку логотипа все окна должны
   * сворачиваться. совет должен был выбрать гибридный вариант во время
   * голосования». Голосование выбрало пустое место стола и на этом
   * остановилось — а у победителя был напарник.
   *
   * Почему нужны оба, а не один. Пустое место — жест того, кто систему уже
   * знает, и он недостижим ровно тогда, когда нужнее всего: окно во весь
   * экран пустого места не оставляет, и чтобы жестом воспользоваться, надо
   * сперва убрать окно руками — то есть сделать то, ради чего жест и
   * заводился. Значок в углу виден всегда.
   *
   * Дверь ОДНА: window.sbMinimizeAll из desktop.js. Второй копии правила
   * здесь нет и не будет — иначе два места начнут расходиться в мелочах.
   */
  /* Публичная дверь «покажи подсказку сейчас». Лампочка переехала в Центр
     управления (v47.3, место в панели занял Турбо), и всем, кто просил
     подсказку нажатием, нужна дверь без поиска кнопки: законы и сама
     лампочка зовут одно и то же. */
  window.sbShowTipNow = function () {
    var tip = nextTip();
    if (!tip) return false;
    hintRequested = true;   /* человек позвал сам — см. sbDeskHintYield */
    return showTip(tip);
  };

  /* ── ЗНАК СИСТЕМЫ — ДВА ШАГА, А НЕ ДВА НАЗНАЧЕНИЯ (v61) ──────────────────
     ПОВОД, дословно от основателя 24.08.2026: «когда нажимаешь в первый раз
     про иконке логотипа, то скрываются все окна, а если нажать ещё раз, то
     страница с нашей os должна открыться на весь экран абсолютно на любом
     устройстве. а иконка логотипа в режиме на весь экран должна стать
     слегка больше и если на неё нажать еще раз, то она уменьшится, но это
     можно сделать только тогда, когда все приложения свёрнуты».

     ПОЧЕМУ ЭТО НЕ ДВЕ КНОПКИ В ОДНОЙ. Обе работы у знака — про одно и то
     же: убрать лишнее и остаться со своей системой. Сначала уходят окна,
     потом уходит браузер. Это одна лестница вниз, к чистому столу, и ступень
     всегда следующая за той, где человек сейчас стоит.

     ПРАВИЛО ОДНО, И ОНО САМО ДАЁТ ОБЕ ПОЛОВИНЫ ОСНОВАТЕЛЯ. Если на столе
     есть что убрать — убираем и на этом останавливаемся. Если убирать
     нечего — переключаем полный экран. Отсюда бесплатно следует и «уменьшить
     можно только когда все приложения свёрнуты»: открытое окно съест
     нажатие, свернувшись, и выход из полного экрана произойдёт следующим.

     ЧЕСТНАЯ ГРАНИЦА, названная вслух: «абсолютно на любом устройстве» —
     недостижимо. Safari на iPhone не даёт полного экрана ничему, кроме
     видео: requestFullscreen там отсутствует. Мы не притворяемся, что
     сработало, — говорим один раз и не повторяем. Молчаливое бездействие
     было бы хуже: человек решил бы, что сломана кнопка.

     Класс на корне ставится по СОБЫТИЮ fullscreenchange, а не по нашему
     намерению: выйти из полного экрана можно и клавишей Esc, и средствами
     браузера, мимо этой кнопки. Признак берётся у того, кто им владеет. */
  function fsElement() {
    return doc.fullscreenElement || doc.webkitFullscreenElement || null;
  }
  function fsSupported() {
    var el = doc.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen);
  }
  var fsToldUnsupported = false;
  function toggleFullscreen() {
    if (!fsSupported()) {
      if (!fsToldUnsupported && window.showToast) {
        fsToldUnsupported = true;
        window.showToast(window.sbT("fs.no"), window.sbT("fs.noSub"), "");
      }
      return;
    }
    try {
      if (fsElement()) {
        (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      } else {
        var el = doc.documentElement;
        (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      }
    } catch (err) { console.error("[topbar] fullscreen toggle failed", err); }
  }
  function syncFullscreenClass() {
    doc.documentElement.classList.toggle("sb-fullscreen", !!fsElement());
    /* ── ПОЛНЫЙ ЭКРАН — В ПАНЕЛИ И В НАСТРОЙКАХ (D-163) ─────────────────
       Просьба основателя 27.08.2026: «Fullscreen on off нужно добавить в
       панель быстрого управления и в настройки».
       Признак берётся у ТОГО, КТО ИМ ВЛАДЕЕТ: выйти из полного экрана можно
       клавишей Esc и средствами браузера, мимо любой нашей кнопки. Поэтому
       обе поверхности перекрашиваются по СОБЫТИЮ, а не по нашему намерению. */
    var b = $("#sbCcFullscreen");
    if (b) {
      b.setAttribute("aria-pressed", fsElement() ? "true" : "false");
      b.classList.toggle("on", !!fsElement());
      var bst = b.querySelector(".sv-st");
      if (bst) bst.textContent = window.sbT(fsElement() ? "cc.on" : "cc.off");
    }
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("fullscreen:change", { on: !!fsElement() });
    try {
      doc.dispatchEvent(new CustomEvent("sysbaby:setting-changed", { detail: { kind: "fullscreen" } }));
    } catch (e) { /* ignore */ }
  }
  /* Наружу — одной парой: обе поверхности зовут ОДНУ дверь, и спорить им не о
     чем. sbFullscreenSupported честно отвечает «нет» там, где полного экрана
     не существует (Safari на iPhone), — кнопка тогда не рисуется вовсе. */
  window.sbToggleFullscreen = function () { toggleFullscreen(); return !!fsElement(); };
  window.sbIsFullscreen = function () { return !!fsElement(); };
  window.sbFullscreenSupported = fsSupported;

  function wireMark() {
    var mark = $("#sbTopMark");
    if (!mark) return;
    doc.addEventListener("fullscreenchange", syncFullscreenClass);
    doc.addEventListener("webkitfullscreenchange", syncFullscreenClass);
    syncFullscreenClass();
    mark.addEventListener("click", function () {
      var n = 0;
      if (typeof window.sbMinimizeAll === "function") {
        try { n = window.sbMinimizeAll(); } catch (err) { console.error("[topbar] minimise all failed", err); return; }
      }
      if (n > 0) {
        /* Первая ступень: со стола было что убрать. Молчать, когда убирать
           было нечего, — правило прежнее: подтверждать несделанное значит врать. */
        if (window.showToast) {
          window.showToast(window.sbT("desk.allMinimized"), window.sbT("desk.allMinimizedSub"), "");
        }
        return;
      }
      /* Вторая ступень: стол уже чист — уходит браузер. */
      toggleFullscreen();
    });
  }

  function wireIdentity() {
    var host = $("#sbTopIdentity"), el = $("#sbIdentityName");
    if (!host || !el) return;
    paintIdentity();
    /* ИМЯ ВОЗВРАЩАЕТСЯ ВМЕСТЕ С МИРОМ (D-593). Имя лежит под замком, как всё
       остальное: при запуске мир ещё заперт, и панель видела «guest». Слово
       у двери открывает мир — панель перерисовывает имя. Стережёт
       tools/name-after-door-check.mjs. */
    if (window.sbBus && window.sbBus.on) window.sbBus.on("vault:change", function () { paintIdentity(); });
    doc.addEventListener("sysbaby:door-gone", function () { paintIdentity(); });
    host.title = window.sbT("aria.identity");
    /* ── КРУЖОК ОТКРЫВАЕТ ОКНО АККАУНТА · решение D-173 ─────────────────────
       Здесь стояла правка имени прямо в полосе: нажатие делало #sbIdentityName
       правимым. На широком экране это работало. На телефоне же .id-name скрыт
       вовсе (core.css, §responsive), и от кнопки остаётся один кружок из
       ::after — то есть палец делал правимым НЕВИДИМОЕ поле, и человек,
       нажавший кружок, не видел ровно ничего. Основатель попросил на этом
       месте окно настроек аккаунта; оно же лечит и эту немоту: поле имени
       теперь в окне и видно на любом экране. */
    host.addEventListener("click", function () {
      if (typeof window.sbOpenAccountPanel === "function") { window.sbOpenAccountPanel(); return; }
      /* Панели ещё нет (ранний кадр) — не изображаем действия молча. */
      if (window.console) console.warn("[identity] account panel is not ready yet");
    });
  }

  /* ============================================================== clock (§5)

     ── ЦИФРЫ ИЗ ТОГО ЖЕ МАТЕРИАЛА, ЧТО И ЗНАК (D-135) ────────────────────
     ПОВОД, дословно: «время должно быть более концептуальным и цифры должны
     быть похожи на палочки иконки и на буквы y в логотипе».

     ИЗ ЧЕГО СДЕЛАН ЗНАК, ЕСЛИ ИЗМЕРИТЬ, А НЕ ОПИСАТЬ. В контуре крюка на
     коробке сто на сто перекладина имеет толщину 19.88 и скругление 16
     снаружи, 7 внутри. Язык знака — СТЕРЖЕНЬ примерно в пятую часть коробки
     с круглыми концами. Цифра собрана ровно из этого: семь стержней той же
     относительной толщины, круглые концы, ни одной засечки. Коробка 62×100,
     стержень 20 — те же 20%, что у знака.

     ПОЧЕМУ СТЕРЖНИ, А НЕ ШРИФТ. Шрифтом это было бы ПОХОЖЕ; стержнями это
     то же самое. И цена та же: цифра — семь неподвижных отрезков, у которых
     раз в секунду меняется только признак «горит». Ни одного нового узла,
     ни одной записи в корень — а часы идут круглые сутки, и любая ошибка
     здесь умножается на восемьдесят шесть тысяч.  */
  var SEGS = ["A", "B", "C", "D", "E", "F", "G"];
  var SEG_XY = {
    A: [17, 12, 45, 12], B: [50, 17, 50, 45], C: [50, 55, 50, 83],
    D: [17, 88, 45, 88], E: [12, 55, 12, 83], F: [12, 17, 12, 45], G: [17, 50, 45, 50]
  };
  var DIGIT = {
    "0": "ABCDEF", "1": "BC", "2": "ABGED", "3": "ABGCD", "4": "FGBC",
    "5": "AFGCD", "6": "AFGEDC", "7": "ABC", "8": "ABCDEFG", "9": "ABCDFG"
  };
  function makeGlyph() {
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "clock-glyph");
    svg.setAttribute("viewBox", "0 0 62 100");
    svg.setAttribute("aria-hidden", "true");
    SEGS.forEach(function (k) {
      var xy = SEG_XY[k];
      var ln = doc.createElementNS("http://www.w3.org/2000/svg", "line");
      ln.setAttribute("x1", xy[0]); ln.setAttribute("y1", xy[1]);
      ln.setAttribute("x2", xy[2]); ln.setAttribute("y2", xy[3]);
      ln.setAttribute("data-seg", k);
      svg.appendChild(ln);
    });
    return svg;
  }
  function setGlyph(svg, ch) {
    var on = DIGIT[ch] || "";
    if (svg._sbCh === ch) return;
    svg._sbCh = ch;
    var lines = svg.childNodes;
    for (var i = 0; i < lines.length; i++) {
      var k = lines[i].getAttribute("data-seg");
      var want = on.indexOf(k) !== -1;
      /* Признак переставляется, только если он ДЕЙСТВИТЕЛЬНО меняется:
         иначе каждая секунда просила бы пересчитать стили ни за чем. */
      if ((lines[i].getAttribute("class") === "on") !== want) {
        if (want) lines[i].setAttribute("class", "on");
        else lines[i].removeAttribute("class");
      }
    }
  }
  window.sbClockGlyph = function (ch) { var g = makeGlyph(); setGlyph(g, ch); return g; };

  /* ── ЧАСЫ ЛОВЯТ СВЕТ КОМНАТЫ (D-137) ──────────────────────────────────
     ПОВОД: «нужно часы сделать гармоничными и максимально концептуальными
     (сейчас концептуальность есть, но недостаточно какого-то уникального
     эффекта связанного со светом)».

     ЧТО ЗДЕСЬ УНИКАЛЬНОГО, И ПОЧЕМУ ЭТО НЕ УКРАШЕНИЕ. Часы не светятся сами —
     они ОСВЕЩЕНЫ той же комнатой, что и всё вокруг. Если выбраны суточные
     обои, свет идёт по кругу суток вместе с ними: в три часа ночи цифры почти
     без ореола, к полудню он ясно виден. Если обои обычные — светит шов.
     Значит часы показывают время ДВАЖДЫ: цифрами и тем, каким светом они
     освещены. Такого эффекта не может быть ни у кого другого — он вырастает
     из того, что в этой системе уже есть.

     ЦЕНА. Свойство пишется на ОДИН элемент (сами часы), а не в корень: запись
     в корень объявляет устаревшим стиль всего документа (D-093, D-112). И
     пишется, только когда округлённый цвет изменился, — не чаще раза в
     несколько минут. */
  var litLast = "";
  function roomLight() {
    /* ── ОДИН СВЕТ НА ВСЮ КОМНАТУ (D-143) ──────────────────────────────────
       Здесь стояли три ветки: у светотерапии спрашивали её обои, у суточного
       — свои, у остальных брали шов. Это было раздвоением дважды: часы сами
       выводили цвет комнаты по её имени (хотя с D-141 шов И ЕСТЬ её свет,
       увиденный на кромке), и вдобавок читали ВЫЧИСЛЕННЫЙ свет вместо
       НАПИСАННОГО — поэтому в замороженной комнате часы продолжали писать.
       Спрашиваем один раз и у одного: что на комнате надето сейчас. */
    try {
      var now = window.sbRoomNow ? window.sbRoomNow() : null;
      var acc = window.sbGetCurrentAccent ? window.sbGetCurrentAccent() : null;
      if (acc && acc.a1) {
        return { c1: acc.a1, level: (now && typeof now.level === "number") ? now.level : 0.5 };
      }
    } catch (err) { console.error("[clock] light read failed", err); }
    return null;
  }
  function paintLight() {
    var w = roomLight();
    if (!w || !w.c1) return;
    var lvl = typeof w.level === "number" ? w.level : 0.5;
    /* Ореол мал даже в самый светлый час: часы — не лампа, они лишь ловят
       свет. Цифра остаётся белой, цветным становится только сияние вокруг. */
    var blur = Math.round((1.4 + lvl * 4.2) * 10) / 10;
    var alpha = Math.round((0.16 + lvl * 0.34) * 100) / 100;
    var key = w.c1 + "|" + blur + "|" + alpha;
    if (key === litLast) return;
    litLast = key;
    var n = parseInt(String(w.c1).slice(1), 16);
    var rgba = "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
    /* СВЕТ ОБЪЯВЛЕН В ОДНОМ МЕСТЕ, потому что читают его трое: часы в полосе,
       крупное время в панели и время в проигрывателе. Три копии одного знания
       разошлись бы — этот урок в проекте оплачен четырежды.
       ЗАПИСЬ В КОРЕНЬ ЗДЕСЬ ОПРАВДАНА ЦЕНОЙ: она объявляет устаревшим стиль
       всего документа (D-093, D-112), но случается, только когда изменился
       ОКРУГЛЁННЫЙ цвет света — то есть раз в несколько минут, а не раз в
       секунду. Закон это и стережёт: за четыре секунды хода — ни одной. */
    /* КАЖДОЕ СВОЙСТВО — СО СВОИМ ВОПРОСОМ (D-143). Ключ общий на троих, но
       меняются они врозь: цвет плывёт непрерывно, а размытие держится
       ступенькой. Писать все три потому, что изменилось одно, значит дважды
       объявить устаревшим стиль всего документа НИ ЗА ЧТО. Замер клиники
       поймал это в лоб: --lit-blur переписан тем же значением, которое уже
       стояло. Спрашиваем у корня, что там сейчас, и пишем только новое. */
    var root = doc.documentElement, st = root.style;
    var ink = "color-mix(in oklab, var(--ink) 88%, " + w.c1 + ")";
    setIfNew(st, "--lit-glow", rgba);
    setIfNew(st, "--lit-blur", blur + "px");
    /* Сам штрих — чуть тёплее белого в сторону света, но остаётся белым:
       цветные цифры в рабочей полосе кричали бы. */
    setIfNew(st, "--lit-ink", ink);
  }
  function setIfNew(st, key, value) {
    if (st.getPropertyValue(key) === value) return;
    st.setProperty(key, value);
  }
  window.sbClockLight = paintLight;
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("mood:change", function () { litLast = ""; paintLight(); });
    window.sbBus.on("accent:change", function () { litLast = ""; paintLight(); });
  }

  var clockCells = null, lastClock = "";
  function localeFor() { var l = lang(); return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB"); }

  function paintClock(force) {
    var host = $("#sbClock");
    if (!host) return;
    if (doc.visibilityState === "hidden" && !force) return;
    var d = new Date();
    /* НА ТЕЛЕФОНЕ ЧАСЫ УСТУПАЮТ (v47). С появлением полосы языков верхняя
       панель на 390px перестала помещаться: часы уезжали за правую кромку на
       шестьдесят пикселей. Уступает здесь именно дата и секунды, а не язык, —
       и это выбор, а не случайность: который час, человек узнаёт у телефона
       одним взглядом вверх, а на каком он языке — только у нас. */
    var narrow = window.innerWidth < 480;
    var opts = window.innerWidth < 560 ? { day: "numeric", month: "short" } : { weekday: "short", day: "numeric", month: "short" };
    var dateStr = narrow ? "" : d.toLocaleDateString(localeFor(), opts);
    /* ЧАСЫ БЕЗ СЕКУНД (D-609, основатель 04.11.2026: «Секунды убираем, конечно»): в верхней панели — часы и
       минуты на любой ширине; секунды живут в виджете «Время». Стережёт tools/desk-items-check.mjs. */
    var timeStr = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    var whole = narrow ? timeStr : dateStr + "  " + timeStr;
    if (whole === lastClock && !force) return;

    /* Пересборка нужна, только когда СОСТАВ строки изменился — например,
       окно сузилось и секунды ушли. Обычная секунда состава не меняет. */
    var shape = whole.replace(/\d/g, "#");
    if (!clockCells || clockCells.length !== whole.length || clockCells._shape !== shape || force) {
      host.innerHTML = "";
      clockCells = [];
      clockCells._shape = shape;
      for (var i = 0; i < whole.length; i++) {
        var s = doc.createElement("span");
        s.className = "clock-cell";
        if (DIGIT[whole[i]] !== undefined) {
          s.className += " digit";
          var g = makeGlyph();
          setGlyph(g, whole[i]);
          s.appendChild(g);
          s._sbGlyph = g;
        } else {
          s.textContent = whole[i];
        }
        host.appendChild(s);
        clockCells.push(s);
      }
    } else {
      for (var j = 0; j < whole.length; j++) {
        var cell = clockCells[j];
        var cur = cell._sbGlyph ? cell._sbGlyph._sbCh : cell.textContent;
        if (cur === whole[j]) continue;
        if (cell._sbGlyph) setGlyph(cell._sbGlyph, whole[j]);
        else cell.textContent = whole[j];
        if (!reduced()) {
          cell.classList.remove("roll");
          void cell.offsetWidth;
          cell.classList.add("roll");
        }
      }
    }
    /* ── СВЕТ НЕ ПРИВЯЗАН К МИНУТЕ (D-143) ────────────────────────────────
       Здесь стоял вызов paintLight(). Ход часов — это МИНУТА: раньше цифры
       не меняются, и до сюда мы доходим раз в минуту. Свет комнаты за это
       время успевает уйти далеко, и минутная стрелка догоняла его одним
       рывком — в замершей комнате это выглядело как запись в корень «сама
       по себе», и закон root-restyle-check ловил её то в одном прогоне, то
       в другом. Причина не в пороге и не в удаче: у света и у цифр РАЗНЫЙ
       ход, и связывать их нельзя. Свет ставит комната — wpTick зовёт
       sbClockLight ровно тогда, когда шов ступил (D-141). Часы рисуют
       цифры. Каждый прибор при своём предмете. */
    host.setAttribute("data-whole", whole);
    host.setAttribute("aria-label", whole);
    lastClock = whole;
  }
  /* Полная пересборка часов вынесена наружу — не ради красоты, а чтобы закон
     мог ИЗМЕРИТЬ, сколько она стоит, и сравнить с ценой обычного хода. Порог,
     назначенный на глаз, оказался бы внутри разброса. */
  window.sbRepaintClock = function () { paintClock(true); };
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "visible") paintClock(true); });

  /* ОБА ФАКТА НАЗВАНЫ СЛОВАМИ. Знак один, но заряд и связь — разные вещи, и
     ни одна не должна пропасть для того, кто читает подпись, а не рисунок. */
  function sayPower() {
    var el = $("#sbPowerGlyph");
    if (!el) return;
    var bits = [el.getAttribute("data-bat"), el.getAttribute("data-net")].filter(Boolean);
    if (!bits.length) return;
    el.setAttribute("aria-label", bits.join(" · "));
    el.title = bits.join(" · ");
  }

  /* ═══════ СВЯЗЬ · «ИНТЕРНЕТА НЕТ. НИЧЕГО НЕ ИЗМЕНИЛОСЬ» · решение D-183 ═════
     ПОВОД, дословно от основателя 27.08.2026: «нужно написать где-то как-то
     гениально и концептуально — твоя система остаётся с тобой даже тогда,
     когда нет интернета».

     ПОЧЕМУ НЕ ЛОЗУНГ, А ПОВЕДЕНИЕ. Написать эту фразу на витрине может кто
     угодно; доказать её может только тот, у кого она правда. Поэтому она
     сказана не там, где её читают, а ТАМ, ГДЕ ОНА СЛУЧАЕТСЯ: в тот самый миг,
     когда связь пропала.

     ВСЯ ПРОЧАЯ ПРОГРАММА встречает потерю сети как АВАРИЮ: красная полоса,
     «нет подключения», «повторить попытку». Для них это правда авария — их
     работа на чужом сервере. Здесь всё наоборот: сервера нет вовсе, и потеря
     сети НЕ МЕНЯЕТ РОВНО НИЧЕГО. Отсутствие сети — не поломка, а РОДНОЕ
     СОСТОЯНИЕ этой системы; подключение — исключение, а не условие.
     Поэтому система не предупреждает — она ЗДОРОВАЕТСЯ. Одной строкой, один
     раз, и никогда больше: «Интернета нет. Ничего не изменилось».

     ЧЕСТНАЯ ОГОВОРКА СТОИТ РЯДОМ, а не спрятана: Браузер без сети чужих
     страниц не покажет — они не наши. Всё остальное на месте, потому что
     всегда было здесь.

     ПОЧЕМУ ОДИН РАЗ И С ЗАДЕРЖКОЙ. Связь на телефоне мигает: в лифте, в
     метро, на краю соты. Извещение на каждое мигание — та самая тревога, от
     которой мы отказываемся. Ждём три секунды непрерывного молчания сети и
     говорим ОДИН раз за сеанс. Возвращение сети не объявляется вовсе: раз
     ничего не менялось, то и возвращаться нечему.
     Охраняется tools/offline-voice-check.mjs. */
  var netSaid = false;
  var netTimer = null;
  function paintNet() {
    var el = $("#sbPowerGlyph");
    var online = navigator.onLine !== false;
    if (el) {
      el.classList.toggle("offline", !online);
      el.setAttribute("data-net", online ? window.sbT("cc.online") : window.sbT("cc.offlineLong"));
      sayPower();
    }
    var row = $("#sbCcNet");
    if (row) row.textContent = online ? window.sbT("cc.online") : window.sbT("net.stillHere");
  }
  function greetOffline() {
    if (netSaid) return;
    netSaid = true;
    if (window.showToast) {
      try { window.showToast(window.sbT("net.gone"), window.sbT("net.nothingChanged"), "", false, "toast-calm", "event"); }
      catch (e) { /* ignore */ }
    }
  }
  function onNetChange() {
    paintNet();
    if (netTimer) { clearTimeout(netTimer); netTimer = null; }
    if (navigator.onLine === false) netTimer = setTimeout(greetOffline, 3000);
  }
  window.addEventListener("online", onNetChange);
  window.addEventListener("offline", onNetChange);
  /* Загрузка без сети — тот же случай: система уже работает, и сказать об этом
     надо ровно так же спокойно. */
  if (navigator.onLine === false) netTimer = setTimeout(greetOffline, 3000);
  window.sbNetGreeted = function () { return netSaid; };

  /* ========================================================== battery (§5) */
  function paintBattery(bat) {
    var el = $("#sbPowerGlyph"), row = $("#sbCcBattery"), line = $("#sbCcBatteryLine");
    if (!bat) {
      if (el) { el.classList.add("neutral"); el.setAttribute("data-bat", window.sbT("cc.batteryNA")); sayPower(); }
      if (row) row.textContent = "—";
      if (line) line.textContent = window.sbT("cc.battery");
      return;
    }
    var pct = Math.round((bat.level || 0) * 100);
    var ccHost = $("#sbControlCenter");
    if (ccHost) ccHost.style.setProperty("--bat", String(pct / 100));
    if (el) {
      el.style.setProperty("--fill", pct + "%");
      el.classList.toggle("charging", !!bat.charging);
      el.classList.toggle("warn", pct <= 20 && pct > 10);
      el.classList.toggle("danger", pct <= 10);
      el.setAttribute("data-bat", pct + "% — " + (bat.charging ? window.sbT("cc.charging") : window.sbT("cc.onBattery")));
      sayPower();
    }
    if (row) {
      if (window.sbAnimateFigure) window.sbAnimateFigure(row, pct, function (n) { return Math.round(n) + "%"; });
      else row.textContent = pct + "%";
    }
    if (line) {
      /* Время батареи — на языке системы (D-619): основатель увидел
         «1h 15m remaining» по-английски в русском Пульте. */
      var span = function (sec) {
        var mm = Math.round(sec / 60);
        return mm >= 60 ? window.sbT("cc.hm", { h: Math.floor(mm / 60), m: mm % 60 }) : window.sbT("cc.m", { m: mm });
      };
      if (bat.charging && isFinite(bat.chargingTime) && bat.chargingTime > 0 && bat.chargingTime !== Infinity) {
        line.textContent = window.sbT("cc.toFull", { t: span(bat.chargingTime) });
      } else if (!bat.charging && isFinite(bat.dischargingTime) && bat.dischargingTime > 0 && bat.dischargingTime !== Infinity) {
        line.textContent = window.sbT("cc.left", { t: span(bat.dischargingTime) });
      } else {
        line.textContent = bat.charging ? window.sbT("cc.charging") : window.sbT("cc.battery");
      }
      /* В крупных числах (D-742) внизу только «в сети · заряд»; время
         батареи — подсказкой при наведении. */
      var batBox = line.closest ? line.closest(".sv-bat") : null;
      if (batBox) batBox.title = line.textContent;
    }
  }
  function initBattery() {
    if (!navigator.getBattery) { paintBattery(null); return; }
    navigator.getBattery().then(function (bat) {
      paintBattery(bat);
      ["levelchange", "chargingchange", "chargingtimechange", "dischargingtimechange"].forEach(function (e) {
        bat.addEventListener(e, function () { paintBattery(bat); });
      });
    }, function () { paintBattery(null); });
  }

  /* ============================================================ tips (§5, §8)
     The sentence lives in the string table under tip.<id>, so a tip speaks
     whatever language the desktop is in. `pointer: true` marks the ones that
     describe something a finger cannot do — hovering, right-clicking, a
     keyboard chord. On a touch device those are not tips, they are false
     statements, so they are never offered there. */
  var TIPS = [
    /* The first thing this desktop says is why it exists: who makes it and
       what else they build. Прежде здесь была подсказка о работах клиентов
       (D-066 → раздел «Избранные проекты»); с D-354 работы временно сняты, и
       первое слово ведёт в build на первый экран. */
    { id: "studio", panel: null, app: "build" },
    { id: "inlinesearch", panel: null, pointer: true },
    { id: "cmdk", panel: null, pointer: true },
    { id: "stickynotes", panel: null },
    /* v66: заметка выросла в окно (D-111) — подсказки обязаны расти вместе
       с системой, о чём основатель просил отдельно: «прошу постоянно
       обновлять информацию в подсказках». */
    { id: "notefull", panel: null },
    { id: "windowspanel", panel: "sbTaskOverlay", pointer: true },
    { id: "appshortcuts", panel: "sbShortcutsOverlay", pointer: true },
    { id: "shortcutslist", panel: "sbShortcutsOverlay", pointer: true },
    { id: "snap", panel: null },
    { id: "iconhide", panel: null, pointer: true },
    { id: "privacy", panel: null },
    { id: "clip", panel: "sbClipOverlay" },
    { id: "diag", panel: "sbDiagOverlay" },
    { id: "echoes", panel: null },
    { id: "layouts", panel: "sbLayoutsOverlay" }
  ];

  function touchOnly() {
    return doc.documentElement.classList.contains("is-touch");
  }

  /* Имя комнаты в подсказке — то, как ОС зовёт её сейчас и на сегодняшнем
     языке (tipLine ниже): подсказка и значок не расходятся. */
  var TIP_KEY = "sysbaby.tips.seen";
  var currentTip = null, hintRequested = false;

  function tipsSeen() { var v = readJSON(TIP_KEY, []); return Array.isArray(v) ? v : []; }
  function markTip(id) {
    var seen = tipsSeen();
    if (seen.indexOf(id) !== -1) return;
    seen.push(id);
    writeJSON(TIP_KEY, seen);
  }

  /* Every tip this device can honestly give. On touch that is a shorter list
     than on a desktop, and the bulb retires when THAT list runs out — not
     when a list containing tips the visitor could never act on runs out. */
  function offerable() {
    var pointerless = touchOnly();
    return TIPS.filter(function (t) { return !(pointerless && t.pointer); });
  }

  /* The studio tip leads once per session: the first thing the desktop
     says is why it exists. After that it goes back into the shuffle with the
     rest — leading every cycle would be nagging, not teaching. */
  var studioLed = false;
  function nextTip() {
    var seen = tipsSeen();
    var unseen = offerable().filter(function (t) { return seen.indexOf(t.id) === -1; });
    if (!unseen.length) return null;
    if (!studioLed) {
      studioLed = true;
      for (var i = 0; i < unseen.length; i++) if (unseen[i].id === "studio") return unseen[i];
    }
    return unseen[Math.floor(Math.random() * unseen.length)];
  }
  function nextTipLeft() { var seen = tipsSeen(); return offerable().some(function (t) { return seen.indexOf(t.id) === -1; }); }

  /* ── ПОДСКАЗКУ ГОВОРИТ ГОЛОС (D-822) ─────────────────────────────────
     Решение основателя 11.11.2026: «теперь точно не будут всплывать
     абсолютно никакие оповещения, никакие подсказки, кроме самого голоса».
     Своей плашки у подсказки (#sbDeskHint: лампочка, слова, крестик) больше
     нет — слова говорит голос дома (core/voice.js), по тому же расписанию
     (первое слово при входе, шёпот по поведению не чаще раза в полторы
     минуты, D-347) и по той же лампочке в Центре управления. Имя комнаты
     в подсказке («build — небольшая студия…») — слово-кнопка: открывает её.
     Касание самих слов — то же, что прежнее касание плашки: открыть то, о
     чём подсказка, и запомнить её выученной. Растаяла сама — не выучена:
     вправе прийти ещё раз (не больше SELF_MAX). Пришедшая сама — не
     пишется в выпуск: это не событие. Охраняется tools/only-voice-check.mjs. */
  var tipHandle = null, tipActed = false;
  function tipLine(tip) {
    var id = tip.id, s = window.sbT("tip." + id);   /* семья tip. собирается здесь (dead-words-check) */
    return String(s).replace(/[\[\]]/g, "").replace(/\{(\w+)\}/g, function (m, app) {
      var name = window.sbAppTitle ? window.sbAppTitle(app) : app;
      return tip.app === app ? "[" + name + "]" : name;
    });
  }
  function tipAct(tip) {
    tipActed = true;
    markTip(tip.id);
    if (tip.panel && window.sbPanels && window.sbPanels[tip.panel]) window.sbPanels[tip.panel].open();
    else if (tip.id === "inlinesearch" && window.sbSeekReveal) window.sbSeekReveal();
    else if (tip.id === "studio") {
      if (typeof window.sbOpenBuildAt === "function") window.sbOpenBuildAt(null);
      else if (window.toggleApp) window.toggleApp("build");
    }
    else if (tip.id === "echoes" && window.toggleApp) window.toggleApp("echoes");
    else if (tip.id === "cmdk" && window.openCmdk) window.openCmdk("");
  }
  function showTip(tip) {
    var V = window.sbVoice;
    if (!tip || !V || typeof V.say !== "function") return false;
    var requested = hintRequested;
    /* Человек вызвал подсказку — пришедшее само уступает ей (v47.1);
       пришедшая сама никого не вытесняет: шёпот ждёт свободной линии
       (busyLine), D-252. */
    if (requested && window.sbToastsYield) window.sbToastsYield();
    tipActed = false;
    var h = V.say(tipLine(tip), {
      user: requested,
      hold: reduced() ? 3200 : 6800,
      on: function () { tipAct(tip); },
      melt: function () {
        if (tipHandle !== h) return;
        tipHandle = null; currentTip = null;
        hintRequested = false;
        /* вытеснен другой фразой раньше срока и не тронут — не считается
           сказанным (D-347); голос просто умолк (ворота, тишина) — сказан */
        if (!requested && !tipActed) setTimeout(function () {
          var V2 = window.sbVoice, st = V2 && V2.state ? V2.state() : null;
          if (st && st.speaking) unsayIfUnread();
        }, 0);
      }
    });
    if (!h) return false;
    h.el.setAttribute("data-tip", tip.id);   /* какая именно — читают законы (D-347) */
    h.el.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("button")) return;
      tipAct(tip);
    });
    currentTip = tip; tipHandle = h; hintRequested = requested;
    return true;
  }
  function hideTip() {
    var h = tipHandle;
    tipHandle = null; currentTip = null; hintRequested = false;
    if (h && h.dismiss) h.dismiss();
  }
  /* Что голос сейчас говорит подсказкой — для законов (вместо прежней плашки). */
  window.sbDeskTip = function () {
    return currentTip && tipHandle ? { id: currentTip.id, text: tipLine(currentTip).replace(/[\[\]]/g, ""), requested: !!hintRequested, el: tipHandle.el } : null;
  };

  /* ── ОДНО МЕСТО РЕЧИ: ИЗВЕЩЕНИЕ ВЫТЕСНЯЕТ САМОПРИШЕДШУЮ ПОДСКАЗКУ (v66) ──
     Повод, дословно от основателя 25.08.2026: «оповещения должны
     отображаться в блоке подсказок». У стола теперь один голос и одно
     место, откуда он говорит, — линия над полкой. Кто говорит — решает
     правило v47.1, симметрично достроенное: явно запрошенное важнее
     пришедшего само. Подсказку, которую человек ВЫЗВАЛ лампочкой,
     извещение не перебивает; подсказка, пришедшая по расписанию, уступает
     извещению — оно свежее. */
  window.sbDeskHintYield = function () {
    if (!currentTip || hintRequested) return false;
    hideTip();
    unsayIfUnread();
    return true;
  };
  /* Retiring is not the same as hiding: nothing left to teach, so the bulb
     goes too. Silently — a notice saying "no more notices" is still a notice. */
  function retireTips() {
    hideTip();
    var bulb = $("#sbTipBulb");
    if (bulb) bulb.classList.add("retired");
  }

  /* ── ТИШИНА И ОТКРЫТИЕ · решение D-347 ──────────────────────────────────
     ПОВОД — задание основателя «DESIGN TRANSCENDENCE PROTOCOL» 29.09.2026:
     §7 «не заставляйте её болтать», §18 «цифровая тишина как инструмент»,
     §21–24 «интерфейс, который исчезает по мере понимания; уровни глубины;
     система приглашает к исследованию своим поведением, а не всплывашкой
     „попробуйте эту функцию!“».
     ЧТО БЫЛО. Стол говорил по расписанию: подсказка через 3,4 с после
     входа, 6,8 с на экране, 0,7 с пауза — и следующая, и следующая, пока
     человек не закроет каждую из пятнадцати. Полторы минуты монолога при
     каждом входе, и предмет разговора выбирал жребий, а не то, что человек
     делает. Это и есть «интерфейс, который кричит».
     ЧТО СТАЛО. Стол сам говорит ОДИН раз при входе (первое слово — зачем
     всё это), а дальше молчит. Следующая подсказка приходит не по часам, а
     как ответ на поведение: человек трижды открыл комнату рукой — стол
     тихо говорит про ⌘K; передвинул два окна — про прикрепление к краю;
     впервые выбросил — про Эхо; второй раз скопировал — про историю буфера.
     Так знание раскрывается слоями (пять уровней в LEAD) и только тем, кому
     оно уже нужно; о том, чем человек уже пользуется, стол не говорит
     никогда. Лампочка в панели по-прежнему отдаёт всё оставшееся по просьбе.
     Шёпот не громче извещения: при открытой панели, при извещении на
     линии и в скрытой вкладке он ждёт; между двумя шёпотами — не меньше
     полутора минут; каждая подсказка сама приходит не больше двух раз.
     Считается только то, что нужно для этих порогов, только здесь, только
     на этом устройстве (sysbaby.tips.counts) — не слежка, а память двери.
     Охраняется tools/silence-discovery-check.mjs. */
  var COUNTS_KEY = "sysbaby.tips.counts";
  /* ПОСТОЯННЫЕ: пороги поведения — числа о человеке, а не о составе системы.
     Три открытия рукой — уже привычка, о которой стоит сказать; два
     передвинутых окна — человек строит стол; девяносто секунд — не чаще,
     чем говорил бы внимательный сосед по комнате. */
  var WHISPER_GAP_MS = 90000, SELF_MAX = 2;
  /* СЧЁТ ПИШЕТСЯ, КОГДА ЧЕЛОВЕК УХОДИТ, А НЕ ПОКА ОН ЗДЕСЬ. Замок стоит на
     границе хранилища: каждая запись при запертом замке — новая запись на
     диске. Доска v170 поймала это в vault-window-check: оборот повернул
     четыре конверта, а на диске изменилось пять — пятым был этот счёт,
     записанный посреди чужого замера. Поэтому в памяти модуля живут только
     ПРИРАЩЕНИЯ (delta), а на диск они уходят одной записью при уходе со
     страницы или в скрытую вкладку. Хранимое читается каждый раз заново —
     через sbDB, который сам знает эпоху замка (D-274): своей копии памяти у
     модуля нет, значит, нечему устареть. Пока замок заперт и не открыт,
     запись не делается вовсе: приращения подождут открытия. */
  var delta = {};
  function stored() { var v = readJSON(COUNTS_KEY, {}); return (v && typeof v === "object") ? v : {}; }
  function merged(base, d) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k) && k !== "self") out[k] = Number(base[k]) || 0;
    for (k in d) if (Object.prototype.hasOwnProperty.call(d, k) && k !== "self") out[k] = (out[k] || 0) + (Number(d[k]) || 0);
    out.self = {};
    var bs = base.self || {}, ds = d.self || {};
    for (k in bs) if (Object.prototype.hasOwnProperty.call(bs, k)) out.self[k] = Number(bs[k]) || 0;
    for (k in ds) if (Object.prototype.hasOwnProperty.call(ds, k)) out.self[k] = Math.max(0, (out.self[k] || 0) + (Number(ds[k]) || 0));
    return out;
  }
  function counts() { return merged(stored(), delta); }
  function bump(k, n) { delta[k] = (Number(delta[k]) || 0) + (n == null ? 1 : n); return counts()[k]; }
  function flushCounts() {
    var has = false, k;
    for (k in delta) if (Object.prototype.hasOwnProperty.call(delta, k)) { has = true; break; }
    if (!has) return;
    if (window.sbDB && window.sbDB.closed && window.sbDB.closed()) return;   /* за дверью — подождёт */
    writeJSON(COUNTS_KEY, merged(stored(), delta));
    delta = {};
    if (window.sbDB && window.sbDB.flushSync) window.sbDB.flushSync();
  }
  window.addEventListener("pagehide", flushCounts);
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") flushCounts(); });
  /* Уровни глубины: что, по какому поведению, и что считается «уже умеет». */
  var LEAD = [
    /* Подсказка о build — только при ПЕРВОМ входе (основатель 09.11.2026,
       решение D-632): «иначе навязывание». Счёт входов уже включает этот. */
    { id: "studio",        level: 1, once: true, when: function (c) { return (c.entries || 0) <= 1; } },
    { id: "privacy",       level: 1, when: function (c) { return (c.roomsOut || 0) >= 1; } },
    { id: "stickynotes",   level: 1, when: function (c) { return (c.entries || 0) >= 2; } },
    { id: "cmdk",          level: 2, when: function (c) { return (c.pointerOpens || 0) >= 3; } },
    { id: "notefull",      level: 2, when: function (c) { return (c.notes || 0) >= 1; } },
    { id: "windowspanel",  level: 2, when: function (c) { return Object.keys(window.openWindows || {}).length >= 3; } },
    { id: "snap",          level: 3, when: function (c) { return (c.drags || 0) >= 2; } },
    { id: "echoes",        level: 3, when: function (c) { return (c.thrown || 0) >= 1; } },
    { id: "clip",          level: 3, when: function (c) { return (c.copies || 0) >= 2; } },
    { id: "appshortcuts",  level: 4, when: function (c) { return (c.pointerOpens || 0) >= 6; } },
    { id: "shortcutslist", level: 4, when: function (c) { return (c.cmdk || 0) >= 2; } },
    { id: "iconhide",      level: 4, when: function (c) { return (c.entries || 0) >= 4; } },
    { id: "layouts",       level: 4, when: function (c) { return (c.drags || 0) >= 6; } },
    { id: "inlinesearch",  level: 4, when: function (c) { return (c.pointerOpens || 0) >= 9; } },
    { id: "diag",          level: 5, when: function () { return false; } }   /* только по просьбе */
  ];
  window.sbTipLevels = function () { return LEAD.map(function (l) { return { id: l.id, level: l.level }; }); };
  var lastWhisperAt = 0, greeted = false;
  function busyLine() {
    /* Под занавесом и до того, как встал стол, слова никто не прочтёт. */
    if (doc.getElementById("sbCurtain") || !root.classList.contains("rv-icons")) return true;
    return doc.visibilityState === "hidden" || !!doc.querySelector("#toastLayer .toast") ||
      (window.sbAnyPanelOpen && window.sbAnyPanelOpen()) || (window.sbControlCenterOpen && window.sbControlCenterOpen()) || !!currentTip;
  }
  function selfShown(id) { var c = counts(); return Number((c.self || {})[id]) || 0; }
  /* Сколько раз подсказка вправе прийти сама: «once» — один раз (D-632). */
  function selfMax(id) { for (var i = 0; i < LEAD.length; i++) if (LEAD[i].id === id && LEAD[i].once) return 1; return SELF_MAX; }
  function markSelf(id, n) { delta.self = delta.self || {}; delta.self[id] = (Number(delta.self[id]) || 0) + (n == null ? 1 : n); }
  /* Шёпот: сказать одну подсказку, если ей есть повод и есть право. */
  function whisper(id) {
    if (busyLine()) return false;
    if (Date.now() - lastWhisperAt < WHISPER_GAP_MS) return false;
    var seen = tipsSeen();
    if (seen.indexOf(id) !== -1 || selfShown(id) >= selfMax(id)) return false;
    var tip = null;
    offerable().forEach(function (t) { if (t.id === id) tip = t; });
    if (!tip) return false;
    hintRequested = false;   /* пришла сама — уступит извещению */
    lastWhisperAt = Date.now();
    whisperedAt = lastWhisperAt; whisperedId = id;
    markSelf(id);
    /* срок держит сам голос (hold в showTip): своих часов у шёпота нет */
    if (!showTip(tip)) { markSelf(id, -1); lastWhisperAt = 0; whisperedId = null; return false; }
    return true;
  }
  /* Шёпот, вытесненный извещением раньше, чем он договорил (полный срок
     показа), не считается сказанным: он вернётся, когда линия освободится. */
  var whisperedAt = 0, whisperedId = null;
  function unsayIfUnread() {
    if (!whisperedId || Date.now() - whisperedAt > (reduced() ? 3200 : 6800)) return;
    markSelf(whisperedId, -1);
    lastWhisperAt = 0;
    var again = whisperedId; whisperedId = null;
    setTimeout(function () { if (due() === again) whisper(again); }, 7000);
  }
  /* Что поведение уже заслужило: первый по уровню повод, о котором ещё не
     сказано. Уровень выше не открывается раньше нижнего. */
  function due() {
    var c = counts(), seen = tipsSeen(), canOffer = {};
    offerable().forEach(function (t) { canOffer[t.id] = true; });
    for (var i = 0; i < LEAD.length; i++) {
      var l = LEAD[i];
      var offered = !!canOffer[l.id];
      if (!offered || seen.indexOf(l.id) !== -1 || selfShown(l.id) >= selfMax(l.id)) continue;
      var ok = false;
      try { ok = !!l.when(c); } catch (e) { ok = false; }
      if (ok) return l.id;
    }
    return null;
  }
  /* Ответ на поведение — только после первого слова: стол, который ещё не
     сказал, зачем он, не начинает с середины. */
  function consider() {
    if (!greeted || greetTimer) return;
    var id = due();
    if (id) whisper(id);
  }
  window.sbTipConsider = consider;
  /* Первое слово при входе — одно, и только если стол ещё не сказал, зачем он. */
  /* Зовут отсюда трижды (стол встал, запасные шесть секунд, смена
     движения) — а срок у первого слова один, и своя рука: второй зов
     не должен снимать срок первого и молчать. */
  var greetTimer = null;
  function scheduleTips() {
    if (greeted) return;
    greeted = true;
    if (greetTimer) clearTimeout(greetTimer);
    greetTimer = setTimeout(function () {
      greetTimer = null;
      if (busyLine()) { greeted = false; setTimeout(scheduleTips, 600); return; }
      if (!offerable().filter(function (t) { return tipsSeen().indexOf(t.id) === -1; }).length) { retireTips(); return; }
      var first = due();
      if (first) { lastWhisperAt = 0; whisper(first); }
    }, reduced() ? 900 : 3400);
  }
  /* Поведение, по которому стол понимает, что человеку уже нужно. */
  function wireDiscovery() {
    bump("entries");
    doc.addEventListener("pointerdown", function (ev) {
      if (ev.pointerType === "keyboard") return;
      var t = ev.target && ev.target.closest ? ev.target.closest(".dock-item, .desk-icon") : null;
      if (t) { bump("pointerOpens"); setTimeout(consider, 900); }
    }, true);
    /* Перетаскивание окна: рука взялась за заголовок и увела его. */
    var grab = null;
    doc.addEventListener("pointerdown", function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest(".titlebar") : null;
      grab = t ? { x: ev.clientX, y: ev.clientY } : null;
    }, true);
    doc.addEventListener("pointerup", function (ev) {
      if (!grab) return;
      var moved = Math.hypot(ev.clientX - grab.x, ev.clientY - grab.y);
      grab = null;
      if (moved > 30) { bump("drags"); setTimeout(consider, 600); }
    }, true);
    doc.addEventListener("keydown", function (ev) {
      if ((ev.metaKey || ev.ctrlKey) && String(ev.key || "").toLowerCase() === "k") { bump("cmdk"); setTimeout(consider, 600); }
      if ((ev.metaKey || ev.ctrlKey) && /^[a-z]$/i.test(String(ev.key || "")) && String(ev.key).toLowerCase() !== "k") markTip("appshortcuts");
      if (ev.key === "?" && window.sbBareKeyOk && window.sbBareKeyOk(ev)) markTip("shortcutslist");
      if ((ev.metaKey || ev.ctrlKey) && String(ev.key || "").toLowerCase() === "c") { bump("copies"); setTimeout(consider, 1200); }
    }, true);
    doc.addEventListener("copy", function () { bump("copies"); setTimeout(consider, 1200); }, true);
    if (window.sbBus) {
      window.sbBus.on("app:open", function (p) {
        var id = p && p.app;
        if (id === "echoes") markTip("echoes");
        if (id === "mail" || id === "messenger" || id === "browser" || id === "outward") bump("roomsOut");
        setTimeout(consider, 1200);
      });
      window.sbBus.on("window:opened", function () { setTimeout(consider, 1200); });
      window.sbBus.on("note:added", function () { bump("notes"); markTip("stickynotes"); setTimeout(consider, 1200); });
      window.sbBus.on("window:snapped", function () { markTip("snap"); });
    }
    /* Заметка раскрылась на весь экран — человек это уже умеет. */
    new MutationObserver(function () {
      if (root.classList.contains("sb-note-full")) markTip("notefull");
    }).observe(root, { attributes: true, attributeFilter: ["class"] });
    /* Выброшенное появляется в Эхе: первое — повод сказать, что ничто не пропало. */
    var thrownSeen = -1;
    setInterval(function () {
      if (doc.visibilityState === "hidden") return;
      var n = 0;
      try { n += window.sbNotesStore ? window.sbNotesStore.loadDeleted().length : 0; } catch (e) { /* хранилище закрыто */ }
      /* Выброшенное из Хранилища считается ТОЛЬКО ЧТЕНИЕМ записи. Здесь стоял
         вызов sbFilesDeleted, а он поднимает дерево Хранилища, и подъём дерева
         его записывает: опрос раз в четыре секунды клал на диск новый конверт
         при каждом открытии замка, где Хранилища ещё не было (доска v174,
         envelope-v3-check). Подсказка не пишет ничего, кроме своего счёта. */
      try { var ft = readJSON("sysbaby.files.v1", null); n += (ft && Array.isArray(ft.__gone)) ? ft.__gone.length : 0; } catch (e) { /* хранилища нет */ }
      if (thrownSeen === -1) { thrownSeen = n; return; }
      if (n > thrownSeen) { bump("thrown", n - thrownSeen); thrownSeen = n; setTimeout(consider, 1500); }
      else thrownSeen = n;
    }, 4000);
  }

  function wireTips() {
    wireDiscovery();
    var bulb = $("#sbTipBulb");
    /* Плашки #sbDeskHint нет (D-822): касание слов и слово-кнопка — в showTip. */
    if (bulb) {
      bulb.addEventListener("click", function () {
        /* Лампочка живёт в Центре управления (v47.3): показав подсказку,
           ЦУ закрывается — иначе подсказка выйдет под его стеклом и человек
           её не увидит. */
        if (window.sbCloseControlCenter) window.sbCloseControlCenter();
        if (!window.sbShowTipNow() && !nextTipLeft()) {
          if (window.showToast) window.showToast(window.sbT("tips.doneTitle"), window.sbT("tips.doneBody"), "");
        }
      });
    }
    if (window.sbBus) {
      window.sbBus.on("panel:open", function (p) {
        TIPS.forEach(function (t) { if (t.panel === p.id) markTip(t.id); });
      });
      window.sbBus.on("icon:visibility", function () { markTip("iconhide"); });
      /* A tip already on screen re-reads itself in the new language rather
         than sitting there in the old one. */
      window.sbBus.on("translate:done", function () {
        if (!currentTip || !tipHandle) return;
        var t = currentTip, r = hintRequested, h = tipHandle;
        tipHandle = null; currentTip = null;   /* сменяется без «не сказано» */
        if (h.dismiss) h.dismiss();
        hintRequested = r; showTip(t);
      });
    }
    doc.addEventListener("keydown", function (ev) {
      if ((ev.metaKey || ev.ctrlKey) && String(ev.key || "").toLowerCase() === "k") markTip("cmdk");
    });
  }

  /* ================================================== control center (§7) */
  var ccOpen = false;
  window.sbControlCenterOpen = function () { return ccOpen; };
  window.sbCloseControlCenter = function () {
    var cc = $("#sbControlCenter");
    if (!cc) return;
    ccOpen = false;
    cc.classList.remove("open");
    cc.setAttribute("hidden", "");
  };
  function openControlCenter() {
    var cc = $("#sbControlCenter");
    if (!cc) return;
    if (window.sbCloseAllPanels) window.sbCloseAllPanels();
    ccOpen = true;
    applyPultView();
    cc.removeAttribute("hidden");
    cc.classList.add("open");
    setCcOther(false);
    paintCc();
  }
  /* «Другое» (D-633): пульт открывается свёрнутым; нажатие разворачивает
     его — подсказка, горячие клавиши, раскладки, диагностика, «Унести дом
     с собой» / «Принести дом сюда». */
  function setCcOther(open) {
    var btn = $("#sbCcOtherBtn"), box = $("#sbCcOther"), cc = $("#sbControlCenter");
    if (!btn || !box) return;
    /* В крупных числах (D-742) «унести/принести дом» видны и в свёрнутом
       пульте, поэтому коробка не прячется целиком: свёрнутость — класс
       kn-fold, прячущий остальное. В Световоде — как было (hidden). */
    box.hidden = pultView() === "svetovod" ? !open : false;
    box.classList.toggle("kn-fold", !open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    var st = btn.querySelector(".sv-st");
    if (st) st.textContent = open ? "↑" : "↓";
    if (cc) cc.classList.toggle("sv-open", !!open);
  }
  window.sbCcOtherOpen = function (v) { if (v != null) setCcOther(!!v); var b = $("#sbCcOtherBtn"); return !!b && b.getAttribute("aria-expanded") === "true"; };
  /* «ещё 4 темы — в Настройках →»: число — из объявления системы, форма
     слова — по правилам числа своего языка (pluralKey). */
  function moreThemesText(n) { return window.sbT("cc.moreThemes", { count: n }); }

  /* ── ВИД ПУЛЬТА (D-740, D-742) ─────────────────────────────────────────
     «Крупные числа» по умолчанию, «Световод» — по выбору в Настройках.
     Вид — класс на пульте; узлы и их проводка одни. */
  function pultView() { return window.sbGetPultView ? window.sbGetPultView() : "krupno"; }
  function applyPultView() {
    var cc = $("#sbControlCenter");
    if (!cc) return;
    var v = pultView();
    cc.classList.toggle("svetovod", v === "svetovod");
    cc.classList.toggle("krupno", v !== "svetovod");
    cc.setAttribute("data-pult", v);
    setCcOther(window.sbCcOtherOpen());
  }
  doc.addEventListener("sysbaby:setting-changed", function (ev) {
    if (!ev.detail || ev.detail.kind !== "pult") return;
    applyPultView();
    if (ccOpen) paintCc();
  });

  var ccVol = null, ccBright = null;
  function paintCc() {
    ["sound", "dnd", "autohide", "motion", "transparency"].forEach(function (k) {
      var on = window.sbGetControlToggle ? window.sbGetControlToggle(k) : false;
      $$('[data-cc="' + k + '"]').forEach(function (b) {
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
    var incogBtn = $("#sbCcIncog");
    if (incogBtn) incogBtn.textContent = window.sbIncognitoActive ? window.sbT("cc.exit") : window.sbT("cc.incognito");
    var accent = window.sbGetCurrentAccent ? window.sbGetCurrentAccent() : { a1: "#5b7cff" };
    $$("[data-accent]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-accent").toLowerCase() === String(accent.a1).toLowerCase()); });
    var mood = window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio";
    /* Ряд обоев строится из живого объявления системы (D-152): в разметке его
       больше нет, и разойтись с Настройками ему негде. Перерисовывается он
       только когда состав ИЗМЕНИЛСЯ — иначе каждое открытие панели переписывало
       бы десяток узлов ни за что. */
    /* Заполнение ползунков — при каждой отрисовке панели: разметка приходит
       готовой, а событие «input» до первого касания не случается (D-156). */
    if (window.sbPaintAllRanges) window.sbPaintAllRanges($("#sbControlCenter"));
    var ccTurbo = $("#sbCcTurbo");
    if (ccTurbo && window.sbTurbo) {
      var tOn = !!window.sbTurbo();
      ccTurbo.setAttribute("aria-pressed", tOn ? "true" : "false");
      ccTurbo.classList.toggle("on", tOn);
    }
    if (window.sbPaintIris) window.sbPaintIris();
    var side = window.sbGetControlSide ? window.sbGetControlSide() : "left";
    $$("[data-side]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-side") === side); });
    var moodHost = $("#sbCcMoods");
    /* В пульте — только темы с pult: true (D-630): Тепло, Океан, Аврора,
       Праздник. Список по-прежнему из объявления системы (D-152). */
    /* В крупных числах (D-741) — строка слов из тем с words: true: тепло ·
       океан · аврора; Праздника и строки «ещё N тем» там нет. */
    var big = pultView() !== "svetovod";
    var pultMoods = (window.sbWallpaperMoods || []).filter(function (m) { return big ? m.words : m.pult; });
    var moreN = (window.sbWallpaperMoods || []).length - pultMoods.length;
    var moreBtn = $("#sbCcMoreThemes");
    if (moreBtn) { moreBtn.hidden = big || moreN <= 0; moreBtn.textContent = moreThemesText(moreN); }
    if (moodHost) {
      var ids = pultMoods.map(function (m) { return m.id; }).join(",");
      if (moodHost.getAttribute("data-built") !== ids) {
        moodHost.setAttribute("data-built", ids);
        moodHost.innerHTML = pultMoods.map(function (m) {
          var name = window.sbT("mood." + m.id);
          if (name === "mood." + m.id) name = m.name || m.id;
          /* «Остановки на жиле» (D-619): у каждой остановки узел на нити и
             имя под ним; имя переводится внутри, узел остаётся. */
          return '<button class="chip sv-stop" type="button" data-mood="' + esc(m.id) +
            '"><i class="sv-dot" aria-hidden="true"></i><span data-i18n="mood.' + esc(m.id) + '">' + esc(name) + "</span></button>";
        }).join("");
      }
    }
    var drifty = {};
    (window.sbWallpaperMoods || []).forEach(function (m) { if (m.drift) drifty[m.id] = m.session ? "session" : "drift"; });
    $$("[data-mood]").forEach(function (b) {
      var id = b.getAttribute("data-mood");
      b.classList.toggle("on", id === mood);
      /* Суточное настроение показывает цвет своего часа прямо на чипе —
         иначе оно ничем не отличается от пяти неподвижных и его снова никто
         не найдёт. Тот же знак-дуга, что у суточной краски. */
      if (!drifty[id]) return;
      b.classList.toggle("is-session", drifty[id] === "session");
      b.classList.toggle("is-drift", drifty[id] === "drift");
      var read = drifty[id] === "session" ? window.sbTherapyForTime : window.sbWallpaperForTime;
      if (typeof read !== "function") return;
      try {
        var w = read();
        /* Живой чип окрашен светом своего часа, и надпись на нём пишется
           так же, как на шве (D-324): цветом поля по углям, бумагой по
           глине. Белая буква держала 2.3 на светлом часе. */
        /* На жиле (D-619) все остановки одного вида — свет своего часа
           остановка не несёт; чтение оставлено, чтобы сбой суточного
           света по-прежнему был виден в журнале. */
        if (window.sbMoodChipLight) window.sbMoodChipLight(w);
      } catch (err) { console.error("[cc] mood preview failed", err); }
    });
    paintStops();
    /* ── СВЕТ ВЕРНУЛСЯ В ПАНЕЛЬ (D-326) ─────────────────────────────────────
       Ряд темы снимали, пока выбирать было не из чего (D-168). Теперь тем
       две, и ряд строится из объявления системы (sbThemes) — как ряд обоев
       (D-152): разойтись с Настройками ему негде. В инкогнито комната всегда
       тёмная, и ряда нет: выбор из одного не показывают. */
    var themeHost = $("#sbCcThemes"), themeBlock = $("#sbCcThemeBlock");
    var themes = window.sbThemes ? window.sbThemes() : [];
    if (themeBlock) themeBlock.hidden = !!window.sbIncognitoActive || themes.length < 2;
    if (themeHost && themeHost.getAttribute("data-built") !== themes.join(",") + "|" + lang()) {
      themeHost.setAttribute("data-built", themes.join(",") + "|" + lang());
      themeHost.innerHTML = themes.map(function (id) {
        return '<button class="chip" type="button" data-theme-chip="' + esc(id) + '" data-i18n="theme.' + esc(id) + '">' + esc(window.sbT("theme." + id)) + "</button>";
      }).join("");
    }
    var themeNow = window.sbGetTheme ? window.sbGetTheme() : "dark";
    $$("[data-theme-chip]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme-chip") === themeNow); });
    /* Sliders and the language selector are settings too — they repaint from
       the same stored truth as the toggles, or the panel shows stale values
       after Pulse moves them. */
    /* Ползунки наши (D-162): значение ставится через их же ручку, а не через
       .value чужого поля. Пока палец держит ползунок, его не трогают — иначе
       панель спорила бы с рукой. */
    if (ccVol && !ccVol.el.classList.contains("held")) {
      ccVol.set(Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100));
    }
    if (ccBright && !ccBright.el.classList.contains("held") && window.sbGetBrightness) {
      ccBright.set(window.sbGetBrightness());
    }
    paintLangRow();
    paintRowStates();
    paintSliderVals();
    paintNet();
  }

  /* ── ЖИЛА «СВЕТОВОДА» (D-619) ─────────────────────────────────────────
     Вид, а не устройство: состояния читаются из тех же узлов, что и прежде
     (on / aria-pressed), и только называются словами «вкл./выкл.». */
  function paintRowStates() {
    $$("#sbControlCenter .sv-rows .sv-row").forEach(function (b) {
      var on = b.classList.contains("on") || b.getAttribute("aria-pressed") === "true";
      b.classList.toggle("on", on);
      var st = b.querySelector(".sv-st");
      if (st) st.textContent = window.sbT(on ? "cc.on" : "cc.off");
    });
  }
  function paintSliderVals() {
    var v = $("#sbCcVolumeVal"), br = $("#sbCcBrightnessVal");
    var vn = Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100);
    var bn = Math.round(window.sbGetBrightness ? window.sbGetBrightness() : 100);
    if (v) v.textContent = vn + "%";
    if (br) br.textContent = bn + "%";
    /* Крупные числа (D-742): то же число, без знака процента. */
    var vb = $("#sbCcVolumeBig"), bb = $("#sbCcBrightnessBig");
    if (vb) vb.textContent = String(vn);
    if (bb) bb.textContent = String(bn);
  }
  function paintLangRow() {
    var row = $("#sbCcLang");
    if (!row) return;
    var cur = lang();
    $$("[data-lang]", row).forEach(function (b) {
      var on = b.getAttribute("data-lang") === cur;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  /* Остановки на жиле: свет течёт по нити своего ряда от начала до
     выбранной остановки; ряды по три, ветка жилы заходит в ряд выбранной. */
  function paintStops() {
    var host = $("#sbCcMoods");
    if (!host) return;
    var stops = $$("[data-mood]", host), sel = -1;
    stops.forEach(function (b, i) { if (b.classList.contains("on")) sel = i; });
    var per = 4, row = sel < 0 ? -1 : Math.floor(sel / per);
    host.setAttribute("data-per", String(per));
    stops.forEach(function (b, i) {
      var same = Math.floor(i / per) === row;
      b.classList.toggle("lit", same && i < sel);
      b.setAttribute("aria-pressed", i === sel ? "true" : "false");
    });
    host.style.setProperty("--sv-row", String(Math.max(0, row)));
    host.classList.toggle("has-sel", sel >= 0);
  }

  function wireControlCenter() {
    var trigger = $("#sbCcTrigger"), cc = $("#sbControlCenter");
    if (!trigger || !cc) return;
    applyPultView();
    trigger.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (ccOpen) window.sbCloseControlCenter(); else openControlCenter();
    });
    doc.addEventListener("pointerdown", function (ev) {
      if (!ccOpen) return;
      if (ev.target && ev.target.closest && (ev.target.closest("#sbControlCenter") || ev.target.closest("#sbCcTrigger"))) return;
      window.sbCloseControlCenter();
    });

    $$("[data-cc]", cc).concat($$('[data-cc="motion"]')).forEach(function (btn) {
      if (btn.getAttribute("data-cc-wired") === "1") return;
      btn.setAttribute("data-cc-wired", "1");
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-cc");
        var on = !window.sbGetControlToggle(key);
        window.sbSetControlToggle(key, on);
        paintCc();
        if (key === "motion") scheduleTips();
      });
    });

    /* Ползунки строятся один раз, здесь же, где панель заводят (D-162). */
    var volHost = $("#sbCcVolumeHost", cc);
    if (volHost && window.sbSlider && !ccVol) {
      ccVol = window.sbSlider(volHost, {
        min: 0, max: 100, value: Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100),
        label: window.sbT("cc.volume"),
        onInput: function (v) {
          /* через сеттер оболочки: сохраняется и объявляется, а не живёт
             глобальной переменной на один сеанс */
          if (window.sbSetNotifVolume) window.sbSetNotifVolume(v / 100);
          else window.sbNotifVolume = clamp(v / 100, 0, 1);
          paintSliderVals();
        }
      });
    }
    var brightHost = $("#sbCcBrightnessHost", cc);
    if (brightHost && window.sbSlider && !ccBright) {
      ccBright = window.sbSlider(brightHost, {
        min: 0, max: 100, value: window.sbGetBrightness ? window.sbGetBrightness() : 100,
        label: window.sbT("cc.brightness"),
        onInput: function (v) {
          if (window.sbSetBrightness) window.sbSetBrightness(v);
          else doc.body.style.filter = "brightness(" + (0.72 + (clamp(v, 0, 100) / 100) * 0.34).toFixed(3) + ")";
          paintSliderVals();
        }
      });
    }
    /* Язык словами в строку (D-619): каждое слово — кнопка, выбранное горит.
       Имя языка пишется на нём самом и не переводится. */
    var langRow = $("#sbCcLang");
    if (langRow) {
      langRow.innerHTML = LANGS.filter(function (l) { return !l.resting; }).map(function (l) {
        return '<button class="chip" type="button" data-sb-nolang data-lang="' + l.code + '" lang="' + l.code + '">' + esc(l.label) + "</button>";
      }).join("");
      langRow.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-lang]") : null;
        if (!b) return;
        window.sbSetLang(b.getAttribute("data-lang"));
        paintCc();
      });
      paintLangRow();
    }
    var otherBtn = $("#sbCcOtherBtn");
    if (otherBtn) otherBtn.addEventListener("click", function () { setCcOther(!window.sbCcOtherOpen()); });
    var moreThemes = $("#sbCcMoreThemes");
    if (moreThemes) moreThemes.addEventListener("click", function () {
      window.sbCloseControlCenter();
      var openIt = window.sbOpenApp || window.toggleApp;
      if (typeof openIt === "function") openIt("settings");
      setTimeout(function () {
        var tab = doc.querySelector('.window[data-app="settings"] [data-section="appearance"]');
        if (tab) tab.click();
      }, 260);
    });
    /* Кнопки ряда обоев рождаются позже самой панели, поэтому слушатель
       стоит на РЯДУ, а не на каждой кнопке: иначе новая комната приходила бы
       без нажатия (D-152). */
    /* ── ЗАМОК: ОДНО НАЖАТИЕ (D-161) ──────────────────────────────────────
       Пароль спрашивается дважды: опечатка в единственном поле — это потеря
       всего написанного, и переспросить дешевле, чем объяснять потом. Если
       криптографии браузера нет, кнопка не изображает работу, а исчезает:
       нарисованный замок хуже отсутствующего. */
    var fsBtn = $("#sbCcFullscreen", cc);
    if (fsBtn) {
      if (!fsSupported()) fsBtn.hidden = true;
      fsBtn.addEventListener("click", function () { toggleFullscreen(); });
    }
    /* Турбо здесь, а не в полосе (D-167). Кнопка одна, состояние читает
       сама система: sbTurbo — единственный владелец этого знания. */
    var ccTurboBtn = $("#sbCcTurbo", cc);
    if (ccTurboBtn) {
      ccTurboBtn.addEventListener("click", function () {
        if (!window.sbTurbo) return;
        window.sbTurbo(!window.sbTurbo());
        paintCc();
      });
    }
    var sideRow = $("#sbCcSide", cc);
    if (sideRow) {
      sideRow.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-side]") : null;
        if (!b || !window.sbSetControlSide) return;
        window.sbSetControlSide(b.getAttribute("data-side"));
        paintCc();
      });
    }
    var moodRow = $("#sbCcMoods", cc);
    if (moodRow) {
      moodRow.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-mood]") : null;
        if (!b) return;
        if (window.sbSetWallpaperMood) window.sbSetWallpaperMood(b.getAttribute("data-mood"));
        paintCc();
      });
    }
    var themeRowCc = $("#sbCcThemes", cc);
    if (themeRowCc) {
      themeRowCc.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-theme-chip]") : null;
        if (!b) return;
        if (window.setTheme) window.setTheme(b.getAttribute("data-theme-chip"), { shutters: true });
        paintCc();
      });
    }

/* Нативный выбор цвета убран.
   ---------------------------------------------------------------------------
   <input type="color"> открывает СИСТЕМНОЕ окно Android или macOS — чужой
   диалог поверх собственной системы, со своим языком, своей палитрой из восьми
   базовых цветов и кнопкой «Set». Это ровно то, чего sys.baby не делает: чужая
   поверхность, выданная за свою. Плюс на телефоне он занимает пол-экрана ради
   выбора оттенка, который всё равно должен лежать в палитре проекта.
   Остаются готовые оттенки — свои, названные, в языке системы. */
    /* Ряда красок в Центре управления больше нет: шов приходит от обоев,
       и ряд обоев ниже — единственный выбор цвета (D-141). */

    var incogBtn = $("#sbCcIncog");
    if (incogBtn) {
      incogBtn.addEventListener("click", function () {
        window.sbCloseControlCenter();
        if (window.sbIncognitoActive) {
          try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
          location.reload();
          return;
        }
        if (window.sbOpenIncognitoGate) window.sbOpenIncognitoGate();
      });
    }
    var shieldBtn = $("#sbIncogBtn");
    if (shieldBtn) shieldBtn.addEventListener("click", function () {
      if (window.sbIncognitoActive) {
        try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
        location.reload();
        return;
      }
      if (window.sbOpenIncognitoGate) window.sbOpenIncognitoGate();
    });

    var signout = $("#sbCcSignOut");
    if (signout) signout.addEventListener("click", function () { window.sbCloseControlCenter(); if (window.sbSignOut) window.sbSignOut(); });

    var exportBtn = $("#sbCcExport");
    if (exportBtn) exportBtn.addEventListener("click", function () {
      if (!window.sbDownloadExport) return;
      if (window.sbDB) window.sbDB.flushSync();
      /* Выгрузка при замке запечатана и требует свежего подтверждения (D-307,
         D-308): sbDownloadExport вернёт {presence:true}, тогда спрашиваем. */
      Promise.resolve(window.sbDownloadExport()).then(function (res) {
        if (res && res.presence && window.sbAskPresence) {
          return window.sbAskPresence().then(function (okp) { return okp ? window.sbDownloadExport() : null; });
        }
        return res;
      }).then(function (res) {
        if (!res || !window.showToast) return;
        if (res.ok) window.showToast("Profile exported", (res.sealed ? "sealed · " : "") + res.count + " keys" + (res.name ? " → " + res.name : ""), "");
        else if (res.error) window.showToast("Export", res.error, "", true, "toast-warn", "event");
      });
    });
    var importBtn = $("#sbCcImport"), importInput = $("#sbCcImportFile");
    if (importBtn && importInput) {
      importBtn.addEventListener("click", function () { importInput.click(); });
      importInput.addEventListener("change", function () {
        var f = importInput.files && importInput.files[0];
        if (!f) return;
        var mode = ($("#sbCcImportMerge") && $("#sbCcImportMerge").checked) ? "merge" : "replace";
        f.text().then(function (text) {
          var res = window.sbImportProfile(text, { mode: mode });
          if (!res.ok && window.showToast) window.showToast("Import refused", res.error, "", true, "toast-warn", "event");
          else if (window.showToast) window.showToast("Profile imported", res.count + " keys restored — reloading.", "");
        }).catch(function (e) {
          if (window.showToast) window.showToast("Import failed", String(e && e.message || e), "", true, "toast-warn", "event");
        });
        importInput.value = "";
      });
    }

    var turbo = $("#sbTurbo");
    if (turbo && turbo.getAttribute("data-cc-wired") !== "1") {
      turbo.setAttribute("data-cc-wired", "1");
      turbo.addEventListener("click", function () {
        window.sbSetControlToggle("motion", !window.sbGetControlToggle("motion"));
        paintCc();
        scheduleTips();
      });
    }
  }

  /* ====================================================== session timer (§5) */
  var TIMER_KEY = "sysbaby.sessiontimer.pref";
  var timerState = { armed: false, deadline: 0, tick: null, badge: null };

  function timerPref() {
    var v = readJSON(TIMER_KEY, null);
    if (!v || typeof v !== "object") return { sec: 300, windows: true, notes: true };
    return { sec: num(v.sec, 300), windows: v.windows !== false, notes: v.notes !== false };
  }

  function disarmTimer() {
    timerState.armed = false;
    if (timerState.tick) { clearInterval(timerState.tick); timerState.tick = null; }
    if (timerState.badge && timerState.badge.parentNode) timerState.badge.parentNode.removeChild(timerState.badge);
    timerState.badge = null;
  }

  function armTimer(pref) {
    if (!pref.sec || (!pref.windows && !pref.notes)) {
      if (window.showToast) window.showToast("Nothing to clear", "Pick an interval and at least one thing to clear.", "");
      return false;
    }
    disarmTimer();
    timerState.armed = true;
    timerState.deadline = Date.now() + pref.sec * 1000;
    var badge = doc.createElement("button");
    badge.type = "button";
    badge.id = "sbTimerBadge";
    badge.className = "fixed-badge";
    badge.title = "Click to cancel the session timer";
    doc.body.appendChild(badge);
    timerState.badge = badge;
    badge.addEventListener("click", function () {
      disarmTimer();
      if (window.showToast) window.showToast("Timer cancelled", "Nothing will be cleared.", "");
    });
    function reset() { if (timerState.armed) timerState.deadline = Date.now() + pref.sec * 1000; }
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (e) { doc.addEventListener(e, reset, true); });
    timerState.tick = setInterval(function () {
      var left = Math.max(0, Math.round((timerState.deadline - Date.now()) / 1000));
      var m = Math.floor(left / 60), s = left % 60;
      badge.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      badge.classList.toggle("urgent", left <= 30);
      if (left <= 0) {
        if (pref.windows && window.openWindows) Object.keys(window.openWindows).forEach(function (id) { window.closeWindow(id); });
        if (pref.notes && window.sbNotesStore) window.sbNotesStore.load().forEach(function (n) { window.sbNotesStore.softDelete(n.id); });
        disarmTimer();
        if (window.showToast) window.showToast("Session cleared", "Windows and notes are recoverable in Echoes.", "", true, "", "event");
      }
    }, 1000);
    return true;
  }

  function wireSessionTimer() {
    var btn = $("#sbTimerBtn"), pop = $("#sbTimerPop");
    if (!btn || !pop) return;
    var pref = timerPref();
    var sel = $("#sbTimerSec", pop), cw = $("#sbTimerWindows", pop), cn = $("#sbTimerNotes", pop), arm = $("#sbTimerArm", pop);
    if (sel) sel.value = String(pref.sec);
    if (cw) cw.checked = pref.windows;
    if (cn) cn.checked = pref.notes;
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      pop.hidden = !pop.hidden;
    });
    doc.addEventListener("pointerdown", function (ev) {
      if (pop.hidden) return;
      if (ev.target && ev.target.closest && (ev.target.closest("#sbTimerPop") || ev.target.closest("#sbTimerBtn"))) return;
      pop.hidden = true;
    });
    if (arm) arm.addEventListener("click", function () {
      var p = { sec: num(sel && sel.value, 300), windows: !!(cw && cw.checked), notes: !!(cn && cn.checked) };
      writeJSON(TIMER_KEY, p);
      pop.hidden = true;
      if (armTimer(p) && window.showToast) window.showToast("Timer armed", "Idle for " + Math.round(p.sec / 60) + " minutes clears your desk.", "");
    });
  }

  /* =========================================================== bootstrap */
  function init() {
    /* Listeners BEFORE the first applyLang(). applyLang emits translate:done,
       and anything that subscribes afterwards misses that first emission —
       which is exactly how the desktop hint's dismiss button used to stay in
       English until the visitor changed language a second time. */
    wireMark();
    wireIdentity();
    wireControlCenter();
    wireTips();
    wireSessionTimer();
    applyLang();
    paintClock(true);
    setInterval(function () { paintClock(false); }, 1000);
    paintNet();
    initBattery();
    paintCc();
    /* Live sync: whenever ANY surface changes a setting, the Control Center
       repaints — open or closed. Closed it costs a handful of queries per
       change; skipping it left the language selector stale for exactly the
       one law that watched (outside-click had closed the panel first). */
    doc.addEventListener("sysbaby:setting-changed", function () { paintCc(); });
    doc.addEventListener("sysbaby:desktop-ready", scheduleTips);
    setTimeout(scheduleTips, 6000);
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
