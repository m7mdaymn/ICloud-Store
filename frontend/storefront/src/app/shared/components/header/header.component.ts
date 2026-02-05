import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { ThemeService } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { CatalogService, Category } from '@core/services/catalog.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            [class.header-scrolled]="isScrolled()">
      <!-- Top Bar -->
      <div class="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm transition-all duration-300"
           [class.py-2]="!isScrolled()"
           [class.py-1]="isScrolled()">
        <div class="container-custom flex justify-between items-center">
          <div class="flex items-center gap-4">
            <a href="tel:+201000000000" class="flex items-center gap-1 hover:text-cyan-100 transition-colors">
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
              class="flex items-center gap-1 hover:text-cyan-100 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>{{ languageService.isArabic() ? 'English' : 'عربي' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Header -->
      <div class="container-custom transition-all duration-300"
           [class.py-4]="!isScrolled()"
           [class.py-2]="isScrolled()">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo -->
          <a [routerLink]="['/', languageService.currentLanguage()]" class="flex-shrink-0">
            <h1 class="font-bold text-cyan-600 transition-all duration-300"
                [class.text-2xl]="!isScrolled()"
                [class.text-xl]="isScrolled()">
              {{ languageService.isArabic() ? 'آي كلاود ستور' : 'iCloud Store' }}
            </h1>
          </a>

          <!-- Search Bar (Desktop) -->
          <div class="hidden md:flex flex-1 max-w-xl">
            <div class="relative w-full">
              <input 
                type="text" 
                [placeholder]="'header.search' | translate"
                class="w-full px-4 py-2 pr-12 rtl:pr-4 rtl:pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                (keyup.enter)="onSearch($event)">
              <button class="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-cyan-600 transition-colors">
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
               class="relative p-2 text-gray-600 hover:text-cyan-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </a>

            <!-- User Menu -->
            @if (authService.isAuthenticated()) {
              <div class="relative">
                <button 
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 p-2 text-gray-600 hover:text-cyan-600 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                @if (userMenuOpen()) {
                  <div class="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 animate-fadeIn border border-gray-200">
                    <span class="block px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      <!-- {{ authService.currentUser()?.displayNameAr }} -->
                    </span>
                    <button 
                      (click)="logout()"
                      class="w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors">
                      {{ 'header.logout' | translate }}
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a [routerLink]="['/', languageService.currentLanguage(), 'login']" 
                 class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm">
                {{ 'header.login' | translate }}
              </a>
            }

            <!-- Mobile Menu Toggle -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:block border-t border-gray-200 bg-gray-50">
        <div class="container-custom">
          <ul class="flex items-center gap-6 transition-all duration-300"
              [class.py-3]="!isScrolled()"
              [class.py-2]="isScrolled()">
            <li>
              <a [routerLink]="['/', languageService.currentLanguage()]" 
                 routerLinkActive="text-cyan-600"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                {{ 'nav.home' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
                 routerLinkActive="text-cyan-600"
                 class="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                {{ 'nav.devices' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
                 routerLinkActive="text-cyan-600"
                 class="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                {{ 'nav.accessories' | translate }}
              </a>
            </li>
            <li>
              <a [routerLink]="['/', languageService.currentLanguage(), 'categories']" 
                 routerLinkActive="text-cyan-600"
                 class="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                {{ 'nav.categories' | translate }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <!-- Mobile Search -->
          <div class="p-4 border-b border-gray-200">
            <input 
              type="text" 
              [placeholder]="'header.search' | translate"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              (keyup.enter)="onSearch($event)">
          </div>
          
          <nav class="py-2">
            <a [routerLink]="['/', languageService.currentLanguage()]" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-cyan-50 text-cyan-600"
               [routerLinkActiveOptions]="{exact: true}"
               class="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              {{ 'nav.home' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'units']" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-cyan-50 text-cyan-600"
               class="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              {{ 'nav.devices' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'accessories']" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-cyan-50 text-cyan-600"
               class="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              {{ 'nav.accessories' | translate }}
            </a>
            <a [routerLink]="['/', languageService.currentLanguage(), 'categories']" 
               (click)="closeMobileMenu()"
               routerLinkActive="bg-cyan-50 text-cyan-600"
               class="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
              {{ 'nav.categories' | translate }}
            </a>
          </nav>
        </div>
      }
    </header>
  `,
  styles: [`
    /* Header shadow when scrolled */
    .header-scrolled {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Fade in animation for dropdowns */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }

    /* Smooth scroll behavior */
    :host {
      display: block;
    }
  `],
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class HeaderComponent {
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);
  isScrolled = signal(false);

  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

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