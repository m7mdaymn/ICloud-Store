import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrandService, Brand } from '../../core/services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">العلامات التجارية</h1>
          <p class="text-gray-600 dark:text-gray-400">إدارة العلامات التجارية</p>
        </div>
        <a routerLink="/brands/create" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة علامة تجارية
        </a>
      </div>
      
      <!-- Search -->
      <div class="admin-card">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <input 
              type="text"
              [(ngModel)]="searchQuery"
              (input)="search()"
              placeholder="بحث بالاسم..."
              class="form-input"
            />
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              [(ngModel)]="showInactive"
              (change)="loadBrands()"
              class="w-4 h-4 rounded border-gray-300"
            />
            <span class="text-gray-600 dark:text-gray-400">عرض غير النشط</span>
          </label>
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
        <!-- Brands Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (brand of filteredBrands(); track brand.id) {
            <div class="admin-card hover:shadow-md transition-shadow">
              <div class="flex items-start gap-4">
                @if (brand.logoUrl) {
                  <img [src]="brand.logoUrl" [alt]="brand.nameAr" class="w-16 h-16 rounded-xl object-contain bg-gray-100 dark:bg-gray-700 p-2"/>
                } @else {
                  <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-400">{{ brand.nameEn.charAt(0) }}</span>
                  </div>
                }
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 dark:text-white truncate">{{ brand.nameAr }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400" dir="ltr">{{ brand.nameEn }}</p>
                  <div class="mt-2">
                    @if (brand.isActive) {
                      <span class="badge badge-success">نشط</span>
                    } @else {
                      <span class="badge badge-danger">غير نشط</span>
                    }
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a 
                  [routerLink]="['/brands/edit', brand.id]"
                  class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="تعديل"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </a>
                <button 
                  (click)="deleteBrand(brand)"
                  class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="حذف"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full admin-card text-center py-12 text-gray-500 dark:text-gray-400">
              لا توجد علامات تجارية
            </div>
          }
        </div>
      }
      
      <!-- Delete Modal -->
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">حذف العلامة التجارية</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                هل أنت متأكد من حذف "{{ brandToDelete()?.nameAr }}"؟
              </p>
              <div class="flex items-center justify-center gap-3">
                <button (click)="showDeleteModal.set(false)" class="btn-secondary">إلغاء</button>
                <button (click)="confirmDelete()" class="btn-danger" [disabled]="isDeleting()">
                  @if (isDeleting()) {
                    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  } @else {
                    حذف
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BrandsComponent implements OnInit {
  brands = signal<Brand[]>([]);
  filteredBrands = signal<Brand[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = '';
  showInactive = true;
  
  showDeleteModal = signal<boolean>(false);
  brandToDelete = signal<Brand | null>(null);
  isDeleting = signal<boolean>(false);

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    this.brandService.getAll(1, 100, this.showInactive).subscribe({
      next: (response) => {
        if (response.success) {
          this.brands.set(response.data.items);
          this.filteredBrands.set(response.data.items);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  search(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBrands.set(this.brands());
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredBrands.set(
      this.brands().filter(b => 
        b.nameAr.toLowerCase().includes(query) || 
        b.nameEn.toLowerCase().includes(query)
      )
    );
  }

  deleteBrand(brand: Brand): void {
    this.brandToDelete.set(brand);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const brand = this.brandToDelete();
    if (!brand) return;

    this.isDeleting.set(true);
    this.brandService.delete(brand.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBrands();
        }
        this.showDeleteModal.set(false);
        this.isDeleting.set(false);
      },
      error: () => {
        this.isDeleting.set(false);
      }
    });
  }
}
