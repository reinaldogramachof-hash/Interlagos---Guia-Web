-- Sprint Vitrine Reviews v2
-- Execute no Supabase SQL Editor ANTES do deploy do código

-- 0. Garante que a coluna is_approved existe (caso a tabela tenha sido criada
--    antes desta coluna ser adicionada ao CREATE TABLE original)
ALTER TABLE merchant_reviews
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;

-- 1. Permite que o próprio usuário veja seus reviews pendentes
--    (corrige a checagem de duplicata no merchantReviewsService)
DROP POLICY IF EXISTS "reviews_select_own" ON merchant_reviews;
CREATE POLICY "reviews_select_own" ON merchant_reviews
  FOR SELECT USING (auth.uid() = author_id);

-- 2. Admin/Master pode ver todos os reviews para moderação
DROP POLICY IF EXISTS "reviews_admin_read" ON merchant_reviews;
CREATE POLICY "reviews_admin_read" ON merchant_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- 3. Admin/Master pode aprovar/rejeitar (UPDATE is_approved)
DROP POLICY IF EXISTS "reviews_admin_update" ON merchant_reviews;
CREATE POLICY "reviews_admin_update" ON merchant_reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- 4. Colunas desnormalizadas no merchants para exibir rating nos cards da vitrine
--    (evita N queries ao carregar a lista de lojas)
ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER NOT NULL DEFAULT 0;

-- 5. Função que recalcula avg_rating e review_count no merchant pai
CREATE OR REPLACE FUNCTION refresh_merchant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE merchants SET
    avg_rating = COALESCE(
      (SELECT AVG(rating) FROM merchant_reviews
       WHERE merchant_id = NEW.merchant_id AND is_approved = true), 0
    ),
    review_count = (
      SELECT COUNT(*) FROM merchant_reviews
      WHERE merchant_id = NEW.merchant_id AND is_approved = true
    )
  WHERE id = NEW.merchant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger dispara após INSERT ou UPDATE em merchant_reviews
DROP TRIGGER IF EXISTS trg_refresh_merchant_rating ON merchant_reviews;
CREATE TRIGGER trg_refresh_merchant_rating
  AFTER INSERT OR UPDATE ON merchant_reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_merchant_rating();
