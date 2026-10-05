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

  /* Связи «работа» и «система» сняты (D-354, 03.10.2026): работы временно
     ушли с витрины и из ОС, вести к ним некуда. Прежде они открывали build на
     разделе работ и окно project с живой работой; данные брали у
     файла данных работ (portfolio.data.js), которого больше нет. */

  /* documentLink снята (v48, D-066): она открывала бриф работы в Хранилище,
     а выведенной папки с брифами больше нет — основатель: «прошу всё то, что
     должно быть в приложении build, больше не оставлять в ОС». Документ о
     работе жил тогда карточкой в build/«Избранные проекты»; с D-354 работы
     сняты и оттуда. Реестр отдаёт на одну связь меньше — и это правда, а не
     обеднение: связь без назначения хуже отсутствующей. */

  /* Третий довод — РАЗДЕЛ. Связь может вести не просто в приложение, а в
     определённое его место витрины. С D-354 связей с разделом нет: работы
     сняты, и связи о студии ведут в build на первый экран — туда, где сказано,
     что студия делает и как заказать. */
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
  /* С D-354 ни одна связь не ведёт к работам и не называет их: работы
     временно сняты, и в письмах не остаётся ни отрасли, ни имени работы. */
  var GRAPH = {
    1: function () {
      return [
        appLink("build", t("link.sub.studio")),
        noteLink("Ask the studio what a system like this would take.")
      ];
    },
    /* 2 — this message does not point at a project of its own (since v22).
       The registry drops missing destinations rather than drawing dead
       links, but a graph that silently thins is worse than one that is
       rewritten on purpose. */
    2: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.studio")),
        appLink("files", t("link.sub.briefKept"))
      ];
    },
    3: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.studio")),
        noteLink("Ask about the payback period before the next invoice run.")
      ];
    },
    4: function () {
      return [
        appLink("build", t("link.sub.studio")),
        pricingLink()
      ];
    },
    /* 5 — the studio's own letter (v21). Not a sample: the one real thing in
       the mailbox connects to the other real things — what a project costs
       and where the studio says what it builds. */
    5: function () {
      return [
        pricingLink(),
        appLink("build", t("link.sub.studio")),
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
