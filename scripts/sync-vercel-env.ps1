# Sync secrets from .env.local to the linked Vercel project.
# Run once: npx vercel login
# Then:    npm run sync-env

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
  Write-Error ".env.local not found. Copy .env.example and add your keys first."
}

$vars = @("XAI_API_KEY", "XAI_MODEL", "RESEND_API_KEY", "RESEND_FROM_EMAIL", "WAITLIST_NOTIFY_EMAIL")
$lines = Get-Content $envFile

foreach ($name in $vars) {
  $line = $lines | Where-Object { $_ -match "^$name=" } | Select-Object -First 1
  if (-not $line) { continue }

  $value = ($line -replace "^$name=", "").Trim()
  if (-not $value) { continue }

  Write-Host "Syncing $name to Vercel (Production)..."
  $value | npx vercel env add $name production --force
  $value | npx vercel env add $name preview --force
}

Write-Host ""
Write-Host "Done. Redeploy production:"
Write-Host "  npx vercel --prod"
Write-Host "Or redeploy from the Vercel dashboard."