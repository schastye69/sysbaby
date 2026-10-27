// sam.vin — build script (ARCH §1.4). Node 22 ESM; dependencies: esbuild, terser (the production re-minify, §3d) and
// Node built-ins.
// Outputs in a/: app.<hash>.js + app.<hash>.css (every visitor), t0.<hash>.js + t0.<hash>.css (only a browser without
// WebGL fetches them, §3c) and world-default.<hash>.js (the seed's lists, fetched only when world.js is broken).
//
//   node build.mjs                 production build into ../samvin
//   node build.mjs --dev           unminified + linked source maps + __DEV__=true
//   node build.mjs --out <dir>     build into another folder (copies the real world.js there too)
//   node build.mjs --strict        exit 1 when a payload budget (§1.9) is exceeded
//   node build.mjs --raw-glsl      keep the app's GLSL as written (debugging; the minified text is what ships and what
//                                  the dev build's ?tier= cases test)
//
// Never overwrites the real samvin/world.js (hand-edited by the parent). Idempotent.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const T_START = Date.now();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REAL_OUT = path.resolve(HERE, '../samvin');

const USAGE = `usage: node build.mjs [--out <dir>] [--dev] [--strict]
  --out <dir>   output folder (default ../samvin; relative paths resolve against the cwd)
  --dev         unminified, linked source maps, __DEV__ = true
  --strict      exit 1 when a payload budget is exceeded
  --raw-glsl    do not minify the app's GLSL`;

// ─── 1. Args ──────────────────────────────────────────────────────────────────────────────────────
let out = REAL_OUT;
let dev = false;
let strict = false;
let rawGlsl = false;
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dev') dev = true;
    else if (a === '--strict') strict = true;
    else if (a === '--raw-glsl') rawGlsl = true;
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

// ─── 3a. three: drop the GLSL of materials this site never renders (integrator, merge step 3: X§7.3.1 G2) ─────────
// The site draws only ShaderMaterial with its own self-contained GLSL (no `#include <…>`), NoToneMapping and an
// UnsignedByteType output, no scene.background, no envMap/PMREM, no shadows. three's built-in material shaders and
// internal passes are therefore dead weight (~27 KB gz). Every module-level GLSL string of three.module.js is emptied
// except the chunks WebGLProgram splices into every ShaderMaterial (KEEP). Should a built-in shader ever be compiled
// (a Mesh without material, a background, a PMREM), the empty source fails to compile and three logs a console error,
// which every QA case reports (G3). src/** must not use `#include <` (checked below).
// tonemapping_pars_fragment is spliced only when toneMapping !== NoToneMapping (render/renderer.js sets NoToneMapping).
const THREE_GLSL_KEEP = new Set(['colorspace_pars_fragment']);
const STRIPPED = (what) => `throw new Error( 'sam.vin build: ${what} is stripped' );`;
const THREE_STUBS = [
  [/^function WebGLShadowMap\( renderer, objects, capabilities \) \{[\s\S]*?^\}$/m,
    'function WebGLShadowMap() { this.enabled = false; this.autoUpdate = true; this.needsUpdate = false; this.type = PCFShadowMap; this.render = function () {}; }'],
  [/^class PMREMGenerator \{[\s\S]*?^\}$/m,
    "class PMREMGenerator { constructor() { throw new Error( 'sam.vin build: PMREMGenerator is stripped (no envMap)' ); } }"],
  [/^class WebXRDepthSensing \{[\s\S]*?^\}$/m, ''],
  [/^function WebGLEnvironments\( renderer \) \{[\s\S]*?^\}$/m,
    "function WebGLEnvironments() { return { get( t ) { if ( t === null || t === undefined ) return null; throw new Error( 'sam.vin build: envMap / background textures are stripped' ); }, dispose() {} }; }"],
  [/^function WebGLMorphtargets\( gl, capabilities, textures \) \{[\s\S]*?^\}$/m,
    "function WebGLMorphtargets() { return { update() { throw new Error( 'sam.vin build: morph targets are stripped' ); } }; }"],
  [/^class WebXRManager extends EventDispatcher \{[\s\S]*?^\}$/m,
    'class WebXRManager extends EventDispatcher { constructor() { super(); this.enabled = false; this.isPresenting = false; this.cameraAutoUpdate = true; }'
    + ' getCamera() { return null; } updateCamera() {} setAnimationLoop() {} dispose() {} getEnvironmentBlendMode() { return undefined; }'
    + ' getDepthSensingMesh() { return null; } hasDepthSensing() { return false; } }'],
  // Final pass (PERF-4/6): more subsystems the site never enters. Each keeps the surface WebGLRenderer reads and throws
  // when a future use would need the real thing, so it fails loudly (G3).
  // · the DFG LUT (16×16 half floats) is read only by physically based materials
  [/^const DATA = new Uint16Array\( \[[\s\S]*?^\] \);$/m, 'const DATA = null;'],
  [/^function getDFGLUT\(\) \{[\s\S]*?^\}$/m, `function getDFGLUT() { ${STRIPPED('the DFG LUT (physical materials)')} }`],
  // · uniform buffer objects: no material sets uniformsGroups
  [/^function WebGLUniformsGroups\( gl, info, capabilities, state \) \{[\s\S]*?^\}$/m,
    `function WebGLUniformsGroups() { return { bind() { ${STRIPPED('uniformsGroups')} }, update() { ${STRIPPED('uniformsGroups')} }, dispose() {} }; }`],
  // · scene backgrounds: scene.background stays null; the clear colour / alpha and the mask reset before clear() remain
  [/^function WebGLBackground\( renderer, environments, state, objects, alpha, premultipliedAlpha \) \{[\s\S]*?^\}$/m,
    `function WebGLBackground( renderer, environments, state, objects, alpha, premultipliedAlpha ) {
	const clearColor = new Color( 0x000000 );
	let clearAlpha = alpha === true ? 0 : 1;
	function setClear( color, a ) {
		color.getRGB( _rgb, getUnlitUniformColorSpace( renderer ) );
		state.buffers.color.setClear( _rgb.r, _rgb.g, _rgb.b, a, premultipliedAlpha );
	}
	function check( scene ) { if ( scene.isScene === true && scene.background ) ${STRIPPED('scene.background')} }
	return {
		getClearColor() { return clearColor; },
		setClearColor( color, a = 1 ) { clearColor.set( color ); clearAlpha = a; setClear( clearColor, clearAlpha ); },
		getClearAlpha() { return clearAlpha; },
		setClearAlpha( a ) { clearAlpha = a; setClear( clearColor, clearAlpha ); },
		render( scene ) {
			check( scene );
			setClear( clearColor, clearAlpha );
			if ( renderer.autoClear ) {
				state.buffers.depth.setTest( true ); state.buffers.depth.setMask( true ); state.buffers.color.setMask( true );
				renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			}
		},
		addToRenderList( renderList, scene ) { check( scene ); },
		dispose() {}
	};
}`],
  // · built-in material uniforms: every material is a ShaderMaterial (its uniforms are the app's own)
  [/^function WebGLMaterials\( renderer, properties \) \{[\s\S]*?^\}$/m,
    `function WebGLMaterials( renderer ) {
	function refreshFogUniforms( uniforms, fog ) {
		fog.color.getRGB( uniforms.fogColor.value, getUnlitUniformColorSpace( renderer ) );
		if ( fog.isFog ) { uniforms.fogNear.value = fog.near; uniforms.fogFar.value = fog.far; } else if ( fog.isFogExp2 ) { uniforms.fogDensity.value = fog.density; }
	}
	function refreshMaterialUniforms( uniforms, material ) {
		if ( material.isShaderMaterial ) material.uniformsNeedUpdate = false; else ${STRIPPED('built-in material uniforms')}
	}
	return { refreshFogUniforms, refreshMaterialUniforms };
}`],
  // · lights: every material has lights:false and the scenes hold no Light; the state keeps the shape WebGLPrograms reads
  [/^function WebGLLights\( extensions \) \{[\s\S]*?^\}$/m,
    `function WebGLLights() {
	const state = { version: 0, hash: {}, ambient: [ 0, 0, 0 ], probe: [], sun: [], sunShadow: [], sunShadowMap: [], sunShadowMatrix: [],
		sunShadowCascade: [], directional: [], directionalShadow: [], directionalShadowMap: [], directionalShadowMatrix: [], spot: [],
		spotLightMap: [], spotShadow: [], spotShadowMap: [], spotLightMatrix: [], rectArea: [], rectAreaLTC1: null, rectAreaLTC2: null,
		point: [], pointShadow: [], pointShadowMap: [], pointShadowMatrix: [], hemi: [], numSpotLightShadowsWithMaps: 0, numLightProbes: 0 };
	for ( let i = 0; i < 9; i ++ ) state.probe.push( new Vector3() );
	return { setup( lights ) { if ( lights.length > 0 ) ${STRIPPED('Light')} }, setupView() {}, state };
}`],
  // · cube textures, transmission, pixel read-back and texture copies
  // · compressed / array / 3D / framebuffer / HTML texture uploads (the app makes CanvasTexture, DataTexture and render targets)
  [/^\t\t\t\} else if \( texture\.isCompressedTexture \) \{\n[\s\S]*?(?=^\t\t\t\} else \{$)/m,
    `\t\t\t} else if ( texture.isCompressedTexture || texture.isDataArrayTexture || texture.isData3DTexture || texture.isFramebufferTexture || texture.isHTMLTexture ) {\n\t\t\t\t${STRIPPED('this texture kind')}\n`],
  [/^\tfunction uploadCubeTexture\( textureProperties, texture, slot \) \{[\s\S]*?^\t\}$/m,
    `\tfunction uploadCubeTexture() { ${STRIPPED('CubeTexture')} }`],
  [/^\t\tfunction renderTransmissionPass\( opaqueObjects, transmissiveObjects, scene, camera \) \{[\s\S]*?^\t\t\}$/m,
    `\t\tfunction renderTransmissionPass() { ${STRIPPED('transmission')} }`],
  [/^\t\tthis\.readRenderTargetPixels = function \([\s\S]*?^\t\t\};$/m, `\t\tthis.readRenderTargetPixels = function () { ${STRIPPED('readRenderTargetPixels')} };`],
  [/^\t\tthis\.readRenderTargetPixelsAsync = async function \([\s\S]*?^\t\t\};$/m, `\t\tthis.readRenderTargetPixelsAsync = async function () { ${STRIPPED('readRenderTargetPixelsAsync')} };`],
  [/^\t\tthis\.copyFramebufferToTexture = function \([\s\S]*?^\t\t\};$/m, `\t\tthis.copyFramebufferToTexture = function () { ${STRIPPED('copyFramebufferToTexture')} };`],
  [/^\t\tthis\.copyTextureToTexture = function \([\s\S]*?^\t\t\};$/m, `\t\tthis.copyTextureToTexture = function () { ${STRIPPED('copyTextureToTexture')} };`],
  // · the chunk registry: the app's GLSL has no #include, and the built-in shaders (ShaderLib) are emptied above, so
  //   only the chunk WebGLProgram splices into every ShaderMaterial stays addressable
  [/^const ShaderChunk = \{\n[\s\S]*?^\};$/m, 'const ShaderChunk = { colorspace_pars_fragment: colorspace_pars_fragment };'],
  [/\bShaderChunk\.[a-z_]+\b/g, "''"],
  // · compressed formats in WebGLUtils.convert (S3TC … RGTC): reached only by a compressed texture upload, stubbed above
  [/^\t\t\/\/ S3TC\n[\s\S]*?(?=^\t\tif \( p === UnsignedInt248Type \) return gl\.UNSIGNED_INT_24_8;$)/m, ''],
  // · the built-in materials' uniform and shader tables: read only for a material with a shaderID (MeshBasicMaterial & co.),
  //   whose GLSL is emptied above anyway; a ShaderMaterial never touches them, and a built-in one now fails loudly (G3)
  [/^const UniformsLib = \{\n[\s\S]*?^\};$/m, 'const UniformsLib = {};'],
  [/^const ShaderLib = \{\n[\s\S]*?^\};$/m, 'const ShaderLib = {};'],
  [/^ShaderLib\.physical = \{\n[\s\S]*?^\};$/m, ''],
  // · developer messages (PERF-5): the long texts become 'three:<n>'; the warn / error call itself stays, so G3 still
  //   sees every real error
  [/\b(warn|error|warnOnce|log)\( '(THREE\.)?[A-Z](?:[^'\\\n]|\\.){30,}'/g, threeMsg],
];
// three.core.js (PERF-3/4/5): the animation system (KeyframeTrack & co., PropertyBinding) is kept alive only by top-level
// prototype / static assignments; the CSS colour-keyword table is read only by Color.setStyle('<name>') (the app passes
// numbers); the developer messages as above.
const THREE_CORE_STUBS = [
  [/^(KeyframeTrack|NumberKeyframeTrack|BooleanKeyframeTrack|ColorKeyframeTrack|QuaternionKeyframeTrack|StringKeyframeTrack|VectorKeyframeTrack|PropertyBinding)\.(prototype\.)?\w+ = [\s\S]*?;$/gm, ''],
  [/^const _colorKeywords = \{[\s\S]*?\};$/m, 'const _colorKeywords = {};'],
  // the loaders: the app loads no file through three; only this static keeps Loader (and the default LoadingManager) alive
  [/^Loader\.DEFAULT_MATERIAL_NAME = '__DEFAULT';$/m, ''],
  [/\b(warn|error|warnOnce|log)\( '(THREE\.)?[A-Z](?:[^'\\\n]|\\.){30,}'/g, threeMsg],
  // serialization (PERF-3): the site never serializes a three object (its JSON.stringify calls are on plain data)
  [/^\t(?:static )?(?:toJSON|fromJSON|computeTangents)\( [^\n]*\) \{\n[\s\S]*?\n\t\}\n/gm, ''],
];
// Dead class methods (PERF-6): a method of a three.core class whose name occurs nowhere else — not in three.core.js,
// three.module.js or any file of src/ — cannot be called (the app reaches three only through named members; nothing
// builds a method name at run time). Its body is removed. Lifecycle names are kept regardless.
const DEAD_KEEP = new Set(['constructor', 'toJSON', 'toString', 'valueOf', 'handleEvent', 'dispose', 'clone', 'copy', 'set', 'get',
  'onBeforeRender', 'onAfterRender', 'onBeforeShadow', 'onAfterShadow', 'onBeforeCompile', 'raycast']);
function stripDeadMethods(core) {
  const three = path.join(HERE, 'node_modules/three/build');
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const texts = [core, fs.readFileSync(path.join(three, 'three.module.js'), 'utf8'), ...walk(path.join(HERE, 'src')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(f, 'utf8'))];
  const count = new Map();
  for (const t of texts) for (const m of t.matchAll(/[A-Za-z_$][\w$]*/g)) count.set(m[0], (count.get(m[0]) || 0) + 1);
  const spans = [], defs = new Map();
  for (const m of core.matchAll(/^\t(?:static |async )?([A-Za-z_$][\w$]*)\((?: [^\n]*)?\) \{$/gm)) {
    const name = m[1];
    if (DEAD_KEEP.has(name) || /^(if|for|while|switch|catch|function|return)$/.test(name)) continue;
    const end = core.indexOf('\n\t}\n', m.index);
    if (end < 0) continue;
    spans.push({ s: m.index, e: end + 3, name });
    defs.set(name, (defs.get(name) || 0) + 1);
  }
  const dead = spans.filter((x) => (count.get(x.name) || 0) - defs.get(x.name) <= 0);
  if (dead.length < 40) fail(`three-core: only ${dead.length} dead methods found (three layout changed?)`);
  let out = core;
  for (const x of dead.sort((a, b) => b.s - a.s)) out = out.slice(0, x.s) + out.slice(x.e);
  return out;
}
function threeMsg(m, fn) { return `${fn}( 'three:${++threeMsg.n}'`; }
threeMsg.n = 0;
function applyStubs(s, stubs, tag) {
  for (const [re, rep] of stubs) {
    re.lastIndex = 0;
    if (!re.test(s)) fail(`${tag}: ${re} not found (three layout changed?)`);
    re.lastIndex = 0;
    s = s.replace(re, rep);
  }
  return s;
}
const threeGlsl = {
  name: 'three-unused-glsl',
  setup(b) {
    b.onLoad({ filter: /three[\\/]build[\\/]three\.module\.js$/ }, (a) => {
      let s = fs.readFileSync(a.path, 'utf8');
      let n = 0;
      s = s.replace(/^(var|const) ([A-Za-z_$][\w$]*) = "((?:[^"\\\n]|\\.)*)";$/gm, (m, kw, name, body) => {
        if (THREE_GLSL_KEEP.has(name) || !body.includes('\\n')) return m;
        n++; return `${kw} ${name} = "";`;
      });
      s = s.replace(/\/\* glsl \*\/`([^`]*)`/g, (m, body) => (body.includes('${') ? m : (n++, '``')));
      for (const k of THREE_GLSL_KEEP) if (!new RegExp(`^(var|const) ${k} = "[^"]`, 'm').test(s)) fail(`three-unused-glsl: ${k} not found`);
      if (n < 100) fail(`three-unused-glsl: only ${n} GLSL strings found (three layout changed?)`);
      // Merge step 4 (X§7.3.1 G2): the renderer's subsystems this site never enters are replaced by inert stubs with the
      // same surface WebGLRenderer reads (no WebXR session, no shadow-casting lights, no envMap/PMREM). The stubs keep
      // every flag at its default; a PMREM request throws, so a future envMap fails loudly (G3) instead of silently.
      s = applyStubs(s, THREE_STUBS, 'three-unused-glsl');
      return { contents: s, loader: 'js' };
    });
    b.onLoad({ filter: /three[\\/]build[\\/]three\.core\.js$/ }, (a) => {
      // the dead-method sweep is a size step (prod): the dev build keeps every three method, so QA probes through
      // __SAMVIN_DEV__ (getObjectByName, …) work there
      const t = applyStubs(fs.readFileSync(a.path, 'utf8'), THREE_CORE_STUBS, 'three-core');
      return { contents: dev ? t : stripDeadMethods(t), loader: 'js' };
    });
  },
};
{
  const walkSrc = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walkSrc(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walkSrc(path.join(HERE, 'src'))) if (f.endsWith('.js') && fs.readFileSync(f, 'utf8').includes('#include <')) fail(`${path.relative(HERE, f)}: GLSL #include <…> is not available (three chunks are stripped)`);
}

// ─── 3b. GLSL minifier (PERF-2) ──────────────────────────────────────────────────────────────────────
// The app's own shaders are template literals tagged `/* glsl */` (or given inline to `vertexShader:` / `fragmentShader:`).
// In every build (dev too, so the ?tier= cases test the shipped text; --raw-glsl opts out) their comments, indentation
// and the spaces around punctuation are removed at load time. Rules that keep the result identical for the compiler:
// every preprocessor line (#if, #define …) keeps its own line, untouched but for collapsed blanks; the whitespace at
// either edge of a quasi (next to a `${…}` interpolation or the literal's ends) shrinks to one '\n' (if it held a
// newline) or one ' ', so interpolated chunks keep their line structure; a space between two punctuation characters
// that would glue into another operator ('- -' → '--') stays. A literal with escapes, or whose comment would swallow
// an interpolation, is left as it is.
const GLSL_GLUE = new Set(['++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=', '&&', '||', '^^', '<<', '>>', '//', '/*', '*/', '&=', '|=', '^=']);
const GLSL_PUNCT = /[=+\-*/<>(){}[\],;:?!&|^%~]/;
function glslSqueeze(s) {
  s = s.replace(/[ \t]+/g, ' ');
  let o = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === ' ') {
      const a = o[o.length - 1], b = s[i + 1];
      if (a === undefined || b === undefined) continue;
      if ((GLSL_PUNCT.test(a) || GLSL_PUNCT.test(b)) && !GLSL_GLUE.has(a + b)) continue;
    }
    o += c;
  }
  return o;
}
function glslMinQuasis(quasis) {
  if (quasis.some((q) => q.includes('\\'))) return quasis;
  const stripped = [];
  for (let k = 0; k < quasis.length; k++) {
    const q = quasis[k];
    if (q.lastIndexOf('/*') > q.lastIndexOf('*/')) return quasis;
    const noBlock = q.replace(/\/\*[\s\S]*?\*\//g, ' ');
    if (k < quasis.length - 1 && noBlock.slice(noBlock.lastIndexOf('\n') + 1).includes('//')) return quasis;
    stripped.push(noBlock.replace(/\/\/[^\n]*/g, ''));
  }
  return stripped.map((q) => {
    const lead = q.match(/^\s*/)[0], trail = q.match(/\s*$/)[0], body = q.trim();
    const edge = (w) => (w ? (w.includes('\n') ? '\n' : ' ') : '');
    if (!body) return edge(q);
    let res = '', code = [];
    const flush = () => { if (code.length) { res += glslSqueeze(code.join(' ')); code = []; } };
    for (const raw of body.split('\n')) {
      const l = raw.trim();
      if (!l) continue;
      if (l[0] !== '#') { code.push(l); continue; }
      flush();
      if (res && !res.endsWith('\n')) res += '\n';
      res += l.replace(/[ \t]+/g, ' ') + '\n';
    }
    flush();
    const L = res[0] === '#' && lead ? '\n' : edge(lead);
    return L + res + (res.endsWith('\n') ? '' : edge(trail));
  });
}
function glslReadTemplate(s, i) {          // i: the opening backtick → { quasis, exprs, end }
  const quasis = [], exprs = []; let q = ''; i++;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') { q += s.slice(i, i + 2); i += 2; continue; }
    if (c === '`') { quasis.push(q); return { quasis, exprs, end: i + 1 }; }
    if (c === '$' && s[i + 1] === '{') { quasis.push(q); q = ''; const e = glslSkipExpr(s, i + 2); if (e < 0) return null; exprs.push(s.slice(i + 2, e)); i = e + 1; continue; }
    q += c; i++;
  }
  return null;
}
function glslSkipExpr(s, i) {              // → index of the '}' closing a `${`
  let depth = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '"' || c === "'") { i++; while (i < s.length && s[i] !== c) { if (s[i] === '\\') i++; i++; } i++; continue; }
    if (c === '`') { const t = glslReadTemplate(s, i); if (!t) break; i = t.end; continue; }
    if (c === '{') depth++;
    else if (c === '}') { if (depth === 0) return i; depth--; }
    i++;
  }
  return -1;
}
function minifyGlslTemplates(src, file) {
  const START = /\/\* glsl \*\/\s*`|\b(?:vertexShader|fragmentShader)\s*:\s*`/g;
  let out = '', p = 0, m;
  while ((m = START.exec(src))) {
    const open = m.index + m[0].length - 1;
    const t = glslReadTemplate(src, open);
    if (!t) fail(`glsl-min: ${file}: unterminated template at ${open}`);
    const q = glslMinQuasis(t.quasis);
    out += src.slice(p, open + 1);
    for (let k = 0; k < q.length; k++) out += q[k] + (k < t.exprs.length ? '${' + t.exprs[k] + '}' : '');
    out += '`';
    p = t.end; START.lastIndex = t.end;
  }
  return out + src.slice(p);
}
const glslMin = {
  name: 'glsl-min',
  setup(b) {
    if (rawGlsl) return;
    b.onLoad({ filter: /[\\/]src[\\/].*\.js$/ }, (a) => {
      if (a.path.includes(`${path.sep}node_modules${path.sep}`)) return undefined;
      const s = fs.readFileSync(a.path, 'utf8');
      if (!/\/\* glsl \*\/|Shader\s*:\s*`/.test(s)) return undefined;
      return { contents: minifyGlslTemplates(s, path.relative(HERE, a.path)), loader: 'js' };
    });
  },
};

// ─── 3c. The T0 bundle (WP11 «ЧЕРТЁЖ», SPEC §12.5) ──────────────────────────────────────────────────
// T0 is the page for a browser without WebGL: a visitor with WebGL never runs a line of it, so it ships as its own pair
// a/t0.<hash>.js + a/t0.<hash>.css, fetched by src/t0/load.js only when the tier is T0 (or the WebGL context is lost).
// It shares the app's live modules instead of copying them: every import of a src/t0 module from outside src/t0 is
// served from a kit the app bundle hands over (globalThis.__samvinT0.kit, set by load.js just before the <script> is
// added), so store/state/clock/layout are the same objects in both bundles. The kit carries exactly the names src/t0
// imports (named imports only; anything else fails the build).
const SRC = path.join(HERE, 'src');
const T0_DIR = path.join(SRC, 't0');
const posix = (p) => p.split(path.sep).join('/');
const t0Kit = new Map();                  // 'core/clock.js' → Set of imported names
for (const f of fs.readdirSync(T0_DIR).filter((n) => n.endsWith('.js') && n !== 'load.js')) {
  const s = fs.readFileSync(path.join(T0_DIR, f), 'utf8');
  for (const m of s.matchAll(/^import\s+([^'";]*?)\s*from\s*'([^']+)';?$/gm)) {
    const abs = path.resolve(T0_DIR, m[2]);
    if (!m[2].startsWith('.') || abs.startsWith(T0_DIR + path.sep)) continue;
    const named = /^\{([^}]*)\}$/.exec(m[1].trim());
    if (!named) fail(`t0 kit: src/t0/${f}: only named imports from outside src/t0 are supported (${m[0]})`);
    const rel = posix(path.relative(SRC, abs));
    if (!t0Kit.has(rel)) t0Kit.set(rel, new Set());
    for (const part of named[1].split(',')) { const n = part.trim().split(/\s+as\s+/)[0]; if (n) t0Kit.get(rel).add(n); }
  }
  if (/^import\s+'/m.test(s) || /\bimport\(/.test(s)) fail(`t0 kit: src/t0/${f}: side-effect / dynamic imports are not supported`);
}
const t0KitConsumer = {               // T0 bundle: '../core/clock.js' from src/t0/** → the app's module
  name: 't0-kit-consumer',
  setup(b) {
    b.onResolve({ filter: /^\.\.?\// }, (a) => {
      if (!a.importer.startsWith(T0_DIR + path.sep)) return undefined;
      const abs = path.resolve(path.dirname(a.importer), a.path);
      if (abs.startsWith(T0_DIR + path.sep)) return undefined;
      return { path: posix(path.relative(SRC, abs)), namespace: 't0kit' };
    });
    b.onLoad({ filter: /.*/, namespace: 't0kit' }, (a) => {
      const names = t0Kit.get(a.path);
      if (!names) fail(`t0 kit: ${a.path} is imported by src/t0 but was not scanned`);
      return { contents: `export const { ${[...names].join(', ')} } = globalThis.__samvinT0.kit[${JSON.stringify(a.path)}];`, loader: 'js' };
    });
  },
};
const t0KitProvider = {               // app bundle: `import KIT from 'samvin:t0-kit'` (src/t0/load.js)
  name: 't0-kit-provider',
  setup(b) {
    b.onResolve({ filter: /^samvin:t0-kit$/ }, () => ({ path: 't0-kit', namespace: 't0kit' }));
    b.onLoad({ filter: /.*/, namespace: 't0kit' }, () => {
      let k = 0, imp = '', obj = '';
      for (const [rel, names] of t0Kit) {
        const al = [...names].map((n) => [n, `k${k}_${n}`]);
        imp += `import { ${al.map(([n, a]) => `${n} as ${a}`).join(', ')} } from './${rel}';\n`;
        obj += `  ${JSON.stringify(rel)}: { ${al.map(([n, a]) => `${n}: ${a}`).join(', ')} },\n`;
        k++;
      }
      return { contents: `${imp}export default {\n${obj}};\n`, loader: 'js', resolveDir: SRC };
    });
  },
};

// ─── 3d. Final minification (prod) ──────────────────────────────────────────────────────────────────
// esbuild bundles and minifies; terser then re-minifies the JS (compress + mangle; no unsafe options, no property
// mangling — the sources use no eval / new Function / fn.toString / constructor.name). gzip −20 KB on the app bundle.
// The file name is rehashed from the final bytes.
let terser = null;
if (!dev) {
  try { terser = await import('terser'); } catch (e) { fail('terser is missing (npm install in samvin-src)'); }
}
async function finalJs(code) {
  if (dev) return code;
  const r = await terser.minify(code, { ecma: 2020, compress: { passes: 2 }, mangle: true, format: { comments: false } });
  if (!r || typeof r.code !== 'string') fail('terser returned no code');
  return r.code;
}
const HASH = (buf) => crypto.createHash('sha256').update(buf).digest('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase();
/** Writes an esbuild in-memory result: prod → <name>.<hash>.<ext> from the final bytes; dev → esbuild's names + maps. */
async function writeOutputs(result, name, ext) {
  const files = result.outputFiles;
  const main = files.find((f) => f.path.endsWith(`.${ext}`) && path.basename(f.path).startsWith(`${name}.`));
  if (!main) fail(`no ${name}.${ext} output`);
  if (dev) {
    for (const f of files) if (path.basename(f.path).startsWith(`${name}.`)) fs.writeFileSync(f.path, f.contents);
    return `a/${path.basename(main.path)}`;
  }
  const text = ext === 'js' ? await finalJs(main.text) : main.text;
  const file = `${name}.${HASH(text)}.${ext}`;
  fs.writeFileSync(path.join(OUT_A, file), text);
  return `a/${file}`;
}

// ─── 3–5. Bundles and their names (relative to <out>) ─────────────────────────────────────────────────
const JS_TARGET = ['chrome100', 'safari15', 'ios15', 'firefox100', 'edge100'];
let JS, CSS, T0_JS, T0_CSS, WORLD_DEFAULT_JS;
try {
  const cssResult = await esbuild.build({
    entryPoints: { app: 'src/styles/index.css', t0: 'src/styles/t0.css' },
    bundle: true, outdir: OUT_A, entryNames: '[name].[hash]',
    minify: !dev, sourcemap: dev ? 'linked' : false, charset: 'utf8',
    external: ['../fonts/*'], write: false, logLevel: 'warning',
    absWorkingDir: HERE,
  });
  if (cssResult.warnings.length && strict) fail(`CSS: ${cssResult.warnings.length} warning(s) (--strict)`);
  CSS = await writeOutputs(cssResult, 'app', 'css');
  T0_CSS = await writeOutputs(cssResult, 't0', 'css');
  // The default lists (data/defaults.js): world.seed.js itself, published under another global, fetched only when world.js
  // is missing or a list of it is broken.
  {
    const seed = fs.readFileSync(path.join(SRC, 'data/world.seed.js'), 'utf8');
    if ((seed.match(/^window\.SAMVIN_WORLD = /gm) || []).length !== 1) fail('world.seed.js: expected one `window.SAMVIN_WORLD = ` line');
    const text = seed.replace(/^window\.SAMVIN_WORLD = /m, 'window.SAMVIN_WORLD_DEFAULT = ').replace(/^\/\/[^\n]*\n/gm, '');
    const t = await esbuild.transform(text, { minify: !dev, charset: 'utf8', loader: 'js' });
    WORLD_DEFAULT_JS = `a/world-default.${HASH(t.code)}.js`;
    fs.writeFileSync(path.join(out, WORLD_DEFAULT_JS), t.code);
  }
  const t0Result = await esbuild.build({
    stdin: { contents: "import { mountT0 } from './t0/t0.js';\nglobalThis.__samvinT0.done(mountT0);\n", resolveDir: SRC, sourcefile: 't0-entry.js', loader: 'js' },
    bundle: true, format: 'iife', platform: 'browser', target: JS_TARGET,
    outdir: OUT_A, entryNames: 't0.[hash]',
    minify: !dev, sourcemap: dev ? 'linked' : false,
    legalComments: 'none', charset: 'utf8', treeShaking: true,
    define: { __DEV__: String(dev) },
    drop: dev ? [] : ['debugger'],
    write: false, logLevel: 'warning', plugins: [t0KitConsumer],
    absWorkingDir: HERE,
  });
  T0_JS = await writeOutputs(t0Result, 't0', 'js');
  const jsResult = await esbuild.build({
    entryPoints: { app: 'src/main.js' },
    bundle: true, format: 'iife', platform: 'browser', target: JS_TARGET,
    outdir: OUT_A, entryNames: '[name].[hash]',
    minify: !dev, sourcemap: dev ? 'linked' : false,
    legalComments: 'none', charset: 'utf8', treeShaking: true,
    define: { __DEV__: String(dev), __T0_JS__: JSON.stringify(`./${T0_JS}`), __T0_CSS__: JSON.stringify(`./${T0_CSS}`),
      __WORLD_DEFAULT_JS__: JSON.stringify(`./${WORLD_DEFAULT_JS}`) },
    drop: dev ? [] : ['debugger'],
    write: false, logLevel: 'warning', plugins: [threeGlsl, glslMin, t0KitProvider],
    absWorkingDir: HERE,
  });
  if (jsResult.warnings.length && strict) fail(`JS: ${jsResult.warnings.length} warning(s) (--strict)`);
  JS = await writeOutputs(jsResult, 'app', 'js');
} catch (e) {
  // esbuild already printed the diagnostics (logLevel 'warning'); print the summary too.
  console.error(String(e && e.message || e));
  process.exit(1);
}
for (const [n, re] of [[JS, /^a\/app\.[A-Za-z0-9_-]+\.js$/], [CSS, /^a\/app\.[A-Za-z0-9_-]+\.css$/], [T0_JS, /^a\/t0\.[A-Za-z0-9_-]+\.js$/], [T0_CSS, /^a\/t0\.[A-Za-z0-9_-]+\.css$/]]) {
  if (!re.test(n)) fail(`unexpected output name ${n}`);
}

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

// ─── 10. Stale-hash cleanup (only (app|t0|world-default).<hash>.(js|css)(.map) in <out>/a/) ────────
{
  const current = new Set([JS, CSS, T0_JS, T0_CSS, WORLD_DEFAULT_JS].map((f) => path.basename(f)));
  if (dev) for (const f of [...current]) current.add(f + '.map');
  const re = /^(app|t0|world-default)\.[A-Za-z0-9_-]+\.(js|css)(\.map)?$/;
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
  // Orchestrator decision (merge step 4, recorded in qa/int/merged.json): app JS <= 360 KB gz, CSS <= 12 KB gz, total
  // transfer <= 600 KB gz (BRIEF's binding ceiling is 1 MB); supersedes X§7.3.1's 275 / 8 / 450 and the per-WP allocations.
  add(JS, 360 * KB);
  add(CSS, 12 * KB);
  for (const [, f] of FONTS) add(`fonts/${f}`, null);
  add('world.js', 13 * KB);          // ARCH-ADDENDUM X§7.3.1 (was 12; A11 placeholder data)
  const fontsRaw = rows.filter((r) => r.rel.startsWith('fonts/')).reduce((s, r) => s + r.raw, 0);
  const totalRaw = rows.reduce((s, r) => s + r.raw, 0);
  const totalGz = rows.reduce((s, r) => s + r.gz, 0);
  const over = [];
  for (const r of rows) if (r.budgetGz != null && r.gz > r.budgetGz) over.push(`OVER BUDGET ${r.rel}: ${(r.gz / KB).toFixed(1)} KB gz > ${(r.budgetGz / KB).toFixed(0)} KB`);
  if (fontsRaw > 140 * KB) over.push(`OVER BUDGET fonts: ${(fontsRaw / KB).toFixed(1)} KB raw > ≈136 KB`);
  if (totalGz > 600 * KB) over.push(`OVER BUDGET total: ${(totalGz / KB).toFixed(1)} KB gz > 600 KB`);
  // T0 (no WebGL) also fetches its own pair; the transfer budget holds for that visitor too.
  const t0Rows = [T0_JS, T0_CSS].map((rel) => { const buf = fs.readFileSync(path.join(out, rel)); return { rel, raw: buf.length, gz: gz(buf) }; });
  const t0Gz = totalGz + t0Rows[0].gz + t0Rows[1].gz;
  if (t0Gz > 600 * KB) over.push(`OVER BUDGET total for a T0 visitor: ${(t0Gz / KB).toFixed(1)} KB gz > 600 KB`);

  const w = Math.max(...rows.map((r) => r.rel.length), 5) + 2;
  const fmt = (n) => (n / KB).toFixed(1).padStart(9) + ' KB';
  console.log(`${'file'.padEnd(w)}${'raw'.padStart(12)}${'gzip -9'.padStart(12)}`);
  for (const r of rows) console.log(`${r.rel.padEnd(w)}${fmt(r.raw)}${fmt(r.gz)}`);
  console.log(`${'total'.padEnd(w)}${fmt(totalRaw)}${fmt(totalGz)}`);
  for (const r of t0Rows) console.log(`${r.rel.padEnd(w)}${fmt(r.raw)}${fmt(r.gz)}   (T0 only)`);
  console.log(`${'total, T0 visitor'.padEnd(w)}${''.padStart(12)}${fmt(t0Gz)}`);
  for (const l of over) console.log(l);
  if (strict && over.length) { console.error('build failed: payload budget exceeded (--strict)'); process.exit(1); }
}

// ─── 12. Done ─────────────────────────────────────────────────────────────────────────────────────
console.log(`${dev ? 'dev build' : 'production build'}, ${Date.now() - T_START} ms`);
console.log(`built → ${out}`);
process.exit(0);
