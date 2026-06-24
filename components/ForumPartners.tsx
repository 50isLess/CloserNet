"use client";

import { useState } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://closernet.net";

export function ForumPartners() {
  const [copied, setCopied] = useState<string | null>(null);
  const exampleRef = "yourforum";
  const partnerLink = `${SITE_URL}/?ref=${exampleRef}`;

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="forums" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-zinc-800">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs mb-4">
          Partner program
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3">Forums &amp; Communities</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Keep your community. Give members Stripe escrow checkout, fair fees, and less payment drama —
          without replacing your forum.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Safer member trades",
            desc: "Replace “PM me / Venmo” with escrow-backed checkout. Funds stay held until delivery is confirmed.",
          },
          {
            title: "Less mod workload",
            desc: "Fewer payment disputes in DMs. CloserNet handles checkout; your rules stay in the thread.",
          },
          {
            title: "Trackable referrals",
            desc: "Unique ?ref= links show which forums drive signups — groundwork for revenue share at launch.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 sm:p-8 mb-8">
        <h3 className="text-xl font-semibold mb-4">Get started in 3 steps</h3>
        <ol className="space-y-4 text-sm text-zinc-300">
          <li className="flex gap-3">
            <span className="text-zinc-500 font-mono shrink-0">01</span>
            <span>
              Pick a short forum ID (e.g. <code className="text-emerald-400">headfi</code>,{" "}
              <code className="text-emerald-400">vinylengine</code>) and share your link:
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-zinc-500 font-mono shrink-0">02</span>
            <span>Add the escrow badge to signatures, rules, or marketplace stickies.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-zinc-500 font-mono shrink-0">03</span>
            <span>
              Email{" "}
              <a href="mailto:support@closernet.net" className="text-white underline underline-offset-2">
                support@closernet.net
              </a>{" "}
              to discuss badges, embeds, or a pilot partnership.
            </span>
          </li>
        </ol>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <code className="flex-1 text-xs sm:text-sm bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 break-all">
            {partnerLink}
          </code>
          <button
            type="button"
            onClick={() => copy(partnerLink, "link")}
            className="px-5 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 whitespace-nowrap"
          >
            {copied === "link" ? "Copied!" : "Copy link template"}
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          Replace <code className="text-zinc-400">yourforum</code> with your community ID. Signups from that URL are
          tagged automatically.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h3 className="font-semibold mb-1">Forum badge</h3>
          <p className="text-sm text-zinc-400">SVG for signatures, rules pages, and marketplace stickies.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src="/partners/escrow-badge.svg"
            alt="Sell with CloserNet Escrow badge"
            className="h-12 w-auto"
          />
          <a
            href="/partners/escrow-badge.svg"
            download="closernet-escrow-badge.svg"
            className="px-5 py-2.5 border border-zinc-600 rounded-full text-sm hover:bg-zinc-900 whitespace-nowrap"
          >
            Download badge
          </a>
        </div>
      </div>
    </section>
  );
}