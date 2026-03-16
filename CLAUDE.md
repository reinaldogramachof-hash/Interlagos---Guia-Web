# CLAUDE.md — Regras do Projeto: Interlagos Conectado / TemNoBairro

> Este arquivo é lido automaticamente pelo Claude Code a cada sessão.
> Ele define as regras imutáveis de arquitetura, stack e UX deste projeto.

---

## CONTEXTO DO PRODUTO

**Posicionamento:** Community Hub — Rede Social Hiperlocal + Classificados C2C + SaaS B2B Local.
**Modelo de crescimento:** O2O (Offline-to-Online), viral via compartilhamento no WhatsApp.
**Domínio:** Bairro de Interlagos, São Paulo.

---

## STACK OBRIGATÓRIA

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | React 19 + Vite 7 | Manter; não migrar para Next.js sem aprovação |
| Estilo | Tailwind CSS 3 | Mobile-First; sem CSS-in-JS |
| Estado Global | **Zustand** | Substituir useState disperso em App.jsx |
| Backend / DB | **Supabase** | Substituir Firebase/Firestore completamente |
| Auth | Supabase Auth (Google OAuth + Magic Link) | Substituir Firebase Auth |
| PWA | vite-plugin-pwa (Workbox) | Cache-first para feed offline |
| Ícones | lucide-react | Já em uso; manter |
| Busca (futuro) | Algolia (já instalado) | Integrar após migração Supabase |

---

## PRINCÍPIOS DE UX (INEGOCIÁVEIS)

1. **Mobile-First rigoroso:** Todo componente novo deve ser projetado para 375px primeiro.
2. **Lazy Login:** Nunca exigir login para visualizar conteúdo. Login só ao interagir (curtir, comentar, postar).
3. **PWA Offline-First:** O feed principal (merchants, news) deve funcionar sem conexão (cache Workbox).
4. **Compartilhamento WhatsApp:** Todo card de negócio/classificado deve ter botão de share nativo.
5. **Performance:** LCP < 2.5s em 4G lento. Imagens com `loading="lazy"`. Sem bloquear main thread.

---

## ARQUITETURA DE CÓDIGO (REGRAS)

### Estrutura de Pastas Alvo

```
app/src/
├── app/
│   ├── App.jsx               # Shell: layout + routing apenas
│   └── Router.jsx            # Switch de views (extraído de App.jsx)
├── features/
│   ├── admin/
│   │   ├── AdminPanel.jsx    # Shell de tabs apenas
│   │   ├── tabs/
│   │   │   ├── ApprovalsTab.jsx
│   │   │   ├── MerchantsTab.jsx
│   │   │   ├── NewsTab.jsx
│   │   │   ├── CampaignsTab.jsx
│   │   │   ├── UsersTab.jsx
│   │   │   ├── AuditTab.jsx
│   │   │   └── TicketsTab.jsx
│   ├── auth/
│   │   ├── LoginModal.jsx
│   │   ├── AuthContext.jsx
│   │   └── authStore.js      # Zustand store
│   ├── merchants/
│   │   ├── MerchantsView.jsx
│   │   ├── MerchantCard.jsx
│   │   ├── MerchantDetailModal.jsx
│   │   ├── PremiumCarousel.jsx
│   │   └── ProCarousel.jsx
│   ├── ads/
│   │   ├── AdsView.jsx
│   │   ├── AdCard.jsx
│   │   ├── AdDetailModal.jsx
│   │   └── CreateAdWizard.jsx
│   ├── news/
│   │   ├── NewsFeed.jsx
│   │   └── NewsDetailModal.jsx
│   ├── community/
│   │   ├── SuggestionsView.jsx
│   │   ├── DonationsView.jsx
│   │   └── HistoryView.jsx
│   └── merchant-panel/
│       └── MerchantPanel.jsx
├── lib/
│   ├── supabaseClient.js     # Cliente Supabase (único ponto de acesso ao DB)
│   └── supabaseTypes.js      # Tipos/schemas das tabelas
├── services/
│   ├── authService.js        # Substituir: Firebase → Supabase Auth
│   ├── merchantService.js    # CRUD de merchants via Supabase
│   ├── adsService.js
│   ├── notificationService.js
│   ├── favoritesService.js
│   └── statsService.js
├── stores/                   # Zustand stores
│   ├── merchantStore.js
│   ├── uiStore.js
│   └── authStore.js
├── components/               # Componentes genéricos e reutilizáveis
│   ├── Modal.jsx
│   ├── Sidebar.jsx
│   ├── NotificationBell.jsx
│   └── ChatbotWidget.jsx
├── constants/
│   └── categories.jsx
└── utils/
    ├── validation.js
    └── pwaUtils.js
```

### Regras de Componentes

- **Máximo 200 linhas por arquivo JSX.** Acima disso, extrair sub-componentes.
- **Sem lógica de negócio em componentes de UI.** Lógica vai nos `services/` ou `stores/`.
- **Sem chamadas diretas ao Supabase dentro de componentes.** Sempre via `services/`.
- **Nunca importar `supabaseClient` diretamente em componentes.** Apenas nos `services/`.

---

## SUPABASE — MODELO DE DADOS

### Tabelas Principais

```sql
-- Usuários (espelha Supabase Auth)
profiles (id uuid PK FK auth.users, display_name, photo_url, role, created_at, updated_at)

-- Comerciantes
merchants (id, owner_id FK profiles, name, description, category, plan, image_url, phone, address, instagram, whatsapp, is_active, created_at)

-- Notícias
news (id, author_id FK profiles, title, content, image_url, category, status, created_at)

-- Anúncios/Classificados C2C
ads (id, seller_id FK profiles, title, description, price, category, image_url, status, created_at)

-- Campanhas (B2B)
campaigns (id, merchant_id FK merchants, title, description, discount, start_date, end_date, status)

-- Analytics de Cliques
click_events (id, entity_id, entity_type, user_id, session_id, created_at)

-- Favoritos
favorites (id, user_id FK profiles, entity_id, entity_type, created_at)

-- Notificações
notifications (id, user_id FK profiles, title, body, is_read, type, ref_id, created_at)

-- Sugestões da Comunidade
suggestions (id, author_id FK profiles, title, description, votes, status, created_at)

-- Tickets de Suporte
tickets (id, author_id FK profiles, subject, body, status, resolved_at, resolved_by)
```

---

## VARIÁVEIS DE AMBIENTE


```env
# Supabase (substituir Firebase)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Algolia (busca)
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=

# Genkit/AI (manter)
VITE_GENKIT_API_URL=
```

---

## REGRAS DE GIT

- **Branch principal:** `main`
- **Nomenclatura de branch:** `feat/`, `fix/`, `refactor/`, `chore/`
- **Antes de qualquer PR:** rodar `npm run lint` e garantir zero erros
- **Não commitar `.env.local` nem credenciais**

---

## PRIORIDADE DE EXECUÇÃO (ROADMAP TÉCNICO)

1. `[FEITO]` Backup pré-migração (commit: "Backup pré-migração Supabase")
2. `[PRÓXIMO]` Criar `lib/supabaseClient.js` e novo `.env`
3. `[PRÓXIMO]` Migrar `AuthContext.jsx` + `authService.js` → Supabase Auth
4. `[PRÓXIMO]` Migrar coleções Firestore → tabelas Supabase
5. `[PRÓXIMO]` Desmembrar `AdminPanel.jsx` em tabs isoladas
6. `[PRÓXIMO]` Extrair carrosséis e lógica de scroll de `App.jsx`
7. `[PRÓXIMO]` Configurar `vite-plugin-pwa` + Workbox cache strategy
8. `[FUTURO]` Integrar Zustand stores (substituir useState global)
9. `[FUTURO]` Integrar Algolia para busca em tempo real
