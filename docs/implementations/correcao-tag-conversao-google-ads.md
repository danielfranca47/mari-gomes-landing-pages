# Correção da tag de conversão do Google Ads (pós-migração GitHub Pages)

**Status:** Fase 1 implementada (aguardando push + confirmação no painel do Ads). Fase 2 pendente.

---

## Motivação

Em 27/09/2026 o Daniel notou no Google Ads da Mari que as conversões pararam de ser
registradas desde 10/09. A campanha ativa ([CP-03] Holistische Massage Amsterdam #3)
usa **Maximizar conversões** com €15/dia — ou seja, o algoritmo passou 18 dias
otimizando sem nenhum sinal de conversão.

---

## Problemas Identificados (estado anterior)

1. **gtag.js carregado com ID que o Google não serve.** Na Fase C da migração
   (`be55425`, 09/09) as páginas passaram a carregar
   `googletagmanager.com/gtag/js?id=G-EBY5JJD27V`. Esse ID é só um *destino* da tag
   combinada "Mari Gomes" (`GT-55XJZX3L`, que tem os destinos `AW-18036442650` e
   `G-EBY5JJD27V`); pedido sozinho, o Google responde **404** (HTML), o Chrome bloqueia
   (`ERR_BLOCKED_BY_ORB`) e nenhum hit sai — nem a conversão do WhatsApp
   ("Solicitar cotação", `AW-18036442650/9rp5CIvso6QcEJqMuZhD`), nem o GA4.
   - Painel do Ads confirmou: última conversão de "Solicitar cotação" em
     **09/09/2026 13:00**, status "Configuração incorreta", qualidade da tag "Urgente".
   - Antes da migração (WordPress) o script da LP carregava
     `gtag/js?id=AW-18036442650`, que funciona.
   - Na validação da Fase C o bloqueio ORB apareceu no console e foi descartado como
     "aviso benigno do `file://`" — não era.
2. **Fotos das 6 LPs quebradas.** Os `<img>` apontam pra
   `amarigomes.com/wp-content/uploads/2026/06/*.webp`, que retorna 404 desde a troca
   de DNS. Os arquivos existem em `images/`.
3. *(Secundário, fora do escopo)* Consent Mode default `denied`: quem clica no
   WhatsApp sem responder o banner gera só ping sem cookie; conta pequena não tem
   volume pra modelagem, então essas conversões tendem a não aparecer.

---

## Plano de Implementação

### Fase 1 — Loader do gtag.js → `GT-55XJZX3L` (24 páginas + 2 cópias legadas da home)

| Arquivo | O que muda |
|---|---|
| 6 LPs (pastas + `.html` legados na raiz), home (`index.html`, `nl/index.html`, `home-*.html`), 5 páginas institucionais × 2 idiomas | `gtag/js?id=G-EBY5JJD27V` → `gtag/js?id=GT-55XJZX3L` |

As linhas `gtag('config', 'G-EBY5JJD27V')` / `gtag('config', 'AW-18036442650')` e o
evento de conversão não mudam.

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `0e51640` | troca do loader em 26 arquivos + `.claude/settings.local.json` no `.gitignore` |

**Relatório da Fase 1.**
**Antes:** o script do Google não carregava em nenhuma página; cliques no WhatsApp não
viravam conversão e o GA4 não recebia nada.
**Agora:** o script carrega e o clique no WhatsApp envia a conversão pra conta de Ads.
**Para validar:** Cenários 1 e 2.

### Fase 2 — Fotos das LPs apontando pra `/images/`

| Arquivo | O que muda |
|---|---|
| `holistic-energy-massage-{en,nl}/`, `relaxation-massage-{en,nl}/`, `couples-massage-{en,nl}/` + os 6 `lp*.html` | `https://amarigomes.com/wp-content/uploads/2026/06/` → `/images/` |
| `CLAUDE.md` | regra antiga ("usar URL do WordPress no `src`") substituída pela nova (`/images/...`) |

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | *(ver abaixo)* | 24 referências de imagem em 12 arquivos + regra no CLAUDE.md |

**Relatório da Fase 2.**
**Antes:** as fotos principais e do About das 6 LPs davam 404 (WordPress desligado).
**Agora:** as fotos são servidas pelo próprio site, a partir da pasta `images/`.
**Para validar:** Cenário 3.

---

## Checks de Validação

### Cenário 1 — Conversão dispara (servidor local)
- [x] Sem responder ao banner: gtag carrega (200), clique no WhatsApp envia
  `pagead/conversion/18036442650` com `gcs=G100` (sem cookies)
- [x] Após "Accept": cookie `_gcl_aw` grava o `gclid`, conversão enviada com
  `gcs=G111` em `googleadservices.com/pagead/conversion/18036442650`
- **Validado em:** 27/09/2026 — `http://localhost:8765/holistic-energy-massage-en/?gclid=TEST_GCLID_123`, Chrome DevTools MCP

### Cenário 2 — Em produção
- [x] Após o push, repetir o Cenário 1 em produção — 27/09/2026, `https://amarigomes.com/holistic-energy-massage-nl/?gclid=TEST_PROD_GCLID`: loader `GT-55XJZX3L` carrega; conversão com label `9rp5CIvso6QcEJqMuZhD` enviada sem consentimento (`gcs=G100`) e com consentimento (`gcs=G111`, cookie `_gcl_aw` com o gclid). Conferido também que as 9 URLs principais servem o loader novo.
- [x] Qualidade da tag sai de "Urgente" — 27/09/2026 ~15:00 (CEST): "Bom"; "Solicitar cotação" passou de "Configuração incorreta" para "Conversões pendentes"
- [ ] "Solicitar cotação" volta a "Ativa" (primeira conversão registrada após 27/09)

### Cenário 3 — Fotos das LPs
- [x] Local (servidor HTTP): as 12 imagens das 6 LPs respondem 200 e decodificam (1086×1448, 1173×1341, 1161×1355, 1254×1254) — 27/09/2026
- [ ] Produção: as 6 LPs publicadas carregam hero/about sem 404 (após push)

---

## Ações no painel (Daniel)

- Não aceitar a sugestão de subir o orçamento pra €29/dia enquanto a medição não
  normalizar.
- [x] "Mary Gomes - Massagista (web) Clique_Botao_Contato" (importada do GA4, evento
  que não existe no código novo) rebaixada de Principal para Secundária — 27/09/2026.
- [x] Exclusões de dados criadas na CP-03 (fuso da conta: CEST, GMT+2), divididas em 2
  porque o Ads limita cada exclusão a 14 dias: 09/09 13:00 → 23/09 13:00 e
  23/09 13:00 → 27/09 14:30 — 27/09/2026. Não aplicadas à campanha pausada
  "[CP-03] ... (backup ignorar)".
