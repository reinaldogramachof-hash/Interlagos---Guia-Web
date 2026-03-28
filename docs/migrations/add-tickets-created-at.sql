-- Migration: add created_at to tickets table
-- Execute no Supabase SQL Editor

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Backfill para tickets existentes (todos receberão o timestamp atual)
UPDATE tickets SET created_at = now() WHERE created_at IS NULL;
