import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect root to default language
  {
    path: '',
    redirectTo: 'ar',
    pathMatch: 'full'
  },
  // Arabic routes
  {
    path: 'ar',
    children: [
      {
        path: '',
        loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent),
        data: { language: 'ar' }
      },
      {
        path: 'categories',
        loadComponent: () => import('@features/categories/categories.component').then(m => m.CategoriesComponent),
        data: { language: 'ar' }
      },
      {
        path: 'category/:slug',
        loadComponent: () => import('@features/category/category.component').then(m => m.CategoryComponent),
        data: { language: 'ar' }
      },
      {
        path: 'units',
        loadComponent: () => import('@features/units/units.component').then(m => m.UnitsComponent),
        data: { language: 'ar' }
      },
      {
        path: 'unit/:id',
        loadComponent: () => import('@features/unit-details/unit-details.component').then(m => m.UnitDetailsComponent),
        data: { language: 'ar' }
      },
      {
        path: 'accessories',
        loadComponent: () => import('@features/accessories/accessories.component').then(m => m.AccessoriesComponent),
        data: { language: 'ar' }
      },
      {
        path: 'product/:id',
        loadComponent: () => import('@features/product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: { language: 'ar' }
      },
      {
        path: 'wishlist',
        loadComponent: () => import('@features/wishlist/wishlist.component').then(m => m.WishlistComponent),
        data: { language: 'ar' }
      },
      {
        path: 'search',
        loadComponent: () => import('@features/search/search.component').then(m => m.SearchComponent),
        data: { language: 'ar' }
      },
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent),
        data: { language: 'ar' }
      },
      {
        path: 'register',
        loadComponent: () => import('@features/auth/register/register.component').then(m => m.RegisterComponent),
        data: { language: 'ar' }
      }
    ]
  },
  // English routes
  {
    path: 'en',
    children: [
      {
        path: '',
        loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent),
        data: { language: 'en' }
      },
      {
        path: 'categories',
        loadComponent: () => import('@features/categories/categories.component').then(m => m.CategoriesComponent),
        data: { language: 'en' }
      },
      {
        path: 'category/:slug',
        loadComponent: () => import('@features/category/category.component').then(m => m.CategoryComponent),
        data: { language: 'en' }
      },
      {
        path: 'units',
        loadComponent: () => import('@features/units/units.component').then(m => m.UnitsComponent),
        data: { language: 'en' }
      },
      {
        path: 'unit/:id',
        loadComponent: () => import('@features/unit-details/unit-details.component').then(m => m.UnitDetailsComponent),
        data: { language: 'en' }
      },
      {
        path: 'accessories',
        loadComponent: () => import('@features/accessories/accessories.component').then(m => m.AccessoriesComponent),
        data: { language: 'en' }
      },
      {
        path: 'product/:id',
        loadComponent: () => import('@features/product-details/product-details.component').then(m => m.ProductDetailsComponent),
        data: { language: 'en' }
      },
      {
        path: 'wishlist',
        loadComponent: () => import('@features/wishlist/wishlist.component').then(m => m.WishlistComponent),
        data: { language: 'en' }
      },
      {
        path: 'search',
        loadComponent: () => import('@features/search/search.component').then(m => m.SearchComponent),
        data: { language: 'en' }
      },
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent),
        data: { language: 'en' }
      },
      {
        path: 'register',
        loadComponent: () => import('@features/auth/register/register.component').then(m => m.RegisterComponent),
        data: { language: 'en' }
      }
    ]
  },
  // Fallback
  {
    path: '**',
    redirectTo: 'ar'
  }
];
