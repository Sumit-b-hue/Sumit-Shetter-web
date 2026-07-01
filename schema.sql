-- ============================================================================
-- SUMIT SHETTAR PORTFOLIO — SUPABASE SCHEMA
-- Paste this entire file into Supabase Dashboard -> SQL Editor -> New Query
-- and click "Run". It is safe to re-run.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- TABLE: projects (your video work / portfolio pieces)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '',
  category text not null default 'Custom',
  client text not null default '',
  year int not null default extract(year from now()),
  software text[] not null default '{}',
  description text not null default '',
  thumbnail_url text not null default '',
  video_url text not null default '',
  before_url text,
  after_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TABLE: services (pricing packages)
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '',
  price_label text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- TABLE: testimonials (client reviews)
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null default '',
  client_role text not null default '',
  quote text not null default '',
  avatar_url text,
  rating int not null default 5,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- TABLE: site_settings (single-row homepage/contact content)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  hero_name text not null default 'SUMIT SHETTAR',
  hero_tagline text not null default 'Cinematic Editor & Videographer',
  about_bio text not null default '',
  years_experience int not null default 5,
  projects_completed int not null default 120,
  happy_clients int not null default 80,
  email text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  linkedin text not null default '',
  availability_status text not null default 'Available',
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- TABLE: messages (contact form submissions)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null default '',
  email text not null default '',
  project_type text not null default '',
  budget text not null default '',
  message text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public visitors: read-only on published content, insert-only on messages.
-- Logged-in admin (any authenticated Supabase user): full read/write access.
-- ============================================================================

alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.messages enable row level security;

-- PROJECTS
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select using (published = true);

drop policy if exists "admin full access projects" on public.projects;
create policy "admin full access projects" on public.projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- SERVICES
drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services
  for select using (true);

drop policy if exists "admin full access services" on public.services;
create policy "admin full access services" on public.services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- TESTIMONIALS
drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials
  for select using (true);

drop policy if exists "admin full access testimonials" on public.testimonials;
create policy "admin full access testimonials" on public.testimonials
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- SITE SETTINGS
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select using (true);

drop policy if exists "admin full access settings" on public.site_settings;
create policy "admin full access settings" on public.site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- MESSAGES (visitors can submit, only admin can read/manage)
drop policy if exists "public insert messages" on public.messages;
create policy "public insert messages" on public.messages
  for insert with check (true);

drop policy if exists "admin full access messages" on public.messages;
create policy "admin full access messages" on public.messages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKETS (thumbnails, videos, avatars) — all public-read
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "public read storage" on storage.objects;
create policy "public read storage" on storage.objects
  for select using (bucket_id in ('thumbnails', 'videos', 'avatars'));

drop policy if exists "admin upload storage" on storage.objects;
create policy "admin upload storage" on storage.objects
  for insert with check (
    bucket_id in ('thumbnails', 'videos', 'avatars') and auth.role() = 'authenticated'
  );

drop policy if exists "admin update storage" on storage.objects;
create policy "admin update storage" on storage.objects
  for update using (
    bucket_id in ('thumbnails', 'videos', 'avatars') and auth.role() = 'authenticated'
  );

drop policy if exists "admin delete storage" on storage.objects;
create policy "admin delete storage" on storage.objects
  for delete using (
    bucket_id in ('thumbnails', 'videos', 'avatars') and auth.role() = 'authenticated'
  );

-- ============================================================================
-- SAMPLE DATA (safe to delete later from the Admin Panel)
-- ============================================================================

insert into public.services (name, price_label, description, features, featured, sort_order)
values
  ('Reel & Social Cut', '₹4,999 onward', 'Fast-turnaround vertical edits built for Instagram and YouTube Shorts.',
   array['Up to 60s edit','Trending sound sync','2 revisions','48hr delivery'], false, 1),
  ('Wedding Film', '₹34,999 onward', 'A full cinematic wedding story — highlight film plus raw-moment reel.',
   array['4-8 min highlight film','Drone coverage add-on','Color graded','3 revisions'], true, 2),
  ('Commercial / Brand Film', '₹49,999 onward', 'Polished brand storytelling for product launches and campaigns.',
   array['Concept + storyboard','Full production','Motion graphics','Unlimited revisions'], false, 3)
on conflict do nothing;

insert into public.testimonials (client_name, client_role, quote, rating, sort_order)
values
  ('Ananya & Rohit', 'Wedding Clients', 'Sumit turned our wedding day into a film we will watch for the rest of our lives.', 5, 1),
  ('Kabir Malhotra', 'Founder, Loop Studios', 'Fast, professional, and the final cut looked more expensive than what we paid for.', 5, 2)
on conflict do nothing;
