# iCloud Store Egypt 🇪🇬

A production-ready **LIVE catalog + admin CMS + WhatsApp lead system** for selling mobile devices and accessories in Egypt. This is NOT a full e-commerce solution - it's designed for businesses that convert customers through WhatsApp conversations.

![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![.NET](https://img.shields.io/badge/.NET-9.0-purple?logo=dotnet)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-orange?logo=microsoftsqlserver)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Admin Panel](#admin-panel)
- [Storefront](#storefront)
- [Credentials](#credentials)
- [Deployment](#deployment)

---

## Overview

**iCloud Store** is a digital catalog system designed for Egyptian mobile device retailers. It enables:

- **Showcasing devices** (iPhones, iPads, MacBooks, accessories)
- **Unit-based inventory** for unique devices (each device tracked individually with IMEI, color, condition)
- **Stock-based inventory** for accessories (quantity-based tracking)
- **WhatsApp-first conversions** - No checkout, no online payment, no shipping logic
- **Bilingual support** - Full Arabic (RTL) and English (LTR)
- **Dark/Light theme** with persistent preference

### Business Model

```
Customer Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Browse      │ ──▶ │  Click CTA   │ ──▶ │  WhatsApp    │
│  Catalog     │     │  Button      │     │  Opens       │
└──────────────┘     └──────────────┘     └──────────────┘
                                               │
                          Auto-filled message: │
                    "مرحباً، أريد الاستفسار عن │
                     iPhone 15 Pro Max 256GB   │
                     السعر: 65,000 جنيه"       │
                                               ▼
                                    ┌──────────────┐
                                    │  Sale via    │
                                    │  Conversation│
                                    └──────────────┘
```

---

## Key Features

### 🏪 Catalog Features
- **Categories** - Hierarchical product categories with unlimited nesting
- **Brands** - Device manufacturers (Apple, Samsung, etc.)
- **Products** - Accessories with stock-based inventory
- **Units** - Individual devices with unique attributes:
  - IMEI number tracking
  - Condition (New/Used/Refurbished)
  - Status (Available/Sold/Reserved)
  - Color & Storage variants
  - Original/Current price with discount display
  - Installment options
  - Warranty information
  - Photo gallery

### 📱 Home Page Builder
- **Banner slider** - Hero images with CTA buttons
- **Featured products** - Curated product grids
- **New arrivals** - Auto-populated from latest units
- **Categories showcase** - Visual category navigation
- **Brands carousel** - Brand logo slider
- **Testimonials** - Customer reviews
- **Custom HTML** - Flexible content blocks

### 📊 Lead Tracking
- Every WhatsApp click is logged
- Customer info capture (name, phone, message)
- Target item tracking (which product/unit)
- Source tracking (button location, page)
- Export to Excel for CRM import

### 🎨 Multi-Theme Support
- Light mode (default)
- Dark mode
- Persistent user preference
- System preference detection

### 🌐 Bilingual Support
- Arabic (RTL) - Primary
- English (LTR)
- SEO-friendly language routes (`/ar/...`, `/en/...`)
- Admin panel - Arabic RTL only

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| ASP.NET Core | 9.0 | Web API framework |
| Entity Framework Core | 9.0 | ORM with Code-First |
| SQL Server | 2022 | Database |
| JWT | - | Authentication |
| AutoMapper | 13.0 | Object mapping |
| FluentValidation | 11.9 | Request validation |
| Serilog | 4.0 | Structured logging |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17 | SPA framework |
| TailwindCSS | 3.4 | Utility-first CSS |
| Chart.js | 4.4 | Dashboard charts |
| Angular Signals | - | Reactive state management |
| Swiper | 11 | Touch sliders |

### Architecture
```
Clean Architecture (Backend)
├── Domain        → Entities, Enums, Interfaces
├── Application   → Services, DTOs, Validators
├── Infrastructure → EF Core, Repositories
└── API           → Controllers, Middleware

Feature-Based (Frontend)
├── Core          → Services, Guards, Interceptors
├── Shared        → Components, Pipes, Directives
└── Features      → Lazy-loaded feature modules
```

---

## Project Structure

```
iCloud Store/
├── backend/
│   └── ICloudStore/
│       ├── ICloudStore.Domain/          # Entities & interfaces
│       │   ├── Entities/
│       │   │   ├── Category.cs
│       │   │   ├── Brand.cs
│       │   │   ├── Product.cs
│       │   │   ├── Unit.cs
│       │   │   ├── HomeSectionItem.cs
│       │   │   ├── Lead.cs
│       │   │   ├── User.cs
│       │   │   └── StoreSettings.cs
│       │   ├── Enums/
│       │   └── Interfaces/
│       │
│       ├── ICloudStore.Application/     # Business logic
│       │   ├── DTOs/
│       │   ├── Services/
│       │   ├── Interfaces/
│       │   └── Validators/
│       │
│       ├── ICloudStore.Infrastructure/  # Data access
│       │   ├── Data/
│       │   │   ├── AppDbContext.cs
│       │   │   └── Configurations/
│       │   ├── Repositories/
│       │   └── Services/
│       │
│       └── ICloudStore.API/             # HTTP layer
│           ├── Controllers/
│           ├── Middleware/
│           └── Program.cs
│
├── frontend/
│   ├── storefront/                      # Customer-facing catalog
│   │   ├── src/app/
│   │   │   ├── core/                    # Services, guards
│   │   │   ├── shared/                  # Reusable components
│   │   │   └── features/                # Pages
│   │   │       ├── home/
│   │   │       ├── catalog/
│   │   │       ├── product-detail/
│   │   │       ├── unit-detail/
│   │   │       ├── categories/
│   │   │       └── brands/
│   │   └── ...
│   │
│   └── admin/                           # Arabic RTL admin panel
│       ├── src/app/
│       │   ├── core/                    # Services, guards
│       │   │   └── services/
│       │   │       ├── auth.service.ts
│       │   │       ├── category.service.ts
│       │   │       ├── brand.service.ts
│       │   │       ├── product.service.ts
│       │   │       ├── unit.service.ts
│       │   │       ├── home-section.service.ts
│       │   │       ├── lead.service.ts
│       │   │       ├── settings.service.ts
│       │   │       └── file.service.ts
│       │   ├── layout/
│       │   │   ├── admin-layout/
│       │   │   ├── sidebar/
│       │   │   └── header/
│       │   └── features/
│       │       ├── dashboard/
│       │       ├── categories/
│       │       ├── brands/
│       │       ├── products/
│       │       ├── units/
│       │       ├── home-sections/
│       │       ├── leads/
│       │       ├── settings/
│       │       └── profile/
│       └── ...
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **.NET 9 SDK**
- **Node.js 20+**
- **SQL Server** (or connection to remote SQL Server)
- **Angular CLI 17** (`npm install -g @angular/cli@17`)

### Backend Setup

```bash
# Navigate to API project
cd backend/ICloudStore/ICloudStore.API

# Update connection string in appsettings.json
# (Already configured for remote SQL Server)

# Run migrations
dotnet ef database update --project ../ICloudStore.Infrastructure

# Start API server
dotnet run

# API available at: https://localhost:5001
```

### Frontend Setup - Storefront

```bash
# Navigate to storefront
cd frontend/storefront

# Install dependencies
npm install

# Start development server
ng serve

# Storefront available at: http://localhost:4200
```

### Frontend Setup - Admin Panel

```bash
# Navigate to admin panel
cd frontend/admin

# Install dependencies
npm install

# Start development server
ng serve

# Admin panel available at: http://localhost:4201
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (invalidate token) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories (paginated) |
| GET | `/api/categories/tree` | Get category tree structure |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Soft delete category |
| POST | `/api/categories/reorder` | Reorder categories |

### Brands
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/brands` | List all brands |
| GET | `/api/brands/{id}` | Get brand by ID |
| POST | `/api/brands` | Create brand |
| PUT | `/api/brands/{id}` | Update brand |
| DELETE | `/api/brands/{id}` | Soft delete brand |

### Products (Accessories)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (filterable) |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/{id}/attributes` | Get product attributes |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| PUT | `/api/products/{id}/stock` | Update stock quantity |
| DELETE | `/api/products/{id}` | Soft delete product |

### Units (Devices)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/units` | List units (filterable) |
| GET | `/api/units/{id}` | Get unit by ID |
| GET | `/api/units/available` | Get available units only |
| POST | `/api/units` | Create unit |
| PUT | `/api/units/{id}` | Update unit |
| PUT | `/api/units/{id}/status` | Update unit status |
| DELETE | `/api/units/{id}` | Soft delete unit |

### Home Sections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/home-sections` | List all sections |
| GET | `/api/home-sections/published` | Get active sections |
| POST | `/api/home-sections` | Create section |
| PUT | `/api/home-sections/{id}` | Update section |
| PUT | `/api/home-sections/reorder` | Reorder sections |
| DELETE | `/api/home-sections/{id}` | Delete section |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads (filterable) |
| GET | `/api/leads/stats` | Get lead statistics |
| GET | `/api/leads/export` | Export to Excel |
| POST | `/api/leads` | Create lead (from WhatsApp click) |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get store settings |
| PUT | `/api/settings` | Update store settings |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload single file |
| POST | `/api/files/upload-multiple` | Upload multiple files |
| DELETE | `/api/files/{filename}` | Delete file |

---

## Database Schema

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐
│    Category     │     │      Brand      │
├─────────────────┤     ├─────────────────┤
│ Id              │     │ Id              │
│ NameAr/NameEn   │     │ NameAr/NameEn   │
│ Slug            │     │ Slug            │
│ ImageUrl        │     │ LogoUrl         │
│ ParentId (FK)   │     │ DisplayOrder    │
│ DisplayOrder    │     │ IsActive        │
│ IsActive        │     └─────────────────┘
│ MetaTitle/Desc  │            │
└─────────────────┘            │
        │                      │
        ▼                      ▼
┌─────────────────────────────────────────┐
│                Product                   │
├─────────────────────────────────────────┤
│ Id, NameAr/NameEn, Slug                 │
│ DescriptionAr/En, ShortDescAr/En        │
│ CategoryId (FK), BrandId (FK)           │
│ SKU, Barcode                            │
│ OriginalPrice, CurrentPrice             │
│ StockQuantity, LowStockThreshold        │
│ IsActive, IsFeatured                    │
│ Images (JSON), Attributes (JSON)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                 Unit                     │
├─────────────────────────────────────────┤
│ Id, TitleAr/TitleEn                     │
│ CategoryId (FK), BrandId (FK)           │
│ IMEI, SerialNumber                      │
│ Condition (New/Used/Refurbished)        │
│ Status (Available/Sold/Reserved)        │
│ Color, Storage, RAM                     │
│ OriginalPrice, CurrentPrice             │
│ InstallmentAvailable, MonthlyPayment    │
│ WarrantyType, WarrantyMonths            │
│ DescriptionAr/En, SpecsAr/En            │
│ Images (JSON)                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│               HomeSection                │
├─────────────────────────────────────────┤
│ Id, TitleAr/TitleEn                     │
│ SectionType (Banner/Featured/etc.)      │
│ DisplayOrder                            │
│ IsActive                                │
│ StartDate, EndDate (scheduling)         │
│ BackgroundColor, TextColor              │
│ Items → HomeSectionItem[]               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                 Lead                     │
├─────────────────────────────────────────┤
│ Id                                      │
│ CustomerName, CustomerPhone             │
│ CustomerMessage                         │
│ TargetType (Product/Unit)               │
│ TargetId, TargetTitle, TargetImage      │
│ TargetPrice                             │
│ Source (WhatsApp/Form/Call)             │
│ WhatsAppUrl (generated deep link)       │
│ PageUrl, ButtonLocation                 │
│ CreatedAt                               │
└─────────────────────────────────────────┘
```

### Enums

```csharp
// Unit Condition
public enum UnitCondition { New = 0, Used = 1, Refurbished = 2 }

// Unit Status
public enum UnitStatus { Available = 0, Reserved = 1, Sold = 2 }

// Warranty Type
public enum WarrantyType { None = 0, Store = 1, Distributor = 2, International = 3 }

// Lead Source
public enum LeadSource { WhatsApp = 0, InquiryForm = 1, CallRequest = 2, Other = 3 }

// Home Section Type
public enum HomeSectionType { 
    Banner = 0,
    FeaturedProducts = 1,
    NewArrivals = 2,
    Categories = 3,
    Brands = 4,
    Testimonials = 5,
    CustomHtml = 6
}
```

---

## Admin Panel

### Dashboard
- **Stats cards** - Total products, units, leads, revenue
- **Charts** - Sales trend, leads by source
- **Quick actions** - Add unit, view leads
- **Recent activity** - Latest leads and units

### Categories Management
- Tree view with drag-drop reordering
- Image upload
- SEO fields (meta title, description)
- Parent/child relationships

### Brands Management
- Logo upload
- Display order
- Active/inactive toggle

### Products Management (Accessories)
- Grid/list view toggle
- Stock tracking
- Low stock alerts
- Attribute management
- Multiple image upload

### Units Management (Devices)
- **Filters**: Category, Brand, Condition, Status
- **Fields**: IMEI, serial, color, storage, RAM
- **Pricing**: Original, current, discount
- **Installments**: Available flag, monthly amount
- **Warranty**: Type, months remaining
- **Gallery**: Multiple images with primary selection

### Home Sections Builder
- Drag-drop section ordering
- 7 section types
- Scheduling (start/end date)
- Preview functionality

### Leads Log
- Date range filter
- Source filter
- Export to Excel
- Stats overview

### Settings
- Store info (bilingual)
- Contact details
- WhatsApp number
- Social links
- Theme colors
- Working hours

---

## Storefront

### Routes

```
/ar/                    → Arabic home page
/en/                    → English home page
/ar/catalog             → Arabic catalog (all products/units)
/en/catalog             → English catalog
/ar/category/:slug      → Arabic category page
/en/category/:slug      → English category page
/ar/product/:slug       → Arabic product detail
/en/product/:slug       → English product detail
/ar/unit/:id            → Arabic unit detail
/en/unit/:id            → English unit detail
/ar/brands              → Arabic brands page
/en/brands              → English brands page
```

### Components
- **Header** - Language switcher, theme toggle, navigation
- **Footer** - Contact info, social links, quick links
- **Product Card** - Image, title, price, WhatsApp button
- **Unit Card** - Condition badge, status, price
- **WhatsApp Button** - Generates deep link with auto-message
- **Category Card** - Image, title, product count
- **Brand Logo** - Clickable brand filter

---

## Credentials

### Admin Panel

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@icloudstore.eg | Admin@123 |
| Staff | staff@icloudstore.eg | Staff@123 |

### Database

```
Server: db40079.public.databaseasp.net
Database: db40079
User: db40079
Password: qN%5F3a=?pR4
```

---

## Deployment

### Backend (IIS / Azure App Service)

```bash
# Publish
cd backend/ICloudStore/ICloudStore.API
dotnet publish -c Release -o ./publish

# Deploy to IIS or Azure
# Ensure connection string is in production appsettings
```

### Frontend (Nginx / CDN)

```bash
# Build storefront
cd frontend/storefront
ng build --configuration=production

# Build admin
cd frontend/admin
ng build --configuration=production

# Deploy dist folders to web server
```

### Environment Variables

```
# Backend
ConnectionStrings__DefaultConnection=<sql-connection-string>
JwtSettings__Secret=<256-bit-secret>
JwtSettings__Issuer=icloudstore.eg
JwtSettings__Audience=icloudstore.eg

# Frontend
API_URL=https://api.icloudstore.eg
```

---

## Features Summary

| Feature | Status |
|---------|--------|
| ✅ Clean Architecture Backend | Complete |
| ✅ JWT Authentication | Complete |
| ✅ Categories CRUD | Complete |
| ✅ Brands CRUD | Complete |
| ✅ Products CRUD (Stock-based) | Complete |
| ✅ Units CRUD (Unit-based) | Complete |
| ✅ Home Sections Builder | Complete |
| ✅ Lead Tracking | Complete |
| ✅ WhatsApp Integration | Complete |
| ✅ Bilingual Support (AR/EN) | Complete |
| ✅ RTL/LTR Support | Complete |
| ✅ Dark/Light Theme | Complete |
| ✅ Admin Panel (Arabic RTL) | Complete |
| ✅ Storefront (Bilingual) | Complete |
| ✅ Responsive Design | Complete |
| ✅ SEO Optimization | Complete |
| ✅ Image Upload | Complete |
| ✅ Excel Export | Complete |

---

## License

This project is proprietary software developed for iCloud Store Egypt.

---

## Support

For technical support, contact the development team.

---

**Built with ❤️ for the Egyptian market**
