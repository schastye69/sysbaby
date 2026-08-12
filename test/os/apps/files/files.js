/* sys.baby OS — Files (brand "Vault").
 *
 * Spec: os-apps.md section 4.
 * Storage: sysbaby.files.v1 (via sbDB) — the whole tree as one JSON document.
 *   folder {name, type:"folder", children:[]}   file {name, type:"file", content, docId?}
 * The "Portfolio" folder at Home root is DERIVED: regenerated from
 * sbPortfolio/sbPortfolioView on every load and re-persisted. Never user content.
 */
(function () {
  "use strict";

  var KEY = "sysbaby.files.v1";
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/></svg>';
  var FOLDER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/></svg>';
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

  var ABOUT_PORTFOLIO = {
    name: "About Portfolio.md",
    type: "file",
    content: "# Portfolio\n\nReal completed client work appears here from the canonical portfolio source."
  };

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

  function persist() {
    try {
      dbSet(KEY, JSON.stringify(tree));
      return true;
    } catch (err) {
      console.error("[files] save failed", err);
      toast("Couldn't save", "Storage may be full or restricted in this browser.");
      return false;
    }
  }

  function briefBody(view) {
    var visibility = view.confidential ? "Anonymous (client identity withheld by request)" : "Public";
    var results;
    if (view.resultsState === "measured") results = view.results;
    else if (view.resultsState === "withheld") results = "Withheld at the client's request — the same discretion covers your project.";
    else if (view.resultsPendingReason === "not-yet-delivered") results = "Built and not yet handed over. Measurement is agreed at handover.";
    else results = "Outcome measurement is agreed with the client and scheduled.";

    var features = (view.features || []).map(function (f) { return "- " + f; }).join("\n");
    return "# Portfolio Case — " + view.name + "\n\n" +
      "Visibility: " + visibility + "\n" +
      "Status: Real — completed client project\n\n" +
      "Industry: " + view.industry + "\n" +
      "Project: " + view.projectType + "\n\n" +
      "Delivered:\n" + features + "\n\n" +
      "Goal: " + view.goal + "\n" +
      "Results: " + results + "\n";
  }

  function portfolioEntries() {
    var list = Array.isArray(window.sbPortfolio) ? window.sbPortfolio : [];
    /* private entries are never surfaced (shared portfolio-data contract) */
    return list.filter(function (e) { return e && e.visibility !== "private"; });
  }

  function viewOf(entry) {
    if (typeof window.sbPortfolioView !== "function") return null;
    try { return window.sbPortfolioView(entry); } catch (err) { console.error("[files] portfolio view failed", err); return null; }
  }

  function derivePortfolioFolder() {
    var children = [];
    portfolioEntries().forEach(function (entry) {
      var view = viewOf(entry);
      if (!view) return;
      children.push({ name: view.name + ".md", type: "file", content: briefBody(view), docId: entry.id });
    });
    if (!children.length) children = [clone(ABOUT_PORTFOLIO)];
    return { name: "Portfolio", type: "folder", children: children };
  }

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

    /* Derived Portfolio folder: replace in place, or append when missing. */
    var derived = derivePortfolioFolder();
    var at = -1;
    for (var i = 0; i < tree.children.length; i++) {
      if (tree.children[i] && tree.children[i].name === "Portfolio" && tree.children[i].type === "folder") { at = i; break; }
    }
    if (at >= 0) tree.children[at] = derived;
    else tree.children.unshift(derived);

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

  /* -------------------------------------------------------------- markup */

  function breadcrumbMarkup() {
    return pathStack.map(function (node, idx) {
      var label = idx === 0 ? "Home" : node.name;
      var last = idx === pathStack.length - 1;
      return '<button type="button" class="fv-crumb' + (last ? " current" : "") + '" data-crumb="' + idx + '">' + esc(label) + "</button>" +
        (last ? "" : '<span class="fv-crumb-sep">›</span>');
    }).join("");
  }

  function itemMarkup(node, idx) {
    var isFolder = node.type === "folder";
    return '<div class="fv-item' + (idx === selectedIndex ? " selected" : "") + '" data-index="' + idx + '" tabindex="0">' +
      '<div class="fv-tile ' + (isFolder ? "folder" : "file") + '">' + (isFolder ? FOLDER_SVG : FILE_SVG) + "</div>" +
      '<div class="fv-name" data-name-for="' + idx + '">' + esc(node.name) + "</div>" +
      '<div class="fv-mini">' +
        '<button type="button" class="fv-mini-btn" data-rename="' + idx + '" title="Rename" aria-label="Rename">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 19.5h4l10-10a1.6 1.6 0 0 0 0-2.3l-1.7-1.7a1.6 1.6 0 0 0-2.3 0l-10 10v4Z"/></svg>' +
        "</button>" +
        '<button type="button" class="fv-mini-btn danger" data-delete="' + idx + '" title="Delete" aria-label="Delete">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg>' +
        "</button>" +
      "</div>" +
    "</div>";
  }

  function realEntryForFile(node) {
    if (!node || node.type !== "file") return null;
    var match = null;
    portfolioEntries().forEach(function (entry) {
      if (!entry.real) return;
      var view = viewOf(entry);
      if (view && view.name + ".md" === node.name) match = entry;
    });
    return match;
  }

  function previewMarkup(node) {
    if (!node) return "";
    var entry = realEntryForFile(node);
    return '<div class="fv-preview">' +
      '<div class="fv-preview-head">' +
        '<span class="fv-preview-name">' + esc(node.name) + "</span>" +
        '<span class="fv-preview-actions">' +
          (entry ? '<button type="button" class="fv-open-real" data-entry="' + esc(entry.id) + '">Open the real project →</button>' : "") +
          '<button type="button" class="fv-edit" id="fvEdit" title="Edit" aria-label="Edit">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 19.5h4l10-10a1.6 1.6 0 0 0 0-2.3l-1.7-1.7a1.6 1.6 0 0 0-2.3 0l-10 10v4Z"/></svg>' +
          "</button>" +
        "</span>" +
      "</div>" +
      (editing
        /* Leading newline compensates for the one HTML parsing eats right
         * after <textarea>: without it a file starting with a blank line
         * would lose it the first time the preview is edited. */
        ? '<textarea class="fv-preview-edit" id="fvEditArea" spellcheck="false">\n' + esc(node.content || "") + "</textarea>"
        : '<pre class="fv-preview-body">' + esc(node.content || "") + "</pre>") +
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

    host.innerHTML =
      '<div class="app-files">' +
        '<div class="fv-bar">' +
          '<div class="fv-crumbs">' + breadcrumbMarkup() + "</div>" +
          '<div class="fv-tools">' +
            '<button type="button" class="fv-tool" id="fvNewFolder" title="New Folder">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.2a1.2 1.2 0 0 1 1.2-1.2h4l1.8 2h8.3a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2H4.7a1.2 1.2 0 0 1-1.2-1.2V7.2Z"/><path d="M12 11.6v5M9.5 14.1h5"/></svg>' +
              "<span>New Folder</span></button>" +
            '<button type="button" class="fv-tool" id="fvNewFile" title="New File">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/><path d="M11.5 12v5M9 14.5h5"/></svg>' +
              "<span>New File</span></button>" +
          "</div>" +
        "</div>" +
        '<div class="fv-grid" id="fvGrid">' +
          (children.length
            ? children.map(itemMarkup).join("")
            : '<div class="fv-empty">This folder is empty. Anything you add stays in this browser.</div>') +
        "</div>" +
        (previewNode ? previewMarkup(previewNode) : "") +
      "</div>";

    wire(win, host);
  }

  /* --------------------------------------------------------------- wiring */

  function wire(win, host) {
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

    var openReal = host.querySelector(".fv-open-real");
    if (openReal) {
      openReal.addEventListener("click", function () {
        var entryId = openReal.getAttribute("data-entry");
        if (typeof window.sbProjectSelect === "function") {
          try { window.sbProjectSelect(entryId); } catch (err) { console.error("[files] project select failed", err); }
        }
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("project"); } catch (err) { console.error("[files] toggleApp failed", err); }
        }
        var projectWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("project") : null;
        if (projectWin && typeof window.sbProjectOpen === "function") {
          try { window.sbProjectOpen(projectWin, entryId); } catch (err) { console.error("[files] project open failed", err); }
        }
      });
    }
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
    var name = uniqueName(folder, isFolder ? "New Folder" : "Untitled.txt", isFolder, null);
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

  function removeNode(win, idx) {
    var folder = currentFolder();
    var node = (folder.children || [])[idx];
    if (!node) return;
    var kind = node.type === "folder" ? "folder" : "file";
    var extra = (node.type === "folder" && (node.children || []).length) ? " Everything inside it will be deleted too." : "";
    if (!window.confirm('Delete the ' + kind + ' "' + node.name + '"?' + extra)) return;
    folder.children.splice(idx, 1);
    persist();
    selectedIndex = -1;
    previewIndex = -1;
    editing = false;
    render(win);
    toast("Files", '"' + node.name + '" deleted');
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
