// Testes Playwright da atribuição de anúncio (Fase 2). Cenários L (LPs -v2), M (/mari/ + obrigado), E (ponta a ponta), R (não regressão).
// Uso: node scripts/test-atribuicao.js [L|M|E|R ...]   (sem argumento roda todos os cenários disponíveis)
// Sobe um servidor local estático (raiz do repositório) com /api/* repassado ao Worker com KV em memória (mesma origem).
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const DAY = 86400000;
const SALE_KEY = 'test_sale_key_0123456789abcdef0123'; // só para teste local
const EXPORT_BASIC = 'Basic ' + Buffer.from('u_test:p_test').toString('base64');
const MIME = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' };
const SLUGS = ['holistic-energy-massage-en', 'holistic-energy-massage-nl', 'relaxation-massage-en', 'relaxation-massage-nl', 'couples-massage-en', 'couples-massage-nl'];

function fakeKV() {
  const m = new Map();
  return {
    m,
    async get(k, t) { const e = m.get(k); if (!e) return null; return t === 'json' ? JSON.parse(e.v) : e.v; },
    async put(k, v, o = {}) { m.set(k, { v, ttl: o.expirationTtl }); },
    async list({ prefix = '' } = {}) { return { keys: [...m.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }; }
  };
}

async function startServer(opts = {}) {
  const { createWorker } = await import('../workers/atribuicao/worker.js');
  const state = { kv: fakeKV(), api: [], now: () => Date.now(), down: false, rewrite: opts.rewrite || {} };
  const env = () => ({ ATTR: state.kv, SALE_KEY, EXPORT_USER: 'u_test', EXPORT_PASS: 'p_test', CONVERSION_NAME: 'Compra (importada)' });
  const worker = createWorker(() => state.now());
  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    if (u.pathname.startsWith('/api/')) {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = Buffer.concat(chunks).toString();
      state.api.push({ method: req.method, path: u.pathname, body, auth: req.headers.authorization || '' });
      if (state.down) { res.writeHead(503); return res.end(); }
      const r = await worker.fetch(new Request('http://x' + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body }), env());
      res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(Buffer.from(await r.arrayBuffer()));
    }
    let p = decodeURIComponent(u.pathname);
    if (state.rewrite[p]) p = state.rewrite[p];
    let f = path.join(ROOT, p);
    if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    res.end(fs.readFileSync(f));
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  state.base = 'http://127.0.0.1:' + server.address().port;
  state.close = () => new Promise(r => server.close(r));
  return state;
}

async function newCtx(browser, srv, { mobile = true, seed = null } = {}) {
  const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 } : { viewport: { width: 1280, height: 800 } });
  await ctx.route(u => !u.href.startsWith(srv.base), r => r.abort()); // bloqueia gtm, gtranslate, fontes
  if (seed) await ctx.addInitScript(s => { try { if (!sessionStorage.getItem('__seed')) { for (const k in s) localStorage.setItem(k, s[k]); sessionStorage.setItem('__seed', '1'); } } catch (e) {} }, seed);
  return ctx;
}
async function openPage(ctx, srv, url, errs) {
  const page = await ctx.newPage();
  page.on('pageerror', e => errs && errs.push(e.message));
  await page.goto(srv.base + url, { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ content: "document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) e.preventDefault(); });" });
  return page;
}
const dl = page => page.evaluate(() => Array.from(window.dataLayer || []).map(x => Array.from(x)));
const dlEvents = async (page, name) => (await dl(page)).filter(x => x[0] === 'event' && x[1] === name);
const lsGet = (page, k) => page.evaluate(k => localStorage.getItem(k), k);
const hrefs = page => page.evaluate(() => Array.from(document.querySelectorAll('a[href*="wa.me"]')).map(a => a.getAttribute('href')));
const clickAllWa = page => page.evaluate(() => { const a = Array.from(document.querySelectorAll('a[href*="wa.me"]')); a.forEach(x => x.click()); return a.length; });
const leadPosts = srv => srv.api.filter(x => x.path === '/api/lead');
const rawHrefs = async (srv, url) => { const t = await (await fetch(srv.base + url)).text(); return [...t.matchAll(/href="(https:\/\/wa\.me\/31634366008[^"]*)"/g)].map(m => m[1]); };
const blockOf = html => { const i = html.indexOf('// AD ATTRIBUTION'); return html.slice(html.lastIndexOf('<script>', i), html.indexOf('</script>', i)); };

const results = [];
const ok = name => { results.push(name); console.log('OK ' + name); };
const GCLID = 'Test_gclid-123456';
const REF_RE = /^MG-[2-9A-HJ-NP-Z]{5}$/;
const SUFFIX_RE = /%0A%0A\(ref%20(MG-[2-9A-HJ-NP-Z]{5})\)$/;

async function scenarioL(browser, srv) {
  const errs = [];
  // L9 (bloco idêntico nos 6)
  const blocks = SLUGS.map(s => blockOf(fs.readFileSync(path.join(ROOT, s + '-v2/index.html'), 'utf8')));
  assert.ok(blocks.every(b => b.length > 500 && b === blocks[0]), 'bloco AD ATTRIBUTION diferente');

  for (const slug of SLUGS) {
    const url = '/' + slug + '-v2/';
    const raw = await rawHrefs(srv, url);
    const rawText = raw.filter(h => h.includes('?text='));
    assert.ok(rawText.length >= 4, slug + ' links');

    // L1 sem escolha
    srv.api.length = 0;
    let ctx = await newCtx(browser, srv); let page = await openPage(ctx, srv, url + '?gclid=' + GCLID, errs);
    assert.deepStrictEqual(await hrefs(page), raw, 'L1 hrefs ' + slug);
    assert.strictEqual(await lsGet(page, 'mg_attr_v1'), null);
    await clickAllWa(page); await page.waitForTimeout(100);
    assert.strictEqual(leadPosts(srv).length, 0);
    assert.strictEqual((await dlEvents(page, 'whatsapp_ref')).length, 0);
    // L5 (prévia): nenhuma conversão de lead
    assert.strictEqual((await dlEvents(page, 'conversion')).length, 0);
    // L10 banner
    assert.ok(await page.isVisible('#cookie-banner'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'scroll horizontal ' + slug);
    await ctx.close();

    // L2 Essential only com registro pré-existente
    const old = JSON.stringify({ ref: 'MG-K7P2X', k: 'gclid', c: GCLID, ct: Date.now() - 1000, lp: url });
    ctx = await newCtx(browser, srv, { seed: { mg_attr_v1: old } }); page = await openPage(ctx, srv, url, errs);
    assert.strictEqual(await lsGet(page, 'mg_attr_v1'), old, 'sem escolha não mexe');
    assert.deepStrictEqual(await hrefs(page), raw, 'sem escolha: href original');
    srv.api.length = 0;
    await page.click('#cookie-reject');
    assert.strictEqual(await lsGet(page, 'mg_attr_v1'), null, 'L2 apagou');
    assert.strictEqual(await lsGet(page, 'cookie_consent_v1'), 'denied');
    assert.deepStrictEqual(await hrefs(page), raw);
    await clickAllWa(page); await page.waitForTimeout(100);
    assert.strictEqual(leadPosts(srv).length, 0);
    await ctx.close();

    // L3 + L4 + L5: gclid + Accept
    srv.api.length = 0;
    ctx = await newCtx(browser, srv); page = await openPage(ctx, srv, url + '?gclid=' + GCLID, errs);
    const t0 = Date.now();
    await page.click('#cookie-accept');
    assert.strictEqual(await lsGet(page, 'cookie_consent_v1'), 'granted'); // banner continua gravando
    const rec = JSON.parse(await lsGet(page, 'mg_attr_v1'));
    assert.ok(REF_RE.test(rec.ref) && rec.k === 'gclid' && rec.c === GCLID && rec.lp === url && rec.ct >= t0 - 100 && rec.ct <= Date.now(), 'L3 registro ' + JSON.stringify(rec));
    const now = await hrefs(page);
    assert.strictEqual(now.length, raw.length);
    now.forEach((h, i) => {
      if (raw[i].includes('?text=')) {
        assert.strictEqual(h, raw[i] + '%0A%0A(ref%20' + rec.ref + ')');
        assert.strictEqual(decodeURIComponent(h.split('?text=')[1]), decodeURIComponent(raw[i].split('?text=')[1]) + '\n\n(ref ' + rec.ref + ')');
      } else assert.strictEqual(h, raw[i], 'link sem text muda');
    });
    // L8 recarregar 3 vezes
    for (let i = 0; i < 3; i++) await page.reload({ waitUntil: 'domcontentloaded' });
    await page.addScriptTag({ content: "document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) e.preventDefault(); });" });
    const after = await hrefs(page);
    after.forEach(h => { if (h.includes('?text=')) { assert.strictEqual(h.split('%28ref').length + h.split('(ref').length, 3, 'sufixo duplicado'); assert.ok(h.endsWith('(ref%20' + rec.ref + ')')); } });
    assert.strictEqual(JSON.parse(await lsGet(page, 'mg_attr_v1')).ref, rec.ref);
    assert.strictEqual(JSON.parse(await lsGet(page, 'mg_attr_v1')).ct, rec.ct, 'ct não muda com o mesmo gclid');
    // L4: um beacon por botão
    srv.api.length = 0;
    const textLinks = await page.evaluate(() => Array.from(document.querySelectorAll('a[data-wa-orig]')).length);
    assert.strictEqual(textLinks, rawText.length);
    await page.evaluate(() => Array.from(document.querySelectorAll('a[data-wa-orig]')).forEach(a => a.click()));
    await page.waitForTimeout(200);
    const posts = leadPosts(srv);
    assert.strictEqual(posts.length, textLinks, 'L4 beacons ' + slug);
    posts.forEach(p => assert.deepStrictEqual(JSON.parse(p.body), { ref: rec.ref, k: 'gclid', c: GCLID, ct: rec.ct, lp: url, pv: 1 }));
    // L5: sem conversão e sem whatsapp_ref na -v2
    assert.strictEqual((await dlEvents(page, 'conversion')).length, 0, 'L5 conversion');
    assert.strictEqual((await dlEvents(page, 'whatsapp_ref')).length, 0, 'L5 whatsapp_ref');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await ctx.close();

    // L6 consentimento salvo, sem gclid e sem registro → ref no texto, sem beacon
    srv.api.length = 0;
    ctx = await newCtx(browser, srv, { seed: { cookie_consent_v1: 'granted' } }); page = await openPage(ctx, srv, url, errs);
    const r6 = JSON.parse(await lsGet(page, 'mg_attr_v1'));
    assert.ok(REF_RE.test(r6.ref) && r6.c === undefined);
    (await hrefs(page)).forEach(h => { if (h.includes('?text=')) assert.ok(SUFFIX_RE.test(h)); });
    await clickAllWa(page); await page.waitForTimeout(100);
    assert.strictEqual(leadPosts(srv).length, 0);
    await ctx.close();

    // L6b: visita 1 com gclid, visita 2 sem gclid → mesmo ref e gclid guardado no beacon
    ctx = await newCtx(browser, srv, { seed: { cookie_consent_v1: 'granted' } });
    page = await openPage(ctx, srv, url + '?gclid=' + GCLID, errs);
    const v1 = JSON.parse(await lsGet(page, 'mg_attr_v1')); await page.close();
    page = await openPage(ctx, srv, url, errs);
    srv.api.length = 0;
    await page.evaluate(() => document.querySelector('a[data-wa-orig]').click()); await page.waitForTimeout(100);
    assert.deepStrictEqual(JSON.parse(leadPosts(srv)[0].body), { ref: v1.ref, k: 'gclid', c: GCLID, ct: v1.ct, lp: url, pv: 1 });
    await ctx.close();
    // L6c: registro de 91 dias é descartado
    const stale = JSON.stringify({ ref: 'MG-ZZZZZ', k: 'gclid', c: GCLID, ct: Date.now() - 91 * DAY, lp: url });
    ctx = await newCtx(browser, srv, { seed: { cookie_consent_v1: 'granted', mg_attr_v1: stale } }); page = await openPage(ctx, srv, url, errs);
    const r91 = JSON.parse(await lsGet(page, 'mg_attr_v1'));
    assert.ok(r91.ref !== 'MG-ZZZZZ' && r91.c === undefined, 'L6 91 dias');
    await ctx.close();

    // L7 adulterados + gbraid
    ctx = await newCtx(browser, srv, { seed: { cookie_consent_v1: 'granted' } });
    for (const bad of [encodeURIComponent('<script>alert(1)</script>'), 'a'.repeat(300), 'a%20b', 'short']) {
      page = await openPage(ctx, srv, url + '?gclid=' + bad, errs);
      const r7 = JSON.parse(await lsGet(page, 'mg_attr_v1'));
      assert.strictEqual(r7.c, undefined, 'L7 aceitou ' + bad.slice(0, 20));
      assert.ok(!(await page.evaluate(() => document.documentElement.outerHTML.includes('alert(1)') && document.body.innerHTML.includes('alert(1)'))));
      await page.close(); await ctx.clearCookies(); await (await ctx.newPage()).evaluate(() => 0).catch(() => {});
      const p2 = await ctx.newPage(); await p2.goto(srv.base + url, { waitUntil: 'domcontentloaded' }); await p2.evaluate(() => localStorage.removeItem('mg_attr_v1')); await p2.close();
    }
    page = await openPage(ctx, srv, url + '?gbraid=Gbraid_click_12345', errs);
    assert.strictEqual(JSON.parse(await lsGet(page, 'mg_attr_v1')).k, 'gbraid');
    await ctx.close();
  }
  ok('L1'); ok('L2'); ok('L3'); ok('L4'); ok('L5'); ok('L6'); ok('L7'); ok('L8'); ok('L9');

  // L3 também em desktop; L10 banner Accept/Essential e sem erros de JS
  const ctx = await newCtx(browser, srv, { mobile: false });
  const page = await openPage(ctx, srv, '/couples-massage-nl-v2/?gclid=' + GCLID, errs);
  await page.click('#cookie-accept');
  assert.ok(SUFFIX_RE.test((await hrefs(page)).find(h => h.includes('?text='))));
  await ctx.close();
  assert.deepStrictEqual(errs, [], 'erros de JS: ' + errs.join(' | '));
  ok('L10');
}

(async () => {
  const want = process.argv.slice(2).map(s => s.toUpperCase());
  const run = k => !want.length || want.includes(k);
  const browser = await chromium.launch();
  const srv = await startServer();
  try {
    if (run('L')) await scenarioL(browser, srv);
  } finally { await browser.close(); await srv.close(); }
  console.log('TODOS OS CENARIOS OK (' + results.join(' ') + ')');
})().catch(e => { console.error('FALHOU:', e); process.exit(1); });
