# Pendências para a Mary — Site Institucional

Lista viva de gaps de informação/conteúdo que só a Mary (ou a cliente final, via
Mary) pode fechar. Cada item junta contexto + a pergunta exata a mandar pra ela.
Conforme surgirem gaps novos durante a implementação da home institucional, **entram
aqui** — não ficam soltos só nos arquivos de implementação. Ao receber a resposta,
marcar o item como resolvido (mas manter no histórico, não apagar) e aplicar a
mudança no código correspondente.

**Status geral:** em aberto — nenhuma resposta recebida ainda (criado 2026-09-08).

---

## Em aberto

### 1. Texto "Sobre a Mari" — dados factuais

**Contexto:** a seção `#about` da home (Fase 3, commit `524c8f8`) tem um texto de
apresentação propositalmente genérico — não inventei números nem fatos específicos.

**Perguntar pra Mary:**
- Há quanto tempo você atua com massagem holística/tântrica em Amsterdã?
- Tem alguma formação, certificação ou tradição/escola específica que queira citar
  no texto (ou prefere manter mais enxuto, sem citar isso)?

**Onde é usado:** `home-en.html` / `home-nl.html`, seção About (marcado no código com
comentário `<!-- COPY DRAFT -->`).

**Registrado em:** 2026-09-08 (Fase 3).

---

### 2. Hospedagem / DNS da nova home (fora do WordPress)

**Contexto:** decisão já tomada com o usuário de tirar a home do WordPress — os
arquivos são HTML autocontido, como as LPs, mas isso precisa de um lugar pra morar.

**Perguntar pra Mary:**
- Onde ela quer hospedar a home nova (ex.: Netlify, Vercel, outro)?
- A home nova vai assumir a raiz do domínio (`amarigomes.com/`)? Se sim, como fica o
  DNS considerando que as 6 LPs de campanha continuam publicadas dentro do WordPress
  atual (`amarigomes.com/holistic-energy-massage-en/` etc.)?

**Onde é usado:** Fase 7 do plano de implementação (publicação), ainda não iniciada —
não bloqueia a construção do HTML.

**Registrado em:** 2026-09-08 (Fase 1).

---

### 3. Instagram handle

**Contexto:** o `CLAUDE.md` tinha `@kirakundalini` registrado como o Instagram da
Mari, mas o `href` real usado nas 6 LPs publicadas é `@massage.tantric.therapy`. Usei
o handle real (o que está de fato no ar) na home nova e corrigi o `CLAUDE.md`.

**Perguntar pra Mary:** `@massage.tantric.therapy` é o handle correto e atual?

**Onde é usado:** footer das 6 LPs + footer da home.

**Registrado em:** 2026-09-08 (Fase 1).

---

## Resolvidas

*(nenhuma ainda)*
