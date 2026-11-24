/* sys.baby OS — core/noteplus.js
 * РАЗВИТИЕ ЗАПИСЕЙ · решения D-886 (главное сегодня) и D-887 (повтор),
 * основатель 11.11.2026 (plan-dalshe/instrumenty-stola.md: «Развитие
 * заметок»). Не новая функция, а новый способ прочитать и показать запись.
 *
 * ПОВТОР ЧИТАЕТСЯ ИЗ СЛОВ, КАК СРОК (D-111, v71). «Таблетки каждый день в
 * 9:00», «полить цветы по субботам 10:00», «water every day 8:30»,
 * «vesi iga päev 9:00» — человек и так пишет это; поля «повтор» нет.
 * Понятое показывается меткой часа на столе (её рисует desktop.js через
 * sbNoteMoment — здесь она узнаёт следующий раз, а не «опоздало») и звенит
 * будильником системы (core/alarm.js, все три слоя прежние). Прозвенело —
 * заводится следующий раз. Повтор без часа — просто слова: будить некогда.
 * Час повтора НЕ уходит из текста на столе (v94): это правило, а не миг.
 *
 * ГЛАВНОЕ СЕГОДНЯ. Запись можно отметить (кнопка в Записях, sbNoteToday.set):
 * поле today = «ГГГГ-ММ-ДД» этого дня. Главное одно: новая отметка снимает
 * прежнюю. Светится в середине стола (core/desktools.js) до полуночи;
 * назавтра отметка молча перестаёт действовать — она была про тот день.
 *
 * Охраняется tools/notes-repeat-check.mjs и tools/notes-today-check.mjs. */
(function () {
  "use strict";
  var doc = document, DAY = 86400000, MIN = 60000, HOUR = 3600000;
  var REP_KEY = "sysbaby.notes.repeat.v1";
  function T(k, v) { return window.sbToolT ? window.sbToolT(k, v) : k; }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function startOfDay(ms) { var d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function dayKey(ms) { var d = new Date(ms == null ? Date.now() : ms); return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()); }
  function say(text) {
    try { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(text); else if (window.showToast) window.showToast(text, "", null, false, "", "confirm"); } catch (e) { /* голос занят — запись всё равно сделана */ }
  }

  /* ---------- повтор: чистая функция слов ---------- */
  /* дни: 0 — воскресенье … 6 — суббота (как у Date) */
  var DAYS = [
    { d: 1, re: /(кажд\S*\s+понедельник|(?:^|[^а-яё])понедельникам|every\s+monday|on\s+mondays|\bmondays\b|iga\s+esmaspäev|esmaspäeviti)/ },
    { d: 2, re: /(кажд\S*\s+вторник|(?:^|[^а-яё])вторникам|every\s+tuesday|on\s+tuesdays|\btuesdays\b|iga\s+teisipäev|teisipäeviti)/ },
    { d: 3, re: /(кажд\S*\s+сред[уы]|(?:^|[^а-яё])средам|every\s+wednesday|on\s+wednesdays|\bwednesdays\b|iga\s+kolmapäev|kolmapäeviti)/ },
    { d: 4, re: /(кажд\S*\s+четверг|(?:^|[^а-яё])четвергам|every\s+thursday|on\s+thursdays|\bthursdays\b|iga\s+neljapäev|neljapäeviti)/ },
    { d: 5, re: /(кажд\S*\s+пятниц[уы]|(?:^|[^а-яё])пятницам|every\s+friday|on\s+fridays|\bfridays\b|iga\s+reede|reedeti)/ },
    { d: 6, re: /(кажд\S*\s+суббот[уы]|(?:^|[^а-яё])субботам|every\s+saturday|on\s+saturdays|\bsaturdays\b|iga\s+laupäev|laupäeviti)/ },
    { d: 0, re: /(кажд\S*\s+воскресень[ея]|(?:^|[^а-яё])воскресеньям|every\s+sunday|on\s+sundays|\bsundays\b|iga\s+pühapäev|pühapäeviti)/ }
  ];
  var R_DAY = /(кажд\S*\s+день|ежедневно|каждые\s+сутки|каждое\s+утро|каждый\s+вечер|every\s*day|\bdaily\b|every\s+morning|every\s+evening|iga\s+päev|igapäevaselt|iga\s+hommik|iga\s+õhtu)/;
  var R_WD = /(по\s+будням|в\s+будни|кажд\S*\s+будн\S*|on\s+weekdays|every\s+weekday|\bweekdays\b|tööpäeviti|igal\s+tööpäeval)/;
  var R_WE = /(по\s+выходным|в\s+выходные|кажд\S*\s+выходн\S*|on\s+weekends|at\s+weekends|every\s+weekend|\bweekends\b|nädalavahetustel|nädalavahetuseti)/;
  function hourOf(text) {
    if (typeof window.sbNoteHour === "function") return window.sbNoteHour(text);
    var m = /(^|[^\d.,:])([01]?\d|2[0-3]):([0-5]\d)(?![\d.,:])/.exec(String(text || ""));
    return m ? { h: +m[2], m: +m[3] } : null;
  }
  function repeatOf(text) {
    var src = String(text == null ? "" : text).toLowerCase();
    if (!src) return null;
    var days = null, kind = null;
    if (R_WD.test(src)) { kind = "weekdays"; days = [1, 2, 3, 4, 5]; }
    else if (R_WE.test(src)) { kind = "weekends"; days = [6, 0]; }
    else if (R_DAY.test(src)) { kind = "day"; days = [0, 1, 2, 3, 4, 5, 6]; }
    else {
      var hit = DAYS.filter(function (x) { return x.re.test(src); }).map(function (x) { return x.d; });
      if (hit.length) { kind = "week"; days = hit; }
    }
    if (!kind) return null;
    var hr = hourOf(text);
    if (!hr || hr.endOfDay) return null;   /* без часа будить некогда: это просто слова */
    return { kind: kind, days: days, h: hr.h, m: hr.m, sig: kind + ":" + days.join("") + "@" + hr.h + ":" + hr.m };
  }
  /* следующий раз строго после nowAt */
  function nextAt(rep, nowAt) {
    var now = typeof nowAt === "number" ? nowAt : Date.now(), base = startOfDay(now);
    for (var i = 0; i < 9; i++) {
      var d = new Date(base + i * DAY + 12 * HOUR);   /* полдень — переход часов не сдвигает день */
      d.setHours(rep.h, rep.m, 0, 0);
      if (d.getTime() > now && rep.days.indexOf(d.getDay()) !== -1) return d.getTime();
    }
    return null;
  }
  var DAYNAME = {
    ru: ["воскресеньям", "понедельникам", "вторникам", "средам", "четвергам", "пятницам", "субботам"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ee: ["pühapäeviti", "esmaspäeviti", "teisipäeviti", "kolmapäeviti", "neljapäeviti", "reedeti", "laupäeviti"]
  };
  function label(rep) {
    if (!rep) return "";
    var t = two(rep.h) + ":" + two(rep.m), l = typeof window.sbLang === "function" ? window.sbLang() : "en";
    if (rep.kind !== "week") return T("nt.repeat." + rep.kind, { t: t });
    /* ОТКАТ: языка нет в таблице дней — дни недели по-английски, а не пустые имена в строке повтора. */
    var names = (DAYNAME[l] || DAYNAME.en), and = l === "ru" ? " и " : l === "ee" ? " ja " : " and ";
    return T("nt.repeat.week", { d: rep.days.map(function (d) { return names[d]; }).join(and), t: t });
  }
  window.sbNoteRepeat = repeatOf;
  window.sbNoteRepeatNext = nextAt;
  window.sbNoteRepeatLabel = label;

  /* ---------- метка часа на столе знает повтор ---------- */
  /* desktop.js читает sbNoteMoment и sbNoteStrip через window — обёртка
     говорит за повтор, остальное отдаёт прежнему разбору без изменений.
     ОТКАТ: desktop.js не загрузился — обёртывать нечего, повтор живёт
     только будильником и меткой в Записях. */
  function wrap() {
    var mo = window.sbNoteMoment, st = window.sbNoteStrip;
    if (typeof mo === "function" && !mo.__rep) {
      var m2 = function (text, writtenAt, nowAt) {
        var rep = repeatOf(text);
        if (!rep) return mo.apply(this, arguments);
        var now = typeof nowAt === "number" ? nowAt : Date.now(), at = nextAt(rep, now);
        if (at == null) return mo.apply(this, arguments);
        var left = at - now;
        return { at: at, h: rep.h, m: rep.m, endOfDay: false, said: "repeat", repeat: rep,
          dayOffset: Math.round((startOfDay(at) - startOfDay(now)) / DAY), late: false,
          strike: left < MIN, soonMin: (left >= MIN && left < HOUR) ? Math.floor(left / MIN) : null };
      };
      m2.__rep = true; window.sbNoteMoment = m2;
    }
    if (typeof st === "function" && !st.__rep) {
      var s2 = function (text) { return repeatOf(text) ? String(text == null ? "" : text) : st.apply(this, arguments); };
      s2.__rep = true; window.sbNoteStrip = s2;
    }
  }

  /* ---------- будильник повтора ---------- */
  function db() { return window.sbDB || null; }
  function readArmed() { try { var v = JSON.parse((db() && db().get(REP_KEY)) || "{}"); return v && typeof v === "object" ? v : {}; } catch (e) { return {}; } }
  function writeArmed(o) { try { if (db()) db().set(REP_KEY, JSON.stringify(o)); } catch (e) { /* хранилище закрыто — заведём при следующем шаге */ } }
  function titleOf(text) { var l = String(text || "").split("\n").filter(function (x) { return x.trim(); })[0] || ""; return l.slice(0, 60); }
  var quiet = true;   /* первый обход после загрузки молчит: повторы уже знакомы */
  function sweep() {
    var S = window.sbNotesStore, A = window.sbAlarms;
    if (!S || !A || (db() && db().closed && db().closed())) return;
    var now = Date.now(), armed = readArmed(), next = {}, changed = false, spoken = false;
    (S.load() || []).forEach(function (n) {
      if (!n || !n.id) return;
      var rep = repeatOf(n.text); if (!rep) return;
      var at = nextAt(rep, now); if (at == null) return;
      var was = armed[n.id];
      next[n.id] = { at: at, sig: rep.sig };
      if (was && was.at !== at && was.at > now) { try { A.clear(n.id, was.at); } catch (e) { /* уже снят */ } }
      if (!A.at(n.id, at)) { A.set(n.id, at, titleOf(n.text)); changed = true; }
      if (!quiet && !spoken && (!was || was.sig !== rep.sig)) {
        spoken = true;
        var d = new Date(at), when = label(rep);
        say(T("nt.repeat.said", { when: when || (two(d.getHours()) + ":" + two(d.getMinutes())) }));
      }
    });
    /* запись потеряла повтор (слова переписаны, запись в корзине) — снять то, что заводил повтор */
    Object.keys(armed).forEach(function (id) {
      if (next[id]) return;
      if (armed[id].at > now) { try { A.clear(id, armed[id].at); } catch (e) { /* уже снят */ } }
      changed = true;
    });
    if (changed || JSON.stringify(next) !== JSON.stringify(armed)) writeArmed(next);
    quiet = false;
  }
  var sweepT = 0;
  function soon(ms) { clearTimeout(sweepT); sweepT = setTimeout(sweep, ms == null ? 900 : ms); }

  /* ---------- главное сегодня ---------- */
  function todayNote() {
    var S = window.sbNotesStore; if (!S) return null;
    var k = dayKey(), hit = null;
    (S.load() || []).forEach(function (n) { if (!hit && n && n.today === k && String(n.text || "").trim()) hit = n; });
    return hit;
  }
  function setToday(id, on) {
    var S = window.sbNotesStore; if (!S || !id) return false;
    var k = dayKey(), list = S.load() || [], found = false;
    list.forEach(function (n) {
      if (!n) return;
      if (n.id === id) { found = true; if (on) n.today = k; else delete n.today; }
      else if (on && n.today) delete n.today;   /* главное одно */
    });
    if (!found) return false;
    S.save(list); S.notify();
    say(T(on ? "nt.today.on" : "nt.today.off"));
    try { window.dispatchEvent(new CustomEvent("sb:today", { detail: { id: on ? id : null } })); } catch (e) { /* старый браузер */ }
    return true;
  }
  window.sbNoteToday = {
    get: todayNote,
    set: setToday,
    is: function (n) { return !!(n && n.today === dayKey()); },
    key: dayKey
  };

  /* ---------- запуск ---------- */
  var tries = 0, iv = setInterval(function () {
    if (++tries > 600) { clearInterval(iv); return; }
    if (!window.sbNotesStore || !window.sbAlarms) return;
    clearInterval(iv);
    wrap();
    window.sbNotesStore.onChange(function () { soon(); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("alarm:rang", function () { soon(1500); });
    setInterval(sweep, MIN);
    soon(1200);
  }, 100);
  /* desktop.js мог встать позже — обёртка ставится и тогда */
  doc.addEventListener("DOMContentLoaded", wrap);
})();
