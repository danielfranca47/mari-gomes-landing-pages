# Preços visíveis nas 3 LPs (versão v2 provisória)

**Status:** Fases 0–3, 5 e 6 concluídas (27/09/2026) — 6 páginas v2 com os valores da Mari, aguardando push + aprovação final (Fase 4).

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
2. **LP3: promessa de simultaneidade.** O FAQ da LP3 diz "both partners receive
   their massage simultaneously", mas a Mari atende sozinha (não há opção com 2
   terapeutas). Como funciona a sessão de casal com 1 terapeuta está na pendência
   #11 em `docs/pendencias-mary.md`.
3. **Serviços com 2ª terapeuta no site institucional.** 4 mãos e "Couple Ritual
   with 2 Therapists" (e a frase "me and my colleague therapists") vinham do texto
   da Tantrana; a Mari não oferece.

---

## Abordagem

Fonte dos valores: tabela enviada pela Mari via Daniel em 27/09/2026 (substituiu a
primeira versão, que usava `Prices.txt` = tabela da tantrana.nl). O Daniel escolheu
aplicar os preços pelo **nome** do serviço, não pelo número da LP, e renomear as
páginas 1 e 2:

| Página (pasta) | Nome do serviço | Preços exibidos |
|---|---|---|
| `holistic-energy-massage-*` | Tantric Energy Experience | 60 min €300 · 90 min €350 (recomendado) · 120 min €400 |
| `relaxation-massage-*` | Tantric Holistic Relaxation | 60 min €250 · 90 min €300 (recomendado) · 120 min €350 |
| `couples-massage-*` | (nome mantido) | 90 min €350 · 2h €400 · 2,5h €450 · 3h €500 — para o casal |

Em todas: horário 9:00–19:00 (a Mari não atende fora disso, então não há sobretaxa
noturna), taxa de deslocamento de €50 para casa/hotel em Amsterdã e pagamento
(cartão, dinheiro, BTC). O nome novo entra no `<title>`, no rótulo do hero, no
rótulo da seção de preços e no texto pré-preenchido do WhatsApp; os títulos (h1)
continuam os mesmos. **Risco aceito pelo Daniel:** "Tantric" em página de anúncio
aumenta o risco de política de conteúdo adulto do Google Ads (pendência #8).

```
<slug>-v2/index.html  (cópia da LP atual + mudanças abaixo)
  ├─ <meta name="robots" content="noindex, nofollow">   (não indexar a prévia)
  ├─ conversão do Ads travada quando o path contém "-v2/" (testes não contam)
  ├─ seção nova #pricing (paleta/fontes da própria LP) + link "Prices/Prijzen" no nav
  ├─ FAQ de preço reescrito com os valores
  ├─ hero note / CTA final: "From €…" em vez de "Quote via WhatsApp"
  └─ FAQ "onde": estúdio + visita em casa/hotel (+€50)
```

Descartado: editar as LPs atuais direto — estão com Ads ativo e a Mari ainda não
aprovou. Descartado: preço diferente por card na LP3 — a tabela não diferencia
Relaxation Duo / Holistic / Tantric, então os cards mostram "From €350".

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

### Fase 5 — Valores corrigidos pela Mari (27/09/2026)

**Objetivo:** trocar a tabela da Tantrana pelos valores reais da Mari e renomear as páginas 1 e 2.

| Arquivo | O que muda |
|---|---|
| `holistic-energy-massage-{en,nl}-v2/index.html` | "Tantric Energy Experience", €300/350/400, sem sessões de 2,5h/3h |
| `relaxation-massage-{en,nl}-v2/index.html` | "Tantric Holistic Relaxation", €250/300/350 |
| `couples-massage-{en,nl}-v2/index.html` | 90–180 min €350–€500, sem a caixa de 2 terapeutas; FAQs "1 ou 2 terapeutas" → uma (a Mari) |
| as 6 | sai a sobretaxa noturna; entram 9:00–19:00 e +€50 de deslocamento; FAQ "onde" cita casa/hotel |

| # | Commit | O que foi implementado |
|---|---|---|
| 5 | `c770df4` | 6 v2 regeneradas com os valores e nomes novos |

### Fase 6 — Remoção dos serviços com 2ª terapeuta do site institucional

| Arquivo | O que muda |
|---|---|
| `index.html`, `nl/index.html`, `home-en.html`, `home-nl.html` | card 07 "4-Hands" removido; "Me and my colleague therapists…" → "Every session is given personally by me…" (título "Personal Care") |
| `treatments/index.html`, `nl/treatments/index.html` | card 07 "4-Hands" removido (grid 3 colunas fica com 2 linhas cheias) |
| `prices/index.html`, `nl/prices/index.html` | linhas "4-Hands" e "Couple Ritual with 2 Therapists" removidas |

| # | Commit | O que foi implementado |
|---|---|---|
| 6 | `eba5632` | remoção nos 8 arquivos |

### Relatório das Fases 5–6 — o que mudou na prática

**Antes:** as v2 mostravam a tabela da Tantrana (incluindo opção com 2 terapeutas e
sobretaxa noturna) e o site institucional oferecia massagem a 4 mãos e sessões com 2 terapeutas.
**Agora:** as v2 mostram os preços que a Mari passou, com os nomes novos nas páginas
1 e 2, horário 9h–19h e taxa de deslocamento de €50. O site não oferece mais nada que
dependa de uma segunda terapeuta.
**Para validar:** Cenários 1–3.

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
- [ ] Resposta sobre como funciona a sessão de casal com 1 terapeuta aplicada na LP3
- **Parcial em 27/09/2026:** valores, nomes, horário, taxa de deslocamento e ausência de 2ª terapeuta vieram da Mari via Daniel e já estão nas v2; revalidado localmente (overflow 0, noindex, conversão travada) nas 6

### Cenário 4 — Promoção no ar
- [ ] Após a Fase 4 + push, as 6 URLs atuais mostram os preços em `amarigomes.com`
- [ ] Conversão do WhatsApp volta a disparar nas URLs principais

---

## Ajustes Possíveis Pós-Implementação

- **`/prices/` desatualizada em relação às LPs** (`prices/index.html` + `nl/`): as
  linhas "Holistic Energy Massage", "Relaxation & Stress Relief" e "Couples Massage"
  ainda mostram a tabela antiga (€300–€500 / €420–€600), e as demais linhas (Dearmouring,
  Chakra, Couple Ritual, Coaching) também são da Tantrana. Alinhar com os valores e
  nomes novos antes de promover as v2, para quem navega da LP pro site não ver dois preços.
- **Horários fora de 9:00–19:00 (otimização futura):** nota de sobretaxa "after 21:00"
  em `prices/index.html` / `nl/prices/index.html`; Workshop com sessão 17:00–22:00 em
  `workshop/index.html` / `nl/workshop/index.html` (hero e bloco de horário).
- **Taxa de deslocamento de €50 no site institucional:** Treatments/Prices ainda dizem
  que visita a hotel é "a pedido", sem valor (ver pendência #4, agora resolvida).
- **"At the same time" na LP3:** faixa de promessa e card "Stress" da seção For whom
  continuam prometendo massagem simultânea; ajustar quando a Mari explicar como é a
  sessão de casal com 1 terapeuta (pendência #11).
- **LP2, bloco About:** "All sessions take place in a private studio in Amsterdam"
  ficou em tensão com a visita a casa/hotel citada no FAQ.

- Acompanhar volume de conversões e CPA da campanha nas 2–3 semanas após a promoção:
  queda de volume é esperada (é o filtro), mas a campanha usa "Maximizar conversões".
- LP2 (Relaxation) é a mais sensível ao nível de preço (€300/h) — se a taxa de
  conversão despencar, avaliar com a Mary.
