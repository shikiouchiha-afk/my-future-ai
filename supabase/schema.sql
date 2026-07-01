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
