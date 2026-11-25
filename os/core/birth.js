/* sys.baby — «РОЖДЕНИЕ» НА ВОРОТАХ · решение D-1362-BIRTH-VIDEO.
 *
 * Основатель 23.11.2026 утвердил загрузку Г5 «Рождение» (эталон zagruzka-G5-ETALON.html) в виде заранее отрисованного
 * видео: отдельный слой поверх ворот, пока ворота думают, — при регистрации (первое слово), входе словом и переезде
 * (прежний пароль становится словом), а также при входе кодом восстановления. Видимого слова «готово» нет: для экранного
 * чтения оно остаётся скрытым живым статусом и говорится только тогда, когда ворота и правда открылись.
 *
 * КАК УСТРОЕНО
 *   · Слой встаёт ровно тогда, когда ворота думают (класс vg-work на #sbVaultGate), и тает, когда перестали. Он
 *     ничего не ждёт и ничего не держит: ни одна строка входа его не дожидается, финала «готово» у видео нет — видео
 *     только заполняет ожидание (закон login-responsive-check и одна минута ответа D-1357 те же).
 *   · Видео — обычные файлы того же источника (core/birth/*.webm, запасной *.mp4 H.264): никаких blob-адресов и
 *     потоков (CSP media-src 'self' и так это позволяет). Вступление «рождение» → бесшовная петля, пока работа идёт.
 *   · Слой — сосед ворот в <body>, а не их часть: вес ворот (gate-weight-check) не растёт; заводится лениво, в простое
 *     после того, как ворота встали, и уходит вместе с ними.
 *   · Меньше движения (data-motion="reduced" или prefers-reduced-motion) — неподвижный кадр петли, видео не грузится.
 *   · Слабое устройство: видео не успело пойти за 1,5 с — до конца этого ожидания стоит тот же неподвижный кадр; ни
 *     холста, ни кадров главного потока — только прозрачность слоя.
 * Охраняется tools/birth-video-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  /* папка роликов — рядом с этим файлом (core/birth/), от адреса самого сценария: система открывается и из /os/, и из
     корня (root-is-os), и относительный путь от страницы вёл бы не туда. Адреса сценария нет (ковчег — один файл) —
     путь от страницы, как прежде */
  var BASE = "core/birth/";
  try { var selfSrc = doc.currentScript && doc.currentScript.src; if (selfSrc) BASE = new URL("birth/", selfSrc).href; } catch (e) { /* старый браузер — путь от страницы */ }
  var build = (function () { var m = doc.querySelector('meta[name="sysbaby-build"]'); return m ? m.getAttribute("content") : ""; })();
  function src(name) { return BASE + name + (build ? "?b=" + encodeURIComponent(build) : ""); }
  function reduced() {
    if (root.getAttribute("data-motion") === "reduced") return true;
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }
  function orient() { return window.innerWidth >= window.innerHeight ? "land" : "port"; }

  var gate = null, layer = null, still = null, say = null, vids = null, built = "", state = "idle", calmNow = false;
  var hideTimer = 0, slowTimer = 0, obs = null;

  function mkVideo(name, loop) {
    var v = doc.createElement("video");
    v.className = "sbb-v";
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = !!loop; v.preload = "auto"; v.disablePictureInPicture = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", ""); v.setAttribute("aria-hidden", "true");
    var a = doc.createElement("source"); a.src = src(name + ".webm"); a.type = 'video/webm; codecs="vp9"';
    var b = doc.createElement("source"); b.src = src(name + ".mp4"); b.type = "video/mp4";
    b.addEventListener("error", function () { v._broken = true; });
    v.appendChild(a); v.appendChild(b);
    return v;
  }
  /* Слой заводится один раз на ворота; видео — только когда движение разрешено. */
  function ensure() {
    var o = orient(), calm = reduced();
    if (layer && built === o + (calm ? ":calm" : "")) return;
    drop();
    built = o + (calm ? ":calm" : "");
    layer = doc.createElement("div");
    layer.id = "sbBirth"; layer.setAttribute("aria-hidden", "true");
    var dim = doc.createElement("div"); dim.className = "sbb-dim"; layer.appendChild(dim);
    still = doc.createElement("img"); still.className = "sbb-still"; still.alt = ""; still.decoding = "async"; still.src = src(o + "-still.webp");
    layer.appendChild(still);
    if (!calm) {
      vids = { intro: mkVideo(o + "-intro", false), loop: mkVideo(o + "-loop", true) };
      layer.appendChild(vids.intro); layer.appendChild(vids.loop);
      /* вступление кончилось — петля продолжает с того же кадра; показ меняется, когда петля уже идёт */
      vids.intro.addEventListener("ended", function () { if (state === "on" && !calmNow) play(vids.loop); });
      vids.intro.addEventListener("playing", function () { if (state === "on" && !calmNow) { clearTimeout(slowTimer); vids.intro.classList.add("on"); } });
      vids.loop.addEventListener("playing", function () { if (state === "on" && !calmNow) { vids.loop.classList.add("on"); vids.intro.classList.remove("on"); } });
    } else vids = null;
    doc.body.appendChild(layer);
    if (!say) {
      say = doc.createElement("p");
      say.id = "sbBirthSay"; say.className = "sbb-say"; say.setAttribute("role", "status"); say.setAttribute("aria-live", "polite");
      doc.body.appendChild(say);
    }
  }
  function drop() {
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    if (vids) { [vids.intro, vids.loop].forEach(function (v) { try { v.pause(); v.removeAttribute("src"); while (v.firstChild) v.removeChild(v.firstChild); v.load(); } catch (e) { /* уже снято */ } }); }
    layer = null; still = null; vids = null; built = "";
  }
  function play(v) {
    try { var p = v.play(); if (p && p.catch) p.catch(function () { useStill(); }); } catch (e) { useStill(); }
  }
  function useStill() {
    if (state !== "on") return;
    calmNow = true;
    if (still) still.classList.add("on");
    if (vids) { vids.intro.classList.remove("on"); vids.loop.classList.remove("on"); try { vids.intro.pause(); vids.loop.pause(); } catch (e) { /* стоит */ } }
  }
  function start() {
    if (state === "on") return;
    clearTimeout(hideTimer);
    ensure();
    state = "on"; calmNow = !vids;
    if (say) say.textContent = "";
    layer.classList.remove("out");
    if (calmNow) still.classList.add("on");
    else {
      still.classList.remove("on");
      if ((vids.intro._broken && vids.loop._broken)) useStill();
      else {
        try { vids.intro.currentTime = 0; vids.loop.currentTime = 0; } catch (e) { /* ещё не загружено */ }
        play(vids.intro);
        /* слабое устройство или сеть: видео не пошло за 1,5 с — неподвижный кадр до конца этого ожидания */
        slowTimer = setTimeout(function () { if (state === "on" && vids && !vids.intro.classList.contains("on") && !vids.loop.classList.contains("on")) useStill(); }, 1500);
      }
    }
    /* появление — следующим кадром, чтобы прозрачность успела стать переходом */
    requestAnimationFrame(function () { if (state === "on" && layer) layer.classList.add("on"); });
    layer.setAttribute("data-state", "on");
  }
  function stop() {
    if (state !== "on") return;
    state = "off";
    clearTimeout(slowTimer);
    if (!layer) return;
    layer.classList.remove("on"); layer.classList.add("out"); layer.setAttribute("data-state", "off");
    /* ворота открылись (или встал лист «Защита мира») — экранному чтению говорится «готово»; отказ молчит */
    setTimeout(function () {
      var opened = (gate && gate.classList.contains("vg-open")) || !!doc.getElementById("sbGuardGo");
      if (opened && say) say.textContent = gateWord("lock.birth.done");
    }, 0);
    hideTimer = setTimeout(function () {
      if (state === "on" || !layer) return;
      if (vids) { try { vids.intro.pause(); vids.loop.pause(); vids.intro.classList.remove("on"); vids.loop.classList.remove("on"); } catch (e) { /* стоит */ } }
      if (still) still.classList.remove("on");
      calmNow = false;
      layer.classList.remove("out");
    }, 700);
  }
  function gateWord(key) {
    var lang = (gate && gate.getAttribute("lang")) || "";
    var l = lang.indexOf("ru") === 0 ? "ru" : lang.indexOf("et") === 0 || lang.indexOf("ee") === 0 ? "ee" : lang ? "en" : "";
    try { if (l && typeof window.sbTIn === "function") return window.sbTIn(l, key); } catch (e) { /* словаря нет */ }
    try { if (typeof window.sbT === "function") return window.sbT(key); } catch (e) { /* словаря нет */ }
    return "";
  }
  function gone() {
    clearTimeout(slowTimer); clearTimeout(hideTimer);
    state = "idle";
    if (obs) { obs.disconnect(); obs = null; }
    gate = null;
    /* слой тает и уходит вместе с воротами; статус чтения живёт ещё миг, чтобы «готово» успело прозвучать */
    var l = layer, s = say;
    layer = null; vids = null; still = null; built = ""; say = null;
    /* снятие видео — в простое, не в задаче раскладки стола */
    if (l) { l.classList.remove("on"); l.classList.add("out"); setTimeout(function () { var rm = function () { if (l.parentNode) l.parentNode.removeChild(l); }; if (window.requestIdleCallback) window.requestIdleCallback(rm, { timeout: 3000 }); else rm(); }, 700); }
    if (s) setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 4000);
  }

  window.sbBirth = {
    /* shell.js зовёт, когда ворота встали. */
    watch: function (g) {
      if (!g || g === gate) return;
      if (gate) gone();
      gate = g;
      obs = new MutationObserver(function () {
        if (!gate) return;
        if (!gate.isConnected) { gone(); return; }
        if (gate.classList.contains("vg-work")) start(); else stop();
      });
      obs.observe(gate, { attributes: true, attributeFilter: ["class"] });
      doc.addEventListener("sysbaby:door-gone", function () { if (gate === g) gone(); }, { once: true });
      /* слой и видео — в простое, когда ворота уже стоят: загрузка не отнимает кадров у их появления */
      var warm = function () { if (gate === g && state === "idle") ensure(); };
      if (window.requestIdleCallback) window.requestIdleCallback(warm, { timeout: 2500 }); else setTimeout(warm, 1200);
      if (gate.classList.contains("vg-work")) start();
    },
    state: function () { return { state: state, calm: calmNow, layer: !!layer, built: built }; }
  };
})();
