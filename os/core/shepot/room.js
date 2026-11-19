/* sys.baby OS — core/shepot/room.js
 * ── ШЁПОТ В КОМНАТЕ ПЕРЕПИСКИ (D-1405) ─────────────────────────────────────────────────
 * ПОВОД — задание основателя 17.11.2026 (§2 п.2): «приглашение только QR / „Передать“, сверка
 * 4 словами; без имён, счетов, телефонов…; Свидетель видит каждое соединение, почтальоны
 * названы поимённо»; и §1: «Честно в интерфейсе: „адрес подключения видит узел сети — для
 * полной анонимности используйте VPN/Tor“ и „внешней проверки ещё не было“».
 *
 * ЧТО ЗДЕСЬ. Мост между комнатой переписки (apps/messenger) и почтой (post.js): приглашение
 * с кодом QR и ссылкой, вход по приглашению, сверка словами, панель связи с почтальонами
 * поимённо, отметка «в пути / дошло». Комната зовёт этот мост в нескольких местах; своего
 * окна у него нет.
 *
 * НАРУЖУ — ТОЛЬКО ПО РУКЕ. Пока человек не нажал «Выйти на связь», соединений нет. Окно
 * закрыли или замок заперли — связь гаснет сама. Приглашение едет в хвосте адреса после «#»:
 * браузер этот хвост на сервер не отправляет.
 *
 * ЗАПИСЬ РАЗГОВОРА (ключи, очередь) лежит внутри записи переписки, в том же ящике комнаты, —
 * под замком она запечатана вместе с остальным.
 */
(function () {
  "use strict";
  var P = window.sbShepotPost, L = window.sbShepotLib;
  var api = null, office = null, known = [], lineOn = false, handed = null, tick = null, owed = false, fade = null, spoke = null, tabLock = null, asked = {};
  var HASH = /^#shepot=([A-Za-z0-9_-]{60,200})$/;

  function t(k, v) { return typeof window.sbT === "function" ? window.sbT(k, v) : k; }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function say(key, opt) { try { if (window.sbVoice && window.sbVoice.say) return window.sbVoice.say("", Object.assign({ key: key }, opt || {})); } catch (e) { /* голос занят */ } return null; }
  function winNow() { return typeof window.getOpenWindow === "function" ? window.getOpenWindow("messenger") : null; }
  function convoOf(rec) { var all = api ? api.convos() : [], i; for (i = 0; i < all.length; i++) if (all[i].shepot === rec) return all[i]; return null; }
  function is(c) { return !!(c && c.shepot && c.shepot.v === 1); }

  /* Приглашение, пришедшее ссылкой: хвост адреса читается один раз и сразу стирается из строки. */
  (function () {
    var m = HASH.exec(String(window.location.hash || ""));
    if (!m) return;
    handed = m[1];
    try { history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) { /* адрес останется — приглашение всё равно разовое */ }
    document.addEventListener("sysbaby:desktop-ready", function () {
      /* Приглашение можно открыть или отклонить (решение основателя 18.11, п.4). Отказ — местный: приглашение
         забыто здесь, наружу не уходит ничего; у позвавшего оно просто истечёт. */
      spoke = say("sh.voice.invite", { sticky: true, on: function (w, i) { if (i === 1) decline(); else if (window.sbOpenApp) window.sbOpenApp("messenger"); } });
    });
  })();

  /* О письме говорит голос — событием. По умолчанию без имени: «Вам написали». Имя звучит, только если человек сам
     включил «Называть имя в голосе» (решение основателя 18.11, п.3); «на людях» (D-816) имени нет и тогда —
     фразу без имени выбирает сам голос (ключ .pub). Слов письма в голосе нет никогда. */
  function hail(c) {
    var named = nameOn() && !!c.shName;
    if (named) say("sh.voice.letter.named", { kind: "event", vars: { name: c.shName } }); else say("sh.voice.letter", { kind: "event" });
  }
  /* ИМЯ — ОДИН ПЕРЕКЛЮЧАТЕЛЬ, ВЫКЛЮЧЕН С РОЖДЕНИЯ (решение основателя 18.11). Он один и тот же в Настройках и в
     самом Шёпоте (панель «Связь»). Выключен: имён нет нигде — голос говорит «Вам написали», в окне «Собеседник»,
     своё имя не уходит. Включён: голос и окно называют собеседника, если он своё имя показал, а своё имя (из
     Настроек) уходит тем, с кем слова уже сверены, — запечатанным, один раз на имя. */
  function nameOn() { try { return !!(window.sbGetControlToggle && window.sbGetControlToggle("shepotName")); } catch (e) { return false; } }
  function names() {
    if (!api) return;
    var on = nameOn();
    api.convos().forEach(function (c) {
      if (!is(c)) return;
      if (c.shBase == null) c.shBase = c.name;
      var want = on && c.shName ? c.shName : c.shBase;
      if (c.name !== want) { c.name = want; c.initials = want.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(""); }
    });
  }
  function showName() {
    names();
    if (!office || !api || !nameOn()) return;
    var name = ""; try { name = window.sbAddr && window.sbAddr.name ? String(window.sbAddr.name() || "").trim().slice(0, 40) : ""; } catch (e) { name = ""; }
    if (!name) return;
    api.convos().forEach(function (c) {
      if (!is(c) || c.shepot.stage !== "talk" || c.shChecked !== true || c.shCard === name) return;
      if (office.card(c.shepot, name)) c.shCard = name;
    });
  }
  try { if (window.sbBus && window.sbBus.on) window.sbBus.on("setting:changed", function (p) { if (p && p.key === "shepotName") { showName(); soon(); } }); } catch (e) { /* шины нет — имя обновится при следующей перерисовке */ }
  function decline() {
    handed = null;
    if (spoke) { try { spoke.dismiss(); } catch (e) { /* фраза уже растаяла */ } spoke = null; }
    var w = winNow(); if (w && api) { w._shJoinOpen = false; api.render(w); }
  }
  /* Новое письмо светится, пока не прошло два такта: свет — только у нового. */
  function fresh(m) {
    if (!P || !m || !m.sh || m.from === "me") return false;
    var left = m.ts + P.BREATH_MS * 2 - Date.now();
    if (left <= 0) return false;
    if (!fade) fade = setTimeout(function () { fade = null; soon(); }, left + 50);     /* свет гаснет сам, без нового события */
    return true;
  }
  function post() {
    if (office || !P) return office;
    office = P.make({
      text: function (rec, text, at) {
        var c = convoOf(rec); if (!c) return;
        c.messages.push({ id: "s" + at.toString(36) + c.messages.length.toString(36), from: "them", text: text, ts: at, edited: false, reaction: null, sh: 1 });
        /* Письмо пришло не в открытый разговор: отметка в списке и одно слово голоса — событием, без имени
           и без слов письма (D-816: «на людях» подробностей нет). Пока не прочитано, второй раз не говорим. */
        var w = winNow();
        if (!w || !api || String(api.active()) !== String(c.id)) { if (!c.unread) hail(c); c.unread = true; }
        soon();
      },
      /* Собеседник сам показал своё имя. Оно хранится при разговоре, а видно — только пока у человека включено
         «Показывать имя»; выключено — в окне снова «Собеседник». Знаки управления срезаются. */
      card: function (rec, name) {
        var c = convoOf(rec); name = String(name || "").replace(/[\u0000-\u001f\u007f\u2028\u2029\u202a-\u202e\u2066-\u2069]/g, "").trim().slice(0, 40);
        if (!c || !name) return;
        c.shName = name; names(); soon();
      },
      /* Срочная запись: ключи разговора сдвинулись — на диск сразу, до того как конверт уйдёт к почтальонам. */
      change: function (rec, urgent) { var c = convoOf(rec); if (c) delivered(c); if (urgent && api) { api.write(); api.flush(); } soon(); },
      state: function () { soon(); }
    });
    return office;
  }
  /* Своё письмо «дошло», когда собеседник подтвердил все его части. */
  function delivered(c) {
    var out = c.shepot.out || [], low = out.length ? out[0].seq : Infinity, i;
    for (i = 0; i < out.length; i++) if (out[i].seq < low) low = out[i].seq;
    c.messages.forEach(function (m) { if (m.sh && m.from === "me" && !m.shDone && m.shSeq < low && !(c.shepot.wait || []).length) m.shDone = true; });
  }
  /* Перерисовать и записать — не чаще нескольких раз в секунду и не теряя набранного.
     Пока человек набирает приглашение, поле не трогаем: окно догонит, когда он поле отпустит (D-1412 —
     прежде окно молчало всё время, пока в поле стоял код, и пришедшие письма не показывались). */
  function soon() {
    if (tick) return;
    tick = setTimeout(function () {
      tick = null; if (!api) return;
      api.write();
      var w = winNow(), host = w && w.el ? w.el.querySelector(".window-body") : null; if (!host) return;
      var inp = host.querySelector("#msgrInput"), code = host.querySelector("#shCode");
      var keep = inp ? { v: inp.value, f: document.activeElement === inp, a: inp.selectionStart, b: inp.selectionEnd } : null;
      if (code && document.activeElement === code) { owed = true; return; }
      var kept = code ? code.value : null, note = host.querySelector("#shJoinSay"), said = note ? note.textContent : "";
      api.render(w);
      var code2 = host.querySelector("#shCode"), note2 = host.querySelector("#shJoinSay");
      if (code2 && kept != null) code2.value = kept;
      if (note2 && said) note2.textContent = said;
      var again = host.querySelector("#msgrInput");
      if (keep && again) { again.value = keep.v; if (keep.f) { again.focus(); try { again.setSelectionRange(keep.a, keep.b); } catch (e) { /* поле без выделения */ } } }
    }, 250);
  }

  /* Почта знает ровно те разговоры, что лежат в переписке сейчас (замок, удаление, загрузка). */
  function sync(a) {
    api = a; if (!P) return;
    if (spoke) { try { spoke.dismiss(); } catch (e) { /* фраза уже растаяла */ } spoke = null; }   /* комната открыта — слово о приглашении сказано */
    var now = api.convos().filter(is).map(function (c) { return c.shepot; });
    if (!now.length && !known.length) return;
    post();
    known.forEach(function (rec) { if (now.indexOf(rec) === -1) office.remove(rec); });
    now.forEach(function (rec) { if (known.indexOf(rec) === -1) office.add(rec); });
    known = now;
    showName();
    if (!known.length && lineOn) off();
  }
  /* НА СВЯЗИ — ОДНА ВКЛАДКА. Ключи разговора меняются с каждым письмом; две вкладки на связи
     разошлись бы в ключах, и разговор сломался бы навсегда. Право держит замок браузера
     (Web Locks): вкладку закрыли — право свободно. Вкладке, которой хранилище не даёт писать,
     на связь тоже нельзя: её ключи не сохранились бы. */
  /* Дом узнаёт, что Шёпот на связи: пока это так, слова «ничего не покидает эту сессию» были бы неправдой
     (решение основателя 17.11, п.9) — их молчит core/topbar.js. */
  function tellLine() { try { if (window.sbBus && window.sbBus.emit) window.sbBus.emit("shepot:line", { on: lineOn }); } catch (e) { /* шины нет — молчим */ } }
  function off() {
    lineOn = false; if (office) office.close(); tellLine();
    if (tabLock) { try { tabLock(); } catch (e) { /* право уже отпущено */ } tabLock = null; }
  }
  function line(want) {
    if (!post()) return;
    if (!want) { off(); soon(); return; }
    if (lineOn) return;
    var go = function () { lineOn = true; office.open(); tellLine(); soon(); };
    try { if (window.sbVault && window.sbVault.writer && window.sbVault.writer() === false) { say("sh.voice.tab"); return; } } catch (e) { /* замка нет — пишет любая вкладка */ }
    var locks = null; try { locks = window.navigator.locks; } catch (e) { locks = null; }
    if (!locks || typeof locks.request !== "function") { go(); return; }
    locks.request("sysbaby-shepot-line", { mode: "exclusive", ifAvailable: true }, function (lock) {
      if (!lock) { say("sh.voice.tab"); return null; }
      go();
      return new Promise(function (release) { tabLock = release; });
    }).then(null, function () { /* право не дали — на связь не вышли */ });
  }
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("window:closed", function (e) { if (e && e.id === "messenger" && lineOn) off(); });
    window.sbBus.on("store:epoch", function () { if (lineOn && window.sbDB && window.sbDB.closed && window.sbDB.closed()) off(); });
  }
  /* Телефон уснул и проснулся: соединения к этому времени оборваны — поднимаем сразу, а не через отсрочку. */
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && lineOn && office) office.wake(); });

  function linkOf(code) { return window.location.origin + window.location.pathname + "#shepot=" + code; }
  function qrOf(text) {
    try { var q = L.qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 16, scalable: true }); }
    catch (e) { return ""; }
  }
  function wordsOf(rec) {
    var list = window.SB_WORDS || [], n = P && window.sbShepot ? window.sbShepot.WORDS : 2048;
    return (rec.words || []).map(function (i) { return list.length ? list[Math.floor(i * list.length / n)] : String(i); });
  }
  function upCount() { var s = office ? office.status() : null, n = 0; if (s) s.postmen.forEach(function (p) { if (p.open) n++; }); return n; }

  /* ── разметка ── */
  function newForm(win) {
    if (!P) return "";
    return '<div class="mg-seal-panel sh-new">' +
      '<p class="mg-seal-what">' + esc(t("sh.new.what")) + "</p>" +
      '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="shInvite">' + esc(t("sh.invite")) + "</button>" +
      '<button type="button" class="mg-seal-go quiet" id="shHave" aria-expanded="' + (win._shJoinOpen || handed ? "true" : "false") + '">' + esc(t("sh.have")) + "</button></div>" +
      (win._shJoinOpen || handed
        ? '<div class="mg-seal-row"><input type="text" id="shCode" class="mg-input flat" autocomplete="off" spellcheck="false" data-sb-nolang placeholder="' + esc(t("sh.codePh")) + '" aria-label="' + esc(t("sh.have")) + '" value="' + esc(handed ? linkOf(handed) : "") + '">' +
          '<button type="button" class="mg-seal-go" id="shJoin">' + esc(t("sh.join")) + "</button>" +
          (handed ? '<button type="button" class="mg-seal-go quiet" id="shDecline">' + esc(t("sh.decline")) + "</button>" : "") + "</div>" +
          '<p class="mg-seal-say" id="shJoinSay" role="status"></p>'
        : "") +
    "</div>";
  }
  function headNote(c) { return lineOn ? t("sh.head.on", { n: upCount(), all: P.POSTMEN.length }) : t("sh.head.off"); }
  function headButtons(win) {
    return '<button type="button" class="mg-to-letter" id="shLink" aria-expanded="' + (win._shLinkOpen ? "true" : "false") + '">' + esc(t("sh.link")) + "</button>" +
      '<button type="button" class="mg-to-letter" id="shLine" aria-pressed="' + (lineOn ? "true" : "false") + '">' + esc(t(lineOn ? "sh.line.off" : "sh.line.on")) + "</button>";
  }
  function honest() {
    return '<p class="mg-seal-what sh-honest">' + esc(t("sh.honest.ip")) + " " + esc(t("sh.honest.audit")) + "</p>" +
      '<p class="mg-seal-what">' + esc(t("sh.honest.both", { min: Math.round(P.LIFE_S / 60) })) + " " + esc(t("sh.honest.pace", { sec: Math.round(P.BREATH_MS / 1000) })) + "</p>";
  }
  function panels(win, c) {
    var rec = c.shepot, out = "", link = "", s;
    if (rec.stage === "invite" && rec.code) {
      var link = linkOf(rec.code);
      out += '<div class="mg-seal-panel" id="shInvPanel">' +
        '<div class="sh-qr" role="img" aria-label="QR">' + qrOf(link) + "</div>" +
        '<p class="mg-seal-what">' + esc(t("sh.inv.what", { min: Math.round(P.INVITE_MS / 60000) })) + (lineOn ? "" : " " + esc(t("sh.inv.needLine"))) + "</p>" +
        '<textarea id="shInvLink" class="mg-seal-text" readonly autocomplete="off" data-sb-nolang>' + esc(link) + "</textarea>" +
        '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="shInvCopy">' + esc(t("sh.inv.copy")) + "</button>" +
        (navigator.share ? '<button type="button" class="mg-seal-go" id="shInvShare">' + esc(t("sh.inv.share")) + "</button>" : "") + "</div>" +
        '<p class="mg-seal-say" id="shInvSay" role="status"></p></div>';
    } else if (rec.stage === "hello") {
      out += '<div class="mg-seal-panel" id="shHelloPanel"><p class="mg-seal-what">' + esc(t("sh.hello.what")) + (lineOn ? "" : " " + esc(t("sh.inv.needLine"))) + "</p></div>";
    } else if (rec.stage === "late") {
      out += '<div class="mg-seal-panel" id="shLatePanel"><p class="mg-seal-what">' + esc(t("sh.late.what")) + "</p>" +
        '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="shLateDrop">' + esc(t("sh.late.drop")) + "</button></div></div>";
    } else if (rec.stage === "talk" && rec.words && c.shChecked !== true) {
      /* До сверки писать нельзя (решение основателя 17.11, п.3). Как сверить, говорит голос; здесь — только
         сами слова и два ответа, без плашки. */
      out += '<div class="sh-check" id="shWordsPanel">' +
        '<p class="sh-label">' + esc(t(c.shChecked === false ? "sh.words.bad" : "sh.words.label")) + "</p>" +
        '<p class="sh-words" data-sb-nolang>' + wordsOf(rec).map(esc).join(" · ") + "</p>" +
        (c.shChecked === false
          ? '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="shBadDrop">' + esc(t("sh.late.drop")) + "</button></div>" :
          '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="shWordsYes">' + esc(t("sh.words.yes")) + "</button>" +
          '<button type="button" class="mg-seal-go quiet" id="shWordsNo">' + esc(t("sh.words.no")) + "</button></div>") +
        "</div>";
    }
    if (win._shLinkOpen || !lineOn) {
      s = office ? office.status() : null;
      link = '<div class="mg-seal-panel" id="shLinkPanel">' + honest() +
        '<div class="mg-seal-row sh-name-row"><span class="sh-label" id="shNameLabel">' + esc(t("sh.set.name")) + '</span>' +
        '<button type="button" class="mg-seal-go quiet" id="shNameSw" role="switch" aria-labelledby="shNameLabel" aria-checked="' + (nameOn() ? "true" : "false") + '">' + esc(t(nameOn() ? "set.switch.on" : "set.switch.off")) + "</button></div>" +
        (lineOn && s
          ? '<p class="mg-seal-what">' + esc(t("sh.men.title")) + (c.shChecked === true ? " · " + esc(t("sh.words.ok")) : "") + "</p><ul class=\"sh-men\">" + s.postmen.map(function (p) {
              return '<li data-sb-nolang data-open="' + (p.open ? "1" : "0") + '">' + esc(t("sh.men.row", { host: p.host, state: t(p.open ? "sh.men.open" : "sh.men.closed"), sent: p.sent, got: p.got })) +
                (p.bad ? esc(t("sh.men.bad", { bad: p.bad })) : "") + (p.refused ? esc(t("sh.men.refused", { n: p.refused })) : "") + "</li>";
            }).join("") + "</ul>"
          : "") +
        "</div>";
    }
    /* Пока человек не на связи, честные строки стоят первыми: их читают до того, как нажать «Выйти на связь». */
    out = lineOn ? out + link : link + out;
    return out ? '<div class="sh-panels">' + out + "</div>" : "";
  }
  function inputRow(win, c) {
    var ready = c.shepot.stage === "talk" && c.shChecked === true;
    /* У гостя ничего не хранится: окно говорит это прямо, рядом с полем письма (решение основателя 18.11, п.2). */
    return (window.sbIncognitoActive ? '<p class="sh-label sh-guest" id="shGuest">' + esc(t("sh.guest")) + "</p>" : "") +
      '<div class="mg-inputrow">' +
      '<input type="text" id="msgrInput" class="mg-input flat" autocomplete="off" placeholder="' + esc(t(ready ? "sh.ph.say" : c.shepot.stage === "talk" ? "sh.ph.check" : "sh.ph.wait")) + '"' + (ready ? "" : " disabled") + ">" +
      '<button type="button" class="mg-send" id="mgSend" title="' + esc(t("mg.send")) + '" aria-label="' + esc(t("mg.send")) + '"' + (ready ? "" : " disabled") + ">" + window.sbZnak("send") + "</button>" +
    "</div>";
  }
  function meta(m) { return m.sh && m.from === "me" ? ' · <span class="sh-state" data-done="' + (m.shDone ? "1" : "0") + '">' + esc(t(m.shDone ? "sh.done" : "sh.onway")) + "</span>" : ""; }
  function empty(short) { return t(short ? "sh.empty.short" : "sh.empty"); }

  /* ── действия ── */
  function start(win, rec, name) {
    var c = api.add(name, rec);
    win._msgrNewOpen = false; win._shJoinOpen = false; win._shLinkOpen = false;
    known.push(rec); api.write(); api.render(win);
    return c;
  }
  /* Сверка: ответ один, откуда бы он ни пришёл — словом голоса или кнопкой под словами. */
  function hush(c) { var h = asked[c.id]; if (h && h.dismiss) { try { h.dismiss(); } catch (e) { /* фраза уже ушла */ } } asked[c.id] = true; }
  function answer(win, c, yes) {
    hush(c); c.shChecked = !!yes; if (yes) showName(); api.write();
    if (!yes) say("sh.voice.bad", { sticky: true });
    var w = winNow(); if (w) api.render(w);
  }
  function askWords(win, c) {
    if (!is(c) || c.shepot.stage !== "talk" || !c.shepot.words || c.shChecked != null || asked[c.id]) return;
    asked[c.id] = say("sh.voice.words", { sticky: true, on: function (w, i) { answer(win, c, i === 0); } }) || true;
  }
  function wire(win, host, c) {
    var q = function (sel) { return host.querySelector(sel); };
    var b;
    if ((b = q("#shInvite"))) b.addEventListener("click", function () { if (post()) start(win, office.invite(), t("sh.name.host")); });
    if ((b = q("#shHave"))) b.addEventListener("click", function () { win._shJoinOpen = !win._shJoinOpen; api.render(win); });
    var join = function () {
      var field = q("#shCode"), sayEl = q("#shJoinSay"), raw = field ? field.value.trim() : "";
      var m = /#shepot=([A-Za-z0-9_-]+)\s*$/.exec(raw), code = m ? m[1] : raw, rec = null;
      try { rec = post() ? office.join(code) : null; } catch (e) { rec = null; }
      if (!rec) { if (sayEl) sayEl.textContent = t(P ? "sh.join.bad" : "sh.voice.none"); return; }
      handed = null; start(win, rec, t("sh.name.guest"));
    };
    if ((b = q("#shJoin"))) b.addEventListener("click", join);
    if ((b = q("#shDecline"))) b.addEventListener("click", decline);
    if ((b = q("#shNameSw"))) b.addEventListener("click", function () { if (window.sbSetControlToggle) window.sbSetControlToggle("shepotName", !nameOn()); showName(); api.write(); api.render(win); });
    if ((b = q("#shCode"))) {
      b.addEventListener("keydown", function (ev) { if (ev.key === "Enter") join(); });
      b.addEventListener("blur", function () { if (owed) { owed = false; soon(); } });
    }
    if (!c || !is(c)) return;
    askWords(win, c);
    if ((b = q("#shLine"))) b.addEventListener("click", function () { line(!lineOn); api.render(win); });
    if ((b = q("#shLink"))) b.addEventListener("click", function () { win._shLinkOpen = !win._shLinkOpen; api.render(win); });
    if ((b = q("#shInvCopy"))) b.addEventListener("click", function () {
      var ta = q("#shInvLink"), sayEl = q("#shInvSay"), text = ta ? ta.value : "";
      var byHand = function () { if (ta) ta.select(); if (sayEl) sayEl.textContent = t("sh.inv.copyHand"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { if (sayEl) sayEl.textContent = t("sh.inv.copied"); }, byHand); else byHand();
    });
    if ((b = q("#shInvShare"))) b.addEventListener("click", function () {
      var ta = q("#shInvLink"); try { navigator.share({ text: ta ? ta.value : "" }).catch(function () { /* человек передумал */ }); } catch (e) { /* листа «Передать» нет */ }
    });
    if ((b = q("#shLateDrop"))) b.addEventListener("click", function () { api.remove(c); });
    if ((b = q("#shBadDrop"))) b.addEventListener("click", function () {
      window.sbAsk({ question: t("sh.del.what"), ok: t("ask.delete"), danger: true }).then(function (yes) { if (yes) api.remove(c); });
    });
    if ((b = q("#shWordsYes"))) b.addEventListener("click", function () { answer(win, c, true); });
    if ((b = q("#shWordsNo"))) b.addEventListener("click", function () { answer(win, c, false); });
  }
  function send(win, c, text) {
    if (!office || c.shepot.stage !== "talk" || c.shChecked !== true) return false;
    if (!office.say(c.shepot, text)) { say("sh.full"); return false; }
    c.messages.push({ id: "s" + Date.now().toString(36) + c.messages.length.toString(36), from: "me", text: text, ts: Date.now(), edited: false, reaction: null, sh: 1, shSeq: c.shepot.seq, shDone: false });
    api.write();
    return true;
  }
  function forget(c) { if (is(c)) hush(c); if (office && is(c)) { office.remove(c.shepot); known = known.filter(function (r) { return r !== c.shepot; }); } }

  window.sbShepotRoom = { there: !!P, is: is, sync: sync, newForm: newForm, headNote: headNote, headButtons: headButtons, panels: panels,
    inputRow: inputRow, meta: meta, fresh: fresh, empty: empty, wire: wire, send: send, forget: forget, line: line, on: function () { return lineOn; },
    handed: function () { return handed; } };
})();
