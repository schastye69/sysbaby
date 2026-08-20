/* sys.baby OS — core/links.js
 * The links registry (§12): what a seeded mail message connects to.
 * Hand-authored graph from the 4 sample messages to REAL destinations.
 * Resolved at call time, never cached; a missing target drops its link. */
(function () {
  "use strict";

  /* Строки этого файла видны в блоке «Связано» внутри Писем, поэтому у
     каждого ярлыка есть ключ, а английский текст остаётся запасным
     значением на случай, если ядро i18n почему-то не поднялось. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  window.sbLinkKinds = {
    project: { label: "Project", labelKey: "link.kind.project" },
    document: { label: "Document", labelKey: "link.kind.document" },
    app: { label: "Opens in", labelKey: "link.kind.app" },
    note: { label: "Note", labelKey: "link.kind.note" },
    pricing: { label: "Pricing", labelKey: "link.kind.pricing" },
    system: { label: "System", labelKey: "link.kind.system" }
  };

  function apps() { return (window.SysBaby && window.SysBaby.apps) || {}; }
  function isOpen(id) { return !!((window.openWindows || {})[id]); }

  function portfolioEntry(hint) {
    var list = window.sbPortfolio;
    if (!Array.isArray(list) || !list.length) return null;
    var h = String(hint || "").toLowerCase();
    var hit = null;
    list.forEach(function (e) {
      if (!e || hit) return;
      var id = String(e.id || "").toLowerCase();
      if (id === h || id.indexOf(h) === 0 || id.indexOf(h) !== -1) hit = e;
    });
    return hit;
  }

  function view(entry) {
    if (!entry) return null;
    if (typeof window.sbPortfolioView === "function") {
      try { return window.sbPortfolioView(entry, window.sbLang ? window.sbLang() : "en") || entry; } catch (e) { return entry; }
    }
    return entry;
  }

  /* Single source of truth: shared/pricing.data.js (os-apps.md §11). No literal
   * lives here — if the pricing module is missing the link is dropped, exactly
   * like every other missing destination (§12: never draw a dead link). */
  function pricingBand() {
    try {
      if (typeof window.sbPricingBand === "function") return String(window.sbPricingBand());
      var P = window.SB_PRICING;
      if (P && typeof P.fullBand === "function") return String(P.fullBand());
    } catch (e) { /* no band available */ }
    return null;
  }

  /* ---- link builders (each returns null when its destination is absent) ---- */

  /* Связь «работа» вела в окно портфолио. Приложение снято с рабочего стола
     (D-066) — работы живут в разделе «Избранные проекты» витрины, тем же
     рендерером (D-062). Связь ведёт туда: window.sbOpenBuildAt("cases").
     Условие существования связи тоже переехало: она есть, пока есть куда
     вести, — то есть пока в системе есть build. */
  function projectLink(hintId) {
    var entry = portfolioEntry(hintId);
    if (!entry || !apps().build) return null;
    var v = view(entry) || {};
    return {
      kind: "project",
      title: v.title || entry.title || entry.id,
      sub: v.industry || v.client || t("link.project.sub"),
      live: function () { return isOpen("build"); },
      open: function () {
        if (typeof window.sbOpenBuildAt === "function") { window.sbOpenBuildAt("cases"); return; }
        if (window.toggleApp) window.toggleApp("build");
      }
    };
  }

  function systemLink(hintId) {
    var entry = portfolioEntry(hintId);
    if (!entry) return null;
    var v = view(entry) || {};
    var path = entry.explorePath || v.explorePath || null;
    if (!apps().project && !path) return null;
    return {
      kind: "system",
      title: t("link.system.title"),
      sub: v.title || entry.id,
      live: function () { return isOpen("project"); },
      open: function () {
        if (typeof window.sbProjectSelect === "function") {
          try { window.sbProjectSelect(entry.id); } catch (e) { /* ignore */ }
        }
        if (apps().project && window.toggleApp) { window.toggleApp("project"); return; }
        if (path) window.open(path, "_blank", "noopener");
      }
    };
  }

  function documentLink(hintId) {
    var entry = portfolioEntry(hintId);
    if (!entry || !apps().files) return null;
    var v = view(entry) || {};
    var name = (v.title || entry.title || entry.id) + ".md";
    return {
      kind: "document",
      title: name,
      sub: t("link.document.sub", { files: appName("files") }),
      live: function () { return isOpen("files"); },
      open: function () {
        if (!window.toggleApp) return;
        window.toggleApp("files");
        setTimeout(function () {
          var win = window.getOpenWindow ? window.getOpenWindow("files") : null;
          if (!win || typeof window.sbFilesOpenResult !== "function") return;
          /* FIX: pass a real path array + a stable docId (the original sent only a name) */
          window.sbFilesOpenResult(win, { path: ["Portfolio", name], docId: entry.id, name: name });
        }, 300);
      }
    };
  }

  /* Третий довод — РАЗДЕЛ. Связь может вести не просто в приложение, а в
     определённое его место: после снятия портфолио (D-066) все связи о
     работах ведут в build на «Избранные проекты», и «открыть витрину первым
     экраном» здесь было бы потерей — человек шёл смотреть работы. */
  function appLink(id, sub, section) {
    var def = apps()[id];
    if (!def) return null;
    return {
      kind: "app",
      title: window.sbAppTitle ? window.sbAppTitle(id) : (def.title || id),
      sub: sub || (def.brand || t("link.app.sub")),
      live: function () { return isOpen(id); },
      open: function () {
        if (section && id === "build" && typeof window.sbOpenBuildAt === "function") {
          window.sbOpenBuildAt(section);
          return;
        }
        if (window.toggleApp) window.toggleApp(id);
      }
    };
  }

  function pricingLink() {
    var band = pricingBand();
    if (!band) return null;
    return {
      kind: "pricing",
      title: band,
      sub: t("link.pricing.sub"),
      open: function () {
        var url = "../index.php#pricing";
        var w = null;
        try { w = window.open(url, "_blank", "noopener"); } catch (e) { w = null; }
        if (!w && window.showToast) window.showToast(t("link.pricing.toastTitle"), t("link.pricing.toastBody", { band: band }), "");
      }
    };
  }

  function noteLink(text) {
    if (typeof window.sbAddQuickNote !== "function") return null;
    return {
      kind: "note",
      title: t("link.note.title"),
      sub: t("link.note.sub", { notes: appName("notes") }),
      open: function () {
        window.sbAddQuickNote(text);
        /* copy matches behaviour: it is a plain note, not a desktop sticky */
        if (window.showToast) window.showToast(t("link.note.toastTitle"), t("link.note.toastBody", { notes: appName("notes") }), "");
      }
    };
  }

  /* ------------------------------- the graph, keyed by seed mail ids 1–4 */
  var GRAPH = {
    1: function () {
      return [
        projectLink("auto-estimate"),
        systemLink("auto-estimate"),
        documentLink("auto-estimate"),
        appLink("build", t("link.sub.allShipped"), "cases"),
        noteLink("Body-shop estimate system — worth a closer look.")
      ];
    },
    /* 2 — the clinic case left the showcase in v22 (the client is fully
       confidential), so this message no longer points at a project of its
       own. The registry drops missing destinations rather than drawing dead
       links, but a graph that silently thins is worse than one that is
       rewritten on purpose. */
    2: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.handedOver"), "cases"),
        appLink("files", t("link.sub.briefKept"))
      ];
    },
    3: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.allShipped"), "cases"),
        noteLink("Ask about the payback period before the next invoice run.")
      ];
    },
    4: function () {
      return [
        appLink("build", t("link.sub.allShipped"), "cases"),
        pricingLink()
      ];
    },
    /* 5 — the studio's own letter (v21). Not a sample: the one real thing in
       the mailbox connects to the other real things — what a project costs
       and what we have already handed over. */
    5: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.handedOver"), "cases"),
        noteLink("Letters → To the studio really delivers. Reply channel is mine to choose.")
      ];
    }
  };

  window.sbLinksFor = function (messageId) {
    var key = String(messageId);
    var build = GRAPH[key];
    if (!build) return [];
    var out = [];
    try {
      build().forEach(function (l) { if (l) out.push(l); });
    } catch (e) {
      if (window.console) console.error("[links] resolve " + key, e);
      return [];
    }
    return out;
  };
})();
