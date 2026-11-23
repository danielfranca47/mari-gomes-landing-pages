#!/usr/bin/env node
/*
  Teste do gerador de link (/mari/) e da página de obrigado (/thank-you/, /nl/thank-you/).
  Como rodar (na raiz do repositório):   node scripts/test-gerador-link.js
  Requer o Playwright com Chromium já instalado (require('playwright')) e python3.
  Sai com código 0 e imprime "OK <cenário>" quando tudo passa; "FAIL ..." e código 1 se algo falhar.
  Variáveis opcionais: LP_ROOT (pasta com as LPs a comparar com o catálogo; padrão: a raiz do repo), BASE_REF (commit contra o qual comparar os <script>, padrão ad67fb4),
  SHOTS_DIR (onde salvar screenshots; padrão: pasta temporária do sistema).
  Serve a raiz do repo com python3 -m http.server (localhost é contexto seguro p/ crypto.subtle).
  Bloqueia googletagmanager/gtranslate/fonts e lê window.dataLayer.
*/
const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE_REF = process.env.BASE_REF || 'ad67fb4';
const SHOTS = process.env.SHOTS_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'gerador-shots-'));
const TEST_PIN = '135790'; // PIN só do teste: o teste troca o PIN_HASH da página em memória
const sha = s => require('crypto').createHash('sha256').update(s).digest('hex');
let failures = 0;
function ok(cond, name, detail) {
  if (cond) console.log('OK   ' + name + (detail ? '  — ' + detail : ''));
  else { failures++; console.log('FAIL ' + name + (detail ? '  — ' + detail : '')); }
}

// Paridade catálogo × LPs de anúncio (as LPs são a fonte da verdade). Só lê arquivos. Devolve lista de divergências.
function parityErrors(lpRoot, CAT) {
  const errs = [];
  const rd = f => fs.readFileSync(path.join(lpRoot, f, 'index.html'), 'utf8');
  const dec = s => s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
  const sect = (t, id) => { const m = t.match(new RegExp('<section[^>]*id="' + id + '"[\\s\\S]*?</section>')); return m ? m[0] : ''; };
  const LP = {
    rlx: { en: 'relaxation-massage-en', nl: 'relaxation-massage-nl', types: 'sessions', typeRe: /<h3>(.*?)<\/h3>/g, rec: /<span class="price-tag">(.*?)<\/span>/, kind: 'cards' },
    nrg: { en: 'holistic-energy-massage-en', nl: 'holistic-energy-massage-nl', types: 'therapies', typeRe: /<div class="therapy-name">(.*?)<\/div>/g, rec: /<span class="price-tag">(.*?)<\/span>/, kind: 'cards' },
    cpl: { en: 'couples-massage-en', nl: 'couples-massage-nl', types: 'options', typeRe: /<div class="option-name">(.*?)<\/div>/g, kind: 'rows' }
  };
  const pairs = (t, kind) => {
    const sec = sect(t, 'pricing'), out = [];
    const re = kind === 'cards' ? /<div class="price-dur">(.*?)<\/div>\s*<div class="price-val">€(\d+)<\/div>/g : /<div class="price-row"><span>(.*?)<\/span><strong>€(\d+)<\/strong><\/div>/g;
    let m; while ((m = re.exec(sec))) out.push({ label: dec(m[1]), price: +m[2] });
    return out;
  };
  const featuredIdx = t => { // índice do card "featured" entre os price-card
    const sec = sect(t, 'pricing'); const cards = sec.split('<div class="price-card').slice(1);
    return cards.findIndex(c => /^ featured/.test(c));
  };
  const types = (t, lp) => { const sec = sect(t, lp.types); const o = []; let m; const re = new RegExp(lp.typeRe.source, 'g'); while ((m = re.exec(sec))) o.push(dec(m[1])); return o; };
  const popIdx = (t, lp) => { const sec = sect(t, lp.types); const m = sec.match(/<div class="option-popular">[\s\S]*?<div class="option-name">(.*?)<\/div>/); return m ? types(t, lp).indexOf(dec(m[1])) : -1; };
  let lastStart = 0;
  CAT.filter(e => e.key !== 'other').forEach(e => {
    const lp = LP[e.key], en = rd(lp.en), nl = rd(lp.nl), tag = '[' + e.key + '] ';
    const title = (en.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    if (!dec(title).includes(e.name)) errs.push(tag + 'nome "' + e.name + '" nao esta no <title> da LP EN: ' + title);
    if (lp.kind === 'cards' && !sect(en, 'pricing').includes(e.name + ' · Prices')) errs.push(tag + 'nome nao esta no rotulo de precos da LP EN');
    const pe = pairs(en, lp.kind), pn = pairs(nl, lp.kind);
    const cat = e.durations.map(d => ({ label: d.label, price: d.price }));
    if (JSON.stringify(pe) !== JSON.stringify(cat)) errs.push(tag + 'duracoes/precos EN: LP=' + JSON.stringify(pe) + ' catalogo=' + JSON.stringify(cat));
    if (JSON.stringify(pn.map(x => x.price)) !== JSON.stringify(cat.map(x => x.price))) errs.push(tag + 'precos NL: ' + JSON.stringify(pn.map(x => x.price)));
    const prices = cat.map(x => x.price); if (prices.join() !== prices.slice().sort((a, b) => a - b).join()) errs.push(tag + 'precos fora de ordem crescente');
    if (prices[0] < lastStart) errs.push(tag + 'experiencias fora de ordem de preco inicial'); lastStart = prices[0];
    const recCat = e.durations.findIndex(d => d.rec);
    if (lp.kind === 'cards') {
      const fe = featuredIdx(en), fn = featuredIdx(nl);
      if (fe !== recCat) errs.push(tag + 'rec: LP EN destaca indice ' + fe + ', catalogo ' + recCat);
      if (fn !== fe) errs.push(tag + 'rec: LP NL destaca indice ' + fn + ' (EN ' + fe + ')');
      if (!/Recommended/.test(sect(en, 'pricing')) || !/Aanbevolen/.test(sect(nl, 'pricing'))) errs.push(tag + 'selo Recommended/Aanbevolen ausente');
    } else if (recCat !== -1 || /price-tag|Recommended/.test(sect(en, 'pricing'))) errs.push(tag + 'LP3 nao tem duracao recomendada');
    const te = types(en, lp), tn = types(nl, lp), tc = e.types.map(x => dec(x.name));
    if (JSON.stringify(te) !== JSON.stringify(tc)) errs.push(tag + 'tipos EN: LP=' + JSON.stringify(te) + ' catalogo=' + JSON.stringify(tc));
    if (tn.length !== te.length) errs.push(tag + 'qtd de tipos NL ' + tn.length + ' != EN ' + te.length);
    const popCat = e.types.findIndex(x => x.pop), pe2 = popIdx(en, lp), pn2 = popIdx(nl, lp);
    if (pe2 !== popCat) errs.push(tag + 'pop: LP EN indice ' + pe2 + ', catalogo ' + popCat);
    if (pn2 !== pe2) errs.push(tag + 'pop: LP NL indice ' + pn2 + ' (EN ' + pe2 + ')');
  });
  return errs;
}

function freePort() {
  return new Promise(res => { const s = require('net').createServer().listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });
}

async function main() {
  const port = await freePort();
  const srv = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1000));
  const ORIGIN = 'http://localhost:' + port;
  const browser = await chromium.launch();
  const newCtx = (extra) => browser.newContext(Object.assign({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }, extra || {}));
  async function newPage(ctx) {
    const p = await ctx.newPage();
    await p.route(/googletagmanager\.com|gtranslate\.net|fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    return p;
  }
  // Troca o hash do PIN pelo do PIN de teste (a página real nunca é alterada)
  async function routeTestPin(ctx, pin) {
    await ctx.route('**/mari/', async route => {
      const resp = await route.fetch(); let body = await resp.text();
      body = body.replace(/var PIN_HASH = '[0-9a-f]{64}'/, "var PIN_HASH = '" + sha('mari-gomes:' + (pin || TEST_PIN)) + "'");
      await route.fulfill({ response: resp, body });
    });
  }
  const purchases = p => p.evaluate(() => (window.dataLayer || []).filter(a => a[0] === 'event' && a[1] === 'purchase').map(a => a[2]));
  async function visit(p, url) { await p.goto(ORIGIN + url); await p.waitForLoadState('load'); await p.waitForTimeout(150); return purchases(p); }
  async function fresh(url) { const c = await newCtx(); const p = await newPage(c); const r = await visit(p, url); await c.close(); return r; }

  // ===== Cenário 1: parâmetros válidos =====
  let r = await fresh('/thank-you/?s=rlx90&v=300&id=abc12345');
  ok(r.length === 1 && r[0].value === 300 && r[0].currency === 'EUR' && r[0].transaction_id === 'abc12345' &&
     JSON.stringify(r[0].items) === JSON.stringify([{ item_id: 'rlx90', item_name: 'Tantric Holistic Relaxation 90 min', item_category: 'relaxation', price: 300, quantity: 1 }]),
     'C1 EN parametros validos', JSON.stringify(r[0]));
  r = await fresh('/nl/thank-you/?s=rlx90&v=300&id=abc12345');
  ok(r.length === 1 && r[0].value === 300 && r[0].transaction_id === 'abc12345' && r[0].items[0].item_id === 'rlx90', 'C1 NL parametros validos', JSON.stringify(r[0]));
  r = await fresh('/thank-you/?s=cpl150&v=480,50&id=abc12345');
  ok(r.length === 1 && r[0].value === 480.5, 'C1 virgula aceita', 'value=' + (r[0] && r[0].value));
  r = await fresh('/thank-you/?s=other&v=120&id=abc12345');
  ok(r.length === 1 && r[0].value === 120 && r[0].items[0].item_id === 'other', 'C1 other', 'item_id=' + (r[0] && r[0].items[0].item_id) + ' value=' + (r[0] && r[0].value));

  // ===== Cenário 2: inválidos / adulterados =====
  for (const bad of ['999999', '1e9', '-5', 'abc', '20']) {
    r = await fresh('/thank-you/?s=nrg90&v=' + bad + '&id=abc12345');
    ok(r.length === 1 && r[0].value === 350, 'C2 v=' + bad + ' com s=nrg90 -> 350', 'value=' + (r[0] && r[0].value));
  }
  r = await fresh('/thank-you/?v=999999');
  ok(r.length === 1 && r[0].value === 250, 'C2 v=999999 sem s -> 250', 'value=' + (r[0] && r[0].value));
  for (const bad of ['%3Cscript%3E', 'xyz']) {
    const c = await newCtx(); const p = await newPage(c);
    r = await visit(p, '/thank-you/?s=' + bad + '&v=300&id=abc12345');
    const html = await p.content();
    const generic = r.length === 1 && r[0].items[0].item_id === 'session' && r[0].items[0].item_name === 'Mari Gomes session' && !r[0].items[0].item_category;
    ok(generic && !/xyz/.test(html) && !/<script>alert/.test(html), 'C2 s=' + bad + ' -> item generico, param fora do DOM e do evento', JSON.stringify(r[0].items));
    await c.close();
  }
  for (const bad of ['..%2F..%2Fx', 'ABC12345', 'a'.repeat(40)]) {
    r = await fresh('/thank-you/?s=rlx90&v=300&id=' + bad);
    ok(r.length === 1 && /^ty-/.test(r[0].transaction_id), 'C2 id invalido (' + bad.slice(0, 12) + ') -> ty-...', 'tx=' + (r[0] && r[0].transaction_id));
  }
  r = await fresh('/thank-you/');
  ok(r.length === 1 && r[0].value === 250 && r[0].items[0].item_id === 'session', 'C2 legado /thank-you/ puro', 'value=' + (r[0] && r[0].value));
  r = await fresh('/thank-you/?v=350');
  ok(r.length === 1 && r[0].value === 350 && r[0].items[0].item_id === 'session', 'C2 legado ?v=350', 'value=' + (r[0] && r[0].value));

  // ===== Cenário 3: ?test, dedupe, aparelho interno =====
  r = await fresh('/thank-you/?test&s=rlx90&v=300&id=abc12345');
  ok(r.length === 0, 'C3 ?test com params -> nenhum purchase');
  r = await fresh('/thank-you/?test');
  ok(r.length === 0, 'C3 ?test puro -> nenhum purchase');
  {
    const c = await newCtx(); const p = await newPage(c);
    await visit(p, '/thank-you/?s=rlx90&v=300&id=abc12345');
    r = await visit(p, '/thank-you/?s=rlx90&v=300&id=abc12345');
    ok(r.length === 0, 'C3 mesmo id 2x no mesmo navegador -> 1 so (2a abertura nao dispara)');
    r = await visit(p, '/nl/thank-you/?s=rlx90&v=300&id=abc12345');
    ok(r.length === 0, 'C3 mesmo id em /nl/ no mesmo navegador -> nao dispara de novo');
    r = await visit(p, '/thank-you/?s=rlx90&v=300&id=def67890');
    ok(r.length === 1 && r[0].transaction_id === 'def67890', 'C3 id diferente em seguida -> 2o purchase', 'tx=' + (r[0] && r[0].transaction_id));
    await c.close();
  }
  {
    const c = await newCtx(); const p = await newPage(c);
    const a = await visit(p, '/thank-you/?v=350'); const b = await visit(p, '/thank-you/?v=350');
    ok(a.length === 1 && b.length === 0, 'C3 sem id: 2 aberturas < 12 h -> 1 purchase');
    await c.close();
  }
  {
    const c = await newCtx(); const p = await newPage(c);
    await p.goto(ORIGIN + '/thank-you/?test'); await p.evaluate(() => localStorage.setItem('mg_internal_device', '1'));
    r = await visit(p, '/thank-you/?s=rlx90&v=300&id=abc12345');
    ok(r.length === 0, 'C3 mg_internal_device=1 -> nenhum purchase');
    await c.close();
  }

  // ===== Cenário 4: PIN =====
  {
    const c = await newCtx(); await routeTestPin(c); const p = await newPage(c);
    await p.goto(ORIGIN + '/mari/');
    ok(!(await p.isVisible('#gen')) && (await p.$eval('#gen', e => e.hidden)) && !(await p.isVisible('#gen-btn')), 'C4 sem PIN: gerador escondido (hidden)');
    await p.focus('#pin'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
    const focusInGen = await p.evaluate(() => !!document.activeElement.closest('#gen'));
    ok(!focusInGen, 'C4 sem PIN: gerador nao e focavel');
    await p.fill('#pin', '000000'); await p.click('#pin-btn');
    ok((await p.textContent('#pin-msg')) === 'PIN incorreto' && !(await p.isVisible('#gen')), 'C4 PIN errado -> "PIN incorreto", gerador escondido');
    for (let i = 0; i < 4; i++) { await p.fill('#pin', '11111' + i); await p.click('#pin-btn'); await p.waitForTimeout(60); }
    ok(await p.$eval('#pin-btn', b => b.disabled) && /30 s/.test(await p.textContent('#pin-msg')), 'C4 5 erros -> espera de 30 s', await p.textContent('#pin-msg'));
    await c.close();
  }
  {
    const c = await newCtx(); await routeTestPin(c); const p = await newPage(c);
    await p.goto(ORIGIN + '/mari/');
    await p.fill('#pin', TEST_PIN); await p.click('#pin-btn'); await p.waitForSelector('#gen:not([hidden])');
    ok(await p.isVisible('#gen-btn') && (await p.evaluate(() => localStorage.getItem('mg_internal_device'))) === '1', 'C4 PIN certo -> gerador aparece e grava flag do aparelho');
    await p.reload(); await p.waitForTimeout(200);
    ok(await p.isVisible('#gen-btn'), 'C4 recarregar -> continua desbloqueado');
    await p.click('#lock-btn');
    ok(await p.isVisible('#pin') && !(await p.isVisible('#gen')) && (await p.evaluate(() => localStorage.getItem('mg_internal_device'))) === '1', 'C4 Bloquear -> pede PIN de novo (flag do aparelho mantida)');
    await p.fill('#pin', TEST_PIN); await p.click('#pin-btn'); await p.waitForSelector('#gen:not([hidden])');
    await p.click('#forget-btn');
    ok(await p.isVisible('#pin') && (await p.evaluate(() => localStorage.getItem('mg_internal_device'))) === null, 'C4 "Este aparelho nao e da Mari" -> apaga as duas chaves');
    // trocar o hash: novo contexto roteado com outro PIN, mantendo o localStorage antigo
    await p.fill('#pin', TEST_PIN); await p.click('#pin-btn'); await p.waitForSelector('#gen:not([hidden])');
    const state = await c.storageState(); await c.close();
    const c2 = await newCtx({ storageState: state }); await routeTestPin(c2, '999999'); const p2 = await newPage(c2);
    await p2.goto(ORIGIN + '/mari/'); await p2.waitForTimeout(200);
    ok(await p2.isVisible('#pin') && !(await p2.isVisible('#gen')), 'C4 trocar PIN_HASH -> volta a pedir PIN');
    await c2.close();
  }
  {
    const files = execSync('git ls-files -co --exclude-standard', { cwd: ROOT }).toString().split('\n').filter(f => f && !/\.(webp|png|jpg|jpeg)$/i.test(f));
    let hit = [];
    // o teste usa um PIN próprio; aqui só garante que o PIN real (informado via env MARI_PIN, se houver) não está no repo
    if (process.env.MARI_PIN) hit = files.filter(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes(process.env.MARI_PIN));
    ok(hit.length === 0, 'C4 PIN real fora do repo', process.env.MARI_PIN ? 'verificado com MARI_PIN' : 'MARI_PIN nao informado: nada verificado');
  }

  // ===== Cenário 5 (+ D2/D3/D5): gerador =====
  const IMG_REQS = [];
  {
    const c = await newCtx(); await routeTestPin(c); const p = await newPage(c);
    p.on('request', r => { if (/\/images\//.test(r.url())) IMG_REQS.push(r.url()); });
    await p.goto(ORIGIN + '/mari/'); await p.waitForTimeout(600);
    ok(IMG_REQS.length === 0, 'D2 antes do PIN nenhuma requisicao a /images/*', 'requisicoes=' + IMG_REQS.length);
    await p.fill('#pin', TEST_PIN); await p.click('#pin-btn'); await p.waitForSelector('#gen:not([hidden])');
    const pick = async (key, s, t) => { await p.click('.exp-card[data-key=' + key + ']'); if (t !== undefined) await p.selectOption('#type', t); if (s) await p.click('.dur-btn[data-s=' + s + ']'); };

    // ordem
    const keys = await p.$$eval('.exp-card', e => e.map(x => x.dataset.key));
    ok(keys.join() === 'rlx,nrg,cpl,other', 'C5 ordem das experiencias (por preco inicial)', keys.join());
    const durOrder = {};
    for (const k of ['rlx', 'nrg', 'cpl']) { await p.click('.exp-card[data-key=' + k + ']'); durOrder[k] = (await p.$$eval('.dur-btn', e => e.map(x => x.dataset.s))).join(); }
    ok(durOrder.rlx === 'rlx60,rlx90,rlx120' && durOrder.nrg === 'nrg60,nrg90,nrg120' && durOrder.cpl === 'cpl90,cpl120,cpl150,cpl180', 'C5 ordem das duracoes (crescente)', JSON.stringify(durOrder));

    // D2 miniaturas
    const imgs = await p.$$eval('.exp-card img', els => els.map(i => ({ src: i.getAttribute('src'), lazy: i.loading, alt: i.alt, w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height })));
    await p.waitForFunction(() => Array.from(document.querySelectorAll('.exp-card img')).every(i => i.complete && i.naturalWidth > 0), null, { timeout: 5000 }).catch(() => {});
    const nat = await p.$$eval('.exp-card img', els => els.map(i => i.naturalWidth));
    ok(imgs.length === 3 && imgs.every((i, n) => /^\/images\/[A-Za-z0-9_]+\.webp$/.test(i.src) && fs.existsSync(path.join(ROOT, i.src)) && i.w >= 56 && i.w <= 72 && i.h >= 56 && i.h <= 72 && nat[n] > 0), 'D2 3 miniaturas /images/*.webp, existem, 56–72 px, naturalWidth>0', JSON.stringify(imgs.map(i => i.src)) + ' nat=' + nat);
    ok(imgs.map(i => i.alt).join('|') === 'Cliente deitada na maca à luz de velas — Tantric Holistic Relaxation|Retrato da Mari vestida de preto — Tantric Energy Experience|Casal abraçado no estúdio — Couples Massage' && imgs.every(i => i.lazy === 'lazy' && i.alt.length > 5 && !/amarigomes|https?:/.test(i.src)), 'D2 loading=lazy, alt preenchido, sem URL externa/amarigomes');
    ok(IMG_REQS.length >= 3 && IMG_REQS.every(u => u.startsWith(ORIGIN + '/images/')), 'D2 imagens so baixadas depois do PIN', IMG_REQS.map(u => u.split('/').pop()).join(','));
    const cut = await p.$$eval('.exp-card .nm, .exp-card .pr', els => els.filter(e => e.scrollWidth > e.clientWidth + 1 || getComputedStyle(e).textOverflow === 'ellipsis').map(e => e.textContent));
    const names = await p.$$eval('.exp-card .nm', e => e.map(x => x.textContent)); const prs = await p.$$eval('.exp-card .pr', e => e.map(x => x.textContent));
    ok(cut.length === 0 && names.join('|') === 'Tantric Holistic Relaxation|Tantric Energy Experience|Couples Massage|Other session' && prs.slice(0, 3).join('|') === '€250 · €300 · €350|€300 · €350 · €400|€350 · €400 · €450 · €500', 'D2 nome + faixa de preco visiveis sem corte', names.join('|') + ' / ' + prs.join('|'));

    // D3 selos / tipo
    await p.click('.exp-card[data-key=rlx]');
    ok((await p.$$eval('.dur-btn i', e => e.map(x => x.textContent))).join() === 'Recomendado' && /Recomendado/.test(await p.textContent('.dur-btn[data-s=rlx90]')), 'D3 selo Recomendado so em rlx90');
    await p.click('.exp-card[data-key=nrg]');
    ok((await p.$$eval('.dur-btn i', e => e.map(x => x.textContent))).join() === 'Recomendado' && /Recomendado/.test(await p.textContent('.dur-btn[data-s=nrg90]')), 'D3 selo Recomendado so em nrg90');
    await p.click('.exp-card[data-key=cpl]');
    const cplTypes = await p.$$eval('#type option', o => o.map(x => x.textContent));
    ok(cplTypes.join('|') === 'Não especificar|Relaxation Duo|Holistic Couple Experience · Mais pedido|Tantric Couple Therapy' && (await p.$$('.dur-btn i')).length === 0, 'D3 tipos do casal, "Mais pedido" so em Holistic Couple Experience, sem Recomendado', cplTypes.join('|'));

    // D3 fluxo com tipo
    await pick('cpl', 'cpl150', 'hce');
    ok((await p.inputValue('#val')) === '450', 'D3 duracao preenche o valor (450)');
    await p.click('#gen-btn');
    const l1 = await p.textContent('#link-out');
    ok(new RegExp('^' + ORIGIN + '/thank-you/\\?s=cpl150&t=hce&v=450&id=[a-z0-9]{8}$').test(l1), 'D3 link com tipo', l1);
    await p.selectOption('#type', '');
    ok(!(await p.isVisible('#out')), 'D3 trocar o tipo apaga o link mostrado');
    await p.click('#gen-btn'); const l2 = await p.textContent('#link-out');
    ok(new RegExp('^' + ORIGIN + '/thank-you/\\?s=cpl150&v=450&id=[a-z0-9]{8}$').test(l2) && l1 !== l2, 'D3 "Não especificar" -> link sem t, id novo', l2);
    await p.click('.exp-card[data-key=rlx]');
    ok(!(await p.isVisible('#out')) && (await p.inputValue('#type')) === '' && (await p.$$eval('.dur-btn[aria-checked=true]', e => e.length)) === 0 && (await p.inputValue('#val')) === '' && await p.$eval('#gen-btn', b => b.disabled), 'D3 trocar de experiencia limpa tipo, duracao, valor e link');

    // fluxo geral (energy 90 editado)
    await pick('nrg', 'nrg90');
    ok((await p.inputValue('#val')) === '350', 'C5 Energy 90 preenche 350');
    await p.fill('#val', '380'); await p.click('#gen-btn');
    const link1 = await p.textContent('#link-out');
    ok(new RegExp('^' + ORIGIN + '/thank-you/\\?s=nrg90&v=380&id=[a-z0-9]{8}$').test(link1), 'C5 link EN com v=380', link1);
    await p.click('#gen-btn'); const link2 = await p.textContent('#link-out');
    ok(link1 !== link2, 'C5 gerar 2x -> ids diferentes', link1.slice(-8) + ' / ' + link2.slice(-8));
    await p.fill('#val', '380,5'); await p.click('#gen-btn');
    ok(/v=380\.5&/.test(await p.textContent('#link-out')), 'C5 virgula normalizada para ponto');
    await p.fill('#val', '380'); await p.click('#gen-btn');
    await p.fill('#val', '390');
    ok(!(await p.isVisible('#out')), 'C5 editar valor apaga o link mostrado');
    await p.check('input[name=lang][value=nl]', { force: true });
    await p.click('#gen-btn');
    const linkNl = await p.textContent('#link-out');
    ok(new RegExp('^' + ORIGIN + '/nl/thank-you/\\?s=nrg90&v=390&id=[a-z0-9]{8}$').test(linkNl), 'C5 link NL', linkNl);

    // D5 mensagens
    const EXP_EN = id => 'Hi! Thank you for your session today, it was lovely to welcome you.\n\nIf you have a minute, I would love to hear how it was for you:\n' + id + '\n\nWarm regards,\nMari';
    const EXP_NL = id => 'Hoi! Dank je wel voor je sessie vandaag, het was fijn je te ontvangen.\n\nAls je een minuutje hebt, hoor ik graag hoe je het vond:\n' + id + '\n\nHartelijke groet,\nMari';
    const EXP_NLC = id => 'Hoi! Dank jullie wel voor jullie sessie vandaag, het was fijn jullie te ontvangen.\n\nAls jullie een minuutje hebben, hoor ik graag hoe jullie het vonden:\n' + id + '\n\nHartelijke groet,\nMari';
    const bad = /intimate|intimacy|sensual|desire|pleasure|erotic|erotisch|nuru|body to body|happy ending|escort|sexy|adult|visit|bezoek|outcall|incall|aan huis|thuis|op locatie|hotel|at home|tantric|tantra/i;
    const wa = await p.getAttribute('#wa-btn', 'href');
    const decoded = decodeURIComponent(wa.slice('https://wa.me/?text='.length));
    ok(wa.startsWith('https://wa.me/?text=') && decoded === (await p.inputValue('#msg-out')) && decoded === EXP_NL(linkNl), 'D5 NL individual = texto exato; WhatsApp sem numero');
    ok(wa.includes('%0A') && !wa.includes('%20%20'), 'D5 href do WhatsApp tem %0A e nao tem %20%20');
    const msgs = [decoded];
    await p.check('input[name=lang][value=en]', { force: true }); await p.click('#gen-btn');
    const linkEn = await p.textContent('#link-out'); const mEn = await p.inputValue('#msg-out'); msgs.push(mEn);
    ok(mEn === EXP_EN(linkEn) && !/ {2}/.test(mEn), 'D5 EN = texto exato, sem espaco duplo');
    await pick('cpl', 'cpl90'); await p.check('input[name=lang][value=nl]', { force: true }); await p.click('#gen-btn');
    const linkC = await p.textContent('#link-out'); const mC = await p.inputValue('#msg-out'); msgs.push(mC);
    ok(mC === EXP_NLC(linkC) && /jullie/.test(mC), 'D5 NL casal (jullie) = texto exato');
    await p.check('input[name=lang][value=en]', { force: true }); await p.click('#gen-btn'); msgs.push(await p.inputValue('#msg-out'));
    ok(msgs.every(m => !bad.test(m.replace(/https?:\/\/\S+/g, ''))), 'D5 mensagens sem termos da lista "Evitar" de vocabulario.md');

    // Outro
    await p.click('.exp-card[data-key=other]');
    ok((await p.inputValue('#val')) === '' && await p.$eval('#gen-btn', b => b.disabled) && !(await p.isVisible('#dur-list')) && !(await p.isVisible('#type')), 'C5 Outro vazio -> Gerar desabilitado, sem duracao/tipo');
    for (const v of ['20', '5000']) { await p.fill('#val', v); ok(await p.$eval('#gen-btn', b => b.disabled) && (await p.textContent('#val-msg')).length > 0, 'C5 valor ' + v + ' -> desabilitado + aviso', await p.textContent('#val-msg')); }
    await p.fill('#val', '120'); await p.click('#gen-btn');
    ok(new RegExp('\\?s=other&v=120&id=[a-z0-9]{8}$').test(await p.textContent('#link-out')), 'C5 Outro com valor 120 -> s=other, sem t');

    // prévia
    await pick('rlx', 'rlx60'); await p.click('#gen-btn');
    const prev = await p.getAttribute('#prev-btn', 'href'); const gen = await p.textContent('#link-out');
    ok(prev === gen + '&test', 'C5 Ver previa = link + &test', prev);
    const pp = await newPage(c); const pr = await visit(pp, prev.replace(ORIGIN, ''));
    ok(pr.length === 0, 'C5 Ver previa -> nenhum purchase');
    // e2e: contexto novo, sem flag
    const c3 = await newCtx(); const p3 = await newPage(c3);
    const e2e = await visit(p3, gen.replace(ORIGIN, ''));
    ok(e2e.length === 1 && e2e[0].value === 250 && e2e[0].items[0].item_id === 'rlx60' && e2e[0].items[0].item_name === 'Tantric Holistic Relaxation 60 min' && e2e[0].transaction_id === gen.slice(-8), 'C5 ponta a ponta (contexto novo)', JSON.stringify(e2e[0]));
    await c3.close();
    // e2e com tipo
    await pick('cpl', 'cpl150', 'hce'); await p.click('#gen-btn');
    const genT = await p.textContent('#link-out');
    const c4 = await newCtx(); const p4 = await newPage(c4);
    const e2eT = await visit(p4, genT.replace(ORIGIN, ''));
    ok(e2eT.length === 1 && e2eT[0].items[0].item_variant === 'Holistic Couple Experience' && e2eT[0].items[0].item_name === 'Couples Massage 2.5 hours', 'D3 ponta a ponta com tipo', JSON.stringify(e2eT[0] && e2eT[0].items));
    await c4.close();
    // iOS Safari dá zoom ao focar campo com fonte < 16px
    await pick('cpl', 'cpl90', 'hce');
    const fs16 = await p.$$eval('#pin, select, input[type=text], input[type=password], textarea', els => els.map(e => ({ id: e.id, fs: parseFloat(getComputedStyle(e).fontSize) })));
    ok(fs16.length >= 4 && fs16.every(x => x.fs >= 16), 'D6 todo select/input/textarea da /mari/ com font-size >= 16px (sem zoom do iOS)', JSON.stringify(fs16));
    // C6 mobile /mari/ (com tudo aberto)
    await pick('cpl', 'cpl90', 'hce'); await p.click('#gen-btn'); await p.waitForTimeout(400);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    const small = await p.$$eval('.btn, .link-btn, select, input[type=text], .exp-card, .dur-btn', els => els.filter(e => e.offsetParent !== null && e.getBoundingClientRect().height < 44).map(e => e.id || e.className));
    await p.screenshot({ path: path.join(SHOTS, 'mari-390.png'), fullPage: true });
    ok(sw <= 390 && small.length === 0, 'C6/D2 /mari/ 390px sem scroll horizontal e alvos >= 44px', 'scrollWidth=' + sw + ' pequenos=' + JSON.stringify(small));
    await c.close();
  }

  // ===== Cenário D4: obrigado com tipo =====
  {
    let r4 = await fresh('/thank-you/?s=cpl150&t=hce&v=450&id=abc12345');
    ok(r4.length === 1 && JSON.stringify(r4[0].items) === JSON.stringify([{ item_id: 'cpl150', item_name: 'Couples Massage 2.5 hours', item_category: 'couples', price: 450, quantity: 1, item_variant: 'Holistic Couple Experience' }]), 'D4 s+t validos -> item_variant', JSON.stringify(r4[0] && r4[0].items));
    r4 = await fresh('/nl/thank-you/?s=cpl150&t=hce&v=450&id=abc12345');
    ok(r4.length === 1 && r4[0].items[0].item_variant === 'Holistic Couple Experience', 'D4 NL idem');
    r4 = await fresh('/thank-you/?s=rlx90&t=tt&v=300&id=abc12345');
    ok(r4.length === 1 && r4[0].items[0].item_variant === undefined && r4[0].items[0].item_name === 'Tantric Holistic Relaxation 90 min', 'D4 tipo de outra familia -> sem item_variant');
    { const c = await newCtx(); const p = await newPage(c); const r5 = await visit(p, '/thank-you/?s=nrg60&t=%3Cscript%3E&v=300&id=abc12345'); const html = await p.content();
      ok(r5.length === 1 && r5[0].items[0].item_variant === undefined && !/%3Cscript%3E|t=<script/.test(html), 'D4 t=<script> -> sem item_variant e fora do DOM'); await c.close(); }
    r4 = await fresh('/thank-you/?s=other&t=hce&v=120&id=abc12345');
    ok(r4.length === 1 && r4[0].items[0].item_variant === undefined && r4[0].items[0].item_name === 'Other session', 'D4 other + t -> sem item_variant');
    r4 = await fresh('/thank-you/?s=nrg120&t=ehm&v=400&id=abc12345');
    ok(r4.length === 1 && r4[0].items[0].item_variant === 'Energetic Healing Massage' && r4[0].items[0].item_name === 'Tantric Energy Experience 120 min', 'D4 ehm na familia nrg');
  }
  {
    const c = await newCtx(); const p = await newPage(c);
    await p.goto(ORIGIN + '/thank-you/?test'); await p.waitForTimeout(300);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.screenshot({ path: path.join(SHOTS, 'thank-you-390.png'), fullPage: true });
    ok(sw <= 390, 'C6 /thank-you/ 390px sem scroll horizontal', 'scrollWidth=' + sw + '; screenshots em ' + SHOTS);
    await c.close();
  }

  // ===== Cenário D1: paridade com as LPs =====
  {
    const CAT = new Function(fs.readFileSync(path.join(ROOT, 'mari/index.html'), 'utf8').match(/\/\/ SERVICE CATALOG[\s\S]*?\/\/ END SERVICE CATALOG/)[0] + '\n; return SERVICE_CATALOG;')();
    const LP_ROOT = process.env.LP_ROOT || ROOT;
    const errs = parityErrors(LP_ROOT, CAT);
    ok(errs.length === 0, 'D1 catalogo = LPs (nome, duracoes, precos EN/NL, Recomendado, tipos, Mais pedido, ordem)', errs.join(' || ') || 'LP_ROOT=' + LP_ROOT);
    // prova de falha: cópia temporária das LPs com 1 preço alterado e 1 tipo renomeado -> o teste TEM que acusar
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lp-copy-'));
    for (const d of ['relaxation-massage-en', 'relaxation-massage-nl', 'holistic-energy-massage-en', 'holistic-energy-massage-nl', 'couples-massage-en', 'couples-massage-nl']) { fs.mkdirSync(path.join(tmp, d)); fs.copyFileSync(path.join(ROOT, d, 'index.html'), path.join(tmp, d, 'index.html')); }
    const f1 = path.join(tmp, 'relaxation-massage-en/index.html');
    fs.writeFileSync(f1, fs.readFileSync(f1, 'utf8').replace('<div class="price-val">€300</div>', '<div class="price-val">€320</div>'));
    const f2 = path.join(tmp, 'couples-massage-en/index.html');
    fs.writeFileSync(f2, fs.readFileSync(f2, 'utf8').replace('<div class="option-name">Relaxation Duo</div>', '<div class="option-name">Relaxation Trio</div>'));
    const bad = parityErrors(tmp, CAT);
    ok(bad.some(e => /\[rlx\] duracoes\/precos EN/.test(e)) && bad.some(e => /\[cpl\] tipos EN/.test(e)), 'D1 prova de falha: preco/tipo alterado numa copia temporaria das LPs e detectado', bad.map(e => e.slice(0, 90)).join(' || '));
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // ===== Cenário 7: estático =====
  {
    const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
    const ty = rd('thank-you/index.html'), tn = rd('nl/thank-you/index.html'), mr = rd('mari/index.html');
    const cat = t => { const m = t.match(/\/\/ SERVICE CATALOG[\s\S]*?\/\/ END SERVICE CATALOG/); return m ? m[0].split('\n').map(l => l.trim()).join('\n') : null; };
    ok(cat(ty) && cat(ty) === cat(tn) && cat(ty) === cat(mr), 'C7 catalogo identico nos 3 arquivos');
    const conv = t => { const m = t.match(/<script>\n\/\/ CONVERSION[\s\S]*?\n<\/script>/); return m && m[0]; };
    ok(conv(ty) && conv(ty) === conv(tn), 'C7 bloco CONVERSION identico EN/NL');
    for (const f of ['thank-you/index.html', 'nl/thank-you/index.html']) {
      const base = execSync('git show ' + BASE_REF + ':' + f, { cwd: ROOT }).toString();
      const strip = t => t.replace(/<script>\n\/\/ CONVERSION[\s\S]*?\n<\/script>/, '');
      ok(strip(rd(f)) === strip(base), 'C7 ' + f + ': tudo exceto o bloco CONVERSION identico a ' + BASE_REF);
    }
    ok(!/googletagmanager|gtranslate|gtag\(|<script[^>]+src=/i.test(mr), 'C7 /mari/ sem GTM, GTranslate, gtag nem script externo');
    ok(/<meta name="robots" content="noindex, nofollow">/.test(mr), 'C7 /mari/ noindex, nofollow');
    const refRe = /(href|src|action)=["'][^"']*\/mari\/|location[.a-z]*\s*=\s*["'][^"']*\/mari\//;
    const links = execSync("git ls-files -co --exclude-standard '*.html'", { cwd: ROOT }).toString().split('\n').filter(f => f && refRe.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    ok(links.length === 0 || (links.length === 1 && /mari\/index\.html$/.test(links[0])), 'C7 nenhum arquivo linka /mari/', JSON.stringify(links));
    ok(!/(name|phone|tel|email|telefone|nome)\b[^>]*<\/?input|<input[^>]*(name="(name|phone|tel|email)"|type="(tel|email)")/i.test(mr), 'C7 /mari/ sem campo de nome/telefone/e-mail');
    const changed = execSync('git diff --name-only ' + BASE_REF + ' --', { cwd: ROOT }).toString().split('\n').filter(Boolean)
      .concat(execSync('git ls-files -o --exclude-standard', { cwd: ROOT }).toString().split('\n').filter(Boolean));
    const allowed = /^(thank-you\/index\.html|nl\/thank-you\/index\.html|mari\/index\.html|scripts\/test-gerador-link\.js|docs\/implementations\/(gerador-link-conversao|pagina-obrigado-avaliacao|README)\.md|trafego\/alteracoes\.md)$/;
    const extra = changed.filter(f => !allowed.test(f));
    ok(extra.length === 0, 'C7 diff contra ' + BASE_REF + ' so toca arquivos permitidos', JSON.stringify(extra));
    // simulação do passo "Montar _site" do workflow
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'site-sim-'));
    const wf = rd('.github/workflows/pages.yml');
    const script = wf.match(/run: \|\n([\s\S]*?)\n\s+- uses: actions\/upload-pages-artifact/)[1].split('\n').map(l => l.replace(/^ {10}/, '')).join('\n');
    execSync('cp -r . ' + JSON.stringify(path.join(tmp, 'repo')) + ' 2>/dev/null; true', { cwd: ROOT });
    try {
      fs.writeFileSync(path.join(tmp, 'step.sh'), script);
      execSync('bash ' + JSON.stringify(path.join(tmp, 'step.sh')), { cwd: path.join(tmp, 'repo'), stdio: 'pipe' });
      ok(fs.existsSync(path.join(tmp, 'repo/_site/mari/index.html')) && !fs.existsSync(path.join(tmp, 'repo/_site/scripts')), 'C7 workflow publica mari/ e nao publica scripts/');
    } catch (e) { ok(false, 'C7 simulacao do workflow', String(e.stderr || e)); }
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  await browser.close(); srv.kill();
  console.log(failures ? '\n' + failures + ' FALHA(S)' : '\nTODOS OS CENARIOS OK');
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
