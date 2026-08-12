/* =============================================================================
   DENTAL CLINIC — trade configuration (demonstration)
   =============================================================================
   The second trade this engine was ever pointed at, and the proof of the
   claim below: every other file in this folder is byte-identical to the
   automotive case — only this one differs. The company here is a placeholder;
   the configuration demonstrates the engine, it does not belong to a client.

   DATA ONLY. This file is the whole trade: every price, every name, every
   label a human reads on the screen or on the printed document lives here and
   nowhere else. engine.js contains no business vocabulary whatsoever.

       A new trade = copy the folder, replace THIS file, change nothing else.

   It was config.php until v22, when the case stopped needing a PHP host at
   all. Nothing about the contract changed in the move — the values are the
   same values, and the golden vectors are replayed against them — but the
   file is now readable by the only runtime that remains: the browser.

   SCHEMA (the key names are the contract; selftest.html verifies them)

   MONEY
     material_percent  number  quote-level materials share, % of the line price
     work_percent      number  declared for the contract; the math never reads
                               it (labour is always the remainder of the price)
     vat_percent       number  VAT rate applied to the taxable base

   COMPANY
     company           map     name, reg_nr, vat_nr, address, phone, email,
                               iban, estimate_validity_days (all read by the
                               document; iban + name also feed the SEPA QR).
                               warranty_months is declared, never read.

   MATERIAL CLASSES
     paint_types       map id => { name, material_percent, markup_percent, dot }
                               A selected class overrides the quote material %
                               and adds a hidden markup on catalogue lines only.
                               `dot` is the swatch colour of its radio button.

   CATALOGUE (the relation gates BOTH the rendered UI and the calculation)
     base_parts        map id => { name, price, material_percent?, category?,
                               vat_exempt?, no_markup?, unit? }
     variants          map id => display label ("" = no suffix, the `single`
                               convention used by the merged block)
     part_variants     map itemId => [variantId, ...]
     merged_block_parts  list of item ids rendered inside one shared card
     dense_qualifier_threshold  number  above this many qualifiers a card
                               collapses into a <details>

   SERVICES
     extra_services    map id => { name, type: 'hourly'|'fixed', rate?, price?,
                               vat_exempt?, no_markup?, unit? }
     service_blocks    map blockTitle => [serviceId, ...]   (screen order)
     service_category  map serviceId => blockTitle          (DERIVED, below)

   VOCABULARY
     label_*, placeholder_*, doc_*, category_*, unit_*, body_category,
     summary_label_subject, reference_fields[]

   TRANSLATION (screen Russian -> document Estonian)
     tr_parts, tr_variants, tr_services, tr_categories, tr_units

   ORDER IS PART OF THE CONTRACT. The money math walks base_parts x
   part_variants and then extra_services in the order written here, and float
   addition is not associative — reordering these objects changes the last
   cent. Do not sort them.
   ============================================================================= */
(function (root, factory) {
  var cfg = factory();
  if (typeof module === "object" && module.exports) module.exports = cfg;
  root.CASE_CONFIG = cfg;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var CONFIG = {
    "material_percent": 35,
    "work_percent": 65,
    "vat_percent": 24,
    "company": {
      "name": "Demo Dental Clinic",
      "reg_nr": "00000000",
      "vat_nr": "EE000000000",
      "address": "Tallinn, Estonia",
      "phone": "+372 0000 0000",
      "email": "clinic@example.com",
      "iban": "EE000000000000000000",
      "estimate_validity_days": 30
    },
    "paint_types": {
      "composite": {
        "name": "Komposiit",
        "material_percent": 35,
        "markup_percent": 0,
        "dot": "#9fd8c8"
      },
      "ceramic": {
        "name": "Keraamika",
        "material_percent": 55,
        "markup_percent": 10,
        "dot": "#e4dcc6"
      },
      "zirconia": {
        "name": "Tsirkoon",
        "material_percent": 65,
        "markup_percent": 15,
        "dot": "#dfe6ef"
      }
    },
    "base_parts": {
      "filling": {
        "name": "Täidis",
        "price": 85,
        "material_percent": 45,
        "category": "Ravi",
        "vat_exempt": true
      },
      "endodontic": {
        "name": "Juureravi",
        "price": 220,
        "material_percent": 20,
        "category": "Ravi",
        "no_markup": true,
        "vat_exempt": true
      },
      "extraction": {
        "name": "Hamba eemaldamine",
        "price": 120,
        "material_percent": 10,
        "category": "Ravi",
        "no_markup": true,
        "vat_exempt": true
      },
      "crown": {
        "name": "Kroon",
        "price": 480,
        "material_percent": 60,
        "category": "Ravi",
        "vat_exempt": true
      },
      "inlay": {
        "name": "Inlei",
        "price": 320,
        "material_percent": 60,
        "category": "Ravi",
        "vat_exempt": true
      },
      "implant": {
        "name": "Implantaat",
        "price": 950,
        "material_percent": 75,
        "category": "Ravi",
        "no_markup": true,
        "vat_exempt": true
      },
      "veneer": {
        "name": "Fassett",
        "price": 540,
        "material_percent": 55,
        "category": "Esteetika"
      }
    },
    "variants": {
      "11": "11",
      "12": "12",
      "13": "13",
      "14": "14",
      "15": "15",
      "16": "16",
      "17": "17",
      "18": "18",
      "21": "21",
      "22": "22",
      "23": "23",
      "24": "24",
      "25": "25",
      "26": "26",
      "27": "27",
      "28": "28",
      "31": "31",
      "32": "32",
      "33": "33",
      "34": "34",
      "35": "35",
      "36": "36",
      "37": "37",
      "38": "38",
      "41": "41",
      "42": "42",
      "43": "43",
      "44": "44",
      "45": "45",
      "46": "46",
      "47": "47",
      "48": "48"
    },
    "anterior": [
      "11",
      "12",
      "13",
      "21",
      "22",
      "23",
      "31",
      "32",
      "33",
      "41",
      "42",
      "43"
    ],
    "all_teeth": [
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48
    ],
    "part_variants": {
      "filling": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "endodontic": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "extraction": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "crown": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "inlay": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "implant": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "veneer": [
        "11",
        "12",
        "13",
        "21",
        "22",
        "23",
        "31",
        "32",
        "33",
        "41",
        "42",
        "43"
      ]
    },
    "merged_block_parts": [],
    "category_custom": "Lisakirjed",
    "category_services": "Teenused",
    "unit_item": "protseduur",
    "unit_hour": "h",
    "tr_units": {
      "protseduur": "процедура",
      "h": "ч."
    },
    "label_subject_primary": "Patsient (nimi)",
    "placeholder_subject_primary": "Mari Tamm",
    "label_subject_secondary": "Isikukood",
    "placeholder_subject_secondary": "48001010000",
    "placeholder_search": "🔍 Поиск по процедурам и услугам (например: täidis, kroon, hügieen)",
    "placeholder_custom_name": "Напр. лабораторные расходы, материал...",
    "doc_note": "Ravi käigus võib ilmneda täiendav ravivajadus, mille maksumus lisatakse lõpphinnale vastavalt kliiniku kehtivale hinnakirjale.",
    "reference_fields": [],
    "label_material_class": "Materjali klass",
    "label_logo": "Dental Estimate",
    "label_tagline": "Ravi- ja esteetikaplaani kalkulaator",
    "label_catalogue_section": "Protseduurid",
    "label_merged_block": "",
    "summary_label_subject": "Пациент",
    "doc_label_subject_primary": "Patsient",
    "doc_label_subject_secondary": "Isikukood",
    "doc_name": "План лечения",
    "doc_name_new": "Новый план",
    "doc_name_dative": "плане лечения",
    "doc_name_accusative": "план лечения",
    "doc_analytics_title": "Аналитика по планам",
    "dense_qualifier_threshold": 8,
    "body_category": "Hambaravi",
    "hour_rate": 90,
    "extra_services": {
      "consultation": {
        "name": "Konsultatsioon",
        "type": "hourly",
        "rate": 90,
        "vat_exempt": true
      },
      "hygiene": {
        "name": "Suuhügieen",
        "type": "hourly",
        "rate": 90,
        "vat_exempt": true
      },
      "xray": {
        "name": "Röntgenülesvõte",
        "type": "fixed",
        "price": 25,
        "vat_exempt": true
      },
      "anaesthesia": {
        "name": "Tuimestus",
        "type": "fixed",
        "price": 30,
        "vat_exempt": true
      },
      "nightguard": {
        "name": "Kaitsekap",
        "type": "fixed",
        "price": 180
      }
    },
    "service_blocks": {
      "Ravi": [
        "consultation",
        "hygiene",
        "xray",
        "anaesthesia"
      ],
      "Esteetika": [
        "nightguard"
      ]
    },
    "tr_parts": {
      "Täidis": "Пломба",
      "Juureravi": "Лечение канала",
      "Hamba eemaldamine": "Удаление зуба",
      "Kroon": "Коронка",
      "Inlei": "Вкладка",
      "Implantaat": "Имплантат",
      "Fassett": "Винир"
    },
    "tr_variants": [],
    "tr_services": {
      "Konsultatsioon": "Консультация",
      "Suuhügieen": "Гигиена полости рта",
      "Röntgenülesvõte": "Рентгеновский снимок",
      "Tuimestus": "Анестезия",
      "Kaitsekap": "Защитная капа"
    },
    "tr_categories": {
      "Ravi": "Лечение",
      "Esteetika": "Эстетика",
      "Hambaravi": "Стоматология",
      "Lisakirjed": "Дополнительно",
      "Teenused": "Услуги"
    }
  };

  /* The one derivation: which block each service is rendered under. Kept as a
     loop rather than a literal so service_blocks stays the single source of
     truth for grouping — it is what the printed document groups by. */
  CONFIG.service_category = {};
  Object.keys(CONFIG.service_blocks || {}).forEach(function (blockTitle) {
    (CONFIG.service_blocks[blockTitle] || []).forEach(function (serviceId) {
      CONFIG.service_category[serviceId] = blockTitle;
    });
  });

  return CONFIG;
});
