# Tem No Bairro — Guia de Execução do Projeto

> **Versão:** 1.2
> **Data de criação:** Março/2026
> **Última atualização:** 16/03/2026
> **Lançamento previsto:** Maio/2026
> **Status geral:** 🟡 Em andamento — Fase 0 concluída, Fase 1 em andamento

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
| Estado Global | Zustand 5 | ✅ authStore implementado |
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
| Storage buckets (imagens) | 🟠 Alto | Blocos 19 do schema — 5 buckets: merchant-images, ad-images, news-images, campaign-images, avatars |
| Cron jobs (`expire_ads`, `expire_campaigns`) | 🟡 Médio | Bloco 20 do schema — requer pg_cron habilitado |
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

## 5. ESTADO ATUAL DO FRONTEND (16/03/2026)

### Arquivos de código (65 arquivos em `src/`)

| Área | Arquivos | Status |
|---|---|---|
| Entry point | `main.jsx` | ✅ Estável |
| App shell | `App.jsx`, `app/AppHeader.jsx` | ✅ Funcional |
| Auth | `stores/authStore.js`, `context/AuthContext.jsx` | ✅ Completo |
| Lib | `lib/supabaseClient.js` | ✅ Completo |
| Serviços | `services/` (6 arquivos) | ✅ Criados (alguns a validar em produção) |
| Admin | `features/admin/` (AdminPanel + 8 tabs) | ⚠️ AuditTab usa mock |
| Merchants | `features/merchants/` (3 arquivos) | ✅ Funcional com dados reais |
| Outros views | `NewsFeed.jsx`, `AdsView.jsx`, etc. | ⚠️ Fallback para mock se Supabase vazio |
| Painéis | `panels/MerchantPanel.jsx`, `ResidentPanel.jsx` | ⚠️ Base criada, a conectar ao backend |
| Componentes | `components/` (ChatbotWidget, NotificationBell, etc.) | ⚠️ A validar |
| PWA | `vite.config.js` | ✅ SW gerado no build |

### Build atual

```
vendor:   11 KB  │  ui/lucide: 18 KB
supabase: 172 KB │  index:     355 KB
Total:    ~625 KB (gzip ~165 KB)
PWA:      12 entradas pré-cacheadas ✅
```

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

### 🔄 FASE 1 — Módulo de Comércios Completo
**Status:** INICIADA | **Meta:** Semanas 1–2 (até ~30/03/2026)

**Objetivo:** Comerciante consegue se cadastrar, ter perfil aprovado e aparecer no app com dados reais.

| Tarefa | Status | Prioridade |
|---|---|---|
| MerchantsView — listagem com filtro por categoria | ✅ Feito | — |
| MerchantCard — card com botão WhatsApp | ✅ Feito | — |
| PremiumCarousel + ProCarousel | ✅ Feito | — |
| MerchantDetailModal — página de detalhe | ✅ Feito | — |
| MerchantPanel — painel base | ✅ Base feita | — |
| **Verificar fluxo de cadastro de novo comércio** | ⏳ A verificar | 🔴 Próximo |
| **Upload de imagem (Supabase Storage)** | ⏳ A implementar | 🔴 Crítico |
| **Criar Storage Buckets no Supabase** | ⏳ A executar | 🔴 Crítico |
| Aprovação pelo AdminPanel (ApprovalsTab) | ⏳ A testar com dados reais | 🟠 Alto |
| Avaliação de comércio (nota + comentário) | ⏳ A implementar | 🟠 Alto |
| Share nativo (navigator.share → WhatsApp) | ⏳ A verificar | 🟠 Alto |
| Conectar MerchantPanel ao statsService | ⏳ A implementar | 🟡 Médio |

---

### ⏳ FASE 2 — Jornal Local
**Status:** PENDENTE | **Meta:** Semanas 2–3

| Tarefa | Status |
|---|---|
| NewsFeed — lista de notícias | ✅ Existe (com mock fallback) |
| NewsDetailModal — detalhe da notícia | ✅ Existe |
| Publicação de notícia pela equipe (AdminPanel NewsTab) | ✅ Existe (a testar com dados reais) |
| Submissão de notícia por morador (formulário + termos) | ⏳ A implementar |
| Badge "Oficial" vs "Morador" | ⏳ A implementar |
| Curtir e comentar notícia | ⏳ A verificar |
| Mover para `features/news/` | ⏳ Refactoring |

---

### ⏳ FASE 3 — Classificados
**Status:** PENDENTE | **Meta:** Semana 3

| Tarefa | Status |
|---|---|
| AdsView — lista de anúncios | ✅ Existe |
| AdDetailModal | ✅ Existe |
| CreateAdWizard — criação de anúncio | ✅ Existe (a testar com dados reais) |
| Contato via WhatsApp do anúncio | ⏳ A verificar |
| Expiração automática 30 dias (cron Supabase) | ⏳ Função `expire_ads` criada — falta ativar cron |
| Upload de fotos do anúncio (Supabase Storage) | ⏳ Depende dos buckets da Fase 1 |
| Mover para `features/ads/` | ⏳ Refactoring |

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
| Criar Zustand stores para merchants e UI | 🟡 Médio |
| Refatorar componentes legados `src/` para `features/` | 🟡 Médio |
| AuditTab com dados reais (tabela `audit_logs`) | 🟡 Médio |
| Chatbot Genkit integrado ao app | 🟡 Médio |
| Tabela `chat_history` para ChatbotWidget | 🟡 Médio |
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

> Ordenadas por impacto no próximo sprint (Fase 1).

| # | Tarefa | Impacto | Onde |
|---|---|---|---|
| 1 | **Criar Storage Buckets** no Supabase (Bloco 19 do schema) | Upload de imagens impossível sem isso | Supabase Dashboard → Storage |
| 2 | **Verificar fluxo de cadastro de comércio** — `MerchantPanel.jsx` | Core da Fase 1 | `src/panels/MerchantPanel.jsx` |
| 3 | **Implementar upload de imagem** no cadastro de comércio | Essencial para o perfil | `merchantService.js` + `MerchantPanel.jsx` |
| 4 | **Testar ApprovalsTab** com dados reais | Admin não consegue aprovar cadastros | `src/features/admin/tabs/ApprovalsTab.jsx` |
| 5 | **Ativar cron job** `expire_ads` (pg_cron no Supabase) | Anúncios não expiram automaticamente | Supabase Dashboard → Database → Extensions |
| 6 | Remover policy duplicada em `profiles` | Limpeza técnica | Supabase SQL Editor |
| 7 | Remover credenciais Firebase legacy do `.env.local` | Segurança / limpeza | `.env.local` linhas 8-15 |

---

## 9. CHECKLIST DE LANÇAMENTO (Maio/2026)

```
INFRAESTRUTURA
✅ Variáveis de ambiente preenchidas e testadas
✅ Schema SQL executado e testado
✅ Google OAuth funcionando
✅ Trigger de criação de perfil funcionando
□  Magic Link (e-mail) testado
□  Storage buckets criados e testados
□  Cron jobs configurados (expire_ads, expire_campaigns)
□  Deploy no Vercel com env vars de produção

MÓDULOS — FUNCIONALIDADE CORE
□  Cadastro de comerciante end-to-end funcionando
□  Upload de imagem do comércio funcionando
□  Aprovação pelo admin funcionando
□  Feed principal carregando com dados reais (comércios, notícias)
□  Classificados funcionando (criar, listar, contato)
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

*Documento criado em 16/03/2026. Atualizar a cada sessão de trabalho relevante.*
