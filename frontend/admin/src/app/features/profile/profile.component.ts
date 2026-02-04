import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الملف الشخصي</h1>
        <p class="text-gray-600 dark:text-gray-400">إدارة بيانات الحساب</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="admin-card text-center">
          <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {{ userInitials() }}
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ userName() }}</h2>
          <p class="text-gray-500 dark:text-gray-400">{{ userEmail() }}</p>
          <span class="inline-block mt-2 badge badge-info">{{ userRole() }}</span>
        </div>
        
        <!-- Edit Form -->
        <div class="lg:col-span-2 space-y-6">
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">تعديل البيانات</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">الاسم الكامل</label>
                <input type="text" [(ngModel)]="fullName" class="form-input"/>
              </div>
              <div>
                <label class="form-label">رقم الهاتف</label>
                <input type="tel" [(ngModel)]="phoneNumber" class="form-input" dir="ltr"/>
              </div>
            </div>
            <div>
              <label class="form-label">البريد الإلكتروني</label>
              <input type="email" [value]="userEmail()" class="form-input bg-gray-100" readonly dir="ltr"/>
            </div>
          </div>
          
          <div class="admin-card space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">تغيير كلمة المرور</h2>
            <div>
              <label class="form-label">كلمة المرور الحالية</label>
              <input type="password" [(ngModel)]="currentPassword" class="form-input"/>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">كلمة المرور الجديدة</label>
                <input type="password" [(ngModel)]="newPassword" class="form-input"/>
              </div>
              <div>
                <label class="form-label">تأكيد كلمة المرور</label>
                <input type="password" [(ngModel)]="confirmPassword" class="form-input"/>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end gap-3">
            <button class="btn-secondary">إلغاء</button>
            <button class="btn-primary">حفظ التغييرات</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  fullName = '';
  phoneNumber = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private authService: AuthService) {
    const user = this.authService.currentUser();
    if (user) {
      this.fullName = user.fullName;
      this.phoneNumber = user.phoneNumber || '';
    }
  }

  userName = signal<string>(this.authService.currentUser()?.fullName || '');
  userEmail = signal<string>(this.authService.currentUser()?.email || '');
  userRole = signal<string>(this.authService.currentUser()?.role === 'Admin' ? 'مدير' : 'موظف');
  userInitials = signal<string>(this.authService.currentUser()?.fullName?.charAt(0) || 'م');
}
