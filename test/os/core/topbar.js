/* sys.baby OS — core/topbar.js
 * Topbar (identity, bell, app sequence, tips, clock, battery,
 * connectivity), Control Center (all shell settings), Session Timer,
 * and the i18n mechanism (authored en/ru/ee chrome table). */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function readJSON(k, f) { return window.sbReadJSON ? window.sbReadJSON(k, f) : f; }
  function writeJSON(k, v) { if (window.sbWriteJSON) window.sbWriteJSON(k, v); }
  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function reduced() { return root.getAttribute("data-motion") === "reduced"; }

  /* ============================================================ i18n (§9) */
  /* Option (b): the selector offers the three languages whose strings are
     authored (en/ru/ee) and translates the chrome from this bundled table.
     Authored voice lines (terminal) are never machine-translated. */
  var STRINGS = {
    en: {
      "dock.hint": "⌘K to open an app",
      "cc.title": "Control Center",
      "cc.sound": "Sound", "cc.dnd": "Do Not Disturb", "cc.autohide": "Dock Auto-Hide",
      "cc.motion": "Turbo", "cc.transparency": "Reduce transparency",
      "cc.volume": "Volume", "cc.brightness": "Brightness", "cc.language": "Language",
      "cc.wallpaper": "Wallpaper", "cc.accent": "Accent color", "cc.appearance": "Appearance",
      "cc.shortcuts": "Keyboard Shortcuts", "cc.layouts": "Workspace Layouts",
      "cc.desktop": "Manage Desktop", "cc.health": "Health", "cc.incognito": "Incognito Desktop",
      "cc.exit": "Exit Incognito", "cc.signout": "Sign out, softly",
      "cc.export": "Export profile", "cc.import": "Import profile…",
      "panel.shortcuts": "Keyboard shortcuts", "panel.notifications": "Notifications",
      "panel.windows": "Windows", "panel.clipboard": "Clipboard history",
      "panel.health": "System health", "panel.layouts": "Workspace layouts",
      "panel.desktop": "Manage desktop",
      "timer.title": "Session timer", "timer.arm": "Arm timer",
      "timer.windows": "Close open windows", "timer.notes": "Clear notes",
      /* Tips. {files} / {mail} / {echoes} are filled from the live app names,
         so a tip never says "Files" while the icon underneath says "Vault". */
      "tip.portfolio": "Both client systems in {portfolio} are real — and one of them opens right here.",
      "tip.inlinesearch": "Hover any icon, then its little spark — every app has a quick action hiding there.",
      "tip.cmdk": "Press ⌘K anywhere to jump straight to any app.",
      "tip.stickynotes": "Tap empty desktop, then the + — leave a note right there.",
      "tip.windowspanel": "Press W to see every open window and reopen recently closed ones.",
      "tip.appshortcuts": "⌃E opens {files}, ⌃I opens {mail} — every app has one.",
      "tip.shortcutslist": "Press ? anytime to see every keyboard shortcut.",
      "tip.snap": "Drag a window to the screen edge to snap it.",
      "tip.iconhide": "Right-click any icon to take it off the desktop.",
      "tip.privacy": "Everything here stays local — nothing leaves this session.",
      "tip.clip": "Every copy inside sys.baby is saved to Clipboard History.",
      "tip.diag": "Control Center → Health shows real FPS, memory and any errors this session.",
      "tip.echoes": "Deleted a note by mistake? Open {echoes} — nothing's gone until you say so.",
      "tip.layouts": "Save your window arrangement as a named layout.",
      "tips.doneTitle": "All tips learned",
      "tips.doneBody": "You've seen everything this desktop can teach.",
      "tips.dismiss": "Dismiss",
      /* --- desktop, menus and notes (§14) --- */
      "menu.open": "Open {app}",
      "menu.newNote": "New note",
      "menu.tidyWidgets": "Tidy widgets",
      "menu.saveWidgets": "Save widget layout as…",
      "menu.restoreLayout": "Restore “{name}”",
      "menu.clipboard": "Clipboard history",
      "menu.switchWindows": "Switch windows",
      "menu.shortcuts": "Keyboard shortcuts",
      "menu.resetPosition": "Reset position",
      "menu.hideWidget": "Hide this widget",
      "menu.toggleTheme": "Toggle theme",
      "menu.removeIcon": "Remove from Desktop",
      "menu.manageDesktop": "Manage desktop",
      "menu.nameLayout": "Name this widget layout",
      "note.delete": "Delete note",
      "note.placeholder": "Write something…",
      "note.aria": "Note",
      "note.invite": "Leave a note here?",
      "note.inviteAria": "Leave a note here",
      "widget.quote": "Quote",
      "widget.payback": "Payback",
      "widget.capture": "Quick Capture",
      "capture.placeholder": "Capture a thought… ⏎",
      "capture.aria": "Capture a thought",
      /* --- toasts --- */
      "toast.tidied": "Widgets tidied", "toast.tidiedBody": "Back to the default grid.",
      "toast.layoutSaved": "Layout saved", "toast.layoutSavedBody": "“{name}” is in the desktop menu.",
      "toast.layoutRestored": "Layout restored", "toast.layoutRestoredBody": "Your widgets are back where you left them.",
      "toast.captured": "Captured", "toast.capturedBody": "Saved straight to {app}.",
      "toast.toEchoes": "Moved to {app}",
      "toast.toEchoesNote": "Nothing’s gone until you say so.",
      "toast.toEchoesIcon": "It’s waiting there — restore it anytime.",
      "toast.restored": "Restored", "toast.restoredBody": "The note is back where it was.",
      "toast.closed": "{app} closed", "toast.closedBody": "Click Undo to bring it back as it was.",
      "toast.undo": "Undo",
      "toast.noSave": "Couldn’t save", "toast.noSaveBody": "Storage may be full or restricted in this browser.",
      "toast.noSaveNote": "Couldn’t save note",
      "toast.copied": "Copied", "toast.copiedBody": "Diagnostics are on your clipboard.",
      "toast.nothingToSave": "Nothing to save", "toast.nothingToSaveBody": "Open a window or two first.",
      "toast.layoutSavedN": "{n} windows remembered.",
      "toast.layoutBack": "“{name}” is back on screen.",
      /* --- windows --- */
      "win.close": "Close window", "win.minimize": "Minimize window", "win.maximize": "Maximize window",
      "win.failed": "{app} did not load. Reloading the page usually fixes it.",
      "win.openApp": "Open {app}", "win.quickAction": "Quick action for {app}",
      "win.noneOpen": "No open windows.",
      /* --- panels --- */
      "time.now": "Just now", "time.m": "{n}m ago", "time.h": "{n}h ago", "time.d": "{n}d ago", "time.w": "{n}w ago",
      "sc.quickActions": "Quick actions", "sc.closeTop": "Close what’s on top", "sc.thisPanel": "This panel",
      "sc.openWindows": "Open windows", "sc.expose": "Exposé — every window at once",
      "sc.terminal": "Terminal history", "sc.note": "Leave a note on the desktop", "sc.deskMenu": "Desktop menu",
      "sc.system": "System", "sc.openAnApp": "Open an app",
      "p.noNotifications": "No notifications yet", "p.dismiss": "Dismiss", "p.clearAll": "Clear all",
      "p.openNow": "Open now", "p.focus": "Focus", "p.close": "Close", "p.noWindows": "No open windows",
      "p.closedAgo": "closed {when}", "p.reopen": "Reopen", "p.open": "Open", "p.recentlyClosed": "Recently closed",
      "p.nothingCopied": "Nothing copied yet", "p.copiedInside": "Copied inside sys.baby only",
      "p.windowsCount": "{n} windows · ", "p.restore": "Restore", "p.delete": "Delete",
      "p.noLayouts": "No saved layouts yet", "p.layoutsNote": "Saves window positions, not their content",
      "p.saveCurrent": "Save current", "p.layoutName": "Layout {n}",
      "p.appIcons": "App icons", "p.removedFromDesktop": "Removed from desktop", "p.onDesktop": "On desktop",
      "p.add": "Add", "p.remove": "Remove", "p.keepsSpot": "Removed items keep their spot for next time",
      "h.frameRate": "Frame rate", "h.heap": "JS heap", "h.storage": "Storage", "h.openWindows": "Open windows",
      "h.cssFullscreen": "CSS fullscreen", "h.browserFullscreen": "Browser fullscreen",
      "h.viewport": "Viewport", "h.screen": "Screen", "h.errors": "Errors this session", "h.userAgent": "User agent",
      "h.sampling": "sampling…", "h.measuring": "measuring…", "h.notExposed": "not exposed by this browser",
      "h.yes": "yes", "h.no": "no", "h.recentErrors": "Recent errors", "h.none": "None",
      "h.measured": "Live, measured — not estimated", "h.copyReport": "Copy report", "h.of": " of ",
      /* --- command palette --- */
      "k.switchTo": "Switch to {mode} mode", "k.toggleAppearance": "Toggle appearance",
      "k.light": "Light", "k.dark": "Dark", "k.panel": "Panel",
      "k.searchFor": "Search for “{q}”", "k.everything": "Everything about this",
      "k.empty": "No matching commands",
      "k.shortcuts": "Keyboard shortcuts", "k.windows": "Open windows", "k.clipboard": "Clipboard history",
      "k.layouts": "Workspace layouts", "k.manageDesktop": "Manage desktop", "k.health": "System health",
      /* --- chrome labels reached through data-i18n-aria / -ph (§14) --- */
      "aria.identity": "Click to set your username",
      "aria.notifications": "Notifications", "aria.appSeq": "Open windows",
      "aria.tip": "Show a tip", "aria.cc": "Control Center",
      "aria.icons": "Desktop icons", "aria.notes": "Desktop notes",
      "aria.dock": "Dock", "aria.dockCta": "Start your project",
      "aria.fab": "Quick actions", "aria.cmdk": "Command palette", "aria.close": "Close",
      "cmdk.placeholder": "Search apps and actions…",
      "cc.connection": "Connection", "cc.online": "Online", "cc.offline": "Offline",
      "cc.offlineLong": "Offline — no network connection",
      "cc.battery": "Battery", "cc.batteryNA": "Battery status unavailable",
      "cc.charging": "Charging", "cc.onBattery": "On battery",
      "cc.merge": "Merge instead of replace",
      "theme.dark": "Dark", "theme.light": "Light",
      "mood.studio": "Studio", "mood.aurora": "Aurora", "mood.sunset": "Sunset", "mood.ocean": "Ocean", "mood.mono": "Mono",
      "dock.cta": "Start your project"
    },
    ru: {
      "dock.hint": "⌘K — открыть приложение",
      "cc.title": "Центр управления",
      "cc.sound": "Звук", "cc.dnd": "Не беспокоить", "cc.autohide": "Скрывать док",
      "cc.motion": "Турбо", "cc.transparency": "Меньше прозрачности",
      "cc.volume": "Громкость", "cc.brightness": "Яркость", "cc.language": "Язык",
      "cc.wallpaper": "Обои", "cc.accent": "Акцент", "cc.appearance": "Оформление",
      "cc.shortcuts": "Горячие клавиши", "cc.layouts": "Раскладки окон",
      "cc.desktop": "Рабочий стол", "cc.health": "Диагностика", "cc.incognito": "Скрытый рабочий стол",
      "cc.exit": "Выйти из инкогнито", "cc.signout": "Выйти, тихо",
      "cc.export": "Экспорт профиля", "cc.import": "Импорт профиля…",
      "panel.shortcuts": "Горячие клавиши", "panel.notifications": "Уведомления",
      "panel.windows": "Окна", "panel.clipboard": "История копирования",
      "panel.health": "Состояние системы", "panel.layouts": "Раскладки окон",
      "panel.desktop": "Рабочий стол",
      "timer.title": "Таймер сессии", "timer.arm": "Включить таймер",
      "timer.windows": "Закрыть окна", "timer.notes": "Очистить заметки",
      "tip.portfolio": "Обе клиентские системы в {portfolio} настоящие — и одна из них открывается прямо здесь.",
      "tip.inlinesearch": "Наведите на иконку, затем на искру рядом — в каждом приложении спрятано быстрое действие.",
      "tip.cmdk": "Нажмите ⌘K где угодно, чтобы сразу открыть любое приложение.",
      "tip.stickynotes": "Нажмите на пустой рабочий стол, затем на + — заметка останется прямо там.",
      "tip.windowspanel": "Нажмите W, чтобы увидеть все открытые окна и вернуть недавно закрытые.",
      "tip.appshortcuts": "⌃E открывает {files}, ⌃I открывает {mail} — своя есть у каждого приложения.",
      "tip.shortcutslist": "Нажмите ? в любой момент, чтобы увидеть все горячие клавиши.",
      "tip.snap": "Перетащите окно к краю экрана, чтобы прикрепить его.",
      "tip.iconhide": "Правый клик по иконке убирает её с рабочего стола.",
      "tip.privacy": "Всё остаётся здесь — ничего не покидает эту сессию.",
      "tip.clip": "Каждое копирование внутри sys.baby попадает в историю буфера обмена.",
      "tip.diag": "Центр управления → Диагностика показывает реальный FPS, память и все ошибки сессии.",
      "tip.echoes": "Удалили заметку случайно? Откройте {echoes} — ничто не исчезает, пока вы сами не скажете.",
      "tip.layouts": "Сохраните расположение окон как именованную раскладку.",
      "tips.doneTitle": "Все подсказки пройдены",
      "tips.doneBody": "Вы увидели всё, чему этот рабочий стол может научить.",
      "tips.dismiss": "Скрыть",
      "menu.open": "Открыть {app}",
      "menu.newNote": "Новая заметка",
      "menu.tidyWidgets": "Выровнять виджеты",
      "menu.saveWidgets": "Сохранить раскладку виджетов…",
      "menu.restoreLayout": "Восстановить «{name}»",
      "menu.clipboard": "История копирования",
      "menu.switchWindows": "Переключить окна",
      "menu.shortcuts": "Горячие клавиши",
      "menu.resetPosition": "Вернуть на место",
      "menu.hideWidget": "Скрыть виджет",
      "menu.toggleTheme": "Сменить оформление",
      "menu.removeIcon": "Убрать с рабочего стола",
      "menu.manageDesktop": "Настроить рабочий стол",
      "menu.nameLayout": "Название раскладки виджетов",
      "note.delete": "Удалить заметку",
      "note.placeholder": "Напишите что-нибудь…",
      "note.aria": "Заметка",
      "note.invite": "Оставить заметку здесь?",
      "note.inviteAria": "Оставить заметку здесь",
      "widget.quote": "Смета",
      "widget.payback": "Окупаемость",
      "widget.capture": "Быстрая запись",
      "capture.placeholder": "Запишите мысль… ⏎",
      "capture.aria": "Записать мысль",
      "toast.tidied": "Виджеты выровнены", "toast.tidiedBody": "Вернулись к обычной сетке.",
      "toast.layoutSaved": "Раскладка сохранена", "toast.layoutSavedBody": "«{name}» — в меню рабочего стола.",
      "toast.layoutRestored": "Раскладка восстановлена", "toast.layoutRestoredBody": "Виджеты там, где вы их оставили.",
      "toast.captured": "Записано", "toast.capturedBody": "Сразу в {app}.",
      "toast.toEchoes": "Перемещено в {app}",
      "toast.toEchoesNote": "Ничто не исчезает, пока вы сами не скажете.",
      "toast.toEchoesIcon": "Оно там и ждёт — вернуть можно в любой момент.",
      "toast.restored": "Восстановлено", "toast.restoredBody": "Заметка вернулась на место.",
      "toast.closed": "{app} закрыто", "toast.closedBody": "Нажмите «Отменить», чтобы вернуть как было.",
      "toast.undo": "Отменить",
      "toast.noSave": "Не удалось сохранить", "toast.noSaveBody": "Хранилище переполнено или ограничено в этом браузере.",
      "toast.noSaveNote": "Не удалось сохранить заметку",
      "toast.copied": "Скопировано", "toast.copiedBody": "Диагностика в буфере обмена.",
      "toast.nothingToSave": "Нечего сохранять", "toast.nothingToSaveBody": "Откройте сначала пару окон.",
      "toast.layoutSavedN": "Запомнено окон: {n}.",
      "toast.layoutBack": "«{name}» снова на экране.",
      "win.close": "Закрыть окно", "win.minimize": "Свернуть окно", "win.maximize": "Развернуть окно",
      "win.failed": "{app} не загрузилось. Обычно помогает перезагрузка страницы.",
      "win.openApp": "Открыть {app}", "win.quickAction": "Быстрое действие: {app}",
      "win.noneOpen": "Нет открытых окон.",
      "time.now": "Только что", "time.m": "{n} мин назад", "time.h": "{n} ч назад", "time.d": "{n} дн назад", "time.w": "{n} нед назад",
      "sc.quickActions": "Быстрые действия", "sc.closeTop": "Закрыть верхнее", "sc.thisPanel": "Эта панель",
      "sc.openWindows": "Открытые окна", "sc.expose": "Экспозе — все окна разом",
      "sc.terminal": "История терминала", "sc.note": "Оставить заметку на столе", "sc.deskMenu": "Меню рабочего стола",
      "sc.system": "Система", "sc.openAnApp": "Открыть приложение",
      "p.noNotifications": "Уведомлений пока нет", "p.dismiss": "Скрыть", "p.clearAll": "Очистить всё",
      "p.openNow": "Открыто сейчас", "p.focus": "Перейти", "p.close": "Закрыть", "p.noWindows": "Нет открытых окон",
      "p.closedAgo": "закрыто {when}", "p.reopen": "Открыть снова", "p.open": "Открыто", "p.recentlyClosed": "Недавно закрытые",
      "p.nothingCopied": "Пока ничего не скопировано", "p.copiedInside": "Только копирование внутри sys.baby",
      "p.windowsCount": "окон: {n} · ", "p.restore": "Восстановить", "p.delete": "Удалить",
      "p.noLayouts": "Сохранённых раскладок пока нет", "p.layoutsNote": "Сохраняет положение окон, а не их содержимое",
      "p.saveCurrent": "Сохранить текущую", "p.layoutName": "Раскладка {n}",
      "p.appIcons": "Значки приложений", "p.removedFromDesktop": "Убрано со стола", "p.onDesktop": "На столе",
      "p.add": "Добавить", "p.remove": "Убрать", "p.keepsSpot": "Убранные сохраняют своё место на будущее",
      "h.frameRate": "Частота кадров", "h.heap": "Память JS", "h.storage": "Хранилище", "h.openWindows": "Открытые окна",
      "h.cssFullscreen": "Полный экран CSS", "h.browserFullscreen": "Полный экран браузера",
      "h.viewport": "Область просмотра", "h.screen": "Экран", "h.errors": "Ошибок за сессию", "h.userAgent": "Браузер",
      "h.sampling": "измеряем…", "h.measuring": "считаем…", "h.notExposed": "браузер не сообщает",
      "h.yes": "да", "h.no": "нет", "h.recentErrors": "Последние ошибки", "h.none": "Нет",
      "h.measured": "Вживую, измерено — не оценка", "h.copyReport": "Скопировать отчёт", "h.of": " из ",
      "k.switchTo": "Переключить на {mode} оформление", "k.toggleAppearance": "Сменить оформление",
      "k.light": "светлое", "k.dark": "тёмное", "k.panel": "Панель",
      "k.searchFor": "Искать «{q}»", "k.everything": "Всё об этом",
      "k.empty": "Совпадений не найдено",
      "k.shortcuts": "Горячие клавиши", "k.windows": "Открытые окна", "k.clipboard": "История копирования",
      "k.layouts": "Раскладки окон", "k.manageDesktop": "Настроить рабочий стол", "k.health": "Состояние системы",
      "aria.identity": "Нажмите, чтобы задать имя пользователя",
      "aria.notifications": "Уведомления", "aria.appSeq": "Открытые окна",
      "aria.tip": "Показать подсказку", "aria.cc": "Центр управления",
      "aria.icons": "Значки рабочего стола", "aria.notes": "Заметки на столе",
      "aria.dock": "Док", "aria.dockCta": "Начать проект",
      "aria.fab": "Быстрые действия", "aria.cmdk": "Командная палитра", "aria.close": "Закрыть",
      "cmdk.placeholder": "Поиск приложений и действий…",
      "cc.connection": "Соединение", "cc.online": "В сети", "cc.offline": "Не в сети",
      "cc.offlineLong": "Не в сети — нет подключения",
      "cc.battery": "Батарея", "cc.batteryNA": "Состояние батареи недоступно",
      "cc.charging": "Зарядка", "cc.onBattery": "От батареи",
      "cc.merge": "Объединить, а не заменить",
      "theme.dark": "Тёмное", "theme.light": "Светлое",
      "mood.studio": "Студия", "mood.aurora": "Аврора", "mood.sunset": "Закат", "mood.ocean": "Океан", "mood.mono": "Моно",
      "dock.cta": "Начать проект"
    },
    ee: {
      "dock.hint": "⌘K avab rakenduse",
      "cc.title": "Juhtimiskeskus",
      "cc.sound": "Heli", "cc.dnd": "Mitte segada", "cc.autohide": "Peida dokk",
      "cc.motion": "Turbo", "cc.transparency": "Vähem läbipaistvust",
      "cc.volume": "Helitugevus", "cc.brightness": "Heledus", "cc.language": "Keel",
      "cc.wallpaper": "Taust", "cc.accent": "Aktsentvärv", "cc.appearance": "Välimus",
      "cc.shortcuts": "Klaviatuuri otseteed", "cc.layouts": "Akende paigutused",
      "cc.desktop": "Töölaua haldus", "cc.health": "Seisund", "cc.incognito": "Peidetud töölaud",
      "cc.exit": "Välju inkognitost", "cc.signout": "Logi välja, vaikselt",
      "cc.export": "Ekspordi profiil", "cc.import": "Impordi profiil…",
      "panel.shortcuts": "Klaviatuuri otseteed", "panel.notifications": "Teated",
      "panel.windows": "Aknad", "panel.clipboard": "Kopeerimisajalugu",
      "panel.health": "Süsteemi seisund", "panel.layouts": "Akende paigutused",
      "panel.desktop": "Töölaua haldus",
      "timer.title": "Sessiooni taimer", "timer.arm": "Käivita taimer",
      "timer.windows": "Sulge aknad", "timer.notes": "Kustuta märkmed",
      "tip.portfolio": "Mõlemad kliendisüsteemid rakenduses {portfolio} on päris — ja üks neist avaneb siinsamas.",
      "tip.inlinesearch": "Vii kursor ikoonile ja siis selle sädemele — igas rakenduses peitub kiirtoiming.",
      "tip.cmdk": "Vajuta kõikjal ⌘K, et hüpata otse mis tahes rakendusse.",
      "tip.stickynotes": "Puuduta tühja töölauda, siis + — märge jääb täpselt sinna.",
      "tip.windowspanel": "Vajuta W, et näha kõiki avatud aknaid ja taasavada hiljuti suletud.",
      "tip.appshortcuts": "⌃E avab {files}, ⌃I avab {mail} — igal rakendusel on oma.",
      "tip.shortcutslist": "Vajuta ? millal tahes, et näha kõiki klaviatuuri otseteid.",
      "tip.snap": "Lohista aken ekraani serva, et see kohale kinnitada.",
      "tip.iconhide": "Parem klõps ikoonil eemaldab selle töölaualt.",
      "tip.privacy": "Kõik jääb siia — miski ei lahku sellest seansist.",
      "tip.clip": "Iga kopeerimine sys.baby sees salvestub lõikelaua ajalukku.",
      "tip.diag": "Juhtimiskeskus → Seisund näitab tegelikku FPS-i, mälu ja kõiki seansi vigu.",
      "tip.echoes": "Kustutasid märkme kogemata? Ava {echoes} — miski ei kao enne, kui sa nii ütled.",
      "tip.layouts": "Salvesta akende paigutus nimelise paigutusena.",
      "tips.doneTitle": "Kõik vihjed läbitud",
      "tips.doneBody": "Oled näinud kõike, mida see töölaud õpetada oskab.",
      "tips.dismiss": "Peida",
      "menu.open": "Ava {app}",
      "menu.newNote": "Uus märge",
      "menu.tidyWidgets": "Korrasta vidinad",
      "menu.saveWidgets": "Salvesta vidinate paigutus…",
      "menu.restoreLayout": "Taasta „{name}“",
      "menu.clipboard": "Kopeerimisajalugu",
      "menu.switchWindows": "Vaheta akent",
      "menu.shortcuts": "Klaviatuuri otseteed",
      "menu.resetPosition": "Taasta asukoht",
      "menu.hideWidget": "Peida see vidin",
      "menu.toggleTheme": "Vaheta välimust",
      "menu.removeIcon": "Eemalda töölaualt",
      "menu.manageDesktop": "Halda töölauda",
      "menu.nameLayout": "Anna paigutusele nimi",
      "note.delete": "Kustuta märge",
      "note.placeholder": "Kirjuta midagi…",
      "note.aria": "Märge",
      "note.invite": "Jätta siia märge?",
      "note.inviteAria": "Jäta siia märge",
      "widget.quote": "Pakkumine",
      "widget.payback": "Tasuvus",
      "widget.capture": "Kiirmärge",
      "capture.placeholder": "Pane mõte kirja… ⏎",
      "capture.aria": "Pane mõte kirja",
      "toast.tidied": "Vidinad korrastatud", "toast.tidiedBody": "Tagasi tavalisel võrgustikul.",
      "toast.layoutSaved": "Paigutus salvestatud", "toast.layoutSavedBody": "„{name}“ on töölaua menüüs.",
      "toast.layoutRestored": "Paigutus taastatud", "toast.layoutRestoredBody": "Vidinad on seal, kuhu sa nad jätsid.",
      "toast.captured": "Kirjas", "toast.capturedBody": "Otse rakendusse {app}.",
      "toast.toEchoes": "Liigutatud rakendusse {app}",
      "toast.toEchoesNote": "Miski ei kao enne, kui sa nii ütled.",
      "toast.toEchoesIcon": "See ootab seal — saad igal ajal tagasi tuua.",
      "toast.restored": "Taastatud", "toast.restoredBody": "Märge on tagasi seal, kus ta oli.",
      "toast.closed": "{app} suletud", "toast.closedBody": "Vajuta „Võta tagasi“, et see endisel kujul tagasi tuua.",
      "toast.undo": "Võta tagasi",
      "toast.noSave": "Ei õnnestunud salvestada", "toast.noSaveBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      "toast.noSaveNote": "Märget ei õnnestunud salvestada",
      "toast.copied": "Kopeeritud", "toast.copiedBody": "Diagnostika on lõikelaual.",
      "toast.nothingToSave": "Pole midagi salvestada", "toast.nothingToSaveBody": "Ava enne aken või kaks.",
      "toast.layoutSavedN": "Meelde jäetud aknaid: {n}.",
      "toast.layoutBack": "„{name}“ on taas ekraanil.",
      "win.close": "Sulge aken", "win.minimize": "Minimeeri aken", "win.maximize": "Maksimeeri aken",
      "win.failed": "{app} ei laadinud. Tavaliselt aitab lehe uuesti laadimine.",
      "win.openApp": "Ava {app}", "win.quickAction": "Kiirtoiming: {app}",
      "win.noneOpen": "Avatud aknaid pole.",
      "time.now": "Just praegu", "time.m": "{n} min tagasi", "time.h": "{n} t tagasi", "time.d": "{n} p tagasi", "time.w": "{n} nädalat tagasi",
      "sc.quickActions": "Kiirtoimingud", "sc.closeTop": "Sulge pealmine", "sc.thisPanel": "See paneel",
      "sc.openWindows": "Avatud aknad", "sc.expose": "Exposé — kõik aknad korraga",
      "sc.terminal": "Terminali ajalugu", "sc.note": "Jäta töölauale märge", "sc.deskMenu": "Töölaua menüü",
      "sc.system": "Süsteem", "sc.openAnApp": "Ava rakendus",
      "p.noNotifications": "Teateid veel pole", "p.dismiss": "Peida", "p.clearAll": "Tühjenda kõik",
      "p.openNow": "Praegu avatud", "p.focus": "Mine juurde", "p.close": "Sulge", "p.noWindows": "Avatud aknaid pole",
      "p.closedAgo": "suletud {when}", "p.reopen": "Ava uuesti", "p.open": "Avatud", "p.recentlyClosed": "Hiljuti suletud",
      "p.nothingCopied": "Midagi pole veel kopeeritud", "p.copiedInside": "Ainult kopeerimine sys.baby sees",
      "p.windowsCount": "aknaid: {n} · ", "p.restore": "Taasta", "p.delete": "Kustuta",
      "p.noLayouts": "Salvestatud paigutusi veel pole", "p.layoutsNote": "Salvestab akende asukohad, mitte nende sisu",
      "p.saveCurrent": "Salvesta praegune", "p.layoutName": "Paigutus {n}",
      "p.appIcons": "Rakenduste ikoonid", "p.removedFromDesktop": "Töölaualt eemaldatud", "p.onDesktop": "Töölaual",
      "p.add": "Lisa", "p.remove": "Eemalda", "p.keepsSpot": "Eemaldatud hoiavad oma koha järgmiseks korraks",
      "h.frameRate": "Kaadrisagedus", "h.heap": "JS-mälu", "h.storage": "Salvestusruum", "h.openWindows": "Avatud aknad",
      "h.cssFullscreen": "CSS täisekraan", "h.browserFullscreen": "Brauseri täisekraan",
      "h.viewport": "Vaateala", "h.screen": "Ekraan", "h.errors": "Vigu selles seansis", "h.userAgent": "Brauser",
      "h.sampling": "mõõdame…", "h.measuring": "arvutame…", "h.notExposed": "brauser ei avalda",
      "h.yes": "jah", "h.no": "ei", "h.recentErrors": "Hiljutised vead", "h.none": "Pole",
      "h.measured": "Elus, mõõdetud — mitte hinnatud", "h.copyReport": "Kopeeri raport", "h.of": " / ",
      "k.switchTo": "Lülitu {mode} välimusele", "k.toggleAppearance": "Vaheta välimust",
      "k.light": "heledale", "k.dark": "tumedale", "k.panel": "Paneel",
      "k.searchFor": "Otsi „{q}“", "k.everything": "Kõik selle kohta",
      "k.empty": "Vasteid ei leitud",
      "k.shortcuts": "Klaviatuuri otseteed", "k.windows": "Avatud aknad", "k.clipboard": "Kopeerimisajalugu",
      "k.layouts": "Akende paigutused", "k.manageDesktop": "Halda töölauda", "k.health": "Süsteemi seisund",
      "aria.identity": "Klõpsa, et määrata kasutajanimi",
      "aria.notifications": "Teated", "aria.appSeq": "Avatud aknad",
      "aria.tip": "Näita vihjet", "aria.cc": "Juhtimiskeskus",
      "aria.icons": "Töölaua ikoonid", "aria.notes": "Töölaua märkmed",
      "aria.dock": "Dokk", "aria.dockCta": "Alusta oma projekti",
      "aria.fab": "Kiirtoimingud", "aria.cmdk": "Käsupalett", "aria.close": "Sulge",
      "cmdk.placeholder": "Otsi rakendusi ja toiminguid…",
      "cc.connection": "Ühendus", "cc.online": "Võrgus", "cc.offline": "Võrguühenduseta",
      "cc.offlineLong": "Võrguühenduseta — võrku pole",
      "cc.battery": "Aku", "cc.batteryNA": "Aku olek pole saadaval",
      "cc.charging": "Laeb", "cc.onBattery": "Akutoitel",
      "cc.merge": "Liida, ära asenda",
      "theme.dark": "Tume", "theme.light": "Hele",
      "mood.studio": "Stuudio", "mood.aurora": "Virmalised", "mood.sunset": "Loojang", "mood.ocean": "Ookean", "mood.mono": "Mono",
      "dock.cta": "Alusta oma projekti"
    }
  };
  var LANGS = [{ code: "en", label: "English" }, { code: "ru", label: "Русский" }, { code: "ee", label: "Eesti" }];

  function lang() {
    var v = rawGet("sysbaby.i18n.lang") || "en";
    return STRINGS[v] ? v : "en";
  }
  window.sbLang = lang;
  /* sbT(key) -> the string; sbT(key, {name: "x"}) -> the string with {name}
     filled in. Interpolation lives here rather than at the call sites because
     word order differs between the three languages: a sentence assembled from
     English fragments ("Open " + name) cannot be translated at all, while one
     with a placeholder can be rewritten freely in each language.
     An unknown key returns the key itself, which is loud in the UI and
     therefore gets fixed, rather than silently rendering an empty string. */
  window.sbT = function (key, vars) {
    var L = STRINGS[lang()];
    var s = (L && L[key]) || STRINGS.en[key] || key;
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  };
  /* The document's own language, not just its visible text. A screen reader
     picks its voice from this and the browser hyphenates from it, so a page
     full of Russian still labelled lang="en" is read out in an English accent.
     Estonian's IETF tag is `et` — `ee` is this project's internal code for it
     and is not a language tag, so it is mapped rather than copied. */
  var DOC_LANG = { en: "en", ru: "ru", ee: "et" };

  function applyLang() {
    var code = lang();
    root.setAttribute("lang", DOC_LANG[code] || code);
    $$("[data-i18n]").forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      var v = window.sbT(k);
      if (v) n.textContent = v;
    });
    $$("[data-i18n-title]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-title"));
      if (v) n.setAttribute("title", v);
    });
    $$("[data-i18n-aria]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-aria"));
      if (v) n.setAttribute("aria-label", v);
    });
    $$("[data-i18n-ph]").forEach(function (n) {
      var v = window.sbT(n.getAttribute("data-i18n-ph"));
      if (v) n.setAttribute("placeholder", v);
    });
    /* The status strip is painted from live values, not from markup, so it
       has to be repainted rather than translated in place. */
    paintNet();
    if (window.sbBus) window.sbBus.emit("translate:done", { to: code });
  }
  window.sbSetLang = function (code) {
    var c = STRINGS[code] ? code : "en";
    rawSet("sysbaby.i18n.lang", c);
    applyLang();
    paintClock(true);
    if (typeof window.sbAnnounceSetting === "function") window.sbAnnounceSetting("lang", { code: c });
    return c;
  };

  /* ========================================================= identity (§5) */
  var USER_KEY = "sysbaby.username";
  function sanitize(v) { return String(v || "").toLowerCase().replace(/[^a-z0-9_.\-]/g, "").slice(0, 18); }

  window.sbGetUsername = function () {
    var v = window.sbDB ? window.sbDB.get(USER_KEY) : null;
    return sanitize(v) || "guest";
  };
  window.sbSetUsername = function (name) {
    var v = sanitize(name) || "guest";
    if (window.sbDB) window.sbDB.set(USER_KEY, v);
    paintIdentity();
    try { doc.dispatchEvent(new CustomEvent("sysbaby:username-changed", { detail: { username: v } })); } catch (e) { /* ignore */ }
    return v;
  };

  function paintIdentity() {
    var el = $("#sbIdentityName");
    if (el) el.textContent = window.sbGetUsername();
  }

  function wireIdentity() {
    var host = $("#sbTopIdentity"), el = $("#sbIdentityName");
    if (!host || !el) return;
    paintIdentity();
    host.title = window.sbT("aria.identity");
    host.addEventListener("click", function () {
      if (el.isContentEditable) return;
      var before = el.textContent;
      el.contentEditable = "true";
      el.focus();
      try {
        var r = doc.createRange();
        r.selectNodeContents(el);
        var s = window.getSelection();
        s.removeAllRanges(); s.addRange(r);
      } catch (e) { /* ignore */ }
      function commit(save) {
        el.contentEditable = "false";
        if (save) window.sbSetUsername(el.textContent);
        else el.textContent = before;
        el.removeEventListener("keydown", onKey);
        el.removeEventListener("blur", onBlur);
      }
      function onKey(ev) {
        if (ev.key === "Enter") { ev.preventDefault(); commit(true); }
        else if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); commit(false); }
      }
      function onBlur() { commit(true); }
      el.addEventListener("keydown", onKey);
      el.addEventListener("blur", onBlur);
    });
    el.addEventListener("paste", function (ev) {
      ev.preventDefault();
      var text = (ev.clipboardData || window.clipboardData).getData("text");
      doc.execCommand("insertText", false, sanitize(text));
    });
  }

  /* ============================================================== clock (§5) */
  var clockCells = null, lastClock = "";
  function localeFor() { var l = lang(); return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB"); }

  function paintClock(force) {
    var host = $("#sbClock");
    if (!host) return;
    if (doc.visibilityState === "hidden" && !force) return;
    var d = new Date();
    var opts = window.innerWidth < 560 ? { day: "numeric", month: "short" } : { weekday: "short", day: "numeric", month: "short" };
    var dateStr = d.toLocaleDateString(localeFor(), opts);
    var timeStr = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    var whole = dateStr + "  " + timeStr;
    if (whole === lastClock && !force) return;

    if (!clockCells || clockCells.length !== whole.length || force) {
      host.innerHTML = "";
      clockCells = [];
      for (var i = 0; i < whole.length; i++) {
        var s = doc.createElement("span");
        s.className = "clock-cell";
        s.textContent = whole[i];
        host.appendChild(s);
        clockCells.push(s);
      }
    } else {
      for (var j = 0; j < whole.length; j++) {
        if (clockCells[j].textContent !== whole[j]) {
          clockCells[j].textContent = whole[j];
          if (!reduced()) {
            clockCells[j].classList.remove("roll");
            void clockCells[j].offsetWidth;
            clockCells[j].classList.add("roll");
          }
        }
      }
    }
    lastClock = whole;
  }
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "visible") paintClock(true); });

  /* ====================================================== connectivity (§5) */
  function paintNet() {
    var el = $("#sbNetGlyph");
    var online = navigator.onLine !== false;
    if (el) {
      el.classList.toggle("offline", !online);
      el.title = online ? window.sbT("cc.online") : window.sbT("cc.offlineLong");
    }
    var row = $("#sbCcNet");
    if (row) row.textContent = online ? window.sbT("cc.online") : window.sbT("cc.offline");
  }
  window.addEventListener("online", paintNet);
  window.addEventListener("offline", paintNet);

  /* ========================================================== battery (§5) */
  function paintBattery(bat) {
    var el = $("#sbBatteryGlyph"), row = $("#sbCcBattery"), line = $("#sbCcBatteryLine");
    if (!bat) {
      if (el) { el.classList.add("neutral"); el.title = window.sbT("cc.batteryNA"); }
      if (row) row.textContent = "—";
      if (line) line.textContent = window.sbT("cc.battery");
      return;
    }
    var pct = Math.round((bat.level || 0) * 100);
    if (el) {
      el.style.setProperty("--fill", pct + "%");
      el.classList.toggle("charging", !!bat.charging);
      el.classList.toggle("warn", pct <= 20 && pct > 10);
      el.classList.toggle("danger", pct <= 10);
      el.title = pct + "% — " + (bat.charging ? window.sbT("cc.charging") : window.sbT("cc.onBattery"));
    }
    if (row) {
      if (window.sbAnimateFigure) window.sbAnimateFigure(row, pct, function (n) { return Math.round(n) + "%"; });
      else row.textContent = pct + "%";
    }
    if (line) {
      if (bat.charging && isFinite(bat.chargingTime) && bat.chargingTime > 0 && bat.chargingTime !== Infinity) {
        line.textContent = "Charging · " + Math.round(bat.chargingTime / 60) + "m to full";
      } else if (!bat.charging && isFinite(bat.dischargingTime) && bat.dischargingTime > 0 && bat.dischargingTime !== Infinity) {
        var m = Math.round(bat.dischargingTime / 60);
        line.textContent = (m >= 60 ? Math.floor(m / 60) + "h " + (m % 60) + "m" : m + "m") + " remaining";
      } else {
        line.textContent = bat.charging ? window.sbT("cc.charging") : window.sbT("cc.battery");
      }
    }
  }
  function initBattery() {
    if (!navigator.getBattery) { paintBattery(null); return; }
    navigator.getBattery().then(function (bat) {
      paintBattery(bat);
      ["levelchange", "chargingchange", "chargingtimechange", "dischargingtimechange"].forEach(function (e) {
        bat.addEventListener(e, function () { paintBattery(bat); });
      });
    }, function () { paintBattery(null); });
  }

  /* ============================================================ tips (§5, §8)
     The sentence lives in the string table under tip.<id>, so a tip speaks
     whatever language the desktop is in. `pointer: true` marks the ones that
     describe something a finger cannot do — hovering, right-clicking, a
     keyboard chord. On a touch device those are not tips, they are false
     statements, so they are never offered there. */
  var TIPS = [
    /* The first thing this desktop says is why it exists: the client work in
       Portfolio is real, and one of the two systems opens right here.
       Everything else it can teach matters less than that. */
    { id: "portfolio", panel: null },
    { id: "inlinesearch", panel: null, pointer: true },
    { id: "cmdk", panel: null, pointer: true },
    { id: "stickynotes", panel: null },
    { id: "windowspanel", panel: "sbTaskOverlay", pointer: true },
    { id: "appshortcuts", panel: "sbShortcutsOverlay", pointer: true },
    { id: "shortcutslist", panel: "sbShortcutsOverlay", pointer: true },
    { id: "snap", panel: null },
    { id: "iconhide", panel: null, pointer: true },
    { id: "privacy", panel: null },
    { id: "clip", panel: "sbClipOverlay" },
    { id: "diag", panel: "sbDiagOverlay" },
    { id: "echoes", panel: null },
    { id: "layouts", panel: "sbLayoutsOverlay" }
  ];

  function touchOnly() {
    return doc.documentElement.classList.contains("is-touch");
  }

  /* An app's name is whatever the OS currently calls it, in whatever language
     it is currently speaking. Resolving it here means the tip and the icon it
     points at can never disagree. */
  function tipText(id) {
    var s = window.sbT("tip." + id);
    return String(s).replace(/\{(\w+)\}/g, function (m, app) {
      return (window.sbAppTitle ? window.sbAppTitle(app) : app);
    });
  }
  var TIP_KEY = "sysbaby.tips.seen";
  var tipTimer = null, currentTip = null;

  function tipsSeen() { var v = readJSON(TIP_KEY, []); return Array.isArray(v) ? v : []; }
  function markTip(id) {
    var seen = tipsSeen();
    if (seen.indexOf(id) !== -1) return;
    seen.push(id);
    writeJSON(TIP_KEY, seen);
  }

  /* Every tip this device can honestly give. On touch that is a shorter list
     than on a desktop, and the bulb retires when THAT list runs out — not
     when a list containing tips the visitor could never act on runs out. */
  function offerable() {
    var pointerless = touchOnly();
    return TIPS.filter(function (t) { return !(pointerless && t.pointer); });
  }

  /* The portfolio tip leads once per session: the first thing the desktop
     says is why it exists. After that it goes back into the shuffle with the
     rest — leading every cycle would be nagging, not teaching. */
  var portfolioLed = false;
  function nextTip() {
    var seen = tipsSeen();
    var unseen = offerable().filter(function (t) { return seen.indexOf(t.id) === -1; });
    if (!unseen.length) return null;
    if (!portfolioLed) {
      portfolioLed = true;
      for (var i = 0; i < unseen.length; i++) if (unseen[i].id === "portfolio") return unseen[i];
    }
    return unseen[Math.floor(Math.random() * unseen.length)];
  }

  function showTip(tip) {
    var host = $("#sbDeskHint"), text = $("#sbDeskHintText");
    if (!host || !text || !tip) return;
    currentTip = tip;
    text.textContent = tipText(tip.id);
    host.removeAttribute("hidden");
    /* one frame with the element laid out but not yet `.on`, so the entrance
       transition has a start state to animate from */
    requestAnimationFrame(function () { host.classList.add("on"); });
  }
  function hideTip() {
    var host = $("#sbDeskHint");
    if (host) host.classList.remove("on");
    currentTip = null;
  }
  /* Retiring is not the same as hiding: nothing left to teach, so the bulb
     goes too. Silently — a notice saying "no more notices" is still a notice. */
  function retireTips() {
    hideTip();
    var host = $("#sbDeskHint");
    if (host) host.setAttribute("hidden", "");
    var bulb = $("#sbTipBulb");
    if (bulb) bulb.classList.add("retired");
  }

  function scheduleTips() {
    if (tipTimer) clearTimeout(tipTimer);
    var showMs = reduced() ? 3200 : 6800, gap = 700;
    function cycle() {
      if (doc.visibilityState === "hidden" || (window.sbAnyPanelOpen && window.sbAnyPanelOpen())) {
        tipTimer = setTimeout(cycle, 1500);
        return;
      }
      var tip = nextTip();
      if (!tip) { retireTips(); return; }
      showTip(tip);
      tipTimer = setTimeout(function () {
        hideTip();
        tipTimer = setTimeout(cycle, gap);
      }, showMs);
    }
    tipTimer = setTimeout(cycle, reduced() ? 900 : 3400);
  }

  function wireTips() {
    var body = $("#sbDeskHintBody"), close = $("#sbDeskHintClose"), bulb = $("#sbTipBulb");
    if (body) {
      body.addEventListener("click", function () {
        if (!currentTip) return;
        markTip(currentTip.id);
        if (currentTip.panel && window.sbPanels && window.sbPanels[currentTip.panel]) window.sbPanels[currentTip.panel].open();
        else if (currentTip.id === "inlinesearch" && window.sbSeekReveal) window.sbSeekReveal();
        else if (currentTip.id === "portfolio" && window.toggleApp) window.toggleApp("portfolio");
        else if (currentTip.id === "echoes" && window.toggleApp) window.toggleApp("echoes");
        else if (currentTip.id === "cmdk" && window.openCmdk) window.openCmdk("");
        hideTip();
      });
    }
    /* Dismissing marks the tip learned. Anything else means the same sentence
       comes back later, which is how a hint turns into nagging. */
    if (close) {
      close.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (currentTip) markTip(currentTip.id);
        hideTip();
      });
    }
    if (bulb) {
      bulb.addEventListener("click", function () {
        var tip = nextTip();
        if (tip) showTip(tip);
        else if (window.showToast) window.showToast(window.sbT("tips.doneTitle"), window.sbT("tips.doneBody"), "");
      });
    }
    if (window.sbBus) {
      window.sbBus.on("panel:open", function (p) {
        TIPS.forEach(function (t) { if (t.panel === p.id) markTip(t.id); });
      });
      window.sbBus.on("icon:visibility", function () { markTip("iconhide"); });
      /* A tip already on screen re-reads itself in the new language rather
         than sitting there in the old one. */
      window.sbBus.on("translate:done", function () {
        var close = $("#sbDeskHintClose");
        if (close) close.setAttribute("aria-label", window.sbT("tips.dismiss"));
        if (currentTip) {
          var text = $("#sbDeskHintText");
          if (text) text.textContent = tipText(currentTip.id);
        }
      });
    }
    doc.addEventListener("keydown", function (ev) {
      if ((ev.metaKey || ev.ctrlKey) && String(ev.key || "").toLowerCase() === "k") markTip("cmdk");
    });
  }

  /* ================================================== control center (§7) */
  var ccOpen = false;
  window.sbControlCenterOpen = function () { return ccOpen; };
  window.sbCloseControlCenter = function () {
    var cc = $("#sbControlCenter");
    if (!cc) return;
    ccOpen = false;
    cc.classList.remove("open");
    cc.setAttribute("hidden", "");
  };
  function openControlCenter() {
    var cc = $("#sbControlCenter");
    if (!cc) return;
    if (window.sbCloseAllPanels) window.sbCloseAllPanels();
    ccOpen = true;
    cc.removeAttribute("hidden");
    cc.classList.add("open");
    paintCc();
  }

  function paintCc() {
    ["sound", "dnd", "autohide", "motion", "transparency"].forEach(function (k) {
      var on = window.sbGetControlToggle ? window.sbGetControlToggle(k) : false;
      $$('[data-cc="' + k + '"]').forEach(function (b) {
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
    var incogBtn = $("#sbCcIncog");
    if (incogBtn) incogBtn.textContent = window.sbIncognitoActive ? window.sbT("cc.exit") : window.sbT("cc.incognito");
    var accent = window.sbGetCurrentAccent ? window.sbGetCurrentAccent() : { a1: "#5b7cff" };
    $$("[data-accent]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-accent").toLowerCase() === String(accent.a1).toLowerCase()); });
    var mood = window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio";
    $$("[data-mood]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-mood") === mood); });
    var themeNow = window.sbGetTheme ? window.sbGetTheme() : "dark";
    $$("[data-theme-chip]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme-chip") === themeNow); });
    /* Sliders and the language selector are settings too — they repaint from
       the same stored truth as the toggles, or the panel shows stale values
       after Pulse moves them. */
    var vol = $("#sbCcVolume");
    if (vol && doc.activeElement !== vol) {
      vol.value = String(Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100));
    }
    var bright = $("#sbCcBrightness");
    if (bright && doc.activeElement !== bright && window.sbGetBrightness) {
      bright.value = String(window.sbGetBrightness());
    }
    var langSel = $("#sbCcLang");
    if (langSel && langSel.options && langSel.options.length && langSel.value !== lang()) langSel.value = lang();
    paintNet();
  }

  function wireControlCenter() {
    var trigger = $("#sbCcTrigger"), cc = $("#sbControlCenter");
    if (!trigger || !cc) return;
    trigger.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (ccOpen) window.sbCloseControlCenter(); else openControlCenter();
    });
    doc.addEventListener("pointerdown", function (ev) {
      if (!ccOpen) return;
      if (ev.target && ev.target.closest && (ev.target.closest("#sbControlCenter") || ev.target.closest("#sbCcTrigger"))) return;
      window.sbCloseControlCenter();
    });

    $$("[data-cc]", cc).concat($$('[data-cc="motion"]')).forEach(function (btn) {
      if (btn.getAttribute("data-cc-wired") === "1") return;
      btn.setAttribute("data-cc-wired", "1");
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-cc");
        var on = !window.sbGetControlToggle(key);
        window.sbSetControlToggle(key, on);
        paintCc();
        if (key === "motion") scheduleTips();
      });
    });

    var vol = $("#sbCcVolume");
    if (vol) {
      vol.value = String(Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100));
      vol.addEventListener("input", function () {
        /* through the shell setter: persisted + announced, not a session-only global */
        if (window.sbSetNotifVolume) window.sbSetNotifVolume(num(vol.value, 60) / 100);
        else window.sbNotifVolume = clamp(num(vol.value, 60) / 100, 0, 1);
      });
      vol.addEventListener("change", function () { if (window.SysBaby && window.SysBaby.playNotifSound) window.SysBaby.playNotifSound(); });
    }
    var bright = $("#sbCcBrightness");
    if (bright) {
      if (window.sbGetBrightness) bright.value = String(window.sbGetBrightness());
      bright.addEventListener("input", function () {
        if (window.sbSetBrightness) window.sbSetBrightness(num(bright.value, 100));
        else doc.body.style.filter = "brightness(" + (0.72 + (clamp(num(bright.value, 100), 0, 100) / 100) * 0.34).toFixed(3) + ")";
      });
    }
    var langSel = $("#sbCcLang");
    if (langSel) {
      langSel.innerHTML = LANGS.map(function (l) {
        return '<option value="' + l.code + '"' + (l.code === lang() ? " selected" : "") + ">" + esc(l.label) + "</option>";
      }).join("");
      langSel.addEventListener("change", function () { window.sbSetLang(langSel.value); });
    }
    $$("[data-mood]", cc).forEach(function (b) {
      b.addEventListener("click", function () { if (window.sbSetWallpaperMood) window.sbSetWallpaperMood(b.getAttribute("data-mood")); paintCc(); });
    });
    $$("[data-theme-chip]", cc).forEach(function (b) {
      b.addEventListener("click", function () { if (window.setTheme) window.setTheme(b.getAttribute("data-theme-chip")); paintCc(); });
    });

    var swHost = $("#sbCcAccents");
    if (swHost && window.sbGetAccentSwatches) {
      swHost.innerHTML = window.sbGetAccentSwatches().map(function (a) {
        return '<button class="accent-sw" type="button" data-accent="' + esc(a.a1) + '" title="' + esc(a.name) + '" ' +
          'style="background:linear-gradient(135deg,' + esc(a.a1) + "," + esc(a.a2) + ')"></button>';
      }).join("") + '<input type="color" id="sbCcAccentCustom" class="accent-custom" aria-label="Custom accent colour" value="' +
        esc(window.sbGetCurrentAccent().a1) + '" />';
      $$("[data-accent]", swHost).forEach(function (b) {
        b.addEventListener("click", function () { window.sbSetAccent(b.getAttribute("data-accent")); paintCc(); });
      });
      var custom = $("#sbCcAccentCustom", swHost);
      if (custom) custom.addEventListener("input", function () { window.sbSetAccent(custom.value); paintCc(); });
    }

    var incogBtn = $("#sbCcIncog");
    if (incogBtn) {
      incogBtn.addEventListener("click", function () {
        window.sbCloseControlCenter();
        if (window.sbIncognitoActive) {
          try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
          location.reload();
          return;
        }
        if (window.sbOpenIncognitoGate) window.sbOpenIncognitoGate();
      });
    }
    var shieldBtn = $("#sbIncogBtn");
    if (shieldBtn) shieldBtn.addEventListener("click", function () {
      if (window.sbIncognitoActive) {
        try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
        location.reload();
        return;
      }
      if (window.sbOpenIncognitoGate) window.sbOpenIncognitoGate();
    });

    var signout = $("#sbCcSignOut");
    if (signout) signout.addEventListener("click", function () { window.sbCloseControlCenter(); if (window.sbSignOut) window.sbSignOut(); });

    var exportBtn = $("#sbCcExport");
    if (exportBtn) exportBtn.addEventListener("click", function () {
      if (!window.sbDownloadExport) return;
      if (window.sbDB) window.sbDB.flushSync();
      var res = window.sbDownloadExport();
      if (window.showToast) {
        if (res.ok) window.showToast("Profile exported", res.count + " keys written to " + res.name, "");
        else window.showToast("Export failed", res.error, "", true, "toast-warn", "event");
      }
    });
    var importBtn = $("#sbCcImport"), importInput = $("#sbCcImportFile");
    if (importBtn && importInput) {
      importBtn.addEventListener("click", function () { importInput.click(); });
      importInput.addEventListener("change", function () {
        var f = importInput.files && importInput.files[0];
        if (!f) return;
        var mode = ($("#sbCcImportMerge") && $("#sbCcImportMerge").checked) ? "merge" : "replace";
        f.text().then(function (text) {
          var res = window.sbImportProfile(text, { mode: mode });
          if (!res.ok && window.showToast) window.showToast("Import refused", res.error, "", true, "toast-warn", "event");
          else if (window.showToast) window.showToast("Profile imported", res.count + " keys restored — reloading.", "");
        }).catch(function (e) {
          if (window.showToast) window.showToast("Import failed", String(e && e.message || e), "", true, "toast-warn", "event");
        });
        importInput.value = "";
      });
    }

    var turbo = $("#sbTurbo");
    if (turbo && turbo.getAttribute("data-cc-wired") !== "1") {
      turbo.setAttribute("data-cc-wired", "1");
      turbo.addEventListener("click", function () {
        window.sbSetControlToggle("motion", !window.sbGetControlToggle("motion"));
        paintCc();
        scheduleTips();
      });
    }
  }

  /* ====================================================== session timer (§5) */
  var TIMER_KEY = "sysbaby.sessiontimer.pref";
  var timerState = { armed: false, deadline: 0, tick: null, badge: null };

  function timerPref() {
    var v = readJSON(TIMER_KEY, null);
    if (!v || typeof v !== "object") return { sec: 300, windows: true, notes: true };
    return { sec: num(v.sec, 300), windows: v.windows !== false, notes: v.notes !== false };
  }

  function disarmTimer() {
    timerState.armed = false;
    if (timerState.tick) { clearInterval(timerState.tick); timerState.tick = null; }
    if (timerState.badge && timerState.badge.parentNode) timerState.badge.parentNode.removeChild(timerState.badge);
    timerState.badge = null;
  }

  function armTimer(pref) {
    if (!pref.sec || (!pref.windows && !pref.notes)) {
      if (window.showToast) window.showToast("Nothing to clear", "Pick an interval and at least one thing to clear.", "");
      return false;
    }
    disarmTimer();
    timerState.armed = true;
    timerState.deadline = Date.now() + pref.sec * 1000;
    var badge = doc.createElement("button");
    badge.type = "button";
    badge.id = "sbTimerBadge";
    badge.className = "fixed-badge";
    badge.title = "Click to cancel the session timer";
    doc.body.appendChild(badge);
    timerState.badge = badge;
    badge.addEventListener("click", function () {
      disarmTimer();
      if (window.showToast) window.showToast("Timer cancelled", "Nothing will be cleared.", "");
    });
    function reset() { if (timerState.armed) timerState.deadline = Date.now() + pref.sec * 1000; }
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (e) { doc.addEventListener(e, reset, true); });
    timerState.tick = setInterval(function () {
      var left = Math.max(0, Math.round((timerState.deadline - Date.now()) / 1000));
      var m = Math.floor(left / 60), s = left % 60;
      badge.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      badge.classList.toggle("urgent", left <= 30);
      if (left <= 0) {
        if (pref.windows && window.openWindows) Object.keys(window.openWindows).forEach(function (id) { window.closeWindow(id); });
        if (pref.notes && window.sbNotesStore) window.sbNotesStore.load().forEach(function (n) { window.sbNotesStore.softDelete(n.id); });
        disarmTimer();
        if (window.showToast) window.showToast("Session cleared", "Windows and notes are recoverable in Echoes.", "", true, "", "event");
      }
    }, 1000);
    return true;
  }

  function wireSessionTimer() {
    var btn = $("#sbTimerBtn"), pop = $("#sbTimerPop");
    if (!btn || !pop) return;
    var pref = timerPref();
    var sel = $("#sbTimerSec", pop), cw = $("#sbTimerWindows", pop), cn = $("#sbTimerNotes", pop), arm = $("#sbTimerArm", pop);
    if (sel) sel.value = String(pref.sec);
    if (cw) cw.checked = pref.windows;
    if (cn) cn.checked = pref.notes;
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      pop.hidden = !pop.hidden;
    });
    doc.addEventListener("pointerdown", function (ev) {
      if (pop.hidden) return;
      if (ev.target && ev.target.closest && (ev.target.closest("#sbTimerPop") || ev.target.closest("#sbTimerBtn"))) return;
      pop.hidden = true;
    });
    if (arm) arm.addEventListener("click", function () {
      var p = { sec: num(sel && sel.value, 300), windows: !!(cw && cw.checked), notes: !!(cn && cn.checked) };
      writeJSON(TIMER_KEY, p);
      pop.hidden = true;
      if (armTimer(p) && window.showToast) window.showToast("Timer armed", "Idle for " + Math.round(p.sec / 60) + " minutes clears your desk.", "");
    });
  }

  /* =========================================================== bootstrap */
  function init() {
    /* Listeners BEFORE the first applyLang(). applyLang emits translate:done,
       and anything that subscribes afterwards misses that first emission —
       which is exactly how the desktop hint's dismiss button used to stay in
       English until the visitor changed language a second time. */
    wireIdentity();
    wireControlCenter();
    wireTips();
    wireSessionTimer();
    applyLang();
    paintClock(true);
    setInterval(function () { paintClock(false); }, 1000);
    paintNet();
    initBattery();
    paintCc();
    /* Live sync: whenever ANY surface changes a setting, the Control Center
       repaints — open or closed. Closed it costs a handful of queries per
       change; skipping it left the language selector stale for exactly the
       one law that watched (outside-click had closed the panel first). */
    doc.addEventListener("sysbaby:setting-changed", function () { paintCc(); });
    doc.addEventListener("sysbaby:desktop-ready", scheduleTips);
    setTimeout(scheduleTips, 6000);
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
