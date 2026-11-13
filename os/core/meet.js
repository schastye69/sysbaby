/* sys.baby OS — core/meet.js
 * Заготовка П0 (v178-H4a, D-800). Владелец — П2: знакомство, sbAddr.
 *
 * ЗНАКОМСТВО РАЗГОВОРОМ · архив «Дом — мой», решения D-830…D-835.
 * Основатель 10–11.11.2026, утверждённое демо dom-moy-A (сцены 1–3, 6):
 *   · при первом слове — надёжное окно: только «как к вам обращаться» и имя
 *     системы; оба необязательны;
 *   · дальше голос дома спрашивает по одному вопросу: ты/вы → род (мягко) →
 *     как звать дом (она / он / просто дом);
 *   · касание пустого стола вместо ответа — «вы», без рода, «просто дом», и
 *     дом больше не спрашивает (meet-optional-check);
 *   · важное — разговором: «запишем код восстановления — да или позже?»;
 *     «да» — надёжное окно ключницы у строки кода, «позже» — тихо.
 *
 * ЧТО ДОМ УЗНАЛ, ЛЕЖИТ ПОД ЗАМКОМ: sbDB «sysbaby.meet.v1». Пока мир заперт,
 * sbAddr отвечает «по умолчанию» и не знает имени (meet-never-gate-check).
 *
 * window.sbAddr — обращение для всех (голос П1, стол П3, Настройки):
 *   .V(ты, вы) · .R(м, ж, без рода) · .H(она, он, дом) — по профилю; последним
 *   аргументом можно дать профиль-образец { ty, rod, dom, name, sys };
 *   .fill(строка, образец?) — собирает {V:…|…} {R:…|…|…} {H:…|…|…} {N:…|…}
 *   {name} {sys} (вложение допустимо); .t(ключ, vars, образец?) — sbT + fill;
 *   .name() .sys() .pub() .get() .set(patch) .view() .setView("lines"|"dust").
 * «Время на столе: линии света · пыль света» — выбор в Настройках → «Знакомство»;
 * лежит в localStorage «sysbaby.desktime.view» (его читает время на столе П3),
 * тот же выбор задаёт вид голоса; событие sb:desktime { view }.
 *
 * window.sbMeet — разговор: .pending() .state() .again() .first(). */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var KEY = "sysbaby.meet.v1", VIEW_KEY = "sysbaby.desktime.view";
  var DEF_SYS = "sys.baby";

  /* Вопросы по языку: «ты/вы» и род — свойства языка, а не системы. В EN нет
     ни того, ни другого; в ET есть «sina/teie», рода нет (не выдумывать). */
  var ASK = { ru: ["ty", "rod", "dom"], ee: ["ty"], en: [] };
  var MAP = { ty: ["ty", "vy"], rod: ["m", "f", "none"], dom: ["she", "he", "dom"], code: ["yes", "later"] };

  function blank() {
    return { v: 1, met: false, name: "", sys: DEF_SYS, pub: false, code: "none",
      ans: { ty: null, rod: null, dom: null },
      how: { ty: "none", rod: "none", dom: "none" } };   /* none — не спрошено; ask — ответ в разговоре; def — без ответа; set — в Настройках */
  }
  function closed() { try { return !window.sbDB || (window.sbDB.closed && window.sbDB.closed()); } catch (e) { return true; } }
  var P = null, Pepoch = -1;
  function prof() {
    if (closed()) return blank();                       /* за дверью — ничего не знаем */
    var ep = window.sbDB.epoch ? window.sbDB.epoch() : 0;
    if (P && ep === Pepoch) return P;
    var raw = null, x = null;
    try { raw = window.sbDB.get(KEY); } catch (e) { raw = null; }
    try { x = raw ? JSON.parse(raw) : null; } catch (e) { x = null; }
    var b = blank();
    if (x && typeof x === "object") {
      b.met = !!x.met; b.name = clip(x.name); b.sys = clip(x.sys) || DEF_SYS; b.pub = !!x.pub;
      b.code = /^(none|yes|later)$/.test(x.code) ? x.code : "none";
      /* D-826: когда человек сказал «позже» и сколько раз — чтобы спросить снова, а не никогда. */
      b.codeLaterAt = Number(x.codeLaterAt) > 0 ? Number(x.codeLaterAt) : 0;
      b.codeAsks = Math.min(99, Math.max(0, Number(x.codeAsks) | 0));
      /* ОТКАТ: старая запись «позже» без даты — считаем, что сказано сейчас (спросим через 3 дня, а не сразу и не никогда). */
      if (b.code === "later" && !b.codeLaterAt) { b.codeLaterAt = Date.now(); b.codeAsks = b.codeAsks || 1; }
      ["ty", "rod", "dom"].forEach(function (k) {
        var a = x.ans && x.ans[k], h = x.how && x.how[k];
        b.ans[k] = MAP[k].indexOf(a) >= 0 ? a : null;
        b.how[k] = /^(none|ask|def|set)$/.test(h) ? h : "none";
      });
    }
    P = b; Pepoch = ep;
    return P;
  }
  function clip(s) { return String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, "").trim().slice(0, 24); }
  function save() {
    if (closed() || !P) return;
    try { window.sbDB.set(KEY, JSON.stringify(P)); } catch (e) { /* ignore */ }
    changed();
  }
  function changed() {
    var d = { ty: cur().ty, rod: cur().rod, dom: cur().dom, pub: P ? P.pub : false };
    if (window.sbEvent) window.sbEvent("sb:addr", d);
    else { try { window.dispatchEvent(new CustomEvent("sb:addr", { detail: d })); } catch (e) { /* ignore */ } }
  }
  /* Текущее обращение одним объектом; образец o — поверх. */
  function cur(o) {
    var p = prof();
    var r = { ty: p.ans.ty === "ty" ? "ty" : "vy", rod: p.ans.rod || "none", dom: p.ans.dom || "dom", name: p.name, sys: p.sys || DEF_SYS };
    if (o && typeof o === "object") for (var k in r) if (Object.prototype.hasOwnProperty.call(o, k) && o[k] != null) r[k] = o[k];
    return r;
  }
  function lang() { try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; } }

  /* ── формы в строке: {V:ты|вы} {R:м|ж|без} {H:она|он|дом} {N:с именем|без} ── */
  function parse(s) {
    var pos = 0;
    function seq(inner) {
      var out = [], buf = "";
      while (pos < s.length) {
        var c = s.charAt(pos);
        if (inner && (c === "|" || c === "}")) break;
        if (c === "{" && /^[VRHN]:/.test(s.substr(pos + 1, 2))) {
          if (buf) { out.push(buf); buf = ""; }
          var kind = s.charAt(pos + 1), parts = [], raw = [], st;
          pos += 3;
          for (;;) {
            st = pos; parts.push(seq(true)); raw.push(s.slice(st, pos));
            if (s.charAt(pos) === "|") { pos++; continue; }
            if (s.charAt(pos) === "}") pos++;
            break;
          }
          out.push({ k: kind, parts: parts, raw: raw });
          continue;
        }
        var m = c === "{" ? /^\{\w+\}/.exec(s.slice(pos)) : null;
        if (m) { buf += m[0]; pos += m[0].length; continue; }
        buf += c; pos++;
      }
      if (buf) out.push(buf);
      return out;
    }
    return seq(false);
  }
  function pickIdx(k, a) {
    if (k === "V") return a.ty === "ty" ? 0 : 1;
    if (k === "R") return a.rod === "m" ? 0 : a.rod === "f" ? 1 : 2;
    if (k === "H") return a.dom === "she" ? 0 : a.dom === "he" ? 1 : 2;
    return a.name ? 0 : 1;
  }
  function render(ast, a) {
    var out = "";
    for (var i = 0; i < ast.length; i++) {
      var n = ast[i];
      if (typeof n === "string") out += n.replace(/\{name\}/g, a.name || "").replace(/\{sys\}/g, a.sys || DEF_SYS);
      else { var p = n.parts[pickIdx(n.k, a)] || n.parts[n.parts.length - 1] || []; out += render(p, a); }
    }
    return out;
  }
  function fill(s, o) { return render(parse(String(s == null ? "" : s)), cur(o)); }
  function tokens(s) {
    var list = [];
    (function walk(ast) { ast.forEach(function (n) { if (typeof n !== "string") { list.push({ kind: n.k, parts: n.raw }); n.parts.forEach(walk); } }); })(parse(String(s == null ? "" : s)));
    return list;
  }
  function tr(key, vars, o) { var s = window.sbT ? window.sbT(key, vars) : key; return fill(s, o); }

  /* ── время на столе: линии света · пыль света ── */
  function view() { var v = null; try { v = localStorage.getItem(VIEW_KEY); } catch (e) { v = null; } return v === "dust" ? "dust" : "lines"; }
  function setView(v) {
    v = v === "dust" ? "dust" : "lines";
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) { /* ignore */ }
    root.setAttribute("data-sb-desktime", v);
    if (window.sbEvent) window.sbEvent("sb:desktime", { view: v });
    else { try { window.dispatchEvent(new CustomEvent("sb:desktime", { detail: { view: v } })); } catch (e) { /* ignore */ } }
    return v;
  }

  window.sbAddr = {
    V: function (t, v, o) { return cur(o).ty === "ty" ? t : v; },
    R: function (m, f, n, o) { var r = cur(o).rod; return r === "m" ? m : r === "f" ? f : n; },
    H: function (she, he, d, o) { var r = cur(o).dom; return r === "she" ? she : r === "he" ? he : d; },
    fill: fill, t: tr, tokens: tokens,
    name: function () { return cur().name || ""; },
    sys: function () { return cur().sys || DEF_SYS; },
    pub: function () { return !!prof().pub; },
    get: function () { var p = prof(); return JSON.parse(JSON.stringify(p)); },
    /* set({ ty:"ty"|"vy", rod, dom, name, sys, pub }) — из Настроек: ответ «задан здесь». */
    set: function (patch) {
      if (closed() || !patch) return false;
      var p = prof();
      ["ty", "rod", "dom"].forEach(function (k) {
        if (patch[k] == null) return;
        var v = patch[k]; if (MAP[k].indexOf(v) < 0) return;
        p.ans[k] = v; p.how[k] = "set";
      });
      if (patch.name != null) {
        p.name = clip(patch.name);
        /* одно имя на весь дом (D-1001-ONE-NAME): имя из «Знакомства» доходит до шапки и Общего */
        if (!patch.fromName && typeof window.sbSetUsername === "function") {
          try { window.sbSetUsername(p.name); p.name = clip(window.sbUsernameStored && window.sbUsernameStored() ? window.sbGetUsername() : ""); } catch (e) { /* ignore */ }
        }
      }
      if (patch.sys != null) p.sys = clip(patch.sys) || DEF_SYS;
      if (patch.pub != null) p.pub = !!patch.pub;
      save();
      return true;
    },
    view: view, setView: setView
  };
  try { root.setAttribute("data-sb-desktime", view()); } catch (e) { /* ignore */ }

  /* ── голос: договор П1 (sbVoice.say); пока голоса нет — своя строка у низа ── */
  var line = null;
  function wordsOf(text) { var w = [], m, re = /\[([^\]]+)\]/g; while ((m = re.exec(text))) w.push(m[1]); return w; }
  function speak(text, opt) {
    opt = opt || {};
    var V = window.sbVoice;
    /* Голос есть — говорит только он (D-822: кроме голоса — ничего). Не
       сказал (у ворот, на входе он молчит) — молчит и знакомство: своя
       строка #sbMeetLine встаёт только там, где голоса нет вовсе. */
    if (V && typeof V.say === "function") {
      try { return V.say(text, opt); } catch (e) { if (window.console) console.error("[meet] голос упал", e); return null; }
    }
    return fallback(text, opt);
  }
  /* Своя строка: одна фраза, у низа, слова — настоящие <button>, aria-live. */
  function fallback(text, opt) {
    if (!line) {
      line = doc.createElement("div"); line.id = "sbMeetLine"; line.setAttribute("role", "status"); line.setAttribute("aria-live", "polite");
      (doc.getElementById("desktop") || doc.body).appendChild(line);
    }
    line.textContent = ""; line.hidden = false;
    var parts = String(text).split(/(\[[^\]]+\])/), idx = 0, gone = false, timer = 0, res;
    parts.forEach(function (p) {
      if (!p) return;
      if (p.charAt(0) === "[") {
        var w = p.slice(1, -1), i = idx++, b = doc.createElement("button");
        b.type = "button"; b.className = "sb-meet-w"; b.textContent = w; b.setAttribute("aria-label", w);
        b.addEventListener("click", function (e) { e.stopPropagation(); if (opt.on) opt.on(w, i); });
        line.appendChild(b);
      } else line.appendChild(doc.createTextNode(p));
    });
    var done = new Promise(function (r) { res = r; });
    var h = { el: line, done: done, dismiss: function () {
      if (gone) return; gone = true; clearTimeout(timer);
      if (line) { line.hidden = true; line.textContent = ""; }
      if (opt.melt) opt.melt(); res();
    } };
    if (!opt.keep) timer = setTimeout(h.dismiss, 2600 + String(text).length * 55);
    return h;
  }
  function typing() { try { return !!(window.sbVoice && window.sbVoice.state && window.sbVoice.state().typing); } catch (e) { return false; } }

  /* ── разговор ── */
  var Q = null, asked = 0, busy = false, lastSkip = 0, flowT = 0;
  function deskReady() {
    return !closed() && !doc.getElementById("sbVaultGate") && !doc.getElementById("sbCurtain") && !!doc.getElementById("desktop") && !!window.sbT;
  }
  function todo() {
    var p = prof(); if (!p.met) return [];
    return (ASK[lang()] || []).filter(function (k) { return p.how[k] === "none"; });
  }
  function needCode() {
    var p = prof(), V = window.sbVault;
    if (!p.met || !V || !V.recoveryMake || !V.recoveryState) return false;
    /* D-826: касание стола — «спроси позже», а не «никогда». Код восстановления —
       второй путь к миру; без него забытое слово = потерянный дом. Вопрос
       возвращается через 3 дня, потом через 7, пока код не заведён. */
    if (p.code === "later") {
      var gap = (p.codeAsks || 1) <= 1 ? 3 : 7;
      if (Date.now() - (p.codeLaterAt || 0) < gap * 86400000) return false;
    } else if (p.code !== "none") return false;
    try { if (V.isLocked && !V.isLocked()) return false; var s = V.recoveryState(); return !(s && s.at); } catch (e) { return false; }
  }
  function soon(ms) { clearTimeout(flowT); flowT = setTimeout(flow, ms); }
  function flow() {
    if (Q || busy || firstOpen()) return;
    if (!deskReady()) return soon(800);
    var n = todo()[0];
    if (n) return ask(n);
    if (needCode()) return ask("code");
  }
  function ask(k) {
    var key = k === "code" ? "meet.code.q" : "meet.ask." + (k === "ty" ? "addr" : k);
    var text = tr(key);
    var q = { k: k, text: text, words: wordsOf(text), t0: Date.now(), done: false };
    Q = q; asked++;
    q.h = speak(text, {
      keep: true,
      warm: k !== "code",                    /* вопросы знакомства не пишутся никуда */
      kind: k === "code" ? "event" : undefined,
      on: function (w, i) { answer(q, typeof i === "number" ? i : q.words.indexOf(w)); },
      onDesk: function () { desk(q); },
      melt: function () { if (Q === q && !q.done) { /* фраза ушла без ответа (голос увёл её сам) — спросим в другой раз */ Q = null; } }
    });
    /* голос не взял вопрос (молчит у ворот) — спросим, когда дом откроется */
    if (!q.h && Q === q) { Q = null; asked--; soon(1500); }
  }
  function close(q) { q.done = true; if (Q === q) Q = null; try { if (q.h && q.h.dismiss) q.h.dismiss(); } catch (e) { /* ignore */ } }
  function answer(q, i) {
    if (q.done || Q !== q || i < 0) return;
    var v = MAP[q.k][i]; if (!v) return;
    var p = prof();
    close(q);
    if (q.k === "code") {
      p.code = v; if (v === "later") { p.codeLaterAt = Date.now(); p.codeAsks = (p.codeAsks || 0) + 1; } save();
      if (v === "yes" && window.sbOpenAccountAt) setTimeout(function () { window.sbOpenAccountAt("#sbLockSpare"); }, 300);   /* надёжное окно ключницы */
      return;
    }
    p.ans[q.k] = v; p.how[q.k] = "ask"; save();
    busy = true;
    setTimeout(function () {
      busy = false;
      if (todo().length) return flow();
      thanks().then(function () { soon(600); });
    }, 300);
  }
  function thanks() { busy = true; var h = speak(tr("meet.thanks"), { warm: true }); return Promise.resolve(h && h.done).then(function () { busy = false; }, function () { busy = false; }); }
  /* Касание пустого стола вместо ответа: «вы», без рода, «просто дом»; больше не спрашивает. */
  function desk(q) {
    if (q.done || Q !== q || Date.now() - q.t0 < 350) return false;
    lastSkip = Date.now();
    var p = prof();
    close(q);
    if (q.k === "code") { p.code = "later"; p.codeLaterAt = Date.now(); p.codeAsks = (p.codeAsks || 0) + 1; save(); return true; }   /* тихо; спросит снова через 3/7 дней (D-826) */
    var tyOpen = p.how.ty === "none";
    ["ty", "rod", "dom"].forEach(function (k) { if (p.how[k] === "none") { p.how[k] = "def"; p.ans[k] = null; } });
    save();
    busy = true;
    var h = speak(tr(tyOpen ? "meet.skip" : "meet.skipLater"), { warm: true });
    Promise.resolve(h && h.done).then(function () { busy = false; soon(700); }, function () { busy = false; soon(700); });
    return true;
  }
  function emptyDesk(t) {
    return !!t && (t.id === "desktop" || t.id === "sbIconLayer" || t.id === "sbNoteLayer" || (t.classList && t.classList.contains("wp-layer")));
  }
  doc.addEventListener("click", function (e) {
    if (!emptyDesk(e.target)) return;
    if (Q && !typing() && desk(Q)) { e.stopPropagation(); e.preventDefault(); return; }
    if (Date.now() - lastSkip < 80) { e.stopPropagation(); e.preventDefault(); }   /* голос уже отдал это касание знакомству */
  }, true);

  /* ── надёжное окно первого слова: имя и имя системы ── */
  var firstEl = null, firstSeen = false;
  function firstOpen() { return !!firstEl; }
  function css() {
    if (doc.getElementById("sbMeetStyle")) return;
    var s = doc.createElement("style"); s.id = "sbMeetStyle";
    s.textContent =
      /* Чистота (D-847, обход п.37): знакомство говорит языком А/Б — тихий поднос
         --tray5 без вуали и размытия, кегли 20 / 13 / 11, поля — одно поле окна
         (--field-face, нить света), «войти» — светильник, «пропустить» — слово. */
      "#sbMeetScrim{position:absolute;inset:0;z-index:880;background:none;display:flex;align-items:center;justify-content:center;padding:16px}" +
      "#sbMeetFirst{width:min(440px,100%);border-radius:var(--r-card);padding:22px 22px 18px;color:var(--ink);" +
      "background:var(--tray5-bg),var(--menu-bg);box-shadow:var(--tray5-edge),var(--shadow)}" +
      "#sbMeetFirst h2{margin:0 0 6px;font-size:var(--f-title);font-weight:500}" +
      "#sbMeetFirst p{margin:0 0 14px;font-size:var(--f-ui);line-height:1.45;color:var(--ink-2,var(--ink))}" +
      "#sbMeetFirst .sb-meet-sub{font-size:var(--f-meta);color:var(--ink-3);margin:4px 0 16px}" +
      "#sbMeetFirst label{display:block;font-size:var(--f-ui);color:var(--ink-2);margin:0 0 12px}" +
      "#sbMeetFirst input{display:block;width:100%;box-sizing:border-box;margin-top:6px;height:var(--field-h,36px);padding:0 var(--field-pad-x,12px);border-radius:var(--r-ctrl);border:0;font:inherit;font-size:var(--f-ui);color:var(--ink);" +
      "background:var(--field-face,rgba(var(--film-rgb),.05));box-shadow:var(--field-edge,inset 0 -1px 0 rgba(var(--edge-rgb),.4))}" +
      "#sbMeetFirst input:focus{outline:1px solid transparent;box-shadow:var(--field-edge-on,inset 0 0 0 1px var(--accent-ring))}" +
      "#sbMeetFirst .sb-meet-acts{display:flex;gap:10px;justify-content:flex-end;align-items:center}" +
      "#sbMeetFirst button{min-height:36px;padding:0 10px;border-radius:var(--r-ctrl);border:0;font:inherit;font-size:var(--f-ui);cursor:pointer;color:var(--ink-2);background:none}" +
      "#sbMeetFirst button:focus-visible{outline:none;box-shadow:var(--brass)}" +
      "#sbMeetFirst button.main{position:relative;overflow:hidden;min-height:40px;padding:0 18px;border-radius:var(--r-lamp);background:var(--lamp5-bg);box-shadow:var(--lamp5-edge);color:var(--lamp5-ink);font-weight:var(--w-strong)}" +
      "#sbMeetFirst button.main::after{content:'';position:absolute;left:18%;right:18%;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--door-thread),transparent);opacity:.8}" +
      "#sbMeetLine{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(var(--dock-h,76px) + 30px);z-index:870;max-width:min(640px,calc(100% - 32px));" +
      "text-align:center;font-size:var(--f-lead);line-height:var(--lh-read);color:var(--ink);text-shadow:0 1px 10px rgba(var(--shade-rgb),.6)}" +
      "#sbMeetLine[hidden]{display:none}" +
      "#sbMeetLine .sb-meet-w{font:inherit;color:var(--accent-ink);background:none;border:0;padding:2px 3px;cursor:pointer;text-decoration:underline;text-underline-offset:4px}";
    doc.head.appendChild(s);
  }
  function openFirst() {
    if (firstEl || prof().met) return;
    var host = doc.getElementById("desktop"); if (!host) return;
    css();
    var scrim = doc.createElement("div"); scrim.id = "sbMeetScrim";
    var box = doc.createElement("form"); box.id = "sbMeetFirst"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("autocomplete", "off");
    box.setAttribute("aria-labelledby", "sbMeetTitle");
    function add(tag, txt, cls) { var e = doc.createElement(tag); if (txt != null) e.textContent = txt; if (cls) e.className = cls; box.appendChild(e); return e; }
    add("h2", tr("meet.win.title")).id = "sbMeetTitle";
    add("p", tr("meet.first.lead"));
    function field(id, label, val, ph) {
      var l = add("label", label), i = doc.createElement("input");
      i.id = id; i.maxLength = 24; i.spellcheck = false; i.value = val; if (ph) i.placeholder = ph; i.setAttribute("autocomplete", "off");
      l.appendChild(i); return i;
    }
    var nm = field("sbMeetName", tr("meet.first.name"), "", tr("meet.first.namePh"));
    var sy = field("sbMeetSys", tr("meet.first.sys"), DEF_SYS, "");
    add("p", tr("meet.first.sub"), "sb-meet-sub");
    var acts = add("div", null, "sb-meet-acts");
    var skip = doc.createElement("button"); skip.type = "button"; skip.id = "sbMeetSkip"; skip.textContent = tr("meet.first.skip");
    var go = doc.createElement("button"); go.type = "submit"; go.id = "sbMeetGo"; go.className = "main"; go.textContent = tr("meet.first.go");
    acts.appendChild(skip); acts.appendChild(go);
    scrim.appendChild(box); host.appendChild(scrim); firstEl = scrim;
    function done(name, sys) {
      if (!firstEl) return;
      var p = prof(); p.met = true; p.name = clip(name); p.sys = clip(sys) || DEF_SYS; save();
      /* Имя знакомства — и в шапку (сборка H4): «Анна» стоит у знака системы,
         как имя из Настроек. Пустое имя шапку не трогает. */
      if (p.name && typeof window.sbSetUsername === "function") { try { window.sbSetUsername(p.name); } catch (e) { /* ignore */ } }
      if (scrim.parentNode) scrim.remove(); firstEl = null;
      busy = true;
      setTimeout(function () {
        var h = speak(tr("meet.hello"), { warm: true });          /* тёплое слово: не хранится нигде */
        Promise.resolve(h && h.done).then(function () { busy = false; soon(500); }, function () { busy = false; soon(500); });
      }, 450);
    }
    box.addEventListener("submit", function (e) { e.preventDefault(); done(nm.value, sy.value); });
    skip.addEventListener("click", function () { done("", DEF_SYS); });
    box.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); done("", DEF_SYS); } });
    scrim.addEventListener("click", function (e) { e.stopPropagation(); });
    setTimeout(function () { if (!("ontouchstart" in window)) try { nm.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 120);
  }
  function onFirstWord() {
    if (firstSeen) return; firstSeen = true;
    (function wait(n) {
      if (prof().met) return;
      var acc = window.getOpenWindow && window.getOpenWindow("settings");   /* «Сделать код» из «Защиты мира» — сперва ключница (Настройки → «Ключи и замок») */
      if (!deskReady() || acc) { if (n < 600) setTimeout(function () { wait(n + 1); }, 300); return; }
      setTimeout(openFirst, 500);
    })(0);
  }
  window.addEventListener("sb:first-word", onFirstWord);
  if (window.sbBus && window.sbBus.on) window.sbBus.on("sb:first-word", onFirstWord);
  if (window.sbFirstWordAt) onFirstWord();

  /* Мир открыт не впервые: недоспрошенное — после спокойной паузы. */
  (function boot(n) {
    if (deskReady()) { var p = prof(); if (p.met && !firstSeen) soon(6000); return; }
    if (n < 2000) setTimeout(function () { boot(n + 1); }, 500);
  })(0);
  /* Замок закрылся — разговор уходит вместе с миром. */
  setInterval(function () {
    if (closed() && Q) close(Q);
    if (closed() && firstEl) { if (firstEl.parentNode) firstEl.remove(); firstEl = null; firstSeen = false; }
  }, 700);
  /* Язык сменился посреди вопроса — тот же вопрос на новом языке. */
  if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", function () {
    if (!Q) return; var k = Q.k; close(Q); asked--; ask(k);
  });

  window.sbMeet = {
    pending: function () { return Q ? Q.k : null; },
    state: function () { return { pending: Q ? Q.k : null, text: Q ? Q.text.replace(/[\[\]]/g, "") : "", ready: !!Q && !typing() && Date.now() - Q.t0 > 350, asked: asked, first: firstOpen(), met: prof().met }; },
    /* «Пройти разговор заново» — из Настроек */
    again: function () {
      if (closed()) return false;
      var p = prof();
      ["ty", "rod", "dom"].forEach(function (k) { p.ans[k] = null; p.how[k] = "none"; });
      p.met = true; save();
      if (Q) close(Q);
      soon(450);
      return true;
    },
    first: function () { firstSeen = false; onFirstWord(); }
  };
})();
