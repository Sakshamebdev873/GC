# Future Data Model — SaaS Direction

Per Mind Loop's reply (2026-08-17): the MVP itself needs no auth or
dashboards, but the architecture should be designed with the future SaaS
direction in mind (profiles, career tools, resume analysis, consultants
managing clients, client progress tracking, appointment management,
referrals). This doc is that sketch — **no code in this file is built yet**;
it exists so the current `content/*.ts` + Vercel-only MVP has a clear,
non-disruptive path to a real database and product surface later.

## Guiding principle

The MVP's `src/content/*.ts` files are already typed data shaped like what
the equivalent DB rows will look like (see README → Architecture). This
schema is that same shape, normalized into tables. Migrating means writing a
data-source adapter, not rewriting pages or components.

## Entities

```mermaid
erDiagram
    LEADS ||--o| CLIENTS : "converts to"
    CLIENTS ||--o{ CLIENT_PACKAGES : purchases
    PACKAGES ||--o{ PACKAGE_FEATURES : includes
    PACKAGES ||--o{ CLIENT_PACKAGES : "sold as"
    CONSULTANTS ||--o{ CLIENT_PACKAGES : assigned
    CLIENT_PACKAGES ||--o{ APPOINTMENTS : schedules
    CLIENT_PACKAGES ||--o{ PROGRESS_REVIEWS : tracks
    CLIENTS ||--o{ REFERRALS : refers
    LEADS ||--o| REFERRALS : "referred via"
    CLIENTS ||--o{ RESUME_ANALYSES : requests
    PACKAGES ||--o{ RESUME_ANALYSES : recommends

    LEADS {
        uuid id PK
        string name
        string email
        text message
        string referral_code "nullable, FK-ish to referrals.code"
        string source "web-form, resume-scorer, referral"
        string status "new, qualified, converted"
        timestamp created_at
    }
    CLIENTS {
        uuid id PK
        uuid lead_id FK "nullable — a client can be created without a prior lead"
        string name
        string email
        string phone
        timestamp created_at
    }
    PACKAGES {
        uuid id PK
        string slug "matches content/services.ts today"
        string name
        int duration_days
        int price_inr
        boolean recommended
        uuid built_on_package_id FK "nullable, self-ref — mirrors builtOnSlug"
    }
    PACKAGE_FEATURES {
        uuid id PK
        uuid package_id FK
        string label
        int sort_order
    }
    CONSULTANTS {
        uuid id PK
        string name
        string email
        text bio
        string[] specialties
    }
    CLIENT_PACKAGES {
        uuid id PK
        uuid client_id FK
        uuid package_id FK
        uuid consultant_id FK "nullable until assigned"
        date start_date
        date end_date
        string status "active, completed, paused"
    }
    APPOINTMENTS {
        uuid id PK
        uuid client_package_id FK
        string type "discovery_call, mock_interview, coaching_session"
        string calendly_event_id "nullable — links to existing Calendly integration"
        timestamp scheduled_at
        string status "scheduled, completed, no_show, cancelled"
    }
    PROGRESS_REVIEWS {
        uuid id PK
        uuid client_package_id FK
        int week_number
        text notes
        timestamp created_at
    }
    REFERRALS {
        uuid id PK
        uuid referrer_client_id FK
        string code UK
        uuid referred_lead_id FK "nullable until someone uses the code"
        string reward_type "free_session, cashback, extended_timeline"
        string reward_status "pending, earned, redeemed"
        timestamp created_at
    }
    RESUME_ANALYSES {
        uuid id PK
        uuid client_id FK "nullable — tool can be used pre-signup"
        string file_ref "object storage key, not the file itself"
        int ats_score
        jsonb suggestions
        uuid recommended_package_id FK
        timestamp created_at
    }
```

## Mapping from today's MVP

| Today | Future |
|---|---|
| `src/content/services.ts` (`Service[]`, fields `name`, `duration`, `additions`, `builtOnSlug`, `priceINR`, `recommended`) | `packages` + `package_features` tables. `builtOnSlug` → `built_on_package_id` self-reference, same "everything in X, plus" logic. |
| `src/lib/validation.ts` `LeadFormInput` (`name`, `email`, `message`, `referralCode`) | `leads` table, 1:1 field match — the API route already validates against this exact shape, so swapping the `console.log` in `src/app/api/contact/route.ts` for a DB insert is the only change needed. |
| `LeadForm.tsx` referral code field | `referrals.code` lookup on submit — if the code matches an existing `referrals` row, set `leads.referral_code` and later `referrals.referred_lead_id` on conversion. Reward issuance (free session / cashback / extended timeline) is a manual or semi-automated step triggered when a `client_packages` row is created for the referred client — not built in the MVP. |
| `site.calendlyUrl` (single site-wide link) | Per-consultant Calendly link on the `consultants` row, so `/book-a-call` can eventually route to the assigned consultant instead of one shared calendar. |
| `/tools/resume-scorer` placeholder page | `resume_analyses` table + an upload endpoint. `recommended_package_id` is how a score routes a visitor toward a specific package, matching the "AI-generated suggestions → directed toward relevant services" requirement. |
| No auth | Route groups already isolate marketing pages from anything future (see README). A `/dashboard` (client: `client_packages`, `appointments`, `progress_reviews` for their own `client_id`) and a `/portal` (consultant: same tables scoped by `consultant_id`) can be added behind an auth provider (Clerk/NextAuth/Supabase Auth) without touching the marketing site's routes or components. |

## What's deliberately not built in this MVP round

- No real database — `content/*.ts` remains the data source.
- No auth, dashboards, or upload handling.
- No reward automation for referrals — the lead form only captures the code.
- No real resume parsing/scoring — `/tools/resume-scorer` is a placeholder
  page describing the intended flow.

This is scoped intentionally per Mind Loop's explicit "do not over-engineer"
instruction — the goal here is a schema that proves the current site's data
shapes already anticipate this, not a working backend.
