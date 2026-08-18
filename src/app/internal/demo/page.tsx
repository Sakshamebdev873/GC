import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { formatINR } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Future-Schema Demo (Internal)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl font-medium text-primary">{title}</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-white">{children}</div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  if (rows.length === 0) {
    return <p className="p-4 text-sm text-muted">No rows yet.</p>;
  }
  return (
    <table className="w-full min-w-[600px] text-left text-sm">
      <thead>
        <tr className="border-b border-border bg-surface text-xs font-semibold uppercase tracking-wide text-muted">
          {headers.map((h) => (
            <th key={h} className="px-4 py-2.5">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border last:border-0">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2.5 align-top">
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
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm text-primary">
        <strong>Internal demo — not part of the public site.</strong> This page
        renders live rows from the SQLite database defined in{" "}
        <code className="rounded bg-white px-1.5 py-0.5">prisma/schema.prisma</code>, the
        implementation of the future SaaS data model sketched in{" "}
        <code className="rounded bg-white px-1.5 py-0.5">docs/architecture/future-schema.md</code>.
        It exists to demo that the schema works end to end, not as a real
        admin panel — no auth, no write actions, unlisted from nav.
        Submitting <code className="rounded bg-white px-1.5 py-0.5">/contact</code> creates a
        real row in the Leads table below.
      </div>

      <h1 className="mt-8 font-serif text-3xl font-medium text-primary">Future-Schema Demo</h1>

      <Section title={`Packages (${packages.length})`}>
        <Table
          headers={["Name", "Duration", "Price", "Recommended", "Built on", "Features"]}
          rows={packages.map((p) => [
            p.name,
            `${p.durationDays} days`,
            formatINR(p.priceINR),
            p.recommended ? "Yes" : "—",
            p.builtOn?.name ?? "—",
            p.features.map((f) => f.label).join("; "),
          ])}
        />
      </Section>

      <Section title={`Consultants (${consultants.length})`}>
        <Table
          headers={["Name", "Email", "Specialties"]}
          rows={consultants.map((c) => [c.name, c.email, JSON.parse(c.specialties).join(", ")])}
        />
      </Section>

      <Section title={`Leads (${leads.length})`}>
        <Table
          headers={["Name", "Email", "Message", "Referral code", "Source", "Status", "Created"]}
          rows={leads.map((l) => [
            l.name,
            l.email,
            l.message,
            l.referralCode ?? "—",
            l.source,
            l.status,
            l.createdAt.toLocaleString(),
          ])}
        />
      </Section>

      <Section title={`Clients (${clients.length})`}>
        <Table
          headers={["Name", "Email", "Phone", "Converted from lead"]}
          rows={clients.map((c) => [c.name, c.email, c.phone ?? "—", c.lead ? "Yes" : "No"])}
        />
      </Section>

      <Section title={`Client packages (${clientPackages.length})`}>
        <Table
          headers={["Client", "Package", "Consultant", "Status", "Start date"]}
          rows={clientPackages.map((cp) => [
            cp.client.name,
            cp.package.name,
            cp.consultant?.name ?? "Unassigned",
            cp.status,
            cp.startDate.toLocaleDateString(),
          ])}
        />
      </Section>

      <Section title={`Appointments (${appointments.length})`}>
        <Table
          headers={["Client", "Type", "Scheduled", "Status"]}
          rows={appointments.map((a) => [
            a.clientPackage.client.name,
            a.type,
            a.scheduledAt.toLocaleString(),
            a.status,
          ])}
        />
      </Section>

      <Section title={`Progress reviews (${progressReviews.length})`}>
        <Table
          headers={["Client", "Week", "Notes"]}
          rows={progressReviews.map((r) => [r.clientPackage.client.name, r.weekNumber, r.notes])}
        />
      </Section>

      <Section title={`Referrals (${referrals.length})`}>
        <Table
          headers={["Referrer", "Code", "Referred lead", "Reward", "Status"]}
          rows={referrals.map((r) => [
            r.referrerClient.name,
            r.code,
            r.referredLead?.name ?? "Unused",
            r.rewardType,
            r.rewardStatus,
          ])}
        />
      </Section>

      <Section title={`Resume analyses (${resumeAnalyses.length})`}>
        <Table
          headers={["File", "ATS score", "Recommended package", "Suggestions"]}
          rows={resumeAnalyses.map((r) => [
            r.fileRef,
            r.atsScore,
            r.recommendedPackage?.name ?? "—",
            JSON.parse(r.suggestions).join(" / "),
          ])}
        />
      </Section>
    </Container>
  );
}
