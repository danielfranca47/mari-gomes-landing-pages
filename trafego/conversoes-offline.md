# Conversões de venda no Google Ads — guia do Daniel (Fase 2)

Plano, decisões e testes: [`docs/implementations/atribuicao-anuncio-fase2.md`](../docs/implementations/atribuicao-anuncio-fase2.md).
Código: `workers/atribuicao/` (Worker) e as prévias `<slug>-v2/` das 6 LPs. **Nada disto está no ar ainda**: as LPs
reais não foram tocadas e nenhuma prévia foi promovida. Este arquivo é o passo a passo para quem tem acesso às contas.

> Repositório público: **nenhum segredo, chave, usuário ou senha entra aqui ou no código.** Os valores reais ficam só no
> Cloudflare (segredos do Worker) e no celular da Mari.

## Como o fluxo funciona (resumo)
1. Visitante aceita os cookies na LP → a LP guarda o clique (gclid) + um código `MG-XXXXX` por 90 dias e põe `(ref MG-XXXXX)` no fim da mensagem do WhatsApp.
2. No clique do WhatsApp, a LP avisa o Worker (`/api/lead`): `código → gclid + horário do clique`.
3. Depois da sessão, a Mari cola a 1ª mensagem do cliente em `/mari/`, gera o link de obrigado e a página registra a venda (`/api/sale`).
4. O Worker junta venda + clique e serve `GET /api/export.csv`; o Google Ads importa esse CSV como conversão offline com o valor real.

## Ordem recomendada
1. Ação **"Compra" (site)** → rótulo em `ADS_PURCHASE_LABEL` → secundária.
2. Testar as 6 prévias `-v2`.
3. Política de privacidade (pendência #14) → Worker no ar → promoção das LPs.
4. Ação **"Compra (importada)"** (offline) como secundária por 4–6 semanas.
5. Só depois, com ≥ 15 vendas importadas em 30 dias, decidir tornar uma delas principal e mudar o lance para valor.
**Nunca as duas como principais:** o Ads não deduplica uma ação contra a outra (a mesma venda contaria 2×).

## 1. Ação "Compra" (conversão do site)
- Google Ads › Metas › Conversões › Nova › Site › criar manualmente com tag.
- Valor: "usar valores diferentes por conversão"; moeda EUR; contagem **Uma** por clique não serve aqui — use **Todas** (a venda é rara e cada link é uma venda).
- Meta/ação principal ou secundária: **secundária** (observação).
- Copiar o rótulo (a parte depois de `AW-18036442650/`) e colar em `ADS_PURCHASE_LABEL` em `thank-you/index.html` e `nl/thank-you/index.html` (commit à parte, registrar em `alteracoes.md`).

## 2. Testar as prévias `-v2`
Endereços: `amarigomes.com/<slug>-v2/` (as 6; têm `noindex` e a conversão de lead **travada**, então testar não gera conversão falsa).
- No celular, abrir `…-v2/?gclid=teste_Gclid_123456` → **Accept** → o botão do WhatsApp deve abrir a conversa com `(ref MG-XXXXX)` no fim do texto.
- Abrir de novo e escolher **Essential only**: o texto volta ao normal e nada é guardado.
- Sem escolher nada no banner: nada muda.
- (Depois do Worker no ar) conferir que `POST /api/lead` responde 204 (aba Rede do navegador).

## 3. Cloudflare (Worker)
Ver `workers/atribuicao/README.md`: KV `ATTR`, segredos `SALE_KEY`/`EXPORT_USER`/`EXPORT_PASS`, rota `amarigomes.com/api/*`,
rate limit em `POST /api/lead`, **logs/observabilidade desligados**. Depois abrir uma vez no celular da Mari
`https://amarigomes.com/mari/#k=<SALE_KEY>` (a chave fica só no aparelho; o `#` é apagado da barra).

## 4. Ação "Compra (importada)" (conversão offline)
- Google Ads › Conversões › Nova › **Importar** › Outras fontes de dados › Cliques rastreados (offline).
- Valor variável (EUR), contagem **Todas**, janela de conversão por clique **90 dias**, **secundária**.
- O nome da ação tem de ser **igual** a `CONVERSION_NAME` no Worker (padrão `Compra (importada)`).
- Esperar ~6 h depois de criar a ação antes do 1º upload (a ação precisa ficar pronta no Ads).
- Baixar o **modelo de upload** no próprio Ads e **conferir as colunas** com o CSV do Worker:
  `Google Click ID, Conversion Name, Conversion Time, Conversion Value, Conversion Currency, Order ID, Ad User Data`
  e a 1ª linha `Parameters:TimeZone=+0000`. Se o modelo for diferente, ajustar o Worker (F15) antes de subir.
- Upload: **agendado por HTTPS** (URL `https://amarigomes.com/api/export.csv`, usuário/senha do `EXPORT_USER`/`EXPORT_PASS`) — conferir
  no Ads se a conta tem essa opção — ou **manual semanal** (baixar o CSV com `curl -u` e subir). Order ID repetido é deduplicado.
- `?format=json` no mesmo endereço mostra só contagens (linhas, sem lead, só prévia, gbraid/wbraid fora, fora da janela, deduplicadas em 24 h).
- Só entram vendas de clique **gclid**; gbraid/wbraid ficam fora até confirmar que o modelo do Ads os aceita.

## 5. GA4
Criar dimensão personalizada de evento `ref_code` (eventos `purchase` e `whatsapp_ref`) para o relatório lead × venda.

## 6. Checklist de promoção das `-v2` (uma LP por vez, começando pela de mais tráfego)
1. Política de privacidade publicada e Worker no ar (nunca promover com dado real antes).
2. `vocabulario.md` conferido; texto visível não muda (só entra um `<script>`).
3. Copiar `<slug>-v2/index.html` por cima de `<slug>/index.html` **e** do `lp*-*.html` legado; remover o `<meta name="robots">`, a trava `if (!/-v2\//…)` do listener de lead e o comentário `// Prévia -v2`; `git rm -r <slug>-v2`.
4. Rodar `node scripts/test-atribuicao.js R` contra a versão no ar e **conferir que os blocos `<script>` (Consent Mode, `GT-55XJZX3L`, `G-`/`AW-`, conversão, cookie banner, GTranslate) ficaram idênticos** à versão anterior. Regressão de tag já custou 18 dias de conversões.
5. Registrar data/hash/páginas em `trafego/alteracoes.md` e acompanhar o status dos anúncios por 3 dias.

## 7. Modelo de linha do CSV (exemplo fictício)
```
Parameters:TimeZone=+0000
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Order ID,Ad User Data
Test_gclid-123456,Compra (importada),2026-11-23 14:00:00,350,EUR,ab12cd34,Granted
```
