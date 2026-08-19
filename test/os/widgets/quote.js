/* sys.baby OS — Quote widget.
 *
 * Spec: os-apps.md section 12.
 * Quotes a job in universal terms — units of time × the user's own hourly
 * rate — and ends in the arithmetic every European quote ends in: subtotal,
 * VAT, total. No invented catalogue.
 *
 * VAT_PCT = 24 is this widget's own single named constant (Estonian VAT).
 * Unit names and row labels are authored per language and re-rendered on
 * every press, with the machine translator skipped so they never flicker.
 * Nothing is stored, nothing is sent — counts reset each load by design.
 */
(function () {
  "use strict";

  var WIDGET_ID = "quote";
  var VAT_PCT = 24;

  var UNITS = [
    { id: "hour", hours: 1 },
    { id: "half", hours: 4 },
    { id: "day", hours: 8 },
    { id: "week", hours: 40 }
  ];

  var DEFAULT_COUNTS = { hour: 0, half: 0, day: 1, week: 0 };
  var DEFAULT_RATE = 45;
  var MAX_COUNT = 20;

  /* Verbatim from spec/data/os-apps-widgets-i18n.json. */
  var UNIT_NAMES = {
    en: { hour: "An hour", half: "Half a day", day: "A day", week: "A week" },
    ru: { hour: "Час", half: "Полдня", day: "День", week: "Неделя" },
    ee: { hour: "Tund", half: "Pool päeva", day: "Päev", week: "Nädal" }
  };

  var ROW_LABELS = {
    en: { hours: "Hours", net: "Before VAT", vat: "VAT", total: "Total" },
    ru: { hours: "Часов", net: "Без НДС", vat: "НДС", total: "Итого" },
    ee: { hours: "Tunde", net: "Enne käibemaksu", vat: "Käibemaks", total: "Kokku" }
  };

  var MARKUP_LABELS = {
    rateLabel: "Cost of an hour, €",
    footnote: "Your rate, your time. Nothing is stored or sent."
  };

  var STEPPER_ARIA = { fewer: "One fewer", more: "One more" };

  var CSS = '' +
    '[data-widget-id="quote"] .qt-body{display:flex;flex-direction:column;gap:8px;padding:2px 0}' +
    '[data-widget-id="quote"] .qt-field{display:flex;flex-direction:column;gap:3px}' +
    '[data-widget-id="quote"] .qt-label{font-size:10px;color:rgba(255,255,255,.5)}' +
    '[data-widget-id="quote"] .qt-input{width:100%;padding:6px 8px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:inherit;font:inherit;font-size:12.5px;outline:none}' +
    '[data-widget-id="quote"] .qt-input:focus-visible{outline:2px solid var(--accent,#5b7cff);outline-offset:1px}' +
    '[data-widget-id="quote"] .qt-units{display:flex;flex-direction:column;gap:3px}' +
    '[data-widget-id="quote"] .qt-unit{display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:9px;border:1px solid transparent}' +
    '[data-widget-id="quote"] .qt-unit.on{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1)}' +
    '[data-widget-id="quote"] .qt-unit-name{flex:1;min-width:0;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '[data-widget-id="quote"] .qt-step{width:20px;height:20px;flex:0 0 20px;display:grid;place-items:center;border-radius:7px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:inherit;font:inherit;font-size:12px;line-height:1;cursor:pointer;padding:0}' +
    '[data-widget-id="quote"] .qt-step:hover{background:rgba(255,255,255,.13)}' +
    '[data-widget-id="quote"] .qt-count{min-width:16px;text-align:center;font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:11.5px}' +
    '[data-widget-id="quote"] .qt-out{display:flex;flex-direction:column;gap:4px;margin-top:2px;padding-top:8px;border-top:1px solid rgba(255,255,255,.09)}' +
    '[data-widget-id="quote"] .qt-row{display:flex;align-items:baseline;justify-content:space-between;gap:8px}' +
    '[data-widget-id="quote"] .qt-row-name{font-size:10.5px;color:rgba(255,255,255,.5)}' +
    '[data-widget-id="quote"] .qt-row-value{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:12.5px;white-space:nowrap}' +
    '[data-widget-id="quote"] .qt-row.total .qt-row-name{color:rgba(255,255,255,.75)}' +
    '[data-widget-id="quote"] .qt-row.total .qt-row-value{font-size:14px;font-weight:700}' +
    '[data-widget-id="quote"] .qt-foot{margin:6px 0 0;font-size:9.5px;line-height:1.5;color:rgba(255,255,255,.4)}';

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function injectStyle() {
    if (document.getElementById("sb-widget-quote-css")) return;
    var style = document.createElement("style");
    style.id = "sb-widget-quote-css";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function lang() {
    var value = "en";
    try { value = localStorage.getItem("sysbaby.i18n.lang") || "en"; }
    catch (err) { console.error("[quote] language read failed", err); }
    return UNIT_NAMES[value] ? value : "en";
  }

  var nfMoney = new Intl.NumberFormat("et-EE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nfInt = new Intl.NumberFormat("et-EE", { maximumFractionDigits: 0 });

  function money(value) { return "€" + nfMoney.format(Number(value) || 0); }
  function whole(value) { return nfInt.format(Math.round(Number(value) || 0)); }

  function paint(el, value, formatter) {
    if (!el) return;
    if (typeof window.sbAnimateFigure === "function") {
      try { window.sbAnimateFigure(el, value, formatter); return; }
      catch (err) { console.error("[quote] figure animation failed", err); }
    }
    el.textContent = formatter(value);
  }

  /* --------------------------------------------------------------- render */

  function mount(root) {
    if (!root) return;
    injectStyle();

    var host = root.querySelector(".widget-body") || root;
    var counts = {};
    Object.keys(DEFAULT_COUNTS).forEach(function (key) { counts[key] = DEFAULT_COUNTS[key]; });

    var code = lang();
    var names = UNIT_NAMES[code];
    var rows = ROW_LABELS[code];

    host.innerHTML = '<div class="qt-body">' +
      '<label class="qt-field"><span class="qt-label" data-i18n-skip="1">' + esc(MARKUP_LABELS.rateLabel) + "</span>" +
        '<input class="qt-input" type="number" id="qt-rate" min="5" max="300" step="1" value="' + DEFAULT_RATE + '"></label>' +
      '<div class="qt-units" id="qt-units">' +
        UNITS.map(function (unit) {
          return '<div class="qt-unit" data-unit="' + unit.id + '">' +
            '<span class="qt-unit-name" data-i18n-skip="1">' + esc(names[unit.id]) + "</span>" +
            '<button type="button" class="qt-step" data-step="-1" data-for="' + unit.id + '" aria-label="' + esc(STEPPER_ARIA.fewer) + '">−</button>' +
            '<span class="qt-count" data-count="' + unit.id + '">0</span>' +
            '<button type="button" class="qt-step" data-step="1" data-for="' + unit.id + '" aria-label="' + esc(STEPPER_ARIA.more) + '">＋</button>' +
          "</div>";
        }).join("") +
      "</div>" +
      '<div class="qt-out" id="qt-out">' +
        '<div class="qt-row"><span class="qt-row-name" data-i18n-skip="1">' + esc(rows.hours) + '</span><span class="qt-row-value" id="qt-hours">0</span></div>' +
        '<div class="qt-row"><span class="qt-row-name" data-i18n-skip="1">' + esc(rows.net) + '</span><span class="qt-row-value" id="qt-net">€0,00</span></div>' +
        '<div class="qt-row"><span class="qt-row-name" data-i18n-skip="1">' + esc(rows.vat) + " " + VAT_PCT + '%</span><span class="qt-row-value" id="qt-vat">€0,00</span></div>' +
        '<div class="qt-row total"><span class="qt-row-name" data-i18n-skip="1">' + esc(rows.total) + '</span><span class="qt-row-value" id="qt-total">€0,00</span></div>' +
      "</div>" +
      '<p class="qt-foot" data-i18n-skip="1">' + esc(MARKUP_LABELS.footnote) + "</p>" +
    "</div>";

    var rateEl = host.querySelector("#qt-rate");

    function recompute() {
      UNITS.forEach(function (unit) {
        var row = host.querySelector('[data-unit="' + unit.id + '"]');
        var countEl = host.querySelector('[data-count="' + unit.id + '"]');
        if (countEl) countEl.textContent = String(counts[unit.id]);
        if (row) row.classList.toggle("on", counts[unit.id] > 0);
      });

      var rate = parseFloat(rateEl && rateEl.value);
      if (!isFinite(rate) || rate <= 0) rate = DEFAULT_RATE;

      var hours = 0;
      UNITS.forEach(function (unit) { hours += counts[unit.id] * unit.hours; });
      var net = hours * rate;
      var vat = net * (VAT_PCT / 100);
      var total = net + vat;

      paint(host.querySelector("#qt-hours"), hours, whole);
      paint(host.querySelector("#qt-net"), net, money);
      paint(host.querySelector("#qt-vat"), vat, money);
      paint(host.querySelector("#qt-total"), total, money);
    }

    host.querySelectorAll("[data-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-for");
        var delta = parseInt(btn.getAttribute("data-step"), 10);
        counts[id] = Math.min(MAX_COUNT, Math.max(0, (counts[id] || 0) + delta));
        recompute();
      });
    });
    if (rateEl) rateEl.addEventListener("input", recompute);

    recompute();
  }

  /* -------------------------------------------------- shell mount contract */

  function autoMount() {
    var roots = document.querySelectorAll('[data-widget-id="' + WIDGET_ID + '"]');
    roots.forEach(function (root) {
      if (root.getAttribute("data-sb-mounted") === "1") return;
      root.setAttribute("data-sb-mounted", "1");
      mount(root);
    });
  }

  var descriptor = {
    id: WIDGET_ID,
    title: "Quote",
    defaultSize: { w: 250, h: 340 },
    mount: function (root) {
      if (root) root.setAttribute("data-sb-mounted", "1");
      mount(root);
    }
  };

  window.sbWidgetQuote = descriptor;
  if (typeof window.sbRegisterWidget === "function") {
    try { window.sbRegisterWidget(WIDGET_ID, descriptor); }
    catch (err) { console.error("[quote] widget registration failed", err); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount);
  else autoMount();

  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("widget:visibility", autoMount);
    window.sbBus.on("widgets:tidied", autoMount);
  }
})();
