# GC Career Studio — Marketing Site MVP

A conversion-focused marketing site for GC Career Studio, a career consultancy
helping job seekers with resumes, LinkedIn, interview prep, and job search
strategy. Built as a take-home assignment for the Software Developer Intern
role — see [`docs/clarifying-questions.md`](docs/clarifying-questions.md) for
the questions asked before building, and the **Assumptions** section below for
what was decided in their absence.

## Tech stack

- **Next.js 16 (App Router) + TypeScript** — file-based routing, static
  generation for every marketing page (fast, SEO-friendly), API routes for the
  lead form without needing a separate backend service.
- **Tailwind CSS v4** — utility-first styling with design tokens (colors,
  spacing) centralized in `src/app/globals.css` rather than scattered
  hex codes.
- **Vercel** (recommended deploy target) — zero-config deploys from this repo,
  free tier is sufficient for an MVP.

No database, CMS, or auth in the public marketing site itself — see
**Architecture** for why the codebase is still structured to grow into
those. A demo SaaS data layer (Prisma + SQLite) and an optional admin
Basic Auth gate exist alongside it — see **Database / schema overview**
and **Security considerations** below.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` to enable
live Calendly booking and email delivery for the contact form — without it,
the site still fully works (see **Graceful fallbacks** below).

```bash
npm run build   # production build
npm run lint    # eslint
```

**Optional — future-schema demo:** the site itself needs no database, but a
working demo of the future SaaS data model lives alongside it (see
**Scalability notes** below). To try it:

```bash
npx prisma migrate dev   # creates prisma/dev.db from prisma/schema.prisma
npm run db:seed          # seeds packages, a consultant, a demo client, etc.
npm run dev
```

Then visit `/internal/demo` — a read-only page showing every table live.
Submitting the form at `/contact`, or a resume at `/tools/resume-scorer`,
writes a real row there. Resume scoring is a working demo flow (real
upload, real API route, real DB write) with **mock scoring** — it never
reads the file's contents, and says so on the page; see
`src/lib/resumeScorer.ts`. This is all additive and unlinked from primary
navigation; skip it entirely and the rest of the site is unaffected.

Visit `/internal/admin` to drive the referral flow: convert an open lead
to a client ("Mark converted") and see any inbound referral reward flip
from `pending` to `earned`, then mark it `redeemed`. See **How the
referral system works** below for the mechanics. Both `/internal/*` pages
are open by default; set `ADMIN_USER`/`ADMIN_PASSWORD` in `.env.local` to
gate them (see **Security considerations**).

## Architecture

```
src/
  app/                  routes (App Router) — one folder per page
    api/contact/        lead-form submission endpoint
  components/
    ui/                 generic primitives (Button, Container, SectionHeading)
    layout/             Header, Footer
    sections/           page sections composed from ui/ + content/
  content/               structured data: services, pricing, testimonials, FAQ, site config
  lib/                   framework-agnostic logic (form validation)
```

**Why this split:** `content/` holds everything an admin would eventually edit
without touching page code — services, pricing, testimonials, FAQ, and
site-wide settings (nav, contact info, Calendly URL) are all typed data
objects, not JSX. Today they're hand-edited `.ts` files; migrating to a
headless CMS or a database table later is a data-source swap, not a
page rewrite. `components/sections` are composed from `components/ui` and
`content/`, so every page (`app/*/page.tsx`) is mostly just picking which
sections to render in which order.

**Lead capture → future SaaS:** the form (`LeadForm.tsx`) sends directly to
Web3Forms from the browser if `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set —
Web3Forms' free tier requires the request to originate client-side. Otherwise
it falls back to `POST /api/contact`, which validates input
(`src/lib/validation.ts`) and logs the lead server-side. The `LeadFormInput`
shape is deliberately the same shape a future `leads` database table would
use, so swapping the fallback's console log for a DB write later doesn't
change the form or the API contract.

**No auth in the MVP, on purpose:** a marketing/lead-gen site doesn't need
user accounts. But every page already sits behind the App Router's route
groups and every data fetch is server-side, so adding authenticated routes
later (`/dashboard`, `/portal`) is additive — drop in an auth provider
(Clerk/NextAuth), gate new route groups, and the marketing site keeps working
unmodified. This is the concrete answer to the brief's "future SaaS"
consideration: the marketing site and the eventual product dashboard can live
in the same Next.js app, sharing the same `components/ui` and design tokens,
without the marketing site being rebuilt.

## Database / schema overview

The demo Prisma schema (`prisma/schema.prisma`, SQLite) implements the
future SaaS data model end to end — see
[`docs/architecture/future-schema.md`](docs/architecture/future-schema.md)
for the full ERD. Ten entities: `Lead`, `Client`, `Package`,
`PackageFeature`, `Consultant`, `ClientPackage`, `Appointment`,
`ProgressReview`, `Referral`, `ResumeAnalysis`. The public marketing site
still reads from `src/content/*.ts` — this schema is a parallel, additive
demo layer proving the migration path, not a replacement (see
**Architecture** above for why).

## Key user flows

1. **Visitor → lead:** `/` or any marketing page → `/contact` → `LeadForm`
   submits to Web3Forms (if configured) or falls back to
   `POST /api/contact`, which validates input, logs the lead, and writes a
   `Lead` row to the demo DB. An optional referral code is captured and,
   if it matches an existing `Referral.code`, linked immediately
   (attribution) — see **How the referral system works** below.
2. **Visitor → booking:** `/book-a-call` embeds Calendly
   (`NEXT_PUBLIC_CALENDLY_URL`) or shows a fallback contact card if unset.
3. **Visitor → resume score:** `/tools/resume-scorer` → upload → real API
   route (`/api/resume-scorer`) → deterministic mock score + suggestions
   (never reads file contents) → `ResumeAnalysis` row written → package
   recommendation shown with a CTA to book a call or browse packages.
   Explicitly labeled "Demo mode" throughout.
4. **Lead → client (admin):** `/internal/admin` lists leads not yet
   converted. An admin clicks "Mark converted", which creates a `Client`
   row, updates the `Lead.status`, earns any pending inbound referral
   reward, and issues the new client their own referral code.
5. **Referral loop:** Client A gets a code on conversion → shares it →
   Lead B submits it via `/contact` (attribution, no reward yet) → admin
   converts Lead B → Client A's referral reward flips `pending → earned` →
   admin marks it `redeemed` once fulfilled operationally.

## How the referral system works

Reward types (Free Session, Bonus Service/Upgrade, Extended Timeline) live
in one place — [`src/content/referralRewards.ts`](src/content/referralRewards.ts)
— the same content-layer pattern as `services.ts`/`testimonials.ts`.
`Referral.rewardType` in the database is a plain string validated against
that list at the application layer, not a hardcoded enum, so adding or
renaming a reward type is a one-object edit, never a migration.

The flow is deliberately conversion-gated, per Mind Loop's explicit
instruction that a reward must never be earned just because someone typed
a code into the lead form:

1. A client is issued a unique referral code the moment they convert
   (`src/lib/referralCode.ts`, called from
   `src/app/api/admin/convert-lead/route.ts`).
2. A new lead submitting that code via `/contact`
   (`src/app/api/contact/route.ts`) links it to the existing `Referral`
   row immediately — this is attribution only. `rewardStatus` stays
   `pending`.
3. Only when an admin marks *that* lead "converted" on
   `/internal/admin` does the referrer's reward flip to `earned`
   (`src/app/api/admin/convert-lead/route.ts`).
4. An admin marks a reward `redeemed` from the same page
   (`src/app/api/admin/redeem-referral/route.ts`) once it's been fulfilled
   operationally — this step is intentionally manual, not automated.

Admin-side visibility of the referral relationship and reward status
(`/internal/admin`) was prioritized over a full referral dashboard, per
Mind Loop's explicit "admin visibility over complexity" preference for
the MVP.

## API / integration decisions

- **`POST /api/contact`** — validates server-side (`src/lib/validation.ts`)
  regardless of whether Web3Forms or the fallback path is used, so
  validation logic isn't duplicated client vs. server.
- **Web3Forms over a custom email service** — free tier, no backend
  credentials to manage for this assessment, and the destination inbox is
  fully configurable by swapping `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` — no
  code change needed for GC to point leads at their own inbox later.
- **`POST /api/admin/convert-lead`, `POST /api/admin/redeem-referral`** —
  plain Route Handlers accepting form-encoded POSTs (not JSON), so the
  admin page's action buttons work as ordinary HTML forms with zero
  client-side JavaScript — consistent with this repo's preference for
  server-rendered pages over client state where possible.
- **Optional Basic Auth (`src/proxy.ts`)** — gates `/internal/*` and
  `/api/admin/*` only when `ADMIN_USER`/`ADMIN_PASSWORD` are set, following
  the same "off by default, zero-config still works" pattern as Calendly
  and Web3Forms elsewhere in this repo. Named `proxy.ts`, not
  `middleware.ts` — this Next.js version renamed the file convention (see
  `docs/round-2-response.md`).

## Security considerations

- No secrets are committed. `.env` is gitignored; only `.env.example`
  (with empty placeholder values) is tracked. Verified via
  `git log --all -- .env` returning no history.
- `/internal/demo` is read-only and safe to leave open even
  unauthenticated — it exposes demo data only.
- `/internal/admin` performs real mutations (lead conversion, referral
  redemption) and is gated by the optional Basic Auth proxy described
  above. It ships off by default for local/assessment use; set
  `ADMIN_USER`/`ADMIN_PASSWORD` before relying on it in any shared
  deployment.
- All API routes validate and sanitize input server-side
  (`src/lib/validation.ts`) rather than trusting client-side validation
  alone.
- SQLite is a local file, unsuitable for Vercel's ephemeral filesystem in
  production — see **Scalability notes** for the Postgres swap path.

## What's mocked vs. actually functional

| Feature | Status |
|---|---|
| Lead capture (`/contact`) | **Functional** — real validation, real email delivery (Web3Forms) or server log, real DB write. |
| Calendly booking | **Functional** — real embed once `NEXT_PUBLIC_CALENDLY_URL` is set. |
| Pricing/services content | **Functional but indicative** — real structured data, placeholder prices explicitly labeled "to be confirmed". |
| Testimonials | **Mocked, disclosed** — sample content only, labeled as such; swapping in real quotes is a one-file edit (`src/content/testimonials.ts`). |
| AI Resume Scorer | **Mocked, disclosed** — real upload/API/DB flow, but scoring is a deterministic function seeded from filename/size (`src/lib/resumeScorer.ts`), not a real AI call. File contents are never read or stored. Labeled "Demo mode" on the page. |
| Referral system | **Functional** — real code generation, attribution, and conversion-triggered reward earning. Reward *redemption* (actually fulfilling the free session/bonus/extension) is a manual operational step once marked "earned". |
| `/internal/admin` and `/internal/demo` | **Functional demo tooling** — not production admin UX; unauthenticated by default. |

## Known limitations

- SQLite doesn't survive Vercel's serverless filesystem — demo DB writes
  will silently no-op (caught, non-fatal) on the live deployment until
  `DATABASE_URL` points at a hosted Postgres instance (Neon/Supabase free
  tier — a one-line config change, no schema changes).
- A `Referral` row currently supports exactly one referred lead
  (`referredLeadId` is unique per referral). A client wanting to refer
  multiple people needs multiple codes issued manually today — a
  many-referrals-per-client model is a straightforward future schema
  change, not built here to avoid over-engineering the MVP.
- `/internal/admin`'s Basic Auth is a lightweight stand-in, not a real
  auth system — fine for this stage, not for a production admin surface.
- No automated tests in this repo — verification is `npm run lint` +
  `npm run build` + manual/browser checks, documented per change in
  `docs/next-steps.md`, `docs/round-2-response.md`, and
  `docs/superpowers/plans/2026-08-19-client-feedback-round2.md`.

## Graceful fallbacks (no environment config required)

- **Booking** (`/book-a-call`): embeds Calendly if `NEXT_PUBLIC_CALENDLY_URL`
  is set; otherwise shows a fallback card with a direct email contact.
- **Lead form** (`/contact`): sends via Web3Forms if
  `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is set; otherwise logs the lead to the
  server console and still confirms success to the user.

This means the site is fully demoable and gradeable with zero configuration,
while still being production-ready once real credentials are added.

## Assumptions (updated 2026-08-18 with Mind Loop's real answers)

The original assumptions below were superseded by Mind Loop's reply to
`docs/clarifying-questions.md` on 2026-08-17. See
[`docs/next-steps.md`](docs/next-steps.md) for the full plan reconciling the
site against their answers — this section reflects the confirmed facts, not
guesses.

- **Audience:** students, freshers, and early-career professionals, across
  every industry — not a single vertical, and not primarily experienced
  professionals for this MVP.
- **Geography:** India-first (INR pricing), with a global long-term vision.
- **Services:** four structured packages, not four independent services —
  Resume & LinkedIn (30 days), Career Acceleration (60 days), Career
  Transformation (75 days, recommended), Premium Placement Support (90 days).
  Each tier builds on the one before it (`src/content/services.ts`).
- **Primary conversion goal:** "Book a Free Discovery Call" via Calendly —
  confirmed, not assumed.
- **Booking tool:** Calendly — confirmed.
- **Branding:** Mind Loop's round-2 review explicitly ruled out orange.
  The palette is now navy `#1c2b3a` (primary) paired with blue `#2f6feb`
  (accent) — modern, premium, and minimal per their brief, while staying
  approachable rather than reading as a traditional corporate consultancy.
  Inter/serif pairing unchanged.
- **Pricing:** shown publicly, INR, one price per package — confirmed
  direction; exact numbers are still placeholders (`priceINR` in
  `src/content/services.ts`), clearly marked "indicative" in the UI.
- **Testimonials/stats:** Mind Loop has real client feedback but hasn't sent
  it yet, and explicitly asked us not to invent statistics or results. The
  homepage/about "by the numbers" stats were rewritten to structural facts
  (package count, program length, 1:1 model) instead of invented performance
  metrics, and the testimonials section is labeled as sample content
  pending real quotes (`src/content/testimonials.ts`).
- **Referral system, AI resume scorer, future SaaS data model:** new
  requirements from the reply, explicitly left to our product judgment.
  Tracked as open decisions in `docs/next-steps.md` rather than built
  silently — Mind Loop asked to be looped in on anything that materially
  affects architecture.
- **Round 2 (2026-08-19):** Mind Loop's second review confirmed the
  round-1 direction and gave explicit direction on referral reward types
  (configurable; Free Session / Bonus Service-Upgrade / Extended
  Timeline), conversion-gated reward triggering, the real Calendly link,
  and a "not orange" color preference. See
  [`docs/round-2-response.md`](docs/round-2-response.md) for the full
  reconciliation.

## Scalability notes (for the SaaS direction)

- **Data layer:** `content/*.ts` → straightforward migration path to Postgres
  (via Prisma) or a headless CMS once services/pricing need to be admin-editable
  without a deploy. This isn't just a claim — `prisma/schema.prisma` implements
  the full future data model (leads, clients, packages, consultants, client
  packages, appointments, progress reviews, referrals, resume analyses) on
  SQLite, seeded and wired to a real write path from `/contact`. See
  **Optional — future-schema demo** above to run it, and
  [`docs/architecture/future-schema.md`](docs/architecture/future-schema.md)
  for the ERD and exactly what's demo-only vs. production-ready.
- **Referral rewards:** reward types live in `src/content/referralRewards.ts`,
  the same content-layer pattern as `services.ts`/`testimonials.ts` — adding
  a fourth reward type (or renaming one) is a one-object edit, no
  restructuring, no migration.
- **Multi-tenant readiness:** because content is already data-driven rather
  than hardcoded into JSX, the same components could later render
  per-consultant or per-client pages by parameterizing the content source.
  This is also how the site meets the "works across industries" requirement
  today: no page hardcodes an industry, so the same `services`/`content`
  structure covers every vertical without a rebuild — only the copy in
  `src/content/*.ts` would need to change for an industry-specific variant.
- **API surface:** `/api/contact` establishes the pattern (validate → process
  → respond) that future endpoints (applications, consultant availability,
  client dashboards) would follow.
- **Design system:** `components/ui` is the seed of a component library that
  a future dashboard/portal would reuse, keeping visual consistency across
  the marketing site and the product.

## Time taken

Roughly 3-4 hours of active work, spread across two sessions (clarifying
questions sent up front; the build itself proceeded on the documented
assumptions after no reply arrived in time): scaffolding, all pages and
components, lead-form + API route, responsive/visual QA in a real browser,
deployment, and this documentation.
