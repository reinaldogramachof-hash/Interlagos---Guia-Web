# Roteamento de Agentes — Tem No Bairro

> Documento de referência para o Codex ao designar tarefas para o Claude Code e coordenar o ciclo com o QA.
> Última atualização: 2026-05-09

---

## Composição Atual do Time

**Arquiteto e Orquestrador:** Codex — planejamento, auditoria, priorização, prompts técnicos e governança.  
**Executor Técnico:** Claude Code — implementação de código e validações locais.  
**QA Funcional:** Reinaldo — testes reais no `localhost` e aceite.

---

## Hierarquia Operacional

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 1 — ORQUESTRAÇÃO                                    │
│  Codex — arquitetura, fases, prompts, critérios de aceite   │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 2 — IMPLEMENTAÇÃO                                   │
│  Claude Code — código, refactor, migration, validação local │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 3 — VALIDAÇÃO FUNCIONAL                             │
│  Reinaldo — QA manual via localhost                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Perfil de Cada Agente

### Codex — Arquiteto e Orquestrador
**Melhor para:** auditoria, decomposição de escopo, desenho de fases, priorização por risco/impacto, definição de prompts de execução, análise de trade-offs e atualização da documentação operacional.

**Nunca deve fazer como padrão:** implementar código diretamente quando a tarefa puder ser delegada ao Claude Code.

### Claude Code — Executor Técnico
**Melhor para:** alterações multi-arquivo, refactors, ajustes de services, componentes, migrations, regras de negócio e validações locais.

**Protocolo:** executar exatamente o prompt aprovado; reportar apenas impedimentos reais ou itens não aplicados.

### Reinaldo — QA Funcional
**Melhor para:** validar comportamento real, regressões de fluxo, experiência em dispositivos e aprovação final da entrega.

---

## Formato de Prompt Operacional para Claude Code

Toda tarefa delegada ao Claude Code deve seguir a estrutura:

```md
Missão: [nome curto e específico]

Objetivo:
[resultado esperado em termos funcionais]

Contexto:
- [módulo/arquivos envolvidos]
- [problema atual]
- [restrições já conhecidas]

Diretiva de execução:
1. [passo técnico 1]
2. [passo técnico 2]
3. [passo técnico 3]

Restrições:
- Não alterar [área fora de escopo]
- Respeitar `CLAUDE.md` e `.agent/rules/`
- Manter filtro `neighborhood`

Validação local:
- Rodar [build/lint/teste aplicável]
- Informar somente bloqueios reais ou itens não aplicados

Regra de retorno:
- Se tudo for aplicado, não gerar relatório longo
- Só retornar se houver erro, impedimento ou ambiguidade material
```

---

## Matriz de Roteamento por Tipo de Tarefa

| Tipo de Tarefa | Responsável Primário |
|---|---|
| Auditoria técnica e diagnóstico | Codex |
| Priorização por fase | Codex |
| Escrita de prompt técnico | Codex |
| Implementação de código | Claude Code |
| Migrações e ajustes de schema no repositório | Claude Code |
| Build/lint/testes locais da tarefa | Claude Code |
| Validação de UX e fluxo real | Reinaldo |
| Aceite ou rejeição funcional | Reinaldo |

---

## Cadeia de Escalação

```
Bloqueio encontrado pelo Claude Code
│
▼
Claude Code reporta apenas o impedimento
│
▼
Codex reinterpreta, ajusta o plano e emite novo prompt
│
▼
Reinaldo valida novamente após a nova aplicação
```

---

## Regras Gerais

1. Codex é o ponto central de decisão técnica.
2. Claude Code não deve abrir frentes paralelas fora do prompt vigente.
3. Se a tarefa exigir mudança de escopo, Claude Code deve parar e reportar.
4. QA manual no `localhost` é obrigatório para fechamento de cada etapa relevante.
5. As regras de `CLAUDE.md` e `.agent/rules/` são mandatórias para todos os ciclos.
