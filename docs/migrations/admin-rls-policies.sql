-- ============================================================
-- Migration: admin-rls-policies.sql
-- Objetivo: Adicionar policies RLS que permitem admin/master
--           executar operações de gestão no painel administrativo.
-- Executar no: Supabase → SQL Editor
-- ============================================================

-- ============================================================
-- 1. NORMALIZAR neighborhood (case-insensitive) em todas as tabelas
-- ============================================================
UPDATE merchants    SET neighborhood = LOWER(neighborhood) WHERE neighborhood != LOWER(neighborhood);
UPDATE ads          SET neighborhood = LOWER(neighborhood) WHERE neighborhood != LOWER(neighborhood);
UPDATE news         SET neighborhood = LOWER(neighborhood) WHERE neighborhood != LOWER(neighborhood);
UPDATE campaigns    SET neighborhood = LOWER(neighborhood) WHERE neighborhood != LOWER(neighborhood);
UPDATE suggestions  SET neighborhood = LOWER(neighborhood) WHERE neighborhood != LOWER(neighborhood);

-- ============================================================
-- 2. MERCHANTS — admin pode atualizar e deletar qualquer comércio
-- ============================================================
DROP POLICY IF EXISTS "merchants_admin_update" ON merchants;
CREATE POLICY "merchants_admin_update" ON merchants
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "merchants_admin_delete" ON merchants;
CREATE POLICY "merchants_admin_delete" ON merchants
  FOR DELETE USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "merchants_admin_insert" ON merchants;
CREATE POLICY "merchants_admin_insert" ON merchants
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 3. NEWS — admin pode criar, atualizar e deletar notícias
-- ============================================================
DROP POLICY IF EXISTS "news_admin_select" ON news;
CREATE POLICY "news_admin_select" ON news
  FOR SELECT USING (
    status = 'active' OR
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "news_admin_update" ON news;
CREATE POLICY "news_admin_update" ON news
  FOR UPDATE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "news_admin_delete" ON news;
CREATE POLICY "news_admin_delete" ON news
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 4. ADS — admin pode atualizar status (aprovar/rejeitar) e deletar
-- ============================================================
DROP POLICY IF EXISTS "ads_admin_update" ON ads;
CREATE POLICY "ads_admin_update" ON ads
  FOR UPDATE USING (
    auth.uid() = seller_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "ads_admin_delete" ON ads;
CREATE POLICY "ads_admin_delete" ON ads
  FOR DELETE USING (
    auth.uid() = seller_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 5. CAMPAIGNS — admin pode atualizar status e deletar
-- ============================================================
DROP POLICY IF EXISTS "campaigns_admin_update" ON campaigns;
CREATE POLICY "campaigns_admin_update" ON campaigns
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "campaigns_admin_delete" ON campaigns;
CREATE POLICY "campaigns_admin_delete" ON campaigns
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 6. SUGGESTIONS — admin pode deletar (reset e moderação)
-- ============================================================
DROP POLICY IF EXISTS "suggestions_admin_delete" ON suggestions;
CREATE POLICY "suggestions_admin_delete" ON suggestions
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 7. CLICK_EVENTS — master pode deletar (reset de analytics)
-- ============================================================
DROP POLICY IF EXISTS "click_events_admin_delete" ON click_events;
CREATE POLICY "click_events_admin_delete" ON click_events
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ============================================================
-- 8. PROFILES — master pode alterar role de qualquer usuário
-- ============================================================
DROP POLICY IF EXISTS "profiles_master_update_role" ON profiles;
CREATE POLICY "profiles_master_update_role" ON profiles
  FOR UPDATE USING (
    id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ============================================================
-- 9. TICKETS — master e admin têm acesso total (ler + resolver)
-- ============================================================
DROP POLICY IF EXISTS "tickets_admin_select" ON tickets;
CREATE POLICY "tickets_admin_select" ON tickets
  FOR SELECT USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "tickets_admin_update" ON tickets;
CREATE POLICY "tickets_admin_update" ON tickets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

DROP POLICY IF EXISTS "tickets_insert_own" ON tickets;
CREATE POLICY "tickets_insert_own" ON tickets
  FOR INSERT WITH CHECK (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ============================================================
-- 10. ROLE 'banned' — garantir que é um valor aceito na coluna
-- ============================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('resident', 'admin', 'master', 'banned'));
