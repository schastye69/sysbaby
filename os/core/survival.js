/*
 * survival.js — ЖИВУЧЕСТЬ: СИСТЕМА ЧЕСТНО ЗНАЕТ И ГОВОРИТ, ГДЕ ЖИВЁТ (D-299).
 *
 * ПОВОД. «Data Immortality Protocol» основателя, 26.09.2026, пункт 26: «система
 * никогда не должна говорить “ваши данные в безопасности”, если не может это
 * обосновать». Исследование Совета («Зерно и почва») нашло, что sys.baby сегодня
 * не говорит обратного, хотя обязана: на телефоне она живёт в одном экземпляре,
 * браузер вправе стереть её хранилище, а Safari стирает всё, что записал сайт,
 * после семи дней работы Safari без захода на сайт.
 *
 * ЭТО УРОВЕНЬ 0 «ПРАВДА» — без сервера и без решения основателя:
 *   • браузер молча просят сделать хранилище постоянным (Chrome, Edge, Safari
 *     решают сами, без окна). Firefox на эту просьбу показывает окно — поэтому
 *     в Firefox она звучит только по кнопке человека;
 *   • в Настройках → Приватность одна карточка «Живучесть»: есть ли копия вне
 *     устройства и когда она писалась, обещал ли браузер не стирать, правда о
 *     семи днях Safari, есть ли у замка код восстановления — и одна итоговая
 *     строка: что пропадёт, если устройство потеряется сейчас.
 *
 * ЧЕГО ОНА НЕ ГОВОРИТ НИКОГДА: «в безопасности», «защищено», «safe». Этого
 * система пока не может обосновать — значит, не может и сказать.
 *
 * Ничего не хранит. Охраняется tools/survival-truth-check.mjs.
 */
(function () {
  "use strict";
  var persisted = null;   /* null — браузер не умеет или ещё не ответил */

  var UI = {
    en: {
      title: "Survival",
      noCopy: "No copy outside this device.",
      folder: "A copy goes to the folder «{name}» — last written {when}.",
      folderNever: "The folder «{name}» is chosen, but nothing has been written to it yet.",
      folderOff: "The folder «{name}» is chosen, but copying is off.",
      folderNote: "It survives this device only if the folder is in a cloud or on another disk.",
      persistYes: "The browser has promised not to erase this storage on its own.",
      persistNo: "The browser may erase this storage when space runs low.",
      persistAsk: "Ask the browser not to erase it",
      safari: "Safari erases everything sys.baby wrote after seven days of using Safari without opening sys.baby. The Home Screen icon lifts this rule.",
      codeYes: "The lock has a recovery code.",
      codeNo: "The lock has no recovery code: a forgotten word would close the door for good.",
      lostAll: "If this device is lost now, everything in it is lost.",
      lostSince: "If this device is lost now, only changes after {when} are lost — if the folder is outside this device."
    },
    ru: {
      title: "Живучесть",
      noCopy: "Копии вне этого устройства нет.",
      folder: "Копия уходит в папку «{name}» — последняя запись {when}.",
      folderNever: "Папка «{name}» выбрана, но в неё ещё ничего не записано.",
      folderOff: "Папка «{name}» выбрана, но копирование выключено.",
      folderNote: "Она переживёт это устройство, только если папка лежит в облаке или на другом диске.",
      persistYes: "Браузер обещал не стирать это хранилище сам.",
      persistNo: "Браузер может стереть это хранилище, если кончится место.",
      persistAsk: "Попросить браузер не стирать",
      safari: "Safari стирает всё, что записала sys.baby, после семи дней работы Safari без захода в sys.baby. Значок на экране «Домой» отменяет это правило.",
      codeYes: "У замка есть код восстановления.",
      codeNo: "У замка нет кода восстановления: забытое слово закроет дверь навсегда.",
      lostAll: "Если это устройство потеряется сейчас, пропадёт всё, что в нём есть.",
      lostSince: "Если это устройство потеряется сейчас, пропадут только изменения после {when} — если папка лежит вне устройства."
    },
    ee: {
      title: "Ellujäämine",
      noCopy: "Väljaspool seda seadet koopiat pole.",
      folder: "Koopia läheb kausta «{name}» — viimati kirjutatud {when}.",
      folderNever: "Kaust «{name}» on valitud, kuid sinna pole veel midagi kirjutatud.",
      folderOff: "Kaust «{name}» on valitud, kuid kopeerimine on väljas.",
      folderNote: "See elab selle seadme üle ainult siis, kui kaust on pilves või teisel kettal.",
      persistYes: "Brauser on lubanud seda salvestusruumi ise mitte kustutada.",
      persistNo: "Brauser võib selle salvestusruumi kustutada, kui ruum otsa saab.",
      persistAsk: "Palu brauseril mitte kustutada",
      safari: "Safari kustutab kõik, mille sys.baby kirjutas, kui Safarit on kasutatud seitse päeva sys.baby't avamata. Avakuva ikoon tühistab selle reegli.",
      codeYes: "Lukul on taastamiskood.",
      codeNo: "Lukul pole taastamiskoodi: unustatud sõna sulgeks ukse jäädavalt.",
      lostAll: "Kui see seade praegu kaob, kaob kõik, mis selles on.",
      lostSince: "Kui see seade praegu kaob, kaovad ainult muudatused pärast {when} — kui kaust on väljaspool seadet."
    }
  };
  function lang() { try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; } }
  function t(k, vars) {
    /* ОТКАТ: языка нет в словаре — английский, как у словаря ядра (sbTIn). */
    var L = UI[lang()] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ. */
    var s = L[k] || UI.en[k] || k;
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, n) { return Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m; });
  }
  function keys() { return Object.keys(UI.en); }

  function ua() { return String(navigator.userAgent || ""); }
  function firefox() { return /Firefox\//.test(ua()); }
  /* Safari — движок Apple без чужой обёртки: на iPhone любой браузер —
     WebKit, и правило семи дней у всех одно; на Mac — только сам Safari. */
  function safari() {
    var u = ua();
    var ios = /iPhone|iPad|iPod/.test(u) || (/Macintosh/.test(u) && (navigator.maxTouchPoints || 0) > 1);
    var macSafari = /Macintosh/.test(u) && /Safari\//.test(u) && !/Chrome\/|Chromium\/|Edg\/|Firefox\//.test(u);
    return ios || macSafari;
  }
  function standalone() {
    try {
      if (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: minimal-ui)").matches)) return true;
    } catch (e) { /* ignore */ }
    return window.navigator.standalone === true;
  }

  function when(ts) {
    try { return new Date(ts).toLocaleString(lang() === "ee" ? "et" : lang(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return new Date(ts).toISOString().slice(0, 16).replace("T", " "); }
  }

  function state() {
    var B = window.sbBackup, st = {};
    try { st = B && B.state ? (B.state() || {}) : {}; } catch (e) { st = {}; }
    var folder = null;
    if (B && B.hasFolder && B.hasFolder()) {
      folder = { name: B.folderName ? B.folderName() : (st.dirName || ""), on: !!(B.isOn && B.isOn()), lastOk: Number(st.lastOk) || 0 };
    }
    var lock = false, code = null;
    try {
      lock = !!(window.sbVault && window.sbVault.isLocked && window.sbVault.isLocked());
      var r = lock && window.sbVault.recoveryState ? window.sbVault.recoveryState() : null;
      code = r ? !!r.at : null;   /* null — замка нет или дверь не открыта: сказать нечего */
    } catch (e) { lock = false; code = null; }
    var outside = !!(folder && folder.on && folder.lastOk);
    return {
      folder: folder,
      persisted: persisted,
      safari7: safari() && !standalone(),
      lock: lock,
      code: code,
      lost: outside ? { since: folder.lastOk } : "all"
    };
  }

  /* Строки карточки: [цвет, текст]. Цвет — правда, а не украшение. */
  function lines() {
    var s = state(), out = [];
    if (!s.folder) out.push(["no", t("noCopy")]);
    else if (!s.folder.on) out.push(["warn", t("folderOff", { name: s.folder.name })]);
    else if (!s.folder.lastOk) out.push(["warn", t("folderNever", { name: s.folder.name })]);
    else { out.push(["ok", t("folder", { name: s.folder.name, when: when(s.folder.lastOk) })]); out.push(["warn", t("folderNote")]); }
    if (s.persisted === true) out.push(["ok", t("persistYes")]);
    else if (s.persisted === false) out.push(["warn", t("persistNo")]);
    if (s.safari7) out.push(["no", t("safari")]);
    if (s.lock && s.code === true) out.push(["ok", t("codeYes")]);
    else if (s.lock && s.code === false) out.push(["warn", t("codeNo")]);
    return { lines: out, bottom: s.lost === "all" ? t("lostAll") : t("lostSince", { when: when(s.lost.since) }), canAsk: s.persisted === false && firefox() };
  }

  function ask() {
    if (!(navigator.storage && navigator.storage.persist)) return Promise.resolve(null);
    return navigator.storage.persist().then(function (p) {
      persisted = !!p;
      try { document.dispatchEvent(new CustomEvent("sysbaby:survival", { detail: { persisted: persisted } })); } catch (e) { /* ignore */ }
      return persisted;
    }, function () { return persisted; });
  }

  /* При входе: спросить, обещано ли постоянство; не обещано — попросить
     молча там, где просьба молчалива (не в Firefox — там это окно). */
  (function boot() {
    if (!(navigator.storage && navigator.storage.persisted)) return;
    navigator.storage.persisted().then(function (p) {
      persisted = !!p;
      if (!persisted && !firefox()) return ask();
      return null;
    }, function () { persisted = null; });
  })();

  window.sbSurvival = { state: state, lines: lines, ask: ask, t: t, keys: keys };
})();
