# One-time Resend setup for CloserNet waitlist emails.
# Run: npm run setup-resend

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env.local"
$defaultFrom = 'CloserNet <support@closernet.net>'
$defaultNotify = 'support@closernet.net'

if (-not (Test-Path $envFile)) {
  Copy-Item (Join-Path $root ".env.example") $envFile
}

Write-Host ""
Write-Host "CloserNet waitlist email setup"
Write-Host "=============================="
Write-Host ""
Write-Host "1. Open https://resend.com/api-keys and create an API key"
Write-Host "2. closernet.net should already be verified in Resend"
Write-Host ""

$apiKey = Read-Host "Paste your RESEND_API_KEY (starts with re_)"

if (-not $apiKey.Trim()) {
  Write-Error "No API key entered."
}

if (-not $apiKey.Trim().StartsWith("re_")) {
  Write-Warning "Resend keys usually start with re_ - double-check you copied the full key."
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
Set-EnvLine "RESEND_FROM_EMAIL" $defaultFrom
Set-EnvLine "WAITLIST_NOTIFY_EMAIL" $defaultNotify

Write-Host ""
Write-Host "Saved to .env.local. Syncing to Vercel..."
& (Join-Path $PSScriptRoot "sync-vercel-env.ps1")

Write-Host ""
Write-Host "Redeploying production..."
npx vercel --prod --yes

Write-Host ""
Write-Host "Done. Test at https://closernet.vercel.app/api/waitlist"
Write-Host "Then join the waitlist on the site."