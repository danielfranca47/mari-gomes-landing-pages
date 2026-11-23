# Fase 2 — Atribuição da venda ao clique no anúncio (código de referência + conversão offline)

**Status:** Plano pronto (23/11/2026), aguardando implementação. Nenhuma LP real muda nesta fase: só as prévias `-v2`.

**Branch:** `claude/fase2-atribuicao-anuncio` · **Base:** `5711c4e` (main no início da fase)
**Planejador/revisor:** sessão Opus · **Implementador:** sessão Sonnet (mesma branch)
**Antecessor:** [`gerador-link-conversao.md`](gerador-link-conversao.md) (Fase 1: `/mari/` + `/thank-you/` com `s`/`t`/`v`/`id`). A seção "Fase 2" de lá era um rascunho; **este documento a substitui**.

---

## Motivação

O Google Ads hoje só aprende com o **lead** (clique no WhatsApp, `AW-18036442650/9rp5CIvso6QcEJqMuZhD`).
A venda acontece depois, no WhatsApp, e o `purchase` da página de obrigado só se
liga ao anúncio se o cliente abrir o link **no mesmo navegador** em que clicou no
anúncio e com cookies aceitos. Na prática quase nunca: o link chega pelo WhatsApp,
abre no navegador embutido do app, às vezes em outro aparelho, dias depois.

Objetivo: ligar cada venda registrada pela Mari em `/mari/` ao clique de origem
(gclid/gbraid/wbraid + página de entrada), para o Ads poder otimizar por **valor
real de venda**, sem a Mari digitar dado pessoal e sem pôr as LPs com anúncio em risco.

---

## Problemas identificados (estado atual, `5711c4e`)

1. **Nada guarda o clique.** As 6 LPs (`*-massage-*/index.html`, iguais aos
   `lp*-*.html` legados, conferido com `cmp`) só têm Consent Mode, `GT-55XJZX3L`,
   configs `G-EBY5JJD27V`/`AW-18036442650`, o listener de lead em
   `a[href*="wa.me"]`, o cookie banner (`cookie_consent_v1`) e o GTranslate. O
   gclid só existe no cookie `_gcl_aw` do Google, e só com `ad_storage` concedido.
2. **A conversa no WhatsApp não carrega nenhuma referência.** O texto `?text=` é
   fixo por botão (6 links na LP1/LP2, 9 na LP3; 1 deles, no rodapé, sem `?text=`).
3. **`/mari/` não sabe de qual lead é a venda** e não fala com nenhum servidor
   (decisão D4 da Fase 1: sem tags). O site é 100% estático (GitHub Pages).
4. **A ação "Compra" não existe no Ads** (`ADS_PURCHASE_LABEL = ''`).
5. **Não há política de privacidade** no site (o banner linka a página de cookies do Google).

### Já existe?
Parcialmente. Ficam como estão: `?test`, dedupe por `id`, flag `mg_internal_device`,
catálogo, `ADS_PURCHASE_LABEL`. Não existe captura de clique, referência, servidor
nem exportação. O domínio está na Cloudflare com proxy ligado
(`docs/hospedagem-github-pages-cloudflare.md`, registros A "Proxied"), então um
Worker na rota `amarigomes.com/api/*` é viável no mesmo domínio.

---

## Avaliação das alternativas

### Como levar a referência do lead até a Mari

| Opção | Funciona entre aparelhos? | Risco nas LPs | Veredito |
|---|---|---|---|
| **R1. Código curto no fim do texto do WhatsApp**, adicionado por JS só depois do consentimento (`… availability?` + quebra de linha + `(ref MG-K7P2X)`) | Sim: viaja dentro da conversa | O HTML estático **não muda** (o `href` só muda no DOM após o "Accept"). O crawler do Google não aceita cookies, então lê o mesmo texto de hoje | **Escolhida** |
| R2. Mudar o texto fixo do `href` no HTML | Sim | Muda o conteúdo da URL final e pode reabrir revisão de anúncio | Rejeitada |
| R3. Não mexer no texto e casar por horário (clique às 14:03 × primeira mensagem às 14:03) | Às vezes | Nenhum | Rejeitada: a Mari teria de informar o horário de cada conversa, e com 2 leads no mesmo minuto erra |
| R4. Colocar o gclid inteiro na mensagem | Sim | Texto de ~100 caracteres estranho para o cliente, e o identificador vai para o WhatsApp/Meta | Rejeitada |
| R5. GA4 `user_id` = ref (GA4 junta os dois aparelhos) | Só nos relatórios do GA4 | Igual a R1 | Fora do escopo. Não alimenta o lance de forma comprovada. Pode virar experimento depois |

O "(ref …)" usa caracteres neutros (letras e números). Não tem termo de
`vocabulario.md` e não muda o texto que o Google lê. O cliente pode apagar o
código; então a venda fica sem atribuição, como hoje.

### Como enviar a venda ao Google Ads

| Opção | Viável? | Esforço | Privacidade (GDPR/ePrivacy, público NL/UE) | Política do Ads | Sem acesso à conta |
|---|---|---|---|---|---|
| **(a) Conversão online na obrigado** (`ADS_PURCHASE_LABEL`) | Sim, já está no código | Nenhum código; o Daniel cria a ação e cola o rótulo | Usa só o cookie do Google com consentimento, sem dado novo | OK | Nada a fazer: depende do rótulo |
| **(b) Importação offline de cliques** (gclid + horário + valor + Order ID) | Sim, com um Worker na Cloudflare que guarda `ref → clique` por 90 dias | Médio: Worker + prévias + `/mari/` + testes, cerca de 3 dias | Dado pseudonimizado (gclid + código aleatório). Exige consentimento na captura, retenção de 90 dias e política de privacidade. Sem nome, telefone, IP nem user agent | Permitido. O upload declara `Ad User Data = Granted` (só guardamos com consentimento) | Todo o código e os testes locais (Worker roda em Node no teste). Deploy, segredos e ação de conversão: Daniel |
| (c) Conversões otimizadas para leads | **Não** | — | Exige e-mail/telefone do cliente com hash. Não há formulário, e a Mari não digita telefone (regra do pedido) | — | — |

API do Google Ads (upload automático por código) foi descartada: pede token de
desenvolvedor, OAuth e aprovação, e não compensa com o volume atual. O próprio Ads
aceita **upload agendado de um arquivo em URL HTTPS** com usuário e senha. O
Worker serve o CSV nessa URL e o Ads busca sozinho todo dia. Também dá para baixar
e subir à mão. **Conferir no Ads (Daniel)**: o modelo de colunas e se o upload
agendado por HTTPS está disponível para a conta (ver Fase D).

**Ordem recomendada:** (a) já, como conversão **secundária** (observação) →
prévias `-v2` testadas → política de privacidade → Worker no ar + promoção das
LPs → (b) como secundária por 4–6 semanas → avaliar com o Daniel tornar (b)
**principal** e mudar o lance para valor (só com ≥ 15 vendas importadas em 30 dias).
(a) e (b) **não podem ser as duas principais**: são ações diferentes, e o Ads não
deduplica uma contra a outra (contaria a mesma venda duas vezes).

---

## Decisões (planejador)

| # | Decisão | Por quê |
|---|---|---|
| F1 | **Sem consentimento, a LP se comporta byte a byte como hoje**: nenhum `localStorage` novo, nenhum código no texto, nenhum envio ao Worker, nenhum evento novo. Consentimento = `localStorage['cookie_consent_v1'] === 'granted'` (a mesma chave do banner, só lida) ou clique em `#cookie-accept` na própria visita. "Essential only" (`denied`) apaga `mg_attr_v1` | ePrivacy: gravar ou ler identificador para medir anúncio exige consentimento. O banner atual concede `ad_storage`, `ad_user_data` e `analytics_storage` juntos, então um só sinal basta |
| F2 | Bloco **novo e separado** `<script>` `// AD ATTRIBUTION`, inserido depois do bloco do cookie banner, antes de `</body>`. **Nenhum bloco existente muda** (a única diferença permitida nas `-v2`, além do bloco novo, é o `noindex` e a trava `-v2` no listener de lead) | Regressão de tag já custou 18 dias de conversões (`correcao-tag-conversao-google-ads.md`). O bloco novo escuta `#cookie-accept`/`#cookie-reject` com listener próprio, sem editar o banner |
| F3 | Captura: `gclid`, `gbraid`, `wbraid` (o primeiro presente, nessa ordem), validados por `^[A-Za-z0-9_-]{10,250}$`, + `lp` = `location.pathname` (sem query) + `ct` = horário do clique (ms). **Sem UTM** | O Ads usa auto-tagging, e o GA4 já guarda UTM por sessão. Minimização de dados: o Worker só precisa do clique |
| F4 | `localStorage['mg_attr_v1'] = {ref, k, c, ct, lp}` com validade de **90 dias** contados do `ct` (= janela de clique do Ads). Um gclid novo substitui o antigo (último clique) e mantém o `ref` | Quem volta dias depois sem gclid na URL ainda é atribuído |
| F5 | `ref` = `MG-` + 5 caracteres de `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` (sem 0/O/1/I), gerado com `crypto.getRandomValues`. Regex: `^MG-[2-9A-HJ-NP-Z]{5}$` | São 32⁵ ≈ 33 milhões de códigos. Com 300 leads em 90 dias, a chance de colisão é de cerca de 0,1% (com 4 caracteres seria cerca de 4%) |
| F6 | O código só entra em links `a[href^="https://wa.me/31634366008?text="]`: ao **fim** do `href` original é anexado `encodeURIComponent('\n\n(ref ' + ref + ')')` (o `text` é sempre o último parâmetro). O original fica em `data-wa-orig` (idempotente). O link do rodapé sem `?text=` não muda | Não reescreve o encoding existente, e o texto continua igual ao de hoje mais o código |
| F7 | No clique de um link `wa.me` com clique de anúncio guardado: `navigator.sendBeacon('/api/lead', JSON)` com `{ref,k,c,ct,lp,pv}` (`pv` = 1 nas `-v2`). Sem clique de anúncio, não envia nada. Fora da `-v2`, também envia `gtag('event','whatsapp_ref',{ref_code})` (GA4) | O Worker só guarda o que pode virar conversão do Ads. O evento GA4 dá o relatório por origem/campanha. O listener de lead existente não muda, e o evento novo é independente dele |
| F8 | O bloco nunca lança erro (`try/catch` em volta de tudo). Se falhar, os links ficam como estão. Sem `innerHTML`, sem `eval`, sem dependência externa | Garante que o disparo atual de lead nunca quebre |
| F9 | **A venda é registrada pelo aparelho da Mari**, no `/mari/`, ao gerar o link: `POST /api/sale` com `{ref,id,v,s}` e a chave de registro. A página de obrigado **não** chama o Worker | Não depende de o cliente abrir o link nem de consentimento no aparelho dele. O cliente não recebe nenhum identificador novo |
| F10 | Chave de registro (`SALE_KEY`, 32–64 caracteres `[A-Za-z0-9_-]`) fica só no segredo do Worker e no `localStorage['mg_api_key']` do celular da Mari, gravada uma vez pelo link `/mari/#k=<chave>` (o fragmento não vai para o servidor; `history.replaceState` o apaga da barra). "Este aparelho não é da Mari" apaga a chave | O PIN da Fase 1 é cosmético (hash público). O repositório é público, então nenhuma chave entra no código |
| F11 | Campo novo em `/mari/`: **"Código do cliente (opcional)"**. A Mari cola o código **ou a primeira mensagem inteira** do cliente; a página extrai `/MG-[2-9A-HJ-NP-Z]{5}/i` e troca o conteúdo do campo pelo código em maiúsculas. O resto do texto colado nunca é enviado nem guardado. Sem código, a venda é gerada como hoje | "Sem trabalho extra": segurar a mensagem → Copiar → colar. A Mari não digita nome nem telefone |
| F12 | O link de obrigado ganha `&r=MG-XXXXX` (quando houver código). A obrigado valida `r` e manda `ref_code` no `purchase` do GA4. Inválido = ignorado | Relatório GA4 lead × venda mesmo antes do Worker estar no ar |
| F13 | Worker (`workers/atribuicao/worker.js`, módulo ES, **sem dependências**) com Workers KV: `lead:<ref>` (TTL = 90 dias desde `ct`), `sale:<id>` (TTL 100 dias), prefixo `pv:` para as prévias. Sem IP, user agent ou log de corpo. Rotas: `POST /api/lead` (aberta, validada, corpo ≤ 1 KB), `POST /api/sale` (Bearer `SALE_KEY`, comparação em tempo constante), `GET /api/export.csv` (Basic `EXPORT_USER`/`EXPORT_PASS`). O resto: 404/405 | O TTL do KV faz a exclusão automática (retenção sem rotina). Mesmo domínio, então sem CORS e sem cookie de terceiro |
| F14 | Exportação: só vendas com lead de **gclid**, venda depois do clique e ≤ 90 dias dele, sem `pv:`. **Por `ref`, no máximo 1 venda a cada 24 h** (vale a última gerada; protege contra a Mari gerar 2 vezes). Linhas com gbraid/wbraid ficam fora do CSV e aparecem só na contagem de `?format=json` até o Daniel confirmar que o modelo do Ads aceita | Não manda ao Ads o que ele rejeitaria, e não conta duas vezes |
| F15 | Formato do CSV (configurável por `env`, **conferir com o modelo baixado do Ads**): 1ª linha `Parameters:TimeZone=+0000`; colunas `Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Order ID,Ad User Data`; horário em UTC `yyyy-MM-dd HH:mm:ss`; `Conversion Name` = `env.CONVERSION_NAME`; `Order ID` = `id` do link (o mesmo `transaction_id` do GA4); `Ad User Data` = `Granted` | O Order ID deduplica uploads repetidos |
| F16 | Prévias: `<slug>-v2/index.html` para as **6** LPs (cópia do `<slug>/index.html` atual + `noindex, nofollow` + trava `if (!/-v2\//.test(location.pathname))` no listener de lead + bloco F2). Os `lp*-*.html` e as LPs reais **não mudam**. **A promoção não faz parte desta implementação**: só o Daniel decide, depois de testar | Regra do CLAUDE.md para LP com anúncio ativo |

### Comportamento por cenário (LP `-v2` ou, depois, real)

| Situação | `mg_attr_v1` | Texto do WhatsApp | `/api/lead` | Conversão de lead |
|---|---|---|---|---|
| Sem escolha no banner | não grava | igual a hoje | não | como hoje (na `-v2`: travada) |
| "Essential only" | apaga se existir | igual a hoje | não | como hoje |
| "Accept" com gclid na URL | grava | + `(ref MG-…)` | sim, no clique | como hoje |
| Consentimento salvo, sem gclid, sem registro | grava só `{ref}` | + `(ref MG-…)` | não | como hoje |
| Consentimento salvo, gclid de visita anterior (< 90 dias) | mantém | + o mesmo `ref` | sim, com o gclid guardado | como hoje |
| gclid adulterado (`<script>`, > 250 caracteres) | ignora o parâmetro | + `(ref …)` | só se já havia clique válido | como hoje |

---

## Abordagem

```
LP -v2 (consentimento "granted")                 Cloudflare Worker  amarigomes.com/api/*
  URL ?gclid=…  ──► mg_attr_v1 {ref,k,c,ct,lp}         │
  links wa.me  ──► texto + "\n\n(ref MG-K7P2X)"         │
  clique wa.me ──► sendBeacon /api/lead ───────────────►│ KV lead:MG-K7P2X (TTL 90 d)
               └─► (listener de lead existente, intacto)│
                                                        │
WhatsApp: "…availability?\n\n(ref MG-K7P2X)"            │
                                                        │
/mari/ (celular da Mari, chave mg_api_key)              │
  cola a mensagem → extrai MG-K7P2X                     │
  Gerar link → /thank-you/?s=…&t=…&v=…&id=…&r=MG-K7P2X  │
            └─► POST /api/sale {ref,id,v,s} ───────────►│ KV sale:<id> (TTL 100 d)
                ◄── {matched:true} "Venda ligada ao anúncio ✓"
                                                        │
/thank-you/ → GA4 purchase {…, ref_code}                │
                                                        │
Google Ads (upload agendado, HTTPS + Basic) ◄── GET /api/export.csv
  ação "Compra (importada)"     gclid, horário da venda, valor, Order ID
```

---

## Plano de implementação

> **Arquivos permitidos no diff contra `5711c4e`** (o teste confere):
> `workers/atribuicao/**`, `scripts/test-atribuicao*.{js,mjs}`, `scripts/test-gerador-link.js`
> (só a lista de arquivos permitidos do C7), as 6 pastas `*-massage-*-v2/`,
> `mari/index.html`, `thank-you/index.html`, `nl/thank-you/index.html`, este doc,
> `docs/implementations/gerador-link-conversao.md`, `docs/implementations/pagina-obrigado-avaliacao.md`,
> `docs/pendencias-mary.md`, `trafego/conversoes-offline.md`.
> **Proibido:** `*-massage-*/index.html` reais, `lp*-*.html`, home, páginas institucionais,
> `.github/workflows/pages.yml` (não precisa mudar: `workers/` não tem `index.html`
> e não é publicado; as `-v2` têm `index.html` e são publicadas com `noindex`).

### Fase A — Worker de atribuição (código + teste em Node, sem deploy)

**Objetivo:** API `lead`/`sale`/`export` pronta e testada localmente.

| Arquivo | O que muda |
|---|---|
| `workers/atribuicao/worker.js` | `export default { fetch(request, env) }` conforme F13–F15. `env`: `ATTR` (KV), `SALE_KEY`, `EXPORT_USER`, `EXPORT_PASS`, `CONVERSION_NAME`. Validações: `ref` F5; `k` ∈ {gclid,gbraid,wbraid}; `c` F3; `ct` entre agora−90 dias e agora+5 min; `lp` ∈ os 6 slugs, com ou sem `-v2` (`/^\/(holistic-energy|relaxation|couples)-massage-(en\|nl)(-v2)?\/$/`); `pv` ∈ {0,1}; `id` `^[a-z0-9]{6,12}$`; `v` 50–1500; `s` = um dos códigos do catálogo ou `other`. Lead novo só substitui o guardado se o `ct` for maior. `sale` responde `{matched}` (existe `lead:<ref>` com clique) |
| `workers/atribuicao/wrangler.toml.example` | nome, rota `amarigomes.com/api/*`, binding KV `ATTR` com id de exemplo, `CONVERSION_NAME` em `[vars]`. **Sem segredos** |
| `workers/atribuicao/README.md` | Passo a passo do deploy para o Daniel (criar KV, `wrangler secret put` × 3, rota, observabilidade/logs **desligados**, regra de rate limiting na Cloudflare para `/api/lead`) |
| `scripts/test-atribuicao-worker.mjs` | Importa o worker com KV falso em memória (com TTL simulado e relógio injetável). Cenário W |

### Fase B — Prévias `-v2` das 6 LPs com o bloco `// AD ATTRIBUTION`

**Objetivo:** captura com consentimento + código no WhatsApp + envio ao Worker, testáveis em `amarigomes.com/<slug>-v2/`.

| Arquivo | O que muda |
|---|---|
| `holistic-energy-massage-en-v2/index.html` (+ `-nl-v2`, `relaxation-massage-{en,nl}-v2`, `couples-massage-{en,nl}-v2`) | Cópia do `<slug>/index.html` de `5711c4e` + `<meta name="robots" content="noindex, nofollow">` + trava `-v2` no listener de lead + bloco F2 (**idêntico nos 6**, com comentário apontando para este doc) |
| `scripts/test-atribuicao.js` | Playwright + servidor local que serve o repo estático e repassa `/api/*` ao `worker.js` com KV em memória (mesma origem). Cenário L |

### Fase C — `/mari/` com código do cliente + registro da venda; obrigado com `ref_code`

**Objetivo:** a Mari cola a mensagem, o link sai com `r`, a venda vai para o Worker, e o GA4 recebe `ref_code`.

| Arquivo | O que muda |
|---|---|
| `mari/index.html` | Campo F11 (16 px, alvo ≥ 44 px), `&r=` no link, `POST /api/sale` (`fetch` com `keepalive`) só se houver código **e** `mg_api_key`, status em `role="status"`: "Venda ligada ao anúncio ✓" / "Código sem clique de anúncio registrado (a venda conta só no GA4)" / "Não deu para registrar no servidor (o link funciona normalmente)". Setup `#k=` (F10). "Este aparelho não é da Mari" também apaga `mg_api_key`. Continua sem gtag/GTM/GTranslate. Prévia (`&test`) não chama o Worker |
| `thank-you/index.html`, `nl/thank-you/index.html` | **Só o bloco `// CONVERSION`** (idêntico EN/NL): `r` validado → `ref_code` no `purchase`. Catálogo sem mudança |
| `scripts/test-atribuicao.js` | + Cenário M. `scripts/test-gerador-link.js`: só incluir os novos arquivos na lista permitida do C7 (e `BASE_REF` passa a aceitar `5711c4e`). Tem que continuar `TODOS OS CENARIOS OK` |

### Fase D — Teste ponta a ponta + guia do Daniel + docs

**Objetivo:** fluxo inteiro LP → WhatsApp → `/mari/` → CSV comprovado, e o passo a passo para quem tem acesso às contas.

| Arquivo | O que muda |
|---|---|
| `scripts/test-atribuicao.js` | + Cenário E (ponta a ponta) e R (não regressão) |
| `trafego/conversoes-offline.md` | Guia do Daniel: criar ações "Compra" (site) e "Compra (importada)" (Importar › cliques, valor variável, contagem "Todas", janela 90 dias, **secundária**); baixar o modelo de upload e conferir as colunas da F15; upload agendado por HTTPS (URL do `export.csv` + Basic) ou manual semanal; esperar ~6 h depois de criar a ação antes do 1º upload; dimensão personalizada `ref_code` no GA4; checklist de promoção das `-v2` |
| `docs/implementations/pagina-obrigado-avaliacao.md`, `gerador-link-conversao.md` | Link para este doc; marcar o rascunho antigo da Fase 2 como substituído |
| este doc | Hashes, evidências (saída dos testes), checks marcados |

### Commits

| Fase | Commit | O que foi implementado |
|---|---|---|
| Plano | (este commit) | plano da Fase 2 + pendência #14 |
| A | — | Worker + teste W |
| B | — | 6 prévias `-v2` + teste L |
| C | — | `/mari/` + obrigado + teste M |
| D | — | E2E + guia + docs |

---

## Checks de validação

Toda marcação `[x]` precisa da linha `OK <cenário>` correspondente na saída de
`node scripts/test-atribuicao-worker.mjs` e `node scripts/test-atribuicao.js` (colar a saída neste doc).
Playwright: bloquear `googletagmanager`/`gtranslate`/fontes, ler `window.dataLayer`,
interceptar `sendBeacon`/`fetch` (ou o servidor local), `page.on('pageerror')` sem erros.

### Cenário W — Worker (Node)
- [x] W1 lead válido → 204 e `lead:<ref>` gravado com TTL = 90 dias desde `ct`; `pv=1` → `pv:lead:<ref>`
- [x] W2 inválidos → 400 e nada gravado: ref fora do padrão (`MG-0OOO1`, minúsculas, `<script>`), `c` com `<`/espaço/> 250 caracteres, `k` desconhecido, `ct` no futuro/> 90 dias, `lp` fora da lista, corpo > 1 KB, JSON inválido
- [x] W3 lead com `ct` mais antigo não sobrescreve o mais novo
- [x] W4 `/api/sale` sem chave/chave errada → 401; válida → 200 `{matched:true}` com lead de clique e `{matched:false}` sem; `v`=20/5000, `id` inválido, `s` desconhecido → 400
- [x] W5 `export.csv` sem/errado Basic → 401; com → `text/csv`, 1ª linha `Parameters:TimeZone=+0000`, cabeçalho F15
- [x] W6 exportação: só gclid; exclui `pv:`; exclui venda antes do clique e > 90 dias; 2 vendas da mesma ref em < 24 h → 1 linha (a última); ref com 2 vendas em dias diferentes → 2 linhas; gbraid só na contagem do JSON
- [x] W7 nenhum valor gravado contém IP, user agent, nome, telefone ou e-mail (inspecionar o KV falso); métodos/rotas erradas → 404/405
- [x] W8 `worker.js` não tem `import` de pacote externo nem segredo literal

**Evidência W (23/11/2026, implementador):** `node scripts/test-atribuicao-worker.mjs` →
```
OK W1  OK W2  OK W3  OK W4  OK W5  OK W6  OK W7  OK W8
TODOS OS CENARIOS W OK (8)
```
Obs.: com o KV real o lead expira junto com a janela de 90 dias, então "venda > 90 dias do clique" só ocorre com relógio torto; o teste W6 injeta essa venda direto no KV falso para provar a checagem.

### Cenário L — LPs `-v2` (Playwright, 390×844 e desktop, as 6)
- [ ] L1 sem escolha no banner: `href`s idênticos ao HTML, sem `mg_attr_v1`, sem beacon, sem `whatsapp_ref`
- [ ] L2 "Essential only" (com `mg_attr_v1` pré-existente) → chave apagada, `href`s originais, sem beacon
- [ ] L3 `?gclid=Test_gclid-123456` + "Accept" → `mg_attr_v1` correto; todos os links com `?text=` terminam com `%0A%0A(ref%20MG-XXXXX)`; `decodeURIComponent(text)` = texto original + `\n\n(ref MG-XXXXX)`; o link do rodapé sem `text` não muda
- [ ] L4 clique em cada tipo de botão (nav, hero, pricing, cta-final; LP3: os 3 cards) → 1 beacon `{ref,k:'gclid',c,ct,lp,pv:1}`, com `lp` = caminho da `-v2`
- [ ] L5 na `-v2`: **nenhuma** `conversion` de lead e nenhum `whatsapp_ref` no `dataLayer`
- [ ] L6 consentimento salvo, sem gclid e sem registro → `ref` no texto, sem beacon; visita seguinte sem gclid com registro < 90 dias → beacon com o gclid guardado e o **mesmo** ref; registro de 91 dias → descartado
- [ ] L7 gclid adulterado (`<script>alert(1)</script>`, 300 caracteres, `a b`) → ignorado, nada no DOM; `gbraid` válido → `k:'gbraid'`
- [ ] L8 recarregar 3 vezes não duplica o sufixo `(ref …)` (idempotente)
- [ ] L9 EN e NL das 3 LPs; o bloco `// AD ATTRIBUTION` é idêntico nos 6 arquivos
- [ ] L10 390 px sem scroll horizontal; nenhum erro de JS; banner continua funcionando (Accept/Essential gravam `cookie_consent_v1` como antes)

### Cenário M — `/mari/` e obrigado
- [ ] M1 colar `Hi Mari! I'm John… availability?\n\n(ref MG-K7P2X)` → campo mostra só `MG-K7P2X`; sem código → aviso neutro, gerar continua permitido
- [ ] M2 link gerado com `&r=MG-K7P2X`; sem código → link igual ao da Fase 1 (sem `r`)
- [ ] M3 com `mg_api_key` + código → 1 `POST /api/sale` com corpo exatamente `{ref,id,v,s}` (sem texto colado) e status "ligada ✓"/"sem clique"; sem chave ou sem código → nenhum POST; Worker fora do ar → status de erro, link funciona
- [ ] M4 `/mari/#k=<chave>` → grava `mg_api_key`, URL sem `#`; chave fora do formato → ignorada; "Este aparelho não é da Mari" apaga `mg_api_key`
- [ ] M5 "Ver prévia" (`&test`) não chama o Worker nem dispara `purchase`
- [ ] M6 obrigado EN/NL com `r` válido → `purchase` com `ref_code`; `r` inválido/adulterado → sem `ref_code`, nada no DOM; bloco CONVERSION idêntico EN/NL; fora dele, arquivo idêntico a `5711c4e`
- [ ] M7 `node scripts/test-gerador-link.js` → `TODOS OS CENARIOS OK`; `/mari/` 390 px sem scroll horizontal e com alvos ≥ 44 px

### Cenário E — Ponta a ponta (LP servida no caminho real, simulando a promoção)
- [ ] E1 servir o arquivo `-v2` em `/holistic-energy-massage-en/` (sem `-v2` → trava livre): Accept + gclid → clique → **1 `conversion` de lead `AW-18036442650/9rp5CIvso6QcEJqMuZhD` por clique** + `whatsapp_ref` + beacon `pv:0`
- [ ] E2 `/mari/` com o código extraído → `matched:true`; `export.csv` tem 1 linha com o gclid, o valor e o Order ID = `id` do link
- [ ] E3 gerar 2 vezes para o mesmo código → o CSV continua com 1 linha (a última)
- [ ] E4 abrir o link de obrigado num contexto novo (outro "aparelho") → `purchase` com `transaction_id` = Order ID e `ref_code`

### Cenário R — Não regressão / segurança
- [ ] R1 `git diff 5711c4e` só toca os arquivos permitidos; LPs reais e `lp*-*.html` byte a byte iguais
- [ ] R2 cada `-v2` × `<slug>/index.html`: diferença = só `noindex` + trava + bloco novo (teste faz o diff normalizado); blocos Consent Mode, `GT-55XJZX3L`, configs `G-`/`AW-`, cookie banner e GTranslate idênticos
- [ ] R3 o passo "Montar _site" de `pages.yml` (executado em pasta temporária) publica as 6 `-v2` e **não** publica `workers/` nem `scripts/`
- [ ] R4 nenhum segredo/chave/PIN no repositório (grep pelos valores de teste fora de `scripts/`)
- [ ] R5 vocabulário: o texto acrescentado ao WhatsApp só tem `(ref MG-XXXXX)`; nenhum termo de `vocabulario.md` entra

---

## Riscos

| Risco | Mitigação |
|---|---|
| Regressão de tag na promoção | O teste R2 compara blocos; o checklist de promoção em `trafego/conversoes-offline.md` exige rodar R2 contra a versão no ar. **Promoção é decisão do Daniel**, uma LP por vez, começando pela de mais tráfego |
| Revisão de anúncio ao mudar a LP | O HTML estático só ganha um `<script>` novo; o texto lido pelo crawler não muda. Mesmo assim, acompanhar o status dos anúncios por 3 dias após cada promoção e registrar em `trafego/alteracoes.md` |
| GDPR/ePrivacy | Captura só com consentimento (F1), minimização (F3), retenção de 90/100 dias via TTL (F13), sem IP/user agent/PII. **Bloqueio:** não promover as LPs (dado real) nem pôr o Worker no ar antes de existir política de privacidade que cite a medição de anúncios e o armazenamento do clique por 90 dias (pendência #14). O texto do banner ("…measure how our ads perform") já cobre a finalidade; o link do banner para a política fica para a promoção (decisão do Daniel) |
| `ref_code` no GA4 sem consentimento no aparelho do cliente | Vai no ping sem cookie do Consent Mode, como o `transaction_id` da Fase 1. É um código aleatório e não identifica a pessoa |
| Abuso do `/api/lead` aberto (encher o KV) | Validação estrita, corpo ≤ 1 KB, regra de rate limiting da Cloudflare (Daniel). Lead falso não vira conversão sem uma venda registrada com a chave |
| `SALE_KEY` vazada (celular perdido) | Trocar o segredo no Worker e gerar novo `#k=`; vendas falsas só viram conversão se casarem com um lead real |
| Cliente apaga o "(ref …)" / Mari não cola | Campo opcional; a venda segue no GA4 sem atribuição (igual a hoje). Medir a taxa de vendas com `matched:true` |
| Modelo do CSV ou upload por HTTPS diferente do previsto | F15 configurável; o Daniel confere o modelo do Ads antes do 1º upload. gbraid/wbraid fora do CSV até confirmar |
| Dupla contagem (a) + (b) | Só uma delas como principal (ver "Ordem recomendada") |
| Volume baixo para lance por valor | Importada como secundária até ≥ 15 vendas/30 dias |

---

## Depende do Daniel (fora do alcance do implementador)

1. Criar a ação "Compra" (site), colar o rótulo em `ADS_PURCHASE_LABEL` (commit à parte) e marcá-la como **secundária**.
2. Testar as 6 prévias `-v2` (celular, Accept/Essential, `?gclid=teste`) e decidir a promoção, uma por vez.
3. Cloudflare: criar KV, fazer deploy do Worker, rota `amarigomes.com/api/*`, segredos `SALE_KEY`/`EXPORT_USER`/`EXPORT_PASS`, rate limit em `/api/lead`, logs desligados.
4. Abrir `/mari/#k=<SALE_KEY>` uma vez no celular da Mari.
5. Ads: criar "Compra (importada)" (Importar › cliques), conferir o modelo de colunas, configurar o upload agendado por HTTPS (ou manual semanal), como **secundária**; mais tarde, decidir se vira principal e se o lance passa a ser por valor.
6. GA4: dimensão personalizada de evento `ref_code`.
7. Política de privacidade (com os dados da pendência #14) antes do passo 3 com dado real.
8. Registrar cada mudança de conta/LP em `trafego/alteracoes.md`.

## Depende da Mari

Pendência **#14** em [`docs/pendencias-mary.md`](../pendencias-mary.md): aceitar o
código no fim da 1ª mensagem; colar a mensagem no `/mari/` ao gerar o link; dados
para a política de privacidade.

---

## Prompt de retomada (implementador)

```
Leia CLAUDE.md e docs/implementations/atribuicao-anuncio-fase2.md. Implemente as fases
A, B, C e D na branch claude/fase2-atribuicao-anuncio, 1 commit por fase, hash
registrado neste doc logo após cada commit. Não toque nas LPs reais, nos lp*-*.html,
na home nem nas páginas institucionais; LP só em <slug>-v2/. Não promova nada.
Siga as decisões F1–F16 sem improvisar; se alguma não fechar, pergunte à sessão
planejadora antes. Marque os checks só com evidência (saída dos testes colada aqui).
Nenhuma chave, PIN ou segredo no repositório. Ao terminar, push e avise a sessão
planejadora por send_message com o hash final.
```
