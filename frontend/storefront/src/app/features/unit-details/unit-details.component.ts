import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { WhatsAppService } from '@core/services/whatsapp.service';
import { UnitService, Unit } from '@core/services/unit.service';

@Component({
  selector: 'app-unit-details',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div class="container-custom">
        @if (isLoading()) {
          <div class="animate-pulse">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="aspect-square skeleton rounded-xl"></div>
              <div class="space-y-4">
                <div class="h-8 skeleton w-3/4"></div>
                <div class="h-4 skeleton w-1/2"></div>
                <div class="h-12 skeleton w-1/3"></div>
              </div>
            </div>
          </div>
        } @else if (unit()) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Image Gallery -->
            <div class="space-y-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden aspect-square">
                <img 
                  [src]="selectedImage() || unit()!.primaryImageUrl || 'assets/images/placeholder.jpg'" 
                  [alt]="languageService.isArabic() ? unit()!.titleAr : unit()!.titleEn"
                  class="w-full h-full object-contain">
              </div>
              @if (unit()!.media && unit()!.media!.length > 1) {
                <div class="flex gap-2 overflow-x-auto pb-2">
                  @for (media of unit()!.media; track media.id) {
                    <button 
                      (click)="selectImage(media.url)"
                      [class.ring-2]="selectedImage() === media.url"
                      [class.ring-primary-500]="selectedImage() === media.url"
                      class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                      <img [src]="media.url" class="w-full h-full object-cover">
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <!-- Badges -->
              <div class="flex flex-wrap gap-2">
                <span [class]="getConditionClass()">
                  {{ getConditionLabel() }}
                </span>
                @if (unit()!.isFeatured) {
                  <span class="badge bg-primary-500 text-white">
                    {{ 'common.featured' | translate }}
                  </span>
                }
                @if (unit()!.status !== 'Available') {
                  <span [class]="getStatusClass()">
                    {{ getStatusLabel() }}
                  </span>
                }
              </div>

              <!-- Title -->
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ languageService.isArabic() ? unit()!.titleAr : unit()!.titleEn }}
              </h1>

              <!-- Description -->
              @if (unit()!.descriptionAr || unit()!.descriptionEn) {
                <p class="text-gray-600 dark:text-gray-400">
                  {{ languageService.isArabic() ? unit()!.descriptionAr : unit()!.descriptionEn }}
                </p>
              }

              <!-- Price -->
              @if (unit()?.paymentInfo) {
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    {{ 'unit.payment' | translate }}
                  </h3>
                  
                  @if (unit()?.paymentInfo?.originalPrice && unit()!.paymentInfo!.originalPrice! > unit()!.paymentInfo!.cashPrice!) {
                    <div class="flex items-center gap-3 mb-2">
                      <span class="price-original text-lg">
                        {{ unit()?.paymentInfo?.originalPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
                      </span>
                      <span class="price-discount">
                        -{{ unit()?.paymentInfo?.discountPercentage }}%
                      </span>
                    </div>
                  }
                  
                  <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                    {{ unit()?.paymentInfo?.cashPrice | number:'1.0-0' }} 
                    <span class="text-lg">{{ languageService.isArabic() ? 'ج.م' : 'EGP' }}</span>
                  </div>

                  @if (unit()?.paymentInfo?.acceptsInstallment && unit()?.paymentInfo?.installmentPlans?.length) {
                    <div class="border-t dark:border-gray-700 pt-4">
                      <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {{ 'unit.installment' | translate }}
                      </h4>
                      <div class="space-y-2">
                        @for (plan of unit()?.paymentInfo?.installmentPlans ?? []; track plan.id) {
                          <div class="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <span class="text-gray-600 dark:text-gray-400">
                              {{ plan.months }} {{ 'unit.months' | translate }}
                            </span>
                            <span class="font-semibold text-gray-900 dark:text-white">
                              {{ plan.monthlyAmount | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م/شهر' : 'EGP/mo' }}
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Specifications -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                  {{ 'unit.specifications' | translate }}
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  @if (unit()!.storage) {
                    <div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ 'unit.storage' | translate }}</span>
                      <p class="font-medium text-gray-900 dark:text-white">{{ unit()!.storage }}</p>
                    </div>
                  }
                  @if (unit()!.color) {
                    <div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ 'unit.color' | translate }}</span>
                      <p class="font-medium text-gray-900 dark:text-white">{{ unit()!.color }}</p>
                    </div>
                  }
                  @if (unit()!.batteryHealth && unit()!.condition !== 'New') {
                    <div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ 'unit.batteryHealth' | translate }}</span>
                      <p class="font-medium text-gray-900 dark:text-white">{{ unit()!.batteryHealth }}%</p>
                    </div>
                  }
                  @if (unit()!.warrantyType !== 'None' && unit()!.warrantyRemainingMonths) {
                    <div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ 'unit.warrantyRemaining' | translate }}</span>
                      <p class="font-medium text-green-600 dark:text-green-400">
                        {{ unit()!.warrantyRemainingMonths }} {{ 'unit.months' | translate }}
                      </p>
                    </div>
                  }
                </div>
              </div>

              <!-- CTA -->
              @if (unit()!.status === 'Available') {
                <button 
                  (click)="openWhatsApp()"
                  class="btn-whatsapp w-full justify-center py-4 text-lg">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {{ 'common.inquireNow' | translate }}
                </button>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-16">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ languageService.isArabic() ? 'الجهاز غير موجود' : 'Device not found' }}
            </h2>
            <a [routerLink]="['/', languageService.currentLanguage(), 'units']" class="btn-primary mt-4 inline-block">
              {{ languageService.isArabic() ? 'العودة للأجهزة' : 'Back to Devices' }}
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class UnitDetailsComponent implements OnInit {
  languageService = inject(LanguageService);
  private unitService = inject(UnitService);
  private whatsAppService = inject(WhatsAppService);
  private route = inject(ActivatedRoute);

  unit = signal<Unit | null>(null);
  selectedImage = signal<string | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUnit(+id);
    }
  }

  private loadUnit(id: number): void {
    this.unitService.getUnitById(id).subscribe(unit => {
      this.unit.set(unit);
      if (unit?.primaryImageUrl) {
        this.selectedImage.set(unit.primaryImageUrl);
      }
      this.isLoading.set(false);
    });
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  getConditionClass(): string {
    const u = this.unit();
    if (!u) return 'badge';
    const baseClass = 'badge ';
    switch (u.condition) {
      case 'New': return baseClass + 'badge-new';
      case 'Used': return baseClass + 'badge-used';
      case 'Refurbished': return baseClass + 'bg-purple-100 text-purple-800';
      default: return baseClass;
    }
  }

  getConditionLabel(): string {
    const u = this.unit();
    if (!u) return '';
    const labels: Record<string, { ar: string; en: string }> = {
      'New': { ar: 'جديد', en: 'New' },
      'Used': { ar: 'مستعمل', en: 'Used' },
      'Refurbished': { ar: 'مجدد', en: 'Refurbished' }
    };
    const label = labels[u.condition] || { ar: u.condition, en: u.condition };
    return this.languageService.isArabic() ? label.ar : label.en;
  }

  getStatusClass(): string {
    const u = this.unit();
    if (!u) return 'badge';
    const baseClass = 'badge ';
    switch (u.status) {
      case 'Sold': return baseClass + 'badge-sold';
      case 'Reserved': return baseClass + 'badge-reserved';
      default: return baseClass;
    }
  }

  getStatusLabel(): string {
    const u = this.unit();
    if (!u) return '';
    const labels: Record<string, { ar: string; en: string }> = {
      'Sold': { ar: 'تم البيع', en: 'Sold' },
      'Reserved': { ar: 'محجوز', en: 'Reserved' }
    };
    const label = labels[u.status] || { ar: u.status, en: u.status };
    return this.languageService.isArabic() ? label.ar : label.en;
  }

  openWhatsApp(): void {
    const u = this.unit();
    if (u) {
      this.whatsAppService.openWhatsApp({
        type: 'unit',
        id: u.id,
        name: this.languageService.isArabic() ? u.titleAr : u.titleEn,
        price: u.paymentInfo?.cashPrice,
        condition: u.condition
      });
    }
  }
}
