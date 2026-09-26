/*
 * install.js — ПОСТАВИТЬ sys.baby НА ЭКРАН ОДНИМ НАЖАТИЕМ (D-293).
 *
 * ПОВОД. Основатель 25.09.2026: «как возможно сделать так, чтобы
 * пользователь одним нажатием смог создать ярлык sys.baby на рабочем столе
 * абсолютно на любой операционной системе, пока мы не разработали
 * приложение для всех операционных систем».
 *
 * ЧТО ЗНАЕТ ПРАВДА (проверено 25.09.2026):
 *   • Chrome, Edge, Opera, Samsung Internet — на Windows, macOS, Linux,
 *     ChromeOS и Android — дают странице событие beforeinstallprompt: одно
 *     нажатие на своей кнопке, и браузер ставит систему как приложение
 *     (значок на столе и в меню, своё окно). Манифест для этого есть с v150.
 *   • Chrome и Edge с версии 148 пробуют navigator.install() — тот же путь
 *     без ожидания события; если он есть, берётся он.
 *   • Safari на iPhone и iPad странице такой кнопки не даёт: ставит только
 *     человек — «Поделиться» → «На экран Домой». Здесь система не делает
 *     вид, что умеет больше: показывает эти два шага. И говорит правду,
 *     которую иначе узнают слишком поздно: у значка на iPhone и iPad СВОЁ
 *     хранилище, отдельное от Safari, — написанное в Safari в нём не
 *     появится; перенос — экспортом данных аккаунта здесь и импортом там.
 *   • Safari на Mac: «Файл» → «Добавить в Dock».
 *   • Firefox на Windows с версии 143 ставит сайт своей кнопкой
 *     «веб-приложения» в адресной строке (support.mozilla.org,
 *     «Use web apps in Firefox for Windows»); странице он кнопки не даёт,
 *     поэтому названы эти два шага. На macOS и Linux Firefox сайты как
 *     приложения не ставит — так и сказано, и назван браузер, который ставит.
 *     (Прежде эта строка говорила «Firefox на столе не ставит» обо всех
 *     компьютерах — исправлено 25.09.2026 по странице поддержки Mozilla.)
 *
 * ЧЕГО НЕ ДЕЛАЕТ. Не выпрашивает: ни всплывающего окна, ни подсказки на
 * столе, ни значка «установите нас». Кнопка стоит в Настройках и в быстрых
 * действиях — там, куда человек пришёл сам. И ничего не хранит.
 *
 * Охраняется tools/install-check.mjs.
 */
(function () {
  "use strict";
  var doc = document;
  var deferred = null;          /* событие браузера, если он его дал */
  var installed = false;

  var UI = {
    en: {
      row: "Put sys.baby on this screen", rowSub: "Its own icon and its own window — without the browser around it. Nothing is stored and nothing is sent.",
      go: "Put on this screen", done: "sys.baby is on this screen", doneSub: "Open it from the icon — it starts in its own window.",
      here: "Already on this screen", palette: "Put sys.baby on this screen",
      guideTitle: "Two taps, and it is on the screen",
      ios1: "Tap «Share» at the bottom of Safari (the square with the arrow).", ios2: "Choose «Add to Home Screen».",
      iosWarn: "On iPhone and iPad the icon gets its own storage, separate from Safari: what you wrote in Safari will not appear in it. To carry it over — Settings → Privacy: «Export this account's data» here, «Import a backup file» there.",
      mac1: "In Safari's menu choose «File».", mac2: "Choose «Add to Dock».",
      ff1: "Firefox on a Mac or on Linux does not put sites on the screen as apps.", ff2: "Open sys.baby in Chrome or Edge — the button there does it in one tap.",
      ffw1: "Click the web apps button in the address bar (Firefox 143 or later).", ffw2: "Firefox puts sys.baby on the taskbar — pin it if it asks.",
      other1: "Open the browser menu (⋮ or ⋯).", other2: "Choose «Install app» or «Add to Home screen».",
      close: "Done"
    },
    ru: {
      row: "Поставить sys.baby на этот экран", rowSub: "Свой значок и своё окно — без браузера вокруг. Ничего не хранится и никуда не уходит.",
      go: "Поставить на экран", done: "sys.baby стоит на экране", doneSub: "Открывайте со значка — она встанет в своём окне.",
      here: "Уже стоит на этом экране", palette: "Поставить sys.baby на экран",
      guideTitle: "Два нажатия — и она на экране",
      ios1: "Нажмите «Поделиться» внизу Safari (квадрат со стрелкой).", ios2: "Выберите «На экран Домой».",
      iosWarn: "На iPhone и iPad у значка своё хранилище, отдельное от Safari: написанное в Safari в нём не появится. Перенести — Настройки → Приватность: «Экспортировать данные аккаунта» здесь и «Импортировать резервную копию» там.",
      mac1: "В меню Safari выберите «Файл».", mac2: "Выберите «Добавить в Dock».",
      ff1: "Firefox на Mac и на Linux не ставит сайты на экран как приложения.", ff2: "Откройте sys.baby в Chrome или Edge — там кнопка сделает это одним нажатием.",
      ffw1: "Нажмите в адресной строке кнопку веб-приложений (Firefox 143 и новее).", ffw2: "Firefox поставит sys.baby на панель задач — закрепите, если он спросит.",
      other1: "Откройте меню браузера (⋮ или ⋯).", other2: "Выберите «Установить приложение» или «Добавить на главный экран».",
      close: "Понятно"
    },
    ee: {
      row: "Pane sys.baby sellele ekraanile", rowSub: "Oma ikoon ja oma aken — ilma brauserita ümber. Midagi ei salvestata ega saadeta.",
      go: "Pane ekraanile", done: "sys.baby on ekraanil", doneSub: "Ava see ikoonilt — see avaneb oma aknas.",
      here: "Juba sellel ekraanil", palette: "Pane sys.baby ekraanile",
      guideTitle: "Kaks puudutust ja see on ekraanil",
      ios1: "Puuduta Safari all «Jaga» (ruut noolega).", ios2: "Vali «Lisa avakuvale».",
      iosWarn: "iPhone'is ja iPadis saab ikoon oma salvestusruumi, Safarist eraldi: Safaris kirjutatu selles ei ilmu. Ülekandmiseks — Seaded → Privaatsus: «Ekspordi selle konto andmed» siin ja «Impordi varukoopia fail» seal.",
      mac1: "Vali Safari menüüs «Fail».", mac2: "Vali «Lisa Docki».",
      ff1: "Firefox Macis ja Linuxis ei pane saite ekraanile rakendustena.", ff2: "Ava sys.baby Chrome'is või Edge'is — seal teeb nupp seda ühe puudutusega.",
      ffw1: "Klõpsa aadressiribal veebirakenduste nuppu (Firefox 143 või uuem).", ffw2: "Firefox paneb sys.baby tegumiribale — kinnita see, kui ta küsib.",
      other1: "Ava brauseri menüü (⋮ või ⋯).", other2: "Vali «Installi rakendus» või «Lisa avakuvale».",
      close: "Selge"
    }
  };
  function lang() { try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; } }
  function t(k) {
    /* ОТКАТ: языка нет в словаре — английский, как у словаря ядра (sbTIn). */
    var L = UI[lang()] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ. */
    return L[k] || UI.en[k] || k;
  }

  function standalone() {
    try {
      if (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: window-controls-overlay)").matches || window.matchMedia("(display-mode: minimal-ui)").matches)) return true;
    } catch (e) { /* ignore */ }
    return window.navigator.standalone === true;
  }
  /* Какой путь у этого браузера — по тому, что он умеет, а не по имени,
     где это возможно; имя спрашивается только там, где умения не видно. */
  function platform() {
    var ua = String(navigator.userAgent || "");
    var touchMac = /Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1;
    if (/iPhone|iPad|iPod/.test(ua) || touchMac) return "ios";
    if (/Firefox\//.test(ua) && /Windows/.test(ua)) return "firefox-win";
    if (/Firefox\//.test(ua) && !/Android/.test(ua)) return "firefox";
    if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\//.test(ua)) return "mac";
    return "other";
  }
  function state() {
    if (installed || standalone()) return "installed";
    if (deferred || typeof navigator.install === "function") return "prompt";
    return "guide";
  }

  window.addEventListener("beforeinstallprompt", function (ev) {
    /* Браузер предлагает свою плашку — система её откладывает: ставить или
       нет, человек решит своей кнопкой, а не всплывающим окном. */
    try { ev.preventDefault(); } catch (e) { /* ignore */ }
    deferred = ev;
    announce();
  });
  window.addEventListener("appinstalled", function () { installed = true; deferred = null; announce(); });
  function announce() { try { doc.dispatchEvent(new CustomEvent("sysbaby:install-state", { detail: { state: state() } })); } catch (e) { /* ignore */ } }

  /* Два шага у каждого пути. Ключи спрашивает и закон (keys) — слова
     подсказки берутся отсюда, а не из памяти закона. */
  var STEPS = { ios: ["ios1", "ios2"], mac: ["mac1", "mac2"], firefox: ["ff1", "ff2"], "firefox-win": ["ffw1", "ffw2"], other: ["other1", "other2"] };
  function keys() { return Object.keys(UI.en); }
  function guideHtml(p) {
    var steps = STEPS[p] || STEPS.other; /* ОТКАТ: путь не распознан — общий путь через меню браузера. */
    return '<div class="sb-install-guide" role="dialog" aria-modal="true" data-platform="' + p + '">' +
      '<div class="sig-box"><h3>' + esc(t("guideTitle")) + "</h3>" +
      "<ol>" + steps.map(function (k) { return "<li>" + esc(t(k)) + "</li>"; }).join("") + "</ol>" +
      (p === "ios" ? '<p class="sig-warn">' + esc(t("iosWarn")) + "</p>" : "") +
      '<button type="button" class="btn primary sig-close">' + esc(t("close")) + "</button></div></div>";
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function showGuide() {
    var old = doc.querySelector(".sb-install-guide");
    if (old) old.remove();
    var wrap = doc.createElement("div");
    wrap.innerHTML = guideHtml(platform());
    var g = wrap.firstChild;
    doc.body.appendChild(g);
    var close = function () { if (g.parentNode) g.parentNode.removeChild(g); };
    g.querySelector(".sig-close").addEventListener("click", close);
    g.addEventListener("click", function (ev) { if (ev.target === g) close(); });
    try { g.querySelector(".sig-close").focus(); } catch (e) { /* ignore */ }
    return "guide";
  }
  function done() {
    installed = true; announce();
    if (window.showToast) window.showToast(t("done"), t("doneSub"), "", true, "toast-calm", "confirm");
  }

  function go() {
    if (state() === "installed") { if (window.showToast) window.showToast(t("here"), t("doneSub"), "", true, "toast-calm", "confirm"); return Promise.resolve("installed"); }
    if (deferred && typeof deferred.prompt === "function") {
      var ev = deferred; deferred = null;
      try { ev.prompt(); } catch (e) { return Promise.resolve(showGuide()); }
      return Promise.resolve(ev.userChoice).then(function (c) {
        if (c && c.outcome === "accepted") { done(); return "accepted"; }
        announce(); return "dismissed";
      }, function () { return "dismissed"; });
    }
    if (typeof navigator.install === "function") {
      return Promise.resolve().then(function () { return navigator.install(); }).then(function () { done(); return "accepted"; }, function () { return Promise.resolve(showGuide()); });
    }
    return Promise.resolve(showGuide());
  }

  window.sbInstall = { state: state, platform: platform, go: go, t: t, keys: keys };
})();
