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
 * build показывает саму витрину в режиме окна (?in=build) — целиком, со своим
 * меню и портфолио: приложение build и есть вся наша услуга, а не её обложка.
 * Снимается в этом режиме ровно одно — выбор языка: язык принадлежит системе,
 * выбирается снаружи и приходит в окно готовым.
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
  /* Раздел, на котором витрину нужно открыть, если её позвали адресно.
     Живёт снаружи render(), потому что просьба приходит ДО того, как окно
     существует: sbOpenBuildAt записывает сюда и открывает окно, а render
     читает при сборке адреса. Одноразовая: следующий обычный запуск витрины
     открывает её первым экраном, как и раньше. */
  var wantSection = null;

  function shopUrl() {
    var inOs = /\/os\/?$|\/os\/index\.html$/.test(location.pathname);
    var base = inOs ? "../" : "build.html";
    var lang = (window.sbLang ? window.sbLang() : "en");
    var url = base + "?in=build&lang=" + encodeURIComponent(lang);
    if (wantSection) url += "&open=" + encodeURIComponent(wantSection);
    return url;
  }

  /* Тот же договор, что у остальных приложений системы: оболочка передаёт
     окно, приложение само берёт из него тело. Ничего своего не изобретается. */
  function bodyOf(win) {
    return win && win.el ? win.el.querySelector(".window-body") : null;
  }

  function render(win) {
    var body = bodyOf(win);
    if (!body) return;
    /* Обёртка стоит и здесь, хотя корпус очищается в пустоту и его тут же
       занимает рамка витрины: восстанавливать будет нечего, ключи просто не
       найдутся. Так сделано нарочно — исключение в законе стало бы дырой,
       а единообразие стоит ноль (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(body) : null;
    body.innerHTML = "";
    if (_sbKeep) _sbKeep();
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

    /* ── ЗАПИСКА СНЯТА (v47.3) ─────────────────────────────────────────
       Здесь под витриной висела строка «build — наша услуга. Это
       единственное окно, которое можно закрыть: система останется вашей».
       Она была написана Советом для Совета — и осталась в продукте: по-русски
       поверх финского интерфейса, на снимке основателя. Он назвал это своим
       именем: «там осталась информация от приложения build», мусор.
       Мысль верна и уже сказана делом: окно закрывается, и система живёт —
       это проверяет закон os-build-app. Утверждение, доказанное поведением,
       не нуждается в подписи под собой. */
  }

  /* ── ДВЕРЬ «ОТКРЫТЬ BUILD НА РАЗДЕЛЕ» (v47.3) ──────────────────────────
   *
   * Приложение портфолио снято с рабочего стола (D-066): его карточки живут
   * теперь в разделе «Избранные проекты» витрины, и рисует их тот же общий
   * модуль (D-062). Но дорог, которые вели в портфолио, было девять — карта
   * связей, подсказка стола, два слова терминала, кнопка «назад» в окне
   * проекта, переход из Хранилища. Все они теперь зовут ЭТУ функцию.
   *
   * Почему не просто «открыть build»: человек шёл смотреть работы. Витрина,
   * открытая первым экраном, заставляет его искать раздел заново — это
   * потеря, а не переезд. Дверь называет раздел, и витрина открывает его.
   *
   * Уже открытое окно не пересоздаётся: оно выводится вперёд и получает
   * просьбу через postMessage — перезагружать живую витрину ради прокрутки
   * было бы грубо и стоило бы всей её загрузки заново.
   */
  window.sbOpenBuildAt = function (section) {
    wantSection = section || null;
    var win = (window.openWindows || {}).build;
    if (win) {
      var frame = win.el.querySelector("iframe");
      if (frame && frame.contentWindow && section) {
        try { frame.contentWindow.postMessage({ sysbaby: "open-section", section: section }, "*"); }
        catch (err) { console.error("[build] section request failed", err); }
      }
      /* Свёрнутое — вернуть; видимое — вывести вперёд. Обе двери публичные
         и уже существуют; своих копий этих правил здесь нет. */
      if (win.minimized && window.sbRestoreWindow) window.sbRestoreWindow("build");
      else if (window.toggleApp && win.minimized) window.toggleApp("build");
      return true;
    }
    if (typeof window.sbOpenApp === "function") { window.sbOpenApp("build"); return true; }
    if (typeof window.toggleApp === "function") { window.toggleApp("build"); return true; }
    return false;
  };

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

  /* Просьба витрины свернуть окно. Проверяется ПРОИСХОЖДЕНИЕ сообщения: окно
     показывает наш собственный документ с того же адреса, и слушать чужие
     страницы система не должна. */
  window.addEventListener("message", function (ev) {
    if (ev.origin !== location.origin) return;
    if (!ev.data || ev.data.sysbaby !== "minimize-build") return;
    if (window.sbMinimizeWindow) window.sbMinimizeWindow("build");
  });

  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("window:closed", function (e) {
      if (e && e.id === "build") {
        try { sessionStorage.setItem("sysbaby.build.closed", "1"); } catch (err) { /* не страшно */ }
      }
    });
  }
})();
