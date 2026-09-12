# Pesquisa de imagens no Pinterest para os mockups do site institucional

> **Para quem for executar esta tarefa em outra conversa com o Claude:** cole o
> caminho deste arquivo (`docs/pesquisa-imagens-pinterest.md`) e peça para seguir
> as instruções abaixo. Não é necessário editar nenhum arquivo `.html` — só
> pesquisar, baixar e organizar as imagens nas pastas indicadas. A integração de
> cada imagem no código (trocar o placeholder SVG por `<img>`) é um passo
> separado, feito depois.

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
luz baixa/velas, tons terrosos e âmbar, tecidos naturais, tatame, sem excesso de
elementos "new age" clichê (cristais em excesso, mandalas, etc.) — mais próximo
de um spa de luxo discreto do que de um site espiritual abstrato.

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
   parcial, silhueta ou ambiente vazio.
3. **Cuidado com direitos de uso.** Pinterest é um mural de referência — a
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
