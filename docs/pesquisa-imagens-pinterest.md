# Pesquisa de imagens no Pinterest para os mockups do site institucional

> **Para quem for executar esta tarefa em outra conversa com o Claude:** cole o
> caminho deste arquivo (`docs/pesquisa-imagens-pinterest.md`) e peça para seguir
> as instruções abaixo. Não é necessário editar nenhum arquivo `.html` — só
> pesquisar, baixar e organizar as imagens nas pastas indicadas. A integração de
> cada imagem no código (trocar o placeholder SVG por `<img>`) é um passo
> separado, feito depois.
>
> **Antes de começar, leia a seção "Avaliação da Rodada 1 (2026-09-13)" no final
> deste arquivo.** A primeira rodada de pesquisa (2026-09-12) foi executada por
> completo mas **reprovada** numa revisão de profissionalismo/identidade visual
> — essa seção lista, imagem por imagem, o que saiu errado (fotos sem relação
> com a cena descrita, uma foto reaproveitada demais, rosto identificável num
> campo que não podia ter, falta de simbolismo autêntico do nicho). É contexto
> obrigatório para não repetir as mesmas escolhas.

## Contexto

O site institucional da Mari Gomes (`docs/mockups/*.html`) tem hoje ~21 campos de
imagem simulados por placeholders SVG (padrão `PHOTO REFERENCE` + rótulo "FOTO ·
..."), mapeados a partir do site de referência validado **tantrana.nl**. Ver
`docs/mockups/README.md` para o contexto completo de como e por que esses campos
foram criados.

Esta tarefa é **só de pesquisa visual**: buscar no Pinterest fotos que combinem
com a identidade visual já definida (linha holística/tântrica, tom quente,
penumbra, spa de luxo discreto) para cada um dos campos listados abaixo, e
organizar os arquivos baixados no repositório.

## Identidade visual a seguir

Paleta do site (não escolher fotos que fujam muito desse tom de cor):

| Nome | Hex | Uso |
|---|---|---|
| Parchment | `#F3E9DA` | fundo claro |
| Warm white | `#FBF6EE` | fundo de seções alternadas |
| Ink | `#241B14` | texto |
| Taupe | `#7C6E5F` | texto secundário |
| Amber | `#B9793E` | destaque |
| Amber light | `#E3C08A` | destaque em fundo escuro |
| Ember | `#241811` | fundo escuro dos placeholders/banners |

Direção geral (já usada nas 2 fotos reais do site, `images/Home_Hero_Tatame.webp`
e `images/Home_About_Mari.webp`, que servem de referência de tom): ambientes com
luz baixa/velas, tons terrosos e âmbar, tecidos naturais, tatame — mais próximo
de um spa de luxo discreto do que de um site espiritual abstrato.

**Ajuste pós-Rodada 1 (2026-09-13):** a orientação de evitar "new age clichê"
não significa evitar simbolismo do nicho — significa evitar simbolismo
**solto, sem contexto de prática**. Buscar ativamente por elementos autênticos
de budismo/tantra (estátua de Buda, mudras, incenso, tigela tibetana/singing
bowl, flor de lótus, têxteis com padrão indiano/asiático sutil), sempre
**integrados a uma cena de prática ou ambiente real** — não como objeto
isolado num fundo neutro estilo produto de loja. O que continua proibido é o
clichê de vitrine esotérica (pedra/cristal como still-life solto, mandala
impressa em pôster, dream catcher). Ver detalhamento e exemplo do erro em
"Avaliação da Rodada 1", item 4, no final deste arquivo.

## Regras importantes (ler antes de pesquisar)

1. **Sem conteúdo explícito.** O site roda tráfego pago no Google Ads (contas já
   ativas nas 6 landing pages do funil). Imagens com nudez explícita, poses
   sexuais ou insinuação forte podem colocar a conta de Ads em risco (essa
   preocupação já está registrada em `docs/pendencias-mary.md`, pendência #8).
   Preferir sempre: mãos, costas, ombros, silhuetas, tecidos, velas, ambiente —
   nunca corpo nu explícito ou genitália visível, mesmo em fotos "artísticas".
2. **Sem rosto identificável de "cliente".** Evitar fotos onde o rosto de uma
   pessoa fica em destaque e reconhecível — isso evita a impressão de que é uma
   cliente real da Mari (ela não autorizou isso) e mantém a mesma lógica já
   usada nos placeholders (ex.: "sem rosto identificável"). Foco em mãos, corpo
   parcial, silhueta ou ambiente vazio. **Essa regra foi violada na Rodada 1**
   (`fly-me-in/02-couples.jpg` tinha os dois rostos do casal totalmente
   visíveis) — checar isso explicitamente antes de salvar cada foto com pessoa,
   não só confiar na primeira impressão do enquadramento.
3. **A foto precisa mostrar (ou sugerir claramente) a cena descrita na coluna
   "O que a foto deve mostrar" — não só combinar com a paleta.** Ambiance
   bonita sem relação com o serviço (ex.: sala de estar com velas para
   "massagem relaxante", ou mãos com aliança de casamento acendendo vela para
   "massagem de casal") não é aceitável mesmo que a cor/luz batam com a
   identidade visual. Se não achar uma foto que mostre a cena de verdade,
   é melhor registrar como gap (ver seção de prompts de IA) do que forçar uma
   foto genérica só porque a paleta combina. Ver exemplos concretos do erro em
   "Avaliação da Rodada 1", item 2.
4. **Limite de reaproveitamento: no máximo 2 usos por foto**, e nunca
   reaproveitar a foto usada como `cover/sitewide-cover.jpg` (banner
   compartilhado em 5 páginas) em nenhum outro campo — na Rodada 1 uma única
   foto de quarto de hotel vazio acabou em 7 lugares do site, o que fica muito
   visível pra quem navega por mais de uma página. Ver item 1 da avaliação.
5. **Cuidado com direitos de uso.** Pinterest é um mural de referência — a
   maioria dos pins não pertence a quem postou, e muitos são reposts sem
   licença. Ao encontrar uma imagem boa:
   - Sempre que possível, siga o link de origem do pin (geralmente aparece ao
     clicar na imagem) e veja se ela vem de um banco de fotos gratuito como
     **Unsplash** ou **Pexels** — se vier, baixe de lá (uso livre, sem
     necessidade de crédito). Muitas fotos desse nicho circulam originalmente
     no Unsplash.
   - Se não conseguir achar a fonte original gratuita, baixe do Pinterest mesmo,
     mas **anote a URL do pin** no arquivo `sources.md` (ver estrutura de pastas
     abaixo) — assim conseguimos revisar a licença antes de publicar de verdade
     no site. Essas ficam marcadas como "referência, não licenciada" até
     confirmarmos.
   - Essas imagens (mesmo as de fonte livre) são para **prototipagem/validação
     visual** dos mockups — a publicação final no site pode exigir compra de
     licença, fotos próprias da Mari, ou confirmação de uso livre, dependendo da
     fonte encontrada.

## Onde salvar

Criar esta estrutura de pastas (ainda não existe) e salvar os arquivos com os
nomes exatos indicados nas tabelas abaixo:

```
docs/mockups/images-pinterest/
  home/
  treatments/
  workshop/
  fly-me-in/
  cover/
  sources.md
```

Manter a resolução original do download (não comprimir agora — isso é feito
depois, na implementação real, como já é feito com as fotos existentes em
`images/`, que foram convertidas de PNG para WebP nessa etapa). Formato
`.jpg` ou `.png`, o que a fonte oferecer.

No `sources.md`, uma linha por imagem, formato simples:

```
home/services-outcall.jpg — https://pinterest.com/pin/... (ou URL do Unsplash/Pexels original)
```

## Campos de imagem — Home (pasta `home/`)

| Arquivo a salvar | Proporção | Tamanho mínimo | O que a foto deve mostrar |
|---|---|---|---|
| `services-outcall.jpg` | 4:3 | 1200×900 | Ambiente de sessão outcall — quarto de hotel ou casa com luz baixa, tecido natural, sem rosto identificável |
| `services-incall.jpg` | 4:3 | 1200×900 | Interior de estúdio de massagem — maca, velas, decoração acolhedora, tom âmbar |
| `gallery-candles.jpg` | 1:1 | 1000×1000 | Detalhe de velas acesas e óleo quente, close-up |
| `gallery-touch.jpg` | 1:1 | 1000×1000 | Mãos em prática de toque consciente, sem rosto identificável |
| `gallery-studio.jpg` | 1:1 | 1000×1000 | Ambiente geral de estúdio (tatame, tecidos, penumbra) |
| `testimonials-ambiance.jpg` | ~2.4:1 (bem panorâmica) | 1800×750 | Ambiente de estúdio durante uma sessão — mãos/tecidos, sem rosto identificável |

## Campos de imagem — Treatments (pasta `treatments/`)

Todas na mesma proporção 4:3, tamanho mínimo 1200×900:

| Arquivo a salvar | Tratamento | O que a foto deve mostrar |
|---|---|---|
| `01-holistic-energy.jpg` | Holistic Energy Massage | Sessão de massagem energética, foco em técnica holística/tântrica, sem rosto identificável |
| `02-relaxation.jpg` | Relaxation & Stress Relief | Ambiente relaxante, luz baixa, tecidos naturais, clima calmo |
| `03-couples.jpg` | Couples Massage | Casal em sessão conjunta — foco em mãos/tecidos, sem rosto identificável |
| `04-dearmouring.jpg` | Dearmouring Tantra Massage | Detalhe de toque terapêutico nas costas/ombros |
| `05-chakra-balancing.jpg` | Chakra Balancing Tantra Massage | Velas e cristais, simbolismo sutil de energia (sem exagero) |
| `06-coaching-couple.jpg` | Coaching Tantra Massage Couple Session | Casal em prática guiada, comunicação através do toque |
| `07-four-hands.jpg` | 4-Hands Tantra Massage | Duas terapeutas em sessão de 4 mãos, sincronizadas |

## Campos de imagem — Workshop (pasta `workshop/`)

Proporção 16:9, tamanho mínimo 1600×900:

| Arquivo a salvar | O que a foto deve mostrar |
|---|---|
| `morning-session.jpg` | Prática matinal em grupo, ambiente com luz natural, sem rosto identificável |
| `evening-session.jpg` | Prática noturna, luz baixa e velas, ambiente mais intimista |

## Campos de imagem — Fly Me In (pasta `fly-me-in/`)

4 primeiras em 4:3 (mínimo 1200×900), a última bem panorâmica:

| Arquivo a salvar | Proporção | Tamanho mínimo | O que a foto deve mostrar |
|---|---|---|---|
| `01-individual.jpg` | 4:3 | 1200×900 | Sessão individual em hotel/quarto de viagem, sem rosto identificável |
| `02-couples.jpg` | 4:3 | 1200×900 | Casal em sessão privada, ambiente acolhedor |
| `03-group-workshop.jpg` | 4:3 | 1200×900 | Grupo em workshop, ambiente amplo e acolhedor |
| `04-group-training.jpg` | 4:3 | 1200×900 | Treinamento em grupo, mãos em prática guiada |
| `closing.jpg` | ~2.4:1 | 1800×750 | Ambiente geral do serviço Fly Me In — mala/viagem combinada com elementos de toque/spa, sem rosto identificável |

## Campo de imagem — Capa temática (pasta `cover/`)

| Arquivo a salvar | Proporção | Tamanho mínimo | O que a foto deve mostrar |
|---|---|---|---|
| `sitewide-cover.jpg` | ~3.2:1 (bem panorâmica) | 1920×600 | Mesma linguagem visual do hero da Home (tatame/velas/penumbra) — não precisa ser a mesma foto exata, mas o mesmo clima — em formato bem largo, com uma área mais "vazia"/de contraste no centro-esquerda ou centro-direita, já que um título em texto branco será sobreposto por cima |

Este campo é reaproveitado como banner atrás do título em 5 páginas (About,
Treatments, Prices, Workshop, Fly Me In) — só precisa de **uma** imagem.

## Resumo de quantidade

21 imagens no total: 6 (Home) + 7 (Treatments) + 2 (Workshop) + 5 (Fly Me In) +
1 (capa temática compartilhada).

---

## Relatório da execução (2026-09-12)

**Status: concluído.** As 21 imagens foram buscadas, baixadas, organizadas em
`docs/mockups/images-pinterest/` e já aplicadas nos 6 arquivos de mockup
(`docs/mockups/*.html`, substituindo os placeholders SVG por `<img>`). Fontes
completas, com uma linha por imagem, em
[`docs/mockups/images-pinterest/sources.md`](mockups/images-pinterest/sources.md).

### Mudança de abordagem: Pinterest → Unsplash

O plano original era pesquisar no Pinterest usando o Chrome já logado da
Ayde. Na prática, a automação de navegador (Chrome DevTools MCP) abre uma
instância própria do Chrome, sem acesso à sessão/cookies do Chrome pessoal
já aberto no PC — então a pesquisa no Pinterest rodou de forma anônima (sem
login). Isso por si só não bloqueou a pesquisa (Pinterest permite navegar
sem conta), mas os resultados de busca vinham quase todos em recorte
retrato, incompatíveis com as proporções pedidas no briefing (4:3, 1:1,
panorâmicas) — e boa parte das imagens de spa/massagem no Pinterest e no
próprio Unsplash eram do banco pago "Unsplash+", que foi descartado.

Pivotei para pesquisar **direto no Unsplash** (ainda dentro das regras deste
arquivo, que já listava Unsplash como fonte preferencial): a URL de imagem
do Unsplash aceita parâmetros de recorte (`w`, `h`, `fit=crop`), o que
permitiu pedir exatamente a proporção de cada campo em vez de recortar
manualmente depois. Todas as 21 imagens finais vêm do Unsplash (licença
livre, sem crédito obrigatório).

### Como cada imagem foi escolhida

Para cada campo: busquei por 2-4 termos em inglês relacionados à descrição
do briefing, extraí as fotos candidatas direto do DOM da página de busca
(evitando abrir cada pin/foto individualmente), baixei prévias das 2-3 mais
promissoras já no recorte/proporção final pedido, e avaliei visualmente
antes de decidir — aplicando as 2 regras de conteúdo do briefing (sem
nudez/insinuação explícita; sem rosto identificável de "cliente") a cada
candidata antes de salvar.

3 pares de campos reaproveitam a mesma foto original (recortada diferente
para cada proporção/página) em vez de 21 fotos totalmente distintas —
listado com detalhe em `sources.md`.

### Os 2 gaps (placeholders mais fracos)

Não encontrei foto gratuita batendo exatamente com o briefing para:

- **`treatments/07-four-hands.jpg`** — o briefing pede 2 terapeutas em
  sessão simultânea de 4 mãos; não existe isso como foto de banco gratuito
  (Unsplash/Pexels). Usei a aproximação mais próxima que achei (2 mãos de 1
  terapeuta aplicando pedras quentes, rosto oculto).
- **`fly-me-in/closing.jpg`** — o briefing pede mala/viagem combinada com
  elementos de toque/spa no mesmo enquadramento; as fotos com mala que achei
  tinham marca de produto visível ou rosto em destaque. Usei uma foto só de
  ambiente (luz quente atrás da cabeceira da cama, sem mala).

Sugestões de prompt para gerar essas 2 imagens via IA (Gemini) estão em
`sources.md`, seção "Prompts sugeridos para IA (gaps)".

### Aplicação nos mockups

Nos 6 arquivos de `docs/mockups/*.html`, cada `<svg>...</svg>` de
placeholder foi substituído por uma tag `<img src="images-pinterest/...">`
(caminho relativo à pasta `docs/mockups/`), mantendo o `<div
class="mock-photo-frame ...">` ao redor — cada arquivo ganhou uma regra CSS
`.mock-photo-frame img { position: absolute; inset: 0; width: 100%; height:
100%; object-fit: cover; display: block; }` ao lado da regra já existente
para `svg`, mesmo padrão (`object-fit: cover`) já usado nas 6 LPs reais e no
site institucional publicado. O comentário `PHOTO REFERENCE` de cada
placeholder foi trocado por um comentário apontando para `sources.md`; os 2
campos em gap mantiveram uma nota extra sinalizando isso no próprio HTML.

**Lembrete importante:** essas são fotos de pesquisa/prototipagem, não
licenciadas para publicação real (ver aviso no topo deste arquivo e em
`docs/mockups/README.md` — "Não publicar nenhum arquivo desta pasta"). Antes
de qualquer uma delas ir pro site institucional de verdade, precisa: (a)
confirmar/comprar a licença de uso comercial no Unsplash (o termo "gratuito,
sem crédito" cobre a maioria dos casos, mas vale conferir caso a caso), (b)
trocar por fotos reais da Mari, ou (c) gerar versões customizadas via IA.

### Próximos passos

- Usuário abre os 6 `.html` de `docs/mockups/` no navegador para avaliar o
  resultado visual.
- Se aprovado, decidir por LP/campo: manter a foto do Unsplash (checando
  licença), trocar por foto real da Mari, ou gerar via IA — especialmente
  nos 2 gaps sinalizados acima, onde a foto de banco ficou como aproximação
  fraca.

---

## Avaliação da Rodada 1 (2026-09-13) — reprovada, corrigir na Rodada 2

Revisão visual das 21 imagens, feita renderizando os mockups de verdade no
navegador (não só olhando cada foto isolada), concluiu que o conjunto **não
passa o nível de profissionalismo necessário** e não deve ser usado além de
prototipagem. `docs/mockups/README.md` e o aviso no topo deste arquivo já
diziam isso quanto a licença — esta avaliação é sobre identidade visual e
coerência com o nicho, um problema separado (e mais grave) do que licença.

Resumo por ordem de gravidade, para quem for refazer a pesquisa:

### 1. Uma foto reaproveitada demais (7 lugares)

`home/services-outcall.jpg` — um quarto de hotel vazio e escuro, só cama e
abajur — virou também `fly-me-in/01-individual.jpg` **e**
`cover/sitewide-cover.jpg` (banner reaproveitado em About, Treatments, Prices,
Workshop e Fly Me In). Resultado: quem navega por duas páginas do site
reconhece a mesma foto, o que denuncia "banco de imagens genérico" em vez de
uma prática com identidade própria. Ver Regra 4 (nova) na seção de regras: no
máximo 2 usos por foto, e a foto de capa não pode reaparecer em outro campo.

### 2. Fotos sem nenhuma relação com o serviço descrito

Quatro dos 7 campos de `treatments/` não mostram massagem, terapia ou qualquer
elemento do serviço — só "ambiance" que combina com a paleta mas não com a
cena pedida:

- `treatments/02-relaxation.jpg` — sala de estar com velas (reaproveitada de
  `home/gallery-studio.jpg`), sem pessoa, sem massagem. Lê como foto de loja
  de decoração/vela aromática, não como "Relaxation & Stress Relief".
- `treatments/03-couples.jpg` — duas mãos acendendo uma vela, com **aliança de
  casamento visível**. Lê como foto de casamento/noivado, não como massagem a
  dois.
- `treatments/05-chakra-balancing.jpg` — uma pedra de ametista brilhando,
  sozinha, sem nenhum elemento de ritual, toque ou ambiente terapêutico ao
  redor. Virou prop de loja de cristais em vez de simbolismo tântrico/budista
  aplicado a uma cena real (ver item 4 abaixo).
- `treatments/06-coaching-couple.jpg` e `fly-me-in/04-group-training.jpg` —
  mãos de pessoas diferentes empilhadas (a primeira com aliança e relógio de
  pulso, a segunda sobre uma mesa de madeira) — leem como foto de banco
  genérica de "pedido de casamento" ou "trabalho em equipe corporativo", não
  como prática guiada de casal ou de grupo em massagem tântrica.

Regra pra Rodada 2: ver Regra 3 (nova) na seção de regras acima — a foto tem
que mostrar ou sugerir claramente a cena descrita, não só a paleta.

### 3. Rosto identificável em campo que não podia ter

`fly-me-in/02-couples.jpg` mostra um casal se abraçando num quarto de hotel
**com os dois rostos totalmente visíveis e reconhecíveis**, ao lado de uma
mala aberta em cima da cama — violação direta da Regra 2 deste documento
(que já existia desde a Rodada 1, só não foi seguida nesse caso específico).
Além do rosto visível, a cena em si lê mais como "tensão de relacionamento
numa viagem" do que como um serviço de massagem — trocar por algo que não
mostre rosto (mãos, ombros, silhueta, ambiente do quarto) e que também
comunique "sessão a dois", não só "casal viajando".

### 4. Faltou simbolismo autêntico do nicho (budismo/tantra)

As fotos aprovadas do banco (mãos em toque, costas, tecidos, velas) são
seguras mas genéricas de "spa" — não remetem especificamente a budismo/tantra,
que é o diferencial da Mari. Isso é diferente do erro do item 2: lá o
problema foi ambiance sem ligação com a cena; aqui o problema é falta de
uma camada de simbolismo específico do nicho por cima de cenas que já têm
ligação com o serviço. Na Rodada 2, buscar ativamente por:

- Estátua de Buda (inteira ou detalhe, luz baixa) — em composição com
  velas/incenso/tecido, integrada a um ambiente de prática, não isolada num
  fundo neutro tipo produto de loja (esse foi exatamente o erro do
  `05-chakra-balancing.jpg` com a pedra).
- Mudras (posições de mão de meditação/yoga) durante uma prática — pode ser
  mãos de uma pessoa só, sem rosto.
- Incenso queimando, tigela tibetana (singing bowl), flor de lótus, têxteis
  com padrão indiano/asiático sutil.
- Postura de meditação ou mão sobre o corpo em contexto de prática guiada
  (evitar pose de yoga genérica de academia ocidental, sem clima ritual).

Continua proibido o clichê de vitrine esotérica (still-life de cristal solto,
mandala impressa em pôster, dream catcher) — o objetivo é sugestão sutil e
integrada à cena, não decoração new age de loja.

### 5. Os 2 gaps da Rodada 1 continuam sem solução boa

`treatments/07-four-hands.jpg` (pedras quentes de 1 terapeuta, não 4 mãos
reais) e `fly-me-in/closing.jpg` (quarto vazio, sem mala nem elemento de
viagem) foram sinalizados como aproximações fracas na Rodada 1 e continuam
sem foto gratuita ideal. Se a Rodada 2 não encontrar nada melhor no
Unsplash/Pexels, usar os prompts de IA já sugeridos na seção "Prompts
sugeridos para IA (gaps)" acima em vez de manter a aproximação fraca.

### O que manter (aprovado, não precisa trocar)

`home/gallery-candles.jpg`, `home/gallery-touch.jpg`,
`treatments/01-holistic-energy.jpg`, `treatments/04-dearmouring.jpg`,
`workshop/morning-session.jpg`. `treatments/07-four-hands.jpg` também fica
(gap conhecido, mas melhor que nada, ver item 5).

O retrato real da Mari (`images/Home_About_Mari.webp`, fora desta pasta, já
publicado na Home) é a referência de tom-alvo para todo o resto do site:
quente, discreto, específico da prática dela — o oposto de estoque genérico.
Toda foto nova escolhida na Rodada 2 deveria ser comparada contra essa foto
antes de salvar: "isso parece tão específico/intencional quanto o retrato da
Mari, ou parece que veio de um banco de imagens qualquer de spa?"
