# Log de alterações — conta Google Ads e LPs usadas como URL final

Mais recente primeiro. Registrar data/hora (GMT+02:00), quem, o quê, onde e por quê.
Mudanças feitas no Ads aparecem também no "Histórico de alterações" do Google Ads;
commits de LP são deste repositório.

| Data e hora | Quem | Onde | O que mudou | Por quê / origem |
| --- | --- | --- | --- | --- |
| 01/11/2026 ~23:50 | Claude (aprovado por Daniel) | [CP-03] #4 / Recursos | Recurso de preço (EN, Services, EUR, "From"): Relaxation Massage €250 · Holistic Energy Session €300 · Couples Massage €350, cada um com a LP EN. Status: em análise. Desfazer: remover o recurso | Pacote 01/11-b item 3 — filtrar por preço antes do clique |
| 01/11/2026 ~23:45 | Claude (aprovado por Daniel) | [CP-03] #4 / G2 - Deep Relax | RSA EN novo "Relaxation Massage Amsterdam" (`anuncios/cp-03-4_g2-deep-relax.md`), "Sessions From €250" fixado na posição 2. Status: em análise. Desfazer: pausar | Pacote 01/11-b item 2b |
| 01/11/2026 ~23:40 | Claude (aprovado por Daniel) | [CP-03] #4 / G2 - Deep Relax | Contestação do "Relaxation Massage" (EN) reprovado — motivo "Fiz alterações para obedecer à política", escopo: grupo G2. Status: em contestação (1ª de 3). Anúncio segue pausado | Pacote 01/11-b item 2a — página corrigida no commit 4cad8a3 |
| 01/11/2026 ~23:35 | Claude (aprovado por Daniel) | [CP-03] #4 (campanha) | 11 negativas de frase: cheap, cheapest, goedkoop, goedkope, budget, affordable, discount, korting, tantra, tantric, tantrisch. Desfazer: remover em Palavras-chave > Negativas | Pacote 01/11-b item 4 |
| 01/11/2026 ~23:30 | Claude (aprovado por Daniel) | Site — 6 LPs de anúncio + 6 legados | Commit 4cad8a3: "Tantric" removido (nomes de serviço, bio, FAQ, WhatsApp, texto do Instagram). Tags conferidas idênticas. Desfazer: `git revert 4cad8a3` | Pacote 01/11-b item 1 |
| 01/11/2026 ~23:10 | Claude (aprovado por Daniel) | [CP-03] #4 / G1 Holistisch & Energetisch | Negativas de frase no grupo: "price menu", "45 minute", "daily full body". Desfazer: remover as 3 em Palavras-chave > Negativas | Pacote 01/11 item 1 — buscas de massagem barata/genérica |
| 24/10/2026 23:00 | Mari (app) | [CP-03] #4 / G2 - Deep Relax | Removida a ampla body massage amsterdam; adicionada "massage amsterdam" | Não registrado |
| 22/10/2026 20:14 | Mari (app) | [CP-03] #4 / G1 e G3 | Removidas "kundalini massage amsterdam", "energetische massage amsterdam" (G1), "koppels massage amsterdam" (G3) e a ampla massage in amsterdam (G1) | Recomendação "Palavra-chave redundante" |
| 22/10/2026 20:13 | Mari (app) | [CP-03] #4 / G2 - Deep Relax | Adicionada a ampla thuis massage amsterdam | Recomendação "Correspondência ampla" |
| 22/10/2026 20:10 | Mari (app) | [CP-03] #4 | Orçamento €15 → €28/dia (não pode ser desfeita) | Recomendação "Aumento do orçamento para ROI marginal" |
| 22/10/2026 20:04 | Mari (app) | [CP-03] #3 (pausada) / G2 | Adicionada a ampla massage amsterdam | Não registrado |
| 09/10/2026 13:42 | Daniel | [CP-03] #4 | Campanha reativada | Não registrado |
| 09/10/2026 09:20 | Daniel | [CP-03] #4 | Campanha pausada | Não registrado |
| 04/10/2026 | repo (`621088f`, `157007b`) | LPs (6) | Correções da Mari nas LPs; "visit" → "session" | Pedido da Mari |
| 03/10/2026 20:04 | Daniel | [CP-03] #4 / G2 | Anúncio "Relaxation Massage" pausado (só status) | Anúncio reprovado |
| 02/10/2026 05:32 | Mari (app) | [CP-03] #3 | Meta de CPA definida; orçamento aumentado | Recomendação |
| 02/10/2026 05:28 | Mari (app) | [CP-03] #3 | 4 palavras-chave redundantes removidas | Recomendação |
| 01/10/2026 13:37 | Daniel | [CP-03] #3 | Campanha pausada | Substituída pela #4 |
| 01/10/2026 13:36 | Daniel | [CP-03] #4 | Campanha criada como cópia da #3 (3 grupos, 6 anúncios, 33 frase + 38 ampla) | Nova campanha |
| 27/09/2026 | repo (`c770df4`, `41ecee7`) | LP1 e LP2 (EN/NL) | Preços nas LPs; LP1 → "Tantric Energy Experience", LP2 → "Tantric Holistic Relaxation" | Pedido da Mari. **Possível gatilho da reprovação do "Relaxation Massage" (URL /relaxation-massage-en/)** — hipótese |
| 27/09/2026 | repo (`26af10c`) | LPs (6) | Fotos voltam a carregar de `/images/` | Estavam em 404 desde 09/09 |
| 27/09/2026 15:18–15:23 | Daniel | Conversões | Exclusão "Tag de conversão quebrada — migração do site (set/2026)"; ajuste em "Clique_Botao_Contato" | Correção da tag |
