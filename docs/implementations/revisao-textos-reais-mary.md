# Revisão de Conteúdo — Textos Reais da Mary (Home, Treatments, Prices, Workshop, Fly Me In)

**Status:** Em andamento

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
| 2 | _(pendente)_ | |
| 3 | _(pendente)_ | |
| 4 | _(pendente)_ | |
| 5 | _(pendente)_ | |
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
- [ ] Abrir `treatments/index.html` e `nl/treatments/index.html`
- [ ] Confirmar 7 cards (3 LP + 3 renomeados + 4-Hands novo)

### Cenário 3 — Prices reestruturado
- [ ] Abrir `prices/index.html` e `nl/prices/index.html`
- [ ] Conferir números batendo exatamente com `Prices.txt`
- [ ] Mobile: tabela legível

### Cenário 4 — Workshop reescrito
- [ ] Abrir `workshop/index.html` e `nl/workshop/index.html`
- [ ] Conferir datas/preços/currículo batendo com `workshop.txt`
- [ ] Contato real (não tantrana.nl)

### Cenário 5 — Fly Me In nova página
- [ ] Abrir `fly-me-in/index.html` e `nl/fly-me-in/index.html`
- [ ] Nav das 10 páginas existentes com link novo
- [ ] `data-gt-widget-id` únicos (não reaproveitados)

### Cenário 6 — QA final
- [ ] 12 páginas sem erro de console
- [ ] `docs/pendencias-mary.md` atualizado

---

## Ajustes Possíveis Pós-Implementação

- Confirmar com a Mary os números de anos de experiência/estudo e clientes
  satisfeitos (placeholder no momento).
- Confirmar se o tom mais explícito do conteúdo novo é aceitável junto ao
  Google Ads, ou se prefere suavizar antes de rodar mais campanha.
