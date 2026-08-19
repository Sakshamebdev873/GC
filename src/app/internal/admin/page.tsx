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
