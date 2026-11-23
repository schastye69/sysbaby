/* sys.baby OS — Real Project viewer.
 *
 * Spec: os-apps.md section 10.
 * Было тонкой рамкой вокруг живой работы. С D-354 (03.10.2026) работы
 * временно сняты: данных работ в ОС нет, ни одна дорога сюда не ведёт, а
 * окно, открытое словом терминала или адресом, говорит правду и ведёт в
 * build. Путь рамки снят вместе с работами, а не оставлен спящим: опись
 * выходов наружу описывает живое, а не лежащее (D-235), и спящая рамка
 * стала бы дверью, которую закон обязан назвать, а окно — показать.
 * Прежний файл лежит дома, в notes Совета, и возвращается вместе с работами.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="4.6" width="17.6" height="13" rx="2"/><path d="M3.2 8.4h17.6"/><path d="M8.4 21h7.2"/><path d="M12 17.6V21"/></svg>';

  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  /* -------------------------------------------------------------- render */

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    /* Прокрутка человека переживает перерисовку — средство оболочки,
       общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    /* Кнопка называет то место, куда приведёт: build, первый экран
       (D-354). Подпись собирается из имени приложения build. */
    host.innerHTML = '<div class="app-project"><div class="pj-empty"><p>' + esc(t("pj.empty")) + "</p>" +
      '<button type="button" class="pj-btn" id="pjBack">' + esc(t("pj.back", { build: appName("build") })) + "</button></div></div>";
    if (_sbKeep) _sbKeep();
    wireBack(host);
  }

  function wireBack(host) {
    var back = host.querySelector("#pjBack");
    if (!back) return;
    back.addEventListener("click", function () {
      if (typeof window.sbOpenBuildAt === "function") {
        try { window.sbOpenBuildAt(null); return; } catch (err) { console.error("[project] open build failed", err); }
      }
      if (typeof window.toggleApp !== "function") return;
      try { window.toggleApp("build"); } catch (err) { console.error("[project] toggleApp failed", err); }
    });
  }

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка включена (retranslate ниже): правда о снятых
     работах говорится на языке человека, а не на том, с которым окно
     открылось. */
  if (typeof window.registerApp === "function") {
    window.registerApp("project", {
      /* ЧТО НУЖНО, ЧТОБЫ ДЕЛАТЬ РАБОТУ (D-243). Комната НАЗЫВАЕТ нужду;
         есть ли она — измеряет прибор, а не она сама.
         Охраняется tools/alive-check.mjs. */
      needs: [],
      /* ПРАВА НА ДИСК (D-242). С D-354 комната на диск не ходит вовсе: язык
         работы ей больше выбирать не для кого. Охраняется
         tools/room-rights-check.mjs. */
      keeps: [],
      title: "Real Project",
      retranslate: true,
      i18n: {
        ru: { title: "Живая система", label: "Живая система" },
        ee: { title: "Elav süsteem", label: "Elav süsteem" },
      },
      label: "Real Project",
      color: "linear-gradient(160deg,#3ad0a8 0%,#22a884 55%,#128063 100%)",
      icon: ICON,
      size: { w: 920, h: 700 },
      /* ПОЧЕМУ БЕЗ ЗНАЧКА — СИСТЕМЕ, А НЕ КОММЕНТАРИЮ (D-243). Здесь причина
         не стояла ВООБЩЕ: она жила в шапке файла, и в системе её не было.
         До D-354 род причины был «открывается вещью»: комнату открывала
         работа. Работ нет, и вещи, которая её откроет, тоже; по имени она
         открывается и говорит правду. Род — «отложено решением», с номером
         решения в самой причине, как у Ковчега (D-330). */
      /* Причина — ключ словаря: на экран она идёт на языке человека (D-253). */
      why: "why.project",
      deskPos: { x: 120, y: 120 },
      offDesk: "отложено решением",
      hidden: true,
      render: render
    });
  }
})();
