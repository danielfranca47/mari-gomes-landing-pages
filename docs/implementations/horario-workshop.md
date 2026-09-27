# Horário do Workshop fora do expediente da Mari

**Status:** Planejado — diagnóstico pronto (27/09/2026), bloqueado pela pendência #13; falta Plan Mode + aprovação.

> Criado a partir dos "ajustes possíveis" da implementação de preços nas LPs (já graduada — ver `CLAUDE.md`, seção "Preços nas LPs"). Antes de implementar,
> seguir o Passo 0 de `_guia-documentar-implementacao.md`.

---

## Motivação

Em 27/09/2026 a Mari informou (via Daniel) que atende só das **9:00 às 19:00**. A
página do Workshop anuncia uma sessão noturna até as 22:00.

---

## Problemas Identificados (estado atual)

1. **Horário do Workshop até 22:00** — `workshop/index.html` e `nl/workshop/index.html`:
   - hero/meta (linha ~349): "Amsterdam · 10:00–15:00 & 17:00–22:00"
   - bloco de currículo (linha ~388): "Evening Session — Conscious Touch & Tantra
     Massage for Men" / "Avondsessie — …"
   - bloco de horários (linha ~485): "10:00–15:00 morning session · 15:00–17:00 lunch
     & personal break · 17:00–22:00 evening session."
2. **Conteúdo do Workshop veio da Tantrana** (pendência #10): `workshop.txt` cita
   "Tantrana workshop" e `bookings@tantrana.nl`. O horário pode ser da Tantrana, não da
   Mari — por isso não dá pra só "encaixar" em 9–19 sem perguntar.

---

## Abordagem proposta

Depende da resposta da pendência #13:
- **Workshop é da Mari e o horário noturno vale** (workshop é exceção ao expediente) →
  nenhuma mudança de horário; só registrar a exceção no `CLAUDE.md` (dados de negócio).
- **Workshop é da Mari, mas dentro de 9–19** → reescrever os 3 trechos com o novo
  cronograma (EN/NL).
- **Workshop não é oferecido pela Mari** → decidir no Plan Mode se a página sai do
  menu/rodapé/`/prices/` ("Tantra Massage Workshop — From €275 pp") ou fica oculta.

## Fases sugeridas

| Fase | Arquivos | O que muda |
|---|---|---|
| 1 | `workshop/index.html`, `nl/workshop/index.html` | horários (ou remoção) conforme resposta |
| 2 (se remover) | nav/footer das páginas institucionais, `prices/` (+ `nl/`) | tirar links/linha do Workshop |

---

## Checks de Validação (propostos)

### Cenário 1 — Horário coerente
- [ ] Nenhum horário do Workshop contradiz o expediente informado pela Mari (ou a exceção está documentada)
- [ ] EN e NL com o mesmo cronograma

---

## Pendências relacionadas

- #13: horário/existência do Workshop
- #10: auditoria do texto copiado da Tantrana
