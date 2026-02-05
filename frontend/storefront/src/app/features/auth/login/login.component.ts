import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ 'auth.login' | translate }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
              {{ languageService.isArabic() 
                 ? 'مرحباً بعودتك!' 
                 : 'Welcome back!' }}
            </p>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
              {{ errorMessage() }}
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.email' | translate }}
              </label>
              <input 
                type="email" 
                [(ngModel)]="email"
                name="email"
                required
                class="input-field"
                [placeholder]="'example@email.com'">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.password' | translate }}
              </label>
              <input 
                type="password" 
                [(ngModel)]="password"
                name="password"
                required
                class="input-field"
                [placeholder]="'••••••••'">
            </div>

            <button 
              type="submit"
              [disabled]="isLoading()"
              class="btn-primary w-full disabled:opacity-50">
              @if (isLoading()) {
                <svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                {{ 'auth.loginButton' | translate }}
              }
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-500 dark:text-gray-400">
              {{ 'auth.noAccount' | translate }}
              <a [routerLink]="['/', languageService.currentLanguage(), 'register']" 
                 class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                {{ 'auth.register' | translate }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const lang = this.route.snapshot.data['language'];
    if (lang) {
      this.languageService.setLanguage(lang, false);
    }
  }

  onSubmit(): void {
    // Validation
    if (!this.email || !this.password) {
      this.errorMessage.set(
        this.languageService.isArabic() 
          ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' 
          : 'Please enter email and password'
      );
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage.set(
        this.languageService.isArabic() 
          ? 'البريد الإلكتروني غير صالح' 
          : 'Invalid email address'
      );
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ 
      email: this.email, 
      password: this.password 
    }).subscribe(response => {
      this.isLoading.set(false);
      
      if (response.success) {
        // Redirect based on user role
        const user = this.authService.currentUser();
        if (user?.role === 'Admin' || user?.role === 'Staff') {
          this.router.navigate(['/', this.languageService.currentLanguage(), 'admin']);
        } else {
          this.router.navigate(['/', this.languageService.currentLanguage()]);
        }
      } else {
        this.errorMessage.set(
          response.message || (this.languageService.isArabic() 
            ? 'فشل تسجيل الدخول. يرجى التحقق من بيانات الدخول' 
            : 'Login failed. Please check your credentials')
        );
      }
    });
  }
}