-- Tabela merchant_posts
CREATE TABLE IF NOT EXISTS public.merchant_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id   uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  neighborhood  text NOT NULL,
  type          text NOT NULL CHECK (type IN ('product','service','news','promo')),
  title         text NOT NULL,
  description   text,
  price         numeric(10,2),
  image_url     text,
  gallery_urls  text[] DEFAULT '{}',
  is_active     boolean DEFAULT true,
  expires_at    timestamptz,
  created_at    timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_merchant_posts_merchant_id ON public.merchant_posts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_posts_neighborhood ON public.merchant_posts(neighborhood);
CREATE INDEX IF NOT EXISTS idx_merchant_posts_is_active ON public.merchant_posts(is_active);

-- RLS
ALTER TABLE public.merchant_posts ENABLE ROW LEVEL SECURITY;

-- Leitura pública por bairro
CREATE POLICY "merchant_posts_public_read"
  ON public.merchant_posts FOR SELECT
  USING (is_active = true);

-- Owner pode fazer tudo via merchant vinculado
CREATE POLICY "merchant_posts_owner_all"
  ON public.merchant_posts FOR ALL
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants WHERE owner_id = auth.uid()
    )
  );
