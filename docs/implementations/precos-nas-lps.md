# Preços visíveis nas 3 LPs (versão v2 provisória)

**Status:** Fases 0–3 concluídas (27/09/2026) — 6 páginas v2 prontas, aguardando push + aprovação da Mary (Fase 4).

---

## Motivação

A Mari pediu (27/09/2026) para as landing pages do anúncio mostrarem preços. Hoje
as 6 LPs só dizem "personalised quote via WhatsApp", ao contrário da página
`/prices/` do site institucional — quem chega pelo Google Ads não vê valor nenhum e
chama no WhatsApp sem saber quanto custa, gerando lead desqualificado.

Como as LPs estão com tráfego pago ativo e a Mari ainda não viu a proposta, o
Daniel pediu uma **versão v2 provisória** de cada página, em paralelo, para ser
promovida a principal só depois da aprovação dela.

---

## Problemas Identificados (estado anterior)

1. **Nenhum preço nas LPs.** FAQ "How does pricing work?" (as 3 LPs), hero note
   "Quote via WhatsApp" e CTAs "Request your quote" empurram tudo pro WhatsApp.
2. **LP3: promessa de simultaneidade × tabela.** O FAQ da LP3 diz "both partners
   receive their massage simultaneously", mas pela tabela a sessão simultânea é a
   opção com 2 terapeutas (€600/€750); o "Couple ritual" de €420+ não diz se é
   simultâneo. Pendência #11 em `docs/pendencias-mary.md`.

---

## Abordagem

Fonte dos valores: `docs/texto-do-site/Prices.txt`, que é idêntico à tabela da
`tantrana.nl/prices/` (conferido em 27/09/2026) — a Mary já tinha autorizado copiar
os preços da referência (ver pendência resolvida "Preços reais" em
`docs/pendencias-mary.md`). Mapeamento serviço da LP → linha da tabela, o mesmo já
usado em `prices/index.html`:

| LP | Preços exibidos |
|---|---|
| LP1 Holistic Energy | 60 min €300 · 90 min €350 (recomendado) · 120 min €400 · estendidas 2,5h €450 / 3h €500 |
| LP2 Relaxation | 60 min €300 · 90 min €350 (recomendado) · 120 min €400 |
| LP3 Couples | 2h €420 · 2,5h €470 · 3h €520 · 4h €600 · com 2 terapeutas (simultâneo) 90 min €600 / 120 min €750 |

Em todas: nota da sobretaxa após 21:00 (+€100 60 min / +€150 90 min+) e pagamento
(cartão, dinheiro, BTC). Nas LPs o rótulo usa o nome do serviço anunciado, **não**
"Tantra massage" (política de conteúdo adulto do Ads, pendência #8).

```
<slug>-v2/index.html  (cópia da LP atual + mudanças abaixo)
  ├─ <meta name="robots" content="noindex, nofollow">   (não indexar a prévia)
  ├─ conversão do Ads travada quando o path contém "-v2/" (testes não contam)
  ├─ seção nova #pricing (paleta/fontes da própria LP) + link "Prices/Prijzen" no nav
  ├─ FAQ de preço reescrito com os valores
  └─ hero note / CTA final: "From €300" em vez de "Quote via WhatsApp"
```

Descartado: editar as LPs atuais direto — estão com Ads ativo e a Mari ainda não
aprovou. Descartado: preço diferente por card na LP3 — a tabela não diferencia
Relaxation Duo / Holistic / Tantric, então os cards mostram "From €420".

Promoção (Fase 4, depois do OK da Mary): copiar `<slug>-v2/index.html` por cima de
`<slug>/index.html` e das cópias legadas `lp*-*.html` na raiz, remover o `noindex`
e a trava `-v2`, apagar as pastas `-v2`.

---

## Plano de Implementação

### Fase 0 — Documentação

| Arquivo | O que muda |
|---|---|
| `docs/implementations/precos-nas-lps.md` | Este arquivo |
| `docs/implementations/README.md` | Implementação ativa listada |
| `docs/pendencias-mary.md` | Pendência #11 (aprovar v2 + dúvida da LP3) |

| # | Commit | O que foi implementado |
|---|---|---|
| 0 | `d931460` | este arquivo + README + pendência #11 |

### Fase 1 — LP1 v2

| Arquivo | O que muda |
|---|---|
| `holistic-energy-massage-en-v2/index.html` | Nova (cópia + preços) |
| `holistic-energy-massage-nl-v2/index.html` | Nova (espelhada) |

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `4ea1092` | seção #pricing 60/90/120 + estendidas, nav, FAQ, hero note, CTA final |
| 1b | `a420ec6` | (junto com a Fase 2) texto pré-preenchido do WhatsApp do CTA final da NL sem "offerte" |

### Fase 2 — LP2 v2

| Arquivo | O que muda |
|---|---|
| `relaxation-massage-en-v2/index.html` | Nova (cópia + preços) |
| `relaxation-massage-nl-v2/index.html` | Nova (espelhada) |

| # | Commit | O que foi implementado |
|---|---|---|
| 2 | `a420ec6` | seção #pricing 60/90/120 (antes do About), nav, FAQ, passo 1 do "How it works", CTAs e textos do WhatsApp sem "quote" |

### Fase 3 — LP3 v2

| Arquivo | O que muda |
|---|---|
| `couples-massage-en-v2/index.html` | Nova (cópia + preços + FAQ de simultaneidade) |
| `couples-massage-nl-v2/index.html` | Nova (espelhada) |

| # | Commit | O que foi implementado |
|---|---|---|
| 3 | `a83ba6c` | "From €420 for two" nos 3 cards, seção #pricing (1 terapeuta × 2 terapeutas), nav, 3 FAQs, CTAs e WhatsApp sem "quote" |

**Ainda diz "at the same time" (não alterado, depende da resposta da Mary):** a
faixa de promessa ("Experience the session together, in the same space, at the
same time") e o card "Stress" da seção For whom. Se a Mary disser que o pacote
de 1 terapeuta não é simultâneo, ajustar esses dois textos na Fase 4.

### Relatório das Fases 1–3 — o que mudou na prática

**Antes:** nenhuma LP mostrava preço; todas mandavam o visitante pedir orçamento no WhatsApp.
**Agora:** existem 6 cópias novas das LPs (endereços terminados em `-v2/`) com
uma seção de preços no estilo de cada página, o preço inicial já no topo ("From
€300" / "From €420 for two"), FAQ de preço com os valores e botões "Book" em vez
de "Request a quote". As páginas que recebem o anúncio continuam exatamente como
estavam. As cópias não aparecem no Google e cliques nelas não contam como conversão.
**Para validar:** Cenários 1–2 (feitos localmente); Cenário 3 com a Mary após o push.

Gerado com scripts Python de substituição exata (falham se algum trecho não
bater), mantidos fora do repositório; a verificação usou Playwright + Chrome.

### Fase 4 — Promoção (só após aprovação da Mary)

| Arquivo | O que muda |
|---|---|
| 6 `<slug>/index.html` + 6 `lp*-*.html` legados | Recebem o conteúdo da v2, sem `noindex`/trava |
| 6 pastas `*-v2/` | Removidas |

---

## Checks de Validação

### Cenário 1 — v2 renderiza com preços (desktop e mobile)
- [x] Abrir as 6 v2 no navegador
- [x] Seção de preços aparece com a identidade visual da LP; link "Prices/Prijzen" no nav aponta pra `#pricing`
- [x] Em mobile (≤768px) os cards viram 1 coluna, sem scroll horizontal
- **Validado em:** 27/09/2026 — servidor local + Playwright/Chrome, screenshots da `#pricing` em 1400px e 390px nas 6 páginas, overflow horizontal 0px

### Cenário 2 — Prévia não afeta Ads/SEO
- [x] `<meta name="robots" content="noindex, nofollow">` presente nas 6 v2
- [x] Clique no WhatsApp na v2 não dispara o evento `conversion` (conferir no Network/console)
- [x] LPs atuais (`<slug>/index.html`) inalteradas (`git diff` vazio nelas)
- **Validado em:** 27/09/2026 — `dataLayer` após clique: 0 eventos `conversion` nas 6 v2, 1 evento nas 6 originais; `git diff d931460 HEAD` nas pastas originais e nos `lp*-*.html` vazio

### Cenário 3 — Mary aprova
- [ ] Mary revisou as 6 v2 e aprovou valores e textos (pendência #11)
- [ ] Resposta sobre simultaneidade no pacote de casal aplicada na LP3

### Cenário 4 — Promoção no ar
- [ ] Após a Fase 4 + push, as 6 URLs atuais mostram os preços em `amarigomes.com`
- [ ] Conversão do WhatsApp volta a disparar nas URLs principais

---

## Ajustes Possíveis Pós-Implementação

- Acompanhar volume de conversões e CPA da campanha nas 2–3 semanas após a promoção:
  queda de volume é esperada (é o filtro), mas a campanha usa "Maximizar conversões".
- LP2 (Relaxation) é a mais sensível ao nível de preço (€300/h) — se a taxa de
  conversão despencar, avaliar com a Mary.
