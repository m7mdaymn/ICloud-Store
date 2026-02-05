import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
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
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden" style="margin-top: 60px;">
      <!-- Background Image with Gradient Overlay -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1920&auto=format&fit=crop" 
             alt="iPhone Background" 
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-gray-900/85 to-slate-800/90"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container-custom py-24 lg:py-32">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Badge -->
          <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 text-cyan-400 font-semibold text-sm mb-6 backdrop-blur-sm border border-white/20">
            New Collection 2026
          </span>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {{ 'home.hero.title' | translate }}
            <span class="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {{ 'home.hero.subtitle' | translate }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
               class="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 px-8 py-3.5 text-lg w-full sm:w-auto">
              {{ 'home.hero.cta' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
               class="inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3.5 text-lg w-full sm:w-auto">
              {{ languageService.isArabic() ? 'الإكسسوارات' : 'Accessories' }}
            </a>
          </div>
        </div>
      </div>

      <!-- Wave SVG at Bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                fill="white"/>
        </svg>
      </div>
    </section>

    <!-- Featured Devices -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">{{ 'home.featured' | translate }}</h2>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
             class="text-cyan-500 font-medium hover:underline flex items-center gap-1">
            {{ 'home.viewAll' | translate }}
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        @if (isLoadingUnits()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="aspect-square bg-gray-50 animate-pulse"></div>
                <div class="p-5 space-y-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (unit of featuredUnits(); track unit.id) {
              <app-unit-card [unit]="unit" />
            }
          </div>
        }
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ 'home.categories' | translate }}
          </h2>
          
          <!-- Navigation Buttons -->

            <button (click)="scrollCategories('right')" 
                    class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-900" [class.rotate-180]="!languageService.isArabic()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
                      <div class="flex items-center gap-2">
            <button (click)="scrollCategories('left')" 
                    class="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6 text-gray-900" [class.rotate-180]="!languageService.isArabic()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Slider Container -->
        <div class="relative overflow-hidden">
          <div #categoriesSlider class="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory" 
               style="scrollbar-width: none; -ms-overflow-style: none;">
            @for (category of categories(); track category.id) {
              <a [routerLink]="['/', languageService.currentLanguage(), 'category', category.slug]" 
                 class="group relative overflow-hidden rounded-2xl aspect-[4/3] block flex-shrink-0 w-full md:w-[calc(33.333%-16px)] snap-start">
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors z-10"></div>
                
                <!-- Category Image -->
                @if (category.imageUrl) {
                  <img [src]="category.imageUrl" 
                       [alt]="languageService.isArabic() ? category.nameAr : category.nameEn" 
                       class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                } @else {
                  <!-- Default placeholder image based on category -->
                  <img [src]="getDefaultCategoryImage(category.slug)" 
                       [alt]="languageService.isArabic() ? category.nameAr : category.nameEn" 
                       class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                }
                
                <!-- Content Overlay -->
                <div class="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <h3 class="text-white text-2xl font-bold mb-2 transform translate-y-0 transition-transform duration-300">
                    {{ languageService.isArabic() ? category.nameAr : category.nameEn }}
                  </h3>
                  <div class="flex items-center gap-2 text-white/90 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span class="font-medium">
                      {{ languageService.isArabic() ? 'استكشف' : 'Explore' }}
                    </span>
                    <svg class="w-4 h-4" [class.rotate-180]="languageService.isArabic()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 19-7-7 7-7M19 12H5" />
                    </svg>
                  </div>
                </div>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Devices -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ 'home.latest' | translate }}
          </h2>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
             class="text-cyan-500 font-medium hover:underline flex items-center gap-1">
            {{ 'home.viewAll' | translate }}
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (unit of latestUnits(); track unit.id) {
            <app-unit-card [unit]="unit" />
          }
        </div>
      </div>
    </section>

    <!-- Featured Accessories -->
    @if (featuredProducts().length > 0) {
      <section class="py-16 bg-gray-50">
        <div class="container-custom">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold text-gray-900">{{ 'home.accessories' | translate }}</h2>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
               class="text-cyan-500 font-medium hover:underline flex items-center gap-1">
              {{ 'home.viewAll' | translate }}
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

  @ViewChild('categoriesSlider') categoriesSlider!: ElementRef<HTMLDivElement>;

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
    this.unitService.getFeaturedUnits([]).subscribe(units => {
      this.featuredUnits.set(units);
      this.isLoadingUnits.set(false);
    });

    // Load latest units
    // Load latest units
    this.unitService['getLatestUnits'](8).subscribe((units: Unit[]) => {
      this.latestUnits.set(units);
    });

    // Load featured products
    this.productService.getFeaturedProducts(4)?.subscribe((products: Product[]) => {
      this.featuredProducts.set(products);
    });

    // Load categories
    this.catalogService.getRootCategories().subscribe(categories => {
      this.categories.set(categories);
    });
  }

  scrollCategories(direction: 'left' | 'right'): void {
    if (!this.categoriesSlider) return;

    const slider = this.categoriesSlider.nativeElement;
    const scrollAmount = slider.offsetWidth; // Scroll by container width
    const isRTL = this.languageService.isArabic();

    // Reverse direction for RTL
    const actualDirection = isRTL 
      ? (direction === 'left' ? 'right' : 'left')
      : direction;

    if (actualDirection === 'left') {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  getDefaultCategoryImage(slug: string): string {
    // Map category slugs to default images
    const categoryImages: { [key: string]: string } = {
      'smartphones': 'https://images.unsplash.com/photo-1592750475338-74b7b2191392?auto=format&fit=crop&q=80&w=500',
      'phones': 'https://images.unsplash.com/photo-1592750475338-74b7b2191392?auto=format&fit=crop&q=80&w=500',
      'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500',
      'accessories': 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=500',
      'tablets': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80&w=500',
      'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500',
      'watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500',
      'cameras': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=500'
    };

    return categoryImages[slug] || 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=500';
  }
}