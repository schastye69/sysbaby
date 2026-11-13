/* sys.baby OS — core/depth.js
 * «ГЛУБИНА» — ВИД ЧЕТЫРЁХ ТЕМ · решение D-1080 (основатель 12.11.2026, показ
 * temy-glubina/sravnenie.html: «глубина» идёт в архив как САМ вид тем, не за
 * переключателем). Пакет GLUBINA. Перенесено из пробного слоя h5-temy (дерево
 * H4a) на H4b; переключателя больше нет — слой живёт всегда, кроме Светлицы и
 * инкогнито (там вид прежний, из core.css).
 *
 * Что рисует: почти чёрный пол; свет темы — только большими глубокими формами:
 * дуга горизонта, как край планеты в темноте, и дальнее облако. Затмение —
 * пол этого слоя, а кромку за диском рисует прежний холст #sbEclipse
 * (core/eclipse.js, D-872) — его закон и вид не тронуты; во время шва
 * смены темы холст кромки скрыт и проявляется после шва (без скачка).
 * Тепло — по-настоящему оранжевое (D-1081, основатель: «Мандарин» #ec9455,
 * D-824): атмосфера дуги и облако — свет Мандарина, их сила вдвое–втрое выше,
 * чем у Океана и Авроры, пол — угольно-апельсиновая тьма Мандарина.
 *
 * Шов смены темы (4А): от места касания расходится дуга нового света, знаки
 * загораются, когда она проходит над ними. Без «лесенки»: холст в полный
 * пиксель (до 1,5 dpr, не больше 2,4 Мп), ни одной ступени step() — все края
 * гладкие функции расстояния, кромка не тоньше 1,4 px, сверху дизеринг.
 *
 * Цена: в покое кадр — раз в REST мс (свет почти неподвижен), в Затмении и
 * при «меньше движения» — один кадр; под окном во весь стол и в скрытой
 * вкладке — ни одного. Поле системы (core/field.js) под глубиной не рисует:
 * его suppressed() спрашивает window.sbDepth.live().
 * Без WebGL — слоя нет: поле системы рисует как прежде (sb-depth-nogl). */
(function () {
  "use strict";
  var REST = 500;

  /* кромки Океана и Авроры — насыщенные, не молочные: ярчайшая точка держит цвет (field-beam: нет белого пятна) */
  /* палитры: base — пол; atm — свет атмосферы; rim — кромка; far — облако;
     k: [−1 — только пол (Затмение), иначе доля, на которую ниже потолок света
     (Аврора .3: зелёный под насыщенностью заметки и пульта светлеет сильнее всех), сила атмосферы, сила облака] */
  var PAL = {
    /* Тепло «Мандарин» (D-1081): тон 24–28°, пол — #130802 Мандарина */
    studio: { base: [19, 8, 2],  atm: [242, 102, 6],  rim: [255, 176, 96],  far: [240, 100, 8],   k: [0, 1.8, 1.5] },
    ocean:  { base: [2, 3, 10],  atm: [44, 84, 236],  rim: [118, 168, 255], far: [70, 52, 196],   k: [0, 1, 1] },
    aurora: { base: [2, 6, 9],   atm: [28, 196, 150], rim: [104, 236, 196], far: [104, 70, 236],  k: [.3, 1, 1] },
    ember:  { base: [1, 1, 1],   atm: [176, 82, 36],  rim: [255, 198, 140], far: [90, 38, 14],    k: [-1, 1, 1] }
  };
  PAL.eclipse = PAL.ember;
  function vec(m) {
    var p = PAL[m], f = function (c) { return [c[0] / 255, c[1] / 255, c[2] / 255]; };
    return new Float32Array([].concat(f(p.base), f(p.atm), f(p.rim), f(p.far), p.k));
  }

  var VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FS = [
    "precision highp float;",
    "const float LCAP = .11, LLOW = .05;",
    "uniform vec2 uRes; uniform float uT, uPx, uMode, uR, uSeam;",
    "uniform vec2 uO; uniform vec3 uA[5]; uniform vec3 uB[5]; uniform vec4 uWin[8]; uniform float uNW;",
    /* под окнами кромки дуги нет: сквозь стекло «B» (.98) тонкая яркая линия читалась бы ступенью в теле
       окна (window-one-glass п.4); 2 % света её и не показали бы. Края выреза мягкие (8 px). */
    "float underWin(vec2 p){ float c = 0.; for (int i = 0; i < 8; i++) { if (float(i) >= uNW) break; vec4 r = uWin[i];",
    "  vec2 a = smoothstep(r.xy - 8., r.xy + 8., p) * (1. - smoothstep(r.zw - 8., r.zw + 8., p)); c = max(c, a.x*a.y); } return c; }",
    "float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);",
    "  return mix(mix(h1(i), h1(i+vec2(1.,0.)), f.x), mix(h1(i+vec2(0.,1.)), h1(i+vec2(1.,1.)), f.x), f.y); }",
    "float fbm(vec2 p){ return n2(p)*.6 + n2(p*2.1+5.3)*.28 + n2(p*4.3+1.7)*.12; }",
    /* потолок яркости света: тихие слова на прозрачных предметах стола (заметка «свет по кромке», пульт)
       держат 4,5:1 к самому светлому месту под ними — свет выше LCAP (линейная яркость) мягко сжимается,
       тон и насыщенность те же; тонкая кромка дуги — поверх, не сжимается. Нижняя полоса стола (небо голоса,
       D-807: туманность и звёзды поверх стола, пока голос говорит) — потолок ниже (LLOW): голос и заметка над ним
       вместе держат меру (note-contrast) */
    "float capAt(vec2 p){ return mix(LCAP, LLOW, smoothstep(uRes.y*.44, uRes.y*.62, p.y)); }",
    "vec3 capL(vec3 c, float cap){ vec3 l = pow(max(c, 0.), vec3(2.2)); float y = dot(l, vec3(.2126, .7152, .0722));",
    "  float k0 = cap*.6, k1 = cap*.4; if (y <= k0) return c;",
    "  float y2 = k0 + k1*(1. - exp(-(y - k0)/k1)); return c*pow(y2/y, 1./2.2); }",
    /* сцена одной темы; p — в пикселях холста, y вниз; k = (−1 — только пол, сила атмосферы, сила облака) */
    "vec3 scene(vec3 base, vec3 atm, vec3 rim, vec3 far, vec3 k, vec2 p, float t, out vec3 rr){",
    "  float W = uRes.x, H = uRes.y, mn = min(W, H), mx = max(W, H);",
    "  vec2 q = p/mn;",
    "  float form = fbm(q*1.15 + vec2(t*.006, -t*.004));",
    /* Затмение: только пол — диск и кромку рисует #sbEclipse (D-872) */
    "  rr = vec3(0.);",
    "  if (k.x < -.5) return base;",
    /* горизонт планеты: большая окружность, вершина дуги — на 80–82 % высоты */
    "  float R = mx*1.7;",
    "  float apex = H*(W > H ? .80 : .82);",
    "  vec2 c = vec2(W*(.5 + .05*sin(t*.011)), apex + R);",
    "  float d = length(p - c) - R;",
    "  float lat = exp(-pow((p.x - c.x)/(W*.62), 2.));",
    "  float dp = max(d, 0.), dn = max(-d, 0.);",
    /* под окном край планеты мягче (6 % меньшей стороны) — по той же причине, что и вырез кромки */
    "  float uw = underWin(p), ew = mix(uPx*1.2, mn*.06, uw);",
    "  float sky = smoothstep(-ew, ew, d);",
    /* близкий свет у дуги — как был; дальний (широкий) — с силой темы: у Тепла он поднимается
       оранжевым заревом до середины стола, верх остаётся глубоким */
    "  float g = k.y;",
    "  vec3 a1 = atm*(.50*exp(-dp/(mn*.055)) + g*.22*exp(-dp/(mn*.24)) + g*.09*exp(-dp/(mn*.70)))*(.30 + .70*lat)*(.85 + .3*form);",
    "  float rw = max(uPx*1.4, mn*.0018);",
    "  rr = (1. - uw)*min(rim*(exp(-pow(d/rw, 2.))*.85 + .22*exp(-pow(d/(mn*.010), 2.)))*(.25 + .75*lat), 1.);",
    "  vec3 inner = atm*.10*g*exp(-dn/(mn*.05))*(.3 + .7*lat) + base*.6;",
    "  vec3 col = mix(inner, base + a1, sky);",
    /* дальние облака — по краям, середина пуста; у Тепла облако ниже и сильнее (под знаками, не под шапкой, выше неба голоса) */
    "  float cy1 = k.z > 1.2 ? .46 : .10;",
    "  vec2 f1 = (p - vec2(W*.96, H*cy1))/mn; float g1 = exp(-dot(f1*vec2(1., 1.25), f1*vec2(1., 1.25))*3.2);",
    "  vec2 f2 = (p - vec2(W*.02, H*.46))/mn; float g2 = exp(-dot(f2*vec2(1.5, .9), f2*vec2(1.5, .9))*4.);",
    "  col += far*.42*k.z*g1*(.40 + 1.2*form) + atm*.13*k.z*g2*(.35 + 1.3*form);",
    "  return capL(col, capAt(p)*(1. - max(k.x, 0.)));",
    "}",
    /* кромка дуги ложится «экраном»: каналы не упираются в 255, и у Тепла она остаётся оранжевой, не жёлтой */
    "void main(){",
    "  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);",
    "  vec3 col;",
    "  if (uMode < .5) { vec3 Ar; vec3 A = scene(uA[0], uA[1], uA[2], uA[3], uA[4], p, uT, Ar); col = A + Ar*(1. - A); }",
    "  else {",
    "    float mn = min(uRes.x, uRes.y);",
    "    float d = length(p - uO);",
    /* живая, но гладкая кромка шва: только низкие частоты, без step() */
    "    float wob = (fbm(p/mn*2.4 + vec2(uT*.3, -uT*.22)) - .5)*mn*.035*min(1., uR/(mn*.4));",
    "    float dd = d + wob;",
    "    float soft = mn*.02;",
    "    float m = smoothstep(uR + soft, uR - soft, dd);",
    /* каждая сцена считается только там, где её видно: шов не вдвое дороже покоя */
    "    vec3 Ac = vec3(0.), Bc = vec3(0.), Ar = vec3(0.), Br = vec3(0.);",
    "    if (m < .999) { vec3 A = scene(uA[0], uA[1], uA[2], uA[3], uA[4], p, uT, Ar);",
    "      float ahead = exp(-max(dd - uR, 0.)/(mn*.10))*(1. - m);",
    "      Ac = A*(1. - .35*ahead*uSeam); }",
    "    if (m > .001) { vec3 B = scene(uB[0], uB[1], uB[2], uB[3], uB[4], p, uT, Br);",
    "      float behind = exp(-max(uR - dd, 0.)/(mn*.14))*m;",
    "      Bc = B*(1. + .8*behind*uSeam); }",
    "    float rw = max(uPx*1.5, mn*.0028);",
    "    float seam = exp(-pow((dd - uR)/rw, 2.)) + .30*exp(-pow((dd - uR)/(mn*.03), 2.));",
    "    vec3 sc = mix(uB[2], vec3(1.), .12);",
    /* свет за швом и сама кромка шва — под тем же потолком: тихие слова держат меру и во время шва;
       кромки дуг ложатся поверх «экраном» */
    "    vec3 G = capL(mix(Ac, Bc, m) + sc*seam*.55*uSeam, capAt(p)*mix(1. - max(uA[4].x, 0.), 1. - max(uB[4].x, 0.), m)), Rr = mix(Ar, Br, m);",
    "    col = G + Rr*(1. - G);",
    "  }",
    "  col += (h1(gl_FragCoord.xy + fract(uT)*91.) - .5)*(1.5/255.);",
    "  gl_FragColor = vec4(col, 1.);",
    "}"
  ].join("\n");

  /* одна сборка и одна запись кадра — для потока и для главного: картинка та же самой функцией */
  function glSetup(g) {
    var sh = function (type, src) {
      var o = g.createShader(type); g.shaderSource(o, src); g.compileShader(o);
      if (!g.getShaderParameter(o, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(o));
      return o;
    };
    var pr = g.createProgram();
    g.attachShader(pr, sh(g.VERTEX_SHADER, VS)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, FS));
    g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(pr));
    g.useProgram(pr);
    var buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    var loc = g.getAttribLocation(pr, "a"); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    var u = {};
    ["uRes", "uT", "uPx", "uMode", "uR", "uSeam", "uO", "uA", "uB", "uWin", "uNW"].forEach(function (n) { u[n] = g.getUniformLocation(pr, n); });
    return u;
  }
  function glFrame(g, u, f) {
    g.viewport(0, 0, f.w, f.h);
    g.uniform2f(u.uRes, f.w, f.h); g.uniform1f(u.uT, f.t); g.uniform1f(u.uPx, 1);
    g.uniform3fv(u.uA, f.A); g.uniform3fv(u.uB, f.B); g.uniform1f(u.uMode, f.mode);
    g.uniform4fv(u.uWin, f.wins); g.uniform1f(u.uNW, f.nw);
    g.uniform2f(u.uO, f.ox, f.oy); g.uniform1f(u.uR, f.R); g.uniform1f(u.uSeam, f.seam);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }

  /* ── ПОТОК ГЛУБИНЫ ───────────────────────────────────────────────────────
     Тот же файл, загруженный потоком (Worker), держит свой холст WebGL вне
     страницы (OffscreenCanvas): сборка шейдера и кадры идут не в главном
     потоке, на экран кадр приходит готовой картинкой (bitmaprenderer). Так
     вход, окна и голос не ждут слоя — тот же приём, что у поля (D-282). */
  if (typeof document === "undefined") {
    if (typeof self === "undefined" || typeof self.postMessage !== "function") return;
    var oc = null, wg = null, wu = null, wpend = null, wbusy = false;
    var wrun = function () {
      wbusy = false;
      var f = wpend; wpend = null;
      if (!f || !wg) return;
      if (oc.width !== f.w || oc.height !== f.h) { oc.width = f.w; oc.height = f.h; }
      glFrame(wg, wu, f);
      var bmp = oc.transferToImageBitmap();
      self.postMessage({ type: "bmp", bmp: bmp }, [bmp]);
    };
    self.onmessage = function (e) {
      var m = e.data || {};
      if (m.type === "init") {
        try {
          oc = new OffscreenCanvas(Math.max(2, m.w), Math.max(2, m.h));
          wg = oc.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
          if (!wg) throw new Error("webgl");
          wu = glSetup(wg);
          self.postMessage({ type: "ready" });
        } catch (err) { wg = null; self.postMessage({ type: "fail" }); }
      } else if (m.type === "frame") {
        /* держится только самый свежий кадр */
        wpend = m.f;
        if (!wbusy) { wbusy = true; setTimeout(wrun, 0); }
      }
    };
    return;
  }

  var root = document.documentElement, doc = document;
  function mood() { var m = root.getAttribute("data-wp-mood"); return PAL[m] ? m : "studio"; }
  /* Адрес этого же файла — запустить его потоком; в ковчеге (D-314) адреса нет — поток из текста (как у поля). */
  var SRC = (doc.currentScript && (doc.currentScript.src ||
    (window.SB_ARK && typeof window.SB_ARK.self === "function" ? window.SB_ARK.self(doc.currentScript) : ""))) || "";

  var cv = null, gcv = null, c2d = null, gl = null, prog = null, U = {}, W = 0, H = 0, K = 1, raf = 0, T0 = performance.now();
  var worker = null, bmpctx = null, inflight = false, queued = null;
  var cur = null, tr = null, lastTap = null, draws = 0, held = 0, live = false, dirty = true;
  /* пока слой собирается (после первой отрисовки страницы), поле уже молчит — если WebGL есть вообще */
  var pending = !!window.WebGLRenderingContext;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  /* слой виден: тёмная тема, не инкогнито (Светлица и инкогнито — прежний вид core.css) */
  function shown() { return root.getAttribute("data-theme") !== "light" && !root.classList.contains("sb-incognito"); }
  function parked() { return root.classList.contains("wp-parked"); }
  function eclipse(m) { return m === "ember" || m === "eclipse"; }
  /* Турбо (sb-turbo) и «фон выключен» (уровень поля off) — свет стоит, шов — сразу (room-and-seam п.6) */
  function turbo() { return root.classList.contains("sb-turbo") || !!(window.sbField && window.sbField.level && window.sbField.level() === "off"); }

  /* без WebGL — честно назад к полю системы */
  function fallback() {
    live = false; pending = false; root.classList.add("sb-depth-nogl");
    if (window.sbField) { window.sbField.refresh(); if (window.sbGetWallpaperMood) window.sbField.mood(window.sbGetWallpaperMood()); }
  }
  /* поток: сборка и кадры вне главного; не вышло — тот же холст, но в главном потоке */
  function buildWorker() {
    if (!SRC || typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined" ||
        !OffscreenCanvas.prototype.transferToImageBitmap || typeof createImageBitmap === "undefined") return false;
    try { bmpctx = cv.getContext("bitmaprenderer"); } catch (e) { bmpctx = null; }
    if (!bmpctx) return false;
    try { worker = new Worker(SRC); } catch (e) { worker = null; }
    if (!worker) { swapCanvas(); return false; }
    worker.onmessage = function (e) {
      var m = e.data || {};
      if (m.type === "ready") { live = true; pending = false; prog = true; dirty = true; loop(); }
      else if (m.type === "fail") { worker.terminate(); worker = null; swapCanvas(); buildMain(); if (live) size(); }
      else if (m.type === "bmp") {
        inflight = false;
        if (bmpctx) bmpctx.transferFromImageBitmap(m.bmp);
        if (!cv.classList.contains("sb-depth-on")) cv.classList.add("sb-depth-on");
        /* отложенный кадр уходит, только если стол всё ещё виден */
        if (queued) { var q = queued; queued = null; if (!parked() && !doc.hidden) send(q); }
      }
    };
    worker.onerror = function () { if (worker) { worker.terminate(); worker = null; swapCanvas(); buildMain(); if (live) size(); } };
    worker.postMessage({ type: "init", w: Math.round(innerWidth * K), h: Math.round(innerHeight * K) });
    return true;
  }
  /* холст, отданный bitmaprenderer, не берёт 2D — для главного потока он заменяется чистым */
  function swapCanvas() {
    bmpctx = null;
    var n = cv.cloneNode(false); cv.parentNode.replaceChild(n, cv); cv = n;
  }
  /* счёт кадров — в миг, когда кадр заказан: это и есть работа слоя */
  function send(f) { inflight = true; draws++; worker.postMessage({ type: "frame", f: f }); }
  function build() {
    if (cv) return true;
    cv = doc.getElementById("sbDepthField");
    if (!cv) return false;
    if (buildWorker()) return true;
    buildMain();
    return true;
  }
  function buildMain() {
    /* WebGL считает во внутреннем холсте вне страницы; на экран кадр кладётся в обычный 2D-холст. Холст
       WebGL прямо в странице дорог композитору на каждом кадре (замер 720×1050: 3–8 к/с против 45 без
       него), а 2D-холст стоит так же дёшево, как прежнее поле, — копия только когда кадр нарисован. */
    gcv = doc.createElement("canvas");
    c2d = cv.getContext("2d", { alpha: false });
    gl = c2d && gcv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) { fallback(); return; }
    try { U = glSetup(gl); prog = true; live = true; } catch (e) { prog = null; fallback(); }
    pending = false;
    /* потерянный контекст — честно назад к полю системы */
    gcv.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(); prog = null; fallback();
    });
  }
  function size() {
    if (!cv) return;
    W = window.innerWidth; H = window.innerHeight;
    K = Math.min(window.devicePixelRatio || 1, 1.5);
    /* полный пиксель, но не больше ~2,4 Мп: шов гладкий, а кадр дешёвый */
    K = Math.min(K, Math.sqrt(2.4e6 / Math.max(1, W * H)));
    var w = Math.max(2, Math.round(W * K)), h = Math.max(2, Math.round(H * K));
    if (!worker && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; }
    if (gcv && (gcv.width !== w || gcv.height !== h)) { gcv.width = w; gcv.height = h; }
    /* смена размера стирает холст: кадр — в ближайшем такте (за воротами и под окном — когда стол откроется) */
    dirty = true;
    if (!doc.getElementById("sbVaultGate") && !parked()) draw(performance.now()); else loop();
  }

  function draw(now) {
    if (!prog || !shown()) return;
    var t = reduced() ? 40 : (now - T0) / 1000;
    var m = cur || mood();
    var f = { w: Math.max(2, Math.round(W * K)), h: Math.max(2, Math.round(H * K)), t: t,
      A: vec(tr ? tr.from : m), B: vec(tr ? tr.to : m), mode: tr ? 1 : 0, wins: new Float32Array(wins), nw: nWins,
      ox: tr ? tr.o.x * K : 0, oy: tr ? tr.o.y * K : 0, R: tr ? tr.R * K : 0, seam: tr ? tr.seam : 0 };
    dirty = false;
    if (worker) { if (inflight) queued = f; else send(f); return; }
    glFrame(gl, U, f);
    c2d.drawImage(gcv, 0, 0);
    draws++;
    if (draws === 1) cv.classList.add("sb-depth-on");
  }

  function ease(p) { p = Math.max(0, Math.min(1, p)); return 1 - Math.pow(1 - p, 1.75); }
  function smooth(p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); }
  function iconCenters() {
    return Array.prototype.map.call(doc.querySelectorAll("#sbIconLayer .desk-icon"), function (el) {
      var r = (el.querySelector(".icon-tile") || el).getBoundingClientRect();
      return { el: el, x: r.left + r.width / 2, y: r.top + r.height / 2, done: false };
    });
  }
  function startSeam(from, to) {
    if (reduced() || turbo() || !prog || !shown() || parked()) { cur = to; dirty = true; draw(performance.now()); return; }
    var o = lastTap && performance.now() - lastTap.at < 4000 ? lastTap : { x: W / 2, y: H - 40 };
    var far = Math.max(Math.hypot(o.x, o.y), Math.hypot(W - o.x, o.y), Math.hypot(o.x, H - o.y), Math.hypot(W - o.x, H - o.y)) + 80;
    tr = { from: from, to: to, o: { x: o.x, y: o.y }, t0: performance.now(), dur: 2700, R: 0, far: far, seam: 1, icons: iconCenters() };
    cur = to;
    root.classList.add("sb-depth-seam");
    loop();
  }
  function stepSeam(now) {
    var p = Math.min(1, (now - tr.t0) / tr.dur);
    tr.R = tr.far * ease(p);
    tr.seam = p < .72 ? 1 : 1 - smooth((p - .72) / .28);
    tr.icons.forEach(function (ic) {
      if (!ic.done && Math.hypot(ic.x - tr.o.x, ic.y - tr.o.y) < tr.R - 6) {
        ic.done = true; ic.el.classList.remove("sb-depth-lit"); void ic.el.offsetWidth; ic.el.classList.add("sb-depth-lit");
      }
    });
    if (p >= 1) { tr = null; root.classList.remove("sb-depth-seam"); }
  }

  var rest = 0;
  function loop() {
    if (raf || !prog) return;
    if (rest) { clearTimeout(rest); rest = 0; }
    raf = requestAnimationFrame(function tick(now) {
      raf = 0;
      if (!shown()) return;
      if (held) now = held;
      if (tr) { stepSeam(now); draw(now); raf = requestAnimationFrame(tick); return; }
      /* под окном во весь стол и в скрытой вкладке — ни кадра, даже отложенного: он дождётся пробуждения;
         за воротами Шифра стола не видно — кадров нет, раз в секунду спросить, ушли ли ворота */
      if (parked() || doc.hidden) return;
      if (doc.getElementById("sbVaultGate")) { setTimeout(loop, 1000); return; }
      if (dirty) draw(now);
      /* покой: свет почти неподвижен — кадр раз в полсекунды; Затмение (пол без света),
         «меньше движения», Турбо, окно во весь стол и скрытая вкладка — ни одного */
      if (parked() || reduced() || turbo() || doc.hidden || eclipse(cur || mood())) {
        /* уровень фона меняется без атрибута на корне — раз в секунду спросить, не вернулся ли он */
        if (!root.classList.contains("sb-turbo") && turbo()) setTimeout(loop, 1000);
        return;
      }
      /* до следующего кадра покоя — таймер по настоящим часам, а не кадр за кадром: между ними страница не
         тронута, и приборы, ускоряющие время страницы (teplo-warm), кадры не разгоняют */
      draw(now);
      rest = setTimeout(function () { rest = 0; loop(); }, REST);
    });
  }

  /* наружу: live() — слой рисует (поле системы молчит); hold — остановить время слоя на кадре (для снимков шва) */
  window.sbDepth = {
    live: function () { return (live || pending) && shown(); },
    get draws() { return draws; }, get seam() { return tr; }, palettes: PAL, rest: REST,
    /* где считаются кадры: «thread» — свой поток, «main» — главный */
    thread: function () { return worker ? "thread" : "main"; },
    hold: function (on) { held = on ? performance.now() : 0; if (!on && tr) tr.t0 += performance.now() - (tr.heldAt || performance.now()); if (on && tr) tr.heldAt = held; loop(); }
  };

  /* касание кнопки темы — шов идёт оттуда */
  window.addEventListener("pointerdown", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-mood]");
    if (b) { var r = b.getBoundingClientRect(); lastTap = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: performance.now() }; }
  }, true);

  /* окна на столе — для выреза кромки; пересчёт по слою окон, не чаще раза в 250 мс, не во время перетаскивания */
  var wins = new Float32Array(32), nWins = 0, winTimer = 0;
  function readWins() {
    winTimer = 0;
    if (root.classList.contains("dragging")) { winTimer = setTimeout(readWins, 250); return; }
    var list = doc.querySelectorAll("#windowLayer .window"), n = 0, key = "";
    for (var i = 0; i < list.length && n < 8; i++) {
      var c = list[i].classList;
      if (c.contains("minimized") || c.contains("closing")) continue;
      var r = list[i].getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      wins[n * 4] = r.left * K; wins[n * 4 + 1] = r.top * K; wins[n * 4 + 2] = r.right * K; wins[n * 4 + 3] = r.bottom * K;
      key += Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.right) + "," + Math.round(r.bottom) + ";";
      n++;
    }
    if (key !== readWins.key || n !== nWins) { readWins.key = key; nWins = n; dirty = true; loop(); }
  }
  function winsChanged() { if (!winTimer) winTimer = setTimeout(readWins, 250); }
  var bootAt = 0;
  function start() {
    if (!build()) { if (pending) fallback(); return; }
    bootAt = performance.now();
    cur = mood();
    size();
    /* смена темы: слушаем сам атрибут — тема ставится и из пульта, и из Настроек */
    /* слушается корень, но кадр — только когда изменилось то, что видно на фоне: тема, Светлица, движение,
       инкогнито, Турбо, «накрыто окном». Прочие классы корня (перетаскивание, окна, ввод) кадра не стоят. */
    var stamp = function () {
      var c = root.classList;
      return [root.getAttribute("data-theme"), root.getAttribute("data-motion"), c.contains("sb-incognito"), c.contains("sb-turbo"), c.contains("wp-parked")].join("|");
    };
    var seen = stamp();
    new MutationObserver(function () {
      if (!cv) return;
      var m = mood();
      /* тема, надетая при входе (восстановление из хранилища), — без шва: шов — ответ на выбор человека */
      if (m !== cur && performance.now() - bootAt < 2500) { cur = m; dirty = true; seen = stamp(); loop(); return; }
      if (m !== cur) { seen = stamp(); startSeam(cur || m, m); return; }
      var st = stamp();
      if (st === seen) return;
      seen = st; dirty = true; loop();
    }).observe(root, { attributes: true, attributeFilter: ["data-wp-mood", "data-theme", "data-motion", "class"] });
    window.addEventListener("resize", size);
    window.addEventListener("resize", winsChanged);
    var wl = doc.getElementById("windowLayer");
    if (wl) new MutationObserver(winsChanged).observe(wl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    readWins();
    doc.addEventListener("visibilitychange", loop);
    if (mq.addEventListener) mq.addEventListener("change", function () { dirty = true; loop(); });
    loop();
  }
  /* depth.js подключён до field.js: к старту поля sbDepth.live() уже отвечает (pending), и поле не рисует ни кадра */
  /* сборка шейдера — после первой отрисовки стола, а не в ней: вход не ждёт слоя; холст проявляется мягко */
  /* и не под занавесом входа: его подъём ждёт проявленного стола (shell.js, v59), и сборка слоя в это время
     отодвигала бы вход; стол встречает человека полом, свет проявляется следом (.8 с) */
  function later() {
    if (doc.getElementById("sbCurtain")) { setTimeout(later, 200); return; }
    (window.requestIdleCallback || function (f) { return setTimeout(f, 60); })(start, { timeout: 1200 });
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", later);
  else later();
})();
