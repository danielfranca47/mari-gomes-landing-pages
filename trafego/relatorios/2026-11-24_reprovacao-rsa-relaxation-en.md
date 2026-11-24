# 2026-11-24 — Reprovação do RSA EN "Relaxation Massage Amsterdam" (G2)

**Fontes:** (1) planilha agendada `trafego-mari-google-ads`, atualizada em
23/11/2026 05:50 UTC (aba `anuncios`, 38 anúncios); (2) leitura do painel do
Google Ads pelo Claude in Chrome em 24/11/2026 (relato do Daniel; só leitura).
Nada foi alterado na conta.

## O que o Ads mostra (24/11)

- Anúncio 830181037431, RSA EN "Relaxation Massage Amsterdam | Sessions From
  €250 | Private Studio in Amsterdam", G2 - Deep Relax, [CP-03] #4 (ativa).
- Estado: "Não qualificada" — "Conteúdo proibido sobre encontros e acompanhantes".
  Painel aponta só o título **"Sleep Better, Think Clearer"** (título 10).
  Data exata da reprovação não aparece. 44 cliques, 458 impressões, 6 conversões,
  €30,16 de custo.
- Os outros 5 anúncios ativos da #4 (G1 NL/EN, G2 NL, G3 NL/EN) seguem aprovados.

## Achado principal: a limitação já existia antes das mudanças de 23/11

A planilha de 23/11 05:50 UTC já trazia o anúncio 830181037431 como
`APPROVED_LIMITED` + `PROHIBITED_DATING_AND_COMPANIONSHIP`. O commit de layout
mobile da LP2 (`0e11e21`, foto visível no mobile) é de 23/11 18:04 UTC — **depois**.
Logo, a mudança de foto/layout de 23/11 não pode ter causado a limitação.
(A passagem de "aprovado limitado" para "não qualificada" visto no painel em 24/11
pode ser só o painel mostrando o estado completo; não há como separar pela planilha.)

## Padrão entre os anúncios (aba `anuncios`, 23/11)

| Anúncio | Campanha | Status | Aprovação |
| --- | --- | --- | --- |
| RSA EN "Relaxation Massage Amsterdam" (830181037431) | #4 | ativo | APPROVED_LIMITED / dating |
| EN "Relaxation Massage" (826672281530) | #4 | pausado | APPROVED_LIMITED / dating |
| EN "Relaxation Massage" (826160497621) | backup ignorar | ativo* | APPROVED_LIMITED / dating |
| EN "Relaxation Massage" (817480604114) | #3 | ativo* | DISAPPROVED / stale |
| EN "Relaxation Massage" (817410829816) | CP-01 #3 | ativo* | APPROVED |
| EN "Relaxation Massage" (815095517751) | #2 | ativo* | APPROVED |
| NL "Ontspanningsmassage Amsterdam" (todas as campanhas) | — | — | APPROVED |
| G1 e G3, EN e NL (todas) | — | — | APPROVED |
| CA-01 "Energy Massage Amsterdam" (804578069242) | CA-01 | ativo* | DISAPPROVED / dating (URL = home) |
| CP-01 original (home) G1 NL e G3 EN/NL | CP-01 | ativo* | APPROVED_LIMITED / stale |

\* "ativo" é o status do anúncio; as campanhas dessas linhas estão pausadas
(exceto a #4), salvo a CA-01, cujo estado de campanha não foi lido.

**Leitura:** o que se repete é **a URL `/relaxation-massage-en/`** (EN do G2). Os
três anúncios EN limitados têm textos diferentes entre si (inclusive o RSA novo,
escrito em 01/11 sem os títulos antigos reprovados) e todos apontam para essa
LP; os NL do G2 (LP2 NL, mesma estrutura) e todos os de G1/G3 passam. Isso
**enfraquece** a hipótese de que o gatilho seja só o texto do anúncio (corrige o
que eu disse antes) e aponta para o **conteúdo da LP2 EN** ou para a combinação
"anúncio de relaxamento EN + essa LP". O título "Sleep Better, Think Clearer" é
o único que o Ads indicou, mas não explica as limitações dos anúncios antigos.

Candidatos na LP2 EN (a verificar, não confirmados):
- `<title>`, hero e rótulo de preços com "**Tantric** Holistic Relaxation" (voltou
  em 16/11; a limitação já existia desde 01/10, quando a página também tinha
  "Tantric" desde 27/09);
- "Promotes deep sleep / resets sleep patterns from session one" (alegação de
  saúde que combina com o título "Sleep Better, Think Clearer");
- "Private studio", "Sessions by appointment", "curated private studio" repetidos
  (strip, passos, About, FAQ, CTA) — mesmo vocabulário de serviço pessoal;
- link do Instagram `massage.tantric.therapy` no rodapé (resíduo já listado em
  `politicas/vocabulario.md`).

## Outros achados da planilha

- 10 campanhas/linhas de anúncio fora da #4: a **"CP-03 (backup ignorar)"** e a
  **CA-01** aparecem no Ads com anúncios que a documentação (`conta.md`) não
  listava. Backlog T12 segue aberto.
- Métricas #4 (24/10–21/11, 25 dias com dados): ~€32/dia; 4–19 conversões/dia.
  Por grupo (últimos 7 dias): G1 127 cliques/€81,49/25 conv.; G2 92/€69,65/17;
  G3 50/€53,78/22. Mesmo com G2 limitado, ele entrega com o anúncio NL.

## Proposta de ajuste (aguarda aprovação do Daniel)

Ver `../anuncios/cp-03-4_g2-deep-relax.md`, seção "RSA EN v3 — proposta".
