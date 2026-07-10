alter table if exists public.profiles
  add column if not exists has_seen_premium_animation boolean not null default false;

alter table if exists public.profiles
  add column if not exists coaching_intensity text not null default 'balanced';

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
