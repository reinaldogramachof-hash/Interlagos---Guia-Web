-- RPC para governanca master: lista perfis com dados basicos do auth.users.
-- Necessario porque o frontend nao pode ler auth.users diretamente com anon key.

create or replace function public.admin_user_directory(
  p_search text default '',
  p_limit integer default 100
)
returns table (
  id uuid,
  email text,
  email_confirmed_at timestamptz,
  confirmation_sent_at timestamptz,
  last_sign_in_at timestamptz,
  auth_created_at timestamptz,
  display_name text,
  full_name text,
  photo_url text,
  role text,
  neighborhood text,
  phone text,
  phone_verified boolean,
  onboarding_completed boolean,
  terms_accepted_at timestamptz,
  is_verified boolean,
  verified_at timestamptz,
  document_type text,
  document_url text,
  profile_created_at timestamptz,
  profile_updated_at timestamptz
)
language sql
security definer
set search_path = public, auth
as $$
  select
    p.id,
    u.email,
    u.email_confirmed_at,
    u.confirmation_sent_at,
    u.last_sign_in_at,
    u.created_at as auth_created_at,
    p.display_name,
    p.full_name,
    p.photo_url,
    p.role,
    p.neighborhood,
    p.phone,
    p.phone_verified,
    p.onboarding_completed,
    p.terms_accepted_at,
    p.is_verified,
    p.verified_at,
    p.document_type,
    p.document_url,
    p.created_at as profile_created_at,
    p.updated_at as profile_updated_at
  from public.profiles p
  left join auth.users u on u.id = p.id
  where exists (
    select 1
    from public.profiles requester
    where requester.id = auth.uid()
      and requester.role in ('admin', 'master')
  )
  and (
    coalesce(trim(p_search), '') = ''
    or p.display_name ilike '%' || trim(p_search) || '%'
    or p.full_name ilike '%' || trim(p_search) || '%'
    or u.email ilike '%' || trim(p_search) || '%'
    or p.id::text ilike '%' || trim(p_search) || '%'
  )
  order by coalesce(p.created_at, u.created_at) desc
  limit least(greatest(coalesce(p_limit, 100), 1), 500);
$$;

grant execute on function public.admin_user_directory(text, integer) to authenticated;
