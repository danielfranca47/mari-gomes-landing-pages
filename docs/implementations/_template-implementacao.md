# [TEMPLATE] Seção de Localização (Mapa) nas 6 Páginas

> Este arquivo é um exemplo concreto preenchido, baseado numa mudança real já
> feita neste projeto (ver `CLAUDE.md`, seção "Seção de localização (mapa)").
> Use-o como referência visual. Para o processo completo, ver
> `_guia-documentar-implementacao.md`.

---

**Status:** Todos os cenários validados (10/07/2026)

---

## Motivação

Mary pediu para adicionar o endereço/mapa do local de atendimento nas 6
páginas, entre o FAQ e a CTA final, reaproveitando o perfil público do Google
Business dela.

---

## Problemas Identificados (estado anterior)

1. **Nenhuma seção de localização existia** — o endereço só aparecia
   implicitamente no FAQ ("endereço compartilhado após confirmação").

---

## Abordagem

```
Seção #location (nova, entre #faq e cta-final)
  ├─ grid 2 colunas: texto+botão / mapa embed
  ├─ mobile: colapsa pra 1 coluna
  └─ adicionada ao menu de navegação (#location)
```

---

## Plano de Implementação

### Fase 1 — Seção + iframe do Google Maps nas 6 páginas

**Objetivo:** ter a seção visível e funcional, com o embed público do Google
Maps (sem chave de API).

| Arquivo | O que muda |
|---|---|
| `lp1-holistic-energy-en.html` / `-nl.html` | Nova `<section id="location">` + link no nav |
| `lp2-relaxation-en.html` / `-nl.html` | Idem |
| `lp3-couples-en.html` / `-nl.html` | Idem |

### Commits Fase 1

| # | Commit | O que foi implementado |
|---|---|---|
| 1 | `a1b2c3d` | seção de localização + mapa embed nas 6 páginas |

### Relatório da Fase 1 — o que mudou na prática

**Antes:** o endereço não era mostrado em nenhuma página.
**Agora:** as 6 páginas têm uma seção com endereço, botão "Get Directions" e
mapa embed do Google, acessível também pelo menu.
**Para validar:** Cenário 1, abaixo.

---

## Checks de Validação

### Cenário 1 — Seção renderiza e é responsiva
- [x] Abrir cada uma das 6 páginas no navegador
- [x] Confirmar: mapa carrega dentro do iframe, sem erro "must be used in an iframe"
- [x] Redimensionar pra mobile (`max-width: 768px`) e confirmar que vira 1 coluna
- **Validado em:** 10/07/2026 — conferido nas 6 páginas, desktop e mobile

---

## Ajustes Possíveis Pós-Implementação

- Avisar Mary sobre a pequena tensão de mensagem: o FAQ diz que o endereço só
  é compartilhado após confirmação, mas o mapa já mostra o perfil público.
