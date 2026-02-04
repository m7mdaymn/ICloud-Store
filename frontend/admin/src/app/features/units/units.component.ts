import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UnitService, Unit, UnitCondition, UnitStatus, UnitFilterParams } from '../../core/services/unit.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { BrandService, Brand } from '../../core/services/brand.service';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الوحدات (الأجهزة)</h1>
          <p class="text-gray-600 dark:text-gray-400">إدارة الأجهزة المتاحة للبيع</p>
        </div>
        <a routerLink="/units/create" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة وحدة جديدة
        </a>
      </div>
      
      <!-- Filters -->
      <div class="admin-card">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            type="text"
            [(ngModel)]="filters.search"
            (input)="loadUnits()"
            placeholder="بحث..."
            class="form-input"
          />
          <select [(ngModel)]="filters.categoryId" (change)="loadUnits()" class="form-input">
            <option [ngValue]="undefined">جميع الأقسام</option>
            @for (cat of categories(); track cat.id) {
              <option [ngValue]="cat.id">{{ cat.nameAr }}</option>
            }
          </select>
          <select [(ngModel)]="filters.brandId" (change)="loadUnits()" class="form-input">
            <option [ngValue]="undefined">جميع العلامات</option>
            @for (brand of brands(); track brand.id) {
              <option [ngValue]="brand.id">{{ brand.nameAr }}</option>
            }
          </select>
          <select [(ngModel)]="filters.condition" (change)="loadUnits()" class="form-input">
            <option [ngValue]="undefined">جميع الحالات</option>
            <option [ngValue]="0">جديد</option>
            <option [ngValue]="1">مستعمل - ممتاز</option>
            <option [ngValue]="2">مستعمل - جيد جداً</option>
            <option [ngValue]="3">مستعمل - جيد</option>
            <option [ngValue]="4">مستعمل - مقبول</option>
          </select>
          <select [(ngModel)]="filters.status" (change)="loadUnits()" class="form-input">
            <option [ngValue]="undefined">جميع الحالات</option>
            <option [ngValue]="0">متاح</option>
            <option [ngValue]="1">محجوز</option>
            <option [ngValue]="2">مباع</option>
            <option [ngValue]="3">مخفي</option>
          </select>
        </div>
      </div>
      
      <!-- Loading -->
      @if (isLoading()) {
        <div class="admin-card flex items-center justify-center py-12">
          <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else {
        <!-- Units Table -->
        <div class="admin-table overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>العنوان</th>
                <th>SKU</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>حالة المخزون</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (unit of units(); track unit.id) {
                <tr>
                  <td>
                    @if (unit.thumbnailUrl) {
                      <img [src]="unit.thumbnailUrl" [alt]="unit.titleAr" class="w-14 h-14 rounded-lg object-cover"/>
                    } @else {
                      <div class="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                  </td>
                  <td>
                    <div>
                      <p class="font-medium text-gray-800 dark:text-white">{{ unit.titleAr }}</p>
                      <p class="text-sm text-gray-500">{{ unit.brandName }} - {{ unit.categoryName }}</p>
                    </div>
                  </td>
                  <td class="font-mono text-sm">{{ unit.sku }}</td>
                  <td>
                    <span class="font-semibold text-green-600">{{ unit.price | number }} جنيه</span>
                    @if (unit.originalPrice && unit.originalPrice > unit.price) {
                      <span class="text-sm text-gray-400 line-through block">{{ unit.originalPrice | number }}</span>
                    }
                  </td>
                  <td>
                    <span class="badge" [class]="getConditionClass(unit.condition)">
                      {{ getConditionLabel(unit.condition) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [class]="getStatusClass(unit.status)">
                      {{ getStatusLabel(unit.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <a [routerLink]="['/units/edit', unit.id]" 
                        class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <button (click)="deleteUnit(unit)" 
                        class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-12 text-gray-500">لا توجد وحدات</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2">
            <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() === 1" class="btn-secondary">السابق</button>
            <span class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ currentPage() }} من {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() === totalPages()" class="btn-secondary">التالي</button>
          </div>
        }
      }
      
      <!-- Delete Modal -->
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
          <div class="modal-content p-6 text-center" (click)="$event.stopPropagation()">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">حذف الوحدة</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">هل أنت متأكد من حذف "{{ unitToDelete()?.titleAr }}"؟</p>
            <div class="flex justify-center gap-3">
              <button (click)="showDeleteModal.set(false)" class="btn-secondary">إلغاء</button>
              <button (click)="confirmDelete()" class="btn-danger" [disabled]="isDeleting()">
                @if (isDeleting()) { جاري الحذف... } @else { حذف }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UnitsComponent implements OnInit {
  units = signal<Unit[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  
  filters: UnitFilterParams = {
    pageNumber: 1,
    pageSize: 10
  };
  
  showDeleteModal = signal<boolean>(false);
  unitToDelete = signal<Unit | null>(null);
  isDeleting = signal<boolean>(false);

  constructor(
    private unitService: UnitService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadUnits();
  }

  loadCategories(): void {
    this.categoryService.getAll(1, 100, false).subscribe({
      next: (r) => r.success && this.categories.set(r.data.items)
    });
  }

  loadBrands(): void {
    this.brandService.getAll(1, 100, false).subscribe({
      next: (r) => r.success && this.brands.set(r.data.items)
    });
  }

  loadUnits(): void {
    this.isLoading.set(true);
    this.filters.pageNumber = this.currentPage();
    this.unitService.getAll(this.filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.units.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadUnits();
  }

  getConditionLabel(condition: UnitCondition): string {
    const labels: Record<number, string> = {
      0: 'جديد', 1: 'ممتاز', 2: 'جيد جداً', 3: 'جيد', 4: 'مقبول'
    };
    return labels[condition] || '';
  }

  getConditionClass(condition: UnitCondition): string {
    return condition === 0 ? 'badge-success' : 'badge-info';
  }

  getStatusLabel(status: UnitStatus): string {
    const labels: Record<number, string> = {
      0: 'متاح', 1: 'محجوز', 2: 'مباع', 3: 'مخفي'
    };
    return labels[status] || '';
  }

  getStatusClass(status: UnitStatus): string {
    const classes: Record<number, string> = {
      0: 'badge-success', 1: 'badge-warning', 2: 'badge-danger', 3: 'badge-info'
    };
    return classes[status] || 'badge-info';
  }

  deleteUnit(unit: Unit): void {
    this.unitToDelete.set(unit);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const unit = this.unitToDelete();
    if (!unit) return;

    this.isDeleting.set(true);
    this.unitService.delete(unit.id).subscribe({
      next: () => {
        this.loadUnits();
        this.showDeleteModal.set(false);
        this.isDeleting.set(false);
      },
      error: () => this.isDeleting.set(false)
    });
  }
}
