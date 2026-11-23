# Worker de atribuição (Fase 2)

Guarda `código (ref) → clique do anúncio` por 90 dias e gera o CSV de conversões offline.
Plano e decisões: [`docs/implementations/atribuicao-anuncio-fase2.md`](../../docs/implementations/atribuicao-anuncio-fase2.md).
Sem dependências. **Nada daqui é publicado no site** (`workers/` não tem `index.html`).

## Deploy (Daniel)
1. `cd workers/atribuicao && cp wrangler.toml.example wrangler.toml`
2. `npx wrangler kv namespace create ATTR` → colar o `id` no `wrangler.toml`.
3. Segredos (cada comando pede o valor; use valores longos e aleatórios, nunca no repositório):
   - `npx wrangler secret put SALE_KEY` — 32–64 caracteres `[A-Za-z0-9_-]`
   - `npx wrangler secret put EXPORT_USER`
   - `npx wrangler secret put EXPORT_PASS`
4. Conferir `CONVERSION_NAME` em `[vars]` (igual ao nome da ação no Google Ads).
5. `npx wrangler deploy` — rota `amarigomes.com/api/*`.
6. Cloudflare › Security › WAF › Rate limiting: limitar `POST /api/lead` (ex.: 20 req/min por IP).
7. **Logs desligados** (Workers › Observability e Logpush): o corpo do lead não deve ser guardado.
8. No celular da Mari, abrir uma vez `https://amarigomes.com/mari/#k=<SALE_KEY>`.
9. **Não pôr no ar com dado real antes da política de privacidade** (pendência #14).

## Rotas
| Rota | Auth | Resposta |
|---|---|---|
| `POST /api/lead` `{ref,k,c,ct,lp,pv}` | aberta, corpo ≤ 1 KB | 204 / 400 |
| `POST /api/sale` `{ref,id,v,s}` | `Authorization: Bearer SALE_KEY` | `{matched:bool}` / 400 / 401 |
| `GET /api/export.csv` (`?format=json` = só contagens) | Basic `EXPORT_USER`/`EXPORT_PASS` | CSV / 401 |

## Teste local
`node scripts/test-atribuicao-worker.mjs`
