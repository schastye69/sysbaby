/* sys.baby OS — Portfolio.
 *
 * Spec: os-apps.md section 9.
 * A window over the SINGLE canonical portfolio source (window.sbPortfolio +
 * window.sbPortfolioView from shared/portfolio.data.js) — never a second copy
 * of the data. Every string that could name a client goes through the view
 * helper, so a withheld name cannot leak. Results copy is strictly
 * state-driven and never invented.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="7.4" width="17.6" height="11.4" rx="2"/><path d="M9 7.4V6a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 6v1.4"/><path d="M3.2 12.4h17.6"/></svg>';

  /* THE ONE STATE A VISITOR CAN SEE GO WRONG
     The systems are embedded live. When the demonstration instance is not
     answering, the card must say so — but that is a fact about availability,
     not a defect in sys.baby and not a doubt about the work. So: no error
     colour, no technical vocabulary, and the offer to open something that will
     not open is withdrawn rather than left as a button that does nothing. */
  var OFFLINE = {
    en: { badge: "demonstration paused",
          note: "The system itself is running at the client. Its public demonstration is paused for the moment — ask us and we will walk you through it." },
    ru: { badge: "демонстрация приостановлена",
          note: "Сама система работает у клиента. Её публичная демонстрация сейчас приостановлена — попросите, и мы проведём вас по ней." },
    ee: { badge: "demonstratsioon peatatud",
          note: "Süsteem ise töötab kliendi juures. Selle avalik demonstratsioon on hetkel peatatud — küsige ja me tutvustame seda teile." }
  };
  function offline() { return OFFLINE[lang()] || OFFLINE.en; }

  /* Строки живут в STRINGS ядра (core/topbar.js). Здесь только ключи —
     иначе смена языка их не увидит. */
  /* Строки берутся из ОБЩЕГО словаря (shared/portfolio.strings.js): портфолио
     показывается и в системе, и на витрине, а витрина словаря оболочки не
     видит. Порядок поиска — сначала оболочка, потом общий файл: уточнённый
     перевод в системе должен побеждать. */
  function t(key, vars) {
    if (typeof window.sbPortfolioText === "function") {
      return window.sbPortfolioText(key, lang());
    }
    return typeof window.sbT === "function" ? window.sbT(key, vars) : key;
  }

  /* Ярлыки стека приходят из shared/portfolio.data.js, а он ГЕНЕРИРУЕТСЯ и
     руками не правится, поэтому перевода в самих данных нет. Список закрытый
     (десять ярлыков), и переводится он по ключу pf.tech.<слаг>. Неизвестный
     ярлык показывается как есть — лучше английское слово, чем дыра. */
  function techLabel(term) {
    var slug = String(term || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    var key = "pf.tech." + slug;
    var out = t(key);
    return out === key ? String(term || "") : out;
  }

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  /* ── ОДИН РЕНДЕРЕР, ДВЕ ПОВЕРХНОСТИ (v47.1) ─────────────────────────────
   *
   * Основатель: «в раздел selected work на лендинге нужно уместить
   * информацию из приложения портфолио, так как оно не должно быть в OS,
   * портфолио должно быть в приложении build». Голосование выбрало общий
   * модуль отрисовки — не перенос текста, а перенос ТОЧКИ ВЫЗОВА.
   *
   * Различий между поверхностями ровно три, и все три — по существу, а не
   * по вкусу:
   *   1. АДРЕСА. Пути записаны от корня ОС («../cases/…»), потому что первым
   *      потребителем было окно внутри os/. Витрина лежит этажом выше —
   *      ведущие «../» снимаются здесь, у потребителя, источник не трогаем.
   *   2. ПЕРЕДАЧА В ДРУГИЕ ПРИЛОЖЕНИЯ. «Бриф» открывает Файлы, «всё о
   *      клиенте» — Поиск. На витрине этих приложений нет; кнопка, которая
   *      никуда не ведёт, хуже отсутствующей, поэтому её там нет.
   *   3. ВСТУПЛЕНИЕ. У витрины свой раздел со своим вступлением о
   *      конфиденциальности; второе вступление подряд — это не полнота.
   */
  var SURFACE = "os";
  /* Язык у поверхностей разный ПО ИСТОЧНИКУ, а не по значению: система
     объявляет window.sbLang, витрина держит язык в своём state и передаёт
     его сюда явно при каждом вызове. Модуль сам никуда не подглядывает —
     иначе витрина по-русски рисовала бы карточки по-английски, потому что
     window.sbLang там не существует (это и случилось: поймал
     pipeline-check на ru и ee). */
  var LANG = null;
  function lang() {
    if (LANG) return LANG;
    if (typeof window.sbLang === "function") return window.sbLang();
    return osLang();
  }
  function onBuild() { return SURFACE === "build"; }
  function pathFor(value) {
    if (!value) return value;
    if (/^https?:\/\//.test(value)) return value;
    return onBuild() ? String(value).replace(/^(\.\.\/)+/, "") : value;
  }

  /* Raw localStorage on purpose: shared with the landing page, never
   * profile-namespaced. */
  function osLang() {
    var lang = "en";
    try { lang = localStorage.getItem("sysbaby.i18n.lang") || "en"; }
    catch (err) { console.error("[portfolio] language read failed", err); }
    return lang;
  }

  function systemLang() {
    var l = lang();
    return l === "ee" ? "et" : l;
  }

  function entries() {
    var list = Array.isArray(window.sbPortfolio) ? window.sbPortfolio : [];
    return list.filter(function (e) { return e && e.visibility !== "private"; });
  }

  function viewOf(entry) {
    if (typeof window.sbPortfolioView !== "function") return null;
    try { return window.sbPortfolioView(entry, lang()); } catch (err) { console.error("[portfolio] view helper failed", err); return null; }
  }

  /* Work in approval, said the way everything else here is said: the state it
     is actually in, and nothing more. No client, no industry, no promise of a
     date — those are things we would be inventing. A count and a sentence.
     If the data ever says zero, this renders nothing at all rather than an
     empty shelf explaining its own emptiness. */
  function pipelineMarkup() {
    if (typeof window.sbPipelineView !== "function") return "";
    var p;
    try { p = window.sbPipelineView(lang()); }
    catch (err) { console.error("[portfolio] pipeline view failed", err); return ""; }
    if (!p) return "";
    /* One row per state, strongest first. They are deliberately not merged
       into a single count: "nearly agreed" is a stronger claim than "in
       approval", and adding them together would round the truth upwards.
       The numeral is read, not decorative — it is the only place the count
       appears, so hiding it from a screen reader would delete the fact. */
    var rows = p.rows || [p];
    return rows.map(function (r) {
      return '<section class="pf-pipeline">' +
        '<span class="pf-pipe-count">' + esc(r.count) + "</span>" +
        '<div class="pf-pipe-body">' +
          '<h4 class="pf-pipe-label">' + esc(r.label) + "</h4>" +
          '<p class="pf-pipe-note">' + esc(r.note) + "</p>" +
        "</div>" +
      "</section>";
    }).join("");
  }

  function previewSrc(view) {
    if (!view.explorePath) return null;
    var src = pathFor(view.explorePath);
    var lang = systemLang();
    if (view.localeParam && (view.systemLanguages || []).indexOf(lang) !== -1) {
      src += (src.indexOf("?") === -1 ? "?" : "&") + view.localeParam + "=" + encodeURIComponent(lang);
    }
    return src;
  }

  /* --------------------------------------------------------- results copy */

  function resultsMarkup(view) {
    if (view.resultsState === "measured") {
      var source;
      if (view.resultsSource === "first-hand") source = t("pf.results.firstHand");
      else if (view.resultsSource === "client-reported") source = t("pf.results.clientReported");
      else source = t("pf.results.sourceUnknown");
      return '<p class="pf-results">' + esc(view.results) + "</p>" +
        '<p class="pf-results-source">' + esc(source) + "</p>";
    }
    if (view.resultsState === "withheld") {
      return '<p class="pf-results">' + esc(t("pf.results.withheld")) + "</p>";
    }
    /* Собственная разработка: стороннего заказчика нет, значит нет и цифры,
       которую он мог бы дать. Прежняя ветка обещала измерение при передаче —
       передачи не будет. */
    if (view.nameState === "own-build" || view.resultsPendingReason === "own-build") {
      return '<p class="pf-results">' + esc(t("pf.results.ownBuild")) + "</p>";
    }
    if (view.resultsPendingReason === "not-yet-delivered") {
      return '<p class="pf-results">' + esc(t("pf.results.notDelivered")) + "</p>";
    }
    return '<p class="pf-results">' + esc(t("pf.results.pending")) + "</p>";
  }

  /* -------------------------------------------------------------- markup */

  function cardMarkup(entry, view, index) {
    var src = previewSrc(view);
    /* The frame is the running system, not a screenshot — so when it cannot
       be reached the card says so instead of showing an empty rectangle and
       calling it live. An unreachable system is a deployment fact, and the
       honest thing is to name it. */
    var preview = src
      ? '<div class="pf-preview" data-src="' + esc(src) + '">' +
          '<iframe class="pf-frame" src="' + esc(src) + '" loading="lazy" tabindex="-1" title="" aria-hidden="true"></iframe>' +
          '<span class="pf-live"><i></i>' + esc(t("pf.live")) + "</span>" +
          '<span class="pf-unreachable">' + esc(offline().badge) + "</span>" +
        "</div>"
      : "";

    var explore;
    if (view.nameState === "named" && !onBuild()) {
      explore = '<button type="button" class="pf-btn" data-search="' + index + '">' + esc(t("pf.everything")) + "</button>";
    } else if (view.nameState === "named") {
      explore = "";
    } else if (view.nameState === "own-build") {
      explore = '<span class="pf-note" title="' + esc(t("pf.name.ownBuildTitle")) + '">' + esc(t("pf.name.ownBuild")) + "</span>";
    } else if (view.nameState === "withheld") {
      explore = '<span class="pf-note" title="' + esc(t("pf.name.withheldTitle")) + '">' + esc(t("pf.name.withheld")) + "</span>";
    } else {
      explore = '<span class="pf-note" title="' + esc(t("pf.name.pendingTitle")) + '">' + esc(t("pf.name.pending")) + "</span>";
    }

    return '<article class="pf-card">' +
      preview +
      '<header class="pf-card-head">' +
        /* Имя клиента и его отраслевые строки приходят из данных портфолио
           и переведены там же (sbPortfolioView(entry, lang)). */
        '<h3 class="pf-name">' + esc(view.name) + "</h3>" +
        '<span class="pf-badge' + (view.confidential ? " conf" : "") + '">' + esc(view.confidential ? t("pf.badge.conf") : t("pf.badge.public")) + "</span>" +
      "</header>" +
      '<p class="pf-meta">' + esc([view.industry, view.projectType].filter(Boolean).join(" · ")) + "</p>" +
      (view.scale ? '<p class="pf-scale">' + esc(view.scale) + "</p>" : "") +
      ((view.tech || []).length
        ? '<div class="pf-chips">' + view.tech.map(function (term) { return '<span class="pf-chip">' + esc(techLabel(term)) + "</span>"; }).join("") + "</div>"
        : "") +
      ((view.features || []).length
        ? '<h4 class="pf-sub">' + esc(t("pf.sub.delivered")) + '</h4><ul class="pf-list">' +
            view.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>"
        : "") +
      (view.goal ? '<h4 class="pf-sub">' + esc(t("pf.sub.goal")) + '</h4><p class="pf-goal">' + esc(view.goal) + "</p>" : "") +
      /* How the relationship began. Rendered only when recorded: a portfolio
         that can say this proves more than a page of testimonials, and one
         that guesses at it proves less than nothing. */
      (view.origin ? '<p class="pf-origin">' + esc(view.origin.label) + "</p>" : "") +
      '<h4 class="pf-sub">' + esc(t("pf.sub.results")) + "</h4>" + resultsMarkup(view) +
      '<div class="pf-primary">' +
        (view.explorePath
          ? (onBuild()
              /* На витрине окон нет — открывать нечем, поэтому это ссылка на
                 саму работающую систему, а не кнопка в приложение. */
              ? '<a class="pf-btn primary" href="' + esc(pathFor(view.explorePath)) + '" target="_blank" rel="noopener">' + esc(t("pf.open")) + "</a>"
              : '<button type="button" class="pf-btn primary" data-open="' + index + '">' + esc(t("pf.open")) + "</button>") +
            '<p class="pf-offline-note">' + esc(offline().note) + "</p>"
          : '<span class="pf-note">' + esc(t("pf.onPremises")) + "</span>") +
      "</div>" +
      (onBuild() && !explore
        ? ""
        : '<footer class="pf-footer">' +
            '<span class="pf-footer-label">' + esc(t("pf.explore")) + "</span>" +
            (onBuild() ? "" : '<button type="button" class="pf-btn" data-brief="' + index + '">' + esc(t("pf.brief")) + "</button>") +
            explore +
          "</footer>") +
    "</article>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    paint(host, "os");
  }

  function paint(host, surface, langCode) {
    SURFACE = surface === "build" ? "build" : "os";
    LANG = langCode || null;

    var list = entries();
    var views = list.map(viewOf);
    var hasReplay = typeof window.sbReplayOpen === "function";

    var cards = "";
    if (!list.length || views.every(function (v) { return !v; })) {
      cards = '<div class="pf-empty"><div class="pf-empty-glyph">' + ICON + "</div>" +
        "<p>" + esc(t("pf.empty")) + "</p></div>";
    } else {
      cards = list.map(function (entry, idx) {
        var view = views[idx];
        return view ? cardMarkup(entry, view, idx) : "";
      }).join("");
    }

    host.innerHTML =
      '<div class="app-portfolio">' +
        (onBuild() ? "" : '<p class="pf-intro">' + esc(t("pf.intro")) + "</p>") +
        (hasReplay
          ? '<button type="button" class="pf-replay" id="pfReplay">' +
              '<span class="pf-replay-title">' + esc(t("pf.replay")) + "</span>" +
              '<span class="pf-replay-sub">' + esc(t("pf.replaySub")) + "</span>" +
            "</button>"
          : "") +
        cards +
        pipelineMarkup() +
        '<div class="pf-cta">' +
          "<p>" + esc(t("pf.cta")) + "</p>" +
          '<a class="pf-cta-link" href="' + esc(pathFor("../?contact=1")) + '">' + esc(t("pf.ctaLink")) + "</a>" +
        "</div>" +
      "</div>";

    wire(host, list, views);
  }

  function wire(host, list, views) {
    /* A cross-origin frame will not tell us whether it loaded, so the check is
       a fetch of the same URL rather than a listener on the iframe: if the
       system answers, the card stays live; if it 404s or the host is gone, the
       card says it cannot be reached and stops claiming otherwise. */
    host.querySelectorAll(".pf-preview[data-src]").forEach(function (box) {
      var url = box.getAttribute("data-src");
      var card = box.closest ? box.closest(".pf-card") : null;
      var settle = function (ok) {
        box.classList.toggle("unreachable", !ok);
        /* the CARD, not just the frame: the open button lives outside the box */
        if (card) card.classList.toggle("offline", !ok);
      };
      var probe = window.sbFetchWithTimeout || function (u, o, ms) { return fetch(u, o); };
      try {
        probe(url, { method: "GET", cache: "no-store" }, 6000)
          .then(function (r) { settle(!!r && r.ok); })
          .catch(function () { settle(false); });
      } catch (err) { settle(false); }
    });

    var replay = host.querySelector("#pfReplay");
    if (replay) {
      replay.addEventListener("click", function () {
        if (typeof window.sbReplayOpen !== "function") return;
        try { window.sbReplayOpen(); } catch (err) { console.error("[portfolio] replay failed", err); }
      });
    }

    host.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var entry = list[parseInt(btn.getAttribute("data-open"), 10)];
        if (!entry) return;
        /* Order matters: declare intent BEFORE any window exists. */
        if (typeof window.sbProjectSelect === "function") {
          try { window.sbProjectSelect(entry.id); } catch (err) { console.error("[portfolio] project select failed", err); }
        }
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("project"); } catch (err) { console.error("[portfolio] toggleApp failed", err); }
        }
        var projectWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("project") : null;
        if (projectWin && typeof window.sbProjectOpen === "function") {
          try { window.sbProjectOpen(projectWin, entry.id); } catch (err) { console.error("[portfolio] project open failed", err); }
        }
      });
    });

    host.querySelectorAll("[data-brief]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-brief"), 10);
        var entry = list[idx], view = views[idx];
        if (!entry || !view) return;
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("files"); } catch (err) { console.error("[portfolio] toggleApp failed", err); }
        }
        var filesWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("files") : null;
        if (filesWin && typeof window.sbFilesOpenResult === "function") {
          try { window.sbFilesOpenResult(filesWin, { path: ["Portfolio", view.name + ".md"], docId: entry.id, name: view.name + ".md" }); }
          catch (err) { console.error("[portfolio] brief jump failed", err); }
        }
      });
    });

    host.querySelectorAll("[data-search]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = views[parseInt(btn.getAttribute("data-search"), 10)];
        if (!view) return;
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("search"); } catch (err) { console.error("[portfolio] toggleApp failed", err); }
        }
        var searchWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("search") : null;
        if (searchWin && typeof window.sbSearchOpenQuery === "function") {
          try { window.sbSearchOpenQuery(searchWin, view.name); } catch (err) { console.error("[portfolio] search handoff failed", err); }
        }
      });
    });
  }

  /* ── ОБЩАЯ ТОЧКА ВЫЗОВА (v47) ───────────────────────────────────────────
   *
   * Один и тот же рендерер рисует портфолио и в окне системы, и в разделе
   * «Selected Work» на витрине. Это второй шаг переезда портфолио в build
   * (D-054): переносится не текст, а точка вызова. Второго рендерера той же
   * копии в проекте нет и не будет — этим он уже платил дважды.
   *
   * Функция принимает ЭЛЕМЕНТ, а не окно: у витрины окон нет.
   */
  window.sbRenderPortfolioInto = function (host, surface, langCode) {
    if (!host) return false;
    paint(host, surface || "build", langCode || null);
    return true;
  };

  /* ── ПРИЛОЖЕНИЯ БОЛЬШЕ НЕТ. РЕНДЕРЕР ОСТАЛСЯ (v47.3) ────────────────────
   *
   * Здесь стоял window.registerApp("portfolio", …) — портфолио было окном
   * рабочего стола. Основатель: «в раздел selected work на лендинге нужно
   * уместить информацию из приложения портфолио, так как оно не должно быть
   * в OS, портфолио должно быть в приложении build», и затем, когда переезд
   * был готов: «Приложение портфолио необходимо убрать».
   *
   * Порядок был объявлен заранее и соблюдён — иначе снятие ломает всё, что
   * на приложение опиралось (первая попытка 18.08 уронила десять наборов
   * законов именно потому, что порядок был обратным):
   *   1. строки       → shared/portfolio.strings.js   (сделано)
   *   2. рендерер     → этот файл, общий для двух поверхностей (сделано)
   *   3. снятие окна  → здесь, последним шагом.
   *
   * Что осталось и почему. Файл больше не заводит окно, но остаётся
   * ЕДИНСТВЕННЫМ рендерером портфолио: его зовёт витрина через
   * window.sbRenderPortfolioInto (раздел «Избранные проекты»). Работы никуда
   * не делись — у них сменилось место, а не существование. Render(win)
   * оставлен: он ничего не стоит, пока его никто не зовёт, и он — готовая
   * дверь, если однажды понадобится показать портфолио окном снова.
   *
   * Все дороги, которые вели в это окно, переадресованы в build на раздел
   * «Избранные проекты» (window.sbOpenBuildAt). Их девять, они перечислены
   * в законе tools/portfolio-retired-check.mjs, и закон проверяет каждую.
   */
  window.sbPortfolioRender = render;
})();
