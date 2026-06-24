'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  shippingCost: number;
  shippingMethod: string;
  weight: number;
  dimensions: string;
  insurance: boolean;
  insuranceCost: number;
  isDemo?: boolean;
}

const DEMO_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Sony WH-1000XM5 Headphones",
    price: 280,
    description: "Excellent condition. Barely used. Original box included.",
    category: "Audio",
    image: "/listings/sony-wh1000xm5.jpg",
    shippingCost: 12,
    shippingMethod: "USPS Ground",
    weight: 2,
    dimensions: "10 × 8 × 4",
    insurance: true,
    insuranceCost: 4,
    isDemo: true
  },
  {
    id: 2,
    title: "The Dark Side of the Moon - Pink Floyd (Vinyl)",
    price: 45,
    description: "Original pressing in great shape.",
    category: "Vinyl",
    image: "/listings/pink-floyd-vinyl.png",
    shippingCost: 8,
    shippingMethod: "USPS Ground",
    weight: 1.2,
    dimensions: "12 × 12 × 1",
    insurance: false,
    insuranceCost: 0,
    isDemo: true
  },
  {
    id: 3,
    title: "MacBook Pro 16\" M3 Max",
    price: 2450,
    description: "2024 model. 64GB RAM, 1TB SSD. Like new.",
    category: "Electronics",
    image: "/listings/macbook-pro-m3-max.png",
    shippingCost: 28,
    shippingMethod: "UPS Ground",
    weight: 7,
    dimensions: "14 × 10 × 3",
    insurance: true,
    insuranceCost: 37,
    isDemo: true
  }
];

export default function CloserNet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiInput, setAiInput] = useState({ title: "", category: "Audio" });
  const [showGrokPrompt, setShowGrokPrompt] = useState(false);
  const [grokPrompt, setGrokPrompt] = useState("");

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");

  const categories = ["All", "Audio", "Electronics", "Photography", "Collectibles", "Clothes", "Books", "Vinyl", "DVD", "CDs", "Other"];

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("waitlist-email")?.focus();
    }, 400);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;

    setWaitlistStatus("loading");
    setWaitlistMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setWaitlistStatus("error");
        setWaitlistMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setWaitlistStatus("success");
      setWaitlistMessage(data.message);
      setWaitlistEmail("");
    } catch {
      setWaitlistStatus("error");
      setWaitlistMessage("Something went wrong. Please try again.");
    }
  };

  const filteredListings = DEMO_LISTINGS.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCloserValue = () => {
    const { title, category } = aiInput;
    let basePrice = 70;
    const basePrices: { [key: string]: number } = {
      Audio: 200, Electronics: 900, Photography: 650, Collectibles: 380,
      Clothes: 50, Books: 25, Vinyl: 40, DVD: 14, CDs: 16, Other: 55
    };
    basePrice = basePrices[category] || 70;

    const lower = title.toLowerCase();
    if (lower.includes("leica")) basePrice *= 2.3;
    if (lower.includes("macbook")) basePrice *= 1.75;
    if (lower.includes("headphones")) basePrice *= 1.3;
    if (lower.includes("vinyl")) basePrice *= 1.35;

    const low = Math.round(basePrice * 0.82);
    const high = Math.round(basePrice * 1.18);
    setAiResult({
      low,
      high,
      message: `Prototype estimate only — uses sample category averages, not live market data. Illustrative range for ${category.toLowerCase()}: $${low} – $${high}.`
    });
  };

  const generateResearchPrompt = () => {
    const prompt = `I'm researching a fair price for a "${aiInput.title}" (${aiInput.category}). What price range would you expect for a used item in good condition based on current market comps?`;
    setGrokPrompt(prompt);
    setShowGrokPrompt(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <div className="text-2xl font-semibold tracking-tight">CloserNet</div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#how" className="hover:text-zinc-400">How it Works</a>
            <a href="#value" className="hover:text-zinc-400">CloserValue AI</a>
            <a href="#fees" className="hover:text-zinc-400">Fees</a>
            <a href="#compare" className="hover:text-zinc-400">Compare</a>
            <a href="#faq" className="hover:text-zinc-400">FAQ</a>
            <button onClick={scrollToWaitlist} className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200">
              Join the Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="waitlist" className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter mb-6">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          A simpler peer-to-peer marketplace. Only ~5% total fees.<br />
          Keep more of your money with built-in escrow protection.
        </p>

        <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="waitlist-email"
              type="email"
              required
              placeholder="Enter your email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              disabled={waitlistStatus === "loading"}
              className="flex-1 bg-zinc-900 border border-zinc-700 px-5 py-3.5 rounded-full text-base placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={waitlistStatus === "loading"}
              className="px-8 py-3.5 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-200 disabled:opacity-50 whitespace-nowrap"
            >
              {waitlistStatus === "loading" ? "Joining…" : "Get Early Access"}
            </button>
          </div>
          {waitlistMessage && (
            <p className={`mt-4 text-sm ${waitlistStatus === "error" ? "text-red-400" : "text-green-400"}`}>
              {waitlistMessage}
            </p>
          )}
          <p className="mt-3 text-xs text-zinc-500">
            Be first to sell when checkout launches. No spam — just launch updates.
          </p>
        </form>

        <button onClick={() => document.getElementById('value')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 border border-zinc-700 rounded-full text-lg hover:bg-zinc-900">
          Try CloserValue AI
        </button>
      </section>

      {/* How it Works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-4">How CloserNet Works</h2>
        <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
          Join the waitlist now. When we launch, create a free seller account, list your item,
          and let escrow handle payment security from day one.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Create Account", desc: "Sign up free with email. Verify identity before your first sale goes live." },
            { num: "02", title: "List Your Item", desc: "Add photos, price, weight & dimensions. We estimate USPS, UPS & FedEx rates." },
            { num: "03", title: "Secure Escrow", desc: "Buyer pays into escrow at checkout. You ship only after payment is secured." },
            { num: "04", title: "Get Paid", desc: "Funds release after delivery confirmation. You keep ~95% after our ~5% total fee." }
          ].map((step, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="text-5xl font-bold text-zinc-700 mb-6">{step.num}</div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee Breakdown */}
      <section id="fees" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-4">Transparent Fee Breakdown</h2>
        <p className="text-center text-zinc-400 mb-10">No hidden charges. Here is exactly what a seller pays on a completed sale.</p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="text-left p-4 font-medium">Fee type</th>
                <th className="text-right p-4 font-medium">Rate</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">What it covers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ["CloserNet platform fee", "3.0%", "Marketplace, escrow, listing tools"],
                ["Payment processing", "2.0%", "Card/bank processing (passed through at cost)"],
                ["Total seller fee", "~5.0%", "Combined — you keep ~95% of the sale price"],
              ].map(([fee, rate, covers], i) => (
                <tr key={i} className={i === 2 ? "bg-zinc-950" : ""}>
                  <td className={`p-4 ${i === 2 ? "font-semibold text-white" : ""}`}>{fee}</td>
                  <td className={`p-4 text-right ${i === 2 ? "font-semibold text-green-400" : "text-green-400"}`}>{rate}</td>
                  <td className="p-4 text-zinc-400 hidden md:table-cell">{covers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center">
          {[
            { price: 50, fee: 2.50, payout: 47.50 },
            { price: 200, fee: 10, payout: 190 },
            { price: 1000, fee: 50, payout: 950 },
          ].map((ex) => (
            <div key={ex.price} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-zinc-400 text-sm mb-1">${ex.price} sale</div>
              <div className="text-2xl font-semibold text-green-400">${ex.payout.toFixed(2)}</div>
              <div className="text-xs text-zinc-500 mt-1">after ${ex.fee.toFixed(2)} total fees</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">
          Shipping and optional insurance are paid by the buyer at checkout and are not deducted from your sale price.
        </p>
      </section>

      {/* CloserValue AI */}
      <section id="value" className="max-w-4xl mx-auto px-6 py-14 border-t border-zinc-800 bg-zinc-900">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold mb-3">CloserValue AI</h2>
          <p className="text-zinc-300 max-w-lg mx-auto mb-4">
            Enter your item title and category — we match it against sample averages to suggest a fair price range before you list.
          </p>
          <div className="inline-block px-4 py-1 bg-amber-900/40 border border-amber-700/50 text-amber-200 rounded-full text-sm mb-4">
            Prototype — not connected to live pricing data
          </div>
          <p className="text-zinc-400 max-w-lg mx-auto">
            A preview pricing helper that uses sample category averages to suggest a ballpark range.
            It does not pull real-time comps — use it as a starting point, not a final price.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="space-y-4">
            <input type="text" placeholder="Item title" value={aiInput.title} onChange={(e) => setAiInput({...aiInput, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            <select value={aiInput.category} onChange={(e) => setAiInput({...aiInput, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={getCloserValue} className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">
              Get Prototype Estimate
            </button>
          </div>

          {aiResult && (
            <div className="mt-6 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs uppercase tracking-wide text-amber-400 mb-1">Prototype estimate only</div>
              <div className="text-3xl font-semibold mb-2">${aiResult.low} – ${aiResult.high}</div>
              <p className="text-sm text-zinc-400 mb-4">{aiResult.message}</p>
              <button onClick={generateResearchPrompt} className="w-full py-2.5 border border-zinc-700 rounded-full text-sm hover:bg-zinc-800">
                Copy research prompt (optional)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-4">Why Sellers Choose CloserNet</h2>
        <p className="text-center text-zinc-400 mb-12">See how we compare to the biggest alternatives.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">CloserNet</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ ~5% total fees</li>
              <li>✓ Built-in escrow protection</li>
              <li>✓ Real shipping rates (USPS, UPS, FedEx)</li>
              <li>✓ Insurance options available</li>
              <li>✓ ~95% payout to seller</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">eBay</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>13%+ total fees</li>
              <li>Limited or paid escrow</li>
              <li>Complex seller rules</li>
              <li>~87% payout to seller</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Facebook Marketplace</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Free (but no protection)</li>
              <li>No escrow — high scam risk</li>
              <li>Mostly local/in-person only</li>
              <li>No built-in shipping tools</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">OfferUp</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Low fees but limited protection</li>
              <li>Mostly local transactions</li>
              <li>Weak buyer/seller safeguards</li>
              <li>Basic shipping options</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">
          * eBay fee comparison based on standard category final value fee + payment processing (~13.25% total), per{" "}
          <a href="https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822" className="underline hover:text-zinc-400" target="_blank" rel="noopener noreferrer">
            eBay seller fees
          </a>
          , June 2026.
        </p>
      </section>

      {/* Trust & Safety */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800 bg-zinc-900">
        <h2 className="text-4xl font-semibold text-center mb-12">Trust & Safety Built In</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Escrow Protection</h3>
            <p className="text-zinc-400">Money is held safely until the buyer confirms they received the item. No more shipping without payment security.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Fair for Both Sides</h3>
            <p className="text-zinc-400">Buyers get protection. Sellers get paid reliably. We built CloserNet to reduce risk for everyone involved.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Shipping + Insurance</h3>
            <p className="text-zinc-400">Real-time rate estimates from USPS, UPS, and FedEx. Optional insurance protects high-value items in transit.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            ["How much does it cost to sell?", "About 5% total: 3% CloserNet platform fee + ~2% payment processing. See the fee breakdown above for examples."],
            ["How do I get early access?", "Join the waitlist with your email at the top of this page. We'll notify you when seller accounts and checkout go live."],
            ["How does escrow work?", "The buyer pays into escrow when they purchase. You ship the item. Funds are released once the buyer confirms delivery."],
            ["How are shipping rates calculated?", "Enter your item's weight and dimensions. We estimate rates from USPS, UPS, and FedEx using billable weight (actual vs dimensional)."],
            ["What is CloserValue AI?", "A prototype tool using sample category averages — not live market data. Use it for a ballpark range and verify with your own research before listing."],
          ].map(([question, answer], i) => (
            <div key={i} className="border border-zinc-800 rounded-2xl p-6">
              <h4 className="font-semibold text-lg mb-2">{question}</h4>
              <p className="text-zinc-400">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search + Filter + Listings */}
      <section className="max-w-6xl mx-auto px-6 py-8 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg md:w-52">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-semibold">Browse Listings</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Sample listings below show what the marketplace will look like at launch.
            </p>
          </div>
          <button onClick={scrollToWaitlist} className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 whitespace-nowrap">
            Join the Waitlist
          </button>
        </div>

        {filteredListings.length === 0 ? (
          <p className="text-center text-zinc-400 py-10">No listings found.</p>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-zinc-900 border border-amber-900/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
              <div className="relative">
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-amber-900/90 border border-amber-700 text-amber-100 rounded-full">
                  Sample listing
                </span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{listing.category}</span>
                  <span className="font-semibold text-2xl">${listing.price}</span>
                </div>
                <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{listing.description}</p>

                <div className="text-sm space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Shipping</span>
                    <span>${listing.shippingCost} ({listing.shippingMethod})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Weight / Dimensions</span>
                    <span>{listing.weight} lbs • {listing.dimensions} in</span>
                  </div>
                  {listing.insurance && (
                    <div className="flex justify-between text-green-400">
                      <span>Insurance</span>
                      <span>+${listing.insuranceCost}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={scrollToWaitlist}
                  className="w-full py-2.5 border border-zinc-700 rounded-full text-sm hover:bg-zinc-800 transition-colors"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      <footer className="border-t border-zinc-800 py-10 text-center text-sm text-zinc-500">
        <p className="mb-3">CloserNet • Lower Fees • Escrow Protected • Smart Shipping</p>
        <div className="flex justify-center gap-6">
          <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
          <a href="mailto:support@closernet.net" className="hover:text-zinc-300">Contact</a>
        </div>
      </footer>

      {/* Grok Prompt Modal */}
      {showGrokPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-lg mx-4">
            <h3 className="text-xl font-semibold mb-4">Research prompt (optional)</h3>
            <p className="text-zinc-400 text-sm mb-4">Copy this prompt to research comparable prices elsewhere.</p>
            <div className="bg-zinc-950 p-4 rounded-lg text-sm mb-6 border border-zinc-800">{grokPrompt}</div>
            <div className="flex gap-3">
              <button onClick={() => { navigator.clipboard.writeText(grokPrompt); alert("Copied! Now paste it in our chat."); }} className="flex-1 py-3 bg-white text-black rounded-full font-medium">Copy Message</button>
              <button onClick={() => setShowGrokPrompt(false)} className="flex-1 py-3 border border-zinc-700 rounded-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}