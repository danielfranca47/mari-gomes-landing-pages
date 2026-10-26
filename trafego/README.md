# trafego/ — Gestão de tráfego pago (Google Ads) da Mari

Terceiro escopo do repositório, ao lado do funil de LPs e do site institucional.
Aqui fica o estado da conta Google Ads "Mari Gomes", o que mudou nela, as
reprovações de política, os relatórios e os experimentos. As LPs continuam em
seus arquivos `.html`; esta pasta não tem código.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `conta.md` | Retrato atual da conta: campanhas, grupos, anúncios, URLs finais, orçamento, lances. Atualizar a cada relatório |
| `alteracoes.md` | Log de toda mudança na conta (e de commits em LPs usadas como URL final), mais recente primeiro |
| `politicas/reprovacoes.md` | Histórico de reprovações/limitações de política e o que foi feito |
| `politicas/vocabulario.md` | Termos permitidos/proibidos em anúncio, palavra-chave e LP (EN/NL) |
| `keywords/negativas.md` | Palavras-chave negativas propostas e aplicadas |
| `anuncios/` | Textos de anúncio versionados antes de subir no Ads |
| `experimentos/` | Testes A/B (um arquivo por teste, a partir de `_template.md`) |
| `relatorios/` | Relatórios datados `AAAA-MM-DD_<assunto>.md` |
| `../.agents/product-marketing.md` | Contexto de marketing lido pelas skills globais; aprendizados novos vão para a seção Learnings |

## Rotina semanal

1. **Coletar** (só leitura no Ads): métricas por campanha e por dia, status de
   política dos anúncios, histórico de alterações, diagnósticos, termos de pesquisa.
2. **Registrar**: novo arquivo em `relatorios/`, atualizar `conta.md`,
   `alteracoes.md` e `politicas/reprovacoes.md`.
3. **Diagnosticar**: comparar com o relatório anterior.
4. **Propor**: mudanças com motivo e métrica esperada.
5. **Aprovar**: Daniel decide (e alinha com a Mari quando for decisão de negócio).
6. **Aplicar** no Ads.
7. **Registrar** em `alteracoes.md` (data, quem, o quê, por quê).

## Regras

- A conta é **só leitura por padrão**. Nenhuma mudança sem aprovação do Daniel.
- **Recomendações do Google** (orçamento, correspondência ampla, AI Max etc.) só
  são aplicadas depois de revisadas; aumento de orçamento por recomendação não
  pode ser desfeito.
- **Texto de anúncio novo** passa por `politicas/vocabulario.md` (e pelo
  Preflight, se instalado) antes de subir. Anúncio reprovado não é editado: cria-se
  um novo, para manter o histórico.
- **Commit que muda uma LP usada como URL final** é anotado em `alteracoes.md`:
  o Google revisa a página de destino, e uma mudança de texto pode reprovar
  anúncios que apontam para ela.
- Exports brutos (CSV) do Ads não são versionados; os números que importam vão
  para o relatório.
