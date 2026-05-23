-- The Bridge System™ production schema
-- Multiempresa + roles + RLS. Run in Supabase SQL editor before enabling real users.

create extension if not exists "pgcrypto";

create type public.bridge_member_role as enum ('owner', 'admin', 'manager', 'worker');
create type public.bridge_subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text not null,
  city text,
  size text,
  monthly_revenue text,
  model text,
  main_problem text,
  digital_maturity text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.bridge_member_role not null default 'worker',
  display_name text,
  job_title text,
  area text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.company_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  channels jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  team jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_rooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scan_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  responses jsonb not null default '{}'::jsonb,
  score_snapshot jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.bridge_inbox_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer text not null,
  channel text not null,
  responsible text,
  status text not null,
  priority text not null,
  last_interaction text,
  next_action text,
  associated_file text,
  detected_leak text,
  suggested_script text,
  tags jsonb not null default '[]'::jsonb,
  raw_provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracker_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  area text,
  origin text,
  priority text,
  owner text,
  status text not null default 'Pendiente',
  suggested_date text,
  kpi text,
  expected_impact text,
  difficulty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  cadence text,
  scope text,
  area text,
  owner text,
  progress integer not null default 0,
  due_date text,
  priority text,
  status text,
  metric text,
  companion_recommendation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  completed_at timestamptz not null default now(),
  unique (organization_id, user_id, course_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status public.bridge_subscription_status not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members member
    where member.organization_id = target_org
      and member.user_id = auth.uid()
      and member.status = 'active'
  );
$$;

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members member
    where member.organization_id = target_org
      and member.user_id = auth.uid()
      and member.status = 'active'
      and member.role in ('owner', 'admin')
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.company_profiles enable row level security;
alter table public.data_rooms enable row level security;
alter table public.scan_responses enable row level security;
alter table public.bridge_inbox_conversations enable row level security;
alter table public.tracker_tasks enable row level security;
alter table public.live_goals enable row level security;
alter table public.academy_progress enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_events enable row level security;

create policy "members can read organizations" on public.organizations
for select using (public.is_org_member(id));

create policy "admins can update organizations" on public.organizations
for update using (public.is_org_admin(id));

create policy "members can read members" on public.organization_members
for select using (public.is_org_member(organization_id));

create policy "admins can manage members" on public.organization_members
for all using (public.is_org_admin(organization_id));

create policy "members can read company profiles" on public.company_profiles
for select using (public.is_org_member(organization_id));

create policy "admins can manage company profiles" on public.company_profiles
for all using (public.is_org_admin(organization_id));

create policy "members can read data rooms" on public.data_rooms
for select using (public.is_org_member(organization_id));

create policy "admins can manage data rooms" on public.data_rooms
for all using (public.is_org_admin(organization_id));

create policy "members can read scans" on public.scan_responses
for select using (public.is_org_member(organization_id));

create policy "admins can manage scans" on public.scan_responses
for all using (public.is_org_admin(organization_id));

create policy "members can manage inbox" on public.bridge_inbox_conversations
for all using (public.is_org_member(organization_id));

create policy "members can manage tasks" on public.tracker_tasks
for all using (public.is_org_member(organization_id));

create policy "members can manage live goals" on public.live_goals
for all using (public.is_org_member(organization_id));

create policy "members can read academy progress" on public.academy_progress
for select using (public.is_org_member(organization_id));

create policy "users can manage own academy progress" on public.academy_progress
for all using (user_id = auth.uid() and public.is_org_member(organization_id));

create policy "admins can read subscriptions" on public.subscriptions
for select using (public.is_org_admin(organization_id));

create policy "members can read audit events" on public.audit_events
for select using (public.is_org_member(organization_id));
