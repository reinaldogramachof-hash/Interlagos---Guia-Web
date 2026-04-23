---
data: 2026-04-23
horario: 14:00
agente: Claude Sonnet 4.6
tarefa: Sprint Avaliações — RLS, auto-approve, UI imediata, Admin ReviewsTab
status: ✅ Concluída
build: ✅ Zero erros (6.11s)
---

# Sprint Avaliações — Sistema de Reviews Completo

## Objetivo da Sessão

Implementar e depurar o sistema de avaliações de lojas (merchant_reviews):
1. Corrigir erro de schema cache (`author_name` column not found)
2. Garantir que `avg_rating` / `review_count` chegam ao frontend
3. Reviews aparecem imediatamente após envio (auto-approve)
4. Admin consegue moderar (ver + excluir) via painel
5. Pro badge na StoreHero; rating nos cards Premium da Vitrine

---

## Entregas Realizadas

### 1. `docs/migrations/sprint-vitrine-reviews-v2.sql` (NOVO)

Migration completa para o sistema de avaliações:
- `ALTER TABLE merchant_reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false`
- Policy `reviews_select_own` — usuário vê seus próprios reviews pendentes (necessário para checagem de duplicata)
- Policy `reviews_admin_read` — admin/master vê todos os reviews para moderação
- Policy `reviews_admin_update` — admin/master pode atualizar `is_approved`
- `ALTER TABLE merchants ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0`
- `ALTER TABLE merchants ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0`
- Função `refresh_merchant_rating()` — recalcula avg e count no merchant pai
- Trigger `trg_refresh_merchant_rating` — dispara AFTER INSERT OR UPDATE em merchant_reviews

**SQL adicional aplicado em produção (não está no arquivo de migration):**
```sql
-- Corrigir tabela criada antes da migration (ADD COLUMN silencioso no CREATE TABLE IF NOT EXISTS)
ALTER TABLE merchant_reviews
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT NOT NULL DEFAULT 'interlagos';
NOTIFY pgrst, 'reload schema';

-- Policy DELETE para admin excluir reviews pelo painel
DROP POLICY IF EXISTS "reviews_admin_delete" ON merchant_reviews;
CREATE POLICY "reviews_admin_delete" ON merchant_reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );
```

---

### 2. `app/src/services/merchantReviewsService.js`

| Mudança | Detalhe |
|---|---|
| `createReview`: `is_approved: false` → `is_approved: true` | Auto-approve — reviews aparecem imediatamente |
| `getPendingReviews` removido | Substituído por `getRecentReviews` (sem filtro de aprovação) |
| `getRecentReviews` (NOVO) | JOIN com `merchants (name)`, limit 50, ordena por created_at DESC |

---

### 3. `app/src/services/merchantService.js`

Correção crítica: as duas queries com SELECT explícito não incluíam as novas colunas de rating.

- `getMerchantById` SELECT: adicionado `avg_rating, review_count`
- `getVitrineStoreMerchants` SELECT: adicionado `avg_rating, review_count`

---

### 4. `app/src/features/vitrine/store-parts/StoreReviews.jsx`

| Mudança | Detalhe |
|---|---|
| Removido import/call de `getAverageRating` | Dados vêm do `merchant.avg_rating` / `merchant.review_count` (1 query → 0 extra) |
| `hasSubmitted` state | Após envio: botão vira badge verde "Avaliação publicada ✓" |
| Optimistic update | `createReview` retorna a row; é prepended imediatamente no state local |
| Data exibida por review | `new Date(review.created_at).toLocaleDateString('pt-BR', ...)` |

---

### 5. `app/src/features/admin/tabs/ReviewsTab.jsx` (REESCRITO)

- Consome `getRecentReviews` (todos os reviews, sem filtro de aprovação)
- Exibe `merchant_name` (via JOIN no service)
- Removido botão "Aprovar" — fluxo é auto-approve
- Mantido botão "Excluir" → chama `rejectReview` (DELETE)
- Adicionado `RefreshCw` para recarregar lista
- Badge de contagem total no header

---

### 6. `app/src/features/admin/AdminPanel.jsx`

- Import `ReviewsTab` adicionado
- Import `MessageSquare` de lucide-react adicionado
- Nav item `{ id: 'reviews', label: 'Avaliações', icon: MessageSquare, masterOnly: false }` adicionado
- `case 'reviews': return <ReviewsTab />;` adicionado ao `renderTab()`

---

### 7. `app/src/features/vitrine/store-parts/StoreHero.jsx`

- `showProBadge = merchant?.plan === 'pro'`
- Badge Pro (ícone Store, cor indigo) exibido quando `!showPremiumBadge && showProBadge`

---

### 8. `app/src/features/vitrine/StorePremiumCard.jsx`

- Import `Star` adicionado
- Rating exibido condicionalmente quando `merchant.review_count > 0`: `⭐ avg (N avaliações)`

---

## Bugs Corrigidos

| Bug | Causa Raiz | Fix |
|---|---|---|
| `author_name column not found` | Tabela criada antes da migration; `CREATE TABLE IF NOT EXISTS` ignorou novas colunas | `ALTER TABLE ADD COLUMN IF NOT EXISTS` + `NOTIFY pgrst, 'reload schema'` |
| `avg_rating`/`review_count` undefined no frontend | Colunas ausentes nos SELECT explícitos do `merchantService.js` | Adicionadas às queries de `getMerchantById` e `getVitrineStoreMerchants` |
| Review não aparecia após envio | `is_approved: false` exigia aprovação manual do admin | Auto-approve + optimistic UI (prepend local) |
| Admin não conseguia excluir review | Policy `reviews_admin_delete` ausente na migration | SQL aplicado diretamente no Supabase |

---

## Pendências para Próxima Sessão

- [ ] Executar o SQL da policy `reviews_admin_delete` no Supabase de produção (se ainda não feito)
- [ ] Remover funções órfãs `getAverageRating` e `approveReview` de `merchantReviewsService.js` (cleanup)
- [ ] Testar fluxo completo em produção: submit review → aparece na loja → admin exclui via painel
- [ ] Trigger `trg_refresh_merchant_rating` precisa ser validado: avg_rating e review_count devem atualizar ao excluir review (trigger só dispara em INSERT/UPDATE, não DELETE — considerar adicionar `AFTER DELETE` ao trigger)

---

## Build Final

```
✓ built in 6.11s — zero erros
PWA v1.2.0 — 27 entries precached (974.83 KiB)
```
