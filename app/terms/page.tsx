import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — CloserNet",
  description: "Terms of Service for using the CloserNet marketplace.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Back to CloserNet
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-zinc">
        <h1 className="text-4xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: June 23, 2026</p>

        <section className="space-y-6 text-zinc-300">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Agreement</h2>
            <p>
              By accessing or using CloserNet (&quot;the Platform&quot;), you agree to these Terms of Service.
              If you do not agree, do not use the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Platform status</h2>
            <p>
              CloserNet is currently offered as a preview / minimum viable product. Features including
              account registration, live payments, escrow settlement, and dispute resolution may be
              limited or simulated until fully launched.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. User accounts</h2>
            <p>
              You must provide accurate information when creating an account. You are responsible for
              maintaining the security of your credentials and for all activity under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Listings & transactions</h2>
            <p>
              Sellers are responsible for the accuracy of listings, item condition, and lawful ownership
              of items offered for sale. Buyers are responsible for reviewing listings before purchase.
              CloserNet facilitates connections between buyers and sellers but does not take title to
              listed goods.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Fees</h2>
            <p>
              CloserNet charges a total platform fee of approximately 5% per completed sale, which may
              include payment processing costs. Exact fee breakdowns are shown at checkout. Fees may
              change with notice posted on the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Prohibited items & conduct</h2>
            <p>
              You may not list illegal items, counterfeit goods, stolen property, or content that violates
              applicable law. Harassment, fraud, and circumvention of escrow or fee systems are prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Escrow & shipping</h2>
            <p>
              Where escrow is available, funds are held until delivery is confirmed according to Platform
              rules. Shipping costs, insurance, and carrier selection are disclosed before checkout.
              CloserNet is not a carrier and does not guarantee delivery times.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">8. Disclaimers</h2>
            <p>
              The Platform is provided &quot;as is&quot; without warranties of any kind. CloserValue AI
              and shipping estimates are illustrative tools and not guarantees of price, sale outcome,
              or shipping cost.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, CloserNet shall not be liable for indirect,
              incidental, or consequential damages arising from use of the Platform or any transaction
              between users.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">10. Contact</h2>
            <p>
              Questions about these Terms:{" "}
              <a href="mailto:legal@closernet.net" className="text-white underline">
                legal@closernet.net
              </a>
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}