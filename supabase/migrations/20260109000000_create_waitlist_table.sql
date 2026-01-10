-- Create waitlist table
create table if not exists public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anyone to insert (public waitlist)
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

-- Only authenticated users (admins) can view
create policy "Authenticated users can view waitlist"
  on public.waitlist for select
  to authenticated
  using (true);
