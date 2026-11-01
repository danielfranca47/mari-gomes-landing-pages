# Backlog de tráfego — Mari

Mantido pelo `gestor-trafego`. P1 = bloqueia meta · P2 = melhora meta · P3 = higiene.
Aprovação = precisa do Daniel no pacote semanal.

| ID | Pri | Tarefa | Responsável | Aprovação | Status | Evidência |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | P1 | Decidir uso de "Tantric" nas páginas de anúncio (LP1/LP2/LP3) | Daniel + Mari | Decisão de negócio | Bloqueio | Pendência #8; reprovação "Relaxation Massage" desde ~01/10 |
| T02 | P1 | Descobrir onde se perdem os contatos: 29 contatos → 1 agendamento (19–23/10) | gestor + Mari | — | Hipótese: buscas genéricas/de preço no G1 (relatório 01/11); item 3 do pacote | `relatorios/2026-11-01_feedback-vendas-19-23-out.md` |
| T03 | P1 | Novo anúncio de relaxamento EN (G2) sem padrão reprovado | copy-writer + audit-policy-compliance | Sim | Bloqueada por T01 | `politicas/reprovacoes.md` |
| T04 | P1 | Página `/relaxation-massage-en-v2/` com linguagem terapêutica | skill cro + CLAUDE.md (-v2) | Sim (publicação) | Bloqueada por T01 | Hipótese LP2 renomeada 27/09 |
| T05 | P2 | Dar mais alcance ao grupo de casais (melhor CTR 15,49%, só 9% das impressões em 25–31/10); reavaliar "koppels massage amsterdam" removida em 22/10 | audit-google + audit-budget | Sim | No pacote 01/11 (item 2) | Grupos 25–31/10 |
| T06 | P2 | Revisar palavras amplas aceitas em 22/10 e negativas com relatório de termos | skill ads | Sim | Parcial: item 1 do pacote 01/11; resto aguarda planilha (T08) | `alteracoes.md` 22/10; termos "tantra near me" |
| T07 | P2 | Combinar com a Mari: recomendações do Google pelo app só após revisão | Daniel | — | Aberta | 4 recomendações em 22/10 |
| T08 | P3 | Ligar a planilha agendada do Google Ads no Drive | Daniel (1 vez) | — | Feita 01/11: script do Google Ads `trafego/scripts/export-planilha.js`, segunda 06:00, prévia validada (5 abas, 634 termos) | `trafego/README.md` > Fonte de dados |
| T09 | P3 | Confirmar criptografia do disco (BitLocker) para validar o perfil do claude-ads | Daniel (1 vez) | — | Feita 01/11: BitLocker confirmado pelo Daniel | `.claude-ads/setup-profile.json` |
| T10 | P3 | Forma de pagamento alternativa no Google Ads | Daniel | — | Aberta | Alerta ativo em 26/10 |
| T11 | P2 | Medir vendas de forma contínua (CRM em modo escuta) | discovery no crm-auto-digital | — | Em discovery | `crm-auto-digital/docs/discovery/escuta-whatsapp-dono-terapeuta.md` |
| T12 | P2 | Entender os anúncios fora do painel: campanha "[CA-01] CONTATO WHATS - 2026" com anúncio reprovado (PROHIBITED_DATING_AND_COMPANIONSHIP) e um 3º "Relaxation Massage" na [CP-03] como APPROVED_LIMITED pela mesma política | audit-google + audit-policy-compliance | — | Aberta | Aba `anuncios` da planilha, 01/11 |
