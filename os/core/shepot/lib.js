(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  var U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var fromNumH = (n) => n / 2 ** 32 | 0;
  var fromNumL = (n) => n >>> 0;
  function setU64FromNum(view, byteOffset, n, isLE3) {
    const h = fromNumH(n);
    const l = fromNumL(n);
    view.setUint32(byteOffset, isLE3 ? l : h, isLE3);
    view.setUint32(byteOffset + 4, isLE3 ? h : l, isLE3);
  }
  var shrSH = (h, _l, s) => h >>> s;
  var shrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
  var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
  var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  var atitle = (title) => title ? `"${title}" ` : "";
  function anumber(n, title = "") {
    if (typeof n !== "number")
      throw new TypeError(atitle(title) + "expected number, got " + typeof n);
    if (!Number.isSafeInteger(n) || n < 0)
      throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
    return n;
  }
  function abool(value, title = "") {
    if (typeof value !== "boolean")
      throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
    return value;
  }
  function abytes(value, length, title = "") {
    if (isBytes(value) && (length === void 0 || value.length === length))
      return value;
    if (length !== void 0)
      anumber(length, "length");
    const bytes = isBytes(value);
    const ofLen = length !== void 0 ? ` of length ${length}` : "";
    const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
    const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new TypeError("expected hash wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
    if (h.outputLen < 1 || h.blockLen < 1)
      throw new Error("hash blockLen / outputLen must be >= 1");
  }
  var aobject = (value, label) => {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
  };
  var aopts = (value, label) => {
    aobject(value, label);
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null)
      throw new TypeError(`"${label}" expected plain object`);
    if (Object.hasOwn(value, "__proto__"))
      throw new TypeError(`"${label}.__proto__" is not allowed`);
  };
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("hash was destroyed");
    if (checkFinished && instance.finished)
      throw new Error("digest() was already called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "output");
    const min = instance.outputLen;
    if (!(out.length >= min)) {
      throw new RangeError('"output" expected length >= ' + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  var swap32IfBE = isLE ? (u) => u : byteSwap32;
  var hasHexBuiltin = /* @__PURE__ */ (() => (
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
  ))();
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes[bytes[i]];
    }
    return hex;
  }
  function asciiToBase16(ch) {
    return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - (65 - 10) : ch >= 97 && ch <= 102 ? ch - (97 - 10) : void 0;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new TypeError("hex string expected, got " + typeof hex);
    if (hasHexBuiltin) {
      try {
        return Uint8Array.fromHex(hex);
      } catch (error) {
        if (error instanceof SyntaxError)
          throw new RangeError(error.message);
        throw error;
      }
    }
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new RangeError("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new RangeError('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  function checkOpts(defaults, opts2, title = "opts") {
    aopts(defaults, "defaults");
    if (opts2 !== void 0)
      aopts(opts2, title);
    const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts2);
    return merged;
  }
  function createHasher(hashCons, info = {}) {
    if (typeof hashCons !== "function")
      throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
    info = checkOpts({}, info, "info");
    const hashC = (msg, opts2) => hashCons(opts2).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.canXOF = tmp.canXOF;
    hashC.create = (opts2) => hashCons(opts2);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  function randomBytes(bytesLength = 32) {
    anumber(bytesLength, "bytesLength");
    const cr = typeof globalThis === "object" ? globalThis.crypto : null;
    if (typeof cr?.getRandomValues !== "function")
      throw new Error("crypto.getRandomValues must be defined");
    if (bytesLength > 65536)
      throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
    return cr.getRandomValues(new Uint8Array(bytesLength));
  }
  var oidNist = (suffix) => ({
    oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
  });

  var _0n = BigInt(0);
  var _1n = BigInt(1);
  var _2n = BigInt(2);
  var _7n = BigInt(7);
  var _256n = BigInt(256);
  var _0x71n = BigInt(113);
  var SHA3_PI = [];
  var SHA3_ROTL = [];
  var _SHA3_IOTA = [];
  for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n;
    for (let j = 0; j < 7; j++) {
      R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n)
        t ^= _1n << (_1n << BigInt(j)) - _1n;
    }
    _SHA3_IOTA.push(t);
  }
  var IOTAS = split(_SHA3_IOTA, true);
  var SHA3_IOTA_H = IOTAS[0];
  var SHA3_IOTA_L = IOTAS[1];
  var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
  var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
  var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
  var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
  var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
  var B = new Uint32Array(5 * 2);
  function keccakP(s, rounds = 24) {
    if (!(s instanceof Uint32Array))
      throw new TypeError('"s" expected Uint32Array(50), got type=' + typeof s);
    if (s.length !== 50)
      throw new RangeError('"s" expected Uint32Array(50), got length=' + s.length);
    anumber(rounds, "rounds");
    if (rounds < 1 || rounds > 24)
      throw new Error('"rounds" expected integer 1..24');
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        const b0 = s[y], b1 = s[y + 1], b2 = s[y + 2], b3 = s[y + 3];
        s[y] ^= ~s[y + 2] & s[y + 4];
        s[y + 1] ^= ~s[y + 3] & s[y + 5];
        s[y + 2] ^= ~s[y + 4] & s[y + 6];
        s[y + 3] ^= ~s[y + 5] & s[y + 7];
        s[y + 4] ^= ~s[y + 6] & s[y + 8];
        s[y + 5] ^= ~s[y + 7] & s[y + 9];
        s[y + 6] ^= ~s[y + 8] & b0;
        s[y + 7] ^= ~s[y + 9] & b1;
        s[y + 8] ^= ~b0 & b2;
        s[y + 9] ^= ~b1 & b3;
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
  }
  var Keccak = class _Keccak {
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      __publicField(this, "state");
      __publicField(this, "pos", 0);
      __publicField(this, "posOut", 0);
      __publicField(this, "finished", false);
      __publicField(this, "state32");
      __publicField(this, "destroyed", false);
      __publicField(this, "blockLen");
      __publicField(this, "suffix");
      __publicField(this, "outputLen");
      __publicField(this, "canXOF");
      __publicField(this, "enableXOF", false);
      __publicField(this, "rounds");
      anumber(blockLen, "blockLen");
      anumber(suffix, "suffix");
      anumber(rounds, "rounds");
      abool(enableXOF, "enableXOF");
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.canXOF = enableXOF;
      this.rounds = rounds;
      anumber(outputLen, "outputLen");
      if (!(0 < blockLen && blockLen < 200))
        throw new Error('"blockLen" must be 1..199');
      this.state = new Uint8Array(200);
      this.state32 = u32(this.state);
    }
    clone() {
      return this._cloneInto();
    }
    keccak() {
      swap32IfBE(this.state32);
      keccakP(this.state32, this.rounds);
      swap32IfBE(this.state32);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { blockLen, state, state32 } = this;
      const len = data.length;
      const canUseU32 = blockLen % 4 === 0 && data.byteOffset % 4 === 0;
      const blockLen32 = blockLen / 4;
      const data32 = canUseU32 && len >= blockLen ? u32(data) : void 0;
      for (let pos = 0; pos < len; ) {
        if (data32 !== void 0 && this.pos === 0 && pos % 4 === 0 && len - pos >= blockLen) {
          for (let i = 0, o = pos / 4; i < blockLen32; i++)
            state32[i] ^= data32[o + i];
          pos += blockLen;
          this.pos = blockLen;
          this.keccak();
          continue;
        }
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0; i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      aexists(this, false);
      abytes(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length; pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not enabled");
      return this.writeInto(out);
    }
    xof(bytes) {
      anumber(bytes);
      return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
      aoutput(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out.length === this.outputLen ? out : out.subarray(0, this.outputLen));
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.outputLen);
      this.digestInto(out);
      return out;
    }
    destroy() {
      this.destroyed = true;
      clean(this.state);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.blockLen = blockLen;
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.canXOF = this.canXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  var genKeccak = (suffix, blockLen, outputLen, info = {}) => createHasher(() => new Keccak(blockLen, suffix, outputLen), info);
  var sha3_256 = /* @__PURE__ */ genKeccak(
    6,
    136,
    32,
    /* @__PURE__ */ oidNist(8)
  );
  var sha3_512 = /* @__PURE__ */ genKeccak(
    6,
    72,
    64,
    /* @__PURE__ */ oidNist(10)
  );
  var genShake = (suffix, blockLen, outputLen, info = {}) => createHasher((opts2 = {}) => {
    opts2 = checkOpts({}, opts2);
    return new Keccak(blockLen, suffix, opts2.dkLen === void 0 ? outputLen : opts2.dkLen, true);
  }, info);
  var shake128 = /* @__PURE__ */ genShake(31, 168, 16, /* @__PURE__ */ oidNist(11));
  var shake256 = /* @__PURE__ */ genShake(31, 136, 32, /* @__PURE__ */ oidNist(12));

  function aarray(item, title, inner = () => {
  }) {
    if (!Array.isArray(item))
      throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
    for (let i = 0; i < item.length; i++)
      inner(item[i], `${title}[${i}]`);
    return item;
  }
  var abytes2 = (value, length, title) => abytes(value, length, title);
  var anumber2 = anumber;
  function aobject2(value, title = "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
    return value;
  }
  function afunction(value, title) {
    if (typeof value !== "function")
      throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
    return value;
  }
  var bytesToHex2 = bytesToHex;
  var concatBytes2 = (...arrays) => concatBytes(...arrays);
  var hexToBytes2 = (hex) => hexToBytes(hex);
  var isBytes2 = isBytes;
  var randomBytes2 = (bytesLength) => randomBytes(bytesLength);
  var _0n2 = /* @__PURE__ */ BigInt(0);
  var _1n2 = /* @__PURE__ */ BigInt(1);
  var atitle2 = (title) => title ? `"${title}" ` : "";
  function abool2(value, title = "") {
    if (typeof value !== "boolean")
      throw new TypeError(atitle2(title) + "expected boolean, got type=" + typeof value);
    return value;
  }
  function abignumber(n) {
    if (typeof n === "bigint") {
      if (!isPosBig(n))
        throw new RangeError("positive bigint expected, got " + n);
    } else
      anumber2(n);
    return n;
  }
  function asafenumber(value, title = "") {
    if (typeof value !== "number") {
      const prefix = title && `"${title}" `;
      throw new TypeError(prefix + "expected number, got type=" + typeof value);
    }
    if (!Number.isSafeInteger(value)) {
      const prefix = title && `"${title}" `;
      throw new RangeError(prefix + "expected safe integer, got " + value);
    }
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new TypeError("hex string expected, got " + typeof hex);
    return hex === "" ? _0n2 : BigInt("0x" + hex);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
  }
  function numberToBytesBE(n, len) {
    anumber(len);
    if (len === 0)
      throw new Error("zero output length is invalid");
    n = abignumber(n);
    const expectedLen = len * 2;
    const hex = n.toString(16);
    if (hex.length > expectedLen)
      throw new RangeError("number is too large");
    return hexToBytes(hex.padStart(expectedLen, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function copyBytes(bytes) {
    return Uint8Array.from(abytes2(bytes));
  }
  function asciiToBytes(ascii) {
    if (typeof ascii !== "string")
      throw new TypeError("ascii string expected, got " + typeof ascii);
    return Uint8Array.from(ascii, (c, i) => {
      const charCode = c.charCodeAt(0);
      if (c.length !== 1 || charCode > 127) {
        throw new RangeError(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
      }
      return charCode;
    });
  }
  function isPosBig(n) {
    return typeof n === "bigint" && _0n2 <= n;
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    if (n < _0n2)
      throw new Error("expected non-negative bigint, got " + n);
    return n === _0n2 ? 0 : n.toString(2).length;
  }
  var bitMask = (n) => {
    asafenumber(n, "n");
    return (_1n2 << BigInt(n)) - _1n2;
  };
  function validateObject(object, fields = {}, optFields = {}, title = "object") {
    aobject2(object, title);
    aobject2(fields, "fields");
    aobject2(optFields, "optFields");
    function checkField(fieldName, expectedType, isOpt) {
      const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
      const val = object[fieldName];
      if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) {
        throw new TypeError(`${label} is invalid: expected own property`);
      }
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
    }
    const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
    iter(fields, false);
    iter(optFields, true);
  }

  var _0n3 = /* @__PURE__ */ BigInt(0);
  var _1n3 = /* @__PURE__ */ BigInt(1);
  var _2n2 = /* @__PURE__ */ BigInt(2);
  var _3n = /* @__PURE__ */ BigInt(3);
  var _4n = /* @__PURE__ */ BigInt(4);
  var _5n = /* @__PURE__ */ BigInt(5);
  var _7n2 = /* @__PURE__ */ BigInt(7);
  var _8n = /* @__PURE__ */ BigInt(8);
  var _9n = /* @__PURE__ */ BigInt(9);
  var _15n = /* @__PURE__ */ BigInt(15);
  var _16n = /* @__PURE__ */ BigInt(16);
  var POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
  function mod(a, b) {
    if (b <= _0n3)
      throw new Error("mod: expected positive modulus, got " + b);
    const result = a % b;
    return result >= _0n3 ? result : b + result;
  }
  function pow(num2, power, modulo) {
    if (modulo <= _1n3)
      throw new Error("pow: expected modulus > 1, got " + modulo);
    if (typeof power !== "bigint")
      throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
    if (power < _0n3)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n3)
      return _1n3;
    if (power === _1n3)
      return num2;
    let d = num2 % modulo;
    if (d < _0n3)
      d += modulo;
    if (power < POW_WINDOWED_MIN) {
      let p2 = _1n3;
      while (power > _0n3) {
        if (power & _1n3)
          p2 = p2 * d % modulo;
        d = d * d % modulo;
        power >>= _1n3;
      }
      return p2;
    }
    const digits = [];
    while (power > _0n3) {
      digits.push(Number(power & _15n));
      power >>= _4n;
    }
    const table = new Array(16);
    table[0] = _1n3;
    table[1] = d;
    for (let i = 2; i < 16; i++)
      table[i] = table[i - 1] * d % modulo;
    let p = table[digits[digits.length - 1]];
    for (let w = digits.length - 2; w >= 0; w--) {
      p = p * p % modulo;
      p = p * p % modulo;
      p = p * p % modulo;
      p = p * p % modulo;
      const digit = digits[w];
      if (digit !== 0)
        p = p * table[digit] % modulo;
    }
    return p;
  }
  function pow2(x, power, modulo) {
    if (modulo <= _1n3)
      throw new Error("pow2: expected modulus > 1, got " + modulo);
    if (power < _0n3)
      throw new Error("pow2: expected non-negative exponent, got " + power);
    let res = x;
    while (power-- > _0n3) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n3)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _1n3)
      throw new Error("invert: expected modulus > 1, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n3, u = _1n3;
    while (a !== _0n3) {
      const q = b / a;
      const r = b - a * q;
      const m = x - u * q;
      b = a, a = r, x = u, u = m;
    }
    const gcd = b;
    if (gcd !== _1n3)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function assertIsSquare(Fp2, root, n) {
    const F2 = Fp2;
    if (!F2.eql(F2.sqr(root), n))
      throw new Error("Cannot find square root");
  }
  function aoddModulus(order, fnName) {
    if ((order & _1n3) === _0n3)
      throw new Error(fnName + ": expected odd modulus, got " + order);
  }
  function sqrt3mod4(Fp2, n) {
    const F2 = Fp2;
    const p1div4 = (F2.ORDER + _1n3) / _4n;
    const root = F2.pow(n, p1div4);
    assertIsSquare(F2, root, n);
    return root;
  }
  function sqrt5mod8(Fp2, n) {
    const F2 = Fp2;
    const p5div8 = (F2.ORDER - _5n) / _8n;
    const n2 = F2.mul(n, _2n2);
    const v = F2.pow(n2, p5div8);
    const nv = F2.mul(n, v);
    const i = F2.mul(F2.mul(nv, _2n2), v);
    const root = F2.mul(nv, F2.sub(i, F2.ONE));
    assertIsSquare(F2, root, n);
    return root;
  }
  function sqrt9mod16(P) {
    const Fp_ = Field(P);
    const tn = tonelliShanks(P);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c2 = tn(Fp_, c1);
    const c3 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P + _7n2) / _16n;
    return ((Fp2, n) => {
      const F2 = Fp2;
      let tv1 = F2.pow(n, c4);
      let tv2 = F2.mul(tv1, c1);
      const tv3 = F2.mul(tv1, c2);
      const tv4 = F2.mul(tv1, c3);
      const e1 = F2.eql(F2.sqr(tv2), n);
      const e2 = F2.eql(F2.sqr(tv3), n);
      tv1 = F2.cmov(tv1, tv2, e1);
      tv2 = F2.cmov(tv4, tv3, e2);
      const e3 = F2.eql(F2.sqr(tv2), n);
      const root = F2.cmov(tv1, tv2, e3);
      assertIsSquare(F2, root, n);
      return root;
    });
  }
  function tonelliShanks(P) {
    if (P < _3n)
      throw new Error("sqrt is not defined for small field");
    aoddModulus(P, "tonelliShanks");
    let Q2 = P - _1n3;
    let S = 0;
    while (Q2 % _2n2 === _0n3) {
      Q2 /= _2n2;
      S++;
    }
    let Z = _2n2;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q2);
    const Q1div2 = (Q2 + _1n3) / _2n2;
    return function tonelliSlow(Fp2, n) {
      const F2 = Fp2;
      if (F2.is0(n))
        return n;
      if (FpLegendre(F2, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = F2.mul(F2.ONE, cc);
      let t = F2.pow(n, Q2);
      let R = F2.pow(n, Q1div2);
      while (!F2.eql(t, F2.ONE)) {
        if (F2.is0(t))
          throw new Error("Cannot find square root: probably non-prime P");
        let i = 1;
        let t_tmp = F2.sqr(t);
        while (!F2.eql(t_tmp, F2.ONE)) {
          i++;
          t_tmp = F2.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n3 << BigInt(M - i - 1);
        const b = F2.pow(c, exponent);
        M = i;
        c = F2.sqr(b);
        t = F2.mul(t, c);
        R = F2.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    aoddModulus(P, "Fp.sqrt");
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    if (P % _16n === _9n)
      return sqrt9mod16(P);
    return tonelliShanks(P);
  }
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    aobject2(field, "field");
    if (typeof field.ORDER !== "bigint")
      throw new TypeError('param "ORDER" is invalid: expected bigint, got ' + typeof field.ORDER);
    asafenumber(field.BYTES, "BYTES");
    asafenumber(field.BITS, "BITS");
    for (const name of FIELD_FIELDS)
      afunction(field[name], "field." + name);
    if (field.BYTES < 1 || field.BITS < 1)
      throw new Error("invalid field: expected BYTES/BITS > 0");
    if (field.ORDER <= _1n3)
      throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
    return field;
  }
  function FpInvertBatch(Fp2, nums, passZero = false) {
    validateField(Fp2);
    aarray(nums, "nums");
    abool2(passZero, "passZero");
    const F2 = Fp2;
    const inverted = new Array(nums.length).fill(passZero ? F2.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (F2.is0(num2))
        return acc;
      inverted[i] = acc;
      return F2.mul(acc, num2);
    }, F2.ONE);
    const invertedAcc = F2.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (F2.is0(num2))
        return acc;
      inverted[i] = F2.mul(acc, inverted[i]);
      return F2.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp2, n) {
    validateField(Fp2);
    const F2 = Fp2;
    aoddModulus(F2.ORDER, "FpLegendre");
    const p1mod2 = (F2.ORDER - _1n3) / _2n2;
    const powered = F2.pow(n, p1mod2);
    const yes = F2.eql(powered, F2.ONE);
    const zero = F2.eql(powered, F2.ZERO);
    const no = F2.eql(powered, F2.neg(F2.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber2(nBitLength);
    if (n <= _0n3)
      throw new Error("invalid n length: expected positive n, got " + n);
    if (nBitLength !== void 0 && nBitLength < 1)
      throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
    const bits = bitLen(n);
    if (nBitLength !== void 0 && nBitLength < bits)
      throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  var FIELD_SQRT = /* @__PURE__ */ new WeakMap();
  var _Field = class {
    constructor(ORDER, opts2 = {}) {
      __publicField(this, "ORDER");
      __publicField(this, "BITS");
      __publicField(this, "BYTES");
      __publicField(this, "isLE");
      __publicField(this, "ZERO", _0n3);
      __publicField(this, "ONE", _1n3);
      __publicField(this, "_lengths");
      __publicField(this, "_mod");
      if (ORDER <= _1n3)
        throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
      let _nbitLength = void 0;
      this.isLE = false;
      if (opts2 != null && typeof opts2 === "object") {
        if (typeof opts2.BITS === "number")
          _nbitLength = opts2.BITS;
        if (typeof opts2.sqrt === "function")
          Object.defineProperty(this, "sqrt", { value: opts2.sqrt, enumerable: true });
        if (typeof opts2.isLE === "boolean")
          this.isLE = opts2.isLE;
        if (opts2.allowedLengths)
          this._lengths = Object.freeze(opts2.allowedLengths.slice());
        if (typeof opts2.modFromBytes === "boolean")
          this._mod = opts2.modFromBytes;
      }
      const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
      if (nByteLength > 2048)
        throw new Error("invalid field: expected ORDER of <= 2048 bytes");
      this.ORDER = ORDER;
      this.BITS = nBitLength;
      this.BYTES = nByteLength;
      Object.freeze(this);
    }
    create(num2) {
      return mod(num2, this.ORDER);
    }
    isValid(num2) {
      if (typeof num2 !== "bigint")
        throw new TypeError("invalid field element: expected bigint, got " + typeof num2);
      return _0n3 <= num2 && num2 < this.ORDER;
    }
    is0(num2) {
      return num2 === _0n3;
    }
    isValidNot0(num2) {
      return !this.is0(num2) && this.isValid(num2);
    }
    isOdd(num2) {
      return (num2 & _1n3) === _1n3;
    }
    neg(num2) {
      return mod(-num2, this.ORDER);
    }
    eql(lhs, rhs) {
      return lhs === rhs;
    }
    sqr(num2) {
      return mod(num2 * num2, this.ORDER);
    }
    add(lhs, rhs) {
      return mod(lhs + rhs, this.ORDER);
    }
    sub(lhs, rhs) {
      return mod(lhs - rhs, this.ORDER);
    }
    mul(lhs, rhs) {
      return mod(lhs * rhs, this.ORDER);
    }
    pow(num2, power) {
      return pow(num2, power, this.ORDER);
    }
    div(lhs, rhs) {
      return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
    }
    sqrN(num2) {
      return num2 * num2;
    }
    addN(lhs, rhs) {
      return lhs + rhs;
    }
    subN(lhs, rhs) {
      return lhs - rhs;
    }
    mulN(lhs, rhs) {
      return lhs * rhs;
    }
    inv(num2) {
      return invert(num2, this.ORDER);
    }
    sqrt(num2) {
      let sqrt = FIELD_SQRT.get(this);
      if (!sqrt)
        FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
      return sqrt(this, num2);
    }
    toBytes(num2) {
      return this.isLE ? numberToBytesLE(num2, this.BYTES) : numberToBytesBE(num2, this.BYTES);
    }
    fromBytes(bytes, skipValidation = false) {
      abytes2(bytes);
      const { _lengths: allowedLengths, BYTES, isLE: isLE3, ORDER, _mod: modFromBytes } = this;
      if (allowedLengths) {
        if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE3 ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE3 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      if (modFromBytes)
        scalar = mod(scalar, ORDER);
      if (!skipValidation) {
        if (!this.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    }
    invertBatch(lst) {
      return FpInvertBatch(this, lst, true);
    }
    cmov(a, b, condition) {
      abool2(condition, "condition");
      return condition ? b : a;
    }
  };
  function Field(ORDER, opts2 = {}) {
    Object.freeze(_Field.prototype);
    return new _Field(ORDER, opts2);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    if (fieldOrder <= _1n3)
      throw new Error("field order must be greater than 1");
    const bitLength = bitLen(fieldOrder - _1n3);
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE3 = false) {
    abytes2(key);
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = Math.max(getMinHashLength(fieldOrder), 16);
    if (len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE3 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n3) + _1n3;
    return isLE3 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }

  var _0n4 = /* @__PURE__ */ BigInt(0);
  var _1n4 = /* @__PURE__ */ BigInt(1);
  var _4n2 = /* @__PURE__ */ BigInt(4);
  var BLIND_BYTES = 16;
  var BLIND_BITS = 128;
  var FW_WINDOW = 5;
  var TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
  function validatePointCons(Point) {
    const pc = Point;
    if (typeof pc !== "function")
      throw new TypeError('"Point" expected constructor, got type=' + typeof Point);
    afunction(pc.fromAffine, "Point.fromAffine");
    afunction(pc.fromBytes, "Point.fromBytes");
    afunction(pc.fromHex, "Point.fromHex");
    aobject2(pc.BASE, "Point.BASE");
    aobject2(pc.ZERO, "Point.ZERO");
    validateField(pc.Fp);
    validateField(pc.Fn);
  }
  function normalizeZ(c, points) {
    validatePointCons(c);
    validateMSMPoints(points, c);
    const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
    return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
  }
  function validateW(W, bits, min = 1) {
    if (!Number.isSafeInteger(W) || W < min || W > bits)
      throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
  }
  function validateTableBytes(numPoints, fpBytes) {
    const bytes = numPoints * (4 * fpBytes + 128);
    if (bytes > TABLE_BYTES_MAX)
      throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
  }
  function probeRandomBytes(randomBytes5, length) {
    if (randomBytes5 === void 0)
      return void 0;
    afunction(randomBytes5, "randomBytes");
    try {
      const probe = randomBytes5(length);
      if (!isBytes2(probe) || probe.length !== length)
        return void 0;
    } catch {
      return void 0;
    }
    return randomBytes5;
  }
  function validateMSMPoints(points, c) {
    aarray(points, "points");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field, maxScalar) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      const ok = maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar;
      if (!ok)
        throw new Error("invalid scalar at index " + i);
    });
  }
  var pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getWindowSize(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function oddMultiples(p, size) {
    const dbl = p.double();
    const t = [p];
    for (let j = 1; j < size; j++)
      t.push(t[j - 1].add(dbl));
    return t;
  }
  function wnafDigits(n, W) {
    const size = 2 ** W;
    const half = size / 2;
    const mask = BigInt(size - 1);
    const d = [];
    while (n > _0n4) {
      let w = 0;
      if (n & _1n4) {
        w = Number(n & mask);
        if (w >= half)
          w -= size;
        n -= BigInt(w);
      }
      d.push(w);
      n >>= _1n4;
    }
    return d;
  }
  function signedWindowDigits(n, W, windows) {
    const size = 2 ** W;
    const half = size / 2;
    const mask = BigInt(size - 1);
    const shiftBy = BigInt(W);
    const d = [];
    for (let w = 0; w < windows; w++) {
      let v = Number(n & mask);
      n >>= shiftBy;
      if (v > half) {
        v -= size;
        n += _1n4;
      }
      d.push(v);
    }
    if (n !== _0n4)
      throw new Error("invalid wnaf");
    return d;
  }
  function wnafWalk(zero, tables, digits) {
    let max = 0;
    for (const d of digits)
      max = Math.max(max, d.length);
    let acc = zero;
    for (let bit = max - 1; bit >= 0; bit--) {
      if (bit !== max - 1)
        acc = acc.double();
      for (let i = 0; i < digits.length; i++) {
        const w = digits[i][bit];
        if (w) {
          const item = tables[i][Math.abs(w) - 1 >> 1];
          acc = acc.add(w < 0 ? item.negate() : item);
        }
      }
    }
    return acc;
  }
  var ScalarMultiplier = class {
    constructor(Point, randomBytes5) {
      __publicField(this, "Point");
      __publicField(this, "BASE");
      __publicField(this, "ZERO");
      __publicField(this, "randomBytes");
      __publicField(this, "wnafPrecomputes", /* @__PURE__ */ new WeakMap());
      __publicField(this, "baseCanBeBlinded");
      __publicField(this, "bits");
      validatePointCons(Point);
      this.randomBytes = probeRandomBytes(randomBytes5, BLIND_BYTES);
      this.Point = Point;
      this.BASE = Point.BASE;
      this.ZERO = Point.ZERO;
      this.bits = Point.Fn.BITS;
    }
    /**
     * Creates a signed fixed-window wNAF precomputation table: for every window w, the
     * multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
     * so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
     * window absorbs the final carry of signed-digit recoding.
     * For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
     * @param point - Point instance
     * @param W - window size
     * @param bits - scalar bitlength the table must cover
     */
    buildWnafTable(point, W, bits) {
      const windows = Math.ceil(bits / W) + 1;
      const half = 2 ** (W - 1);
      const comp = [];
      let base = point;
      for (let w = 0; w < windows; w++) {
        let acc = base;
        for (let i = 0; i < half; i++) {
          comp.push(acc);
          acc = acc.add(base);
        }
        base = comp[comp.length - 1].double();
      }
      return { W, bits, windows, comp };
    }
    /**
     * Implements ec multiplication using precomputed signed fixed-window wNAF tables.
     * Constant-time: fixed window count with one table addition per window — zero digits feed
     * the fake accumulator — and no doublings; the lookup scans the whole window slice.
     * Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
     * {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
     * signedWindowDigits throws if `n` exceeds the table.
     * @returns real and fake (for const-time) points
     */
    wnafCachedCT(precomputes, n) {
      const { W, windows, comp } = precomputes;
      const half = 2 ** (W - 1);
      const digits = signedWindowDigits(n, W, windows);
      let p = this.ZERO;
      let f = this.BASE;
      for (let w = 0; w < windows; w++) {
        const digit = digits[w];
        const start = w * half;
        const idx = Math.abs(digit) - 1;
        let sel = comp[start];
        for (let i = 1; i < half; i++)
          sel = i === idx ? comp[start + i] : sel;
        const neg = sel.negate();
        if (digit === 0)
          f = f.add(comp[start]);
        else
          p = p.add(digit < 0 ? neg : sel);
      }
      return { p, f };
    }
    getWnafPrecomputes(W, point, bits, transform) {
      let entries = this.wnafPrecomputes.get(point);
      let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
      if (!comp) {
        comp = this.buildWnafTable(point, W, bits);
        if (typeof transform === "function")
          comp = { ...comp, comp: transform(comp.comp) };
        if (!entries) {
          entries = [];
          this.wnafPrecomputes.set(point, entries);
        }
        entries.push(comp);
      }
      return comp;
    }
    assertPoint(point) {
      if (!(point instanceof this.Point))
        throw new TypeError('"point" expected Point instance, got type=' + typeof point);
    }
    validateMulInput(point, scalar) {
      this.assertPoint(point);
      if (!inRange(scalar, _1n4, this.Point.Fn.ORDER))
        throw new Error("invalid scalar");
    }
    runCT(point, n, bits, transform) {
      const W = getWindowSize(point);
      if (W === 1)
        return this.fixedWindowCT(point, n, bits);
      return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
    }
    mulCT(point, scalar, transform) {
      this.validateMulInput(point, scalar);
      return this.runCT(point, scalar, this.bits, transform);
    }
    mulCTBlinded(point, scalar, transform) {
      this.validateMulInput(point, scalar);
      if (this.randomBytes === void 0)
        throw new Error("randomBytes is required for scalar blinding");
      const bits = this.Point.Fn.BITS + BLIND_BITS;
      const blind = this.randomBytes(BLIND_BYTES);
      if (!isBytes2(blind) || blind.length !== BLIND_BYTES)
        throw new Error("randomBytes returned invalid byte array");
      blind[0] = blind[0] & 63 | 128;
      const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
      return this.runCT(point, n, bits, transform);
    }
    /**
     * Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
     * A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
     * far cheaper to build for a single use. The point-operation sequence is independent of `n`:
     * build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
     * every table entry, and one addition (adds the identity when the window digit is 0 — never
     * skipped).
     *
     * `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
     * add), which holds for the Weierstrass/Edwards point types used here. The table is left in
     * projective form (no normalizeZ): normalizing this small a table costs more than the
     * mixed-add savings it would buy for a single multiply.
     * @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
     * (this path needs no fake accumulator — its op-count is already scalar-independent).
     */
    fixedWindowCT(point, n, bits) {
      const W = FW_WINDOW;
      const size = 1 << W;
      const mask = bitMask(W);
      const table = new Array(size);
      table[0] = this.ZERO;
      for (let i = 1; i < size; i++)
        table[i] = table[i - 1].add(point);
      const windows = Math.ceil(bits / W);
      let acc = this.ZERO;
      for (let window = windows - 1; window >= 0; window--) {
        if (window !== windows - 1)
          for (let d = 0; d < W; d++)
            acc = acc.double();
        const digit = Number(n >> BigInt(window * W) & mask);
        let sel = table[0];
        for (let i = 1; i < size; i++)
          sel = i === digit ? table[i] : sel;
        acc = acc.add(sel);
      }
      return { p: acc, f: acc };
    }
    shouldBlind(point, cofactor) {
      if (this.randomBytes === void 0)
        return false;
      if (cofactor === _1n4)
        return true;
      if (point !== this.BASE)
        return false;
      if (this.baseCanBeBlinded === void 0)
        this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
      return this.baseCanBeBlinded;
    }
    mulSecret(point, scalar, cofactor, transform) {
      return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
    }
    mulUnsafe(point, scalar, transform) {
      this.assertPoint(point);
      if (!isPosBig(scalar))
        throw new Error("invalid scalar");
      const W = getWindowSize(point);
      if (W === 1 || scalar >= this.Point.Fn.ORDER)
        return mulAddUnsafe(this.Point, [point], [scalar], true);
      const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
      return this.wnafCachedCT(precomputes, scalar).p;
    }
    setWindowSize(point, W) {
      this.assertPoint(point);
      validateW(W, this.bits);
      const windows = Math.ceil((this.bits + BLIND_BITS) / W) + 1;
      validateTableBytes(windows * 2 ** (W - 1), this.Point.Fp.BYTES);
      pointWindowSizes.set(point, W);
      this.wnafPrecomputes.delete(point);
    }
    hasWindowSize(point) {
      return getWindowSize(point) !== 1;
    }
  };
  function mulAddUnsafe(c, points, scalars, allowOversized = false) {
    validatePointCons(c);
    validateMSMPoints(points, c);
    abool2(allowOversized, "allowOversized");
    validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n2 : void 0);
    if (points.length !== scalars.length)
      throw new Error("arrays of points and scalars must have equal length");
    const tables = points.map((p) => oddMultiples(p, 4));
    const digits = scalars.map((n) => wnafDigits(n, 4));
    return wnafWalk(c.ZERO, tables, digits);
  }
  function createField(order, field, isLE3) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE: isLE3 });
    }
  }
  function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (type !== "weierstrass" && type !== "edwards")
      throw new Error('expected curve type "weierstrass" or "edwards"');
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    validateObject(curveOpts);
    for (const p of ["p", "n", "h"]) {
      const val = CURVE[p];
      if (!(isPosBig(val) && val !== _0n4))
        throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp2 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b];
    for (const p of params) {
      if (!Fp2.isValid(CURVE[p]))
        throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp: Fp2, Fn: Fn2 };
  }
  function createKeygen(randomSecretKey, getPublicKey) {
    return function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    };
  }

  var _0n5 = /* @__PURE__ */ BigInt(0);
  var _1n5 = /* @__PURE__ */ BigInt(1);
  var _2n3 = /* @__PURE__ */ BigInt(2);
  var _4n3 = /* @__PURE__ */ BigInt(4);
  var _8n2 = /* @__PURE__ */ BigInt(8);
  function isEdValidXY(Fp2, CURVE, x, y) {
    const x2 = Fp2.sqr(x);
    const y2 = Fp2.sqr(y);
    const left = Fp2.add(Fp2.mul(CURVE.a, x2), y2);
    const right = Fp2.add(Fp2.ONE, Fp2.mul(CURVE.d, Fp2.mul(x2, y2)));
    return Fp2.eql(left, right);
  }
  function edwards(params, extraOpts = {}) {
    validateObject(extraOpts, {}, {}, "extraOpts");
    const opts2 = extraOpts;
    const validated = createCurveFields("edwards", params, opts2, opts2.FpFnLE);
    const { Fp: Fp2, Fn: Fn2 } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor } = CURVE;
    if (FpLegendre(Fp2, CURVE.a) !== 1)
      throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
    if (FpLegendre(Fp2, CURVE.d) !== -1)
      throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
    validateObject(opts2, {}, { uvRatio: "function", randomBytes: "function" });
    const randomBytes5 = opts2.randomBytes === void 0 ? randomBytes2 : opts2.randomBytes;
    const MASK = _2n3 << BigInt(Fp2.BYTES * 8) - _1n5;
    function isOdd(n) {
      if (!Fp2.isOdd)
        throw new Error("Field does not have .isOdd()");
      return Fp2.isOdd(n);
    }
    const uvRatio2 = opts2.uvRatio === void 0 ? (u, v) => {
      try {
        return { isValid: true, value: Fp2.sqrt(Fp2.div(u, v)) };
      } catch (e) {
        return { isValid: false, value: _0n5 };
      }
    } : opts2.uvRatio;
    if (!isEdValidXY(Fp2, CURVE, CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const mulA = Fp2.eql(CURVE.a, Fp2.neg(Fp2.ONE)) ? (x) => Fp2.neg(x) : Fp2.eql(CURVE.a, Fp2.ONE) ? (x) => x : (x) => Fp2.mul(CURVE.a, x);
    function acoord(title, n, banZero = false) {
      const min = banZero ? _1n5 : _0n5;
      aInRange("coordinate " + title, n, min, MASK);
      return n;
    }
    function aedpoint(other) {
      if (!(other instanceof Point))
        throw new Error("EdwardsPoint expected");
    }
    const _Point = class _Point {
      constructor(X, Y, Z, T) {
        __publicField(this, "X");
        __publicField(this, "Y");
        __publicField(this, "Z");
        __publicField(this, "T");
        this.X = acoord("x", X);
        this.Y = acoord("y", Y);
        this.Z = acoord("z", Z, true);
        this.T = acoord("t", T);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /**
       * Create one extended Edwards point from affine coordinates.
       * Does NOT validate that the point is on-curve or torsion-free.
       * Use `.assertValidity()` on adversarial inputs.
       */
      static fromAffine(p) {
        if (p instanceof _Point)
          throw new Error("extended point not allowed");
        const { x, y } = p || {};
        acoord("x", x);
        acoord("y", y);
        return new _Point(x, y, Fp2.ONE, Fp2.mul(x, y));
      }
      static fromBytes(bytes, zip215 = false) {
        const len = Fp2.BYTES;
        const { a, d } = CURVE;
        bytes = copyBytes(abytes2(bytes, len, "point"));
        abool2(zip215, "zip215");
        const normed = copyBytes(bytes);
        const lastByte = bytes[len - 1];
        normed[len - 1] = lastByte & ~128;
        const y = bytesToNumberLE(normed);
        const max = zip215 ? MASK : Fp2.ORDER;
        aInRange("point.y", y, _0n5, max);
        const y2 = Fp2.sqr(y);
        const u = Fp2.sub(y2, Fp2.ONE);
        const v = Fp2.sub(Fp2.mulN(d, y2), a);
        let { isValid, value: x } = uvRatio2(u, v);
        if (!isValid)
          throw new Error("bad point: invalid y coordinate");
        const isXOdd = isOdd(x);
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && Fp2.is0(x) && isLastByteOdd)
          throw new Error("bad point: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x = Fp2.neg(x);
        return _Point.fromAffine({ x, y });
      }
      static fromHex(hex, zip215 = false) {
        return _Point.fromBytes(hexToBytes2(hex), zip215);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(windowSize = 6, isLazy = true) {
        wnaf.setWindowSize(this, windowSize);
        if (!isLazy)
          this.multiply(_2n3);
        return this;
      }
      assertValidity() {
        const p = this;
        const { a, d } = CURVE;
        if (p.is0())
          throw new Error("bad point: ZERO");
        const { X, Y, Z, T } = p;
        const X2 = Fp2.sqr(X);
        const Y2 = Fp2.sqr(Y);
        const Z2 = Fp2.sqr(Z);
        const Z4 = Fp2.sqr(Z2);
        const aX2 = Fp2.mul(X2, a);
        const left = Fp2.mul(Fp2.add(aX2, Y2), Z2);
        const right = Fp2.add(Z4, Fp2.mul(d, Fp2.mul(X2, Y2)));
        if (!Fp2.eql(left, right))
          throw new Error("bad point: equation left != right (1)");
        const XY = Fp2.mul(X, Y);
        const ZT = Fp2.mul(Z, T);
        if (!Fp2.eql(XY, ZT))
          throw new Error("bad point: equation left != right (2)");
      }
      equals(other) {
        aedpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const X1Z2 = Fp2.mul(X1, Z2);
        const X2Z1 = Fp2.mul(X2, Z1);
        const Y1Z2 = Fp2.mul(Y1, Z2);
        const Y2Z1 = Fp2.mul(Y2, Z1);
        return Fp2.eql(X1Z2, X2Z1) && Fp2.eql(Y1Z2, Y2Z1);
      }
      is0() {
        return this.equals(_Point.ZERO);
      }
      negate() {
        return new _Point(Fp2.neg(this.X), this.Y, this.Z, Fp2.neg(this.T));
      }
      double() {
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const A = Fp2.sqr(X1);
        const B2 = Fp2.sqr(Y1);
        const C = Fp2.mul(Fp2.sqr(Z1), _2n3);
        const D = mulA(A);
        const x1y1 = Fp2.addN(X1, Y1);
        const E = Fp2.sub(Fp2.subN(Fp2.sqr(x1y1), A), B2);
        const G = Fp2.addN(D, B2);
        const F2 = Fp2.subN(G, C);
        const H = Fp2.subN(D, B2);
        const X3 = Fp2.mul(E, F2);
        const Y3 = Fp2.mul(G, H);
        const T3 = Fp2.mul(E, H);
        const Z3 = Fp2.mul(F2, G);
        return new _Point(X3, Y3, Z3, T3);
      }
      add(other) {
        aedpoint(other);
        const { d } = CURVE;
        const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
        const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
        const A = Fp2.mul(X1, X2);
        const B2 = Fp2.mul(Y1, Y2);
        const C = Fp2.mul(Fp2.mulN(T1, d), T2);
        const D = Fp2.mul(Z1, Z2);
        const E = Fp2.sub(Fp2.subN(Fp2.mulN(Fp2.addN(X1, Y1), Fp2.addN(X2, Y2)), A), B2);
        const F2 = Fp2.subN(D, C);
        const G = Fp2.addN(D, C);
        const H = Fp2.sub(B2, mulA(A));
        const X3 = Fp2.mul(E, F2);
        const Y3 = Fp2.mul(G, H);
        const T3 = Fp2.mul(E, H);
        const Z3 = Fp2.mul(F2, G);
        return new _Point(X3, Y3, Z3, T3);
      }
      subtract(other) {
        aedpoint(other);
        return this.add(other.negate());
      }
      multiply(scalar) {
        if (!Fn2.isValidNot0(scalar))
          throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
        const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize);
        return normalize([p, f])[0];
      }
      multiplyUnsafe(scalar) {
        if (!Fn2.isValid(scalar))
          throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
        if (scalar === _0n5)
          return _Point.ZERO;
        if (this.is0() || scalar === _1n5)
          return this;
        return wnaf.mulUnsafe(this, scalar, normalize);
      }
      isSmallOrder() {
        return this.clearCofactor().is0();
      }
      isTorsionFree() {
        return wnaf.mulUnsafe(this, CURVE.n).is0();
      }
      toAffine(invertedZ) {
        const p = this;
        let iz = invertedZ;
        if (iz != null && typeof iz !== "bigint")
          throw new TypeError('"invertedZ" expected bigint, got type=' + typeof iz);
        const { X, Y, Z } = p;
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp2.create(_8n2) : Fp2.inv(Z);
        const x = Fp2.mul(X, iz);
        const y = Fp2.mul(Y, iz);
        const zz = Fp2.mul(Z, iz);
        if (is0)
          return { x: Fp2.ZERO, y: Fp2.ONE };
        if (!Fp2.eql(zz, Fp2.ONE))
          throw new Error("invZ was invalid");
        return { x, y };
      }
      clearCofactor() {
        if (cofactor === _1n5)
          return this;
        if (cofactor === _2n3)
          return this.double();
        if (cofactor === _4n3)
          return this.double().double();
        if (cofactor === _8n2)
          return this.double().double().double();
        return this.multiplyUnsafe(cofactor);
      }
      toBytes() {
        const { x, y } = this.toAffine();
        const bytes = Fp2.toBytes(y);
        bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex2(this.toBytes());
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    };
    __publicField(_Point, "BASE", new _Point(CURVE.Gx, CURVE.Gy, Fp2.ONE, Fp2.mul(CURVE.Gx, CURVE.Gy)));
    __publicField(_Point, "ZERO", new _Point(Fp2.ZERO, Fp2.ONE, Fp2.ONE, Fp2.ZERO));
    __publicField(_Point, "Fp", Fp2);
    __publicField(_Point, "Fn", Fn2);
    let Point = _Point;
    const normalize = (points) => normalizeZ(Point, points);
    const wnaf = new ScalarMultiplier(Point, randomBytes5);
    if (wnaf.bits >= 6)
      Point.BASE.precompute(6);
    Object.freeze(Point.prototype);
    Object.freeze(Point);
    return Point;
  }

  function checkU32(n, title = "n") {
    if (typeof n !== "number")
      throw new TypeError(`wrong u32 integer "${title}": expected number, got type=${typeof n}`);
    if (!Number.isSafeInteger(n) || n < 0 || n > 4294967295)
      throw new RangeError(`wrong u32 integer "${title}": expected 0..4294967295, got ${n}`);
    return n;
  }
  function isPowerOfTwo(x) {
    checkU32(x, "x");
    return (x & x - 1) === 0 && x !== 0;
  }
  function reverseBits(n, bits) {
    checkU32(n);
    if (typeof bits !== "number")
      throw new TypeError('"bits" expected number, got type=' + typeof bits);
    if (!Number.isSafeInteger(bits) || bits < 0 || bits > 32)
      throw new Error(`expected integer 0 <= bits <= 32, got ${bits}`);
    let reversed = 0;
    for (let i = 0; i < bits; i++, n >>>= 1)
      reversed = reversed << 1 | n & 1;
    return reversed >>> 0;
  }
  function log2(n) {
    checkU32(n);
    return 31 - Math.clz32(n);
  }
  function bitReversalInplace(values) {
    if (!values || typeof values !== "object" || typeof values.length !== "number")
      throw new TypeError('"values" expected array-like, got type=' + typeof values);
    const n = values.length;
    if (!isPowerOfTwo(n))
      throw new Error("expected positive power-of-two length, got " + n);
    const bits = log2(n);
    for (let i = 0; i < n; i++) {
      const j = reverseBits(i, bits);
      if (i < j) {
        const tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
      }
    }
    return values;
  }
  var FFTCore = (F2, coreOpts) => {
    validateObject(coreOpts, { N: "number", roots: "object", dit: "boolean" }, { invertButterflies: "boolean", skipStages: "number", brp: "boolean" }, "coreOpts");
    const { N: N2, roots, dit, invertButterflies = false, skipStages = 0, brp = true } = coreOpts;
    checkU32(N2, "coreOpts.N");
    const bits = log2(N2);
    if (!isPowerOfTwo(N2))
      throw new Error("FFT: Polynomial size should be power of two");
    checkU32(skipStages, "coreOpts.skipStages");
    const maxSkipStages = bits === 0 ? 0 : bits - 1;
    if (skipStages > maxSkipStages)
      throw new Error(`FFT: wrong skipStages: expected 0 <= skipStages <= ${maxSkipStages}`);
    if (roots.length !== N2)
      throw new Error(`FFT: wrong roots length: expected ${N2}, got ${roots.length}`);
    const isDit = dit !== invertButterflies;
    return (values) => {
      if (values.length !== N2)
        throw new Error("FFT: wrong Polynomial length");
      if (dit && brp)
        bitReversalInplace(values);
      for (let i = 0, g = 1; i < bits - skipStages; i++) {
        const s = dit ? i + 1 + skipStages : bits - i;
        const m = 1 << s;
        const m2 = m >> 1;
        const stride = N2 >> s;
        for (let k = 0; k < N2; k += m) {
          for (let j = 0, grp = g++; j < m2; j++) {
            const rootPos = invertButterflies ? dit ? N2 - grp : grp : j * stride;
            const i0 = k + j;
            const i1 = k + j + m2;
            const omega = roots[rootPos];
            const b = values[i1];
            const a = values[i0];
            if (isDit) {
              const t = F2.mul(b, omega);
              values[i0] = F2.add(a, t);
              values[i1] = F2.sub(a, t);
            } else if (invertButterflies) {
              values[i0] = F2.add(b, a);
              values[i1] = F2.mul(F2.sub(b, a), omega);
            } else {
              values[i0] = F2.add(a, b);
              values[i1] = F2.mul(F2.sub(a, b), omega);
            }
          }
        }
      }
      if (!dit && brp)
        bitReversalInplace(values);
      return values;
    };
  };

  var _0n6 = /* @__PURE__ */ BigInt(0);
  var _1n6 = /* @__PURE__ */ BigInt(1);
  var _2n4 = /* @__PURE__ */ BigInt(2);
  function cmask(P, swap) {
    return P + swap - (swap >> _1n6 << _1n6);
  }
  function cswap(P) {
    const offset = BigInt(6) * P;
    return (mask, x_2, x_3) => {
      const sum = x_2 + x_3;
      const d = offset + x_3 - x_2;
      const a = (d * mask + x_2) % P;
      return { x_2: a, x_3: sum - a };
    };
  }
  function validateOpts(curve) {
    validateObject(curve, {
      P: "bigint",
      type: "string",
      adjustScalarBytes: "function",
      powPminus2: "function"
    }, {
      randomBytes: "function",
      scalarMultBase: "function"
    });
    return Object.freeze({ ...curve });
  }
  function montgomery(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
    const mulBaseHook = CURVE.scalarMultBase;
    const is25519 = type === "x25519";
    if (!is25519 && type !== "x448")
      throw new Error("invalid type");
    const randomBytes_ = rand === void 0 ? randomBytes2 : rand;
    const montgomeryBits = is25519 ? 255 : 448;
    const swap = cswap(P);
    const fieldLen = is25519 ? 32 : 56;
    const Gu = is25519 ? BigInt(9) : BigInt(5);
    const a24 = is25519 ? BigInt(121665) : BigInt(39081);
    const minScalar = is25519 ? _2n4 ** BigInt(254) : _2n4 ** BigInt(447);
    const maxAdded = is25519 ? BigInt(8) * (_2n4 ** BigInt(251) - _1n6) : BigInt(4) * (_2n4 ** BigInt(445) - _1n6);
    const maxScalar = minScalar + maxAdded + _1n6;
    const modP = (n) => mod(n, P);
    const GuBytes = encodeU(Gu);
    function encodeU(u) {
      return numberToBytesLE(modP(u), fieldLen);
    }
    function decodeU(u) {
      const _u = copyBytes(abytes2(u, fieldLen, "uCoordinate"));
      if (is25519)
        _u[31] &= 127;
      return modP(bytesToNumberLE(_u));
    }
    function decodeScalar(scalar) {
      return bytesToNumberLE(adjustScalarBytes2(copyBytes(abytes2(scalar, fieldLen, "scalar"))));
    }
    const lowOrderU = new Set(is25519 ? [
      _0n6,
      _1n6,
      P - _1n6,
      BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
      BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
    ] : [_0n6, _1n6, P - _1n6]);
    function scalarMult(scalar, u) {
      const pointU = decodeU(u);
      if (lowOrderU.has(pointU))
        throw new Error("invalid private or public key received");
      const pu = montgomeryLadder(pointU, decodeScalar(scalar));
      if (pu === _0n6)
        throw new Error("invalid private or public key received");
      return encodeU(pu);
    }
    function scalarMultBase(scalar) {
      if (mulBaseHook === void 0)
        return scalarMult(scalar, GuBytes);
      const k = decodeScalar(scalar);
      aInRange("scalar", k, minScalar, maxScalar);
      const pu = modP(mulBaseHook(k));
      if (pu === _0n6)
        throw new Error("invalid private or public key received");
      return encodeU(pu);
    }
    const getPublicKey = scalarMultBase;
    const getSharedSecret = scalarMult;
    function montgomeryLadder(u, scalar) {
      aInRange("u", u, _0n6, P);
      aInRange("scalar", scalar, minScalar, maxScalar);
      const k = scalar;
      const x_1 = u;
      let x_2 = _1n6;
      let z_2 = _0n6;
      let x_3 = u;
      let z_3 = _1n6;
      const kx = k ^ k >> _1n6;
      for (let t = BigInt(montgomeryBits - 1); t >= _0n6; t--) {
        const mask2 = cmask(P, kx >> t);
        ({ x_2, x_3 } = swap(mask2, x_2, x_3));
        ({ x_2: z_2, x_3: z_3 } = swap(mask2, z_2, z_3));
        const A = x_2 + z_2;
        const AA = modP(A * A);
        const B2 = x_2 - z_2;
        const BB = modP(B2 * B2);
        const E = AA - BB;
        const C = x_3 + z_3;
        const D = x_3 - z_3;
        const DA = modP(D * A);
        const CB = modP(C * B2);
        const dacb = DA + CB;
        const da_cb = DA - CB;
        x_3 = modP(dacb * dacb);
        z_3 = modP(x_1 * modP(da_cb * da_cb));
        x_2 = modP(AA * BB);
        z_2 = modP(E * (AA + modP(a24 * E)));
      }
      const mask = cmask(P, k);
      ({ x_2, x_3 } = swap(mask, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = swap(mask, z_2, z_3));
      const z2 = powPminus2(z_2);
      return modP(x_2 * z2);
    }
    const lengths = {
      secretKey: fieldLen,
      publicKey: fieldLen,
      seed: fieldLen
    };
    const randomSecretKey = (seed) => {
      seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
      abytes2(seed, lengths.seed, "seed");
      return seed;
    };
    const utils = { randomSecretKey };
    Object.freeze(lengths);
    Object.freeze(utils);
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getSharedSecret,
      getPublicKey,
      scalarMult,
      scalarMultBase,
      utils,
      GuBytes: GuBytes.slice(),
      lengths
    });
  }

  var ed448_CURVE_p = /* @__PURE__ */ BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  var ed448_CURVE = /* @__PURE__ */ (() => ({
    p: ed448_CURVE_p,
    n: BigInt("0x3fffffffffffffffffffffffffffffffffffffffffffffffffffffff7cca23e9c44edb49aed63690216cc2728dc58f552378c292ab5844f3"),
    h: BigInt(4),
    a: BigInt(1),
    d: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffffffffffffffffffffffffffffffffffffffffffffffff6756"),
    Gx: BigInt("0x4f1970c66bed0ded221d15a622bf36da9e146570470f1767ea6de324a3d3a46412ae1af72ab66511433b80e18b00938e2626a82bc70cc05e"),
    Gy: BigInt("0x693f46716eb6bc248876203756c9c7624bea73736ca3984087789c1e05a0c2d73ad3ff1ce67c39c4fdbd132c4ed7c8ad9808795bf230fa14")
  }))();
  var _0n7 = /* @__PURE__ */ BigInt(0);
  var _1n7 = /* @__PURE__ */ BigInt(1);
  var _2n5 = /* @__PURE__ */ BigInt(2);
  var _3n2 = /* @__PURE__ */ BigInt(3);
  var _11n = /* @__PURE__ */ BigInt(11);
  var _22n = /* @__PURE__ */ BigInt(22);
  var _44n = /* @__PURE__ */ BigInt(44);
  var _88n = /* @__PURE__ */ BigInt(88);
  var _223n = /* @__PURE__ */ BigInt(223);
  function ed448_pow_Pminus3div4(x) {
    const P = ed448_CURVE_p;
    const b2 = x * x * x % P;
    const b3 = b2 * b2 * x % P;
    const b6 = pow2(b3, _3n2, P) * b3 % P;
    const b9 = pow2(b6, _3n2, P) * b3 % P;
    const b11 = pow2(b9, _2n5, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b222 = pow2(b220, _2n5, P) * b2 % P;
    const b223 = pow2(b222, _1n7, P) * x % P;
    return pow2(b223, _223n, P) * b222 % P;
  }
  function adjustScalarBytes(bytes) {
    bytes[0] &= 252;
    bytes[55] |= 128;
    bytes[56] = 0;
    return bytes;
  }
  function uvRatio(u, v) {
    const P = ed448_CURVE_p;
    const u2v = mod(u * u * v, P);
    const u3v = mod(u2v * u, P);
    const u5v3 = mod(u3v * u2v * v, P);
    const root = ed448_pow_Pminus3div4(u5v3);
    const x = mod(u3v * root, P);
    const x2 = mod(x * x, P);
    return { isValid: mod(x2 * v, P) === u, value: x };
  }
  var Fp = /* @__PURE__ */ (() => Field(ed448_CURVE_p, { BITS: 456, isLE: true }))();
  var Fn = /* @__PURE__ */ (() => Field(ed448_CURVE.n, { BITS: 456, isLE: true }))();
  var ed448_Point = /* @__PURE__ */ edwards(ed448_CURVE, { Fp, Fn, uvRatio });
  var x448 = /* @__PURE__ */ (() => {
    const P = ed448_CURVE_p;
    const powPminus2 = (x) => {
      const Pminus3div4 = ed448_pow_Pminus3div4(x);
      const Pminus3 = pow2(Pminus3div4, _2n5, P);
      return mod(Pminus3 * x, P);
    };
    return montgomery({
      P,
      type: "x448",
      powPminus2,
      adjustScalarBytes,
      scalarMultBase: (k) => {
        const kn = mod(k, ed448_Point.Fn.ORDER);
        if (kn === _0n7)
          return _0n7;
        const p = ed448_Point.BASE.multiply(kn);
        return mod(p.Y * p.Y * powPminus2(mod(p.X * p.X, P)), P);
      }
    });
  })();

  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class {
    constructor(blockLen, outputLen, padOffset, isLE3) {
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "canXOF", false);
      __publicField(this, "padOffset");
      __publicField(this, "isLE");
      __publicField(this, "buffer");
      __publicField(this, "view");
      __publicField(this, "finished", false);
      __publicField(this, "length", 0);
      __publicField(this, "pos", 0);
      __publicField(this, "destroyed", false);
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE3;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      let processed = false;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          processed = true;
          continue;
        }
        buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
          processed = true;
        }
      }
      this.length += data.length;
      if (processed)
        this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE3 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      buffer.fill(0, pos);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        buffer.fill(0);
      }
      setU64FromNum(view, blockLen - 8, this.length * 8, isLE3);
      this.process(view, 0);
      this.roundClean();
      const oview = out === buffer ? view : createView(out);
      const len = this.outputLen;
      const outLen = len / 4;
      const state = this.get();
      if (len % 4 || outLen > state.length)
        throw new Error("invalid outputLen");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE3);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneIntoMeta(to) {
      const { buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (pos)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]);

  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA2_32B = class extends HashMD {
    constructor(outputLen, IV) {
      super(64, outputLen, 8, false);
      __publicField(this, "A", 0);
      __publicField(this, "B", 0);
      __publicField(this, "C", 0);
      __publicField(this, "D", 0);
      __publicField(this, "E", 0);
      __publicField(this, "F", 0);
      __publicField(this, "G", 0);
      __publicField(this, "H", 0);
      this.A = IV[0] | 0;
      this.B = IV[1] | 0;
      this.C = IV[2] | 0;
      this.D = IV[3] | 0;
      this.E = IV[4] | 0;
      this.F = IV[5] | 0;
      this.G = IV[6] | 0;
      this.H = IV[7] | 0;
    }
    get() {
      const { A, B: B2, C, D, E, F: F2, G, H } = this;
      return [A, B2, C, D, E, F2, G, H];
    }
    set(A, B2, C, D, E, F2, G, H) {
      this.A = A | 0;
      this.B = B2 | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F2 | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    _cloneInto(to) {
      (to || (to = new this.constructor())).set(...this.get());
      return this._cloneIntoMeta(to);
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B: B2, C, D, E, F: F2, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F2, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B2, C) | 0;
        H = G;
        G = F2;
        F2 = E;
        E = D + T1 | 0;
        D = C;
        C = B2;
        B2 = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B2 = B2 + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F2 = F2 + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B2, C, D, E, F2, G, H);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.destroyed = true;
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var _SHA256 = class extends SHA2_32B {
    constructor() {
      super(32, SHA256_IV);
    }
  };
  var K512 = /* @__PURE__ */ (() => split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((n) => BigInt(n))))();
  var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
  var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
  var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
  var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
  var SHA2_64B = class extends HashMD {
    constructor(outputLen, IV) {
      super(128, outputLen, 16, false);
      __publicField(this, "Ah", 0);
      __publicField(this, "Al", 0);
      __publicField(this, "Bh", 0);
      __publicField(this, "Bl", 0);
      __publicField(this, "Ch", 0);
      __publicField(this, "Cl", 0);
      __publicField(this, "Dh", 0);
      __publicField(this, "Dl", 0);
      __publicField(this, "Eh", 0);
      __publicField(this, "El", 0);
      __publicField(this, "Fh", 0);
      __publicField(this, "Fl", 0);
      __publicField(this, "Gh", 0);
      __publicField(this, "Gl", 0);
      __publicField(this, "Hh", 0);
      __publicField(this, "Hl", 0);
      this.Ah = IV[0] | 0;
      this.Al = IV[1] | 0;
      this.Bh = IV[2] | 0;
      this.Bl = IV[3] | 0;
      this.Ch = IV[4] | 0;
      this.Cl = IV[5] | 0;
      this.Dh = IV[6] | 0;
      this.Dl = IV[7] | 0;
      this.Eh = IV[8] | 0;
      this.El = IV[9] | 0;
      this.Fh = IV[10] | 0;
      this.Fl = IV[11] | 0;
      this.Gh = IV[12] | 0;
      this.Gl = IV[13] | 0;
      this.Hh = IV[14] | 0;
      this.Hl = IV[15] | 0;
    }
    get() {
      const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
      this.Ah = Ah | 0;
      this.Al = Al | 0;
      this.Bh = Bh | 0;
      this.Bl = Bl | 0;
      this.Ch = Ch | 0;
      this.Cl = Cl | 0;
      this.Dh = Dh | 0;
      this.Dl = Dl | 0;
      this.Eh = Eh | 0;
      this.El = El | 0;
      this.Fh = Fh | 0;
      this.Fl = Fl | 0;
      this.Gh = Gh | 0;
      this.Gl = Gl | 0;
      this.Hh = Hh | 0;
      this.Hl = Hl | 0;
    }
    _cloneInto(to) {
      (to || (to = new this.constructor())).set(...this.get());
      return this._cloneIntoMeta(to);
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4) {
        SHA512_W_H[i] = view.getUint32(offset);
        SHA512_W_L[i] = view.getUint32(offset += 4);
      }
      for (let i = 16; i < 80; i++) {
        const W15h = SHA512_W_H[i - 15] | 0;
        const W15l = SHA512_W_L[i - 15] | 0;
        const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
        const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
        const W2h = SHA512_W_H[i - 2] | 0;
        const W2l = SHA512_W_L[i - 2] | 0;
        const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
        const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
        const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
        const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
        SHA512_W_H[i] = SUMh | 0;
        SHA512_W_L[i] = SUMl | 0;
      }
      let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      for (let i = 0; i < 80; i++) {
        const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
        const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
        const CHIh = Eh & Fh ^ ~Eh & Gh;
        const CHIl = El & Fl ^ ~El & Gl;
        const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
        const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
        const T1l = T1ll | 0;
        const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
        const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
        const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
        const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
        Hh = Gh | 0;
        Hl = Gl | 0;
        Gh = Fh | 0;
        Gl = Fl | 0;
        Fh = Eh | 0;
        Fl = El | 0;
        ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
        Dh = Ch | 0;
        Dl = Cl | 0;
        Ch = Bh | 0;
        Cl = Bl | 0;
        Bh = Ah | 0;
        Bl = Al | 0;
        const All = add3L(T1l, sigma0l, MAJl);
        Ah = add3H(All, T1h, sigma0h, MAJh);
        Al = All | 0;
      }
      ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
      ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
      ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
      ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
      ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
      ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
      ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
      ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
      this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
      clean(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  var _SHA512 = class extends SHA2_64B {
    constructor() {
      super(64, SHA512_IV);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(
    () => new _SHA256(),
    /* @__PURE__ */ oidNist(1)
  );
  var sha512 = /* @__PURE__ */ createHasher(
    () => new _SHA512(),
    /* @__PURE__ */ oidNist(3)
  );

  var _HMAC = class {
    constructor(hash, key) {
      __publicField(this, "oHash");
      __publicField(this, "iHash");
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "canXOF", false);
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      ahash(hash);
      abytes(key, void 0, "key");
      this.iHash = hash.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("expected Hash instance");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      clean(pad);
    }
    update(buf) {
      aexists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const buf = out.subarray(0, this.outputLen);
      this.iHash.digestInto(buf);
      this.oHash.update(buf);
      this.oHash.digestInto(buf);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen, canXOF } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.canXOF = canXOF;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = /* @__PURE__ */ (() => {
    const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
    hmac_.create = (hash, key) => new _HMAC(hash, key);
    return hmac_;
  })();

  var divNearest = (num2, den) => (num2 + (num2 >= 0 ? den : -den) / _2n6) / den;
  function _splitEndoScalar(k, basis, n) {
    aInRange("scalar", k, _0n8, n);
    const [[a1, b1], [a2, b2]] = basis;
    const c1 = divNearest(b2 * k, n);
    const c2 = divNearest(-b1 * k, n);
    let k1 = k - c1 * a1 - c2 * a2;
    let k2 = -c1 * b1 - c2 * b2;
    const k1neg = k1 < _0n8;
    const k2neg = k2 < _0n8;
    if (k1neg)
      k1 = -k1;
    if (k2neg)
      k2 = -k2;
    const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n8;
    if (k1 < _0n8 || k1 >= MAX_NUM || k2 < _0n8 || k2 >= MAX_NUM) {
      throw new Error("splitScalar (endomorphism): failed for k");
    }
    return { k1neg, k1, k2neg, k2 };
  }
  var _0n8 = /* @__PURE__ */ BigInt(0);
  var _1n8 = /* @__PURE__ */ BigInt(1);
  var _2n6 = /* @__PURE__ */ BigInt(2);
  var _3n3 = /* @__PURE__ */ BigInt(3);
  var _4n4 = /* @__PURE__ */ BigInt(4);
  function weierstrass(params, extraOpts = {}) {
    const validated = createCurveFields("weierstrass", params, extraOpts);
    const Fp2 = validated.Fp;
    const Fn2 = validated.Fn;
    let CURVE = validated.CURVE;
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    validateObject(extraOpts, {}, {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
      randomBytes: "function"
    });
    const { endo: endoOpts, allowInfinityPoint, clearCofactor, isTorsionFree, fromBytes, toBytes } = extraOpts;
    const randomBytes5 = extraOpts.randomBytes === void 0 ? randomBytes2 : extraOpts.randomBytes;
    if (endoOpts) {
      if (!Fp2.is0(CURVE.a) || typeof endoOpts.beta !== "bigint" || !Array.isArray(endoOpts.basises)) {
        throw new Error('invalid endo: expected "beta": bigint and "basises": array');
      }
    }
    const endo = endoOpts ? {
      beta: endoOpts.beta,
      basises: endoOpts.basises.map((basis) => [...basis])
    } : void 0;
    const lengths = getWLengths(Fp2, Fn2);
    function assertCompressionIsSupported() {
      if (!Fp2.isOdd)
        throw new Error("compression is not supported: Field does not have .isOdd()");
    }
    function pointToBytes2(_c, point, isCompressed) {
      if (point.is0()) {
        if (!allowInfinityPoint)
          throw new Error("bad point: ZERO");
        return Uint8Array.of(0);
      }
      const { x, y } = point.toAffine();
      const bx = Fp2.toBytes(x);
      abool2(isCompressed, "isCompressed");
      if (isCompressed) {
        assertCompressionIsSupported();
        const hasEvenY = !Fp2.isOdd(y);
        return concatBytes2(pprefix(hasEvenY), bx);
      } else {
        return concatBytes2(Uint8Array.of(4), bx, Fp2.toBytes(y));
      }
    }
    function pointFromBytes(bytes) {
      abytes2(bytes, void 0, "Point");
      const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
      const length = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (allowInfinityPoint && length === 1 && head === 0)
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      if (length === comp && (head === 2 || head === 3)) {
        const x = Fp2.fromBytes(tail);
        if (!Fp2.isValid(x))
          throw new Error("bad point: is not on curve, wrong x");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp2.sqrt(y2);
        } catch (sqrtError) {
          const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("bad point: is not on curve, sqrt error" + err);
        }
        assertCompressionIsSupported();
        const evenY = Fp2.isOdd(y);
        const evenH = (head & 1) === 1;
        if (evenH !== evenY)
          y = Fp2.neg(y);
        return { x, y };
      } else if (length === uncomp && head === 4) {
        const L = Fp2.BYTES;
        const x = Fp2.fromBytes(tail.subarray(0, L));
        const y = Fp2.fromBytes(tail.subarray(L, L * 2));
        if (!isValidXY(x, y))
          throw new Error("bad point: is not on curve");
        return { x, y };
      } else {
        throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
      }
    }
    const encodePoint = toBytes === void 0 ? pointToBytes2 : toBytes;
    const decodePoint = fromBytes === void 0 ? pointFromBytes : fromBytes;
    const b3 = Fp2.mul(CURVE.b, _3n3);
    const mulA = Fp2.is0(CURVE.a) ? (_) => Fp2.ZERO : (x) => Fp2.mul(CURVE.a, x);
    function weierstrassEquation(x) {
      const x2 = Fp2.sqr(x);
      const x3 = Fp2.mul(x2, x);
      return Fp2.add(Fp2.add(x3, Fp2.mul(x, CURVE.a)), CURVE.b);
    }
    function isValidXY(x, y) {
      const left = Fp2.sqr(y);
      const right = weierstrassEquation(x);
      return Fp2.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp2.mul(Fp2.pow(CURVE.a, _3n3), _4n4);
    const _27b2 = Fp2.mul(Fp2.sqr(CURVE.b), BigInt(27));
    if (Fp2.is0(Fp2.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function acoord(title, n, banZero = false) {
      if (!Fp2.isValid(n) || banZero && Fp2.is0(n))
        throw new Error(`bad point coordinate ${title}`);
      return typeof n === "object" && n !== null ? Fp2.create(n) : n;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point))
        throw new Error("Weierstrass Point expected");
    }
    function splitEndoScalarN(k) {
      if (!endo || !endo.basises)
        throw new Error("no endo");
      return _splitEndoScalar(k, endo.basises, Fn2.ORDER);
    }
    function pushWnafPair(points, scalars, p, k) {
      if (!Fn2.isValid(k))
        throw new RangeError("invalid scalar: out of range");
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(k);
        const psi = new Point(Fp2.mul(p.X, endo.beta), p.Y, p.Z);
        points.push(k1neg ? p.negate() : p, k2neg ? psi.negate() : psi);
        scalars.push(k1, k2);
      } else {
        points.push(p);
        scalars.push(k);
      }
    }
    const validityCache = /* @__PURE__ */ new WeakSet();
    const _Point = class _Point {
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      constructor(X, Y, Z) {
        __publicField(this, "X");
        __publicField(this, "Y");
        __publicField(this, "Z");
        this.X = acoord("x", X);
        this.Y = acoord("y", Y, true);
        this.Z = acoord("z", Z);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp2.isValid(x) || !Fp2.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof _Point)
          throw new Error("projective point not allowed");
        if (Fp2.is0(x) && Fp2.is0(y))
          return _Point.ZERO;
        return new _Point(x, y, Fp2.ONE);
      }
      static fromBytes(bytes) {
        const P = _Point.fromAffine(decodePoint(abytes2(bytes, void 0, "point")));
        P.assertValidity();
        return P;
      }
      static fromHex(hex) {
        return _Point.fromBytes(hexToBytes2(hex));
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * @param isLazy - true will defer table computation until the first multiplication
       */
      precompute(windowSize = 6, isLazy = true) {
        wnaf.setWindowSize(this, windowSize);
        if (!isLazy)
          this.multiply(_3n3);
        return this;
      }
      /** A point on curve is valid if it conforms to equation. */
      assertValidity() {
        const p = this;
        if (p.is0()) {
          if (allowInfinityPoint && Fp2.is0(p.X) && Fp2.eql(p.Y, Fp2.ONE) && Fp2.is0(p.Z))
            return;
          throw new Error("bad point: ZERO");
        }
        if (validityCache.has(p))
          return;
        const { x, y } = p.toAffine();
        if (!Fp2.isValid(x) || !Fp2.isValid(y))
          throw new Error("bad point: x or y not field elements");
        if (!isValidXY(x, y))
          throw new Error("bad point: equation left != right");
        if (!p.isTorsionFree())
          throw new Error("bad point: not in prime-order subgroup");
        validityCache.add(p);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (!Fp2.isOdd)
          throw new Error("Field doesn't support isOdd");
        return !Fp2.isOdd(y);
      }
      /** Compare one point to another. */
      equals(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const U1 = Fp2.eql(Fp2.mul(X1, Z2), Fp2.mul(X2, Z1));
        const U2 = Fp2.eql(Fp2.mul(Y1, Z2), Fp2.mul(Y2, Z1));
        return U1 && U2;
      }
      /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
      negate() {
        return new _Point(this.X, Fp2.neg(this.Y), this.Z);
      }
      double() {
        const { X: X1, Y: Y1, Z: Z1 } = this;
        let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
        let t0 = Fp2.mul(X1, X1);
        let t1 = Fp2.mul(Y1, Y1);
        let t2 = Fp2.mul(Z1, Z1);
        let t3 = Fp2.mul(X1, Y1);
        t3 = Fp2.add(t3, t3);
        Z3 = Fp2.mul(X1, Z1);
        Z3 = Fp2.add(Z3, Z3);
        X3 = mulA(Z3);
        Y3 = Fp2.mul(b3, t2);
        Y3 = Fp2.add(X3, Y3);
        X3 = Fp2.sub(t1, Y3);
        Y3 = Fp2.add(t1, Y3);
        Y3 = Fp2.mul(X3, Y3);
        X3 = Fp2.mul(t3, X3);
        Z3 = Fp2.mul(b3, Z3);
        t2 = mulA(t2);
        t3 = Fp2.sub(t0, t2);
        t3 = mulA(t3);
        t3 = Fp2.add(t3, Z3);
        Z3 = Fp2.add(t0, t0);
        t0 = Fp2.add(Z3, t0);
        t0 = Fp2.add(t0, t2);
        t0 = Fp2.mul(t0, t3);
        Y3 = Fp2.add(Y3, t0);
        t2 = Fp2.mul(Y1, Z1);
        t2 = Fp2.add(t2, t2);
        t0 = Fp2.mul(t2, t3);
        X3 = Fp2.sub(X3, t0);
        Z3 = Fp2.mul(t2, t1);
        Z3 = Fp2.add(Z3, Z3);
        Z3 = Fp2.add(Z3, Z3);
        return new _Point(X3, Y3, Z3);
      }
      add(other) {
        aprjpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
        let t0 = Fp2.mul(X1, X2);
        let t1 = Fp2.mul(Y1, Y2);
        let t2 = Fp2.mul(Z1, Z2);
        let t3 = Fp2.add(X1, Y1);
        let t4 = Fp2.add(X2, Y2);
        t3 = Fp2.mul(t3, t4);
        t4 = Fp2.add(t0, t1);
        t3 = Fp2.sub(t3, t4);
        t4 = Fp2.add(X1, Z1);
        let t5 = Fp2.add(X2, Z2);
        t4 = Fp2.mul(t4, t5);
        t5 = Fp2.add(t0, t2);
        t4 = Fp2.sub(t4, t5);
        t5 = Fp2.add(Y1, Z1);
        X3 = Fp2.add(Y2, Z2);
        t5 = Fp2.mul(t5, X3);
        X3 = Fp2.add(t1, t2);
        t5 = Fp2.sub(t5, X3);
        Z3 = mulA(t4);
        X3 = Fp2.mul(b3, t2);
        Z3 = Fp2.add(X3, Z3);
        X3 = Fp2.sub(t1, Z3);
        Z3 = Fp2.add(t1, Z3);
        Y3 = Fp2.mul(X3, Z3);
        t1 = Fp2.add(t0, t0);
        t1 = Fp2.add(t1, t0);
        t2 = mulA(t2);
        t4 = Fp2.mul(b3, t4);
        t1 = Fp2.add(t1, t2);
        t2 = Fp2.sub(t0, t2);
        t2 = mulA(t2);
        t4 = Fp2.add(t4, t2);
        t0 = Fp2.mul(t1, t4);
        Y3 = Fp2.add(Y3, t0);
        t0 = Fp2.mul(t5, t4);
        X3 = Fp2.mul(t3, X3);
        X3 = Fp2.sub(X3, t0);
        t0 = Fp2.mul(t3, t1);
        Z3 = Fp2.mul(t5, Z3);
        Z3 = Fp2.add(Z3, t0);
        return new _Point(X3, Y3, Z3);
      }
      subtract(other) {
        aprjpoint(other);
        return this.add(other.negate());
      }
      is0() {
        return this.equals(_Point.ZERO);
      }
      /**
       * Constant time multiplication.
       * Uses precomputed tables (signed fixed-window wNAF) when available.
       * Uses scalar blinding and avoids endomorphism splitting in the secret-scalar path.
       * @param scalar - by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        if (!Fn2.isValidNot0(scalar))
          throw new RangeError("invalid scalar: out of range");
        const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize);
        return normalize([p, f])[0];
      }
      /**
       * Non-constant-time multiplication. Uses width-4 wNAF with GLV endomorphism splitting
       * when available (two half-width scalars sharing one halved doubling chain).
       * It's faster, but should only be used when you don't care about
       * an exposed secret key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(scalar) {
        const p = this;
        const sc = scalar;
        if (!Fn2.isValid(sc))
          throw new RangeError("invalid scalar: out of range");
        if (sc === _0n8 || p.is0())
          return _Point.ZERO;
        if (sc === _1n8)
          return p;
        if (wnaf.hasWindowSize(this))
          return wnaf.mulUnsafe(p, sc, normalize);
        const points = [];
        const scalars = [];
        pushWnafPair(points, scalars, p, sc);
        return mulAddUnsafe(_Point, points, scalars);
      }
      /**
       * Non-constant-time double-scalar multiplication `a⋅this + b⋅other` (Strauss–Shamir).
       * Both walks share one doubling chain via {@link mulAddUnsafe}, and GLV endomorphism
       * (when available) halves the chain again by splitting each scalar into two half-width
       * parts. Used by ECDSA verification and public-key recovery for `R = u1⋅G + u2⋅P`.
       * Only for public scalars.
       */
      mulAddUnsafe(a, other, b) {
        aprjpoint(other);
        const points = [];
        const scalars = [];
        pushWnafPair(points, scalars, this, a);
        pushWnafPair(points, scalars, other, b);
        return mulAddUnsafe(_Point, points, scalars);
      }
      /**
       * Converts Projective point to affine (x, y) coordinates.
       * (X, Y, Z) ∋ (x=X/Z, y=Y/Z).
       * @param invertedZ - Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
       */
      toAffine(invertedZ) {
        const p = this;
        let iz = invertedZ;
        if (iz != null && !Fp2.isValid(iz))
          throw new RangeError('"invertedZ" expected valid field element');
        const { X, Y, Z } = p;
        if (Fp2.eql(Z, Fp2.ONE))
          return { x: X, y: Y };
        const is0 = p.is0();
        if (iz == null)
          iz = is0 ? Fp2.ONE : Fp2.inv(Z);
        const x = Fp2.mul(X, iz);
        const y = Fp2.mul(Y, iz);
        const zz = Fp2.mul(Z, iz);
        if (is0)
          return { x: Fp2.ZERO, y: Fp2.ZERO };
        if (!Fp2.eql(zz, Fp2.ONE))
          throw new Error("invZ was invalid");
        return { x, y };
      }
      /**
       * Checks whether Point is free of torsion elements (is in prime subgroup).
       * Always torsion-free for cofactor=1 curves.
       */
      isTorsionFree() {
        if (cofactor === _1n8)
          return true;
        if (isTorsionFree)
          return isTorsionFree(_Point, this);
        return wnaf.mulUnsafe(this, CURVE_ORDER).is0();
      }
      clearCofactor() {
        if (cofactor === _1n8)
          return this;
        if (clearCofactor)
          return clearCofactor(_Point, this);
        return this.multiplyUnsafe(cofactor);
      }
      isSmallOrder() {
        if (cofactor === _1n8)
          return this.is0();
        return this.clearCofactor().is0();
      }
      toBytes(isCompressed = true) {
        abool2(isCompressed, "isCompressed");
        this.assertValidity();
        return encodePoint(_Point, this, isCompressed);
      }
      toHex(isCompressed = true) {
        return bytesToHex2(this.toBytes(isCompressed));
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    };
    __publicField(_Point, "BASE", new _Point(CURVE.Gx, CURVE.Gy, Fp2.ONE));
    __publicField(_Point, "ZERO", new _Point(Fp2.ZERO, Fp2.ONE, Fp2.ZERO));
    __publicField(_Point, "Fp", Fp2);
    __publicField(_Point, "Fn", Fn2);
    let Point = _Point;
    const normalize = (points) => normalizeZ(Point, points);
    const wnaf = new ScalarMultiplier(Point, randomBytes5);
    if (wnaf.bits >= 6)
      Point.BASE.precompute(6);
    Object.freeze(Point.prototype);
    Object.freeze(Point);
    return Point;
  }
  function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 2 : 3);
  }
  function getWLengths(Fp2, Fn2) {
    return {
      secretKey: Fn2.BYTES,
      publicKey: 1 + Fp2.BYTES,
      publicKeyUncompressed: 1 + 2 * Fp2.BYTES,
      publicKeyHasPrefix: true,
      signature: 2 * Fn2.BYTES
    };
  }

  var secp256k1_CURVE = {
    p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
    n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
    h: BigInt(1),
    a: BigInt(0),
    b: BigInt(7),
    Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
    Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
  };
  var secp256k1_ENDO = {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    basises: [
      [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
      [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
    ]
  };
  var _0n9 = /* @__PURE__ */ BigInt(0);
  var _2n7 = /* @__PURE__ */ BigInt(2);
  function sqrtMod(y) {
    const P = secp256k1_CURVE.p;
    const _3n4 = BigInt(3), _6n = BigInt(6), _11n2 = BigInt(11), _22n2 = BigInt(22);
    const _23n = BigInt(23), _44n2 = BigInt(44), _88n2 = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n4, P) * b3 % P;
    const b9 = pow2(b6, _3n4, P) * b3 % P;
    const b11 = pow2(b9, _2n7, P) * b2 % P;
    const b22 = pow2(b11, _11n2, P) * b11 % P;
    const b44 = pow2(b22, _22n2, P) * b22 % P;
    const b88 = pow2(b44, _44n2, P) * b44 % P;
    const b176 = pow2(b88, _88n2, P) * b88 % P;
    const b220 = pow2(b176, _44n2, P) * b44 % P;
    const b223 = pow2(b220, _3n4, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n7, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  var Fpk1 = /* @__PURE__ */ Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
  var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
    Fp: Fpk1,
    endo: secp256k1_ENDO
  });
  var TAGGED_HASH_PREFIXES = /* @__PURE__ */ Object.create(null);
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(asciiToBytes(tag));
      tagP = concatBytes2(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes2(tagP, ...messages));
  }
  var pointToBytes = (point) => point.toBytes(true).slice(1);
  var affineXToBytes = ({ x }) => Fpk1.toBytes(x);
  var hasEven = (y) => !Fpk1.isOdd(y);
  function schnorrGetExtPubKey(priv) {
    const { Fn: Fn2, BASE } = Pointk1;
    const d_ = Fn2.fromBytes(abytes2(priv, 32, "secretKey"));
    const p = BASE.multiply(d_);
    const affine = p.toAffine();
    const scalar = hasEven(affine.y) ? d_ : Fn2.neg(d_);
    return { scalar, bytes: affineXToBytes(affine) };
  }
  function lift_x(x) {
    const Fp2 = Fpk1;
    if (!Fp2.isValidNot0(x))
      throw new Error("invalid x: Fail if x ≥ p");
    const xx = Fp2.sqr(x);
    const c = Fp2.add(Fp2.mulN(xx, x), BigInt(7));
    let y = Fp2.sqrt(c);
    if (!hasEven(y))
      y = Fp2.neg(y);
    const p = Pointk1.fromAffine({ x, y });
    p.assertValidity();
    return p;
  }
  var num = bytesToNumberBE;
  function challenge(...args) {
    return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
  }
  function schnorrGetPublicKey(secretKey) {
    return schnorrGetExtPubKey(secretKey).bytes;
  }
  function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
    const { Fn: Fn2, BASE } = Pointk1;
    const m = copyBytes(abytes2(message, void 0, "message"));
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
    const a = abytes2(auxRand, 32, "auxRand");
    const t = Fn2.toBytes(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const k_ = Fn2.create(num(rand));
    if (k_ === _0n9)
      throw new Error("sign failed: k is zero");
    const p = BASE.multiply(k_);
    const affine = p.toAffine();
    const k = hasEven(affine.y) ? k_ : Fn2.neg(k_);
    const rx = affineXToBytes(affine);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(Fn2.toBytes(Fn2.create(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const { Fp: Fp2, Fn: Fn2, BASE } = Pointk1;
    const sig = abytes2(signature, 64, "signature");
    const m = abytes2(message, void 0, "message");
    const pub = abytes2(publicKey, 32, "publicKey");
    try {
      const P = lift_x(num(pub));
      const rBytes = sig.subarray(0, 32);
      const r = num(rBytes);
      if (!Fp2.isValidNot0(r))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!Fn2.isValidNot0(s))
        return false;
      const e = challenge(rBytes, pointToBytes(P), m);
      const R = BASE.mulAddUnsafe(s, P, Fn2.neg(e));
      const { x, y } = R.toAffine();
      if (R.is0() || !hasEven(y) || !Fp2.eql(x, r))
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  var schnorr = /* @__PURE__ */ (() => {
    const size = 32;
    const seedLength = 48;
    const randomSecretKey = (seed) => {
      seed = seed === void 0 ? randomBytes(seedLength) : seed;
      return mapHashToField(abytes2(seed, seedLength, "seed"), secp256k1_CURVE.n);
    };
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
      getPublicKey: schnorrGetPublicKey,
      sign: schnorrSign,
      verify: schnorrVerify,
      Point: Pointk1,
      utils: Object.freeze({
        randomSecretKey,
        taggedHash,
        lift_x,
        pointToBytes
      }),
      lengths: Object.freeze({
        secretKey: size,
        publicKey: size,
        publicKeyHasPrefix: false,
        signature: size * 2,
        seed: seedLength
      })
    });
  })();

  var abytesDoc = abytes;
  var randomBytes3 = randomBytes;
  function aarray2(item, title, inner = () => {
  }) {
    if (!Array.isArray(item))
      throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
    for (let i = 0; i < item.length; i++)
      inner(item[i], `${title}[${i}]`);
    return item;
  }
  function equalBytes(a, b) {
    a = abytes(a);
    b = abytes(b);
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function copyBytes2(bytes) {
    return new Uint8Array(abytes(bytes));
  }
  function splitCoder(label, ...lengths) {
    const getLength = (c) => typeof c === "number" ? c : c.bytesLen;
    const bytesLen = lengths.reduce((sum, a) => sum + getLength(a), 0);
    return {
      bytesLen,
      encode: (bufs) => {
        const res = new Uint8Array(bytesLen);
        for (let i = 0, pos = 0; i < lengths.length; i++) {
          const c = lengths[i];
          const l = getLength(c);
          const b = typeof c === "number" ? bufs[i] : c.encode(bufs[i]);
          abytes(b, l, label);
          res.set(b, pos);
          if (typeof c !== "number")
            b.fill(0);
          pos += l;
        }
        return res;
      },
      decode: (buf) => {
        abytes(buf, bytesLen, label);
        const res = [];
        for (const c of lengths) {
          const l = getLength(c);
          const b = buf.subarray(0, l);
          res.push(typeof c === "number" ? b : c.decode(b));
          buf = buf.subarray(l);
        }
        return res;
      }
    };
  }
  function vecCoder(c, vecLen) {
    const coder = c;
    const bytesLen = vecLen * coder.bytesLen;
    return {
      bytesLen,
      encode: (u) => {
        const uArr = aarray2(u, "u");
        if (uArr.length !== vecLen)
          throw new RangeError(`vecCoder.encode: wrong length=${uArr.length}. Expected: ${vecLen}`);
        const res = new Uint8Array(bytesLen);
        for (let i = 0, pos = 0; i < uArr.length; i++) {
          const b = coder.encode(uArr[i]);
          res.set(b, pos);
          b.fill(0);
          pos += b.length;
        }
        return res;
      },
      decode: (a) => {
        abytes(a, bytesLen);
        const r = [];
        for (let i = 0; i < a.length; i += coder.bytesLen)
          r.push(coder.decode(a.subarray(i, i + coder.bytesLen)));
        return r;
      }
    };
  }
  function cleanBytes(...list) {
    for (const t of list) {
      if (Array.isArray(t))
        for (const b of t)
          b.fill(0);
      else
        t.fill(0);
    }
  }
  function getMask(bits) {
    anumber(bits, "bits");
    if (bits > 32)
      throw new RangeError('"bits" expected <= 32, got ' + bits);
    return bits === 32 ? 4294967295 : ~(-1 << bits) >>> 0;
  }

  var genCrystals = (opts2) => {
    const { newPoly, N: N2, Q: Q2, F: F2, ROOT_OF_UNITY: ROOT_OF_UNITY2, brvBits, isKyber } = opts2;
    const mod2 = (a, modulo = Q2) => {
      const result = a % modulo | 0;
      return (result >= 0 ? result | 0 : modulo + result | 0) | 0;
    };
    const smod = (a, modulo = Q2) => {
      const r = mod2(a, modulo) | 0;
      return (r > modulo >> 1 ? r - modulo | 0 : r) | 0;
    };
    function getZettas() {
      const out = newPoly(N2);
      for (let i = 0; i < N2; i++) {
        const b = reverseBits(i, brvBits);
        const p = BigInt(ROOT_OF_UNITY2) ** BigInt(b) % BigInt(Q2);
        out[i] = Number(p) | 0;
      }
      return out;
    }
    const nttZetas = getZettas();
    const inv = (_a) => {
      throw new Error("not implemented");
    };
    const field = isKyber ? {
      add: (a, b) => {
        const r = a + b | 0;
        return r >= Q2 ? r - Q2 | 0 : r;
      },
      sub: (a, b) => {
        const r = a - b | 0;
        return r < 0 ? r + Q2 | 0 : r;
      },
      mul: (a, b) => mod2((a | 0) * (b | 0)) | 0,
      inv
    } : {
      add: (a, b) => mod2((a | 0) + (b | 0)) | 0,
      sub: (a, b) => mod2((a | 0) - (b | 0)) | 0,
      mul: (a, b) => mod2((a | 0) * (b | 0)) | 0,
      inv
    };
    const nttOpts = {
      N: N2,
      roots: nttZetas,
      invertButterflies: true,
      skipStages: isKyber ? 1 : 0,
      brp: false
    };
    const dif = FFTCore(field, { dit: false, ...nttOpts });
    const dit = FFTCore(field, { dit: true, ...nttOpts });
    const NTT = {
      encode: (r) => {
        return dif(r);
      },
      decode: (r) => {
        dit(r);
        for (let i = 0; i < r.length; i++)
          r[i] = mod2(F2 * r[i]);
        return r;
      }
    };
    const bitsCoder = (d, c) => {
      for (let i = 0, bufLen = 0; i < N2; i++) {
        bufLen += d;
        if (bufLen > 32)
          getMask(bufLen);
        bufLen %= 8;
      }
      const mask = getMask(d);
      const bytesLen = d * (N2 / 8);
      return {
        bytesLen,
        encode: (poly_) => {
          const poly = poly_;
          const r = new Uint8Array(bytesLen);
          for (let i = 0, buf = 0, bufLen = 0, pos = 0; i < poly.length; i++) {
            buf |= (c.encode(poly[i]) & mask) << bufLen;
            bufLen += d;
            for (; bufLen >= 8; bufLen -= 8, buf >>= 8)
              r[pos++] = buf & 255;
          }
          return r;
        },
        decode: (bytes) => {
          const r = newPoly(N2);
          for (let i = 0, buf = 0, bufLen = 0, pos = 0; i < bytes.length; i++) {
            buf |= bytes[i] << bufLen;
            bufLen += 8;
            for (; bufLen >= d; bufLen -= d, buf >>= d)
              r[pos++] = c.decode(buf & mask);
          }
          return r;
        }
      };
    };
    return {
      mod: mod2,
      smod,
      nttZetas,
      NTT: {
        encode: (r) => NTT.encode(r),
        decode: (r) => NTT.decode(r)
      },
      bitsCoder
    };
  };
  var createXofShake = (shake) => (seed, blockLen) => {
    if (!blockLen)
      blockLen = shake.blockLen;
    const _seed = new Uint8Array(seed.length + 2);
    _seed.set(seed);
    const seedLen = seed.length;
    const buf = new Uint8Array(blockLen);
    let h = shake.create({});
    let calls = 0;
    let xofs = 0;
    return {
      stats: () => ({ calls, xofs }),
      get: (x, y) => {
        _seed[seedLen + 0] = x;
        _seed[seedLen + 1] = y;
        h.destroy();
        h = shake.create({}).update(_seed);
        calls++;
        return () => {
          xofs++;
          return h.xofInto(buf);
        };
      },
      clean: () => {
        h.destroy();
        cleanBytes(buf, _seed);
      }
    };
  };
  var XOF128 = /* @__PURE__ */ createXofShake(shake128);

  var N = 256;
  var Q = 3329;
  var F = 3303;
  var ROOT_OF_UNITY = 17;
  var crystals = /* @__PURE__ */ genCrystals({
    N,
    Q,
    F,
    ROOT_OF_UNITY,
    newPoly: (n) => new Uint16Array(n),
    brvBits: 7,
    isKyber: true
  });
  var PARAMS = /* @__PURE__ */ (() => Object.freeze({
    512: Object.freeze({ N, Q, K: 2, ETA1: 3, ETA2: 2, du: 10, dv: 4, RBGstrength: 128 }),
    768: Object.freeze({ N, Q, K: 3, ETA1: 2, ETA2: 2, du: 10, dv: 4, RBGstrength: 192 }),
    1024: Object.freeze({ N, Q, K: 4, ETA1: 2, ETA2: 2, du: 11, dv: 5, RBGstrength: 256 })
  }))();
  var compress = (d) => {
    if (d >= 12)
      return { encode: (i) => i, decode: (i) => i >= Q ? i - Q : i };
    const a = 2 ** (d - 1);
    return {
      encode: (i) => ((i << d) + Q / 2) / Q,
      decode: (i) => i * Q + a >>> d
    };
  };
  var byteCoder = (d) => crystals.bitsCoder(d, d === 12 ? { encode: (i) => i, decode: (i) => i >= Q ? i - Q : i } : { encode: (i) => i, decode: (i) => i });
  var polyCoder = (d) => d === 12 ? byteCoder(12) : crystals.bitsCoder(d, compress(d));
  function polyAdd(a_, b_) {
    const a = a_;
    const b = b_;
    for (let i = 0; i < N; i++) {
      const r = a[i] + b[i];
      a[i] = r >= Q ? r - Q : r;
    }
  }
  function polySub(a_, b_) {
    const a = a_;
    const b = b_;
    for (let i = 0; i < N; i++) {
      const r = a[i] - b[i];
      a[i] = r < 0 ? r + Q : r;
    }
  }
  function BaseCaseMultiply(a0, a1, b0, b1, zeta) {
    const c0 = crystals.mod(crystals.mod(a1 * b1) * zeta + a0 * b0);
    const c1 = crystals.mod(a0 * b1 + a1 * b0);
    return { c0, c1 };
  }
  function MultiplyNTTs(f_, g_) {
    const f = f_;
    const g = g_;
    for (let i = 0; i < N / 2; i++) {
      let z = crystals.nttZetas[64 + (i >> 1)];
      if (i & 1)
        z = -z;
      const { c0, c1 } = BaseCaseMultiply(f[2 * i + 0], f[2 * i + 1], g[2 * i + 0], g[2 * i + 1], z);
      f[2 * i + 0] = c0;
      f[2 * i + 1] = c1;
    }
    return f;
  }
  function SampleNTT(xof_) {
    const xof = xof_;
    const r = new Uint16Array(N);
    for (let j = 0; j < N; ) {
      const b = xof();
      if (b.length % 3)
        throw new Error("SampleNTT: unaligned block");
      for (let i = 0; j < N && i + 3 <= b.length; i += 3) {
        const d1 = (b[i + 0] >> 0 | b[i + 1] << 8) & 4095;
        const d2 = (b[i + 1] >> 4 | b[i + 2] << 4) & 4095;
        if (d1 < Q)
          r[j++] = d1;
        if (j < N && d2 < Q)
          r[j++] = d2;
      }
    }
    return r;
  }
  var sampleCBDBytes = (buf, eta) => {
    const r = new Uint16Array(N);
    const b32 = u32(buf);
    swap32IfBE(b32);
    let len = 0;
    for (let i = 0, p = 0, bb = 0, t0 = 0; i < b32.length; i++) {
      let b = b32[i];
      for (let j = 0; j < 32; j++) {
        bb += b & 1;
        b >>= 1;
        len += 1;
        if (len === eta) {
          t0 = bb;
          bb = 0;
        } else if (len === 2 * eta) {
          r[p++] = crystals.mod(t0 - bb);
          bb = 0;
          len = 0;
        }
      }
    }
    swap32IfBE(b32);
    if (len)
      throw new Error(`sampleCBD: leftover bits: ${len}`);
    return r;
  };
  function sampleCBD(PRF_, seed, nonce, eta) {
    const PRF = PRF_;
    return sampleCBDBytes(PRF(eta * N / 4, seed, nonce), eta);
  }
  var genKPKE = (opts_) => {
    const opts2 = opts_;
    const { K, PRF, XOF, HASH512, ETA1, ETA2, du, dv } = opts2;
    const poly1 = polyCoder(1);
    const polyV = polyCoder(dv);
    const polyU = polyCoder(du);
    const publicCoder = splitCoder("publicKey", vecCoder(polyCoder(12), K), 32);
    const secretCoder = vecCoder(polyCoder(12), K);
    const cipherCoder = splitCoder("ciphertext", vecCoder(polyU, K), polyV);
    const seedCoder = splitCoder("seed", 32, 32);
    const encryptCore = (tHat, getA, msg, seed) => {
      const rHat = [];
      for (let i = 0; i < K; i++)
        rHat.push(crystals.NTT.encode(sampleCBD(PRF, seed, i, ETA1)));
      const tmp2 = new Uint16Array(N);
      const u = [];
      for (let i = 0; i < K; i++) {
        const e1 = sampleCBD(PRF, seed, K + i, ETA2);
        const tmp = new Uint16Array(N);
        for (let j = 0; j < K; j++) {
          const aij = getA(i, j);
          polyAdd(tmp, MultiplyNTTs(aij, rHat[j]));
        }
        polyAdd(e1, crystals.NTT.decode(tmp));
        u.push(e1);
        polyAdd(tmp2, MultiplyNTTs(tHat[i], rHat[i]));
        cleanBytes(tmp);
      }
      const e2 = sampleCBD(PRF, seed, 2 * K, ETA2);
      polyAdd(e2, crystals.NTT.decode(tmp2));
      const v = poly1.decode(msg);
      polyAdd(v, e2);
      cleanBytes(tHat, rHat, tmp2, e2);
      return cipherCoder.encode([u, v]);
    };
    return {
      secretCoder,
      lengths: {
        secretKey: secretCoder.bytesLen,
        publicKey: publicCoder.bytesLen,
        cipherText: cipherCoder.bytesLen
      },
      keygen: (seed) => {
        abytesDoc(seed, 32, "seed");
        const seedDst = new Uint8Array(33);
        seedDst.set(seed);
        seedDst[32] = K;
        const seedHash = HASH512(seedDst);
        const [rho, sigma] = seedCoder.decode(seedHash);
        const sHat = [];
        const tHat = [];
        for (let i = 0; i < K; i++)
          sHat.push(crystals.NTT.encode(sampleCBD(PRF, sigma, i, ETA1)));
        const x = XOF(rho);
        for (let i = 0; i < K; i++) {
          const e = crystals.NTT.encode(sampleCBD(PRF, sigma, K + i, ETA1));
          for (let j = 0; j < K; j++) {
            const aji = SampleNTT(x.get(j, i));
            polyAdd(e, MultiplyNTTs(aji, sHat[j]));
          }
          tHat.push(e);
        }
        x.clean();
        const res = {
          publicKey: publicCoder.encode([tHat, rho]),
          secretKey: secretCoder.encode(sHat)
        };
        cleanBytes(rho, sigma, sHat, tHat, seedDst, seedHash);
        return res;
      },
      encrypt: (publicKey, msg, seed) => {
        const [tHat, rho] = publicCoder.decode(publicKey);
        const x = XOF(rho);
        const res = encryptCore(tHat, (i, j) => SampleNTT(x.get(i, j)), msg, seed);
        x.clean();
        return res;
      },
      prepare: (publicKey) => {
        const [tHat, rho] = publicCoder.decode(publicKey);
        const x = XOF(rho);
        const A = [];
        for (let i = 0; i < K; i++)
          for (let j = 0; j < K; j++)
            A.push(SampleNTT(x.get(i, j)));
        x.clean();
        return {
          encrypt: (msg, seed) => encryptCore(tHat.map((p) => p.slice()), (i, j) => A[i * K + j].slice(), msg, seed),
          clean: () => cleanBytes(tHat, A)
        };
      },
      decrypt: (cipherText, secretBytes) => {
        const [u, v] = cipherCoder.decode(cipherText);
        const sk = secretCoder.decode(secretBytes);
        const tmp = new Uint16Array(N);
        for (let i = 0; i < K; i++)
          polyAdd(tmp, MultiplyNTTs(sk[i], crystals.NTT.encode(u[i])));
        polySub(v, crystals.NTT.decode(tmp));
        const res = poly1.encode(v);
        cleanBytes(tmp, sk, u, v);
        return res;
      }
    };
  };
  function createKyber(opts2) {
    const rawOpts = opts2;
    const KPKE = genKPKE(rawOpts);
    const { HASH256, HASH512, KDF } = rawOpts;
    const { secretCoder: KPKESecretCoder, lengths } = KPKE;
    const secretCoder = splitCoder("secretKey", lengths.secretKey, lengths.publicKey, 32, 32);
    const msgLen = 32;
    const seedLen = 64;
    const validateModulus = (publicKey, fn) => {
      const eke = publicKey.subarray(0, 384 * rawOpts.K);
      const ek = KPKESecretCoder.encode(KPKESecretCoder.decode(copyBytes2(eke)));
      const ok = equalBytes(ek, eke);
      cleanBytes(ek);
      if (!ok)
        throw new Error(`ML-KEM.${fn}: wrong publicKey modulus`);
    };
    const kemLengths = Object.freeze({
      ...lengths,
      seed: 64,
      msg: msgLen,
      msgRand: msgLen,
      secretKey: secretCoder.bytesLen
    });
    return Object.freeze({
      info: Object.freeze({ type: "ml-kem" }),
      lengths: kemLengths,
      keygen: (seed) => {
        const ownSeed = seed === void 0;
        const s = ownSeed ? randomBytes3(seedLen) : seed;
        let sk;
        let publicKeyHash;
        try {
          abytesDoc(s, seedLen, "seed");
          const keys = KPKE.keygen(s.subarray(0, 32));
          const publicKey = keys.publicKey;
          sk = keys.secretKey;
          publicKeyHash = HASH256(publicKey);
          const secretKey = secretCoder.encode([sk, publicKey, publicKeyHash, s.subarray(32)]);
          return {
            publicKey,
            secretKey
          };
        } finally {
          if (sk !== void 0)
            cleanBytes(sk);
          if (publicKeyHash !== void 0)
            cleanBytes(publicKeyHash);
          if (ownSeed)
            cleanBytes(s);
        }
      },
      getPublicKey: (secretKey) => {
        const [_sk, publicKey, _publicKeyHash, _z] = secretCoder.decode(secretKey);
        return Uint8Array.from(publicKey);
      },
      encapsulate: (publicKey, msg) => {
        const ownMsg = msg === void 0;
        const m = ownMsg ? randomBytes3(msgLen) : msg;
        let kr;
        try {
          abytesDoc(publicKey, lengths.publicKey, "publicKey");
          abytesDoc(m, msgLen, "message");
          validateModulus(publicKey, "encapsulate");
          kr = HASH512.create().update(m).update(HASH256(publicKey)).digest();
          const cipherText = KPKE.encrypt(publicKey, m, kr.subarray(32, 64));
          return {
            cipherText,
            sharedSecret: kr.subarray(0, 32)
          };
        } finally {
          if (kr !== void 0)
            cleanBytes(kr.subarray(32));
          if (ownMsg)
            cleanBytes(m);
        }
      },
      decapsulate: (cipherText, secretKey) => {
        abytesDoc(secretKey, secretCoder.bytesLen, "secretKey");
        abytesDoc(cipherText, lengths.cipherText, "cipherText");
        const k768 = secretCoder.bytesLen - 96;
        const start = k768 + 32;
        const test = HASH256(secretKey.subarray(k768 / 2, start));
        if (!equalBytes(test, secretKey.subarray(start, start + 32)))
          throw new Error("invalid secretKey: hash check failed");
        const [sk, publicKey, publicKeyHash, z] = secretCoder.decode(secretKey);
        const msg = KPKE.decrypt(cipherText, sk);
        const kr = HASH512.create().update(msg).update(publicKeyHash).digest();
        const Khat = kr.subarray(0, 32);
        const cipherText2 = KPKE.encrypt(publicKey, msg, kr.subarray(32, 64));
        const isValid = equalBytes(cipherText, cipherText2);
        const Kbar = KDF.create({ dkLen: 32 }).update(z).update(cipherText).digest();
        cleanBytes(msg, cipherText2, kr.subarray(32), !isValid ? Khat : Kbar);
        return isValid ? Khat : Kbar;
      },
      /**
       * Experimental prototype: pre-expand a public key so repeated encapsulate/decapsulate
       * against the same key skip re-validation, H(ek), t̂ decoding and the K² SampleNTT
       * XOF expansions of Â. Only public data is cached; see {@link KEMPrepared}.
       */
      prepare: (publicKey) => {
        abytesDoc(publicKey, lengths.publicKey, "publicKey");
        validateModulus(publicKey, "prepare");
        const ek = copyBytes2(publicKey);
        const publicKeyHash = HASH256(ek);
        const cached = KPKE.prepare(ek);
        return Object.freeze({
          publicKey: ek,
          encapsulate: (msg) => {
            const ownMsg = msg === void 0;
            const m = ownMsg ? randomBytes3(msgLen) : msg;
            let kr;
            try {
              abytesDoc(m, msgLen, "message");
              kr = HASH512.create().update(m).update(publicKeyHash).digest();
              const cipherText = cached.encrypt(m, kr.subarray(32, 64));
              return {
                cipherText,
                sharedSecret: kr.subarray(0, 32)
              };
            } finally {
              if (kr !== void 0)
                cleanBytes(kr.subarray(32));
              if (ownMsg)
                cleanBytes(m);
            }
          },
          decapsulate: (cipherText, secretKey) => {
            abytesDoc(secretKey, secretCoder.bytesLen, "secretKey");
            abytesDoc(cipherText, lengths.cipherText, "cipherText");
            const [sk, ekEmbedded, storedHash, z] = secretCoder.decode(secretKey);
            if (!equalBytes(ekEmbedded, ek) || !equalBytes(storedHash, publicKeyHash))
              throw new Error("ML-KEM.decapsulate: secretKey does not match prepared publicKey");
            const msg = KPKE.decrypt(cipherText, sk);
            const kr = HASH512.create().update(msg).update(publicKeyHash).digest();
            const Khat = kr.subarray(0, 32);
            const cipherText2 = cached.encrypt(msg, kr.subarray(32, 64));
            const isValid = equalBytes(cipherText, cipherText2);
            const Kbar = KDF.create({ dkLen: 32 }).update(z).update(cipherText).digest();
            cleanBytes(msg, cipherText2, kr.subarray(32), !isValid ? Khat : Kbar);
            return isValid ? Khat : Kbar;
          },
          clean: cached.clean
        });
      }
    });
  }
  function shakePRF(dkLen, key, nonce) {
    return shake256.create({ dkLen }).update(key).update(new Uint8Array([nonce])).digest();
  }
  var opts = /* @__PURE__ */ (() => ({
    HASH256: sha3_256,
    HASH512: sha3_512,
    KDF: shake256,
    XOF: XOF128,
    PRF: shakePRF
  }))();
  var mk = (params) => createKyber({
    ...opts,
    ...params
  });
  var ml_kem1024 = /* @__PURE__ */ (() => mk(PARAMS[1024]))();

  function isBytes3(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  var atitle3 = (title) => title ? `"${title}" ` : "";
  function abool3(value, title = "") {
    if (typeof value !== "boolean")
      throw new TypeError(atitle3(title) + "expected boolean, got type=" + typeof value);
    return value;
  }
  function anumber3(n, title = "") {
    if (typeof n !== "number")
      throw new TypeError(atitle3(title) + "expected number, got " + typeof n);
    if (!Number.isSafeInteger(n) || n < 0)
      throw new RangeError(atitle3(title) + "expected integer >= 0, got " + n);
    return n;
  }
  function abytes3(value, length, title = "") {
    if (isBytes3(value) && (length === void 0 || value.length === length))
      return value;
    if (length !== void 0)
      anumber3(length, "length");
    const bytes = isBytes3(value);
    const ofLen = length !== void 0 ? ` of length ${length}` : "";
    const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
    const message = atitle3(title) + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  var aobject3 = (value, label) => {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new TypeError(label === "object" ? "expected valid options object" : `"${label}" expected object, got type=${typeof value}`);
  };
  function aexists2(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("hash was destroyed");
    if (checkFinished && instance.finished)
      throw new Error("digest() was already called");
  }
  function aoutput2(out, instance) {
    abytes3(out, void 0, "output");
    const min = instance.outputLen;
    if (!(out.length >= min)) {
      throw new RangeError('"output" expected length >= ' + min);
    }
  }
  function aoutput32(out, instance) {
    aoutput2(out, instance);
    if (!isAligned32(out))
      throw new Error("invalid output, must be aligned");
  }
  function u8(arr) {
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function u322(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean2(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView2(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  var isLE2 = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  function byteSwap2(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  var swap8IfBE = isLE2 ? (n) => n : (n) => byteSwap2(n) >>> 0;
  function byteSwap322(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap2(arr[i]);
    }
    return arr;
  }
  var swap32IfBE2 = isLE2 ? (u) => u : byteSwap322;
  function overlapBytes(a, b) {
    if (!a.byteLength || !b.byteLength)
      return false;
    return a.buffer === b.buffer && // best we can do, may fail with an obscure Proxy
    a.byteOffset < b.byteOffset + b.byteLength && // a starts before b end
    b.byteOffset < a.byteOffset + a.byteLength;
  }
  function complexOverlapBytes(input, output) {
    if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
      throw new Error("complex overlap of input and output is not supported");
  }
  function checkOpts2(defaults, opts2) {
    aobject3(defaults, "defaults");
    aobject3(opts2, "opts");
    const merged = Object.assign(defaults, opts2);
    return merged;
  }
  function equalBytes2(a, b) {
    a = abytes3(a);
    b = abytes3(b);
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  function wrapMacConstructor(keyLen, macCons, fromMsg) {
    const mac = macCons;
    const getArgs = fromMsg || (() => []);
    const macC = (msg, key) => mac(key, ...getArgs(msg)).update(msg).digest();
    const tmp = mac(new Uint8Array(keyLen), ...getArgs(new Uint8Array(0)));
    macC.outputLen = tmp.outputLen;
    macC.blockLen = tmp.blockLen;
    macC.create = (key, ...args) => mac(key, ...args);
    return macC;
  }
  var wrapCipher = /* @__NO_SIDE_EFFECTS__ */ (params, constructor) => {
    function wrappedCipher(key, ...args) {
      abytes3(key, void 0, "key");
      if (params.nonceLength !== void 0) {
        const nonce = args[0];
        abytes3(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
      }
      const tagl = params.tagLength;
      const aadStart = params.nonceLength !== void 0 ? 1 : 0;
      if (!params.withAAD) {
        for (let i = aadStart; i < args.length; i++)
          if (isBytes3(args[i]))
            throw new Error("AAD not supported");
      }
      if (params.withAAD && args[aadStart] !== void 0)
        abytes3(args[aadStart], void 0, "AAD");
      const cipher = constructor(key, ...args);
      const checkOutput = (fnLength, output) => {
        if (output !== void 0) {
          if (fnLength !== 2)
            throw new Error("cipher output not supported");
          abytes3(output, void 0, "output");
        }
      };
      let called = false;
      const wrCipher = {
        encrypt(data, output) {
          if (called)
            throw new Error("cannot encrypt() twice with same key + nonce");
          called = true;
          abytes3(data, void 0, "data");
          checkOutput(cipher.encrypt.length, output);
          return cipher.encrypt(data, output);
        },
        decrypt(data, output) {
          abytes3(data, void 0, "data");
          if (tagl && data.length < tagl)
            throw new Error('"ciphertext" expected length >= tagLength=' + tagl);
          checkOutput(cipher.decrypt.length, output);
          return cipher.decrypt(data, output);
        }
      };
      return wrCipher;
    }
    Object.assign(wrappedCipher, params);
    return wrappedCipher;
  };
  function getOutput(expectedLength, out, onlyAligned = true) {
    if (out === void 0)
      return new Uint8Array(expectedLength);
    abytes3(out, expectedLength, "output");
    if (onlyAligned && !isAligned32(out))
      throw new Error("invalid output, must be aligned");
    return out;
  }
  function u64Lengths(dataLength, aadLength, isLE3) {
    anumber3(dataLength);
    anumber3(aadLength);
    abool3(isLE3);
    const num2 = new Uint8Array(16);
    const view = createView2(num2);
    view.setBigUint64(0, BigInt(aadLength), isLE3);
    view.setBigUint64(8, BigInt(dataLength), isLE3);
    return num2;
  }
  function isAligned32(bytes) {
    return bytes.byteOffset % 4 === 0;
  }
  function copyBytes3(bytes) {
    return Uint8Array.from(abytes3(bytes));
  }

  var encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
  var sigma16_32 = /* @__PURE__ */ (() => swap32IfBE2(u322(encodeStr("expand 16-byte k"))))();
  var sigma32_32 = /* @__PURE__ */ (() => swap32IfBE2(u322(encodeStr("expand 32-byte k"))))();
  function rotl(a, b) {
    return a << b | a >>> 32 - b;
  }
  var BLOCK_LEN = 64;
  var BLOCK_LEN32 = 16;
  var MAX_COUNTER = /* @__PURE__ */ (() => 2 ** 32 - 1)();
  var U32_EMPTY = /* @__PURE__ */ Uint32Array.of();
  function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
    const len = data.length;
    const block = new Uint8Array(BLOCK_LEN);
    const b32 = u322(block);
    const isAligned = isLE2 && isAligned32(data) && isAligned32(output);
    const d32 = isAligned ? u322(data) : U32_EMPTY;
    const o32 = isAligned ? u322(output) : U32_EMPTY;
    if (!isLE2) {
      for (let pos = 0; pos < len; counter++) {
        core(sigma, key, nonce, b32, counter, rounds);
        swap32IfBE2(b32);
        if (counter >= MAX_COUNTER)
          throw new Error("arx: counter overflow");
        const take = Math.min(BLOCK_LEN, len - pos);
        for (let j = 0, posj; j < take; j++) {
          posj = pos + j;
          output[posj] = data[posj] ^ block[j];
        }
        pos += take;
      }
      return;
    }
    for (let pos = 0; pos < len; counter++) {
      core(sigma, key, nonce, b32, counter, rounds);
      if (counter >= MAX_COUNTER)
        throw new Error("arx: counter overflow");
      const take = Math.min(BLOCK_LEN, len - pos);
      if (isAligned && take === BLOCK_LEN) {
        const pos32 = pos / 4;
        if (pos % 4 !== 0)
          throw new Error("arx: invalid block position");
        for (let j = 0, posj; j < BLOCK_LEN32; j++) {
          posj = pos32 + j;
          o32[posj] = d32[posj] ^ b32[j];
        }
        pos += BLOCK_LEN;
        continue;
      }
      for (let j = 0, posj; j < take; j++) {
        posj = pos + j;
        output[posj] = data[posj] ^ block[j];
      }
      pos += take;
    }
  }
  function createCipher(core, opts2) {
    const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts2({ allowShortKeys: false, counterLength: 8, counterRight: false, rounds: 20 }, opts2);
    if (typeof core !== "function")
      throw new Error("core must be a function");
    anumber3(counterLength);
    anumber3(rounds);
    abool3(counterRight);
    abool3(allowShortKeys);
    return (key, nonce, data, output, counter = 0) => {
      abytes3(key, void 0, "key");
      abytes3(nonce, void 0, "nonce");
      abytes3(data, void 0, "data");
      const len = data.length;
      const hasOutput = output !== void 0;
      output = getOutput(len, output, false);
      if (hasOutput)
        complexOverlapBytes(data, output);
      anumber3(counter);
      if (counter < 0 || counter >= MAX_COUNTER)
        throw new Error("arx: counter overflow");
      const toClean = [];
      let l = key.length;
      let k;
      let sigma;
      if (l === 32) {
        toClean.push(k = copyBytes3(key));
        sigma = sigma32_32;
      } else if (l === 16 && allowShortKeys) {
        k = new Uint8Array(32);
        k.set(key);
        k.set(key, 16);
        sigma = sigma16_32;
        toClean.push(k);
      } else {
        abytes3(key, 32, "arx key");
        throw new Error("invalid key size");
      }
      if (!isLE2 || !isAligned32(nonce))
        toClean.push(nonce = copyBytes3(nonce));
      let k32 = u322(k);
      if (extendNonceFn) {
        if (nonce.length !== 24)
          throw new Error("arx: extended nonce must be 24 bytes");
        const n16 = nonce.subarray(0, 16);
        if (isLE2)
          extendNonceFn(sigma, k32, u322(n16), k32);
        else {
          const sigmaRaw = swap32IfBE2(Uint32Array.from(sigma));
          extendNonceFn(sigmaRaw, k32, u322(n16), k32);
          clean2(sigmaRaw);
          swap32IfBE2(k32);
        }
        nonce = nonce.subarray(16);
      } else if (!isLE2)
        swap32IfBE2(k32);
      const nonceNcLen = 16 - counterLength;
      if (nonceNcLen !== nonce.length)
        throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
      if (nonceNcLen !== 12) {
        const nc = new Uint8Array(12);
        nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
        nonce = nc;
        toClean.push(nonce);
      }
      const n32 = swap32IfBE2(u322(nonce));
      try {
        runCipher(core, sigma, k32, n32, data, output, counter, rounds);
        return output;
      } finally {
        clean2(...toClean);
      }
    };
  }

  function u8to16(a, i) {
    return a[i++] & 255 | (a[i++] & 255) << 8;
  }
  var Poly1305 = class {
    constructor(key) {
      __publicField(this, "blockLen", 16);
      __publicField(this, "outputLen", 16);
      __publicField(this, "buffer", new Uint8Array(16));
      __publicField(this, "r", new Uint16Array(10));
      __publicField(this, "h", new Uint16Array(10));
      __publicField(this, "pad", new Uint16Array(8));
      __publicField(this, "pos", 0);
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      key = copyBytes3(abytes3(key, 32, "key"));
      const t0 = u8to16(key, 0);
      const t1 = u8to16(key, 2);
      const t2 = u8to16(key, 4);
      const t3 = u8to16(key, 6);
      const t4 = u8to16(key, 8);
      const t5 = u8to16(key, 10);
      const t6 = u8to16(key, 12);
      const t7 = u8to16(key, 14);
      this.r[0] = t0 & 8191;
      this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
      this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
      this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
      this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
      this.r[5] = t4 >>> 1 & 8190;
      this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
      this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
      this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
      this.r[9] = t7 >>> 5 & 127;
      for (let i = 0; i < 8; i++)
        this.pad[i] = u8to16(key, 16 + 2 * i);
    }
    process(data, offset, isLast = false) {
      const hibit = isLast ? 0 : 1 << 11;
      const { h, r } = this;
      const r0 = r[0];
      const r1 = r[1];
      const r2 = r[2];
      const r3 = r[3];
      const r4 = r[4];
      const r5 = r[5];
      const r6 = r[6];
      const r7 = r[7];
      const r8 = r[8];
      const r9 = r[9];
      const t0 = u8to16(data, offset + 0);
      const t1 = u8to16(data, offset + 2);
      const t2 = u8to16(data, offset + 4);
      const t3 = u8to16(data, offset + 6);
      const t4 = u8to16(data, offset + 8);
      const t5 = u8to16(data, offset + 10);
      const t6 = u8to16(data, offset + 12);
      const t7 = u8to16(data, offset + 14);
      let h0 = h[0] + (t0 & 8191);
      let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
      let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
      let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
      let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
      let h5 = h[5] + (t4 >>> 1 & 8191);
      let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
      let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
      let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
      let h9 = h[9] + (t7 >>> 5 | hibit);
      let c = 0;
      let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
      c = d0 >>> 13;
      d0 &= 8191;
      d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
      c += d0 >>> 13;
      d0 &= 8191;
      let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
      c = d1 >>> 13;
      d1 &= 8191;
      d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
      c += d1 >>> 13;
      d1 &= 8191;
      let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
      c = d2 >>> 13;
      d2 &= 8191;
      d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
      c += d2 >>> 13;
      d2 &= 8191;
      let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
      c = d3 >>> 13;
      d3 &= 8191;
      d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
      c += d3 >>> 13;
      d3 &= 8191;
      let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
      c = d4 >>> 13;
      d4 &= 8191;
      d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
      c += d4 >>> 13;
      d4 &= 8191;
      let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
      c = d5 >>> 13;
      d5 &= 8191;
      d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
      c += d5 >>> 13;
      d5 &= 8191;
      let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
      c = d6 >>> 13;
      d6 &= 8191;
      d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
      c += d6 >>> 13;
      d6 &= 8191;
      let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
      c = d7 >>> 13;
      d7 &= 8191;
      d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
      c += d7 >>> 13;
      d7 &= 8191;
      let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
      c = d8 >>> 13;
      d8 &= 8191;
      d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
      c += d8 >>> 13;
      d8 &= 8191;
      let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
      c = d9 >>> 13;
      d9 &= 8191;
      d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
      c += d9 >>> 13;
      d9 &= 8191;
      c = (c << 2) + c | 0;
      c = c + d0 | 0;
      d0 = c & 8191;
      c = c >>> 13;
      d1 += c;
      h[0] = d0;
      h[1] = d1;
      h[2] = d2;
      h[3] = d3;
      h[4] = d4;
      h[5] = d5;
      h[6] = d6;
      h[7] = d7;
      h[8] = d8;
      h[9] = d9;
    }
    finalize() {
      const { h, pad } = this;
      const g = new Uint16Array(10);
      let c = h[1] >>> 13;
      h[1] &= 8191;
      for (let i = 2; i < 10; i++) {
        h[i] += c;
        c = h[i] >>> 13;
        h[i] &= 8191;
      }
      h[0] += c * 5;
      c = h[0] >>> 13;
      h[0] &= 8191;
      h[1] += c;
      c = h[1] >>> 13;
      h[1] &= 8191;
      h[2] += c;
      g[0] = h[0] + 5;
      c = g[0] >>> 13;
      g[0] &= 8191;
      for (let i = 1; i < 10; i++) {
        g[i] = h[i] + c;
        c = g[i] >>> 13;
        g[i] &= 8191;
      }
      g[9] -= 1 << 13;
      let mask = (c ^ 1) - 1;
      for (let i = 0; i < 10; i++)
        g[i] &= mask;
      mask = ~mask;
      for (let i = 0; i < 10; i++)
        h[i] = h[i] & mask | g[i];
      h[0] = (h[0] | h[1] << 13) & 65535;
      h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
      h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
      h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
      h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
      h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
      h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
      h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
      let f = h[0] + pad[0];
      h[0] = f & 65535;
      for (let i = 1; i < 8; i++) {
        f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
        h[i] = f & 65535;
      }
      clean2(g);
    }
    update(data) {
      aexists2(this);
      abytes3(data);
      data = copyBytes3(data);
      const { buffer, blockLen } = this;
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(data, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(buffer, 0, false);
          this.pos = 0;
        }
      }
      return this;
    }
    destroy() {
      this.destroyed = true;
      clean2(this.h, this.r, this.buffer, this.pad);
    }
    digestInto(out) {
      aexists2(this);
      aoutput2(out, this);
      this.finished = true;
      const { buffer, h } = this;
      let { pos } = this;
      if (pos) {
        buffer[pos++] = 1;
        for (; pos < 16; pos++)
          buffer[pos] = 0;
        this.process(buffer, 0, true);
      }
      this.finalize();
      let opos = 0;
      for (let i = 0; i < 8; i++) {
        out[opos++] = h[i] >>> 0;
        out[opos++] = h[i] >>> 8;
      }
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
  };
  var poly1305 = /* @__PURE__ */ wrapMacConstructor(32, (key) => new Poly1305(key));

  function chachaCore(s, k, n, out, cnt, rounds = 20) {
    let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
    for (let r = 0; r < rounds; r += 2) {
      x00 = x00 + x04 | 0;
      x12 = rotl(x12 ^ x00, 16);
      x08 = x08 + x12 | 0;
      x04 = rotl(x04 ^ x08, 12);
      x00 = x00 + x04 | 0;
      x12 = rotl(x12 ^ x00, 8);
      x08 = x08 + x12 | 0;
      x04 = rotl(x04 ^ x08, 7);
      x01 = x01 + x05 | 0;
      x13 = rotl(x13 ^ x01, 16);
      x09 = x09 + x13 | 0;
      x05 = rotl(x05 ^ x09, 12);
      x01 = x01 + x05 | 0;
      x13 = rotl(x13 ^ x01, 8);
      x09 = x09 + x13 | 0;
      x05 = rotl(x05 ^ x09, 7);
      x02 = x02 + x06 | 0;
      x14 = rotl(x14 ^ x02, 16);
      x10 = x10 + x14 | 0;
      x06 = rotl(x06 ^ x10, 12);
      x02 = x02 + x06 | 0;
      x14 = rotl(x14 ^ x02, 8);
      x10 = x10 + x14 | 0;
      x06 = rotl(x06 ^ x10, 7);
      x03 = x03 + x07 | 0;
      x15 = rotl(x15 ^ x03, 16);
      x11 = x11 + x15 | 0;
      x07 = rotl(x07 ^ x11, 12);
      x03 = x03 + x07 | 0;
      x15 = rotl(x15 ^ x03, 8);
      x11 = x11 + x15 | 0;
      x07 = rotl(x07 ^ x11, 7);
      x00 = x00 + x05 | 0;
      x15 = rotl(x15 ^ x00, 16);
      x10 = x10 + x15 | 0;
      x05 = rotl(x05 ^ x10, 12);
      x00 = x00 + x05 | 0;
      x15 = rotl(x15 ^ x00, 8);
      x10 = x10 + x15 | 0;
      x05 = rotl(x05 ^ x10, 7);
      x01 = x01 + x06 | 0;
      x12 = rotl(x12 ^ x01, 16);
      x11 = x11 + x12 | 0;
      x06 = rotl(x06 ^ x11, 12);
      x01 = x01 + x06 | 0;
      x12 = rotl(x12 ^ x01, 8);
      x11 = x11 + x12 | 0;
      x06 = rotl(x06 ^ x11, 7);
      x02 = x02 + x07 | 0;
      x13 = rotl(x13 ^ x02, 16);
      x08 = x08 + x13 | 0;
      x07 = rotl(x07 ^ x08, 12);
      x02 = x02 + x07 | 0;
      x13 = rotl(x13 ^ x02, 8);
      x08 = x08 + x13 | 0;
      x07 = rotl(x07 ^ x08, 7);
      x03 = x03 + x04 | 0;
      x14 = rotl(x14 ^ x03, 16);
      x09 = x09 + x14 | 0;
      x04 = rotl(x04 ^ x09, 12);
      x03 = x03 + x04 | 0;
      x14 = rotl(x14 ^ x03, 8);
      x09 = x09 + x14 | 0;
      x04 = rotl(x04 ^ x09, 7);
    }
    let oi = 0;
    out[oi++] = y00 + x00 | 0;
    out[oi++] = y01 + x01 | 0;
    out[oi++] = y02 + x02 | 0;
    out[oi++] = y03 + x03 | 0;
    out[oi++] = y04 + x04 | 0;
    out[oi++] = y05 + x05 | 0;
    out[oi++] = y06 + x06 | 0;
    out[oi++] = y07 + x07 | 0;
    out[oi++] = y08 + x08 | 0;
    out[oi++] = y09 + x09 | 0;
    out[oi++] = y10 + x10 | 0;
    out[oi++] = y11 + x11 | 0;
    out[oi++] = y12 + x12 | 0;
    out[oi++] = y13 + x13 | 0;
    out[oi++] = y14 + x14 | 0;
    out[oi++] = y15 + x15 | 0;
  }
  function hchacha(s, k, i, out) {
    const s2 = isLE2 ? s : swap32IfBE2(s.slice(0, 4));
    const k2 = isLE2 ? k : swap32IfBE2(k.slice(0, 8));
    const i2 = isLE2 ? i : swap32IfBE2(i.slice(0, 4));
    const t = new Uint32Array(16);
    chachaCore(s2, k2, i2.subarray(1), t, i2[0]);
    let oi = 0;
    out[oi++] = t[0] - s2[0] | 0;
    out[oi++] = t[1] - s2[1] | 0;
    out[oi++] = t[2] - s2[2] | 0;
    out[oi++] = t[3] - s2[3] | 0;
    out[oi++] = t[12] - i2[0] | 0;
    out[oi++] = t[13] - i2[1] | 0;
    out[oi++] = t[14] - i2[2] | 0;
    out[oi++] = t[15] - i2[3] | 0;
    swap32IfBE2(out);
    if (!isLE2)
      clean2(s2, k2, i2);
    clean2(t);
  }
  var xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
    counterRight: false,
    counterLength: 8,
    extendNonceFn: hchacha,
    allowShortKeys: false
  });
  var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
  var updatePadded = (h, msg) => {
    h.update(msg);
    const leftover = msg.length % 16;
    if (leftover)
      h.update(ZEROS16.subarray(leftover));
  };
  var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
  function computeTag(fn, key, nonce, ciphertext, AAD) {
    if (AAD !== void 0)
      abytes3(AAD, void 0, "AAD");
    const authKey = fn(key, nonce, ZEROS32);
    const lengths = u64Lengths(ciphertext.length, AAD ? AAD.length : 0, true);
    const h = poly1305.create(authKey);
    if (AAD)
      updatePadded(h, AAD);
    updatePadded(h, ciphertext);
    h.update(lengths);
    const res = h.digest();
    clean2(authKey, lengths);
    return res;
  }
  var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
    const tagLength = 16;
    return {
      encrypt(plaintext, output) {
        const plength = plaintext.length;
        output = getOutput(plength + tagLength, output, false);
        output.set(plaintext);
        const oPlain = output.subarray(0, -tagLength);
        xorStream(key, nonce, oPlain, oPlain, 1);
        const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
        output.set(tag, plength);
        clean2(tag);
        return output;
      },
      decrypt(ciphertext, output) {
        output = getOutput(ciphertext.length - tagLength, output, false);
        const data = ciphertext.subarray(0, -tagLength);
        const passedTag = ciphertext.subarray(-tagLength);
        const tag = computeTag(xorStream, key, nonce, data, AAD);
        if (!equalBytes2(passedTag, tag)) {
          clean2(tag);
          throw new Error("invalid tag");
        }
        output.set(ciphertext.subarray(0, -tagLength));
        xorStream(key, nonce, output, output, 1);
        clean2(tag);
        return output;
      }
    };
  };
  var xchacha20poly1305 = /* @__PURE__ */ wrapCipher(
    { blockSize: 64, nonceLength: 24, tagLength: 16, withAAD: true },
    /* @__PURE__ */ _poly1305_aead(xchacha20)
  );

  var BLOCK_SIZE = 16;
  var ZEROS162 = /* @__PURE__ */ new Uint8Array(16);
  var ZEROS322 = /* @__PURE__ */ u322(ZEROS162);
  var POLY = 225;
  var mul2 = (s0, s1, s2, s3) => {
    const hiBit = s3 & 1;
    return {
      s3: s2 << 31 | s3 >>> 1,
      s2: s1 << 31 | s2 >>> 1,
      s1: s0 << 31 | s1 >>> 1,
      s0: s0 >>> 1 ^ POLY << 24 & -(hiBit & 1)
    };
  };
  var swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
  var estimateWindow = (bytes) => {
    if (bytes > 64 * 1024)
      return 8;
    if (bytes > 1024)
      return 4;
    return 2;
  };
  var GHASH = class {
    constructor(key, expectedLength) {
      __publicField(this, "blockLen", BLOCK_SIZE);
      __publicField(this, "outputLen", BLOCK_SIZE);
      __publicField(this, "s0", 0);
      __publicField(this, "s1", 0);
      __publicField(this, "s2", 0);
      __publicField(this, "s3", 0);
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      __publicField(this, "t");
      __publicField(this, "W");
      __publicField(this, "windowSize");
      abytes3(key, 16, "key");
      key = copyBytes3(key);
      const kView = createView2(key);
      let k0 = kView.getUint32(0, false);
      let k1 = kView.getUint32(4, false);
      let k2 = kView.getUint32(8, false);
      let k3 = kView.getUint32(12, false);
      const doubles = [];
      for (let i = 0; i < 128; i++) {
        doubles.push({ s0: swapLE(k0), s1: swapLE(k1), s2: swapLE(k2), s3: swapLE(k3) });
        ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2(k0, k1, k2, k3));
      }
      const W = estimateWindow(expectedLength || 1024);
      if (![1, 2, 4, 8].includes(W))
        throw new Error("ghash: invalid window size, expected 2, 4 or 8");
      this.W = W;
      const bits = 128;
      const windows = bits / W;
      const windowSize = this.windowSize = 2 ** W;
      const items = [];
      for (let w = 0; w < windows; w++) {
        for (let byte = 0; byte < windowSize; byte++) {
          let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
          for (let j = 0; j < W; j++) {
            const bit = byte >>> W - j - 1 & 1;
            if (!bit)
              continue;
            const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
            s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
          }
          items.push({ s0, s1, s2, s3 });
        }
      }
      this.t = items;
    }
    _updateBlock(s0, s1, s2, s3) {
      s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
      const { W, t, windowSize } = this;
      let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
      const mask = (1 << W) - 1;
      let w = 0;
      for (const num2 of [s0, s1, s2, s3]) {
        for (let bytePos = 0; bytePos < 4; bytePos++) {
          const byte = num2 >>> 8 * bytePos & 255;
          for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
            const bit = byte >>> W * bitPos & mask;
            const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
            o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
            w += 1;
          }
        }
      }
      this.s0 = o0;
      this.s1 = o1;
      this.s2 = o2;
      this.s3 = o3;
    }
    update(data) {
      aexists2(this);
      abytes3(data);
      data = copyBytes3(data);
      const b32 = u322(data);
      const blocks = Math.floor(data.length / BLOCK_SIZE);
      const left = data.length % BLOCK_SIZE;
      for (let i = 0; i < blocks; i++) {
        this._updateBlock(swap8IfBE(b32[i * 4 + 0]), swap8IfBE(b32[i * 4 + 1]), swap8IfBE(b32[i * 4 + 2]), swap8IfBE(b32[i * 4 + 3]));
      }
      if (left) {
        ZEROS162.set(data.subarray(blocks * BLOCK_SIZE));
        this._updateBlock(swap8IfBE(ZEROS322[0]), swap8IfBE(ZEROS322[1]), swap8IfBE(ZEROS322[2]), swap8IfBE(ZEROS322[3]));
        clean2(ZEROS322);
      }
      return this;
    }
    destroy() {
      this.destroyed = true;
      const { t } = this;
      for (const elm of t) {
        elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
      }
    }
    digestInto(out) {
      aexists2(this);
      aoutput32(out, this);
      this.finished = true;
      const { s0, s1, s2, s3 } = this;
      const o32 = u322(out);
      o32[0] = s0;
      o32[1] = s1;
      o32[2] = s2;
      o32[3] = s3;
      if (!isLE2)
        swap32IfBE2(o32.subarray(0, BLOCK_SIZE / 4));
    }
    digest() {
      const res = new Uint8Array(BLOCK_SIZE);
      this.digestInto(res);
      this.destroy();
      return res;
    }
  };
  var ghash = /* @__PURE__ */ wrapMacConstructor(16, (key, expectedLength) => new GHASH(key, expectedLength), (msg) => [msg.length]);

  var BLOCK_SIZE2 = 16;
  var BLOCK_SIZE32 = 4;
  var EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE2);
  var POLY2 = 283;
  function validateKeyLength(key) {
    if (![16, 24, 32].includes(key.length))
      throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + key.length);
  }
  function mul22(n) {
    return n << 1 ^ POLY2 & -(n >> 7);
  }
  function mul(a, b) {
    let res = 0;
    for (; b > 0; b >>= 1) {
      res ^= a & -(b & 1);
      a = mul22(a);
    }
    return res;
  }
  var sbox = /* @__PURE__ */ (() => {
    const t = new Uint8Array(256);
    for (let i = 0, x = 1; i < 256; i++, x ^= mul22(x))
      t[i] = x;
    const box = new Uint8Array(256);
    box[0] = 99;
    for (let i = 0; i < 255; i++) {
      let x = t[255 - i];
      x |= x << 8;
      box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
    }
    clean2(t);
    return box;
  })();
  var rotr32_8 = (n) => n << 24 | n >>> 8;
  var rotl32_8 = (n) => n << 8 | n >>> 24;
  function genTtable(sbox2, fn) {
    if (sbox2.length !== 256)
      throw new Error("wrong sbox length");
    const T0 = new Uint32Array(256).map((_, j) => fn(sbox2[j]));
    const T1 = T0.map(rotl32_8);
    const T2 = T1.map(rotl32_8);
    const T3 = T2.map(rotl32_8);
    const T01 = new Uint32Array(256 * 256);
    const T23 = new Uint32Array(256 * 256);
    const sbox22 = new Uint16Array(256 * 256);
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        const idx = i * 256 + j;
        T01[idx] = T0[i] ^ T1[j];
        T23[idx] = T2[i] ^ T3[j];
        sbox22[idx] = sbox2[i] << 8 | sbox2[j];
      }
    }
    return { sbox: sbox2, sbox2: sbox22, T0, T1, T2, T3, T01, T23 };
  }
  var tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
  var xPowers = /* @__PURE__ */ (() => {
    const p = new Uint8Array(16);
    for (let i = 0, x = 1; i < 16; i++, x = mul22(x))
      p[i] = x;
    return p;
  })();
  function expandKeyLE(key) {
    abytes3(key);
    const len = key.length;
    validateKeyLength(key);
    const { sbox2 } = tableEncoding;
    const toClean = [];
    if (!isLE2 || !isAligned32(key))
      toClean.push(key = copyBytes3(key));
    const k32 = swap32IfBE2(u322(key));
    const Nk = k32.length;
    const subByte = (n) => applySbox(sbox2, n, n, n, n);
    const xk = new Uint32Array(len + 28);
    xk.set(k32);
    for (let i = Nk; i < xk.length; i++) {
      let t = xk[i - 1];
      if (i % Nk === 0)
        t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
      else if (Nk > 6 && i % Nk === 4)
        t = subByte(t);
      xk[i] = xk[i - Nk] ^ t;
    }
    clean2(...toClean);
    return xk;
  }
  function apply0123(T01, T23, s0, s1, s2, s3) {
    return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
  }
  function applySbox(sbox2, s0, s1, s2, s3) {
    return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
  }
  function encrypt(xk, s0, s1, s2, s3) {
    const { sbox2, T01, T23 } = tableEncoding;
    let k = 0;
    s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
    const rounds = xk.length / 4 - 2;
    for (let i = 0; i < rounds; i++) {
      const t02 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
      const t12 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
      const t22 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
      const t32 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
      s0 = t02, s1 = t12, s2 = t22, s3 = t32;
    }
    const t0 = xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3);
    const t1 = xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0);
    const t2 = xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1);
    const t3 = xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2);
    return { s0: t0, s1: t1, s2: t2, s3: t3 };
  }
  function ctr32(xk, isLE3, nonce, src, dst) {
    abytes3(nonce, BLOCK_SIZE2, "nonce");
    abytes3(src);
    dst = getOutput(src.length, dst);
    const ctr = nonce;
    const c32 = u322(ctr);
    const view = createView2(ctr);
    const src32 = u322(src);
    const dst32 = u322(dst);
    const ctrPos = isLE3 ? 0 : 12;
    const srcLen = src.length;
    let ctrNum = view.getUint32(ctrPos, isLE3);
    for (let i = 0; i + 4 <= src32.length; i += 4) {
      const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
      dst32[i + 0] = src32[i + 0] ^ swap8IfBE(s0);
      dst32[i + 1] = src32[i + 1] ^ swap8IfBE(s1);
      dst32[i + 2] = src32[i + 2] ^ swap8IfBE(s2);
      dst32[i + 3] = src32[i + 3] ^ swap8IfBE(s3);
      ctrNum = ctrNum + 1 >>> 0;
      view.setUint32(ctrPos, ctrNum, isLE3);
    }
    const start = BLOCK_SIZE2 * Math.floor(src32.length / BLOCK_SIZE32);
    if (start < srcLen) {
      const { s0, s1, s2, s3 } = encrypt(xk, swap8IfBE(c32[0]), swap8IfBE(c32[1]), swap8IfBE(c32[2]), swap8IfBE(c32[3]));
      const b32 = new Uint32Array([s0, s1, s2, s3]);
      swap32IfBE2(b32);
      const buf = u8(b32);
      for (let i = start, pos = 0; i < srcLen; i++, pos++)
        dst[i] = src[i] ^ buf[pos];
      clean2(b32);
    }
    return dst;
  }
  function computeTag2(fn, isLE3, key, data, AAD) {
    const aadLength = AAD ? AAD.length : 0;
    const h = fn.create(key, data.length + aadLength);
    if (AAD)
      h.update(AAD);
    const num2 = u64Lengths(8 * data.length, 8 * aadLength, isLE3);
    h.update(data);
    h.update(num2);
    const res = h.digest();
    clean2(num2);
    return res;
  }
  var gcm = /* @__PURE__ */ wrapCipher({ blockSize: 16, nonceLength: 12, tagLength: 16, withAAD: true, varSizeNonce: true }, function aesgcm(key, nonce, AAD) {
    if (nonce.length < 8)
      throw new Error("aes/gcm: invalid nonce length");
    const tagLength = 16;
    function _computeTag(authKey, tagMask, data) {
      const tag = computeTag2(ghash, false, authKey, data, AAD);
      for (let i = 0; i < tagMask.length; i++)
        tag[i] ^= tagMask[i];
      return tag;
    }
    function deriveKeys() {
      const xk = expandKeyLE(key);
      const authKey = EMPTY_BLOCK.slice();
      const counter = EMPTY_BLOCK.slice();
      ctr32(xk, false, counter, counter, authKey);
      if (nonce.length === 12) {
        counter.set(nonce);
      } else {
        const nonceLen = EMPTY_BLOCK.slice();
        const view = createView2(nonceLen);
        view.setBigUint64(8, BigInt(nonce.length * 8), false);
        const g = ghash.create(authKey).update(nonce).update(nonceLen);
        g.digestInto(counter);
        g.destroy();
      }
      const tagMask = ctr32(xk, false, counter, EMPTY_BLOCK);
      return { xk, authKey, counter, tagMask };
    }
    return {
      encrypt(plaintext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const out = new Uint8Array(plaintext.length + tagLength);
        const toClean = [xk, authKey, counter, tagMask];
        if (!isAligned32(plaintext))
          toClean.push(plaintext = copyBytes3(plaintext));
        ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
        const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
        toClean.push(tag);
        out.set(tag, plaintext.length);
        clean2(...toClean);
        return out;
      },
      decrypt(ciphertext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const toClean = [xk, authKey, tagMask, counter];
        if (!isAligned32(ciphertext))
          toClean.push(ciphertext = copyBytes3(ciphertext));
        const data = ciphertext.subarray(0, -tagLength);
        const passedTag = ciphertext.subarray(-tagLength);
        const tag = _computeTag(authKey, tagMask, data);
        toClean.push(tag);
        if (!equalBytes2(tag, passedTag)) {
          clean2(...toClean);
          throw new Error("aes-gcm: invalid tag");
        }
        const out = ctr32(xk, false, counter, data);
        clean2(...toClean);
        return out;
      }
    };
  });

  var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
  var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
  function expand(hash, prk, info, length = 32, _recycled) {
    ahash(hash);
    anumber(length, "length");
    abytes(prk, void 0, "prk");
    const olen = hash.outputLen;
    if (prk.length < olen)
      throw new Error('"prk" must be at least HashLen octets');
    if (length > 255 * olen)
      throw new Error("Length must be <= 255*HashLen");
    const blocks = Math.ceil(length / olen);
    if (info === void 0)
      info = EMPTY_BUFFER;
    else
      abytes(info, void 0, "info");
    if (!blocks) {
      if (_recycled)
        clean(prk);
      return new Uint8Array();
    }
    const okm = _recycled && blocks === 1 ? prk : new Uint8Array(blocks * olen);
    const { iHash, oHash } = hmac.create(hash, prk);
    const T = _recycled ? prk : new Uint8Array(olen);
    const worker = blocks > 1 ? _recycled?.iHash || hash.create() : void 0;
    for (let counter = 0; counter < blocks - 1; counter++) {
      HKDF_COUNTER[0] = counter + 1;
      const iWork = iHash._cloneInto(worker);
      if (counter)
        iWork.update(T);
      iWork.update(info).update(HKDF_COUNTER).digestInto(T);
      oHash._cloneInto(worker).update(T).digestInto(T);
      okm.set(T, olen * counter);
    }
    HKDF_COUNTER[0] = blocks;
    if (blocks > 1)
      iHash.update(T);
    iHash.update(info).update(HKDF_COUNTER).digestInto(T);
    oHash.update(T).digestInto(T);
    okm.set(T, olen * (blocks - 1));
    iHash.destroy();
    oHash.destroy();
    worker?.destroy();
    if (T !== okm)
      clean(T);
    clean(HKDF_COUNTER);
    if (length === okm.length)
      return okm;
    const res = okm.slice(0, length);
    clean(okm);
    return res;
  }
  var hkdf = (hash, ikm, salt, info, length) => {
    ahash(hash);
    if (salt === void 0)
      salt = new Uint8Array(hash.outputLen);
    const HMAC = hmac.create(hash, salt).update(ikm);
    return expand(hash, HMAC.digest(), info, length, HMAC);
  };

  function getRandomBytes(numBytes) {
    return crypto.getRandomValues(new Uint8Array(numBytes));
  }

  var LOG_TABLE = new Uint8Array([
    0,
    255,
    200,
    8,
    145,
    16,
    208,
    54,
    90,
    62,
    216,
    67,
    153,
    119,
    254,
    24,
    35,
    32,
    7,
    112,
    161,
    108,
    12,
    127,
    98,
    139,
    64,
    70,
    199,
    75,
    224,
    14,
    235,
    22,
    232,
    173,
    207,
    205,
    57,
    83,
    106,
    39,
    53,
    147,
    212,
    78,
    72,
    195,
    43,
    121,
    84,
    40,
    9,
    120,
    15,
    33,
    144,
    135,
    20,
    42,
    169,
    156,
    214,
    116,
    180,
    124,
    222,
    237,
    177,
    134,
    118,
    164,
    152,
    226,
    150,
    143,
    2,
    50,
    28,
    193,
    51,
    238,
    239,
    129,
    253,
    48,
    92,
    19,
    157,
    41,
    23,
    196,
    17,
    68,
    140,
    128,
    243,
    115,
    66,
    30,
    29,
    181,
    240,
    18,
    209,
    91,
    65,
    162,
    215,
    44,
    233,
    213,
    89,
    203,
    80,
    168,
    220,
    252,
    242,
    86,
    114,
    166,
    101,
    47,
    159,
    155,
    61,
    186,
    125,
    194,
    69,
    130,
    167,
    87,
    182,
    163,
    122,
    117,
    79,
    174,
    63,
    55,
    109,
    71,
    97,
    190,
    171,
    211,
    95,
    176,
    88,
    175,
    202,
    94,
    250,
    133,
    228,
    77,
    138,
    5,
    251,
    96,
    183,
    123,
    184,
    38,
    74,
    103,
    198,
    26,
    248,
    105,
    37,
    179,
    219,
    189,
    102,
    221,
    241,
    210,
    223,
    3,
    141,
    52,
    217,
    146,
    13,
    99,
    85,
    170,
    73,
    236,
    188,
    149,
    60,
    132,
    11,
    245,
    230,
    231,
    229,
    172,
    126,
    110,
    185,
    249,
    218,
    142,
    154,
    201,
    36,
    225,
    10,
    21,
    107,
    58,
    160,
    81,
    244,
    234,
    178,
    151,
    158,
    93,
    34,
    136,
    148,
    206,
    25,
    1,
    113,
    76,
    165,
    227,
    197,
    49,
    187,
    204,
    31,
    45,
    59,
    82,
    111,
    246,
    46,
    137,
    247,
    192,
    104,
    27,
    100,
    4,
    6,
    191,
    131,
    56
  ]);
  var EXP_TABLE = new Uint8Array([
    1,
    229,
    76,
    181,
    251,
    159,
    252,
    18,
    3,
    52,
    212,
    196,
    22,
    186,
    31,
    54,
    5,
    92,
    103,
    87,
    58,
    213,
    33,
    90,
    15,
    228,
    169,
    249,
    78,
    100,
    99,
    238,
    17,
    55,
    224,
    16,
    210,
    172,
    165,
    41,
    51,
    89,
    59,
    48,
    109,
    239,
    244,
    123,
    85,
    235,
    77,
    80,
    183,
    42,
    7,
    141,
    255,
    38,
    215,
    240,
    194,
    126,
    9,
    140,
    26,
    106,
    98,
    11,
    93,
    130,
    27,
    143,
    46,
    190,
    166,
    29,
    231,
    157,
    45,
    138,
    114,
    217,
    241,
    39,
    50,
    188,
    119,
    133,
    150,
    112,
    8,
    105,
    86,
    223,
    153,
    148,
    161,
    144,
    24,
    187,
    250,
    122,
    176,
    167,
    248,
    171,
    40,
    214,
    21,
    142,
    203,
    242,
    19,
    230,
    120,
    97,
    63,
    137,
    70,
    13,
    53,
    49,
    136,
    163,
    65,
    128,
    202,
    23,
    95,
    83,
    131,
    254,
    195,
    155,
    69,
    57,
    225,
    245,
    158,
    25,
    94,
    182,
    207,
    75,
    56,
    4,
    185,
    43,
    226,
    193,
    74,
    221,
    72,
    12,
    208,
    125,
    61,
    88,
    222,
    124,
    216,
    20,
    107,
    135,
    71,
    232,
    121,
    132,
    115,
    60,
    189,
    146,
    201,
    35,
    139,
    151,
    149,
    68,
    220,
    173,
    64,
    101,
    134,
    162,
    164,
    204,
    127,
    236,
    192,
    175,
    145,
    253,
    247,
    79,
    129,
    47,
    91,
    234,
    168,
    28,
    2,
    209,
    152,
    113,
    237,
    37,
    227,
    36,
    6,
    104,
    179,
    147,
    44,
    111,
    62,
    108,
    10,
    184,
    206,
    174,
    116,
    177,
    66,
    180,
    30,
    211,
    73,
    233,
    156,
    200,
    198,
    199,
    34,
    110,
    219,
    32,
    191,
    67,
    81,
    82,
    102,
    178,
    118,
    96,
    218,
    197,
    243,
    246,
    170,
    205,
    154,
    160,
    117,
    84,
    14,
    1
  ]);
  function add2(a, b) {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    return a ^ b;
  }
  function div(a, b) {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    if (b === 0) {
      throw new Error("cannot divide by zero");
    }
    const logA = LOG_TABLE[a];
    const logB = LOG_TABLE[b];
    const diff = (logA - logB + 255) % 255;
    const result = EXP_TABLE[diff];
    return a === 0 ? 0 : result;
  }
  function mult(a, b) {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
      throw new RangeError("Number is out of Uint8 range");
    }
    const logA = LOG_TABLE[a];
    const logB = LOG_TABLE[b];
    const sum = (logA + logB) % 255;
    const result = EXP_TABLE[sum];
    return a === 0 || b === 0 ? 0 : result;
  }
  function interpolatePolynomial(xSamples, ySamples, x) {
    if (xSamples.length !== ySamples.length) {
      throw new Error("sample length mistmatch");
    }
    const limit = xSamples.length;
    let basis = 0;
    let result = 0;
    for (let i = 0; i < limit; i++) {
      basis = 1;
      for (let j = 0; j < limit; ++j) {
        if (i === j) {
          continue;
        }
        const num2 = add2(x, xSamples[j]);
        const denom = add2(xSamples[i], xSamples[j]);
        const term = div(num2, denom);
        basis = mult(basis, term);
      }
      result = add2(result, mult(ySamples[i], basis));
    }
    return result;
  }
  function evaluate(coefficients, x, degree) {
    if (x === 0) {
      throw new Error("cannot evaluate secret polynomial at zero");
    }
    let result = coefficients[degree];
    for (let i = degree - 1; i >= 0; i--) {
      const coefficient = coefficients[i];
      result = add2(mult(result, x), coefficient);
    }
    return result;
  }
  function newCoefficients(intercept, degree) {
    const coefficients = new Uint8Array(degree + 1);
    coefficients[0] = intercept;
    coefficients.set(getRandomBytes(degree), 1);
    return coefficients;
  }
  function newCoordinates() {
    const coordinates = new Uint8Array(255);
    for (let i = 0; i < 255; i++) {
      coordinates[i] = i + 1;
    }
    const randomIndices = getRandomBytes(255);
    for (let i = 0; i < 255; i++) {
      const j = randomIndices[i] % 255;
      const temp = coordinates[i];
      coordinates[i] = coordinates[j];
      coordinates[j] = temp;
    }
    return coordinates;
  }
  var AssertArgument = {
    instanceOf(object, constructor, message) {
      if (object.constructor !== constructor) {
        throw new TypeError(message);
      }
    },
    inRange(n, start, until, message) {
      if (!(start < until && n >= start && n < until)) {
        throw new RangeError(message);
      }
    },
    greaterThanOrEqualTo(a, b, message) {
      if (a < b) {
        throw new Error(message);
      }
    },
    equalTo(a, b, message) {
      if (a !== b) {
        throw new Error(message);
      }
    }
  };
  async function split2(secret, shares, threshold) {
    AssertArgument.instanceOf(secret, Uint8Array, "secret must be a Uint8Array");
    AssertArgument.greaterThanOrEqualTo(secret.byteLength, 1, "secret cannot be empty");
    AssertArgument.instanceOf(shares, Number, "shares must be a number");
    AssertArgument.inRange(shares, 2, 256, "shares must be at least 2 and at most 255");
    AssertArgument.instanceOf(threshold, Number, "threshold must be a number");
    AssertArgument.inRange(threshold, 2, 256, "threshold must be at least 2 and at most 255");
    AssertArgument.greaterThanOrEqualTo(shares, threshold, "shares cannot be less than threshold");
    const result = [];
    const secretLength = secret.byteLength;
    const xCoordinates = newCoordinates();
    for (let i = 0; i < shares; i++) {
      const share = new Uint8Array(secretLength + 1);
      share[secretLength] = xCoordinates[i];
      result.push(share);
    }
    const degree = threshold - 1;
    for (let i = 0; i < secretLength; i++) {
      const byte = secret[i];
      const coefficients = newCoefficients(byte, degree);
      for (let j = 0; j < shares; ++j) {
        const x = xCoordinates[j];
        const y = evaluate(coefficients, x, degree);
        result[j][i] = y;
      }
    }
    return result;
  }
  async function combine(shares) {
    AssertArgument.instanceOf(shares, Array, "shares must be an Array");
    AssertArgument.inRange(shares.length, 2, 256, "shares must have at least 2 and at most 255 elements");
    const share1 = shares[0];
    AssertArgument.instanceOf(share1, Uint8Array, "each share must be a Uint8Array");
    for (const share of shares) {
      AssertArgument.instanceOf(share, Uint8Array, "each share must be a Uint8Array");
      AssertArgument.greaterThanOrEqualTo(share.byteLength, 2, "each share must be at least 2 bytes");
      AssertArgument.equalTo(share.byteLength, share1.byteLength, "all shares must have the same byte length");
    }
    const sharesLength = shares.length;
    const shareLength = share1.byteLength;
    const secretLength = shareLength - 1;
    const secret = new Uint8Array(secretLength);
    const xSamples = new Uint8Array(sharesLength);
    const ySamples = new Uint8Array(sharesLength);
    const samples = /* @__PURE__ */ new Set();
    for (let i = 0; i < sharesLength; i++) {
      const share = shares[i];
      const sample = share[shareLength - 1];
      if (samples.has(sample)) {
        throw new Error("shares must contain unique values but a duplicate was found");
      }
      samples.add(sample);
      xSamples[i] = sample;
    }
    for (let i = 0; i < secretLength; i++) {
      for (let j = 0; j < sharesLength; ++j) {
        ySamples[j] = shares[j][i];
      }
      secret[i] = interpolatePolynomial(xSamples, ySamples, 0);
    }
    return secret;
  }

  var qrcode = function(typeNumber, errorCorrectionLevel) {
    const PAD0 = 236;
    const PAD1 = 17;
    let _typeNumber = typeNumber;
    const _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    let _modules = null;
    let _moduleCount = 0;
    let _dataCache = null;
    const _dataList = [];
    const _this = {};
    const makeImpl = function(test, maskPattern) {
      _moduleCount = _typeNumber * 4 + 17;
      _modules = (function(moduleCount) {
        const modules = new Array(moduleCount);
        for (let row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (let col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      })(_moduleCount);
      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);
      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }
      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }
      mapData(_dataCache, maskPattern);
    };
    const setupPositionProbePattern = function(row, col) {
      for (let r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || _moduleCount <= row + r) continue;
        for (let c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || _moduleCount <= col + c) continue;
          if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };
    const getBestMaskPattern = function() {
      let minLostPoint = 0;
      let pattern = 0;
      for (let i = 0; i < 8; i += 1) {
        makeImpl(true, i);
        const lostPoint = QRUtil.getLostPoint(_this);
        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }
      return pattern;
    };
    const setupTimingPattern = function() {
      for (let r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = r % 2 == 0;
      }
      for (let c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = c % 2 == 0;
      }
    };
    const setupPositionAdjustPattern = function() {
      const pos = QRUtil.getPatternPosition(_typeNumber);
      for (let i = 0; i < pos.length; i += 1) {
        for (let j = 0; j < pos.length; j += 1) {
          const row = pos[i];
          const col = pos[j];
          if (_modules[row][col] != null) {
            continue;
          }
          for (let r = -2; r <= 2; r += 1) {
            for (let c = -2; c <= 2; c += 1) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };
    const setupTypeNumber = function(test) {
      const bits = QRUtil.getBCHTypeNumber(_typeNumber);
      for (let i = 0; i < 18; i += 1) {
        const mod2 = !test && (bits >> i & 1) == 1;
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod2;
      }
      for (let i = 0; i < 18; i += 1) {
        const mod2 = !test && (bits >> i & 1) == 1;
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod2;
      }
    };
    const setupTypeInfo = function(test, maskPattern) {
      const data = _errorCorrectionLevel << 3 | maskPattern;
      const bits = QRUtil.getBCHTypeInfo(data);
      for (let i = 0; i < 15; i += 1) {
        const mod2 = !test && (bits >> i & 1) == 1;
        if (i < 6) {
          _modules[i][8] = mod2;
        } else if (i < 8) {
          _modules[i + 1][8] = mod2;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod2;
        }
      }
      for (let i = 0; i < 15; i += 1) {
        const mod2 = !test && (bits >> i & 1) == 1;
        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod2;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod2;
        } else {
          _modules[8][15 - i - 1] = mod2;
        }
      }
      _modules[_moduleCount - 8][8] = !test;
    };
    const mapData = function(data, maskPattern) {
      let inc = -1;
      let row = _moduleCount - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      const maskFunc = QRUtil.getMaskFunction(maskPattern);
      for (let col = _moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col -= 1;
        while (true) {
          for (let c = 0; c < 2; c += 1) {
            if (_modules[row][col - c] == null) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
              }
              const mask = maskFunc(row, col - c);
              if (mask) {
                dark = !dark;
              }
              _modules[row][col - c] = dark;
              bitIndex -= 1;
              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };
    const createBytes = function(buffer, rsBlocks) {
      let offset = 0;
      let maxDcCount = 0;
      let maxEcCount = 0;
      const dcdata = new Array(rsBlocks.length);
      const ecdata = new Array(rsBlocks.length);
      for (let r = 0; r < rsBlocks.length; r += 1) {
        const dcCount = rsBlocks[r].dataCount;
        const ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (let i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 255 & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;
        const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);
        const modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (let i = 0; i < ecdata[r].length; i += 1) {
          const modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
        }
      }
      let totalCodeCount = 0;
      for (let i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }
      const data = new Array(totalCodeCount);
      let index = 0;
      for (let i = 0; i < maxDcCount; i += 1) {
        for (let r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }
      for (let i = 0; i < maxEcCount; i += 1) {
        for (let r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }
      return data;
    };
    const createData = function(typeNumber2, errorCorrectionLevel2, dataList) {
      const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, errorCorrectionLevel2);
      const buffer = qrBitBuffer();
      for (let i = 0; i < dataList.length; i += 1) {
        const data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
        data.write(buffer);
      }
      let totalDataCount = 0;
      for (let i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw "code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")";
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }
      return createBytes(buffer, rsBlocks);
    };
    _this.addData = function(data, mode) {
      mode = mode || "Byte";
      let newData = null;
      switch (mode) {
        case "Numeric":
          newData = qrNumber(data);
          break;
        case "Alphanumeric":
          newData = qrAlphaNum(data);
          break;
        case "Byte":
          newData = qr8BitByte(data);
          break;
        case "Kanji":
          newData = qrKanji(data);
          break;
        default:
          throw "mode:" + mode;
      }
      _dataList.push(newData);
      _dataCache = null;
    };
    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + "," + col;
      }
      return _modules[row][col];
    };
    _this.getModuleCount = function() {
      return _moduleCount;
    };
    _this.make = function() {
      if (_typeNumber < 1) {
        let typeNumber2 = 1;
        for (; typeNumber2 < 40; typeNumber2++) {
          const rsBlocks = QRRSBlock.getRSBlocks(typeNumber2, _errorCorrectionLevel);
          const buffer = qrBitBuffer();
          for (let i = 0; i < _dataList.length; i++) {
            const data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber2));
            data.write(buffer);
          }
          let totalDataCount = 0;
          for (let i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }
          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }
        _typeNumber = typeNumber2;
      }
      makeImpl(false, getBestMaskPattern());
    };
    _this.createTableTag = function(cellSize, margin) {
      cellSize = cellSize || 2;
      margin = typeof margin == "undefined" ? cellSize * 4 : margin;
      let qrHtml = "";
      qrHtml += '<table style="';
      qrHtml += " border-width: 0px; border-style: none;";
      qrHtml += " border-collapse: collapse;";
      qrHtml += " padding: 0px; margin: " + margin + "px;";
      qrHtml += '">';
      qrHtml += "<tbody>";
      for (let r = 0; r < _this.getModuleCount(); r += 1) {
        qrHtml += "<tr>";
        for (let c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += " border-width: 0px; border-style: none;";
          qrHtml += " border-collapse: collapse;";
          qrHtml += " padding: 0px; margin: 0px;";
          qrHtml += " width: " + cellSize + "px;";
          qrHtml += " height: " + cellSize + "px;";
          qrHtml += " background-color: ";
          qrHtml += _this.isDark(r, c) ? "#000000" : "#ffffff";
          qrHtml += ";";
          qrHtml += '"/>';
        }
        qrHtml += "</tr>";
      }
      qrHtml += "</tbody>";
      qrHtml += "</table>";
      return qrHtml;
    };
    _this.createSvgTag = function(cellSize, margin, alt, title) {
      let opts2 = {};
      if (typeof arguments[0] == "object") {
        opts2 = arguments[0];
        cellSize = opts2.cellSize;
        margin = opts2.margin;
        alt = opts2.alt;
        title = opts2.title;
      }
      cellSize = cellSize || 2;
      margin = typeof margin == "undefined" ? cellSize * 4 : margin;
      alt = typeof alt === "string" ? { text: alt } : alt || {};
      alt.text = alt.text || null;
      alt.id = alt.text ? alt.id || "qrcode-description" : null;
      title = typeof title === "string" ? { text: title } : title || {};
      title.text = title.text || null;
      title.id = title.text ? title.id || "qrcode-title" : null;
      const size = _this.getModuleCount() * cellSize + margin * 2;
      let c, mc, r, mr, qrSvg = "", rect;
      rect = "l" + cellSize + ",0 0," + cellSize + " -" + cellSize + ",0 0,-" + cellSize + "z ";
      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts2.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : "";
      qrSvg += ' viewBox="0 0 ' + size + " " + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += title.text || alt.text ? ' role="img" aria-labelledby="' + escapeXml([title.id, alt.id].join(" ").trim()) + '"' : "";
      qrSvg += ">";
      qrSvg += title.text ? '<title id="' + escapeXml(title.id) + '">' + escapeXml(title.text) + "</title>" : "";
      qrSvg += alt.text ? '<description id="' + escapeXml(alt.id) + '">' + escapeXml(alt.text) + "</description>" : "";
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';
      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c)) {
            mc = c * cellSize + margin;
            qrSvg += "M" + mc + "," + mr + rect;
          }
        }
      }
      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += "</svg>";
      return qrSvg;
    };
    _this.createDataURL = function(cellSize, margin) {
      cellSize = cellSize || 2;
      margin = typeof margin == "undefined" ? cellSize * 4 : margin;
      const size = _this.getModuleCount() * cellSize + margin * 2;
      const min = margin;
      const max = size - margin;
      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          const c = Math.floor((x - min) / cellSize);
          const r = Math.floor((y - min) / cellSize);
          return _this.isDark(r, c) ? 0 : 1;
        } else {
          return 1;
        }
      });
    };
    _this.createImgTag = function(cellSize, margin, alt) {
      cellSize = cellSize || 2;
      margin = typeof margin == "undefined" ? cellSize * 4 : margin;
      const size = _this.getModuleCount() * cellSize + margin * 2;
      let img = "";
      img += "<img";
      img += ' src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += ' width="';
      img += size;
      img += '"';
      img += ' height="';
      img += size;
      img += '"';
      if (alt) {
        img += ' alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += "/>";
      return img;
    };
    const escapeXml = function(s) {
      let escaped = "";
      for (let i = 0; i < s.length; i += 1) {
        const c = s.charAt(i);
        switch (c) {
          case "<":
            escaped += "&lt;";
            break;
          case ">":
            escaped += "&gt;";
            break;
          case "&":
            escaped += "&amp;";
            break;
          case '"':
            escaped += "&quot;";
            break;
          default:
            escaped += c;
            break;
        }
      }
      return escaped;
    };
    const _createHalfASCII = function(margin) {
      const cellSize = 1;
      margin = typeof margin == "undefined" ? cellSize * 2 : margin;
      const size = _this.getModuleCount() * cellSize + margin * 2;
      const min = margin;
      const max = size - margin;
      let y, x, r1, r2, p;
      const blocks = {
        "██": "█",
        "█ ": "▀",
        " █": "▄",
        "  ": " "
      };
      const blocksLastLineNoMargin = {
        "██": "▀",
        "█ ": "▀",
        " █": " ",
        "  ": " "
      };
      let ascii = "";
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = "█";
          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = " ";
          }
          if (min <= x && x < max && min <= y + 1 && y + 1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += " ";
          } else {
            p += "█";
          }
          ascii += margin < 1 && y + 1 >= max ? blocksLastLineNoMargin[p] : blocks[p];
        }
        ascii += "\n";
      }
      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size + 1).join("▀");
      }
      return ascii.substring(0, ascii.length - 1);
    };
    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;
      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }
      cellSize -= 1;
      margin = typeof margin == "undefined" ? cellSize * 2 : margin;
      const size = _this.getModuleCount() * cellSize + margin * 2;
      const min = margin;
      const max = size - margin;
      let y, x, r, p;
      const white = Array(cellSize + 1).join("██");
      const black = Array(cellSize + 1).join("  ");
      let ascii = "";
      let line = "";
      for (y = 0; y < size; y += 1) {
        r = Math.floor((y - min) / cellSize);
        line = "";
        for (x = 0; x < size; x += 1) {
          p = 1;
          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }
          line += p ? white : black;
        }
        for (r = 0; r < cellSize; r += 1) {
          ascii += line + "\n";
        }
      }
      return ascii.substring(0, ascii.length - 1);
    };
    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      const length = _this.getModuleCount();
      for (let row = 0; row < length; row++) {
        for (let col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? "black" : "white";
          context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    };
    return _this;
  };
  qrcode.stringToBytes = function(s) {
    const bytes = [];
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      bytes.push(c & 255);
    }
    return bytes;
  };
  qrcode.createStringToBytes = function(unicodeData, numChars) {
    const unicodeMap = (function() {
      const bin = base64DecodeInputStream(unicodeData);
      const read = function() {
        const b = bin.read();
        if (b == -1) throw "eof";
        return b;
      };
      let count = 0;
      const unicodeMap2 = {};
      while (true) {
        const b0 = bin.read();
        if (b0 == -1) break;
        const b1 = read();
        const b2 = read();
        const b3 = read();
        const k = String.fromCharCode(b0 << 8 | b1);
        const v = b2 << 8 | b3;
        unicodeMap2[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + " != " + numChars;
      }
      return unicodeMap2;
    })();
    const unknownChar = "?".charCodeAt(0);
    return function(s) {
      const bytes = [];
      for (let i = 0; i < s.length; i += 1) {
        const c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          const b = unicodeMap[s.charAt(i)];
          if (typeof b == "number") {
            if ((b & 255) == b) {
              bytes.push(b);
            } else {
              bytes.push(b >>> 8);
              bytes.push(b & 255);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };
  var QRMode = {
    MODE_NUMBER: 1 << 0,
    MODE_ALPHA_NUM: 1 << 1,
    MODE_8BIT_BYTE: 1 << 2,
    MODE_KANJI: 1 << 3
  };
  var QRErrorCorrectionLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
  };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var QRUtil = (function() {
    const PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    const _this = {};
    const getBCHDigit = function(data) {
      let digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };
    _this.getBCHTypeInfo = function(data) {
      let d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= G15 << getBCHDigit(d) - getBCHDigit(G15);
      }
      return (data << 10 | d) ^ G15_MASK;
    };
    _this.getBCHTypeNumber = function(data) {
      let d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= G18 << getBCHDigit(d) - getBCHDigit(G18);
      }
      return data << 12 | d;
    };
    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };
    _this.getMaskFunction = function(maskPattern) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return function(i, j) {
            return (i + j) % 2 == 0;
          };
        case QRMaskPattern.PATTERN001:
          return function(i, j) {
            return i % 2 == 0;
          };
        case QRMaskPattern.PATTERN010:
          return function(i, j) {
            return j % 3 == 0;
          };
        case QRMaskPattern.PATTERN011:
          return function(i, j) {
            return (i + j) % 3 == 0;
          };
        case QRMaskPattern.PATTERN100:
          return function(i, j) {
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
          };
        case QRMaskPattern.PATTERN101:
          return function(i, j) {
            return i * j % 2 + i * j % 3 == 0;
          };
        case QRMaskPattern.PATTERN110:
          return function(i, j) {
            return (i * j % 2 + i * j % 3) % 2 == 0;
          };
        case QRMaskPattern.PATTERN111:
          return function(i, j) {
            return (i * j % 3 + (i + j) % 2) % 2 == 0;
          };
        default:
          throw "bad maskPattern:" + maskPattern;
      }
    };
    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      let a = qrPolynomial([1], 0);
      for (let i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    };
    _this.getLengthInBits = function(mode, type) {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw "mode:" + mode;
        }
      } else if (type < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw "mode:" + mode;
        }
      } else if (type < 41) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw "mode:" + mode;
        }
      } else {
        throw "type:" + type;
      }
    };
    _this.getLostPoint = function(qrcode2) {
      const moduleCount = qrcode2.getModuleCount();
      let lostPoint = 0;
      for (let row = 0; row < moduleCount; row += 1) {
        for (let col = 0; col < moduleCount; col += 1) {
          let sameCount = 0;
          const dark = qrcode2.isDark(row, col);
          for (let r = -1; r <= 1; r += 1) {
            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }
            for (let c = -1; c <= 1; c += 1) {
              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }
              if (r == 0 && c == 0) {
                continue;
              }
              if (dark == qrcode2.isDark(row + r, col + c)) {
                sameCount += 1;
              }
            }
          }
          if (sameCount > 5) {
            lostPoint += 3 + sameCount - 5;
          }
        }
      }
      ;
      for (let row = 0; row < moduleCount - 1; row += 1) {
        for (let col = 0; col < moduleCount - 1; col += 1) {
          let count = 0;
          if (qrcode2.isDark(row, col)) count += 1;
          if (qrcode2.isDark(row + 1, col)) count += 1;
          if (qrcode2.isDark(row, col + 1)) count += 1;
          if (qrcode2.isDark(row + 1, col + 1)) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }
      for (let row = 0; row < moduleCount; row += 1) {
        for (let col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode2.isDark(row, col) && !qrcode2.isDark(row, col + 1) && qrcode2.isDark(row, col + 2) && qrcode2.isDark(row, col + 3) && qrcode2.isDark(row, col + 4) && !qrcode2.isDark(row, col + 5) && qrcode2.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (let col = 0; col < moduleCount; col += 1) {
        for (let row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode2.isDark(row, col) && !qrcode2.isDark(row + 1, col) && qrcode2.isDark(row + 2, col) && qrcode2.isDark(row + 3, col) && qrcode2.isDark(row + 4, col) && !qrcode2.isDark(row + 5, col) && qrcode2.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      let darkCount = 0;
      for (let col = 0; col < moduleCount; col += 1) {
        for (let row = 0; row < moduleCount; row += 1) {
          if (qrcode2.isDark(row, col)) {
            darkCount += 1;
          }
        }
      }
      const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    };
    return _this;
  })();
  var QRMath = (function() {
    const EXP_TABLE2 = new Array(256);
    const LOG_TABLE2 = new Array(256);
    for (let i = 0; i < 8; i += 1) {
      EXP_TABLE2[i] = 1 << i;
    }
    for (let i = 8; i < 256; i += 1) {
      EXP_TABLE2[i] = EXP_TABLE2[i - 4] ^ EXP_TABLE2[i - 5] ^ EXP_TABLE2[i - 6] ^ EXP_TABLE2[i - 8];
    }
    for (let i = 0; i < 255; i += 1) {
      LOG_TABLE2[EXP_TABLE2[i]] = i;
    }
    const _this = {};
    _this.glog = function(n) {
      if (n < 1) {
        throw "glog(" + n + ")";
      }
      return LOG_TABLE2[n];
    };
    _this.gexp = function(n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return EXP_TABLE2[n];
    };
    return _this;
  })();
  var qrPolynomial = function(num2, shift) {
    if (typeof num2.length == "undefined") {
      throw num2.length + "/" + shift;
    }
    const _num = (function() {
      let offset = 0;
      while (offset < num2.length && num2[offset] == 0) {
        offset += 1;
      }
      const _num2 = new Array(num2.length - offset + shift);
      for (let i = 0; i < num2.length - offset; i += 1) {
        _num2[i] = num2[i + offset];
      }
      return _num2;
    })();
    const _this = {};
    _this.getAt = function(index) {
      return _num[index];
    };
    _this.getLength = function() {
      return _num.length;
    };
    _this.multiply = function(e) {
      const num3 = new Array(_this.getLength() + e.getLength() - 1);
      for (let i = 0; i < _this.getLength(); i += 1) {
        for (let j = 0; j < e.getLength(); j += 1) {
          num3[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i)) + QRMath.glog(e.getAt(j)));
        }
      }
      return qrPolynomial(num3, 0);
    };
    _this.mod = function(e) {
      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }
      const ratio = QRMath.glog(_this.getAt(0)) - QRMath.glog(e.getAt(0));
      const num3 = new Array(_this.getLength());
      for (let i = 0; i < _this.getLength(); i += 1) {
        num3[i] = _this.getAt(i);
      }
      for (let i = 0; i < e.getLength(); i += 1) {
        num3[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
      }
      return qrPolynomial(num3, 0).mod(e);
    };
    return _this;
  };
  var QRRSBlock = (function() {
    const RS_BLOCK_TABLE = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];
    const qrRSBlock = function(totalCount, dataCount) {
      const _this2 = {};
      _this2.totalCount = totalCount;
      _this2.dataCount = dataCount;
      return _this2;
    };
    const _this = {};
    const getRsBlockTable = function(typeNumber, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case QRErrorCorrectionLevel.L:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectionLevel.M:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectionLevel.Q:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectionLevel.H:
          return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {
      const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);
      if (typeof rsBlock == "undefined") {
        throw "bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel;
      }
      const length = rsBlock.length / 3;
      const list = [];
      for (let i = 0; i < length; i += 1) {
        const count = rsBlock[i * 3 + 0];
        const totalCount = rsBlock[i * 3 + 1];
        const dataCount = rsBlock[i * 3 + 2];
        for (let j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount));
        }
      }
      return list;
    };
    return _this;
  })();
  var qrBitBuffer = function() {
    const _buffer = [];
    let _length = 0;
    const _this = {};
    _this.getBuffer = function() {
      return _buffer;
    };
    _this.getAt = function(index) {
      const bufIndex = Math.floor(index / 8);
      return (_buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
    };
    _this.put = function(num2, length) {
      for (let i = 0; i < length; i += 1) {
        _this.putBit((num2 >>> length - i - 1 & 1) == 1);
      }
    };
    _this.getLengthInBits = function() {
      return _length;
    };
    _this.putBit = function(bit) {
      const bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }
      if (bit) {
        _buffer[bufIndex] |= 128 >>> _length % 8;
      }
      _length += 1;
    };
    return _this;
  };
  var qrNumber = function(data) {
    const _mode = QRMode.MODE_NUMBER;
    const _data = data;
    const _this = {};
    _this.getMode = function() {
      return _mode;
    };
    _this.getLength = function(buffer) {
      return _data.length;
    };
    _this.write = function(buffer) {
      const data2 = _data;
      let i = 0;
      while (i + 2 < data2.length) {
        buffer.put(strToNum(data2.substring(i, i + 3)), 10);
        i += 3;
      }
      if (i < data2.length) {
        if (data2.length - i == 1) {
          buffer.put(strToNum(data2.substring(i, i + 1)), 4);
        } else if (data2.length - i == 2) {
          buffer.put(strToNum(data2.substring(i, i + 2)), 7);
        }
      }
    };
    const strToNum = function(s) {
      let num2 = 0;
      for (let i = 0; i < s.length; i += 1) {
        num2 = num2 * 10 + chatToNum(s.charAt(i));
      }
      return num2;
    };
    const chatToNum = function(c) {
      if ("0" <= c && c <= "9") {
        return c.charCodeAt(0) - "0".charCodeAt(0);
      }
      throw "illegal char :" + c;
    };
    return _this;
  };
  var qrAlphaNum = function(data) {
    const _mode = QRMode.MODE_ALPHA_NUM;
    const _data = data;
    const _this = {};
    _this.getMode = function() {
      return _mode;
    };
    _this.getLength = function(buffer) {
      return _data.length;
    };
    _this.write = function(buffer) {
      const s = _data;
      let i = 0;
      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i)) * 45 + getCode(s.charAt(i + 1)),
          11
        );
        i += 2;
      }
      if (i < s.length) {
        buffer.put(getCode(s.charAt(i)), 6);
      }
    };
    const getCode = function(c) {
      if ("0" <= c && c <= "9") {
        return c.charCodeAt(0) - "0".charCodeAt(0);
      } else if ("A" <= c && c <= "Z") {
        return c.charCodeAt(0) - "A".charCodeAt(0) + 10;
      } else {
        switch (c) {
          case " ":
            return 36;
          case "$":
            return 37;
          case "%":
            return 38;
          case "*":
            return 39;
          case "+":
            return 40;
          case "-":
            return 41;
          case ".":
            return 42;
          case "/":
            return 43;
          case ":":
            return 44;
          default:
            throw "illegal char :" + c;
        }
      }
    };
    return _this;
  };
  var qr8BitByte = function(data) {
    const _mode = QRMode.MODE_8BIT_BYTE;
    const _data = data;
    const _bytes = qrcode.stringToBytes(data);
    const _this = {};
    _this.getMode = function() {
      return _mode;
    };
    _this.getLength = function(buffer) {
      return _bytes.length;
    };
    _this.write = function(buffer) {
      for (let i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };
    return _this;
  };
  var qrKanji = function(data) {
    const _mode = QRMode.MODE_KANJI;
    const _data = data;
    const stringToBytes2 = qrcode.stringToBytes;
    !(function(c, code) {
      const test = stringToBytes2(c);
      if (test.length != 2 || (test[0] << 8 | test[1]) != code) {
        throw "sjis not supported.";
      }
    })("友", 38726);
    const _bytes = stringToBytes2(data);
    const _this = {};
    _this.getMode = function() {
      return _mode;
    };
    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };
    _this.write = function(buffer) {
      const data2 = _bytes;
      let i = 0;
      while (i + 1 < data2.length) {
        let c = (255 & data2[i]) << 8 | 255 & data2[i + 1];
        if (33088 <= c && c <= 40956) {
          c -= 33088;
        } else if (57408 <= c && c <= 60351) {
          c -= 49472;
        } else {
          throw "illegal char at " + (i + 1) + "/" + c;
        }
        c = (c >>> 8 & 255) * 192 + (c & 255);
        buffer.put(c, 13);
        i += 2;
      }
      if (i < data2.length) {
        throw "illegal char at " + (i + 1);
      }
    };
    return _this;
  };
  var byteArrayOutputStream = function() {
    const _bytes = [];
    const _this = {};
    _this.writeByte = function(b) {
      _bytes.push(b & 255);
    };
    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };
    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (let i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };
    _this.writeString = function(s) {
      for (let i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i));
      }
    };
    _this.toByteArray = function() {
      return _bytes;
    };
    _this.toString = function() {
      let s = "";
      s += "[";
      for (let i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ",";
        }
        s += _bytes[i];
      }
      s += "]";
      return s;
    };
    return _this;
  };
  var base64EncodeOutputStream = function() {
    let _buffer = 0;
    let _buflen = 0;
    let _length = 0;
    let _base64 = "";
    const _this = {};
    const writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 63));
    };
    const encode = function(n) {
      if (n < 0) {
        throw "n:" + n;
      } else if (n < 26) {
        return 65 + n;
      } else if (n < 52) {
        return 97 + (n - 26);
      } else if (n < 62) {
        return 48 + (n - 52);
      } else if (n == 62) {
        return 43;
      } else if (n == 63) {
        return 47;
      } else {
        throw "n:" + n;
      }
    };
    _this.writeByte = function(n) {
      _buffer = _buffer << 8 | n & 255;
      _buflen += 8;
      _length += 1;
      while (_buflen >= 6) {
        writeEncoded(_buffer >>> _buflen - 6);
        _buflen -= 6;
      }
    };
    _this.flush = function() {
      if (_buflen > 0) {
        writeEncoded(_buffer << 6 - _buflen);
        _buffer = 0;
        _buflen = 0;
      }
      if (_length % 3 != 0) {
        const padlen = 3 - _length % 3;
        for (let i = 0; i < padlen; i += 1) {
          _base64 += "=";
        }
      }
    };
    _this.toString = function() {
      return _base64;
    };
    return _this;
  };
  var base64DecodeInputStream = function(str) {
    const _str = str;
    let _pos = 0;
    let _buffer = 0;
    let _buflen = 0;
    const _this = {};
    _this.read = function() {
      while (_buflen < 8) {
        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw "unexpected end of file./" + _buflen;
        }
        const c = _str.charAt(_pos);
        _pos += 1;
        if (c == "=") {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/)) {
          continue;
        }
        _buffer = _buffer << 6 | decode(c.charCodeAt(0));
        _buflen += 6;
      }
      const n = _buffer >>> _buflen - 8 & 255;
      _buflen -= 8;
      return n;
    };
    const decode = function(c) {
      if (65 <= c && c <= 90) {
        return c - 65;
      } else if (97 <= c && c <= 122) {
        return c - 97 + 26;
      } else if (48 <= c && c <= 57) {
        return c - 48 + 52;
      } else if (c == 43) {
        return 62;
      } else if (c == 47) {
        return 63;
      } else {
        throw "c:" + c;
      }
    };
    return _this;
  };
  var gifImage = function(width, height) {
    const _width = width;
    const _height = height;
    const _data = new Array(width * height);
    const _this = {};
    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };
    _this.write = function(out) {
      out.writeString("GIF87a");
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(128);
      out.writeByte(0);
      out.writeByte(0);
      out.writeByte(0);
      out.writeByte(0);
      out.writeByte(0);
      out.writeByte(255);
      out.writeByte(255);
      out.writeByte(255);
      out.writeString(",");
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);
      const lzwMinCodeSize = 2;
      const raster = getLZWRaster(lzwMinCodeSize);
      out.writeByte(lzwMinCodeSize);
      let offset = 0;
      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }
      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0);
      out.writeString(";");
    };
    const bitOutputStream = function(out) {
      const _out = out;
      let _bitLength = 0;
      let _bitBuffer = 0;
      const _this2 = {};
      _this2.write = function(data, length) {
        if (data >>> length != 0) {
          throw "length over";
        }
        while (_bitLength + length >= 8) {
          _out.writeByte(255 & (data << _bitLength | _bitBuffer));
          length -= 8 - _bitLength;
          data >>>= 8 - _bitLength;
          _bitBuffer = 0;
          _bitLength = 0;
        }
        _bitBuffer = data << _bitLength | _bitBuffer;
        _bitLength = _bitLength + length;
      };
      _this2.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };
      return _this2;
    };
    const getLZWRaster = function(lzwMinCodeSize) {
      const clearCode = 1 << lzwMinCodeSize;
      const endCode = (1 << lzwMinCodeSize) + 1;
      let bitLength = lzwMinCodeSize + 1;
      const table = lzwTable();
      for (let i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i));
      }
      table.add(String.fromCharCode(clearCode));
      table.add(String.fromCharCode(endCode));
      const byteOut = byteArrayOutputStream();
      const bitOut = bitOutputStream(byteOut);
      bitOut.write(clearCode, bitLength);
      let dataIndex = 0;
      let s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;
      while (dataIndex < _data.length) {
        const c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;
        if (table.contains(s + c)) {
          s = s + c;
        } else {
          bitOut.write(table.indexOf(s), bitLength);
          if (table.size() < 4095) {
            if (table.size() == 1 << bitLength) {
              bitLength += 1;
            }
            table.add(s + c);
          }
          s = c;
        }
      }
      bitOut.write(table.indexOf(s), bitLength);
      bitOut.write(endCode, bitLength);
      bitOut.flush();
      return byteOut.toByteArray();
    };
    const lzwTable = function() {
      const _map = {};
      let _size = 0;
      const _this2 = {};
      _this2.add = function(key) {
        if (_this2.contains(key)) {
          throw "dup key:" + key;
        }
        _map[key] = _size;
        _size += 1;
      };
      _this2.size = function() {
        return _size;
      };
      _this2.indexOf = function(key) {
        return _map[key];
      };
      _this2.contains = function(key) {
        return typeof _map[key] != "undefined";
      };
      return _this2;
    };
    return _this;
  };
  var createDataURL = function(width, height, getPixel) {
    const gif = gifImage(width, height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y));
      }
    }
    const b = byteArrayOutputStream();
    gif.write(b);
    const base64 = base64EncodeOutputStream();
    const bytes = b.toByteArray();
    for (let i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();
    return "data:image/gif;base64," + base64;
  };
  var qrcode_default = qrcode;
  var stringToBytes = qrcode.stringToBytes;

  globalThis.sbShepotLib = { x448, ml_kem1024, xchacha20poly1305, gcm, hkdf, hmac, sha512, sha256, schnorr, split: split2, combine, qrcode: qrcode_default };
})();
