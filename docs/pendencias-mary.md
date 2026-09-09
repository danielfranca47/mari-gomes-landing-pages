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

### 2. Nomes/descrições reais dos tratamentos

**Contexto:** a página nova `treatments/index.html`/`nl/treatments/index.html`
(reestruturação multi-página, referência `tantrana.nl`) lista 6 tratamentos: os 3
que já têm LP de campanha (Holistic Energy, Relaxation, Couples — sem mudança) + 3
adaptados dos tipos citados na referência (Tension Release Massage/dearmouring,
Chakra & Energy Balancing, Tantra Coaching for Couples). A Mary confirmou por
WhatsApp que oferece "todos esses serviços", mas os nomes/descrições dos 3 novos são
uma adaptação minha da referência, não texto dela.

**Perguntar pra Mary:** os nomes e descrições desses 3 tratamentos batem com como
ela realmente os chama/descreve? Quer ajustar algum?

**Onde é usado:** `treatments/index.html` / `nl/treatments/index.html` (marcado com
comentário `COPY DRAFT` acima de cada card novo).

**Registrado em:** 2026-09-09.

---

### 3. Preços reais por tratamento/duração

**Contexto:** a página nova `prices/index.html`/`nl/prices/index.html` mostra uma
tabela com os 7 itens (6 tratamentos + workshop) e duração, mas a coluna de preço
usa "On request"/"Op aanvraag" (abre WhatsApp com mensagem pré-preenchida) em vez de
um valor — não inventei números pra um negócio real.

**Perguntar pra Mary:** qual o preço de cada tratamento por duração? Fixo ou varia?

**Onde é usado:** `prices/index.html` / `nl/prices/index.html` (comentário
`PRICE DRAFT` no HTML).

**Registrado em:** 2026-09-09.

---

### 4. Formato do workshop

**Contexto:** a Mary confirmou que também faz workshop (como o
`tantra-massage-workshop-for-couples-singles-in-amsterdam` da referência), mas o
Daniel perguntou explicitamente se ela quer estrutura igual ou com alterações e
isso não foi respondido ainda. A página `workshop/index.html`/`nl/workshop/index.html`
ficou deliberadamente genérica (o que é ensinado, em termos amplos — sem citar
técnicas específicas, datas, tamanho de grupo ou preço da referência) até ela
confirmar o formato real.

**Perguntar pra Mary:**
- Formato: duração, quantos turnos, dia da semana?
- Tamanho máximo do grupo?
- Currículo: o que exatamente é ensinado?
- Preço (por pessoa / por casal, com ou sem desconto antecipado)?
- Igual à estrutura da `tantrana.nl` ou diferente?

**Onde é usado:** `workshop/index.html` / `nl/workshop/index.html` (comentário
`COPY DRAFT`).

**Registrado em:** 2026-09-09.

---

### 5. Taxa de deslocamento (outcall pra hotel)

**Contexto:** a Mary confirmou que atende em hotel ("deslocação em hotel"). A
referência (`tantrana.nl`) cobra uma taxa adicional pra atendimento noturno. As
páginas novas (`treatments/`, `prices/`) mencionam que deslocamento está disponível
"a pedido", sem citar taxa — não inventei valor.

**Perguntar pra Mary:** cobra alguma taxa adicional pra deslocamento/hotel? Fixa ou
por distância/horário?

**Onde é usado:** `treatments/index.html`, `prices/index.html` (+ variantes `nl/`).

**Registrado em:** 2026-09-09.

---

### 6. Instagram handle

**Contexto:** o `CLAUDE.md` tinha `@kirakundalini` registrado como o Instagram da
Mari, mas o `href` real usado nas 6 LPs publicadas é `@massage.tantric.therapy`. Usei
o handle real (o que está de fato no ar) na home nova e corrigi o `CLAUDE.md`.

**Perguntar pra Mary:** `@massage.tantric.therapy` é o handle correto e atual?

**Onde é usado:** footer das 6 LPs + footer da home.

**Registrado em:** 2026-09-08 (Fase 1).

---

## Resolvidas

### Hospedagem / DNS da nova home (fora do WordPress)

**Não era uma pergunta pra Mary** — o Daniel decidiu e vai operar pessoalmente: sair
da TurboCloud, migrar `amarigomes.com` inteiro (home + as 6 LPs) pra GitHub Pages com
Cloudflare, eliminando o custo de hospedagem. Passo a passo completo em
[`docs/hospedagem-github-pages-cloudflare.md`](hospedagem-github-pages-cloudflare.md).

**Resolvido em:** 2026-09-08.
