# Socorro Mamãe – Fullstack Architecture (Epic 1 Focus)

## Introduction
This document distills the PRD (docs/prd.md) into a concrete architecture that two parallel developers can execute. We anchor on Epic 1 (authentication, subscription gating, baby registration) and provide the API contracts the shared Next.js App Router frontend/backend needs while also describing how the deployment and Supabase data stack collaborate. Later epics can extend these same patterns without rework.

## Change Log
| Date       | Version | Description                                      | Author  |
|------------|---------|--------------------------------------------------|---------|
| 2025-11-16 | v0.1    | Initial Epic-1-focused fullstack architecture    | Winston |

## Technical Summary
- **Architecture style:** Client → Backend-for-Frontend (Next.js App Router) → Supabase (PostgreSQL + Auth + Storage) + Stripe. All services exchange JSON over HTTPS, with the backend mediating every third-party call to enforce LGPD requirements.
- **Frontend:** Next.js 14 App Router UI (React 18 + TypeScript) served from the same codebase as the backend. Client components use React Query and Zod schemas for runtime validation, while server components fetch data via internal service helpers.
- **Backend:** Next.js 14 serverless/edge routes under `/app/api` sharing the same repository. API handlers call service modules in `/src/modules/**` and integrate with Supabase (service role) plus the Stripe SDK.
- **Infrastructure:** Vercel handles deployments and previews for both apps. Supabase hosts Postgres, Auth, and Storage in the `sa-east-1` region for low-latency to Brazil. Stripe powers checkout and webhook-driven subscription status.
- **Primary focus:** Define rock-solid contracts for authentication, consent tracking, Stripe gating, and child registration so the frontend developer can build against stable mocks while backend work continues.

## Platform & Infrastructure Decisions
| Option                       | Pros                                                                 | Cons                                                               |
|------------------------------|----------------------------------------------------------------------|--------------------------------------------------------------------|
| **Vercel + Supabase (Chosen)** | Native Next.js optimizations, serverless auto-scale, Supabase Auth/DB integration, Brazil region, low ops overhead | Requires careful rate control per function; vendor lock-in         |
| AWS (API Gateway + RDS)      | Fine-grained IAM, enterprise controls                                 | Slower to stand up, more infra to manage, higher ops burden        |
| GCP (Cloud Run + Cloud SQL)  | Good for containerized workloads                                      | Less community tooling for Next.js-first workflows                 |

**Key Services:** Vercel (frontend + backend deployments), Supabase (Postgres, Auth, Storage, Row Level Security), Stripe (Checkout + Billing portal), Clerk-like features handled by Supabase Auth.  
**Deployment Region:** Vercel project region: `iad1` (supports São Paulo edge). Supabase project region: `sa-east-1`. Stripe is global but webhooks terminate in Vercel (U.S. east) and forward internally.
**Domain Strategy:** Marketing site lives at `www.socorromamae.com.br`. The authenticated app initially runs on the default Next.js/Vercel link (e.g., `socorromamae-next.vercel.app`) until DNS cutover, so all API URLs should be relative to accommodate the later switch to `app.socorromamae.com.br` or similar.

## Repository Structure
Use a Turborepo-like structure (still npm workspaces) but with a single Next.js app that hosts both UI and API routes.

```
/ (socorromamae)
├── apps/
│   └── app/        # Next.js 14 App Router (UI + API routes in one project)
├── packages/
│   ├── config/     # Runtime configuration, env schema, constants
│   ├── shared/     # zod schemas, DTOs, type guards shared FE/BE
│   └── ui/         # Shared UI primitives (buttons, form controls)
└── docs/           # PRD, architecture, specs
```

Nx is optional; Turborepo with npm workspaces keeps the toolchain lightweight. Each app builds independently so both developers can ship in parallel.

## Environment Configuration
Create `.env` files per app that import from `packages/config/env.ts`. Critical variables (in Vercel encrypted envs):

| Variable                        | Description                                               |
|---------------------------------|-----------------------------------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`      | Base URL for frontend REST calls (defaults to `/api`)     |
| `NEXT_PUBLIC_STRIPE_PRICE_ID`   | Stripe price for subscription                            |
| `SUPABASE_URL`                  | Supabase project URL                                      |
| `SUPABASE_ANON_KEY`             | Public key for frontend Supabase client (read-only)       |
| `SUPABASE_SERVICE_KEY`          | Backend-only service role key (stored only in API app)    |
| `STRIPE_SECRET_KEY`             | Backend SDK key                                           |
| `STRIPE_WEBHOOK_SECRET`         | Webhook signature secret                                 |
| `AUTH_JWT_SECRET`               | Backend-issued session token secret (wrapping Supabase)   |
| `LGPD_CONSENT_VERSION`          | Tracks which terms version was accepted                   |

Backend API never exposes Supabase service keys to frontend code. Client components always hit `/api` handlers for privileged actions; direct Supabase client usage is limited to server components (e.g., for SSR) or to read-only anon operations.

## System Context
```
Next.js App Router UI (Vercel) --> Next.js API routes (same deployment, edge/serverless)
Next.js API routes --> Supabase Auth (OIDC) + Postgres via service key
Next.js API routes --> Stripe Checkout + Webhooks
Next.js API routes --> Supabase Storage (optional child avatar)
```
All LGPD-triggering flows (consent capture, child registration, data export) occur through backend endpoints that enforce auditing.

## Backend Architecture (Next.js API)
- **Routing:** `app/api/v1/**/route.ts` functions. Each route calls service modules inside `apps/app/src/modules/*`.
- **Modules (Epic 1):** `auth`, `consent`, `subscription`, `child-profile`. Each module has `controller`, `service`, `repository`, and `schema`.
- **Data Layer:** Supabase client configured with service role key. Row Level Security policies restrict caregivers to their own data. Repositories call stored procedures for multi-step transactional logic (e.g., create caregiver + consent + child skeleton).
- **Auth:** Supabase Auth handles email/password + OAuth. Backend exchanges Supabase session tokens for HTTP-only cookies using Next.js middleware. LGPD consent timestamp stored in `caregiver_consents`.
- **Stripe:** Backend creates Checkout Sessions and listens to `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted` via `/api/v1/subscription/webhook`.

## Frontend Architecture (Next.js App Router)
- **Bundler:** Next.js compiler (SWC) + Turbopack dev server.
- **Routing:** App Router layouts: `(unauth)` → `auth` pages, `(gated)` layout ensures subscription + registration, then `app` segment hosts chat/progress once unlocked.
- **State/Data:** React Query for client caching + Server Actions for mutations where appropriate; lightweight Zustand store for UI-only concerns.
- **Auth UX:** Client collects credentials/LGPD checkbox, dispatches to `/api/v1/auth/*`. Session cookie handled via `next/headers` cookies; `getServerSession` helper hydrates layouts.
- **Forms:** React Hook Form + Zod resolvers for registration and payment gating; shared form components live in `packages/ui`.

## API Contracts (Epic 1 Focus)
All responses wrap data in `{ data, meta }` or `{ error }` shapes. Timestamps are ISO8601 strings. IDs are ULIDs.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | Creates caregiver auth account, records LGPD consent |
| `/api/v1/auth/login` | POST | Authenticates caregiver, refreshes session cookie |
| `/api/v1/auth/logout` | POST | Revokes current refresh token and clears cookie |
| `/api/v1/auth/me` | GET | Returns caregiver profile, consent status, subscription state |
| `/api/v1/subscription/checkout-session` | POST | Returns Stripe Checkout URL for upgrading/gating |
| `/api/v1/subscription/status` | GET | Returns `trialing/active/past_due/canceled` plus trial end timestamp |
| `/api/v1/subscription/webhook` | POST | Stripe webhook receiver (backend only) |
| `/api/v1/children` | POST | Creates/updates initial child profile (registration wizard) |
| `/api/v1/children/:childId` | PATCH | Edits child properties post-onboarding |
| `/api/v1/consents` | POST | Records additional consents (invites, export, deletion) |

### Auth & Consent
```http
POST /api/v1/auth/signup
Content-Type: application/json
{
  "email": "caregiver@example.com",
  "password": "S3cure!",
  "fullName": "Maria Souza",
  "lgpdAccepted": true,
  "acceptedAt": "2025-11-16T12:00:00Z",
  "marketingOptIn": false
}
```
**Response 201**
```json
{
  "data": {
    "caregiverId": "01HFJ2K5X73E5M7G4QS7ASD8R0",
    "sessionExpiresAt": "2025-12-16T12:00:00Z",
    "subscription": { "status": "trialing", "trialEndsAt": "2025-11-19T12:00:00Z" }
  }
}
```
Notes:
- `lgpdAccepted` must be `true`; backend stores version from `LGPD_CONSENT_VERSION`.
- Backend creates Supabase auth user → writes `caregivers` row → `caregiver_consents`.

`POST /api/v1/auth/login` mirrors signup but requires `email`, `password`. Both endpoints return HTTP-only cookies.

### Subscription
```http
POST /api/v1/subscription/checkout-session
{
  "returnUrl": "https://app.bybfralda.com/app",
  "mode": "subscription"
}
```
**Response**
```json
{ "data": { "checkoutUrl": "https://checkout.stripe.com/c/pay_..." } }
```

Stripe webhook payloads are verified and mapped into `subscription_status` table:
```json
{
  "event": "customer.subscription.updated",
  "object": {
    "status": "active",
    "current_period_end": 1731883200
  }
}
```
Backend updates `subscription_status.status`, `renewalAt`, `canceledAt`.

### Child Registration
```http
POST /api/v1/children
{
  "fullName": "Ana Clara",
  "dateOfBirth": "2023-09-01",
  "weightKg": 12.4,
  "heightCm": 87,
  "photoId": "child-avatars/01HFJ2K..." // optional Supabase Storage reference
}
```
**Response**
```json
{
  "data": {
    "childId": "01HFJ2K5X73E5M7G4QS7A3C6HQ",
    "ageBadge": "2y 1m",
    "registrationComplete": true
  }
}
```
Validation rules:
- Age must be between 12 months and 6 years; backend derives badge string.
- On first creation backend enforces `registrationComplete = true` before unlocking chat/progress.
- Endpoint automatically associates the caregiver from the session cookie; no caregiverId parameter is accepted client-side.

`PATCH /api/v1/children/:childId` accepts the same fields plus `heightCmDelta` etc. All writes insert audit rows via Supabase triggers.

## Data Model Snapshot (Supabase/PostgreSQL)
```sql
create table caregivers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  full_name text not null,
  email text not null unique,
  created_at timestamptz default now()
);

create table caregiver_consents (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid references caregivers(id),
  consent_type text not null, -- lgpd_terms, marketing, data_export
  consent_version text not null,
  accepted_at timestamptz not null
);

create table subscription_status (
  caregiver_id uuid primary key references caregivers(id),
  stripe_customer_id text not null,
  status text not null, -- trialing, active, past_due, canceled
  trial_ends_at timestamptz,
  renewal_at timestamptz,
  canceled_at timestamptz,
  updated_at timestamptz default now()
);

create table children (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references caregivers(id),
  full_name text not null,
  date_of_birth date not null,
  weight_kg numeric(4,1),
  height_cm numeric(4,1),
  photo_path text,
  registration_complete boolean default false,
  lgpd_metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```
Row Level Security policies restrict selects/updates to the authenticated caregiver’s `auth_user_id`.

## Security & Compliance Notes
- **Session Strategy:** Backend issues short-lived JWT cookies (`session=...`) signed with `AUTH_JWT_SECRET`, containing Supabase user ID. Refresh via `/api/v1/auth/refresh`.
- **LGPD Tracking:** Every flow requiring explicit consent writes to `caregiver_consents`; changes to child data log into `children_audit` table (not shown) for traceability.
- **PII Encryption:** Sensitive columns (child names, caregiver names) encrypted at-rest using Supabase column-level encryption. Access always via backend service key; frontend never receives direct DB credentials.
- **Data Residency:** All storage remains in Supabase São Paulo region; Stripe stores limited billing info (tokenized).
- **Error Responses:** Use `ApiError` structure with `requestId` generated via `@logtail/next`. Frontend surfaces localized messages.

## Testing Strategy
- **Unit Tests:** Vitest + Testing Library for React/Next components, Zod schemas, and service helpers. Run on every push.
- **Integration Tests (QA-Owned):** Playwright API + Supabase Test Containers hitting `/api/v1/**` against a seeded ephemeral database. QA authors/maintains these specs but they run automatically in `pnpm test:integration` during development and CI; failures block merges.
- **End-to-End Smoke:** Optional minimal flows in Playwright UI once registration + auth screens land, primarily to validate wiring before full Epic 2 scope.
- **Tooling:** `packages/config/jest.setup.ts` (or Vitest equivalent) manages environment bootstrapping; Supabase CLI spins local stack for integration suites.

## Deployment & DevOps
- **Branching:** `main` (prod), `develop` (staging). Two long-lived feature branches (`feature/backend` and `feature/frontend`) allow each developer to move independently. Story branches branch off their respective lane (e.g., `feature/backend/story-1.1-auth`). Merge flow: story branch → respective lane → `develop` → `main` after QA. Turborepo `pipeline` ensures only touched modules rebuild.
- **CI/CD:** GitHub Actions → run lint/test (including integration suites) → deploy preview to Vercel (`app`). On merge to `main`, Vercel promotes to production. Supabase migrations executed via `supabase db push` inside CI before backend deploy.
- **Secrets:** Managed in Vercel + Supabase vault. Stripe webhook secret stored only in backend project.

## Monitoring & Logging
- **Backend:** Vercel Observability + Logtail for structured app logs, with request IDs forwarded to Supabase using `pg_stat_activity.application_name`.
- **Frontend:** Vercel Web Analytics + Sentry for JS errors.
- **Key Metrics (Epic 1):** Signup conversion, consent completion, trial to paid conversion, registration completion time, failed Stripe payments.

## Next Steps / Questions
1. Confirm the final authenticated app domain once we move off the temporary Vercel link.  
2. Provide Stripe Price IDs and LGPD consent copy so we can harden schema constants (user to supply).  
3. Once Epic 1 API contracts are accepted, replicate the same spec pattern for Epic 2 payloads (logs, readiness states).  
4. QA team to outline ownership of integration test cases for the CI suite once test scaffolding lands.

With these contracts, the frontend developer can stub all requests immediately, and the backend developer can implement Next.js routes using Supabase and Stripe integrations in parallel.
