-- Sprint: Vitrine Store — Fase 1
-- Executar no Supabase SQL Editor (Dashboard > SQL Editor > New Query)

ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS store_color TEXT DEFAULT '#4f46e5',
  ADD COLUMN IF NOT EXISTS store_cover_url TEXT,
  ADD COLUMN IF NOT EXISTS store_tagline TEXT,
  ADD COLUMN IF NOT EXISTS store_description TEXT,
  ADD COLUMN IF NOT EXISTS store_badge_text TEXT;

COMMENT ON COLUMN merchants.store_color IS 'Cor de destaque da vitrine (hex)';
COMMENT ON COLUMN merchants.store_cover_url IS 'URL da foto de capa da vitrine';
COMMENT ON COLUMN merchants.store_tagline IS 'Slogan curto da loja (max 60 chars)';
COMMENT ON COLUMN merchants.store_description IS 'Descrição longa da loja (max 200 chars)';
COMMENT ON COLUMN merchants.store_badge_text IS 'Texto da faixa de destaque Premium (max 60 chars)';
