import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ 'auth.register' | translate }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400">
              {{ languageService.isArabic() 
                 ? 'أنشئ حسابك الآن' 
                 : 'Create your account' }}
            </p>
          </div>

          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
              {{ errorMessage() }}
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ languageService.isArabic() ? 'الاسم الكامل' : 'Full Name' }}
              </label>
              <input 
                type="text" 
                [(ngModel)]="fullName"
                name="fullName"
                required
                class="input-field"
                [placeholder]="languageService.isArabic() ? 'أحمد محمد' : 'Ahmed Mohamed'">
            </div>

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
                placeholder="example@email.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.phone' | translate }}
              </label>
              <input 
                type="tel" 
                [(ngModel)]="phoneNumber"
                name="phoneNumber"
                required
                class="input-field"
                placeholder="+20 100 000 0000">
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
                placeholder="••••••••">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'auth.confirmPassword' | translate }}
              </label>
              <input 
                type="password" 
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                class="input-field"
                placeholder="••••••••">
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
                {{ 'auth.registerButton' | translate }}
              }
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-500 dark:text-gray-400">
              {{ 'auth.hasAccount' | translate }}
              <a [routerLink]="['/', languageService.currentLanguage(), 'login']" 
                 class="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                {{ 'auth.login' | translate }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
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
    if (!this.fullName || !this.email || !this.phoneNumber || !this.password) {
      this.errorMessage.set(
        this.languageService.isArabic() 
          ? 'يرجى ملء جميع الحقول المطلوبة' 
          : 'Please fill in all required fields'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set(
        this.languageService.isArabic() 
          ? 'كلمتا المرور غير متطابقتين' 
          : 'Passwords do not match'
      );
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set(
        this.languageService.isArabic() 
          ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' 
          : 'Password must be at least 6 characters'
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

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe(response => {
      this.isLoading.set(false);
      if (response.success) {
        this.router.navigate(['/', this.languageService.currentLanguage()]);
      } else {
        this.errorMessage.set(
          response.message || (this.languageService.isArabic() 
            ? 'فشل إنشاء الحساب' 
            : 'Registration failed')
        );
      }
    });
  }
}