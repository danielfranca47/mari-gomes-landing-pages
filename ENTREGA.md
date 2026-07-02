# Entrega — Landing Pages Mari Gomes

**Data de entrega:** 01/07/2026  
**Projeto:** 3 landing pages de vendas × 2 idiomas (EN/NL) = 6 páginas publicadas no WordPress de `amarigomes.com`

---

## Páginas publicadas

| Página | URL | Idioma |
|---|---|---|
| Holistic Energy Massage | https://amarigomes.com/holistic-energy-massage-en/ | Inglês |
| Holistic Energy Massage | https://amarigomes.com/holistic-energy-massage-nl/ | Holandês |
| Relaxation & Stress Relief | https://amarigomes.com/relaxation-massage-en/ | Inglês |
| Relaxation & Stress Relief | https://amarigomes.com/relaxation-massage-nl/ | Holandês |
| Couples Massage | https://amarigomes.com/couples-massage-en/ | Inglês |
| Couples Massage | https://amarigomes.com/couples-massage-nl/ | Holandês |

---

## O que foi entregue

### Design e conteúdo
- 3 landing pages com identidades visuais distintas (paletas, tipografias e tom diferentes para cada produto)
- Texto de vendas em inglês e holandês, escrito especificamente para cada LP
- Imagens reais em todas as páginas (5 imagens, cobrindo os 6 placeholders originais), convertidas para WebP para carregamento rápido

### Funcionalidades
- **Botões de WhatsApp** com texto pré-preenchido em inglês e holandês, direcionados para `+31 634 366 008`
- **FAQ accordion** (abre/fecha ao clicar) em todas as 6 páginas
- **Menu de navegação** com âncoras para as seções da página (About, Therapies/Sessions, Reviews, FAQ, Location)
- **Seletor de idiomas** (bandeiras NL/EN/FR/PT/ES via GTranslate) em todas as páginas
- **Mapa do Google** incorporado na seção de localização, apontando para o perfil público "Massagem Amsterdam - Mari Gomes" (Brouwersgracht 270A, Amsterdam)
- **Design responsivo** — funciona em desktop e mobile (breakpoint em 768px)

### Contatos configurados nas 6 páginas
| Canal | Valor |
|---|---|
| WhatsApp | +31 634 366 008 |
| E-mail | marycontato@gmail.com |
| Instagram | @massage.tantric.therapy |
| Site / logo | amarigomes.com |

---

## Como editar as páginas no futuro

As páginas são editadas **exclusivamente via Elementor** (não pelo editor de blocos padrão do WordPress):

1. Acesse `wp-admin → Páginas`
2. Clique em **"Editar com Elementor"** na página desejada (não em "Editar")
3. Clique no widget de texto no canvas
4. Clique em **"Código"** para alternar para o modo HTML bruto
5. Faça a alteração desejada
6. Clique em **Publicar/Atualizar** dentro do Elementor
7. Limpe o cache da página se necessário

> **Importante:** editar pelo editor de blocos padrão do WordPress (o botão "Editar") não atualiza o conteúdo visível — o Elementor guarda o conteúdo de forma separada.

---

## Itens para Mary decidir / ações pós-entrega

### 1. Imagens — backup recomendado
As imagens estão publicadas na Biblioteca de Mídia do WordPress (`Mídia → Biblioteca`). Recomendo fazer um backup via **Backuply** (plugin já instalado, mas sem backups configurados) antes de qualquer alteração futura no site.

### 2. Meta description (descrição para o Google)
A descrição que aparece nos resultados do Google e no preview ao compartilhar um link no WhatsApp/redes está sendo gerada automaticamente pelo plugin SiteSEO. Para personalizar essa descrição com um texto mais focado em conversão, é necessário o **SiteSEO Pro** (versão paga do plugin).

Impacto atual: baixo — a página já tem uma descrição, só não é um texto escolhido a dedo. As páginas funcionam normalmente e aparecem no Google sem nenhuma ação.

### 3. Página de teste antiga removida
A página `amarigomes.com/teste-html/` (protótipo inicial) foi **movida para rascunho** e não está mais acessível ao público. Ela continua salva no WordPress caso queira recuperá-la no futuro (`wp-admin → Páginas → Rascunhos`).

---

## Checklist de qualidade (revisado em 30/06/2026)

| Item | Status |
|---|---|
| Todos os links (WhatsApp, e-mail, Instagram, logo) corretos nas 6 páginas | ✅ |
| Imagens reais em todos os 12 slots (2 por página × 6) | ✅ |
| Texto pré-preenchido dos links de WhatsApp — idioma e encoding corretos | ✅ |
| URLs definitivas publicadas conforme plano de campanha | ✅ |
| Favicon do site presente | ✅ |
| Tag de analytics (Google Ads `AW-18036442650`) ativa nas páginas | ✅ |
| Tracking de conversão no clique do WhatsApp (para os anúncios) | ✅ |
| Teste visual em desktop e mobile | ✅ |
| FAQ accordion funcionando em todas as páginas | ✅ |
| Meta description personalizada por página | ⏸️ Requer SiteSEO Pro |

---

*Arquivos-fonte (HTML + imagens) disponíveis no repositório GitHub: `danielfranca47/mari-gomes-landing-pages`*
