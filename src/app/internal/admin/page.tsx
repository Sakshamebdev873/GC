import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { rewardTypeLabel } from "@/content/referralRewards";

export const metadata: Metadata = {
  title: "Referral Admin (Internal)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function leadStatusTone(status: string): "neutral" | "accent" | "success" {
  if (status === "converted") return "success";
  if (status === "qualified") return "accent";
  return "neutral";
}

function rewardStatusTone(status: string): "neutral" | "accent" | "success" {
  if (status === "redeemed") return "success";
  if (status === "earned") return "accent";
  return "neutral";
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <p className="font-serif text-3xl font-medium text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

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

  const pendingCount = referrals.filter((r) => r.rewardStatus === "pending").length;
  const earnedCount = referrals.filter((r) => r.rewardStatus === "earned").length;
  const redeemedCount = referrals.filter((r) => r.rewardStatus === "redeemed").length;

  return (
    <Container className="max-w-5xl py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-dark">
        Internal · Admin
      </p>
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary">
        Referral &amp; lead admin
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Converting a lead here is what earns a referral reward — submitting a
        referral code alone never does. Gated by{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">src/proxy.ts</code>{" "}
        when{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">ADMIN_USER</code> /{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">ADMIN_PASSWORD</code>{" "}
        are set.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Leads awaiting conversion" value={openLeads.length} />
        <StatTile label="Rewards pending" value={pendingCount} />
        <StatTile label="Rewards earned" value={earnedCount} />
        <StatTile label="Rewards redeemed" value={redeemedCount} />
      </div>

      <div className="mt-12 flex items-baseline gap-3">
        <h2 className="font-serif text-2xl font-medium text-primary">
          Leads awaiting conversion
        </h2>
        <Badge tone="neutral">{openLeads.length}</Badge>
      </div>
      <div className="mt-4">
        {openLeads.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No open leads. New submissions from <code>/contact</code> will show up here.
          </div>
        )}
        {openLeads.length > 0 && (
          <div className="divide-y divide-border rounded-2xl border border-border bg-white">
            {openLeads.map((lead) => (
              <div
                key={lead.id}
                className="grid grid-cols-1 items-start gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_220px_150px] sm:items-center sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{lead.name}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">{lead.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-start">
                  <Badge tone={leadStatusTone(lead.status)}>{lead.status}</Badge>
                  {lead.referralCode && (
                    <span className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
                      {lead.referralCode}
                    </span>
                  )}
                </div>
                <form action="/api/admin/convert-lead" method="POST" className="sm:justify-self-end">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <Button type="submit" variant="primary" className="w-full !px-5 !py-2.5 text-sm sm:w-auto">
                    Mark converted
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex items-baseline gap-3">
        <h2 className="font-serif text-2xl font-medium text-primary">Referrals</h2>
        <Badge tone="neutral">{referrals.length}</Badge>
      </div>
      <div className="mt-4">
        {referrals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
            No referral codes issued yet. Codes are created automatically when
            a lead is converted.
          </div>
        )}
        {referrals.length > 0 && (
          <div className="divide-y divide-border rounded-2xl border border-border bg-white">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-1 items-start gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_130px_190px_110px_150px] sm:items-center sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{r.referrerClient.name}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    Referred:{" "}
                    {r.referredLead ? (
                      r.referredLead.name
                    ) : (
                      <span className="italic">unused</span>
                    )}
                  </p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted sm:justify-self-start">
                  {r.code}
                </span>
                <div className="sm:justify-self-start">
                  <Badge tone="primary">{rewardTypeLabel(r.rewardType)}</Badge>
                </div>
                <div className="sm:justify-self-start">
                  <Badge tone={rewardStatusTone(r.rewardStatus)}>{r.rewardStatus}</Badge>
                </div>
                <div className="sm:justify-self-end">
                  {r.rewardStatus === "earned" && (
                    <form action="/api/admin/redeem-referral" method="POST">
                      <input type="hidden" name="referralId" value={r.id} />
                      <Button type="submit" variant="secondary" className="w-full !px-5 !py-2.5 text-sm sm:w-auto">
                        Mark redeemed
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
