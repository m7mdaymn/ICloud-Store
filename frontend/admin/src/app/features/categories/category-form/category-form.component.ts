import { Component, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category, CreateCategoryRequest } from '../../../core/services/category.service';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button 
          (click)="goBack()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ isEditMode() ? 'تعديل القسم' : 'إضافة قسم جديد' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ isEditMode() ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للمتجر' }}
          </p>
        </div>
      </div>
      
      <!-- Form -->
      <form (ngSubmit)="save()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">المعلومات الأساسية</h2>
            
            <!-- Arabic Name -->
            <div>
              <label class="form-label">الاسم بالعربي <span class="text-red-500">*</span></label>
              <input 
                type="text"
                [(ngModel)]="form.nameAr"
                name="nameAr"
                class="form-input"
                required
              />
            </div>
            
            <!-- English Name -->
            <div>
              <label class="form-label">الاسم بالإنجليزي <span class="text-red-500">*</span></label>
              <input 
                type="text"
                [(ngModel)]="form.nameEn"
                name="nameEn"
                class="form-input"
                dir="ltr"
                required
              />
            </div>
            
            <!-- Arabic Description -->
            <div>
              <label class="form-label">الوصف بالعربي</label>
              <textarea 
                [(ngModel)]="form.descriptionAr"
                name="descriptionAr"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
            
            <!-- English Description -->
            <div>
              <label class="form-label">الوصف بالإنجليزي</label>
              <textarea 
                [(ngModel)]="form.descriptionEn"
                name="descriptionEn"
                class="form-input"
                dir="ltr"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <!-- Additional Options -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">خيارات إضافية</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Sort Order -->
              <div>
                <label class="form-label">ترتيب العرض</label>
                <input 
                  type="number"
                  [(ngModel)]="form.sortOrder"
                  name="sortOrder"
                  class="form-input"
                  min="0"
                />
              </div>
              
              <!-- Icon Class -->
              <div>
                <label class="form-label">رمز الأيقونة</label>
                <input 
                  type="text"
                  [(ngModel)]="form.iconClass"
                  name="iconClass"
                  class="form-input"
                  dir="ltr"
                  placeholder="fas fa-mobile-alt"
                />
              </div>
            </div>
            
            <!-- Is Active -->
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  [(ngModel)]="form.isActive"
                  name="isActive"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span class="text-gray-700 dark:text-gray-300">نشط</span>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Image Upload -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">صورة القسم</h2>
            
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              (click)="imageInput.click()"
              (dragover)="$event.preventDefault()"
              (drop)="onDrop($event)"
            >
              @if (form.imageUrl) {
                <div class="relative">
                  <img [src]="form.imageUrl" class="w-full h-40 object-cover rounded-lg"/>
                  <button 
                    type="button"
                    (click)="removeImage($event)"
                    class="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              } @else if (isUploading()) {
                <div class="py-8">
                  <svg class="animate-spin w-8 h-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400 mt-2">جاري الرفع...</p>
                </div>
              } @else {
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">اسحب الصورة أو انقر للاختيار</p>
                <p class="text-sm text-gray-400 mt-1">PNG, JPG حتى 2MB</p>
              }
            </div>
            <input 
              #imageInput
              type="file"
              accept="image/*"
              class="hidden"
              (change)="onFileSelect($event)"
            />
          </div>
          
          <!-- Actions -->
          <div class="admin-card space-y-3">
            <button 
              type="submit"
              class="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2"
              [disabled]="isSaving()"
            >
              @if (isSaving()) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              }
              {{ isEditMode() ? 'حفظ التغييرات' : 'إضافة القسم' }}
            </button>
            <button 
              type="button"
              (click)="goBack()"
              class="w-full btn-secondary py-3"
            >
              إلغاء
            </button>
          </div>
        </div>
      </form>
      
      <!-- Error Message -->
      @if (error()) {
        <div class="admin-card bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
          <p class="text-red-600 dark:text-red-400">{{ error() }}</p>
        </div>
      }
    </div>
  `
})
export class CategoryFormComponent implements OnInit {
  form: CreateCategoryRequest = {
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    imageUrl: '',
    iconClass: '',
    sortOrder: 0,
    isActive: true
  };

  isEditMode = signal<boolean>(false);
  categoryId = signal<number | null>(null);
  
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private categoryService: CategoryService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.categoryId.set(+id);
      this.loadCategory(+id);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const category = response.data;
          this.form = {
            nameAr: category.nameAr,
            nameEn: category.nameEn,
            descriptionAr: category.descriptionAr || '',
            descriptionEn: category.descriptionEn || '',
            imageUrl: category.imageUrl || '',
            iconClass: category.iconClass || '',
            sortOrder: category.sortOrder,
            isActive: category.isActive
          };
        }
      },
      error: () => {
        this.error.set('فشل تحميل بيانات القسم');
      }
    });
  }

  save(): void {
    if (!this.form.nameAr || !this.form.nameEn) {
      this.error.set('يرجى إدخال الاسم بالعربي والإنجليزي');
      return;
    }

    this.isSaving.set(true);
    this.error.set('');

    const request = this.isEditMode()
      ? this.categoryService.update(this.categoryId()!, { ...this.form, id: this.categoryId()! })
      : this.categoryService.create(this.form);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/categories']);
        } else {
          this.error.set(response.message || 'فشل حفظ القسم');
        }
        this.isSaving.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'حدث خطأ أثناء الحفظ');
        this.isSaving.set(false);
      }
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadImage(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.uploadImage(event.dataTransfer.files[0]);
    }
  }

  uploadImage(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.error.set('يرجى اختيار ملف صورة');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.error.set('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
      return;
    }

    this.isUploading.set(true);
    this.fileService.upload(file, 'categories').subscribe({
      next: (response) => {
        if (response.success) {
          this.form.imageUrl = response.data.url;
        }
        this.isUploading.set(false);
      },
      error: () => {
        this.error.set('فشل رفع الصورة');
        this.isUploading.set(false);
      }
    });
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.form.imageUrl = '';
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}
