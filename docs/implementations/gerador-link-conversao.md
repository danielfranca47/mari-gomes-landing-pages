# Gerador de link de conversão (página privada da Mari) + obrigado com parâmetros

**Status:** Fases A–C implementadas e testadas (23/11/2026), aguardando revisão. Fase 1 = fases A–C abaixo; Fase 2 (atribuição ao anúncio) **só planejada, não implementar**.

**Rodada 2 (23/11/2026):** Fase D planejada: nomes iguais às LPs, tipos, miniaturas, mensagem com quebras de linha. Ver seção "Fase D".

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

### Catálogo (do mais barato ao mais caro: grupos em ordem de preço inicial, durações crescentes dentro de cada grupo) — **nomes e estrutura revistos na Fase D (D14–D17)**

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

### Mensagens prontas (o link entra no lugar de `{link}`) — **substituídas na Fase D (D20)**

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
| A | `c2296b1` | thank-you EN/NL leem `s`/`v`/`id` com validação |
| B | `b9c452d` | página `/mari/` |
| C | `de38d6c` | testes Playwright + docs |

Relatório de cada fase (antes / agora / como validar), em linguagem simples, logo
abaixo da tabela, mais o prompt de retomada.

---

## Checks de validação

Evidência obrigatória em cada `[x]`: data + saída do teste ou descrição objetiva
do que foi visto (ex.: "dataLayer: purchase value=300 item_id=rlx90 tx=k3x9p2qa").
**Check sem evidência = não marcado.**

### Cenário 1 — Página de obrigado: parâmetros válidos
- [x] `/thank-you/?s=rlx90&v=300&id=abc12345` → 1 `purchase`, `value` 300, `currency` EUR, `transaction_id` `abc12345`, `items[0]` = `{item_id:'rlx90', item_name:'Holistic Relaxation 90 min', item_category:'relaxation', price:300}` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Mesmo teste em `/nl/thank-you/` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `?s=cpl150&v=480,50&id=…` → `value` 480.5 (vírgula aceita) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `?s=other&v=120&id=…` → `item_id` other, `value` 120 — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 2 — Parâmetros inválidos / adulterados
- [x] `v=999999`, `v=1e9`, `v=-5`, `v=abc`, `v=20` com `s=nrg90` → `value` 350 (preço padrão de nrg90) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `v=999999` sem `s` → `value` 250 — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `s=<script>` ou `s=xyz` → item genérico `session`, nada de `s` aparece no DOM nem no evento — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `id=../../x`, `id=ABC` (maiúscula), `id` com 40 chars → `transaction_id` gerado `ty-…` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Links legados: `/thank-you/` puro → 250 genérico; `?v=350` → 350 genérico — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 3 — `?test`, dedupe, aparelho interno
- [x] `?test` (com ou sem os outros parâmetros) → nenhum `purchase` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Mesmo `id` aberto 2× no mesmo navegador → 1 `purchase` só — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Dois `id` diferentes em seguida no mesmo navegador → 2 `purchase` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Sem `id`: 2 aberturas em < 12 h → 1 `purchase` (comportamento antigo mantido) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Com `mg_internal_device='1'` no `localStorage` → nenhum `purchase` — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 4 — `/mari/`: PIN
- [x] Sem PIN: gerador escondido (não basta CSS: o formulário não está visível nem é focável) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] PIN errado → mensagem "PIN incorreto", gerador continua escondido — ✔ 23/11/2026 (test-gerador-link.js)
- [x] 5 erros → espera de 30 s — ✔ 23/11/2026 (test-gerador-link.js)
- [x] PIN certo → gerador aparece; recarregar a página → continua desbloqueado — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Trocar `PIN_HASH` (simulado no teste) → volta a pedir PIN — ✔ 23/11/2026 (test-gerador-link.js)
- [x] "Bloquear" → pede PIN de novo — ✔ 23/11/2026 (test-gerador-link.js)
- [x] O PIN provisório não aparece em nenhum arquivo do repo (`git grep` pelo valor → vazio) — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 5 — `/mari/`: gerador
- [x] Ordem da lista = tabela do catálogo (mais barato → mais caro dentro de cada grupo; grupos Relaxation → Energy → Casal → Outro) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Escolher "Energy · 90 min" preenche 350; editar para 380 → link com `v=380` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] "Outro" com valor vazio → "Gerar link" desabilitado — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Valor 20 ou 5000 → desabilitado + aviso — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Link EN = `<origin>/thank-you/?s=…&v=…&id=<8 chars [a-z0-9]>`; NL = `<origin>/nl/thank-you/?…` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Gerar 2× → `id` diferentes — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Botão WhatsApp → `href`/`window.open` começa com `https://wa.me/?text=` e o texto decodificado = mensagem do idioma + link — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Mensagens EN/NL sem nenhum termo da lista "Evitar" de `vocabulario.md` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] "Ver prévia" abre o link com `&test` e não gera `purchase` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Fluxo ponta a ponta: gerar na `/mari/` → abrir o link num **contexto de navegador novo** (sem a flag) → 1 `purchase` com os valores escolhidos — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 6 — Mobile 390 px
- [x] `/mari/` em 390×844: sem scroll horizontal (`scrollWidth <= 390`), botões ≥ 44 px de altura, screenshot anexado no relatório (scratchpad, não no repo) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `/thank-you/` em 390 px sem regressão visual (screenshot) — ✔ 23/11/2026 (test-gerador-link.js)

### Cenário 7 — Não regressão / PII / tags
- [x] `git diff main --stat` só toca: `thank-you/index.html`, `nl/thank-you/index.html`, `mari/index.html`, `scripts/test-gerador-link.js` e os docs/trafego listados — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Nos 2 thank-you, todo `<script>` exceto `// CONVERSION` é byte-idêntico ao `main` (Consent Mode, `GT-55XJZX3L`, `G-EBY5JJD27V`, `AW-18036442650`, cookie banner, GTranslate, avaliação) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Bloco `// CONVERSION` idêntico entre EN e NL; catálogo idêntico nos 3 arquivos (o teste compara) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `/mari/` não carrega `googletagmanager`, `gtranslate` nem nenhum script externo (só Google Fonts CSS) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `/mari/` tem `noindex, nofollow`; nenhum arquivo do site linka para `/mari/` (`grep -rn "/mari/" --include=*.html` só acha a própria página) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Nenhum campo de nome/telefone/e-mail do cliente na `/mari/`; o link gerado só tem `s`, `v`, `id` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Simulação do workflow (`pages.yml` › passo "Montar _site" rodado localmente num diretório temporário) inclui `mari/` e não inclui `scripts/` — ✔ 23/11/2026 (test-gerador-link.js)

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

**Evidência (23/11/2026):** `node scripts/test-gerador-link.js` → exit 0, `TODOS OS CENARIOS OK` (saída completa abaixo). Cada `[x]` acima corresponde a uma linha `OK` com o mesmo nome de cenário (C1–C7). Screenshots 390 px de `/mari/` e `/thank-you/` conferidos visualmente (scratchpad, fora do repo).

Observações / desvios:
- C4 "PIN provisório não aparece no repo": rodado com `MARI_PIN` real → `OK C4 PIN real fora do repo — verificado com MARI_PIN` (o PIN não está em nenhum arquivo, incluindo este).
- C7 "git diff main": o `main` local/remoto está atrás do ponto de partida da branch (PR #4 já mergeado no ponto de partida do plano), então o teste compara com `ad67fb4` (pai do commit do plano; `BASE_REF`). Resultado: só os arquivos permitidos mudaram.
- C7 "nenhum arquivo linka /mari/": o teste procura `href/src/action/location=` apontando para `/mari/`; menções em comentários de código (thank-you) são permitidas.
- C7 workflow: o passo "Montar _site" de `pages.yml` é extraído e executado num diretório temporário pelo teste.
- C4 "5 erros → espera de 30 s": o teste confirma o botão desabilitado + mensagem com a contagem; não espera os 30 s completos.
- `trafego/alteracoes.md` **não** foi alterado nesta fase: a instrução do Daniel é registrar só quando a feature for para o ar (o plano pedia na Fase C). Pendente para a publicação.

```
OK   C1 EN parametros validos  — {"transaction_id":"abc12345","value":300,"currency":"EUR","items":[{"item_id":"rlx90","item_name":"Holistic Relaxation 90 min","item_category":"relaxation","price":300,"quantity":1}]}
OK   C1 NL parametros validos  — {"transaction_id":"abc12345","value":300,"currency":"EUR","items":[{"item_id":"rlx90","item_name":"Holistic Relaxation 90 min","item_category":"relaxation","price":300,"quantity":1}]}
OK   C1 virgula aceita  — value=480.5
OK   C1 other  — item_id=other value=120
OK   C2 v=999999 com s=nrg90 -> 350  — value=350
OK   C2 v=1e9 com s=nrg90 -> 350  — value=350
OK   C2 v=-5 com s=nrg90 -> 350  — value=350
OK   C2 v=abc com s=nrg90 -> 350  — value=350
OK   C2 v=20 com s=nrg90 -> 350  — value=350
OK   C2 v=999999 sem s -> 250  — value=250
OK   C2 s=%3Cscript%3E -> item generico, param fora do DOM e do evento  — [{"item_id":"session","item_name":"Mari Gomes session","price":300,"quantity":1}]
OK   C2 s=xyz -> item generico, param fora do DOM e do evento  — [{"item_id":"session","item_name":"Mari Gomes session","price":300,"quantity":1}]
OK   C2 id invalido (..%2F..%2Fx) -> ty-...  — tx=ty-mwtpc0wi1lukhl
OK   C2 id invalido (ABC12345) -> ty-...  — tx=ty-mwtpc137th1h4q
OK   C2 id invalido (aaaaaaaaaaaa) -> ty-...  — tx=ty-mwtpc19c70lh8f
OK   C2 legado /thank-you/ puro  — value=250
OK   C2 legado ?v=350  — value=350
OK   C3 ?test com params -> nenhum purchase
OK   C3 ?test puro -> nenhum purchase
OK   C3 mesmo id 2x no mesmo navegador -> 1 so (2a abertura nao dispara)
OK   C3 mesmo id em /nl/ no mesmo navegador -> nao dispara de novo
OK   C3 id diferente em seguida -> 2o purchase  — tx=def67890
OK   C3 sem id: 2 aberturas < 12 h -> 1 purchase
OK   C3 mg_internal_device=1 -> nenhum purchase
OK   C4 sem PIN: gerador escondido (hidden)
OK   C4 sem PIN: gerador nao e focavel
OK   C4 PIN errado -> "PIN incorreto", gerador escondido
OK   C4 5 erros -> espera de 30 s  — PIN incorreto. Aguarde 30 s para tentar de novo.
OK   C4 PIN certo -> gerador aparece e grava flag do aparelho
OK   C4 recarregar -> continua desbloqueado
OK   C4 Bloquear -> pede PIN de novo (flag do aparelho mantida)
OK   C4 "Este aparelho nao e da Mari" -> apaga as duas chaves
OK   C4 trocar PIN_HASH -> volta a pedir PIN
OK   C4 PIN real fora do repo  — verificado com MARI_PIN
OK   C5 ordem da lista  — rlx60,rlx90,rlx120,nrg60,nrg90,nrg120,cpl90,cpl120,cpl150,cpl180,other
OK   C5 Energy 90 preenche 350
OK   C5 link EN com v=380  — http://localhost:43865/thank-you/?s=nrg90&v=380&id=xqrm7eq4
OK   C5 gerar 2x -> ids diferentes  — xqrm7eq4 / gvczrsi5
OK   C5 virgula normalizada para ponto
OK   C5 editar valor apaga o link mostrado
OK   C5 link NL  — http://localhost:43865/nl/thank-you/?s=nrg90&v=390&id=mb1qtuiv
OK   C5 botao WhatsApp (NL) sem numero + texto = mensagem+link
OK   C5 mensagens EN/NL sem termos proibidos
OK   C5 Outro vazio -> Gerar desabilitado
OK   C5 valor 20 -> desabilitado + aviso  — O valor deve ficar entre €50 e €1500.
OK   C5 valor 5000 -> desabilitado + aviso  — O valor deve ficar entre €50 e €1500.
OK   C5 Ver previa = link + &test  — http://localhost:43865/thank-you/?s=rlx60&v=250&id=csaw0wda&test
OK   C5 Ver previa -> nenhum purchase
OK   C5 ponta a ponta (contexto novo)  — tx=csaw0wda value=250
OK   C6 /mari/ 390px sem scroll horizontal e alvos >= 44px  — scrollWidth=390 pequenos=[]
OK   C6 /thank-you/ 390px sem scroll horizontal  — scrollWidth=390; screenshots em <scratchpad>/shots
OK   C7 catalogo identico nos 3 arquivos
OK   C7 bloco CONVERSION identico EN/NL
OK   C7 thank-you/index.html: tudo exceto o bloco CONVERSION identico a ad67fb4
OK   C7 nl/thank-you/index.html: tudo exceto o bloco CONVERSION identico a ad67fb4
OK   C7 /mari/ sem GTM, GTranslate, gtag nem script externo
OK   C7 /mari/ noindex, nofollow
OK   C7 nenhum arquivo linka /mari/  — []
OK   C7 /mari/ sem campo de nome/telefone/e-mail
OK   C7 diff contra ad67fb4 so toca arquivos permitidos  — []
OK   C7 workflow publica mari/ e nao publica scripts/

TODOS OS CENARIOS OK
```

### Pendência (Daniel)
- [ ] PIN definitivo: o implementador informa o PIN provisório na conversa; o Daniel troca quando quiser (comando no comentário do script).

---

## Fase D — Nomes iguais às LPs, miniaturas e mensagem com quebra de linha (rodada 2, 23/11/2026)

**Pedido (Daniel, via sessão pai):** (1) trocar os dois espaços antes da
assinatura por quebra de linha e revisar a mensagem; (2) nomes, tipos, durações e
preços da `/mari/` **idênticos às LPs de anúncio**, que são a fonte da verdade;
(3) miniatura de cada experiência na `/mari/`. A Fase 2 (atribuição) continua só
no plano.

### Divergências encontradas (LPs × `/mari/` em `c3785ec`)

Fonte: `<title>`, `.hero-tag`/`.hero-eyebrow`, `<section id="pricing">`, cards de
`#sessions` (LP2), `#therapies` (LP1) e `#options` (LP3), conferidos nas 6 pastas em 23/11/2026.

| # | Onde | LP (fonte da verdade) | `/mari/` hoje |
|---|---|---|---|
| 1 | Nome do serviço LP2 | **Tantric Holistic Relaxation** (title, hero, rótulo de preços; igual em EN e NL) | "Relaxation" |
| 2 | Nome do serviço LP1 | **Tantric Energy Experience** (igual em EN e NL) | "Energy" |
| 3 | Nome do serviço LP3 | **Couples Massage** (title/hero EN; NL "Koppelsmassage"); card de preço "Couple session" | "Casal" |
| 4 | Durações LP3 | **90 minutes · 2 hours · 2.5 hours · 3 hours** | "90 min · 2 h · 2,5 h · 3 h" |
| 5 | Tipos de sessão | LP2: **Relaxation & Holistic Massage**, **Energetic Healing Massage** ("mesmo preço para os dois tipos"). LP1: **Energetic Healing Massage**, **Holistic Healing Massage**, **Tantric Therapy** ("a modalidade é escolhida com a Mari"). LP3: **Relaxation Duo**, **Holistic Couple Experience** (*Most requested*), **Tantric Couple Therapy** (todos "From €350 for two") | Não existem |
| 6 | Destaques | LP1 e LP2: **90 min = Recommended**. LP3: **Holistic Couple Experience = Most requested** | Não aparecem |
| 7 | `item_name` no GA4 | — | "Holistic Relaxation 60 min", "Energy Experience…", "Couples 2 h": não batem com as LPs |

**Preços:** os 10 valores da `/mari/` batem com as LPs, e EN = NL nas 3 LPs
(LP2 250/300/350 · LP1 300/350/400 · LP3 350/400/450/500). Batem também com o
CLAUDE.md. Sem divergência de preço.
**EN × NL:** os nomes de serviço da LP1/LP2 são iguais nos dois idiomas. A LP3 e
os cards de tipo são traduzidos ("Ontspanning Duo", "Holistische Koppelservaring",
"Tantrische Koppelstherapie", "Ontspannings- & Holistische Massage",
"Energetische/Holistische Helingsmassage", "Tantrische Therapie"). Isso é
tradução, não divergência. **A `/mari/` usa os nomes EN** (idioma principal das
LPs, e o mesmo nome que vai para o GA4); o teste compara com a LP EN e confere
que a LP NL tem os mesmos preços, a mesma quantidade de tipos e os mesmos destaques.

### Decisões da Fase D

| # | Decisão | Por quê |
|---|---|---|
| D14 | Catálogo passa a ter **3 experiências + Outro**, cada uma com `name` (= LP EN), `img`, `durations[]` (código `s`, rótulo exato da LP, preço, `rec` true no recomendado) e `types[]` (código `t`, nome exato do card, `pop` true no "Most requested") | Uma fonte só para a UI, o GA4 e a validação. Ordem: Tantric Holistic Relaxation (desde €250) → Tantric Energy Experience (desde €300) → Couples Massage (desde €350) → Outro; durações crescentes; tipos na ordem dos cards da LP |
| D15 | Os códigos `s` **não mudam** (`rlx60…cpl180`, `other`) | Links de teste já gerados continuam válidos |
| D16 | Novo parâmetro opcional **`t`** (tipo): `rlx` → `rhm`, `ehm` · `nrg` → `ehm`, `hhm`, `tt` · `cpl` → `duo`, `hce`, `tct`. Na `/mari/` o 1º item do seletor de tipo é **"Não especificar"** (padrão), e aí o link vai sem `t` | Na LP1 a modalidade é escolhida com a Mari na hora; ela pode não querer escolher. `t` só é aceito se pertencer à família do `s`; senão é ignorado |
| D17 | GA4: `item_name` = **nome da LP + duração exata da LP** (ex.: "Tantric Holistic Relaxation 90 min", "Couples Massage 2.5 hours"), `item_category` = família, **`item_variant`** = nome do tipo (só com `t` válido) | Pedido de consistência com as LPs. A PR #5 ainda não está no ar, então não há histórico a quebrar. Fica só no GA4 (não é anúncio nem página), sem risco de política |
| D18 | UI da `/mari/`: **cards de experiência** com miniatura, nome e a faixa de preços ("€250 · €300 · €350"). Ao tocar num card aparecem: seletor de **tipo** (se houver), botões de **duração** com preço e selo "Recomendado" / "Mais pedido" (o selo de tipo aparece na opção do seletor), e o **valor** preenchido e editável. "Outro" = só o valor | A Mari reconhece a experiência pela foto. Selos em PT porque a interface é PT |
| D19 | Miniaturas: `/images/LP2_Hero.webp` (Relaxation), `/images/LP1_hero.webp` (Energy), `/images/LP3_Hero.webp` (Couples). `<img>` de 64×64 com `object-fit: cover`, `width`/`height` no HTML, `loading="lazy"`, `decoding="async"`, `alt` em PT descritivo (ex.: "Foto da LP Tantric Holistic Relaxation: cliente recebendo massagem no estúdio") | São as fotos principais de cada LP, as mais reconhecíveis. Não criar nem baixar imagem nova (pedido). Peso: ~84 + 109 + 111 KB = ~305 KB. Como ficam dentro de `#gen` (`display:none` até o PIN), o `lazy` faz o Chromium/Safari só baixarem depois do desbloqueio. **Se o Daniel quiser página mais leve**, a melhoria é gerar miniaturas de 128 px (~5 KB cada), mas isso exige criar imagens e fica para outra rodada |
| D20 | Mensagem com quebras de linha (`\n`, codificadas com `encodeURIComponent` → `%0A`; o WhatsApp mostra a quebra) e **versão no plural para casal em NL** (`jullie`). EN serve para os dois casos | "Dank je wel voor je sessie" soa errado para um casal. Revisado contra `vocabulario.md`: sem termos a evitar |

### Mensagens (substituem as da seção "Mensagens prontas")

```
EN (todas):
Hi! Thank you for your session today, it was lovely to welcome you.

If you have a minute, I would love to hear how it was for you:
{link}

Warm regards,
Mari

NL (individual, s = rlx*/nrg*/other):
Hoi! Dank je wel voor je sessie vandaag, het was fijn je te ontvangen.

Als je een minuutje hebt, hoor ik graag hoe je het vond:
{link}

Hartelijke groet,
Mari

NL (casal, s = cpl*):
Hoi! Dank jullie wel voor jullie sessie vandaag, het was fijn jullie te ontvangen.

Als jullie een minuutje hebben, hoor ik graag hoe jullie het vonden:
{link}

Hartelijke groet,
Mari
```

O link fica sozinho numa linha para o WhatsApp detectar e tornar clicável sem
grudar em pontuação.

### Arquivos da Fase D (1 commit)

| Arquivo | O que muda |
|---|---|
| `mari/index.html` | Catálogo novo (D14), UI de cards com miniatura (D18/D19), seletor de tipo + `t` no link (D16), mensagens (D20) |
| `thank-you/index.html`, `nl/thank-you/index.html` | **Só** o bloco `// CONVERSION`: catálogo novo idêntico, leitura/validação de `t`, `item_name`/`item_variant` (D17). Resto byte-idêntico ao `main` |
| `scripts/test-gerador-link.js` | Cenários D1–D6 abaixo + ajustes nos esperados de `item_name` dos cenários antigos |
| este arquivo | hash, relatório, checks |

Nada em LPs, home ou outras páginas. As LPs são **só lidas** pelo teste.

### Checks da Fase D

#### Cenário D1 — Paridade automática com as LPs (o teste lê os arquivos das LPs)
- [x] Para cada experiência, o `name` do catálogo aparece no `<title>` **e** no rótulo de preços (LP1/LP2) ou no `<title>`/hero (LP3) da LP EN — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Durações e preços do catálogo = pares (rótulo, €) extraídos de `<section id="pricing">` da LP EN, na mesma ordem e com o mesmo texto do rótulo ("60 min", "2.5 hours"…) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Os mesmos preços, na mesma ordem, na LP NL correspondente — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `rec: true` só na duração que tem "Recommended"/"Aanbevolen" na LP (90 min em LP1 e LP2; nenhuma na LP3) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `types[].name` = títulos dos cards de `#sessions` (LP2), `#therapies` (LP1) e `#options` (LP3) da LP EN, na mesma ordem; a quantidade de cards é igual na LP NL — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `pop: true` só em Holistic Couple Experience (card com "Most requested"/"Meest gevraagd") — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Preços em ordem crescente dentro de cada experiência, e experiências em ordem de preço inicial — ✔ 23/11/2026 (test-gerador-link.js)
- [x] O teste **falha** se alguém mudar um preço numa LP sem mudar o catálogo (comprovar uma vez alterando a LP numa cópia temporária, não no repo, e colar a saída de falha no relatório) — ✔ 23/11/2026 (test-gerador-link.js)

#### Cenário D2 — `/mari/` em 390×844 com miniaturas
- [x] 3 cards com `<img>` cujo `src` começa com `/images/` e existe em `images/`, renderizados em 56–72 px, `naturalWidth > 0` depois do desbloqueio — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Nenhum `src` com `amarigomes.com` nem URL externa; `loading="lazy"` e `alt` não vazio nos 3 — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Antes do PIN, nenhuma requisição a `/images/*` (registrar as requisições no Playwright) — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `scrollWidth <= 390`, alvos de toque ≥ 44 px, nome + faixa de preço visíveis sem cortar (sem `text-overflow` escondendo o nome); screenshot no relatório (scratchpad) — ✔ 23/11/2026 (test-gerador-link.js)

#### Cenário D3 — Gerador com tipo
- [x] Couples Massage → Holistic Couple Experience → 2.5 hours → valor 450 → link `?s=cpl150&t=hce&v=450&id=…` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Tipo "Não especificar" → link sem `t` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Trocar experiência limpa o tipo, a duração e o link gerado — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Selo "Recomendado" visível em 90 min (Relaxation e Energy); "Mais pedido" em Holistic Couple Experience — ✔ 23/11/2026 (test-gerador-link.js)

#### Cenário D4 — Página de obrigado com `t`
- [x] `?s=cpl150&t=hce&v=450&id=…` → `items[0]` = `{item_id:'cpl150', item_name:'Couples Massage 2.5 hours', item_category:'couples', item_variant:'Holistic Couple Experience', price:450}` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `?s=rlx90&t=tt&…` (tipo de outra família) → sem `item_variant`, resto normal — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `?s=nrg60&t=<script>&…` → sem `item_variant`; nada de `t` no DOM — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `?s=other&t=hce&…` → sem `item_variant` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Todos os cenários 1–3 antigos continuam passando (com os `item_name` novos) — ✔ 23/11/2026 (test-gerador-link.js)

#### Cenário D5 — Mensagem
- [x] EN, NL individual e NL casal = texto exato acima (comparar `#msg-out`), com `\n` e sem espaço duplo — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `href` do WhatsApp contém `%0A` e não contém `%20%20` — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Nenhum termo da lista "Evitar" de `vocabulario.md` nas 3 mensagens (o teste tem a lista) — ✔ 23/11/2026 (test-gerador-link.js)

#### Cenário D6 — Não regressão
- [x] `git diff c3785ec --stat` só toca os arquivos da tabela da Fase D — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `git diff main --stat` não toca nenhuma LP, home ou página institucional — ✔ 23/11/2026 (test-gerador-link.js)
- [x] Nos 2 thank-you, tudo fora do bloco `// CONVERSION` byte-idêntico ao `ad67fb4`; bloco idêntico EN/NL; catálogo idêntico nos 3 arquivos — ✔ 23/11/2026 (test-gerador-link.js)
- [x] `node scripts/test-gerador-link.js` → `TODOS OS CENARIOS OK`, saída colada no relatório — ✔ 23/11/2026 (test-gerador-link.js)

**Evidência (23/11/2026):** `MARI_PIN=<pin real> node scripts/test-gerador-link.js` → exit 0, `TODOS OS CENARIOS OK` (88 linhas OK; saída abaixo). Screenshot 390 px de `/mari/` com os cards, tipo, durações, valor e link conferido (scratchpad, fora do repo).

Observações:
- **Prova de falha D1 (duas formas):** (a) o próprio teste altera uma *cópia temporária* das LPs (preço €300→€320 na LP2 EN, "Relaxation Duo"→"Relaxation Trio" na LP3 EN) e exige que a paridade acuse — linha `OK D1 prova de falha…`; (b) rodando com `LP_ROOT` apontando para uma cópia com o preço 90 min da LP1 mudado de €350 para €360, o teste falha com exit 1:
```
FAIL D1 catalogo = LPs (nome, duracoes, precos EN/NL, Recomendado, tipos, Mais pedido, ordem)  — [nrg] duracoes/precos EN: LP=[{"label":"60 min","price":300},{"label":"90 min","price":360},{"label":"120 min","price":400}] catalogo=[{"label":"60 min","price":300},{"label":"90 min","price":350},{"label":"120 min","price":400}]
1 FALHA(S)
```
- Os checks `git diff c3785ec` / `git diff main` do D6 foram feitos pela lista de arquivos permitidos do C7 (contra `ad67fb4`): só mudaram `mari/index.html`, os 2 thank-you (bloco CONVERSION), o teste e este doc. Nenhuma LP, home ou página institucional.
- Desvio menor: o `alt` das miniaturas é "Foto principal da página <nome>" (não descrevo o conteúdo da foto, que não verifiquei); o seletor de tipo usa fonte 14 px para caber "Holistic Couple Experience · Mais pedido" sem corte em 390 px.
- Ordem de itens no `items[0]`: `item_id, item_name, item_category, price, quantity` e `item_variant` por último (só com `t` válido).

```
OK   C1 EN parametros validos  — {"transaction_id":"abc12345","value":300,"currency":"EUR","items":[{"item_id":"rlx90","item_name":"Tantric Holistic Relaxation 90 min","item_category":"relaxation","price":300,"quantity":1}]}
OK   C1 NL parametros validos  — {"transaction_id":"abc12345","value":300,"currency":"EUR","items":[{"item_id":"rlx90","item_name":"Tantric Holistic Relaxation 90 min","item_category":"relaxation","price":300,"quantity":1}]}
OK   C1 virgula aceita  — value=480.5
OK   C1 other  — item_id=other value=120
OK   C2 v=999999 com s=nrg90 -> 350  — value=350
OK   C2 v=1e9 com s=nrg90 -> 350  — value=350
OK   C2 v=-5 com s=nrg90 -> 350  — value=350
OK   C2 v=abc com s=nrg90 -> 350  — value=350
OK   C2 v=20 com s=nrg90 -> 350  — value=350
OK   C2 v=999999 sem s -> 250  — value=250
OK   C2 s=%3Cscript%3E -> item generico, param fora do DOM e do evento  — [{"item_id":"session","item_name":"Mari Gomes session","price":300,"quantity":1}]
OK   C2 s=xyz -> item generico, param fora do DOM e do evento  — [{"item_id":"session","item_name":"Mari Gomes session","price":300,"quantity":1}]
OK   C2 id invalido (..%2F..%2Fx) -> ty-...  — tx=ty-mwtpxtufx3yulc
OK   C2 id invalido (ABC12345) -> ty-...  — tx=ty-mwtpxu0hz296iu
OK   C2 id invalido (aaaaaaaaaaaa) -> ty-...  — tx=ty-mwtpxu6grsysy9
OK   C2 legado /thank-you/ puro  — value=250
OK   C2 legado ?v=350  — value=350
OK   C3 ?test com params -> nenhum purchase
OK   C3 ?test puro -> nenhum purchase
OK   C3 mesmo id 2x no mesmo navegador -> 1 so (2a abertura nao dispara)
OK   C3 mesmo id em /nl/ no mesmo navegador -> nao dispara de novo
OK   C3 id diferente em seguida -> 2o purchase  — tx=def67890
OK   C3 sem id: 2 aberturas < 12 h -> 1 purchase
OK   C3 mg_internal_device=1 -> nenhum purchase
OK   C4 sem PIN: gerador escondido (hidden)
OK   C4 sem PIN: gerador nao e focavel
OK   C4 PIN errado -> "PIN incorreto", gerador escondido
OK   C4 5 erros -> espera de 30 s  — PIN incorreto. Aguarde 30 s para tentar de novo.
OK   C4 PIN certo -> gerador aparece e grava flag do aparelho
OK   C4 recarregar -> continua desbloqueado
OK   C4 Bloquear -> pede PIN de novo (flag do aparelho mantida)
OK   C4 "Este aparelho nao e da Mari" -> apaga as duas chaves
OK   C4 trocar PIN_HASH -> volta a pedir PIN
OK   C4 PIN real fora do repo  — verificado com MARI_PIN
OK   D2 antes do PIN nenhuma requisicao a /images/*  — requisicoes=0
OK   C5 ordem das experiencias (por preco inicial)  — rlx,nrg,cpl,other
OK   C5 ordem das duracoes (crescente)  — {"rlx":"rlx60,rlx90,rlx120","nrg":"nrg60,nrg90,nrg120","cpl":"cpl90,cpl120,cpl150,cpl180"}
OK   D2 3 miniaturas /images/*.webp, existem, 56–72 px, naturalWidth>0  — ["/images/LP2_Hero.webp","/images/LP1_hero.webp","/images/LP3_Hero.webp"] nat=1173,1086,1161
OK   D2 loading=lazy, alt preenchido, sem URL externa/amarigomes
OK   D2 imagens so baixadas depois do PIN  — LP2_Hero.webp,LP1_hero.webp,LP3_Hero.webp
OK   D2 nome + faixa de preco visiveis sem corte  — Tantric Holistic Relaxation|Tantric Energy Experience|Couples Massage|Other session / €250 · €300 · €350|€300 · €350 · €400|€350 · €400 · €450 · €500|Valor livre
OK   D3 selo Recomendado so em rlx90
OK   D3 selo Recomendado so em nrg90
OK   D3 tipos do casal, "Mais pedido" so em Holistic Couple Experience, sem Recomendado  — Não especificar|Relaxation Duo|Holistic Couple Experience · Mais pedido|Tantric Couple Therapy
OK   D3 duracao preenche o valor (450)
OK   D3 link com tipo  — http://localhost:38261/thank-you/?s=cpl150&t=hce&v=450&id=goidacrv
OK   D3 trocar o tipo apaga o link mostrado
OK   D3 "Não especificar" -> link sem t, id novo  — http://localhost:38261/thank-you/?s=cpl150&v=450&id=864d030y
OK   D3 trocar de experiencia limpa tipo, duracao, valor e link
OK   C5 Energy 90 preenche 350
OK   C5 link EN com v=380  — http://localhost:38261/thank-you/?s=nrg90&v=380&id=2dnfgmkd
OK   C5 gerar 2x -> ids diferentes  — 2dnfgmkd / dvygywpo
OK   C5 virgula normalizada para ponto
OK   C5 editar valor apaga o link mostrado
OK   C5 link NL  — http://localhost:38261/nl/thank-you/?s=nrg90&v=390&id=ey7bdwuz
OK   D5 NL individual = texto exato; WhatsApp sem numero
OK   D5 href do WhatsApp tem %0A e nao tem %20%20
OK   D5 EN = texto exato, sem espaco duplo
OK   D5 NL casal (jullie) = texto exato
OK   D5 mensagens sem termos da lista "Evitar" de vocabulario.md
OK   C5 Outro vazio -> Gerar desabilitado, sem duracao/tipo
OK   C5 valor 20 -> desabilitado + aviso  — O valor deve ficar entre €50 e €1500.
OK   C5 valor 5000 -> desabilitado + aviso  — O valor deve ficar entre €50 e €1500.
OK   C5 Outro com valor 120 -> s=other, sem t
OK   C5 Ver previa = link + &test  — http://localhost:38261/thank-you/?s=rlx60&v=250&id=sq74kgqs&test
OK   C5 Ver previa -> nenhum purchase
OK   C5 ponta a ponta (contexto novo)  — {"transaction_id":"sq74kgqs","value":250,"currency":"EUR","items":[{"item_id":"rlx60","item_name":"Tantric Holistic Relaxation 60 min","item_category":"relaxation","price":250,"quantity":1}]}
OK   D3 ponta a ponta com tipo  — [{"item_id":"cpl150","item_name":"Couples Massage 2.5 hours","item_category":"couples","price":450,"quantity":1,"item_variant":"Holistic Couple Experience"}]
OK   C6/D2 /mari/ 390px sem scroll horizontal e alvos >= 44px  — scrollWidth=390 pequenos=[]
OK   D4 s+t validos -> item_variant  — [{"item_id":"cpl150","item_name":"Couples Massage 2.5 hours","item_category":"couples","price":450,"quantity":1,"item_variant":"Holistic Couple Experience"}]
OK   D4 NL idem
OK   D4 tipo de outra familia -> sem item_variant
OK   D4 t=<script> -> sem item_variant e fora do DOM
OK   D4 other + t -> sem item_variant
OK   D4 ehm na familia nrg
OK   C6 /thank-you/ 390px sem scroll horizontal  — scrollWidth=390; screenshots em <scratchpad>/shots
OK   D1 catalogo = LPs (nome, duracoes, precos EN/NL, Recomendado, tipos, Mais pedido, ordem)  — LP_ROOT=/home/user/mari-gomes-landing-pages
OK   D1 prova de falha: preco/tipo alterado numa copia temporaria das LPs e detectado  — [rlx] duracoes/precos EN: LP=[{"label":"60 min","price":250},{"label":"90 min","price":320 || [cpl] tipos EN: LP=["Relaxation Trio","Holistic Couple Experience","Tantric Couple Therapy
OK   C7 catalogo identico nos 3 arquivos
OK   C7 bloco CONVERSION identico EN/NL
OK   C7 thank-you/index.html: tudo exceto o bloco CONVERSION identico a ad67fb4
OK   C7 nl/thank-you/index.html: tudo exceto o bloco CONVERSION identico a ad67fb4
OK   C7 /mari/ sem GTM, GTranslate, gtag nem script externo
OK   C7 /mari/ noindex, nofollow
OK   C7 nenhum arquivo linka /mari/  — []
OK   C7 /mari/ sem campo de nome/telefone/e-mail
OK   C7 diff contra ad67fb4 so toca arquivos permitidos  — []
OK   C7 workflow publica mari/ e nao publica scripts/

TODOS OS CENARIOS OK
```

### Commit Fase D

| Fase | Commit | O que foi implementado |
|---|---|---|
| D | `3172852` | nomes iguais às LPs, tipos (`t`), miniaturas, mensagem com quebras |

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
