# Revisão de Conteúdo — Textos Reais da Mary (Home, Treatments, Prices, Workshop, Fly Me In)

**Status:** Todos os cenários validados (2026-09-12)

---

## Motivação

A Mary reclamou que o conteúdo do site institucional está raso. Ela mandou os
textos exatos que quer usar, salvos em `docs/texto-do-site/` (`home.txt`,
`treatments.txt`, `workshop.txt`, `Prices.txt`, `book.txt`,
`fly-me-in-service.txt`). Pedido explícito: usar o texto dela **exatamente
como enviado**, não parafrasear.

Isso resolve várias pendências abertas em `docs/pendencias-mary.md` (nomes
reais dos tratamentos, formato/preço do workshop, formas de pagamento,
serviços 4-Hands e 2-terapeutas) que antes dependiam de confirmação dela —
os textos novos SÃO essa confirmação.

## Decisões tomadas com o usuário antes da implementação

1. **Contato:** o WhatsApp `0031 645 28 2608` e e-mail `bookings@tantrana.nl`
   nos textos são resíduo de terem copiado do site de referência
   (`tantrana.nl`) — mantém-se o contato real já estabelecido
   (`+31 634 366 008` / `marycontato@gmail.com`) em todo lugar.
2. **Tom do conteúdo:** manter o texto da Mary fiel, mesmo mais explícito
   (outcall pra hotel, lingam/yoni, sobretaxa noturna) — remover/ajustar o
   disclaimer "not a sexual or escort service" só onde ficar diretamente
   contraditório. Risco de política de conteúdo adulto do Google Ads
   registrado como pendência separada (conta de Ads ativa nas 6 LPs).
3. **book.txt** (formulário de agendamento + Google Agenda) fica fora de
   escopo — feature nova, não atualização de texto.
4. **Reviews.txt** foi deletado pelo usuário nesta sessão (continha
   testemunhos extraídos de `tantrana.nl/tantra-reviews/`) — tratado como
   fora de escopo.

Plano completo aprovado registrado em
`C:\Users\Daniel França\.claude\plans\jazzy-jingling-nebula.md`.

---

## Plano de Implementação

### Fase 1 — Home (`home-en.html`, `home-nl.html`)
Expandir About com a narrativa real da Mary, adicionar seção "My Services"
(Outcall/Incall) e seção educativa "What is Tantra Massage", stats de
confiança (placeholder — números não fornecidos), testemunho novo (Tim,
USA), ajustar disclaimer sexual/escort contraditório.

### Fase 2 — Treatments (`treatments/index.html`, `nl/treatments/index.html`)
Renomear os 3 cards `COPY DRAFT` pros nomes exatos da Mary + adicionar card
"4-Hands Tantra Massage". Remover comentários `COPY DRAFT` resolvidos.

### Fase 3 — Prices (`prices/index.html`, `nl/prices/index.html`)
Reestruturar tabela pro agrupamento exato de `Prices.txt`, adicionar linhas
novas (4-Hands, 2 terapeutas), formas de pagamento, recomendação de duração.

### Fase 4 — Workshop (`workshop/index.html`, `nl/workshop/index.html`)
Reescrita completa: datas/preços reais, currículo manhã/noite, o que levar,
pra quem é, o que está incluso, FAQ própria, contato real.

### Fase 5 — Fly Me In (página nova: `fly-me-in/index.html`, `nl/fly-me-in/index.html`)
Página nova seguindo template visual das outras páginas institucionais.
Link novo "Fly Me In" no nav-menu das 10 páginas existentes (EN+NL).

### Fase 6 — QA + pendências
Validação visual das 12 páginas (6 existentes + 1 nova × EN/NL), atualizar
`docs/pendencias-mary.md` com pendências novas e marcar as resolvidas.

---

## Commits

| Fase | Commit | O que foi implementado |
|---|---|---|
| 1 | `a2bbcea` | conteúdo real da Mary na Home (About, My Services, Tantra Massage) EN+NL |
| 2 | `b3e29e2` | nomes reais dos 3 tratamentos + card novo 4-Hands Tantra Massage (EN+NL) |
| 3 | `68f279f` | preços reais (10 linhas, 2 novas: 4-Hands e 2 terapeutas) + pagamento (EN+NL) |
| 4 | `1539ce1` | reescrita completa do Workshop com datas/preços/currículo reais (EN+NL) |
| 5 | `b1dd049` | página Fly Me In nova (EN+NL) + link no nav das 10 páginas + correção de mirroring (index.html/nl/index.html não estavam sincronizados com a Fase 1) |
| 6 | _(pendente)_ | |

---

## Checks de Validação

### Cenário 1 — Home renderiza com conteúdo novo
- [x] Abrir `home-en.html` e `home-nl.html`, conferir novas seções, sem quebra de layout
- [x] Mobile ~390px sem scroll horizontal
- [x] Console sem erros novos
- **Validado em:** 2026-09-12 — via Chrome DevTools MCP + servidor HTTP local
      (`python -m http.server`), EN e NL, desktop 1440px e mobile 390px.
      Único console message é o CORB do GTranslate, já documentado como benigno.
      DOM confirmado sem duplicação (1 `.hero`, 11 `<section>`).

### Cenário 2 — Treatments com nomes reais
- [x] Abrir `treatments/index.html` e `nl/treatments/index.html`
- [x] Confirmar 8 cards (3 LP + 5 reais: Dearmouring, Chakra Balancing, Couple
      Ritual, Coaching Couple Session, 4-Hands)
- **Validado em:** 2026-09-12 — Chrome DevTools MCP, EN e NL, desktop 1440px
      e mobile 390px (EN, sem scroll horizontal). 8 `.service-card` confirmados
      via DOM nas duas páginas. Console só com o CORB benigno do GTranslate.

### Cenário 3 — Prices reestruturado
- [x] Abrir `prices/index.html` e `nl/prices/index.html`
- [x] Conferir números batendo exatamente com `Prices.txt`
- [x] Mobile: tabela legível
- **Validado em:** 2026-09-12 — Chrome DevTools MCP, EN e NL, desktop 1440px
      e mobile 390px (EN). 10 linhas confirmadas via DOM nas duas páginas,
      sem scroll horizontal, console só com o CORB benigno.

### Cenário 4 — Workshop reescrito
- [x] Abrir `workshop/index.html` e `nl/workshop/index.html`
- [x] Conferir datas/preços/currículo batendo com `workshop.txt`
- [x] Contato real (não tantrana.nl)
- **Validado em:** 2026-09-12 — Chrome DevTools MCP, EN e NL, desktop 1440px
      e mobile 390px (sem scroll horizontal). FAQ accordion testado (abre/
      fecha corretamente). Contato no footer e nos CTAs confirmado como
      +31 634 366 008 / marycontato@gmail.com nas duas páginas. Console só
      com o CORB benigno.

### Cenário 5 — Fly Me In nova página
- [x] Abrir `fly-me-in/index.html` e `nl/fly-me-in/index.html`
- [x] Nav das 10 páginas existentes com link novo
- [x] `data-gt-widget-id` únicos (não reaproveitados)
- **Validado em:** 2026-09-12 — Chrome DevTools MCP, EN e NL, desktop 1440px
      e mobile 390px (sem scroll horizontal). 4 cards de oferta, 4 cards de
      preço e 11 itens de FAQ confirmados via DOM nas duas páginas. Nav
      verificado via snapshot em `about/index.html` — link "Fly Me In"
      aparece na posição certa, entre Workshop e Reviews. IDs GTranslate
      92847561 (EN) e 15937284 (NL) conferidos como não usados em nenhuma
      outra página. **Também corrigido nesta fase:** `index.html` e
      `nl/index.html` (arquivos realmente publicados pelo GitHub Pages na
      raiz do domínio — a Fase 1 só tinha tocado `home-en.html`/`home-nl.html`,
      que são cópias legadas) receberam o mesmo conteúdo novo da Home.

### Cenário 6 — QA final
- [x] 12 páginas sem erro de console
- [x] `docs/pendencias-mary.md` atualizado
- **Validado em:** 2026-09-12 — Chrome DevTools MCP em todas as páginas
      tocadas nesta implementação (`index.html`, `nl/index.html`,
      `home-en.html`, `about/index.html`, `nl/about/index.html`,
      `treatments/index.html`, `nl/treatments/index.html`,
      `prices/index.html`, `nl/prices/index.html`, `workshop/index.html`,
      `nl/workshop/index.html`, `fly-me-in/index.html`,
      `nl/fly-me-in/index.html`). Único console message em todas: o CORB
      benigno do GTranslate já documentado no projeto. `docs/pendencias-mary.md`
      atualizado com 4 pendências novas (#6 regiões Fly Me In, #7 números da
      Home, #8 risco Google Ads, #9 book.txt) e 3 marcadas como resolvidas
      (#2 nomes dos tratamentos, #3 formato do workshop, 4b/4c pagamento e
      serviços novos).

---

## Ajustes Possíveis Pós-Implementação

- Confirmar com a Mary os números de anos de experiência/estudo e clientes
  satisfeitos (placeholder no momento).
- Confirmar se o tom mais explícito do conteúdo novo é aceitável junto ao
  Google Ads, ou se prefere suavizar antes de rodar mais campanha.
