import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeSectionService, CreateHomeSectionRequest, HomeSectionType, TargetType } from '../../../core/services/home-section.service';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'app-home-section-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center gap-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ isEditMode() ? 'تعديل القسم' : 'إضافة قسم' }}</h1>
      </div>
      
      <form (ngSubmit)="save()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold">المعلومات الأساسية</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">العنوان بالعربي *</label>
                <input type="text" [(ngModel)]="form.titleAr" name="titleAr" class="form-input" required/>
              </div>
              <div>
                <label class="form-label">العنوان بالإنجليزي *</label>
                <input type="text" [(ngModel)]="form.titleEn" name="titleEn" class="form-input" dir="ltr" required/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">العنوان الفرعي بالعربي</label>
                <input type="text" [(ngModel)]="form.subtitleAr" name="subtitleAr" class="form-input"/>
              </div>
              <div>
                <label class="form-label">العنوان الفرعي بالإنجليزي</label>
                <input type="text" [(ngModel)]="form.subtitleEn" name="subtitleEn" class="form-input" dir="ltr"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">نوع القسم *</label>
                <select [(ngModel)]="form.sectionType" name="sectionType" class="form-input">
                  <option [ngValue]="0">بانر</option>
                  <option [ngValue]="1">وحدات مميزة</option>
                  <option [ngValue]="2">عرض الأقسام</option>
                  <option [ngValue]="3">عرض العلامات التجارية</option>
                  <option [ngValue]="4">وصل حديثاً</option>
                  <option [ngValue]="5">إكسسوارات</option>
                  <option [ngValue]="6">مخصص</option>
                </select>
              </div>
              <div>
                <label class="form-label">ترتيب العرض</label>
                <input type="number" [(ngModel)]="form.sortOrder" name="sortOrder" class="form-input" min="0"/>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">لون الخلفية</label>
                <input type="color" [(ngModel)]="form.backgroundColor" name="backgroundColor" class="form-input h-10"/>
              </div>
              <div>
                <label class="form-label">رابط خارجي</label>
                <input type="url" [(ngModel)]="form.targetUrl" name="targetUrl" class="form-input" dir="ltr"/>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold">الصورة</h2>
            <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer" (click)="imageInput.click()">
              @if (form.imageUrl) {
                <img [src]="form.imageUrl" class="w-full h-32 object-cover rounded-lg"/>
              } @else {
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
          </div>
          
          <div class="admin-card space-y-3">
            <button type="submit" class="w-full btn-primary py-3" [disabled]="isSaving()">
              {{ isSaving() ? 'جاري الحفظ...' : 'حفظ' }}
            </button>
            <button type="button" (click)="goBack()" class="w-full btn-secondary py-3">إلغاء</button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class HomeSectionFormComponent implements OnInit {
  form: CreateHomeSectionRequest = {
    titleAr: '', titleEn: '', sectionType: HomeSectionType.Banner, sortOrder: 0, isActive: true
  };
  
  isEditMode = signal<boolean>(false);
  sectionId = signal<number | null>(null);
  isSaving = signal<boolean>(false);

  constructor(
    private homeSectionService: HomeSectionService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.sectionId.set(+id);
      this.homeSectionService.getById(+id).subscribe({
        next: (r) => {
          if (r.success) {
            const s = r.data;
            this.form = {
              titleAr: s.titleAr, titleEn: s.titleEn, subtitleAr: s.subtitleAr, subtitleEn: s.subtitleEn,
              sectionType: s.sectionType, imageUrl: s.imageUrl, backgroundColor: s.backgroundColor,
              sortOrder: s.sortOrder, isActive: s.isActive, targetUrl: s.targetUrl
            };
          }
        }
      });
    }
  }

  save(): void {
    this.isSaving.set(true);
    const req = this.isEditMode()
      ? this.homeSectionService.update(this.sectionId()!, { ...this.form, id: this.sectionId()! })
      : this.homeSectionService.create(this.form);
    req.subscribe({
      next: (r) => { if (r.success) this.router.navigate(['/home-sections']); this.isSaving.set(false); },
      error: () => this.isSaving.set(false)
    });
  }

  onFileSelect(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.fileService.upload(f, 'home-sections').subscribe({ next: (r) => r.success && (this.form.imageUrl = r.data.url) });
  }

  goBack(): void { this.router.navigate(['/home-sections']); }
}
