/* sys.baby OS — core/clock.js
 * ПАНЕЛЬ ЧАСОВ «НОЧНЫЕ ЧАСЫ» · решение D-853 (основатель 10.11.2026; демо
 * dom-moy-B, утверждено 11.11). Касание времени в полосе открывает стекло
 * «календарь · таймер · секундомер · будильник» с секундами.
 *
 * ДВА ПРАВИЛА ОСНОВАТЕЛЯ, ради которых панель новая:
 *   1. ЗАПУСК ТАЙМЕРА ПАНЕЛЬ НЕ ЗАКРЫВАЕТ. Время идёт светом на столе
 *      (core/desktime.js, window.sbDeskTime) рядом с ней; под открытой
 *      панелью оно уходит ниже, но не ниже 60 % экрана — низ у голоса.
 *   2. КАСАНИЕ ДАТЫ — ЗАМЕТКА НА ЭТОТ ДЕНЬ. Та же, что прежде (D-154,
 *      note.day.*): дата словами языка человека, курсор в конце, панель
 *      уходит первой. Двойника нет: если заметка этого дня уже лежит на
 *      столе, касание ведёт к ней, а не рождает вторую.
 *
 * ПАНЕЛЬ — ОДНА ИЗ ПАНЕЛЕЙ СИСТЕМЫ: регистрируется в sbPanels (одна открытая,
 * Esc, возврат фокуса). Прежний календарь (core/panels.js, sbTimeOverlay)
 * выключен при сборке: его касание и ход часов молчат, пока есть sbClock;
 * касание времени перехватывается здесь, а кто зовёт
 * sbPanels.sbTimeOverlay.open(), получает эту панель.
 *
 * Таймер и будильник — записи будильника системы (core/alarm.js, note =
 * "clock:timer" | "clock:alarm"): звук, который знает, сыграл ли, и отчёт о
 * пропущенном при возвращении — прежние. Секундомер живёт в памяти вкладки.
 * Охраняется tools/clock-panel-stays-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  function T(k, v) { return window.sbDeskT ? window.sbDeskT(k, v) : (window.sbT ? window.sbT(k, v) : k); }
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }
  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function locale() { var l = typeof window.sbLang === "function" ? window.sbLang() : "en"; return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB"); }
  function cap(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  function dayLine(d) {
    try { return cap(d.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" })); }
    catch (e) { return String(d.getDate()); }
  }
  function mss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return (h ? h + ":" + p2(m) : m) + ":" + p2(s % 60); }
  function swf(ms) { var t = Math.floor(ms / 100), s = Math.floor(t / 10), m = Math.floor(s / 60); return { main: m + ":" + p2(s % 60), sub: "," + (t % 10) }; }

  var X = sbZnak("close");
  function chev(d) { return sbZnak(d < 0 ? "back" : "fwd"); }
  var TABS = ["cal", "timer", "sw", "alarm"];
  var MODE2TAB = { timer: "timer", stopwatch: "sw", alarm: "alarm" };
  var PRE = [45000, 180000, 300000, 600000, 1500000];

  var DT = null, panel = null, api = null, tab = "cal", calShift = 0;
  var timerSet = 180000, timerName = "", alarmAt = null, laps = [], cur = null;   /* cur: { kind, at } — запись будильника системы */

  function preLabel(ms) { return ms < 60000 ? T("clock.sec", { n: ms / 1000 }) : T("clock.min", { n: ms / 60000 }); }
  function markup() {
    return '<div class="ck-head"><div><div class="ck-clock"><span class="ck-hm ck-lt">0:00</span><span class="ck-sec">00</span></div><div class="ck-date"></div></div>' +
      '<button class="ck-x" type="button" id="sbClockClose" data-x="1" aria-label="' + esc(T("clock.close")) + '">' + X + '</button></div>' +
      '<div class="ck-tray" role="tablist">' + TABS.map(function (t) {
        return '<button class="ck-w" role="tab" type="button" data-tab="' + t + '" aria-selected="false">' + esc(T("clock.tab." + t)) + '<span class="ck-run" hidden></span></button>';
      }).join("") + '</div>' +
      '<div class="ck-sec-tab" data-sec="cal" role="tabpanel"><div class="ck-mh"><b class="ck-mon"></b><span class="ck-year"></span><span style="flex:1"></span>' +
      '<button class="ck-nav" type="button" data-nav="-1" aria-label="' + esc(T("clock.prev")) + '">' + chev(-1) + '</button><button class="ck-nav" type="button" data-nav="1" aria-label="' + esc(T("clock.next")) + '">' + chev(1) + '</button></div>' +
      '<div class="ck-grid"></div><div class="ck-hint">' + esc(T(doc.documentElement.classList.contains("is-touch") ? "clock.cal.hint" : "clock.cal.hintPointer")) + '</div></div>' +
      '<div class="ck-sec-tab" data-sec="timer" role="tabpanel"><div class="ck-big"><span class="m ck-lt ck-tm">0:00</span></div><div class="ck-sub ck-tsub" aria-live="polite"></div>' +
      '<div class="ck-tray small ck-pre">' + PRE.map(function (ms) { return '<button class="ck-w" type="button" data-ms="' + ms + '" aria-pressed="false">' + esc(preLabel(ms)) + '</button>'; }).join("") + '</div>' +
      '<input class="ck-field ck-tname" type="text" maxlength="24" autocomplete="off" placeholder="' + esc(T("clock.timer.name")) + '" aria-label="' + esc(T("clock.timer.nameAria")) + '">' +
      '<div class="ck-row ck-tact"></div></div>' +
      '<div class="ck-sec-tab" data-sec="sw" role="tabpanel"><div class="ck-big"><span class="m ck-lt ck-swm">0:00</span><span class="s ck-sws">,0</span></div><div class="ck-sub ck-swsub"></div>' +
      '<div class="ck-row ck-swact"></div><div class="ck-laps"></div></div>' +
      '<div class="ck-sec-tab" data-sec="alarm" role="tabpanel"><div class="ck-big"><span class="m ck-lt ck-am">7:30</span></div><div class="ck-sub ck-asub" aria-live="polite"></div>' +
      '<div class="ck-tray small"><button class="ck-w" type="button" data-a="1">' + esc(T("clock.alarm.in1")) + '</button><button class="ck-w" type="button" data-a="-5">' + esc(T("clock.alarm.minus5")) + '</button><button class="ck-w" type="button" data-a="5">' + esc(T("clock.alarm.plus5")) + '</button></div>' +
      '<div class="ck-row ck-aact"></div></div>';
  }
  function q(s) { return panel.querySelector(s); }
  function isOpen() { return !!(api && api.isOpen()); }

  /* ---------- место: под полосой, справа; время на столе — ниже панели ---------- */
  /* Не на телефоне панель встаёт под рядом значков (Чистота, D-845): зона значков
     неприкосновенна; низ ряда называет ядро (sbIconZoneBottom). */
  function topY() {
    var tb = doc.getElementById("topbar"); var r = tb ? tb.getBoundingClientRect() : null;
    var y = Math.round((r && r.height ? r.bottom : 44) + 8);
    if (!root.classList.contains("is-compact") && Number(window.sbIconZoneBottom) > 0) y = Math.max(y, Math.round(window.sbIconZoneBottom + 12));
    return y;
  }
  function layout() {
    var top = topY();
    panel.style.top = top + "px";
    panel.style.maxHeight = Math.max(260, window.innerHeight - top - 12) + "px";
    deskCy();
  }
  function deskCy() {
    if (!DT) return;
    if (!isOpen()) { DT.setCy(null); return; }
    var r = panel.getBoundingClientRect(), Hd = DT.Hd(), H = window.innerHeight;
    var wide = r.left > window.innerWidth * 0.45;     /* панель справа, а время посередине — не мешают, если хватает места слева */
    var want = wide && r.left > Hd * 6.6 ? H * 0.5 : Math.max(H * 0.5, r.bottom + 26 + Hd / 2);
    DT.setCy(want);
  }

  /* ---------- рисование ---------- */
  function paintClock() {
    var d = new Date();
    q(".ck-hm").textContent = p2(d.getHours()) + ":" + p2(d.getMinutes());
    q(".ck-sec").textContent = p2(d.getSeconds());
    var dl = ""; try { dl = d.toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }); } catch (e) { dl = ""; }
    q(".ck-date").textContent = dl;
  }
  function paintTabs() {
    [].forEach.call(panel.querySelectorAll(".ck-tray[role=tablist] .ck-w"), function (b) { b.setAttribute("aria-selected", b.dataset.tab === tab ? "true" : "false"); b.tabIndex = b.dataset.tab === tab ? 0 : -1; });
    [].forEach.call(panel.querySelectorAll(".ck-sec-tab"), function (s) { s.classList.toggle("on", s.dataset.sec === tab); });
    paintRun();
  }
  function paintRun() {
    var i = DT.info(), t = MODE2TAB[i.mode];
    [].forEach.call(panel.querySelectorAll(".ck-tray[role=tablist] .ck-w"), function (b) {
      var r = b.querySelector(".ck-run"), on = b.dataset.tab === t && tab !== t;
      r.hidden = !on; if (on) r.textContent = i.mode === "stopwatch" ? swf(i.v).main : i.done ? "0:00" : mss(i.total - i.v);
    });
  }
  function noteDays() {
    var out = {};
    var live = window.sbNotesStore ? window.sbNotesStore.load() : [];
    live.forEach(function (n) { if (n && n.onDesktop && n.text) out[String(n.text).split("\n")[0].trim()] = n.id; });
    return out;
  }
  function viewMonth() { var now = new Date(); return new Date(now.getFullYear(), now.getMonth() + calShift, 1); }
  function paintCal() {
    var view = viewMonth(), now = new Date(), Y = view.getFullYear(), M = view.getMonth();
    var mon = "", yr = String(Y);
    try { mon = view.toLocaleDateString(locale(), { month: "long" }); } catch (e) { mon = String(M + 1); }
    q(".ck-mon").textContent = mon; q(".ck-year").textContent = yr;
    var h = "", w, d;
    /* 2024-01-01 — понедельник: имена дней приходят из системы дат, неделя с понедельника (Таллин) */
    for (w = 0; w < 7; w++) {
      var dw = new Date(2024, 0, 1 + w), nm = "";
      try { nm = dw.toLocaleDateString(locale(), { weekday: "short" }).replace(/\.$/, ""); } catch (e) { nm = ""; }
      h += '<div class="ck-wd" aria-hidden="true">' + esc(nm) + "</div>";
    }
    var lead = (new Date(Y, M, 1).getDay() + 6) % 7, n = new Date(Y, M + 1, 0).getDate(), days = noteDays();
    var today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (w = 0; w < lead; w++) h += "<div></div>";
    for (d = 1; d <= n; d++) {
      var dt = new Date(Y, M, d), wd = dt.getDay(), line = dayLine(dt), isT = dt.getTime() === today0.getTime();
      var cls = "ck-d" + (wd === 0 || wd === 6 ? " we" : "") + (dt < today0 ? " past" : "") + (isT ? " today" : "") + (days[line] ? " note" : "");
      h += '<button type="button" class="' + cls + '" data-day="' + d + '" aria-label="' + esc(line) + '"' + (isT ? ' aria-current="date"' : "") + ">" + (isT ? '<span class="ck-lt">' + d + "</span>" : d) + "</button>";
    }
    q(".ck-grid").innerHTML = h;
  }
  function act(sel, html) { var el = q(sel); if (el.__h !== html) { el.innerHTML = html; el.__h = html; } }
  function btn(cls, data, word) { return '<button class="' + cls + '" type="button" ' + data + ">" + esc(T(word)) + "</button>"; }
  function paintTimer() {
    var i = DT.info(), mine = i.mode === "timer";
    q(".ck-tm").textContent = mine ? (i.done ? "0:00" : mss(i.total - i.v)) : mss(timerSet);
    [].forEach.call(panel.querySelectorAll(".ck-pre .ck-w"), function (b) { b.setAttribute("aria-pressed", +b.dataset.ms === (mine ? i.total : timerSet) ? "true" : "false"); });
    q(".ck-tsub").textContent = !mine ? T("clock.timer.sub") : i.done ? T("clock.done") : i.paused ? T("clock.paused") : T("clock.running", { name: i.label ? " · " + i.label : "" });
    act(".ck-tact", !mine ? btn("ck-lamp", 'data-t="go"', "clock.go") :
      i.done ? btn("ck-lamp", 'data-t="go"', "clock.again") + btn("ck-q", 'data-t="stop"', "clock.ok") :
      (i.paused ? btn("ck-lamp", 'data-t="on"', "clock.on") : btn("ck-lamp", 'data-t="pause"', "clock.pause")) + btn("ck-q", 'data-t="stop"', "clock.reset"));
  }
  function paintSW() {
    var i = DT.info(), mine = i.mode === "stopwatch", t = swf(mine ? i.v : 0);
    q(".ck-swm").textContent = t.main; q(".ck-sws").textContent = t.sub;
    var lastLap = laps.length ? swf(i.v - laps[laps.length - 1]) : null;
    q(".ck-swsub").textContent = !mine ? T("clock.sw.sub") : i.paused ? T("clock.paused") : lastLap ? T("clock.lapN", { n: laps.length + 1 }) + " · " + lastLap.main + lastLap.sub : T("clock.running", { name: "" });
    act(".ck-swact", !mine ? btn("ck-lamp", 'data-s="go"', "clock.sw.start") :
      i.paused ? btn("ck-lamp", 'data-s="on"', "clock.on") + btn("ck-q", 'data-s="stop"', "clock.reset") :
      btn("ck-lamp", 'data-s="pause"', "clock.pause") + btn("ck-q", 'data-s="lap"', "clock.lap"));
    var lh = laps.slice(-3).map(function (v, j, a) { var n = laps.length - a.length + j, prev = n ? laps[n - 1] : 0, x = swf(v - prev); return "<div><span>" + esc(T("clock.lapN", { n: n + 1 })) + "</span><span>" + x.main + x.sub + "</span></div>"; }).reverse().join("");
    act(".ck-laps", lh);
  }
  function alarmTarget() { if (alarmAt) return alarmAt; var d = new Date(); d.setHours(7, 30, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); return (alarmAt = d); }
  function hm(d) { return d.getHours() + ":" + p2(d.getMinutes()); }
  function paintAlarm() {
    var i = DT.info(), mine = i.mode === "alarm", a = alarmTarget(), now = new Date();
    q(".ck-am").textContent = hm(a);
    var mins = Math.max(0, Math.round((a - now) / 60000)), tomorrow = a.toDateString() !== now.toDateString();
    var wd = ""; try { wd = a.toLocaleDateString(locale(), { weekday: "long" }); } catch (e) { wd = ""; }
    var when = tomorrow ? T("clock.alarm.tomorrow", { day: wd }) : T("clock.alarm.today");
    var left = mins >= 60 ? T("clock.alarm.hm", { h: Math.floor(mins / 60), m: mins % 60 }) : T("clock.alarm.m", { m: mins });
    q(".ck-asub").textContent = mine ? (i.done ? T("clock.alarm.now") : T("clock.alarm.standing")) : T("clock.alarm.left", { when: when, left: left });
    act(".ck-aact", !mine ? btn("ck-lamp", 'data-a2="go"', "clock.alarm.set") :
      i.done ? btn("ck-lamp", 'data-a2="stop"', "clock.ok") : btn("ck-q", 'data-a2="stop"', "clock.alarm.off"));
  }
  function paintAll() { paintClock(); paintTabs(); if (tab === "cal") paintCal(); paintTimer(); paintSW(); paintAlarm(); }

  /* ---------- запись будильника системы ---------- */
  function A() { return window.sbAlarms || null; }
  function forget() {
    if (cur && A()) { try { A().clear("clock:" + cur.kind, cur.at); } catch (e) { /* запись уже снята */ } }
    cur = null;
  }
  function remember(kind, at, say) {
    forget();
    cur = { kind: kind, at: at };
    if (A()) { try { A().set("clock:" + kind, at, say || ""); } catch (e) { cur = { kind: kind, at: at, mem: true }; } }
  }
  function startTimer(ms, name) { DT.timer(ms, name); remember("timer", Date.now() + ms, name); }
  function stopAll() { forget(); DT.stop(); }

  /* ---------- заметка этого дня (D-154, без двойника) ---------- */
  function dayNote(when) {
    if (api) api.close();
    var line = dayLine(when);
    var days = noteDays(), id = days[line] || null, fresh = false;
    if (!id) {
      if (typeof window.sbAddQuickNote !== "function") return;
      /* туда, где человек её увидит: чуть ниже полосы и левее середины */
      var x = Math.max(16, Math.round(window.innerWidth * 0.12));
      var y = Math.max(96, Math.round(window.innerHeight * 0.28));
      id = window.sbAddQuickNote(line, { onDesktop: true, x: x, y: y });
      fresh = true;
    }
    if (fresh && window.showToast) { try { window.showToast(tr("note.day.title"), tr("note.day.body"), ""); } catch (e) { /* голос занят */ } }
    setTimeout(function () {
      var el = doc.querySelector('#sbNoteLayer .sticky-note[data-id="' + id + '"]');
      var ta = el ? el.querySelector(".note-text") : null;
      if (!ta) return;
      try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { /* ignore */ }
    }, 260);
  }

  /* ---------- события ---------- */
  function onClick(e) {
    var b = e.target.closest ? e.target.closest("button") : null; if (!b || !panel.contains(b)) return;
    var i = DT.info();
    if (b.dataset.x) { api.close(); return; }
    if (b.dataset.tab) { tab = b.dataset.tab; paintTabs(); if (tab === "cal") paintCal(); deskCy(); return; }
    if (b.dataset.nav) { calShift += +b.dataset.nav; paintCal(); return; }
    if (b.dataset.day) { var v = viewMonth(); dayNote(new Date(v.getFullYear(), v.getMonth(), +b.dataset.day)); return; }
    if (b.dataset.ms) { timerSet = +b.dataset.ms; if (i.mode === "timer" && !i.done) startTimer(timerSet, timerName); paintTimer(); return; }
    var t = b.dataset.t, s = b.dataset.s, a = b.dataset.a, a2 = b.dataset.a2;
    if (t === "go") { timerName = (q(".ck-tname").value || "").trim(); startTimer(timerSet, timerName); }
    if (t === "pause") { DT.pause(); forget(); }
    if (t === "on") { var r = DT.info(); DT.resume(); remember("timer", Date.now() + Math.max(0, r.total - r.v), r.label); }
    if (s === "pause") DT.pause();
    if (s === "on") DT.resume();
    if (t === "stop" || s === "stop" || a2 === "stop") { stopAll(); if (s) laps = []; if (a2) alarmAt = null; }
    if (s === "go") { laps = []; forget(); DT.stopwatch(); }
    if (s === "lap") laps.push(i.v);
    if (a) {
      var at = alarmTarget();
      if (a === "1") { at = new Date(Date.now() + 60000); at.setSeconds(0, 0); if (at - Date.now() < 30000) at = new Date(at.getTime() + 60000); }
      else at = new Date(at.getTime() + (+a) * 60000);
      if (at < new Date()) at = new Date(at.getTime() + 86400000);
      alarmAt = at;
    }
    if (a2 === "go") { var at2 = alarmTarget(); DT.alarm(at2 - Date.now(), hm(at2)); remember("alarm", at2.getTime(), hm(at2)); }
    paintTimer(); paintSW(); paintAlarm(); paintRun(); deskCy();
  }
  function onDone() {
    /* срок известен точно — звенеть в него, а не в шаг проверки будильника */
    var i = DT.info();
    if (cur && (i.mode === "timer" || i.mode === "alarm") && A() && A().ringNow) {
      try { A().ringNow("clock:" + cur.kind, cur.at); } catch (e) { /* звук не дался — отчёт слоя 2 */ }
      cur = null;
    }
    if (panel) { paintTimer(); paintSW(); paintAlarm(); paintRun(); }
  }
  /* после перезагрузки: идущий таймер или стоящий будильник продолжаются на столе */
  function restore() {
    if (!A() || !A().clock) return;
    var now = Date.now();
    A().clock().forEach(function (r) {
      if (r.at <= now || cur) return;
      var kind = r.note === "clock:timer" ? "timer" : "alarm", tot = Math.max(1000, r.at - (r.setAt || now)), el = now - (r.setAt || now);
      cur = { kind: kind, at: r.at };
      if (kind === "timer") { timerName = r.say || ""; DT.timer(tot, timerName, el); }
      else { alarmAt = new Date(r.at); DT.alarm(tot, r.say || hm(alarmAt), el); }
    });
  }

  function build() {
    panel = doc.createElement("section");
    panel.id = "sbClockPanel";
    panel.className = "ck-glass";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", T("clock.aria"));
    panel.hidden = true;
    panel.innerHTML = markup();
    doc.body.appendChild(panel);
    panel.addEventListener("click", onClick);
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("ck-tname")) { var g = q('[data-t="go"]'); if (g) g.click(); }
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && e.target.getAttribute && e.target.getAttribute("role") === "tab") {
        var k = TABS.indexOf(e.target.dataset.tab) + (e.key === "ArrowRight" ? 1 : -1);
        tab = TABS[(k + TABS.length) % TABS.length]; paintTabs(); if (tab === "cal") paintCal();
        var nb = q('[role=tab][data-tab="' + tab + '"]'); if (nb) nb.focus();
      }
    });
    api = window.sbRegisterPanel ? window.sbRegisterPanel("sbClockPanel", "sbClockClose", function () {
      calShift = 0; mood(); layout(); paintAll();
      var b = doc.getElementById("sbClockBtn"); if (b) b.setAttribute("aria-expanded", "true");
      setTimeout(deskCy, 30);
    }) : null;
    if (!api) return false;
    api.onClose = function () { var b = doc.getElementById("sbClockBtn"); if (b) b.setAttribute("aria-expanded", "false"); if (DT) DT.setCy(null); };

    /* касание времени в полосе — эта панель, раньше обработчика прежней */
    doc.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("#sbClockBtn") : null; if (!t) return;
      e.stopImmediatePropagation(); e.preventDefault();
      if (api.isOpen()) api.close(); else api.open();
    }, true);
    /* кто зовёт прежнюю панель времени (палитра, подсказки), получает эту */
    var old = window.sbPanels && window.sbPanels.sbTimeOverlay;
    if (old) old.open = function () { api.open(); };
    var oldX = doc.getElementById("sbTimeClose");
    if (oldX) oldX.addEventListener("click", function () { api.close(); });
    /* касание мимо — закрыть (сама панель и кнопка времени — не «мимо») */
    doc.addEventListener("pointerdown", function (e) {
      if (!api.isOpen()) return;
      var t = e.target; if (!t || !t.closest) return;
      if (t.closest("#sbClockPanel, #sbClockBtn")) return;
      api.close();
    }, true);
    window.addEventListener("resize", function () { if (api.isOpen()) layout(); });
    window.addEventListener("sb:theme", mood);
    if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", relang);
    window.addEventListener("sb:strings", relang);
    if (window.sbNotesStore) window.sbNotesStore.onChange(function () { if (api.isOpen() && tab === "cal") paintCal(); });
    DT.on(function (ev) { if (ev === "done") onDone(); if (ev === "gone" || ev === "stop") { if (api.isOpen()) { paintTimer(); paintSW(); paintAlarm(); paintRun(); } } });
    /* часы панели — каждую секунду; секундомер на своей вкладке — десятыми */
    setInterval(function () { if (!api.isOpen()) return; paintClock(); paintRun(); var i = DT.info(); if (i.mode === "timer") paintTimer(); if (tab === "alarm") paintAlarm(); }, 1000);
    setInterval(function () { if (api.isOpen() && tab === "sw" && DT.info().mode === "stopwatch") paintSW(); }, 100);
    restore();
    return true;
  }
  function relang() {
    if (!panel) return;
    var name = q(".ck-tname") ? q(".ck-tname").value : "";
    panel.innerHTML = markup();
    panel.setAttribute("aria-label", T("clock.aria"));
    if (q(".ck-tname")) q(".ck-tname").value = name;
    if (api && api.isOpen()) paintAll();
  }
  function mood() {
    if (!panel) return;
    var m = window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio";
    panel.setAttribute("data-mood", m);
  }

  window.sbClock = {
    open: function (t) { if (t) tab = t; if (api) api.open(); },
    close: function () { if (api) api.close(); },
    isOpen: isOpen
  };

  var tries = 0, iv = setInterval(function () {
    if (++tries > 600) { clearInterval(iv); return; }
    if (!window.sbDeskTime || !window.sbRegisterPanel || !doc.getElementById("sbClockBtn") || !doc.body) return;
    clearInterval(iv);
    DT = window.sbDeskTime;
    build();
  }, 100);
})();
