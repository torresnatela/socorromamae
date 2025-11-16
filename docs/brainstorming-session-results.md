**Session Date:** 2025-11-16  
**Facilitator:** Business Analyst Mary  
**Participant:** User

## Executive Summary

**Topic:** Socorro Mamãe — ByeBye Fralda MVP  
**Session Goals:** Focused ideation for chat flows, readiness checklist, reminders/progress KPIs, and caregiver sharing while staying aligned with NHS/SBP evidence and LGPD.  
**Techniques Used:** Mind Mapping  
**Total Ideas Generated:** 12

**Key Themes Identified:**
- One conversational hub backed by explicit slash commands keeps the MVP lightweight yet coachable.
- Readiness gating plus KPI/routine surfacing translate clinical guidance into actionable caregiver nudges.
- Evidence traceability and LGPD safeguards are product pillars, not afterthoughts.

## Technique Sessions

### Mind Mapping - 15 min

**Description:** Expanded three primary branches (Chat Hub, Progress Engine, Evidence & Privacy) grounded in the prototype to reveal concrete sub-systems.

**Ideas Generated:**
1. **Problem Statement:** Caregivers need a single, trustworthy potty-training companion that merges AI guidance, logging, and progress tracking without juggling multiple apps or guesswork.
2. **Jobs-to-Be-Done:** (a) As a parent, I want to log potty events quickly so I can see patterns and coach consistently. (b) As a caregiver/creche, I need shared context to reinforce routines. (c) As the pediatric advisor role, I need evidence-backed recommendations with clear escalation cues.
3. **UX Flows:** Onboarding → Child registration (age badge, optional caregiver invite) → Readiness checklist gate → Chat hub with chips/commands → Progress view (KPI tiles, charts, routine toggles) → Settings/Safety for data management.
4. **Data Schema:** Entities for Child, Caregiver, LogEntry (type, timestamp, quantity/notes), ReadinessChecklist (items, status), ReminderRoutine (toggle states), KPI Snapshot (7-day aggregates), and Audit events for consent/exports.
5. **Privacy Notes (LGPD):** Minimal required child data, explicit consent capture, purpose limitation tags per record, caregiver role-based access, export/delete self-service, and localized privacy copy referencing Lei 13.709/2018.
6. **Model Prompts:** System prompt anchors to NHS/SBP guidance, warns against diagnoses, interprets slash commands into structured events, asks clarifying questions for ambiguous logs, and triggers red-flag responses when pain/blood terms appear.
7. **Acceptance Criteria:** (i) Slash command parsing logs correct event type/time; (ii) Readiness checklist must be completed or deferred with rationale; (iii) Progress KPIs reflect last 7 days with trend arrows; (iv) Reminder toggles sync to chat suggestions; (v) “Why this advice” drawer cites NHS/SBP; (vi) LGPD consent + export flows available from settings; (vii) Links to BMAD repos and Figma prototype present in the spec.
8. **Reference Links:** [BMAD Method Repo](https://github.com/bmad-code-org/bmad-method) • [BMAD Core Repo](https://github.com/bmad-code-org/bmad-core) • [Figma Prototype](https://snack-sound-36311351.figma.site)

**Insights Discovered:**
- The readiness accordion can double as a dynamic trust builder by showing which pediatric criteria are satisfied from chat data.
- Slash commands plus chips reduce localization load versus dozens of forms while keeping data structured.
- KPI visuals should call out when routines are disabled to explain stagnant progress.

**Notable Connections:**
- Linking reminder toggles to AI action cards ensures conversational prompts stay in sync with scheduled nudges.
- Caregiver invites feed directly into LGPD audit logs, providing traceability for shared data access.

## Idea Categorization

### Immediate Opportunities

1. **Slash Command + Chip Logging**
   - Description: Unified parser plus horizontal chips for pee/poop/accident/fluids/sat/reward events.
   - Why immediate: Core to every flow; already framed in prototype and evidence-backed.
   - Resources needed: Chat UI wiring, parser service, telemetry.

2. **Readiness Checklist Gate**
   - Description: Accordion checklist with “Calculate readiness” CTA and NHS/SBP-aligned copy.
   - Why immediate: Required before progress KPIs make sense.
   - Resources needed: Checklist data model, guidance copy, state machine.

3. **Evidence Drawer + Privacy Footer**
   - Description: Inline “Why this advice” references and LGPD notice with consent/export links.
   - Why immediate: Compliance and trust baseline.
   - Resources needed: Content snippets, linkable policy pages, legal review.

### Future Innovations

1. **Predictive Routine Suggestions**
   - Description: Use heatmap patterns to auto-suggest optimal sit times or dry-interval goals.
   - Development needed: Lightweight forecasting, evaluation loop.
   - Timeline estimate: 1–2 sprints after MVP telemetry stabilizes.

2. **Voice-to-Slash Command Transcription**
   - Description: Convert mic input into structured events with confirmation loop.
   - Development needed: Speech recognition fine-tuning for PT-BR caregivers.
   - Timeline estimate: Post-MVP once baseline chat completes.

### Moonshots

1. **Proactive Pediatrician Escalation Bot**
   - Description: Detect complex red flags and draft a summary caregivers can send to clinicians.
   - Transformative potential: Bridges home observations with professional care seamlessly.
   - Challenges to overcome: Clinical safety review, liability boundaries, integrations.

2. **Caregiver Network Effects**
   - Description: Shared insights across anonymized cohorts to benchmark progress.
   - Transformative potential: Turns individual progress into community intelligence.
   - Challenges to overcome: Strong anonymization, opt-in consent, infrastructure.

**Insights & Learnings:**
- Caregivers respond better when KPIs tie directly to routines (“sit after lunch”).
- LGPD compliance can be a positive UX moment if framed as “your child’s data, your control.”

## Action Planning

### #1 Priority: Slash Command Logging Backbone
- Rationale: Unlocks reliable data for both chat and progress modules.
- Next steps: Define parser grammar, implement validation, surface errors inline.
- Resources needed: Backend event schema, unit tests, localization review.
- Timeline: 1 sprint.

### #2 Priority: Readiness + Progress Engine
- Rationale: Determines whether caregivers should push training or wait.
- Next steps: Build checklist UI/state, compute KPI tiles, wire charts/heatmap.
- Resources needed: Analytics pipeline, charting component, pediatric content review.
- Timeline: 1–2 sprints.

### #3 Priority: Evidence & Privacy Layer
- Rationale: Required for trust, NHS/SBP alignment, and LGPD compliance.
- Next steps: Draft “Why this advice” snippets, build consent/export flows, add footer references.
- Resources needed: Legal/content inputs, storage hooks, QA for localization.
- Timeline: 1 sprint overlapping with others.

## Reflection & Follow-up

**What Worked Well**
- Clear scope constraint (chat + progress) kept ideas focused.
- Prototype reference accelerated alignment on flows and visual language.

**Areas for Further Exploration**
- Caregiver permission tiers: refine read-only vs. write access behavior.
- Reward systems: evaluate evidence-based reinforcement mechanics beyond stickers.

**Recommended Follow-up Techniques**
- SCAMPER on routine toggles to explore alternative habit-forming cues.
- Role Playing from pediatrician perspective to stress-test red-flag handling.

**Questions That Emerged**
- How do we localize clinical copy for regional dialects without diluting accuracy?
- Should reminders respect device-level quiet hours or only in-app schedules?

**Next Session Planning**
- **Suggested topics:** Caregiver collaboration journeys, reminder escalation rules, data-export UX.
- **Recommended timeframe:** After first parser prototype (~1 week).
- **Preparation needed:** Early API schemas, content drafts, privacy checklist.

---

*Session facilitated using the BMAD-METHOD™ brainstorming framework*
