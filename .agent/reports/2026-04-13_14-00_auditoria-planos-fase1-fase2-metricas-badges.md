# Relatório de Sessão — 2026-04-13

**Agente:** Claude Sonnet 4.6 + Antigravity Fast Mode + Antigravity Deep Think  
**Data:** 2026-04-13  
**Duração estimada:** ~3h  
**Status:** ✅ Concluída

---

## Objetivo da Sessão

1. Validar infraestrutura Supabase (migrations pendentes do backlog)
2. Auditoria completa do módulo de Planos/Preços e painéis de gestão de comerciantes
3. Executar Fase 1: corrigir 5 bugs críticos identificados na auditoria
4. Executar Fase 2A: CTAs do PlansView funcionais + enforce de `photoLimit` por plano
5. Executar Fase 2B: badges visuais de destaque e info de limite de categoria

---

## Validação de Infraestrutura

Todas as 7 migrations confirmadas aplicadas no Supabase via screenshots:
- `fix-user-consents-schema-v1.sql` ✅
- `add-profile-merchant-fields-v1.sql` ✅
- Sprint Utilidade Pública (5 migrations) ✅

Itens do backlog anterior **concluídos:**
- Métricas reais conectadas ao `DashboardTab` via `statsService`
- Link WhatsApp no `AdDetailModal` corrigido (brand name)

---

## Fase 1 — Correções de Bugs

### ✅ 1. `app/src/services/statsService.js`
- `trackEvent` não gravava o campo `neighborhood` → eventos retornavam 0 nas queries filtradas
- Fix: adicionado `neighborhood: import.meta.env.VITE_NEIGHBORHOOD` no insert

### ✅ 2. `app/src/features/merchants/merchant-panel/tabs/DashboardTab.jsx`
- Substituídos campos estáticos `merchant?.views` e `merchant?.clicks` por `stats.views` e `stats.contacts` via `getMerchantStats`
- `useEffect` adicionado para fetch ao montar

### ✅ 3. `app/src/features/merchants/merchant-panel/tabs/ReportsTab.jsx`
- Mesma correção: `useState(null)` + `useEffect` + `getMerchantStats`
- Métricas exibidas em tempo real para plano Pro

### ✅ 4. `app/src/features/merchants/MerchantTabs.jsx`
- `minPlan` de Relatórios corrigido: `'premium'` → `'pro'`
- Função `hasAccess` refatorada de comparações literais para `hasPlanAccess(plan, tab.minPlan)`
- Import `hasPlanAccess` adicionado de `../../constants/plans`

### ✅ 5. `app/src/constants/plans.js`
- `pro.hasReports` corrigido: `false` → `true`

### ✅ 6. `app/src/features/merchants/MerchantDetailModal.jsx`
- Mensagem WhatsApp: removido hardcode `"(Parque Interlagos, SJC)"` — plataforma é multi-bairro

### ✅ 7. `app/src/features/merchants/UpgradeModal.jsx`
- `currentUser.uid` → `currentUser.id || currentUser.uid` (legacy Firebase fallback)

### ✅ 8. `app/src/features/ads/AdDetailModal.jsx`
- Mensagem WhatsApp: `"no App Interlagos!"` → `"no Tem No Bairro!"`

---

## Fase 2A — PlansView CTAs + photoLimit

### ✅ `app/src/features/plans/PlansView.jsx`
- `useAuth` importado; prop `onNavigate` adicionada
- `handlePaidCta`: comerciante → `merchant-panel`; não-comerciante → `onRegisterFree`
- Todos os 3 botões de planos pagos conectados ao handler

### ✅ `app/src/app/Router.jsx`
- `onNavigate={setCurrentView}` passado ao `PlansView`

### ✅ `app/src/features/merchants/MerchantTabs.jsx`
- `photoLimit = PLANS_CONFIG[plan]?.photoLimit ?? 1` calculado e propagado ao `AdsTab`

### ✅ `app/src/features/merchants/merchant-panel/tabs/AdsTab.jsx`
- Default `photoLimit = 1`; guard `Math.max(1, photoLimit)`; toast dinâmico com o limite real

### ✅ `app/src/features/ads/CreateAdWizard.jsx`
- Default `photoLimit = 7` (moradores C2C); guard e toast atualizados

---

## Fase 2B — Badges Visuais

### ✅ `app/src/features/merchants/MerchantsView.jsx`
- `Star` importado de `lucide-react`
- Badge `⭐ Destaque` exibido em cards de planos `pro` e `premium`

### ✅ `app/src/features/merchants/merchant-panel/tabs/SettingsTab.jsx`
- `PLANS_CONFIG` importado; `categoryLimit` calculado via `planConfig`
- Texto informativo dinâmico abaixo do `<select>` de Categoria:
  - `>= 999` → "Categorias ilimitadas no seu plano"
  - Numérico → "Seu plano inclui até N categoria(s)"

---

## Erros Identificados e Corrigidos

| Erro | Causa | Fix |
|---|---|---|
| Stats sempre retornavam 0 | `trackEvent` não gravava `neighborhood` | Adicionado campo no insert |
| Plano Pro bloqueava Relatórios | `minPlan: 'premium'` errado + `hasAccess` usava comparação literal | Corrigir `minPlan` + refatorar com `hasPlanAccess` |
| CTAs do PlansView não faziam nada | `onClick` não declarado | `handlePaidCta` com roteamento inteligente |
| Limite de fotos hardcoded (7) | Sem integração com `PLANS_CONFIG` | `photoLimit` propagado desde `plans.js` → `MerchantTabs` → `AdsTab` |
| Mensagens WhatsApp hardcodadas para Interlagos | Copy específico do bairro em componente compartilhado | Texto genérico da plataforma |

---

## Build

```
✓ built — zero erros (exit code 0)
⚠ Aviso (não-bloqueante): chunk index.js > 500 kB (code-split futuro)
```

---

## Pendências para Próxima Sessão

- [ ] **Fase 3 (futuro):** Integração gateway de pagamento — atualmente upgrades mudam plano diretamente sem billing
- [ ] `CreateAdWizard.jsx:91` — `user.uid` sem fallback `user.id || user.uid` (pré-existente, fora de escopo desta sessão)
- [ ] Code-split do bundle principal (chunk > 500 kB)
- [ ] Ativar bairro Santa Júlia (checklist em `app/bairros/santa-julia/README.md`)

---

## Arquivos Modificados Nesta Sessão

| Arquivo | Tipo |
|---|---|
| `app/src/services/statsService.js` | Modificado |
| `app/src/features/merchants/merchant-panel/tabs/DashboardTab.jsx` | Modificado |
| `app/src/features/merchants/merchant-panel/tabs/ReportsTab.jsx` | Modificado |
| `app/src/features/merchants/merchant-panel/tabs/AdsTab.jsx` | Modificado |
| `app/src/features/merchants/merchant-panel/tabs/SettingsTab.jsx` | Modificado |
| `app/src/features/merchants/MerchantTabs.jsx` | Modificado |
| `app/src/features/merchants/MerchantDetailModal.jsx` | Modificado |
| `app/src/features/merchants/MerchantsView.jsx` | Modificado |
| `app/src/features/merchants/UpgradeModal.jsx` | Modificado |
| `app/src/features/plans/PlansView.jsx` | Modificado |
| `app/src/features/ads/AdDetailModal.jsx` | Modificado |
| `app/src/features/ads/CreateAdWizard.jsx` | Modificado |
| `app/src/constants/plans.js` | Modificado |
| `app/src/app/Router.jsx` | Modificado |
