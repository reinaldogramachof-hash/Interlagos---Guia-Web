-- ============================================================
-- Fix: user_consents schema consistency
-- Garante que a tabela tenha os campos esperados pelo consentService
-- ============================================================

-- Adiciona version se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_consents' AND column_name='version') THEN
        ALTER TABLE user_consents ADD COLUMN version text DEFAULT '1.0';
    END IF;
END $$;

-- Adiciona accepted_at se não existir (usa created_at como base se disponível)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_consents' AND column_name='accepted_at') THEN
        ALTER TABLE user_consents ADD COLUMN accepted_at timestamptz DEFAULT now();
        
        -- Se existir created_at, copia os valores
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_consents' AND column_name='created_at') THEN
            UPDATE user_consents SET accepted_at = created_at WHERE accepted_at IS NULL;
        END IF;
    END IF;
END $$;

-- Garante que user_agent existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_consents' AND column_name='user_agent') THEN
        ALTER TABLE user_consents ADD COLUMN user_agent text;
    END IF;
END $$;
