import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { WhatsAppService } from '@core/services/whatsapp.service';
import { Product } from '@core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="card group">
      <!-- Image -->
      <a [routerLink]="['/', languageService.currentLanguage(), 'product', product.id]" 
         class="block relative aspect-square overflow-hidden">
        <img 
          [src]="product.primaryImageUrl || 'assets/images/placeholder.jpg'" 
          [alt]="languageService.isArabic() ? product.nameAr : product.nameEn"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        
        <!-- Badges -->
        <div class="absolute top-3 start-3 flex flex-col gap-2">
          @if (product.isFeatured) {
            <span class="badge bg-primary-500 text-white">
              {{ 'common.featured' | translate }}
            </span>
          }
          @if (product.paymentInfo?.discountPercentage) {
            <span class="badge bg-red-500 text-white">
              -{{ product.paymentInfo?.discountPercentage }}%
            </span>
          }
        </div>

        <!-- Out of Stock Overlay -->
        @if (!product.stock?.isInStock) {
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span class="badge badge-sold text-lg">
              {{ 'common.outOfStock' | translate }}
            </span>
          </div>
        }
      </a>

      <!-- Content -->
      <div class="p-4">
        <!-- Brand -->
        @if (product.brandName) {
          <span class="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
            {{ product.brandName }}
          </span>
        }

        <!-- Title -->
        <a [routerLink]="['/', languageService.currentLanguage(), 'product', product.id]">
          <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 min-h-[3rem] mt-1">
            {{ languageService.isArabic() ? product.nameAr : product.nameEn }}
          </h3>
        </a>

        <!-- Stock Status -->
        @if (product.stock) {
          <div class="mt-2 text-sm">
            @if (product.stock.isInStock) {
              <span class="text-green-600 dark:text-green-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ 'common.inStock' | translate }}
              </span>
            } @else {
              <span class="text-red-500">
                {{ 'common.outOfStock' | translate }}
              </span>
            }
          </div>
        }

        <!-- Price -->
        <div class="mt-3">
          @if (product.paymentInfo) {
            @if (product.paymentInfo.originalPrice && product.paymentInfo.originalPrice > product.paymentInfo.cashPrice) {
              <div class="flex items-center gap-2">
                <span class="price-original">
                  {{ product.paymentInfo.originalPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
                </span>
              </div>
            }
            <div class="price-current text-xl">
              {{ product.paymentInfo.cashPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
            </div>
            @if (product.paymentInfo.acceptsInstallment && product.paymentInfo.installmentPlans.length) {
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ 'common.installmentFrom' | translate }} 
                {{ product.paymentInfo.installmentPlans[0].monthlyAmount | number:'1.0-0' }} 
                {{ languageService.isArabic() ? 'ج.م/شهر' : 'EGP/mo' }}
              </div>
            }
          }
        </div>

        <!-- CTA Button -->
        @if (product.stock?.isInStock) {
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
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  languageService = inject(LanguageService);
  private whatsAppService = inject(WhatsAppService);

  openWhatsApp(): void {
    this.whatsAppService.openWhatsApp({
      type: 'product',
      id: this.product.id,
      name: this.languageService.isArabic() ? this.product.nameAr : this.product.nameEn,
      price: this.product.paymentInfo?.cashPrice
    });
  }
}
