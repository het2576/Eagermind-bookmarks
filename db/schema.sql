-- =============================================
-- PROFILES TABLE
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique not null,
  created_at timestamptz default now() not null
);

-- Enforce handle format: lowercase letters, numbers, underscores, 3-30 chars
alter table public.profiles
  add constraint handle_format check (handle ~ '^[a-z0-9_]{3,30}$');

-- =============================================
-- BOOKMARKS TABLE
-- =============================================
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null,
  is_public boolean default false not null,
  created_at timestamptz default now() not null
);

-- =============================================
-- ROW LEVEL SECURITY — PROFILES
-- =============================================
alter table public.profiles enable row level security;

-- Anyone can read any profile (needed for public /<handle> pages)
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can only insert their own profile
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can only update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================
-- ROW LEVEL SECURITY — BOOKMARKS
-- =============================================
alter table public.bookmarks enable row level security;

-- Authenticated users can only read their own bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Public bookmarks are readable by anyone (for /<handle> page)
create policy "Public bookmarks are readable by anyone"
  on public.bookmarks for select
  using (is_public = true);

-- Users can only insert bookmarks for themselves
create policy "Users can create own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can only update their own bookmarks
create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Users can only delete their own bookmarks
create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- =============================================
-- INDEXES
-- =============================================
create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_public_idx on public.bookmarks(user_id, is_public) where is_public = true;
