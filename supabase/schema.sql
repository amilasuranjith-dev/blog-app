-- Supabase Database Schema for blog-app

-- ==========================================
-- 1. PROFILES TABLE & AUTH TRIGGER
-- ==========================================
create table public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text default 'reader',
  created_at timestamp default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Profiles RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- ==========================================
-- 2. POSTS TABLE
-- ==========================================
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id),
  title text not null,
  content text,
  cover_image_url text,
  is_premium boolean default false,
  status text default 'draft',
  slug text unique,
  created_at timestamp default now(),
  published_at timestamp
);

-- Posts RLS
alter table public.posts enable row level security;

create policy "Published posts viewable by everyone"
  on public.posts for select using (status = 'published');

create policy "Admin can do everything on posts"
  on public.posts for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ==========================================
-- 3. SUBSCRIPTIONS TABLE
-- ==========================================
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'inactive',
  current_period_end timestamp,
  created_at timestamp default now()
);

-- Subscriptions RLS
alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can insert own subscription"
  on public.subscriptions for insert with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.subscriptions for update using (auth.uid() = user_id);


-- ==========================================
-- 4. STORAGE BUCKET POLICIES (post-images)
-- ==========================================
-- Ensure RLS is enabled on the storage.objects table
alter table storage.objects enable row level security;

-- Allow ANYONE to view/read images in the 'post-images' bucket
create policy "Anyone can read post images"
on storage.objects for select
using ( bucket_id = 'post-images' );

-- Allow ADMINS ONLY to upload new images
create policy "Admins can upload post images"
on storage.objects for insert
with check (
  bucket_id = 'post-images'
  and auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- Allow ADMINS ONLY to update existing images
create policy "Admins can update post images"
on storage.objects for update
using (
  bucket_id = 'post-images'
  and auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- Allow ADMINS ONLY to delete images
create policy "Admins can delete post images"
on storage.objects for delete
using (
  bucket_id = 'post-images'
  and auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);
