/* sys.baby OS — Шаблон.
 *
 * ЧТО ЭТО И ПОЧЕМУ ОНО ПЕРВОЕ.
 * Голосование Совета 19.08.2026 поставило это приложение первым среди
 * пользовательских: 41 балл из 50, высшие оценки от архитектуры (строится на
 * том, что уже есть) и от спроса (за этим вернутся на следующей неделе).
 * Оно же — ядро предложения проекта: «взять один ваш процесс и сделать его
 * повторяемым». До сих пор это обещание жило только словами на витрине.
 *
 * ЧТО ДЕЛАЕТ. Человек описывает свой процесс один раз — списком шагов. Дальше
 * каждый повтор этого процесса запускается одним нажатием и ведётся галочками.
 * Прогоны сохраняются: видно, что делалось, когда и чем кончилось.
 *
 * ДВА ПРАВИЛА, КОТОРЫЕ ОПРЕДЕЛЯЮТ КОНСТРУКЦИЮ:
 *
 *   1. ПРОГОН НЕ МЕНЯЕТСЯ ЗАДНИМ ЧИСЛОМ. Шаги копируются в прогон в момент
 *      запуска. Правка шаблона завтра не переписывает вчерашнюю работу — иначе
 *      запись о сделанном перестаёт быть записью. Это то же правило, по
 *      которому в проекте живёт реестр отменённых посылок.
 *
 *   2. ВСЁ ОСТАЁТСЯ У ЧЕЛОВЕКА. Данные лежат в хранилище его браузера под
 *      ключом профиля. Ничего никуда не отправляется — отправлять некуда,
 *      сервера у системы нет.
 *
 * СЛЕД, КОТОРЫЙ ЭТО ПРИЛОЖЕНИЕ ОСТАВЛЯЕТ, значит больше, чем кажется: ключ
 * sysbaby.templates входит в список признаков «у человека появилось своё дело»
 * (os/apps/build/build.js). Сделав первый шаблон, человек перестаёт видеть нашу
 * витрину открытой при входе. День, когда «первое время» кончилось, наступает
 * не по календарю.
 *
 * Охраняется tools/os-template-app.mjs.
 */
(function () {
  "use strict";

  var KEY = "sysbaby.templates";
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1z"/><path d="M9 9h6M9 12.5h4"/></svg>';

  /* ------------------------------------------------------------- хранилище */
  /* Тот же договор, что у остальных приложений системы: sbDB, если он есть,
     иначе localStorage. Своего хранилища приложение не заводит. */
  function dbGet(k) {
    try {
      if (window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(k);
      return localStorage.getItem(k);
    } catch (e) { return null; }
  }
  function dbSet(k, v) {
    try {
      if (window.sbDB && typeof window.sbDB.set === "function") { window.sbDB.set(k, v); return true; }
      localStorage.setItem(k, v);
      return true;
    } catch (e) { return false; }
  }

  function load() {
    var raw = dbGet(KEY);
    if (!raw) return { templates: [], runs: [] };
    try {
      var d = JSON.parse(raw);
      return {
        templates: Array.isArray(d.templates) ? d.templates : [],
        runs: Array.isArray(d.runs) ? d.runs : []
      };
    } catch (e) {
      /* Испорченную запись не стираем молча: молчаливая потеря данных — то,
         за что людям и приходится не доверять системам. */
      if (window.console) console.error("[template] запись не разобралась, начинаю с пустой");
      return { templates: [], runs: [] };
    }
  }
  function save(state) { return dbSet(KEY, JSON.stringify(state)); }

  var uid = function () {
    return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  };

  window.sbTemplates = {
    all: function () { return load(); },
    /* Наружу — для законов и для приложения «Спрос»: сколько процессов человек
       уже описал и сколько раз их прогонял. */
    counts: function () {
      var s = load();
      return { templates: s.templates.length, runs: s.runs.length };
    }
  };

  /* ------------------------------------------------------------------ вид */
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    var state = load();
    var openRun = win.__runId || null;

    host.innerHTML = "";
    host.classList.add("tpl-body");

    if (openRun) { renderRun(win, host, state, openRun); return; }

    var head = document.createElement("div");
    head.className = "tpl-head";
    head.innerHTML =
      '<div class="tpl-title">Ваши процессы</div>' +
      '<button class="btn small" type="button" id="tplNew">Описать процесс</button>';
    host.appendChild(head);

    var list = document.createElement("div");
    list.className = "tpl-list";
    host.appendChild(list);

    if (!state.templates.length) {
      list.innerHTML =
        '<p class="tpl-empty">Пока пусто. Опишите один процесс, который вы повторяете, — ' +
        'приёмку машины, выезд, счёт клиенту. Дальше каждый повтор запускается одним нажатием, ' +
        'а сделанное остаётся записанным.</p>';
    }

    state.templates.forEach(function (t) {
      var runs = state.runs.filter(function (r) { return r.templateId === t.id; });
      var open = runs.filter(function (r) { return !r.finishedAt; }).length;
      var card = document.createElement("div");
      card.className = "tpl-card";
      card.setAttribute("data-tpl", t.id);
      card.innerHTML =
        '<div class="tpl-card-main">' +
          '<div class="tpl-name">' + esc(t.name) + '</div>' +
          '<div class="tpl-meta">' + t.steps.length + ' шагов · прогонов: ' + runs.length +
            (open ? ' · в работе: ' + open : '') + '</div>' +
        '</div>' +
        '<div class="tpl-card-acts">' +
          '<button class="btn small primary" type="button" data-act="run">Запустить</button>' +
          '<button class="btn small" type="button" data-act="edit">Изменить</button>' +
        '</div>';
      list.appendChild(card);
    });

    if (state.runs.length) {
      var rh = document.createElement("div");
      rh.className = "tpl-title tpl-title-sub";
      rh.textContent = "Прогоны";
      host.appendChild(rh);
      var rl = document.createElement("div");
      rl.className = "tpl-list";
      host.appendChild(rl);
      state.runs.slice().reverse().slice(0, 12).forEach(function (r) {
        var done = r.steps.filter(function (s) { return s.done; }).length;
        var row = document.createElement("div");
        row.className = "tpl-run" + (r.finishedAt ? " is-done" : "");
        row.setAttribute("data-run", r.id);
        row.innerHTML =
          '<div class="tpl-card-main">' +
            '<div class="tpl-name">' + esc(r.name) + '</div>' +
            '<div class="tpl-meta">' + done + ' из ' + r.steps.length +
              (r.finishedAt ? ' · закрыт' : '') + '</div>' +
          '</div>' +
          '<button class="btn small" type="button" data-act="open">Открыть</button>';
        rl.appendChild(row);
      });
    }

    /* Слушатель ставится на тело окна ОДИН РАЗ за всё время его жизни.
       Первая версия вешала его при каждой отрисовке с once:true — и он
       снимался после первого же нажатия куда угодно: создать процесс ещё
       можно было, запустить его — уже нет. Ошибка нашлась на первом прогоне
       и стоила бы человеку доверия к приложению на второй минуте. */
    if (!host.__tplWired) {
      host.__tplWired = true;
      host.addEventListener("click", function (ev) {
        var btn = ev.target.closest ? ev.target.closest("button") : null;
        if (!btn) return;
        if (btn.id === "tplNew") { editTemplate(win, null); return; }
        var act = btn.getAttribute("data-act");
        var card = btn.closest(".tpl-card");
        var runRow = btn.closest(".tpl-run");
        if (act === "run" && card) { startRun(win, card.getAttribute("data-tpl")); return; }
        if (act === "edit" && card) { editTemplate(win, card.getAttribute("data-tpl")); return; }
        if (act === "open" && runRow) { win.__runId = runRow.getAttribute("data-run"); render(win); return; }
      });
    }
  }

  /* ------------------------------------------------------- правка шаблона */
  function editTemplate(win, id) {
    var host = bodyOf(win);
    var state = load();
    var tpl = id ? state.templates.filter(function (t) { return t.id === id; })[0] : null;
    var draft = tpl ? JSON.parse(JSON.stringify(tpl)) : { id: uid(), name: "", steps: [] };

    host.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "tpl-edit";
    wrap.innerHTML =
      '<div class="tpl-head">' +
        '<div class="tpl-title">' + (tpl ? "Изменить процесс" : "Описать процесс") + '</div>' +
        '<button class="btn small" type="button" id="tplBack">Назад</button>' +
      '</div>' +
      '<label class="tpl-field"><span>Название</span>' +
        '<input id="tplName" type="text" maxlength="60" placeholder="Приёмка машины" /></label>' +
      '<div class="tpl-steps" id="tplSteps"></div>' +
      '<button class="btn small" type="button" id="tplAdd">Добавить шаг</button>' +
      '<div class="tpl-foot">' +
        '<button class="btn primary" type="button" id="tplSave">Сохранить</button>' +
        (tpl ? '<button class="btn danger" type="button" id="tplDel">Удалить процесс</button>' : '') +
      '</div>';
    host.appendChild(wrap);
    wrap.querySelector("#tplName").value = draft.name;

    function paintSteps() {
      var box = wrap.querySelector("#tplSteps");
      box.innerHTML = "";
      draft.steps.forEach(function (st, i) {
        var row = document.createElement("div");
        row.className = "tpl-step-edit";
        row.innerHTML =
          '<span class="tpl-step-no">' + (i + 1) + '</span>' +
          '<input type="text" maxlength="120" value="' + esc(st.text) + '" data-i="' + i + '" />' +
          '<button class="btn tiny" type="button" data-up="' + i + '" aria-label="Выше">↑</button>' +
          '<button class="btn tiny" type="button" data-down="' + i + '" aria-label="Ниже">↓</button>' +
          '<button class="btn tiny danger" type="button" data-del="' + i + '" aria-label="Убрать">×</button>';
        box.appendChild(row);
      });
    }
    paintSteps();

    wrap.addEventListener("input", function (ev) {
      var i = ev.target.getAttribute && ev.target.getAttribute("data-i");
      if (i !== null && i !== undefined && draft.steps[+i]) draft.steps[+i].text = ev.target.value;
    });

    wrap.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t.getAttribute) return;
      if (t.id === "tplBack") { render(win); return; }
      if (t.id === "tplAdd") { draft.steps.push({ id: uid(), text: "" }); paintSteps(); return; }
      var up = t.getAttribute("data-up"), dn = t.getAttribute("data-down"), del = t.getAttribute("data-del");
      if (up !== null && +up > 0) { var a = draft.steps.splice(+up, 1)[0]; draft.steps.splice(+up - 1, 0, a); paintSteps(); return; }
      if (dn !== null && +dn < draft.steps.length - 1) { var b = draft.steps.splice(+dn, 1)[0]; draft.steps.splice(+dn + 1, 0, b); paintSteps(); return; }
      if (del !== null) { draft.steps.splice(+del, 1); paintSteps(); return; }
      if (t.id === "tplSave") {
        draft.name = (wrap.querySelector("#tplName").value || "").trim().slice(0, 60);
        draft.steps = draft.steps.filter(function (s) { return (s.text || "").trim(); });
        if (!draft.name) { wrap.querySelector("#tplName").focus(); return; }
        if (!draft.steps.length) { wrap.querySelector("#tplAdd").focus(); return; }
        var s = load();
        var idx = -1, k;
        for (k = 0; k < s.templates.length; k++) if (s.templates[k].id === draft.id) idx = k;
        if (idx >= 0) s.templates[idx] = draft; else s.templates.push(draft);
        save(s);
        render(win);
        return;
      }
      if (t.id === "tplDel") {
        var st = load();
        st.templates = st.templates.filter(function (x) { return x.id !== draft.id; });
        save(st);
        render(win);
      }
    });
  }

  /* ------------------------------------------------------------- прогоны */
  function startRun(win, templateId) {
    var s = load();
    var tpl = s.templates.filter(function (t) { return t.id === templateId; })[0];
    if (!tpl) return;
    var run = {
      id: uid(),
      templateId: tpl.id,
      name: tpl.name,
      startedAt: Date.now(),
      finishedAt: 0,
      /* ШАГИ КОПИРУЮТСЯ, А НЕ ССЫЛАЮТСЯ. Правка шаблона завтра не должна
         переписывать то, что человек делал вчера. */
      steps: tpl.steps.map(function (st) { return { id: st.id, text: st.text, done: false, at: 0 }; })
    };
    s.runs.push(run);
    save(s);
    win.__runId = run.id;
    render(win);
  }

  function renderRun(win, host, state, runId) {
    var run = state.runs.filter(function (r) { return r.id === runId; })[0];
    if (!run) { win.__runId = null; render(win); return; }
    var done = run.steps.filter(function (s) { return s.done; }).length;

    host.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "tpl-run-view";
    wrap.innerHTML =
      '<div class="tpl-head">' +
        '<div class="tpl-title">' + esc(run.name) + '</div>' +
        '<button class="btn small" type="button" id="tplBack">Назад</button>' +
      '</div>' +
      '<div class="tpl-progress"><i style="width:' +
        (run.steps.length ? Math.round((done / run.steps.length) * 100) : 0) + '%"></i></div>' +
      '<div class="tpl-meta tpl-progress-text">' + done + ' из ' + run.steps.length +
        (run.finishedAt ? ' · закрыт' : '') + '</div>' +
      '<div class="tpl-steps" id="tplRunSteps"></div>' +
      (run.finishedAt ? '' : '<div class="tpl-foot"><button class="btn primary" type="button" id="tplFinish">Закрыть прогон</button></div>');
    host.appendChild(wrap);

    var box = wrap.querySelector("#tplRunSteps");
    run.steps.forEach(function (st, i) {
      var row = document.createElement("label");
      row.className = "tpl-step" + (st.done ? " is-done" : "");
      row.innerHTML =
        '<input type="checkbox" data-step="' + i + '"' + (st.done ? " checked" : "") +
          (run.finishedAt ? " disabled" : "") + ' />' +
        '<span class="tpl-step-no">' + (i + 1) + '</span>' +
        '<span class="tpl-step-text">' + esc(st.text) + '</span>';
      box.appendChild(row);
    });

    wrap.addEventListener("change", function (ev) {
      var i = ev.target.getAttribute && ev.target.getAttribute("data-step");
      if (i === null || i === undefined) return;
      var s = load();
      var r = s.runs.filter(function (x) { return x.id === runId; })[0];
      if (!r || r.finishedAt) return;
      r.steps[+i].done = !!ev.target.checked;
      r.steps[+i].at = ev.target.checked ? Date.now() : 0;
      save(s);
      render(win);
    });

    wrap.addEventListener("click", function (ev) {
      if (!ev.target.getAttribute) return;
      if (ev.target.id === "tplBack") { win.__runId = null; render(win); return; }
      if (ev.target.id === "tplFinish") {
        var s = load();
        var r = s.runs.filter(function (x) { return x.id === runId; })[0];
        if (r) { r.finishedAt = Date.now(); save(s); }
        win.__runId = null;
        render(win);
      }
    });
  }

  if (window.registerApp) {
    window.registerApp("template", {
      title: "Template",
      label: "Template",
      i18n: {
        ru: { title: "Шаблон", label: "Шаблон" },
        ee: { title: "Mall", label: "Mall" }
      },
      color: "linear-gradient(160deg,#7ad1a8 0%,#3fae7e 52%,#1d7a53 100%)",
      icon: ICON,
      size: { w: 640, h: 620 },
      deskPos: { x: 260, y: 160 },
      retranslate: true,
      render: render
    });
  }
})();
