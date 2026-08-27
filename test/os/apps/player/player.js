/* sys.baby OS — Проигрыватель.
 *
 * ПОВОД, дословно от основателя 26.08.2026: «обязательно нужен концептуальный
 * приложение музыкальный проигрыватель, пока что только локальный. чтобы он
 * мог получить доступ к устройству и сразу же использовать всю музыку. окно
 * музыкального проигрывателя с управлением должно находиться на месте
 * подсказок. в стиле winamp и в нашей концепции» — и: «дизайн гибридный -
 * наш и winamp».
 *
 * ГЛАВНЫЙ ВОПРОС ЗДЕСЬ НЕ ПРО ЗВУК, А ПРО МЕСТО. «На месте подсказок» — это
 * линия, на которой у стола ОДНО МЕСТО РЕЧИ: подсказка и извещение стоят там
 * в одном веществе, и заведено это по прямой просьбе основателя (D-116).
 * Поставить полосу ВМЕСТО них значило бы отнять у стола голос. Полоса встаёт
 * НА линию, а речь поднимается над ней — и поднимается САМА, потому что вся
 * нижняя строка уже читает одно имя --desk-row-b. Полоса лишь объявляет свою
 * высоту, как док объявляет свою. Третий раз за неделю одно лекарство: одно
 * знание — одно имя.
 *
 * ГРАНИЦА, НАЗВАННАЯ ВСЛУХ. Браузер НЕ МОЖЕТ сам просмотреть музыку на
 * устройстве — такого права у страницы нет ни в одном браузере, и обходных
 * путей тут нет, только неправда. Человек один раз указывает папку; там, где
 * браузер умеет (File System Access), система запоминает саму папку и на
 * следующий день берёт из неё всё заново. Где не умеет — помнит список имён и
 * просит указать папку снова. И то и другое сказано человеку прямо.
 *
 * ГИБРИД, КОТОРЫЙ НЕ КОСТЮМ. От Winamp взято то, чем он был: узкая полоса
 * вместо окна, спектр, бегущее название и время СЕМЬЮ СТЕРЖНЯМИ. Последнее —
 * не подражание: наши цифры (D-135) уже сделаны из стержней, и проигрыватель
 * берёт ТУ ЖЕ деталь (window.sbClockGlyph), а не рисует похожую. Winamp и
 * наши часы оказались одной вещью, и это совпадение стоит использовать, а не
 * изображать.
 *
 * Охраняется tools/player-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5.5l10-2v12"/><circle cx="6.6" cy="18" r="2.6"/><circle cx="16.6" cy="15.5" r="2.6"/></svg>';
  var I = {
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5.5h2.2v13H7zM19 5.8v12.4L10.4 12z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.8 5.5H17v13h-2.2zM5 5.8 13.6 12 5 18.2z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.8 19.4 12 7 19.2z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5a1.5 1.5 0 0 1 1.5-1.5h3.6l1.8 2.2h8.1a1.5 1.5 0 0 1 1.5 1.5v8.3a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/></svg>'
  };

  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function reduced() {
    try {
      return !!window.sbGetControlToggle("motion") ||
        (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) { return false; }
  }

  /* ------------------------------------------------------------- состояние */
  var tracks = [];          /* { name, url, file } */
  var at = -1;
  var audio = null;
  var bar = null;
  var frames = 0;           /* сколько кадров нарисовал спектр — для закона */
  var rafId = null;
  var ac = null, analyser = null, srcNode = null, bins = null;

  function niceName(n) { return String(n).replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " "); }

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("ended", function () { step(1); });
    audio.addEventListener("timeupdate", paintBar);
    audio.addEventListener("play", function () { paintBar(); startSpectrum(); });
    audio.addEventListener("pause", function () { paintBar(); stopSpectrum(); });
    return audio;
  }

  /* ── СПЕКТР ЖИВЁТ ТОЛЬКО ПОКА ИГРАЕТ ──────────────────────────────────
     Не «почти не жрёт», а НЕ РИСУЕТ НИ КАДРА, когда музыка стоит, вкладка
     спрятана или человек выключил движение. Постоянная анимация на столе уже
     стоила системе двадцати двух процентных пунктов из тридцати трёх на
     слабом телефоне (замер 12.08) — этот урок оплачен. */
  function startSpectrum() {
    if (rafId || reduced()) return;
    var cv = bar && bar.querySelector(".pl-spec");
    if (!cv) return;
    try {
      if (!ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        srcNode = ac.createMediaElementSource(audio);
        analyser = ac.createAnalyser();
        analyser.fftSize = 64;
        srcNode.connect(analyser); analyser.connect(ac.destination);
        bins = new Uint8Array(analyser.frequencyBinCount);
      }
      if (ac.state === "suspended") ac.resume();
    } catch (err) { console.error("[player] spectrum unavailable", err); return; }
    var ctx = cv.getContext("2d");
    var last = 0;
    function tick(now) {
      if (!audio || audio.paused || reduced() || doc.visibilityState === "hidden") { rafId = null; return; }
      rafId = requestAnimationFrame(tick);
      if (now - last < 45) return;            /* около двадцати кадров: спектр, а не игра */
      last = now;
      analyser.getByteFrequencyData(bins);
      var w = cv.width, h = cv.height, n = 14, bw = w / n;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(cv).color;
      for (var i = 0; i < n; i++) {
        var v = bins[i * 2] / 255;
        var bh = Math.max(1, Math.round(v * h));
        ctx.fillRect(Math.round(i * bw), h - bh, Math.max(1, Math.floor(bw) - 1), bh);
      }
      frames++;
    }
    rafId = requestAnimationFrame(tick);
  }
  function stopSpectrum() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    var cv = bar && bar.querySelector(".pl-spec");
    if (cv) { var c = cv.getContext("2d"); c.clearRect(0, 0, cv.width, cv.height); }
  }
  doc.addEventListener("visibilitychange", function () {
    if (doc.visibilityState === "hidden") stopSpectrum();
    else if (audio && !audio.paused) startSpectrum();
  });
  window.sbPlayerFrames = function () { return frames; };

  /* ------------------------------------------------------------- полоса */
  function timeGlyphs(sec) {
    var s = Math.max(0, Math.floor(sec || 0));
    var str = ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2);
    var box = doc.createDocumentFragment();
    for (var i = 0; i < str.length; i++) {
      var cell = doc.createElement("span");
      cell.className = "pl-t";
      if (str[i] === ":") { cell.className += " colon"; cell.textContent = ":"; }
      else if (window.sbClockGlyph) cell.appendChild(window.sbClockGlyph(str[i]));
      else cell.textContent = str[i];
      box.appendChild(cell);
    }
    return box;
  }

  function makeBar() {
    if (bar) return bar;
    bar = doc.createElement("div");
    bar.id = "sbPlayBar";
    bar.className = "pl-bar";
    bar.innerHTML =
      '<canvas class="pl-spec" width="56" height="18" aria-hidden="true"></canvas>' +
      '<span class="pl-time" aria-hidden="true"></span>' +
      '<span class="pl-title"><span class="pl-title-in"></span></span>' +
      '<button type="button" class="pl-b pl-prev" aria-label="' + esc(t("pl.prev")) + '">' + I.prev + "</button>" +
      '<button type="button" class="pl-b pl-play" aria-label="' + esc(t("pl.play")) + '">' + I.play + "</button>" +
      '<button type="button" class="pl-b pl-next" aria-label="' + esc(t("pl.next")) + '">' + I.next + "</button>" +
      '<input class="pl-seek" type="range" min="0" max="1000" value="0" aria-label="' + esc(t("pl.seek")) + '" />';
    doc.body.appendChild(bar);
    bar.querySelector(".pl-prev").addEventListener("click", function () { step(-1); });
    bar.querySelector(".pl-next").addEventListener("click", function () { step(1); });
    bar.querySelector(".pl-play").addEventListener("click", toggle);
    var seek = bar.querySelector(".pl-seek");
    seek.addEventListener("input", function () {
      if (audio && audio.duration) audio.currentTime = audio.duration * (seek.value / 1000);
    });
    publishHeight();
    /* ── МЕРИТЬ НАДО ВСТАВШЕЕ, А НЕ ВСТАЮЩЕЕ (D-170, нашла доска) ──────────
       publishHeight() звался один раз, при рождении полосы, — то есть до
       того, как в неё встали название дорожки и кнопки. Итоговая высота
       оказывалась на четыре точки больше объявленной, и речь стола садилась
       на полосу этими четырьмя точками. Закон player-check этого не видел:
       он мерил извещение через 500 мс, посреди его полёта, и заставал ещё
       не приземлившимся — то есть выше, чем оно окажется. Два прибора врали
       в одну сторону, и ошибка держалась.
       Теперь высота публикуется при КАЖДОМ изменении размера полосы: имя
       говорит правду в любой момент, а не только в первый. */
    if (window.ResizeObserver && !bar.__sbRo) {
      try {
        bar.__sbRo = new window.ResizeObserver(function () { publishHeight(); });
        bar.__sbRo.observe(bar);
      } catch (e) { /* без наблюдателя останется прежний путь */ }
    }
    return bar;
  }

  /* МЕСТО, ЗАНЯТОЕ ПОЛОСОЙ, — ОДНО ИМЯ, КОТОРОЕ ЧИТАЮТ ВСЕ. Ровно так док
     отодвигает от себя весь нижний ряд; полоса делает то же самое, и
     подсказка с извещением поднимаются сами, не зная о проигрывателе ничего.
     ИМЯ НАЗЫВАЕТ ТО, ЧТО ЕСТЬ. Сперва оно звалось --player-h, «высота
     полосы», а несло высоту ПЛЮС зазор — и закон честно поймал расхождение:
     52 против 62. Имя переименовано в --player-row: «сколько места полоса
     занимает в нижнем ряду». Зазор — часть этого места, а не часть высоты. */
  var lastH = -1;
  function publishHeight() {
    var h = bar && bar.getClientRects().length ? Math.round(bar.getBoundingClientRect().height + 10) : 0;
    if (h === lastH) return;
    lastH = h;
    doc.documentElement.style.setProperty("--player-row", h + "px");
  }
  function dropBar() {
    if (bar && bar.__sbRo) { try { bar.__sbRo.disconnect(); } catch (e) { /* ignore */ } bar.__sbRo = null; }
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null; lastH = -1;
    doc.documentElement.style.setProperty("--player-row", "0px");
  }

  function paintBar() {
    if (!bar) return;
    var tr = tracks[at];
    var ttl = bar.querySelector(".pl-title-in");
    var want = tr ? niceName(tr.name) : "";
    if (ttl.textContent !== want) {
      ttl.textContent = want;
      /* Бегущая строка — только если не помещается и движение не выключено. */
      var over = ttl.scrollWidth > ttl.parentNode.clientWidth + 2;
      ttl.parentNode.classList.toggle("runs", over && !reduced());
    }
    var box = bar.querySelector(".pl-time");
    var sec = audio ? audio.currentTime : 0;
    var stamp = Math.floor(sec);
    if (box._sbStamp !== stamp) {
      box._sbStamp = stamp;
      box.innerHTML = "";
      box.appendChild(timeGlyphs(sec));
    }
    var seek = bar.querySelector(".pl-seek");
    if (audio && audio.duration && doc.activeElement !== seek) {
      seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    }
    var pb = bar.querySelector(".pl-play");
    var playing = audio && !audio.paused;
    pb.innerHTML = playing ? I.pause : I.play;
    pb.setAttribute("aria-label", t(playing ? "pl.pause" : "pl.play"));
    publishHeight();
  }

  /* ------------------------------------------------------------- команды */
  function playAt(i) {
    if (!tracks.length) return;
    at = (i + tracks.length) % tracks.length;
    var a = ensureAudio();
    a.src = tracks[at].url;
    var p = a.play();
    if (p && p.catch) p.catch(function (err) { console.error("[player] play refused", err); });
    paintBar();
    refreshList();
  }
  function step(d) { if (tracks.length) playAt(at + d); }
  function toggle() {
    if (!tracks.length) return;
    var a = ensureAudio();
    if (at < 0) return playAt(0);
    if (a.paused) { var p = a.play(); if (p && p.catch) p.catch(function () { }); }
    else a.pause();
    paintBar();
  }
  window.sbPlayerPlay = function () { if (tracks.length) { if (at < 0) playAt(0); else { var a = ensureAudio(); var p = a.play(); if (p && p.catch) p.catch(function () { }); paintBar(); } } };
  window.sbPlayerPause = function () { if (audio) { audio.pause(); paintBar(); } };
  window.sbPlayerNext = function () { step(1); };
  window.sbPlayerTracks = function () { return tracks.map(function (x) { return x.name; }); };

  /* ДВЕРЬ ДЛЯ МУЗЫКИ. Через неё приходит и выбор папки человеком, и закон:
     закон не должен зависеть от того, что лежит на машине. */
  window.sbPlayerAdopt = function (files) {
    var list = Array.prototype.slice.call(files || []).filter(function (f) {
      return /^audio\//.test(f.type) || /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|weba)$/i.test(f.name);
    });
    if (!list.length) return 0;
    tracks.forEach(function (x) { try { URL.revokeObjectURL(x.url); } catch (e) { } });
    tracks = list.map(function (f) { return { name: f.name, url: URL.createObjectURL(f), file: f }; })
      .sort(function (a, b) { return a.name.localeCompare(b.name); });
    at = -1;
    makeBar();
    paintBar();
    refreshList();
    return tracks.length;
  };

  function pickFolder() {
    var inp = doc.createElement("input");
    inp.type = "file";
    inp.multiple = true;
    inp.accept = "audio/*";
    try { inp.setAttribute("webkitdirectory", ""); } catch (e) { /* ignore */ }
    inp.addEventListener("change", function () {
      var n = window.sbPlayerAdopt(inp.files);
      if (window.showToast) {
        window.showToast(t("pl.brought"), n ? t("pl.broughtN", { n: n }) : t("pl.none"), "");
      }
    });
    inp.click();
  }
  window.sbPlayerPick = pickFolder;

  /* ------------------------------------------------------------- окно */
  function listMarkup() {
    if (!tracks.length) {
      return '<div class="pl-empty">' +
        '<div class="pl-empty-glyph">' + ICON + "</div>" +
        '<p class="pl-empty-title">' + esc(t("pl.empty.title")) + "</p>" +
        '<p class="pl-empty-sub">' + esc(t("pl.empty.sub")) + "</p>" +
        '<button type="button" class="pl-pick">' + I.folder + "<span>" + esc(t("pl.pick")) + "</span></button>" +
      "</div>";
    }
    return '<div class="pl-head"><span>' + esc(t("pl.count", { n: tracks.length })) + "</span>" +
      '<button type="button" class="pl-pick small">' + I.folder + "<span>" + esc(t("pl.pick")) + "</span></button></div>" +
      '<div class="pl-list">' + tracks.map(function (tr, i) {
        return '<button type="button" class="pl-row' + (i === at ? " on" : "") + '" data-i="' + i + '">' +
          '<span class="pl-n">' + (i + 1) + "</span>" +
          '<span class="pl-name">' + esc(niceName(tr.name)) + "</span></button>";
      }).join("") + "</div>";
  }
  function refreshList() {
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("player") : null;
    if (win && win.el) render(win);
  }
  function render(win) {
    var host = win && win.el ? win.el.querySelector(".window-body") : null;
    if (!host) return;
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = '<div class="app-player">' + listMarkup() + "</div>";
    if (_sbKeep) _sbKeep();
    host.querySelectorAll(".pl-pick").forEach(function (b) { b.addEventListener("click", pickFolder); });
    host.querySelectorAll(".pl-row").forEach(function (b) {
      b.addEventListener("click", function () { playAt(Number(b.getAttribute("data-i")) || 0); });
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("player", {
      title: "Player",
      /* ОДНО ИМЯ НА ОДНУ ВЕЩЬ. Сперва здесь стояло два — «Проигрыватель» в
         заголовке окна и «Музыка» под значком. Закон os-i18n-check покраснел,
         и по делу: у приложения в доке, в палитре и на столе должно быть одно
         имя, иначе человек ищет «Музыку», а система знает «Проигрыватель».
         Та же ошибка, что и в коде, только словами. */
      i18n: {
        ru: { title: "Проигрыватель", label: "Проигрыватель" },
        ee: { title: "Mängija", label: "Mängija" }
      },
      label: "Player",
      color: "linear-gradient(160deg,#d7b4ff 0%,#9a5bff 52%,#6a2fd0 100%)",
      icon: ICON,
      size: { w: 560, h: 560 },
      render: render
    });
  }

  /* Нет музыки — нет полосы: пустой проигрыватель ряд не занимает. */
  window.sbPlayerDrop = function () {
    if (audio) { audio.pause(); audio.src = ""; }
    stopSpectrum();
    tracks.forEach(function (x) { try { URL.revokeObjectURL(x.url); } catch (e) { } });
    tracks = []; at = -1;
    dropBar();
    refreshList();
  };
})();
