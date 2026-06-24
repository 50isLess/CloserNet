# One-time Resend setup for CloserNet waitlist emails.
# 1. Sign up at https://resend.com and create an API key
# 2. Run: npm run setup-resend

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
  Copy-Item (Join-Path $root ".env.example") $envFile
}

Write-Host ""
Write-Host "CloserNet waitlist email setup"
Write-Host "=============================="
Write-Host ""
Write-Host "1. Open https://resend.com/api-keys and create an API key"
Write-Host "2. For production, verify closernet.net at https://resend.com/domains"
Write-Host "   Then set RESEND_FROM_EMAIL to CloserNet <support@closernet.net>"
Write-Host ""
Write-Host "Quick test mode uses onboarding@resend.dev (only delivers to your Resend account email)."
Write-Host ""

$apiKey = Read-Host "Paste your RESEND_API_KEY (starts with re_)"

if (-not $apiKey.Trim()) {
  Write-Error "No API key entered."
}

if (-not $apiKey.Trim().StartsWith("re_")) {
  Write-Warning "Resend keys usually start with re_ — double-check you copied the full key."
}

$from = Read-Host "From address [CloserNet <support@closernet.net>]"
if (-not $from.Trim()) {
  $from = "CloserNet <support@closernet.net>"
}

$notify = Read-Host "Notify email for new signups [support@closernet.net]"
if (-not $notify.Trim()) {
  $notify = "support@closernet.net"
}

function Set-EnvLine($name, $value) {
  $lines = @(Get-Content $envFile)
  $pattern = "^$name="
  $line = "$name=$value"
  $found = $false
  $updated = $lines | ForEach-Object {
    if ($_ -match $pattern) {
      $found = $true
      $line
    } else {
      $_
    }
  }
  if (-not $found) {
    $updated += $line
  }
  Set-Content -Path $envFile -Value $updated
}

Set-EnvLine "RESEND_API_KEY" $apiKey.Trim()
Set-EnvLine "RESEND_FROM_EMAIL" $from.Trim()
Set-EnvLine "WAITLIST_NOTIFY_EMAIL" $notify.Trim()

Write-Host ""
Write-Host "Saved to .env.local. Syncing to Vercel..."
& (Join-Path $PSScriptRoot "sync-vercel-env.ps1")

Write-Host ""
Write-Host "Redeploying production..."
npx vercel --prod --yes

Write-Host ""
Write-Host "Done. Test: join the waitlist on https://closernet.vercel.app"
Write-Host "Check status: https://closernet.vercel.app/api/waitlist"