import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CloserNet",
  description: "How CloserNet collects, uses, stores, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to CloserNet
          </Link>
          <Link href="/terms" className="text-sm text-zinc-400 hover:text-white">
            Terms of Service
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: June 23, 2026</p>

        <section className="space-y-8 text-zinc-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Overview</h2>
            <p>
              CloserNet (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy
              explains what personal information we collect, how we use and share it, how long we keep it, and the choices
              available to you when you visit closernet.net, join our waitlist, or use our marketplace services
              (collectively, the &quot;Platform&quot;).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information we collect</h2>
            <p className="mb-3">We collect information in the following categories:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Waitlist & contact information:</strong> email address and signup timestamp
                when you request early access.
              </li>
              <li>
                <strong className="text-white">Account information:</strong> name, email, password (stored in hashed form),
                phone number, and identity verification data when accounts launch.
              </li>
              <li>
                <strong className="text-white">Listing & transaction data:</strong> item titles, descriptions, photos,
                prices, shipping details, order history, messages, and dispute records.
              </li>
              <li>
                <strong className="text-white">Payment information:</strong> billing details and transaction identifiers.
                Full payment card numbers are processed by third-party payment providers and are not stored on our servers.
              </li>
              <li>
                <strong className="text-white">Device & usage data:</strong> IP address, browser type, device identifiers,
                pages viewed, referring URLs, and approximate location derived from IP.
              </li>
              <li>
                <strong className="text-white">Communications:</strong> support requests, feedback, and email correspondence.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. How we use information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operate the Platform, process transactions, and provide escrow and shipping tools.</li>
              <li>Send waitlist confirmations, launch announcements, and service-related emails.</li>
              <li>Verify identity, prevent fraud, enforce our Terms, and resolve disputes.</li>
              <li>Calculate shipping estimates, display listings, and improve CloserValue AI features.</li>
              <li>Analyze usage to improve performance, security, and user experience.</li>
              <li>Comply with legal obligations and respond to lawful requests.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Legal bases (EEA/UK users)</h2>
            <p>
              Where applicable under GDPR, we process personal data based on: (a) performance of a contract with you;
              (b) our legitimate interests in operating a secure marketplace; (c) your consent, where required (e.g.,
              marketing emails); and (d) compliance with legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. How we share information</h2>
            <p className="mb-3">We do not sell your personal information. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Service providers</strong> under contract — including hosting (e.g., Vercel),
                email delivery (e.g., Resend), payment processors, identity verification vendors, and analytics providers.
              </li>
              <li>
                <strong className="text-white">Other users</strong> as needed to complete transactions — such as shipping
                addresses shared between buyer and seller after purchase.
              </li>
              <li>
                <strong className="text-white">Law enforcement or regulators</strong> when required by law, subpoena, or to
                protect users, the Platform, or the public.
              </li>
              <li>
                <strong className="text-white">Business transfers</strong> in connection with a merger, acquisition, or sale
                of assets, subject to this Policy.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Cookies & similar technologies</h2>
            <p>
              We use essential cookies and local storage for session management, authentication, and security. We may use
              analytics cookies to understand how visitors use the site. You can control cookies through your browser
              settings; disabling essential cookies may limit Platform functionality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Data retention</h2>
            <p>
              We retain personal information for as long as needed to provide the Platform, comply with legal and tax
              obligations, resolve disputes, and enforce our agreements. Waitlist emails are retained until you unsubscribe
              or request deletion, or until they are no longer needed for launch communications. Transaction records may be
              kept for seven years or longer where required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">8. Security</h2>
            <p>
              We apply reasonable technical and organizational safeguards, including encryption in transit, access controls,
              and secure hosting. No method of transmission or storage is 100% secure. If you believe your account has been
              compromised, contact{" "}
              <a href="mailto:support@closernet.net" className="text-white underline">
                support@closernet.net
              </a>{" "}
              immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">9. Your rights & choices</h2>
            <p className="mb-3">Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Access, correct, or delete your personal information.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Port your data to another service.</li>
              <li>Withdraw consent where processing is consent-based.</li>
              <li>Opt out of marketing emails via the unsubscribe link in any message.</li>
            </ul>
            <p>
              <strong className="text-white">California residents (CCPA/CPRA):</strong> You have the right to know what
              personal information we collect, request deletion, and opt out of the sale of personal information. We do not
              sell personal information. To exercise rights, email{" "}
              <a href="mailto:privacy@closernet.net" className="text-white underline">
                privacy@closernet.net
              </a>
              . We will not discriminate against you for exercising these rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">10. International transfers</h2>
            <p>
              CloserNet is based in the United States. If you access the Platform from outside the U.S., your information
              may be transferred to, stored in, and processed in the United States or other countries where our service
              providers operate. We take steps designed to ensure appropriate safeguards where required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">11. Children</h2>
            <p>
              The Platform is not intended for anyone under 18. We do not knowingly collect personal information from
              children. If you believe a child has provided us information, contact us and we will delete it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">12. Third-party links</h2>
            <p>
              The Platform may link to third-party sites or services. Their privacy practices are governed by their own
              policies. We are not responsible for third-party content or data handling.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">13. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy and will revise the &quot;Last updated&quot; date. Material changes may be
              communicated by email or prominent notice on the Platform. Continued use after changes take effect constitutes
              acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">14. Contact us</h2>
            <p>
              Privacy questions or requests:{" "}
              <a href="mailto:privacy@closernet.net" className="text-white underline">
                privacy@closernet.net
              </a>
              <br />
              General support:{" "}
              <a href="mailto:support@closernet.net" className="text-white underline">
                support@closernet.net
              </a>
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}