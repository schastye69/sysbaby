/*
 * handoff.js — ПЕРЕДАТЬ. Запечатанная передача по ссылке, без единого сервера
 * (D-222).
 *
 * ПОВОД, дословно от основателя: «прошу совет придумать самое гениальное
 * решение для того, чтобы всё таки внедрить тот же личный чат в системе и
 * другие функции требующие интернет… иначе у sys.baby почти не будет
 * цепляющего функционала».
 *
 * СОВЕТ ПОПРАВИЛ СЕБЯ. Стена, о которой он говорил раньше, — запрет
 * показывать чужие САЙТЫ в рамке. К связи она отношения не имеет. Основатель
 * был прав, и переносить тот отказ на чат было ошибкой.
 *
 * НО ЧАТ БЕЗ ЛЮДЕЙ НЕ ЦЕПЛЯЕТ. Пустая комната не держит никого. Зато есть
 * вещь, которой второй пользователь НЕ НУЖЕН: передача по ссылке. Получателю
 * не нужен ни счёт, ни sys.baby, ни что-либо ещё — только ссылка.
 *
 * ЧТО ДЕЛАЕТ ЭТО ВОЗМОЖНЫМ БЕЗ СЕРВЕРА. Хвост адреса после «#» браузер
 * НИКОГДА не отправляет на сервер — это свойство протокола, а не обещание и
 * не настройка. Значит запечатанное едет в самой ссылке, и держатель сайта
 * не видит переданного никогда, даже если захочет. Это не «мы обещаем не
 * смотреть»: смотреть НЕ НА ЧТО. Закон доказывает это сетью — перехватывает
 * все запросы и требует, чтобы ни в одном не было ни куска переданного.
 *
 * ДВА СПОСОБА, И РАЗНИЦА МЕЖДУ НИМИ ЧЕСТНО НАЗВАНА:
 *   · КЛЮЧ В ССЫЛКЕ — просто. Кто получил ссылку, тот и прочёл. Годится для
 *     того, что вы и так отправили бы обычным сообщением, но не хотите
 *     оставлять в чужой переписке навсегда.
 *   · СЛОВО ОТДЕЛЬНО — по-настоящему. Ссылка идёт письмом, слово говорится
 *     голосом. Перехвативший одно не получает ничего.
 *
 * Охраняется tools/handoff-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4.6 12h11.2M12.4 7.6 16.8 12l-4.4 4.4"/><path d="M15.6 4.4h2.2a1.6 1.6 0 0 1 1.6 1.6v12a1.6 1.6 0 0 1-1.6 1.6h-2.2"/></svg>';

  var ITER = 1000000;         /* растяжка слова: одна попытка для подбирающего */
  var MAX = 4000;             /* знаков текста; настоящий предел — длина ссылки, и она меряется */
  var URL_MAX = 6000;         /* ПОСТОЯННАЯ: не состав системы, а осторожная граница длины адреса.
                                 Браузеры держат больше; режут длинные ссылки ПЕРЕСЫЛЩИКИ, и этого
                                 числа Совет не знает — оно проверяется пересылкой, а не арифметикой,
                                 и так и сказано человеку. */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() { try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; } }

  /* base64url: в адресе нет места ни «+», ни «/», ни «=». */
  function b64u(buf) {
    var b = new Uint8Array(buf), s = "", i;
    for (i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return window.btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64u(str) {
    var s = String(str).replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = window.atob(s), out = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function rand(n) { var b = new Uint8Array(n); window.crypto.getRandomValues(b); return b; }

  function keyFromWord(word, salt) {
    var enc = new TextEncoder();
    var subtle = window.crypto.subtle;
    return subtle.importKey("raw", enc.encode(String(word)), { name: "PBKDF2" }, false, ["deriveKey"])
      .then(function (base) {
        return subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: ITER, hash: "SHA-256" },
          base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      });
  }
  function keyFromBytes(bytes) {
    return window.crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  }

  /* ── ЗАПЕЧАТАТЬ ─────────────────────────────────────────────────────────
     Формат хвоста: 1.<способ>.<соль>.<номер>.<конверт>[.<ключ>]
     Ключ лежит в хвосте ТОЛЬКО в простом способе — и об этом сказано прямо. */
  /* ── ПЕРЕДАЁТСЯ НЕ ТОЛЬКО ТЕКСТ, НО И ЕГО ИМЯ (D-223) ───────────────────
     Получатель должен видеть, ЧТО ему прислали, а не голый кусок текста без
     начала. Имя едет внутри конверта, а не рядом с ним: снаружи по-прежнему
     не видно ничего. Конверт без имени открывается как раньше — старые
     ссылки продолжают работать. */
  function pack(text, name) {
    if (!name) return String(text);
    return "\u0000sb1\n" + String(name) + "\n" + String(text);
  }
  function unpack(raw) {
    var s = String(raw);
    if (s.indexOf("\u0000sb1\n") !== 0) return { name: null, text: s };
    var rest = s.slice(5);
    var nl = rest.indexOf("\n");
    if (nl < 0) return { name: null, text: s };
    return { name: rest.slice(0, nl), text: rest.slice(nl + 1) };
  }

  function seal(text, word, name) {
    var salt = rand(16), iv = rand(12);
    var body = new TextEncoder().encode(pack(text, name));
    var mode = word ? "w" : "k";
    var keyBytes = word ? null : rand(32);
    return (word ? keyFromWord(word, salt) : keyFromBytes(keyBytes)).then(function (key) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, body);
    }).then(function (ct) {
      var parts = ["1", mode, b64u(salt), b64u(iv), b64u(ct)];
      if (!word) parts.push(b64u(keyBytes));
      return parts.join(".");
    });
  }

  function parse(payload) {
    var p = String(payload || "").split(".");
    if (p.length < 5 || p[0] !== "1") return null;
    return { mode: p[1], salt: p[2], iv: p[3], ct: p[4], key: p[5] || null };
  }

  function open(payload, word) {
    var r = parse(payload);
    if (!r) return Promise.reject(new Error("shape"));
    if (r.mode === "k" && !r.key) return Promise.reject(new Error("shape"));
    var salt = unb64u(r.salt), iv = unb64u(r.iv), ct = unb64u(r.ct);
    return (r.mode === "w" ? keyFromWord(word || "", salt) : keyFromBytes(unb64u(r.key)))
      .then(function (key) {
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ct);
      })
      .then(function (buf) { return new TextDecoder().decode(buf); });
  }

  window.sbHandoff = { seal: seal, open: open, parse: parse, unpack: unpack, sources: sources, needsWord: function (p) {
    var r = parse(p); return !!r && r.mode === "w";
  } };

  var UI = {
    en: {
      title: "Hand over", label: "Hand over",
      lead: "Seal something and send it as a link. The part after # never reaches any server — not ours, not anyone's. There is nothing for us to see even if we wanted to.",
      pick: "or take something you already have", pickNone: "nothing here yet",
      note: "note", file: "file", tooBig: "This makes a {n}-character link — too long. Keep the text shorter.",
      linkNote: "Length checked by arithmetic, not by sending. Some messengers cut long links — send yourself one and see.",
      text: "What you are handing over", modeKey: "Key inside the link — simple",
      modeWord: "Word said separately — properly", word: "The word you will say out loud",
      make: "Seal it", again: "Seal another", copy: "Copy the link", copied: "Copied",
      len: "{n} characters in the link", tooLong: "Too long for a link — keep it under {n} characters.",
      needWord: "Say a word — a long one. Whoever has the link can try words against it.",
      gotTitle: "Someone handed this to you", ask: "This one needs the word you were told.",
      openIt: "Open", badTitle: "This link does not open",
      bad: "Either it was damaged on the way, or the word is not the right one. Nothing else can be said — and guessing would be worse than silence.",
      honest: "What this does not give you. The link is the secret: anyone who gets it, in the simple mode, reads it — so treat it like the thing itself. It stays in your browser history and in whatever chat you sent it through, and we cannot reach in and delete it there. It cannot be recalled, and it has no expiry — a link works for as long as it exists. What it does give: the machine that serves sys.baby never receives what you handed over, and that is a property of the web itself, not a promise of ours.",
    },
    ru: {
      title: "Передать", label: "Передать",
      lead: "Запечатайте и отправьте ссылкой. То, что стоит после #, не доходит ни до одного сервера — ни до нашего, ни до чужого. Нам нечего увидеть, даже если бы мы захотели.",
      pick: "или взять то, что уже есть", pickNone: "пока нечего брать",
      note: "заметка", file: "файл", tooBig: "Выходит ссылка в {n} знаков — это слишком. Сократите текст.",
      linkNote: "Длина проверена арифметикой, а не пересылкой. Часть мессенджеров режет длинные ссылки — пришлите себе одну и посмотрите.",
      text: "Что передаёте", modeKey: "Ключ внутри ссылки — просто",
      modeWord: "Слово отдельно — по-настоящему", word: "Слово, которое вы скажете голосом",
      make: "Запечатать", again: "Запечатать ещё", copy: "Скопировать ссылку", copied: "Скопировано",
      len: "{n} знаков в ссылке", tooLong: "Слишком длинно для ссылки — уложитесь в {n} знаков.",
      needWord: "Назовите слово, и лучше длинное: тот, у кого ссылка, может перебирать слова.",
      gotTitle: "Вам передали", ask: "Здесь нужно слово, которое вам сказали.",
      openIt: "Открыть", badTitle: "Эта ссылка не открывается",
      bad: "Либо её повредило по дороге, либо слово не то. Больше сказать нечего — а угадывать было бы хуже, чем молчать.",
      honest: "Чего это не даёт. В простом способе ссылка И ЕСТЬ тайна: кто её получил, тот прочёл, — обращайтесь с ней как с самим содержимым. Она остаётся в истории вашего браузера и в той переписке, через которую вы её послали, и оттуда мы её не достанем. Её нельзя отозвать, и у неё нет срока: ссылка работает, пока существует. Что это даёт взамен: машина, отдающая sys.baby, НЕ ПОЛУЧАЕТ переданного вовсе — и это свойство самого устройства сети, а не наше обещание.",
    },
    ee: {
      title: "Anna edasi", label: "Anna edasi",
      lead: "Pitseeri ja saada lingina. See, mis on pärast #, ei jõua ühtegi serverisse — ei meie ega võõrasse. Meil ei ole midagi näha, isegi kui tahaksime.",
      pick: "või võta see, mis juba olemas", pickNone: "praegu pole midagi võtta",
      note: "märkmik", file: "fail", tooBig: "Tuleb {n} märgiga link — liiga pikk. Lühenda teksti.",
      linkNote: "Pikkus on kontrollitud arvutusega, mitte saatmisega. Osa sõnumirakendusi lõikab pikki linke — saada endale üks ja vaata.",
      text: "Mida annad edasi", modeKey: "Võti lingi sees — lihtne",
      modeWord: "Sõna eraldi — päriselt", word: "Sõna, mille ütled häälega",
      make: "Pitseeri", again: "Pitseeri veel", copy: "Kopeeri link", copied: "Kopeeritud",
      len: "{n} märki lingis", tooLong: "Lingi jaoks liiga pikk — mahu {n} märgi sisse.",
      needWord: "Ütle sõna, pikem on parem: kellel on link, võib sõnu proovida.",
      gotTitle: "Sulle anti edasi", ask: "Siin on vaja sõna, mis sulle öeldi.",
      openIt: "Ava", badTitle: "See link ei avane",
      bad: "Kas ta sai teel viga või ei ole sõna õige. Rohkem ei saa öelda — ja arvamine oleks halvem kui vaikimine.",
      honest: "Mida see ei anna. Lihtsas viisis ON link ise saladus: kes ta saab, see loeb — kohtle teda nagu sisu ennast. Ta jääb sinu brauseri ajalukku ja sellesse vestlusesse, kust ta saatsid, ja sealt me teda kätte ei saa. Teda ei saa tagasi võtta ja tal ei ole tähtaega. Mida ta annab: masin, mis sys.baby'd jagab, EI SAA edasiantut üldse — ja see on võrgu enda omadus, mitte meie lubadus.",
    }
  };
  function T() { return UI[lang()] || UI.en; }
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] == null ? m : o[k]; }); }

  /* ── ОТКУДА БЕРЁТСЯ ПЕРЕДАВАЕМОЕ ────────────────────────────────────────
     Система перестаёт быть набором отдельных окон ровно там, где одно окно
     умеет взять содержимое другого. Заметки и Файлы отдают себя наружу
     давно — тем же протоколом, которым их читает Поиск; «Передать» просто
     спрашивает у них, вместо того чтобы заставлять человека перепечатывать. */
  function sources() {
    var out = [];
    try {
      var notes = (window.sbNotesStore && window.sbNotesStore.load()) || [];
      notes.forEach(function (n) {
        var text = String(n.text || "").trim();
        if (!text) return;
        out.push({ kind: "note", id: n.id, name: text.split("\n")[0].slice(0, 40), text: text });
      });
    } catch (e) { /* ignore */ }
    try {
      var files = (window.sbFilesAll && window.sbFilesAll()) || [];
      files.forEach(function (f) {
        if (f.content == null) return;
        out.push({ kind: "file", id: (f.path || []).join("/") + "/" + f.name, name: f.name, text: String(f.content) });
      });
    } catch (e) { /* ignore */ }
    return out;
  }

  function hashPayload() {
    var h = String(window.location.hash || "");
    return h.indexOf("#t=") === 0 ? h.slice(3) : null;
  }

  /* Принятое из другой комнаты ждёт здесь до ближайшей отрисовки (D-240). */
  var pending = null;

  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var t = T();
    var incoming = hashPayload();
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;

    host.innerHTML =
      '<div class="hf-wrap">' +
        '<div class="hf-head"><h2 class="hf-title">' + esc(t.title) + '</h2>' +
        '<p class="hf-lead">' + esc(t.lead) + '</p></div>' +
        (incoming ? '<section class="hf-in"></section>' : '') +
        '<section class="hf-out">' +
          '<label class="hf-lab">' + esc(t.text) + '</label>' +
          '<textarea class="hf-text" rows="5" maxlength="' + MAX + '"></textarea>' +
          '<div class="hf-pick"><span class="hf-pick-l">' + esc(t.pick) + '</span>' +
            '<select class="hf-src"><option value="">—</option></select></div>' +
          '<label class="hf-mode"><input type="radio" name="hfmode" value="k" checked> ' + esc(t.modeKey) + '</label>' +
          '<label class="hf-mode"><input type="radio" name="hfmode" value="w"> ' + esc(t.modeWord) + '</label>' +
          '<input type="text" class="hf-sendword" placeholder="' + esc(t.word) + '" hidden>' +
          '<button type="button" class="hf-act" data-act="hf-seal">' + esc(t.make) + '</button>' +
          '<div class="hf-link" hidden></div>' +
          '<p class="hf-say" role="status"></p>' +
        '</section>' +
        '<p class="hf-honest">' + esc(t.honest) + '</p>' +
      '</div>';
    /* Вещь, принятая из другой комнаты, ложится в поле — и забывается:
       второй раз её никто не приносил. */
    if (pending) {
      var box = host.querySelector(".hf-text");
      if (box) { box.value = (pending.name ? pending.name + "\n\n" : "") + pending.text; }
      pending = null;
    }
    if (keep) keep();

    /* Список того, что уже лежит в системе. Пусто — так и сказано, а не
       пустой выпадающий список, который выглядит сломанным. */
    var src = host.querySelector(".hf-src");
    var have = sources();
    if (src) {
      if (!have.length) {
        src.innerHTML = '<option value="">' + esc(t.pickNone) + '</option>';
        src.disabled = true;
      } else {
        src.innerHTML = '<option value="">—</option>' + have.map(function (o, i) {
          return '<option value="' + i + '">' + esc((o.kind === "note" ? t.note : t.file) + " · " + o.name) + '</option>';
        }).join("");
      }
    }
    var picked = null;

    var inBox = host.querySelector(".hf-in");
    if (incoming) showIncoming(inBox, incoming, t);

    host.addEventListener("change", function (ev) {
      if (ev.target.name === "hfmode") {
        host.querySelector(".hf-sendword").hidden = ev.target.value !== "w";
        return;
      }
      if (ev.target.classList && ev.target.classList.contains("hf-src")) {
        var i = ev.target.value;
        picked = (i === "") ? null : have[+i];
        if (picked) host.querySelector(".hf-text").value = picked.text;
      }
    });

    host.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");

      if (act === "hf-seal") {
        var text = host.querySelector(".hf-text").value;
        var mode = (host.querySelector('input[name="hfmode"]:checked') || {}).value || "k";
        var word = mode === "w" ? host.querySelector(".hf-sendword").value : null;
        var say = host.querySelector(".hf-say");
        if (!text) return;
        if (mode === "w" && !word) { say.textContent = t.needWord; return; }
        b.disabled = true; say.textContent = "…";
        var name = picked && picked.text === text ? picked.name : null;
        seal(text, word, name).then(function (payload) {
          b.disabled = false;
          var url = window.location.origin + window.location.pathname + "#t=" + payload;
          /* Предел меряется на ГОТОВОЙ ссылке, а не на длине текста: сколько
             займёт конверт, заранее не знает никто. */
          if (url.length > URL_MAX) { say.textContent = fill(t.tooBig, { n: url.length }); return; }
          var box = host.querySelector(".hf-link");
          box.hidden = false;
          box.innerHTML = '<code class="hf-url"></code>' +
            '<button type="button" class="hf-act" data-act="hf-copy">' + esc(t.copy) + '</button>' +
            '<span class="hf-len">' + esc(fill(t.len, { n: url.length })) + '</span>' +
            '<span class="hf-len">' + esc(t.linkNote) + '</span>';
          box.querySelector(".hf-url").textContent = url;
          say.textContent = "";
        }, function () { b.disabled = false; say.textContent = t.bad; });
        return;
      }

      if (act === "hf-copy") {
        var u = host.querySelector(".hf-url");
        if (!u) return;
        try { navigator.clipboard.writeText(u.textContent); } catch (e) { /* ignore */ }
        host.querySelector(".hf-say").textContent = t.copied;
        return;
      }

      if (act === "hf-open") {
        var w = host.querySelector(".hf-word").value;
        var payload = hashPayload();
        b.disabled = true;
        open(payload, w).then(function (text) {
          b.disabled = false;
          paintGot(inBox, text, t);
        }, function () {
          b.disabled = false;
          paintBad(inBox, t, true);
        });
      }
    });
  }

  function showIncoming(box, payload, t) {
    if (!box) return;
    var r = parse(payload);
    if (!r) { paintBad(box, t, false); return; }
    if (r.mode === "w") {
      box.innerHTML =
        '<div class="hf-ask">' +
          '<h3>' + esc(t.gotTitle) + '</h3>' +
          '<p>' + esc(t.ask) + '</p>' +
          '<input type="password" class="hf-word" placeholder="' + esc(t.word) + '">' +
          '<button type="button" class="hf-act" data-act="hf-open">' + esc(t.openIt) + '</button>' +
        '</div>';
      return;
    }
    open(payload, null).then(function (text) { paintGot(box, text, t); },
                            function () { paintBad(box, t, false); });
  }
  function paintGot(box, raw, t) {
    /* Переданное НЕ кладётся никуда: ни в хранилище, ни в конверт. Оно живёт
       ровно столько, сколько открыто это окно. */
    var got = unpack(raw);
    box.innerHTML = '<div class="hf-got"><h3>' + esc(t.gotTitle) + '</h3>' +
      (got.name ? '<p class="hf-got-name"></p>' : '') +
      '<pre class="hf-got-text"></pre></div>';
    if (got.name) box.querySelector(".hf-got-name").textContent = got.name;
    box.querySelector(".hf-got-text").textContent = got.text;
  }
  function paintBad(box, t, keepAsk) {
    var ask = keepAsk ? box.querySelector(".hf-ask") : null;
    var html = '<div class="hf-bad"><h3>' + esc(t.badTitle) + '</h3><p>' + esc(t.bad) + '</p></div>';
    if (ask) { var old = box.querySelector(".hf-bad"); if (old) old.remove(); ask.insertAdjacentHTML("afterend", html); }
    else box.innerHTML = html;
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("handoff", {
      /* ПРИЁМ ВЕЩЕЙ ИЗ ДРУГИХ КОМНАТ (D-240). «Передать» — единственная
         комната, из которой вещь уходит к ДРУГОМУ ЧЕЛОВЕКУ, и потому она
         обязана уметь принять что угодно из своих же комнат: иначе человек
         снова копирует руками. Приёмник кладёт текст в поле и открывает
         окно — запечатывать или нет, решает человек, а не передача.
         Охраняется tools/hand-check.mjs. */
      takes: ["запись", "файл", "письмо"],
      take: function (thing) {
        if (!thing || typeof thing.text !== "string") return false;
        pending = { name: String(thing.name || ""), text: thing.text };
        var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("handoff") : null;
        if (!win && typeof window.toggleApp === "function") window.toggleApp("handoff");
        else if (win) { try { render(win); } catch (e) { /* окно перерисуется само */ } }
        return true;
      },
      title: UI.en.title,
      label: UI.en.label,
      i18n: { ru: { title: UI.ru.title, label: UI.ru.label }, ee: { title: UI.ee.title, label: UI.ee.label } },
      color: "linear-gradient(160deg,#a8e6cf 0%,#3f9d7a 52%,#123a2c 100%)",
      icon: ICON,
      size: { w: 680, h: 660 },
      retranslate: true,
      render: render
    });
  }

  /* Пришли по ссылке — окно открывается само: человек не должен искать, куда
     нести то, что ему прислали. */
  function openIfIncoming() {
    if (!hashPayload()) return;
    if (typeof window.toggleApp !== "function") { setTimeout(openIfIncoming, 200); return; }
    if (doc.querySelector('.window[data-app="handoff"]')) return;
    try { window.toggleApp("handoff"); } catch (e) { setTimeout(openIfIncoming, 300); }
  }
  doc.addEventListener("sysbaby:desktop-ready", function () { setTimeout(openIfIncoming, 120); }, { once: true });
  setTimeout(openIfIncoming, 1500);
})();
