-- =============================================================
-- MIGRATION: Adiciona coluna neighborhood nas tabelas principais
-- Aplicar ANTES do seed-interlagos-test.sql
-- =============================================================

-- merchants
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS neighborhood text NOT NULL DEFAULT 'interlagos';

-- news
ALTER TABLE news ADD COLUMN IF NOT EXISTS neighborhood text NOT NULL DEFAULT 'interlagos';

-- ads
ALTER TABLE ads ADD COLUMN IF NOT EXISTS neighborhood text NOT NULL DEFAULT 'interlagos';

-- campaigns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS neighborhood text NOT NULL DEFAULT 'interlagos';

-- suggestions
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS neighborhood text NOT NULL DEFAULT 'interlagos';

-- tickets (não tem neighborhood por design — suporte é global)
-- profiles (já mapeado no CLAUDE.md com neighborhood)

-- =============================================================
-- RLS: Atualizar policies para filtrar por neighborhood
-- (ajuste o nome das policies existentes se necessário)
-- =============================================================

-- merchants
DROP POLICY IF EXISTS "merchants_select" ON merchants;
CREATE POLICY "merchants_select" ON merchants FOR SELECT USING (true);

DROP POLICY IF EXISTS "merchants_insert" ON merchants;
CREATE POLICY "merchants_insert" ON merchants FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "merchants_update" ON merchants;
CREATE POLICY "merchants_update" ON merchants FOR UPDATE USING (auth.uid() = owner_id);

-- news
DROP POLICY IF EXISTS "news_select" ON news;
CREATE POLICY "news_select" ON news FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "news_insert" ON news;
CREATE POLICY "news_insert" ON news FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "news_update" ON news;
CREATE POLICY "news_update" ON news FOR UPDATE USING (auth.uid() = author_id);

-- ads
DROP POLICY IF EXISTS "ads_select" ON ads;
CREATE POLICY "ads_select" ON ads FOR SELECT USING (true);

DROP POLICY IF EXISTS "ads_insert" ON ads;
CREATE POLICY "ads_insert" ON ads FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "ads_update" ON ads;
CREATE POLICY "ads_update" ON ads FOR UPDATE USING (auth.uid() = seller_id);

-- campaigns
DROP POLICY IF EXISTS "campaigns_select" ON campaigns;
CREATE POLICY "campaigns_select" ON campaigns FOR SELECT USING (true);

-- suggestions
DROP POLICY IF EXISTS "suggestions_select" ON suggestions;
CREATE POLICY "suggestions_select" ON suggestions FOR SELECT USING (true);

DROP POLICY IF EXISTS "suggestions_insert" ON suggestions;
CREATE POLICY "suggestions_insert" ON suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
