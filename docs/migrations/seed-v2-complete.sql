-- =============================================================
-- SEED v2 — Dados de Teste Completos — Parque Interlagos
-- Aplicar no SQL Editor do Supabase Dashboard
-- Pré-requisito: add-neighborhood-column.sql + sprint1-lgpd.sql já aplicados
--
-- owner_id / admin UUID: bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c
--
-- ORDEM DE EXECUÇÃO:
--   1. CORREÇÕES (corrige bugs do seed v1)
--   2. NEIGHBORHOODS
--   3. PROFILES
--   4. PUBLIC_SERVICES
--   5. POLLS + POLL_OPTIONS
--   6. NOTIFICATIONS
--   7. TICKETS
--   8. CLICK_EVENTS (auditoria)
-- =============================================================


-- =============================================================
-- SEÇÃO 1 — CORREÇÕES DO SEED V1
-- Dois bugs críticos que tornam dados invisíveis no app
-- =============================================================

-- BUG #1: fetchAds() filtra status = 'approved', mas seed v1 inseriu 'active'
-- Resultado: Nenhum anúncio aparecia na view de Classificados
UPDATE ads
SET status = 'approved'
WHERE id::text LIKE '44444444-%' AND status = 'active';

-- BUG #2: ProCarousel filtra plan = 'professional', mas seed v1 inseriu 'pro'
-- Resultado: Merchants Pro não apareciam no carrossel de destaques
UPDATE merchants
SET plan = 'professional'
WHERE id::text LIKE '11111111-%' AND plan = 'pro';

-- BUG #3: Adiciona plano 'basic' que estava faltando (entre free e professional)
INSERT INTO merchants (id, owner_id, neighborhood, name, description, category, plan, image_url, phone, address, instagram, whatsapp, is_active, created_at)
VALUES
('11111111-0009-0009-0009-000000000009', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Lava Jato Brilho Total', 'Lavagem completa, higienização interna e polimento. Resultado profissional no bairro.',
 'Automotivo', 'basic', 'https://picsum.photos/seed/lavajato/400/300',
 '(12) 99809-9999', 'Rua das Bromélias, 90 — Parque Interlagos',
 'lavajatobrilho', '5512998099999', true, now() - interval '8 days'),

('11111111-0010-0010-0010-000000000010', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Desentupidora Rápida SJC', 'Desentupimento de esgoto, pia, ralo e fossa. Atendimento 24h no bairro.',
 'Construção', 'basic', 'https://picsum.photos/seed/desen1/400/300',
 '(12) 99810-0000', 'Rua das Orquídeas, 67 — Parque Interlagos',
 'desentupidorasjc', '5512998100000', true, now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SEÇÃO 2 — NEIGHBORHOODS
-- Tabela de bairros da plataforma
-- =============================================================

CREATE TABLE IF NOT EXISTS neighborhoods (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL UNIQUE,
  name       text NOT NULL,
  city       text NOT NULL DEFAULT 'São José dos Campos',
  state      text NOT NULL DEFAULT 'SP',
  is_active  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO neighborhoods (slug, name, city, state, is_active) VALUES
('interlagos',            'Parque Interlagos',       'São José dos Campos', 'SP', true),
('santa-julia',           'Santa Júlia',             'São José dos Campos', 'SP', false),
('parque-novo-horizonte', 'Parque Novo Horizonte',   'São José dos Campos', 'SP', false),
('jardim-das-industrias', 'Jardim das Indústrias',   'São José dos Campos', 'SP', false)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================
-- SEÇÃO 3 — PROFILES
-- Atualiza o perfil do admin e insere perfis de teste adicionais
-- NOTA: Perfis reais são criados pelo trigger handle_new_user.
--       Aqui apenas garantimos que o admin esteja configurado.
-- =============================================================

UPDATE profiles SET
  display_name        = 'Reinaldo (Admin)',
  full_name           = 'Reinaldo Admin',
  role                = 'master',
  neighborhood        = 'interlagos',
  onboarding_completed = true,
  terms_accepted_at   = now() - interval '30 days'
WHERE id = 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c';


-- =============================================================
-- SEÇÃO 4 — PUBLIC_SERVICES
-- Serviços públicos e emergências (view Utilidade Pública)
-- Campos esperados pelo fetchPublicServices:
--   id, neighborhood, name, description, phone, category,
--   is_emergency, icon (opcional), created_at
-- =============================================================

CREATE TABLE IF NOT EXISTS public_services (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood text NOT NULL DEFAULT 'interlagos',
  name         text NOT NULL,
  description  text,
  phone        text,
  category     text NOT NULL DEFAULT 'Geral',
  is_emergency boolean NOT NULL DEFAULT false,
  icon         text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_services_select" ON public_services;
CREATE POLICY "public_services_select" ON public_services FOR SELECT USING (true);

INSERT INTO public_services (neighborhood, name, description, phone, category, is_emergency, icon) VALUES

-- Emergências (is_emergency = true — aparecem primeiro na ordenação)
('interlagos', 'SAMU — Serviço de Atendimento Móvel de Urgência',
 'Emergências médicas, acidentes e resgate. Funciona 24 horas por dia, 7 dias por semana.',
 '192', 'Saúde', true, 'ambulance'),

('interlagos', 'Bombeiros — Corpo de Bombeiros SJC',
 'Incêndios, resgates, acidentes com vítimas e desastres naturais.',
 '193', 'Segurança', true, 'flame'),

('interlagos', 'Polícia Militar — 190',
 'Emergências policiais, crimes em andamento, perturbação da ordem.',
 '190', 'Segurança', true, 'shield'),

('interlagos', 'Defesa Civil — SJC',
 'Situações de risco: alagamento, deslizamento, estruturas comprometidas.',
 '199', 'Segurança', true, 'alert-triangle'),

-- Serviços públicos locais (is_emergency = false)
('interlagos', 'UBS Parque Interlagos',
 'Unidade Básica de Saúde. Agendamentos, consultas, vacinas e curativos. Seg–Sex 7h–17h, Sáb 7h–12h.',
 '(12) 3931-0000', 'Saúde', false, 'cross'),

('interlagos', 'CRAS Interlagos — Centro de Referência de Assistência Social',
 'Benefícios sociais, Bolsa Família, cadastro único, orientação e assistência a famílias vulneráveis.',
 '(12) 3934-5100', 'Assistência Social', false, 'heart'),

('interlagos', 'Subprefeitura Zona Sul — SJC',
 'Serviços municipais, reclamações de obras, iluminação pública, limpeza e zeladoria do bairro.',
 '(12) 3931-9300', 'Prefeitura', false, 'building'),

('interlagos', 'SAAE — Saneamento Básico SJC',
 'Falta d''água, vazamentos, esgoto e coleta. Atendimento 24h para emergências.',
 '0800-770-0010', 'Saneamento', false, 'droplets'),

('interlagos', 'Enel — Emergência Elétrica',
 'Falta de energia, fio caído, poste danificado. Atendimento emergencial 24h.',
 '0800-722-0048', 'Energia', false, 'zap'),

('interlagos', 'Conselho Tutelar — Zona Sul SJC',
 'Proteção dos direitos de crianças e adolescentes. Denúncias de maus-tratos, abandono e violência.',
 '(12) 3941-5533', 'Proteção Social', false, 'users');


-- =============================================================
-- SEÇÃO 5 — POLLS + POLL_OPTIONS
-- Enquetes do bairro (view Enquetes)
-- Estrutura:
--   polls: id, neighborhood, question, status, created_at
--   poll_options: id, poll_id, text, display_order
--   poll_votes: id, poll_id, option_id, user_id, neighborhood
-- =============================================================

CREATE TABLE IF NOT EXISTS polls (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood text NOT NULL DEFAULT 'interlagos',
  question     text NOT NULL,
  status       text NOT NULL DEFAULT 'active', -- 'active' | 'closed'
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS poll_options (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id       uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text          text NOT NULL,
  display_order int  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS poll_votes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id      uuid NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id    uuid NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL,
  neighborhood text NOT NULL DEFAULT 'interlagos',
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, user_id) -- cada usuário vota uma vez por enquete
);

-- RLS policies
ALTER TABLE polls        ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "polls_select"        ON polls;
DROP POLICY IF EXISTS "poll_options_select" ON poll_options;
DROP POLICY IF EXISTS "poll_votes_select"   ON poll_votes;
DROP POLICY IF EXISTS "poll_votes_insert"   ON poll_votes;

CREATE POLICY "polls_select"        ON polls        FOR SELECT USING (true);
CREATE POLICY "poll_options_select" ON poll_options FOR SELECT USING (true);
CREATE POLICY "poll_votes_select"   ON poll_votes   FOR SELECT USING (true);
CREATE POLICY "poll_votes_insert"   ON poll_votes   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RPC para votação segura (evita race condition no UNIQUE check)
CREATE OR REPLACE FUNCTION submit_poll_vote(
  p_poll_id     uuid,
  p_option_id   uuid,
  p_user_id     uuid,
  p_neighborhood text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO poll_votes (poll_id, option_id, user_id, neighborhood)
  VALUES (p_poll_id, p_option_id, p_user_id, p_neighborhood)
  ON CONFLICT (poll_id, user_id) DO NOTHING;
END;
$$;

-- Dados de enquete
INSERT INTO polls (id, neighborhood, question, status, created_at) VALUES
('66666666-0001-0001-0001-000000000001', 'interlagos',
 'O que você gostaria de ver no Parque Interlagos nos próximos meses?',
 'active', now() - interval '5 days'),

('66666666-0002-0002-0002-000000000002', 'interlagos',
 'Qual o maior problema de mobilidade no bairro atualmente?',
 'active', now() - interval '3 days'),

('66666666-0003-0003-0003-000000000003', 'interlagos',
 'Você utilizaria um aplicativo de caronas solidárias dentro do bairro?',
 'closed', now() - interval '15 days')
ON CONFLICT (id) DO NOTHING;

-- Opções — enquete 1
INSERT INTO poll_options (id, poll_id, text, display_order) VALUES
('77777777-0101-0101-0101-000000000001', '66666666-0001-0001-0001-000000000001', 'Academia ao ar livre', 1),
('77777777-0102-0102-0102-000000000002', '66666666-0001-0001-0001-000000000001', 'Playground para crianças', 2),
('77777777-0103-0103-0103-000000000003', '66666666-0001-0001-0001-000000000001', 'Pista de caminhada iluminada', 3),
('77777777-0104-0104-0104-000000000004', '66666666-0001-0001-0001-000000000001', 'Feira de artesanato semanal', 4)
ON CONFLICT (id) DO NOTHING;

-- Opções — enquete 2
INSERT INTO poll_options (id, poll_id, text, display_order) VALUES
('77777777-0201-0201-0201-000000000001', '66666666-0002-0002-0002-000000000002', 'Falta de ciclofaixa', 1),
('77777777-0202-0202-0202-000000000002', '66666666-0002-0002-0002-000000000002', 'Calçadas com buracos e irregulares', 2),
('77777777-0203-0203-0203-000000000003', '66666666-0002-0002-0002-000000000002', 'Semáforos mal sincronizados', 3),
('77777777-0204-0204-0204-000000000004', '66666666-0002-0002-0002-000000000002', 'Ponto de ônibus sem cobertura', 4),
('77777777-0205-0205-0205-000000000005', '66666666-0002-0002-0002-000000000002', 'Velocidade excessiva na Av. Interlagos', 5)
ON CONFLICT (id) DO NOTHING;

-- Opções — enquete 3 (fechada — tem votos)
INSERT INTO poll_options (id, poll_id, text, display_order) VALUES
('77777777-0301-0301-0301-000000000001', '66666666-0003-0003-0003-000000000003', 'Sim, com certeza!', 1),
('77777777-0302-0302-0302-000000000002', '66666666-0003-0003-0003-000000000003', 'Talvez, dependeria do app', 2),
('77777777-0303-0303-0303-000000000003', '66666666-0003-0003-0003-000000000003', 'Não me sinto seguro com isso', 3),
('77777777-0304-0304-0304-000000000004', '66666666-0003-0003-0003-000000000003', 'Prefiro pagar um serviço formal', 4)
ON CONFLICT (id) DO NOTHING;

-- Votos simulados na enquete fechada (usa admin UUID como único votante válido)
-- Em produção, votos reais virão dos usuários autenticados
INSERT INTO poll_votes (poll_id, option_id, user_id, neighborhood) VALUES
('66666666-0003-0003-0003-000000000003', '77777777-0301-0301-0301-000000000001',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos')
ON CONFLICT (poll_id, user_id) DO NOTHING;


-- =============================================================
-- SEÇÃO 6 — NOTIFICATIONS
-- Notificações de teste para o usuário admin
-- (validar NotificationBell, marcação como lida, contagem de não-lidas)
-- =============================================================

INSERT INTO notifications (id, user_id, title, body, is_read, type, ref_id, created_at) VALUES

('88888888-0001-0001-0001-000000000001',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Bem-vindo ao Tem No Bairro!',
 'Seu cadastro foi confirmado. Explore o melhor do Parque Interlagos.',
 true, 'info', null, now() - interval '7 days'),

('88888888-0002-0002-0002-000000000002',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Novo anúncio aguardando aprovação',
 'Um classificado foi enviado e está em análise. Acesse o painel admin.',
 false, 'info', '44444444-0001-0001-0001-000000000001', now() - interval '2 days'),

('88888888-0003-0003-0003-000000000003',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Sugestão recebeu 42 votos!',
 '"Ponto de Ônibus com Cobertura" é a sugestão mais votada do bairro.',
 false, 'success', '55555555-0004-0004-0004-000000000004', now() - interval '1 day'),

('88888888-0004-0004-0004-000000000004',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Novo ticket de suporte aberto',
 'Um morador enviou uma solicitação de suporte. Verifique o painel.',
 false, 'warning', null, now() - interval '3 hours'),

('88888888-0005-0005-0005-000000000005',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Campanha expirada automaticamente',
 'A campanha "Combo Manicure + Pedicure" encerrou em 31/03.',
 true, 'info', '22222222-0003-0003-0003-000000000003', now() - interval '5 days')

ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SEÇÃO 7 — TICKETS
-- Tickets de suporte (view Suporte no AdminPanel)
-- Campos: author_id, subject, body, status, resolved_at, resolved_by
-- Status: 'open' | 'in_progress' | 'resolved' | 'rejected'
-- =============================================================

INSERT INTO tickets (id, author_id, subject, body, status, resolved_at, resolved_by, created_at) VALUES

('99999999-0001-0001-0001-000000000001',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Meu comércio não aparece na busca',
 'Cadastrei meu negócio há 3 dias mas ele não aparece na lista de comércios. Já revisei os dados e estão corretos. Meu ID é 11111111-0006. O que pode estar errado?',
 'open', null, null, now() - interval '2 days'),

('99999999-0002-0002-0002-000000000002',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Anúncio removido sem motivo',
 'Meu anúncio da bicicleta foi removido mas não recebi nenhuma notificação explicando o motivo. Preciso de esclarecimentos para saber se posso repostar.',
 'in_progress', null, null, now() - interval '4 days'),

('99999999-0003-0003-0003-000000000003',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'Solicitação de upgrade de plano',
 'Gostaria de fazer o upgrade do meu plano de Básico para Pro. Como funciona o processo de pagamento? Aceita PIX?',
 'resolved',
 now() - interval '1 day',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 now() - interval '6 days')

ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SEÇÃO 8 — CLICK_EVENTS
-- Analytics de cliques (proxy de auditoria no AdminPanel > Auditoria)
-- Campos: entity_id, entity_type, neighborhood, user_id, session_id
-- =============================================================

INSERT INTO click_events (id, entity_id, entity_type, neighborhood, user_id, session_id, created_at) VALUES

('aaaaaaaa-0001-0001-0001-000000000001',
 '11111111-0001-0001-0001-000000000001', 'merchant_view',
 'interlagos', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'sess-001', now() - interval '1 hour'),

('aaaaaaaa-0002-0002-0002-000000000002',
 '11111111-0001-0001-0001-000000000001', 'merchant_contact',
 'interlagos', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'sess-001', now() - interval '58 minutes'),

('aaaaaaaa-0003-0003-0003-000000000003',
 '11111111-0002-0002-0002-000000000002', 'merchant_view',
 'interlagos', null,
 'sess-002', now() - interval '3 hours'),

('aaaaaaaa-0004-0004-0004-000000000004',
 '44444444-0003-0003-0003-000000000003', 'ad_view',
 'interlagos', null,
 'sess-003', now() - interval '45 minutes'),

('aaaaaaaa-0005-0005-0005-000000000005',
 '33333333-0002-0002-0002-000000000002', 'news_view',
 'interlagos', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'sess-001', now() - interval '30 minutes'),

('aaaaaaaa-0006-0006-0006-000000000006',
 '11111111-0003-0003-0003-000000000003', 'merchant_view',
 'interlagos', null,
 'sess-004', now() - interval '2 hours'),

('aaaaaaaa-0007-0007-0007-000000000007',
 '11111111-0004-0004-0004-000000000004', 'merchant_contact',
 'interlagos', null,
 'sess-005', now() - interval '5 hours')

ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SEÇÃO 9 — CAMPANHA DE DOAÇÃO (Campaigns sem merchant_id)
-- View DonationsView usa fetchCampaigns() — campanha comunitária
-- Diferente das campanhas de desconto de comerciantes
-- Campo requester_id usado por fetchCampaignsByUser
-- =============================================================

INSERT INTO campaigns (id, neighborhood, title, description, discount, start_date, end_date, status, created_at)
VALUES
('22222222-0010-0010-0010-000000000010', 'interlagos',
 '🌳 Plantio de Árvores no Parque Interlagos',
 'Arrecadamos mudas de árvores nativas para plantar no parque. Cada doação ajuda a reflorestar o bairro e combater o calor. Meta: 50 mudas. Já temos 32!',
 0, '2026-03-01', '2026-05-31', 'active', now() - interval '25 days'),

('22222222-0011-0011-0011-000000000011', 'interlagos',
 '📚 Biblioteca Comunitária Interlagos',
 'Doação de livros e montagem de uma biblioteca comunitária no espaço do CRAS. Aceita livros didáticos, literatura e infantil. Ponto de coleta: UBS Interlagos.',
 0, '2026-03-10', '2026-04-30', 'active', now() - interval '16 days')

ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- SEÇÃO 10 — ADS PENDENTES DE APROVAÇÃO
-- Para testar o fluxo de aprovação no AdminPanel > Aprovações
-- =============================================================

INSERT INTO ads (id, seller_id, neighborhood, title, description, price, category, image_url, status, created_at) VALUES

('44444444-0007-0007-0007-000000000007', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Televisão Samsung 50" Smart TV 4K',
 'TV Samsung 50 polegadas, 4K, Smart TV, HDMI x3, Wifi. Comprada em 2023, perfeito estado. Acompanha suporte de parede. Retirar no bairro.',
 1800.00, 'Eletrônicos', 'https://picsum.photos/seed/tv1/400/300', 'pending', now() - interval '6 hours'),

('44444444-0008-0008-0008-000000000008', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Serviço de Jardinagem — Quintal e Jardim',
 'Faço limpeza e manutenção de jardins, corte de grama, poda e plantio. Atendo no Parque Interlagos e arredores. Orçamento sem compromisso.',
 150.00, 'Serviços', 'https://picsum.photos/seed/jardim1/400/300', 'pending', now() - interval '1 hour')

ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- CLEANUP — Para resetar todos os dados do seed v2:
-- (descomente e execute quando quiser limpar)
-- =============================================================
-- DELETE FROM click_events      WHERE id::text LIKE 'aaaaaaaa-%';
-- DELETE FROM tickets           WHERE id::text LIKE '99999999-%';
-- DELETE FROM notifications     WHERE id::text LIKE '88888888-%';
-- DELETE FROM poll_votes        WHERE poll_id::text LIKE '66666666-%';
-- DELETE FROM poll_options      WHERE poll_id::text LIKE '66666666-%';
-- DELETE FROM polls             WHERE id::text LIKE '66666666-%';
-- DELETE FROM ads               WHERE id IN ('44444444-0007-0007-0007-000000000007','44444444-0008-0008-0008-000000000008');
-- DELETE FROM campaigns         WHERE id IN ('22222222-0010-0010-0010-000000000010','22222222-0011-0011-0011-000000000011');
-- DELETE FROM merchants         WHERE id IN ('11111111-0009-0009-0009-000000000009','11111111-0010-0010-0010-000000000010');
-- DELETE FROM public_services   WHERE neighborhood = 'interlagos';
-- DELETE FROM neighborhoods     WHERE slug IN ('interlagos','santa-julia','parque-novo-horizonte','jardim-das-industrias');
-- Para reverter bugs do seed v1:
-- UPDATE ads      SET status = 'active'       WHERE id::text LIKE '44444444-0001%' OR id::text LIKE '44444444-0002%' OR id::text LIKE '44444444-0003%';
-- UPDATE merchants SET plan  = 'pro'          WHERE id IN ('11111111-0003-0003-0003-000000000003','11111111-0004-0004-0004-000000000004','11111111-0005-0005-0005-000000000005');
