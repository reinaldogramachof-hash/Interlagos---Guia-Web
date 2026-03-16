---
name: build-verify
description: Executa verificação completa de build e qualidade do código. Use antes de qualquer commit, após implementações, ou quando o Claude solicitar uma auditoria de integridade do projeto.
---

Execute a verificação completa de qualidade do projeto.

## Passo 1 — Build de produção

```bash
cd app && npm run build
```

**Resultado esperado:**
- `✓ built in X.XXs` (sem erros)
- `PWA v1.x.x` com entradas pré-cacheadas
- Chunks: vendor, ui, supabase, index

Se houver erros, copie a mensagem completa e reporte ao Claude. **Não tente corrigir sem aprovação.**

## Passo 2 — Verificação de imports proibidos

Procure imports diretos de supabaseClient em componentes (violação de arquitetura):

```bash
grep -r "import.*supabaseClient" app/src/features/ app/src/components/
```

Resultado esperado: nenhuma ocorrência.

Se encontrar: liste os arquivos e reporte ao Claude.

## Passo 3 — Verificação de tamanho de arquivos

Arquivos JSX com mais de 200 linhas (violação do CLAUDE.md):

```bash
find app/src -name "*.jsx" | xargs wc -l | sort -rn | head -10
```

Arquivos acima de 200 linhas devem ser reportados para revisão pelo Claude.

## Passo 4 — Verificação de variáveis de ambiente

Confirme que `.env.local` NÃO está sendo rastreado pelo git:

```bash
git status app/.env.local
```

Resultado esperado: `nothing to commit` ou `untracked files` — nunca `modified` ou `staged`.

## Relatório Final

Apresente no formato:

```
=== BUILD VERIFY REPORT ===

Build:        ✅ PASSOU / ❌ FALHOU
Imports:      ✅ Nenhuma violação / ❌ X violações (lista)
Tamanho JSX:  ✅ Todos < 200 linhas / ⚠️ X arquivos acima (lista)
Env:          ✅ .env.local não rastreado / ❌ ATENÇÃO

Pronto para commit: SIM / NÃO — aguardando revisão do Claude
```
