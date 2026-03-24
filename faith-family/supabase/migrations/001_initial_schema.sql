-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Families
create table public.families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  photo_url text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.families enable row level security;
create policy "Users manage own family" on public.families
  using (owner_id = auth.uid());

-- Children
create table public.children (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  age integer not null,
  avatar_emoji text default '👦',
  points integer default 0,
  level integer default 1,
  created_at timestamptz default now()
);
alter table public.children enable row level security;
create policy "Family members access children" on public.children
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Devotionals
create table public.devotionals (
  id uuid primary key default uuid_generate_v4(),
  date date not null unique,
  verse text not null,
  verse_reference text not null,
  parent_explanation text not null,
  children_story text not null,
  questions jsonb not null default '[]',
  prayer text not null,
  theme text not null,
  generated_by_ai boolean default false,
  created_at timestamptz default now()
);
alter table public.devotionals enable row level security;
create policy "Anyone authenticated reads devotionals" on public.devotionals
  for select using (auth.uid() is not null);
create policy "Authenticated insert devotionals" on public.devotionals
  for insert with check (auth.uid() is not null);

-- Devotional completions
create table public.devotional_completions (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  completed_at timestamptz default now(),
  points_earned integer default 50
);
alter table public.devotional_completions enable row level security;
create policy "Family manages completions" on public.devotional_completions
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Family streaks
create table public.family_streaks (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null unique references public.families(id) on delete cascade,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_completed_date date,
  updated_at timestamptz default now()
);
alter table public.family_streaks enable row level security;
create policy "Family manages streak" on public.family_streaks
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Game scores
create table public.game_scores (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  game_type text not null check (game_type in ('quiz', 'memory', 'ark_adventure')),
  score integer not null,
  max_score integer not null,
  completed_at timestamptz default now()
);
alter table public.game_scores enable row level security;
create policy "Family manages game scores" on public.game_scores
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Flashcards
create table public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  verse text not null,
  reference text not null,
  category text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz default now()
);
alter table public.flashcards enable row level security;
create policy "Anyone authenticated reads flashcards" on public.flashcards
  for select using (auth.uid() is not null);

-- Flashcard progress
create table public.flashcard_progress (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  mastered boolean default false,
  review_count integer default 0,
  last_reviewed timestamptz,
  unique (family_id, flashcard_id)
);
alter table public.flashcard_progress enable row level security;
create policy "Family manages flashcard progress" on public.flashcard_progress
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Diary entries
create table public.diary_entries (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  description text default '',
  emoji text default '🙏',
  entry_date date not null,
  created_at timestamptz default now()
);
alter table public.diary_entries enable row level security;
create policy "Family manages diary" on public.diary_entries
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Badges
create table public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  icon_emoji text not null,
  condition_type text not null,
  condition_value integer not null
);
alter table public.badges enable row level security;
create policy "Anyone reads badges" on public.badges
  for select using (true);

-- Family badges
create table public.family_badges (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  unique (family_id, badge_id)
);
alter table public.family_badges enable row level security;
create policy "Family manages badges" on public.family_badges
  using (family_id in (select id from public.families where owner_id = auth.uid()));

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('trialing', 'active', 'canceled', 'past_due')),
  plan text not null check (plan in ('free', 'monthly', 'annual')),
  stripe_subscription_id text,
  trial_ends_at timestamptz,
  created_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "Users manage own subscription" on public.subscriptions
  using (user_id = auth.uid());

-- Helper function to award points to all children in a family
create or replace function award_family_points(p_family_id uuid, p_points integer)
returns void language plpgsql security definer as $$
begin
  update public.children
  set points = points + p_points,
      level = floor((points + p_points) / 100) + 1
  where family_id = p_family_id;
end;
$$;
