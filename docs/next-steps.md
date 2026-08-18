# Next Steps — Incorporating Mind Loop's Answers

Context: after submitting the MVP, Mind Loop replied (2026-08-17) with real
answers to every clarifying question in [`clarifying-questions.md`](clarifying-questions.md),
plus new requirements (referral system, AI resume scorer, SaaS-readiness) and an
explicit ask to keep showing initiative and document reasoning on ambiguous
calls. This file tracks what needs to change and the decisions still open.

## What's being evaluated

Not just the diff — the email says so directly: "not just whether you can
build a website, but whether you can understand the business problem, make
good product decisions." Score three things:

1. Did the real answers get correctly reconciled into the site (not just
   patched over the old assumptions)?
2. Product judgment on the parts left to your discretion (referral system, AI
   resume scorer, SaaS data model) — documented reasoning, not just a feature.
3. Continued initiative — flagging things they didn't ask for.

## Tier 1 — Must do: reconcile content with real answers — ✅ done (2026-08-18)

Old assumption (in current MVP) → real fact from the email → required change.

- [x] **Services/packages** — replaced the 4 generic services with the 4 real
      packages and their exact inclusion lists:
      - Resume & LinkedIn — 30 Days
      - Career Acceleration — 60 Days
      - Career Transformation — 75 Days (**Recommended**)
      - Premium Placement Support — 90 Days
      `src/content/services.ts` rewritten with `name`, `duration`,
      `builtOnSlug`, and `additions` per tier so the UI can render
      "Everything in X, plus:" — communicates differences without repeating
      every prior tier's full list. `services/page.tsx` and `pricing/page.tsx`
      both consume this single source now (previously `pricing.ts` had a
      totally different, unrelated 3-tier plan list — that inconsistency is
      now fixed, not just re-skinned). New icons added for the 4 packages in
      `ServiceIcon.tsx`.
- [x] **Pricing currency/region** — pricing now renders in INR via
      `src/lib/format.ts` (`Intl.NumberFormat("en-IN", ...)`), shown on both
      `/services` and `/pricing`, each labeled "Indicative — to be confirmed"
      since real numbers weren't provided.
- [x] **Cross-industry framing** — Hero, About, and ServicesGrid copy
      rewritten to name the real audience (students/freshers/early-career)
      and drop industry-specific phrasing.
- [x] **CTA copy** — confirmed "Book a Free Discovery Call" / "Book a Free
      Call" CTAs already matched; no change needed.
- [x] **Testimonials** — went further than planned: found the existing
      testimonials *and* the Hero/About "by the numbers" stats (500+
      candidates, 85%, 4.9/5) were fabricated figures, which directly
      violates "do not invent statistics or client results." Fixed both:
      - Hero/About stats replaced with true structural facts (4 packages,
        30–90 day programs, 1:1 model) instead of invented performance
        numbers (`Hero.tsx`, `about/page.tsx`).
      - Testimonials section now shows an explicit "sample testimonials,
        not actual client results" disclosure (`testimonials.ts`,
        `Testimonials.tsx`) until Mind Loop sends real quotes.
- [x] **Branding tone check** — copy pass done alongside the above; no
      change to the navy/orange palette (that's still an open design
      proposal to Mind Loop, not a content bug).
- [x] **README** — Assumptions section rewritten to state confirmed facts
      (dated 2026-08-18) instead of guesses, linking here.

Verification: `npm run lint` and `npm run build` both pass; spot-checked
`/`, `/services`, `/pricing`, `/about`, `/testimonials` return 200 and render
the new package names/INR prices via a local dev server.

## Tier 2 — Decide, then document (or build) — ✅ done (2026-08-18)

Went with the recommended option on each — reasoning below and in the code.

- [x] **Referral system** — went with **minimal build** (option B): an
      optional "Referral code" field on the lead form (`LeadForm.tsx`),
      threaded through `LeadFormInput` (`src/lib/validation.ts`) and logged
      by `/api/contact` (`route.ts`). No reward logic — that's explicitly
      deferred to `docs/architecture/future-schema.md`'s `referrals` table
      (reward types: `free_session`, `cashback`, `extended_timeline`, per
      the email). Verified end-to-end with a local POST — the field reaches
      the server log correctly.
- [x] **AI Resume Scorer** — went with **document + placeholder page**
      (option A): `/tools/resume-scorer` explains the intended
      upload → score → suggestions → package-match flow, with a CTA to book
      a call instead (same value, real consultant) and a CTA to browse
      packages. Linked from the footer only (not primary nav) to avoid
      overwhelming the page per Mind Loop's "clearly without becoming
      overwhelming" instruction. No real scoring logic — a take-home isn't
      the place to ship a half-real AI feature.
- [x] **SaaS-readiness** — `docs/architecture/future-schema.md` written:
      a full entity list (`leads`, `clients`, `packages`, `package_features`,
      `consultants`, `client_packages`, `appointments`, `progress_reviews`,
      `referrals`, `resume_analyses`) with a Mermaid ERD and an explicit
      mapping table from today's `content/*.ts`/`validation.ts` shapes to
      the future tables. No auth, dashboards, or DB code added — scoped per
      their "do not over-engineer" instruction.
      **Update (2026-08-18):** built as a live demo on request — Prisma +
      SQLite implementing the full schema (`prisma/schema.prisma`), seeded
      with representative data (`prisma/seed.mjs`), `/contact` now writes
      real `Lead` rows (referral code included), and `/internal/demo`
      shows every table live. Public site untouched — see "Demo
      implementation" in that doc for exactly what's real vs. still
      scoped out (no auth, no reward automation).
      **Second update (same day):** `/tools/resume-scorer` upgraded from a
      static placeholder to a working demo flow — real file upload, a real
      API route, a real `ResumeAnalysis` row written per submission, and a
      package recommendation based on the (mock) score. Scoring is
      deterministic and disclosed as "Demo mode" on the page — no file
      contents are read or stored, no real AI call happens. See
      "Resume scorer is a working demo flow" in future-schema.md.

## Tier 3 — Optional polish (initiative signal) — ✅ done (2026-08-18)

- [x] Added a note to README's Scalability section tying the existing
      data-driven `content/*.ts` structure directly to the "works across
      industries" requirement — it was already true architecturally, just
      not stated as the answer to that specific ask.
- [x] Responsive pass re-verified with `gstack browse` at mobile
      (375×812), tablet (768×1024), and desktop (1280×720) on `/`,
      `/services`, `/pricing`, and `/testimonials` — the longer package
      inclusion lists and the 4-column pricing grid both hold up cleanly,
      no overflow, "Recommended" card reads clearly at all three sizes.

## Status: all three tiers complete

Everything in this plan is implemented, verified (`npm run lint` +
`npm run build` + responsive screenshots), and documented. Remaining items
are genuinely blocked on Mind Loop, not on more work here — see below.

## Open questions — resolved (2026-08-18)

1. ~~Referral system: build vs. document?~~ Resolved — built minimal field.
2. ~~AI Resume Scorer: placeholder vs. stub?~~ Resolved — placeholder page.
3. ~~Real testimonials, or do placeholders stay?~~ Resolved — placeholders
   stay, per the recommended approach: real client quotes weren't provided,
   and inventing them would violate Mind Loop's explicit "do not invent
   client results" instruction. `testimonials.ts` keeps `isSampleData = true`
   and the UI keeps the "sample testimonials, not actual client results"
   disclosure indefinitely, until real quotes are swapped in — a one-file
   edit at that point (see README → Architecture).
4. ~~Real pricing numbers, or INR placeholders?~~ Resolved — placeholders
   stay, same reasoning: no real numbers were given, so the `priceINR`
   values in `src/content/services.ts` remain clearly-marked indicative
   figures ("Indicative — to be confirmed") on both `/services` and
   `/pricing` rather than presented as final. Swapping in real prices later
   is a one-field edit per package.

All open items from this plan are now resolved. Nothing further is blocked
on Mind Loop for this round — see the Status note above.
