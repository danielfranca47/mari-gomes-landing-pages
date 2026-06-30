# Mari Gomes — Landing Pages

## O que é este projeto

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

Os 12 placeholders já foram substituídos (Fase 2 concluída). As imagens reais estão em `images/` no formato `.webp` (convertidas de PNG original — WebP reduz ~94% do peso do arquivo mantendo a qualidade, importante para velocidade de carregamento/SEO). Os `.png` originais ficaram guardados na mesma pasta como backup/fonte, mas não são referenciados pelo HTML.

## Contato / dados de negócio (usados em botões, footer, links de WhatsApp)

- WhatsApp: `+31 634 366 008` → `https://wa.me/31634366008?text=...` (texto pré-preenchido, URL-encoded, varia por página e idioma)
- E-mail: `marycontato@gmail.com`
- Instagram: `@kirakundalini` → `https://www.instagram.com/kirakundalini/`
- Site/logo: `https://amarigomes.com`

Esses 4 destinos se repetem em nav, hero, seções de CTA e footer em todas as 6 páginas. Ver `IMPLEMENTACAO.md` Fase 1 para o mapeamento completo de cada botão.

## Convenções ao editar

- **Espelhar mudanças estruturais/de link entre o par EN/NL da mesma LP.** Texto (copy) muda por idioma, mas links, contatos e estrutura de seções devem ficar em sincronia entre `*-en.html` e `*-nl.html` da mesma página.
- Mudanças que afetam **todas as 6 páginas** (ex.: troca de número de WhatsApp, e-mail, Instagram, domínio do logo) precisam ser aplicadas nos 6 arquivos — não há include/partial compartilhado.
- Manter o breakpoint responsivo único em `max-width: 768px` (já usado em todas as páginas).
- Manter o padrão do FAQ: `<div class="faq-q" onclick="toggleFaq(this)">` + `<span>+</span>`, função `toggleFaq` no `<script>` final do arquivo.
- Links de WhatsApp usam texto pré-preenchido via `?text=` com `%XX` encoding — ao alterar a mensagem, manter o encoding válido (espaços como `%20`, apóstrofo como `%27`, etc.).
- Não introduzir dependências externas (frameworks JS, build tools) — o objetivo é manter os arquivos simples e portáveis para colar/publicar no WordPress da cliente.
- Existe uma classe `.btn-outline` definida no CSS da LP1 que não é usada em nenhum HTML — é resíduo, não precisa de ação a menos que peçam um botão secundário.

## Fluxo de trabalho deste projeto

Ver `IMPLEMENTACAO.md` para o plano de fases (botões → imagens → QA e publicação no WordPress da Mary).

## Git

Este projeto tem repositório no GitHub: `danielfranca47/mari-gomes-landing-pages` (público).

**Ao final de toda atualização (qualquer mudança nos arquivos do projeto), fazer commit com resumo das atualizações.** Não deixar trabalho concluído sem commit — cada rodada de edições termina com um `git add` + `git commit` descrevendo o que mudou. Perguntar ao usuário apenas se o push para o remoto deve ser feito também; o commit local em si não precisa de confirmação prévia.
