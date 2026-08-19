/* =============================================================================
   SECTION 7 -- CLIENT CORE
   -----------------------------------------------------------------------------
   Pure functions only: no DOM, no globals beyond the single export, no config
   captured from the page (every map is passed in). This block is what the money
   on screen and on paper is made of, so it is kept separately loadable and is
   exercised straight from a node harness (tools/replay-golden.mjs).

   Rounding contract:
     screen  -> Intl et-EE, 2 digits: group separator U+00A0, decimal comma and
                minus sign U+2212 (which is NOT a JavaScript number sign, so a
                negative figure parses back as 0 -- deliberate, and tested)
     paper   -> either the displayed figure parsed back and re-fixed to 2 (the
                totals block, so paper matches screen exactly), or the raw float
                toFixed(2) (line rates, totals and group subtotals)
   ============================================================================= */
(function (root) {
  "use strict";

  var EUR = new Intl.NumberFormat("et-EE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /** Screen money: "1 234 567,89", "−62,00". */
  function formatEUR(value) {
    return EUR.format(Number(value) || 0);
  }

  /** Read a displayed figure back as a number. Negative displays yield 0. */
  function parseBack(text) {
    return parseFloat(String(text).replace(/\s/g, "").replace(",", ".")) || 0;
  }

  /** Paper money from a raw float. */
  function toFixed2(value) {
    return (Number(value) || 0).toFixed(2);
  }

  /** Quantities print as integers when whole, one decimal otherwise. */
  function fmtQty(qty) {
    var q = Number(qty) || 0;
    return q % 1 === 0 ? String(q) : q.toFixed(1);
  }

  /** Hours badge: one decimal, half up. */
  function hoursBadge(hours) {
    return Math.round((Number(hours) || 0) * 10) / 10;
  }

  /** Advance is capped at the grand total; the remainder is never negative. */
  function advanceSplit(grand, requested) {
    var total = Number(grand) || 0;
    var advance = Math.max(0, Math.min(Number(requested) || 0, total));
    return { advance: advance, remainder: Math.max(0, total - advance) };
  }

  /** Screen-only instalment preview. */
  function instalmentPlans(grand, months) {
    var total = Number(grand) || 0;
    return (months || [3, 6, 12]).map(function (m) {
      return { months: m, perMonth: total / m, display: formatEUR(total / m) };
    });
  }

  function mapGet(map, key) {
    if (!map || typeof map !== "object") return undefined;
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
  }

  /**
   * Line name, screen language -> document language.
   * A whole-name service match wins; otherwise the name is split on " - " and
   * each half goes through its own map, missing entries passing through.
   */
  function translateName(name, maps) {
    var text = String(name == null ? "" : name);
    var m = maps || {};
    var whole = mapGet(m.services, text);
    if (whole !== undefined) return whole;

    var parts = text.split(" - ");
    var head = mapGet(m.parts, parts[0]);
    head = head === undefined ? parts[0] : head;
    if (parts.length < 2) return head;
    var tail = mapGet(m.variants, parts[1]);
    tail = tail === undefined ? parts[1] : tail;
    return head + " - " + tail;
  }

  function translateSimple(value, map) {
    var text = String(value == null ? "" : value);
    var hit = mapGet(map, text);
    return hit === undefined ? text : hit;
  }

  /**
   * SEPA credit transfer payload, EPC069-12 version 002 (BIC optional).
   * Eleven lines joined by \n. Returns null when there is nothing to pay or no
   * account to pay it into -- a document must never carry a EUR 0.00 QR.
   */
  function sepaPayload(beneficiary, iban, amount, reference) {
    var account = String(iban == null ? "" : iban).replace(/\s/g, "");
    var sum = Number(amount) || 0;
    if (sum <= 0 || account === "") return null;
    return [
      "BCD",                                                   /* service tag   */
      "002",                                                   /* version       */
      "1",                                                     /* charset UTF-8 */
      "SCT",                                                   /* SEPA transfer */
      "",                                                      /* BIC           */
      String(beneficiary == null ? "" : beneficiary).slice(0, 70),
      account,
      "EUR" + sum.toFixed(2),
      "",                                                      /* purpose       */
      "",                                                      /* structured    */
      String(reference == null ? "" : reference).slice(0, 140)
    ].join("\n");
  }

  root.ENGINE_CORE = {
    formatEUR: formatEUR,
    parseBack: parseBack,
    toFixed2: toFixed2,
    fmtQty: fmtQty,
    hoursBadge: hoursBadge,
    advanceSplit: advanceSplit,
    instalmentPlans: instalmentPlans,
    translateName: translateName,
    translateCategory: translateSimple,
    translateUnit: translateSimple,
    sepaPayload: sepaPayload
  };
})(typeof window !== "undefined" ? window : globalThis);
/* =============================================================================
   SECTION 8 -- CLIENT APPLICATION
   -----------------------------------------------------------------------------
   Screen language is Russian, document language is Estonian; both are fixed
   engine chrome. Everything trade-specific arrives through ENGINE_CFG.
   Server-side persistence does not exist here: the form, the estimate number,
   the mini-CRM history and the theme live in localStorage, every access
   guarded so private mode degrades instead of throwing.
   ============================================================================= */
(function () {
  "use strict";

  var CORE = window.ENGINE_CORE;
  /* v22: the trade payload is assembled by render.js from config.js. PHP used
     to print it into an inline JSON block on the page; same keys, same values,
     one fewer language in the stack. */
  var CFG = window.ENGINE_CFG;

  var KEY_FORM = "sbcalc_form_state";
  var KEY_NO = "sbcalc_estimate_no";
  var KEY_HISTORY = "sbcalc_estimates_history";
  var KEY_THEME = "sbcalc_theme";
  var HISTORY_CAP = 200;

  /* Estonian document chrome. */
  var DOC = {
    offer:   { title: "Hinnapakkumine", file: "hinnapakkumine", noLabel: "Nr",      validity: "Pakkumine kehtib kuni" },
    invoice: { title: "Arve",           file: "arve",           noLabel: "Arve nr", validity: "Maksetähtaeg" },
    date: "Kuupäev:", klient: "Klient:", telefon: "Telefon:", epost: "E-post:",
    head: ["Tööde nimetus", "Kogus / ühik", "Hind, €", "Kokku, €"],
    empty: "Siia ilmuvad valitud tööd ja varuosad koos hindadega.",
    subtotal: "Vahesumma", discount: "Allahindlus", materials: "Materjalid", work: "Töö",
    vat: "Käibemaks", grand: "Kokku", advance: "Ettemaks", remainder: "Jääk tasumiseks",
    qrHead: "Kiirmakse pangarakendusega",
    qrText: "Skaneerige QR-kood oma panga mobiilirakendusega, et koheselt täita ülekande andmed (saaja, IBAN, summa {amount} €).",
    warrantyYes: "Garantii teostatud töödele: {n} kuud alates üleandmise kuupäevast.",
    warrantyNo: "Garantii käesolevatele töödele ei kohaldu.",
    note: CFG.docNote,
    signContractor: "Teostaja: ________________________",
    signClient: "Klient: ________________________",
    photos: "Kahjustuste fotofikseerimine",
    categoryFallback: "Tööd"
  };

  /* Russian screen chrome. */
  var UI = {
    categoryFallback: "Прочее",
    groupSubtotal: "Подытог",
    calcError: "Не удалось пересчитать смету. Проверьте соединение и попробуйте снова.",
    emptyCart: "Выберите позиции — расчёт появится здесь.",
    countBadge: "{n} поз.",
    itemSplit: "М: {m} € / Р: {w} €",
    historyEmpty: "Пока нет выгруженных смет. Они появятся здесь после экспорта в PDF.",
    historyOpen: "Открыть",
    historyDeleteConfirm: "Удалить эту смету из истории?",
    historyCarEmpty: "—",
    analyticsEmpty: "Недостаточно данных для статистики популярности.",
    analyticsCount: "Смет всего",
    analyticsRevenue: "Суммарный оборот",
    analyticsAvg: "Средний чек",
    analyticsMonth: "Оборот за этот месяц",
    resetConfirm: "Начать новую смету? Текущие данные будут очищены.",
    noItemsAlert: "Väljastamiseks tuleb valida vähemalt üks töö või osa.",
    noClientAlert: "Заполните имя клиента и телефон перед экспортом сметы.",
    copyDone: "✓ Скопировано",
    copyFailed: "Не удалось скопировать",
    saved: "✓ Смета сохранена локально",
    hotkeys: "⌨ Ctrl+S сохранить · Ctrl+P PDF · Ctrl+F поиск",
    popupBlocked: "⚠ Разрешите всплывающие окна, чтобы напечатать документ",
    searchHint: "Найдено карточек: {n}",
    themeDark: "🌙 Тёмная",
    themeLight: "☀️ Светлая",
    signEmpty: "Подпись не поставлена",
    signDone: "Подпись поставлена",
    installments: "Варианты рассрочки:",
    installmentRow: "{m} мес."
  };

  var C = CFG.company || {};
  var TR = { parts: CFG.tr.parts, variants: CFG.tr.variants, services: CFG.tr.services };

  /* --------------------------------------------------------------------- */
  /* small helpers                                                          */
  /* --------------------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function cval(key) { var v = C[key]; return v === undefined || v === null ? "" : v; }
  function fill(template, values) {
    return String(template).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(values, k) ? values[k] : m;
    });
  }
  function lsGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; }
    catch (e) { flashHint("⚠ Локальное хранилище недоступно — данные не сохранены"); return false; }
  }
  function lsRemove(key) { try { window.localStorage.removeItem(key); } catch (e) { /* nothing to remove */ } }
  function money(v) { return CORE.formatEUR(v) + " €"; }

  /* --------------------------------------------------------------------- */
  /* state                                                                  */
  /* --------------------------------------------------------------------- */
  var customItems = [];
  var photos = [];
  var lastCalc = null;
  var lastItems = [];
  var estimateNo = "";
  var hintTimer = null;

  /* --------------------------------------------------------------------- */
  /* identity, dates, timer                                                 */
  /* --------------------------------------------------------------------- */
  function newNumber() {
    var d = new Date();
    var stamp = String(d.getFullYear()) +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    return stamp + "-" + String(Math.floor(1000 + Math.random() * 9000));
  }
  function setNumber(no, persist) {
    estimateNo = no;
    $("estimateNo").textContent = "№ " + no;
    if (persist) lsSet(KEY_NO, no);
  }
  function stampDates() {
    var now = new Date();
    $("estimateDate").textContent = now.toLocaleDateString("ru-RU");
    var until = new Date(now.getTime() + (Number(CFG.validityDays) || 0) * 86400000);
    $("validUntil").textContent = until.toLocaleDateString("ru-RU");
  }
  function startTimer() {
    var started = Date.now();
    setInterval(function () {
      var s = Math.floor((Date.now() - started) / 1000);
      $("timer").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }, 1000);
  }

  /* --------------------------------------------------------------------- */
  /* recalculation loop                                                     */
  /* --------------------------------------------------------------------- */
  function collect() {
    var body = new URLSearchParams();
    body.set("ajax", "1");

    var discount = parseFloat($("discountPercent").value) || 0;
    body.set("discount_percent", String(Math.max(0, Math.min(100, discount))));
    body.set("custom_items", JSON.stringify(customItems));

    var paint = document.querySelector(".paint-radio:checked");
    body.set("paint_type", paint ? paint.value : "");

    all(".item-check").forEach(function (box) {
      if (!box.checked) return;
      var key = box.id.replace(/^item_/, "");
      body.set("item_" + key, "1");
      var price = $("price_" + key);
      body.set("price_" + key, price && price.value !== "" ? price.value : "0");
    });

    all(".svc-enable").forEach(function (box) {
      if (!box.checked) return;
      var key = box.id.replace(/^extra_/, "").replace(/_enable$/, "");
      body.set("extra_" + key + "_enable", "1");
      var hours = $("extra_" + key + "_hours");
      var price = $("extra_" + key + "_price");
      if (hours) body.set("extra_" + key + "_hours", hours.value);
      if (price) body.set("extra_" + key + "_price", price.value);
    });

    return body;
  }

  /* v22 — the round trip is gone. This used to POST the form to a PHP endpoint
     and wait for JSON; the money model now lives in engine.js and answers in
     the same tick. collect() is unchanged and still speaks the POST dialect
     ("1" for a ticked box, "0" for an empty price), because that dialect is
     exactly what the ported engine was verified against, vector for vector.
     The failure branch stays: a throw here means the engine is broken, and a
     broken engine must say so on the screen rather than leave yesterday's
     total standing. */
  function calc() {
    try {
      var post = {};
      collect().forEach(function (value, key) { post[key] = value; });
      var data = window.ENGINE.calculate(window.CASE_CONFIG, post).payload;
      if (!data || !data.items) throw new Error("malformed calculation result");
      lastCalc = data;
      lastItems = data.items;
      paint(data);
    } catch (err) {
      lastCalc = null;
      lastItems = [];
      $("itemsList").innerHTML = '<div class="empty-state">' + esc(UI.calcError) + "</div>";
      if (window.console) window.console.error("calc failed:", err);
    }
  }

  /* Every figure currently counting up, and what it is counting up TO.
     -------------------------------------------------------------------------
     The printed document takes its totals from the screen on purpose, so paper
     and screen can never disagree. That reasoning has a hole in it, found here
     in v22 while testing the browser build on a slow device: for the half
     second a figure is animating, the screen shows a number that is not the
     total. Press "Скачать документ" inside that window — entirely possible for
     a fast operator, and likelier the slower the device — and the customer
     receives a document with a mid-animation amount on it.

     So the animation now keeps a register of what it owes, and settle() pays
     it immediately. Every path to paper (document, clipboard, email) settles
     first. Paper still matches the screen — it just no longer matches it
     halfway through a count. */
  var pendingFigures = [];

  function settleFigures() {
    for (var i = 0; i < pendingFigures.length; i++) {
      var job = pendingFigures[i];
      job.el.textContent = CORE.formatEUR(job.target) + job.suffix;
      job.done = true;
    }
    pendingFigures = [];
  }

  function animate(el, to, suffix) {
    var from = CORE.parseBack(el.textContent);
    var startedAt = null;
    var target = Number(to) || 0;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = CORE.formatEUR(target) + suffix;
      return;
    }
    var job = { el: el, target: target, suffix: suffix, done: false };
    pendingFigures = pendingFigures.filter(function (x) { return x.el !== el; });
    pendingFigures.push(job);
    function step(ts) {
      if (job.done) return;                       /* settled early — do not fight it */
      if (startedAt === null) startedAt = ts;
      var p = Math.min(1, (ts - startedAt) / 500);
      el.textContent = CORE.formatEUR(from + (target - from) * p) + suffix;
      if (p < 1) { window.requestAnimationFrame(step); return; }
      el.textContent = CORE.formatEUR(target) + suffix;   /* exact value wins */
      job.done = true;
      pendingFigures = pendingFigures.filter(function (x) { return x !== job; });
    }
    window.requestAnimationFrame(step);
  }

  function paint(data) {
    var has = data.items.length > 0;
    ["btnExport", "btnEmail", "btnCopy"].forEach(function (id) { $(id).disabled = !has; });

    var badge = $("countBadge");
    badge.hidden = !has;
    badge.textContent = fill(UI.countBadge, { n: data.items.length });

    /* grouped list, groups in first-appearance order */
    var order = [];
    var groups = {};
    data.items.forEach(function (item) {
      var key = item.category || UI.categoryFallback;
      if (!groups[key]) { groups[key] = []; order.push(key); }
      groups[key].push(item);
    });

    var html = "";
    order.forEach(function (key) {
      var sum = 0;
      html += '<div class="group-head">' + esc(key) + "</div>";
      groups[key].forEach(function (item) {
        sum += Number(item.total) || 0;
        var hours = item.hours !== undefined ? " <small>" + CORE.hoursBadge(item.hours) + " ч</small>" : "";
        html += '<div class="line"><span>' + esc(item.name) + hours + '</span><span class="split">' +
          esc(fill(UI.itemSplit, { m: CORE.formatEUR(item.material), w: CORE.formatEUR(item.work) })) +
          "</span></div>";
      });
      html += '<div class="group-sub"><span>' + esc(UI.groupSubtotal) + "</span><span>" + esc(money(sum)) + "</span></div>";
    });
    $("itemsList").innerHTML = html || '<div class="empty-state">' + esc(UI.emptyCart) + "</div>";

    animate($("sumMaterial"), data.material, " €");
    animate($("sumWork"), data.work, " €");
    animate($("sumVat"), data.vat, " €");
    animate($("sumTotal"), data.grand, " €");

    var hoursRow = $("hoursRow");
    hoursRow.hidden = !(Number(data.hours) > 0);
    var hoursText = CORE.hoursBadge(data.hours) + " " + CFG.unitHour;
    if ($("sumHours").textContent !== hoursText) {
      $("sumHours").textContent = hoursText;
      hoursRow.classList.add("flash");
      window.setTimeout(function () { hoursRow.classList.remove("flash"); }, 200);
    }

    $("bigTotal").textContent = CORE.formatEUR(data.grand) + " €";
    /* та же сумма, второй раз — для таблетки на телефоне. Одно вычисление, два
       места показа: разойтись они не могут даже теоретически. */
    if ($("mobileTotalValue")) $("mobileTotalValue").textContent = CORE.formatEUR(data.grand) + " €";

    var showDiscount = Number(data.discount) > 0.005;
    $("discountRow").hidden = !showDiscount;
    if (showDiscount) $("discountValue").textContent = money(data.discount);

    refreshAdvance();
    refreshInstalments();
  }

  function refreshAdvance() {
    var row = $("advanceRow");
    var requested = parseFloat($("advanceAmount").value) || 0;
    if (!lastCalc || requested <= 0) { row.hidden = true; return; }
    var split = CORE.advanceSplit(lastCalc.grand, requested);
    row.hidden = false;
    $("advanceValue").textContent = money(split.advance);
    $("remainderValue").textContent = money(split.remainder);
  }

  function refreshInstalments() {
    var box = $("instalments");
    var grand = lastCalc ? Number(lastCalc.grand) || 0 : 0;
    if ($("paymentMethod").value !== "installments" || grand <= 0) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = "<div><strong>" + esc(UI.installments) + "</strong></div>" +
      CORE.instalmentPlans(grand).map(function (plan) {
        return "<div><span>" + esc(fill(UI.installmentRow, { m: plan.months })) + "</span><span>" +
          esc(plan.display + " €/мес.") + "</span></div>";
      }).join("");
  }

  /* --------------------------------------------------------------------- */
  /* custom items                                                           */
  /* --------------------------------------------------------------------- */
  function renderCustom() {
    $("customList").innerHTML = customItems.map(function (item, index) {
      return "<li><span>" + esc(item.name) + " — " + CORE.fmtQty(item.qty) + " × " +
        esc(CORE.formatEUR(item.price)) + " €</span>" +
        '<button type="button" class="icon-x" data-custom="' + index + '" title="Удалить">✕</button></li>';
    }).join("");
  }
  function addCustom() {
    var nameEl = $("customName");
    var priceEl = $("customPrice");
    var name = nameEl.value.trim();
    var price = parseFloat(priceEl.value) || 0;
    if (!name) { nameEl.focus(); return; }
    if (price <= 0) { priceEl.focus(); return; }
    var qty = parseFloat($("customQty").value) || 1;
    customItems.push({ name: name, qty: qty, price: price });
    nameEl.value = "";
    priceEl.value = "";
    $("customQty").value = "1";
    nameEl.focus();
    renderCustom();
    save();
    calc();
  }

  /* --------------------------------------------------------------------- */
  /* photos                                                                 */
  /* --------------------------------------------------------------------- */
  function renderPhotos() {
    $("photoGallery").innerHTML = photos.map(function (src, index) {
      return '<div class="photo-thumb"><img src="' + esc(src) + '" alt="">' +
        '<button type="button" data-photo="' + index + '" title="Удалить">✕</button></div>';
    }).join("");
  }
  function downscale(file) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onload = function () {
        var original = String(reader.result);
        var img = new Image();
        img.onload = function () {
          try {
            var scale = Math.min(1, 1100 / Math.max(img.width, img.height));
            var canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          } catch (e) { resolve(original); }
        };
        img.onerror = function () { resolve(original); };
        img.src = original;
      };
      reader.onerror = function () { resolve(null); };
      reader.readAsDataURL(file);
    });
  }
  function acceptPhotos(files) {
    var queue = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); });
    queue = queue.slice(0, Math.max(0, CFG.photoLimit - photos.length));
    Promise.all(queue.map(downscale)).then(function (results) {
      results.forEach(function (src) { if (src) photos.push(src); });
      renderPhotos();
    });
    $("photoInput").value = "";
  }

  /* --------------------------------------------------------------------- */
  /* signature pad                                                          */
  /* --------------------------------------------------------------------- */
  var signature = (function () {
    var canvas = $("sigPad");
    var ctx = canvas.getContext("2d");
    var drawing = false;
    var used = false;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#00c2ff";

    function point(event) {
      var box = canvas.getBoundingClientRect();
      var source = event.touches ? event.touches[0] : event;
      return {
        x: (source.clientX - box.left) * (canvas.width / box.width),
        y: (source.clientY - box.top) * (canvas.height / box.height)
      };
    }
    function begin(event) {
      drawing = true;
      var p = point(event);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      if (!used) {
        used = true;
        $("sigStatus").textContent = UI.signDone;
        $("sigStatus").classList.add("signed");
      }
    }
    function move(event) {
      if (!drawing) return;
      var p = point(event);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    function end() { drawing = false; }

    canvas.addEventListener("mousedown", begin);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", function (e) { e.preventDefault(); begin(e); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); move(e); }, { passive: false });
    canvas.addEventListener("touchend", end);

    return {
      clear: function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        used = false;
        $("sigStatus").textContent = UI.signEmpty;
        $("sigStatus").classList.remove("signed");
      },
      dataUrl: function () { return used ? canvas.toDataURL("image/png") : null; }
    };
  })();

  /* --------------------------------------------------------------------- */
  /* autosave / restore / reset                                             */
  /* --------------------------------------------------------------------- */
  function snapshot() {
    var state = { items: {}, extras: {}, meta: {} };
    all(".item-check").forEach(function (box) {
      var key = box.id.replace(/^item_/, "");
      var price = $("price_" + key);
      state.items[key] = { checked: box.checked, price: price ? price.value : "" };
    });
    all(".svc-enable").forEach(function (box) {
      var key = box.id.replace(/^extra_/, "").replace(/_enable$/, "");
      var hours = $("extra_" + key + "_hours");
      var price = $("extra_" + key + "_price");
      var entry = { checked: box.checked };
      if (hours) entry.hours = hours.value;
      if (price) entry.price = price.value;
      state.extras[key] = entry;
    });
    all(".meta").forEach(function (el) { state.meta[el.id] = el.value; });
    var paint = document.querySelector(".paint-radio:checked");
    state.discountPercent = $("discountPercent").value;
    state.advanceAmount = $("advanceAmount").value;
    state.paymentMethod = $("paymentMethod").value;
    state.paintType = paint ? paint.value : "";
    state.customItems = customItems;
    state.warrantyMonths = $("warrantyMonths").value;
    return state;
  }

  function save() { lsSet(KEY_FORM, JSON.stringify(snapshot())); }

  function apply(state) {
    if (!state) return;
    Object.keys(state.items || {}).forEach(function (key) {
      var box = $("item_" + key);
      if (!box) return;
      box.checked = !!state.items[key].checked;
      var price = $("price_" + key);
      if (price && state.items[key].price) price.value = state.items[key].price;
    });
    Object.keys(state.extras || {}).forEach(function (key) {
      var box = $("extra_" + key + "_enable");
      if (!box) return;
      box.checked = !!state.extras[key].checked;
      var hours = $("extra_" + key + "_hours");
      var price = $("extra_" + key + "_price");
      if (hours && state.extras[key].hours) hours.value = state.extras[key].hours;
      if (price && state.extras[key].price) price.value = state.extras[key].price;
    });
    Object.keys(state.meta || {}).forEach(function (id) {
      var el = $(id);
      if (el) el.value = state.meta[id];
    });
    if (state.discountPercent) $("discountPercent").value = state.discountPercent;
    if (state.advanceAmount) $("advanceAmount").value = state.advanceAmount;
    if (state.paymentMethod) $("paymentMethod").value = state.paymentMethod;
    if (state.warrantyMonths) $("warrantyMonths").value = state.warrantyMonths;
    if (state.paintType) {
      var radio = document.querySelector('.paint-radio[value="' + state.paintType + '"]');
      if (radio) { radio.checked = true; }
    }
    markPaint();
    customItems = Array.isArray(state.customItems) ? state.customItems : [];
    renderCustom();
  }

  function resetForm(keepHistory) {
    all(".item-check").forEach(function (box) { box.checked = false; });
    all(".item-price").forEach(function (el) { el.value = ""; });
    all(".svc-enable").forEach(function (box) { box.checked = false; });
    all(".num").forEach(function (el) { el.value = ""; });
    all(".meta").forEach(function (el) { if (el.tagName !== "SELECT") el.value = ""; });
    $("docType").value = "offer";
    $("discountPercent").value = "";
    $("advanceAmount").value = "";
    $("paymentMethod").value = "";
    $("warrantyMonths").value = "12";
    all(".paint-radio").forEach(function (radio) { radio.checked = false; });
    markPaint();
    customItems = [];
    photos = [];
    renderCustom();
    renderPhotos();
    signature.clear();
    $("search").value = "";
    filterCards();
    if (!keepHistory) { /* history survives every reset by design */ }
  }

  /* --------------------------------------------------------------------- */
  /* history (mini-CRM) and analytics                                       */
  /* --------------------------------------------------------------------- */
  function historyRead() {
    try { return JSON.parse(lsGet(KEY_HISTORY) || "[]") || []; } catch (e) { return []; }
  }
  function historyWrite(list) { lsSet(KEY_HISTORY, JSON.stringify(list.slice(0, HISTORY_CAP))); }

  function historyUpsert(entry) {
    var list = historyRead().filter(function (row) { return row.no !== entry.no; });
    list.unshift(entry);
    historyWrite(list);
  }

  function renderHistory() {
    var list = historyRead();
    $("historyCount").textContent = String(list.length);
    $("historyRevenue").textContent = money(list.reduce(function (sum, row) { return sum + (Number(row.total) || 0); }, 0));
    $("historyList").innerHTML = list.length === 0
      ? '<div class="empty-state">' + esc(UI.historyEmpty) + "</div>"
      : list.map(function (row, index) {
          return '<div class="history-row"><div><div>' + esc(row.no) + " · " + esc(row.date) + "</div>" +
            '<div class="who">' + esc(row.client || UI.historyCarEmpty) + " · " + esc(row.docTypeLabel || "") + "</div>" +
            '<div class="who">' + esc(row.car || UI.historyCarEmpty) + " · " + esc(row.plate || "") + "</div></div>" +
            '<div class="sum">' + esc(money(row.total)) + "</div>" +
            '<div><button type="button" class="linkish" data-open="' + index + '">' + esc(UI.historyOpen) + "</button> " +
            '<button type="button" class="icon-x" data-drop="' + index + '">✕</button></div></div>';
        }).join("");
  }

  function openHistoryEntry(index) {
    var row = historyRead()[index];
    if (!row) return;
    resetForm(true);
    apply(row.state);
    setNumber(row.no, true);
    save();
    calc();
    closeModal("historyModal");
  }

  function renderAnalytics() {
    var list = historyRead();
    var revenue = list.reduce(function (sum, row) { return sum + (Number(row.total) || 0); }, 0);
    var now = new Date();
    var monthly = list.reduce(function (sum, row) {
      var date = String(row.date || "").split(",")[0].trim().split(".");
      if (date.length < 3) return sum;
      if (Number(date[1]) === now.getMonth() + 1 && Number(date[2]) === now.getFullYear()) {
        return sum + (Number(row.total) || 0);
      }
      return sum;
    }, 0);

    $("analyticsCards").innerHTML = [
      [UI.analyticsCount, String(list.length)],
      [UI.analyticsRevenue, money(revenue)],
      [UI.analyticsAvg, money(list.length ? revenue / list.length : 0)],
      [UI.analyticsMonth, money(monthly)]
    ].map(function (card) {
      return '<div><span class="stat-label">' + esc(card[0]) + '</span><span class="stat-value">' + esc(card[1]) + "</span></div>";
    }).join("");

    var counts = {};
    list.forEach(function (row) {
      var state = row.state || {};
      Object.keys(state.items || {}).forEach(function (key) {
        if (state.items[key] && state.items[key].checked) counts[key] = (counts[key] || 0) + 1;
      });
      Object.keys(state.extras || {}).forEach(function (key) {
        if (state.extras[key] && state.extras[key].checked) {
          counts["extra:" + key] = (counts["extra:" + key] || 0) + 1;
        }
      });
    });
    var top = Object.keys(counts).map(function (key) { return { key: key, n: counts[key] }; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, 8);
    var max = top.length ? top[0].n : 0;

    $("analyticsTop").innerHTML = top.length === 0
      ? '<div class="empty-state">' + esc(UI.analyticsEmpty) + "</div>"
      : top.map(function (row) {
          return '<div class="bar-row"><span class="key">' + esc(row.key.replace(/^extra:/, "")) + "</span>" +
            '<span class="bar" style="width:' + (max ? (row.n / max) * 55 : 0) + '%"></span><span>' + row.n + "</span></div>";
        }).join("");
  }

  function openModal(id) { $(id).hidden = false; }
  function closeModal(id) { $(id).hidden = true; }

  /* --------------------------------------------------------------------- */
  /* search / filter                                                        */
  /* --------------------------------------------------------------------- */
  function filterCards() {
    var query = $("search").value.trim().toLowerCase();
    var found = 0;
    all(".container .card").forEach(function (card) {
      if (card.classList.contains("no-filter")) return;
      var hit = query === "" || card.textContent.toLowerCase().indexOf(query) !== -1;
      card.hidden = !hit;
      if (hit) found++;
    });
    all(".section-title").forEach(function (title) {
      var node = title.nextElementSibling;
      var visible = false;
      while (node && !node.classList.contains("section-title")) {
        if (node.classList.contains("card") && !node.hidden) { visible = true; break; }
        node = node.nextElementSibling;
      }
      title.hidden = !visible;
    });
    $("searchHint").textContent = query === "" ? "" : fill(UI.searchHint, { n: found });
  }

  /* --------------------------------------------------------------------- */
  /* theme, hint pill, hotkeys                                              */
  /* --------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeToggle").innerHTML = theme === "dark" ? UI.themeDark : UI.themeLight;
  }
  /* У телефона нет клавиши Ctrl. Пилюля «⌨ Ctrl+S · Ctrl+P · Ctrl+F» —
     легенда для клавиатуры; на сенсорном экране она стоит поверх формы и
     обещает то, чего там нет. Пилюля остаётся — но выполняет вторую свою
     работу, уведомление, и висит, только пока ей есть что сказать. */
  var TOUCH = !!(window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches);

  function flashHint(text) {
    var pill = $("hotkeyHint");
    pill.textContent = text;
    pill.hidden = false;
    if (hintTimer) window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(function () {
      pill.textContent = UI.hotkeys;
      pill.hidden = TOUCH;
    }, 1800);
  }

  /* Таблетка с итогом: то же число, что в панели, и дорога к ней. Пока панель
     на экране — таблетка не нужна и уходит, чтобы не закрывать её кнопки. */
  function wireTotalChip() {
    var chip = $("mobileTotal");
    var panel = document.querySelector(".panel");
    if (!chip || !panel) return;
    chip.addEventListener("click", function () {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (typeof window.IntersectionObserver !== "function") return;
    new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { chip.hidden = entry.isIntersecting; });
    }, { threshold: 0.06 }).observe(panel);
  }
  function markPaint() {
    all(".paint-option").forEach(function (option) {
      var radio = option.querySelector(".paint-radio");
      option.classList.toggle("on", !!(radio && radio.checked));
    });
  }

  /* --------------------------------------------------------------------- */
  /* plain-text summary (clipboard + mailto)                                */
  /* --------------------------------------------------------------------- */
  function displayedTotals() {
    settleFigures();          /* never read a figure that is still counting */
    return {
      m: CORE.parseBack($("sumMaterial").textContent),
      w: CORE.parseBack($("sumWork").textContent),
      v: CORE.parseBack($("sumVat").textContent),
      t: CORE.parseBack($("sumTotal").textContent)
    };
  }

  function summaryText() {
    var d = displayedTotals();
    var lines = [
      "Смета № " + estimateNo,
      "Клиент: " + ($("clientName").value || "—"),
      CFG.subjectLabels.summary + ": " + ($("subjectPrimary").value || "—") + " (" + ($("subjectSecondary").value || "—") + ")",
      ""
    ];
    lastItems.forEach(function (item) {
      lines.push("- " + item.name + " — " + CORE.fmtQty(item.qty) + " " + item.unit + " × " +
        CORE.toFixed2(item.rate) + " € = " + CORE.toFixed2(item.total) + " €");
    });
    lines.push("");
    lines.push("Материал: " + CORE.toFixed2(d.m) + " €");
    lines.push("Работа: " + CORE.toFixed2(d.w) + " €");
    lines.push("KM " + CFG.vatLabel + "%: " + CORE.toFixed2(d.v) + " €");
    lines.push("Итого: " + CORE.toFixed2(d.t) + " €");
    return lines.join("\n");
  }

  function copySummary() {
    var button = $("btnCopy");
    var original = button.textContent;
    var text = summaryText();
    function done(ok) {
      button.textContent = ok ? UI.copyDone : UI.copyFailed;
      window.setTimeout(function () { button.textContent = original; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(legacyCopy(text)); });
      return;
    }
    done(legacyCopy(text));
  }
  function legacyCopy(text) {
    try {
      var area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch (e) { return false; }
  }

  /* --------------------------------------------------------------------- */
  /* document flow                                                          */
  /* --------------------------------------------------------------------- */
  function qrDataUrl(payload) {
    if (!payload || !window.SBQR) return null;
    try {
      /* v22 — our own encoder (qr.js), same error-correction level M the
         library used, same 200px canvas the document expects. It returns null
         when the payload will not fit, and null here means the document
         prints no payment block at all: an unreadable payment code is worse
         than a document without one. */
      var canvas = window.SBQR.toCanvas(payload, 200);
      return canvas ? canvas.toDataURL("image/png") : null;
    } catch (e) {
      if (window.console) window.console.warn("QR generation skipped:", e);
      return null;
    }
  }

  function buildDocument(ctx) {
    var rows = "";
    if (ctx.items.length === 0) {
      rows = '<tr><td colspan="4" class="empty">' + esc(DOC.empty) + "</td></tr>";
    } else {
      var order = [];
      var groups = {};
      ctx.items.forEach(function (item) {
        var key = item.category || DOC.categoryFallback;
        if (!groups[key]) { groups[key] = []; order.push(key); }
        groups[key].push(item);
      });
      order.forEach(function (key) {
        var sum = 0;
        rows += '<tr class="cat"><td colspan="4">' + esc(CORE.translateCategory(key, CFG.tr.categories)) + "</td></tr>";
        groups[key].forEach(function (item) {
          sum += Number(item.total) || 0;
          rows += "<tr><td>" + esc(CORE.translateName(item.name, TR)) + "</td>" +
            '<td class="c">' + esc(CORE.fmtQty(item.qty) + " " + CORE.translateUnit(item.unit, CFG.tr.units)) + "</td>" +
            '<td class="c">' + esc(CORE.toFixed2(item.rate)) + "</td>" +
            '<td class="r">' + esc(CORE.toFixed2(item.total)) + "</td></tr>";
        });
        rows += '<tr class="sub"><td colspan="4">' + esc(DOC.subtotal + " " + CORE.toFixed2(sum) + " €") + "</td></tr>";
      });
    }

    var totals = "";
    if (ctx.discount > 0.005) {
      totals += '<div class="t-row"><span>' + esc(DOC.subtotal) + "</span><span>" + esc(CORE.toFixed2(ctx.subtotal)) + " €</span></div>";
      totals += '<div class="t-row"><span>' + esc(DOC.discount + " " + ctx.discountPercent + "%") + "</span><span>−" +
        esc(CORE.toFixed2(ctx.discount)) + " €</span></div>";
    }
    totals += '<div class="t-row"><span>' + esc(DOC.materials) + "</span><span>" + esc(CORE.toFixed2(ctx.m)) + " €</span></div>";
    totals += '<div class="t-row"><span>' + esc(DOC.work) + "</span><span>" + esc(CORE.toFixed2(ctx.w)) + " €</span></div>";
    totals += '<div class="t-row"><span>' + esc(DOC.vat + " " + CFG.vatLabel + "%") + "</span><span>" + esc(CORE.toFixed2(ctx.v)) + " €</span></div>";
    totals += '<div class="t-row grand"><span>' + esc(DOC.grand) + "</span><span>" + esc(CORE.toFixed2(ctx.t)) + " €</span></div>";
    if (ctx.advance > 0.005) {
      totals += '<div class="t-row"><span>' + esc(DOC.advance) + "</span><span>" + esc(CORE.toFixed2(ctx.advance)) + " €</span></div>";
      totals += '<div class="t-row"><span>' + esc(DOC.remainder) + "</span><span>" + esc(CORE.toFixed2(ctx.remainder)) + " €</span></div>";
    }

    var references = ctx.references.map(function (ref) {
      return "<div><b>" + esc(ref.label) + ":</b> " + esc(ref.value) + "</div>";
    }).join("");

    var qrBlock = ctx.qr
      ? '<div class="qr"><img src="' + esc(ctx.qr) + '" width="86" height="86" alt=""><div><b>' + esc(DOC.qrHead) + "</b><br>" +
        esc(fill(DOC.qrText, { amount: CORE.toFixed2(ctx.qrAmount) })) + "</div></div>"
      : "";

    var photoBlock = ctx.photos.length === 0 ? "" :
      '<div class="appendix"><h2>' + esc(DOC.photos) + '</h2><div class="shots">' +
      ctx.photos.map(function (src) { return '<img src="' + esc(src) + '" alt="">'; }).join("") + "</div></div>";

    return "<!DOCTYPE html><html lang=\"et\"><head><meta charset=\"UTF-8\"><title>" +
      esc(ctx.docTitle + " nr " + ctx.no + " — " + cval("name")) + "</title><style>" +
      "@page{size:A4;margin:22mm 16mm}" +
      "body{font:12px Verdana,Arial,sans-serif;color:#1a1a1a;margin:0}" +
      ".band{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #1a1a1a;padding-bottom:10px}" +
      ".band h1{font-size:22px;margin:0 0 4px;text-align:right}.band .meta{text-align:right;font-size:11px}" +
      ".company{color:#666;font-size:10px;margin:8px 0 18px;line-height:1.6}" +
      ".client{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:11.5px;margin-bottom:14px}" +
      ".refs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:#f2f2f2;border-radius:6px;padding:10px 12px;font-size:11px;margin-bottom:14px}" +
      "table{width:100%;border-collapse:collapse;font-size:11.5px}" +
      "thead th{text-transform:uppercase;font-size:10px;letter-spacing:.6px;text-align:left;border-bottom:2px solid #1a1a1a;padding:6px 4px}" +
      "thead th:nth-child(2),thead th:nth-child(3){text-align:center}thead th:last-child{text-align:right}" +
      "td{border-bottom:1px solid #ddd;padding:6px 4px}td.c{text-align:center}td.r{text-align:right}" +
      "tr.cat td{font-weight:bold;border-bottom:none;padding-top:12px}" +
      "tr.sub td{text-align:right;font-style:italic;color:#666;border-bottom:none}" +
      "td.empty{color:#777;text-align:center;padding:20px 4px}" +
      ".totals{width:260px;margin-left:auto;margin-top:16px;font-size:12px}" +
      ".t-row{display:flex;justify-content:space-between;padding:3px 0}" +
      ".t-row.grand{font-size:19px;font-weight:bold;border-top:2px solid #1a1a1a;margin-top:6px;padding-top:8px}" +
      ".qr{display:flex;gap:14px;align-items:center;border-top:1px dashed #999;margin-top:20px;padding-top:14px;font-size:11px}" +
      ".validity{font-weight:bold;margin-top:18px}.warranty{margin-top:8px;font-size:11.5px}" +
      ".note{color:#666;font-style:italic;font-size:10.5px;margin-top:12px;line-height:1.6}" +
      ".sign{display:flex;justify-content:space-between;margin-top:42px;font-size:11.5px}" +
      ".sign div{width:45%;position:relative}.sign img{max-height:60px;display:block;margin-bottom:-14px}" +
      ".foot{margin-top:34px;border-top:1px solid #ccc;padding-top:8px;text-align:center;color:#777;font-size:10px}" +
      ".appendix{page-break-before:always;padding-top:10px}" +
      ".shots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
      ".shots img{width:100%;height:150px;object-fit:cover}" +
      "</style></head><body>" +
      '<div class="band"><img src="" alt=""><div><h1>' + esc(ctx.docTitle) + "</h1>" +
      '<div class="meta">' + esc(ctx.noLabel + " " + ctx.no) + "<br>" + esc(DOC.date + " " + ctx.date) + "</div></div></div>" +
      '<div class="company">' + esc(cval("name")) + "&nbsp;·&nbsp;Reg-kood: " + esc(cval("reg_nr")) +
      "&nbsp;·&nbsp;KMKR: " + esc(cval("vat_nr")) + "<br>" + esc(cval("address")) +
      "&nbsp;·&nbsp;Tel: " + esc(cval("phone")) + "&nbsp;·&nbsp;" + esc(cval("email")) +
      "&nbsp;·&nbsp;IBAN: " + esc(cval("iban")) + "</div>" +
      '<div class="client">' +
      "<div><b>" + esc(DOC.klient) + "</b> " + esc(ctx.client) + "</div>" +
      "<div><b>" + esc(DOC.telefon) + "</b> " + esc(ctx.phone) + "</div>" +
      "<div><b>" + esc(DOC.epost) + "</b> " + esc(ctx.email) + "</div>" +
      "<div><b>" + esc(CFG.subjectLabels.docPrimary) + ":</b> " + esc(ctx.subjectPrimary) + "</div>" +
      "<div><b>" + esc(CFG.subjectLabels.docSecondary) + ":</b> " + esc(ctx.subjectSecondary) + "</div>" +
      "</div>" +
      (references ? '<div class="refs">' + references + "</div>" : "") +
      "<table><thead><tr><th>" + DOC.head.map(esc).join("</th><th>") + "</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      '<div class="totals">' + totals + "</div>" +
      qrBlock +
      '<div class="validity">' + esc(ctx.validityLabel + " " + ctx.validUntil) + "</div>" +
      '<div class="warranty">' + esc(ctx.warranty > 0 ? fill(DOC.warrantyYes, { n: ctx.warranty }) : DOC.warrantyNo) + "</div>" +
      '<div class="note">' + esc(DOC.note) + "</div>" +
      '<div class="sign"><div>' + esc(DOC.signContractor) + "</div><div>" +
      (ctx.signature ? '<img src="' + esc(ctx.signature) + '" alt="">' : "") + esc(DOC.signClient) + "</div></div>" +
      '<div class="foot">' + esc(cval("name")) + "&nbsp;·&nbsp;" + esc(cval("address")) +
      "&nbsp;·&nbsp;" + esc(cval("phone")) + "&nbsp;·&nbsp;" + esc(cval("email")) + "</div>" +
      photoBlock +
      "</body></html>";
  }

  function exportDocument() {
    if (lastItems.length === 0) { window.alert(UI.noItemsAlert); return; }
    if (!$("clientName").value.trim() || !$("clientPhone").value.trim()) { window.alert(UI.noClientAlert); return; }

    var type = $("docType").value === "invoice" ? DOC.invoice : DOC.offer;
    var d = displayedTotals();
    var split = CORE.advanceSplit(d.t, parseFloat($("advanceAmount").value) || 0);
    var now = new Date();
    var ctx = {
      items: lastItems,
      docTitle: type.title,
      noLabel: type.noLabel,
      validityLabel: type.validity,
      no: estimateNo,
      date: now.toLocaleDateString("et-EE"),
      validUntil: new Date(now.getTime() + (Number(cval("estimate_validity_days")) || 0) * 86400000).toLocaleDateString("et-EE"),
      client: $("clientName").value,
      phone: $("clientPhone").value,
      email: $("clientEmail").value,
      subjectPrimary: $("subjectPrimary").value,
      subjectSecondary: $("subjectSecondary").value,
      references: CFG.referenceFields.map(function (field) {
        var el = $("ref_" + field.id);
        return { label: field.docLabel, value: el ? el.value : "" };
      }).filter(function (ref) { return String(ref.value).trim() !== ""; }),
      m: d.m, w: d.w, v: d.v, t: d.t,
      subtotal: lastCalc ? lastCalc.subtotal : 0,
      discount: lastCalc ? lastCalc.discount : 0,
      discountPercent: lastCalc ? lastCalc.discount_percent : 0,
      advance: split.advance,
      remainder: split.remainder,
      warranty: parseInt($("warrantyMonths").value, 10) || 0,
      signature: signature.dataUrl(),
      photos: photos,
      qr: null,
      qrAmount: split.advance > 0.005 ? split.remainder : d.t
    };
    ctx.qr = qrDataUrl(CORE.sepaPayload(cval("name"), cval("iban"), ctx.qrAmount, type.title + " " + estimateNo));

    /* the mini-CRM entry is written before printing, so a cancelled print
       dialog still leaves the estimate in the history */
    historyUpsert({
      no: estimateNo,
      date: now.toLocaleString("ru-RU"),
      client: $("clientName").value,
      car: $("subjectPrimary").value,
      plate: $("subjectSecondary").value,
      total: d.t,
      docTypeLabel: type.title,
      state: snapshot()
    });

    var win = window.open("", "_blank");
    if (!win) { flashHint(UI.popupBlocked); return; }
    win.document.open();
    win.document.write(buildDocument(ctx));
    win.document.close();

    var logo = win.document.querySelector(".band img");
    var proceeded = false;
    function proceed() {
      if (proceeded) return;
      proceeded = true;
      win.focus();
      win.print();          /* the browser makes the PDF: vector, selectable */
    }
    if (logo && !logo.complete) {
      logo.addEventListener("load", proceed);
      logo.addEventListener("error", proceed);
      window.setTimeout(proceed, 1200);
    } else {
      proceed();
    }
  }

  /* v22 — the silent archive is gone, and its two libraries with it.
     -------------------------------------------------------------------------
     What it did: rasterise the finished document, wrap the picture in a PDF,
     and POST the base64 to the server so a copy landed in an archive/ folder
     on disk. Every part of that existed for the server's benefit. The
     visitor's own PDF never came from there — it comes, and still comes, from
     the browser's print dialog, which produces a vector document with
     selectable text instead of a photograph of text.

     So the dependency was not replaced. The NEED was removed: no server, no
     folder to archive into, no reason to rasterise a document the browser
     renders better. Two rented libraries (~580 KB) left with it. The one that
     had to stay — the SEPA payment QR — we wrote ourselves, in qr.js. */

  /* --------------------------------------------------------------------- */
  /* wiring                                                                 */
  /* --------------------------------------------------------------------- */
  function wire() {
    document.addEventListener("input", onChange);
    document.addEventListener("change", onChange);

    $("customAdd").addEventListener("click", addCustom);
    $("customList").addEventListener("click", function (event) {
      var index = event.target.getAttribute("data-custom");
      if (index === null) return;
      customItems.splice(Number(index), 1);
      renderCustom();
      save();
      calc();
    });

    $("photoInput").addEventListener("change", function (event) { acceptPhotos(event.target.files); });
    $("photoGallery").addEventListener("click", function (event) {
      var index = event.target.getAttribute("data-photo");
      if (index === null) return;
      photos.splice(Number(index), 1);
      renderPhotos();
    });

    $("sigClear").addEventListener("click", signature.clear);
    $("search").addEventListener("input", filterCards);

    $("btnNew").addEventListener("click", function () {
      if (!window.confirm(UI.resetConfirm)) return;
      resetForm(true);
      lsRemove(KEY_FORM);
      lsRemove(KEY_NO);
      setNumber(newNumber(), true);
      stampDates();
      calc();
    });

    $("historyBadge").addEventListener("click", function () { renderHistory(); openModal("historyModal"); });
    $("analyticsBadge").addEventListener("click", function () { renderAnalytics(); openModal("analyticsModal"); });
    $("historyList").addEventListener("click", function (event) {
      var open = event.target.getAttribute("data-open");
      var drop = event.target.getAttribute("data-drop");
      if (open !== null) { openHistoryEntry(Number(open)); return; }
      if (drop !== null) {
        if (!window.confirm(UI.historyDeleteConfirm)) return;
        var list = historyRead();
        list.splice(Number(drop), 1);
        historyWrite(list);
        renderHistory();
      }
    });
    all("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () { closeModal(button.getAttribute("data-close")); });
    });
    all(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (event) { if (event.target === modal) modal.hidden = true; });
    });

    $("btnExport").addEventListener("click", exportDocument);
    $("btnCopy").addEventListener("click", copySummary);
    $("btnEmail").addEventListener("click", function () {
      window.location.href = "mailto:" + encodeURIComponent($("clientEmail").value) +
        "?subject=" + encodeURIComponent("Смета № " + estimateNo) +
        "&body=" + encodeURIComponent(summaryText());
    });

    $("themeToggle").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      lsSet(KEY_THEME, next);
    });

    document.addEventListener("keydown", function (event) {
      if (!event.ctrlKey && !event.metaKey) return;
      var key = String(event.key).toLowerCase();
      if (key === "s") { event.preventDefault(); save(); flashHint(UI.saved); }
      else if (key === "p") { event.preventDefault(); $("btnExport").click(); }
      else if (key === "f") { event.preventDefault(); $("search").focus(); }
    });

    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("paused", document.hidden);
    });
  }

  function onChange(event) {
    var el = event.target;
    if (!el || !el.id && !el.classList) return;

    /* auto-fill a price from its placeholder the moment the line is chosen */
    if (el.classList.contains("item-check") && el.checked) {
      var price = $("price_" + el.id.replace(/^item_/, ""));
      if (price && price.value === "") price.value = price.placeholder.replace(" €", "");
    }
    if (el.classList.contains("svc-enable") && el.checked) {
      var svcPrice = $(el.id.replace(/_enable$/, "_price"));
      if (svcPrice && svcPrice.value === "") svcPrice.value = svcPrice.placeholder.replace("от ", "").replace(" €", "");
    }
    if (el.classList.contains("paint-radio")) markPaint();
    if (el.id === "paymentMethod") refreshInstalments();
    if (el.id === "advanceAmount") refreshAdvance();

    save();
    if (!el.classList.contains("meta") && el.id !== "search") calc();
  }

  /* --------------------------------------------------------------------- */
  /* boot                                                                   */
  /* --------------------------------------------------------------------- */
  applyTheme(lsGet(KEY_THEME) === "light" ? "light" : "dark");
  if (TOUCH) $("hotkeyHint").hidden = true;
  wireTotalChip();
  setNumber(lsGet(KEY_NO) || newNumber(), true);
  stampDates();
  startTimer();
  wire();
  try {
    apply(JSON.parse(lsGet(KEY_FORM) || "null"));
  } catch (e) {
    if (window.console) window.console.warn("saved form ignored:", e);
  }
  filterCards();
  calc();
})();
