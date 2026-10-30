/* sys.baby — СЦЕНЫ ДВЕРИ ЗАМКА · решение D-581.
 *
 * Основатель утвердил две сцены двери: Собор (WebGL; если видеокарта не
 * справится — картина) и Порог (холст 2D). Здесь — их общий хозяин: одна
 * дверь, один порядок, одни права.
 *
 * ПРАВА СЦЕНЫ — САМЫЕ УЗКИЕ ВО ВСЕЙ СИСТЕМЕ. Сцена стоит до слова, то есть
 * тогда, когда у системы ещё нет ключа. Поэтому:
 *   · сцена не видит слова: ей сообщают только ЧИСЛО набранных знаков
 *     (typing(n)); поле #sbVaultPass читает оболочка двери, а не сцена;
 *   · сцена ничего не решает: «неверно» и «открыть» ей говорит оболочка
 *     двери по ответу замка (wrong(), open(done));
 *   · сцена не ходит в сеть и не пишет на диск: кроме своих файлов в этой
 *     папке, ей нечего просить, а всё, что ей нужно помнить, — в памяти;
 *   · сцена уходит целиком: destroy() снимает её слушателей, таймеры,
 *     кадры и адреса картинок, сделанные ею.
 *
 * ПОРЯДОК ОТСТУПЛЕНИЯ. Выбранная дверь; если её файл не пришёл или она
 * упала при постройке — другая; если нет обеих — дверь остаётся прежней.
 * Внутри Собора своё отступление — с WebGL на картину (самопроверка кадра,
 * ?nogl, медленное устройство); его ведёт сам Собор.
 *
 * ВЫБОР ДВЕРИ живёт в памяти страницы, как выбор языка у двери (D-288).
 * Основатель задумал, что выбор помнится одним ключом; такой ключ упирается
 * в действующие законы о том, что лежит на диске открытым, — спор вынесен
 * основателю (см. tools/door-one-check.mjs). Сторожат эти правила
 * tools/door-scene-check.mjs, tools/pearl-word-check.mjs,
 * tools/door-truth-check.mjs, tools/door-fallback-check.mjs и
 * tools/door-one-check.mjs.
 */
(function () {
  "use strict";
  var FACT = {};
  var ORDER = ["sobor", "porog"];
  var choice = null;
  var current = null;
  var alive = 0;
  /* ПОКА ЗАМОК ПОВОРАЧИВАЕТ КЛЮЧ, СЦЕНА ЗАМИРАЕТ. Растяжка слова считается
     на том же процессоре, что и кадры сцены; кадр, отнятый у растяжки, сделал
     бы цену попытки зависящей от того, что рисует дверь, — и время ответа
     стало бы говорить (second-key-check, gate-truth-check). Замок говорит
     «ключ поворачивается» вестью vault:turning (store.js, deriveKEK); дверь
     в это время показывает работу диафрагмой, а сцена стоит. */
  var held = false, hooked = false;
  function hookBus() {
    if (hooked || !window.sbBus || !window.sbBus.on) return;
    hooked = true;
    window.sbBus.on("vault:turning", function (p) {
      held = !!(p && p.on);
      if (current) current.hold(held);
    });
  }
  /* Где лежат файлы сцен — у самого этого файла: дома os/core/doors/, на
     сайте — тот же путь от корня. Метка сборки (?b=…) идёт и к картинкам,
     чтобы работник положил их на полку под той же меткой. */
  var me = document.currentScript;
  var src = me && me.src ? me.src : "";
  var base = src ? src.replace(/doors\.js(\?.*)?$/, "") : "core/doors/";
  var stamp = (/\?(b=[^&#]*)/.exec(src) || [])[1] || "";
  /* Из адреса сцене достаётся только то, что меняет её отступление. Адрес
     входа страница убирает из строки сразу (window.__sbEntry, index.html). */
  var hooks = String(window.__sbEntry || window.location.search || "").split(/[?&]/).filter(function (t) { return /^(nogl|glfail|glslow|glsoft)$/.test(t); });

  function kit(root, host) {
    var listeners = [], timers = [], urls = [], dead = false;
    var word = {
      value: "", focused: false, disabled: false, maxLength: 64, style: {}, on: {},
      addEventListener: function (t, f) { (word.on[t] || (word.on[t] = [])).push(f); },
      removeEventListener: function (t, f) { word.on[t] = (word.on[t] || []).filter(function (g) { return g !== f; }); },
      dispatchEvent: function (e) { (word.on[e.type] || []).slice().forEach(function (f) { f(e); }); return true; },
      focus: function () { /* фокус — у поля двери, сцена его не берёт */ },
      blur: function () { /* то же */ },
      setSelectionRange: function () { /* у сцены нет текста */ }
    };
    var k = {
      root: root,
      reduced: false,
      word: word,
      location: { hash: "", search: hooks.length ? "?" + hooks.join("&") : "" },
      asset: function (name) { return base + name + (stamp ? "?" + stamp : ""); },
      dead: function () { return dead; },
      on: function (target, type, fn, opts) {
        if (!target || !target.addEventListener) return;
        target.addEventListener(type, fn, opts);
        listeners.push([target, type, fn, opts]);
      },
      off: function (target, type, fn, opts) {
        if (!target || !target.removeEventListener) return;
        target.removeEventListener(type, fn, opts);
        listeners = listeners.filter(function (l) { return !(l[0] === target && l[1] === type && l[2] === fn); });
      },
      setTimeout: function (fn, ms) {
        var id = window.setTimeout(function () { if (!dead) fn(); }, ms);
        timers.push(id);
        if (timers.length > 400) timers.splice(0, 200);
        return id;
      },
      setInterval: function (fn, ms) {
        var id = window.setInterval(function () { if (!dead) fn(); }, ms);
        timers.push(-id - 1);
        return id;
      },
      requestAnimationFrame: function (fn) {
        return window.requestAnimationFrame(function (t) { if (!dead) fn(t); });
      },
      /* Картинка, нарисованная сценой, — адресом blob:, а не data:. Строка
         data: легла бы в атрибут style и раздула бы разметку двери на сотни
         килобайт (gate-weight-check). Адрес снимается вместе со сценой. */
      blobURL: function (canvas) {
        var d = canvas.toDataURL("image/png"), b = atob(d.slice(d.indexOf(",") + 1)), u = new Uint8Array(b.length);
        for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
        var url = URL.createObjectURL(new Blob([u], { type: "image/png" }));
        urls.push(url);
        return url;
      },
      mode: function (m) { if (!dead) host.setAttribute("data-mode", m); },
      /* Где у сцены линия слова (в точках экрана): по ней дверь ставит
         поле слова и свои детали (D-582). */
      line: function (y) {
        if (dead || typeof y !== "number" || !isFinite(y)) return;
        k.lineY = y;
        host.setAttribute("data-line", String(Math.round(y)));
        if (k.onLine) k.onLine(y);
      },
      /* ПОЛ СЦЕНЫ (D-583). Детали двери лежат на полу: оболочка называет
         место, которое им нужно (need: ширина, высота, нижний край), сцена
         ставит под него свою картину и отвечает, где верх деталей и в каком
         они масштабе. Свою проекцию и качество сцена объявляет — по ним
         tools/door-floor-check.mjs мерит то, что нарисовано на самом деле. */
      place: function (y, scale) {
        if (dead || typeof y !== "number" || !isFinite(y)) return;
        k.placeY = y; k.placeK = scale > 0 ? scale : 1;
        host.setAttribute("data-place", String(Math.round(y)));
        if (k.onLine) k.onLine(y);
      },
      proj: function (o) { if (!dead) host.setAttribute("data-proj", JSON.stringify(o)); },
      quality: function (q) { if (!dead) host.setAttribute("data-q", String(q)); },
      ready: function () { if (!dead) host.setAttribute("data-ready", "1"); },
      kill: function () {
        dead = true;
        listeners.forEach(function (l) { try { l[0].removeEventListener(l[1], l[2], l[3]); } catch (e) { /* слушатель уже снят */ } });
        listeners = [];
        timers.forEach(function (id) { if (id < 0) window.clearInterval(-id - 1); else window.clearTimeout(id); });
        timers = [];
        urls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) { /* адрес уже снят */ } });
        urls = [];
      }
    };
    return k;
  }

  function mountOne(name, host, opts) {
    var make = FACT[name];
    if (!make) return null;
    var root = document.createElement("div");
    root.className = "ds ds-" + name + (opts.reduced ? " rm" : "");
    host.appendChild(root);
    host.setAttribute("data-door", name);
    host.setAttribute("data-mode", name === "porog" ? "canvas" : "paint");
    host.removeAttribute("data-ready");
    var k = kit(root, host);
    k.reduced = !!opts.reduced;
    k.lineY = null;
    k.placeY = null; k.placeK = 1; k.need = opts.need || null;
    ["data-place", "data-proj", "data-q", "data-held"].forEach(function (a) { host.removeAttribute(a); });
    k.onLine = typeof opts.onLine === "function" ? opts.onLine : null;
    try {
      var api = make(root, k);
      if (!api) throw new Error("сцена " + name + " не построилась");
      alive++;
      return { name: name, api: api, kit: k, root: root };
    } catch (e) {
      k.kill();
      if (root.parentNode) root.parentNode.removeChild(root);
      if (window.console) console.error("[doors] " + name + ": " + (e && e.message));
      return null;
    }
  }

  function mount(host, opts) {
    opts = opts || {};
    var want = opts.door || pick();
    var order = [want].concat(ORDER.filter(function (n) { return n !== want; }));
    var got = null;
    for (var i = 0; i < order.length && !got; i++) got = mountOne(order[i], host, opts);
    if (!got) {
      ["data-door", "data-mode", "data-ready", "data-state"].forEach(function (a) { host.removeAttribute(a); });
      return null;
    }
    var typed = 0, state = "idle", calm = 0, gone = false;
    function setState(s) { state = s; host.setAttribute("data-state", s); }
    setState("idle");
    var h = {
      name: got.name,
      typing: function (n) {
        typed = Math.max(0, n | 0);
        if (!gone && got.api.typing) got.api.typing(typed);
      },
      focus: function (on) { if (!gone && got.api.focus) got.api.focus(!!on); },
      hold: function (on) { if (gone) return; host.setAttribute("data-held", on ? "1" : "0"); if (got.api.hold) got.api.hold(!!on); },
      line: function () { return gone ? null : got.kit.lineY; },
      need: function (n) { if (gone) return; got.kit.need = n; if (got.api.need) got.api.need(n); },
      place: function () { return gone || typeof got.kit.placeY !== "number" ? null : { y: got.kit.placeY, k: got.kit.placeK || 1 }; },
      wrong: function () {
        if (gone) return;
        typed = 0;
        setState("cold");
        if (got.api.wrong) got.api.wrong();
        window.clearTimeout(calm);
        /* Свет возвращается: у Собора холод держится полторы секунды и тает
           ещё полторы, у Порога — так же; при снятом движении — сразу. */
        calm = window.setTimeout(function () { if (!gone && state === "cold") setState("idle"); }, opts.reduced ? 1500 : 2600);
      },
      open: function (done) {
        var fired = false;
        function finish() {
          if (fired) return;
          fired = true;
          if (!gone) setState("open");
          if (done) done();
        }
        if (gone) { finish(); return; }
        window.clearTimeout(calm);
        setState("opening");
        /* Потолок: открытие сцены длится до трёх с половиной секунд; если
           сцена не сказала «доиграла» (вкладка спрятана, сцена упала), дверь
           всё равно уходит — сцена убранство, а не замок. */
        window.setTimeout(finish, 6000);
        try { if (got.api.open) got.api.open(finish); else finish(); } catch (e) { finish(); }
      },
      destroy: function () {
        if (gone) return;
        gone = true;
        window.clearTimeout(calm);
        try { if (got.api.destroy) got.api.destroy(); } catch (e) { if (window.console) console.error("[doors] destroy: " + (e && e.message)); }
        got.kit.kill();
        if (got.root.parentNode) got.root.parentNode.removeChild(got.root);
        alive = Math.max(0, alive - 1);
        if (current === h) current = null;
      },
      /* Что дверь говорит о сцене: имя, вид, состояние, ЧИСЛО знаков. */
      state: function () {
        return { door: got.name, mode: host.getAttribute("data-mode"), ready: host.getAttribute("data-ready") === "1", state: state, typed: typed, line: got.kit.lineY };
      }
    };
    current = h;
    hookBus();
    if (held) h.hold(true);
    return h;
  }

  function pick() { return choice && FACT[choice] ? choice : (FACT.sobor ? "sobor" : (FACT.porog ? "porog" : "sobor")); }

  /* Имя — «сцены», не «двери»: дверью в системе называется ячейка мира
     (тревожный пароль, v98), и two-doors-check не пускает это слово на
     window — по нему не должно читаться, какой мир открыт. */
  window.sbScenes = {
    names: ORDER.slice(),
    register: function (name, factory) { if (ORDER.indexOf(name) !== -1 && typeof factory === "function") FACT[name] = factory; },
    has: function (name) { return !!FACT[name]; },
    pick: pick,
    choose: function (name) { if (ORDER.indexOf(name) !== -1) choice = name; },
    mount: mount,
    current: function () { return current ? current.state() : null; },
    live: function () { return alive; }
  };
})();
