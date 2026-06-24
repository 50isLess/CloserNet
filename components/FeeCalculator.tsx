"use client";

import { useMemo, useState } from "react";
import {
  calculateSellerFees,
  formatPercent,
  formatUsd,
  SIMPLIFIED_TOTAL_RATE,
} from "@/lib/fees";

const PRESETS = [50, 200, 1000];

export function FeeCalculator() {
  const [salePrice, setSalePrice] = useState(200);

  const fees = useMemo(() => calculateSellerFees(salePrice), [salePrice]);

  const handlePriceChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    setSalePrice(Math.min(10000, Math.max(1, Math.round(parsed))));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Seller payout calculator</h3>
          <p className="text-sm text-zinc-400">
            Real Stripe math: 2.9% + $0.30 processing, plus Connect payout fees.
          </p>
        </div>
        <div className="flex gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSalePrice(preset)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                salePrice === preset
                  ? "bg-white text-black border-white"
                  : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
      </div>

      <label className="block mb-6">
        <span className="text-sm text-zinc-400 mb-2 block">Sale price</span>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <input
            type="range"
            min={10}
            max={5000}
            step={5}
            value={salePrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="flex-1 accent-emerald-500"
          />
          <div className="flex items-center gap-2 sm:w-36">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              min={1}
              max={10000}
              value={salePrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-right font-medium"
            />
          </div>
        </div>
      </label>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-950 border border-emerald-900/40 rounded-xl p-5 ring-1 ring-emerald-900/20">
          <div className="text-xs uppercase tracking-wide text-emerald-400/80 mb-1">You keep</div>
          <div className="text-3xl font-semibold text-emerald-300">{formatUsd(fees.netPayout)}</div>
          <div className="text-xs text-zinc-500 mt-2">
            {formatPercent(fees.effectiveRate)} effective fee on this sale
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Headline ~7.5% model</div>
          <div className="text-2xl font-semibold text-white">{formatUsd(fees.simplifiedNet)}</div>
          <div className="text-xs text-zinc-500 mt-2">
            {formatPercent(SIMPLIFIED_TOTAL_RATE)} flat — marketing estimate
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">eBay (~13.5% est.)</div>
          <div className="text-2xl font-semibold text-zinc-300">{formatUsd(fees.ebayNet)}</div>
          <div className="text-xs text-green-400/90 mt-2">
            +{formatUsd(fees.savingsVsEbay)} more on CloserNet
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="pb-3 font-medium">Fee line item</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr>
              <td className="py-3 text-zinc-300">CloserNet platform (4.5%)</td>
              <td className="py-3 text-right text-zinc-200">{formatUsd(fees.platformFee)}</td>
            </tr>
            <tr>
              <td className="py-3 text-zinc-300">Stripe card processing (2.9% + $0.30)</td>
              <td className="py-3 text-right text-zinc-200">{formatUsd(fees.stripeProcessing)}</td>
            </tr>
            <tr>
              <td className="py-3 text-zinc-300">Stripe Connect payout (0.25% + $0.25)</td>
              <td className="py-3 text-right text-zinc-200">{formatUsd(fees.stripePayout)}</td>
            </tr>
            <tr className="font-semibold text-white">
              <td className="py-3">Total fees</td>
              <td className="py-3 text-right text-red-300/90">{formatUsd(fees.totalFees)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-500 mt-5 leading-relaxed">
        Estimates for a US domestic card sale with one seller payout. Stripe also charges $2/month per seller
        who receives a payout that month (not included above). Shipping and insurance are paid by the buyer
        and are not deducted from your sale price. eBay comparison uses ~13.5% all-in — actual eBay fees vary
        by category.
      </p>
    </div>
  );
}