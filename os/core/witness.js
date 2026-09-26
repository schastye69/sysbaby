/*
 * witness.js — СВИДЕТЕЛЬ: ЧТО СИСТЕМА СДЕЛАЛА И ЧЕГО НЕ СДЕЛАЛА (D-291).
 *
 * ПОВОД. Ядро притяжения (модель 15, петля D на странице «Ядро
 * притяжения»): туда, где безопасно, переносят самое ценное, — но доверие
 * невидимо, пока не случилось плохое. На двери замка написано «nothing can
 * leave us», в «Наружу» перечислен каждый выход, законы сверяют опись с
 * кодом. Не хватало одного: увидеть, что ушло НА САМОМ ДЕЛЕ.
 *
 * КАК. Браузер сам ведёт учёт каждого запроса страницы (Resource Timing).
 * Свидетель не придумывает счёт — он читает этот учёт и раскладывает его по
 * описи «Наружу» (shared/outward.data.js):
 *   к себе                 — свой адрес;
 *   к чужим по описи       — хосты дверей описи, по имени;
 *   страницы, открытые вами — рамки к чужим адресам: ТОЛЬКО ЧИСЛО. Адрес —
 *                            это ваш путь, а не поведение системы, и хранить
 *                            его значило бы завести журнал ваших переходов;
 *   вне описи              — всё остальное. Должно быть ноль. Если нет — при
 *                            следующем входе Свидетель встаёт сам и называет
 *                            хост: это беда, и молчать о ней нельзя.
 * И сколько раз за вход замок запечатал запись.
 *
 * ЧЕСТНЫЙ ПРЕДЕЛ. Учёт видит запросы этой страницы и её рамок как рамок; он
 * не видит, что делает чужая страница внутри своей рамки, — изнутри этой
 * страницы это знать нельзя.
 *
 * Хранится: только итог входа, через sbDB — под замком он в конверте; в
 * инкогнито не хранится ничего. Охраняется tools/witness-check.mjs.
 */
(function () {
  "use strict";
  var doc = document;
  var KEY = "sysbaby.witness.v1";

  var UI = {
    en: {
      head: "Witness", title: "Witness: what actually left",
      now: "This visit", prev: "Last visit", none: "nothing",
      self: "to itself", third: "to strangers, as listed", hand: "pages you opened", undeclared: "outside the list", sealed: "sealed",
      line: "Witness, last visit: out — {out} · sealed {sealed}",
      warn: "Last visit something left for an address that is not in the list: {hosts}. This should never happen — look at «Outward».",
      warnTitle: "Witness", open: "Open Outward",
      limit: "Counted by the browser itself (Resource Timing): the requests of this page. It cannot see what a stranger's page does inside its own frame — from here that is unknowable.",
      first: "This is the first visit the witness has seen."
    },
    ru: {
      head: "Свидетель", title: "Свидетель: что ушло на самом деле",
      now: "Этот вход", prev: "Прошлый вход", none: "ничего",
      self: "к себе", third: "к чужим по описи", hand: "страниц, открытых вами", undeclared: "вне описи", sealed: "запечатано",
      line: "Свидетель, прошлый вход: наружу — {out} · запечатано {sealed}",
      warn: "В прошлый вход что-то ушло по адресу, которого нет в описи: {hosts}. Так не должно быть никогда — посмотрите «Наружу».",
      warnTitle: "Свидетель", open: "Открыть «Наружу»",
      limit: "Считает сам браузер (Resource Timing): запросы этой страницы. Что делает чужая страница внутри своей рамки, отсюда не видно — и знать это изнутри нельзя.",
      first: "Это первый вход, который видит Свидетель."
    },
    ee: {
      head: "Tunnistaja", title: "Tunnistaja: mis tegelikult välja läks",
      now: "See külastus", prev: "Eelmine külastus", none: "mitte midagi",
      self: "iseendale", third: "võõrastele loetelu järgi", hand: "sinu avatud lehti", undeclared: "väljaspool loetelu", sealed: "pitseeritud",
      line: "Tunnistaja, eelmine külastus: välja — {out} · pitseeritud {sealed}",
      warn: "Eelmisel külastusel läks midagi aadressile, mida loetelus ei ole: {hosts}. Nii ei tohi kunagi olla — vaata «Välja».",
      warnTitle: "Tunnistaja", open: "Ava «Välja»",
      limit: "Loeb brauser ise (Resource Timing): selle lehe päringud. Mida võõras leht oma raami sees teeb, siit ei näe — ja seestpoolt seda teada ei saa.",
      first: "See on esimene külastus, mida tunnistaja näeb."
    }
  };
  function lang() { try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; } }
  function t(k, vars) {
    /* ОТКАТ: языка нет в словаре — английский, как у словаря ядра (sbTIn). */
    var L = UI[lang()] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ. */
    var s = L[k] || UI.en[k] || k;
    return String(s).replace(/\{(\w+)\}/g, function (m, n) { return vars && Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m; });
  }

  function blank() { return { v: 1, at: Date.now(), until: Date.now(), self: 0, third: {}, hand: 0, undeclared: {}, sealed: 0 }; }
  var cur = blank();
  /* Копия прошлого входа помнит свою эпоху хранилища (D-274): пока дверь
     закрыта, читать нечего; открылась — читается; сменился весь мир (замок
     заперли и открыли снова) — перечитывается. После первой своей записи
     на диске лежит уже ЭТОТ вход, и прошлый не подменяется им.
     Охраняется tools/lock-memory-check.mjs. */
  var prev = null, prevEpoch = -1, held = false;

  function listed() {
    var out = {};
    var d = (window.SB_OUTWARD && window.SB_OUTWARD.doors) || [];
    for (var i = 0; i < d.length; i++) if (d[i] && d[i].host) out[String(d[i].host).toLowerCase()] = true;
    return out;
  }
  var seen = typeof WeakSet === "function" ? new WeakSet() : null;
  function take(entry) {
    if (!entry || (seen && seen.has(entry))) return;
    if (seen) seen.add(entry);
    var u;
    try { u = new URL(entry.name, location.href); } catch (e) { return; }
    if (u.protocol !== "http:" && u.protocol !== "https:") return;
    if (u.origin === location.origin) { cur.self++; return; }
    var type = String(entry.initiatorType || "");
    /* Рамка к чужому адресу — путь человека: только число, без адреса. */
    if (type === "iframe" || type === "frame" || type === "subdocument") { cur.hand++; return; }
    var host = u.hostname.toLowerCase();
    var bag = listed()[host] ? cur.third : cur.undeclared;
    bag[host] = (bag[host] || 0) + 1;
  }
  try { if (performance.setResourceTimingBufferSize) performance.setResourceTimingBufferSize(2000); } catch (e) { /* ignore */ }
  try {
    (performance.getEntriesByType ? performance.getEntriesByType("resource") : []).forEach(take);
    if (typeof PerformanceObserver === "function") {
      new PerformanceObserver(function (list) { list.getEntries().forEach(take); }).observe({ type: "resource", buffered: true });
    }
  } catch (e) { if (window.console) console.error("[witness] observer", e); }

  function incognito() { return !!window.sbIncognitoActive; }
  function readable() { var d = window.sbDB; return !!d && !(d.closed && d.closed()); }
  function readPrev() {
    if (incognito() || !readable()) return;
    var ep = window.sbDB.epoch ? window.sbDB.epoch() : 0;
    if (ep === prevEpoch) return;
    var first = prevEpoch === -1;
    prevEpoch = ep;
    if (held && !first) return;
    try { prev = JSON.parse(window.sbDB.get(KEY) || "null"); } catch (e) { prev = null; }
    if (prev && prev.v !== 1) prev = null;
  }
  function hold() {
    if (incognito() || !readable()) return;
    readPrev();
    held = true;
    cur.until = Date.now();
    window.sbDB.set(KEY, JSON.stringify(cur));
    if (window.sbDB.flushSync) window.sbDB.flushSync();
  }
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") hold(); });
  window.addEventListener("pagehide", hold);

  function outOf(r) {
    var parts = [];
    Object.keys(r.third || {}).forEach(function (h) { parts.push(h + " ×" + r.third[h]); });
    Object.keys(r.undeclared || {}).forEach(function (h) { parts.push(h + " ×" + r.undeclared[h] + " (" + t("undeclared") + ")"); });
    return parts.length ? parts.join(", ") : t("none");
  }
  function line() {
    readPrev();
    return prev ? t("line", { out: outOf(prev), sealed: prev.sealed || 0 }) : "";
  }
  function copy(r) { return r ? JSON.parse(JSON.stringify(r)) : null; }

  /* Беда говорит сама: выход вне описи в прошлый вход — извещение, которое
     ждёт ответа, даже при «Не беспокоить». */
  function warn() {
    readPrev();
    if (!prev || !prev.undeclared) return;
    var hosts = Object.keys(prev.undeclared);
    if (!hosts.length || typeof window.showStandingToast !== "function") return;
    var h = window.showStandingToast(t("warnTitle"), t("warn", { hosts: hosts.join(", ") }), "", [
      { id: "outward", label: t("open"), run: function () { if (window.toggleApp) window.toggleApp("outward"); } }
    ], "toast-warn", true);
    if (h && h.el) h.el.setAttribute("data-witness-warn", "");
  }
  var warned = false;
  function tryWarn() { if (warned || !readable()) return; warned = true; warn(); }
  function whenReady() {
    if (window.sbBus && window.sbBus.on) {
      window.sbBus.on("vault:sealed", function () { cur.sealed++; });
      /* Замок открылся — прошлый вход стал читаем. */
      window.sbBus.on("store:epoch", tryWarn);
    }
    tryWarn();
  }
  doc.addEventListener("sysbaby:desktop-ready", whenReady);

  window.sbWitness = {
    now: function () { return copy(cur); },
    prev: function () { readPrev(); return copy(prev); },
    line: line,
    out: outOf,
    t: t
  };
})();
