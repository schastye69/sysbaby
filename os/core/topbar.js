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
      "cc.sound": "Sound", "cc.dnd": "Do Not Disturb", "cc.autohide": "Dim Dock",
      "cc.motion": "Turbo", "cc.transparency": "Reduce transparency",
      "cc.volume": "Volume", "cc.brightness": "Brightness", "cc.language": "Language",
      "cc.fullscreen": "Full screen", "cc.wallpaper": "Wallpaper", "cc.controls": "Window controls", "cc.controls.left": "Left", "cc.controls.right": "Right", "cc.appearance": "Appearance",
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
      "tip.portfolio": "Both client systems under Selected Work in {build} are real — and one of them opens right here.",
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
      "note.invite": "Leave a note?",
      "note.inviteAria": "Leave a note here",
      "note.minimize": "Back to the desktop",
      "note.maximize": "Open full screen",
      "note.body": "The rest of the note",
      "note.bodyPlaceholder": "The rest — only here",
      "note.more": "This note has more inside",
      "note.due.today": "today", "note.due.tomorrow": "tomorrow",
      "note.due.late": "overdue", "note.due.on": "by {date}",
      "tip.notefull": "Enter in a note's first line opens it full screen — the body is written only there.",
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
            "aria.notifications": "Notifications", "aria.appSeq": "Open windows",
      "aria.minimizeAll": "sys.baby OS — clear the desk: minimise every window",
      "aria.tip": "Show a tip", "cc.tip": "Show a tip",
      "aria.turbo": "Turbo — give every frame to the work", "aria.cc": "Control Center",
      "aria.langs": "Language", "lang.partial": "the storefront speaks it; the system does not yet",
      "desk.allMinimized": "Desk cleared", "desk.allMinimizedSub": "Windows are waiting — tap an icon to bring one back",
      "fs.no": "This browser keeps its own frame", "fs.noSub": "Full screen is not offered here — Safari on iPhone allows it for video only",
      "aria.icons": "Desktop icons", "aria.notes": "Desktop notes",
      "aria.dock": "Dock", "aria.fab": "Quick actions", "aria.cmdk": "Command palette", "aria.close": "Close",
      "cmdk.placeholder": "Search apps and actions…",
      "net.gone": "No internet", "net.nothingChanged": "Nothing has changed. Everything you have written is here, because it was always here. Only Browser needs the network — other people's pages are not ours to keep.", "net.stillHere": "No network — the system is here", "cc.connection": "Connection", "cc.online": "Online", "cc.offline": "Offline",
      "cc.offlineLong": "Offline — no network connection",
      "cc.battery": "Battery", "cc.batteryNA": "Battery status unavailable",
      "cc.charging": "Charging", "cc.onBattery": "On battery",
      "cc.merge": "Merge instead of replace",
      "theme.dark": "Dark", "theme.light": "Light",
      "mood.studio": "Studio", "mood.aurora": "Aurora", "mood.sunset": "Sunset", "mood.ocean": "Ocean", "mood.mono": "Mono", "mood.daylight": "Daylight", "mood.therapy": "Light therapy", "mood.feast": "Feast", "mood.ember": "Ember", "menu.tidyDesk": "Tidy desk", "menu.bringThing": "Bring a thing\u2026", "menu.hideFab": "Remove this button", "part.fab": "Quick actions button", "br.back": "Back", "br.fwd": "Forward", "br.again": "Reload", "br.bookmark": "Save this page", "br.bookmarked": "Saved", "br.openTab": "Open in a real tab", "br.placeholder": "Address, or something to look up", "br.frameTitle": "Page", "br.saved": "Saved", "br.recent": "Recent", "br.empty.title": "Nothing open yet", "br.empty.sub": "Type an address and press Enter. Many sites refuse to be shown inside another page \u2014 the arrow at the right opens the current address in a real tab, always.", "note.day.title": "That day is yours", "note.day.body": "The date is written down \u2014 keep typing what happens on it.", "lock.again": "Repeat the password", "lock.mismatch": "The two do not match \u2014 nothing was locked.", "lock.done": "Locked. Your words are in envelopes now.", "lock.failed": "Could not lock \u2014 nothing was changed.", "lock.remove": "Remove the lock", "lock.removed": "The lock is off. Your words lie open again.", "lock.warn": "There is no way back: if you forget this password, what you have written cannot be recovered. No server holds a copy \u2014 that is the whole point.", "lock.ask": "Password", "lock.open": "Open", "lock.locking": "Lock", "lock.wrong": "That password does not open this.", "lock.locked": "Locked", "lock.sub": "Everything here — notes, letters, conversations, the Vault, and the room itself: wallpaper, language, names. From this side nothing of yours can be seen.", "lock.title": "Lock everything", "lock.insecure": "The lock cannot work at this address. A browser gives a page real cryptography only over a protected connection (https). Open sys.baby over https and the lock appears — nothing else changes.", "panel.lock": "Lock", "aria.lock": "Lock — the aperture of this system", "aria.turboOn": "Turbo is on — tap to give the frames back", "cc.turbo": "Turbo", "lock.state.none": "Not locked", "lock.state.armed": "Locked — open for this session", "lock.what": "One password closes the whole system: every note, every letter, every conversation, the Vault, and the look of the room. On disk nothing readable is left — not even the names of the things you keep.", "lock.accounts": "Several accounts? One password opens all of them on this device. The lock stands in front of the storage, not in front of one account — and while it is shut, even the number of your accounts is invisible.", "lock.new": "Password", "lock.set": "Lock everything", "lock.now": "Lock now", "lock.change": "Change the password", "lock.changed": "The password is changed. Nothing was re-encrypted — only the envelope that holds the key.", "lock.old": "Current password", "lock.cipher": "What it is closed with", "lock.short": "At least four characters.", "lock.busy": "Working — this takes a second on purpose.", "auth.lock.title": "All of this can be closed with one word", "auth.lock.body": "sys.baby has no server. What you write stays on this device — which means nobody can read it for you, and nobody can read it instead of you. One turn of the key and the whole system goes into envelopes: notes, letters, conversations, even the colour of your walls. There is no recovery, because there is nobody to recover it from. You can do it now, or on any later day — the aperture in the top bar is always there.", "auth.lock.now": "Set it now", "auth.lock.later": "Later, from the top bar", "bk.title": "Copies", "bk.folder": "Folder", "bk.noFolder": "not chosen", "bk.last": "Last copy", "bk.never": "none yet", "bk.sealed": "sealed", "bk.choose": "Choose a folder", "bk.change": "Change the folder", "bk.on": "On", "bk.off": "Off", "bk.saveNow": "Save a copy now", "bk.exportNow": "Download a copy as a file", "bk.err": "Error:", "bk.what": "The system puts a copy of your profile into a folder you choose — every time something changed, and at the moment you leave the page. Three generations are kept: trouble noticed a day later can only be undone with yesterday's copy. While the lock is on, the copy goes into the folder SEALED and opens with the same password.", "bk.needFolder": "Without a real folder the synchronisation does not switch on. A copy living in the same browser as the original is not a copy: one clearing of the browser takes both.", "bk.unsupported": "This browser does not let a page write into a folder on your device, so there is no synchronisation here — and the Council will not pretend otherwise. Saving copies into the same browser would be easy and would be a lie: a copy living in the same browser as the original is not a copy, because one clearing of the browser takes both. What remains is a file you download yourself, with the button below. On desktop Chrome or Edge the synchronisation switches on by itself.", "bk.permission": "The browser wants you to confirm access to the folder. Press “Save a copy now” once more and allow it.", "panel.account": "Account", "aria.identity": "Account and leaving", "acc.you": "You are", "acc.guest": "a guest on this machine", "acc.name": "Name in the system", "acc.nameSub": "Shown in the top bar and on what you send. Two characters at least.", "acc.save": "Save", "acc.saved": "Saved.", "acc.profile": "Profile", "acc.switch": "Switch", "acc.export": "Export the profile first", "acc.signout": "Sign out, softly", "acc.leave": "Leave now", "acc.leaveSub": "One tap: the session closes, every cache and service copy is erased, the address and title of this history entry are replaced, and the tab tries to close. What you have written stays where it is — and stays sealed if the lock is on.", "acc.wipe": "Erase everything and leave", "acc.wipeSub": "All of the above, plus everything you have written: notes, letters, conversations, the Vault, profiles. Nothing of yours is left on this device. There is no undo.", "acc.wipeAsk": "Press once more to erase everything. This cannot be undone.", "acc.truth": "What a page cannot do, and the Council will not pretend otherwise: the browser's list of visits is not this page's memory, and no site may read or erase it — a site that could erase itself from your history could erase anything else too. This page replaces the entry it can reach, so Back will not lead here, and erases everything of its own. If you need visits not to be recorded at all, use a private window; to remove what is already recorded, clear it in the browser itself.", "panel.time": "Time & calendar", "aria.time": "Time and calendar", "pl.prev": "Previous", "pl.next": "Next", "pl.play": "Play", "pl.pause": "Pause", "pl.seek": "Position", "pl.pick": "Choose a folder", "pl.count": "{n} tracks", "pl.brought": "Music", "pl.broughtN": "{n} tracks brought in", "pl.none": "No audio files in that folder", "pl.empty.title": "No music yet", "pl.empty.sub": "A browser cannot look through your device on its own. Choose ONE folder \u2014 Music or Download, for example. Android refuses the storage root itself: if it says \u201cCan\u2019t use this folder\u201d, step into a folder and choose that.", "br.blank": "Page blank?", "br.blank.go": "Open in a tab", "br.shut.sub": "You told the system this site refuses to be shown inside another page. It opens in a real tab from now on \u2014 and this can be undone.", "br.shut.retry": "Try here again",
      /* ================================================== Pulse / Настройки
         Приложения больше не пишут строки литералами. Ключ живёт здесь,
         рядом с остальными двумя языками, чтобы перевод нельзя было забыть:
         дыра в ru/ee видна глазом в этом же файле. */
      "set.tab.general": "General", "set.tab.appearance": "Appearance",
      "set.tab.sound": "Sound & Focus", "set.tab.desktop": "Dock & Desktop",
      "set.tab.privacy": "Privacy", "set.tab.advanced": "Advanced", "set.tab.about": "About",
      "set.general.identity": "Your identity",
      "set.general.identitySub": "This is the name the whole system addresses you by — the topbar, {mail}, {messenger}, everywhere.",
      "set.general.saved": "Saved",
      "set.general.language": "Language",
      "set.general.languageSub": "The desktop speaks English, Russian and Estonian",
      "set.general.note": "Launch anything with ⌘K, switch windows with W, see every shortcut with ? — or use the dock along the bottom edge.",
      "set.appearance.theme": "Theme",
      "set.appearance.themeSub": "Dark is the only theme this release ships. A light theme that half the apps do not honour would look broken, and shipping it broken is worse than not having it.",
      "set.appearance.themeDark": "DARK",
      "set.appearance.mood": "Wallpaper mood",
      "set.appearance.moodSub": "Recolors the background scenery — everything else stays the same",
      "set.appearance.moodNone": "No moods available",
      "set.appearance.brightness": "Brightness",
      "set.appearance.brightnessSub": "Dims the whole desktop — the same slider as the Control Center",
      "set.appearance.fullscreenOn": "Take the whole screen", "set.appearance.fullscreenOff": "Give the screen back", "set.appearance.fullscreen": "Full screen", "set.appearance.fullscreenSub": "The system takes the whole screen \u2014 the same switch as in the quick panel", "set.appearance.controls": "Window controls", "set.appearance.controlsSub": "Which side the close, minimise and maximise keys sit on \u2014 in every window and on every note", "set.appearance.turbo": "Turbo",
      "set.appearance.turboSub": "Skips the long animations — everything happens instantly",
      "set.appearance.transparency": "Reduce transparency",
      "set.appearance.transparencySub": "Solid panels instead of glass",
      "set.sound.system": "System sound",
      "set.sound.systemSub": "Notification chimes and other short sound effects",
      "set.sound.volume": "Volume",
      "set.sound.volumeSub": "How loud the chime is — release the slider to hear it",
      "set.sound.dnd": "Do Not Disturb",
      "set.sound.dndSub": "Silences toasts and notifications until you turn it back off",
      "set.desktop.autohide": "Dim Dock",
      "set.desktop.autohideSub": "Dim the dock when idle — it never leaves the screen",
      "set.desktop.tidy": "Tidy widgets",
      "set.desktop.tidySub": "Puts the desktop widgets back on their default grid",
      "set.desktop.tidyBtn": "Tidy",
      "set.desktop.tidyDoneTitle": "Widgets tidied",
      "set.desktop.tidyDoneBody": "Back to the default grid.",
      "set.privacy.signedIn": "Signed in as",
      "set.privacy.guest": "Guest — this computer's local profile",
      "set.privacy.signOut": "Sign out",
      "set.privacy.signOutConfirm": "Sign out of sys.baby? You'll need to sign back in to reach this account's data.",
      "set.privacy.profiles": "Local profiles",
      "set.privacy.profilesSub": "Every account on this browser has its own completely separate notes, mail, files and messages",
      "set.privacy.profileDelete": "Delete this account",
      "set.privacy.profileDeleteConfirm": "Delete the account “{name}”? Its notes, mail, files, messages and settings are permanently removed from this browser.",
      "set.privacy.addAccount": "+ Add account",
      "set.privacy.addPrompt": "Sign in with an email to create or switch to that account:",
      "set.privacy.emailBadTitle": "Invalid email",
      "set.privacy.emailBadBody": "Enter a full email address.",
      "set.privacy.storage": "Local storage used",
      "set.privacy.clear": "Clear all local data",
      "set.privacy.clearSub": "Removes everything this browser holds for sys.baby",
      "set.privacy.clearBtn": "Clear",
      "set.privacy.clearConfirm": "Clear all local sys.baby data? Notes, mail, messages, files, saved layouts, clipboard history and preferences will be permanently removed from this browser.",
      "set.privacy.clearedTitle": "Local data cleared",
      "set.privacy.clearedBody": "Reload to see the system reset to defaults.",
      "set.privacy.clearFailTitle": "Couldn't clear",
      "set.privacy.clearFailBody": "Storage may be restricted in this browser.",
      "set.privacy.leavesTitle": "What leaves this device",
      "set.privacy.leavesBody": "Nothing. There is no account on a server, no sync and no request to anyone: everything you write stays in this browser. The only way data leaves this device is the export below, which you start yourself.",
      "set.privacy.backupTitle": "Backup",
      "set.privacy.backupBody": "Export writes this account's data to a JSON file you keep. Import replaces this account's data with a file you choose. Nothing is uploaded.",
      "set.privacy.export": "Export this account's data",
      "set.privacy.import": "Import a backup file",
      "set.privacy.note": "Everything is stored locally, per account, in this browser. Clearing your browser data deletes it for good.",
      "set.export.readyTitle": "Export ready",
      "set.export.readyBody": "{count} keys written to a file on this device.",
      "set.export.failTitle": "Export failed",
      "set.export.failBody": "The file could not be created in this browser.",
      "set.import.failTitle": "Import failed",
      "set.import.unreadable": "That file could not be read.",
      "set.import.notBackup": "That file is not a sys.baby backup.",
      "set.import.newer": "That backup was written by a newer version.",
      "set.import.confirm": "Import this backup? Everything currently in this account — notes, mail, messages, files and settings — is replaced by the contents of the file.",
      "set.save.failTitle": "Couldn't save",
      "set.save.failBody": "Storage may be full or restricted in this browser.",
      "set.advanced.diag": "Diagnostics — System Health",
      "set.advanced.diagSub": "Live FPS, memory, storage and session errors",
      "set.advanced.diagBtn": "Open",
      "set.advanced.reset": "Reset appearance",
      "set.advanced.resetSub": "Your room and its light — nothing else is touched",
      "set.advanced.resetBtn": "Reset",
      "set.advanced.resetDoneTitle": "Appearance reset",
      "set.advanced.resetDoneBody": "Your desk is back in Studio, and its light with it.",
      "set.about.build": "Build",
      "set.about.apps": "Applications",
      "set.about.appsValue": "{registered} registered · {launchable} in the dock",
      "set.about.appsNA": "registry unavailable",
      "set.about.madeOf": "Made of",
      "set.about.madeOfValue": "HTML, CSS and plain JavaScript — no framework, no build step",
      "set.about.runsOn": "Runs on",
      "set.about.runsOnValue": "this browser alone — no server side, nothing installed",
      "set.about.data": "Your data",
      "set.about.dataValue": "{count} local keys",
      "set.about.network": "Network",
      "set.about.networkValue": "the system itself makes none — no analytics, no tracking, no calls home. Pages you open in Browser talk to their own sites.",
      "set.about.languages": "Languages",
      "set.about.whatTitle": "What this desktop is",
      "set.about.whatBody": "A working answer to one question: what does it feel like when your business software belongs to you? Every app here is real — the notes keep, the files move, the terminal answers — and every word of it runs on your device. The client systems in {portfolio} are the same idea, built for real companies.",
      "set.about.whoTitle": "Who builds it",
      "set.about.whoBody": "A systems studio in Tallinn. The desktop you are looking at is written by the same hands that build the client systems — it is our proof of work, not a template. Press the clay tile in the dock to start a project of your own.",
      "set.about.note": "Accounts here are local profiles in this browser, not a server. Every account keeps its own data on this device, and nothing leaves it unless you export it yourself.",
      "set.storage.measuring": "measuring…",
      "set.storage.notExposed": "not exposed by this browser",
      "set.storage.unavailable": "unavailable",
      "set.storage.of": "{used} of {total}",

      /* ============================================== Portfolio / Портфолио */
      "pf.intro": "The workspace behind our real client work — and itself an example of it. This desktop, its applications and its storage are our own build, running in your browser with no install and no account. Below is the work itself — and one of the systems is running right here: open it and use it.",
      "pf.live": "live",
      "pf.badge.conf": "Confidential · Anonymous",
      "pf.badge.public": "Public",
      "pf.sub.delivered": "Delivered",
      "pf.sub.goal": "Goal",
      "pf.sub.results": "Results",
      "pf.results.firstHand": "First-hand: we worked in this trade before building the system.",
      "pf.results.clientReported": "Reported by the client.",
      "pf.results.sourceUnknown": "Source not recorded — ask us where this figure came from.",
      "pf.results.withheld": "Withheld at the client’s request — the same discretion covers your project.",
      "pf.results.notDelivered": "Built and not yet handed over. We agree the measurement at handover and publish the figure the client gives us, whatever it says.",
      "pf.results.pending": "Outcome measurement is agreed with the client and scheduled. We publish the figure they give us, whatever it says.",
      "pf.results.ownBuild": "Our own build for a private dental practice — we deliberately stopped short of rollout. It turned out that people with thirty years of writing by hand fill a card faster than they type, and one fast young person does not compensate for that: transcribing another shift's handwritten notes doubles the work instead of removing it. We paid for that finding ourselves, and it is now the first question we ask every client: who exactly will be entering the data. We show the system on request; there is no public demo.",
      "pf.name.ownBuild": "Our own build",
      "pf.name.ownBuildTitle": "Built by the studio itself — there is no outside client to name",
      "pf.open": "Open and use this system →",
      "pf.onPremises": "Running at the client’s premises, not as a hosted demonstration.",
      "pf.explore": "Explore",
      "pf.brief": "Project brief",
      "pf.everything": "Everything about this client",
      "pf.name.withheld": "Communication · Confidential",
      "pf.name.withheldTitle": "Client identity withheld at their request",
      "pf.name.pending": "Name · Pending permission",
      "pf.name.pendingTitle": "Permission to name this client has not been requested yet",
      "pf.empty": "Real completed client work will appear here.",
      "pf.replay": "Replay a working day in this desktop",
      "pf.replaySub": "A demonstration, not a recording — two minutes",
      "pf.cta": "Want a system like this built for your business?",
      "pf.ctaLink": "Start your project →",
      /* Стек — закрытый список из shared/portfolio.data.js. Данные там
         генерируются и правятся не руками, поэтому перевод стековых ярлыков
         живёт здесь; неизвестный ярлык показывается как есть. */
      "pf.tech.offline-first": "Offline-first",
      "pf.tech.zero-dependencies": "Zero dependencies",
      "pf.tech.print-native-a4": "Print-native A4",
      "pf.tech.et-ru-bilingual": "ET / RU bilingual",
      "pf.tech.responsive-web": "Responsive web",
      "pf.tech.runs-entirely-in-the-browser": "Runs entirely in the browser",
      "pf.tech.no-server-no-account": "No server, no account",
      "pf.tech.print-native-pdf": "Print-native PDF",
      "pf.tech.sepa-payment-qr": "SEPA payment QR",
      "pf.tech.e-signature": "E-signature",
      /* ============================================= Letters / Письма + links */
      "ml.folder.inbox": "Inbox", "ml.folder.starred": "Starred", "ml.folder.sent": "Sent",
      "ml.folder.drafts": "Drafts", "ml.folder.trash": "Trash",
      "ml.empty.inbox": "Nothing in the inbox. Replies land here.",
      "ml.empty.starred": "Nothing starred. Star a message to keep it within reach.",
      "ml.empty.sent": "Nothing sent yet.",
      "ml.empty.drafts": "No drafts. Anything you start writing waits here.",
      "ml.empty.trash": "The trash is empty.",
      "ml.empty.search": "Nothing matches “{q}”",
      "ml.time.now": "Just now", "ml.time.m": "{n}m ago", "ml.time.h": "{n}h ago", "ml.time.d": "{n}d ago",
      "ml.star": "Star", "ml.unstar": "Unstar",
      "ml.tag.delivered": "✓ delivered", "ml.tag.local": "local",
      "ml.tag.studio": "to the studio", "ml.tag.draft": "Draft",
      "ml.noSubject": "(no subject)",
      "ml.connected": "Connected",
      "ml.connected.real": "This letter is real — and so is everything it points to.",
      "ml.connected.sample": "This message is a sample. Everything it points to is real and opens.",
      "ml.link.openNow": "Open now",
      "ml.selectMessage": "Select a message",
      "ml.contactTitle": "See everything from this contact",
      "ml.meta.to": "To:", "ml.meta.from": "From:",
      "ml.act.restore": "Restore", "ml.act.purge": "Delete forever",
      "ml.act.continue": "Continue editing", "ml.act.delete": "Delete",
      "ml.act.reply": "Reply", "ml.act.forward": "Forward",
      "ml.act.toNote": "To {notes}", "ml.act.toNoteTitle": "Save this message as a {notes} note",
      "ml.delivery.ok": "Delivered to {addr} — a real email, sent {when}.",
      "ml.delivery.okReply": "Delivered to {addr} — a real email, sent {when}. Reply requested by {channel}.",
      "ml.delivery.local": "Local letter — it lives in this browser and was never transmitted anywhere.",
      "ml.compose.from": "New letter · From {addr}",
      "ml.compose.newMsgFrom": "New message · From {addr}",
      "ml.compose.close": "Close",
      "ml.compose.studio": "To the studio", "ml.compose.local": "Local",
      "ml.compose.studioNote": "really sent — a human reads it",
      "ml.compose.localNote": "stays in this browser",
      "ml.compose.realDelivery": "real delivery",
      "ml.compose.toPlaceholder": "To (a name is fine — it’ll become name@sys.baby)",
      "ml.compose.subject": "Subject",
      "ml.compose.bodyStudio": "What are we building together?",
      "ml.compose.bodyLocal": "Write your message…",
      "ml.compose.howAnswer": "How should we answer?",
      "ml.compose.honestStudio": "Send posts a real email to the studio inbox — through the same relay as the order form on the site.",
      "ml.compose.honestLocal": "Local letters never leave this device.",
      "ml.compose.sendStudio": "Send to the studio", "ml.compose.sendLocal": "Send · local",
      "ml.compose.sending": "Sending…",
      /* Значение канала уходит в письмо студии и обязано остаться английским —
         переводится только надпись в списке. */
      "ml.channel.email": "Email", "ml.channel.phone": "Phone", "ml.channel.telegram": "Telegram",
      "ml.channel.whatsapp": "WhatsApp", "ml.channel.signal": "Signal", "ml.channel.url": "URL",
      "ml.channel.other": "Other",
      "ml.ph.email": "you@example.com", "ml.ph.phone": "+372 …", "ml.ph.telegram": "@username",
      "ml.ph.whatsapp": "+372 …", "ml.ph.signal": "+372 … or username", "ml.ph.url": "https://…",
      "ml.ph.other": "Where do we find you?",
      "ml.toolbar.compose": "Compose", "ml.toolbar.studio": "To the studio",
      "ml.toolbar.studioTitle": "A real letter to a real inbox",
      "ml.toolbar.search": "Search mail",
      "ml.toast.savedNoteTitle": "Saved to {notes}",
      "ml.toast.savedNoteBody": "The message is a note now — a record you can work with.",
      "ml.toast.mailTitle": "Mail", "ml.toast.trash": "Message moved to Trash",
      "ml.confirm.purge": "Permanently delete \"{subject}\"? This can't be undone.",
      "ml.thisMessage": "this message",
      "ml.status.relay": "Posting to the studio relay…",
      "ml.status.emptyBody": "Write something first — an empty letter says nothing.",
      "ml.toast.notDeliveredTitle": "Not delivered",
      "ml.toast.notDeliveredBody": "The relay could not be reached. The letter waits in Drafts.",
      "ml.fail.offline": "You are offline.",
      "ml.fail.refused": "The mail relay refused or did not answer.",
      "ml.toast.deliveredTitle": "Delivered",
      "ml.toast.deliveredBody": "A real email is now in the studio inbox. We answer on the channel you chose.",
      "ml.toast.keptTitle": "Kept locally",
      "ml.toast.keptBody": "This letter lives in this browser only — nothing left your device.",
      "ml.save.failTitle": "Couldn't save",
      "ml.save.failBody": "Storage may be full or restricted in this browser.",
      "link.kind.project": "Project", "link.kind.document": "Document", "link.kind.app": "Opens in",
      "link.kind.note": "Note", "link.kind.pricing": "Pricing", "link.kind.system": "System",
      "link.project.sub": "In the portfolio",
      "link.system.title": "Open the system itself",
      "link.document.sub": "The project brief, in {files}",
      "link.app.sub": "An app in this system",
      "link.pricing.sub": "Published pricing — no quotes behind glass",
      "link.pricing.toastTitle": "Pricing", "link.pricing.toastBody": "Published on the site: {band}",
      "link.note.title": "Keep this as a note", "link.note.sub": "Saved to {notes}",
      "link.note.toastTitle": "Kept", "link.note.toastBody": "Saved to {notes}.",
      "link.sub.allShipped": "Every system we have shipped",
      "link.sub.handedOver": "The system we have handed over",
      "link.sub.briefKept": "Where the brief is kept",
      /* ================================================ Vault / Хранилище */
      "fv.home": "Home",
      "fv.rename": "Rename", "fv.delete": "Delete", "fv.edit": "Edit",
      "fv.newFolder": "New Folder", "fv.newFile": "New File",
      "fv.bring": "Bring a thing", "fv.bringDrop": "Let it go — it stays here",
      "fv.brought": "Brought in: {name}", "fv.broughtNote": "It lives in this browser and goes nowhere else.",
      "fv.noBring": "Incognito keeps nothing", "fv.noBringNote": "A thing brought here would have to be written down. Incognito writes nothing — so it was not taken in.",
      "fv.tooBig": "Too heavy: {name}", "fv.tooBigNote": "The limit is {limit}. Nothing was written.",
      "fv.thingSave": "Save to yourself", "fv.thingKind": "{kind} · {size}",
      "fv.thingOpen": "Open in Viewer",
      "fv.kindImage": "image", "fv.kindDoc": "document", "fv.kindSound": "sound", "fv.kindFilm": "film", "fv.kindThing": "file",
      "fv.unitB": "B", "fv.unitKB": "KB", "fv.unitMB": "MB",
      "vw.title": "Viewer", "vw.empty": "Nothing to look at yet. Bring a thing into the Vault \u2014 then open it here.",
      "vw.notShown": "This one is not shown here — it is kept whole. Save it to yourself and open it where it belongs.",
      "vw.gone": "The thing is gone", "vw.goneNote": "Its record points at nothing on the shelf. Nothing was changed.",
      "fv.newFolder.name": "New Folder", "fv.newFile.name": "Untitled.txt",
      "fv.empty": "Empty here. Whatever you bring in stays, and never leaves this browser: only you and your system.",
      "fv.confirm.folder": "Delete the folder \"{name}\"?",
      "fv.confirm.file": "Delete the file \"{name}\"?",
      "fv.confirm.nested": " Everything inside it will be deleted too.",
      "fv.toast.title": "Files", "fv.toast.deleted": "\"{name}\" deleted",
      "fv.save.failTitle": "Couldn't save",
      "fv.save.failBody": "Storage may be full or restricted in this browser.",
      /* Досье проекта — производный документ: его собирает само приложение,
         поэтому и его подписи переводятся ключами, а не остаются английскими
         внутри русского Хранилища. */
      /* ============================================== Whisper / Разговор */
      "mg.sampleNotice": "This is a sample conversation — nothing was sent anywhere. What you write stays in this browser.",
      "mg.noMessages": "No messages yet. Anything written here stays on this device.",
      "mg.day.today": "Today", "mg.day.yesterday": "Yesterday",
      "mg.mute": "Mute", "mg.unmute": "Unmute",
      "mg.delete": "Delete", "mg.deleteConvo": "Delete conversation",
      "mg.tab.direct": "Direct", "mg.tab.group": "Group",
      "mg.ph.name": "Name", "mg.ph.groupName": "Group name",
      "mg.ph.members": "Members, comma-separated", "mg.start": "Start",
      "mg.edited": "edited", "mg.seen": "Seen",
      "mg.react": "React", "mg.delMsg": "Delete message",
      "mg.selectConvo": "Select or start a conversation",
      "mg.contactTitle": "See everything about this contact",
      "mg.localNote": "local · stays in this browser",
      "mg.toLetter": "→ studio letter",
      "mg.toLetterTitle": "Turn this conversation into a real letter to the studio",
      "mg.attach": "Attach from {files}",
      "mg.ph.message": "Message {name}…", "mg.send": "Send",
      "mg.attachSearch": "Search {files} files", "mg.attachEmpty": "No files found",
      "mg.search": "Search conversations", "mg.new": "New conversation",
      "mg.listEmptySearch": "No conversations match \"{q}\"", "mg.listEmpty": "No conversations yet",
      "mg.confirm.delConvo": "Delete the conversation with \"{name}\"? This can't be undone.",
      "mg.save.failTitle": "Couldn't save",
      "mg.save.failBody": "Storage may be full or restricted in this browser.",
      "mg.letter.subject": "About: {name}",
      "mg.letter.head": "From a {messenger} conversation — {name}:",
      "mg.letter.me": "me:  ", "mg.letter.them": "them: ",
      /* ===================================== общее время + Scribble/Echoes/
         Real Project/Seek. «time.*» общие: одну и ту же «5 мин назад» пишут
         Письма, Записи и Эхо, и разными словами они писать её не должны. */
      "time.now": "Just now", "time.m": "{n}m ago", "time.h": "{n}h ago",
      "time.d": "{n}d ago", "time.w": "{n}w ago",
      "nt.untitled": "Untitled note",
      "nt.save.failTitle": "Couldn't save note",
      "nt.save.failTitleShort": "Couldn't save",
      "nt.save.failBody": "Storage may be full or restricted in this browser.",
      "nt.delete": "Delete note",
      "nt.ph.title": "Title", "nt.ph.body": "Start typing…",
      "nt.ph.search": "Search notes", "nt.new": "New note",
      "nt.emptyList": "Nothing found",
      "nt.empty": "No notes yet. Write one and it stays with you \u2014 not a line of it leaves.",
      "nt.newNote": "New note",
      "ec.restore": "Restore",
      "ec.silenceTitle": "Delete forever — cannot be undone", "ec.silenceAria": "Delete forever",
      "ec.appRemoved": "Removed from desktop — never deleted",
      "ec.empty.title": "Quiet in here",
      "ec.empty.sub": "Everything you clear off the desk settles here first. Nothing disappears until you say so. Drag anything onto {echoes} and it lands here.",
      "ec.count.one": "{n} echo", "ec.count.many": "{n} echoes",
      "ec.apps.one": "{n} hidden app", "ec.apps.many": "{n} hidden apps",
      "ec.silenceAll": "Silence all",
      "ec.confirm.one": "Silence this echo forever? This cannot be undone.",
      "ec.confirm.all": "Silence all {n} echoes forever? This cannot be undone.",
      "ec.toast.restoredTitle": "Note restored", "ec.toast.restoredBody": "It's back where it was.",
      "pj.empty": "No project is available to open yet.",
      "pj.tag": "Real client project · Confidential",
      "pj.back": "← {portfolio}", "pj.fullscreen": "Open full screen ↗",
      "pj.start": "Start your project",
      "pj.more": "About this project",
      "pj.asDelivered": "the interface as delivered, in the client’s own language",
      "pj.goal": "Built to achieve {goal}",
      "pj.delivered": "Delivered",
      "pj.langNote": "Shown in {langs} — the languages this client works in. Systems are built in the language of the people using them, not of the people building them.",
      "pj.lang.et": "Estonian", "pj.lang.ru": "Russian", "pj.lang.en": "English",
      "pj.langJoin": " and ",
      "sk.kicker.app": "App", "sk.kicker.note": "Note", "sk.kicker.mail": "Mail",
      "sk.kicker.file": "File", "sk.kicker.message": "Message",
      "sk.ph": "Search everything",
      "sk.suggested": "Suggested", "sk.recent": "Recent",
      "sk.count.one": "{n} result", "sk.count.many": "{n} results",
      "sk.none": "Nothing matches “{q}”",
      "sk.noneSub": "Searched apps, notes, mail, files and messages.",
      /* Засеянные записи Эха и заметка-дверь в журнал: голос студии, а не
         посетителя. Пишутся один раз на язык того, кто открыл систему первым,
         и дальше живут как его данные — обратно перевод не заходит. */
      "ec.seed.0": "Nothing you delete here is destroyed. It waits, gets quieter, and stays restorable. That was a decision, not an accident — most systems ask you to be certain at the worst possible moment.",
      "ec.seed.1": "If you are reading this, you deleted something and then went looking for it. That instinct is the reason this app exists.",
      "ec.seed.2": "Every app on this desktop was built by the same two hands that build the systems we sell. Nothing here is a template. You can check: open the portfolio and use the real one.",
      "ec.seed.3": "aug 2026 — the word 'applications' was removed from the landing page. It rested a while in a place much like this one, then we understood: the light under the door says it better with no letters at all.",
      "ec.seed.4": "10 aug 2026 — the first letter truly left this system and reached the studio's inbox. The chain behind the form had been broken in three places, and everything had LOOKED fine. Since that day: a thing exists when it is observed working.",
      "nt.journalNote": "This desktop keeps a journal of its own building — open {terminal} and type `log`. The longer entries live in {files} → Journal.\n\nEvery entry is true.\n\n(This note is yours now: edit it, unpin it, or delete it — it will wait in {echoes}, like everything here.)",
      "set.unit.mb": "MB", "set.unit.kb": "KB"
    },
    ru: {
      "dock.hint": "⌘K — открыть приложение",
      "cc.title": "Центр управления",
      "cc.sound": "Звук", "cc.dnd": "Не беспокоить", "cc.autohide": "Приглушать док",
      "cc.motion": "Турбо", "cc.transparency": "Меньше прозрачности",
      "cc.volume": "Громкость", "cc.brightness": "Яркость", "cc.language": "Язык",
      "cc.fullscreen": "\u0412\u043e \u0432\u0435\u0441\u044c \u044d\u043a\u0440\u0430\u043d", "cc.wallpaper": "Обои", "cc.controls": "Кнопки окон", "cc.controls.left": "Слева", "cc.controls.right": "Справа", "cc.appearance": "Оформление",
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
      "tip.portfolio": "Обе клиентские системы в «Избранных проектах» приложения {build} настоящие — и одна открывается прямо здесь.",
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
      "note.invite": "Оставишь заметку?",
      "note.inviteAria": "Оставить заметку здесь",
      "note.minimize": "Вернуть на стол",
      "note.maximize": "Открыть на весь экран",
      "note.body": "Тело заметки",
      "note.bodyPlaceholder": "Остальное — только здесь",
      "note.more": "В этой заметке есть продолжение",
      "note.due.today": "сегодня", "note.due.tomorrow": "завтра",
      "note.due.late": "просрочено", "note.due.on": "к {date}",
      "tip.notefull": "Enter в первой строке заметки открывает её на весь экран — тело пишется только там.",
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
            "aria.notifications": "Уведомления", "aria.appSeq": "Открытые окна",
      "aria.minimizeAll": "sys.baby OS — убрать со стола: свернуть все окна",
      "aria.tip": "Показать подсказку", "cc.tip": "Показать подсказку",
      "aria.turbo": "Турбо — отдать все кадры работе", "aria.cc": "Центр управления",
      "aria.langs": "Язык", "lang.partial": "витрина говорит, система пока нет",
      "desk.allMinimized": "Стол очищен", "desk.allMinimizedSub": "Окна ждут — нажмите значок, чтобы вернуть",
      "fs.no": "Этот браузер оставляет свою рамку", "fs.noSub": "Полного экрана он не даёт — Safari на iPhone разрешает его только видео",
      "aria.icons": "Значки рабочего стола", "aria.notes": "Заметки на столе",
      "aria.dock": "Док", "aria.fab": "Быстрые действия", "aria.cmdk": "Командная палитра", "aria.close": "Закрыть",
      "cmdk.placeholder": "Поиск приложений и действий…",
      "net.gone": "Интернета нет", "net.nothingChanged": "Ничего не изменилось. Всё написанное здесь, потому что оно всегда было здесь. Сеть нужна только Браузеру — чужие страницы не наши, чтобы их хранить.", "net.stillHere": "Сети нет — система на месте", "cc.connection": "Соединение", "cc.online": "В сети", "cc.offline": "Не в сети",
      "cc.offlineLong": "Не в сети — нет подключения",
      "cc.battery": "Батарея", "cc.batteryNA": "Состояние батареи недоступно",
      "cc.charging": "Зарядка", "cc.onBattery": "От батареи",
      "cc.merge": "Объединить, а не заменить",
      "theme.dark": "Тёмное", "theme.light": "Светлое",
      "mood.studio": "Студия", "mood.aurora": "Аврора", "mood.sunset": "Закат", "mood.ocean": "Океан", "mood.mono": "Моно", "mood.daylight": "Дневной свет", "mood.therapy": "Светотерапия", "mood.feast": "Праздник", "mood.ember": "Угли", "menu.tidyDesk": "\u041f\u0440\u0438\u0431\u0440\u0430\u0442\u044c \u0441\u0442\u043e\u043b", "menu.bringThing": "\u041f\u0440\u0438\u043d\u0435\u0441\u0442\u0438 \u0432\u0435\u0449\u044c\u2026", "menu.hideFab": "\u0423\u0431\u0440\u0430\u0442\u044c \u044d\u0442\u0443 \u043a\u043d\u043e\u043f\u043a\u0443", "part.fab": "\u041a\u043d\u043e\u043f\u043a\u0430 \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439", "br.back": "\u041d\u0430\u0437\u0430\u0434", "br.fwd": "\u0412\u043f\u0435\u0440\u0451\u0434", "br.again": "\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c", "br.bookmark": "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443", "br.bookmarked": "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e", "br.openTab": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u043e\u0439", "br.placeholder": "\u0410\u0434\u0440\u0435\u0441 \u0438\u043b\u0438 \u0447\u0442\u043e \u043d\u0430\u0439\u0442\u0438", "br.frameTitle": "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430", "br.saved": "\u0421\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u043d\u043e\u0435", "br.recent": "\u041d\u0435\u0434\u0430\u0432\u043d\u0435\u0435", "br.empty.title": "\u041f\u043e\u043a\u0430 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u043e", "br.empty.sub": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u0412\u0432\u043e\u0434. \u041c\u043d\u043e\u0433\u0438\u0435 \u0441\u0430\u0439\u0442\u044b \u0437\u0430\u043f\u0440\u0435\u0449\u0430\u044e\u0442 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0441\u0435\u0431\u044f \u0432\u043d\u0443\u0442\u0440\u0438 \u0434\u0440\u0443\u0433\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u2014 \u0441\u0442\u0440\u0435\u043b\u043a\u0430 \u0441\u043f\u0440\u0430\u0432\u0430 \u0432\u0441\u0435\u0433\u0434\u0430 \u043e\u0442\u043a\u0440\u043e\u0435\u0442 \u0430\u0434\u0440\u0435\u0441 \u043d\u0430\u0441\u0442\u043e\u044f\u0449\u0435\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u043e\u0439.", "note.day.title": "\u042d\u0442\u043e\u0442 \u0434\u0435\u043d\u044c \u2014 \u0432\u0430\u0448", "note.day.body": "\u0414\u0430\u0442\u0430 \u0443\u0436\u0435 \u0437\u0430\u043f\u0438\u0441\u0430\u043d\u0430 \u2014 \u043f\u0438\u0448\u0438\u0442\u0435 \u0434\u0430\u043b\u044c\u0448\u0435, \u0447\u0442\u043e \u0432 \u044d\u0442\u043e\u0442 \u0434\u0435\u043d\u044c \u0431\u0443\u0434\u0435\u0442.", "lock.again": "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c", "lock.mismatch": "\u041f\u0430\u0440\u043e\u043b\u0438 \u043d\u0435 \u0441\u043e\u0432\u043f\u0430\u043b\u0438 \u2014 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0437\u0430\u043f\u0435\u0440\u0442\u043e.", "lock.done": "\u0417\u0430\u043f\u0435\u0440\u0442\u043e. \u0412\u0430\u0448\u0438 \u0441\u043b\u043e\u0432\u0430 \u0442\u0435\u043f\u0435\u0440\u044c \u0432 \u043a\u043e\u043d\u0432\u0435\u0440\u0442\u0430\u0445.", "lock.failed": "\u0417\u0430\u043f\u0435\u0440\u0435\u0442\u044c \u043d\u0435 \u0432\u044b\u0448\u043b\u043e \u2014 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u043e.", "lock.remove": "\u0421\u043d\u044f\u0442\u044c \u0437\u0430\u043c\u043e\u043a", "lock.removed": "\u0417\u0430\u043c\u043e\u043a \u0441\u043d\u044f\u0442. \u0421\u043b\u043e\u0432\u0430 \u0441\u043d\u043e\u0432\u0430 \u043b\u0435\u0436\u0430\u0442 \u043e\u0442\u043a\u0440\u044b\u0442\u043e.", "lock.warn": "\u041f\u0443\u0442\u0438 \u043d\u0430\u0437\u0430\u0434 \u043d\u0435\u0442: \u0435\u0441\u043b\u0438 \u0432\u044b \u0437\u0430\u0431\u0443\u0434\u0435\u0442\u0435 \u044d\u0442\u043e\u0442 \u043f\u0430\u0440\u043e\u043b\u044c, \u043d\u0430\u043f\u0438\u0441\u0430\u043d\u043d\u043e\u0435 \u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0431\u0443\u0434\u0435\u0442 \u043d\u0435\u043b\u044c\u0437\u044f. \u041a\u043e\u043f\u0438\u0438 \u043d\u0435\u0442 \u043d\u0438 \u043d\u0430 \u043e\u0434\u043d\u043e\u043c \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u2014 \u0440\u0430\u0434\u0438 \u044d\u0442\u043e\u0433\u043e \u0432\u0441\u0451 \u0438 \u0437\u0430\u0442\u0435\u044f\u043d\u043e.", "lock.ask": "\u041f\u0430\u0440\u043e\u043b\u044c", "lock.open": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c", "lock.locking": "\u0417\u0430\u043f\u0435\u0440\u0435\u0442\u044c", "lock.wrong": "\u042d\u0442\u043e\u0442 \u043f\u0430\u0440\u043e\u043b\u044c \u043d\u0435 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442.", "lock.locked": "\u0417\u0430\u043f\u0435\u0440\u0442\u043e", "lock.sub": "Всё, что здесь есть, — заметки, письма, разговоры, Хранилище и сама комната: обои, язык, имена. С этой стороны о вас не видно ничего.", "lock.title": "Запереть всё", "lock.insecure": "На этом адресе замок работать не может. Настоящую криптографию браузер даёт странице только по защищённому соединению (https). Откройте sys.baby по https — замок появится, и больше ничего не изменится.", "panel.lock": "Замок", "aria.lock": "Замок — диафрагма этой системы", "aria.turboOn": "Турбо включён — нажмите, чтобы вернуть кадры", "cc.turbo": "Турбо", "lock.state.none": "Не заперто", "lock.state.armed": "Заперто — открыто на этот сеанс", "lock.what": "Один пароль закрывает всю систему: каждую заметку, каждое письмо, каждый разговор, Хранилище и вид комнаты. На диске не остаётся ничего читаемого — даже имён того, что вы храните.", "lock.accounts": "Несколько аккаунтов? Один пароль открывает их все на этом устройстве. Замок стоит перед хранилищем, а не перед одним аккаунтом, — и пока он заперт, не видно даже, сколько у вас аккаунтов.", "lock.new": "Пароль", "lock.set": "Запереть всё", "lock.now": "Запереть сейчас", "lock.change": "Сменить пароль", "lock.changed": "Пароль сменён. Ничего не перешифровывалось — переклеен конверт с ключом.", "lock.old": "Текущий пароль", "lock.cipher": "Чем заперто", "lock.short": "Не короче четырёх знаков.", "lock.busy": "Считаю — эта задержка здесь нарочно.", "auth.lock.title": "Всё это можно закрыть одним словом", "auth.lock.body": "У sys.baby нет сервера. Написанное остаётся на этом устройстве — значит, никто не прочтёт его за вас и никто не прочтёт его вместо вас. Один поворот ключа — и вся система уходит в конверты: заметки, письма, разговоры, даже цвет ваших стен. Восстановления нет, потому что восстанавливать некому. Это можно сделать сейчас, а можно в любой другой день — диафрагма в верхней панели стоит там всегда.", "auth.lock.now": "Поставить сейчас", "auth.lock.later": "Потом, из верхней панели", "bk.title": "Копии", "bk.folder": "Папка", "bk.noFolder": "не выбрана", "bk.last": "Последняя копия", "bk.never": "ещё не было", "bk.sealed": "заперта", "bk.choose": "Выбрать папку", "bk.change": "Сменить папку", "bk.on": "Включена", "bk.off": "Выключена", "bk.saveNow": "Сохранить сейчас", "bk.exportNow": "Скачать копию файлом", "bk.err": "Ошибка:", "bk.what": "Система сама кладёт копию профиля в выбранную вами папку — каждый раз, когда что-то изменилось, и в тот миг, когда вы уходите со страницы. Хранятся три поколения: беда, замеченная на другой день, лечится только вчерашним снимком. Пока стоит замок, копия уходит в папку ЗАПЕРТОЙ и открывается тем же паролем.", "bk.needFolder": "Без настоящей папки синхронизация не включается. Копия, лежащая в том же браузере, что и оригинал, — не копия: одна чистка браузера унесёт обе.", "bk.unsupported": "Этот браузер не даёт странице писать в папку на устройстве, поэтому синхронизации здесь нет — и Совет не станет её изображать. Складывать копии в тот же браузер было бы просто и было бы ложью: копия, лежащая в том же браузере, что и оригинал, — не копия, потому что одна чистка браузера унесёт обе. Остаётся выгрузка файлом: кнопка ниже. На настольном Chrome или Edge синхронизация включится сама.", "bk.permission": "Браузер просит подтвердить доступ к папке. Нажмите «Сохранить сейчас» ещё раз и разрешите.", "panel.account": "Аккаунт", "aria.identity": "Аккаунт и уход", "acc.you": "Вы", "acc.guest": "гость на этой машине", "acc.name": "Имя в системе", "acc.nameSub": "Видно в верхней полосе и на том, что вы отправляете. Не короче двух знаков.", "acc.save": "Сохранить", "acc.saved": "Сохранено.", "acc.profile": "Профиль", "acc.switch": "Сменить", "acc.export": "Сначала выгрузить профиль", "acc.signout": "Выйти, мягко", "acc.leave": "Уйти сейчас", "acc.leaveSub": "Одно нажатие: сеанс закрыт, все кэши и служебные копии стёрты, адрес и заголовок этой записи истории подменены, вкладка пытается закрыться. Написанное остаётся на месте — и остаётся запертым, если замок стоит.", "acc.wipe": "Стереть всё и уйти", "acc.wipeSub": "То же самое плюс всё написанное: заметки, письма, разговоры, Хранилище, профили. На этом устройстве от вас не остаётся ничего. Отменить нельзя.", "acc.wipeAsk": "Нажмите ещё раз, чтобы стереть всё. Это не отменяется.", "acc.truth": "Чего страница не может, и Совет не станет это изображать: список посещений браузера — не её память, и ни один сайт не вправе его читать и стирать. Сайт, умеющий стереть себя из вашей истории, умеет стереть и всё остальное. Эта страница подменяет ту запись, до которой дотягивается, — «назад» сюда не приведёт, — и стирает всё своё. Если нужно, чтобы посещения не записывались вовсе, — приватное окно браузера; убрать уже записанное можно только в самом браузере.", "panel.time": "\u0412\u0440\u0435\u043c\u044f \u0438 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u044c", "aria.time": "\u0412\u0440\u0435\u043c\u044f \u0438 \u043a\u0430\u043b\u0435\u043d\u0434\u0430\u0440\u044c", "pl.prev": "\u041d\u0430\u0437\u0430\u0434", "pl.next": "\u0412\u043f\u0435\u0440\u0451\u0434", "pl.play": "\u0418\u0433\u0440\u0430\u0442\u044c", "pl.pause": "\u041f\u0430\u0443\u0437\u0430", "pl.seek": "\u041f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435", "pl.pick": "\u0423\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0430\u043f\u043a\u0443", "pl.count": "\u0414\u043e\u0440\u043e\u0436\u0435\u043a: {n}", "pl.brought": "\u041c\u0443\u0437\u044b\u043a\u0430", "pl.broughtN": "\u041f\u0440\u0438\u043d\u0435\u0441\u0435\u043d\u043e \u0434\u043e\u0440\u043e\u0436\u0435\u043a: {n}", "pl.none": "\u0412 \u044d\u0442\u043e\u0439 \u043f\u0430\u043f\u043a\u0435 \u043d\u0435\u0442 \u0437\u0432\u0443\u043a\u043e\u0432\u044b\u0445 \u0444\u0430\u0439\u043b\u043e\u0432", "pl.empty.title": "\u041c\u0443\u0437\u044b\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442", "pl.empty.sub": "\u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0441\u0430\u043c \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0430\u0448\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e. \u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u041e\u0414\u041d\u0423 \u043f\u0430\u043f\u043a\u0443 \u2014 \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, Music \u0438\u043b\u0438 Download. \u041a\u043e\u0440\u0435\u043d\u044c \u043f\u0430\u043c\u044f\u0442\u0438 Android \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u043d\u0435 \u0434\u0430\u0451\u0442: \u0435\u0441\u043b\u0438 \u043f\u0438\u0448\u0435\u0442 \u00abCan\u2019t use this folder\u00bb \u2014 \u0437\u0430\u0439\u0434\u0438\u0442\u0435 \u0432\u043d\u0443\u0442\u0440\u044c \u043f\u0430\u043f\u043a\u0438 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0435\u0451.", "br.blank": "\u041f\u0443\u0441\u0442\u043e?", "br.blank.go": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432\u043a\u043b\u0430\u0434\u043a\u043e\u0439", "br.shut.sub": "\u0412\u044b \u0441\u043a\u0430\u0437\u0430\u043b\u0438 \u0441\u0438\u0441\u0442\u0435\u043c\u0435, \u0447\u0442\u043e \u044d\u0442\u043e\u0442 \u0441\u0430\u0439\u0442 \u043d\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u0435\u0442 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0441\u0435\u0431\u044f \u0432\u043d\u0443\u0442\u0440\u0438 \u0434\u0440\u0443\u0433\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b. \u0422\u0435\u043f\u0435\u0440\u044c \u043e\u043d \u0441\u0440\u0430\u0437\u0443 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0432\u043a\u043b\u0430\u0434\u043a\u043e\u0439 \u2014 \u0438 \u044d\u0442\u043e \u043c\u043e\u0436\u043d\u043e \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c.", "br.shut.retry": "\u041f\u043e\u043f\u0440\u043e\u0431\u043e\u0432\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430 \u0437\u0434\u0435\u0441\u044c",
      /* ============================================================ Настройки */
      "set.tab.general": "Общее", "set.tab.appearance": "Оформление",
      "set.tab.sound": "Звук и фокус", "set.tab.desktop": "Док и рабочий стол",
      "set.tab.privacy": "Приватность", "set.tab.advanced": "Дополнительно", "set.tab.about": "О системе",
      "set.general.identity": "Ваше имя",
      "set.general.identitySub": "Этим именем к вам обращается вся система — верхняя панель, {mail}, {messenger}, везде.",
      "set.general.saved": "Сохранено",
      "set.general.language": "Язык",
      "set.general.languageSub": "Рабочий стол говорит по-английски, по-русски и по-эстонски",
      "set.general.note": "Открыть что угодно — ⌘K, переключить окна — W, все горячие клавиши — ?. Или док вдоль нижнего края.",
      "set.appearance.theme": "Тема",
      "set.appearance.themeSub": "В этом выпуске есть только тёмная тема. Светлая, которую половина приложений не соблюдает, выглядела бы поломкой, а выпустить поломанным хуже, чем не выпускать вовсе.",
      "set.appearance.themeDark": "ТЁМНАЯ",
      "set.appearance.mood": "Настроение обоев",
      "set.appearance.moodSub": "Перекрашивает фоновый пейзаж — всё остальное остаётся прежним",
      "set.appearance.moodNone": "Настроений нет",
      "set.appearance.brightness": "Яркость",
      "set.appearance.brightnessSub": "Приглушает весь рабочий стол — тот же ползунок, что в Центре управления",
      "set.appearance.fullscreenOn": "\u0417\u0430\u043d\u044f\u0442\u044c \u0432\u0435\u0441\u044c \u044d\u043a\u0440\u0430\u043d", "set.appearance.fullscreenOff": "\u0412\u0435\u0440\u043d\u0443\u0442\u044c \u044d\u043a\u0440\u0430\u043d", "set.appearance.fullscreen": "\u0412\u043e \u0432\u0435\u0441\u044c \u044d\u043a\u0440\u0430\u043d", "set.appearance.fullscreenSub": "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u0437\u0430\u043d\u0438\u043c\u0430\u0435\u0442 \u0432\u0435\u0441\u044c \u044d\u043a\u0440\u0430\u043d \u2014 \u0442\u043e\u0442 \u0436\u0435 \u043f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0430\u0442\u0435\u043b\u044c, \u0447\u0442\u043e \u0438 \u0432 \u0431\u044b\u0441\u0442\u0440\u043e\u0439 \u043f\u0430\u043d\u0435\u043b\u0438", "set.appearance.controls": "\u041a\u043d\u043e\u043f\u043a\u0438 \u043e\u043a\u043e\u043d", "set.appearance.controlsSub": "\u0421 \u043a\u0430\u043a\u043e\u0439 \u0441\u0442\u043e\u0440\u043e\u043d\u044b \u0441\u0442\u043e\u044f\u0442 \u0437\u0430\u043a\u0440\u044b\u0442\u044c, \u0441\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0438 \u0440\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u2014 \u0432 \u043a\u0430\u0436\u0434\u043e\u043c \u043e\u043a\u043d\u0435 \u0438 \u043d\u0430 \u043a\u0430\u0436\u0434\u043e\u0439 \u0437\u0430\u043c\u0435\u0442\u043a\u0435", "set.appearance.turbo": "Турбо",
      "set.appearance.turboSub": "Пропускает долгие анимации — всё происходит мгновенно",
      "set.appearance.transparency": "Меньше прозрачности",
      "set.appearance.transparencySub": "Плотные панели вместо стекла",
      "set.sound.system": "Системный звук",
      "set.sound.systemSub": "Звук уведомлений и другие короткие сигналы",
      "set.sound.volume": "Громкость",
      "set.sound.volumeSub": "Насколько громкий сигнал — отпустите ползунок, чтобы услышать",
      "set.sound.dnd": "Не беспокоить",
      "set.sound.dndSub": "Заглушает всплывающие сообщения и уведомления, пока вы не включите их обратно",
      "set.desktop.autohide": "Приглушение",
      "set.desktop.autohideSub": "Приглушает док в покое — с экрана он не уходит",
      "set.desktop.tidy": "Выровнять виджеты",
      "set.desktop.tidySub": "Возвращает виджеты рабочего стола на сетку по умолчанию",
      "set.desktop.tidyBtn": "Выровнять",
      "set.desktop.tidyDoneTitle": "Виджеты выровнены",
      "set.desktop.tidyDoneBody": "Вернулись на сетку по умолчанию.",
      "set.privacy.signedIn": "Вход выполнен как",
      "set.privacy.guest": "Гость — локальный профиль этого компьютера",
      "set.privacy.signOut": "Выйти",
      "set.privacy.signOutConfirm": "Выйти из sys.baby? Чтобы вернуться к данным этого аккаунта, придётся войти снова.",
      "set.privacy.profiles": "Локальные профили",
      "set.privacy.profilesSub": "У каждого аккаунта в этом браузере свои, полностью отдельные заметки, письма, файлы и сообщения",
      "set.privacy.profileDelete": "Удалить этот аккаунт",
      "set.privacy.profileDeleteConfirm": "Удалить аккаунт «{name}»? Его заметки, письма, файлы, сообщения и настройки будут навсегда удалены из этого браузера.",
      "set.privacy.addAccount": "+ Добавить аккаунт",
      "set.privacy.addPrompt": "Введите почту, чтобы создать аккаунт или перейти в него:",
      "set.privacy.emailBadTitle": "Неверная почта",
      "set.privacy.emailBadBody": "Введите полный адрес почты.",
      "set.privacy.storage": "Занято в браузере",
      "set.privacy.clear": "Удалить все локальные данные",
      "set.privacy.clearSub": "Удаляет всё, что этот браузер хранит для sys.baby",
      "set.privacy.clearBtn": "Удалить",
      "set.privacy.clearConfirm": "Удалить все локальные данные sys.baby? Заметки, письма, сообщения, файлы, сохранённые раскладки, история копирования и настройки будут навсегда удалены из этого браузера.",
      "set.privacy.clearedTitle": "Локальные данные удалены",
      "set.privacy.clearedBody": "Перезагрузите страницу, чтобы увидеть систему в исходном состоянии.",
      "set.privacy.clearFailTitle": "Не удалось удалить",
      "set.privacy.clearFailBody": "Хранилище может быть ограничено в этом браузере.",
      "set.privacy.leavesTitle": "Что покидает это устройство",
      "set.privacy.leavesBody": "Ничего. Нет аккаунта на сервере, нет синхронизации и нет ни одного запроса наружу: всё, что вы пишете, остаётся в этом браузере. Единственный способ вынести данные с устройства — экспорт ниже, и запускаете его вы сами.",
      "set.privacy.backupTitle": "Резервная копия",
      "set.privacy.backupBody": "Экспорт записывает данные этого аккаунта в файл JSON, который остаётся у вас. Импорт заменяет данные аккаунта выбранным файлом. Ничего никуда не загружается.",
      "set.privacy.export": "Экспортировать данные аккаунта",
      "set.privacy.import": "Импортировать резервную копию",
      "set.privacy.note": "Всё хранится локально, отдельно по аккаунтам, в этом браузере. Очистка данных браузера удаляет их окончательно.",
      "set.export.readyTitle": "Экспорт готов",
      "set.export.readyBody": "{count} ключей записано в файл на этом устройстве.",
      "set.export.failTitle": "Экспорт не удался",
      "set.export.failBody": "Файл не удалось создать в этом браузере.",
      "set.import.failTitle": "Импорт не удался",
      "set.import.unreadable": "Этот файл не удалось прочитать.",
      "set.import.notBackup": "Этот файл — не резервная копия sys.baby.",
      "set.import.newer": "Эта копия записана более новой версией.",
      "set.import.confirm": "Импортировать эту копию? Всё, что сейчас в аккаунте — заметки, письма, сообщения, файлы и настройки — будет заменено содержимым файла.",
      "set.save.failTitle": "Не удалось сохранить",
      "set.save.failBody": "Хранилище может быть переполнено или ограничено в этом браузере.",
      "set.advanced.diag": "Диагностика — состояние системы",
      "set.advanced.diagSub": "Живые FPS, память, хранилище и ошибки сессии",
      "set.advanced.diagBtn": "Открыть",
      "set.advanced.reset": "Сбросить оформление",
      "set.advanced.resetSub": "Только комната и её свет — остальное не трогается",
      "set.advanced.resetBtn": "Сбросить",
      "set.advanced.resetDoneTitle": "Оформление сброшено",
      "set.advanced.resetDoneBody": "Ваш стол снова в Studio, и свет вернулся вместе с ним.",
      "set.about.build": "Сборка",
      "set.about.apps": "Приложения",
      "set.about.appsValue": "{registered} зарегистрировано · {launchable} в доке",
      "set.about.appsNA": "реестр недоступен",
      "set.about.madeOf": "Из чего сделано",
      "set.about.madeOfValue": "HTML, CSS и обычный JavaScript — без фреймворка и сборки",
      "set.about.runsOn": "Где работает",
      "set.about.runsOnValue": "только в этом браузере — без серверной части, ничего не устанавливается",
      "set.about.data": "Ваши данные",
      "set.about.dataValue": "{count} локальных ключей",
      "set.about.network": "Сеть",
      "set.about.networkValue": "сама система — никаких: ни аналитики, ни слежения, ни обращений наружу. Страницы, открытые в Браузере, говорят со своими сайтами.",
      "set.about.languages": "Языки",
      "set.about.whatTitle": "Что это за рабочий стол",
      "set.about.whatBody": "Работающий ответ на один вопрос: каково это, когда рабочая программа принадлежит вам? Каждое приложение здесь настоящее — заметки хранятся, файлы двигаются, терминал отвечает — и всё это работает на вашем устройстве. Клиентские системы в разделе {portfolio} — та же мысль, собранная для реальных компаний.",
      "set.about.whoTitle": "Кто его делает",
      "set.about.whoBody": "Системная студия в Таллине. Рабочий стол, на который вы смотрите, написан теми же руками, что делают клиентские системы, — это доказательство работы, а не шаблон. Нажмите глиняную плитку в доке, чтобы начать свой проект.",
      "set.about.note": "Аккаунты здесь — локальные профили в этом браузере, а не сервер. Каждый аккаунт держит свои данные на этом устройстве, и ничего не уходит наружу, пока вы сами не сделаете экспорт.",
      "set.storage.measuring": "измеряю…",
      "set.storage.notExposed": "браузер не сообщает",
      "set.storage.unavailable": "недоступно",
      "set.storage.of": "{used} из {total}",

      /* ============================================================ Портфолио */
      "pf.intro": "Рабочее место, за которым делается наша клиентская работа, — и само по себе её пример. Этот рабочий стол, его приложения и его хранилище собраны нами и работают в вашем браузере без установки и без аккаунта. Ниже — сама работа, и одна из систем запущена прямо здесь: откройте и пользуйтесь.",
      "pf.live": "вживую",
      "pf.badge.conf": "Конфиденциально · анонимно",
      "pf.badge.public": "Открыто",
      "pf.sub.delivered": "Сделано",
      "pf.sub.goal": "Задача",
      "pf.sub.results": "Результат",
      "pf.results.firstHand": "Из первых рук: мы работали в этом деле до того, как построили систему.",
      "pf.results.clientReported": "По словам клиента.",
      "pf.results.sourceUnknown": "Источник не записан — спросите нас, откуда эта цифра.",
      "pf.results.withheld": "Не раскрывается по просьбе клиента — та же сдержанность распространяется и на ваш проект.",
      "pf.results.notDelivered": "Построено и ещё не передано. Измерение согласуем при передаче и опубликуем ту цифру, которую даст клиент, какой бы она ни была.",
      "pf.results.pending": "Измерение результата согласовано с клиентом и назначено. Опубликуем ту цифру, которую он даст, какой бы она ни была.",
      "pf.results.ownBuild": "Собственная разработка для частной стоматологической клиники — до внедрения мы её сознательно не довели. Выяснилось, что люди с тридцатилетним стажем письма заполняют карту от руки быстрее, чем печатают, и одним быстрым молодым человеком это не компенсируется: переносить рукописи за другую смену значит удваивать работу, а не убирать её. Вывод мы оплатили сами, и теперь он входит в первый вопрос каждому клиенту: кто конкретно будет вводить данные. Систему показываем по запросу, публичной демонстрации нет.",
      "pf.name.ownBuild": "Собственная разработка",
      "pf.name.ownBuildTitle": "Построено самой студией — стороннего заказчика, которого можно назвать, нет",
      "pf.open": "Открыть и попробовать эту систему →",
      "pf.onPremises": "Работает у клиента, а не как публичная демонстрация.",
      "pf.explore": "Посмотреть",
      "pf.brief": "Описание проекта",
      "pf.everything": "Всё об этом клиенте",
      "pf.name.withheld": "Связь · конфиденциально",
      "pf.name.withheldTitle": "Имя клиента не раскрывается по его просьбе",
      "pf.name.pending": "Имя · ждём разрешения",
      "pf.name.pendingTitle": "Разрешение назвать этого клиента ещё не запрашивалось",
      "pf.empty": "Здесь появится настоящая завершённая клиентская работа.",
      "pf.replay": "Проиграть рабочий день на этом столе",
      "pf.replaySub": "Демонстрация, а не запись — две минуты",
      "pf.cta": "Хотите такую же систему для своего дела?",
      "pf.ctaLink": "Начать проект →",
      "pf.tech.offline-first": "Работает офлайн",
      "pf.tech.zero-dependencies": "Без сторонних библиотек",
      "pf.tech.print-native-a4": "Печать A4 без доработок",
      "pf.tech.et-ru-bilingual": "ET / RU — два языка",
      "pf.tech.responsive-web": "Адаптивный веб",
      "pf.tech.runs-entirely-in-the-browser": "Целиком в браузере",
      "pf.tech.no-server-no-account": "Без сервера и без аккаунта",
      "pf.tech.print-native-pdf": "Печать в PDF без доработок",
      "pf.tech.sepa-payment-qr": "QR для оплаты SEPA",
      "pf.tech.e-signature": "Электронная подпись",
      /* =============================================== Письма и связанные ссылки */
      "ml.folder.inbox": "Входящие", "ml.folder.starred": "Избранное", "ml.folder.sent": "Отправленные",
      "ml.folder.drafts": "Черновики", "ml.folder.trash": "Корзина",
      "ml.empty.inbox": "Во входящих пусто. Ответы приходят сюда.",
      "ml.empty.starred": "Ничего не отмечено. Отметьте письмо, чтобы держать его под рукой.",
      "ml.empty.sent": "Пока ничего не отправлено.",
      "ml.empty.drafts": "Черновиков нет. Всё начатое ждёт здесь.",
      "ml.empty.trash": "Корзина пуста.",
      "ml.empty.search": "Ничего не найдено по запросу «{q}»",
      "ml.time.now": "Только что", "ml.time.m": "{n} мин назад", "ml.time.h": "{n} ч назад", "ml.time.d": "{n} дн назад",
      "ml.star": "Отметить", "ml.unstar": "Снять отметку",
      "ml.tag.delivered": "✓ доставлено", "ml.tag.local": "локальное",
      "ml.tag.studio": "в студию", "ml.tag.draft": "Черновик",
      "ml.noSubject": "(без темы)",
      "ml.connected": "Связано",
      "ml.connected.real": "Это письмо настоящее — и всё, на что оно ссылается, тоже.",
      "ml.connected.sample": "Это письмо — образец. Всё, на что оно ссылается, настоящее и открывается.",
      "ml.link.openNow": "Открыть сейчас",
      "ml.selectMessage": "Выберите письмо",
      "ml.contactTitle": "Посмотреть всё от этого адресата",
      "ml.meta.to": "Кому:", "ml.meta.from": "От:",
      "ml.act.restore": "Восстановить", "ml.act.purge": "Удалить навсегда",
      "ml.act.continue": "Продолжить", "ml.act.delete": "Удалить",
      "ml.act.reply": "Ответить", "ml.act.forward": "Переслать",
      "ml.act.toNote": "В {notes}", "ml.act.toNoteTitle": "Сохранить письмо заметкой в {notes}",
      "ml.delivery.ok": "Доставлено на {addr} — настоящее письмо, отправлено {when}.",
      "ml.delivery.okReply": "Доставлено на {addr} — настоящее письмо, отправлено {when}. Ответ просили по каналу {channel}.",
      "ml.delivery.local": "Локальное письмо — оно живёт в этом браузере и никуда не передавалось.",
      "ml.compose.from": "Новое письмо · от {addr}",
      "ml.compose.newMsgFrom": "Новое сообщение · от {addr}",
      "ml.compose.close": "Закрыть",
      "ml.compose.studio": "В студию", "ml.compose.local": "Локально",
      "ml.compose.studioNote": "уйдёт по-настоящему — его прочтёт человек",
      "ml.compose.localNote": "останется в этом браузере",
      "ml.compose.realDelivery": "настоящая доставка",
      "ml.compose.toPlaceholder": "Кому (можно просто имя — станет имя@sys.baby)",
      "ml.compose.subject": "Тема",
      "ml.compose.bodyStudio": "Что построим вместе?",
      "ml.compose.bodyLocal": "Напишите сообщение…",
      "ml.compose.howAnswer": "Как вам ответить?",
      "ml.compose.honestStudio": "«Отправить» шлёт настоящее письмо в почту студии — через тот же канал, что и форма заказа на сайте.",
      "ml.compose.honestLocal": "Локальные письма не покидают это устройство.",
      "ml.compose.sendStudio": "Отправить в студию", "ml.compose.sendLocal": "Отправить · локально",
      "ml.compose.sending": "Отправляю…",
      "ml.channel.email": "Почта", "ml.channel.phone": "Телефон", "ml.channel.telegram": "Telegram",
      "ml.channel.whatsapp": "WhatsApp", "ml.channel.signal": "Signal", "ml.channel.url": "Ссылка",
      "ml.channel.other": "Другое",
      "ml.ph.email": "you@example.com", "ml.ph.phone": "+372 …", "ml.ph.telegram": "@username",
      "ml.ph.whatsapp": "+372 …", "ml.ph.signal": "+372 … или имя пользователя", "ml.ph.url": "https://…",
      "ml.ph.other": "Где вас найти?",
      "ml.toolbar.compose": "Написать", "ml.toolbar.studio": "В студию",
      "ml.toolbar.studioTitle": "Настоящее письмо в настоящую почту",
      "ml.toolbar.search": "Поиск по письмам",
      "ml.toast.savedNoteTitle": "Сохранено в {notes}",
      "ml.toast.savedNoteBody": "Теперь это заметка — запись, с которой можно работать.",
      "ml.toast.mailTitle": "Письма", "ml.toast.trash": "Письмо перемещено в корзину",
      "ml.confirm.purge": "Удалить «{subject}» навсегда? Это не отменить.",
      "ml.thisMessage": "это письмо",
      "ml.status.relay": "Отправляю через канал студии…",
      "ml.status.emptyBody": "Сначала напишите что-нибудь — пустое письмо ничего не говорит.",
      "ml.toast.notDeliveredTitle": "Не доставлено",
      "ml.toast.notDeliveredBody": "Канал не отозвался. Письмо ждёт в черновиках.",
      "ml.fail.offline": "Вы не в сети.",
      "ml.fail.refused": "Почтовый канал отказал или не ответил.",
      "ml.toast.deliveredTitle": "Доставлено",
      "ml.toast.deliveredBody": "Настоящее письмо уже в почте студии. Ответим по выбранному вами каналу.",
      "ml.toast.keptTitle": "Осталось здесь",
      "ml.toast.keptBody": "Это письмо живёт только в этом браузере — ничего не покинуло ваше устройство.",
      "ml.save.failTitle": "Не удалось сохранить",
      "ml.save.failBody": "Хранилище может быть переполнено или ограничено в этом браузере.",
      "link.kind.project": "Проект", "link.kind.document": "Документ", "link.kind.app": "Откроется в",
      "link.kind.note": "Заметка", "link.kind.pricing": "Цены", "link.kind.system": "Система",
      "link.project.sub": "В портфолио",
      "link.system.title": "Открыть саму систему",
      "link.document.sub": "Описание проекта, в {files}",
      "link.app.sub": "Приложение этой системы",
      "link.pricing.sub": "Опубликованные цены — без смет за стеклом",
      "link.pricing.toastTitle": "Цены", "link.pricing.toastBody": "Опубликовано на сайте: {band}",
      "link.note.title": "Сохранить как заметку", "link.note.sub": "Сохранится в {notes}",
      "link.note.toastTitle": "Сохранено", "link.note.toastBody": "Сохранено в {notes}.",
      "link.sub.allShipped": "Все системы, которые мы сдали",
      "link.sub.handedOver": "Система, которую мы передали",
      "link.sub.briefKept": "Где лежит описание",
      /* ============================================================ Хранилище */
      "fv.home": "Начало",
      "fv.rename": "Переименовать", "fv.delete": "Удалить", "fv.edit": "Править",
      "fv.newFolder": "Новая папка", "fv.newFile": "Новый файл",
      "fv.bring": "Принести вещь", "fv.bringDrop": "Отпустите — она останется здесь",
      "fv.brought": "Принесено: {name}", "fv.broughtNote": "Вещь лежит в этом браузере и никуда не уходит.",
      "fv.noBring": "Инкогнито ничего не хранит", "fv.noBringNote": "Принесённую вещь пришлось бы записать. Инкогнито не пишет ничего — поэтому вещь не принята.",
      "fv.tooBig": "Слишком тяжёлая: {name}", "fv.tooBigNote": "Предел — {limit}. Ничего не записано.",
      "fv.thingSave": "Сохранить к себе", "fv.thingKind": "{kind} · {size}",
      "fv.thingOpen": "Открыть в Просмотре",
      "fv.kindImage": "картинка", "fv.kindDoc": "документ", "fv.kindSound": "звук", "fv.kindFilm": "видео", "fv.kindThing": "файл",
      "fv.unitB": "Б", "fv.unitKB": "КБ", "fv.unitMB": "МБ",
      "vw.title": "Просмотр", "vw.empty": "Пока смотреть нечего. Принеси вещь в Хранилище — и открой её здесь.",
      "vw.notShown": "Эту вещь здесь не показывают — она хранится целиком. Сохраните к себе и откройте там, где ей место.",
      "vw.gone": "Вещи больше нет", "vw.goneNote": "Запись о ней указывает в пустоту. Ничего не изменено.",
      "fv.newFolder.name": "Новая папка", "fv.newFile.name": "Без имени.txt",
      "fv.empty": "Здесь пусто. Что принесёшь — то и будет лежать, и никуда отсюда не уйдёт: только ты и твоя система.",
      "fv.confirm.folder": "Удалить папку «{name}»?",
      "fv.confirm.file": "Удалить файл «{name}»?",
      "fv.confirm.nested": " Всё, что внутри, будет удалено тоже.",
      "fv.toast.title": "Хранилище", "fv.toast.deleted": "«{name}» удалено",
      "fv.save.failTitle": "Не удалось сохранить",
      "fv.save.failBody": "Хранилище может быть переполнено или ограничено в этом браузере.",
      /* ============================================================= Разговор */
      "mg.sampleNotice": "Это образец переписки — ничего никуда не отправлялось. Всё, что вы напишете, остаётся в этом браузере.",
      "mg.noMessages": "Сообщений пока нет. Всё написанное здесь остаётся на этом устройстве.",
      "mg.day.today": "Сегодня", "mg.day.yesterday": "Вчера",
      "mg.mute": "Приглушить", "mg.unmute": "Вернуть звук",
      "mg.delete": "Удалить", "mg.deleteConvo": "Удалить переписку",
      "mg.tab.direct": "Личный", "mg.tab.group": "Групповой",
      "mg.ph.name": "Имя", "mg.ph.groupName": "Название группы",
      "mg.ph.members": "Участники, через запятую", "mg.start": "Начать",
      "mg.edited": "изменено", "mg.seen": "Прочитано",
      "mg.react": "Реакция", "mg.delMsg": "Удалить сообщение",
      "mg.selectConvo": "Выберите переписку или начните новую",
      "mg.contactTitle": "Посмотреть всё об этом собеседнике",
      "mg.localNote": "локально · остаётся в этом браузере",
      "mg.toLetter": "→ письмо в студию",
      "mg.toLetterTitle": "Превратить эту переписку в настоящее письмо студии",
      "mg.attach": "Прикрепить из {files}",
      "mg.ph.message": "Сообщение для {name}…", "mg.send": "Отправить",
      "mg.attachSearch": "Поиск по файлам ({files})", "mg.attachEmpty": "Файлы не найдены",
      "mg.search": "Поиск по перепискам", "mg.new": "Новая переписка",
      "mg.listEmptySearch": "Нет переписок по запросу «{q}»", "mg.listEmpty": "Переписок пока нет",
      "mg.confirm.delConvo": "Удалить переписку с «{name}»? Это не отменить.",
      "mg.save.failTitle": "Не удалось сохранить",
      "mg.save.failBody": "Хранилище может быть переполнено или ограничено в этом браузере.",
      "mg.letter.subject": "Про: {name}",
      "mg.letter.head": "Из переписки в {messenger} — {name}:",
      "mg.letter.me": "я:   ", "mg.letter.them": "они: ",
      /* ================== общее время + Записи / Эхо / Живая система / Поиск */
      "time.now": "Только что", "time.m": "{n} мин назад", "time.h": "{n} ч назад",
      "time.d": "{n} дн назад", "time.w": "{n} нед назад",
      "nt.untitled": "Заметка без названия",
      "nt.save.failTitle": "Не удалось сохранить заметку",
      "nt.save.failTitleShort": "Не удалось сохранить",
      "nt.save.failBody": "Хранилище может быть переполнено или ограничено в этом браузере.",
      "nt.delete": "Удалить заметку",
      "nt.ph.title": "Название", "nt.ph.body": "Начните писать…",
      "nt.ph.search": "Поиск по заметкам", "nt.new": "Новая заметка",
      "nt.emptyList": "Ничего не найдено",
      "nt.empty": "Заметок пока нет. Напишешь — останется у тебя: ни одна строка отсюда не уходит.",
      "nt.newNote": "Новая заметка",
      "ec.restore": "Вернуть",
      "ec.silenceTitle": "Удалить навсегда — это не отменить", "ec.silenceAria": "Удалить навсегда",
      "ec.appRemoved": "Убрано с рабочего стола — не удалено",
      "ec.empty.title": "Здесь пока тихо",
      "ec.empty.sub": "Всё, что ты уберёшь со стола, сначала осядет здесь. Ничего не исчезает, пока ты сам не скажешь. Перетащи что угодно на {echoes} — и оно окажется тут.",
      "ec.count.one": "Эхо: {n}", "ec.count.many": "Эхо: {n}",
      "ec.apps.one": "Скрытых приложений: {n}", "ec.apps.many": "Скрытых приложений: {n}",
      "ec.silenceAll": "Заглушить всё",
      "ec.confirm.one": "Заглушить это эхо навсегда? Это не отменить.",
      "ec.confirm.all": "Заглушить все эхо ({n}) навсегда? Это не отменить.",
      "ec.toast.restoredTitle": "Заметка возвращена", "ec.toast.restoredBody": "Она снова на месте.",
      "pj.empty": "Пока нет проекта, который можно открыть.",
      "pj.tag": "Настоящий клиентский проект · конфиденциально",
      "pj.back": "← {portfolio}", "pj.fullscreen": "Открыть во весь экран ↗",
      "pj.start": "Начать проект",
      "pj.more": "Об этом проекте",
      "pj.asDelivered": "интерфейс в том виде, в каком он сдан, на языке самого клиента",
      "pj.goal": "Построено ради того, чтобы {goal}",
      "pj.delivered": "Сделано",
      "pj.langNote": "Показано на языках: {langs} — на них работает этот клиент. Системы делаются на языке тех, кто ими пользуется, а не тех, кто их строит.",
      "pj.lang.et": "эстонский", "pj.lang.ru": "русский", "pj.lang.en": "английский",
      "pj.langJoin": " и ",
      "sk.kicker.app": "Приложение", "sk.kicker.note": "Заметка", "sk.kicker.mail": "Письмо",
      "sk.kicker.file": "Файл", "sk.kicker.message": "Сообщение",
      "sk.ph": "Искать везде",
      "sk.suggested": "Подсказки", "sk.recent": "Недавнее",
      "sk.count.one": "Найдено: {n}", "sk.count.many": "Найдено: {n}",
      "sk.none": "Ничего не найдено по запросу «{q}»",
      "sk.noneSub": "Искали в приложениях, заметках, письмах, файлах и сообщениях.",
      "ec.seed.0": "Ничто удалённое здесь не уничтожается. Оно ждёт, становится тише и остаётся восстановимым. Это было решение, а не случайность: большинство систем требуют уверенности в самый неподходящий момент.",
      "ec.seed.1": "Если вы это читаете, значит, вы что-то удалили и пошли это искать. Ради этого чувства приложение и существует.",
      "ec.seed.2": "Каждое приложение на этом столе сделано теми же двумя руками, что делают системы, которые мы продаём. Здесь нет шаблонов. Это можно проверить: откройте портфолио и поработайте с настоящей.",
      "ec.seed.3": "август 2026 — слово «приложения» убрали с главной страницы. Оно полежало в месте вроде этого, а потом мы поняли: свет под дверью говорит это лучше вообще без букв.",
      "ec.seed.4": "10 августа 2026 — первое письмо по-настоящему покинуло эту систему и дошло до почты студии. Цепочка за формой была порвана в трёх местах, и всё ВЫГЛЯДЕЛО исправным. С того дня: вещь существует, когда её видели работающей.",
      "nt.journalNote": "Этот рабочий стол ведёт журнал собственной сборки — откройте {terminal} и наберите `log`. Длинные записи лежат в {files} → Journal.\n\nКаждая запись правдива.\n\n(Эта заметка теперь ваша: правьте её, открепляйте или удаляйте — она подождёт в {echoes}, как и всё здесь.)",
      "set.unit.mb": "МБ", "set.unit.kb": "КБ"
    },
    ee: {
      "dock.hint": "⌘K avab rakenduse",
      "cc.title": "Juhtimiskeskus",
      "cc.sound": "Heli", "cc.dnd": "Mitte segada", "cc.autohide": "Tumenda dokk",
      "cc.motion": "Turbo", "cc.transparency": "Vähem läbipaistvust",
      "cc.volume": "Helitugevus", "cc.brightness": "Heledus", "cc.language": "Keel",
      "cc.fullscreen": "T\u00e4isekraan", "cc.wallpaper": "Taust", "cc.controls": "Akna nupud", "cc.controls.left": "Vasakul", "cc.controls.right": "Paremal", "cc.appearance": "Välimus",
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
      "tip.portfolio": "Mõlemad kliendisüsteemid rakenduse {build} valitud töödes on päris — ja üks neist avaneb siinsamas.",
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
      "note.invite": "Jätad märkme?",
      "note.inviteAria": "Jäta siia märge",
      "note.minimize": "Tagasi töölauale",
      "note.maximize": "Ava üle ekraani",
      "note.body": "Märkme sisu",
      "note.bodyPlaceholder": "Ülejäänu — ainult siin",
      "note.more": "Sellel märkmel on jätk",
      "note.due.today": "täna", "note.due.tomorrow": "homme",
      "note.due.late": "tähtaeg möödas", "note.due.on": "{date}-ks",
      "tip.notefull": "Enter märkme esimesel real avab selle üle ekraani — sisu kirjutatakse ainult seal.",
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
            "aria.notifications": "Teated", "aria.appSeq": "Avatud aknad",
      "aria.minimizeAll": "sys.baby OS — puhasta laud: ahenda kõik aknad",
      "aria.tip": "Näita vihjet", "cc.tip": "Näita vihjet",
      "aria.turbo": "Turbo — anna kõik kaadrid tööle", "aria.cc": "Juhtimiskeskus",
      "aria.langs": "Keel", "lang.partial": "vitriin räägib, süsteem veel mitte",
      "desk.allMinimized": "Laud on puhas", "desk.allMinimizedSub": "Aknad ootavad — puuduta ikooni, et tagasi tuua",
      "fs.no": "See brauser jätab oma raami", "fs.noSub": "Täisekraani ta ei anna — iPhone'i Safari lubab seda ainult videole",
      "aria.icons": "Töölaua ikoonid", "aria.notes": "Töölaua märkmed",
      "aria.dock": "Dokk", "aria.fab": "Kiirtoimingud", "aria.cmdk": "Käsupalett", "aria.close": "Sulge",
      "cmdk.placeholder": "Otsi rakendusi ja toiminguid…",
      "net.gone": "Internetti pole", "net.nothingChanged": "Midagi ei muutunud. Kõik kirjutatu on siin, sest see oli alati siin. Võrku vajab ainult Brauser — teiste lehed ei ole meie omad, et neid hoida.", "net.stillHere": "Võrku pole — süsteem on siin", "cc.connection": "Ühendus", "cc.online": "Võrgus", "cc.offline": "Võrguühenduseta",
      "cc.offlineLong": "Võrguühenduseta — võrku pole",
      "cc.battery": "Aku", "cc.batteryNA": "Aku olek pole saadaval",
      "cc.charging": "Laeb", "cc.onBattery": "Akutoitel",
      "cc.merge": "Liida, ära asenda",
      "theme.dark": "Tume", "theme.light": "Hele",
      "mood.studio": "Stuudio", "mood.aurora": "Virmalised", "mood.sunset": "Loojang", "mood.ocean": "Ookean", "mood.mono": "Mono", "mood.daylight": "Päevavalgus", "mood.therapy": "Valgusteraapia", "mood.feast": "Pidu", "mood.ember": "Hõõgus", "menu.tidyDesk": "Korista laud", "menu.bringThing": "Too asi\u2026", "menu.hideFab": "Eemalda see nupp", "part.fab": "Kiirtegevuste nupp", "br.back": "Tagasi", "br.fwd": "Edasi", "br.again": "V\u00e4rskenda", "br.bookmark": "Salvesta leht", "br.bookmarked": "Salvestatud", "br.openTab": "Ava p\u00e4ris kaardil", "br.placeholder": "Aadress v\u00f5i otsing", "br.frameTitle": "Leht", "br.saved": "Salvestatud", "br.recent": "Hiljutine", "br.empty.title": "Midagi pole veel avatud", "br.empty.sub": "Sisesta aadress ja vajuta Enter. Paljud saidid keelavad end teise lehe sees n\u00e4idata \u2014 parempoolne nool avab aadressi alati p\u00e4ris kaardil.", "note.day.title": "See p\u00e4ev on sinu", "note.day.body": "Kuup\u00e4ev on kirjas \u2014 kirjuta edasi, mis sel p\u00e4eval juhtub.", "lock.again": "Korda parooli", "lock.mismatch": "Paroolid ei kattu \u2014 midagi ei lukustatud.", "lock.done": "Lukus. Sinu s\u00f5nad on n\u00fc\u00fcd \u00fcmbrikes.", "lock.failed": "Lukustada ei \u00f5nnestunud \u2014 midagi ei muudetud.", "lock.remove": "Eemalda lukk", "lock.removed": "Lukk on eemaldatud. S\u00f5nad on taas lahti.", "lock.warn": "Tagasiteed pole: kui unustad selle parooli, ei saa kirjutatut taastada. Koopiat pole \u00fchelgi serveril \u2014 selle nimel k\u00f5ik ongi.", "lock.ask": "Parool", "lock.open": "Ava", "lock.locking": "Lukusta", "lock.wrong": "See parool ei ava.", "lock.locked": "Lukus", "lock.sub": "Kõik, mis siin on — märkmed, kirjad, vestlused, Hoidla ja tuba ise: taust, keel, nimed. Siitpoolt ei ole sinust näha midagi.", "lock.title": "Lukusta kõik", "lock.insecure": "Sellel aadressil lukk ei tööta. Päris krüptograafia annab brauser lehele ainult turvalise ühenduse (https) kaudu. Ava sys.baby üle https-i — lukk ilmub ja midagi muud ei muutu.", "panel.lock": "Lukk", "aria.lock": "Lukk — selle süsteemi ava", "aria.turboOn": "Turbo on sees — puuduta, et kaadrid tagasi anda", "cc.turbo": "Turbo", "lock.state.none": "Ei ole lukus", "lock.state.armed": "Lukus — avatud selleks seansiks", "lock.what": "Üks parool sulgeb kogu süsteemi: iga märkme, iga kirja, iga vestluse, Hoidla ja toa välimuse. Kettale ei jää midagi loetavat — isegi mitte hoitavate asjade nimesid.", "lock.accounts": "Mitu kontot? Üks parool avab need kõik selles seadmes. Lukk seisab hoidla ees, mitte ühe konto ees — ja kuni ta on kinni, ei paista isegi see, mitu kontot sul on.", "lock.new": "Parool", "lock.set": "Lukusta kõik", "lock.now": "Lukusta kohe", "lock.change": "Muuda parooli", "lock.changed": "Parool on muudetud. Midagi ei krüpteeritud uuesti — vahetati vaid võtit hoidev ümbrik.", "lock.old": "Praegune parool", "lock.cipher": "Millega on suletud", "lock.short": "Vähemalt neli märki.", "lock.busy": "Arvutan — see viivitus on siin meelega.", "auth.lock.title": "Kõik selle saab sulgeda ühe sõnaga", "auth.lock.body": "sys.baby'l ei ole serverit. Kirjutatu jääb sellesse seadmesse — see tähendab, et keegi ei loe seda sinu eest ega sinu asemel. Üks võtmekeeramine ja kogu süsteem läheb ümbrikesse: märkmed, kirjad, vestlused, isegi sinu seinte värv. Taastamist ei ole, sest ei ole kelleltki taastada. Seda saab teha kohe või ükskõik millisel hilisemal päeval — ava ülaribal on alati olemas.", "auth.lock.now": "Sea kohe", "auth.lock.later": "Hiljem, ülaribalt", "bk.title": "Koopiad", "bk.folder": "Kaust", "bk.noFolder": "pole valitud", "bk.last": "Viimane koopia", "bk.never": "veel pole", "bk.sealed": "lukus", "bk.choose": "Vali kaust", "bk.change": "Vaheta kausta", "bk.on": "Sees", "bk.off": "Väljas", "bk.saveNow": "Salvesta kohe", "bk.exportNow": "Laadi koopia failina alla", "bk.err": "Viga:", "bk.what": "Süsteem paneb sinu profiili koopia sinu valitud kausta — iga kord, kui midagi muutus, ja sel hetkel, kui lehelt lahkud. Hoitakse kolme põlvkonda: päev hiljem märgatud häda saab parandada ainult eilse koopiaga. Kui lukk on peal, läheb koopia kausta LUKUSTATULT ja avaneb sama parooliga.", "bk.needFolder": "Ilma päris kaustata sünkroonimine sisse ei lülitu. Koopia, mis elab samas brauseris kui originaal, ei ole koopia: üks brauseri puhastus viib mõlemad.", "bk.unsupported": "See brauser ei luba lehel seadme kausta kirjutada, seega sünkroonimist siin ei ole — ja nõukogu seda teesklema ei hakka. Koopiate panek samasse brauserisse oleks lihtne ja oleks vale: koopia, mis elab samas brauseris kui originaal, ei ole koopia, sest üks brauseri puhastus viib mõlemad. Jääb fail, mille laadid ise alla nupuga allpool. Töölaua Chrome'is või Edge'is lülitub sünkroonimine ise sisse.", "bk.permission": "Brauser palub kausta juurdepääsu kinnitada. Vajuta «Salvesta kohe» veel kord ja luba.", "panel.account": "Konto", "aria.identity": "Konto ja lahkumine", "acc.you": "Sina oled", "acc.guest": "külaline selles masinas", "acc.name": "Nimi süsteemis", "acc.nameSub": "Näha ülaribal ja sellel, mida saadad. Vähemalt kaks märki.", "acc.save": "Salvesta", "acc.saved": "Salvestatud.", "acc.profile": "Profiil", "acc.switch": "Vaheta", "acc.export": "Ekspordi enne profiil", "acc.signout": "Logi välja, pehmelt", "acc.leave": "Lahku kohe", "acc.leaveSub": "Üks puudutus: seanss suletakse, kõik vahemälud ja teeninduskoopiad kustutatakse, selle ajalookirje aadress ja pealkiri asendatakse ning kaart üritab sulguda. Kirjutatu jääb paigale — ja jääb lukku, kui lukk on peal.", "acc.wipe": "Kustuta kõik ja lahku", "acc.wipeSub": "Kõik eelnev pluss kõik kirjutatu: märkmed, kirjad, vestlused, Hoidla, profiilid. Selles seadmes ei jää sinust midagi. Tagasi ei saa.", "acc.wipeAsk": "Vajuta veel kord, et kõik kustutada. Seda ei saa tagasi võtta.", "acc.truth": "Mida leht ei saa teha ja mida nõukogu teesklema ei hakka: brauseri külastuste loend ei ole selle lehe mälu ja ükski sait ei tohi seda lugeda ega kustutada. Sait, mis oskaks end sinu ajaloost kustutada, oskaks kustutada ka kõike muud. See leht asendab kirje, milleni ta ulatub — «tagasi» siia ei too — ja kustutab kõik omast. Kui on vaja, et külastusi üldse ei salvestataks, kasuta privaatakent; juba salvestatu saab eemaldada ainult brauseris endas.", "panel.time": "Aeg ja kalender", "aria.time": "Aeg ja kalender", "pl.prev": "Eelmine", "pl.next": "J\u00e4rgmine", "pl.play": "Esita", "pl.pause": "Paus", "pl.seek": "Asukoht", "pl.pick": "Vali kaust", "pl.count": "Lugusid: {n}", "pl.brought": "Muusika", "pl.broughtN": "Toodud lugusid: {n}", "pl.none": "Selles kaustas pole helifaile", "pl.empty.title": "Muusikat veel pole", "pl.empty.sub": "Brauser ei saa ise sinu seadet l\u00e4bi vaadata. Vali \u00dcKS kaust \u2014 n\u00e4iteks Music v\u00f5i Download. Androidi m\u00e4lu juurt valida ei saa: kui \u00fctleb \u201cCan\u2019t use this folder\u201d, mine kausta sisse ja vali see.", "br.blank": "T\u00fchi?", "br.blank.go": "Ava kaardil", "br.shut.sub": "Sa \u00fctlesid s\u00fcsteemile, et see sait ei luba end teise lehe sees n\u00e4idata. Nutu avaneb ta alati p\u00e4ris kaardil \u2014 ja selle saab tagasi v\u00f5tta.", "br.shut.retry": "Proovi siin uuesti",
      /* ============================================================== Seaded
         Обращение к посетителю — teie (мн. вежливое), как на лендинге. */
      "set.tab.general": "Üldine", "set.tab.appearance": "Välimus",
      "set.tab.sound": "Heli ja fookus", "set.tab.desktop": "Dokk ja töölaud",
      "set.tab.privacy": "Privaatsus", "set.tab.advanced": "Lisavalikud", "set.tab.about": "Teave",
      "set.general.identity": "Teie nimi",
      "set.general.identitySub": "Selle nimega pöördub teie poole kogu süsteem — ülariba, {mail}, {messenger}, kõikjal.",
      "set.general.saved": "Salvestatud",
      "set.general.language": "Keel",
      "set.general.languageSub": "Töölaud räägib inglise, vene ja eesti keelt",
      "set.general.note": "Avage ükskõik mis ⌘K-ga, vahetage aknaid W-ga, kõik kiirklahvid näitab ? — või kasutage alumise serva dokki.",
      "set.appearance.theme": "Teema",
      "set.appearance.themeSub": "See väljalase tuleb ainult tumeda teemaga. Hele teema, mida pooled rakendused ei järgi, näeks katkine välja, ja katkisena välja anda on halvem kui üldse mitte anda.",
      "set.appearance.themeDark": "TUME",
      "set.appearance.mood": "Tausta meeleolu",
      "set.appearance.moodSub": "Värvib ümber taustamaastiku — kõik muu jääb samaks",
      "set.appearance.moodNone": "Meeleolusid pole saadaval",
      "set.appearance.brightness": "Heledus",
      "set.appearance.brightnessSub": "Tumendab kogu töölauda — sama liugur mis juhtimiskeskuses",
      "set.appearance.fullscreenOn": "V\u00f5ta kogu ekraan", "set.appearance.fullscreenOff": "Anna ekraan tagasi", "set.appearance.fullscreen": "T\u00e4isekraan", "set.appearance.fullscreenSub": "S\u00fcsteem v\u00f5tab kogu ekraani \u2014 sama l\u00fcliti mis kiirpaneelis", "set.appearance.controls": "Akna nupud", "set.appearance.controlsSub": "Kummal pool on sulge, peida ja suurenda \u2014 igas aknas ja igal m\u00e4rkmel", "set.appearance.turbo": "Turbo",
      "set.appearance.turboSub": "Jätab pikad animatsioonid vahele — kõik juhtub kohe",
      "set.appearance.transparency": "Vähenda läbipaistvust",
      "set.appearance.transparencySub": "Klaasi asemel läbipaistmatud paneelid",
      "set.sound.system": "Süsteemi heli",
      "set.sound.systemSub": "Teavituste helin ja muud lühikesed helid",
      "set.sound.volume": "Helitugevus",
      "set.sound.volumeSub": "Kui vali on helin — laske liugur lahti, et seda kuulda",
      "set.sound.dnd": "Mitte segada",
      "set.sound.dndSub": "Vaigistab teated ja teavitused, kuni selle uuesti välja lülitate",
      "set.desktop.autohide": "Tumendamine",
      "set.desktop.autohideSub": "Tumendab doki jõudeolekus — ekraanilt see ei kao",
      "set.desktop.tidy": "Korrasta vidinad",
      "set.desktop.tidySub": "Paneb töölaua vidinad tagasi vaikevõrgustikku",
      "set.desktop.tidyBtn": "Korrasta",
      "set.desktop.tidyDoneTitle": "Vidinad korrastatud",
      "set.desktop.tidyDoneBody": "Tagasi vaikevõrgustikus.",
      "set.privacy.signedIn": "Sisse logitud kui",
      "set.privacy.guest": "Külaline — selle arvuti kohalik profiil",
      "set.privacy.signOut": "Logi välja",
      "set.privacy.signOutConfirm": "Kas logida sys.baby-st välja? Selle konto andmeteni pääsemiseks tuleb uuesti sisse logida.",
      "set.privacy.profiles": "Kohalikud profiilid",
      "set.privacy.profilesSub": "Igal selle brauseri kontol on täiesti eraldi märkmed, kirjad, failid ja sõnumid",
      "set.privacy.profileDelete": "Kustuta see konto",
      "set.privacy.profileDeleteConfirm": "Kas kustutada konto „{name}“? Selle märkmed, kirjad, failid, sõnumid ja seaded eemaldatakse sellest brauserist jäädavalt.",
      "set.privacy.addAccount": "+ Lisa konto",
      "set.privacy.addPrompt": "Konto loomiseks või sinna liikumiseks logige sisse e-postiga:",
      "set.privacy.emailBadTitle": "Vigane e-post",
      "set.privacy.emailBadBody": "Sisestage täielik e-posti aadress.",
      "set.privacy.storage": "Kasutatud kohalik maht",
      "set.privacy.clear": "Kustuta kõik kohalikud andmed",
      "set.privacy.clearSub": "Eemaldab kõik, mida see brauser sys.baby jaoks hoiab",
      "set.privacy.clearBtn": "Kustuta",
      "set.privacy.clearConfirm": "Kas kustutada kõik kohalikud sys.baby andmed? Märkmed, kirjad, sõnumid, failid, salvestatud paigutused, lõikelaua ajalugu ja eelistused eemaldatakse sellest brauserist jäädavalt.",
      "set.privacy.clearedTitle": "Kohalikud andmed kustutatud",
      "set.privacy.clearedBody": "Laadige leht uuesti, et näha süsteemi vaikeseisus.",
      "set.privacy.clearFailTitle": "Kustutamine ebaõnnestus",
      "set.privacy.clearFailBody": "Salvestusruum võib olla selles brauseris piiratud.",
      "set.privacy.leavesTitle": "Mis lahkub sellest seadmest",
      "set.privacy.leavesBody": "Mitte miski. Serveris pole kontot, pole sünkroonimist ega ühtegi päringut kellelegi: kõik, mida kirjutate, jääb siia brauserisse. Ainus viis andmetel siit lahkuda on allolev eksport, mille käivitate ise.",
      "set.privacy.backupTitle": "Varukoopia",
      "set.privacy.backupBody": "Eksport kirjutab selle konto andmed JSON-failiks, mis jääb teile. Import asendab selle konto andmed teie valitud failiga. Midagi ei laadita üles.",
      "set.privacy.export": "Ekspordi selle konto andmed",
      "set.privacy.import": "Impordi varukoopia fail",
      "set.privacy.note": "Kõike hoitakse kohapeal, konto kaupa, selles brauseris. Brauseri andmete kustutamine kustutab need lõplikult.",
      "set.export.readyTitle": "Eksport valmis",
      "set.export.readyBody": "{count} võtit kirjutatud faili sellesse seadmesse.",
      "set.export.failTitle": "Eksport ebaõnnestus",
      "set.export.failBody": "Faili ei õnnestunud selles brauseris luua.",
      "set.import.failTitle": "Import ebaõnnestus",
      "set.import.unreadable": "Seda faili ei õnnestunud lugeda.",
      "set.import.notBackup": "See fail ei ole sys.baby varukoopia.",
      "set.import.newer": "See varukoopia on kirjutatud uuema versiooniga.",
      "set.import.confirm": "Kas importida see varukoopia? Kõik, mis praegu selles kontos on — märkmed, kirjad, sõnumid, failid ja seaded — asendatakse faili sisuga.",
      "set.save.failTitle": "Salvestamine ebaõnnestus",
      "set.save.failBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      "set.advanced.diag": "Diagnostika — süsteemi seisund",
      "set.advanced.diagSub": "Reaalajas FPS, mälu, salvestusruum ja sessiooni vead",
      "set.advanced.diagBtn": "Ava",
      "set.advanced.reset": "Lähtesta välimus",
      "set.advanced.resetSub": "Ainult sinu tuba ja selle valgus — muud ei puudutata",
      "set.advanced.resetBtn": "Lähtesta",
      "set.advanced.resetDoneTitle": "Välimus lähtestatud",
      "set.advanced.resetDoneBody": "Sinu laud on taas Studios, ja valgus koos sellega.",
      "set.about.build": "Versioon",
      "set.about.apps": "Rakendused",
      "set.about.appsValue": "{registered} registreeritud · {launchable} dokis",
      "set.about.appsNA": "register pole saadaval",
      "set.about.madeOf": "Millest tehtud",
      "set.about.madeOfValue": "HTML, CSS ja puhas JavaScript — raamistikku ega ehitussammu pole",
      "set.about.runsOn": "Kus töötab",
      "set.about.runsOnValue": "ainult selles brauseris — serveripoolt pole, midagi pole installitud",
      "set.about.data": "Teie andmed",
      "set.about.dataValue": "{count} kohalikku võtit",
      "set.about.network": "Võrk",
      "set.about.networkValue": "süsteem ise ei tee ühtegi — ei analüütikat, ei jälgimist, ei kõnet koju. Brauseris avatud lehed suhtlevad oma saitidega.",
      "set.about.languages": "Keeled",
      "set.about.whatTitle": "Mis see töölaud on",
      "set.about.whatBody": "Töötav vastus ühele küsimusele: milline on tunne, kui teie äritarkvara kuulub teile? Iga rakendus siin on päris — märkmed püsivad, failid liiguvad, terminal vastab — ja iga sõna sellest töötab teie seadmes. Kliendisüsteemid jaotises {portfolio} on sama mõte, ehitatud päris ettevõtetele.",
      "set.about.whoTitle": "Kes seda ehitab",
      "set.about.whoBody": "Süsteemistuudio Tallinnas. Töölaua, mida te praegu vaatate, on kirjutanud samad käed, mis ehitavad kliendisüsteeme — see on meie töö tõend, mitte mall. Vajutage dokis savist plaati, et alustada oma projekti.",
      "set.about.note": "Kontod on siin selle brauseri kohalikud profiilid, mitte server. Iga konto hoiab oma andmeid selles seadmes ja miski ei lahku siit enne, kui te ise selle ekspordite.",
      "set.storage.measuring": "mõõdan…",
      "set.storage.notExposed": "brauser ei avalda",
      "set.storage.unavailable": "pole saadaval",
      "set.storage.of": "{used} / {total}",

      /* =========================================================== Portfoolio */
      "pf.intro": "Tööruum, mille taga sünnib meie päris kliienditöö — ja ühtlasi selle näide. See töölaud, selle rakendused ja salvestus on meie enda ehitatud ning töötavad teie brauseris ilma paigalduse ja kontota. Allpool on töö ise — ja üks süsteemidest töötab siinsamas: avage ja kasutage.",
      "pf.live": "elav",
      "pf.badge.conf": "Konfidentsiaalne · anonüümne",
      "pf.badge.public": "Avalik",
      "pf.sub.delivered": "Tehtud",
      "pf.sub.goal": "Eesmärk",
      "pf.sub.results": "Tulemus",
      "pf.results.firstHand": "Esimesest käest: töötasime selles valdkonnas enne, kui süsteemi ehitasime.",
      "pf.results.clientReported": "Kliendi öeldu põhjal.",
      "pf.results.sourceUnknown": "Allikat pole kirja pandud — küsige meilt, kust see arv tuli.",
      "pf.results.withheld": "Kliendi soovil avaldamata — sama hoolikus katab ka teie projekti.",
      "pf.results.notDelivered": "Ehitatud ja veel üle andmata. Mõõtmise lepime kokku üleandmisel ja avaldame selle arvu, mille klient annab, olgu see milline tahes.",
      "pf.results.pending": "Tulemuse mõõtmine on kliendiga kokku lepitud ja plaanis. Avaldame arvu, mille tema annab, olgu see milline tahes.",
      "pf.results.ownBuild": "Meie enda ehitatud lahendus erahambaravipraksisele — jätsime selle teadlikult kasutuselevõtuni viimata. Selgus, et inimesed, kes on kolmkümmend aastat käsitsi kirjutanud, täidavad kaardi käsitsi kiiremini kui klaviatuuril, ja üks kiire noor inimene seda ei korva: teise vahetuse käsikirjade ümbertrükkimine kahekordistab töö, mitte ei kaota seda. Selle järelduse eest maksime ise, ja nüüd on see esimene küsimus igale kliendile: kes täpselt hakkab andmeid sisestama. Süsteemi näitame soovi korral, avalikku demot ei ole.",
      "pf.name.ownBuild": "Meie enda ehitatud",
      "pf.name.ownBuildTitle": "Ehitatud stuudio enda poolt — välist tellijat, keda nimetada, ei ole",
      "pf.open": "Ava ja kasuta seda süsteemi →",
      "pf.onPremises": "Töötab kliendi juures, mitte majutatud demonstratsioonina.",
      "pf.explore": "Vaadake lähemalt",
      "pf.brief": "Projekti kirjeldus",
      "pf.everything": "Kõik selle kliendi kohta",
      "pf.name.withheld": "Suhtlus · konfidentsiaalne",
      "pf.name.withheldTitle": "Kliendi nimi jääb tema soovil avaldamata",
      "pf.name.pending": "Nimi · luba ootel",
      "pf.name.pendingTitle": "Luba seda klienti nimetada pole veel küsitud",
      "pf.empty": "Siia ilmub päris lõpetatud klienditöö.",
      "pf.replay": "Mängi see tööpäev töölaual uuesti läbi",
      "pf.replaySub": "Demonstratsioon, mitte salvestus — kaks minutit",
      "pf.cta": "Kas soovite sellist süsteemi oma ettevõttele?",
      "pf.ctaLink": "Alusta oma projekti →",
      "pf.tech.offline-first": "Töötab võrguühenduseta",
      "pf.tech.zero-dependencies": "Ilma väliste teekideta",
      "pf.tech.print-native-a4": "A4 trükk ilma kohendamata",
      "pf.tech.et-ru-bilingual": "ET / RU — kaks keelt",
      "pf.tech.responsive-web": "Kohanduv veeb",
      "pf.tech.runs-entirely-in-the-browser": "Täielikult brauseris",
      "pf.tech.no-server-no-account": "Serverita ja kontota",
      "pf.tech.print-native-pdf": "PDF-trükk ilma kohendamata",
      "pf.tech.sepa-payment-qr": "SEPA makse QR",
      "pf.tech.e-signature": "Digiallkiri",
      /* ================================================ Kirjad ja seotud lingid */
      "ml.folder.inbox": "Postkast", "ml.folder.starred": "Tähistatud", "ml.folder.sent": "Saadetud",
      "ml.folder.drafts": "Mustandid", "ml.folder.trash": "Prügikast",
      "ml.empty.inbox": "Postkastis pole midagi. Vastused jõuavad siia.",
      "ml.empty.starred": "Midagi pole tähistatud. Tähistage kiri, et see käepärast hoida.",
      "ml.empty.sent": "Veel pole midagi saadetud.",
      "ml.empty.drafts": "Mustandeid pole. Kõik alustatu ootab siin.",
      "ml.empty.trash": "Prügikast on tühi.",
      "ml.empty.search": "Otsingule „{q}“ ei vasta miski",
      "ml.time.now": "Just praegu", "ml.time.m": "{n} min tagasi", "ml.time.h": "{n} t tagasi", "ml.time.d": "{n} p tagasi",
      "ml.star": "Tähista", "ml.unstar": "Eemalda täht",
      "ml.tag.delivered": "✓ kohale toimetatud", "ml.tag.local": "kohalik",
      "ml.tag.studio": "stuudiole", "ml.tag.draft": "Mustand",
      "ml.noSubject": "(pealkirjata)",
      "ml.connected": "Seotud",
      "ml.connected.real": "See kiri on päris — ja päris on ka kõik, millele see viitab.",
      "ml.connected.sample": "See kiri on näidis. Kõik, millele see viitab, on päris ja avaneb.",
      "ml.link.openNow": "Ava kohe",
      "ml.selectMessage": "Valige kiri",
      "ml.contactTitle": "Vaadake kõike sellelt kontaktilt",
      "ml.meta.to": "Kellele:", "ml.meta.from": "Kellelt:",
      "ml.act.restore": "Taasta", "ml.act.purge": "Kustuta jäädavalt",
      "ml.act.continue": "Jätka kirjutamist", "ml.act.delete": "Kustuta",
      "ml.act.reply": "Vasta", "ml.act.forward": "Edasta",
      "ml.act.toNote": "Salvesta: {notes}", "ml.act.toNoteTitle": "Salvesta see kiri {notes} märkmena",
      "ml.delivery.ok": "Kohale toimetatud aadressile {addr} — päris e-kiri, saadetud {when}.",
      "ml.delivery.okReply": "Kohale toimetatud aadressile {addr} — päris e-kiri, saadetud {when}. Vastust palutakse kanalil {channel}.",
      "ml.delivery.local": "Kohalik kiri — see elab selles brauseris ja seda pole kuhugi edastatud.",
      "ml.compose.from": "Uus kiri · saatja {addr}",
      "ml.compose.newMsgFrom": "Uus sõnum · saatja {addr}",
      "ml.compose.close": "Sulge",
      "ml.compose.studio": "Stuudiole", "ml.compose.local": "Kohalik",
      "ml.compose.studioNote": "läheb päriselt teele — seda loeb inimene",
      "ml.compose.localNote": "jääb sellesse brauserisse",
      "ml.compose.realDelivery": "päris kohaletoimetamine",
      "ml.compose.toPlaceholder": "Kellele (nimi sobib — sellest saab nimi@sys.baby)",
      "ml.compose.subject": "Teema",
      "ml.compose.bodyStudio": "Mida me koos ehitame?",
      "ml.compose.bodyLocal": "Kirjutage oma sõnum…",
      "ml.compose.howAnswer": "Kuidas teile vastata?",
      "ml.compose.honestStudio": "Saatmine paneb päris e-kirja stuudio postkasti — sama kanali kaudu, mis saidi tellimisvorm.",
      "ml.compose.honestLocal": "Kohalikud kirjad ei lahku sellest seadmest.",
      "ml.compose.sendStudio": "Saada stuudiole", "ml.compose.sendLocal": "Saada · kohalik",
      "ml.compose.sending": "Saadan…",
      "ml.channel.email": "E-post", "ml.channel.phone": "Telefon", "ml.channel.telegram": "Telegram",
      "ml.channel.whatsapp": "WhatsApp", "ml.channel.signal": "Signal", "ml.channel.url": "Link",
      "ml.channel.other": "Muu",
      "ml.ph.email": "teie@näide.ee", "ml.ph.phone": "+372 …", "ml.ph.telegram": "@kasutajanimi",
      "ml.ph.whatsapp": "+372 …", "ml.ph.signal": "+372 … või kasutajanimi", "ml.ph.url": "https://…",
      "ml.ph.other": "Kust me teid leiame?",
      "ml.toolbar.compose": "Kirjuta", "ml.toolbar.studio": "Stuudiole",
      "ml.toolbar.studioTitle": "Päris kiri päris postkasti",
      "ml.toolbar.search": "Otsi kirjadest",
      "ml.toast.savedNoteTitle": "Salvestatud: {notes}",
      "ml.toast.savedNoteBody": "Kiri on nüüd märge — kirje, millega saab tööd teha.",
      "ml.toast.mailTitle": "Kirjad", "ml.toast.trash": "Kiri liikus prügikasti",
      "ml.confirm.purge": "Kas kustutada „{subject}“ jäädavalt? Seda ei saa tagasi võtta.",
      "ml.thisMessage": "see kiri",
      "ml.status.relay": "Saadan stuudio releele…",
      "ml.status.emptyBody": "Kirjutage kõigepealt midagi — tühi kiri ei ütle midagi.",
      "ml.toast.notDeliveredTitle": "Ei jõudnud kohale",
      "ml.toast.notDeliveredBody": "Releed ei õnnestunud tabada. Kiri ootab mustandites.",
      "ml.fail.offline": "Te olete võrguühenduseta.",
      "ml.fail.refused": "Kirjarelee keeldus või ei vastanud.",
      "ml.toast.deliveredTitle": "Kohale toimetatud",
      "ml.toast.deliveredBody": "Päris e-kiri on nüüd stuudio postkastis. Vastame kanalil, mille valisite.",
      "ml.toast.keptTitle": "Jäi kohapeale",
      "ml.toast.keptBody": "See kiri elab ainult selles brauseris — miski ei lahkunud teie seadmest.",
      "ml.save.failTitle": "Salvestamine ebaõnnestus",
      "ml.save.failBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      "link.kind.project": "Projekt", "link.kind.document": "Dokument", "link.kind.app": "Avaneb rakenduses",
      "link.kind.note": "Märge", "link.kind.pricing": "Hinnad", "link.kind.system": "Süsteem",
      "link.project.sub": "Portfoolios",
      "link.system.title": "Ava süsteem ise",
      "link.document.sub": "Projekti kirjeldus, {files}",
      "link.app.sub": "Selle süsteemi rakendus",
      "link.pricing.sub": "Avaldatud hinnad — pakkumisi klaasi taga pole",
      "link.pricing.toastTitle": "Hinnad", "link.pricing.toastBody": "Avaldatud saidil: {band}",
      "link.note.title": "Salvesta märkmena", "link.note.sub": "Salvestub: {notes}",
      "link.note.toastTitle": "Salvestatud", "link.note.toastBody": "Salvestatud: {notes}.",
      "link.sub.allShipped": "Kõik süsteemid, mille oleme üle andnud",
      "link.sub.handedOver": "Süsteem, mille oleme üle andnud",
      "link.sub.briefKept": "Kus kirjeldust hoitakse",
      /* =============================================================== Hoidla */
      "fv.home": "Algus",
      "fv.rename": "Nimeta ümber", "fv.delete": "Kustuta", "fv.edit": "Muuda",
      "fv.newFolder": "Uus kaust", "fv.newFile": "Uus fail",
      "fv.bring": "Too asi siia", "fv.bringDrop": "Lase lahti — see jääb siia",
      "fv.brought": "Toodud: {name}", "fv.broughtNote": "Asi on selles brauseris ega lähe kuhugi mujale.",
      "fv.noBring": "Inkognito ei hoia midagi", "fv.noBringNote": "Siia toodud asi tuleks kirja panna. Inkognito ei kirjuta midagi — seepärast asja vastu ei võetud.",
      "fv.tooBig": "Liiga raske: {name}", "fv.tooBigNote": "Piir on {limit}. Midagi ei kirjutatud.",
      "fv.thingSave": "Salvesta endale", "fv.thingKind": "{kind} · {size}",
      "fv.thingOpen": "Ava Vaates",
      "fv.kindImage": "pilt", "fv.kindDoc": "dokument", "fv.kindSound": "heli", "fv.kindFilm": "video", "fv.kindThing": "fail",
      "fv.unitB": "B", "fv.unitKB": "KB", "fv.unitMB": "MB",
      "vw.title": "Vaade", "vw.empty": "Vaadata pole veel midagi. Too asi Hoidlasse — ja ava see siin.",
      "vw.notShown": "Seda siin ei näidata — see hoitakse tervikuna. Salvesta endale ja ava seal, kus tema koht on.",
      "vw.gone": "Asja enam ei ole", "vw.goneNote": "Kirje osutab tühjusesse. Midagi ei muudetud.",
      "fv.newFolder.name": "Uus kaust", "fv.newFile.name": "Nimetu.txt",
      "fv.empty": "Siin on tühi. Mille sa siia tood, see jääb ega lahku siit kunagi: ainult sina ja sinu süsteem.",
      "fv.confirm.folder": "Kas kustutada kaust „{name}“?",
      "fv.confirm.file": "Kas kustutada fail „{name}“?",
      "fv.confirm.nested": " Kustutatakse ka kõik, mis selle sees on.",
      "fv.toast.title": "Hoidla", "fv.toast.deleted": "„{name}“ kustutatud",
      "fv.save.failTitle": "Salvestamine ebaõnnestus",
      "fv.save.failBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      /* =============================================================== Sosin */
      "mg.sampleNotice": "See on näidisvestlus — midagi pole kuhugi saadetud. Kõik, mida kirjutate, jääb sellesse brauserisse.",
      "mg.noMessages": "Sõnumeid veel pole. Kõik siia kirjutatu jääb sellesse seadmesse.",
      "mg.day.today": "Täna", "mg.day.yesterday": "Eile",
      "mg.mute": "Vaigista", "mg.unmute": "Taasta heli",
      "mg.delete": "Kustuta", "mg.deleteConvo": "Kustuta vestlus",
      "mg.tab.direct": "Otsevestlus", "mg.tab.group": "Grupp",
      "mg.ph.name": "Nimi", "mg.ph.groupName": "Grupi nimi",
      "mg.ph.members": "Liikmed, komadega eraldatult", "mg.start": "Alusta",
      "mg.edited": "muudetud", "mg.seen": "Loetud",
      "mg.react": "Reageeri", "mg.delMsg": "Kustuta sõnum",
      "mg.selectConvo": "Valige vestlus või alustage uut",
      "mg.contactTitle": "Vaadake kõike selle kontakti kohta",
      "mg.localNote": "kohalik · jääb sellesse brauserisse",
      "mg.toLetter": "→ kiri stuudiole",
      "mg.toLetterTitle": "Tee sellest vestlusest päris kiri stuudiole",
      "mg.attach": "Lisa fail: {files}",
      "mg.ph.message": "Sõnum: {name}…", "mg.send": "Saada",
      "mg.attachSearch": "Otsi faile ({files})", "mg.attachEmpty": "Faile ei leitud",
      "mg.search": "Otsi vestlustest", "mg.new": "Uus vestlus",
      "mg.listEmptySearch": "Otsingule „{q}“ ei vasta ükski vestlus", "mg.listEmpty": "Vestlusi veel pole",
      "mg.confirm.delConvo": "Kas kustutada vestlus kontaktiga „{name}“? Seda ei saa tagasi võtta.",
      "mg.save.failTitle": "Salvestamine ebaõnnestus",
      "mg.save.failBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      "mg.letter.subject": "Teemal: {name}",
      "mg.letter.head": "Vestlusest {messenger} — {name}:",
      "mg.letter.me": "mina: ", "mg.letter.them": "tema: ",
      /* ============== ühine aeg + Märkmed / Kajad / Elav süsteem / Otsing */
      "time.now": "Just praegu", "time.m": "{n} min tagasi", "time.h": "{n} t tagasi",
      "time.d": "{n} p tagasi", "time.w": "{n} n tagasi",
      "nt.untitled": "Pealkirjata märge",
      "nt.save.failTitle": "Märget ei õnnestunud salvestada",
      "nt.save.failTitleShort": "Salvestamine ebaõnnestus",
      "nt.save.failBody": "Salvestusruum võib olla täis või selles brauseris piiratud.",
      "nt.delete": "Kustuta märge",
      "nt.ph.title": "Pealkiri", "nt.ph.body": "Alustage kirjutamist…",
      "nt.ph.search": "Otsi märkmetest", "nt.new": "Uus märge",
      "nt.emptyList": "Midagi ei leitud",
      "nt.empty": "Märkmeid veel pole. Kirjuta — ja see jääb sinu juurde: ükski rida siit ei lahku.",
      "nt.newNote": "Uus märge",
      "ec.restore": "Taasta",
      "ec.silenceTitle": "Kustuta jäädavalt — seda ei saa tagasi võtta", "ec.silenceAria": "Kustuta jäädavalt",
      "ec.appRemoved": "Töölaualt eemaldatud — mitte kustutatud",
      "ec.empty.title": "Siin on vaikne",
      "ec.empty.sub": "Kõik, mille sa laualt ära koristad, settib kõigepealt siia. Miski ei kao enne, kui sa ise ütled. Lohista ükskõik mis {echoes} peale — ja see maandub siia.",
      "ec.count.one": "{n} kaja", "ec.count.many": "{n} kaja",
      "ec.apps.one": "{n} peidetud rakendus", "ec.apps.many": "{n} peidetud rakendust",
      "ec.silenceAll": "Vaigista kõik",
      "ec.confirm.one": "Kas vaigistada see kaja jäädavalt? Seda ei saa tagasi võtta.",
      "ec.confirm.all": "Kas vaigistada kõik {n} kaja jäädavalt? Seda ei saa tagasi võtta.",
      "ec.toast.restoredTitle": "Märge taastatud", "ec.toast.restoredBody": "See on tagasi seal, kus oli.",
      "pj.empty": "Praegu pole ühtegi projekti, mida avada.",
      "pj.tag": "Päris kliendiprojekt · konfidentsiaalne",
      "pj.back": "← {portfolio}", "pj.fullscreen": "Ava täisekraanil ↗",
      "pj.start": "Alusta oma projekti",
      "pj.more": "Sellest projektist",
      "pj.asDelivered": "liides sellisena, nagu see üle anti, kliendi enda keeles",
      "pj.goal": "Ehitatud selleks, et {goal}",
      "pj.delivered": "Tehtud",
      "pj.langNote": "Näidatud keeltes {langs} — nendes keeltes see klient töötab. Süsteemid ehitatakse nende keeles, kes neid kasutavad, mitte nende, kes neid ehitavad.",
      "pj.lang.et": "eesti", "pj.lang.ru": "vene", "pj.lang.en": "inglise",
      "pj.langJoin": " ja ",
      "sk.kicker.app": "Rakendus", "sk.kicker.note": "Märge", "sk.kicker.mail": "Kiri",
      "sk.kicker.file": "Fail", "sk.kicker.message": "Sõnum",
      "sk.ph": "Otsi kõikjalt",
      "sk.suggested": "Soovitused", "sk.recent": "Hiljutine",
      "sk.count.one": "{n} vaste", "sk.count.many": "{n} vastet",
      "sk.none": "Otsingule „{q}“ ei vasta miski",
      "sk.noneSub": "Otsisime rakendustest, märkmetest, kirjadest, failidest ja sõnumitest.",
      "ec.seed.0": "Miski, mille te siin kustutate, ei hävi. See ootab, jääb vaiksemaks ja on endiselt taastatav. See oli otsus, mitte juhus — enamik süsteeme nõuab kindlust kõige halvemal hetkel.",
      "ec.seed.1": "Kui te seda loete, siis kustutasite midagi ja läksite seda otsima. Just selle tunde pärast see rakendus olemas ongi.",
      "ec.seed.2": "Iga rakendus sellel töölaual on ehitatud samade kahe käega, mis ehitavad süsteeme, mida me müüme. Siin pole ühtegi malli. Seda saab kontrollida: avage portfoolio ja kasutage päris süsteemi.",
      "ec.seed.3": "august 2026 — sõna „rakendused“ eemaldati avalehelt. See puhkas mõnda aega just sellises kohas, ja siis saime aru: valgus ukse all ütleb selle paremini ilma ühegi täheta.",
      "ec.seed.4": "10. august 2026 — esimene kiri lahkus päriselt sellest süsteemist ja jõudis stuudio postkasti. Vormi taga olev ahel oli katki kolmest kohast ja kõik NÄIS korras. Sellest päevast: asi on olemas siis, kui teda on nähtud töötamas.",
      "nt.journalNote": "See töölaud peab oma ehitamise kohta päevikut — avage {terminal} ja kirjutage `log`. Pikemad sissekanded elavad {files} → Journal.\n\nIga sissekanne on tõsi.\n\n(See märge on nüüd teie oma: muutke seda, võtke kinnitus maha või kustutage — see ootab {echoes}, nagu kõik siin.)",
      "set.unit.mb": "MB", "set.unit.kb": "KB"
    }
  };
  /* ЯЗЫКИ СИСТЕМЫ. Порядок и вид — те же, что на витрине: моноширинные коды,
     а не флаги (D-041). Финский пока живёт только в витрине: у оболочки его
     строк нет, и система об этом ГОВОРИТ, а не притворяется — код помечен, и
     при выборе она честно остаётся на английском, пока витрина в окне build
     переходит на финский. Пометка исчезнет сама в тот день, когда появятся
     строки: она считается из таблицы, а не проставляется рукой. */
  /* Внутренний код языка и то, что видит человек, — разные вещи. Эстонский
     внутри проекта исторически «ee», но человеку показывается ET: это его
     настоящий код (ISO 639-1), и ровно так он написан на витрине. Показывать
     «EE» значило бы показывать код СТРАНЫ — та же ошибка, что флаг вместо
     языка, из-за которой и появилось решение D-041. */
  var LANGS = [
    { code: "ee", show: "ET", label: "Eesti" },
    { code: "en", show: "EN", label: "English" },
    { code: "ru", show: "RU", label: "Русский" },
    { code: "fi", show: "FI", label: "Suomi" }
  ];

  function lang() {
    var v = rawGet("sysbaby.i18n.lang") || "en";
    return LANGS.some(function (l) { return l.code === v; }) ? v : "en";
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
  /* Строка на ЗАДАННОМ языке, а не на текущем. Понадобилось экрану замка
     (D-164): язык системы теперь заперт, и до пароля он берёт язык у самого
     браузера. Отдельная дверь, а не второй словарь: словарь один. */
  window.sbTIn = function (code, key) {
    var L = STRINGS[code] || STRINGS.en;
    return (L && L[key]) || STRINGS.en[key] || key;
  };

  /* The document's own language, not just its visible text. A screen reader
     picks its voice from this and the browser hyphenates from it, so a page
     full of Russian still labelled lang="en" is read out in an English accent.
     Estonian's IETF tag is `et` — `ee` is this project's internal code for it
     and is not a language tag, so it is mapped rather than copied. */
  var DOC_LANG = { en: "en", ru: "ru", ee: "et" };

  /* Полоса языков: всё состояние видно сразу, переключение — одно нажатие. */
  function tr(k) { return window.sbT ? window.sbT(k) : k; }

  /* ── ЯЗЫК: ОДИН КОД, КОТОРЫЙ И ЕСТЬ КНОПКА (v47, вторая редакция) ────────
   *
   * Первая редакция показывала все четыре кода разом: ноль нажатий, чтобы
   * увидеть язык, одно — чтобы сменить. Основатель посмотрел на телефоне и
   * снял её одной фразой: столько места занимать нельзя, и часы из-за неё не
   * помещались в экран. Он прав, и вот почему: четыре кода — это состояние
   * ЧЕТЫРЁХ языков, а человеку нужно состояние ОДНОГО, своего. Остальные три
   * нужны ему один раз в жизни, при первой встрече.
   *
   * Поэтому здесь один код — тот, на котором система говорит сейчас. Он же и
   * кнопка: нажатие переводит на следующий язык, долгое нажатие раскрывает
   * все четыре, если нужен конкретный. Место — правый угол верхней панели,
   * рядом с часами; занимает он ширину двух букв.
   *
   * Почему понятно, что это язык, без слова «язык»: код набран моноширинным,
   * как коды языков на витрине (D-041 — коды, а не флаги, потому что флаг
   * обозначает страну), одет в ту же стеклянную плашку с волосяной рамкой,
   * что и остальные значки панели, — плашка и говорит «это можно нажать», —
   * и озвучен полностью для тех, кто читает экран голосом. Пунктир под кодом
   * тут стоял до v53 и был снят: на телефоне тонкая точечная линия под двумя
   * буквами читается как подчёркивание ОПЕЧАТКИ, а не как приглашение.
   */
  function nextLang(code) {
    var i = 0, k;
    for (k = 0; k < LANGS.length; k++) if (LANGS[k].code === code) i = k;
    return LANGS[(i + 1) % LANGS.length].code;
  }

  function closeLangMenu() {
    var m = doc.getElementById("sbLangMenu");
    if (m && m.parentNode) m.parentNode.removeChild(m);
    doc.removeEventListener("pointerdown", onOutsideLang, true);
  }
  function onOutsideLang(ev) {
    if (ev.target && ev.target.closest && ev.target.closest("#sbLangMenu, #sbLangs")) return;
    closeLangMenu();
  }

  function openLangMenu() {
    closeLangMenu();
    var host = doc.getElementById("sbLangs");
    if (!host) return;
    var cur = lang();
    var m = doc.createElement("div");
    m.id = "sbLangMenu";
    m.className = "tb-lang-menu";
    m.setAttribute("role", "menu");
    LANGS.forEach(function (l) {
      var partial = !STRINGS[l.code];
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "tb-lang-item" + (l.code === cur ? " is-active" : "") + (partial ? " is-partial" : "");
      b.setAttribute("data-lang", l.code);
      b.setAttribute("lang", l.code === "ee" ? "et" : l.code);
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", l.code === cur ? "true" : "false");
      b.innerHTML = '<span class="tb-lang-code">' + l.show + '</span><span class="tb-lang-name">' + l.label + '</span>';
      b.title = partial ? l.label + " — " + tr("lang.partial") : l.label;
      b.addEventListener("click", function () { closeLangMenu(); window.sbSetLang(l.code); });
      m.appendChild(b);
    });
    host.appendChild(m);
    setTimeout(function () { doc.addEventListener("pointerdown", onOutsideLang, true); }, 0);
  }
  window.sbOpenLangMenu = openLangMenu;
  window.sbCloseLangMenu = closeLangMenu;

  function paintLangs() {
    var host = doc.getElementById("sbLangs");
    if (!host) return;
    var cur = lang();
    var rec = LANGS.filter(function (l) { return l.code === cur; })[0] || LANGS[1];
    closeLangMenu();
    host.innerHTML = "";

    var b = doc.createElement("button");
    b.type = "button";
    b.className = "tb-lang-now" + (!STRINGS[cur] ? " is-partial" : "");
    b.id = "sbLangNow";
    b.setAttribute("data-lang", cur);
    b.setAttribute("lang", cur === "ee" ? "et" : cur);
    b.textContent = rec.show;
    b.title = tr("aria.langs") + ": " + rec.label;
    b.setAttribute("aria-label", tr("aria.langs") + ": " + rec.label);
    b.setAttribute("aria-haspopup", "menu");

    /* Короткое нажатие — следующий язык. Долгое — выбрать любой.
       Порог 420 мс: короче человек не успевает понять, что держит. */
    var holdTimer = null, held = false;
    var startHold = function () {
      held = false;
      holdTimer = setTimeout(function () { held = true; openLangMenu(); }, 420);
    };
    var endHold = function () { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
    b.addEventListener("pointerdown", startHold);
    b.addEventListener("pointerup", endHold);
    b.addEventListener("pointerleave", endHold);
    b.addEventListener("pointercancel", endHold);
    b.addEventListener("click", function () {
      if (held) { held = false; return; }
      window.sbSetLang(nextLang(lang()));
    });
    b.addEventListener("contextmenu", function (ev) { ev.preventDefault(); openLangMenu(); });
    host.appendChild(b);
  }
  window.sbPaintLangs = paintLangs;

  function applyLang() {
    paintLangs();
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
  /* Наружу — чтобы восстановление вида после открытия замка (D-164) могло
     позвать перевод той же дверью, что и всё остальное. */
  window.sbApplyLang = applyLang;
  window.sbSetLang = function (code) {
    var known = LANGS.some(function (l) { return l.code === code; });
    var c = known ? code : "en";
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

  /* ── ЗНАЧОК СИСТЕМЫ УБИРАЕТ СО СТОЛА (v47.1) ────────────────────────────
   *
   * Основатель: «так же при нажатии на иконку логотипа все окна должны
   * сворачиваться. совет должен был выбрать гибридный вариант во время
   * голосования». Голосование выбрало пустое место стола и на этом
   * остановилось — а у победителя был напарник.
   *
   * Почему нужны оба, а не один. Пустое место — жест того, кто систему уже
   * знает, и он недостижим ровно тогда, когда нужнее всего: окно во весь
   * экран пустого места не оставляет, и чтобы жестом воспользоваться, надо
   * сперва убрать окно руками — то есть сделать то, ради чего жест и
   * заводился. Значок в углу виден всегда.
   *
   * Дверь ОДНА: window.sbMinimizeAll из desktop.js. Второй копии правила
   * здесь нет и не будет — иначе два места начнут расходиться в мелочах.
   */
  /* Публичная дверь «покажи подсказку сейчас». Лампочка переехала в Центр
     управления (v47.3, место в панели занял Турбо), и всем, кто просил
     подсказку нажатием, нужна дверь без поиска кнопки: законы и сама
     лампочка зовут одно и то же. */
  window.sbShowTipNow = function () {
    hintRequested = true;   /* человек позвал сам — см. sbDeskHintYield */
    var tip = nextTip();
    if (!tip) return false;
    showTip(tip);
    return true;
  };

  /* ── ЗНАК СИСТЕМЫ — ДВА ШАГА, А НЕ ДВА НАЗНАЧЕНИЯ (v61) ──────────────────
     ПОВОД, дословно от основателя 24.08.2026: «когда нажимаешь в первый раз
     про иконке логотипа, то скрываются все окна, а если нажать ещё раз, то
     страница с нашей os должна открыться на весь экран абсолютно на любом
     устройстве. а иконка логотипа в режиме на весь экран должна стать
     слегка больше и если на неё нажать еще раз, то она уменьшится, но это
     можно сделать только тогда, когда все приложения свёрнуты».

     ПОЧЕМУ ЭТО НЕ ДВЕ КНОПКИ В ОДНОЙ. Обе работы у знака — про одно и то
     же: убрать лишнее и остаться со своей системой. Сначала уходят окна,
     потом уходит браузер. Это одна лестница вниз, к чистому столу, и ступень
     всегда следующая за той, где человек сейчас стоит.

     ПРАВИЛО ОДНО, И ОНО САМО ДАЁТ ОБЕ ПОЛОВИНЫ ОСНОВАТЕЛЯ. Если на столе
     есть что убрать — убираем и на этом останавливаемся. Если убирать
     нечего — переключаем полный экран. Отсюда бесплатно следует и «уменьшить
     можно только когда все приложения свёрнуты»: открытое окно съест
     нажатие, свернувшись, и выход из полного экрана произойдёт следующим.

     ЧЕСТНАЯ ГРАНИЦА, названная вслух: «абсолютно на любом устройстве» —
     недостижимо. Safari на iPhone не даёт полного экрана ничему, кроме
     видео: requestFullscreen там отсутствует. Мы не притворяемся, что
     сработало, — говорим один раз и не повторяем. Молчаливое бездействие
     было бы хуже: человек решил бы, что сломана кнопка.

     Класс на корне ставится по СОБЫТИЮ fullscreenchange, а не по нашему
     намерению: выйти из полного экрана можно и клавишей Esc, и средствами
     браузера, мимо этой кнопки. Признак берётся у того, кто им владеет. */
  function fsElement() {
    return doc.fullscreenElement || doc.webkitFullscreenElement || null;
  }
  function fsSupported() {
    var el = doc.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen);
  }
  var fsToldUnsupported = false;
  function toggleFullscreen() {
    if (!fsSupported()) {
      if (!fsToldUnsupported && window.showToast) {
        fsToldUnsupported = true;
        window.showToast(window.sbT("fs.no"), window.sbT("fs.noSub"), "");
      }
      return;
    }
    try {
      if (fsElement()) {
        (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      } else {
        var el = doc.documentElement;
        (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      }
    } catch (err) { console.error("[topbar] fullscreen toggle failed", err); }
  }
  function syncFullscreenClass() {
    doc.documentElement.classList.toggle("sb-fullscreen", !!fsElement());
    /* ── ПОЛНЫЙ ЭКРАН — В ПАНЕЛИ И В НАСТРОЙКАХ (D-163) ─────────────────
       Просьба основателя 27.08.2026: «Fullscreen on off нужно добавить в
       панель быстрого управления и в настройки».
       Признак берётся у ТОГО, КТО ИМ ВЛАДЕЕТ: выйти из полного экрана можно
       клавишей Esc и средствами браузера, мимо любой нашей кнопки. Поэтому
       обе поверхности перекрашиваются по СОБЫТИЮ, а не по нашему намерению. */
    var b = $("#sbCcFullscreen");
    if (b) {
      b.setAttribute("aria-pressed", fsElement() ? "true" : "false");
      b.classList.toggle("on", !!fsElement());
    }
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("fullscreen:change", { on: !!fsElement() });
    try {
      doc.dispatchEvent(new CustomEvent("sysbaby:setting-changed", { detail: { kind: "fullscreen" } }));
    } catch (e) { /* ignore */ }
  }
  /* Наружу — одной парой: обе поверхности зовут ОДНУ дверь, и спорить им не о
     чем. sbFullscreenSupported честно отвечает «нет» там, где полного экрана
     не существует (Safari на iPhone), — кнопка тогда не рисуется вовсе. */
  window.sbToggleFullscreen = function () { toggleFullscreen(); return !!fsElement(); };
  window.sbIsFullscreen = function () { return !!fsElement(); };
  window.sbFullscreenSupported = fsSupported;

  function wireMark() {
    var mark = $("#sbTopMark");
    if (!mark) return;
    doc.addEventListener("fullscreenchange", syncFullscreenClass);
    doc.addEventListener("webkitfullscreenchange", syncFullscreenClass);
    syncFullscreenClass();
    mark.addEventListener("click", function () {
      var n = 0;
      if (typeof window.sbMinimizeAll === "function") {
        try { n = window.sbMinimizeAll(); } catch (err) { console.error("[topbar] minimise all failed", err); return; }
      }
      if (n > 0) {
        /* Первая ступень: со стола было что убрать. Молчать, когда убирать
           было нечего, — правило прежнее: подтверждать несделанное значит врать. */
        if (window.showToast) {
          window.showToast(window.sbT("desk.allMinimized"), window.sbT("desk.allMinimizedSub"), "");
        }
        return;
      }
      /* Вторая ступень: стол уже чист — уходит браузер. */
      toggleFullscreen();
    });
  }

  function wireIdentity() {
    var host = $("#sbTopIdentity"), el = $("#sbIdentityName");
    if (!host || !el) return;
    paintIdentity();
    host.title = window.sbT("aria.identity");
    /* ── КРУЖОК ОТКРЫВАЕТ ОКНО АККАУНТА · решение D-173 ─────────────────────
       Здесь стояла правка имени прямо в полосе: нажатие делало #sbIdentityName
       правимым. На широком экране это работало. На телефоне же .id-name скрыт
       вовсе (core.css, §responsive), и от кнопки остаётся один кружок из
       ::after — то есть палец делал правимым НЕВИДИМОЕ поле, и человек,
       нажавший кружок, не видел ровно ничего. Основатель попросил на этом
       месте окно настроек аккаунта; оно же лечит и эту немоту: поле имени
       теперь в окне и видно на любом экране. */
    host.addEventListener("click", function () {
      if (typeof window.sbOpenAccountPanel === "function") { window.sbOpenAccountPanel(); return; }
      /* Панели ещё нет (ранний кадр) — не изображаем действия молча. */
      if (window.console) console.warn("[identity] account panel is not ready yet");
    });
  }

  /* ============================================================== clock (§5)

     ── ЦИФРЫ ИЗ ТОГО ЖЕ МАТЕРИАЛА, ЧТО И ЗНАК (D-135) ────────────────────
     ПОВОД, дословно: «время должно быть более концептуальным и цифры должны
     быть похожи на палочки иконки и на буквы y в логотипе».

     ИЗ ЧЕГО СДЕЛАН ЗНАК, ЕСЛИ ИЗМЕРИТЬ, А НЕ ОПИСАТЬ. В контуре крюка на
     коробке сто на сто перекладина имеет толщину 19.88 и скругление 16
     снаружи, 7 внутри. Язык знака — СТЕРЖЕНЬ примерно в пятую часть коробки
     с круглыми концами. Цифра собрана ровно из этого: семь стержней той же
     относительной толщины, круглые концы, ни одной засечки. Коробка 62×100,
     стержень 20 — те же 20%, что у знака.

     ПОЧЕМУ СТЕРЖНИ, А НЕ ШРИФТ. Шрифтом это было бы ПОХОЖЕ; стержнями это
     то же самое. И цена та же: цифра — семь неподвижных отрезков, у которых
     раз в секунду меняется только признак «горит». Ни одного нового узла,
     ни одной записи в корень — а часы идут круглые сутки, и любая ошибка
     здесь умножается на восемьдесят шесть тысяч.  */
  var SEGS = ["A", "B", "C", "D", "E", "F", "G"];
  var SEG_XY = {
    A: [17, 12, 45, 12], B: [50, 17, 50, 45], C: [50, 55, 50, 83],
    D: [17, 88, 45, 88], E: [12, 55, 12, 83], F: [12, 17, 12, 45], G: [17, 50, 45, 50]
  };
  var DIGIT = {
    "0": "ABCDEF", "1": "BC", "2": "ABGED", "3": "ABGCD", "4": "FGBC",
    "5": "AFGCD", "6": "AFGEDC", "7": "ABC", "8": "ABCDEFG", "9": "ABCDFG"
  };
  function makeGlyph() {
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "clock-glyph");
    svg.setAttribute("viewBox", "0 0 62 100");
    svg.setAttribute("aria-hidden", "true");
    SEGS.forEach(function (k) {
      var xy = SEG_XY[k];
      var ln = doc.createElementNS("http://www.w3.org/2000/svg", "line");
      ln.setAttribute("x1", xy[0]); ln.setAttribute("y1", xy[1]);
      ln.setAttribute("x2", xy[2]); ln.setAttribute("y2", xy[3]);
      ln.setAttribute("data-seg", k);
      svg.appendChild(ln);
    });
    return svg;
  }
  function setGlyph(svg, ch) {
    var on = DIGIT[ch] || "";
    if (svg._sbCh === ch) return;
    svg._sbCh = ch;
    var lines = svg.childNodes;
    for (var i = 0; i < lines.length; i++) {
      var k = lines[i].getAttribute("data-seg");
      var want = on.indexOf(k) !== -1;
      /* Признак переставляется, только если он ДЕЙСТВИТЕЛЬНО меняется:
         иначе каждая секунда просила бы пересчитать стили ни за чем. */
      if ((lines[i].getAttribute("class") === "on") !== want) {
        if (want) lines[i].setAttribute("class", "on");
        else lines[i].removeAttribute("class");
      }
    }
  }
  window.sbClockGlyph = function (ch) { var g = makeGlyph(); setGlyph(g, ch); return g; };

  /* ── ЧАСЫ ЛОВЯТ СВЕТ КОМНАТЫ (D-137) ──────────────────────────────────
     ПОВОД: «нужно часы сделать гармоничными и максимально концептуальными
     (сейчас концептуальность есть, но недостаточно какого-то уникального
     эффекта связанного со светом)».

     ЧТО ЗДЕСЬ УНИКАЛЬНОГО, И ПОЧЕМУ ЭТО НЕ УКРАШЕНИЕ. Часы не светятся сами —
     они ОСВЕЩЕНЫ той же комнатой, что и всё вокруг. Если выбраны суточные
     обои, свет идёт по кругу суток вместе с ними: в три часа ночи цифры почти
     без ореола, к полудню он ясно виден. Если обои обычные — светит шов.
     Значит часы показывают время ДВАЖДЫ: цифрами и тем, каким светом они
     освещены. Такого эффекта не может быть ни у кого другого — он вырастает
     из того, что в этой системе уже есть.

     ЦЕНА. Свойство пишется на ОДИН элемент (сами часы), а не в корень: запись
     в корень объявляет устаревшим стиль всего документа (D-093, D-112). И
     пишется, только когда округлённый цвет изменился, — не чаще раза в
     несколько минут. */
  var litLast = "";
  function roomLight() {
    /* ── ОДИН СВЕТ НА ВСЮ КОМНАТУ (D-143) ──────────────────────────────────
       Здесь стояли три ветки: у светотерапии спрашивали её обои, у суточного
       — свои, у остальных брали шов. Это было раздвоением дважды: часы сами
       выводили цвет комнаты по её имени (хотя с D-141 шов И ЕСТЬ её свет,
       увиденный на кромке), и вдобавок читали ВЫЧИСЛЕННЫЙ свет вместо
       НАПИСАННОГО — поэтому в замороженной комнате часы продолжали писать.
       Спрашиваем один раз и у одного: что на комнате надето сейчас. */
    try {
      var now = window.sbRoomNow ? window.sbRoomNow() : null;
      var acc = window.sbGetCurrentAccent ? window.sbGetCurrentAccent() : null;
      if (acc && acc.a1) {
        return { c1: acc.a1, level: (now && typeof now.level === "number") ? now.level : 0.5 };
      }
    } catch (err) { console.error("[clock] light read failed", err); }
    return null;
  }
  function paintLight() {
    var w = roomLight();
    if (!w || !w.c1) return;
    var lvl = typeof w.level === "number" ? w.level : 0.5;
    /* Ореол мал даже в самый светлый час: часы — не лампа, они лишь ловят
       свет. Цифра остаётся белой, цветным становится только сияние вокруг. */
    var blur = Math.round((1.4 + lvl * 4.2) * 10) / 10;
    var alpha = Math.round((0.16 + lvl * 0.34) * 100) / 100;
    var key = w.c1 + "|" + blur + "|" + alpha;
    if (key === litLast) return;
    litLast = key;
    var n = parseInt(String(w.c1).slice(1), 16);
    var rgba = "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
    /* СВЕТ ОБЪЯВЛЕН В ОДНОМ МЕСТЕ, потому что читают его трое: часы в полосе,
       крупное время в панели и время в проигрывателе. Три копии одного знания
       разошлись бы — этот урок в проекте оплачен четырежды.
       ЗАПИСЬ В КОРЕНЬ ЗДЕСЬ ОПРАВДАНА ЦЕНОЙ: она объявляет устаревшим стиль
       всего документа (D-093, D-112), но случается, только когда изменился
       ОКРУГЛЁННЫЙ цвет света — то есть раз в несколько минут, а не раз в
       секунду. Закон это и стережёт: за четыре секунды хода — ни одной. */
    /* КАЖДОЕ СВОЙСТВО — СО СВОИМ ВОПРОСОМ (D-143). Ключ общий на троих, но
       меняются они врозь: цвет плывёт непрерывно, а размытие держится
       ступенькой. Писать все три потому, что изменилось одно, значит дважды
       объявить устаревшим стиль всего документа НИ ЗА ЧТО. Замер клиники
       поймал это в лоб: --lit-blur переписан тем же значением, которое уже
       стояло. Спрашиваем у корня, что там сейчас, и пишем только новое. */
    var root = doc.documentElement, st = root.style;
    var ink = "color-mix(in oklab, var(--ink) 88%, " + w.c1 + ")";
    setIfNew(st, "--lit-glow", rgba);
    setIfNew(st, "--lit-blur", blur + "px");
    /* Сам штрих — чуть тёплее белого в сторону света, но остаётся белым:
       цветные цифры в рабочей полосе кричали бы. */
    setIfNew(st, "--lit-ink", ink);
  }
  function setIfNew(st, key, value) {
    if (st.getPropertyValue(key) === value) return;
    st.setProperty(key, value);
  }
  window.sbClockLight = paintLight;
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("mood:change", function () { litLast = ""; paintLight(); });
    window.sbBus.on("accent:change", function () { litLast = ""; paintLight(); });
  }

  var clockCells = null, lastClock = "";
  function localeFor() { var l = lang(); return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB"); }

  function paintClock(force) {
    var host = $("#sbClock");
    if (!host) return;
    if (doc.visibilityState === "hidden" && !force) return;
    var d = new Date();
    /* НА ТЕЛЕФОНЕ ЧАСЫ УСТУПАЮТ (v47). С появлением полосы языков верхняя
       панель на 390px перестала помещаться: часы уезжали за правую кромку на
       шестьдесят пикселей. Уступает здесь именно дата и секунды, а не язык, —
       и это выбор, а не случайность: который час, человек узнаёт у телефона
       одним взглядом вверх, а на каком он языке — только у нас. */
    var narrow = window.innerWidth < 480;
    var opts = window.innerWidth < 560 ? { day: "numeric", month: "short" } : { weekday: "short", day: "numeric", month: "short" };
    var dateStr = narrow ? "" : d.toLocaleDateString(localeFor(), opts);
    var timeStr = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) +
      (narrow ? "" : ":" + ("0" + d.getSeconds()).slice(-2));
    var whole = narrow ? timeStr : dateStr + "  " + timeStr;
    if (whole === lastClock && !force) return;

    /* Пересборка нужна, только когда СОСТАВ строки изменился — например,
       окно сузилось и секунды ушли. Обычная секунда состава не меняет. */
    var shape = whole.replace(/\d/g, "#");
    if (!clockCells || clockCells.length !== whole.length || clockCells._shape !== shape || force) {
      host.innerHTML = "";
      clockCells = [];
      clockCells._shape = shape;
      for (var i = 0; i < whole.length; i++) {
        var s = doc.createElement("span");
        s.className = "clock-cell";
        if (DIGIT[whole[i]] !== undefined) {
          s.className += " digit";
          var g = makeGlyph();
          setGlyph(g, whole[i]);
          s.appendChild(g);
          s._sbGlyph = g;
        } else {
          s.textContent = whole[i];
        }
        host.appendChild(s);
        clockCells.push(s);
      }
    } else {
      for (var j = 0; j < whole.length; j++) {
        var cell = clockCells[j];
        var cur = cell._sbGlyph ? cell._sbGlyph._sbCh : cell.textContent;
        if (cur === whole[j]) continue;
        if (cell._sbGlyph) setGlyph(cell._sbGlyph, whole[j]);
        else cell.textContent = whole[j];
        if (!reduced()) {
          cell.classList.remove("roll");
          void cell.offsetWidth;
          cell.classList.add("roll");
        }
      }
    }
    /* ── СВЕТ НЕ ПРИВЯЗАН К МИНУТЕ (D-143) ────────────────────────────────
       Здесь стоял вызов paintLight(). Ход часов — это МИНУТА: раньше цифры
       не меняются, и до сюда мы доходим раз в минуту. Свет комнаты за это
       время успевает уйти далеко, и минутная стрелка догоняла его одним
       рывком — в замершей комнате это выглядело как запись в корень «сама
       по себе», и закон root-restyle-check ловил её то в одном прогоне, то
       в другом. Причина не в пороге и не в удаче: у света и у цифр РАЗНЫЙ
       ход, и связывать их нельзя. Свет ставит комната — wpTick зовёт
       sbClockLight ровно тогда, когда шов ступил (D-141). Часы рисуют
       цифры. Каждый прибор при своём предмете. */
    host.setAttribute("data-whole", whole);
    host.setAttribute("aria-label", whole);
    lastClock = whole;
  }
  /* Полная пересборка часов вынесена наружу — не ради красоты, а чтобы закон
     мог ИЗМЕРИТЬ, сколько она стоит, и сравнить с ценой обычного хода. Порог,
     назначенный на глаз, оказался бы внутри разброса. */
  window.sbRepaintClock = function () { paintClock(true); };
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "visible") paintClock(true); });

  /* ОБА ФАКТА НАЗВАНЫ СЛОВАМИ. Знак один, но заряд и связь — разные вещи, и
     ни одна не должна пропасть для того, кто читает подпись, а не рисунок. */
  function sayPower() {
    var el = $("#sbPowerGlyph");
    if (!el) return;
    var bits = [el.getAttribute("data-bat"), el.getAttribute("data-net")].filter(Boolean);
    if (!bits.length) return;
    el.setAttribute("aria-label", bits.join(" · "));
    el.title = bits.join(" · ");
  }

  /* ═══════ СВЯЗЬ · «ИНТЕРНЕТА НЕТ. НИЧЕГО НЕ ИЗМЕНИЛОСЬ» · решение D-183 ═════
     ПОВОД, дословно от основателя 27.08.2026: «нужно написать где-то как-то
     гениально и концептуально — твоя система остаётся с тобой даже тогда,
     когда нет интернета».

     ПОЧЕМУ НЕ ЛОЗУНГ, А ПОВЕДЕНИЕ. Написать эту фразу на витрине может кто
     угодно; доказать её может только тот, у кого она правда. Поэтому она
     сказана не там, где её читают, а ТАМ, ГДЕ ОНА СЛУЧАЕТСЯ: в тот самый миг,
     когда связь пропала.

     ВСЯ ПРОЧАЯ ПРОГРАММА встречает потерю сети как АВАРИЮ: красная полоса,
     «нет подключения», «повторить попытку». Для них это правда авария — их
     работа на чужом сервере. Здесь всё наоборот: сервера нет вовсе, и потеря
     сети НЕ МЕНЯЕТ РОВНО НИЧЕГО. Отсутствие сети — не поломка, а РОДНОЕ
     СОСТОЯНИЕ этой системы; подключение — исключение, а не условие.
     Поэтому система не предупреждает — она ЗДОРОВАЕТСЯ. Одной строкой, один
     раз, и никогда больше: «Интернета нет. Ничего не изменилось».

     ЧЕСТНАЯ ОГОВОРКА СТОИТ РЯДОМ, а не спрятана: Браузер без сети чужих
     страниц не покажет — они не наши. Всё остальное на месте, потому что
     всегда было здесь.

     ПОЧЕМУ ОДИН РАЗ И С ЗАДЕРЖКОЙ. Связь на телефоне мигает: в лифте, в
     метро, на краю соты. Извещение на каждое мигание — та самая тревога, от
     которой мы отказываемся. Ждём три секунды непрерывного молчания сети и
     говорим ОДИН раз за сеанс. Возвращение сети не объявляется вовсе: раз
     ничего не менялось, то и возвращаться нечему.
     Охраняется tools/offline-voice-check.mjs. */
  var netSaid = false;
  var netTimer = null;
  function paintNet() {
    var el = $("#sbPowerGlyph");
    var online = navigator.onLine !== false;
    if (el) {
      el.classList.toggle("offline", !online);
      el.setAttribute("data-net", online ? window.sbT("cc.online") : window.sbT("cc.offlineLong"));
      sayPower();
    }
    var row = $("#sbCcNet");
    if (row) row.textContent = online ? window.sbT("cc.online") : window.sbT("net.stillHere");
  }
  function greetOffline() {
    if (netSaid) return;
    netSaid = true;
    if (window.showToast) {
      try { window.showToast(window.sbT("net.gone"), window.sbT("net.nothingChanged"), "", false, "toast-calm", "event"); }
      catch (e) { /* ignore */ }
    }
  }
  function onNetChange() {
    paintNet();
    if (netTimer) { clearTimeout(netTimer); netTimer = null; }
    if (navigator.onLine === false) netTimer = setTimeout(greetOffline, 3000);
  }
  window.addEventListener("online", onNetChange);
  window.addEventListener("offline", onNetChange);
  /* Загрузка без сети — тот же случай: система уже работает, и сказать об этом
     надо ровно так же спокойно. */
  if (navigator.onLine === false) netTimer = setTimeout(greetOffline, 3000);
  window.sbNetGreeted = function () { return netSaid; };

  /* ========================================================== battery (§5) */
  function paintBattery(bat) {
    var el = $("#sbPowerGlyph"), row = $("#sbCcBattery"), line = $("#sbCcBatteryLine");
    if (!bat) {
      if (el) { el.classList.add("neutral"); el.setAttribute("data-bat", window.sbT("cc.batteryNA")); sayPower(); }
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
      el.setAttribute("data-bat", pct + "% — " + (bat.charging ? window.sbT("cc.charging") : window.sbT("cc.onBattery")));
      sayPower();
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
    /* Подсказка о работах вела в снятое приложение портфолио (D-066).
       Ведёт в build — там теперь раздел «Избранные проекты». */
    { id: "portfolio", panel: null, app: "build", section: "cases" },
    { id: "inlinesearch", panel: null, pointer: true },
    { id: "cmdk", panel: null, pointer: true },
    { id: "stickynotes", panel: null },
    /* v66: заметка выросла в окно (D-111) — подсказки обязаны расти вместе
       с системой, о чём основатель просил отдельно: «прошу постоянно
       обновлять информацию в подсказках». */
    { id: "notefull", panel: null },
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
  var tipTimer = null, currentTip = null, hintRequested = false;

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
    /* Человек вызвал подсказку — извещения уступают ей место (см.
       sbToastsYield в shell.js: явно запрошенное важнее пришедшего само). */
    if (window.sbToastsYield) window.sbToastsYield();
    host.removeAttribute("hidden");
    /* one frame with the element laid out but not yet `.on`, so the entrance
       transition has a start state to animate from */
    requestAnimationFrame(function () { host.classList.add("on"); });
  }
  function hideTip() {
    var host = $("#sbDeskHint");
    if (host) host.classList.remove("on");
    currentTip = null;
    hintRequested = false;
  }

  /* ── ОДНО МЕСТО РЕЧИ: ИЗВЕЩЕНИЕ ВЫТЕСНЯЕТ САМОПРИШЕДШУЮ ПОДСКАЗКУ (v66) ──
     Повод, дословно от основателя 25.08.2026: «оповещения должны
     отображаться в блоке подсказок». У стола теперь один голос и одно
     место, откуда он говорит, — линия над полкой. Кто говорит — решает
     правило v47.1, симметрично достроенное: явно запрошенное важнее
     пришедшего само. Подсказку, которую человек ВЫЗВАЛ лампочкой,
     извещение не перебивает; подсказка, пришедшая по расписанию, уступает
     извещению — оно свежее. */
  window.sbDeskHintYield = function () {
    if (!currentTip || hintRequested) return false;
    hideTip();
    return true;
  };
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
      hintRequested = false;   /* пришла сама — уступит извещению */
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
        else if (currentTip.id === "portfolio") {
          if (typeof window.sbOpenBuildAt === "function") window.sbOpenBuildAt("cases");
          else if (window.toggleApp) window.toggleApp("build");
        }
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
        /* Лампочка живёт в Центре управления (v47.3): показав подсказку,
           ЦУ закрывается — иначе подсказка выйдет под его стеклом и человек
           её не увидит. */
        if (window.sbCloseControlCenter) window.sbCloseControlCenter();
        if (!window.sbShowTipNow()) {
          if (window.showToast) window.showToast(window.sbT("tips.doneTitle"), window.sbT("tips.doneBody"), "");
        }
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

  var ccVol = null, ccBright = null;
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
    /* Ряд обоев строится из живого объявления системы (D-152): в разметке его
       больше нет, и разойтись с Настройками ему негде. Перерисовывается он
       только когда состав ИЗМЕНИЛСЯ — иначе каждое открытие панели переписывало
       бы десяток узлов ни за что. */
    /* Заполнение ползунков — при каждой отрисовке панели: разметка приходит
       готовой, а событие «input» до первого касания не случается (D-156). */
    if (window.sbPaintAllRanges) window.sbPaintAllRanges($("#sbControlCenter"));
    var ccTurbo = $("#sbCcTurbo");
    if (ccTurbo && window.sbTurbo) {
      var tOn = !!window.sbTurbo();
      ccTurbo.setAttribute("aria-pressed", tOn ? "true" : "false");
      ccTurbo.classList.toggle("on", tOn);
    }
    if (window.sbPaintIris) window.sbPaintIris();
    var side = window.sbGetControlSide ? window.sbGetControlSide() : "left";
    $$("[data-side]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-side") === side); });
    var moodHost = $("#sbCcMoods");
    if (moodHost) {
      var ids = (window.sbWallpaperMoods || []).map(function (m) { return m.id; }).join(",");
      if (moodHost.getAttribute("data-built") !== ids) {
        moodHost.setAttribute("data-built", ids);
        moodHost.innerHTML = (window.sbWallpaperMoods || []).map(function (m) {
          var name = window.sbT("mood." + m.id);
          if (name === "mood." + m.id) name = m.name || m.id;
          return '<button class="chip" type="button" data-mood="' + esc(m.id) +
            '" data-i18n="mood.' + esc(m.id) + '">' + esc(name) + "</button>";
        }).join("");
      }
    }
    var drifty = {};
    (window.sbWallpaperMoods || []).forEach(function (m) { if (m.drift) drifty[m.id] = m.session ? "session" : "drift"; });
    $$("[data-mood]").forEach(function (b) {
      var id = b.getAttribute("data-mood");
      b.classList.toggle("on", id === mood);
      /* Суточное настроение показывает цвет своего часа прямо на чипе —
         иначе оно ничем не отличается от пяти неподвижных и его снова никто
         не найдёт. Тот же знак-дуга, что у суточной краски. */
      if (!drifty[id]) return;
      b.classList.toggle("is-session", drifty[id] === "session");
      b.classList.toggle("is-drift", drifty[id] === "drift");
      var read = drifty[id] === "session" ? window.sbTherapyForTime : window.sbWallpaperForTime;
      if (typeof read !== "function") return;
      try {
        var w = read();
        b.style.background = "linear-gradient(135deg," + w.c1 + "," + w.c2 + ")";
        b.style.borderColor = "transparent";
        b.style.color = "#fff";
      } catch (err) { console.error("[cc] mood preview failed", err); }
    });
    var themeNow = window.sbGetTheme ? window.sbGetTheme() : "dark";
    $$("[data-theme-chip]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme-chip") === themeNow); });
    /* Sliders and the language selector are settings too — they repaint from
       the same stored truth as the toggles, or the panel shows stale values
       after Pulse moves them. */
    /* Ползунки наши (D-162): значение ставится через их же ручку, а не через
       .value чужого поля. Пока палец держит ползунок, его не трогают — иначе
       панель спорила бы с рукой. */
    if (ccVol && !ccVol.el.classList.contains("held")) {
      ccVol.set(Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100));
    }
    if (ccBright && !ccBright.el.classList.contains("held") && window.sbGetBrightness) {
      ccBright.set(window.sbGetBrightness());
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

    /* Ползунки строятся один раз, здесь же, где панель заводят (D-162). */
    var volHost = $("#sbCcVolumeHost", cc);
    if (volHost && window.sbSlider && !ccVol) {
      ccVol = window.sbSlider(volHost, {
        min: 0, max: 100, value: Math.round((window.sbGetNotifVolume ? window.sbGetNotifVolume() : num(window.sbNotifVolume, 0.6)) * 100),
        label: window.sbT("cc.volume"),
        onInput: function (v) {
          /* через сеттер оболочки: сохраняется и объявляется, а не живёт
             глобальной переменной на один сеанс */
          if (window.sbSetNotifVolume) window.sbSetNotifVolume(v / 100);
          else window.sbNotifVolume = clamp(v / 100, 0, 1);
        }
      });
    }
    var brightHost = $("#sbCcBrightnessHost", cc);
    if (brightHost && window.sbSlider && !ccBright) {
      ccBright = window.sbSlider(brightHost, {
        min: 0, max: 100, value: window.sbGetBrightness ? window.sbGetBrightness() : 100,
        label: window.sbT("cc.brightness"),
        onInput: function (v) {
          if (window.sbSetBrightness) window.sbSetBrightness(v);
          else doc.body.style.filter = "brightness(" + (0.72 + (clamp(v, 0, 100) / 100) * 0.34).toFixed(3) + ")";
        }
      });
    }
    var langSel = $("#sbCcLang");
    if (langSel) {
      langSel.innerHTML = LANGS.map(function (l) {
        return '<option value="' + l.code + '"' + (l.code === lang() ? " selected" : "") + ">" + esc(l.label) + "</option>";
      }).join("");
      langSel.addEventListener("change", function () { window.sbSetLang(langSel.value); });
    }
    /* Кнопки ряда обоев рождаются позже самой панели, поэтому слушатель
       стоит на РЯДУ, а не на каждой кнопке: иначе новая комната приходила бы
       без нажатия (D-152). */
    /* ── ЗАМОК: ОДНО НАЖАТИЕ (D-161) ──────────────────────────────────────
       Пароль спрашивается дважды: опечатка в единственном поле — это потеря
       всего написанного, и переспросить дешевле, чем объяснять потом. Если
       криптографии браузера нет, кнопка не изображает работу, а исчезает:
       нарисованный замок хуже отсутствующего. */
    var fsBtn = $("#sbCcFullscreen", cc);
    if (fsBtn) {
      if (!fsSupported()) fsBtn.hidden = true;
      fsBtn.addEventListener("click", function () { toggleFullscreen(); });
    }
    /* Турбо здесь, а не в полосе (D-167). Кнопка одна, состояние читает
       сама система: sbTurbo — единственный владелец этого знания. */
    var ccTurboBtn = $("#sbCcTurbo", cc);
    if (ccTurboBtn) {
      ccTurboBtn.addEventListener("click", function () {
        if (!window.sbTurbo) return;
        window.sbTurbo(!window.sbTurbo());
        paintCc();
      });
    }
    var sideRow = $("#sbCcSide", cc);
    if (sideRow) {
      sideRow.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-side]") : null;
        if (!b || !window.sbSetControlSide) return;
        window.sbSetControlSide(b.getAttribute("data-side"));
        paintCc();
      });
    }
    var moodRow = $("#sbCcMoods", cc);
    if (moodRow) {
      moodRow.addEventListener("click", function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest("[data-mood]") : null;
        if (!b) return;
        if (window.sbSetWallpaperMood) window.sbSetWallpaperMood(b.getAttribute("data-mood"));
        paintCc();
      });
    }
    $$("[data-theme-chip]", cc).forEach(function (b) {
      b.addEventListener("click", function () { if (window.setTheme) window.setTheme(b.getAttribute("data-theme-chip")); paintCc(); });
    });

/* Нативный выбор цвета убран.
   ---------------------------------------------------------------------------
   <input type="color"> открывает СИСТЕМНОЕ окно Android или macOS — чужой
   диалог поверх собственной системы, со своим языком, своей палитрой из восьми
   базовых цветов и кнопкой «Set». Это ровно то, чего sys.baby не делает: чужая
   поверхность, выданная за свою. Плюс на телефоне он занимает пол-экрана ради
   выбора оттенка, который всё равно должен лежать в палитре проекта.
   Остаются готовые оттенки — свои, названные, в языке системы. */
    /* Ряда красок в Центре управления больше нет: шов приходит от обоев,
       и ряд обоев ниже — единственный выбор цвета (D-141). */

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
    wireMark();
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
