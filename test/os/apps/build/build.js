/* sys.baby OS — build.
 *
 * ЧТО ЭТО. Наша фирма как приложение в системе пришедшего человека.
 * Решение D-054: sys.baby OS принадлежит тому, кто пришёл; всё, что говорит о
 * НАС — витрина, услуги, работы, смета, заказ, переписка с основателем, — не
 * занимает рабочий стол восемью значками, а живёт в одном окне. В этом окне.
 *
 * ПОЧЕМУ ОКНО, А НЕ ВТОРОЙ РЕНДЕРЕР. Содержимое витрины уже написано, уже
 * покрыто пятнадцатью наборами законов и уже берёт копию из единственного
 * источника spec/data/landing-content.json. Написать рядом второй рендерер той
 * же копии значило бы завести второй источник правды — то, чем этот проект
 * платил дважды и о чём в реестре отменённого есть отдельная запись. Поэтому
 * build показывает саму витрину в режиме окна (?in=build): она прячет свой
 * собственный док, потому что док у системы один и он снаружи этого окна.
 *
 * ПОЧЕМУ ЭТО ЗАКРЫВАЕТСЯ. build — единственное приложение системы, которое
 * можно закрыть и продолжить работать. Пока продавец занимает весь рабочий
 * стол покупателя, доктрина «мы строим — владеешь ты» опровергается собой.
 * Когда витрина — одно окно среди прочих и его волен закрыть пришедший,
 * утверждение о владении перестаёт быть строчкой и становится свойством
 * интерфейса. Это самое дешёвое и самое сильное доказательство доктрины,
 * какое у проекта есть.
 *
 * Охраняется tools/os-build-app.mjs.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/></svg>';

  /* Адрес витрины относительно документа, в котором работает оболочка.
     Два места, и оба настоящие:
       · в вебе оболочка лежит в КОРНЕ (v47, D-054), витрина рядом — build.html;
       · в исходниках оболочка открывается по /os/, а витрина — уровнем выше.
     Спрашивается не память, а само расположение документа. */
  function shopUrl() {
    var inOs = /\/os\/?$|\/os\/index\.html$/.test(location.pathname);
    var base = inOs ? "../" : "build.html";
    var lang = (window.sbLang ? window.sbLang() : "en");
    return base + (inOs ? "?" : "?") + "in=build&lang=" + encodeURIComponent(lang);
  }

  /* Тот же договор, что у остальных приложений системы: оболочка передаёт
     окно, приложение само берёт из него тело. Ничего своего не изобретается. */
  function bodyOf(win) {
    return win && win.el ? win.el.querySelector(".window-body") : null;
  }

  function render(win) {
    var body = bodyOf(win);
    if (!body) return;
    body.innerHTML = "";
    body.classList.add("build-body");

    var frame = document.createElement("iframe");
    frame.className = "build-frame";
    frame.id = "sbBuildFrame";
    frame.setAttribute("title", "sys.baby — build");
    /* Витрина — наш собственный документ с того же адреса. Песочница не
       ставится: она отрезала бы формы заказа и переписку, то есть ровно то,
       ради чего окно и открывают. */
    frame.src = shopUrl();
    body.appendChild(frame);

    var note = document.createElement("div");
    note.className = "build-note";
    note.id = "sbBuildNote";
    note.textContent = "build — наша услуга. Это единственное окно, которое можно закрыть: система останется вашей.";
    body.appendChild(note);
  }

  if (window.registerApp) {
    window.registerApp("build", {
      title: "build",
      label: "build",
      i18n: {
        ru: { title: "build", label: "build" },
        ee: { title: "build", label: "build" }
      },
      color: "linear-gradient(160deg,#f0864f 0%,#e0663c 52%,#a63c1c 100%)",
      icon: ICON,
      size: { w: 980, h: 760 },
      deskPos: { x: 120, y: 120 },
      /* Язык меняется снаружи окна — витрина внутри обязана его догнать. */
      retranslate: true,
      render: render
    });
  }

  /* ── АВТООТКРЫТИЕ, И У НЕГО НАЗВАНО УСЛОВИЕ СНЯТИЯ ──────────────────────
   *
   * Основатель: «первое время, когда человек будет туда заходить, будет
   * автоматически открываться приложение build». Слова «первое время» — это
   * условие, а не оговорка вежливости. Условие, которое нигде не записано,
   * становится вечным по умолчанию: через полгода никто не вспомнит, что
   * автооткрытие было временным, и оно останется навсегда — как остаётся
   * всякая временная мера, у которой не назван день окончания.
   *
   * Поэтому условие названо здесь и проверяется машиной, а не памятью:
   * автооткрытие держится, ПОКА в системе нет ни одного пользовательского
   * приложения, которым человек действительно пользовался. Как только в
   * хранилище появляется след настоящей работы — своя смета, свой шаблон,
   * свой файл, — система перестаёт открывать нашу витрину первой, потому что
   * у человека появилось своё дело. Это и есть день, когда «первое время»
   * кончилось, и узнаётся он не спором, а фактом.
   *
   * Закрытое окно не открывается заново в том же посещении: человек, закрывший
   * витрину, сказал этим всё, что нужно.
   */
  var USED_KEYS = ["sysbaby.estimates", "sysbaby.templates", "sysbaby.promises", "sysbaby.files.v1"];

  function personHasOwnWork() {
    try {
      for (var i = 0; i < USED_KEYS.length; i++) {
        var v = window.sbDB ? window.sbDB.get(USED_KEYS[i]) : localStorage.getItem(USED_KEYS[i]);
        if (v && String(v).length > 4 && v !== "[]" && v !== "{}") return true;
      }
    } catch (e) { /* хранилище закрыто — считаем, что своего дела ещё нет */ }
    return false;
  }
  window.sbBuildAutoOpenStillOn = function () { return !personHasOwnWork(); };

  document.addEventListener("sysbaby:desktop-ready", function () {
    if (!window.sbBuildAutoOpenStillOn()) return;
    try {
      if (sessionStorage.getItem("sysbaby.build.closed") === "1") return;
    } catch (e) { /* сессия закрыта — открываем */ }
    if (window.sbOpenApp) window.sbOpenApp("build");
  }, { once: true });

  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("window:closed", function (e) {
      if (e && e.id === "build") {
        try { sessionStorage.setItem("sysbaby.build.closed", "1"); } catch (err) { /* не страшно */ }
      }
    });
  }
})();
