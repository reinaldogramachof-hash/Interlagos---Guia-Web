# Roteamento de Agentes — ML Factory

> Documento de referência para Claude (Arquiteto) ao designar tarefas ao time Antigravity.
> Última atualização: 2026-03-18

---

## Hierarquia de Agentes

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 4 — RESERVA / LAST RESORT                             │
│  Claude (Sonnet 4.6) — Arquiteto + Executor de emergência   │
├─────────────────────────────────────────────────────────────┤
│  TIER 3 — ALTA COMPLEXIDADE                                 │
│  Claude Opus 4.6 Thinking  |  Gemini Pro High               │
├─────────────────────────────────────────────────────────────┤
│  TIER 2 — COMPLEXIDADE PADRÃO                               │
│  Claude Sonnet 4.6 Thinking  |  Gemini Pro Low              │
├─────────────────────────────────────────────────────────────┤
│  TIER 1 — SIMPLES / REPETITIVO                              │
│  Gemini Flash  |  GPT-OSS 120B Medium                       │
│  ATLAS (OpenClaw + Haiku 4.5) — Executor 24/7 via VPS      │
└─────────────────────────────────────────────────────────────┘
```

---

## Perfil de Cada Agente

### 🦞 ATLAS — OpenClaw (Tier 1)
**Identidade:** Agente autônomo 24/7 rodando em VPS Hostgator (IP: 129.121.47.217) via Docker.
**Modelo:** `claude-haiku-4-5` (200k ctx)
**Canal de acesso:** Telegram (acionado pelo Reinaldo quando externo ao ambiente principal)
**Workspace no VPS:** `/home/node/clawd/` dentro do container `moltbot-clawdbot-1`
**Melhor para:** Automações 24/7, boilerplate a partir de templates existentes, status checks, notificações de build, execução de scripts repetitivos, geração de relatórios simples.
**Pontos fortes:** Sempre disponível, memória persistente entre sessões (arquivos de memória no workspace), já conhece a estrutura do projeto (análise feita em 05/03/2026).
**Evitar:** Decisões arquiteturais, debugging de erros desconhecidos, criação de features novas, qualquer task que exija raciocínio sobre trade-offs.
**Como acionar:** Via Telegram → ATLAS executa no workspace → reporta resultado. Para tasks técnicas, Claude define o briefing antes.
**Skills prontas:** healthcheck, weather, skill-creator, openai-image-gen
**Skills a instalar:** coding-agent, github

### 🟦 Gemini Pro High (Tier 3)
**Melhor para:** Contexto longo, leitura de múltiplos arquivos grandes, auditorias completas de sistema, análise de HTML com 3000+ linhas.
**Pontos fortes:** Janela de contexto gigante, bom em entender estrutura de projetos inteiros de uma só vez.
**Evitar:** Raciocínio lógico profundo sobre problemas novos, arquitetura crítica.
**Custo:** Alto — usar com propósito claro.

### 🟦 Gemini Pro Low (Tier 2)
**Melhor para:** Implementação de módulos bem definidos, edições em arquivos de tamanho médio, refatoração com padrão claro, extração de código quando o destino é óbvio.
**Pontos fortes:** Equilíbrio entre capacidade e velocidade. Segue padrões existentes com fidelidade.
**Evitar:** Tarefas que exigem raciocínio sobre trade-offs ou invenção de lógica nova.

### 🟡 Gemini Flash (Tier 1)
**Melhor para:** Tarefas repetitivas e bem delimitadas — substituição de cores, atualização de textos, copiar/colar estruturas de HTML, gerar boilerplate baseado em template.
**Pontos fortes:** Rapidez, custo baixo, ideal para tarefas em lote.
**Evitar:** Qualquer coisa que exija raciocínio, debugging ou invenção de lógica.

### 🟣 Claude Sonnet 4.6 Thinking (Tier 2)
**Melhor para:** Debugging de erros desconhecidos, implementação de lógica de negócio complexa (carrinho, relatórios, cálculos), quando o problema exige entender o contexto do projeto antes de agir.
**Pontos fortes:** Raciocínio estruturado, entende padrões do projeto, poucos erros de lógica.
**Evitar:** Tarefas de leitura/auditoria de contexto longo — consome muito token de thinking.

### 🟣 Claude Opus 4.6 Thinking (Tier 3)
**Melhor para:** Segurança (revisão de lock.js, fluxos de licença), lógica de negócio crítica que não pode ter erro, decisões de arquitetura de módulo que impactam todos os outros módulos, tarefas onde a precisão vale mais que a velocidade.
**Pontos fortes:** Maior capacidade de raciocínio do time. Detecta edge cases que os outros perdem.
**Evitar:** Tarefas simples — custo alto, não justifica.

### ⚪ GPT-OSS 120B Medium (Tier 1)
**Melhor para:** Geração de código baseada em padrão já estabelecido (ex: criar módulo N seguindo template do módulo N-1), templates HTML, CSS utilitário.
**Pontos fortes:** Rápido, bom seguidor de padrão, sem dependência de API proprietária.
**Evitar:** Raciocínio original, debugging, qualquer tarefa sem exemplo claro a seguir.

---

## Matriz de Roteamento por Tipo de Tarefa

| Tipo de Tarefa | Agente Primário | Agente Backup |
|---|---|---|
| Auditoria de sistema (leitura multi-arquivo) | Gemini Pro High | Claude Sonnet Thinking |
| Extração de módulo JS de HTML monolítico | Gemini Pro Low | GPT-OSS 120B |
| Criação de módulo novo do zero | Claude Sonnet Thinking | Gemini Pro Low |
| Atualização de CSS / cores / estilos | Gemini Flash | GPT-OSS 120B |
| Boilerplate / replicação de padrão | GPT-OSS 120B | ATLAS |
| Debugging de erro desconhecido | Claude Sonnet Thinking | Claude Opus Thinking |
| Lógica de negócio crítica (caixa, licença) | Claude Opus Thinking | Claude Sonnet Thinking |
| Revisão de segurança (lock.js, API) | Claude Opus Thinking | — |
| Refatoração HTML (estrutura bem definida) | Gemini Pro Low | Gemini Flash |
| Documentação / comentários / README | Gemini Flash | ATLAS |
| Decisão de arquitetura | Claude (arquiteto) | Claude Opus Thinking |
| Execução de código em falha de agente | Claude (last resort) | — |
| Automações 24/7 / scripts agendados | ATLAS | — |
| Status check / monitoramento de VPS | ATLAS | — |
| Geração de bairro novo (generateBairro.mjs) | ATLAS | — |

---

## Cadeia de Escalação (Fallback)

```
Falhou ou resultado ruim?
│
▼
ATLAS / Flash / OSS 120B  →  Pro Low / Sonnet Thinking  →  Pro High / Opus Thinking  →  Claude (eu)
```

**Regra:** Antes de escalar, o Claude deve validar se o briefing foi claro o suficiente. Um agente inferior com briefing preciso bate um agente superior com briefing vago.

---

## Como Claude Designa Tarefas

A cada ação do fluxo de trabalho, Claude vai indicar:

```
📋 TAREFA: [descrição]
🤖 AGENTE: [nome do agente]
💡 MOTIVO: [1 linha explicando a escolha]
```

Se o agente falhar ou o resultado for impreciso:

```
⚠️ ESCALAÇÃO: [nome do agente] → [próximo agente]
💡 MOTIVO: [o que falhou]
```

---

## Regras Gerais

1. **Claude nunca executa código diretamente** salvo em falha confirmada de agente ou tarefa arquitetural exclusiva.
2. **Briefings sempre incluem:** contexto do projeto, arquivos a ler, output esperado, padrão a seguir (com exemplo quando possível).
3. **Tier 3 (Opus / Pro High) é reservado** para tarefas que justificam o custo — não usar por comodidade.
4. **Validação final sempre com Claude** — independente de qual agente executou.
