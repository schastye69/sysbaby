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
  function offline() { return OFFLINE[osLang()] || OFFLINE.en; }

  var INTRO = "The workspace behind our real client work — and itself an example of it. This desktop, its applications and its storage are our own build, running in your browser with no install and no account. Below is the work itself — and one of the systems is running right here: open it and use it.";

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  /* Raw localStorage on purpose: shared with the landing page, never
   * profile-namespaced. */
  function osLang() {
    var lang = "en";
    try { lang = localStorage.getItem("sysbaby.i18n.lang") || "en"; }
    catch (err) { console.error("[portfolio] language read failed", err); }
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
    try { return window.sbPortfolioView(entry, window.sbLang ? window.sbLang() : "en"); } catch (err) { console.error("[portfolio] view helper failed", err); return null; }
  }

  /* Work in approval, said the way everything else here is said: the state it
     is actually in, and nothing more. No client, no industry, no promise of a
     date — those are things we would be inventing. A count and a sentence.
     If the data ever says zero, this renders nothing at all rather than an
     empty shelf explaining its own emptiness. */
  function pipelineMarkup() {
    if (typeof window.sbPipelineView !== "function") return "";
    var p;
    try { p = window.sbPipelineView(window.sbLang ? window.sbLang() : "en"); }
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
    var src = view.explorePath;
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
      if (view.resultsSource === "first-hand") source = "First-hand: we worked in this trade before building the system.";
      else if (view.resultsSource === "client-reported") source = "Reported by the client.";
      else source = "Source not recorded — ask us where this figure came from.";
      return '<p class="pf-results">' + esc(view.results) + "</p>" +
        '<p class="pf-results-source">' + esc(source) + "</p>";
    }
    if (view.resultsState === "withheld") {
      return '<p class="pf-results">Withheld at the client’s request — the same discretion covers your project.</p>';
    }
    if (view.resultsPendingReason === "not-yet-delivered") {
      return '<p class="pf-results">Built and not yet handed over. We agree the measurement at handover and publish the figure the client gives us, whatever it says.</p>';
    }
    return '<p class="pf-results">Outcome measurement is agreed with the client and scheduled. We publish the figure they give us, whatever it says.</p>';
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
          '<span class="pf-live"><i></i>live</span>' +
          '<span class="pf-unreachable">' + esc(offline().badge) + "</span>" +
        "</div>"
      : "";

    var explore;
    if (view.nameState === "named") {
      explore = '<button type="button" class="pf-btn" data-search="' + index + '">Everything about this client</button>';
    } else if (view.nameState === "withheld") {
      explore = '<span class="pf-note" title="Client identity withheld at their request">Communication · Confidential</span>';
    } else {
      explore = '<span class="pf-note" title="Permission to name this client has not been requested yet">Name · Pending permission</span>';
    }

    return '<article class="pf-card">' +
      preview +
      '<header class="pf-card-head">' +
        '<h3 class="pf-name">' + esc(view.name) + "</h3>" +
        '<span class="pf-badge' + (view.confidential ? " conf" : "") + '">' + (view.confidential ? "Confidential · Anonymous" : "Public") + "</span>" +
      "</header>" +
      '<p class="pf-meta">' + esc([view.industry, view.projectType].filter(Boolean).join(" · ")) + "</p>" +
      (view.scale ? '<p class="pf-scale">' + esc(view.scale) + "</p>" : "") +
      ((view.tech || []).length
        ? '<div class="pf-chips">' + view.tech.map(function (t) { return '<span class="pf-chip">' + esc(t) + "</span>"; }).join("") + "</div>"
        : "") +
      ((view.features || []).length
        ? '<h4 class="pf-sub">Delivered</h4><ul class="pf-list">' +
            view.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>"
        : "") +
      (view.goal ? '<h4 class="pf-sub">Goal</h4><p class="pf-goal">' + esc(view.goal) + "</p>" : "") +
      /* How the relationship began. Rendered only when recorded: a portfolio
         that can say this proves more than a page of testimonials, and one
         that guesses at it proves less than nothing. */
      (view.origin ? '<p class="pf-origin">' + esc(view.origin.label) + "</p>" : "") +
      '<h4 class="pf-sub">Results</h4>' + resultsMarkup(view) +
      '<div class="pf-primary">' +
        (view.explorePath
          ? '<button type="button" class="pf-btn primary" data-open="' + index + '">Open and use this system →</button>' +
            '<p class="pf-offline-note">' + esc(offline().note) + "</p>"
          : '<span class="pf-note">Running at the client’s premises, not as a hosted demonstration.</span>') +
      "</div>" +
      '<footer class="pf-footer">' +
        '<span class="pf-footer-label">Explore</span>' +
        '<button type="button" class="pf-btn" data-brief="' + index + '">Project brief</button>' +
        explore +
      "</footer>" +
    "</article>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;

    var list = entries();
    var views = list.map(viewOf);
    var hasReplay = typeof window.sbReplayOpen === "function";

    var cards = "";
    if (!list.length || views.every(function (v) { return !v; })) {
      cards = '<div class="pf-empty"><div class="pf-empty-glyph">' + ICON + "</div>" +
        "<p>Real completed client work will appear here.</p></div>";
    } else {
      cards = list.map(function (entry, idx) {
        var view = views[idx];
        return view ? cardMarkup(entry, view, idx) : "";
      }).join("");
    }

    host.innerHTML =
      '<div class="app-portfolio">' +
        '<p class="pf-intro">' + esc(INTRO) + "</p>" +
        (hasReplay
          ? '<button type="button" class="pf-replay" id="pfReplay">' +
              '<span class="pf-replay-title">Replay a working day in this desktop</span>' +
              '<span class="pf-replay-sub">A demonstration, not a recording — two minutes</span>' +
            "</button>"
          : "") +
        cards +
        pipelineMarkup() +
        '<div class="pf-cta">' +
          "<p>Want a system like this built for your business?</p>" +
          '<a class="pf-cta-link" href="../?contact=1">Start your project →</a>' +
        "</div>" +
      "</div>";

    wire(win, host, list, views);
  }

  function wire(win, host, list, views) {
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

  /* ------------------------------------------------------- registration */

  if (typeof window.registerApp === "function") {
    window.registerApp("portfolio", {
      title: "Portfolio",
      i18n: {
        ru: { title: "Портфолио", label: "Портфолио" },
        ee: { title: "Portfoolio", label: "Portfoolio" },
      },
      label: "Portfolio",
      color: "linear-gradient(160deg,#5f8cff 0%,#2f6bff 52%,#1b3fd6 100%)",
      icon: ICON,
      size: { w: 540, h: 640 },
      deskPos: { x: 180, y: 200 },
      /* Nothing in this window is typed into, so redrawing it on a language
         change costs the visitor nothing and is the only way the case prose
         follows the language the rest of the desktop just switched to. */
      retranslate: true,
      render: render
    });
  }
})();
