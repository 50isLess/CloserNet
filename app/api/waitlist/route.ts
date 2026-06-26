import { NextResponse } from "next/server";
import { sanitizeReferral } from "@/lib/referral";
import { CONFIRMATION_SUBJECT, sendWaitlistEmails } from "@/lib/waitlist-email";
import { addToWaitlist } from "@/lib/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resendErrorMessage(error: { message?: string } | null | undefined) {
  return error?.message ?? "Unknown Resend error";
}

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() ?? "CloserNet <support@closernet.net>";
  const notify = process.env.WAITLIST_NOTIFY_EMAIL?.trim() ?? "support@closernet.net";
  const usingTestSender = from.includes("resend.dev");

  return NextResponse.json({
    configured: Boolean(apiKey),
    host: process.env.VERCEL_URL ?? null,
    project: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
    from,
    notify,
    usingTestSender,
    confirmationSubject: CONFIRMATION_SUBJECT,
    hint: !apiKey
      ? "Add RESEND_API_KEY in Vercel or run npm run setup-resend locally."
      : usingTestSender
        ? "Test sender only delivers to your Resend account email. Verify closernet.net for real signups."
        : "Ready to send confirmation emails to all waitlist signups.",
    notifyHint:
      notify.endsWith("@closernet.net") && !usingTestSender
        ? "Signup alerts go to support@closernet.net — you need a GoDaddy mailbox or forwarding there, OR set WAITLIST_NOTIFY_EMAIL to a personal Gmail in Vercel."
        : undefined,
    deliverabilityHint:
      "If you don't see email, check spam and search for subject: You're on the CloserNet waitlist. View logs at resend.com/emails.",
  });
}

export async function POST(request: Request) {
  let body: { email?: string; ref?: string };

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
    const ref = sanitizeReferral(body.ref);
    const { duplicate } = await addToWaitlist(email, ref);

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      console.error("Waitlist signup blocked: RESEND_API_KEY missing on this deployment.");
      return NextResponse.json(
        {
          error:
            "Waitlist email is not configured on this server. If you use closernet.net, point the domain to the main closernet Vercel project.",
          hint: "Check https://closernet.vercel.app/api/waitlist — configured should be true. View logs at resend.com/emails.",
          emailSent: false,
          duplicate,
        },
        { status: 503 }
      );
    }

    const from = process.env.RESEND_FROM_EMAIL ?? "CloserNet <support@closernet.net>";
    const notifyEmail = process.env.WAITLIST_NOTIFY_EMAIL ?? "support@closernet.net";

    const { confirmation, notification } = await sendWaitlistEmails({
      apiKey,
      from,
      notifyEmail,
      signupEmail: email,
      ref,
    });

    if (confirmation.error) {
      console.error("Resend confirmation failed:", confirmation.error);
      return NextResponse.json(
        {
          error: `Could not send confirmation email: ${resendErrorMessage(confirmation.error)}`,
          hint: "Check delivery logs at resend.com/emails and confirm closernet.net is verified.",
        },
        { status: 502 }
      );
    }

    if (notification.error) {
      console.error("Resend notify failed:", notification.error);
    }

    const spamHint = `Search your inbox and spam for "${CONFIRMATION_SUBJECT}".`;

    if (duplicate) {
      return NextResponse.json({
        message: `You're already on the waitlist — we sent the confirmation email again. ${spamHint}`,
        emailSent: true,
        duplicate: true,
        confirmationId: confirmation.data?.id ?? null,
        notifySent: !notification.error,
      });
    }

    return NextResponse.json({
      message: `Check your inbox — we just sent a confirmation email. ${spamHint}`,
      emailSent: true,
      confirmationId: confirmation.data?.id ?? null,
      notifySent: !notification.error,
    });
  } catch (error) {
    console.error("Waitlist signup failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}