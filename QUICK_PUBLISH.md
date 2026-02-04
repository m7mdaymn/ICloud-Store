# Quick Publish Commands

## Backend - .NET API

```bash
cd backend/src/ICloudStore.API

# Clean and publish
dotnet clean -c Release
dotnet publish -c Release -o ./publish

# Verify output
dir publish
# Should contain: ICloudStore.API.dll, appsettings.json, web.config, wwwroot/
```

**Upload Location:** All files from `publish/` → RunASP.NET `/site/wwwroot/`

---

## Admin Frontend - Angular

```bash
cd frontend/admin

# Build for production
ng build --configuration production

# Output location
dir dist\admin\browser
```

**Upload Location:** All files from `dist/admin/browser/` → Your static hosting or `/site/wwwroot/wwwroot/admin/`

---

## Storefront Frontend - Angular

```bash
cd frontend/storefront

# Build for production
ng build --configuration production

# Output location
dir dist\storefront\browser
```

**Upload Location:** All files from `dist/storefront/browser/` → Your static hosting or `/site/wwwroot/wwwroot/`

---

## Environment Check

### Backend
- ✅ `appsettings.Production.json` → CORS: `https://icloudstore.runasp.net`
- ✅ `Program.cs` → Swagger enabled in all environments
- ✅ Connection string → db40079.public.databaseasp.net

### Admin Frontend
- ✅ `environment.prod.ts` → apiUrl: `https://icloudstore.runasp.net/api`

### Storefront Frontend
- ✅ `environment.prod.ts` → apiUrl: `https://icloudstore.runasp.net/api`

---

## Test After Deploy

1. **API:** https://icloudstore.runasp.net/api
2. **Swagger:** https://icloudstore.runasp.net/swagger
3. **Test Endpoint:** https://icloudstore.runasp.net/api/Categories

---

## Critical Files Checklist

Before upload, verify these files exist in publish folder:

- [ ] `ICloudStore.API.dll`
- [ ] `appsettings.json`
- [ ] `appsettings.Production.json`
- [ ] `web.config`
- [ ] `wwwroot/uploads/` (create if missing)
- [ ] All dependency DLLs

---

## RunASP.NET Settings

1. **Application Settings:**
   - Name: `ASPNETCORE_ENVIRONMENT`
   - Value: `Production`

2. **File Permissions:**
   - `wwwroot/uploads/` needs write access

3. **After Upload:**
   - Restart application or touch `web.config`
