-- =============================================================
-- SEED: Dados de Teste — Parque Interlagos
-- Aplicar no SQL Editor do Supabase Dashboard
-- user_id do admin/owner: bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c
-- Para resetar: rode o bloco CLEANUP no final deste arquivo
-- =============================================================

-- =============================================================
-- MERCHANTS (8 comerciantes — mix de planos)
-- =============================================================
INSERT INTO merchants (id, owner_id, neighborhood, name, description, category, plan, image_url, phone, address, instagram, whatsapp, is_active, created_at) VALUES

-- PREMIUM
('11111111-0001-0001-0001-000000000001', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Restaurante do Bairro', 'Comida caseira quentinha todo dia. Marmitas e pratos feitos com ingredientes frescos do bairro.',
 'Restaurantes', 'premium', 'https://picsum.photos/seed/rest1/400/300',
 '(12) 99801-1111', 'Av. Interlagos, 450 — Parque Interlagos',
 'restaurantodobairro', '5512998011111', true, now() - interval '60 days'),

('11111111-0002-0002-0002-000000000002', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Farmácia Saúde & Vida', 'Medicamentos, dermocosméticos e atendimento farmacêutico. Delivery no bairro.',
 'Saúde', 'premium', 'https://picsum.photos/seed/farm1/400/300',
 '(12) 99802-2222', 'Rua das Palmeiras, 120 — Parque Interlagos',
 'farmaciasaudvida', '5512998022222', true, now() - interval '55 days'),

-- PRO
('11111111-0003-0003-0003-000000000003', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Studio Beleza Total', 'Salão de beleza completo: corte, escova, manicure, sobrancelha e muito mais.',
 'Beleza', 'pro', 'https://picsum.photos/seed/salon1/400/300',
 '(12) 99803-3333', 'Rua Jabuticabeiras, 78 — Parque Interlagos',
 'studiobелезаtotal', '5512998033333', true, now() - interval '45 days'),

('11111111-0004-0004-0004-000000000004', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Pet Shop Patinhas', 'Banho, tosa, ração, acessórios e consultas veterinárias. Agendamento online.',
 'Pet', 'pro', 'https://picsum.photos/seed/pet1/400/300',
 '(12) 99804-4444', 'Rua dos Pinheiros, 33 — Parque Interlagos',
 'petshoppatinhas', '5512998044444', true, now() - interval '40 days'),

('11111111-0005-0005-0005-000000000005', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Auto Peças Interlagos', 'Peças, acessórios e serviços automotivos. Mecânico de confiança no bairro há 15 anos.',
 'Automotivo', 'pro', 'https://picsum.photos/seed/auto1/400/300',
 '(12) 99805-5555', 'Av. Interlagos, 890 — Parque Interlagos',
 'autopecasinterlagos', '5512998055555', true, now() - interval '30 days'),

-- FREE
('11111111-0006-0006-0006-000000000006', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Mercadinho Família', 'Hortifrúti, mercearia e bebidas. Entrega rápida no bairro.',
 'Lojas', 'free', 'https://picsum.photos/seed/merc1/400/300',
 '(12) 99806-6666', 'Rua das Acácias, 210 — Parque Interlagos',
 'mercadinhofamilia', '5512998066666', true, now() - interval '20 days'),

('11111111-0007-0007-0007-000000000007', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Escola de Reforço Saber', 'Reforço escolar para Ensino Fundamental e Médio. Turmas reduzidas e atenção individual.',
 'Educação', 'free', 'https://picsum.photos/seed/edu1/400/300',
 '(12) 99807-7777', 'Rua das Magnólias, 55 — Parque Interlagos',
 'escolasaber', '5512998077777', true, now() - interval '15 days'),

('11111111-0008-0008-0008-000000000008', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Construserv Reformas', 'Pintura, elétrica, hidráulica e pequenas reformas. Orçamento grátis.',
 'Construção', 'free', 'https://picsum.photos/seed/const1/400/300',
 '(12) 99808-8888', 'Rua das Hortênsias, 14 — Parque Interlagos',
 'construservreformas', '5512998088888', true, now() - interval '10 days');


-- =============================================================
-- CAMPAIGNS (4 campanhas vinculadas a merchants pro/premium)
-- =============================================================
INSERT INTO campaigns (id, merchant_id, neighborhood, title, description, discount, start_date, end_date, status) VALUES

('22222222-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001', 'interlagos',
 '🍽️ Marmita em Dobro às Quartas', 'Na compra de 2 marmitas toda quarta-feira, a menor sai pela metade do preço.',
 50, '2026-03-24', '2026-04-30', 'active'),

('22222222-0002-0002-0002-000000000002', '11111111-0002-0002-0002-000000000002', 'interlagos',
 '💊 15% em Suplementos', 'Desconto especial em toda linha de vitaminas e suplementos alimentares.',
 15, '2026-03-20', '2026-04-20', 'active'),

('22222222-0003-0003-0003-000000000003', '11111111-0003-0003-0003-000000000003', 'interlagos',
 '💅 Combo Manicure + Pedicure', 'Combo com 20% de desconto toda segunda e terça-feira.',
 20, '2026-03-01', '2026-03-31', 'active'),

('22222222-0004-0004-0004-000000000004', '11111111-0004-0004-0004-000000000004', 'interlagos',
 '🐾 Banho & Tosa com Brinde', 'Leve seu pet para banho e tosa e ganhe um sachê de ração premium.',
 0, '2026-03-15', '2026-04-15', 'active');


-- =============================================================
-- NEWS (6 notícias — categorias variadas)
-- =============================================================
INSERT INTO news (id, author_id, neighborhood, title, content, image_url, category, status, created_at) VALUES

('33333333-0001-0001-0001-000000000001', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Mutirão de Limpeza no Parque Interlagos — Participe!',
 'A Associação de Moradores do Parque Interlagos organiza um grande mutirão de limpeza no próximo sábado, dia 29 de março, às 8h. Ponto de encontro: portão principal do parque. Traga luvas e boa vontade! Sacos de lixo e água serão fornecidos. Juntos tornamos nosso bairro ainda mais bonito.',
 'https://picsum.photos/seed/news1/800/400', 'Eventos', 'published', now() - interval '2 days'),

('33333333-0002-0002-0002-000000000002', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'ATENÇÃO: Obra na Av. Interlagos causa interdição parcial',
 'A Prefeitura de São José dos Campos iniciou obras de recapeamento na Av. Interlagos entre os números 300 e 600. A previsão é de 10 dias. Uma faixa de rolamento permanece aberta. Motoristas devem usar vias alternativas pela Rua das Palmeiras. Pedestre, atenção à sinalização.',
 'https://picsum.photos/seed/news2/800/400', 'Urgente', 'published', now() - interval '1 day'),

('33333333-0003-0003-0003-000000000003', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'UBS Parque Interlagos amplia horário de atendimento',
 'A partir de segunda-feira, 31 de março, a UBS Parque Interlagos passa a funcionar também aos sábados, das 7h às 12h. O atendimento de sábado será para consultas agendadas previamente. Vacinas e curativos também disponíveis. Agende pelo telefone (12) 3931-0000.',
 'https://picsum.photos/seed/news3/800/400', 'Saúde', 'published', now() - interval '3 hours'),

('33333333-0004-0004-0004-000000000004', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Novo semáforo na Rua das Palmeiras reduz acidentes',
 'Após pedido da comunidade do Parque Interlagos, a CET-SJC instalou semáforo na esquina da Rua das Palmeiras com a Av. Interlagos. Os moradores comemoraram a medida, reivindicada há mais de 2 anos. O equipamento entra em operação plena nesta semana.',
 'https://picsum.photos/seed/news4/800/400', 'Trânsito', 'published', now() - interval '5 days'),

('33333333-0005-0005-0005-000000000005', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Campeonato de Futebol Society do Bairro — Inscrições Abertas',
 'O 3º Campeonato de Futebol Society do Parque Interlagos está com inscrições abertas até 5 de abril. Times de 7 jogadores, taxa de inscrição R$80 por equipe. Os jogos acontecem aos sábados e domingos no campo do Parque. Campeão leva troféu e R$500. Contato: (12) 99900-0000.',
 'https://picsum.photos/seed/news5/800/400', 'Eventos', 'published', now() - interval '4 days'),

('33333333-0006-0006-0006-000000000006', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Calçamento da Rua das Hortênsias: previsão de início em abril',
 'A Secretaria de Obras de SJC confirmou que o calçamento da Rua das Hortênsias, reivindicação antiga dos moradores, deverá começar em abril de 2026. A rua receberá paralelepípedos e sarjetas novas. Moradores devem manter as calçadas limpas para facilitar o trabalho das equipes.',
 'https://picsum.photos/seed/news6/800/400', 'Urbanismo', 'published', now() - interval '6 days');


-- =============================================================
-- ADS — Classificados C2C (6 anúncios)
-- =============================================================
INSERT INTO ads (id, seller_id, neighborhood, title, description, price, category, image_url, status, created_at) VALUES

('44444444-0001-0001-0001-000000000001', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Bicicleta Caloi Aro 26 — Semi-nova',
 'Bicicleta Caloi Aro 26, 21 marchas, freio a disco, ótimo estado. Comprei há 8 meses e uso pouco. Acompanha capacete. Retirar no bairro.',
 450.00, 'Outros', 'https://picsum.photos/seed/ad1/400/300', 'active', now() - interval '3 days'),

('44444444-0002-0002-0002-000000000002', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Sofá 3 Lugares Retrátil — Cinza',
 'Sofá retrátil e reclinável, 3 lugares, tecido suede cinza, pouco uso. Largura 2,10m. Buscar no bairro, não faço entrega. Aceito PIX.',
 800.00, 'Outros', 'https://picsum.photos/seed/ad2/400/300', 'active', now() - interval '5 days'),

('44444444-0003-0003-0003-000000000003', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'iPhone 13 128GB — Preto — Com NF',
 'iPhone 13 128GB preto, excelente estado, com nota fiscal e caixa original. Bateria 91%. Sem arranhões. Motivo da venda: upgrade.',
 2800.00, 'Outros', 'https://picsum.photos/seed/ad3/400/300', 'active', now() - interval '1 day'),

('44444444-0004-0004-0004-000000000004', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Curso de Inglês — Material Completo',
 'Material completo do curso de inglês CCAA, 4 volumes, dvds e cadernos de exercício. Nunca usado. Ideal para quem quer estudar em casa.',
 120.00, 'Outros', 'https://picsum.photos/seed/ad4/400/300', 'active', now() - interval '7 days'),

('44444444-0005-0005-0005-000000000005', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Freezer Horizontal 100L — Consul',
 'Freezer Consul 100 litros, branco, funcionando perfeitamente. Ótimo para quem tem negócio ou família grande. Retirar no bairro.',
 550.00, 'Outros', 'https://picsum.photos/seed/ad5/400/300', 'active', now() - interval '2 days'),

('44444444-0006-0006-0006-000000000006', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Aulas de Violão — Iniciantes e Intermediários',
 'Professor com 10 anos de experiência oferece aulas de violão na sua casa ou na minha (Parque Interlagos). Valor: R$80/hora. Método progressivo. WhatsApp para agendar aula experimental gratuita.',
 80.00, 'Serviços', 'https://picsum.photos/seed/ad6/400/300', 'active', now() - interval '4 days');


-- =============================================================
-- SUGGESTIONS (5 sugestões com votos variados)
-- =============================================================
INSERT INTO suggestions (id, author_id, neighborhood, title, description, votes, status, created_at) VALUES

('55555555-0001-0001-0001-000000000001', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Academia ao Ar Livre no Parque',
 'Seria incrível ter equipamentos de academia ao ar livre no Parque Interlagos, como já existe em outros parques de SJC. Melhoraria a saúde e o convívio dos moradores.',
 34, 'open', now() - interval '10 days'),

('55555555-0002-0002-0002-000000000002', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Faixa Exclusiva para Ciclistas na Av. Interlagos',
 'Com o aumento de ciclistas no bairro, uma ciclofaixa na Av. Interlagos tornaria o trajeto muito mais seguro. Pedimos que a prefeitura avalie a viabilidade.',
 27, 'open', now() - interval '8 days'),

('55555555-0003-0003-0003-000000000003', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Iluminação no Campo de Futebol',
 'O campo de futebol do bairro não tem iluminação, impossibilitando jogos à noite. Com luminárias, poderíamos usar o espaço após o trabalho e fins de semana à noite.',
 19, 'open', now() - interval '15 days'),

('55555555-0004-0004-0004-000000000004', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Ponto de Ônibus com Cobertura na Rua das Palmeiras',
 'O ponto de ônibus da Rua das Palmeiras não tem cobertura. Em dias de chuva os passageiros ficam encharcados esperando. Solicitamos instalação urgente de abrigo.',
 42, 'open', now() - interval '20 days'),

('55555555-0005-0005-0005-000000000005', 'bcbe51d5-f0f5-4d1c-b82c-49bfa1c7829c', 'interlagos',
 'Feira do Agricultor Semanal no Bairro',
 'Uma feira com produtores locais toda semana movimentaria o bairro, daria acesso a alimentos frescos e apoiaria pequenos agricultores da região. Tem espaço no estacionamento do parque.',
 15, 'open', now() - interval '6 days');


-- =============================================================
-- CLEANUP — Para resetar todos os dados de teste:
-- (descomente e execute quando quiser limpar)
-- =============================================================
-- DELETE FROM suggestions WHERE id LIKE '55555555-%';
-- DELETE FROM ads WHERE id LIKE '44444444-%';
-- DELETE FROM news WHERE id LIKE '33333333-%';
-- DELETE FROM campaigns WHERE id LIKE '22222222-%';
-- DELETE FROM merchants WHERE id LIKE '11111111-%';
