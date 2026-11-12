/* sys.baby OS — core/desktime.js
 * ВРЕМЯ НА СТОЛЕ · решение D-854 (основатель 10.11.2026; демо dom-moy-B,
 * утверждено 11.11). Пока идёт таймер, секундомер или будильник, время
 * рисуется светом прямо в фоне стола — за окнами и под значками (холст живёт
 * внутри .wp-layer). Два вида, оба утверждены: «линии света» (line) и «пыль
 * света» (dust). Выбор — ТОЛЬКО в Настройках (П2): слово устройства
 * sysbaby.desktime.view; Настройки пишут его и шлют window-событие
 * sb:desktime ({ view }) — вид меняется без перезагрузки.
 * МЕСТО — верх или центр стола: низ занимает голос дома. Под открытой
 * панелью часов время уходит ниже неё, но не ниже 60 % экрана.
 * Кадр — чистая функция виртуального времени; в покое холст пуст и кадров
 * не просит. «Меньше движения» — те же цифры, сразу и неподвижно: одна
 * перерисовка на смену секунды.
 * Управление — window.sbDeskTime (его зовёт панель часов, core/clock.js).
 * Охраняется tools/desk-time-switch-check.mjs и tools/note-drag-perf-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var VIEW_KEY = "sysbaby.desktime.view";
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  function T(k, v) { return window.sbDeskT ? window.sbDeskT(k, v) : k; }
  /* свет по темам: c — сердцевина, g — ореол */
  var PAL = {
    studio: { c: [255, 236, 212], g: [255, 166, 90] },
    ocean: { c: [222, 247, 255], g: [88, 190, 232] },
    aurora: { c: [222, 255, 242], g: [110, 226, 190] },
    eclipse: { c: [255, 226, 196], g: [255, 140, 70] },
    ember: { c: [255, 214, 172], g: [255, 128, 62] },
    feast: { c: [255, 232, 210], g: [255, 150, 110] },
    daylight: { c: [255, 246, 232], g: [255, 210, 168] }
  };
  function rgba(a, al) { return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + (al < 0 ? 0 : al > 1 ? 1 : al).toFixed(3) + ")"; }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
  function bell(x) { x = cl(x); return Math.sin(Math.PI * x); }
  /* однолинейный «световой» шрифт: каждая цифра — одна-две линии в коробке 0.58×1 */
  var G = {
    "0": ["M .29 0 A .27 .5 0 1 1 .29 1 A .27 .5 0 1 1 .29 0"],
    "1": ["M .1 .19 L .32 0 L .32 1"],
    "2": ["M .04 .22 C .07 .07 .17 0 .3 0 C .45 0 .55 .1 .55 .25 C .55 .42 .42 .55 .03 1 L .57 1"],
    "3": ["M .05 .12 C .12 .04 .2 0 .3 0 C .45 0 .54 .1 .54 .24 C .54 .38 .43 .46 .25 .46", "M .25 .46 C .46 .46 .57 .57 .57 .72 C .57 .89 .45 1 .29 1 C .18 1 .08 .95 .02 .86"],
    "4": ["M .43 1 L .43 0 L .01 .69 L .58 .69"],
    "5": ["M .52 0 L .11 0 L .06 .43 C .14 .38 .21 .36 .29 .36 C .46 .36 .57 .5 .57 .67 C .57 .87 .45 1 .28 1 C .17 1 .08 .95 .02 .86"],
    "6": ["M .5 .06 C .44 .02 .37 0 .31 0 C .12 0 .02 .2 .02 .56 C .02 .83 .13 1 .3 1 C .46 1 .56 .87 .56 .7 C .56 .52 .45 .41 .3 .41 C .17 .41 .07 .48 .03 .6"],
    "7": ["M .01 0 L .57 0 L .2 1"],
    "8": ["M .29 .47 A .23 .235 0 1 1 .29 0 A .23 .235 0 1 1 .29 .47", "M .29 .47 A .27 .265 0 1 1 .29 1 A .27 .265 0 1 1 .29 .47"],
    "9": ["M .08 .94 C .14 .98 .21 1 .27 1 C .46 1 .56 .8 .56 .44 C .56 .17 .45 0 .28 0 C .12 0 .02 .13 .02 .3 C .02 .48 .13 .59 .28 .59 C .41 .59 .51 .52 .55 .4"],
    ":": ["M .11 .3 L .11 .302", "M .11 .74 L .11 .742"]
  };
  var P2 = {}, SV = {}, LEN = {}, glyphsReady = false;
  function buildGlyphs() {
    if (glyphsReady) return; glyphsReady = true;
    var ns = "http://www.w3.org/2000/svg", s = doc.createElementNS(ns, "svg");
    s.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden"); s.setAttribute("aria-hidden", "true");
    doc.body.appendChild(s);
    Object.keys(G).forEach(function (k) {
      P2[k] = G[k].map(function (d) { return new Path2D(d); });
      SV[k] = G[k].map(function (d) { var p = doc.createElementNS(ns, "path"); p.setAttribute("d", d); s.appendChild(p); return p; });
      LEN[k] = SV[k].map(function (p) { return Math.max(0.002, p.getTotalLength()); });
      LEN[k].T = LEN[k].reduce(function (a, b) { return a + b; }, 0);
    });
  }
  function wOf(ch) { return ch === ":" ? 0.22 : 0.58; }
  function ptAt(ch, f) {
    var L = LEN[ch], t = cl(f) * L.T, i = 0;
    while (i < L.length - 1 && t > L[i]) { t -= L[i]; i++; }
    var p = SV[ch][i].getPointAtLength(Math.min(t, L[i])); return [p.x, p.y];
  }

  /* ---------- вид: слово устройства ---------- */
  function readView() { var v = null; try { v = window.localStorage.getItem(VIEW_KEY); } catch (e) { v = null; } return v === "dust" ? "dust" : "line"; }

  /* ---------- состояние ---------- */
  var cv, ctx, W = 0, H = 0, dpr = 1, Hd = 84, S = 1, cache = {}, variant = readView(), mode = null;
  var total = 0, label = "", vBase = 0, rBase = 0, endAt = null, lastKey = "", pausedAt = null, painted = 0;
  var cyT = null, cyC = null, cyDrawn = null, lastT = 0, CW = 0, CH = 0, CY = 0, posY = null;
  function vnow() { return pausedAt != null ? pausedAt : vBase + (performance.now() - rBase); }
  function begin(m, tot, lbl, elapsed) {
    mode = m; total = tot || 0; label = lbl || ""; vBase = elapsed || 0; rBase = performance.now(); endAt = null; pausedAt = null; lastKey = "";
    variant = readView(); kick(); emit("start");
  }
  function moodId() { return window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio"; }
  /* ОТКАТ: у темы нет своей палитры времени (новая или снятая тема) — время на столе берёт палитру Тепла, а не пропадает. */
  function pal() { var m = moodId(); return [m, PAL[m] || PAL.studio]; }
  function fmt(sec) { var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  function state(v) {
    var o = { mode: mode };
    if (mode === "stopwatch") { var k = Math.floor(v / 1000); o.str = fmt(k); o.prev = fmt(Math.max(0, k - 1)); o.ph = v - k * 1000; o.k = k; }
    else {
      var rem = Math.max(0, total - v), s = Math.ceil(rem / 1000), k2 = Math.floor(v / 1000);
      o.str = fmt(s); o.prev = fmt(Math.min(Math.ceil(total / 1000), s + 1)); o.ph = v >= total ? 1e9 : v - k2 * 1000; o.k = k2; o.done = v >= total;
    }
    if (o.k === 0 || pausedAt != null) o.ph = 1e9;
    o.e = reduced() ? 1 : cl(o.ph / 800);
    return o;
  }
  function slots(str, cx, cy) {
    var gap = 0.15, x = 0, out = [], i;
    for (i = 0; i < str.length; i++) { out.push({ ch: str[i], u: x }); x += wOf(str[i]) + gap; }
    x -= gap; for (i = 0; i < out.length; i++) { out[i].x = cx + (out[i].u - x / 2) * Hd; out[i].y = cy - Hd / 2; }
    return out;
  }

  /* ---------- кэш знаков ---------- */
  var PAD = 0.55;
  function mk(ch) { var c = doc.createElement("canvas"); c.width = Math.ceil((wOf(ch) + 2 * PAD) * Hd * dpr); c.height = Math.ceil((1 + 2 * PAD) * Hd * dpr); return c; }
  function unit(x) { var k = Hd * dpr; x.setTransform(k, 0, 0, k, PAD * k, PAD * k); }
  function strokeG(x, ch, lwPx, style) {
    x.lineCap = "round"; x.lineJoin = "round"; x.lineWidth = lwPx / Hd; x.strokeStyle = style;
    P2[ch].forEach(function (p) { x.stroke(p); });
  }
  function blur(x, px) { x.filter = px > 0 ? "blur(" + (px * dpr).toFixed(1) + "px)" : "none"; }
  function glyph(kind, ch) {
    var P = pal()[1], key = kind + ch, c = cache[key]; if (c) return c;
    c = mk(ch); var x = c.getContext("2d");
    if (kind === "lineGlow" || kind === "lineFull") {
      unit(x); blur(x, 16 * S); strokeG(x, ch, 13 * S, rgba(P.g, 0.2));
      blur(x, 5 * S); strokeG(x, ch, 5 * S, rgba(P.g, 0.42)); blur(x, 0);
      if (kind === "lineFull") { strokeG(x, ch, 3.2 * S, rgba(P.c, 0.3)); strokeG(x, ch, 1.4 * S, rgba(P.c, 0.95)); }
    } else if (kind === "dustGlow") {
      unit(x); blur(x, 0.09 * Hd); strokeG(x, ch, 0.13 * Hd, rgba(P.g, 0.16)); blur(x, 0);
    }
    return (cache[key] = c);
  }
  function put(img, sl, al) {
    if (al <= 0.002) return; ctx.globalAlpha = cl(al);
    ctx.drawImage(img, (sl.x - PAD * Hd) * dpr, (sl.y - PAD * Hd) * dpr); ctx.globalAlpha = 1;
  }
  function sprite() {
    if (cache.sp) return cache.sp; var P = pal()[1], n = Math.ceil(28 * dpr), c = doc.createElement("canvas"); c.width = c.height = n;
    var x = c.getContext("2d"), g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    g.addColorStop(0, rgba(P.c, 1)); g.addColorStop(0.16, rgba(P.c, 0.85)); g.addColorStop(0.4, rgba(P.g, 0.22)); g.addColorStop(1, rgba(P.g, 0));
    x.fillStyle = g; x.fillRect(0, 0, n, n); return (cache.sp = c);
  }
  function dot(px, py, size, al) { if (al <= 0.003) return; var sp = sprite(); ctx.globalAlpha = cl(al); ctx.drawImage(sp, (px - size / 2) * dpr, (py - size / 2) * dpr, size * dpr, size * dpr); ctx.globalAlpha = 1; }
  /* подпись рисуется один раз в свой холст: тень текста дорога, а кадр перетекания идёт 60 раз в секунду */
  function caption(txt, y, al) {
    if (!txt || al <= 0.003) return; var key = "cap" + txt, c = cache[key];
    if (!c) {
      var P = pal()[1], fs = Math.round(10.5 * Math.max(1, S)), f = "500 " + fs + "px Inter, system-ui, sans-serif", TT = txt.toUpperCase();
      c = doc.createElement("canvas"); var x = c.getContext("2d"); x.font = f; try { x.letterSpacing = "0.22em"; } catch (e) { /* старый холст */ }
      var w = Math.ceil(x.measureText(TT).width + fs * 3 + 24); c.width = Math.ceil(w * dpr); c.height = Math.ceil((fs + 28) * dpr);
      x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.font = f; try { x.letterSpacing = "0.22em"; } catch (e) { /* старый холст */ }
      x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = rgba(P.c, 0.55); x.shadowColor = rgba(P.g, 0.5); x.shadowBlur = 8 * dpr;
      x.fillText(TT, w / 2 + 1, (fs + 28) / 2); c._w = w; c._h = fs + 28; cache[key] = c;
    }
    ctx.globalAlpha = cl(al); ctx.drawImage(c, Math.round((CW / 2 - c._w / 2) * dpr), Math.round((y - c._h / 2) * dpr)); ctx.globalAlpha = 1;
  }

  /* ---------- линии света: новая цифра вычерчивается светящимся пером, старая стирается следом ---------- */
  function traceCore(sl, ch, from, to, al) {
    var P = pal()[1], L = LEN[ch], acc = 0, k = Hd * dpr;
    ctx.setTransform(k, 0, 0, k, sl.x * dpr, sl.y * dpr); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (var i = 0; i < L.length; i++) {
      var a = cl((from * L.T - acc) / L[i]) * L[i], b = cl((to * L.T - acc) / L[i]) * L[i]; acc += L[i];
      if (b - a <= 0.0005) continue;
      ctx.setLineDash([0, a, b - a, L[i] + 1]);
      ctx.lineWidth = 3.2 * S / Hd; ctx.strokeStyle = rgba(P.c, 0.3 * al); ctx.stroke(P2[ch][i]);
      ctx.lineWidth = 1.4 * S / Hd; ctx.strokeStyle = rgba(P.c, 0.95 * al); ctx.stroke(P2[ch][i]);
    }
    ctx.setLineDash([]); ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  function tip(sl, ch, f, al) { var p = ptAt(ch, f); dot(sl.x + p[0] * Hd, sl.y + p[1] * Hd, 22 * S, al); }
  function vLine(st, A, B, E) {
    for (var i = 0; i < B.length; i++) {
      var n = B[i], o = A[i];
      if (E != null) {
        var sw = 1 + 0.55 * bell(E / 1500), u = sm((E - 1400) / 4200);
        if (u <= 0) { put(glyph("lineFull", n.ch), n, 1); put(glyph("lineGlow", n.ch), n, sw - 1); }
        else { put(glyph("lineGlow", n.ch), n, 1 - u); traceCore(n, n.ch, u, 1, 1); if (u < 1) tip(n, n.ch, u, 0.8 * (1 - u)); }
        continue;
      }
      if (!o || o.ch === n.ch || st.e >= 1) { put(glyph("lineFull", n.ch), n, 1); continue; }
      var e = st.e, t = sm(e);
      put(glyph("lineGlow", o.ch), o, Math.pow(1 - t, 1.3)); traceCore(o, o.ch, t, 1, 1 - t * 0.6);
      put(glyph("lineGlow", n.ch), n, Math.pow(t, 1.6)); traceCore(n, n.ch, 0, t, 1); tip(n, n.ch, t, 0.9 * bell(e));
    }
  }
  /* ---------- пыль света: цифры из пылинок; на смене секунды пыль перетекает в новую цифру ---------- */
  var NP = 120, NC = 22, PTS = {};
  function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function pts(ch) {
    if (PTS[ch]) return PTS[ch]; var n = ch === ":" ? NC : NP, out = [];
    for (var i = 0; i < n; i++) {
      var p = ptAt(ch, ch === ":" ? (i < n / 2 ? 0 : 1) : (i + 0.5) / n), j = ch === ":" ? 0.035 : 0.013, a = rnd(i + 7) * 6.283, r = Math.sqrt(rnd(i + 3)) * j;
      out.push([p[0] + Math.cos(a) * r, p[1] + Math.sin(a) * r]);
    }
    return (PTS[ch] = out);
  }
  /* стоящая цифра пыли — один раз в свой холст: на смене секунды пересыпаются только меняющиеся цифры */
  function dustStill(ch, i) {
    var key = "ds" + i + ch, c = cache[key]; if (c) return c;
    c = mk(ch); var x = c.getContext("2d"), sp = sprite(), Pn = pts(ch), g = glyph("dustGlow", ch);
    x.drawImage(g, 0, 0); x.globalCompositeOperation = "lighter";
    for (var k = 0; k < Pn.length; k++) {
      var seed = i * 1000 + k, sz = (5 + 6 * rnd(seed)) * S, px = (PAD + Pn[k][0]) * Hd, py = (PAD + Pn[k][1]) * Hd;
      x.globalAlpha = cl(0.5 + 0.4 * rnd(seed + 9)); x.drawImage(sp, (px - sz / 2) * dpr, (py - sz / 2) * dpr, sz * dpr, sz * dpr);
    }
    return (cache[key] = c);
  }
  function vDust(st, A, B, E) {
    var i, k;
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < B.length; i++) {
      var n = B[i], o = A[i], moving = o && o.ch !== n.ch && st.e < 1, t = sm(st.e), Pn = pts(n.ch), Po = moving ? pts(o.ch) : null;
      if (E == null && !moving) { put(dustStill(n.ch, i), n, 1); continue; }
      if (E != null) put(glyph("dustGlow", n.ch), n, 1 - sm(E / 1800));
      else { put(glyph("dustGlow", o.ch), o, 1 - t); put(glyph("dustGlow", n.ch), n, t); }
      for (k = 0; k < Pn.length; k++) {
        var seed = i * 1000 + k, sz = (5 + 6 * rnd(seed)) * S, x = n.x + Pn[k][0] * Hd, y = n.y + Pn[k][1] * Hd, al = 0.5 + 0.4 * rnd(seed + 9);
        if (E != null) {
          var d = 300 + 1600 * rnd(seed + 2), q = Math.max(0, E - d) / 1000;
          y -= (14 + 26 * rnd(seed + 4)) * S * Math.pow(q, 1.25); x += Math.sin(q * (0.6 + rnd(seed + 5)) + seed) * 6 * S * q;
          al *= 1 - sm((E - d) / (2600 + 2600 * rnd(seed + 6)));
        } else {
          var ox = o.x + Po[k][0] * Hd, oy = o.y + Po[k][1] * Hd, w = sm(cl((st.e - 0.25 * rnd(seed + 1)) / 0.75)), bend = Math.sin(Math.PI * w) * Hd * 0.12 * (rnd(seed + 8) - 0.5);
          var dx = x - ox, dy = y - oy, L = Math.sqrt(dx * dx + dy * dy) || 1;
          x = ox + dx * w - dy / L * bend; y = oy + dy * w + dx / L * bend; al *= 0.85 + 0.3 * bell(w);
        }
        dot(x, y, sz, al);
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- кадр ---------- */
  var raf = 0, tmo = 0, listeners = [];
  function emit(ev) { listeners.forEach(function (f) { try { f(ev); } catch (e) { /* слушатель не роняет кадр */ } }); }
  function capY() { return Math.round(H * 0.6); }   /* ниже — голос дома */
  function frame() {
    raf = 0; if (!cv) return;
    var now = performance.now(), rm = reduced(), dt = Math.min(64, now - (lastT || now)); lastT = now;
    if (cyT == null) cyT = Math.round(H * 0.5); if (cyC == null) cyC = cyT;
    if (rm || Math.abs(cyT - cyC) < 0.5) cyC = cyT; else cyC += (cyT - cyC) * (1 - Math.exp(-dt / 110));
    var moving = cyC !== cyT;
    /* холст — только полоса времени; сдвиг под панель — перенос холста композитором, без перерисовки */
    var py = Math.round(cyC - CY); if (py !== posY) { posY = py; cv.style.transform = "translate3d(" + Math.round((W - CW) / 2) + "px," + py + "px,0)"; }
    if (!mode) {
      if (cyDrawn !== -1) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); cyDrawn = -1; lastKey = ""; painted++; }
      if (moving) kick();
      return;
    }
    var v = vnow(), st = state(v), E = null;
    if (st.done) {
      if (endAt == null) { endAt = now - (v - total); emit("done"); }
      E = rm ? 1e9 : now - endAt;
      if (now - endAt > 13000) { mode = null; emit("gone"); kick(); return; }
    }
    var busy = !rm && (st.e < 1 || (E != null && E < 13000));
    var key = [variant, pal()[0], W, H, st.str, rm, label, pausedAt != null, E == null ? "" : rm ? "rm" : Math.min(E, 13000)].join("|");
    if (busy || key !== lastKey) {
      lastKey = key; ctx.setTransform(1, 0, 0, 1, 0, 0);
      var cx = CW / 2, cy = CY;
      ctx.clearRect(0, 0, cv.width, cv.height); cyDrawn = cy; painted++;
      var A = slots(st.prev, cx, cy), B = slots(st.str, cx, cy);
      if (A.length !== B.length) A = [];
      var cY = cy + Hd * 0.5 + 34 * S, EE = E;
      if (rm && E != null) E = null;   /* неподвижно: «0:00» и подпись, без угасания */
      if (variant === "dust") vDust(st, A, B, E); else vLine(st, A, B, E);
      var lbl = T(mode === "timer" ? "desk.t.timer" : mode === "stopwatch" ? "desk.t.sw" : "desk.t.alarm") + (label ? " · " + label : "");
      if (pausedAt != null) lbl += " · " + T("desk.t.paused");
      if (st.done) {
        if (rm) EE = 3000;
        caption(lbl, cY, rm ? 0 : 1 - sm(EE / 700));
        caption(T(mode === "alarm" ? "desk.t.time" : "desk.t.up"), cY, rm ? 1 : sm((EE - 600) / 1600) * (1 - sm((EE - 9000) / 3000)));
      } else caption(lbl, cY, 1);
    }
    if (busy || moving) kick();
    else if (pausedAt == null) {
      clearTimeout(tmo);
      var wait = st.done ? Math.max(16, 13000 - (now - endAt) + 4) : Math.max(16, (1000 - v % 1000) + 4);
      tmo = setTimeout(kick, wait);
    }
  }
  function kick() { if (!raf && cv && !doc.hidden) raf = requestAnimationFrame(frame); }
  function size() {
    var oldH = H;
    W = window.innerWidth; H = window.innerHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    /* размер «как крупные часы на стене»: цифры ~ 12 % короткой стороны */
    Hd = Math.round(Math.max(56, Math.min(96, Math.min(W, H) * 0.118))); S = Hd / 84;
    CW = Math.min(W, Math.round(Hd * 6.4)); CH = Math.round(Hd * 3.6); CY = Math.round(Hd * 1.95); posY = null;
    cv.width = Math.round(CW * dpr); cv.height = Math.round(CH * dpr); cv.style.width = CW + "px"; cv.style.height = CH + "px"; cache = {}; lastKey = ""; cyDrawn = null;
    if (cyT == null || cyT === Math.round(oldH * 0.5)) { cyT = cyC = Math.round(H * 0.5); }
    kick();
  }
  function retheme() { cache = {}; lastKey = ""; kick(); emit("mood"); }
  function setView(k) { var nv = k === "dust" ? "dust" : "line"; if (nv === variant) return; variant = nv; lastKey = ""; kick(); emit("variant"); }

  var api = {
    Hd: function () { return Hd; }, S: function () { return S; },
    /* вид меняют Настройки (sysbaby.desktime.view + sb:desktime); отсюда — только чтение */
    variant: function () { return variant; },
    timer: function (ms, lbl, elapsed) { begin("timer", ms, lbl, elapsed); },
    stopwatch: function (elapsed) { begin("stopwatch", 0, "", elapsed); },
    alarm: function (ms, lbl, elapsed) { begin("alarm", ms, lbl, elapsed); },
    pause: function () { if (mode && pausedAt == null) { pausedAt = vnow(); lastKey = ""; kick(); emit("pause"); } },
    resume: function () { if (pausedAt != null) { vBase = pausedAt; rBase = performance.now(); pausedAt = null; lastKey = ""; kick(); emit("resume"); } },
    stop: function () { mode = null; pausedAt = null; endAt = null; clearTimeout(tmo); kick(); emit("stop"); },
    info: function () { var v = vnow(); return { mode: mode, v: v, total: total, label: label, paused: pausedAt != null, done: !!(mode && mode !== "stopwatch" && v >= total) }; },
    setCy: function (y) { var c = capY(); cyT = y == null ? Math.round(H * 0.5) : Math.min(Math.round(y), c); kick(); },
    rect: function () { return cv ? cv.getBoundingClientRect() : null; },
    frames: function () { return painted; },
    on: function (f) { if (typeof f === "function") listeners.push(f); }
  };
  window.sbDeskTime = api;

  function mount() {
    var layer = doc.querySelector(".wp-layer"); if (!layer) return false;
    buildGlyphs();
    cv = doc.createElement("canvas"); cv.id = "sbDeskTime"; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:absolute;left:0;top:0;right:auto;bottom:auto;display:block;pointer-events:none;will-change:transform";
    layer.appendChild(cv); ctx = cv.getContext("2d");
    window.addEventListener("sb:theme", retheme);
    window.addEventListener("resize", size);
    doc.addEventListener("visibilitychange", function () { lastKey = ""; kick(); });
    var onM = function () { lastKey = ""; kick(); };
    if (mq.addEventListener) mq.addEventListener("change", onM);
    if (window.MutationObserver) new MutationObserver(onM).observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    window.addEventListener("sb:desktime", function (ev) { setView(ev && ev.detail && ev.detail.view ? ev.detail.view : readView()); });
    window.addEventListener("storage", function (ev) { if (ev.key === VIEW_KEY) setView(readView()); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", function () { cache = {}; lastKey = ""; kick(); });
    size();
    emit("ready");
    return true;
  }
  var tries = 0, iv = setInterval(function () {
    if (++tries > 900) { clearInterval(iv); return; }
    if (doc.querySelector(".wp-layer") && mount()) clearInterval(iv);
  }, 200);
})();
