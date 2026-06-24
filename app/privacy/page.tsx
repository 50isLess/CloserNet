import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — CloserNet",
  description: "How CloserNet collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to CloserNet
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: June 23, 2026</p>

        <section className="space-y-6 text-zinc-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Overview</h2>
            <p>
              CloserNet (&quot;we,&quot; &quot;us&quot;) respects your privacy. This policy explains what
              information we collect, how we use it, and your choices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information: name, email address, and password (hashed).</li>
              <li>Listing & transaction data: item details, photos, prices, shipping info, and order history.</li>
              <li>Payment information: processed by third-party payment providers; we do not store full card numbers.</li>
              <li>Usage data: pages visited, device type, and approximate location from IP address.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. How we use information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operate the marketplace, process payments, and provide escrow services.</li>
              <li>Calculate shipping estimates and display listings to buyers.</li>
              <li>Prevent fraud, enforce our Terms, and respond to support requests.</li>
              <li>Improve the Platform and send service-related communications.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Sharing</h2>
            <p>
              We share information with service providers (payment processors, hosting, email) under
              contract. We may disclose information if required by law or to protect users and the Platform.
              We do not sell your personal information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Cookies & analytics</h2>
            <p>
              We use essential cookies for authentication and session management. Optional analytics
              may be used to understand how the site is used. You can control cookies through your browser.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Data retention & security</h2>
            <p>
              We retain account and transaction records as needed for legal, tax, and operational purposes.
              We apply reasonable technical and organizational safeguards, but no system is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Your rights</h2>
            <p>
              Depending on your location, you may request access, correction, or deletion of your personal
              data. Contact us at{" "}
              <a href="mailto:privacy@closernet.net" className="text-white underline">
                privacy@closernet.net
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">8. Children</h2>
            <p>
              CloserNet is not intended for users under 18. We do not knowingly collect data from children.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">9. Changes</h2>
            <p>
              We may update this policy and will revise the &quot;Last updated&quot; date. Continued use
              after changes constitutes acceptance.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}