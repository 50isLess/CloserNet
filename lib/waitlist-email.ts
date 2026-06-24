import { Resend } from "resend";

const CONFIRMATION_SUBJECT = "You're on the CloserNet waitlist";

function confirmationHtml() {
  return `
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
  `;
}

function confirmationText() {
  return [
    "You're on the CloserNet waitlist!",
    "",
    "Thanks for joining our early access waitlist. We're building a peer-to-peer marketplace",
    "with Stripe escrow protection and ~7.5% total seller fees.",
    "",
    "We'll email you when seller accounts and checkout go live. No spam — just launch updates.",
    "",
    "— The CloserNet team",
    "support@closernet.net",
  ].join("\n");
}

export async function sendWaitlistEmails({
  apiKey,
  from,
  notifyEmail,
  signupEmail,
  ref,
}: {
  apiKey: string;
  from: string;
  notifyEmail: string;
  signupEmail: string;
  ref?: string;
}) {
  const resend = new Resend(apiKey);
  const replyTo = "support@closernet.net";

  const confirmation = await resend.emails.send({
    from,
    to: signupEmail,
    replyTo,
    subject: CONFIRMATION_SUBJECT,
    html: confirmationHtml(),
    text: confirmationText(),
  });

  const refLine = ref ? `\nReferral: ${ref}` : "";
  const notification = await resend.emails.send({
    from,
    to: notifyEmail,
    replyTo,
    subject: `New waitlist signup: ${signupEmail}${ref ? ` (via ${ref})` : ""}`,
    text: `New early access signup: ${signupEmail}${refLine}`,
  });

  return { confirmation, notification };
}

export { CONFIRMATION_SUBJECT };