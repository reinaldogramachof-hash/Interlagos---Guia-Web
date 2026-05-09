# Plano do Painel Administrativo — 3 Fases

## Objetivo

Transformar o painel administrativo no centro confiável de operação do sistema, com foco em:

1. segurança das ações críticas;
2. governança e rastreabilidade;
3. experiência operacional e robustez no uso diário.

---

## Modelo Operacional

| Papel | Responsável | Função |
|---|---|---|
| Arquiteto e Orquestrador | Codex | define fases, prioriza, escreve prompts e reorquestra bloqueios |
| Executor Técnico | Claude Code | implementa o código e reporta apenas impedimentos reais |
| QA Funcional | Reinaldo | valida o fluxo real no `localhost` e aprova continuidade |

### Regra de retorno do Claude Code

- Se a tarefa for aplicada com sucesso, considerar concluída sem relatório narrativo.
- Só retornar quando houver:
  - erro de execução;
  - ambiguidade material;
  - restrição arquitetural impeditiva;
  - item que não pôde ser aplicado.

---

## Fase 1 — Segurança

### Objetivo

Remover fragilidades que hoje colocam ações administrativas críticas no cliente ou em fluxos inseguros.

### Escopo

1. retirar validações críticas baseadas em `VITE_*` do frontend, especialmente `VITE_MASTER_PIN`;
2. mover ações críticas para backend seguro, preferencialmente Edge Functions ou RPCs protegidas;
3. revisar e endurecer operações de:
   - backup;
   - reset;
   - troca de role;
   - escalonamento de item;
   - resolução de ticket;
4. revisar dependência atual de fallbacks silenciosos em services administrativos;
5. explicitar falhas de permissão, schema ou RLS em vez de mascará-las.

### Critérios de aceite

- nenhuma ação crítica depende de segredo exposto no bundle;
- o frontend deixa de ser o local de autorização final dessas ações;
- falhas sensíveis passam a ser explícitas e rastreáveis;
- o painel continua operacional após a migração de fluxo.

### Prompt base para Claude Code

```md
Missão: Fase 1 — Segurança do painel administrativo

Objetivo:
Eliminar fragilidades de segurança no módulo administrativo, priorizando ações críticas hoje controladas de forma insegura no frontend.

Contexto:
- O painel administrativo está em `app/src/features/admin/` e seus services em `app/src/services/`.
- Há uso de `VITE_MASTER_PIN` no frontend e ações críticas sensíveis em services client-side.
- O objetivo não é redesign visual; é fortalecer segurança e fluxo de autorização.

Diretiva de execução:
1. Mapear todas as ações administrativas críticas atualmente controladas no cliente.
2. Remover a dependência de segredo exposto no frontend para backup/reset.
3. Reestruturar os fluxos críticos para backend seguro, preferencialmente Edge Function, RPC ou caminho equivalente já aderente à stack.
4. Garantir que erros de autorização, schema ou permissão não sejam mascarados por fallbacks silenciosos.
5. Ajustar a interface apenas no necessário para refletir o novo fluxo.

Restrições:
- Não alterar stack do projeto.
- Não quebrar o isolamento por `neighborhood`.
- Não expandir o escopo para refactors paralelos fora da segurança.
- Respeitar `CLAUDE.md` e `.agent/rules/`.

Validação local:
- Rodar build e validações locais compatíveis com a mudança.
- Informar apenas o que não foi possível aplicar ou validar.

Regra de retorno:
- Se tudo for aplicado com sucesso, não enviar relatório longo.
- Só retornar em caso de bloqueio, ambiguidade material ou item não aplicado.
```

---

## Fase 2 — Governança

### Objetivo

Dar ao painel capacidade real de controle, trilha e integridade operacional.

### Escopo

1. criar trilha real de auditoria para ações administrativas;
2. preservar vínculo estrutural entre ticket/escalonamento e item de origem;
3. melhorar consistência transacional dos fluxos críticos;
4. revisar o painel de auditoria para refletir ações reais, não apenas `click_events`;
5. estruturar melhor governança de usuários, permissões e consentimentos.

### Critérios de aceite

- ações admin passam a deixar trilha confiável;
- tickets/escalations mantêm referência inequívoca ao alvo;
- o painel de auditoria serve para operação real e investigação;
- diretório de usuários fica mais confiável para gestão e compliance.

### Prompt base para Claude Code

```md
Missão: Fase 2 — Governança e rastreabilidade do painel administrativo

Objetivo:
Transformar o painel administrativo em uma central governável e auditável, com trilha consistente das ações críticas.

Contexto:
- O módulo administrativo já possui tabs de auditoria, tickets, usuários e aprovações.
- Hoje há lacunas de vínculo entre escalonamentos e origem, além de auditoria incompleta.

Diretiva de execução:
1. Reestruturar o fluxo de escalonamento/tickets para preservar referência do item original.
2. Implementar ou integrar trilha de auditoria real para ações administrativas relevantes.
3. Atualizar o painel de auditoria para ler a fonte correta de eventos administrativos.
4. Melhorar a governança do diretório de usuários, inclusive limitações atuais de busca, paginação e consentimentos.
5. Garantir que operações multi-etapa críticas tenham consistência suficiente para evitar estados órfãos.

Restrições:
- Não redesignar o painel além do necessário para refletir a nova governança.
- Não mexer em módulos públicos sem necessidade direta.
- Preservar compatibilidade com a stack e o filtro `neighborhood`.

Validação local:
- Rodar build e checagens locais pertinentes.
- Reportar apenas impedimentos reais ou itens não aplicados.

Regra de retorno:
- Sem relatório longo em caso de sucesso.
- Retornar apenas se houver bloqueio material.
```

---

## Fase 3 — Experiência Operacional

### Objetivo

Lapidar o painel para uso diário mais previsível, legível e confiável.

### Escopo

1. revisar UX operacional das tabs críticas;
2. remover estados enganosos como “tudo limpo” quando houve falha de carregamento parcial;
3. reduzir acoplamentos frágeis em polling, `useEffect` e recargas;
4. melhorar feedbacks, estados vazios, estados de erro e consistência entre tabs;
5. revisar moderação de avaliações, sugestões, notícias e aprovações com critérios claros.

### Critérios de aceite

- o operador entende o estado real do sistema;
- erros e cargas parciais ficam explícitos;
- a navegação entre tabs fica mais previsível;
- a saúde técnica do módulo melhora, inclusive com redução de warnings relevantes.

### Prompt base para Claude Code

```md
Missão: Fase 3 — Experiência operacional e confiabilidade do painel administrativo

Objetivo:
Refinar o painel administrativo para uso diário, reduzindo estados ambíguos, fragilidade técnica e ruído operacional.

Contexto:
- O painel já cobre boa parte das funções de operação, mas ainda se comporta como um conjunto de CRUDs com sinais incompletos de status.
- Há warnings e padrões frágeis em tabs admin, especialmente em polling, efeitos e feedback de erro.

Diretiva de execução:
1. Revisar os fluxos das tabs críticas para explicitar erro, vazio real, carregamento e carga parcial.
2. Corrigir fragilidades evidentes em polling e efeitos no módulo administrativo.
3. Melhorar consistência de feedbacks e estados operacionais.
4. Revisar regras de moderação onde hoje o fluxo contradiz a intenção do painel.
5. Elevar a confiabilidade técnica do módulo sem abrir refactor amplo fora do escopo admin.

Restrições:
- Preservar a linguagem visual atual do produto.
- Evitar refactor cosmético sem impacto operacional.
- Não mexer em áreas públicas fora do necessário.

Validação local:
- Rodar build e lint, além das verificações locais compatíveis com a tarefa.
- Reportar apenas o que não foi possível aplicar ou resolver.

Regra de retorno:
- Em caso de sucesso, considerar a missão concluída sem relatório longo.
- Só retornar se houver bloqueio, erro concreto ou item não aplicado.
```

---

## Ordem Recomendada

1. executar Fase 1 por completo antes de qualquer ajuste profundo de UX;
2. iniciar Fase 2 logo após a base de segurança estar estabilizada;
3. usar Fase 3 para consolidação operacional e redução de atrito diário.

---

## Observação de QA

Após cada missão aplicada pelo Claude Code:

1. subir ou manter o app em `http://localhost:5173`;
2. validar o fluxo real afetado;
3. registrar regressões percebidas;
4. só então autorizar a próxima missão.
