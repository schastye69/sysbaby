/*
 * alarm.js — БУДИЛЬНИК, КОТОРЫЙ НЕ МОЖЕТ СОВРАТЬ (D-198, построен в v106).
 *
 * ПОВОД, дословно от основателя: «когда нажимаешь на время, должна быть
 * возможность установить будильник» и «прошу, чтобы совет выбрал самое
 * гениальное, эффективное и концептуальное решение».
 *
 * РЕШЕНИЕ БЫЛО ЗАПИСАНО ЗАРАНЕЕ (D-198) и здесь исполняется дословно. Три
 * слоя, и ни один не притворяется:
 *
 *   1. ВКЛАДКА ОТКРЫТА. В названную минуту звучит звук, комната коротко
 *      вспыхивает, заметка выходит вперёд.
 *   2. ВКЛАДКА БЫЛА ЗАКРЫТА ИЛИ В ФОНЕ. При возвращении система сама
 *      говорит, что прошло и сколько назад. Разрешений не нужно, не теряется
 *      ничего, работает даже после выключенного телефона.
 *   3. ОТДЕЛЬНЫЙ ВЫКЛЮЧАТЕЛЬ, ПО УМОЛЧАНИЮ ВЫКЛЮЧЕННЫЙ — «будить вне
 *      вкладки». Только он просит разрешение браузера, и рядом сказано, что
 *      это единственное, что уходит наружу.
 *
 * ГЛАВНОЕ ЗДЕСЬ — ОДНА СТРОКА: система ЗНАЕТ, играл ли звук на самом деле.
 * Браузер имеет право не дать звука (вкладка без единого касания, тихий
 * режим, политика автозапуска). Будильник, который в этом случае молчит и
 * ставит себе галочку «разбудил», — обманщик. Поэтому ring() возвращает не
 * «сделано», а СОСТОЯНИЕ: "played" или "blocked", оно записывается в самой
 * записи будильника, и невыстреливший звук превращается в отчёт слоя 2.
 *
 * Охраняется tools/alarm-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var KEY = "sysbaby.alarms.v1";
  var TICK = 5000;         /* шаг проверки: минута названа минутой, а не секундой */
  var KEEP = 7 * 24 * 3600000;

  function readAll() {
    try {
      var v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function writeAll(list) {
    try { window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200))); } catch (e) { /* ignore */ }
  }
  function prune(list, now) {
    return list.filter(function (r) { return r && r.at && (now - r.at) < KEEP; });
  }
  function idOf(noteId, at) { return String(noteId) + "@" + String(at); }

  /* ── ЗВУК, КОТОРЫЙ ОТЧИТЫВАЕТСЯ ───────────────────────────────────────
     Три ноты вверх, мягко и настойчиво. Возвращает "played", только если
     браузер действительно запустил звук В ЭТУ МИНУТУ; всё прочее — "blocked",
     и это не ошибка, а правда, которую обязан знать слой 2. */
  var actx = null;
  function tone() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return "blocked";
      if (!actx) actx = new AC();
      if (actx.state !== "running") { try { actx.resume(); } catch (e) { /* ignore */ } }
      if (actx.state !== "running") return "blocked";
      var t0 = actx.currentTime;
      [0, 0.18, 0.36].forEach(function (d, i) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine";
        o.frequency.value = [587.33, 739.99, 880][i];
        g.gain.setValueAtTime(0.0001, t0 + d);
        g.gain.exponentialRampToValueAtTime(0.16, t0 + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.42);
        o.connect(g); g.connect(actx.destination);
        o.start(t0 + d); o.stop(t0 + d + 0.45);
      });
      try { if (navigator.vibrate) navigator.vibrate([90, 70, 90]); } catch (e) { /* ignore */ }
      return "played";
    } catch (e) { return "blocked"; }
  }

  function flashRoom() {
    try {
      doc.body.classList.add("sb-alarm-flash");
      setTimeout(function () { doc.body.classList.remove("sb-alarm-flash"); }, 1400);
    } catch (e) { /* ignore */ }
  }

  function bringForward(noteId) {
    try {
      var el = doc.querySelector('.sticky-note[data-id="' + String(noteId).replace(/"/g, '\\"') + '"]');
      if (!el) return false;
      el.classList.add("is-ringing");
      setTimeout(function () { el.classList.remove("is-ringing"); }, 8000);
      if (el.scrollIntoView) el.scrollIntoView({ block: "nearest", inline: "nearest" });
      return true;
    } catch (e) { return false; }
  }

  function say(title, text) {
    /* Голос у системы один — извещение. Слой 2 говорит им же, и потому
       сказанное остаётся в журнале, а не исчезает через пять секунд. */
    if (typeof window.showToast === "function") {
      window.showToast(title, text, null, true, "", "event");
    }
  }
  function tr(key, vars) {
    try { if (typeof window.sbT === "function") return window.sbT(key, vars); } catch (e) { /* ignore */ }
    return key;
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function clockOf(at) { var d = new Date(at); return two(d.getHours()) + ":" + two(d.getMinutes()); }
  function agoOf(ms) {
    var m = Math.max(1, Math.round(ms / 60000));
    if (m < 60) return tr("alarm.agoMin", { n: m });
    var h = Math.round(m / 60);
    if (h < 24) return tr("alarm.agoHour", { n: h });
    return tr("alarm.agoDay", { n: Math.round(h / 24) });
  }

  /* ── СЛОЙ 3: НАРУЖУ ТОЛЬКО ПО ОТДЕЛЬНОМУ СЛОВУ ────────────────────────
     Разрешение не спрашивается ни при загрузке, ни при заведении будильника —
     только в ответ на включение выключателя. Пока он выключен, наружу не
     уходит ничего, и заявление на двери остаётся правдой. */
  function outsideOn() {
    try { return !!(window.sbGetControlToggle && window.sbGetControlToggle("wakeOutside")); }
    catch (e) { return false; }
  }
  function outsideSay(title, text) {
    if (!outsideOn()) return false;
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return false;
      new Notification(title, { body: text, tag: "sysbaby-alarm" });
      return true;
    } catch (e) { return false; }
  }
  function askOutside() {
    try {
      if (!("Notification" in window)) return;
      if (Notification.permission === "default") Notification.requestPermission();
    } catch (e) { /* ignore */ }
  }
  if (window.sbBus && window.sbBus.on) {
    window.sbBus.on("setting:changed", function (p) {
      if (p && p.kind === "toggle" && p.key === "wakeOutside" && p.on) askOutside();
    });
  }

  /* ── СЛОЙ 1 ───────────────────────────────────────────────────────────── */
  function ring(rec) {
    var sound = tone();
    flashRoom();
    var seen = bringForward(rec.note);
    rec.rang = Date.now();
    rec.sound = sound;
    /* Увиденным будильник считается, только если он И прозвучал, И заметка
       нашлась на столе. Иначе его подхватит слой 2 при возвращении. */
    rec.seen = (sound === "played" && seen && !doc.hidden);
    if (!rec.seen) {
      if (doc.hidden) outsideSay(tr("alarm.title"), tr("alarm.now", { time: clockOf(rec.at) }));
    } else {
      say(tr("alarm.title"), tr("alarm.now", { time: clockOf(rec.at) }));
    }
    if (window.sbBus && window.sbBus.emit) {
      window.sbBus.emit("alarm:rang", { id: rec.id, at: rec.at, sound: sound, seen: rec.seen });
    }
    return sound;
  }

  /* ── СЛОЙ 2 ───────────────────────────────────────────────────────────── */
  function reportMissed(now) {
    var list = readAll(), out = [], changed = false, i;
    for (i = 0; i < list.length; i++) {
      var r = list[i];
      if (!r || !r.armed || r.seen) continue;
      if (r.at > now) continue;
      r.seen = true;
      r.missedAt = now;
      changed = true;
      out.push(r);
    }
    if (changed) writeAll(list);
    for (i = 0; i < out.length; i++) {
      say(tr("alarm.title"), tr("alarm.passed", { time: clockOf(out[i].at), ago: agoOf(now - out[i].at) }));
    }
    if (out.length && window.sbBus && window.sbBus.emit) {
      window.sbBus.emit("alarm:missed", { count: out.length, at: out.map(function (r) { return r.at; }) });
    }
    return out;
  }

  var timer = null;
  function tick() {
    var now = Date.now();
    var list = readAll(), changed = false, i;
    for (i = 0; i < list.length; i++) {
      var r = list[i];
      if (!r || !r.armed || r.rang) continue;
      if (r.at > now) continue;
      ring(r);
      changed = true;
    }
    if (changed) writeAll(list);
    return changed;
  }

  window.sbAlarms = {
    list: function () { return readAll(); },
    /* Будильник принадлежит МИГУ, а не словам: перепишешь час — это другой
       миг, и его заводят заново. Так запись не начинает жить своей жизнью. */
    at: function (noteId, at) {
      var want = idOf(noteId, at), list = readAll(), i;
      for (i = 0; i < list.length; i++) if (list[i] && list[i].id === want && list[i].armed) return list[i];
      return null;
    },
    set: function (noteId, at, sayWhat) {
      var now = Date.now();
      var list = prune(readAll(), now);
      var want = idOf(noteId, at), i;
      for (i = 0; i < list.length; i++) if (list[i] && list[i].id === want) { list.splice(i, 1); break; }
      var rec = { id: want, note: String(noteId), at: at, armed: true, rang: null, sound: null,
                  seen: false, say: String(sayWhat || "").slice(0, 60), setAt: now };
      list.push(rec);
      writeAll(list);
      if (window.sbBus && window.sbBus.emit) window.sbBus.emit("alarm:set", { id: rec.id, at: at });
      return rec;
    },
    clear: function (noteId, at) {
      var want = idOf(noteId, at);
      var list = readAll().filter(function (r) { return !(r && r.id === want); });
      writeAll(list);
      if (window.sbBus && window.sbBus.emit) window.sbBus.emit("alarm:clear", { id: want, at: at });
      return true;
    },
    /* Наружу — чтобы закон гонял оба слоя настоящими числами, а не ждал. */
    tick: tick,
    reportMissed: reportMissed,
    outsideOn: outsideOn
  };

  function start() {
    reportMissed(Date.now());
    if (timer) clearInterval(timer);
    timer = setInterval(tick, TICK);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
  /* Вернулись во вкладку — сначала отчёт о пропущенном, потом обычный ход. */
  doc.addEventListener("visibilitychange", function () { if (!doc.hidden) reportMissed(Date.now()); });
})();
