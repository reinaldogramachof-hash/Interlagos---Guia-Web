-- ============================================================
-- Migration: admin-governance-phase2.sql
-- Objetivo: Fase 2 — Governança e rastreabilidade do painel admin
-- Executar no: Supabase → SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABELA admin_audit_logs — trilha real de ações administrativas
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  actor_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email text,
  action      text NOT NULL,      -- 'approve', 'reject', 'escalate', 'role_change', 'resolve_ticket', 'backup', 'reset'
  target_table text,              -- tabela do objeto alvo (merchants, ads, news, tickets, profiles…)
  target_id   text,               -- id do objeto alvo (uuid como text para flexibilidade)
  details     jsonb DEFAULT '{}'  -- payload adicional (novo role, motivo, etc.)
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas master pode ler logs de auditoria
DROP POLICY IF EXISTS "audit_logs_master_select" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_master_select" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'master')
  );

-- Admin e master podem inserir (o service usa anon key com RLS — INSERT precisa estar liberado para admin)
DROP POLICY IF EXISTS "audit_logs_admin_insert" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_admin_insert" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );

-- ============================================================
-- 2. TICKETS — adicionar colunas de vínculo com item de origem
-- ============================================================
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS ref_table text;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS ref_id    text;

COMMENT ON COLUMN public.tickets.ref_table IS 'Tabela do item que originou o ticket (ads, merchants, news, campaigns…)';
COMMENT ON COLUMN public.tickets.ref_id    IS 'ID do item de origem (uuid como text)';

-- ============================================================
-- 3. ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_id   ON public.admin_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action     ON public.admin_audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_tickets_ref_table_id        ON public.tickets (ref_table, ref_id);
