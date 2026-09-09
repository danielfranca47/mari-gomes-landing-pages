# Mari Gomes — Landing Pages & Site

## Escopo do repositório (a partir de 2026-09-08)

Este repositório cobre **dois produtos distintos** da mesma cliente (Mari Gomes), que coexistem mas não devem ser confundidos:

1. **Funil de campanha (LPs)** — as 3 landing pages × 2 idiomas descritas na seção abaixo. **Estável e entregue** (ver `ENTREGA.md`). Estão publicadas no WordPress da Mary e recebendo tráfego pago ativo (Google Ads) — **não mexer nelas sem pedido explícito do usuário**, mesmo que uma mudança feita no site institucional pareça "fazer sentido" replicar lá também. **Exceção já em andamento:** migração de hospedagem — WordPress/TurboCloud → GitHub Pages + Cloudflare, operada pelo Daniel, cobre a home **e** as 6 LPs (ver [`docs/hospedagem-github-pages-cloudflare.md`](docs/hospedagem-github-pages-cloudflare.md)). Depois de concluída, as LPs passam a ser servidas como arquivos estáticos direto do GitHub, mantendo as URLs atuais.
2. **Site institucional (home)** — projeto novo, iniciado em 2026-09-08, para substituir a home atual em WordPress (`amarigomes.com`, tema terracota/tântrico feito no Elementor). Ao contrário das LPs, é standalone (HTML autocontido, fora do WordPress) e cobre a primeira impressão/marca da Mari, não uma oferta de campanha específica. Direção estratégica: reposicionar a identidade da home para algo mais alinhado a massagem tântrica/holística (a home atual não converte — ver diagnóstico em `docs/implementations/` quando o plano for criado). Referências de estrutura/conteúdo: `latantra.nl` e `tantricmuses.com`. Direção visual: partir das fotos que melhor performam no Google Business da Mari (tatame em sala escura com velas; retrato dela vestida de preto) — tom quente, penumbra, spa de luxo discreto — em vez do tom espiritual-abstrato do site atual.

Ao trabalhar em qualquer um dos dois produtos, verificar primeiro qual escopo a tarefa pertence antes de aplicar convenções — eles têm arquivos, identidade visual e workflow de publicação próprios (as seções abaixo, salvo indicação contrária, descrevem o **funil de LPs**; o site institucional terá sua própria seção conforme for implementado).

**Gaps de conteúdo/informação que só a Mary pode fechar** (dado factual não confirmado, decisão de negócio, credencial, etc.) não travam a implementação — registrar em [`docs/pendencias-mary.md`](docs/pendencias-mary.md) (contexto + pergunta exata) e seguir em frente com um rascunho razoável ou placeholder (mesmo padrão de comentário `COPY DRAFT`/`PHOTO REFERENCE` já usado no código). Esse arquivo é a lista central a encaminhar pra ela; não duplicar as perguntas espalhadas nos arquivos de `docs/implementations/`.

## O que é este projeto (funil de LPs)

Três landing pages de vendas para a terapeuta **Mari Gomes** (massagem holística/energética em Amsterdã), cada uma em **2 idiomas** (Inglês e Holandês) = **6 arquivos HTML** no total. Cliente final que vai publicar no ar: **Mary** (WordPress dela).

| Arquivo | Página | Idioma |
|---|---|---|
| `lp1-holistic-energy-en.html` | LP1 — Holistic Energy Massage | EN |
| `lp1-holistic-energy-nl.html` | LP1 — Holistic Energy Massage | NL |
| `lp2-relaxation-en.html` | LP2 — Relaxation & Stress Relief | EN |
| `lp2-relaxation-nl.html` | LP2 — Relaxation & Stress Relief | NL |
| `lp3-couples-en.html` | LP3 — Couples Massage | EN |
| `lp3-couples-nl.html` | LP3 — Couples Massage | NL |

Não há build, framework, `package.json` ou repositório git. Cada arquivo é **autocontido**: HTML + CSS (`<style>` no `<head>`) + um pouquinho de JS inline (toggle do FAQ) no fim do `<body>`. Para visualizar, basta abrir o `.html` direto no navegador.

## Identidade visual (cada LP é diferente — não unificar)

- **LP1 (Holistic Energy)** — paleta charcoal/cream/dourado. Fontes: `Cormorant Garamond` (display) + `DM Sans` (corpo).
- **LP2 (Relaxation)** — paleta moss verde/terracotta/areia. Fontes: `Playfair Display` + `Nunito Sans`.
- **LP3 (Couples)** — paleta rosé/blush/ivory, tom mais romântico. Fontes: `Libre Baskerville` + `Jost`.

Cada página tem seu próprio bloco `<style>` (não compartilhado). Ao editar uma página, **não** copiar estilos de outra — a identidade visual é intencionalmente distinta entre os 3 produtos.

## Estrutura comum das páginas

Todas seguem a mesma anatomia de seções (nomes de classe variam um pouco entre LPs):
`nav` → `hero` (com CTA WhatsApp) → trust/strip bar → seções de conteúdo (about/therapies/how-it-works/etc.) → `testimonials` → `faq` (accordion via `onclick="toggleFaq(this)"`) → `cta-final` → `footer`.

A LP3 tem uma seção extra (`options`) com 3 cards de tipo de sessão, cada um com seu próprio botão de WhatsApp.

## Placeholders de foto

Cada página tem **2 placeholders de imagem**, implementados como **SVG inline** (não `<img>`). Cada SVG contém:
- Um comentário `<!-- PHOTO REFERENCE: ... -->` descrevendo o que a foto real deve mostrar.
- Um rótulo visível dentro do próprio SVG: `FOTO · ...` / `substituir por foto real` (em português, mesmo nas páginas EN/NL — é instrução interna, não copy do site).

Quando uma foto real for inserida, o padrão é **substituir o `<svg>...</svg>` inteiro por uma tag `<img>`** (ou `background-image`) com `object-fit: cover` para preencher o frame sem distorcer, mesmo que a proporção da imagem enviada não seja idêntica ao placeholder. Ver `IMPLEMENTACAO.md` Fase 2 para dimensões recomendadas por slot.

Os 12 placeholders já foram substituídos (Fase 2 concluída). As imagens reais foram convertidas de PNG para `.webp` (WebP reduz ~94% do peso do arquivo mantendo a qualidade, importante para velocidade de carregamento/SEO) e ficam guardadas localmente em `images/` (os `.png` originais também, como backup/fonte).

**Importante — os `<img src>` dos 6 arquivos HTML apontam para URLs absolutas do WordPress** (`https://amarigomes.com/wp-content/uploads/2026/06/NomeDoArquivo.webp`), **não** para o caminho relativo `images/`. Isso porque as páginas são publicadas colando o HTML inteiro dentro do WordPress (ver seção "Publicação no WordPress" no `IMPLEMENTACAO.md`) — um caminho relativo `images/arquivo.webp` resolveria incorretamente contra a própria URL da página publicada (ex.: `amarigomes.com/holistic-energy-massage-en/images/...`, que não existe) e quebraria a imagem. Sempre que uma imagem for trocada/adicionada, fazer upload na Biblioteca de Mídia do WP primeiro, pegar a URL real (`wp-content/uploads/...`) e usar essa URL no `src` — nunca um caminho relativo.

## Contato / dados de negócio (usados em botões, footer, links de WhatsApp)

- WhatsApp: `+31 634 366 008` → `https://wa.me/31634366008?text=...` (texto pré-preenchido, URL-encoded, varia por página e idioma)
- E-mail: `marycontato@gmail.com`
- Instagram: `@massage.tantric.therapy` → `https://www.instagram.com/massage.tantric.therapy/` (handle atualizado; `@kirakundalini` era o valor original e não está mais em uso em nenhum dos 6 arquivos)
- Site/logo: `https://amarigomes.com`

Esses 4 destinos se repetem em nav, hero, seções de CTA e footer em todas as 6 páginas. Ver `IMPLEMENTACAO.md` Fase 1 para o mapeamento completo de cada botão.

## Seletor de idiomas (GTranslate)

Todas as páginas do projeto (as 6 LPs + a home + as 4 páginas institucionais novas,
EN/NL) têm o widget de bandeiras do GTranslate no `<nav>` (entre o logo e o botão de
CTA). Idiomas: NL, EN, FR, PT, ES. Cada página define `default_language` como o
idioma do próprio arquivo (`en` ou `nl`).

Mecanismo (3 partes, sempre juntas, dentro do `<nav>`):
1. `<div class="gtranslate_wrapper" id="gt-wrapper-XXXXXXXX"></div>` — onde as bandeiras são injetadas
2. `<script>window.gtranslateSettings['XXXXXXXX'] = {...}</script>` — config inline (idiomas, estilo de bandeira, etc.)
3. `<script src="https://cdn.gtranslate.net/widgets/latest/flags.js" data-gt-widget-id="XXXXXXXX"></script>` — script que lê a config e renderiza

**Importante:** o atributo `data-gt-widget-id` na tag `<script src="...flags.js">` é obrigatório e precisa bater com a chave usada em `window.gtranslateSettings['XXXXXXXX']` e com o `id` do wrapper — sem ele, o script roda mas não renderiza nada (silenciosamente, só loga no console "gtranslateSettings is not properly initialized"). Cada página tem um ID de 8 dígitos próprio (não há necessidade de ser globalmente único, mas evite reusar o mesmo ID em duas páginas que possam coexistir na mesma sessão de navegação).

**O script vem do CDN público oficial da GTranslate** (`cdn.gtranslate.net`), não mais
de `amarigomes.com/wp-content/...` — esse caminho apontava pro plugin instalado no
WordPress e funcionava enquanto o domínio resolvia pra lá. Depois da migração de
hospedagem (`docs/hospedagem-github-pages-cloudflare.md`, Fase F: DNS de
`amarigomes.com` movido pro GitHub Pages via Cloudflare), esse caminho passou a
retornar 404 nas 24 páginas do projeto — corrigido trocando pela URL do CDN, que usa
o mesmo mecanismo (`data-gt-widget-id` + `window.gtranslateSettings`), então foi só
troca de `src`, sem mudar mais nada. **Não usar mais `amarigomes.com/wp-content/...`
como fonte deste script daqui pra frente**, mesmo que o WordPress/TurboCloud ainda
esteja tecnicamente ativo (Fase H de cancelamento pendente) — o domínio já não aponta
pra lá.

## Menu de navegação interno (âncoras)

O `<nav>` de cada página tem 2 grupos lado a lado (`.nav-left` = logo + menu, `.nav-right` = bandeiras + CTA), com `justify-content: space-between` entre os dois grupos. O menu (`.nav-menu`) tem 4 links em âncora (`#id`) para seções da própria página — **escondido em mobile** (`max-width: 768px`) via `display: none`, já que não há menu hambúrguer implementado; no celular só ficam logo, bandeiras e botão de CTA.

Cada seção-alvo recebeu um `id` (reaproveitando o nome da classe, ex. `class="about" id="about"`) e a regra global `section { ...; scroll-margin-top: Npx; }` foi ajustada para compensar a altura do nav fixo — sem isso, o scroll suave (`html { scroll-behavior: smooth; }`, já existente) deixaria o topo da seção escondido atrás do nav.

Itens do menu por página (mesmas seções, label traduzido por idioma):
- **LP1**: About/Over mij → `#about` · Therapies/Therapieën → `#therapies` · Reviews → `#testimonials` · FAQ/Vragen → `#faq`
- **LP2**: Sessions/Sessies → `#sessions` · About/Over mij → `#about` · Reviews → `#testimonials` · FAQ/Vragen → `#faq`
- **LP3**: Experience/Ervaring → `#experience-section` · Packages/Pakketten → `#options` · Reviews → `#testimonials` · FAQ/Vragen → `#faq`

Ao adicionar uma seção nova a alguma LP que faça sentido entrar no menu, lembrar de: adicionar `id` na section, adicionar o link em `.nav-menu` (nos dois grupos `.nav-left`), e conferir que `scroll-margin-top` ainda cobre a altura do nav.

## Seção de localização (mapa)

As 6 páginas têm uma seção `#location` (entre o FAQ e a CTA final) com endereço + mapa embed do Google Maps, apontando para o perfil público do Google Business da Mari ("Massagem Amsterdam - Mari Gomes", Brouwersgracht 270A, 1013 HG Amsterdam — 5,0★, 6 avaliações). Também está no menu de navegação (`#location`).

- **Mapa**: `<iframe src="https://maps.google.com/maps?q=...&output=embed">` — embed público do Google, sem chave de API (mesmo princípio do GTranslate). Precisa estar dentro de uma tag `<iframe>` real; a URL sozinha fora de iframe retorna erro "must be used in an iframe".
- **Botão "Get Directions"**: usa a URL de direções completa do Google Maps fornecida para o local (link direto, `target="_blank"`), reaproveitando/criando a classe `.btn-outline` de cada página (era CSS morto não-usado na LP1-EN; replicado nas outras 5 páginas com a cor de destaque de cada uma).
- Layout: grid de 2 colunas (texto+botão / mapa), colapsa para 1 coluna em mobile via `.location-grid` adicionado às regras de grid responsivas existentes.

**Nota de consistência:** o FAQ de cada página diz que "o endereço é compartilhado após a confirmação da reserva" — isso não foi alterado. Mostrar o mapa/endereço aqui não contradiz tecnicamente esse texto porque o local já é um perfil público do Google Maps (endereço já é descobrível via busca), mas vale avisar a Mary dessa pequena tensão de mensagem caso quase queira ajustar o texto do FAQ no futuro.

## Convenções ao editar

- **Espelhar mudanças estruturais/de link entre o par EN/NL da mesma LP.** Texto (copy) muda por idioma, mas links, contatos e estrutura de seções devem ficar em sincronia entre `*-en.html` e `*-nl.html` da mesma página.
- Mudanças que afetam **todas as 6 páginas** (ex.: troca de número de WhatsApp, e-mail, Instagram, domínio do logo) precisam ser aplicadas nos 6 arquivos — não há include/partial compartilhado.
- Manter o breakpoint responsivo único em `max-width: 768px` (já usado em todas as páginas).
- Manter o padrão do FAQ: `<div class="faq-q" onclick="toggleFaq(this)">` + `<span>+</span>`, função `toggleFaq` no `<script>` final do arquivo.
- Links de WhatsApp usam texto pré-preenchido via `?text=` com `%XX` encoding — ao alterar a mensagem, manter o encoding válido (espaços como `%20`, apóstrofo como `%27`, etc.).
- Não introduzir dependências externas (frameworks JS, build tools) — o objetivo é manter os arquivos simples e portáveis para colar/publicar no WordPress da cliente.
- Existe uma classe `.btn-outline` definida no CSS da LP1 que não é usada em nenhum HTML — é resíduo, não precisa de ação a menos que peçam um botão secundário.

## Fluxo de trabalho deste projeto

Ver `IMPLEMENTACAO.md` para o plano de fases já concluído (botões → imagens → QA e publicação no WordPress da Mary). Para mudanças novas a partir de agora, ver "Workflow de Implementação de Features", abaixo.

## Workflow de Implementação de Features

Toda mudança não-trivial (nova seção, mudança que afeta as 6 páginas, correção de bug de layout) segue este ciclo. Os arquivos guia estão em `docs/implementations/`. Ajustes pequenos e óbvios (typo, cor pontual já especificada pelo usuário) podem pular direto pro commit.

### Ciclo de vida

```
1. Plan Mode (obrigatório para mudanças não-triviais)
   → ler docs/implementations/_guia-documentar-implementacao.md
   → diagnóstico: já existe? quais dos 6 arquivos são afetados? riscos?
   → aguardar aprovação do usuário

2. Criar arquivo docs/implementations/<slug>.md
   → preencher com template de _template-implementacao.md
   → só criado APÓS aprovação do plano

3. Implementar fase a fase
   → cada fase = 1 commit
   → registrar hash do commit no arquivo .md imediatamente após o commit
   → escrever relatório da fase em linguagem simples + prompt de retomada

4. Validar os checks
   → abrir o(s) .html no navegador (ou Chrome DevTools MCP) e conferir
   → marcar [x] com data e observação no arquivo

5. Graduação (só quando TODOS os checks estão [x])
   → seguir docs/implementations/_processo-graduacao-implementacao.md
   → migrar convenção/comportamento relevante pro CLAUDE.md ou docs/architecture/
   → git rm do arquivo de implementação
   → commit único de graduação
```

### Regras críticas

- **Nunca avançar para código sem plano aprovado**, exceto ajustes triviais.
- **Nunca graduar com checks `[ ]` em aberto.**
- **Espelhar sempre entre o par EN/NL da mesma LP** — cada fase que mexe numa LP mexe nos 2 arquivos.
- **Cada fase tem exatamente 1 commit**, hash registrado no .md.

### Arquivos de referência

| Arquivo | Propósito |
|---|---|
| [`docs/implementations/_guia-documentar-implementacao.md`](docs/implementations/_guia-documentar-implementacao.md) | Processo completo passo a passo |
| [`docs/implementations/_template-implementacao.md`](docs/implementations/_template-implementacao.md) | Template concreto preenchido |
| [`docs/implementations/_processo-graduacao-implementacao.md`](docs/implementations/_processo-graduacao-implementacao.md) | Como graduar |

## Git

Este projeto tem repositório no GitHub: `danielfranca47/mari-gomes-landing-pages` (público).

**Ao final de toda atualização (qualquer mudança nos arquivos do projeto), fazer commit com resumo das atualizações.** Não deixar trabalho concluído sem commit — cada rodada de edições termina com um `git add` + `git commit` descrevendo o que mudou. Perguntar ao usuário apenas se o push para o remoto deve ser feito também; o commit local em si não precisa de confirmação prévia.
