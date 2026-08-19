import { NextResponse } from "next/server";
import { validateLeadForm, type LeadFormInput } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: Partial<LeadFormInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input: LeadFormInput = {
    name: body.name ?? "",
    email: body.email ?? "",
    message: body.message ?? "",
    referralCode: body.referralCode?.trim() || undefined,
  };

  const errors = validateLeadForm(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  console.log("[lead-form] New lead (no email service configured):", input);

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

  return NextResponse.json({ ok: true });
}
