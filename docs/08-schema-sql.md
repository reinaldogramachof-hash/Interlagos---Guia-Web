# Tem No Bairro — Especificação do Schema SQL (Supabase)

> **Versão:** 1.0
> **Data:** Março/2026
> **Banco:** PostgreSQL via Supabase
> **Status:** Pronto para execução no Supabase Dashboard

---

## INSTRUÇÕES DE EXECUÇÃO

1. Acesse o **Supabase Dashboard** → seu projeto → **SQL Editor**
2. Execute os blocos **na ordem apresentada** (dependências entre tabelas)
3. Ao final, execute as **políticas RLS** separadamente
4. Verifique as **RPCs** após criar as tabelas de analytics

---

## BLOCO 1 — EXTENSÕES

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca por similaridade (futuro Algolia fallback)
```

---

## BLOCO 2 — ENUM TYPES

```sql
-- Role do usuário
CREATE TYPE user_role AS ENUM ('resident', 'merchant', 'admin', 'master');

-- Status genérico de publicação
CREATE TYPE publish_status AS ENUM ('pending', 'active', 'rejected', 'expired', 'archived');

-- Planos do comerciante
CREATE TYPE merchant_plan AS ENUM ('free', 'basic', 'professional', 'premium', 'gold');

-- Tipo de anúncio classificado
CREATE TYPE ad_type AS ENUM ('sale', 'trade', 'donation');

-- Tipo de campanha social
CREATE TYPE campaign_type AS ENUM ('food', 'clothing', 'financial', 'volunteer', 'health', 'other');

-- Status de ticket de suporte
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Tipo de entidade para eventos de analytics e favoritos
CREATE TYPE entity_type AS ENUM (
  'merchant', 'merchant_contact', 'merchant_view',
  'ad', 'news', 'campaign'
);
```

---

## BLOCO 3 — TABELA: profiles

> Espelha `auth.users` do Supabase Auth. Criada automaticamente via trigger.

```sql
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  photo_url   text,
  role        user_role NOT NULL DEFAULT 'resident',
  plan        merchant_plan DEFAULT NULL, -- só preenchido se role = merchant
  phone       text,
  bio         text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: cria perfil automaticamente ao criar usuário no Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Usuário'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## BLOCO 4 — TABELA: merchants

```sql
CREATE TABLE merchants (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  category      text NOT NULL,
  plan          merchant_plan NOT NULL DEFAULT 'free',
  image_url     text,
  cover_url     text,                    -- foto de capa (plano básico+)
  phone         text,
  whatsapp      text,                   -- número com DDI, ex: 5512999999999
  address       text,
  instagram     text,
  facebook      text,
  website       text,
  opening_hours jsonb,                  -- { "seg": "08:00-18:00", "dom": "fechado", ... }
  is_active     boolean NOT NULL DEFAULT false, -- false até aprovação pelo admin
  is_featured   boolean NOT NULL DEFAULT false, -- destaque manual pelo admin
  avg_rating    numeric(3,2) DEFAULT 0,  -- calculado via trigger
  review_count  int NOT NULL DEFAULT 0,
  view_count    int NOT NULL DEFAULT 0,
  contact_count int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Index para busca por categoria e plano
CREATE INDEX idx_merchants_category ON merchants(category) WHERE is_active = true;
CREATE INDEX idx_merchants_plan ON merchants(plan) WHERE is_active = true;
CREATE INDEX idx_merchants_owner ON merchants(owner_id);
-- Index para busca full-text por nome
CREATE INDEX idx_merchants_name_trgm ON merchants USING gin(name gin_trgm_ops);
```

---

## BLOCO 5 — TABELA: merchant_reviews

```sql
CREATE TABLE merchant_reviews (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  author_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  status      publish_status NOT NULL DEFAULT 'pending', -- moderação antes de publicar
  reply       text,           -- resposta do comerciante (plano profissional+)
  reply_at    timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(merchant_id, author_id) -- 1 avaliação por usuário por comerciante
);

-- Trigger: recalcula avg_rating e review_count em merchants
CREATE OR REPLACE FUNCTION update_merchant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE merchants
  SET
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM merchant_reviews
      WHERE merchant_id = COALESCE(NEW.merchant_id, OLD.merchant_id)
        AND status = 'active'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM merchant_reviews
      WHERE merchant_id = COALESCE(NEW.merchant_id, OLD.merchant_id)
        AND status = 'active'
    )
  WHERE id = COALESCE(NEW.merchant_id, OLD.merchant_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER merchant_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON merchant_reviews
  FOR EACH ROW EXECUTE FUNCTION update_merchant_rating();

CREATE INDEX idx_reviews_merchant ON merchant_reviews(merchant_id) WHERE status = 'active';
```

---

## BLOCO 6 — TABELA: news

```sql
CREATE TABLE news (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  title       text NOT NULL,
  content     text NOT NULL,
  summary     text,              -- resumo automático ou manual (max 200 chars)
  image_url   text,
  category    text NOT NULL DEFAULT 'geral',
  is_official boolean NOT NULL DEFAULT false, -- true = postado pela equipe
  status      publish_status NOT NULL DEFAULT 'pending',
  like_count  int NOT NULL DEFAULT 0,
  view_count  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz      -- data de publicação (quando status vai para active)
);

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_news_status ON news(status, published_at DESC);
CREATE INDEX idx_news_category ON news(category) WHERE status = 'active';
```

---

## BLOCO 7 — TABELA: news_comments

```sql
CREATE TABLE news_comments (
  id        uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id   uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content   text NOT NULL,
  status    publish_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_news_comments ON news_comments(news_id) WHERE status = 'active';
```

---

## BLOCO 8 — TABELA: ads (classificados)

```sql
CREATE TABLE ads (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  price       numeric(10,2),   -- NULL = preço a combinar
  ad_type     ad_type NOT NULL DEFAULT 'sale',
  category    text NOT NULL,
  image_urls  text[] DEFAULT '{}', -- array de URLs de fotos
  whatsapp    text,
  status      publish_status NOT NULL DEFAULT 'pending',
  view_count  int NOT NULL DEFAULT 0,
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_ads_status ON ads(status, created_at DESC);
CREATE INDEX idx_ads_category ON ads(category) WHERE status = 'active';
CREATE INDEX idx_ads_seller ON ads(seller_id);
CREATE INDEX idx_ads_expires ON ads(expires_at) WHERE status = 'active';
-- Index para busca full-text
CREATE INDEX idx_ads_title_trgm ON ads USING gin(title gin_trgm_ops);

-- Função para expirar ads automaticamente (executar via cron Supabase)
CREATE OR REPLACE FUNCTION expire_ads()
RETURNS void AS $$
  UPDATE ads
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < now();
$$ LANGUAGE sql;
```

---

## BLOCO 9 — TABELA: campaigns (ação social)

```sql
CREATE TABLE campaigns (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id  uuid REFERENCES profiles(id) ON DELETE SET NULL, -- quem solicitou
  approved_by   uuid REFERENCES profiles(id) ON DELETE SET NULL, -- admin que aprovou
  title         text NOT NULL,
  description   text NOT NULL,
  campaign_type campaign_type NOT NULL DEFAULT 'other',
  image_url     text,
  contact_info  text,              -- WhatsApp ou forma de contato para ajudar
  external_link text,              -- link externo (PIX, vaquinha, etc.)
  status        publish_status NOT NULL DEFAULT 'pending',
  expires_at    timestamptz NOT NULL DEFAULT (now() + interval '60 days'),
  support_count int NOT NULL DEFAULT 0, -- quantos clicaram em "quero ajudar"
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_campaigns_status ON campaigns(status, created_at DESC);
```

---

## BLOCO 10 — TABELA: merchant_campaigns (ofertas/promoções)

> Campanhas de marketing criadas pelo comerciante no painel.

```sql
CREATE TABLE merchant_campaigns (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  discount    text,            -- ex: "20% OFF", "Compre 2 leve 3"
  image_url   text,
  start_date  date NOT NULL DEFAULT CURRENT_DATE,
  end_date    date,
  status      publish_status NOT NULL DEFAULT 'active',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_merchant_campaigns ON merchant_campaigns(merchant_id, status);
CREATE INDEX idx_merchant_campaigns_active ON merchant_campaigns(end_date)
  WHERE status = 'active';
```

---

## BLOCO 11 — TABELA: click_events (analytics)

```sql
CREATE TABLE click_events (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id   uuid NOT NULL,
  entity_type entity_type NOT NULL,
  user_id     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id  text,            -- para visitantes não logados
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Particionamento por mês (performance para tabela que cresce rápido)
-- Criar índices
CREATE INDEX idx_click_events_entity ON click_events(entity_id, entity_type, created_at DESC);
CREATE INDEX idx_click_events_date ON click_events(created_at DESC);

-- RPCs para incrementar contadores (chamadas do frontend)
CREATE OR REPLACE FUNCTION increment_merchant_view(p_merchant_id uuid, p_session_id text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  INSERT INTO click_events (entity_id, entity_type, session_id)
  VALUES (p_merchant_id, 'merchant_view', p_session_id);

  UPDATE merchants
  SET view_count = view_count + 1
  WHERE id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_merchant_contact(p_merchant_id uuid, p_user_id uuid DEFAULT NULL)
RETURNS void AS $$
BEGIN
  INSERT INTO click_events (entity_id, entity_type, user_id)
  VALUES (p_merchant_id, 'merchant_contact', p_user_id);

  UPDATE merchants
  SET contact_count = contact_count + 1
  WHERE id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## BLOCO 12 — TABELA: favorites

```sql
CREATE TABLE favorites (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_id   uuid NOT NULL,
  entity_type entity_type NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_id, entity_type)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_entity ON favorites(entity_id, entity_type);
```

---

## BLOCO 13 — TABELA: notifications

```sql
CREATE TABLE notifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text,
  type       text NOT NULL DEFAULT 'general', -- 'approval', 'campaign', 'review', 'general'
  ref_id     uuid,              -- ID da entidade relacionada (merchant, news, etc.)
  ref_type   text,              -- tipo da entidade relacionada
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```

---

## BLOCO 14 — TABELA: suggestions (ex-base para ação social, mantida separada)

```sql
CREATE TABLE suggestions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  status      publish_status NOT NULL DEFAULT 'pending',
  vote_count  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

---

## BLOCO 15 — TABELA: tickets (suporte)

```sql
CREATE TABLE tickets (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subject      text NOT NULL,
  body         text NOT NULL,
  status       ticket_status NOT NULL DEFAULT 'open',
  priority     text NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  resolved_at  timestamptz,
  resolved_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE INDEX idx_tickets_status ON tickets(status, created_at DESC);
```

---

## BLOCO 16 — TABELA: audit_logs

```sql
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action      text NOT NULL,         -- ex: 'merchant.approved', 'news.rejected'
  entity_type text,
  entity_id   uuid,
  old_data    jsonb,                 -- snapshot antes da mudança
  new_data    jsonb,                 -- snapshot depois da mudança
  ip_address  inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at DESC);

-- Função helper para registrar auditoria (chamar nos services do backend)
CREATE OR REPLACE FUNCTION log_audit(
  p_actor_id uuid,
  p_action text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_old_data jsonb DEFAULT NULL,
  p_new_data jsonb DEFAULT NULL
)
RETURNS void AS $$
  INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_data, new_data)
  VALUES (p_actor_id, p_action, p_entity_type, p_entity_id, p_old_data, p_new_data);
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## BLOCO 17 — TABELA: chat_history (chatbot Genkit)

```sql
CREATE TABLE chat_history (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  text NOT NULL,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_history_session ON chat_history(session_id, created_at ASC);
CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);
```

---

## BLOCO 18 — ROW LEVEL SECURITY (RLS)

> Execute após criar todas as tabelas. RLS garante que cada usuário só acessa o que tem permissão.

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES
-- =====================
-- Qualquer um lê perfis públicos
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

-- Usuário edita apenas o próprio perfil
CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================
-- MERCHANTS
-- =====================
-- Qualquer um vê comércios ativos
CREATE POLICY "merchants_public_read" ON merchants
  FOR SELECT USING (is_active = true);

-- Admin/master vê todos (incluindo pendentes)
CREATE POLICY "merchants_admin_read" ON merchants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- Dono vê o próprio (mesmo pendente)
CREATE POLICY "merchants_owner_read" ON merchants
  FOR SELECT USING (owner_id = auth.uid());

-- Usuário logado cria comerciante
CREATE POLICY "merchants_insert" ON merchants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Dono edita o próprio
CREATE POLICY "merchants_owner_update" ON merchants
  FOR UPDATE USING (owner_id = auth.uid());

-- Admin/master edita qualquer um
CREATE POLICY "merchants_admin_update" ON merchants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- MERCHANT_REVIEWS
-- =====================
-- Qualquer um lê avaliações ativas
CREATE POLICY "reviews_public_read" ON merchant_reviews
  FOR SELECT USING (status = 'active');

-- Usuário logado cria avaliação
CREATE POLICY "reviews_insert" ON merchant_reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Autor edita a própria (enquanto pending)
CREATE POLICY "reviews_author_update" ON merchant_reviews
  FOR UPDATE USING (author_id = auth.uid() AND status = 'pending');

-- Admin modera
CREATE POLICY "reviews_admin_update" ON merchant_reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- NEWS
-- =====================
-- Qualquer um lê notícias ativas
CREATE POLICY "news_public_read" ON news
  FOR SELECT USING (status = 'active');

-- Admin vê todas
CREATE POLICY "news_admin_read" ON news
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- Autor vê a própria (mesmo pendente)
CREATE POLICY "news_author_read" ON news
  FOR SELECT USING (author_id = auth.uid());

-- Usuário logado submete notícia
CREATE POLICY "news_insert" ON news
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Admin publica/rejeita
CREATE POLICY "news_admin_update" ON news
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- ADS (classificados)
-- =====================
-- Qualquer um lê anúncios ativos
CREATE POLICY "ads_public_read" ON ads
  FOR SELECT USING (status = 'active');

-- Vendedor vê os próprios
CREATE POLICY "ads_seller_read" ON ads
  FOR SELECT USING (seller_id = auth.uid());

-- Usuário logado cria anúncio
CREATE POLICY "ads_insert" ON ads
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Vendedor edita/encerra o próprio
CREATE POLICY "ads_seller_update" ON ads
  FOR UPDATE USING (seller_id = auth.uid());

-- Admin modera
CREATE POLICY "ads_admin_update" ON ads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- CAMPAIGNS (ação social)
-- =====================
-- Qualquer um lê campanhas ativas
CREATE POLICY "campaigns_public_read" ON campaigns
  FOR SELECT USING (status = 'active');

-- Admin vê todas
CREATE POLICY "campaigns_admin_all" ON campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- Usuário logado solicita campanha
CREATE POLICY "campaigns_insert" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- =====================
-- FAVORITES
-- =====================
-- Usuário vê e gerencia apenas os próprios favoritos
CREATE POLICY "favorites_owner_all" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- =====================
-- NOTIFICATIONS
-- =====================
-- Usuário vê apenas as próprias notificações
CREATE POLICY "notifications_owner_all" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Admin pode criar notificações para qualquer usuário
CREATE POLICY "notifications_admin_insert" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- CLICK_EVENTS
-- =====================
-- Qualquer um insere (inclusive visitantes via RPC SECURITY DEFINER)
-- Leitura apenas para admin
CREATE POLICY "click_events_admin_read" ON click_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- TICKETS
-- =====================
-- Autor vê o próprio ticket
CREATE POLICY "tickets_author_read" ON tickets
  FOR SELECT USING (author_id = auth.uid());

-- Usuário cria ticket
CREATE POLICY "tickets_insert" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Admin vê e resolve todos
CREATE POLICY "tickets_admin_all" ON tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'master')
    )
  );

-- =====================
-- AUDIT_LOGS
-- =====================
-- Apenas master lê
CREATE POLICY "audit_logs_master_read" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'master'
    )
  );

-- =====================
-- CHAT_HISTORY
-- =====================
-- Usuário acessa apenas o próprio histórico
CREATE POLICY "chat_history_owner_all" ON chat_history
  FOR ALL USING (user_id = auth.uid());
```

---

## BLOCO 19 — STORAGE BUCKETS

> Executar no Supabase Dashboard → Storage → New Bucket

```sql
-- Criar buckets via SQL (ou pelo dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('merchant-images', 'merchant-images', true),  -- fotos dos comércios (público)
  ('ad-images', 'ad-images', true),               -- fotos dos classificados (público)
  ('news-images', 'news-images', true),           -- fotos das notícias (público)
  ('campaign-images', 'campaign-images', true),   -- fotos das campanhas (público)
  ('avatars', 'avatars', true);                   -- fotos de perfil (público)

-- Políticas de storage
-- Qualquer um lê arquivos públicos
CREATE POLICY "public_read_merchant_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'merchant-images');

CREATE POLICY "public_read_ad_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ad-images');

-- Usuário logado faz upload na própria pasta
CREATE POLICY "auth_upload_merchant_images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'merchant-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "auth_upload_ad_images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "auth_upload_avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Usuário deleta apenas os próprios arquivos
CREATE POLICY "auth_delete_own_files"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

---

## BLOCO 20 — CRON JOBS (via pg_cron do Supabase)

```sql
-- Habilitar pg_cron (verificar se disponível no plano)
-- No Supabase Dashboard → Database → Extensions → pg_cron

-- Expirar anúncios classificados diariamente à meia-noite
SELECT cron.schedule(
  'expire-ads-daily',
  '0 0 * * *',
  $$ SELECT expire_ads(); $$
);

-- Expirar campanhas sociais diariamente
SELECT cron.schedule(
  'expire-campaigns-daily',
  '5 0 * * *',
  $$
    UPDATE campaigns
    SET status = 'expired'
    WHERE status = 'active' AND expires_at < now();
  $$
);
```

---

## RESUMO DAS TABELAS

| Tabela | Propósito | RLS |
|---|---|---|
| `profiles` | Usuários (espelha auth.users) | ✅ |
| `merchants` | Perfis de negócios | ✅ |
| `merchant_reviews` | Avaliações dos comércios | ✅ |
| `news` | Notícias do bairro | ✅ |
| `news_comments` | Comentários em notícias | ✅ |
| `ads` | Classificados C2C | ✅ |
| `campaigns` | Campanhas de ação social | ✅ |
| `merchant_campaigns` | Ofertas/promoções dos comércios | ✅ |
| `click_events` | Analytics de cliques e views | ✅ |
| `favorites` | Itens favoritos do usuário | ✅ |
| `notifications` | Notificações push/in-app | ✅ |
| `suggestions` | Sugestões da comunidade | ✅ |
| `tickets` | Tickets de suporte | ✅ |
| `audit_logs` | Histórico de ações administrativas | ✅ |
| `chat_history` | Histórico do chatbot Genkit | ✅ |

**Total: 15 tabelas**

---

## CHECKLIST DE EXECUÇÃO

```
□ BLOCO 1 — Extensões habilitadas
□ BLOCO 2 — Enum types criados
□ BLOCO 3 — profiles + trigger de novo usuário
□ BLOCO 4 — merchants + indexes
□ BLOCO 5 — merchant_reviews + trigger de rating
□ BLOCO 6 — news + indexes
□ BLOCO 7 — news_comments
□ BLOCO 8 — ads + expire_ads function
□ BLOCO 9 — campaigns
□ BLOCO 10 — merchant_campaigns
□ BLOCO 11 — click_events + RPCs de incremento
□ BLOCO 12 — favorites
□ BLOCO 13 — notifications
□ BLOCO 14 — suggestions
□ BLOCO 15 — tickets
□ BLOCO 16 — audit_logs + log_audit function
□ BLOCO 17 — chat_history
□ BLOCO 18 — RLS habilitado em todas as tabelas + políticas
□ BLOCO 19 — Storage buckets criados
□ BLOCO 20 — Cron jobs configurados
□ Testar trigger de novo usuário (criar conta e verificar profiles)
□ Testar RPC increment_merchant_view
□ Testar RLS: visitante só lê ativos, admin lê tudo
```

---

*Documento encerrado. Executar no Supabase Dashboard → SQL Editor antes da Fase 0 técnica.*
