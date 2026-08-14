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

**Lead capture → future SaaS:** `POST /api/contact` validates input
(`src/lib/validation.ts`), then either emails the lead via Web3Forms (if
`WEB3FORMS_ACCESS_KEY` is set — free, no account required) or logs it
server-side. The
`LeadFormInput` shape is deliberately the same shape a future `leads` database
table would use, so swapping the email call for a DB write later doesn't
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
- **Lead form** (`/contact`): sends via Web3Forms if `WEB3FORMS_ACCESS_KEY`
  is set; otherwise logs the lead to the server console and still confirms
  success to the user.

This means the site is fully demoable and gradeable with zero configuration,
while still being production-ready once real credentials are added.

## Assumptions

Made explicit because they weren't specified in the brief (also sent as
clarifying questions — see `docs/clarifying-questions.md`):

- **Audience:** job seekers across experience levels and industries, not a
  single vertical.
- **Services:** resume/cover letter review, LinkedIn optimization, interview
  coaching, career/job-search strategy — the four most common consultancy
  offerings.
- **Primary conversion goal:** booking a free discovery call (industry-standard
  consultancy funnel), with a secondary lead-capture form for visitors not
  ready to book.
- **Booking tool:** Calendly (or Cal.com), embedded — building a custom
  scheduler isn't justified for an MVP.
- **Branding:** no existing brand assets, so a default palette (navy `#16213E`
  primary, warm orange `#FF7A45` accent) and Inter typeface were chosen for a
  professional, modern, trustworthy feel. Should be revisited with real brand
  input.
- **Pricing:** shown publicly with three tiers (single session, package,
  ongoing coaching) — common in this space and helps qualify leads before a
  call; real numbers are placeholders.
- **Testimonials/stats:** placeholder content clearly structured so it's a
  one-file edit (`src/content/testimonials.ts`) to replace with real client
  results.

## Scalability notes (for the SaaS direction)

- **Data layer:** `content/*.ts` → straightforward migration path to Postgres
  (via Prisma) or a headless CMS once services/pricing need to be admin-editable
  without a deploy.
- **Multi-tenant readiness:** because content is already data-driven rather
  than hardcoded into JSX, the same components could later render
  per-consultant or per-client pages by parameterizing the content source.
- **API surface:** `/api/contact` establishes the pattern (validate → process
  → respond) that future endpoints (applications, consultant availability,
  client dashboards) would follow.
- **Design system:** `components/ui` is the seed of a component library that
  a future dashboard/portal would reuse, keeping visual consistency across
  the marketing site and the product.

## Time taken

Roughly 2 hours: requirement clarification + planning, scaffolding, all pages
and components, lead-form + API route, responsive/visual QA in a real browser,
and this documentation.
