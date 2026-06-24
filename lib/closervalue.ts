export interface CloserValueResult {
  low: number;
  high: number;
  reason: string;
  message?: string;
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

  const reason =
    typeof parsed.reason === "string" && parsed.reason.trim()
      ? parsed.reason.trim()
      : typeof parsed.message === "string" && parsed.message.trim()
        ? parsed.message.trim()
        : `Suggested range for this item: $${low} – $${high}.`;

  const message =
    typeof parsed.message === "string" && parsed.message.trim() && parsed.message.trim() !== reason
      ? parsed.message.trim()
      : undefined;

  const confidence = parsed.confidence;
  const validConfidence =
    confidence === "low" || confidence === "medium" || confidence === "high"
      ? confidence
      : undefined;

  return { low, high, reason, message, confidence: validConfidence };
}