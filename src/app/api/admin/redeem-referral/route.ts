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
