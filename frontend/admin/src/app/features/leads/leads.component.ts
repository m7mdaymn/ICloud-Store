import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService, Lead, LeadFilterParams, LeadSource } from '../../core/services/lead.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">طلبات العملاء</h1>
          <p class="text-gray-600 dark:text-gray-400">سجل الاستفسارات والطلبات عبر WhatsApp</p>
        </div>
        <button (click)="exportLeads()" class="btn-secondary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          تصدير Excel
        </button>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="admin-card" style="opacity: 0.6;">
          <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">-</p>
        </div>
        <div class="admin-card">
          <p class="text-sm text-gray-600 dark:text-gray-400">اليوم</p>
          <p class="text-2xl font-bold text-green-600">{{ stats()?.todayLeads || 0 }}</p>
        </div>
        <div class="admin-card" style="opacity: 0.6;">
          <p class="text-sm text-gray-600 dark:text-gray-400">هذا الأسبوع</p>
          <p class="text-2xl font-bold text-blue-600">-</p>
        </div>
        <div class="admin-card" style="opacity: 0.6;">
          <p class="text-sm text-gray-600 dark:text-gray-400">هذا الشهر</p>
          <p class="text-2xl font-bold text-purple-600">-</p>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="admin-card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" [(ngModel)]="filters.search" (input)="loadLeads()" placeholder="بحث..." class="form-input"/>
          <select [(ngModel)]="filters.source" (change)="loadLeads()" class="form-input">
            <option [ngValue]="undefined">جميع المصادر</option>
            <option [ngValue]="0">WhatsApp</option>
            <option [ngValue]="1">نموذج استفسار</option>
            <option [ngValue]="2">طلب اتصال</option>
          </select>
          <input type="date" [(ngModel)]="filters.startDate" (change)="loadLeads()" class="form-input"/>
          <input type="date" [(ngModel)]="filters.endDate" (change)="loadLeads()" class="form-input"/>
        </div>
      </div>
      
      @if (isLoading()) {
        <div class="admin-card flex items-center justify-center py-12">
          <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else {
        <div class="admin-table overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>العميل</th>
                <th>المنتج/الوحدة</th>
                <th>السعر</th>
                <th>المصدر</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (lead of leads(); track lead.id) {
                <tr>
                  <td>
                    <p class="font-medium">{{ lead.createdAt | date:'shortDate' }}</p>
                    <p class="text-sm text-gray-500">{{ lead.createdAt | date:'shortTime' }}</p>
                  </td>
                  <td>
                    <p class="font-medium">{{ lead.customerName || 'زائر' }}</p>
                    @if (lead.customerPhone) {
                      <p class="text-sm text-gray-500">{{ lead.customerPhone }}</p>
                    }
                  </td>
                  <td>
                    <div class="flex items-center gap-3">
                      @if (lead.targetImage) {
                        <img [src]="lead.targetImage" class="w-10 h-10 rounded object-cover"/>
                      }
                      <div>
                        <p class="font-medium">{{ lead.targetTitle }}</p>
                        <p class="text-sm text-gray-500">{{ lead.targetType }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="font-semibold text-green-600">
                    {{ lead.targetPrice | number }} جنيه
                  </td>
                  <td>
                    <span class="badge" [class]="getSourceClass(lead.source)">
                      {{ getSourceLabel(lead.source) }}
                    </span>
                  </td>
                  <td>
                    @if (lead.whatsAppUrl) {
                      <a [href]="lead.whatsAppUrl" target="_blank" class="text-green-600 hover:text-green-700">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="text-center py-12 text-gray-500">لا توجد طلبات</td></tr>
              }
            </tbody>
          </table>
        </div>
        
        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2">
            <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1" class="btn-secondary">السابق</button>
            <span class="px-4 py-2 text-gray-600">{{ currentPage() }} من {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="btn-secondary">التالي</button>
          </div>
        }
      }
    </div>
  `
})
export class LeadsComponent implements OnInit {
  leads = signal<Lead[]>([]);
  stats = signal<any>(null);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  filters: LeadFilterParams = { pageNumber: 1, pageSize: 20 };

  constructor(private leadService: LeadService) {}

  ngOnInit(): void {
    this.loadLeads();
    this.loadStats();
  }

  loadLeads(): void {
    this.isLoading.set(true);
    this.filters.pageNumber = this.currentPage();
    this.leadService.getAll(this.filters).subscribe({
      next: (r) => {
        if (r.success) {
          this.leads.set(r.data.items);
          this.totalPages.set(r.data.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadStats(): void {
    this.leadService.getTodayCount().subscribe({
      next: (r) => {
        if (r.success && r.data) {
          this.stats.set({ todayLeads: r.data.todayCount });
        }
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadLeads();
  }

  getSourceLabel(source: LeadSource): string {
    const labels: Record<number, string> = { 0: 'WhatsApp', 1: 'نموذج', 2: 'اتصال', 3: 'أخرى' };
    return labels[source] || '';
  }

  getSourceClass(source: LeadSource): string {
    const classes: Record<number, string> = { 0: 'badge-success', 1: 'badge-info', 2: 'badge-warning', 3: 'badge-info' };
    return classes[source] || 'badge-info';
  }

  exportLeads(): void {
    this.leadService.exportToExcel(this.filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
