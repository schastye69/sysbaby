/* sys.baby OS — Payback widget.
 *
 * Spec: os-apps.md section 11.
 * The desktop version of the site's ROI/payback calculator. Computes only from
 * what the visitor types and can honestly answer "don't buy".
 *
 * SINGLE SOURCE OF TRUTH: every constant comes from window.SB_PRICING
 * (shared/pricing.data.js, owned by the landing build). The band can therefore
 * never disagree across surfaces. If that file has not loaded, the widget says
 * so instead of inventing a price.
 *
 * Nothing is stored. Nothing is sent. The note says so, in the visitor's
 * language, hand-written — never machine-translated (data-i18n-skip).
 */
(function () {
  "use strict";

  var WIDGET_ID = "payback";

  var DEFAULTS = { hours: 8, people: 3, rate: 22 };

  var LABELS = {
    hours: "Hours a week on one repetitive task",
    people: "People doing it",
    rate: "Cost of an hour, €",
    back: "Hours back a month",
    value: "Worth a year",
    pay: "Pays for itself in, months"
  };

  /* Verbatim from spec/data/os-apps-widgets-i18n.json — authored, not translated. */
  var NOTE = {
    en: {
      worth: "Freed capacity, not cash — it becomes money only if those hours go to work you would otherwise pay for. Against a €{lo}–€{hi} build. Nothing here is stored or sent.",
      tooSmall: "At this size a system would take too long to pay for itself. Worth saying plainly rather than selling you something — write anyway if the work is growing."
    },
    ru: {
      worth: "Это освобождённое время, а не деньги: оно станет деньгами, только если эти часы уйдут на работу, за которую вы иначе платили бы. Против проекта в €{lo}–€{hi}. Ничего не сохраняется и не отправляется.",
      tooSmall: "При таком объёме система окупалась бы слишком долго. Лучше сказать прямо, чем продать вам что-нибудь — напишите, если работы становится больше."
    },
    ee: {
      worth: "See on vabanenud aeg, mitte raha: rahaks saab see ainult siis, kui need tunnid lähevad tööle, mille eest te muidu maksaksite. Võrreldes €{lo}–€{hi} projektiga. Midagi ei salvestata ega saadeta.",
      tooSmall: "Sellises mahus tasuks süsteem end liiga kaua ära. Parem öelda otse kui teile midagi müüa — kirjutage ikkagi, kui tööd tuleb juurde."
    }
  };

  var CSS = '' +
    '[data-widget-id="payback"] .pb-body{display:flex;flex-direction:column;gap:9px;padding:2px 0}' +
    '[data-widget-id="payback"] .pb-field{display:flex;flex-direction:column;gap:3px}' +
    '[data-widget-id="payback"] .pb-label{font-size:10px;line-height:1.35;color:rgba(255,255,255,.5)}' +
    '[data-widget-id="payback"] .pb-input{width:100%;padding:6px 8px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:inherit;font:inherit;font-size:12.5px;outline:none}' +
    '[data-widget-id="payback"] .pb-input:focus-visible{outline:2px solid var(--accent,#5b7cff);outline-offset:1px}' +
    '[data-widget-id="payback"] .pb-results{display:flex;flex-direction:column;gap:5px;margin-top:2px;padding-top:8px;border-top:1px solid rgba(255,255,255,.09)}' +
    '[data-widget-id="payback"] .pb-result{display:flex;align-items:baseline;justify-content:space-between;gap:8px}' +
    '[data-widget-id="payback"] .pb-result-name{font-size:10.5px;color:rgba(255,255,255,.5);min-width:0}' +
    '[data-widget-id="payback"] .pb-result-value{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:13px;font-weight:650;white-space:nowrap}' +
    '[data-widget-id="payback"].too-small .pb-result-value{color:rgba(255,255,255,.55)}' +
    '[data-widget-id="payback"] .pb-note{margin:6px 0 0;font-size:9.5px;line-height:1.5;color:rgba(255,255,255,.42)}' +
    '[data-widget-id="payback"].too-small .pb-note{color:#ffd8a8}' +
    '[data-widget-id="payback"] .pb-missing{font-size:11px;line-height:1.55;color:rgba(255,255,255,.5);padding:6px 0}';

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function injectStyle() {
    if (document.getElementById("sb-widget-payback-css")) return;
    var style = document.createElement("style");
    style.id = "sb-widget-payback-css";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function lang() {
    var value = "en";
    try { value = localStorage.getItem("sysbaby.i18n.lang") || "en"; }
    catch (err) { console.error("[payback] language read failed", err); }
    return NOTE[value] ? value : "en";
  }

  function pricing() { return window.SB_PRICING || null; }

  var nf0 = new Intl.NumberFormat("et-EE", { maximumFractionDigits: 0 });
  function fmt0(value) { return nf0.format(Math.round(Number(value) || 0)); }

  function rangeText(lo, hi, formatter) {
    var a = formatter(lo), b = formatter(hi);
    return a === b ? a : a + "–" + b;
  }

  function paint(el, lo, hi, formatter) {
    if (!el) return;
    var equal = formatter(lo) === formatter(hi);
    if (typeof window.sbAnimateFigure === "function") {
      try {
        window.sbAnimateFigure(el, equal ? lo : [lo, hi], formatter);
        return;
      } catch (err) { console.error("[payback] figure animation failed", err); }
    }
    el.textContent = rangeText(lo, hi, formatter);
  }

  function numberFrom(input, fallback) {
    var value = parseFloat(input && input.value);
    if (!isFinite(value) || value <= 0) return fallback;
    return value;
  }

  /* --------------------------------------------------------------- render */

  function fieldMarkup(id, label, min, max, step, value) {
    return '<label class="pb-field"><span class="pb-label">' + esc(label) + "</span>" +
      '<input class="pb-input" type="number" id="pb-' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></label>';
  }

  function resultMarkup(id, label) {
    return '<div class="pb-result"><span class="pb-result-name">' + esc(label) + "</span>" +
      '<span class="pb-result-value" id="pb-out-' + id + '">—</span></div>';
  }

  function mount(root) {
    if (!root) return;
    injectStyle();

    var host = root.querySelector(".widget-body") || root;
    var price = pricing();

    if (!price) {
      host.innerHTML = '<div class="pb-body"><p class="pb-missing" data-i18n-skip="1">' +
        "The pricing source has not loaded, so no payback figure can be shown here. Nothing is guessed." +
        "</p></div>";
      return;
    }

    host.innerHTML = '<div class="pb-body">' +
      fieldMarkup("hours", LABELS.hours, 1, 30, 0.5, DEFAULTS.hours) +
      fieldMarkup("people", LABELS.people, 1, 15, 1, DEFAULTS.people) +
      fieldMarkup("rate", LABELS.rate, 12, 60, 1, DEFAULTS.rate) +
      '<div class="pb-results">' +
        resultMarkup("back", LABELS.back) +
        resultMarkup("value", LABELS.value) +
        resultMarkup("pay", LABELS.pay) +
      "</div>" +
      '<p class="pb-note" id="pb-note" data-i18n-skip="1"></p>' +
    "</div>";

    var hoursEl = host.querySelector("#pb-hours");
    var peopleEl = host.querySelector("#pb-people");
    var rateEl = host.querySelector("#pb-rate");

    function recompute() { compute(root, host, hoursEl, peopleEl, rateEl); }
    [hoursEl, peopleEl, rateEl].forEach(function (el) {
      if (el) el.addEventListener("input", recompute);
    });
    recompute();
  }

  function compute(root, host, hoursEl, peopleEl, rateEl) {
    var price = pricing();
    if (!price) return;

    var WEEKS = price.WEEKS;
    var SHARE_LO = price.SHARE_LO;
    var SHARE_HI = price.SHARE_HI;
    var PRICE_LO = price.PRICE_LO;
    var PRICE_HI = price.PRICE_HI;
    var MAX_PAYBACK = price.MAX_PAYBACK;

    var hours = numberFrom(hoursEl, DEFAULTS.hours);
    var people = numberFrom(peopleEl, DEFAULTS.people);
    var rate = numberFrom(rateEl, DEFAULTS.rate);

    var teamWeekly = hours * people;
    var backLo = teamWeekly * SHARE_LO * WEEKS / 12;
    var backHi = teamWeekly * SHARE_HI * WEEKS / 12;
    var yearLo = teamWeekly * SHARE_LO * WEEKS * rate;
    var yearHi = teamWeekly * SHARE_HI * WEEKS * rate;

    /* The widest honest spread: cheapest build over the most optimistic
     * monthly return, dearest build over the most cautious. */
    var payLo = PRICE_LO / (yearHi / 12);
    var payHi = PRICE_HI / (yearLo / 12);

    paint(host.querySelector("#pb-out-back"), backLo, backHi, fmt0);
    paint(host.querySelector("#pb-out-value"), Math.round(yearLo / 100) * 100, Math.round(yearHi / 100) * 100, function (v) {
      return "€" + fmt0(v);
    });

    var payEl = host.querySelector("#pb-out-pay");
    var noteEl = host.querySelector("#pb-note");
    var strings = NOTE[lang()];
    var tooSmall = !isFinite(payHi) || payHi > MAX_PAYBACK;

    if (tooSmall) {
      root.classList.add("too-small");
      if (payEl) payEl.textContent = "—";
      if (noteEl) noteEl.textContent = strings.tooSmall;
    } else {
      root.classList.remove("too-small");
      paint(payEl, payLo, payHi, fmt0);
      if (noteEl) {
        noteEl.textContent = strings.worth
          .replace("{lo}", fmt0(PRICE_LO))
          .replace("{hi}", fmt0(PRICE_HI));
      }
    }
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
    title: "Payback",
    defaultSize: { w: 250, h: 260 },
    mount: function (root) {
      if (root) root.setAttribute("data-sb-mounted", "1");
      mount(root);
    }
  };

  window.sbWidgetPayback = descriptor;
  if (typeof window.sbRegisterWidget === "function") {
    try { window.sbRegisterWidget(WIDGET_ID, descriptor); }
    catch (err) { console.error("[payback] widget registration failed", err); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount);
  else autoMount();

  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("widget:visibility", autoMount);
    window.sbBus.on("widgets:tidied", autoMount);
  }
})();
