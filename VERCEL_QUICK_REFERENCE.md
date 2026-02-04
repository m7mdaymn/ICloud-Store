# Quick Vercel Deployment Reference

## 🚀 TL;DR - Critical Settings

### Admin App
| Setting | Value |
|---------|-------|
| Root Directory | `frontend/admin` |
| Output Directory | **`dist/admin/browser`** ⚠️ |
| Build Command | `npm run build` |

### Storefront App
| Setting | Value |
|---------|-------|
| Root Directory | `frontend/storefront` |
| Output Directory | **`dist/storefront/browser`** ⚠️ |
| Build Command | `npm run build` |

## 📋 Pre-Deployment Checklist

Copy and paste this into your deployment notes:

```
□ Vercel Output Directory is set to dist/[app]/browser (NOT dist/[app])
□ Root Directory points to frontend/admin or frontend/storefront
□ vercel.json exists in each app directory
□ angular.json has fileReplacements for production
□ Backend CORS allows *.vercel.app domains
□ Production builds completed successfully locally
```

## ⚡ Quick Test Commands

```bash
# Test Admin Build
cd frontend/admin
npm install
npm run build
Test-Path dist/admin/browser/index.html  # Should return True

# Test Storefront Build
cd frontend/storefront  
npm install
npm run build
Test-Path dist/storefront/browser/index.html  # Should return True
```

## 🎯 After Deployment - Verify

1. ✅ Visit homepage: `https://[your-app].vercel.app`
2. ✅ Navigate to a route, then refresh (test SPA routing)
3. ✅ Open DevTools → Console (should be clean)
4. ✅ Open DevTools → Network → Filter XHR (check API calls)

## 🔴 Common Mistake

**WRONG:** Output Directory = `dist/admin` ❌  
**CORRECT:** Output Directory = `dist/admin/browser` ✅

**WRONG:** Output Directory = `dist/storefront` ❌  
**CORRECT:** Output Directory = `dist/storefront/browser` ✅

## 🌐 Production API

- **API URL:** `https://icloudstore.runasp.net/api`
- **CORS:** Configured for `*.vercel.app`
- **Swagger:** `https://icloudstore.runasp.net/swagger`

## 📞 Need Help?

Check [VERCEL_COMPLETE_SETUP.md](./VERCEL_COMPLETE_SETUP.md) for full documentation.
