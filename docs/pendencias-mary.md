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

### 11. Preços nas landing pages do anúncio (versões v2 para aprovar)

**Contexto:** a Mari pediu para as LPs do Google Ads mostrarem preço. Foram
criadas versões provisórias (não indexadas, sem contar conversão). Em 27/09/2026 a
Mari mandou os valores reais (via Daniel), já aplicados:
- `amarigomes.com/holistic-energy-massage-en-v2/` (+ `-nl-v2/`), agora "Tantric
  Energy Experience": 60 min €300 · 90 min €350 · 120 min €400
- `amarigomes.com/relaxation-massage-en-v2/` (+ `-nl-v2/`), agora "Tantric Holistic
  Relaxation": 60 min €250 · 90 min €300 · 120 min €350
- `amarigomes.com/couples-massage-en-v2/` (+ `-nl-v2/`): 90 min €350 · 2h €400 ·
  2,5h €450 · 3h €500 (preço do casal)
- Em todas: horário 9:00–19:00, +€50 de deslocamento para casa/hotel, pagamento por
  cartão/dinheiro/BTC. Sem opção de 2 terapeutas (ela não oferece por enquanto).

**Perguntar pra Mary:**
1. Revisou as 6 páginas v2 e aprova para substituírem as atuais?
2. Casal: como funciona a sessão com uma terapeuta só — os dois recebem ao mesmo
   tempo, um de cada vez, ou é um ritual guiado para os dois? A LP atual promete
   "both partners receive their massage simultaneously"; na v2 o FAQ ficou neutro
   ("you share the whole experience together… Mari guides the ritual"), mas a faixa
   de promessa ainda diz "at the same time".
3. A página `/prices/` do site ainda tem a tabela antiga (Tantrana). Quer que
   passe a mostrar os mesmos valores/nomes das LPs? E os demais tratamentos
   (Dearmouring, Chakra Balancing, Couple Ritual, Coaching) — quais valores?

**Onde é usado:** 6 pastas `*-v2/` (`docs/implementations/precos-nas-lps.md`).
Após a aprovação, viram as LPs principais.

**Registrado em:** 2026-09-27. **Atualizado:** 2026-09-27 (valores reais recebidos).

---

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

### 7. Números da Home (anos de experiência, clientes satisfeitos)

**Contexto:** o `home.txt` (2026-09-12) trazia stats de confiança ("years of
studying in India", "years of experience", "satisfied customers") sem
números. **Atualização (2026-09-20):** esse texto era cópia da Tantrana, então
o bloco de stats (incluindo "Years Studying in India", que descrevia a
trajetória de outra pessoa) foi **removido** da Home. O CSS `.about-stats`
segue nos arquivos, sem uso, caso a Mary forneça números próprios.

**Perguntar pra Mary:** quantos anos de experiência tem e quantos clientes
atendidos (ou outro número/prova social que prefira mostrar)? Estudou na
Índia ou em outro lugar que queira citar?

**Onde seria usado:** `index.html` / `nl/index.html` (e as cópias legadas
`home-en.html`/`home-nl.html`), seção About.

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

### 10. Auditoria: texto copiado da Tantrana nos demais arquivos de `texto-do-site/`

**Contexto:** em 2026-09-20 confirmamos que o About do `home.txt` é cópia
verbatim de tantrana.nl (o arquivo até traz a assinatura "Tantrana").
`workshop.txt` também cita "Tantrana workshop" e o e-mail/telefone deles.
Suspeitos ainda não auditados: o resto do `home.txt` (blocos "My Services",
"Why Choose My Services?", depoimento "Tim, USA"), `treatments.txt`,
`Prices.txt`, `workshop.txt`, `fly-me-in-service.txt`. Risco: copiar texto de
concorrente direto e publicar afirmações (ex.: "me and my colleague
therapists", currículo do workshop, preços) que não são da Mari.

**Perguntar pra Mary:** quais desses textos ela de fato escreveu/aprova como
seus? O depoimento do "Tim, USA" é de cliente dela? Ela tem colegas
terapeutas e workshops próprios com esse currículo?

**Onde é usado:** Home, Treatments, Prices, Workshop, Fly Me In (+ `nl/`).

**Registrado em:** 2026-09-20.

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

### 1. Texto "Sobre a Mari" — dados factuais — PARCIALMENTE RESOLVIDA

**Contexto:** a seção `#about` da home (Fase 3, commit `524c8f8`) e a página
`about/index.html` têm um texto de apresentação propositalmente genérico — não
inventei números nem fatos específicos.

**Atualização (2026-09-17):** recuperada uma bio real que esteve publicada no
WordPress antigo (antes da migração), via export Elementor da página HOME —
ver `docs/texto-do-site/about.txt`. É texto de terceira pessoa escrito pelo
antigo designer/agência, não placeholder inventado, e traz um dado novo (Mari
desenvolveu massagens próprias que ensina, além de aplicar). Ainda assim **não
cita números exatos de anos de experiência nem certificação/escola** — a
pergunta original pra Mary continua valendo:

**Perguntar pra Mary:**
- Há quanto tempo você atua com massagem holística/tântrica em Amsterdã?
- Tem alguma formação, certificação ou tradição/escola específica que queira citar
  no texto (ou prefere manter mais enxuto, sem citar isso)?
- Confirma que quer manter a menção de que desenvolveu massagens próprias que
  também ensina (dado do texto recuperado, não estava nas versões atuais)?

**Atualização (2026-09-17, aplicação):** o texto adaptado da bio recuperada já
foi aplicado como rascunho (ver
`docs/implementations/bio-about-recuperada-wordpress.md`) — em
`about/index.html`/`nl/about/index.html` como o novo parágrafo de abertura da
`.about-detail`.

**Correção (2026-09-20):** o teaser About da Home (`index.html`,
`nl/index.html`, `home-en.html`, `home-nl.html`) usava o texto do `home.txt`,
que na verdade é cópia verbatim do About da Tantrana (tantrana.nl) — "estudou
na Índia", "tornou-se especialista", stats "Years Studying in India" etc.
Não é da Mari. Substituído pela bio recuperada (mesmo texto-base da página
About, versão curta) e o bloco de stats foi removido (ver pendência #7). A
frase "massagens próprias que também ensina" está marcada com comentário
`COPY DRAFT` nos 6 arquivos, ainda sem confirmação. Pendência segue aberta
até resposta da Mary.

**Onde é usado:** `home-en.html` / `home-nl.html` / `index.html` / `nl/index.html`,
seção About, e `about/index.html` / `nl/about/index.html` (marcado no código com
comentário `<!-- COPY DRAFT -->`).

**Registrado em:** 2026-09-08 (Fase 3). Atualizado 2026-09-17.

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

**Revertido em 2026-09-27 (via Daniel):** a Mari **não** oferece, por enquanto,
nenhuma opção com segunda terapeuta. 4 mãos e "Couple Ritual with 2 Therapists"
foram removidos da Home, Treatments e Prices (EN/NL), e "me and my colleague
therapists" virou atendimento pessoal dela (`docs/implementations/precos-nas-lps.md`, Fase 6).

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

### 4. Taxa de deslocamento (outcall pra hotel) — RESOLVIDA

**Contexto:** a Mary confirmou que atende em hotel, mas não havia valor de taxa de
deslocamento (só a taxa noturna copiada da Tantrana).

**Resolução (2026-09-27, via Daniel):** taxa fixa de **€50** para visita a casa/hotel.
A Mari atende só das **9:00 às 19:00** — não existe sobretaxa noturna. Aplicado nas
6 LPs v2 (`docs/implementations/precos-nas-lps.md`). Ainda falta refletir em
`treatments/` e `prices/` (+ `nl/`), que dizem "a pedido" e mostram a sobretaxa
"after 21:00" — listado como ajuste no mesmo doc.

**Registrado em:** 2026-09-09. **Resolvido em:** 2026-09-27.

---

### Hospedagem / DNS da nova home (fora do WordPress)

**Não era uma pergunta pra Mary** — o Daniel decidiu e vai operar pessoalmente: sair
da TurboCloud, migrar `amarigomes.com` inteiro (home + as 6 LPs) pra GitHub Pages com
Cloudflare, eliminando o custo de hospedagem. Passo a passo completo em
[`docs/hospedagem-github-pages-cloudflare.md`](hospedagem-github-pages-cloudflare.md).

**Resolvido em:** 2026-09-08.
