---
name: add-table
description: Cria SQL migration completa + RLS policies + service file para uma nova tabela no Supabase. Use quando o usuário pedir para adicionar uma nova tabela, entidade ou recurso ao banco de dados.
argument-hint: [nome-da-tabela]
---

Crie tudo necessário para adicionar a tabela `$ARGUMENTS` ao projeto.

## Passo 1 — SQL Migration

Gere o bloco SQL completo para executar no Supabase SQL Editor:

```sql
-- ─── Tabela: $TABLE ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS $TABLE (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- [adicionar colunas específicas aqui]
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE TRIGGER set_updated_at_$TABLE
  BEFORE UPDATE ON $TABLE
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE $TABLE ENABLE ROW LEVEL SECURITY;

-- Leitura pública (ajustar se necessário)
CREATE POLICY "$TABLE: leitura pública"
  ON $TABLE FOR SELECT
  USING (true);

-- Insert: apenas usuário autenticado (dono do registro)
CREATE POLICY "$TABLE: insert autenticado"
  ON $TABLE FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update: apenas o dono
CREATE POLICY "$TABLE: update próprio"
  ON $TABLE FOR UPDATE
  USING (auth.uid() = [coluna_owner_id])
  WITH CHECK (auth.uid() = [coluna_owner_id]);

-- Delete: apenas o dono
CREATE POLICY "$TABLE: delete próprio"
  ON $TABLE FOR DELETE
  USING (auth.uid() = [coluna_owner_id]);

-- Admin: acesso total
CREATE POLICY "$TABLE: admin total"
  ON $TABLE FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'master')
    )
  );
```

## Passo 2 — Service file

Após confirmar que a tabela foi criada no Supabase, crie `app/src/services/$TABLEService.js` seguindo o padrão da skill `/new-service`.

## Passo 3 — Verificação

Executar no Supabase SQL Editor para confirmar:
```sql
SELECT table_name, row_security
FROM information_schema.tables t
JOIN pg_tables pt ON t.table_name = pt.tablename
WHERE t.table_schema = 'public'
AND t.table_name = '$TABLE';
```

## Regras de nomenclatura

| Convenção | Formato | Exemplo |
|---|---|---|
| Nome da tabela | snake_case plural | `support_tickets` |
| FK para usuário | `user_id` ou `[entidade]_id` | `author_id`, `seller_id` |
| Timestamps | `created_at`, `updated_at` | — |
| Booleanos | prefixo `is_` | `is_active`, `is_read` |
| Status | enum ou text com CHECK | `status IN ('pending','active','closed')` |

Após criar o service, execute `npm run build` em `app/` para confirmar zero erros.
