-- ====================================================================================
-- Script: create-notifications-table.sql
-- Descrição: Criação da tabela de notificações e políticas de segurança RLS.
-- ====================================================================================

-- 1. Criação da tabela
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    ref_id TEXT, -- ID opcional referenciando a origem (campanha, ticket, etc)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS
-- A. Permitir que o próprio usuário visualize suas notificações
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- B. Permitir que o próprio usuário atualize suas notificações (ex: marcar como lida)
CREATE POLICY "Users can update their own notifications" 
    ON public.notifications 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- C. Permitir que usuários autenticados insiram notificações (necessário pois clientes disparam notifyAdmins ou criam notificações locais)
CREATE POLICY "Authenticated users can insert notifications" 
    ON public.notifications 
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Permissões de role 
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;

-- Opcional: Índice para buscar rapidamente notificações não lidas de um usuário
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read 
    ON public.notifications (user_id, is_read);
