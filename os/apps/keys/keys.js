/*
 * keys.js — КЛЮЧИ. Приложение, ради которого построено всё остальное (D-209).
 *
 * ПОВОД, дословно от основателя: «прошу совет сделать для меня в первую
 * очередь большой подарок. разработать приложение которого не хватает».
 * В карте притяжения оно стоит вторым по силе — и первым по тому, как часто
 * человек к нему возвращается: пароль нужен каждый день, а не по настроению.
 *
 * ГЛАВНОЕ ЗДЕСЬ — ЧЕГО В НЁМ НЕТ. Пароля нет. Для мест, заведённых здесь,
 * он не хранится нигде: выводится из мастер-ключа хранилища, имени места и
 * счётчика. В конверте на диске лежит имя места — не пароль.
 *   · Красть нечего.
 *   · Терять нечего: новое устройство, то же слово — и всё вернулось.
 *   · Синхронизировать нечего: выводится одинаково везде.
 * Счётчик существует ровно затем, чтобы сменить пароль одного места, не
 * трогая остальные: +1 — и это другой пароль навсегда.
 *
 * И ЧЕГО ЭТО НЕ ДАЁТ, сказано человеку прямо на экране, а не в примечании:
 * пароли, заведённые НЕ здесь, вывести нельзя — их приходится хранить, и для
 * них остаётся обычный конверт. И если мастер-слово утечёт, утечёт всё разом.
 *
 * Охраняется tools/keys-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="8.2" cy="12" r="3.4"/><path d="M11.6 12h8.2M17 12v3.1M14.4 12v2.2"/></svg>';

  var STORE_KEY = "sysbaby.keys.v1";
  var WIPE_AFTER = 20000;     /* через сколько буфер обмена затирается */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() {
    try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; }
  }

  var UI = {
    en: {
      title: "Keys", label: "Keys",
      lead: "Passwords for places you keep. For places created here the password is not stored anywhere — it is derived from your locked vault, on this device, every time.",
      needLock: "Derived keys need the lock. Set a password on your system first — then nothing here has to be stored at all.",
      addPlace: "New place", place: "Place", login: "Login or e-mail", note: "Note",
      modeDerived: "Derived — nothing is stored", modeStored: "My own — kept in an envelope",
      own: "The password you already have", save: "Save", cancel: "Cancel",
      show: "Show", hide: "Hide", copy: "Copy", copied: "Copied — the clipboard clears itself in 20 seconds",
      rotate: "New password", rotated: "Changed. The old one will never come back.",
      remove: "Forget this place", search: "Search places", empty: "Nothing here yet.",
      counter: "change", derived: "derived", stored: "stored",
      honest: "What this cannot do: passwords made elsewhere cannot be derived — those are kept in an envelope like everything else. And one master word opens all of them at once: that is the price of having nothing to steal.",
            costTitle: "What actually protects all of this",
      costBody: "One attempt at your master word costs {ms} ms on this very device — measured just now, not promised. A machine a thousand times faster still needs {years} to walk through a six-word phrase.",
      costHonest: "And this is the honest part: the strength of the generated password barely matters. Nobody attacks it — they attack the one word you type. Make that one long.",
      measure: "Measure it here",
      dupe: "the same password is used in another place",
    },
    ru: {
      title: "Ключи", label: "Ключи",
      lead: "Пароли мест, которые вы держите. Для мест, заведённых здесь, пароль не хранится нигде — он выводится из вашего запертого хранилища, на этом устройстве, каждый раз заново.",
      needLock: "Выведенным ключам нужен замок. Сперва поставьте пароль на систему — и тогда здесь вообще нечего будет хранить.",
      addPlace: "Новое место", place: "Место", login: "Логин или почта", note: "Заметка",
      modeDerived: "Выведенный — не хранится нигде", modeStored: "Свой — лежит в конверте",
      own: "Пароль, который у вас уже есть", save: "Сохранить", cancel: "Отмена",
      show: "Показать", hide: "Скрыть", copy: "Копировать", copied: "Скопировано — буфер сотрётся через 20 секунд",
      rotate: "Новый пароль", rotated: "Сменён. Прежний не вернётся никогда.",
      remove: "Забыть это место", search: "Поиск по местам", empty: "Здесь пока пусто.",
      counter: "смена", derived: "выведенный", stored: "хранимый",
      honest: "Чего это не может: пароли, заведённые не здесь, вывести нельзя — они лежат в конверте, как всё остальное. И одно мастер-слово открывает их все разом: это и есть цена того, что красть нечего.",
            costTitle: "Что на самом деле держит всё это",
      costBody: "Одна попытка подобрать ваше мастер-слово стоит {ms} мс на этом самом устройстве — измерено сейчас, а не обещано. Машине в тысячу раз быстрее на перебор фразы из шести слов нужно {years}.",
      costHonest: "И вот честная часть: стойкость выданного пароля почти ничего не решает. Его никто не подбирает — подбирают то единственное слово, которое вы набираете руками. Сделайте его длинным.",
      measure: "Измерить здесь",
      dupe: "такой же пароль стоит ещё в одном месте",
    },
    ee: {
      title: "Võtmed", label: "Võtmed",
      lead: "Kohtade paroolid. Siin loodud kohtade parool ei ole kuskil salvestatud — see tuletatakse lukustatud hoidlast, selles seadmes, iga kord uuesti.",
      needLock: "Tuletatud võtmed vajavad lukku. Pane esmalt süsteemile parool — siis pole siin üldse midagi hoida.",
      addPlace: "Uus koht", place: "Koht", login: "Kasutaja või e-post", note: "Märkus",
      modeDerived: "Tuletatud — ei salvestata kuskil", modeStored: "Oma — hoitakse ümbrikus",
      own: "Parool, mis sul juba on", save: "Salvesta", cancel: "Loobu",
      show: "Näita", hide: "Peida", copy: "Kopeeri", copied: "Kopeeritud — lõikelaud tühjeneb 20 sekundiga",
      rotate: "Uus parool", rotated: "Muudetud. Vana enam ei naase.",
      remove: "Unusta see koht", search: "Otsi kohti", empty: "Siin pole veel midagi.",
      counter: "vahetus", derived: "tuletatud", stored: "hoitud",
      honest: "Mida see ei suuda: mujal loodud paroole ei saa tuletada — need hoitakse ümbrikus nagu kõik muu. Ja üks peasõna avab need kõik korraga: see ongi hind selle eest, et varastada pole midagi.",
            costTitle: "Mis seda kõike tegelikult hoiab",
      costBody: "Üks katse sinu peasõna ära arvata maksab sellessamas seadmes {ms} ms — mõõdetud praegu, mitte lubatud. Tuhat korda kiiremal masinal kulub kuuesõnalise fraasi läbikäimiseks {years}.",
      costHonest: "Ja aus osa: loodud parooli tugevus ei otsusta peaaegu midagi. Seda ei murra keegi — murtakse seda ühte sõna, mille sa käsitsi kirjutad. Tee see pikaks.",
      measure: "Mõõda siin",
      dupe: "sama parool on veel ühes kohas",
    }
  };

  /* ── записи ───────────────────────────────────────────────────────────── */
  /* ── ХРАНИЛИЩЕ ЧЕРЕЗ СВОЙ ЯЩИК · D-242 ──────────────────────────────────
     Здесь стояли свои обёртки над складом, и такие же были у каждой комнаты.
     Комната ходила на диск прямо, и ни одна строка системы не говорила,
     какие места ей принадлежат. Теперь диск виден через ящик, выданный по
     объявлению keeps/reads (см. registerApp ниже), а защита от закрытого
     хранилища живёт в ОДНОМ месте — os/core/rights.js.
     ЯЩИК СПРАШИВАЕТСЯ, А НЕ ЗАПОМИНАЕТСЯ: комната объявляется раньше, чем
     поднимается ядро прав. */
  function box() {
    return window.sbRights
      ? window.sbRights.box("keys")
      : { get: function () { return null; }, set: function () { return false; },
          remove: function () { return false; }, flush: function () { } };
  }
  function readAll() {
    try {
      var raw = box().get(STORE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function writeAll(list) {
    try { box().set(STORE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }
  window.sbKeysAll = function () { return readAll(); };

  var shown = {};          /* какие пароли сейчас открыты */
  var adding = false;
  var query = "";
  var wipeTimer = null;

  function vaultOpen() {
    try { return !!(window.sbVault && window.sbVault.available() && window.sbVault.isLocked() && window.sbVault.isOpen()); }
    catch (e) { return false; }
  }

  function secretOf(rec) {
    if (rec.mode === "stored") return Promise.resolve(rec.secret || "");
    if (!vaultOpen()) return Promise.resolve(null);
    return window.sbVault.siteKey(rec.place, rec.counter || 0, rec.length || 20)
      .then(function (v) { return v; }, function () { return null; });
  }

  function copyOut(text, say) {
    var done = function () {
      say();
      if (wipeTimer) clearTimeout(wipeTimer);
      /* Буфер затирается сам. Сказано вслух: если между копированием и
         затиранием человек скопировал что-то своё, сотрётся оно — поэтому
         срок короткий и объявленный, а не тайный. */
      wipeTimer = setTimeout(function () {
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(""); }
        catch (e) { /* ignore */ }
      }, WIPE_AFTER);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
        return;
      }
    } catch (e) { /* ниже */ }
    done();
  }

  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var L = lang();
    /* ОТКАТ: перевода на этот язык нет — честно падаем на английский.
       Это объявленный договор перевода, а не подмена. */
    var t = UI[L] || UI.en;
    var list = readAll();
    var q = query.trim().toLowerCase();
    var mine = q ? list.filter(function (r) {
      return (r.place + " " + (r.login || "")).toLowerCase().indexOf(q) !== -1;
    }) : list;

    var out = '<div class="ky-wrap">';
    out += '<header class="ky-head">' +
      '<h1 class="ky-title">' + esc(t.title) + "</h1>" +
      '<p class="ky-lead">' + esc(t.lead) + "</p>" +
      (vaultOpen() ? "" : '<p class="ky-need">' + esc(t.needLock) + "</p>") +
      "</header>";

    out += '<div class="ky-bar">' +
      '<input type="search" class="ky-search" id="kySearch" placeholder="' + esc(t.search) + '" aria-label="' + esc(t.search) + '" value="' + esc(query) + '">' +
      '<button type="button" class="ky-add" id="kyAdd">+ ' + esc(t.addPlace) + "</button>" +
      "</div>";

    if (adding) {
      out += '<form class="ky-form" id="kyForm">' +
        '<input type="text" name="place" required placeholder="' + esc(t.place) + '" aria-label="' + esc(t.place) + '">' +
        '<input type="text" name="login" placeholder="' + esc(t.login) + '" aria-label="' + esc(t.login) + '">' +
        '<label class="ky-mode"><input type="radio" name="mode" value="derived" checked> ' + esc(t.modeDerived) + "</label>" +
        '<label class="ky-mode"><input type="radio" name="mode" value="stored"> ' + esc(t.modeStored) + "</label>" +
        '<input type="password" name="secret" placeholder="' + esc(t.own) + '" aria-label="' + esc(t.own) + '" autocomplete="new-password">' +
        '<input type="text" name="note" placeholder="' + esc(t.note) + '" aria-label="' + esc(t.note) + '">' +
        '<div class="ky-form-acts">' +
          '<button type="submit" class="ky-save">' + esc(t.save) + "</button>" +
          '<button type="button" class="ky-cancel" id="kyCancel">' + esc(t.cancel) + "</button>" +
        "</div>" +
        "</form>";
    }

    if (!mine.length) {
      out += '<p class="ky-empty">' + esc(t.empty) + "</p>";
    } else {
      out += '<div class="ky-list">';
      mine.forEach(function (r) {
        var open = !!shown[r.id];
        out += '<article class="ky-row" data-id="' + esc(r.id) + '">' +
          '<div class="ky-row-top">' +
            '<h3 class="ky-place">' + esc(r.place) + "</h3>" +
            '<span class="ky-kind ' + (r.mode === "stored" ? "stored" : "derived") + '">' +
              esc(r.mode === "stored" ? t.stored : t.derived) +
              (r.mode === "stored" ? "" : " · " + esc(t.counter) + " " + (r.counter || 0)) +
            "</span>" +
          "</div>" +
          (r.login ? '<p class="ky-login">' + esc(r.login) + "</p>" : "") +
          '<p class="ky-secret' + (open ? " open" : "") + '" data-secret="' + esc(r.id) + '">' +
            (open ? '<span class="ky-dots">·····</span>' : '<span class="ky-dots">••••••••••••</span>') + "</p>" +
          (r.note ? '<p class="ky-note">' + esc(r.note) + "</p>" : "") +
          '<div class="ky-acts">' +
            '<button type="button" data-act="show">' + esc(open ? t.hide : t.show) + "</button>" +
            '<button type="button" data-act="copy">' + esc(t.copy) + "</button>" +
            (r.mode === "stored" ? "" : '<button type="button" data-act="rotate">' + esc(t.rotate) + "</button>") +
            '<button type="button" data-act="remove" class="ky-del">' + esc(t.remove) + "</button>" +
          "</div>" +
          "</article>";
      });
      out += "</div>";
    }

    out += '<p class="ky-honest">' + esc(t.honest) + "</p>";
    /* ── ЦЕНА ОДНОЙ ПОПЫТКИ, ИЗМЕРЕННАЯ ЗДЕСЬ ЖЕ ────────────────────────
       Не обещание в рекламе, а секундомер на этом устройстве. И рядом —
       то, что производители менеджеров паролей не пишут никогда: стойкость
       ВЫДАННОГО пароля почти ничего не решает, потому что подбирают не его. */
    out += '<section class="ky-cost">' +
      '<h3>' + esc(t.costTitle) + "</h3>" +
      '<p class="ky-cost-line" id="kyCost">' +
        '<button type="button" id="kyMeasure">' + esc(t.measure) + "</button>" +
      "</p>" +
      '<p class="ky-cost-honest">' + esc(t.costHonest) + "</p>" +
      "</section>";
    out += '<p class="ky-say" id="kySay" role="status"></p>';
    out += "</div>";

    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
    wire(host, win, t);
  }

  function wire(host, win, t) {
    var say = function (m) {
      var el = host.querySelector("#kySay");
      if (el) el.textContent = m || "";
    };

    var measure = host.querySelector("#kyMeasure");
    if (measure) measure.addEventListener("click", function () {
      var line = host.querySelector("#kyCost");
      if (!line) return;
      measure.disabled = true;
      var t0 = (window.performance || Date).now();
      /* Меряем НАСТОЯЩУЮ дверь: неверное слово проходит ту же растяжку, что
         и верное, — иначе замер был бы о чём-то другом. */
      var probe = (window.sbVault && window.sbVault.isLocked())
        ? window.sbVault.unlock("измерение-не-пароль-" + Math.random())
        : Promise.resolve(false);
      probe.then(function () {
        var ms = Math.round((window.performance || Date).now() - t0);
        /* 72 знака в алфавите, но подбирают не пароль, а СЛОВО. Считаем по
           фразе из шести обиходных слов — это ≈ 2^62 сочетаний при словаре
           в 7776 слов. Делим на тысячу таких машин, работающих разом. */
        var tries = Math.pow(7776, 6);
        var years = (tries * (ms / 1000)) / 1000 / (365.25 * 24 * 3600);
        var human = years >= 1e9 ? (years / 1e9).toFixed(0) + " млрд лет"
                  : years >= 1e6 ? (years / 1e6).toFixed(0) + " млн лет"
                  : years >= 1 ? Math.round(years) + " лет" : "меньше года";
        line.textContent = String(t.costBody).replace("{ms}", ms).replace("{years}", human);
      }, function () { measure.disabled = false; });
    });

    var search = host.querySelector("#kySearch");
    if (search) search.addEventListener("input", function () {
      query = search.value; render(win);
      var again = host.querySelector("#kySearch");
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });

    var add = host.querySelector("#kyAdd");
    if (add) add.addEventListener("click", function () { adding = true; render(win); });
    var cancel = host.querySelector("#kyCancel");
    if (cancel) cancel.addEventListener("click", function () { adding = false; render(win); });

    var form = host.querySelector("#kyForm");
    if (form) form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = new FormData(form);
      var place = String(f.get("place") || "").trim();
      if (!place) return;
      var mode = String(f.get("mode") || "derived");
      var list = readAll();
      list.unshift({
        id: "k" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        place: place,
        login: String(f.get("login") || "").trim(),
        mode: mode,
        counter: 0,
        length: 20,
        secret: mode === "stored" ? String(f.get("secret") || "") : "",
        note: String(f.get("note") || "").trim(),
        at: Date.now()
      });
      writeAll(list);
      adding = false;
      render(win);
    });

    host.querySelectorAll(".ky-row").forEach(function (row) {
      var id = row.getAttribute("data-id");
      var rec = readAll().filter(function (r) { return r.id === id; })[0];
      if (!rec) return;
      row.querySelectorAll("[data-act]").forEach(function (b) {
        b.addEventListener("click", function () {
          var act = b.getAttribute("data-act");
          if (act === "show") {
            if (shown[id]) { delete shown[id]; render(win); return; }
            secretOf(rec).then(function (v) {
              if (v == null) { say(t.needLock); return; }
              shown[id] = true;
              render(win);
              var el = host.querySelector('[data-secret="' + id + '"]');
              if (el) el.textContent = v;
            });
            return;
          }
          if (act === "copy") {
            secretOf(rec).then(function (v) {
              if (v == null) { say(t.needLock); return; }
              copyOut(v, function () { say(t.copied); });
            });
            return;
          }
          if (act === "rotate") {
            var list = readAll();
            for (var i = 0; i < list.length; i++) {
              if (list[i].id === id) { list[i].counter = (list[i].counter || 0) + 1; break; }
            }
            writeAll(list);
            delete shown[id];
            render(win);
            say(t.rotated);
            return;
          }
          if (act === "remove") {
            writeAll(readAll().filter(function (r) { return r.id !== id; }));
            delete shown[id];
            render(win);
          }
        });
      });
    });

    /* Открытые пароли дорисовываются после разметки: в HTML их нет никогда,
       поэтому в исходном тексте окна пароля не встретить даже открытым. */
    Object.keys(shown).forEach(function (id) {
      var rec = readAll().filter(function (r) { return r.id === id; })[0];
      var el = host.querySelector('[data-secret="' + id + '"]');
      if (!rec || !el) return;
      secretOf(rec).then(function (v) { if (v != null) el.textContent = v; });
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("keys", {
      /* ЧТО НУЖНО, ЧТОБЫ ДЕЛАТЬ РАБОТУ (D-243). Комната НАЗЫВАЕТ нужду;
         есть ли она — измеряет прибор, а не она сама.
         Охраняется tools/alive-check.mjs. */
      needs: ["диск"],
      /* СВОЁ МЕСТО НА ДИСКЕ (D-242). Охраняется room-rights-check.mjs. */
      keeps: [STORE_KEY],
      title: UI.en.title,
      label: UI.en.label,
      i18n: {
        ru: { title: UI.ru.title, label: UI.ru.label },
        ee: { title: UI.ee.title, label: UI.ee.label }
      },
      color: "linear-gradient(160deg,#8fd3c7 0%,#3f8f86 55%,#14413d 100%)",
      icon: ICON,
      size: { w: 680, h: 660 },
      retranslate: true,
      render: render
    });
  }
})();
