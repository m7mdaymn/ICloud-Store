import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <aside 
      class="fixed right-0 top-0 h-full bg-slate-800 text-white transition-all duration-300 z-50 shadow-xl"
      [class.w-64]="!isCollapsed"
      [class.w-20]="isCollapsed"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-slate-700">
        @if (!isCollapsed) {
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="font-bold text-lg">آي كلاود ستور</span>
          </div>
        } @else {
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
        }
      </div>
      
      <!-- Navigation -->
      <nav class="mt-4 px-3">
        @for (item of visibleMenuItems(); track item.route) {
          <a 
            [routerLink]="item.route"
            routerLinkActive="bg-blue-600 text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 rounded-lg mb-1"
            [class.justify-center]="isCollapsed"
            [title]="isCollapsed ? item.label : ''"
          >
            <span [innerHTML]="item.icon" class="w-6 h-6 flex-shrink-0"></span>
            @if (!isCollapsed) {
              <span class="font-medium">{{ item.label }}</span>
            }
          </a>
        }
      </nav>
      
      <!-- Collapse Button -->
      <div class="absolute bottom-20 left-0 right-0 px-3">
        <button 
          (click)="toggleCollapse.emit()"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors duration-200 rounded-lg"
        >
          <svg 
            class="w-5 h-5 transition-transform duration-300" 
            [class.-scale-x-100]="isCollapsed"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
          @if (!isCollapsed) {
            <span>تصغير</span>
          }
        </button>
      </div>
      
      <!-- User Info -->
      <div class="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700">
        <div class="flex items-center gap-3" [class.justify-center]="isCollapsed">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ userInitials() }}
          </div>
          @if (!isCollapsed) {
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ userName() }}</p>
              <p class="text-xs text-gray-400">{{ userRole() }}</p>
            </div>
          }
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  menuItems: MenuItem[] = [
    {
      label: 'لوحة التحكم',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
      route: '/dashboard'
    },
    {
      label: 'الأقسام',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
      route: '/categories'
    },
    {
      label: 'العلامات التجارية',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>',
      route: '/brands'
    },
    {
      label: 'الوحدات (الأجهزة)',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      route: '/units'
    },
    {
      label: 'الإكسسوارات',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      route: '/products'
    },
    {
      label: 'أقسام الصفحة الرئيسية',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>',
      route: '/home-sections'
    },
    {
      label: 'طلبات العملاء',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
      route: '/leads'
    },
    {
      label: 'الإعدادات',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      route: '/settings',
      adminOnly: true
    }
  ];

  visibleMenuItems = signal<MenuItem[]>(
    this.authService.isAdmin() 
      ? this.menuItems 
      : this.menuItems.filter(item => !item.adminOnly)
  );

  userName = signal<string>(this.authService.currentUser()?.fullName || 'مستخدم');
  userRole = signal<string>(
    this.authService.currentUser()?.role === 'Admin' ? 'مدير' : 'موظف'
  );
  userInitials = signal<string>(
    this.authService.currentUser()?.fullName?.charAt(0) || 'م'
  );
}
