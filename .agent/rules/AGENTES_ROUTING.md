# Roteamento de Agentes — Tem No Bairro

> Documento de referência para Claude (Arquiteto) ao designar tarefas ao time Antigravity.
> Última atualização: 2026-04-11

---

## Composição Atual do Time

**Arquiteto:** Claude Sonnet 4.6 (este agente) — planejamento, briefing, validação final e execução de emergência.
**Executores Técnicos:** Agentes do Google Antigravity (Fast Mode, Deep Think, Subagente de Navegador).

> ATLAS (OpenClaw) foi removido do projeto. Automações 24/7 e scripts agendados que antes eram delegados ao ATLAS devem ser reavaliados caso a caso: tarefas simples vão para Antigravity Fast Mode; tarefas recorrentes devem ser implementadas como Skills ou Workflows dentro do próprio Antigravity.

---

## Hierarquia de Agentes

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 3 — RESERVA / LAST RESORT                             │
│  Claude Sonnet 4.6 — Arquiteto + Executor de emergência     │
├─────────────────────────────────────────────────────────────┤
│  TIER 2 — ALTA COMPLEXIDADE / PLANEJAMENTO                  │
│  Antigravity Deep Think (Gemini 3 Deep Think / Opus)        │
├─────────────────────────────────────────────────────────────┤
│  TIER 1B — VALIDAÇÃO VISUAL / UI/E2E                        │
│  Antigravity Subagente de Navegador                         │
├─────────────────────────────────────────────────────────────┤
│  TIER 1A — SIMPLES / REPETITIVO / CIRÚRGICO                 │
│  Antigravity Fast Mode (Gemini 3 Flash / Pro)               │
└─────────────────────────────────────────────────────────────┘
```

---

## Perfil de Cada Agente

### 🟢 Antigravity Fast Mode — Gemini 3 Flash / Pro (Tier 1A)
**Interface:** Editor View (inline via Cmd+I) ou Terminal.
**Motor:** Gemini 3 Flash ou Gemini 3 Pro — baixa latência, sem geração de artefatos pesados.
**Melhor para:** Ajustes cirúrgicos em arquivo único, renomeação de variáveis, criação de funções utilitárias, regex simples, comandos de terminal de rotina, boilerplate baseado em template já existente, atualização de CSS/cores/textos, refatoração localizada.
**Pontos fortes:** Rapidez, custo baixo, execução direta ("Vibe Coding"). Ideal para tarefas que não tocam em mais de um arquivo.
**Evitar:** Tarefas que cruzam múltiplos arquivos, lógica de negócio nova, debugging de erros desconhecidos, decisões arquiteturais.
**Como acionar:** Abrir arquivo alvo → Cmd+I → prompt ancorando com `@Arquivo` para evitar alucinações de variáveis.
**Diretriz de briefing:** Seja cirúrgico — especifique o arquivo, a função e o que exatamente mudar. Sem isso, o agente pode generalizar demais.

---

### 🔵 Antigravity Deep Think — Gemini 3 Deep Think / Claude Opus (Tier 2)
**Interface:** Manager View (Mission Control) — orquestração assíncrona, pode durar horas.
**Motor:** Gemini 3 Deep Think com suporte a Claude Opus. Janela de contexto de até 2 milhões de tokens.
**Melhor para:** Engenharia de sistemas complexos do zero, refatoração estrutural multi-arquivo, debugging de erros intermitentes, implementação de lógica de negócio crítica, migração de stack (ex: JS → TypeScript), investigações de segurança (fluxos de auth, validação de API), criação de módulos que impactam outros módulos.
**Pontos fortes:** Gera automaticamente Lista de Tarefas + Plano de Implementação antes de alterar qualquer linha de código. O Plano funciona como "portão de revisão" — Claude valida antes de autorizar execução.
**Evitar:** Tarefas simples — custo de tokens alto, não justifica.
**Como acionar:** Manager View → prompt estruturado no formato Missão (ver seção abaixo) → validar o Plano gerado → autorizar execução.
**Diretriz de briefing:** Sempre use o formato Missão completo: Contexto + Diretiva + Restrições + Verificação. Se o plano parecer errado, corrija antes de executar — briefing ruim gera código ruim.

---

### 🌐 Antigravity Subagente de Navegador (Tier 1B)
**Interface:** Acionado explicitamente dentro de uma Missão (Deep Think ou Fast Mode).
**Capacidade:** Executa a aplicação localmente, navega por rotas, interage com UI, tira screenshots e anexa como evidência no Walkthrough.
**Melhor para:** Validação de layouts responsivos (mobile-first 375px), testes de fluxos visuais (onboarding, modais, PWA offline), auditoria de Dark Mode / transições CSS, validação de componentes após refatoração.
**Evitar:** Usar como substituto de testes lógicos — ele valida aparência e fluxo, não lógica de dados.
**Como acionar:** Incluir explicitamente no prompt da Missão: *"Inicie o subagente de navegador e valide visualmente [o que testar]. Anexe screenshot ao Walkthrough."* — sem essa instrução, o agente assume que o CSS está correto sem verificar.

---

### ⚪ Claude Sonnet 4.6 — Arquiteto (Tier 3 / Last Resort)
**Papel primário:** Definir briefings, designar tarefas ao time Antigravity, validar artefatos (Planos, Walkthroughs), tomar decisões de arquitetura, gerenciar o `CLAUDE.md` e este documento.
**Execução direta apenas quando:** Falha confirmada de agente Antigravity, task arquitetural exclusiva (ex: reestruturação de pastas, decisão de stack), ou tarefa que requer contexto acumulado de múltiplas sessões.
**Nunca executa:** Por comodidade ou impaciência — o custo de contexto do Arquiteto é alto e deve ser reservado para decisões que os executores não conseguem resolver.

---

## Formato de Missão (Briefing para Deep Think)

Toda Missão delegada ao Deep Think deve seguir a estrutura:

```
Missão: [nome descritivo]

Contexto:
[Arquivo(s) relevante(s) com @referência, estado atual, o que está causando o problema]

Diretiva:
[O que exatamente precisa ser feito, em passos numerados quando possível]

Restrições:
[O que NÃO pode ser tocado. Padrões obrigatórios do projeto (ver @CLAUDE.md)]

Verificação:
[Como confirmar que a entrega está correta — testes, screenshot via subagente, log antes/depois]
```

---

## Matriz de Roteamento por Tipo de Tarefa

| Tipo de Tarefa | Agente Primário | Agente Backup |
|---|---|---|
| Ajuste cirúrgico em arquivo único | Fast Mode | — |
| Atualização de CSS / cores / textos | Fast Mode | — |
| Boilerplate / replicação de padrão existente | Fast Mode | — |
| Comandos de terminal / scripts pontuais | Fast Mode | — |
| Criação de módulo novo do zero | Deep Think | — |
| Refatoração multi-arquivo | Deep Think | — |
| Debugging de erro desconhecido | Deep Think | — |
| Lógica de negócio crítica (auth, licença, caixa) | Deep Think | — |
| Revisão de segurança (fluxos de API, RLS) | Deep Think | — |
| Auditoria de sistema (leitura multi-arquivo) | Deep Think | — |
| Migração de stack / extração de módulo legado | Deep Think | — |
| Validação visual de UI / layout responsivo | Subagente de Navegador | — |
| Testes de fluxo PWA / onboarding / modal | Subagente de Navegador | — |
| Documentação / comentários / README | Fast Mode | Deep Think |
| Decisão de arquitetura | Claude (arquiteto) | — |
| Execução de código em falha de agente | Claude (last resort) | — |

---

## Cadeia de Escalação (Fallback)

```
Falhou ou resultado ruim?
│
▼
Fast Mode  →  Deep Think  →  Claude (arquiteto / last resort)
```

**Regra:** Antes de escalar, Claude valida se o briefing foi claro o suficiente.
Um agente inferior com briefing preciso bate um agente superior com briefing vago.

---

## Como Claude Designa Tarefas

A cada ação do fluxo de trabalho, Claude vai indicar:

```
📋 TAREFA: [descrição]
🤖 AGENTE: [Fast Mode | Deep Think | Subagente de Navegador]
💡 MOTIVO: [1 linha explicando a escolha]
```

Se o agente falhar ou o resultado for impreciso:

```
⚠️ ESCALAÇÃO: [agente atual] → [próximo agente]
💡 MOTIVO: [o que falhou]
```

---

## Regras Gerais

1. **Claude nunca executa código diretamente** salvo em falha confirmada de agente ou tarefa arquitetural exclusiva.
2. **Briefings sempre incluem:** contexto do projeto com `@referências`, arquivos a ler, output esperado, padrão a seguir (com exemplo quando possível).
3. **Deep Think é reservado** para tarefas que cruzam múltiplos arquivos ou exigem raciocínio sobre trade-offs — não usar para ajustes simples.
4. **Subagente de Navegador deve ser explicitamente invocado** no prompt — nunca é ativado automaticamente.
5. **Validação final sempre com Claude** — independente de qual agente executou.
6. **Regras do workspace (.agent/rules/) são a "Constituição"** — nenhum agente pode ignorá-las. Se um agente produzir código que viola o CLAUDE.md, o briefing foi insuficiente.
