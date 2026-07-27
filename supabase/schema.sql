create table if not exists public.coach_memories (
  user_id uuid not null,
  coach text not null,
  goals text[] default array[]::text[],
  strengths text[] default array[]::text[],
  weaknesses text[] default array[]::text[],
  milestones text[] default array[]::text[],
  habits text[] default array[]::text[],
  achievements text[] default array[]::text[],
  last_focus text,
  plans text[] default array[]::text[],
  updated_at timestamptz default now(),
  primary key (user_id, coach)
);

create table if not exists public.user_progress (
  user_id uuid primary key,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  completed_missions text[] default array[]::text[],
  total_progress integer default 0,
  updated_at timestamptz default now()
);

alter table if exists public.profiles
  add column if not exists has_seen_premium_animation boolean not null default false;

alter table if exists public.profiles
  add column if not exists coaching_intensity text not null default 'balanced';

alter table if exists public.profiles
  add column if not exists xp integer not null default 0;

alter table if exists public.profiles
  add column if not exists level integer not null default 1;

alter table if exists public.profiles
  add column if not exists streak integer not null default 0;

alter table if exists public.profiles
  add column if not exists last_message_date timestamptz;

alter table if exists public.profiles
  add column if not exists name text;

alter table if exists public.user_progress
  add column if not exists session_started_at timestamptz;

alter table if exists public.user_progress
  add column if not exists session_started_for_date date;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_coaching_intensity_check'
  ) then
    alter table public.profiles
      add constraint profiles_coaching_intensity_check
      check (coaching_intensity in ('supportive', 'balanced', 'savage'));
  end if;
end $$;
