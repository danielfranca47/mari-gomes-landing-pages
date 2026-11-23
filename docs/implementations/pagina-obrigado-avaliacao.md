# Página de obrigado + avaliação + conversão de compra

**Início:** 2026-11-23 · **Pedido:** Daniel · **Status:** implementada; falta criar a ação de conversão no Google Ads (ver Pendente).

## O que foi feito
- `/thank-you/` (EN) e `/nl/thank-you/` (NL): `noindex`, fora de menu/rodapé, mesmo template da home (parchment/amber), GTranslate (IDs 83920475 / 71604829), cookie banner + Consent Mode idênticos ao resto do site.
- Mari envia o link só para quem comprou. Abrir a página = **compra**:
  - GA4 `purchase` (`G-EBY5JJD27V`), `value` 250 EUR (menor ticket: LP2 60 min), `transaction_id` único.
  - Valor real por cliente: `…/thank-you/?v=350`. Prévia sem disparar: `…/thank-you/?test`.
  - **Desde 23/11/2026** o link é gerado em `/mari/` (privada) com `?s=<atendimento>&v=<valor>&id=<8 chars>`: valor, item e `transaction_id` validados (50–1500, catálogo fixo, id `[a-z0-9]{6,12}`); mesmo id não conta 2×; aparelho onde a Mari desbloqueou `/mari/` não dispara. Links antigos (`?v=350`, sem parâmetros) continuam valendo. Detalhes: [`gerador-link-conversao.md`](gerador-link-conversao.md).
  - Anti-duplicação: não conta de novo no mesmo navegador por 12 h (reload).
  - Conversão Google Ads dispara só quando `ADS_PURCHASE_LABEL` (script no fim da página) estiver preenchido.
- Avaliação: 5★ → mensagem + redirect em 2,5 s (e botão) para `https://g.page/r/CXcoLkESvwsfEAE/review`; 1–4★ → campo "como melhorar?" e envio por WhatsApp à Mari (nada vai ao Google). Eventos GA4: `rating_submitted` (rating), `feedback_submitted`.
- Não carrega o listener de "clique no WhatsApp = lead": o botão de feedback não conta como lead.

## Pendente
- [x] (23/11/2026, rótulo ZwyrCJrolr4dEJqMuZhD, secundária) Criar no Google Ads a ação de conversão "Compra" (Evento da página/importar GA4 `purchase`), copiar o rótulo e colar em `ADS_PURCHASE_LABEL` nas 2 páginas. Enquanto vazio, só o GA4 registra (importável no Ads como conversão).
- [ ] Mari definir se o feedback 1–4★ deve ir por WhatsApp (atual) ou e-mail.
- [ ] Tela de pós-uso: confirmar o texto com a Mari ("Thank you for choosing Mari").

## Limitações a ter em mente
- A atribuição ao anúncio só funciona se o cliente abrir a página no **mesmo navegador** em que clicou no anúncio (cookie `gclid`) e aceitou cookies. Abrir por link do WhatsApp em outro aparelho gera `purchase` no GA4, mas dificilmente casa com o clique.
- Teste de ponta a ponta no GA4 DebugView / Tag Assistant ainda não feito (ambiente sem acesso ao Google).
