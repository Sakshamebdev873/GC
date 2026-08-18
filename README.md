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

No database, CMS, or auth in this MVP — see **Architecture** for why the
codebase is still structured to grow into those.

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
- **Branding:** no existing brand assets were provided; Mind Loop asked us to
  propose the visual direction (premium, professional, modern, trustworthy,
  clean-not-corporate). The navy `#16213E` / orange `#FF7A45` palette and
  Inter/serif pairing from the original build were kept as that proposal;
  open to their feedback.
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
