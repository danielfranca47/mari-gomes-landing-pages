# Mockups provisórios de campos de imagem (inspirados no tantrana.nl)

**Não publicar nenhum arquivo desta pasta.** São réplicas provisórias das 6 páginas
institucionais reais (`index.html`, `about/`, `treatments/`, `prices/`, `workshop/`,
`fly-me-in/`), criadas só para visualizar onde entrariam campos de imagem novos —
com placeholders SVG simulados, no mesmo padrão já usado no projeto (`PHOTO
REFERENCE` + rótulo "FOTO · ..."). Nenhuma foto real foi inserida.

Cada arquivo tem uma faixa vermelha fixa no topo ("Mockup provisório — não
publicar") para deixar isso óbvio mesmo se alguém abrir o arquivo isoladamente.

## Por que existem

O usuário pediu para mapear onde o site de referência validado **tantrana.nl**
usa imagens, e replicar essa estrutura (só a estrutura, sem fotos de verdade ainda)
no nosso site institucional, para servir de protótipo visual antes de decidir
implementar de verdade. Essa etapa é anterior ao ciclo formal de
`docs/implementations/` — se a Mary aprovar o conceito depois de ver os mockups, a
implementação real (com fotos de verdade, nas páginas reais) segue esse ciclo.

## Levantamento feito no tantrana.nl

| Página tantrana.nl | Campos de imagem observados |
|---|---|
| Home | 1 hero full-bleed · 1 foto em "About me" · 2 fotos lado a lado nos cards de Outcall/Incall · 4 fotos em grid na seção "Experience the transformative power" · 1 foto grande de ambiente no bloco de depoimento |
| About (tantra-specialist) | 1 hero · 1 vídeo de autoapresentação — sem outras fotos |
| Treatments (massage-service) | 1 imagem por card de tratamento (6 cards no modelo) |
| Prices | nenhuma imagem — página só de texto/tabela |
| Workshop | 2 fotos — uma no bloco "Morning Session", outra no "Evening Session" |
| Fly Me In (tantric-sessions-worldwide) | 1 imagem por card de "Service Offerings" (4 cards) + 1 foto de fechamento antes do FAQ |

## O que foi replicado em cada mockup

- **home.html** — hero e about já têm foto real (mantidos); adicionados 2 placeholders em `.my-services` (outcall/incall), 3 em `.tantra-explainer` (galeria), 1 em `.testimonials` (ambiente, sem retrato de cliente).
- **about.html** — sem placeholder na seção de conteúdo (já bate com o padrão do modelo: 1 foto só); ganhou o banner de capa temática do `.page-hero` (ver abaixo).
- **treatments.html** — 1 placeholder por `.service-card` (7 cards, após o merge dos cards 03/06 — ver `docs/pendencias-mary.md`/histórico de commits) + banner de capa temática no `.page-hero`.
- **prices.html** — sem imagens no conteúdo (decisão consciente, replicando o modelo); ganhou o banner de capa temática no `.page-hero`.
- **workshop.html** — 1 placeholder em cada `.explainer-block` (Morning/Evening Session) + banner de capa temática no `.page-hero`.
- **fly-me-in.html** — 1 placeholder por `.offering-card` (4 cards) + 1 foto de fechamento antes do FAQ + banner de capa temática no `.page-hero`.

Observação: o "avatar" de cliente usado no bloco de depoimento do tantrana.nl é uma
foto de banco de imagens associada a um review — não foi replicado (evitar fabricar
retrato de cliente); usamos uma foto de ambiente sem rosto no lugar.

### Capa temática (banner atrás do título)

As 5 subpáginas (About, Treatments, Prices, Workshop, Fly Me In) ganharam um
placeholder de imagem full-bleed atrás do título do `.page-hero`, reaproveitando a
mesma foto em todas — inspirado no tantrana.nl, que reutiliza a mesma imagem do
hero da Home como banner na página About. Só nos mockups; as páginas reais ainda
não têm esse mecanismo (CSS/HTML) implementado.

## Como visualizar

Abra qualquer arquivo `.html` desta pasta direto no navegador. Os caminhos de
imagem real (hero/about) apontam para `../../images/...`, relativos à raiz do
projeto.
