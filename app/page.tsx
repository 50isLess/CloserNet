'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FeeCalculator } from '@/components/FeeCalculator';
import { ForumPartners } from '@/components/ForumPartners';
import { FormLabel } from '@/components/FormField';
import { ListingImage } from '@/components/ListingImage';
import { Navbar } from '@/components/Navbar';
import type { CloserValueResult } from '@/lib/closervalue';
import { sanitizeReferral } from '@/lib/referral';

const REF_STORAGE_KEY = 'closernet_ref';

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
  },
  {
    id: 4,
    title: "Audio-Technica AT-LP120XUSB Turntable",
    price: 275,
    description: "Direct-drive turntable in excellent condition. USB output, new stylus, original box.",
    category: "Audio",
    image: "/listings/audio-technica-turntable.jpg",
    shippingCost: 18,
    shippingMethod: "UPS Ground",
    weight: 14,
    dimensions: "18 × 15 × 7",
    insurance: true,
    insuranceCost: 5,
    isDemo: true
  }
];

export default function CloserNet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [aiResult, setAiResult] = useState<CloserValueResult | null>(null);
  const [aiInput, setAiInput] = useState({ title: "", category: "Audio" });
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "error">("idle");
  const [aiError, setAiError] = useState("");
  const [showGrokPrompt, setShowGrokPrompt] = useState(false);
  const [grokPrompt, setGrokPrompt] = useState("");

  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "", price: "", description: "", category: "Audio", image: "",
    weight: "", length: "", width: "", height: "", insurance: false, selectedShipping: ""
  });
  const [shippingRates, setShippingRates] = useState<{ method: string; cost: number; days: string }[]>([]);

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [waitlistRef, setWaitlistRef] = useState<string | undefined>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = sanitizeReferral(params.get("ref"));
    if (fromUrl) {
      localStorage.setItem(REF_STORAGE_KEY, fromUrl);
      setWaitlistRef(fromUrl);
      return;
    }
    const stored = sanitizeReferral(localStorage.getItem(REF_STORAGE_KEY));
    if (stored) setWaitlistRef(stored);
  }, []);

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
        body: JSON.stringify({ email: waitlistEmail, ref: waitlistRef }),
      });
      const data = await res.json();

      if (!res.ok) {
        setWaitlistStatus("error");
        setWaitlistMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setWaitlistStatus("success");
      setWaitlistMessage(data.message ?? "You're on the waitlist!");
      setWaitlistEmail("");
    } catch {
      setWaitlistStatus("error");
      setWaitlistMessage("Something went wrong. Please try again.");
    }
  };

  const calculateShippingRates = (weight: number, length: number, width: number, height: number) => {
    if (!weight || weight <= 0) return [];
    const dimensionalWeight = Math.ceil((length * width * height) / 166);
    const billableWeight = Math.max(weight, dimensionalWeight);
    return [
      { method: "USPS Ground", cost: Math.round(Math.max(7, billableWeight * 3.6)), days: "2–5 business days" },
      { method: "UPS Ground", cost: Math.round(Math.max(9, billableWeight * 4.3)), days: "1–5 business days" },
      { method: "FedEx Ground", cost: Math.round(Math.max(10, billableWeight * 4.6)), days: "1–5 business days" },
    ];
  };

  useEffect(() => {
    const w = parseFloat(newItem.weight) || 0;
    const l = parseFloat(newItem.length) || 0;
    const wi = parseFloat(newItem.width) || 0;
    const h = parseFloat(newItem.height) || 0;
    if (w > 0 && l > 0 && wi > 0 && h > 0) {
      setShippingRates(calculateShippingRates(w, l, wi, h));
    } else {
      setShippingRates([]);
      if (!w || !l || !wi || !h) {
        setNewItem((prev) => (prev.selectedShipping ? { ...prev, selectedShipping: "" } : prev));
      }
    }
  }, [newItem.weight, newItem.length, newItem.width, newItem.height]);

  const hasShippingDimensions =
    Boolean(newItem.weight) &&
    Boolean(newItem.length) &&
    Boolean(newItem.width) &&
    Boolean(newItem.height);

  const canPostPreview =
    Boolean(newItem.title.trim()) &&
    Boolean(newItem.price) &&
    hasShippingDimensions &&
    Boolean(newItem.selectedShipping);

  const postPreviewHint = (() => {
    if (!newItem.title.trim()) return "Enter an item title.";
    if (!newItem.price) return "Enter a price.";
    if (!hasShippingDimensions) return "Enter weight and dimensions (L × W × H) to calculate shipping rates.";
    if (shippingRates.length === 0) return "Check that weight and dimensions are valid numbers.";
    if (!newItem.selectedShipping) return "Select a shipping method below.";
    return "";
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPostPreview) return;

    const w = parseFloat(newItem.weight) || 1;
    const l = parseFloat(newItem.length) || 8;
    const wi = parseFloat(newItem.width) || 6;
    const h = parseFloat(newItem.height) || 4;
    const rates = calculateShippingRates(w, l, wi, h);
    const selectedRate = rates.find(r => r.method === newItem.selectedShipping);
    const itemValue = parseFloat(newItem.price);
    const insuranceCost = newItem.insurance ? Math.ceil(itemValue * 0.015) : 0;

    const listing: Listing = {
      id: Date.now(),
      title: newItem.title,
      price: itemValue,
      description: newItem.description,
      category: newItem.category,
      image: newItem.image.trim(),
      shippingCost: selectedRate ? selectedRate.cost : 10,
      shippingMethod: newItem.selectedShipping,
      weight: w,
      dimensions: `${l} × ${wi} × ${h}`,
      insurance: newItem.insurance,
      insuranceCost,
    };

    setUserListings([listing, ...userListings]);
    setNewItem({ title: "", price: "", description: "", category: "Audio", image: "", weight: "", length: "", width: "", height: "", insurance: false, selectedShipping: "" });
    setShippingRates([]);
    setShowForm(false);
  };

  const generateResearchPrompt = () => {
    const prompt = `I'm researching a fair price for a "${aiInput.title}" (${aiInput.category}). What price range would you expect for a used item in good condition based on current market comps on eBay, Mercari, and Facebook Marketplace?`;
    setGrokPrompt(prompt);
    setShowGrokPrompt(true);
  };

  const allListings = [...userListings, ...DEMO_LISTINGS];

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCloserValue = async () => {
    const { title, category } = aiInput;
    if (!title.trim()) return;

    setAiStatus("loading");
    setAiError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/closervalue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAiStatus("error");
        const hint = typeof data.hint === "string" ? data.hint : "";
        setAiError(
          hint
            ? `${data.error ?? "Something went wrong."} ${hint}`
            : (data.error ?? "Something went wrong. Please try again.")
        );
        return;
      }

      setAiResult(data as CloserValueResult);
      setAiStatus("idle");
    } catch {
      setAiStatus("error");
      setAiError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <Navbar onJoinWaitlist={scrollToWaitlist} />

      {/* Hero */}
      <section id="waitlist" className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-6 text-balance">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 text-balance">
          A simpler peer-to-peer marketplace. Only ~7.5% total fees, including Stripe escrow.<br />
          That&apos;s roughly half what eBay keeps — with real payment protection built in.
        </p>

        {waitlistStatus === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="max-w-md mx-auto mb-6 p-6 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl text-left"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-lg">
                ✓
              </span>
              <div>
                <p className="font-medium text-emerald-100 mb-1">You&apos;re on the waitlist</p>
                <p className="text-sm text-emerald-200/90 leading-relaxed">{waitlistMessage}</p>
                <p className="text-xs text-emerald-300/70 mt-3">
                  We&apos;ll only email you about launch updates — no spam.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setWaitlistStatus("idle"); setWaitlistMessage(""); }}
              className="mt-4 text-sm text-emerald-300/80 hover:text-emerald-200 underline underline-offset-2"
            >
              Join with another email
            </button>
          </div>
        ) : (
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
            {waitlistStatus === "error" && waitlistMessage && (
              <p role="alert" className="mt-4 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                {waitlistMessage}
              </p>
            )}
            <p className="mt-3 text-xs text-zinc-500">
              Be first to sell when checkout launches. No spam — just launch updates.
            </p>
          </form>
        )}

        <button onClick={() => document.getElementById('value')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 sm:px-8 py-3 sm:py-3.5 border border-zinc-700 rounded-full text-base sm:text-lg hover:bg-zinc-900">
          Try CloserValue AI
        </button>
      </section>

      {/* How it Works */}
      <section id="how" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">How CloserNet Works</h2>
        <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
          Join the waitlist now. When we launch, create a free seller account, list your item,
          and let escrow handle payment security from day one.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: "01", title: "Create Account", desc: "Sign up free with email. Verify identity before your first sale goes live." },
            { num: "02", title: "List Your Item", desc: "Add photos, price, weight & dimensions. We estimate USPS, UPS & FedEx rates." },
            { num: "03", title: "Secure Escrow", desc: "Buyer pays at checkout. Stripe holds funds in escrow until delivery is confirmed." },
            { num: "04", title: "Get Paid", desc: "Funds release after delivery confirmation. You keep ~92.5% after our ~7.5% total fee." }
          ].map((step, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              <div className="text-4xl sm:text-5xl font-bold text-zinc-700 mb-4 sm:mb-6">{step.num}</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How Escrow Works */}
      <section id="escrow" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">How Escrow Works</h2>
        <p className="text-center text-zinc-400 mb-4 max-w-2xl mx-auto">
          Neither side takes the risk alone. Stripe acts as our escrow agent — payment stays locked until the deal is done.
        </p>
        <p className="text-center text-zinc-500 text-sm mb-12 max-w-xl mx-auto">
          CloserNet facilitates the transaction; Stripe holds and releases funds according to delivery confirmation.
        </p>

        <div className="hidden lg:flex items-center justify-center gap-2">
          {[
            { step: "1", title: "Buyer Pays", desc: "Checkout secures the full amount via Stripe.", icon: "💳", role: "Buyer" },
            { step: "2", title: "Funds Held", desc: "Stripe holds payment in escrow — not the seller.", icon: "🔒", role: "Stripe" },
            { step: "3", title: "Seller Ships", desc: "Seller ships only after payment is secured.", icon: "📦", role: "Seller" },
            { step: "4", title: "Funds Released", desc: "Seller gets paid after delivery is confirmed.", icon: "✓", role: "Complete" },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex items-center">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-52 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div className="text-xs uppercase tracking-wide text-green-400 mb-2">{item.role}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-snug">{item.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="flex items-center px-3 text-zinc-600" aria-hidden="true">
                  <div className="w-8 border-t border-dashed border-zinc-600" />
                  <span className="text-xl mx-1">→</span>
                  <div className="w-8 border-t border-dashed border-zinc-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden space-y-4 max-w-sm mx-auto">
          {[
            { step: "1", title: "Buyer Pays", desc: "Checkout secures the full amount via Stripe.", icon: "💳" },
            { step: "2", title: "Funds Held", desc: "Stripe holds payment in escrow — not the seller.", icon: "🔒" },
            { step: "3", title: "Seller Ships", desc: "Seller ships only after payment is secured.", icon: "📦" },
            { step: "4", title: "Funds Released", desc: "Seller gets paid after delivery is confirmed.", icon: "✓" },
          ].map((item, i, arr) => (
            <div key={item.step}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Step {item.step}</div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex justify-center py-2 text-zinc-600" aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-500 mt-10 max-w-xl mx-auto">
          If something goes wrong, either party can open a dispute before funds are released.
          See our{" "}
          <Link href="/terms" className="underline hover:text-zinc-400">Terms of Service</Link>
          {" "}for full escrow and dispute policies.
        </p>
      </section>

      {/* Fee Breakdown */}
      <section id="fees" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">Transparent Fee Breakdown</h2>
        <p className="text-center text-zinc-400 mb-4">No hidden charges. Here is exactly what a seller pays on a completed sale.</p>
        <p className="text-center text-zinc-500 text-sm mb-10 max-w-xl mx-auto">
          ~7.5% all-in is roughly half the 13–15%+ eBay keeps on a typical sale.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8 overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead className="bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="text-left p-4 font-medium">Fee type</th>
                <th className="text-right p-4 font-medium">Rate</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">What it covers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ["CloserNet platform fee", "4.5%", "Marketplace, listing tools, support"],
                ["Stripe escrow & processing", "3.0%", "Escrow hold, payment processing (via Stripe)"],
                ["Total seller fee", "~7.5%", "Combined — you keep ~92.5% of the sale price"],
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

        <FeeCalculator />

        <p className="text-center text-xs text-zinc-500 mt-6">
          Shipping and optional insurance are paid by the buyer at checkout and are not deducted from your sale price.
        </p>
      </section>

      {/* CloserValue AI */}
      <section id="value" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-900 to-zinc-950 pointer-events-none" />
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs mb-4">
            Powered by Grok
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3">CloserValue AI</h2>
          <p className="text-zinc-300 max-w-lg mx-auto">
            Enter your item title and category — Grok analyzes market comps to suggest a fair price range before you list.
          </p>
        </div>

        <div className="relative max-w-md mx-auto bg-zinc-950/90 border border-zinc-700/80 rounded-2xl p-5 sm:p-8 shadow-xl shadow-black/40 ring-1 ring-white/5">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Item title (e.g. Sony WH-1000XM5)"
              value={aiInput.title}
              onChange={(e) => setAiInput({ ...aiInput, title: e.target.value })}
              disabled={aiStatus === "loading"}
              className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/30 disabled:opacity-50 transition-colors"
            />
            <select
              value={aiInput.category}
              onChange={(e) => setAiInput({ ...aiInput, category: e.target.value })}
              disabled={aiStatus === "loading"}
              className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-emerald-600/50 disabled:opacity-50 transition-colors"
            >
              {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button
              onClick={getCloserValue}
              disabled={aiStatus === "loading" || !aiInput.title.trim()}
              className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {aiStatus === "loading" ? "Grok is analyzing…" : "Get Estimate"}
            </button>
          </div>

          {aiStatus === "loading" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Querying Grok for market comps…
            </div>
          )}

          {aiError && (
            <p className="mt-4 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">{aiError}</p>
          )}

          {aiResult && (
            <div className="mt-6 p-5 bg-zinc-900 border border-emerald-800/40 rounded-xl ring-1 ring-emerald-900/20">
              {aiResult.confidence && (
                <div className="text-xs uppercase tracking-wide text-emerald-400/80 mb-2">
                  Confidence: {aiResult.confidence}
                </div>
              )}
              <div className="text-3xl font-semibold mb-2 text-white">${aiResult.low} – ${aiResult.high}</div>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{aiResult.reason}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <button
                    onClick={generateResearchPrompt}
                    className="w-full py-2.5 border border-zinc-600 rounded-full text-sm hover:bg-zinc-800 transition-colors"
                  >
                    Ask Grok
                  </button>
                  <p className="text-xs text-zinc-500 text-center mt-1.5">
                    Copy a research prompt for Grok chat
                  </p>
                </div>
                <button
                  onClick={() => { setShowForm(true); document.getElementById("post")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="flex-1 py-2.5 bg-zinc-800 border border-zinc-600 rounded-full text-sm hover:bg-zinc-700 transition-colors self-start"
                >
                  Preview Listing
                </button>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed mt-4">
                * AI estimate powered by Grok via xAI. Not a guarantee — verify before listing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">Why Sellers Choose CloserNet</h2>
        <p className="text-center text-zinc-400 mb-12">See how we compare to the biggest alternatives.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">CloserNet</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ ~7.5% total fees (incl. Stripe escrow)</li>
              <li>✓ Stripe-powered escrow protection</li>
              <li>✓ Roughly half what eBay keeps</li>
              <li>✓ Real shipping rates (USPS, UPS, FedEx)</li>
              <li>✓ ~92.5% payout to seller</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">eBay</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>13–15%+ total fees</li>
              <li>Limited or paid escrow</li>
              <li>Complex seller rules</li>
              <li>~85–87% payout to seller</li>
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
            <h3 className="text-xl font-semibold mb-4">Mercari</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>10%+ selling fee</li>
              <li>No built-in escrow</li>
              <li>Buyer protection varies by case</li>
              <li>~90% payout to seller</li>
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Depop</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>~10%+ total fees</li>
              <li>No built-in escrow</li>
              <li>Fashion &amp; vintage focus</li>
              <li>~90% payout to seller</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6 max-w-3xl mx-auto leading-relaxed">
          * eBay all-in fees for US sellers without a Store: 13.25% final value fee on the first $7,500 of each sale
          (category rates vary — e.g. 6.7% musical instruments, 15.3% books), plus a $0.40 per-order fee on sales over $10,
          applied to item price + shipping. Most standard categories land at 13.5–15%+ before promoted listings.
          Per{" "}
          <a href="https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822" className="underline hover:text-zinc-400" target="_blank" rel="noopener noreferrer">
            eBay&apos;s 2026 fee schedule
          </a>
          , June 2026. Mercari charges a 10% selling fee plus payment processing on item price and shipping per{" "}
          <a href="https://www.mercari.com/us/help_center/article/160/" className="underline hover:text-zinc-400" target="_blank" rel="noopener noreferrer">
            Mercari&apos;s fee policy
          </a>
          , June 2026.
        </p>
      </section>

      <ForumPartners />

      {/* Trust & Safety */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800 bg-zinc-900">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8 sm:mb-12">Trust & Safety Built In</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Escrow Protection</h3>
            <p className="text-zinc-400">Stripe holds funds in escrow until the buyer confirms they received the item. No more shipping without payment security.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Fair for Both Sides</h3>
            <p className="text-zinc-400">Buyers get protection. Sellers get paid reliably. We built CloserNet to reduce risk for everyone involved.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Shipping + Insurance</h3>
            <p className="text-zinc-400">Real-time rate estimates from USPS, UPS, and FedEx. Optional insurance protects high-value items in transit.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            ["How much does it cost to sell?", "About 7.5% total: 4.5% CloserNet platform fee + 3% Stripe escrow & payment processing. That's roughly half what eBay keeps. See the fee breakdown above for examples."],
            ["How do I post an item?", "Seller accounts and checkout aren't live yet. Join the waitlist at the top of this page with your email — we'll invite early sellers when listing and escrow checkout launch."],
            ["How does escrow work?", "Buyer pays at checkout and funds are held by Stripe, our escrow agent — not the seller. CloserNet facilitates the transaction; Stripe secures and releases payment after the buyer confirms delivery. See the How Escrow Works section above for the full flow."],
            ["What happens if the buyer claims the item wasn't as described?", "Either party can open a dispute before funds are released. We may ask for photos, tracking, and messages from both sides, then decide on a full refund, partial refund, or release to the seller based on the evidence. Chargebacks opened outside this process may result in account suspension."],
            ["How are shipping rates calculated?", "Enter your item's weight and dimensions. We estimate rates from USPS, UPS, and FedEx using billable weight (actual vs dimensional)."],
            ["What is CloserValue AI?", "An AI pricing helper powered by Grok that estimates a fair resale range based on your item title, category, and market comps. Use it as a starting point and verify with your own research before listing."],
            ["Can forums or communities partner with CloserNet?", "Yes. Share a custom link like closernet.net/?ref=yourforum — signups are tagged automatically. Download the escrow badge from the Forums section and email support@closernet.net to discuss a pilot."],
          ].map(([question, answer], i) => (
            <div key={i} className="border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <h4 className="font-semibold text-lg mb-2">{question}</h4>
              <p className="text-zinc-400">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search + Filter + Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg md:w-52">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Browse Listings</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Sample listings below show what the marketplace will look like at launch.
              {userListings.length > 0 && <> You have {userListings.length} preview listing{userListings.length !== 1 ? "s" : ""}.</>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setShowForm(true); document.getElementById("post")?.scrollIntoView({ behavior: "smooth" }); }} className="px-5 py-2.5 border border-zinc-600 rounded-full text-sm hover:bg-zinc-900 whitespace-nowrap">
              Post Item (Preview)
            </button>
            <button onClick={scrollToWaitlist} className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 whitespace-nowrap">
              Join the Waitlist
            </button>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <p className="text-center text-zinc-400 py-10">No listings found.</p>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className={`bg-zinc-900 border rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors ${listing.isDemo ? "border-amber-900/50" : "border-zinc-700 ring-1 ring-white/5"}`}>
              <div className="relative">
                <ListingImage src={listing.image} alt={listing.title} />
                {listing.isDemo ? (
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-amber-900/90 border border-amber-700 text-amber-100 rounded-full">
                    Sample listing
                  </span>
                ) : (
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-zinc-800/90 border border-zinc-600 text-zinc-200 rounded-full">
                    Your preview
                  </span>
                )}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full shrink-0">{listing.category}</span>
                  <span className="font-semibold text-xl sm:text-2xl shrink-0">${listing.price}</span>
                </div>
                <h3 className="font-semibold text-lg sm:text-xl mb-2 break-words">{listing.title}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{listing.description}</p>

                <div className="text-sm space-y-2 mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                    <span className="text-zinc-400">Shipping</span>
                    <span className="text-zinc-200 break-words sm:text-right">${listing.shippingCost} ({listing.shippingMethod})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                    <span className="text-zinc-400">Weight / Dimensions</span>
                    <span className="text-zinc-200">{listing.weight} lbs • {listing.dimensions} in</span>
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

      {/* Post Item Preview Form */}
      <section id="post" className="max-w-xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">Post an Item</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Preview flow — saves locally on this page until checkout launches. Fields marked{" "}
              <span className="text-red-400">*</span> are required.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 whitespace-nowrap"
          >
            {showForm ? "Close Form" : "Open Form"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-8 space-y-5 shadow-lg shadow-black/20">
            <div>
              <FormLabel htmlFor="post-title" required>Item title</FormLabel>
              <input
                id="post-title"
                type="text"
                placeholder="e.g. Sony WH-1000XM5"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="post-price" required>Price (USD)</FormLabel>
              <input
                id="post-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500"
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="post-category" required>Category</FormLabel>
              <select
                id="post-category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500"
                required
              >
                {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <FormLabel required hint="Needed to estimate USPS, UPS, and FedEx rates.">
                Weight &amp; dimensions
              </FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <input
                  id="post-weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Weight (lbs)"
                  aria-label="Weight in pounds"
                  value={newItem.weight}
                  onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                  className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" min="0" placeholder="L (in)" aria-label="Length in inches" value={newItem.length} onChange={(e) => setNewItem({ ...newItem, length: e.target.value })} className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500" required />
                  <input type="number" min="0" placeholder="W (in)" aria-label="Width in inches" value={newItem.width} onChange={(e) => setNewItem({ ...newItem, width: e.target.value })} className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500" required />
                  <input type="number" min="0" placeholder="H (in)" aria-label="Height in inches" value={newItem.height} onChange={(e) => setNewItem({ ...newItem, height: e.target.value })} className="bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500" required />
                </div>
              </div>
            </div>

            <div>
              <FormLabel required hint="Choose one rate after entering weight and dimensions.">
                Shipping method
              </FormLabel>
              {shippingRates.length > 0 ? (
                <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-4">
                  {shippingRates.map((rate) => (
                    <button
                      key={rate.method}
                      type="button"
                      onClick={() => setNewItem({ ...newItem, selectedShipping: rate.method })}
                      className={`w-full flex justify-between items-center p-3 rounded-lg mb-2 last:mb-0 transition-colors ${newItem.selectedShipping === rate.method ? "bg-white text-black" : "hover:bg-zinc-800"}`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{rate.method}</div>
                        <div className="text-xs opacity-70">{rate.days}</div>
                      </div>
                      <div className="font-semibold">${rate.cost}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 bg-zinc-950 border border-dashed border-zinc-700 rounded-lg p-4">
                  Enter weight and dimensions above to see estimated shipping rates.
                </p>
              )}
            </div>

            <div>
              <FormLabel optional>Shipping insurance</FormLabel>
              <label className="flex items-center gap-3 bg-zinc-950 border border-zinc-700 p-4 rounded-lg cursor-pointer">
                <input type="checkbox" checked={newItem.insurance} onChange={(e) => setNewItem({ ...newItem, insurance: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm text-zinc-300">Add insurance (recommended for items over $100)</span>
              </label>
            </div>

            <div>
              <FormLabel htmlFor="post-image" optional>Image URL</FormLabel>
              <input
                id="post-image"
                type="url"
                placeholder="https://…"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <FormLabel htmlFor="post-description" optional>Description</FormLabel>
              <textarea
                id="post-description"
                placeholder="Condition, included accessories, etc."
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg h-24 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {!canPostPreview && postPreviewHint && (
              <p className="text-sm text-amber-400/90 bg-amber-950/20 border border-amber-900/40 rounded-lg px-4 py-3" role="status">
                {postPreviewHint}
              </p>
            )}

            <button
              type="submit"
              disabled={!canPostPreview}
              className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Item (Preview)
            </button>
          </form>
        )}
      </section>

      <footer className="border-t border-zinc-800 py-10 px-4 text-center text-sm text-zinc-500">
        <p className="mb-3 text-balance">CloserNet • Lower Fees • Escrow Protected • Smart Shipping</p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6">
          <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
          <a href="mailto:support@closernet.net" className="hover:text-zinc-300">Contact</a>
        </div>
      </footer>

      {showGrokPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-semibold mb-2">Research prompt for Grok</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Copy this prompt, then paste it into{" "}
              <a
                href="https://grok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                Grok chat
              </a>{" "}
              for deeper pricing research.
            </p>
            <div className="bg-zinc-950 p-4 rounded-lg text-sm mb-6 border border-zinc-800 max-h-48 overflow-y-auto">{grokPrompt}</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { navigator.clipboard.writeText(grokPrompt); }} className="flex-1 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200">Copy Prompt</button>
              <a
                href="https://grok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 border border-zinc-700 rounded-full hover:bg-zinc-800 text-center"
              >
                Open Grok
              </a>
              <button onClick={() => setShowGrokPrompt(false)} className="flex-1 py-3 border border-zinc-700 rounded-full hover:bg-zinc-800">Close</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}