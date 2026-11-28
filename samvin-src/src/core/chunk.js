// core/chunk.js — feature chunks on demand (build.mjs §3c'): a/<name>.<hash>.js, fetched once, the first time a feature
// only some visits use is asked for. The chunk reads the app's live modules from the kit handed over here and gives its
// entry module back through done(). → Promise<module namespace> (a failed fetch rejects and may be retried).
const FILES = __CHUNKS__;                 // { show: './a/show.<hash>.js' }
const pending = new Map();

export function loadChunk(name, kit) {
  if (pending.has(name)) return pending.get(name);
  const p = new Promise((resolve, reject) => {
    const href = FILES[name];
    if (!href) { reject(new Error(`no chunk ${name}`)); return; }
    const reg = globalThis.__samvinChunk || (globalThis.__samvinChunk = {});
    reg[name] = { kit, done(m) { delete reg[name]; resolve(m); } };
    const s = document.createElement('script');
    s.src = href;
    s.onerror = () => { pending.delete(name); reject(new Error(`${href} failed to load`)); };
    document.head.appendChild(s);
  });
  pending.set(name, p);
  return p;
}
