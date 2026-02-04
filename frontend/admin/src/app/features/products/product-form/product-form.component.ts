import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, CreateProductRequest } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { BrandService, Brand } from '../../../core/services/brand.service';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ isEditMode() ? 'تعديل المنتج' : 'إضافة منتج جديد' }}</h1>
      </div>
      
      <form (ngSubmit)="save()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold">المعلومات الأساسية</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">الاسم بالعربي *</label>
                <input type="text" [(ngModel)]="form.nameAr" name="nameAr" class="form-input" required/>
              </div>
              <div>
                <label class="form-label">الاسم بالإنجليزي *</label>
                <input type="text" [(ngModel)]="form.nameEn" name="nameEn" class="form-input" dir="ltr" required/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">القسم *</label>
                <select [(ngModel)]="form.categoryId" name="categoryId" class="form-input" required>
                  <option [ngValue]="0">-- اختر --</option>
                  @for (cat of categories(); track cat.id) {
                    <option [ngValue]="cat.id">{{ cat.nameAr }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="form-label">العلامة التجارية</label>
                <select [(ngModel)]="form.brandId" name="brandId" class="form-input">
                  <option [ngValue]="undefined">-- اختياري --</option>
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
          
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold">التسعير والمخزون</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="form-label">السعر *</label>
                <input type="number" [(ngModel)]="form.price" name="price" class="form-input" min="0" required/>
              </div>
              <div>
                <label class="form-label">السعر الأصلي</label>
                <input type="number" [(ngModel)]="form.originalPrice" name="originalPrice" class="form-input" min="0"/>
              </div>
              <div>
                <label class="form-label">الكمية *</label>
                <input type="number" [(ngModel)]="form.stockQuantity" name="stockQuantity" class="form-input" min="0" required/>
              </div>
              <div>
                <label class="form-label">حد التنبيه</label>
                <input type="number" [(ngModel)]="form.lowStockThreshold" name="lowStockThreshold" class="form-input" min="0"/>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold">الصورة</h2>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500" (click)="imageInput.click()">
              @if (form.thumbnailUrl) {
                <img [src]="form.thumbnailUrl" class="w-full h-48 object-cover rounded-lg"/>
              } @else {
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p class="text-gray-500">اختر صورة</p>
              }
            </div>
            <input #imageInput type="file" accept="image/*" class="hidden" (change)="onFileSelect($event)"/>
          </div>
          
          <div class="admin-card space-y-4">
            <div class="flex items-center gap-3">
              <input type="checkbox" [(ngModel)]="form.isActive" name="isActive" class="w-4 h-4"/>
              <span>نشط</span>
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" [(ngModel)]="form.isFeatured" name="isFeatured" class="w-4 h-4"/>
              <span>مميز</span>
            </div>
          </div>
          
          <div class="admin-card space-y-3">
            <button type="submit" class="w-full btn-primary py-3" [disabled]="isSaving()">
              {{ isSaving() ? 'جاري الحفظ...' : (isEditMode() ? 'حفظ' : 'إضافة') }}
            </button>
            <button type="button" (click)="goBack()" class="w-full btn-secondary py-3">إلغاء</button>
          </div>
        </div>
      </form>
      
      @if (error()) {
        <div class="admin-card bg-red-50"><p class="text-red-600">{{ error() }}</p></div>
      }
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  form: CreateProductRequest = {
    nameAr: '', nameEn: '', categoryId: 0, price: 0, stockQuantity: 0,
    lowStockThreshold: 5, isActive: true, isFeatured: false
  };
  
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);
  isSaving = signal<boolean>(false);
  error = signal<string>('');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll(1, 100, false).subscribe({ next: (r) => r.success && this.categories.set(r.data.items) });
    this.brandService.getAll(1, 100, false).subscribe({ next: (r) => r.success && this.brands.set(r.data.items) });
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.productService.getById(+id).subscribe({
        next: (r) => {
          if (r.success) {
            const p = r.data;
            this.form = {
              nameAr: p.nameAr, nameEn: p.nameEn, descriptionAr: p.descriptionAr, descriptionEn: p.descriptionEn,
              categoryId: p.categoryId, brandId: p.brandId, price: p.price, originalPrice: p.originalPrice,
              stockQuantity: p.stockQuantity, lowStockThreshold: p.lowStockThreshold, thumbnailUrl: p.thumbnailUrl,
              isActive: p.isActive, isFeatured: p.isFeatured
            };
          }
        }
      });
    }
  }

  save(): void {
    if (!this.form.nameAr || !this.form.nameEn || !this.form.categoryId) {
      this.error.set('يرجى ملء الحقول المطلوبة');
      return;
    }
    this.isSaving.set(true);
    const req = this.isEditMode()
      ? this.productService.update(this.productId()!, { ...this.form, id: this.productId()! })
      : this.productService.create(this.form);
    req.subscribe({
      next: (r) => {
        if (r.success) this.router.navigate(['/products']);
        else this.error.set(r.message || 'فشل الحفظ');
        this.isSaving.set(false);
      },
      error: (e) => { this.error.set(e.error?.message || 'خطأ'); this.isSaving.set(false); }
    });
  }

  onFileSelect(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.fileService.upload(f, 'products').subscribe({ next: (r) => r.success && (this.form.thumbnailUrl = r.data.url) });
  }

  goBack(): void { this.router.navigate(['/products']); }
}
