/*
 * outward.js — НАРУЖУ. Единственная дверь, у которой всё перечислено (D-221).
 *
 * ПОВОД, дословно от основателя: «я, кстати, придумал кое-что очень
 * гениальное. как sys.baby может получить выход в интернет. создаём
 * приложение internet. Как вам идея?»
 *
 * СОВЕТ ОТВЕТИЛ, ЧТО ТАКОЕ ПРИЛОЖЕНИЕ УЖЕ ЕСТЬ — «Браузер» — и что дальше
 * него изнутри страницы не пройти: сайты запрещают себя показывать в рамке, а
 * обойти это можно только сервером-посредником, через который пошёл бы ВЕСЬ
 * трафик человека. Тогда строка на двери — «nothing can leave us» — стала бы
 * враньём, и самым дорогим из возможных: её охраняют все остальные законы.
 *
 * ЧЕГО СИСТЕМЕ НЕ ХВАТАЛО НА САМОМ ДЕЛЕ — НЕ БРАУЗЕРА, А ДВЕРИ. Одного
 * места, где перечислено ВСЁ, что может уйти наружу: куда, что именно, кто
 * это увидит. Сегодня система почти молчит — и это её главное свойство. Но
 * впереди погода, курсы, ленты, страница релиза, синхронизация; каждая такая
 * вещь прогрызает обещание по кусочку, и однажды оно становится неправдой без
 * единого принятого решения.
 *
 * ЭТО ОКНО НИЧЕГО НЕ РЕШАЕТ САМО. Оно только показывает опись
 * shared/outward.data.js — единственный источник, который закон сверяет с
 * деревом: каждое место, откуда код ходит наружу, обязано быть в описи.
 * Опись не может вырасти молча — в этом вся работа.
 *
 * Охраняется tools/outward-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3.6v9.8M12 3.6 8.6 7M12 3.6 15.4 7"/><path d="M4.6 13.8v4.9a1.7 1.7 0 0 0 1.7 1.7h11.4a1.7 1.7 0 0 0 1.7-1.7v-4.9"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() { try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; } }

  var UI = {
    en: {
      title: "Outward", label: "Outward",
      lead: "Everything in this system that can reach outside is listed here. Nothing else does. The list is checked against the code itself — a new way out cannot appear without appearing here.",
      sideSelf: "to itself", sideThird: "to a stranger", sideHand: "you name the address",
      byItself: "goes by itself", byHand: "only when you act",
      what: "What leaves", who: "Who sees it", where: "In the code",
      on: "on", off: "off", noSwitch: "no switch — and here is why",
      honest: "What this list does not promise. It covers requests the code makes: fetches, frames, forms, images, scripts. It does not cover an ordinary link you click — its address is visible before you press it, and it carries nothing but the fact that you went. It also cannot tell you what a stranger's site does once you are there: from inside this page that is unknowable, and pretending otherwise would be the same lie this window exists to prevent.",
      none: "The list is empty — which would mean nothing here can reach outside at all.",
    },
    ru: {
      title: "Наружу", label: "Наружу",
      lead: "Здесь перечислено всё, чем эта система может дотянуться наружу. Больше ничего не дотягивается. Опись сверяется с самим кодом — новый выход не может появиться, не появившись здесь.",
      sideSelf: "к себе", sideThird: "к чужому хозяину", sideHand: "адрес называете вы",
      byItself: "ходит сама", byHand: "только по вашей руке",
      what: "Что уходит", who: "Кто это увидит", where: "Где в коде",
      on: "включено", off: "выключено", noSwitch: "выключателя нет — и вот почему",
      honest: "Чего эта опись не обещает. Она охраняет запросы, которые делает код: обращения, рамки, формы, картинки, сценарии. Она не охраняет обычную ссылку, по которой вы уходите сами: её адрес виден до нажатия, и она не уносит ничего, кроме факта перехода. И она не может сказать, что делает чужой сайт, когда вы уже там: изнутри этой страницы это узнать нельзя, а делать вид, что можно, — то же самое враньё, ради которого это окно и заведено.",
      none: "Опись пуста — это значило бы, что отсюда наружу не уходит ничего вообще.",
    },
    ee: {
      title: "Välja", label: "Välja",
      lead: "Siin on loetletud kõik, millega see süsteem saab välja ulatuda. Muud ei ulatu. Loetelu võrreldakse koodi endaga — uus väljapääs ei saa tekkida ilma siia tekkimata.",
      sideSelf: "iseendale", sideThird: "võõrale peremehele", sideHand: "aadressi ütled sina",
      byItself: "käib ise", byHand: "ainult sinu käega",
      what: "Mis läheb", who: "Kes seda näeb", where: "Kus koodis",
      on: "sees", off: "väljas", noSwitch: "lülitit ei ole — ja siin on põhjus",
      honest: "Mida see loetelu ei luba. Ta valvab päringuid, mida teeb kood: pöördumisi, raame, vorme, pilte, skripte. Ta ei valva tavalist linki, mille avad ise: selle aadress on näha enne vajutust ja ta ei vii midagi peale selle, et sa läksid. Ja ta ei oska öelda, mida teeb võõras sait, kui sa juba seal oled: seda lehe seest teada ei saa, ja teesklemine oleks sama vale, mille pärast see aken üldse on.",
      none: "Loetelu on tühi — see tähendaks, et siit ei lähe välja mitte midagi.",
    }
  };
  function T() { return UI[lang()] || UI.en; }

  function doors() {
    var d = window.SB_OUTWARD && window.SB_OUTWARD.doors;
    return Array.isArray(d) ? d : [];
  }
  /* ЧТО УХОДИТ И КТО УВИДИТ — НА ЯЗЫКЕ ЧЕЛОВЕКА (D-253). Опись держит эти
     слова на каждом языке ОС, как и заголовок; раньше они были только по-русски
     и выходили на английский экран как есть — 25 русских строк в английском
     окне. Старая форма (одна строка) принимается как русская. */
  function byLang(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    var l = lang();
    /* ОТКАТ: языка в записи нет — падаем на английский, потом на русский.
       Полнота записей на каждом языке сторожится tools/outward-check.mjs,
       так что откат — страховка от чужой правки описи, а не рабочий путь. */
    return v[l] || v.en || v.ru || "";
  }
  function titleOf(d) {
    var t = d.title || {};
    return t[lang()] || t.en || d.id;
  }
  function stateOf(d) {
    if (!d.toggle) return null;
    /* Спрашивается у системы, а не считается здесь: умолчание объявлено в
       описи, и оболочка берёт его оттуда же (D-221). */
    try { return !!(window.sbGetControlToggle && window.sbGetControlToggle(d.toggle)); }
    catch (e) { return d.default !== "off"; }
  }

  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var t = T();
    var list = doors();

    var rows = list.map(function (d) {
      var side = d.side === "third" ? t.sideThird : (d.side === "hand" ? t.sideHand : t.sideSelf);
      var auto = d.byHand === false;
      var on = stateOf(d);
      return '<section class="ow-row" data-id="' + esc(d.id) + '" data-auto="' + (auto ? "1" : "0") +
        '" data-side="' + esc(d.side) + '">' +
        '<header class="ow-head">' +
          '<h3>' + esc(titleOf(d)) + '</h3>' +
          '<span class="ow-side ow-' + esc(d.side) + '">' + esc(side) + (d.host ? ' · ' + esc(d.host) : '') + '</span>' +
        '</header>' +
        '<p class="ow-when">' + esc(auto ? t.byItself : t.byHand) + '</p>' +
        '<dl class="ow-facts">' +
          '<dt>' + esc(t.what) + '</dt><dd>' + esc(byLang(d.what)) + '</dd>' +
          '<dt>' + esc(t.who) + '</dt><dd>' + esc(byLang(d.who)) + '</dd>' +
          '<dt>' + esc(t.where) + '</dt><dd class="ow-mono">' + esc((d.where || []).join(' · ')) + '</dd>' +
        '</dl>' +
        (d.toggle
          ? '<div class="ow-switch"><button type="button" class="ow-sw' + (on ? " on" : "") +
            '" role="switch" aria-checked="' + (on ? "true" : "false") + '" data-toggle="' + esc(d.toggle) + '"><i></i></button>' +
            '<span>' + esc(on ? t.on : t.off) + '</span>' +
            (d.defaultWhy ? '<span class="ow-why">' + esc(byLang(d.defaultWhy)) + '</span>' : '') + '</div>'
          : (d.noToggleWhy
              ? '<p class="ow-noswitch"><b>' + esc(t.noSwitch) + '</b> ' + esc(byLang(d.noToggleWhy)) + '</p>'
              : '')) +
        '</section>';
    }).join("");

    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="ow-wrap">' +
        '<div class="ow-top">' +
          '<h2 class="ow-title">' + esc(t.title) + '</h2>' +
          '<p class="ow-lead">' + esc(t.lead) + '</p>' +
          '<p class="ow-count"><b>' + list.length + '</b></p>' +
        '</div>' +
        (list.length ? rows : '<p class="ow-none">' + esc(t.none) + '</p>') +
        '<p class="ow-honest">' + esc(t.honest) + '</p>' +
      '</div>';
    if (keep) keep();

    host.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-toggle]");
      if (!b) return;
      var key = b.getAttribute("data-toggle");
      var next = b.getAttribute("aria-checked") !== "true";
      if (window.sbSetControlToggle) window.sbSetControlToggle(key, next);
      render(win);
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("outward", {
      title: UI.en.title,
      label: UI.en.label,
      i18n: { ru: { title: UI.ru.title, label: UI.ru.label }, ee: { title: UI.ee.title, label: UI.ee.label } },
      color: "linear-gradient(160deg,#ffd9a0 0%,#d98a3c 52%,#4a2a10 100%)",
      icon: ICON,
      size: { w: 720, h: 700 },
      retranslate: true,
      render: render
    });
  }
})();
