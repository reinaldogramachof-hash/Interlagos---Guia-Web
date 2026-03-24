# Stack e Restrições Técnicas do Projeto

**Escopo:** Global — sempre ativo em todas as operações.

## Identidade do Produto

- **Nome:** Tem No Bairro (domínio: Parque Interlagos, SP → multi-bairro futuro)
- **Modelo:** Community Hub O2O — Comerciantes locais + Classificados C2C + Jornal do bairro
- **App dir:** `app/` (raiz do frontend React)

## Stack Obrigatória

| Camada | Tecnologia | Restrição |
|---|---|---|
| Frontend | React 19 + Vite 7 | NÃO migrar para Next.js |
| Estilo | Tailwind CSS 3 | NÃO usar CSS-in-JS, styled-components, ou arquivos .css avulsos |
| Estado Global | Zustand ^5 | NÃO usar Redux ou Context para estado global |
| Backend / DB | Supabase (@supabase/supabase-js ^2) | Firebase REMOVIDO do frontend |
| Auth | Supabase Auth | Google OAuth + Magic Link |
| PWA | vite-plugin-pwa + Workbox | Cache-first para feed offline |
| Ícones | lucide-react | Não instalar heroicons, react-icons ou similares |

## Restrições Absolutas

- **NUNCA** importar `supabaseClient` diretamente em componentes (`features/` ou `components/`)
  - Supabase só pode ser importado dentro de `app/src/services/` e `app/src/stores/`
- **NUNCA** commitar `.env.local` ou credenciais
- **NUNCA** usar `any` em TypeScript (se/quando migrado)
- **NUNCA** adicionar dependências não listadas acima sem aprovação do Claude

## Design System (Tailwind Tokens)

Usar SEMPRE os tokens definidos em `app/tailwind.config.js`:

```
rounded-card     → border-radius de cards
rounded-modal    → border-radius de modais
rounded-pill     → border-radius de pills/badges
shadow-card      → sombra de cards
shadow-modal     → sombra de modais
shadow-fab       → sombra do FAB button
text-brand-*     → escala de cores da marca (600, 700, 50)
```

NÃO usar valores hardcoded como `rounded-2xl`, `shadow-lg`, `text-indigo-600` — usar sempre os tokens.

## Estrutura de Diretórios

```
app/src/
├── features/{dominio}/   ← Views, Cards, Modals por domínio
├── components/           ← Componentes genéricos reutilizáveis
├── services/             ← ÚNICO ponto de acesso ao Supabase
├── stores/               ← Zustand stores
├── lib/                  ← supabaseClient.js (singleton)
├── context/              ← Wrappers de compatibilidade
├── constants/            ← Categorias, planos
└── hooks/                ← Custom hooks
```
