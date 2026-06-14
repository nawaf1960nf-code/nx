-- Apex Club — Supabase schema
-- Run this in the Supabase SQL editor after creating your project, then add
-- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the Vercel
-- project (Root Directory = club).

-- Per-user progress backup (weights + workout days as a JSON blob).
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each member can only read/write their own row.
drop policy if exists "progress read own" on public.progress;
create policy "progress read own"
  on public.progress for select
  using (auth.uid() = user_id);

drop policy if exists "progress upsert own" on public.progress;
create policy "progress insert own"
  on public.progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress update own" on public.progress;
create policy "progress update own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
