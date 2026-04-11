-- Migration: Normalização do campo author_id na tabela campaigns
-- Problema: campanhas antigas foram gravadas com requester_id ou user_id
--           ao invés de author_id, causando orfãos invisíveis para o usuário.
-- Execução: SQL Editor do Supabase Dashboard — requer role service_role

-- Passo 1: migrar requester_id → author_id onde author_id for null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'requester_id'
  ) THEN
    UPDATE campaigns
    SET author_id = requester_id
    WHERE author_id IS NULL AND requester_id IS NOT NULL;
    RAISE NOTICE 'requester_id migrado para author_id com sucesso.';
  ELSE
    RAISE NOTICE 'Coluna requester_id não encontrada — nenhuma ação necessária.';
  END IF;
END $$;

-- Passo 2: migrar user_id → author_id onde author_id ainda for null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campaigns' AND column_name = 'user_id'
  ) THEN
    UPDATE campaigns
    SET author_id = user_id
    WHERE author_id IS NULL AND user_id IS NOT NULL;
    RAISE NOTICE 'user_id migrado para author_id com sucesso.';
  ELSE
    RAISE NOTICE 'Coluna user_id não encontrada — nenhuma ação necessária.';
  END IF;
END $$;

-- Passo 3: relatório de campanhas ainda orfãs após migração
SELECT id, title, status, start_date
FROM campaigns
WHERE author_id IS NULL
ORDER BY start_date DESC;
