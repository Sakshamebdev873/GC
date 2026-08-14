import { NextResponse } from "next/server";
import { validateLeadForm, type LeadFormInput } from "@/lib/validation";

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
  };

  const errors = validateLeadForm(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  console.log("[lead-form] New lead (no email service configured):", input);

  return NextResponse.json({ ok: true });
}
