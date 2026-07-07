-- Relay Studio Database Schema Foundation
-- This script prepares the tables and structure for Relay Studio.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (Profiles linked to Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profile policies
create policy "Allow public read access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- WORKSPACES
create table if not exists public.workspaces (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  is_pinned boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.workspaces enable row level security;

create policy "Users can view their own workspaces" on public.workspaces
  for select using (auth.uid() = user_id);

create policy "Users can insert their own workspaces" on public.workspaces
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own workspaces" on public.workspaces
  for update using (auth.uid() = user_id);

create policy "Users can delete their own workspaces" on public.workspaces
  for delete using (auth.uid() = user_id);

-- RESEARCH TOPICS
create table if not exists public.research_topics (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'draft'::text not null, -- 'draft', 'in_progress', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.research_topics enable row level security;

create policy "Users can view topics in their workspaces" on public.research_topics
  for select using (
    exists (
      select 1 from public.workspaces
      where workspaces.id = research_topics.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can insert topics in their workspaces" on public.research_topics
  for insert with check (
    exists (
      select 1 from public.workspaces
      where workspaces.id = research_topics.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can update topics in their workspaces" on public.research_topics
  for update using (
    exists (
      select 1 from public.workspaces
      where workspaces.id = research_topics.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can delete topics in their workspaces" on public.research_topics
  for delete using (
    exists (
      select 1 from public.workspaces
      where workspaces.id = research_topics.workspace_id
      and workspaces.user_id = auth.uid()
    )
  );

-- REFERENCES (Sources of research: Youtube videos, PDFs, URL link, raw text)
create table if not exists public.references (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.research_topics(id) on delete cascade not null,
  title text not null,
  url text,
  type text default 'link'::text not null, -- 'link', 'youtube', 'reddit', 'pdf', 'document'
  raw_content text,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.references enable row level security;

create policy "Users can view references under their topics" on public.references
  for select using (
    exists (
      select 1 from public.research_topics
      join public.workspaces on workspaces.id = research_topics.workspace_id
      where research_topics.id = references.topic_id
      and workspaces.user_id = auth.uid()
    )
  );

create policy "Users can insert references under their topics" on public.references
  for insert with check (
    exists (
      select 1 from public.research_topics
      join public.workspaces on workspaces.id = research_topics.workspace_id
      where research_topics.id = references.topic_id
      and workspaces.user_id = auth.uid()
    )
  );

-- RESEARCH NOTES
create table if not exists public.research_notes (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.research_topics(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.research_notes enable row level security;

create policy "Users can view notes under their topics" on public.research_notes
  for select using (
    exists (
      select 1 from public.research_topics
      join public.workspaces on workspaces.id = research_topics.workspace_id
      where research_topics.id = research_notes.topic_id
      and workspaces.user_id = auth.uid()
    )
  );

-- GENERATED SCRIPTS
create table if not exists public.generated_scripts (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.research_topics(id) on delete cascade not null,
  title text not null,
  outline jsonb,
  script_content text,
  status text default 'draft'::text not null, -- 'draft', 'review', 'published'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.generated_scripts enable row level security;

-- BRAND PROFILES
create table if not exists public.brand_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  voice_description text,
  guidelines text,
  is_active boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.brand_profiles enable row level security;

create policy "Users can view their brand profiles" on public.brand_profiles
  for select using (auth.uid() = user_id);

-- INTEGRATIONS
create table if not exists public.integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null, -- 'youtube', 'notion', 'medium', 'ghost'
  auth_token text,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.integrations enable row level security;

create policy "Users can view their own integrations" on public.integrations
  for select using (auth.uid() = user_id);

-- Profile trigger on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function on user creation
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
