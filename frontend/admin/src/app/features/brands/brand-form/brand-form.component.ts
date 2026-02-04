import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrandService, CreateBrandRequest } from '../../../core/services/brand.service';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ isEditMode() ? 'تعديل العلامة التجارية' : 'إضافة علامة تجارية' }}
          </h1>
        </div>
      </div>
      
      <!-- Form -->
      <form (ngSubmit)="save()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">المعلومات الأساسية</h2>
            
            <div>
              <label class="form-label">الاسم بالعربي <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="form.nameAr" name="nameAr" class="form-input" required/>
            </div>
            
            <div>
              <label class="form-label">الاسم بالإنجليزي <span class="text-red-500">*</span></label>
              <input type="text" [(ngModel)]="form.nameEn" name="nameEn" class="form-input" dir="ltr" required/>
            </div>
            
            <div>
              <label class="form-label">ترتيب العرض</label>
              <input type="number" [(ngModel)]="form.sortOrder" name="sortOrder" class="form-input" min="0"/>
            </div>
            
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" class="sr-only peer"/>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span class="text-gray-700 dark:text-gray-300">نشط</span>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Logo Upload -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الشعار</h2>
            
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              (click)="imageInput.click()"
            >
              @if (form.logoUrl) {
                <div class="relative">
                  <img [src]="form.logoUrl" class="w-full h-32 object-contain"/>
                  <button type="button" (click)="removeImage($event)" class="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              } @else if (isUploading()) {
                <svg class="animate-spin w-8 h-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              } @else {
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">اختر شعار العلامة</p>
              }
            </div>
            <input #imageInput type="file" accept="image/*" class="hidden" (change)="onFileSelect($event)"/>
          </div>
          
          <!-- Actions -->
          <div class="admin-card space-y-3">
            <button type="submit" class="w-full btn-primary py-3 font-semibold" [disabled]="isSaving()">
              @if (isSaving()) {
                <svg class="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              } @else {
                {{ isEditMode() ? 'حفظ التغييرات' : 'إضافة العلامة' }}
              }
            </button>
            <button type="button" (click)="goBack()" class="w-full btn-secondary py-3">إلغاء</button>
          </div>
        </div>
      </form>
      
      @if (error()) {
        <div class="admin-card bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
          <p class="text-red-600 dark:text-red-400">{{ error() }}</p>
        </div>
      }
    </div>
  `
})
export class BrandFormComponent implements OnInit {
  form: CreateBrandRequest = {
    nameAr: '',
    nameEn: '',
    logoUrl: '',
    sortOrder: 0,
    isActive: true
  };

  isEditMode = signal<boolean>(false);
  brandId = signal<number | null>(null);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private brandService: BrandService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.brandId.set(+id);
      this.loadBrand(+id);
    }
  }

  loadBrand(id: number): void {
    this.brandService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const brand = response.data;
          this.form = {
            nameAr: brand.nameAr,
            nameEn: brand.nameEn,
            logoUrl: brand.logoUrl || '',
            sortOrder: brand.sortOrder,
            isActive: brand.isActive
          };
        }
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
      ? this.brandService.update(this.brandId()!, { ...this.form, id: this.brandId()! })
      : this.brandService.create(this.form);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/brands']);
        } else {
          this.error.set(response.message || 'فشل حفظ العلامة التجارية');
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

  uploadImage(file: File): void {
    this.isUploading.set(true);
    this.fileService.upload(file, 'brands').subscribe({
      next: (response) => {
        if (response.success) {
          this.form.logoUrl = response.data.url;
        }
        this.isUploading.set(false);
      },
      error: () => {
        this.error.set('فشل رفع الشعار');
        this.isUploading.set(false);
      }
    });
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.form.logoUrl = '';
  }

  goBack(): void {
    this.router.navigate(['/brands']);
  }
}
