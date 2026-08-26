/* sys.baby OS — Просмотр (Viewer): смотровая, одна на всю систему.
 *
 * ПОВОД — очередь приложений, названная Советом по просьбе основателя
 * развивать приложения. Вторым пунктом стоял «Просмотр».
 *
 * ПОЧЕМУ ЭТО СРЕДСТВО, А НЕ ЗНАЧОК НА СТОЛЕ. Вещи приходят не только из
 * Хранилища: снимок в письме, документ, помянутый в заметке. Если смотреть
 * умеет только Хранилище, каждое следующее приложение заведёт свою
 * смотровую — и система получит четыре похожих. Директива §05: не «что ещё
 * добавить», а «что уже есть и можно усилить». Поэтому смотровая объявлена
 * наружу как window.sbView(номер) и принадлежит всем.
 *
 * ОКНО ОДНО. Открыли вторую вещь — та же смотровая показывает её. Причина
 * измеренная: потолок стола — девять окон (D-104), и десять снимков съели бы
 * его целиком. Смотровая — место, куда смотрят, а не вещь, которую копят.
 *
 * Охраняется tools/viewer-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>';

  var KIND_SVG = {
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/><path d="M8 12.5h7M8 15.5h7M8 18h4"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9.5h3l4-3v11l-4-3H5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.8a7.5 7.5 0 0 1 0 10.4"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M10 9.5l5 2.5-5 2.5z"/></svg>',
    thing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/></svg>'
  };

  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function toast(title, text) { if (window.showToast) window.showToast(title, text, ""); }

  function kindOf(mime, name) {
    var m = String(mime || "").toLowerCase(), n = String(name || "").toLowerCase();
    if (m.indexOf("image/") === 0) return "image";
    if (m.indexOf("audio/") === 0) return "sound";
    if (m.indexOf("video/") === 0) return "film";
    if (m.indexOf("pdf") !== -1 || /\.(pdf|docx?|odt|rtf|pages|xlsx?|pptx?)$/.test(n)) return "doc";
    return "thing";
  }
  function kindWord(kind) { return t("fv.kind" + kind.charAt(0).toUpperCase() + kind.slice(1)); }
  function weigh(bytes) {
    var b = Number(bytes) || 0;
    if (b < 1024) return b + " " + t("fv.unitB");
    if (b < 1024 * 1024) return Math.round(b / 1024) + " " + t("fv.unitKB");
    return (Math.round(b / 104857.6) / 10) + " " + t("fv.unitMB");
  }

  /* Что показывает смотровая прямо сейчас. Хранится здесь, а не в окне:
     окно можно закрыть и открыть, а показанное не должно теряться. */
  var current = null;   /* { id, name, mime, size, kind, blob } */
  var urls = [];
  function release() {
    urls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) { /* ignore */ } });
    urls = [];
  }
  function url(blob) { var u = URL.createObjectURL(blob); urls.push(u); return u; }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    release();
    /* Перерисовка не отменяет чужого движения: прокрутка человека переживает
       её — средство оболочки, общее для всех приложений (D-098). Смотровая
       сегодня прокручивается редко, но правило про завтра, а не про сегодня:
       на этом законе оно и поймало новорождённое приложение. */
    if (!current) {
      var keepEmpty = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
      host.innerHTML = '<div class="app-viewer"><div class="vw-empty">' +
        esc(t("vw.empty")) + "</div></div>";
      if (keepEmpty) keepEmpty();
      return;
    }
    var body;
    if (current.kind === "image") {
      body = '<div class="vw-stage"><img class="vw-img" alt="' + esc(current.name) + '" src="' + url(current.blob) + '"></div>';
    } else if (current.kind === "film") {
      body = '<div class="vw-stage"><video class="vw-media" controls src="' + url(current.blob) + '"></video></div>';
    } else if (current.kind === "sound") {
      body = '<div class="vw-stage vw-said"><div class="vw-icon">' + KIND_SVG.sound + "</div>" +
        '<audio class="vw-media" controls src="' + url(current.blob) + '"></audio></div>';
    } else {
      /* Документ система не показывает, а НАЗЫВАЕТ. Обещать просмотр и
         показать пустоту хуже, чем сказать словами: система не заявляет о
         том, чего не сделала. */
      body = '<div class="vw-stage vw-said">' +
        '<div class="vw-icon">' + (KIND_SVG[current.kind] || KIND_SVG.thing) + "</div>" +
        '<div class="vw-said-text">' + esc(t("vw.notShown")) + "</div></div>";
    }
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-viewer">' + body +
        '<div class="vw-bar">' +
          '<div class="vw-what" data-sb-userdata>' +
            esc(t("fv.thingKind", { kind: kindWord(current.kind), size: weigh(current.size) })) +
          "</div>" +
          '<button type="button" class="vw-save" id="vwSave">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v10M8.2 11l3.8 3.8L15.8 11M5 18.5h14"/></svg>' +
            "<span>" + esc(t("fv.thingSave")) + "</span></button>" +
        "</div>" +
      "</div>";
    if (keep) keep();
    var save = host.querySelector("#vwSave");
    if (save) save.addEventListener("click", function () {
      var a = doc.createElement("a");
      a.href = url(current.blob);
      a.download = current.name || "thing";
      doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
    });
  }

  /* Полоса окна называет ВЕЩЬ, а не приложение: человек видит, что открыто,
     не заглядывая внутрь. Имя ставится после отрисовки — оболочка пишет своё
     при каждом открытии. */
  function nameWindow() {
    var win = (window.openWindows || {}).viewer;
    if (!win || !win.el) return;
    var nameEl = win.el.querySelector(".win-name");
    if (nameEl) nameEl.textContent = current ? current.name : t("vw.title");
  }

  window.sbView = function (thingId) {
    if (!window.sbThings) { toast(t("vw.gone"), t("vw.goneNote")); return Promise.resolve(false); }
    return window.sbThings.get(thingId).then(function (rec) {
      if (!rec || !rec.blob) {
        /* Неудача не стирает того, что уже открыто: чужая ошибка не отбирает
           у человека вещь, которую он смотрел. */
        toast(t("vw.gone"), t("vw.goneNote"));
        return false;
      }
      current = {
        id: thingId, name: rec.name || "вещь", mime: rec.mime || "",
        size: rec.size || 0, kind: kindOf(rec.mime, rec.name), blob: rec.blob
      };
      if (window.sbOpenApp) window.sbOpenApp("viewer");
      var win = (window.openWindows || {}).viewer;
      if (win) render(win);
      nameWindow();
      setTimeout(nameWindow, 60);
      return true;
    });
  };

  if (typeof window.registerApp === "function") {
    window.registerApp("viewer", {
      title: "Viewer",
      i18n: {
        ru: { title: "Просмотр", label: "Просмотр" },
        ee: { title: "Vaade", label: "Vaade" }
      },
      label: "Viewer",
      color: "linear-gradient(160deg,#8fb4ff 0%,#5b7cff 52%,#3a5ce2 100%)",
      icon: ICON,
      size: { w: 720, h: 560 },
      /* Значка на столе нет: приложение, которое без вещи показать ничего не
         может, — это обещание, которого стол не выполняет. */
      hidden: true,
      render: render
    });
  }
})();
