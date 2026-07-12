# Processo de Graduação: Implementação → Arquitetura

Quando um arquivo de `docs/implementations/` está **completo e validado**, o
conteúdo relevante deve ser "graduado" para `docs/architecture/` (ou para o
`CLAUDE.md`, se for uma convenção que afeta todas as páginas).

---

## Quando executar este processo

1. O arquivo tem `**Status:** Todos os cenários validados`
2. Todos os checks obrigatórios estão `[x]`
3. Não há fases abertas sem commit associado

---

## Passo 1 — Identificar o que foi afetado

| A implementação afetou... | Onde documentar |
|---|---|
| Convenção que vale pras 6 páginas (ex.: novo padrão de seção, nova regra de link) | `CLAUDE.md`, seção "Convenções ao editar" |
| Comportamento específico de uma seção nova (ex.: como o mapa/localização funciona) | `docs/architecture/<slug>.md` |
| Dado de contato/negócio que mudou (WhatsApp, e-mail, Instagram) | `CLAUDE.md`, seção "Contato / dados de negócio" |

---

## Passo 2 — Ler o que já existe

Ler o `CLAUDE.md` na íntegra (é curto) e qualquer doc já existente em
`docs/architecture/` antes de decidir onde a informação deve entrar.

---

## Passo 3 — Atualizar

- Reescrever apenas a seção afetada — sem "antes era X, agora é Y" no texto.
- Se a mudança introduz um padrão novo que deve se repetir (ex.: como
  adicionar uma seção nova ao menu), isso vai para "Convenções ao editar" do
  `CLAUDE.md`, não para um doc separado.
- Se for uma seção grande e específica (como a de localização/mapa), criar
  `docs/architecture/<slug>.md`.

---

## Passo 4 — Deletar o arquivo de implementação

```bash
git rm docs/implementations/<nome-do-arquivo>.md
```

**O que NÃO precisa migrar:** histórico de fases, notas de validação com
data (ficam nos commits).

**O que SIM precisa migrar:** convenções novas, dados de contato atualizados,
comportamento de seções não-óbvias.

---

## Passo 5 — Commit único

```
docs: gradua <slug-da-feature> → atualiza CLAUDE.md/docs/architecture

- CLAUDE.md: <o que foi atualizado>
- remove docs/implementations/<arquivo>.md (todos os checks validados)
```

---

## Manutenção deste processo

Se o processo mudar, atualizar este arquivo para refletir o padrão atual.
