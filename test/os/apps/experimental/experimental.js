/* =============================================================================
   Experimental — the bench.

   Not every system in this studio is a delivered one. Some are built to find
   out whether a thing is possible at all, and they run here rather than
   waiting in a folder for a version number. Phosphor is the first: a hand-
   written renderer with no engine and no dependency behind it, playable in
   the state it is actually in.

   The framing matters. This is not a portfolio card with a screenshot and a
   promise — it is the work itself, unfinished, and it says so. The one thing
   this window must never do is pretend the bench is a shipped product.

   It embeds exactly like the delivered systems do: one iframe, one declared
   path, no derivation. Whatever else changes, the running thing is running.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<path d="M9 3h6M10 3v6.2L5.6 17.4A2 2 0 0 0 7.4 20.4h9.2a2 2 0 0 0 1.8-3L14 9.2V3"/>' +
    '<path d="M8.6 14h6.8"/></svg>';

  function esc(s) {
    return (window.escapeHtml || function (v) { return String(v == null ? "" : v); })(s);
  }
  function lang() {
    try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; }
  }

  /* Every string this window can say, in the three languages the OS speaks.
     The bench is described, never sold. */
  var STRINGS = {
    en: {
      title: "Experimental",
      label: "Experimental",
      kicker: "The bench",
      lead: "Work built to answer a question rather than to be delivered. It runs here in the state it is actually in.",
      name: "Phosphor",
      sub: "Real-time renderer · in development",
      note: "No engine, no framework, no dependency: one canvas and the arithmetic behind it. It is on the bench because the question it was built to answer — how much can be drawn honestly in a browser with nothing underneath it — is not finished being answered.",
      status: "In development",
      open: "Run it",
      close: "Back to the bench",
      hint: "Touch or move the pointer. It responds to both."
    },
    ru: {
      title: "Экспериментальное",
      label: "Экспериментальное",
      kicker: "Стенд",
      lead: "Работы, сделанные чтобы ответить на вопрос, а не чтобы их сдать. Здесь они запускаются в том состоянии, в котором есть.",
      name: "Phosphor",
      sub: "Рендерер реального времени · в разработке",
      note: "Ни движка, ни фреймворка, ни единой зависимости: один холст и арифметика за ним. Он на стенде, потому что вопрос, ради которого он написан — сколько можно честно нарисовать в браузере, не опираясь ни на что, — ещё не получил ответа.",
      status: "В разработке",
      open: "Запустить",
      close: "Назад на стенд",
      hint: "Касание или указатель — реагирует на оба."
    },
    ee: {
      title: "Eksperimentaalne",
      label: "Eksperimentaalne",
      kicker: "Tööpink",
      lead: "Tööd, mis on tehtud küsimusele vastamiseks, mitte üleandmiseks. Siin töötavad nad täpselt selles seisus, milles nad on.",
      name: "Phosphor",
      sub: "Reaalaja renderdaja · arenduses",
      note: "Ei mootorit, ei raamistikku, ei ühtegi sõltuvust: üks lõuend ja aritmeetika selle taga. Ta on tööpingil, sest küsimus, mille jaoks ta kirjutati — kui palju saab brauseris ausalt joonistada, ilma millelegi toetumata — pole veel vastust saanud.",
      status: "Arenduses",
      open: "Käivita",
      close: "Tagasi tööpingile",
      hint: "Puude või kursor — reageerib mõlemale."
    }
  };

  function T() { return STRINGS[lang()] || STRINGS.en; }

  var DEMO = "apps/experimental/phosphor.html";

  function render(win) {
    var host = win.el.querySelector(".window-body");
    if (!host) return;
    var t = T();
    var running = win._xpRunning === true;

    host.innerHTML =
      '<div class="xp-root' + (running ? " running" : "") + '">' +
        '<header class="xp-head">' +
          '<span class="xp-kicker">' + esc(t.kicker) + "</span>" +
          '<p class="xp-lead">' + esc(t.lead) + "</p>" +
        "</header>" +

        '<section class="xp-card">' +
          '<div class="xp-card-top">' +
            '<div class="xp-id">' +
              '<h3 class="xp-name">' + esc(t.name) + "</h3>" +
              '<p class="xp-sub">' + esc(t.sub) + "</p>" +
            "</div>" +
            '<span class="xp-status"><i></i>' + esc(t.status) + "</span>" +
          "</div>" +
          '<p class="xp-note">' + esc(t.note) + "</p>" +
          '<div class="xp-actions">' +
            '<button type="button" class="btn primary" id="xpRun">' + esc(t.open) + "</button>" +
            '<span class="xp-hint">' + esc(t.hint) + "</span>" +
          "</div>" +
        "</section>" +

        '<div class="xp-stage" id="xpStage">' +
          (running ? '<iframe class="xp-frame" id="xpFrame" src="' + esc(DEMO) + '" title="' + esc(t.name) + '"></iframe>' : "") +
          '<button type="button" class="xp-back" id="xpBack">' + esc(t.close) + "</button>" +
        "</div>" +
      "</div>";

    var run = host.querySelector("#xpRun");
    if (run) {
      run.addEventListener("click", function () {
        win._xpRunning = true;
        render(win);
      });
    }
    var back = host.querySelector("#xpBack");
    if (back) {
      back.addEventListener("click", function () {
        /* Removing the frame stops the demo's own animation loop. A paused
           bench that keeps burning frames behind a panel is not paused. */
        win._xpRunning = false;
        render(win);
      });
    }
  }

  if (window.sbBus && window.sbBus.on) {
    window.sbBus.on("translate:done", function () {
      var win = window.getOpenWindow ? window.getOpenWindow("experimental") : null;
      if (win) render(win);
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("experimental", {
      title: STRINGS.en.title,
      label: STRINGS.en.label,
      i18n: {
        ru: { title: STRINGS.ru.title, label: STRINGS.ru.label },
        ee: { title: STRINGS.ee.title, label: STRINGS.ee.label }
      },
      color: "linear-gradient(160deg,#7a5cff 0%,#4a34c8 55%,#2a1c7a 100%)",
      icon: ICON,
      size: { w: 860, h: 660 },
      render: render,
    });
  }
})();
