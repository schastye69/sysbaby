/*
 * share.js — «В ДОМ»: sys.baby В МЕНЮ «ПОДЕЛИТЬСЯ» ТЕЛЕФОНА (D-287).
 *
 * ПОВОД. Основатель на вопрос Совета «ставить систему в меню "Поделиться"?»
 * ответил: «Да». Это второй механизм ядра притяжения (страница «Ядро
 * притяжения», петля B): не новая привычка, а старая, направленная домой.
 * Человек и так каждый день нажимает «Поделиться» — ссылку, цитату, адрес;
 * теперь среди адресатов есть его собственный дом.
 *
 * КАК ПРИХОДИТ. Манифест (os/manifest.webmanifest) объявляет share_target
 * методом GET: телефон открывает систему адресом ./?share&title=…&text=…&url=…
 * Метод GET выбран нарочно: такой адрес служебный работник отдаёт и без сети
 * (документ падает на оболочку из хранилища), значит, делиться можно в
 * самолёте. Файлы (POST) — следующий шаг, если понадобится.
 *
 * ЧТО ДЕЛАЕТ:
 *   • адрес очищается В ПЕРВЫЙ ЖЕ МИГ — перезагрузка не кладёт вещь дважды,
 *     а текст не остаётся в строке адреса и в истории вкладки;
 *   • вещь держится только в памяти, пока стол не встал и (если стоит замок)
 *     дверь не открыта; до двери на диск не пишется ни байта;
 *   • ложится новой записью в Записи: первая строка — заголовок (или начало
 *     текста, или адрес), дальше текст и ссылка без повторов;
 *   • Записи открываются на ней, извещение говорит, что пришло;
 *   • Эстафета в этот вход молчит: человек пришёл за тем, чем поделился.
 *
 * Охраняется tools/share-target-check.mjs.
 */
(function () {
  "use strict";
  var doc = document;
  var came = null;
  /* Адрес страница читает ОДИН раз, до первого кадра, и сразу очищает
     строку адреса (os/index.html, window.__sbEntry): никакое состояние не
     живёт в адресе. Отсюда вещь и берётся — из памяти, а не из адреса. */
  try {
    var sp = new URLSearchParams(typeof window.__sbEntry === "string" ? window.__sbEntry : location.search);
    if (sp.has("share")) came = { title: sp.get("title") || "", text: sp.get("text") || "", url: sp.get("url") || "" };
  } catch (e) { came = null; }
  window.sbShareIn = { came: !!came, landed: null };
  if (!came) return;
  if (location.search) {
    try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) { /* адрес останется — вещь всё равно ляжет один раз: см. landed */ }
  }

  var UI = {
    en: { title: "Arrived home", body: "Saved in Scribble: {name}" },
    ru: { title: "Пришло в дом", body: "Лежит в Записях: {name}" },
    ee: { title: "Jõudis koju", body: "Salvestatud Märkmetesse: {name}" }
  };
  function t(k, vars) {
    var l = "en";
    try { l = window.sbLang ? window.sbLang() : "en"; } catch (e) { l = "en"; }
    /* ОТКАТ: языка нет в словаре — английский, как у словаря ядра (sbTIn). */
    var L = UI[l] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ. */
    var s = L[k] || UI.en[k] || k;
    return String(s).replace(/\{(\w+)\}/g, function (m, n) { return vars && Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m; });
  }

  function compose(q) {
    var title = q.title.trim(), text = q.text.trim(), url = q.url.trim();
    /* Многие приложения кладут ссылку и в текст — второй раз её не пишем. */
    if (url && text.indexOf(url) !== -1) url = "";
    if (title && text.indexOf(title) === 0) title = "";
    var head = title || (text.split("\n")[0] || "").trim() || url;
    var rest = [];
    var textRest = title ? text : text.split("\n").slice(1).join("\n").trim();
    if (textRest) rest.push(textRest);
    if (url && url !== head) rest.push(url);
    return { name: head, body: head + (rest.length ? "\n\n" + rest.join("\n\n") : "") };
  }

  function readable() { var d = window.sbDB; return !!d && !(d.closed && d.closed()); }
  function land() {
    if (window.sbShareIn.landed || !readable() || typeof window.sbAddQuickNote !== "function") return false;
    var c = compose(came);
    if (!c.name) return false;
    var id = window.sbAddQuickNote(c.body, { source: "share" });
    window.sbShareIn.landed = id;
    came = null;               /* из памяти — сразу, как легло на место */
    try {
      window.toggleApp("notes");
      var win = window.getOpenWindow ? window.getOpenWindow("notes") : null;
      if (win && window.sbNotesOpenResult) window.sbNotesOpenResult(win, id);
    } catch (e) { if (window.console) console.error("[share] open failed", e); }
    if (window.showToast) window.showToast(t("title"), t("body", { name: c.name.length > 60 ? c.name.slice(0, 59) + "…" : c.name }), "", true, "toast-calm", "confirm");
    return true;
  }
  function whenReady() {
    if (land()) return;
    if (window.sbBus && window.sbBus.on) window.sbBus.on("store:epoch", function () { land(); });
  }
  doc.addEventListener("sysbaby:desktop-ready", whenReady);
})();
