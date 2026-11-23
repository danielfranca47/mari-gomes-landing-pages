# Relatório — conversões, página de obrigado e gerador de link (fase 1 e 2)

**Data:** 23/11/2026 · **Para:** retomar o contexto antes do relatório de conversões da Mari. Este documento resume o que foi feito; os detalhes estão nos docs citados.

## Links
| O que | URL | Estado |
|---|---|---|
| Página privada da Mari (gerador de link) | https://amarigomes.com/mari/ | No ar (PR #5). Protegida por PIN simples (cosmético) |
| Obrigado EN / NL | https://amarigomes.com/thank-you/ · https://amarigomes.com/nl/thank-you/ | No ar |
| Prévias da fase 2 (noindex, não promovidas) | `/holistic-energy-massage-en-v2/`, `-nl-v2/`, `/relaxation-massage-en-v2/`, `-nl-v2/`, `/couples-massage-en-v2/`, `-nl-v2/` | No ar como prévia (PR #8) |
| Prévia sem disparar conversão | `…/thank-you/?test` | — |

O PIN não está no repositório. Foi informado pela sessão revisora; para trocar: ver o comentário no topo de `mari/index.html`.

## O que está no ar (main)
| PR | Merge | O quê |
|---|---|---|
| #4 | `ad67fb4` | Foto da Mari visível no mobile (LP1 estava `display:none`, LP2 espremida); cookie banner mobile deixa de ocupar ~45% da tela; páginas `/thank-you/` e `/nl/thank-you/` com avaliação (5★ → Google, 1–4★ → feedback à Mari por WhatsApp) |
| #5 | `190ca0a` | `/mari/`: a Mari escolhe o atendimento (nomes e preços iguais aos das LPs), confirma ou edita o valor e gera o link de obrigado + mensagem de WhatsApp. A obrigado registra `purchase` no GA4 com valor, atendimento e id |
| #6 | `5711c4e` | Log em `trafego/alteracoes.md` |
| #7 | `c280d15` | Rótulo da conversão Google Ads "Compra" nas páginas de obrigado |
| #8 | `8072593` | Fase 2: prévias `-v2`, código do cliente em `/mari/`, Worker de atribuição (código, não publicado) |

## Google Ads
- Conversão **"Compra"** criada em 23/11/2026 ~22:48 (GMT+02:00): site, valor por conversão (padrão €250), contagem "Todas", 30 d clique / 1 d visualização, **Secundária**. Rótulo `AW-18036442650/ZwyrCJrolr4dEJqMuZhD`. Nasceu Principal por ~1 min e foi corrigida.
- Ao abrir o link de obrigado dispara `purchase` (GA4) e `conversion` (Ads), mesmo valor e `transaction_id`. `?test` não dispara. Dedupe por 12 h no mesmo navegador. O aparelho da Mari não dispara.
- Como é secundária, não entra nos lances. Promover a Principal só com conversões reais chegando com o valor certo.

## Como a Mari usa (fase 1, já funciona)
1. Abre `/mari/` no celular e digita o PIN.
2. Escolhe o atendimento; o valor vem preenchido e pode ser editado.
3. Escolhe EN ou NL e gera o link; toca no botão de WhatsApp com a mensagem pronta e envia ao cliente.
4. O cliente abre o link: vê o agradecimento e a avaliação; a compra é registrada com o valor exato.

## Fase 2 (atribuição ao anúncio) — implementada, NÃO ativa
Objetivo: ligar a venda ao clique do anúncio e à LP de origem, mesmo quando o cliente abre o link em outro aparelho.
- 6 prévias `-v2`: depois do consentimento aos cookies guardam o clique (gclid + LP) por 90 dias e põem `(ref MG-XXXXX)` no fim do texto do WhatsApp. Sem consentimento, comportamento igual ao de hoje.
- `/mari/` ganhou "Código do cliente (opcional)": a Mari cola a primeira mensagem do cliente e só o código é extraído.
- Worker da Cloudflare (`workers/atribuicao/`) guarda código→clique e gera o CSV de conversão offline.
- Revisada e aprovada (Opus, `32c7d6e`). Não testado: Cloudflare real, upload no Ads e colunas do modelo de CSV.

### O que depende do Daniel
1. Política de privacidade (pendência #14) antes de ligar com dado real.
2. Deploy do Worker e segredos (`workers/atribuicao/README.md`).
3. Ação de conversão offline "Compra (importada)" no Ads e conferir o modelo do CSV (`trafego/conversoes-offline.md`).
4. Testar as `-v2` e decidir a promoção para as LPs reais (regra do `CLAUDE.md`: copiar por cima, remover `noindex` e trava, conferir tags idênticas).

## Limitações e cuidados
- O PIN é uma cortina, não segurança (o hash está no HTML público).
- O GA4 não recebe o `purchase` com consentimento negado (Consent Mode); o Ads idem.
- A atribuição por link de obrigado sozinha só funciona no mesmo navegador do clique; a fase 2 resolve isso, mas só depois de promovida.
- Teste da Mari: gerar link e abrir no próprio aparelho não conta venda; para ver a página sem disparar use `?test`.

## Documentos de referência
`docs/implementations/pagina-obrigado-avaliacao.md` · `docs/implementations/gerador-link-conversao.md` · `docs/implementations/atribuicao-anuncio-fase2.md` · `trafego/conversoes-offline.md` · `trafego/alteracoes.md`
