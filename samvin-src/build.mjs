// sam.vin — build script (ARCH §1.4). Node 22 ESM; dependencies: esbuild + Node built-ins only.
//
//   node build.mjs                 production build into ../samvin
//   node build.mjs --dev           unminified + linked source maps + __DEV__=true
//   node build.mjs --out <dir>     build into another folder (copies the real world.js there too)
//   node build.mjs --strict        exit 1 when a payload budget (§1.9) is exceeded
//
// Never overwrites the real samvin/world.js (hand-edited by the parent). Idempotent.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const T_START = Date.now();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REAL_OUT = path.resolve(HERE, '../samvin');

const USAGE = `usage: node build.mjs [--out <dir>] [--dev] [--strict]
  --out <dir>   output folder (default ../samvin; relative paths resolve against the cwd)
  --dev         unminified, linked source maps, __DEV__ = true
  --strict      exit 1 when a payload budget is exceeded`;

// ─── 1. Args ──────────────────────────────────────────────────────────────────────────────────────
let out = REAL_OUT;
let dev = false;
let strict = false;
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dev') dev = true;
    else if (a === '--strict') strict = true;
    else if (a === '--out') {
      const v = argv[++i];
      if (!v || v.startsWith('--')) { console.error(USAGE); process.exit(2); }
      out = path.resolve(process.cwd(), v);
    } else { console.error(`unknown argument: ${a}\n${USAGE}`); process.exit(2); }
  }
}
const isReal = path.resolve(out) === REAL_OUT;

function fail(msg) { console.error(`build failed: ${msg}`); process.exit(1); }

// ─── 2. Dirs ──────────────────────────────────────────────────────────────────────────────────────
const OUT_A = path.join(out, 'a');
const OUT_FONTS = path.join(out, 'fonts');
for (const d of [out, OUT_A, OUT_FONTS]) fs.mkdirSync(d, { recursive: true });

// ─── 3–4. Bundles ─────────────────────────────────────────────────────────────────────────────────
let jsResult, cssResult;
try {
  jsResult = await esbuild.build({
    entryPoints: { app: 'src/main.js' },
    bundle: true, format: 'iife', platform: 'browser',
    target: ['chrome100', 'safari15', 'ios15', 'firefox100', 'edge100'],
    outdir: OUT_A, entryNames: '[name].[hash]',
    minify: !dev, sourcemap: dev ? 'linked' : false,
    legalComments: 'none', charset: 'utf8', treeShaking: true,
    define: { __DEV__: String(dev) },
    drop: dev ? [] : ['debugger'],
    metafile: true, write: true, logLevel: 'warning',
    absWorkingDir: HERE,
  });
  cssResult = await esbuild.build({
    entryPoints: { app: 'src/styles/index.css' },
    bundle: true, outdir: OUT_A, entryNames: '[name].[hash]',
    minify: !dev, sourcemap: dev ? 'linked' : false, charset: 'utf8',
    external: ['../fonts/*'], metafile: true, write: true, logLevel: 'warning',
    absWorkingDir: HERE,
  });
} catch (e) {
  // esbuild already printed the diagnostics (logLevel 'warning'); print the summary too.
  console.error(String(e && e.message || e));
  process.exit(1);
}

// ─── 5. Output names (relative to <out>) ──────────────────────────────────────────────────────────
function pickOutput(meta, ext) {
  const hit = Object.keys(meta.outputs).find((p) => p.endsWith(ext) && !p.endsWith('.map'));
  if (!hit) fail(`no ${ext} output in metafile`);
  return path.relative(out, path.resolve(HERE, hit)).split(path.sep).join('/');
}
const JS = pickOutput(jsResult.metafile, '.js');
const CSS = pickOutput(cssResult.metafile, '.css');
if (!/^a\/app\.[A-Za-z0-9_-]+\.js$/.test(JS)) fail(`unexpected JS name ${JS}`);
if (!/^a\/app\.[A-Za-z0-9_-]+\.css$/.test(CSS)) fail(`unexpected CSS name ${CSS}`);

// ─── 6. Fonts ─────────────────────────────────────────────────────────────────────────────────────
const FONTS = [
  ['@fontsource-variable/geologica', 'geologica-cyrillic-full-normal.woff2'],
  ['@fontsource-variable/geologica', 'geologica-latin-full-normal.woff2'],
  ['@fontsource-variable/martian-mono', 'martian-mono-cyrillic-standard-normal.woff2'],
  ['@fontsource-variable/martian-mono', 'martian-mono-latin-standard-normal.woff2'],
];
for (const [pkg, file] of FONTS) {
  const src = path.join(HERE, 'node_modules', pkg, 'files', file);
  const dst = path.join(OUT_FONTS, file);
  if (!fs.existsSync(src)) fail(`missing font ${src} (run npm install)`);
  const srcSize = fs.statSync(src).size;
  if (fs.existsSync(dst) && fs.statSync(dst).size === srcSize) continue;
  fs.copyFileSync(src, dst);
}
{
  const keep = new Set(FONTS.map((f) => f[1]));
  for (const f of fs.readdirSync(OUT_FONTS)) if (!keep.has(f)) fs.rmSync(path.join(OUT_FONTS, f), { recursive: true, force: true });
}

// ─── 7. Static files ──────────────────────────────────────────────────────────────────────────────
fs.copyFileSync(path.join(HERE, 'src/static/favicon.svg'), path.join(out, 'favicon.svg'));
fs.copyFileSync(path.join(HERE, 'src/static/_headers'), path.join(out, '_headers'));

// ─── 8. index.html ────────────────────────────────────────────────────────────────────────────────
{
  let html = fs.readFileSync(path.join(HERE, 'src/index.html'), 'utf8');
  html = html.split('%%APP_CSS%%').join(`./${CSS}`).split('%%APP_JS%%').join(`./${JS}`);
  if (html.includes('%%')) fail('index.html: unreplaced %% token');
  if (/<script\b(?![^>]*\bsrc=)[^>]*>/i.test(html)) fail('index.html: <script> without src');
  if (/<script[^>]*>\s*[^<\s]/i.test(html)) fail('index.html: <script> with a body');
  if (/\son[a-z]+\s*=/i.test(html)) fail('index.html: inline handler attribute');
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
  const scriptTags = (html.match(/<script\b/gi) || []).length;
  if (scriptTags !== 2 || srcs.length !== 2 || srcs[0] !== './world.js' || srcs[1] !== `./${JS}`) {
    fail(`index.html: expected exactly 2 scripts ./world.js then ./${JS}, got ${JSON.stringify(srcs)}`);
  }
  fs.writeFileSync(path.join(out, 'index.html'), html);
}

// ─── 9. world.js ──────────────────────────────────────────────────────────────────────────────────
{
  const seed = path.join(HERE, 'src/data/world.seed.js');
  const dst = path.join(out, 'world.js');
  if (isReal) {
    if (!fs.existsSync(dst)) fs.copyFileSync(seed, dst);   // seeded once; never overwritten afterwards
  } else {
    const real = path.join(REAL_OUT, 'world.js');
    fs.copyFileSync(fs.existsSync(real) ? real : seed, dst);
  }
}

// ─── 10. Stale-hash cleanup (only app.<hash>.(js|css)(.map) in <out>/a/) ──────────────────────────
{
  const current = new Set([path.basename(JS), path.basename(CSS)]);
  if (dev) { current.add(path.basename(JS) + '.map'); current.add(path.basename(CSS) + '.map'); }
  const re = /^app\.[A-Za-z0-9_-]+\.(js|css)(\.map)?$/;
  for (const f of fs.readdirSync(OUT_A)) if (re.test(f) && !current.has(f)) fs.rmSync(path.join(OUT_A, f), { force: true });
}

// ─── 11. Report (gzip -9) ─────────────────────────────────────────────────────────────────────────
{
  const KB = 1024;
  const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;
  const rows = [];
  const add = (rel, budgetGz) => {
    const buf = fs.readFileSync(path.join(out, rel));
    rows.push({ rel, raw: buf.length, gz: gz(buf), budgetGz });
  };
  add('index.html', 4 * KB);
  add(JS, 275 * KB);                 // ARCH-ADDENDUM X§7.3.1 (was 230)
  add(CSS, 8 * KB);
  for (const [, f] of FONTS) add(`fonts/${f}`, null);
  add('world.js', 13 * KB);          // ARCH-ADDENDUM X§7.3.1 (was 12; A11 placeholder data)
  const fontsRaw = rows.filter((r) => r.rel.startsWith('fonts/')).reduce((s, r) => s + r.raw, 0);
  const totalRaw = rows.reduce((s, r) => s + r.raw, 0);
  const totalGz = rows.reduce((s, r) => s + r.gz, 0);
  const over = [];
  for (const r of rows) if (r.budgetGz != null && r.gz > r.budgetGz) over.push(`OVER BUDGET ${r.rel}: ${(r.gz / KB).toFixed(1)} KB gz > ${(r.budgetGz / KB).toFixed(0)} KB`);
  if (fontsRaw > 140 * KB) over.push(`OVER BUDGET fonts: ${(fontsRaw / KB).toFixed(1)} KB raw > ≈136 KB`);
  if (totalGz > 450 * KB) over.push(`OVER BUDGET total: ${(totalGz / KB).toFixed(1)} KB gz > 450 KB`);

  const w = Math.max(...rows.map((r) => r.rel.length), 5) + 2;
  const fmt = (n) => (n / KB).toFixed(1).padStart(9) + ' KB';
  console.log(`${'file'.padEnd(w)}${'raw'.padStart(12)}${'gzip -9'.padStart(12)}`);
  for (const r of rows) console.log(`${r.rel.padEnd(w)}${fmt(r.raw)}${fmt(r.gz)}`);
  console.log(`${'total'.padEnd(w)}${fmt(totalRaw)}${fmt(totalGz)}`);
  for (const l of over) console.log(l);
  if (strict && over.length) { console.error('build failed: payload budget exceeded (--strict)'); process.exit(1); }
}

// ─── 12. Done ─────────────────────────────────────────────────────────────────────────────────────
console.log(`${dev ? 'dev build' : 'production build'}, ${Date.now() - T_START} ms`);
console.log(`built → ${out}`);
process.exit(0);
