-- Migration: add-news-comments
-- Executar no Supabase SQL Editor

create table if not exists public.news_comments (
  id           uuid primary key default gen_random_uuid(),
  news_id      uuid not null references public.news(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  neighborhood text not null,
  content      text not null check (char_length(content) between 1 and 1000),
  created_at   timestamptz not null default now()
);

-- Índices
create index if not exists idx_news_comments_news_id      on public.news_comments(news_id);
create index if not exists idx_news_comments_author_id    on public.news_comments(author_id);
create index if not exists idx_news_comments_neighborhood on public.news_comments(neighborhood);

-- RLS
alter table public.news_comments enable row level security;

create policy "comments_select_public"
  on public.news_comments for select using (true);

create policy "comments_insert_authenticated"
  on public.news_comments for insert
  with check (auth.uid() = author_id);

create policy "comments_delete_own_or_admin"
  on public.news_comments for delete
  using (
    auth.uid() = author_id or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'master')
    )
  );
