import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private currentThemeSignal = signal<Theme>('light');

  readonly currentTheme = this.currentThemeSignal.asReadonly();
  readonly isDark = computed(() => this.currentThemeSignal() === 'dark');
  readonly isLight = computed(() => this.currentThemeSignal() === 'light');

  initializeTheme(): void {
    const storedTheme = this.getStoredTheme();
    const prefersDark = this.getSystemPreference();
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.currentThemeSignal.set(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  toggleTheme(): void {
    const newTheme = this.currentThemeSignal() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private getStoredTheme(): Theme | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return null;
  }

  private storeTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
  }

  private getSystemPreference(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  private applyTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}
