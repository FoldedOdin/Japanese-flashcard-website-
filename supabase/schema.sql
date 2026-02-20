create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  daily_goal int not null default 20,
  auto_advance boolean not null default true,
  audio_enabled boolean not null default true,
  theme text not null default 'system',
  quiz_question_count int not null default 10,
  quiz_timer_enabled boolean not null default false,
  quiz_timer_seconds int not null default 20,
  question_type text not null default 'kana_to_romaji',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_seen int not null default 0,
  total_correct int not null default 0,
  score int not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_study_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  character_id text not null,
  seen int not null default 0,
  correct int not null default 0,
  ease_factor float not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  next_review_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, character_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  total_questions int not null default 0,
  correct int not null default 0,
  accuracy float not null default 0,
  duration_sec int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievement_unlocks (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create index if not exists idx_character_progress_user on public.character_progress (user_id);
create index if not exists idx_study_sessions_user on public.study_sessions (user_id);
create index if not exists idx_achievement_unlocks_user on public.achievement_unlocks (user_id);

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_settings_updated_at on public.user_settings;
create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_progress_updated_at on public.user_progress;
create trigger trg_user_progress_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

drop trigger if exists trg_character_progress_updated_at on public.character_progress;
create trigger trg_character_progress_updated_at
before update on public.character_progress
for each row execute function public.set_updated_at();

drop trigger if exists trg_study_sessions_updated_at on public.study_sessions;
create trigger trg_study_sessions_updated_at
before update on public.study_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_achievement_unlocks_updated_at on public.achievement_unlocks;
create trigger trg_achievement_unlocks_updated_at
before update on public.achievement_unlocks
for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_progress enable row level security;
alter table public.character_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.achievement_unlocks enable row level security;

drop policy if exists "Profiles are readable by owner" on public.user_profiles;
create policy "Profiles are readable by owner"
  on public.user_profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.user_profiles;
create policy "Profiles are insertable by owner"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.user_profiles;
create policy "Profiles are updatable by owner"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Profiles are deletable by owner" on public.user_profiles;
create policy "Profiles are deletable by owner"
  on public.user_profiles
  for delete
  using (auth.uid() = id);

drop policy if exists "Settings are readable by owner" on public.user_settings;
create policy "Settings are readable by owner"
  on public.user_settings
  for select
  using (auth.uid() = user_id);

drop policy if exists "Settings are insertable by owner" on public.user_settings;
create policy "Settings are insertable by owner"
  on public.user_settings
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Settings are updatable by owner" on public.user_settings;
create policy "Settings are updatable by owner"
  on public.user_settings
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Settings are deletable by owner" on public.user_settings;
create policy "Settings are deletable by owner"
  on public.user_settings
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Progress is readable by owner" on public.user_progress;
create policy "Progress is readable by owner"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "Progress is insertable by owner" on public.user_progress;
create policy "Progress is insertable by owner"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Progress is updatable by owner" on public.user_progress;
create policy "Progress is updatable by owner"
  on public.user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Progress is deletable by owner" on public.user_progress;
create policy "Progress is deletable by owner"
  on public.user_progress
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Character progress is readable by owner" on public.character_progress;
create policy "Character progress is readable by owner"
  on public.character_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "Character progress is insertable by owner" on public.character_progress;
create policy "Character progress is insertable by owner"
  on public.character_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Character progress is updatable by owner" on public.character_progress;
create policy "Character progress is updatable by owner"
  on public.character_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Character progress is deletable by owner" on public.character_progress;
create policy "Character progress is deletable by owner"
  on public.character_progress
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Study sessions are readable by owner" on public.study_sessions;
create policy "Study sessions are readable by owner"
  on public.study_sessions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Study sessions are insertable by owner" on public.study_sessions;
create policy "Study sessions are insertable by owner"
  on public.study_sessions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Study sessions are updatable by owner" on public.study_sessions;
create policy "Study sessions are updatable by owner"
  on public.study_sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Study sessions are deletable by owner" on public.study_sessions;
create policy "Study sessions are deletable by owner"
  on public.study_sessions
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Achievements are readable by owner" on public.achievement_unlocks;
create policy "Achievements are readable by owner"
  on public.achievement_unlocks
  for select
  using (auth.uid() = user_id);

drop policy if exists "Achievements are insertable by owner" on public.achievement_unlocks;
create policy "Achievements are insertable by owner"
  on public.achievement_unlocks
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Achievements are updatable by owner" on public.achievement_unlocks;
create policy "Achievements are updatable by owner"
  on public.achievement_unlocks
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Achievements are deletable by owner" on public.achievement_unlocks;
create policy "Achievements are deletable by owner"
  on public.achievement_unlocks
  for delete
  using (auth.uid() = user_id);
