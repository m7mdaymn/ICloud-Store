# 🚀 Deployment Guide - iCloud Store

## Production Configuration Summary

**Domain:** https://icloudstore.runasp.net  
**Backend API:** https://icloudstore.runasp.net/api  
**Swagger UI:** https://icloudstore.runasp.net/swagger  

---

## 📋 Prerequisites

- Visual Studio 2022 or .NET 9 SDK installed
- Node.js 18+ and Angular CLI installed (`npm install -g @angular/cli`)
- Access to RunASP.NET hosting panel
- Database connection string already configured

---

## 🔧 Backend Deployment (ASP.NET Core API)

### Step 1: Build and Publish Backend

#### Option A: Using Visual Studio 2022

1. Open `backend/ICloudStore.sln` in Visual Studio
2. Right-click on `ICloudStore.API` project → **Publish**
3. Choose **Folder** as publish target
4. Set folder path: `backend/src/ICloudStore.API/bin/Release/net9.0/publish`
5. Configuration: **Release**
6. Target Framework: **net9.0**
7. Click **Publish**

#### Option B: Using .NET CLI

```bash
cd backend/src/ICloudStore.API

# Clean previous builds
dotnet clean -c Release

# Restore dependencies
dotnet restore

# Publish for production
dotnet publish -c Release -o ./publish

# Output will be in: backend/src/ICloudStore.API/publish/
```

### Step 2: Prepare Upload Package

After publishing, your `publish` folder should contain:
- `ICloudStore.API.dll`
- `appsettings.json`
- `appsettings.Production.json` *(with CORS configured for icloudstore.runasp.net)*
- `web.config` (auto-generated for IIS)
- All dependencies
- `wwwroot/` folder (for static files and uploads)

**IMPORTANT:** Create `wwwroot/uploads` folder if it doesn't exist:
```bash
mkdir publish/wwwroot/uploads
```

### Step 3: Upload to RunASP.NET

1. **Login to RunASP.NET Control Panel**
   - Go to https://runasp.net
   - Login with your credentials

2. **Access File Manager or FTP**
   - Navigate to your application's root directory
   - Usually: `/site/wwwroot/`

3. **Upload Files**
   - Upload ALL files from `publish/` folder to `/site/wwwroot/`
   - Ensure `web.config` is present in root
   - Verify `wwwroot/uploads/` folder exists with write permissions

4. **Set Environment Variable**
   - In RunASP.NET control panel, go to **Configuration** → **Application Settings**
   - Add environment variable:
     - **Name:** `ASPNETCORE_ENVIRONMENT`
     - **Value:** `Production`

5. **Verify Database Connection**
   - Ensure connection string in `appsettings.json` matches your RunASP database
   - Current: `Server=db40079.public.databaseasp.net; Database=db40079;...`

6. **Restart Application**
   - In RunASP control panel, restart your application
   - Or touch `web.config` to trigger restart

### Step 4: Test Backend

1. **Test API Root:**
   ```
   https://icloudstore.runasp.net/api
   ```

2. **Test Swagger UI:**
   ```
   https://icloudstore.runasp.net/swagger
   ```
   - ✅ Should display full API documentation
   - ✅ Should work in Production (enabled in Program.cs)

3. **Test Specific Endpoint:**
   ```
   https://icloudstore.runasp.net/api/Categories
   https://icloudstore.runasp.net/api/Brands
   ```

---

## 🎨 Frontend Deployment

### Admin Panel Deployment

#### Step 1: Build for Production

```bash
cd frontend/admin

# Install dependencies (if not already done)
npm install

# Build for production
ng build --configuration production

# Output will be in: frontend/admin/dist/admin/browser/
```

**What happens during build:**
- Uses `environment.prod.ts` (apiUrl: `https://icloudstore.runasp.net/api`)
- Minifies and optimizes all files
- Creates production-ready static files

#### Step 2: Deploy Options

**Option A: Upload to RunASP.NET (Same Server)**
```bash
# Copy built files to backend's wwwroot/admin folder
xcopy /E /I /Y "dist/admin/browser" "../../backend/src/ICloudStore.API/publish/wwwroot/admin"

# Then upload to RunASP.NET at /site/wwwroot/wwwroot/admin/
# Access at: https://icloudstore.runasp.net/admin
```

**Option B: Deploy to Separate Static Hosting (Recommended)**
- Netlify, Vercel, GitHub Pages, Azure Static Web Apps, etc.
- Upload `dist/admin/browser/` contents
- Configure SPA routing (rewrite all routes to index.html)

**Option C: RunASP.NET Subdomain/Separate App**
- Create new application on RunASP.NET
- Upload `dist/admin/browser/` contents to separate app
- Access at subdomain

### Storefront Deployment

#### Step 1: Build for Production

```bash
cd frontend/storefront

# Install dependencies (if not already done)
npm install

# Build for production
ng build --configuration production

# Output will be in: frontend/storefront/dist/storefront/browser/
```

#### Step 2: Deploy Options (Same as Admin)

**Option A: Upload to RunASP.NET**
```bash
# Copy to backend's wwwroot
xcopy /E /I /Y "dist/storefront/browser" "../../backend/src/ICloudStore.API/publish/wwwroot"

# Access at: https://icloudstore.runasp.net/
```

**Option B: Separate Static Hosting**
- Upload `dist/storefront/browser/` to Netlify/Vercel/etc.

---

## 🔍 Post-Deployment Verification

### Backend Checks ✅

1. **Swagger Accessible:**
   ```
   ✅ https://icloudstore.runasp.net/swagger
   ```

2. **API Responds:**
   ```bash
   curl https://icloudstore.runasp.net/api/Categories
   # Should return JSON response
   ```

3. **CORS Working:**
   - Open browser console on frontend
   - Check network tab - no CORS errors
   - Verify `Access-Control-Allow-Origin` header present

4. **Database Connected:**
   - Swagger → Auth → POST /api/Auth/login
   - Try login with seeded admin credentials
   - Should return JWT token

5. **File Uploads Work:**
   - Test uploading category/product images
   - Verify files saved to `wwwroot/uploads/`

### Frontend Checks ✅

1. **Admin Panel:**
   ```
   ✅ https://icloudstore.runasp.net/admin (or your hosting URL)
   - Login page loads
   - Can authenticate
   - Dashboard loads data from API
   - Network tab shows requests to https://icloudstore.runasp.net/api/*
   ```

2. **Storefront:**
   ```
   ✅ https://icloudstore.runasp.net/ (or your hosting URL)
   - Home page loads
   - Categories display
   - Products/Units display
   - Network tab shows requests to https://icloudstore.runasp.net/api/*
   ```

3. **Browser Console:**
   ```
   ✅ ZERO errors
   ✅ ZERO CORS errors
   ✅ All API calls return 200/201/204 status codes
   ```

---

## 🔐 Security Checklist

- ✅ HTTPS enabled (RunASP.NET provides SSL)
- ✅ CORS configured for production domain
- ✅ JWT tokens secured with strong key
- ✅ Database credentials protected in appsettings
- ✅ Swagger enabled but can be secured with authentication if needed
- ✅ File upload validation in place

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
**Solution:**
- Verify `environment.prod.ts` uses `https://icloudstore.runasp.net/api`
- Check browser console for CORS errors
- Ensure ASPNETCORE_ENVIRONMENT is set to "Production"

### Issue: "404 Not Found on API endpoints"
**Solution:**
- Check `web.config` in RunASP.NET root
- Verify all DLLs uploaded correctly
- Restart application in RunASP panel

### Issue: "Database connection failed"
**Solution:**
- Verify connection string in `appsettings.json`
- Check database server is accessible
- Test connection from RunASP.NET server

### Issue: "CORS error"
**Solution:**
- Verify `appsettings.Production.json` includes your frontend domain
- Ensure CORS is before UseHttpsRedirection in Program.cs
- Check browser network tab for preflight OPTIONS requests

### Issue: "Swagger not showing"
**Solution:**
- Verify Program.cs has Swagger enabled outside IsDevelopment check
- Clear browser cache
- Access directly: https://icloudstore.runasp.net/swagger

### Issue: "Images not uploading"
**Solution:**
- Verify `wwwroot/uploads/` folder exists
- Check folder permissions (IIS_IUSRS needs write access)
- Verify file size limits in web.config

---

## 📁 Folder Structure After Deployment

```
/site/wwwroot/                          (RunASP.NET root)
├── ICloudStore.API.dll                 (Main application)
├── appsettings.json                    (Configuration)
├── appsettings.Production.json         (Production overrides)
├── web.config                          (IIS configuration)
├── wwwroot/                            (Static files)
│   ├── index.html                      (Storefront - optional)
│   ├── uploads/                        (User uploads - REQUIRED)
│   │   ├── brands/
│   │   ├── categories/
│   │   ├── products/
│   │   └── units/
│   └── admin/                          (Admin panel - optional)
│       └── index.html
└── (all other DLLs and dependencies)
```

---

## 🎯 Quick Deploy Commands

### Backend Only
```bash
cd backend/src/ICloudStore.API
dotnet publish -c Release -o ./publish
# Upload publish/* to RunASP.NET
```

### Admin Frontend Only
```bash
cd frontend/admin
ng build --configuration production
# Upload dist/admin/browser/* to hosting
```

### Storefront Frontend Only
```bash
cd frontend/storefront
ng build --configuration production
# Upload dist/storefront/browser/* to hosting
```

### Full Stack
```bash
# Build all three
cd backend/src/ICloudStore.API && dotnet publish -c Release -o ./publish
cd ../../../frontend/admin && ng build --configuration production
cd ../storefront && ng build --configuration production
```

---

## 📞 Support

**Database Server:** db40079.public.databaseasp.net  
**Application URL:** https://icloudstore.runasp.net  
**Swagger URL:** https://icloudstore.runasp.net/swagger  

**Default Admin Credentials (from DataSeeder):**
- Check `backend/src/ICloudStore.Infrastructure/Data/DataSeeder.cs`
- Default credentials should be changed after first login

---

## ✅ Deployment Complete!

Your iCloud Store application is now live at:
- **API:** https://icloudstore.runasp.net/api
- **Swagger:** https://icloudstore.runasp.net/swagger
- **Storefront:** (Your hosting URL)
- **Admin:** (Your hosting URL)

All systems are configured for production with:
✅ Correct API URLs  
✅ CORS enabled  
✅ Swagger enabled in production  
✅ HTTPS enforced  
✅ Database connected  
