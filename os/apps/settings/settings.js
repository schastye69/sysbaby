/* sys.baby OS — Settings (brand "Pulse").
 *
 * Spec: os-apps.md section 7.
 * Settings never keeps its own flags: every control reads and writes the same
 * shell global the Control Center/topbar uses (one source of truth per
 * setting). Cloud sync is DROPPED — replaced by JSON export/import built on
 * the shell's export envelope (os-shell.md 1.5). No network of any kind.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"/><path d="M19.2 14.2a1.5 1.5 0 0 0 .3 1.65l.06.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37V20a1.8 1.8 0 0 1-3.6 0v-.1a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06A1.8 1.8 0 1 1 4.56 16.3l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9H3a1.8 1.8 0 0 1 0-3.6h.1a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06A1.8 1.8 0 1 1 6.66 4.85l.06.06a1.5 1.5 0 0 0 1.65.3H8.5a1.5 1.5 0 0 0 .9-1.37V3a1.8 1.8 0 0 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.08a1.5 1.5 0 0 0 1.37.9H21a1.8 1.8 0 0 1 0 3.6h-.1a1.5 1.5 0 0 0-1.37.9Z"/></svg>';

  var AUTHED_KEY = "sysbaby.authed";                 // raw localStorage

  var EXPORT_APP = "sysbaby-os";
  var EXPORT_VERSION = 1;

  /* Строки этого приложения живут в STRINGS ядра (core/topbar.js), а здесь
     стоят только ключи. Причина ровно одна: applyLang() и смена языка на
     лету видят ключ и не видят литерал. Ярлык раздела — labelKey, а не
     label, чтобы «Appearance» физически негде было написать. */
  var SECTIONS = [
    { id: "general", labelKey: "set.tab.general", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8.4" r="3.2"/><path d="M5.2 19.4a6.8 6.8 0 0 1 13.6 0"/></svg>' },
    { id: "appearance", labelKey: "set.tab.appearance", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="7.8"/><path d="M12 4.2v15.6"/></svg>' },
    { id: "sound", labelKey: "set.tab.sound", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 9.5h3l4-3.2v11.4l-4-3.2h-3Z"/><path d="M15.4 9.2a4 4 0 0 1 0 5.6"/></svg>' },
    { id: "desktop", labelKey: "set.tab.desktop", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3.4" y="5" width="17.2" height="11.4" rx="2"/><path d="M8 19.6h8"/></svg>' },
    { id: "privacy", labelKey: "set.tab.privacy", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.8 5.4 6.4v5c0 4.2 2.8 7.6 6.6 8.8 3.8-1.2 6.6-4.6 6.6-8.8v-5L12 3.8Z"/></svg>' },
    { id: "advanced", labelKey: "set.tab.advanced", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 7.5h14M5 12h14M5 16.5h14"/><circle cx="9" cy="7.5" r="1.6"/><circle cx="15" cy="16.5" r="1.6"/></svg>' },
    { id: "about", labelKey: "set.tab.about", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="7.8"/><path d="M12 11v5.2M12 8.1v.1"/></svg>' }
  ];

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  /* Единственная дверь к строкам. Если ядро ещё не загрузилось, вернётся
     сам ключ — это видно глазом и чинится, а не молча пустеет. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  /* Имя другого приложения берётся у оболочки: подстановка «{mail}» обязана
     совпасть с тем, что написано под иконкой в доке. */
  function appName(id) { return typeof window.sbAppTitle === "function" ? window.sbAppTitle(id) : id; }

  function dbGet(key) {
    try {
      if (window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(key);
      return localStorage.getItem(key);
    } catch (err) { console.error("[settings] read failed", err); return null; }
  }

  function dbSet(key, value) {
    try {
      if (window.sbDB && typeof window.sbDB.set === "function") { window.sbDB.set(key, value); return true; }
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.error("[settings] write failed", err);
      toast(t("set.save.failTitle"), t("set.save.failBody"));
      return false;
    }
  }

  function dbFlush() {
    try { if (window.sbDB && typeof window.sbDB.flushSync === "function") window.sbDB.flushSync(); }
    catch (err) { console.error("[settings] flush failed", err); }
  }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[settings] toast failed", err); }
  }

  function toggleState(key) {
    if (typeof window.sbGetControlToggle !== "function") return false;
    try { return !!window.sbGetControlToggle(key); } catch (err) { console.error("[settings] toggle read failed", err); return false; }
  }

  function setToggle(key, on) {
    if (typeof window.sbSetControlToggle !== "function") return;
    try { window.sbSetControlToggle(key, on); } catch (err) { console.error("[settings] toggle write failed", err); }
  }

  function rowMarkup(label, sub, control) {
    return '<div class="st-row">' +
      '<div class="st-row-text"><div class="st-row-label">' + label + "</div>" +
        (sub ? '<div class="st-row-sub">' + sub + "</div>" : "") + "</div>" +
      '<div class="st-row-control">' + control + "</div>" +
    "</div>";
  }

  function switchMarkup(key) {
    var on = toggleState(key);
    return '<button type="button" class="st-switch' + (on ? " on" : "") + '" role="switch" aria-checked="' + (on ? "true" : "false") + '" data-toggle="' + esc(key) + '"><i></i></button>';
  }

  /* ------------------------------------------------------------- sections */

  function currentLang() {
    if (typeof window.sbLang === "function") {
      try { return window.sbLang() || "en"; } catch (err) { console.error("[settings] lang read failed", err); }
    }
    return "en";
  }

  function generalMarkup() {
    var name = "guest";
    if (typeof window.sbGetUsername === "function") {
      try { name = window.sbGetUsername() || "guest"; } catch (err) { console.error("[settings] username read failed", err); }
    }
    var langNow = currentLang();
    var langs = [{ code: "en", label: "English" }, { code: "ru", label: "Русский" }, { code: "ee", label: "Eesti" }];
    var options = langs.map(function (l) {
      return '<option value="' + esc(l.code) + '"' + (l.code === langNow ? " selected" : "") + ">" + esc(l.label) + "</option>";
    }).join("");
    return '<h2 class="st-title">' + esc(t("set.tab.general")) + "</h2>" +
      rowMarkup(esc(t("set.general.identity")),
        esc(t("set.general.identitySub", { mail: appName("mail"), messenger: appName("messenger") })),
        '<span class="st-username"><input type="text" id="stUsername" maxlength="18" spellcheck="false" autocomplete="off" value="' + esc(name) + '">' +
          '<span class="st-suffix">.sys.baby</span><span class="st-saved" id="stUsernameSaved">' + esc(t("set.general.saved")) + "</span></span>") +
      rowMarkup(esc(t("set.general.language")), esc(t("set.general.languageSub")),
        '<select class="st-select" id="stLang">' + options + "</select>") +
      '<div class="st-note"><p>' + esc(t("set.general.note")) + "</p></div>";
  }

  /* ── РЯД КРАСОК СНЯТ ЦЕЛИКОМ (D-141) ───────────────────────────────────
     Основатель: «убрать accent color и сделать их частью wallpapers (они
     должны меняться в зависимости от выбранной темы)». Здесь стояли
     accentSwatches() и currentAccent() — две двери к отдельному выбору
     цвета. Дверей больше нет: цвет приходит от комнаты, и выбор комнаты
     ниже — единственный выбор цвета в системе. Читатели сняты вместе с
     рядом, иначе приложение продолжало бы звать из ядра то, чего там нет. */

  function controlSide() {
    if (typeof window.sbGetControlSide !== "function") return "left";
    try { return window.sbGetControlSide(); } catch (err) { console.error("[settings] side read failed", err); return "left"; }
  }

  function wallpaperMoods() {
    var moods = window.sbWallpaperMoods;
    return Array.isArray(moods) ? moods : [];
  }

  function currentMood() {
    if (typeof window.sbGetWallpaperMood !== "function") return "";
    try { return window.sbGetWallpaperMood() || ""; } catch (err) { console.error("[settings] mood read failed", err); return ""; }
  }

  function appearanceMarkup() {
    var theme = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    /* РЯДА КРАСОК ЗДЕСЬ БОЛЬШЕ НЕТ (D-141). Шов приходит от обоев: выбор
       комнаты и есть выбор цвета. Пока выборов было два, они могли встать в
       ссору — и вставали. */

    var moods = wallpaperMoods();
    var mood = currentMood();
    var moodChips = moods.map(function (m) {
      /* Имена настроений обоев уже переведены в ядре (ключи mood.*) — тот же
         список показывает Центр управления. Приложение берёт их оттуда, а не
         печатает английское m.name, иначе два места назвали бы одно разными
         словами. Выбор обоев теперь — единственный выбор цвета в системе:
         шов приходит отсюда же (D-141). */
      var moodName = t("mood." + m.id);
      if (moodName === "mood." + m.id) moodName = m.name || m.label || m.id;
      /* Суточное настроение помечено тем же знаком, что и суточная краска:
         дуга, обошедшая круг. Человек, однажды узнавший этот знак на шве,
         узнаёт его и здесь — и не читает второго пояснения. И оно светится
         цветом ТЕКУЩЕГО часа: среди пяти ровных чипов один живой. */
      var live = "";
      var read = m.session ? window.sbTherapyForTime : window.sbWallpaperForTime;
      if (m.drift && typeof read === "function") {
        try {
          var w = read();
          live = ' style="background:linear-gradient(135deg,' + esc(w.c1) + ',' + esc(w.c2) + ');border-color:transparent;color:#fff"';
        } catch (err) { console.error("[settings] mood preview failed", err); }
      }
      var mk = m.session ? " is-session" : (m.drift ? " is-drift" : "");
      return '<button type="button" class="st-chip' + (m.id === mood ? " active" : "") + mk + '" data-mood="' + esc(m.id) + '"' + live + ">" + esc(moodName) + "</button>";
    }).join("");

    var brightness = typeof window.sbGetBrightness === "function" ? window.sbGetBrightness() : 100;

    /* Светлая тема снята с интерфейса — снова.
       -----------------------------------------------------------------------
       Она уже была снята однажды: «Light mode is withdrawn from the interface
       for this release» — записано в apps-harness. Потом переключатель вернулся
       в настройки, а приложения так и остались написанными под тёмное поле.

       12.08 замер: **313 зашитых светлых цветов** в десяти таблицах стилей
       приложений, и только две из них вообще знают про data-theme="light".
       На снимке основателя это выглядело так: белый текст на белой панели.
       Ни одной строки не прочесть.

       Это не настройка оттенков. Светлой темы **нет** — есть токены ядра и
       ни одного переведённого приложения. Выбор между «выкатить половину» и
       «сказать правду» в этом проекте решён давно.

       Возврат — отдельной работой: перевод всех приложений на токены плюс
       закон, меряющий контраст в обеих темах на каждом экране. До тех пор
       строка ниже говорит, как есть. */
    return '<h2 class="st-title">' + esc(t("set.tab.appearance")) + "</h2>" +
      rowMarkup(esc(t("set.appearance.theme")), esc(t("set.appearance.themeSub")),
        '<span class="st-segment" data-theme-state="dark">' +
          '<button type="button" class="st-seg active" data-theme="dark">' + esc(t("set.appearance.themeDark")) + "</button>" +
        "</span>") +
      rowMarkup(esc(t("set.appearance.mood")),
        esc(t("set.appearance.moodSub")),
        '<span class="st-chips">' + (moodChips || '<span class="st-muted">' + esc(t("set.appearance.moodNone")) + "</span>") + "</span>") +
      rowMarkup(esc(t("set.appearance.brightness")), esc(t("set.appearance.brightnessSub")),
        '<input type="range" class="st-range" id="stBrightness" min="0" max="100" value="' + brightness + '" aria-label="' + esc(t("set.appearance.brightness")) + '">') +
      /* Сторона кнопок окон (D-153): основатель просил переключатель в панели
         управления, а паритет требует, чтобы всё, что умеет панель, умел и
         Pulse. Один и тот же выбор, две двери — но знание одно, на документе. */
      rowMarkup(esc(t("set.appearance.controls")), esc(t("set.appearance.controlsSub")),
        '<span class="st-segment">' +
          '<button type="button" class="st-seg' + (controlSide() === "left" ? " active" : "") + '" data-side="left">' + esc(t("cc.controls.left")) + "</button>" +
          '<button type="button" class="st-seg' + (controlSide() === "right" ? " active" : "") + '" data-side="right">' + esc(t("cc.controls.right")) + "</button>" +
        "</span>") +
      rowMarkup(esc(t("set.appearance.turbo")), esc(t("set.appearance.turboSub")), switchMarkup("motion")) +
      rowMarkup(esc(t("set.appearance.transparency")), esc(t("set.appearance.transparencySub")), switchMarkup("transparency"));
  }

  function soundMarkup() {
    var volume = typeof window.sbGetNotifVolume === "function"
      ? Math.round(window.sbGetNotifVolume() * 100)
      : 60;
    return '<h2 class="st-title">' + esc(t("set.tab.sound")) + "</h2>" +
      rowMarkup(esc(t("set.sound.system")), esc(t("set.sound.systemSub")), switchMarkup("sound")) +
      rowMarkup(esc(t("set.sound.volume")), esc(t("set.sound.volumeSub")),
        '<input type="range" class="st-range" id="stVolume" min="0" max="100" value="' + volume + '" aria-label="' + esc(t("set.sound.volume")) + '">') +
      rowMarkup(esc(t("set.sound.dnd")), esc(t("set.sound.dndSub")), switchMarkup("dnd"));
  }

  function desktopMarkup() {
    return '<h2 class="st-title">' + esc(t("set.tab.desktop")) + "</h2>" +
      rowMarkup(esc(t("set.desktop.autohide")), esc(t("set.desktop.autohideSub")), switchMarkup("autohide")) +
      rowMarkup(esc(t("set.desktop.tidy")), esc(t("set.desktop.tidySub")),
        '<button type="button" class="st-btn" id="stTidy">' + esc(t("set.desktop.tidyBtn")) + "</button>");
  }

  function profilesApi() { return window.sbProfiles || null; }

  function privacyMarkup() {
    var api = profilesApi();
    var record = null, list = [], currentProfileId = "local";
    if (api) {
      try {
        record = typeof api.currentRecord === "function" ? api.currentRecord() : null;
        list = typeof api.list === "function" ? (api.list() || []) : [];
        currentProfileId = typeof api.current === "function" ? api.current() : "local";
      } catch (err) { console.error("[settings] profiles read failed", err); }
    }
    var signedIn = record && record.email ? record.email : t("set.privacy.guest");

    var chips = list.map(function (p) {
      var isCurrent = p.id === currentProfileId;
      var canDelete = !isCurrent && p.id !== "local";
      return '<span class="st-profile' + (isCurrent ? " active" : "") + '">' +
        '<button type="button" class="st-profile-btn" data-profile="' + esc(p.id) + '" title="' + esc(p.email || p.name || p.id) + '">' + esc(p.name || p.id) + "</button>" +
        (canDelete ? '<button type="button" class="st-profile-x" data-profile-del="' + esc(p.id) + '" title="' + esc(t("set.privacy.profileDelete")) + '" aria-label="' + esc(t("set.privacy.profileDelete")) + '">✕</button>' : "") +
      "</span>";
    }).join("");

    /* Почта аккаунта — данные посетителя: data-sb-userdata говорит закону
       покрытия, что эту строку переводить нечем и не нужно. */
    return '<h2 class="st-title">' + esc(t("set.tab.privacy")) + "</h2>" +
      rowMarkup(esc(t("set.privacy.signedIn")), '<span data-sb-userdata>' + esc(signedIn) + "</span>",
        '<button type="button" class="st-btn danger" id="stSignOut">' + esc(t("set.privacy.signOut")) + "</button>") +
      rowMarkup(esc(t("set.privacy.profiles")),
        esc(t("set.privacy.profilesSub")),
        '<span class="st-profiles" data-sb-userdata>' + chips +
          '<button type="button" class="st-chip" id="stAddAccount">' + esc(t("set.privacy.addAccount")) + "</button></span>") +
      rowMarkup(esc(t("set.privacy.storage")), "", '<span class="st-value" id="stStorage">' + esc(t("set.storage.measuring")) + "</span>") +
      rowMarkup(esc(t("set.privacy.clear")), esc(t("set.privacy.clearSub")),
        '<button type="button" class="st-btn danger" id="stClearAll">' + esc(t("set.privacy.clearBtn")) + "</button>") +
      '<div class="st-card">' +
        "<h3>" + esc(t("set.privacy.leavesTitle")) + "</h3>" +
        "<p>" + esc(t("set.privacy.leavesBody")) + "</p>" +
      "</div>" +
      '<div class="st-card">' +
        "<h3>" + esc(t("set.privacy.backupTitle")) + "</h3>" +
        "<p>" + esc(t("set.privacy.backupBody")) + "</p>" +
        '<div class="st-actions">' +
          '<button type="button" class="st-btn" id="stExport">' + esc(t("set.privacy.export")) + "</button>" +
          '<button type="button" class="st-btn" id="stImport">' + esc(t("set.privacy.import")) + "</button>" +
          '<input type="file" id="stImportFile" accept="application/json,.json" hidden>' +
        "</div>" +
      "</div>" +
      '<div class="st-note"><p>' + esc(t("set.privacy.note")) + "</p></div>";
  }

  function advancedMarkup() {
    return '<h2 class="st-title">' + esc(t("set.tab.advanced")) + "</h2>" +
      rowMarkup(esc(t("set.advanced.diag")), esc(t("set.advanced.diagSub")),
        '<button type="button" class="st-btn" id="stDiag">' + esc(t("set.advanced.diagBtn")) + "</button>") +
      rowMarkup(esc(t("set.advanced.reset")), esc(t("set.advanced.resetSub")),
        '<button type="button" class="st-btn" id="stResetAppearance">' + esc(t("set.advanced.resetBtn")) + "</button>");
  }

  /* About tells the truth. It used to wear invented hardware — "Automation
     Core X1", "64 GB Focus", a fake serial — a costume borrowed from real
     operating systems. A studio whose whole pitch is honesty cannot keep a
     joke spec sheet one click away from its prices: every line below is
     either measured live or verifiable by reading the page source. */
  function aboutMarkup() {
    var build = "sys.baby OS";
    var registered = null, launchable = null;
    try {
      if (window.sbBuild && typeof window.sbBuild.stamp === "function") build = window.sbBuild.stamp();
      if (window.SysBaby && window.SysBaby.order) registered = window.SysBaby.order.length;
      if (typeof window.sbLaunchableApps === "function") launchable = window.sbLaunchableApps().length;
    } catch (err) { console.error("[settings] about read failed", err); }

    var keyCount = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("sysbaby.") === 0) keyCount++;
      }
    } catch (err) { /* storage blocked — shown as 0 */ }

    var rows = [
      [t("set.about.build"), esc(build)],
      [t("set.about.apps"), registered != null
        ? esc(t("set.about.appsValue", { registered: registered, launchable: launchable }))
        : esc(t("set.about.appsNA"))],
      [t("set.about.madeOf"), esc(t("set.about.madeOfValue"))],
      [t("set.about.runsOn"), esc(t("set.about.runsOnValue"))],
      [t("set.about.data"), esc(t("set.about.dataValue", { count: keyCount })) + " · <span id='stAboutStorage'>" + esc(t("set.storage.measuring")) + "</span>"],
      [t("set.about.network"), esc(t("set.about.networkValue"))],
      /* Языки называют себя на себе — это не перевод, а имена собственные. */
      [t("set.about.languages"), "English · Русский · Eesti"]
    ].map(function (pair) {
      return '<div class="st-spec"><span>' + esc(pair[0]) + "</span><span>" + pair[1] + "</span></div>";
    }).join("");

    /* Длинное имя системы стоит ЗДЕСЬ — там, куда приходят спросить «что это
       такое». Оно не набирается шрифтом и не копируется сюда контуром: берётся
       из единственного экземпляра в документе (<template id="sbWordmarkFull">).
       Второй экземпляр однажды разошёлся бы с первым молча. Если шаблона нет —
       остаётся прежний значок, приложение не падает. */
    var wordmark = "";
    try {
      var tpl = document.getElementById("sbWordmarkFull");
      if (tpl && tpl.content && tpl.content.firstElementChild) {
        wordmark = tpl.content.firstElementChild.outerHTML;
      }
    } catch (err) { console.error("[settings] wordmark read failed", err); }

    return '<h2 class="st-title">' + esc(t("set.tab.about")) + "</h2>" +
      '<div class="st-hero' + (wordmark ? " has-wordmark" : "") + '">' +
        (wordmark
          ? '<div class="st-hero-word" role="img" aria-label="sys.baby">' + wordmark + "</div>"
          : '<div class="st-hero-logo">' + ICON + "</div><div class=\"st-hero-name\">sys.baby</div>") +
        /* Строка сборки под знаком СНЯТА: ровно та же строка стоит первой же
           строкой таблицы ниже, в тридцати точках отсюда. Пока в шапке стояло
           слово «sys.baby», повтора не было; со знаком он стал очевиден.
           Дефект внесён этой же правкой и ею же убран. */
        (wordmark ? "" : '<div class="st-hero-version">' + esc(build) + "</div>") + "</div>" +
      '<div class="st-specs">' + rows + "</div>" +
      '<div class="st-card">' +
        "<h3>" + esc(t("set.about.whatTitle")) + "</h3>" +
        /* Текст «о системе» называл приложение портфолио. Оно снято (D-066):
             называем то, что есть, — build с разделом «Избранные проекты». */
        "<p>" + esc(t("set.about.whatBody", { portfolio: appName("build") })) + "</p>" +
      "</div>" +
      '<div class="st-card">' +
        "<h3>" + esc(t("set.about.whoTitle")) + "</h3>" +
        "<p>" + esc(t("set.about.whoBody")) + "</p>" +
      "</div>" +
      '<div class="st-note"><p>' + esc(t("set.about.note")) + "</p></div>";
  }

  var RENDERERS = {
    general: generalMarkup,
    appearance: appearanceMarkup,
    sound: soundMarkup,
    desktop: desktopMarkup,
    privacy: privacyMarkup,
    advanced: advancedMarkup,
    about: aboutMarkup
  };

  /* --------------------------------------------------------------- render */

  /* ── ПОЛОСА РАЗДЕЛОВ НЕ ТЕЛЕПОРТИРУЕТСЯ В НАЧАЛО (v58) ────────────────────
     ПОВОД, дословно от основателя 24.08.2026, со снимками: «в системе не
     должно быть таких "телепортов" - я нажимаю на кнопку about и меню улетает
     в начало».

     ЧТО ПРОИСХОДИЛО. На узком экране полоса разделов лежит горизонтально и
     прокручивается (.st-side, overflow-x: auto). Чтобы дотянуться до «About»,
     человек прокручивает её вправо до конца. Нажатие перерисовывает ВЕСЬ
     корпус окна через innerHTML — вместе с полосой. Новая полоса рождается
     непрокрученной, и она прыгает в начало прямо под пальцем: раздел открылся
     правильный, а кнопка, которую только что нажали, уехала за край.

     ПОЧЕМУ ПРОКРУТКА ЗАПОМИНАЕТСЯ, А НЕ ВЫЧИСЛЯЕТСЯ. Соблазн был «подвести
     полосу к активному разделу» — но это второй телепорт вместо первого:
     человек не просил везти его куда-либо, он просил ничего не трогать.
     Правильное поведение самое скромное: где стояло, там и осталось.

     ── ПЕРЕЕХАЛО В ОБОЛОЧКУ (v60) ────────────────────────────────────────
     Здесь это чинилось для одного приложения, и правило было записано
     словами в шапке закона. Слова не исполняются: «Письма» получили тот же
     телепорт, не нарушив ни строчки, и основатель прислал снимок со словами
     «больше нигде не должно быть телепортов». Теперь восстановление —
     средство оболочки sbKeepScroll (см. os/core/shell.js), одно на все
     приложения; здесь остался только его вызов. */
  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    if (!win._settingsSection || !RENDERERS[win._settingsSection]) win._settingsSection = "general";
    var section = win._settingsSection;

    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;

    host.innerHTML =
      '<div class="app-settings">' +
        '<aside class="st-side">' +
          SECTIONS.map(function (s) {
            return '<button type="button" class="st-side-item' + (s.id === section ? " active" : "") + '" data-section="' + esc(s.id) + '">' +
              '<span class="st-side-icon">' + s.icon + "</span><span>" + esc(t(s.labelKey)) + "</span></button>";
          }).join("") +
        "</aside>" +
        '<section class="st-pane">' + RENDERERS[section]() + "</section>" +
      "</div>";

    if (_sbKeep) _sbKeep();

    wire(win, host);
    if (section === "privacy") measureStorage(win, "#stStorage");
    if (section === "about") measureStorage(win, "#stAboutStorage");
  }

  /* --------------------------------------------------------------- wiring */

  function wire(win, host) {
    host.querySelectorAll("[data-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        win._settingsSection = btn.getAttribute("data-section");
        render(win);
      });
    });

    host.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-toggle");
        setToggle(key, !toggleState(key));
        render(win);
      });
    });

    wireGeneral(win, host);
    wireAppearance(win, host);
    wireSound(win, host);
    wireDesktop(win, host);
    wirePrivacy(win, host);
    wireAdvanced(win, host);
  }

  /* ------------------------------------------------------------ live sync
   * The other half of "one source of truth per setting": when ANY surface —
   * the Control Center, the terminal, another Pulse control — changes a
   * setting, an open Pulse window repaints its current section in the same
   * frame. Before this the values only agreed after a manual re-open, which
   * the founder correctly read as "syncs, but not in real time".
   * Sliders are skipped while the visitor is dragging them (they are the
   * source of that very event), and repaints collapse to one per frame. */
  var SECTION_KINDS = {
    general: { lang: 1 },
    appearance: { theme: 1, mood: 1, brightness: 1, toggle: 1, side: 1 },
    sound: { toggle: 1, volume: 1 },
    desktop: { toggle: 1 },
    privacy: {},
    advanced: {},
    about: {}
  };

  var syncScheduled = false;
  function liveSync(ev) {
    var kind = ev && ev.detail && ev.detail.kind;
    if (!kind) return;
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("settings") : null;
    if (!win || !bodyOf(win)) return;
    var section = win._settingsSection || "general";
    var relevant = SECTION_KINDS[section];
    if (!relevant || !relevant[kind]) return;

    /* A slider mid-drag re-rendering itself would fight the pointer. */
    var active = document.activeElement;
    if (active && bodyOf(win).contains(active) && (active.type === "range" || active.type === "color" || active.tagName === "INPUT")) {
      if (kind === "volume" || kind === "brightness") return;
    }

    if (syncScheduled) return;
    syncScheduled = true;
    requestAnimationFrame(function () {
      syncScheduled = false;
      var live = typeof window.getOpenWindow === "function" ? window.getOpenWindow("settings") : null;
      if (live && bodyOf(live)) render(live);
    });
  }
  document.addEventListener("sysbaby:setting-changed", liveSync);

  function wireGeneral(win, host) {
    var langSel = host.querySelector("#stLang");
    if (langSel) {
      langSel.addEventListener("change", function () {
        if (typeof window.sbSetLang !== "function") return;
        try { window.sbSetLang(langSel.value); }
        catch (err) { console.error("[settings] setLang failed", err); }
      });
    }

    var input = host.querySelector("#stUsername");
    if (!input) return;
    var savedTag = host.querySelector("#stUsernameSaved");
    var timer = null;

    function commit() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (typeof window.sbSetUsername !== "function") return;
      var applied;
      try { applied = window.sbSetUsername(input.value); }
      catch (err) { console.error("[settings] username write failed", err); return; }
      if (typeof applied !== "string" && typeof window.sbGetUsername === "function") {
        try { applied = window.sbGetUsername(); } catch (err) { console.error("[settings] username read failed", err); }
      }
      if (typeof applied === "string") input.value = applied;
      if (savedTag) {
        savedTag.classList.add("show");
        setTimeout(function () { savedTag.classList.remove("show"); }, 1400);
      }
    }

    input.addEventListener("input", function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(commit, 500);
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      commit();
      input.blur();
    });
    input.addEventListener("blur", commit);
  }

  function wireAppearance(win, host) {
    host.querySelectorAll("[data-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.setTheme !== "function") return;
        try { window.setTheme(btn.getAttribute("data-theme")); }
        catch (err) { console.error("[settings] setTheme failed", err); }
        render(win);
      });
    });

    host.querySelectorAll("[data-side]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.sbSetControlSide !== "function") return;
        try { window.sbSetControlSide(btn.getAttribute("data-side")); }
        catch (err) { console.error("[settings] side set failed", err); }
        render(win);
      });
    });

    host.querySelectorAll("[data-mood]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.sbSetWallpaperMood !== "function") return;
        try { window.sbSetWallpaperMood(btn.getAttribute("data-mood")); }
        catch (err) { console.error("[settings] setWallpaperMood failed", err); }
        render(win);
      });
    });

    var bright = host.querySelector("#stBrightness");
    if (bright) {
      bright.addEventListener("input", function () {
        if (typeof window.sbSetBrightness !== "function") return;
        try { window.sbSetBrightness(bright.value); }
        catch (err) { console.error("[settings] brightness failed", err); }
      });
    }
  }

  function wireSound(win, host) {
    var vol = host.querySelector("#stVolume");
    if (!vol) return;
    vol.addEventListener("input", function () {
      if (typeof window.sbSetNotifVolume !== "function") return;
      try { window.sbSetNotifVolume(Number(vol.value) / 100); }
      catch (err) { console.error("[settings] volume failed", err); }
    });
    vol.addEventListener("change", function () {
      if (window.SysBaby && typeof window.SysBaby.playNotifSound === "function") {
        try { window.SysBaby.playNotifSound(); } catch (err) { console.error("[settings] chime failed", err); }
      }
    });
  }

  function wireDesktop(win, host) {
    var tidy = host.querySelector("#stTidy");
    if (!tidy) return;
    tidy.addEventListener("click", function () {
      if (typeof window.sbTidyWidgets !== "function") return;
      try { window.sbTidyWidgets(); } catch (err) { console.error("[settings] tidy failed", err); }
      toast(t("set.desktop.tidyDoneTitle"), t("set.desktop.tidyDoneBody"));
    });
  }

  function wireAdvanced(win, host) {
    var diag = host.querySelector("#stDiag");
    if (diag) {
      diag.addEventListener("click", function () {
        var panels = window.sbPanels || {};
        var overlay = panels.sbDiagOverlay;
        if (!overlay || typeof overlay.open !== "function") return;
        try { overlay.open(); } catch (err) { console.error("[settings] diagnostics failed", err); }
      });
    }

    var reset = host.querySelector("#stResetAppearance");
    if (reset) {
      reset.addEventListener("click", function () {
        /* Сброс возвращает КОМНАТУ — вместе с ней возвращается и цвет
           (D-141): отдельного цвета, который можно было бы сбросить, в
           системе больше нет. */
        if (typeof window.sbSetWallpaperMood === "function") {
          try { window.sbSetWallpaperMood("studio"); } catch (err) { console.error("[settings] mood reset failed", err); }
        }
        toast(t("set.advanced.resetDoneTitle"), t("set.advanced.resetDoneBody"));
        render(win);
      });
    }
  }

  /* -------------------------------------------------------------- privacy */

  function wirePrivacy(win, host) {
    var signOut = host.querySelector("#stSignOut");
    if (signOut) {
      signOut.addEventListener("click", function () {
        if (!window.confirm(t("set.privacy.signOutConfirm"))) return;
        dbFlush();
        try { localStorage.removeItem(AUTHED_KEY); }
        catch (err) { console.error("[settings] sign-out failed", err); }
        location.reload();
      });
    }

    host.querySelectorAll("[data-profile]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var api = profilesApi();
        if (!api || typeof api.switchTo !== "function") return;
        try { api.switchTo(btn.getAttribute("data-profile")); }
        catch (err) { console.error("[settings] profile switch failed", err); }
      });
    });

    host.querySelectorAll("[data-profile-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var api = profilesApi();
        if (!api || typeof api.remove !== "function") return;
        var id = btn.getAttribute("data-profile-del");
        var name = btn.parentNode && btn.parentNode.querySelector("[data-profile]");
        var label = name ? name.textContent : id;
        if (!window.confirm(t("set.privacy.profileDeleteConfirm", { name: label }))) return;
        try { api.remove(id); } catch (err) { console.error("[settings] profile delete failed", err); return; }
        render(win);
      });
    });

    var add = host.querySelector("#stAddAccount");
    if (add) {
      add.addEventListener("click", function () {
        var api = profilesApi();
        if (!api || typeof api.findOrCreateByEmail !== "function") return;
        var email = window.prompt(t("set.privacy.addPrompt"));
        if (email == null) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
          toast(t("set.privacy.emailBadTitle"), t("set.privacy.emailBadBody"));
          return;
        }
        var profile;
        try { profile = api.findOrCreateByEmail(String(email).trim()); }
        catch (err) { console.error("[settings] profile create failed", err); return; }
        if (profile && profile.id && typeof api.switchTo === "function") {
          try { api.switchTo(profile.id); } catch (err) { console.error("[settings] profile switch failed", err); }
        }
      });
    }

    var clearAll = host.querySelector("#stClearAll");
    if (clearAll) {
      clearAll.addEventListener("click", function () {
        if (!window.confirm(t("set.privacy.clearConfirm"))) return;
        clearNamespace(localStorage);
        clearNamespace(typeof sessionStorage !== "undefined" ? sessionStorage : null);
        toast(t("set.privacy.clearedTitle"), t("set.privacy.clearedBody"));
      });
    }


    var exportBtn = host.querySelector("#stExport");
    if (exportBtn) exportBtn.addEventListener("click", exportProfile);

    var importBtn = host.querySelector("#stImport");
    var importFile = host.querySelector("#stImportFile");
    if (importBtn && importFile) {
      importBtn.addEventListener("click", function () { importFile.click(); });
      importFile.addEventListener("change", function () {
        var file = importFile.files && importFile.files[0];
        if (file) importProfile(file);
        importFile.value = "";
      });
    }
  }

  function clearNamespace(storage) {
    if (!storage) return;
    try {
      var doomed = [];
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (key && key.indexOf("sysbaby.") === 0) doomed.push(key);
      }
      doomed.forEach(function (key) { storage.removeItem(key); });
    } catch (err) {
      console.error("[settings] clear failed", err);
      toast(t("set.privacy.clearFailTitle"), t("set.privacy.clearFailBody"));
    }
  }

  function measureStorage(win, selector) {
    var sel = selector || "#stStorage";
    var host = bodyOf(win);
    var el = host && host.querySelector(sel);
    if (!el) return;
    if (!navigator.storage || typeof navigator.storage.estimate !== "function") {
      el.textContent = t("set.storage.notExposed");
      return;
    }
    navigator.storage.estimate().then(function (estimate) {
      var live = bodyOf(win) && bodyOf(win).querySelector(sel);
      if (!live) return;
      var used = formatBytes(estimate && estimate.usage);
      if (estimate && estimate.quota) live.textContent = t("set.storage.of", { used: used, total: formatBytes(estimate.quota) });
      else live.textContent = used;
    }).catch(function (err) {
      console.error("[settings] storage estimate failed", err);
      var live = bodyOf(win) && bodyOf(win).querySelector(sel);
      if (live) live.textContent = t("set.storage.unavailable");
    });
  }

  function formatBytes(value) {
    var n = Number(value) || 0;
    if (n >= 1048576) return Math.round(n / 1048576) + " " + t("set.unit.mb");
    return Math.round(n / 1024) + " " + t("set.unit.kb");
  }

  /* ------------------------------------------------------- export/import */

  function activeProfileId() {
    if (window.sbDB && typeof window.sbDB.activeProfile === "function") {
      try { return window.sbDB.activeProfile() || "local"; } catch (err) { console.error("[settings] activeProfile failed", err); }
    }
    try { return localStorage.getItem("sysbaby.activeProfile") || "local"; }
    catch (err) { console.error("[settings] activeProfile read failed", err); return "local"; }
  }

  var EXPORT_DENY = [
    "sysbaby.activeProfile",
    "sysbaby.profiles.v1",
    "sysbaby.authed",
    "sysbaby.sync.url",
    "sysbaby.incognito.pwhash",
    "sysbaby.incognito.timerPref"
  ];

  function isDenied(key) {
    if (EXPORT_DENY.indexOf(key) !== -1) return true;
    if (key.indexOf("sysbaby.sync.token::") === 0) return true;
    if (key.indexOf("sysbaby.incognito::") === 0) return true;
    if (key.indexOf("sysbaby.i18n.cache.") === 0) return true;   // regenerable, potentially large
    return false;
  }

  /* The canonical "what constitutes a profile" enumerator (os-shell.md 1.4). */
  function profileKeys(profileId) {
    var out = {};
    var prefix = profileId === "local" ? null : "sysbaby.profile." + profileId + ".";
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        if (prefix) {
          if (key.indexOf(prefix) !== 0) continue;
          out[key.slice(prefix.length)] = localStorage.getItem(key);
        } else {
          if (key.indexOf("sysbaby.") !== 0) continue;
          if (key.indexOf("sysbaby.profile.") === 0) continue;
          out[key] = localStorage.getItem(key);
        }
      }
    } catch (err) {
      console.error("[settings] key enumeration failed", err);
    }
    return out;
  }

  function exportProfile() {
    /* The shell owns export/import (os-shell.md §1.5). sbExportProfile() only
     * BUILDS the envelope; sbDownloadExport() is the one that writes the file.
     * Use it when present and fall back to the local writer otherwise. */
    if (typeof window.sbDownloadExport === "function") {
      var res = null;
      try { res = window.sbDownloadExport(); }
      catch (err) { console.error("[settings] shell export failed — using local envelope", err); }
      if (res && res.ok) {
        toast(t("set.export.readyTitle"), t("set.export.readyBody", { count: res.count }));
        return;
      }
      if (res && res.error) {
        toast(t("set.export.failTitle"), res.error);
        return;
      }
    }

    dbFlush();
    var id = activeProfileId();
    var api = profilesApi();
    var record = null;
    if (api && typeof api.currentRecord === "function") {
      try { record = api.currentRecord(); } catch (err) { console.error("[settings] profile record failed", err); }
    }

    var all = profileKeys(id);
    var keys = {};
    Object.keys(all).forEach(function (key) { if (!isDenied(key)) keys[key] = all[key]; });

    var envelope = {
      app: EXPORT_APP,
      version: EXPORT_VERSION,
      createdAt: new Date().toISOString(),
      /* Имя внутри файла экспорта — это данные, а не интерфейс: файл
         переживёт смену языка, поэтому здесь всегда одна форма. */
      profile: { id: id, name: (record && record.name) || "This computer", email: (record && record.email) || null },
      keys: keys
    };

    try {
      var blob = new Blob([JSON.stringify(envelope, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      var stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = "sysbaby-profile-" + String(envelope.profile.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-" + stamp + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast(t("set.export.readyTitle"), t("set.export.readyBody", { count: Object.keys(keys).length }));
    } catch (err) {
      console.error("[settings] export failed", err);
      toast(t("set.export.failTitle"), t("set.export.failBody"));
    }
  }

  function importProfile(file) {
    var reader = new FileReader();
    reader.onerror = function () {
      console.error("[settings] import read failed", reader.error);
      toast(t("set.import.failTitle"), t("set.import.unreadable"));
    };
    reader.onload = function () {
      var envelope;
      try { envelope = JSON.parse(String(reader.result)); }
      catch (err) {
        console.error("[settings] import parse failed", err);
        toast(t("set.import.failTitle"), t("set.import.notBackup"));
        return;
      }
      if (!envelope || envelope.app !== EXPORT_APP || !envelope.keys || typeof envelope.keys !== "object") {
        toast(t("set.import.failTitle"), t("set.import.notBackup"));
        return;
      }
      if (Number(envelope.version) > EXPORT_VERSION) {
        toast(t("set.import.failTitle"), t("set.import.newer"));
        return;
      }
      if (!window.confirm(t("set.import.confirm"))) return;

      /* Shell signature is sbImportProfile(textOrObject, {mode, profileId?, reload?})
       * — an options object, not a bare mode string (os-shell.md §1.5). */
      if (typeof window.sbImportProfile === "function") {
        var res = null;
        try { res = window.sbImportProfile(envelope, { mode: "replace" }); }
        catch (err) { console.error("[settings] shell import failed — using local writer", err); }
        if (res && res.ok) return;                    /* the shell reloads for us */
        if (res && res.error) { toast(t("set.import.failTitle"), res.error); return; }
      }

      var id = activeProfileId();
      var prefix = id === "local" ? "" : "sysbaby.profile." + id + ".";
      try {
        Object.keys(profileKeys(id)).forEach(function (key) { localStorage.removeItem(prefix + key); });
        Object.keys(envelope.keys).forEach(function (key) {
          if (isDenied(key)) return;
          localStorage.setItem(prefix + key, String(envelope.keys[key]));
        });
      } catch (err) {
        console.error("[settings] import write failed", err);
        toast(t("set.import.failTitle"), t("set.save.failBody"));
        return;
      }
      location.reload();
    };
    reader.readAsText(file);
  }

  /* ------------------------------------------------------- registration */

  if (typeof window.registerApp === "function") {
    window.registerApp("settings", {
      title: "Pulse",
      i18n: {
        ru: { title: "Настройки", label: "Настройки" },
        ee: { title: "Seaded", label: "Seaded" },
      },
      label: "Pulse",
      color: "linear-gradient(160deg,#a6aab3 0%,#70737d 48%,#3a3c44 100%)",
      icon: ICON,
      size: { w: 620, h: 520 },
      deskPos: { x: 240, y: 40 },
      /* Окно перерисовывается при смене языка. Единственное поле ввода —
         имя пользователя — читается из хранилища, так что перерисовка
         ничего не теряет: то, что не сохранено, тут и не существует. */
      retranslate: true,
      render: render
    });
  }
})();
