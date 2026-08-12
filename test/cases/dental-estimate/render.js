/* =============================================================================
   sys.baby — ESTIMATE UI RENDERER, browser edition
   -----------------------------------------------------------------------------
   The screen used to be assembled by PHP on every request, from config.php.
   It is assembled here instead, from the same config, on load — which is why
   the trade contract survives the move off the server intact:

       a new trade = copy the folder, replace config.js, change nothing else.

   Had we frozen the PHP output into a static index.html instead, the page
   would have looked identical and quietly stopped being configurable — the one
   promise this engine has always made. The DOM produced below is the same DOM,
   node for node, id for id, so the application code that wires it (app.js,
   moved across untouched) cannot tell the difference.

   Escaping: engine_e() was htmlspecialchars. Here every value goes in through
   textContent or a real attribute setter, so there is no HTML string to escape
   in the first place — a whole class of injection is simply absent rather than
   defended against.
   ============================================================================= */
(function () {
  "use strict";

  var C = window.CASE_CONFIG || {};
  var PHOTO_LIMIT = 8;                       /* ENGINE_PHOTO_LIMIT */
  var DEFAULT_DENSE = 8;                     /* ENGINE_DEFAULT_DENSE_THRESHOLD */

  /* ------------------------------------------------------------ tiny helpers */

  function cfgArr(key) { var v = C[key]; return (v && typeof v === "object") ? v : {}; }
  function cfgStr(key, fallback) {
    var v = C[key];
    return (typeof v === "string" || typeof v === "number") ? String(v) : fallback;
  }
  function isNum(v) { return v !== "" && v !== null && v !== undefined && isFinite(Number(v)); }
  function cfgNum(key, fallback) { return isNum(C[key]) ? Number(C[key]) : fallback; }

  /* engine_num_label(): number_format(v, 4) with trailing zeros trimmed —
     "35", "0.5", "1.25". Placeholders read as numbers a human wrote. */
  function numLabel(value) {
    var n = Number(value) || 0;
    var s = n.toFixed(4);
    if (s.indexOf(".") !== -1) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }

  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "text") { node.textContent = String(v); return; }
        if (k === "cls") { node.className = String(v); return; }
        if (k === "style") { node.setAttribute("style", String(v)); return; }
        if (v === true) { node.setAttribute(k, ""); return; }
        node.setAttribute(k, String(v));
      });
    }
    (kids || []).forEach(function (kid) { if (kid) node.appendChild(kid); });
    return node;
  }

  function labelled(text, control) {
    var l = el("label", {}, []);
    l.appendChild(document.createTextNode(text));
    l.appendChild(control);
    return l;
  }

  function card(cls, delayMs) {
    return el("section", {
      cls: cls,
      style: delayMs === null ? null : "animation-delay:" + delayMs + "ms"
    });
  }

  function h(level, text, cls) { return el("h" + level, { text: text, cls: cls || null }); }

  /* ------------------------------------------------------------------ build */

  var cardIndex = 0;                          /* staggered card entrance */
  function nextDelay() { cardIndex++; return cardIndex * 40; }

  function buildContainer() {
    var box = el("div", { cls: "container" });

    /* --- header ---------------------------------------------------------- */
    var header = el("header", { cls: "logo-block" }, [
      el("span", { cls: "logo", text: cfgStr("label_logo", "Estimate Calculator") })
    ]);
    var tagline = cfgStr("label_tagline", "");
    if (tagline !== "") header.appendChild(el("p", { cls: "tagline", text: tagline }));
    box.appendChild(header);

    /* --- client card ------------------------------------------------------ */
    var grid = el("div", { cls: "grid" });
    grid.appendChild(labelled("Клиент/организация)", el("input", { type: "text", id: "clientName", cls: "meta", placeholder: "Prohor Artovich", autocomplete: "off" })));
    grid.appendChild(labelled("Телефон", el("input", { type: "text", id: "clientPhone", cls: "meta", placeholder: "+372 0000 0000", autocomplete: "off" })));
    grid.appendChild(labelled("Email", el("input", { type: "email", id: "clientEmail", cls: "meta", placeholder: "client@example.com", autocomplete: "off" })));
    grid.appendChild(labelled(cfgStr("label_subject_primary", "Объект"),
      el("input", { type: "text", id: "subjectPrimary", cls: "meta", placeholder: cfgStr("placeholder_subject_primary", ""), autocomplete: "off" })));
    grid.appendChild(labelled(cfgStr("label_subject_secondary", "Идентификатор"),
      el("input", { type: "text", id: "subjectSecondary", cls: "meta", placeholder: cfgStr("placeholder_subject_secondary", ""), autocomplete: "off" })));

    var refFields = C.reference_fields;
    (Array.isArray(refFields) ? refFields : []).forEach(function (field) {
      if (!field || typeof field !== "object") return;
      var id = String(field.id === undefined ? "" : field.id);
      if (id === "") return;
      grid.appendChild(labelled(String(field.label === undefined ? id : field.label),
        el("input", {
          type: "text", id: "ref_" + id, cls: "meta ref-field", "data-ref": id,
          placeholder: String(field.placeholder === undefined ? "" : field.placeholder), autocomplete: "off"
        })));
    });

    var clientCard = card("card no-filter", null);
    clientCard.setAttribute("style", "animation-delay:0ms");
    clientCard.appendChild(h(2, "Данные клиента"));
    clientCard.appendChild(grid);
    box.appendChild(clientCard);

    /* --- search ----------------------------------------------------------- */
    box.appendChild(el("div", { cls: "search-wrap no-filter" }, [
      el("input", { type: "text", id: "search", placeholder: cfgStr("placeholder_search", "🔍 Поиск по позициям и услугам"), autocomplete: "off" }),
      el("span", { id: "searchHint", cls: "search-hint" })
    ]));

    /* --- material classes -------------------------------------------------- */
    var paintTypes = cfgArr("paint_types");
    var paintKeys = Object.keys(paintTypes);
    if (paintKeys.length) {
      var list = el("div", { cls: "paint-list" });
      paintKeys.forEach(function (key) {
        var paint = paintTypes[key];
        if (!paint || typeof paint !== "object") return;
        list.appendChild(el("label", { cls: "paint-option" }, [
          el("input", { type: "radio", name: "paint_type", cls: "paint-radio", value: key }),
          el("span", { cls: "dot", style: "--dot:" + (paint.dot || "var(--accent)") }),
          el("span", { cls: "paint-name", text: paint.name === undefined ? key : paint.name })
        ]));
      });
      var paintCard = card("card no-filter", null);
      paintCard.appendChild(h(2, cfgStr("label_material_class", "Класс материала")));
      paintCard.appendChild(list);
      box.appendChild(paintCard);
    }

    /* --- custom line ------------------------------------------------------- */
    var customGrid = el("div", { cls: "grid grid-custom" }, [
      labelled("Название", el("input", { type: "text", id: "customName", placeholder: cfgStr("placeholder_custom_name", "Напр. отдельная позиция, доставка..."), autocomplete: "off" })),
      labelled("Кол-во", el("input", { type: "number", id: "customQty", value: "1", min: "0", step: "any" })),
      labelled("Цена, €", el("input", { type: "number", id: "customPrice", min: "0", step: "any" })),
      el("button", { type: "button", id: "customAdd", cls: "btn btn-ghost", text: "+ Добавить" })
    ]);
    var customCard = card("card no-filter", null);
    customCard.appendChild(h(2, "Добавить свою позицию"));
    customCard.appendChild(customGrid);
    customCard.appendChild(el("ul", { id: "customList", cls: "custom-list" }));
    box.appendChild(customCard);

    /* --- photos ------------------------------------------------------------ */
    var photoCard = card("card no-filter", null);
    photoCard.appendChild(h(2, "Фотофиксация повреждений"));
    photoCard.appendChild(el("p", { cls: "hint", text: "Фото прикладываются к печатному " + cfgStr("doc_name_dative", "документу") + " как приложение (до " + PHOTO_LIMIT + " шт.)" }));
    photoCard.appendChild(el("input", { type: "file", id: "photoInput", accept: "image/*", multiple: true }));
    photoCard.appendChild(el("div", { id: "photoGallery", cls: "photo-gallery" }));
    box.appendChild(photoCard);

    /* --- signature --------------------------------------------------------- */
    var sigCard = card("card no-filter", null);
    sigCard.appendChild(h(2, "Подпись клиента"));
    sigCard.appendChild(el("canvas", { id: "sigPad", width: "800", height: "150" }));
    sigCard.appendChild(el("div", { cls: "sig-row" }, [
      el("span", { id: "sigStatus", cls: "hint", text: "Подпись не поставлена" }),
      el("button", { type: "button", id: "sigClear", cls: "btn btn-ghost btn-small", text: "Очистить подпись" })
    ]));
    box.appendChild(sigCard);

    /* --- service blocks ----------------------------------------------------- */
    var services = cfgArr("extra_services");
    var blocks = cfgArr("service_blocks");
    Object.keys(blocks).forEach(function (blockTitle) {
      box.appendChild(h(2, blockTitle, "section-title"));
      var ids = blocks[blockTitle];
      (Array.isArray(ids) ? ids : []).forEach(function (serviceKey) {
        var service = services[serviceKey];
        if (!service || typeof service !== "object") return;
        var isHourly = (service.type === undefined ? "fixed" : service.type) === "hourly";
        var row = el("div", { cls: "service-row" }, [
          el("label", { cls: "check" }, [
            el("input", { type: "checkbox", id: "extra_" + serviceKey + "_enable", cls: "svc-enable" }),
            el("span", { text: "Включить в заказ" })
          ]),
          isHourly
            ? el("input", { type: "number", id: "extra_" + serviceKey + "_hours", cls: "num", min: "0", step: "any",
                placeholder: "Часы (" + numLabel(service.rate || 0) + " €/ч)" })
            : el("input", { type: "number", id: "extra_" + serviceKey + "_price", cls: "num svc-price", min: "0", step: "any",
                placeholder: "от " + numLabel(service.price || 0) + " €" })
        ]);
        var c = card("card", nextDelay());
        c.appendChild(h(3, service.name === undefined ? serviceKey : service.name));
        c.appendChild(row);
        box.appendChild(c);
      });
    });

    /* --- catalogue ---------------------------------------------------------- */
    box.appendChild(h(2, cfgStr("label_catalogue_section", "Каталог"), "section-title"));

    var baseParts = cfgArr("base_parts");
    var variants = cfgArr("variants");
    var partVariants = cfgArr("part_variants");
    var merged = Array.isArray(C.merged_block_parts) ? C.merged_block_parts.map(String) : [];
    var denseLimit = Math.trunc(cfgNum("dense_qualifier_threshold", DEFAULT_DENSE));

    if (merged.length) {
      var mergedCard = card("card", nextDelay());
      mergedCard.appendChild(h(3, cfgStr("label_merged_block", "Позиции без уточнения")));
      merged.forEach(function (partKey) {
        var part = baseParts[partKey];
        if (!part || typeof part !== "object") return;
        mergedCard.appendChild(el("div", { cls: "variant-row" }, [
          el("label", { cls: "check" }, [
            el("input", { type: "checkbox", id: "item_" + partKey + "_single", cls: "item-check" }),
            el("span", { text: part.name === undefined ? partKey : part.name })
          ]),
          el("input", { type: "number", id: "price_" + partKey + "_single", cls: "num item-price", min: "0", step: "any",
            placeholder: numLabel(part.price || 0) + " €" })
        ]));
      });
      box.appendChild(mergedCard);
    }

    Object.keys(baseParts).forEach(function (partKey) {
      var part = baseParts[partKey];
      if (!part || typeof part !== "object") return;
      if (merged.indexOf(String(partKey)) !== -1) return;
      var declared = partVariants[partKey];
      var partVars = (Array.isArray(declared) ? declared : []).map(String).filter(function (v) {
        return Object.prototype.hasOwnProperty.call(variants, v);
      });
      if (!partVars.length) return;

      var dense = partVars.length > denseLimit;
      var c = card("card" + (dense ? " card-dense" : ""), nextDelay());
      var listHost = el("div", { cls: "variant-list" });

      if (dense) {
        var details = el("details");
        details.appendChild(el("summary", {}, [
          el("span", { text: part.name === undefined ? partKey : part.name }),
          el("span", { cls: "count-badge", text: String(partVars.length) })
        ]));
        details.appendChild(listHost);
        c.appendChild(details);
      } else {
        c.appendChild(h(3, part.name === undefined ? partKey : part.name));
        c.appendChild(listHost);
      }

      partVars.forEach(function (variantKey) {
        var suffix = variants[variantKey];
        listHost.appendChild(el("div", { cls: "variant-row" }, [
          el("label", { cls: "check" }, [
            el("input", { type: "checkbox", id: "item_" + partKey + "_" + variantKey, cls: "item-check" }),
            el("span", { text: (suffix !== "" && suffix !== undefined) ? suffix : (part.name === undefined ? partKey : part.name) })
          ]),
          el("input", { type: "number", id: "price_" + partKey + "_" + variantKey, cls: "num item-price", min: "0", step: "any",
            placeholder: numLabel(part.price || 0) + " €" })
        ]));
      });
      box.appendChild(c);
    });

    return box;
  }

  function buildPanel() {
    var vatLabel = numLabel(cfgNum("vat_percent", 0));
    var docName = cfgStr("doc_name", "Смета");
    var docNameAcc = cfgStr("doc_name_accusative", "смету");

    var panel = el("aside", { cls: "panel" });

    panel.appendChild(el("div", { cls: "panel-meta" }, [
      el("div", {}, [
        el("div", { cls: "doc-name", text: docName }),
        el("div", { cls: "doc-no", id: "estimateNo", text: "№ —" })
      ]),
      el("div", { cls: "panel-badges" }, [
        el("button", { type: "button", cls: "pill badge-btn", id: "historyBadge", title: "Открыть историю смет", text: "📜 История" }),
        el("button", { type: "button", cls: "pill badge-btn", id: "analyticsBadge", title: "Открыть аналитику", text: "📊 Аналитика" }),
        el("div", { cls: "doc-date", id: "estimateDate" }),
        el("button", { type: "button", cls: "linkish", id: "btnNew", text: "+ " + cfgStr("doc_name_new", "Новая смета") })
      ])
    ]));

    panel.appendChild(el("div", { cls: "panel-row" }, [el("span", { text: "Действительна до" }), el("span", { id: "validUntil", text: "—" })]));
    panel.appendChild(el("div", { cls: "panel-row" }, [el("span", { text: "⏱ Время работы над сметой" }), el("span", { id: "timer", text: "00:00" })]));
    panel.appendChild(el("div", { cls: "big-total", id: "bigTotal", text: "0 €" }));
    panel.appendChild(el("h2", {}, [el("br"), el("br")]));
    panel.appendChild(el("div", { id: "itemsList", cls: "items-list" }));

    var totals = el("div", { cls: "totals" });
    totals.appendChild(el("div", { cls: "totals-head" }, [
      el("span", { cls: "pill premium", text: "Premium estimate" }),
      el("span", { cls: "pill count", id: "countBadge", hidden: true })
    ]));
    function totRow(label, valueId, valueText, cls, id) {
      return el("div", { cls: cls || "tot-row", id: id || null, hidden: id ? true : null }, [
        el("span", { text: label }), el("span", { id: valueId, text: valueText })
      ]);
    }
    totals.appendChild(totRow("Материал", "sumMaterial", "0,00 €"));
    totals.appendChild(totRow("Работа", "sumWork", "0,00 €"));
    totals.appendChild(totRow("Часы работ", "sumHours", "0 ч.", "tot-row", "hoursRow"));
    totals.appendChild(totRow("KM " + vatLabel + "%", "sumVat", "0,00 €"));
    totals.appendChild(el("hr"));
    totals.appendChild(totRow("Итого", "sumTotal", "0,00 €", "tot-row tot-grand"));

    totals.appendChild(labelledInput("Скидка, %", el("input", { type: "number", id: "discountPercent", min: "0", max: "100", step: "any" })));
    totals.appendChild(totRow("Скидка", "discountValue", "0,00 €", "tot-row", "discountRow"));

    totals.appendChild(labelledInput("Предоплата, €", el("input", { type: "number", id: "advanceAmount", min: "0", step: "any" })));
    totals.appendChild(el("div", { id: "advanceRow", hidden: true }, [
      el("div", { cls: "tot-row" }, [el("span", { text: "Предоплата" }), el("span", { id: "advanceValue", text: "0,00 €" })]),
      el("div", { cls: "tot-row" }, [el("span", { text: "Остаток к оплате" }), el("span", { id: "remainderValue", text: "0,00 €" })])
    ]));

    var payment = el("select", { id: "paymentMethod" });
    [["", "Не указан"], ["cash", "Наличные"], ["card", "Банковская карта"],
     ["transfer", "Банковский перевод"], ["installments", "Рассрочка"]].forEach(function (o) {
      payment.appendChild(el("option", { value: o[0], text: o[1] }));
    });
    totals.appendChild(labelledInput("Способ оплаты", payment));
    totals.appendChild(el("div", { id: "instalments", cls: "instalments", hidden: true }));

    var warranty = el("select", { id: "warrantyMonths" });
    [["0", "Без гарантии"], ["6", "6 месяцев"], ["12", "12 месяцев"],
     ["24", "24 месяца"], ["36", "36 месяцев"]].forEach(function (o) {
      var opt = el("option", { value: o[0], text: o[1] });
      if (o[0] === "12") opt.setAttribute("selected", "");
      warranty.appendChild(opt);
    });
    totals.appendChild(labelledInput("Гарантия на работы, мес.", warranty));
    totals.appendChild(el("p", { cls: "hint", text: "Указывается в печатном " + cfgStr("doc_name_dative", "документе") }));

    var docType = el("select", { id: "docType", cls: "meta" });
    var offer = el("option", { value: "offer", text: "Ценовое предложение" });
    offer.setAttribute("selected", "");
    docType.appendChild(offer);
    docType.appendChild(el("option", { value: "invoice", text: "Счёт" }));
    totals.appendChild(labelledInput("Тип документа", docType));

    totals.appendChild(labelledInput("Комментарий к заказу",
      el("textarea", { id: "orderComment", cls: "meta", rows: "2", placeholder: "Особые пожелания, сроки, детали..." })));

    totals.appendChild(el("button", { type: "button", cls: "btn btn-primary", id: "btnExport", disabled: true, text: "⇩ Скачать документ (PDF)" }));
    totals.appendChild(el("button", { type: "button", cls: "btn btn-ghost", id: "btnEmail", disabled: true, text: "✉ Отправить " + docNameAcc + " на email клиента" }));
    totals.appendChild(el("button", { type: "button", cls: "btn btn-ghost", id: "btnCopy", disabled: true, text: "⧉ Скопировать " + docNameAcc + " в буфер обмена" }));

    panel.appendChild(totals);
    return panel;
  }

  function labelledInput(text, control) {
    var l = el("label", { cls: "tot-input" });
    l.appendChild(document.createTextNode(text));
    l.appendChild(control);
    return l;
  }

  function buildModals() {
    var frag = document.createDocumentFragment();

    var history = el("div", { cls: "modal", id: "historyModal", hidden: true }, [
      el("div", { cls: "modal-card" }, [
        el("button", { type: "button", cls: "modal-close", "data-close": "historyModal", text: "✕" }),
        h(2, "История смет"),
        el("div", { cls: "modal-stats" }, [
          el("div", {}, [el("span", { cls: "stat-label", text: "Смет выгружено" }), el("span", { cls: "stat-value", id: "historyCount", text: "0" })]),
          el("div", {}, [el("span", { cls: "stat-label", text: "Суммарный оборот" }), el("span", { cls: "stat-value", id: "historyRevenue", text: "0,00 €" })])
        ]),
        el("div", { id: "historyList", cls: "history-list" })
      ])
    ]);

    var analytics = el("div", { cls: "modal", id: "analyticsModal", hidden: true }, [
      el("div", { cls: "modal-card" }, [
        el("button", { type: "button", cls: "modal-close", "data-close": "analyticsModal", text: "✕" }),
        h(2, "📊 " + cfgStr("doc_analytics_title", "Аналитика по сметам")),
        el("div", { id: "analyticsCards", cls: "analytics-cards" }),
        h(3, "Самые частые позиции"),
        el("div", { id: "analyticsTop", cls: "analytics-top" })
      ])
    ]);

    frag.appendChild(history);
    frag.appendChild(analytics);
    frag.appendChild(el("div", { id: "qrHolder", style: "position:absolute;left:-9999px;top:-9999px" }));
    return frag;
  }

  /* ------------------------------------------------------------------ mount */

  /* The payload app.js reads. It was a JSON <script> block written by PHP;
     it is assembled from the same config values here, with the same keys. */
  function clientPayload() {
    var company = cfgArr("company");
    var validity = isNum(company.estimate_validity_days) ? Math.trunc(Number(company.estimate_validity_days)) : 0;
    var refFields = Array.isArray(C.reference_fields) ? C.reference_fields : [];
    return {
      company: company,
      validityDays: validity,
      vatPercent: cfgNum("vat_percent", 0),
      vatLabel: numLabel(cfgNum("vat_percent", 0)),
      unitItem: cfgStr("unit_item", "шт."),
      unitHour: cfgStr("unit_hour", "ч."),
      photoLimit: PHOTO_LIMIT,
      subjectLabels: {
        summary: cfgStr("summary_label_subject", "Объект"),
        docPrimary: cfgStr("doc_label_subject_primary", "Objekt"),
        docSecondary: cfgStr("doc_label_subject_secondary", "Tunnus")
      },
      docNote: cfgStr("doc_note", ""),
      docNames: { name: cfgStr("doc_name", "Смета"), accusative: cfgStr("doc_name_accusative", "смету") },
      referenceFields: refFields.filter(function (f) { return f && typeof f === "object"; }).map(function (f) {
        return {
          id: String(f.id === undefined ? "" : f.id),
          label: String(f.label === undefined ? "" : f.label),
          docLabel: String(f.doc_label === undefined ? (f.label === undefined ? "" : f.label) : f.doc_label)
        };
      }),
      tr: {
        parts: cfgArr("tr_parts"),
        variants: cfgArr("tr_variants"),
        services: cfgArr("tr_services"),
        categories: cfgArr("tr_categories"),
        units: cfgArr("tr_units")
      }
    };
  }

  function mount() {
    document.title = cfgStr("label_logo", "Estimate Calculator");
    var root = document.getElementById("app");
    if (!root) return;
    root.appendChild(buildContainer());
    root.appendChild(buildPanel());
    root.appendChild(buildModals());
    window.ENGINE_CFG = clientPayload();
  }

  mount();
})();
