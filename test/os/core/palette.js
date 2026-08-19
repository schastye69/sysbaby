/* sys.baby OS — core/palette.js
 * ⌘K command palette (§8). Sources: launchable apps (registry order) +
 * theme toggle + panel actions + a live "search for …" action that uses the
 * real provider signature sbSearchOpenQuery(win, query). */
(function () {
  "use strict";

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }

  /* The app name has one source, in the shell. Reading def.title here is how
     the ⌘K palette and the panels used to end up permanently English while
     the dock beside them translated correctly. */
  function appTitle(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }
  function appLabel(id) { return window.sbAppLabel ? window.sbAppLabel(id) : id; }

  var box = null, input = null, list = null;
  var items = [], active = 0, openState = false;

  function ensure() {
    if (box) return box;
    box = $("#sbCmdk");
    if (!box) return null;
    input = $("#sbCmdkInput", box);
    list = $("#sbCmdkList", box);
    box.addEventListener("pointerdown", function (ev) { if (ev.target === box) close(); });
    if (input) {
      input.addEventListener("input", function () { build(input.value); });
      input.addEventListener("keydown", onKey);
    }
    return box;
  }

  function appActions() {
    var out = [];
    var reg = (window.SysBaby && window.SysBaby.apps) || {};
    var order = window.sbLaunchableApps ? window.sbLaunchableApps() : [];
    order.forEach(function (id) {
      var def = reg[id];
      if (!def) return;
      out.push({
        key: appTitle(id) + " " + appLabel(id),
        title: appTitle(id),
        sub: appLabel(id),
        color: def.color || "",
        icon: def.icon || "",
        run: function () { if (window.toggleApp) window.toggleApp(id); }
      });
    });
    return out;
  }

  function extraActions(query) {
    var out = [];
    var themeNow = window.sbGetTheme ? window.sbGetTheme() : "dark";
    var next = themeNow === "light" ? "dark" : "light";
    /* The palette matches on `key`, so the searchable text has to be the
       translated text too — otherwise a Russian visitor types Russian and the
       Russian row does not come back. */
    var themeTitle = tr("k.switchTo", { mode: tr(next === "light" ? "k.light" : "k.dark") });
    out.push({
      key: themeTitle + " " + tr("k.toggleAppearance"),
      title: themeTitle,
      sub: tr("k.toggleAppearance"),
      color: "linear-gradient(160deg,#6f7480,#2a2c33)",
      icon: "",
      run: function () { if (window.setTheme) window.setTheme(next); }
    });
    [["sbShortcutsOverlay", "k.shortcuts"],
     ["sbTaskOverlay", "k.windows"],
     ["sbClipOverlay", "k.clipboard"],
     ["sbLayoutsOverlay", "k.layouts"],
     ["sbWidgetsOverlay", "k.manageDesktop"],
     ["sbDiagOverlay", "k.health"]].forEach(function (p) {
      var name = tr(p[1]), kind = tr("k.panel");
      out.push({
        key: name + " " + kind,
        title: name,
        sub: kind,
        color: "linear-gradient(160deg,#4a4e58,#111216)",
        icon: "",
        run: function () { if (window.sbPanels && window.sbPanels[p[0]]) window.sbPanels[p[0]].open(); }
      });
    });
    var q = String(query || "").trim();
    if (q && window.sbSearchOpenQuery && (window.SysBaby && window.SysBaby.apps && window.SysBaby.apps.search)) {
      out.unshift({
        key: q + " search seek",
        title: tr("k.searchFor", { q: q }),
        sub: tr("k.everything"),
        color: "linear-gradient(160deg,#4a4e58 0%,#2a2c33 50%,#111216 100%)",
        icon: "",
        raw: true,
        run: function () {
          if (window.toggleApp) window.toggleApp("search");
          setTimeout(function () {
            var win = window.getOpenWindow ? window.getOpenWindow("search") : null;
            if (win && window.sbSearchOpenQuery) window.sbSearchOpenQuery(win, q);   /* (win, query) */
          }, 260);
        }
      });
    }
    return out;
  }

  function build(query) {
    if (!list) return;
    var q = String(query || "").toLowerCase().trim();
    var all = appActions().concat(extraActions(query));
    items = q ? all.filter(function (a) { return a.key.toLowerCase().indexOf(q) !== -1 || (a.raw === true); }) : all;
    active = 0;
    if (!items.length) {
      list.innerHTML = '<li class="cmdk-empty">' + esc(tr("k.empty")) + "</li>";
      return;
    }
    list.innerHTML = items.map(function (a, i) {
      return '<li class="cmdk-item' + (i === 0 ? " active" : "") + '" data-i="' + i + '" role="option">' +
        '<span class="cmdk-tile" style="background:' + esc(a.color) + '">' + (a.icon || "") + "</span>" +
        '<span class="cmdk-text"><span class="cmdk-title">' + esc(a.title) + "</span>" +
        (a.sub ? '<span class="cmdk-sub">' + esc(a.sub) + "</span>" : "") + "</span></li>";
    }).join("");
    Array.prototype.forEach.call(list.querySelectorAll(".cmdk-item"), function (li) {
      li.addEventListener("pointerenter", function () { setActive(Number(li.getAttribute("data-i"))); });
      li.addEventListener("click", function () { setActive(Number(li.getAttribute("data-i"))); run(); });
    });
  }

  function setActive(i) {
    if (!items.length) return;
    active = (i + items.length) % items.length;
    Array.prototype.forEach.call(list.querySelectorAll(".cmdk-item"), function (li, n) {
      li.classList.toggle("active", n === active);
      if (n === active && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
    });
  }

  function run() {
    var a = items[active];
    if (!a) return;
    close();
    setTimeout(function () {
      try { a.run(); } catch (e) { if (window.console) console.error("[palette]", e); }
    }, 140);
  }

  function onKey(ev) {
    if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(active + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(active - 1); }
    else if (ev.key === "Enter") { ev.preventDefault(); run(); }
  }

  function open(prefill) {
    if (!ensure()) return;
    openState = true;
    box.classList.add("open");
    box.removeAttribute("hidden");
    if (input) {
      input.value = prefill == null ? "" : String(prefill);
      setTimeout(function () { try { input.focus(); input.select(); } catch (e) { /* ignore */ } }, 20);
    }
    build(input ? input.value : "");
  }

  function close() {
    if (!box) return;
    openState = false;
    box.classList.remove("open");
    box.setAttribute("hidden", "");
  }

  window.openCmdk = function (prefill) { open(prefill); };
  window.sbClosePalette = close;
  window.sbPaletteIsOpen = function () { return openState; };

  doc.addEventListener("keydown", function (ev) {
    if ((ev.metaKey || ev.ctrlKey) && String(ev.key || "").toLowerCase() === "k") {
      ev.preventDefault();
      if (openState) close(); else open("");
    }
  });

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", ensure);
  else ensure();
})();
