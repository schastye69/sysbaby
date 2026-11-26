/* sys.baby — «РОЖДЕНИЕ» ЖИВЫМ РИСУНКОМ · решение D-1430-BIRTH-LIVE (основатель 25.11.2026).
 *
 * Основатель 25.11.2026: загрузка в воротах — не видео (мутное, без звёзд и искр), а живой рисунок по утверждённому
 * эталону Г5 (zagruzka-G5-ETALON.html, $SB_PEREEZD/demo-utverzhdeno): протозвёздный диск, знак sys.baby рождается из
 * света, знаки строки слова разлетаются искрами и встают молодыми звёздами на круг диска, далёкие звёзды вокруг.
 * Слова «готово» в кадре нет.
 *
 * Код рисунка — эталонный (LD · VOL · GAL · LD_ANIM), перенесён как есть; поменялось только то, что требует система:
 *   · знаки строки берутся с холста знаков поля (gate.js, canvas.vg-wf-signs), а не с картинки; отпечатка пикселей нет —
 *     рисунку нужны только место и цвет каждого знака;
 *   · прогресса работы ворота не отдают — сжатие идёт по времени ожидания (асимптота), а финал наступает, когда ворота
 *     перестали думать: слой мягко тает за время сцены, ничего не дожидаясь;
 *   · лёгкость для телефонов: всё мягкое — в малом буфере, размер которого сам падает по скорости кадров; звёзды, искры
 *     и струи — заранее нарисованные спрайты; на слабом устройстве (≤ 4 ядер, ≤ 3 ГБ, малый экран) меньше звёзд, колец
 *     и сгустков струи, ниже плотность пикселей, без зерна плёнки; слой виден только прозрачностью.
 * Заводит core/birth.js (лениво, только в живом виде). */
(function () {
  "use strict";
  if (window.sbBirthLive) return;

  /* ── LD: общие приёмы — случайность с зерном, сглаживания, световые пятна, знаки строки ── */
  var LD = (function () {
    function rng(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
    function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
    function sm5(x) { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); }
    /* мягкое световое пятно: заранее нарисованный спрайт */
    function glow(r, rgb, dpr, core) {
      var c = document.createElement("canvas"), n = Math.max(2, Math.ceil(r * 2 * dpr)); c.width = c.height = n;
      var x = c.getContext("2d"), g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      g.addColorStop(0, "rgba(" + rgb + ",1)"); g.addColorStop(core || 0.2, "rgba(" + rgb + ",.42)"); g.addColorStop(0.55, "rgba(" + rgb + ",.08)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
      x.fillStyle = g; x.fillRect(0, 0, n, n); return c;
    }
    /* ЗНАКИ СТРОКИ — не слово: с холста знаков поля (как их видит человек) берутся место и цвет каждого знака. */
    function signs() {
      var list = Array.prototype.slice.call(document.querySelectorAll("#sbVaultGate .vg-wf-signs")), out = [], im = null, i;
      for (i = 0; i < list.length; i++) { var rr = list[i].getBoundingClientRect(); if (rr.width > 4 && rr.height > 4 && list[i].width > 0) { im = list[i]; if (list[i].closest(".vg-sheet")) break; } }
      if (!im) return { list: out };
      var r = im.getBoundingClientRect(), w = im.width, h = im.height, d;
      try { d = im.getContext("2d").getImageData(0, 0, w, h).data; } catch (e) { return { list: out }; }
      var cols = [], X, Y;
      for (X = 0; X < w; X++) { var n = 0, R = 0, G = 0, B = 0; for (Y = 0; Y < h; Y++) { var k = (Y * w + X) * 4; if (d[k + 3] > 60) { n++; R += d[k]; G += d[k + 1]; B += d[k + 2]; } } cols.push(n ? [n, R / n, G / n, B / n] : null); }
      var run = null;
      for (X = 0; X <= cols.length; X++) {
        var cc = X < cols.length ? cols[X] : null;
        if (cc) { if (!run) run = { x0: X, n: 0, R: 0, G: 0, B: 0 }; run.n += cc[0]; run.R += cc[1] * cc[0]; run.G += cc[2] * cc[0]; run.B += cc[3] * cc[0]; run.x1 = X; }
        else if (run) { if (run.x1 - run.x0 > 2) out.push({ x: r.left + (run.x0 + run.x1) / 2 / w * r.width, y: r.top + r.height / 2, rgb: Math.round(run.R / run.n) + "," + Math.round(run.G / run.n) + "," + Math.round(run.B / run.n) }); run = null; }
      }
      return { list: out };
    }
    /* тёплые звёзды цвета знака: ядро и ореол, по спрайту на цвет */
    var starCache = {};
    function starSprites(rgb, dpr) {
      var k = rgb + "@" + dpr; if (starCache[k]) return starCache[k];
      var c = rgb.split(",").map(Number), warm = [Math.round(c[0] * 0.55 + 255 * 0.45), Math.round(c[1] * 0.55 + 210 * 0.45), Math.round(c[2] * 0.55 + 160 * 0.45)].join(",");
      return (starCache[k] = { core: glow(6, "255,246,230", dpr, 0.35), halo: glow(26, warm, dpr, 0.07) });
    }
    return { signs: signs, starSprites: starSprites, rng: rng, cl: cl, sm: sm, sm5: sm5, glow: glow };
  })();

  /* ── GAL: спрайты пыли и ядра, знаки строки — молодые звёзды ── */
  var GAL = (function () {
    function sprites(dpr) { return { dot: LD.glow(3, "255,236,214", dpr, 0.4), blue: LD.glow(3, "190,205,255", dpr, 0.4) }; }
    function heroes(DPR, C, RR) { var sg = LD.signs(); var list = sg.list.length ? sg.list : [{ x: C.x, y: C.y + RR, rgb: "255,200,150" }]; return { list: list.map(function (s, k) { return { x: s.x, y: s.y, sp: LD.starSprites(s.rgb, DPR), born: k * 0.05, tw: k * 1.7 }; }) }; }
    function star(g, h, x, y, a, size) { var hs = 30 * (size || 1), cs = 7 * (size || 1); g.globalAlpha = 0.4 * a; g.drawImage(h.sp.halo, x - hs / 2, y - hs / 2, hs, hs); g.globalAlpha = 0.95 * a; g.drawImage(h.sp.core, x - cs / 2, y - cs / 2, cs, cs); }
    return { sprites: sprites, heroes: heroes, star: star };
  })();

  /* ── VOL: объёмный движок Г5. Мягкое (газ, пыль, свет ядра) — лучами по слоям в малом буфере, размер которого сам
     подстраивается под скорость кадров; резкое (знак, кольца, струи, звёзды) — 2D поверх, в перспективе той же камеры.
     Знак sys.baby — точная геометрия системы (shifr.js: Path2D двух половин, geo(0,0,100,25,20,8.68)). ── */
  var VOL = (function () {
    var LOGO_W = "M20 0H75V25H33.68A8.68 8.68 0 0 0 25 33.68V75H0V20A20 20 0 0 1 20 0Z", LOGO_O = "M80 100H25V75H66.32A8.68 8.68 0 0 0 75 66.32V25H100V80A20 20 0 0 1 80 100Z";
    var SPAN = 2.2, PATH = null;
    function path() { if (!PATH) { PATH = new Path2D(LOGO_W); PATH.addPath(new Path2D(LOGO_O)); } return PATH; }
    /* шум: бесшовный 256², четыре канала (облака, второе зерно, гребни, мелочь) */
    var NZ = null, NS = 256;
    function noise() {
      if (NZ) return NZ;
      var N = NS;
      function lattice(seed, f) { var r = LD.rng(seed), a = new Float32Array(f * f); for (var i = 0; i < a.length; i++) a[i] = r(); return a; }
      function fbm(seed, f0, oct, ridge) {
        var lats = [], f, k; for (k = 0, f = f0; k < oct; k++, f *= 2) lats.push([lattice(seed + k * 31, f), f]);
        var a = new Float32Array(N * N), mn = 1e9, mx = -1e9;
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
          var s = 0, w = 1, tw = 0;
          for (k = 0; k < oct; k++) {
            var lat = lats[k][0], ff = lats[k][1], fx = x / N * ff, fy = y / N * ff, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
            tx = tx * tx * tx * (tx * (tx * 6 - 15) + 10); ty = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
            var x0 = ix % ff, y0 = iy % ff, x1 = (x0 + 1) % ff, y1 = (y0 + 1) % ff, A = lat[y0 * ff + x0], B = lat[y0 * ff + x1], Cc = lat[y1 * ff + x0], Dd = lat[y1 * ff + x1];
            var v = A + (B - A) * tx + (Cc - A) * ty + (A - B - Cc + Dd) * tx * ty;
            if (ridge) { v = 1 - Math.abs(v * 2 - 1); v *= v; }
            s += v * w; tw += w; w *= 0.5;
          }
          s /= tw; a[y * N + x] = s; if (s < mn) mn = s; if (s > mx) mx = s;
        }
        for (var i = 0; i < a.length; i++) a[i] = (a[i] - mn) / (mx - mn);
        return a;
      }
      NZ = [fbm(11, 4, 6, false), fbm(73, 8, 5, false), fbm(191, 4, 5, true), fbm(257, 32, 2, false)];
      return NZ;
    }
    function nz(a, x, y) {
      x *= NS; y *= NS; var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      ix &= 255; iy &= 255; var jx = (ix + 1) & 255, r0 = iy << 8, r1 = ((iy + 1) & 255) << 8;
      var A = a[r0 + ix], B = a[r0 + jx]; A += (B - A) * fx; var Cc = a[r1 + ix], Dd = a[r1 + jx]; Cc += (Dd - Cc) * fx;
      return A + (Cc - A) * fy;
    }
    /* знак: резкая маска и три степени рассеяния (белые; цвет — при рисовании) */
    var SIGN = null;
    function signImgs() {
      if (SIGN) return SIGN;
      var N = 512, k = N / SPAN / 100, o = (N - 100 * k) / 2;
      var base = document.createElement("canvas"); base.width = base.height = N; var bx = base.getContext("2d"); bx.setTransform(k, 0, 0, k, o, o); bx.fillStyle = "#fff"; bx.fill(path());
      var d = bx.getImageData(0, 0, N, N).data, src = new Float32Array(N * N);
      for (var i = 0; i < N * N; i++) src[i] = d[i * 4 + 3] / 255;
      function blur(r) {
        var a = Float32Array.from(src), b = new Float32Array(N * N), pass, y, xx, s, w = r * 2 + 1;
        for (pass = 0; pass < 3; pass++) {
          for (y = 0; y < N; y++) { s = 0; for (xx = -r; xx <= r; xx++) s += a[y * N + Math.min(N - 1, Math.max(0, xx))]; for (xx = 0; xx < N; xx++) { b[y * N + xx] = s / w; s += a[y * N + Math.min(N - 1, xx + r + 1)] - a[y * N + Math.max(0, xx - r)]; } }
          for (xx = 0; xx < N; xx++) { s = 0; for (y = -r; y <= r; y++) s += b[Math.min(N - 1, Math.max(0, y)) * N + xx]; for (y = 0; y < N; y++) { a[y * N + xx] = s / w; s += b[Math.min(N - 1, y + r + 1) * N + xx] - b[Math.max(0, y - r) * N + xx]; } }
        }
        var mx = 0; for (var j = 0; j < a.length; j++) if (a[j] > mx) mx = a[j];
        var c = document.createElement("canvas"); c.width = c.height = N; var x = c.getContext("2d"), im = x.createImageData(N, N);
        for (j = 0; j < a.length; j++) { im.data[j * 4] = im.data[j * 4 + 1] = im.data[j * 4 + 2] = 255; im.data[j * 4 + 3] = Math.round(Math.min(1, a[j] / mx * 1.08) * 255); }
        x.putImageData(im, 0, 0); return c;
      }
      SIGN = { G: blur(3), B: blur(10), A: blur(28), tints: {} };
      return SIGN;
    }
    function tint(name, rgb) {
      var S = signImgs(), key = name + "|" + rgb; if (S.tints[key]) return S.tints[key];
      var src = S[name], c = document.createElement("canvas"); c.width = src.width; c.height = src.height; var x = c.getContext("2d");
      x.drawImage(src, 0, 0); x.globalCompositeOperation = "source-in"; x.fillStyle = "rgb(" + rgb + ")"; x.fillRect(0, 0, c.width, c.height);
      return (S.tints[key] = c);
    }
    /* тёплая «грануляция» поверхности знака: плитка из шума */
    var GRAN = null;
    function granule() {
      if (GRAN) return GRAN; var N = 192, c = document.createElement("canvas"); c.width = c.height = N; var x = c.getContext("2d"), im = x.createImageData(N, N), Z = noise();
      for (var y = 0; y < N; y++) for (var xx = 0; xx < N; xx++) { var v = nz(Z[3], xx / N * 2, y / N * 2) * 0.6 + nz(Z[2], xx / N, y / N) * 0.4, i = (y * N + xx) * 4; v = Math.max(0, Math.min(1, (v - 0.3) * 1.6)); im.data[i] = 255; im.data[i + 1] = Math.round(170 + 80 * v); im.data[i + 2] = Math.round(90 + 120 * v); im.data[i + 3] = Math.round(255 * v); }
      x.putImageData(im, 0, 0); return (GRAN = c);
    }
    /* камера: цель в начале координат; возвышение el над плоскостью xz */
    function cam(el, D) { var se = Math.sin(el), ce = Math.cos(el); return { pos: [0, D * se, D * ce], r: [1, 0, 0], u: [0, ce, -se], f: [0, -se, -ce], D: D }; }
    function project(cm, P, C, K) {
      var v0 = P[0] - cm.pos[0], v1 = P[1] - cm.pos[1], v2 = P[2] - cm.pos[2], z = v0 * cm.f[0] + v1 * cm.f[1] + v2 * cm.f[2];
      if (z < 0.02) return null;
      return [C.x + (v0 * cm.r[0] + v1 * cm.r[1] + v2 * cm.r[2]) / z * K, C.y - (v0 * cm.u[0] + v1 * cm.u[1] + v2 * cm.u[2]) / z * K, 1 / z];
    }
    function planeM(cm, C, K, O, ax, az, unit) {
      var e = 0.01, P0 = project(cm, O, C, K), Px = project(cm, [O[0] + ax[0] * e, O[1] + ax[1] * e, O[2] + ax[2] * e], C, K), Pz = project(cm, [O[0] + az[0] * e, O[1] + az[1] * e, O[2] + az[2] * e], C, K);
      if (!P0 || !Px || !Pz) return null;
      return [(Px[0] - P0[0]) / e * unit, (Px[1] - P0[1]) / e * unit, (Pz[0] - P0[0]) / e * unit, (Pz[1] - P0[1]) / e * unit, P0[0], P0[1]];
    }
    function signM(M) { return [M[0], M[1], M[2], M[3], M[4] - 50 * M[0] - 50 * M[2], M[5] - 50 * M[1] - 50 * M[3]]; }
    function drawSignImg(g, img) { var s = SPAN * 100; g.drawImage(img, 50 - s / 2, 50 - s / 2, s, s); }
    function buf(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; var x = c.getContext("2d"); var im = x.createImageData(w, h); return { c: c, x: x, im: im, d: im.data, w: w, h: h }; }
    function put(b) { b.x.putImageData(b.im, 0, 0); }
    /* излучение E и пропускание T → цвет с непрозрачностью; мягкое сжатие ярких мест */
    function px4(d, i, Er, Eg, Eb, T) {
      Er = Er / (1 + Er * 0.55); Eg = Eg / (1 + Eg * 0.55); Eb = Eb / (1 + Eb * 0.55);
      var A = 1 - T, m = Er > Eg ? (Er > Eb ? Er : Eb) : (Eg > Eb ? Eg : Eb); if (m > A) A = m; if (A > 1) A = 1;
      if (A < 0.002) { d[i + 3] = 0; return; }
      d[i] = Er / A * 255; d[i + 1] = Eg / A * 255; d[i + 2] = Eb / A * 255; d[i + 3] = A * 255;
    }
    /* разрешение буфера подстраивается под кадр */
    function Adapt(maxQ, startQ, minQ) {
      var q = startQ, ema = 16, slow = 0, fast = 0, ups = 0;
      return {
        tick: function (dt) {
          var ms = dt * 1000; if (ms > 120) return q;
          ema += (ms - ema) * 0.12;
          if (ema > 20) { slow += dt; fast = 0; if (slow > 0.2 && q > minQ) { q = Math.max(minQ, q * 0.8); slow = 0; ema = 16; } }
          else if (ema < 14) { fast += dt; slow = 0; if (fast > 1.5 && q < maxQ && ups < 5) { q = Math.min(maxQ, q * 1.15); fast = 0; ups++; } }
          else { slow = 0; fast = 0; }
          return q;
        }
      };
    }
    /* зерно плёнки */
    var GR = null;
    function grain(g, bx, a) {
      if (!GR) { var n = 128, c = document.createElement("canvas"); c.width = c.height = n; var x = c.getContext("2d"), im = x.createImageData(n, n), r = LD.rng(7); for (var i = 0; i < n * n; i++) { var v = (r() + r() + r() - 1.5) / 1.5; im.data[i * 4] = v > 0 ? 255 : 0; im.data[i * 4 + 1] = v > 0 ? 240 : 0; im.data[i * 4 + 2] = v > 0 ? 220 : 0; im.data[i * 4 + 3] = Math.min(255, Math.abs(v) * 255); } x.putImageData(im, 0, 0); GR = { c: c, p: null, g: null }; }
      if (GR.g !== g) { GR.p = g.createPattern(GR.c, "repeat"); GR.g = g; }
      var ox = Math.floor(Math.random() * 128), oy = Math.floor(Math.random() * 128);
      g.save(); g.globalCompositeOperation = "source-over"; g.globalAlpha = a; g.translate(bx.x - ox, bx.y - oy); g.fillStyle = GR.p; g.fillRect(ox, oy, bx.w, bx.h); g.restore();
    }
    function starfield(n, rnd) { var a = []; for (var i = 0; i < n; i++) { var w = rnd(); a.push({ x: rnd(), y: rnd(), s: 0.4 + Math.pow(rnd(), 3) * 1.6, a: 0.25 + rnd() * 0.6, tw: rnd() * 6.28, blue: w > 0.88 }); } return a; }
    return { path: path, noise: noise, nz: nz, signImgs: signImgs, tint: tint, granule: granule, cam: cam, project: project, planeM: planeM, signM: signM, drawSignImg: drawSignImg, buf: buf, put: put, px4: px4, Adapt: Adapt, grain: grain, starfield: starfield };
  })();

  /* ── LD_ANIM: Г5 «Рождение» — протозвёздный диск (эталон, без финала «готово») ── */
  function anim(env) {
    var L_ = LD, V = VOL, sm = L_.sm, cl = L_.cl, RM = env.reduced, LITE = env.lite, rnd = L_.rng(55);
    var W = 0, H = 0, C = { x: 0, y: 0, r: 100 }, RR = 100, K = 100, D = 3.4, SW = 0.34;
    var AQ = null, BK = null, FR = null, Z = null, stars = [], hero = null, spr = null, jetS = null;
    var spin = 0, bright = 0, rotS = -0.55, finRot = null, rings = [], fc = 0;
    function build() {
      RR = Math.min(C.r * 1.6, W * 0.46, H * 0.5, C.y * 1.05); K = RR * D;
      Z = V.noise(); V.signImgs(); V.granule();
      AQ = AQ || (LITE ? V.Adapt(0.3, RM ? 0.12 : 0.13, 0.07) : V.Adapt(0.42, RM ? 0.15 : 0.17, 0.09)); BK = FR = null;
      stars = V.starfield(LITE ? (RM ? 60 : 90) : (RM ? 90 : 160), rnd); spr = GAL.sprites(1.5); hero = GAL.heroes(1.5, C, RR);
      hero.list.forEach(function (h, k) { h.a = k / hero.list.length * 6.2832 + 0.4; h.r = 0.62 + 0.3 * ((k * 7) % 5) / 4; });
      jetS = { core: L_.glow(16, "255,236,210", 1.5, 0.3), sheath: L_.glow(40, "255,150,70", 1.5, 0.1) };
      var nr = LITE ? 10 : 18;
      rings = []; for (var i = 0; i < nr; i++) rings.push({ r: 0.26 + 0.3 * Math.pow(i / (nr - 1), 1.2), a: 0.25 + 0.75 * rnd(), d: 0.01 + 0.05 * rnd(), g: 0.004 + 0.03 * rnd(), w: 0.0025 + 0.004 * rnd(), ph: rnd() * 6 });
    }
    var SL_B = [-1, -0.7, -0.42, -0.15], SL_F = [0.15, 0.42, 0.7, 1];
    function volume(cm, q, P) {
      var bw = Math.max(24, Math.round(W * q)), bh = Math.max(24, Math.round(H * q));
      if (!BK || BK.w !== bw || BK.h !== bh) { BK = V.buf(bw, bh); FR = V.buf(bw, bh); }
      var db = BK.d, df = FR.d, ro = cm.pos, f = cm.f, u = cm.u, sx = W / bw, sy = H / bh;
      var Hh = P.H, S = P.S, iS = 1 / S, Rs = P.Rs, spin_ = P.spin, heat = P.heat, kab = P.kab;
      var Z0 = Z[0], Z1 = Z[1], Z2 = Z[2];
      for (var j = 0; j < bh; j++) {
        var tY = -((j + 0.5) * sy - C.y) / K;
        for (var i = 0; i < bw; i++) {
          var dx = ((i + 0.5) * sx - C.x) / K, dy = f[1] + u[1] * tY, dz = f[2] + u[2] * tY, il = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
          dx *= il; dy *= il; dz *= il; var o = (j * bw + i) * 4;
          if (dy > -0.002) { db[o + 3] = 0; df[o + 3] = 0; continue; }
          for (var pass = 0; pass < 2; pass++) {
            var SL = pass ? SL_F : SL_B, Er = 0, Eg = 0, Eb = 0, T = 1;
            for (var s = 0; s < 4; s++) {
              var y = SL[s] * Hh, t = (y - ro[1]) / dy; if (t < 0) continue;
              var x = ro[0] + dx * t, z = ro[2] + dz * t, r2 = x * x + z * z, r = Math.sqrt(r2);
              if (r > 1.75 * S) continue;
              var h = Hh * (0.3 + 0.9 * r), vp = Math.exp(-y * y / (h * h)); if (vp < 0.02) continue;
              var a = spin_ / (r * Math.sqrt(r) + 0.12), ca = Math.cos(a), sa = Math.sin(a), qx = (x * ca + z * sa) * iS, qz = (z * ca - x * sa) * iS;
              var w = V.nz(Z1, qx * 0.21 + y * 0.6, qz * 0.21 + 0.13);
              var n = V.nz(Z0, qx * 0.37 + w * 0.35, qz * 0.37 - w * 0.3 + y * 0.8) * 0.64 + V.nz(Z2, qx * 1.1 + w * 0.25 + y, qz * 1.1 + 0.5) * 0.36;
              var e0 = (n - 0.26) / 0.56; e0 = e0 < 0 ? 0 : e0 > 1 ? 1 : e0; e0 = e0 * e0 * (3 - 2 * e0);
              var rr = r / S, edge = rr < 0.9 ? 1 : rr > 1.75 ? 0 : 1 - (rr - 0.9) / 0.85;
              var cav = r < 0.1 ? 0.18 : r > 0.36 ? 1 : 0.18 + 0.82 * (r - 0.1) / 0.26, dn = e0 * Math.exp(-r / Rs) * edge * vp * 1.9 * cav; if (dn < 0.004) continue;
              var L = (0.12 + heat) * 0.7 / ((r2 + y * y) * 4.5 + 0.32), Lc = L * 1.3, cr, cg, cb;
              if (Lc < 0.35) { var k1 = Lc / 0.35; cr = 0.42 + 0.58 * k1; cg = 0.13 + 0.39 * k1; cb = 0.05 + 0.13 * k1; }
              else if (Lc < 0.8) { var k2 = (Lc - 0.35) / 0.45; cr = 1; cg = 0.5 + 0.3 * k2; cb = 0.16 + 0.32 * k2; }
              else { var k3 = Math.min(1, (Lc - 0.8) / 0.8); cr = 1; cg = 0.8 + 0.1 * k3; cb = 0.48 + 0.24 * k3; }
              var ab = dn * (0.85 + 0.9 * Math.min(1, Math.max(0, (r - 0.35) / 0.85))) * kab, al = ab / (1 + ab);
              var em = dn * L * 0.95;
              Er = Er * (1 - al) + cr * em + 0.016 * dn; Eg = Eg * (1 - al) + cg * em + 0.0056 * dn; Eb = Eb * (1 - al) + cb * em + 0.0024 * dn; T *= 1 - al;
            }
            V.px4(pass ? df : db, o, Er, Eg, Eb, T);
          }
        }
      }
      V.put(BK); V.put(FR);
    }
    /* струя вдоль оси: светящиеся сгустки бегут от ядра */
    function jet(g, cm, side, P, t) {
      if (P.jets < 0.01) return;
      var len = 0.3 + 1.3 * P.jets, n = LITE ? 28 : 46;
      g.globalCompositeOperation = "lighter";
      for (var k = 0; k < n; k++) {
        var s = 0.05 + (k / n) * len, Pp = V.project(cm, [0, s * side, 0], C, K); if (!Pp) continue;
        var kn = V.nz(Z[0], s * 0.55 - t * 0.22 * (RM ? 0 : 1), 0.31 + side * 0.27), knot = 0.35 + 1.4 * kn * kn;
        var fade = sm(s / 0.14) * (1 - sm((s - len * 0.55) / (len * 0.45))) / (1 + 2.2 * s), wpx = (0.012 + 0.05 * s) * K * Pp[2];
        var a = P.jets * fade * knot * 0.5 * (LITE ? 46 / 28 : 1); if (a < 0.005) continue;
        g.globalAlpha = Math.min(1, a * 0.55); var z2 = wpx * 7; g.drawImage(jetS.sheath, Pp[0] - z2 / 2, Pp[1] - z2 / 2, z2, z2);
        g.globalAlpha = Math.min(1, a); var z1 = Math.max(3, wpx * 2.4); g.drawImage(jetS.core, Pp[0] - z1 / 2, Pp[1] - z1 * 0.9, z1, z1 * 1.8);
      }
    }
    function sign(g, cm, P, t) {
      var ax = [Math.cos(rotS), 0, Math.sin(rotS)], az = [-Math.sin(rotS), 0, Math.cos(rotS)];
      var M = V.planeM(cm, C, K, [0, 0, 0], ax, az, SW / 100); if (!M) return;
      var Ms = V.signM(M), form = P.form, heat = P.heat, fx = 1 + P.flash * 1.1;
      g.save(); g.transform(Ms[0], Ms[1], Ms[2], Ms[3], Ms[4], Ms[5]);
      g.globalCompositeOperation = "lighter";
      /* сгусток: облако света, из которого рождается знак */
      var br = 50 * (1.6 - 0.9 * form), rg = g.createRadialGradient(50, 50, 0, 50, 50, br);
      rg.addColorStop(0, "rgba(255,236,206," + (0.9 * heat * (1 - 0.65 * form)).toFixed(3) + ")"); rg.addColorStop(0.35, "rgba(255,170,90," + (0.4 * heat * (1 - 0.5 * form)).toFixed(3) + ")"); rg.addColorStop(1, "rgba(255,120,50,0)");
      g.globalAlpha = 1; g.fillStyle = rg; g.fillRect(50 - br, 50 - br, br * 2, br * 2);
      g.globalAlpha = Math.min(1, form * heat * 0.75 * fx); V.drawSignImg(g, V.tint("A", "255,140,60"));
      /* тело: рассеяние сжимается в точный контур */
      var f3 = form * 3, wA = f3 < 1 ? 1 - f3 * 0.4 : 0.6 * Math.max(0, 2 - f3), wB = f3 < 1 ? f3 : f3 < 2 ? 2 - f3 + 0.2 : 0.2, wG = f3 < 1 ? 0 : f3 < 2 ? f3 - 1 : 3 - f3 + 0.3, wR = f3 < 2 ? 0 : f3 - 2;
      var hb = Math.min(1, heat * 1.1) * fx;
      if (wA > 0.01) { g.globalAlpha = Math.min(1, wA * hb * 0.8); V.drawSignImg(g, V.tint("A", "255,190,120")); }
      if (wB > 0.01) { g.globalAlpha = Math.min(1, wB * hb * 0.9); V.drawSignImg(g, V.tint("B", "255,206,150")); }
      if (wG > 0.01) { g.globalAlpha = Math.min(1, wG * hb); V.drawSignImg(g, V.tint("G", "255,226,186")); }
      if (wR > 0.01) {
        g.save(); g.clip(V.path());
        var bg = g.createRadialGradient(50, 50, 4, 50, 50, 74); bg.addColorStop(0, "rgba(255,250,240,1)"); bg.addColorStop(0.45, "rgba(255,222,170,1)"); bg.addColorStop(1, "rgba(240,140,60,1)");
        g.globalCompositeOperation = "source-over"; g.globalAlpha = Math.min(1, wR * hb * 0.92); g.fillStyle = bg; g.fillRect(0, 0, 100, 100);
        g.globalCompositeOperation = "lighter"; var gx = (t * (RM ? 0.3 : 1.6)) % 100, gi = V.granule(); g.globalAlpha = 0.22 * wR;
        g.drawImage(gi, -gx, -gx * 0.6, 100, 100); g.drawImage(gi, 100 - gx, -gx * 0.6, 100, 100); g.drawImage(gi, -gx, 100 - gx * 0.6, 100, 100); g.drawImage(gi, 100 - gx, 100 - gx * 0.6, 100, 100);
        g.restore(); g.globalCompositeOperation = "lighter";
        g.globalAlpha = Math.min(1, wR * 0.55 * hb); g.lineWidth = 0.9; g.strokeStyle = "rgba(255,244,226,1)"; g.stroke(V.path());
      }
      g.restore();
      /* аккреционный диск: тонкие кольца, бегущие штрихи — мерцание */
      var k0 = 100 / SW, Mw = [M[0] * k0, M[1] * k0, M[2] * k0, M[3] * k0, M[4], M[5]], acc = P.acc;
      if (acc <= 0.01) return;
      g.save(); g.transform(Mw[0], Mw[1], Mw[2], Mw[3], Mw[4], Mw[5]); g.globalCompositeOperation = "lighter";
      rings.forEach(function (rg2) {
        var om = 1 / (rg2.r * Math.sqrt(rg2.r) + 0.12), tw = RM ? 1 : 0.7 + 0.3 * Math.sin(t * 2.2 + rg2.ph);
        g.globalAlpha = Math.min(1, acc * rg2.a * tw * 0.3 * (1.25 - rg2.r)); g.lineWidth = rg2.w; g.strokeStyle = rg2.r < 0.36 ? "rgb(255,232,196)" : "rgb(255,178,104)";
        g.setLineDash([rg2.d, rg2.g]); g.lineDashOffset = -(spin * om * rg2.r * 1.6 + rg2.ph);
        g.beginPath(); g.arc(0, 0, rg2.r, 0, 6.2832); g.stroke();
      });
      g.setLineDash([]); g.restore();
    }
    return {
      rgb: "255,184,112",
      light: function () { return 0.1 + 0.55 * bright; },
      resize: function (w, h, c) { W = w; H = h; C = c; build(); },
      frame: function (g, t, dt, p, fin) {
        var settle = fin >= 0 ? L_.sm5(fin / 0.9) : 0;
        var c = fin >= 0 ? 1 : sm(p / 0.85), form = fin >= 0 ? 1 : L_.sm5(cl((p - 0.15) / 0.75));
        var flash = fin >= 0 ? sm(fin / 0.16) * (1 - sm((fin - 0.22) / 0.6)) : 0;
        var heat = 0.22 + 0.7 * sm(p) + 0.25 * flash;
        var jets = (fin >= 0 ? 1 : sm((p - 0.3) / 0.35)) * (1 - 0.9 * settle) + 0.5 * flash;
        var el = 0.3 + 0.07 * c + 0.28 * settle;
        spin += dt * (RM ? 0.05 : (0.16 + 0.3 * c) * (1 - 0.6 * settle));
        if (fin < 0) rotS += dt * (RM ? 0.008 : 0.045); else { if (finRot === null) finRot = rotS; rotS = finRot * (1 - settle); }
        bright = 0.15 + 0.55 * c * heat + 0.3 * flash;
        var cm = V.cam(el, D), q = AQ.tick(dt);
        var P = { H: 0.46 + (0.11 - 0.46) * c, S: 1.7 + (1.0 - 1.7) * c, Rs: 0.95 + (0.55 - 0.95) * c, spin: spin, heat: heat, kab: 0.55 * (1 - 0.5 * settle), jets: jets, form: form, flash: flash, acc: heat * (0.2 + 0.8 * c) * sm((p - 0.2) / 0.4) + (fin >= 0 ? 0.3 : 0) };
        /* мягкое (лучи по слоям) — самая дорогая часть кадра: на слабом устройстве или в тяжёлый кадр оно считается
           через кадр, а между — рисуется прежний буфер (газ движется медленно, глазу не видно) */
        if (!BK || !((LITE || dt > 0.025) && (fc++ & 1))) volume(cm, q, P);
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = LITE ? "medium" : "high";
        /* глубокая тьма за диском */
        var vg = g.createRadialGradient(C.x, C.y, 0, C.x, C.y, RR * 1.9); vg.addColorStop(0, "rgba(5,3,3,.62)"); vg.addColorStop(0.55, "rgba(5,3,3,.45)"); vg.addColorStop(1, "rgba(5,3,3,0)");
        g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.fillStyle = vg; g.fillRect(0, 0, W, H);
        /* далёкие звёзды по кругу — под диском */
        g.globalCompositeOperation = "lighter";
        for (var i = 0; i < stars.length; i++) {
          var st = stars[i], x = st.x * W, y = st.y * H, a = st.a * (RM ? 1 : 0.75 + 0.25 * Math.sin(t * 1.3 + st.tw)); if (a < 0.02) continue;
          g.globalAlpha = a * 0.75; var zz = st.s * 3; g.drawImage(st.blue ? spr.blue : spr.dot, x - zz / 2, y - zz / 2, zz, zz);
        }
        jet(g, cm, -1, P, t);
        g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.drawImage(BK.c, 0, 0, W, H);
        sign(g, cm, P, t);
        g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.drawImage(FR.c, 0, 0, W, H);
        jet(g, cm, 1, P, t);
        /* знаки строки — искры: из поля в диск, встают молодыми звёздами на круг и обращаются вместе с ним */
        g.globalCompositeOperation = "lighter";
        hero.list.forEach(function (hh, k) {
          var age = t - hh.born; if (age < 0) return;
          var arr = fin >= 0 ? 1 : sm((p - 0.05 - 0.75 * k / hero.list.length) / 0.16), e = L_.sm5(arr), om = 1 / (Math.pow(hh.r, 1.5) + 0.12);
          var an = hh.a + spin * om * 0.35, Pp = V.project(cm, [Math.cos(an) * hh.r, 0, Math.sin(an) * hh.r], C, K); if (!Pp) return;
          var x = hh.x + (Pp[0] - hh.x) * e, y = hh.y + (Pp[1] - hh.y) * e - Math.sin(arr * Math.PI) * RR * 0.22, kk = Pp[2] * D;
          GAL.star(g, hh, x, y, sm(age / 0.3) * (0.55 + 0.45 * Math.min(1, kk)) * (RM ? 1 : 0.85 + 0.15 * Math.sin(t * 2.5 + hh.tw)), 0.8 * kk);
        });
        g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
        if (!LITE) V.grain(g, { x: 0, y: 0, w: W, h: H }, 0.05);
      }
    };
  }

  /* ── СЛОЙ: холст в #sbBirth. start — ворота задумались; finish — перестали (слой тает, рисунок доигрывает тот же
     миг); stop — кадров больше нет. Прогресса ворота не отдают: сжатие диска идёт по времени ожидания, к концу
     обычного входа знак уже собран, а долгое ожидание просто держит почти собранный знак. ── */
  function weakDevice() {
    var n = navigator.hardwareConcurrency || 8, m = navigator.deviceMemory || 8;
    return n <= 4 || m <= 3 || Math.min(window.innerWidth, window.innerHeight) < 500;
  }
  function mount(layer, opts) {
    var reduced = !!(opts && opts.reduced), lite = weakDevice();
    var spill = document.createElement("div"); spill.className = "sbb-spill";
    var cv = document.createElement("canvas"); cv.className = "sbb-cv";
    layer.appendChild(spill); layer.appendChild(cv);
    var g = cv.getContext("2d"), A = null, W = 0, H = 0, DPR = 1, RES = 1, C = { x: 0, y: 0, r: 100 };
    var raf = 0, run = false, t0 = 0, last = 0, finAt = 0, pSm = 0, slowEma = 16, slowFor = 0, lastLight = -1;
    function center() { W = window.innerWidth; H = window.innerHeight; return { x: W / 2, y: H * (W < 700 ? 0.42 : 0.45), r: Math.min(W * 0.3, H * 0.22) }; }
    function size(rebuild) {
      C = center();
      DPR = Math.min(lite ? 1.25 : 1.75, window.devicePixelRatio || 1) * RES;
      if (rebuild) A.resize(W, H, C);
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      spill.style.background = "radial-gradient(circle at " + Math.round(C.x) + "px " + Math.round(C.y) + "px, rgba(" + A.rgb + ",.34) 0, rgba(" + A.rgb + ",.10) " + Math.round(C.r * 1.6) + "px, rgba(0,0,0,0) " + Math.round(Math.max(W, H) * 0.75) + "px)";
    }
    function onResize() { if (A) size(true); }
    function draw(now) {
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016; last = now;
      /* слабый кадр полсекунды подряд — плотность пикселей холста падает (до половины) */
      if (dt < 0.09) { slowEma += (dt * 1000 - slowEma) * 0.08; slowFor = slowEma > 19 ? slowFor + dt : 0; if (slowFor > 0.5 && RES > 0.5) { RES = Math.max(0.5, RES * 0.8); slowFor = 0; slowEma = 16; size(false); } }
      var t = (now - t0) / 1000, tp = reduced ? 0.6 : Math.min(0.985, 1 - Math.exp(-t / 2.2));
      pSm += (tp - pSm) * Math.min(1, dt * 3.2);
      var fin = finAt ? Math.min(1, (now - finAt) / 900) : -1;
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
      A.frame(g, t, dt, pSm, fin);
      var lv = Math.round(Math.max(0, Math.min(1, A.light())) * 40) / 40; if (lv !== lastLight) { lastLight = lv; spill.style.opacity = String(lv); }
    }
    function loop(now) { if (!run) return; draw(now); raf = requestAnimationFrame(loop); }
    return {
      start: function () {
        if (!A) { A = anim({ reduced: reduced, lite: lite }); size(true); window.addEventListener("resize", onResize); }
        else size(true);   /* знаки строки — с поля этого ожидания */
        cancelAnimationFrame(raf);
        t0 = performance.now(); last = 0; finAt = 0; pSm = reduced ? 0.6 : 0;
        if (reduced) { run = false; draw(t0); return; }   /* меньше движения — один неподвижный кадр */
        run = true; raf = requestAnimationFrame(loop);
      },
      finish: function () { if (run && !finAt) finAt = performance.now(); },
      stop: function () { run = false; cancelAnimationFrame(raf); },
      destroy: function () { run = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); A = null; },
      lite: lite
    };
  }
  /* заранее, пока человек пишет слово: шум, знак, грануляция — в простое */
  function warm() {
    var go = function () { try { VOL.noise(); VOL.signImgs(); VOL.granule(); } catch (e) { /* позже, при старте */ } };
    if (window.requestIdleCallback) window.requestIdleCallback(go, { timeout: 2500 }); else setTimeout(go, 400);
  }
  window.sbBirthLive = { mount: mount, warm: warm };
})();
