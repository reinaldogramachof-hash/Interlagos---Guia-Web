---
name: pr-description
description: Escreve descrição de Pull Request. Use ao criar um PR, resumir mudanças ou quando o usuário pedir para descrever o que foi alterado no branch atual.
argument-hint: [branch-base]
---

Escreva uma descrição de Pull Request para as mudanças no branch atual.

1. Execute `git diff ${ARGUMENTS[0]:-main}...HEAD` para ver todas as alterações
2. Execute `git log ${ARGUMENTS[0]:-main}...HEAD --oneline` para ver os commits
3. Escreva a descrição no formato abaixo:

## O que foi feito
Uma frase explicando o que este PR faz.

## Por que
Contexto breve sobre a motivação da mudança.

## Mudanças
- Lista de alterações específicas
- Agrupar mudanças relacionadas
- Mencionar arquivos criados, renomeados ou removidos

## Checklist
- [ ] `npm run build` passou sem erros
- [ ] Nenhum arquivo `.env.local` ou credencial commitada
- [ ] Componentes com menos de 200 linhas
- [ ] Sem imports diretos de `supabaseClient` em componentes
