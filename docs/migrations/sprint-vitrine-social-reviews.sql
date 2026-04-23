  -- Migration: sprint-vitrine-social-reviews
  -- 1a. Adicionar coluna social_links JSONB na tabela merchants
  ALTER TABLE merchants
    ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

  -- 1b. Criar tabela merchant_reviews
  CREATE TABLE IF NOT EXISTS merchant_reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    author_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
    neighborhood TEXT NOT NULL,
    author_name TEXT,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_merchant_reviews_merchant
    ON merchant_reviews(merchant_id, is_approved);

  ALTER TABLE merchant_reviews ENABLE ROW LEVEL SECURITY;

  -- Leitura pública de reviews aprovadas
  CREATE POLICY "reviews_read" ON merchant_reviews
    FOR SELECT USING (is_approved = true);

  -- Morador autenticado pode criar review (1 por merchant por usuário — enforçar no service)
  CREATE POLICY "reviews_insert" ON merchant_reviews
    FOR INSERT WITH CHECK (auth.uid() = author_id);
