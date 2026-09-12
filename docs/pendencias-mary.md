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

### 6. Regiões/países do Fly Me In

**Contexto:** `fly-me-in-service.txt` (texto real da Mary, 2026-09-12) tem a
pergunta de FAQ "Which locations do you travel to?" listada, mas sem
resposta no texto enviado. Coloquei uma resposta genérica placeholder
("worldwide, subject to availability") pra não deixar a pergunta sem
resposta na página.

**Perguntar pra Mary:** quais países/regiões específicas você viaja pro Fly
Me In? Tem alguma restrição (ex.: só Europa, só com aviso de X semanas)?

**Onde é usado:** `fly-me-in/index.html` / `nl/fly-me-in/index.html`
(comentário `COPY DRAFT` acima do item de FAQ).

**Registrado em:** 2026-09-12 (Fase 5 de
`docs/implementations/revisao-textos-reais-mary.md`).

---

### 7. Números da Home (anos de experiência/estudo, clientes satisfeitos)

**Contexto:** `home.txt` (texto real da Mary, 2026-09-12) pede stats de
confiança ("years of studying in India", "years of experience", "satisfied
customers") mas não veio com os números — só os rótulos.

**Perguntar pra Mary:** quantos anos ela estudou na Índia, quantos anos de
experiência tem, e quantos clientes atendidos (ou outro número que prefira
mostrar)?

**Onde é usado:** `index.html` / `nl/index.html` (as páginas reais da Home
publicadas — ver nota abaixo) e `home-en.html`/`home-nl.html` (cópias
legadas), seção About, marcado com `COPY DRAFT` (placeholder "X+").

**Registrado em:** 2026-09-12 (Fase 1 de
`docs/implementations/revisao-textos-reais-mary.md`).

---

### 8. Risco de política de conteúdo adulto no Google Ads

**Contexto:** a revisão de conteúdo desta rodada (textos reais da Mary,
2026-09-12) tornou o site mais explícito em vários pontos: estrutura
outcall/incall detalhada na Home, sobretaxa noturna e recomendação de
duração mínima nos Preços, e principalmente o Workshop — que agora descreve
massagem lingam/yoni e menciona que participantes solteiros podem ser
pareados com outro participante ou alguém do "trusted circle" pra praticar
juntos. Isso é bem mais explícito que o texto anterior (que tinha uma seção
inteira na Home dizendo "not a sexual or escort service").

**Por que importa:** o site roda Google Ads pago ativo nas 6 LPs. A
política de conteúdo adulto do Google Ads é restritiva — depender de como o
conteúdo for lido numa revisão manual, pode gerar rejeição de anúncio ou até
suspensão de conta.

**Perguntar pra Mary (ou decidir você com ela):** ela está ciente/confortável
com esse nível de detalhe no site enquanto ele também é o destino de tráfego
pago? Prefere manter assim, suavizar, ou usar tom mais explícito só nas
páginas sem tráfego de Ads (Workshop/Fly Me In não estão nas 6 LPs
anunciadas, mas estão linkadas a partir da Home, que também não recebe Ads
diretamente hoje — verificar se isso muda com a expansão do site
institucional).

**Onde é usado:** `index.html`/`home-en.html` (+ `nl/`), `workshop/index.html`
(+ `nl/`), `fly-me-in/index.html` (+ `nl/`).

**Registrado em:** 2026-09-12 (Fase 6 de
`docs/implementations/revisao-textos-reais-mary.md`).

---

### 9. Página de agendamento (book.txt) — próximo passo, fora deste ciclo

**Contexto:** `book.txt` descreve uma página de reserva com formulário
(nome, e-mail, telefone, tipo de sessão, data, local) e uma nota sobre
sincronizar disponibilidade com o Google Agenda da Mary. Ficou fora do
escopo desta revisão de conteúdo por ser uma feature nova (formulário +
possível integração de agenda), não uma atualização de texto de página já
existente.

**Perguntar pra Mary:** confirma que quer essa página de agendamento com
formulário? A sincronização com Google Agenda é um passo futuro maior (app
própria, como o texto menciona) ou só quer o formulário simples por
enquanto (sem integração, e a Mary confirma manualmente por WhatsApp)?

**Onde seria usado:** página nova, ex. `/book/` (+ `nl/book/`).

**Registrado em:** 2026-09-12 (Fase 6 de
`docs/implementations/revisao-textos-reais-mary.md`).

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

### 2. Nomes/descrições reais dos tratamentos — RESOLVIDA

**Contexto:** a página nova `treatments/index.html`/`nl/treatments/index.html`
(reestruturação multi-página, referência `tantrana.nl`) lista 6 tratamentos: os 3
que já têm LP de campanha (Holistic Energy, Relaxation, Couples — sem mudança) + 3
adaptados dos tipos citados na referência (Tension Release Massage/dearmouring,
Chakra & Energy Balancing, Tantra Coaching for Couples). A Mary confirmou por
WhatsApp que oferece "todos esses serviços", mas os nomes/descrições dos 3 novos são
uma adaptação minha da referência, não texto dela.

**Resolução:** `treatments.txt` (texto real da Mary, 2026-09-12) confirma os
nomes exatos: Dearmouring Tantra Massage, Chakra Balancing Tantra Massage,
Couple Tantra Massage Ritual, Coaching Tantra Massage Couple Session — e
inclui um serviço a mais (4-Hands Tantra Massage) que não estava na página.
Aplicado em `treatments/index.html`/`nl/` (Fase 2 de
`docs/implementations/revisao-textos-reais-mary.md`).

**Registrado em:** 2026-09-09. **Resolvido em:** 2026-09-12.

---

### 3. Formato do workshop — RESOLVIDA

**Contexto:** a Mary confirmou que também faz workshop (como o
`tantra-massage-workshop-for-couples-singles-in-amsterdam` da referência), mas o
Daniel perguntou explicitamente se ela quer estrutura igual ou com alterações e
isso não foi respondido ainda. A página `workshop/index.html`/`nl/workshop/index.html`
ficou deliberadamente genérica (o que é ensinado, em termos amplos — sem citar
técnicas específicas, datas, tamanho de grupo ou preço da referência) até ela
confirmar o formato real.

**Atualização (2026-09-09, expansão de conteúdo Fase 3):** a página ganhou
blocos visuais de "Format" (duração/tamanho de grupo/público) e "What's
Included", mas os valores mostrados ("Full day", "Small & intimate") eram só
indicativos.

**Resolução:** `workshop.txt` (texto real da Mary, 2026-09-12) confirma
tudo: datas (10 jan / 14 fev 2027), horários (10h–15h manhã, 17h–22h noite),
tamanho do grupo (máx. 12, 6 casais), preços (early bird €275pp/€525 casal
até 1 nov; cheio €325pp/€595 casal), e currículo completo (manhã: mulheres;
noite: homens, incl. massagem lingam). Reescrito integralmente em
`workshop/index.html`/`nl/` (Fase 4 de
`docs/implementations/revisao-textos-reais-mary.md`). O contato de reserva
usado é o real da Mari Gomes (`+31 634 366 008` / `marycontato@gmail.com`),
não o `bookings@tantrana.nl`/`0031 645 28 2608` que aparecia no texto
enviado (resíduo de cópia do site de referência).

**Registrado em:** 2026-09-09. **Resolvido em:** 2026-09-12.

---

### 4b. Formas de pagamento aceitas — RESOLVIDA

**Contexto:** a referência `tantrana.nl` aceita cartão, dinheiro e BTC. A
`prices/index.html`/`nl/prices/index.html` (expansão de conteúdo, Fase 2) não
menciona formas de pagamento — não copiei isso da referência porque é decisão
de negócio, não só formatação de preço.

**Resolução:** `Prices.txt` (texto real da Mary, 2026-09-12) confirma
"Payment options: card, cash or BTC." — adicionado à nota de preços em
`prices/index.html`/`nl/prices/index.html` (Fase 3 de
`docs/implementations/revisao-textos-reais-mary.md`).

**Registrado em:** 2026-09-09 (expansão de conteúdo, Fase 2). **Resolvido em:**
2026-09-12.

---

### 4c. Serviços adicionais da referência (4-Hands, sessão com 2 terapeutas) — RESOLVIDA

**Contexto:** a referência `tantrana.nl` também lista "4-Hands Tantra
Massage" (€700, 75-90min) e "Couple Tantra Massage with 2 Therapists"
simultâneo (€600-750). Não foram adicionados às nossas páginas — são serviços
novos, não só preço, e a Mary não confirmou se oferece.

**Resolução:** `treatments.txt` e `Prices.txt` (textos reais da Mary,
2026-09-12) confirmam os dois serviços com os mesmos valores da referência.
Adicionados como card novo em `treatments/index.html`/`nl/` (Fase 2) e linhas
novas em `prices/index.html`/`nl/` (Fase 3) de
`docs/implementations/revisao-textos-reais-mary.md`.

**Registrado em:** 2026-09-09 (expansão de conteúdo, Fase 2). **Resolvido em:**
2026-09-12.

---

### 4. Taxa de deslocamento (outcall pra hotel)

**Contexto:** a Mary confirmou que atende em hotel ("deslocação em hotel"). A
taxa **noturna** da referência (`tantrana.nl`, €100/€150 após 21h) já foi copiada
pra `prices/index.html`/`nl/prices/index.html` (ver pendência resolvida "Preços
reais", abaixo) — mas a referência não tinha um valor específico de taxa de
**deslocamento/distância** pro hotel, só a taxa por horário. As páginas novas ainda
dizem que deslocamento está disponível "a pedido", sem citar taxa de viagem.

**Perguntar pra Mary:** além da taxa noturna (já copiada), cobra algo a mais
especificamente pelo deslocamento até o hotel? Fixo ou por distância?

**Onde é usado:** `treatments/index.html`, `prices/index.html` (+ variantes `nl/`).

**Registrado em:** 2026-09-09.

---

### 5. Instagram handle

**Contexto:** o `CLAUDE.md` tinha `@kirakundalini` registrado como o Instagram da
Mari, mas o `href` real usado nas 6 LPs publicadas é `@massage.tantric.therapy`. Usei
o handle real (o que está de fato no ar) na home nova e corrigi o `CLAUDE.md`.

**Perguntar pra Mary:** `@massage.tantric.therapy` é o handle correto e atual?

**Onde é usado:** footer das 6 LPs + footer da home.

**Registrado em:** 2026-09-08 (Fase 1).

---

## Resolvidas

### Preços reais por tratamento/duração

**Contexto:** a página `prices/index.html`/`nl/prices/index.html` estava com "On
request"/"Op aanvraag" no lugar do preço (sem números inventados pra um negócio
real). O Daniel confirmou que a Mary autorizou copiar diretamente a tabela de
preços da referência `tantrana.nl` ("podemos copiar todos os preços").

**Resolução:** preços copiados da tabela por duração da referência — €300 (60min),
€350 (90min), taxa noturna de €100 (60min)/€150 (90min+) após 21h, workshop "From
€275 pp" (valor early-bird da referência). **Importante:** são os preços da
concorrente adotados como os da Mari, não calculados por ela — não é 100% o mesmo
que a Mary ter fornecido valores próprios, então vale uma confirmação final se são
esses os números que ela quer manter publicados (ou se prefere ajustar depois de
ver como ficou).

**Onde foi aplicado:** `prices/index.html` / `nl/prices/index.html`.

**Resolvido em:** 2026-09-09.

---

### Hospedagem / DNS da nova home (fora do WordPress)

**Não era uma pergunta pra Mary** — o Daniel decidiu e vai operar pessoalmente: sair
da TurboCloud, migrar `amarigomes.com` inteiro (home + as 6 LPs) pra GitHub Pages com
Cloudflare, eliminando o custo de hospedagem. Passo a passo completo em
[`docs/hospedagem-github-pages-cloudflare.md`](hospedagem-github-pages-cloudflare.md).

**Resolvido em:** 2026-09-08.
