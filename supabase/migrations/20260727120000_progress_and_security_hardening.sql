alter table if exists public.profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1,
  add column if not exists streak integer not null default 0,
  add column if not exists last_message_date timestamptz,
  add column if not exists name text;

alter table if exists public.user_progress
  add column if not exists session_started_at timestamptz,
  add column if not exists session_started_for_date date;

update public.profiles
set xp = coalesce(xp, 0),
    level = coalesce(level, 1),
    streak = coalesce(streak, 0)
where xp is null or level is null or streak is null;
