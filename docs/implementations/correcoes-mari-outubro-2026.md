# Correções pedidas pela Mari (outubro/2026)

**Status:** Implementado localmente (04/10/2026) — falta validar no site publicado.

---

## Motivação

Em 04/10/2026 a Mari mandou 7 pontos de correção do site (via Daniel), com o pedido
de procurar os mesmos padrões no resto do site e corrigir onde se repetissem:

1. `/prices/`: valores sempre do mais barato para o mais caro.
2. Home: trocar "experiência íntima e compartilhada" (remete a erótico).
3. Home: a seção de serviços falava de domicílio logo de cara e de outras cidades.
   Ela atende **só em Amsterdã** e quer o domicílio "camuflado"; o espaço é para
   falar da massagem tântrica.
4. Home, "Why Choose My Services?": o atendimento no local aparecia como diferencial;
   trocar pela qualidade do serviço como especialista e os anos de experiência.
5. Home, "Privacy & Discretion": inverter a frase (estúdio primeiro) e acrescentar
   "se precisar, consulte-me sobre disponibilidade de atendimento no seu local".
6. Home, mesma seção: "Holistic Wellness" primeiro.
7. Bio: acrescentar "Terapeuta Tântrica Bioenergética" depois de "especialista".

---

## Problemas Identificados (estado anterior)

1. **Linhas de `/prices/` fora de ordem e com valores antigos:** as linhas iam
   €300, €300, €420, €300, €300, €420, €420; os 3 serviços das LPs ainda mostravam a
   tabela da Tantrana e havia sobretaxa noturna que não existe. Fly Me In também
   fora de ordem (€600, €350, €1.200, €1.500).
2. **Vocabulário que remete a erótico:** "shared, intimate experience" (Home),
   "nurture intimacy" (Home e Treatments), "intimacy" no explicador de tantra,
   "sensuality / desire / pleasure / intimacy" (Fly Me In), "intimate" 4× + "Deepen
   intimacy" (Workshop), "intimate space" (LP3).
3. **Domicílio em destaque e outras cidades:** seção My Services da Home (título
   "in the Comfort of Your or My Space", Utrecht/Haia/Rotterdam, card Outcall antes
   do Incall), blocos "What to Expect from Your Outcall/Incall Session", notas com
   "Outcall to your hotel" em Prices e Treatments, negrito "or at your home or
   hotel" no About da LP2, e a página Fly Me In ("worldwide").
4. **Diferenciais da Home:** card "Convenience" vendia o serviço móvel (e usava
   "we/our", sendo que a Mari atende sozinha).
5. **Bio sem o título dela:** Home, About, LP1 e LP2.

---

## Abordagem

- "Mais barato primeiro" = ordem crescente (a frase original dizia "decrescente",
  mas o exemplo era o mais barato primeiro — confirmado pelo Daniel).
- Domicílio só aparece em notas discretas e sempre "within Amsterdam": FAQ da Home,
  nota de Prices (+€50) e nota de Treatments. Os termos "Outcall/Incall" saíram.
- Anos de experiência entram **sem número** (a Mari ainda não informou quantos —
  pendência #7).
- Fly Me In: fora do menu e do rodapé e com `noindex`, porque contradiz "só em
  Amsterdã". A página continua acessível pela URL e foi ajustada.
- `/prices/` mantém os nomes já usados na Home e em Treatments ("Holistic Energy
  Massage", "Relaxation & Stress Relief"), só com valores e durações das LPs.
- Workshop: só "intimate/intimacy". O conteúdo lingam/yoni segue nas pendências #8 e #13.
- LPs: 3 trocas de texto, sem prévia `-v2` (não toca em scripts nem estrutura) —
  autorizado pelo Daniel.

Este doc absorve as fases 1 a 3 de `alinhamento-precos-site-institucional.md`.

---

## Plano de Implementação

### Fase 1 — Home

**Objetivo:** aplicar os pontos 2 a 7 e as repetições dentro da Home.

| Arquivo | O que muda |
|---|---|
| `index.html` / `home-en.html` | Item 03 de "This is for you if"; card Couples; explicador; My Services reescrita; um bloco só de "What to Expect"; diferenciais reordenados com "Expertise & Experience"; bio com o título; FAQ de local |
| `nl/index.html` / `home-nl.html` | Idem (espelhado) |

### Fase 2 — Prices

**Objetivo:** valores reais, linhas do mais barato ao mais caro, sem sobretaxa noturna.

| Arquivo | O que muda |
|---|---|
| `prices/index.html` | Relaxation €250/€300/€350 · Holistic Energy €300/€350/€400 · Couples €350/€400/€450/€500; linhas ordenadas; nota 9:00–19:00; visita em Amsterdã +€50 |
| `nl/prices/index.html` | Idem (espelhado) |

### Fase 3 — Treatments e About

| Arquivo | O que muda |
|---|---|
| `treatments/index.html` / `nl/treatments/index.html` | Card Couples sem "intimacy"; nota sem "Outcall", só Amsterdã |
| `about/index.html` / `nl/about/index.html` | Título "Bioenergetic Tantric Therapist" na bio |

### Fase 4 — Fly Me In e Workshop

| Arquivo | O que muda |
|---|---|
| `fly-me-in/index.html` / `nl/fly-me-in/index.html` | Preços em ordem (€350 primeiro); termos sensuais suavizados; `noindex` |
| `workshop/index.html` / `nl/workshop/index.html` | "intimate" → "small/private"; "Deepen intimacy" → "Deepen your connection" |
| 12 páginas institucionais + `home-en.html` / `home-nl.html` | Link "Fly Me In" removido do menu e do rodapé |

### Fase 5 — LPs

| Arquivo | O que muda |
|---|---|
| LP1 EN/NL (+ `lp1-*.html`) | About: "Bioenergetic Tantric Therapist and specialist in…" |
| LP2 EN/NL (+ `lp2-*.html`) | About: mesmo título; negrito sem "or at your home or hotel" |
| LP3 EN/NL (+ `lp3-*.html`) | "intimate space" → "calm space" |

---

## Checks de Validação

### Cenário 1 — Home (local)
- [x] Sem "outcall", "incall", outras cidades, "intimate/intimacy" em `index.html`, `nl/index.html` e nas cópias legadas
- [x] `index.html` × `home-en.html` e `nl/index.html` × `home-nl.html` diferem só nos links das LPs e caminhos de imagem
- **Validado em:** 04/10/2026 — por busca de texto e `diff`

### Cenário 2 — Prices (local)
- [x] Linhas em ordem crescente de preço inicial; valores iguais aos da seção `#pricing` de cada LP
- [x] Nenhuma menção a sobretaxa noturna
- **Validado em:** 04/10/2026 — por busca de texto

### Cenário 3 — LPs (local)
- [x] Blocos `<script>` das 6 LPs idênticos aos do commit anterior
- [x] `<slug>/index.html` idêntico ao `lp*-*.html` correspondente
- **Validado em:** 04/10/2026 — por `diff`

### Cenário 4 — Site publicado
- [ ] Após o push, abrir `amarigomes.com`, `/prices/`, `/treatments/`, `/about/` (EN e NL) e conferir os textos novos
- [ ] Menu e rodapé sem "Fly Me In" no desktop e no menu hambúrguer do celular
- [ ] As 6 LPs carregam e o clique no WhatsApp continua disparando a conversão

---

## Ajustes Possíveis Pós-Implementação

- Número de anos de experiência da Mari, quando ela informar (pendência #7).
- Destino da página Fly Me In (voltar ao menu ou remover de vez).
- Demais linhas de `/prices/` (Dearmouring, Chakra, Couple Ritual, Coaching) seguem com os valores antigos — pendência #11-3.
- Home e Treatments ainda chamam os serviços de "Holistic Energy Massage" / "Relaxation & Stress Relief"; as LPs usam "Tantric Energy Experience" / "Tantric Holistic Relaxation".
- FAQ da Home "How does pricing work? Can I get a quote?" ainda fala em orçamento.
