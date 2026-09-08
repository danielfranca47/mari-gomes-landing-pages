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
| 1 | `<a registrar>` | seção "isso é pra você se..." (4 itens de qualificação) + 3 cards de modalidade linkando pras LPs correspondentes no idioma certo |

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

### Fase 4 — Depoimentos + Location/mapa

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seções `#testimonials` e `#location` (reuso do padrão de mapa das LPs) |
| `home-nl.html` | Espelhado |

### Fase 5 — FAQ + CTA final + tracking

| Arquivo | O que muda |
|---|---|
| `home-en.html` | Seção `#faq`, CTA final, script de tracking WhatsApp → Google Ads |
| `home-nl.html` | Espelhado |

### Fase 6 — Fotos reais + revisão responsiva

Inserir as 2 fotos já disponíveis (tatame, retrato), avaliar reaproveitamento de
fotos já existentes em `images/` (das LPs) nos slots restantes, placeholder SVG (
padrão já usado nas LPs) onde não houver foto ainda. Revisão de responsivo 768px em
todas as seções.

### Fase 7 — Hospedagem fora do WordPress (pendência de infraestrutura)

Não bloqueia as fases 1–6. Precisa de decisão da Mary sobre onde hospedar e ajuste de
DNS de `amarigomes.com`.

---

## Checks de Validação

### Cenário 1 — Fase 1 renderiza e é responsiva
- [ ] Abrir `home-en.html` e `home-nl.html` no navegador
- [ ] Confirmar: paleta/tipografia nova aplicada, nav fixo funciona, bandeiras
      GTranslate aparecem, footer com dados corretos
- [ ] Redimensionar pra mobile (768px) e confirmar nav/footer responsivos

### Cenário 2 — Navegação e links de modalidade (Fase 2+)
- [ ] Cada card de modalidade abre a LP certa, no idioma certo
- [ ] Menu âncora rola até a seção certa, sem esconder atrás do nav fixo

### Cenário 3 — FAQ, mapa, WhatsApp (Fase 4/5)
- [ ] Accordion do FAQ abre/fecha
- [ ] Mapa carrega sem erro "must be used in an iframe"
- [ ] Links de WhatsApp com texto pré-preenchido e encoding corretos em EN e NL
- [ ] Clique no WhatsApp dispara evento de conversão (mesmo mecanismo das LPs)

---

## Ajustes Possíveis Pós-Implementação

- Hospedagem/DNS (Fase 7) fica como pendência explícita até a Mary decidir.
- Copy de "Sobre a Mari" (Fase 3) é rascunho até confirmação de dados factuais
  (formação, tempo de atuação, certificações).
