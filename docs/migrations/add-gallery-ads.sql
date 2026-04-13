ALTER TABLE ads ADD COLUMN IF NOT EXISTS gallery_urls jsonb DEFAULT '[]'::jsonb;
