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

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (resendApiKey && toEmail) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GC Career Studio <leads@gccareerstudio.com>",
        to: [toEmail],
        reply_to: input.email,
        subject: `New lead: ${input.name}`,
        text: `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
      }),
    });

    if (!res.ok) {
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
