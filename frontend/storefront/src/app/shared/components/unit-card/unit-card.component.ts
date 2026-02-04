import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { WhatsAppService } from '@core/services/whatsapp.service';
import { Unit } from '@core/services/unit.service';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="card group">
      <!-- Image -->
      <a [routerLink]="['/', languageService.currentLanguage(), 'unit', unit.id]" 
         class="block relative aspect-square overflow-hidden">
        <img 
          [src]="unit.primaryImageUrl || 'assets/images/placeholder.jpg'" 
          [alt]="languageService.isArabic() ? unit.titleAr : unit.titleEn"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        
        <!-- Badges -->
        <div class="absolute top-3 start-3 flex flex-col gap-2">
          <!-- Condition Badge -->
          <span [class]="getConditionClass()">
            {{ getConditionLabel() }}
          </span>
          
          <!-- Featured Badge -->
          @if (unit.isFeatured) {
            <span class="badge bg-primary-500 text-white">
              {{ 'common.featured' | translate }}
            </span>
          }
        </div>

        <!-- Status Overlay -->
        @if (unit.status !== 'Available') {
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span [class]="getStatusClass()">
              {{ getStatusLabel() }}
            </span>
          </div>
        }
      </a>

      <!-- Content -->
      <div class="p-4">
        <!-- Title -->
        <a [routerLink]="['/', languageService.currentLanguage(), 'unit', unit.id]">
          <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 min-h-[3rem]">
            {{ languageService.isArabic() ? unit.titleAr : unit.titleEn }}
          </h3>
        </a>

        <!-- Specs -->
        <div class="flex flex-wrap gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
          @if (unit.storage) {
            <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ unit.storage }}</span>
          }
          @if (unit.color) {
            <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ unit.color }}</span>
          }
          @if (unit.batteryHealth && unit.condition !== 'New') {
            <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              🔋 {{ unit.batteryHealth }}%
            </span>
          }
        </div>

        <!-- Warranty -->
        @if (unit.warrantyType !== 'None' && unit.warrantyRemainingMonths) {
          <div class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              {{ languageService.isArabic() ? 'ضمان' : 'Warranty' }}: {{ unit.warrantyRemainingMonths }} {{ languageService.isArabic() ? 'شهر' : 'months' }}
            </span>
          </div>
        }

        <!-- Price -->
        <div class="mt-3">
          @if (unit.paymentInfo) {
            @if (unit.paymentInfo.originalPrice && unit.paymentInfo.originalPrice > unit.paymentInfo.cashPrice) {
              <div class="flex items-center gap-2">
                <span class="price-original">
                  {{ unit.paymentInfo.originalPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
                </span>
                <span class="price-discount">
                  -{{ unit.paymentInfo.discountPercentage }}%
                </span>
              </div>
            }
            <div class="price-current">
              {{ unit.paymentInfo.cashPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
            </div>
            @if (unit.paymentInfo.acceptsInstallment && unit.paymentInfo.installmentPlans.length) {
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ 'common.installmentFrom' | translate }} 
                {{ unit.paymentInfo.installmentPlans[0].monthlyAmount | number:'1.0-0' }} 
                {{ languageService.isArabic() ? 'ج.م/شهر' : 'EGP/mo' }}
              </div>
            }
          }
        </div>

        <!-- CTA Button -->
        @if (unit.status === 'Available') {
          <button 
            (click)="openWhatsApp()"
            class="btn-whatsapp w-full mt-4 justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {{ 'common.inquireNow' | translate }}
          </button>
        }
      </div>
    </div>
  `
})
export class UnitCardComponent {
  @Input({ required: true }) unit!: Unit;

  languageService = inject(LanguageService);
  private whatsAppService = inject(WhatsAppService);

  getConditionClass(): string {
    const baseClass = 'badge ';
    switch (this.unit.condition) {
      case 'New': return baseClass + 'badge-new';
      case 'Used': return baseClass + 'badge-used';
      case 'Refurbished': return baseClass + 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return baseClass;
    }
  }

  getConditionLabel(): string {
    const labels: Record<string, { ar: string; en: string }> = {
      'New': { ar: 'جديد', en: 'New' },
      'Used': { ar: 'مستعمل', en: 'Used' },
      'Refurbished': { ar: 'مجدد', en: 'Refurbished' }
    };
    const label = labels[this.unit.condition] || { ar: this.unit.condition, en: this.unit.condition };
    return this.languageService.isArabic() ? label.ar : label.en;
  }

  getStatusClass(): string {
    const baseClass = 'badge text-lg ';
    switch (this.unit.status) {
      case 'Sold': return baseClass + 'badge-sold';
      case 'Reserved': return baseClass + 'badge-reserved';
      default: return baseClass;
    }
  }

  getStatusLabel(): string {
    const labels: Record<string, { ar: string; en: string }> = {
      'Sold': { ar: 'تم البيع', en: 'Sold' },
      'Reserved': { ar: 'محجوز', en: 'Reserved' },
      'Hidden': { ar: 'مخفي', en: 'Hidden' }
    };
    const label = labels[this.unit.status] || { ar: this.unit.status, en: this.unit.status };
    return this.languageService.isArabic() ? label.ar : label.en;
  }

  openWhatsApp(): void {
    this.whatsAppService.openWhatsApp({
      type: 'unit',
      id: this.unit.id,
      name: this.languageService.isArabic() ? this.unit.titleAr : this.unit.titleEn,
      price: this.unit.paymentInfo?.cashPrice,
      condition: this.unit.condition
    });
  }
}
