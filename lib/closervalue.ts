export interface CloserValueResult {
  low: number;
  high: number;
  message: string;
  reason?: string;
  confidence?: "low" | "medium" | "high";
}

export function parseCloserValueResponse(content: string): CloserValueResult {
  const cleaned = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in model response");
    parsed = JSON.parse(match[0]);
  }

  const low = Math.round(Number(parsed.low));
  const high = Math.round(Number(parsed.high));

  if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0 || high <= 0 || high < low) {
    throw new Error("Invalid price range in model response");
  }

  const message =
    typeof parsed.message === "string" && parsed.message.trim()
      ? parsed.message.trim()
      : `Suggested range for this item: $${low} – $${high}.`;

  const reason =
    typeof parsed.reason === "string" && parsed.reason.trim() ? parsed.reason.trim() : undefined;

  const confidence = parsed.confidence;
  const validConfidence =
    confidence === "low" || confidence === "medium" || confidence === "high"
      ? confidence
      : undefined;

  return { low, high, message, reason, confidence: validConfidence };
}

export const CLOSERVALUE_SYSTEM_PROMPT = `You are CloserValue AI, a pricing assistant for CloserNet, a US peer-to-peer used goods marketplace.
Estimate a fair USD resale price range for a used item in good condition sold by an individual seller.
When possible, ground your estimate in realistic market comps (eBay sold listings, Mercari, Facebook Marketplace, etc.).
Respond with ONLY valid JSON — no markdown, no extra text:
{"low": number, "high": number, "message": "one concise sentence summary", "reason": "2-3 sentences explaining comps and pricing logic", "confidence": "low"|"medium"|"high"}
Rules:
- low and high must be positive integers (USD)
- high must be >= low
- Assume US market unless the title implies otherwise
- Default condition: good/used working order
- Be realistic and conservative; this is guidance, not a guarantee`;