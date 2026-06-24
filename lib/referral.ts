const REF_RE = /^[a-z0-9][a-z0-9_-]{0,47}$/i;

export function sanitizeReferral(ref: string | null | undefined): string | undefined {
  if (!ref) return undefined;
  const trimmed = ref.trim().toLowerCase();
  if (!trimmed || !REF_RE.test(trimmed)) return undefined;
  return trimmed;
}