/* =============================================================================
   sys.baby — QR ENCODER (ISO/IEC 18004), byte mode, error correction level M
   -----------------------------------------------------------------------------
   Why this file exists.

   The estimate prints a SEPA payment code (EPC069-12): a customer points a
   banking app at the document and the transfer is pre-filled. That capability
   is real and worth keeping, so when the case stopped depending on a server we
   could not simply drop it along with the two libraries that only existed to
   feed the server an archive copy.

   The old page loaded qrcodejs from a CDN. A page that promises to work with
   nothing behind it must not, in its last line, phone a stranger for a picture.
   So the encoder is ours: about three hundred lines, no dependencies, no
   network, and no licence but our own.

   Scope is deliberately narrow — byte mode, level M, versions 1 to 13. That
   covers every payload EPC069-12 permits (331 bytes maximum) and not one case
   more. Untested generality is not a feature; a version we never emit is a
   version nothing ever proved.

   How it is known to work: tools/qr-verify.mjs renders the matrices this file
   produces and has an INDEPENDENT decoder (OpenCV) read them back. A QR that
   merely looks like a QR is worthless — a payment code is either scanned by a
   real bank application or it is a decoration. The verification asserts the
   decoded text is byte-identical to the payload, across every version, and it
   runs on the real SEPA payloads from the golden vectors.

   Structure, in the order the standard applies it:
     1. data codewords    mode + length + payload + terminator + pad
     2. error correction  Reed-Solomon over GF(256), per block
     3. interleaving      data blocks, then EC blocks
     4. matrix            finders, separators, timing, alignment, dark module
     5. format + version  BCH-protected, computed here rather than transcribed
     6. masking           all eight patterns scored, lowest penalty wins
   ============================================================================= */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.SBQR = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* Level M block structure, versions 1..10:
     [ecCodewordsPerBlock, group1Blocks, group1DataCodewords, group2Blocks, group2DataCodewords] */
  var RS_M = {
    1:  [10, 1, 16, 0, 0],
    2:  [16, 1, 28, 0, 0],
    3:  [26, 1, 44, 0, 0],
    4:  [18, 2, 32, 0, 0],
    5:  [24, 2, 43, 0, 0],
    6:  [16, 4, 27, 0, 0],
    7:  [18, 4, 31, 0, 0],
    8:  [22, 2, 38, 2, 39],
    9:  [22, 3, 36, 2, 37],
    10: [26, 4, 43, 1, 44],
    11: [30, 1, 50, 4, 51],
    12: [22, 6, 36, 2, 37],
    13: [22, 8, 37, 1, 38]
  };

  /* Alignment pattern centres per version (empty for version 1). */
  var ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
    11: [6, 30, 54], 12: [6, 32, 58], 13: [6, 34, 62]
  };

  /* Version 13 at level M holds 334 data codewords — more than EPC069-12 can
     ever ask for (331 bytes), and comfortably past what this document builds
     (a 70-character beneficiary and a 140-character reference). Stopping here
     is the honest boundary: every version below is exercised by the verifier,
     and nothing above it was ever needed. */
  var MAX_VERSION = 13;

  /* ------------------------------------------------------------- GF(256) */
  /* Field of the standard: primitive polynomial 0x11D, generator 2. */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function buildTables() {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gfMul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  /* Generator polynomial of degree `degree`, coefficients high-to-low. */
  function rsGenerator(degree) {
    var poly = [1];
    for (var d = 0; d < degree; d++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var i = 0; i < poly.length; i++) {
        next[i] ^= gfMul(poly[i], 1);
        next[i + 1] ^= gfMul(poly[i], EXP[d]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenerator(ecLen);
    var res = new Array(data.length + ecLen).fill(0);
    for (var i = 0; i < data.length; i++) res[i] = data[i];
    for (var k = 0; k < data.length; k++) {
      var factor = res[k];
      if (factor === 0) continue;
      for (var j = 0; j < gen.length; j++) res[k + j] ^= gfMul(gen[j], factor);
    }
    return res.slice(data.length);
  }

  /* --------------------------------------------------------------- BCH */
  /* Format and version information carry their own error correction. Both are
     computed rather than copied from a table — a transcription error in a
     lookup table is invisible until a scanner refuses the code. */
  function bchRemainder(value, generator, genBits) {
    var v = value;
    var vBits = bitLength(v);
    while (vBits >= genBits) {
      v ^= generator << (vBits - genBits);
      vBits = bitLength(v);
    }
    return v;
  }
  function bitLength(v) { var n = 0; while (v) { n++; v >>>= 1; } return n; }

  /* 5 bits (2 ec level + 3 mask) -> 15 protected bits, XOR 0x5412. */
  function formatBits(ecBits, mask) {
    var data = (ecBits << 3) | mask;
    var rem = bchRemainder(data << 10, 0x537, 11);
    return ((data << 10) | rem) ^ 0x5412;
  }
  /* version -> 18 protected bits (only versions 7 and above carry it). */
  function versionBits(version) {
    var rem = bchRemainder(version << 12, 0x1F25, 13);
    return (version << 12) | rem;
  }

  var EC_BITS_M = 0;   /* level M is 00 in the format information */

  /* -------------------------------------------------------- data encoding */

  function utf8Bytes(text) {
    if (typeof TextEncoder !== "undefined") return Array.from(new TextEncoder().encode(text));
    /* Node without TextEncoder, or a very old browser. */
    var out = [], s = unescape(encodeURIComponent(String(text)));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i) & 0xff);
    return out;
  }

  function capacityBytes(version) {
    var r = RS_M[version];
    var total = r[1] * r[2] + r[3] * r[4];
    var countBits = version < 10 ? 8 : 16;
    return total - 2 - Math.ceil(countBits / 8) + (countBits === 8 ? 1 : 0) - 0;
  }

  /* Exact data capacity: total data codewords minus mode(4) + count bits. */
  function fitsIn(version, byteLen) {
    var r = RS_M[version];
    var dataCodewords = r[1] * r[2] + r[3] * r[4];
    var countBits = version < 10 ? 8 : 16;
    var needBits = 4 + countBits + byteLen * 8;
    return needBits <= dataCodewords * 8;
  }

  function chooseVersion(byteLen) {
    for (var v = 1; v <= MAX_VERSION; v++) if (fitsIn(v, byteLen)) return v;
    return 0;
  }

  function buildCodewords(bytes, version) {
    var r = RS_M[version];
    var dataCodewords = r[1] * r[2] + r[3] * r[4];
    var countBits = version < 10 ? 8 : 16;

    var bits = [];
    function push(value, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
    }
    push(0x4, 4);                       /* byte mode */
    push(bytes.length, countBits);
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    /* terminator, up to four zero bits */
    var capacityBits = dataCodewords * 8;
    var terminator = Math.min(4, capacityBits - bits.length);
    for (var t = 0; t < terminator; t++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    var data = [];
    for (var b = 0; b < bits.length; b += 8) {
      var byte = 0;
      for (var k = 0; k < 8; k++) byte = (byte << 1) | bits[b + k];
      data.push(byte);
    }
    /* pad alternately with 236 and 17 until the block is full */
    var pads = [0xEC, 0x11], p = 0;
    while (data.length < dataCodewords) { data.push(pads[p]); p ^= 1; }

    /* split into blocks, compute EC per block, then interleave */
    var blocks = [], ecBlocks = [], at = 0;
    function take(count, size) {
      for (var i = 0; i < count; i++) {
        var block = data.slice(at, at + size);
        at += size;
        blocks.push(block);
        ecBlocks.push(rsEncode(block, r[0]));
      }
    }
    take(r[1], r[2]);
    take(r[3], r[4]);

    var out = [];
    var maxData = Math.max(r[2], r[4] || 0);
    for (var col = 0; col < maxData; col++) {
      for (var bi = 0; bi < blocks.length; bi++) if (col < blocks[bi].length) out.push(blocks[bi][col]);
    }
    for (var ec = 0; ec < r[0]; ec++) {
      for (var bj = 0; bj < ecBlocks.length; bj++) out.push(ecBlocks[bj][ec]);
    }
    return out;
  }

  /* -------------------------------------------------------------- matrix */

  function newMatrix(size) {
    var m = [];
    for (var i = 0; i < size; i++) m.push(new Array(size).fill(null));   /* null = free */
    return m;
  }

  function placeFinder(m, row, col) {
    for (var r = -1; r <= 7; r++) {
      for (var c = -1; c <= 7; c++) {
        var rr = row + r, cc = col + c;
        if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
        var inRing = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                     (c >= 0 && c <= 6 && (r === 0 || r === 6));
        var inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr][cc] = (inRing || inCore) ? 1 : 0;
      }
    }
  }

  function placeFunctionPatterns(m, version) {
    var size = m.length;
    placeFinder(m, 0, 0);
    placeFinder(m, 0, size - 7);
    placeFinder(m, size - 7, 0);

    /* timing patterns */
    for (var i = 8; i < size - 8; i++) {
      var bit = (i % 2 === 0) ? 1 : 0;
      if (m[6][i] === null) m[6][i] = bit;
      if (m[i][6] === null) m[i][6] = bit;
    }

    /* alignment patterns, skipping the three finder corners */
    var centres = ALIGN[version] || [];
    for (var a = 0; a < centres.length; a++) {
      for (var b = 0; b < centres.length; b++) {
        var cr = centres[a], cc2 = centres[b];
        if ((cr <= 8 && cc2 <= 8) || (cr <= 8 && cc2 >= size - 9) || (cr >= size - 9 && cc2 <= 8)) continue;
        for (var dr = -2; dr <= 2; dr++) {
          for (var dc = -2; dc <= 2; dc++) {
            var ring = Math.max(Math.abs(dr), Math.abs(dc));
            m[cr + dr][cc2 + dc] = (ring === 1) ? 0 : 1;
          }
        }
      }
    }

    /* the dark module — always set, always here */
    m[size - 8][8] = 1;

    /* reserve the format areas so data never lands in them */
    for (var f = 0; f <= 8; f++) {
      if (m[8][f] === null) m[8][f] = 2;
      if (m[f][8] === null) m[f][8] = 2;
    }
    for (var g = 0; g < 8; g++) {
      if (m[8][size - 1 - g] === null) m[8][size - 1 - g] = 2;
      if (m[size - 1 - g][8] === null) m[size - 1 - g][8] = 2;
    }
    /* and the version areas, from version 7 up */
    if (version >= 7) {
      for (var r2 = 0; r2 < 6; r2++) {
        for (var c2 = 0; c2 < 3; c2++) {
          m[size - 11 + c2][r2] = 2;
          m[r2][size - 11 + c2] = 2;
        }
      }
    }
  }

  function placeData(m, codewords) {
    var size = m.length;
    var bitIndex = 0;
    var total = codewords.length * 8;
    function nextBit() {
      if (bitIndex >= total) return 0;                /* remainder bits are zero */
      var byte = codewords[bitIndex >> 3];
      var bit = (byte >>> (7 - (bitIndex & 7))) & 1;
      bitIndex++;
      return bit;
    }
    var upward = true;
    for (var col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;                            /* the vertical timing column */
      for (var i = 0; i < size; i++) {
        var row = upward ? (size - 1 - i) : i;
        for (var c = 0; c < 2; c++) {
          var cc = col - c;
          if (m[row][cc] !== null) continue;
          m[row][cc] = nextBit();
        }
      }
      upward = !upward;
    }
  }

  function maskBit(mask, row, col) {
    switch (mask) {
      case 0: return (row + col) % 2 === 0;
      case 1: return row % 2 === 0;
      case 2: return col % 3 === 0;
      case 3: return (row + col) % 3 === 0;
      case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5: return ((row * col) % 2) + ((row * col) % 3) === 0;
      case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
      default: return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
    }
  }

  /* Penalty rules 1-4 of the standard. Lower is better. */
  function penalty(m) {
    var size = m.length, score = 0, i, j, run, prev;

    for (i = 0; i < size; i++) {
      run = 1; prev = m[i][0];
      for (j = 1; j < size; j++) {
        if (m[i][j] === prev) { run++; } else { if (run >= 5) score += 3 + (run - 5); run = 1; prev = m[i][j]; }
      }
      if (run >= 5) score += 3 + (run - 5);

      run = 1; prev = m[0][i];
      for (j = 1; j < size; j++) {
        if (m[j][i] === prev) { run++; } else { if (run >= 5) score += 3 + (run - 5); run = 1; prev = m[j][i]; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }

    for (i = 0; i < size - 1; i++) {
      for (j = 0; j < size - 1; j++) {
        var v = m[i][j];
        if (v === m[i][j + 1] && v === m[i + 1][j] && v === m[i + 1][j + 1]) score += 3;
      }
    }

    var patternA = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    var patternB = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function matches(get, at, pattern) {
      for (var k = 0; k < pattern.length; k++) if (get(at + k) !== pattern[k]) return false;
      return true;
    }
    for (i = 0; i < size; i++) {
      for (j = 0; j <= size - 11; j++) {
        var rowGet = function (x) { return m[i][x]; };
        var colGet = function (x) { return m[x][i]; };
        if (matches(rowGet, j, patternA) || matches(rowGet, j, patternB)) score += 40;
        if (matches(colGet, j, patternA) || matches(colGet, j, patternB)) score += 40;
      }
    }

    var dark = 0;
    for (i = 0; i < size; i++) for (j = 0; j < size; j++) if (m[i][j]) dark++;
    var percent = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(percent - 50) / 5) * 10;
    return score;
  }

  function applyFormat(m, mask) {
    var size = m.length;
    var bits = formatBits(EC_BITS_M, mask);
    for (var i = 0; i <= 5; i++) m[8][i] = (bits >>> (14 - i)) & 1;
    m[8][7] = (bits >>> 8) & 1;
    m[8][8] = (bits >>> 7) & 1;
    m[7][8] = (bits >>> 6) & 1;
    for (var j = 9; j <= 14; j++) m[14 - j][8] = (bits >>> (14 - j)) & 1;

    for (var k = 0; k <= 7; k++) m[size - 1 - k][8] = (bits >>> (14 - k)) & 1;
    for (var n = 8; n <= 14; n++) m[8][size - 15 + n] = (bits >>> (14 - n)) & 1;
  }

  function applyVersion(m, version) {
    if (version < 7) return;
    var size = m.length;
    var bits = versionBits(version);
    for (var i = 0; i < 18; i++) {
      var bit = (bits >>> i) & 1;
      var row = Math.floor(i / 3), col = i % 3;
      m[size - 11 + col][row] = bit;
      m[row][size - 11 + col] = bit;
    }
  }

  /* ---------------------------------------------------------------- public */

  /* encode(text) -> { size, modules: [[0|1,...],...], version } or null.
     null means "this does not fit in the versions we support" — the caller
     must then print no QR at all, because an unreadable payment code is worse
     than a document without one. */
  function encode(text) {
    var bytes = utf8Bytes(text);
    var version = chooseVersion(bytes.length);
    if (!version) return null;

    var codewords = buildCodewords(bytes, version);
    var size = version * 4 + 17;

    var best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var m = newMatrix(size);
      placeFunctionPatterns(m, version);
      var reserved = [];
      for (var r = 0; r < size; r++) {
        reserved.push([]);
        for (var c = 0; c < size; c++) reserved[r].push(m[r][c] !== null);
      }
      placeData(m, codewords);
      for (var rr = 0; rr < size; rr++) {
        for (var cc = 0; cc < size; cc++) {
          if (m[rr][cc] === 2) m[rr][cc] = 0;                 /* reserved -> filled below */
          else if (!reserved[rr][cc] && maskBit(mask, rr, cc)) m[rr][cc] ^= 1;
        }
      }
      applyFormat(m, mask);
      applyVersion(m, version);
      var score = penalty(m);
      if (score < bestScore) { bestScore = score; best = m; }
    }
    return { size: size, modules: best, version: version };
  }

  /* Draws onto a canvas the way the replaced library did, so the application
     above keeps calling canvas.toDataURL() and never learns who drew it. */
  function toCanvas(text, pixels) {
    var qr = encode(text);
    if (!qr) return null;
    var side = Math.max(21, Number(pixels) || 200);
    var quiet = 4;                                     /* the standard's margin */
    var modules = qr.size + quiet * 2;
    var scale = Math.max(1, Math.floor(side / modules));
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = modules * scale;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (var r = 0; r < qr.size; r++) {
      for (var c = 0; c < qr.size; c++) {
        if (qr.modules[r][c]) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
    return canvas;
  }

  return { encode: encode, toCanvas: toCanvas, maxVersion: MAX_VERSION };
});
