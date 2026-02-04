import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UnitService, CreateUnitRequest, UnitCondition, UnitStatus, WarrantyType } from '../../../core/services/unit.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { BrandService, Brand } from '../../../core/services/brand.service';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ isEditMode() ? 'تعديل الوحدة' : 'إضافة وحدة جديدة' }}
          </h1>
        </div>
      </div>
      
      <!-- Form -->
      <form (ngSubmit)="save()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">المعلومات الأساسية</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">العنوان بالعربي <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="form.titleAr" name="titleAr" class="form-input" required/>
              </div>
              <div>
                <label class="form-label">العنوان بالإنجليزي <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="form.titleEn" name="titleEn" class="form-input" dir="ltr" required/>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">القسم <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.categoryId" name="categoryId" class="form-input" required>
                  <option [ngValue]="0">-- اختر القسم --</option>
                  @for (cat of categories(); track cat.id) {
                    <option [ngValue]="cat.id">{{ cat.nameAr }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="form-label">العلامة التجارية <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.brandId" name="brandId" class="form-input" required>
                  <option [ngValue]="0">-- اختر العلامة --</option>
                  @for (brand of brands(); track brand.id) {
                    <option [ngValue]="brand.id">{{ brand.nameAr }}</option>
                  }
                </select>
              </div>
            </div>
            
            <div>
              <label class="form-label">الوصف بالعربي</label>
              <textarea [(ngModel)]="form.descriptionAr" name="descriptionAr" class="form-input" rows="3"></textarea>
            </div>
            
            <div>
              <label class="form-label">الوصف بالإنجليزي</label>
              <textarea [(ngModel)]="form.descriptionEn" name="descriptionEn" class="form-input" dir="ltr" rows="3"></textarea>
            </div>
          </div>
          
          <!-- Pricing -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">التسعير</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">السعر <span class="text-red-500">*</span></label>
                <input type="number" [(ngModel)]="form.price" name="price" class="form-input" min="0" required/>
              </div>
              <div>
                <label class="form-label">السعر الأصلي</label>
                <input type="number" [(ngModel)]="form.originalPrice" name="originalPrice" class="form-input" min="0"/>
              </div>
              <div>
                <label class="form-label">سعر الكاش</label>
                <input type="number" [(ngModel)]="form.cashPrice" name="cashPrice" class="form-input" min="0"/>
              </div>
            </div>
            
            <h3 class="font-medium text-gray-700 dark:text-gray-300 pt-2">خيارات التقسيط</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="form-label">سعر التقسيط</label>
                <input type="number" [(ngModel)]="form.installmentPrice" name="installmentPrice" class="form-input" min="0"/>
              </div>
              <div>
                <label class="form-label">عدد الأشهر</label>
                <input type="number" [(ngModel)]="form.installmentMonths" name="installmentMonths" class="form-input" min="1"/>
              </div>
              <div>
                <label class="form-label">القسط الشهري</label>
                <input type="number" [(ngModel)]="form.monthlyInstallment" name="monthlyInstallment" class="form-input" min="0"/>
              </div>
              <div>
                <label class="form-label">المقدم</label>
                <input type="number" [(ngModel)]="form.downPayment" name="downPayment" class="form-input" min="0"/>
              </div>
            </div>
          </div>
          
          <!-- Specifications -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">المواصفات</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">الحالة</label>
                <select [(ngModel)]="form.condition" name="condition" class="form-input">
                  <option [ngValue]="0">جديد</option>
                  <option [ngValue]="1">مستعمل - ممتاز</option>
                  <option [ngValue]="2">مستعمل - جيد جداً</option>
                  <option [ngValue]="3">مستعمل - جيد</option>
                  <option [ngValue]="4">مستعمل - مقبول</option>
                </select>
              </div>
              <div>
                <label class="form-label">اللون</label>
                <input type="text" [(ngModel)]="form.color" name="color" class="form-input"/>
              </div>
              <div>
                <label class="form-label">سعة التخزين</label>
                <input type="text" [(ngModel)]="form.storageCapacity" name="storageCapacity" class="form-input" placeholder="256GB"/>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">صحة البطارية %</label>
                <input type="number" [(ngModel)]="form.batteryHealth" name="batteryHealth" class="form-input" min="0" max="100"/>
              </div>
              <div>
                <label class="form-label">لون HEX</label>
                <input type="color" [(ngModel)]="form.colorHex" name="colorHex" class="form-input h-10"/>
              </div>
            </div>
          </div>
          
          <!-- Warranty -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الضمان</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">نوع الضمان</label>
                <select [(ngModel)]="form.warrantyType" name="warrantyType" class="form-input">
                  <option [ngValue]="0">بدون ضمان</option>
                  <option [ngValue]="1">ضمان المتجر</option>
                  <option [ngValue]="2">ضمان الشركة</option>
                  <option [ngValue]="3">ضمان ممتد</option>
                </select>
              </div>
              <div>
                <label class="form-label">مدة الضمان (بالشهور)</label>
                <input type="number" [(ngModel)]="form.warrantyMonths" name="warrantyMonths" class="form-input" min="0"/>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Image Upload -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الصورة الرئيسية</h2>
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500"
              (click)="imageInput.click()"
            >
              @if (form.thumbnailUrl) {
                <div class="relative">
                  <img [src]="form.thumbnailUrl" class="w-full h-48 object-cover rounded-lg"/>
                  <button type="button" (click)="form.thumbnailUrl = ''; $event.stopPropagation()" 
                    class="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full">
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
                <p class="text-gray-500">اختر صورة</p>
              }
            </div>
            <input #imageInput type="file" accept="image/*" class="hidden" (change)="onFileSelect($event)"/>
          </div>
          
          <!-- Status -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الحالة</h2>
            <div>
              <label class="form-label">حالة المخزون</label>
              <select [(ngModel)]="form.status" name="status" class="form-input">
                <option [ngValue]="0">متاح</option>
                <option [ngValue]="1">محجوز</option>
                <option [ngValue]="2">مباع</option>
                <option [ngValue]="3">مخفي</option>
              </select>
            </div>
            
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" class="sr-only peer"/>
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
              </label>
              <span class="text-gray-700 dark:text-gray-300">نشط</span>
            </div>
            
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.isFeatured" name="isFeatured" class="sr-only peer"/>
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
              </label>
              <span class="text-gray-700 dark:text-gray-300">مميز</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="admin-card space-y-3">
            <button type="submit" class="w-full btn-primary py-3 font-semibold" [disabled]="isSaving()">
              @if (isSaving()) { جاري الحفظ... } @else { {{ isEditMode() ? 'حفظ التغييرات' : 'إضافة الوحدة' }} }
            </button>
            <button type="button" (click)="goBack()" class="w-full btn-secondary py-3">إلغاء</button>
          </div>
        </div>
      </form>
      
      @if (error()) {
        <div class="admin-card bg-red-50 dark:bg-red-900/30">
          <p class="text-red-600 dark:text-red-400">{{ error() }}</p>
        </div>
      }
    </div>
  `
})
export class UnitFormComponent implements OnInit {
  form: CreateUnitRequest = {
    titleAr: '',
    titleEn: '',
    categoryId: 0,
    brandId: 0,
    price: 0,
    condition: UnitCondition.New,
    status: UnitStatus.Available,
    warrantyType: WarrantyType.None,
    isActive: true,
    isFeatured: false,
    colorHex: '#000000' // Default color to prevent empty color input warning
  };

  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  
  isEditMode = signal<boolean>(false);
  unitId = signal<number | null>(null);
  isSaving = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private unitService: UnitService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.unitId.set(+id);
      this.loadUnit(+id);
    }
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

  loadUnit(id: number): void {
    this.unitService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const u = response.data;
          this.form = {
            titleAr: u.titleAr,
            titleEn: u.titleEn,
            descriptionAr: u.descriptionAr,
            descriptionEn: u.descriptionEn,
            categoryId: u.categoryId,
            brandId: u.brandId,
            price: u.price,
            originalPrice: u.originalPrice,
            cashPrice: u.cashPrice,
            installmentPrice: u.installmentPrice,
            installmentMonths: u.installmentMonths,
            monthlyInstallment: u.monthlyInstallment,
            downPayment: u.downPayment,
            condition: u.condition,
            status: u.status,
            color: u.color,
            colorHex: u.colorHex || '#000000',
            storageCapacity: u.storageCapacity,
            batteryHealth: u.batteryHealth,
            warrantyType: u.warrantyType,
            warrantyMonths: u.warrantyMonths,
            thumbnailUrl: u.thumbnailUrl,
            isActive: u.isActive,
            isFeatured: u.isFeatured
          };
        }
      }
    });
  }

  save(): void {
    if (!this.form.titleAr || !this.form.titleEn || !this.form.categoryId || !this.form.brandId) {
      this.error.set('يرجى ملء الحقول المطلوبة');
      return;
    }

    this.isSaving.set(true);
    const request = this.isEditMode()
      ? this.unitService.update(this.unitId()!, { ...this.form, id: this.unitId()! })
      : this.unitService.create(this.form);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/units']);
        } else {
          this.error.set(response.message || 'فشل الحفظ');
        }
        this.isSaving.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'حدث خطأ');
        this.isSaving.set(false);
      }
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.isUploading.set(true);
      this.fileService.upload(input.files[0], 'units').subscribe({
        next: (response) => {
          if (response.success) this.form.thumbnailUrl = response.data.url;
          this.isUploading.set(false);
        },
        error: () => this.isUploading.set(false)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/units']);
  }
}
