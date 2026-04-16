-- Habilitar sistema de Perfil Verificado (segurança e responsabilidade na plataforma).
-- document_url aponta para bucket profile-docs no Supabase Storage.

-- Adicionar campos de verificação e enriquecimento ao profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone           TEXT,
  ADD COLUMN IF NOT EXISTS is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS document_type   TEXT,    -- 'cpf' | 'cnpj' | 'residence_proof'
  ADD COLUMN IF NOT EXISTS document_url    TEXT;    -- URL no Supabase Storage

-- Adicionar campos informativos ao merchants
ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS website         TEXT,
  ADD COLUMN IF NOT EXISTS opening_hours   TEXT,    -- ex: "Seg–Sex: 8h–18h | Sáb: 8h–13h"
  ADD COLUMN IF NOT EXISTS cnpj            TEXT;    -- apenas para merchants com plano pago

-- Índice para lookup rápido de usuários verificados
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
