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
const SALE_KEY = 'k_abcdefghij0123456789ABCDEFGHIJ'; // só para teste local (32 caracteres)
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

    // L4b: /…-v2/index.html também é prévia (pv:1, lp normalizado, sem whatsapp_ref)
    srv.api.length = 0;
    ctx = await newCtx(browser, srv, { seed: { cookie_consent_v1: 'granted' } }); page = await openPage(ctx, srv, url + 'index.html?gclid=' + GCLID, errs);
    await page.evaluate(() => document.querySelector('a[data-wa-orig]').click()); await page.waitForTimeout(150);
    assert.strictEqual(leadPosts(srv).length, 1);
    assert.deepStrictEqual({ pv: JSON.parse(leadPosts(srv)[0].body).pv, lp: JSON.parse(leadPosts(srv)[0].body).lp }, { pv: 1, lp: url }, 'index.html pv');
    assert.strictEqual((await dlEvents(page, 'whatsapp_ref')).length, 0, 'index.html whatsapp_ref');
    assert.ok(srv.kv.m.has('pv:lead:' + JSON.parse(leadPosts(srv)[0].body).ref) && ![...srv.kv.m.keys()].some(k => k.startsWith('lead:') && k !== 'lead:MG-K7P2X'), 'index.html foi para lead: real');
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

const { execSync } = require('child_process');
const PIN_HASH = (fs.readFileSync(path.join(ROOT, 'mari/index.html'), 'utf8').match(/var PIN_HASH = '([0-9a-f]{64})'/) || [])[1];
const API_KEY = SALE_KEY;
const MSG = "Hi Mari! I'm John and I'm interested in a Tantric Energy Experience session. Could you please send me more details and availability?\n\n(ref MG-K7P2X)";
const BASE = '5711c4e';
const convBlock = h => { const i = h.indexOf('// CONVERSION'); return h.slice(h.lastIndexOf('<script>', i), h.indexOf('</script>', i)); };
const salePosts = srv => srv.api.filter(x => x.path === '/api/sale');

async function openMari(ctx, srv, errs, hash) {
  const page = await ctx.newPage();
  page.on('pageerror', e => errs && errs.push(e.message));
  await page.goto(srv.base + '/mari/' + (hash || ''), { waitUntil: 'domcontentloaded' });
  return page;
}
async function generate(page, { key = 'nrg', dur = 'nrg90' } = {}) {
  await page.click('.exp-card[data-key="' + key + '"]');
  if (dur) await page.click('.dur-btn[data-s="' + dur + '"]');
  await page.click('#gen-btn');
  return page.textContent('#link-out');
}

async function scenarioM(browser, srv) {
  const errs = [];
  const seed = (extra) => Object.assign({ mg_pin_ok: PIN_HASH }, extra || {});
  const addLead = ref => srv.kv.put('lead:' + ref, JSON.stringify({ k: 'gclid', c: GCLID, ct: Date.now() - 1000, lp: '/holistic-energy-massage-en/' }), { expirationTtl: 9999999 });
  await addLead('MG-K7P2X');

  // M1 colar a mensagem inteira
  let ctx = await newCtx(browser, srv, { seed: seed() }); let page = await openMari(ctx, srv, errs);
  await page.fill('#ref', MSG);
  assert.strictEqual(await page.inputValue('#ref'), 'MG-K7P2X');
  await page.fill('#ref', 'oi, tudo bem?'); await page.dispatchEvent('#ref', 'change');
  assert.ok((await page.textContent('#ref-msg')).length > 5, 'aviso neutro');
  assert.strictEqual(await page.inputValue('#ref'), 'oi, tudo bem?');
  await page.click('.exp-card[data-key="nrg"]'); await page.click('.dur-btn[data-s="nrg90"]');
  assert.ok(!(await page.isDisabled('#gen-btn')), 'gerar continua permitido sem código');
  await page.fill('#ref', 'mg-k7p2x'); assert.strictEqual(await page.inputValue('#ref'), 'MG-K7P2X');
  ok('M1');

  // M2 link com &r= / sem código igual à Fase 1
  srv.api.length = 0;
  let link = await generate(page);
  assert.ok(/^http:\/\/127\.0\.0\.1:\d+\/thank-you\/\?s=nrg90&v=350&id=[a-z0-9]{8}&r=MG-K7P2X$/.test(link), link);
  const prev = await page.getAttribute('#prev-btn', 'href'); assert.ok(prev.endsWith('&r=MG-K7P2X&test'));
  assert.ok(decodeURIComponent((await page.getAttribute('#wa-btn', 'href')).split('?text=')[1]).includes('&r=MG-K7P2X'));
  await page.fill('#ref', ''); // limpa e gera de novo
  link = await generate(page);
  assert.ok(/\/thank-you\/\?s=nrg90&v=350&id=[a-z0-9]{8}$/.test(link), 'sem código = Fase 1: ' + link);
  ok('M2');

  // M3 POST /api/sale
  await ctx.close(); srv.api.length = 0;
  ctx = await newCtx(browser, srv, { seed: seed({ mg_api_key: API_KEY }) }); page = await openMari(ctx, srv, errs);
  await page.fill('#ref', MSG);
  link = await generate(page);
  await page.waitForFunction(() => /ligada/.test(document.getElementById('sale-msg').textContent));
  let sp = salePosts(srv); assert.strictEqual(sp.length, 1);
  const id1 = /id=([a-z0-9]{8})/.exec(link)[1];
  assert.deepStrictEqual(JSON.parse(sp[0].body), { ref: 'MG-K7P2X', id: id1, v: 350, s: 'nrg90' });
  assert.ok(!sp[0].body.includes('John') && !sp[0].body.includes('Hi Mari'));
  assert.strictEqual(sp[0].auth, 'Bearer ' + API_KEY);
  assert.ok((await page.textContent('#sale-msg')).includes('Venda ligada ao anúncio ✓'));
  assert.ok(srv.kv.m.has('sale:' + id1));
  // código sem clique registrado
  await page.fill('#ref', 'MG-AAAAA'); await generate(page);
  await page.waitForFunction(() => /sem clique/i.test(document.getElementById('sale-msg').textContent) || /Código sem clique/.test(document.getElementById('sale-msg').textContent));
  assert.ok((await page.textContent('#sale-msg')).includes('Código sem clique de anúncio registrado'));
  // sem código: nenhum POST
  srv.api.length = 0; await page.fill('#ref', ''); await generate(page); await page.waitForTimeout(150);
  assert.strictEqual(salePosts(srv).length, 0);
  // Worker fora do ar
  srv.down = true; await page.fill('#ref', 'MG-K7P2X'); link = await generate(page);
  await page.waitForFunction(() => /Não deu para registrar/.test(document.getElementById('sale-msg').textContent));
  assert.ok(/thank-you\/\?s=nrg90/.test(link) && !(await page.isHidden('#out')), 'link funciona com o Worker fora do ar');
  srv.down = false; await ctx.close();
  // sem chave: nenhum POST
  srv.api.length = 0;
  ctx = await newCtx(browser, srv, { seed: seed() }); page = await openMari(ctx, srv, errs);
  await page.fill('#ref', MSG); await generate(page); await page.waitForTimeout(150);
  assert.strictEqual(salePosts(srv).length, 0);
  assert.ok(!(await page.isHidden('#out')));
  await ctx.close();
  ok('M3');

  // M4 #k=
  ctx = await newCtx(browser, srv, { seed: seed() }); page = await openMari(ctx, srv, errs, '#k=' + API_KEY);
  assert.strictEqual(await lsGet(page, 'mg_api_key'), API_KEY);
  assert.strictEqual(await page.evaluate(() => location.hash + '|' + location.href.includes('#')), '|false');
  await page.click('#forget-btn');
  assert.strictEqual(await lsGet(page, 'mg_api_key'), null, 'forget apaga a chave');
  await ctx.close();
  ctx = await newCtx(browser, srv, { seed: seed() });
  for (const bad of ['#k=curta', '#k=' + 'a'.repeat(65), '#k=' + 'a'.repeat(31) + '!']) {
    page = await openMari(ctx, srv, errs, bad);
    assert.strictEqual(await lsGet(page, 'mg_api_key'), null, 'chave inválida aceita: ' + bad);
    await page.close();
  }
  await ctx.close();
  ok('M4');

  // M5 prévia não chama o Worker nem dispara purchase
  ctx = await newCtx(browser, srv, { seed: seed() }); page = await openMari(ctx, srv, errs);
  await page.fill('#ref', MSG); await generate(page);
  const prevUrl = await page.getAttribute('#prev-btn', 'href'); await ctx.close();
  srv.api.length = 0;
  ctx = await newCtx(browser, srv); page = await ctx.newPage(); await page.goto(prevUrl, { waitUntil: 'domcontentloaded' });
  assert.strictEqual((await dlEvents(page, 'purchase')).length, 0, 'prévia dispara purchase');
  assert.strictEqual(srv.api.length, 0); await ctx.close();
  ok('M5');

  // M6 obrigado EN/NL
  for (const base of ['/thank-you/', '/nl/thank-you/']) {
    ctx = await newCtx(browser, srv); page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message));
    await page.goto(srv.base + base + '?s=nrg90&v=350&id=abcd1234&r=MG-K7P2X', { waitUntil: 'domcontentloaded' });
    let pu = await dlEvents(page, 'purchase'); assert.strictEqual(pu.length, 1);
    assert.strictEqual(pu[0][2].ref_code, 'MG-K7P2X'); assert.strictEqual(pu[0][2].transaction_id, 'abcd1234'); assert.strictEqual(pu[0][2].value, 350);
    await ctx.close();
    for (const bad of ['MG-0OOO1', encodeURIComponent('<img src=x onerror=alert(1)>'), 'mg-k7p2x', 'MG-K7P2XX']) {
      ctx = await newCtx(browser, srv); page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message));
      await page.goto(srv.base + base + '?s=nrg90&v=350&id=abcd1234&r=' + bad, { waitUntil: 'domcontentloaded' });
      pu = await dlEvents(page, 'purchase'); assert.strictEqual(pu.length, 1);
      assert.strictEqual(pu[0][2].ref_code, undefined, 'ref_code aceito: ' + bad);
      assert.ok(!(await page.evaluate(() => document.body.innerHTML.includes('onerror=alert'))));
      await ctx.close();
    }
  }
  const ty = fs.readFileSync(path.join(ROOT, 'thank-you/index.html'), 'utf8'), tn = fs.readFileSync(path.join(ROOT, 'nl/thank-you/index.html'), 'utf8');
  assert.ok(convBlock(ty) === convBlock(tn), 'bloco CONVERSION difere EN/NL');
  for (const f of ['thank-you/index.html', 'nl/thank-you/index.html']) {
    const cur = fs.readFileSync(path.join(ROOT, f), 'utf8'), old = execSync('git show ' + BASE + ':' + f, { cwd: ROOT, maxBuffer: 1 << 26 }).toString();
    assert.strictEqual(cur.replace(convBlock(cur), ''), old.replace(convBlock(old), ''), f + ' mudou fora do bloco CONVERSION');
  }
  ok('M6');

  // M7 gerador de link + layout mobile
  const gl = execSync('node scripts/test-gerador-link.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  assert.ok(gl.includes('TODOS OS CENARIOS OK'), gl.slice(-400));
  ctx = await newCtx(browser, srv, { seed: seed() }); page = await openMari(ctx, srv, errs);
  await page.fill('#ref', MSG); await generate(page);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '/mari/ scroll horizontal');
  const small = await page.evaluate(() => Array.from(document.querySelectorAll('button, a.btn, select, input[type=text], textarea')).filter(e => e.offsetParent !== null && e.getBoundingClientRect().height < 44).map(e => (e.id || e.className) + ':' + Math.round(e.getBoundingClientRect().height)));
  assert.deepStrictEqual(small, [], 'alvos < 44px: ' + small);
  assert.strictEqual(await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('ref')).fontSize)), 16);
  await ctx.close();
  assert.deepStrictEqual(errs, [], errs.join(' | '));
  ok('M7');
}

async function scenarioE(browser) {
  // LP -v2 servida no caminho REAL (/holistic-energy-massage-en/), simulando a promoção: sem a trava -v2, a conversão de lead dispara
  const srv = await startServer({ rewrite: { '/holistic-energy-massage-en/': '/holistic-energy-massage-en-v2/index.html' } });
  const errs = [];
  try {
    const url = '/holistic-energy-massage-en/';
    let ctx = await newCtx(browser, srv); let page = await openPage(ctx, srv, url + '?gclid=' + GCLID, errs);
    await page.click('#cookie-accept');
    const rec = JSON.parse(await lsGet(page, 'mg_attr_v1'));
    srv.api.length = 0;
    await page.evaluate(() => document.querySelector('a.nav-cta').click()); await page.waitForTimeout(200);
    const conv = await dlEvents(page, 'conversion');
    assert.strictEqual(conv.length, 1, 'conversões de lead por clique: ' + conv.length);
    assert.strictEqual(conv[0][2].send_to, 'AW-18036442650/9rp5CIvso6QcEJqMuZhD');
    assert.strictEqual((await dlEvents(page, 'whatsapp_ref')).length, 1);
    assert.strictEqual((await dlEvents(page, 'whatsapp_ref'))[0][2].ref_code, rec.ref);
    const lp = leadPosts(srv); assert.strictEqual(lp.length, 1);
    assert.deepStrictEqual(JSON.parse(lp[0].body), { ref: rec.ref, k: 'gclid', c: GCLID, ct: rec.ct, lp: url, pv: 0 });
    assert.ok(srv.kv.m.has('lead:' + rec.ref) && !srv.kv.m.has('pv:lead:' + rec.ref));
    const waText = decodeURIComponent((await hrefs(page)).find(h => h.includes('?text=')).split('?text=')[1]);
    assert.ok(waText.endsWith('\n\n(ref ' + rec.ref + ')'));
    await ctx.close(); ok('E1');

    // E2 /mari/ com a mensagem do cliente (a Mari cola a conversa inteira)
    ctx = await newCtx(browser, srv, { seed: { mg_pin_ok: PIN_HASH, mg_api_key: API_KEY } }); page = await openMari(ctx, srv, errs);
    await page.fill('#ref', 'Hi Mari! ' + waText);
    assert.strictEqual(await page.inputValue('#ref'), rec.ref);
    const link1 = await generate(page);
    await page.waitForFunction(() => /ligada/.test(document.getElementById('sale-msg').textContent));
    const id1 = /id=([a-z0-9]{8})/.exec(link1)[1];
    const csv = async () => { const r = await fetch(srv.base + '/api/export.csv', { headers: { authorization: EXPORT_BASIC } }); assert.strictEqual(r.status, 200); return (await r.text()).trim().split('\n'); };
    let lines = await csv();
    assert.strictEqual(lines.length, 3, lines.join('\n'));
    let cols = lines[2].split(',');
    assert.strictEqual(cols[0], GCLID); assert.strictEqual(cols[3], '350'); assert.strictEqual(cols[5], id1); assert.strictEqual(cols[6], 'Granted');
    ok('E2');

    // E3 gerar de novo para o mesmo código: continua 1 linha (a última)
    const link2 = await generate(page, { key: 'nrg', dur: 'nrg90' });
    await page.waitForTimeout(300);
    const id2 = /id=([a-z0-9]{8})/.exec(link2)[1];
    assert.notStrictEqual(id1, id2);
    lines = await csv();
    assert.strictEqual(lines.length, 3, 'E3 ' + lines.join('\n'));
    assert.strictEqual(lines[2].split(',')[5], id2);
    await ctx.close(); ok('E3');

    // E4 outro "aparelho" (contexto novo, sem nenhum storage da LP) abre o link de obrigado
    ctx = await newCtx(browser, srv); page = await ctx.newPage();
    await page.goto(link2.replace(/^https?:\/\/[^/]+/, srv.base), { waitUntil: 'domcontentloaded' });
    const pu = await dlEvents(page, 'purchase');
    assert.strictEqual(pu.length, 1); assert.strictEqual(pu[0][2].transaction_id, id2); assert.strictEqual(pu[0][2].ref_code, rec.ref);
    await ctx.close(); ok('E4');
    assert.deepStrictEqual(errs, [], errs.join(' | '));
  } finally { await srv.close(); }
}

async function scenarioR() {
  const sh = (c, o) => execSync(c, Object.assign({ cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 27 }, o || {}));
  const tracked = f => sh('git show ' + BASE + ':' + f);
  const changed = sh('git diff --name-only ' + BASE + ' --').split('\n').filter(Boolean).concat(sh('git ls-files -o --exclude-standard').split('\n').filter(Boolean));

  // R1 só arquivos permitidos; LPs reais, legados, home, institucionais e workflow byte a byte iguais
  const allowed = /^(workers\/atribuicao\/[^/]+|scripts\/[^/]+|(holistic-energy|relaxation|couples)-massage-(en|nl)-v2\/index\.html|mari\/index\.html|thank-you\/index\.html|nl\/thank-you\/index\.html|docs\/implementations\/(atribuicao-anuncio-fase2|gerador-link-conversao|pagina-obrigado-avaliacao)\.md|docs\/pendencias-mary\.md|trafego\/(conversoes-offline|alteracoes)\.md)$/; // alteracoes.md: vem do main (rótulo da conversão Compra)
  const extra = changed.filter(f => !allowed.test(f));
  assert.deepStrictEqual(extra, [], 'fora do permitido: ' + extra);
  const frozen = sh("git ls-files '*-massage-en/index.html' '*-massage-nl/index.html' 'lp*-*.html' 'home-*.html' index.html nl about treatments prices workshop fly-me-in .github").split('\n').filter(f => f && !/-v2\//.test(f) && !/thank-you\//.test(f));
  assert.ok(frozen.length > 20);
  assert.strictEqual(sh('git diff --name-only ' + BASE + ' -- ' + frozen.map(f => JSON.stringify(f)).join(' ')).trim(), '', 'arquivo congelado mudou');
  ok('R1');

  // R2 cada -v2 = <slug>/index.html + só noindex + trava + bloco
  const bloco = fs.readFileSync(path.join(__dirname, 'atribuicao-bloco.html'), 'utf8');
  const LEAD = "document.querySelectorAll('a[href*=\"wa.me\"]').forEach(function (link) {\n  link.addEventListener('click', function () {\n    gtag('event', 'conversion', { 'send_to': 'AW-18036442650/9rp5CIvso6QcEJqMuZhD' });\n  });\n});";
  const LEAD_V2 = "// Prévia -v2: sem conversão de lead (teste da Mari não pode gerar conversão falsa). Removido na promoção.\nif (!/-v2\\//.test(location.pathname)) {\n" + LEAD + "\n}";
  for (const slug of SLUGS) {
    const v2 = fs.readFileSync(path.join(ROOT, slug + '-v2/index.html'), 'utf8');
    const real = fs.readFileSync(path.join(ROOT, slug + '/index.html'), 'utf8');
    assert.strictEqual(real, tracked(slug + '/index.html'), slug + ' real mudou');
    assert.ok(v2.includes('<meta name="robots" content="noindex, nofollow">'));
    let back = v2.replace('<meta name="robots" content="noindex, nofollow">\n', '');
    assert.ok(back.includes(LEAD_V2) && back.includes(bloco), slug + ': trava/bloco ausente');
    back = back.replace(LEAD_V2, LEAD).replace(bloco, '');
    assert.strictEqual(back, real, slug + ': -v2 difere da LP real além de noindex + trava + bloco');
    // blocos críticos presentes e idênticos
    for (const needle of ["gtag('consent', 'default'", 'GT-55XJZX3L', "gtag('config', 'G-EBY5JJD27V')", "gtag('config', 'AW-18036442650')", "var KEY = 'cookie_consent_v1'", 'cdn.gtranslate.net/widgets/latest/flags.js']) {
      assert.ok(v2.includes(needle) && real.includes(needle), slug + ' falta ' + needle);
    }
  }
  ok('R2');

  // R3 workflow publica as 6 -v2 e não publica workers/ nem scripts/
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'site-r3-'));
  try {
    sh('cp -r . ' + JSON.stringify(path.join(tmp, 'repo')) + ' 2>/dev/null; true');
    const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/pages.yml'), 'utf8');
    const script = wf.match(/run: \|\n([\s\S]*?)\n\s+- uses: actions\/upload-pages-artifact/)[1].split('\n').map(l => l.replace(/^ {10}/, '')).join('\n');
    fs.writeFileSync(path.join(tmp, 'step.sh'), script);
    sh('bash ' + JSON.stringify(path.join(tmp, 'step.sh')), { cwd: path.join(tmp, 'repo'), stdio: 'pipe' });
    for (const slug of SLUGS) assert.ok(fs.existsSync(path.join(tmp, 'repo/_site', slug + '-v2/index.html')), 'não publicou ' + slug + '-v2');
    assert.ok(!fs.existsSync(path.join(tmp, 'repo/_site/workers')) && !fs.existsSync(path.join(tmp, 'repo/_site/scripts')), 'publicou workers/ ou scripts/');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  ok('R3');

  // R4 nenhum segredo/chave/PIN fora de scripts/ (valores de teste) e nada que pareça chave real no repositório
  const files = sh('git ls-files -co --exclude-standard').split('\n').filter(f => f && !/^scripts\//.test(f) && !/\.(webp|png|jpg|jpeg)$/.test(f));
  const bad = [];
  for (const f of files) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (/k_abcdefghij|test_sale_key|u_test|p_test|135790/.test(t)) bad.push(f + ': valor de teste');
    if (/#k=[A-Za-z0-9_-]{32,}/.test(t)) bad.push(f + ': #k= com chave');
    if (/(SALE_KEY|EXPORT_PASS|EXPORT_USER)\s*[:=]\s*["'][^"']{6,}/.test(t)) bad.push(f + ': segredo literal');
  }
  assert.deepStrictEqual(bad, [], bad.join('; '));
  ok('R4');

  // R5 vocabulário: o texto acrescentado ao WhatsApp é só "(ref MG-XXXXX)"; o bloco não escreve texto visível
  const sfx = decodeURIComponent('%0A%0A(ref%20MG-K7P2X)');
  assert.ok(/^\n\n\(ref MG-[2-9A-HJ-NP-Z]{5}\)$/.test(sfx));
  const banned = /intimate|intimacy|sensual|desire|pleasure|erotic|erotisch|nuru|happy ending|escort|sexy|adult|tantr|visit|bezoek|outcall|incall|hotel/i;
  assert.ok(!banned.test(sfx));
  assert.ok(!/innerHTML|textContent|innerText|document\.write|insertAdjacent/.test(bloco), 'bloco escreve texto visível');
  ok('R5');
}

(async () => {
  const want = process.argv.slice(2).map(s => s.toUpperCase());
  const run = k => !want.length || want.includes(k);
  const browser = await chromium.launch();
  const srv = await startServer();
  try {
    if (run('L')) await scenarioL(browser, srv);
    if (run('M')) await scenarioM(browser, srv);
    if (run('E')) await scenarioE(browser);
    if (run('R')) await scenarioR();
  } finally { await browser.close(); await srv.close(); }
  console.log('TODOS OS CENARIOS OK (' + results.join(' ') + ')');
})().catch(e => { console.error('FALHOU:', e); process.exit(1); });
