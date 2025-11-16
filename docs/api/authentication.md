# Auth API – Story 1.1

This document describes the current backend surface for caregiver authentication & LGPD consent. Use it to validate the implementation locally or via Postman / cURL.

## Prerequisites

1. Environment variables configured (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_JWT_SECRET`
   - `LGPD_CONSENT_VERSION`
2. Supabase tables created. If you are using the CLI, run:
   ```bash
   supabase db push
   ```
   which applies `supabase/migrations/20241116_create_auth_tables.sql`.

3. Run `pnpm dev` (or deploy to Vercel). All routes live under `/api/v1/auth/*`.

## Response Envelope

Every endpoint responds with:

```json
{
  "meta": {
    "requestId": "01JE5M4J4F0X6AYNB1X2NM498K",
    "timestamp": "2025-11-16T20:21:42.123Z",
    "path": "/api/v1/auth/signup"
  },
  "data": {
    "...": "..."
  }
}
```

Errors use the same envelope but place details inside `"error": { code, message, details? }`.

## Endpoints

### POST `/api/v1/auth/signup`

Creates a Supabase Auth user, inserts a caregiver row, logs LGPD consent, and issues a session cookie (`sm.session`).

Request body:

```json
{
  "email": "caregiver@example.com",
  "password": "Password123",
  "fullName": "Maria Caregiver",
  "lgpdAccepted": true,
  "keepSignedIn": false
}
```

Response data:

```json
{
  "caregiverId": "uuid",
  "sessionExpiresAt": "2025-11-16T23:21:42.123Z",
  "subscription": {
    "status": "trialing",
    "trialEndsAt": "...",
    "renewalAt": "..."
  }
}
```

Notes:
- `keepSignedIn: true` makes the JWT + cookie last 30 days, otherwise 8 hours.
- LGPD consent is logged using `LGPD_CONSENT_VERSION`.

### POST `/api/v1/auth/login`

Authenticates via Supabase Auth, loads the caregiver record, and reissues the session cookie.

Request body:

```json
{
  "email": "caregiver@example.com",
  "password": "Password123",
  "keepSignedIn": true
}
```

Response data matches the signup endpoint.

### POST `/api/v1/auth/logout`

Clears the `sm.session` HTTP-only cookie. Response:

```json
{
  "meta": { ... },
  "data": { "success": true }
}
```

### GET `/api/v1/auth/me`

Reads the session cookie, verifies the JWT, and returns the caregiver snapshot. Example response:

```json
{
  "meta": { ... },
  "data": {
    "caregiverId": "uuid",
    "sessionExpiresAt": "2025-11-16T23:21:42.123Z",
    "subscription": {
      "status": "trialing",
      "trialEndsAt": "...",
      "renewalAt": "..."
    }
  }
}
```

If the cookie is missing or the token is invalid/expired, the route returns:

```json
{
  "meta": { ... },
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired session."
  }
}
```

## Testing via cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"caregiver@example.com","password":"Password123","fullName":"Maria","lgpdAccepted":true}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"caregiver@example.com","password":"Password123"}' \
  -c cookies.txt

# Me (reuse cookie)
curl http://localhost:3000/api/v1/auth/me -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout -b cookies.txt
```

> **Local HTTPS note:** the session cookie only uses the `Secure` flag in production builds, so everything works over plain HTTP (`next dev`). On Vercel the cookie switches to HTTPS-only automatically.
