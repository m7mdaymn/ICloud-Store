import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { CatalogService, Category } from '@core/services/catalog.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <!-- Top Bar -->
      <div class="bg-primary-600 text-white text-sm py-2">
        <div class="container-custom flex justify-between items-center">
          <div class="flex items-center gap-4">
            <a href="tel:+201000000000" class="flex items-center gap-1 hover:text-primary-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+20 100 000 0000</span>
            </a>
          </div>
          <div class="flex items-center gap-4">
            <!-- Language Toggle -->
            <button 
              (click)="toggleLanguage()" 
              class="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{{ languageService.isArabic() ? 'English' : 'عربي' }}</span>
            </button>
            
            <!-- Theme Toggle -->
            <button 
              (click)="toggleTheme()" 
              class="flex items-center gap-1 hover:text-primary-200 transition-colors">
              @if (themeService.isDark()) {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            </button>
          </div>
        </div>
      </div>

      <!-- Main Header -->
      <div class="container-custom py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo -->
          <a [routerLink]="['/', languageService.currentLanguage()]" class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {{ languageService.isArabic() ? 'آي كلاود ستور' : 'iCloud Store' }}
            </h1>
          </a>

          <!-- Search Bar (Desktop) -->
          <div class="hidden md:flex flex-1 max-w-xl">
            <div class="relative w-full">
              <input 
                type="text" 
                [placeholder]="'header.search' | translate"
                class="input-field pr-12 rtl:pr-4 rtl:pl-12"
                (keyup.enter)="onSearch($event)">
              <button class="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-primary-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Wishlist -->
            <a [routerLink]="['/', languageService.currentLanguage(), 'wishlist']" 
               class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </a>

            <!-- User Menu -->
            @if (authService.isAuthenticated()) {
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                @if (userMenuOpen()) {
                  <div class="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 animate-fadeIn">
                    <span class="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                      {{ authService.currentUser()?.displayNameAr }}
                    </span>
                    <button 
                      (click)="logout()"
                      class="w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {{ 'header.logout' | translate }}
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a [routerLink]="['/', languageService.currentLanguage(), 'login']" 
                 class="btn-primary text-sm">
                {{ 'header.login' | translate }}
              </a>
            }

            <!-- Mobile Menu Toggle -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-600 dark:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:block border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="container-custom">
          <ul class="flex items-center gap-6 py-3">
            <li>
              <a [routerLink]="['/', languageService.currentLanguage()]" 
                 class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                {{ 'nav.home' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
                 class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                {{ 'nav.devices' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
                 class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                {{ 'nav.accessories' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'categories']" 
                 class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                {{ 'nav.categories' | translate }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 animate-fadeIn">
          <!-- Mobile Search -->
          <div class="p-4 border-b dark:border-gray-700">
            <input 
              type="text" 
              [placeholder]="'header.search' | translate"
              class="input-field w-full"
              (keyup.enter)="onSearch($event)">
          </div>
          
          <nav class="py-2">
            <a [routerLink]="['/', languageService.currentLanguage()]" 
               (click)="closeMobileMenu()"
               class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {{ 'nav.home' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
               (click)="closeMobileMenu()"
               class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {{ 'nav.devices' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
               (click)="closeMobileMenu()"
               class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {{ 'nav.accessories' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'categories']" 
               (click)="closeMobileMenu()"
               class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {{ 'nav.categories' | translate }}
            </a>
          </nav>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen.set(false);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    if (query) {
      // Navigate to search page
      window.location.href = `/${this.languageService.currentLanguage()}/search?q=${encodeURIComponent(query)}`;
    }
  }
}
