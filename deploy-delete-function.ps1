# Deploy Delete User Edge Function
# This script deploys the delete-user edge function to Supabase

Write-Host "🚀 Deploying delete-user Edge Function..." -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is available
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseCli) {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

Write-Host "📋 Checking Supabase login status..." -ForegroundColor Yellow
npx supabase projects list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please login to Supabase..." -ForegroundColor Yellow
    npx supabase login
}

Write-Host ""
Write-Host "📦 Deploying delete-user function..." -ForegroundColor Green
npx supabase functions deploy delete-user --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Edge function deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Test the delete functionality in your app" -ForegroundColor White
    Write-Host "  2. Try deleting a test user" -ForegroundColor White
    Write-Host "  3. Verify the deleted user cannot log in" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs at: https://supabase.com/dashboard/project/_/functions/delete-user/logs" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Not logged in to Supabase CLI" -ForegroundColor White
    Write-Host "  - Project not linked" -ForegroundColor White
    Write-Host "  - Invalid function code" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running: npx supabase link --project-ref YOUR_PROJECT_REF" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to exit"
