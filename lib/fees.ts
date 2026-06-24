/** CloserNet platform fee (seller side). */
export const PLATFORM_FEE_RATE = 0.045;

/** Stripe US card processing — 2.9% + $0.30 per charge. */
export const STRIPE_CARD_RATE = 0.029;
export const STRIPE_CARD_FIXED = 0.3;

/** Stripe Connect payout to seller bank — 0.25% + $0.25 per payout. */
export const STRIPE_PAYOUT_RATE = 0.0025;
export const STRIPE_PAYOUT_FIXED = 0.25;

/** Simplified headline rate shown in marketing copy. */
export const SIMPLIFIED_TOTAL_RATE = 0.075;

/** Rough eBay all-in estimate for US casual sellers (mid-range categories). */
export const EBAY_ESTIMATE_RATE = 0.135;

export interface FeeBreakdown {
  salePrice: number;
  platformFee: number;
  stripeProcessing: number;
  stripePayout: number;
  totalFees: number;
  netPayout: number;
  effectiveRate: number;
  simplifiedTotalFees: number;
  simplifiedNet: number;
  ebayFees: number;
  ebayNet: number;
  savingsVsEbay: number;
}

export function calculateSellerFees(salePrice: number): FeeBreakdown {
  const price = Math.max(0, salePrice);

  const platformFee = price * PLATFORM_FEE_RATE;
  const stripeProcessing = price * STRIPE_CARD_RATE + STRIPE_CARD_FIXED;
  const stripePayout = price * STRIPE_PAYOUT_RATE + STRIPE_PAYOUT_FIXED;
  const totalFees = platformFee + stripeProcessing + stripePayout;
  const netPayout = Math.max(0, price - totalFees);
  const effectiveRate = price > 0 ? totalFees / price : 0;

  const simplifiedTotalFees = price * SIMPLIFIED_TOTAL_RATE;
  const simplifiedNet = price - simplifiedTotalFees;

  const ebayFees = price * EBAY_ESTIMATE_RATE;
  const ebayNet = price - ebayFees;

  return {
    salePrice: price,
    platformFee,
    stripeProcessing,
    stripePayout,
    totalFees,
    netPayout,
    effectiveRate,
    simplifiedTotalFees,
    simplifiedNet,
    ebayFees,
    ebayNet,
    savingsVsEbay: netPayout - ebayNet,
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}