// Worker de atribuição de anúncio — Fase 2. Ver docs/implementations/atribuicao-anuncio-fase2.md (F13–F15).
// Sem dependências. Sem IP, user agent, nome, telefone ou e-mail: só o clique (gclid/gbraid/wbraid) + código aleatório.
//
// env: ATTR (KV), SALE_KEY, EXPORT_USER, EXPORT_PASS (segredos), CONVERSION_NAME (var).
// Rotas: POST /api/lead (aberta) · POST /api/sale (Bearer SALE_KEY) · GET /api/export.csv (Basic).

const DAY = 86400000;
const LEAD_TTL_MS = 90 * DAY;
const SALE_TTL_S = 100 * 86400;
const MAX_BODY = 1024;
const REF_RE = /^MG-[2-9A-HJ-NP-Z]{5}$/;
const CLICK_RE = /^[A-Za-z0-9_-]{10,250}$/;
const LP_RE = /^\/(holistic-energy|relaxation|couples)-massage-(en|nl)(-v2)?\/$/;
const ID_RE = /^[a-z0-9]{6,12}$/;
const KINDS = ['gclid', 'gbraid', 'wbraid'];
const SERVICES = ['rlx60', 'rlx90', 'rlx120', 'nrg60', 'nrg90', 'nrg120', 'cpl90', 'cpl120', 'cpl150', 'cpl180', 'other'];

const HEADERS = { 'Cache-Control': 'no-store' };
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...HEADERS, 'Content-Type': 'application/json' } });
const plain = (status, text = '') => new Response(text || null, { status, headers: HEADERS });

async function digest(s) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s))));
}
// comparação em tempo constante: compara os hashes SHA-256 (tamanho fixo)
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

async function readJson(request) {
  const len = parseInt(request.headers.get('content-length') || '0', 10);
  if (len > MAX_BODY) return null;
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY) return null;
  try {
    const o = JSON.parse(text);
    return o && typeof o === 'object' && !Array.isArray(o) ? o : null;
  } catch (e) { return null; }
}

function validLead(o, now) {
  if (typeof o.ref !== 'string' || !REF_RE.test(o.ref)) return null;
  if (KINDS.indexOf(o.k) === -1) return null;
  if (typeof o.c !== 'string' || !CLICK_RE.test(o.c)) return null;
  if (!Number.isInteger(o.ct) || o.ct < now - LEAD_TTL_MS || o.ct > now + 5 * 60000) return null;
  if (typeof o.lp !== 'string' || !LP_RE.test(o.lp)) return null;
  if (o.pv !== 0 && o.pv !== 1) return null;
  return { ref: o.ref, k: o.k, c: o.c, ct: o.ct, lp: o.lp, pv: o.pv };
}

function validSale(o) {
  if (typeof o.ref !== 'string' || !REF_RE.test(o.ref)) return null;
  if (typeof o.id !== 'string' || !ID_RE.test(o.id)) return null;
  if (typeof o.v !== 'number' || !isFinite(o.v) || o.v < 50 || o.v > 1500) return null;
  if (typeof o.s !== 'string' || SERVICES.indexOf(o.s) === -1) return null;
  return { ref: o.ref, id: o.id, v: Math.round(o.v * 100) / 100, s: o.s };
}

async function getLead(env, ref) {
  const real = await env.ATTR.get('lead:' + ref, 'json');
  if (real) return { lead: real, pv: false };
  const prev = await env.ATTR.get('pv:lead:' + ref, 'json');
  if (prev) return { lead: prev, pv: true };
  return null;
}

async function handleLead(request, env, now) {
  const o = await readJson(request);
  const l = o && validLead(o, now);
  if (!l) return plain(400);
  const key = (l.pv ? 'pv:lead:' : 'lead:') + l.ref;
  const old = await env.ATTR.get(key, 'json');
  if (old && old.ct >= l.ct) return plain(204); // só o clique mais novo substitui
  const ttl = Math.max(60, Math.ceil((l.ct + LEAD_TTL_MS - now) / 1000));
  await env.ATTR.put(key, JSON.stringify({ k: l.k, c: l.c, ct: l.ct, lp: l.lp }), { expirationTtl: ttl });
  return plain(204);
}

async function handleSale(request, env, now) {
  const auth = request.headers.get('authorization') || '';
  const m = /^Bearer (.+)$/.exec(auth);
  if (!env.SALE_KEY || !m || !(await safeEqual(m[1], env.SALE_KEY))) return plain(401);
  const o = await readJson(request);
  const s = o && validSale(o);
  if (!s) return plain(400);
  const found = await getLead(env, s.ref);
  await env.ATTR.put('sale:' + s.id, JSON.stringify({ ref: s.ref, id: s.id, v: s.v, s: s.s, t: now }), { expirationTtl: SALE_TTL_S });
  return json({ matched: !!found });
}

const pad = (n) => String(n).padStart(2, '0');
function fmtUtc(ms) {
  const d = new Date(ms);
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + ' ' +
    pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
}
const csvCell = (v) => {
  const s = String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

async function listAll(env, prefix) {
  const names = [];
  let cursor;
  do {
    const r = await env.ATTR.list({ prefix, cursor });
    r.keys.forEach((k) => names.push(k.name));
    cursor = r.list_complete ? undefined : r.cursor;
  } while (cursor);
  return names;
}

async function buildExport(env) {
  const stats = { sales: 0, rows: 0, no_lead: 0, preview: 0, other_click_type: 0, outside_window: 0, deduped_24h: 0 };
  const sales = [];
  for (const name of await listAll(env, 'sale:')) {
    const s = await env.ATTR.get(name, 'json');
    if (s) sales.push(s);
  }
  stats.sales = sales.length;
  sales.sort((a, b) => a.t - b.t);
  const kept = new Map(); // ref -> última venda mantida (janela de 24 h)
  const rows = [];
  for (const s of sales) {
    const real = await env.ATTR.get('lead:' + s.ref, 'json');
    if (!real) {
      if (await env.ATTR.get('pv:lead:' + s.ref, 'json')) stats.preview++; else stats.no_lead++;
      continue;
    }
    if (real.k !== 'gclid') { stats.other_click_type++; continue; }
    if (s.t < real.ct || s.t - real.ct > LEAD_TTL_MS) { stats.outside_window++; continue; }
    const prev = kept.get(s.ref);
    if (prev && s.t - prev.sale.t < DAY) {
      rows.splice(rows.indexOf(prev), 1);
      stats.deduped_24h++;
    }
    const row = { sale: s, lead: real };
    kept.set(s.ref, row);
    rows.push(row);
  }
  stats.rows = rows.length;
  return { rows, stats };
}

async function handleExport(request, env) {
  const auth = request.headers.get('authorization') || '';
  const m = /^Basic (.+)$/.exec(auth);
  let ok = false;
  if (m && env.EXPORT_USER && env.EXPORT_PASS) {
    let dec = '';
    try { dec = atob(m[1]); } catch (e) { dec = ''; }
    const i = dec.indexOf(':');
    if (i > -1) {
      const a = await safeEqual(dec.slice(0, i), env.EXPORT_USER);
      const b = await safeEqual(dec.slice(i + 1), env.EXPORT_PASS);
      ok = a && b;
    }
  }
  if (!ok) return new Response(null, { status: 401, headers: { ...HEADERS, 'WWW-Authenticate': 'Basic realm="export", charset="UTF-8"' } });
  const { rows, stats } = await buildExport(env);
  if (new URL(request.url).searchParams.get('format') === 'json') return json(stats);
  const name = env.CONVERSION_NAME || 'Compra (importada)';
  const lines = ['Parameters:TimeZone=+0000',
    'Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Order ID,Ad User Data'];
  for (const { sale, lead } of rows) {
    lines.push([lead.c, name, fmtUtc(sale.t), sale.v, 'EUR', sale.id, 'Granted'].map(csvCell).join(','));
  }
  return new Response(lines.join('\n') + '\n', { status: 200, headers: { ...HEADERS, 'Content-Type': 'text/csv; charset=utf-8' } });
}

export function createWorker(clock) {
  return {
    async fetch(request, env) {
      const path = new URL(request.url).pathname;
      const now = clock();
      try {
        if (path === '/api/lead') return request.method === 'POST' ? await handleLead(request, env, now) : plain(405);
        if (path === '/api/sale') return request.method === 'POST' ? await handleSale(request, env, now) : plain(405);
        if (path === '/api/export.csv') return request.method === 'GET' ? await handleExport(request, env) : plain(405);
      } catch (e) {
        return plain(500); // nunca registra corpo nem cabeçalhos
      }
      return plain(404);
    }
  };
}

export default createWorker(() => Date.now());
