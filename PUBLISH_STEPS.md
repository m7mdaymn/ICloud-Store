# Step-by-Step Publish Instructions

## 🎯 Step 1: Publish Backend (5 minutes)

### 1.1 Build the Application

Open PowerShell in project root:

```powershell
cd "c:\DATA\ICloud Store\backend\src\ICloudStore.API"

# Clean previous builds
dotnet clean -c Release

# Restore packages
dotnet restore

# Publish to folder
dotnet publish -c Release -o ./publish
```

### 1.2 Verify Publish Output

```powershell
# Check if publish folder exists
dir publish

# You should see:
# - ICloudStore.API.dll
# - appsettings.json
# - appsettings.Production.json
# - web.config
# - wwwroot folder
# - Many dependency DLLs
```

### 1.3 Create Uploads Folder

```powershell
# Ensure uploads folder exists
mkdir publish\wwwroot\uploads -Force
mkdir publish\wwwroot\uploads\brands -Force
mkdir publish\wwwroot\uploads\categories -Force
mkdir publish\wwwroot\uploads\products -Force
mkdir publish\wwwroot\uploads\units -Force
```

### 1.4 Compress for Upload

```powershell
# Compress to ZIP (easier to upload)
Compress-Archive -Path "publish\*" -DestinationPath "icloudstore-backend.zip" -Force
```

**Result:** You now have `icloudstore-backend.zip` ready to upload!

---

## 🎯 Step 2: Upload to RunASP.NET (5 minutes)

### 2.1 Login to RunASP.NET

1. Go to https://runasp.net
2. Login with your credentials
3. Select your application

### 2.2 Upload Files

**Option A: Using File Manager**
1. In RunASP control panel → **File Manager**
2. Navigate to `/site/wwwroot/`
3. **Delete all existing files** (backup first if needed)
4. Upload `icloudstore-backend.zip`
5. Extract the ZIP file
6. Verify all files are in `/site/wwwroot/` (not in a subfolder)

**Option B: Using FTP**
1. Get FTP credentials from RunASP panel
2. Connect using FileZilla or similar
3. Navigate to `/site/wwwroot/`
4. Upload all files from `publish/` folder
5. Preserve folder structure

### 2.3 Configure Environment

1. In RunASP panel → **Configuration** → **Application Settings**
2. Add new setting:
   - **Name:** `ASPNETCORE_ENVIRONMENT`
   - **Value:** `Production`
3. Click **Save**

### 2.4 Set Folder Permissions

1. In File Manager, right-click `wwwroot/uploads/`
2. Set permissions to allow write access
3. Apply to all subfolders

### 2.5 Restart Application

1. In RunASP panel → **Overview** → **Restart**
2. Or in File Manager → Open `web.config` → Save (triggers restart)
3. Wait 30-60 seconds for app to start

---

## 🎯 Step 3: Test Backend (2 minutes)

### 3.1 Test API Root

Open browser:
```
https://icloudstore.runasp.net/
```
Should see: API info or 404 (this is OK)

### 3.2 Test Swagger

```
https://icloudstore.runasp.net/swagger
```
Should see: ✅ Full Swagger UI with all endpoints

### 3.3 Test Specific Endpoint

```
https://icloudstore.runasp.net/api/Categories
```
Should return: ✅ JSON array of categories (or empty array)

### 3.4 Test Authentication

In Swagger:
1. Expand `Auth` → `POST /api/Auth/login`
2. Click **Try it out**
3. Enter credentials:
```json
{
  "email": "admin@icloudstore.com",
  "password": "Admin@123"
}
```
4. Click **Execute**
5. Should return: ✅ JWT token

---

## 🎯 Step 4: Build Admin Frontend (3 minutes)

### 4.1 Navigate to Admin Folder

```powershell
cd "c:\DATA\ICloud Store\frontend\admin"
```

### 4.2 Install Dependencies (first time only)

```powershell
npm install
```

### 4.3 Build for Production

```powershell
ng build --configuration production
```

Wait for build to complete (1-2 minutes)

### 4.4 Verify Output

```powershell
dir dist\admin\browser

# You should see:
# - index.html
# - main.*.js
# - polyfills.*.js
# - styles.*.css
# - assets folder
```

**Result:** Production-ready admin panel in `dist/admin/browser/`

---

## 🎯 Step 5: Build Storefront Frontend (3 minutes)

### 5.1 Navigate to Storefront Folder

```powershell
cd "c:\DATA\ICloud Store\frontend\storefront"
```

### 5.2 Install Dependencies (first time only)

```powershell
npm install
```

### 5.3 Build for Production

```powershell
ng build --configuration production
```

Wait for build to complete (1-2 minutes)

### 5.4 Verify Output

```powershell
dir dist\storefront\browser

# You should see:
# - index.html
# - main.*.js
# - polyfills.*.js
# - styles.*.css
# - assets folder
```

**Result:** Production-ready storefront in `dist/storefront/browser/`

---

## 🎯 Step 6: Deploy Frontend (Choose One)

### Option A: Deploy to Same Server (RunASP.NET)

```powershell
# Copy admin to backend's wwwroot
xcopy /E /I /Y "c:\DATA\ICloud Store\frontend\admin\dist\admin\browser" "c:\DATA\ICloud Store\backend\src\ICloudStore.API\publish\wwwroot\admin"

# Copy storefront to backend's wwwroot
xcopy /E /I /Y "c:\DATA\ICloud Store\frontend\storefront\dist\storefront\browser" "c:\DATA\ICloud Store\backend\src\ICloudStore.API\publish\wwwroot\store"
```

Then upload the updated `wwwroot/` folder to RunASP.NET.

**Access URLs:**
- Admin: https://icloudstore.runasp.net/admin
- Storefront: https://icloudstore.runasp.net/store

### Option B: Deploy to Netlify (Recommended)

**For Admin:**
1. Go to https://netlify.com → Login
2. Drag & drop `frontend/admin/dist/admin/browser/` folder
3. Configure:
   - Build settings: None (already built)
   - Publish directory: `/` (root)
   - Redirects: `/* /index.html 200` (for SPA routing)
4. Get URL: `https://icloudstore-admin.netlify.app`

**For Storefront:**
1. Drag & drop `frontend/storefront/dist/storefront/browser/` folder
2. Same configuration as admin
3. Get URL: `https://icloudstore.netlify.app`

**Important:** Add Netlify URLs to CORS in `appsettings.Production.json`:
```json
"CorsOrigins": [
  "https://icloudstore.runasp.net",
  "https://icloudstore-admin.netlify.app",
  "https://icloudstore.netlify.app"
]
```

### Option C: Deploy to Vercel

Similar to Netlify:
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy admin:
```powershell
cd frontend\admin
vercel --prod
```
3. Deploy storefront:
```powershell
cd ..\storefront
vercel --prod
```

---

## 🎯 Step 7: Final Testing (5 minutes)

### 7.1 Test API

- [ ] https://icloudstore.runasp.net/swagger ✅ Loads
- [ ] Can login via Swagger ✅ Returns JWT token
- [ ] GET /api/Categories ✅ Returns data
- [ ] GET /api/Brands ✅ Returns data
- [ ] GET /api/Products ✅ Returns data

### 7.2 Test Admin Panel

- [ ] Admin URL loads ✅
- [ ] Login page appears ✅
- [ ] Can login with credentials ✅
- [ ] Dashboard loads ✅
- [ ] Network tab shows API calls to icloudstore.runasp.net ✅
- [ ] No CORS errors in console ✅
- [ ] Can view categories/products ✅

### 7.3 Test Storefront

- [ ] Storefront URL loads ✅
- [ ] Home page displays ✅
- [ ] Categories load ✅
- [ ] Products/Units display ✅
- [ ] Network tab shows API calls to icloudstore.runasp.net ✅
- [ ] No CORS errors in console ✅

---

## 🎉 Deployment Complete!

Your application is now live:

**Backend API:** https://icloudstore.runasp.net/api  
**Swagger Documentation:** https://icloudstore.runasp.net/swagger  
**Admin Panel:** (Your chosen hosting URL)  
**Storefront:** (Your chosen hosting URL)  

---

## 📝 Common Issues

### Issue: "Cannot GET /"
**Solution:** API root returns nothing - this is normal. Use /swagger or /api/Categories

### Issue: "CORS error in browser"
**Solution:** 
1. Check `appsettings.Production.json` has correct frontend URLs
2. Restart application on RunASP.NET
3. Clear browser cache

### Issue: "500 Internal Server Error"
**Solution:**
1. Check application logs in RunASP panel
2. Verify database connection string
3. Ensure ASPNETCORE_ENVIRONMENT = "Production"

### Issue: "Admin/Storefront shows blank page"
**Solution:**
1. Check browser console for errors
2. Verify index.html exists in deployed folder
3. Check API URL in environment.prod.ts matches deployed backend

---

## 🔄 Update Process (For Future Changes)

### Update Backend Only:
```powershell
cd backend\src\ICloudStore.API
dotnet publish -c Release -o ./publish
# Upload publish/* to RunASP.NET
# Restart application
```

### Update Admin Only:
```powershell
cd frontend\admin
ng build --configuration production
# Upload dist/admin/browser/* to hosting
```

### Update Storefront Only:
```powershell
cd frontend\storefront
ng build --configuration production
# Upload dist/storefront/browser/* to hosting
```

---

## ✅ Checklist Before Going Live

- [ ] Backend deployed and tested
- [ ] Swagger accessible
- [ ] Database seeded with initial data
- [ ] Admin panel deployed and functional
- [ ] Storefront deployed and functional
- [ ] All API calls working (no CORS errors)
- [ ] File uploads working
- [ ] Authentication working
- [ ] Change default admin password
- [ ] Configure real WhatsApp number
- [ ] Update store information in settings
- [ ] Test on mobile devices
- [ ] SSL certificate active (RunASP.NET provides this)

🎊 **Your iCloud Store is ready for customers!**
