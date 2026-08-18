// Seeds demo data for the future-schema demo (see
// docs/architecture/future-schema.md and /internal/demo).
//
// Package data is hardcoded here rather than imported from
// src/content/services.ts (that file is TypeScript and this seed script
// runs as plain Node ESM before any build step) — keep the two in sync by
// hand if a package changes. Everything else is representative demo data,
// not real client information.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PACKAGES = [
  {
    slug: "resume-linkedin",
    name: "Resume & LinkedIn",
    durationDays: 30,
    priceINR: 4999,
    recommended: false,
    builtOnSlug: null,
    features: ["ATS-friendly Resume", "LinkedIn Profile Optimization", "Profile Review & Suggestions"],
  },
  {
    slug: "career-acceleration",
    name: "Career Acceleration",
    durationDays: 60,
    priceINR: 9999,
    recommended: false,
    builtOnSlug: "resume-linkedin",
    features: ["Interview Preparation", "Job Application Strategy", "HR Guidance", "Career Roadmap"],
  },
  {
    slug: "career-transformation",
    name: "Career Transformation",
    durationDays: 75,
    priceINR: 16999,
    recommended: true,
    builtOnSlug: "career-acceleration",
    features: [
      "Personalized 1:1 Career Mentoring",
      "Weekly Progress Reviews",
      "Mock Interviews",
      "Networking & Referral Strategy",
      "Offer Evaluation & Negotiation Guidance",
    ],
  },
  {
    slug: "premium-placement",
    name: "Premium Placement Support",
    durationDays: 90,
    priceINR: 24999,
    recommended: false,
    builtOnSlug: "career-transformation",
    features: [
      "Unlimited 1:1 Coaching",
      "Priority WhatsApp Support",
      "Advanced Mock Interviews",
      "End-to-End Placement Support until you land the right role",
    ],
  },
];

async function main() {
  console.log("Seeding packages...");
  const bySlug = {};
  for (const pkg of PACKAGES) {
    const created = await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        durationDays: pkg.durationDays,
        priceINR: pkg.priceINR,
        recommended: pkg.recommended,
      },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        durationDays: pkg.durationDays,
        priceINR: pkg.priceINR,
        recommended: pkg.recommended,
      },
    });
    bySlug[pkg.slug] = created;
  }

  // Second pass: set builtOnId now that all packages exist, and (re)write features.
  for (const pkg of PACKAGES) {
    await prisma.package.update({
      where: { id: bySlug[pkg.slug].id },
      data: { builtOnId: pkg.builtOnSlug ? bySlug[pkg.builtOnSlug].id : null },
    });
    await prisma.packageFeature.deleteMany({ where: { packageId: bySlug[pkg.slug].id } });
    await prisma.packageFeature.createMany({
      data: pkg.features.map((label, i) => ({ packageId: bySlug[pkg.slug].id, label, sortOrder: i })),
    });
  }

  console.log("Seeding a consultant...");
  const consultant = await prisma.consultant.upsert({
    where: { email: "priya.mentor@gccareerstudio.com" },
    update: {},
    create: {
      name: "Priya Mehta",
      email: "priya.mentor@gccareerstudio.com",
      bio: "Former tech-recruiting lead, now full-time career consultant focused on early-career placements.",
      specialties: JSON.stringify(["resume", "interview-prep", "career-transitions"]),
    },
  });

  console.log("Seeding a demo lead -> client conversion...");
  // Lead has no unique constraint on email by design (real leads can reuse
  // an email), so this is a plain find-or-create rather than an upsert.
  let lead = await prisma.lead.findFirst({ where: { email: "demo.client@example.com" } });
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        name: "Ananya Rao",
        email: "demo.client@example.com",
        message: "Looking for help going from campus placements to a full-time SDE role.",
        source: "web-form",
        status: "converted",
      },
    });
  }

  let client = await prisma.client.findFirst({ where: { leadId: lead.id } });
  if (!client) {
    client = await prisma.client.create({
      data: {
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: "+91 90000 12345",
      },
    });
  }

  console.log("Seeding a client package, appointments, and a progress review...");
  let clientPackage = await prisma.clientPackage.findFirst({ where: { clientId: client.id } });
  if (!clientPackage) {
    clientPackage = await prisma.clientPackage.create({
      data: {
        clientId: client.id,
        packageId: bySlug["career-transformation"].id,
        consultantId: consultant.id,
        startDate: new Date("2026-08-01"),
        status: "active",
      },
    });
  }

  const appointmentCount = await prisma.appointment.count({ where: { clientPackageId: clientPackage.id } });
  if (appointmentCount === 0) {
    await prisma.appointment.createMany({
      data: [
        {
          clientPackageId: clientPackage.id,
          type: "discovery_call",
          scheduledAt: new Date("2026-08-01T10:00:00Z"),
          status: "completed",
        },
        {
          clientPackageId: clientPackage.id,
          type: "mock_interview",
          scheduledAt: new Date("2026-08-15T10:00:00Z"),
          status: "scheduled",
        },
      ],
    });
  }

  const reviewCount = await prisma.progressReview.count({ where: { clientPackageId: clientPackage.id } });
  if (reviewCount === 0) {
    await prisma.progressReview.create({
      data: {
        clientPackageId: clientPackage.id,
        weekNumber: 1,
        notes: "Resume rewrite complete. Starting mock interview prep next week.",
      },
    });
  }

  console.log("Seeding a referral...");
  const existingReferral = await prisma.referral.findFirst({ where: { referrerClientId: client.id } });
  if (!existingReferral) {
    await prisma.referral.create({
      data: {
        referrerClientId: client.id,
        code: "ANANYA10",
        rewardType: "free_session",
        rewardStatus: "pending",
      },
    });
  }

  console.log("Seeding a resume analysis...");
  const existingAnalysis = await prisma.resumeAnalysis.findFirst({ where: { fileRef: "demo/sample-resume.pdf" } });
  if (!existingAnalysis) {
    await prisma.resumeAnalysis.create({
      data: {
        fileRef: "demo/sample-resume.pdf",
        atsScore: 62,
        suggestions: JSON.stringify([
          "Add measurable outcomes to your project bullet points.",
          "Move your skills section above education for an ATS-friendly scan order.",
          "Remove the objective paragraph — it repeats what's already in your summary.",
        ]),
        recommendedPackageId: bySlug["resume-linkedin"].id,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
