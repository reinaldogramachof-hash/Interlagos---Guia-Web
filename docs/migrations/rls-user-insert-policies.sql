-- ============================================================
-- Migration: rls-user-insert-policies.sql
-- Objetivo: Políticas RLS de INSERT para moradores e comerciantes
-- Executar no: Supabase → SQL Editor
-- ============================================================

-- NEWS: morador pode criar notícia com status 'pending'
DROP POLICY IF EXISTS "news_insert_own" ON news;
CREATE POLICY "news_insert_own" ON news
  FOR INSERT WITH CHECK (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- CAMPAIGNS: comerciante pode criar campanha para seu próprio merchant
DROP POLICY IF EXISTS "campaigns_merchant_insert" ON campaigns;
CREATE POLICY "campaigns_merchant_insert" ON campaigns
  FOR INSERT WITH CHECK (
    (merchant_id IS NOT NULL AND
     EXISTS (SELECT 1 FROM merchants WHERE id = merchant_id AND owner_id = auth.uid())) OR
    (merchant_id IS NULL AND auth.uid() IS NOT NULL) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );
