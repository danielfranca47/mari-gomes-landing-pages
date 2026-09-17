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

### Fase 2 — Teaser `.about` da Home (4 arquivos)

**Objetivo:** mesclar 1 frase da bio recuperada no teaser existente, sem
remover o texto real de `home.txt`.

| Arquivo | O que muda |
|---|---|
| `index.html` | Nova frase inserida antes do bloco de stats |
| `nl/index.html` | Idem, tradução NL |
| `home-en.html` | Idem, espelha `index.html` |
| `home-nl.html` | Idem, espelha `nl/index.html` |

### Fase 3 — Atualizar `docs/pendencias-mary.md`

**Objetivo:** refletir nos 6 arquivos onde a bio recuperada já foi aplicada
como rascunho, mantendo a pendência de confirmação aberta.

| Arquivo | O que muda |
|---|---|
| `docs/pendencias-mary.md` | Pendência #1 atualizada ("Onde é usado" + nota de status) |

---

## Checks de Validação

### Cenário 1 — About page (EN/NL)
- [ ] Abrir `about/index.html` e `nl/about/index.html` no navegador
- [ ] Confirmar que o novo texto renderiza corretamente no grid `.about-detail`
- [ ] Redimensionar pra mobile (768px) e confirmar que não quebra

### Cenário 2 — Teaser da Home (4 arquivos)
- [ ] Abrir `index.html`, `nl/index.html`, `home-en.html`, `home-nl.html`
- [ ] Confirmar que a nova frase aparece entre o parágrafo existente e o bloco de stats
- [ ] Confirmar que EN e NL dizem a mesma coisa (par espelhado)

---

## Ajustes Possíveis Pós-Implementação

- Quando a Mary confirmar (ou não) o dado "massagens próprias que também
  ensina", atualizar os 6 arquivos e fechar a pendência #1.
- Quando a Mary informar anos de experiência/certificação, os parágrafos
  conceituais de `about/index.html`/`nl/` podem ganhar números reais.
