# Aplicar bio real recuperada do WordPress na seção About

**Status:** Em andamento

---

## Motivação

Recuperamos (`docs/texto-do-site/about.txt`) uma bio real da Mari que estava
publicada no WordPress antigo (export Elementor, antes do cancelamento da
hospedagem). É texto de terceira pessoa, sem números de anos/certificação,
mas traz conteúdo real (não placeholder inventado) — incluindo o dado novo de
que ela "developed her own massages which she not only performs but also
teaches".

---

## Problemas Identificados (estado anterior)

1. **`.about-detail` genérica:** `about/index.html` e `nl/about/index.html`
   tinham um parágrafo de abertura 100% genérico (comentário `COPY DRAFT`),
   sem nenhum fato específico da Mari.
2. **Teaser da Home sem o dado do método próprio:** o teaser `.about` da Home
   (`index.html`, `nl/index.html`, `home-en.html`, `home-nl.html`) já usa
   texto real de `home.txt`, mas não menciona que ela desenvolveu massagens
   próprias que também ensina — dado presente na bio recuperada.

---

## Abordagem

- `about/index.html` / `nl/about/index.html`: substituir o parágrafo
  genérico por 2 parágrafos adaptados em 1ª pessoa da bio recuperada
  (identidade profissional + método/massagens próprias). Parágrafos
  conceituais seguintes ficam intactos.
- Home (4 arquivos): mesclar — manter a narrativa/números de `home.txt`
  intactos, inserindo 1 frase nova sobre o método próprio, sem descartar o
  texto real já em uso.
- Ambas as inserções levam comentário `COPY DRAFT` marcando que o dado
  "massagens próprias que também ensina" segue pendente de confirmação da
  Mary (pendência #1 em `docs/pendencias-mary.md`).

---

## Plano de Implementação

### Fase 1 — `.about-detail` de `about/index.html` + `nl/about/index.html`

**Objetivo:** substituir o parágrafo genérico por texto adaptado da bio real
recuperada.

| Arquivo | O que muda |
|---|---|
| `about/index.html` | Parágrafo genérico → 2 parágrafos adaptados (EN) da bio recuperada |
| `nl/about/index.html` | Idem, tradução NL (espelhado) |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `1fefe2a` | Reescreve `.about-detail` de `about/index.html` + `nl/about/index.html` |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** a página About tinha um parágrafo de abertura genérico, sem
nenhum fato específico da Mari.
**Agora:** o parágrafo de abertura usa a bio real recuperada do WordPress
antigo, adaptada em 1ª pessoa (especialista em massagem energética, técnica
+ sensibilidade, "luxo da presença", massagens próprias que também ensina —
essa última marcada como pendente de confirmação).
**Para validar:** Cenário 1, abaixo.

### Fase 2 — Teaser `.about` da Home (4 arquivos)

**Objetivo:** mesclar 1 frase da bio recuperada no teaser existente, sem
remover o texto real de `home.txt`.

| Arquivo | O que muda |
|---|---|
| `index.html` | Nova frase inserida antes do bloco de stats |
| `nl/index.html` | Idem, tradução NL |
| `home-en.html` | Idem, espelha `index.html` |
| `home-nl.html` | Idem, espelha `nl/index.html` |

### Commits Fase 2

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `e11d810` | Mescla frase da bio recuperada no teaser `.about` da Home (4 arquivos) |

### Relatório da Fase 2 — o que mudou na prática

**Antes:** o teaser About da Home não mencionava que a Mari desenvolveu
massagens próprias que também ensina.
**Agora:** 1 frase nova foi inserida entre o parágrafo existente (real, de
`home.txt`) e o bloco de stats, sem remover nada do texto já em uso.
**Para validar:** Cenário 2, abaixo.

### Fase 3 — Atualizar `docs/pendencias-mary.md`

**Objetivo:** refletir nos 6 arquivos onde a bio recuperada já foi aplicada
como rascunho, mantendo a pendência de confirmação aberta.

| Arquivo | O que muda |
|---|---|
| `docs/pendencias-mary.md` | Pendência #1 atualizada ("Onde é usado" + nota de status) |

### Commits Fase 3

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `2bf52b1` | Atualiza pendência #1 com nota de aplicação nos 6 arquivos |

### Relatório da Fase 3 — o que mudou na prática

**Antes:** a pendência #1 não refletia que o texto já tinha sido aplicado.
**Agora:** a pendência lista onde o rascunho foi aplicado e segue aberta até
resposta da Mary sobre anos/certificação/confirmação do método próprio.
**Para validar:** não há check visual — é atualização de documentação.

---

## Fase 4 — Diagnóstico + Correção (2026-09-20)

### Problema identificado

O teaser About da Home usava o texto do `home.txt`, tratado como "texto real
da Mary". Na verdade é cópia verbatim do About de tantrana.nl (história da
Índia, stats "Years Studying in India", etc.; o arquivo tem até a assinatura
"Tantrana"). A Fase 2 preservou esse texto e colou uma frase da bio real logo
depois dele. Causa raiz: o `home.txt` nunca foi verificado contra a fonte.

### Correção

| Arquivo | Mudança |
|---|---|
| `index.html`, `nl/index.html`, `home-en.html`, `home-nl.html` | Título, parágrafos e bloco de stats do About substituídos por versão curta da bio recuperada (2 parágrafos, sem números) |
| `CLAUDE.md` | Aviso de que `docs/texto-do-site/` contém texto copiado da Tantrana; regra de não afirmar fatos biográficos sem confirmação |
| `docs/pendencias-mary.md` | #1 e #7 corrigidas; nova #10 (auditar o resto do conteúdo contra tantrana.nl) |

### Commits Fase 4

Ver `git log` (mensagem "corrige About da Home: remove texto copiado da Tantrana").

---

## Checks de Validação

### Cenário 1 — About page (EN/NL)
- [ ] Abrir `about/index.html` e `nl/about/index.html` no navegador
- [ ] Confirmar que o novo texto renderiza corretamente no grid `.about-detail`
- [ ] Redimensionar pra mobile (768px) e confirmar que não quebra

### Cenário 2 — Teaser da Home (4 arquivos)
- [ ] Abrir `index.html`, `nl/index.html`, `home-en.html`, `home-nl.html`
- [ ] Confirmar que o About mostra só os 2 parágrafos da bio recuperada, sem bloco de stats nem menção à Índia
- [ ] Confirmar que EN e NL dizem a mesma coisa (par espelhado)

---

## Ajustes Possíveis Pós-Implementação

- Quando a Mary confirmar (ou não) o dado "massagens próprias que também
  ensina", atualizar os 6 arquivos e fechar a pendência #1.
- Quando a Mary informar anos de experiência/certificação, os parágrafos
  conceituais de `about/index.html`/`nl/` podem ganhar números reais.
