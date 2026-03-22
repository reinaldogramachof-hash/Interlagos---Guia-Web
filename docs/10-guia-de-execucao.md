# Tem No Bairro — Guia de Execução do Projeto

> **Versão:** 2.0
> **Data de criação:** Março/2026
> **Última atualização:** 22/03/2026
> **Lançamento previsto:** Maio/2026
> **Status geral:** 🟢 Em andamento — Fases 0, 1 e 2 concluídas. Sprint de qualidade e arquitetura P1–P3 concluído. Fase 3 parcialmente concluída.

---

## COMO LER ESTE DOCUMENTO

Este guia é o **mapa vivo** do projeto. Ele responde três perguntas em todo momento:

- **O que foi planejado?** — A visão original do produto e da arquitetura
- **O que foi executado?** — O que já está feito, testado e funcionando
- **O que está previsto?** — O que vem a seguir, com prioridade e contexto

Deve ser atualizado a cada sessão de trabalho significativa.

---

## 1. VISÃO DO PRODUTO (Resumo Executivo)

**Produto:** Plataforma digital comunitária hiperlocal — a rede social do bairro.
**Primeiro bairro:** Parque Interlagos, São Paulo — SP.
**Modelo de negócio:** Freemium B2B — planos mensais para comerciantes (R$0 a R$299,90/mês).
**Lançamento:** Maio/2026.
**Stack:** React 19 + Vite 7 + Supabase + Tailwind CSS + PWA.
**Equipe:** 3 pessoas (Dev/Gestor + Especialista Digital + Marketing).

**Frase de posicionamento:**
> *"Tudo o que acontece no seu bairro, você encontra no Tem No Bairro."*

---

## 2. ARQUITETURA TÉCNICA DEFINIDA

| Camada | Tecnologia | Status |
|---|---|---|
| Frontend | React 19 + Vite 7 | ✅ Ativo |
| Estilo | Tailwind CSS 3 (Mobile-First) | ✅ Ativo |
| Estado Global | Zustand 5 | ✅ authStore + uiStore + merchantStore implementados |
| Backend / DB | Supabase (PostgreSQL) | ✅ Conectado e com schema |
| Auth | Supabase Auth — Google OAuth + Magic Link | ✅ Configurado e testado |
| PWA | vite-plugin-pwa + Workbox | ✅ Build gerando SW |
| Ícones | lucide-react | ✅ Em uso |
| Busca | Algolia (instalado) | ⏳ Não integrado — pós-lançamento |

**Padrões de arquitetura obrigatórios (CLAUDE.md):**
- Máximo 200 linhas por arquivo JSX
- Sem lógica de negócio em componentes de UI
- Sem chamadas diretas ao Supabase em componentes — sempre via `services/`
- Estrutura de features: `src/features/`, `src/services/`, `src/stores/`

---

## 3. BANCO DE DADOS — ESTADO ATUAL

**Projeto Supabase:** `jfjavgjeylahhcfcixtv`

### Tabelas existentes e status

| Tabela | Status | Observação |
|---|---|---|
| `profiles` | ✅ Ativa + RLS | Trigger `handle_new_user` funcionando |
| `merchants` | ✅ Ativa + RLS | Colunas v2 adicionadas (M1) |
| `merchant_reviews` | ✅ Ativa + RLS | Policies de leitura pública adicionadas |
| `merchant_campaigns` | ✅ Ativa + RLS | Policies de leitura pública adicionadas |
| `news` | ✅ Ativa + RLS | |
| `news_comments` | ✅ Ativa + RLS | Policies de leitura pública adicionadas |
| `ads` | ✅ Ativa + RLS | Colunas v2 adicionadas (M2), `image_urls` migrado |
| `campaigns` | ✅ Ativa + RLS | |
| `click_events` | ✅ Ativa + RLS | INSERT livre para analytics |
| `favorites` | ✅ Ativa + RLS | Policies adicionadas (sessão 16/03) |
| `notifications` | ✅ Ativa + RLS | Policies adicionadas (sessão 16/03) |
| `suggestions` | ✅ Ativa + RLS | |
| `tickets` | ✅ Ativa + RLS | Policies adicionadas (sessão 16/03) |
| `audit_logs` | ✅ Ativa + RLS | Acesso somente para `master` |
| `chat_history` | ✅ Ativa + RLS | Para histórico do chatbot Genkit |

### RPCs criadas

| Função | Descrição | Status |
|---|---|---|
| `increment_merchant_view` | Registra visualização + incrementa `view_count` | ✅ |
| `increment_merchant_contact` | Registra clique no WhatsApp + incrementa `contact_count` | ✅ |
| `expire_ads` | Expira anúncios vencidos (executar via cron) | ✅ |
| `handle_new_user` | Cria perfil automaticamente ao criar usuário Auth | ✅ |
| `handle_updated_at` | Trigger genérico para `updated_at` | ✅ |
| `log_audit` | Registra ações administrativas em `audit_logs` | ✅ |

### Pendências de banco

| Item | Prioridade | Observação |
|---|---|---|
| Storage buckets (imagens) | ✅ Criados | 5 buckets: merchant-images, ad-images, news-images, campaign-images, avatars |
| Cron job `expire_ads` | ✅ Ativo | pg_cron habilitado, schedule diário às 3h UTC |
| Cron job `expire_campaigns` | 🟡 Médio | Ainda não configurado |
| Duplicata em `profiles` SELECT | 🟢 Baixo | Duas policies SELECT ("Permitir Leitura Publica" + "profiles_public_read") — remover uma |

---

## 4. O QUE FOI EXECUTADO — HISTÓRICO DE SESSÕES

### Sessão 1 — Setup Inicial e Migração Firebase → Supabase
**Data:** Fevereiro/2026

**Planejado:** Substituir Firebase por Supabase em todo o frontend.

**Executado:**
- Instalação de `@supabase/supabase-js` + `zustand`
- Criação de `src/lib/supabaseClient.js` (singleton)
- Criação de `src/stores/authStore.js` (Zustand — Google OAuth + Magic Link + email/senha)
- Criação de `src/context/AuthContext.jsx` (wrapper de compatibilidade)
- Criação dos 6 serviços Supabase: `authService`, `merchantService`, `notificationService`, `favoritesService`, `statsService`, `genkitService`
- Remoção do Firebase do `src/` (mantido apenas em `chatbot-genkit/`)
- Criação do `AdminPanel` com 8 tabs: Approvals, Merchants, News, Campaigns, Users, Tickets, Audit, Database
- Criação de `src/features/merchants/` (MerchantsView, PremiumCarousel, ProCarousel)
- Criação de `src/app/AppHeader.jsx`
- Configuração do `vite-plugin-pwa` + Workbox

**Resultado:** Build ✅ zero erros. PWA gerando SW. Firebase removido do frontend.

---

### Sessão 2 — Correção de Erros Críticos de Runtime
**Data:** Março/2026 (sessão longa)

**Problema apresentado:** 100+ erros `removeChild` no console, warnings de lock Supabase (`Lock was not released within 5000ms`), dois contextos VM simultâneos.

**Diagnóstico:**
- **Causa raiz:** React `StrictMode` causava double-invoke de `useEffect`, iniciando `init()` duas vezes
- Dois `onAuthStateChange` simultâneos competiam pelo Web Lock da gotrue do Supabase
- Segunda instância usava `steal` option, quebrando a primeira → `AbortError`
- Dois contextos VM (VM6248 + VM6353) operando no mesmo DOM → `removeChild` falhava

**Correções aplicadas:**

| Arquivo | Correção |
|---|---|
| `src/main.jsx` | Removido `<StrictMode>`. `init()` chamado fora do React, antes do `createRoot()` |
| `src/context/AuthContext.jsx` | Removido `useEffect` que chamava `init()` (evita double-invoke) |
| `src/NewsFeed.jsx` | Adicionada flag `cancelled` no `useEffect` para evitar state update em componente desmontado |
| `index.html` | Adicionado `translate="no"` e `<meta name="google" content="notranslate">` |
| `vite.config.js` | Adicionado `devOptions: { enabled: false }` no VitePWA (desabilita SW em dev) |

**Resultado:** Console limpo. Sem erros `removeChild`. Sem warnings de lock.

---

### Sessão 5 — Refatoração do App Shell + Fase 1: Storage e Upload de Imagens
**Data:** 16/03/2026

**Executado:**

| Arquivo | Mudança |
|---|---|
| `App.jsx` | Refatorado de 444 → 199 linhas — lógica inline extraída |
| `components/AppHeader.jsx` | Extraído de App.jsx — header sticky com logo, título dinâmico e botão de login |
| `components/BottomNav.jsx` | Extraído de App.jsx — 4 abas fixas com `NAV_ITEMS` exportado |
| `features/auth/ProfileView.jsx` | Criado — estado visitante + estado logado com QuickActions |
| `services/storageService.js` | Criado — `uploadImage(bucket, file, path)` e `deleteImage(bucket, path)` via Supabase Storage |
| `services/authService.js` | Adicionado `updateUserProfile(userId, data)` — upsert na tabela `profiles` |
| `features/merchants/MerchantPanel.jsx` | Refatorado — bug `getMerchantByEmail` corrigido para `getMerchantByOwner(uid)` + tabs extraídas |
| `features/merchants/merchant-panel/tabs/DashboardTab.jsx` | Criado — métricas: views, anúncios, cliques WhatsApp |
| `features/merchants/merchant-panel/tabs/AdsTab.jsx` | Criado — lista de anúncios com ações de criar/excluir |
| `features/merchants/merchant-panel/tabs/SettingsTab.jsx` | Criado — formulário completo com upload de imagem para `merchant-images` bucket |
| `components/ImageUpload.jsx` | Criado — componente genérico e reutilizável de upload com preview, validação 2MB e tipo |
| `features/ads/CreateAdWizard.jsx` | Refatorado 211 → 121 linhas — upload real para `ad-images` bucket, `expires_at` +30 dias, `alert()` → `showToast()` |
| `.agent/rules/coding-standards.md` | Adicionadas regras de segurança — proibido ler `.env.local` e usar service role key em scripts |

**Supabase (via Dashboard):**
- 5 Storage Buckets criados: `merchant-images`, `ad-images`, `news-images`, `campaign-images`, `avatars`
- Extension `pg_cron` habilitada
- Cron job `expire_ads` agendado — diário às 3h UTC
- Coluna `expires_at timestamptz` adicionada à tabela `ads`
- Policy RLS UPDATE para `merchants` (owner + admin)

**Resultado:** Upload de imagem funcionando em cadastro de comércio e criação de anúncio. Build ✅

---

### Sessão 7 — Jornal Local: Conexão ao Backend + Correções de Campo
**Data:** 22/03/2026 | **Commit:** `6c2f256`

**Executado:**

| Arquivo | Mudança |
|---|---|
| `services/newsService.js` | Adicionados `updateNews(id, data)` e `updateNewsStatus(id, status)` |
| `features/news/NewsDetailModal.jsx` | 5 bugs corrigidos: `image_url`, `created_at` formatado, `content` real, `author_name` com fallback, `navigator.clipboard` substituindo `alert()` |
| `features/admin/tabs/NewsTab.jsx` | Reescrita completa — upload para bucket `news-images`, campos separados `summary`/`content`, categorias expandidas, `showToast` substituindo `alert/confirm` |
| `features/news/NewsCard.jsx` | Badge "Oficial" (equipe) vs "Morador" baseado em `author_name` |

**Resultado:** Jornal Local conectado ao banco de dados real. Build ✅

---

### Sessão 8 — Sprint P2: Zustand Stores + Router + Hooks
**Data:** 22/03/2026 | **Commits:** `43cd44d`, `aaa27e7`

**Executado:**

| Arquivo | Mudança |
|---|---|
| `stores/uiStore.js` | NOVO — centraliza: currentView, isLoginOpen, isSidebarOpen, showCreateAd, selectedMerchant/Service |
| `stores/merchantStore.js` | NOVO — merchants, loading, selectedCategory, searchTerm + init() com realtime |
| `hooks/useRequireAuth.js` | NOVO — hook de Lazy Login: `pendingActionRef` + `requireAuth` + `handleLoginSuccess` |
| `app/Router.jsx` | NOVO — switch de views extraído de App.jsx com seletores granulares do Zustand |
| `App.jsx` | Reduzido de 194 → 112 linhas. Dead state removido (selectedAd, selectedNews, selectedCampaign) |
| `features/auth/AuthContext.jsx` | Movido de `context/` → `features/auth/`. 16 import paths atualizados em toda a codebase |
| `services/communityService.js` | Adicionado `voteSuggestion(id)` — chama RPC `increment_suggestion_votes` |

**Supabase (via Dashboard):**
- RPC `increment_suggestion_votes` executada ✅

**Resultado:** App.jsx < 200 linhas. Arquitetura feature-based consolidada. Build ✅

---

### Sessão 9 — Sprint P3-B + P3-C: Auditoria de Qualidade
**Data:** 22/03/2026 | **Commits:** `56234f3`, `206d9f9`

**Auditoria de 19 arquivos JSX — 22 violações encontradas e corrigidas:**

| Categoria | Violações | Arquivos afetados |
|---|---|---|
| CAT-1: `alert()`/`window.confirm` | 18 ocorrências | AdminPanel, MerchantsTab, CreateCampaignForm, CampaignDetailModal, MerchantDetailModal, UpgradeModal, DonationsView, ApprovalsTab, CampaignsTab, UsersTab, TicketsTab |
| CAT-2: `<img>` sem fallback de nulo | 5 ocorrências | SuggestionsView, SettingsTab, UsersTab, AdsTab, FavoritesTab |
| CAT-3: `pendingDeleteId` pattern | 1 ocorrência | AdsTab (inline confirmation substituindo `window.confirm`) |
| CAT-4: Erros silenciados em `catch` | 15 ocorrências | ResidentPanel, MerchantPanel, DonationsView, SettingsTab, CampaignsTab, UsersTab, TicketsTab, AuditTab, AdsView, CreateAdWizard, ProfileView |

**Resultado:** Zero `alert()` / `window.confirm` no codebase. Todos os `catch` exibem feedback via `showToast`. Build ✅

---

### Sessão 10 — Edit de Anúncio + Fix Bug Modal Wizard
**Data:** 22/03/2026 | **Commit:** `15d6303`

**Executado:**

| Arquivo | Mudança |
|---|---|
| `services/adsService.js` | Adicionado `updateAd(adId, data)` |
| `features/ads/CreateAdWizard.jsx` | Modo edit via prop `initialAd` — pré-popula campos, chama `updateAd`, título muda para "Editar Anúncio". Fix: bug onde wizard usava `onBack` mas esperava `isOpen/onClose` (Modal nunca abria) |
| `features/merchants/MerchantPanel.jsx` | Add estado `adToEdit`, handlers `handleEditAd` e `handleWizardClose` (recarrega lista após fechar). Wizard agora renderizado como Modal correto |
| `features/merchants/merchant-panel/tabs/AdsTab.jsx` | Botão Edit agora chama `onEditClick(ad)` |

**Resultado:** CRUD completo de anúncios no Painel do Comerciante. Build ✅

---

### Sessão 6 — App Shell Unificado + Avatar Upload + Correções Visuais
**Data:** 16/03/2026

**Executado:**

| Arquivo | Mudança |
|---|---|
| `stores/authStore.js` | Adicionado `refreshProfile()` — recarrega perfil do Supabase sem novo login |
| `features/auth/ProfileView.jsx` | Upload de avatar implementado — `ImageUpload` + `uploadImage('avatars', ...)` + `updateUserProfile` + `refreshProfile()` |
| `App.jsx` | Full-screen views (admin, merchant-panel, resident-panel) removidas — painéis agora renderizam dentro do App Shell |
| `App.jsx` | `showBottomNav = true` — BottomNav visível em TODAS as telas sem exceção |
| `features/admin/AdminPanel.jsx` | `fixed inset-0 z-[60]` removido — convertido de modal bloqueante para view in-page |
| `features/merchants/MerchantPanel.jsx` | Mesmo ajuste — view in-page com `min-h-[calc(100vh-160px)]` |
| `features/community/ResidentPanel.jsx` | Mesmo ajuste — view in-page |
| `features/merchants/PremiumCarousel.jsx` | Bug visual corrigido — `bg-slate-900 rounded-2xl mx-3 p-5` adicionado; `loading="lazy"` nas imagens |
| `features/merchants/ProCarousel.jsx` | Mesmo fix visual + array `infinite` limitado a `.slice(0, 30)` (antes: 10x duplicação sem limite) |

**Supabase (via Dashboard):**
- Policy `public_read_active_merchants` verificada — usuários anônimos conseguem SELECT em `merchants WHERE is_active = true`

**Resultado:** Navegação persistente validada. Avatar do perfil funcionando (Reinaldo Gramacho — foto confirmada no screenshot). Build ✅

---

### Sessão 4 — Reestruturação da Navegação (UX)
**Data:** 16/03/2026

**Contexto:** Após leitura da pesquisa de mercado (Levantamento de Comércios), a equipe identificou que os módulos mais relevantes para o bairro (Comércios, Jornal, Classificados, Campanhas Sociais) precisavam estar acessíveis na navegação principal para maximizar a descoberta por novos usuários.

**Executado:**

| Elemento | Antes | Depois |
|---|---|---|
| Bottom Nav — Aba 1 | Home genérica | **Comércios** (listagem como tela principal) |
| Bottom Nav — Aba 2 | — | **Jornal** (feed de notícias) |
| Bottom Nav — Aba 3 | Classificados | **Classificados** (mantida) |
| Bottom Nav — Aba 4 | — | **Campanhas** (Doações e Ação Social) |
| Sidebar — Perfil | Em posição avulsa | **Após "Sugestões"** (seção Comunidade) |
| Sidebar — Jornal | Presente (duplicado) | **Removido** (já na bottom nav) |
| Sidebar — Doações | Presente (duplicado) | **Removido** (já na bottom nav) |
| Header do Sidebar | Clicável | Mantido — leva ao perfil |

**Resultado:** Navegação sem duplicatas. Os 4 módulos de maior impacto acessíveis com 1 toque. Perfil migrado para o sidebar sem perder acesso fácil.

---

### Sessão 3 — Schema SQL, RLS e Primeiro Login Real
**Data:** 16/03/2026

**Executado:**
- Execução da migração SQL incremental (`docs/09-migracao-sql.md`) blocos M1 a M7
- Adição de colunas faltantes em `merchants` (M1) e `ads` (M2)
- Criação das RPCs `increment_merchant_view`, `increment_merchant_contact`, `expire_ads` (M3)
- Criação dos ENUMs faltantes com segurança `DO $$ BEGIN ... EXCEPTION` (M4)
- Adição de policies RLS de leitura pública para `merchant_reviews`, `merchant_campaigns`, `news_comments` (M5)
- Criação do trigger `handle_new_user` com `ON CONFLICT DO NOTHING` (M6)
- Diagnóstico pós-migração (M7) — policies verificadas
- Adição de policies UPDATE para `merchants` (owner + admin)
- Diagnóstico de RLS bloqueado em `favorites`, `notifications`, `tickets`
- Adição de policies completas para `favorites`, `notifications`, `tickets`
- Configuração do Google OAuth no Supabase Dashboard
- **Primeiro login real testado:** Reinaldo Gramacho — `resident` — perfil criado pelo trigger ✅

**Resultado:** Fase 0 concluída. Sistema end-to-end funcionando com dados reais.

---

## 5. ESTADO ATUAL DO FRONTEND (22/03/2026)

### Arquivos de código (~85 arquivos em `src/`)

| Área | Arquivos | Status |
|---|---|---|
| Entry point | `main.jsx` | ✅ Estável |
| App shell | `app/App.jsx` (112 linhas), `app/Router.jsx`, `components/AppHeader.jsx`, `components/BottomNav.jsx` | ✅ < 200 linhas. Router extraído |
| Auth | `stores/authStore.js`, `features/auth/AuthContext.jsx` (wrapper), `hooks/useRequireAuth.js` | ✅ Lazy Login via hook |
| Stores | `stores/authStore.js`, `stores/uiStore.js`, `stores/merchantStore.js` | ✅ 3 stores Zustand com seletores exportados |
| Lib | `lib/supabaseClient.js` | ✅ Completo |
| Serviços | `services/` (9 arquivos: +`communityService` com `voteSuggestion`) | ✅ CRUD completo para todas as entidades |
| Admin | `features/admin/` (AdminPanel + 8 tabs) | ⚠️ AuditTab usa mock; renderiza in-page |
| Merchants | `features/merchants/` (MerchantsView, PremiumCarousel, ProCarousel, MerchantPanel + 3 tabs) | ✅ CRUD completo de anúncios (criar, editar, excluir) |
| Classificados | `features/ads/` (AdsView, AdDetailModal, CreateAdWizard — modo create + edit) | ✅ Upload + expires_at + updateAd |
| Jornal | `features/news/` (NewsFeed, NewsDetailModal, NewsCard) | ✅ Conectado ao Supabase — badges Oficial/Morador |
| Comunidade | `features/community/` (SuggestionsView, DonationsView, ResidentPanel) | ✅ voteSuggestion ativo |
| Perfil | `features/auth/ProfileView.jsx` | ✅ Upload de avatar funcionando |
| Componentes | `components/ImageUpload.jsx`, `Modal.jsx`, `Toast.jsx`, etc. | ✅ Sem alert() no codebase |
| PWA | `vite.config.js` | ✅ SW gerado no build |

### Build atual (22/03/2026)

```
vendor:   11 KB  │  ui/lucide: 21 KB
supabase: 172 KB │  index:     368 KB
Total:    ~626 KB (gzip ~169 KB)
PWA:      12 entradas pré-cacheadas ✅
Build time: ~6s
```

### Invariantes de qualidade atuais

- Zero `alert()` / `window.confirm` no codebase ✅
- Todos os `<img>` com fallback de nulo ou `onError` ✅
- Todos os `catch` com `showToast` visível ao usuário ✅
- Nenhum arquivo JSX acima de 200 linhas (exceto legados em `src/` raiz) ✅
- Nenhum componente importa `supabaseClient` diretamente ✅

---

## 6. ROADMAP DE FASES — VISÃO COMPLETA

### ✅ FASE 0 — Infraestrutura Base
**Status:** CONCLUÍDA (16/03/2026)

| Tarefa | Status |
|---|---|
| Criar projeto Supabase e preencher env | ✅ |
| Executar schema SQL completo | ✅ |
| Configurar RLS em todas as tabelas | ✅ |
| Criar RPCs de analytics | ✅ |
| Configurar Google OAuth | ✅ |
| Trigger automático de criação de perfil | ✅ |
| Testar fluxo de login end-to-end | ✅ |
| Corrigir erros de runtime (removeChild, lock) | ✅ |

---

### ✅ FASE 1 — Módulo de Comércios Completo
**Status:** CONCLUÍDA (16/03/2026)

**Objetivo:** Comerciante consegue se cadastrar, ter perfil aprovado e aparecer no app com dados reais.

| Tarefa | Status |
|---|---|
| MerchantsView — listagem com filtro por categoria | ✅ |
| MerchantCard — card com botão WhatsApp | ✅ |
| PremiumCarousel + ProCarousel (com dark background correto) | ✅ |
| MerchantDetailModal — página de detalhe | ✅ |
| MerchantPanel — painel completo com 3 tabs | ✅ |
| Storage Buckets criados (5 buckets) | ✅ |
| Upload de imagem no cadastro de comércio | ✅ |
| Upload de imagem nos classificados | ✅ |
| Upload de avatar no perfil do usuário | ✅ |
| `expire_ads` cron job ativado (daily 3h UTC) | ✅ |
| RLS pública para leitura de merchants (usuário anônimo) | ✅ |
| App Shell unificado — BottomNav em todas as telas | ✅ |
| Aprovação pelo AdminPanel (ApprovalsTab) | ⚠️ Funcionalidade existe — validar com dados reais |
| Avaliação de comércio (nota + comentário) | ⏳ Fase 2+ |
| Share nativo (navigator.share → WhatsApp) | ⏳ Fase 2+ |
| Conectar MerchantPanel ao statsService (métricas reais) | ⏳ Fase 6 |

---

### ✅ FASE 2 — Jornal Local
**Status:** CONCLUÍDA (22/03/2026)

| Tarefa | Status |
|---|---|
| NewsFeed — lista de notícias | ✅ Conectado ao Supabase real |
| NewsDetailModal — detalhe da notícia | ✅ Campos corretos (image_url, content, created_at, author_name) |
| Publicação de notícia pela equipe (AdminPanel NewsTab) | ✅ Upload de capa + campos separados summary/content |
| Badge "Oficial" vs "Morador" | ✅ NewsCard com badge baseado em author_name |
| `features/news/` estruturado | ✅ NewsFeed, NewsDetailModal, NewsCard |
| Submissão de notícia por morador (formulário + termos) | ⏳ Fase futura |
| Curtir e comentar notícia | ⏳ Fase futura |

---

### 🟡 FASE 3 — Classificados
**Status:** PARCIALMENTE CONCLUÍDA

| Tarefa | Status |
|---|---|
| AdsView — lista de anúncios | ✅ Conectado ao Supabase |
| AdDetailModal | ✅ Existe |
| CreateAdWizard — criação com upload de imagem | ✅ Upload para `ad-images` bucket + `expires_at` +30 dias |
| Edit de anúncio no Painel do Comerciante | ✅ Modo edit via `initialAd` prop no wizard |
| Excluir anúncio com confirmação inline | ✅ `pendingDeleteId` pattern |
| Expiração automática 30 dias | ✅ RPC `expire_ads` + cron pg_cron diário 3h UTC |
| `features/ads/` estruturado | ✅ |
| Contato via WhatsApp do anúncio | ⏳ A verificar no AdDetailModal |
| ApprovalsTab com dados reais de anúncio | ⏳ A testar ponta-a-ponta |

---

### ⏳ FASE 4 — Ação Social, Utilidade Pública e História
**Status:** PENDENTE | **Meta:** Semanas 3–4

| Tarefa | Status |
|---|---|
| SuggestionsView (base Ação Social) | ✅ Base existe |
| DonationsView (base Campanhas) | ✅ Base existe |
| HistoryView — História do Bairro | ✅ Base existe |
| UtilityView — Utilidade Pública | ✅ Existe |
| Formulário de solicitação de campanha | ⏳ A implementar |
| Fluxo de aprovação de campanha (AdminPanel) | ⏳ A implementar |
| Preenchimento de conteúdo real (Utilidade Pública) | ⏳ Conteúdo editorial pendente |

---

### ⏳ FASE 5 — Planos e Monetização
**Status:** PENDENTE | **Meta:** Semana 4

| Tarefa | Status |
|---|---|
| PlansView — página de planos | ✅ Existe |
| PlanCard — componente | ✅ Existe |
| PlanGate — gate por plano | ✅ Existe |
| useMerchantPlan — hook | ✅ Existe |
| **Definir gateway de pagamento** | ⏳ Decisão pendente (MP vs Stripe) |
| Integração com gateway | ⏳ A implementar após decisão |
| Fluxo de upgrade de plano pelo app | ⏳ A implementar |
| Downgrade automático por inadimplência (webhook) | ⏳ A implementar |

---

### ⏳ FASE 6 — Painel do Comerciante Completo
**Status:** PENDENTE | **Meta:** Semanas 4–5

| Tarefa | Status |
|---|---|
| MerchantPanel — dashboard básico | ✅ Base existe |
| Métricas: views, cliques WhatsApp, favoritos | ⏳ Conectar ao `statsService` |
| Publicação de campanha/oferta pelo painel | ⏳ A implementar |
| Painel Profissional — histórico + calendário | ⏳ A implementar |
| Painel Premium — relatórios + exportação | ⏳ A implementar |
| ResidentPanel — painel do morador | ✅ Base existe |

---

### ⏳ FASE 7 — Qualidade, Performance e Lançamento
**Status:** PENDENTE | **Meta:** Semanas 5–6

| Tarefa | Prioridade |
|---|---|
| Testes de usabilidade com beta-testers | 🔴 Crítico |
| Verificar LCP < 2.5s em conexão lenta | 🔴 Crítico |
| Testar PWA offline (cache funcional) | 🔴 Crítico |
| Testar share nativo no iOS e Android | 🔴 Crítico |
| Configurar domínio customizado | 🟠 Alto |
| SEO básico (meta tags, og:image por bairro) | 🟠 Alto |
| Configurar push notifications (PWA) | 🟠 Alto |
| Analytics de uso (Plausible ou Supabase) | 🟡 Médio |
| Monitoramento de erros (Sentry) | 🟡 Médio |

---

### ⏳ FASE 8 — Pós-lançamento
**Status:** FUTURO | **Meta:** Meses 2–3

| Tarefa | Prioridade |
|---|---|
| Integrar Algolia para busca em tempo real | 🟡 Médio |
| ~~Criar Zustand stores para merchants e UI~~ | ✅ Concluído (Sprint P2) |
| Refatorar componentes legados `src/` raiz para `features/` | 🟡 Médio |
| AuditTab com dados reais (tabela `audit_logs`) | 🟡 Médio |
| Chatbot Genkit integrado ao app | 🟡 Médio |
| Tabela `chat_history` para ChatbotWidget | 🟡 Médio |
| Avaliação de comércio (nota + comentário) | 🟡 Médio |
| Share nativo WhatsApp nos cards | 🟡 Médio |
| Plano Gold — módulo de gestão assistida | 🔵 Futuro |
| Multi-tenant por bairro | 🔵 Futuro |
| Publicação nas stores (App Store / Play Store) | 🔵 Futuro |

---

## 7. INTELIGÊNCIA DE MERCADO — PARQUE INTERLAGOS

> Fonte: *"Radiografia Econômica e Comercial de São José dos Campos: O Ecossistema Empreendedor e a Dinâmica do Bairro Parque Interlagos"* — Março/2026
> Arquivo: `Levantamento de Comércios em Parque Interlagos.pdf` (raiz do projeto)

### Contexto Macroeconômico de SJC

| Indicador | Dado |
|---|---|
| População | 737.310 habitantes |
| Renda per capita | R$ 60.194,93 (acima da média nacional) |
| IDH | 0,807 — desenvolvimento muito alto |
| Posição continental | Top 6 das melhores cidades das Américas (custo-benefício para investimentos) |
| Vocação econômica | Aeroespacial + inovação → transição para serviços e smart city |

### Perfil Comercial do Parque Interlagos

O bairro opera como uma **"área funcional" autossuficiente** — um shopping a céu aberto erguido pelo capital privado. O modelo predominante é o **"porta de rua"**: imóveis residenciais convertidos em pontos comerciais.

**Três pilares do comércio local:**
1. **Alimentação e lazer noturno** — bares, restaurantes e músicos. Âncora principal de sociabilidade e fluxo de caixa
2. **Serviços automotivos** — oficinas, funilarias, autopeças. Espinha dorsal da economia masculina local
3. **Beleza e estética** — salões, barbearias, esmalterias. Principal porta de entrada do empreendedorismo feminino via MEI

### Densidade de MEIs na Região

| Dado | Número |
|---|---|
| MEIs ativos no Vale do Paraíba (2025) | **247.226** |
| Crescimento ano a ano | **+1,84%** (4.463 novos registros) |
| SJC | Maior volume absoluto da região |

Mudança cultural relevante: **o MEI deixou de ser "saída para o desemprego" e virou escolha consciente de carreira.** Empreendedores buscam formalização por segurança jurídica e acesso a crédito.

### Matriz Setorial — Os Segmentos Mais Quentes (SJC)

| Setor | Empresas | Prioridade para captação |
|---|---|---|
| Saúde | 2.859 | Alta |
| Alimentação | 2.327 | **Crítica** — âncora do bairro |
| Veículos/Auto | 2.105 | Alta |
| Casa e Decoração | 1.668 | Média |
| Beleza e Estética | 1.266 | **Crítica** — forte presença local |
| Educação | 1.256 | Média |
| Vestuário | 977 | Média |
| Eventos e Lazer | 851 + 516 | Alta — noturno do bairro |
| Pets | 375 | Média |

### Calendário Comercial — Sazonalidade

O pequeno lojista do bairro organiza seu planejamento financeiro anual em torno destas datas:

| Data | Impacto | Setor mais beneficiado |
|---|---|---|
| **Dia das Mães** | ~80% dos consumidores planejam comprar | Vestuário, casa, beleza |
| **Páscoa** | +14 a 15% nas vendas de alimentos | Alimentação, confeitaria |
| **Dia dos Namorados** | Pico em gastronomia e lazer | Restaurantes, bares |
| **Natal** | Principal ciclo anual | Todos os setores |
| **Dia das Crianças / Pais** | Ciclos secundários relevantes | Vestuário, brinquedos, serviços |

### Decisões de Produto Derivadas desta Pesquisa

| Decisão | Justificativa | Status |
|---|---|---|
| **Bottom Nav com Comércios como tela principal** | Comércios são o core product e o módulo de maior valor para o bairro | ✅ Implementado (Sessão 4) |
| **Campanhas Sociais na Bottom Nav** | Forte presença comunitária e senso de solidariedade no perfil socioeconômico do bairro | ✅ Implementado (Sessão 4) |
| **Categorias prioritárias para captação de comerciantes** | Alimentação, Beleza e Auto dominam o bairro — focar o esforço comercial nestas categorias no lançamento | ⏳ Planejar com equipe |
| **Módulo "Datas Especiais" no AdminPanel** | O calendário sazonal é o principal motor de marketing do MEI. A equipe pré-agenda campanhas temáticas (Dia das Mães, Páscoa etc.) notificando comerciantes com antecedência | ⏳ A implementar (Fase 4/5) |
| **Conteúdo inicial do Jornal focado em lazer noturno** | Bares, eventos e música local são a âncora de engajamento orgânico — primeiras notícias devem cobrir este universo | ⏳ Estratégia editorial |

---

## 8. DECISÕES TÉCNICAS ABERTAS

| Decisão | Opções | Prazo |
|---|---|---|
| **Gateway de pagamento** | Mercado Pago (recomendado BR) vs Stripe | Antes da Fase 5 |
| **Push notifications** | Supabase Realtime vs Firebase FCM via PWA | Fase 7 |
| **Analytics de uso** | Supabase Analytics vs Plausible vs GA4 | Fase 7 |
| **Monitoramento de erros** | Sentry (recomendado) | Fase 7 |
| **CDN para imagens** | Supabase Storage nativo vs Cloudflare Images | Fase 1 |

---

## 8. PENDÊNCIAS TÉCNICAS IMEDIATAS

> Ordenadas por impacto no próximo sprint (22/03/2026).

| # | Tarefa | Impacto | Onde |
|---|---|---|---|
| 1 | **Testar ApprovalsTab com dados reais** — cadastrar comércio → aprovar admin → verificar listagem | Validação end-to-end do fluxo principal | `features/admin/tabs/ApprovalsTab.jsx` + Supabase Dashboard |
| 2 | **Verificar WhatsApp no AdDetailModal** — confirmar que o link `wa.me` abre corretamente | Funcionalidade core do Classificados | `features/ads/AdDetailModal.jsx` |
| 3 | **Conectar métricas reais no MerchantPanel DashboardTab** — views, cliques, favoritos via statsService | Valor percebido pelo comerciante | `features/merchants/merchant-panel/tabs/DashboardTab.jsx` + `statsService.js` |
| 4 | **Remover policy duplicada em `profiles`** | Limpeza técnica — 2 SELECT policies | Supabase SQL Editor |
| 5 | **Remover credenciais Firebase legacy do `.env.local`** | Segurança | `.env.local` linhas 8-15 |
| 6 | **Configurar cron job `expire_campaigns`** | Campanhas expiradas ficam ativas | Supabase Dashboard → pg_cron |
| 7 | **Refatorar arquivos legados acima de 200 linhas** | Regra CLAUDE.md | `NewsFeed.jsx`, `DonationsView.jsx`, `ResidentPanel.jsx`, `SidebarMenu.jsx` |

---

## 9. CHECKLIST DE LANÇAMENTO (Maio/2026)

```
INFRAESTRUTURA
✅ Variáveis de ambiente preenchidas e testadas
✅ Schema SQL executado e testado
✅ Google OAuth funcionando
✅ Trigger de criação de perfil funcionando
✅ Storage buckets criados e testados (5 buckets)
✅ Cron job expire_ads configurado (pg_cron, diário às 3h UTC)
□  Magic Link (e-mail) testado
□  expire_campaigns configurado
□  Deploy no Vercel com env vars de produção

MÓDULOS — FUNCIONALIDADE CORE
✅ Feed principal carregando com dados reais (comércios)
✅ Upload de imagem do comércio funcionando
✅ Upload de imagem de anúncio funcionando
✅ Upload de avatar do perfil funcionando
✅ Classificados — criar anúncio com expiração em 30 dias
✅ Classificados — editar e excluir anúncio pelo painel do comerciante
✅ Feed de notícias com dados reais — badges Oficial/Morador
✅ Caixa de Sugestões — votação funcional (RPC ativa)
□  Cadastro de comerciante end-to-end testado ponta-a-ponta (signup → aprovação → listagem)
□  Aprovação pelo admin testada com dados reais
□  Ação Social / Campanhas funcionando
□  Utilidade Pública com conteúdo real inserido

MONETIZAÇÃO
□  Gateway de pagamento definido e integrado
□  Fluxo de upgrade/downgrade de plano testado

QUALIDADE
□  PWA instalável no Android e iOS
□  Offline: feed disponível sem internet
□  Share nativo funcionando (WhatsApp)
□  Performance: LCP < 2.5s validado
□  Beta-testers validaram a UX
□  SEO básico configurado (meta tags, og:image)

OPERAÇÃO
□  Domínio customizado configurado
□  Conteúdo inicial inserido em todos os módulos
□  Equipe treinada para operar o AdminPanel
□  Planos configurados (Básico, Profissional, Premium)
```

---

## 10. VARIÁVEIS DE AMBIENTE

### `.env.local` (desenvolvimento)

```env
# Supabase — PREENCHIDO ✅
VITE_SUPABASE_URL=https://jfjavgjeylahhcfcixtv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...  # NÃO commitar

# Algolia — PENDENTE
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=

# Firebase LEGACY — usar apenas no chatbot-genkit/, remover do .env.local frontend
# FIREBASE_API_KEY=...  (linhas 8-15 do .env.local atual — remover)
```

---

## 11. REFERÊNCIAS

| Documento | Conteúdo |
|---|---|
| [01-visao-geral-do-produto.md](01-visao-geral-do-produto.md) | O que é, problema, proposta de valor, métricas |
| [02-modulos-e-funcionalidades.md](02-modulos-e-funcionalidades.md) | Todos os 9 módulos detalhados |
| [03-modelo-de-planos-e-negocios.md](03-modelo-de-planos-e-negocios.md) | Planos, preços, funil de upgrade, projeção financeira |
| [04-estrategia-go-to-market.md](04-estrategia-go-to-market.md) | Pré-lançamento, canais, metas, expansão |
| [05-experiencia-do-usuario-ux.md](05-experiencia-do-usuario-ux.md) | Personas, jornadas, componentes, performance |
| [06-roadmap-tecnico.md](06-roadmap-tecnico.md) | Estado das fases, decisões técnicas, checklist |
| [07-user-stories.md](07-user-stories.md) | 80 user stories com critérios de aceite (US-001 a US-080) |
| [08-schema-sql.md](08-schema-sql.md) | Schema completo — 15 tabelas, RLS, RPCs, storage, cron |
| [09-migracao-sql.md](09-migracao-sql.md) | Script incremental — executado em 16/03/2026 |
| [CLAUDE.md](../CLAUDE.md) | Regras de arquitetura, stack obrigatória, UX inegociável |

---

*Documento criado em 16/03/2026. Última atualização: 22/03/2026 (v2.0). Atualizar a cada sessão de trabalho relevante.*
