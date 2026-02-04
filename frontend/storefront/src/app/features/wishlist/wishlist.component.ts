import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div class="container-custom">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ 'header.wishlist' | translate }}
          </h1>
        </div>
      </div>

      <div class="container-custom py-8">
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ languageService.isArabic() ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty' }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ languageService.isArabic() 
               ? 'أضف الأجهزة والمنتجات التي تعجبك إلى قائمة المفضلة' 
               : 'Add devices and products you like to your wishlist' }}
          </p>
          <a [routerLink]="['/', languageService.currentLanguage(), 'units']" class="btn-primary inline-block">
            {{ languageService.isArabic() ? 'تصفح الأجهزة' : 'Browse Devices' }}
          </a>
        </div>
      </div>
    </div>
  `
})
export class WishlistComponent implements OnInit {
  languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }
  }
}
