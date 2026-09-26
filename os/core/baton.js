/*
 * baton.js — ЭСТАФЕТА: СИСТЕМА ДЕРЖИТ МЕСТО, ГДЕ ВЫ ОСТАНОВИЛИСЬ (D-286).
 *
 * ПОВОД. Основатель, 25.09.2026, «THE IRRESISTIBLE CORE»: найти механизм,
 * ради которого человек возвращается сам, — без зависимости и без запертого
 * выхода, — и «если ответ найден — СТРОЙ ЕГО». Совет разобрал тридцать
 * четыре модели удержания и выбрал одну (страница «Ядро притяжения»):
 * возвращаются не к счётчику и не к ленте, а к СВОЕМУ НЕЗАКОНЧЕННОМУ.
 * «Ты остановился здесь. Продолжим?» — слова самого основателя.
 *
 * ЧТО ДЕЛАЕТ:
 *   • УХОД (вкладку спрятали, закрыли, перезагрузили) запоминает, какие
 *     комнаты открыты, какая в фокусе, какие свёрнуты, и МЕСТО внутри
 *     комнаты, если комната умеет его назвать (def.where / def.resume);
 *   • ВОЗВРАЩЕНИЕ (новый вход в систему) ставит одну тихую карточку на ту
 *     линию, откуда говорит стол. Ничего не открывается само;
 *   • «Продолжить» — одно касание; «Отпустить» — место забыто, с отменой;
 *     касание мимо кнопок — «не сейчас»: карточка уходит, место остаётся.
 *
 * ЧЕГО НЕ ДЕЛАЕТ — И ЭТО ТАКАЯ ЖЕ ЧАСТЬ РЕШЕНИЯ:
 *   • не зовёт снаружи: ни извещения, ни звука, ни значка, ни счётчика
 *     дней. Карточка появляется только тогда, когда человек пришёл сам;
 *   • не хранит в инкогнито ни байта; выключенное — не хранит;
 *   • под замком лежит только в конверте: запись идёт через sbDB, а он
 *     кладёт на диск запечатанное (D-164). Пока дверь закрыта, эстафета
 *     молчит: читать ей нечего, и она не делает вид, что читать нечего;
 *   • не держит своей копии памяти: каждое чтение — из хранилища, поэтому
 *     эпоха замка (D-274) её не касается.
 *
 * Охраняется tools/baton-check.mjs.
 */
(function () {
  "use strict";
  var doc = document;
  var KEY = "sysbaby.baton.v1";
  /* Счёт ответов на СВОЙ вопрос (D-289): сколько раз продолжили, отпустили,
     отложили. Не поведение человека, а мера самой эстафеты — по ней
     основатель решит, оставаться ли ей включённой (радар baton-continuity).
     Лежит под замком, виден в Приватности, стирается вместе с местом. */
  var COUNTS = "sysbaby.baton.counts";
  /* ── СЛОВО ЧЕЛОВЕКА (D-290) ─────────────────────────────────────────────
     «Зачем» система не угадывает: его говорит только человек, одной строкой
     и только по своей просьбе (быстрые действия → «Нить: зачем…»). Слово
     привязано к делу — к той вещи, что была в фокусе, когда его сказали.
     То же дело при следующем уходе — то же слово; другое дело — без него.
     «Нет, я делал другое» — просто новое слово поверх прежнего. */
  var WHY = "sysbaby.baton.why";
  var TOGGLE = "baton";

  var UI = {
    en: {
      title: "You stopped here. Shall we continue?",
      go: "Continue", release: "Let go",
      released: "Let go of where you stopped", releasedBody: "The rooms stay as they are; only the place is forgotten.",
      now: "just now", min: "{n} min ago", hour: "{n} h ago", day: "{n} d ago", since: "since {date}",
      changed: "changed since", q: "“{s}”", thought: "“…{s}”",
      why: "What for: {s}", whyAsk: "What is this for? One line in your own words — the system will say it back when you return.",
      whyCmd: "Thread: what for…",
      palette: "Continue where you stopped", paletteSub: "Where you stopped"
    },
    ru: {
      title: "Вы остановились здесь. Продолжим?",
      go: "Продолжить", release: "Отпустить",
      released: "Место отпущено", releasedBody: "Комнаты остались как есть — забыто только место.",
      now: "только что", min: "{n} мин назад", hour: "{n} ч назад", day: "{n} дн. назад", since: "с {date}",
      changed: "менялась с тех пор", q: "«{s}»", thought: "«…{s}»",
      why: "Зачем: {s}", whyAsk: "Зачем вы это делаете? Одна строка своими словами — система скажет её вам, когда вернётесь.",
      whyCmd: "Нить: зачем…",
      palette: "Продолжить с того места", paletteSub: "Где вы остановились"
    },
    ee: {
      title: "Jäite siin pooleli. Jätkame?",
      go: "Jätka", release: "Lase lahti",
      released: "Koht on lahti lastud", releasedBody: "Toad jäid nagu olid — unustati ainult koht.",
      now: "just nüüd", min: "{n} min tagasi", hour: "{n} h tagasi", day: "{n} p tagasi", since: "alates {date}",
      changed: "on vahepeal muutunud", q: "„{s}“", thought: "„…{s}“",
      why: "Milleks: {s}", whyAsk: "Milleks te seda teete? Üks rida oma sõnadega — süsteem ütleb selle teile tagasi, kui naasete.",
      whyCmd: "Niit: milleks…",
      palette: "Jätka sealt, kus pooleli jäi", paletteSub: "Kus te pooleli jäite"
    }
  };
  function lang() { try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; } }
  function t(k, vars) {
    /* ОТКАТ: фразы на этом языке нет — английская. Тот же договор, что у
       словаря ядра (sbTIn): неполный язык система показывает меткой. */
    var L = UI[lang()] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ, а не пустая строка. */
    var s = L[k] || UI.en[k] || k;
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, n) { return Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m; });
  }

  function db() { return window.sbDB || null; }
  function apps() { return (window.SysBaby && window.SysBaby.apps) || {}; }
  function allowed() {
    if (window.sbIncognitoActive) return false;
    return !window.sbGetControlToggle || window.sbGetControlToggle(TOGGLE) !== false;
  }
  function readable() { var d = db(); return !!d && !(d.closed && d.closed()); }

  function read() {
    if (!readable()) return null;
    var raw = db().get(KEY);
    if (!raw) return null;
    try {
      var b = JSON.parse(raw);
      if (!b || b.v !== 1 || !Array.isArray(b.rooms)) return null;
      var reg = apps();
      b.rooms = b.rooms.filter(function (r) { return r && reg[r.id]; });
      return b.rooms.length ? b : null;
    } catch (e) { return null; }
  }
  function write(b) {
    var d = db();
    if (!d) return false;
    if (b) d.set(KEY, JSON.stringify(b)); else d.remove(KEY);
    /* Уход — последний миг страницы: ждать простоя, чтобы записать, некогда. */
    if (d.flushSync) d.flushSync();
    return true;
  }

  /* Что открыто — у самой системы, а не у памяти эстафеты. */
  function snapshot() {
    var wins = window.openWindows || {};
    var reg = apps();
    var ids = Object.keys(wins).filter(function (id) { return reg[id]; });
    if (!ids.length) return null;
    var rows = ids.map(function (id) {
      var w = wins[id], def = reg[id], place = null;
      if (typeof def.where === "function") {
        try { place = def.where() || null; } catch (e) { if (window.console) console.error("[baton] where failed", id, e); place = null; }
      }
      return { id: id, z: w.z || 0, min: !!w.minimized, place: place };
    }).sort(function (a, b) { return a.z - b.z; });
    var focus = null;
    rows.forEach(function (r) { if (!r.min) focus = r.id; });
    return { v: 1, at: Date.now(), focus: focus, rooms: rows.map(function (r) { return { id: r.id, min: r.min, place: r.place }; }) };
  }

  /* Уход. Ничего не открыто — дело закончено или не начато: прежнее место,
     если оно есть и на него ещё не ответили, остаётся ждать. */
  var answered = false;
  function hold() {
    if (!allowed() || !readable()) return false;
    var snap = snapshot();
    if (!snap) return false;
    var w = readWhy();
    if (w && w.anchor === anchorOf(snap)) snap.why = w.why;
    return write(snap);
  }
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") hold(); });
  window.addEventListener("pagehide", hold);

  /* ── ВРЕМЯ ОТСУТСТВИЯ МЕНЯЕТ ТО, КАК НАЗЫВАЕТСЯ МЕСТО (D-289) ───────────
     Минуты и часы говорят «сколько назад»; через неделю счёт дней уже не
     читается — называется день, с которого нить ждёт. */
  function ago(at) {
    var s = Math.max(0, Math.round((Date.now() - at) / 1000));
    /* ПОСТОЯННАЯ: 60, 3600, 86400 — секунды в минуте, часе и сутках:
       границы единиц счёта, а не настройка. */
    if (s < 60) return t("now");
    if (s < 3600) return t("min", { n: Math.round(s / 60) });
    if (s < 86400) return t("hour", { n: Math.round(s / 3600) });
    /* ПОСТОЯННАЯ: 7 суток — неделя: дальше «N дней назад» считать в уме
       труднее, чем прочесть день. */
    if (s < 7 * 86400) return t("day", { n: Math.round(s / 86400) });
    var tag = { ru: "ru", ee: "et", en: "en" }[lang()] || "en";
    var date = "";
    try { date = new Date(at).toLocaleDateString(tag, { day: "numeric", month: "short" }); } catch (e) { date = new Date(at).toISOString().slice(0, 10); }
    return t("since", { date: date });
  }
  function title(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }
  function cut(s, n) { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  /* Чьё это дело: комната в фокусе и её вещь. */
  function anchorOf(b) {
    if (!b || !b.focus) return "";
    var r = null;
    b.rooms.forEach(function (x) { if (x.id === b.focus) r = x; });
    var pl = r && r.place;
    var who = pl ? (pl.id || pl.docId || pl.file || pl.card || pl.section || "") : "";
    return b.focus + ":" + who;
  }
  function readWhy() {
    if (!readable()) return null;
    try { var w = JSON.parse(db().get(WHY) || "null"); return w && w.why ? w : null; } catch (e) { return null; }
  }
  /* Что стоит на месте СЕЙЧАС. Место — указатель: комната, умеющая его
     прочесть (def.recall), отвечает живым текстом; вещи больше нет — null,
     и имени в карточке не будет. Старое место без recall говорит своим
     именем, если его сохранили (так было до D-289). */
  function recall(r, at) {
    if (!r.place) return null;
    var def = apps()[r.id] || {};
    if (typeof def.recall === "function") {
      try { return def.recall(r.place, at) || null; } catch (e) { if (window.console) console.error("[baton] recall failed", r.id, e); return null; }
    }
    return r.place.name ? { name: String(r.place.name) } : null;
  }
  function said(b) {
    var rows = b.rooms.slice();
    /* Первой называется комната, в которой человек был. */
    rows.sort(function (a, c) { return (c.id === b.focus) - (a.id === b.focus); });
    var thought = "";
    var parts = rows.map(function (r) {
      var now = recall(r, b.at);
      var name = now && now.name ? cut(now.name, 48) : "";
      if (now && now.line && !thought && r.id === (b.focus || rows[0].id)) thought = cut(now.line, 72);
      return title(r.id) + (name ? " — " + t("q", { s: name }) + (now.changed ? " (" + t("changed") + ")" : "") : "");
    });
    /* Вторая строка — недописанная мысль: строка, на которой стоял курсор. */
    /* Строка Свидетеля (D-291): что ушло наружу в прошлый вход — замером. */
    var wl = "";
    try { wl = window.sbWitness && window.sbWitness.line ? window.sbWitness.line() : ""; } catch (e) { wl = ""; }
    return parts.join(" · ") + " · " + ago(b.at) +
      (b.why ? "\n" + t("why", { s: cut(b.why, 90) }) : "") +
      (thought ? "\n" + t("thought", { s: thought }) : "") +
      (wl ? "\n" + wl : "");
  }
  function counts() {
    var d = db();
    if (!readable()) return null;
    var c = null;
    try { c = JSON.parse(d.get(COUNTS) || "null"); } catch (e) { c = null; }
    return { go: (c && c.go) || 0, release: (c && c.release) || 0, later: (c && c.later) || 0 };
  }
  function tally(what) {
    var d = db();
    if (!d || !readable() || !allowed()) return;
    var c = counts();
    c[what] = (c[what] || 0) + 1;
    d.set(COUNTS, JSON.stringify(c));
  }

  function resume() {
    var b = read();
    if (!b) return false;
    var reg = apps();
    answered = true;
    b.rooms.forEach(function (r) {
      var def = reg[r.id];
      window.toggleApp(r.id);
      var win = window.getOpenWindow ? window.getOpenWindow(r.id) : null;
      if (r.place && typeof def.resume === "function") {
        try { def.resume(win, r.place); } catch (e) { if (window.console) console.error("[baton] resume failed", r.id, e); }
      }
    });
    b.rooms.forEach(function (r) { if (r.min && window.sbMinimizeWindow) window.sbMinimizeWindow(r.id); });
    if (b.focus && window.focusWindow && window.getOpenWindow && window.getOpenWindow(b.focus)) window.focusWindow(b.focus);
    /* Курсор ставится ПОСЛЕ фокуса окна: фокус окна уводит его на само окно. */
    var fr = null;
    b.rooms.forEach(function (r) { if (r.id === b.focus) fr = r; });
    if (fr && fr.place && typeof reg[fr.id].resume === "function") {
      try { reg[fr.id].resume(window.getOpenWindow(fr.id), fr.place); } catch (e) { if (window.console) console.error("[baton] refocus failed", fr.id, e); }
    }
    /* Место вернулось — хранить его больше незачем: при следующем уходе
       эстафета запишет то, что будет открыто тогда. */
    write(null);
    return true;
  }
  function release() {
    var b = read();
    if (!b) return false;
    answered = true;
    var w = db().get(WHY);
    write(null);
    if (w) db().remove(WHY);
    if (window.sbShowUndoToast) {
      window.sbShowUndoToast(t("released"), t("releasedBody"), function () { if (w) db().set(WHY, w); write(b); });
    }
    return true;
  }
  function forget() {
    answered = true; hideCard();
    var d = db();
    if (d) { d.remove(COUNTS); d.remove(WHY); }
    return write(null);
  }
  /* Своё слово: к открытому сейчас делу, а если ничего не открыто — к
     делу, которое ждёт в эстафете. Пустая строка — слово снято. */
  function setWhy(text) {
    if (!allowed() || !readable()) return false;
    var d = db(), v = String(text == null ? "" : text).trim();
    var now = snapshot(), b = read();
    var target = now || b;
    if (!target) return false;
    if (!v) { d.remove(WHY); if (b && b.why) { delete b.why; write(b); } refreshCard(); return true; }
    d.set(WHY, JSON.stringify({ why: v.slice(0, 200), anchor: anchorOf(target), at: Date.now() }));
    if (b && anchorOf(b) === anchorOf(target)) { b.why = v.slice(0, 200); write(b); }
    else if (d.flushSync) d.flushSync();
    refreshCard();
    return true;
  }
  function askWhy() {
    var w = readWhy(), b = read();
    var cur = (b && b.why) || (w && w.why) || "";
    var v = null;
    try { v = window.prompt(t("whyAsk"), cur); } catch (e) { v = null; }
    if (v === null) return false;
    return setWhy(v);
  }

  var card = null;
  function hideCard() { if (card) { card.dismiss(); card = null; } }
  /* Слово сказано, пока карточка стоит, — карточка говорит его сразу. */
  function refreshCard() {
    if (!card || !card.el) return;
    var b = read(), el = card.el.querySelector(".toast-text");
    if (b && el) { el.textContent = said(b); card.el.setAttribute("data-text", el.textContent); }
  }
  function offer() {
    if (answered || card || !allowed()) return false;
    /* Пришли по ссылке «Передать» или из меню «Поделиться» — пришли за
       вещью, а не за своим местом. */
    if (/^#t=/.test(location.hash || "")) return false;
    if (window.sbShareIn && window.sbShareIn.came) return false;
    var b = read();
    if (!b || typeof window.showStandingToast !== "function") return false;
    card = window.showStandingToast(t("title"), said(b), GLYPH, [
      { id: "go", label: t("go"), run: function () { card = null; tally("go"); resume(); } },
      { id: "release", label: t("release"), quiet: true, run: function () { card = null; tally("release"); release(); } }
    ], "toast-baton");
    if (!card) return false;
    card.el.setAttribute("data-baton", "");
    /* Касание мимо кнопок — «не сейчас»: карточка уходит, место остаётся. */
    card.el.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("button")) return;
      answered = true; card = null; tally("later");
    });
    return true;
  }
  var GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';

  /* Возвращение: стол встал — и, если стоит замок, дверь открыта. */
  function whenReady() {
    if (readable()) { offer(); return; }
    if (window.sbBus && window.sbBus.on) window.sbBus.on("store:epoch", function () { if (readable()) offer(); });
  }
  doc.addEventListener("sysbaby:desktop-ready", whenReady);

  /* Выключили — забыть сразу, а не при следующем уходе. */
  doc.addEventListener("sysbaby:setting-changed", function (ev) {
    var d = ev && ev.detail;
    if (d && d.kind === "toggle" && d.key === TOGGLE && !d.on) forget();
  });

  window.sbBaton = {
    peek: function () { var b = read(); return b ? { at: b.at, focus: b.focus, rooms: b.rooms.map(function (r) { return { id: r.id, min: r.min, place: r.place }; }), said: said(b) } : null; },
    hold: hold,
    resume: function () { hideCard(); return resume(); },
    release: function () { hideCard(); return release(); },
    forget: forget,
    counts: counts,
    why: setWhy,
    askWhy: askWhy,
    t: t
  };
})();
