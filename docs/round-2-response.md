# Round 2 — Incorporating Mind Loop's Second Review (2026-08-19)

Context: after the round-1 reconciliation (see `docs/next-steps.md`), Mind
Loop reviewed and replied on 2026-08-19 with specific direction on nine
points. This file tracks what changed in response, following the same
transparency pattern as round 1.

## What changed

1. **Referral system** — built the real conversion-triggered reward flow.
   Reward types are now configurable (`src/content/referralRewards.ts`:
   Free Session, Bonus Service/Upgrade, Extended Timeline) instead of a
   hardcoded set. Submitting a referral code links the lead to the
   referrer immediately (visible in `/internal/admin`), but the reward
   only moves from `pending` to `earned` when an admin marks that lead
   "converted" — never on code submission alone, per Mind Loop's explicit
   instruction. Admin-side visibility (`/internal/admin`) was prioritized
   over a full dashboard, per their stated preference. See
   `docs/architecture/future-schema.md` for the mechanics and
   `src/proxy.ts` for the optional access gate.
2. **AI Resume Scorer** — no functional change; re-verified the "Demo
   mode" disclosure is still present and accurate.
3. **Pricing** — no change; re-verified "Indicative — to be confirmed"
   labeling is still in place on `/services` and `/pricing`.
4. **Testimonials** — no change; re-verified the sample-data disclosure is
   still in place.
5. **Design direction** — replaced the orange accent (`#b5502e`) with a
   blue (`#2f6feb`) per Mind Loop's explicit "not orange" preference,
   keeping the existing navy primary. See `src/app/globals.css`.
6. **Calendly & lead configuration** — wired in the real booking link
   (`https://calendly.com/gaurichitti71/30min`) via `NEXT_PUBLIC_CALENDLY_URL`.
   Lead destination inbox remains configurable via the
   `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` env var (swap the key to change which
   inbox receives leads) — no code change needed for GC to point this at
   their own account.
7. **MVP priority** — no new features added beyond the referral flow the
   email explicitly asked for; no scope creep into auth, dashboards, or a
   full referral UI.
8. **Final submission** — `README.md` rewritten to cover all the points
   requested: tech stack, architecture, DB/schema, key user flows,
   API/integration decisions, assumptions, security considerations, how
   the referral system works, what's mocked vs. functional, future SaaS
   scalability, known limitations, and local setup.

## Implementation note: middleware → proxy

This Next.js version (16.3.1) renamed the `middleware.ts` file convention
to `proxy.ts` (exported function `middleware` → `proxy`), confirmed against
the bundled docs at
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
per this repo's `AGENTS.md` instruction to check for breaking changes
before writing code. The admin/demo access gate is built as `src/proxy.ts`
accordingly, not `middleware.ts`.

## What's still deliberately not built

- Reward redemption automation (issuing the actual free session / bonus
  service / extended timeline) — still a manual operational step once
  `rewardStatus` is `earned`.
- Real auth on `/internal/*` — the optional Basic Auth gate
  (`src/proxy.ts`) is a lightweight stand-in appropriate for this stage,
  not a production admin auth system.
- Real AI resume scoring — still deterministic/mock, disclosed as such.
