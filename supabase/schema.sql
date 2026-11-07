-- ─────────────────────────────────────────────────────────────
--  El Trinquet de 3r · Esquema Supabase (PostgreSQL)
--  Ja aplicat al projecte «trinquet-genoves» (migració esquema_inicial_trinquet).
--  Executa-ho a Supabase → SQL Editor. Cada mestre/a només veu les seues aules (RLS).
-- ─────────────────────────────────────────────────────────────

-- 1) Aula: instantània completa de l'estat (és el que usa src/lib/supabase.js)
create table if not exists public.aules (
  id          uuid primary key default gen_random_uuid(),
  mestre_id   uuid not null references auth.users(id) on delete cascade,
  nom         text not null,
  estat       jsonb not null,               -- { aula, alumnes, categories, partida, historial, config }
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists aules_mestre_idx on public.aules (mestre_id);

-- 2) (Fase 2) Taules normalitzades per a informes avançats i accés de l'alumnat
create table if not exists public.alumnes (
  id        uuid primary key default gen_random_uuid(),
  aula_id   uuid not null references public.aules(id) on delete cascade,
  nom       text not null,
  genere    text not null default 'x' check (genere in ('o','a','x')),
  quinzes   int  not null default 0 check (quinzes >= 0),
  record    int  not null default 0,
  avatar    jsonb not null default '{}'::jsonb,
  codi_acces text unique                     -- codi QR/paraula per a la vista alumnat
);
create index if not exists alumnes_aula_idx on public.alumnes (aula_id);

create table if not exists public.esdeveniments (
  id            uuid primary key default gen_random_uuid(),
  aula_id       uuid not null references public.aules(id) on delete cascade,
  alumne_id     uuid not null references public.alumnes(id) on delete cascade,
  categoria_id  text not null,
  delta         int  not null,
  avis          boolean not null default false,
  lot           text not null,               -- agrupa «Tota la classe» per a poder desfer
  created_at    timestamptz not null default now()
);
create index if not exists esdev_aula_data_idx on public.esdeveniments (aula_id, created_at desc);
create index if not exists esdev_alumne_idx on public.esdeveniments (alumne_id);

-- Seguretat a nivell de fila
alter table public.aules enable row level security;
alter table public.alumnes enable row level security;
alter table public.esdeveniments enable row level security;

create policy "mestre gestiona les seues aules" on public.aules
  for all to authenticated
  using ((select auth.uid()) = mestre_id) with check ((select auth.uid()) = mestre_id);

create policy "mestre gestiona el seu alumnat" on public.alumnes
  for all to authenticated
  using (exists (select 1 from public.aules a where a.id = aula_id and a.mestre_id = (select auth.uid())))
  with check (exists (select 1 from public.aules a where a.id = aula_id and a.mestre_id = (select auth.uid())));

create policy "mestre gestiona els esdeveniments" on public.esdeveniments
  for all to authenticated
  using (exists (select 1 from public.aules a where a.id = aula_id and a.mestre_id = (select auth.uid())))
  with check (exists (select 1 from public.aules a where a.id = aula_id and a.mestre_id = (select auth.uid())));
