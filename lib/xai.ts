const XAI_KEY_ENV_NAMES = ["XAI_API_KEY", "GROK_API_KEY", "XAI_KEY"] as const;

export function getXaiApiKey(): string | undefined {
  for (const name of XAI_KEY_ENV_NAMES) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getXaiKeyDiagnostics() {
  const relatedEnvKeys = Object.keys(process.env)
    .filter((key) => /xai|grok/i.test(key))
    .sort();

  const checks = XAI_KEY_ENV_NAMES.map((name) => {
    const raw = process.env[name];
    const trimmed = raw?.trim();
    return {
      name,
      defined: raw !== undefined,
      length: raw?.length ?? 0,
      trimmedLength: trimmed?.length ?? 0,
      active: Boolean(trimmed),
    };
  });

  const activeName = checks.find((check) => check.active)?.name;

  return {
    vercelEnv: process.env.VERCEL_ENV ?? "unknown",
    resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    activeKeyName: activeName ?? null,
    expectedName: "XAI_API_KEY",
    checks,
    relatedEnvKeys,
  };
}