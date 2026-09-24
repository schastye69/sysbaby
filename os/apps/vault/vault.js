/*
 * vault.js — ЗАМОК. Окно, которое ОТРАЖАЕТ работу хранилища (D-214).
 *
 * ПОВОД, дословно от основателя: «самое главное, пользователи должны это
 * понимать и осозновать и быть в шоке с дизайна и анимаций интеллектуальных,
 * красивых, дорогих и гипнотизирующие».
 *
 * ЧЕГО ЗДЕСЬ НЕТ, И ЭТО ГЛАВНОЕ. Здесь нет ни одной анимации, придуманной
 * ради красоты. Каждая ячейка решётки — настоящий конверт, лежащий на диске
 * прямо сейчас; её рисунок выведен из его байтов. Когда ячейка переворачи-
 * вается, это значит, что ИМЕННО ЭТОТ конверт только что перезаписан свежими
 * случайными числами. Число конвертов, число пустышек, цена одной попытки —
 * всё спрошено у системы в этот миг, ничего не написано заранее.
 *
 * ПОЧЕМУ ТАК СТРОГО. Просьбу про «шок от анимаций» можно выполнить за вечер и
 * соврать: нарисовать бегущие нули и единицы поверх ничего. Именно так
 * устроены чужие «защищённые» приложения, и именно поэтому им нельзя верить.
 * Разница между прибором и мультфильмом не видна глазу — её видит только
 * закон. Поэтому закон здесь написан ДО окна и требует поимённого совпадения
 * повернувшихся ячеек с изменившимися байтами.
 *
 * Охраняется tools/vault-window-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v3.2M12 17.2v3.2M20.4 12h-3.2M6.8 12H3.6"/><circle cx="12" cy="12" r="3.1"/></svg>';

  /* ЗДЕСЬ СТОЯЛО var PREFIX = приставка конвертов замка — объявленное и НИ
     РАЗУ НЕ ИСПОЛЬЗОВАННОЕ (D-242). Имя claimило место на диске, которого
     эта комната не трогает: конверты кладут core/seals.js и core/store.js.
     Опись прав нашла его первым же прогоном. Комната Замка права на диск не
     имеет и не должна: она показывает состояние, а запирает ядро. */
  var FLIP_STEP = 38;          /* сдвиг между поворотами соседних ячеек, мс */

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
      title: "Lock", label: "Lock",
      lead: "This is not a picture of encryption. Every tile below is a real envelope lying on this disk right now, and its face is drawn from its bytes.",
      nolock: "There is nothing to reflect yet: your system is not locked. Set a password in Settings — then this window starts showing your own disk.",
      onDisk: "On the disk", envelopes: "envelopes", decoys: "of them decoys", real: "real records",
      stepNote: "The count is always a multiple of {step}. Adding a record does not change it — a decoy makes room. From outside, nobody can tell how much you keep.",
      turning: "Turning", turnNote: "{at} envelopes are re-sealed with fresh randomness every {sec} seconds, while the system is open. The contents stay; the bytes change completely.",
      next: "next in", waiting: "waiting for the first turn", now: "Turn now",
      turned: "turned just now: {n}",
      cost: "One guess costs", measure: "Measure it", measuring: "grinding…",
      costNote: "Measured on this device, this minute — not promised. That is what one attempt at your word costs an attacker, and they need millions.",
      doors: "Two doors", doorsNote: "Both are always computed, every single time. One opens your world. Which one — the disk does not say.",
      honest: "What this does not give you. The turning hides WHEN you wrote, not WHAT. Anyone who takes this disk and learns your word reads everything: the key still comes from what you type. The decoys hide how much you keep, not what it is. And there is no recovery — a forgotten word is a closed door forever. This window shows you the real thing, including its edges.",
      keyTitle: "Second key", keyOn: "on", keyOff: "off",
      keyNote: "A file you keep away from this machine. Its bytes go INTO the key derivation — not into a check. Whoever takes this disk and learns your word still gets nothing without it.",
      keyWarn: "Losing the file is the same as forgetting the word: only your recovery code opens the system then. Save the file somewhere that is not this computer before you continue.",
      keyMake: "Create the second key", keyDrop: "Remove the second key",
      keyPass: "Your password", keyGo: "Continue", keyCancel: "Cancel",
      keyFile: "The key file", keyDone: "Done. The file has been saved — it is now required to open this system.",
      keyOff2: "Removed. The password alone opens this system again.", keyBad: "That did not work — nothing was changed.",
      tellTitle: "Tell them apart",
      tellLead: "One of these two fields is your life, sealed. The other is noise made up a second ago by this machine. Nothing marks which is which — not the drawing, not the lengths, not the letters. Look as long as you like.",
      tellShow: "Show me which", tellAgain: "Shuffle again", tellHide: "Hide again",
      tellReal: "your envelopes", tellNoise: "noise, made a second ago",
      tellAfter: "That is what encryption actually means. Not a lock on a door — a life that cannot be told apart from randomness. Everything else on this page is detail.",
      alive: "reading the disk"
    },
    ru: {
      title: "Замок", label: "Замок",
      lead: "Это не картинка про шифрование. Каждая плитка ниже — настоящий конверт, лежащий на этом диске прямо сейчас, и её лицо выведено из его байтов.",
      nolock: "Пока отражать нечего: система не заперта. Поставьте пароль в настройках — и это окно начнёт показывать ваш собственный диск.",
      onDisk: "На диске", envelopes: "конвертов", decoys: "из них пустышек", real: "настоящих записей",
      stepNote: "Число всегда кратно {step}. Новая запись его не меняет — место уступает пустышка. Снаружи нельзя сказать, сколько вы храните.",
      turning: "Оборот", turnNote: "Пока система открыта, каждые {sec} секунд {at} конверта запечатываются заново со свежими случайными числами. Содержимое то же, байты другие целиком.",
      next: "следующий через", waiting: "ждём первого оборота", now: "Повернуть сейчас",
      turned: "повернулось только что: {n}",
      cost: "Одна попытка стоит", measure: "Замерить", measuring: "считает…",
      costNote: "Замерено на этом устройстве в эту минуту, а не обещано. Столько стоит тому, кто подбирает, ОДНА попытка. А их нужны миллионы.",
      doors: "Две двери", doorsNote: "Обе считаются всегда, при каждом открытии. Одна открывает ваш мир. Какая именно — диск не говорит.",
      honest: "Чего это не даёт. Оборот прячет, КОГДА вы писали, а не ЧТО. Тот, кто забрал диск и узнал ваше слово, прочтёт всё: ключ по-прежнему выводится из того, что вы печатаете. Пустышки прячут, сколько вы храните, а не что именно. И восстановления нет — забытое слово это закрытая дверь навсегда. Это окно показывает настоящее, вместе с его границами.",
      keyTitle: "Второй ключ", keyOn: "есть", keyOff: "нет",
      keyNote: "Файл, который вы держите отдельно от этой машины. Его байты входят В САМ ВЫВОД ключа, а не в проверку. Тот, кто унёс диск и узнал ваше слово, без файла не получает ничего.",
      keyWarn: "Потерять файл — то же самое, что забыть слово: открыть систему тогда сможет только ваш код восстановления. Сохраните файл туда, что не является этим компьютером, прежде чем продолжить.",
      keyMake: "Завести второй ключ", keyDrop: "Снять второй ключ",
      keyPass: "Ваш пароль", keyGo: "Продолжить", keyCancel: "Отмена",
      keyFile: "Файл ключа", keyDone: "Готово. Файл сохранён — теперь без него эта система не открывается.",
      keyOff2: "Снят. Система снова открывается одним словом.", keyBad: "Не вышло — ничего не изменилось.",
      tellTitle: "Отличите",
      tellLead: "Одно из этих двух полей — ваша жизнь, запечатанная. Второе — шум, придуманный этой машиной секунду назад. Ничто не говорит, где что: ни рисунок, ни длины, ни буквы. Смотрите сколько угодно.",
      tellShow: "Показать, где что", tellAgain: "Перемешать снова", tellHide: "Спрятать обратно",
      tellReal: "ваши конверты", tellNoise: "шум, сделанный секунду назад",
      tellAfter: "Вот что на самом деле значит шифрование. Не замок на двери — жизнь, которую нельзя отличить от случайности. Всё остальное на этой странице — подробности.",
      alive: "читает диск"
    },
    ee: {
      title: "Lukk", label: "Lukk",
      lead: "See ei ole pilt krüpteerimisest. Iga plaat allpool on päris ümbrik, mis on praegu sellel kettal, ja ta nägu on tuletatud tema baitidest.",
      nolock: "Praegu pole midagi peegeldada: süsteem ei ole lukus. Pane seadetes parool — siis hakkab see aken näitama sinu enda ketast.",
      onDisk: "Kettal", envelopes: "ümbrikku", decoys: "neist peibutist", real: "päris kirjet",
      stepNote: "Arv on alati {step} kordne. Uus kirje seda ei muuda — koha annab peibutis. Väljastpoolt ei saa öelda, kui palju sa hoiad.",
      turning: "Pööre", turnNote: "Kuni süsteem on avatud, pitseeritakse iga {sec} sekundi järel {at} ümbrikku uue juhuslikkusega. Sisu jääb, baidid muutuvad täielikult.",
      next: "järgmine", waiting: "ootame esimest pööret", now: "Pööra kohe",
      turned: "pöördus just: {n}",
      cost: "Üks katse maksab", measure: "Mõõda", measuring: "arvutab…",
      costNote: "Mõõdetud selles seadmes ja sel minutil, mitte lubatud. Nii palju maksab ründajale ÜKS katse. Neid on vaja miljoneid.",
      doors: "Kaks ust", doorsNote: "Mõlemad arvutatakse alati, iga kord. Üks avab sinu maailma. Kumb — ketas ei ütle.",
      honest: "Mida see ei anna. Pööre peidab, MILLAL sa kirjutasid, mitte MIDA. See, kes võtab ketta ja saab teada su sõna, loeb kõik: võti tuleb ikka sellest, mida sa trükid. Peibutised peidavad koguse, mitte sisu. Ja taastamist ei ole — unustatud sõna on igaveseks suletud uks. See aken näitab päris asja koos tema piiridega.",
      keyTitle: "Teine võti", keyOn: "on", keyOff: "ei ole",
      keyNote: "Fail, mida hoiad sellest masinast eemal. Tema baidid lähevad võtme TULETAMISSE, mitte kontrolli. Kes võtab ketta ja saab teada su sõna, ei saa ilma failita midagi.",
      keyWarn: "Faili kaotamine on sama mis sõna unustamine: siis avab süsteemi ainult sinu taastekood. Salvesta fail enne jätkamist kuhugi, mis ei ole see arvuti.",
      keyMake: "Loo teine võti", keyDrop: "Eemalda teine võti",
      keyPass: "Sinu parool", keyGo: "Jätka", keyCancel: "Katkesta",
      keyFile: "Võtmefail", keyDone: "Valmis. Fail on salvestatud — ilma selleta süsteem enam ei avane.",
      keyOff2: "Eemaldatud. Süsteem avaneb jälle ainult sõnaga.", keyBad: "Ei õnnestunud — midagi ei muudetud.",
      tellTitle: "Eralda need",
      tellLead: "Üks neist kahest väljast on sinu elu, pitseeritud. Teine on müra, mille see masin tegi sekund tagasi. Miski ei ütle, kumb on kumb: ei muster, ei pikkused, ei tähed. Vaata nii kaua kui tahad.",
      tellShow: "Näita, kumb on kumb", tellAgain: "Sega uuesti", tellHide: "Peida tagasi",
      tellReal: "sinu ümbrikud", tellNoise: "müra, tehtud sekund tagasi",
      tellAfter: "Just see ongi krüpteerimine. Mitte lukk uksel — elu, mida ei saa juhuslikkusest eristada. Kõik muu sellel lehel on üksikasjad.",
      alive: "loeb ketast"
    }
  };
  function T() { return UI[lang()] || UI.en; }
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] == null ? m : o[k]; }); }

  /* ── ЛИЦО КОНВЕРТА И ЧТЕНИЕ ДИСКА ЖИВУТ В ОДНОМ МЕСТЕ (D-216) ──────────
     Раньше они лежали здесь. Когда ту же решётку понадобилось поставить за
     дверью, переписывать её второй раз было нельзя: две «настоящие» решётки
     расходятся, и обе продолжают называться настоящими. Теперь источник
     один — os/core/seals.js, — а здесь остаются только имена. */
  function seals() { return window.sbSeals; }
  function faceOf(bytes) { return seals().face(bytes); }
  function rawGet(k) { return seals().bytes(k); }
  function diskNames() { return seals().names(); }
  function cellHtml(name, seq) { return seals().cellHtml(name, seq, "vw-cell"); }

  function render(win) {
    var t = T();
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var locked = false;
    try { locked = !!(window.sbVault && window.sbVault.isLocked() && window.sbVault.isOpen()); } catch (e) { locked = false; }

    if (!locked) {
      var keep0 = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
      host.innerHTML = '<div class="vw-wrap"><div class="vw-head"><h2 class="vw-title">' + esc(t.title) + '</h2>' +
        '<p class="vw-lead">' + esc(t.lead) + '</p></div>' +
        '<p class="vw-nolock">' + esc(t.nolock) + '</p></div>';
      if (keep0) keep0();
      return;
    }

    var cen = window.sbVaultCensus ? window.sbVaultCensus() : { total: 0, real: 0, decoy: 0, step: 32, at: 4, every: 90000 };
    var names = diskNames();
    var cipher = {};
    try { cipher = window.sbVault.cipher() || {}; } catch (e) { cipher = {}; }
    var doors = (cipher.doors && cipher.doors.length) || 2;
    var second = { on: false };
    try { second = window.sbVault.secondKey(); } catch (e) { second = { on: false }; }

    /* Полная перерисовка корпуса обязана вернуть прокрутку человеку: она дело
       системы, а прокрутка — дело руки (no-teleport-check). */
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="vw-wrap">' +
        '<div class="vw-head">' +
          '<h2 class="vw-title">' + esc(t.title) + '</h2>' +
          '<p class="vw-lead">' + esc(t.lead) + '</p>' +
        '</div>' +
        '<div class="vw-grid" data-seq="0">' + names.map(function (n) { return cellHtml(n, 0); }).join("") + '</div>' +
        '<div class="vw-strip">' +
          '<span class="vw-live" aria-hidden="true"></span>' +
          '<span class="vw-strip-t">' + esc(t.alive) + '</span>' +
          '<span class="vw-turned" data-num="turned"></span>' +
        '</div>' +
        '<div class="vw-cards">' +
          '<section class="vw-card">' +
            '<h3>' + esc(t.onDisk) + '</h3>' +
            '<p class="vw-big"><b data-num="total">' + cen.total + '</b> <span>' + esc(t.envelopes) + '</span></p>' +
            '<p class="vw-sub"><b data-num="decoy">' + cen.decoy + '</b> ' + esc(t.decoys) + ' · <b data-num="real">' + cen.real + '</b> ' + esc(t.real) + '</p>' +
            '<p class="vw-note">' + esc(fill(t.stepNote, { step: cen.step })) + '</p>' +
          '</section>' +
          '<section class="vw-card">' +
            '<h3>' + esc(t.turning) + '</h3>' +
            '<p class="vw-big"><b data-num="next">—</b> <span class="vw-next-l">' + esc(t.waiting) + '</span></p>' +
            '<p class="vw-note">' + esc(fill(t.turnNote, { at: cen.at, sec: Math.round(cen.every / 1000) })) + '</p>' +
            '<button type="button" class="vw-act" data-act="roll">' + esc(t.now) + '</button>' +
          '</section>' +
          '<section class="vw-card">' +
            '<h3>' + esc(t.cost) + '</h3>' +
            '<p class="vw-big"><b data-num="cost" data-ms="0">—</b> <span>мс</span></p>' +
            '<p class="vw-note">' + esc(t.costNote) + '</p>' +
            '<button type="button" class="vw-act" data-act="measure">' + esc(t.measure) + '</button>' +
          '</section>' +
          '<section class="vw-card vw-keycard">' +
            '<h3>' + esc(t.keyTitle) + '</h3>' +
            '<p class="vw-big"><b data-num="key">' + esc(second.on ? t.keyOn : t.keyOff) + '</b></p>' +
            '<p class="vw-note">' + esc(t.keyNote) + '</p>' +
            '<p class="vw-warn">' + esc(t.keyWarn) + '</p>' +
            '<form class="vw-keyform" hidden>' +
              '<input type="password" class="vw-keypass" placeholder="' + esc(t.keyPass) + '" autocomplete="current-password">' +
              (second.on ? '<label class="vw-keyfile"><span>' + esc(t.keyFile) + '</span><input type="file" class="vw-keyinput"></label>' : '') +
              '<div class="vw-keyacts">' +
                '<button type="button" class="vw-act" data-act="keygo">' + esc(t.keyGo) + '</button>' +
                '<button type="button" class="vw-act vw-ghost" data-act="keycancel">' + esc(t.keyCancel) + '</button>' +
              '</div>' +
            '</form>' +
            '<button type="button" class="vw-act" data-act="keyask">' + esc(second.on ? t.keyDrop : t.keyMake) + '</button>' +
            '<p class="vw-keysay" role="status"></p>' +
          '</section>' +
          '<section class="vw-card">' +
            '<h3>' + esc(t.doors) + '</h3>' +
            '<p class="vw-big"><b>' + doors + '</b></p>' +
            '<p class="vw-sub vw-mono">' + esc([].concat(cipher.kdf || [], cipher.ciphers || [], cipher.mac || []).join(" · ")) + '</p>' +
            '<p class="vw-note">' + esc(t.doorsNote) + '</p>' +
          '</section>' +
        '</div>' +
        /* ── ОТЛИЧИТЕ ─────────────────────────────────────────────────────
           Самое сильное, что шифр может показать, — это НИЧЕГО. Два поля,
           одно из них настоящее; человек смотрит и не может сказать, какое.
           Здесь нет ни одной подсказки: рисует их один и тот же код, длины
           взяты у настоящих конвертов, сторона выбирается случайно и в
           разметке не лежит. */
        '<section class="vw-tell">' +
          '<h3>' + esc(t.tellTitle) + '</h3>' +
          '<p class="vw-note">' + esc(t.tellLead) + '</p>' +
          '<div class="vw-tell-pair">' +
            '<figure><canvas class="vw-tell-c" data-side="a"></canvas><figcaption data-cap="a"></figcaption></figure>' +
            '<figure><canvas class="vw-tell-c" data-side="b"></canvas><figcaption data-cap="b"></figcaption></figure>' +
          '</div>' +
          '<div class="vw-keyacts">' +
            '<button type="button" class="vw-act" data-act="tellshow">' + esc(t.tellShow) + '</button>' +
            '<button type="button" class="vw-act vw-ghost" data-act="tellagain">' + esc(t.tellAgain) + '</button>' +
          '</div>' +
          '<p class="vw-tell-after" hidden>' + esc(t.tellAfter) + '</p>' +
        '</section>' +
        '<p class="vw-honest">' + esc(t.honest) + '</p>' +
      '</div>';

    if (keep) keep();

    var grid = host.querySelector(".vw-grid");
    var seq = 0;
    var lastRollAt = 0;
    var turnedAt = {};      /* имя конверта → номер оборота, в котором он повернулся */

    /* ── РЕШЁТКА ОБЯЗАНА ОСТАВАТЬСЯ ПЕРЕПИСЬЮ, А НЕ СНИМКОМ ────────────────
       Первая редакция строила решётку один раз при открытии окна и обновляла
       её, только если менялось ЧИСЛО конвертов. Закон поймал это сразу:
       система пишет своё (положение окна, вид стола) всё время, каждая запись
       занимает место пустышки — и НАБОР имён меняется при том же числе.
       Дальше оборот поворачивал конверт, которого на экране ещё не было, и
       «повернулось четыре» против трёх помеченных. Сравнивать надо имена. */
    function syncGrid() {
      var now = diskNames();
      var have = Array.prototype.map.call(grid.querySelectorAll(".vw-cell"), function (c) {
        return c.getAttribute("data-name");
      });
      if (now.join(",") === have.join(",")) return false;
      grid.innerHTML = now.map(function (n) { return cellHtml(n, turnedAt[n] || 0); }).join("");
      return true;
    }

    /* ── ПОВЕРНУЛИСЬ ТЕ ЖЕ САМЫЕ ──────────────────────────────────────────
       Имена приходят от самого оборота, а не угадываются окном. Лицо плитки
       перерисовывается из НОВЫХ байтов — поэтому поворот показывает настоящую
       перемену, а не просто вращение. */
    function turn(list) {
      seq++;
      syncGrid();                     /* сначала перепись, потом пометки */
      grid.setAttribute("data-seq", String(seq));
      var shown = 0;
      (list || []).forEach(function (n) {
        turnedAt[n] = seq;
        var cell = grid.querySelector('.vw-cell[data-name="' + n + '"]');
        if (!cell) return;
        var f = faceOf(String(rawGet(n) || ""));
        cell.setAttribute("data-turned", String(seq));
        cell.style.setProperty("--h", f.hue);
        cell.style.setProperty("--g", f.glow.toFixed(3));
        cell.style.setProperty("--t", f.tilt + "deg");
        var p = cell.querySelector("path");
        if (p) p.setAttribute("d", f.d);
        cell.style.animation = "none";
        /* принудительная перерисовка, иначе повтор анимации не запустится */
        void cell.offsetWidth;
        cell.style.animation = "vwFlip .74s cubic-bezier(.22,.8,.2,1) " + (shown * FLIP_STEP) + "ms both";
        shown++;
      });
      var badge = host.querySelector('[data-num="turned"]');
      if (badge) badge.textContent = fill(t.turned, { n: (list || []).length });
      lastRollAt = Date.now();
      recount();
    }

    function recount() {
      if (!window.sbVaultCensus) return;
      var c = window.sbVaultCensus();
      var set = function (k, v) { var el = host.querySelector('[data-num="' + k + '"]'); if (el) el.textContent = String(v); };
      set("total", c.total); set("decoy", c.decoy); set("real", c.real);
      syncGrid();
    }

    /* ── СТОРОНА НЕ ЛЕЖИТ В РАЗМЕТКЕ ──────────────────────────────────────
       Ответ живёт в переменной этого сеанса. Положить его в атрибут значило
       бы устроить игру, которую выигрывает тот, кто откроет исходный код. */
    var realSide = null;
    function tellSizes(list) {
      return list.slice(0, 48).map(function (n) { return seals().cipher(rawGet(n)).length; });
    }
    function shuffleTell() {
      var host2 = host.querySelector(".vw-tell");
      if (!host2 || !seals()) return;
      var list = diskNames();
      if (!list.length) return;
      var pick = list.slice(0, 48);
      /* На обеих сторонах — чистый шифротекст и чистый шум той же длины.
         Рисовать конверт целиком значило бы дать подсказку: у настоящего
         есть точки и версия, у шума их нет. */
      var bodies = pick.map(function (n) { return seals().cipher(rawGet(n)); });
      var noise = seals().noise(tellSizes(list));
      var r = new Uint8Array(1); window.crypto.getRandomValues(r);
      realSide = (r[0] & 1) ? "a" : "b";
      var ca = host2.querySelector('[data-side="a"]');
      var cb = host2.querySelector('[data-side="b"]');
      seals().paintStrings(ca, realSide === "a" ? bodies : noise, { phase: 0 });
      seals().paintStrings(cb, realSide === "b" ? bodies : noise, { phase: 0 });
      host2.querySelectorAll("[data-cap]").forEach(function (f) { f.textContent = ""; });
      var after = host2.querySelector(".vw-tell-after");
      if (after) after.hidden = true;
    }
    function revealTell() {
      var host2 = host.querySelector(".vw-tell");
      if (!host2 || !realSide) return;
      host2.querySelectorAll("[data-cap]").forEach(function (f) {
        f.textContent = (f.getAttribute("data-cap") === realSide) ? t.tellReal : t.tellNoise;
      });
      var after = host2.querySelector(".vw-tell-after");
      if (after) after.hidden = false;
    }
    setTimeout(shuffleTell, 60);

    var onRoll = function (d) { if (d && d.names) turn(d.names); };
    if (window.sbBus && window.sbBus.on) window.sbBus.on("vault:roll", onRoll);

    var every = cen.every || 90000;
    var tick = setInterval(function () {
      if (!host.isConnected) { clearInterval(tick); return; }
      recount();
      var el = host.querySelector('[data-num="next"]');
      var lab = host.querySelector(".vw-next-l");
      if (!el) return;
      if (!lastRollAt) { el.textContent = "—"; if (lab) lab.textContent = t.waiting; return; }
      var left = Math.max(0, every - (Date.now() - lastRollAt));
      el.textContent = Math.ceil(left / 1000) + " c";
      if (lab) lab.textContent = t.next;
    }, 1000);

    host.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");

      if (act === "roll") {
        if (b.disabled) return;
        b.disabled = true;
        window.sbVaultRoll().then(function (r) {
          b.disabled = false;
          /* Шина уже объявила поворот; если её нет — поворачиваем по ответу. */
          if (!(window.sbBus && window.sbBus.on) && r && r.names) turn(r.names);
        }, function () { b.disabled = false; });
        return;
      }

      if (act === "tellshow" || act === "tellagain") {
        if (act === "tellagain") { shuffleTell(); return; }
        revealTell();
        return;
      }

      if (act === "keyask" || act === "keycancel") {
        var form = host.querySelector(".vw-keyform");
        if (form) form.hidden = (act === "keycancel") ? true : !form.hidden;
        if (act === "keyask" && form && !form.hidden) { var f = form.querySelector(".vw-keypass"); if (f) f.focus(); }
        return;
      }

      if (act === "keygo") {
        var wrap2 = host.querySelector(".vw-keycard");
        var say = wrap2.querySelector(".vw-keysay");
        var pass = (wrap2.querySelector(".vw-keypass") || {}).value || "";
        b.disabled = true;
        say.textContent = "…";
        if (second.on) {
          /* Снять: нужен и пароль, и сам файл — иначе снимать было бы нечем. */
          var inp = wrap2.querySelector(".vw-keyinput");
          var file = inp && inp.files && inp.files[0];
          (file ? file.arrayBuffer() : Promise.resolve(null)).then(function (buf) {
            return window.sbVault.clearSecondKey(pass, buf ? new Uint8Array(buf) : null);
          }).then(function (okp) {
            b.disabled = false;
            say.textContent = okp ? t.keyOff2 : t.keyBad;
            if (okp) render(win);
          }, function () { b.disabled = false; say.textContent = t.keyBad; });
          return;
        }
        /* Завести: ключ рождается здесь, сразу отдаётся человеку файлом и
           только после этого становится обязательным. */
        var bytes = window.sbVault.newSecondKey();
        window.sbVault.setSecondKey(pass, bytes).then(function (okp) {
          b.disabled = false;
          if (!okp) { say.textContent = t.keyBad; return; }
          try {
            var url = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
            var a = doc.createElement("a");
            a.href = url; a.download = "sysbaby-second-key.bin";
            doc.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          } catch (e) { /* ignore */ }
          say.textContent = t.keyDone;
          render(win);
        }, function () { b.disabled = false; say.textContent = t.keyBad; });
        return;
      }

      if (act === "measure") {
        if (b.disabled) return;
        var out = host.querySelector('[data-num="cost"]');
        b.disabled = true;
        if (out) out.textContent = t.measuring;
        host.querySelector(".vw-wrap").classList.add("vw-grind");
        /* ── ЦЕНА ПОПЫТКИ ЗАМЕРЯЕТСЯ НАСТОЯЩЕЙ ПОПЫТКОЙ ──────────────────
           Не оценкой и не таблицей: заведомо неверным словом открывается
           замок, и засекается, сколько это заняло ЗДЕСЬ. Слово случайное и
           длинное — совпасть с чужой дверью оно не может. */
        var word = "";
        var r = new Uint8Array(30);
        window.crypto.getRandomValues(r);
        for (var i = 0; i < r.length; i++) word += String.fromCharCode(33 + (r[i] % 90));
        var t0 = (window.performance || Date).now();
        window.sbVault.unlock(word).then(function () {
          var ms = Math.round(((window.performance || Date).now()) - t0);
          b.disabled = false;
          host.querySelector(".vw-wrap").classList.remove("vw-grind");
          if (out) { out.textContent = String(ms); out.setAttribute("data-ms", String(ms)); }
        }, function () {
          b.disabled = false;
          host.querySelector(".vw-wrap").classList.remove("vw-grind");
          if (out) out.textContent = "—";
        });
      }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("vault", {
      title: UI.en.title,
      label: UI.en.label,
      i18n: { ru: { title: UI.ru.title, label: UI.ru.label }, ee: { title: UI.ee.title, label: UI.ee.label } },
      color: "linear-gradient(160deg,#c9b6ff 0%,#6d54c8 52%,#241a4d 100%)",
      icon: ICON,
      size: { w: 760, h: 700 },
      retranslate: true,
      render: render
    });
  }
})();
