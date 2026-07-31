create extension if not exists pgcrypto;

alter table if exists public.profiles
  add column if not exists timezone text not null default 'UTC';

alter table if exists public.user_progress
  add column if not exists daily_progress integer not null default 0,
  add column if not exists completion_percentage integer not null default 0,
  add column if not exists last_recalculated_at timestamptz;

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

create index if not exists completion_events_user_date_idx
  on public.completion_events (user_id, local_date);

create index if not exists completion_events_user_time_idx
  on public.completion_events (user_id, occurred_at);

alter table public.completion_events
  drop constraint if exists completion_events_action_type_check;

alter table public.completion_events
  add constraint completion_events_action_type_check
  check (action_type in ('lesson_completed', 'coaching_session_completed', 'habit_completed', 'task_completed'));

alter table public.completion_events
  drop constraint if exists completion_events_nonnegative_points_check;

alter table public.completion_events
  add constraint completion_events_nonnegative_points_check
  check (xp_earned >= 0 and daily_points >= 0);

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

create index if not exists progress_audit_logs_user_created_idx
  on public.progress_audit_logs (user_id, created_at desc);

create index if not exists progress_audit_logs_completion_idx
  on public.progress_audit_logs (user_id, completion_id);
