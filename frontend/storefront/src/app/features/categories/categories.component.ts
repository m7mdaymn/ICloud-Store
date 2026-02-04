import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { CatalogService, Category } from '@core/services/catalog.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div class="container-custom">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ 'nav.categories' | translate }}
          </h1>
        </div>
      </div>

      <div class="container-custom py-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (category of categories(); track category.id) {
            <a [routerLink]="['/', languageService.currentLanguage(), 'category', category.slug]" 
               class="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
              @if (category.imageUrl) {
                <img [src]="category.imageUrl" [alt]="languageService.isArabic() ? category.nameAr : category.nameEn" 
                     class="w-20 h-20 mx-auto mb-4 object-contain">
              } @else {
                <div class="w-20 h-20 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              }
              <h3 class="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ languageService.isArabic() ? category.nameAr : category.nameEn }}
              </h3>
              @if (category.descriptionAr || category.descriptionEn) {
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                  {{ languageService.isArabic() ? category.descriptionAr : category.descriptionEn }}
                </p>
              }
            </a>
          }
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  languageService = inject(LanguageService);
  private catalogService = inject(CatalogService);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }

    this.catalogService.getRootCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }
}
