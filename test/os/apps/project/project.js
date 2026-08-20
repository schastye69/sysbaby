/* sys.baby OS — Real Project viewer.
 *
 * Spec: os-apps.md section 10.
 * Thin chrome around an iframe of the ACTUAL anonymized client system, so a
 * visitor uses the real work without leaving. Hidden registration: reachable
 * only from Portfolio cards, Files brief previews and Mail's Connected links.
 *
 * The embed URL is exactly the entry's declared explorePath — never derived
 * from its id. There is deliberately no load-failure detection: if the case
 * is unreachable the placeholder simply stays and "Open in a new tab" is the
 * documented way through. Both affordances always ship.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="4.6" width="17.6" height="13" rx="2"/><path d="M3.2 8.4h17.6"/><path d="M8.4 21h7.2"/><path d="M12 17.6V21"/></svg>';

  var SEEN_KEY = "sysbaby.seen.systems";   // raw localStorage on purpose (landing reads it)
  var SEEN_CAP = 4;

  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  var pendingId = null;    // module scope: set before any window exists
  var currentId = null;    // what is actually on screen

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function osLang() {
    var lang = "en";
    try { lang = localStorage.getItem("sysbaby.i18n.lang") || "en"; }
    catch (err) { console.error("[project] language read failed", err); }
    return lang;
  }

  function systemLang() {
    var lang = osLang();
    return lang === "ee" ? "et" : lang;
  }

  function entries() {
    var list = Array.isArray(window.sbPortfolio) ? window.sbPortfolio : [];
    return list.filter(function (e) { return e && e.visibility !== "private"; });
  }

  function viewOf(entry) {
    if (typeof window.sbPortfolioView !== "function") return null;
    try { return window.sbPortfolioView(entry, window.sbLang ? window.sbLang() : "en"); } catch (err) { console.error("[project] view helper failed", err); return null; }
  }

  function pickEntry(wantedId) {
    var list = entries();
    var found = null;
    function byRealId(id) {
      if (!id) return null;
      var hit = null;
      list.forEach(function (e) { if (!hit && e.real && e.id === id) hit = e; });
      return hit;
    }
    found = byRealId(wantedId) || byRealId(pendingId);
    if (!found) list.forEach(function (e) { if (!found && e.explorePath) found = e; });
    return found;
  }

  function embedUrl(entry, view) {
    if (!view.explorePath) return null;
    var url = view.explorePath;
    var lang = systemLang();
    if (view.localeParam && (view.systemLanguages || []).indexOf(lang) !== -1) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + view.localeParam + "=" + encodeURIComponent(lang);
    }
    return url;
  }

  function startLabel(view) {
    var labels = view.startLabel || null;
    var lang = osLang();
    var text = (labels && (labels[lang] || labels.en)) || t("pj.start");
    return text + " →";
  }

  function languageNote(view) {
    var languages = view.systemLanguages || [];
    if (!languages.length) return "";
    if (languages.indexOf(systemLang()) !== -1) return "";
    var names = languages.map(function (code) {
      var key = "pj.lang." + code, out = t(key);
      return out === key ? code : out;
    });
    var joined = names.join(t("pj.langJoin"));
    return '<p class="pj-langnote">' + esc(t("pj.langNote", { langs: joined })) + "</p>";
  }

  function recordSeen(id) {
    if (!id) return;
    var list = [];
    try {
      var raw = localStorage.getItem(SEEN_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (err) { console.error("[project] seen.systems read failed", err); }
    list = list.filter(function (x) { return x !== id; });
    list.push(id);
    if (list.length > SEEN_CAP) list = list.slice(list.length - SEEN_CAP);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(list)); }
    catch (err) { console.error("[project] seen.systems write failed", err); }
  }

  /* -------------------------------------------------------------- render */

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;

    var entry = pickEntry(win._projectEntryId);
    var view = entry ? viewOf(entry) : null;
    currentId = entry ? entry.id : null;

    if (!entry || !view) {
      host.innerHTML = '<div class="app-project"><div class="pj-empty"><p>' + esc(t("pj.empty")) + "</p></div></div>";
      return;
    }

    var url = embedUrl(entry, view);
    var context = [view.projectType, view.industry].filter(Boolean).join(" · ");

    host.innerHTML =
      '<div class="app-project">' +
        '<div class="pj-top">' +
          '<span class="pj-tag">' + esc(t("pj.tag")) + "</span>" +
          '<span class="pj-actions">' +
            /* Кнопка вела в окно портфолио. Приложение снято (D-066), работы живут в
               разделе «Избранные проекты» витрины — туда и ведёт, и называет
               именно то место, куда приведёт: подпись собирается из имени
               приложения build, а не из имени снятого. */
            '<button type="button" class="pj-btn" id="pjBack">' + esc(t("pj.back", { portfolio: appName("build") })) + "</button>" +
            (url ? '<a class="pj-btn open" id="pjNewTab" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(t("pj.fullscreen")) + "</a>" : "") +
            '<a class="pj-btn accent" href="../?contact=1">' + esc(startLabel(view)) + "</a>" +
          "</span>" +
        "</div>" +
        /* Описание проекта складывается на телефоне.
           12.08, наблюдение основателя: «если потенциальный клиент не
           догадается нажать Open in a new tab, ему будет крайне сложно
           нормально поуправлять системой». Измерено на 390×844: шапка 114 px
           плюс описание 248 px против 288 px у работающей программы — ей
           доставалось 42% окна, и это в лучшем случае.
           Текст никуда не делся, он в одном касании. Но первым на телефоне
           человек видит то, ради чего пришёл: работающую вещь. На широком
           экране блок раскрыт всегда и сводки не показывает вовсе. */
        '<details class="pj-more" id="pjMore">' +
          '<summary class="pj-more-sum">' + esc(t("pj.more")) + "</summary>" +
          '<div class="pj-context">' +
            '<p class="pj-line">' + esc(context) + (context ? " · " : "") +
              "<em>" + esc(t("pj.asDelivered")) + "</em></p>" +
            (view.goal ? '<p class="pj-goal">' + esc(t("pj.goal", { goal: view.goal })) + "</p>" : "") +
            ((view.features || []).length
              ? '<div class="pj-chips"><span class="pj-chips-label">' + esc(t("pj.delivered")) + "</span>" +
                  view.features.map(function (f) { return '<span class="pj-chip">' + esc(f) + "</span>"; }).join("") +
                "</div>"
              : "") +
            languageNote(view) +
          "</div>" +
        "</details>" +
        '<div class="pj-stage">' +
          (url ? '<iframe class="pj-frame" id="pjFrame" src="' + esc(url) + '" title="' + esc(view.name) + '"></iframe>' : "") +
          '<div class="pj-placeholder" id="pjPlaceholder">' +
            '<div class="pj-spinner"></div>' +
            '<p class="pj-ph-name">' + esc(view.name) + "</p>" +
            (view.lookFor ? '<p class="pj-ph-hint">' + esc(view.lookFor) + "</p>" : "") +
          "</div>" +
        "</div>" +
      "</div>";

    wire(win, host, entry);
  }

  function wire(win, host, entry) {
    var back = host.querySelector("#pjBack");
    if (back) {
      back.addEventListener("click", function () {
        if (typeof window.sbOpenBuildAt === "function") {
          try { window.sbOpenBuildAt("cases"); return; } catch (err) { console.error("[project] open build failed", err); }
        }
        if (typeof window.toggleApp !== "function") return;
        try { window.toggleApp("build"); } catch (err) { console.error("[project] toggleApp failed", err); }
      });
    }

    /* Раскрыто или свёрнуто описание — решает ширина, а не вкус. CSS этого
       сделать не может: `open` — атрибут, а не свойство. Слушаем медиазапрос,
       чтобы поворот телефона и изменение окна не оставляли состояние от
       прошлой ширины. */
    var more = host.querySelector("#pjMore");
    if (more && window.matchMedia) {
      var narrow = window.matchMedia("(max-width: 760px)");
      var sync = function (mq) { more.open = !mq.matches; };
      sync(narrow);
      if (narrow.addEventListener) narrow.addEventListener("change", sync);
      else if (narrow.addListener) narrow.addListener(sync);
    } else if (more) {
      more.open = true;
    }

    var frame = host.querySelector("#pjFrame");
    var placeholder = host.querySelector("#pjPlaceholder");
    if (!frame) return;

    frame.addEventListener("load", function () {
      frame.classList.add("loaded");
      recordSeen(entry.id);
      if (!placeholder) return;
      setTimeout(function () { placeholder.classList.add("done"); }, 450);
      setTimeout(function () { placeholder.classList.add("hidden"); }, 1150);
    });
  }

  /* ------------------------------------------------------------ contract */

  window.sbProjectSelect = function (id) { pendingId = id || null; };

  window.sbProjectOpen = function (win, id) {
    if (!win) return;
    win._projectEntryId = id || null;
    render(win);
  };

  window.sbProjectCurrent = function () { return currentId; };

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка включена (retranslate ниже). Цена честная:
     встроенная система клиента перезагрузится. Она и должна — в её адресе
     стоит тот же язык, и оставить кадр на прежнем значило бы показать
     русскую рамку вокруг эстонской программы. */
  if (typeof window.registerApp === "function") {
    window.registerApp("project", {
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
      deskPos: { x: 120, y: 120 },
      hidden: true,
      render: render
    });
  }
})();
