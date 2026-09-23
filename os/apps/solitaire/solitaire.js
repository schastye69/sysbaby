/*
 * solitaire.js — ПАСЬЯНС. Тихая игра, которая открывается подарком (D-257).
 *
 * ПОВОД, дословно от основателя 22.09.2026: «Пасьянс — тихая игра-комната,
 * которая открывается только сундуком … подарок становится действием, а не
 * просто новым элементом оформления».
 *
 * Косынка (Klondike): семь стопок, колода по одной карте, четыре дома.
 * ХОД БЕЗ ПЕРЕТАСКИВАНИЯ: коснуться карты — коснуться места. На телефоне
 * перетаскивание карт шириной в палец — мучение; касание в два шага
 * работает одинаково мышью и пальцем. Коснуться выбранной карты ещё раз —
 * попробовать отправить её на дом.
 *
 * НИ ОДНОЙ КАРТИНКИ: масти — знаки шрифта, карты — разметка. Положение
 * игры лежит в своём ящике и переживает закрытие окна: человек уходит и
 * возвращается к тому же раскладу.
 *
 * КОМНАТА СКРЫТА, пока её не подарил Сундук (sbRevealApp). Это подарок, а
 * не инструмент: без него стол не беднее.
 *
 * Охраняется tools/solitaire-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var STORE_KEY = "sysbaby.solitaire.v1";
  var UNDO_MAX = 200;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="4" y="3.5" width="11" height="15" rx="2"/><path d="M9 7.5h.01M15 9.5v9a2 2 0 0 1-2 2H7"/><path d="M9.5 13.5c0-1.2 1-1.8 1.5-1 .5-.8 1.5-.2 1.5 1 0 1-1.5 2-1.5 2s-1.5-1-1.5-2z"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() {
    try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; }
  }
  var UI = {
    en: { title: "Solitaire", label: "Solitaire", moves: "moves", time: "time", newGame: "New game", undo: "Undo",
      win: "Solved.", winLine: "{m} moves · {t}. The cards are yours again whenever you want them.",
      hint: "Tap a card, then tap where it goes. Tap it again to send it home.", stock: "Deck", empty: "Nothing left — tap to turn the pile over." },
    ru: { title: "Пасьянс", label: "Пасьянс", moves: "ходов", time: "время", newGame: "Новая игра", undo: "Отменить",
      win: "Сошёлся.", winLine: "{m} ходов · {t}. Карты снова ваши, когда захотите.",
      hint: "Коснитесь карты, потом — места, куда её положить. Ещё раз по ней — отправить на дом.", stock: "Колода", empty: "Колода пуста — коснитесь, чтобы перевернуть сброс." },
    ee: { title: "Pasjanss", label: "Pasjanss", moves: "käiku", time: "aeg", newGame: "Uus mäng", undo: "Võta tagasi",
      win: "Läks kokku.", winLine: "{m} käiku · {t}. Kaardid on jälle sinu, kui tahad.",
      hint: "Puuduta kaarti, siis kohta, kuhu see läheb. Puuduta uuesti — saada koju.", stock: "Pakk", empty: "Pakk on tühi — puuduta, et ümber pöörata." }
  };
  function T() { return UI[lang()] || UI.en; }
  function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m; }); }

  /* ── карты: id = масть*13 + ранг-1 ─────────────────────────────────── */
  var SUITS = ["♠", "♥", "♦", "♣"];   /* ♠ ♥ ♦ ♣ */
  var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  function suit(id) { return Math.floor(id / 13); }
  function rank(id) { return (id % 13) + 1; }
  function red(id) { var s = suit(id); return s === 1 || s === 2; }

  /* ── ящик ───────────────────────────────────────────────────────────── */
  function box() {
    return window.sbRights
      ? window.sbRights.box("solitaire")
      : { get: function () { return null; }, set: function () { return false; } };
  }
  var game = null;
  function load() {
    try { var raw = box().get(STORE_KEY); game = raw ? JSON.parse(raw) : null; } catch (e) { game = null; }
    if (!game || !Array.isArray(game.cols) || game.cols.length !== 7) game = deal();
    if (!Array.isArray(game.undo)) game.undo = [];
    return game;
  }
  function save() { try { box().set(STORE_KEY, JSON.stringify(game)); } catch (e) { /* ignore */ } }

  function deal() {
    var ids = [], i, j, r = new Uint32Array(52);
    for (i = 0; i < 52; i++) ids.push(i);
    try { window.crypto.getRandomValues(r); } catch (e) { for (i = 0; i < 52; i++) r[i] = Math.floor(Math.random() * 4294967296); }
    for (i = 51; i > 0; i--) { j = r[i] % (i + 1); var t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
    var cols = [], up = [], k = 0;
    for (i = 0; i < 7; i++) { cols.push(ids.slice(k, k + i + 1)); k += i + 1; up.push(1); }
    return { v: 1, stock: ids.slice(28), waste: [], found: [[], [], [], []], cols: cols, up: up, moves: 0, started: Date.now(), undo: [] };
  }

  /* ── правила ────────────────────────────────────────────────────────── */
  function topOf(list) { return list.length ? list[list.length - 1] : null; }
  function canToCol(card, col) {
    var t = topOf(game.cols[col]);
    if (t == null) return rank(card) === 13;
    return red(card) !== red(t) && rank(card) === rank(t) - 1;
  }
  function canToFound(card, f) {
    var pile = game.found[f], t = topOf(pile);
    if (t == null) return rank(card) === 1;
    return suit(t) === suit(card) && rank(card) === rank(t) + 1;
  }
  function remember() {
    var copy = JSON.parse(JSON.stringify({ stock: game.stock, waste: game.waste, found: game.found, cols: game.cols, up: game.up, moves: game.moves }));
    game.undo.push(copy);
    if (game.undo.length > UNDO_MAX) game.undo.shift();
  }
  function undo() {
    var prev = game.undo.pop();
    if (!prev) return false;
    game.stock = prev.stock; game.waste = prev.waste; game.found = prev.found; game.cols = prev.cols; game.up = prev.up; game.moves = prev.moves;
    save();
    return true;
  }
  /* Снять выбранные карты с их места. sel = { from, col, index } */
  function take(sel) {
    if (sel.from === "waste") return [game.waste.pop()];
    if (sel.from === "found") return [game.found[sel.col].pop()];
    var list = game.cols[sel.col], run = list.splice(sel.index);
    game.up[sel.col] = Math.max(0, game.up[sel.col] - run.length);
    if (list.length && game.up[sel.col] === 0) game.up[sel.col] = 1;   /* открыть следующую */
    return run;
  }
  function selectedCards(sel) {
    if (sel.from === "waste") return game.waste.length ? [topOf(game.waste)] : [];
    if (sel.from === "found") return game.found[sel.col].length ? [topOf(game.found[sel.col])] : [];
    return game.cols[sel.col].slice(sel.index);
  }
  function moveToCol(sel, col) {
    var cards = selectedCards(sel);
    if (!cards.length || !canToCol(cards[0], col)) return false;
    if (sel.from === "col" && sel.col === col) return false;
    remember();
    var run = take(sel);
    game.cols[col] = game.cols[col].concat(run);
    game.up[col] += run.length;
    game.moves++;
    save();
    return true;
  }
  function moveToFound(sel, f) {
    var cards = selectedCards(sel);
    if (cards.length !== 1 || !canToFound(cards[0], f)) return false;
    remember();
    var run = take(sel);
    game.found[f].push(run[0]);
    game.moves++;
    save();
    return true;
  }
  function autoHome(sel) {
    for (var f = 0; f < 4; f++) if (moveToFound(sel, f)) return true;
    return false;
  }
  function draw() {
    remember();
    if (game.stock.length) game.waste.push(game.stock.pop());
    else if (game.waste.length) { game.stock = game.waste.reverse(); game.waste = []; }
    else { game.undo.pop(); return; }
    game.moves++;
    save();
  }
  function won() { return game.found.every(function (p) { return p.length === 13; }); }
  function elapsed() {
    var s = Math.max(0, Math.floor((Date.now() - (game.started || Date.now())) / 1000));
    var m = Math.floor(s / 60);
    return m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }

  /* ── комната ────────────────────────────────────────────────────────── */
  var sel = null, clock = null;
  function cardHtml(id, up, extra) {
    if (!up) return '<div class="sol-card down" data-id="' + id + '"></div>';
    return '<div class="sol-card up' + (red(id) ? " red" : "") + (extra || "") + '" data-id="' + id + '" role="button" tabindex="0">' +
      '<span class="sol-rank">' + esc(RANKS[rank(id) - 1]) + '</span><span class="sol-suit">' + SUITS[suit(id)] + "</span></div>";
  }
  function isSel(from, col, index) {
    return !!sel && sel.from === from && sel.col === col && (from !== "col" || index >= sel.index);
  }
  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var t = T();
    load();
    var out = '<div class="sol-wrap">';
    out += '<div class="sol-top">' +
      '<div class="sol-stock" data-count="' + game.stock.length + '" role="button" tabindex="0" aria-label="' + esc(t.stock) + '">' +
        (game.stock.length ? '<div class="sol-card down"></div>' : '<div class="sol-slot"></div>') + "</div>" +
      '<div class="sol-waste">' + (game.waste.length ? cardHtml(topOf(game.waste), true, isSel("waste") ? " sel" : "") : '<div class="sol-slot"></div>') + "</div>" +
      '<div class="sol-gap"></div>';
    for (var f = 0; f < 4; f++) {
      out += '<div class="sol-found" data-found="' + f + '" data-count="' + game.found[f].length + '" role="button" tabindex="0">' +
        (game.found[f].length ? cardHtml(topOf(game.found[f]), true, isSel("found", f) ? " sel" : "") : '<div class="sol-slot sol-home"></div>') + "</div>";
    }
    out += "</div>";
    out += '<div class="sol-cols">';
    for (var c = 0; c < 7; c++) {
      var list = game.cols[c], upFrom = list.length - game.up[c];
      out += '<div class="sol-col" data-col="' + c + '" role="group">';
      if (!list.length) out += '<div class="sol-slot"></div>';
      for (var i = 0; i < list.length; i++) {
        out += cardHtml(list[i], i >= upFrom, isSel("col", c, i) ? " sel" : "").replace('data-id="', 'data-index="' + i + '" data-id="');
      }
      out += "</div>";
    }
    out += "</div>";
    out += '<div class="sol-bar">' +
      '<span class="sol-moves" data-moves="' + game.moves + '">' + esc(t.moves) + ": " + game.moves + '</span>' +
      '<span class="sol-time" id="solTime">' + esc(t.time) + ": " + elapsed() + "</span>" +
      '<button type="button" class="sol-btn" id="solUndo">' + esc(t.undo) + "</button>" +
      '<button type="button" class="sol-btn" id="solNew">' + esc(t.newGame) + "</button>" +
      "</div>";
    if (won()) out += '<div class="sol-win"><strong>' + esc(t.win) + "</strong><span>" + esc(fmt(t.winLine, { m: game.moves, t: elapsed() })) + "</span></div>";
    else out += '<p class="sol-hint">' + esc(t.hint) + "</p>";
    out += "</div>";
    /* Перерисовка не телепортирует прокрутку (D-099): общее средство оболочки. */
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
    wire(host, win);
  }
  function wire(host, win) {
    var again = function () { render(win); };
    var stock = host.querySelector(".sol-stock");
    if (stock) stock.addEventListener("click", function () { sel = null; draw(); again(); });
    var waste = host.querySelector(".sol-waste .sol-card");
    if (waste) waste.addEventListener("click", function () {
      if (isSel("waste")) { autoHome(sel); sel = null; again(); return; }
      sel = { from: "waste" }; again();
    });
    host.querySelectorAll(".sol-found").forEach(function (fEl) {
      var f = +fEl.getAttribute("data-found");
      fEl.addEventListener("click", function () {
        /* Неудачный ход не снимает выбор: человек касается другого места, а
           не выбирает карту заново. */
        if (sel && !(sel.from === "found" && sel.col === f)) { if (moveToFound(sel, f)) sel = null; again(); return; }
        if (sel && sel.from === "found" && sel.col === f) { sel = null; again(); return; }
        if (game.found[f].length) { sel = { from: "found", col: f }; again(); }
      });
    });
    host.querySelectorAll(".sol-col").forEach(function (cEl) {
      var c = +cEl.getAttribute("data-col");
      cEl.addEventListener("click", function (ev) {
        var card = ev.target.closest ? ev.target.closest(".sol-card.up") : null;
        if (sel) {
          if (sel.from === "col" && sel.col === c) {
            /* Ещё раз по выбранной — на дом; по другой карте той же стопки — перевыбор. */
            if (card && +card.getAttribute("data-index") === sel.index) { autoHome(sel); sel = null; again(); return; }
            if (card) { sel = { from: "col", col: c, index: +card.getAttribute("data-index") }; again(); return; }
            sel = null; again(); return;
          }
          if (moveToCol(sel, c)) sel = null; again(); return;
        }
        if (card) { sel = { from: "col", col: c, index: +card.getAttribute("data-index") }; again(); }
      });
    });
    var undoBtn = host.querySelector("#solUndo");
    if (undoBtn) undoBtn.addEventListener("click", function () { sel = null; undo(); again(); });
    var newBtn = host.querySelector("#solNew");
    if (newBtn) newBtn.addEventListener("click", function () { sel = null; game = deal(); save(); again(); });
    if (clock) clearInterval(clock);
    var timeEl = host.querySelector("#solTime");
    if (timeEl && !won()) clock = setInterval(function () {
      if (!doc.body.contains(timeEl)) { clearInterval(clock); clock = null; return; }
      timeEl.textContent = T().time + ": " + elapsed();
    }, 1000);
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("solitaire", {
      needs: ["диск"],
      keeps: [STORE_KEY],
      /* СКРЫТА, ПОКА НЕ ПОДАРЕНА (D-257). Открывает Сундук через sbRevealApp.
         Охраняется tools/alive-check.mjs и tools/solitaire-check.mjs. */
      hidden: true,
      offDesk: "открывается подарком",
      why: "why.solitaire",
      title: UI.en.title,
      label: UI.en.label,
      i18n: {
        ru: { title: UI.ru.title, label: UI.ru.label },
        ee: { title: UI.ee.title, label: UI.ee.label }
      },
      color: "linear-gradient(160deg,#5fbf8a 0%,#2e8a5c 52%,#154a30 100%)",
      icon: ICON,
      size: { w: 640, h: 620 },
      retranslate: true,
      render: render
    });
  }
})();
