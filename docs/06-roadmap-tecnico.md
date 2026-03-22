# Tem No Bairro — Roadmap Técnico

> **Versão:** 2.0
> **Data:** 22/03/2026
> **Lançamento:** Maio/2026

---

## 1. ESTADO ATUAL DA PLATAFORMA

| Componente | Status |
|---|---|
| React 19 + Vite 7 + Tailwind 3 | ✅ Ativo |
| Supabase (DB + Auth) | ✅ Conectado, schema completo, RLS configurado |
| Zustand (authStore + uiStore + merchantStore) | ✅ 3 stores implementados com seletores |
| PWA + Workbox | ✅ Build gerando SW + 12 entradas pré-cacheadas |
| AdminPanel (8 tabs) | ✅ In-page, sem alert() |
| MerchantsView + Carrosséis | ✅ Implementado |
| Build sem erros | ✅ |
| Schema SQL no Supabase | ✅ Executado (M1–M7) |
| Variáveis de ambiente (.env.local) | ✅ Preenchido e funcionando |
| Google OAuth configurado | ✅ Testado (primeiro login: 16/03/2026) |
| RLS (Row Level Security) | ✅ Configurado em todas as tabelas |
| Jornal Local conectado ao backend | ✅ NewsFeed, NewsDetailModal, badges |
| Classificados CRUD completo | ✅ criar + editar + excluir anúncio |
| Zero alert() no codebase | ✅ Auditoria P3 concluída |
| Router.jsx extraído de App.jsx | ✅ App.jsx < 200 linhas |
| AuditTab — dados reais | ⏳ Usando mock |
| Algolia (busca) | ⏳ Instalado, não integrado |
| Métricas reais no DashboardTab | ⏳ Conectar statsService |

---

## 2. ROADMAP POR FASE

### FASE 0 — Infraestrutura Base (imediato)

**Objetivo:** Conectar o app ao Supabase real e ter o sistema funcionando end-to-end.

| Tarefa | Responsável | Prioridade |
|---|---|---|
| Criar projeto no Supabase Dashboard | Dev | 🔴 Crítico |
| Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY | Dev | 🔴 Crítico |
| Rodar SQL schema completo (tabelas + RLS) | Dev | 🔴 Crítico |
| Habilitar Google OAuth no Supabase Auth | Dev | 🔴 Crítico |
| Criar RPCs: increment_merchant_view, increment_merchant_contact | Dev | 🟠 Alto |
| Configurar RLS nas tabelas principais | Dev | 🟠 Alto |
| Testar fluxo completo de login (Google + Magic Link) | Dev | 🟠 Alto |
| Deploy no Vercel com variáveis de ambiente | Dev | 🟠 Alto |

---

### FASE 1 — Módulo de Comércios Completo (Semanas 1–2)

**Objetivo:** Comerciante consegue se cadastrar, ter perfil aprovado e aparecer no app.

| Tarefa | Status |
|---|---|
| MerchantsView — listagem com filtro por categoria | ✅ Feito |
| MerchantCard — card com botão WhatsApp | ✅ Feito |
| PremiumCarousel + ProCarousel | ✅ Feito |
| MerchantDetailModal — página de detalhe | ✅ Feito |
| MerchantPanel — painel do comerciante | ✅ Base feita |
| Fluxo de cadastro de novo comércio | ⏳ Verificar completude |
| Upload de imagem do comércio (Supabase Storage) | ⏳ A implementar |
| Aprovação pelo AdminPanel (ApprovalsTab) | ⏳ A testar com dados reais |
| Avaliação de comércio (nota + comentário) | ⏳ A implementar |
| Share nativo (navigator.share) | ⏳ A verificar |

---

### FASE 2 — Jornal Local (Semana 2–3)

| Tarefa | Status |
|---|---|
| NewsFeed — lista de notícias | ✅ Existe (src/NewsFeed.jsx) |
| NewsDetailModal — detalhe da notícia | ✅ Existe |
| Publicação de notícia pela equipe (AdminPanel NewsTab) | ✅ Existe |
| Submissão de notícia por morador (com formulário + termos) | ⏳ A implementar |
| Badge "Oficial" vs "Morador" | ⏳ A implementar |
| Curtir e comentar notícia | ⏳ A verificar |
| Mover para features/news/ | ⏳ Refactoring |

---

### FASE 3 — Classificados (Semana 3)

| Tarefa | Status |
|---|---|
| AdsView — lista de anúncios | ✅ Existe (src/AdsView.jsx) |
| AdDetailModal | ✅ Existe |
| CreateAdWizard — criação de anúncio | ✅ Existe |
| Contato via WhatsApp do anúncio | ⏳ A verificar |
| Expiração automática (30 dias) | ⏳ A implementar (cron Supabase) |
| Mover para features/ads/ | ⏳ Refactoring |

---

### FASE 4 — Ação Social, Utilidade Pública e História (Semana 3–4)

| Tarefa | Status |
|---|---|
| SuggestionsView → renomear/adaptar para Ação Social | ✅ Base existe |
| DonationsView → adaptar para Campanhas | ✅ Base existe |
| HistoryView — História do Bairro | ✅ Base existe |
| UtilityView — Utilidade Pública | ✅ Existe |
| Formulário de solicitação de campanha | ⏳ A implementar |
| Fluxo de aprovação de campanha (AdminPanel) | ⏳ A implementar |
| Preenchimento de conteúdo de Utilidade Pública | ⏳ Conteúdo real a inserir |

---

### FASE 5 — Planos e Monetização (Semana 4)

| Tarefa | Status |
|---|---|
| PlansView — página de planos | ✅ Existe |
| PlanCard — componente de card de plano | ✅ Existe |
| PlanGate — gate de funcionalidades por plano | ✅ Existe |
| useMerchantPlan — hook de plano | ✅ Existe |
| Integração com gateway de pagamento (Stripe ou MP) | ⏳ A definir e implementar |
| Fluxo de upgrade de plano pelo app | ⏳ A implementar |
| Downgrade automático por inadimplência | ⏳ A implementar (webhook) |
| UpgradeModal — modal de convite ao upgrade | ✅ Existe |

---

### FASE 6 — Painel do Comerciante Completo (Semana 4–5)

| Tarefa | Status |
|---|---|
| MerchantPanel — dashboard básico | ✅ Base existe |
| Métricas: views, cliques WhatsApp, favoritos | ⏳ Conectar ao statsService |
| Publicação de campanha/oferta pelo painel | ⏳ A implementar |
| Painel Profissional — histórico + calendário | ⏳ A implementar |
| Painel Premium — relatórios + exportação | ⏳ A implementar |
| ResidentPanel — painel do morador | ✅ Base existe |

---

### FASE 7 — Qualidade, Performance e Lançamento (Semana 5–6)

| Tarefa | Prioridade |
|---|---|
| Testes de usabilidade com beta-testers | 🔴 Crítico |
| Verificar LCP < 2.5s em conexão lenta | 🔴 Crítico |
| Testar PWA offline (cache funcional) | 🔴 Crítico |
| Testar share nativo no iOS e Android | 🔴 Crítico |
| Configurar domínio customizado | 🟠 Alto |
| Configurar push notifications (PWA) | 🟠 Alto |
| SEO básico (meta tags, og:image por bairro) | 🟠 Alto |
| Analytics de uso (Supabase ou Plausible) | 🟡 Médio |
| Monitoramento de erros (Sentry) | 🟡 Médio |

---

### FASE 8 — Pós-lançamento (Meses 2–3)

| Tarefa | Prioridade |
|---|---|
| Integrar Algolia para busca em tempo real | 🟡 Médio |
| ~~Criar Zustand stores para merchants e UI~~ | ✅ Concluído (22/03/2026) |
| Refatorar componentes legados da raiz src/ para features/ | 🟡 Médio |
| AuditTab com dados reais (tabela audit_logs) | 🟡 Médio |
| Chatbot Genkit (chatbot do bairro) | 🟡 Médio |
| Tabela chat_history para ChatbotWidget | 🟡 Médio |
| Avaliação de comércio (nota + comentário) | 🟡 Médio |
| Share nativo WhatsApp nos cards | 🟡 Médio |
| Plano Gold — módulo de gestão assistida | 🔵 Futuro |
| Multi-tenant por bairro | 🔵 Futuro |
| Publicação nas stores (App Store / Play Store) | 🔵 Futuro |

---

## 3. GATEWAY DE PAGAMENTO — DECISÃO PENDENTE

**Opções a avaliar:**

| Gateway | Prós | Contras |
|---|---|---|
| **Mercado Pago** | Popular no Brasil, fácil integração, checkout transparente | Taxas mais altas |
| **Stripe** | API excelente, recorrência nativa, documentação superior | Mais complexo para o usuário final |
| **Pagar.me** | Foco no Brasil, bom suporte a assinaturas | Menos conhecido |
| **Asaas** | Especializado em cobranças recorrentes/SaaS | Menos documentação |

**Recomendação inicial:** Mercado Pago para o lançamento (familiaridade do usuário BR) + Stripe para fase de crescimento.

---

## 4. DECISÕES TÉCNICAS ABERTAS

| Decisão | Opções | Prazo |
|---|---|---|
| Gateway de pagamento | Mercado Pago vs Stripe | Antes da Fase 5 |
| Push notifications | Supabase Realtime vs Firebase FCM via PWA | Fase 7 |
| Analytics | Supabase Analytics vs Plausible vs GA4 | Fase 7 |
| Monitoramento de erros | Sentry (recomendado) | Fase 7 |
| CDN para imagens | Supabase Storage + CDN ou Cloudflare Images | Fase 1 |

---

## 5. BANCO DE DADOS — PRÓXIMOS PASSOS

### SQL a executar no Supabase Dashboard

```sql
-- Ver schema completo em CLAUDE.md
-- Tabelas prioritárias para Fase 0:
-- profiles, merchants, news, ads, campaigns
-- click_events, favorites, notifications
-- suggestions, tickets

-- RPCs necessárias:
CREATE OR REPLACE FUNCTION increment_merchant_view(merchant_id uuid)
RETURNS void AS $$
  INSERT INTO click_events (entity_id, entity_type, created_at)
  VALUES (merchant_id, 'merchant_view', now());
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION increment_merchant_contact(merchant_id uuid)
RETURNS void AS $$
  INSERT INTO click_events (entity_id, entity_type, created_at)
  VALUES (merchant_id, 'merchant_contact', now());
$$ LANGUAGE sql;
```

---

## 6. CHECKLIST DE LANÇAMENTO

```
□ Variáveis de ambiente preenchidas e testadas em produção
□ Schema SQL executado e testado
□ Google OAuth funcionando
□ Login por Magic Link funcionando
□ Cadastro de comerciante end-to-end funcionando
□ Aprovação de comerciante pelo admin funcionando
□ Feed principal carregando (home, comércios, notícias)
□ Classificados funcionando (criar, listar, contato)
□ PWA instalável no Android e iOS
□ Offline: feed disponível sem internet
□ Share nativo funcionando (WhatsApp)
□ Performance: LCP < 2.5s validado
□ Domínio customizado configurado
□ Conteúdo inicial inserido em todos os módulos
□ Beta-testers validaram a UX
□ Planos configurados (Básico, Profissional, Premium)
□ Gateway de pagamento testado end-to-end
```

---

*Fim do conjunto de documentação base.*
*Índice completo: [00-indice.md](00-indice.md)*
