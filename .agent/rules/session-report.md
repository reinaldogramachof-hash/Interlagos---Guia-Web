# Regra: Relatório Técnico de Sessão

**Escopo:** Global — aplica-se ao final de TODA sessão de trabalho, independente do agente executor.
**Gatilho:** Ao concluir qualquer tarefa que envolva alteração de arquivos, commits ou decisões técnicas.

---

## Obrigatoriedade

Todo agente (Claude, Deep Think, Fast Mode) **DEVE** gerar um relatório técnico ao final de cada sessão de trabalho. Não há exceção. Sessões sem relatório são consideradas incompletas.

O relatório serve como:
- Registro auditável do que foi feito (para Claude revisar ao retornar).
- Base de contexto para o início da próxima sessão.
- Histórico de decisões técnicas tomadas.
- Rastreabilidade de commits e arquivos alterados.

---

## Localização e Nomenclatura

**Pasta:** `.agent/reports/`

**Formato do nome do arquivo:**
```
YYYY-MM-DD_HH-MM_[descricao-curta].md
```

**Exemplos:**
```
2026-04-11_14-30_implementacao-settings-tab.md
2026-04-11_09-15_smoke-test-pos-refatoracao.md
2026-04-11_16-45_crud-modulo-reviews.md
```

---

## Template Obrigatório

```markdown
# Relatório de Sessão — [Descrição da Tarefa]

**Data/Hora:** YYYY-MM-DD HH:MM
**Agente Executor:** [Claude | Deep Think | Fast Mode | Subagente de Navegador]
**Arquiteto na Sessão:** [Claude presente | Deep Think (substituto)]
**Status da Sessão:** [Concluída | Parcial | Bloqueada]

---

## Objetivo da Sessão

[Uma ou duas frases descrevendo o que se pretendia fazer.]

---

## O que foi executado

[Lista numerada de ações realizadas, em ordem cronológica.]

1. ...
2. ...
3. ...

---

## Arquivos Criados ou Modificados

| Arquivo | Ação | Descrição da mudança |
|---|---|---|
| `app/src/features/.../Arquivo.jsx` | Modificado | [o que mudou] |
| `app/src/services/novoService.js` | Criado | [para que serve] |
| `docs/migrations/add-tabela.sql` | Criado | [migration para aprovação] |

---

## Commits Realizados

| Hash | Mensagem | Branch |
|---|---|---|
| `abc1234` | `feat: descrição do commit` | `main` |

(Se nenhum commit foi feito, registrar o motivo.)

---

## Decisões Técnicas Tomadas

[Lista de decisões não triviais que foram feitas durante a sessão e o raciocínio por trás delas.]

- **Decisão:** [o que foi decidido]
  **Motivo:** [por que foi a melhor opção]

---

## Problemas Encontrados

[Erros, bloqueios ou comportamentos inesperados encontrados durante a sessão.]

- **Problema:** [descrição]
  **Resolução:** [como foi resolvido ou por que ficou em aberto]

---

## Pendências para a Próxima Sessão

[O que ficou incompleto, precisa de revisão do Claude ou aguarda ação do usuário.]

- [ ] [pendência 1]
- [ ] [pendência 2]

---

## Resultado do Build

```bash
# Resultado de npm run build:interlagos
[✅ Sucesso / ❌ Erros — cole a saída relevante]
```

---

## Notas Adicionais

[Qualquer observação que o próximo agente ou o Claude deva saber.]
```

---

## Quando o Relatório é Gerado

- **Sempre ao finalizar uma tarefa concluída.** Mesmo que pareça pequena.
- **Sempre ao final de uma sessão parcial** (tarefa interrompida por limite de tokens, bloqueio ou pausa).
- **Sempre pelo Arquiteto Substituto (Deep Think)** ao final de qualquer operação autônoma.

## Quando o Relatório NÃO é obrigatório

- Sessões puramente consultivas (perguntas, leitura de docs, planejamento sem execução de código).
- Sessões de menos de 5 minutos que não geraram nenhuma alteração de arquivo.

---

## Instrução para o Próximo Início de Sessão

Ao iniciar uma nova sessão, o primeiro passo é ler o relatório mais recente em `.agent/reports/` para retomar contexto sem depender de memória de sessão anterior.

Comando de referência para localizar o último relatório:
```
Leia o arquivo mais recente em @.agent/reports/
```
