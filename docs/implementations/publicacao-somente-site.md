# Publicar no ar só o site (não o repositório inteiro)

**Status:** Todos os cenários validados (01/11/2026)

---

## Motivação

Em 01/11/2026 foi constatado que o GitHub Pages publicava o repositório inteiro:
`amarigomes.com/CLAUDE.md`, `/docs/…`, `/trafego/…` (relatórios, vendas,
backlog) e `/.agents/product-marketing.md` respondiam 200. Além da exposição de
dados da cliente, documentos sobre vocabulário e reprovações de política ficavam
no mesmo domínio das páginas de anúncio que o revisor do Google rastreia.

## Abordagem

Trocar a publicação "deploy from branch" (repositório inteiro) por um workflow do
GitHub Actions que monta `_site/` com **lista de permissão**: `.html` da raiz,
`CNAME`, `.nojekyll`, `images/` e toda pasta de 1º nível com `index.html`
(inclui automaticamente prévias `-v2`), exceto `docs/`, `trafego/`, `scripts/`.
Uma trava aborta a publicação se algum `.md` ou pasta interna entrar.

Descartado: bloquear caminhos no Cloudflare — resolve o sintoma, mas qualquer
pasta nova volta a ficar pública.

## Plano de Implementação

### Fase 1 — Workflow + troca da origem do Pages

| Arquivo | O que muda |
|---|---|
| `.github/workflows/pages.yml` | Novo: monta e publica só o site |
| Configuração do Pages (GitHub) | Origem `legacy` (branch) → `workflow` (Actions) |
| `CLAUDE.md` | Regra: o que é publicado e como |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `2faec2d` | Workflow, CLAUDE.md e este arquivo; origem do Pages trocada para `workflow` via API |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** qualquer arquivo do repositório abria em amarigomes.com.
**Agora:** só as páginas do site são publicadas; documentação interna dá 404.

## Checks de Validação

### Cenário 1 — Site continua no ar
- [x] `/`, `/nl/`, as 6 LPs e as páginas institucionais respondem 200
- [x] Imagens `/images/*.webp` respondem 200
- **Validado em:** 01/11/2026 — run 41359865381 "Publicar site" com sucesso; 13 URLs públicas com 200

### Cenário 2 — Interno fora do ar
- [x] `/CLAUDE.md`, `/docs/pendencias-mary.md`, `/trafego/backlog.md`, `/.agents/product-marketing.md`, `/.claude-ads/setup-profile.json` respondem 404
- **Validado em:** 01/11/2026 — com e sem parâmetro anti-cache

## Ajustes Possíveis Pós-Implementação

- Repositório privado: GitHub Pages em repositório privado exige plano pago
  (GitHub Pro/Team). No plano gratuito, tornar privado tira o site do ar —
  alternativa gratuita: hospedar pelo Cloudflare Pages a partir do repositório privado.
