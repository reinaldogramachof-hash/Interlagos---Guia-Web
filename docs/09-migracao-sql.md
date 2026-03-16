# Tem No Bairro — Script de Migração SQL (Delta)

> **Versão:** 1.0
> **Data:** Março/2026
> **Tipo:** Migração incremental — adiciona colunas e objetos faltantes SEM apagar dados existentes
> **Executar:** Supabase Dashboard → SQL Editor → executar bloco por bloco

---

## DIAGNÓSTICO PRÉ-MIGRAÇÃO

| Tabela | Status | Observação |
|---|---|---|
| `profiles` | ✅ Existe | Vazia — aguardando usuários reais |
| `merchants` | ⚠️ Existe | 10 registros de teste — faltam colunas do schema v2 |
| `ads` | ⚠️ Existe | 5 registros de teste — faltam colunas do schema v2 |
| `campaigns` | ✅ Existe | Vazia |
| `click_events` | ✅ Existe | Vazia |
| `favorites` | ✅ Existe | Vazia |
| `notifications` | ✅ Existe | Vazia |
| `suggestions` | ✅ Existe | Vazia |
| `tickets` | ✅ Existe | Vazia |
| `merchant_reviews` | ⚠️ Existe | RLS bloqueando leitura pública — falta policy |
| `merchant_campaigns` | ⚠️ Existe | RLS bloqueando leitura pública — falta policy |
| `news_comments` | ⚠️ Existe | RLS bloqueando leitura pública — falta policy |
| `audit_logs` | ⚠️ Existe | RLS — acesso só para master (correto) |
| `chat_history` | ⚠️ Existe | RLS — acesso só para dono (correto) |
| **RPCs** | ❌ Não existem | `increment_merchant_view`, `increment_merchant_contact` |

---

## BLOCO M1 — Colunas faltantes em `merchants`

```sql
-- Adicionar colunas novas sem remover as existentes
ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS cover_url        text,
  ADD COLUMN IF NOT EXISTS facebook         text,
  ADD COLUMN IF NOT EXISTS website          text,
  ADD COLUMN IF NOT EXISTS opening_hours    jsonb,
  ADD COLUMN IF NOT EXISTS is_featured      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS avg_rating       numeric(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count     int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count       int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contact_count    int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at       timestamptz NOT NULL DEFAULT now();

-- Trigger updated_at (criar função genérica se não existir)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger em merchants
DROP TRIGGER IF EXISTS merchants_updated_at ON merchants;
CREATE TRIGGER merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## BLOCO M2 — Colunas faltantes em `ads`

```sql
-- Verificar e adicionar tipo enum se não existir
DO $$ BEGIN
  CREATE TYPE ad_type AS ENUM ('sale', 'trade', 'donation');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Adicionar colunas novas em ads
ALTER TABLE ads
  ADD COLUMN IF NOT EXISTS ad_type      ad_type NOT NULL DEFAULT 'sale',
  ADD COLUMN IF NOT EXISTS image_urls   text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS whatsapp     text,
  ADD COLUMN IF NOT EXISTS view_count   int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expires_at   timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  ADD COLUMN IF NOT EXISTS updated_at   timestamptz NOT NULL DEFAULT now();

-- Migrar image_url (string) → image_urls (array) para registros existentes
UPDATE ads
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND (image_urls = '{}' OR image_urls IS NULL);

-- Trigger updated_at em ads
DROP TRIGGER IF EXISTS ads_updated_at ON ads;
CREATE TRIGGER ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## BLOCO M3 — RPCs de analytics

```sql
-- RPC: registrar visualização de comerciante
CREATE OR REPLACE FUNCTION increment_merchant_view(
  p_merchant_id uuid,
  p_session_id  text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO click_events (entity_id, entity_type, session_id)
  VALUES (p_merchant_id, 'merchant_view', p_session_id);

  UPDATE merchants
  SET view_count = view_count + 1
  WHERE id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: registrar clique no WhatsApp do comerciante
CREATE OR REPLACE FUNCTION increment_merchant_contact(
  p_merchant_id uuid,
  p_user_id     uuid DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO click_events (entity_id, entity_type, user_id)
  VALUES (p_merchant_id, 'merchant_contact', p_user_id);

  UPDATE merchants
  SET contact_count = contact_count + 1
  WHERE id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: expirar anúncios (executada pelo cron)
CREATE OR REPLACE FUNCTION expire_ads()
RETURNS void AS $$
  UPDATE ads
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < now();
$$ LANGUAGE sql;
```

---

## BLOCO M4 — Enum types faltantes

```sql
-- Criar enums com segurança (ignora se já existir)
DO $$ BEGIN
  CREATE TYPE publish_status AS ENUM ('pending', 'active', 'rejected', 'expired', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE merchant_plan AS ENUM ('free', 'basic', 'professional', 'premium', 'gold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE campaign_type AS ENUM ('food', 'clothing', 'financial', 'volunteer', 'health', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE entity_type AS ENUM (
    'merchant', 'merchant_contact', 'merchant_view',
    'ad', 'news', 'campaign'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
```

---

## BLOCO M5 — RLS: policies de leitura pública

> Para tabelas que têm RLS ativo mas sem policy de SELECT público.

```sql
-- merchant_reviews: leitura pública de avaliações ativas
DROP POLICY IF EXISTS "reviews_public_read" ON merchant_reviews;
CREATE POLICY "reviews_public_read" ON merchant_reviews
  FOR SELECT USING (status = 'active');

-- Usuário logado cria avaliação
DROP POLICY IF EXISTS "reviews_insert" ON merchant_reviews;
CREATE POLICY "reviews_insert" ON merchant_reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- merchant_campaigns: leitura pública de ofertas ativas
DROP POLICY IF EXISTS "merchant_campaigns_public_read" ON merchant_campaigns;
CREATE POLICY "merchant_campaigns_public_read" ON merchant_campaigns
  FOR SELECT USING (status = 'active');

-- Dono do comerciante cria/edita campanhas
DROP POLICY IF EXISTS "merchant_campaigns_owner" ON merchant_campaigns;
CREATE POLICY "merchant_campaigns_owner" ON merchant_campaigns
  FOR ALL USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE owner_id = auth.uid()
    )
  );

-- news_comments: leitura pública de comentários ativos
DROP POLICY IF EXISTS "news_comments_public_read" ON news_comments;
CREATE POLICY "news_comments_public_read" ON news_comments
  FOR SELECT USING (status = 'active');

-- Usuário logado comenta
DROP POLICY IF EXISTS "news_comments_insert" ON news_comments;
CREATE POLICY "news_comments_insert" ON news_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);
```

---

## BLOCO M6 — Trigger de criação automática de perfil

> Garante que ao criar usuário no Supabase Auth, o perfil é criado automaticamente na tabela `profiles`.

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, photo_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Usuário'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- seguro se perfil já existir
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dropar e recriar o trigger para garantir que está atualizado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## BLOCO M7 — Verificação pós-migração

> Execute após todos os blocos anteriores para confirmar que tudo está correto.

```sql
-- Verificar colunas de merchants
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'merchants'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar colunas de ads
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'ads'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se as RPCs existem
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('increment_merchant_view', 'increment_merchant_contact', 'expire_ads', 'handle_new_user');

-- Verificar policies ativas
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## CHECKLIST DE EXECUÇÃO

```
□ M1 — Colunas faltantes em merchants executado
□ M2 — Colunas faltantes em ads executado + migração image_url → image_urls
□ M3 — RPCs de analytics criadas
□ M4 — Enum types criados
□ M5 — RLS policies de leitura pública adicionadas
□ M6 — Trigger de criação de perfil criado/atualizado
□ M7 — Verificação pós-migração executada sem erros
□ Testar: criar conta → verificar perfil criado em profiles
□ Testar: chamar increment_merchant_view via app
□ Testar: leitura de merchant_reviews sem login
```
