import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { ProductService, Product, PagedResult } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ProductCardComponent],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div class="container-custom">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ 'nav.accessories' | translate }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            {{ languageService.isArabic() 
               ? 'إكسسوارات أصلية لأجهزتك' 
               : 'Original accessories for your devices' }}
          </p>
        </div>
      </div>

      <div class="container-custom py-8">
        @if (isLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="card">
                <div class="aspect-square skeleton"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 skeleton w-3/4"></div>
                  <div class="h-4 skeleton w-1/2"></div>
                  <div class="h-8 skeleton w-1/3"></div>
                </div>
              </div>
            }
          </div>
        } @else if (result().items.length === 0) {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ 'common.noResults' | translate }}
            </h3>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (product of result().items; track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          @if (result().totalPages > 1) {
            <div class="flex justify-center gap-2 mt-8">
              <button 
                [disabled]="!result().hasPreviousPage"
                (click)="goToPage(result().page - 1)"
                class="btn-secondary disabled:opacity-50">
                {{ languageService.isArabic() ? 'السابق' : 'Previous' }}
              </button>
              <span class="flex items-center px-4 text-gray-600 dark:text-gray-400">
                {{ result().page }} / {{ result().totalPages }}
              </span>
              <button 
                [disabled]="!result().hasNextPage"
                (click)="goToPage(result().page + 1)"
                class="btn-secondary disabled:opacity-50">
                {{ languageService.isArabic() ? 'التالي' : 'Next' }}
              </button>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class AccessoriesComponent implements OnInit {
  languageService = inject(LanguageService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  result = signal<PagedResult<Product>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  isLoading = signal(true);
  currentPage = signal(1);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    
    // Get all products with pagination
    this.productService.getProducts({
      page: this.currentPage(),
      pageSize: 12
    }).subscribe({
      next: (result) => {
        this.result.set(result);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}