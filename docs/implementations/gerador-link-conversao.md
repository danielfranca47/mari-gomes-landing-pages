# Gerador de link de conversão (página privada da Mari) + obrigado com parâmetros

**Status:** Planejado (23/11/2026). Fase 1 = fases A–C abaixo (a implementar); Fase 2 (atribuição ao anúncio) **só planejada, não implementar**.

**Branch:** `claude/plano-link-conversao` · **Planejador/revisor:** sessão Opus · **Implementador:** sessão Sonnet (mesma branch)

---

## Motivação

Hoje (PR #4) a Mari manda `/thank-you/` para quem comprou e a página registra um
`purchase` no GA4 com €250 fixo (ou `?v=` montado à mão). Isso tem três problemas:
o valor quase sempre está errado, não se sabe qual atendimento foi vendido, e
montar `?v=` no celular é chato e fácil de errar.

O Daniel pediu uma página privada (`/mari/`), usada no celular da Mari, onde ela
escolhe o atendimento (preço já preenchido, editável), gera o link de obrigado
com valor + código do atendimento + id da transação e manda por WhatsApp com
mensagem pronta. A página de obrigado passa a ler esses parâmetros.

---

## Problemas identificados (estado atual)

1. **Valor fixo.** `thank-you/index.html` e `nl/thank-you/index.html`, bloco
   `// CONVERSION`: `value` = `?v=` ou 250. Não há código de atendimento:
   `item_id: 'session'`, `item_name: 'Mari Gomes session'` para tudo.
2. **Validação fraca.** `parseFloat(params.get('v'))` aceita `?v=999999` ou
   `?v=1e9`: um link adulterado polui a receita no GA4.
3. **`transaction_id` aleatório gerado no navegador.** Se o cliente abre o link no
   celular e depois no computador, contam 2 compras (o dedupe de 12 h é por
   navegador).
4. **A própria Mari dispara compra** quando abre o link que acabou de gerar para
   conferir (só não dispara se ela lembrar do `?test`).
5. **Não existe gerador:** hoje é tudo manual.

### Já existe?
Parcialmente: a página de obrigado, o `?test`, o dedupe de 12 h e o
`ADS_PURCHASE_LABEL` (vazio) existem e ficam. Não existe nada de `/mari/`.
Não existe `sitemap.xml` nem `robots.txt` no repo: não criar.

---

## Decisões (planejador)

| # | Decisão | Por quê |
|---|---|---|
| D1 | URL **`/mari/`** (`mari/index.html`), sem par NL | Usuária única. O workflow `pages.yml` publica sozinho toda pasta de 1º nível com `index.html`, sem mudança no workflow |
| D2 | Interface **só em PT-BR** | A Mari é brasileira e todas as pendências já vão para ela em português. Só as **mensagens ao cliente** são EN/NL (ela escolhe) |
| D3 | **Sem GTranslate** | O widget traduziria a página inteira, inclusive as mensagens EN/NL prontas, e o texto enviado sairia errado. Página interna não precisa de seletor |
| D4 | **Sem gtag/GA4/Ads, sem cookie banner** na `/mari/` | Uso interno: medir geraria tráfego falso e de quem não é cliente. O `localStorage` usado (PIN, flag do aparelho) é estritamente necessário, então não pede consentimento |
| D5 | `noindex, nofollow` + `<meta name="referrer" content="no-referrer">`; nenhum link no menu, no rodapé, na home nem nas LPs; **não** entrar em `robots.txt`/sitemap | Um `Disallow` em `robots.txt` divulgaria o caminho. `noindex` basta |
| D6 | Parâmetros do link: **`s`** (código do atendimento), **`v`** (valor), **`id`** (8 caracteres `[a-z0-9]`). Nada mais | Curto, legível, **sem PII** (sem nome, telefone ou e-mail do cliente: GA4 proíbe e o repo é público) |
| D7 | WhatsApp por **`https://wa.me/?text=…` sem número**: o WhatsApp abre a lista de contatos e a Mari escolhe o cliente | A página nunca vê nem guarda o telefone do cliente |
| D8 | `transaction_id` = **`id` do link** | O GA4 deduplica `purchase` com o mesmo `transaction_id`: abrir em 2 aparelhos não conta 2 vezes. O Ads também deduplica por `transaction_id` |
| D9 | **Flag de aparelho interno**: ao desbloquear o PIN, `/mari/` grava `localStorage['mg_internal_device']='1'`. `/thank-you/` não dispara `purchase` se a flag existir | Mesma origem (`amarigomes.com`), então o `localStorage` é compartilhado. Protege a Mari de contar compra ao conferir o link. Limitação: só vale no navegador onde ela desbloqueou (ver Riscos) |
| D10 | **Catálogo de atendimentos copiado igual** nos 3 arquivos (`mari/`, `thank-you/`, `nl/thank-you/`), com o comentário `SERVICE CATALOG — manter idêntico nos 3 arquivos` | Convenção do repo: páginas autocontidas, sem JS compartilhado. O teste da Fase C compara os 3 |
| D11 | Nomes de item no GA4 **em inglês e fixos no catálogo**, nunca lidos da URL | Relatório consistente; o link adulterado não injeta texto no GA4 |
| D12 | PIN: **SHA-256 de `'mari-gomes:' + PIN`** comparado via `crypto.subtle`; desbloqueio lembrado em `localStorage['mg_pin_ok'] = <hash>` (vale enquanto for igual ao hash atual: trocar o PIN derruba todos os aparelhos) | Pedido do Daniel. **Não é segurança**: o hash está no HTML público, e um PIN numérico de 4–8 dígitos se quebra por força bruta em segundos. É só uma cortina contra visita casual. Também não protege nada que já não seja possível: qualquer pessoa pode montar `/thank-you/?v=…` lendo o código da página de obrigado |
| D13 | O PIN em si **nunca entra no repo** (nem em doc, nem em commit, nem em comentário). O implementador escolhe um PIN provisório de 6 dígitos, grava só o hash e informa o PIN ao Daniel **na conversa** | Repo público |

### Catálogo (do mais barato ao mais caro: grupos em ordem de preço inicial, durações crescentes dentro de cada grupo)

Valores conferidos em `CLAUDE.md` › "Preços nas LPs" (23/11/2026).

| Código `s` | `item_name` (GA4) | `item_category` | Preço padrão (€) | Rótulo na `/mari/` |
|---|---|---|---|---|
| `rlx60` | Holistic Relaxation 60 min | relaxation | 250 | Relaxation · 60 min |
| `rlx90` | Holistic Relaxation 90 min | relaxation | 300 | Relaxation · 90 min |
| `rlx120` | Holistic Relaxation 120 min | relaxation | 350 | Relaxation · 120 min |
| `nrg60` | Energy Experience 60 min | energy | 300 | Energy · 60 min |
| `nrg90` | Energy Experience 90 min | energy | 350 | Energy · 90 min |
| `nrg120` | Energy Experience 120 min | energy | 400 | Energy · 120 min |
| `cpl90` | Couples 90 min | couples | 350 | Casal · 90 min |
| `cpl120` | Couples 2 h | couples | 400 | Casal · 2 h |
| `cpl150` | Couples 2.5 h | couples | 450 | Casal · 2,5 h |
| `cpl180` | Couples 3 h | couples | 500 | Casal · 3 h |
| `other` | Other session | other | — (campo vazio, obrigatório) | Outro (valor livre) |

O nome sem "Tantric" no `item_name` é proposital: fica só no GA4, não aparece
em página nem anúncio, e não depende das idas e vindas do vocabulário.

### Regras de validação na página de obrigado

```
s  : precisa ser uma chave do catálogo          → senão item genérico legado ('session' / 'Mari Gomes session')
v  : /^\d{1,4}([.,]\d{1,2})?$/ e 50 ≤ v ≤ 1500  → senão preço padrão de s (se s válido e ≠ other), senão 250
id : /^[a-z0-9]{6,12}$/                          → senão 'ty-' + aleatório (comportamento atual)
?test presente                                   → não dispara nada (como hoje)
mg_internal_device = '1'                         → não dispara nada (novo)
id válido já registrado neste navegador          → não dispara (lista 'ty_tx_seen', no máximo 30 ids)
sem id válido + último disparo há menos de 12 h  → não dispara (dedupe atual, mantido para links antigos)
```

- Os links antigos (`/thank-you/` puro e `?v=350`) continuam funcionando:
  `?v=350` sem `s` vale €350 com item genérico. Teto de 1500: a sessão mais cara
  é €500, e "Outro" cobre workshop ou pacote. Ajustar se a Mari vender acima disso.
- Nenhum parâmetro da URL é escrito no DOM (`innerHTML`) nem vira texto livre no GA4.
- Evento: `gtag('event','purchase',{ transaction_id, value, currency:'EUR', items:[{ item_id: s, item_name, item_category, price: value, quantity: 1 }] })`.
  A conversão do Ads (quando `ADS_PURCHASE_LABEL` for preenchido) usa o mesmo `transaction_id` e `value`.

### Mensagens prontas (o link entra no lugar de `{link}`)

Conferidas contra `trafego/politicas/vocabulario.md`: sem intimate, sensual,
pleasure, visit/bezoek, hotel ou tantric.

- **EN:** `Hi! Thank you for your session today, it was lovely to welcome you. If you have a minute, I would love to hear how it was for you: {link}  Warm regards, Mari`
- **NL:** `Hoi! Dank je wel voor je sessie vandaag, het was fijn je te ontvangen. Als je een minuutje hebt, hoor ik graag hoe je het vond: {link}  Hartelijke groet, Mari`

Codificar com `encodeURIComponent` (nada de `%XX` à mão). O idioma da mensagem
define o link: EN → `/thank-you/`, NL → `/nl/thank-you/`.

> Observação, fora do escopo: a página de obrigado já no ar diz "It was a
> **pleasure** to have you", e "pleasure" está na lista de termos a evitar. Não é
> URL final de anúncio, então o risco é baixo. Fica registrado para o Daniel
> decidir; **não mudar nesta implementação**.

---

## Abordagem

```
/mari/ (PT-BR, noindex, sem tags)
  ├─ tela de PIN ── hash ok? ──> grava mg_pin_ok + mg_internal_device
  └─ gerador
       ├─ escolhe atendimento (lista do catálogo) → valor preenchido, editável
       ├─ escolhe idioma do cliente (EN | NL)
       ├─ [Gerar link] → id novo (crypto.getRandomValues, 8 chars)
       │     link = origin + (/thank-you/ | /nl/thank-you/) + ?s=…&v=…&id=…
       ├─ [Enviar no WhatsApp]  → wa.me/?text=<mensagem+link>
       ├─ [Copiar mensagem]     → navigator.clipboard (fallback: selecionar texto)
       ├─ [Ver prévia]          → mesmo link + &test (não conta)
       └─ [Bloquear]            → apaga mg_pin_ok (mantém a flag do aparelho; botão separado "Este aparelho não é da Mari" apaga as duas)

/thank-you/ e /nl/thank-you/
  └─ só o bloco <script> "// CONVERSION" muda: lê s/v/id, valida, aplica dedupe, dispara purchase
     (Consent Mode, GT-55XJZX3L, configs G-/AW-, cookie banner, GTranslate e avaliação: sem mudança nenhuma, byte a byte)
```

Usar `location.origin` para montar o link: no ar vira `https://amarigomes.com/...`,
e no teste local vira `http://localhost:8000/...`. Assim o Playwright testa o fluxo inteiro.

---

## Plano de implementação

> Regra: **nenhuma mudança em LP (`*-massage-*/`, `lp*-*.html`), home (`index.html`,
> `nl/index.html`, `home-*.html`) ou outras páginas institucionais.** O diff da
> branch contra `main` só pode tocar os arquivos listados abaixo.

### Fase A — Página de obrigado lê os parâmetros (EN + NL)

**Objetivo:** `purchase` com valor, item e `transaction_id` vindos do link validado.

| Arquivo | O que muda |
|---|---|
| `thank-you/index.html` | Só o bloco `<script>` `// CONVERSION`: catálogo, validação, dedupe por id, flag de aparelho interno. Comentário do topo do bloco atualizado |
| `nl/thank-you/index.html` | Mesmo bloco, **idêntico** ao EN |

Não mudar mais nada nos dois arquivos (texto, CSS, outros scripts).

### Fase B — Página `/mari/`

**Objetivo:** gerador utilizável no celular (390 px) com PIN.

| Arquivo | O que muda |
|---|---|
| `mari/index.html` (novo) | Página autocontida: template visual do site institucional (parchment/amber, Fraunces + Manrope via Google Fonts, como as outras), PIN, gerador, mensagens EN/NL, catálogo idêntico ao da Fase A |

Detalhes:
- `<html lang="pt-BR">`, `<title>Gerador de link | Mari</title>`, `noindex, nofollow`, `no-referrer`.
- Sem nav com links e sem footer com links do site (só logo sem link ou texto "Mari Gomes · uso interno").
- Botões de no mínimo 44 px de altura; `input` de valor com `inputmode="decimal"`; sem scroll horizontal em 390 px.
- PIN: `<input type="password" inputmode="numeric" autocomplete="off">`. Com PIN errado aparece "PIN incorreto". Depois de 5 erros seguidos, espera de 30 s (cosmético).
- Valor: aceita vírgula ou ponto e é normalizado para ponto no link. Fora de 50–1500 ou vazio em "Outro": botão "Gerar link" desabilitado e aviso.
- Cada "Gerar link" cria um `id` novo. Mudar atendimento, valor ou idioma depois de gerar apaga o link mostrado, para evitar mandar o link velho.
- Aviso curto na tela: "Não abra o link no seu celular para testar. Use **Ver prévia**."
- Comentário no topo do `<script>`: como trocar o PIN (`printf 'mari-gomes:%s' NOVOPIN | sha256sum`, colar em `PIN_HASH`) e o aviso de que não é segurança real.

### Fase C — Testes automatizados + documentação

**Objetivo:** provar o fluxo com Playwright e registrar.

| Arquivo | O que muda |
|---|---|
| `scripts/test-gerador-link.js` (novo) | Teste Playwright (Chromium pré-instalado; `require('playwright')`), serve a raiz do repo por `python3 -m http.server` em porta livre, bloqueia `googletagmanager.com`/`cdn.gtranslate.net`/`fonts.*` e lê `window.dataLayer` para conferir os `purchase`. `scripts/` não é publicado |
| `docs/implementations/pagina-obrigado-avaliacao.md` | Novos parâmetros, link para este doc |
| `docs/implementations/README.md` | Linha deste doc na tabela de ativas |
| `trafego/alteracoes.md` | Registro: mudança na medição de `purchase` (data, hash, páginas). `/thank-you/` não é URL final de anúncio, mas muda a conversão |
| este arquivo | hashes, relatórios, checks `[x]` com evidência |

Como rodar (documentar no topo do script): `node scripts/test-gerador-link.js` → sai com código 0 e imprime `OK` por cenário.

### Commits

| Fase | Commit | O que foi implementado |
|---|---|---|
| A | _(preencher)_ | thank-you EN/NL leem `s`/`v`/`id` com validação |
| B | _(preencher)_ | página `/mari/` |
| C | _(preencher)_ | testes Playwright + docs |

Relatório de cada fase (antes / agora / como validar), em linguagem simples, logo
abaixo da tabela, mais o prompt de retomada.

---

## Checks de validação

Evidência obrigatória em cada `[x]`: data + saída do teste ou descrição objetiva
do que foi visto (ex.: "dataLayer: purchase value=300 item_id=rlx90 tx=k3x9p2qa").
**Check sem evidência = não marcado.**

### Cenário 1 — Página de obrigado: parâmetros válidos
- [ ] `/thank-you/?s=rlx90&v=300&id=abc12345` → 1 `purchase`, `value` 300, `currency` EUR, `transaction_id` `abc12345`, `items[0]` = `{item_id:'rlx90', item_name:'Holistic Relaxation 90 min', item_category:'relaxation', price:300}`
- [ ] Mesmo teste em `/nl/thank-you/`
- [ ] `?s=cpl150&v=480,50&id=…` → `value` 480.5 (vírgula aceita)
- [ ] `?s=other&v=120&id=…` → `item_id` other, `value` 120

### Cenário 2 — Parâmetros inválidos / adulterados
- [ ] `v=999999`, `v=1e9`, `v=-5`, `v=abc`, `v=20` com `s=nrg90` → `value` 350 (preço padrão de nrg90)
- [ ] `v=999999` sem `s` → `value` 250
- [ ] `s=<script>` ou `s=xyz` → item genérico `session`, nada de `s` aparece no DOM nem no evento
- [ ] `id=../../x`, `id=ABC` (maiúscula), `id` com 40 chars → `transaction_id` gerado `ty-…`
- [ ] Links legados: `/thank-you/` puro → 250 genérico; `?v=350` → 350 genérico

### Cenário 3 — `?test`, dedupe, aparelho interno
- [ ] `?test` (com ou sem os outros parâmetros) → nenhum `purchase`
- [ ] Mesmo `id` aberto 2× no mesmo navegador → 1 `purchase` só
- [ ] Dois `id` diferentes em seguida no mesmo navegador → 2 `purchase`
- [ ] Sem `id`: 2 aberturas em < 12 h → 1 `purchase` (comportamento antigo mantido)
- [ ] Com `mg_internal_device='1'` no `localStorage` → nenhum `purchase`

### Cenário 4 — `/mari/`: PIN
- [ ] Sem PIN: gerador escondido (não basta CSS: o formulário não está visível nem é focável)
- [ ] PIN errado → mensagem "PIN incorreto", gerador continua escondido
- [ ] 5 erros → espera de 30 s
- [ ] PIN certo → gerador aparece; recarregar a página → continua desbloqueado
- [ ] Trocar `PIN_HASH` (simulado no teste) → volta a pedir PIN
- [ ] "Bloquear" → pede PIN de novo
- [ ] O PIN provisório não aparece em nenhum arquivo do repo (`git grep` pelo valor → vazio)

### Cenário 5 — `/mari/`: gerador
- [ ] Ordem da lista = tabela do catálogo (mais barato → mais caro dentro de cada grupo; grupos Relaxation → Energy → Casal → Outro)
- [ ] Escolher "Energy · 90 min" preenche 350; editar para 380 → link com `v=380`
- [ ] "Outro" com valor vazio → "Gerar link" desabilitado
- [ ] Valor 20 ou 5000 → desabilitado + aviso
- [ ] Link EN = `<origin>/thank-you/?s=…&v=…&id=<8 chars [a-z0-9]>`; NL = `<origin>/nl/thank-you/?…`
- [ ] Gerar 2× → `id` diferentes
- [ ] Botão WhatsApp → `href`/`window.open` começa com `https://wa.me/?text=` e o texto decodificado = mensagem do idioma + link
- [ ] Mensagens EN/NL sem nenhum termo da lista "Evitar" de `vocabulario.md`
- [ ] "Ver prévia" abre o link com `&test` e não gera `purchase`
- [ ] Fluxo ponta a ponta: gerar na `/mari/` → abrir o link num **contexto de navegador novo** (sem a flag) → 1 `purchase` com os valores escolhidos

### Cenário 6 — Mobile 390 px
- [ ] `/mari/` em 390×844: sem scroll horizontal (`scrollWidth <= 390`), botões ≥ 44 px de altura, screenshot anexado no relatório (scratchpad, não no repo)
- [ ] `/thank-you/` em 390 px sem regressão visual (screenshot)

### Cenário 7 — Não regressão / PII / tags
- [ ] `git diff main --stat` só toca: `thank-you/index.html`, `nl/thank-you/index.html`, `mari/index.html`, `scripts/test-gerador-link.js` e os docs/trafego listados
- [ ] Nos 2 thank-you, todo `<script>` exceto `// CONVERSION` é byte-idêntico ao `main` (Consent Mode, `GT-55XJZX3L`, `G-EBY5JJD27V`, `AW-18036442650`, cookie banner, GTranslate, avaliação)
- [ ] Bloco `// CONVERSION` idêntico entre EN e NL; catálogo idêntico nos 3 arquivos (o teste compara)
- [ ] `/mari/` não carrega `googletagmanager`, `gtranslate` nem nenhum script externo (só Google Fonts CSS)
- [ ] `/mari/` tem `noindex, nofollow`; nenhum arquivo do site linka para `/mari/` (`grep -rn "/mari/" --include=*.html` só acha a própria página)
- [ ] Nenhum campo de nome/telefone/e-mail do cliente na `/mari/`; o link gerado só tem `s`, `v`, `id`
- [ ] Simulação do workflow (`pages.yml` › passo "Montar _site" rodado localmente num diretório temporário) inclui `mari/` e não inclui `scripts/`

---

## Riscos

| Risco | Mitigação |
|---|---|
| PIN quebrável (hash público) | Documentado. O pior caso é alguém gerar compras falsas, e isso já é possível hoje. Se virar problema: Cloudflare Access na rota `/mari/*` (grátis, login por e-mail), sem mudar código |
| Flag `mg_internal_device` só vale no navegador onde a Mari desbloqueou. Link aberto de dentro do WhatsApp pode cair no navegador embutido (iOS) | Aviso na tela + botão "Ver prévia". Compra falsa residual: o mesmo `id` só conta 1 vez, e dá para filtrar por `transaction_id` no GA4 |
| GA4 sem consentimento: `purchase` com `analytics_storage` negado vai como ping sem cookie (modelado) | Comportamento atual, aceito. Não mudar o Consent Mode |
| Catálogo em 3 cópias pode divergir quando a Mari mudar preço | Comentário `SERVICE CATALOG` + teste que compara. Adicionar ao CLAUDE.md na graduação: "ao mudar preço, mudar LPs + `/prices/` + catálogo" |
| Cliente encaminha o link para outra pessoa | `id` repetido não conta de novo no GA4 (dedupe por `transaction_id`) |
| `crypto.subtle` exige contexto seguro | `https://` no ar e `http://localhost` no teste são seguros. Não testar via `file://` |

### Pendência (Daniel)
- [ ] PIN definitivo: o implementador informa o PIN provisório na conversa; o Daniel troca quando quiser (comando no comentário do script).

---

## Fase 2 — Atribuição da venda ao anúncio (SÓ PLANO, não implementar)

### Problema
O `purchase` só se liga ao clique do anúncio se o cliente abrir `/thank-you/` no
**mesmo navegador** em que clicou no anúncio, com cookies aceitos. Na prática a
compra acontece dias depois, pelo link do WhatsApp, muitas vezes no navegador
embutido do app. O Ads quase nunca vai creditar a venda à campanha.

### Peças
1. **Captura nas LPs** (só com `ad_storage` = granted): ao entrar, guardar em
   `localStorage` `{gclid|gbraid|wbraid, utm_source/medium/campaign/term/content, landing path, ts}`.
   Validade de 90 dias, igual à janela de clique do Ads.
2. **Código de referência curto** (ex.: `MG-K7P2`, 4 chars sem ambíguos), gerado
   na LP e anexado ao texto pré-preenchido do WhatsApp ("…availability? (ref MG-K7P2)").
   O GA4 recebe no clique do WhatsApp um evento com o parâmetro `ref_code`
   (dimensão personalizada); o GA4 já sabe a origem/campanha dessa sessão.
3. **Gerador:** campo opcional "Código de referência" (validação `^MG-[A-Z2-9]{4}$`)
   → entra no link como `&r=MG-K7P2` → a página de obrigado manda `ref_code` no `purchase`.
4. **Ligação venda → clique**, em dois níveis:
   - **2a (sem servidor):** relatório no GA4 Explorations cruzando o lead (com
     campanha) e o `purchase` pelo `ref_code`. Serve para relatório e ROAS manual,
     mas **não alimenta o lance** do Ads.
   - **2b (com servidor):** Cloudflare Worker + KV/D1 (o domínio já está na
     Cloudflare). A LP manda `{ref, gclid, ts}` no clique do WhatsApp, e o Worker
     guarda por 90 dias. Uma exportação semanal gera o CSV de **conversões offline**
     (`Google Click ID, Conversion Name, Conversion Time, Value, Currency`) para
     upload manual no Ads (ação de conversão "Importar › cliques"). Isso alimenta o
     lance. Alternativa sem gclid: GA4 `purchase` importado no Ads (já possível
     hoje), mas continua com a limitação do mesmo navegador.

### Viabilidade e esforço (estimativa)
| Etapa | Esforço | Valor |
|---|---|---|
| 2a.1 Captura + `ref` no texto do WhatsApp nas 6 LPs (via prévia `-v2`) | 1 dia + 2–3 dias de prévia/aprovação da Mari | Base de tudo |
| 2a.2 Campo `ref` no gerador + `ref_code` no `purchase` + dimensão no GA4 | 0,5 dia | Relatório por campanha |
| 2b Worker + KV + exportação CSV + ação de conversão offline | 2–3 dias + manutenção; upload semanal manual ou agendado | Lance otimiza por venda real |

Volume atual é baixo (poucas vendas por semana). **Recomendação:** fazer 2a,
medir 4–6 semanas e só fazer 2b se a taxa de vendas com `ref` informado for boa
e o volume justificar (o Ads precisa de uns 15–30 conversões/mês para otimizar).

### Riscos
- **GDPR/ePrivacy (NL) e LGPD:** gclid + ref code ligados a uma venda são dado
  pessoal pseudonimizado. Exige: captura **só com consentimento** (`ad_storage`
  granted; respeitar a escolha "Essential only"), retenção de 90 dias e exclusão
  depois, e **política de privacidade**, que o site hoje **não tem** (precisa
  existir antes da 2b; vira pendência para a Mari/Daniel). Nunca juntar nome ou
  telefone ao ref no servidor. A Mari não anota quem é quem, só o código.
- **Consentimento recusado:** sem gclid, só o `ref` + UTM agregado (GA4 modelado). Aceitar a perda.
- **Política do Google Ads:** mudar o texto do WhatsApp nas LPs com anúncio ativo
  pode disparar nova revisão. Aplicar a regra da prévia `-v2` do CLAUDE.md
  (`noindex`, trava de conversão), conferir `vocabulario.md` e garantir que os
  blocos `<script>` (Consent Mode, `GT-55XJZX3L`, `G-`/`AW-`, conversão, cookie
  banner, GTranslate) fiquem **idênticos** aos do ar. Registrar em `trafego/alteracoes.md`.
  Upload de conversão offline é permitido; o que não pode é enviar PII sem hash
  (por isso não usamos enhanced conversions for leads).
- **Fricção:** o cliente pode apagar o "(ref …)" da mensagem, e a Mari pode
  esquecer de copiar. O campo fica opcional, e sem código a venda segue sem atribuição.
- **Repo público:** segredos do Worker (token de exportação) ficam em secrets da
  Cloudflare, nunca no repo. Endpoint com limite de taxa e validação de formato.

### Ordem recomendada
1. Fase 1 no ar e usada pela Mari por algumas semanas (valores reais no GA4).
2. Criar a ação de conversão "Compra" no Ads (pendência do doc da página de obrigado).
3. 2a.1 em prévia `-v2` → aprovação → promoção (1 LP por vez, começando pela de mais tráfego).
4. 2a.2.
5. Política de privacidade publicada.
6. Avaliar 2b com dados.

---

## Prompt de retomada (implementador)

```
Leia CLAUDE.md e docs/implementations/gerador-link-conversao.md. Implemente as fases
A, B e C na branch claude/plano-link-conversao, 1 commit por fase, hash registrado
neste doc logo após cada commit. Não toque em LPs, home nem outras páginas. Marque
os checks só com evidência (saída de node scripts/test-gerador-link.js). Informe o
PIN provisório só na conversa. Ao terminar, push e avise a sessão planejadora por
send_message com o hash final.
```
