/* sys.baby OS — Files (brand "Vault").
 *
 * Spec: os-apps.md section 4.
 * Storage: sysbaby.files.v1 (via sbDB) — the whole tree as one JSON document.
 *   folder {name, type:"folder", children:[]}   file {name, type:"file", content, docId?}
 * v48: выведенной папки «Portfolio» здесь больше нет (D-066) — Хранилище
 * принадлежит человеку, витринное живёт в build. load() вырезает её и из
 * старых сохранённых деревьев.
 */
(function () {
  "use strict";

  var doc = document;
  var KEY = "sysbaby.files.v1";
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/></svg>';
  var FOLDER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/></svg>';
  var THING_SVG = {
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/><path d="M8 12.5h7M8 15.5h7M8 18h4"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9.5h3l4-3v11l-4-3H5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M10 9.5l5 2.5-5 2.5z"/></svg>',
    thing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/></svg>'
  };
  var FILE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/></svg>';

  /* ------------------------------------------------------------ seed data */

  var SEED_TREE = {
    name: "Home",
    type: "folder",
    children: [
      {
        name: "Demo Workspace",
        type: "folder",
        children: [
          {
            name: "Sample Client · Logistics",
            type: "folder",
            children: [
              { name: "SoW (Sample).md", type: "file", content: "# Statement of Work — Sample Client · Logistics\n\nSAMPLE DATA — illustrates CRM functionality, not a real client.\n\nScope: order-routing automation, supplier-invoice flow (phase 2).\nTimeline: 6 weeks." },
              { name: "Automation-Spec (Sample).md", type: "file", content: "# Order-Routing Automation (Sample)\n\nSAMPLE DATA — for demonstration only.\n\n- Ingest orders from the dispatch queue\n- Route by zone + carrier SLA\n- Auto-notify warehouse on assignment" },
              { name: "Invoice (Sample).txt", type: "file", content: "SAMPLE INVOICE — demonstration only\nInvoice #S-0142\nClient: Sample Client · Logistics\nAmount: €1,490.00\nStatus: Paid" }
            ]
          },
          {
            name: "Sample Client · Retail",
            type: "folder",
            children: [
              { name: "SoW (Sample).md", type: "file", content: "# Statement of Work — Sample Client · Retail\n\nSAMPLE DATA — illustrates CRM functionality, not a real client.\n\nScope: inventory sync + reorder automation.\nTimeline: 4 weeks." },
              { name: "Kickoff Notes (Sample).txt", type: "file", content: "SAMPLE DATA — demonstration only.\nKickoff — Sample Client · Retail:\n- Confirmed integrations (POS, warehouse)\n- Weekly sync agreed\n- First milestone: inventory sync" }
            ]
          },
          {
            name: "Proposals (Sample)",
            type: "folder",
            children: [
              { name: "Sample Lead · Food & Beverage.md", type: "file", content: "# Proposal — Sample Lead · Food & Beverage\n\nSAMPLE DATA — demonstration only, not a real prospect.\n\nInterest: invoicing + supplier-onboarding automation.\nStage: intro call." }
            ]
          }
        ]
      },
      {
        name: "Templates",
        type: "folder",
        children: [
          { name: "Statement-of-Work.md", type: "file", content: "# Statement of Work (template)\n\n## Scope\n## Timeline\n## Deliverables\n## Acceptance criteria" }
        ]
      }
    ]
  };

  /* ABOUT_PORTFOLIO снят вместе с выведенной папкой (v48, D-066):
     Хранилище принадлежит человеку, витринное живёт в build. */

  /* The Journal: the system's own memory, planted once (guard key below) so
   * the desktop feels like it lived before you arrived — because it did.
   * Everything in these files is true and checkable; the same history answers
   * to `log` in the Terminal. Delete the folder and it stays deleted:
   * memory offered, never forced. */
  var JOURNAL_GUARD = "sysbaby.journal.files.v1";
  var JOURNAL_FOLDER = {
    name: "Journal",
    type: "folder",
    children: [
      {
        name: "Read me first.txt",
        type: "file",
        content: "This folder is the system's own memory.\n\nEvery system we hand over keeps a record of how it came to be — decisions, dead ends, repairs. This desktop is no exception, because it is the same kind of thing: a working system, built by hand, owned by the person in front of it.\n\nThe short version lives in the Terminal — open it and type `log`.\n\nEvery entry is true. That is the entire trick."
      },
      {
        name: "How the door got its light.txt",
        type: "file",
        content: "aug 2026\n\nThe landing page used to say the word 'applications' at the bottom of the screen, once, to tell you a dock was hiding there.\n\nFirst we made the word assemble itself out of glyphs. Then we made it speak three languages. Then we deleted it.\n\nWhat stayed is a thin line of warm light at the bottom edge — the light under a door. Move toward it and the door opens; the dock's tiles gather to your touch and settle into place.\n\nA label explains. Light invites. We keep choosing the second one.\n"
      },
      {
        name: "The day the mail worked.txt",
        type: "file",
        content: "10 aug 2026\n\nThe order form on the landing page looked finished for weeks. It was not — the chain behind it was broken in three places, and nobody knew, because everything LOOKED fine.\n\nDNS pointed one way, the mail routing another, and the form's endpoint was never activated. We untangled it link by link: registrar → DNS → mail routing → inbox. Then we sent a real letter through the real form and watched it arrive.\n\nThat evening the project's counter of PROVEN things moved off zero. Everything before that had been opinion.\n\nRule kept since: a feature exists when it is observed working, not when its code reads well.\n"
      },
      {
        name: "Where your work is kept.txt",
        type: "file",
        content: "Everything you do in this desktop is stored in this browser and nowhere else. No account, no server, no copy taken.\n\nThat is easy to claim and easy to check: turn off your network and keep working. Nothing will stop.\n\nClose the tab and it is all still here when you come back. Clear your browser data and it is all genuinely gone — including this file."
      },
      {
        name: "Rules the house keeps.txt",
        type: "file",
        content: "Collected from the build journal, in force everywhere in this desktop:\n\n1. You own the system. Your data lives in your browser; export it whole any time. Nothing phones home.\n\n2. Nothing is deleted casually. Removed things wait in Echoes until you decide — certainty is not demanded at the worst moment.\n\n3. The machine speaks in labels, people speak in sentences. When this desktop talks like a person, a person wrote those words.\n\n4. Nothing pretends. Sample data says so on its face. Nothing simulates a delivery, a reply, or a presence that is not there.\n\n5. Evidence over opinion. When two designs argued, we built both and let the runtime decide.\n"
      }
    ]
  };

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function dbGet(key) {
    try {
      if (window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(key);
      return localStorage.getItem(key);
    } catch (err) { console.error("[files] read failed", err); return null; }
  }

  function dbSet(key, value) {
    if (window.sbDB && typeof window.sbDB.set === "function") return window.sbDB.set(key, value);
    localStorage.setItem(key, value);
    return true;
  }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[files] toast failed", err); }
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  /* ---------------------------------------------------------------- store */

  var tree = null;
  var pathStack = [];        // app-global: stack of folder nodes, [0] = root
  var selectedIndex = -1;    // index within the current folder's children
  var previewIndex = -1;     // index of the previewed file, -1 = hidden
  var editing = false;       // preview strip in edit mode

  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }

  function persist() {
    try {
      dbSet(KEY, JSON.stringify(tree));
      return true;
    } catch (err) {
      console.error("[files] save failed", err);
      toast(t("fv.save.failTitle"), t("fv.save.failBody"));
      return false;
    }
  }

  /* briefBody / portfolioEntries / viewOf сняты (v48): они собирали
     досье наших кейсов для выведенной папки. Основатель: «Ни слова про
     build кроме как через приложение build» — Хранилище больше не знает
     о витрине ничего. */
  /* Здесь стояла derivePortfolioFolder() — Хранилище подсаживало брифы
     наших кейсов пользователю. Снята по слову основателя (v48, D-066):
     витринное живёт в build, Хранилище — человеку. Вырезание старых копий —
     в load() ниже. */

  function load() {
    var parsed = null;
    var raw = dbGet(KEY);
    if (raw) {
      try {
        var candidate = JSON.parse(raw);
        if (candidate && candidate.type === "folder" && Array.isArray(candidate.children)) parsed = candidate;
      } catch (err) {
        console.error("[files] corrupt " + KEY + " — reseeding", err);
      }
    }
    tree = parsed || clone(SEED_TREE);

    /* ── ПАПКИ «ПОРТФОЛИО» В ХРАНИЛИЩЕ БОЛЬШЕ НЕТ (v48, D-066) ────────────
       Основатель, по снимку Хранилища с этой папкой: «прошу всё то, что
       должно быть в приложении build, больше не оставлять в ОС». Папка была
       выведенной — Хранилище само подсаживало брифы наших кейсов в стол
       пользователя. Это витринное содержимое в личном месте: ровно то, что
       он просил убрать. Брифы никуда не пропали — карточки работ живут в
       build/«Избранные проекты» (D-062), а Хранилище принадлежит человеку.
       Миграция: выведенная папка ВЫРЕЗАЕТСЯ и из сохранённых деревьев — по
       нашему знаку derived, а для деревьев до перевода — по имени Portfolio,
       и только если все дети несут docId (то есть папка целиком наша).
       Свою папку с тем же именем человек не теряет. */
    tree.children = tree.children.filter(function (child) {
      if (!child || child.type !== "folder") return true;
      if (child.derived === "portfolio") return false;
      if (child.name === "Portfolio" && Array.isArray(child.children) && child.children.length &&
          child.children.every(function (f) { return f && f.docId; })) return false;
      return true;
    });

    /* The Journal is planted exactly once — including into trees stored
     * before it existed. If the visitor deletes it, the guard key remembers
     * and it never comes back on its own: offered memory, not forced. */
    if (dbGet(JOURNAL_GUARD) !== "1") {
      var hasJournal = tree.children.some(function (node) {
        return node && node.type === "folder" && node.name === "Journal";
      });
      if (!hasJournal) tree.children.push(clone(JOURNAL_FOLDER));
      dbSet(JOURNAL_GUARD, "1");
    }

    persist();
    pathStack = [tree];
    selectedIndex = -1;
    previewIndex = -1;
    editing = false;
  }

  function ensureLoaded() { if (!tree) load(); }

  function currentFolder() {
    ensureLoaded();
    if (!pathStack.length) pathStack = [tree];
    return pathStack[pathStack.length - 1];
  }

  /* --------------------------------------------------------- name helpers */

  function splitExt(name) {
    var dot = String(name).lastIndexOf(".");
    if (dot > 0) return { base: name.slice(0, dot), ext: name.slice(dot) };
    return { base: name, ext: "" };
  }

  function uniqueName(folder, wanted, isFolder, skipNode) {
    var taken = {};
    (folder.children || []).forEach(function (node) {
      if (node && node !== skipNode) taken[node.name] = true;
    });
    if (!taken[wanted]) return wanted;
    var n = 2, candidate;
    if (isFolder) {
      do { candidate = wanted + " " + n; n++; } while (taken[candidate]);
    } else {
      var parts = splitExt(wanted);
      do { candidate = parts.base + " " + n + parts.ext; n++; } while (taken[candidate]);
    }
    return candidate;
  }

  /* ── ВЕЩИ (v69) ───────────────────────────────────────────────────────────
     ПОВОД — просьба основателя развивать приложения; Совет назвал первым
     пробелом то, что Хранилище умело только текст, набранный в нём самом.
     Снимок с телефона, договор, счёт внести было нельзя.

     У вещи ДВА МЕСТА. В описи (дереве) лежит запись — имя, род, вес, номер;
     содержимое живёт на складе (window.sbThings, IndexedDB). Дерево — один
     документ JSON, переписываемый целиком при каждой правке; вещь в нём
     переписывалась бы вместе с ним и упёрлась бы в квоту с первого снимка.

     Охраняется tools/vault-things-check.mjs. */

  var THING_CAP = 25 * 1024 * 1024;   /* предел на одну вещь: см. запись ниже */

  function kindOf(mime, name) {
    var m = String(mime || "").toLowerCase();
    var n = String(name || "").toLowerCase();
    if (m.indexOf("image/") === 0) return "image";
    if (m.indexOf("audio/") === 0) return "sound";
    if (m.indexOf("video/") === 0) return "film";
    if (m.indexOf("pdf") !== -1 || /\.(pdf|docx?|odt|rtf|pages|xlsx?|pptx?)$/.test(n)) return "doc";
    return "thing";
  }
  function kindWord(kind) {
    return t("fv.kind" + kind.charAt(0).toUpperCase() + kind.slice(1));
  }
  /* Вес говорится на языке стола: «Б/КБ/МБ» — такие же слова, как «картинка»
     и «документ», и переводятся вместе с ними. */
  function weigh(bytes) {
    var b = Number(bytes) || 0;
    if (b < 1024) return b + " " + t("fv.unitB");
    if (b < 1024 * 1024) return Math.round(b / 1024) + " " + t("fv.unitKB");
    return (Math.round(b / 104857.6) / 10) + " " + t("fv.unitMB");
  }

  /* Ссылки на вещи, выданные браузеру. Держатся, пока окно живо, и
     отзываются при перерисовке: иначе каждая перерисовка оставляла бы за
     собой ещё одну ссылку на мегабайты. */
  var thingUrls = [];
  function releaseThingUrls() {
    thingUrls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) { /* ignore */ } });
    thingUrls = [];
  }
  function thingUrl(blob) {
    var u = URL.createObjectURL(blob);
    thingUrls.push(u);
    return u;
  }

  /* ── ПРИЁМ ВЕЩЕЙ ──────────────────────────────────────────────────────────
     Отказ здесь всегда произносится. Молчаливый отказ хуже отказа: человек
     решит, что вещь внесена, закроет окно — и узнает о потере тогда, когда
     вещи уже нет нигде. */
  window.sbVaultBring = function (files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return Promise.resolve([]);
    if (!window.sbThings) { toast(t("fv.noBring"), t("fv.noBringNote")); return Promise.resolve([]); }
    ensureLoaded();
    var folder = currentFolder();
    var done = [];
    return list.reduce(function (chain, file) {
      return chain.then(function () {
        if (file.size > THING_CAP) {
          toast(t("fv.tooBig", { name: file.name }), t("fv.tooBigNote", { limit: weigh(THING_CAP) }));
          return null;
        }
        return window.sbThings.put(file, { name: file.name, mime: file.type }).then(function (id) {
          if (!id) { toast(t("fv.noBring"), t("fv.noBringNote")); return null; }
          var node = {
            name: uniqueName(folder, file.name || "вещь", false),
            type: "file",
            thingId: id,
            kind: kindOf(file.type, file.name),
            mime: file.type || "",
            size: file.size || 0
          };
          folder.children = folder.children || [];
          folder.children.push(node);
          done.push(node.name);
          persist();
          toast(t("fv.brought", { name: node.name }), t("fv.broughtNote"));
          return node;
        });
      });
    }, Promise.resolve()).then(function () {
      openWindows_render();
      return done;
    });
  };

  /* Перерисовать все открытые окна Хранилища — приём вещи мог случиться и
     не из окна (перетаскиванием на стол в будущем). */
  function openWindows_render() {
    var wins = (window.openWindows || {});
    Object.keys(wins).forEach(function (id) {
      if (id === "files" && wins[id] && wins[id].el) render(wins[id]);
    });
  }

  /* -------------------------------------------------------------- markup */

  function breadcrumbMarkup() {
    return pathStack.map(function (node, idx) {
      var label = idx === 0 ? t("fv.home") : node.name;
      var last = idx === pathStack.length - 1;
      return '<button type="button" class="fv-crumb' + (last ? " current" : "") + '" data-crumb="' + idx + '">' + esc(label) + "</button>" +
        (last ? "" : '<span class="fv-crumb-sep">›</span>');
    }).join("");
  }

  function itemMarkup(node, idx) {
    var isFolder = node.type === "folder";
    var isThing = !isFolder && !!node.thingId;
    /* Вещь показывает свой род прямо на плитке: род и вес — это и есть то,
       что человек о ней знает до открытия. */
    var tile = isFolder ? FOLDER_SVG : (isThing ? THING_SVG[node.kind || "thing"] || FILE_SVG : FILE_SVG);
    return '<div class="fv-item' + (idx === selectedIndex ? " selected" : "") + '" data-index="' + idx + '" tabindex="0">' +
      '<div class="fv-tile ' + (isFolder ? "folder" : "file") + (isThing ? " thing kind-" + esc(node.kind || "thing") : "") + '">' + tile + "</div>" +
      '<div class="fv-name" data-sb-userdata data-name-for="' + idx + '">' + esc(node.name) + "</div>" +
      (isThing ? '<div class="fv-thing-note">' + esc(t("fv.thingKind", { kind: kindWord(node.kind || "thing"), size: weigh(node.size) })) + "</div>" : "") +
      '<div class="fv-mini">' +
        '<button type="button" class="fv-mini-btn" data-rename="' + idx + '" title="' + esc(t("fv.rename")) + '" aria-label="' + esc(t("fv.rename")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 19.5h4l10-10a1.6 1.6 0 0 0 0-2.3l-1.7-1.7a1.6 1.6 0 0 0-2.3 0l-10 10v4Z"/></svg>' +
        "</button>" +
        '<button type="button" class="fv-mini-btn danger" data-delete="' + idx + '" title="' + esc(t("fv.delete")) + '" aria-label="' + esc(t("fv.delete")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg>' +
        "</button>" +
      "</div>" +
    "</div>";
  }

  /* realEntryForFile снята (v48): кнопка «открыть настоящую систему» в
     предпросмотре работала только для брифов витрины — их в Хранилище
     больше нет, и файл человека система за витринный не выдаёт. */

  /* ── ПРОСМОТР ВЕЩИ (v69) ──────────────────────────────────────────────────
     Картинку система ПОКАЗЫВАЕТ. Про всё прочее говорит честно: род, вес,
     имя — и предлагает сохранить к себе. Обещать «просмотр документа» и
     показать пустоту было бы хуже, чем сказать словами: система никогда не
     заявляет о том, чего не сделала. */
  function thingPreviewMarkup(node) {
    var kind = node.kind || "thing";
    var head = '<div class="fv-preview-head">' +
      '<span class="fv-preview-name" data-sb-userdata>' + esc(node.name) + "</span>" +
      '<span class="fv-preview-actions">' +
        '<button type="button" class="fv-edit" id="fvThingSave" title="' + esc(t("fv.thingSave")) + '" aria-label="' + esc(t("fv.thingSave")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v10M8.2 11l3.8 3.8L15.8 11M5 18.5h14"/></svg>' +
        "</button>" +
      "</span></div>";
    var body = kind === "image"
      ? '<div class="fv-thing-view"><img id="fvThingImg" alt="' + esc(node.name) + '"></div>'
      : '<div class="fv-thing-view fv-thing-said">' +
          '<div class="fv-thing-icon">' + (THING_SVG[kind] || FILE_SVG) + "</div>" +
          '<div class="fv-thing-said-text">' +
            esc(t("fv.thingKind", { kind: kindWord(kind), size: weigh(node.size) })) +
          "</div></div>";
    return '<div class="fv-preview" data-thing="' + esc(node.thingId) + '">' + head + body + "</div>";
  }

  function previewMarkup(node) {
    if (!node) return "";
    if (node.thingId) return thingPreviewMarkup(node);
    return '<div class="fv-preview">' +
      '<div class="fv-preview-head">' +
        '<span class="fv-preview-name" data-sb-userdata>' + esc(node.name) + "</span>" +
        '<span class="fv-preview-actions">' +

          '<button type="button" class="fv-edit" id="fvEdit" title="' + esc(t("fv.edit")) + '" aria-label="' + esc(t("fv.edit")) + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 19.5h4l10-10a1.6 1.6 0 0 0 0-2.3l-1.7-1.7a1.6 1.6 0 0 0-2.3 0l-10 10v4Z"/></svg>' +
          "</button>" +
        "</span>" +
      "</div>" +
      (editing
        /* Leading newline compensates for the one HTML parsing eats right
         * after <textarea>: without it a file starting with a blank line
         * would lose it the first time the preview is edited. */
        ? '<textarea class="fv-preview-edit" id="fvEditArea" spellcheck="false">\n' + esc(node.content || "") + "</textarea>"
        /* Содержимое файла — данные посетителя. */
        : '<pre class="fv-preview-body" data-sb-userdata>' + esc(node.content || "") + "</pre>") +
    "</div>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    ensureLoaded();
    var folder = currentFolder();
    var children = folder.children || [];
    var previewNode = previewIndex >= 0 && children[previewIndex] && children[previewIndex].type === "file"
      ? children[previewIndex] : null;
    /* Ссылки прошлой перерисовки отзываются здесь: держать их дольше значит
       держать мегабайты за уже стёртой картинкой. */
    releaseThingUrls();

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-files">' +
        '<div class="fv-bar">' +
          '<div class="fv-crumbs">' + breadcrumbMarkup() + "</div>" +
          '<div class="fv-tools">' +
            '<button type="button" class="fv-tool" id="fvNewFolder" title="' + esc(t("fv.newFolder")) + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/><path d="M12 11.6v5M9.5 14.1h5"/></svg>' +
              "<span>" + esc(t("fv.newFolder")) + "</span></button>" +
            '<button type="button" class="fv-tool" id="fvNewFile" title="' + esc(t("fv.newFile")) + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/><path d="M11.5 12v5M9 14.5h5"/></svg>' +
              "<span>" + esc(t("fv.newFile")) + "</span></button>" +
            '<button type="button" class="fv-tool" id="fvBring" title="' + esc(t("fv.bring")) + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16.5v-10M8.2 10L12 6.2 15.8 10M5 19.5h14"/></svg>' +
              "<span>" + esc(t("fv.bring")) + "</span></button>" +
          "</div>" +
        "</div>" +
        '<div class="fv-grid" id="fvGrid">' +
          (children.length
            ? children.map(itemMarkup).join("")
            : '<div class="fv-empty">' + esc(t("fv.empty")) + "</div>") +
        "</div>" +
        (previewNode ? previewMarkup(previewNode) : "") +
        '<div class="fv-catch">' + esc(t("fv.bringDrop")) + "</div>" +
      "</div>";
    if (_sbKeep) _sbKeep();

    wire(win, host);
  }

  /* --------------------------------------------------------------- wiring */

  function wire(win, host) {
    /* ── ВЕЩЬ ПОКАЗЫВАЕТСЯ ПОСЛЕ ТОГО, КАК ЕЁ ДОСТАЛИ СО СКЛАДА ──────────────
       Склад отвечает не сразу (IndexedDB — обещание), поэтому картинка
       вставляется, когда пришла, а не когда нарисовали разметку. */
    var thingBox = host.querySelector(".fv-preview[data-thing]");
    if (thingBox && window.sbThings) {
      var tid = thingBox.getAttribute("data-thing");
      window.sbThings.get(tid).then(function (rec) {
        if (!rec || !rec.blob || !thingBox.isConnected) return;
        var img = thingBox.querySelector("#fvThingImg");
        if (img) img.src = thingUrl(rec.blob);
        var save = thingBox.querySelector("#fvThingSave");
        if (save) save.addEventListener("click", function () {
          var a = doc.createElement("a");
          a.href = thingUrl(rec.blob);
          a.download = rec.name || "thing";
          doc.body.appendChild(a);
          a.click();
          doc.body.removeChild(a);
        });
      });
    }

    /* ── ПРИНЕСТИ ВЕЩЬ: КНОПКА И ОТПУСКАНИЕ НА ОКНО ─────────────────────── */
    var bring = host.querySelector("#fvBring");
    if (bring) {
      bring.addEventListener("click", function () {
        var inp = doc.createElement("input");
        inp.type = "file";
        inp.multiple = true;
        inp.style.cssText = "position:fixed;left:-9999px;width:1px;height:1px";
        doc.body.appendChild(inp);
        inp.addEventListener("change", function () {
          var files = inp.files;
          doc.body.removeChild(inp);
          if (files && files.length) window.sbVaultBring(files);
        });
        inp.click();
      });
    }
    var shell = host.querySelector(".app-files");
    if (shell) {
      ["dragenter", "dragover"].forEach(function (ev) {
        shell.addEventListener(ev, function (e) {
          if (!e.dataTransfer || Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") === -1) return;
          e.preventDefault();
          shell.classList.add("catching");
        });
      });
      ["dragleave", "dragend"].forEach(function (ev) {
        shell.addEventListener(ev, function (e) {
          if (e.target !== shell) return;
          shell.classList.remove("catching");
        });
      });
      shell.addEventListener("drop", function (e) {
        if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
        e.preventDefault();
        shell.classList.remove("catching");
        window.sbVaultBring(e.dataTransfer.files);
      });
    }

    host.querySelectorAll(".fv-crumb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-crumb"), 10);
        pathStack = pathStack.slice(0, idx + 1);
        selectedIndex = -1;
        previewIndex = -1;
        editing = false;
        render(win);
      });
    });

    var newFolder = host.querySelector("#fvNewFolder");
    if (newFolder) newFolder.addEventListener("click", function () { createNode(win, true); });
    var newFile = host.querySelector("#fvNewFile");
    if (newFile) newFile.addEventListener("click", function () { createNode(win, false); });

    host.querySelectorAll(".fv-item").forEach(function (item) {
      var idx = parseInt(item.getAttribute("data-index"), 10);
      item.addEventListener("click", function (ev) {
        if (ev.target.closest && ev.target.closest(".fv-mini")) return;
        selectItem(win, idx);
      });
      item.addEventListener("dblclick", function (ev) {
        if (ev.target.closest && ev.target.closest(".fv-mini")) return;
        var node = (currentFolder().children || [])[idx];
        if (node && node.type === "folder") {
          pathStack.push(node);
          selectedIndex = -1;
          previewIndex = -1;
          editing = false;
          render(win);
        }
      });
    });

    host.querySelectorAll("[data-rename]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        beginRename(win, parseInt(btn.getAttribute("data-rename"), 10));
      });
    });

    host.querySelectorAll("[data-delete]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        removeNode(win, parseInt(btn.getAttribute("data-delete"), 10));
      });
    });

    var editBtn = host.querySelector("#fvEdit");
    if (editBtn) {
      editBtn.addEventListener("click", function () {
        editing = !editing;
        render(win);
        var area = bodyOf(win) && bodyOf(win).querySelector("#fvEditArea");
        if (area) area.focus();
      });
    }

    var area = host.querySelector("#fvEditArea");
    if (area) {
      var timer = null;
      area.addEventListener("input", function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () { commitEdit(area.value); }, 400);
      });
      area.addEventListener("blur", function () {
        if (timer) clearTimeout(timer);
        commitEdit(area.value);
        editing = false;
        render(win);
      });
    }

    /* Проводка fv-open-real снята вместе с кнопкой (v48, см. выше). */
  }

  function commitEdit(value) {
    var node = (currentFolder().children || [])[previewIndex];
    if (!node || node.type !== "file") return;
    if (node.content === value) return;
    node.content = value;
    persist();
  }

  function selectItem(win, idx) {
    var node = (currentFolder().children || [])[idx];
    selectedIndex = idx;
    editing = false;
    previewIndex = node && node.type === "file" ? idx : -1;
    render(win);
  }

  function createNode(win, isFolder) {
    var folder = currentFolder();
    if (!Array.isArray(folder.children)) folder.children = [];
    /* Имя нового файла — на языке того, кто его создал. Дальше это его
       данные: смена языка задним числом чужие имена не трогает. */
    var name = uniqueName(folder, isFolder ? t("fv.newFolder.name") : t("fv.newFile.name"), isFolder, null);
    var node = isFolder ? { name: name, type: "folder", children: [] } : { name: name, type: "file", content: "" };
    folder.children.push(node);
    persist();
    selectedIndex = folder.children.length - 1;
    previewIndex = -1;
    editing = false;
    render(win);
    beginRename(win, selectedIndex);
  }

  function beginRename(win, idx) {
    var host = bodyOf(win);
    if (!host) return;
    var folder = currentFolder();
    var node = (folder.children || [])[idx];
    var label = host.querySelector('[data-name-for="' + idx + '"]');
    if (!node || !label) return;

    var input = document.createElement("input");
    input.type = "text";
    input.className = "fv-rename";
    input.value = node.name;
    input.spellcheck = false;
    label.replaceWith(input);
    input.focus();
    input.select();

    var done = false;
    function commit() {
      if (done) return;
      done = true;
      var wanted = input.value.trim();
      if (!wanted || wanted === node.name) { render(win); return; }
      node.name = uniqueName(folder, wanted, node.type === "folder", node);
      persist();
      render(win);
    }
    function cancel() {
      if (done) return;
      done = true;
      render(win);
    }

    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { ev.preventDefault(); ev.stopPropagation(); commit(); }
      else if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cancel(); }
    });
    input.addEventListener("blur", commit);
  }

  /* Все номера вещей внутри узла — сам узел и всё, что под ним. */
  function collectThings(node) {
    var out = [];
    (function walk(n) {
      if (!n) return;
      if (n.thingId) out.push(n.thingId);
      (n.children || []).forEach(walk);
    })(node);
    return out;
  }

  function removeNode(win, idx) {
    var folder = currentFolder();
    var node = (folder.children || [])[idx];
    if (!node) return;
    var question = node.type === "folder"
      ? t("fv.confirm.folder", { name: node.name })
      : t("fv.confirm.file", { name: node.name });
    var extra = (node.type === "folder" && (node.children || []).length) ? t("fv.confirm.nested") : "";
    if (!window.confirm(question + extra)) return;
    /* ── ВЫНУТАЯ ИЗ ОПИСИ ВЕЩЬ УХОДИТ СО СКЛАДА (v69) ──────────────────────
       Иначе Хранилище копило бы навсегда то, что человек уже выбросил, и
       узнать об этом было бы неоткуда: в описи вещи нет, а место занято.
       Собирается и то, что лежит внутри выброшенной папки. */
    collectThings(node).forEach(function (id) {
      if (window.sbThings) window.sbThings.del(id);
    });
    folder.children.splice(idx, 1);
    persist();
    selectedIndex = -1;
    previewIndex = -1;
    editing = false;
    render(win);
    toast(t("fv.toast.title"), t("fv.toast.deleted", { name: node.name }));
  }

  /* ------------------------------------------------------------ providers */

  function flatten() {
    ensureLoaded();
    var out = [];
    (function walk(node, segments) {
      (node.children || []).forEach(function (child) {
        if (!child) return;
        var next = segments.concat([child.name]);
        if (child.type === "folder") walk(child, next);
        else out.push({ name: child.name, path: next, content: child.content || "", docId: child.docId });
      });
    })(tree, []);
    return out;
  }

  window.sbFilesAll = function () {
    return flatten().map(function (f) { return { name: f.name, path: f.path.slice(), content: f.content, docId: f.docId }; });
  };

  window.sbFilesSearch = function (q) {
    var needle = String(q == null ? "" : q).trim().toLowerCase();
    if (!needle) return [];
    return window.sbFilesAll().filter(function (f) {
      return String(f.name).toLowerCase().indexOf(needle) !== -1 ||
        String(f.content).toLowerCase().indexOf(needle) !== -1;
    });
  };

  function showMissStrip(win, name) {
    var host = bodyOf(win);
    if (!host) return;
    var strip = document.createElement("div");
    strip.className = "fv-miss";
    strip.innerHTML = "“" + esc(name) + "” isn’t here — it may have been renamed or removed.";
    host.insertBefore(strip, host.firstChild);
    setTimeout(function () {
      strip.classList.add("fading");
      setTimeout(function () { if (strip.parentNode) strip.parentNode.removeChild(strip); }, 400);
    }, 5200);
  }

  window.sbFilesOpenResult = function (win, result) {
    if (!win || !result || !Array.isArray(result.path)) return false;
    ensureLoaded();
    var segments = result.path.slice();
    var fileName = segments.length ? segments[segments.length - 1] : "";
    var folders = segments.slice(0, -1);
    var stack = [tree];
    var node = tree;
    for (var i = 0; i < folders.length; i++) {
      var next = null;
      (node.children || []).forEach(function (child) {
        if (!next && child && child.type === "folder" && child.name === folders[i]) next = child;
      });
      if (!next) return false;
      node = next;
      stack.push(next);
    }
    pathStack = stack;
    selectedIndex = -1;
    previewIndex = -1;
    editing = false;
    render(win);

    var children = node.children || [];
    var found = -1;
    if (result.docId) {
      for (var d = 0; d < children.length; d++) {
        if (children[d] && children[d].docId === result.docId) { found = d; break; }
      }
    }
    if (found < 0) {
      for (var n = 0; n < children.length; n++) {
        if (children[n] && children[n].type === "file" && children[n].name === fileName) { found = n; break; }
      }
    }
    if (found < 0) {
      showMissStrip(win, result.name || fileName);
      return false;
    }
    var host = bodyOf(win);
    var item = host && host.querySelector('.fv-item[data-index="' + found + '"]');
    if (item) item.click();
    else selectItem(win, found);
    return true;
  };

  /* Appends a document at Home root only if no root child holds that name. */
  window.sbFilesSeedDocument = function (name, body) {
    ensureLoaded();
    var exists = (tree.children || []).some(function (child) { return child && child.name === name; });
    if (exists) return false;
    tree.children.push({ name: name, type: "file", content: body });
    persist();
    return true;
  };

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка — но не поверх набранного текста: пока
     открыт редактор файла или переименование, окно оставляют в покое.
     Незаписанное принадлежит посетителю, а не переводу. */
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("translate:done", function () {
      var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("files") : null;
      var host = win ? bodyOf(win) : null;
      if (!host) return;
      if (editing || host.querySelector(".fv-rename")) return;
      try { render(win); } catch (err) { console.error("[files] retranslate failed", err); }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("files", {
      title: "Vault",
      i18n: {
        ru: { title: "Хранилище", label: "Хранилище" },
        ee: { title: "Hoidla", label: "Hoidla" },
      },
      label: "Vault",
      color: "linear-gradient(160deg,#66e0d8 0%,#2bb6c9 48%,#1481c4 100%)",
      icon: ICON,
      size: { w: 640, h: 500 },
      deskPos: { x: 40, y: 150 },
      render: render
    });
  }
})();
