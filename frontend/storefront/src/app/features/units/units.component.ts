import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { UnitService, Unit, UnitFilter, PagedResult } from '@core/services/unit.service';
import { CatalogService, Category, Brand } from '@core/services/catalog.service';
import { UnitCardComponent } from '@shared/components/unit-card/unit-card.component';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, TranslateModule, UnitCardComponent],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div class="container-custom">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ 'nav.devices' | translate }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            {{ languageService.isArabic() 
               ? 'تصفح مجموعتنا من أجهزة أبل وسامسونج الأصلية' 
               : 'Browse our collection of original Apple and Samsung devices' }}
          </p>
        </div>
      </div>

      <div class="container-custom py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-semibold text-gray-900 dark:text-white">
                  {{ 'filters.title' | translate }}
                </h2>
                <button 
                  (click)="clearFilters()"
                  class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  {{ 'filters.clear' | translate }}
                </button>
              </div>

              <!-- Condition Filter -->
              <div class="mb-6">
                <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ 'filters.condition' | translate }}
                </h3>
                <div class="space-y-2">
                  @for (condition of conditions; track condition.value) {
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="condition" 
                        [value]="condition.value"
                        [checked]="filter().condition === condition.value"
                        (change)="onConditionChange(condition.value)"
                        class="text-primary-600 focus:ring-primary-500">
                      <span class="text-gray-600 dark:text-gray-400">
                        {{ languageService.isArabic() ? condition.labelAr : condition.labelEn }}
                      </span>
                    </label>
                  }
                </div>
              </div>

              <!-- Category Filter -->
              <div class="mb-6">
                <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ 'filters.category' | translate }}
                </h3>
                <select 
                  (change)="onCategoryChange($event)"
                  class="input-field text-sm">
                  <option value="">{{ languageService.isArabic() ? 'الكل' : 'All' }}</option>
                  @for (category of categories(); track category.id) {
                    <option [value]="category.id" [selected]="filter().categoryId === category.id">
                      {{ languageService.isArabic() ? category.nameAr : category.nameEn }}
                    </option>
                  }
                </select>
              </div>

              <!-- Brand Filter -->
              <div class="mb-6">
                <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ 'filters.brand' | translate }}
                </h3>
                <select 
                  (change)="onBrandChange($event)"
                  class="input-field text-sm">
                  <option value="">{{ languageService.isArabic() ? 'الكل' : 'All' }}</option>
                  @for (brand of brands(); track brand.id) {
                    <option [value]="brand.id" [selected]="filter().brandId === brand.id">
                      {{ languageService.isArabic() ? brand.nameAr : brand.nameEn }}
                    </option>
                  }
                </select>
              </div>

              <!-- Price Range -->
              <div class="mb-6">
                <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {{ 'filters.priceRange' | translate }}
                </h3>
                <div class="flex gap-2">
                  <input 
                    type="number" 
                    [placeholder]="languageService.isArabic() ? 'من' : 'Min'"
                    (change)="onMinPriceChange($event)"
                    class="input-field text-sm flex-1">
                  <input 
                    type="number" 
                    [placeholder]="languageService.isArabic() ? 'إلى' : 'Max'"
                    (change)="onMaxPriceChange($event)"
                    class="input-field text-sm flex-1">
                </div>
              </div>
            </div>
          </aside>

          <!-- Results Grid -->
          <div class="flex-1">
            <!-- Results Info -->
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                {{ result().totalCount }} {{ languageService.isArabic() ? 'نتيجة' : 'results' }}
              </p>
              <select 
                (change)="onSortChange($event)"
                class="input-field w-auto text-sm">
                <option value="createdAt-desc">{{ languageService.isArabic() ? 'الأحدث' : 'Newest' }}</option>
                <option value="price-asc">{{ languageService.isArabic() ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' }}</option>
                <option value="price-desc">{{ languageService.isArabic() ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' }}</option>
              </select>
            </div>

            @if (isLoading()) {
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                @for (i of [1,2,3,4,5,6]; track i) {
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ 'common.noResults' | translate }}
                </h3>
                <button 
                  (click)="clearFilters()"
                  class="btn-primary">
                  {{ 'filters.clear' | translate }}
                </button>
              </div>
            } @else {
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                @for (unit of result().items; track unit.id) {
                  <app-unit-card [unit]="unit" />
                }
              </div>

              <!-- Pagination -->
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
      </div>
    </div>
  `
})
export class UnitsComponent implements OnInit {
  languageService = inject(LanguageService);
  private unitService = inject(UnitService);
  private catalogService = inject(CatalogService);
  private route = inject(ActivatedRoute);

  filter = signal<UnitFilter>({ page: 1, pageSize: 12 });
  result = signal<PagedResult<Unit>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  isLoading = signal(true);

  conditions = [
    { value: '', labelAr: 'الكل', labelEn: 'All' },
    { value: 'New', labelAr: 'جديد', labelEn: 'New' },
    { value: 'Used', labelAr: 'مستعمل', labelEn: 'Used' },
    { value: 'Refurbished', labelAr: 'مجدد', labelEn: 'Refurbished' }
  ];

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    this.loadFilters();
    this.loadUnits();
  }

  private loadFilters(): void {
    this.catalogService.getCategories().subscribe(cats => this.categories.set(cats));
    this.catalogService.getBrands().subscribe(brands => this.brands.set(brands));
  }

  private loadUnits(): void {
    this.isLoading.set(true);
    this.unitService.getUnits(this.filter()).subscribe(result => {
      this.result.set(result);
      this.isLoading.set(false);
    });
  }

  onConditionChange(condition: string): void {
    this.filter.update(f => ({ ...f, condition: condition || undefined, page: 1 }));
    this.loadUnits();
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.update(f => ({ ...f, categoryId: value ? +value : undefined, page: 1 }));
    this.loadUnits();
  }

  onBrandChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filter.update(f => ({ ...f, brandId: value ? +value : undefined, page: 1 }));
    this.loadUnits();
  }

  onMinPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filter.update(f => ({ ...f, minPrice: value ? +value : undefined, page: 1 }));
    this.loadUnits();
  }

  onMaxPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filter.update(f => ({ ...f, maxPrice: value ? +value : undefined, page: 1 }));
    this.loadUnits();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const [sortBy, sortDir] = value.split('-');
    this.filter.update(f => ({ ...f, sortBy, sortDesc: sortDir === 'desc', page: 1 }));
    this.loadUnits();
  }

  goToPage(page: number): void {
    this.filter.update(f => ({ ...f, page }));
    this.loadUnits();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filter.set({ page: 1, pageSize: 12 });
    this.loadUnits();
  }
}
