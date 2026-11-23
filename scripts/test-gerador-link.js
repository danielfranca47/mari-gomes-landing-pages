#!/usr/bin/env node
/*
  Teste do gerador de link (/mari/) e da página de obrigado (/thank-you/, /nl/thank-you/).
  Como rodar (na raiz do repositório):   node scripts/test-gerador-link.js
  Requer o Playwright com Chromium já instalado (require('playwright')) e python3.
  Sai com código 0 e imprime "OK <cenário>" quando tudo passa; "FAIL ..." e código 1 se algo falhar.
  Variáveis opcionais: BASE_REF (commit contra o qual comparar os <script>, padrão ad67fb4),
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
     JSON.stringify(r[0].items) === JSON.stringify([{ item_id: 'rlx90', item_name: 'Holistic Relaxation 90 min', item_category: 'relaxation', price: 300, quantity: 1 }]),
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

  // ===== Cenário 5: gerador =====
  {
    const c = await newCtx(); await routeTestPin(c); const p = await newPage(c);
    await p.goto(ORIGIN + '/mari/'); await p.fill('#pin', TEST_PIN); await p.click('#pin-btn'); await p.waitForSelector('#gen:not([hidden])');
    const opts = await p.$$eval('#svc option', o => o.map(x => x.value));
    ok(opts.join() === 'rlx60,rlx90,rlx120,nrg60,nrg90,nrg120,cpl90,cpl120,cpl150,cpl180,other', 'C5 ordem da lista', opts.join());
    await p.selectOption('#svc', 'nrg90');
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
    await p.click('input[name=lang][value=nl]', { force: true }).catch(async () => { await p.check('input[name=lang][value=nl]', { force: true }); });
    await p.click('#gen-btn');
    const linkNl = await p.textContent('#link-out');
    ok(new RegExp('^' + ORIGIN + '/nl/thank-you/\\?s=nrg90&v=390&id=[a-z0-9]{8}$').test(linkNl), 'C5 link NL', linkNl);
    const wa = await p.getAttribute('#wa-btn', 'href');
    const decoded = decodeURIComponent(wa.slice('https://wa.me/?text='.length));
    ok(wa.startsWith('https://wa.me/?text=') && decoded === (await p.inputValue('#msg-out')) && decoded.includes(linkNl) && decoded.startsWith('Hoi!'), 'C5 botao WhatsApp (NL) sem numero + texto = mensagem+link');
    const bad = /intimate|intimacy|sensual|desire|pleasure|erotic|erotisch|nuru|body to body|happy ending|escort|sexy|adult|visit|bezoek|outcall|incall|aan huis|thuis|op locatie|hotel|at home|tantric|tantra/i;
    const msgs = [decoded];
    await p.check('input[name=lang][value=en]', { force: true }); await p.click('#gen-btn'); msgs.push(await p.inputValue('#msg-out'));
    ok(msgs.every(m => !bad.test(m)) && /^Hi! Thank you/.test(msgs[1]), 'C5 mensagens EN/NL sem termos proibidos');
    // outro
    await p.selectOption('#svc', 'other');
    ok((await p.inputValue('#val')) === '' && await p.$eval('#gen-btn', b => b.disabled), 'C5 Outro vazio -> Gerar desabilitado');
    for (const v of ['20', '5000']) { await p.fill('#val', v); ok(await p.$eval('#gen-btn', b => b.disabled) && (await p.textContent('#val-msg')).length > 0, 'C5 valor ' + v + ' -> desabilitado + aviso', await p.textContent('#val-msg')); }
    // prévia
    await p.selectOption('#svc', 'rlx60'); await p.click('#gen-btn');
    const prev = await p.getAttribute('#prev-btn', 'href'); const gen = await p.textContent('#link-out');
    ok(prev === gen + '&test', 'C5 Ver previa = link + &test', prev);
    const pp = await newPage(c); const pr = await visit(pp, prev.replace(ORIGIN, ''));
    ok(pr.length === 0, 'C5 Ver previa -> nenhum purchase');
    // e2e: contexto novo, sem flag
    const c3 = await newCtx(); const p3 = await newPage(c3);
    const e2e = await visit(p3, gen.replace(ORIGIN, ''));
    ok(e2e.length === 1 && e2e[0].value === 250 && e2e[0].items[0].item_id === 'rlx60' && e2e[0].transaction_id === gen.slice(-8), 'C5 ponta a ponta (contexto novo)', 'tx=' + (e2e[0] && e2e[0].transaction_id) + ' value=' + (e2e[0] && e2e[0].value));
    await c3.close();
    // C6 mobile /mari/
    await p.selectOption('#svc', 'cpl90'); await p.click('#gen-btn'); await p.waitForTimeout(400);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    const small = await p.$$eval('.btn, .link-btn, select, input[type=text]', els => els.filter(e => e.offsetParent !== null && e.getBoundingClientRect().height < 44).map(e => e.id || e.className));
    await p.screenshot({ path: path.join(SHOTS, 'mari-390.png'), fullPage: true });
    ok(sw <= 390 && small.length === 0, 'C6 /mari/ 390px sem scroll horizontal e alvos >= 44px', 'scrollWidth=' + sw + ' pequenos=' + JSON.stringify(small));
    await c.close();
  }
  {
    const c = await newCtx(); const p = await newPage(c);
    await p.goto(ORIGIN + '/thank-you/?test'); await p.waitForTimeout(300);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.screenshot({ path: path.join(SHOTS, 'thank-you-390.png'), fullPage: true });
    ok(sw <= 390, 'C6 /thank-you/ 390px sem scroll horizontal', 'scrollWidth=' + sw + '; screenshots em ' + SHOTS);
    await c.close();
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
