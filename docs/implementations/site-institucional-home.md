# Site Institucional (Home) — Mari Gomes

**Status:** Em andamento

---

## Motivação

O site atual (`amarigomes.com`, WordPress/Elementor, tema terracota/tântrico) não
está convertendo. A cliente pediu uma home nova, com identidade mais alinhada a
massagem tântrica/holística, usando como referência `latantra.nl` e
`tantricmuses.com`, e partindo das fotos que já performam bem no perfil do Google
Business da Mari (tatame numa sala escura com velas; retrato dela vestida de preto).

Decisão tomada com o usuário: sair do WordPress. A nova home é HTML autocontido, no
mesmo padrão técnico das 6 landing pages já entregues, dentro deste mesmo
repositório (ver `CLAUDE.md`, seção "Escopo do repositório").

---

## Problemas Identificados (estado anterior — site atual em WordPress)

1. **Linguagem abstrata demais:** copy tipo "vibrational rebalancing", "consciousness
   as energy" — não diz para quem é a oferta.
2. **CTAs fracos e repetidos:** mesmos 3 CTAs de WhatsApp ao longo da página, sem
   variação por seção.
3. **Zero prova social visível:** a Mari tem 5,0★/6 avaliações no Google Business
   (mesmo dado já usado na seção de localização das LPs), mas isso não aparece na
   home.
4. **Nenhuma credencial/experiência da Mari aparece** na página.
5. **Comparativo confuso** entre terapias, sem ajudar a decisão.

---

## Abordagem

Home nova como **hub institucional**, não como funil de venda duplicado:

```
home-en.html / home-nl.html (novos, autocontidos, fora do WordPress)
  ├─ Nav (GTranslate, IDs novos — não reusar os 6 já usados pelas LPs)
  ├─ Hero (foto tatame/sala escura, posicionamento concreto)
  ├─ Qualificação de público ("isso é pra você se...")
  ├─ Modalidades (3 cards → linkam pra lp1/lp2/lp3 no idioma certo)
  ├─ Diferenciais
  ├─ Sobre a Mari (retrato de preto, credenciais)
  ├─ Depoimentos (reviews reais do Google)
  ├─ Location/mapa (reuso do padrão das LPs)
  ├─ FAQ (reuso do accordion + 1 pergunta de legitimidade/discrição)
  └─ CTA final + footer
```

Reaproveita os padrões técnicos já validados nas LPs: bloco GTranslate completo,
`toggleFaq`, tracking de conversão WhatsApp → Google Ads, nav fixo com
`scroll-margin-top`, embed público do Google Maps, footer padrão. Identidade visual
(paleta/tipografia) é nova — 4ª identidade do projeto, distinta de LP1/LP2/LP3.

Plano completo (contexto, decisões de arquitetura, estrutura de seções) está em
`C:\Users\Daniel França\.claude\plans\rosy-hugging-rain.md` (aprovado em 2026-09-08).

---

## Plano de Implementação

### Fase 1 — Esqueleto técnico: paleta, Nav, Hero, Footer

**Objetivo:** ter os dois arquivos abrindo no navegador com a identidade visual nova,
nav funcional (GTranslate + âncoras) e footer padrão.

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Novo arquivo — `<style>` com paleta/tipografia própria, Nav, Hero, Footer, esqueleto de `<section>`s vazias para as próximas fases |
| `home-nl.html` | Espelhado (copy NL) |
| `CLAUDE.md` | Corrige divergência do handle do Instagram (`@kirakundalini` → `@massage.tantric.therapy`, valor real usado no HTML das LPs) |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `579bc7d` | esqueleto técnico da home (paleta/tipografia nova, nav+GTranslate, hero full-bleed com placeholder SVG, footer, seções vazias) + correção do Instagram no CLAUDE.md |
| 2 | `78b56ac` | registra hash do commit 1 neste arquivo |
| 3 | `99a900b` | refaz o hero para fundo claro (harmoniza com as LPs) — ver "Ajuste de paleta" abaixo |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** não existiam `home-en.html`/`home-nl.html` — só as 6 LPs de campanha.
**Agora:** os dois arquivos abrem direto no navegador com uma identidade visual nova
(4ª paleta do projeto — tons quentes/escuros, dourado, tipografia Fraunces + Manrope),
nav fixo com bandeiras de idioma funcionando, um hero em tela cheia com o placeholder
da foto do tatame (a ser substituída na Fase 6) e mensagem de posicionamento direta
(corrige a abstração do site atual), e footer com os dados de contato corretos. As
seções seguintes (about, services, testimonials, location, faq) existem como âncoras
vazias, prontas para receber conteúdo nas próximas fases.
**Para validar:** Cenário 1, abaixo.

**Nota de ajuste feito durante a validação:** no mobile (nav quebra em 2 linhas, igual
já acontece nas 6 LPs), o padding-top do hero foi aumentado de 110px para 150px pra
garantir folga entre o nav e o texto do hero — testado em ~375-750px de largura sem
sobreposição.

**Ajuste de paleta (feedback do usuário, mesmo dia):** a primeira versão do hero era
full-bleed escuro (fundo quase preto em 100vh) e destoava demais do restante do
projeto — as 6 LPs são todas de fundo claro/creme. Refeito para o mesmo padrão de
hero das LPs (esquerda clara com texto, direita com o retrato/foto emoldurado, como
no LP1): fundo geral voltou a ser um creme quente (`--parchment`), nav ficou clara e
translúcida (era escura opaca), e o tom escuro/penumbra ficou contido só dentro do
frame da foto (que já é o placeholder da foto do tatame) e no footer — mesmo padrão
de footer escuro que as 3 LPs já usam. Mantido: paleta própria (âmbar como accent),
tipografia própria (Fraunces + Manrope), sem reaproveitar as variáveis exatas de
LP1/LP2/LP3.

### Fase 2 — Qualificação de público + Modalidades

**Objetivo:** seção "isso é pra você se..." + 3 cards de modalidade linkando pras LPs.

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seções `#audience` e `#services` |
| `home-nl.html` | Espelhado |

### Commits Fase 2

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `ddb227a` | seção "isso é pra você se..." (4 itens de qualificação) + 3 cards de modalidade linkando pras LPs correspondentes no idioma certo |

### Relatório da Fase 2 — o que mudou na prática

**Antes:** as âncoras `#audience` e `#services` existiam mas estavam vazias.
**Agora:** a home tem uma seção que qualifica o visitante (4 frases "isso é pra você
se...", direto no problema que o site atual não resolvia — falta de segmentação) e
uma seção com os 3 cards de terapia (Holistic Energy, Relaxation, Couples), cada um
com uma frase curta e um link "Learn more & book" que leva pra LP correspondente no
idioma certo — a home funciona como hub, sem duplicar o discurso de venda das LPs.
**Para validar:** Cenário 2, abaixo (menu âncora + links de modalidade).

**Nota:** testado no Chrome DevTools (desktop 1440px e mobile 390px, EN e NL), sem
erros de console; grid de 2/3 colunas colapsa para 1 coluna no mobile. — Diferenciais + Sobre a Mari

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seções `#differentiators` e `#about` |
| `home-nl.html` | Espelhado |

### Commits Fase 3

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `524c8f8` | seção de diferenciais (4 itens, banda escura contida — mesmo ritmo de alternância que o LP1 já usa) + seção "Sobre a Mari" (retrato placeholder + texto) |

### Relatório da Fase 3 — o que mudou na prática

**Antes:** as âncoras `#differentiators` e `#about` existiam mas estavam vazias.
**Agora:** a home tem uma seção de diferenciais (banda escura contida, mesmo padrão
de alternância de ritmo que o LP1 já usa entre suas seções — não é o mesmo problema
do hero full-bleed da Fase 1) com 4 pontos: toque no ritmo do cliente, discrição
(inclui uma frase deixando claro que não é serviço sexual/escort — inspirado no
disclaimer do Tantric Muses), atendimento personalizado, e prova social concreta
(5.0★ Google, endereço fixo). Logo depois, a seção "Sobre a Mari" com retrato
(placeholder) e um texto de apresentação pessoal.
**Para validar:** Cenário 1 (visual) e conferir se o texto de "Sobre a Mari" está OK
pra manter como rascunho.

**Pendência marcada no próprio código** (comentário `COPY DRAFT` acima do texto em
`.about-text`, nos dois arquivos): o texto sobre a Mari é propositalmente genérico —
não inventei tempo de atuação, formação ou certificações específicas, porque não
tenho esse dado confirmado. Precisa da Mary pra fechar esse texto antes de publicar
de verdade (mesma pendência já registrada na seção "Pendências" deste arquivo).

### Fase 4 — Depoimentos + Location/mapa

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seções `#testimonials` e `#location` (reuso do padrão de mapa das LPs) |
| `home-nl.html` | Espelhado |

### Commits Fase 4

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `09b1b13` | seção de depoimentos (3 reviews reais, reaproveitadas do LP1) + seção de localização/mapa (reuso exato do padrão das LPs: endereço, iframe do Google Maps, botão Get Directions) |

### Relatório da Fase 4 — o que mudou na prática

**Antes:** as âncoras `#testimonials` e `#location` existiam mas estavam vazias.
**Agora:** a home tem os mesmos 3 depoimentos reais já usados no LP1 (Fernão O.,
Kinuthia, Larissa G. — reaproveitados, não inventados) e a seção de localização com
o mesmo endereço, mapa embed e botão "Get Directions" que as 6 LPs já usam
(`.location-map`, `.btn-outline` — mesma URL de direções e mesmo iframe público do
Google Maps, sem chave de API).
**Para validar:** Cenário 3, abaixo.

**Nota de validação:** o mapa carrega via lazy-load (`loading="lazy"`) — só renderiza
quando a seção entra na viewport, mesmo comportamento já documentado nas 6 LPs.
Confirmado abrindo direto na âncora `#location` (desktop e mobile): pin correto
("Massage Amsterdam - Mari Gomes", Brouwersgracht 270A) aparece no mapa.

### Fase 5 — FAQ + CTA final + tracking

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seção `#faq`, CTA final, script de tracking WhatsApp → Google Ads |
| `home-nl.html` | Espelhado |

### Commits Fase 5

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `ea1b44f` | FAQ (6 perguntas — a maioria reaproveitada/adaptada do LP1, incluindo a de legitimidade "é serviço sexual?") + CTA final + scripts de toggleFaq e tracking WhatsApp → Google Ads |

### Relatório da Fase 5 — o que mudou na prática

**Antes:** a âncora `#faq` estava vazia e não havia CTA final, `toggleFaq` nem
tracking de conversão na home.
**Agora:** a home tem um FAQ de 6 perguntas (a de legitimidade "é serviço sexual ou
de acompanhante?" logo na primeira posição, "qual massagem escolher?" direcionando
pra seção de modalidades/WhatsApp, e as demais reaproveitadas quase literalmente do
LP1 — preço, local, o que vestir, contraindicações), uma seção de CTA final, e os
mesmos dois scripts finais das 6 LPs: `toggleFaq` (accordion) e o tracking de
conversão do Google Ads no clique de qualquer link `wa.me`.
**Para validar:** Cenário 3, abaixo.

**Testado:** accordion abre/fecha (confirmado via clique simulado), o script de
tracking carrega o `gtag.js` sob demanda e dispara o evento de conversão no clique
(confirmado inspecionando `window.dataLayer` após o clique), 4 links `wa.me` na
página (nav, hero, footer, CTA final — a home não tem os CTAs de WhatsApp por card
como a LP3, já que os cards de modalidade linkam pras LPs). Testado em EN e NL,
desktop e mobile, sem erros de console.

### Fase 6 — Fotos reais + revisão responsiva

Inserir as 2 fotos já disponíveis (tatame, retrato), avaliar reaproveitamento de
fotos já existentes em `images/` (das LPs) nos slots restantes, placeholder SVG (
padrão já usado nas LPs) onde não houver foto ainda. Revisão de responsivo 768px em
todas as seções.

| Arquivo | O que muda |
|---|---|
| `home-en.html` / `home-nl.html` | placeholders SVG do hero e do about substituídos por `<img>` real, `object-fit: cover` |
| `images/Home_Hero_Tatame.webp` | novo — foto do tatame em sala escura com velas (fornecida pelo usuário) |
| `images/Home_About_Mari.webp` | novo — retrato da Mari de preto (fornecido pelo usuário) |

### Commits Fase 6

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `af9cb33` | fotos reais do hero e do about (substituem os 2 placeholders SVG) + revisão de responsivo extra (320/768/1024px) |

### Relatório da Fase 6 — o que mudou na prática

**Antes:** hero e about tinham ilustrações SVG de placeholder ("FOTO · ... /
substituir por foto real").
**Agora:** as 2 fotos reais que o usuário forneceu (copiadas pra `images/` como
`Home_Hero_Tatame.webp` e `Home_About_Mari.webp`) substituem os placeholders — mesmo
padrão já usado nas 6 LPs (`<img>` com `object-fit: cover`, preenchendo o frame sem
distorcer). Diferente das LPs, o `src` aqui é caminho relativo (`images/...`), não URL
absoluta do WordPress — correto porque a home não vai ser colada no WordPress, é
standalone (ver decisão de arquitetura no topo deste arquivo).

Também: revisão de responsivo extra em 320px, 768px (breakpoint exato) e 1024px
(tablet, acima do breakpoint — nav volta a mostrar o menu completo), além dos
375-390px já testados nas fases anteriores. Em nenhum dos casos há scroll horizontal
(`document.documentElement.scrollWidth` bate exatamente com `clientWidth` em todos os
tamanhos testados) e nenhuma seção quebra visualmente — inclusive em NL, cujos textos
tendem a ser mais longos que o EN.
**Para validar:** Cenário 1 (visual, ambas as fotos aparecem corretamente e cobrem o
frame sem distorcer, em desktop e mobile).

### Fase 6.1 — Troca pelas fotos em maior resolução já existentes no projeto

O usuário apontou que as imagens já usadas nas LPs (`images/LP3_Experience.png` —
mesma sala/tatame com velas, resolução 1254×1254 — e `images/LP1_hero.png` —
retrato da Mari em estúdio, mesma sessão de fotos da imagem original, resolução
1086×1448) têm qualidade melhor que os `.webp` enviados por fora do projeto
(originais provavelmente recomprimidos por app de mensagem antes de chegar aqui).

Reconvertidos com Pillow (`quality=85`, mesmo padrão das LPs) para os mesmos nomes de
arquivo já referenciados no HTML — não precisou mexer em `home-en.html`/`home-nl.html`:

| Arquivo | Antes | Depois |
|---|---|---|
| `images/Home_Hero_Tatame.webp` | 306 KB (fonte externa) | 197 KB, gerado a partir de `LP3_Experience.png` |
| `images/Home_About_Mari.webp` | 31 KB (fonte externa) | 115 KB, gerado a partir de `LP1_hero.png` |

**Testado:** desktop e mobile, EN e NL, console limpo — nítida melhora de definição
em ambas as fotos.

### Fase 7 — Hospedagem fora do WordPress (pendência de infraestrutura)

Não bloqueia as fases 1–6. Decisão tomada pelo usuário (2026-09-08): sair da
TurboCloud, migrar `amarigomes.com` inteiro (home **e** as 6 LPs) pra GitHub Pages
com Cloudflare na frente — mesmo padrão de outros projetos do Daniel, elimina o custo
de hospedagem. Passo a passo completo (quem faz o quê, e os prompts prontos pra cada
etapa que precisa de mim) em
[`docs/hospedagem-github-pages-cloudflare.md`](../hospedagem-github-pages-cloudflare.md).
Operada pelo próprio Daniel; eu entro só nas etapas marcadas "Eu faço" nesse doc.

---

## Checks de Validação

### Cenário 1 — Fase 1 renderiza e é responsiva
- [x] Abrir `home-en.html` e `home-nl.html` no navegador
- [x] Confirmar: paleta/tipografia nova aplicada, nav fixo funciona, bandeiras
      GTranslate aparecem, footer com dados corretos
- [x] Redimensionar pra mobile (768px) e confirmar nav/footer responsivos
- **Validado em:** 2026-09-08 — via Chrome DevTools MCP (desktop 1440px e mobile
      ~375-390px), EN e NL, sem erros de console.

### Cenário 2 — Navegação e links de modalidade (Fase 2+)
- [x] Cada card de modalidade abre a LP certa, no idioma certo
- [x] Menu âncora rola até a seção certa, sem esconder atrás do nav fixo
- **Validado em:** 2026-09-08 — hrefs conferidos (lp1/lp2/lp3-en/nl.html), âncoras
      testadas via navegação direta (`#location`, `#faq`) sem sobreposição do nav.

### Cenário 3 — FAQ, mapa, WhatsApp (Fase 4/5)
- [x] Accordion do FAQ abre/fecha
- [x] Mapa carrega sem erro "must be used in an iframe"
- [x] Links de WhatsApp com texto pré-preenchido e encoding corretos em EN e NL
- [x] Clique no WhatsApp dispara evento de conversão (mesmo mecanismo das LPs)
- **Validado em:** 2026-09-08 — accordion testado via clique simulado (classe `open`
      aplicada corretamente); mapa conferido abrindo direto em `#location` (pin real
      da Mari aparece); tracking conferido inspecionando `window.dataLayer` após
      clique num link `wa.me` (gtag.js carregado sob demanda + evento de conversão
      disparado).

### Cenário 4 — Fotos reais e responsivo extra (Fase 6)
- [x] Foto do hero (tatame) aparece corretamente, cobrindo o frame sem distorcer
- [x] Foto do about (retrato) aparece corretamente, cobrindo o frame sem distorcer
- [x] Sem scroll horizontal em 320px, 768px e 1024px
- **Validado em:** 2026-09-08 — via Chrome DevTools MCP, EN e NL, desktop e mobile,
      `scrollWidth` = `clientWidth` em todos os tamanhos testados, sem erros de
      console.

---

## Ajustes Possíveis Pós-Implementação

Gaps que dependem de resposta da Mary (hospedagem/DNS, copy de "Sobre a Mari", etc.)
estão centralizados em [`docs/pendencias-mary.md`](../pendencias-mary.md) — não
repetir a lista aqui, só linkar. Atualizar aquele arquivo sempre que surgir um gap
novo nas próximas fases.
