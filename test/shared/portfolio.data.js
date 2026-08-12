/* sys.baby — canonical portfolio data + safe-view helper.
 *
 * SHARED CONTRACT (landing.md section 18). Loaded by BOTH the landing page
 * (Cases window, hero proof line, seen-systems prefill) and the OS Portfolio
 * app. One file, two globals, attached to window (or globalThis outside a
 * browser):
 *
 *   sbPortfolio           Array of raw entry objects. Fields may be absent or
 *                         null. Consumers must NOT read them directly.
 *   sbPortfolioView(p, lang)
 *                         Pure function -> render-safe plain object. EVERY
 *                         consumer renders through this view, so a withheld
 *                         client name can never leak. Entries with
 *                         visibility === "private" are not surfaced publicly:
 *                         consumers skip them entirely (the view does not).
 *                         Pass a language and the entry's translated prose
 *                         comes back; omit it and English does. This is the
 *                         only place that decides which language a case is
 *                         speaking, so no consumer can get it half-right.
 *
 * View fields (derivations exact per spec/data/portfolio.json -> viewRules):
 *   name                  client only when visibility === "public", else title
 *   confidential          visibility !== "public"
 *   nameState             "named" | "withheld" | "not-yet-asked"
 *   resultsState          "measured" | "withheld" | "pending"
 *   results               measured sentence, else null
 *   resultsSource         "first-hand" | "client-reported" | null
 *   resultsPendingReason  defaults to "not-yet-asked"
 *   industry, scale, projectType, goal, lookFor    default ""
 *   features, tech, systemLanguages                default []
 *   explorePath, localeParam, startLabel           default null
 *
 * ENTRIES BELOW ARE GENERATED from /root/work/spec/data/portfolio.json by
 * tools/landing-build-data.js. Do not edit them by hand.
 */
(function (root) {
  "use strict";

  /* WHERE THE LIVE SYSTEMS LIVE
     ------------------------------------------------------------------
     The delivered system is a real program that runs on the visitor's own
     device: it prices, prints and archives with nothing behind it. It did
     not become a slideshow to get there — the arithmetic is the same
     arithmetic, replayed against the same golden vectors. That is the
     point of showing it.

     A static host cannot run them. If sys.baby is served from one (the
     Cloudflare build drops the `cases` folder for exactly that reason),
     point this at the host that CAN, with a trailing slash:

         root.SB_CASES_BASE = "https://systems.sys.baby/cases/";

     Leave it null and the paths stay relative, which is correct whenever
     the whole project is served from one PHP host — Termux included.
     Nothing else in the project needs to know. */
  root.SB_CASES_BASE = root.SB_CASES_BASE || null;

  function resolveCase(path) {
    if (!path) return null;
    if (/^https?:\/\//.test(path)) return path;          /* already absolute */
    if (!root.SB_CASES_BASE) return path;
    return String(root.SB_CASES_BASE).replace(/\/+$/, "/") +
      String(path).replace(/^(\.\.\/)?cases\//, "");
  }
  root.sbResolveCasePath = resolveCase;

  var sbPortfolio = [
    {
      "id": "dental-clinic-01",
      "real": true,
      "explorePath": null,
      "systemLanguages": [
        "et",
        "ru"
      ],
      "lookFor": "Open a patient, then the tooth chart. Marking a tooth builds the treatment plan and its price at the same time.",
      "startLabel": {
        "en": "Get one built for your practice",
        "ru": "Такую же для вашей практики",
        "ee": "Selline teie praksisele"
      },
      "visibility": "anonymous",
      "title": "Private dental clinic — Tallinn",
      "industry": "Private dental clinic (Estonia)",
      "scale": "12-table clinical database · offline · owned outright by the clinic",
      "projectType": "Complete clinic management system — chairside to cash drawer",
      "tech": [
        "PHP",
        "SQLite",
        "Offline-first",
        "Zero dependencies",
        "Print-native A4",
        "ET / RU bilingual"
      ],
      "features": [
        "Interactive odontogram in FDI notation, permanent and primary teeth",
        "Treatment estimates assembled from the chart, with A/B option comparison",
        "Invoicing with Estonian VAT law applied (KMS § 16 — treatment exempt, aesthetics taxed)",
        "Every printed document frozen as an immutable snapshot with a SHA-256 checksum",
        "Consent forms with tooth numbers carried over from the chart",
        "Day-close cash reconciliation and accountant export",
        "Appointment calendar by chair, with sterilisation buffers",
        "Validated backup and restore — the whole clinic is one file"
      ],
      "goal": "One offline system from chairside to cash drawer, owned outright by the clinic — no subscription, no external service, no patient data leaving the building.",
      "results": null,
      "resultsPendingReason": "not-yet-delivered",
      "i18n": {
        "ru": {
          "lookFor": "Откройте пациента, затем зубную карту. Отметка зуба одновременно строит план лечения и его стоимость.",
          "title": "Частная стоматология — Таллинн",
          "industry": "Частная стоматологическая клиника (Эстония)",
          "scale": "Клиническая база из 12 таблиц · офлайн · принадлежит клинике целиком",
          "projectType": "Полная система управления клиникой — от кресла до кассы",
          "features": [
            "Интерактивная одонтограмма в нотации FDI, постоянные и молочные зубы",
            "Сметы лечения собираются прямо из карты, со сравнением вариантов А и Б",
            "Счета с эстонским НДС (KMS § 16 — лечение освобождено, эстетика облагается)",
            "Каждый напечатанный документ заморожен как неизменяемый снимок с контрольной суммой SHA-256",
            "Согласия с номерами зубов, перенесёнными из карты",
            "Закрытие кассового дня и выгрузка для бухгалтера",
            "Календарь приёмов по креслам, с буфером на стерилизацию",
            "Проверенное резервное копирование и восстановление — вся клиника в одном файле"
          ],
          "goal": "Одна офлайн-система от кресла до кассы, принадлежащая клинике целиком — без подписки, без внешнего сервиса, без единой записи о пациенте за пределами здания."
        },
        "ee": {
          "lookFor": "Ava patsient, seejärel hambakaart. Hamba märkimine koostab korraga nii raviplaani kui ka selle hinna.",
          "title": "Erahambaravi — Tallinn",
          "industry": "Erahambaravikliinik (Eesti)",
          "scale": "12 tabeliga kliiniline andmebaas · võrguühenduseta · kuulub täielikult kliinikule",
          "projectType": "Täielik kliiniku haldussüsteem — toolist kassani",
          "features": [
            "Interaktiivne odontogramm FDI tähistuses, jäävad ja piimahambad",
            "Raviarvestused koostatakse kaardilt, A/B variantide võrdlusega",
            "Arved Eesti käibemaksuga (KMS § 16 — ravi maksuvaba, esteetika maksustatud)",
            "Iga trükitud dokument külmutatakse muutumatu hetktõmmisena SHA-256 kontrollsummaga",
            "Nõusolekulehed, kuhu hambanumbrid kanduvad kaardilt üle",
            "Päeva lõpu kassa kokkuvõte ja raamatupidaja eksport",
            "Vastuvõtukalender toolide kaupa, steriliseerimise puhvriga",
            "Kontrollitud varundus ja taaste — kogu kliinik on üks fail"
          ],
          "goal": "Üks võrguühenduseta süsteem toolist kassani, mis kuulub täielikult kliinikule — ilma tellimuseta, ilma välise teenuseta, ilma et ükski patsiendiandmete rida majast lahkuks."
        }
      },
      "origin": null,
      "nameWithheldByClient": true
    },
    {
      "id": "auto-estimate-01",
      "real": true,
      "explorePath": "../cases/auto-estimate/index.html",
      "systemLanguages": [
        "ru"
      ],
      "lookFor": "Tick a panel and a position. The quote, the VAT split and the payment request assemble as you go.",
      "startLabel": {
        "en": "Get one built for your workshop",
        "ru": "Такую же для вашей мастерской",
        "ee": "Selline teie töökojale"
      },
      "localeParam": null,
      "visibility": "anonymous",
      "nameWithheldByClient": true,
      "title": "Body repair workshop — Estonia",
      "client": null,
      "industry": "Automotive body repair (Estonia)",
      "scale": "Customer-facing quoting, printed documents, payment request — the whole program runs on the device that opens it",
      "projectType": "Customer-facing estimate & quoting tool",
      "tech": [
        "Responsive web",
        "Runs entirely in the browser",
        "No server, no account",
        "Print-native PDF",
        "SEPA payment QR",
        "E-signature"
      ],
      "features": [
        "Repair & paint estimate calculator",
        "PDF quote generation",
        "Payment QR (SEPA)",
        "E-signature capture",
        "Lightweight CRM"
      ],
      "goal": "Faster, more consistent customer quotes with fewer manual steps.",
      "results": "Preparing a customer quote took about an hour. It takes 15 minutes with this system.",
      "resultsSource": "first-hand",
      "i18n": {
        "ru": {
          "lookFor": "Отметьте деталь и позицию. Смета, разбивка НДС и запрос на оплату собираются по ходу.",
          "title": "Кузовной ремонт — Эстония",
          "industry": "Кузовной ремонт автомобилей (Эстония)",
          "scale": "Смета для клиента, печатные документы, запрос на оплату",
          "projectType": "Инструмент расчёта и выставления смет для клиента",
          "features": [
            "Калькулятор кузовного ремонта и покраски",
            "Формирование сметы в PDF",
            "Платёжный QR-код (SEPA)",
            "Подпись клиента на экране",
            "Лёгкая CRM"
          ],
          "goal": "Сметы быстрее и единообразнее, ручных шагов меньше.",
          "results": "Подготовка сметы занимала около часа. С этой системой — 15 минут."
        },
        "ee": {
          "lookFor": "Märgi detail ja positsioon. Pakkumine, käibemaksu jaotus ja maksenõue kogunevad käigu pealt.",
          "title": "Kere- ja värvitöökoda — Eesti",
          "industry": "Autode keretööd (Eesti)",
          "scale": "Kliendile suunatud pakkumine, trükitavad dokumendid, maksenõue",
          "projectType": "Kliendile suunatud kalkulatsiooni- ja pakkumistööriist",
          "features": [
            "Kere- ja värvitööde kalkulaator",
            "Pakkumise koostamine PDF-ina",
            "Makse QR-kood (SEPA)",
            "Kliendi allkiri ekraanil",
            "Kerge CRM"
          ],
          "goal": "Kiiremad ja ühtlasemad pakkumised, vähem käsitsi samme.",
          "results": "Pakkumise koostamine võttis umbes tunni. Selle süsteemiga 15 minutit."
        }
      },
      "origin": null
    }
  ];

  /* Work that exists but has nothing to open yet. Kept beside the entries and
     not inside them, because it is a different KIND of fact: a count and a
     state, with no client, no name and nothing to demonstrate. Both surfaces
     read this one object, so the number can never be right in one place and
     stale in the other. */
  var sbPortfolioPipeline = {
    "_note": "Work that is real but has nothing to open yet. The portfolio shows a count and a state, never a name or a promise. Update inApproval here and both surfaces follow.",
    "inApproval": 3,
    "i18n": {
      "en": {
        "label": "In approval",
        "note": "Scoped, quoted and waiting on a decision. They appear here when there is something running to open — not before.",
        "nearlyLabel": "Nearly agreed",
        "nearlyNote": "Terms settled, start not yet signed. It moves up to the work above only when there is something running."
      },
      "ru": {
        "label": "На согласовании",
        "note": "Оценены и ждут решения. Появятся здесь, когда будет что открыть, — не раньше.",
        "nearlyLabel": "Почти договорено",
        "nearlyNote": "Условия согласованы, старт ещё не подписан. Поднимется к работам выше только когда будет что открыть."
      },
      "ee": {
        "label": "Kooskõlastamisel",
        "note": "Hinnastatud ja ootavad otsust. Ilmuvad siia siis, kui on midagi avada — mitte varem.",
        "nearlyLabel": "Peaaegu kokku lepitud",
        "nearlyNote": "Tingimused kokku lepitud, algus veel allkirjastamata. Tõuseb ülal olevate tööde juurde alles siis, kui on midagi avada."
      }
    },
    "nearlyAgreed": 1
  };

  /* The two ways work arrives. Named here rather than spelled into each entry
     so the wording is one decision, not one per case study. Deliberately only
     two: anything finer would be guessing at the shape of a conversation. */
  var sbPortfolioOrigins = {
    introduced: {
      label: "Began with an introduction",
      i18n: {
        ru: { label: "Началось со знакомства" },
        ee: { label: "Algas tutvustusest" }
      }
    },
    direct: {
      label: "Came to us directly",
      i18n: {
        ru: { label: "Пришли напрямую" },
        ee: { label: "Tulid otse" }
      }
    }
  };

  /* Each count is rendered as a numeral on its own and never spelled into the
     sentence, so the copy carries no plural agreement to get wrong in three
     languages — and changing a number cannot leave the prose lying.

     Two states, not one, and deliberately kept apart. "Nearly agreed" is a
     stronger claim than "in approval", and collapsing them would round the
     truth upwards — which is the one thing a portfolio built on evidence
     cannot afford to do. A state with a count of zero renders nothing at all
     rather than an empty shelf explaining its own emptiness. */
  function sbPipelineView(lang) {
    var p = sbPortfolioPipeline || {};
    var loc = (p.i18n && lang && p.i18n[lang]) || (p.i18n && p.i18n.en) || {};
    function row(countKey, labelKey, noteKey) {
      var n = parseInt(p[countKey], 10);
      if (!isFinite(n) || n <= 0) return null;
      return { count: n, label: loc[labelKey] || "", note: loc[noteKey] || "" };
    }
    var approval = row("inApproval", "label", "note");
    var nearly = row("nearlyAgreed", "nearlyLabel", "nearlyNote");
    if (!approval && !nearly) return null;
    /* Strongest state first: the reader meets the nearest thing to real work
       before the more distant one. */
    var rows = [];
    if (nearly) rows.push(nearly);
    if (approval) rows.push(approval);
    /* The first row stays on the object itself so every existing consumer —
       and every existing test — keeps working unchanged. */
    var head = rows[0];
    return { count: head.count, label: head.label, note: head.note, rows: rows };
  }

  /* HOW A RELATIONSHIP BEGAN
     A portfolio full of testimonials proves nothing; a portfolio that can say
     how each piece of work arrived proves something real. This is that field.
     It is never inferred and never guessed: an entry with no recorded origin
     returns null and the interface shows nothing, because "we do not know"
     and "they came to us directly" are different facts. */
  function sbOriginView(p, lang) {
    p = p || {};
    if (!p.origin) return null;
    var t = (sbPortfolioOrigins && sbPortfolioOrigins[p.origin]) || null;
    if (!t) return null;
    var loc = (t.i18n && lang && t.i18n[lang]) || {};
    return { kind: p.origin, label: loc.label || t.label || "" };
  }

  /* One localisation path for both surfaces. The landing and the OS portfolio
     both read through this function, so a translated field is translated in
     both places or in neither — there is no second table to keep in step.
     Anything a language does not carry falls back to the English original
     rather than to an empty string: a missing translation shows the sentence
     it was made from, never a hole. */
  function sbPortfolioView(p, lang) {
    p = p || {};
    var loc = (p.i18n && lang && p.i18n[lang]) || {};
    function t(key) {
      return Object.prototype.hasOwnProperty.call(loc, key) ? loc[key] : p[key];
    }
    return {
      name: (p.visibility === "public" && p.client) ? p.client : t("title"),
      confidential: p.visibility !== "public",
      nameState: p.visibility === "public"
        ? "named"
        : (p.nameWithheldByClient ? "withheld" : "not-yet-asked"),
      industry: t("industry") || "",
      scale: t("scale") || "",
      explorePath: resolveCase(p.explorePath) || null,
      systemLanguages: p.systemLanguages || [],
      localeParam: p.localeParam || null,
      lookFor: t("lookFor") || "",
      startLabel: p.startLabel || null,
      projectType: t("projectType") || "",
      features: t("features") || [],
      tech: p.tech || [],
      goal: t("goal") || "",
      resultsState: p.results === "withheld"
        ? "withheld"
        : (p.results ? "measured" : "pending"),
      resultsSource: p.resultsSource || null,
      resultsPendingReason: p.resultsPendingReason || "not-yet-asked",
      results: (typeof p.results === "string" && p.results !== "withheld") ? (t("results") || p.results) : null,
      /* null unless the origin was actually recorded — see sbOriginView */
      origin: sbOriginView(p, lang)
    };
  }

  root.sbPortfolio = sbPortfolio;
  root.sbPortfolioView = sbPortfolioView;
  root.sbPortfolioPipeline = sbPortfolioPipeline;
  root.sbPipelineView = sbPipelineView;
  root.sbPortfolioOrigins = sbPortfolioOrigins;
  root.sbOriginView = sbOriginView;
})(typeof window !== "undefined" ? window : globalThis);
