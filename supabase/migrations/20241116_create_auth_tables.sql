-- Creates core caregiver + consent tables required for Story 1.1 auth flows.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.caregivers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  full_name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.caregiver_consents (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.caregivers (id) on delete cascade,
  consent_type text not null,
  consent_version text not null,
  accepted_at timestamptz not null default now()
);

create table if not exists public.subscription_status (
  caregiver_id uuid primary key references public.caregivers (id) on delete cascade,
  status text not null default 'trialing',
  trial_ends_at timestamptz,
  renewal_at timestamptz,
  canceled_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.caregivers is 'LGPD-audited caregivers tied to Supabase Auth users.';
comment on table public.caregiver_consents is 'Tracks LGPD consent version and timestamp per caregiver.';
comment on table public.subscription_status is 'Stubbed subscription snapshot to gate frontend layouts.';
