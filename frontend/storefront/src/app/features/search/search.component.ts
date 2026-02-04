import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { UnitService, Unit, PagedResult } from '@core/services/unit.service';
import { ProductService, Product } from '@core/services/product.service';
import { UnitCardComponent } from '@shared/components/unit-card/unit-card.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, UnitCardComponent, ProductCardComponent],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div class="container-custom">
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (keyup.enter)="search()"
                [placeholder]="'header.search' | translate"
                class="input-field pr-12 rtl:pr-4 rtl:pl-12 text-lg py-4">
              <button 
                (click)="search()"
                class="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 hover:text-primary-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
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
        } @else if (!hasSearched()) {
          <div class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ languageService.isArabic() ? 'ابحث عن جهازك' : 'Search for your device' }}
            </h2>
          </div>
        } @else if (units().length === 0 && products().length === 0) {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ 'common.noResults' | translate }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ languageService.isArabic() 
                 ? 'جرب البحث بكلمات مختلفة' 
                 : 'Try searching with different keywords' }}
            </p>
          </div>
        } @else {
          <!-- Units Results -->
          @if (units().length > 0) {
            <div class="mb-12">
              <h2 class="section-title">
                {{ 'nav.devices' | translate }} ({{ units().length }})
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                @for (unit of units(); track unit.id) {
                  <app-unit-card [unit]="unit" />
                }
              </div>
            </div>
          }

          <!-- Products Results -->
          @if (products().length > 0) {
            <div>
              <h2 class="section-title">
                {{ 'nav.accessories' | translate }} ({{ products().length }})
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                @for (product of products(); track product.id) {
                  <app-product-card [product]="product" />
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  languageService = inject(LanguageService);
  private unitService = inject(UnitService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  units = signal<Unit[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    // Check for query param
    const query = this.route.snapshot.queryParamMap.get('q');
    if (query) {
      this.searchQuery = query;
      this.search();
    }
  }

  search(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading.set(true);
    this.hasSearched.set(true);

    // Search units
    this.unitService.searchUnits(this.searchQuery, 1, 20).subscribe(result => {
      this.units.set(result.items);
      this.isLoading.set(false);
    });

    // Search products
    this.productService.searchProducts(this.searchQuery, 1, 20).subscribe(result => {
      this.products.set(result.items);
    });
  }
}
