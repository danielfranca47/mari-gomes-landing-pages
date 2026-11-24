# Processo para anúncio reprovado ou limitado

**Revisado em 24/11/2026** com base na ajuda oficial do Google (links no fim).
Substitui a regra antiga "anúncio reprovado não é editado: cria-se um novo", que
contradizia o `CLAUDE.md` e não estava apoiada na política do Google.

## Regras (Google)

1. **Texto do anúncio viola a política → editar e salvar.** Salvar reenvia para
   revisão. Salvar sem mudar nada não reenvia.
2. **Google errou, ou o problema era a página e ela já foi corrigida → contestar**
   (Policy Manager ou coluna Status).
3. **Contestação:** máx. 3 por anúncio (depois só via suporte); esperar 24 h entre
   contestações do mesmo anúncio; contestação enviada com outra em análise não é
   processada; se falhar ou for duplicada, fazer uma edição mínima de texto ou URL e
   salvar para forçar nova leitura. Contestar por lotes (grupo/campanha), não a
   conta inteira.
4. **Criar anúncio novo** é permitido, mas não é o caminho recomendado pelo Google
   para um anúncio que viola a política, e deixa dois anúncios candidatos à mesma
   reprovação.
5. **Reincidência:** o Google conta strikes por política (aviso, depois bloqueios
   temporários de 3 e 7 dias, depois suspensão; 2º strike se a mesma política for
   violada de novo em 90 dias). Não confirmei se "encontros e acompanhantes" entra
   nesse sistema de strikes; tratar como risco. Anúncio novo que viola enquanto há
   bloqueio gera strike extra.
6. A política "Dating and Companionship" (vigente desde 03/2025) lista como exemplos
   de conteúdo proibido, entre outros, **massagem íntima** e serviços de companhia/
   acompanhante (lista não exaustiva). Verificação automática; sem detalhe do motivo.

## Fluxo do projeto

| Situação | Ação | Aprovação |
| --- | --- | --- |
| Texto do anúncio marcado ou suspeito | **Editar o próprio anúncio** (trocar o item marcado e os termos de risco do `vocabulario.md`) e salvar; registrar antes/depois em `alteracoes.md` | Daniel |
| Página corrigida e anúncio ainda reprovado | Contestar ("Fiz alterações para cumprir a política"); respeitar 3 por anúncio e 24 h | Daniel |
| Contestação recusada/duplicada | Edição mínima (texto ou URL) + salvar | Daniel |
| Anúncio sem histórico a preservar, ou teste A/B | Criar novo (exceção, justificar) | Daniel |

Antes de editar, copiar o texto atual para `trafego/anuncios/` (histórico). Pausar um
anúncio reprovado antigo só quando houver substituto aprovado. Anúncio aprovado só é
editado com motivo (nova revisão).

## Fontes

- Fix a disapproved ad or appeal a policy decision: https://support.google.com/google-ads/answer/9338593
- Easier resubmissions and appeals: https://support.google.com/google-ads/answer/9790008
- Dating and Companionship (março/2025): https://support.google.com/adspolicy/answer/15327789
- Compensated sexual acts: https://support.google.com/adspolicy/answer/10212441
- Repeat violations (strikes): https://support.google.com/adspolicy/answer/10922738
