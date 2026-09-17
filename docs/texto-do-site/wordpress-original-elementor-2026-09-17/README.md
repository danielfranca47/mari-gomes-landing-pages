# Export original do WordPress/Elementor (recuperado em 2026-09-17)

Contexto: depois da migração de hospedagem (`docs/hospedagem-github-pages-cloudflare.md`),
o DNS de `amarigomes.com` passou a apontar pro GitHub Pages e o acesso ao
`wp-admin` do WordPress antigo (TurboCloud) parou de funcionar pelo domínio. A
hospedagem TurboCloud ainda estava ativa (Fase H de cancelamento pendente) — o
acesso foi recuperado editando o arquivo `hosts` local (apontando temporariamente
`amarigomes.com` pro IP `194.126.172.234`) e depois exportado via Elementor
(Templates → Export) direto do painel.

## Arquivos

Cada arquivo é o export bruto (JSON) de uma página Elementor, renomeado do nome
original (`elementor-<post_id>-2026-09-17.json`) pra um nome descritivo:

| Arquivo | Página original (título no Elementor) |
|---|---|
| `home-en.json` | HOME EN — a página home publicada no WordPress antes da migração |
| `holistic-energy-massage-en.json` / `-nl.json` | LP1 |
| `relaxation-massage-en.json` / `-nl.json` | LP2 |
| `couples-massage-en.json` / `-nl.json` | LP3 |
| `menu-backup-portugues.json` | backup de um container de menu (não é uma página) |

**Não há versão NL da home** neste export — só existia "HOME EN" no WordPress.

## Uso

Isso é material de referência/arqueologia de conteúdo, não é servido em produção
(o site institucional atual é standalone, fora do WordPress — ver seção "Site
institucional" do `CLAUDE.md`). Serve pra recuperar textos/fatos que só existiam
nessas páginas antigas e ainda não foram capturados em `docs/texto-do-site/*.txt`
(ex.: `about.txt`, extraído do `home-en.json` deste export).

Se precisar ler o texto de algum widget dentro de um desses JSONs, procure pelas
chaves `title`, `editor` e `text` dentro de `content` → `elements` (estrutura
padrão de export do Elementor) — os arquivos estão minificados/em uma linha só.
