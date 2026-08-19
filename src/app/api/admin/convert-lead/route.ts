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
