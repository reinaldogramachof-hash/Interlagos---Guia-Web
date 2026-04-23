-- =============================================================
-- SEED — Vitrine: Teste Visual — 3 Premium + 3 Pro + 3 Básico
-- Executar no Supabase Dashboard > SQL Editor > New Query
--
-- owner_id admin: bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c
-- IDs merchants:  cccccccc-00xx-...
-- IDs posts:      dddddddd-0x00-...
--
-- Cobre todos os 6 temas (luxury, atelier, dark-tech, mercado, vibrante, negocios)
-- Cobre os 4 tipos de post (product, service, news, promo)
-- Básico não tem vitrine — aparece apenas na lista de comércios
-- =============================================================


-- ============================================================
-- SEÇÃO 1 — MERCHANTS PREMIUM (3)
-- Recursos: vitrine completa, sticky WA CTA, badge, store_badge_text
-- ============================================================

INSERT INTO merchants (
  id, owner_id, neighborhood, name, description, category, plan,
  image_url, phone, address, instagram, whatsapp, is_active, created_at,
  store_color, store_cover_url, store_tagline, store_description,
  store_badge_text, store_theme, store_url
) VALUES

-- Premium 1: Bella Cosméticos (tema: luxury — header dark + badge dourado)
('cccccccc-0001-0001-0001-000000000001',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Bella Cosméticos',
 'Cosméticos, perfumaria e cuidados com a pele. Produtos nacionais e importados.',
 'Beleza & Estética', 'premium',
 'https://picsum.photos/seed/bellalogo/200/200',
 '(12) 99901-0001',
 'Av. Interlagos, 120 — Parque Interlagos',
 'bellacosmeticos', '5512999010001',
 true, now() - interval '20 days',
 '#1f1f2e',
 'https://picsum.photos/seed/bellacapa/800/300',
 'Beleza que transforma. Entrega no bairro.',
 'A melhor seleção de cosméticos nacionais e importados. Atendimento personalizado.',
 '✨ Frete grátis acima de R$ 150',
 'luxury', null),

-- Premium 2: Ateliê da Moda (tema: atelier — rosa/pink)
('cccccccc-0002-0002-0002-000000000002',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Ateliê da Moda',
 'Costura, ajustes, customização e peças exclusivas feitas à mão no bairro.',
 'Moda & Vestuário', 'premium',
 'https://picsum.photos/seed/atelielogo/200/200',
 '(12) 99902-0002',
 'Rua das Flores, 45 — Parque Interlagos',
 'ateliedamoda_sjc', '5512999020002',
 true, now() - interval '15 days',
 '#be185d',
 'https://picsum.photos/seed/ateliecapa/800/300',
 'Moda exclusiva feita com amor no bairro.',
 'Criamos e ajustamos peças únicas. Modelagem sob medida, bordados e customização.',
 '👗 Primeira consulta gratuita',
 'atelier', null),

-- Premium 3: TechFix Soluções (tema: dark-tech — escuro com amber)
('cccccccc-0003-0003-0003-000000000003',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'TechFix Soluções',
 'Assistência técnica em notebooks, celulares, tablets e consoles. Garantia em todos os serviços.',
 'Tecnologia & Eletrônicos', 'premium',
 'https://picsum.photos/seed/techfixlogo/200/200',
 '(12) 99903-0003',
 'Rua da Tecnologia, 77 — Parque Interlagos',
 'techfixsjc', '5512999030003',
 true, now() - interval '10 days',
 '#f59e0b',
 'https://picsum.photos/seed/techfixcapa/800/300',
 'Conserta tudo. Rápido e com garantia.',
 'Assistência técnica especializada. Orçamento em até 2h. Garantia de 90 dias em todos os serviços.',
 '⚡ Diagnóstico gratuito',
 'dark-tech', null)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 2 — MERCHANTS PRO (3)
-- Recursos: vitrine, WA CTA ativado (hasVitrineProductCTA=true pós-fix),
--           sem store_badge_text, sem verified badge
-- ============================================================

INSERT INTO merchants (
  id, owner_id, neighborhood, name, description, category, plan,
  image_url, phone, address, instagram, whatsapp, is_active, created_at,
  store_color, store_cover_url, store_tagline, store_description,
  store_theme, store_url
) VALUES

-- Pro 1: Mercadinho do Zé (tema: mercado — verde esmeralda)
('cccccccc-0004-0004-0004-000000000004',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Mercadinho do Zé',
 'Mercadinho de bairro com hortifrúti fresquinho, laticínios, frios e bebidas geladas.',
 'Alimentação', 'pro',
 'https://picsum.photos/seed/mercadinhologo/200/200',
 '(12) 99904-0004',
 'Av. Principal, 200 — Parque Interlagos',
 'mercadinhodoze', '5512999040004',
 true, now() - interval '25 days',
 '#059669',
 'https://picsum.photos/seed/mercadinhocapa/800/300',
 'Tudo fresquinho do jeito que você gosta.',
 'Mercadinho completo com hortifrúti, frios e bebidas. Entrega no bairro a partir de R$ 50.',
 'mercado', null),

-- Pro 2: Studio Fit (tema: vibrante — violeta)
('cccccccc-0005-0005-0005-000000000005',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Studio Fit',
 'Personal trainer, treinos funcionais e aulas de yoga no coração do bairro.',
 'Saúde & Bem-Estar', 'pro',
 'https://picsum.photos/seed/studiologo/200/200',
 '(12) 99905-0005',
 'Rua do Esporte, 33 — Parque Interlagos',
 'studiofitsjc', '5512999050005',
 true, now() - interval '18 days',
 '#7c3aed',
 'https://picsum.photos/seed/studiocapa/800/300',
 'Seu corpo em forma, seu bairro em movimento.',
 'Personal trainer certificado, treinos funcionais, yoga e pilates. Aulas individuais e em grupo.',
 'vibrante', null),

-- Pro 3: Sabor da Vó (tema: negocios — indigo)
('cccccccc-0006-0006-0006-000000000006',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Sabor da Vó',
 'Marmitas caseiras, salgados e bolos para encomenda. Feito com amor no bairro.',
 'Gastronomia', 'pro',
 'https://picsum.photos/seed/saborlogo/200/200',
 '(12) 99906-0006',
 'Rua das Acácias, 88 — Parque Interlagos',
 'sabordavo_sjc', '5512999060006',
 true, now() - interval '12 days',
 '#4f46e5',
 'https://picsum.photos/seed/saborcapa/800/300',
 'Comida de casa com gostinho de amor.',
 'Marmitas caseiras, salgados para festa e bolos. Encomendas com 24h de antecedência.',
 'negocios', null)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 3 — MERCHANTS BÁSICO (3)
-- Sem vitrine — aparecem apenas na lista de comércios (MerchantsView)
-- ============================================================

INSERT INTO merchants (
  id, owner_id, neighborhood, name, description, category, plan,
  image_url, phone, address, instagram, whatsapp, is_active, created_at
) VALUES

('cccccccc-0007-0007-0007-000000000007',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Padaria Pão Quente',
 'Pão fresquinho todo dia a partir das 6h. Bolos, salgados e café da manhã completo.',
 'Padaria & Confeitaria', 'basic',
 'https://picsum.photos/seed/padarialogo/200/200',
 '(12) 99907-0007',
 'Rua do Pão, 12 — Parque Interlagos',
 'padariapaoquente', '5512999070007',
 true, now() - interval '30 days'),

('cccccccc-0008-0008-0008-000000000008',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Barbearia Top Corte',
 'Corte masculino, barba e sobrancelha. Atendimento com hora marcada. Ambiente climatizado.',
 'Barbearia & Salão', 'basic',
 'https://picsum.photos/seed/barbearialogo/200/200',
 '(12) 99908-0008',
 'Av. Central, 55 — Parque Interlagos',
 'topcortebarber', '5512999080008',
 true, now() - interval '22 days'),

('cccccccc-0009-0009-0009-000000000009',
 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c',
 'interlagos',
 'Pet Shop Animal Feliz',
 'Banho, tosa, petiscos e acessórios para cães e gatos. Agendamento pelo WhatsApp.',
 'Pet Shop', 'basic',
 'https://picsum.photos/seed/petshoplogo/200/200',
 '(12) 99909-0009',
 'Rua dos Animais, 60 — Parque Interlagos',
 'animalfeliz_interlagos', '5512999090009',
 true, now() - interval '8 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 4 — POSTS: PREMIUM 1 — Bella Cosméticos
-- 4 posts: promo (destaque), product, service, news
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0101-0101-0101-000000000001',
 'cccccccc-0001-0001-0001-000000000001', 'interlagos',
 'promo',
 'Kit Hidratação Facial — 30% OFF',
 'Kit completo com sérum vitamina C + hidratante FPS 50 + água micelar. Combo imperdível, só essa semana! Envio no bairro.',
 89.90, 'https://picsum.photos/seed/bella_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0102-0102-0102-000000000002',
 'cccccccc-0001-0001-0001-000000000001', 'interlagos',
 'product',
 'Perfume Importado 100ml',
 'Fragrância floral com notas de jasmim e baunilha. Duração de 8 a 12 horas. Ideal para uso diário.',
 229.00, 'https://picsum.photos/seed/bella_prod/400/400', true, now() - interval '3 days'),

('dddddddd-0103-0103-0103-000000000003',
 'cccccccc-0001-0001-0001-000000000001', 'interlagos',
 'service',
 'Consultoria de Skincare Personalizada',
 'Avaliação da pele + rotina personalizada de cuidados. 45 minutos. Agende pelo WhatsApp.',
 null, 'https://picsum.photos/seed/bella_serv/400/400', true, now() - interval '5 days'),

('dddddddd-0104-0104-0104-000000000004',
 'cccccccc-0001-0001-0001-000000000001', 'interlagos',
 'news',
 'Nova linha de maquiagem chegou!',
 'Coleção outono 2026 disponível: batons velvet, paleta de sombras e base de longa duração.',
 null, 'https://picsum.photos/seed/bella_news/400/400', true, now() - interval '2 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 5 — POSTS: PREMIUM 2 — Ateliê da Moda
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0201-0201-0201-000000000001',
 'cccccccc-0002-0002-0002-000000000002', 'interlagos',
 'promo',
 'Ajuste de Roupas com 30% OFF',
 'Bainha, cava, cintura e zíper com 30% de desconto essa semana. Válido para peças trazidas pelo cliente.',
 35.00, 'https://picsum.photos/seed/atelie_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0202-0202-0202-000000000002',
 'cccccccc-0002-0002-0002-000000000002', 'interlagos',
 'service',
 'Vestido sob Medida',
 'Criamos o vestido dos seus sonhos do zero. Consulta + molde + confecção. Prazo de 15 dias úteis.',
 450.00, 'https://picsum.photos/seed/atelie_serv/400/400', true, now() - interval '7 days'),

('dddddddd-0203-0203-0203-000000000003',
 'cccccccc-0002-0002-0002-000000000002', 'interlagos',
 'product',
 'Blusa Bordada Artesanal',
 'Blusa 100% algodão com bordado floral feito à mão. Disponível em P, M e G. Várias cores.',
 120.00, 'https://picsum.photos/seed/atelie_prod/400/400', true, now() - interval '4 days'),

('dddddddd-0204-0204-0204-000000000004',
 'cccccccc-0002-0002-0002-000000000002', 'interlagos',
 'news',
 'Coleção Inverno 2026 em breve!',
 'Novidades chegando: tecidos quentinhos, estampas exclusivas do bairro e peças em lã artesanal.',
 null, 'https://picsum.photos/seed/atelie_news/400/400', true, now() - interval '2 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 6 — POSTS: PREMIUM 3 — TechFix Soluções
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0301-0301-0301-000000000001',
 'cccccccc-0003-0003-0003-000000000003', 'interlagos',
 'promo',
 'Troca de Tela iPhone — Relâmpago',
 'Tela iPhone 12, 13 e 14 com peça original + mão de obra. Garantia 90 dias. Só essa semana!',
 320.00, 'https://picsum.photos/seed/techfix_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0302-0302-0302-000000000002',
 'cccccccc-0003-0003-0003-000000000003', 'interlagos',
 'service',
 'Formatação e Limpeza de Notebook',
 'Formatação completa, Windows original, limpeza interna e atualização de drivers. Entregamos no bairro.',
 180.00, 'https://picsum.photos/seed/techfix_serv/400/400', true, now() - interval '5 days'),

('dddddddd-0303-0303-0303-000000000003',
 'cccccccc-0003-0003-0003-000000000003', 'interlagos',
 'service',
 'Reparo de Console PS5 e Xbox',
 'Problemas de leitura de disco, HD, fonte e HDMI. Diagnóstico gratuito em até 2 horas.',
 null, 'https://picsum.photos/seed/techfix_serv2/400/400', true, now() - interval '3 days'),

('dddddddd-0304-0304-0304-000000000004',
 'cccccccc-0003-0003-0003-000000000003', 'interlagos',
 'product',
 'Película de Vidro Temperado 9H',
 'Para todos os modelos iPhone e Samsung. Instalação grátis na loja. Proteção contra quedas.',
 25.00, 'https://picsum.photos/seed/techfix_prod/400/400', true, now() - interval '6 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 7 — POSTS: PRO 1 — Mercadinho do Zé
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0401-0401-0401-000000000001',
 'cccccccc-0004-0004-0004-000000000004', 'interlagos',
 'promo',
 'Frutas da Semana em Oferta',
 'Maçã, banana e mamão fresquinhos com preço especial. Compre pelo WhatsApp e retire ou receba em casa.',
 null, 'https://picsum.photos/seed/mercado_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0402-0402-0402-000000000002',
 'cccccccc-0004-0004-0004-000000000004', 'interlagos',
 'product',
 'Cesta Básica Completa — 20 Itens',
 'Arroz, feijão, óleo, açúcar, café, macarrão e mais. Monte a sua ou leve a completa. Entrega no bairro.',
 189.90, 'https://picsum.photos/seed/mercado_prod/400/400', true, now() - interval '3 days'),

('dddddddd-0403-0403-0403-000000000003',
 'cccccccc-0004-0004-0004-000000000004', 'interlagos',
 'service',
 'Entrega em Domicílio — Grátis',
 'Compras a partir de R$ 50 com entrega grátis no Parque Interlagos. Pedidos pelo WhatsApp até as 18h.',
 null, 'https://picsum.photos/seed/mercado_serv/400/400', true, now() - interval '2 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 8 — POSTS: PRO 2 — Studio Fit
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0501-0501-0501-000000000001',
 'cccccccc-0005-0005-0005-000000000005', 'interlagos',
 'promo',
 'Pacote 4 Aulas por R$ 120',
 'Promoção de inverno: 4 aulas de treino funcional ou yoga pelo preço de 3. Agende pelo WhatsApp.',
 120.00, 'https://picsum.photos/seed/studio_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0502-0502-0502-000000000002',
 'cccccccc-0005-0005-0005-000000000005', 'interlagos',
 'service',
 'Personal Trainer — Aula Experimental',
 'Primeira aula experimental gratuita! Treino funcional personalizado com avaliação física completa.',
 null, 'https://picsum.photos/seed/studio_serv/400/400', true, now() - interval '4 days'),

('dddddddd-0503-0503-0503-000000000003',
 'cccccccc-0005-0005-0005-000000000005', 'interlagos',
 'service',
 'Aulas de Yoga — Turma da Manhã',
 'Yoga para iniciantes e avançados. Turmas às Ter/Qui/Sáb às 7h. Tapetes disponíveis na loja.',
 160.00, 'https://picsum.photos/seed/studio_serv2/400/400', true, now() - interval '6 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SEÇÃO 9 — POSTS: PRO 3 — Sabor da Vó
-- ============================================================

INSERT INTO merchant_posts (id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at)
VALUES

('dddddddd-0601-0601-0601-000000000001',
 'cccccccc-0006-0006-0006-000000000006', 'interlagos',
 'promo',
 'Marmita + Suco R$ 18 — Hoje!',
 'Marmita do dia com proteína, arroz, feijão e salada + suco natural por R$ 18. Retirada até as 12h.',
 18.00, 'https://picsum.photos/seed/sabor_promo/400/400', true, now() - interval '1 day'),

('dddddddd-0602-0602-0602-000000000002',
 'cccccccc-0006-0006-0006-000000000006', 'interlagos',
 'product',
 'Bolo de Pote — 12 unidades',
 'Bolo de pote de chocolate, morango ou limão. Encomende com 24h de antecedência. Ideal para festas.',
 96.00, 'https://picsum.photos/seed/sabor_prod/400/400', true, now() - interval '3 days'),

('dddddddd-0603-0603-0603-000000000003',
 'cccccccc-0006-0006-0006-000000000006', 'interlagos',
 'service',
 'Buffet de Salgados para Festa',
 'Coxinhas, enroladinhos, quibes e empadas. Mínimo 50 unidades. Entrega no bairro inclusa acima de 100 un.',
 null, 'https://picsum.photos/seed/sabor_serv/400/400', true, now() - interval '5 days')

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- CLEANUP — Para remover todos os dados deste seed:
-- (descomente e execute quando quiser limpar)
-- ============================================================
-- DELETE FROM merchant_posts WHERE merchant_id::text LIKE 'cccccccc-%';
-- DELETE FROM merchants       WHERE id::text         LIKE 'cccccccc-%';
