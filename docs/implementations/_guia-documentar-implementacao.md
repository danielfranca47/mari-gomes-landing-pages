# Guia: Como Documentar uma Implementação

Este arquivo é um guia de instrução para o Claude. Leia-o antes de criar
qualquer arquivo em `docs/implementations/`.

> **Não confundir com `IMPLEMENTACAO.md`/`ENTREGA.md` na raiz** — esses são o
> plano histórico das 3 fases originais do projeto (botões → imagens → QA e
> publicação). Esta pasta é o processo para mudanças **novas**, a partir de
> agora.

---

## Quando este guia se aplica

O Mary/Daniel pediu uma mudança não-trivial numa das 6 landing pages. Pode ser:

- "Quero adicionar uma seção nova de X"
- "Trocar o número de WhatsApp em todas as páginas"
- "A página X está com um bug de layout no mobile"

Para ajustes pequenos e óbvios (corrigir um texto, trocar uma cor específica
que o usuário já apontou exatamente onde) este guia pode ser pulado — mas
ainda vale registrar o commit com uma mensagem clara.

---

## Passo 0 — Diagnóstico em Plan Mode (obrigatório para mudanças não-triviais)

Antes de editar os arquivos `.html`, entrar em Plan Mode e responder:

### 1. Essa seção/comportamento já existe?

Ler os arquivos `.html` afetados (lembrar: **6 arquivos**, LP1/LP2/LP3 × EN/NL)
e verificar se algo parecido já existe. Citar arquivo e trecho.

### 2. O que precisa ser construído?

- Quais dos 6 arquivos são afetados? (mudança visual costuma ser só numa LP;
  mudança de contato/link afeta as 6)
- Precisa espelhar a mudança entre o par EN/NL da mesma LP?
- Tem impacto no menu de navegação (`id` de seção + link)?
- Tem impacto nas URLs de imagem (WordPress, não `images/` relativo)?

### 3. Riscos e dependências

- Pode quebrar o CSS `<style>` de uma LP específica (lembrar: cada LP tem
  identidade visual própria, não compartilhada)?
- Depende de algo que Mary ainda não confirmou (foto real, texto definitivo)?

**Formato do plano no Plan Mode:**

```
## Diagnóstico

### Já existe?
<Sim / Parcialmente / Não> — <explicação com arquivos>

### O que precisa ser construído
<Lista das mudanças, por arquivo/página>

### Riscos e dependências
<Lista de riscos. "Nenhum" é uma resposta válida.>

### Proposta de fases
Fase 1 — <nome> — <objetivo em uma frase>
...
```

**Aguardar aprovação antes de avançar.**

---

## Passo 1 — Nomear e criar o arquivo

**Formato do nome:** `<slug-descritivo>.md`

Exemplos:
- `secao-precos-lp2.md`
- `troca-numero-whatsapp.md`
- `fix-menu-mobile-lp3.md`

---

## Passo 2 — Estrutura do arquivo a criar

> **Exemplo concreto preenchido:** [`_template-implementacao.md`](_template-implementacao.md)

```markdown
# <Título descritivo da mudança>

**Status:** Em andamento

---

## Motivação

<O que foi pedido e por quê.>

---

## Problemas Identificados (estado anterior)

1. **Nome do problema:** descrição + arquivo(s) onde ocorre.

---

## Abordagem

<Prosa ou ASCII descrevendo a solução.>

---

## Plano de Implementação

### Fase 1 — <Nome>

**Objetivo:** <uma frase>

| Arquivo | O que muda |
|---|---|
| `lp1-holistic-energy-en.html` | Descrição |
| `lp1-holistic-energy-nl.html` | Descrição (espelhado) |

---

## Checks de Validação

### Cenário 1 — <Descrição>
- [ ] Abrir o(s) arquivo(s) `.html` no navegador
- [ ] Ação (clicar, redimensionar pra mobile, etc.)
- [ ] O que confirmar visualmente

---

## Ajustes Possíveis Pós-Implementação

<Fora do escopo desta rodada.>
```

---

## Passo 3 — Ciclo de vida do arquivo

O arquivo **cresce** conforme a implementação avança — nunca reescrever o que
já foi documentado.

### Quando uma fase é implementada

```markdown
### Commits Fase N

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `<hash>` | Descrição resumida |
```

### Antes de pedir validação

**1. Relatório em linguagem simples:**

```markdown
### Relatório da Fase N — o que mudou na prática

**Antes:** <1-2 frases, sem jargão>
**Agora:** <1-2 frases>
**Para validar:** <Cenários desta fase>
```

**2. Pedir validação + prompt de retomada:**

> "Pode abrir o arquivo X no navegador e conferir [o quê]? Se preferir
> depois, cole: Lê `<arquivo>.md`, seção 'Fase N', e me diga o que falta
> validar."

### Quando um cenário é confirmado

```markdown
- [x] Confirmar: botão aparece com o novo link em todas as 6 páginas
- **Validado em:** 12/07/2026 — conferido nas 6 abas abertas
```

### Quando a validação revelar um problema

```markdown
## Fase N+1 — Diagnóstico + Correção (data)

### Problema identificado
<causa raiz>

### Correção
| Arquivo | Mudança |
|---|---|
```

### Quando estiver completo

```markdown
**Status:** Todos os cenários validados (DD/MM/AAAA)
```

Seguir [`_processo-graduacao-implementacao.md`](_processo-graduacao-implementacao.md).

---

## Validação dos checks

Este projeto não tem servidor/build — os arquivos `.html` abrem direto no
navegador. Duas formas de validar:

- **Abrir localmente e conferir visualmente** (o Claude pode usar o Chrome
  DevTools MCP, se disponível, pra abrir o arquivo e inspecionar), ou
- **Aguardar o usuário** abrir e reportar.

Se a mudança já foi publicada no WordPress da Mary, adicionar um Cenário
específico pra conferir no site publicado (não só no `.html` local).

---

## Regras de escrita

1. Registrar decisões descartadas com o porquê, em uma frase.
2. Causa raiz explícita em correções.
3. Antes/depois de código só quando não-óbvio.
4. Sem histórico acumulado no texto — isso fica nos commits.
5. Tabela de arquivos sempre presente por fase (lembrar do par EN/NL).
6. Checks realistas e executáveis.
7. Relatório em linguagem simples por fase, sempre antes de pedir validação.

---

## Nota

O arquivo `.md` só é criado após o plano ser aprovado (ou imediatamente, pra
mudanças triviais). É o contrato vivo entre o usuário e o Claude durante o
desenvolvimento da mudança.
