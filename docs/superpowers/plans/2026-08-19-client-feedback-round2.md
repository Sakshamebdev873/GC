# Client Feedback Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the GC Career Studio MVP with Mind Loop's second review email (2026-08-19): build the real referral reward flow (configurable reward types, admin-visible, conversion-triggered), replace the orange accent with a blue one, wire in the real Calendly link, and rewrite the README into the full submission document they asked for.

**Architecture:** Everything lands inside the existing Next.js App Router + Prisma/SQLite demo layer already in the repo — no new frameworks. The referral flow becomes real (not just a captured field) via two new `/api/admin/*` route handlers plus a new `/internal/admin` page, gated by a lightweight Basic-Auth `middleware.ts` that's a no-op unless `ADMIN_USER`/`ADMIN_PASSWORD` are set (same "zero-config still works" pattern the repo already uses for Calendly/Web3Forms). Reward *types* move into a `src/content/referralRewards.ts` config file, mirroring the existing `services.ts`/`testimonials.ts` content-layer pattern, so adding a reward type later is a one-object edit, not a restructure.

**Tech Stack:** Next.js 16 (App Router, Route Handlers, `src/proxy.ts` — this version's renamed `middleware.ts` convention), TypeScript, Prisma + SQLite (existing `prisma/schema.prisma`), Tailwind v4 CSS variables (`globals.css`). No new dependencies.

**Spec:** Mind Loop's review email, 2026-08-19 (pasted into this session; not a separate file). Cross-referenced against current state in `docs/next-steps.md`, `docs/architecture/future-schema.md`, and `README.md`.

## Global Constraints

- No fabricated statistics, testimonials, or pricing — keep everything currently marked "sample"/"indicative" that way (client re-confirmed this).
- Referral reward types must be configurable, not hardcoded enum-in-code — single source of truth in `src/content/referralRewards.ts`.
- A referral reward is earned only on lead→client conversion, never on referral-code submission alone.
- No real credentials committed. `.env` stays gitignored; only `.env.example` (with empty values) is tracked.
- Accent color must not be orange — replace with a blue that pairs with the existing navy `--primary` (`#1c2b3a`).
- Don't build a full referral dashboard or real auth system — admin *visibility* of the referral relationship/reward status is the bar, not a polished portal (client's explicit priority call).
- This repo has no test runner (`npm run lint` + `npm run build` + manual/browser verification is the established verification pattern from `docs/next-steps.md` — follow it, don't introduce Jest/Vitest for this).

---

## File Structure

New files:
- `src/content/referralRewards.ts` — reward-type registry (single source of truth).
- `src/lib/referralCode.ts` — referral code generator.
- `src/app/api/admin/convert-lead/route.ts` — POST: lead → client conversion, triggers reward earning.
- `src/app/api/admin/redeem-referral/route.ts` — POST: earned → redeemed.
- `src/app/internal/admin/page.tsx` — admin visibility page (open leads + referral table with action buttons).
- `src/proxy.ts` (renamed from the planned `middleware.ts` — see Task 5's deviation note) — Basic Auth gate for `/internal/*` and `/api/admin/*`.
- `docs/round-2-response.md` — mirrors the existing `docs/next-steps.md` pattern for this second round of feedback.

Modified files:
- `src/app/globals.css` — accent tokens orange → blue.
- `src/app/global-error.tsx` — two hardcoded accent hex values.
- `src/app/api/contact/route.ts` — link submitted referral code to an existing `Referral` row (attribution only, no reward yet).
- `prisma/schema.prisma` — comment update on `Referral.rewardType` (no migration: still a `String`).
- `prisma/seed.mjs` — comment pointing at the new config file as source of truth.
- `docs/architecture/future-schema.md` — reward-type naming, referral flow section rewritten to describe the real (not sketched) mechanics.
- `.env.example` — add `ADMIN_USER` / `ADMIN_PASSWORD`, update Calendly comment.
- `README.md` — full rewrite/extension covering the 12 submission-doc points from the email.

Not touched: `src/content/services.ts`, `src/content/testimonials.ts`, pricing/testimonial copy (already correct per verification in Task 7), `src/lib/resumeScorer.ts` (already correctly disclosed).

---

### Task 1: Replace the orange accent with blue — ✅ done (local, uncommitted)

**Files:**
- Modify: `src/app/globals.css:13-14`
- Modify: `src/app/global-error.tsx:34,52`

**Interfaces:** None — pure token/value change, no new exports.

- [x] **Step 1: Update the CSS variables**

In `src/app/globals.css`, change:

```css
  --accent: #b5502e;
  --accent-dark: #963f22;
```

to:

```css
  --accent: #2f6feb;
  --accent-dark: #1e52b8;
```

- [x] **Step 2: Update the two hardcoded hex values in the root error boundary**

`global-error.tsx` can't rely on `globals.css` loading (it's the outermost error boundary), so it hardcodes color literals directly. Update both occurrences of `#b5502e` to `#2f6feb`:

```tsx
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2f6feb" }}>
          Error
        </p>
```

and

```tsx
          style={{
            marginTop: "0.5rem",
            borderRadius: "9999px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#fff",
            background: "#2f6feb",
            border: "none",
            cursor: "pointer",
          }}
```

- [x] **Step 3: Verify no other orange references remain**

Run: `grep -rn "b5502e\|963f22\|FF7A45" src/`
Result: no matches — confirmed.

- [ ] **Step 4: Visual check** — deferred to Task 13's full manual browser pass (running `npm run dev` per-task is redundant with the final pass; noted here so it isn't skipped).

- [ ] **Step 5: Commit** — held per instruction: all changes stay local/uncommitted until explicitly asked to commit.

---

### Task 2: Referral reward-type registry (config layer) — ✅ done (local, uncommitted)

**Files:**
- Create: `src/content/referralRewards.ts`

**Interfaces:**
- Produces: `ReferralRewardType` type (`id: string`, `label: string`, `description: string`); `referralRewardTypes: ReferralRewardType[]`; `DEFAULT_REFERRAL_REWARD_TYPE_ID: string`; `isValidReferralRewardTypeId(id: string): boolean`; `rewardTypeLabel(id: string): string`. Task 6's admin page and Task 5's route handler both consume `referralRewardTypes`, `DEFAULT_REFERRAL_REWARD_TYPE_ID`, and `rewardTypeLabel`.

- [x] **Step 1: Write the content file**

```ts
// src/content/referralRewards.ts
//
// Single source of truth for referral reward types. Mind Loop asked that
// reward types be configurable rather than hardcoded — adding or renaming a
// type is a one-object edit here, not a schema migration: `Referral.rewardType`
// in prisma/schema.prisma is a plain String, validated against this list at
// the application layer instead of a DB enum.

export type ReferralRewardType = {
  id: string;
  label: string;
  description: string;
};

export const referralRewardTypes: ReferralRewardType[] = [
  {
    id: "free_session",
    label: "Free Session",
    description:
      "One complimentary 1:1 coaching session added to the referrer's active package.",
  },
  {
    id: "bonus_service",
    label: "Bonus Service / Upgrade",
    description:
      "A bonus add-on service, or a one-tier upgrade on the referrer's current package.",
  },
  {
    id: "extended_timeline",
    label: "Extended Timeline",
    description:
      "The referrer's active package duration is extended by an agreed number of days.",
  },
];

export const DEFAULT_REFERRAL_REWARD_TYPE_ID = referralRewardTypes[0].id;

export function isValidReferralRewardTypeId(id: string): boolean {
  return referralRewardTypes.some((r) => r.id === id);
}

export function rewardTypeLabel(id: string): string {
  return referralRewardTypes.find((r) => r.id === id)?.label ?? id;
}
```

- [x] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Result: no output, clean pass.

- [ ] **Step 3: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 3: Referral code generator — ✅ done (local, uncommitted)

**Files:**
- Create: `src/lib/referralCode.ts`

**Interfaces:**
- Produces: `generateReferralCode(clientName: string): string`. Consumed by Task 5's convert-lead route.

- [x] **Step 1: Write the generator**

```ts
// src/lib/referralCode.ts
//
// Generates a shareable referral code for a newly converted client. Not
// cryptographically sensitive — collisions are handled by the caller
// retrying against Referral.code's unique constraint (see
// src/app/api/admin/convert-lead/route.ts).

function namePrefix(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const letters = firstWord.toUpperCase().replace(/[^A-Z]/g, "");
  return letters.slice(0, 8) || "GC";
}

export function generateReferralCode(clientName: string): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${namePrefix(clientName)}${suffix}`;
}
```

- [x] **Step 2: Sanity-check output shape**

Result: `ANANYAK7QV` and `GC6XRC` (empty-name fallback branch confirmed working). `npx tsc --noEmit` clean.

- [ ] **Step 3: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 4: Link a submitted referral code to its Referral row (attribution, not reward) — ✅ done (local, uncommitted)

**Files:**
- Modify: `src/app/api/contact/route.ts`

**Interfaces:**
- Consumes: existing `prisma.referral` model (`code` unique, `referredLeadId` unique nullable).
- Produces: no new exports — behavior only.

- [x] **Step 1: Update the route to link the code after creating the Lead**

In `src/app/api/contact/route.ts`, replace the existing lead-creation try/catch block:

```ts
  try {
    await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email,
        message: input.message,
        referralCode: input.referralCode,
      },
    });
  } catch (err) {
    console.error("[lead-form] Demo DB write failed (non-fatal):", err);
  }
```

with:

```ts
  // Also persist to the future-schema demo DB (see
  // docs/architecture/future-schema.md and /internal/demo). Best-effort:
  // the DB is a demo addition, not a hard dependency of the contact form,
  // so a write failure here must never block a real lead's confirmation.
  try {
    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        email: input.email,
        message: input.message,
        referralCode: input.referralCode,
      },
    });

    // Attribution only — this links the lead to whoever referred them so
    // the relationship is visible to admins immediately. It must NOT set
    // the referral's rewardStatus: Mind Loop was explicit that a reward is
    // earned only when this lead later converts to a client, not merely by
    // submitting a code. See src/app/api/admin/convert-lead/route.ts.
    if (input.referralCode) {
      const referral = await prisma.referral.findUnique({
        where: { code: input.referralCode },
      });
      if (referral && !referral.referredLeadId) {
        await prisma.referral.update({
          where: { id: referral.id },
          data: { referredLeadId: lead.id },
        });
      }
    }
  } catch (err) {
    console.error("[lead-form] Demo DB write failed (non-fatal):", err);
  }
```

- [x] **Step 2: Verify it type-checks and builds**

Run: `npx tsc --noEmit && npm run build` — both clean, all 15 routes compiled.

- [x] **Step 3: Manual verification against the seeded referral code**

Ran `npx prisma migrate dev` (already in sync), `npm run db:seed`, `npm run dev`, then:

```bash
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Referred Lead","email":"referred@example.com","message":"testing referral link","referralCode":"ANANYA10"}'
```

Result: `{"ok":true}`. Queried the DB directly afterward — the `ANANYA10` referral row now has `referredLeadId` set to the new lead's id and `referredLead.name === "Test Referred Lead"`, while `rewardStatus` is still `"pending"`. Confirms attribution without premature reward, exactly as designed. Dev server stopped after verification.

- [ ] **Step 4: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 5: Basic Auth gate for internal/admin routes — ✅ done (local, uncommitted)

> **Deviation from the plan as written:** this Next.js version (16.3.1) has
> renamed the `middleware.ts` file convention to `proxy.ts` (function
> `middleware` → `proxy`) — confirmed against
> `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
> per this repo's AGENTS.md instruction to check bundled docs for breaking
> changes. Also, with a `src/` directory layout, the file must live at
> `src/proxy.ts`, not the repo root. Built as `src/proxy.ts` instead of the
> originally planned `middleware.ts`.

**Files:**
- Create: `src/proxy.ts` (not `middleware.ts` at repo root — see deviation note above)
- Modify: `.env.example`

**Interfaces:** None — Next.js auto-discovers `src/proxy.ts` by convention; no imports needed elsewhere.

- [x] **Step 1: Write the proxy file** (built as `src/proxy.ts`, exporting `proxy` — see deviation note above)

```ts
// src/proxy.ts
//
// Lightweight HTTP Basic Auth gate for the internal demo/admin pages. Off
// by default (matches this repo's existing zero-config-required pattern
// for Calendly/Web3Forms) — set both ADMIN_USER and ADMIN_PASSWORD to
// actually lock these routes down. /internal/admin now performs real
// mutations (lead conversion, reward redemption), which is why this exists
// even though /internal/demo alone was fine unauthenticated as a read-only
// view.
//
// Named "proxy" (not "middleware") per this Next.js version's renamed file
// convention — see node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md.
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/internal/:path*", "/api/admin/:path*"],
};

export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  if (authHeader === expected) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Internal"' },
  });
}
```

- [x] **Step 2: Add the env vars to `.env.example`**

Append to `.env.example`:

```
# Optional HTTP Basic Auth gate for /internal/* (demo + admin pages) and
# /api/admin/* (lead conversion, referral redemption). Leave both unset to
# keep these pages open, matching this repo's zero-config fallback pattern —
# set both to lock them down for a real deployment.
ADMIN_USER=
ADMIN_PASSWORD=
```

- [x] **Step 3: Verify the no-op default**

Confirmed via curl: `/internal/demo` and `/api/admin/convert-lead` both return 200/reach-the-route with no `ADMIN_USER`/`ADMIN_PASSWORD` set.

- [x] **Step 4: Verify the gate when enabled**

Temporarily wrote `ADMIN_USER=test` / `ADMIN_PASSWORD=test123` to `.env.local`, restarted the dev server, and confirmed via curl: no-auth → 401, wrong creds (`-u wrong:creds`) → 401, correct creds (`-u test:test123`) → 200 on `/internal/demo`; `/api/admin/convert-lead` → 401 unauthenticated (no route handler exists yet, but the gate runs first, as expected). Removed `.env.local` afterward (it didn't exist before this test) and confirmed the default open state returned. Dev server stopped after verification.

Note: hit two environment quirks along the way, both resolved — (1) this Next.js version's persistent dev-server daemon keeps a prior `next dev` alive across terminal sessions/port conflicts, requiring an explicit `taskkill` on the actual listening PID (found via `Get-NetTCPConnection -LocalPort 3000`) to pick up file/env changes; (2) the `middleware` → `proxy` rename documented above. Neither affects the shipped code, just how I had to drive local verification.

- [ ] **Step 5: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 6: Admin actions — convert lead, redeem referral — ✅ done (local, uncommitted)

**Files:**
- Create: `src/app/api/admin/convert-lead/route.ts`
- Create: `src/app/api/admin/redeem-referral/route.ts`

**Interfaces:**
- Consumes: `generateReferralCode` from Task 3, `DEFAULT_REFERRAL_REWARD_TYPE_ID` from Task 2.
- Produces: `POST /api/admin/convert-lead` (form field `leadId`), `POST /api/admin/redeem-referral` (form field `referralId`) — both redirect to `/internal/admin` on success. Consumed by Task 7's admin page forms.

- [x] **Step 1: Write the convert-lead route**

```ts
// src/app/api/admin/convert-lead/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/referralCode";
import { DEFAULT_REFERRAL_REWARD_TYPE_ID } from "@/content/referralRewards";

export async function POST(request: Request) {
  const formData = await request.formData();
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId) {
    return NextResponse.json({ error: "Missing leadId." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const existingClient = await prisma.client.findUnique({ where: { leadId: lead.id } });
  const client =
    existingClient ??
    (await prisma.client.create({
      data: { leadId: lead.id, name: lead.name, email: lead.email },
    }));

  await prisma.lead.update({ where: { id: lead.id }, data: { status: "converted" } });

  // The reward is earned now, on conversion — not when the code was
  // submitted. See the attribution step in src/app/api/contact/route.ts.
  const inboundReferral = await prisma.referral.findUnique({
    where: { referredLeadId: lead.id },
  });
  if (inboundReferral && inboundReferral.rewardStatus === "pending") {
    await prisma.referral.update({
      where: { id: inboundReferral.id },
      data: { rewardStatus: "earned" },
    });
  }

  // Every converted client gets their own shareable code, so the referral
  // loop can continue.
  const ownReferral = await prisma.referral.findFirst({
    where: { referrerClientId: client.id },
  });
  if (!ownReferral) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await prisma.referral.create({
          data: {
            referrerClientId: client.id,
            code: generateReferralCode(client.name),
            rewardType: DEFAULT_REFERRAL_REWARD_TYPE_ID,
            rewardStatus: "pending",
          },
        });
        break;
      } catch (err) {
        if (attempt === 4) throw err;
      }
    }
  }

  return NextResponse.redirect(new URL("/internal/admin", request.url), 303);
}
```

- [x] **Step 2: Write the redeem-referral route**

```ts
// src/app/api/admin/redeem-referral/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const referralId = formData.get("referralId");
  if (typeof referralId !== "string" || !referralId) {
    return NextResponse.json({ error: "Missing referralId." }, { status: 400 });
  }

  const referral = await prisma.referral.findUnique({ where: { id: referralId } });
  if (!referral || referral.rewardStatus !== "earned") {
    return NextResponse.json(
      { error: "Referral must be in 'earned' state to redeem." },
      { status: 400 }
    );
  }

  await prisma.referral.update({
    where: { id: referralId },
    data: { rewardStatus: "redeemed" },
  });

  return NextResponse.redirect(new URL("/internal/admin", request.url), 303);
}
```

- [x] **Step 3: Verify type-check and build**

`npx tsc --noEmit` clean; `npm run build` succeeded — both new routes (`/api/admin/convert-lead`, `/api/admin/redeem-referral`) show as dynamic (`ƒ`) in the route list, and the build output confirms `ƒ Proxy (Middleware)` is registered from Task 5. Full functional exercise of these two routes (actually clicking through convert → earn → redeem) is deferred to Task 7 Step 3, once the admin page that calls them exists.

- [ ] **Step 4: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 7: Admin visibility page — ✅ done (local, uncommitted)

**Files:**
- Create: `src/app/internal/admin/page.tsx`

**Interfaces:**
- Consumes: `referralRewardTypes`/`rewardTypeLabel` (Task 2), `POST /api/admin/convert-lead` and `POST /api/admin/redeem-referral` (Task 6).

- [x] **Step 1: Write the page** (one adjustment: the in-page reference to the gate file reads `src/proxy.ts`, not `middleware.ts` — see Task 5's deviation note)

```tsx
// src/app/internal/admin/page.tsx
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";
import { rewardTypeLabel } from "@/content/referralRewards";

export const metadata: Metadata = {
  title: "Referral Admin (Internal)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InternalAdminPage() {
  const [openLeads, referrals] = await Promise.all([
    prisma.lead.findMany({
      where: { status: { not: "converted" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.referral.findMany({
      include: { referrerClient: true, referredLead: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <Container className="max-w-4xl py-16">
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm text-primary">
        <strong>Internal admin — referral visibility.</strong> Gated by{" "}
        <code className="rounded bg-white px-1.5 py-0.5">src/proxy.ts</code> when
        <code className="rounded bg-white px-1.5 py-0.5">ADMIN_USER</code>/
        <code className="rounded bg-white px-1.5 py-0.5">ADMIN_PASSWORD</code> are set.
        Converting a lead here is what earns a referral reward — submitting a
        referral code alone never does.
      </div>

      <h1 className="mt-8 font-serif text-3xl font-medium text-primary">
        Leads awaiting conversion
      </h1>
      <div className="mt-4 space-y-3">
        {openLeads.length === 0 && (
          <p className="text-sm text-muted">No open leads.</p>
        )}
        {openLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
          >
            <div>
              <p className="font-medium text-foreground">
                {lead.name} — {lead.email}
              </p>
              <p className="text-sm text-muted">
                Status: {lead.status}
                {lead.referralCode && ` · Referral code: ${lead.referralCode}`}
              </p>
            </div>
            <form action="/api/admin/convert-lead" method="POST">
              <input type="hidden" name="leadId" value={lead.id} />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Mark converted
              </button>
            </form>
          </div>
        ))}
      </div>

      <h1 className="mt-12 font-serif text-3xl font-medium text-primary">Referrals</h1>
      <div className="mt-4 space-y-3">
        {referrals.length === 0 && (
          <p className="text-sm text-muted">No referral codes issued yet.</p>
        )}
        {referrals.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
          >
            <div>
              <p className="font-medium text-foreground">
                {r.referrerClient.name} · code {r.code}
              </p>
              <p className="text-sm text-muted">
                Referred: {r.referredLead?.name ?? "unused"} · Reward:{" "}
                {rewardTypeLabel(r.rewardType)} · Status: {r.rewardStatus}
              </p>
            </div>
            {r.rewardStatus === "earned" && (
              <form action="/api/admin/redeem-referral" method="POST">
                <input type="hidden" name="referralId" value={r.id} />
                <button
                  type="submit"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
                >
                  Mark redeemed
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
```

- [x] **Step 2: Verify build**

`npx tsc --noEmit` clean; `npm run build` succeeded — `/internal/admin` now appears as a dynamic route alongside `/internal/demo`.

- [x] **Step 3: End-to-end manual verification of the full referral loop**

Did a full DB reset (`rm prisma/dev.db && npx prisma migrate dev && npm run db:seed`) rather than reusing Task 4's leftover state, then drove the real routes via curl against a running `npm run dev` (equivalent to clicking the actual form buttons — same POST endpoints, same redirect):

1. `POST /api/contact` with `referralCode: "ANANYA10"` for a new "Loop Test Lead" — confirmed `/internal/admin` showed it under "Leads awaiting conversion" and the `ANANYA10` referral row showed `Status: pending`.
2. `POST /api/admin/convert-lead` with that lead's id → 303 redirect to `/internal/admin`.
3. Confirmed: "Leads awaiting conversion" now shows "No open leads"; the `ANANYA10` row shows `Referred: Loop Test Lead · Reward: Free Session · Status: earned`.
4. Confirmed via direct DB query: the newly converted client ("Loop Test Lead") was auto-issued their own referral code (`LOOPF8JL`, `status: pending`) — the referral loop continues.
5. `POST /api/admin/redeem-referral` with the `ANANYA10` referral's id → 303 redirect; confirmed via DB query `rewardStatus` is now `"redeemed"`.
6. Visited `/internal/demo` (200) — confirmed "Loop Test Lead" appears in the Leads/Clients/Referrals tables, consistent with `/internal/admin`.

Full loop confirmed: `pending → earned → redeemed`, gated correctly at each step (submission alone never earns; only admin-side conversion does). Dev server stopped after verification.

- [ ] **Step 4: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 8: Wire in the real Calendly link — ✅ done (local, uncommitted)

**Files:**
- Create: `.env.local` (local, untracked)

**Interfaces:** None — pure config value.

- [x] **Step 1: Set the real booking link**

Created `.env.local` (didn't exist before) with `NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/gaurichitti71/30min`. `.env.local` takes precedence over `.env` per Next.js env-file loading order, so the developer's stale personal `.env` value (`calendly.com/vinodarya344`) is overridden without needing to touch `.env` itself.

- [x] **Step 2: Verify**

Ran `npm run dev`, curled `/book-a-call`, grepped for `calendly.com/` links. Result: `calendly.com/gaurichitti71/30min` — confirmed, old placeholder no longer present. Dev server stopped after verification.

- [ ] **Step 3: No commit** — `.env.local`/`.env` are gitignored by design; nothing to stage.

---

### Task 9: Update schema/doc comments for the new reward-type naming and real referral mechanics — ✅ done (local, uncommitted)

**Files:**
- Modify: `prisma/schema.prisma:118-128` (comment only)
- Modify: `prisma/seed.mjs` (comment only, near the referral-seeding block)
- Modify: `docs/architecture/future-schema.md`

**Interfaces:** None — documentation/comments only, no schema migration (the field is already a plain `String`).

- [x] **Step 1: Update the Prisma schema comment**

In `prisma/schema.prisma`, change:

```prisma
  rewardType       String // free_session | cashback | extended_timeline
```

to:

```prisma
  // Validated against src/content/referralRewards.ts at the application
  // layer, not a DB enum — new reward types don't need a migration.
  rewardType       String // free_session | bonus_service | extended_timeline
```

- [x] **Step 2: Update the seed script comment**

In `prisma/seed.mjs`, above the `console.log("Seeding a referral...")` line, add:

```js
  // Reward type ids must match src/content/referralRewards.ts (the source
  // of truth for what's configurable) — "free_session" here, not "cashback".
```

- [x] **Step 3: Rewrite the referral section of `docs/architecture/future-schema.md`** (bullet text refers to `src/proxy.ts`, not `middleware.ts` — see Task 5's deviation note)

Replace the `REFERRALS` block's `reward_type` comment (line ~159) from:

```
        string reward_type "free_session, cashback, extended_timeline"
```

to:

```
        string reward_type "free_session, bonus_service, extended_timeline — see src/content/referralRewards.ts"
```

Then replace the referral row in the "Mapping from today's MVP" table (the `LeadForm.tsx referral code field` row) with the real, implemented mechanics instead of the old "not built in the MVP" language:

```markdown
| `LeadForm.tsx` referral code field | **Implemented** (2026-08-19): `/api/contact` links a submitted code to its `Referral` row immediately (`referredLeadId`), but reward `rewardStatus` stays `pending` until `/internal/admin`'s "Mark converted" action fires — this is the conversion-gated trigger Mind Loop asked for. Reward types are configurable via `src/content/referralRewards.ts`, not hardcoded. Each newly converted client is auto-issued their own shareable code (`src/lib/referralCode.ts`) so the loop continues. |
```

Also update the "What's still deliberately not built" list — remove the "No reward automation for referrals" bullet (it's now automated on conversion) and replace with:

```markdown
- Reward *redemption* (earned → redeemed) is a manual admin click in
  `/internal/admin`, not automated — issuing an actual free session,
  service credit, or timeline extension still requires a human to act on
  it operationally. Earning the reward (pending → earned) is automated on
  conversion.
- `/internal/admin`'s mutations are gated by an optional Basic Auth
  middleware (`src/proxy.ts`), off by default. Turn it on via
  `ADMIN_USER`/`ADMIN_PASSWORD` before using this beyond a local demo.
```

- [x] **Step 4: Verify**

`npx prisma validate` → schema valid. `npm run db:seed` re-run → succeeds cleanly (idempotent, no errors from the comment changes). Grepped the edited doc sections back to confirm all three edits landed as written.

- [ ] **Step 5: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 10: Verify pricing/testimonials/resume-scorer disclosures are still correct — ✅ done (verification only)

No code changes expected — this is a verification pass confirming the items the client re-confirmed are actually holding, before writing them into the new README.

- [x] **Step 1: Confirm pricing labeling**

`src/app/pricing/page.tsx:85` → "Indicative — to be confirmed"; `src/app/services/page.tsx:74` → "Indicative pricing — to be confirmed. See docs/next-steps.md." Both present, matches the email's instruction in substance.

- [x] **Step 2: Confirm testimonials disclosure**

`src/content/testimonials.ts:15` → `export const isSampleData = true;`, with a comment at line 11 confirming the UI labels these as samples.

- [x] **Step 3: Confirm resume-scorer demo disclosure**

`src/app/tools/resume-scorer/page.tsx` — "Demo" in the page title, a visible "Demo mode:" banner (lines 39-40) stating it's a mock analyzer that doesn't read the file, and a note that a production version would swap in real scoring.

- [x] **Step 4: No commit** — verification only. All three checks pass; nothing regressed from round 1.

---

### Task 11: Round-2 response doc (mirrors the `docs/next-steps.md` pattern) — ✅ done (local, uncommitted)

**Files:**
- Create: `docs/round-2-response.md`

**Interfaces:** None — documentation only.

- [x] **Step 1: Write the doc** — written to `docs/round-2-response.md`, with one addition beyond this draft: a short "Implementation note: middleware → proxy" section documenting the file-convention rename discovered in Task 5.

```markdown
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
   mode" disclosure is still present and accurate (see
   `docs/superpowers/plans/2026-08-19-client-feedback-round2.md` Task 10).
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

## What's still deliberately not built

- Reward redemption automation (issuing the actual free session / bonus
  service / extended timeline) — still a manual operational step once
  `rewardStatus` is `earned`.
- Real auth on `/internal/*` — the optional Basic Auth gate
  (`src/proxy.ts`) is a lightweight stand-in appropriate for this stage,
  not a production admin auth system.
- Real AI resume scoring — still deterministic/mock, disclosed as such.
```

- [ ] **Step 2: Link it from the README** (to be done as part of Task 12).

- [ ] **Step 3: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 12: README rewrite — full submission document — ✅ done (local, uncommitted)

**Files:**
- Modify: `README.md`

**Interfaces:** None — documentation only.

- [x] **Step 1: Add/update these sections in `README.md`, in order.** All six new sections inserted after "Architecture" and before "Graceful fallbacks", as planned. One addition beyond this draft: also added a **"How the referral system works"** section (between Key user flows and API/integration decisions) — the client's submission checklist explicitly asked for "how the referral system works" as its own point, so it earned its own heading rather than living only inside Key user flows. Also lightly updated the Tech Stack intro line and the Getting Started demo walkthrough to mention `/internal/admin` and the optional gate, since those didn't exist when that prose was written. `src/proxy.ts` used throughout, not `middleware.ts` (Task 5 deviation).

**New section — Database/schema overview** (insert after Architecture):

```markdown
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
```

**New section — Key user flows** (insert after Database/schema overview):

```markdown
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
```

**New section — API / integration decisions** (insert after Key user flows):

```markdown
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
  and Web3Forms elsewhere in this repo.
```

**New section — Security considerations** (insert after API / integration decisions):

```markdown
## Security considerations

- No secrets are committed. `.env` is gitignored; only `.env.example`
  (with empty values) is tracked. Verified via `git log --all -- .env`
  returning no history.
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
```

**New section — What's mocked vs. actually functional** (insert after Security considerations):

```markdown
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
```

**New section — Known limitations** (insert after What's mocked vs. actually functional):

```markdown
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
  `docs/next-steps.md`, `docs/round-2-response.md`, and this plan.
```

- [x] **Step 2: Update the existing Assumptions section**

Add a new bullet at the end of the Assumptions list (before "Referral system, AI resume scorer..." bullet, or after it):

```markdown
- **Round 2 (2026-08-19):** Mind Loop's second review confirmed the
  round-1 direction and gave explicit direction on referral reward types
  (configurable; Free Session / Bonus Service-Upgrade / Extended
  Timeline), conversion-gated reward triggering, the real Calendly link,
  and a "not orange" color preference. See
  [`docs/round-2-response.md`](docs/round-2-response.md) for the full
  reconciliation.
```

Also update the "Branding" bullet — replace:

```markdown
- **Branding:** no existing brand assets were provided; Mind Loop asked us to
  propose the visual direction (premium, professional, modern, trustworthy,
  clean-not-corporate). The navy `#16213E` / orange `#FF7A45` palette and
  Inter/serif pairing from the original build were kept as that proposal;
  open to their feedback.
```

with:

```markdown
- **Branding:** Mind Loop's round-2 review explicitly ruled out orange.
  The palette is now navy `#1c2b3a` (primary) paired with blue `#2f6feb`
  (accent) — modern, premium, and minimal per their brief, while staying
  approachable rather than reading as a traditional corporate consultancy.
  Inter/serif pairing unchanged.
```

- [x] **Step 3: Update Scalability notes**

Add a bullet after the existing "Data layer" bullet:

```markdown
- **Referral rewards:** reward types live in `src/content/referralRewards.ts`,
  the same content-layer pattern as `services.ts`/`testimonials.ts` — adding
  a fourth reward type (or renaming one) is a one-object edit, no
  restructuring, no migration.
```

- [x] **Step 4: Verify the README renders correctly**

Read the full 340-line file back. Section ordering is coherent, all seven new/changed sections landed, all code fences balanced, all cross-references (`docs/round-2-response.md`, `docs/architecture/future-schema.md`, `src/content/referralRewards.ts`, etc.) point at files that actually exist.

- [ ] **Step 5: Commit** — held per instruction: staying local/uncommitted for now.

---

### Task 13: Final verification pass — ✅ done (verification only)

- [x] **Step 1: Lint and build**

`npm run lint` → clean (no output). `npm run build` → succeeded, all 17 routes compiled, `ƒ Proxy (Middleware)` registered.

- [x] **Step 2: Fresh-clone-style DB reset check**

`rm prisma/dev.db && npx prisma migrate dev && npm run db:seed` → migration applied, seed completed without errors. Confirms Task 9's comment-only Prisma changes didn't break the schema.

- [x] **Step 3: Full manual browser pass**

Ran the dev server and curl-verified every item on this list:
- `/` — no `b5502e`/`963f22` (old orange hex) anywhere in the rendered HTML.
- `/pricing`, `/services` — "Indicative — to be confirmed" / "Indicative pricing" both present.
- `/testimonials` — "Sample" disclosure present.
- `/tools/resume-scorer` — "Demo mode" present.
- `/book-a-call` — real link `calendly.com/gaurichitti71/30min` present.
- `/contact` → `POST /api/contact` with a fresh lead ("Final Check Lead") and `referralCode: "ANANYA10"` → `{"ok":true}`.
- `/internal/admin` — full loop re-verified on this fresh DB: lead appeared under "Leads awaiting conversion" → `POST /api/admin/convert-lead` → 303 → "No open leads" + referral row shows `Status: earned`.
- `/internal/demo` — 200, shows "Final Check Lead" in its tables, consistent with `/internal/admin`.

All confirmed. Dev server stopped after verification.

- [x] **Step 4: Repo secret scan**

`git status` — only the intended files modified/untracked (`.env.example`, `README.md`, `docs/architecture/future-schema.md`, `prisma/schema.prisma`, `prisma/seed.mjs`, `src/app/api/contact/route.ts`, `src/app/global-error.tsx`, `src/app/globals.css`, plus new: `docs/round-2-response.md`, `docs/superpowers/`, `src/app/api/admin/`, `src/app/internal/admin/`, `src/content/referralRewards.ts`, `src/lib/referralCode.ts`, `src/proxy.ts`). `.env`/`.env.local` do **not** appear even with `-uall` (correctly gitignored). Nothing staged (`git diff --cached --name-only` empty). `git log --all --oneline -- .env .env.local` — no history, confirmed clean. `.env.example` diff is placeholder-only (empty values).

- [x] **Step 5: No commit** — this task was verification only, as planned.

---

## Self-Review Notes

- **Spec coverage:** all nine numbered points from the email are addressed — referral (Tasks 2–9), AI scorer (Task 10, no-op confirmed), pricing (Task 10, no-op confirmed), testimonials (Task 10, no-op confirmed), design/color (Task 1), Calendly + lead config (Task 8, README), MVP priority (no scope creep — explicitly scoped out auth/dashboards), final submission doc (Tasks 11–12).
- **No placeholders:** every task has literal file contents, not "add appropriate X" — verified during drafting.
- **Type consistency:** `generateReferralCode(clientName: string): string` (Task 3) matches its only call site in Task 6's convert-lead route. `rewardTypeLabel(id: string): string` (Task 2) matches its usage in Task 7's admin page. `DEFAULT_REFERRAL_REWARD_TYPE_ID` is a `string` constant used identically in both Task 2 (definition) and Task 6 (usage).

---

## Status: all 13 tasks complete, nothing committed (2026-08-19)

Every task above is implemented and verified locally (lint, build, and
manual/curl-driven browser checks — see each task's steps). **No git
commits were made** — all work sits as local, uncommitted changes and new
files, per explicit instruction to keep phases local until asked to
commit. `git status` at the end of this session:

- Modified: `.env.example`, `README.md`, `docs/architecture/future-schema.md`,
  `prisma/schema.prisma`, `prisma/seed.mjs`, `src/app/api/contact/route.ts`,
  `src/app/global-error.tsx`, `src/app/globals.css`.
- New: `docs/round-2-response.md`, `docs/superpowers/plans/2026-08-19-client-feedback-round2.md`
  (this file), `src/app/api/admin/convert-lead/route.ts`,
  `src/app/api/admin/redeem-referral/route.ts`,
  `src/app/internal/admin/page.tsx`, `src/content/referralRewards.ts`,
  `src/lib/referralCode.ts`, `src/proxy.ts`.
- Local-only, gitignored, not part of any commit: `.env.local`
  (`NEXT_PUBLIC_CALENDLY_URL` override).

One deviation from the plan as originally written, discovered mid-execution
and threaded through consistently: this Next.js version renamed the
`middleware.ts` file convention to `proxy.ts` — built as `src/proxy.ts`
throughout, not `middleware.ts`. See Task 5's deviation note and
`docs/round-2-response.md` for details.

Next step when ready: review the diff, then commit (grouped by task or as
one changeset, whichever you prefer) and decide on branch/PR strategy.
