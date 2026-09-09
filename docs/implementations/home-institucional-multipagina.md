# Home Institucional — Reestruturação Multi-página (referência tantrana.nl)

**Status:** Em andamento

---

## Motivação

A Mary indicou `tantrana.nl` (concorrente direto) como referência de estrutura de
conteúdo para o site institucional. Via WhatsApp com o Daniel, confirmou: oferece
todos os serviços listados em `tantrana.nl/massage-service/`, quer preços visíveis
no site, faz deslocamento pra hotel em Amsterdã, e também faz workshop (formato
ainda não confirmado). Pedido: reestruturar a home de página única pra multi-página,
com aparência própria mais sofisticada (não copiar o visual da referência, só a
estrutura e o tom de marca).

Plano completo aprovado em Plan Mode (2026-09-09), salvo em
`C:\Users\Daniel França\.claude\plans\misty-growing-melody.md`.

**Escopo:** só `home-en.html`/`home-nl.html` e as páginas novas derivadas dela. **As
6 LPs de campanha não são tocadas** (regra do `CLAUDE.md`). A migração de hospedagem
(`docs/hospedagem-github-pages-cloudflare.md`, Fase C concluída) segue independente
— as páginas novas já nascem na convenção de pasta+`index.html` estabelecida lá.

Trabalho anterior sobre a home (página única, Fases 1-7.1) documentado em
[`site-institucional-home.md`](site-institucional-home.md) — não reescrito, só
superado por esta reestruturação.

---

## Decisões confirmadas com o usuário

- **Booking:** WhatsApp apenas, sem formulário online.
- **Blog:** fora de escopo por agora.
- **Deslocamento/outcall:** só uma linha de info dentro de Treatments/Prices/FAQ,
  não uma página dedicada "Fly Me In" (só hotel em Amsterdã foi confirmado, não
  atendimento internacional).

## Sitemap

| Página | URL EN | URL NL | Status |
|---|---|---|---|
| Home (hub) | `/` | `/nl/` | Existente, nav atualizado |
| About Mari | `/about/` | `/nl/about/` | Nova |
| Treatments | `/treatments/` | `/nl/treatments/` | Nova |
| Prices | `/prices/` | `/nl/prices/` | Nova |
| Workshop | `/workshop/` | `/nl/workshop/` | Nova |
| Reviews, FAQ, Location | `/#testimonials` etc. | idem | Continuam como seções da home |

Nav (todas as páginas): About · Treatments · Prices · Workshop · Reviews · FAQ ·
Location.

## Convenções técnicas

- Páginas novas são autocontidas (HTML+CSS+JS inline), reaproveitando a 4ª
  identidade visual da home (Fraunces + Manrope, paleta âmbar/parchment/ink) — sem
  paleta nova.
- Cada página copia nav/footer/cookie-banner/scripts (mesmo padrão das 6 LPs).
- **Caminhos absolutos** (`/images/...`, `/about/`, etc.) em vez de relativos —
  evita o problema de profundidade `/about/` (1 nível) vs `/nl/about/` (2 níveis).
- Páginas novas vão direto pro caminho final de pasta (sem arquivo raiz duplicado
  como o padrão da Fase C da migração, que era específico pra preservar arquivos
  pré-existentes).
- Serviços com LP de campanha própria (Holistic Energy, Relaxation, Couples)
  continuam linkando pra LP; os demais linkam pro WhatsApp.

## Pendências pra Mary (→ `docs/pendencias-mary.md`)

1. Nomes/descrições reais dos tratamentos oferecidos.
2. Preços reais por duração/tipo de sessão.
3. Formato do workshop (igual à referência ou diferente?).
4. Taxa de deslocamento pra hotel, se houver.

---

## Plano de Implementação

### Fase 1 — Esqueleto das 4 páginas novas + nav atualizado

**Objetivo:** ter as 8 páginas novas (4 × EN/NL) abrindo com head/tracking/nav/
footer/cookie-banner completos e um placeholder de conteúdo, e o nav da home
apontando pra elas.

| Arquivo | O que muda |
|---|---|
| `about/index.html`, `nl/about/index.html` | Novo — esqueleto (head/nav/footer/cookie-banner/scripts) + page-hero + placeholder |
| `treatments/index.html`, `nl/treatments/index.html` | Idem |
| `prices/index.html`, `nl/prices/index.html` | Idem |
| `workshop/index.html`, `nl/workshop/index.html` | Idem |
| `home-en.html`, `home-nl.html` | Nav: `#about`/`#services` → `/about/`, `/treatments/`, `/prices/`, `/workshop/` (7 itens); `.nav-menu` CSS com gap/letter-spacing menores pra caber |
| `index.html`, `nl/index.html` | Recopiados a partir dos arquivos acima (mesmo padrão da Fase C) |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `2cc7f54` | esqueleto das 4 páginas novas (EN/NL) + nav atualizado na home |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** a home era a única página institucional; nav linkava só pra seções da
própria home (About/Services/Reviews/FAQ/Location).
**Agora:** existem 4 páginas novas (About, Treatments, Prices, Workshop, cada uma
EN+NL) com a mesma identidade visual da home, ainda com conteúdo placeholder. O nav
da home e das páginas novas tem 7 itens: as 4 primeiras levam pras páginas novas,
as 3 últimas (Reviews/FAQ/Location) continuam como seções da home.
**Para validar:** Cenário 1, abaixo.

**Nota técnica:** como as páginas novas usam caminhos absolutos (`/about/` etc.),
não dá pra clicar entre elas testando via `file://` direto (cada `file://` é uma
origem isolada, e caminho absoluto resolve contra a raiz do disco, não do projeto).
Validado servindo os arquivos com `python -m http.server` localmente — nesse caso a
navegação real entre páginas e o cookie-consent persistindo via `localStorage`
funcionaram corretamente. Isso é uma limitação só do teste local; em produção
(`https://amarigomes.com`) os caminhos absolutos resolvem certo.

---

## Checks de Validação

### Cenário 1 — Esqueleto renderiza, nav funciona, responsivo
- [x] Servir o projeto localmente (`python -m http.server`) e abrir `/`, `/about/`,
      `/treatments/`, `/prices/`, `/workshop/` (e os 4 `/nl/...` equivalentes)
- [x] Confirmar: nav com 7 itens cabe sem quebrar (desktop 1440px)
- [x] Clicar nos itens do nav e confirmar navegação real entre páginas
- [x] Confirmar cookie-banner aparece, "Accept" esconde, e o estado persiste ao
      navegar pra outra página (mesma origem)
- [x] Redimensionar pra mobile (~390px) e confirmar nav some, layout não quebra
- **Validado em:** 2026-09-09 — via Chrome DevTools MCP + servidor HTTP local,
      EN e NL, desktop (1440px) e mobile (390px), sem erros de console reais (só o
      aviso benigno de CORB do GTranslate, que desaparece em produção por virar
      mesma origem).

### Fase 2 — About Mari

| Arquivo | O que muda |
|---|---|
| `about/index.html`, `nl/about/index.html` | Bio expandida (4 parágrafos, COPY DRAFT) + CTA WhatsApp |
| `home-en.html`, `home-nl.html` | `#about` trimado pra teaser curto + link "Read my full story →" / "Lees mijn volledige verhaal →" |
| `index.html`, `nl/index.html` | Recopiados |

### Commits Fase 2

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `04416ca` | conteúdo da página About + teaser trimado na home |

### Fase 3 — Treatments

| Arquivo | O que muda |
|---|---|
| `treatments/index.html`, `nl/treatments/index.html` | 6 cards (3 já existentes linkando pras LPs + 3 novos, COPY DRAFT, linkando pro WhatsApp) + nota de deslocamento + CTA |

### Commits Fase 3

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `dec77db` | conteúdo da página Treatments |

### Fase 4 — Prices

| Arquivo | O que muda |
|---|---|
| `prices/index.html`, `nl/prices/index.html` | Tabela de 7 itens (6 tratamentos + link workshop), duração, "On request"/"Op aanvraag" clicável (WhatsApp) em vez de preço inventado (PRICE DRAFT) |

### Commits Fase 4

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `4f23fbb` | conteúdo da página Prices |
| 2 | `e993216` | preços reais copiados da tantrana.nl, a pedido explícito da Mary — ver pendência resolvida em `docs/pendencias-mary.md` |

### Fase 5 — Workshop

| Arquivo | O que muda |
|---|---|
| `workshop/index.html`, `nl/workshop/index.html` | Intro + 4 pontos do que é ensinado (genérico, sem técnicas específicas não confirmadas) + nota COPY DRAFT sobre formato/data/preço + CTA |

### Commits Fase 5

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `3527e4e` | conteúdo da página Workshop |

### Relatório das Fases 2-5 — o que mudou na prática

**Antes:** as 4 páginas novas tinham só esqueleto (nav/footer/tracking) e um
placeholder "content is being drafted".
**Agora:** as 4 têm conteúdo real (About: bio expandida; Treatments: 6 tratamentos;
Prices: tabela com 7 itens; Workshop: o que é ensinado + como perguntar por
data/preço). Nada foi inventado onde a Mary não confirmou — preços e formato do
workshop usam CTA de WhatsApp em vez de números/datas fictícios, e os 3 tratamentos
novos (Tension Release, Chakra & Energy Balancing, Tantra Coaching) estão marcados
`COPY DRAFT` pra ela revisar nome/descrição. A home ganhou um teaser mais curto de
"About" com link pra página cheia.
**Para validar:** Cenário 2, abaixo.

### Fase 6 — QA, responsivo, pendências

**Objetivo:** revisão cruzada de todos os links, responsivo em todas as páginas
novas, e registro formal das pendências de conteúdo pra Mary.

### Commits Fase 6

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `5f2011c` | QA final + atualização de docs/pendencias-mary.md |

### Relatório da Fase 6 — o que mudou na prática

**Antes:** conteúdo das 4 páginas novas ainda não tinha sido testado em conjunto
(links cruzados, todas as 10 URLs, mobile em todas).
**Agora:** as 10 páginas (home + 4 páginas × EN/NL) foram testadas servidas
localmente — todas retornam 200, sem scroll horizontal em mobile (390px), sem erros
de console reais, e os links cruzados (Prices → Workshop, Treatments → LPs, home →
About) resolvem certo. `docs/pendencias-mary.md` recebeu 4 itens novos: nomes/
descrições dos 3 tratamentos novos, preços reais, formato do workshop, e taxa de
deslocamento — cada um com a pergunta exata a mandar pra Mary.
**Para validar:** Cenário 2, abaixo.

---

### Cenário 2 — Conteúdo, links cruzados e QA final (Fases 2-6)
- [x] Abrir as 10 páginas (home + about/treatments/prices/workshop × EN/NL) servidas
      localmente e confirmar todas retornam 200
- [x] Home → About: clicar "Read my full story" / "Lees mijn volledige verhaal" e
      confirmar que abre a página certa
- [x] Treatments → LPs: os 3 primeiros cards linkam pra LP1/LP2/LP3 no idioma certo
- [x] Prices → Workshop: o link "Details" na última linha da tabela abre a página
      de workshop
- [x] Nenhum preço ou dado factual inventado — preços e formato do workshop usam
      CTA de WhatsApp, não número/data fictícios
- [x] Redimensionar pra mobile (390px) em todas as 10 páginas e confirmar
      `scrollWidth === clientWidth` (sem scroll horizontal)
- [x] `docs/pendencias-mary.md` atualizado com os 4 itens novos
- **Validado em:** 2026-09-09 — via Chrome DevTools MCP + servidor HTTP local, EN e
      NL, desktop e mobile, sem erros de console reais.

---

## Ajustes Possíveis Pós-Implementação

Fora do escopo desta fase: conteúdo real de cada página (Fases 2-5), Reviews/Blog/
Fly-Me-In como páginas dedicadas (decisão já tomada de não fazer por agora).
