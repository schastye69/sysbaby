/* sys.baby — pricing single source.
 *
 * SHARED CONTRACT: consumed by the landing (Order package cards + payback
 * calculator) and by the OS payback widget. One global, attached to window
 * (or globalThis outside a browser): SB_PRICING.
 *
 *   .tiers          [{ id, amount, top?, display: { en, ru, ee } }]
 *                   display strings are the VERBATIM per-locale price strings
 *                   printed on package cards. Never re-format them.
 *   .WEEKS          46    working weeks per year
 *   .SHARE_LO       0.30  low fraction of the task a focused automation removes
 *   .SHARE_HI       0.50  high fraction
 *   .MAX_PAYBACK    18    months; above this the calculator refuses ("too small")
 *   .PRICE_LO       starter amount (1400) — DERIVED from tiers, never re-typed
 *   .PRICE_HI       growth top    (4800) — DERIVED from tiers
 *   .priceOf(id,lang)   verbatim display string for a tier ("" if unknown id,
 *                       English if the language is unknown)
 *   .band(lang)     ROI price-band string = fmt(PRICE_LO) + U+2013 + fmt(PRICE_HI)
 *                   fmt: en "\u20AC" + comma grouping   -> \u20AC1,400\u2013\u20AC4,800
 *                        ru "\u20AC" + U+00A0 grouping  -> \u20AC1\u00A0400\u2013\u20AC4\u00A0800
 *                        ee digits + " \u20AC"          -> 1400 \u20AC\u20134800 \u20AC
 *
 *   .fullBand(lang) PUBLISHED band across every tier = fmt(cheapest tier amount)
 *                   + " \u2013 " + fmt(dearest tier top). English:
 *                   "\u20AC1,400 \u2013 \u20AC9,500". Spaced like the tier display
 *                   strings. Also exposed as the global window.sbPricingBand(lang)
 *                   so os/core/links.js never hardcodes the published band
 *                   (os-apps.md §11 single-source-of-truth requirement).
 *
 * TIERS BELOW ARE GENERATED from the "pricing" block of
 * /root/work/spec/data/landing-content.json by tools/landing-build-data.js.
 * Do not edit amounts or display strings by hand.
 */
(function (root) {
  "use strict";

  var TIERS = [
    {
      "id": "starter",
      "amount": 1400,
      "display": {
        "en": "€1,400",
        "ru": "€1 400",
        "ee": "1400 €"
      }
    },
    {
      "id": "growth",
      "amount": 3200,
      "top": 4800,
      "display": {
        "en": "€3,200 – €4,800",
        "ru": "€3 200 – €4 800",
        "ee": "3200 – 4800 €"
      }
    },
    {
      "id": "enterprise",
      "amount": 6500,
      "top": 9500,
      "display": {
        "en": "€6,500 – €9,500",
        "ru": "€6 500 – €9 500",
        "ee": "6500 – 9500 €"
      }
    }
  ];

  function groupDigits(n, sep) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  }

  function fmtAmount(lang, v) {
    if (lang === "ru") return "\u20AC" + groupDigits(v, "\u00A0");
    if (lang === "ee") return String(v) + " \u20AC";
    return "\u20AC" + groupDigits(v, ",");
  }

  function tierById(id) {
    for (var i = 0; i < TIERS.length; i++) {
      if (TIERS[i].id === id) return TIERS[i];
    }
    return null;
  }

  var SB_PRICING = {
    tiers: TIERS,
    WEEKS: 46,
    SHARE_LO: 0.30,
    SHARE_HI: 0.50,
    MAX_PAYBACK: 18,
    PRICE_LO: tierById("starter").amount,
    PRICE_HI: tierById("growth").top,
    tierById: tierById,
    priceOf: function (id, lang) {
      var tier = tierById(id);
      if (!tier) return "";
      return tier.display[lang] || tier.display.en;
    },
    band: function (lang) {
      return fmtAmount(lang, this.PRICE_LO) + "\u2013" + fmtAmount(lang, this.PRICE_HI);
    },
    /* The whole published ladder, cheapest entry to dearest top — the band the
     * site prints and the OS links registry quotes. Derived, never re-typed. */
    fullBand: function (lang) {
      var lo = null, hi = null;
      for (var i = 0; i < TIERS.length; i++) {
        var a = TIERS[i].amount, t = TIERS[i].top == null ? TIERS[i].amount : TIERS[i].top;
        if (lo === null || a < lo) lo = a;
        if (hi === null || t > hi) hi = t;
      }
      return fmtAmount(lang, lo) + " \u2013 " + fmtAmount(lang, hi);
    }
  };

  root.SB_PRICING = SB_PRICING;

  /* Shared helper so no consumer hardcodes the published band. Language comes
   * from the raw (never namespaced) i18n key, exactly like the widgets read it. */
  root.sbPricingBand = function (lang) {
    var code = lang;
    if (!code) {
      try { code = (root.localStorage && root.localStorage.getItem("sysbaby.i18n.lang")) || "en"; }
      catch (err) { code = "en"; }
    }
    return SB_PRICING.fullBand(code);
  };
})(typeof window !== "undefined" ? window : globalThis);
