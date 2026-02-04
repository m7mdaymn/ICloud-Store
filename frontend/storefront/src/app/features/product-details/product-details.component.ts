import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { WhatsAppService } from '@core/services/whatsapp.service';
import { ProductService, Product } from '@core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div class="container-custom">
        @if (isLoading()) {
          <div class="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="aspect-square skeleton rounded-xl"></div>
            <div class="space-y-4">
              <div class="h-8 skeleton w-3/4"></div>
              <div class="h-4 skeleton w-1/2"></div>
              <div class="h-12 skeleton w-1/3"></div>
            </div>
          </div>
        } @else if (product()) {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Image Gallery -->
            <div class="space-y-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden aspect-square">
                <img 
                  [src]="selectedImage() || product()!.primaryImageUrl || 'assets/images/placeholder.jpg'" 
                  [alt]="languageService.isArabic() ? product()!.nameAr : product()!.nameEn"
                  class="w-full h-full object-contain">
              </div>
              @if (product()!.media && product()!.media.length > 1) {
                <div class="flex gap-2 overflow-x-auto pb-2">
                  @for (media of product()!.media; track media.id) {
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
              <!-- Brand -->
              @if (product()!.brandName) {
                <span class="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                  {{ product()!.brandName }}
                </span>
              }

              <!-- Title -->
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ languageService.isArabic() ? product()!.nameAr : product()!.nameEn }}
              </h1>

              <!-- Description -->
              @if (product()!.descriptionAr || product()!.descriptionEn) {
                <p class="text-gray-600 dark:text-gray-400">
                  {{ languageService.isArabic() ? product()!.descriptionAr : product()!.descriptionEn }}
                </p>
              }

              <!-- Stock Status -->
              @if (product()!.stock) {
                <div>
                  @if (product()!.stock!.isInStock) {
                    <span class="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ 'common.inStock' | translate }}
                    </span>
                  } @else {
                    <span class="text-red-500 font-medium">
                      {{ 'common.outOfStock' | translate }}
                    </span>
                  }
                </div>
              }

              <!-- Price -->
              @if (product()!.paymentInfo) {
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    {{ 'unit.payment' | translate }}
                  </h3>
                  
                  @if (product()!.paymentInfo!.originalPrice && product()!.paymentInfo!.originalPrice! > product()!.paymentInfo!.cashPrice) {
                    <div class="flex items-center gap-3 mb-2">
                      <span class="price-original text-lg">
                        {{ product()!.paymentInfo!.originalPrice | number:'1.0-0' }} {{ languageService.isArabic() ? 'ج.م' : 'EGP' }}
                      </span>
                      <span class="price-discount">
                        -{{ product()!.paymentInfo!.discountPercentage }}%
                      </span>
                    </div>
                  }
                  
                  <div class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {{ product()!.paymentInfo!.cashPrice | number:'1.0-0' }} 
                    <span class="text-lg">{{ languageService.isArabic() ? 'ج.م' : 'EGP' }}</span>
                  </div>
                </div>
              }

              <!-- Attributes -->
              @if (product()!.attributes && product()!.attributes.length > 0) {
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                    {{ 'unit.specifications' | translate }}
                  </h3>
                  <div class="space-y-3">
                    @for (attr of product()!.attributes; track attr.id) {
                      <div class="flex justify-between">
                        <span class="text-gray-500 dark:text-gray-400">
                          {{ languageService.isArabic() ? attr.nameAr : attr.nameEn }}
                        </span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{ languageService.isArabic() ? attr.valueAr : attr.valueEn }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- CTA -->
              @if (product()!.stock?.isInStock) {
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
              {{ languageService.isArabic() ? 'المنتج غير موجود' : 'Product not found' }}
            </h2>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" class="btn-primary mt-4 inline-block">
              {{ languageService.isArabic() ? 'العودة للإكسسوارات' : 'Back to Accessories' }}
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductDetailsComponent implements OnInit {
  languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private whatsAppService = inject(WhatsAppService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  selectedImage = signal<string | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(product => {
      this.product.set(product);
      if (product?.primaryImageUrl) {
        this.selectedImage.set(product.primaryImageUrl);
      }
      this.isLoading.set(false);
    });
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  openWhatsApp(): void {
    const p = this.product();
    if (p) {
      this.whatsAppService.openWhatsApp({
        type: 'product',
        id: p.id,
        name: this.languageService.isArabic() ? p.nameAr : p.nameEn,
        price: p.paymentInfo?.cashPrice
      });
    }
  }
}
