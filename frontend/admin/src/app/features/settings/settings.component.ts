import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, StoreSettings, UpdateSettingsRequest } from '../../core/services/settings.service';
import { FileService } from '../../core/services/file.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h1>
        <p class="text-gray-600 dark:text-gray-400">إعدادات المتجر والنظام</p>
      </div>
      
      @if (isLoading()) {
        <div class="admin-card flex items-center justify-center py-12">
          <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      } @else {
        <form (ngSubmit)="save()" class="space-y-6">
          <!-- Store Info -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">معلومات المتجر</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">اسم المتجر بالعربي</label>
                <input type="text" [(ngModel)]="form.storeNameAr" name="storeNameAr" class="form-input"/>
              </div>
              <div>
                <label class="form-label">اسم المتجر بالإنجليزي</label>
                <input type="text" [(ngModel)]="form.storeNameEn" name="storeNameEn" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">الشعار بالعربي</label>
                <input type="text" [(ngModel)]="form.taglineAr" name="taglineAr" class="form-input"/>
              </div>
              <div>
                <label class="form-label">الشعار بالإنجليزي</label>
                <input type="text" [(ngModel)]="form.taglineEn" name="taglineEn" class="form-input" dir="ltr"/>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">معلومات الاتصال</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">البريد الإلكتروني</label>
                <input type="email" [(ngModel)]="form.email" name="email" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">رقم الهاتف</label>
                <input type="tel" [(ngModel)]="form.phone" name="phone" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">رقم WhatsApp</label>
                <input type="tel" [(ngModel)]="form.whatsAppNumber" name="whatsAppNumber" class="form-input" dir="ltr" placeholder="201234567890"/>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">العنوان بالعربي</label>
                <textarea [(ngModel)]="form.addressAr" name="addressAr" class="form-input" rows="2"></textarea>
              </div>
              <div>
                <label class="form-label">العنوان بالإنجليزي</label>
                <textarea [(ngModel)]="form.addressEn" name="addressEn" class="form-input" dir="ltr" rows="2"></textarea>
              </div>
            </div>
          </div>
          
          <!-- Social Links -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">روابط التواصل الاجتماعي</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="form-label">Facebook</label>
                <input type="url" [(ngModel)]="form.facebookUrl" name="facebookUrl" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">Instagram</label>
                <input type="url" [(ngModel)]="form.instagramUrl" name="instagramUrl" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">Twitter</label>
                <input type="url" [(ngModel)]="form.twitterUrl" name="twitterUrl" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">YouTube</label>
                <input type="url" [(ngModel)]="form.youtubeUrl" name="youtubeUrl" class="form-input" dir="ltr"/>
              </div>
              <div>
                <label class="form-label">TikTok</label>
                <input type="url" [(ngModel)]="form.tiktokUrl" name="tiktokUrl" class="form-input" dir="ltr"/>
              </div>
            </div>
          </div>
          
          <!-- Theme -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الألوان</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">اللون الأساسي</label>
                <input type="color" [(ngModel)]="form.primaryColor" name="primaryColor" class="form-input h-12"/>
              </div>
              <div>
                <label class="form-label">اللون الثانوي</label>
                <input type="color" [(ngModel)]="form.secondaryColor" name="secondaryColor" class="form-input h-12"/>
              </div>
            </div>
          </div>
          
          <!-- Business -->
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">إعدادات العمل</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="form-label">العملة</label>
                <select [(ngModel)]="form.currency" name="currency" class="form-input">
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                </select>
              </div>
              <div>
                <label class="form-label">اللغة الافتراضية</label>
                <select [(ngModel)]="form.defaultLanguage" name="defaultLanguage" class="form-input">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">ساعات العمل بالعربي</label>
                <input type="text" [(ngModel)]="form.workingHoursAr" name="workingHoursAr" class="form-input"/>
              </div>
              <div>
                <label class="form-label">ساعات العمل بالإنجليزي</label>
                <input type="text" [(ngModel)]="form.workingHoursEn" name="workingHoursEn" class="form-input" dir="ltr"/>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end">
            <button type="submit" class="btn-primary px-8 py-3" [disabled]="isSaving()">
              @if (isSaving()) {
                جاري الحفظ...
              } @else {
                حفظ الإعدادات
              }
            </button>
          </div>
        </form>
      }
      
      @if (message()) {
        <div class="admin-card" [class.bg-green-50]="!error()" [class.bg-red-50]="error()">
          <p [class.text-green-600]="!error()" [class.text-red-600]="error()">{{ message() }}</p>
        </div>
      }
    </div>
  `
})
export class SettingsComponent implements OnInit {
  form: UpdateSettingsRequest = {
    primaryColor: '#25D366',
    secondaryColor: '#128C7E'
  };
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  message = signal<string>('');
  error = signal<boolean>(false);

  constructor(
    private settingsService: SettingsService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.settingsService.get().subscribe({
      next: (r) => {
        if (r.success && r.data) {
          const s = r.data;
          this.form = {
            storeNameAr: s.storeNameAr || '', 
            storeNameEn: s.storeNameEn || '',
            taglineAr: s.taglineAr || '', 
            taglineEn: s.taglineEn || '',
            email: s.email || '', 
            phone: s.phone || '', 
            whatsAppNumber: s.whatsAppNumber || '',
            addressAr: s.addressAr || '', 
            addressEn: s.addressEn || '',
            facebookUrl: s.facebookUrl || '', 
            instagramUrl: s.instagramUrl || '', 
            twitterUrl: s.twitterUrl || '',
            youtubeUrl: s.youtubeUrl || '', 
            tiktokUrl: s.tiktokUrl || '',
            primaryColor: s.primaryColor || '#25D366', 
            secondaryColor: s.secondaryColor || '#128C7E',
            currency: s.currency || 'EGP', 
            defaultLanguage: s.defaultLanguage || 'ar',
            workingHoursAr: s.workingHoursAr || '', 
            workingHoursEn: s.workingHoursEn || ''
          };
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  save(): void {
    this.isSaving.set(true);
    this.message.set('');
    this.settingsService.update(this.form).subscribe({
      next: (r) => {
        if (r.success) {
          this.message.set('تم حفظ الإعدادات بنجاح');
          this.error.set(false);
        } else {
          this.message.set(r.message || 'فشل حفظ الإعدادات');
          this.error.set(true);
        }
        this.isSaving.set(false);
      },
      error: (e) => {
        this.message.set(e.error?.message || 'حدث خطأ');
        this.error.set(true);
        this.isSaving.set(false);
      }
    });
  }
}
