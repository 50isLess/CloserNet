import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Terms of Service — CloserNet",
  description: "Terms of Service for using the CloserNet peer-to-peer marketplace and escrow platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <nav className="border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center gap-3">
          <Logo />
          <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-zinc-400 text-sm mb-10">Last updated: June 23, 2026</p>

        <section className="space-y-8 text-zinc-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Agreement to these Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of CloserNet.net,
              CloserNet&apos;s websites, applications, and related services (collectively, the &quot;Platform&quot;),
              operated by CloserNet (&quot;CloserNet,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              By accessing or using the Platform — including joining our waitlist — you agree to be bound by these
              Terms and our{" "}
              <Link href="/privacy" className="text-white underline hover:text-zinc-300">
                Privacy Policy
              </Link>
              . If you do not agree, do not use the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Platform status & early access</h2>
            <p className="mb-3">
              CloserNet is currently in pre-launch and early-access phases. Some features — including full account
              registration, live buyer checkout, escrow settlement, identity verification, and dispute resolution —
              may be limited, simulated, or unavailable until we announce general availability.
            </p>
            <p>
              Joining the waitlist does not guarantee access. We may invite users in batches and may modify launch
              timelines at our discretion. Information you submit during early access is handled as described in
              our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of forming a binding contract to create an account or
              complete transactions on the Platform. You represent that you are not barred from using the Platform
              under applicable law and that all information you provide is accurate and current.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Accounts & security</h2>
            <p className="mb-3">
              When accounts become available, you are responsible for maintaining the confidentiality of your login
              credentials and for all activity under your account. Notify us immediately at{" "}
              <a href="mailto:support@closernet.net" className="text-white underline">
                support@closernet.net
              </a>{" "}
              if you suspect unauthorized access.
            </p>
            <p>
              We may require identity verification before your first listing goes live or before funds are released.
              Failure to complete verification may limit or suspend your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Marketplace role</h2>
            <p>
              CloserNet provides a venue that connects buyers and sellers of used and collectible goods. Except where
              expressly stated, CloserNet is not a party to transactions between users, does not take title to listed
              items, and does not act as a buyer or seller. We facilitate listings, payments, escrow, and shipping
              tools but do not guarantee the quality, safety, legality, or delivery of any item.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Listings & seller obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate titles, descriptions, photos, condition disclosures, and pricing.</li>
              <li>Own the item or have legal authority to sell it.</li>
              <li>Ship items promptly using the carrier and service level selected at checkout.</li>
              <li>Provide valid tracking when shipping and respond to buyer inquiries in good faith.</li>
              <li>Comply with all applicable laws, including consumer protection and tax obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Purchases & buyer obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Review listings carefully before purchasing, including shipping costs and insurance options.</li>
              <li>Pay the full amount due at checkout, including item price, shipping, and applicable taxes or fees.</li>
              <li>Confirm delivery promptly once the item arrives as described, or open a dispute within the window we provide.</li>
              <li>Not abuse chargebacks, disputes, or the escrow system to obtain items without payment.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">8. Fees & payments</h2>
            <p className="mb-3">
              CloserNet charges sellers a total fee of approximately 7.5% per completed sale, including Stripe escrow
              and payment processing. This typically comprises a CloserNet platform fee plus Stripe escrow and processing
              costs. Exact fee breakdowns are displayed before you list and at checkout. Fees may change with reasonable
              notice posted on the Platform.
            </p>
            <p>
              Payments and escrow are processed by Stripe, Inc. and other third-party providers as applicable. By
              transacting on the Platform, you agree to Stripe&apos;s terms and authorize us to share transaction data
              necessary to complete payments and escrow services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">9. Escrow</h2>
            <p className="mb-3">
              Where escrow is available, buyer funds are held by Stripe, acting as our escrow and payment agent, until
              delivery is confirmed or a dispute is resolved according to Platform rules. CloserNet facilitates the
              transaction but does not directly hold buyer funds. The general flow is:
            </p>
            <ol className="list-decimal pl-6 space-y-1 mb-3">
              <li>Buyer pays at checkout and funds enter escrow.</li>
              <li>Seller is notified to ship after payment is secured.</li>
              <li>Buyer confirms receipt or a delivery window expires.</li>
              <li>Funds are released to the seller, minus applicable fees.</li>
            </ol>
            <p>
              Escrow does not eliminate all transaction risk. CloserNet may hold, delay, or reverse payouts when fraud,
              policy violations, or disputes are suspected. Escrow terms may be supplemented by separate payment-provider
              agreements at launch.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">10. Shipping & insurance</h2>
            <p>
              Shipping rate estimates displayed on the Platform are illustrative and based on weight, dimensions, and
              carrier formulas. Final shipping costs are shown at checkout. CloserNet is not a carrier and does not
              guarantee delivery times, package handling, or insurance claim outcomes. Optional shipping insurance, where
              offered, is subject to carrier and insurer terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">11. Disputes, refunds & chargebacks</h2>
            <p className="mb-3">
              If a buyer reports an item not received, significantly not as described, or damaged in transit, either party
              may open a dispute within the timeframe stated at checkout. We may request photos, tracking, or other evidence
              and will attempt to resolve disputes fairly based on Platform policies.
            </p>
            <p>
              Outcomes may include full or partial refunds, return shipping instructions, or release of funds to the seller.
              Initiating a bank or card chargeback while a Platform dispute is open may result in account suspension.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">12. Prohibited items & conduct</h2>
            <p className="mb-3">You may not use the Platform to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>List illegal, stolen, counterfeit, or recalled items.</li>
              <li>List weapons, drugs, hazardous materials, or other restricted goods where prohibited by law or Platform policy.</li>
              <li>Engage in fraud, harassment, price manipulation, or circumvention of fees or escrow.</li>
              <li>Scrape, reverse engineer, or interfere with Platform security or infrastructure.</li>
              <li>Misrepresent identity or create accounts to evade suspensions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">13. CloserValue AI & estimates</h2>
            <p>
              CloserValue AI and shipping calculators are informational tools only. CloserValue AI uses third-party AI
              models (e.g., Grok via xAI) and may incorporate market knowledge that is not verified in real time. They
              do not constitute appraisals, investment advice, or guarantees of sale price, shipping cost, or market demand.
              You are solely responsible for your listing price and shipping choices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">14. Intellectual property</h2>
            <p>
              The Platform, including its design, branding, software, and content we provide, is owned by CloserNet or its
              licensors. You retain ownership of content you submit (e.g., listing photos) but grant us a non-exclusive license
              to display, host, and promote that content in connection with operating the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">15. Termination</h2>
            <p>
              We may suspend or terminate your access at any time for violation of these Terms, suspected fraud, legal
              requirements, or operational reasons. You may close your account by contacting support. Provisions that by
              their nature should survive termination — including payment obligations, disputes, disclaimers, and limitations
              of liability — will survive.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">16. Disclaimers</h2>
            <p>
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">17. Limitation of liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, CLOSERNET AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE PLATFORM OR ANY TRANSACTION BETWEEN USERS. OUR
              AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE GREATER
              OF (A) THE FEES YOU PAID TO CLOSERNET IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS
              ($100).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">18. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CloserNet from claims, damages, losses, and expenses (including
              reasonable attorneys&apos; fees) arising from your use of the Platform, your listings or purchases, your
              violation of these Terms, or your violation of any third-party rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">19. Governing law & disputes</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law
              principles. Any dispute arising under these Terms shall be brought in the state or federal courts located in
              Delaware, and you consent to their jurisdiction. Nothing in this section limits either party&apos;s right to
              seek injunctive relief for intellectual property or security violations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">20. Changes</h2>
            <p>
              We may update these Terms from time to time. We will post the revised Terms with an updated &quot;Last updated&quot;
              date. Material changes may also be communicated by email or in-app notice. Continued use after changes take
              effect constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">21. Contact</h2>
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