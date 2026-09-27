# Alinhar preços, horário e deslocamento no site institucional

**Status:** Planejado — diagnóstico pronto (27/09/2026), falta Plan Mode + aprovação do plano.

> Criado a partir dos "ajustes possíveis" da implementação de preços nas LPs (já graduada — ver `CLAUDE.md`, seção "Preços nas LPs"). Antes de implementar,
> seguir o Passo 0 de `_guia-documentar-implementacao.md` (revalidar o diagnóstico abaixo
> e aprovar as fases com o Daniel). Os valores das LPs são a referência.

---

## Motivação

Em 27/09/2026 a Mari passou os preços reais dos serviços das LPs, o horário de
atendimento (só 9:00–19:00) e a taxa de deslocamento (€50). Isso já está nas 6 LPs
(`CLAUDE.md`, seção "Preços nas LPs"), mas o site institucional continua com a tabela da Tantrana, a
sobretaxa noturna e "deslocamento a pedido". Quem sai da LP e abre `/prices/` vê outro
preço pro mesmo serviço. **As LPs já estão no ar com os preços novos (27/09/2026) — esta é a próxima prioridade.**

---

## Problemas Identificados (estado atual)

1. **`/prices/` com preços antigos para os 3 serviços das LPs**
   (`prices/index.html` / `nl/prices/index.html`, tabela de sessões):

   | Linha atual | Mostra hoje | Valor da Mari (LPs) |
   |---|---|---|
   | Holistic Energy Massage | 60–180 min €300–€500 | "Tantric Energy Experience": 60/90/120 min €300/€350/€400 |
   | Relaxation & Stress Relief | 60–180 min €300–€500 | "Tantric Holistic Relaxation": 60/90/120 min €250/€300/€350 |
   | Couples Massage | 2h–4h €420–€600 | 90/120/150/180 min €350/€400/€450/€500 |

2. **Demais linhas de `/prices/` são da Tantrana**: Dearmouring, Chakra Balancing,
   Couple Tantra Massage Ritual, Coaching Tantra Massage Couple Session (€300–€500 /
   €420–€600). Sem valor confirmado pela Mari → pendência #11, pergunta 3.
3. **Sobretaxa noturna que não existe**: nota "A night fee applies for sessions
   starting after 21:00 (€100 … €150 …)" em `prices/` (+ `nl/`, "avondtoeslag").
   A Mari só atende das 9:00 às 19:00.
4. **Taxa de deslocamento sem valor**:
   - `prices/` (+ `nl/`): "Outcall to your hotel is available on request — a travel
     fee may apply depending on location."
   - `treatments/` (+ `nl/`), `.outcall-note`: "Outcall to your hotel is also available on request."
   - Valor confirmado: **€50** para casa/hotel **em Amsterdã**.
5. **Home fala em outras cidades sem valor**: `index.html` / `nl/index.html` (+ cópias
   legadas `home-en.html` / `home-nl.html`), seção My Services: "Outcall Tantra Massages
   in other locations across the Netherlands, for example Utrecht, The Hague, and
   Rotterdam". A taxa fora de Amsterdã não foi informada → pendência #12.
6. **Home no plural ("we/our")**: "No place to enjoy our tantra treatments? We are
   happy to welcome you to our studio." (Home EN, seção My Services; conferir o
   equivalente NL). A Mari atende sozinha.

---

## Abordagem proposta

- `/prices/`: substituir as 3 linhas pelos nomes/valores das LPs (mesmo nome e mesma
  duração exibidos na LP correspondente); manter as demais linhas até a resposta da
  pendência #11-3 (ou ocultá-las, se o Daniel preferir — decidir no Plan Mode).
- Trocar a nota noturna por "Sessions between 9:00 and 19:00".
- Trocar "on request / may apply" por "+€50 travel fee within Amsterdam" em Prices e
  Treatments; na Home, manter as outras cidades só se a pendência #12 for respondida.
- Ajustar "we/our" para primeira pessoa do singular.
- Lembrar: qualquer mudança na Home vai em `index.html` **e** `home-en.html` (idem NL).
- Decisão a tomar no Plan Mode: usar "Tantric …" também no `/prices/` (o site
  institucional não recebe Ads hoje, então o risco da pendência #8 é menor aqui).

## Fases sugeridas

| Fase | Arquivos | O que muda |
|---|---|---|
| 1 | `prices/index.html`, `nl/prices/index.html` | 3 linhas das LPs, nota de horário, taxa €50 |
| 2 | `treatments/index.html`, `nl/treatments/index.html` | nota de outcall com €50 |
| 3 | `index.html`, `nl/index.html`, `home-en.html`, `home-nl.html` | "we/our" → singular; outras cidades conforme pendência #12 |
| 4 | idem Fase 1 | demais linhas do `/prices/` após resposta da pendência #11-3 |

---

## Checks de Validação (propostos)

### Cenário 1 — Mesmo preço na LP e no site
- [ ] Para cada LP, o valor e a duração na seção `#pricing` batem com a linha correspondente de `/prices/` (EN e NL)

### Cenário 2 — Horário e deslocamento coerentes
- [ ] Nenhuma menção a sessão após 19:00 ou sobretaxa noturna em Prices/Treatments/Home
- [ ] Taxa de €50 aparece em Prices e Treatments (EN/NL)

### Cenário 3 — Home publicada
- [ ] Mudanças presentes em `index.html` / `nl/index.html` (não só nas cópias legadas)

---

## Pendências relacionadas

- #11 (pergunta 3): valores das demais linhas do `/prices/`
- #12: taxa de deslocamento fora de Amsterdã
- #8: risco de "Tantric" no Google Ads
