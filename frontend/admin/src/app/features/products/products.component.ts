import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductFilterParams } from '../../core/services/product.service';
import { CategoryService, Category } from '../../core/services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الإكسسوارات</h1>
          <p class="text-gray-600 dark:text-gray-400">إدارة المنتجات والإكسسوارات</p>
        </div>
        <a routerLink="/products/create" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة منتج
        </a>
      </div>
      
      <div class="admin-card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" [(ngModel)]="filters.search" (input)="loadProducts()" placeholder="بحث..." class="form-input"/>
          <select [(ngModel)]="filters.categoryId" (change)="loadProducts()" class="form-input">
            <option [ngValue]="undefined">جميع الأقسام</option>
            @for (cat of categories(); track cat.id) {
              <option [ngValue]="cat.id">{{ cat.nameAr }}</option>
            }
          </select>
          <select [(ngModel)]="filters.inStock" (change)="loadProducts()" class="form-input">
            <option [ngValue]="undefined">الكل</option>
            <option [ngValue]="true">متوفر</option>
            <option [ngValue]="false">غير متوفر</option>
          </select>
          <select [(ngModel)]="filters.lowStock" (change)="loadProducts()" class="form-input">
            <option [ngValue]="undefined">الكل</option>
            <option [ngValue]="true">مخزون منخفض</option>
          </select>
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
                <th>الصورة</th>
                <th>الاسم</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td>
                    @if (product.thumbnailUrl) {
                      <img [src]="product.thumbnailUrl" class="w-14 h-14 rounded-lg object-cover"/>
                    } @else {
                      <div class="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4"/>
                        </svg>
                      </div>
                    }
                  </td>
                  <td>
                    <p class="font-medium text-gray-800 dark:text-white">{{ product.nameAr }}</p>
                    <p class="text-sm text-gray-500">{{ product.categoryName }}</p>
                  </td>
                  <td class="font-semibold text-green-600">{{ product.price | number }} جنيه</td>
                  <td>
                    <span [class]="product.stockQuantity <= product.lowStockThreshold ? 'text-red-600 font-semibold' : ''">
                      {{ product.stockQuantity }}
                    </span>
                  </td>
                  <td>
                    @if (product.isActive) {
                      <span class="badge badge-success">نشط</span>
                    } @else {
                      <span class="badge badge-danger">غير نشط</span>
                    }
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <a [routerLink]="['/products/edit', product.id]" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <button (click)="deleteProduct(product)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="text-center py-12 text-gray-500">لا توجد منتجات</td></tr>
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
      
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
          <div class="modal-content p-6 text-center" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold mb-4">حذف المنتج</h3>
            <p class="text-gray-600 mb-6">هل أنت متأكد من حذف "{{ productToDelete()?.nameAr }}"؟</p>
            <div class="flex justify-center gap-3">
              <button (click)="showDeleteModal.set(false)" class="btn-secondary">إلغاء</button>
              <button (click)="confirmDelete()" class="btn-danger">حذف</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  filters: ProductFilterParams = { pageNumber: 1, pageSize: 10 };
  
  showDeleteModal = signal<boolean>(false);
  productToDelete = signal<Product | null>(null);

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll(1, 100, false).subscribe({
      next: (r) => r.success && this.categories.set(r.data.items)
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.filters.pageNumber = this.currentPage();
    this.productService.getAll(this.filters).subscribe({
      next: (r) => {
        if (r.success) {
          this.products.set(r.data.items);
          this.totalPages.set(r.data.totalPages);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.showDeleteModal.set(false);
      }
    });
  }
}
