import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">آي كلاود ستور</h1>
          <p class="text-gray-400">لوحة التحكم</p>
        </div>
        
        <!-- Login Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">تسجيل الدخول</h2>
          
          <!-- Error Message -->
          @if (error()) {
            <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error() }}</p>
            </div>
          }
          
          <form (ngSubmit)="login()" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="form-label">البريد الإلكتروني</label>
              <div class="relative">
                <input 
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  class="form-input pr-10"
                  placeholder="admin@icloudstore.eg"
                  required
                  [disabled]="isLoading()"
                />
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
            </div>
            
            <!-- Password -->
            <div>
              <label class="form-label">كلمة المرور</label>
              <div class="relative">
                <input 
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  class="form-input pr-10 pl-10"
                  placeholder="••••••••"
                  required
                  [disabled]="isLoading()"
                />
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <button 
                  type="button"
                  (click)="togglePassword()"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  @if (showPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit"
              class="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>جاري تسجيل الدخول...</span>
              } @else {
                <span>تسجيل الدخول</span>
              }
            </button>
          </form>
          
          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">بيانات تجريبية:</p>
            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>مدير:</strong> admin&#64;icloudstore.eg / Admin&#64;123</p>
              <p><strong>موظف:</strong> staff&#64;icloudstore.eg / Staff&#64;123</p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <p class="text-center text-gray-500 text-sm mt-6">
          © {{ currentYear }} آي كلاود ستور - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = signal<boolean>(false);
  
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.getToken() && !this.authService.isTokenExpired()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.error.set('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // response.data is AuthResponseDto with direct role field
          const authData = response.data;
          const role = authData.role || 'Customer';
          
          if (role === 'Admin' || role === 'Staff') {
            this.router.navigate(['/dashboard']);
          } else {
            this.error.set('ليس لديك صلاحية للوصول إلى لوحة التحكم');
            this.authService.logout();
          }
        } else {
          this.error.set(response.message || 'فشل تسجيل الدخول');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'بيانات الدخول غير صحيحة');
        this.isLoading.set(false);
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
