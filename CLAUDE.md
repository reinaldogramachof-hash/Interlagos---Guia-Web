# CLAUDE.md — Regras do Projeto: Tem No Bairro

> Este arquivo é lido automaticamente pelo Claude Code a cada sessão.
> Ele define as regras imutáveis de arquitetura, stack e UX deste projeto.

## MODO DE OPERAÇÃO DE AGENTES

Este repositório opera com a seguinte divisão de responsabilidades:

| Papel | Responsável | Responsabilidade |
|---|---|---|
| Arquiteto e Orquestrador | Codex | Planejamento, priorização, prompts de execução, governança e documentação |
| Executor Técnico | Claude Code | Implementação de código, migrações, refactors, validações locais e aplicação de mudanças |
| QA Funcional | Reinaldo | Testes reais via `localhost`, validação de fluxo e aceite |

### Protocolo obrigatório do Claude Code

1. Ler este `CLAUDE.md`, `.agent/SESSION_START.md` e `.agent/rules/`.
2. Executar apenas a tarefa descrita no prompt técnico vigente.
3. Preservar o escopo; não expandir a tarefa por iniciativa própria.
4. Reportar **somente**:
   - o que não foi possível aplicar;
   - erros concretos;
   - dependências ausentes;
   - ambiguidades que mudem o comportamento esperado.
5. Se a implementação for aplicada com sucesso, não devolver relatório narrativo longo.
6. Considerar a tarefa concluída quando código, build local aplicável e artefatos pedidos estiverem consistentes.

---

## CONTEXTO DO PRODUTO

**Posicionamento:** Community Hub — Rede Social Hiperlocal + Classificados C2C + SaaS B2B Local.
**Modelo de crescimento:** O2O (Offline-to-Online), viral via compartilhamento no WhatsApp.
**Domínio:** São José dos Campos, SP — plataforma multi-bairro (4 bairros mapeados, 1 ativo).

---

## STACK OBRIGATÓRIA

| Camada | Tecnologia | Observação |
|---|---|---|
| Frontend | React 19 + Vite 7 | Manter; não migrar para Next.js sem aprovação |
| Estilo | Tailwind CSS 3 | Mobile-First; sem CSS-in-JS |
| Estado Global | **Zustand 5** | 3 stores: authStore, uiStore, merchantStore |
| Backend / DB | **Supabase** | ÚNICO backend. Firebase REMOVIDO do frontend |
| Auth | Supabase Auth (Google OAuth + Magic Link) | Firebase Auth removido |
| PWA | vite-plugin-pwa (Workbox) | Cache-first para feed offline |
| Ícones | lucide-react | Já em uso; manter |
| Busca (futuro) | Algolia (já instalado) | Integrar após multi-bairro estabilizar |

---

## ESTRATÉGIA MULTI-BAIRRO

### Bairros da Plataforma

| Bairro | Slug | URL | Status |
|---|---|---|---|
| Parque Interlagos | `interlagos` | `/interlagos/` | ✦ Ativo |
| Santa Júlia | `santa-julia` | `/santa-julia/` | 🔜 Em breve |
| Parque Novo Horizonte | `parque-novo-horizonte` | `/parque-novo-horizonte/` | 🔜 Em breve |
| Jardim das Indústrias | `jardim-das-industrias` | `/jardim-das-industrias/` | 🔜 Em breve |

### Como funciona o build multi-bairro

- **Um único codebase React** constrói para todos os bairros via Vite modes
- Cada bairro tem seu arquivo `app/.env.{slug}` com `VITE_NEIGHBORHOOD={slug}`
- Build: `npm run build:{slug}` → carrega `.env.{slug}` → `dist/` com `base=/{slug}/`
- Dados separados no Supabase via coluna `neighborhood` + RLS policies

### Regra de Dados (Multitenancy)

- **Nunca** ler dados de outro bairro no frontend — `VITE_NEIGHBORHOOD` é imutável no build
- **Sempre** passar `neighborhood` como filtro nas queries Supabase
- RLS policies garantem isolamento no nível de banco (camada final de segurança)
- Guia completo: `docs/BAIRROS.md`

---

## PRINCÍPIOS DE UX (INEGOCIÁVEIS)

1. **Mobile-First rigoroso:** Todo componente novo deve ser projetado para 375px primeiro.
2. **Lazy Login:** Nunca exigir login para visualizar conteúdo. Login só ao interagir (curtir, comentar, postar).
3. **PWA Offline-First:** O feed principal (merchants, news) deve funcionar sem conexão (cache Workbox).
4. **Compartilhamento WhatsApp:** Todo card de negócio/classificado deve ter botão de share nativo.
5. **Performance:** LCP < 2.5s em 4G lento. Imagens com `loading="lazy"`. Sem bloquear main thread.

---

## ARQUITETURA DE CÓDIGO (REGRAS)

### Estrutura de Pastas

```
app/src/
├── app/
│   ├── App.jsx               # Shell: layout + routing apenas (112 linhas)
│   ├── Router.jsx            # Switch de views
│   └── AppHeader.jsx
├── features/
│   ├── admin/
│   │   ├── AdminPanel.jsx
│   │   └── tabs/             # 8 tabs: Approvals, Merchants, News, Campaigns,
│   │                         #         Users, Tickets, Audit, Database
│   ├── auth/
│   │   ├── LoginModal.jsx
│   │   ├── AuthContext.jsx
│   │   ├── ProfileView.jsx
│   │   └── OnboardingModal.jsx
│   ├── merchants/
│   │   ├── MerchantsView.jsx
│   │   ├── MerchantCard.jsx
│   │   ├── MerchantDetailModal.jsx
│   │   ├── PremiumCarousel.jsx
│   │   ├── ProCarousel.jsx
│   │   └── merchant-panel/   # DashboardTab, AdsTab, SettingsTab
│   ├── ads/
│   │   ├── AdsView.jsx
│   │   ├── AdCard.jsx
│   │   ├── AdDetailModal.jsx
│   │   └── CreateAdWizard.jsx
│   ├── news/
│   │   ├── NewsFeed.jsx
│   │   ├── NewsDetailModal.jsx
│   │   ├── NewsCard.jsx
│   │   ├── CreateNewsModal.jsx
│   │   └── NewsResponsibilityModal.jsx
│   └── community/
│       ├── SuggestionsView.jsx
│       ├── DonationsView.jsx
│       └── ResidentPanel.jsx
├── lib/
│   └── supabaseClient.js     # Cliente Supabase singleton — ÚNICO ponto de acesso
├── services/                 # Todos via Supabase
│   ├── authService.js
│   ├── merchantService.js
│   ├── adsService.js
│   ├── newsService.js
│   ├── communityService.js
│   ├── storageService.js
│   ├── notificationService.js
│   ├── favoritesService.js
│   ├── statsService.js
│   ├── genkitService.js
│   └── consentService.js     # LGPD
├── stores/
│   ├── authStore.js
│   ├── uiStore.js
│   └── merchantStore.js
├── components/
│   ├── Modal.jsx
│   ├── Sidebar.jsx
│   ├── NotificationBell.jsx
│   └── ChatbotWidget.jsx
├── hooks/
│   └── useRequireAuth.js
├── constants/
│   └── categories.jsx
└── utils/
    └── validation.js

app/bairros/                  # Configs e briefings por bairro
├── interlagos/README.md
├── santa-julia/README.md
├── parque-novo-horizonte/README.md
└── jardim-das-industrias/README.md
```

### Regras de Componentes

- **Máximo 200 linhas por arquivo JSX.** Acima disso, extrair sub-componentes.
- **Sem lógica de negócio em componentes de UI.** Lógica vai nos `services/` ou `stores/`.
- **Sem chamadas diretas ao Supabase dentro de componentes.** Sempre via `services/`.
- **Nunca importar `supabaseClient` diretamente em componentes.** Apenas nos `services/`.

---

## SUPABASE — MODELO DE DADOS

### Tabelas Principais (todas com coluna `neighborhood`)

```sql
-- Usuários (espelha Supabase Auth)
profiles (id uuid PK FK auth.users, display_name, photo_url, role,
          full_name, neighborhood, phone_verified, onboarding_completed,
          terms_accepted_at, created_at, updated_at)

-- Bairros da plataforma
neighborhoods (id, slug, name, city, state, is_active, created_at)

-- Comerciantes
merchants (id, owner_id FK profiles, neighborhood, name, description,
           category, plan, image_url, phone, address, instagram, whatsapp,
           is_active, created_at)

-- Notícias
news (id, author_id FK profiles, neighborhood, title, content, image_url,
      category, status, created_at)

-- Anúncios/Classificados C2C
ads (id, seller_id FK profiles, neighborhood, title, description, price,
     category, image_url, status, created_at)

-- Campanhas (B2B)
campaigns (id, merchant_id FK merchants, neighborhood, title, description,
           discount, start_date, end_date, status)

-- Analytics de Cliques
click_events (id, entity_id, entity_type, neighborhood, user_id, session_id, created_at)

-- Favoritos
favorites (id, user_id FK profiles, entity_id, entity_type, created_at)

-- Notificações
notifications (id, user_id FK profiles, title, body, is_read, type, ref_id, created_at)

-- Sugestões da Comunidade
suggestions (id, author_id FK profiles, neighborhood, title, description, votes, status, created_at)

-- Tickets de Suporte
tickets (id, author_id FK profiles, subject, body, status, resolved_at, resolved_by)

-- Consentimentos LGPD
user_consents (id, user_id FK profiles, consent_type, accepted, created_at)
```

### RPCs Ativas

- `increment_merchant_view` — analytics de visualização
- `increment_merchant_contact` — analytics de clique WhatsApp
- `expire_ads` — cron diário às 3h UTC (pg_cron)
- `handle_new_user` — trigger criação de perfil
- `increment_suggestion_votes` — votação na caixa de sugestões

---

## VARIÁVEIS DE AMBIENTE

```env
# Bairro (define base path e filtro de dados)
VITE_NEIGHBORHOOD=interlagos

# Supabase (projeto compartilhado — mesmo para todos os bairros)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# PWA
VITE_DISABLE_PWA=false

# Algolia (busca — futuro)
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=

# Genkit/AI
VITE_GENKIT_API_URL=
```

---

## REGRAS DE GIT

- **Branch principal:** `main`
- **Nomenclatura de branch:** `feat/`, `fix/`, `refactor/`, `chore/`
- **Antes de qualquer PR:** rodar `npm run build:interlagos` e garantir zero erros
- **Não commitar `.env.local` nem arquivos com credenciais reais**
- **Ao executar tarefa delegada pelo Codex:** manter estritamente o escopo do prompt; se surgir desvio estrutural, parar e reportar

---

## ESTRUTURA DA RAIZ DO REPOSITÓRIO

```
Guia Digital Interlagos/
├── .agent/          # Rules e skills para agentes (roles, routing, coding-standards)
├── app/             # React PWA multi-bairro (Vite)
│   └── bairros/    # Briefings e configs por bairro
├── landing/         # Landing page HTML/CSS/JS puro
│   └── assets/     # hero.png, herosjc.png, {slug}-hero.jpg
├── docs/            # Documentação do produto e guias técnicos
│   └── migrations/ # SQLs para executar no Supabase
├── config/
│   └── hostgator/  # Configs de deploy (htaccess, zips)
├── CLAUDE.md        # Este arquivo — regras imutáveis
└── README.md        # Visão geral do repositório
```

---

## PRIORIDADE DE EXECUÇÃO (ROADMAP TÉCNICO)

### Concluído
- `[FEITO]` Supabase instalado, RLS, OAuth, trigger, RPCs
- `[FEITO]` Migração Firebase → Supabase (Firebase removido do frontend)
- `[FEITO]` Zustand 3 stores (auth, ui, merchant)
- `[FEITO]` Todos os services Supabase (merchant, ads, news, community, storage, notifications, favorites, stats, consent)
- `[FEITO]` Arquitetura feature-based (features/, App.jsx + Router.jsx separados)
- `[FEITO]` AdminPanel desmembrado em 8 tabs
- `[FEITO]` vite-plugin-pwa + Workbox configurado
- `[FEITO]` Landing page raiz multi-bairro + História do Bairro
- `[FEITO]` Sprint LGPD — consentimento, onboarding, OnboardingModal
- `[FEITO]` Deploy em produção: temnobairro.online/interlagos/
- `[FEITO]` Estrutura multi-bairro (bairros/, .env.{slug}, build scripts)

### Próximos
- `[PRÓXIMO]` Executar `docs/migrations/sprint1-lgpd.sql` no Supabase
- `[PRÓXIMO]` Re-upload interlagos com OAuth fix + Sprint LGPD
- `[PRÓXIMO]` Testar onboarding completo em produção
- `[PRÓXIMO]` Conectar métricas reais ao DashboardTab (statsService)
- `[PRÓXIMO]` Verificar link WhatsApp no AdDetailModal
- `[PRÓXIMO]` Adicionar coluna `neighborhood` nas tabelas Supabase + atualizar RLS

### Futuro
- `[FUTURO]` Ativar bairro Santa Júlia (checklist em `app/bairros/santa-julia/README.md`)
- `[FUTURO]` Criar tabela `neighborhoods` no Supabase
- `[FUTURO]` Integrar Algolia para busca em tempo real
- `[FUTURO]` Sprint 2 LGPD — verificação de telefone por OTP
- `[FUTURO]` Expandir landing para novos bairros conforme ativação
