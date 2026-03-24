-- ============================================================
-- Sprint 1 — Identidade, Consentimento e Onboarding (LGPD)
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Novos campos na tabela profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name            text,
  ADD COLUMN IF NOT EXISTS neighborhood         text,
  ADD COLUMN IF NOT EXISTS phone_verified       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_accepted_at    timestamptz;

-- 2. Tabela user_consents
CREATE TABLE IF NOT EXISTS user_consents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type    text NOT NULL, -- 'terms_of_use' | 'privacy_policy' | 'news_responsibility' | 'ads_responsibility'
  version         text NOT NULL DEFAULT '1.0',
  accepted_at     timestamptz NOT NULL DEFAULT now(),
  ip_address      text,
  user_agent      text
);

-- 3. Índice para busca por usuário
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);

-- 4. RLS
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_consents_select_own" ON user_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_consents_insert_own" ON user_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin pode ver todos
CREATE POLICY "user_consents_admin_select" ON user_consents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );
