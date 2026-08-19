import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Future-Schema Demo (Internal)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function leadStatusTone(status: string): "neutral" | "accent" | "success" {
  if (status === "converted") return "success";
  if (status === "qualified") return "accent";
  return "neutral";
}

function referralStatusTone(status: string): "neutral" | "accent" | "success" {
  if (status === "redeemed") return "success";
  if (status === "earned") return "accent";
  return "neutral";
}

function appointmentStatusTone(status: string): "neutral" | "accent" | "success" {
  if (status === "completed") return "success";
  if (status === "scheduled") return "accent";
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

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-2xl font-medium text-primary">{title}</h2>
        <Badge tone="neutral">{count}</Badge>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">{children}</div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  if (rows.length === 0) {
    return <p className="p-6 text-center text-sm text-muted">No rows yet.</p>;
  }
  return (
    <table className="w-full min-w-[640px] text-left text-sm">
      <thead>
        <tr className="border-b border-border bg-surface text-xs font-semibold uppercase tracking-wide text-muted">
          {headers.map((h) => (
            <th key={h} className="px-4 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/40">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 align-top">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function InternalDemoPage() {
  const [packages, consultants, leads, clients, clientPackages, appointments, progressReviews, referrals, resumeAnalyses] =
    await Promise.all([
      prisma.package.findMany({ include: { features: true, builtOn: true }, orderBy: { durationDays: "asc" } }),
      prisma.consultant.findMany(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.client.findMany({ include: { lead: true } }),
      prisma.clientPackage.findMany({ include: { client: true, package: true, consultant: true } }),
      prisma.appointment.findMany({ include: { clientPackage: { include: { client: true } } } }),
      prisma.progressReview.findMany({ include: { clientPackage: { include: { client: true } } } }),
      prisma.referral.findMany({ include: { referrerClient: true, referredLead: true } }),
      prisma.resumeAnalysis.findMany({ include: { recommendedPackage: true } }),
    ]);

  return (
    <Container className="max-w-5xl py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-dark">
        Internal · Demo
      </p>
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-primary">
        Future-schema demo
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Live rows from the SQLite database defined in{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">prisma/schema.prisma</code>
        , implementing the model sketched in{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">
          docs/architecture/future-schema.md
        </code>
        . Read-only, unlisted from nav, no auth. Submitting{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-[13px]">/contact</code> creates a
        real row in the Leads table below.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Packages" value={packages.length} />
        <StatTile label="Consultants" value={consultants.length} />
        <StatTile label="Leads" value={leads.length} />
        <StatTile label="Clients" value={clients.length} />
        <StatTile label="Referrals" value={referrals.length} />
        <StatTile label="Resume analyses" value={resumeAnalyses.length} />
      </div>

      <Section title="Packages" count={packages.length}>
        <Table
          headers={["Name", "Duration", "Price", "Recommended", "Built on", "Features"]}
          rows={packages.map((p) => [
            p.name,
            `${p.durationDays} days`,
            formatINR(p.priceINR),
            p.recommended ? <Badge tone="accent">Recommended</Badge> : "—",
            p.builtOn?.name ?? "—",
            p.features.map((f) => f.label).join("; "),
          ])}
        />
      </Section>

      <Section title="Consultants" count={consultants.length}>
        <Table
          headers={["Name", "Email", "Specialties"]}
          rows={consultants.map((c) => [c.name, c.email, JSON.parse(c.specialties).join(", ")])}
        />
      </Section>

      <Section title="Leads" count={leads.length}>
        <Table
          headers={["Name", "Email", "Message", "Referral code", "Source", "Status", "Created"]}
          rows={leads.map((l) => [
            l.name,
            l.email,
            <span key="msg" className="line-clamp-2 max-w-xs">{l.message}</span>,
            l.referralCode ? (
              <span className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
                {l.referralCode}
              </span>
            ) : (
              "—"
            ),
            l.source,
            <Badge key="status" tone={leadStatusTone(l.status)}>{l.status}</Badge>,
            l.createdAt.toLocaleString(),
          ])}
        />
      </Section>

      <Section title="Clients" count={clients.length}>
        <Table
          headers={["Name", "Email", "Phone", "Converted from lead"]}
          rows={clients.map((c) => [
            c.name,
            c.email,
            c.phone ?? "—",
            c.lead ? <Badge tone="success">Yes</Badge> : <Badge tone="neutral">No</Badge>,
          ])}
        />
      </Section>

      <Section title="Client packages" count={clientPackages.length}>
        <Table
          headers={["Client", "Package", "Consultant", "Status", "Start date"]}
          rows={clientPackages.map((cp) => [
            cp.client.name,
            cp.package.name,
            cp.consultant?.name ?? "Unassigned",
            <Badge key="status" tone={cp.status === "active" ? "accent" : "neutral"}>{cp.status}</Badge>,
            cp.startDate.toLocaleDateString(),
          ])}
        />
      </Section>

      <Section title="Appointments" count={appointments.length}>
        <Table
          headers={["Client", "Type", "Scheduled", "Status"]}
          rows={appointments.map((a) => [
            a.clientPackage.client.name,
            a.type,
            a.scheduledAt.toLocaleString(),
            <Badge key="status" tone={appointmentStatusTone(a.status)}>{a.status}</Badge>,
          ])}
        />
      </Section>

      <Section title="Progress reviews" count={progressReviews.length}>
        <Table
          headers={["Client", "Week", "Notes"]}
          rows={progressReviews.map((r) => [
            r.clientPackage.client.name,
            r.weekNumber,
            <span key="notes" className="line-clamp-2 max-w-sm">{r.notes}</span>,
          ])}
        />
      </Section>

      <Section title="Referrals" count={referrals.length}>
        <Table
          headers={["Referrer", "Code", "Referred lead", "Reward", "Status"]}
          rows={referrals.map((r) => [
            r.referrerClient.name,
            <span key="code" className="rounded-full bg-surface px-3 py-1 font-mono text-xs text-muted">
              {r.code}
            </span>,
            r.referredLead ? r.referredLead.name : <span className="italic text-muted">Unused</span>,
            r.rewardType,
            <Badge key="status" tone={referralStatusTone(r.rewardStatus)}>{r.rewardStatus}</Badge>,
          ])}
        />
      </Section>

      <Section title="Resume analyses" count={resumeAnalyses.length}>
        <Table
          headers={["File", "ATS score", "Recommended package", "Suggestions"]}
          rows={resumeAnalyses.map((r) => [
            r.fileRef,
            r.atsScore,
            r.recommendedPackage?.name ?? "—",
            <span key="sugg" className="line-clamp-2 max-w-sm">{JSON.parse(r.suggestions).join(" / ")}</span>,
          ])}
        />
      </Section>
    </Container>
  );
}
