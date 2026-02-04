import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الأقسام</h1>
          <p class="text-gray-600 dark:text-gray-400">إدارة أقسام المتجر</p>
        </div>
        <a routerLink="/categories/create" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          إضافة قسم
        </a>
      </div>
      
      <!-- Search & Filter -->
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
              (change)="loadCategories()"
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
        <!-- Categories Table -->
        <div class="admin-table overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-12">#</th>
                <th>الصورة</th>
                <th>الاسم (عربي)</th>
                <th>الاسم (إنجليزي)</th>
                <th>الترتيب</th>
                <th>الحالة</th>
                <th class="w-32">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (category of filteredCategories(); track category.id; let i = $index) {
                <tr>
                  <td class="font-medium">{{ i + 1 }}</td>
                  <td>
                    @if (category.imageUrl) {
                      <img [src]="category.imageUrl" [alt]="category.nameAr" class="w-12 h-12 rounded-lg object-cover"/>
                    } @else {
                      <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                  </td>
                  <td class="font-medium">{{ category.nameAr }}</td>
                  <td>{{ category.nameEn }}</td>
                  <td>{{ category.sortOrder }}</td>
                  <td>
                    @if (category.isActive) {
                      <span class="badge badge-success">نشط</span>
                    } @else {
                      <span class="badge badge-danger">غير نشط</span>
                    }
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <a 
                        [routerLink]="['/categories/edit', category.id]"
                        class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </a>
                      <button 
                        (click)="deleteCategory(category)"
                        class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-12 text-gray-500 dark:text-gray-400">
                    لا توجد أقسام
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2">
            <button 
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="btn-secondary disabled:opacity-50"
            >
              السابق
            </button>
            <span class="px-4 py-2 text-gray-600 dark:text-gray-400">
              {{ currentPage() }} من {{ totalPages() }}
            </span>
            <button 
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="btn-secondary disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        }
      }
      
      <!-- Delete Confirmation Modal -->
      @if (showDeleteModal()) {
        <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="p-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">حذف القسم</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  هل أنت متأكد من حذف "{{ categoryToDelete()?.nameAr }}"؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div class="flex items-center justify-center gap-3">
                  <button 
                    (click)="showDeleteModal.set(false)"
                    class="btn-secondary"
                  >
                    إلغاء
                  </button>
                  <button 
                    (click)="confirmDelete()"
                    class="btn-danger"
                    [disabled]="isDeleting()"
                  >
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
        </div>
      }
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  
  isLoading = signal<boolean>(false);
  searchQuery = '';
  showInactive = true;
  
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  pageSize = 10;
  
  showDeleteModal = signal<boolean>(false);
  categoryToDelete = signal<Category | null>(null);
  isDeleting = signal<boolean>(false);

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getAll(this.currentPage(), this.pageSize, this.showInactive).subscribe({
      next: (response) => {
        if (response.success) {
          this.categories.set(response.data.items);
          this.filteredCategories.set(response.data.items);
          this.totalPages.set(response.data.totalPages);
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
      this.filteredCategories.set(this.categories());
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories.set(
      this.categories().filter(c => 
        c.nameAr.toLowerCase().includes(query) || 
        c.nameEn.toLowerCase().includes(query)
      )
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadCategories();
  }

  deleteCategory(category: Category): void {
    this.categoryToDelete.set(category);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const category = this.categoryToDelete();
    if (!category) return;

    this.isDeleting.set(true);
    this.categoryService.delete(category.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCategories();
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
