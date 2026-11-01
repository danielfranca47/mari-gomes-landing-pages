# Gestão de tráfego (Google Ads) dentro do repositório

**Status:** Fases 1 e 2 implementadas (26/10/2026); Fase 3 reformulada (ecossistema) em 01/11/2026 — aguardando aprovação

---

## Motivação

O Daniel quer sistematizar a gestão de tráfego pago da Mari (Google Ads) no
mesmo repositório das LPs: registrar o estado da conta, mudanças, reprovações
de política, relatórios e experimentos, para que cada ciclo de trabalho parta
do anterior em vez de começar do zero. Também definir quais skills ficam no
repositório e quais ficam globais.

---

## Problemas Identificados (estado anterior)

1. **Nenhum registro da conta no repositório.** Os relatórios de 12/10 e
   26/10/2026 existem só num doc do Claude; não há histórico versionado de
   campanhas, anúncios, URLs finais ou orçamento.
2. **Mudanças na conta sem log nem revisão.** Em 22/10/2026 foram aceitas pelo
   app 4 recomendações do Google (orçamento da [CP-03] #4 de €15 para €28/dia,
   irreversível, e palavras-chave amplas como "thuis massage amsterdam"); o CPA
   diário piorou depois. Não existe regra combinada sobre recomendações.
3. **Mudança em LP não é cruzada com o Ads.** Em 27/09/2026 a LP2
   (`relaxation-massage-en/`) virou "Tantric Holistic Relaxation" (commits
   `c770df4`, `41ecee7`); a partir de ~1/10 o anúncio "Relaxation Massage", que
   aponta para essa URL, aparece reprovado por "encontros e acompanhantes".
   Hipótese forte, não confirmada — mas hoje nada no repositório liga um commit
   de LP a uma revisão de anúncio.
4. **Vocabulário de risco só cobre as LPs.** O CLAUDE.md lista termos a evitar
   nas páginas, mas não nos anúncios nem nas palavras-chave/negativas.
5. **Conflito em aberto:** o relatório de 26/10 recomenda negativar
   "tantra/tantric", mas as LP1 e LP2 usam "Tantric" no nome do serviço
   (pendência #8, risco aceito). Precisa de decisão de posicionamento.

---

## Abordagem

Tráfego vira um **terceiro escopo** do repositório (ao lado do funil de LPs e
do site institucional), numa pasta própria na raiz:

```
trafego/
  README.md                escopo, rotina semanal, regras
  conta.md                 retrato atual: campanhas, grupos, anúncios, URL final, orçamento, lances
  alteracoes.md            log de toda mudança na conta + commits de LP usadas como URL final
  politicas/
    reprovacoes.md         histórico: anúncio, política, LP, ação, resultado
    vocabulario.md         termos permitidos/proibidos EN/NL (anúncio, keyword, LP)
  anuncios/                textos versionados antes de subir no Ads (fonte da verdade)
  keywords/
    negativas.md           lista proposta/aplicada, com data
  experimentos/
    _template.md           hipótese, variante, métrica, critério de parada, resultado
  relatorios/
    2026-10-12_reprovacoes.md
    2026-10-26_atualizacao.md
```

Ciclo semanal: coletar → registrar → diagnosticar → propor → aprovar →
aplicar → registrar.

**Skills — onde ficam:**

- **Globais (fora do repo):** `find-skills` e as genéricas de método
  (coreyhaines31: `ads`, `copywriting`, `ad-creative`, `cro`,
  `conversion-tracking`, `ab-testing`); plugins (Preflight, AdvisorPPC/Ryze)
  ficam na conta do Claude.
- **No repo (`.claude/skills/`):** só skills com contexto da Mari:
  `mari-ads-compliance`, `mari-relatorio-semanal`,
  `mari-mudanca-lp-com-anuncio`.

Decisões descartadas:
- Copiar skills genéricas para o repo — desatualizam em cada cópia e não têm
  contexto da Mari.
- Guardar tráfego em `docs/` — `docs/` documenta o código das páginas; tráfego
  é outro produto com ciclo próprio.
- Versionar exports CSV brutos do Ads — dado volátil e pesado; o relatório em
  markdown guarda os números que importam.

---

## Plano de Implementação

### Fase 1 — Estrutura `trafego/` + registros históricos

**Objetivo:** ter a pasta criada e preenchida com o que já sabemos (relatórios
de 12/10 e 26/10, reprovações, alterações), sem mudar nada no Ads nem nas LPs.

| Arquivo | O que muda |
|---|---|
| `trafego/README.md` | Novo: escopo, rotina, regras |
| `trafego/conta.md` | Novo: estado em 26/10/2026 |
| `trafego/alteracoes.md` | Novo: log 01/10–26/10 + commits de LP 27/09 e 04/10 |
| `trafego/politicas/reprovacoes.md` | Novo: "Relaxation Massage" #3/#4 + CP-01 |
| `trafego/politicas/vocabulario.md` | Novo: termos do CLAUDE.md + termos reprovados; "tantric" marcado como decisão em aberto |
| `trafego/keywords/negativas.md` | Novo: lista proposta (não aplicada) |
| `trafego/experimentos/_template.md` | Novo |
| `trafego/anuncios/README.md` | Novo: convenção de arquivo por grupo |
| `trafego/relatorios/2026-10-12_reprovacoes.md` | Novo: relatório de 12/10 |
| `trafego/relatorios/2026-10-26_atualizacao.md` | Novo: relatório de 26/10 |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 0 | `1781f4d` | Plano (este arquivo) + índice em `docs/implementations/README.md` |
| 1 | `788bfbe` | Pasta `trafego/` com 10 arquivos: conta, alterações, reprovações, vocabulário, negativas, templates e relatórios de 12/10 e 26/10 |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** o que se sabia da conta do Google Ads estava só em documentos soltos do Claude.
**Agora:** o repositório tem a pasta `trafego/` com o estado da conta, o log de
alterações (incluindo os commits de LP de 27/09), o histórico de reprovações, a
lista de termos a evitar e os dois relatórios. Nada mudou no Ads nem nas LPs.
**Para validar:** Cenário 1, abaixo.

**Correção na própria fase:** o repositório é público, então dados de faturamento
(cartão, saldo) e e-mails de login foram retirados de `trafego/` antes do push
(commits locais reescritos; regra registrada no CLAUDE.md na Fase 2).

### Fase 2 — CLAUDE.md + índice

**Objetivo:** o Claude saber que o escopo existe e seguir as regras.

| Arquivo | O que muda |
|---|---|
| `CLAUDE.md` | Escopo 3 "Gestão de tráfego" + regras: conta só leitura por padrão; toda mudança no `alteracoes.md`; recomendação do Google só após revisão; anúncio novo passa pelo `vocabulario.md` (e Preflight); commit em LP usada como URL final é anotado no `alteracoes.md` |
| `docs/implementations/README.md` | Lista esta implementação |

### Commits Fase 2

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `976de60` | CLAUDE.md: 3º escopo, seção "Gestão de tráfego (Google Ads)", convenção de LP como URL final |

### Relatório da Fase 2 — o que mudou na prática

**Antes:** o CLAUDE.md não sabia que existia gestão de tráfego no repositório.
**Agora:** toda sessão do Claude no repositório lê que a conta do Ads é só
leitura por padrão, que mudanças vão para `trafego/alteracoes.md`, que
recomendações do Google precisam de revisão, que mudar texto de LP pode
reprovar anúncio, e que dados pessoais e de faturamento não entram no repo.
**Para validar:** Cenário 2, abaixo.

### Fase 3 — Ecossistema de gestão de tráfego (reformulada em 01/11/2026)

**Decisão:** em vez de só 3 skills da Mari, montar um ecossistema que faz o ciclo
inteiro sozinho e só para para pedir aprovação de mudança na conta ou publicação
de página. Base: **[claude-ads](https://github.com/AgriciDaniel/claude-ads)**
(MIT, v2.1.0, commit `fc3908e`, ~8,5 mil estrelas): maestro `/ads` + ~25
subagentes com escopo limitado (auditoria por plataforma, conformidade de
política, rastreamento, orçamento, criativo, redação), portão de mudança, saídas
"observado / inferido / falta". Revisado em 01/11/2026: sem prompt injection, sem
Unicode oculto, sem `curl | bash`; rede só no buscador de páginas (com proteção
SSRF); subagentes só com leitura, exceto 1 com Bash e 1 com Write.

Limites conhecidos do claude-ads que esta fase cobre:
- Google Ads só por **export** (CSV/JSON), sem API ao vivo e sem escrita.
- Não sabe de agendamento/venda — vem do CRM (discovery no `crm-auto-digital`).
- Não conhece o vocabulário da Mari — vem de `trafego/politicas/vocabulario.md`.

**Camadas:**

```
Global (~/.claude, serve qualquer cliente)
  claude-ads (plugin)        → método, maestro /ads e subagentes
  skills coreyhaines31       → ads, ad-creative, copywriting, cro, conversion-tracking, ab-testing
  gestor-trafego (skill nova)→ ciclo semanal, backlog, pacote de aprovação
Por cliente (repo do cliente)
  .agents/product-marketing.md, trafego/ (conta, alterações, políticas, backlog, relatórios)
  estado do claude-ads (perfil, runs) — exports brutos fora do git (repo público)
```

**Ciclo do gestor (sem perguntar o que fazer):**
1. Coletar dados (export agendado do Ads; navegador como reserva).
2. Rodar `/ads audit google`, `/ads monitor`, `/ads landing`, conformidade de política.
3. Comparar com as metas (CPA €4 por contato; custo por agendamento quando houver CRM).
4. Escrever/atualizar `trafego/backlog.md` (tarefa, prioridade pela meta, subagente, se precisa de aprovação).
5. Executar sozinho tudo que não mexe na conta nem no site no ar: análises, rascunhos de anúncios, páginas `-v2`, negativas propostas, relatório.
6. Entregar **um pacote de aprovação por semana** (mudanças na conta e publicação de página, com antes/depois e como desfazer).
7. Após o "aprovado": aplicar, registrar em `alteracoes.md`, medir na semana seguinte.

| Fase | Entrega | Arquivos |
|---|---|---|
| 3a | Instalar claude-ads global fixado no commit revisado; conferir | `~/.claude` (plugin) |
| 3b | Onboarding da Mari: `/ads setup` a partir do `product-marketing.md` (aprovador Daniel, sem autoridade de escrita, tetos) e `.gitignore` do estado bruto | estado do claude-ads, `.gitignore` |
| 3c | Fonte de dados sem intervenção: relatório agendado do Google Ads para Planilhas/Drive, lido pelo conector Google Drive | `trafego/README.md` |
| 3d | Skill global `gestor-trafego` (ciclo acima) + `trafego/backlog.md` | `~/.claude/skills/gestor-trafego`, `trafego/backlog.md` |
| 3e | Tarefa agendada semanal + validação no caso real (grupo de casais sub-representado; anúncio de relaxamento reprovado) | tarefa agendada, `trafego/relatorios/` |

**Fora do automático, sempre com aprovação:** qualquer mudança na conta do Ads,
publicação de página e contestação de reprovação. Decisão "tantric" (pendência #8)
segue aberta e bloqueia o texto novo do anúncio de relaxamento.

---

## Checks de Validação

### Cenário 1 — Estrutura e registros (Fase 1)
- [ ] Os 10 arquivos existem em `trafego/` e abrem legíveis no editor
- [ ] Nenhum dado de faturamento nem e-mail de login em `trafego/`
- [ ] Números dos relatórios batem com o doc de 12/10 e a atualização de 26/10
- [ ] Nada fora de `trafego/` foi alterado (`git status`)

### Cenário 2 — Regras no CLAUDE.md (Fase 2)
- [ ] Nova sessão do Claude no repo cita o escopo de tráfego ao ser perguntada
- [ ] Pedido de "mudar anúncio" leva o Claude a consultar `vocabulario.md` e registrar em `alteracoes.md`

### Cenário 3 — Ecossistema (Fase 3)
- [ ] `/ads` e os subagentes do claude-ads aparecem numa sessão do Claude Code no repo
- [ ] O ciclo do gestor roda de ponta a ponta sem perguntas e gera backlog + relatório + pacote de aprovação
- [ ] O pacote reprova "Full Body Massage aan Huis" pelo vocabulário e propõe texto terapêutico
- [ ] Nenhuma mudança na conta acontece sem aprovação registrada

---

## Ajustes Possíveis Pós-Implementação

- Decisão "tantric" (pendência #8) e reescrita do anúncio "Relaxation Massage".
- Tarefa agendada para o relatório semanal.
- Combinar com a Mari a regra de não aceitar recomendações pelo app sem revisão.
