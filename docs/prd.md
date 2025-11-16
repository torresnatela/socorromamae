# Socorro Mamãe — ByeBye Fralda Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Deliver a secure caregiver sign-up/login front door so only authorized adults can access child potty-training data.
- Provide a guided child registration flow (name, DOB, derived age badge, weight, height) as the first step after authentication.
- Deliver a single AI chat and logging hub so caregivers can record potty events via slash commands or quick chips and receive evidence-based coaching instantly.
- Translate logs into readiness status, 7-day KPIs, and reminder routines so families know when to encourage sits or pause training.
- Embed LGPD-compliant data handling, explicit consent, and “Why this advice?” sourcing to build trust with Brazilian caregivers and clinicians.
- Enable caregiver/creche collaboration through secure invites and shared progress views without leaving the app.

### Background Context
Brazilian caregivers struggle to track potty-training progress because guidance is fragmented across blogs, pediatric offices, and ad-hoc spreadsheets. ByeBye Fralda targets this gap with a Brazil-first module that keeps onboarding, readiness gating, AI chat logging, and KPI visualization inside one friendly interface. The conversational model interprets structured slash commands, references NHS/SBP routines (post-meal sits, positive reinforcement, foot support), and raises red-flag prompts when concerning symptoms appear. By constraining scope to one chat hub plus one progress screen, the MVP can ship quickly on BMAD + OpenAI infrastructure while still addressing regulatory requirements like LGPD minimal data capture, caregiver consent, and data portability.

### Change Log

| Date       | Version | Description                 | Author |
|------------|---------|-----------------------------|--------|
| 2025-11-16 | v0.1    | Initial PRD draft (MVP)     | John   |

### Baby Registration Overview
After authentication, caregivers must complete a dedicated “Register your child” step before accessing chat or progress views. The form collects the child’s full name, date of birth (with date picker), weight in kilograms, and height in centimeters. Saving the profile displays an age badge (e.g., “2y 1m”), and the screen optionally offers caregiver invites so co-parents or creche staff can be added immediately. This section becomes editable later via Settings but remains a standalone flow to emphasize data accuracy and LGPD consent.

### Subscription & Billing Overview
Socorro Mamãe — ByeBye Fralda operates on a monthly recurring subscription processed via Stripe. New caregivers receive a 3-day free trial but must enter payment details (credit card) before activation; billing starts automatically after the trial unless canceled. The app must surface clear pricing, trial countdown, and in-app flows for managing payment methods or canceling via Stripe Customer Portal integrations. Billing events and status (active, trialing, past due) will gate access to chat/progress features; non-paying or expired users should be redirected to the subscription management screen.

## Requirements

### Functional
1. FR1: Provide caregiver authentication (email + password or federated login) with session management so only verified adults access the ByeBye Fralda module.
2. FR2: Upon first login, present a dedicated child registration form capturing name, DOB (date picker), weight (kg), height (cm), deriving an age badge once saved.
3. FR3: The AI chat must provide accessible logging controls (primary quick-action buttons or chips labeled “Pee”, “Poop”, “Accident”, “Fluids”, “Sat”, “Reward”) with optional slash commands for power users, parse time/quantity details (default “now” if no time input), and write structured log entries tied to the child profile.
4. FR4: A readiness checklist accordion shall remain visible until all NHS/SBP readiness criteria are satisfied or the caregiver explicitly defers with guidance recorded, and the “Calculate readiness” CTA must output clear states (“Ready”, “Monitor”, “Not Ready Yet”) with state-specific advice.
5. FR5: The chat model must surface pediatric-aligned action cards (post-meal reminders, foot support tips, hygiene checklist, red-flag escalation) based on recent logs and caregiver prompts, plus empty-state suggestions when not ready, and each card must reference its source (NHS/SBP) via the evidence drawer.
6. FR6: The Progress view shall display 7-day KPI tiles (success count, accidents, longest dry interval, trend vs prior week) plus a successes vs accidents bar chart and time-of-day heatmap.
7. FR7: Routine toggles (after meals, after nap, before bedtime) must sync between Progress view controls and chat suggestions, including scheduled reminders and immediate cessation when toggled off.
8. FR8: Implement Stripe subscription flows with mandatory credit card capture, 3-day free trial, automated recurring billing, retry handling for failed payments, and in-app handling of billing status (trialing, active, past due, canceled) that gates access to chat/progress features and shows next steps (update card, contact support).
9. FR9: Caregiver/creche invites shall grant read-only or write access to logs and progress, capture consent in the audit trail, support email-based invite links with expiry, and allow revocation from Settings.
10. FR10: The app must provide “Why this advice?” drawers linking each coaching tip to NHS/SBP sources plus LGPD consent/export/delete flows accessible from Settings, producing machine-readable exports on demand.
11. FR11: Pee/poop/accident/fluids/sit/reward events must persist in the database with timestamps and metadata, and the latest 24 hours of structured events (plus weekly aggregates) must be injected into the LLM agent’s conversational context so guidance stays personalized while controlling token usage.

### Non Functional
1. NFR1: All child data collection, processing, and sharing must comply with LGPD (Lei 13.709/2018) with explicit parental consent and purpose limitation.
2. NFR2: AI responses should be localized for Brazilian Portuguese caregivers, maintain a calm/non-judgmental tone, and avoid medical diagnoses while flagging red-flag terms.
3. NFR3: Telemetry and KPI calculations must process the latest 7 days of data under 2 seconds to keep Progress screen responsive on typical mid-range mobile devices.
4. NFR4: System prompts and inference calls must run on OpenAI GPT-4.1 / 4.1-mini (with fallbacks) through BMAD-approved SDKs to ensure consistent logging and auditability.
5. NFR5: The solution should be deployable within the existing BMAD monorepo workflow, reusing coding standards, CI, and security controls already defined for the Socorro Mamãe app.

## User Interface Design Goals
_(Assumptions marked with ⚠️ where the prototype or brief left gaps.)_

### Overall UX Vision
Deliver a calm, supportive conversational experience where caregivers feel guided, not judged. Visuals mirror the Figma prototype: warm neutrals, friendly typography, simple cards, and clear evidence badges. Every flow should reinforce trust (LGPD notices, source citations) while keeping the interface uncluttered—one chat hub and one progress view.

### Key Interaction Paradigms
- Conversational-first logging: AI chat with quick buttons, optional text commands, inline action cards.
- Anchored accordions/cards: Readiness checklist, KPI tiles, and reminder toggles use expanding cards for clarity.
- Contextual nudges: Evidence drawer links, “next step” banners, and billing status modals appear at the top of the chat stack.
- ⚠️ Gesture/voice support assumed minimal at MVP (mic button cues future upgrade).

### Core Screens and Views
1. Authentication & Billing: login/signup, credit card capture, trial countdown, billing status.
2. Child Registration: name/DOB/weight/height form with age badge preview.
3. Chat Hub: header with child info, readiness accordion, quick-action chips, AI thread, composer.
4. Progress Screen: KPI cards, success vs accident chart, time-of-day heatmap, routine toggles, caregiver sharing CTA.
5. Settings & Safety: edit child data, manage caregivers, reminders, privacy/evidence drawers, export/delete.

### Accessibility: WCAG AA
- High-contrast buttons for quick actions, text alternatives for icons.
- Support dynamic type up to 130%.
- ⚠️ Need confirmation on voice-over labels for Portuguese screen readers.

### Branding
Use the Socorro Mamãe palette from the prototype (soft oranges/pinks, supportive blues). Tone must remain non-judgmental and pediatrician-approved. ⚠️ Awaiting finalized typography tokens; currently mirroring prototype’s rounded sans-serif.

### Target Device and Platforms: Mobile Only
Design primarily for modern iOS/Android phones (portrait). Desktop views considered backlog. ⚠️ Tablet layout TBD; responsive rules should stretch chat height but keep single-column layout.

## Technical Assumptions

### Repository Structure: Monorepo
Socorro Mamãe already uses the BMAD monorepo conventions, so ByeBye Fralda will live inside the existing repo under `/apps/socorromamae`. This keeps dev standards, shared tooling, and CI/CD uniform.

### Service Architecture
Single Next.js/React Native client + BMAD backend services (monolith API) should suffice for MVP. Stripe billing webhooks, OpenAI proxy, and data persistence can remain as modules inside the existing monolith to minimize infra overhead.

### Testing Requirements
- Unit tests for chat parsing, readiness calculations, KPI aggregations, and Stripe state handling.
- Integration tests covering logging ↔ database ↔ AI context injection, as well as subscription gating.
- Manual/UX validation for onboarding, evidence drawers, and LGPD consent/export flows.

### Additional Technical Assumptions and Requests
- Use OpenAI GPT-4.1 / 4.1-mini via BMAD’s Codex middleware; fall back to smaller models if quotas hit.
- Event data stored in PostgreSQL (existing infra) with retention to support 90-day analytics backlog.
- Stripe Customer Portal embedded via hosted components to reduce compliance burden.
## Epic List
1. **Epic 1 – Foundations, Auth & Baby Registration:** Stand up authentication, subscription gating, and initial child registration flow tied to LGPD consent.
2. **Epic 2 – Conversational Hub (Pre-AI):** Implement the chat UI, quick logging, readiness checklist, action cards, evidence drawer, and Supabase persistence without invoking the AI yet.
3. **Epic 3 – AI Enablement & Agent Configuration:** Integrate OpenAI models, connect recent logs into the agent context, and tune prompts/red-flag logic.
4. **Epic 4 – Progress, Routines & Collaboration:** Deliver KPI dashboard, reminders, caregiver sharing, and Settings/Safety management (privacy/export/delete).

## Epic 1 – Foundations, Auth & Baby Registration
Secure the entry point, trial billing, and child data capture to satisfy LGPD before any chat or progress features are available.

### Story 1.1 Caregiver Authentication & LGPD Consent
As a caregiver,  
I want to sign up/login securely and acknowledge LGPD terms,  
so that I can access ByeBye Fralda knowing my child’s data is protected.

#### Acceptance Criteria
1. Shows signup/login screens with email/password and federated options, plus LGPD consent checkbox.
2. Blocks access to the module until consent is accepted; logs consent timestamp per user.
3. Supports password reset and session persistence up to 30 days.

### Story 1.2 Subscription & Trial Gating
As a caregiver,  
I want to add my credit card and understand the 3-day trial,  
so that I can continue using the app after the trial without interruption.

#### Acceptance Criteria
1. Stripe checkout captures card before activating free trial; displays trial countdown and pricing.
2. Billing status (trialing, active, past due, canceled) syncs via Stripe webhooks and gates app access with contextual messaging.
3. Provides update-payment and cancel buttons linking to Stripe Customer Portal.

### Story 1.3 Baby Registration Flow
As a caregiver,  
I want to register my child with basic stats,  
so that the AI chat and progress views personalize guidance correctly.

#### Acceptance Criteria
1. Dedicated screen collects name, DOB (date picker), weight (kg), height (cm), and optional photo; displays derived age badge.
2. Prevents entering chat/progress until registration is complete; stores LGPD consent metadata with the child record.
3. Allows editing child info later via Settings while keeping initial registration as a guided funnel.

## Epic 2 – Conversational Hub (Pre-AI)
Implement the chat UI, readiness checklist, logging persistence, and evidence drawer using Supabase—LLM responses remain mocked/static for now.

### Story 2.1 Readiness Checklist & Header
As a caregiver,  
I want to see my child’s readiness status and quick actions,  
so that I know whether to encourage training or wait.

#### Acceptance Criteria
1. Header shows child avatar/name/age badge plus icons for Progress and Settings.
2. Readiness accordion lists NHS/SBP criteria with checkboxes and a “Calculate readiness” button returning Ready/Monitor/Not Ready Yet states with contextual advice.
3. Pinned banner offers guidance if the child is not ready (play with potty, observe signals) and can pause training.

### Story 2.2 Event Logging & Persistence
As a caregiver,  
I want to log potty events quickly and see them reflected in the timeline,  
so that the chat stays accurate once AI is enabled.

#### Acceptance Criteria
1. Quick-action buttons and optional slash commands log pee/poop/accident/fluids/sat/reward events with timestamps (default now) and optional notes/volume.
2. Logs persist to Supabase (PostgreSQL) with audit metadata and are retrievable for the timeline and chart previews.
3. Composer includes text field with slash hints, mic button (future), and attachment icon; invalid entries receive inline corrections and do not call AI yet (uses canned responses).

### Story 2.3 Evidence Drawer & Red-Flag Prompts
As a caregiver,  
I want to understand why the AI suggests something and know when to call a pediatrician,  
so that I can trust the advice.

#### Acceptance Criteria
1. Each action card displays a “Why this advice?” link opening a drawer citing NHS/SBP sources and snippet (static content for now).
2. Red-flag prompts are rule-based (keyword detection) and advise consulting a pediatrician even before AI integration.
3. Settings includes LGPD consent/export/delete buttons referencing policy links.

## Epic 3 – AI Enablement & Agent Configuration
Activate OpenAI-powered responses, contextual data injection, and officered agent prompts while ensuring safety behaviors.

### Story 3.1 LLM Integration & Prompt Tuning
As the product team,  
I want the chat to use OpenAI GPT-4.1/4.1-mini with disciplined prompts,  
so that caregivers receive localized, evidence-backed guidance.

#### Acceptance Criteria
1. System prompt anchors to NHS/SBP guidelines, prohibits diagnoses, and references LGPD constraints.
2. Chat requests include the latest 24h structured events + weekly aggregates; drop gracefully if token budget is exceeded.
3. Implement fallback to GPT-4.1-mini with consistent logging when quota or latency issues occur.

### Story 3.2 AI-Aware Action Cards & Nudges
As a caregiver,  
I want action cards to adapt to my logs automatically,  
so that I get timely reminders and reinforcement.

#### Acceptance Criteria
1. AI responses inspect recent events and suggest toggling reminders, foot support, hygiene steps, etc., with citations.
2. Empty-state suggestions update once readiness switches to “Ready,” encouraging sits and rewards.
3. Ensure AI never contradicts the red-flag rules—if a red flag was triggered, it must reinforce the escalation message.

### Story 3.3 AI Safety, Logging & Monitoring
As the compliance team,  
I want safeguards and observability around AI outputs,  
so that we can detect misuse or hallucinations.

#### Acceptance Criteria
1. Log every prompt/response pair with metadata (model used, latency, tokens) in Supabase for review.
2. Add filters for sensitive keywords and escalate to manual review if AI mentions diagnoses or deviates from policy.
3. Provide a “Report guidance” link in chat that lets caregivers flag problematic replies for audit.

## Epic 4 – Progress, Routines & Collaboration
Translate logs into visual KPIs, routine reminders, and caregiver sharing to keep everyone aligned.

### Story 3.1 KPI Dashboard & Charts
As a caregiver,  
I want to see weekly potty-training trends,  
so that I can adjust routines based on evidence.

#### Acceptance Criteria
1. KPI cards show successes, accidents, longest dry interval, and trend arrow vs prior week.
2. Bar chart displays successes vs accidents per day for the last 7 days; heatmap highlights time-of-day hot spots.
3. Loading/empty states explain when data is insufficient (e.g., less than 2 days of logs).

### Story 3.2 Reminders & Routine Toggles
As a caregiver,  
I want to manage reminders around meals, naps, and bedtime,  
so that we keep a consistent training rhythm.

#### Acceptance Criteria
1. Toggles for after meals, after nap, before bedtime sync with chat suggestions and push reminders.
2. Weekly goals modal provides evidence-based tips (sit 3–5 min post-meal, positive language, caregiver consistency).
3. Turning a toggle off stops reminders immediately and updates the chat action cards.

### Story 3.3 Caregiver Sharing & Safety Settings
As a caregiver,  
I want to invite co-parents or creche staff securely,  
so that everyone stays aligned without leaving the app.

#### Acceptance Criteria
1. Invite flow sends email link with expiration, letting caregivers choose read-only or write permissions.
2. Settings lists active caregivers with revoke option, plus Notification schedule and privacy note referencing LGPD rights.
3. Export/delete/self-service flows produce machine-readable files and acknowledge requests within the app UI.

## Checklist Results Report
**Summary:** PRD covers goals, requirements, UI/tech guidance, four epics with sequential stories, and LGPD/Stripe/OpenAI specifics. Identified minor gaps around success metrics/out-of-scope callouts.

| Category | Status | Critical Issues |
| --- | --- | --- |
| Problem Definition & Context | PASS | Need to add explicit success metrics in future revision |
| MVP Scope Definition | PARTIAL | Out-of-scope list not formally captured |
| User Experience Requirements | PASS | Accessibility assumptions noted |
| Functional Requirements | PASS | Requirements numbered and testable |
| Non-Functional Requirements | PASS | LGPD, localization, performance, stack constraints |
| Epic & Story Structure | PASS | Stories sequential, acceptance criteria concrete |
| Technical Guidance | PASS | Repo/architecture/testing assumptions documented |
| Cross-Functional Requirements | PARTIAL | Data retention noted but integration monitoring details could expand |
| Clarity & Communication | PASS | Structured sections, change log, assumptions flagged |

**Top Issues**
- *High*: Define measurable business KPIs (activation, conversion, retention) and add explicit “out of scope” list (e.g., no desktop/tablet, no multi-child yet).
- *Medium*: Expand monitoring/alerting expectations for Stripe webhooks and AI safety logs.

**Decision:** Ready for Architect once metrics/out-of-scope bullets are added (can be handled in next update).

## Next Steps

### UX Expert Prompt
“Please review the ByeBye Fralda PRD (docs/prd.md) focusing on the chat hub + progress view UX. Validate the readiness checklist behavior, quick-action logging, billing UX, and evidence drawer flows, and highlight any risks in accessibility or Brazilian caregiver tone. Output refined wire guidance referencing the existing Figma prototype at https://snack-sound-36311351.figma.site.”

### Architect Prompt
“Using docs/prd.md, design the system for Socorro Mamãe — ByeBye Fralda MVP: detail how authentication, Stripe trial gating, Supabase event storage, OpenAI GPT-4.1 integration, and KPI/reminder engines will interact inside the BMAD monorepo. Include data models, API contracts, webhook handling, AI safety logging, and deployment/testing considerations.”
