import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UnitService, UnitStatus } from '../../core/services/unit.service';
import { ProductService } from '../../core/services/product.service';
import { LeadService, LeadStats } from '../../core/services/lead.service';
import { catchError, of } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
          <p class="text-gray-600 dark:text-gray-400">مرحباً بك في لوحة تحكم آي كلاود ستور</p>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentDate }}
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Units -->
        <div class="stats-card">
          <div class="stats-icon bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الوحدات</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalUnits() }}</p>
            <p class="text-xs text-green-600">{{ availableUnits() }} متاح</p>
          </div>
        </div>
        
        <!-- Total Products -->
        <div class="stats-card">
          <div class="stats-icon bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">الإكسسوارات</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalProducts() }}</p>
            <p class="text-xs text-yellow-600">{{ lowStockProducts() }} مخزون منخفض</p>
          </div>
        </div>
        
        <!-- Today Leads -->
        <div class="stats-card">
          <div class="stats-icon bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">طلبات اليوم</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ todayLeads() }}</p>
            <p class="text-xs text-blue-600">استفسارات العملاء</p>
          </div>
        </div>
        
        <!-- Total Leads - Hidden since we don't have historical data -->
        <div class="stats-card" style="opacity: 0.6;">
          <div class="stats-icon bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">-</p>
            <p class="text-xs text-gray-500">غير متوفر</p>
          </div>
        </div>
      </div>
      
      <!-- Charts Row - Hidden since backend doesn't provide chart data -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" style="display: none;">
        <!-- Leads Chart -->
        <div class="admin-card">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">طلبات العملاء (آخر 7 أيام)</h3>
          <div class="h-64">
            <canvas id="leadsChart"></canvas>
          </div>
        </div>
        
        <!-- Inventory Status -->
        <div class="admin-card">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">حالة المخزون</h3>
          <div class="h-64">
            <canvas id="inventoryChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a routerLink="/units/create" class="admin-card hover:shadow-md transition-shadow cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">إضافة وحدة</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">جهاز جديد</p>
            </div>
          </div>
        </a>
        
        <a routerLink="/products/create" class="admin-card hover:shadow-md transition-shadow cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">إضافة إكسسوار</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">منتج جديد</p>
            </div>
          </div>
        </a>
        
        <a routerLink="/leads" class="admin-card hover:shadow-md transition-shadow cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">الطلبات</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">عرض الطلبات</p>
            </div>
          </div>
        </a>
        
        <a routerLink="/home-sections" class="admin-card hover:shadow-md transition-shadow cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">الصفحة الرئيسية</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">إدارة الأقسام</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Computed stats from actual data
  totalUnits = signal<number>(0);
  availableUnits = signal<number>(0);
  totalProducts = signal<number>(0);
  lowStockProducts = signal<number>(0);
  todayLeads = signal<number>(0);

  constructor(
    private unitService: UnitService,
    private productService: ProductService,
    private leadService: LeadService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load Units Stats
    this.unitService.getAll({ pageNumber: 1, pageSize: 1 })
      .pipe(catchError(err => {
        console.error('Failed to load units stats:', err);
        return of({ success: false, data: null });
      }))
      .subscribe(response => {
        if (response.success && response.data) {
          this.totalUnits.set(response.data.totalCount || 0);
          // Count available units by fetching with status filter
          this.unitService.getAll({ pageNumber: 1, pageSize: 1000 })
            .pipe(catchError(() => of({ success: false, data: null })))
            .subscribe(allResponse => {
              if (allResponse.success && allResponse.data?.items) {
                const available = allResponse.data.items.filter(u => u.status === UnitStatus.Available).length;
                this.availableUnits.set(available);
              }
            });
        }
      });

    // Load Products Stats
    this.productService.getAll({ pageNumber: 1, pageSize: 1 })
      .pipe(catchError(err => {
        console.error('Failed to load products stats:', err);
        return of({ success: false, data: null });
      }))
      .subscribe(response => {
        if (response.success && response.data) {
          this.totalProducts.set(response.data.totalCount || 0);
          // Count low stock products
          this.productService.getAll({ pageNumber: 1, pageSize: 1000 })
            .pipe(catchError(() => of({ success: false, data: null })))
            .subscribe(allResponse => {
              if (allResponse.success && allResponse.data?.items) {
                const lowStock = allResponse.data.items.filter(p => 
                  p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0
                ).length;
                this.lowStockProducts.set(lowStock);
              }
            });
        }
      });

    // Load Today's Leads Count
    this.leadService.getTodayCount()
      .pipe(catchError(err => {
        console.error('Failed to load leads stats:', err);
        return of({ success: false, data: null });
      }))
      .subscribe(response => {
        if (response.success && response.data) {
          this.todayLeads.set(response.data.todayCount || 0);
        }
      });
  }
}
