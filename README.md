# Socorro Mamãe App

This repository now uses a single Next.js 14 project so the team can build MVC-style features without Turborepo or workspaces. Frontend pages, API routes, and Supabase integration all live together in the same folder.

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in Supabase values
pnpm dev
```

The default page (`app/page.tsx`) reads `/api/health`, which pings Supabase using the service-role key to confirm connectivity.

## Project Layout

```
app/                 # App Router, UI + API routes
docs/api/authentication.md # Auth API contracts + testing guide
lib/supabase.ts      # Shared Supabase client helpers
public/              # Static assets
docs/                # Requirements + stories
```

## Environment Variables

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL copied from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for browser reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key used in API routes |
| `AUTH_JWT_SECRET` | Secret used to sign caregiver session JWTs |
| `LGPD_CONSENT_VERSION` | Version string logged whenever LGPD terms are accepted |
| `PASSWORD_RESET_REDIRECT_URL` | URL Supabase uses when caregiver clicks reset link |

## Auth API

The backend exposes `/api/v1/auth/{signup,login,logout,me,refresh,password-reset,password-reset/confirm}`. Payloads and curl examples are at `docs/api/authentication.md`.

Populate `.env` locally and avoid committing secrets. Once the app grows, we can introduce stricter tooling again.

## Auth API

The backend currently exposes `/api/v1/auth/{signup,login,logout,me}`. Payloads, response envelope, and curl examples live in `docs/api/authentication.md`.
