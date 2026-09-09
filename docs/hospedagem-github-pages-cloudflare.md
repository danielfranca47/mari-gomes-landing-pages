# Migração de Hospedagem: TurboCloud → GitHub Pages + Cloudflare

**Objetivo:** tirar `amarigomes.com` (home institucional **e** as 6 landing pages de
campanha) da hospedagem paga na TurboCloud e servir tudo como arquivos estáticos
direto do GitHub (gratuito), com a Cloudflare cuidando de DNS/SSL/CDN na frente —
mesmo padrão já usado em outros projetos do Daniel.

**O que muda:** onde os arquivos ficam hospedados.
**O que NÃO muda:** as URLs públicas das 6 LPs (estão ativas em anúncios pagos do
Google Ads — não podem mudar, senão os anúncios apontam pro lugar errado), os dados
de contato, o tracking de conversão.

---

## Como ler este documento

Cada fase diz **quem faz**: você (Daniel, no painel da Cloudflare/GitHub/registrador
do domínio) ou eu (Claude, mexendo no código/repositório). Fases marcadas "**Eu
faço**" têm, ao final, uma caixa **"Prompt pra colar aqui"** — copie exatamente esse
texto numa conversa comigo quando chegar nessa etapa.

**Não pule fases.** A ordem existe pra nunca ficar com o site fora do ar: só trocamos
os nameservers (Fase F) depois que o GitHub Pages já está pronto e testável.

---

## Antes de começar — inventário de segurança (você faz)

Isso evita duas dores de cabeça clássicas de migração de domínio:

1. **E-mail no domínio:** confirme se existe algum e-mail tipo `contato@amarigomes.com`
   configurado (a Mari usa `marycontato@gmail.com`, que é Gmail e não depende disso —
   mas vale confirmar que não existe outro e-mail profissional configurado na
   TurboCloud). Se existir, anote os registros **MX** atuais antes de trocar
   nameservers — sem isso, o e-mail para de funcionar.
2. **Conteúdo que só existe no WordPress:** confira se há algo na home atual (posts,
   páginas) que não está neste repositório. Se houver algo que a Mary queira manter,
   exporte/salve antes de desligar a TurboCloud.
3. **Repositório sincronizado:** confirme que está tudo commitado e com `git push`
   feito antes de começar (`git status` deve estar limpo, `git log` local = remoto).

---

## Visão geral das fases

| Fase | Quem faz | O quê |
|---|---|---|
| A | Você | Cadastrar `amarigomes.com` na Cloudflare (sem ativar ainda) |
| B | Você → decisão | Confirmar a estrutura de URLs final (proposta abaixo) |
| C | **Eu** | Reestruturar o repositório em pastas pro GitHub Pages servir nas URLs certas |
| D | Você | Ativar o GitHub Pages nas configurações do repositório |
| E | Você | Configurar os registros DNS na Cloudflare, apontando pro GitHub Pages |
| F | Você | Trocar os nameservers do domínio pros da Cloudflare (no registrador atual) |
| G | Você + Eu | Validar tudo no ar antes de cancelar a TurboCloud |
| H | Você | Cancelar a hospedagem da TurboCloud |

---

## Fase A — Cadastrar o domínio na Cloudflare (você)

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e crie uma conta (ou
   entre, se já tiver).
2. Clique em **"Add a Site"** → digite `amarigomes.com` → escolha o plano **Free**.
3. A Cloudflare vai escanear os registros DNS que já existem hoje. **Revise a lista**
   e confira se bate com o inventário de segurança do passo anterior (principalmente
   qualquer registro `MX`).
4. Ao final, a Cloudflare mostra **2 nameservers** (algo como
   `aisha.ns.cloudflare.com` e `bruno.ns.cloudflare.com`). **Anote os dois** — vamos
   usar na Fase F.
5. **Não troque nada no registrador do domínio ainda.** Só o cadastro por enquanto.

---

## Fase B — Confirmar a estrutura de URLs (decisão sua)

As 6 LPs **precisam manter exatamente as URLs de hoje** (estão nos anúncios):

| URL (mantém) | Arquivo atual |
|---|---|
| `/holistic-energy-massage-en/` | `lp1-holistic-energy-en.html` |
| `/holistic-energy-massage-nl/` | `lp1-holistic-energy-nl.html` |
| `/relaxation-massage-en/` | `lp2-relaxation-en.html` |
| `/relaxation-massage-nl/` | `lp2-relaxation-nl.html` |
| `/couples-massage-en/` | `lp3-couples-en.html` |
| `/couples-massage-nl/` | `lp3-couples-nl.html` |

Para a **home institucional**, minha proposta (confirme ou ajuste antes da Fase C):

| URL proposta | Arquivo |
|---|---|
| `/` (raiz, idioma padrão) | `home-en.html` |
| `/nl/` | `home-nl.html` |

Se topar essa estrutura, seguimos pra Fase C. Se quiser outra (ex.: `/en/` e `/nl/`
sem raiz direta, ou algo diferente), me avise antes de pedir a reestruturação.

---

## Fase C — Reestruturar o repositório (**eu faço**)

O GitHub Pages serve arquivos estáticos puros: pra uma URL como
`/holistic-energy-massage-en/` funcionar, precisa existir um arquivo
`holistic-energy-massage-en/index.html` no repositório (Pages entende
"pasta = URL", "index.html dentro dela = o que carrega").

O que essa fase envolve (do meu lado):
- Criar uma pasta por página, cada uma com um `index.html` (cópia do conteúdo atual
  do respectivo `.html`), preservando os arquivos originais na raiz (não apagar nada,
  só duplicar na estrutura nova) — evita qualquer regressão caso algo dê errado.
- Ajustar os caminhos de imagem (`images/...`) dentro de cada `index.html` novo pra
  continuarem resolvendo corretamente de dentro da subpasta (`../images/...`).
- Criar o arquivo `CNAME` na raiz do repositório, com o conteúdo `amarigomes.com` —
  é isso que diz ao GitHub Pages qual domínio customizado usar.
- Criar um arquivo vazio `.nojekyll` na raiz — evita que o GitHub tente processar o
  site como um projeto Jekyll (não é o caso; sem isso, arquivos/pastas com `_` no
  nome, como as que já temos em `docs/implementations/`, seriam ignorados ou dariam
  erro de build).
- **Adicionar às 6 LPs o mesmo bloco de Consent Mode v2 + GA4 + banner de cookies que
  já existe em `home-en.html`/`home-nl.html`** (ver Fase 7.1 do arquivo
  `docs/implementations/site-institucional-home.md`) — hoje as LPs ainda são
  servidas pelo WordPress e dependem do Site Kit + CookieAdmin Pro de lá pra isso;
  sem esse bloco, sair do WordPress mata o GA4 e o banner de consentimento nas LPs
  também, não só na home. Measurement ID do GA4 já resolvido (`G-EBY5JJD27V`, ver
  Fase 7.1) — é só reaproveitar o mesmo bloco.
- Commitar tudo.

### Prompt pra colar aqui

> Confirma a estrutura de URLs da Fase B do doc
> `docs/hospedagem-github-pages-cloudflare.md` e reestrutura o repositório pra
> publicar no GitHub Pages: cria uma pasta por página (as 6 LPs + a home, EN e NL)
> com `index.html` dentro de cada uma, nas URLs listadas na Fase B, ajusta os
> caminhos de imagem, replica nas 6 LPs o bloco de Consent Mode + GA4 + banner de
> cookies que já existe na home (Fase 7.1 do arquivo de implementação da home), cria
> `CNAME` (`amarigomes.com`) e `.nojekyll` na raiz, e commita tudo.

---

## Fase D — Ativar o GitHub Pages (você)

1. No repositório no GitHub (`danielfranca47/mari-gomes-landing-pages`), vá em
   **Settings → Pages**.
2. Em **"Build and deployment" → Source**, escolha **"Deploy from a branch"**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`.
4. Clique **Save**.
5. Ainda em Pages, em **"Custom domain"**, digite `amarigomes.com` e salve (o GitHub
   confirma/mantém o arquivo `CNAME` que já criamos na Fase C).
6. O GitHub vai tentar checar o DNS agora e **vai falhar** — é esperado, porque ainda
   não configuramos nada na Cloudflare (próxima fase). Sem problema, ele revalida
   sozinho depois.

---

## Fase E — Configurar o DNS na Cloudflare (você)

No painel da Cloudflare, no domínio `amarigomes.com` → **DNS → Records**, adicione:

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | Proxied (nuvem laranja) |
| A | `@` | `185.199.109.153` | Proxied |
| A | `@` | `185.199.110.153` | Proxied |
| A | `@` | `185.199.111.153` | Proxied |
| CNAME | `www` | `danielfranca47.github.io` | Proxied |

Esses 4 IPs são fixos do GitHub Pages (não mudam por projeto). **Remova** qualquer
registro `A`/`CNAME` antigo que apontava pra TurboCloud — mas **mantenha** qualquer
`MX` que você identificou no inventário de segurança (Fase 0).

Depois, vá em **SSL/TLS → Overview** e selecione o modo **"Full"** (não "Flexible" —
com "Flexible" o GitHub Pages entra em loop de redirecionamento HTTPS).

---

## Fase F — Trocar os nameservers do domínio (você)

1. Entre no painel onde `amarigomes.com` está **registrado** (confirme se é a própria
   TurboCloud ou outro registrador — nem sempre é o mesmo lugar da hospedagem).
2. Procure a opção **"Nameservers"** / **"Servidores DNS"** do domínio.
3. Troque pelos 2 nameservers da Cloudflare anotados na Fase A.
4. Salve. A propagação pode levar de alguns minutos até ~24-48h (normalmente é bem
   mais rápido).

---

## Fase G — Validar tudo antes de cancelar a TurboCloud (você + eu)

1. No painel da Cloudflare, aguarde o status do domínio mudar pra **"Active"**.
2. No GitHub, volte em **Settings → Pages** e confirme que o certificado HTTPS foi
   emitido; marque **"Enforce HTTPS"**.
3. Teste manualmente as 7 URLs (home + 6 LPs) no navegador.
4. Teste os botões de WhatsApp e — se puder — confirme uma conversão de teste no
   Google Ads/Analytics.

### Prompt pra colar aqui (quando o DNS já tiver propagado)

> As URLs de `amarigomes.com` já devem estar apontando pro GitHub Pages via
> Cloudflare. Pode conferir com o Chrome DevTools se as 7 páginas (home + 6 LPs)
> carregam certo — console sem erros, imagens aparecendo, bandeiras do GTranslate,
> links de WhatsApp com o texto certo, e o tracking de conversão disparando?

**Só avance pra Fase H depois de confirmar que está tudo certo por alguns dias** —
inclusive checando se os anúncios do Google Ads continuam levando pro lugar certo.

---

## Fase H — Cancelar a hospedagem da TurboCloud (você)

Só depois da Fase G validada. Cancele a assinatura/hospedagem na TurboCloud.

---

## Pontos de atenção

- **Google Ads:** como as URLs das LPs não mudam, não deveria haver impacto na
  campanha nem no Quality Score — mas vale conferir os anúncios ativos após o
  cutover, por segurança.
- **E-mail no domínio:** se existir, o registro `MX` precisa sobreviver à migração
  (ver Fase 0 e Fase E).
- **SSL "Full", não "Flexible":** esse é o erro mais comum nesse tipo de migração —
  causa loop de redirecionamento infinito no navegador.
- **Nada é apagado até você confirmar:** a Fase C duplica os arquivos em pastas
  novas, não remove os originais da raiz — dá pra reverter fácil se algo não bater.
