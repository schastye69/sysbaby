/* sys.baby OS — core/argon2.js
 * ── РАСТЯЖКА, КОТОРОЙ НУЖНА ПАМЯТЬ (D-275) ─────────────────────────────────
 * ПОВОД, дословно от основателя 24.09.2026: «также прошу совет сделать
 * шифрование ещё более невероятным. любыми методами, но самыми сильными и
 * инновационными».
 *
 * ЧТО БЫЛО. Слово растягивалось двумя проходами PBKDF2 (SHA-512 × 1.5 млн,
 * SHA-256 × 8 млн) — это много ВРЕМЕНИ, но ни байта ПАМЯТИ. Видеокарта и
 * особенно заказная микросхема считают PBKDF2 тысячами ядер параллельно: у
 * каждого ядра — крошечный SHA и ничего больше. Время на одну попытку дорого
 * для нас и дёшево для того, кто перебирает.
 *
 * ЧТО СТАЛО. После PBKDF2 — Argon2id (RFC 9106, победитель Password Hashing
 * Competition): каждой попытке нужны 64 МиБ своей памяти, трижды пройденной
 * с зависимостью от данных. Параллелить такую попытку дорого на любом
 * железе: память не делится между ядрами, и площадь микросхемы под неё
 * стоит больше, чем под сам хеш. Параметры — второй рекомендованный набор
 * RFC 9106 (m = 2^16 КиБ, t = 3). Две растяжки не заменяют одна другую, а
 * складываются: перебирающему нужно и время PBKDF2, и память Argon2id.
 *
 * ПОЧЕМУ СВОЙ КОД, А НЕ БИБЛИОТЕКА. Страница системы грузит код только из
 * дерева и не превращает строки в код (no-foreign-code-check); WebAssembly
 * потребовал бы 'wasm-unsafe-eval' в заголовке — ровно ту дверь, которую
 * заголовок держит закрытой. Поэтому BLAKE2b (RFC 7693) и Argon2id написаны
 * здесь, на чистом JS, 64-битная арифметика — парами 32-битных слов.
 * Правильность не принимается на веру: tools/argon2-check.mjs сверяет его с
 * тестовым вектором RFC 9106 (Argon2id, 4 дорожки, секрет и данные) и с
 * BLAKE2b из стандартной библиотеки Node на случайных входах.
 *
 * ГДЕ СЧИТАЕТСЯ. В отдельном потоке (Web Worker из этого же файла): 64 МиБ
 * и три прохода — это секунда-другая работы, и дверь замка в это время
 * продолжает дышать. Где потоков нет — считается здесь же, медленнее для
 * глаза, но тем же числом.
 */
(function () {
  "use strict";

  /* ── BLAKE2b ─────────────────────────────────────────────────────────────── */
  var B2_IV = new Uint32Array([
    0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85, 0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A,
    0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C, 0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19
  ]);
  var B2_SIGMA = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3,
    11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4,
    7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8,
    9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13,
    2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9,
    12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11,
    13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10,
    6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5,
    10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
  ].map(function (x) { return x * 2; });

  var b2v = new Uint32Array(32), b2m = new Uint32Array(32);
  function b2add(a, b) {
    var o0 = b2v[a] + b2v[b], o1 = b2v[a + 1] + b2v[b + 1];
    if (o0 >= 0x100000000) o1++;
    b2v[a] = o0; b2v[a + 1] = o1;
  }
  function b2addc(a, b0, b1) {
    var o0 = b2v[a] + b0, o1 = b2v[a + 1] + b1;
    if (o0 >= 0x100000000) o1++;
    b2v[a] = o0; b2v[a + 1] = o1;
  }
  function b2g(a, b, c, d, ix, iy) {
    var x0 = b2m[ix], x1 = b2m[ix + 1], y0 = b2m[iy], y1 = b2m[iy + 1], x, y;
    b2add(a, b); b2addc(a, x0, x1);
    x = b2v[d] ^ b2v[a]; y = b2v[d + 1] ^ b2v[a + 1]; b2v[d] = y; b2v[d + 1] = x;
    b2add(c, d);
    x = b2v[b] ^ b2v[c]; y = b2v[b + 1] ^ b2v[c + 1];
    b2v[b] = (x >>> 24) ^ (y << 8); b2v[b + 1] = (y >>> 24) ^ (x << 8);
    b2add(a, b); b2addc(a, y0, y1);
    x = b2v[d] ^ b2v[a]; y = b2v[d + 1] ^ b2v[a + 1];
    b2v[d] = (x >>> 16) ^ (y << 16); b2v[d + 1] = (y >>> 16) ^ (x << 16);
    b2add(c, d);
    x = b2v[b] ^ b2v[c]; y = b2v[b + 1] ^ b2v[c + 1];
    b2v[b] = (y >>> 31) ^ (x << 1); b2v[b + 1] = (x >>> 31) ^ (y << 1);
  }
  function b2compress(ctx, last) {
    var i;
    for (i = 0; i < 16; i++) { b2v[i] = ctx.h[i]; b2v[i + 16] = B2_IV[i]; }
    b2v[24] ^= ctx.t; b2v[25] ^= (ctx.t / 0x100000000);
    if (last) { b2v[28] = ~b2v[28]; b2v[29] = ~b2v[29]; }
    for (i = 0; i < 32; i++) {
      b2m[i] = ctx.b[i * 4] ^ (ctx.b[i * 4 + 1] << 8) ^ (ctx.b[i * 4 + 2] << 16) ^ (ctx.b[i * 4 + 3] << 24);
    }
    for (i = 0; i < 12; i++) {
      var s = i * 16;
      b2g(0, 8, 16, 24, B2_SIGMA[s], B2_SIGMA[s + 1]);
      b2g(2, 10, 18, 26, B2_SIGMA[s + 2], B2_SIGMA[s + 3]);
      b2g(4, 12, 20, 28, B2_SIGMA[s + 4], B2_SIGMA[s + 5]);
      b2g(6, 14, 22, 30, B2_SIGMA[s + 6], B2_SIGMA[s + 7]);
      b2g(0, 10, 20, 30, B2_SIGMA[s + 8], B2_SIGMA[s + 9]);
      b2g(2, 12, 22, 24, B2_SIGMA[s + 10], B2_SIGMA[s + 11]);
      b2g(4, 14, 16, 26, B2_SIGMA[s + 12], B2_SIGMA[s + 13]);
      b2g(6, 8, 18, 28, B2_SIGMA[s + 14], B2_SIGMA[s + 15]);
    }
    for (i = 0; i < 16; i++) ctx.h[i] = ctx.h[i] ^ b2v[i] ^ b2v[i + 16];
  }
  function b2init(outlen) {
    var ctx = { b: new Uint8Array(128), h: new Uint32Array(16), t: 0, c: 0, outlen: outlen };
    for (var i = 0; i < 16; i++) ctx.h[i] = B2_IV[i];
    ctx.h[0] ^= 0x01010000 ^ outlen;
    return ctx;
  }
  function b2update(ctx, input) {
    for (var i = 0; i < input.length; i++) {
      if (ctx.c === 128) { ctx.t += ctx.c; b2compress(ctx, false); ctx.c = 0; }
      ctx.b[ctx.c++] = input[i];
    }
  }
  function b2final(ctx) {
    ctx.t += ctx.c;
    while (ctx.c < 128) ctx.b[ctx.c++] = 0;
    b2compress(ctx, true);
    var out = new Uint8Array(ctx.outlen);
    for (var i = 0; i < ctx.outlen; i++) out[i] = ctx.h[i >> 2] >>> (8 * (i & 3));
    return out;
  }
  function blake2b(input, outlen) {
    var ctx = b2init(outlen || 64);
    b2update(ctx, input);
    return b2final(ctx);
  }

  /* ── Argon2id ────────────────────────────────────────────────────────────── */
  function le32(n) { return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]); }
  function concat(list) {
    var n = 0, i, o = 0;
    for (i = 0; i < list.length; i++) n += list[i].length;
    var out = new Uint8Array(n);
    for (i = 0; i < list.length; i++) { out.set(list[i], o); o += list[i].length; }
    return out;
  }
  /* H' — хеш переменной длины (RFC 9106, 3.3). */
  function hPrime(x, T) {
    var pre = concat([le32(T), x]);
    if (T <= 64) return blake2b(pre, T);
    var r = Math.ceil(T / 32) - 2, out = new Uint8Array(T), v = blake2b(pre, 64), o = 0;
    out.set(v.subarray(0, 32), o); o += 32;
    for (var i = 1; i < r; i++) { v = blake2b(v, 64); out.set(v.subarray(0, 32), o); o += 32; }
    v = blake2b(v, T - 32 * r);
    out.set(v, o);
    return out;
  }

  /* Блок — 1024 байта = 256 слов по 32 бита (128 слов по 64). */
  var R = new Uint32Array(256), Q = new Uint32Array(256);
  /* fBlaMka: a + b + 2·lo(a)·lo(b), всё по модулю 2^64, над парой индексов рабочего массива. */
  function fbla(w, a, b) {
    var al = w[a], bl = w[b];
    /* lo(a)·lo(b) точно, через 16-битные половины */
    var xl = al & 0xffff, xh = al >>> 16, yl = bl & 0xffff, yh = bl >>> 16;
    var ll = xl * yl, mid = xl * yh + xh * yl, hh = xh * yh;
    var lo = ll + (mid % 65536) * 65536;
    var hi = hh + Math.floor(mid / 65536) + Math.floor(lo / 4294967296);
    lo = lo % 4294967296;
    /* ·2 */
    hi = (hi * 2 + Math.floor(lo / 2147483648)) % 4294967296;
    lo = (lo * 2) % 4294967296;
    /* + a + b */
    var s0 = al + bl, s1 = w[a + 1] + w[b + 1];
    if (s0 >= 4294967296) { s0 -= 4294967296; s1++; }
    s0 += lo; if (s0 >= 4294967296) { s0 -= 4294967296; s1++; }
    s1 += hi;
    w[a] = s0; w[a + 1] = s1;
  }
  function gb(w, a, b, c, d) {
    var x, y;
    fbla(w, a, b);
    x = w[d] ^ w[a]; y = w[d + 1] ^ w[a + 1]; w[d] = y; w[d + 1] = x;
    fbla(w, c, d);
    x = w[b] ^ w[c]; y = w[b + 1] ^ w[c + 1]; w[b] = (x >>> 24) ^ (y << 8); w[b + 1] = (y >>> 24) ^ (x << 8);
    fbla(w, a, b);
    x = w[d] ^ w[a]; y = w[d + 1] ^ w[a + 1]; w[d] = (x >>> 16) ^ (y << 16); w[d + 1] = (y >>> 16) ^ (x << 16);
    fbla(w, c, d);
    x = w[b] ^ w[c]; y = w[b + 1] ^ w[c + 1]; w[b] = (y >>> 31) ^ (x << 1); w[b + 1] = (x >>> 31) ^ (y << 1);
  }
  /* P над шестнадцатью 64-битными словами, заданными индексами (в 32-битных). */
  function perm(w, i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12, i13, i14, i15) {
    gb(w, i0, i4, i8, i12); gb(w, i1, i5, i9, i13); gb(w, i2, i6, i10, i14); gb(w, i3, i7, i11, i15);
    gb(w, i0, i5, i10, i15); gb(w, i1, i6, i11, i12); gb(w, i2, i7, i8, i13); gb(w, i3, i4, i9, i14);
  }
  function permRow(w, o) {
    var v0l = w[o + 0], v0h = w[o + 0 + 1], v1l = w[o + 2], v1h = w[o + 2 + 1], v2l = w[o + 4], v2h = w[o + 4 + 1], v3l = w[o + 6], v3h = w[o + 6 + 1], v4l = w[o + 8], v4h = w[o + 8 + 1], v5l = w[o + 10], v5h = w[o + 10 + 1], v6l = w[o + 12], v6h = w[o + 12 + 1], v7l = w[o + 14], v7h = w[o + 14 + 1], v8l = w[o + 16], v8h = w[o + 16 + 1], v9l = w[o + 18], v9h = w[o + 18 + 1], v10l = w[o + 20], v10h = w[o + 20 + 1], v11l = w[o + 22], v11h = w[o + 22 + 1], v12l = w[o + 24], v12h = w[o + 24 + 1], v13l = w[o + 26], v13h = w[o + 26 + 1], v14l = w[o + 28], v14h = w[o + 28 + 1], v15l = w[o + 30], v15h = w[o + 30 + 1];
    var al, bl, p0, p1, p2, p3, tt, ww, mh, ml, sl, xx, yy;
      al = v0l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v12l ^ v0l; yy = v12h ^ v0h; v12l = yy >>> 0; v12h = xx >>> 0;
      al = v8l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v4l ^ v8l; yy = v4h ^ v8h; v4l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v4h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v0l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v12l ^ v0l; yy = v12h ^ v0h; v12l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v12h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v8l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v4l ^ v8l; yy = v4h ^ v8h; v4l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v4h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v1l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v13l ^ v1l; yy = v13h ^ v1h; v13l = yy >>> 0; v13h = xx >>> 0;
      al = v9l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v5l ^ v9l; yy = v5h ^ v9h; v5l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v5h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v1l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v13l ^ v1l; yy = v13h ^ v1h; v13l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v13h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v9l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v5l ^ v9l; yy = v5h ^ v9h; v5l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v5h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v2l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v14l ^ v2l; yy = v14h ^ v2h; v14l = yy >>> 0; v14h = xx >>> 0;
      al = v10l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v6l ^ v10l; yy = v6h ^ v10h; v6l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v6h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v2l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v14l ^ v2l; yy = v14h ^ v2h; v14l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v14h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v10l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v6l ^ v10l; yy = v6h ^ v10h; v6l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v6h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v3l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v15l ^ v3l; yy = v15h ^ v3h; v15l = yy >>> 0; v15h = xx >>> 0;
      al = v11l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v7l ^ v11l; yy = v7h ^ v11h; v7l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v7h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v3l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v15l ^ v3l; yy = v15h ^ v3h; v15l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v15h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v11l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v7l ^ v11l; yy = v7h ^ v11h; v7l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v7h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v0l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v15l ^ v0l; yy = v15h ^ v0h; v15l = yy >>> 0; v15h = xx >>> 0;
      al = v10l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v5l ^ v10l; yy = v5h ^ v10h; v5l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v5h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v0l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v15l ^ v0l; yy = v15h ^ v0h; v15l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v15h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v10l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v5l ^ v10l; yy = v5h ^ v10h; v5l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v5h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v1l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v12l ^ v1l; yy = v12h ^ v1h; v12l = yy >>> 0; v12h = xx >>> 0;
      al = v11l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v6l ^ v11l; yy = v6h ^ v11h; v6l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v6h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v1l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v12l ^ v1l; yy = v12h ^ v1h; v12l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v12h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v11l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v6l ^ v11l; yy = v6h ^ v11h; v6l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v6h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v2l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v13l ^ v2l; yy = v13h ^ v2h; v13l = yy >>> 0; v13h = xx >>> 0;
      al = v8l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v7l ^ v8l; yy = v7h ^ v8h; v7l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v7h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v2l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v13l ^ v2l; yy = v13h ^ v2h; v13l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v13h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v8l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v7l ^ v8l; yy = v7h ^ v8h; v7l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v7h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v3l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v14l ^ v3l; yy = v14h ^ v3h; v14l = yy >>> 0; v14h = xx >>> 0;
      al = v9l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v4l ^ v9l; yy = v4h ^ v9h; v4l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v4h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v3l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v14l ^ v3l; yy = v14h ^ v3h; v14l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v14h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v9l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v4l ^ v9l; yy = v4h ^ v9h; v4l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v4h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
    w[o + 0] = v0l; w[o + 0 + 1] = v0h;
    w[o + 2] = v1l; w[o + 2 + 1] = v1h;
    w[o + 4] = v2l; w[o + 4 + 1] = v2h;
    w[o + 6] = v3l; w[o + 6 + 1] = v3h;
    w[o + 8] = v4l; w[o + 8 + 1] = v4h;
    w[o + 10] = v5l; w[o + 10 + 1] = v5h;
    w[o + 12] = v6l; w[o + 12 + 1] = v6h;
    w[o + 14] = v7l; w[o + 14 + 1] = v7h;
    w[o + 16] = v8l; w[o + 16 + 1] = v8h;
    w[o + 18] = v9l; w[o + 18 + 1] = v9h;
    w[o + 20] = v10l; w[o + 20 + 1] = v10h;
    w[o + 22] = v11l; w[o + 22 + 1] = v11h;
    w[o + 24] = v12l; w[o + 24 + 1] = v12h;
    w[o + 26] = v13l; w[o + 26 + 1] = v13h;
    w[o + 28] = v14l; w[o + 28 + 1] = v14h;
    w[o + 30] = v15l; w[o + 30 + 1] = v15h;
  }
  function permCol(w, o) {
    var v0l = w[o + 0], v0h = w[o + 0 + 1], v1l = w[o + 2], v1h = w[o + 2 + 1], v2l = w[o + 32], v2h = w[o + 32 + 1], v3l = w[o + 34], v3h = w[o + 34 + 1], v4l = w[o + 64], v4h = w[o + 64 + 1], v5l = w[o + 66], v5h = w[o + 66 + 1], v6l = w[o + 96], v6h = w[o + 96 + 1], v7l = w[o + 98], v7h = w[o + 98 + 1], v8l = w[o + 128], v8h = w[o + 128 + 1], v9l = w[o + 130], v9h = w[o + 130 + 1], v10l = w[o + 160], v10h = w[o + 160 + 1], v11l = w[o + 162], v11h = w[o + 162 + 1], v12l = w[o + 192], v12h = w[o + 192 + 1], v13l = w[o + 194], v13h = w[o + 194 + 1], v14l = w[o + 224], v14h = w[o + 224 + 1], v15l = w[o + 226], v15h = w[o + 226 + 1];
    var al, bl, p0, p1, p2, p3, tt, ww, mh, ml, sl, xx, yy;
      al = v0l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v12l ^ v0l; yy = v12h ^ v0h; v12l = yy >>> 0; v12h = xx >>> 0;
      al = v8l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v4l ^ v8l; yy = v4h ^ v8h; v4l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v4h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v0l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v12l ^ v0l; yy = v12h ^ v0h; v12l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v12h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v8l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v4l ^ v8l; yy = v4h ^ v8h; v4l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v4h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v1l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v13l ^ v1l; yy = v13h ^ v1h; v13l = yy >>> 0; v13h = xx >>> 0;
      al = v9l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v5l ^ v9l; yy = v5h ^ v9h; v5l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v5h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v1l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v13l ^ v1l; yy = v13h ^ v1h; v13l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v13h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v9l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v5l ^ v9l; yy = v5h ^ v9h; v5l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v5h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v2l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v14l ^ v2l; yy = v14h ^ v2h; v14l = yy >>> 0; v14h = xx >>> 0;
      al = v10l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v6l ^ v10l; yy = v6h ^ v10h; v6l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v6h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v2l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v14l ^ v2l; yy = v14h ^ v2h; v14l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v14h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v10l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v6l ^ v10l; yy = v6h ^ v10h; v6l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v6h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v3l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v15l ^ v3l; yy = v15h ^ v3h; v15l = yy >>> 0; v15h = xx >>> 0;
      al = v11l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v7l ^ v11l; yy = v7h ^ v11h; v7l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v7h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v3l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v15l ^ v3l; yy = v15h ^ v3h; v15l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v15h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v11l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v7l ^ v11l; yy = v7h ^ v11h; v7l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v7h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v0l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v15l ^ v0l; yy = v15h ^ v0h; v15l = yy >>> 0; v15h = xx >>> 0;
      al = v10l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v5l ^ v10l; yy = v5h ^ v10h; v5l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v5h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v0l; bl = v5l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v0h = (v0h + v5h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v0l = sl >>> 0;
      xx = v15l ^ v0l; yy = v15h ^ v0h; v15l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v15h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v10l; bl = v15l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v10h = (v10h + v15h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v10l = sl >>> 0;
      xx = v5l ^ v10l; yy = v5h ^ v10h; v5l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v5h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v1l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v12l ^ v1l; yy = v12h ^ v1h; v12l = yy >>> 0; v12h = xx >>> 0;
      al = v11l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v6l ^ v11l; yy = v6h ^ v11h; v6l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v6h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v1l; bl = v6l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v1h = (v1h + v6h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v1l = sl >>> 0;
      xx = v12l ^ v1l; yy = v12h ^ v1h; v12l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v12h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v11l; bl = v12l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v11h = (v11h + v12h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v11l = sl >>> 0;
      xx = v6l ^ v11l; yy = v6h ^ v11h; v6l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v6h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v2l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v13l ^ v2l; yy = v13h ^ v2h; v13l = yy >>> 0; v13h = xx >>> 0;
      al = v8l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v7l ^ v8l; yy = v7h ^ v8h; v7l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v7h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v2l; bl = v7l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v2h = (v2h + v7h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v2l = sl >>> 0;
      xx = v13l ^ v2l; yy = v13h ^ v2h; v13l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v13h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v8l; bl = v13l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v8h = (v8h + v13h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v8l = sl >>> 0;
      xx = v7l ^ v8l; yy = v7h ^ v8h; v7l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v7h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
      al = v3l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v14l ^ v3l; yy = v14h ^ v3h; v14l = yy >>> 0; v14h = xx >>> 0;
      al = v9l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v4l ^ v9l; yy = v4h ^ v9h; v4l = ((xx >>> 24) ^ (yy << 8)) >>> 0; v4h = ((yy >>> 24) ^ (xx << 8)) >>> 0;
      al = v3l; bl = v4l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v3h = (v3h + v4h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v3l = sl >>> 0;
      xx = v14l ^ v3l; yy = v14h ^ v3h; v14l = ((xx >>> 16) ^ (yy << 16)) >>> 0; v14h = ((yy >>> 16) ^ (xx << 16)) >>> 0;
      al = v9l; bl = v14l;
      p0 = al & 0xffff; p1 = al >>> 16; p2 = bl & 0xffff; p3 = bl >>> 16;
      tt = p1 * p2 + ((p0 * p2) >>> 16);
      ww = (tt & 0xffff) + p0 * p3;
      mh = p1 * p3 + (tt >>> 16) + (ww >>> 16);
      ml = Math.imul(al, bl) >>> 0;
      sl = al + bl + ((ml << 1) >>> 0);
      v9h = (v9h + v14h + (((mh << 1) | (ml >>> 31)) >>> 0) + ((sl / 4294967296) | 0)) >>> 0;
      v9l = sl >>> 0;
      xx = v4l ^ v9l; yy = v4h ^ v9h; v4l = ((yy >>> 31) ^ (xx << 1)) >>> 0; v4h = ((xx >>> 31) ^ (yy << 1)) >>> 0;
    w[o + 0] = v0l; w[o + 0 + 1] = v0h;
    w[o + 2] = v1l; w[o + 2 + 1] = v1h;
    w[o + 32] = v2l; w[o + 32 + 1] = v2h;
    w[o + 34] = v3l; w[o + 34 + 1] = v3h;
    w[o + 64] = v4l; w[o + 64 + 1] = v4h;
    w[o + 66] = v5l; w[o + 66 + 1] = v5h;
    w[o + 96] = v6l; w[o + 96 + 1] = v6h;
    w[o + 98] = v7l; w[o + 98 + 1] = v7h;
    w[o + 128] = v8l; w[o + 128 + 1] = v8h;
    w[o + 130] = v9l; w[o + 130 + 1] = v9h;
    w[o + 160] = v10l; w[o + 160 + 1] = v10h;
    w[o + 162] = v11l; w[o + 162 + 1] = v11h;
    w[o + 192] = v12l; w[o + 192 + 1] = v12h;
    w[o + 194] = v13l; w[o + 194 + 1] = v13h;
    w[o + 224] = v14l; w[o + 224 + 1] = v14h;
    w[o + 226] = v15l; w[o + 226 + 1] = v15h;
  }

  /* G(X, Y) → в dst (с исходным xor, если xorInto). mem — общий Uint32Array памяти. */
  function compressG(mem, xOff, yOff, dstOff, xorInto) {
    var i;
    for (i = 0; i < 256; i++) { R[i] = mem[xOff + i] ^ mem[yOff + i]; Q[i] = R[i]; }
    /* строки: 8 строк по 16 слов (64-бит) = 32 слова (32-бит) */
    for (i = 0; i < 8; i++) permRow(Q, i * 32);
    /* столбцы: столбец i — 64-битные слова 2i, 2i+1, 2i+16, 2i+17, … 2i+112, 2i+113 */
    for (i = 0; i < 8; i++) permCol(Q, i * 4);
    if (xorInto) for (i = 0; i < 256; i++) mem[dstOff + i] ^= Q[i] ^ R[i];
    else for (i = 0; i < 256; i++) mem[dstOff + i] = Q[i] ^ R[i];
  }

  function argon2id(pwd, salt, opt) {
    var t = opt.t, m = opt.m, p = opt.p || 1, T = opt.tagLength || 32;
    var K = opt.secret || new Uint8Array(0), X = opt.ad || new Uint8Array(0);
    var TYPE = 2, VERSION = 0x13, SL = 4;
    var h0 = blake2b(concat([le32(p), le32(T), le32(m), le32(t), le32(VERSION), le32(TYPE),
      le32(pwd.length), pwd, le32(salt.length), salt, le32(K.length), K, le32(X.length), X]), 64);
    var mBlocks = 4 * p * Math.floor(m / (4 * p));
    var q = mBlocks / p, seg = q / SL;
    var mem = new Uint32Array(mBlocks * 256);
    var blk = function (lane, col) { return (lane * q + col) * 256; };
    var put = function (off, bytes) {
      for (var i = 0; i < 256; i++) mem[off + i] = bytes[i * 4] ^ (bytes[i * 4 + 1] << 8) ^ (bytes[i * 4 + 2] << 16) ^ (bytes[i * 4 + 3] << 24);
    };
    var l, i;
    for (l = 0; l < p; l++) {
      put(blk(l, 0), hPrime(concat([h0, le32(0), le32(l)]), 1024));
      put(blk(l, 1), hPrime(concat([h0, le32(1), le32(l)]), 1024));
    }
    /* блок адресов для независимой адресации (Argon2i-часть) */
    var ZERO = 0, ADDR_IN = 256, ADDR = 512, TMP = 768;
    var aux = new Uint32Array(1024);
    function addrNext() {
      aux[ADDR_IN + 12]++;   /* счётчик — седьмое 64-битное слово (индекс 6 → 12 в 32-бит) */
      /* G(0, G(0, Z)) */
      compressAux(ZERO, ADDR_IN, TMP);
      compressAux(ZERO, TMP, ADDR);
    }
    function compressAux(xo, yo, dst) {
      var k;
      for (k = 0; k < 256; k++) { R[k] = aux[xo + k] ^ aux[yo + k]; Q[k] = R[k]; }
      for (k = 0; k < 8; k++) permRow(Q, k * 32);
      for (k = 0; k < 8; k++) permCol(Q, k * 4);
      for (k = 0; k < 256; k++) aux[dst + k] = Q[k] ^ R[k];
    }
    for (var r = 0; r < t; r++) {
      for (var s = 0; s < SL; s++) {
        for (l = 0; l < p; l++) {
          var indep = (r === 0 && s < 2);
          if (indep) {
            for (i = 0; i < 256; i++) aux[ADDR_IN + i] = 0;
            aux[ADDR_IN + 0] = r; aux[ADDR_IN + 2] = l; aux[ADDR_IN + 4] = s;
            aux[ADDR_IN + 6] = mBlocks; aux[ADDR_IN + 8] = t; aux[ADDR_IN + 10] = TYPE;
          }
          var start = (r === 0 && s === 0) ? 2 : 0;
          if (indep && start !== 0) addrNext();
          for (var j = start; j < seg; j++) {
            var col = s * seg + j;
            var prevCol = col === 0 ? q - 1 : col - 1;
            var prevOff = blk(l, prevCol);
            var j1, j2;
            if (indep) {
              if (j % 128 === 0) addrNext();
              var ai = ADDR + (j % 128) * 2;
              j1 = aux[ai]; j2 = aux[ai + 1];
            } else {
              j1 = mem[prevOff]; j2 = mem[prevOff + 1];
            }
            var refLane = (r === 0 && s === 0) ? l : (j2 % p);
            var sameLane = refLane === l;
            var W;
            if (r === 0) {
              if (s === 0) W = j - 1;
              else W = sameLane ? s * seg + j - 1 : s * seg + (j === 0 ? -1 : 0);
            } else {
              W = sameLane ? q - seg + j - 1 : q - seg + (j === 0 ? -1 : 0);
            }
            /* x = J1² >> 32; y = W·x >> 32; zz = W − 1 − y — точно, без потери бит */
            var x = mulHi(j1, j1);
            var y = mulHi(W, x);
            var zz = W - 1 - y;
            var startPos = r === 0 ? 0 : ((s + 1) * seg) % q;
            var refCol = (startPos + zz) % q;
            compressG(mem, prevOff, blk(refLane, refCol), blk(l, col), r > 0);
          }
        }
      }
    }
    var C = new Uint8Array(1024);
    var fin = new Uint32Array(256);
    for (l = 0; l < p; l++) { var off = blk(l, q - 1); for (i = 0; i < 256; i++) fin[i] ^= mem[off + i]; }
    for (i = 0; i < 256; i++) { C[i * 4] = fin[i] & 255; C[i * 4 + 1] = (fin[i] >>> 8) & 255; C[i * 4 + 2] = (fin[i] >>> 16) & 255; C[i * 4 + 3] = (fin[i] >>> 24) & 255; }
    mem.fill(0);
    return hPrime(C, T);
  }
  /* Старшие 32 бита произведения двух 32-битных чисел без знака. */
  function mulHi(a, b) {
    var al = a & 0xffff, ah = a >>> 16, bl = b & 0xffff, bh = b >>> 16;
    var ll = al * bl, mid = al * bh + ah * bl, hh = ah * bh;
    var lo = ll + (mid % 65536) * 65536;
    return (hh + Math.floor(mid / 65536) + Math.floor(lo / 4294967296)) >>> 0;
  }


  /* ── ПОТОК ───────────────────────────────────────────────────────────────
     Этот же файл, загруженный как Worker, отвечает на просьбы посчитать. */
  var inWorker = typeof window === "undefined" && typeof self !== "undefined" && typeof self.postMessage === "function";
  if (inWorker) {
    self.onmessage = function (ev) {
      var d = ev.data || {};
      try {
        var out = argon2id(new Uint8Array(d.pwd), new Uint8Array(d.salt), d.opt || {});
        self.postMessage({ id: d.id, ok: true, out: out.buffer }, [out.buffer]);
      } catch (e) { self.postMessage({ id: d.id, ok: false, err: String((e && e.message) || e) }); }
    };
    return;
  }
  var SRC = (document.currentScript && document.currentScript.src) || "";
  var worker = null, seq = 0, waiting = {}, usedWorker = 0;
  function getWorker() {
    if (worker !== null) return worker;
    try {
      worker = new Worker(SRC);
      worker.onmessage = function (ev) {
        var d = ev.data || {}, w = waiting[d.id];
        if (!w) return;
        delete waiting[d.id];
        if (d.ok) w.ok(new Uint8Array(d.out)); else w.no(new Error(d.err || "argon2"));
      };
      worker.onerror = function () {
        /* Поток не поднялся — не беда: то же число посчитается здесь. */
        var list = Object.keys(waiting).map(function (k) { var w = waiting[k]; delete waiting[k]; return w; });
        worker = false;
        list.forEach(function (w) { try { w.ok(argon2id(w.pwd, w.salt, w.opt)); } catch (e) { w.no(e); } });
      };
    } catch (e) { worker = false; }
    return worker;
  }
  function hash(pwd, salt, opt) {
    var p = new Uint8Array(pwd).slice(), s = new Uint8Array(salt).slice();
    var w = SRC ? getWorker() : false;
    if (!w) return new Promise(function (ok) { ok(argon2id(p, s, opt)); });
    return new Promise(function (ok, no) {
      var id = ++seq;
      waiting[id] = { ok: ok, no: no, pwd: p.slice(), salt: s.slice(), opt: opt };
      usedWorker++;
      w.postMessage({ id: id, pwd: p.buffer, salt: s.buffer, opt: opt }, [p.buffer, s.buffer]);
    });
  }
  window.sbArgon2 = {
    hash: hash,
    /* Сколько раз считал поток — прибор спрашивает, не встал ли главный. */
    workerRuns: function () { return usedWorker; },
    blake2b: blake2b
  };
})();
