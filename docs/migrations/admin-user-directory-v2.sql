-- ============================================================
-- Migration: admin-user-directory-v2.sql
-- Objetivo: Adicionar p_offset para paginação server-side
-- Executar no: Supabase → SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_user_directory(
  p_search text DEFAULT '',
  p_limit  integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id                   uuid,
  email                text,
  email_confirmed_at   timestamptz,
  confirmation_sent_at timestamptz,
  last_sign_in_at      timestamptz,
  auth_created_at      timestamptz,
  display_name         text,
  full_name            text,
  photo_url            text,
  role                 text,
  neighborhood         text,
  phone                text,
  phone_verified       boolean,
  onboarding_completed boolean,
  terms_accepted_at    timestamptz,
  is_verified          boolean,
  verified_at          timestamptz,
  document_type        text,
  document_url         text,
  profile_created_at   timestamptz,
  profile_updated_at   timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    p.id,
    u.email,
    u.email_confirmed_at,
    u.confirmation_sent_at,
    u.last_sign_in_at,
    u.created_at  AS auth_created_at,
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
    p.created_at  AS profile_created_at,
    p.updated_at  AS profile_updated_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE EXISTS (
    SELECT 1
    FROM public.profiles requester
    WHERE requester.id = auth.uid()
      AND requester.role IN ('admin', 'master')
  )
  AND (
    COALESCE(TRIM(p_search), '') = ''
    OR p.display_name ILIKE '%' || TRIM(p_search) || '%'
    OR p.full_name    ILIKE '%' || TRIM(p_search) || '%'
    OR u.email        ILIKE '%' || TRIM(p_search) || '%'
    OR p.id::text     ILIKE '%' || TRIM(p_search) || '%'
  )
  ORDER BY COALESCE(p.created_at, u.created_at) DESC
  LIMIT  LEAST(GREATEST(COALESCE(p_limit, 50), 1), 500)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

GRANT EXECUTE ON FUNCTION public.admin_user_directory(text, integer, integer) TO authenticated;
