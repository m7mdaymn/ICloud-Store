# Vercel Deployment - Quick Reference

## ✅ Files Created

- ✅ `frontend/admin/vercel.json` - Admin deployment config
- ✅ `frontend/storefront/vercel.json` - Storefront deployment config
- ✅ `.gitignore` - Git version control exclusions
- ✅ Backend CORS updated to support `*.vercel.app` wildcard

## 🚀 Deploy Commands

### First Time Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy Admin
cd frontend/admin
vercel --prod

# Deploy Storefront
cd ../storefront
vercel --prod
```

### Update Deployment

```bash
# Just run from the frontend folder
vercel --prod
```

## 🔗 Expected URLs After Deployment

After deploying, you'll get URLs like:

- **Admin:** `https://icloudstore-admin-[random].vercel.app`
- **Storefront:** `https://icloudstore-[random].vercel.app`

## ✅ CORS Configuration Status

Your backend is already configured to accept Vercel domains:

**File:** `appsettings.Production.json`
```json
{
  "CorsOrigins": [
    "https://icloudstore.runasp.net",
    "https://*.vercel.app",  ← This allows ALL Vercel deployments
    "http://localhost:4200",
    "http://localhost:4201"
  ]
}
```

**File:** `Program.cs`
- ✅ Smart CORS policy with wildcard pattern matching
- ✅ Automatically allows any `*.vercel.app` subdomain
- ✅ Supports localhost for development
- ✅ Allows production RunASP.NET domain

## 🔄 Automatic Deployment (Recommended)

### Connect Vercel to GitHub

1. **Push your code to GitHub first:**
   ```bash
   git add .
   git commit -m "feat: add Vercel configuration"
   git push
   ```

2. **Import project in Vercel:**
   - Go to https://vercel.com/new
   - Click **Import Git Repository**
   - Select your `icloudstore` repository
   - Configure **Admin:**
     - Root Directory: `frontend/admin`
     - Framework: Angular
     - Build Command: `ng build --configuration production`
     - Output Directory: `dist/admin/browser`
   - Click **Deploy**

3. **Repeat for Storefront:**
   - Import same repository again
   - Root Directory: `frontend/storefront`
   - Output Directory: `dist/storefront/browser`

**Result:** Every `git push` automatically deploys to Vercel! 🎉

## 📋 vercel.json Configuration Explained

### What's Included

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
**Purpose:** Makes Angular routing work (all routes serve index.html)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```
**Purpose:** Security headers for protection against XSS and clickjacking

```json
{
  "source": "/assets/(.*)",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
  ]
}
```
**Purpose:** Cache static assets for 1 year for better performance

## 🧪 Testing After Deployment

### 1. Test Admin Panel

```bash
# Open your Vercel admin URL
https://your-admin-url.vercel.app

# Check browser console (F12):
✅ No CORS errors
✅ API calls to https://icloudstore.runasp.net/api
✅ All requests return 200/201 status codes

# Test functionality:
✅ Login works
✅ Dashboard loads
✅ Can view categories
✅ Can view products
```

### 2. Test Storefront

```bash
# Open your Vercel storefront URL
https://your-storefront-url.vercel.app

# Check browser console:
✅ No CORS errors
✅ API calls working
✅ Categories load
✅ Products display
✅ Language switching works
✅ WhatsApp links work
```

## 🐛 Troubleshooting

### Issue: "CORS error after Vercel deployment"

**Solution:**
1. Check your Vercel URL is `*.vercel.app`
2. Verify backend `appsettings.Production.json` has `"https://*.vercel.app"`
3. Re-publish backend to RunASP.NET
4. Restart backend application
5. Clear browser cache

### Issue: "404 on page refresh"

**Solution:** This means `vercel.json` rewrites aren't working.
- Verify `vercel.json` exists in project root
- Re-deploy: `vercel --prod`

### Issue: "Build failed on Vercel"

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct build script
3. Ensure all dependencies are in `package.json` (not just devDependencies)
4. Run `ng build --configuration production` locally to test

### Issue: "Environment file not found"

**Solution:**
- Ensure `environment.prod.ts` exists
- Verify it has correct `apiUrl: 'https://icloudstore.runasp.net/api'`
- Check `angular.json` has production configuration

## 🎨 Custom Domain (Optional)

### Add Custom Domain to Vercel

```bash
# Using Vercel CLI
vercel domains add admin.yourdomain.com

# Or in Vercel Dashboard:
# 1. Go to Project Settings
# 2. Domains tab
# 3. Add Domain
# 4. Follow DNS instructions
```

### Update CORS for Custom Domain

If you use custom domains, add them to backend CORS:

**appsettings.Production.json:**
```json
{
  "CorsOrigins": [
    "https://icloudstore.runasp.net",
    "https://*.vercel.app",
    "https://admin.yourdomain.com",  ← Add custom domain
    "https://www.yourdomain.com",    ← Add custom domain
    "http://localhost:4200",
    "http://localhost:4201"
  ]
}
```

Then re-publish backend.

## 📊 Vercel Features

### Automatic HTTPS
✅ Free SSL certificates for all deployments

### Global CDN
✅ Your app served from edge locations worldwide

### Instant Rollbacks
✅ Can rollback to previous deployment in one click

### Environment Variables
✅ Can set env vars in Vercel dashboard (though not needed for this project)

### Preview Deployments
✅ Every branch gets its own preview URL

## ✅ Deployment Checklist

- [ ] vercel.json created in both frontend folders
- [ ] Git repository created and pushed to GitHub
- [ ] Backend CORS includes `*.vercel.app`
- [ ] Backend published to RunASP.NET
- [ ] Admin deployed to Vercel
- [ ] Storefront deployed to Vercel
- [ ] Tested admin login
- [ ] Tested storefront loading
- [ ] No CORS errors in console
- [ ] All API calls working
- [ ] GitHub connected to Vercel for auto-deploy

## 🎯 Summary

**What we configured:**

1. ✅ **vercel.json** files for both frontends
   - Handles Angular routing
   - Adds security headers
   - Optimizes caching

2. ✅ **Backend CORS** updated
   - Accepts wildcard `*.vercel.app`
   - Smart pattern matching
   - No need to update for each deployment

3. ✅ **.gitignore** created
   - Excludes build files
   - Protects from committing dependencies
   - Safe for Git repository

**Result:** Push code → Auto deploy → Everything works! 🚀

---

**Need help?** Check [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for Git commands and [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full deployment guide.
