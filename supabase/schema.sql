create extension if not exists pgcrypto;

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
  daily_progress integer not null default 0,
  completion_percentage integer not null default 0,
  last_recalculated_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists public.completion_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  completion_id text not null,
  action_type text not null,
  source text not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  local_date date not null,
  xp_earned integer not null default 0,
  daily_points integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, completion_id)
);

create table if not exists public.progress_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  completion_id text not null,
  action_type text not null,
  source text not null default 'unknown',
  was_duplicate boolean not null default false,
  reason text not null,
  previous_snapshot jsonb not null default '{}'::jsonb,
  next_snapshot jsonb not null default '{}'::jsonb,
  event_local_date date,
  created_at timestamptz not null default now()
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

alter table if exists public.profiles
  add column if not exists timezone text not null default 'UTC';

alter table if exists public.user_progress
  add column if not exists session_started_at timestamptz;

alter table if exists public.user_progress
  add column if not exists session_started_for_date date;

create index if not exists completion_events_user_date_idx
  on public.completion_events (user_id, local_date);

create index if not exists completion_events_user_time_idx
  on public.completion_events (user_id, occurred_at);

create index if not exists progress_audit_logs_user_created_idx
  on public.progress_audit_logs (user_id, created_at desc);

create index if not exists progress_audit_logs_completion_idx
  on public.progress_audit_logs (user_id, completion_id);

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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'completion_events_action_type_check'
  ) then
    alter table public.completion_events
      add constraint completion_events_action_type_check
      check (action_type in ('lesson_completed', 'coaching_session_completed', 'habit_completed', 'task_completed'));
  end if;
end $$;
