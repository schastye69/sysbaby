/* sys.baby OS — core/thought.js
 * ПОЙМАТЬ МЫСЛЬ · решение D-885 (основатель 11.11.2026: «гениальная идея»;
 * plan-dalshe/instrumenty-stola.md, п.7). Касание середины стола — строка из
 * света (core/desktools.js); написанное или сказанное по Enter СРАЗУ
 * становится записью — без окна Записей, без вопроса «сохранить?». Голос
 * подтверждает одной фразой и предлагает [показать].
 *
 * ГОЛОСОМ — ТОЛЬКО НА УСТРОЙСТВЕ. Распознавание речи браузера по умолчанию
 * отправляет звук на чужой сервер; дом наружу не ходит. Поэтому кнопка
 * голоса появляется, ТОЛЬКО если браузер сам подтверждает распознавание на
 * этом устройстве (SpeechRecognition.available({ processLocally: true }) →
 * "available") и запуск идёт с processLocally = true. Языковую модель дом
 * не скачивает (install() не зовётся — это был бы поход в сеть). Нет такого
 * браузера — нет и кнопки: молча, без обещаний.
 * Охраняется tools/thought-capture-check.mjs. */
(function () {
  "use strict";
  function T(k, v) { return window.sbToolT ? window.sbToolT(k, v) : k; }
  function bcp() { var l = typeof window.sbLang === "function" ? window.sbLang() : "en"; return l === "ru" ? "ru-RU" : l === "ee" ? "et-EE" : "en-GB"; }
  function SR() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }

  /* ---------- мысль → запись ---------- */
  var UNDO_MS = 8000;   /* ПОСТОЯННАЯ: 8 с на «отменить» — решение основателя 12.11 */
  function openNote(id) {
    try {
      if (typeof window.sbOpenApp === "function") window.sbOpenApp("notes");
      setTimeout(function () {
        var w = typeof window.getOpenWindow === "function" ? window.getOpenWindow("notes") : null;
        if (w && window.sbNotesOpenResult) window.sbNotesOpenResult(w, id);
      }, 260);
    } catch (e) { /* окна нет — запись всё равно лежит в Записях */ }
  }
  function save(text) {
    var body = String(text == null ? "" : text).replace(/\s+$/, "");
    if (!body.trim() || typeof window.sbAddQuickNote !== "function") return null;
    /* мысль — первая строка записи, как всякое имя записи (D-111) */
    var id = window.sbAddQuickNote(body, { thought: true }), t0 = Date.now();
    /* [отменить] — восемь секунд (D-904): мысль уходит в корзину Записей, а не в никуда */
    var words = T("dt.thought.saved") + " [" + T("dt.thought.show") + "] [" + T("dt.thought.undo") + "]";
    try {
      if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(words, { hold: UNDO_MS, on: function (w, i) {
        if (i === 1) { if (Date.now() - t0 <= UNDO_MS && window.sbNotesStore) { window.sbNotesStore.softDelete(id); window.sbVoice.say(T("dt.thought.undone")); } }
        else openNote(id);
      } });
      else if (window.showToast) window.showToast(T("dt.thought.saved"), "", null, false, "", "confirm");
    } catch (e) { /* голос занят — запись сделана */ }
    return id;
  }

  /* ---------- голос на устройстве ---------- */
  /* ПРОБА ЛЕНИВАЯ (D-894): available({ processLocally:true }) в безголовом
     Chromium роняло вкладку. Поэтому браузер спрашивается ТОЛЬКО по касанию
     кнопки голоса, один раз, в try/catch и со сроком 2,5 с: не ответил —
     значит «нет». Кнопка видна, если у браузера вообще есть такой вопрос
     (maybe) — это проверка имени, а не вызов. */
  var localOk = null, waiters = [];
  function maybe() { var R = SR(); return !!(R && typeof R.available === "function"); }
  function available(cb) {
    if (localOk !== null) { cb(localOk); return; }
    waiters.push(cb);
    if (waiters.length > 1) return;
    var settled = false, tm = 0;
    var done = function (v) { if (settled) return; settled = true; clearTimeout(tm); localOk = !!v; var w = waiters; waiters = []; w.forEach(function (f) { try { f(localOk); } catch (e) { /* слушатель не роняет */ } }); };
    if (!maybe()) { done(false); return; }
    tm = setTimeout(function () { done(false); }, 2500);   /* ПОСТОЯННАЯ: 2,5 с — дольше человек решит, что кнопка не работает */
    try {
      Promise.resolve(SR().available({ langs: [bcp()], processLocally: true })).then(function (r) { done(r === "available"); }, function () { done(false); });
    } catch (e) { done(false); }
  }
  var rec = null;
  function start(onText, onEnd) {
    if (!localOk || rec) return false;
    var R = SR(); if (!R) return false;
    try {
      rec = new R();
      rec.lang = bcp(); rec.interimResults = true; rec.continuous = false;
      rec.processLocally = true;   /* обязательно: без этого звук ушёл бы наружу */
      if (rec.processLocally !== true) { rec = null; localOk = false; return false; }
      rec.onresult = function (ev) {
        var s = "";
        for (var i = 0; i < ev.results.length; i++) s += ev.results[i][0].transcript;
        if (onText) onText(s, !!(ev.results[ev.results.length - 1] && ev.results[ev.results.length - 1].isFinal));
      };
      rec.onend = rec.onerror = function () { rec = null; if (onEnd) onEnd(); };
      rec.start();
      return true;
    } catch (e) { rec = null; return false; }
  }
  function stop() { if (rec) { try { rec.stop(); } catch (e) { rec = null; } } }
  /* смена языка — другая модель: спросить заново */
  if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", function () { localOk = null; });

  window.sbThought = { save: save, open: openNote, mic: { maybe: maybe, asked: function () { return localOk !== null || waiters.length > 0; }, available: available, start: start, stop: stop, on: function () { return !!rec; } } };
})();
