---
name: audit-component
description: Audita um componente JSX contra as regras do CLAUDE.md do projeto. Use quando revisar um arquivo antes de commitar, quando suspeitar de violações de arquitetura, ou quando o usuário pedir para revisar um componente.
argument-hint: [caminho-do-arquivo]
---

Audite o componente `$ARGUMENTS` contra todas as regras definidas no CLAUDE.md do projeto.

## Checklist de auditoria

### 1. Tamanho do arquivo
- [ ] Arquivo tem menos de 200 linhas?
- Se não: identificar quais blocos podem ser extraídos em sub-componentes

### 2. Separação de responsabilidades
- [ ] Sem lógica de negócio inline? (lógica deve estar em `services/` ou `stores/`)
- [ ] Sem chamadas diretas ao Supabase? (verificar `import.*supabase` no arquivo)
- [ ] Sem `import { supabase } from` ou `import supabase from` no arquivo?

### 3. Mobile-First
- [ ] Container raiz usa classes responsivas a partir de 375px?
- [ ] Imagens têm `loading="lazy"`?
- [ ] Texto legível sem zoom em 375px? (mínimo `text-sm`)
- [ ] Botões com área de toque mínima de 44px? (`min-h-[44px]` ou `py-3`)

### 4. Design tokens
- [ ] Usa `rounded-card`, `rounded-modal` ou `rounded-pill` em vez de valores fixos?
- [ ] Usa `shadow-card`, `shadow-modal` ou `shadow-fab` em vez de `shadow-lg` avulso?
- [ ] Usa `text-brand-*` para cores da marca?

### 5. Lazy Login (se há ações protegidas)
- [ ] Ações que exigem auth verificam `currentUser` antes?
- [ ] Chama `onLoginRequired` ou `requireAuth` em vez de redirecionar?

### 6. Acessibilidade básica
- [ ] Botões têm `aria-label` quando sem texto visível?
- [ ] Imagens têm `alt` descritivo?

### 7. Performance
- [ ] Sem `useEffect` com dependência vazia que faz fetch sem cleanup?
- [ ] Subscriptions realtime têm `return () => unsubscribe()` no cleanup?

## Formato do relatório

Para cada item com problema encontrado, apresente:
- **Linha:** número da linha
- **Violação:** descrição do problema
- **Correção:** código corrigido ou instrução clara

Se não houver problemas, confirme: "Componente em conformidade com o CLAUDE.md ✓"
