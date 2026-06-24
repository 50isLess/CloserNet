import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addToWaitlist } from "@/lib/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const { duplicate } = await addToWaitlist(email);

    if (duplicate) {
      return NextResponse.json(
        {
          message: "Good news — you're already on the waitlist. We'll email you when early access opens.",
          duplicate: true,
        },
        { status: 200 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL ?? "CloserNet <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: email,
        subject: "You're on the CloserNet waitlist",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; color: #18181b;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">You're on the list</h1>
            <p style="color: #52525b; line-height: 1.6; margin-bottom: 16px;">
              Thanks for joining the CloserNet early access waitlist. We're building a peer-to-peer marketplace
              with Stripe escrow protection and ~7.5% total seller fees — and you'll be among the first to know when we launch.
            </p>
            <p style="color: #52525b; line-height: 1.6;">
              We'll email you when seller accounts and checkout go live. No spam — just launch updates.
            </p>
            <p style="color: #a1a1aa; font-size: 14px; margin-top: 32px;">— The CloserNet team</p>
          </div>
        `,
      });

      const notifyEmail = process.env.WAITLIST_NOTIFY_EMAIL ?? "support@closernet.net";
      await resend.emails.send({
        from,
        to: notifyEmail,
        subject: `New waitlist signup: ${email}`,
        text: `New early access signup: ${email}`,
      });
    }

    return NextResponse.json({
      message: apiKey
        ? "Check your inbox — we just sent a confirmation email."
        : "You're in! We'll email you when seller accounts and checkout go live.",
      emailSent: Boolean(apiKey),
    });
  } catch (error) {
    console.error("Waitlist signup failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}