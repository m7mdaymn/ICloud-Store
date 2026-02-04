# Vercel Deployment Verification Script
# Run this before deploying to Vercel to ensure everything is configured correctly

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   ICloud Store - Vercel Deployment Checker" -ForegroundColor Cyan  
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

Write-Host "📁 Checking File Structure..." -ForegroundColor Cyan
Write-Host ""

# Check vercel.json files
if (Test-Path "frontend/admin/vercel.json") {
    Write-Host "✅ Admin vercel.json found" -ForegroundColor Green
} else {
    Write-Host "❌ Admin vercel.json is missing" -ForegroundColor Red
    $errors++
}

if (Test-Path "frontend/storefront/vercel.json") {
    Write-Host "✅ Storefront vercel.json found" -ForegroundColor Green
} else {
    Write-Host "❌ Storefront vercel.json is missing" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "🔧 Checking Environment Files..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path "frontend/admin/src/environments/environment.prod.ts") {
    Write-Host "✅ Admin environment.prod.ts found" -ForegroundColor Green
} else {
    Write-Host "❌ Admin environment.prod.ts is missing" -ForegroundColor Red
    $errors++
}

if (Test-Path "frontend/storefront/src/environments/environment.prod.ts") {
    Write-Host "✅ Storefront environment.prod.ts found" -ForegroundColor Green
} else {
    Write-Host "❌ Storefront environment.prod.ts is missing" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "🏗️  Checking Angular Configuration..." -ForegroundColor Cyan
Write-Host ""

$adminAngular = Get-Content "frontend/admin/angular.json" -Raw
if ($adminAngular -match "fileReplacements") {
    Write-Host "✅ Admin has fileReplacements configured" -ForegroundColor Green
} else {
    Write-Host "❌ Admin missing fileReplacements" -ForegroundColor Red
    $errors++
}

$storefrontAngular = Get-Content "frontend/storefront/angular.json" -Raw
if ($storefrontAngular -match "fileReplacements") {
    Write-Host "✅ Storefront has fileReplacements configured" -ForegroundColor Green
} else {
    Write-Host "❌ Storefront missing fileReplacements" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "🧪 Testing Builds..." -ForegroundColor Cyan
Write-Host ""

# Build admin
Write-Host "Building admin..." -ForegroundColor Yellow
Push-Location "frontend/admin"
$null = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    if (Test-Path "dist/admin/browser/index.html") {
        Write-Host "✅ Admin builds successfully to dist/admin/browser/" -ForegroundColor Green
    } else {
        Write-Host "❌ Admin build output location is wrong" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "❌ Admin build failed" -ForegroundColor Red
    $errors++
}
Pop-Location

# Build storefront
Write-Host "Building storefront..." -ForegroundColor Yellow
Push-Location "frontend/storefront"
$null = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    if (Test-Path "dist/storefront/browser/index.html") {
        Write-Host "✅ Storefront builds successfully to dist/storefront/browser/" -ForegroundColor Green
    } else {
        Write-Host "❌ Storefront build output location is wrong" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "❌ Storefront build failed" -ForegroundColor Red
    $errors++
}
Pop-Location

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "                   SUMMARY" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0) {
    Write-Host "🎉 ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Your apps are ready for Vercel deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Vercel Settings:" -ForegroundColor Cyan
    Write-Host "   Admin Output Directory:      dist/admin/browser" -ForegroundColor White
    Write-Host "   Storefront Output Directory: dist/storefront/browser" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ $errors ERROR(S) FOUND" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before deploying." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "📖 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - VERCEL_COMPLETE_SETUP.md" -ForegroundColor White
Write-Host "   - VERCEL_QUICK_REFERENCE.md" -ForegroundColor White
Write-Host ""
