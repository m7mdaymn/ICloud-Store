import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'categories/create',
        loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent)
      },
      {
        path: 'brands/create',
        loadComponent: () => import('./features/brands/brand-form/brand-form.component').then(m => m.BrandFormComponent)
      },
      {
        path: 'brands/edit/:id',
        loadComponent: () => import('./features/brands/brand-form/brand-form.component').then(m => m.BrandFormComponent)
      },
      {
        path: 'units',
        loadComponent: () => import('./features/units/units.component').then(m => m.UnitsComponent)
      },
      {
        path: 'units/create',
        loadComponent: () => import('./features/units/unit-form/unit-form.component').then(m => m.UnitFormComponent)
      },
      {
        path: 'units/edit/:id',
        loadComponent: () => import('./features/units/unit-form/unit-form.component').then(m => m.UnitFormComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/create',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'home-sections',
        loadComponent: () => import('./features/home-sections/home-sections.component').then(m => m.HomeSectionsComponent)
      },
      {
        path: 'home-sections/create',
        loadComponent: () => import('./features/home-sections/home-section-form/home-section-form.component').then(m => m.HomeSectionFormComponent)
      },
      {
        path: 'home-sections/edit/:id',
        loadComponent: () => import('./features/home-sections/home-section-form/home-section-form.component').then(m => m.HomeSectionFormComponent)
      },
      {
        path: 'leads',
        loadComponent: () => import('./features/leads/leads.component').then(m => m.LeadsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
