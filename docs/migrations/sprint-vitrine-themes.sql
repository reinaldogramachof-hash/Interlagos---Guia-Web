-- Sprint: Vitrine Themes — adicionar store_theme e store_url
-- Executar no Supabase Dashboard > SQL Editor > New Query

ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS store_theme TEXT DEFAULT 'negocios',
  ADD COLUMN IF NOT EXISTS store_url TEXT;

COMMENT ON COLUMN merchants.store_theme IS 'Tema visual da loja: negocios|mercado|atelier|dark-tech|luxury|vibrante';
COMMENT ON COLUMN merchants.store_url IS 'URL da loja externa customizada (Pro/Premium)';
