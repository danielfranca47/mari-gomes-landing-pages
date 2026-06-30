# Plano de Implementação — Landing Pages Mari Gomes

Cliente final: **Mary** (publicação em WordPress). 3 páginas × 2 idiomas = 6 arquivos.

---

## Fase 1 — Botões da página ✅ concluída

**Objetivo:** identificar todos os botões/links de cada página e substituir pelos links que você indicar.

**Status:** confirmado. Os dados definitivos passados (WhatsApp `+31 6 34366008`, Instagram `kirakundalini`, e-mail `marycontato@gmail.com`, logo/site mantido, tratamento como "Mari" nas mensagens) já eram **exatamente** os mesmos que estavam nos 6 arquivos desde o início. Conferência feita campo a campo:

| Dado | Valor confirmado | Ocorrências verificadas nos 6 arquivos |
|---|---|---|
| WhatsApp | `wa.me/31634366008` | 30/30 ok |
| Instagram | `instagram.com/kirakundalini` | 6/6 ok |
| E-mail | `mailto:marycontato@gmail.com` | 6/6 ok |
| Logo/site | `https://amarigomes.com` | 12/12 ok |
| Tratamento no texto | "Mari" (não "Mari Gomes") nas mensagens pré-preenchidas | já consistente em EN ("Hi Mari!") e NL ("Hoi Mari!") |

Nenhuma alteração de link foi necessária nos dados originais.

**Atualização posterior:** Instagram trocado de `kirakundalini` para **`massage.tantric.therapy`** — aplicado nas 6 páginas (link e texto exibido no rodapé).

### Destinos atuais (repetidos nas 6 páginas)

| Destino | Valor atual |
|---|---|
| WhatsApp | `https://wa.me/31634366008` (+ texto pré-preenchido por botão) |
| E-mail | `mailto:marycontato@gmail.com` |
| Instagram | `https://www.instagram.com/kirakundalini/` |
| Logo / site | `https://amarigomes.com` |

### Inventário de botões por página

**LP1 e LP2 (8 links cada, mesma estrutura):**
1. Logo no `nav` → site
2. Botão CTA do `nav` ("Book a session" / "Sessie boeken" / "Book a session") → WhatsApp
3. Botão CTA do `hero` ("Request your session →" / "Request your quote →" / equivalentes NL) → WhatsApp
4. Botão CTA final (`cta-section` / `cta-final`) → WhatsApp
5. Logo no `footer` → site
6. E-mail no `footer` → mailto
7. Telefone no `footer` → WhatsApp (sem texto pré-preenchido)
8. Instagram no `footer` → Instagram

**LP3 (11 links — tem 3 extras, um por opção de sessão):**
- Os mesmos 8 acima, **mais**:
  9. Botão "Request quote →" do card **Relaxation Duo** → WhatsApp (texto específico dessa opção)
  10. Botão "Request quote →" do card **Holistic Couple Experience** (card destacado "Most requested") → WhatsApp
  11. Botão "Request quote →" do card **Tantric Couple Therapy** → WhatsApp

### O que preciso que você indique

- Para cada destino que for trocado: a nova URL.
- Se o número de WhatsApp mudar, preciso saber se quer manter o texto pré-preenchido (e em que idioma/tom) ou remover.
- Se algum botão deve deixar de ir para WhatsApp e ir para outro lugar (ex.: formulário, página de agendamento), me diga qual botão especificamente (use a numeração acima) e o novo link.

### Execução

Depois que os links forem indicados, aplico as trocas nos 6 arquivos de uma vez, respeitando o idioma de cada botão (texto do link não muda, só o `href`).

---

## Fase 2 — Imagens ✅ concluída

**Objetivo:** mapear os campos com placeholder de foto, indicar o tamanho recomendado de cada um, e inserir as imagens que você gerar via IA.

**Status:** as 5 imagens foram recebidas em `images/` (`LP1_hero.png`, `LP1_About.png`, `LP2_Hero.png`, `LP3_Hero.png`, `LP3_Experience.png`), todas com dimensões iguais ou maiores que o recomendado e na proporção certa. Os 12 placeholders SVG nos 6 arquivos foram substituídos por tags `<img>` com `object-fit:cover` apontando para `images/...`. Mapeamento final aplicado:

| Imagem | Inserida em |
|---|---|
| `LP1_hero.png` | LP1 hero (EN + NL) |
| `LP1_About.png` | LP1 about (EN + NL) **e** LP2 about (EN + NL) — reaproveitada |
| `LP2_Hero.png` | LP2 hero (EN + NL) |
| `LP3_Hero.png` | LP3 hero (EN + NL) |
| `LP3_Experience.png` | LP3 seção "Experience" (EN + NL) |

**Otimização aplicada:** as 5 imagens foram convertidas de PNG para **WebP** (qualidade 85) — redução média de ~94% no tamanho do arquivo (de ~2MB para ~100-180KB cada). Os HTMLs já referenciam os `.webp`. Os `.png` originais ficaram guardados em `images/` como backup/fonte, mas não são mais usados pelas páginas.

Nota: a pasta `images/` precisa ser enviada junto com os HTMLs (ou as imagens re-hospedadas na biblioteca de mídia do WordPress e os `src` ajustados) na hora da publicação — ver Fase 3.

Hoje os placeholders são **ilustrações SVG** (desenho vetorial simplificado) com uma legenda visível "FOTO · ... / substituir por foto real" e um comentário no código (`PHOTO REFERENCE`) descrevendo o que a foto deve mostrar. São **2 placeholders por página** (12 no total, mas alguns conceitos se repetem entre páginas).

### Mapa de placeholders

| Página(s) | Local | Conceito da foto (briefing já embutido no SVG) | Proporção do frame | Tamanho recomendado |
|---|---|---|---|---|
| LP1 (EN+NL) | Hero (lado direito) | Retrato de Mari Gomes no estúdio, iluminação suave e quente, olhando levemente para a câmera | 3:4 (vertical) | **840×1120 px** (ou maior, mesma proporção) |
| LP1 (EN+NL) | Seção "About" | Interior do estúdio: maca de massagem, toalhas, óleos, planta — ambiente intimista | 3:4 (vertical) | **960×1280 px** |
| LP2 (EN+NL) | Hero (lado direito, topo) | Pessoa deitada de bruços na maca, olhos fechados, relaxada, óleo na pele visível | ~7:8 (vertical) | **840×960 px** |
| LP2 (EN+NL) | Seção "About" | Interior do estúdio (mesmo conceito do LP1 — pode reaproveitar a mesma foto) | 3:4 (vertical) | **960×1280 px** |
| LP3 (EN+NL) | Hero (lado esquerdo, fundo) | Casal junto no estúdio, sentados/em pé próximos, clima quente e íntimo (não sexual) | ~6:7 (vertical) | **960×1120 px** |
| LP3 (EN+NL) | Seção "Experience" | Vista aérea/lateral de duas macas lado a lado, ambos recebendo massagem simultaneamente | **1:1 (quadrado)** — o frame força quadrado via CSS | **1000×1000 px** |

**Observação sobre reaproveitamento:** o placeholder "interior do estúdio" é idêntico no LP1 e no LP2 — você pode enviar **uma única foto** para os dois lugares, ou duas fotos diferentes do mesmo estúdio para variar. Como cada página tem o SVG embutido separadamente, a mesma imagem precisa ser referenciada/inserida nos dois arquivos (isso é trabalho meu, não seu).

Resumindo: **5 conceitos de foto únicos** cobrem os 6 placeholders (retrato da Mari, interior do estúdio, sessão de massagem individual, casal junto, duas macas/sessão a dois).

### Como vamos proceder

1. Você gera as imagens com IA (respeitando os tamanhos/proporções acima — pode gerar um pouco maior, nunca menor).
2. Você me envia os arquivos (formato `.jpg`, `.png` ou `.webp`).
3. Eu substituo o SVG de cada placeholder por uma tag `<img>` real (com `object-fit: cover`, `alt` descritivo, e `loading="lazy"` fora do hero), aplicando a mesma imagem nos pares EN/NL e nos locais reaproveitados.
4. Como estas páginas serão coladas/publicadas no WordPress, vou também sugerir comprimir as imagens (peso de arquivo) antes da entrega final, para não pesar o carregamento.

---

## Fase 3 — Garantir que está tudo OK e publicar no WordPress da Mary

**Objetivo:** revisão final, identificar gaps, e — se estiver tudo certo — te passar o passo a passo para publicar no WordPress.

### Checklist de revisão (a ser percorrido ao final das Fases 1 e 2)

- [ ] Todos os 19 links das 6 páginas (8+8+11 — ver Fase 1) apontam para os destinos finais corretos, sem nenhum link de placeholder esquecido
- [ ] Todos os 6 placeholders de foto foram substituídos por imagens reais, em todas as 6 páginas
- [ ] Conferir o texto pré-preenchido de cada link de WhatsApp (idioma certo, sem erro de digitação, encoding válido)
- [ ] Testar visualmente cada página no desktop e no mobile (breakpoint em 768px)
- [ ] Testar o accordion do FAQ em todas as páginas
- [ ] Revisar `<title>` e meta description de cada página (SEO básico) — hoje só LP1/LP2/LP3 têm `<title>`, não há meta description nem Open Graph (imagem/título para compartilhamento no WhatsApp/redes)
- [ ] Decidir se cada LP terá uma URL própria no site da Mary (ex. `/holistic-energy`, `/relaxation`, `/couples`, cada uma em `/en/` e `/nl/`) — isso direciona como a Fase 3 de publicação será feita
- [ ] Confirmar favicon (não há nenhum definido atualmente)
- [ ] Confirmar se será adicionado algum pixel/script de analytics (Meta Pixel, Google Analytics) antes de publicar

**Gaps já identificados nesta leitura inicial** (para sua decisão, não é bloqueio):
- Não há meta description / Open Graph tags — afeta como o link aparece quando compartilhado.
- Não há favicon.
- A classe `.btn-outline` existe no CSS da LP1 mas não é usada em nenhum botão — não é um problema, só uma sobra de código.

### Publicação no WordPress (instruções a confirmar nesta fase)

Como cada arquivo é HTML+CSS+JS autocontido em um único arquivo, a forma de publicar depende do que o WordPress da Mary usa para montar páginas. As opções mais comuns:
- **Bloco de Código/HTML personalizado** (editor de blocos nativo do WordPress, bloco "HTML personalizado") — cola o conteúdo do `<body>` e o `<style>`/`<script>` em um bloco de HTML.
- **Page builder** (Elementor, Divi, WPBakery) — usar o widget/módulo de "HTML bruto" para colar a página inteira.
- **Página com template em branco** (se o tema permitir um template "Canvas"/"Blank") — mais fiel ao visual original, sem interferência do tema.

Vou fechar a recomendação exata quando chegarmos na Fase 3, depois de saber qual construtor de página/tema a Mary usa no WordPress dela.
