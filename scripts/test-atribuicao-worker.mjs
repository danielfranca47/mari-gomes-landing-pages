// Cenário W — Worker de atribuição (Node, KV falso em memória, relógio injetável).
// Uso: node scripts/test-atribuicao-worker.mjs
import { createWorker } from '../workers/atribuicao/worker.js';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const DAY = 86400000;
let NOW = Date.UTC(2026, 10, 23, 12, 0, 0);
const wk = createWorker(() => NOW);

// Segredos de teste (só neste arquivo de teste; nunca valores reais)
const ENV_BASE = { SALE_KEY: 'test_sale_key_0123456789abcdef0123', EXPORT_USER: 'u_test', EXPORT_PASS: 'p_test', CONVERSION_NAME: 'Compra (importada)' };

function fakeKV() {
  const m = new Map();
  return {
    m,
    async get(k, type) { const e = m.get(k); if (!e) return null; if (e.exp !== null && e.exp <= NOW) { m.delete(k); return null; } return type === 'json' ? JSON.parse(e.v) : e.v; },
    async put(k, v, o = {}) { m.set(k, { v, exp: o.expirationTtl ? NOW + o.expirationTtl * 1000 : null, ttl: o.expirationTtl }); },
    async list({ prefix = '', cursor } = {}) { const keys = [...m.keys()].filter(k => k.startsWith(prefix) && (m.get(k).exp === null || m.get(k).exp > NOW)).map(name => ({ name })); return { keys, list_complete: true }; }
  };
}
let env, results = [];
const fresh = () => { env = { ...ENV_BASE, ATTR: fakeKV() }; };
const call = (method, path, { body, headers = {}, raw } = {}) =>
  wk.fetch(new Request('https://amarigomes.com' + path, { method, headers, body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body) }), env);
const bearer = { authorization: 'Bearer ' + ENV_BASE.SALE_KEY };
const basic = { authorization: 'Basic ' + Buffer.from(ENV_BASE.EXPORT_USER + ':' + ENV_BASE.EXPORT_PASS).toString('base64') };
const lead = (o = {}) => ({ ref: 'MG-K7P2X', k: 'gclid', c: 'Test_gclid-123456', ct: NOW - 3600000, lp: '/holistic-energy-massage-en/', pv: 0, ...o });
const sale = (o = {}) => ({ ref: 'MG-K7P2X', id: 'ab12cd34', v: 350, s: 'nrg90', ...o });
const ok = (name) => { results.push(name); console.log('OK ' + name); };

// W1
fresh();
let r = await call('POST', '/api/lead', { body: lead() });
assert.equal(r.status, 204);
let e = env.ATTR.m.get('lead:MG-K7P2X');
assert.ok(e);
assert.equal(e.ttl, Math.ceil((lead().ct + 90 * DAY - NOW) / 1000));
r = await call('POST', '/api/lead', { body: lead({ ref: 'MG-AAAAA', pv: 1, lp: '/holistic-energy-massage-en-v2/' }) });
assert.equal(r.status, 204);
assert.ok(env.ATTR.m.get('pv:lead:MG-AAAAA')); assert.ok(!env.ATTR.m.get('lead:MG-AAAAA'));
ok('W1');

// W2
const bad = [
  lead({ ref: 'MG-0OOO1' }), lead({ ref: 'mg-k7p2x' }), lead({ ref: '<script>' }),
  lead({ c: 'abc<def>ghijkl' }), lead({ c: 'has space 12345' }), lead({ c: 'a'.repeat(251) }), lead({ c: 'short' }),
  lead({ k: 'fbclid' }), lead({ ct: NOW + 10 * 60000 }), lead({ ct: NOW - 91 * DAY }), lead({ ct: 'x' }),
  lead({ lp: '/about/' }), lead({ lp: '/holistic-energy-massage-en/../x/' }), lead({ pv: 2 }), lead({ pv: undefined })
];
for (const b of bad) { fresh(); r = await call('POST', '/api/lead', { body: b }); assert.equal(r.status, 400, JSON.stringify(b)); assert.equal(env.ATTR.m.size, 0); }
fresh();
r = await call('POST', '/api/lead', { body: { ...lead(), pad: 'x'.repeat(1100) } }); assert.equal(r.status, 400);
r = await call('POST', '/api/lead', { raw: '{not json' }); assert.equal(r.status, 400);
r = await call('POST', '/api/lead', { raw: '[1,2]' }); assert.equal(r.status, 400);
assert.equal(env.ATTR.m.size, 0);
ok('W2');

// W3
fresh();
await call('POST', '/api/lead', { body: lead({ ct: NOW - 1000, c: 'Newer_click_12345' }) });
await call('POST', '/api/lead', { body: lead({ ct: NOW - 5000, c: 'Older_click_12345' }) });
assert.equal(JSON.parse(env.ATTR.m.get('lead:MG-K7P2X').v).c, 'Newer_click_12345');
await call('POST', '/api/lead', { body: lead({ ct: NOW - 500, c: 'Newest_click_1234' }) });
assert.equal(JSON.parse(env.ATTR.m.get('lead:MG-K7P2X').v).c, 'Newest_click_1234');
ok('W3');

// W4
fresh();
r = await call('POST', '/api/sale', { body: sale() }); assert.equal(r.status, 401);
r = await call('POST', '/api/sale', { body: sale(), headers: { authorization: 'Bearer wrong' } }); assert.equal(r.status, 401);
r = await call('POST', '/api/sale', { body: sale(), headers: bearer }); assert.equal(r.status, 200);
assert.deepEqual(await r.json(), { matched: false });
await call('POST', '/api/lead', { body: lead() });
r = await call('POST', '/api/sale', { body: sale(), headers: bearer });
assert.deepEqual(await r.json(), { matched: true });
for (const b of [sale({ v: 20 }), sale({ v: 5000 }), sale({ id: 'AB' }), sale({ id: 'ab12!' }), sale({ s: 'zzz' }), sale({ ref: 'MG-000' }), sale({ v: '350' })]) {
  r = await call('POST', '/api/sale', { body: b, headers: bearer }); assert.equal(r.status, 400, JSON.stringify(b));
}
ok('W4');

// W5
fresh();
r = await call('GET', '/api/export.csv'); assert.equal(r.status, 401);
r = await call('GET', '/api/export.csv', { headers: { authorization: 'Basic ' + Buffer.from('u_test:nope').toString('base64') } }); assert.equal(r.status, 401);
r = await call('GET', '/api/export.csv', { headers: basic }); assert.equal(r.status, 200);
assert.match(r.headers.get('content-type'), /^text\/csv/);
let lines = (await r.text()).trim().split('\n');
assert.equal(lines[0], 'Parameters:TimeZone=+0000');
assert.equal(lines[1], 'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Order ID,Ad User Data');
assert.equal(lines.length, 2);
ok('W5');

// W6
fresh();
const T0 = NOW; // clique em T0-1h
await call('POST', '/api/lead', { body: lead() });                                           // gclid
await call('POST', '/api/lead', { body: lead({ ref: 'MG-BBBBB', k: 'gbraid', c: 'Gbraid_click_12345' }) });
await call('POST', '/api/lead', { body: lead({ ref: 'MG-CCCCC', pv: 1, lp: '/relaxation-massage-nl-v2/' }) });
await call('POST', '/api/lead', { body: lead({ ref: 'MG-DDDDD', ct: NOW - 80 * DAY, c: 'Old_click_1234567' }) });
// MG-K7P2X: 2 vendas em < 24 h -> 1 linha (a última)
await call('POST', '/api/sale', { body: sale({ id: 'first111', v: 300, s: 'nrg60' }), headers: bearer });
NOW += 2 * 3600000;
await call('POST', '/api/sale', { body: sale({ id: 'second22', v: 350 }), headers: bearer });
// gbraid, pv, sem lead
await call('POST', '/api/sale', { body: sale({ ref: 'MG-BBBBB', id: 'braid111' }), headers: bearer });
await call('POST', '/api/sale', { body: sale({ ref: 'MG-CCCCC', id: 'prev1111' }), headers: bearer });
await call('POST', '/api/sale', { body: sale({ ref: 'MG-EEEEE', id: 'nolead11' }), headers: bearer });
// MG-DDDDD: clique há 80 dias, venda agora (ok, <= 90 dias)
await call('POST', '/api/sale', { body: sale({ ref: 'MG-DDDDD', id: 'olddd111', v: 250, s: 'rlx60' }), headers: bearer });
// venda gravada com horário > 90 dias depois do clique (injetada direto no KV falso): fora da janela
await env.ATTR.put('sale:olddd222', JSON.stringify({ ref: 'MG-DDDDD', id: 'olddd222', v: 300, s: 'rlx90', t: NOW - 80 * DAY + 91 * DAY }), { expirationTtl: 8640000 });
NOW += 1 * DAY;
// MG-K7P2X: outra venda em dia diferente -> 2 linhas no total
await call('POST', '/api/sale', { body: sale({ id: 'later333', v: 400, s: 'nrg120' }), headers: bearer });
r = await call('GET', '/api/export.csv', { headers: basic });
lines = (await r.text()).trim().split('\n').slice(2);
const rows = lines.map(l => l.split(','));
const ids = rows.map(x => x[5]).sort();
assert.deepEqual(ids, ['later333', 'olddd111', 'second22'].sort());
assert.ok(rows.every(x => x[6] === 'Granted' && x[4] === 'EUR' && x[1] === 'Compra (importada)'));
assert.ok(!lines.join('\n').includes('Gbraid_click'));
const second = rows.find(x => x[5] === 'second22');
assert.equal(second[0], 'Test_gclid-123456'); assert.equal(second[3], '350');
assert.equal(second[2], '2026-11-23 14:00:00');
r = await call('GET', '/api/export.csv?format=json', { headers: basic });
const st = await r.json();
assert.equal(st.rows, 3); assert.equal(st.other_click_type, 1); assert.equal(st.preview, 1); assert.equal(st.no_lead, 1); assert.equal(st.outside_window, 1); assert.equal(st.deduped_24h, 1);
// venda antes do clique
fresh();
await call('POST', '/api/lead', { body: lead({ ct: NOW - 1000 }) });
NOW -= 5 * 60000; // relógio anterior ao clique (cenário de venda "antes do clique")
await call('POST', '/api/sale', { body: sale(), headers: bearer });
NOW += 5 * 60000;
r = await call('GET', '/api/export.csv', { headers: basic });
assert.equal((await r.text()).trim().split('\n').length, 2);
ok('W6');

// W7
fresh();
await call('POST', '/api/lead', { body: { ...lead(), name: 'John', phone: '+31600000000', email: 'a@b.c' }, headers: { 'user-agent': 'UA-SECRET', 'cf-connecting-ip': '1.2.3.4' } });
await call('POST', '/api/lead', { body: lead() , headers: { 'user-agent': 'UA-SECRET', 'cf-connecting-ip': '1.2.3.4' } });
await call('POST', '/api/sale', { body: { ...sale(), name: 'John', phone: '+3160' }, headers: { ...bearer, 'user-agent': 'UA-SECRET', 'cf-connecting-ip': '1.2.3.4' } });
const dump = JSON.stringify([...env.ATTR.m.entries()]);
for (const bad of ['UA-SECRET', '1.2.3.4', 'John', '+31', 'a@b.c', 'phone', 'email']) assert.ok(!dump.includes(bad), bad);
for (const [k, v] of env.ATTR.m) { const o = JSON.parse(v.v); const keys = Object.keys(o).sort().join(','); assert.ok(['c,ct,k,lp', 'id,ref,s,t,v'].includes(keys), keys); }
assert.equal((await call('GET', '/api/lead')).status, 405);
assert.equal((await call('GET', '/api/sale')).status, 405);
assert.equal((await call('POST', '/api/export.csv')).status, 405);
assert.equal((await call('GET', '/api/nada')).status, 404);
assert.equal((await call('GET', '/')).status, 404);
ok('W7');

// W8
const src = fs.readFileSync(new URL('../workers/atribuicao/worker.js', import.meta.url), 'utf8');
assert.ok(!/^\s*import\s/m.test(src) && !/require\(/.test(src));
assert.ok(!/(SALE_KEY|EXPORT_PASS|EXPORT_USER)\s*[:=]\s*['"][^'"]{3,}/.test(src));
assert.ok(!/['"][A-Za-z0-9_-]{32,}['"]/.test(src));
ok('W8');

console.log('TODOS OS CENARIOS W OK (' + results.length + ')');
