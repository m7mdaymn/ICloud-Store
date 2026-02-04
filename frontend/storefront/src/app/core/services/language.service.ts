import { Injectable, inject, signal, computed, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Use Injector to lazily get TranslateService to avoid circular dependency
  private injector = inject(Injector);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  private _translateService: TranslateService | null = null;

  private currentLanguageSignal = signal<Language>('ar');
  
  readonly currentLanguage = this.currentLanguageSignal.asReadonly();
  readonly direction = computed<Direction>(() => 
    this.currentLanguageSignal() === 'ar' ? 'rtl' : 'ltr'
  );
  readonly isArabic = computed(() => this.currentLanguageSignal() === 'ar');
  readonly isEnglish = computed(() => this.currentLanguageSignal() === 'en');

  // Lazy getter for TranslateService to break circular dependency
  private get translateService(): TranslateService {
    if (!this._translateService) {
      this._translateService = this.injector.get(TranslateService);
    }
    return this._translateService;
  }

  initializeLanguage(): void {
    // Get language from URL first, then localStorage, then default to 'ar'
    const urlLang = this.getLanguageFromUrl();
    const storedLang = this.getStoredLanguage();
    const lang = urlLang || storedLang || 'ar';
    
    this.setLanguage(lang, false);

    // Listen to route changes to update language
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const urlLanguage = this.getLanguageFromUrl();
      if (urlLanguage && urlLanguage !== this.currentLanguageSignal()) {
        this.setLanguage(urlLanguage, false);
      }
    });
  }

  setLanguage(lang: Language, navigate: boolean = true): void {
    this.currentLanguageSignal.set(lang);
    this.translateService.use(lang);
    this.storeLanguage(lang);
    this.updateDocumentDirection(lang);

    if (navigate) {
      this.navigateToLanguage(lang);
    }
  }

  toggleLanguage(): void {
    const newLang = this.currentLanguageSignal() === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  private getLanguageFromUrl(): Language | null {
    const path = this.router.url.split('/')[1];
    if (path === 'ar' || path === 'en') {
      return path as Language;
    }
    return null;
  }

  private getStoredLanguage(): Language | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('language');
      if (stored === 'ar' || stored === 'en') {
        return stored;
      }
    }
    return null;
  }

  private storeLanguage(lang: Language): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  private updateDocumentDirection(lang: Language): void {
    if (isPlatformBrowser(this.platformId)) {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
    }
  }

  private navigateToLanguage(lang: Language): void {
    const currentUrl = this.router.url;
    const urlParts = currentUrl.split('/');
    
    // Replace the language segment
    if (urlParts[1] === 'ar' || urlParts[1] === 'en') {
      urlParts[1] = lang;
    } else {
      urlParts.splice(1, 0, lang);
    }
    
    const newUrl = urlParts.join('/') || `/${lang}`;
    this.router.navigateByUrl(newUrl);
  }

  // Helper method for templates
  translate(key: string): string {
    return this.translateService.instant(key);
  }

  // Get localized value from an object with ar/en properties
  getLocalized(obj: { ar: string; en: string } | null | undefined): string {
    if (!obj) return '';
    return this.currentLanguageSignal() === 'ar' ? obj.ar : obj.en;
  }
}
