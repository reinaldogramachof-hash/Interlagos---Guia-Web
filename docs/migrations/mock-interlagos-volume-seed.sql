-- Mock de volume para validação visual/mobile em Parque Interlagos.
-- Idempotente: usa IDs determinísticos por faixa.
-- Cleanup sugerido:
--   delete from public.poll_votes where id::text like 'b0000000-%';
--   delete from public.poll_options where id::text like 'a0000000-%';
--   delete from public.polls where id::text like '90000000-%';
--   delete from public.suggestions where id::text like '80000000-%';
--   delete from public.campaigns where id::text like '70000000-%';
--   delete from public.ads where id::text like '60000000-%';
--   delete from public.news where id::text like '50000000-%';
--   delete from public.merchant_reviews where id::text like '40000000-%';
--   delete from public.merchant_posts where id::text like '20000000-%';
--   delete from public.merchants where id::text like '10000000-%';
--   delete from public.profiles where id::text like '00000000-0000-4000-8000-%';
--   delete from auth.users where id::text like '00000000-0000-4000-8000-%';

begin;

alter table public.merchants
  add column if not exists hours_json jsonb default '{}'::jsonb,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists social_links jsonb default '{}'::jsonb;

drop policy if exists "reviews_public_read" on public.merchant_reviews;
drop policy if exists "reviews_read" on public.merchant_reviews;
create policy "reviews_read" on public.merchant_reviews
  for select using (is_approved = true);

update public.merchant_reviews
set is_approved = true
where neighborhood = 'interlagos';

update public.polls
set status = 'active',
    expires_at = coalesce(expires_at, now() + interval '30 days')
where neighborhood = 'interlagos'
  and status = 'draft';

with mock_users as (
  select
    n,
    ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid as id,
    'mock.user.' || lpad(n::text, 3, '0') || '@temnobairro.local' as email,
    (array['Ana Souza','Bruno Lima','Carla Mendes','Diego Rocha','Elisa Nunes','Fabio Torres','Gisele Prado','Hugo Martins','Isabela Costa','Joao Ribeiro'])[1 + ((n - 1) % 10)] || ' ' || n as full_name
  from generate_series(1, 80) n
)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('Mock@123456', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('display_name', full_name, 'mock_seed', 'interlagos-volume'),
  now() - (n || ' days')::interval,
  now()
from mock_users
on conflict (id) do update set
  email = excluded.email,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

with mock_users as (
  select
    n,
    ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid as id,
    (array['Ana Souza','Bruno Lima','Carla Mendes','Diego Rocha','Elisa Nunes','Fabio Torres','Gisele Prado','Hugo Martins','Isabela Costa','Joao Ribeiro'])[1 + ((n - 1) % 10)] || ' ' || n as full_name
  from generate_series(1, 80) n
)
insert into public.profiles (
  id, display_name, role, full_name, neighborhood, phone_verified,
  onboarding_completed, terms_accepted_at, phone, is_verified, created_at, updated_at
)
select
  id,
  split_part(full_name, ' ', 1),
  case when n <= 30 then 'merchant' else 'resident' end,
  full_name,
  'interlagos',
  n % 3 = 0,
  true,
  now() - interval '20 days',
  '5512998' || lpad(n::text, 6, '0'),
  n % 4 = 0,
  now() - (n || ' days')::interval,
  now()
from mock_users
on conflict (id) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  full_name = excluded.full_name,
  neighborhood = excluded.neighborhood,
  onboarding_completed = true,
  updated_at = now();

with merchants_seed as (
  select
    n,
    ('10000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid as id,
    ('00000000-0000-4000-8000-' || lpad(((n - 1) % 30 + 1)::text, 12, '0'))::uuid as owner_id,
    (array['Restaurantes','Serviços','Lojas','Saúde','Pet','Construção','Automotivo','Beleza','Educação','Outros'])[1 + ((n - 1) % 10)] as category,
    case when n % 5 = 0 then 'premium' when n % 3 = 0 then 'pro' when n % 2 = 0 then 'basic' else 'free' end as plan,
    (array['mercado','atelier','dark-tech','luxury','vibrante','negocios'])[1 + ((n - 1) % 6)] as theme
  from generate_series(1, 60) n
)
insert into public.merchants (
  id, owner_id, neighborhood, name, description, category, plan, image_url,
  phone, address, instagram, whatsapp, is_active, created_at, is_featured,
  store_color, store_cover_url, store_tagline, store_description, store_badge_text,
  store_theme, store_url, hours_json, latitude, longitude, social_links
)
select
  id,
  owner_id,
  'interlagos',
  'Comércio Mock ' || lpad(n::text, 2, '0'),
  'Negócio de teste para validar listagens, filtros, vitrine, avaliações e carregamento com volume realista.',
  category,
  plan,
  'https://picsum.photos/seed/tnb-merchant-' || n || '/480/360',
  '1299' || lpad(n::text, 6, '0'),
  'Rua Interlagos, ' || (100 + n),
  '@mockinterlagos' || n,
  '5512999' || lpad(n::text, 6, '0'),
  true,
  now() - (n || ' hours')::interval,
  plan in ('pro','premium'),
  (array['#4f46e5','#0891b2','#16a34a','#c026d3','#ea580c','#0f172a'])[1 + ((n - 1) % 6)],
  'https://picsum.photos/seed/tnb-cover-' || n || '/960/420',
  category || ' no Parque Interlagos',
  'Atendimento local, WhatsApp rápido e ofertas especiais para moradores do bairro.',
  case when plan = 'premium' then 'Destaque Premium do Bairro' else null end,
  theme,
  'https://example.com/loja-mock-' || n,
  '{"seg-sex":"08h às 18h","sab":"08h às 13h"}'::jsonb,
  -23.246 + (n * 0.0007),
  -45.842 + (n * 0.0006),
  jsonb_build_object('instagram', '@mockinterlagos' || n, 'facebook', 'mockinterlagos' || n)
from merchants_seed
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  plan = excluded.plan,
  is_active = true,
  store_color = excluded.store_color,
  store_cover_url = excluded.store_cover_url,
  store_tagline = excluded.store_tagline,
  store_description = excluded.store_description,
  store_badge_text = excluded.store_badge_text,
  store_theme = excluded.store_theme,
  hours_json = excluded.hours_json,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  social_links = excluded.social_links;

with posts_seed as (
  select
    m.n,
    p.k,
    ('20000000-0000-4000-8000-' || lpad(((m.n * 10) + p.k)::text, 12, '0'))::uuid as id,
    ('10000000-0000-4000-8000-' || lpad(m.n::text, 12, '0'))::uuid as merchant_id,
    (array['product','service','news','promo'])[1 + ((p.k - 1) % 4)] as type
  from generate_series(1, 60) m(n)
  cross join generate_series(1, 3) p(k)
)
insert into public.merchant_posts (
  id, merchant_id, neighborhood, type, title, description, price, image_url, is_active, created_at
)
select
  id,
  merchant_id,
  'interlagos',
  type,
  case type
    when 'product' then 'Produto destaque ' || n
    when 'service' then 'Serviço especial ' || n
    when 'news' then 'Novidade da loja ' || n
    else 'Promoção relâmpago ' || n
  end,
  'Publicação mock para validar cards, imagens, preço, ordenação e vitrine com volume.',
  case when type in ('product','service','promo') then (25 + (n * k))::numeric else null end,
  'https://picsum.photos/seed/tnb-post-' || n || '-' || k || '/600/600',
  true,
  now() - ((n * k) || ' hours')::interval
from posts_seed
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  is_active = true,
  created_at = excluded.created_at;

with reviews_seed as (
  select
    n,
    ('40000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid as id,
    ('10000000-0000-4000-8000-' || lpad(((n - 1) % 60 + 1)::text, 12, '0'))::uuid as merchant_id,
    ('00000000-0000-4000-8000-' || lpad(((n - 1) % 80 + 1)::text, 12, '0'))::uuid as author_id
  from generate_series(1, 220) n
)
insert into public.merchant_reviews (
  id, merchant_id, author_id, author_name, neighborhood, rating, comment, status, is_approved, created_at
)
select
  id,
  merchant_id,
  author_id,
  'Morador Mock ' || ((n - 1) % 80 + 1),
  'interlagos',
  (3 + (n % 3))::smallint,
  'Avaliação mock para testar volume, média, contagem e layout da loja.',
  'approved',
  true,
  now() - (n || ' hours')::interval
from reviews_seed
on conflict (id) do update set
  rating = excluded.rating,
  comment = excluded.comment,
  status = excluded.status,
  is_approved = true;

with news_seed as (
  select n from generate_series(1, 35) n
)
insert into public.news (
  id, author_id, neighborhood, title, content, image_url, category, status, created_at
)
select
  ('50000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  ('00000000-0000-4000-8000-' || lpad(((n - 1) % 20 + 1)::text, 12, '0'))::uuid,
  'interlagos',
  'Notícia mock do bairro #' || n,
  'Conteúdo de teste para validar feed, busca, categorias e comentários em volume na aba Jornal.',
  'https://picsum.photos/seed/tnb-news-' || n || '/720/420',
  (array['Urgente','Eventos','Geral','Trânsito','Esportes','Cultura','Obras','Saúde'])[1 + ((n - 1) % 8)],
  'active',
  now() - (n || ' hours')::interval
from news_seed
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  category = excluded.category,
  status = 'active';

with ads_seed as (
  select n from generate_series(1, 90) n
)
insert into public.ads (
  id, seller_id, neighborhood, title, description, price, category, image_url,
  status, ad_type, whatsapp, expires_at, created_at
)
select
  ('60000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  ('00000000-0000-4000-8000-' || lpad(((n - 1) % 80 + 1)::text, 12, '0'))::uuid,
  'interlagos',
  'Classificado mock #' || n,
  'Anúncio de teste para validar cards, galeria, filtros e fluxo de contato.',
  case when n % 7 = 0 then null else (30 + n * 8)::numeric end,
  (array['Eletrônicos','Casa','Serviços','Moda','Veículos','Outros'])[1 + ((n - 1) % 6)],
  'https://picsum.photos/seed/tnb-ad-' || n || '/640/480',
  'approved',
  (array['sale','trade','donation'])[1 + ((n - 1) % 3)]::ad_type,
  '5512997' || lpad(n::text, 6, '0'),
  now() + interval '30 days',
  now() - (n || ' hours')::interval
from ads_seed
on conflict (id) do update set
  title = excluded.title,
  status = 'approved',
  expires_at = excluded.expires_at;

with campaigns_seed as (
  select n from generate_series(1, 40) n
)
insert into public.campaigns (
  id, merchant_id, author_id, neighborhood, title, description, discount,
  start_date, end_date, status, image_url
)
select
  ('70000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  case when n % 3 = 0 then ('10000000-0000-4000-8000-' || lpad(((n - 1) % 60 + 1)::text, 12, '0'))::uuid else null end,
  ('00000000-0000-4000-8000-' || lpad(((n - 1) % 80 + 1)::text, 12, '0'))::uuid,
  'interlagos',
  'Campanha mock comunitária #' || n,
  'Campanha de teste para validar cards, campanhas sociais, ofertas e ordenação.',
  case when n % 3 = 0 then (10 + (n % 40)) || '% OFF' else null end,
  current_date - (n % 10),
  current_date + 30 + (n % 15),
  'active',
  'https://picsum.photos/seed/tnb-campaign-' || n || '/720/420'
from campaigns_seed
on conflict (id) do update set
  title = excluded.title,
  status = 'active',
  end_date = excluded.end_date;

with suggestions_seed as (
  select n from generate_series(1, 120) n
)
insert into public.suggestions (
  id, author_id, neighborhood, title, description, votes, status, created_at
)
select
  ('80000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
  ('00000000-0000-4000-8000-' || lpad(((n - 1) % 80 + 1)::text, 12, '0'))::uuid,
  'interlagos',
  (array['Ideia','Problema','Outro'])[1 + ((n - 1) % 3)],
  'Sugestão mock #' || n || ' para validar lista, votos e moderação comunitária.',
  (n * 3) % 97,
  case when n % 5 = 0 then 'reviewed' else 'pending' end,
  now() - (n || ' hours')::interval
from suggestions_seed
on conflict (id) do update set
  description = excluded.description,
  votes = excluded.votes,
  status = excluded.status;

with polls_seed as (
  select n from generate_series(1, 8) n
), inserted_polls as (
  insert into public.polls (
    id, author_id, neighborhood, question, description, status, expires_at, created_at
  )
  select
    ('90000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
    ('00000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid,
    'interlagos',
    'Enquete mock #' || n || ': qual melhoria o bairro deve priorizar?',
    'Enquete de teste para validar votação e resultados.',
    'active',
    now() + interval '45 days',
    now() - (n || ' days')::interval
  from polls_seed
  on conflict (id) do update set
    question = excluded.question,
    status = 'active',
    expires_at = excluded.expires_at
  returning id
)
insert into public.poll_options (id, poll_id, text, display_order)
select
  ('a0000000-0000-4000-8000-' || lpad(((p.n * 10) + o.k)::text, 12, '0'))::uuid,
  ('90000000-0000-4000-8000-' || lpad(p.n::text, 12, '0'))::uuid,
  (array['Iluminação pública','Áreas de lazer','Segurança','Transporte'])[o.k],
  o.k
from polls_seed p
cross join generate_series(1, 4) o(k)
on conflict (id) do update set
  text = excluded.text,
  display_order = excluded.display_order;

with vote_seed as (
  select p.n as poll_n, u.n as user_n, ((u.n + p.n) % 4) + 1 as option_k
  from generate_series(1, 8) p(n)
  cross join generate_series(1, 80) u(n)
)
insert into public.poll_votes (id, poll_id, option_id, user_id, neighborhood, created_at)
select
  ('b0000000-0000-4000-8000-' || lpad(((poll_n * 1000) + user_n)::text, 12, '0'))::uuid,
  ('90000000-0000-4000-8000-' || lpad(poll_n::text, 12, '0'))::uuid,
  ('a0000000-0000-4000-8000-' || lpad(((poll_n * 10) + option_k)::text, 12, '0'))::uuid,
  ('00000000-0000-4000-8000-' || lpad(user_n::text, 12, '0'))::uuid,
  'interlagos',
  now() - ((poll_n + user_n) || ' hours')::interval
from vote_seed
on conflict (id) do nothing;

update public.merchants m
set avg_rating = r.avg_rating,
    review_count = r.review_count
from (
  select merchant_id, round(avg(rating)::numeric, 2) as avg_rating, count(*)::int as review_count
  from public.merchant_reviews
  where is_approved = true
  group by merchant_id
) r
where m.id = r.merchant_id;

commit;
