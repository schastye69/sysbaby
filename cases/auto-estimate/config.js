/* =============================================================================
   AUTOMOTIVE BODY & PAINT — trade configuration
   =============================================================================
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
    "material_percent": 31.76,
    "work_percent": 68.24,
    "vat_percent": 24,
    "company": {
      "name": "Confidential Client",
      "reg_nr": "16xxxxxx",
      "vat_nr": "EE10xxxxxx",
      "address": "",
      "phone": "+372 0000 0000",
      "email": "client@example.com",
      "iban": "EE00 0000 0000 0000 0000",
      "estimate_validity_days": 14,
      "warranty_months": 12
    },
    "paint_types": {
      "green": {
        "name": "Акрил (коммерческий транспорт)",
        "material_percent": 30,
        "markup_percent": 0,
        "dot": "#35c46b"
      },
      "yellow": {
        "name": "База + лак (общий транспорт)",
        "material_percent": 30,
        "markup_percent": 7.5,
        "dot": "#e8c552"
      },
      "red": {
        "name": "3-х слойная база + лак (общий транспорт)",
        "material_percent": 30,
        "markup_percent": 15,
        "dot": "#e05a4f"
      }
    },
    "base_parts": {
      "fender": {
        "name": "Крыло",
        "price": 350
      },
      "door": {
        "name": "Дверь",
        "price": 250
      },
      "bumper": {
        "name": "Бампер",
        "price": 400
      },
      "hood": {
        "name": "Капот",
        "price": 500
      },
      "roof": {
        "name": "Крыша",
        "price": 600
      },
      "trunk": {
        "name": "Багажник",
        "price": 450
      },
      "grille": {
        "name": "Решётка радиатора",
        "price": 150
      },
      "sill": {
        "name": "Порог",
        "price": 200
      },
      "arch": {
        "name": "Арка",
        "price": 180
      },
      "mirror": {
        "name": "Зеркало",
        "price": 120
      }
    },
    "variants": {
      "front_left": "переднее левое",
      "front_right": "переднее правое",
      "rear_left": "заднее левое",
      "rear_right": "заднее правое",
      "bumper_front": "передний",
      "bumper_rear": "задний",
      "lower_front": "юбка переднего бампера",
      "lower_rear": "юбка заднего бампера",
      "left": "левый",
      "right": "правый",
      "trim_left": "накладка порога, левая",
      "trim_right": "накладка порога, правая",
      "cover_left": "крышка зеркала, левая",
      "cover_right": "крышка зеркала, правая",
      "single": ""
    },
    "part_variants": {
      "fender": [
        "front_left",
        "front_right",
        "rear_left",
        "rear_right"
      ],
      "door": [
        "front_left",
        "front_right",
        "rear_left",
        "rear_right"
      ],
      "bumper": [
        "bumper_front",
        "lower_front",
        "bumper_rear",
        "lower_rear"
      ],
      "hood": [
        "single"
      ],
      "roof": [
        "single"
      ],
      "trunk": [
        "single"
      ],
      "grille": [
        "single"
      ],
      "sill": [
        "left",
        "right",
        "trim_left",
        "trim_right"
      ],
      "arch": [
        "front_left",
        "front_right",
        "rear_left",
        "rear_right"
      ],
      "mirror": [
        "front_left",
        "front_right",
        "cover_left",
        "cover_right"
      ]
    },
    "merged_block_parts": [
      "hood",
      "trunk",
      "roof",
      "grille"
    ],
    "category_custom": "Дополнительно",
    "category_services": "Услуги",
    "unit_item": "компл.",
    "unit_hour": "ч.",
    "tr_units": {
      "компл.": "kompl.",
      "ч.": "h"
    },
    "label_subject_primary": "Автомобиль (марка, модель)",
    "placeholder_subject_primary": "BMW 740",
    "label_subject_secondary": "Гос. номер",
    "placeholder_subject_secondary": "760 MHC",
    "placeholder_search": "🔍 Поиск по деталям и услугам (например: капот, полировка, зеркало)",
    "placeholder_custom_name": "Напр. Запчасть, доставка...",
    "doc_note": "Täiendava töömahu ilmnemisel võidakse lõpphinnale lisada juurdemakse, mille suurus määratakse tööde lõppedes vastavalt autoteeninduse hinnakirjale.",
    "reference_fields": [
      {
        "id": "vin",
        "label": "VIN номер",
        "placeholder": "WBA...",
        "doc_label": "VIN"
      },
      {
        "id": "insurance",
        "label": "Страховая компания",
        "placeholder": "Напр. If, LHV, Salva...",
        "doc_label": "Kindlustusselts"
      },
      {
        "id": "claim",
        "label": "Номер страхового случая",
        "placeholder": "Напр. CL-2026-00123",
        "doc_label": "Kahjujuhtumi nr"
      }
    ],
    "label_material_class": "Тип покраски",
    "label_logo": "Auto Estimate",
    "label_tagline": "Premium Body & Paint Estimate",
    "label_catalogue_section": "Детали кузова",
    "label_merged_block": "Кузовные панели",
    "summary_label_subject": "Автомобиль",
    "doc_label_subject_primary": "Sõiduk",
    "doc_label_subject_secondary": "Reg. number",
    "doc_name": "Смета",
    "doc_name_new": "Новая смета",
    "doc_name_dative": "смете/счёте",
    "doc_name_accusative": "смету",
    "doc_analytics_title": "Аналитика по сметам",
    "dense_qualifier_threshold": 8,
    "body_category": "Кузовные работы",
    "hour_rate": 35,
    "extra_services": {
      "complectation": {
        "name": "Комплектировка",
        "type": "hourly",
        "rate": 35
      },
      "rust_removal": {
        "name": "Удаление ржавчины",
        "type": "hourly",
        "rate": 35
      },
      "welding": {
        "name": "Сварочные работы",
        "type": "hourly",
        "rate": 35
      },
      "locksmith": {
        "name": "Слесарные работы",
        "type": "hourly",
        "rate": 35
      },
      "glass_replace": {
        "name": "Замена стёкол",
        "type": "fixed",
        "price": 60
      },
      "polishing": {
        "name": "Полировка",
        "type": "hourly",
        "rate": 45
      },
      "headlight_polish": {
        "name": "Полировка фары",
        "type": "fixed",
        "price": 30
      },
      "headlight_coating": {
        "name": "Покрытие фары лаком",
        "type": "fixed",
        "price": 60
      },
      "exterior_wash": {
        "name": "Наружная мойка авто",
        "type": "fixed",
        "price": 60
      },
      "interior_wash": {
        "name": "Химчистка салона",
        "type": "fixed",
        "price": 90
      }
    },
    "service_blocks": {
      "Ремонтные работы": [
        "complectation",
        "rust_removal",
        "welding",
        "locksmith",
        "glass_replace"
      ],
      "Дополнительные услуги": [
        "polishing",
        "headlight_polish",
        "headlight_coating",
        "exterior_wash",
        "interior_wash"
      ]
    },
    "tr_parts": {
      "Крыло": "Poritiib",
      "Дверь": "Uks",
      "Бампер": "Kaitseraud",
      "Капот": "Kapott",
      "Крыша": "Katus",
      "Багажник": "Pagasiruumi kaas",
      "Решётка радиатора": "Radiaatori võre",
      "Порог": "Lävepakk",
      "Арка": "Poritiiva kaar",
      "Зеркало": "Peegel"
    },
    "tr_variants": {
      "переднее левое": "vasak esi",
      "переднее правое": "parem esi",
      "заднее левое": "vasak taga",
      "заднее правое": "parem taga",
      "передний": "esine",
      "задний": "tagumine",
      "юбка переднего бампера": "esikaitseraua alaosa",
      "юбка заднего бампера": "tagakaitseraua alaosa",
      "левый": "vasak",
      "правый": "parem",
      "накладка порога, левая": "läve kate, vasak",
      "накладка порога, правая": "läve kate, parem",
      "крышка зеркала, левая": "peegli kate, vasak",
      "крышка зеркала, правая": "peegli kate, parem"
    },
    "tr_services": {
      "Комплектировка": "Komplekteerimistööd",
      "Удаление ржавчины": "Rooste eemaldamine",
      "Сварочные работы": "Keevitustööd",
      "Слесарные работы": "Lukksepatööd",
      "Замена стёкол": "Autoklaaside vahetus",
      "Полировка": "Poleerimine",
      "Полировка фары": "Esitule poleerimine",
      "Покрытие фары лаком": "Esitule lakikate (vajab eemaldamist)",
      "Наружная мойка авто": "Auto välispesu",
      "Химчистка салона": "Salongi pesu (keemiline puhastus)"
    },
    "tr_categories": {
      "Кузовные работы": "Kere osad",
      "Ремонтные работы": "Remonditööd",
      "Дополнительные услуги": "Lisateenused",
      "Дополнительно": "Lisakirjed",
      "Услуги": "Teenused"
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
