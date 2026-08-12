/* =============================================================================
   sys.baby — ESTIMATE ENGINE, browser edition
   -----------------------------------------------------------------------------
   This file is the port of engine_calculate() from engine.php. It is the ONLY
   piece of business logic that used to live on a server, and it is the reason
   this case needed a PHP host at all. It does not any more: the same arithmetic
   now runs on the visitor's own device, in the same order, to the same cent.

   The port is not a rewrite of the money model. It is a transcription, and it
   is held to that standard by replay: the golden vectors captured from the PHP
   engine (38 calculation vectors across two trades) are replayed against THIS
   file by tools/engine-parity.mjs, and every raw IEEE-754 double must match
   bit-for-bit — not "close enough", not rounded to cents for comparison.

   Three things in here look pedantic and are not. Each of them was a real
   divergence found by replay, not a precaution:

   1. phpRound(). PHP's round() is decimal-correct; JavaScript's usual idioms
      are not. Math.round(v*100)/100 disagreed with PHP on 169 of 22,033
      engine-realistic doubles, and Number(v.toFixed(2)) on 1,506. A concrete
      one a customer can hit: a 3.35 EUR line at 30% material gives a raw
      1.0049999999999999 — PHP says 1.01, naive JS says 1.00. So we round the
      way PHP rounds: on the shortest round-trip decimal, half away from zero.

   2. The parentheses in `amount * (pct / 100)`. Flattening that to
      `amount * pct / 100` is algebra, not arithmetic: 472.5 * (24/100) is
      113.39999999999999 while 472.5 * 24 / 100 is 113.4. Six golden vectors
      fail on that one character.

   3. Iteration order. Catalogue lines walk base_parts x part_variants, then
      services walk extra_services (NOT the on-screen service_blocks order),
      then custom lines in array order. Float addition is not associative, so
      the order is part of the contract.

   PHP semantics that had to come along: empty() ("0" and "" are falsy, which
   is how a deselected checkbox and an empty price box are told apart from a
   real zero) and is_numeric() (rejects "12abc" outright rather than reading a
   12 out of it, which is what parseFloat would do).
   ============================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;   /* node: parity replay */
  root.ENGINE = api;                                                        /* browser: the app   */
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ENGINE_VERSION = "2.0";   /* unchanged from engine.php — same model, new host */

  /* ------------------------------------------------------------ PHP semantics */

  /* PHP's round($v, $p): decimal, half away from zero, computed on the value's
     shortest round-trip representation rather than on its binary expansion. */
  function phpRound(v, places) {
    if (!isFinite(v) || v === 0) return v;
    return decRoundHalfAway(String(v), places);
  }

  function decRoundHalfAway(str, places) {
    var s = String(str);
    var neg = s.charAt(0) === "-";
    if (neg) s = s.slice(1);
    var exp = 0;
    var e = s.search(/[eE]/);
    if (e >= 0) { exp = parseInt(s.slice(e + 1), 10); s = s.slice(0, e); }
    var parts = s.split(".");
    var ip = parts[0], fp = parts.length > 1 ? parts[1] : "";
    var digits = ip + fp;
    var pointPos = ip.length + exp;
    while (pointPos < 0) { digits = "0" + digits; pointPos++; }
    while (pointPos > digits.length) { digits += "0"; }
    ip = digits.slice(0, pointPos) || "0";
    fp = digits.slice(pointPos);
    if (fp.length <= places) return Number((neg ? "-" : "") + ip + "." + (fp || "0"));
    var num = BigInt(ip + fp.slice(0, places));
    if (fp.charCodeAt(places) - 48 >= 5) num += 1n;          /* half away from zero */
    var out = num.toString();
    while (out.length < places + 1) out = "0" + out;
    var intPart = out.slice(0, out.length - places) || "0";
    return Number((neg ? "-" : "") + intPart + (places ? "." + out.slice(out.length - places) : ""));
  }

  /* PHP empty(): "", "0", 0, 0.0, null, false, undefined, [] are all falsy.
     This is load-bearing — an unticked checkbox posts nothing, a ticked one
     posts "1", and an empty price box posts "0" meaning "use the catalogue
     price". Reading "0" as a number here would silently deselect lines. */
  function phpEmpty(v) {
    if (v === undefined || v === null || v === false) return true;
    if (v === 0) return true;
    if (typeof v === "string") return v === "" || v === "0";
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  /* PHP 8 is_numeric(): optional surrounding whitespace, optional sign,
     decimal or exponent notation. NOT hex, NOT "12abc", NOT "". */
  function phpIsNumeric(v) {
    if (typeof v === "number") return isFinite(v);
    if (typeof v !== "string") return false;
    return /^[ \t\n\r\v\f]*[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?[ \t\n\r\v\f]*$/.test(v);
  }

  function toFloat(v) { return typeof v === "number" ? v : parseFloat(String(v)); }

  /* Posted money: blank or "0" falls back to the catalogue price; a genuinely
     non-numeric value is recorded and priced as zero rather than guessed at. */
  function postedMoney(raw, fallback, field, invalid) {
    if (raw === null || raw === undefined || typeof raw === "object") return fallback;
    var text = String(raw).trim();
    if (text === "" || text === "0") return fallback;
    if (phpIsNumeric(text)) return toFloat(text);
    invalid.push(field);
    return 0.0;
  }

  /* Posted plain number (hours, quantities, percentages). Non-numeric -> 0. */
  function postedNumber(raw, field, invalid) {
    if (raw === null || raw === undefined || typeof raw === "object") return 0.0;
    var text = String(raw).trim();
    if (text === "") return 0.0;
    if (phpIsNumeric(text)) return toFloat(text);
    invalid.push(field);
    return 0.0;
  }

  /* Per-line VAT: an explicit override wins, otherwise the definition's flag. */
  function vatExemptOf(overrides, key, flagDefault) {
    if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
      var value = overrides[key];
      if (Array.isArray(value) || (value && typeof value === "object")) return false;
      return !phpEmpty(value);            /* "0" and "" are false, "1" is true */
    }
    return !phpEmpty(flagDefault);
  }

  /* --------------------------------------------------------------- config read */

  function cfgArr(C, key) {
    var v = C ? C[key] : null;
    return (v && typeof v === "object") ? v : {};
  }
  function cfgStr(C, key, fallback) {
    var v = C ? C[key] : null;
    return (typeof v === "string" || typeof v === "number") ? String(v) : fallback;
  }
  function cfgNum(C, key, fallback) {
    var v = C ? C[key] : null;
    return phpIsNumeric(v) ? toFloat(v) : fallback;
  }

  /* --------------------------------------------------------------- calculation */

  /* Mirrors engine_calculate($C, $post) line for line.
     Returns { payload, invalid } — the same envelope the POST endpoint replied
     with, so the application code above it did not have to change at all. */
  function calculate(C, post) {
    post = post || {};
    var invalid = [];

    var baseParts    = cfgArr(C, "base_parts");
    var variants     = cfgArr(C, "variants");
    var partVariants = cfgArr(C, "part_variants");
    var services     = cfgArr(C, "extra_services");
    var serviceCat   = cfgArr(C, "service_category");   /* derived: serviceId -> block title */
    var paintTypes   = cfgArr(C, "paint_types");
    var vatPercent   = cfgNum(C, "vat_percent", 0.0);

    var categoryServices = cfgStr(C, "category_services", "Services");
    var categoryCustom   = cfgStr(C, "category_custom", "Extra");
    var bodyCategory     = cfgStr(C, "body_category", "");
    var unitItem         = cfgStr(C, "unit_item", "");
    var unitHour         = cfgStr(C, "unit_hour", "");

    var overridesRaw = post["vat_exempt_line"];
    var overrides = (overridesRaw && typeof overridesRaw === "object" && !Array.isArray(overridesRaw))
      ? overridesRaw : {};

    /* ---- quote-level context: the material class ------------------------- */
    var paintKey = post["paint_type"];
    paintKey = (paintKey === null || paintKey === undefined || typeof paintKey === "object") ? "" : String(paintKey);
    var profile = (paintKey !== "" && paintTypes[paintKey] && typeof paintTypes[paintKey] === "object")
      ? paintTypes[paintKey] : null;

    var quoteMaterialPct, markupPct;
    if (profile !== null) {
      quoteMaterialPct = phpIsNumeric(profile.material_percent) ? toFloat(profile.material_percent) : 0.0;
      markupPct        = phpIsNumeric(profile.markup_percent) ? toFloat(profile.markup_percent) : 0.0;
    } else {
      quoteMaterialPct = cfgNum(C, "material_percent", 0.0);
      markupPct        = 0.0;
    }

    var items = [];
    var material = 0.0, work = 0.0, hours = 0.0, total = 0.0, itemsTotal = 0.0;

    /* ---- (a) catalogue lines — the only rounding in the whole engine ----- */
    Object.keys(baseParts).forEach(function (partKey) {
      var part = baseParts[partKey];
      if (!part || typeof part !== "object") return;
      var list = partVariants[partKey];
      if (!Array.isArray(list)) return;
      list.forEach(function (variantKey) {
        variantKey = String(variantKey);
        if (!Object.prototype.hasOwnProperty.call(variants, variantKey)) return;
        var field = "item_" + partKey + "_" + variantKey;
        if (phpEmpty(post[field])) return;

        var price = postedMoney(
          post["price_" + partKey + "_" + variantKey],
          phpIsNumeric(part.price) ? toFloat(part.price) : 0.0,
          "price_" + partKey + "_" + variantKey,
          invalid
        );

        var lineMaterialPct = phpIsNumeric(part.material_percent)
          ? toFloat(part.material_percent)
          : quoteMaterialPct;

        var lineMaterial = phpRound(price * lineMaterialPct / 100, 2);
        var lineWork     = phpRound(price - lineMaterial, 2);

        var label = String(part.name === undefined ? "" : part.name);
        var suffix = String(variants[variantKey] === undefined ? "" : variants[variantKey]);
        if (suffix !== "") label += " - " + suffix;

        items.push({
          name: label,
          category: (typeof part.category === "string" && part.category !== "") ? part.category : bodyCategory,
          qty: 1,
          unit: (typeof part.unit === "string" && part.unit !== "") ? part.unit : unitItem,
          rate: price,
          material: lineMaterial,
          work: lineWork,
          total: price,
          vat_exempt: vatExemptOf(overrides, partKey + ":" + variantKey, part.vat_exempt),
          no_markup: !phpEmpty(part.no_markup)
        });

        material   += lineMaterial;
        work       += lineWork;
        total      += price;
        itemsTotal += price;
      });
    });

    /* ---- (b) services, in extra_services order (not the on-screen order) - */
    Object.keys(services).forEach(function (serviceKey) {
      var service = services[serviceKey];
      if (!service || typeof service !== "object") return;
      if (phpEmpty(post["extra_" + serviceKey + "_enable"])) return;

      /* A service belongs to the block it is rendered under, not to a generic
         "Services" bucket — the printed document groups by this, and the
         golden vectors carry the block titles verbatim. */
      var category = (typeof serviceCat[serviceKey] === "string" && serviceCat[serviceKey] !== "")
        ? serviceCat[serviceKey] : categoryServices;
      var type = String(service.type === undefined ? "fixed" : service.type);
      var name = String(service.name === undefined ? serviceKey : service.name);
      var exempt = vatExemptOf(overrides, serviceKey, service.vat_exempt);
      var noMarkup = !phpEmpty(service.no_markup);

      if (type === "hourly") {
        var lineHours = postedNumber(post["extra_" + serviceKey + "_hours"], "extra_" + serviceKey + "_hours", invalid);
        if (lineHours <= 0) return;
        var rate = phpIsNumeric(service.rate) ? toFloat(service.rate) : 0.0;
        var hourlyPrice = lineHours * rate;
        items.push({
          vat_exempt: exempt,
          no_markup: noMarkup,
          name: name,
          category: category,
          qty: lineHours,
          unit: (typeof service.unit === "string" && service.unit !== "") ? service.unit : unitHour,
          rate: rate,
          material: 0,
          work: hourlyPrice,
          total: hourlyPrice,
          hours: lineHours
        });
        work  += hourlyPrice;
        total += hourlyPrice;
        hours += lineHours;
        return;
      }

      var price = postedMoney(
        post["extra_" + serviceKey + "_price"],
        phpIsNumeric(service.price) ? toFloat(service.price) : 0.0,
        "extra_" + serviceKey + "_price",
        invalid
      );
      if (price <= 0) return;
      items.push({
        vat_exempt: exempt,
        no_markup: noMarkup,
        name: name,
        category: category,
        qty: 1,
        unit: (typeof service.unit === "string" && service.unit !== "") ? service.unit : unitItem,
        rate: price,
        material: 0,
        work: price,
        total: price
      });
      work  += price;
      total += price;
    });

    /* ---- (c) custom lines ------------------------------------------------ */
    var customRaw = post["custom_items"];
    customRaw = (customRaw === null || customRaw === undefined || typeof customRaw === "object") ? "" : String(customRaw);
    var custom = null;
    if (customRaw !== "") { try { custom = JSON.parse(customRaw); } catch (e) { custom = null; } }

    if (custom && typeof custom === "object") {
      var entries = Array.isArray(custom) ? custom : Object.keys(custom).map(function (k) { return custom[k]; });
      entries.forEach(function (entry, index) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return;
        var name = String(entry.name === undefined || entry.name === null ? "" : entry.name).trim();
        var price = phpIsNumeric(entry.price) ? toFloat(entry.price) : 0.0;
        var qty   = phpIsNumeric(entry.qty) ? toFloat(entry.qty) : 0.0;
        if (qty <= 0) qty = 1.0;
        if (name === "" || price <= 0) return;
        var lineTotal = price * qty;
        items.push({
          vat_exempt: vatExemptOf(overrides, "custom:" + index, entry.vat_exempt),
          no_markup: !phpEmpty(entry.no_markup),
          name: name,
          category: categoryCustom,
          qty: qty,
          unit: unitItem,
          rate: price,
          material: 0,
          work: lineTotal,
          total: lineTotal
        });
        work  += lineTotal;
        total += lineTotal;
      });
    }

    /* ---- material-class markup: catalogue base, before discount, not a line */
    if (markupPct > 0 && itemsTotal > 0) {
      var markupBase = itemsTotal;
      items.forEach(function (line) {
        if (!phpEmpty(line.no_markup)) markupBase -= line.total;
      });
      if (markupBase > 0) {
        var markupAmount = markupBase * (markupPct / 100);
        work  += markupAmount;
        total += markupAmount;
      }
    }

    /* ---- discount -------------------------------------------------------- */
    var discountPercent = postedNumber(post["discount_percent"], "discount_percent", invalid);
    discountPercent = Math.max(0.0, Math.min(100.0, discountPercent));

    var subtotal = total;
    var discount = subtotal * (discountPercent / 100);
    total = subtotal - discount;

    /* ---- VAT: charged on the taxable share only -------------------------- */
    var exemptTotal = 0.0;
    items.forEach(function (line) {
      if (!phpEmpty(line.vat_exempt)) exemptTotal += line.total;
    });
    var exemptShare = subtotal > 0 ? exemptTotal / subtotal : 0;
    var vatBase   = total * (1 - exemptShare);
    var vatExempt = total - vatBase;              /* remainder, so the parts re-add */
    var vat       = vatBase * (vatPercent / 100);
    var grand     = total + vat;

    return {
      payload: {
        items: items,
        material: material,
        work: work,
        hours: hours,
        total: total,
        vat: vat,
        grand: grand,
        subtotal: subtotal,
        discount_percent: discountPercent,
        discount: discount,
        vat_base: vatBase,
        vat_exempt: vatExempt
      },
      invalid: invalid
    };
  }

  return {
    version: ENGINE_VERSION,
    calculate: calculate,
    /* exported for the parity replay and for anyone auditing the port */
    phpRound: phpRound,
    phpEmpty: phpEmpty,
    phpIsNumeric: phpIsNumeric
  };
});
