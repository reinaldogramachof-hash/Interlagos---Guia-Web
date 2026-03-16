# Revisão de Código Abrangente

**Gatilho:** /review

## Objetivo
Auditar as mudanças do branch atual antes de submeter para revisão do Claude (Senior Engineer).

## Passos

### 1. Carregamento de Contexto
- Execute `git diff main...HEAD --stat` para ver todos os arquivos alterados
- Execute `git log main...HEAD --oneline` para ver os commits do branch

### 2. Análise Estática

```bash
# Verificar imports proibidos
grep -r "import.*supabaseClient" app/src/features/ app/src/components/

# Verificar arquivos acima de 200 linhas
find app/src -name "*.jsx" | xargs wc -l | sort -rn | head -15

# Build de produção
cd app && npm run build
```

### 3. Revisão Semântica

Para cada arquivo alterado, verificar:

**Arquitetura:**
- [ ] Sem supabaseClient em componentes?
- [ ] Services seguem o padrão fetch/subscribe/create/update/delete?
- [ ] Stores Zustand sem getters inválidos?

**Qualidade:**
- [ ] Sem `console.log` de debug?
- [ ] Sem comentários `// TODO` não resolvidos?
- [ ] Cleanup de subscriptions realtime?

**Mobile-First:**
- [ ] Classes responsivas corretas?
- [ ] Imagens com `loading="lazy"`?
- [ ] Botões com área de toque adequada?

**Design Tokens:**
- [ ] Usando `rounded-card`, `shadow-card`, `text-brand-*`?
- [ ] Sem valores hardcoded como `shadow-lg`, `rounded-2xl`?

### 4. Relatório para o Claude

Gere um relatório no formato:

```
=== REVIEW REPORT — [data] ===

Arquivos alterados: X
Commits: X

VIOLAÇÕES CRÍTICAS (bloqueiam o commit):
- [arquivo:linha] — [descrição]

VIOLAÇÕES MENORES (corrigir se possível):
- [arquivo:linha] — [descrição]

Build: ✅ PASSOU / ❌ FALHOU

RECOMENDAÇÃO: APROVAR / REPROVAR (aguardando Claude)
```
