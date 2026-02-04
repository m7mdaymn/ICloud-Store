# 📦 Git Repository Setup & Deployment Guide

## 🚀 Initial Repository Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to project root
cd "c:\DATA\ICloud Store"

# Initialize Git
git init

# Check what will be committed
git status
```

### Step 2: Add Files to Git

```bash
# Add all files (respects .gitignore)
git add .

# Verify files staged
git status

# You should see:
# ✅ backend/ files
# ✅ frontend/ files
# ✅ .gitignore
# ✅ Documentation files
# ❌ node_modules/ (ignored)
# ❌ bin/, obj/, dist/ (ignored)
```

### Step 3: Create Initial Commit

```bash
# Commit all files
git commit -m "Initial commit: iCloud Store full stack application"
```

### Step 4: Connect to GitHub

#### Option A: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `icloudstore`
3. Description: `iCloud Store - Full Stack E-Commerce Platform`
4. **Keep it Private** (recommended for production code)
5. **Do NOT** initialize with README (we already have one)
6. Click **Create repository**

#### Option B: Use GitHub CLI

```bash
# Install GitHub CLI first: https://cli.github.com/
gh auth login
gh repo create icloudstore --private --source=. --remote=origin --push
```

### Step 5: Push to GitHub

```bash
# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/icloudstore.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main

# Or if default branch is 'master':
git push -u origin master
```

## 📤 Deploy Frontend to Vercel

### Admin Panel Deployment

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy Admin

```bash
# Navigate to admin folder
cd frontend/admin

# Deploy to Vercel
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? icloudstore-admin
# - Directory? ./
# - Override settings? No

# After preview deployment, deploy to production:
vercel --prod
```

**Result:** You'll get a URL like `https://icloudstore-admin.vercel.app`

#### Step 4: Configure Custom Domain (Optional)

```bash
vercel domains add admin.yourdomain.com
# Follow DNS instructions
```

### Storefront Deployment

```bash
# Navigate to storefront folder
cd frontend/storefront

# Deploy to Vercel
vercel --prod

# Follow same prompts as admin
# Project name: icloudstore-storefront
```

**Result:** You'll get a URL like `https://icloudstore.vercel.app`

## 🔄 Update CORS After Vercel Deployment

### Step 1: Get Your Vercel URLs

After deployment, you'll have URLs like:
- Admin: `https://icloudstore-admin-xyz123.vercel.app`
- Storefront: `https://icloudstore-xyz456.vercel.app`

### Step 2: Update Backend CORS

The backend is already configured to accept `https://*.vercel.app`, so **no changes needed**!

### Step 3: Verify CORS is Working

1. Open admin/storefront in browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Refresh page
5. Check API calls - should see `200` status codes
6. Check Console tab - should be **NO CORS errors**

## 🔁 Daily Git Workflow

### Making Changes

```bash
# Check current status
git status

# See what changed
git diff

# Stage specific files
git add backend/src/ICloudStore.API/Controllers/ProductsController.cs
git add frontend/admin/src/app/features/products/products.component.ts

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add product search functionality"

# Push to GitHub
git push
```

### Commit Message Best Practices

Use conventional commit format:

```bash
# New feature
git commit -m "feat: add WhatsApp button to product cards"

# Bug fix
git commit -m "fix: resolve CORS issue with Vercel deployment"

# Documentation
git commit -m "docs: update deployment guide"

# Styling
git commit -m "style: improve admin dashboard layout"

# Refactoring
git commit -m "refactor: optimize product service API calls"

# Configuration
git commit -m "chore: update Vercel config for better caching"
```

### Pulling Latest Changes

```bash
# Before starting work
git pull origin main

# If you have local changes
git stash          # Save local changes
git pull           # Pull remote changes
git stash pop      # Restore local changes
```

## 🚀 Deployment Workflow

### Backend Updates (RunASP.NET)

```bash
# 1. Make changes to backend
# 2. Test locally
# 3. Commit and push to GitHub
git add backend/
git commit -m "feat: add new API endpoint"
git push

# 4. Publish backend
cd backend/src/ICloudStore.API
dotnet publish -c Release -o ./publish

# 5. Upload to RunASP.NET
# Use File Manager or FTP to upload publish/* to /site/wwwroot/

# 6. Restart application in RunASP panel
```

### Frontend Updates (Vercel)

Vercel automatically deploys when you push to GitHub!

#### Option A: Automatic Deployment (Recommended)

```bash
# 1. Make changes to frontend
# 2. Test locally (ng serve)
# 3. Commit and push to GitHub
git add frontend/admin/
git commit -m "feat: improve admin UI"
git push

# 4. Vercel automatically builds and deploys!
# Check https://vercel.com/dashboard for deployment status
```

#### Option B: Manual Deployment

```bash
# Navigate to changed frontend
cd frontend/admin  # or frontend/storefront

# Deploy
vercel --prod

# Vercel will build and deploy immediately
```

### Connect Vercel to GitHub (One-time Setup)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Angular
   - **Root Directory:** `frontend/admin` (or `frontend/storefront`)
   - **Build Command:** `ng build --configuration production`
   - **Output Directory:** `dist/admin/browser` (or `dist/storefront/browser`)
5. Click **Deploy**

**Now every `git push` triggers automatic deployment!** 🎉

## 📊 Project Branches Strategy

### Main Branch
```bash
# Main production branch
git checkout main

# All production code goes here
```

### Feature Development
```bash
# Create new feature branch
git checkout -b feature/product-filtering

# Make changes...
git add .
git commit -m "feat: add product filtering"

# Push feature branch
git push origin feature/product-filtering

# Create Pull Request on GitHub
# After review, merge to main
```

### Hotfix
```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/cors-error

# Fix issue
git add .
git commit -m "fix: resolve CORS configuration"

# Push and merge immediately
git push origin hotfix/cors-error
# Merge to main via GitHub PR
```

## 🔐 Protecting Sensitive Data

### Files Already Protected (in .gitignore)

✅ `node_modules/` - Dependencies  
✅ `bin/`, `obj/`, `dist/` - Build outputs  
✅ `wwwroot/uploads/` - User uploads  
✅ `.vs/`, `.vscode/` - IDE files  

### ⚠️ Files Committed (Contains Config)

These files ARE committed but contain **placeholder values**:
- ✅ `appsettings.json` - Has production database connection
- ✅ `appsettings.Production.json` - Has CORS config
- ✅ `environment.ts` - Has localhost API URL
- ✅ `environment.prod.ts` - Has production API URL

**Important:** These files are safe to commit because:
1. Database credentials are for RunASP.NET (not exposed publicly)
2. API URLs are public anyway
3. No API keys or secrets stored in code

### Real Secrets (Use Environment Variables)

If you add sensitive data later:
```bash
# In RunASP.NET, use Application Settings
STRIPE_API_KEY=sk_live_xxxxx
SENDGRID_API_KEY=SG.xxxxx
```

## 📦 What's in the Repository

```
icloudstore/
├── .gitignore                    ✅ Protects build files
├── README.md                     ✅ Project documentation
├── DEPLOYMENT_GUIDE.md           ✅ Deployment instructions
├── PUBLISH_STEPS.md              ✅ Step-by-step publish
├── QUICK_PUBLISH.md              ✅ Quick reference
├── GIT_WORKFLOW.md              ✅ This file
│
├── backend/
│   └── src/
│       ├── ICloudStore.API/
│       │   ├── Controllers/      ✅ All controllers
│       │   ├── Program.cs        ✅ App configuration
│       │   ├── appsettings.json  ✅ Development settings
│       │   └── appsettings.Production.json ✅ Production settings
│       ├── ICloudStore.Application/
│       ├── ICloudStore.Domain/
│       └── ICloudStore.Infrastructure/
│
└── frontend/
    ├── admin/
    │   ├── src/                  ✅ All source code
    │   ├── vercel.json           ✅ Vercel config
    │   └── package.json          ✅ Dependencies
    │
    └── storefront/
        ├── src/                  ✅ All source code
        ├── vercel.json           ✅ Vercel config
        └── package.json          ✅ Dependencies
```

## ✅ Pre-Push Checklist

Before `git push`:

- [ ] Code compiles without errors (`dotnet build`, `ng build`)
- [ ] No console errors in browser
- [ ] API endpoints tested in Swagger
- [ ] Committed with descriptive message
- [ ] .gitignore properly excludes build files
- [ ] No sensitive data in code
- [ ] Database migrations created (if schema changed)

## 🆘 Common Git Issues

### Issue: "Failed to push - rejected"

```bash
# Solution: Pull first, then push
git pull origin main
git push
```

### Issue: "Merge conflict"

```bash
# 1. Open conflicted files
# 2. Look for conflict markers: <<<<<<< ======= >>>>>>>
# 3. Manually resolve
# 4. Stage resolved files
git add .
git commit -m "fix: resolve merge conflict"
git push
```

### Issue: "Accidentally committed sensitive file"

```bash
# Remove from Git history
git rm --cached path/to/sensitive/file
git commit -m "chore: remove sensitive file"
git push

# Add to .gitignore to prevent future commits
echo "path/to/sensitive/file" >> .gitignore
git add .gitignore
git commit -m "chore: update gitignore"
git push
```

### Issue: "Want to undo last commit"

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes (⚠️ DANGEROUS)
git reset --hard HEAD~1
```

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Deploy admin to Vercel
4. ✅ Deploy storefront to Vercel
5. ✅ Verify CORS is working
6. ✅ Test full application flow
7. ✅ Set up automatic deployments
8. 🚀 Start accepting customers!

---

**Your code is now version-controlled and deployed! 🎉**
