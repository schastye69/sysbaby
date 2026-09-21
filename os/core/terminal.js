/* sys.baby OS — core/terminal.js
 * Terminal engine (sbMountTerminal(root), idempotent per root) + the Terminal
 * app window. Registers FIRST, before the app scripts load (§3.1).
 *
 * ЭТО ЕДИНСТВЕННОЕ МЕСТО СИСТЕМЫ, КОТОРОЕ ГОВОРИТ О СЕБЕ ВСЛУХ. Оно печатает
 * числа и заявления. И то и другое — показания системы о самой себе, а
 * показания, которых никто не проверяет, живут ровно до первого дня, когда
 * перестают быть правдой, и ни секунды меньше. Поэтому: числа СПРАШИВАЮТСЯ у
 * системы, а не помнятся (D-200/D-201), обещания про «наружу» спрашиваются у
 * описи (D-221), а под замком терминал не выдаёт ни человека, ни веса того,
 * что замок прячет (D-228).
 *
 * Охраняется tools/terminal-truth-check.mjs. */
(function () {
  "use strict";

  var doc = document;
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }

  /* authored voice lines — never machine-translated (§9) */
  var SEEN = {
    en: [
      "The quote was ready on Monday. It went out on Wednesday. Nobody could say what happened on Tuesday.",
      "Three people keep the schedule. None of them keep the same one.",
      "The invoice was correct. It was also in a photograph, in a group chat, on somebody's other phone.",
      "Every system has a single source of truth. The trouble starts when there are two of them.",
      "It only takes five minutes. It takes five minutes eleven times a day."
    ],
    ru: [
      "Смета была готова в понедельник. Ушла в среду. Что было во вторник, никто не скажет.",
      "График ведут трое. Одинаковый — никто.",
      "Счёт был верный. И он же — на фото, в общем чате и на чьём-то втором телефоне.",
      "У каждой системы есть единственный источник правды. Сложности начинаются, когда их два.",
      "Это же пять минут. Пять минут одиннадцать раз в день."
    ],
    ee: [
      "Pakkumine oli esmaspäevaks valmis. Välja läks kolmapäeval. Mis teisipäeval juhtus, ei oska keegi öelda.",
      "Graafikut peavad kolm inimest. Ühtki sama pole.",
      "Arve oli õige. Ta oli ka pildil, grupivestluses ja kellegi teises telefonis.",
      "Igal süsteemil on üks tõeallikas. Häda algab siis, kui neid on kaks.",
      "See võtab ainult viis minutit. Viis minutit üksteist korda päevas."
    ]
  };

  var WHO = {
    en: "A two-person studio in Tallinn. We build the system, then we hand you the keys.",
    ru: "Студия из двух человек в Таллинне. Мы строим систему и отдаём вам ключи.",
    ee: "Kaheliikmeline stuudio Tallinnas. Ehitame süsteemi ja anname võtmed sinu kätte."
  };

  var SYNONYMS = {
    finder: "files", vault: "files", files: "files",
    inbox: "mail", letters: "mail", mail: "mail",
    chat: "messenger", whisper: "messenger", messages: "messenger", messenger: "messenger",
    scribble: "notes", notes: "notes",
    seek: "search", search: "search",
    pulse: "settings", settings: "settings",
    bin: "echoes", trash: "echoes", echoes: "echoes",
    cli: "terminal", terminal: "terminal", shell: "terminal",
    /* Портфолио снято с рабочего стола (D-066): слова остались, потому что
       человек их знает и будет набирать, — но ведут они туда, где работы
       теперь живут: в build. Терминал не делает вид, что приложение есть,
       и не отвечает «не знаю такого» на законный вопрос. */
    portfolio: "build", work: "build", cases: "build", build: "build",
    project: "project"
  };

  /* The project journal. Real entries about this system's real history —
     written as it happened, kept where a curious visitor can find them.
     `log` prints the recent past; `log all` prints everything. The same
     journal seeds the Vault's Journal folder and the Echoes traces, so the
     system remembers itself consistently wherever you ask it.
     Every entry is true. That is the entire trick. */
  var JOURNAL = [
    { d: "jul 2026", t: "removed the particle field from the landing background. reason recorded in the source: the field glowed, the page did not live. deleting your own favourite effect is a skill." },
    { d: "jul 2026", t: "found a stock video from a website builder's CDN playing behind our hero text. a page that sells independence from other people's services, opening on someone else's server. it went." },
    { d: "aug 2026", t: "an advisory council convened: twelve chairs, standing order 'evidence over opinion'. the first ruling was against our own homepage." },
    { d: "aug 2026", t: "the mail chain closed end to end — DNS untangled, routing restored, and a letter sent from the site reached the studio inbox for the first time. the counter of proven things moved off zero." },
    { d: "aug 2026", t: "two builds stood trial against each other. runtime evidence, not taste. the newer one won 7.72 to 6.55, and both learned something." },
    { d: "aug 2026", t: "the name line took its place on the first screen: Building Automated Business for You — machine voice, small caps, never a headline. the headline's job is to sell; the name's job is to answer." },
    { d: "aug 2026", t: "the OS wallpaper — graphite, one clay lamp — reached the landing. the house was lit before the door was. fixed." },
    { d: "aug 2026", t: "calibrated the seam glow on desktop screenshots; a real OLED phone crushed it to black. lesson written into the changelog: calibrate on glass, not on instruments." },
    { d: "aug 2026", t: "removed the word 'applications' from the bottom of the landing. the light under the door says it better with no letters at all." },
    { d: "aug 2026", t: "the experimental bench left the showcase. the shop window shows delivered systems; the workbench stays in the shop." },
    { d: "aug 2026", t: "settings learned to tell the truth in real time: change anything anywhere, watch it change everywhere. one source per setting, everyone listens." }
  ];
  window.sbJournal = JOURNAL;

  /* Visible commands: completed by Tab, offered by did-you-mean, listed by
     help. The hidden ones (sudo, exit, rm, baby, hello…) are deliberately in
     none of those places — a door you must try, not a menu item. */
  var COMMANDS = ["help", "version", "uptime", "status", "whoami", "clear", "date", "time",
    "calendar", "notes", "open", "theme", "calc", "echo", "seen", "who",
    "apps", "log", "storage", "contracts", "errors", "lang", "history",
    /* floor, rights и alive стояли в help и НЕ стояли здесь: Tab их не
       дополнял, «вы имели в виду» их не предлагал. Команда, названная в
       справке и неизвестная дополнению, — маленький вариант двери, которая
       не открывается (D-243). */
    "floor", "rights", "alive"];

  function lang() { return window.sbLang ? window.sbLang() : "en"; }
  function localeFor() { var l = lang(); return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB"); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function pad(s, n) { s = String(s == null ? "" : s); while (s.length < n) s += " "; return s; }

  function distance(a, b) {
    var m = a.length, n = b.length, prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur.slice();
    }
    return prev[n];
  }

  window.sbMountTerminal = function (rootEl) {
    if (!rootEl) return null;
    if (rootEl.getAttribute("data-sb-terminal") === "1") return rootEl.__sbTerm;   /* idempotent per root */
    rootEl.setAttribute("data-sb-terminal", "1");
    rootEl.classList.add("sb-terminal");
    rootEl.innerHTML =
      '<div class="term-chips">' +
      ["help", "status", "log", "seen"].map(function (c) {
        return '<button class="term-chip" type="button" data-cmd="' + c + '">' + c + "</button>";
      }).join("") + "</div>" +
      '<div class="term-out" role="log" aria-live="polite"></div>' +
      '<form class="term-line"><span class="term-prompt">❯</span>' +
      '<input class="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input" /></form>';

    var out = rootEl.querySelector(".term-out");
    var form = rootEl.querySelector(".term-line");
    var input = rootEl.querySelector(".term-input");
    var history = [], histIdx = -1;

    function write(text, cls) {
      var d = doc.createElement("div");
      d.className = "term-row" + (cls ? " " + cls : "");
      d.textContent = text;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
      return d;
    }
    function writeLines(lines, cls) { lines.forEach(function (l) { write(l, cls); }); }

    function typewriter(text) {
      var row = write("", "term-welcome");
      var i = 0;
      var reduced = document.documentElement.getAttribute("data-motion") === "reduced";
      if (reduced) { row.textContent = text; return; }
      var t = setInterval(function () {
        i++;
        row.textContent = text.slice(0, i);
        if (i >= text.length) clearInterval(t);
      }, 18);
    }

    function greeting() {
      typewriter("sys.baby terminal — type 'help' to see what's available.");
      var build = window.sbBuild ? window.sbBuild.stamp() : "sys.baby core";
      var reg = (window.SysBaby && window.SysBaby.order) ? window.SysBaby.order.length : 0;
      var launch = window.sbLaunchableApps ? window.sbLaunchableApps().length : 0;
      write(build + " · " + reg + " windows registered, " + launch + " launchable.", "term-dim");
    }

    function run(raw) {
      var line = String(raw || "").trim();
      if (!line) return;
      write("❯ " + line, "term-echo");
      history.unshift(line);
      histIdx = -1;
      var parts = line.split(/\s+/);
      var cmd = parts[0].toLowerCase();
      var rest = line.slice(parts[0].length).trim();

      switch (cmd) {
        case "help":
          writeLines([
            "system     version · status · alive · uptime · storage · floor · rights · contracts · errors · whoami · clear",
            "desktop    open <app> · apps · theme dark|light · notes · lang · tidy",
            "utility    date · time · calendar · calc <expr> · echo <text> · history",
            "journal    log · log all — this system's own build history",
            "voice      seen · who"
          ]);
          write("not everything is listed. terminals keep some doors unlabelled.", "term-dim");
          return;
        /* ── ПРИБРАТЬ СТОЛ ─────────────────────────────────────────────────
           Стол помнит, куда человек переставил значки (D-067), и сам их
           больше не возвращает. Обратная дверь обязана существовать и быть
           названной: вот она. Отвечает ЧИСЛОМ переставленных — команда,
           которая молча ничего не сделала, неотличима от сломанной. */
        case "tidy": {
          if (typeof window.sbTidyDesk !== "function") { write("the desktop is not listening."); return; }
          var back = window.sbTidyDesk();
          if (!back) { write("nothing to tidy — every icon is where the grid put it."); return; }
          write("tidied: " + back + " icon" + (back === 1 ? "" : "s") + " returned to the grid.");
          write("their places are forgotten, not hidden — drag them again and the desk will remember.", "term-dim");
          return;
        }
        case "version":
          if (window.sbBuild) writeLines(window.sbBuild.report().map(function (r) { return r[0] + ": " + r[1]; }));
          else write("build information is unavailable.");
          return;
        case "uptime":
          write(window.sbBuild ? window.sbBuild.uptime() : "unknown");
          return;
        case "status": {
          var open = window.openWindows || {};
          var ids = Object.keys(open);
          var mins = ids.filter(function (id) { return open[id].minimized; }).length;
          var kept = window.sbNotesStore ? window.sbNotesStore.load().length : 0;
          var gone = window.sbNotesStore ? window.sbNotesStore.loadDeleted().length : 0;
          var unreadMail = null, convoCount = null;
          try { if (window.sbMailUnreadCount) unreadMail = window.sbMailUnreadCount(); } catch (e) { unreadMail = null; }
          try { if (window.sbMessengerAll) convoCount = window.sbMessengerAll().length; } catch (e) { convoCount = null; }
          var lines = [
            window.sbBuild ? window.sbBuild.stamp() : "sys.baby core",
            "uptime: " + (window.sbBuild ? window.sbBuild.uptime() : "unknown") + " · language: " + lang() + " · profile: " + (window.sbGetUsername ? window.sbGetUsername() : "guest"),
            "windows: " + ids.length + " open (" + mins + " minimized)",
            "notes: " + kept + " kept, " + gone + " in echoes"
          ];
          if (unreadMail != null) lines.push("letters: " + unreadMail + " unread");
          if (convoCount != null) lines.push("whisper: " + convoCount + " conversations");
          writeLines(lines);
          return;
        }
        case "apps": {
          var reg = (window.SysBaby && window.SysBaby.apps) || {};
          var seq = (window.SysBaby && window.SysBaby.order) || [];
          if (!seq.length) { write("registry is empty."); return; }
          seq.forEach(function (id) {
            var def = reg[id] || {};
            var name = window.sbAppTitle ? window.sbAppTitle(id) : (def.title || id);
            var isOpen = !!((window.openWindows || {})[id]);
            write(pad(id, 12) + pad(name, 16) + (isOpen ? "open" : "—"), isOpen ? "" : "term-dim");
          });
          write(seq.length + " registered · " + (window.sbLaunchableApps ? window.sbLaunchableApps().length : "?") + " launchable — live registry, not a printout.", "term-dim");
          return;
        }
        case "log": {
          var all = String(rest || "").toLowerCase() === "all";
          var J = window.sbJournal || [];
          var slice = all ? J : J.slice(-5);
          if (!all) write("journal — last " + slice.length + " of " + J.length + " entries ('log all' for the whole story):", "term-dim");
          slice.forEach(function (e) { write(e.d + "  " + e.t); });
          if (!all) write("every entry is true. that is the entire trick.", "term-dim");
          return;
        }
        /* ── ХРАНИЛИЩЕ: СЧИТАЕТ, НО НЕ УТЕШАЕТ ─────────────────────────────
           Здесь было запомненное обещание: «none of it has ever left». Оно
           стояло рядом с описью, в которой в тот же день значились три двери
           к чужим хозяевам, и через одну уходил весь текст письма открытым.
           Обещание, которое никто не проверяет, живёт ровно до первого дня,
           когда оно перестаёт быть правдой. Теперь терминал не обещает — он
           СПРАШИВАЕТ У ОПИСИ и называет число.

           И второе. Замок платит обманками за то, чтобы число ключей было
           постоянным: 33 и при пустом профиле, и при сорока записях. А вес
           обманками не замаскирован — 17 КБ пусто, 260 КБ полно. Печатать
           его под замком значило отменять одной строкой всё, за что
           заплачено. Под замком вес не называется, и СКАЗАНО ПОЧЕМУ:
           пропавшее число неотличимо от сломанной команды.
           Охраняется tools/terminal-truth-check.mjs (D-228). */
        case "storage": {
          var count = 0, bytes = 0;
          try {
            for (var si = 0; si < localStorage.length; si++) {
              var sk = localStorage.key(si);
              if (!sk || sk.indexOf("sysbaby.") !== 0) continue;
              count++;
              var sv = localStorage.getItem(sk);
              bytes += sk.length + (sv ? sv.length : 0);
            }
          } catch (e) { write("storage is not readable in this browser."); return; }

          var shut = !!(window.sbVault && typeof window.sbVault.isLocked === "function" && window.sbVault.isLocked());
          if (shut) {
            write("sysbaby.* keys: " + count + " — the same number whether this profile holds nothing or forty notes. the decoys see to that.");
            write("the weight is not told while the lock is on: the count is camouflaged, the weight is not. saying it would undo what the decoys pay for.", "term-dim");
          } else {
            write("sysbaby.* keys: " + count + " · ~" + (bytes >= 1024 ? Math.round(bytes / 1024) + " KB" : bytes + " B") + " of text");
          }

          /* Опись — единственный источник (D-221). Числа здесь буквой нет. */
          var od = (window.SB_OUTWARD && window.SB_OUTWARD.doors) || null;
          if (!od) {
            write("the outward inventory did not load. this terminal will not tell you where your words go until it can read it.", "term-echo");
            return;
          }
          var third = od.filter(function (d) { return d.side === "third"; });
          var hosts = [];
          third.forEach(function (d) { if (d.host && hosts.indexOf(d.host) === -1) hosts.push(d.host); });
          write(od.length + " doors lead outward from this system"
            + (third.length
              ? " — " + third.length + " of them reach machines that are not ours: " + hosts.join(", ") + "."
              : ". not one of them reaches a machine that is not ours."));
          var auto = third.filter(function (d) { return d.byHand === false; });
          if (auto.length) {
            write(auto.length + " of those stranger's doors open BY THEMSELVES. open outward and look now.", "term-echo");
          } else {
            write("not one of the stranger's doors opens by itself — each waits for your hand. 'open outward' shows what each carries and who receives it.", "term-dim");
          }
          return;
        }
        /* ── ПОЛ: ЧТО СИСТЕМА ДЕРЖИТ НА ВАШЕМ ДИСКЕ (D-239) ───────────────
           Опись пола — единственный источник (shared/floor.data.js), тот же,
           что читает закон floor-check. Числа здесь не помнятся: они
           считаются по описи каждый раз. Охраняется tools/floor-check.mjs. */
        case "floor": {
          var fl = (window.SB_FLOOR && window.SB_FLOOR.places) || null;
          if (!fl) { write("the floor inventory did not load. this terminal will not tell you what is kept until it can read it.", "term-echo"); return; }
          var byKind = {};
          fl.forEach(function (pl) { byKind[pl.kind] = (byKind[pl.kind] || 0) + 1; });
          var want = String(rest || "").trim().toLowerCase();
          if (want) {
            var hits = fl.filter(function (pl) {
              return pl.id.toLowerCase().indexOf(want) !== -1 ||
                     (pl.rooms || []).join(" ").toLowerCase().indexOf(want) !== -1;
            });
            if (!hits.length) { write("nothing on the floor matches '" + want + "'."); return; }
            hits.slice(0, 12).forEach(function (pl) {
              write(pad(pl.kind, 11) + pl.id);
              write("            " + pl.what, "term-dim");
            });
            if (hits.length > 12) write("…and " + (hits.length - 12) + " more.", "term-dim");
            return;
          }
          write(fl.length + " places on this disk: " +
            Object.keys(byKind).map(function (k) { return byKind[k] + " " + k; }).join(" · "));
          write("'вещи' is what you made; 'выбор' is what you chose; 'служебное' is what the system remembers about itself.", "term-dim");
          /* НЕ ОБЕЩАТЬ ТОГО, ЧЕГО САМ НЕ ПРОВЕРЯЛ (D-228). Терминал смотрит
             на замок ПРЯМО СЕЙЧАС и говорит о том, что видит; а про то, что
             прячется всё без исключения, он ссылается на закон, который это
             меряет живым запиранием, — не выдавая чужое измерение за своё. */
          var shutNow = !!(window.sbVault && typeof window.sbVault.isLocked === "function" && window.sbVault.isLocked());
          if (shutNow) write("the lock is on right now: none of it is readable from this disk.", "term-dim");
          else write("the lock is off right now. that every one of these hides when it goes on is measured by the system's own law at each board, not promised here.", "term-dim");
          write("'floor <word>' looks up a place by name or by room.", "term-dim");
          return;
        }
        /* ── ПРАВА КОМНАТ · D-242 ──────────────────────────────────────────
           Опись прав СЧИТАЕТСЯ ЖИВЫМ РЕЕСТРОМ в миг вопроса, а не помнится
           здесь списком: терминал спрашивает sbRights, тот спрашивает
           комнаты. И ГЛАВНОЕ — терминал говорит вслух то же, что сказано в
           шапке ядра прав: это замок на двери, а не стена вокруг дома.
           Терминал, обещающий защиту крепче, чем она есть, опаснее молчания.
           Охраняется tools/room-rights-check.mjs. */
        case "rights": {
          var R = window.sbRights;
          if (!R) { write("the rights core did not load. this terminal will not tell you who owns what until it can ask.", "term-echo"); return; }
          var mp = R.map() || {};
          var names = Object.keys(mp).sort();
          var want = String(rest || "").trim().toLowerCase();
          /* Дверь, о которой сказано, обязана открываться (D-240/D-241). */
          if (want === "denied") {
            var jr = R.denials();
            if (!jr.length) { write("no room has been refused this session."); return; }
            jr.slice(-14).forEach(function (r) {
              write(pad(r.room, 11) + r.key + "  " + r.how);
            });
            if (jr.length > 14) write("…" + (jr.length - 14) + " earlier refusals this session.", "term-dim");
            write("the journal lives for this visit only: it exists so a refusal is visible now, not so refusals pile up on the disk as one more place with no owner.", "term-dim");
            return;
          }
          if (want) {
            var found = names.filter(function (k) {
              return k.toLowerCase().indexOf(want) !== -1 ||
                     String(mp[k].owner).toLowerCase().indexOf(want) !== -1;
            });
            if (!found.length) {
              write("no declared place matches '" + want + "'. places nobody declared belong to the core.", "term-dim");
              return;
            }
            found.slice(0, 14).forEach(function (k) {
              write(pad(mp[k].owner, 11) + k);
              if (mp[k].borrowers.length) write("            read by: " + mp[k].borrowers.join(", "), "term-dim");
            });
            if (found.length > 14) write("…and " + (found.length - 14) + " more.", "term-dim");
            return;
          }
          var byRoom = {};
          names.forEach(function (k) { byRoom[mp[k].owner] = (byRoom[mp[k].owner] || 0) + 1; });
          var lent = names.filter(function (k) { return mp[k].borrowers.length; });
          write(names.length + " places have a declared owner: " +
            Object.keys(byRoom).sort().map(function (r) { return r + " " + byRoom[r]; }).join(" · "));
          write("everything not declared belongs to the core. no list of the core's own places is kept anywhere — a second list would drift from the first.", "term-dim");
          if (lent.length) {
            write(lent.length + " of them are read by another room, declared:", "term-dim");
            lent.slice(0, 6).forEach(function (k) {
              write("  " + k + "  " + mp[k].owner + " → " + mp[k].borrowers.join(", "), "term-dim");
            });
          } else {
            write("no room reads another room's place.", "term-dim");
          }
          var sw = R.sweepers();
          if (sw.length) write("walks the whole disk by declaration: " + sw.join(", ") + ".", "term-dim");
          var dn = R.denials();
          write(dn.length ? dn.length + " refusals this session. 'rights denied' lists them."
                          : "no room has been refused this session.", "term-dim");
          write("THIS IS A LOCK ON A DOOR, NOT A WALL AROUND THE HOUSE: every room's code runs on one page, and a room written on purpose can go round it in one line. it catches a mistake, and makes a foreign read visible. it does not catch betrayal.", "term-dim");
          write("'rights <word>' looks up a place by name or by owner.", "term-dim");
          return;
        }
        /* ── ЧТО СЕЙЧАС ЖИВО · D-243 ───────────────────────────────────────
           Ответ СЧИТАЕТСЯ ЖИВЫМИ ПРИБОРАМИ в миг вопроса: диск проверяется
           письмом и чтением, сеть — у браузера, адрес почтальона — у описи
           выходов. Ничего не помнится здесь списком.
           И ПРЕДЕЛ ГОВОРИТСЯ ВМЕСТЕ С ОТВЕТОМ. «Сеть есть» значит, что
           провод воткнут, а не что тот, кто нужен, отвечает; живого
           собеседника машина не измеряет ничем. Терминал, назвавший первое
           и умолчавший о втором, обманет вернее, чем если бы молчал.
           Охраняется tools/alive-check.mjs. */
        case "alive": {
          var A = window.sbAlive;
          if (!A) { write("the liveness core did not load. this terminal will not tell you what works until it can measure it.", "term-echo"); return; }
          var all = A.all(), ids = Object.keys(all);
          var want = String(rest || "").trim().toLowerCase();
          if (want) {
            var hit = ids.filter(function (id) {
              return id.toLowerCase().indexOf(want) !== -1 ||
                     String(all[id].title).toLowerCase().indexOf(want) !== -1;
            });
            if (!hit.length) { write("no room matches '" + want + "'."); return; }
            hit.slice(0, 6).forEach(function (id) {
              var r = all[id];
              write(pad(r.state, 18) + r.title + (r.onDesk ? "" : "  (off the desk)"));
              (r.needs || []).forEach(function (n) {
                write("            " + pad(n.need, 14) + n.verdict + " — " + n.why, "term-dim");
              });
              if (r.why) write("            " + r.why, "term-dim");
            });
            return;
          }
          var tally = A.tally();
          var waiting = ids.filter(function (id) { return all[id].state === "ждёт"; });
          var unsure = ids.filter(function (id) { return all[id].state === "нечем проверить"; });
          write(tally["всего"] + " rooms registered · " + (tally["живо"] || 0) + " doing their work · " +
                (tally["ждёт"] || 0) + " waiting · " + (tally["нечем проверить"] || 0) + " nothing here can check.");
          if (waiting.length) {
            write("waiting on something:", "term-dim");
            waiting.slice(0, 8).forEach(function (id) {
              var miss = (all[id].needs || []).filter(function (n) { return n.verdict === "нет"; })
                .map(function (n) { return n.need; }).join(", ");
              write("  " + pad(all[id].title, 16) + "needs " + miss, "term-dim");
            });
          }
          if (unsure.length) {
            write("cannot be checked from in here:", "term-dim");
            unsure.slice(0, 8).forEach(function (id) {
              var q = (all[id].needs || []).filter(function (n) { return n.verdict === "нечем проверить"; });
              write("  " + pad(all[id].title, 16) + (q[0] ? q[0].need + " — " + q[0].why : ""), "term-dim");
            });
          }
          write("READ THIS BEFORE YOU RELY ON IT: a network answer means the cable is plugged in, not that whoever you need answers. a named postman means the address exists and there is only one of it, not that a letter arrives. a live person on the other end is measured by nothing here at all — silent and absent look the same from inside.", "term-dim");
          write("'alive <word>' asks about one room and prints what was measured.", "term-dim");
          return;
        }
        case "contracts": {
          var c = window.sbContracts;
          if (!c || !Array.isArray(c.declared)) { write("contracts table is unavailable."); return; }
          var missing = c.missing();
          if (missing.length) {
            write(missing.length + " of " + c.declared.length + " declared contracts MISSING:", "term-echo");
            missing.forEach(function (nm) { write("  " + nm); });
          } else {
            write("all " + c.declared.length + " declared module contracts are present. checked just now, not assumed.");
          }
          return;
        }
        case "errors": {
          var errs = window.__sbDiagErrors || [];
          if (!errs.length) { write("no script errors this session."); return; }
          write(errs.length + " error(s) this session:", "term-echo");
          errs.slice(-8).forEach(function (r) { write("  " + (r.where || "?") + " — " + (r.message || "")); });
          return;
        }
        case "lang":
          write("desktop language: " + lang() + " (en · ru · ee — change it in the Control Center or Pulse)");
          return;
        case "history":
          if (!history.length) { write("no commands yet this session."); return; }
          history.slice(0, 12).forEach(function (h, i) { write(pad(String(i + 1), 4) + h, "term-dim"); });
          return;
        case "whoami":
          write((window.sbGetUsername ? window.sbGetUsername() : "guest") + ".sys.baby");
          return;
        case "clear":
          out.innerHTML = "";
          return;
        case "date":
          write(new Date().toLocaleDateString(localeFor(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
          return;
        case "time":
          write(new Date().toLocaleTimeString(localeFor(), { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
          return;
        case "calendar": {
          var d = new Date();
          write(d.toLocaleDateString(localeFor(), { month: "long", year: "numeric" }) + " — today is " +
            d.toLocaleDateString(localeFor(), { weekday: "long", day: "numeric" }));
          return;
        }
        case "notes": {
          var live = window.sbNotesStore ? window.sbNotesStore.load() : [];
          var del = window.sbNotesStore ? window.sbNotesStore.loadDeleted() : [];
          var pinned = live.filter(function (n) { return n.pinned; }).length;
          var desk = live.filter(function (n) { return n.onDesktop; }).length;
          write(live.length + " notes kept (" + desk + " on the desktop, " + pinned + " pinned), " + del.length + " in echoes.");
          return;
        }
        case "open": {
          var want = (rest || "").toLowerCase();
          var id = SYNONYMS[want] || want;
          var apps = (window.SysBaby && window.SysBaby.apps) || {};
          if (!want) { write("usage: open <app>"); return; }
          if (!apps[id]) {
            /* One name deserves a real answer instead of "no app called". */
            if (id === "experimental" || id === "phosphor") {
              write("the experimental bench was retired from the showcase in aug 2026.");
              write("the shop window shows delivered systems; the workbench stays in the shop.", "term-dim");
              return;
            }
            write("no app called '" + want + "'. try 'apps' for the live registry.");
            return;
          }
          /* Слова portfolio/work/cases ведут в build НА РАЗДЕЛ работ, а не на
             первый экран витрины: человек спросил работы (D-066). Терминал
             говорит об этом вслух — иначе выглядело бы, будто он не понял. */
          var section = (want === "portfolio" || want === "work" || want === "cases") ? "cases" : null;
          if (section && typeof window.sbOpenBuildAt === "function") window.sbOpenBuildAt(section);
          else if (window.toggleApp) window.toggleApp(id);
          write("opening " + (window.sbAppTitle ? window.sbAppTitle(id) : (apps[id].title || id)) + "…");
          if (section) write("selected work lives in build since aug 2026 — same cases, same renderer.", "term-dim");
          return;
        }
        case "theme": {
          var mode = (rest || "").toLowerCase();
          if (mode !== "dark" && mode !== "light") { write("usage: theme dark|light"); return; }
          if (window.setTheme) window.setTheme(mode);
          write("theme: " + mode);
          return;
        }
        case "calc": {
          if (!rest) { write("usage: calc <expression>"); return; }
          var safe = rest.replace(/[^0-9+\-*/(). %]/g, "");
          if (!safe.trim() || /[+\-*/%]{3,}/.test(safe)) { write("that isn't arithmetic I can do."); return; }
          var value;
          try { value = Function('"use strict";return (' + safe + ")")(); } catch (e) { value = null; }
          if (value === null || value === undefined || typeof value !== "number" || !isFinite(value)) write("that isn't arithmetic I can do.");
          else write(safe + " = " + value);
          return;
        }
        case "echo":
          write(rest);
          return;
        case "translate":
          write("usage: translate is unavailable in this build — the language selector covers en / ru / ee.");
          return;
        case "seen":
        case "joke":
          write(pick(SEEN[lang()] || SEEN.en));
          return;
        case "who":
          write(WHO[lang()] || WHO.en);
          return;
        case "replay":
          write("replay is not available in this build.");
          return;

        /* ---- unlabelled doors. none of these are in help, Tab or
           did-you-mean: they answer only when someone actually knocks. ---- */
        case "sudo":
          write("no. and also: unnecessary. you already own everything here — that is the point of the house.");
          return;
        case "exit":
        case "logout":
        case "quit":
          write("there is no outside. this desktop ends where your browser tab does — ⌘W works, and everything will still be here when you come back.");
          return;
        case "rm":
          write("nothing here is deleted this casually. anything you remove waits in Echoes until you say otherwise — that was a decision, not an accident.");
          return;
        case "baby":
          write("building automated business for you. the name was never random.");
          return;
        case "hello":
        case "hi":
          write("hello, " + (window.sbGetUsername ? window.sbGetUsername() : "guest") + ". the system is listening.");
          return;
        case "make":
          write("make what — money? that part still needs you. the system only stops you losing time.");
          return;
        case "ping":
          write("pong. locally. this desktop has nowhere to ping — no server, no calls home.");
          return;
        default: {
          var best = null, bestD = 99;
          COMMANDS.forEach(function (c) {
            var d2 = distance(cmd, c);
            if (d2 < bestD) { bestD = d2; best = c; }
          });
          write("command not found: " + cmd + (bestD <= 2 ? " — did you mean " + best + "?" : ""));
          return;
        }
      }
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = input.value;
      input.value = "";
      run(v);
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        if (!history.length) return;
        histIdx = Math.min(history.length - 1, histIdx + 1);
        input.value = history[histIdx];
      } else if (ev.key === "ArrowDown") {
        ev.preventDefault();
        histIdx = Math.max(-1, histIdx - 1);
        input.value = histIdx === -1 ? "" : history[histIdx];
      } else if (ev.key === "Tab") {
        ev.preventDefault();
        var frag = input.value.trim().toLowerCase();
        if (!frag) return;
        var hits = COMMANDS.filter(function (c) { return c.indexOf(frag) === 0; });
        if (hits.length === 1) input.value = hits[0] + " ";
        else if (hits.length > 1) write(hits.join("   "), "term-dim");
      }
    });
    rootEl.querySelectorAll(".term-chip").forEach(function (b) {
      b.addEventListener("click", function () { run(b.getAttribute("data-cmd")); });
    });
    rootEl.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest(".term-chip")) return;
      try { input.focus(); } catch (e) { /* ignore */ }
    });

    greeting();
    rootEl.__sbTerm = { run: run, write: write, focus: function () { try { input.focus(); } catch (e) { /* ignore */ } } };
    return rootEl.__sbTerm;
  };

  /* ------------------------------------------------------- terminal app */
  if (typeof window.registerApp === "function") {
    window.registerApp("terminal", {
      title: "Terminal",
      label: "Terminal",
      /* Estonian keeps the word, Russian does not. Declared rather than
         assumed — this was the one app registered without an i18n block, and
         it is why the dock still said "Terminal" on a Russian desktop. */
      i18n: {
        ru: { title: "Терминал", label: "Терминал" },
        ee: { title: "Terminal", label: "Terminal" }
      },
      color: "linear-gradient(160deg,#3ad0a8 0%,#22a884 55%,#128063 100%)",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/></svg>',
      /* ОКНО ШИРЕ СВОИХ ПЕРВЫХ СЛОВ (D-231). При 560 лента выходила 530px,
         а собственная вторая строка приветствия — 71 знак моноширинного
         набора, то есть ~533px, — переносилась на ТРИ строки в первый же
         кадр. Окно, которое уже своей же первой строки, незакончено.
         Охраняется tools/line-measure-check.mjs. */
      size: { w: 660, h: 420 },
      deskPos: { x: 200, y: 320 },
      render: function (win) {
        var body = win.el.querySelector(".window-body");
        if (!body) return;
        if (!window.sbMountTerminal) {
          body.innerHTML = '<div class="app-fail">The terminal did not load. Reloading the page usually fixes it.</div>';
          return;
        }
        var host = body.querySelector(".sb-terminal");
        if (!host) {
          body.innerHTML = "";
          host = doc.createElement("div");
          host.className = "term-host";
          body.appendChild(host);
          var term = window.sbMountTerminal(host);
          if (term && !document.documentElement.classList.contains("is-touch")) {
            setTimeout(function () { term.focus(); }, 120);
          }
        }
      }
    });
  }

  /* --------------------------------- contracts declaration table (§12) */
  window.sbContracts = {
    declared: [
      { name: "sbDB", file: "core/store.js", args: "-", returns: "storage api" },
      { name: "sbProfiles", file: "core/store.js", args: "-", returns: "profiles api" },
      { name: "sbNotesStore", file: "core/store.js", args: "-", returns: "notes api" },
      { name: "sbAddQuickNote", file: "core/store.js", args: "text:string", returns: "id:string" },
      { name: "sbPersistNotePosition", file: "core/store.js", args: "id:string, x:px, y:px", returns: "bool" },
      { name: "sbExportProfile", file: "core/store.js", args: "profileId?:string", returns: "envelope" },
      { name: "sbImportProfile", file: "core/store.js", args: "text|object, opts", returns: "{ok,count}|{ok:false,error}" },
      { name: "registerApp", file: "core/shell.js", args: "id:string, def:object", returns: "void" },
      { name: "toggleApp", file: "core/shell.js", args: "id:string", returns: "win|undefined" },
      { name: "closeWindow", file: "core/shell.js", args: "id:string", returns: "void" },
      { name: "focusWindow", file: "core/shell.js", args: "id:string", returns: "void" },
      { name: "renderApp", file: "core/shell.js", args: "id:string", returns: "void" },
      { name: "getOpenWindow", file: "core/shell.js", args: "id:string", returns: "win|undefined" },
      { name: "showToast", file: "core/shell.js", args: "title, text, iconSvg, force?, extraClass?, kind?", returns: "handle|null" },
      { name: "escapeHtml", file: "core/shell.js", args: "s:string", returns: "string" },
      { name: "sbAnimateFigure", file: "core/shell.js", args: "el, value|[lo,hi], fmt?", returns: "void" },
      { name: "sbFetchWithTimeout", file: "core/shell.js", args: "url, opts|ms, ms?", returns: "Promise<Response>" },
      { name: "sbWallpaperPulse", file: "core/shell.js", args: "x:px, y:px", returns: "void (no-op)" },
      { name: "sbNoteGlowSet", file: "core/shell.js", args: "slot, x:frac, y:frac, intensity", returns: "void (no-op)" },
      { name: "sbDesktopGrid", file: "core/shell.js", args: "-", returns: "{originX,originY,cellW,cellH,cols,rows}" },
      { name: "sbSetIconHidden", file: "core/shell.js", args: "id:string, hidden:bool", returns: "bool" },
      { name: "sbRegisterPanel", file: "core/panels.js", args: "overlayId, closeBtnId, onOpen?", returns: "{open,close,isOpen}" },
      { name: "sbAnyPanelOpen", file: "core/panels.js", args: "-", returns: "bool" },
      { name: "sbAddClip", file: "core/panels.js", args: "text:string", returns: "bool" },
      { name: "openCmdk", file: "core/palette.js", args: "prefill?:string", returns: "void" },
      { name: "sbSetWidgetHidden", file: "core/desktop.js", args: "id:string, hidden:bool", returns: "bool" },
      { name: "sbTidyWidgets", file: "core/desktop.js", args: "-", returns: "void" },
      { name: "sbGetUsername", file: "core/topbar.js", args: "-", returns: "string" },
      { name: "sbSetUsername", file: "core/topbar.js", args: "name:string", returns: "string" },
      { name: "sbMountTerminal", file: "core/terminal.js", args: "root:Element", returns: "{run,write,focus}" },
      { name: "sbLinksFor", file: "core/links.js", args: "messageId:number", returns: "link[]" }
    ],
    missing: function () {
      return this.declared.filter(function (d) { return typeof window[d.name] === "undefined"; }).map(function (d) { return d.name; });
    }
  };
})();
