-- ================================================================
-- Life Dashboard — Supabase Schema
-- Run this entire file in the Supabase SQL editor
-- ================================================================

-- Enable Row Level Security on all tables (users only see their data)

-- ── Workout Logs ────────────────────────────────────────────────
create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  type text not null check (type in ('hyrox_sim','run','strength','zone2','bike','swim','rest','other')),
  duration_mins int,
  distance_km float,
  avg_hr int,
  avg_pace_min_km float,
  notes text,
  created_at timestamptz default now()
);

alter table workout_logs enable row level security;
create policy "Users see own workouts" on workout_logs for all using (auth.uid() = user_id);

-- ── Body Logs ───────────────────────────────────────────────────
create table if not exists body_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  weight_kg float,
  body_fat_pct float,
  waist_cm float,
  chest_cm float,
  left_arm_cm float,
  right_arm_cm float,
  left_quad_cm float,
  right_quad_cm float,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table body_logs enable row level security;
create policy "Users see own body logs" on body_logs for all using (auth.uid() = user_id);

-- ── Strength Logs ───────────────────────────────────────────────
create table if not exists strength_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  exercise text not null,
  sets int,
  reps int,
  weight_kg float,
  notes text,
  created_at timestamptz default now()
);

alter table strength_logs enable row level security;
create policy "Users see own strength logs" on strength_logs for all using (auth.uid() = user_id);

-- ── Nutrition Logs ──────────────────────────────────────────────
create table if not exists nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  calories int,
  protein_g float,
  carbs_g float,
  fat_g float,
  water_ml int,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table nutrition_logs enable row level security;
create policy "Users see own nutrition" on nutrition_logs for all using (auth.uid() = user_id);

-- ── Recovery Logs ───────────────────────────────────────────────
create table if not exists recovery_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  hrv int,
  sleep_hrs float,
  sleep_score int,
  energy_level int check (energy_level between 1 and 10),
  mood int check (mood between 1 and 10),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table recovery_logs enable row level security;
create policy "Users see own recovery" on recovery_logs for all using (auth.uid() = user_id);

-- ── Finance Logs ────────────────────────────────────────────────
create table if not exists finance_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  month text not null, -- YYYY-MM format
  online_income_gbp float not null default 0,
  source text,
  notes text,
  created_at timestamptz default now()
);

alter table finance_logs enable row level security;
create policy "Users see own finance" on finance_logs for all using (auth.uid() = user_id);

-- ── Habit Logs ──────────────────────────────────────────────────
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  habits jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table habit_logs enable row level security;
create policy "Users see own habits" on habit_logs for all using (auth.uid() = user_id);

-- ── Indexes for performance ─────────────────────────────────────
create index if not exists idx_workout_user_date on workout_logs(user_id, date desc);
create index if not exists idx_body_user_date on body_logs(user_id, date desc);
create index if not exists idx_strength_user_date on strength_logs(user_id, date desc);
create index if not exists idx_nutrition_user_date on nutrition_logs(user_id, date desc);
create index if not exists idx_recovery_user_date on recovery_logs(user_id, date desc);
create index if not exists idx_finance_user_month on finance_logs(user_id, month desc);
