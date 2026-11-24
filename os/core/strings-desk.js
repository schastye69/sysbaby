/* sys.baby OS — core/strings-desk.js
 * Слова стола (П3, v178-H4a, D-850…869): приветственная заметка, панель часов
 * «ночные часы», время на столе. Влиты через window.sbAddStrings (D-800).
 * Обращение — «вы» (по умолчанию знакомства); формы «ты» — забота П2.
 * Приветственные фразы — №1, 3, 8, 23, 9 из plan/PRIVETSTVIE-FRAZY.md
 * (выбор основателя 11.11); EN/ET — по смыслу, без восклицательных знаков. */
(function () {
  "use strict";
  var D = {
    en: {
      "welcome.p1": "Hello. This home is yours now — make yourself comfortable.",
      "welcome.p3": "Whatever you write here stays with you alone.",
      "welcome.p8": "The first note is ours. All the others will be yours.",
      "welcome.p23": "The light is on, the door is locked, the place is free.",
      "welcome.p9": "No hurry. This home is not going anywhere.",
      "welcome.hint": "touch an empty spot to leave your own",

      "clock.aria": "Clock and calendar",
      "clock.close": "Close",
      "clock.tab.cal": "calendar",
      "clock.tab.timer": "timer",
      "clock.tab.sw": "stopwatch",
      "clock.tab.alarm": "alarm",
      "clock.prev": "Previous month",
      "clock.next": "Next month",
      "clock.cal.hint": "Touch a date — a note for that day appears on the desk.",
      "clock.sec": "{n} s",
      "clock.min": "{n} min",
      "clock.timer.sub": "Time runs in light on the desk — no need to close this panel.",
      "clock.timer.name": "name it? for example, tea",
      "clock.timer.nameAria": "Timer name",
      "clock.timer.title": "Timer",
      "clock.timer.rang": "Time is up{name}.",
      "clock.go": "start",
      "clock.again": "again",
      "clock.ok": "all right",
      "clock.pause": "pause",
      "clock.on": "go on",
      "clock.reset": "reset",
      "clock.done": "Time is up.",
      "clock.paused": "Paused.",
      "clock.running": "Running on the desk{name}.",
      "clock.sw.sub": "Time runs in light on the desk.",
      "clock.sw.start": "start",
      "clock.lap": "lap",
      "clock.lapN": "lap {n}",
      "clock.alarm.in1": "in 1 min",
      "clock.alarm.minus5": "− 5 min",
      "clock.alarm.plus5": "+ 5 min",
      "clock.alarm.set": "set",
      "clock.alarm.off": "turn off",
      "clock.alarm.today": "today",
      "clock.alarm.tomorrow": "tomorrow, {day}",
      "clock.alarm.left": "{when} · in {left}",
      "clock.alarm.hm": "{h} h {m} min",
      "clock.alarm.m": "{m} min",
      "clock.alarm.standing": "The alarm is set — the light on the desk counts what is left.",
      "clock.alarm.now": "It is time.",

      "desk.t.timer": "timer",
      "desk.t.sw": "stopwatch",
      "desk.t.alarm": "alarm",
      "desk.t.paused": "paused",
      "desk.t.up": "time is up",
      "desk.t.time": "it is time"
    },
    ru: {
      "welcome.p1": "{V:Привет. Этот дом теперь твой — располагайся.|Здравствуйте. Этот дом теперь ваш — располагайтесь.}",
      "welcome.p3": "Всё, что {V:ты здесь напишешь|вы здесь напишете}, останется только у {V:тебя|вас}.",
      "welcome.p8": "Первая заметка — наша. Все остальные будут {V:твоими|вашими}.",
      "welcome.p23": "Свет включён, дверь заперта, место свободно.",
      "welcome.p9": "Не {V:спеши|спешите}. Дом никуда не денется.",
      "welcome.hint": "{V:коснись|коснитесь} пустого места, чтобы оставить свою",

      "clock.aria": "Часы и календарь",
      "clock.close": "Закрыть",
      "clock.tab.cal": "календарь",
      "clock.tab.timer": "таймер",
      "clock.tab.sw": "секундомер",
      "clock.tab.alarm": "будильник",
      "clock.prev": "Прошлый месяц",
      "clock.next": "Следующий месяц",
      "clock.cal.hint": "Коснитесь даты — на столе появится заметка на этот день.",
      "clock.sec": "{n} с",
      "clock.min": "{n} мин",
      "clock.timer.sub": "Время пойдёт светом на столе — панель можно не закрывать.",
      "clock.timer.name": "как назвать? например, чай",
      "clock.timer.nameAria": "Название таймера",
      "clock.timer.title": "Таймер",
      "clock.timer.rang": "Время вышло{name}.",
      "clock.go": "запустить",
      "clock.again": "ещё раз",
      "clock.ok": "хорошо",
      "clock.pause": "пауза",
      "clock.on": "дальше",
      "clock.reset": "сброс",
      "clock.done": "Время вышло.",
      "clock.paused": "На паузе.",
      "clock.running": "Идёт на столе{name}.",
      "clock.sw.sub": "Время пойдёт светом на столе.",
      "clock.sw.start": "старт",
      "clock.lap": "круг",
      "clock.lapN": "круг {n}",
      "clock.alarm.in1": "через 1 мин",
      "clock.alarm.minus5": "− 5 мин",
      "clock.alarm.plus5": "+ 5 мин",
      "clock.alarm.set": "поставить",
      "clock.alarm.off": "снять",
      "clock.alarm.today": "сегодня",
      "clock.alarm.tomorrow": "завтра, {day}",
      "clock.alarm.left": "{when} · через {left}",
      "clock.alarm.hm": "{h} ч {m} мин",
      "clock.alarm.m": "{m} мин",
      "clock.alarm.standing": "Будильник стоит — свет на столе считает, сколько осталось.",
      "clock.alarm.now": "Пора.",

      "desk.t.timer": "таймер",
      "desk.t.sw": "секундомер",
      "desk.t.alarm": "будильник",
      "desk.t.paused": "пауза",
      "desk.t.up": "время вышло",
      "desk.t.time": "пора"
    },
    ee: {
      "welcome.p1": "Tere. See kodu on nüüd teie oma — tundke end mugavalt.",
      "welcome.p3": "Kõik, mis te siia kirjutate, jääb ainult teile.",
      "welcome.p8": "Esimene märge on meie oma. Kõik ülejäänud on teie omad.",
      "welcome.p23": "Tuli põleb, uks on lukus, ruumi on küllalt.",
      "welcome.p9": "Ärge kiirustage. Kodu ei lähe kuhugi.",
      "welcome.hint": "puudutage tühja kohta, et jätta oma märge",

      "clock.aria": "Kell ja kalender",
      "clock.close": "Sulge",
      "clock.tab.cal": "kalender",
      "clock.tab.timer": "taimer",
      "clock.tab.sw": "stopper",
      "clock.tab.alarm": "äratus",
      "clock.prev": "Eelmine kuu",
      "clock.next": "Järgmine kuu",
      "clock.cal.hint": "Puudutage kuupäeva — lauale ilmub selle päeva märge.",
      "clock.sec": "{n} s",
      "clock.min": "{n} min",
      "clock.timer.sub": "Aeg jookseb valgusena laual — paneeli ei pea sulgema.",
      "clock.timer.name": "kuidas nimetada? näiteks tee",
      "clock.timer.nameAria": "Taimeri nimi",
      "clock.timer.title": "Taimer",
      "clock.timer.rang": "Aeg on täis{name}.",
      "clock.go": "käivita",
      "clock.again": "veel kord",
      "clock.ok": "hästi",
      "clock.pause": "paus",
      "clock.on": "jätka",
      "clock.reset": "lähtesta",
      "clock.done": "Aeg on täis.",
      "clock.paused": "Pausil.",
      "clock.running": "Jookseb laual{name}.",
      "clock.sw.sub": "Aeg jookseb valgusena laual.",
      "clock.sw.start": "start",
      "clock.lap": "ring",
      "clock.lapN": "ring {n}",
      "clock.alarm.in1": "1 min pärast",
      "clock.alarm.minus5": "− 5 min",
      "clock.alarm.plus5": "+ 5 min",
      "clock.alarm.set": "määra",
      "clock.alarm.off": "eemalda",
      "clock.alarm.today": "täna",
      "clock.alarm.tomorrow": "homme, {day}",
      "clock.alarm.left": "{when} · {left} pärast",
      "clock.alarm.hm": "{h} t {m} min",
      "clock.alarm.m": "{m} min",
      "clock.alarm.standing": "Äratus on määratud — valgus laual loeb, kui palju on jäänud.",
      "clock.alarm.now": "On aeg.",

      "desk.t.timer": "taimer",
      "desk.t.sw": "stopper",
      "desk.t.alarm": "äratus",
      "desk.t.paused": "paus",
      "desk.t.up": "aeg on täis",
      "desk.t.time": "on aeg"
    }
  };
  /* Свои модули читают слова через sbDeskT: если страницу собрали без
     strings.js (стенд закона, старая опись), слова стола не теряются. */
  window.sbDeskStrings = D;
  if (typeof window.sbAddStrings === "function") window.sbAddStrings(D);
  /* Обращение (D-808): слова стола с формами {V:ты|вы} говорят так, как
     человек выбрал в знакомстве (sbAddr). ОТКАТ: знакомства на странице нет
     (стенд закона, старая опись) — берётся последняя форма, «вы»: так стол
     говорил до D-808, и это форма по умолчанию у sbAddr. */
  function addr(s) {
    if (s.indexOf("{V:") < 0 && s.indexOf("{R:") < 0) return s;
    if (window.sbAddr && typeof window.sbAddr.fill === "function") return window.sbAddr.fill(s);
    return s.replace(/\{[VR]:(?:[^{}|]*\|)*([^{}|]*)\}/g, "$1");
  }
  window.sbDeskT = function (key, vars) {
    var s = typeof window.sbT === "function" ? window.sbT(key, vars) : key;
    if (s !== key) return addr(String(s));
    var l = typeof window.sbLang === "function" ? window.sbLang() : "en";
    s = addr(String((D[l] && D[l][key]) || D.en[key] || key));
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m; });
  };
})();
