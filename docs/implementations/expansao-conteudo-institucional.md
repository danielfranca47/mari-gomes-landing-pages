# Expansão de Conteúdo — About, Prices e Workshop (referência tantrana.nl)

**Status:** Em andamento

---

## Motivação

As 4 páginas novas da reestruturação multi-página (`docs/implementations/home-institucional-multipagina.md`)
foram publicadas com conteúdo propositalmente enxuto. Comparando seção por
seção com o conteúdo real das páginas equivalentes em `tantrana.nl`
(referência de estrutura já usada pela Mary), ficou claro que About, Prices e
Workshop estão rasos demais em relação à referência — não só em quantidade de
texto, mas em formato (About sem narrativa pessoal, Prices sem níveis de
duração, Workshop sem cronograma/currículo). A Mary já autorizou copiar preços
diretamente da referência, o que abre espaço pra espelhar mais a profundidade
do conteúdo dela nessas páginas também, mantendo o padrão já usado no projeto
de marcar com `COPY DRAFT`/`PRICE DRAFT` tudo que depende de confirmação dela.

---

## Diagnóstico (por página)

### About — `about/index.html`, `nl/about/index.html`

**Já existe?** Parcialmente. Tem 4 parágrafos ([about/index.html:241-244](../../about/index.html#L241-L244))
mas sem nenhuma narrativa pessoal — só afirmações de abordagem. A referência
(`/tantra-specialist/`) tem uma jornada pessoal completa + um parágrafo
educativo sobre o que é a energia tântrica.

**O que precisa ser construído:** substituir o parágrafo de abertura por dois
novos — um de jornada (genérico, `COPY DRAFT`) e um educativo sobre a
modalidade (seguro, sem depender da Mary) — mantendo os 3 parágrafos de
abordagem já existentes.

**Riscos:** nenhum de layout (mesmo grid `.about-text`). Risco de conteúdo:
não inventar fatos específicos (anos de experiência, formação, tradição) —
usar linguagem genérica e manter o comentário `COPY DRAFT` já existente,
ampliado.

### Prices — `prices/index.html`, `nl/prices/index.html`

**Já existe?** Parcialmente. Tabela com 7 linhas, mas cada tratamento tem uma
faixa de duração + faixa de preço única ([prices/index.html:256-297](../../prices/index.html#L256-L297)),
em vez de linhas separadas por duração como a referência (`/prices-tantra-amsterdam/`:
ex. 1h €300 / 1.5h €350 / 2h €400).

**O que precisa ser construído:** quebrar as faixas em linhas por duração
(mesmos números da referência, já autorizados) pros 5 tratamentos individuais
e pro Couples/Tantra Coaching (2h/2.5h/3h/4h). Adicionar formas de pagamento
como pendência nova (não copiar BTC sem confirmar).

**Riscos:** tabela mais longa pode quebrar em mobile (já tem regras que
escondem a coluna de duração em `max-width:768px` — conferir se ainda faz
sentido com mais linhas).

### Workshop — `workshop/index.html`, `nl/workshop/index.html`

**Já existe?** Muito raso. Intro + 4 "pontos" abstratos
([workshop/index.html:245-276](../../workshop/index.html#L245-L276)), sem
cronograma, currículo, tamanho de grupo ou preço — a referência
(`/tantra-massage-workshop-for-couples-singles-in-amsterdam/`) tem tudo isso
detalhado.

**O que precisa ser construído:** estrutura visual completa (o que está
incluso, moldura de 2 níveis de preço, bloco de formato/currículo) mantendo
`COPY DRAFT`/CTA de WhatsApp onde o dado real não existe — isso já é a
pendência #3 aberta em `docs/pendencias-mary.md`.

**Riscos:** maior risco de parecer "definitivo" quando não é — cada bloco novo
precisa deixar claro visualmente que é indicativo, não confirmado.

### Treatments — fora do plano

Hipótese inicial ("1 frase vs. parágrafo completo") não se confirmou: a
referência (`/massage-service/`) também tem só uma frase por tratamento na
página de listagem, em duas extrações de texto completo. Não há gap de
paridade real. Não entra neste plano.

---

## Plano de Implementação

### Fase 1 — About: jornada + parágrafo educativo

**Objetivo:** dar à página About uma narrativa real (ainda que genérica) em
vez de só afirmações de abordagem, igualando o formato da referência sem
inventar fatos específicos da Mari.

| Arquivo | O que muda |
|---|---|
| `about/index.html` | Substituir 1º parágrafo por 2 novos (jornada `COPY DRAFT` + educativo); manter os 3 parágrafos seguintes |
| `nl/about/index.html` | Idem, espelhado em holandês |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `d4c886f` | jornada pessoal (draft) + parágrafo educativo na página About (EN+NL) |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** a página About abria com uma frase genérica de apresentação, sem
nenhuma narrativa pessoal e sem explicar o que é o trabalho energético/tântrico.
**Agora:** abre com um parágrafo de jornada (deliberadamente genérico — sem
anos, formação ou tradição específicos, `COPY DRAFT`) seguido de um parágrafo
educativo sobre a modalidade, mantendo os 3 parágrafos de abordagem já
existentes.
**Para validar:** Cenário 1, abaixo.

### Fase 2 — Prices: níveis de duração

**Objetivo:** tabela de preços com granularidade de duração igual à
referência, usando os números já autorizados pela Mary.

| Arquivo | O que muda |
|---|---|
| `prices/index.html` | Linhas por duração pros 5 tratamentos individuais + Couples/Coaching (2h-4h); nota de formas de pagamento |
| `nl/prices/index.html` | Idem |

### Commits Fase 2

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `PENDENTE` | níveis de duração na tabela de preços (EN+NL) |

### Relatório da Fase 2 — o que mudou na prática

**Antes:** cada tratamento tinha uma faixa única de duração/preço (ex.
"60–90 min" / "€300–350"), sem detalhar o preço de cada duração.
**Agora:** cada linha mostra os preços por duração individualmente — mesma
granularidade da referência (60/90/120min para os 5 tratamentos individuais;
2h/2.5h/3h/4h para Couples Massage e Tantra Coaching), com os mesmos valores
já autorizados pela Mary. Não foi adicionada nota de formas de pagamento nem
opções novas (4-Hands, 2 terapeutas) — ficam como pendência pra Fase 4, por
dependerem de confirmação da Mary.
**Para validar:** Cenário 2, abaixo.

### Fase 3 — Workshop: estrutura de cronograma/currículo

**Objetivo:** dar forma visual de cronograma/currículo/preço à página,
mantendo os dados reais como `COPY DRAFT`/CTA até a Mary confirmar.

| Arquivo | O que muda |
|---|---|
| `workshop/index.html` | Bloco "o que está incluso", moldura de 2 níveis de preço, bloco de formato/currículo — tudo `COPY DRAFT` |
| `nl/workshop/index.html` | Idem |

### Fase 4 — QA + pendências

**Objetivo:** conferir as 6 páginas (3 × EN/NL) responsivas, sem regressão, e
atualizar `docs/pendencias-mary.md` com os itens novos (formas de pagamento,
4-Hands/2 terapeutas, currículo do workshop).

---

## Checks de Validação

### Cenário 1 — About renderiza com o novo texto
- [ ] Abrir `about/index.html` e `nl/about/index.html` no navegador
- [ ] Confirmar 5 parágrafos + assinatura, sem quebra de layout no grid
- [ ] Redimensionar pra mobile (~390px) e confirmar sem scroll horizontal

### Cenário 2 — Prices com níveis de duração
- [ ] Abrir `prices/index.html` e `nl/prices/index.html`
- [ ] Confirmar linhas por duração, preços batendo com a referência
- [ ] Mobile: confirmar tabela ainda legível (coluna de duração escondida)

### Cenário 3 — Workshop com estrutura nova
- [ ] Abrir `workshop/index.html` e `nl/workshop/index.html`
- [ ] Confirmar blocos novos renderizam e ficam claramente marcados como
      indicativos (não preço/data reais)
- [ ] Mobile: sem scroll horizontal

### Cenário 4 — QA final
- [ ] As 6 páginas (About/Prices/Workshop × EN/NL) sem erro de console
- [ ] `docs/pendencias-mary.md` atualizado

---

## Ajustes Possíveis Pós-Implementação

- Treatments: se uma checagem visual da referência revelar conteúdo
  expansível (accordion) não capturado pela extração de texto, reavaliar.
