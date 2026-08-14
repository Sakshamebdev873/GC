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

  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (web3formsKey) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject: `New lead: ${input.name}`,
        name: input.name,
        email: input.email,
        message: input.message,
      }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again shortly." },
        { status: 502 }
      );
    }
  } else {
    console.log("[lead-form] New lead (email not configured):", input);
  }

  return NextResponse.json({ ok: true });
}
