# docs/implementations — Guia

## O que é esta pasta

Documentos de trabalho para mudanças não-triviais nas 6 landing pages, a
partir de agora. Cada arquivo acompanha a mudança do diagnóstico aos checks
validados. São temporários: quando validados, o conteúdo relevante migra
para `CLAUDE.md` ou `docs/architecture/`, e o arquivo é deletado.

> `IMPLEMENTACAO.md`/`ENTREGA.md` na raiz cobrem o histórico das 3 fases
> originais do projeto (botões → imagens → QA/publicação) e continuam como
> registro histórico — não seguem este novo processo retroativamente.

---

## Arquivos

### Arquivos com `_` — guias e processos (permanentes)

| Arquivo | Para que serve |
|---|---|
| `_guia-documentar-implementacao.md` | Processo completo: Plan Mode, estrutura, ciclo de vida |
| `_template-implementacao.md` | Exemplo concreto preenchido (baseado na seção de localização já feita) |
| `_processo-graduacao-implementacao.md` | Como migrar pra `CLAUDE.md`/`docs/architecture/` e deletar |

### Arquivos regulares — implementações ativas

| Arquivo | Status |
|---|---|
| `correcao-tag-conversao-google-ads.md` | Fase 1 feita, Fase 2 pendente |
| `alinhamento-precos-site-institucional.md` | Planejado — diagnóstico pronto, falta Plan Mode |
| `horario-workshop.md` | Planejado — bloqueado pela pendência #13 |

---

## Prompts úteis

### Quero começar uma mudança nova

```
Segue o processo em docs/implementations/_guia-documentar-implementacao.md.
Quero [descrever a mudança].
```

### Quero graduar um arquivo completo

```
O arquivo docs/implementations/<nome>.md está com todos os checks validados.
Segue docs/implementations/_processo-graduacao-implementacao.md.
```
