/*
 * seals.js — ЛИЦО КОНВЕРТА. Один источник для окна и для двери (D-216).
 *
 * ПОЧЕМУ ОТДЕЛЬНЫМ ФАЙЛОМ. Решётка конвертов родилась в окне «Замок» (D-214).
 * Когда её понадобилось поставить и за дверью, было два пути: переписать
 * рисование второй раз в оболочке — или вынести. Переписанное второй раз
 * расходится: одна решётка показывала бы одно, другая другое, и обе звались
 * бы «настоящими». Вынесено.
 *
 * ЧТО ЗДЕСЬ ЕСТЬ И ЧЕГО НЕТ. Есть чтение диска сырыми средствами и вывод
 * лица конверта из его байтов. НЕТ ключей, нет расшифровки, нет ничего, что
 * требовало бы открытого замка: за дверью, до пароля, система не знает о
 * своих записях ничего, кроме того, что они лежат и сколько их. Именно это и
 * рисуется.
 *
 * Охраняется tools/vault-window-check.mjs и tools/gate-truth-check.mjs.
 */
(function () {
  "use strict";

  var PREFIX = "sysbaby.v.";

  /* Сырое чтение: окно и дверь обязаны видеть ровно то, что увидел бы чужой
     с этим диском в руках, а не то, что система готова показать. */
  function rawGet(k) {
    try {
      var g = Object.getOwnPropertyDescriptor(Storage.prototype, "getItem").value;
      return g.call(window.localStorage, k);
    } catch (e) { return null; }
  }
  function names() {
    var out = [], i, k;
    try {
      var key = Object.getOwnPropertyDescriptor(Storage.prototype, "key").value;
      var len = Object.getOwnPropertyDescriptor(Storage.prototype, "length").get.call(window.localStorage);
      for (i = 0; i < len; i++) { k = key.call(window.localStorage, i); if (k && k.indexOf(PREFIX) === 0) out.push(k); }
    } catch (e) { /* ignore */ }
    return out.sort();
  }

  /* Одна и та же строка всегда даёт один и тот же рисунок, а изменение хотя
     бы одного знака меняет его целиком. Поэтому повернувшуюся плитку видно
     глазом — и это правда, а не эффект. */
  function hash32(s) {
    var h = 2166136261, i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function face(bytes) {
    var a = hash32(bytes), b = hash32(bytes + "·2"), c = hash32(bytes + "·3");
    var bits = (a ^ (b << 7)) >>> 0;
    /* биты отдаются наружу: холст рисует по ним же, что и разметка */
    var d = "", x, y, k = 0;
    for (y = 0; y < 4; y++) {
      for (x = 0; x < 4; x++) {
        if ((bits >>> k) & 1) d += "M" + (x * 6 + 1) + " " + (y * 6 + 1) + "h4v4h-4z";
        k++;
      }
    }
    return { d: d, bits: bits, hue: c % 360, tilt: (b % 4) * 90, glow: 0.22 + ((a >>> 9) % 60) / 220 };
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function cellHtml(name, seq, cls) {
    var f = face(String(rawGet(name) || ""));
    return '<button type="button" class="' + (cls || "vw-cell") + '" data-name="' + esc(name) + '"' +
      (seq ? ' data-turned="' + seq + '"' : '') +
      ' style="--h:' + f.hue + ';--g:' + f.glow.toFixed(3) + ';--t:' + f.tilt + 'deg;--d:' + ((hash32(name) % 90) / 10).toFixed(1) + 's"' +
      ' tabindex="-1" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24"><path d="' + f.d + '"/></svg></button>';
  }

  /* ── ПОЛЕ РИСУЕТСЯ НА ХОЛСТЕ, И ЭТО НЕ ВКУС, А ЗАМЕР (D-217) ───────────
     Первая редакция двери строила поле из настоящих узлов разметки. На
     тридцати двух конвертах это стоило 27 кадров в секунду, на тысяче — 15:
     вдвое. Совет сам назвал этот риск в отчёте и сам же пошёл его мерить, не
     дожидаясь, пока основатель упрётся в него на телефоне. Холст стоит одного
     узла вместо трёх тысяч.
     ЧТО НЕ ИЗМЕНИЛОСЬ: рисунок по-прежнему выведен из НАСТОЯЩИХ байтов
     конверта. Что именно нарисовано, объявляется наружу через plan() —
     закон сверяет список с диском, а пиксели с байтами. */
  var painters = [];

  function bodyOf(env) {
    /* Тело конверта: всё после версии. Это ещё НЕ шифротекст — внутри лежат
       номер, соль, подпись и точки между ними. */
    var s = String(env || "");
    var a = s.indexOf(".");
    return a < 0 ? s : s.slice(a + 1);
  }
  /* ── ШИФРОТЕКСТ, А НЕ КОНВЕРТ ЦЕЛИКОМ (D-218) ─────────────────────────
     Форма конверта — «2.<ctr>.<iv>.<ct>.<tag>» — одинакова у всех и никакой
     тайны не несёт; система говорит это вслух. Но если сравнивать со шумом
     конверт ВМЕСТЕ с точками и версией, сравниваешь не шифр, а разметку: три
     точки на семьсот знаков дают перекос сами по себе. Закон поймал это на
     первом же прогоне (4.87 против ожидаемой единицы) и был прав: предмет
     был выбран неверно. Предмет — вот это. */
  function cipherOf(env) {
    var parts = String(env || "").split(".");
    /* самая длинная часть и есть шифротекст: номер, соль и подпись коротки */
    var best = "";
    for (var i = 0; i < parts.length; i++) if (parts[i].length > best.length) best = parts[i];
    return best;
  }

  /* Рисуется СТРОКА, а не имя: одним и тем же кодом рисуются и настоящие
     конверты, и свежий шум. Иначе «отличите» было бы подстроено рисованием,
     а не свойством шифра. */
  function paintStrings(canvas, bodies, opts) {
    return paintInner(canvas, bodies, opts);
  }
  function paint(canvas, list, opts) {
    return paintInner(canvas, (list || []).map(function (n) { return bodyOf(rawGet(n)); }), opts);
  }
  function paintInner(canvas, bodies, opts) {
    if (!canvas || !canvas.getContext) return null;
    var o = opts || {};
    var ctx = canvas.getContext("2d", { alpha: true });
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    var list = bodies;
    var n = list.length;
    if (!n) { ctx.clearRect(0, 0, w, h); return { cols: 0, rows: 0, cell: 0 }; }
    /* Клетка выбирается так, чтобы всё поле поместилось целиком: показать
       часть и не сказать об этом — то же враньё, только тихое. */
    var cols = Math.max(1, Math.ceil(Math.sqrt(n * w / Math.max(1, h))));
    var rows = Math.ceil(n / cols);
    var cw = w / cols, ch = h / rows;
    var cell = Math.min(cw, ch);
    var t = o.phase || 0;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < n; i++) {
      var body = String(list[i] || "");
      var f = face(body);
      var cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch;
      /* Дыхание клетки выведено из её же байтов: поле шевелится не в такт,
         как шевелится всё живое, и ни одна клетка не ждёт другую. */
      var breath = 0.72 + 0.28 * Math.sin(t + (f.hue / 360) * 6.283);
      var pad = cell * 0.12;
      var side = Math.max(1, cell - pad * 2);
      var step = side / 4;
      ctx.fillStyle = "hsla(" + f.hue + ", 60%, 62%, " + (f.glow * breath * (o.alpha == null ? 1 : o.alpha)).toFixed(3) + ")";
      /* Шестнадцать клеток лица — шестнадцать бит, снятых с байтов конверта. */
      for (var k = 0; k < 16; k++) {
        if (!(f.bits >>> k & 1)) continue;
        var bx = cx + pad + (k % 4) * step;
        var by = cy + pad + Math.floor(k / 4) * step;
        ctx.fillRect(bx, by, Math.max(1, step * 0.82), Math.max(1, step * 0.82));
      }
    }
    return { cols: cols, rows: rows, cell: cell / dpr, count: n };
  }

  /* Ход поля: не больше двенадцати кадров в секунду и ни одного, пока
     вкладка спрятана. Дыхание — сообщение «диск жив», а не аттракцион. */
  function animate(canvas, getList, opts) {
    var stop = false, last = 0, phase = 0;
    var o = opts || {};
    function frame(now) {
      if (stop || !canvas.isConnected) return;
      /* Чем больше конвертов, тем реже кадр: дыхание поля замедляется, а
         машина остаётся свободной. Число выведено из замера, а не выбрано:
         на тысяче конвертов постоянный шаг стоил трети кадров. */
      var every = (o.every || 84) + Math.round(getList().length / 6);
      if (!document.hidden && now - last > every) {
        last = now;
        phase += 0.12;
        paint(canvas, getList(), { phase: phase, alpha: o.alpha });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    var handle = { stop: function () { stop = true; } };
    painters.push(handle);
    return handle;
  }

  window.sbSeals = {
    names: names,
    bytes: rawGet,
    face: face,
    cellHtml: cellHtml,
    gridHtml: function (cls) {
      return names().map(function (n) { return cellHtml(n, 0, cls); }).join("");
    },
    body: bodyOf,
    cipher: cipherOf,
    paint: paint,
    paintStrings: paintStrings,
    /* Свежий шум той же формы, что и настоящий конверт: те же длины, тот же
       алфавит. Сравнивать разное было бы подлогом. */
    noise: function (sizes) {
      return (sizes || []).map(function (len) {
        var b = new Uint8Array(Math.max(8, Math.ceil(len * 3 / 4)));
        window.crypto.getRandomValues(b);
        var bin = "", i;
        for (i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]);
        return window.btoa(bin).slice(0, len);
      });
    },
    animate: animate,
    /* Что именно нарисовано на холсте. Объявлено наружу, чтобы закон сверял
       список с диском, а не верил картинке на слово. */
    plan: function () { return names(); }
  };
})();
