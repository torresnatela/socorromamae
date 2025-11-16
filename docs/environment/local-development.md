# Local Environment Setup

This repository now uses a single Next.js project (no Turborepo) so backend and frontend engineers can work side-by-side without extra tooling. Follow the steps below to configure Supabase and start the dev server.

## 1. Install Tooling

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | >= 20.10.0 | Use Volta, fnm, or `nvm use` for reproducibility |
| pnpm | 8.15.x | `corepack enable` recommended |

Clone the repo and install dependencies:

```bash
pnpm install
```

## 2. Configure Environment Variables

Copy `.env.example` to `.env` and populate each value according to your Supabase + Stripe projects. The repo reads variables through `packages/config`, so missing values will throw early during `pnpm dev`.

| Variable | Description | Where to Get It |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for browser Supabase client | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** service key used by API routes | Supabase dashboard |
| `AUTH_JWT_SECRET` | Secret placeholder for upcoming auth work | Generate locally |
| `LGPD_CONSENT_VERSION` | Version identifier logged with each acceptance | Product/legal |

> Each developer keeps a personal `.env.local` that overrides shared secrets. Never commit `.env*` files except `.env.example`.

## 3. Start the App

```bash
pnpm dev
```

Visit `http://localhost:3000`. The landing page runs `/api/health`, which pings Supabase using `SUPABASE_SERVICE_ROLE_KEY`. If your connection fails, double-check the values copied from Supabase → Project Settings → API.

## 4. Deployment

Use the default Vercel flow when ready:

```bash
pnpm build
vercel deploy --prebuilt
```

(Or connect the repo to Vercel and let CI run `pnpm lint && pnpm build`.)

---

This simpler layout keeps everything inside one Next.js project. When the codebase grows, we can reintroduce workspaces or additional tooling as needed.
