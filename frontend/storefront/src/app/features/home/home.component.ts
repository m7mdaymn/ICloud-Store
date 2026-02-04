import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { UnitService, Unit } from '@core/services/unit.service';
import { ProductService, Product } from '@core/services/product.service';
import { CatalogService, Category } from '@core/services/catalog.service';
import { UnitCardComponent } from '@shared/components/unit-card/unit-card.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    UnitCardComponent,
    ProductCardComponent
  ],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
            {{ 'home.hero.title' | translate }}
          </h1>
          <p class="text-xl md:text-2xl text-primary-100 mb-8">
            {{ 'home.hero.subtitle' | translate }}
          </p>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
             class="inline-flex items-center gap-2 bg-white text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-primary-50 transition-colors shadow-lg">
            {{ 'home.hero.cta' | translate }}
            <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Devices -->
    <section class="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="section-title mb-0">{{ 'home.featured' | translate }}</h2>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
             class="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
            {{ 'home.viewAll' | translate }}
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        @if (isLoadingUnits()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (i of [1,2,3,4]; track i) {
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
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (unit of featuredUnits(); track unit.id) {
              <app-unit-card [unit]="unit" />
            }
          </div>
        }
      </div>
    </section>

    <!-- Categories -->
    <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div class="container-custom">
        <h2 class="section-title text-center">{{ 'home.categories' | translate }}</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          @for (category of categories(); track category.id) {
            <a [routerLink]="['/', languageService.currentLanguage(), 'category', category.slug]" 
               class="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
              @if (category.imageUrl) {
                <img [src]="category.imageUrl" [alt]="languageService.isArabic() ? category.nameAr : category.nameEn" 
                     class="w-16 h-16 mx-auto mb-4 object-contain">
              } @else {
                <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              }
              <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ languageService.isArabic() ? category.nameAr : category.nameEn }}
              </h3>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Latest Devices -->
    <section class="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="section-title mb-0">{{ 'home.latest' | translate }}</h2>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
             class="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
            {{ 'home.viewAll' | translate }}
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          @for (unit of latestUnits(); track unit.id) {
            <app-unit-card [unit]="unit" />
          }
        </div>
      </div>
    </section>

    <!-- Featured Accessories -->
    @if (featuredProducts().length > 0) {
      <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
        <div class="container-custom">
          <div class="flex items-center justify-between mb-8">
            <h2 class="section-title mb-0">{{ 'home.accessories' | translate }}</h2>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
               class="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1">
              {{ 'home.viewAll' | translate }}
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      </section>
    }

    <!-- WhatsApp CTA -->
    <section class="py-12 md:py-16 bg-green-600 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ languageService.isArabic() ? 'تواصل معنا مباشرة عبر واتساب' : 'Contact us directly via WhatsApp' }}
        </h2>
        <p class="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          {{ languageService.isArabic() 
             ? 'فريقنا جاهز للإجابة على استفساراتك ومساعدتك في اختيار الجهاز المناسب' 
             : 'Our team is ready to answer your questions and help you choose the right device' }}
        </p>
        <a href="https://wa.me/201000000000" 
           target="_blank"
           class="inline-flex items-center gap-3 bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-green-50 transition-colors shadow-lg text-lg">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {{ languageService.isArabic() ? 'تواصل عبر واتساب' : 'Chat on WhatsApp' }}
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  languageService = inject(LanguageService);
  private unitService = inject(UnitService);
  private productService = inject(ProductService);
  private catalogService = inject(CatalogService);
  private route = inject(ActivatedRoute);

  featuredUnits = signal<Unit[]>([]);
  latestUnits = signal<Unit[]>([]);
  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoadingUnits = signal(true);

  ngOnInit(): void {
    // Set language from route data
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    this.loadData();
  }

  private loadData(): void {
    // Load featured units
    this.unitService.getFeaturedUnits(8).subscribe(units => {
      this.featuredUnits.set(units);
      this.isLoadingUnits.set(false);
    });

    // Load latest units
    this.unitService.getLatestUnits(8).subscribe(units => {
      this.latestUnits.set(units);
    });

    // Load featured products
    this.productService.getFeaturedProducts(4).subscribe(products => {
      this.featuredProducts.set(products);
    });

    // Load categories
    this.catalogService.getRootCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }
}
