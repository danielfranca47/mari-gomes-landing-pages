# Menu mobile (hambúrguer) no site institucional

**Status:** Em andamento

---

## Motivação

O Daniel navegou pela Home no celular e entendeu que o site tinha uma página só:
não há como chegar em About, Treatments, Prices, Workshop ou Fly Me In pelo
mobile. Pedido (29/09/2026): menu sanduíche nas páginas institucionais + links
das páginas no rodapé como segundo caminho.

---

## Problemas Identificados (estado anterior)

1. **Menu escondido sem substituto:** em `max-width: 768px` a regra
   `.nav-menu { display: none; }` some com o menu e nenhum botão hambúrguer
   existe — padrão herdado das LPs (página única), onde isso não fazia falta.
   Afeta as 12 páginas institucionais + os legados `home-en.html`/`home-nl.html`.
2. **Rodapé sem links internos:** só tem logo, e-mail, WhatsApp e Instagram.
   Na Home mobile, o único caminho para outra página era "Read my full story →"
   (About); as outras 4 páginas só eram alcançáveis digitando a URL.
3. **Nav mobile já apertado:** em 375px o logo quebra em 2 linhas e o botão
   "Book a session" encosta/passa da borda direita — não cabe um botão a mais
   na mesma linha sem reorganizar.

---

## Abordagem

```
Mobile (≤768px)
nav (flex-wrap)
  ├─ linha 1: logo ········ [BOOK A SESSION] [☰]
  └─ linha 2:        bandeiras GTranslate (centro)
  .nav-right vira `display: contents` pra CTA/☰/bandeiras serem reordenados
  ☰ → nav.menu-open → o próprio .nav-menu (mesmos links do desktop) aparece
      como painel absoluto abaixo do nav, 1 link por linha
  fecha ao tocar num link, ao tocar de novo no ☰ ou com Esc

Rodapé (todas as larguras)
  └─ .footer-nav (linha própria no topo): Home · About · Treatments · Prices ·
     Workshop · Fly Me In (NL: Home · Over mij · Behandelingen · Prijzen ·
     Workshop · Fly Me In, apontando pra /nl/...)
```

- Reaproveita o `.nav-menu` existente em vez de duplicar os links num painel
  separado — uma única lista pra manter.
- CSS + JS inline (padrão do `toggleFaq`), sem dependência externa.
- Desktop (>768px) não muda nada no nav.
- **Descartado:** mover as bandeiras pra dentro do painel via JS — o GTranslate
  injeta as bandeiras depois do load, mexer no wrapper é frágil.
- **Fora do escopo:** as 6 LPs (anúncio ativo, página única, CLAUDE.md pede não
  mexer sem pedido explícito).

---

## Plano de Implementação

### Fase 1 — Botão hambúrguer + painel mobile

**Objetivo:** no celular, ☰ abre a lista de páginas/seções em todas as páginas
institucionais.

| Arquivo | O que muda |
|---|---|
| `index.html` / `nl/index.html` | CSS do `.nav-toggle` e do painel, `<button id="nav-toggle">` no `.nav-right`, `id="nav-menu"` no menu, `<script>` do toggle |
| `about/index.html` / `nl/about/index.html` | Idem |
| `treatments/index.html` / `nl/treatments/index.html` | Idem |
| `prices/index.html` / `nl/prices/index.html` | Idem |
| `workshop/index.html` / `nl/workshop/index.html` | Idem |
| `fly-me-in/index.html` / `nl/fly-me-in/index.html` | Idem |
| `home-en.html` / `home-nl.html` (legados) | Idem |

### Fase 2 — Links das páginas no rodapé

**Objetivo:** segundo caminho de navegação, visível em qualquer largura.

| Arquivo | O que muda |
|---|---|
| Os mesmos 14 arquivos da Fase 1 | `<div class="footer-nav">` no início do `<footer>` + CSS (EN com `/…/`, NL com `/nl/…/`) |

---

## Checks de Validação

### Cenário 1 — Menu hambúrguer no celular
- [ ] Abrir a Home (EN e NL) em viewport de celular (375px e 360px)
- [ ] Confirmar: logo, "Book a session" e ☰ na mesma linha, bandeiras abaixo, nada cortado na borda
- [ ] Tocar no ☰: painel abre com os 8 links; ícone vira ✕
- [ ] Tocar num link de página (ex. Treatments): navega e o menu fica fechado na página nova
- [ ] Tocar num link de âncora (Reviews/FAQ): rola até a seção e o menu fecha
- [ ] Repetir abrir/fechar em pelo menos uma página interna EN e uma NL

### Cenário 2 — Desktop inalterado
- [ ] Abrir a Home em largura > 768px: nav igual ao anterior, sem ☰ visível

### Cenário 3 — Rodapé
- [ ] Rodapé mostra os 6 links (Home + 5 páginas) no idioma certo, em desktop e mobile
- [ ] Links NL apontam para `/nl/...`

### Cenário 4 — Site publicado
- [ ] Após push, conferir em `amarigomes.com` no celular real

---

## Ajustes Possíveis Pós-Implementação

- Destacar no menu a página atual (`aria-current`).
- Avaliar o mesmo tratamento nas LPs, se algum dia o Daniel pedir (hoje fora do escopo).
