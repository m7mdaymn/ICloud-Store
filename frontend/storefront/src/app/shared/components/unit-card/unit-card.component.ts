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
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 h-full flex flex-col group relative">
      <!-- Favorite Button -->
      <div class="absolute top-3 right-3 z-10">
        <button 
          class="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-gray-400 hover:text-purple-500 transition-colors"
          (click)="toggleFavorite($event)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      <!-- Product Image -->
      <a [routerLink]="['/', languageService.currentLanguage(), 'unit', unit.id]" 
         class="aspect-square bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
        @if (unit.primaryImageUrl) {
          <img [src]="unit.primaryImageUrl" 
               [alt]="languageService.isArabic() ? unit.titleAr : unit.titleEn"
               class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110">
        } @else {
          <div class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        }
      </a>

      <!-- Product Info -->
      <div class="p-5 flex-grow flex flex-col">
        <!-- Brand Badge -->
        @if (unit.condition) {
          <div class="mb-2">
            <span [class]="getConditionBadgeClass()">
              {{ getConditionLabel() }}
            </span>
          </div>
        }

        <!-- Product Name -->
        <a [routerLink]="['/', languageService.currentLanguage(), 'unit', unit.id]">
          <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-cyan-600 transition-colors">
            {{ languageService.isArabic() ? unit.titleAr : unit.titleEn }}
          </h3>
        </a>

        <!-- Specs -->
        @if (unit.storage || unit.color) {
          <div class="flex flex-wrap gap-2 mb-2 text-xs">
            @if (unit.storage) {
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ unit.storage }}</span>
            }
            @if (unit.color) {
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ unit.color }}</span>
            }
          </div>
        }

        <!-- Price and Cart Button -->
        <div class="mt-auto pt-4 flex items-center justify-between">
          <!-- Price -->
          <div class="flex flex-col">
            <span class="text-xs text-gray-500">
              {{ languageService.isArabic() ? 'السعر' : 'Price' }}
            </span>
            @if (unit.paymentInfo) {
              <span class="font-bold text-xl text-gray-900">
                {{ unit.paymentInfo.cashPrice | number:'1.0-0' }}
                <span class="text-sm font-normal text-gray-500">
                  {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
                </span>
              </span>
            }
          </div>

          <!-- WhatsApp Button -->
          @if (unit.status === 'Available') {
            <button 
              (click)="openWhatsApp($event)"
              class="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 px-3 py-1.5">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Status Overlay -->
      @if (unit.status !== 'Available') {
        <div class="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <span [class]="getStatusClass()">
            {{ getStatusLabel() }}
          </span>
        </div>
      }
    </div>
  `
})
export class UnitCardComponent {
  @Input({ required: true }) unit!: Unit;

  languageService = inject(LanguageService);
  private whatsAppService = inject(WhatsAppService);

  getConditionBadgeClass(): string {
    const baseClass = 'text-xs font-semibold px-2 py-1 rounded-md ';
    switch (this.unit.condition) {
      case 'New': 
        return baseClass + 'text-cyan-600 bg-cyan-50';
      case 'Used': 
        return baseClass + 'text-orange-600 bg-orange-50';
      case 'Refurbished': 
        return baseClass + 'text-purple-600 bg-purple-50';
      default: 
        return baseClass + 'text-gray-600 bg-gray-50';
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
    const baseClass = 'px-4 py-2 rounded-lg font-bold text-lg ';
    switch (this.unit.status) {
      case 'Sold': 
        return baseClass + 'bg-red-500 text-white';
      case 'Reserved': 
        return baseClass + 'bg-yellow-500 text-white';
      default: 
        return baseClass + 'bg-gray-500 text-white';
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

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // Implement favorite logic here
    console.log('Toggle favorite:', this.unit.id);
  }

  openWhatsApp(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.whatsAppService.openWhatsApp({
      type: 'unit',
      id: this.unit.id,
      name: this.languageService.isArabic() ? this.unit.titleAr : this.unit.titleEn,
      price: this.unit.paymentInfo?.cashPrice,
      condition: this.unit.condition
    });
  }
}