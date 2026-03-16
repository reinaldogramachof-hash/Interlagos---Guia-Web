---
name: new-feature
description: Scaffolda uma nova feature seguindo a arquitetura feature-based do projeto. Use quando o usuário pedir para criar uma nova seção, view, módulo ou funcionalidade.
argument-hint: [nome-da-feature]
---

Crie a estrutura de pastas e arquivos para a feature `$ARGUMENTS` em `app/src/features/$ARGUMENTS/`.

## Estrutura a criar

```
app/src/features/$ARGUMENTS/
├── $ARGUMENTSView.jsx       # View principal (lista/grid)
├── $ARGUMENTSCard.jsx       # Card individual (se listar itens)
└── $ARGUMENTSDetailModal.jsx # Modal de detalhe (se tiver detalhe)
```

E o service correspondente em:
```
app/src/services/$ARGUMENTSService.js
```

## Regras obrigatórias para cada arquivo

**View (`$ARGUMENTSView.jsx`):**
- Máximo 200 linhas
- Importar dados via service (nunca direto do supabase)
- Usar `SkeletonCard` durante loading: `import { SkeletonCard } from '../../components/SkeletonCard'`
- Usar `EmptyState` quando lista vazia: `import EmptyState from '../../components/EmptyState'`
- Adicionar `pb-24` no container raiz (espaço para a Bottom Nav)
- Mobile-first: projetar para 375px primeiro

**Card (`$ARGUMENTSCard.jsx`):**
- Máximo 200 linhas
- Usar classes de design tokens: `rounded-card`, `shadow-card`, `rounded-pill`
- Botão de WhatsApp share se aplicável

**Modal (`$ARGUMENTSDetailModal.jsx`):**
- Usar `rounded-modal`, `shadow-modal`
- Imagem: `h-48 sm:h-64` (nunca h-64 fixo)
- Título: `text-2xl sm:text-3xl` (nunca text-4xl)
- Fechar com Escape e clique no backdrop

**Service (`$ARGUMENTSService.js`):**
- Seguir o padrão do `/new-service`

## Após criar os arquivos

1. Adicionar o import da View em `app/src/App.jsx`
2. Adicionar um `case '$ARGUMENTS'` no `switch` de `renderView()`
3. Adicionar entrada no `SidebarMenu.jsx` se for uma seção acessível pelo menu
4. Executar `npm run build` para confirmar zero erros
